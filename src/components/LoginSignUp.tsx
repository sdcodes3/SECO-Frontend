import { useState } from "react";
import Logo from "../assets/seco logo.png";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";



const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const LoginSignUp = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: ""
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOAuthLogin = async (provider: "google" | "linkedin_oidc") => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: import.meta.env.CURRENT_ENVIRONMENT == "DEVELOPMENT" ? import.meta.env.VITE_FRONTEND_DEVELOPMENT_URI : import.meta.env.VITE_FRONTEND_PRODUCTION_URI + "/dashboard",
        },
      });

    } catch(error) {
      console.error("OAuth login error:", error);
      alert("Login failed");
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = activeTab === "login" ? "/login" : "/signup";
      const response = await fetch(
        `http://localhost:3000/api/auth${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(
            activeTab === "login"
              ? {
                  email: formData.email,
                  password: formData.password
                }
              : {
                  name: formData.fullName,
                  email: formData.email,
                  password: formData.password,
                  role: formData.userType.toLowerCase()
                }
          )
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Authentication failed");
      }

      const data = await response.json();

      // Store the token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Authentication error:", error);
      alert(error.message || "Authentication failed. Please try again.");
    }
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
                <div className="space-y-2">
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Sign In
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin("google")}
                  className="inline-flex items-center justify-center gap-2 w-full h-10 px-4 py-2 text-sm font-medium rounded-md bg-white border hover:bg-gray-100 text-black"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google logo"
                    className="w-5 h-5"
                  />
                  Sign in with Google
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin("linkedin_oidc")}
                  className="inline-flex items-center justify-center gap-2 w-full h-10 px-4 py-2 text-sm font-medium rounded-md bg-[#0077B5] text-white hover:bg-[#0077B5]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Sign in with LinkedIn
                </button>
              </div>
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
