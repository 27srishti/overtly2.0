import { Icons } from "@/components/ui/Icons";



const Demographics = [
    "Any",
    "United Kingdom (UK)",
    "United States of America (USA)",
    "Canada",
    "Australia",
    "New Zealand",
    "Ireland",
    "South Africa",
    "India",
    "Singapore",
    "Malaysia",
    "Philippines",
    "Nigeria",
    "Kenya",
    "Ghana",
    "UAE (United Arab Emirates)",
    "Saudi Arabia",
    "Qatar",
    "Bahrain",
    "Kuwait",
    "Oman"
];

const mediaFormats = [
    "Press Release",
    "Media Alert",
    "Blog Post",
    "Interview (Print)",
    "Interview (Broadcast)",
    "Interview (Online)",
    "Byline Article",
    "Op-Ed Piece",
    "Feature Article",
    "News Article",
    "Fact Sheet",
    "Case Study",
    "White Paper",
    "Infographic",
    "Podcast",
    "Webinar",
    "Social Media Post",
    "Press Conference",
    "Media Briefing",
    "Letter to the Editor",
    "Editorial",
    "Video News Release (VNR)",
    "Radio News Release (RNR)",
    "Speech",
    "Company Newsletter",
    "Email Newsletter",
    "Annual Report",
    "Corporate Brochure",
    "Corporate Social Responsibility (CSR) Report",
    "Crisis Communication Plan",
    "Media Training Materials",
    "Executive Biographies",
    "Sponsorship Materials",
    "Product Launch Materials",
    "Community Relations Materials",
    "Event Press Release",
    "Thought Leadership Piece",
    "Panel Discussion",
    "Roundtable Discussion",
    "Media Interview Briefing",
    "Background Briefing",
    "Press Junket",
    "Media Tour",
    "Press Scrums",
    "Media Panel",
    "Investigative Report",
    "News Feature",
    "Column",
    "Broadcast Segment",
    "Documentary Collaboration",
    "Profile Piece",
    "Podcast Interview"
];

const beats = [
    "Business",
    "Finance",
    "Fintech",
    "Sustainability",
    "Technology",
    "Health and Medicine",
    "Science",
    "Education",
    "Environment and Climate Change",
    "Entertainment and Culture",
    "Sports",
    "Crime and Justice",
    "Lifestyle",
    "Travel and Tourism",
    "Food and Drink",
    "Religion and Spirituality",
    "Hospitality"
]


const TraditionalMedia = [
    "Newspapers",
    "Magazines"
]

const DigitalMedia = [
    "Websites",
    "Blogs",
    "Social media platforms (Facebook, Twitter, Instagram, LinkedIn, etc.)",
    "Online news sites",
    "Online forums and communities",
    "Podcasts",
    "Email newsletters",
    "Online magazines"
]


const Objective = [
    "Reputation management",
    "Brand awareness",
    "Crisis management",
    "Stakeholder relations",
    "Credibility",
    "Perception shaping",
    "Marketing/Sales",
    "Community relations",
    "Public opinion influence",
    "Information dissemination",
    "Communication facilitation",
    "CSR promotion",
    "Investor relations",
    "Employee support",
    "Advocacy",
    "Online reputation monitoring",
    "Strategic contribution",
    "Government relations",
    "Industry leadership positioning",
    "Partnership and collaboration promotion",
    "Event management and promotion",
    "Education and awareness campaigns",
    "Brand Positioning",
    "Cultural and diversity awareness promotion",
    "Thought leadership establishment",
    "Change management communication",
    "Innovation promotion",
    "Legal compliance communication"
]



const Industry = [
    "Any",
    "Healthcare & Pharma",
    "Biotechnology",
    "Medtech (Medical Technology)",
    "Technology",
    "Finance",
    "Entertainment",
    "Fashion",
    "Automotive",
    "Food and Beverage",
    "Travel and Tourism",
    "Real Estate",
    "Education",
    "Non-profit/NGOs",
    "Government and Public Sector",
    "Energy",
    "Environmental",
    "Sports",
    "Retail",
    "Hospitality",
    "Agriculture",
    "Telecommunications",
    "Construction and Infrastructure",
    "Manufacturing",
    "Logistics and Supply Chain",
    "Legal Services",
    "Cybersecurity",
    "Mining and Natural Resources",
    "Publishing and Media",
    "Aerospace and Defense",
    "Oil & gas",
    "Celebrity PR"
]

const Filetypes = [
    { value: "AAA", color: "bg-[#FFC8C8] bg-opacity-60", colorwheel: "bg-[#FFEBEB]", icon: Icons.ProfileCard },
    { value: "Press Releases & Announcement", color: "bg-[#FFEAB5] bg-opacity-40", colorwheel: "bg-[#FFFFFF] bg-opacity-60", icon: Icons.AnnouncmentCard },
    { value: "Coverage Received", color: "bg-[#C7E3FF] bg-opacity-30", colorwheel: "bg-[#FFFFFF] bg-opacity-70", icon: Icons.CoverageCard },
    { value: "Briefing & Debrief  Documents", color: "bg-[#C2ABFF] bg-opacity-20", colorwheel: "bg-[#FFFFFF] bg-opacity-60", icon: Icons.BrefingCard },
    { value: "Customer Stories & Case Studies", color: "bg-[#77D7D7] bg-opacity-20", colorwheel: "bg-[#FFFFFF] bg-opacity-50", icon: Icons.CustomerCard },
    { value: "Interviwes", color: "bg-[#62CBFF] bg-opacity-20", colorwheel: "bg-[#C6C6C6] bg-opacity-20", icon: Icons.InterviwesCard },
    { value: "Reports", color: "bg-[#FFB65C] bg-opacity-20", colorwheel: "bg-[#C6C6C6] bg-opacity-20", icon: Icons.ReportsCard },
    { value: "Pitched Sent", color: "bg-[#A1FFB0] bg-opacity-20", colorwheel: "bg-[#FFEBEB]", icon: Icons.PitchedCard },
    { value: "Others", color: "bg-[#959595] bg-opacity-10", colorwheel: "bg-[#FFFFFF] bg-opacity-50", icon: Icons.OthersCard },
];



export { Demographics, mediaFormats, beats, TraditionalMedia, DigitalMedia, Objective, Industry, Filetypes };
