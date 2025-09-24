/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type Tab = "create" | "join";

export const CreateJoinWorkspace = () => {
  const [tab, setTab] = useState<Tab>("create");
  const [workspaceName, setWorkspaceName] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!workspaceName) return toast.error("Workspace name is required");
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not logged in");

      const { data: newWorkspace, error } = await supabase
        .from("workspaces")
        .insert({ name: workspaceName, owner_id: userData.user.id })
        .select()
        .single();
      if (error || !newWorkspace) throw error;

      await supabase.from("workspace_members").insert({
        workspace_id: newWorkspace.id,
        user_id: userData.user.id,
        role: "owner",
      });

      const token = Math.random().toString(36).substring(2, 8);
      await supabase.from("workspace_invites").insert({
        workspace_id: newWorkspace.id,
        token,
      });

      toast.success("Workspace created!");
      navigate(`/workspace/${newWorkspace.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!inviteToken) return toast.error("Invite token is required");
    setLoading(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("User not logged in");

      const { data: invite, error } = await supabase
        .from("workspace_invites")
        .select(`workspace_id, workspaces(name)`)
        .eq("token", inviteToken)
        .single();
      if (error || !invite) throw new Error("Invalid invite token");

      await supabase.from("workspace_members").insert({
        workspace_id: invite.workspace_id,
        user_id: userData.user.id,
        role: "member",
      });

      toast.success("Joined workspace!");
      navigate(`/workspace/${invite.workspace_id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 p-4">
      <div className="bg-zinc-800 text-white p-6 rounded shadow-md w-full max-w-md">
        <div className="flex justify-center gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-t-lg ${tab === "create" ? "bg-blue-600" : "bg-zinc-700"}`}
            onClick={() => setTab("create")}
          >
            Create Workspace
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg ${tab === "join" ? "bg-blue-600" : "bg-zinc-700"}`}
            onClick={() => setTab("join")}
          >
            Join Workspace
          </button>
        </div>

        {tab === "create" ? (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Workspace Name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full p-2 rounded bg-zinc-700 text-white"
            />
            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 p-2 rounded"
            >
              {loading ? "Creating..." : "Create Workspace"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Invite Token"
              value={inviteToken}
              onChange={(e) => setInviteToken(e.target.value)}
              className="w-full p-2 rounded bg-zinc-700 text-white"
            />
            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
            >
              {loading ? "Joining..." : "Join Workspace"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
