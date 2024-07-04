"use client";

import React, { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { Draggable } from "./Draggable";
import { EditorPage } from "./editor/text-editor.jsx";
import { useParams, useSearchParams } from "next/navigation";
import { auth, db } from "@/lib/firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const StepFour = () => {
  const params = useParams();
  const clientid = params.client;
  const [loading, setLoading] = useState(false);
  const [pitchEmail, setPitchEmail] = useState("");
  const searchParams = useSearchParams();
  const projectDocId = searchParams.get("projectid");
  const [fetchedValues, setFetchedValues] = useState("");

  const [gamesList, setGamesList] = useState([
    "Dota 2",
    "League of Legends",
    "CS:GO",
    "World of Warcraft",
    "The Witcher 3",
  ]);

  const reorderGamesList = (e: DragEndEvent) => {
    if (!e.over) return;

    if (e.active.id !== e.over.id) {
      setGamesList((gamesList) => {
        const oldIdx = gamesList.indexOf(e.active.id.toString());
        const newIdx = gamesList.indexOf(e.over!.id.toString());
        return arrayMove(gamesList, oldIdx, newIdx);
      });
    }
  };

  useEffect(() => {
    const fetchData = async (user: User) => {
      setLoading(true);
      try {
        const docRef = doc(
          db,
          `users/${user.uid}/clients/${clientid}/projects/${projectDocId}`
        );
        const docSnap = await getDoc(docRef);
        console.log(docSnap.exists());
        if (docSnap.exists()) {
          const firebasedata = docSnap.data();
          if (firebasedata.generatedMail) {
            setFetchedValues(firebasedata.generatedMail);
          } else {
            const response = await fetch("/api/pitch", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await user.getIdToken()}`,
              },
              body: JSON.stringify({
                client_id: clientid,
                topic: {
                  idea: firebasedata.selectedGeneratedIdea.idea,
                  story: firebasedata.selectedGeneratedIdea.story,
                },
                  media_format: firebasedata.mediaFormat,
                  beat: firebasedata.beat,
                  outlet: firebasedata.outlet,
                  objective: firebasedata.objective
              }),
            });

            if (!response.ok) {
              toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
              });
            }

            const data = await response.json();
            setFetchedValues(data.email);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user);
      }
    });

    return () => unsubscribe();
  }, [clientid, projectDocId]);

  return (
    <div className="h-[78vh] py-3 mt-2 grid grid-cols-[300px,1fr] p-2 gap-5 overflow-hidden font-montserrat">
      <div className="grid grid-rows-[120px,5fr] gap-5 overflow-hidden">
        <div className="rounded-[30px] bg-white flex flex-col p-5 items-center gap-3 overflow-hidden">
          <div className="text-center text-[#6B6B6B] font-[15px]">Settings</div>
          <div className="w-full">
            <div className="text-[#6B6B6B] text-[10px] mb-2">Word count</div>
            <Slider
              min={70}
              max={400}
              defaultValue={[250]}
              className="bg-[#F0F0F0] mb-2"
            />
            <div className="flex justify-between text-[#6B6B6B] text-[8px] mt-1 ">
              <div>70</div>
              <div>150</div>
              <div>500</div>
            </div>
          </div>
        </div>

        <ScrollArea className="rounded-[25px] bg-white p-2">
          <DndContext onDragEnd={reorderGamesList} id="dnd-container">
            <div>
              <div className="text-center pt-2 pb-4 text-[#6B6B6B]">
                Customize
              </div>
              <div>
                <SortableContext items={gamesList}>
                  {gamesList.map((game) => (
                    <Draggable key={game}>{game}</Draggable>
                  ))}
                </SortableContext>
              </div>
            </div>
          </DndContext>
        </ScrollArea>
      </div>
      <div className=" bg-white rounded-[30px] [box-shadow:2px_4px_19px_-1px_rgba(143,_184,_232,_0.26)] font-montserrat max-h-[75vh]">
        {!loading ? (
          <EditorPage pitchEmail={fetchedValues} />
        ) : (
          <div className="h-[75vh] p-5 flex items-center justify-between flex-col gap-5">
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full  w-full" />
            <Skeleton className="h-full  w-full" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StepFour;
