import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/Icons";
import { Textarea } from "@/components/ui/textarea";

const page = () => {
  return (
    <div className="grid w-full grid-cols-[1fr_300px] overflow-hidden p-5 gap-10 px-16 pt-10">
      <div className="w-full bg-[#DDDDDD] rounded-[30px] p-5 flex flex-col justify-between h-[83vh] py-10 bg-opacity-25">
        <div className="flex-1 overflow-auto max-h-full">
          <ScrollArea className="h-full flex flex-col w-full">
            <div className="rounded-[30px] p-5 max-w-[40%] mb-5 self-start">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              corporis aliquid similique velit explicabo soluta aut maxime ipsa
              sunt ea quaerat eaque, molestias reprehenderit qui! Dicta beatae
              porro iste veritatis!
            </div>
            <div className="bg-[#CDCDCD] bg-opacity-25 rounded-[30px] p-5 max-w-[40%] mb-5 self-end">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              corporis aliquid similique velit explicabo soluta aut maxime ipsa
              sunt ea quaerat eaque, molestias reprehenderit qui! Dicta beatae
              porro iste veritatis! Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Ullam corporis aliquid similique velit explicabo
              soluta aut maxime ipsa sunt ea quaerat eaque, molestias
            </div>
            <div className=" rounded-[30px] p-5 max-w-[40%] mb-5 self-start">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              corporis aliquid similique velit explicabo soluta aut maxime ipsa
              sunt ea quaerat eaque, molestias reprehenderit qui! Dicta beatae
              porro iste veritatis!
            </div>
            <div className="bg-[#CDCDCD] bg-opacity-25 rounded-[30px] p-5 max-w-[40%] mb-5 self-end">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              corporis aliquid similique velit explicabo soluta aut maxime ipsa
              sunt ea quaerat eaque, molestias reprehenderit qui! Dicta beatae
              porro iste veritatis!
            </div>
            <div className="rounded-[30px] p-5 max-w-[40%] mb-5 self-start">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              corporis aliquid similique velit explicabo soluta aut maxime ipsa
              sunt ea quaerat eaque, molestias reprehenderit qui! Dicta beatae
              porro iste veritatis! Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Ullam corporis aliquid similique velit explicabo
              soluta aut maxime ipsa sunt ea quaerat eaque, molestias
            </div>
            <div className="bg-[#CDCDCD] bg-opacity-25 rounded-[30px] p-5 max-w-[40%] mb-5 self-end">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              corporis aliquid similique velit explicabo soluta aut maxime ipsa
              sunt ea quaerat eaque, molestias reprehenderit qui! Dicta beatae
              porro iste veritatis!
            </div>
          </ScrollArea>
        </div>
        <div className="flex-none">
          <div className="flex gap-5 bg-white rounded-[30px] py-1 px-5 items-center">
            <Textarea
            rows={1}
              placeholder="Type your message here."
              className="outline-none focus:outline-none shadow-none border-none font-montserrat ring-[0px] focus:ring-0 ring-white"
            />
            <Button
              variant="outline"
              className="shadow-none border-none bg-transparent self-end"
            >
              <Icons.Send />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#DDDDDD] rounded-[30px] p-5 flex flex-col h-[83vh] bg-opacity-25">
        <div className="bg-[#CDCDCD] rounded-[30px] p-5 mb-5 self-start bg-opacity-25">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
          corporis aliquid similique velit explicabo soluta aut maxime ipsa sunt
        </div>
        <div className="bg-[#CDCDCD] rounded-[30px] p-5 mb-5 self-start bg-opacity-25">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
          corporis aliquid similique velit explicabo soluta aut maxime ipsa sunt
        </div>
        <div className="bg-[#CDCDCD] rounded-[30px] p-5 mb-5 self-start bg-opacity-25">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
          corporis aliquid similique velit explicabo soluta aut maxime ipsa sunt
        </div>
        <div className="bg-[#CDCDCD] rounded-[30px] p-5 mb-5 self-start bg-opacity-25">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
          corporis aliquid similique velit explicabo soluta aut maxime ipsa sunt
        </div>
      </div>
    </div>
  );
};

export default page;
