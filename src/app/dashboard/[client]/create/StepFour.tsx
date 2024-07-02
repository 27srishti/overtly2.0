"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { Draggable } from "./Draggable";
import { Editor } from "./editor/text-editor";
// import "./editor/styles.css";

const StepFour = () => {
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

  return (
    <div className="h-[78vh] py-3 mt-2 grid grid-cols-[300px,1fr] p-2 gap-5 overflow-hidden font-montserrat">
      <div className="grid grid-rows-[120px,5fr] gap-5 overflow-hidden">
        <div className="rounded-[30px] bg-white flex flex-col p-5 items-center gap-3 overflow-hidden">
          <div className="text-center text-[#6B6B6B] font-[15px]">Settings</div>
          <div className="w-full">
            <div className="text-[#6B6B6B] text-[10px] mb-2">Word count</div>
            <Slider min={70} max={400} defaultValue={[250]} className="bg-[#F0F0F0] mb-2" />
            <div className="flex justify-between text-[#6B6B6B] text-[8px] mt-1 ">
              <div>70</div>
              <div>150</div>
              <div>500</div>
            </div>
          </div>
        </div>

        <ScrollArea className="rounded-[25px] bg-white p-2">
          <DndContext onDragEnd={reorderGamesList}>
            <div>
              <div className="text-center pt-2 pb-4 text-[#6B6B6B]"> Customize</div>
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
      <div className="p-5 bg-white rounded-[30px] shadow-lg font-montserrat">
      <Editor />
      </div>
    </div>
  );
};

export default StepFour;
