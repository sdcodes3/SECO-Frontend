import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      if (!user) {
        navigate('/auth');
      }
    };
    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      // @ts-ignore
      if (e.key !== "user") {
        navigate('/auth');
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${isSidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0"
          } overflow-hidden`}
      >
        <div className={`${isSidebarOpen ? "block" : "hidden"}`}>
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header with Toggle Button */}
        <header className="bg-white border-b p-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-7 w-7"
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
              className={`icon icon-tabler icons-tabler-outline icon-tabler-layout-sidebar-left-expand transition-transform duration-300 ${isSidebarOpen ? "rotate-180" : ""
                }`}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
              <path d="M9 4v16" />
              <path d="M14 10l2 2l-2 2" />
            </svg>
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
