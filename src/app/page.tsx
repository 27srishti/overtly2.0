// src/app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import Image from "next/image";

const logos = [
  { name: "Vercel", url: "/pubs1.png" },
  { name: "Nextjs", url: "/pubs2.png" },
  { name: "Prime", url: "/pubs3.png" },
  { name: "Trustpilot", url: "/pubs4.png" },
  { name: "Webflow", url: "/pubs5.png" },
  { name: "Airbnb", url: "/pubs6.png" },
  { name: "Tina", url: "/pubs7.png" },
  { name: "Stackoverflow", url: "/pubs8.png" },
];

const LandingPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [smartWorkflowProgress, setSmartWorkflowProgress] = useState(0);
  const [smartWorkflowActiveTab, setSmartWorkflowActiveTab] =
    useState<number>(0);
  const [email, setEmail] = useState("");

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const updateProgressAndTab = () => {
    setProgress((prev) => {
      if (prev >= 100) {
        setActiveTab((prevTab) => {
          const order = [2, 1, 0]; // Define the custom order for cycling
          const currentIndex = order.indexOf(prevTab);
          const nextIndex = (currentIndex + 1) % order.length;
          const nextTab = order[nextIndex];

          return nextTab;
        });
        return 0; // Reset progress
      } else {
        return prev + 10; // Increment progress + 10
      }
    });
  };

  const updateSmartWorkflowProgressAndTab = () => {
    setSmartWorkflowProgress((prev) => {
      if (prev >= 100) {
        setSmartWorkflowActiveTab((prevTab) => {
          const order = [2, 1, 0]; // Define the custom order for cycling
          const currentIndex = order.indexOf(prevTab);
          const nextIndex = (currentIndex + 1) % order.length;
          const nextTab = order[nextIndex];
          return nextTab;
        });
        return 0; // Reset progress
      } else {
        return prev + 10; // Increment progress + 10
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(updateProgressAndTab, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(updateSmartWorkflowProgressAndTab, 200);
    return () => clearInterval(interval);
  }, []);

  const handleJoinWaitlist = async () => {
    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(
        "https://api.getwaitlist.com/api/v1/waiter/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: "14757",
            email: email,
            referral_link: "https://overtly.io/",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Successfully joined waitlist:", data);
        alert("You have been added to the waitlist!");
      } else {
        console.error("Failed to join waitlist:", response.statusText);
        alert("Failed to join waitlist, Please enter a valid email address");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to join waitlist, Please enter a valid email address.");
    }
  };

  return (
    <section className="font-readex  ">
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgba(255, 139, 121, 0.4), rgba(255, 191, 54, 0.45), rgba(255, 255, 255, 1))",
        }}
        className="bg-gradient-to-b p-2 lg:p-4 relative"
      >
        <div className="font-readex border-t-[5px]  border-[#eceae7] border-b-0 px-5 flex flex-col items-center justify-center rounded-3xl lg:min-h-screen bg-gradient-to-b from-[#ebe6de] to-[#FFFFFF] z-10">
          {/* Grid lines */}
          <div className="absolute inset-0 h-full w-full flex justify-center z-0">
            <div className="h-full w-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:60px_60px] opacity-5"></div>
          </div>

          <div className="absolute top-8 left-5 lg:top-10 lg:left-10">
            <Image
              src="/fullimage.png"
              className="w-32 sm:w-28 md:w-32 4xl:w-60 ml-3"
              alt="Logo"
              width={128}
              height={128}
            />
          </div>
          <div className="sm:text-center mb-10 ">
            <div className="hidden  sm:flex flex-col sm:flex-row justify-center mb-4 ">
              <div className="flex  items-center border px-5 py-1 rounded-3xl font-light bg-[#f4efef] border-[#5e473055] z-0">
                <Image
                  src="/checkbox.png"
                  alt="Checkmark"
                  className="w-4 h-4 4xl:w-10 4xl:h-10 mr-3"
                  width={16}
                  height={16}
                />
                <span className="text-[0.7rem] lg:text-sm 4xl:text-2xl text-[#605449c7] ">
                  In-House Comm Teams
                </span>
                <span className="mx-2 4xl:mx-5 text-gray-500">|</span>
                <span className="text-[0.7rem] lg:text-sm 4xl:text-2xl text-[#605449c7]">
                  PR Agencies
                </span>
                <span className="mx-2 4xl:mx-5 text-gray-500">|</span>
                <span className="text-[0.7rem] lg:text-sm 4xl:text-2xl text-[#605449c7]">
                  Indie PR freelancers
                </span>
              </div>
            </div>
            <div className="m-4">
              <div className="text-[2.9rem] sm:text-[3.50rem] 4xl:text-[5rem] mt-40 lg:mt-5  font-light text-[#454545]">
                <h1>
                  The Complete AI Engine for <br className="hidden sm:flex " />
                  your PR workflows
                </h1>
              </div>

              <p className=" mt-5 sm:mt-0 lg:text-lg 4xl:text-3xl font-light text-[#8A8A8A]">
                Automates in-depth research, simulates brainstorming shapes
                insights into workflows <br className="hidden lg:flex" />
                using data and AI for analytics & measurement.
              </p>
            </div>
          </div>
          <div className="flex font-light flex-col items-start mb-10 z-30 w-full sm:w-auto">
            <div className="flex flex-row items-center border border-gray-300 rounded-full w-full">
              <input
                type="email"
                placeholder="name@email.com"
                className="px-4 py-2 w-full 4xl:text-2xl sm:w-72 4xl:w-full rounded-full focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <HoverBorderGradient
                className="bg-[#2C2B2B] text-white rounded-full text-xs lg:text-base 4xl:text-2xl mr-1 ml-1 px-4 my-1 py-2"
                onClick={handleJoinWaitlist}
              >
                Join Waitlist
              </HoverBorderGradient>
            </div>
          </div>
          <div className="absolute top-8 right-6 lg:top-10 lg:right-12">
            <HoverBorderGradient
              className="bg-[#2C2B2B]  text-white font-light text-[0.6rem] lg:text-sm 4xl:text-2xl rounded-full px-4 py-3 4xl:px-8 4xl:py-5"
              onClick={() =>
                window.open(
                  "https://calendly.com/siddhar/30min",
                  "_blank",
                  "noopener"
                )
              }
            >
              Schedule Free Demo
            </HoverBorderGradient>
          </div>
        </div>
      </div>
      {/*-------------------------  sponsors------------------------- */}
      <section className="max-w-screen-2xl mt-10 sm:mt-0 mx-auto">
        <div className="w-full sm:py-12 text-center">
          <div className="text-lg px-10 font-light text-[#454545]">
            Curated news sources & articles from 100,000&apos;s of publications
            worldwide
          </div>
          <div className="mx-auto w-full px-4 md:px-8">
            <div
              className="group relative mt-10 flex gap-6 overflow-hidden p-2"
              style={{
                maskImage:
                  "linear-gradient(to left, transparent 0%, black 5%, black 95%, transparent 100%)",
              }}
            >
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex shrink-0 animate-logo-cloud flex-row justify-around gap-8"
                  >
                    {logos.map((logo, key) => (
                      <Image
                        key={key}
                        src={logo.url}
                        className="h-5 w-full px-2 opacity-50  "
                        alt={`${logo.name}`}
                        width={20}
                        height={20}
                      />
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/*-------------------------  features------------------------- */}
        <div className="text-center mt-20 px-5">
          <button className="bg-[#F5E0D3] text-gray-600 text-sm font-[500] rounded-full px-8 py-1.5">
            Features
          </button>
          <div className="text-2xl sm:text-[45px] font-light mt-14  text-[#454545]">
            Plug in AI without disruption — Your workflow stays{" "}
            <div className=" ">
              {" "}
              <br /> perfectly intact
            </div>
          </div>
          <p className="mt-6 text-xl font-light text-gray-500">
            An AI that coexists, ensuring the human touch remains front and
            center.
          </p>
        </div>
        {/*-------------------------  how it works - research ------------------------- */}
        <div className="mt-20 p-8 mx-5 lg:mx-20 sm:px-20 shadow-sm sm:py-32 bg-gradient-to-b from-blue-50 to-white rounded-3xl">
          <div className="flex flex-col max-w-7xl mx-auto items-start">
            <h2 className="mt-5 sm:mt-0 text-4xl sm:text-5xl text-[#454545] font-[250]">
              Research &
            </h2>
            <h2 className="text-3xl sm:text-4xl text-gray-400 mt-2 font-extralight">
              Brainstorm With Ease
            </h2>
            <div className="gap-1 sm:gap-2 mt-8 flex flex-wrap">
              {["Curated News", "Trend Spotter", "Insights"].map(
                (label, index) => (
                  <div key={index} className="relative">
                    <button
                      onClick={() => {
                        console.log(
                          `Manually switching to tab ${index}: ${label}`
                        );
                        setActiveTab(index);
                      }}
                      className={`border border-[#A2BEA0] font-light text-sm rounded-full px-4 py-1.5 mb-2 relative overflow-hidden bg-white`}
                    >
                      <div
                        className={`absolute inset-0 h-full bg-[#A2BEA0] transition-all duration-500 ease-in-out`}
                        style={{
                          width: activeTab === index ? `${progress}%` : "0%",
                          zIndex: 0,
                        }}
                      />
                      <span className="relative z-10">{label}</span>
                    </button>
                  </div>
                )
              )}
            </div>
            {/* image and Description start */}
            {activeTab === 0 && (
              <div className="flex flex-col sm:flex-row sm:w-full gap-10 sm:gap-40 mt-10">
                <div className="flex justify-center items-center w-full sm:w-1/2">
                  <div className="w-full h-64 bg-gray-200 rounded-3xl flex items-center justify-center">
                    {/* Image placeholder */}
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center w-full sm:w-1/2">
                  <h3 className="text-3xl sm:text-3xl text-[#454545] font-light">
                    Read 1000s of articles in seconds
                  </h3>
                  <ul className=" text-lg sm:text-[19px] w-full sm:w-[35rem] text-gray-400 space-y-3 font-light list-none mt-8">
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      <span>
                        Find insights that point you to great follow-up story
                        ideas for every news
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      <span>Get Daily Inspiration for Creative Pitches</span>
                    </li>
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      <span>
                        Find ideas that bridge your content gaps with competes &
                        industry
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="flex flex-col sm:flex-row sm:w-full gap-10 sm:gap-40 mt-10">
                <div className="flex justify-center items-center w-full sm:w-1/2">
                  <div className="w-full h-64 bg-gray-200 rounded-3xl flex items-center justify-center">
                    {/* Image placeholder */}
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center w-full sm:w-1/2">
                  <h3 className="text-2xl sm:text-3xl text-[#454545] font-light">
                    Spot trends before it becomes one
                  </h3>
                  <ul className="text-base sm:text-[19px] w-full sm:w-[35rem] text-gray-400 space-y-3 font-light list-inside mt-8">
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Consolidated Report on Journalists and Outlets covering
                      your niche
                    </li>
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Examine seasonal patterns, cyclical trends, & anomalies
                    </li>
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Adapt your stories as they evolve
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="flex flex-col sm:flex-row sm:w-full gap-10 sm:gap-40 mt-10">
                <div className="flex justify-center items-center w-full sm:w-1/2">
                  <div className="w-full h-64 bg-gray-200 rounded-3xl flex items-center justify-center">
                    {/* Image placeholder */}
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center w-full sm:w-1/2">
                  <h3 className="text-2xl sm:text-3xl text-[#454545] font-light">
                    Story ideas on demand, every hour
                  </h3>
                  <ul className="text-base sm:text-[19px] w-full sm:w-[35rem] text-gray-400 space-y-3 font-light list-inside mt-8">
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Find insights that point you to great follow-up story
                      ideas for every news
                    </li>
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Get Daily Inspiration for Creative Pitches
                    </li>
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Find ideas that bridge your content gaps with competes &
                      industry
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {/* image and Description end */}
          </div>
        </div>
        {/*-------------------------  how it works - Smart Workflows ------------------------- */}
        <div className="mt-20 p-8 mx-5 lg:mx-20 sm:px-20 shadow-sm sm:py-32 bg-gradient-to-b from-blue-50 to-white rounded-3xl">
          <div className="flex flex-col max-w-7xl mx-auto items-start hide-scrollbar">
            <style>
              {`
              .hide-scrollbar::-webkit-scrollbar {
                display: none; /* Safari and Chrome */
              }
            `}
            </style>
            <h2 className="text-3xl sm:text-5xl text-[#454545] font-[250]">
              Smart Workflows &
            </h2>
            <h2 className="text-2xl sm:text-4xl text-gray-400 mt-2 font-extralight">
              Easy Task Automation
            </h2>
            <div className="gap-1 sm:gap-2 mt-8 flex flex-wrap">
              {["AI Journalist Selector", "Pitch", "Content Assistant"].map(
                (label, index) => (
                  <div key={index} className="relative">
                    <button
                      onClick={() => {
                        console.log(
                          `Manually switching to tab ${index}: ${label}`
                        );
                        setSmartWorkflowActiveTab(index);
                      }}
                      className={`border border-[#A2BEA0] font-light text-sm rounded-full px-4 py-1.5 mb-2 relative overflow-hidden bg-white`}
                    >
                      <div
                        className={`absolute inset-0 h-full bg-[#A2BEA0] transition-all duration-500 ease-in-out`}
                        style={{
                          width:
                            smartWorkflowActiveTab === index
                              ? `${smartWorkflowProgress}%`
                              : "0%",
                          zIndex: 0,
                        }}
                      />
                      <span className="relative z-10">{label}</span>
                    </button>
                  </div>
                )
              )}
            </div>
            {/* image and Description start */}
            {smartWorkflowActiveTab === 0 && (
              <div className="flex flex-col sm:flex-row sm:w-full gap-10 sm:gap-40 mt-10">
                <div className="flex justify-center items-center w-full sm:w-1/2">
                  <div className="w-full h-64 bg-gray-200 rounded-3xl flex items-center justify-center">
                    {/* Content for AI Journalist Selector */}
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center w-full sm:w-1/2">
                  <h3 className="text-2xl sm:text-3xl text-[#454545] font-light">
                    Find the right journalist to tell your story
                  </h3>
                  <ul className="text-base sm:text-[19px] w-full sm:w-[35rem] text-gray-400 space-y-3 font-light list-inside mt-8">
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Choose whom to pitch with customized automated databases
                    </li>
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Personalize outreach based on their content
                    </li>
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Track past interactions with relevant journalists
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {smartWorkflowActiveTab === 1 && (
              <div className="flex flex-col sm:flex-row sm:w-full gap-10 sm:gap-40 mt-10">
                <div className="flex justify-center items-center w-full sm:w-1/2">
                  <div className="w-full h-64 bg-gray-200 rounded-3xl flex items-center justify-center">
                    {/* Content for Pitch */}
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center w-full sm:w-1/2">
                  <h3 className="text-2xl sm:text-3xl text-[#454545] font-light">
                    Write Specialized Pitches in minutes
                  </h3>
                  <ul className="text-base sm:text-[19px] w-full sm:w-[35rem] text-gray-400 space-y-3 font-light list-inside mt-8">
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Write well researched pitches easily in no time
                    </li>
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Mimic your pitch & have the model write in your pitch
                      style
                    </li>
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Personalized pitches at scale
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {smartWorkflowActiveTab === 2 && (
              <div className="flex flex-col sm:flex-row sm:w-full gap-10 sm:gap-40 mt-10">
                <div className="flex justify-center items-center w-full sm:w-1/2">
                  <div className="w-full h-64 bg-gray-200 rounded-3xl flex items-center justify-center">
                    {/* Content for Content Assistant */}
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center w-full sm:w-1/2">
                  <h3 className="text-2xl sm:text-3xl text-[#454545] font-light">
                    Your PR-optimized writing companion
                  </h3>
                  <ul className="text-base sm:text-[19px] w-full sm:w-[35rem] text-gray-400 space-y-3 font-light list-inside mt-8">
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Streamline your PR writing with an AI assistant
                      experienced in content workflows
                    </li>
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Re purpose new story angles to mirror the brand tone
                    </li>
                    <li className="flex items-center">
                      <Image
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                        width={16}
                        height={16}
                      />
                      Content calendar/Automated Follow-ups
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {/* image and Description end */}
          </div>
        </div>
        {/*-------------------------  how it works - Analytics ------------------------- */}
        <div className="mt-20 p-8 mx-5 lg:mx-20 sm:px-20 shadow-sm sm:py-32 bg-gradient-to-b from-blue-50 to-white rounded-3xl">
          <div className="flex flex-col max-w-7xl mx-auto items-start hide-scrollbar">
            <style>
              {`
              .hide-scrollbar::-webkit-scrollbar {
                display: none; /* Safari and Chrome */
              }
            `}
            </style>
            <h2 className="text-3xl sm:text-5xl text-[#454545] font-[250]">
              Analytics
            </h2>
            <h2 className="text-2xl sm:text-4xl text-gray-400 mt-2 font-extralight">
              Real time reporting
            </h2>
            <div className="gap-1 sm:gap-2 mt-8 flex flex-wrap">
              {["Curated News", "Trend Spotter", "Insights"].map(
                (label, index) => (
                  <div key={index} className="relative">
                    <button
                      onClick={() => {
                        console.log(
                          `Manually switching to tab ${index}: ${label}`
                        );
                        setActiveTab(index);
                      }}
                      className={`border border-[#A2BEA0] font-light text-sm rounded-full px-4 py-1.5 mb-2 relative overflow-hidden bg-white`}
                    >
                      <div
                        className={`absolute inset-0 h-full bg-[#A2BEA0] transition-all duration-500 ease-in-out`}
                        style={{
                          width: activeTab === index ? `${progress}%` : "0%",
                          zIndex: 0,
                        }}
                      />
                      <span className="relative z-10">{label}</span>
                    </button>
                  </div>
                )
              )}
            </div>
            {/* image and Description start */}
            

            

            
            {/* image and Description end */}
          </div>
        </div>
      {/* End FAQ */}
      {/*------------------------- demo ------------------------- */}
            </section>

    </section>
  );
};

export default LandingPage;
