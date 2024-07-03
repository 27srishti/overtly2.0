"use client";

import React, { useState, KeyboardEvent, ChangeEvent } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/Icons";
import { Textarea } from "@/components/ui/textarea";

const Page = () => {
  const [message, setMessage] = useState<string>("");

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      console.log(message);
      setMessage("");
    }
  };

  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  return (
    <div className="flex flex-col justify-between h-[80vh]">
      <div className="p-20 flex flex-col gap-6">
        <div className="text-[#5B5757] text-6xl">Hi Sidharth,</div>
        <div className="text-[#A3A3A3] text-5xl">Where insights emerge,</div>
      </div>
      <div className="flex-none pb-10">
        <div className="flex gap-5 bg-white rounded-[30px] py-1 px-5 items-center border ">
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
            onClick={() => {
              console.log(message);
              setMessage("");
            }}
          >
            <Icons.Send />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
