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
    <div className="grid w-full grid-cols-[1fr_300px] overflow-hidden p-5 gap-10 px-16 pt-10">
      <div className="w-full bg-[#DDDDDD] rounded-[30px] p-5 flex flex-col justify-between h-[83vh] py-10 bg-opacity-25">
        <div className="flex-1 overflow-auto max-h-full">
          <ScrollArea className="h-full flex flex-col w-full">
            <div className="rounded-[30px] p-5 max-w-[90%] mb-5 self-start">
              Hey, Ive been diving deep into the latest mockups and UI specs.
              The new sidebar layout is quite promising, dont you think?
            </div>
            <div className="bg-[#CDCDCD] bg-opacity-25 rounded-[30px] p-5 max-w-[40%] mb-5 self-end">
              Absolutely, its a definite improvement in terms of organizing
              content and enhancing navigation.
            </div>
            <div className="rounded-[30px] p-5 max-w-[90%] mb-5 self-start">
              I agree. The structure feels more intuitive. How about the color
              palette? Do you think it resonates well with our target users?
            </div>
            <div className="bg-[#CDCDCD] bg-opacity-25 rounded-[30px] p-5 max-w-[40%] mb-5 self-end">
              The colors are aesthetically pleasing, but we should consider
              accessibility aspects. Maybe adjust the saturation for better
              contrast, especially for users with visual impairments.
            </div>
            <div className="rounded-[30px] p-5 max-w-[90%] mb-5 self-start">
              Good call. Accessibility is crucial. Ive started mapping out
              interaction flows based on the new layout. Have you had a chance
              to review those yet?
            </div>
            <div className="bg-[#CDCDCD] bg-opacity-25 rounded-[30px] p-5 max-w-[40%] mb-5 self-end">
              Yes, Ive looked into them. They seem logical, but we might want to
              streamline some of the secondary pathways to keep the primary
              actions clear and prominent.
            </div>
            <div className="rounded-[30px] p-5 max-w-[90%] mb-5 self-start">
              Simplification sounds like a good approach. We want the interface
              to be user-friendly even for first-time users. Have you thought
              about onboarding strategies?
            </div>
            <div className="bg-[#CDCDCD] bg-opacity-25 rounded-[30px] p-5 max-w-[40%] mb-5 self-end">
              Definitely. Onboarding should guide users smoothly through the
              core features. We can consider tooltips, tutorials, or a guided
              tour for new sign-ups.
            </div>
            <div className="rounded-[30px] p-5 max-w-[90%] mb-5 self-start">
              That sounds comprehensive. Lets aim for a seamless user experience
              from the start. Hows the timeline looking for the next steps?
            </div>
            <div className="bg-[#CDCDCD] bg-opacity-25 rounded-[30px] p-5 max-w-[40%] mb-5 self-end">
              Were on track. Ill finalize the primary user journey flows by
              mid-next week and prepare a demo build for internal testing
              shortly after.
            </div>
            <div className="rounded-[30px] p-5 max-w-[90%] mb-5 self-start">
              Great. Ill start gathering feedback from the team in parallel. Its
              crucial to iterate quickly based on real-world insights.
            </div>
            <div className="bg-[#CDCDCD] bg-opacity-25 rounded-[30px] p-5 max-w-[40%] mb-5 self-end">
              Absolutely. Lets remain agile and responsive to ensure we deliver
              a product that delights our users.
            </div>
            <div className="rounded-[30px] p-5 max-w-[90%] mb-5 self-start">
              Sounds like a plan. I appreciate your thorough approach to this.
              Looking forward to seeing our progress next week!
            </div>
            <div className="bg-[#CDCDCD] bg-opacity-25 rounded-[30px] p-5 max-w-[40%] mb-5 self-end">
              Likewise. Its exciting to see how everything is coming together.
              Were definitely moving in the right direction.
            </div>
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

export default Page;
