'use client'

import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

  const submitNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert("Please enter a valid email.");
      return;
    }
    setEmail("");
    alert("Thanks — you'll be notified about updates!");
  };

  return (
    <footer className="w-full mt-12 py-8 bg-transparent text-center text-sm text-gray-400" role="contentinfo">
      <div className="container">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="text-left">
            <h3 className="text-white font-bold text-lg">SkillBarterNG</h3>
            <p className="mt-2 text-sm text-gray-300">Connect locally. Teach a skill. Learn something new.</p>
            <p className="mt-4 text-xs">© {new Date().getFullYear()} SkillBarterNG</p>
          </div>

          <div className="text-left">
            <h4 className="text-white font-medium">Quick links</h4>
            <nav aria-label="Footer navigation" className="mt-3 flex flex-col gap-2">
              <a href="/dashboard" className="text-gray-300 hover:text-white">Dashboard</a>
              <a href="/profile" className="text-gray-300 hover:text-white">Profile</a>
              <a href="/signup" className="text-gray-300 hover:text-white">Sign up</a>
              <a href="/login" className="text-gray-300 hover:text-white">Log in</a>
            </nav>
          </div>

          <div className="text-left">
            <h4 className="text-white font-medium">Stay in touch</h4>
            <form onSubmit={submitNewsletter} className="mt-3 flex gap-2" aria-label="Subscribe to newsletter">
              <label htmlFor="footer-email" className="sr-only">Email</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="px-3 py-2 rounded bg-white/5 text-white placeholder-gray-400 border border-transparent focus:border-green-400 focus:outline-none"
              />
              <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white">Subscribe</button>
            </form>

            <div className="mt-4 flex items-center gap-3" aria-label="Social links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-300 hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 5.92c-.66.3-1.37.5-2.12.59.76-.46 1.34-1.19 1.61-2.06-.71.42-1.5.72-2.34.89A3.65 3.65 0 0015.5 4c-2.02 0-3.66 1.64-3.66 3.66 0 .29.03.57.1.84-3.04-.15-5.74-1.61-7.55-3.82-.32.56-.5 1.2-.5 1.88 0 1.3.66 2.45 1.66 3.12-.61-.02-1.18-.19-1.68-.47v.05c0 1.82 1.3 3.34 3.03 3.69-.32.09-.66.14-1.01.14-.25 0-.5-.02-.74-.07.5 1.55 1.94 2.68 3.65 2.71A7.33 7.33 0 013 19.54a10.32 10.32 0 005.6 1.64c6.72 0 10.4-5.57 10.4-10.4v-.47c.71-.5 1.32-1.12 1.8-1.83-.65.29-1.34.5-2.06.59z"/></svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-gray-300 hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.75 5.48.75 11.76c0 4.9 3.17 9.06 7.57 10.53.55.1.75-.24.75-.53v-1.85c-3.07.67-3.72-1.49-3.72-1.49-.5-1.28-1.22-1.62-1.22-1.62-.99-.67.08-.66.08-.66 1.09.08 1.67 1.12 1.67 1.12.97 1.66 2.55 1.18 3.17.9.1-.72.38-1.18.69-1.45-2.45-.28-5.02-1.22-5.02-5.43 0-1.2.43-2.18 1.12-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.29 3.02 1.12a10.5 10.5 0 015.5 0c2.1-1.41 3.02-1.12 3.02-1.12.6 1.52.22 2.64.11 2.92.7.77 1.12 1.76 1.12 2.95 0 4.22-2.58 5.15-5.04 5.42.39.34.74 1.03.74 2.08v3.09c0 .29.2.63.76.53 4.4-1.47 7.57-5.63 7.57-10.53C23.25 5.48 18.27.5 12 .5z"/></svg>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-300 hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 11.02 0H4.98zM3 8.98h4v12H3v-12zM9 8.98h3.84v1.64h.05c.54-1 1.88-2.05 3.87-2.05 4.14 0 4.9 2.72 4.9 6.26v7.15H19v-6.35c0-1.52-.03-3.48-2.12-3.48-2.12 0-2.45 1.66-2.45 3.38v6.45H9v-12z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-300 hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5.9A4.1 4.1 0 1016.1 12 4.1 4.1 0 0012 7.9zM18.5 6.2a1.2 1.2 0 11-1.2-1.2 1.2 1.2 0 011.2 1.2z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/5 pt-4 text-xs text-gray-500">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
            <div>Terms · Privacy · Contact</div>
            <div>Built with ❤️ — SkillBarterNG</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
