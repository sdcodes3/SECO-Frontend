import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchInvestors, updateInvestor, clearMessages, createInvestor, deleteInvestor, fetchInvestorById } from '../../InvestorSlice'

// Define the Investor interface (consider moving to a shared types file)
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
  const dispatch = useDispatch<AppDispatch>();
  const { investors, loading, error, success, selectedInvestor } = useSelector((state: RootState) => state.investor);

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

  // Fetch all investors on component mount
  useEffect(() => {
    dispatch(fetchInvestors());
  }, [dispatch]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

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
      // Parse JSON strings for sectors and expertise
      const parsedSectors = JSON.parse(addFormData.sectors);
      const parsedExpertise = JSON.parse(addFormData.expertise);

      const investorData = {
        name: addFormData.name,
        email: addFormData.email,
        password: addFormData.password || "",
        company: addFormData.company,
        role: addFormData.role,
        location: addFormData.location,
        availability: addFormData.availability,
        bio: addFormData.bio,
        sectors: parsedSectors,
        expertise: parsedExpertise,
        specialization: addFormData.specialization,
        experience: addFormData.experience,
        image: addFormData.image,
      };

      // Optimistic update happens in the slice, so we just dispatch
      const result = await dispatch(createInvestor(investorData));
      
      if (createInvestor.fulfilled.match(result)) {
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
      }
    } catch (err) {
      console.error("Error parsing JSON data:", err);
      dispatch(clearMessages());
      dispatch({ type: 'investor/setError', payload: 'Invalid JSON format for sectors or expertise' });
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
      // Parse JSON strings for sectors and expertise
      const parsedSectors = JSON.parse(editFormData.sectors);
      const parsedExpertise = JSON.parse(editFormData.expertise);

      const updatedData = {
        name: editFormData.name,
        email: editFormData.email,
        company: editFormData.company,
        role: editFormData.role,
        location: editFormData.location,
        availability: editFormData.availability,
        bio: editFormData.bio,
        sectors: parsedSectors,
        expertise: parsedExpertise,
        specialization: editFormData.specialization,
        experience: editFormData.experience,
        image: editFormData.image || undefined,
      };

      // Optimistic update happens in the slice, so we just dispatch
      const result = await dispatch(updateInvestor({ id: editInvestorId, updatedData }));
      
      if (updateInvestor.fulfilled.match(result)) {
        setShowEditModal(false);
        setEditInvestorId(null);
      }
    } catch (err) {
      console.error("Error in handleEditSubmit:", err);
      dispatch(clearMessages());
      dispatch({ type: 'investor/setError', payload: 'Invalid JSON format for sectors or expertise' });
    }
  };

  // Handle View Investor
  const openViewModal = async (id: string) => {
    await dispatch(fetchInvestorById(id));
    setShowViewModal(true);
  };

  // Handle Delete Investor
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this investor?")) return;

    // Optimistic update happens in the slice, so we just dispatch
    await dispatch(deleteInvestor(id));
  };

  // Close modals and clear messages
  const closeModal = (modalSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    modalSetter(false);
    dispatch(clearMessages());
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
              <tr key={investor.id} className={investor.id.startsWith('temp-') ? 'opacity-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">{investor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{investor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{investor.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openViewModal(investor.id)}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                    disabled={investor.id.startsWith('temp-')}
                  >
                    View
                  </button>
                  <button
                    onClick={() => openEditModal(investor)}
                    className="text-green-600 hover:text-green-900 mr-2"
                    disabled={investor.id.startsWith('temp-')}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(investor.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={investor.id.startsWith('temp-')}
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
                  {addFormData.image && (
                    <img
                      src={URL.createObjectURL(addFormData.image)}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded"
                    />
                  )}
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
                  onClick={() => closeModal(setShowAddModal)}
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
                  {editFormData.image && (
                    <img
                      src={URL.createObjectURL(editFormData.image)}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded"
                    />
                  )}
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
                  onClick={() => closeModal(setShowEditModal)}
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
      {showViewModal && selectedInvestor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Investor Details</h2>
            <div className="space-y-4">
              {selectedInvestor.image && (
                <img
                  src={selectedInvestor.image}
                  alt={selectedInvestor.name}
                  className="w-32 h-32 object-cover rounded"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Name:</strong> {selectedInvestor.name}</p>
                </div>
                <div>
                  <p><strong>Email:</strong> {selectedInvestor.email}</p>
                </div>
                <div>
                  <p><strong>Company:</strong> {selectedInvestor.company}</p>
                </div>
                <div>
                  <p><strong>Role:</strong> {selectedInvestor.role}</p>
                </div>
                <div>
                  <p><strong>Location:</strong> {selectedInvestor.location}</p>
                </div>
                <div>
                  <p><strong>Availability:</strong> {selectedInvestor.availability}</p>
                </div>
                <div className="col-span-2">
                  <p><strong>Bio:</strong> {selectedInvestor.bio}</p>
                </div>
                <div>
                  <p><strong>Sectors:</strong> {selectedInvestor.sectors.join(", ")}</p>
                </div>
                <div>
                  <p><strong>Expertise:</strong> {selectedInvestor.expertise.join(", ")}</p>
                </div>
                <div>
                  <p><strong>Specialization:</strong> {selectedInvestor.specialization}</p>
                </div>
                <div>
                  <p><strong>Experience:</strong> {selectedInvestor.experience}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => closeModal(setShowViewModal)}
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