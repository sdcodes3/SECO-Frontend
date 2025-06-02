import { useState } from 'react';
import { Search, Grid, List, MapPin, Eye, Award, Briefcase, Filter, X, Globe, Linkedin } from 'lucide-react';

const Professionals = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProfessional, setSelectedProfessional] = useState<{
    id: number;
    name: string;
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
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data - this would come from your backend
  const professionalsData = [
    {
      id: 1,
      name: "Alex Morgan",
      company: "Horizon Ventures",
      role: "Investor",
      location: "San Francisco, CA",
      availability: "Available",
      bio: "Early-stage investor with focus on B2B SaaS and fintech solutions. Previously founded two successful startups.",
      sectors: ["Fintech", "SaaS", "AI"],
      expertise: ["Seed Funding", "Series A", "Strategic Planning"],
      specialization: "$500K - $2M investments",
      experience: "12 years in industry",
      image: "/professionals/alex-morgan.jpg"
    },
    {
      id: 2,
      name: "Sarah Chen",
      company: "Future Forward Capital",
      role: "Investor",
      location: "Boston, MA",
      availability: "Available",
      bio: "Impact investor focusing on climate tech and sustainable solutions. PhD in Environmental Engineering and worked with multiple climate startups.",
      sectors: ["CleanTech", "AgTech", "Sustainability"],
      expertise: ["Impact Investing", "Climate Tech", "Sustainability"],
      specialization: "$1M - $5M investments",
      experience: "8 years in industry",
      image: "/professionals/sarah-chen.jpg"
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      company: "Nexus Fund",
      role: "Judge",
      location: "New York, NY",
      availability: "Unavailable",
      bio: "Specialized in health tech and biotech investments. Previously served as Chief Innovation Officer at a major pharmaceutical company.",
      sectors: ["HealthTech", "BioTech", "MedTech"],
      expertise: ["Healthcare Investment", "R&D Strategy", "Market Analysis"],
      specialization: "Healthcare innovation",
      experience: "15 years in industry",
      image: "/professionals/michael-rodriguez.jpg"
    },
    {
      id: 4,
      name: "Priya Sharma",
      company: "Elevate Ventures",
      role: "Mentor",
      location: "Singapore",
      availability: "Available",
      bio: "Focuses on emerging markets and cross-border technology companies. Strong network across Southeast Asia.",
      sectors: ["EdTech", "E-commerce", "Mobility"],
      expertise: ["Market Entry", "Cross-border Business", "Scaling"],
      specialization: "Southeast Asian markets",
      experience: "10 years in industry",
      image: "/professionals/priya-sharma.jpg"
    },
    {
      id: 5,
      name: "David Wilson",
      company: "Frontier Capital",
      role: "Judge",
      location: "Austin, TX",
      availability: "Unavailable",
      bio: "Hardware and deep tech investor with background in electrical engineering. Previously lead hardware development at Tesla.",
      sectors: ["Hardware", "DeepTech", "Robotics"],
      expertise: ["Product Development", "Manufacturing", "Supply Chain"],
      specialization: "Hardware startups",
      experience: "14 years in industry",
      image: "/professionals/david-wilson.jpg"
    },
    {
      id: 6,
      name: "Emma Johnson",
      company: "Catalyst Ventures",
      role: "Mentor",
      location: "Los Angeles, CA",
      availability: "Available",
      bio: "Specializes in early-stage consumer tech and marketplaces. Previously founded three D2C brands with successful exits.",
      sectors: ["ConsumerTech", "Marketplaces", "D2C"],
      expertise: ["Go-to-market", "Brand Strategy", "User Acquisition"],
      specialization: "Consumer startups",
      experience: "9 years in industry",
      image: "/professionals/emma-johnson.jpg"
    }
  ];

  // Function to open modal with professional details
interface Professional {
    id: number;
    name: string;
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

const openProfessionalModal = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsModalOpen(true);
};

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfessional(null);
  };

  // Function to render availability badge
  const renderAvailabilityBadge = (availability: string) => {
    if (availability === "Available") {
      return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 font-medium">Available</span>;
    } else {
      return <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">Unavailable</span>;
    }
  };

  // Function to render role badge
  const renderRoleBadge = (role: string) => {
    if (role === "Investor") {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
          <Briefcase size={12} />
          {role}
        </span>
      );
    } else if (role === "Judge") {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-600 font-medium">
          <Award size={12} />
          {role}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 font-medium">
          <Award size={12} />
          {role}
        </span>
      );
    }
  };

  // Professional Detail Modal
  const ProfessionalDetailModal = () => {
    if (!selectedProfessional) return null;

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={closeModal} // Close when clicking the backdrop
      >
        <div 
          className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()} // Prevent clicks on the modal from closing it
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold">Professional Details</h2>
              <button 
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="w-full sm:w-1/3 flex flex-col items-center">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 mb-4">
                  <div className="bg-gray-300 h-full w-full rounded-full flex items-center justify-center text-2xl font-semibold">
                    {selectedProfessional.name.charAt(0)}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-center">{selectedProfessional.name}</h3>
                <div className="text-gray-600 text-center mb-2">{selectedProfessional.company}</div>
                
                <div className="flex items-center justify-center mb-4">
                  {renderRoleBadge(selectedProfessional.role)}
                </div>
                
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                  <MapPin size={16} />
                  <span>{selectedProfessional.location}</span>
                </div>
                
                <div className="my-2">
                  {renderAvailabilityBadge(selectedProfessional.availability)}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                    <Linkedin size={20} className="text-blue-600" />
                  </button>
                  <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full">
                    <Globe size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="w-full sm:w-2/3">
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2">Bio</h4>
                  <p className="text-gray-600">{selectedProfessional.bio}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2">Experience</h4>
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-gray-500" />
                    <span className="text-gray-600">{selectedProfessional.experience}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2">Sectors</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfessional.sectors.map((sector, idx) => (
                      <span key={idx} className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfessional.expertise.map((skill, idx) => (
                      <span key={idx} className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2">Specialization</h4>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-gray-500" />
                    <span className="text-gray-600">{selectedProfessional.specialization}</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  {selectedProfessional.availability === "Available" ? (
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm w-full">
                      Connect with {selectedProfessional.name.split(' ')[0]}
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm w-full">
                      Invite {selectedProfessional.name.split(' ')[0]} as {selectedProfessional.role}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Grid view component
  const GridView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {professionalsData.map((professional) => (
          <div key={professional.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <div className="bg-gray-300 h-full w-full rounded-full flex items-center justify-center">
                    {professional.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{professional.name}</h3>
                    {renderAvailabilityBadge(professional.availability)}
                  </div>
                  <div className="text-sm text-gray-700">{professional.company}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    {renderRoleBadge(professional.role)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <MapPin size={12} />
                    <span>{professional.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">{professional.bio}</div>
              
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-2">Sectors</div>
                <div className="flex flex-wrap gap-2">
                  {professional.sectors.map((sector, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-2">Expertise</div>
                <div className="flex flex-wrap gap-2">
                  {professional.expertise.map((skill, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-2">Specialization</div>
                <div className="text-sm font-medium">{professional.specialization}</div>
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  onClick={() => openProfessionalModal(professional)}
                >
                  <Eye size={16} />
                  Details
                </button>
                
                {professional.availability === "Available" ? (
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm w-24 text-center">
                    Connect
                  </button>
                ) : (
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm w-24 text-center">
                    Invite
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // List view component
  const ListView = () => {
    return (
      <div className="flex flex-col gap-4">
        {professionalsData.map((professional) => (
          <div key={professional.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-start gap-3 md:w-1/3">
                  <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    <div className="bg-gray-300 h-full w-full rounded-full flex items-center justify-center">
                      {professional.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{professional.name}</h3>
                      {renderAvailabilityBadge(professional.availability)}
                    </div>
                    <div className="text-sm text-gray-700">{professional.company}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {renderRoleBadge(professional.role)}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} />
                        <span>{professional.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="text-sm text-gray-600">{professional.bio}</div>
                </div>
                
                <div className="md:w-1/3">
                  <div className="flex flex-col gap-3">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Sectors</div>
                      <div className="flex flex-wrap gap-1">
                        {professional.sectors.map((sector, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                            {sector}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Expertise</div>
                      <div className="flex flex-wrap gap-1">
                        {professional.expertise.slice(0, 2).map((skill, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {skill}
                          </span>
                        ))}
                        {professional.expertise.length > 2 && (
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            +{professional.expertise.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-4 md:mt-0 justify-between sm:justify-end w-full md:w-auto">
                  <button 
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    onClick={() => openProfessionalModal(professional)}
                  >
                    <Eye size={16} />
                  </button>
                  
                  {professional.availability === "Available" ? (
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm w-24 text-center">
                      Connect
                    </button>
                  ) : (
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm w-24 text-center">
                      Invite
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-center mb-2">Professional Directory</h1>
          <p className="text-center text-gray-600 mb-6">
            Connect with industry professionals, mentors, judges, and experts to help grow your startup
          </p>
          
          {/* Search bar */}
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search by name, company, sector, expertise..."
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
          </div>
        </div>
      </div>
      
      {/* Filters and view toggle */}
      <div className="container mx-auto max-w-6xl px-4 mt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            <Filter size={16} />
            <span>Filters</span>
          </button>
          
          <div className="flex items-center justify-between w-full sm:w-auto">
            <div className="sm:hidden text-sm text-gray-500">
              Showing {professionalsData.length} professionals
            </div>
            
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button 
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} />
              </button>
              <button 
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="hidden sm:flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            Showing {professionalsData.length} professionals
          </div>
        </div>
        
        {/* Professionals display */}
        {viewMode === 'grid' ? <GridView /> : <ListView />}
      </div>

      {/* Professional detail modal */}
      {isModalOpen && <ProfessionalDetailModal />}
    </div>
  );
};

export default Professionals;