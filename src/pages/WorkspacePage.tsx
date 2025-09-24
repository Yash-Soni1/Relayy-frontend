import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export const WorkspacePage = () => {
  const { id } = useParams<{ id: string }>();
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("workspaces")
        .select("name")
        .eq("id", id)
        .single();
      if (error) console.error(error);
      else setWorkspaceName(data?.name || "Unknown");
    };

    fetchWorkspace();
  }, [id]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Logout error:", error);
    else navigate("/login");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Workspace: {workspaceName}</h1>
       <div className="flex items-center gap-5">
         <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
        <Link to="/dashboard" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">Back to Dashboard</Link>
       </div>
      </div>

      <div className="mt-6 text-gray-300">
        <p>Tasks, Chat, Documents, Whiteboard, and other workspace features will appear here.</p>
      </div>
    </div>
  );
};
