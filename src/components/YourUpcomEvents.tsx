import { useNavigate } from "react-router-dom";

const YourUpcomEvents = () => {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="space-y-1.5 p-6 flex flex-row items-center justify-between">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          Upcoming Events
        </h3>
        <button
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
          onClick={() => navigate("/events")}
        >
          View All
        </button>
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-4">
          <div className="flex items-start p-3 rounded-lg hover:bg-secondary transition-colors">
            <div className="bg-primary/10 text-primary rounded-md p-3 mr-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Startup Legal Clinic</h4>
              <div className="text-sm text-muted-foreground">
                <div>9 May 2025 • 12:28 am - 03:28 am</div>
                <div>Virtual Event</div>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-primary">39 attendees</span>
              </div>
            </div>
          </div>
          <div className="flex items-start p-3 rounded-lg hover:bg-secondary transition-colors">
            <div className="bg-primary/10 text-primary rounded-md p-3 mr-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Startup Pitch Night</h4>
              <div className="text-sm text-muted-foreground">
                <div>11 May 2025 • 12:26 am - 02:26 am</div>
                <div>Innovation Hub, 123 Tech Street, San Francisco</div>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-primary">56 attendees</span>
              </div>
            </div>
          </div>
          <div className="flex items-start p-3 rounded-lg hover:bg-secondary transition-colors">
            <div className="bg-primary/10 text-primary rounded-md p-3 mr-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Venture Capital Workshop</h4>
              <div className="text-sm text-muted-foreground">
                <div>11 May 2025 • 12:28 am - 02:28 am</div>
                <div>Virtual Event</div>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-primary">53 attendees</span>
              </div>
            </div>
          </div>
          <div className="flex items-start p-3 rounded-lg hover:bg-secondary transition-colors">
            <div className="bg-primary/10 text-primary rounded-md p-3 mr-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Investor Office Hours</h4>
              <div className="text-sm text-muted-foreground">
                <div>11 May 2025 • 12:28 am - 04:28 am</div>
                <div>Virtual Event</div>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-primary">38 attendees</span>
              </div>
            </div>
          </div>
          <div className="flex items-start p-3 rounded-lg hover:bg-secondary transition-colors">
            <div className="bg-primary/10 text-primary rounded-md p-3 mr-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-medium">Fintech Hackathon</h4>
              <div className="text-sm text-muted-foreground">
                <div>11 May 2025 • 12:29 am - 01:29 am</div>
                <div>FinHub, 321 Commerce Street, Chicago</div>
              </div>
              <div className="mt-2 text-sm">
                <span className="text-primary">18 attendees</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourUpcomEvents;
