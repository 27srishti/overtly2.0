"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Mail, Newspaper } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { OpenInNewWindowIcon, PlusIcon } from "@radix-ui/react-icons";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { onAuthStateChanged, User } from "firebase/auth";
import { useParams } from "next/navigation";
import { auth } from "@/lib/firebase/firebase";
interface Article {
  title?: string;
  imageUrl?: string;
  timeAgo?: string;
  summary?: string;
  detailedContent?: string;
  sourceName?: string;
  email?: string;
  timestamp?: string;
  additionalInfo?: string;
}

const Page = () => {
  const params = useParams();
  const clientid = params.client;
  const [articles, setArticles] = useState<Article[]>([]);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setAuthUser(authUser);
        fetchNewsArticles(authUser);
      }
    });
    return () => unsubscribe();
  }, [authUser]);

  async function fetchNewsArticles(user: User) {
    try {
      const response = await fetch("/api/getnews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          client_id: clientid,
          query: "",
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const data = await response.json();
      setArticles(data.articles);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <Tabs defaultValue="Trends" className="w-full font-normal p-5">
      <TabsList className="mb-5 flex flex-row justify-between ml-3">
        <div className="flex gap-8">
          <TabsTrigger
            value="Trends"
            className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#585858] bg-transparent border"
          >
            Trends
          </TabsTrigger>
          <TabsTrigger
            value="Competition"
            className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#585858] bg-transparent border"
          >
            Competition
          </TabsTrigger>
          <TabsTrigger
            value="EconomicNews"
            className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#585858] bg-transparent border"
          >
            Economic News
          </TabsTrigger>
          <TabsTrigger
            value="Industry"
            className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#585858] bg-transparent border"
          >
            Industry
          </TabsTrigger>
          <TabsTrigger
            value="Digest"
            className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#585858] bg-transparent border"
          >
            Digest
          </TabsTrigger>
        </div>

        <div className={cn("grid gap-2")}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </TabsList>
      <TabsContent value="Trends" className="bg-white p-0">
        <div className="flex flex-col gap-40">
          <div className="px-80 mt-10">
            <div className="flex flex-row self-end bg-[#F5F5F0] p-1 rounded-[40px] px-2 bg-white border items-center">
              <div className="rounded-full rounded-full p-[.6rem] ">
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 "
                >
                  <path
                    d="M6.0651 1.3999C3.49315 1.3999 1.39844 3.49461 1.39844 6.06657C1.39844 8.63852 3.49315 10.7332 6.0651 10.7332C7.18354 10.7332 8.21056 10.3361 9.01549 9.67685L11.8018 12.4632C11.8448 12.508 11.8963 12.5437 11.9533 12.5684C12.0103 12.593 12.0717 12.606 12.1337 12.6066C12.1958 12.6073 12.2574 12.5955 12.3149 12.572C12.3724 12.5486 12.4246 12.5139 12.4685 12.47C12.5124 12.4261 12.5471 12.3738 12.5706 12.3164C12.594 12.2589 12.6058 12.1973 12.6052 12.1352C12.6045 12.0731 12.5915 12.0118 12.5669 11.9548C12.5423 11.8978 12.5065 11.8463 12.4617 11.8033L9.67539 9.01696C10.3346 8.21203 10.7318 7.18501 10.7318 6.06657C10.7318 3.49461 8.63706 1.3999 6.0651 1.3999ZM6.0651 2.33324C8.13275 2.33324 9.79844 3.99892 9.79844 6.06657C9.79844 8.13421 8.13275 9.7999 6.0651 9.7999C3.99746 9.7999 2.33177 8.13421 2.33177 6.06657C2.33177 3.99892 3.99746 2.33324 6.0651 2.33324Z"
                    fill="#c9c9c9"
                  />
                </svg>
              </div>

              <Input
                type="search"
                placeholder="Search"
                className="shadow-none border-none h-full"
              />
            </div>
          </div>
          <div>
            <div className="flex flex-row justify-end gap-4">
              <div className="bg-[#DAE7F1] bg-opacity-20 px-8 rounded-[20px] text-center py-2">
                Filter
              </div>
              <div className="bg-[#DAE7F1] bg-opacity-20 px-8 rounded-[20px] text-center py-2 mr-4">
                Sort
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-5">
              {articles.map((article, index) => (
                <Dialog key={index}>
                  <DialogTrigger>
                    <div className="bg-[#D8D8D8] bg-opacity-20 flex flex gap-6 p-2 rounded-[21px]">
                      <img
                        src={article.imageUrl || "/placeholder.png"}
                        alt="Article Thumbnail"
                      />
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-row justify-between pr-10">
                          <div className="font-semibold mt-2">
                            {article?.title}
                          </div>
                          <div className="flex gap-2 items-center text-[.8rem] text-center">
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 17 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0_1455_2103)">
                                {/* SVG Path */}
                              </g>
                              <defs>
                                <clipPath id="clip0_1455_2103">
                                  <rect width="17" height="17" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                            {article.timeAgo}
                          </div>
                        </div>
                        <div className="text-justify">{article.summary}</div>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="min-w-[80vw] min-h-[90vh] p-10 px-12 pb-8 font-montserrat">
                    <div className="grid w-full grid-cols-[1fr_300px] overflow-hidden gap-10">
                      <div>
                        {/* Detailed Article View */}
                        <Tabs
                          defaultValue="Trends"
                          className="w-full font-normal p-5 mt-5"
                        >
                          <TabsList className="mb-5 flex flex-row justify-between ml-3">
                            <div className="flex gap-8">
                              <TabsTrigger
                                value="Trends"
                                className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#FF9F9F] bg-transparent border"
                              >
                                Summary
                              </TabsTrigger>
                              <TabsTrigger
                                value="Competition"
                                className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#FF9F9F] bg-transparent border"
                              >
                                Questions
                              </TabsTrigger>
                              <TabsTrigger
                                value="EconomicNews"
                                className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#FF9F9F] bg-transparent border"
                              >
                                Related Articles
                              </TabsTrigger>
                              <TabsTrigger
                                value="Industry"
                                className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#FF9F9F] bg-transparent border"
                              >
                                Industry
                              </TabsTrigger>
                            </div>
                          </TabsList>
                        </Tabs>
                        <div className="font-normal text-x">
                          {article.detailedContent}
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 bg-[#D9D9D9] p-5 rounded-[30px] bg-opacity-20">
                          <div className="flex justify-between text-center items-center">
                            <div>{article.sourceName}</div>
                            <div className="p-2 px-4 bg-[#ffff] rounded-full">
                              +
                            </div>
                          </div>
                          <div className="flex gap-2 text-xs text-center item-center">
                            <Mail className="text-[#6B6B6B] w-5 h-5" />
                            {article.email}
                          </div>
                          <div className="flex gap-2 text-xs text-center item-center">
                            <Newspaper className="text-[#6B6B6B] w-5 h-5" />{" "}
                            {article.timestamp}
                          </div>
                          <div className="text-[#6B6B6B] text-sm">
                            {article.additionalInfo}
                          </div>
                          <div className="flex justify-end">
                            <div className="flex gap-2 text-xs text-center items-center bg-[#D9D9D9] bg-opacity-45 rounded-[30px] p-2">
                              More details{" "}
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 7 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.59375 1H6.46968V2.875"
                                  stroke="black"
                                  strokeOpacity="0.41"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M3.34375 6L1.46945 6L1.46875 4.125"
                                  stroke="black"
                                  strokeOpacity="0.41"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-10 bg-[#D9D9D9] p-5 rounded-[30px] bg-opacity-20 h-full">
                          <div className="w-full">
                            <div className="text-[#6B6B6B] text-[10px] mb-2">
                              Sentiment
                            </div>
                            <Slider
                              min={70}
                              max={400}
                              defaultValue={[250]}
                              className="bg-[#F0F0F0] mb-2"
                            />
                            <div className="flex justify-between text-[#6B6B6B] text-[8px] mt-1">
                              <div>70</div>
                              <div>150</div>
                              <div>500</div>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="text-[#6B6B6B] text-[10px] mb-2">
                              Social Score
                            </div>
                            <Slider
                              min={70}
                              max={400}
                              defaultValue={[250]}
                              className="bg-[#F0F0F0] mb-2"
                            />
                            <div className="flex justify-between text-[#6B6B6B] text-[8px] mt-1">
                              <div>70</div>
                              <div>150</div>
                              <div>500</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
              <Dialog>
                <DialogTrigger>
                  <div className="bg-[#D8D8D8] bg-opacity-20 flex flex gap-6 p-2 rounded-[21px]">
                    <img src="/placeholder.png"></img>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row justify-between pr-10">
                        <div className="font-semibold mt-2">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Dolore, impedit.
                        </div>

                        <div className="flex gap-2 items-center text-[.8rem] text-center">
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_1455_2103)">
                              <path
                                d="M8.49422 1.4165C4.58422 1.4165 1.41797 4.58984 1.41797 8.49984C1.41797 12.4098 4.58422 15.5832 8.49422 15.5832C12.4113 15.5832 15.5846 12.4098 15.5846 8.49984C15.5846 4.58984 12.4113 1.4165 8.49422 1.4165ZM8.5013 14.1665C5.37047 14.1665 2.83464 11.6307 2.83464 8.49984C2.83464 5.369 5.37047 2.83317 8.5013 2.83317C11.6321 2.83317 14.168 5.369 14.168 8.49984C14.168 11.6307 11.6321 14.1665 8.5013 14.1665Z"
                                fill="#858383"
                              />
                              <path
                                d="M8.85547 4.9585H7.79297V9.2085L11.5117 11.4397L12.043 10.5685L8.85547 8.67725V4.9585Z"
                                fill="#858383"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_1455_2103">
                                <rect width="17" height="17" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                          10 hours back
                        </div>
                      </div>
                      <div className="text-justify">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Dolore, impedit. Lorem ipsum dolor sit, amet consectetur
                        adipisicing elit. Cum, eaque quis. ue quis ue quis
                        Quisquam eaque velit tenetur sed aliquid, alias impedit
                        pariatur enim. Repellat minus necessitatibus voluptatem
                        unde, delectus neque tempora voluptate!
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="min-w-[80vw] min-h-[90vh] p-10 px-12 pb-8 font-montserrat">
                  <div className="grid w-full grid-cols-[1fr_300px] overflow-hidden gap-10">
                    <div>
                      <div className=" flex flex gap-6 p-2 rounded-[21px]  items-center">
                        <img
                          src="/placeholder.png"
                          className="w-[100px] h-[100px]"
                        ></img>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-row justify-between pr-10">
                            <div className="font-semibold  mt-2  capitalize text-2xl">
                              Lorem ipsum dolor sit amet consectetur adipisicing
                              elit.
                            </div>
                            <div className="flex gap-2 items-center text-xs text-center bg-[#6B6B6B] bg-opacity-20 py-1  px-3 rounded-[30px] ">
                              Full article
                              <OpenInNewWindowIcon className="w-4 stroke-[#6B6B6B]" />
                            </div>
                          </div>
                          <div className="text-justify  text-xs mb-3">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Dolore, impedit. Lorem ipsum dolor sit, amet
                            consectetur adipisicing elit. Cum, eaque quis. ue
                            quis ue quis Quisquam eaque velit tenetur sed
                            aliquid, alias impedit pariatur enim. consectetur
                            adipisicing elit. Cum, eaque quis. ue quis ue quis
                            Quisquam eaque velit tenetur sed aliquid, alias
                            impedit pariatur enim.
                          </div>
                          <div className="flex gap-3 items-center text-[.8rem] text-center">
                            <div className="bg-[#6B6B6B] bg-opacity-20 py-1  px-6 rounded-[30px] ">
                              tag 1
                            </div>
                            <div className="bg-[#6B6B6B] bg-opacity-20 py-1  px-6 rounded-[30px] ">
                              tag 1
                            </div>
                            <div className="bg-[#6B6B6B] bg-opacity-20 py-1  px-6 rounded-[30px] ">
                              tag 1
                            </div>
                            <div className="bg-[#6B6B6B] bg-opacity-20 py-1  px-6 rounded-[30px] ">
                              tag 1
                            </div>
                            <div className="bg-[#6B6B6B] bg-opacity-20 py-1  px-6 rounded-[30px] ">
                              tag 1
                            </div>
                          </div>
                        </div>
                      </div>
                      <Tabs
                        defaultValue="Trends"
                        className="w-full font-normal p-5 mt-5"
                      >
                        <TabsList className="mb-5 flex flex-row justify-between ml-3">
                          <div className="flex gap-8">
                            <TabsTrigger
                              value="Trends"
                              className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#FF9F9F] bg-transparent border"
                            >
                              Summery
                            </TabsTrigger>
                            <TabsTrigger
                              value="Competition"
                              className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#FF9F9F] bg-transparent border"
                            >
                              Questions
                            </TabsTrigger>
                            <TabsTrigger
                              value="EconomicNews"
                              className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#FF9F9F] bg-transparent border"
                            >
                              Related Articles
                            </TabsTrigger>
                            <TabsTrigger
                              value="Industry"
                              className="p-3 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#FF9F9F] bg-transparent border"
                            >
                              Questions
                            </TabsTrigger>
                          </div>
                        </TabsList>
                      </Tabs>
                      <div className="font-normal text-x\">
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Voluptate ipsa, fugiat, incidunt sapiente
                        mollitia, dolor id facilis quam similique blanditiis sit
                        eos molestias cum quasi ab sint cumque iure error itaque
                        adipisci harum hic accusamus facere. Doloremque
                        voluptatum, aperiam obcaecati porro consequuntur quasi
                        earum omnis dolorem eius. Ea dignissimos, fugiat qui
                        blanditiis facilis quaerat similique quibusdam aliquid
                        totam? Autem sequi laborum dolor recusandae iste nobis
                        nemo, aspernatur quaerat expedita earum, at provident
                        magni, libero consectetur dignissimos vel atque sint
                        quasi vitae natus totam? Sunt itaque corporis ab, ad
                        officiis vero nihil. Laudantium ad doloribus iste
                        aspernatur quidem magni. Illo, officia? Lorem, ipsum
                        dolor sit amet consectetur adipisicing elit. Error
                        repellendus minima possimus vel. Dignissimos repellendus
                        nam molestiae aliquid? Aspernatur, commodi!
                      </div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2 bg-[#D9D9D9] p-5 rounded-[30px] bg-opacity-20">
                        <div className="flex justify-between text-center items-center">
                          <div> Mango Ramen</div>
                          <div className="p-2 px-4 bg-[#ffff] rounded-full">
                            +
                          </div>
                        </div>
                        <div className="flex gap-2 text-xs text-center item-center">
                          {" "}
                          <Mail className="text-[#6B6B6B] w-5 h-5" />{" "}
                          xyz.gmail.com
                        </div>
                        <div className="flex gap-2 text-xs text-center item-center">
                          {" "}
                          <Newspaper className="text-[#6B6B6B] w-5 h-5" /> Times
                          Stamp
                        </div>
                        <div className="text-[#6B6B6B] text-sm">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Rerum, reprehenderit?
                        </div>
                        <div className="flex justify-end">
                          <div className="flex gap-2 text-xs text-center items-center bg-[#D9D9D9] bg-opacity-45 rounded-[30px] p-2  ">
                            More details{" "}
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 7 7"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.59375 1H6.46968V2.875"
                                stroke="black"
                                stroke-opacity="0.41"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M3.34375 6L1.46945 6L1.46875 4.125"
                                stroke="black"
                                stroke-opacity="0.41"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-10 bg-[#D9D9D9] p-5 rounded-[30px] bg-opacity-20 h-full">
                        <div className="w-full">
                          <div className="text-[#6B6B6B] text-[10px] mb-2">
                            Sentiment
                          </div>
                          <Slider
                            min={70}
                            max={400}
                            defaultValue={[250]}
                            className="bg-[#F0F0F0] mb-2"
                          />
                          <div className="flex justify-between text-[#6B6B6B] text-[8px] mt-1 ">
                            <div>70</div>
                            <div>150</div>
                            <div>500</div>
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="text-[#6B6B6B] text-[10px] mb-2">
                            Social Score
                          </div>
                          <Slider
                            min={70}
                            max={400}
                            defaultValue={[250]}
                            className="bg-[#F0F0F0] mb-2"
                          />
                          <div className="flex justify-between text-[#6B6B6B] text-[8px] mt-1 ">
                            <div>70</div>
                            <div>150</div>
                            <div>500</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="Competition">Competition</TabsContent>
      <TabsContent value="EconomicNews">Economic News</TabsContent>
      <TabsContent value="Industry">Industry</TabsContent>
      <TabsContent value="Digest">Digest</TabsContent>
    </Tabs>
  );
};

export default Page;
