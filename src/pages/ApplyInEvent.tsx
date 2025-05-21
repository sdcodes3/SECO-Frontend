const ApplyInEvent = () => {
  return (
    <div>
      <div className="container py-6 md:py-8 max-w-6xl">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Apply to TechStars Startup Weekend 2023
            </h1>
            <p className="text-muted-foreground">
              Complete this form to submit your application.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 pb-3">
                <h3 className="font-semibold tracking-tight text-lg">
                  Application Deadline
                </h3>
                <p className="text-sm text-muted-foreground">Oct 1, 2023</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 pb-3">
                <h3 className="font-semibold tracking-tight text-lg">
                  Event Date
                </h3>
                <p className="text-sm text-muted-foreground">Oct 15-17, 2023</p>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 pb-3">
                <h3 className="font-semibold tracking-tight text-lg">
                  Location
                </h3>
                <p className="text-sm text-muted-foreground">
                  San Francisco, CA
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Application Details</h2>
              <div className="flex gap-2">
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded="false"
                  aria-controls="radix-:r24:"
                  data-state="closed"
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
                    className="lucide lucide-save mr-2 h-4 w-4"
                  >
                    <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z">
                      {" "}
                    </path>{" "}
                    <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"> </path>{" "}
                    <path d="M7 3v4a1 1 0 0 0 1 1h7"> </path>
                  </svg>
                  Save Response
                </button>
              </div>
            </div>
            <form className="space-y-6">
              <form className="space-y-2">
                <label htmlFor=":r27:-form-item">Project Description</label>
                <textarea
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-32"
                  placeholder="Tell us about your startup or project..."
                  name="projectDescription"
                  id=":r27:-form-item"
                  aria-describedby=":r27:-form-item-description"
                  aria-invalid="false"
                />

                <p
                  id=":r27:-form-item-description"
                  className="text-sm text-muted-foreground"
                >
                  Briefly describe your startup, what problem you're solving,
                  and why you're a good fit for this event.
                </p>

                <div className="space-y-2">
                  <div className="mb-4">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor=":r28:-form-item"
                    >
                      Select Project Folders or Individual Files
                    </label>
                    <p
                      id=":r28:-form-item-description"
                      className="text-sm text-muted-foreground"
                    >
                      Choose relevant folders or documents to include with your
                      application.
                    </p>
                  </div>

                  <div className="border rounded-lg">
                    <div
                      role="tablist"
                      className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full border-b"
                      tabIndex={0}
                      style={{ outline: "none" }}
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected="true"
                        aria-controls="radix-:r29:-content-folders"
                        data-state="active"
                        id="radix-:r29:-trigger-folders"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                        tabIndex={-1}
                      >
                        Project Folders
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected="false"
                        aria-controls="radix-:r29:-content-documents"
                        data-state="inactive"
                        id="radix-:r29:-trigger-documents"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                        tabIndex={-1}
                      >
                        Documents
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected="false"
                        aria-controls="radix-:r29:-content-media"
                        data-state="inactive"
                        id="radix-:r29:-trigger-media"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                        tabIndex={-1}
                      >
                        Media
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected="false"
                        aria-controls="radix-:r29:-content-data"
                        data-state="inactive"
                        id="radix-:r29:-trigger-data"
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm flex-1"
                        tabIndex={-1}
                      >
                        Data
                      </button>
                    </div>

                    <div
                      data-state="active"
                      data-orientation="horizontal"
                      role="tabpanel"
                      aria-labelledby="radix-:r29:-trigger-folders"
                      id="radix-:r29:-content-folders"
                      tabIndex={0}
                      className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-4"
                    >
                      {/* Tabs content goes here */}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border rounded-md">
                    <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked="false"
                          data-state="unchecked"
                          value="on"
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mr-2"
                          id=":r28:-form-item"
                          aria-describedby=":r28:-form-item-description"
                          aria-invalid="false"
                        ></button>
                        <input
                          type="checkbox"
                          aria-hidden="true"
                          tabIndex={-1}
                          value="on"
                        />
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
                          className="lucide lucide-folder h-4 w-4 text-blue-500 mr-1"
                        >
                          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                        </svg>
                        <span className="font-medium text-sm">
                          Social Media App
                        </span>
                      </div>
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0">
                        +
                      </button>
                    </div>
                  </div>
                  <div className="border rounded-md">
                    <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked="false"
                          data-state="unchecked"
                          value="on"
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mr-2"
                          id=":r28:-form-item"
                          aria-describedby=":r28:-form-item-description"
                          aria-invalid="false"
                        ></button>
                        <input type="checkbox" aria-hidden="true" value="on" />
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
                          className="lucide lucide-folder h-4 w-4 text-blue-500 mr-1"
                        >
                          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                        </svg>
                        <span className="font-medium text-sm">
                          E-commerce Platform
                        </span>
                      </div>
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0">
                        +{" "}
                      </button>
                    </div>
                  </div>
                  <div className="border rounded-md">
                    <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked="false"
                          data-state="unchecked"
                          value="on"
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mr-2"
                          id=":r28:-form-item"
                          aria-describedby=":r28:-form-item-description"
                          aria-invalid="false"
                        ></button>
                        <input type="checkbox" aria-hidden="true" value="on" />
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
                          className="lucide lucide-folder h-4 w-4 text-blue-500 mr-1"
                        >
                          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                        </svg>
                        <span className="font-medium text-sm">
                          Health Tech Solution
                        </span>
                      </div>
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0">
                        +{" "}
                      </button>
                    </div>
                  </div>
                  <div className="border rounded-md">
                    <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked="false"
                          data-state="unchecked"
                          value="on"
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mr-2"
                          id=":r28:-form-item"
                          aria-describedby=":r28:-form-item-description"
                          aria-invalid="false"
                        ></button>
                        <input type="checkbox" aria-hidden="true" value="on" />
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
                          className="lucide lucide-folder h-4 w-4 text-blue-500 mr-1"
                        >
                          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                        </svg>
                        <span className="font-medium text-sm">
                          AI-Powered Education Platform{" "}
                        </span>
                      </div>
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0">
                        +
                      </button>
                    </div>
                  </div>
                  <div className="border rounded-md">
                    <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked="false"
                          data-state="unchecked"
                          value="on"
                          className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground mr-2"
                          id=":r28:-form-item"
                          aria-describedby=":r28:-form-item-description"
                          aria-invalid="false"
                        ></button>
                        <input type="checkbox" aria-hidden="true" value="on" />
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
                          className="lucide lucide-folder h-4 w-4 text-blue-500 mr-1"
                        >
                          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                        </svg>
                        <span className="font-medium text-sm">
                          Sustainable Fashion Marketplace{" "}
                        </span>
                      </div>
                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground rounded-md h-8 w-8 p-0">
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  data-state="inactive"
                  data-orientation="horizontal"
                  role="tabpanel"
                  aria-labelledby="radix-:r29:-trigger-documents"
                  id="radix-:r29:-content-documents"
                  tabIndex={0}
                  className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-4"
                ></div>
                <div
                  data-state="inactive"
                  data-orientation="horizontal"
                  role="tabpanel"
                  aria-labelledby="radix-:r29:-trigger-media"
                  id="radix-:r29:-content-media"
                  tabIndex={0}
                  className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-4"
                ></div>
                <div
                  data-state="inactive"
                  data-orientation="horizontal"
                  role="tabpanel"
                  aria-labelledby="radix-:r29:-trigger-data"
                  id="radix-:r29:-content-data"
                  tabIndex={0}
                  className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-4"
                ></div>
              </form>
            </form>
            <div className="mt-2 text-xs text-muted-foreground">
              Don't see the files you need?
              <a href="/dashboard/vault" className="text-primary underline">
                Upload to your vault
              </a>{" "}
              first.
            </div>
          </div>
          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <button
              type="button"
              role="checkbox"
              value="on"
              className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              id=":r2e:-form-item"
            ></button>
            <input
              type="checkbox"
              aria-hidden="true"
              tabIndex={-1}
              value="on"
            />
            <div className="space-y-1 leading-none">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor=":r2e:-form-item"
              >
                I accept the terms and conditions
              </label>
              <p
                id=":r2e:-form-item-description"
                className="text-sm text-muted-foreground"
              >
                I agree to share my application materials with the event
                organizers and judges.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              type="button"
            >
              Cancel
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              type="submit"
            >
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyInEvent;
