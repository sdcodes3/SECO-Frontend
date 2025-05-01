import { useState, useEffect } from "react";
import Logo from "../assets/seco logo.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

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

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignIn = () => {
    navigate("/auth");
  };

  const handleSignUp = () => {
    navigate("/auth");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 py-4 px-6 transition-all duration-300 w-full ${
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
              className="hover:text-foreground transition-all duration-200 relative py-2 flex items-center text-primary font-medium after:absolute after:bottom-0 after:bg-primary after:left-0 after:w-full after:h-0.5"
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
              className="text-foreground/80 hover:text-foreground transition-all duration-200 relative py-2 flex items-center"
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
          </nav>
          <div className="hidden md:flex items-center space-x-4">
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
