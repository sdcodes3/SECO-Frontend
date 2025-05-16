import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import API_CONSTANTS from "../utils/apiConstants";

interface Project {
  id: string;
  name: string;
  created_at: string;
  sub_projects: Project[];
  website?: string;
  linkedin?: string;
  twitter?: string;
  store_link?: string;
}

type ProjectData = Omit<Project, "sub_projects">;

interface ProjectProps extends ProjectData {
  onEdit: (project: ProjectData) => void;
  onClick: () => void;
}

const Project = ({ onEdit, onClick, ...project }: ProjectProps) => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 flex items-center gap-3"
        onClick={onClick}
      >
        <div className="bg-blue-100 p-2 rounded">
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
            className="lucide lucide-folder h-6 w-6 text-blue-600"
          >
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{project.name}</h3>
          <p className="text-xs text-gray-500">
            Created on {project.created_at}
          </p>
        </div>
      </div>
      <div className="border-t px-4 py-2 flex justify-end gap-2">
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
          Details
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(project);
          }}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

const Vault = () => {
  const navigate = useNavigate();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null
  );
  const [project, setProject] = useState<Project | null>(null);
  const [pathHistory, setPathHistory] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    linkedin: "",
    twitter: "",
    store_link: ""
  });
  const [loading, setLoading] = useState(false);

  const getProjects = async () => {
    try {
      const response = await axiosInstance.get(API_CONSTANTS.GET_ROOT_PROJECTS);
      setProject(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const getProjectDetails = async (projectId: string) => {
    try {
      const response = await axiosInstance.get(
        API_CONSTANTS.GET_PROJECT_BY_ID(projectId)
      );

      if (response.data) {
        const newProject = response.data.data[0];
        setProject(newProject);
        setPathHistory((prev) => [...prev, newProject]);
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const handleProjectClick = async (projectId: string) => {
    await getProjectDetails(projectId);
  };

  const handlePathClick = async (index: number) => {
    if (index === pathHistory.length - 1) return;

    const newPathHistory = pathHistory.slice(0, index + 1);
    setPathHistory(newPathHistory);
    setProject(newPathHistory[newPathHistory.length - 1]);
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/auth");
      return;
    }
    getProjects();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(API_CONSTANTS.CREATE_PROJECT, {
        ...formData,
        parent_id: project?.id || null
      });

      if (response.data) {
        setIsNewProjectModalOpen(false);
        setFormData({
          name: "",
          website: "",
          linkedin: "",
          twitter: "",
          store_link: ""
        });
        // Refresh projects list
        getProjects();
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (project: ProjectData) => {
    const response = await axiosInstance.get(
      API_CONSTANTS.GET_PROJECT_DETAILS(project.id)
    );

    if (response.data) {
      // Refresh projects list
      setSelectedProject(response.data.data);
      setFormData({
        name: response.data.data.name || "",
        website: response.data.data.website || "",
        linkedin: response.data.data.linkedin || "",
        twitter: response.data.data.twitter || "",
        store_link: response.data.data.store_link || ""
      });
      setIsEditModalOpen(true);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setLoading(true);
    try {
      const response = await axiosInstance.put(
        API_CONSTANTS.EDIT_PROJECT(selectedProject.id),
        {
          ...formData,
          parent_id: project?.id || null
        }
      );

      if (response.data) {
        setIsEditModalOpen(false);
        setFormData({
          name: "",
          website: "",
          linkedin: "",
          twitter: "",
          store_link: ""
        });
        // Refresh projects list
        getProjects();
      }
    } catch (error) {
      console.error("Error updating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-4">
          <a
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            href="/"
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
              className="lucide lucide-house h-4 w-4 mr-2"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            </svg>
            Home
          </a>
        </div>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Document Vault
              </h1>
              <p className="text-muted-foreground">
                Store and manage pitch decks, videos, and other documents for
                your projects.
              </p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
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
                  className="lucide lucide-folder mr-2 h-4 w-4"
                >
                  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                </svg>{" "}
                New Project
              </button>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="mr-2 h-4 w-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>{" "}
                Upload File
              </button>
            </div>
          </div>
          <div className="flex items-center overflow-x-auto py-2 mb-4 text-sm">
            <button
              onClick={() => {
                setPathHistory([]);
                getProjects();
              }}
              className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:text-accent-foreground h-10 flex items-center px-2 py-1 hover:bg-gray-100"
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
                className="lucide lucide-folder h-4 w-4 mr-1"
              >
                <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
              </svg>
              Root
            </button>
            {pathHistory.map((item, index) => (
              <div key={item.id} className="flex items-center">
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
                  className="lucide lucide-chevron-right h-4 w-4 mx-2 text-gray-400"
                >
                  <path d="m9 18 6-6-6-6"></path>
                </svg>
                <button
                  onClick={() => handlePathClick(index)}
                  className={`justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:text-accent-foreground h-10 flex items-center px-2 py-1 hover:bg-gray-100 ${
                    index === pathHistory.length - 1 ? "text-blue-600" : ""
                  }`}
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
                    className="lucide lucide-folder h-4 w-4 mr-1"
                  >
                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
                  </svg>
                  {item.name}
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project?.sub_projects?.map((subProject) => (
              <Project
                key={subProject.id}
                {...subProject}
                onEdit={handleEditClick}
                onClick={() => handleProjectClick(subProject.id)}
              />
            ))}
          </div>
          <div
            dir="ltr"
            data-orientation="horizontal"
            className="bg-white rounded-lg border shadow-sm overflow-hidden"
          >
            <div className="p-4 bg-gray-50 border-b">
              <div
                role="tablist"
                aria-orientation="horizontal"
                className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
                tabIndex={0}
                data-orientation="horizontal"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected="true"
                  aria-controls="radix-:rj:-content-all"
                  data-state="active"
                  id="radix-:rj:-trigger-all"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  tabIndex={-1}
                  data-orientation="horizontal"
                  data-radix-collection-item=""
                >
                  All Files
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected="false"
                  aria-controls="radix-:rj:-content-pdf"
                  data-state="inactive"
                  id="radix-:rj:-trigger-pdf"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  tabIndex={-1}
                  data-orientation="horizontal"
                  data-radix-collection-item=""
                >
                  PDFs
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected="false"
                  aria-controls="radix-:rj:-content-excel"
                  data-state="inactive"
                  id="radix-:rj:-trigger-excel"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  tabIndex={-1}
                  data-orientation="horizontal"
                  data-radix-collection-item=""
                >
                  Spreadsheets
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected="false"
                  aria-controls="radix-:rj:-content-presentation"
                  data-state="inactive"
                  id="radix-:rj:-trigger-presentation"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  tabIndex={-1}
                  data-orientation="horizontal"
                  data-radix-collection-item=""
                >
                  Presentations
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected="false"
                  aria-controls="radix-:rj:-content-document"
                  data-state="inactive"
                  id="radix-:rj:-trigger-document"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  tabIndex={-1}
                  data-orientation="horizontal"
                  data-radix-collection-item=""
                >
                  Documents
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected="false"
                  aria-controls="radix-:rj:-content-media"
                  data-state="inactive"
                  id="radix-:rj:-trigger-media"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  tabIndex={-1}
                  data-orientation="horizontal"
                  data-radix-collection-item=""
                >
                  Media
                </button>
              </div>
            </div>
            <div
              data-state="active"
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-:rj:-trigger-all"
              id="radix-:rj:-content-all"
              tabIndex={0}
              className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-0"
            >
              <div className="overflow-x-auto">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0 w-[400px]">
                          Name
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                          Type
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                          Size
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                          Date Added
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                          Tags
                        </th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="[_tr:last-child]:border-0">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td
                          className="p-4 align-middle [:has([role=checkbox])]:pr-0 text-center py-8"
                          colSpan={6}
                        >
                          <div className="text-muted-foreground">
                            No files found
                          </div>
                          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="mr-2 h-4 w-4"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              ></path>
                            </svg>{" "}
                            Upload Files
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div
              data-state="inactive"
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-:rj:-trigger-pdf"
              id="radix-:rj:-content-pdf"
              tabIndex={0}
              className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-0"
            ></div>
            <div
              data-state="inactive"
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-:rj:-trigger-excel"
              id="radix-:rj:-content-excel"
              tabIndex={0}
              className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-0"
            ></div>
            <div
              data-state="inactive"
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-:rj:-trigger-presentation"
              id="radix-:rj:-content-presentation"
              tabIndex={0}
              className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-0"
            ></div>
            <div
              data-state="inactive"
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-:rj:-trigger-document"
              id="radix-:rj:-content-document"
              tabIndex={0}
              className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-0"
            ></div>
            <div
              data-state="inactive"
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-:rj:-trigger-media"
              id="radix-:rj:-content-media"
              tabIndex={0}
              className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-0"
            ></div>
          </div>
        </div>
      </div>

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div
              role="dialog"
              id="radix-:r0:"
              aria-describedby="radix-:r2:"
              aria-labelledby="radix-:r1:"
              data-state="open"
              className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[425px]"
              tabIndex={-1}
              style={{ pointerEvents: "auto" }}
            >
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2
                  id="radix-:r1:"
                  className="text-lg font-semibold leading-none tracking-tight"
                >
                  Create New Project
                </h2>
              </div>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor=":rg:-form-item"
                  >
                    Project Name
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Enter project name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor=":rh:-form-item"
                  >
                    Website
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
                      className="lucide lucide-globe w-4 h-4 mr-2 text-gray-500"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="https://example.com"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor=":ri:-form-item"
                  >
                    LinkedIn
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
                      className="lucide lucide-linkedin w-4 h-4 mr-2 text-gray-500"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="https://linkedin.com/company/..."
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor=":rj:-form-item"
                  >
                    Twitter
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
                      className="lucide lucide-twitter w-4 h-4 mr-2 text-gray-500"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="https://twitter.com/..."
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor=":rk:-form-item"
                  >
                    Store Link
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
                      className="lucide lucide-store w-4 h-4 mr-2 text-gray-500"
                    >
                      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                      <path d="M2 7h20"></path>
                      <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2 2 0 0 1-2-2V7"></path>
                    </svg>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="https://store.example.com"
                      name="store_link"
                      value={formData.store_link}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [;_svg]:pointer-events-none [;_svg]:size-4 [;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    type="button"
                    onClick={() => setIsNewProjectModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [;_svg]:pointer-events-none [;_svg]:size-4 [;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Project"}
                  </button>
                </div>
              </form>
              <button
                type="button"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                onClick={() => setIsNewProjectModalOpen(false)}
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
                  className="lucide lucide-x h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div
              role="dialog"
              className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg sm:max-w-[425px]"
              tabIndex={-1}
              style={{ pointerEvents: "auto" }}
            >
              <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                <h2 className="text-lg font-semibold leading-none tracking-tight">
                  Edit Project
                </h2>
              </div>
              <form className="space-y-4" onSubmit={handleEditSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Project Name
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Enter project name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Website
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
                      className="lucide lucide-globe w-4 h-4 mr-2 text-gray-500"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                      <path d="M2 12h20"></path>
                    </svg>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="https://example.com"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    LinkedIn
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
                      className="lucide lucide-linkedin w-4 h-4 mr-2 text-gray-500"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect width="4" height="12" x="2" y="9"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="https://linkedin.com/company/..."
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Twitter
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
                      className="lucide lucide-twitter w-4 h-4 mr-2 text-gray-500"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="https://twitter.com/..."
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Store Link
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
                      className="lucide lucide-store w-4 h-4 mr-2 text-gray-500"
                    >
                      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                      <path d="M2 7h20"></path>
                      <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2 2 0 0 1-2-2V7"></path>
                    </svg>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      placeholder="https://store.example.com"
                      name="store_link"
                      value={formData.store_link}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [;_svg]:pointer-events-none [;_svg]:size-4 [;_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [;_svg]:pointer-events-none [;_svg]:size-4 [;_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    type="submit"
                    disabled={loading}
                    onClick={handleEditSubmit}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
              <button
                type="button"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                onClick={() => setIsEditModalOpen(false)}
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
                  className="lucide lucide-x h-4 w-4"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
                <span className="sr-only">Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Vault;
