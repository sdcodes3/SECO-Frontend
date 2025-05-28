import { InviteTeamModal } from "@/components/InviteModal";
import API_CONSTANTS from "@/utils/apiConstants";
import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";
const formatDate = (dateString: string) => {
  return new Date(dateString).toISOString().split("T")[0];
};
const Account = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isOpen, setIsOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teams, setTeams] = useState<any[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const handleInviteClick = (teamId: string) => {
    setSelectedTeamId(teamId);
  };
  const handleSendInvite = async (
    teamId: string,
    role: string,
    email: string
  ) => {
    try {
      const response = await axiosInstance.post(
        API_CONSTANTS.INVITE_TEAM(teamId),
        {
          email,
          role
        }
      );
      console.log(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    const getTeams = async () => {
      const response = await axiosInstance.get(API_CONSTANTS.GET_TEAMS);
      setTeams(response.data.teams);
      setPendingInvites(response.data.pendingInvitations);
    };
    getTeams();
  }, []);
  const handleCreateTeam = async () => {
    if (teamName.trim()) {
      console.log("Team Created:", teamName);
      setTeamName("");
      closeModal();
    }
    try {
      const response = await axiosInstance.post(API_CONSTANTS.CREATE_TEAM, {
        name: teamName
      });
      setTeams([...teams, response.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const tabs = ["Profile", "Security", "Notifications", "Team"];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Account</h1>
            <p className="text-muted-foreground">
              Manage your profile and preferences.
            </p>
          </div>

          <div dir="ltr" data-orientation="horizontal" className="w-full">
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground mb-8"
              tabIndex={0}
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab ? "true" : "false"}
                  data-state={activeTab === tab ? "active" : "inactive"}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  tabIndex={0}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Profile" && (
              <div className="space-y-8">
                {/* Edit Profile */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">
                      Edit Profile
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Update your profile information here.
                    </p>
                  </div>
                  <div className="p-6 pt-0">
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="full_name"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value="Founder User"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="avatar_url"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Avatar URL
                          </label>
                          <input
                            type="url"
                            id="avatar_url"
                            name="avatar_url"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="website"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Website
                          </label>
                          <input
                            type="url"
                            id="website"
                            name="website"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="location"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Location
                          </label>
                          <input
                            type="text"
                            id="location"
                            name="location"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="company"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Company Name
                        </label>
                        <input
                          type="text"
                          id="company"
                          name="company"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="bio"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Company Description
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="founded_date"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Founded Date
                          </label>
                          <input
                            type="date"
                            id="founded_date"
                            name="founded_date"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="industry"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Industry
                          </label>
                          <input
                            type="text"
                            id="industry"
                            name="industry"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          />
                        </div>
                      </div>

                      <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                        Save Profile
                      </button>
                    </form>
                  </div>
                </div>

                {/* Profile Info Display */}
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">
                      Profile Information
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      View your profile details.
                    </p>
                  </div>
                  <div className="p-6 pt-0 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        ["Full Name", "Founder User"],
                        ["Avatar URL", "N/A"],
                        ["Website", "N/A"],
                        ["Company Name", "N/A"],
                        ["Company Description", "N/A"],
                        ["Founded Date", "N/A"],
                        ["Industry", "N/A"],
                        ["Location", "N/A"]
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="text-sm font-medium">{label}</p>
                          <p>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Security Settings
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your password and security preferences.
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="current_password"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        id="current_password"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="new_password"
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          id="new_password"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="confirm_password"
                        >
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          id="confirm_password"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      type="submit"
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Manage how and when you receive notifications.
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <form className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Email Notifications</h3>
                          <p className="text-sm text-muted-foreground">
                            Receive email notifications for important updates.
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked="true"
                          data-state="checked"
                          value="on"
                          className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
                        >
                          <span
                            data-state="checked"
                            className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
                          ></span>
                        </button>
                        <input
                          type="checkbox"
                          aria-hidden="true"
                          tabIndex={-1}
                          value="on"
                          className="hidden-input"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">
                            New Event Notifications
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Get notified when new events are created in your
                            network.
                          </p>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked="true"
                          data-state="checked"
                          value="on"
                          className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
                        >
                          <span
                            data-state="checked"
                            className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
                          ></span>
                        </button>
                        <input
                          type="checkbox"
                          aria-hidden="true"
                          tabIndex={-1}
                          value="on"
                          checked
                          className="hidden-input"
                        />
                      </div>
                    </div>
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                      type="submit"
                    >
                      Save Preferences
                    </button>
                  </form>
                </div>
              </div>
            )}
            {activeTab === "Team" && (
              <div
                data-state="active"
                data-orientation="horizontal"
                role="tabpanel"
                aria-labelledby="radix-:rh:-trigger-team"
                id="radix-:rh:-content-team"
                tabIndex={0}
                className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="space-y-6">
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="space-y-1.5 p-6 flex flex-row items-center justify-between pb-2">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight">
                          Team Management
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Manage your team members and their access
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                          onClick={openModal}
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
                            className="lucide lucide-plus mr-2 h-4 w-4"
                          >
                            <path d="M5 12h14"></path>
                            <path d="M12 5v14"></path>
                          </svg>
                          Create Team
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
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
                            className="lucide lucide-user-plus mr-2 h-4 w-4"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <line x1="19" x2="19" y1="8" y2="14"></line>
                            <line x1="22" x2="16" y1="11" y2="11"></line>
                          </svg>
                          Invite Members
                        </button>
                      </div>
                    </div>
                    <div className="p-6 pt-0 space-y-6">
                      {teams.map((team) => (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
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
                                className="lucide lucide-users h-5 w-5"
                              >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                              <h3 className="text-lg font-semibold">
                                {team.name}
                              </h3>
                              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                                {team.members.length} members
                              </div>
                            </div>
                            <button
                              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                              onClick={() => handleInviteClick(team.id)}
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
                                className="lucide lucide-user-plus mr-2 h-4 w-4"
                              >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <line x1="19" x2="19" y1="8" y2="14"></line>
                                <line x1="22" x2="16" y1="11" y2="11"></line>
                              </svg>{" "}
                              Invite
                            </button>
                          </div>
                          <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                              <thead className="[_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    User
                                  </th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                                    Email
                                  </th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                                    Role
                                  </th>
                                  <th className="h-12 px-4 align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0 text-right">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="[_tr:last-child]:border-0">
                                {team.members.map((member: any) => (
                                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle [:has([role=checkbox])]:pr-0">
                                      <div className="flex items-center gap-3">
                                        <span className="relative flex shrink-0 overflow-hidden rounded-full h-8 w-8">
                                          <img
                                            className="aspect-square h-full w-full"
                                            src="https://i.pravatar.cc/150?img=1"
                                          />
                                        </span>
                                        <span>{member.name}</span>
                                      </div>
                                    </td>
                                    <td className="p-4 align-middle [:has([role=checkbox])]:pr-0">
                                      {member.email}
                                    </td>
                                    <td className="p-4 align-middle [:has([role=checkbox])]:pr-0">
                                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                                        {member.role}
                                      </div>
                                    </td>
                                    <td className="p-4 align-middle [:has([role=checkbox])]:pr-0 text-right"></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                      <div className="border rounded-lg p-4 mt-6">
                        <h3 className="font-medium mb-3">
                          Pending Invitations
                        </h3>
                        <div className="relative w-full overflow-auto">
                          <table className="w-full caption-bottom text-sm">
                            <thead className="[_tr]:border-b">
                              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                                  Email
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                                  Team
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                                  Role
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0">
                                  Expires
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground [:has([role=checkbox])]:pr-0 text-right">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="[_tr:last-child]:border-0">
                              {pendingInvites.length > 0 &&
                                pendingInvites.map((invitation: any) => (
                                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <td className="p-4 align-middle [:has([role=checkbox])]:pr-0 flex items-center gap-2">
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
                                        className="lucide lucide-mail h-4 w-4 text-muted-foreground"
                                      >
                                        <rect
                                          width="20"
                                          height="16"
                                          x="2"
                                          y="4"
                                          rx="2"
                                        ></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                      </svg>
                                      {invitation.email}
                                    </td>
                                    <td className="p-4 align-middle [:has([role=checkbox])]:pr-0">
                                      {invitation.team_id}
                                    </td>
                                    <td className="p-4 align-middle [:has([role=checkbox])]:pr-0">
                                      <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                                        {invitation.role}
                                      </div>
                                    </td>
                                    <td className="p-4 align-middle [:has([role=checkbox])]:pr-0 flex items-center gap-1">
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
                                        className="lucide lucide-clock h-3 w-3 text-muted-foreground"
                                      >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                      </svg>
                                      <span className="text-sm">
                                        {formatDate(invitation.expires_at)}
                                      </span>
                                    </td>
                                    <td className="p-4 align-middle [:has([role=checkbox])]:pr-0 text-right">
                                      <div className="flex justify-end gap-2">
                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                                          Resend
                                        </button>
                                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [_svg]:pointer-events-none [_svg]:size-4 [_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-red-600">
                                          Cancel
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ×
            </button>

            <h2 className="text-xl font-semibold mb-2">Create New Team</h2>
            <p className="text-gray-500 mb-4">
              Create a new team to collaborate with others.
            </p>

            <label
              htmlFor="teamName"
              className="block text-sm font-medium mb-1"
            >
              Team Name
            </label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedTeamId && (
        <InviteTeamModal
          teamId={selectedTeamId}
          teams={teams}
          onClose={() => setSelectedTeamId(null)}
          onSendInvite={handleSendInvite}
        />
      )}
    </div>
  );
};

export default Account;
