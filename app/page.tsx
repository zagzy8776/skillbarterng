'use client';

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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          >
            SkillBarter<span className="text-emerald-400">NG</span>
            <Sparkles className="inline-block ml-2 w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Swap skills with fellow Nigerian students — Learn what you want, teach what you know. 
            <span className="text-emerald-300 font-medium"> No money needed.</span>
          </motion.p>
          
          {/* Social Proof Numbers */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-6 mb-8 text-white"
          >
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-300">2,500+</div>
              <div className="text-sm text-gray-300">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-pink-300">15,000+</div>
              <div className="text-sm text-gray-300">Skills Swapped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-300">50+</div>
              <div className="text-sm text-gray-300">Universities</div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/signup"
              className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-full text-base sm:text-lg shadow-xl transform hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
            >
              Start Swapping Skills Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#how-it-works"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white bg-opacity-20 backdrop-blur-md hover:bg-opacity-30 text-white font-semibold rounded-full text-base sm:text-lg border border-white border-opacity-30 transition duration-300 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              See How It Works
            </Link>
          </motion.div>
          
          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-8 flex flex-wrap justify-center items-center gap-4 text-sm text-gray-300"
          >
            <div className="flex items-center gap-1">
              <div className="flex text-yellow-400 text-sm">★★★★★</div>
              <span>4.9/5 Rating</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-1">
              <span>✅</span>
              <span>100% Free</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span>Student Verified</span>
            </div>
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

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition duration-300 border-t-4 border-emerald-500 relative"
            >
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-emerald-600 mb-4">List Your Skills</h3>
              <p className="text-gray-600 text-sm mb-4">Add skills you can teach and specify what you want to learn. Set your availability and preferences.</p>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Skills I Can Teach</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>Skills I Want to Learn</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Set Availability</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition duration-300 border-t-4 border-purple-500 relative"
            >
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-purple-600 mb-4">Find Perfect Partners</h3>
              <p className="text-gray-600 text-sm mb-4">Our smart matching connects you with compatible students. Filter by location, skill level, and availability.</p>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Smart Algorithm Matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>University & Location Filter</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Skill Level Compatibility</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition duration-300 border-t-4 border-pink-500 relative"
            >
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-pink-600 mb-4">Start Swapping Skills</h3>
              <p className="text-gray-600 text-sm mb-4">Propose skill exchanges, schedule sessions, and start learning! Track progress and earn achievement points.</p>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Propose Swap Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>In-App Messaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Track Progress & Earn Points</span>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Quick Stats During Process */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-50 to-purple-50 rounded-2xl p-8 mb-16"
          >
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
              What Happens During Your Skill Swap Journey?
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">📋</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Profile Setup</h4>
                <p className="text-sm text-gray-600">Create your learning profile in 2 minutes</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">🎯</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Get Matched</h4>
                <p className="text-sm text-gray-600">AI finds your perfect skill partners</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">💬</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Connect & Chat</h4>
                <p className="text-sm text-gray-600">Message safely within our platform</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white font-bold">🎓</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Learn & Grow</h4>
                <p className="text-sm text-gray-600">Complete swaps and earn achievements</p>
              </div>
            </div>
          </motion.div>

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

      {/* Enhanced CTA Footer */}
      <section id="get-started" className="py-20 bg-gradient-to-br from-emerald-600 via-purple-600 to-pink-600">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Start Swapping Skills?
            </h2>
            <p className="text-lg sm:text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join <span className="font-bold text-yellow-300">2,500+ Nigerian students</span> already learning for free. 
              No registration fees, no hidden costs.
            </p>
            
            {/* Urgency and Benefits */}
            <div className="flex flex-wrap justify-center gap-6 mb-10 text-white">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="font-medium">Setup in 2 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span className="font-medium">Find matches instantly</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🆓</span>
                <span className="font-medium">100% Free Forever</span>
              </div>
            </div>
            
            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/signup"
                className="group px-8 sm:px-10 py-4 sm:py-5 bg-white text-emerald-700 font-bold rounded-full text-lg sm:text-xl shadow-2xl hover:bg-gray-50 transform hover:scale-105 transition duration-300 flex items-center gap-2"
              >
                Start Learning Free Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-8 sm:px-10 py-4 sm:py-5 bg-white bg-opacity-20 backdrop-blur-md hover:bg-opacity-30 text-white font-semibold rounded-full text-lg sm:text-xl border border-white border-opacity-30 transition duration-300"
              >
                Already a Member? Log In
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-emerald-200">
              <div className="flex items-center gap-1">
                <span>✅</span>
                <span>No credit card required</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-emerald-300 rounded-full"></div>
              <div className="flex items-center gap-1">
                <span>🔒</span>
                <span>Student-verified accounts</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-emerald-300 rounded-full"></div>
              <div className="flex items-center gap-1">
                <span>🏆</span>
                <span>15,000+ skills swapped</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-2">2,500+</div>
              <div className="text-gray-600 font-medium">Active Students</div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">15,000+</div>
              <div className="text-gray-600 font-medium">Skills Exchanged</div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-pink-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Universities</div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-2">4.9★</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Skills Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Most Popular Skills Being Swapped
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See what Nigerian students are teaching and learning right now
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Graphics Design", teachers: 68, learners: 142, emoji: "🎨", color: "from-pink-500 to-purple-500" },
              { name: "Python Programming", teachers: 49, learners: 89, emoji: "🐍", color: "from-blue-500 to-indigo-500" },
              { name: "Video Editing", teachers: 55, learners: 128, emoji: "🎬", color: "from-red-500 to-pink-500" },
              { name: "Digital Marketing", teachers: 61, learners: 115, emoji: "📈", color: "from-green-500 to-emerald-500" },
              { name: "Crypto Trading", teachers: 38, learners: 105, emoji: "₿", color: "from-yellow-500 to-orange-500" },
              { name: "Public Speaking", teachers: 42, learners: 92, emoji: "🎤", color: "from-purple-500 to-indigo-500" }
            ].map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 p-6 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${skill.color} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
                  {skill.emoji}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{skill.name}</h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-600 font-medium">{skill.teachers} teachers</span>
                  <span className="text-purple-600 font-medium">{skill.learners} learners</span>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 bg-gradient-to-r ${skill.color} rounded-full`}
                    style={{ width: `${(skill.teachers / (skill.teachers + skill.learners)) * 100}%` }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-full text-lg shadow-lg transform hover:scale-105 transition duration-300"
            >
              Join and Start Swapping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center">
        <p>© 2025 SkillBarterNG • Made with ❤️ in Nigeria</p>
      </footer>
    </>
  );
}
