import { useSortable } from "@dnd-kit/sortable";
import { FC } from "react";
import styles from "./GameItem.module.css";
import { CSS } from "@dnd-kit/utilities";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/customdrop";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

export function Draggable(props: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.children });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      <Accordion type="multiple" className="z-50">
        <AccordionItem value="item-1">
          <AccordionTrigger className="">
            <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
              <div {...listeners}>
                <DragHandleDots2Icon className="w-5 h-5 fill-[#BBBBBB] text-[#BBBBBB] cursor-grab" />
              </div>
              <div className="text-[12px]">{props.children}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent>{props.children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
