import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";
import API_CONSTANTS from "../utils/apiConstants";

interface Investor {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  location: string;
  availability: string;
  bio: string;
  sectors: string[];
  expertise: string[];
  specialization: string;
  experience: string;
  image: string;
}

interface InvestorFormData {
  name: string;
  email: string;
  password?: string;
  company: string;
  role: string;
  location: string;
  availability: string;
  bio: string;
  sectors: string;
  expertise: string;
  specialization: string;
  experience: string;
  image?: File | null;
}

const Investor = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for Add Investor Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState<InvestorFormData>({
    name: "",
    email: "",
    password: "",
    company: "",
    role: "Investor",
    location: "",
    availability: "Available",
    bio: "",
    sectors: '["Fintech", "SaaS"]',
    expertise: '["Seed Funding", "Series A"]',
    specialization: "",
    experience: "",
    image: null,
  });

  // State for Edit Investor Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editInvestorId, setEditInvestorId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<InvestorFormData>({
    name: "",
    email: "",
    company: "",
    role: "",
    location: "",
    availability: "",
    bio: "",
    sectors: "",
    expertise: "",
    specialization: "",
    experience: "",
    image: null,
  });

  // State for View Investor Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewInvestor, setViewInvestor] = useState<Investor | null>(null);

  // Fetch all investors on component mount
  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const response = await axiosInstance.get(API_CONSTANTS.GET_ALL_INVESTORS);
      setInvestors(response.data.investors || []);
    } catch (err) {
      console.error("Error fetching investors:", err);
      setError("Failed to fetch investors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Investor
  const handleAddInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAddFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const formDataToSend = new FormData();
      formDataToSend.append("name", addFormData.name);
      formDataToSend.append("email", addFormData.email);
      formDataToSend.append("password", addFormData.password || "");
      formDataToSend.append("company", addFormData.company);
      formDataToSend.append("role", addFormData.role);
      formDataToSend.append("location", addFormData.location);
      formDataToSend.append("availability", addFormData.availability);
      formDataToSend.append("bio", addFormData.bio);
      formDataToSend.append("sectors", addFormData.sectors);
      formDataToSend.append("expertise", addFormData.expertise);
      formDataToSend.append("specialization", addFormData.specialization);
      formDataToSend.append("experience", addFormData.experience);

      if (addFormData.image) {
        formDataToSend.append("image", addFormData.image);
      }

      await axiosInstance.post(API_CONSTANTS.CREATE_INVESTOR, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Investor created successfully!");
      setShowAddModal(false);
      setAddFormData({
        name: "",
        email: "",
        password: "",
        company: "",
        role: "Investor",
        location: "",
        availability: "Available",
        bio: "",
        sectors: '["Fintech", "SaaS"]',
        expertise: '["Seed Funding", "Series A"]',
        specialization: "",
        experience: "",
        image: null,
      });
      fetchInvestors(); // Refresh the list
    } catch (err: any) {
      console.error("Error creating investor:", err);
      setError(err.response?.data?.message || "Failed to create investor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Investor
  const openEditModal = (investor: Investor) => {
    setEditInvestorId(investor.id);
    setEditFormData({
      name: investor.name,
      email: investor.email,
      company: investor.company,
      role: investor.role,
      location: investor.location,
      availability: investor.availability,
      bio: investor.bio,
      sectors: JSON.stringify(investor.sectors),
      expertise: JSON.stringify(investor.expertise),
      specialization: investor.specialization,
      experience: investor.experience,
      image: null,
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInvestorId) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const formDataToSend = new FormData();
      formDataToSend.append("name", editFormData.name);
      formDataToSend.append("email", editFormData.email);
      formDataToSend.append("company", editFormData.company);
      formDataToSend.append("role", editFormData.role);
      formDataToSend.append("location", editFormData.location);
      formDataToSend.append("availability", editFormData.availability);
      formDataToSend.append("bio", editFormData.bio);
      formDataToSend.append("sectors", editFormData.sectors);
      formDataToSend.append("expertise", editFormData.expertise);
      formDataToSend.append("specialization", editFormData.specialization);
      formDataToSend.append("experience", editFormData.experience);

      if (editFormData.image) {
        formDataToSend.append("image", editFormData.image);
      }

      await axiosInstance.put(API_CONSTANTS.EDIT_INVESTOR(editInvestorId), formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Investor updated successfully!");
      setShowEditModal(false);
      setEditInvestorId(null);
      fetchInvestors(); // Refresh the list
    } catch (err: any) {
      console.error("Error updating investor:", err);
      setError(err.response?.data?.message || "Failed to update investor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle View Investor
  const openViewModal = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const response = await axiosInstance.get(API_CONSTANTS.GET_INVESTOR_BY_ID(id));
      setViewInvestor(response.data.investor);
      setShowViewModal(true);
    } catch (err) {
      console.error("Error fetching investor details:", err);
      setError("Failed to fetch investor details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Investor
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this investor?")) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await axiosInstance.delete(API_CONSTANTS.DELETE_INVESTOR(id));
      setSuccess("Investor deleted successfully!");
      fetchInvestors(); // Refresh the list
    } catch (err: any) {
      console.error("Error deleting investor:", err);
      setError(err.response?.data?.message || "Failed to delete investor. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Investors</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Investor
        </button>
      </div>

      {/* Investors Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {investors.map((investor) => (
              <tr key={investor.id}>
                <td className="px-6 py-4 whitespace-nowrap">{investor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{investor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{investor.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openViewModal(investor.id)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(investor)}
                    className="text-green-600 hover:text-green-900 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(investor.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Loading Indicator */}
      {loading && <div className="text-center mt-4">Loading...</div>}

      {/* No Investors Found */}
      {!loading && investors.length === 0 && (
        <div className="text-center mt-4 text-gray-500">No investors found.</div>
      )}

      {/* Add Investor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add Investor</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <input
                    type="file"
                    id="investor-image-input"
                    onChange={handleAddImageChange}
                    className="w-full"
                    accept="image/*"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={addFormData.name}
                    onChange={handleAddInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={addFormData.email}
                    onChange={handleAddInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={addFormData.password}
                    onChange={handleAddInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={addFormData.company}
                    onChange={handleAddInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={addFormData.role}
                    onChange={handleAddInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={addFormData.location}
                    onChange={handleAddInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Availability</label>
                  <select
                    name="availability"
                    value={addFormData.availability}
                    onChange={handleAddInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={addFormData.bio}
                    onChange={handleAddInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sectors (JSON format)</label>
                  <input
                    type="text"
                    name="sectors"
                    value={addFormData.sectors}
                    onChange={handleAddInputChange}
                    className="w-full p-2 border rounded"
                    placeholder='["Fintech", "SaaS"]'
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expertise (JSON format)</label>
                  <input
                    type="text"
                    name="expertise"
                    value={addFormData.expertise}
                    onChange={handleAddInputChange}
                    className="w-full p-2 border rounded"
                    placeholder='["Seed Funding", "Series A"]'
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={addFormData.specialization}
                    onChange={handleAddInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={addFormData.experience}
                    onChange={handleAddInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Investor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Investor</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Image (optional)</label>
                  <input
                    type="file"
                    id="investor-edit-image-input"
                    onChange={handleEditImageChange}
                    className="w-full"
                    accept="image/*"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={editFormData.company}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editFormData.location}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Availability</label>
                  <select
                    name="availability"
                    value={editFormData.availability}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={editFormData.bio}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sectors (JSON format)</label>
                  <input
                    type="text"
                    name="sectors"
                    value={editFormData.sectors}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    placeholder='["Fintech", "SaaS"]'
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expertise (JSON format)</label>
                  <input
                    type="text"
                    name="expertise"
                    value={editFormData.expertise}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    placeholder='["Seed Funding", "Series A"]'
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={editFormData.specialization}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={editFormData.experience}
                    onChange={handleEditInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Investor Modal */}
      {showViewModal && viewInvestor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Investor Details</h2>
            <div className="space-y-4">
              {viewInvestor.image && (
                <img
                  src={viewInvestor.image}
                  alt={viewInvestor.name}
                  className="w-32 h-32 object-cover rounded"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Name:</strong> {viewInvestor.name}</p>
                </div>
                <div>
                  <p><strong>Email:</strong> {viewInvestor.email}</p>
                </div>
                <div>
                  <p><strong>Company:</strong> {viewInvestor.company}</p>
                </div>
                <div>
                  <p><strong>Role:</strong> {viewInvestor.role}</p>
                </div>
                <div>
                  <p><strong>Location:</strong> {viewInvestor.location}</p>
                </div>
                <div>
                  <p><strong>Availability:</strong> {viewInvestor.availability}</p>
                </div>
                <div className="col-span-2">
                  <p><strong>Bio:</strong> {viewInvestor.bio}</p>
                </div>
                <div>
                  <p><strong>Sectors:</strong> {viewInvestor.sectors.join(", ")}</p>
                </div>
                <div>
                  <p><strong>Expertise:</strong> {viewInvestor.expertise.join(", ")}</p>
                </div>
                <div>
                  <p><strong>Specialization:</strong> {viewInvestor.specialization}</p>
                </div>
                <div>
                  <p><strong>Experience:</strong> {viewInvestor.experience}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
    </div>
  );
};

export default Investor;