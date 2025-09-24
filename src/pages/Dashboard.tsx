/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";

interface Workspace {
  id: string;
  name: string;
  created_at: string;
}

export const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // ✅ Get session
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        if (!session) {
          navigate("/login");
          return;
        }

        // ✅ Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        const userId = userData.user?.id;
        if (!userId) {
          navigate("/login");
          return;
        }

        // ✅ Fetch user's workspaces
        const { data, error } = await supabase
          .from("workspace_members")
          .select(`workspace_id, workspaces(id, name, created_at)`)
          .eq("user_id", userId);

        if (error) throw error;

        const wsArray: Workspace[] = data?.map((item: any) => item.workspaces) || [];
        setWorkspaces(wsArray);

        // ✅ Redirect to create-join only if no workspace and skip flag not set
        if (wsArray.length === 0 && !sessionStorage.getItem("skipWorkspaceRedirect")) {
          navigate("/workspace/create-join");
        } else {
          sessionStorage.removeItem("skipWorkspaceRedirect");
        }
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert("Error logging out: " + error.message);
    else navigate("/login");
  };

  if (loading) return <p className="text-center mt-10 text-white">Loading dashboard...</p>;

  return (
    <div className="p-6 max-w-10/12 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Workspace Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/workspace/create-join")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create / Join Workspace
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {error ? (
        <p className="text-center mt-10 text-red-500">{error}</p>
      ) : workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition cursor-pointer bg-zinc-800 text-white"
              onClick={() => navigate(`/workspace/${ws.id}`)}
            >
              <h2 className="text-xl font-semibold">{ws.name}</h2>
              <p className="text-gray-400 text-sm">
                Created at: {new Date(ws.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-10">
          You are not a member of any workspaces yet.
        </p>
      )}
    </div>
  );
};
