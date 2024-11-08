// src/app/page.tsx
"use client";
import React, { useState, useRef, useEffect } from "react";

const logos = [
  {
    name: "Vercel",
    url: "https://res.cloudinary.com/dfhp33ufc/image/upload/v1715881430/vercel_wordmark_dark_mhv8u8.svg",
  },
  {
    name: "Nextjs",
    url: "https://res.cloudinary.com/dfhp33ufc/image/upload/v1715881475/nextjs_logo_dark_gfkf8m.svg",
  },
  {
    name: "Prime",
    url: "https://res.cloudinary.com/dfhp33ufc/image/upload/v1715276558/logos/t2awrrfzdvmg1chnzyfr.svg",
  },
  {
    name: "Trustpilot",
    url: "https://res.cloudinary.com/dfhp33ufc/image/upload/v1715276558/logos/tkfspxqmjflfllbuqxsi.svg",
  },
  {
    name: "Webflow",
    url: "https://res.cloudinary.com/dfhp33ufc/image/upload/v1715276560/logos/nymiivu48d5lywhf9rpf.svg",
  },

  {
    name: "Airbnb",
    url: "https://res.cloudinary.com/dfhp33ufc/image/upload/v1715276558/logos/pmblusboe7vkw8vxdknx.svg",
  },
  {
    name: "Tina",
    url: "https://res.cloudinary.com/dfhp33ufc/image/upload/v1715276560/logos/afqhiygywyphuou6xtxc.svg",
  },
  {
    name: "Stackoverflow",
    url: "https://res.cloudinary.com/dfhp33ufc/image/upload/v1715276558/logos/ts1j4mkooxqmscgptafa.svg",
  },
  {
    name: "mistral",
    url: "https://res.cloudinary.com/dfhp33ufc/image/upload/v1715276558/logos/tyos2ayezryjskox3wzs.svg",
  },
];
const LandingPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleScroll = (event: WheelEvent) => {
    if (!scrollRef.current) return;

    const delta = event.deltaY > 0 ? 1 : -1;
    setActiveTab((prev) => {
      let newTab = prev + delta;
      if (newTab < 0) newTab = 0;
      if (newTab > 2) newTab = 2;
      return newTab;
    });
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("wheel", handleScroll, { passive: false });
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("wheel", handleScroll);
      }
    };
  }, []);

  return (
    <section className="font-readex ">
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgba(255, 139, 121, 0.4), rgba(255, 191, 54, 0.45), rgba(255, 255, 255, 1))",
        }}
        className="bg-gradient-to-b p-2 lg:p-5  relative"
      >
        <div className=" font-readex px-5 flex flex-col items-center justify-center rounded-3xl lg:min-h-screen bg-gradient-to-b from-[#FBFBFB] to-[#FFFFFF] z-10">
          {/* Background Image */}
          {/* <div className="absolute inset-0 bg-[url('/twistedbg.png')] bg-no-repeat bg-bottom bg-[length:100%_50%] z-20"></div> */}
          {/* Logo */}
          <div className=" absolute top-8 left-5 lg:top-14 lg:left-14">
            <img
              src="/fullimage.png"
              className="w-32 sm:w-28 md:w-32 4xl:w-60 ml-3"
              alt="Logo"
            />
          </div>
          {/*-------------------------  Main Content ------------------------- */}
          <div className=" sm:text-center mb-10  pt-24 lg:pt-10">
            <div className="hidden sm:flex flex-col sm:flex-row justify-center mb-4">
              <div className="flex items-center border px-5 py-1 rounded-3xl font-light border-gray-300">
                <img
                  src="/checkbox.png"
                  alt="Checkmark"
                  className="w-4 h-4 4xl:w-10 4xl:h-10  mr-3"
                />
                <span className="text-[0.7rem] lg:text-sm 4xl:text-2xl  text-gray-400">
                  In-House Comm Teams
                </span>
                <span className="mx-2 4xl:mx-5  text-gray-400">|</span>
                <span className="text-[0.7rem] lg:text-sm 4xl:text-2xl  text-gray-400">
                  PR Agencies
                </span>
                <span className="mx-2 4xl:mx-5 text-gray-400">|</span>
                <span className="text-[0.7rem]  lg:text-sm 4xl:text-2xl text-gray-400">
                  Indie PR freelancers
                </span>
              </div>
            </div>
            <div className="text-[2.9rem]  sm:text-[3.50rem] 4xl:text-[5rem] mt-10 lg:mt-0 lg:m-10 font-light text-[#454545] ">
              <h1>
                The Complete AI Engine for <br className="hidden sm:flex" />
                your PR workflows
              </h1>{" "}
            </div>

            <p className="mt-4   lg:text-lg 4xl:text-3xl font-light text-[#8A8A8A]">
              Automates in depth research, simulates brainstorming shapes
              insights into workflows <br className="hidden lg:flex" />
              using data and AI for analytics & measurement.
            </p>
          </div>
          <div className="flex font-light flex-col  items-center mb-10 z-30">
            <div
              className="flex flex-row items-center  border border-gr
ay-300 rounded-full w-full sm:w-auto"
            >
              <input
                type="email"
                placeholder="name@email.com"
                className="px-4 py-2 w-full 4xl:text-2xl  sm:w-72 4xl:w-full rounded-full focus:outline-none"
              />
              <button className="bg-[#2C2B2B] text-white rounded-full text-xs lg:text-base 4xl:text-2xl mr-1 px-4 my-1 py-2">
                Join Waitlist
              </button>
            </div>
          </div>
          <div className="absolute top-8 right-6 lg:top-14 lg:right-16">
            <button className="bg-[#2C2B2B] text-white font-light text-[0.6rem]  lg:text-sm  4xl:text-2xl rounded-full px-4 py-3 4xl:px-8 4xl:py-5 ">
              Schedule Free Demo
            </button>
          </div>
        </div>
      </div>
      {/*-------------------------  sponsors------------------------- */}
      <div className=" w-full sm:py-12 text-center">
        <div className="text-lg font-light  mt-14 text-[#454545] ">
          Curated news sources & articles from 100,000's of publications
          worldwide
        </div>
        <div className="mx-auto w-full px-4 md:px-8">
          <div
            className="group relative mt-6 flex gap-6 overflow-hidden p-2"
            style={{
              maskImage:
                "linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)",
            }}
          >
            {Array(5)
              .fill(null)
              .map((index) => (
                <div
                  key={index}
                  className="flex shrink-0 animate-logo-cloud flex-row justify-around gap-6"
                >
                  {logos.map((logo, key) => (
                    <img
                      key={key}
                      src={logo.url}
                      className="h-10 w-28 px-2 brightness-0  dark:invert"
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
        {" "}
        <button className=" bg-[#F5E0D3] text-gray-600 text-sm font-[500] rounded-full px-8 py-1.5">
          Features
        </button>
        <h2 className=" text-2xl sm:text-4xl font-light  mt-14 text-[#454545]">
          Plug in AI that slides in without a single workflow tweak.
        </h2>
        <p className="mt-6 text-lg font-light text-gray-500">
          An AI that coexists, ensuring the human touch remains front and
          center.
        </p>
      </div>{" "}
      {/*-------------------------  how it works - research ------------------------- */}
      <div className="mt-20 p-8 mx-10 sm:px-20 sm:py-32 bg-gradient-to-b from-blue-50 to-white rounded-3xl sm:min-h-screen">
        <div
          className="flex flex-col items-start hide-scrollbar"
          ref={scrollRef}
          style={{
            overflowY: "auto",
            maxHeight: "400px",
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none", // For Internet Explorer and Edge
          }}
          // Hide scrollbar for WebKit browsers (Chrome, Safari)
        >
          <style>
            {`
              .hide-scrollbar::-webkit-scrollbar {
                display: none; /* Safari and Chrome */
              }
            `}
          </style>
          <h2 className="text-2xl text-[#454545] font-[250]">Research &</h2>
          <h2 className="text-2xl text-gray-400 font-extralight">
            Brainstorm With Ease
          </h2>
          <div className="space-x-2 mt-8 flex flex-wrap">
            <button
              onClick={() => setActiveTab(0)}
              className={`border border-[#A2BEA0] font-light text-sm rounded-full px-4 py-1.5 mb-2 ${
                activeTab === 0 ? "bg-[#A2BEA0]" : ""
              }`}
            >
              Curated News 1
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`border border-[#A2BEA0] font-light text-sm rounded-full px-4 py-1.5 mb-2 ${
                activeTab === 1 ? "bg-[#A2BEA0]" : ""
              }`}
            >
              Curated News 2
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`border border-[#A2BEA0] font-light text-sm rounded-full px-4 py-1.5 mb-2 ${
                activeTab === 2 ? "bg-[#A2BEA0]" : ""
              }`}
            >
              Curated News 3
            </button>
          </div>
          {/* image and Description start */}
          {activeTab === 0 && (
            <div className="sm:flex sm:w-full sm:gap-40">
              <div className="flex justify-center items-center mt-10 w-full">
                <div className="w-full h-56 bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img
                    src="/path/to/curated-news-1-image.png" // Update with actual image path
                    alt="Curated News 1"
                    className="h-full w-auto max-w-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col pt-10 items-start mt-10 w-full">
                <h3 className="text-xl text-[#454545] font-light">
                  Read 1000s of articles in seconds
                </h3>
                <ul className="list-disc text-sm text-gray-500 space-y-2 font-extralight list-inside mt-2">
                  <li>Analyze how stories transform over time</li>
                  <li> Instantly breakdown complex news topics</li>
                  <li> Outsmart competition with laser-focused insights</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="sm:flex sm:w-full sm:gap-40">
              <div className="flex justify-center items-center mt-10 w-full">
                <div className="w-full h-56 bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img
                    src="/path/to/curated-news-2-image.png" // Update with actual image path
                    alt="Curated News 2"
                    className="h-full w-auto max-w-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col pt-10 items-start mt-10 w-full">
                <h3 className="text-lg text-[#454545] font-light">
                  Spot trends before it becomes one
                </h3>
                <ul className="list-disc text-sm text-gray-500 space-y-2 font-extralight list-inside mt-2">
                  <li>
                    Consolidated Report on Journalists and Outlets covering your
                    niche
                  </li>
                  <li>
                    Examine seasonal patterns, cyclical trends, & anomalies
                  </li>
                  <li>Adapt your stories as they evolve</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="sm:flex sm:w-full sm:gap-40">
              <div className="flex justify-center items-center mt-10 w-full">
                <div className="w-full h-56 bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img
                    src="/path/to/curated-news-3-image.png" // Update with actual image path
                    alt="Curated News 3"
                    className="h-full w-auto max-w-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col pt-10 items-start mt-10 w-full">
                <h3 className="text-lg text-[#454545] font-light">
                  Story ideas on demand, every hour
                </h3>
                <ul className="list-disc text-sm text-gray-500 space-y-2 font-extralight list-inside mt-2">
                  <li>
                    Find insights that point you to great follow-up story ideas
                    for every news
                  </li>
                  <li>Get Daily Inspiration for Creative Pitches</li>{" "}
                  <li>
                    Find ideas that bridge your content gaps with competes &
                    industry.{" "}
                  </li>
                </ul>
              </div>
            </div>
          )}
          {/* image and Description end */}
        </div>
      </div>
      {/*-------------------------  how it works - Workflows ------------------------- */}
      <div className="mt-20 p-8 mx-10 sm:px-20 sm:py-32 bg-gradient-to-b from-blue-50 to-white rounded-3xl sm:min-h-screen">
        <div
          className="flex flex-col items-start hide-scrollbar"
          ref={scrollRef}
          style={{
            overflowY: "auto",
            maxHeight: "400px",
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none", // For Internet Explorer and Edge
          }}
          // Hide scrollbar for WebKit browsers (Chrome, Safari)
        >
          <style>
            {`
              .hide-scrollbar::-webkit-scrollbar {
                display: none; /* Safari and Chrome */
              }
            `}
          </style>
          <h2 className="text-2xl text-[#454545] font-[250]">Workflows &</h2>
          <h2 className="text-2xl text-gray-400 font-extralight">
            Brainstorm With Ease
          </h2>
          <div className="space-x-2 mt-8 flex flex-wrap">
            <button
              onClick={() => setActiveTab(0)}
              className={`border border-[#A2BEA0] font-light text-sm rounded-full px-4 py-1.5 mb-2 ${
                activeTab === 0 ? "bg-[#A2BEA0]" : ""
              }`}
            >
              Curated News 1
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`border border-[#A2BEA0] font-light text-sm rounded-full px-4 py-1.5 mb-2 ${
                activeTab === 1 ? "bg-[#A2BEA0]" : ""
              }`}
            >
              Curated News 2
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`border border-[#A2BEA0] font-light text-sm rounded-full px-4 py-1.5 mb-2 ${
                activeTab === 2 ? "bg-[#A2BEA0]" : ""
              }`}
            >
              Curated News 3
            </button><button
              onClick={() => setActiveTab(3)}
              className={`border border-[#A2BEA0] font-light text-sm rounded-full px-4 py-1.5 mb-2 ${
                activeTab === 3 ? "bg-[#A2BEA0]" : ""
              }`}
            >
              Curated News 4
            </button>
          </div>
          {/* image and Description start */}
          {activeTab === 0 && (
            <div className="sm:flex sm:w-full sm:gap-40">
              <div className="flex justify-center items-center mt-10 w-full">
                <div className="w-full h-56 bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img
                    src="/path/to/curated-news-1-image.png" // Update with actual image path
                    alt="Curated News 1"
                    className="h-full w-auto max-w-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col pt-10 items-start mt-10 w-full">
                <h3 className="text-xl text-[#454545] font-light">
                Find the right journalist to tell your story
                </h3>
                <ul className="list-disc text-sm text-gray-500 space-y-2 font-extralight list-inside mt-2">
                  <li>Choose whom to pitch with customized automated databases</li>
                  <li>Personalize outreach based on their content</li>
                  <li>Track past interactions with relevant journalists</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="sm:flex sm:w-full sm:gap-40">
              <div className="flex justify-center items-center mt-10 w-full">
                <div className="w-full h-56 bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img
                    src="/path/to/curated-news-2-image.png" // Update with actual image path
                    alt="Curated News 2"
                    className="h-full w-auto max-w-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col pt-10 items-start mt-10 w-full">
                <h3 className="text-lg text-[#454545] font-light">
                767 
                </h3>
                <ul className="list-disc text-sm text-gray-500 space-y-2 font-extralight list-inside mt-2">
                  <li>
                  Write well researched pitches easily in no time 
                  </li>
                  <li>
                  Mimic your pitch & have the model write in your pitch style
                  </li>
                  <li>Personalized pitches at scale</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="sm:flex sm:w-full sm:gap-40">
              <div className="flex justify-center items-center mt-10 w-full">
                <div className="w-full h-56 bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img
                    src="/path/to/curated-news-3-image.png" // Update with actual image path
                    alt="Curated News 3"
                    className="h-full w-auto max-w-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col pt-10 items-start mt-10 w-full">
                <h3 className="text-lg text-[#454545] font-light">
                Your PR-optimized writing companion
                </h3>
                <ul className="list-disc text-sm text-gray-500 space-y-2 font-extralight list-inside mt-2">
                  <li>
                  Streamline your PR writing with an AI assistant experienced in content workflows
                  </li>
                  <li>Re purpose new story angles to mirror the brand tone</li>{" "}
                  <li>
                  Content calendar/Automated Follow-ups
                  </li>
                </ul>
              </div>
            </div>
          )}{activeTab === 3 && (
            <div className="sm:flex sm:w-full sm:gap-40">
              <div className="flex justify-center items-center mt-10 w-full">
                <div className="w-full h-56 bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img
                    src="/path/to/curated-news-3-image.png" // Update with actual image path
                    alt="Curated News 3"
                    className="h-full w-auto max-w-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col pt-10 items-start mt-10 w-full">
                <h3 className="text-lg text-[#454545] font-light">
                Build Your Own Custom Content Blocks
                </h3>
                <ul className="list-disc text-sm text-gray-500 space-y-2 font-extralight list-inside mt-2">
                  <li>
                  Automates repetitive tasks like follow-ups & scheduling
                  </li>
                  <li>Combine and customize blocks tailored to achieve specific PR objectives.</li>{" "}
                 
                </ul>
              </div>
            </div>
          )}
          {/* image and Description end */}
        </div>
      </div>
      {/*-------------------------  how it works - research ------------------------- */}
      <div className="mt-20 p-8 mx-10 sm:px-20 sm:py-32 bg-gradient-to-b from-blue-50 to-white rounded-3xl sm:min-h-screen">
        <div
          className="flex flex-col items-start hide-scrollbar"
          ref={scrollRef}
          style={{
            overflowY: "auto",
            maxHeight: "400px",
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none", // For Internet Explorer and Edge
          }}
          // Hide scrollbar for WebKit browsers (Chrome, Safari)
        >
          <style>
            {`
              .hide-scrollbar::-webkit-scrollbar {
                display: none; /* Safari and Chrome */
              }
            `}
          </style>
          <h2 className="text-2xl text-[#454545] font-[250]">Analytics & Reporting</h2>
          <h2 className="text-2xl text-gray-400 font-extralight">
            Brainstorm With Ease
          </h2>
          <div className="space-x-2 mt-8 flex flex-wrap">
            <button
              onClick={() => setActiveTab(0)}
              className={`border border-[#A2BEA0] font-light text-sm rounded-full px-4 py-1.5 mb-2 ${
                activeTab === 0 ? "bg-[#A2BEA0]" : ""
              }`}
            >
              Curated News 1
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`border border-[#A2BEA0] font-light text-sm rounded-full px-4 py-1.5 mb-2 ${
                activeTab === 1 ? "bg-[#A2BEA0]" : ""
              }`}
            >
              Curated News 2
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`border border-[#A2BEA0] font-light text-sm rounded-full px-4 py-1.5 mb-2 ${
                activeTab === 2 ? "bg-[#A2BEA0]" : ""
              }`}
            >
              Curated News 3
            </button>
          </div>
          {/* image and Description start */}
          {activeTab === 0 && (
            <div className="sm:flex sm:w-full sm:gap-40">
              <div className="flex justify-center items-center mt-10 w-full">
                <div className="w-full h-56 bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img
                    src="/path/to/curated-news-1-image.png" // Update with actual image path
                    alt="Curated News 1"
                    className="h-full w-auto max-w-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col pt-10 items-start mt-10 w-full">
                <h3 className="text-xl text-[#454545] font-light">
                Score Your Media Impact
                </h3>
                <ul className="list-disc text-sm text-gray-500 space-y-2 font-extralight list-inside mt-2">
                  <li>Evaluate media mentions based on reach, engagement, & sentiment for precise impact assessment</li>
                  <li> Gauge public sentiment for deeper insights</li>
                  <li> Predict future impact based on historical performance data, enabling proactive decision-making in media outreach</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="sm:flex sm:w-full sm:gap-40">
              <div className="flex justify-center items-center mt-10 w-full">
                <div className="w-full h-56 bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img
                    src="/path/to/curated-news-2-image.png" // Update with actual image path
                    alt="Curated News 2"
                    className="h-full w-auto max-w-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col pt-10 items-start mt-10 w-full">
                <h3 className="text-lg text-[#454545] font-light">
                Hands-Free Reporting
                </h3>
                <ul className="list-disc text-sm text-gray-500 space-y-2 font-extralight list-inside mt-2">
                  <li>
                  Automate complex data consolidation into detailed PR reports in seconds—no manual work required
                    niche
                  </li>
                  <li>
                  Access live dashboards that automatically update with real-time insights
                  </li>
                  <li>Create concise report summaries that highlight key takeaways for quick stakeholder review</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="sm:flex sm:w-full sm:gap-40">
              <div className="flex justify-center items-center mt-10 w-full">
                <div className="w-full h-56 bg-gray-200 rounded-3xl flex items-center justify-center">
                  <img
                    src="/path/to/curated-news-3-image.png" // Update with actual image path
                    alt="Curated News 3"
                    className="h-full w-auto max-w-xs"
                  />
                </div>
              </div>
              <div className="flex flex-col pt-10 items-start mt-10 w-full">
                <h3 className="text-lg text-[#454545] font-light">
                Let AI take over your next move
                </h3>
                <ul className="list-disc text-sm text-gray-500 space-y-2 font-extralight list-inside mt-2">
                  <li>
                  AI pinpoints your next PR move, adapting suggestions to your campaign's progress and goals
                  </li>
                  <li>Catch a crisis early— know how to handle it before it erupts</li>{" "}
                  <li>
                    Plan content timelines with automated next steps.
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
        <h2 className="text-4xl font-light  mt-14 text-[#616060]">
          Finally, a tool that understands PR — from <br /> start to finish.
        </h2>
        <p className="mt-6 text-lg font-light text-gray-500">
          With a knack for understanding complex data, our reasoning engine
          simplifies your <br /> approach to PR, making it more effective and
          intuitive.
        </p>
      </div>{" "}
      <section className="bg-white mt-10">
        <div className="py-4 px-2 mx-auto max-w-screen-xl sm:py-4 lg:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-1 h-full">
            <div className="col-span-2 sm:col-span-1 md:col-span-2 bg-gray-50 h-auto  flex flex-col">
              <a className="group relative flex flex-col overflow-hidden rounded-lg px-4 pb-4 pt-40 flex-grow">
                <img
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
                  <img
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
                  <img
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
                <img
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
          </div>
        </div>
      </section>{" "}
      {/*------------------------- Faq ------------------------- */}
      {/* FAQ */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* Title */}
        <div className="max-w-2xl mx-auto text-center mb-10 lg:mb-14">
          <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">
            Your questions, answered
          </h2>
          <p className="mt-1 text-gray-600 dark:text-neutral-400">
            Answers to the most frequently asked questions.
          </p>
        </div>
        {/* End Title */}
        <div className="max-w-2xl mx-auto">
          {/* Accordion */}
          <div className="hs-accordion-group">
            {[
              {
                question: "Can I cancel at anytime?",
                answer:
                  "Yes, you can cancel anytime no questions are asked while you cancel but we would highly appreciate if you will give us some feedback.",
              },
              {
                question: "My team has credits. How do we use them?",
                answer:
                  "Once your team signs up for a subscription plan. This is where we sit down, grab a cup of coffee and dial in the details.",
              },
              {
                question: "How does Preline's pricing work?",
                answer:
                  "Our subscriptions are tiered. Understanding the task at hand and ironing out the wrinkles is key.",
              },
              {
                question: "How secure is Preline?",
                answer:
                  "Protecting the data you trust to Preline is our first priority. This part is really crucial in keeping the project in line to completion.",
              },
              {
                question: "How do I get access to a theme I purchased?",
                answer:
                  "If you lose the link for a theme you purchased, don't panic! We've got you covered. You can login to your account, tap your avatar in the upper right corner, and tap Purchases. If you didn't create a login or can't remember the information, you can use our handy Redownload page, just remember to use the same email you originally made your purchases with.",
              },
              {
                question: "Upgrade License Type",
                answer:
                  "There may be times when you need to upgrade your license from the original type you purchased and we have a solution that ensures you can apply your original purchase cost to the new license purchase.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="hs-accordion hs-accordion-active:bg-gray-100 rounded-xl p-6 dark:hs-accordion-active:bg-white/10"
              >
                <button
                  className="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400"
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
      </div>
      {/* End FAQ */}
      {/*------------------------- demo ------------------------- */}
      <div className="flex justify-center items-center my-20">
        <div className="bg-blue-100 rounded-full p-8 flex justify-between items-center w-full max-w-4xl">
          <div className="text-start">
            <h2 className="text-xl font-normal ">
              Accelerate your PR work <br /> with modern AI tech
            </h2>
          </div>
          <button className="bg-gray-800 text-white rounded-full px-6 py-2 ml-4">
            Schedule Demo
          </button>
        </div>
      </div>
      {/*------------------------- Footer ------------------------- */}
      <footer className=" rounded-lg shadow  m-4">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
              <img
                src="/fullimage.png"
                className="w-20 sm:w-24 md:w-28 ml-3"
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
