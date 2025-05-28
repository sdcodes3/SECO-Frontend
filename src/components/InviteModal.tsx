// InviteTeamModal.tsx
import React, { useState, useEffect } from "react";

type Member = {
  id: string;
  name: string;
  role: "owner" | "admin" | "member";
  avatarUrl?: string;
};

type Team = {
  id: string;
  name: string;
  members: Member[];
};

type Props = {
  teamId: string;
  teams: Team[];
  onClose: () => void;
  onSendInvite: (teamId: string, role: string, email: string) => void;
};

export const InviteTeamModal: React.FC<Props> = ({
  teamId,
  teams,
  onClose,
  onSendInvite
}) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [role, setRole] = useState<string>("member");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const selectedTeam = teams.find((t) => t.id === teamId) || null;
    setTeam(selectedTeam);
  }, [teamId, teams]);

  const handleSendInvite = () => {
    try {
      if (email.trim()) {
        onSendInvite(teamId, role, email);
        setEmail("");
      }
    } catch (error) {
      console.error("Error sending invite:", error);
    }
  };

  if (!team) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Invite Team Members</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            &times;
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Send invitations to collaborate on projects and documents.
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Team</label>
          <div className="border px-3 py-2 rounded">{team.name}</div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Current team members:
          </label>
          <div className="flex flex-wrap gap-2">
            {team.members.map((member) => (
              <span
                key={member.id}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-sm"
              >
                <img
                  src={member.avatarUrl || "https://via.placeholder.com/24"}
                  className="w-5 h-5 rounded-full"
                  alt={member.name}
                />
                {member.name}
                <span className="text-xs text-gray-500">({member.role})</span>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 border px-3 py-2 rounded"
            />
            <button
              onClick={handleSendInvite}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleSendInvite}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Send Invitations
          </button>
        </div>
      </div>
    </div>
  );
};
