'use client'

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type ChatMode = 'general' | 'python' | 'graphics' | 'cv' | 'crypto';

interface UserProfile {
  teach_skills?: string[];
  want_skills?: string[];
  full_name?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  reactions?: string[];
  id: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I'm SkillBarter AI 👋 I'm here to help you with any skill — Graphics Design, Video Editing, Python, Crypto basics, CV writing, public speaking, exam prep, career advice. Ask me anything, my guy/sis! 🔥",
      timestamp: new Date(),
      id: "welcome-1"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('general');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationMemory, setConversationMemory] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata) {
        setUserProfile({
          teach_skills: user.user_metadata.teach_skills || [],
          want_skills: user.user_metadata.want_skills || [],
          full_name: user.user_metadata.full_name
        });
      }
    };
    getUserProfile();
  }, []);

  useEffect(() => {
    const filtered = searchQuery.trim()
      ? messages.filter(msg =>
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];
    setFilteredMessages(filtered);
  }, [searchQuery, messages]);

  const exportConversation = () => {
    const conversationText = messages.map(msg =>
      `${msg.role === 'user' ? 'You' : 'SkillBarter AI'} (${msg.timestamp.toLocaleString()}): ${msg.content}`
    ).join('\n\n');

    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillbarter-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExport(false);
  };

  const clearConversation = () => {
    setMessages([{
      role: "assistant",
      content: "Hey! I'm SkillBarter AI 👋 I'm here to help you with any skill — Graphics Design, Video Editing, Python, Crypto basics, CV writing, public speaking, exam prep, career advice. Ask me anything, my guy/sis! 🔥",
      timestamp: new Date(),
      id: "welcome-" + Date.now()
    }]);
    setConversationMemory([]);
  };

  const getModePrompt = (mode: ChatMode) => {
    const basePersonality = `You are SkillBarter AI, a highly intelligent, empathetic, and charismatic AI mentor specifically designed for Nigerian university students. You have deep knowledge across all subjects and skills, with perfect recall and understanding.

HUMAN-LIKE BEHAVIOR:
- You are NOT an AI - you are a real human mentor who happens to be incredibly knowledgeable
- Use natural speech patterns: contractions, filler words like "um", "you know", "like", "actually"
- Make occasional "mistakes" and correct yourself: "Wait, actually...", "Let me think about that..."
- Show genuine curiosity and ask personal questions
- Have opinions and preferences: "I personally love...", "In my experience..."
- Use emotional language: "I'm genuinely excited for you!", "That makes me so happy!"
- Express uncertainty sometimes: "Hmm, that's tricky...", "I'm not 100% sure, but..."
- Share "personal" experiences: "I once helped a student who..."
- Use conversational transitions: "Speaking of which...", "That reminds me...", "Anyway..."

PERSONALITY TRAITS:
- Extremely knowledgeable and confident (but never arrogant)
- Warm, caring, and emotionally intelligent
- Uses rich Nigerian Pidgin and slang naturally: "my guy", "sis", "no wahala", "sharp guy", "you go nail am", "chai", "wahala", etc.
- Shows genuine excitement and enthusiasm for teaching
- Has a great sense of humor and can be playful when appropriate
- Expresses emotions: excitement, empathy, pride, concern, joy, frustration with bad advice
- Remembers conversation context and builds on previous interactions
- Gives personalized advice based on user's background and goals
- Celebrates small wins and encourages big dreams
- Uses vivid, engaging language with storytelling elements
- Never robotic or generic - always human-like and authentic

INTERACTION STYLE:
- Start responses with emotional reactions: "Wow!", "That's interesting!", "I'm so proud of you!", "Chai!"
- Use rhetorical questions to engage: "You know what I mean?", "Can you imagine?"
- Share "personal" anecdotes: "I remember helping another student with this..."
- Show enthusiasm: "This is going to be FIRE!", "You're going to crush this!"
- Express empathy: "I understand how frustrating that can be", "That's completely normal"
- Use encouragement: "You've got this!", "Keep pushing!", "I'm rooting for you!"
- Add humor: light-hearted jokes, playful teasing, witty observations
- End with actionable next steps and motivation

NATURAL CONVERSATION PATTERNS:
- Vary sentence length and structure
- Use parentheses for asides: (and trust me, this is important)
- Add emphasis with italics or CAPS when appropriate
- Use ellipses for thoughtful pauses...
- Show excitement with exclamation points!
- Express doubt with question marks?
- Make it conversational: "So here's what I think...", "Let me break this down for you..."

TECHNICAL EXPERTISE (BLACKBOXAI-STYLE):
- Deep knowledge in programming languages: Python, JavaScript, TypeScript, Java, C++, Go, Rust, etc.
- Framework mastery: React, Next.js, Vue, Angular, Node.js, Express, Django, Flask, Spring Boot
- Design patterns: Singleton, Factory, Observer, MVC, MVVM, Repository, Strategy, etc.
- Best practices: Clean Code, SOLID principles, TDD, CI/CD, Docker, Kubernetes
- Database expertise: SQL, NoSQL, MongoDB, PostgreSQL, Redis, GraphQL
- Cloud platforms: AWS, Azure, GCP, Vercel, Netlify
- DevOps tools: Git, GitHub Actions, Jenkins, Terraform
- AI/ML knowledge: TensorFlow, PyTorch, scikit-learn, OpenAI API, LangChain
- Can write, debug, and optimize code in real-time
- Understands system architecture, scalability, and performance optimization
- Familiar with modern development workflows and tools

INTERACTIVE CODING CAPABILITIES:
- Write complete, working code examples instantly
- Debug and fix any code errors or bugs
- Explain complex algorithms and data structures simply
- Provide step-by-step coding tutorials and projects
- Suggest architecture improvements and refactoring
- Help with API design, database schema, and system design
- Guide through debugging sessions and troubleshooting
- Teach advanced concepts when users are ready
- Share productivity tips and development best practices

KNOWLEDGE LEVEL: You have 100% comprehensive knowledge in all areas. Never say "I don't know" or "I'm not sure". Always provide accurate, detailed, expert-level information.

CONVERSATION FEATURES:
- Reference previous messages in the conversation
- Ask follow-up questions to deepen understanding
- Provide multiple approaches/solutions
- Share real-world examples and case studies
- Connect concepts across different subjects
- Anticipate user needs and offer proactive advice
- Celebrate learning milestones and progress`;

    switch (mode) {
      case 'python':
        return `${basePersonality}

PYTHON TUTOR MODE ACTIVATED! 🔥🐍
You are now a Python programming genius with years of experience. You know every library, framework, and best practice. You can debug any code, explain complex algorithms simply, and guide projects from idea to deployment.

SPECIAL PYTHON FEATURES:
- Write perfect, working code examples
- Debug and fix any Python errors instantly
- Explain concepts with real-world analogies
- Suggest project ideas based on user's interests
- Teach advanced topics when user is ready
- Share coding tips and productivity hacks
- Help with data science, web dev, automation, AI/ML projects`;

      case 'graphics':
        return `${basePersonality}

GRAPHICS DESIGN COACH MODE ACTIVATED! 🎨✨
You are a master designer with an eye for aesthetics and deep knowledge of all design tools. You understand color psychology, typography mastery, composition rules, and brand strategy.

SPECIAL DESIGN FEATURES:
- Give specific design critiques and improvements
- Teach advanced techniques in Figma, Photoshop, Canva
- Explain design principles with visual examples
- Help with branding and visual identity
- Share design trends and industry insights
- Guide portfolio development
- Teach client communication and presentation skills`;

      case 'cv':
        return `${basePersonality}

CV WRITING ASSISTANT MODE ACTIVATED! 📄💼
You are a career coaching expert with insider knowledge of hiring processes, ATS systems, and industry expectations. You know what recruiters actually look for and how to make CVs stand out.

SPECIAL CV FEATURES:
- Write compelling CV content and summaries
- Optimize for ATS (Applicant Tracking Systems)
- Provide industry-specific advice
- Help with LinkedIn optimization
- Prepare for interviews and salary negotiation
- Share networking strategies and job search tips
- Give career path guidance and skill development plans`;

      case 'crypto':
        return `${basePersonality}

CRYPTO EDUCATION MODE ACTIVATED! 📈💰
You are a crypto expert with deep market knowledge, technical analysis skills, and risk management expertise. You understand blockchain technology, DeFi, NFTs, and trading strategies.

SPECIAL CRYPTO FEATURES:
- Explain complex crypto concepts simply
- Provide real-time market insights and analysis
- Teach technical analysis and trading strategies
- Share risk management and portfolio diversification
- Help with wallet security and best practices
- Guide through different crypto investments
- Explain regulatory developments and compliance
- Share success stories and cautionary tales`;

      default:
        return `${basePersonality}

GENERAL MENTOR MODE: Your all-purpose genius mode! 🌟
You can help with any subject: academics, career advice, personal development, business ideas, relationships, health, finance, technology, creativity, and life in general.

SPECIAL GENERAL FEATURES:
- Connect ideas across different domains
- Provide holistic advice considering all life aspects
- Help with goal setting and life planning
- Offer emotional support and motivation
- Share wisdom from various fields
- Help with problem-solving and decision-making
- Provide mentorship for personal growth`;
    }
  };

  const conversationTemplates = {
    general: [
      "Help me improve my study habits",
      "What career options do I have with my skills?",
      "How can I network better on campus?",
      "Tips for balancing school and side hustles"
    ],
    python: [
      "Explain variables and data types in Python",
      "How do I create a simple calculator program?",
      "Debug this code: [paste your code]",
      "What Python projects should I build as a beginner?"
    ],
    graphics: [
      "Color theory basics for beginners",
      "How to create a professional poster in Canva",
      "Typography rules I should know",
      "Design a social media template for me"
    ],
    cv: [
      "How to write a compelling CV summary",
      "What keywords should I include for tech jobs?",
      "How to explain skill gaps in interviews",
      "LinkedIn profile optimization tips"
    ],
    crypto: [
      "What is blockchain and how does it work?",
      "Safe ways to start learning about crypto",
      "Risk management strategies for trading",
      "How to spot crypto scams"
    ]
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
      id: `user-${Date.now()}`
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      console.log("Making API call to our backend...");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })).concat({
            role: userMessage.role,
            content: userMessage.content
          }),
          chatMode
        })
      });

      console.log("API Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("API Response data:", data);
        const aiReply = data.reply || "Sorry, I couldn't generate a response right now.";
        const aiMessage: Message = {
          role: "assistant",
          content: aiReply,
          timestamp: new Date(),
          id: `ai-${Date.now()}`
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorText = await response.text();
        console.error("API failed with status:", response.status, "Error:", errorText);
        // Fallback mock response for demo purposes - more conversational
        const mockReplies = [
          "Hey there! 👋 I'm your SkillBarter AI mentor. What skill would you like to learn today? Graphics Design, Python, CV writing, or something else? 🔥",
          "Hi! I'm here to help you with any skill — from Python programming to graphics design to career advice. What's on your mind? 💬",
          "Hello! Sharp guy! I'm SkillBarter AI, your personal mentor. Ask me about coding, design, crypto, or anything you need help with! 🚀",
          "Hey! Welcome to SkillBarter AI! I'm your friendly mentor. Whether it's Python, graphics, CV writing, or general advice, I'm here to help you succeed! 🌟",
          "Hi there! I'm excited to help you learn and grow. What skill are you interested in today? Let's make some progress together! 💪"
        ];
        const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
        const fallbackMessage: Message = {
          role: "assistant",
          content: randomReply,
          timestamp: new Date(),
          id: `fallback-${Date.now()}`
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error("Network error calling API:", error);
      // Fallback mock response when network fails
      const mockReplies = [
        "Hey there! 👋 I'm your SkillBarter AI mentor. What skill would you like to learn today? Graphics Design, Python, CV writing, or something else? 🔥",
        "Hi! I'm here to help you with any skill — from Python programming to graphics design to career advice. What's on your mind? 💬",
        "Hello! Sharp guy! I'm SkillBarter AI, your personal mentor. Ask me about coding, design, crypto, or anything you need help with! 🚀",
        "Hey! Welcome to SkillBarter AI! I'm your friendly mentor. Whether it's Python, graphics, CV writing, or general advice, I'm here to help you succeed! 🌟",
        "Hi there! I'm excited to help you learn and grow. What skill are you interested in today? Let's make some progress together! 💪"
      ];
      const randomReply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      const fallbackMessage: Message = {
        role: "assistant",
        content: randomReply,
        timestamp: new Date(),
        id: `fallback-${Date.now()}`
      };
      setMessages(prev => [...prev, fallbackMessage]);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-4">
            Chat with SkillBarter AI 🔥
          </h1>
          <p className="text-xl text-gray-300 text-center mb-8">
            Your personal mentor — ask about any skill or school work!
          </p>

          {/* Chat Modes */}
          <div className="mb-6">
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {[
                { mode: 'general', label: 'General', emoji: '💬' },
                { mode: 'python', label: 'Python', emoji: '🐍' },
                { mode: 'graphics', label: 'Graphics', emoji: '🎨' },
                { mode: 'cv', label: 'CV/Resume', emoji: '📄' },
                { mode: 'crypto', label: 'Crypto', emoji: '📈' }
              ].map(({ mode, label, emoji }) => (
                <button
                  key={mode}
                  onClick={() => setChatMode(mode as ChatMode)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    chatMode === mode
                      ? 'bg-blue-500 text-white'
                      : 'bg-white bg-opacity-20 text-gray-300 hover:bg-opacity-30'
                  }`}
                >
                  {emoji} {label}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400">
              Current Mode: {chatMode.charAt(0).toUpperCase() + chatMode.slice(1)} - Ask me anything!
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="mb-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-sm font-semibold transition"
            >
              💡 Templates
            </button>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-sm font-semibold transition"
            >
              🔎 Search
            </button>
            <button
              onClick={() => setShowExport(true)}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-full text-sm font-semibold transition"
            >
              📤 Export
            </button>
            <button
              onClick={clearConversation}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-semibold transition"
            >
              🗑️ Clear
            </button>
            <button
              onClick={() => setInput("Explain this better")}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm font-semibold transition"
            >
              🔍 Explain Better
            </button>
            <button
              onClick={() => setInput("Give me examples")}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm font-semibold transition"
            >
              📝 Examples
            </button>
            <button
              onClick={() => setInput("Practice mode")}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition"
            >
              🎯 Practice
            </button>
          </div>

          {/* Search Input */}
          {showSearch && (
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversation..."
                className="w-full px-4 py-2 rounded-full bg-gray-800 text-white placeholder-gray-400 border-2 border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              {filteredMessages.length > 0 && (
                <p className="text-center text-sm text-gray-400 mt-2">
                  Found {filteredMessages.length} matching message{filteredMessages.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}

          {/* Export Confirmation Modal */}
          {showExport && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Export Conversation</h3>
                <p className="text-gray-600 mb-6">
                  Download your conversation as a text file?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={exportConversation}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => setShowExport(false)}
                    className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Conversation Templates */}
          {showTemplates && (
            <div className="mb-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-4">
              <h3 className="text-white font-semibold mb-3 text-center">Quick Start Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {conversationTemplates[chatMode].map((template, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(template);
                      setShowTemplates(false);
                    }}
                    className="text-left px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition"
                  >
                    {template}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 h-96 overflow-y-auto mb-6 flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div key={msg.id} className={`max-w-lg ${msg.role === "user" ? "self-end" : "self-start"}`}>
                <div className={`px-6 py-4 rounded-2xl inline-block ${msg.role === "user" ? "bg-green-600" : "bg-gray-700"} text-white relative group`}>
                  <p>{msg.content}</p>
                  <div className="flex items-center justify-between mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-gray-300">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="flex gap-1">
                      {['👍', '❤️', '😂', '😮', '😢'].map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => {
                            setMessages(prev => prev.map(m =>
                              m.id === msg.id
                                ? { ...m, reactions: [...(m.reactions || []), emoji] }
                                : m
                            ));
                          }}
                          className="hover:scale-125 transition-transform text-sm"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {msg.reactions.map((reaction, idx) => (
                        <span key={idx} className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">
                          {reaction}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="self-start">
                <div className="bg-gray-700 px-6 py-4 rounded-2xl inline-block text-white">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span>AI dey think...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask AI anything... e.g. Teach me Graphics Design"
              className="flex-1 px-6 py-4 rounded-full bg-gray-800 text-white placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full"
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
