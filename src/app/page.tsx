// src/app/page.tsx
"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { HoverBorderGradient } from "@/components/ui/HoverBorderGradient";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import Image from "next/image";

const logos = [
  { name: "Vercel", url: "/pubs1.svg" },
  { name: "Nextjs", url: "/pubs2.svg" },
  { name: "Prime", url: "/pubs3.svg" },
  { name: "Trustpilot", url: "/pubs4.svg" },
  { name: "Webflow", url: "/pubs5.svg" },
  { name: "Airbnb", url: "/pubs6.svg" },
  { name: "Tina", url: "/pubs7.svg" },
  { name: "Stackoverflow", url: "/pubs8.svg" },
];

const LandingPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [smartWorkflowActiveTab, setSmartWorkflowActiveTab] =
    useState<number>(0);
  const [researchActiveTab, setResearchActiveTab] = useState<number>(0);
  const [email, setEmail] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Add state to track if user is hovering/interacting with tabs
  const [isPaused, setIsPaused] = useState(false);

  // 1st animation
  const { rive: riveFirst, RiveComponent: RiveFirstComponent } = useRive({
    src: "/research.riv",
    stateMachines: "State Machine 1",
    animations: "Timeline 1",
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
    onStateChange: (event) => {
      console.log("State Changed:", event);
    },
    onLoad: () => {
      console.log("First Animation loaded");
      if (riveFirst) {
        // Changed from 'rive' to 'riveFirst'
        riveFirst.play("State Machine 1");
        riveFirst.play("Timeline 1");
      }
    },
  });

  // second Rive animation
  const { rive: riveSecond, RiveComponent: RiveSecondComponent } = useRive({
    src: "/workflow.riv",
    stateMachines: "State Machine 1", // Update this to match your workflow.riv state machine name
    animations: "Timeline 1", // Update this to match your workflow.riv animation name
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
    onStateChange: (event) => {
      console.log("Workflow State Changed:", event);
    },
    onLoad: () => {
      console.log("Workflow Animation loaded");
      if (riveSecond) {
        riveSecond.play("State Machine 1"); // Update with your state machine name
        riveSecond.play("Timeline 1"); // Update with your animation name
      }
    },
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleResearchTabClick = (index: number) => {
    setIsPaused(true);
    setResearchActiveTab(index);
    // Resume auto-switching after 10 seconds of inactivity
    setTimeout(() => setIsPaused(false), 10000);
  };

  const handleWorkflowTabClick = (index: number) => {
    setIsPaused(true);
    setSmartWorkflowActiveTab(index);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const handleAnalyticsTabClick = (index: number) => {
    setIsPaused(true);
    setActiveTab(index);
    setTimeout(() => setIsPaused(false), 10000);
  };

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

  const fetchData = useCallback(() => {
    // Your fetch logic here
  }, []); // Add dependencies if needed

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //feature content
  const SECTION_CONTENT = {
    research: {
      title: "Research &",
      subtitle: "Brainstorm With Ease",
      tabs: [
        {
          label: "Daily News Scans",
          title: "Read 1000s of articles in minutes",
          points: [
            "Daily scans made easy with a consolidated news feed delivered to you every day",
            "Easily pull data from multiple sources, all in one place",
            "Break down complex news and topic to create specialized narratives to form niche insights",
          ],
        },
        {
          label: "Trend Spotter",
          title: "Spot trends before it becomes one",
          points: [
            "Spot trends, and find new connections in your coverage",
            "Detect Precursor Trends, Trend Watch, seasonal patterns, cyclical trends, & Future-Proof your narratives",
            "Consolidated Report on Journalists & Outlets covering your niche",
          ],
        },
        {
          label: "Insight Engine",
          title: "Story ideas on demand, every hour",
          points: [
            "Get Daily Inspiration for Creative Pitches based on Trend Maps",
            "Receive ideas based on forecasted shifts—so you’re setting the story agenda, not following it",
            "Find insights that point you to great follow-up story ideas for every news",
          ],
        },
      ],
    },
    workflows: {
      title: "Smart Workflows &",
      subtitle: "Easy Task Automation",
      tabs: [
        {
          label: "PR Writing Assisstant",
          title: "Your PR-optimized writing companion",
          points: [
            "Write Messages That Sound Just Like You, Faster",
            "Speed up your writing with proven, customizable templates",
            "Refine your message with smart editing for maximum impact",
          ],
        },
        {
          label: "Pitch Generator",
          title: "Send hyper-personalized pitches at scale",
          points: [
            "Write well researched pitches easily in no time ",
            "Mimic your pitch & have the model write in your pitch style",
            "Write Specialised Pitches in minutes",
          ],
        },
        {
          label: "AI Journalist Selector",
          title: "Reach Journalists 3x More Likely to Cover Your Story",
          points: [
            "Choose whom to pitch with customized automated databases",
            "Personalize outreach based on what they write about",
            "Track past interactions with relevant journalists",
          ],
        },
      ],
    },
    analytics: {
      title: "Analytics",
      subtitle: "Real time reporting",
      tabs: [
        {
          label: "Auto Reports",
          title:
            "Effortlessly convert complex data into detailed PR reports in seconds",
          points: [
            "Hands free coverage Reports, Debriefing Docs, And Benchmarking",
            "Get real-time insights with live dashboards that automatically update as news unfolds",
            "Create concise report summaries & briefings",
          ],
        },
        {
          label: "Impact Tracker",
          title: "Quantify Your PR efforts In ease & accuracy",
          points: [
            "Automatically monitors - Mentions, Share of Voice (SoV), Media Quality, Coverage Quality Index, & Repeat Coverage rates",
            "Observe News Cycles Trends to gauge your campaign's impact over time",
            "Measure Pitch-to-Placement ratio, Time to Coverage, Pitch Conversion, and Media Contact Growth",
          ],
        },
        {
          label: "PR Visionary",
          title: "Overtly Empowers your next move with clarity",
          points: [
            "Spots content gaps & plans strategic actions to rectify & close them",
            "Catch a crisis early— know how to handle it before it erupts",
            "Covert your PR plans into detailed Timelines & strategies ",
          ],
        },
      ],
    },
  };

  // Add auto-switching functionality for tabs
  useEffect(() => {
    if (isPaused) return; // Don't run interval if paused

    const interval = setInterval(() => {
      // Research tabs
      setResearchActiveTab((prev) => 
        prev === SECTION_CONTENT.research.tabs.length - 1 ? 0 : prev + 1
      );
      
      // Workflow tabs
      setSmartWorkflowActiveTab((prev) => 
        prev === SECTION_CONTENT.workflows.tabs.length - 1 ? 0 : prev + 1
      );
      
      // Analytics tabs
      setActiveTab((prev) => 
        prev === SECTION_CONTENT.analytics.tabs.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]); // Re-run effect when isPaused changes

  return (
    <section className="font-readex">
      <div
        style={{
          background:
            "linear-gradient(to bottom, #FF8B7966, #FFBF3673, #FFFFFF)",
        }}
        className="bg-gradient-to-b p-2 lg:p-4 relative"
      >
        <div
          className="font-readex relative px-5 flex flex-col items-center justify-center rounded-t-3xl lg:min-h-screen bg-[#f7e3e5] z-10"
          style={{
            background:
              "linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF) padding-box, linear-gradient(to bottom, #f7e3e5 10%, transparent) border-box",
            border: "5px solid transparent",
            borderBottom: "0",
            borderRadius: "24px 24px 0 0",
          }}
        >
   
        <div className="absolute inset-0 h-full w-full flex justify-center z-0">
            <div className="h-full w-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:60px_60px] opacity-5"></div>
          </div>
          <div className="absolute top-8 left-5 lg:top-10 lg:left-10">
            <Image
              src="/logo1.svg"
              className="w-32 sm:w-28 md:w-32 4xl:w-60 ml-3"
              alt="Logo"
              width={128}
              height={128}
            />
          </div>
          <div className="sm:text-center mb-10  ">
            <div className="hidden  sm:flex flex-col sm:flex-row justify-center mb-4 ">
              <div className="flex  items-center border px-5 py-1 rounded-3xl font-light shadow-sm border-[#B57F19]/[0.17] z-0">
                <Image
                  src="/checkbox.svg"
                  alt="Checkmark"
                  className="w-4 h-4 4xl:w-10 4xl:h-10 mr-3"
                  width={16}
                  height={16}
                />
                <span className="text-[0.7rem] lg:text-sm 4xl:text-2xl text-[#8B775C] ">
                  In-House Comm Teams
                </span>
                <span className="mx-2 4xl:mx-5 text-gray-500">|</span>
                <span className="text-[0.7rem] lg:text-sm 4xl:text-2xl text-[#8B775C]">
                  PR Agencies
                </span>
                <span className="mx-2 4xl:mx-5 text-gray-500">|</span>
                <span className="text-[0.7rem] lg:text-sm 4xl:text-2xl text-[#8B775C]">
                  Indie PR freelancers
                </span>
              </div>
            </div>
            <div className="m-4">
              <div
                className="text-[2.9rem] sm:text-[4rem] lg:text-[4rem] xl:text-[4rem] 
                [@media(min-width:1600px)]:text-[5.5rem] [@media(min-width:1920px)]:text-[6rem] 
                mt-40 lg:mt-10 font-light text-[#454545]"
              >
                <h1 className="leading-[1.5] sm:leading-[1.2] bg-gradient-to-b from-black to-gray-400 bg-clip-text text-transparent">
                  Revolutionizing How Businesses Tell
                  <br />
                  Their Story to the World
                </h1>
              </div>

              <p
                className="mt-5 sm:mt-10 lg:text-lg xl:text-lg 
                [@media(min-width:1600px)]:text-xl [@media(min-width:1920px)]:text-2xl 
                font-light text-[#8A8A8A]"
              >
                Drives research, derives insights, replicates human thinking &
                writing, turns insights
                <br className="hidden lg:flex" />
                into actionable PR workflows with analytics & metric tracking.
              </p>
            </div>
          </div>
          <div className="flex font-light flex-col items-start mb-10 z-30 w-full sm:w-auto">
            <div className="flex flex-row items-center border border-gray-300 rounded-full w-full">
              <input
                type="email"
                placeholder="name@email.com"
                className="px-4 py-2 w-full bg-black bg-opacity-0 4xl:text-2xl sm:w-72 4xl:w-full rounded-full focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="bg-[#2C2B2B] hover:bg-black text-white rounded-full text-xs lg:text-base 4xl:text-2xl mr-1 ml-1 px-4 my-1 py-2"
                onClick={handleJoinWaitlist}
              >
                Join Waitlist
              </button>
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
      <section className="max-w-screen-2xl mt-10 sm:mt-0 mx-auto z-0">
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
          <button className="bg-[#FFF8E9] border border-[#FFC227] text-gray-600 text-sm font-[500] rounded-full px-8 py-1.5">
            Features
          </button>
          <div className="text-2xl sm:text-[45px] font-light mt-14 text-[#454545]">
            Transform your workflow into something{" "}
            <br className="hidden xl:block" />
            <span className="sm:inline-block sm:mt-3">extraordinary.</span>
          </div>
          <p className="mt-6 text-xl font-light text-gray-500">
            An AI that serves as a concierge, ensuring the human touch remains
            front and center.
          </p>
        </div>
        {/*-------------------------  how it works - research ------------------------- */}
        <div className="mt-20 py-16 lg:py-28 p-4 mx-3 md:p-6 md:mx-4 lg:p-8 lg:mx-20 xl:px-20 sm:py-32 bg-gradient-to-b from-blue-50 to-white rounded-3xl">
          <div className="flex flex-col max-w-7xl mx-auto items-start">
            <h2 className="mt-5 sm:mt-0 text-3xl md:text-4xl lg:text-5xl text-[#454545] font-[250]">
              {SECTION_CONTENT.research.title}
            </h2>
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-400 mt-2 font-extralight">
              {SECTION_CONTENT.research.subtitle}
            </h2>

            {/* Research section tab buttons */}
            <div className="gap-1 sm:gap-3 mt-8 flex flex-wrap">
              {SECTION_CONTENT.research.tabs.map((tab, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => handleResearchTabClick(index)}
                    className="border border-[#A2BEA0] font-light text-xs md:text-sm lg:text-base rounded-full px-3 md:px-4 py-1.5 mb-2 relative overflow-hidden bg-white"
                  >
                    <div
                      className={`absolute inset-0 h-full bg-[#A2BEA0] transition-all duration-500 ease-in-out`}
                      style={{
                        width: researchActiveTab === index ? "100%" : "0%",
                      }}
                    />
                    <span
                      className={`relative z-10 ${
                        researchActiveTab === index
                          ? "text-white"
                          : "text-[#486946]"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Research content section */}
            <div className="flex flex-col md:flex-row w-full gap-4 md:gap-6 lg:gap-10 xl:gap-40 mt-6 md:mt-8 lg:mt-20">
              {/* Fixed image container */}
              <div className="flex justify-center items-center w-full md:w-1/2">
                <div className="w-full h-48 md:h-56 lg:h-64 rounded-3xl flex items-center justify-center relative">
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <Image
                      src="/research.svg"
                      alt="Overlay Pattern"
                      layout="fill"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="absolute inset-0 -top-4 -left-[2rem] md:-top-44 md:-left-14 z-0">
                    <RiveFirstComponent className="w-full h-full md:w-[600px] md:h-[600px] rounded-3xl bg-transparent" />
                  </div>
                </div>
              </div>

              {/* Dynamic text content */}
              <div className="flex flex-col items-start justify-center w-full md:w-1/2 mt-6 md:mt-0">
                {SECTION_CONTENT.research.tabs[researchActiveTab] && (
                  <>
                    <h3 className="text-xl md:text-2xl lg:text-3xl text-[#454545] font-light">
                      {SECTION_CONTENT.research.tabs[researchActiveTab].title}
                    </h3>
                    <ul className="text-sm md:text-base lg:text-lg xl:text-[19px] w-full max-w-full lg:max-w-[32rem] xl:max-w-none text-gray-400 space-y-6 md:space-y-5 font-light list-inside mt-4 md:mt-6 lg:mt-8">
                      {SECTION_CONTENT.research.tabs[
                        researchActiveTab
                      ].points.map((point, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 md:gap-3 lg:gap-5"
                        >
                          <Image
                            src="/plus2.svg"
                            alt="Plus Icon"
                            className="inline-block w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 mt-1 flex-shrink-0"
                            width={16}
                            height={16}
                          />
                          <span className="flex-1">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/*-------------------------  how it works - Smart Workflows ------------------------- */}
        <div className="mt-16 py-16 lg:py-28 md:mt-20 p-4 mx-3 md:p-6 md:mx-4 lg:p-8 lg:mx-20 xl:px-20 sm:py-32 bg-gradient-to-b from-blue-50 to-white rounded-3xl">
          <div className="flex flex-col max-w-7xl mx-auto items-start">
            <h2 className="text-3xl lg:text-4xl text-[#454545] font-[250]">
              {SECTION_CONTENT.workflows.title}
            </h2>
            <h2 className="text-xl md:text-2xl text-gray-400 mt-2 font-extralight">
              {SECTION_CONTENT.workflows.subtitle}
            </h2>

            {/* Tab buttons */}
            <div className="gap-1 sm:gap-3 mt-8 flex flex-wrap">
              {SECTION_CONTENT.workflows.tabs.map((tab, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => handleWorkflowTabClick(index)}
                    className="border border-[#A2BEA0] font-light text-xs md:text-sm lg:text-base rounded-full px-3 md:px-4 py-1.5 mb-2 relative overflow-hidden bg-white"
                  >
                    <div
                      className={`absolute inset-0 h-full bg-[#A2BEA0] transition-all duration-500 ease-in-out`}
                      style={{
                        width: smartWorkflowActiveTab === index ? "100%" : "0%",
                      }}
                    />
                    <span
                      className={`relative z-10 ${
                        smartWorkflowActiveTab === index
                          ? "text-white"
                          : "text-[#486946]"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Content section */}
            <div className="flex flex-col md:flex-row w-full gap-4 md:gap-6 lg:gap-10 xl:gap-40 mt-6 md:mt-8 lg:mt-20">
              {/* Fixed image container */}
              <div className="flex justify-center items-center w-full md:w-1/2">
                <div className="w-full h-48 md:h-56 lg:h-64 rounded-3xl flex items-center justify-center relative">
                  <RiveSecondComponent className="w-full h-full md:w-[600px] md:h-[320px] bg-white rounded-3xl" />
                  <div className="absolute inset-0 md:w-[520px] md:h-[500px] md:-top-[8.94rem] md:left-10 pointer-events-none">
                    <Image
                      src="/workflow.svg"
                      alt="Overlay Pattern"
                      layout="fill"
                      className="w-full h-full md:pt-10"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic text content */}
              <div className="flex flex-col items-start justify-center w-full md:w-1/2 mt-6 md:mt-0">
                {SECTION_CONTENT.workflows.tabs[smartWorkflowActiveTab] && (
                  <>
                    <h3 className="text-xl md:text-2xl lg:text-3xl text-[#454545] font-light">
                      {
                        SECTION_CONTENT.workflows.tabs[smartWorkflowActiveTab]
                          .title
                      }
                    </h3>
                    <ul className="text-sm md:text-base lg:text-lg xl:text-[19px] w-full max-w-full lg:max-w-[32rem] xl:max-w-none text-gray-400 space-y-6 md:space-y-5 font-light list-inside mt-4 md:mt-6 lg:mt-8">
                      {SECTION_CONTENT.workflows.tabs[
                        smartWorkflowActiveTab
                      ].points.map((point, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 md:gap-3 lg:gap-5"
                        >
                          <Image
                            src="/plus2.svg"
                            alt="Plus Icon"
                            className="inline-block w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 mt-1 flex-shrink-0"
                            width={16}
                            height={16}
                          />
                          <span className="flex-1">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/*-------------------------  how it works - Analytics ------------------------- */}
        <div className="mt-1 py-16 lg:py-28 md:mt-20 p-4 mx-3 md:p-6 md:mx-4 lg:p-8 lg:mx-20 xl:px-20 sm:py-32 bg-gradient-to-b from-blue-50 to-white rounded-3xl">
          <div className="flex flex-col max-w-7xl mx-auto items-start">
            <h2 className="text-3xl lg:text-4xl text-[#454545] font-[250]">
              {SECTION_CONTENT.analytics.title}
            </h2>
            <h2 className="text-xl md:text-2xl text-gray-400 mt-2 font-extralight">
              {SECTION_CONTENT.analytics.subtitle}
            </h2>

            {/* Tab buttons */}
            <div className="gap-1 sm:gap-3 mt-8 flex flex-wrap">
              {SECTION_CONTENT.analytics.tabs.map((tab, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => handleAnalyticsTabClick(index)}
                    className="border border-[#A2BEA0] font-light text-xs md:text-sm lg:text-base rounded-full px-3 md:px-4 py-1.5 mb-2 relative overflow-hidden bg-white"
                  >
                    <div
                      className={`absolute inset-0 h-full bg-[#A2BEA0] transition-all duration-500 ease-in-out`}
                      style={{
                        width: activeTab === index ? "100%" : "0%",
                      }}
                    />
                    <span
                      className={`relative z-10 ${
                        activeTab === index ? "text-white" : "text-[#486946]"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                </div>
              ))}
            </div>

            {/* Content section */}
            <div className="flex flex-col md:flex-row w-full gap-4 md:gap-6 lg:gap-10 xl:gap-40 mt-6 md:mt-8 lg:mt-10">
              {/* Fixed image container */}
              <div className="md:w-[40%] h-48 md:h-56 lg:h-64 rounded-3xl flex items-center justify-center relative">
                <div className="absolute inset-0  pointer-events-none">
                  <Image
                    src="/analytics.svg"
                    alt="Overlay Pattern"
                    layout="fill"
                    className=""
                  />
                </div>
              </div>

              {/* Dynamic text content */}
              <div className="flex flex-col items-start justify-center w-full md:w-1/2 mt-6 md:mt-0">
                {SECTION_CONTENT.analytics.tabs[activeTab] && (
                  <>
                    <h3 className="text-xl md:text-2xl lg:text-3xl text-[#454545] font-light">
                      {SECTION_CONTENT.analytics.tabs[activeTab].title}
                    </h3>
                    <ul className="text-sm md:text-base lg:text-lg xl:text-[19px] w-full max-w-full lg:max-w-[32rem] xl:max-w-none text-gray-400 space-y-6 md:space-y-5 font-light list-inside mt-4 md:mt-6 lg:mt-8">
                      {SECTION_CONTENT.analytics.tabs[activeTab].points.map(
                        (point, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 md:gap-3 lg:gap-5"
                          >
                            <Image
                              src="/plus2.svg"
                              alt="Plus Icon"
                              className="inline-block w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 mt-1 flex-shrink-0"
                              width={16}
                              height={16}
                            />
                            <span className="flex-1">{point}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/*------------------------- New Understanding PR Section ------------------------- */}
        <div className="text-center mt-20 ">
          <h2 className="text-3xl sm:text-4xl font-light mt-14 text-[#616060]">
            Finally, a tool that understands PR — from <br /> start to finish.
          </h2>
          <p className="mt-6 mx-4 sm:mx-0 sm:text-lg font-light text-gray-500">
            With a knack for understanding complex data, our reasoning engine
            simplifies your <br /> approach to PR, making it more effective and
            intuitive.
          </p>
        </div>
        <section className="bg-white mt-10">
          <div className="py-4 px-2 mx-auto max-w-screen-xl items-center sm:py-4 lg:px-6">
            <div className="flex justify-center items-center">
              {" "}
              {/* Added flex and centering */}
              <Image
                src="/ui.png"
                alt="UI Screenshot"
                className="inline-block flex-shrink-0"
                width={1000}
                height={800}
              />
            </div>
            {/* <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-1 h-full">
              <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-gray-50 h-auto flex flex-col">
                <a className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow">
                  <Image
                    src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5" />
                  <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-3xl">
                    Wines
                  </h3>
                </a>
              </div>
              <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-stone-50">
                <div className="grid gap-1 grid-cols-2 sm:grid-cols-2 lg:grid-cols-2">
                  <a className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40">
                    <Image
                      src="https://images.unsplash.com/photo-1571104508999-893933ded431?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5" />
                    <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-3xl">
                      Whiskey
                    </h3>
                  </a>
                  <a className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40">
                    <Image
                      src="https://images.unsplash.com/photo-1626897505254-e0f811aa9bf7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5" />
                    <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-3xl">
                      Vodka
                    </h3>
                  </a>
                </div>
                <a className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 mt-1">
                  <Image
                    src="https://images.unsplash.com/photo-1504675099198-7023dd85f5a3?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-900/25 to-gray-900/5" />
                  <h3 className="z-10 text-2xl font-medium text-white absolute top-0 left-0 p-4 xs:text-xl md:text-3xl">
                    Gin
                  </h3>
                </a>
              </div>
            </div> */}
          </div>
        </section>
        {/*------------------------- Faq ------------------------- */}
        {/* FAQ */}
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mt-20 mx-auto">
          {/* Title */}
          <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
            <h2 className="text-3xl sm:text-2xl font-light md:text-4xl md:leading-tight ">
              Common Answered Queries
            </h2>
            <p className="mt-3  text-gray-600 ">
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
                    "Overtly integrates research, workflows, and analytics to create a connected system. Overtly uses contextual learning to understand your company’s voice and PR strategy.  It tailors communications based on historical data and industry trends, unlike other tools that rely on generic models. It's a PR-specific approach where everything—research, workflows, and writing.",
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
                  answer: `
                    <p><strong >Businesses:</strong> Overtly streamlines your internal PR efforts, automating routine tasks so your team can focus on strategic storytelling and brand positioning.</p>
                    <p><strong>PR Freelancers:</strong> Automate media research, reporting, and pitch writing, enabling you to manage multiple clients with ease while ensuring high-quality, personalised communication.</p>
                    <p><strong>PR Agencies:</strong> Manage multiple clients, track performance, and enhance media outreach through data-driven insights and automated workflows—enabling your team to scale up without losing quality or personalization.</p>
                  `,
                },
                {
                  question:
                    "What types of documents can be uploaded to Overtly?",
                  answer:
                    "You can upload any PR-related documents, including press releases, media lists, media outreach content, campaign reports, and brand guidelines. Overtly processes them to streamline your PR workflows and improve automation.",
                },
                {
                  question:
                    "What types of documents can be uploaded to Overtly?",
                  answer:
                    "Yes, Overtly lets you build workflows that fit your unique PR needs. Whether it's automating content approvals or complex media outreach, you can customise the steps, so they align with how your team works and what matters most to your strategy.",
                },
                {
                  question: "How secure is the document ingestion process?",
                  answer:
                    "All documents are encrypted end-to-end. We follow strict data protection regulations (GDPR, CCPA) and ensure only authorised access. You have full control over who sees your documents, with all actions logged for full transparency.",
                },

                {
                  question:
                    "How does Overtly help in personalising media outreach?",
                  answer:
                    "Overtly analyses journalist coverage, their style, and engagement patterns. It ranks journalists based on relevance and suggests how to tailor your outreach, ensuring you're targeting the right media with the most effective messaging.",
                },
                {
                  question: "Can I set up custom workflows in Overtly?",
                  answer:
                    "Yes, Overtly lets you build workflows that fit your unique PR needs. Whether it's automating content approvals or complex media outreach, you can customise the steps, so they align with how your team works and what matters most to your strategy.",
                },
                {
                  question:
                    "How does Overtly improve PR communication with its contextual understanding?",
                  answer:
                    "Overtly analyses past data and patterns to understand the nuances of your PR approach. It automates communication in a way that keeps your messaging aligned with your goals and current trends, making it timely and relevant to the audience.",
                },
                {
                  question: "How do I find out Overtly pricing?",
                  answer:
                    "Pricing is tailored to your needs. We recommend scheduling a call to discuss how Overtly can support your team or agency. Based on your goals, we will provide a pricing plan that fits your specific requirements.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <button
                    className="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-light text-start text-gray-800 rounded-lg transition hover:text-black focus:outline-none"
                    aria-expanded={
                      openIndex === index || hoveredIndex === index
                    }
                    onClick={() => toggleAccordion(index)}
                  >
                    {item.question}
                    <svg
                      className={`hs-accordion-active:hidden shrink-0 size-5 text-gray-600 group-hover:text-gray-500 ${
                        openIndex === index || hoveredIndex === index
                          ? "hidden"
                          : "block"
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
                      className={`hs-accordion-active:block shrink-0 size-5 ${
                        openIndex === index || hoveredIndex === index
                          ? "block"
                          : "hidden"
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
                      openIndex === index || hoveredIndex === index
                        ? "block"
                        : "hidden"
                    } w-full overflow-hidden transition-[height] text-gray-500 font-light duration-300`}
                    role="region"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                    aria-labelledby={`hs-basic-with-title-and-arrow-stretched-heading-${index}`}
                  />
                </div>
              ))}
            </div>
            {/* End Accordion */}
          </div>
        </div>{" "}
        <section className="z-20 lg:py-5 relative flex flex-col mt-10 sm:mt-40 mx-4  md:mx-40 xl:mx-72  bg-gradient-to-tr from-[#f2fcd4c9] to-[#ebeff7] rounded-[2rem]  overflow-visible">
          {/* <Image
            src="/noise.svg" // Update with the correct path
            alt="Arrow"
            width={100}
            height={100}
            className="absolute w-full h-full" // Ensure it's on top
          /> */}
          <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-8 md:px-20 m-5 sm:m-8 md:m-10 ">
            <h2 className="text-lg sm:text-4xl md:w-[30rem] md:text-4xl text-left text-gray-700 font-light p-2 sm:p-3 md:p-5 font-readex sm:mb-2 ">
              Accelerate your PR work with modern AI tech
            </h2>
            <div className="relative mt-4 md:mt-0">
              <Image
                src="/arrow.svg" // Update with the correct path
                alt="Arrow"
                width={96}
                height={96}
                className="hidden md:block absolute -top-36 -right-28 w-32 h-32 z-50" // Ensure it's on top
              />
              <HoverBorderGradient  onClick={() =>
                window.open(
                  "https://calendly.com/siddhar/30min",
                  "_blank",
                  "noopener"
                )
              }  className="text-sm bg-black text-white rounded-full px-4 sm:px-6 py-2 sm:py-3 z-10 hover:bg-gray-100 transition duration-300">
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
        className=" px-2 pb-2 sm:px-4 sm:pb-4"
      >
        <div className="w-full  bg-white   mx-auto rounded-b-3xl shadow p-4 px-5 sm:px-20 md:py-8">
          {" "}
          {/*------------------------- Footer ------------------------- */}
          <div className="mt-28 sm:mt-40 sm:flex sm:items-center sm:justify-between">
            <a className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
              <Image
                src="/logo1.svg"
                className="w-40 "
                alt="Logo"
                width={96}
                height={96}
              />
            </a>
          </div>
          <h1 className=" mt-10  text-gray-500">Socials</h1>
          <div className="flex justify-between sm:mr-40   mt-5  sm:mb-16">
            <ul className=" space-y-3 items-center mb-6 text-sm font-light text-gray-500 sm:mb-0 ">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Twitter
                </a>
              </li>{" "}
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Facebook
                </a>
              </li>
            </ul>
            <ul className=" space-y-3 items-center text-left mb-6 text-sm font-medium text-gray-500 sm:mb-0 ">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
          <div className="flex justify-center sm:block sm:justify-between">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between text-sm text-gray-400 font-light">
              <div className="mt-4 sm:mt-0 text-center sm:text-left">
                © 2024 <a className="hover:underline">Overtly</a>.
              </div>
              <ul className="flex  sm:flex-row sm:items-center text-sm font-normal text-gray-500 ">
                <li>
                  <a href="#" className="hover:underline me-4 md:me-6">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline me-4 md:me-6">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default LandingPage;
