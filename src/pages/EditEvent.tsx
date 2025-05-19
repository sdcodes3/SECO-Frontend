import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import API_CONSTANTS from "../utils/apiConstants";
import Input from "@/components/UI/Input";

interface EventFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location_link: string;
  type: string;
  created_by: string;
  capacity: number | string;
  website: string;
  judges_emails: string;
  is_virtual?: boolean;
  stages?: Stage[];
}

interface Stage {
  id: string;
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
}

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [questionStep, setQuestionStep] = useState(1);
  const [newQuestionType, setNewQuestionType] = useState<string | null>(null);

  const [stages, setStages] = useState<Stage[]>([
    {
      id: "1",
      name: "",
      description: "",
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: ""
    }
  ]);
  const [newQuestion, setNewQuestion] = useState<any>({
    label: "",
    type: "",
    required: false,
    options: [""]
  });

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [errorFields, setErrorFields] = useState<EventFormData>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location_link: "",
    type: "",
    capacity: "",
    website: "",
    judges_emails: "",
    created_by: "",
    is_virtual: false,
    stages: []
  });

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
    website: "",
    judges_emails: "",
    stages: []
  });

  const fetchFormFields = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(
        API_CONSTANTS.GET_FORM_BY_EVENT(eventId),
        {
          params: {
            event_id: eventId
          }
        }
      );

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
        if (!id) {
          setError("Event not found");
          return;
        }
        const response = await axiosInstance.get(
          API_CONSTANTS.GET_EVENT_BY_ID(id)
        );

        if (!response.data) {
          setError("Event not found");
          return;
        }

        const eventData = response.data.event;

        // Parse stages if they exist
        let parsedStages: Stage[] = [];
        if (eventData.stages) {
          try {
            parsedStages = JSON.parse(eventData.stages).map((stage: any) => ({
              id: stage.order.toString(),
              name: stage.name,
              description: stage.description,
              start_date: stage.start_date,
              start_time: stage.start_time,
              end_date: stage.end_date,
              end_time: stage.end_time
            }));
          } catch (error) {
            console.error("Error parsing stages:", error);
          }
        }

        // Format dates to YYYY-MM-DD for input fields
        const formattedData = {
          ...eventData,
          start_date: eventData.start_date
            ? new Date(eventData.start_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          end_date: eventData.end_date
            ? new Date(eventData.end_date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          created_by: eventData.created_by // Ensure we set the creator ID
        };

        setFormData(formattedData);
        setStages(
          parsedStages.length > 0
            ? parsedStages
            : [
                {
                  id: "1",
                  name: "",
                  description: "",
                  start_date: "",
                  start_time: "",
                  end_date: "",
                  end_time: ""
                }
              ]
        );
        setLoading(false);
      } catch (error) {
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
  const validateForm = (): EventFormData => {
    return {
      created_by: "",
      website: "",
      judges_emails: "",
      title: formData.title.trim() ? "" : "Title is required",
      description: formData.description.trim() ? "" : "Description is required",
      start_date: formData.start_date ? "" : "Start date is required",
      end_date: formData.end_date ? "" : "End date is required",
      location_link: formData.location_link.trim()
        ? ""
        : "Location is required",
      type: formData.type ? "" : "Type is required",
      capacity: ""
    };
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorFields = validateForm();
    const isError = Object.values(errorFields).some((value) => value !== "");
    console.log(errorFields);
    console.log(isError);
    if (isError) {
      setErrorFields(errorFields);
      return;
    } else {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        const userData = localStorage.getItem("user");
        if (!userData) {
          setError("Please login to update events");
          navigate("/auth");
          return;
        }

        // const user = JSON.parse(userData);

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
        if (!id) {
          setError("Event not found");
          return;
        }
        const formattedData = {
          ...formData,
          start_date: formData.start_date,
          end_date: formData.end_date,
          stages: JSON.stringify(
            stages.map((stage) => ({
              name: stage.name,
              description: stage.description,
              start_date: stage.start_date,
              start_time: stage.start_time,
              end_date: stage.end_date,
              end_time: stage.end_time,
              order: stages.indexOf(stage) + 1
            }))
          )
        };
        const formDataToSend = new FormData();

        // Append all event data as JSON string
        // formDataToSend.append(...formattedData);
        formDataToSend.append("title", formattedData.title);
        formDataToSend.append("description", formattedData.description);
        formDataToSend.append("location_link", formattedData.location_link);
        formDataToSend.append("start_date", formattedData.start_date);
        formDataToSend.append("end_date", formattedData.end_date);
        formDataToSend.append("created_by", formattedData.created_by);
        formDataToSend.append("type", formattedData.type);
        formDataToSend.append("stages", formattedData.stages);
        // Append banner file if exists
        const bannerInput = document.getElementById(
          "event-banner-input"
        ) as HTMLInputElement;
        if (bannerInput?.files?.[0]) {
          formDataToSend.append("banner", bannerInput.files[0]);
        }

        const response = await axiosInstance.put(
          API_CONSTANTS.EDIT_EVENT(id),
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        if (response.status === 200) {
          setSuccess("Event updated successfully!");
        }
        // Clear success message and navigate after 2 seconds
        setTimeout(() => {
          setSuccess(null);
          navigate("/my-events");
        }, 2000);
      } catch (error) {
        setError("Failed to update event. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddField = () => {
    setShowQuestionModal(true);
    setQuestionStep(1);
    setNewQuestionType(null);
    setNewQuestion({
      label: "",
      type: "",
      required: false,
      options: [""]
    });
  };
  const handleRemoveBanner = () => {
    setBannerPreview(null);
    (document.getElementById("event-banner-input") as HTMLInputElement).value =
      "";
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleStageChange = (
    index: number,
    field: keyof Stage,
    value: string
  ) => {
    const newStages = [...stages];
    newStages[index] = {
      ...newStages[index],
      [field]: value
    };
    setStages(newStages);
  };

  const addStage = () => {
    setStages([
      ...stages,
      {
        id: Date.now().toString(),
        name: "",
        description: "",
        start_date: "",
        start_time: "",
        end_date: "",
        end_time: ""
      }
    ]);
  };

  const removeStage = (index: number) => {
    if (stages.length > 1) {
      const newStages = stages.filter((_, i) => i !== index);
      setStages(newStages);
    }
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

      if (!id) {
        setError("Event not found");
        return;
      }
      const response = await axiosInstance.put(
        API_CONSTANTS.REPLACE_FORM_BY_EVENT(id),

        formFields
      );

      if (response.status === 200) {
        setSuccess("Form fields saved successfully!");
      }

      // Clear success message after 2 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    } catch (error) {
      setError("Failed to save form fields. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading event data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <>
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
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Input
                          value={formData.title}
                          handleChange={handleInputChange}
                          label="Event Title"
                          name="title"
                          type="text"
                          placeholder="Enter event title"
                          description="A clear, concise title for your event"
                          error={errorFields.title}
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor=":rc1:-form-item"
                        >
                          Event Banner
                        </label>
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative bg-gray-100 min-h-[180px] cursor-pointer group transition"
                          onClick={() =>
                            !bannerPreview &&
                            document
                              .getElementById("event-banner-input")
                              ?.click()
                          }
                        >
                          {bannerPreview ? (
                            <div className="w-full h-full flex items-center justify-center relative">
                              <img
                                src={bannerPreview}
                                alt="Event Banner Preview"
                                className="object-contain max-h-48 w-full rounded-lg"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                                <button
                                  type="button"
                                  className="bg-white text-black px-3 py-1 rounded shadow mr-2 flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    document
                                      .getElementById("event-banner-input")
                                      ?.click();
                                  }}
                                >
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                                    <polyline points="7 9 12 4 17 9" />
                                    <line x1="12" y1="4" x2="12" y2="16" />
                                  </svg>
                                  Change Image
                                </button>
                                <button
                                  type="button"
                                  className="bg-red-600 text-white px-3 py-1 rounded shadow flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveBanner();
                                  }}
                                >
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                  >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-12 w-full">
                              <div className="bg-gray-200 rounded-full p-6 mb-4">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="40"
                                  height="40"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                  className="text-gray-400"
                                >
                                  <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="2"
                                  />
                                  <path d="M8.5 14.5 11 17l2.5-3.5L19 19H5l3.5-4.5z" />
                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                </svg>
                              </div>
                              <div className="font-semibold text-lg mb-1">
                                Upload Event Banner
                              </div>
                              <div className="text-sm text-gray-500 text-center">
                                Recommended size: 1200 x 400px (3:1 ratio). PNG,
                                JPG up to 5MB.
                              </div>
                            </div>
                          )}
                          <input
                            id="event-banner-input"
                            type="file"
                            accept="image/png, image/jpeg"
                            className="hidden"
                            onChange={handleBannerChange}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        {/* <label
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
                      </p> */}
                        <Input
                          value={formData.description}
                          handleChange={handleInputChange}
                          label="Event Description"
                          name="description"
                          type="textarea"
                          placeholder="Describe your event..."
                          description="Provide details about your event"
                          error={errorFields.description}
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">
                            Event Stages
                          </h3>
                          <button
                            type="button"
                            onClick={addStage}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
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
                            Add Stage
                          </button>
                        </div>

                        <div className="space-y-4">
                          {stages.map((stage, index) => (
                            <div
                              key={stage.id}
                              className="rounded-lg border bg-card p-6"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    Stage {index + 1}
                                  </span>
                                </div>
                                {stages.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeStage(index)}
                                    className="text-red-500 hover:text-red-700"
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
                                      className="h-5 w-5"
                                    >
                                      <path d="M3 6h18" />
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    </svg>
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label
                                    className="text-sm font-medium leading-none"
                                    htmlFor={`stage_name_${index}`}
                                  >
                                    Stage Name
                                  </label>
                                  <input
                                    type="text"
                                    id={`stage_name_${index}`}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={stage.name}
                                    onChange={(e) =>
                                      handleStageChange(
                                        index,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label
                                    className="text-sm font-medium leading-none"
                                    htmlFor={`stage_description_${index}`}
                                  >
                                    Stage Description
                                  </label>
                                  <textarea
                                    id={`stage_description_${index}`}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={stage.description}
                                    onChange={(e) =>
                                      handleStageChange(
                                        index,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label
                                    className="text-sm font-medium leading-none"
                                    htmlFor={`stage_start_date_${index}`}
                                  >
                                    Start Date
                                  </label>
                                  <input
                                    type="date"
                                    id={`stage_start_date_${index}`}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={stage.start_date}
                                    onChange={(e) =>
                                      handleStageChange(
                                        index,
                                        "start_date",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label
                                    className="text-sm font-medium leading-none"
                                    htmlFor={`stage_start_time_${index}`}
                                  >
                                    Start Time
                                  </label>
                                  <input
                                    type="time"
                                    id={`stage_start_time_${index}`}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={stage.start_time}
                                    onChange={(e) =>
                                      handleStageChange(
                                        index,
                                        "start_time",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label
                                    className="text-sm font-medium leading-none"
                                    htmlFor={`stage_end_date_${index}`}
                                  >
                                    End Date
                                  </label>
                                  <input
                                    type="date"
                                    id={`stage_end_date_${index}`}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={stage.end_date}
                                    onChange={(e) =>
                                      handleStageChange(
                                        index,
                                        "end_date",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label
                                    className="text-sm font-medium leading-none"
                                    htmlFor={`stage_end_time_${index}`}
                                  >
                                    End Time
                                  </label>
                                  <input
                                    type="time"
                                    id={`stage_end_time_${index}`}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={stage.end_time}
                                    onChange={(e) =>
                                      handleStageChange(
                                        index,
                                        "end_time",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none"
                          htmlFor=":rc9:-form-item"
                        >
                          Event Type
                        </label>
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
                        <Input
                          value={formData.capacity?.toString()}
                          handleChange={handleInputChange}
                          label="Capacity"
                          name="capacity"
                          type="number"
                          placeholder="Maximum number of attendees"
                          description="Leave empty for unlimited capacity"
                          error={errorFields.capacity.toString()}
                        />
                      </div>

                      <div className="flex flex-row items-start space-x-3 border p-4 rounded-md">
                        <input
                          type="checkbox"
                          name="is_virtual"
                          id="is_virtual"
                          checked={formData.is_virtual}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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

                      <div className="space-y-2">
                        <Input
                          value={formData.location_link}
                          handleChange={handleInputChange}
                          label="Location"
                          name="location_link"
                          type="text"
                          placeholder="Event venue or address"
                          error={errorFields.location_link}
                        />
                        {formData.is_virtual && (
                          <p className="text-sm text-muted-foreground">
                            Please provide a valid Zoom meeting link
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Input
                          value={formData.website}
                          handleChange={handleInputChange}
                          label="Website"
                          name="website"
                          type="text"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          value={formData.judges_emails}
                          handleChange={handleInputChange}
                          label="Judges' Emails"
                          name="judges_emails"
                          type="text"
                          placeholder="Enter email addresses separated by commas"
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
                          onClick={handleSubmit}
                        >
                          Save changes
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
                                              className="rounded-lg border p-6 mb-4 bg-white shadow flex flex-col gap-2"
                                            >
                                              <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                  <span className="cursor-move text-gray-400 mr-2">
                                                    ⋮⋮
                                                  </span>
                                                  <div className="flex flex-col">
                                                    <span className="font-semibold text-lg">
                                                      {field.label ||
                                                        `Question ${idx + 1}`}
                                                    </span>
                                                    <span className="text-xs text-gray-500 capitalize">
                                                      {field.type === "text" &&
                                                        "Short Text"}
                                                      {field.type ===
                                                        "textarea" &&
                                                        "Long Text"}
                                                      {field.type === "radio" &&
                                                        "Multiple Choice"}
                                                      {field.type ===
                                                        "checkbox" &&
                                                        "Checkboxes"}
                                                      {field.type === "date" &&
                                                        "Date"}
                                                      {field.type === "time" &&
                                                        "Time"}
                                                      {field.type === "file" &&
                                                        "File upload"}
                                                      {field.type ===
                                                        "rating" && "Rating"}
                                                    </span>
                                                  </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                  <label className="flex items-center gap-1 cursor-pointer">
                                                    <input
                                                      type="checkbox"
                                                      checked={field.required}
                                                      onChange={(e) => {
                                                        const newFields = [
                                                          ...fields
                                                        ];
                                                        newFields[
                                                          idx
                                                        ].required =
                                                          e.target.checked;
                                                        setFields(newFields);
                                                      }}
                                                      className="accent-blue-600"
                                                    />
                                                    <span className="text-sm">
                                                      Required
                                                    </span>
                                                  </label>
                                                  <button
                                                    className="text-gray-500 hover:text-red-600"
                                                    title="Delete"
                                                    onClick={() =>
                                                      setFields(
                                                        fields.filter(
                                                          (f) =>
                                                            f.id !== field.id
                                                        )
                                                      )
                                                    }
                                                  >
                                                    <svg
                                                      width="18"
                                                      height="18"
                                                      fill="none"
                                                      stroke="currentColor"
                                                      strokeWidth={2}
                                                    >
                                                      <line
                                                        x1="6"
                                                        y1="6"
                                                        x2="18"
                                                        y2="18"
                                                      />
                                                      <line
                                                        x1="18"
                                                        y1="6"
                                                        x2="6"
                                                        y2="18"
                                                      />
                                                    </svg>
                                                  </button>
                                                </div>
                                              </div>
                                              {/* Options for radio/checkbox */}
                                              {(field.type === "radio" ||
                                                field.type === "checkbox") && (
                                                <div className="ml-8">
                                                  {field.options?.map(
                                                    (
                                                      opt: string,
                                                      oidx: number
                                                    ) => (
                                                      <div
                                                        key={oidx}
                                                        className="flex items-center mb-1"
                                                      >
                                                        <input
                                                          type={field.type}
                                                          className="mr-2"
                                                          disabled
                                                        />
                                                        <span>
                                                          {opt ||
                                                            `Option ${
                                                              oidx + 1
                                                            }`}
                                                        </span>
                                                        <button
                                                          className="ml-2 text-gray-400 hover:text-red-500"
                                                          onClick={() => {
                                                            const newFields = [
                                                              ...fields
                                                            ];
                                                            newFields[
                                                              idx
                                                            ].options =
                                                              newFields[
                                                                idx
                                                              ].options.filter(
                                                                (
                                                                  _: any,
                                                                  i: number
                                                                ) => i !== oidx
                                                              );
                                                            setFields(
                                                              newFields
                                                            );
                                                          }}
                                                          disabled={
                                                            field.options
                                                              .length <= 1
                                                          }
                                                          title="Delete Option"
                                                        >
                                                          <svg
                                                            width="16"
                                                            height="16"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                          >
                                                            <line
                                                              x1="4"
                                                              y1="4"
                                                              x2="12"
                                                              y2="12"
                                                            />
                                                            <line
                                                              x1="12"
                                                              y1="4"
                                                              x2="4"
                                                              y2="12"
                                                            />
                                                          </svg>
                                                        </button>
                                                      </div>
                                                    )
                                                  )}
                                                  <button
                                                    className="text-blue-600 text-sm mt-1"
                                                    onClick={(e) => {
                                                      e.preventDefault();
                                                      const newFields = [
                                                        ...fields
                                                      ];
                                                      newFields[idx].options = [
                                                        ...newFields[idx]
                                                          .options,
                                                        ""
                                                      ];
                                                      setFields(newFields);
                                                    }}
                                                  >
                                                    + Add Option
                                                  </button>
                                                </div>
                                              )}
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
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowQuestionModal(false)}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4">Questions</h2>
            {questionStep === 1 && (
              <>
                <div className="mb-4 font-semibold">Add Questions</div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { type: "text", label: "Short Text", icon: "T" },
                    { type: "textarea", label: "Long Text", icon: "≡" },
                    { type: "radio", label: "Multiple Choice", icon: "◯" },
                    { type: "checkbox", label: "Checkboxes", icon: "☑" },
                    { type: "date", label: "Date", icon: "📅" },
                    { type: "time", label: "Time", icon: "⏰" },
                    { type: "file", label: "File Upload", icon: "⤴" },
                    { type: "rating", label: "Rating", icon: "★" }
                  ].map((q) => (
                    <button
                      key={q.type}
                      className="flex flex-col items-center p-4 rounded hover:bg-gray-100 transition"
                      onClick={() => {
                        setNewQuestionType(q.type);
                        setNewQuestion((prev: any) => ({
                          ...prev,
                          type: q.type
                        }));
                        setQuestionStep(2);
                      }}
                    >
                      <span className="text-2xl mb-2">{q.icon}</span>
                      <span className="text-sm">{q.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                    onClick={() => setShowQuestionModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
            {questionStep === 2 && (
              <>
                {/* Question Config UI */}
                <div className="mb-4">
                  <input
                    className="w-full border rounded px-3 py-2 mb-2"
                    placeholder="Write text here"
                    value={newQuestion.label}
                    onChange={(e) =>
                      setNewQuestion((prev: any) => ({
                        ...prev,
                        label: e.target.value
                      }))
                    }
                  />
                  {(newQuestionType === "radio" ||
                    newQuestionType === "checkbox") && (
                    <div>
                      {newQuestion.options.map((opt: string, idx: number) => (
                        <div key={idx} className="flex items-center mb-1">
                          <input
                            type={newQuestionType}
                            className="mr-2"
                            disabled
                          />
                          <input
                            className="border rounded px-2 py-1 flex-1"
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const opts = [...newQuestion.options];
                              opts[idx] = e.target.value;
                              setNewQuestion((prev: any) => ({
                                ...prev,
                                options: opts
                              }));
                            }}
                          />
                          <button
                            className="ml-2 text-red-500"
                            onClick={() => {
                              setNewQuestion((prev: any) => ({
                                ...prev,
                                options: prev.options.filter(
                                  (_: any, i: number) => i !== idx
                                )
                              }));
                            }}
                            disabled={newQuestion.options.length <= 1}
                          >
                            🗑
                          </button>
                        </div>
                      ))}
                      <button
                        className="text-blue-600 text-sm mt-1"
                        onClick={(e) => {
                          e.preventDefault();
                          setNewQuestion((prev: any) => ({
                            ...prev,
                            options: [...prev.options, ""]
                          }));
                        }}
                      >
                        + Add Option
                      </button>
                    </div>
                  )}
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={newQuestion.required}
                      onChange={(e) =>
                        setNewQuestion((prev: any) => ({
                          ...prev,
                          required: e.target.checked
                        }))
                      }
                    />
                    <span>Required</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                    onClick={() => setQuestionStep(1)}
                  >
                    Back
                  </button>
                  <div>
                    <button
                      className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 mr-2"
                      onClick={() => setShowQuestionModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => {
                        setFields([
                          ...fields,
                          { ...newQuestion, id: Date.now() }
                        ]);
                        setShowQuestionModal(false);
                      }}
                    >
                      Save Question
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EditEvent;
