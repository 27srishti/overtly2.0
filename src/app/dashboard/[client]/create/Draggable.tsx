import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/customdrop";
import { DragHandleDots2Icon, DotFilledIcon } from "@radix-ui/react-icons";

export function Draggable({ children, fixedIndex }: { children: string; fixedIndex: number | null }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: children, disabled: fixedIndex !== null });

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
                {fixedIndex !== null ? (
                  <DotFilledIcon className="w-4 h-4 fill-[#BBBBBB] text-[#BBBBBB]" />
                ) : (
                  <DragHandleDots2Icon className="w-5 h-5 fill-[#BBBBBB] text-[#BBBBBB] cursor-grab" />
                )}
              </div>
              <div className="text-[12px]">{children}</div>
            </div>
          </AccordionTrigger>
          <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
