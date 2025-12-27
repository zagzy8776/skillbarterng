'use client'

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type UserType = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    profile_pic_url?: string;
    [key: string]: unknown;
  };
};

export default function Chat() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationId = params.id as string;

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
    };
    getUser();
  }, [router]);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
      setLoading(false);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: newMessage.trim(),
    });

    if (!error) {
      setNewMessage("");
    } else {
      alert("Error sending message: " + error.message);
    }
    setSending(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center">
              <div className="text-white text-2xl mb-4">Loading Chat...</div>
              <div className="skeleton w-96 h-12 mx-auto mb-4 rounded"></div>
              <div className="skeleton w-64 h-6 mx-auto rounded"></div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white border-opacity-20 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-white bg-opacity-20 backdrop-blur-sm p-6 border-b border-white border-opacity-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">💬</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-black">Skill Swap Chat</h2>
                    <p className="text-black text-sm">Discuss your skill exchange</p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <div className="text-4xl mb-4">💬</div>
                  <p className="text-lg">No messages yet. Start the conversation!</p>
                  <p className="text-sm mt-2">Discuss how you'll swap skills and arrange your session.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender_id === user?.id
                          ? 'bg-green-500 text-white'
                          : 'bg-white bg-opacity-20 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender_id === user?.id ? 'text-green-100' : 'text-gray-300'
                      }`}>
                        {formatTime(message.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-white border-opacity-20">
              <form onSubmit={sendMessage} className="flex gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 bg-gray-800 bg-opacity-50 text-white rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold rounded-full transition"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
            <h3 className="text-xl font-bold text-black mb-4">💡 Chat Tips</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <p className="font-semibold text-green-300 mb-1">What to discuss:</p>
                <ul className="space-y-1">
                  <li>• Your skill levels and experience</li>
                  <li>• Best times for sessions</li>
                  <li>• Learning goals and expectations</li>
                  <li>• How you'll track progress</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-blue-300 mb-1">Stay safe:</p>
                <ul className="space-y-1">
                  <li>• Meet in public places initially</li>
                  <li>• Share session details with friends</li>
                  <li>• Trust your instincts</li>
                  <li>• Report any concerns to us</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
