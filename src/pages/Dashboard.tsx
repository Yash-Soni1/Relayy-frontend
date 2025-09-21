/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const { data, error } = await fetch("http://localhost:4000/workspaces").then(res => res.json());
      if (!error) setWorkspaces(data);
    };
    fetchWorkspaces();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error logging out: " + error.message);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Workspace Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <ul>
        {workspaces.map((ws) => (
          <li key={ws.id} className="border p-2 mb-2">{ws.name}</li>
        ))}
      </ul>
    </div>
  );
};
