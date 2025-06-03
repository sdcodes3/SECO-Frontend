import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchEventApplicationsByUser,
  deleteEventApplication,
  selectEventApplications,
  selectEventApplicationLoading,
  selectEventApplicationError,
  selectEventApplicationSuccess,
  clearMessages
} from "../slices/EventApplicationSlice";
import { fetchEventById, selectEventsById } from "../slices/EventSlice";
import { AppDispatch } from "../storage/store";

// Utility to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const Applications = () => {
  const dispatch = useDispatch<AppDispatch>();

  const eventApplications = useSelector(selectEventApplications);
  const loading = useSelector(selectEventApplicationLoading);
  const error = useSelector(selectEventApplicationError);
  const success = useSelector(selectEventApplicationSuccess);

  const eventsById = useSelector(selectEventsById);

  useEffect(() => {
    dispatch(fetchEventApplicationsByUser());
  }, [dispatch]);
  useEffect(() => {
    eventApplications.forEach((app) => {
      if (app.event_id && !eventsById[app.event_id]) {
        dispatch(fetchEventById(app.event_id));
      }
    });
  }, [dispatch, eventApplications, eventsById]);
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearMessages());
    }
  }, [success, error, dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteEventApplication(id));
  };

  return (
    <div>
      <div className="container py-6 md:py-8 max-w-6xl">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                My Applications
              </h1>
              <p className="text-muted-foreground">
                Track the status of your event applications.
              </p>
            </div>
            <a
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4 md:mt-0"
              href="/dashboard/explore"
            >
              Find New Events
            </a>
          </div>
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="bg-gray-50 p-4 border-b">
              <h2 className="text-lg font-semibold">
                Applications ({eventApplications.length})
              </h2>
            </div>
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : eventApplications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No applications found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[400px]">
                          Event
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                          Date Applied
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                          Documents
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                          Status
                        </th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {eventApplications.map((application, index) => {
                        const event = eventsById[application.event_id];
                        return (
                          <tr
                            key={application.id || index}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-10 h-10 rounded bg-center bg-cover flex-shrink-0"
                                  style={{
                                    backgroundImage: event?.banner
                                      ? `url("${event.banner}")`
                                      : 'url("https://images.unsplash.com/photo-1540304453527-62f979142a17?auto=format&fit=crop&q=80&w=500&h=280")'
                                  }}
                                ></div>
                                <div>
                                  <div className="font-medium">
                                    {event?.title || "Loading event..."}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {event?.type || "Unknown Type"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                              <div className="text-sm">
                                {application.applied_date
                                  ? formatDate(application.applied_date)
                                  : "N/A"}
                              </div>
                            </td>
                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                              <div className="flex flex-wrap gap-2">
                                {application.documents &&
                                application.documents.length > 0 ? (
                                  application.documents.map((doc, idx) => (
                                    <div
                                      key={idx}
                                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground bg-gray-50"
                                    >
                                      {doc.length > 15
                                        ? `${doc.substring(0, 12)}...`
                                        : doc}
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-muted-foreground">
                                    No documents
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                              <div
                                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                                  application.status === "approved"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : application.status === "rejected"
                                    ? "bg-red-100 text-red-800 border-red-200"
                                    : application.status === "reviewing"
                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                    : "bg-blue-100 text-blue-800 border-blue-200"
                                }`}
                              >
                                {application.status.charAt(0).toUpperCase() +
                                  application.status.slice(1)}
                              </div>
                            </td>
                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                                  onClick={() => {}}
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
                                    className="lucide lucide-eye h-4 w-4 mr-1"
                                  >
                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                  </svg>
                                  View
                                </button>
                                <button
                                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                                  onClick={() => {}}
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
                                    className="lucide lucide-edit h-4 w-4 mr-1"
                                  >
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-red-100 hover:text-red-600 h-9 rounded-md px-3"
                                  onClick={() =>
                                    application.id &&
                                    handleDelete(application.id)
                                  }
                                  disabled={loading}
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
                                    className="lucide lucide-trash-2 h-4 w-4 mr-1"
                                  >
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    <line
                                      x1="10"
                                      y1="11"
                                      x2="10"
                                      y2="17"
                                    ></line>
                                    <line
                                      x1="14"
                                      y1="11"
                                      x2="14"
                                      y2="17"
                                    ></line>
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
