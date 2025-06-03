import { useState } from "react";
import Header from "./../components/Header";

interface EvaluationCriteria {
  score: number;
  weight: number;
}

interface Evaluation {
  problemSolution: EvaluationCriteria;
  marketPotential: EvaluationCriteria;
  executionStrategy: EvaluationCriteria;
  teamCapability: EvaluationCriteria;
  overallImpression: EvaluationCriteria;
  [key: string]: EvaluationCriteria; // Allows accessing by dynamic key
}

const Judge = () => {
  // Mock data - in a real app, these would come from an API/backend
  const [totalApplications] = useState(3);
  const [pendingReviews] = useState(2);
  const [reviewProgress] = useState(33); // percentage

  // Tab state
  const [activeTab, setActiveTab] = useState("pending");

  // Mock startup applications data
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: "EcoTech Solutions",
      founder: "Emily Chen",
      description:
        "A sustainable technology platform for reducing carbon emissions in industrial processes through AI optimization.",
      event: "TechStars Startup Weekend 2023",
      submittedDate: "2023-10-05",
      status: "pending",
      score: null,
      averageScore: 60.0,
      attachments: [
        "Pitch Deck.pdf",
        "Financial Projections.pdf",
        "Team Overview.pdf"
      ],
      evaluation: {
        problemSolution: { score: 3, weight: 25 },
        marketPotential: { score: 3, weight: 20 },
        executionStrategy: { score: 3, weight: 20 },
        teamCapability: { score: 3, weight: 20 },
        overallImpression: { score: 3, weight: 15 }
      }
    },
    {
      id: 2,
      name: "MediConnect",
      founder: "James Wilson",
      description:
        "Telemedicine platform connecting patients with specialists worldwide for remote consultations and follow-ups.",
      event: "TechStars Startup Weekend 2023",
      submittedDate: "2023-10-06",
      status: "pending",
      score: null,
      averageScore: 60.0,
      attachments: [
        "MediConnect Deck.pdf",
        "Market Analysis.pdf",
        "Product Demo.mp4"
      ],
      evaluation: {
        problemSolution: { score: 3, weight: 25 },
        marketPotential: { score: 3, weight: 20 },
        executionStrategy: { score: 3, weight: 20 },
        teamCapability: { score: 3, weight: 20 },
        overallImpression: { score: 3, weight: 15 }
      }
    },
    {
      id: 3,
      name: "LearnAI",
      founder: "Sarah Johnson",
      description:
        "AI-powered personalized learning platform for K-12 students, adapting to individual learning styles and pace.",
      event: "Google for Startups Accelerator",
      submittedDate: "2023-09-28",
      status: "reviewed",
      score: 87,
      feedback:
        "Strong product with clear market fit. Team has relevant experience. Would benefit from more traction metrics.",
      reviewedDate: "2023-12-05"
    }
  ]);

  // Function to update evaluation scores
  const updateEvaluation = (
    applicationId: number,
    criteriaKey: keyof Evaluation,
    newScore: number
  ): void => {
    setApplications((prevApplications) =>
      prevApplications.map((app) => {
        if (app.id === applicationId && app.evaluation) {
          // Create a new evaluation object with the updated score
          const updatedEvaluation = {
            ...app.evaluation,
            [criteriaKey]: {
              ...app.evaluation[criteriaKey as keyof typeof app.evaluation],
              score: newScore
            }
          } as Evaluation;

          // Calculate new average score based on weights and scores
          let totalWeightedScore = 0;
          let totalWeight = 0;

          Object.values(updatedEvaluation).forEach((criteria) => {
            if (
              criteria &&
              typeof criteria.score === "number" &&
              typeof criteria.weight === "number"
            ) {
              totalWeightedScore += criteria.score * criteria.weight;
              totalWeight += criteria.weight;
            }
          });

          const newAverageScore =
            totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

          // Return updated application
          return {
            ...app,
            evaluation: updatedEvaluation,
            averageScore: newAverageScore
          };
        }
        return app;
      })
    );
  };

  // Filter applications based on active tab
  const filteredApplications = applications.filter((app) => {
    if (activeTab === "pending") return app.status === "pending";
    if (activeTab === "reviewed") return app.status === "reviewed";
    return true; // 'all' tab
  });

  // Function to render application cards
  const renderApplicationCards = () => {
    if (activeTab === "all") {
      return (
        <div className="mt-4">
          <div className="rounded-lg border shadow-sm bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left">Startup</th>
                    <th className="px-4 py-3 text-left">Event</th>
                    <th className="px-4 py-3 text-left">Submitted</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{app.name}</div>
                        <div className="text-gray-500 text-xs">
                          {app.founder}
                        </div>
                      </td>
                      <td className="px-4 py-3">{app.event}</td>
                      <td className="px-4 py-3">{app.submittedDate}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            app.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3">{app.score || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4 space-y-6">
        {filteredApplications.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-lg border shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{app.name}</h2>
                  <p className="text-gray-500">Founder: {app.founder}</p>
                </div>
                {app.status === "reviewed" ? (
                  <div className="mt-2 lg:mt-0 text-right">
                    <div className="text-3xl font-bold">{app.score}</div>
                    <div className="text-gray-500 text-sm">Score</div>
                  </div>
                ) : (
                  <div className="mt-2 lg:mt-0 text-right">
                    <div className="text-3xl font-bold">
                      {app?.averageScore?.toFixed(1)}
                    </div>
                    <div className="text-gray-500 text-sm">Average Score</div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <h3 className="font-medium">Description</h3>
                <p className="text-gray-600 mt-1">{app.description}</p>
              </div>

              {app.status === "reviewed" && app.feedback && (
                <div className="mt-4">
                  <h3 className="font-medium">Your Feedback:</h3>
                  <p className="text-gray-600 mt-1">{app.feedback}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Reviewed: {app.reviewedDate}
                  </p>
                </div>
              )}

              {app.status === "pending" && (
                <>
                  <div className="mt-4">
                    <h3 className="font-medium">Attachments</h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {app?.attachments?.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 rounded border bg-gray-50"
                        >
                          <div className="mr-2 text-pink-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <span className="text-sm truncate">{attachment}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-4">Evaluation</h3>
                    <div className="space-y-4">
                      {app.evaluation &&
                        Object.entries(app.evaluation).map(([key, value]) => {
                          // Format the key from camelCase to Title Case with spaces
                          const formattedKey = key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase());

                          return (
                            <div key={key}>
                              <div className="flex justify-between mb-1">
                                <span>{formattedKey}</span>
                                <span className="text-gray-500">
                                  Weight: {value.weight}%
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <select
                                    className="appearance-none w-16 h-10 pl-3 pr-8 border border-gray-300 rounded-md bg-white text-base cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={value.score}
                                    onChange={(e) => {
                                      const newScore = parseInt(
                                        e.target.value,
                                        10
                                      );
                                      updateEvaluation(app.id, key, newScore);
                                    }}
                                  >
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                  </select>
                                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg
                                      className="w-4 h-4 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                      ></path>
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="bg-blue-600 h-full rounded-full"
                                    style={{
                                      width: `${(value.score / 5) * 100}%`
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Feedback & Comments</h3>
                    <textarea
                      className="w-full p-3 border rounded-md text-sm"
                      rows={4}
                      placeholder="Provide feedback for the startup team..."
                    ></textarea>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50">
                      Save Draft
                    </button>
                    <button className="px-4 py-2 rounded-md bg-blue-900 text-white hover:bg-blue-800">
                      Submit Review
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Judge Dashboard</h1>
          <p className="text-gray-600">
            Review and evaluate startup applications.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-gray-600 mb-1">Total Applications</h2>
            <div className="text-3xl font-bold">{totalApplications}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-gray-600 mb-1">Pending Reviews</h2>
            <div className="text-3xl font-bold">{pendingReviews}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-gray-600 mb-1">Review Progress</h2>
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${reviewProgress}%` }}
                ></div>
              </div>
              <div className="text-right text-sm mt-1">{reviewProgress}%</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div
            className="inline-flex rounded-md shadow-sm bg-gray-100 p-1"
            role="tablist"
          >
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "pending"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Pending (
              {applications.filter((app) => app.status === "pending").length})
            </button>
            <button
              onClick={() => setActiveTab("reviewed")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "reviewed"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Reviewed (
              {applications.filter((app) => app.status === "reviewed").length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "all"
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Applications ({applications.length})
            </button>
          </div>
        </div>

        {/* Application Cards or Table */}
        {renderApplicationCards()}
      </div>
    </div>
  );
};

export default Judge;
