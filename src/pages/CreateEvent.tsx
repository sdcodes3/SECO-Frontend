import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Input from "@/components/UI/Input";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  setFormData,
  setCreatedBy,
  setStep,
  setBannerPreview,
  setBannerFile,
  addStage,
  removeStage,
  updateStage,
  setShowQuestionModal,
  setQuestionStep,
  setNewQuestionType,
  updateNewQuestion,
  addNewQuestionOption,
  updateNewQuestionOption,
  removeNewQuestionOption,
  addField,
  updateField,
  removeField,
  duplicateField,
  setActiveTab,
  updatePreviewFormData,
  resetCreationState,
  createEvent,
  saveFormFields,
} from "../slices/EventSlice";
import { RootState, AppDispatch } from "../storage/store";

interface Stage {
  id: string;
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
}

interface FormField {
  id: number;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  description?: string;
}

const CreateEvent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    formData,
    stages,
    fields,
    eventId,
    bannerPreview,
    step,
    showQuestionModal,
    questionStep,
    newQuestion,
    activeTab,
    previewFormData,
    previewErrors,
    loading,
    error,
    success,
  } = useSelector((state: RootState) => state.event.creation);

  const [errorFields, setErrorFields] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location_link: "",
    type: "",
    capacity: "",
    website: "",
    banner: "",
  });

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      dispatch(setCreatedBy(user.id));
    }
    // Cleanup on unmount
    return () => {
      dispatch(resetCreationState());
    };
  }, [dispatch]);

  const isSaveDisabled =
    !newQuestion.label.trim() ||
    ((newQuestion.type === "radio" || newQuestion.type === "checkbox") &&
      (!newQuestion.options?.length ||
        newQuestion.options.some((opt: string) => !opt.trim())));

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    dispatch(
      setFormData({
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      })
    );
  };

  const validateForm = () => {
    return {
      title: formData.title.trim() ? "" : "Title is required",
      description: formData.description.trim() ? "" : "Description is required",
      start_date: stages[0].start_date ? "" : "Start date is required",
      end_date: stages[0].end_date ? "" : "End date is required",
      location_link: formData.location_link.trim()
        ? ""
        : "Location is required",
      type: formData.type ? "" : "Type is required",
      capacity:
        !formData.capacity || Number(formData.capacity) <= 0
          ? "Capacity must be positive"
          : "",
      website: formData.website.trim()
        ? isValidWebsite(formData.website)
          ? ""
          : "Add valid website"
        : "Add valid website",
      banner: bannerPreview?.trim() ? "" : "Banner is required",
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    const isError = Object.values(errors).some((value) => value !== "");
    if (isError) {
      toast.error("Please fill all required fields");
      setErrorFields(errors);
      return;
    }

    try {
      // Dispatch createEvent action
      const bannerInput = document.getElementById(
        "event-banner-input"
      ) as HTMLInputElement;
      const file = bannerInput?.files?.[0] || null;

      await dispatch(
        createEvent({
          formData,
          stages,
          file,
        })
      ).unwrap();

      toast.success("Event created successfully!");
    } catch (err: any) {
      console.error("Error creating event:", err);
      toast.error(err || "Failed to create event. Please try again.");
    }
  };

  // const handleAddField = () => {
  //   dispatch(setShowQuestionModal(true));
  //   dispatch(setQuestionStep(1));
  //   dispatch(setNewQuestionType(null));
  //   dispatch(
  //     updateNewQuestion({
  //       label: "",
  //       type: "",
  //       required: false,
  //       options: [""],
  //     })
  //   );
  // };

  const handleSaveForm = async () => {
    try {
      if (!eventId) {
        toast.error("Event ID is missing. Please create the event first.");
        return;
      }

      const userData = localStorage.getItem("user");
      if (!userData) {
        toast.error("Please login to save form");
        return;
      }

      await dispatch(
        saveFormFields({
          eventId,
          fields,
        })
      ).unwrap();

      toast.success("Form fields saved successfully!");
    } catch (error) {
      toast.error("Failed to save form fields. Please try again.");
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(setBannerPreview(URL.createObjectURL(file)));
      dispatch(setBannerFile(file));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "website" && !isValidWebsite(value)) {
      setErrorFields((prev) => ({
        ...prev,
        website: "Please enter a valid website URL.",
      }));
    } else {
      setErrorFields((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isValidWebsite = (url: string) =>
    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/.test(url);

  const handleRemoveBanner = () => {
    dispatch(setBannerPreview(null));
    dispatch(setBannerFile(null));
    (document.getElementById("event-banner-input") as HTMLInputElement).value =
      "";
  };

  // const handleStageChange = (
  //   index: number,
  //   field: keyof Stage,
  //   value: string
  // ) => {
  //   dispatch(updateStage({ index, field, value }));
  // };

  // const handlePreviewInputChange = (
  //   fieldId: string,
  //   value: any,
  //   required: boolean
  // ) => {
  //   dispatch(updatePreviewFormData({ fieldId, value, required }));
  // };

  const renderPreviewForm = () => {
    return (
      <div className="space-y-6">
        {fields.map((field: FormField) => (
          <div key={field.id} className="space-y-2">
            <label className="text-sm font-medium leading-none">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                className={`w-full rounded-md border ${previewErrors[field.id] ? "border-red-500" : "border-input"
                  } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                placeholder={field.placeholder || "Enter your answer"}
                value={previewFormData[field.id] || ""}
                onChange={(e) =>
                  dispatch(
                    updatePreviewFormData({
                      fieldId: field.id.toString(),
                      value: e.target.value,
                      required: field.required,
                    })
                  )
                }
              />
            )}

            {field.type === "textarea" && (
              <textarea
                className={`w-full rounded-md border ${previewErrors[field.id] ? "border-red-500" : "border-input"
                  } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]`}
                placeholder={field.placeholder || "Enter your answer"}
                value={previewFormData[field.id] || ""}
                onChange={(e) =>
                  dispatch(
                    updatePreviewFormData({
                      fieldId: field.id.toString(),
                      value: e.target.value,
                      required: field.required,
                    })
                  )
                }
              />
            )}

            {field.type === "radio" && (
              <div className="space-y-2">
                {field.options?.map((option: string, index: number) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={field.id.toString()}
                      value={option}
                      checked={previewFormData[field.id] === option}
                      onChange={(e) =>
                        dispatch(
                          updatePreviewFormData({
                            fieldId: field.id.toString(),
                            value: e.target.value,
                            required: field.required,
                          })
                        )
                      }
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {field.type === "checkbox" && (
              <div className="space-y-2">
                {field.options?.map((option: string, index: number) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={option}
                      checked={previewFormData[field.id]?.includes(option)}
                      onChange={(e) => {
                        const currentValues = previewFormData[field.id] || [];
                        const newValues = e.target.checked
                          ? [...currentValues, option]
                          : currentValues.filter((v: string) => v !== option);
                        dispatch(
                          updatePreviewFormData({
                            fieldId: field.id.toString(),
                            value: newValues,
                            required: field.required,
                          })
                        );
                      }}
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {field.type === "date" && (
              <input
                type="date"
                className={`w-full rounded-md border ${previewErrors[field.id] ? "border-red-500" : "border-input"
                  } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                value={previewFormData[field.id] || ""}
                onChange={(e) =>
                  dispatch(
                    updatePreviewFormData({
                      fieldId: field.id.toString(),
                      value: e.target.value,
                      required: field.required,
                    })
                  )
                }
              />
            )}

            {field.type === "time" && (
              <input
                type="time"
                className={`w-full rounded-md border ${previewErrors[field.id] ? "border-red-500" : "border-input"
                  } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                value={previewFormData[field.id] || ""}
                onChange={(e) =>
                  dispatch(
                    updatePreviewFormData({
                      fieldId: field.id.toString(),
                      value: e.target.value,
                      required: field.required,
                    })
                  )
                }
              />
            )}

            {field.type === "file" && (
              <input
                type="file"
                className={`w-full rounded-md border ${previewErrors[field.id] ? "border-red-500" : "border-input"
                  } bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
                onChange={(e) =>
                  dispatch(
                    updatePreviewFormData({
                      fieldId: field.id.toString(),
                      value: e.target.files?.[0],
                      required: field.required,
                    })
                  )
                }
              />
            )}

            {field.type === "rating" && (
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() =>
                      dispatch(
                        updatePreviewFormData({
                          fieldId: field.id.toString(),
                          value: rating,
                          required: field.required,
                        })
                      )
                    }
                    className={`text-2xl ${previewFormData[field.id] >= rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                      }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            )}

            {previewErrors[field.id] && (
              <p className="text-sm text-red-500">{previewErrors[field.id]}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const renderEventPreview = () => {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="w-full h-64 mb-8 rounded-lg overflow-hidden">
            <img
              src={
                bannerPreview ||
                "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
              }
              alt={formData.title}
              className="w-full h-full object-cover bg-gray-100"
            />
          </div>
          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {formData.type}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {formData.is_virtual ? "Virtual" : "In-Person"}
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{formData.title}</h1>
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
                    <span>{formatDate(formData.start_date)}</span>
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
                      {formatTime(formData.start_date)} -{" "}
                      {formatTime(formData.end_date)}
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
                    <span>{formData.location_link}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {stages.length > 0 && (
                <div className="mb-8">
                  <div className="flex flex-col gap-6">
                    {stages.map((stage: Stage, idx: number) => {
                      const dateObj = new Date(stage.start_date);
                      const day = dateObj.getDate();
                      const month = dateObj.toLocaleString("en-US", {
                        month: "short",
                      });

                      return (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="flex flex-col items-center min-w-[56px]">
                            <div className="bg-blue-100 text-blue-700 rounded-lg px-2 py-1 text-center font-semibold text-sm mb-1">
                              {day}
                              <div className="text-xs text-gray-500 font-normal">
                                {month} {String(dateObj.getFullYear()).slice(2)}
                              </div>
                            </div>
                            {idx < stages.length - 1 && (
                              <div
                                className="w-px bg-blue-300 flex-1 mx-auto"
                                style={{ minHeight: 32 }}
                              />
                            )}
                          </div>
                          <div className="flex-1 bg-white rounded-lg shadow border p-4">
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
                                {stage.start_time && <>| {stage.start_time}</>}
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
                      {formData.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 pt-6">
                  <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Date and Time</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(formData.start_date)}
                        <br />
                        {formatTime(formData.start_date)} -{" "}
                        {formatTime(formData.end_date)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Location</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.location_link}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Event Type</h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {formData.type}
                      </p>
                    </div>
                    {formData.capacity ? (
                      <div>
                        <h3 className="text-sm font-medium">Capacity</h3>
                        <p className="text-sm text-muted-foreground">
                          {formData.capacity} attendees
                        </p>
                      </div>
                    ) : null}
                    {formData.website && (
                      <div>
                        <h3 className="text-sm font-medium">Website</h3>
                        <p className="text-sm text-muted-foreground">
                          {formData.website}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              type="button"
              onClick={() => dispatch(setStep(2))}
            >
              Back to Form Builder
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              type="button"
              onClick={() => {
                navigate("/my-events");
                dispatch(resetCreationState());
              }}
            >
              Publish Event
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex-1 overflow-auto">
        {step === 1 ? (
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
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
                      <Input
                        value={formData.title}
                        handleChange={handleInputChange}
                        label="Event Title"
                        name="title"
                        type="text"
                        placeholder="Enter event title"
                        description="A clear, concise title for your event"
                        error={errorFields.title}
                        required={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Event Banner <span className="text-red-500">*</span>
                        <div className="text-sm text-red-500 font-normal">
                          {errorFields.banner}
                        </div>
                      </label>
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative bg-gray-100 min-h-[180px] cursor-pointer group transition"
                        onClick={() =>
                          !bannerPreview &&
                          document.getElementById("event-banner-input")?.click()
                        }
                      >
                        {bannerPreview ? (
                          <div className="w-full h-full flex items-center justify-center relative">
                            <img
                              src={bannerPreview}
                              alt="Event Banner Preview"
                              className="object-contain max-h-48 w-full rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition rounded-lg">
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
                          required={true}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Input
                        value={formData.description}
                        handleChange={handleInputChange}
                        label="Event Description"
                        name="description"
                        type="textarea"
                        placeholder="Describe your event..."
                        description="Provide details about your event"
                        error={errorFields.description}
                        required={true}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Event Stages</h3>
                        <button
                          type="button"
                          onClick={() => dispatch(addStage())}
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
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
                            className="lucide lucide-plus mr-1 h-4 w-4"
                          >
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                          </svg>
                          Add Stage
                        </button>
                      </div>

                      <div className="space-y-4">
                        {stages.map((stage: Stage, index: number) => (
                          <div
                            key={stage.id}
                            className="rounded-lg border bg-card p-6"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  Stage {index + 1}{" "}
                                  <span className="text-red-500 ml-1">*</span>
                                </span>
                              </div>
                              {stages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => dispatch(removeStage(index))}
                                  className="text-red-500 hover:text-red-700"
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
                                    dispatch(
                                      updateStage({
                                        index,
                                        field: "name",
                                        value: e.target.value,
                                      })
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
                                    dispatch(
                                      updateStage({
                                        index,
                                        field: "description",
                                        value: e.target.value,
                                      })
                                    )
                                  }
                                />
                              </div>

                              <div className="space-y-2 flex flex-col">
                                <label
                                  className="text-sm font-medium leading-none"
                                  htmlFor={`stage_start_date_${index}`}
                                >
                                  Start Date
                                </label>
                                <DatePicker
                                  selected={
                                    stage.start_date
                                      ? new Date(stage.start_date + "T00:00:00")
                                      : null
                                  }
                                  onChange={(date: Date | null) => {
                                    if (date) {
                                      const year = date.getFullYear();
                                      const month = String(date.getMonth() + 1).padStart(2, "0");
                                      const day = String(date.getDate()).padStart(2, "0");
                                      const formattedDate = `${year}-${month}-${day}`;

                                      dispatch(
                                        updateStage({
                                          index,
                                          field: "start_date",
                                          value: formattedDate,
                                        })
                                      );

                                      if (stage.end_date) {
                                        const currentEndDate = new Date(stage.end_date + "T00:00:00");
                                        const selectedDate = new Date(
                                          date.getFullYear(),
                                          date.getMonth(),
                                          date.getDate()
                                        );

                                        if (currentEndDate <= selectedDate) {
                                          dispatch(
                                            updateStage({
                                              index,
                                              field: "end_date",
                                              value: "",
                                            })
                                          );
                                        }
                                      }
                                    }
                                  }}

                                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm w-full cursor-pointer ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  dateFormat="MMMM d, yyyy"
                                  placeholderText="Select a date"
                                  popperPlacement="bottom-start"
                                  onKeyDown={(e) => e.preventDefault()}
                                  onFocus={(e) => e.target.blur()}
                                />
                              </div>

                              <div className="space-y-2 flex flex-col">
                                <label
                                  className="text-sm font-medium leading-none"
                                  htmlFor={`stage_start_time_${index}`}
                                >
                                  Start Time
                                </label>
                                <DatePicker
                                  selected={
                                    stages[index]?.start_time
                                      ? new Date(
                                        `1970-01-01T${stages[index].start_time}:00`
                                      )
                                      : null
                                  }
                                  onChange={(date: Date | null) => {
                                    const time = date ? date.toTimeString().slice(0, 5) : "";
                                    dispatch(
                                      updateStage({
                                        index,
                                        field: "start_time",
                                        value: time,
                                      })
                                    );
                                  }}

                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={15}
                                  timeCaption="Time"
                                  dateFormat="HH:mm"
                                  placeholderText="Select Start Time"
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                  onKeyDown={(e) => e.preventDefault()}
                                  onFocus={(e) => e.target.blur()}
                                />
                              </div>

                              <div className="space-y-2 flex flex-col">
                                <label
                                  className="text-sm font-medium leading-none"
                                  htmlFor={`stage_end_date_${index}`}
                                >
                                  End Date
                                </label>
                                <DatePicker
                                  minDate={
                                    stage.start_date
                                      ? (() => {
                                        const startDate = new Date(
                                          stage.start_date + "T00:00:00"
                                        );
                                        const minDate = new Date(
                                          startDate.getFullYear(),
                                          startDate.getMonth(),
                                          startDate.getDate() + 1
                                        );
                                        return minDate;
                                      })()
                                      : undefined
                                  }
                                  selected={
                                    stage.end_date
                                      ? new Date(stage.end_date + "T00:00:00")
                                      : null
                                  }
                                  onChange={(date: Date | null) => {
                                    if (!date) return;

                                    const startDate = stage.start_date
                                      ? new Date(stage.start_date + "T00:00:00")
                                      : null;

                                    if (!startDate) {
                                      alert("Please select a start date first.");
                                      return;
                                    }

                                    const year = date.getFullYear();
                                    const month = String(date.getMonth() + 1).padStart(2, "0");
                                    const day = String(date.getDate()).padStart(2, "0");
                                    const selectedEndDate = `${year}-${month}-${day}`;

                                    const startDateLocal = new Date(
                                      startDate.getFullYear(),
                                      startDate.getMonth(),
                                      startDate.getDate()
                                    );
                                    const endDateLocal = new Date(
                                      date.getFullYear(),
                                      date.getMonth(),
                                      date.getDate()
                                    );

                                    const minEndDate = new Date(startDateLocal);
                                    minEndDate.setDate(minEndDate.getDate() + 1);

                                    if (endDateLocal < minEndDate) {
                                      alert("End date must be at least one day after the start date.");
                                      return;
                                    }

                                    dispatch(
                                      updateStage({
                                        index,
                                        field: "end_date",
                                        value: selectedEndDate,
                                      })
                                    );
                                  }}

                                  placeholderText="Select End Date"
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                  dateFormat="MMMM d, yyyy"
                                  onKeyDown={(e) => e.preventDefault()}
                                  onFocus={(e) => e.target.blur()}
                                  disabled={!stage.start_date}
                                />
                              </div>

                              <div className="space-y-2 flex flex-col">
                                <label
                                  className="text-sm font-medium leading-none"
                                  htmlFor={`stage_end_time_${index}`}
                                >
                                  End Time
                                </label>
                                <DatePicker
                                  selected={
                                    stages[index]?.end_time
                                      ? new Date(
                                        `1970-01-01T${stages[index].end_time}:00`
                                      )
                                      : null
                                  }
                                  onChange={(date: Date | null) => {
                                    const time = date ? date.toTimeString().slice(0, 5) : "";
                                    dispatch(
                                      updateStage({
                                        index,
                                        field: "end_time",
                                        value: time,
                                      })
                                    );
                                  }}

                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeIntervals={15}
                                  timeCaption="Time"
                                  dateFormat="HH:mm"
                                  placeholderText="Select End Time"
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                  onKeyDown={(e) => e.preventDefault()}
                                  onFocus={(e) => e.target.blur()}
                                  disabled={!stage.end_date}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">
                        Event Type<span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="space-y-1">
                        <div className="relative w-full">
                          <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-2 pr-10 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="networking">Networking</option>
                            <option value="pitch">Pitch</option>
                            <option value="workshop">Workshop</option>
                            <option value="hackathon">Hackathon</option>
                            <option value="meetup">Meetup</option>
                            <option value="conference">Conference</option>
                            <option value="other">Other</option>
                          </select>

                          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-600 justify-center">
                            <svg
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="capacity"
                        className="text-sm font-medium text-gray-900"
                      >
                        Capacity <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        min={0}
                        placeholder="Maximum number of attendees"
                        required
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900 placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave empty for unlimited capacity
                      </p>
                      {errorFields.capacity && Number(formData.capacity) < 0 && (
                        <p className="text-sm text-red-500">
                          {errorFields.capacity}
                        </p>
                      )}
                    </div>

                    <label className="flex flex-row items-start space-x-3 border p-4 rounded-md cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_virtual"
                        id="is_virtual"
                        checked={formData.is_virtual}
                        onChange={handleInputChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="space-y-1 leading-none">
                        <span className="text-sm font-medium leading-none">
                          Virtual Event
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Check this if your event will be held online
                        </p>
                      </div>
                    </label>

                    <div className="space-y-2">
                      <label
                        htmlFor="location_link"
                        className="text-sm font-medium text-gray-900"
                      >
                        Location<span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="location_link"
                        id="location_link"
                        value={formData.location_link}
                        onChange={handleInputChange}
                        onBlur={() => {
                          const isVirtual = formData.is_virtual;
                          const value = formData.location_link.trim();
                          const isZoomLink =
                            /^https:\/\/(.*\.)?zoom\.us\/(j|my)\/[a-zA-Z0-9?&=]+$/.test(
                              value
                            );

                          if (isVirtual && !isZoomLink) {
                            setErrorFields((prev) => ({
                              ...prev,
                              location_link:
                                "Please provide a valid Zoom meeting link",
                            }));
                          } else if (!isVirtual && value.length < 5) {
                            setErrorFields((prev) => ({
                              ...prev,
                              location_link: "Please enter a valid address",
                            }));
                          } else {
                            setErrorFields((prev) => ({
                              ...prev,
                              location_link: "",
                            }));
                          }
                        }}
                        placeholder={
                          formData.is_virtual
                            ? "https://zoom.us/..."
                            : "Event venue or address"
                        }
                        required
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900 placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <p className="text-sm text-muted-foreground">
                        {formData.is_virtual
                          ? "Please provide a valid Zoom meeting link"
                          : "Enter the event venue or address"}
                      </p>
                      {errorFields.location_link && (
                        <p className="text-sm text-red-500">
                          {errorFields.location_link}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="website"
                        className="text-sm font-medium text-gray-900"
                      >
                        Website <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="https://example.com"
                        required
                        pattern="https?://.+"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-gray-900 placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      {errorFields.website && (
                        <p className="text-sm text-red-500">
                          {errorFields.website}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Continue"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : step === 2 ? (
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
                            aria-selected={activeTab === "edit"}
                            aria-controls="radix-:r1b:-content-edit"
                            data-state={
                              activeTab === "edit" ? "active" : "inactive"
                            }
                            id="radix-:r1b:-trigger-edit"
                            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === "edit"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground"
                              }`}
                            onClick={() => dispatch(setActiveTab("edit"))}
                          >
                            Edit Form
                          </button>
                          <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "preview"}
                            aria-controls="radix-:r1b:-content-preview"
                            data-state={
                              activeTab === "preview" ? "active" : "inactive"
                            }
                            id="radix-:r1b:-trigger-preview"
                            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${activeTab === "preview"
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground"
                              }`}
                            onClick={() => dispatch(setActiveTab("preview"))}
                          >
                            Preview Form
                          </button>
                        </div>
                        <div
                          data-state={
                            activeTab === "edit" ? "active" : "inactive"
                          }
                          data-orientation="horizontal"
                          role="tabpanel"
                          aria-labelledby="radix-:r1b:-trigger-edit"
                          id="radix-:r1b:-content-edit"
                          tabIndex={0}
                          className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
                          style={{
                            display: activeTab === "edit" ? "block" : "none",
                          }}
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
                                        fields.map((field: FormField, idx: number) => (
                                          <div
                                            key={field.id}
                                            className="rounded-lg border p-6 mb-4 bg-white shadow flex flex-col gap-2"
                                          >
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <span className="cursor-move text-gray-400 mr-2">
                                                  ⋮⋮
                                                </span>
                                                <span className="font-semibold text-lg">
                                                  {field.label ||
                                                    `Question ${idx + 1}`}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2 capitalize">
                                                  {field.type === "text" &&
                                                    "Short Text"}
                                                  {field.type === "textarea" &&
                                                    "Long Text"}
                                                  {field.type === "radio" &&
                                                    "Multiple Choice"}
                                                  {field.type === "checkbox" &&
                                                    "Checkboxes"}
                                                  {field.type === "date" &&
                                                    "Date"}
                                                  {field.type === "time" &&
                                                    "Time"}
                                                  {field.type === "file" &&
                                                    "File upload"}
                                                  {field.type === "rating" &&
                                                    "Rating"}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <label className="flex items-center gap-1 cursor-pointer">
                                                  <input
                                                    type="checkbox"
                                                    checked={field.required}
                                                    onChange={(e) => {
                                                      dispatch(
                                                        updateField({
                                                          index: idx,
                                                          updates: {
                                                            required:
                                                              e.target.checked,
                                                          },
                                                        })
                                                      );
                                                    }}
                                                    className="accent-blue-600"
                                                  />
                                                  <span className="text-sm">
                                                    Required
                                                  </span>
                                                </label>
                                                <button
                                                  className="text-gray-500 hover:text-blue-600"
                                                  title="Duplicate"
                                                  onClick={() =>
                                                    dispatch(duplicateField(idx))
                                                  }
                                                >
                                                  <svg
                                                    width="18"
                                                    height="18"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                  >
                                                    <rect
                                                      x="4"
                                                      y="4"
                                                      width="10"
                                                      height="10"
                                                      rx="2"
                                                    />
                                                    <rect
                                                      x="7"
                                                      y="7"
                                                      width="10"
                                                      height="10"
                                                      rx="2"
                                                    />
                                                  </svg>
                                                </button>
                                                <button
                                                  className="text-gray-500 hover:text-red-600"
                                                  title="Delete"
                                                  onClick={() =>
                                                    dispatch(removeField(field.id))
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
                                                <button
                                                  className="text-gray-500 hover:text-gray-800"
                                                  title="Settings"
                                                >
                                                  <svg
                                                    width="18"
                                                    height="18"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                  >
                                                    <circle
                                                      cx="9"
                                                      cy="9"
                                                      r="7"
                                                    />
                                                    <path d="M9 5v4l3 3" />
                                                  </svg>
                                                </button>
                                              </div>
                                            </div>
                                            {(field.type === "radio" || field.type === "checkbox") && (
                                              <div className="ml-8">
                                                {field.options?.map((opt: string, oidx: number) => (
                                                  <div key={oidx} className="flex items-center mb-1">
                                                    <input type={field.type} className="mr-2" disabled />
                                                    <span>{opt || `Option ${oidx + 1}`}</span>
                                                    <button
                                                      className="ml-2 text-gray-400 hover:text-red-500"
                                                      onClick={() => {
                                                        if (field.options) { // Type guard
                                                          const newOptions = field.options.filter(
                                                            (_, i: number) => i !== oidx
                                                          );
                                                          dispatch(
                                                            updateField({
                                                              index: idx,
                                                              updates: {
                                                                options: newOptions,
                                                              },
                                                            })
                                                          );
                                                        }
                                                      }}
                                                      disabled={(field.options?.length ?? 0) <= 1} // Fallback to 0 if undefined
                                                      title="Delete Option"
                                                    >
                                                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
                                                        <line x1="4" y1="4" x2="12" y2="12" />
                                                        <line x1="12" y1="4" x2="4" y2="12" />
                                                      </svg>
                                                    </button>
                                                  </div>
                                                ))}
                                                <button
                                                  className="text-blue-600 text-sm mt-1"
                                                  onClick={() => {
                                                    dispatch(
                                                      updateField({
                                                        index: idx,
                                                        updates: {
                                                          options: [...(field.options || []), ""], // Fallback to empty array
                                                        },
                                                      })
                                                    );
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
                                      onClick={() =>
                                        dispatch(setShowQuestionModal(true))
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
                          data-state={
                            activeTab === "preview" ? "active" : "inactive"
                          }
                          data-orientation="horizontal"
                          role="tabpanel"
                          aria-labelledby="radix-:r1b:-trigger-preview"
                          id="radix-:r1b:-content-preview"
                          tabIndex={0}
                          className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0"
                          style={{
                            display: activeTab === "preview" ? "block" : "none",
                          }}
                        >
                          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="p-6 pt-6">
                              <div className="space-y-4">
                                <div
                                  role="alert"
                                  className="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground bg-background text-foreground"
                                >
                                  <div className="text-sm [&_p]:leading-relaxed">
                                    This is how your registration form will
                                    appear to participants.
                                  </div>
                                </div>
                                {fields.length === 0 ? (
                                  <div className="text-center p-8 border border-dashed rounded-md text-muted-foreground">
                                    No fields added yet. Add some fields in the
                                    Edit Form tab to see the preview.
                                  </div>
                                ) : (
                                  renderPreviewForm()
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      type="button"
                      onClick={() => dispatch(setStep(3))}
                    >
                      Skip Form Builder
                    </button>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      type="button"
                      onClick={() => {
                        dispatch(setStep(3));
                      }}
                    >
                      Finish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : step == 3 ? (
          <>
            {" "}
            <div className="py-3 max-w-3xl mx-auto">
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
                        Add judges or mentors to evaluate and provide feedback
                        for this event
                      </p>
                    </div>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      type="button"
                      onClick={() => setShowAddJudgeModal(true)}
                    >
                      Add Judge/Mentor
                    </button>
                  </div>

                  {judgesEmails.length === 0 ? (
                    <div className="py-6 text-center text-muted-foreground">
                      No judges or mentors added yet
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {judgesEmails.map((email, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-medium">
                                {email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-sm">{email}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveJudge(email)}
                            className="text-red-500 hover:text-red-700"
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
                              className="h-5 w-5"
                            >
                              <path d="M3 6h18" />
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  type="button"
                  onClick={() => navigate("/my-events")}
                >
                  Back to Events
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  type="button"
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </>
        ) : (
          renderEventPreview()
        )}
      </div>
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => dispatch(setShowQuestionModal(false))}
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
                    { type: "rating", label: "Rating", icon: "★" },
                  ].map((q) => (
                    <button
                      key={q.type}
                      className="flex flex-col items-center p-4 rounded hover:bg-gray-100 transition"
                      onClick={() => {
                        dispatch(setNewQuestionType(q.type));
                        dispatch(
                          updateNewQuestion({
                            type: q.type,
                          })
                        );
                        dispatch(setQuestionStep(2));
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
                    onClick={() => dispatch(setShowQuestionModal(false))}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
            {questionStep === 2 && (
              <>
                <div className="mb-4">
                  <input
                    className="w-full border rounded px-3 py-2 mb-2"
                    placeholder="Write text here"
                    value={newQuestion.label}
                    onChange={(e) =>
                      dispatch(
                        updateNewQuestion({
                          label: e.target.value,
                        })
                      )
                    }
                  />
                  {(newQuestion.type === "radio" ||
                    newQuestion.type === "checkbox") && (
                      <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium">Options</label>
                        {newQuestion.options?.map((option: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input
                              type="text"
                              className="flex-1 border rounded px-3 py-2"
                              placeholder={`Option ${idx + 1}`}
                              value={option}
                              onChange={(e) =>
                                dispatch(
                                  updateNewQuestionOption({
                                    index: idx,
                                    value: e.target.value,
                                  })
                                )
                              }
                            />
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => dispatch(removeNewQuestionOption(idx))}
                              disabled={(newQuestion.options?.length ?? 0) <= 1}
                            >
                              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2}>
                                <line x1="4" y1="4" x2="12" y2="12" />
                                <line x1="12" y1="4" x2="4" y2="12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="text-blue-600 text-sm mt-1"
                          onClick={() => dispatch(addNewQuestionOption())}
                        >
                          + Add Option
                        </button>
                      </div>
                    )}
                  <div className="flex items-center mt-2">

                    <label htmlFor="question-required">
                      <input
                        className="mr-2"
                        name="question-required"
                        id="question-required"
                        type="checkbox"
                        checked={newQuestion.required}
                        onChange={(e) =>
                          dispatch(
                            updateNewQuestion({
                              required: e.target.checked,
                            })
                          )
                        }
                      />
                      <span>Required</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                    onClick={() => {
                      dispatch(setQuestionStep(1));
                      dispatch(
                        updateNewQuestion({
                          label: "",
                          type: "",
                          required: false,
                          options: [""],
                        })
                      );
                    }}
                  >
                    Back
                  </button>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 mr-2"
                      onClick={() => dispatch(setShowQuestionModal(false))}
                    >
                      Cancel
                    </button>
                    <button
                      className={`px-4 py-2 rounded ${isSaveDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      onClick={() => {
                        if (
                          !newQuestion.label.trim() ||
                          (["radio", "checkbox"].includes(newQuestion.type) &&
                            (!newQuestion.options?.length ||
                              newQuestion.options.some(
                                (opt: string) => !opt.trim()
                              )))
                        ) {
                          toast.error("Please fill out all required fields.");
                          return;
                        }
                        dispatch(addField(newQuestion));
                        dispatch(setShowQuestionModal(false));
                        dispatch(setQuestionStep(1));
                        dispatch(
                          updateNewQuestion({
                            id: 0,
                            label: "",
                            type: "",
                            required: false,
                            options: [""],
                          })
                        );
                        toast.success("Field added successfully!");
                      }}
                      disabled={isSaveDisabled}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => {
                navigate("/my-events");
              }}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Share this event</h3>
            <div className="bg-gray-100 px-3 py-2 rounded mb-4 overflow-auto">
              <span className="text-sm break-all">{`${window.location.origin}/event/${eventId}`}</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleCopy}
              >
                Copy Link
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => {
                  navigate("/my-events");
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Judge Modal */}
      {showAddJudgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowAddJudgeModal(false);
                setJudgeEmailError("");
              }}
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
            <h2 className="text-xl font-bold mb-4">Add Judge/Mentor</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newJudgeEmail}
                  onChange={(e) => {
                    setNewJudgeEmail(e.target.value);
                    setJudgeEmailError("");
                  }}
                  placeholder="Enter email address"
                  className={`w-full rounded-md border ${judgeEmailError ? "border-red-500" : "border-input"
                    } bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                />
                {judgeEmailError && (
                  <p className="text-sm text-red-500 mt-1">{judgeEmailError}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    setShowAddJudgeModal(false);
                    setJudgeEmailError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleAddJudge}
                >
                  Add Judge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateEvent;