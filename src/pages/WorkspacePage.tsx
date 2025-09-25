/* eslint-disable @typescript-eslint/no-explicit-any */
/* WorkspacePage.tsx */
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Dialog, Input } from "@headlessui/react";
import toast from "react-hot-toast";

const channels = ["general", "random", "tasks", "announcements"];

export default function WorkspacePage() {
  const { id: workspaceIdParam } = useParams();
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [workspace, setWorkspace] = useState<any>(null);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [renameModal, setRenameModal] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [confirmName, setConfirmName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("workspace_members")
        .select("workspace_id, workspaces(*)")
        .eq("user_id", user.id);

      if (error) {
        toast.error("Failed to load workspaces: " + error.message);
        return;
      }

      if (!data || data.length === 0) {
        navigate("/workspace/create-join");
        return;
      }

      setWorkspaces(data);

      // If route param matches a workspace, use it; otherwise first workspace
      const selected = data.find((w: any) => w.workspace_id === workspaceIdParam) || data[0];
      setWorkspace(selected.workspaces);
    };

    fetchWorkspaces();
  }, [workspaceIdParam, navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error(error.message);
    else navigate("/login");
  };

  const goToCreateJoin = () => {
    navigate("/workspace/create-join");
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
      setWorkspace((prev: any) => ({ ...prev, name: newName }));
      setWorkspaces((prev: any[]) =>
        prev.map((w) => (w.workspace_id === renameModal.id ? { ...w, workspaces: { ...w.workspaces, name: newName } } : w))
      );
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
      const remaining = workspaces.filter((w) => w.workspace_id !== deleteModal.id);
      setWorkspaces(remaining);
      if (remaining.length > 0) setWorkspace(remaining[0].workspaces);
      else navigate("/workspace/create-join");
    }

    setDeleteModal(null);
    setConfirmName("");
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-gray-100 flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          {workspace ? workspace.name : "Loading..."}
        </div>

        <div className="flex-1 overflow-y-auto mt-2">
          {/* Workspaces */}
          <div className="px-4 py-2 uppercase text-gray-400 text-xs">Workspaces</div>
          {workspaces.map((wm) => (
            <div
              key={wm.workspace_id}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-800 rounded ${
                workspace?.id === wm.workspace_id ? "bg-gray-800 font-semibold" : ""
              }`}
              onClick={() => {
                setWorkspace(wm.workspaces);
                navigate(`/workspace/${wm.workspace_id}`);
              }}
            >
              {wm.workspaces.name}
            </div>
          ))}

          {/* Channels */}
          <div className="px-4 py-2 uppercase text-gray-400 text-xs mt-4">Channels</div>
          {channels.map((channel) => (
            <div
              key={channel}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-800 rounded ${
                selectedChannel === channel ? "bg-gray-800 font-semibold" : ""
              }`}
              onClick={() => setSelectedChannel(channel)}
            >
              # {channel}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700 flex flex-col gap-2">
          <button className="w-full bg-red-500 text-white py-2 rounded" onClick={handleLogout}>
            Logout
          </button>
          <button className="w-full bg-green-500 text-white py-2 rounded" onClick={goToCreateJoin}>
            Create / Join Workspace
          </button>
          {workspace && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setRenameModal(workspace)}
                className="flex-1 bg-emerald-500 text-white py-1 rounded hover:bg-emerald-400 text-sm"
              >
                Rename
              </button>
              <button
                onClick={() => setDeleteModal(workspace)}
                className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-400 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        <div className="p-4 bg-white border-b border-gray-300 flex justify-between items-center">
          <h1 className="text-xl font-bold">#{selectedChannel}</h1>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {/* Example messages */}
          <div className="flex space-x-2">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex-shrink-0"></div>
            <div>
              <div className="text-sm font-semibold">User1</div>
              <div className="text-gray-700">Hello everyone!</div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-300 bg-white">
          <input
            type="text"
            placeholder={`Message #${selectedChannel}`}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Rename Modal */}
      <Dialog open={!!renameModal} onClose={() => setRenameModal(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-emerald-50 text-black rounded-lg p-6 max-w-md w-full border-[3px] border-emerald-600">
            <Dialog.Title className="text-lg font-bold mb-4">Rename Workspace</Dialog.Title>
            <p className="mb-3">
              Type the new name for <b>{renameModal?.name}</b>:
            </p>
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              className="w-full px-3 py-2 border border-black rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRenameModal(null)} className="px-4 py-2 rounded bg-black/60 text-white">
                Cancel
              </button>
              <button onClick={confirmRename} className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600">
                Rename
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={!!deleteModal} onClose={() => setDeleteModal(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-zinc-900 text-white rounded-lg p-6 max-w-md w-full border border-red-600">
            <Dialog.Title className="text-lg font-bold text-red-400 mb-4">Delete Workspace</Dialog.Title>
            <p className="mb-3">
              Type the workspace name <b>{deleteModal?.name}</b> to confirm deletion:
            </p>
            <Input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              placeholder="Enter workspace name"
              className="w-full px-3 py-2 border rounded bg-zinc-800 text-white mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteModal(null)} className="px-4 py-2 rounded bg-gray-600">
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
}
