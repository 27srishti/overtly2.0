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
import { Calendar as CalendarIcon, Icon, Mail, Newspaper } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import debounce from 'lodash/debounce';
import { Input } from "@/components/ui/input";
import { OpenInNewWindowIcon, PlusIcon } from "@radix-ui/react-icons";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { onAuthStateChanged, User } from "firebase/auth";
import { useParams } from "next/navigation";
import { auth } from "@/lib/firebase/firebase";
import Link from "next/link";
import { Icons } from "@/components/ui/Icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
interface Article {
  title: string;
  imageUrl?: string;
  timeAgo?: string;
  summary?: string;
  detailedContent?: string;
  sourceName?: string;
  email?: string;
  timestamp?: string;
  additionalInfo?: string;
  link: string;
  source?: string;
  date?: string;
  snippet?: string;
}

interface AuthorSuggestion {
  name: string;
  uri: string;
  type: string;
}
interface sourceSuggestions {
  dataType: string;
  score: number;
  title: string;
  uri: string;
}

interface LocationSuggestions {
  type: string;
  wikiUri: string;
  label: {
    eng: string
  };
  lat: number;
  long: number;
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
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const toggleAdvancedFilter = () => {
    setIsAdvancedOpen((prev) => !prev);
  };

  const [authorQuery, setAuthorQuery] = useState('');
  const [authorSuggestions, setAuthorSuggestions] = useState<AuthorSuggestion[]>([]);
  const [isLoadingSource, setIsLoadingSource] = useState(false);
  const [isLoadingAuthor, setIsLoadingAuthor] = useState(false);
  const [sourceSuggestions, setSourceSuggestions] = useState<sourceSuggestions[]>([]);
  const [sourceQuery, setSourceQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestions[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);



  const fetchSuggestions = async (query: any, type: string) => {

    try {
      const response = await fetch('/api/autosuggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await authUser?.getIdToken()}`,
        },
        body: JSON.stringify({
          [type === 'source' ? 'source_name' : type === 'author' ? 'author_name' : 'location_name']: query
        })
      });

      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      console.log(data)
      return data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  const debouncedFetchSource = debounce(async (query: string | any[]) => {
    if (query.length < 2) return;
    setIsLoadingSource(true);
    const suggestions = await fetchSuggestions(query, 'source');
    setSourceSuggestions(suggestions);
    setIsLoadingSource(false);
  }, 300);

  const debouncedFetchAuthor = debounce(async (query: string | any[]) => {
    if (query.length < 2) return;
    setIsLoadingAuthor(true);
    const suggestions = await fetchSuggestions(query, 'author');
    setAuthorSuggestions(suggestions);
    setIsLoadingAuthor(false);
  }, 300);

  const debouncedFetchLocation = debounce(async (query: string) => {
    if (query.length < 2) return;
    setIsLoadingLocation(true);
    const suggestions = await fetchSuggestions(query, "location");
    setLocationSuggestions(suggestions);
    setIsLoadingLocation(false);
  }, 300);


  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setAuthUser(authUser);
        fetchNewsArticles(authUser);
      }
    });
    return () => unsubscribe();
  }, []);

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
      console.log(data);
      const authors = data.map((item: { name: string }) => item.name);
      setAuthorSuggestions(authors);
      return authors;
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }

  console.log(authorSuggestions)

  return (
    <div className="p-4">
      <div className="flex justify-between items-center ">

        <div className="flex flex-col font-raleway font-light text-[#828282] text-4xl gap-3">
          <div>
            Let’s find you the most
          </div>
          <div>
            relevant articles to read on
          </div>
        </div>
        <div className="font-raleway font-light text-[#828282] text-sm">Last Updated 3 hrs back</div>
      </div>
      <Tabs defaultValue="Trends" className="w-full font-normal mt-8">
        <TabsList className=" flex flex-row justify-between">
          <div className="flex gap-8">
            <TabsTrigger
              value="Industry"
              className="p-3 rounded-full px-7 data-[state=active]:text-[#486946] data-[state=active]:bg-[#F2FFA9] data-[state=active]:bg-opacity-20 data-[state=active]:border-[#A2BEA0] bg-transparent border border-[#A2BEA0] bg-[#FFEFA6] bg-opacity-5  font-sans"
            >
              <div className="flex items-center gap-7">
                <div>              Industry</div>

                <div><Icons.Industries className="w-4 h-4" /></div>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="Competes"
              className="p-3 rounded-full px-7 data-[state=active]:text-[#486946] data-[state=active]:bg-[#F2FFA9] data-[state=active]:border-[#A2BEA0]  data-[state=active]:bg-opacity-20 bg-transparent border border-[#A2BEA0] bg-[#FFEFA6] bg-opacity-5  font-sans"
            >
              <div className="flex items-center gap-7">
                <div>              Competes</div>

                <div><Icons.Compets className="w-4 h-4" /></div>
              </div>

            </TabsTrigger>
            <TabsTrigger
              value="Client"
              className="p-3 rounded-full px-7 data-[state=active]:text-[#486946] data-[state=active]:bg-[#F2FFA9] data-[state=active]:bg-opacity-20 data-[state=active]:border-[#A2BEA0] bg-transparent border border-[#A2BEA0] bg-[#FFEFA6] bg-opacity-5  font-sans"
            >
              <div className="flex items-center gap-7">
                <div>              Client</div>

                <div><Icons.client className="w-4 h-4" /></div>
              </div>

            </TabsTrigger>
          </div>


          <div className="flex flex-row gap-4">
            <div
              onClick={toggleAdvancedFilter}
              className="p-3 rounded-full px-7 data-[state=active]:text-[#486946] data-[state=active]:bg-[#F2FFA9] data-[state=active]:bg-opacity-20 data-[state=active]:border-[#A2BEA0] bg-transparent border border-[#A2BEA0] bg-[#FFEFA6] bg-opacity-5  font-sans cursor-pointer"
            >

              <div className="flex items-center gap-7">
                <div>              Advanced</div>

                <div><Icons.Advance className="w-4 h-4" /></div>
              </div>


            </div>
            <div className="flex flex-row gap-3 self-end border-y border-l rounded-[40px]  border-[#A2BEA0] items-center">
              <Input
                placeholder="Search"
                className="shadow-none border-none"
              />

              <div className="border-[#A2BEA0] border rounded-[40px] p-3">
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                >
                  <path
                    d="M6.0651 1.3999C3.49315 1.3999 1.39844 3.49461 1.39844 6.06657C1.39844 8.63852 3.49315 10.7332 6.0651 10.7332C7.18354 10.7332 8.21056 10.3361 9.01549 9.67685L11.8018 12.4632C11.8448 12.508 11.8963 12.5437 11.9533 12.5684C12.0103 12.593 12.0717 12.606 12.1337 12.6066C12.1958 12.6073 12.2574 12.5955 12.3149 12.572C12.3724 12.5486 12.4246 12.5139 12.4685 12.47C12.5124 12.4261 12.5471 12.3738 12.5706 12.3164C12.594 12.2589 12.6058 12.1973 12.6052 12.1352C12.6045 12.0731 12.5915 12.0118 12.5669 11.9548C12.5423 11.8978 12.5065 11.8463 12.4617 11.8033L9.67539 9.01696C10.3346 8.21203 10.7318 7.18501 10.7318 6.06657C10.7318 3.49461 8.63706 1.3999 6.0651 1.3999ZM6.0651 2.33324C8.13275 2.33324 9.79844 3.99892 9.79844 6.06657C9.79844 8.13421 8.13275 9.7999 6.0651 9.7999C3.99746 9.7999 2.33177 8.13421 2.33177 6.06657C2.33177 3.99892 3.99746 2.33324 6.0651 2.33324Z"
                    fill="#A2BEA0"
                  />
                </svg>
              </div>
            </div>
          </div>
        </TabsList>




        {isAdvancedOpen && (
          <div className="bg-[#F7F7F1] bg-opacity-50 border-[#A2BEA0] border rounded-[18px] mx-2 p-7 flex justify-between  items-end mt-4">


            <div className="grid grid-cols-3 gap-5">

              <div className="flex items-center gap-5 font-raleway">
                <div className="flex-shrink-0 w-[100px]">Location</div>
                <div className="relative w-[250px]">
                  <Input
                    className="w-full rounded-full h-10 bg-transparent border-[#ADADAD]"
                    placeholder="Search locations..."
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      debouncedFetchLocation(e.target.value);
                    }}
                  />
                  {isLoadingLocation && (
                    <div className="absolute right-3 top-2">
                      <Icons.spinner className="animate-spin h-6 w-6" />
                    </div>
                  )}
                  {(locationSuggestions.length > 0 && locationQuery.length > 0)  && (
                    <div className="absolute z-10 w-full mt-1 rounded-md bg-[#F7F7F1] border p-0">
                      <ScrollArea className="h-72 w-250 rounded-md p-0">
                        {locationSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-[#ADADAD] hover:bg-opacity-20 cursor-pointer"
                            onClick={() => {
                              setLocationQuery(suggestion.label.eng);
                              setLocationSuggestions([]);
                            }}
                          >
                            {suggestion.label.eng}
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5 font-raleway">
                <div className="flex-shrink-0 w-[100px]">Language</div>
                <div>
                  <Select>
                    <SelectTrigger className="w-full  shadow-none outline-none rounded-full h-10 bg-transparent border-[#ADADAD] border w-[250px] bg-[#F7F7F1] bg-opacity-50">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="catalan">Catalan</SelectItem>
                      <SelectItem value="portuguese">Portuguese</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="russian">Russian</SelectItem>
                      <SelectItem value="arabic">Arabic</SelectItem>
                      <SelectItem value="turkish">Turkish</SelectItem>
                      <SelectItem value="slovene">Slovene</SelectItem>
                      <SelectItem value="croatian">Croatian</SelectItem>
                      <SelectItem value="serbian">Serbian</SelectItem>
                      <SelectItem value="albanian">Albanian</SelectItem>
                      <SelectItem value="macedonian">Macedonian</SelectItem>
                      <SelectItem value="czech">Czech</SelectItem>
                      <SelectItem value="slovak">Slovak</SelectItem>
                      <SelectItem value="polish">Polish</SelectItem>
                      <SelectItem value="basque">Basque</SelectItem>
                      <SelectItem value="irish">Irish</SelectItem>
                      <SelectItem value="hungarian">Hungarian</SelectItem>
                      <SelectItem value="dutch">Dutch</SelectItem>
                      <SelectItem value="swiss-german">Swiss German</SelectItem>
                      <SelectItem value="swedish">Swedish</SelectItem>
                      <SelectItem value="finnish">Finnish</SelectItem>
                      <SelectItem value="norwegian">Norwegian</SelectItem>
                      <SelectItem value="latvian">Latvian</SelectItem>
                      <SelectItem value="lithuanian">Lithuanian</SelectItem>
                      <SelectItem value="estonian">Estonian</SelectItem>
                      <SelectItem value="icelandic">Icelandic</SelectItem>
                      <SelectItem value="danish">Danish</SelectItem>
                      <SelectItem value="greek">Greek</SelectItem>
                      <SelectItem value="romanian">Romanian</SelectItem>
                      <SelectItem value="bulgarian">Bulgarian</SelectItem>
                      <SelectItem value="georgian">Georgian</SelectItem>
                      <SelectItem value="ukrainian">Ukrainian</SelectItem>
                      <SelectItem value="belarusian">Belarusian</SelectItem>
                      <SelectItem value="armenian">Armenian</SelectItem>
                      <SelectItem value="azerbaijani">Azerbaijani</SelectItem>
                      <SelectItem value="kazakh">Kazakh</SelectItem>
                      <SelectItem value="hebrew">Hebrew</SelectItem>
                      <SelectItem value="persian">Persian</SelectItem>
                      <SelectItem value="kurdish">Kurdish</SelectItem>
                      <SelectItem value="indonesian">Indonesian</SelectItem>
                      <SelectItem value="malayalam">Malayalam</SelectItem>
                      <SelectItem value="thai">Thai</SelectItem>
                      <SelectItem value="vietnamese">Vietnamese</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="korean">Korean</SelectItem>
                      <SelectItem value="urdu">Urdu</SelectItem>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="kannada">Kannada</SelectItem>
                      <SelectItem value="tamil">Tamil</SelectItem>
                      <SelectItem value="gujarati">Gujarati</SelectItem>
                      <SelectItem value="punjabi">Punjabi</SelectItem>
                      <SelectItem value="bengali">Bengali</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-5 font-raleway">
                <div className="flex-shrink-0 w-[100px]">Date Range</div>
                <div>
                  <div className={cn("grid gap-2")}>
                    <Popover >
                      <PopoverTrigger asChild className="bg-[#F7F7F1] bg-opacity-50 border-[#A2BEA0] border rounded-[18px] mx-2 p-4">
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-[300px] justify-start text-left font-normal w-[250px]",
                            !date && "text-muted-foreground w-[250px]"
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
                          mode="range"
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>



              <div className="flex items-center gap-5 font-raleway">
                <div className="flex-shrink-0 w-[100px]">Source</div>
                <div className="relative w-[250px]">
                  <Input
                    className="w-full rounded-full h-10 bg-transparent border-[#ADADAD]"
                    placeholder="Search sources..."
                    value={sourceQuery}
                    onChange={(e) => {
                      setSourceQuery(e.target.value);
                      debouncedFetchSource(e.target.value);
                    }}
                  />
                  {isLoadingSource && (
                    <div className="absolute right-3 top-2">
                      <Icons.spinner className="animate-spin h-6 w-6" />
                    </div>
                  )}
                  {(sourceSuggestions.length > 0 && sourceQuery.length > 0) && (
                    <div className="absolute z-10 w-full mt-1 rounded-md bg-[#F7F7F1] border p-0">
                      <ScrollArea className="h-72 w-250 rounded-md p-0">
                        {sourceSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-[#ADADAD] hover:bg-opacity-20 cursor-pointer"
                            onClick={() => {
                              setSourceQuery(suggestion.title);
                              setSourceSuggestions([]);
                            }}
                          >
                            {suggestion.title}
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5 font-raleway">
                <div className="flex-shrink-0 w-[100px]">Author</div>
                <div className="relative w-[250px]">
                  <Input
                    className="w-full rounded-full h-10 bg-transparent border-[#ADADAD]"
                    placeholder="Search authors..."
                    value={authorQuery}
                    onChange={(e) => {
                      setAuthorQuery(e.target.value);
                      debouncedFetchAuthor(e.target.value);
                    }}
                  />
                  {isLoadingAuthor && (
                    <div className="absolute right-3 top-2">
                      <Icons.spinner className="animate-spin h-6 w-6" />
                    </div>
                  )}
                  {(authorSuggestions.length > 0 && authorQuery.length > 0) && (
                    <div className="absolute z-10 w-full mt-1 rounded-md bg-[#F7F7F1] border p-0">
                      <ScrollArea className="h-72 w-250 rounded-md p-0">
                        {authorSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-[#ADADAD] hover:bg-opacity-20 cursor-pointer"
                            onClick={() => {
                              setAuthorQuery(suggestion.name);
                              setAuthorSuggestions([]);
                            }}
                          >
                            <div className="flex flex-col">             <span className="font-semibold text-gray-800">{suggestion.name}</span>
                              <span className="text-[11px]">{suggestion.uri}</span></div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-5 font-raleway">
                <div className="flex-shrink-0 w-[100px]">Sentiment</div>
                <div>
                  <Select>
                    <SelectTrigger className="w-full shadow-none outline-none rounded-full h-10 bg-transparent border-[#ADADAD] border w-[250px] max-w-[250px] bg-[#F7F7F1] bg-opacity-50">
                      <SelectValue placeholder="Theme" className="text-[#828282]" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end items-end h-full">
              <Button className="bg-[#636363] rounded-full p-5 flex ">
                Search
              </Button>
            </div>
          </div>
        )
        }

        <TabsContent value="Industry" className="bg-white p-0">

          <div className="flex items-center justify-end mt-5 gap-3">


            <div className=" border-[#A2BEA0] border rounded-[40px] p-3"> <Icons.Calendar /></div>

            <div className="font-raleway text-sm">
              <Select>
                <SelectTrigger className="w-full shadow-none outline-none rounded-full h-10 bg-transparent border-[#ADADAD] border w-[200px] max-w-[250px] bg-[#F7F7F1] bg-opacity-50 px-4">
                  <SelectValue placeholder="Any Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Past Hour">Past Hour</SelectItem>
                  <SelectItem value="Past 24 Hour">Past 24 Hour</SelectItem>
                  <SelectItem value="Past Week">Past Week</SelectItem>
                  <SelectItem value="Past Month">Past Month</SelectItem>
                  <SelectItem value="Past Year">Past Year</SelectItem>
                  <SelectItem value="Any Time">Any Time</SelectItem>
                </SelectContent>
              </Select>
            </div>





            <div className="font-raleway text-sm">
              <Select>
                <SelectTrigger className="w-full shadow-none outline-none rounded-full h-10 bg-transparent border-[#ADADAD] border w-[200px] max-w-[250px] bg-[#F7F7F1] bg-opacity-50 px-4">
                  <SelectValue placeholder="Relevance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Relevance">Relevance</SelectItem>
                  <SelectItem value="Latest">Latest</SelectItem>
                  <SelectItem value="Social Score">Social Score</SelectItem>
                </SelectContent>
              </Select>
            </div>



          </div>





          <div className="flex flex-col gap-40">
            <div>
              <div className="flex flex-col gap-4 mt-5">
                {articles.map((article, index) => (
                  <Dialog key={index}>
                    <DialogTrigger>
                      <div className="bg-[#D8D8D8] bg-opacity-20 flex flex gap-6 p-2 rounded-[21px]">
                        <div className="relative w-30 h-30 aspect-square">
                          <img
                            src={article.imageUrl || "/placeholder.png"}
                            className="w-full h-full rounded-[18px] object-cover"
                            alt="Article Thumbnail"
                          />
                          <div
                            className="absolute inset-0 rounded-[18px] pointer-events-none"
                            style={{
                              border: "5px solid rgba(255, 255, 255, 0.5)",
                            }}
                          ></div>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex flex-row justify-between pr-10">
                            <div className="font-semibold mt-2 text-[#2C2C2C] text-[15px]">
                              {article.title.length > 60
                                ? article.title.slice(0, 60) + "..."
                                : article.title}
                            </div>

                            <div className="flex flex-row gap-2 items-center gap-5">
                              <div className="flex flex-col gap-2">
                                <div className="flex gap-2 items-center text-[.8rem] text-center text-[#2C5694] ">
                                  <Link href={article.link}>
                                    {article.source}
                                  </Link>
                                </div>
                              </div>
                              <div className="flex gap-1 items-center text-[.8rem] text-center">
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
                                {article.date}
                              </div>
                            </div>
                          </div>
                          <div className="text-justify text-sm pr-14 text-[12px] text-[#6F6F6F]  font-raleway">
                            {article.snippet ||
                              "This week, ilya Sutskever launched..."}
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="min-w-[80vw] min-h-[90vh] p-10 px-12 pb-8 font-montserrat">
                      <div className="grid w-full grid-cols-[1fr_300px] overflow-hidden gap-10">
                        <div>
                          <div className="flex flex gap-6 p-2 rounded-[21px]  items-center">
                            <img
                              src="/placeholder.png"
                              className="w-[110px] h-[100px] "
                            ></img>
                            <div className="flex flex-col gap-2 w-full justify-start">
                              <div className="flex flex-row justify-between items-center">
                                <div className="font-medium text-[25px] text-[#2C2C2C] font-montserrat">
                                  Ilya Sutskever isn’t done working on AI safety
                                </div>
                              </div>
                              <div className="text-[8px]  font-regular leading-2 text-[#6F6F6F] font-inter pr-20">
                                This week, Ilya Sutskever launched a new AI
                                company, Safe Superintelligence Inc. (SSI), just
                                one month after formally leaving OpenAI.
                                Sutskever, alongside Jan Leike, was integral to
                                OpenAI’s efforts to improve AI safety w ith the
                                rise of “superintelligent” AI systems. Yet both
                                Sutskever and Leike left the company after a
                                dramatic falling-out with leadership over how to
                                approach AI safety.
                              </div>
                              <div className="flex gap-3 items-center text-[.8rem] text-center">
                                <div className="bg-[#D9D9D9] bg-opacity-25 py-1  px-6 rounded-[30px] text-[10px] ">
                                  tag 1
                                </div>
                                <div className="bg-[#D9D9D9] bg-opacity-25 py-1  px-6 rounded-[30px] text-[10px] ">
                                  tag 1
                                </div>
                                <div className="bg-[#D9D9D9] bg-opacity-25 py-1  px-6 rounded-[30px] text-[10px] ">
                                  tag 1
                                </div>
                                <div className="bg-[#D9D9D9] bg-opacity-25 py-1  px-6 rounded-[30px] text-[10px] ">
                                  tag 1
                                </div>
                                <div className="bg-[#D9D9D9] bg-opacity-25 py-1  px-6 rounded-[30px] text-[10px] ">
                                  tag 1
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-center self-start items-center">
                              <div className="flex gap-2 items-center text-center bg-[#D9D9D9] bg-opacity-45 py-2 px-4 rounded-[30px] text-[11px] ">
                                Full&nbsp;Article
                                <OpenInNewWindowIcon className="fill-[#6B6B6B]" />
                              </div>
                            </div>
                          </div>
                          <Tabs
                            defaultValue="Trends"
                            className="w-full font-normal mt-5"
                          >
                            <TabsList className="mb-5 flex flex-row justify-between ml-3">
                              <div className="flex gap-8">
                                <TabsTrigger
                                  value="Trends"
                                  className="p-2 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#FF9F9F] bg-transparent border text-[11px]"
                                >
                                  Summary
                                </TabsTrigger>
                                <TabsTrigger
                                  value="Competition"
                                  className="p-2 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#FF9F9F] bg-transparent border text-[11px]"
                                >
                                  Questions
                                </TabsTrigger>
                                <TabsTrigger
                                  value="EconomicNews"
                                  className="p-2 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#FF9F9F] bg-transparent border text-[11px]"
                                >
                                  Related Articles
                                </TabsTrigger>
                                <TabsTrigger
                                  value="Industry"
                                  className="p-2 rounded-full px-7 data-[state=active]:text-[#ffffff] data-[state=active]:bg-[#FF9F9F] bg-transparent border text-[11px]"
                                >
                                  Industry
                                </TabsTrigger>
                              </div>
                            </TabsList>
                          </Tabs>
                          <div className="text-[22px] px-5 pt-3 pb-2 font-medium leading-5 text-[#2C2C2C]">
                            Summary :
                          </div>
                          <div className="text-[12px] px-5 pt-3 pb-2  text-[#3E3E3E] font-raleway">
                            <div className="container mx-auto p-4">
                              <div className="text-2xl font-semibold mb-4">
                                MacBook Power Issue Troubleshooting
                              </div>
                              <ol className="list-decimal ml-6 space-y-2">
                                <li>
                                  <div>Check the Power Adapter:</div>
                                  <p>
                                    Inspect your MacBook’s power adapter for any
                                    signs of damage. If the cable or the adapter
                                    itself is damaged, consider replacing it.
                                  </p>
                                </li>
                                <li>
                                  <div>Use a Different Outlet:</div>
                                  <p>
                                    Try plugging your MacBook into a different
                                    outlet, preferably one that you know is
                                    properly grounded.
                                  </p>
                                </li>
                                <li>
                                  <div>
                                    Test with a Different Power Adapter:
                                  </div>
                                  <p>
                                    If possible, borrow a compatible power adapter
                                    from another MacBook to see if the issue
                                    persists. This can help determine if the
                                    problem is with the adapter or the MacBook.
                                  </p>
                                </li>
                                <li>
                                  <div>Use a Grounded Power Adapter:</div>
                                  <p>
                                    Some power adapters come with a detachable
                                    plug. Ensure you are using the grounded plug
                                    version if available.
                                  </p>
                                </li>
                                <li>
                                  <div>Check for Software Updates:</div>
                                  <p>
                                    Ensure your MacBook is running the latest
                                    version of macOS. Sometimes, software updates
                                    can address hardware-related issues.
                                  </p>
                                </li>
                                <li>
                                  <div>
                                    Reset the SMC (System Management Controller):
                                  </div>
                                  <p>
                                    Resetting the SMC can sometimes resolve
                                    power-related issues on MacBooks. Here’s how
                                    you can reset it:
                                    <ul className="list-disc ml-6 mt-2">
                                      <li>Shut down your MacBook.</li>
                                      <li>
                                        On the built-in keyboard, press and hold
                                        the Shift, Control, and Option keys on the
                                        left side, then press the power button at
                                        the same time.
                                      </li>
                                    </ul>
                                  </p>
                                </li>
                              </ol>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-3 bg-[#D9D9D9] p-8 rounded-[30px] bg-opacity-20">
                            <div className="flex justify-between text-center items-center">
                              <div className="text-[#525252] text-[15px]">
                                Mango Ramen
                              </div>
                            </div>
                            <div className="flex gap-2 flex-col font-raleway">
                              <div className="flex gap-2 text-[10px] items-center">
                                <Mail className="text-[#6B6B6B] w-3 h-3" />
                                mangoramen@gmail.com
                              </div>
                              <div className="flex gap-2 text-[10px] items-center">
                                <Newspaper className="text-[#6B6B6B] w-3 h-3" />
                                Times Stamp
                              </div>
                            </div>
                            <div className="text-[#6B6B6B] text-[10px] font-raleway">
                              Works on industry domain industry, industry domain
                              industry, industry domain industry, industry domain
                              industry, industry domain industry, industry domain
                              industry.
                            </div>
                          </div>
                          <div className="flex flex-col gap-10 bg-[#D9D9D9] p-5 rounded-[30px] bg-opacity-20 h-full">
                            <div className="w-full">
                              <div className="text-[#6B6B6B] text-[13px] mb-2">
                                Sentiment
                              </div>
                              <div className="flex justify-center items-center w-full">
                                <div className="relative w-full bg-[linear-gradient(90deg,_rgba(223,_223,_223,_0.2)_0%,_rgba(60,_60,_60,_0.2)_100%)] rounded-full h-2">
                                  <div className="absolute inset-y-0  top-[-10px] left-3/4 transform -translate-x-1/2 bg-white border-2 border-[#EFEFEF] rounded-full h-8 w-8 flex items-center justify-center">
                                    <span className="text-sm font-semibold">
                                      0.5
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="w-full">
                              <div className="text-[#6B6B6B] text-[13px] mb-2">
                                Social Score
                              </div>
                              <div className="flex justify-center items-center w-full">
                                <div className="relative w-full bg-[linear-gradient(90deg,_rgba(223,_223,_223,_0.2)_0%,_rgba(60,_60,_60,_0.2)_100%)] rounded-full h-2">
                                  <div className="absolute inset-y-0  top-[-10px] left-3/4 transform -translate-x-1/2 bg-white border-2 border-[#EFEFEF] rounded-full h-8 w-8 flex items-center justify-center">
                                    <span className="text-sm font-semibold">
                                      9.0
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Competition">Competition</TabsContent>
        <TabsContent value="EconomicNews">Economic News</TabsContent>
        <TabsContent value="Digest">Digest</TabsContent>
      </Tabs >
    </div>
  );
};

export default Page;
