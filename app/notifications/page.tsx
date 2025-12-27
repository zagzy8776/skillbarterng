'use client'

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body?: string;
  read: boolean;
  created_at: string;
};

type SwapRequest = {
  id: string;
  requester_id: string;
  target_id: string;
  conversation_id: string;
  status: string;
  created_at: string;
  requester: {
    id: string;
    user_metadata: {
      full_name?: string;
      teach_skills?: string[];
      want_skills?: string[];
      [key: string]: unknown;
    };
  };
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Load notifications
      const { data: notifData, error: notifError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(200);

      if (!mounted) return;

      if (!notifError && notifData) {
        setNotifications(notifData as Notification[]);
      }

      // Load swap requests
      const { data: swapData, error: swapError } = await supabase
        .from("swap_requests")
        .select(`
          *,
          requester:requester_id (
            id,
            user_metadata
          )
        `)
        .eq("target_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (!swapError && swapData) {
        setSwapRequests(swapData as SwapRequest[]);
      }

      setLoading(false);
    };
    load();
    return () => { mounted = false; };
  }, [router]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const handleSwapRequest = async (requestId: string, conversationId: string, accept: boolean) => {
    const { error } = await supabase
      .from("swap_requests")
      .update({ status: accept ? "accepted" : "declined" })
      .eq("id", requestId);

    if (!error) {
      // Remove from local state
      setSwapRequests(prev => prev.filter(r => r.id !== requestId));

      if (accept) {
        // Redirect to chat
        router.push(`/chat/${conversationId}`);
      }
    } else {
      alert("Error processing request: " + error.message);
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.read).map(n => n.id);
    if (unread.length === 0) return;
    const { error } = await supabase.from("notifications").update({ read: true }).in("id", unread);
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  if (loading) return <div className="p-8 text-center text-white">Loading notifications…</div>;

  return (
    <>
      <Navbar />
      <section className="min-h-screen pt-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">Notifications</h1>
        <div className="mb-4 text-sm text-gray-300">
          You have {notifications.filter(n => !n.read).length} unread notifications and {swapRequests.length} pending swap requests.
        </div>
        <div className="flex gap-2 mb-6">
          <button onClick={markAllRead} className="px-4 py-2 bg-green-500 text-white rounded">Mark all read</button>
        </div>

        {/* Swap Requests Section */}
        {swapRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Swap Requests</h2>
            <ul className="space-y-4">
              {swapRequests.map(request => (
                <li key={request.id} className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="font-semibold text-white text-lg mb-2">
                        {request.requester.user_metadata?.full_name || "A student"} wants to swap skills with you!
                      </div>
                      <div className="text-sm text-gray-300 mb-3">
                        They can teach: {request.requester.user_metadata?.teach_skills?.join(", ") || "Not specified"}
                      </div>
                      <div className="text-sm text-gray-300 mb-3">
                        They want to learn: {request.requester.user_metadata?.want_skills?.join(", ") || "Not specified"}
                      </div>
                      <div className="text-xs text-gray-400">
                        Sent {new Date(request.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleSwapRequest(request.id, request.conversation_id, true)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-medium transition"
                      >
                        Accept & Chat
                      </button>
                      <button
                        onClick={() => handleSwapRequest(request.id, request.conversation_id, false)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium transition"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Regular Notifications */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Other Notifications</h2>
          <ul className="space-y-3">
            {notifications.length === 0 && swapRequests.length === 0 && (
              <li className="text-gray-400 text-center py-8">No notifications yet.</li>
            )}
            {notifications.map(n => (
              <li key={n.id} className={`p-4 rounded-lg ${n.read ? "bg-white/5" : "bg-green-900/20 border border-green-500/30"}`}>
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="font-semibold text-white">{n.title}</div>
                    {n.body && <div className="text-sm text-gray-300">{n.body}</div>}
                    <div className="text-xs text-gray-400 mt-2">{new Date(n.created_at).toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {!n.read && <button onClick={() => markAsRead(n.id)} className="px-3 py-1 bg-green-500 rounded text-xs text-white">Mark read</button>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
    </>
  );
}
