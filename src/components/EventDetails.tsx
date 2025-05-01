import Header from "./Header";
import { useNavigate } from "react-router-dom";
const EventDetails = () => {
  const navigate = useNavigate();

  const handleBackToEvents = () => {
    navigate("/events");
  };

  return (
    <div>
      <Header />
      <div className="mt-16 pt-4">
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
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
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
                    conference
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    In-Person
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  AI in Startups Conference
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center text-sm text-muted-foreground">
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
                      className="lucide lucide-calendar h-4 w-4 mr-2 text-primary"
                    >
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                    <span>Wednesday, February 26, 2025</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
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
                      className="lucide lucide-clock h-4 w-4 mr-2 text-primary"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>12:28 AM -4:28 AM</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
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
                      className="lucide lucide-map-pin h-4 w-4 mr-2 text-primary"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>
                      Tech Convention Center, 789 Innovation Boulevard, Boston
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
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-building h-4 w-4 mr-2 text-primary"
                    >
                      <rect
                        width="16"
                        height="20"
                        x="4"
                        y="2"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M9 22v-4h6v4"></path>
                      <path d="M8 6h.01"></path>
                      <path d="M16 6h.01"></path>
                      <path d="M12 6h.01"></path>
                      <path d="M12 10h.01"></path>
                      <path d="M12 14h.01"></path>
                      <path d="M16 10h.01"></path>
                      <path d="M16 14h.01"></path>
                      <path d="M8 10h.01"></path>
                      <path d="M8 14h.01"></path>
                    </svg>
                    <span>Venue details in confirmation email</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 min-w-48">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                  Sign in to Register
                </button>
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
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
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 pt-6">
                      <h2 className="text-xl font-semibold mb-4">
                        About This Event
                      </h2>
                      <div className="prose max-w-none">
                        <p className="mb-4 text-muted-foreground">
                          Explore how artificial intelligence is transforming
                          startups across industries. Featuring keynote
                          speakers, panel discussions, and product
                          demonstrations.
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
                            Wednesday, February 26, 2025
                            <br />
                            12:28 AM -4:28 AM
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Location</h3>
                          <p className="text-sm text-muted-foreground">
                            Tech Convention Center, 789 Innovation Boulevard,
                            Boston
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Event Type</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            conference
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Capacity</h3>
                          <p className="text-sm text-muted-foreground">
                            200 participants
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
    </div>
  );
};

export default EventDetails;
