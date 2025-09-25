/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Dialog, Input } from "@headlessui/react";

interface Workspace {
  id: string;
  name: string;
  created_at: string;
  role: string;
  inviteToken?: string | null;
}

export const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renameModal, setRenameModal] = useState<Workspace | null>(null);
  const [deleteModal, setDeleteModal] = useState<Workspace | null>(null);
  const [newName, setNewName] = useState("");
  const [confirmName, setConfirmName] = useState("");
  const navigate = useNavigate();

  const fetchWorkspaces = async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;
      if (!session) {
        navigate("/login");
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const userId = userData.user?.id;
      if (!userId) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("workspace_members")
        .select(`
          role,
          workspaces(
            id,
            name,
            created_at,
            workspace_invites(token)
          )
        `)
        .eq("user_id", userId);

      if (error) throw error;

      let wsArray: Workspace[] =
        data?.map((item: any) => ({
          ...item.workspaces,
          role: item.role,
          inviteToken: item.workspaces.workspace_invites?.[0]?.token || null,
        })) || [];

      // Owner-created workspaces first
      wsArray = wsArray.sort((a, _b) => (a.role === "owner" ? -1 : 1));

      setWorkspaces(wsArray);

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

  useEffect(() => {
    fetchWorkspaces();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert("Error logging out: " + error.message);
    else navigate("/login");
  };

  const confirmRename = async () => {
    if (!renameModal || !newName) return;

    const { error } = await supabase
      .from("workspaces")
      .update({ name: newName })
      .eq("id", renameModal.id);

    if (error) toast.error(error.message);
    else {
      toast.success("Workspace renamed!");
      fetchWorkspaces();
    }

    setRenameModal(null);
    setNewName("");
  };

  const confirmDelete = async () => {
    if (!deleteModal) return;
    if (confirmName !== deleteModal.name) {
      toast.error("Workspace name does not match!");
      return;
    }

    const { error } = await supabase.from("workspaces").delete().eq("id", deleteModal.id);

    if (error) toast.error(error.message);
    else {
      toast.success("Workspace deleted!");
      fetchWorkspaces();
    }

    setDeleteModal(null);
    setConfirmName("");
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
              onClick={() => navigate(`/workspace/${ws.id}`)}
              className="p-4 border rounded-lg transition bg-zinc-800 text-white cursor-pointer hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold flex items-center gap-5">
                {ws.name}
              </h2>
              <p className="text-gray-400 text-sm">
                Created at: {new Date(ws.created_at).toLocaleDateString()}
              </p>
              <p className="mt-1 text-[15px] font-base">
                You are the{" "}
                <span className={ws.role === "owner" ? "text-yellow-400" : "text-blue-300"}>
                  {ws.role.charAt(0).toUpperCase() + ws.role.slice(1)}
                </span>{" "}
                of this Workspace
              </p>

              {ws.role === "owner" && ws.inviteToken && (
                <p className="mt-1 text-gray-300 text-sm">
                  Invite Token:{" "}
                  <span className="font-mono text-emerald-400">{ws.inviteToken}</span>
                </p>
              )}

              {ws.role === "owner" && (
                <div
                  className="flex gap-2 mt-3"
                  onClick={(e) => e.stopPropagation()} // Prevent redirect when clicking buttons
                >
                  <button
                    onClick={() => setRenameModal(ws)}
                    className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-400 text-sm"
                  >
                    Rename
                  </button>
                  <button
                    onClick={() => setDeleteModal(ws)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center mt-10">
          You are not a member of any workspaces yet.
        </p>
      )}

      {/* Rename Modal */}
      <Dialog open={!!renameModal} onClose={() => setRenameModal(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-emerald-50 text-black rounded-lg p-6 max-w-md w-full border-[3px] border-emerald-600">
            <Dialog.Title className="text-lg font-bold mb-4">Rename Workspace</Dialog.Title>
            <p className="mb-3">
              Type the new name for <b>{renameModal?.name}</b> to confirm renaming:
            </p>
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              className="w-full px-3 py-2 border border-black rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRenameModal(null)}
                className="px-4 py-2 rounded bg-black/60 text-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmRename}
                className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600"
              >
                Rename
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={!!deleteModal} onClose={() => setDeleteModal(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-zinc-900 text-white rounded-lg p-6 max-w-md w-full border border-red-600">
            <Dialog.Title className="text-lg font-bold text-red-400 mb-4">
              Delete Workspace
            </Dialog.Title>
            <p className="mb-3">
              Type the workspace name <b>{deleteModal?.name}</b> to confirm deletion:
            </p>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder="Enter workspace name"
              className="w-full px-3 py-2 border rounded bg-zinc-800 text-white mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteModal(null)}
                className="px-4 py-2 rounded bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
                disabled={confirmName !== deleteModal?.name}
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
