"use client";

import React, { useState, KeyboardEvent, ChangeEvent, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/Icons";
import { Textarea } from "@/components/ui/textarea";
import { auth, db } from "@/lib/firebase/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "@/components/ui/use-toast";

interface UserSession {
  docid: string;
  name: string;
  messages: string[];
  created_at: string;
}

const Page: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const params = useParams();
  const clientId = params.client;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const sessions = await getUserSessions();
        setUserSessions(sessions);
      }
    });
    return () => unsubscribe();
  }, []);

  const getUserSessions = async (): Promise<UserSession[]> => {
    try {
      const authUser = auth.currentUser;

      if (!authUser) {
        console.error("User is not authenticated");
        return [];
      }

      const q = query(
        collection(db, `users/${authUser.uid}/clients/${clientId}/chats`)
      );

      const sessionQuerySnapshot = await getDocs(q);
      return sessionQuerySnapshot.docs.map((doc) => ({
        ...doc.data(),
        docid: doc.id,
      })) as UserSession[];
    } catch (error) {
      console.error("Error retrieving sessions: ", error);
      return [];
    }
  };

  const handleKeyPress = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    try {
      const authUser = auth.currentUser;

      if (!authUser) {
        console.log("User is not authenticated");
        return;
      }

      if (!message.trim()) {
        console.log("Message cannot be empty");
        return;
      }

      if (sessionId) {
        // update existing session
        await updateDoc(
          doc(db, `users/${authUser.uid}/clients/${clientId}/chats`, sessionId),
          {
            messages: [
              ...userSessions.filter(
                (session) => session.docid === sessionId
              )[0].messages,
              message,
            ],
          }
        );
        const session = await getUserSessions();
        setUserSessions(session);
        setMessage("");
        // try {
        //   return fetch("/api/chat", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `Bearer ${await authUser?.getIdToken()}`,
        //     },
        //     body: JSON.stringify({
        //       client_id: clientId,
        //       user_message: message,
        //       session_id: sessionId,
        //     }),
        //   }).then(async (response) => {
        //     if (response.status === 200) {
        //       const session = await getUserSessions();
        //       setUserSessions(session);
        //       setMessage("");
        //     }
        //   });
        // } catch (error) {
        //   console.error("Error sending message");
        // }
      } else {
        createNewSession();
        // try {
        //   return fetch("/api/chat", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `Bearer ${await authUser?.getIdToken()}`,
        //     },
        //     body: JSON.stringify({
        //       client_id: clientId,
        //       user_message: message,
        //       session_id: sessionId,
        //     }),
        //   }).then(async (response) => {
        //     if (response.status === 200) {
        //       const session = await getUserSessions();
        //       setUserSessions(session);
        //       setMessage("");
        //     }
        //   });
        // } catch (error) {
        //   console.error("Error sending message");
        // }
      }

      const sessions = await getUserSessions();
      setUserSessions(sessions);
      setMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const createNewSession = async () => {
    try {
      const authUser = auth.currentUser;
      if (!authUser) {
        console.error("User is not authenticated");
        return;
      }

      const newSession = await addDoc(
        collection(db, `users/${authUser.uid}/clients/${clientId}/chats`),
        {
          name: `${authUser.displayName}`,
          created_at: Timestamp.now(),
          messages: [],
        }
      );

      const sessions = await getUserSessions();
      setUserSessions(sessions);
      setMessage("");
      setSessionId(newSession.id);
    } catch (error) {
      console.log("Error creating new session");
    }
  };

  const renderMessages = () => {
    if (sessionId) {
      const session = userSessions.find(
        (session) => session.docid === sessionId
      );
      console.log(session);
      if (session) {
        return session.messages.map((message, index) => (
          <div
            key={index}
            className={`rounded-[30px] p-5 max-w-[90%] mb-5 ${
              message === session.messages[0] ? "self-start" : "self-end"
            }`}
          >
            {message}
          </div>
        ));
      }
    } else {
      return null;
    }
  };

  return (
    <div className="grid w-full grid-cols-[1fr_300px] overflow-hidden gap-10">
      <div className="w-full bg-[#DDDDDD] rounded-[30px] p-5 flex flex-col justify-between h-[83vh] py-10 bg-opacity-25">
        <div className="flex-1 overflow-auto max-h-full">
          <ScrollArea className="h-full flex flex-col w-full">
            {renderMessages() || (
              <div>No messages found start a new session</div>
            )}
          </ScrollArea>
        </div>
        <div className="flex-none">
          <div className="flex gap-5 bg-white rounded-[30px] py-1 px-5 items-center">
            <Textarea
              rows={1}
              placeholder="Type your message here."
              value={message}
              onChange={handleMessageChange}
              onKeyDown={handleKeyPress}
              className="outline-none focus:outline-none shadow-none border-none font-montserrat ring-[0px] focus:ring-0 ring-white"
            />
            <Button
              variant="outline"
              className="shadow-none border-none bg-transparent self-end"
              onClick={handleSendMessage}
            >
              <Icons.Send />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#DDDDDD] rounded-[30px] p-5 flex flex-col h-[83vh] bg-opacity-25">
        <div
          onClick={() => {
            createNewSession();
          }}
          className=" rounded-[30px] p-5 mb-5 self-start bg-opacity-25 cursor-pointer"
        >
          Create a new session
        </div>
        <ScrollArea className="h-full flex flex-col w-full">
          {userSessions.map((userSession) => (
            <div
              key={userSession.docid}
              className="bg-[#CDCDCD] rounded-[30px] p-5 mb-5 self-start bg-opacity-25"
              onClick={() => setSessionId(userSession.docid)}
            >
              {userSession.docid}
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Page;
