import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-80 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          SkillBarter<span className="text-green-400">NG</span>
        </Link>

        <div className="hidden md:flex space-x-8">
          <Link href="#how-it-works" className="text-gray-300 hover:text-white transition">
            How It Works
          </Link>
          <Link href="/signup" className="text-gray-300 hover:text-white transition">
            Sign Up
          </Link>
          <Link href="/login" className="text-gray-300 hover:text-white transition">
            Log In
          </Link>
        </div>

        {/* Mobile menu button - we add full mobile menu later */}
        <div className="md:hidden">
          <button className="text-white text-3xl">☰</button>
        </div>
      </div>
    </nav>
  );
}