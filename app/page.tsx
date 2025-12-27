import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen, Heart } from "lucide-react";
export default function Home() {
  return (
    <>
      <Navbar />
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-950 flex items-center justify-center relative overflow-hidden"
      >
        {/* Background subtle pattern */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            SkillBarter<span className="text-green-400">NG</span>
            <Sparkles className="inline-block ml-2 w-8 h-8 text-yellow-400" />
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto font-light italic"
          >
            Swap skills with fellow Nigerian students — Learn what you want, teach what you know. No money needed.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="#get-started"
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300 flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 bg-white bg-opacity-20 backdrop-blur-md hover:bg-opacity-30 text-white font-semibold rounded-full text-lg border border-white border-opacity-30 transition duration-300 flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              How It Works
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-12 text-gray-300 text-sm flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 text-red-400" />
            Built for Nigerian students, by a Nigerian student 🇳🇬
            <Heart className="w-4 h-4 text-red-400" />
          </motion.p>
        </motion.div>

        {/* Floating subtle elements */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"
        />
      </motion.section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              How SkillBarter<span className="text-green-500">NG</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to start swapping skills with fellow Nigerian students. No money, just knowledge sharing!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition duration-300 border-t-4 border-purple-500">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📝</span>
              </div>
              <div className="text-sm font-bold text-purple-600 mb-2">STEP 1</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Sign Up Free</h3>
              <p className="text-gray-600 text-sm">Create your account in under 2 minutes with just your email. It's completely free!</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition duration-300 border-t-4 border-pink-500">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-sm font-bold text-pink-600 mb-2">STEP 2</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Set Your Skills</h3>
              <p className="text-gray-600 text-sm">Tell us what you can teach and what you want to learn. Choose from popular skills or add your own.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition duration-300 border-t-4 border-blue-500">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔍</span>
              </div>
              <div className="text-sm font-bold text-blue-600 mb-2">STEP 3</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Find Matches</h3>
              <p className="text-gray-600 text-sm">Browse potential swap partners from your school or across Nigeria. See who's teaching what you want!</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition duration-300 border-t-4 border-green-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💬</span>
              </div>
              <div className="text-sm font-bold text-green-600 mb-2">STEP 4</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Connect & Swap</h3>
              <p className="text-gray-600 text-sm">Send a swap request, chat, arrange a session, and start learning! Build connections while gaining skills.</p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
              Why Choose SkillBarterNG?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🇳🇬</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Made for Nigerians</h4>
                <p className="text-gray-600">Designed specifically for Nigerian students with local universities, slang, and cultural context.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔒</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Safe & Secure</h4>
                <p className="text-gray-600">Verified student accounts, secure messaging, and community guidelines keep everyone safe.</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📈</span>
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Track Progress</h4>
                <p className="text-gray-600">See your skill growth, completed swaps, and connections. Build your learning portfolio!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              What Students Are Saying
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from Nigerian students who've transformed their skills through SkillBarterNG
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
                <span className="ml-2 text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-6 italic">
                &apos;I learned Python from a UNILAG student\'s and now I can build apps! The platform connected me with amazing tutors who made complex concepts simple.&apos;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  AO
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-800">Adeola Ogunleye</div>
                  <div className="text-sm text-gray-600">University of Lagos</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
                <span className="ml-2 text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-6 italic">
                &apos;As a graphics design student&apos;s, I taught 5 classmates Canva skills and learned forex trading. Best skill exchange platform in Nigeria!&apos;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  CI
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-800">Chioma Igwe</div>
                  <div className="text-sm text-gray-600">Covenant University</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-pink-500">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  ★★★★★
                </div>
                <span className="ml-2 text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-6 italic">
                &apos;The community is amazing! I got interview prep tips from an OAU student&apos;s and now I have my dream job. SkillBarterNG changed my life.&apos;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  TO
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-800">Tunde Okafor</div>
                  <div className="text-sm text-gray-600">Obafemi Awolowo University</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-green-100 rounded-full px-6 py-3">
              <span className="text-2xl mr-2">🌟</span>
              <span className="text-green-800 font-semibold">4.9/5 average rating from 2,500+ students</span>
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