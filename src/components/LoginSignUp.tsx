import { useState } from "react";
import Logo from "../assets/seco logo.png";

const LoginSignUp = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: ""
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTabChange = (tab: "login" | "signup") => {
    setActiveTab(tab);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication logic with Supabase
    console.log("Form submitted:", formData);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleUserTypeSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      userType: value
    }));
    setIsDropdownOpen(false);
  };

  return (
    <div className="container mx-auto py-24 px-4 flex items-center justify-center min-h-screen">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md">
        <div className="flex flex-col space-y-1.5 p-6 text-center">
          <h3 className="tracking-tight text-2xl font-bold text-gradient self-center">
            <img src={Logo} alt="logo" width={32} className="w-20" />
          </h3>
          <p className="text-sm text-muted-foreground">
            {activeTab === "login"
              ? "Sign in to your account to continue"
              : "Create an account to get started"}
          </p>
        </div>

        <div className="p-6 pt-0">
          <div dir="ltr" data-orientation="horizontal">
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-2 mb-6"
              tabIndex={0}
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "login"}
                aria-controls="tab-content-login"
                data-state={activeTab === "login" ? "active" : "inactive"}
                id="tab-trigger-login"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  activeTab === "login"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => handleTabChange("login")}
                tabIndex={activeTab === "login" ? 0 : -1}
              >
                Login
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === "signup"}
                aria-controls="tab-content-signup"
                data-state={activeTab === "signup" ? "active" : "inactive"}
                id="tab-trigger-signup"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                  activeTab === "signup"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => handleTabChange("signup")}
                tabIndex={activeTab === "signup" ? 0 : -1}
              >
                Sign Up
              </button>
            </div>

            <div
              data-state={activeTab === "login" ? "active" : "inactive"}
              role="tabpanel"
              aria-labelledby="tab-trigger-login"
              id="tab-content-login"
              tabIndex={0}
              className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              hidden={activeTab !== "login"}
            >
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="login-email">
                    Email
                  </label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-base bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                    value={formData.email}
                    onChange={handleInputChange}
                    aria-invalid="false"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="login-password"
                  >
                    Password
                  </label>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-base bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                    value={formData.password}
                    onChange={handleInputChange}
                    aria-invalid="false"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 w-full h-10 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center mb-4">
                  <svg
                    className="lucide lucide-info h-5 w-5 text-blue-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                  <h3 className="text-sm font-medium">
                    Test Accounts (for demo)
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 justify-start text-xs"
                  >
                    Login as Startup
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 justify-start text-xs"
                  >
                    Login as Individual Founder
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 justify-start text-xs"
                  >
                    Login as Investor
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 justify-start text-xs"
                  >
                    Login as Incubator
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 justify-start text-xs"
                  >
                    Login as Accelerator
                  </button>
                </div>

                <div className="text-xs text-muted-foreground mb-2">
                  <p>
                    All test accounts use password:
                    <span className="font-mono"> password123</span>
                  </p>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 w-full text-xs"
                >
                  Create Test Users
                </button>
              </div>
            </div>

            <div
              data-state={activeTab === "signup" ? "active" : "inactive"}
              role="tabpanel"
              aria-labelledby="tab-trigger-signup"
              id="tab-content-signup"
              tabIndex={0}
              className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              hidden={activeTab !== "signup"}
            >
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="signup-fullname"
                  >
                    Full Name
                  </label>
                  <input
                    id="signup-fullname"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-base bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    aria-invalid="false"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="signup-email">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-base bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                    value={formData.email}
                    onChange={handleInputChange}
                    aria-invalid="false"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="signup-password"
                  >
                    Password
                  </label>
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-base bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm"
                    value={formData.password}
                    onChange={handleInputChange}
                    aria-invalid="false"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="signup-usertype"
                  >
                    I am a
                  </label>
                  <button
                    type="button"
                    role="combobox"
                    aria-controls="user-type-dropdown"
                    aria-expanded={isDropdownOpen}
                    aria-autocomplete="none"
                    dir="ltr"
                    data-state={isDropdownOpen ? "open" : "closed"}
                    data-placeholder=""
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                    onClick={toggleDropdown}
                  >
                    <span className="pointer-events-none">
                      {formData.userType || "Select user type"}
                    </span>
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
                      className={`lucide lucide-chevron-down h-4 w-4 opacity-50 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6"></path>
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute z-50 mt-1 bg-popover text-popover-foreground rounded-md border shadow-md bg-white">
                      <div className="p-1">
                        <button
                          type="button"
                          className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleUserTypeSelect("Startup")}
                        >
                          Startup
                        </button>
                        <button
                          type="button"
                          className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() =>
                            handleUserTypeSelect("Individual Founder")
                          }
                        >
                          Individual Founder
                        </button>
                        <button
                          type="button"
                          className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleUserTypeSelect("Investor")}
                        >
                          Investor
                        </button>
                        <button
                          type="button"
                          className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleUserTypeSelect("Incubator")}
                        >
                          Incubator
                        </button>
                        <button
                          type="button"
                          className="w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleUserTypeSelect("Accelerator")}
                        >
                          Accelerator
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 w-full h-10 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="items-center p-6 pt-0 flex flex-col text-center text-xs text-muted-foreground">
          <p className="mb-2">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p>For testing purposes, email verification has been disabled.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
