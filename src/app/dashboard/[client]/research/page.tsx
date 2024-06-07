import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/Icons";

const page = () => {
  return (
    <div className="grid w-full grid-cols-[1fr_300px] overflow-hidden p-5 gap-5 h-[85vh]">
      <div className="w-full bg-[#F0F2F5] rounded-[30px] p-5 flex flex-col justify-between h-[inherit] py-10">
        <div className="h-[90%]">
          <ScrollArea className="h-full flex flex-col w-full">
            <div className="bg-[#E8EAE8] rounded-[30px] p-5 max-w-[40%] mb-5 self-start">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              corporis aliquid similique velit explicabo soluta aut maxime ipsa
              sunt ea quaerat eaque, molestias reprehenderit qui! Dicta beatae
              porro iste veritatis!
            </div>
            <div className="bg-[#E8EAE8] rounded-[30px] p-5 max-w-[40%] mb-5 self-end">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              corporis aliquid similique velit explicabo soluta aut maxime ipsa
              sunt ea quaerat eaque, molestias reprehenderit qui! Dicta beatae
              porro iste veritatis! Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Ullam corporis aliquid similique velit explicabo
              soluta aut maxime ipsa sunt ea quaerat eaque, molestias
            </div>
            <div className="bg-[#E8EAE8] rounded-[30px] p-5 max-w-[40%] mb-5 self-start">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              corporis aliquid similique velit explicabo soluta aut maxime ipsa
              sunt ea quaerat eaque, molestias reprehenderit qui! Dicta beatae
              porro iste veritatis!
            </div>
            <div className="bg-[#E8EAE8] rounded-[30px] p-5 max-w-[40%] mb-5 self-end">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              corporis aliquid similique velit explicabo soluta aut maxime ipsa
              sunt ea quaerat eaque, molestias reprehenderit qui! Dicta beatae
              porro iste veritatis!
            </div>
            <div className="bg-[#E8EAE8] rounded-[30px] p-5 max-w-[40%] mb-5 self-start">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              corporis aliquid similique velit explicabo soluta aut maxime ipsa
              sunt ea quaerat eaque, molestias reprehenderit qui! Dicta beatae
              porro iste veritatis! Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Ullam corporis aliquid similique velit explicabo
              soluta aut maxime ipsa sunt ea quaerat eaque, molestias
            </div>
            <div className="bg-[#E8EAE8] rounded-[30px] p-5 max-w-[40%] mb-5 self-end">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
              corporis aliquid similique velit explicabo soluta aut maxime ipsa
              sunt ea quaerat eaque, molestias reprehenderit qui! Dicta beatae
              porro iste veritatis!
            </div>
          </ScrollArea>
        </div>
        <div>
          <div className="flex gap-5 bg-white rounded-[30px] p-5">
            <Input
              type="text"
              className="outline-none shadow-none border-none font-montserrat"
              placeholder="Type a message"
            />
            <Button
              variant="outline"
              className="shadow-none border-none bg-transparent"
            >
              <Icons.Send />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#F0F2F5] rounded-[30px] p-5 flex flex-col">
        <div className="bg-[#E8EAE8] rounded-[30px] p-5  mb-5 self-start">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
          corporis aliquid similique velit explicabo soluta aut maxime ipsa sunt
        </div>

        <div className="bg-[#E8EAE8] rounded-[30px] p-5  mb-5 self-start">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
          corporis aliquid similique velit explicabo soluta aut maxime ipsa sunt
        </div>
        <div className="bg-[#E8EAE8] rounded-[30px] p-5  mb-5 self-start">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
          corporis aliquid similique velit explicabo soluta aut maxime ipsa sunt
        </div>
        <div className="bg-[#E8EAE8] rounded-[30px] p-5  mb-5 self-start">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
          corporis aliquid similique velit explicabo soluta aut maxime ipsa sunt
        </div>
      </div>
    </div>
  );
};

export default page;
