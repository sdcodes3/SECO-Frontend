import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import axiosInstance from "../utils/axios";
import API_CONSTANTS from "../utils/apiConstants";
import useUser from "@/hooks/useUser";
import Suspence from "./Suspence";

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  stages: string; //this will be json string
}

const EventDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<Event>({} as Event);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn } = useUser();
  const handleShare = () => {
    window.open(`${window.location.origin}/event/${id}`, "_blank");
  };
  const [stages, setStages] = useState<any[]>([]);
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        if (!id) {
          throw new Error("Event ID is required");
        }
        const response = await axiosInstance.get(
          API_CONSTANTS.GET_EVENT_BY_ID(id)
        );
        setEvent(response.data.event);
        if (response.data.event.stages) {
          try {
            setStages(JSON.parse(response.data.event.stages));
            if (!Array.isArray(stages)) setStages([]);
          } catch {
            setStages([]);
          }
        }
      } catch (err) {
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const handleBackToEvents = () => {
    navigate("/events");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
  };

  return (
    <Suspence isLoading={loading} isError={!!error}>
      <div>
        {!isLoggedIn && <Header />}
        <div className="container mx-auto py-8 px-4">
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mb-6"
            onClick={handleBackToEvents}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left mr-2 h-4 w-4"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            Back to Events
          </button>
          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {event.type}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    In-Person
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-calendar h-4 w-4 mr-2 text-primary"
                    >
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                    <span>{formatDate(event.start_date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-clock h-4 w-4 mr-2 text-primary"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>
                      {formatTime(event.start_date)} -{" "}
                      {formatTime(event.end_date)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-map-pin h-4 w-4 mr-2 text-primary"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="flex items-start text-sm text-muted-foreground flex-col mt-6 gap-3">
                  <h2 className="text-lg font-semibold">Share this event:</h2>
                  <div
                    className="flex items-center gap-2 bg-white rounded-sm p-2 px-4 border border-gray-200 cursor-pointer"
                    onClick={handleShare}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-share"
                    >
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" x2="12" y1="2" y2="15"></line>
                    </svg>
                    <span>Share</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 min-w-48">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                  Sign in to Register
                </button>
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
          <div dir="ltr" data-orientation="horizontal" className="w-full">
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-2 w-full max-w-md mb-6"
              tabIndex={0}
              data-orientation="horizontal"
            >
              <button
                type="button"
                role="tab"
                aria-selected="true"
                aria-controls="radix-:r38:-content-details"
                data-state="active"
                id="radix-:r38:-trigger-details"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                tabIndex={-1}
                data-orientation="horizontal"
                data-radix-collection-item=""
              >
                Details
              </button>
            </div>
            <div
              data-state="active"
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-:r38:-trigger-details"
              id="radix-:r38:-content-details"
              tabIndex={0}
              className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {stages.length > 0 && (
                    <div className="mb-8">
                      <div className="flex flex-col gap-6">
                        {stages.map((stage, idx) => {
                          // Format day/month
                          const dateObj = new Date(stage.start_date);
                          const day = dateObj.getDate();
                          const month = dateObj.toLocaleString("en-US", {
                            month: "short"
                          });

                          // Live logic
                          const now = new Date();
                          const start = new Date(
                            stage.start_date +
                              "T" +
                              (stage.start_time || "00:00")
                          );
                          const end = new Date(
                            stage.end_date + "T" + (stage.end_time || "23:59")
                          );
                          const live = now >= start && now <= end;

                          return (
                            <div key={idx} className="flex items-start gap-4">
                              {/* Date box */}
                              <div className="flex flex-col items-center min-w-[56px]">
                                <div className="bg-blue-100 text-blue-700 rounded-lg px-2 py-1 text-center font-semibold text-sm mb-1">
                                  {day}
                                  <div className="text-xs text-gray-500 font-normal">
                                    {month}{" "}
                                    {String(dateObj.getFullYear()).slice(2)}
                                  </div>
                                </div>
                                {/* Timeline line */}
                                {idx < stages.length - 1 && (
                                  <div
                                    className="w-px bg-blue-300 flex-1 mx-auto"
                                    style={{ minHeight: 32 }}
                                  />
                                )}
                              </div>
                              {/* Timeline circle */}
                              {/* <div className="relative">
                                <div className="w-3 h-3 rounded-full bg-blue-500 mt-2" />
                                {idx < stages.length - 1 && (
                                  <div
                                    className="absolute left-1/2 top-3 w-px h-full bg-blue-300"
                                    style={{ transform: "translateX(-50%)" }}
                                  />
                                )}
                              </div> */}
                              {/* Stage card */}
                              <div className="flex-1 bg-white rounded-lg shadow border p-4 relative">
                                {live && (
                                  <span className="absolute top-2 right-2 text-xs text-red-600 font-semibold flex items-center gap-1">
                                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>{" "}
                                    Live
                                  </span>
                                )}
                                <div className="font-bold text-lg mb-1">
                                  {stage.name}
                                </div>
                                <div className="text-gray-600 mb-2 whitespace-pre-line">
                                  {stage.description}
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                  <div>
                                    <span className="font-medium">Start:</span>{" "}
                                    {stage.start_date}{" "}
                                    {stage.start_time && (
                                      <>| {stage.start_time}</>
                                    )}
                                  </div>
                                  <div>
                                    <span className="font-medium">End:</span>{" "}
                                    {stage.end_date}{" "}
                                    {stage.end_time && <>| {stage.end_time}</>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 pt-6">
                      <h2 className="text-xl font-semibold mb-4">
                        About This Event
                      </h2>
                      <div className="prose max-w-none">
                        <p className="mb-4 text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 pt-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Event Details
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium">Date and Time</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(event.start_date)}
                            <br />
                            {formatTime(event.start_date)} -{" "}
                            {formatTime(event.end_date)}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Location</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.location}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Event Type</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {event.type}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspence>
  );
};

export default EventDetails;
