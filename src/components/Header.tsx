import { useState, useEffect } from "react";
import Logo from "../assets/seco logo.png";
import { useNavigate } from "react-router-dom";
import useUser from "@/hooks/useUser";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      // Apply the effect when scrolled more than 10px
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Check if user is logged in from localStorage
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    };
    checkAuth();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "user") {
        setIsLoggedIn(!!e.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSignIn = () => {
    navigate("/auth");
  };

  const handleSignUp = () => {
    navigate("/auth");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    updateUser(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-40 py-4 px-6 transition-all duration-300 w-full h-20 ${
        isScrolled ? "glass shadow-sm backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto p">
        <div className="flex items-center justify-between">
          <a className="flex items-center" href="/">
            {/* <span className="text-2xl font-bold text-gradient">Seco</span>
            <span className="ml-1 text-2xl font-medium">Discover</span> */}
            <img src={Logo} alt="logo" width={32} className="w-20" />
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              className={`hover:text-foreground transition-all duration-200 relative py-2 flex items-center font-medium after:absolute after:bottom-0 after:bg-primary after:left-0 after:w-full after:h-0.5 ${
                window.location.pathname === "/" ? "text-primary" : ""
              }`}
              href="/"
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
                className="lucide lucide-house h-4 w-4 mr-2"
              >
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              Home
            </a>
            <a
              className={`hover:text-foreground transition-all duration-200 relative py-2 flex items-center font-medium after:absolute after:bottom-0 after:bg-primary after:left-0 after:w-full after:h-0.5 ${
                window.location.pathname === "/events" ? "text-primary" : ""
              }`}
              href="/events"
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
                className="lucide lucide-calendar h-4 w-4 mr-2"
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              Events
            </a>
            {isLoggedIn && (
              <>
                <a
                  className={`hover:text-foreground transition-all duration-200 relative py-2 flex items-center font-medium after:absolute after:bottom-0 after:bg-primary after:left-0 after:w-full after:h-0.5 ${
                    window.location.pathname === "/dashboard"
                      ? "text-primary"
                      : ""
                  }`}
                  href="/dashboard"
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
                    className="lucide lucide-layout-dashboard h-4 w-4 mr-2"
                  >
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                  </svg>
                  Dashboard
                </a>
              </>
            )}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  onClick={handleSignIn}
                >
                  Sign In
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  onClick={handleSignUp}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  className="inline-flex items-center justify-center rounded-full w-10 h-10 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
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
                    className="lucide lucide-user h-5 w-5"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Profile
                      </a>
                      <a
                        href="/my-events"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        My Events
                      </a>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
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
            >
              <path d="M4 12h16M4 6h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="fixed inset-x-0 top-[72px] bg-background/90 backdrop-blur-lg shadow-lg md:hidden transition-all duration-300 ease-in-out transform -translate-y-full opacity-0">
        <div className="container mx-auto py-4 px-6">
          <nav className="flex flex-col space-y-4">
            <a
              className="py-2 px-4 rounded-md transition-colors flex items-center bg-primary/10 text-primary"
              href="/"
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
                className="lucide lucide-house h-4 w-4 mr-2"
              >
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              Home
            </a>
            <a
              className="py-2 px-4 rounded-md transition-colors flex items-center hover:bg-secondary"
              href="/events"
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
                className="lucide lucide-calendar h-4 w-4 mr-2"
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              Events
            </a>
            <div className="flex flex-col space-y-2 pt-2">
              <button
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-center"
                onClick={handleSignIn}
              >
                Sign In
              </button>
              <button
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full justify-center"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
