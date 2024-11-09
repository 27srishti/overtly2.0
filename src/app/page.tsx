// src/app/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";


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
        return prev + 0; // Increment progress + 10
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
        return prev + 0; // Increment progress + 10
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
            <img
              src="/fullimage.png"
              className="w-32 sm:w-28 md:w-32 4xl:w-60 ml-3"
              alt="Logo"
            />
          </div>
          <div className="sm:text-center mb-10 ">
            <div className="hidden  sm:flex flex-col sm:flex-row justify-center mb-4 ">
              <div className="flex  items-center border px-5 py-1 rounded-3xl font-light bg-[#f4efef] border-[#5e473055] z-0">
                <img
                  src="/checkbox.png"
                  alt="Checkmark"
                  className="w-4 h-4 4xl:w-10 4xl:h-10 mr-3"
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
          <div className="text-lg px-10 font-light  text-[#454545] ">
            Curated news sources & articles from 100,000's of publications
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
                      <img
                        key={key}
                        src={logo.url}
                        className="h-5 w-full px-2 opacity-50  "
                        alt={`${logo.name}`}
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
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                      />
                      <span>
                        Find insights that point you to great follow-up story
                        ideas for every news
                      </span>
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                      />
                      <span>Get Daily Inspiration for Creative Pitches</span>
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
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
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                      />
                      Consolidated Report on Journalists and Outlets covering
                      your niche
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                      />
                      Examine seasonal patterns, cyclical trends, & anomalies
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
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
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                      />
                      Find insights that point you to great follow-up story
                      ideas for every news
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                      />
                      Get Daily Inspiration for Creative Pitches
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
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
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                      />
                      Choose whom to pitch with customized automated databases
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                      />
                      Personalize outreach based on their content
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
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
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                         className="inline-block  mr-1 sm:mr-5"
                      />
                      Write well researched pitches easily in no time
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                         className="inline-block  mr-1 sm:mr-5"
                      />
                      Mimic your pitch & have the model write in your pitch
                      style
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                      className="inline-block  mr-1 sm:mr-5"
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
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                         className="inline-block  mr-1 sm:mr-5"
                      />
                      Streamline your PR writing with an AI assistant
                      experienced in content workflows
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                      />
                      Re purpose new story angles to mirror the brand tone
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
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
            {activeTab === 0 && (
              <div className="flex flex-col sm:flex-row sm:w-full gap-10 sm:gap-40 mt-10">
                <div className="flex justify-center items-center w-full sm:w-1/2">
                  <div className="w-full h-64 bg-gray-200 rounded-3xl flex items-center justify-center">
                    {/* Image placeholder */}
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center w-full sm:w-1/2">
                  <h3 className="text-2xl sm:text-3xl text-[#454545] font-light">
                    Score Your Media Impact
                  </h3>
                  <ul className="text-base sm:text-[19px] w-full sm:w-[35rem] text-gray-400 space-y-3 font-light list-inside mt-8">
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                          className="inline-block  mr-1 sm:mr-5"
                      />
                      Evaluate media mentions based on reach, engagement, &
                      sentiment for precise impact assessment
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block  mr-1 sm:mr-5"
                      />
                      Gauge public sentiment for deeper insights
                    </li>
                    <li className="flex items-center">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                         className="inline-block  mr-1 sm:mr-5"
                      />
                      Predict future impact based on historical performance
                      data, enabling proactive decision-making in media outreach
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
                    Hands-Free Reporting
                  </h3>
                  <ul className="text-base sm:text-[19px] w-full sm:w-[35rem] text-gray-400 space-y-3 font-light list-inside mt-8">
                    <li className="flex items-start">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block mr-5"
                      />
                      Automate complex data consolidation into detailed PR
                      reports in seconds—no manual work required
                    </li>
                    <li className="flex items-start">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block mr-5"
                      />
                      Access live dashboards that automatically update with
                      real-time insights style
                    </li>
                    <li className="flex items-start">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block mr-5"
                      />
                      Create concise report summaries that highlight key
                      takeaways for quick stakeholder review
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
                    Let AI take over your next move
                  </h3>
                  <ul className="text-base sm:text-[19px] w-full sm:w-[35rem] text-gray-400 space-y-3 font-light list-inside mt-8">
                    <li className="flex items-start">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block mr-5"
                      />
                      AI pinpoints your next PR move, adapting suggestions to
                      your campaign’s progress and goals
                    </li>
                    <li className="flex items-start">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block mr-5"
                      />
                      Catch a crisis early— know how to handle it before it
                      erupts
                    </li>
                    <li className="flex items-start">
                      <img
                        src="/plus2.png"
                        alt="Plus Icon"
                        className="inline-block mr-5"
                      />
                      Plan content timelines with automated next steps
                    </li>
                  </ul>
                </div>
              </div>
            )}
            {/* image and Description end */}
          </div>
        </div>
      
        {/*------------------------- New Understanding PR Section ------------------------- */}
        <div className="text-center mt-20 ">
          <h2 className="text-4xl font-light mt-14 text-[#616060]">
            Finally, a tool that understands PR — from <br /> start to finish.
          </h2>
          <p className="mt-6 text-lg font-light text-gray-500">
            With a knack for understanding complex data, our reasoning engine
            simplifies your <br /> approach to PR, making it more effective and
            intuitive.
          </p>
        </div>
        <section className="bg-white mt-10">
          <div className="py-4 px-2 mx-auto max-w-screen-xl sm:py-4 lg:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-1 h-full">
              <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-gray-50 h-auto flex flex-col">
                <a className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow">
                  {/* <img
                    src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  /> */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5" />
                  {/* <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-3xl">
                    Wines
                  </h3> */}
                </a>
              </div>
              <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-stone-50">
                <div className="grid gap-1 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2">
                  <a className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40">
                    {/* <img
                      src="https://images.unsplash.com/photo-1571104508999-893933ded431?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    /> */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5" />
                    {/* <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-3xl">
                      Whiskey
                    </h3> */}
                  </a>
                  <a className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40">
                    {/* <img
                      src="https://images.unsplash.com/photo-1626897505254-e0f811aa9bf7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    /> */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5" />
                    {/* <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-3xl">
                      Vodka
                    </h3> */}
                  </a>
                </div>
                <a className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 mt-1">
                  {/* <img
                    src="https://images.unsplash.com/photo-1504675099198-7023dd85f5a3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  /> */}
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5" />
                  {/* <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-3xl">
                    Gin
                  </h3> */}
                </a>
              </div>
            </div>
          </div>
        </section>
        {/*------------------------- Faq ------------------------- */}
        {/* FAQ */}
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mt-20 mx-auto">
          {/* Title */}
          <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
            <h2 className="text-2xl font-light md:text-4xl md:leading-tight dark:text-white">
              Your questions, answered
            </h2>
            <p className="mt-1 text-gray-600 dark:text-neutral-400">
              Answers to the most frequently asked questions.
            </p>
          </div>
          {/* End Title */}
          <div className="max-w-2xl mx-auto ">
            {/* Accordion */}
            <div className="hs-accordion-group ">
              {[
                {
                  question: "What PR tasks does Overtly automate?",
                  answer:
                    "Overtly handles both routine, repetitive tasks (like media monitoring, report generation, and outreach follow-ups) and data-heavy, complex tasks (like analysing trends, competitor activity, and journalist behaviour). It simplifies the processes that are time-consuming or require high precision, freeing up time for strategy and creative work.",
                },
                {
                  question: "How is Overtly different from other PR tools?",
                  answer:
                    "Overtly integrates research, workflows, and analytics to create a connected system. Overtly uses contextual learning to understand your company’s voice and PR strategy. It tailors communications based on historical data and industry trends, unlike other tools that rely on generic models. It's a PR-specific approach where everything—research, workflows, and writing.",
                },
                {
                  question:
                    "How does Overtly ensure human control in PR communication?",
                  answer:
                    "Overtly is designed to assist, not replace. There is human intervention in every step of the workflow so the final result has a human touch, it automates routine tasks, but always leaves strategic control in your hands. You direct the process, review drafts, and approve content. The platform provides guidance and automates the heavy lifting, but human expertise ensures that every message remains relevant and on-point.",
                },
                {
                  question:
                    "Who can use this product, and what are the use cases?",
                  answer:
                    "Protecting the data you trust to Preline is our first priority. This part is really crucial in keeping the project in line to completion.",
                },
                {
                  question:
                    "What types of documents can be uploaded to Overtly?",
                  answer:
                    "You can upload any PR-related documents, including press releases, media lists, media outreach content, campaign reports, and brand guidelines. Overtly processes them to streamline your PR workflows and improve automation.",
                },
                {
                  question: "Can I set up custom workflows in Overtly?",
                  answer:
                    "Yes, Overtly lets you build workflows that fit your unique PR needs. Whether it's automating content approvals or complex media outreach, you can customise the steps, so they align with how your team works and what matters most to your strategy.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6 dark:hs-accordion-active:bg-white/10"
                >
                  <button
                    className="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-light text-start text-gray-800 rounded-lg transition hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
                    aria-expanded={openIndex === index}
                    onClick={() => toggleAccordion(index)}
                  >
                    {item.question}
                    <svg
                      className={`hs-accordion-active:hidden block shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400 ${
                        openIndex === index ? "hidden" : "block"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                    <svg
                      className={`hs-accordion-active:block hidden shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400 ${
                        openIndex === index ? "block" : "hidden"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  </button>
                  <div
                    className={`hs-accordion-content ${
                      openIndex === index ? "block" : "hidden"
                    } w-full overflow-hidden transition-[height] duration-300`}
                    role="region"
                    aria-labelledby={`hs-basic-with-title-and-arrow-stretched-heading-${index}`}
                  >
                    <p className="text-gray-800 dark:text-neutral-200">
                      {item.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* End Accordion */}
          </div>
        </div>{" "}
        <section className=" z-10 relative flex flex-col mt-20 mx-4 sm:mx-10 md:mx-20 lg:mx-72 bg-gradient-to-tr from-[#f0f9d6] to-[#ebeff7] rounded-full p-3 sm:p-8 md:p-10 overflow-hidden">
          <div className="flex justify-between items-center px-20">
            <h2 className="text-xl sm:text-4xl font-extralight p-3 sm:p-5 font-readex mb-2 ">
              Accelerate your PR work <br /> with modern AI tech
            </h2>
            <div className="relative ">
              {/* <img
                src="/arrow.png" // Update with the correct path
                alt="Arrow"
                className="absolute -top-36 -right-32 w-40 h-40 z-40 " // Adjust positioning and size as needed
              /> */}
              <HoverBorderGradient className="text-sm bg-black  text-white rounded-full px-4 sm:px-6 sm:py-3  py-2 z-10 hover:bg-gray-100 transition duration-300">
                Schedule Demo
              </HoverBorderGradient>
            </div>
          </div>
        </section>
      </section>
      {/* End FAQ */}
      {/*------------------------- demo ------------------------- */}
      <footer
        style={{
          background:
            "linear-gradient(to top, rgba(255, 139, 121, 0.4), rgba(255, 191, 54, 0.45), rgba(255, 255, 255, 1))",
        }}
        className=" px-4 pb-4"
      >
        <div className="w-full  bg-white   mx-auto rounded-b-3xl shadow  p-4 px-10 md:py-8">
          {" "}
          {/*------------------------- Footer ------------------------- */}
          <div className="mt-20 sm:flex sm:items-center sm:justify-between">
            <a className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
              <img
                src="/fullimage.png"
                className="w-20 sm:w-24 md:w-28 "
                alt="Logo"
              />
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024 <a className="hover:underline">Overtly</a>. All Rights
            Reserved.
          </span>
        </div>
      </footer>
    </section>
  );
};

export default LandingPage;
