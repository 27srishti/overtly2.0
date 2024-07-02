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
    <div className="grid w-full grid-cols-[300px_1fr] p-5 gap-10 px-16 pt-10">
      <div className="w-full bg-[#DDDDDD] rounded-[30px] p-5 flex flex-col justify-between h-[83vh] py-10 bg-opacity-25 sticky top-[7.6rem]">
        <div>
          <div>Discover</div>
          <div>Chat</div>
          <div>Insights</div>
        </div>
        <div>Start a Thread</div>
      </div>
      <div className="w-full bg-[#DDDDDD] rounded-[30px] p-5 flex flex-col bg-opacity-25"></div>
    </div>
  );
};

export default Page;
