import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface EventFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location_link: string;
  type: string;
  created_by: string;
}

const CreateEvent = () => {
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState<any[]>([]);
  const [eventId, setEventId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    start_date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
    end_date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
    location_link: "",
    type: "networking", // default value
    created_by: "" // Will be set from localStorage
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setFormData((prev) => ({
        ...prev,
        created_by: user.id
      }));
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Format dates for Supabase (YYYY-MM-DD)
      const formattedData = {
        ...formData,
        start_date: formData.start_date,
        end_date: formData.end_date
      };

      const response = await axios.post(
        "http://localhost:3000/api/events",
        formattedData
      );
      console.log("Event created successfully:", response.data);

      // Make sure we're setting the event ID correctly
      if (response.data.event && response.data.event.id) {
        setEventId(response.data.event.id);
        setSuccess("Event created successfully!");
        setStep(2);
      } else {
        setError("Failed to get event ID from response");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setError("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddField = () => {
    const newFieldIndex = fields.length + 1;
    setFields([
      ...fields,
      {
        id: Date.now(), // unique id
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
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!eventId) {
        setError("Event ID is missing. Please create the event first.");
        return;
      }

      const userData = localStorage.getItem("user");
      if (!userData) {
        setError("Please login to save form");
        return;
      }

      // Transform fields into the required format
      const formFields = fields.map((field, index) => ({
        event_id: eventId,
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

      console.log("Saving form fields:", formFields); // Debug log

      const response = await axios.post(
        "http://localhost:3000/api/form/add/many",
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

  return (
    <Sidebar>
      <main className="flex-1 overflow-auto">
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-panel-left"
              >
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="M9 3v18"></path>
              </svg>
              <span className="sr-only">Toggle Sidebar</span>
            </button>
            <h1 className="text-xl font-semibold">Create Event</h1>
          </div>
        </div>
        {step === 1 ? (
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              {error && (
                <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              {success && (
                <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Create New Event
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fill out the form below to create a new event
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor=":rc1:-form-item"
                      >
                        Event Title
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                        placeholder="Enter event title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                      <p
                        id=":rc1:-form-item-description"
                        className="text-sm text-muted-foreground"
                      >
                        A clear, concise title for your event
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor=":rc1:-form-item"
                      >
                        Event Banner
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                        placeholder="Enter event title"
                        name="title"
                        value=""
                        type="file"
                      />
                      <p
                        id=":rc1:-form-item-description"
                        className="text-sm text-muted-foreground"
                      >
                        A clear, concise title for your event
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor=":rc2:-form-item"
                      >
                        Event Description
                      </label>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe your event..."
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                      ></textarea>
                      <p
                        id=":rc2:-form-item-description"
                        className="text-sm text-muted-foreground"
                      >
                        Provide details about your event
                      </p>
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

                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none"
                          htmlFor=":rc5:-form-item"
                        >
                          Start Time
                        </label>
                        <div
                          className="flex items-center"
                          id=":r1g6:-form-item"
                          aria-describedby=":r1g6:-form-item-description"
                          aria-invalid="false"
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
                            className="lucide lucide-clock mr-2 h-4 w-4 text-muted-foreground"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <input
                            type="time"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                            name="start_time"
                            value="09:00"
                          />
                        </div>
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

                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none"
                          htmlFor=":rc8:-form-item"
                        >
                          End Time
                        </label>
                        <div className="flex items-center">
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
                            className="lucide lucide-clock mr-2 h-4 w-4 text-muted-foreground"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <input
                            type="time"
                            name="end_time"
                            value="10:00"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none"
                        htmlFor=":rc9:-form-item"
                      >
                        Event Type
                      </label>
                      <button
                        type="button"
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                      >
                        Networking <svg className="lucide ..."></svg>
                      </button>
                      <select
                        className="w-full rounded-md border px-3 py-2"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
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
                        htmlFor=":rcb:-form-item"
                      >
                        Capacity (optional)
                      </label>
                      <input
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                        placeholder="Maximum number of attendees"
                        name="capacity"
                        id=":rcb:-form-item"
                        value="50"
                      />
                      <p className="text-sm text-muted-foreground">
                        Leave empty for unlimited capacity
                      </p>
                    </div>

                    <div className="flex flex-row items-start space-x-3 border p-4 rounded-md">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked="false"
                        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      ></button>
                      <input
                        type="checkbox"
                        aria-hidden="true"
                        className="sr-only"
                      />
                      <div className="space-y-1 leading-none">
                        <label
                          className="text-sm font-medium leading-none"
                          htmlFor=":rcc:-form-item"
                        >
                          Virtual Event
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Check this if your event will be held online
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row items-start space-x-3 border p-4 rounded-md">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked="false"
                        className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      ></button>
                      <input
                        type="checkbox"
                        aria-hidden="true"
                        className="sr-only"
                      />
                      <div className="space-y-1 leading-none">
                        <label
                          className="text-sm font-medium leading-none"
                          htmlFor=":rcd:-form-item"
                        >
                          Require Pitch Deck
                        </label>
                        <p className="text-sm text-muted-foreground">
                          Check this if participants should submit a pitch deck
                          when registering
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none"
                        htmlFor=":rce:-form-item"
                      >
                        Location
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                        placeholder="Event venue or address"
                        name="location_link"
                        value={formData.location_link}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none"
                        htmlFor=":rce:-form-item"
                      >
                        Website
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                        placeholder="https://example.com"
                        name="website"
                        id=":rce:-form-item"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none"
                        htmlFor=":rce:-form-item"
                      >
                        Judges' Emails (Optional)
                      </label>
                      <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                        placeholder="Enter email addresses separated by commas"
                        name="judges_emails"
                        value=""
                      />
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        onClick={(e) => handleSubmit(e)}
                      >
                        Continue
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              {error && (
                <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              {success && (
                <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Registration Form Builder
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Design the registration form for your event
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <div dir="ltr" data-orientation="horizontal" className="mb-6">
                    <div
                      role="tablist"
                      aria-orientation="horizontal"
                      className="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid w-full grid-cols-1"
                      tabIndex={0}
                      data-orientation="horizontal"
                      style={{ outline: "none" }}
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected="true"
                        aria-controls="radix-:r19:-content-registration"
                        data-state="active"
                        id="radix-:r19:-trigger-registration"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                        tabIndex={-1}
                        data-orientation="horizontal"
                        data-radix-collection-item=""
                      >
                        Registration Form
                      </button>
                    </div>
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
                                          No fields added yet. Click "Add Field"
                                          below to create your registration
                                          form.
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
                                                  const newFields = [...fields];
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
                                                  const newFields = [...fields];
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
                                                    newFields[idx].placeholder =
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
                                                  const newFields = [...fields];
                                                  newFields[idx].description =
                                                    e.target.value;
                                                  setFields(newFields);
                                                }}
                                              />
                                              <div className="text-xs text-muted-foreground">
                                                Helpful explanation for the user
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
                                                  Make this field mandatory for
                                                  submission
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
                                      </svg>
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
                      onClick={() => {
                        navigate("/my-events");
                      }}
                    >
                      Finish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </Sidebar>
  );
};

export default CreateEvent;
