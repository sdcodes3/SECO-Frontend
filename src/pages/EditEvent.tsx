import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface EventFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location_link: string;
  type: string;
  created_by: string;
  capacity?: number;
  is_virtual: boolean;
  require_pitch_deck: boolean;
}

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    location_link: "",
    type: "networking",
    created_by: "",
    capacity: 0,
    is_virtual: false,
    require_pitch_deck: false
  });

  const fetchFormFields = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://localhost:3000/api/form/${eventId}`,
        {
          params: {
            event_id: eventId
          }
        }
      );
      console.log("Fetched form fields:", response.data.forms);

      if (response.data.forms && Array.isArray(response.data.forms)) {
        // Transform the received fields to match our local format
        const transformedFields = response.data.forms.map((field: any) => ({
          id: field.id || Date.now(),
          label: field.details?.label || "",
          name: field.details?.label?.toLowerCase().replace(/\s+/g, "_") || "",
          type: field.type || "text",
          placeholder: field.details?.placeholder || "",
          description: field.details?.description || "",
          required: field.required || false,
          options: field.details?.options || []
        }));

        setFields(transformedFields);
      }
    } catch (error) {
      console.error("Error fetching form fields:", error);
      setError("Failed to load form fields. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 2 && id) {
      fetchFormFields(id);
    }
  }, [step, id]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        // Get user data from localStorage
        const userData = localStorage.getItem("user");
        if (!userData) {
          setError("Please login to edit events");
          navigate("/login");
          return;
        }

        const user = JSON.parse(userData);
        console.log("Fetching event with ID:", id); // Debug log

        const response = await axios.get(
          `http://localhost:3000/api/events/event/${id}`
        );

        console.log("Event data received:", response.data); // Debug log

        if (!response.data) {
          setError("Event not found");
          return;
        }

        const eventData = response.data.event;

        // Format dates to YYYY-MM-DD for input fields
        const formattedData = {
          ...eventData,
          start_date: eventData.start_date
            ? new Date(eventData.start_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          end_date: eventData.end_date
            ? new Date(eventData.end_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          created_by: user.id // Ensure we set the creator ID
        };

        console.log("Formatted event data:", formattedData); // Debug log
        setFormData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event data:", error);
        setError("Failed to load event data");
        setLoading(false);
      }
    };

    if (id) {
      fetchEventData();
    }
  }, [id, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const userData = localStorage.getItem("user");
      if (!userData) {
        setError("Please login to update events");
        navigate("/login");
        return;
      }

      const user = JSON.parse(userData);

      // Validate required fields
      if (
        !formData.title ||
        !formData.description ||
        !formData.start_date ||
        !formData.end_date
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const response = await axios.put(
        `http://localhost:3000/api/events/${id}`,
        {
          ...formData,
          created_by: user.id // Ensure we maintain the creator ID
        }
      );

      console.log("Event updated successfully:", response.data);
      setSuccess("Event updated successfully!");

      // Clear success message and navigate after 2 seconds
      setTimeout(() => {
        setSuccess(null);
        navigate("/my-events");
      }, 2000);
    } catch (error) {
      console.error("Error updating event:", error);
      setError("Failed to update event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    const newFieldIndex = fields.length + 1;
    setFields([
      ...fields,
      {
        id: Date.now(),
        label: `Field ${newFieldIndex}`,
        name: `field_${newFieldIndex}`,
        type: "text",
        placeholder: "",
        description: "",
        required: false
      }
    ]);
  };

  const handleSaveForm = async () => {
    debugger;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const userData = localStorage.getItem("user");
      if (!userData) {
        setError("Please login to save form");
        return;
      }

      // Transform fields into the required format
      const formFields = fields.map((field, index) => ({
        event_id: id,
        type: field.type,
        details: {
          label: field.label,
          placeholder: field.placeholder,
          description: field.description,
          options: field.type === "select" ? field.options : undefined
        },
        order: index + 1,
        required: field.required || false
      }));

      const response = await axios.put(
        `http://localhost:3000/api/form/replace/${id}`,
        formFields
      );

      console.log("Form fields saved successfully:", response.data);
      setSuccess("Form fields saved successfully!");

      // Clear success message after 2 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    } catch (error) {
      console.error("Error saving form fields:", error);
      setError("Failed to save form fields. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Sidebar>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading event data...</p>
            </div>
          </div>
        </div>
      </Sidebar>
    );
  }

  if (error) {
    return (
      <Sidebar>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => navigate("/events")}
                className="mt-4 text-primary hover:underline"
              >
                Back to Events
              </button>
            </div>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="h-16 border-b px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-7 w-7"
            data-sidebar="trigger"
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
              className="lucide lucide-panel-left"
            >
              <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            </svg>
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            {/* Success Alert */}
            {success && (
              <div
                className="p-4 bg-green-100 border border-green-400 text-green-700 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{success}</span>
                <button
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setSuccess(null)}
                >
                  <svg
                    className="fill-current h-6 w-6 text-green-500"
                    role="button"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                  </svg>
                </button>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div
                className="p-4 bg-red-100 border border-red-400 text-red-700 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
                <button
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setError(null)}
                >
                  <svg
                    className="fill-current h-6 w-6 text-red-500"
                    role="button"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <title>Close</title>
                    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                  </svg>
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading form fields...
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Edit Event
              </h3>
              <p className="text-sm text-muted-foreground">
                Update the details of your event
              </p>
            </div>
            <div className="p-6 pt-0">
              <div dir="ltr" data-orientation="horizontal" className="mb-6">
                <div
                  role="tablist"
                  aria-orientation="horizontal"
                  className="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full grid-cols-3"
                  tabIndex={0}
                  data-orientation="horizontal"
                  style={{ outline: "none" }}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={step === 1}
                    aria-controls="radix-:rds:-content-basic"
                    data-state={step === 1 ? "active" : "inactive"}
                    id="radix-:rds:-trigger-basic"
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      step === 1
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground"
                    }`}
                    tabIndex={-1}
                    data-orientation="horizontal"
                    data-radix-collection-item=""
                    onClick={() => setStep(1)}
                  >
                    Basic Info
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={step === 2}
                    aria-controls="radix-:rds:-content-judges"
                    data-state={step === 2 ? "active" : "inactive"}
                    id="radix-:rds:-trigger-judges"
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      step === 2
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground"
                    }`}
                    tabIndex={-1}
                    data-orientation="horizontal"
                    data-radix-collection-item=""
                    onClick={() => setStep(2)}
                  >
                    Registration Form
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={step === 3}
                    aria-controls="radix-:rds:-content-judges"
                    data-state={step === 3 ? "active" : "inactive"}
                    id="radix-:rds:-trigger-judges"
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                      step === 3
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground"
                    }`}
                    tabIndex={-1}
                    data-orientation="horizontal"
                    data-radix-collection-item=""
                    onClick={() => setStep(3)}
                  >
                    Judges
                  </button>
                </div>
                {step === 1 && (
                  <div
                    data-state="active"
                    data-orientation="horizontal"
                    role="tabpanel"
                    aria-labelledby="radix-:rds:-trigger-basic"
                    id="radix-:rds:-content-basic"
                    tabIndex={0}
                    className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    style={{ animationDuration: "0s" }}
                  >
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none"
                          htmlFor="title"
                        >
                          Event Title
                        </label>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          placeholder="Enter event title"
                          name="title"
                          id="title"
                          value={formData.title}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none"
                          htmlFor="description"
                        >
                          Event Description
                        </label>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Describe your event..."
                          name="description"
                          id="description"
                          value={formData.description}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 flex flex-col">
                          <label
                            className="text-sm font-medium leading-none"
                            htmlFor="start_date"
                          >
                            Start Date
                          </label>
                          <input
                            type="date"
                            name="start_date"
                            id="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                          />
                        </div>
                        <div className="space-y-2 flex flex-col">
                          <label
                            className="text-sm font-medium leading-none"
                            htmlFor="end_date"
                          >
                            End Date
                          </label>
                          <input
                            type="date"
                            name="end_date"
                            id="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none"
                          htmlFor="type"
                        >
                          Event Type
                        </label>
                        <select
                          name="type"
                          id="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                        >
                          <option value="networking">Networking</option>
                          <option value="pitch">Pitch</option>
                          <option value="workshop">Workshop</option>
                          <option value="hackathon">Hackathon</option>
                          <option value="meetup">Meetup</option>
                          <option value="conference">Conference</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none"
                          htmlFor="location_link"
                        >
                          Location
                        </label>
                        <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                          placeholder="Event venue or address"
                          name="location_link"
                          id="location_link"
                          value={formData.location_link}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none"
                          htmlFor="capacity"
                        >
                          Capacity (optional)
                        </label>
                        <input
                          type="number"
                          name="capacity"
                          id="capacity"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                          placeholder="Maximum number of attendees"
                        />
                      </div>
                      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <input
                          type="checkbox"
                          name="is_virtual"
                          id="is_virtual"
                          checked={formData.is_virtual}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <div className="space-y-1 leading-none">
                          <label
                            className="text-sm font-medium leading-none"
                            htmlFor="is_virtual"
                          >
                            Virtual Event
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Check this if your event will be held online
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <input
                          type="checkbox"
                          name="require_pitch_deck"
                          id="require_pitch_deck"
                          checked={formData.require_pitch_deck}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <div className="space-y-1 leading-none">
                          <label
                            className="text-sm font-medium leading-none"
                            htmlFor="require_pitch_deck"
                          >
                            Require Pitch Deck
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Check this if participants should submit a pitch
                            deck when registering
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => navigate("/events")}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {step === 2 && (
                  <div className="py-3">
                    <div
                      dir="ltr"
                      data-orientation="horizontal"
                      className="mb-6"
                    >
                      <div
                        data-state="active"
                        data-orientation="horizontal"
                        role="tabpanel"
                        aria-labelledby="radix-:r19:-trigger-registration"
                        id="radix-:r19:-content-registration"
                        tabIndex={0}
                        className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        style={{}}
                      >
                        <div
                          dir="ltr"
                          data-orientation="horizontal"
                          className="w-full"
                        >
                          <div
                            role="tablist"
                            aria-orientation="horizontal"
                            className="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-2 mb-4"
                            tabIndex={0}
                            data-orientation="horizontal"
                            style={{ outline: "none" }}
                          >
                            <button
                              type="button"
                              role="tab"
                              aria-selected="true"
                              aria-controls="radix-:r1b:-content-edit"
                              data-state="active"
                              id="radix-:r1b:-trigger-edit"
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                              tabIndex={-1}
                              data-orientation="horizontal"
                              data-radix-collection-item=""
                            >
                              Edit Form
                            </button>
                            <button
                              type="button"
                              role="tab"
                              aria-selected="false"
                              aria-controls="radix-:r1b:-content-preview"
                              data-state="inactive"
                              id="radix-:r1b:-trigger-preview"
                              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                              tabIndex={-1}
                              data-orientation="horizontal"
                              data-radix-collection-item=""
                            >
                              Preview Form
                            </button>
                          </div>
                          <div
                            data-state="active"
                            data-orientation="horizontal"
                            role="tabpanel"
                            aria-labelledby="radix-:r1b:-trigger-edit"
                            id="radix-:r1b:-content-edit"
                            tabIndex={0}
                            className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
                            style={{}}
                          >
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                              <div className="p-6 pt-6">
                                <div className="space-y-4">
                                  <div
                                    role="alert"
                                    className="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground bg-background text-foreground"
                                  >
                                    <div className="text-sm [&_p]:leading-relaxed">
                                      Build your registration form by adding
                                      fields below. Drag and drop to reorder
                                      fields.
                                    </div>
                                  </div>
                                  <form className="space-y-4">
                                    <div className="space-y-4">
                                      <div
                                        data-rbd-droppable-id="fieldsDroppable"
                                        data-rbd-droppable-context-id="0"
                                        className="space-y-4"
                                      >
                                        {fields.length === 0 ? (
                                          <div className="text-center p-8 border border-dashed rounded-md text-muted-foreground">
                                            No fields added yet. Click "Add
                                            Field" below to create your
                                            registration form.
                                          </div>
                                        ) : (
                                          fields.map((field, idx) => (
                                            <div
                                              key={field.id}
                                              className="rounded-lg border p-6 mb-4 bg-background"
                                            >
                                              <div className="flex justify-between items-center mb-2">
                                                <div>
                                                  <div className="font-semibold">
                                                    Field {idx + 1}
                                                  </div>
                                                  <div className="text-sm text-muted-foreground capitalize">
                                                    {field.type}
                                                  </div>
                                                </div>
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    setFields(
                                                      fields.filter(
                                                        (f) => f.id !== field.id
                                                      )
                                                    )
                                                  }
                                                  className="text-red-500 hover:text-red-700"
                                                  title="Delete Field"
                                                >
                                                  <svg
                                                    width="20"
                                                    height="20"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                  >
                                                    <path d="M3 6h14M8 6v10m4-10v10M5 6V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
                                                  </svg>
                                                </button>
                                              </div>
                                              <div className="font-semibold mb-2">
                                                Field Settings
                                              </div>
                                              <div className="mb-2">
                                                <label className="block text-sm font-medium mb-1">
                                                  Field Label
                                                </label>
                                                <input
                                                  className="w-full rounded-md border px-3 py-2 mb-2"
                                                  value={field.label}
                                                  onChange={(e) => {
                                                    const newFields = [
                                                      ...fields
                                                    ];
                                                    newFields[idx].label =
                                                      e.target.value;
                                                    setFields(newFields);
                                                  }}
                                                />
                                              </div>
                                              <div className="mb-2">
                                                <label className="block text-sm font-medium mb-1">
                                                  Field Name
                                                </label>
                                                <input
                                                  className="w-full rounded-md border px-3 py-2 mb-1"
                                                  value={field.name}
                                                  onChange={(e) => {
                                                    const newFields = [
                                                      ...fields
                                                    ];
                                                    newFields[idx].name =
                                                      e.target.value;
                                                    setFields(newFields);
                                                  }}
                                                />
                                                <div className="text-xs text-muted-foreground mb-2">
                                                  Auto-generated from label (can
                                                  be edited if needed)
                                                </div>
                                              </div>
                                              <div className="flex gap-2 mb-2">
                                                <div className="flex-1">
                                                  <label className="block text-sm font-medium mb-1">
                                                    Field Type
                                                  </label>
                                                  <select
                                                    className="w-full rounded-md border px-3 py-2"
                                                    value={field.type}
                                                    onChange={(e) => {
                                                      const newFields = [
                                                        ...fields
                                                      ];
                                                      newFields[idx].type =
                                                        e.target.value;
                                                      setFields(newFields);
                                                    }}
                                                  >
                                                    <option value="text">
                                                      Text
                                                    </option>
                                                    <option value="email">
                                                      Email
                                                    </option>
                                                    <option value="number">
                                                      Number
                                                    </option>
                                                    <option value="textarea">
                                                      Textarea
                                                    </option>
                                                    <option value="select">
                                                      Select
                                                    </option>
                                                    <option value="checkbox">
                                                      Checkbox
                                                    </option>
                                                    {/* Add more types as needed */}
                                                  </select>
                                                </div>
                                                <div className="flex-1">
                                                  <label className="block text-sm font-medium mb-1">
                                                    Placeholder
                                                  </label>
                                                  <input
                                                    className="w-full rounded-md border px-3 py-2"
                                                    value={field.placeholder}
                                                    onChange={(e) => {
                                                      const newFields = [
                                                        ...fields
                                                      ];
                                                      newFields[
                                                        idx
                                                      ].placeholder =
                                                        e.target.value;
                                                      setFields(newFields);
                                                    }}
                                                  />
                                                </div>
                                              </div>
                                              <div className="mb-2">
                                                <label className="block text-sm font-medium mb-1">
                                                  Description
                                                </label>
                                                <textarea
                                                  className="w-full rounded-md border px-3 py-2"
                                                  value={field.description}
                                                  onChange={(e) => {
                                                    const newFields = [
                                                      ...fields
                                                    ];
                                                    newFields[idx].description =
                                                      e.target.value;
                                                    setFields(newFields);
                                                  }}
                                                />
                                                <div className="text-xs text-muted-foreground">
                                                  Helpful explanation for the
                                                  user
                                                </div>
                                              </div>
                                              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <button
                                                  type="button"
                                                  role="checkbox"
                                                  aria-checked="false"
                                                  data-state="unchecked"
                                                  value="on"
                                                  className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                                                  id=":rbt:-form-item"
                                                  aria-describedby=":rbt:-form-item-description"
                                                  aria-invalid="false"
                                                ></button>
                                                <input
                                                  type="checkbox"
                                                  aria-hidden="true"
                                                  tabIndex={-1}
                                                  value="on"
                                                  style={{
                                                    transform:
                                                      "translateX(-100%)",
                                                    position: "absolute",
                                                    pointerEvents: "none",
                                                    opacity: 0,
                                                    margin: 0,
                                                    width: "16px",
                                                    height: "16px"
                                                  }}
                                                />
                                                <div className="space-y-1 leading-none">
                                                  <label
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    htmlFor=":rbt:-form-item"
                                                  >
                                                    Required Field
                                                  </label>
                                                  <p
                                                    id=":rbt:-form-item-description"
                                                    className="text-sm text-muted-foreground"
                                                  >
                                                    Make this field mandatory
                                                    for submission
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="items-center p-6 flex justify-between py-3">
                                                <div className="flex gap-2">
                                                  <button
                                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0"
                                                    type="button"
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
                                                      className="lucide lucide-chevron-up h-4 w-4"
                                                    >
                                                      <path d="m18 15-6-6-6 6"></path>
                                                    </svg>
                                                  </button>
                                                  <button
                                                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0"
                                                    type="button"
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
                                                      className="lucide lucide-chevron-down h-4 w-4"
                                                    >
                                                      <path d="m6 9 6 6 6-6"></path>
                                                    </svg>
                                                  </button>
                                                </div>
                                                <button
                                                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-3 h-8"
                                                  type="button"
                                                  onClick={() =>
                                                    setFields(
                                                      fields.filter(
                                                        (f) => f.id !== field.id
                                                      )
                                                    )
                                                  }
                                                >
                                                  Remove
                                                </button>
                                              </div>
                                            </div>
                                          ))
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex justify-between">
                                      <button
                                        className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex items-center"
                                        type="button"
                                        onClick={handleAddField}
                                        disabled={loading}
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
                                          className="lucide lucide-plus mr-1 h-4 w-4"
                                        >
                                          <path d="M5 12h14"></path>
                                          <path d="M12 5v14"></path>
                                        </svg>{" "}
                                        Add Field
                                      </button>
                                      <button
                                        className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex items-center"
                                        type="button"
                                        onClick={handleSaveForm}
                                        disabled={loading}
                                      >
                                        {loading ? (
                                          <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Saving...
                                          </>
                                        ) : (
                                          <>
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
                                              className="lucide lucide-save mr-1 h-4 w-4"
                                            >
                                              <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                                              <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
                                              <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
                                            </svg>
                                            Save Form
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            data-state="inactive"
                            data-orientation="horizontal"
                            role="tabpanel"
                            aria-labelledby="radix-:r1b:-trigger-preview"
                            hidden={true}
                            id="radix-:r1b:-content-preview"
                            tabIndex={0}
                            className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        type="button"
                      >
                        Skip Form Builder
                      </button>
                      <button
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        type="button"
                      >
                        Finish
                      </button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div className="py-3">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6">
                      <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight">
                          Event Judges &amp; Mentors
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Add and manage judges and mentors for this event
                        </p>
                      </div>
                      <div className="p-6 pt-0">
                        <div className="mb-4 flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Add judges or mentors to evaluate and provide
                              feedback for this event
                            </p>
                          </div>
                          <button
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded="false"
                            aria-controls="radix-:rql:"
                            data-state="closed"
                          >
                            Add Judge/Mentor
                          </button>
                        </div>
                        <div className="py-6 text-center text-muted-foreground">
                          No judges or mentors added yet
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                        type="button"
                      >
                        Back to Events
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sidebar>
  );
};

export default EditEvent;
