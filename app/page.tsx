import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
export default function Home() {
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 flex items-center justify-center relative overflow-hidden">
        {/* Background subtle pattern */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            SkillBarter<span className="text-green-400">NG</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Swap skills with fellow Nigerian students — Learn what you want, teach what you know. No money needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#get-started"
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300"
            >
              Get Started Free
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 bg-white bg-opacity-20 backdrop-blur-md hover:bg-opacity-30 text-white font-semibold rounded-full text-lg border border-white border-opacity-30 transition duration-300"
            >
              How It Works
            </Link>
          </div>
          <p className="mt-12 text-gray-300 text-sm">
            Built for Nigerian students, by a Nigerian student 🇳🇬
          </p>
        </div>

        {/* Floating subtle elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            How SkillBarterNG Works
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition duration-300">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sign Up Free</h3>
              <p className="text-gray-600">Create your profile in seconds with email or phone</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition duration-300">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-pink-600">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">List Your Skills</h3>
              <p className="text-gray-600">Add what you can teach and what you want to learn</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:scale-105 transition duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Swap & Grow</h3>
              <p className="text-gray-600">Connect, chat, teach, learn — build Naija together</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section id="get-started" className="py-20 bg-gradient-to-r from-purple-800 to-pink-700">
        <div className="text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Start Swapping Skills?
          </h2>
          <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
            Join hundreds of Nigerian students already learning for free.
          </p>
          <Link
            href="#"
            className="px-10 py-5 bg-white text-purple-800 font-bold rounded-full text-xl shadow-2xl hover:bg-gray-100 transform hover:scale-110 transition duration-300 inline-block"
          >
            Join SkillBarterNG Today
          </Link>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center">
        <p>© 2025 SkillBarterNG • Made with ❤️ in Nigeria</p>
      </footer>
    </>
  );
}