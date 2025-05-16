import RecentConnections from "../components/RecentConnections";
import Sidebar from "../components/Sidebar";
import YourUpcomEvents from "../components/YourUpcomEvents";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();
  const registeredEvents = [
    {
      id: 1,
      title: "AI in Startups Conference",
      date: "15 April 2025",
      time: "12:28 am - 04:28 am",
      location: "Tech Convention Center, 789 Innovation Boulevard, Boston",
      type: "Conference",
      status: "Registered"
    },
    {
      id: 2,
      title: "AI in Startups Conference",
      date: "15 April 2025",
      time: "12:28 am - 04:28 am",
      location: "Tech Convention Center, 789 Innovation Boulevard, Boston",
      type: "Conference",
      status: "Registered"
    },
    {
      id: 3,
      title: "AI in Startups Conference",
      date: "15 April 2025",
      time: "12:28 am - 04:28 am",
      location: "Tech Convention Center, 789 Innovation Boulevard, Boston",
      type: "Conference",
      status: "Registered"
    }
  ];
  return (
    <>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome, Founder User. Track your events, connections, and growth.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
            <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                Total Events
              </h3>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
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
                  className="lucide lucide-calendar h-4 w-4"
                >
                  <path d="M8 2v4"></path>
                  <path d="M16 2v4"></path>
                  <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                  <path d="M3 10h18"></path>
                </svg>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">196</div>
              <div className="text-xs flex items-center text-green-500">
                <span className="mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </span>
                +39% from last month
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
            <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                Connections
              </h3>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
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
                  className="lucide lucide-users h-4 w-4"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs flex items-center text-green-500">
                <span className="mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </span>
                +3% from last month
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
            <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                Event Registrations
              </h3>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
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
                  className="lucide lucide-link2 h-4 w-4"
                >
                  <path d="M9 17H7A5 5 0 0 1 7 7h2"></path>
                  <path d="M15 7h2a5 5 0 1 1 0 10h-2"></path>
                  <line x1="8" x2="16" y1="12" y2="12"></line>
                </svg>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">157</div>
              <div className="text-xs flex items-center text-green-500">
                <span className="mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </span>
                +13% from last month
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in">
            <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                Profile Views
              </h3>
              <div className="p-2 bg-primary/10 rounded-full text-primary">
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
                  className="lucide lucide-chart-column h-4 w-4"
                >
                  <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
                  <path d="M18 17V9"></path>
                  <path d="M13 17V5"></path>
                  <path d="M8 17v-3"></path>
                </svg>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="text-2xl font-bold">152</div>
              <div className="text-xs flex items-center text-green-500">
                <span className="mr-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </span>
                +0% from last month
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-8 animate-fade-in">
          <div className="space-y-1.5 p-6 flex flex-row items-center justify-between">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Your Registered Events
            </h3>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
              onClick={() => navigate("/events")}
            >
              Find More Events
            </button>
          </div>
          <div className="p-6 pt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {registeredEvents.map((event) => (
                <div className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                      {event.type}
                    </span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                      {event.status}
                    </span>
                  </div>
                  <h3 className="font-medium text-base mt-2">{event.title}</h3>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
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
                        className="lucide lucide-calendar h-4 w-4"
                      >
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in overflow-hidden">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Event Types Distribution
              </h3>
            </div>
            <div className="p-6 pt-0">
              <div
                className="recharts-responsive-container"
                style={{ width: "100%", height: "300px", minWidth: "0px" }}
              >
                <div
                  className="recharts-wrapper"
                  style={{
                    position: "relative",
                    cursor: "default",
                    width: "550px",
                    height: "300px"
                  }}
                >
                  <svg
                    cx="50%"
                    cy="50%"
                    className="recharts-surface"
                    width="550"
                    height="300"
                    viewBox="0 0 550 300"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <title></title>
                    <desc></desc>
                    <defs>
                      <clipPath id="recharts555-clip">
                        <rect x="5" y="5" height="266" width="540"></rect>
                      </clipPath>
                    </defs>
                    <g className="recharts-layer recharts-pie" tabIndex={0}>
                      <g
                        className="recharts-layer recharts-pie-sector"
                        tabIndex={-1}
                      >
                        <path
                          cx="275"
                          cy="138"
                          name="Pitch"
                          stroke="#fff"
                          fill="#3B82F6"
                          tabIndex={-1}
                          className="recharts-sector"
                          d="M 375,138
    A 100,100,0,
    0,0,
    346.8349350097728,68.43174493965137
  L 275,138 Z"
                          role="img"
                        ></path>
                      </g>
                      <g
                        className="recharts-layer recharts-pie-sector"
                        tabIndex={-1}
                      >
                        <path
                          cx="275"
                          cy="138"
                          name="Workshop"
                          stroke="#fff"
                          fill="#60A5FA"
                          tabIndex={-1}
                          className="recharts-sector"
                          d="M 346.8349350097728,68.43174493965137
    A 100,100,0,
    0,0,
    212.6510198141267,59.816851753196985
  L 275,138 Z"
                          role="img"
                        ></path>
                      </g>
                      <g
                        className="recharts-layer recharts-pie-sector"
                        tabIndex={-1}
                      >
                        <path
                          cx="275"
                          cy="138"
                          name="Networking"
                          stroke="#fff"
                          fill="#93C5FD"
                          tabIndex={-1}
                          className="recharts-sector"
                          d="M 212.6510198141267,59.816851753196985
    A 100,100,0,
    0,0,
    284.6023025907682,237.5379112949198
  L 275,138 Z"
                          role="img"
                        ></path>
                      </g>
                      <g
                        className="recharts-layer recharts-pie-sector"
                        tabIndex={-1}
                      >
                        <path
                          cx="275"
                          cy="138"
                          name="Conference"
                          stroke="#fff"
                          fill="#BFDBFE"
                          tabIndex={-1}
                          className="recharts-sector"
                          d="M 284.6023025907682,237.5379112949198
    A 100,100,0,
    0,0,
    349.0277997075316,205.23008902613168
  L 275,138 Z"
                          role="img"
                        ></path>
                      </g>
                      <g
                        className="recharts-layer recharts-pie-sector"
                        tabIndex={-1}
                      >
                        <path
                          cx="275"
                          cy="138"
                          name="Hackathon"
                          stroke="#fff"
                          fill="#3B82F6"
                          tabIndex={-1}
                          className="recharts-sector"
                          d="M 349.0277997075316,205.23008902613168
    A 100,100,0,
    0,0,
    375,138.00000000000003
  L 275,138 Z"
                          role="img"
                        ></path>
                      </g>
                      <g className="recharts-layer recharts-pie-labels">
                        <g className="recharts-layer">
                          <text
                            cx="275"
                            cy="138"
                            stroke="none"
                            name="Pitch"
                            alignment-baseline="middle"
                            x="386.2300108815226"
                            y="92.9679594144751"
                            className="recharts-text recharts-pie-label-text"
                            text-anchor="start"
                            fill="#3B82F6"
                          >
                            <tspan x="386.2300108815226" dy="0em">
                              Pitch 12%
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer">
                          <text
                            cx="275"
                            cy="138"
                            stroke="none"
                            name="Workshop"
                            alignment-baseline="middle"
                            x="282.6884263976856"
                            y="18.246552869959643"
                            className="recharts-text recharts-pie-label-text"
                            text-anchor="start"
                            fill="#60A5FA"
                          >
                            <tspan x="282.6884263976856" dy="0em">
                              Workshop 23%
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer">
                          <text
                            cx="275"
                            cy="138"
                            stroke="none"
                            name="Networking"
                            alignment-baseline="middle"
                            x="163.76998911847738"
                            y="183.03204058552484"
                            className="recharts-text recharts-pie-label-text"
                            text-anchor="end"
                            fill="#93C5FD"
                          >
                            <tspan x="163.76998911847738" dy="0em">
                              Networking 41%
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer">
                          <text
                            cx="275"
                            cy="138"
                            stroke="none"
                            name="Conference"
                            alignment-baseline="middle"
                            x="328.79223159958354"
                            y="245.2678694648904"
                            className="recharts-text recharts-pie-label-text"
                            text-anchor="start"
                            fill="#BFDBFE"
                          >
                            <tspan x="328.79223159958354" dy="0em">
                              Conference 12%
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer">
                          <text
                            cx="275"
                            cy="138"
                            stroke="none"
                            name="Hackathon"
                            alignment-baseline="middle"
                            x="386.9374896044318"
                            y="181.2434783644623"
                            className="recharts-text recharts-pie-label-text"
                            text-anchor="start"
                            fill="#3B82F6"
                          >
                            <tspan x="386.9374896044318" dy="0em">
                              Hackathon 12%
                            </tspan>
                          </text>
                        </g>
                      </g>
                    </g>
                  </svg>
                  <div
                    className="recharts-legend-wrapper"
                    style={{
                      position: "absolute",
                      width: "540px",
                      height: "auto",
                      left: "5px",
                      bottom: "5px"
                    }}
                  >
                    <ul
                      className="recharts-default-legend"
                      style={{
                        padding: "0px",
                        margin: "0px",
                        textAlign: "center"
                      }}
                    >
                      <li
                        className="recharts-legend-item legend-item-0"
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <svg
                          className="recharts-surface"
                          width="14"
                          height="14"
                          viewBox="0 0 32 32"
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginRight: "4px"
                          }}
                        >
                          <title></title>
                          <desc></desc>
                          <path
                            stroke="none"
                            fill="#3B82F6"
                            d="M0,4h32v24h-32z"
                            className="recharts-legend-icon"
                          ></path>
                        </svg>
                        <span
                          className="recharts-legend-item-text"
                          style={{ color: "rgb(59, 130, 246)" }}
                        >
                          Pitch
                        </span>
                      </li>
                      <li
                        className="recharts-legend-item legend-item-1"
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <svg
                          className="recharts-surface"
                          width="14"
                          height="14"
                          viewBox="0 0 32 32"
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginRight: "4px"
                          }}
                        >
                          <title></title>
                          <desc></desc>
                          <path
                            stroke="none"
                            fill="#60A5FA"
                            d="M0,4h32v24h-32z"
                            className="recharts-legend-icon"
                          ></path>
                        </svg>
                        <span
                          className="recharts-legend-item-text"
                          style={{ color: "rgb(96, 165, 250)" }}
                        >
                          Workshop
                        </span>
                      </li>
                      <li
                        className="recharts-legend-item legend-item-2"
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <svg
                          className="recharts-surface"
                          width="14"
                          height="14"
                          viewBox="0 0 32 32"
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginRight: "4px"
                          }}
                        >
                          <title></title>
                          <desc></desc>
                          <path
                            stroke="none"
                            fill="#93C5FD"
                            d="M0,4h32v24h-32z"
                            className="recharts-legend-icon"
                          ></path>
                        </svg>
                        <span
                          className="recharts-legend-item-text"
                          style={{ color: "rgb(147, 197, 253)" }}
                        >
                          Networking
                        </span>
                      </li>
                      <li
                        className="recharts-legend-item legend-item-3"
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <svg
                          className="recharts-surface"
                          width="14"
                          height="14"
                          viewBox="0 0 32 32"
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginRight: "4px"
                          }}
                        >
                          <title></title>
                          <desc></desc>
                          <path
                            stroke="none"
                            fill="#BFDBFE"
                            d="M0,4h32v24h-32z"
                            className="recharts-legend-icon"
                          ></path>
                        </svg>
                        <span
                          className="recharts-legend-item-text"
                          style={{ color: "rgb(191, 219, 254)" }}
                        >
                          Conference
                        </span>
                      </li>
                      <li
                        className="recharts-legend-item legend-item-4"
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <svg
                          className="recharts-surface"
                          width="14"
                          height="14"
                          viewBox="0 0 32 32"
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginRight: "4px"
                          }}
                        >
                          <title></title>
                          <desc></desc>
                          <path
                            stroke="none"
                            fill="#3B82F6"
                            d="M0,4h32v24h-32z"
                            className="recharts-legend-icon"
                          ></path>
                        </svg>
                        <span
                          className="recharts-legend-item-text"
                          style={{ color: "rgb(59, 130, 246)" }}
                        >
                          Hackathon
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div
                    tabIndex={-1}
                    className="recharts-tooltip-wrapper recharts-tooltip-wrapper-right recharts-tooltip-wrapper-bottom"
                    style={{
                      visibility: "hidden",
                      pointerEvents: "none",
                      position: "absolute",
                      top: "0px",
                      left: "0px",
                      transform: "translate(238.654px, 166.763px)"
                    }}
                  >
                    <div
                      className="recharts-default-tooltip"
                      style={{
                        margin: "0px",
                        padding: "10px",
                        backgroundColor: "rgb(255, 255, 255)",
                        border: "1px solid rgb(204, 204, 204)",
                        whiteSpace: "nowrap"
                      }}
                    >
                      <p
                        className="recharts-tooltip-label"
                        style={{ margin: "0px" }}
                      ></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm animate-fade-in overflow-hidden"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Connections Growth
              </h3>
            </div>
            <div className="p-6 pt-0">
              <div
                className="recharts-responsive-container"
                style={{ width: "100%", height: "300px", minWidth: "0px" }}
              >
                <div
                  className="recharts-wrapper"
                  style={{
                    position: "relative",
                    cursor: "default",
                    width: "550px",
                    height: "300px"
                  }}
                >
                  <svg
                    className="recharts-surface"
                    width="550"
                    height="300"
                    viewBox="0 0 550 300"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <title></title>
                    <desc></desc>
                    <defs>
                      <clipPath id="recharts557-clip">
                        <rect x="65" y="5" height="260" width="480"></rect>
                      </clipPath>
                    </defs>
                    <g className="recharts-cartesian-grid">
                      <g className="recharts-cartesian-grid-horizontal">
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="480"
                          height="260"
                          x1="65"
                          y1="265"
                          x2="545"
                          y2="265"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="480"
                          height="260"
                          x1="65"
                          y1="200"
                          x2="545"
                          y2="200"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="480"
                          height="260"
                          x1="65"
                          y1="135"
                          x2="545"
                          y2="135"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="480"
                          height="260"
                          x1="65"
                          y1="70"
                          x2="545"
                          y2="70"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="480"
                          height="260"
                          x1="65"
                          y1="5"
                          x2="545"
                          y2="5"
                        ></line>
                      </g>
                      <g className="recharts-cartesian-grid-vertical">
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="480"
                          height="260"
                          x1="65"
                          y1="5"
                          x2="65"
                          y2="265"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="480"
                          height="260"
                          x1="161"
                          y1="5"
                          x2="161"
                          y2="265"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="480"
                          height="260"
                          x1="257"
                          y1="5"
                          x2="257"
                          y2="265"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="480"
                          height="260"
                          x1="353"
                          y1="5"
                          x2="353"
                          y2="265"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="480"
                          height="260"
                          x1="449"
                          y1="5"
                          x2="449"
                          y2="265"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="480"
                          height="260"
                          x1="545"
                          y1="5"
                          x2="545"
                          y2="265"
                        ></line>
                      </g>
                    </g>
                    <g className="recharts-layer recharts-cartesian-axis recharts-xAxis xAxis">
                      <line
                        orientation="bottom"
                        width="480"
                        height="30"
                        x="65"
                        y="265"
                        className="recharts-cartesian-axis-line"
                        stroke="#666"
                        fill="none"
                        x1="65"
                        y1="265"
                        x2="545"
                        y2="265"
                      ></line>
                      <g className="recharts-cartesian-axis-ticks">
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="bottom"
                            width="480"
                            height="30"
                            x="65"
                            y="265"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="65"
                            y1="271"
                            x2="65"
                            y2="265"
                          ></line>
                          <text
                            orientation="bottom"
                            width="480"
                            height="30"
                            stroke="none"
                            x="65"
                            y="273"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                            fill="#666"
                          >
                            <tspan x="65" dy="0.71em">
                              Jan
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="bottom"
                            width="480"
                            height="30"
                            x="65"
                            y="265"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="161"
                            y1="271"
                            x2="161"
                            y2="265"
                          ></line>
                          <text
                            orientation="bottom"
                            width="480"
                            height="30"
                            stroke="none"
                            x="161"
                            y="273"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                            fill="#666"
                          >
                            <tspan x="161" dy="0.71em">
                              Feb
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="bottom"
                            width="480"
                            height="30"
                            x="65"
                            y="265"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="257"
                            y1="271"
                            x2="257"
                            y2="265"
                          ></line>
                          <text
                            orientation="bottom"
                            width="480"
                            height="30"
                            stroke="none"
                            x="257"
                            y="273"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                            fill="#666"
                          >
                            <tspan x="257" dy="0.71em">
                              Mar
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="bottom"
                            width="480"
                            height="30"
                            x="65"
                            y="265"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="353"
                            y1="271"
                            x2="353"
                            y2="265"
                          ></line>
                          <text
                            orientation="bottom"
                            width="480"
                            height="30"
                            stroke="none"
                            x="353"
                            y="273"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                            fill="#666"
                          >
                            <tspan x="353" dy="0.71em">
                              Apr
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="bottom"
                            width="480"
                            height="30"
                            x="65"
                            y="265"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="449"
                            y1="271"
                            x2="449"
                            y2="265"
                          ></line>
                          <text
                            orientation="bottom"
                            width="480"
                            height="30"
                            stroke="none"
                            x="449"
                            y="273"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                            fill="#666"
                          >
                            <tspan x="449" dy="0.71em">
                              May
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="bottom"
                            width="480"
                            height="30"
                            x="65"
                            y="265"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="545"
                            y1="271"
                            x2="545"
                            y2="265"
                          ></line>
                          <text
                            orientation="bottom"
                            width="480"
                            height="30"
                            stroke="none"
                            x="538.0874996185303"
                            y="273"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                            fill="#666"
                          >
                            <tspan x="538.0874996185303" dy="0.71em">
                              Jun
                            </tspan>
                          </text>
                        </g>
                      </g>
                    </g>
                    <g className="recharts-layer recharts-cartesian-axis recharts-yAxis yAxis">
                      <line
                        orientation="left"
                        width="60"
                        height="260"
                        x="5"
                        y="5"
                        className="recharts-cartesian-axis-line"
                        stroke="#666"
                        fill="none"
                        x1="65"
                        y1="5"
                        x2="65"
                        y2="265"
                      ></line>
                      <g className="recharts-cartesian-axis-ticks">
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="left"
                            width="60"
                            height="260"
                            x="5"
                            y="5"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="59"
                            y1="265"
                            x2="65"
                            y2="265"
                          ></line>
                          <text
                            orientation="left"
                            width="60"
                            height="260"
                            stroke="none"
                            x="57"
                            y="265"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                            fill="#666"
                          >
                            <tspan x="57" dy="0.355em">
                              0
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="left"
                            width="60"
                            height="260"
                            x="5"
                            y="5"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="59"
                            y1="200"
                            x2="65"
                            y2="200"
                          ></line>
                          <text
                            orientation="left"
                            width="60"
                            height="260"
                            stroke="none"
                            x="57"
                            y="200"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                            fill="#666"
                          >
                            <tspan x="57" dy="0.355em">
                              6
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="left"
                            width="60"
                            height="260"
                            x="5"
                            y="5"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="59"
                            y1="135"
                            x2="65"
                            y2="135"
                          ></line>
                          <text
                            orientation="left"
                            width="60"
                            height="260"
                            stroke="none"
                            x="57"
                            y="135"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                            fill="#666"
                          >
                            <tspan x="57" dy="0.355em">
                              12
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="left"
                            width="60"
                            height="260"
                            x="5"
                            y="5"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="59"
                            y1="70"
                            x2="65"
                            y2="70"
                          ></line>
                          <text
                            orientation="left"
                            width="60"
                            height="260"
                            stroke="none"
                            x="57"
                            y="70"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                            fill="#666"
                          >
                            <tspan x="57" dy="0.355em">
                              18
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="left"
                            width="60"
                            height="260"
                            x="5"
                            y="5"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="59"
                            y1="5"
                            x2="65"
                            y2="5"
                          ></line>
                          <text
                            orientation="left"
                            width="60"
                            height="260"
                            stroke="none"
                            x="57"
                            y="12"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                            fill="#666"
                          >
                            <tspan x="57" dy="0.355em">
                              24
                            </tspan>
                          </text>
                        </g>
                      </g>
                    </g>
                    <g className="recharts-layer recharts-line">
                      <path
                        stroke="#3B82F6"
                        stroke-width="2"
                        fill="none"
                        width="480"
                        height="260"
                        className="recharts-curve recharts-line-curve"
                        d="M65,26.667C97,73.611,129,120.556,161,135C193,149.444,225,156.667,257,156.667C289,156.667,321,156.667,353,156.667C385,156.667,417,26.667,449,26.667C481,26.667,513,113.333,545,200"
                      ></path>
                      <g className="recharts-layer"></g>
                      <g className="recharts-layer recharts-line-dots">
                        <circle
                          r="3"
                          stroke="#3B82F6"
                          stroke-width="2"
                          fill="#fff"
                          width="480"
                          height="260"
                          cx="65"
                          cy="26.666666666666675"
                          className="recharts-dot recharts-line-dot"
                        ></circle>
                        <circle
                          r="3"
                          stroke="#3B82F6"
                          stroke-width="2"
                          fill="#fff"
                          width="480"
                          height="260"
                          cx="161"
                          cy="135"
                          className="recharts-dot recharts-line-dot"
                        ></circle>
                        <circle
                          r="3"
                          stroke="#3B82F6"
                          stroke-width="2"
                          fill="#fff"
                          width="480"
                          height="260"
                          cx="257"
                          cy="156.66666666666666"
                          className="recharts-dot recharts-line-dot"
                        ></circle>
                        <circle
                          r="3"
                          stroke="#3B82F6"
                          stroke-width="2"
                          fill="#fff"
                          width="480"
                          height="260"
                          cx="353"
                          cy="156.66666666666666"
                          className="recharts-dot recharts-line-dot"
                        ></circle>
                        <circle
                          r="3"
                          stroke="#3B82F6"
                          stroke-width="2"
                          fill="#fff"
                          width="480"
                          height="260"
                          cx="449"
                          cy="26.666666666666675"
                          className="recharts-dot recharts-line-dot"
                        ></circle>
                        <circle
                          r="3"
                          stroke="#3B82F6"
                          stroke-width="2"
                          fill="#fff"
                          width="480"
                          height="260"
                          cx="545"
                          cy="200"
                          className="recharts-dot recharts-line-dot"
                        ></circle>
                      </g>
                    </g>
                  </svg>
                  <div
                    className="recharts-legend-wrapper"
                    style={{
                      position: "absolute",
                      width: "540px",
                      height: "auto",
                      left: "5px",
                      bottom: "5px"
                    }}
                  >
                    <ul
                      className="recharts-default-legend"
                      style={{
                        padding: "0px",
                        margin: "0px",
                        textAlign: "center"
                      }}
                    >
                      <li
                        className="recharts-legend-item legend-item-0"
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <svg
                          className="recharts-surface"
                          width="14"
                          height="14"
                          viewBox="0 0 32 32"
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginRight: "4px"
                          }}
                        >
                          <title></title>
                          <desc></desc>
                          <path
                            stroke="none"
                            fill="#3B82F6"
                            d="M0,4h32v24h-32z"
                            className="recharts-legend-icon"
                          ></path>
                        </svg>
                        <span
                          className="recharts-legend-item-text"
                          style={{ color: "rgb(59, 130, 246)" }}
                        >
                          Pitch
                        </span>
                      </li>
                      <li
                        className="recharts-legend-item legend-item-1"
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <svg
                          className="recharts-surface"
                          width="14"
                          height="14"
                          viewBox="0 0 32 32"
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginRight: "4px"
                          }}
                        >
                          <title></title>
                          <desc></desc>
                          <path
                            stroke="none"
                            fill="#60A5FA"
                            d="M0,4h32v24h-32z"
                            className="recharts-legend-icon"
                          ></path>
                        </svg>
                        <span
                          className="recharts-legend-item-text"
                          style={{ color: "rgb(96, 165, 250)" }}
                        >
                          Workshop
                        </span>
                      </li>
                      <li
                        className="recharts-legend-item legend-item-2"
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <svg
                          className="recharts-surface"
                          width="14"
                          height="14"
                          viewBox="0 0 32 32"
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginRight: "4px"
                          }}
                        >
                          <title></title>
                          <desc></desc>
                          <path
                            stroke="none"
                            fill="#93C5FD"
                            d="M0,4h32v24h-32z"
                            className="recharts-legend-icon"
                          ></path>
                        </svg>
                        <span
                          className="recharts-legend-item-text"
                          style={{ color: "rgb(147, 197, 253)" }}
                        >
                          Networking
                        </span>
                      </li>
                      <li
                        className="recharts-legend-item legend-item-3"
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <svg
                          className="recharts-surface"
                          width="14"
                          height="14"
                          viewBox="0 0 32 32"
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginRight: "4px"
                          }}
                        >
                          <title></title>
                          <desc></desc>
                          <path
                            stroke="none"
                            fill="#BFDBFE"
                            d="M0,4h32v24h-32z"
                            className="recharts-legend-icon"
                          ></path>
                        </svg>
                        <span
                          className="recharts-legend-item-text"
                          style={{ color: "rgb(191, 219, 254)" }}
                        >
                          Conference
                        </span>
                      </li>
                      <li
                        className="recharts-legend-item legend-item-4"
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <svg
                          className="recharts-surface"
                          width="14"
                          height="14"
                          viewBox="0 0 32 32"
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginRight: "4px"
                          }}
                        >
                          <title></title>
                          <desc></desc>
                          <path
                            stroke="none"
                            fill="#3B82F6"
                            d="M0,4h32v24h-32z"
                            className="recharts-legend-icon"
                          ></path>
                        </svg>
                        <span
                          className="recharts-legend-item-text"
                          style={{ color: "rgb(59, 130, 246)" }}
                        >
                          Hackathon
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div
                    tabIndex={-1}
                    className="recharts-tooltip-wrapper recharts-tooltip-wrapper-right recharts-tooltip-wrapper-top"
                    style={{
                      visibility: "hidden",
                      pointerEvents: "none",
                      position: "absolute",
                      top: "0px",
                      left: "0px",
                      transform: "translate(171px, 110.4px)"
                    }}
                  >
                    <div
                      className="recharts-default-tooltip"
                      style={{
                        margin: "0px",
                        padding: "10px",
                        backgroundColor: "rgb(255, 255, 255)",
                        border: "1px solid rgb(204, 204, 204)",
                        whiteSpace: "nowrap"
                      }}
                    >
                      <p
                        className="recharts-tooltip-label"
                        style={{ margin: "0px" }}
                      >
                        Feb
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="rounded-lg border bg-card text-card-foreground shadow-sm lg:col-span-2 animate-fade-in overflow-hidden"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Weekly Engagement
              </h3>
            </div>
            <div className="p-6 pt-0">
              <div
                className="recharts-responsive-container"
                style={{ width: "100%", height: "300px", minWidth: "0px" }}
              >
                <div
                  className="recharts-wrapper"
                  style={{
                    position: "relative",
                    cursor: "default",
                    width: "1174px",
                    height: "300px"
                  }}
                >
                  <svg
                    className="recharts-surface"
                    width="1174"
                    height="300"
                    viewBox="0 0 1174 300"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <title></title>
                    <desc></desc>
                    <defs>
                      <clipPath id="recharts560-clip">
                        <rect x="65" y="5" height="236" width="1104"></rect>
                      </clipPath>
                    </defs>
                    <g className="recharts-cartesian-grid">
                      <g className="recharts-cartesian-grid-horizontal">
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="65"
                          y1="241"
                          x2="1169"
                          y2="241"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="65"
                          y1="182"
                          x2="1169"
                          y2="182"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="65"
                          y1="123"
                          x2="1169"
                          y2="123"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="65"
                          y1="64"
                          x2="1169"
                          y2="64"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="65"
                          y1="5"
                          x2="1169"
                          y2="5"
                        ></line>
                      </g>
                      <g className="recharts-cartesian-grid-vertical">
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="143.85714285714286"
                          y1="5"
                          x2="143.85714285714286"
                          y2="241"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="301.57142857142856"
                          y1="5"
                          x2="301.57142857142856"
                          y2="241"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="459.28571428571433"
                          y1="5"
                          x2="459.28571428571433"
                          y2="241"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="617"
                          y1="5"
                          x2="617"
                          y2="241"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="774.7142857142858"
                          y1="5"
                          x2="774.7142857142858"
                          y2="241"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="932.4285714285716"
                          y1="5"
                          x2="932.4285714285716"
                          y2="241"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="1090.142857142857"
                          y1="5"
                          x2="1090.142857142857"
                          y2="241"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="65"
                          y1="5"
                          x2="65"
                          y2="241"
                        ></line>
                        <line
                          stroke-dasharray="3 3"
                          stroke="#ccc"
                          fill="none"
                          x="65"
                          y="5"
                          width="1104"
                          height="236"
                          x1="1169"
                          y1="5"
                          x2="1169"
                          y2="241"
                        ></line>
                      </g>
                    </g>
                    <g className="recharts-layer recharts-cartesian-axis recharts-xAxis xAxis">
                      <line
                        orientation="bottom"
                        width="1104"
                        height="30"
                        x="65"
                        y="241"
                        className="recharts-cartesian-axis-line"
                        stroke="#666"
                        fill="none"
                        x1="65"
                        y1="241"
                        x2="1169"
                        y2="241"
                      ></line>
                      <g className="recharts-cartesian-axis-ticks">
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="bottom"
                            width="1104"
                            height="30"
                            x="65"
                            y="241"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="143.85714285714286"
                            y1="247"
                            x2="143.85714285714286"
                            y2="241"
                          ></line>
                          <text
                            orientation="bottom"
                            width="1104"
                            height="30"
                            stroke="none"
                            x="143.85714285714286"
                            y="249"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                            fill="#666"
                          >
                            <tspan x="143.85714285714286" dy="0.71em">
                              Mon
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="bottom"
                            width="1104"
                            height="30"
                            x="65"
                            y="241"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="301.57142857142856"
                            y1="247"
                            x2="301.57142857142856"
                            y2="241"
                          ></line>
                          <text
                            orientation="bottom"
                            width="1104"
                            height="30"
                            stroke="none"
                            x="301.57142857142856"
                            y="249"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                            fill="#666"
                          >
                            <tspan x="301.57142857142856" dy="0.71em">
                              Tue
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="bottom"
                            width="1104"
                            height="30"
                            x="65"
                            y="241"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="459.28571428571433"
                            y1="247"
                            x2="459.28571428571433"
                            y2="241"
                          ></line>
                          <text
                            orientation="bottom"
                            width="1104"
                            height="30"
                            stroke="none"
                            x="459.28571428571433"
                            y="249"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                            fill="#666"
                          >
                            <tspan x="459.28571428571433" dy="0.71em">
                              Wed
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="bottom"
                            width="1104"
                            height="30"
                            x="65"
                            y="241"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="617"
                            y1="247"
                            x2="617"
                            y2="241"
                          ></line>
                          <text
                            orientation="bottom"
                            width="1104"
                            height="30"
                            stroke="none"
                            x="617"
                            y="249"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                            fill="#666"
                          >
                            <tspan x="617" dy="0.71em">
                              Thu
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="bottom"
                            width="1104"
                            height="30"
                            x="65"
                            y="241"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="774.7142857142858"
                            y1="247"
                            x2="774.7142857142858"
                            y2="241"
                          ></line>
                          <text
                            orientation="bottom"
                            width="1104"
                            height="30"
                            stroke="none"
                            x="774.7142857142858"
                            y="249"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                            fill="#666"
                          >
                            <tspan x="774.7142857142858" dy="0.71em">
                              Fri
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="bottom"
                            width="1104"
                            height="30"
                            x="65"
                            y="241"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="932.4285714285716"
                            y1="247"
                            x2="932.4285714285716"
                            y2="241"
                          ></line>
                          <text
                            orientation="bottom"
                            width="1104"
                            height="30"
                            stroke="none"
                            x="932.4285714285716"
                            y="249"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                            fill="#666"
                          >
                            <tspan x="932.4285714285716" dy="0.71em">
                              Sat
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="bottom"
                            width="1104"
                            height="30"
                            x="65"
                            y="241"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="1090.142857142857"
                            y1="247"
                            x2="1090.142857142857"
                            y2="241"
                          ></line>
                          <text
                            orientation="bottom"
                            width="1104"
                            height="30"
                            stroke="none"
                            x="1090.142857142857"
                            y="249"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="middle"
                            fill="#666"
                          >
                            <tspan x="1090.142857142857" dy="0.71em">
                              Sun
                            </tspan>
                          </text>
                        </g>
                      </g>
                    </g>
                    <g className="recharts-layer recharts-cartesian-axis recharts-yAxis yAxis">
                      <line
                        orientation="left"
                        width="60"
                        height="236"
                        x="5"
                        y="5"
                        className="recharts-cartesian-axis-line"
                        stroke="#666"
                        fill="none"
                        x1="65"
                        y1="5"
                        x2="65"
                        y2="241"
                      ></line>
                      <g className="recharts-cartesian-axis-ticks">
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="left"
                            width="60"
                            height="236"
                            x="5"
                            y="5"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="59"
                            y1="241"
                            x2="65"
                            y2="241"
                          ></line>
                          <text
                            orientation="left"
                            width="60"
                            height="236"
                            stroke="none"
                            x="57"
                            y="241"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                            fill="#666"
                          >
                            <tspan x="57" dy="0.355em">
                              0
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="left"
                            width="60"
                            height="236"
                            x="5"
                            y="5"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="59"
                            y1="182"
                            x2="65"
                            y2="182"
                          ></line>
                          <text
                            orientation="left"
                            width="60"
                            height="236"
                            stroke="none"
                            x="57"
                            y="182"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                            fill="#666"
                          >
                            <tspan x="57" dy="0.355em">
                              6
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="left"
                            width="60"
                            height="236"
                            x="5"
                            y="5"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="59"
                            y1="123"
                            x2="65"
                            y2="123"
                          ></line>
                          <text
                            orientation="left"
                            width="60"
                            height="236"
                            stroke="none"
                            x="57"
                            y="123"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                            fill="#666"
                          >
                            <tspan x="57" dy="0.355em">
                              12
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="left"
                            width="60"
                            height="236"
                            x="5"
                            y="5"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="59"
                            y1="64"
                            x2="65"
                            y2="64"
                          ></line>
                          <text
                            orientation="left"
                            width="60"
                            height="236"
                            stroke="none"
                            x="57"
                            y="64"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                            fill="#666"
                          >
                            <tspan x="57" dy="0.355em">
                              18
                            </tspan>
                          </text>
                        </g>
                        <g className="recharts-layer recharts-cartesian-axis-tick">
                          <line
                            orientation="left"
                            width="60"
                            height="236"
                            x="5"
                            y="5"
                            className="recharts-cartesian-axis-tick-line"
                            stroke="#666"
                            fill="none"
                            x1="59"
                            y1="5"
                            x2="65"
                            y2="5"
                          ></line>
                          <text
                            orientation="left"
                            width="60"
                            height="236"
                            stroke="none"
                            x="57"
                            y="12"
                            className="recharts-text recharts-cartesian-axis-tick-value"
                            text-anchor="end"
                            fill="#666"
                          >
                            <tspan x="57" dy="0.355em">
                              24
                            </tspan>
                          </text>
                        </g>
                      </g>
                    </g>
                    <g className="recharts-layer recharts-bar">
                      <g className="recharts-layer recharts-bar-rectangles">
                        <g className="recharts-layer">
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="80.77142857142857"
                              y="162.33333333333334"
                              width="61"
                              height="78.66666666666666"
                              radius="0"
                              fill="#3B82F6"
                              name="Mon"
                              className="recharts-rectangle"
                              d="M 80.77142857142857,162.33333333333334 h 61 v 78.66666666666666 h -61 Z"
                            ></path>
                          </g>
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="238.4857142857143"
                              y="231.16666666666669"
                              width="61"
                              height="9.833333333333314"
                              radius="0"
                              fill="#3B82F6"
                              name="Tue"
                              className="recharts-rectangle"
                              d="M 238.4857142857143,231.16666666666669 h 61 v 9.833333333333314 h -61 Z"
                            ></path>
                          </g>
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="396.20000000000005"
                              y="231.16666666666669"
                              width="61"
                              height="9.833333333333314"
                              radius="0"
                              fill="#3B82F6"
                              name="Wed"
                              className="recharts-rectangle"
                              d="M 396.20000000000005,231.16666666666669 h 61 v 9.833333333333314 h -61 Z"
                            ></path>
                          </g>
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="553.9142857142857"
                              y="152.5"
                              width="61"
                              height="88.5"
                              radius="0"
                              fill="#3B82F6"
                              name="Thu"
                              className="recharts-rectangle"
                              d="M 553.9142857142857,152.5 h 61 v 88.5 h -61 Z"
                            ></path>
                          </g>
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="711.6285714285715"
                              y="221.33333333333331"
                              width="61"
                              height="19.666666666666686"
                              radius="0"
                              fill="#3B82F6"
                              name="Fri"
                              className="recharts-rectangle"
                              d="M 711.6285714285715,221.33333333333331 h 61 v 19.666666666666686 h -61 Z"
                            ></path>
                          </g>
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="869.3428571428573"
                              y="201.66666666666669"
                              width="61"
                              height="39.333333333333314"
                              radius="0"
                              fill="#3B82F6"
                              name="Sat"
                              className="recharts-rectangle"
                              d="M 869.3428571428573,201.66666666666669 h 61 v 39.333333333333314 h -61 Z"
                            ></path>
                          </g>
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="1027.057142857143"
                              y="191.83333333333331"
                              width="61"
                              height="49.166666666666686"
                              radius="0"
                              fill="#3B82F6"
                              name="Sun"
                              className="recharts-rectangle"
                              d="M 1027.057142857143,191.83333333333331 h 61 v 49.166666666666686 h -61 Z"
                            ></path>
                          </g>
                        </g>
                      </g>
                      <g className="recharts-layer"></g>
                    </g>
                    <g className="recharts-layer recharts-bar">
                      <g className="recharts-layer recharts-bar-rectangles">
                        <g className="recharts-layer">
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="145.77142857142857"
                              y="14.833333333333325"
                              width="61"
                              height="226.16666666666669"
                              radius="0"
                              fill="#60A5FA"
                              name="Mon"
                              className="recharts-rectangle"
                              d="M 145.77142857142857,14.833333333333325 h 61 v 226.16666666666669 h -61 Z"
                            ></path>
                          </g>
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="303.48571428571427"
                              y="103.33333333333333"
                              width="61"
                              height="137.66666666666669"
                              radius="0"
                              fill="#60A5FA"
                              name="Tue"
                              className="recharts-rectangle"
                              d="M 303.48571428571427,103.33333333333333 h 61 v 137.66666666666669 h -61 Z"
                            ></path>
                          </g>
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="461.20000000000005"
                              y="172.16666666666666"
                              width="61"
                              height="68.83333333333334"
                              radius="0"
                              fill="#60A5FA"
                              name="Wed"
                              className="recharts-rectangle"
                              d="M 461.20000000000005,172.16666666666666 h 61 v 68.83333333333334 h -61 Z"
                            ></path>
                          </g>
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="618.9142857142857"
                              y="152.5"
                              width="61"
                              height="88.5"
                              radius="0"
                              fill="#60A5FA"
                              name="Thu"
                              className="recharts-rectangle"
                              d="M 618.9142857142857,152.5 h 61 v 88.5 h -61 Z"
                            ></path>
                          </g>
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="776.6285714285715"
                              y="191.83333333333331"
                              width="61"
                              height="49.166666666666686"
                              radius="0"
                              fill="#60A5FA"
                              name="Fri"
                              className="recharts-rectangle"
                              d="M 776.6285714285715,191.83333333333331 h 61 v 49.166666666666686 h -61 Z"
                            ></path>
                          </g>
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="934.3428571428573"
                              y="172.16666666666666"
                              width="61"
                              height="68.83333333333334"
                              radius="0"
                              fill="#60A5FA"
                              name="Sat"
                              className="recharts-rectangle"
                              d="M 934.3428571428573,172.16666666666666 h 61 v 68.83333333333334 h -61 Z"
                            ></path>
                          </g>
                          <g className="recharts-layer recharts-bar-rectangle">
                            <path
                              x="1092.057142857143"
                              y="83.66666666666667"
                              width="61"
                              height="157.33333333333331"
                              radius="0"
                              fill="#60A5FA"
                              name="Sun"
                              className="recharts-rectangle"
                              d="M 1092.057142857143,83.66666666666667 h 61 v 157.33333333333331 h -61 Z"
                            ></path>
                          </g>
                        </g>
                      </g>
                      <g className="recharts-layer"></g>
                    </g>
                  </svg>
                  <div
                    className="recharts-legend-wrapper"
                    style={{
                      position: "absolute",
                      width: "1164px",
                      height: "auto",
                      left: "5px",
                      bottom: "5px"
                    }}
                  >
                    <ul
                      className="recharts-default-legend"
                      style={{
                        padding: "0px",
                        margin: "0px",
                        textAlign: "center"
                      }}
                    >
                      <li
                        className="recharts-legend-item legend-item-0"
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <svg
                          className="recharts-surface"
                          width="14"
                          height="14"
                          viewBox="0 0 32 32"
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginRight: "4px"
                          }}
                        >
                          <title></title>
                          <desc></desc>
                          <path
                            stroke="none"
                            fill="#3B82F6"
                            d="M0,4h32v24h-32z"
                            className="recharts-legend-icon"
                          ></path>
                        </svg>
                        <span
                          className="recharts-legend-item-text"
                          style={{ color: "rgb(59, 130, 246)" }}
                        >
                          events
                        </span>
                      </li>
                      <li
                        className="recharts-legend-item legend-item-1"
                        style={{ display: "inline-block", marginRight: "10px" }}
                      >
                        <svg
                          className="recharts-surface"
                          width="14"
                          height="14"
                          viewBox="0 0 32 32"
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginRight: "4px"
                          }}
                        >
                          <title></title>
                          <desc></desc>
                          <path
                            stroke="none"
                            fill="#60A5FA"
                            d="M0,4h32v24h-32z"
                            className="recharts-legend-icon"
                          ></path>
                        </svg>
                        <span
                          className="recharts-legend-item-text"
                          style={{ color: "rgb(96, 165, 250)" }}
                        >
                          connections
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div
                    tabIndex={-1}
                    className="recharts-tooltip-wrapper recharts-tooltip-wrapper-right recharts-tooltip-wrapper-bottom"
                    style={{
                      visibility: "hidden",
                      pointerEvents: "none",
                      position: "absolute",
                      top: "0px",
                      left: "0px",
                      transform: "translate(627px, 91px)"
                    }}
                  >
                    <div
                      className="recharts-default-tooltip"
                      style={{
                        margin: "0px",
                        padding: "10px",
                        backgroundColor: "rgb(255, 255, 255)",
                        border: "1px solid rgb(204, 204, 204)",
                        whiteSpace: "nowrap"
                      }}
                    >
                      <p
                        className="recharts-tooltip-label"
                        style={{ margin: "0px" }}
                      >
                        Thu
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <YourUpcomEvents />
          <RecentConnections />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
