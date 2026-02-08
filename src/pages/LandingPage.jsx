import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import { LogOut, User } from 'lucide-react'

function LandingPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Error signing out')
    } else {
      toast.success('Signed out successfully')
    }
  }

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-semibold tracking-tight">
            <span className="text-cyan-400">Next</span>Step
          </Link>
          <div className="flex gap-3 items-center">
            {user ? (
              <>
                <button
                  onClick={handleSignOut}
                  className="px-5 py-2 text-sm font-medium border border-slate-600 hover:border-red-400 hover:text-red-400 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="p-2 bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors rounded-full"
                >
                  <User className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-medium border border-slate-600 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 text-sm font-medium bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6">
        <div className="pt-24 pb-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
              AI-Driven <span className="text-cyan-400">Career Intelligence</span> Platform
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              Get personalized career guidance, discover in-demand skills, and create professional portfolios
              that get you noticed by recruiters.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-8 py-3 bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-16 border-t border-slate-800">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-colors">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">AI Career Chatbot</h3>
              <p className="text-slate-400 leading-relaxed">
                Have natural conversations about your career goals and get personalized recommendations
                based on your skills and the current job market.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-colors">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">Skill Intelligence Hub</h3>
              <p className="text-slate-400 leading-relaxed">
                Explore in-demand skills, understand market trends, and find curated learning resources
                to advance your career.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-colors">
              <h3 className="text-lg font-semibold mb-3 text-cyan-400">Portfolio Generator</h3>
              <p className="text-slate-400 leading-relaxed">
                Transform your resume into a professional portfolio website with a shareable link,
                optimized to impress recruiters.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16 border-t border-slate-800">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="text-2xl font-bold text-cyan-500 w-12">01</div>
              <div>
                <h4 className="font-semibold mb-2">Explore Your Career Path</h4>
                <p className="text-slate-400">
                  Chat with our AI to discover career options that match your background and aspirations.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-2xl font-bold text-cyan-500 w-12">02</div>
              <div>
                <h4 className="font-semibold mb-2">Learn What Matters</h4>
                <p className="text-slate-400">
                  Identify skill gaps and access curated courses to build the expertise employers want.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-2xl font-bold text-cyan-500 w-12">03</div>
              <div>
                <h4 className="font-semibold mb-2">Stand Out to Recruiters</h4>
                <p className="text-slate-400">
                  Generate a professional portfolio that showcases your qualifications in the best light.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 border-t border-slate-800">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to take the <span className="text-cyan-400">next step</span>?</h2>
            <p className="text-slate-400 mb-8">
              Join thousands of professionals who are advancing their careers with NextStep.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-8 py-3 bg-cyan-500 text-slate-950 font-medium hover:bg-cyan-400 transition-colors"
            >
              {user ? 'Go to Dashboard' : 'Create Your Account'}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-slate-500">
              © 2026 NextStep. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-slate-500">
              <a href="#" className="hover:text-cyan-400 transition-colors">About</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
