import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  location: string;
  timeAgo: string;
}

const dummyEvents: Event[] = [
  {
    id: "1",
    type: "networking",
    title: "Investor Office Hours",
    description:
      "Book one-on-one sessions with venture capitalists and angel investors to pitch your startup and receive feedback.",
    date: "2/25/2025",
    location: "Virtual Event",
    timeAgo: "2 months ago"
  },
  {
    id: "2",
    type: "conference",
    title: "AI in Startups Conference",
    description:
      "Explore how artificial intelligence is transforming startups across industries. Featuring keynote speakers, panel discussions, and networking opportunities.",
    date: "2/26/2025",
    location: "Tech Convention Center, 789 Innovation Boulevard, Boston",
    timeAgo: "2 months ago"
  },
  {
    id: "3",
    type: "workshop",
    title: "Pitch Perfect Workshop",
    description:
      "Learn the art of pitching your startup to investors. Hands-on workshop with expert feedback and real-time practice sessions.",
    date: "3/15/2025",
    location: "Startup Hub, 123 Main Street, San Francisco",
    timeAgo: "1 month ago"
  },
  {
    id: "4",
    type: "hackathon",
    title: "GreenTech Hackathon 2025",
    description:
      "Join the 48-hour hackathon focused on sustainable technology solutions. Compete for prizes and connect with industry leaders.",
    date: "3/20/2025",
    location: "Innovation Center, 456 Tech Park, Seattle",
    timeAgo: "3 weeks ago"
  },
  {
    id: "5",
    type: "networking",
    title: "Women in Tech Meetup",
    description:
      "Monthly networking event for women in technology. Share experiences, build connections, and discuss career growth opportunities.",
    date: "3/22/2025",
    location: "The Foundry, 789 Market Street, New York",
    timeAgo: "2 weeks ago"
  },
  {
    id: "6",
    type: "conference",
    title: "FinTech Innovation Summit",
    description:
      "Annual conference showcasing the latest trends in financial technology. Featuring industry leaders and startup showcases.",
    date: "4/5/2025",
    location: "Financial District, 101 Wall Street, New York",
    timeAgo: "1 week ago"
  },
  {
    id: "7",
    type: "workshop",
    title: "Product Management Bootcamp",
    description:
      "Intensive 2-day workshop covering essential product management skills, from ideation to launch and beyond.",
    date: "4/10/2025",
    location: "Product School, 234 Tech Avenue, Austin",
    timeAgo: "5 days ago"
  },
  {
    id: "8",
    type: "networking",
    title: "Founder's Breakfast Club",
    description:
      "Weekly breakfast meetup for startup founders to share challenges, solutions, and build meaningful connections.",
    date: "4/12/2025",
    location: "The Startup Cafe, 567 Main Street, Chicago",
    timeAgo: "3 days ago"
  },
  {
    id: "9",
    type: "conference",
    title: "Blockchain & Web3 Summit",
    description:
      "Explore the future of decentralized technology. Keynotes, workshops, and networking with blockchain pioneers.",
    date: "4/15/2025",
    location: "Crypto Hub, 890 Blockchain Way, Miami",
    timeAgo: "2 days ago"
  },
  {
    id: "10",
    type: "workshop",
    title: "UX/UI Design Masterclass",
    description:
      "Hands-on workshop focusing on user experience and interface design principles for modern web applications.",
    date: "4/18/2025",
    location: "Design Studio, 345 Creative Lane, Los Angeles",
    timeAgo: "1 day ago"
  },
  {
    id: "11",
    type: "networking",
    title: "Tech Career Fair",
    description:
      "Connect with top tech companies and startups. Open positions in engineering, design, product, and more.",
    date: "4/20/2025",
    location: "Convention Center, 678 Career Drive, Denver",
    timeAgo: "Just added"
  },
  {
    id: "12",
    type: "conference",
    title: "Future of Work Summit",
    description:
      "Explore how technology is reshaping the workplace. Topics include remote work, AI integration, and digital transformation.",
    date: "4/25/2025",
    location: "Virtual Event",
    timeAgo: "Just added"
  }
];

const EventDashboard = () => {
  const navigate = useNavigate();

  const handleViewDetails = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div>
      <Header />
      <div className="mt-16 pt-4">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Startup Events</h1>
          </div>
          <div className="rounded-lg bg-card text-card-foreground mb-6 border border-border/50 shadow-sm">
            <div className="p-6 pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-search absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                  <input
                    className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-9 bg-background"
                    placeholder="Search events..."
                    value=""
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-calendar h-4 w-4 text-muted-foreground hidden sm:block"
                    >
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                    <button
                      type="button"
                      role="combobox"
                      aria-controls="radix-:r2t:"
                      aria-expanded="false"
                      aria-autocomplete="none"
                      dir="ltr"
                      data-state="closed"
                      className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&amp;>span]:line-clamp-1 w-full sm:w-[160px]"
                    >
                      <span>All Types</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-chevron-down h-4 w-4 opacity-50"
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-map-pin h-4 w-4 text-muted-foreground hidden sm:block"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <button
                      type="button"
                      role="combobox"
                      aria-controls="radix-:r2u:"
                      aria-expanded="false"
                      aria-autocomplete="none"
                      dir="ltr"
                      data-state="closed"
                      className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&amp;>span]:line-clamp-1 w-full sm:w-[160px]"
                    >
                      <span>All Locations</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-chevron-down h-4 w-4 opacity-50"
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover-lift transition-all duration-300 h-full flex flex-col"
              >
                <div className="flex flex-col space-y-1.5 p-6 pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.type === "networking"
                          ? "bg-blue-100 text-blue-800"
                          : event.type === "conference"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {event.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {event.timeAgo}
                    </span>
                  </div>
                  <h3 className="font-semibold tracking-tight text-xl line-clamp-1">
                    {event.title}
                  </h3>
                </div>
                <div className="p-6 pt-0 pb-2 flex-grow">
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {event.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-calendar h-4 w-4 mr-2"
                      >
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-map-pin h-4 w-4 mr-2"
                      >
                        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-6 pt-2">
                  <button
                    onClick={() => handleViewDetails(event.id)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;
