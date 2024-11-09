"use client";

import React, {
  useState,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  UIEvent,
} from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { EosIconsThreeDotsLoading, Icons } from "@/components/ui/Icons";
import { Textarea } from "@/components/ui/textarea";
import { auth, db } from "@/lib/firebase/firebase";
import ReactMarkdown from "react-markdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  addDoc,
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  DocumentSnapshot,
  orderBy,
  updateDoc,
  doc,
  Timestamp,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "@/components/ui/use-toast";
import { CheckIcon } from "lucide-react";

interface ChatMessage {
  _byteString: {
    binaryString: string;
  };
}

interface UserSession {
  docid: string;
  name: string;
  sessionname: string;
  sessionId: string;
  created_at: string;
}

const Page: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [userSessionMessages, setUserSessionMessages] = useState<
    ChatMessage[] | null
  >(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileloading, setFileloading] = useState<boolean>(false);
  const [endReached, setEndReached] = useState<boolean>(false);
  const params = useParams();
  const clientId = params.client;
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editedSessionName, setEditedSessionName] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const sessions = await getUserSessions();
        setUserSessions(sessions);
      }
    });
    return () => unsubscribe();
  }, []);

  const getUserSessions = async (
    lastDoc: DocumentSnapshot | null = null
  ): Promise<UserSession[]> => {
    try {
      const authUser = auth.currentUser;

      if (!authUser) {
        console.error("User is not authenticated");
        return [];
      }

      let q = query(
        collection(
          db,
          `users/${authUser.uid}/clients/${clientId}/chatsMetadata`
        ),
        orderBy("created_at", "desc"),
        limit(10)
      );

      if (lastDoc) {
        q = query(
          collection(
            db,
            `users/${authUser.uid}/clients/${clientId}/chatsMetadata`
          ),
          orderBy("created_at", "desc"),
          startAfter(lastDoc),
          limit(10)
        );
      }

      const sessionQuerySnapshot = await getDocs(q);

      if (sessionQuerySnapshot.empty) {
        setEndReached(true);
        return [];
      }

      setLastDoc(
        sessionQuerySnapshot.docs[sessionQuerySnapshot.docs.length - 1]
      );

      return sessionQuerySnapshot.docs.map((doc) => ({
        ...doc.data(),
        docid: doc.id,
      })) as UserSession[];
    } catch (error) {
      console.error("Error retrieving sessions: ", error);
      return [];
    }
  };

  const loadMoreSessions = async () => {
    if (!fileloading && !endReached) {
      setFileloading(true);
      const newSessions = await getUserSessions(lastDoc);
      setUserSessions([...userSessions, ...newSessions]);
      setFileloading(false);
    }
  };

  const handleScroll = async (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      await loadMoreSessions();
    }
  };

  const handleKeyPress = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await handleSendMessage();
    }
  };

  const sendMessageToSession = async (sessionId: string) => {
    try {
      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      setLoading(true);

      setUserSessionMessages([
        ...(userSessionMessages || []),
        {
          _byteString: {
            binaryString: JSON.stringify({
              content: message,
              additional_kwargs: {},
              response_metadata: {},
              type: "human",
              name: null,
              id: null,
              example: false,
            }),
          },
        },
      ]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          client_id: clientId,
          user_message: message,
          session_id: sessionId,
        }),
      });

      if (response.status === 200) {
        const sessionRef = doc(
          db,
          `users/${user.uid}/clients/${clientId}/chats`,
          sessionId
        );
        const sessionDoc = await getDoc(sessionRef);

        setUserSessionMessages(sessionDoc.data()?.messages);
        setMessage("");
      } else {
        console.error("Failed to send message");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error sending message: ", error);
      setLoading(false);
    }
  };

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    try {
      if (!user) {
        console.log("User is not authenticated");
        return;
      }

      if (!message.trim()) {
        console.log("Message cannot be empty");
        return;
      }

      if (sessionId) {
        await sendMessageToSession(sessionId);
      } else {
        const newSessionId = await createNewSession();
        await sendMessageToSession(newSessionId);
      }
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const createNewSession = async () => {
    try {
      if (!user) {
        console.error("User is not authenticated");
        return "";
      }

      const newSession = await addDoc(
        collection(db, `users/${user.uid}/clients/${clientId}/chatsMetadata`),
        {
          name: `${user.displayName}`,
          sessionname: "Untitled Session",
          created_at: Timestamp.now(),
          sessionId: "",
        }
      );

      await updateDoc(newSession, {
        sessionId: newSession.id,
      });

      await setDoc(
        doc(db, `users/${user.uid}/clients/${clientId}/chats`, newSession.id),
        {
          messages: [],
        }
      );

      const newSessionId = newSession.id;

      setSessionId(newSessionId);

      const sessionRef = doc(
        db,
        `users/${user.uid}/clients/${clientId}/chats`,
        newSessionId
      );
      const sessionDoc = await getDoc(sessionRef);

      setUserSessionMessages(sessionDoc.data()?.messages || []);
      setMessage("");

      const updatedSessions = [
        {
          docid: newSessionId,
          name: `${user.displayName}`,
          sessionname: `Untitled Session`,
          sessionId: newSessionId,
          created_at: Timestamp.now().toDate().toString(),
        },
        ...userSessions,
      ];
      setUserSessions(updatedSessions);

      return newSessionId;
    } catch (error) {
      console.log("Error creating new session: ", error);
      return "";
    }
  };

  const renderMessages = () => {
    if (!sessionId) {
      return (
        <div className="p-20 flex flex-col gap-6">
          <div className="text-[#5B5757] text-6xl">
            Hi {user?.displayName?.split(" ")[0]},
          </div>
          <div className="text-[#A3A3A3] text-5xl">How can I help you?</div>
        </div>
      );
    }

    console.log(userSessionMessages);
    if (userSessionMessages && userSessionMessages.length > 0) {
      return userSessionMessages.map((message, index) => {
        console.log(message._byteString);

        const m: any = message._byteString;
        const jsonmessage = JSON.parse(m.binaryString);
        return (
          <div
            key={index}
            className={`rounded-[30px] p-5 max-w-[90%] mb-5 ${jsonmessage.type === "ai"
              ? "self-start"
              : "self-end bg-[#CDCDCD] bg-opacity-25 rounded-[30px] max-w-[40%] mb-5"
              }`}
          >
            <ReactMarkdown>{jsonmessage.content}</ReactMarkdown>
          </div>
        );
      });
    } else {

      return (
        <div className="p-20 flex flex-col gap-6">
          <div className="text-[#5B5757] text-3xl">
            {" "}
            No conversation in this session.
          </div>
          <div className="text-[#A3A3A3] text-2xl">
            Start typing to get started.
          </div>
        </div>
      );

    }
  };

  const handleSessionNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEditedSessionName(event.target.value);
  };

  const saveSessionName = async (sessionId: string) => {
    try {
      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      const sessionRef = doc(
        db,
        `users/${user.uid}/clients/${clientId}/chatsMetadata`,
        sessionId
      );

      await updateDoc(sessionRef, {
        sessionname: editedSessionName,
      });

      setUserSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.docid === sessionId
            ? { ...session, sessionname: editedSessionName }
            : session
        )
      );
      setEditingSessionId(null);
    } catch (error) {
      console.error("Error saving session name: ", error);
    }
  };

  const fetchSessionMessages = async (sessionId: string) => {
    try {
      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      const sessionRef = doc(
        db,
        `users/${user.uid}/clients/${clientId}/chats`,
        sessionId
      );
      const sessionDoc = await getDoc(sessionRef);

      setUserSessionMessages(sessionDoc.data()?.messages || []);
      setSessionId(sessionId);
    } catch (error) {
      console.error("Error fetching session messages: ", error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      if (!user) {
        console.error("User is not authenticated");
        return;
      }

      const sessionRef = doc(
        db,
        `users/${user.uid}/clients/${clientId}/chatsMetadata`,
        sessionId
      );

      await deleteDoc(sessionRef);

      setUserSessions((prevSessions) =>
        prevSessions.filter((session) => session.docid !== sessionId)
      );


      const messagesRef = doc(
        db,
        `users/${user.uid}/clients/${clientId}/chats`,
        sessionId
      );
      await deleteDoc(messagesRef);

      if (sessionId === sessionId) {
        setSessionId("");
        setUserSessionMessages(null);
      }

      toast({
        title: "Session deleted",
        description: "The session has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting session: ", error);
      toast({
        title: "Error",
        description: "Failed to delete the session.",
      });
    }
  };


  return (
    <div className="grid w-full grid-cols-[1fr_300px] overflow-hidden gap-10">
      <div className="w-full bg-[#DDDDDD] rounded-[30px] p-5 flex flex-col justify-between h-[83vh] py-10 bg-opacity-25">
        <div className="flex-1 overflow-auto max-h-full">
          <ScrollArea className="h-full flex flex-col w-full">
            {renderMessages()}
            {loading && <EosIconsThreeDotsLoading className="h-20 w-20 ml-2" />}
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
              disabled={loading}
            />
            <Button
              variant="outline"
              className="shadow-none border-none bg-transparent self-end"
              onClick={handleSendMessage}
              disabled={loading}
            >
              <Icons.Submit />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#DDDDDD] rounded-[30px] p-5 flex flex-col h-[83vh] bg-opacity-25">
        <ScrollArea
          className="h-[70vh] flex flex-col w-full"
          onScroll={handleScroll}
        >
          {userSessions.map((userSession) => (
            <div
              key={userSession.docid}
              className={`${sessionId === userSession.docid
                ? "bg-[#EBE6E6]"
                : "bg-[#FEFFFC]"
                } rounded-[30px] p-3 mb-5 px-4 cursor-pointer flex`}
              onClick={() => fetchSessionMessages(userSession.docid)}
            >
              {editingSessionId === userSession.docid ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editedSessionName}
                    onChange={handleSessionNameChange}
                    onBlur={() => saveSessionName(userSession.docid)}
                    className="bg-transparent border rounded "
                  />
                  <div
                    className="bg-transparent shadow-none border-none"
                    onClick={() => saveSessionName(userSession.docid)}
                  >
                    <CheckIcon className="h-5 w-5" />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full">
                  <span>
                    {userSession.sessionname}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div>
                        <Icons.dots />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup>
                        <DropdownMenuRadioItem
                          onClick={() => {
                            setEditingSessionId(userSession.docid);
                            setEditedSessionName(userSession.sessionname);
                          }}
                          value="Rename"
                        >
                          Rename
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem
                          onClick={async () => {
                            // Implement delete functionality
                            await deleteSession(userSession.docid);
                          }}
                          value="Delete"
                        >
                          Delete
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}


          {fileloading && (
            <EosIconsThreeDotsLoading className="h-20 w-20 ml-2" />
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Page;
