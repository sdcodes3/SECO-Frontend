import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../storage/store';
import {
  setFormData,
  setCreatedBy,
  setStep,
  setBannerPreview,
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
  createEvent,
  saveFormFields,
  clearMessages,
  resetCreationState,
  setError,
} from '../slices/EventSlice'
import Input from "@/components/UI/Input";

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

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      dispatch(setCreatedBy(user.id));
    }

    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

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
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.start_date) errors.start_date = "Start date is required";
    if (!formData.end_date) errors.end_date = "End date is required";
    if (!formData.location_link.trim()) errors.location_link = "Location is required";
    if (!formData.type) errors.type = "Type is required";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      dispatch(setFormData({ errors }));
      return;
    }

    const bannerInput = document.getElementById("event-banner-input") as HTMLInputElement;
    const file = bannerInput?.files?.[0] || null;
    dispatch(createEvent({ formData, stages, file }));
  };

  const handleSaveForm = async () => {
    if (!eventId) {
      dispatch(setError("Event ID is missing. Please create the event first."));
      return;
    }
    dispatch(saveFormFields({ eventId, fields }));
  };
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(setBannerPreview(URL.createObjectURL(file)));
    }
  };

  const handleRemoveBanner = () => {
    dispatch(setBannerPreview(null));
    (document.getElementById("event-banner-input") as HTMLInputElement).value = "";
  };

  const renderPreviewForm = () => {
    return (
      <div className="space-y-6">
        {fields.map((field) => (
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
                    {stages.map((stage, idx) => {
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
                      <Input
                        value={formData.title}
                        handleChange={handleInputChange}
                        label="Event Title"
                        name="title"
                        type="text"
                        placeholder="Enter event title"
                        description="A clear, concise title for your event"
                        error={(formData as any).errors?.title}
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
                      <Input
                        value={formData.description}
                        handleChange={handleInputChange}
                        label="Event Description"
                        name="description"
                        type="textarea"
                        placeholder="Describe your event..."
                        description="Provide details about your event"
                        error={(formData as any).errors?.description}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Event Stages</h3>
                        <button
                          type="button"
                          onClick={() => dispatch(addStage())}
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
                                    dispatch(
                                      updateStage({
                                        index,
                                        field: "start_date",
                                        value: e.target.value,
                                      })
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
                                    dispatch(
                                      updateStage({
                                        index,
                                        field: "start_time",
                                        value: e.target.value,
                                      })
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
                                    dispatch(
                                      updateStage({
                                        index,
                                        field: "end_date",
                                        value: e.target.value,
                                      })
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
                                    dispatch(
                                      updateStage({
                                        index,
                                        field: "end_time",
                                        value: e.target.value,
                                      })
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
                        value={formData.capacity.toString()}
                        handleChange={handleInputChange}
                        label="Capacity"
                        name="capacity"
                        type="number"
                        placeholder="Maximum number of attendees"
                        description="Leave empty for unlimited capacity"
                        error={(formData as any).errors?.capacity?.toString()}
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
                        error={(formData as any).errors?.location_link}
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
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Creating...
                          </>
                        ) : (
                          "Continue"
                        )}
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
                                                    onChange={(e) =>
                                                      dispatch(
                                                        updateField({
                                                          index: idx,
                                                          updates: {
                                                            required:
                                                              e.target.checked,
                                                          },
                                                        })
                                                      )
                                                    }
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
                                                  // onClick={...} // implement if you want a settings modal
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
                                            <div className="space-y-2">
                                              <label className="text-sm font-medium leading-none">
                                                Label
                                              </label>
                                              <input
                                                type="text"
                                                value={field.label}
                                                onChange={(e) =>
                                                  dispatch(
                                                    updateField({
                                                      index: idx,
                                                      updates: {
                                                        label: e.target.value,
                                                      },
                                                    })
                                                  )
                                                }
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                placeholder="Enter field label"
                                              />
                                            </div>
                                            {(field.type === "radio" ||
                                              field.type === "checkbox") && (
                                                <div className="space-y-2">
                                                  <label className="text-sm font-medium leading-none">
                                                    Options
                                                  </label>
                                                  {field.options?.map(
                                                    (option, optIdx) => (
                                                      <div
                                                        key={optIdx}
                                                        className="flex items-center gap-2"
                                                      >
                                                        <input
                                                          type="text"
                                                          value={option}
                                                          onChange={(e) =>
                                                            dispatch(
                                                              updateField({
                                                                index: idx,
                                                                updates: {
                                                                  options: field.options?.map(
                                                                    (opt, i) =>
                                                                      i === optIdx
                                                                        ? e.target
                                                                          .value
                                                                        : opt
                                                                  ),
                                                                },
                                                              })
                                                            )
                                                          }
                                                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                          placeholder={`Option ${optIdx + 1
                                                            }`}
                                                        />
                                                        {field.options &&
                                                          field.options.length >
                                                          1 && (
                                                            <button
                                                              type="button"
                                                              onClick={() =>
                                                                dispatch(
                                                                  updateField({
                                                                    index: idx,
                                                                    updates: {
                                                                      options:
                                                                        field.options?.filter(
                                                                          (
                                                                            _,
                                                                            i
                                                                          ) =>
                                                                            i !==
                                                                            optIdx
                                                                        ),
                                                                    },
                                                                  })
                                                                )
                                                              }
                                                              className="text-red-500 hover:text-red-700"
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
                                                          )}
                                                      </div>
                                                    )
                                                  )}
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      dispatch(
                                                        updateField({
                                                          index: idx,
                                                          updates: {
                                                            options: [
                                                              ...(field.options ||
                                                                []),
                                                              "",
                                                            ],
                                                          },
                                                        })
                                                      )
                                                    }
                                                    className="text-primary hover:underline text-sm"
                                                  >
                                                    Add Option
                                                  </button>
                                                </div>
                                              )}
                                          </div>
                                        ))
                                      )}
                                    </div>
                                    <div className="flex justify-center mt-6">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          dispatch(setShowQuestionModal(true))
                                        }
                                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
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
                                        Add Field
                                      </button>
                                    </div>
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
                              <h2 className="text-xl font-semibold mb-4">
                                Form Preview
                              </h2>
                              {fields.length === 0 ? (
                                <div className="text-center p-8 border border-dashed rounded-md text-muted-foreground">
                                  No fields to preview. Add fields in the "Edit
                                  Form" tab to see how your form will look.
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
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
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
                        "Save Form"
                      )}
                    </button>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      type="button"
                      onClick={() => dispatch(setStep(3))}
                      disabled={loading}
                    >
                      Preview Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            {questionStep === 1 ? (
              <>
                <h2 className="text-xl font-bold mb-4">Questions</h2>
                <div className="mb-4 font-semibold">Add Questions</div>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { type: "text", label: "Short Text", icon: "T" },
                    { type: "textarea", label: "Long Text", icon: "≡" },
                    { type: "radio", label: "Multiple Choice", icon: "◯" },
                    { type: "checkbox", label: "Checkboxes", icon: "☑" },
                    { type: "date", label: "Date", icon: "📅" },
                    { type: "time", label: "Time", icon: "⏰" },
                    { type: "file", label: "File Upload", icon: "⏩" },
                    { type: "rating", label: "Rating", icon: "★" },
                  ].map((option) => (
                    <button
                      key={option.type}
                      onClick={() => {
                        dispatch(setNewQuestionType(option.type));
                        dispatch(setQuestionStep(2));
                      }}
                      className="flex flex-col items-center p-4 rounded hover:bg-gray-100 transition"
                    >
                      <span className="text-2xl mb-2">{option.icon}</span>
                      <span className="text-sm text-center">{option.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => dispatch(setShowQuestionModal(false))}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">Add New Question</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Label</label>
                    <input
                      type="text"
                      value={newQuestion.label}
                      onChange={(e) =>
                        dispatch(updateNewQuestion({ label: e.target.value }))
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="Enter question label"
                    />
                  </div>
                  {(newQuestion.type === "radio" || newQuestion.type === "checkbox") && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Options</label>
                      {newQuestion.options?.map((option, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              dispatch(
                                updateNewQuestionOption({
                                  index: idx,
                                  value: e.target.value,
                                })
                              )
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder={`Option ${idx + 1}`}
                          />
                          {newQuestion.options && newQuestion.options.length > 1 && (
                            <button
                              type="button"
                              onClick={() => dispatch(removeNewQuestionOption(idx))}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <line x1="6" y1="6" x2="18" y2="18" />
                                <line x1="18" y1="6" x2="6" y2="18" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => dispatch(addNewQuestionOption())}
                        className="text-primary hover:underline text-sm"
                      >
                        Add Option
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newQuestion.required}
                      onChange={(e) =>
                        dispatch(updateNewQuestion({ required: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label className="text-sm font-medium leading-none">Required</label>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => dispatch(setQuestionStep(1))}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  >
                    Back
                  </button>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => dispatch(setShowQuestionModal(false))}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        dispatch(addField(newQuestion));
                        dispatch(setShowQuestionModal(false));
                        dispatch(
                          updateNewQuestion({
                            id: 0,
                            label: "",
                            type: "",
                            required: false,
                            options: [""],
                          })
                        );
                        dispatch(setQuestionStep(1));
                      }}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      disabled={!newQuestion.label || !newQuestion.type}
                    >
                      Add Question
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

export default CreateEvent;