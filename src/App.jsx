import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-semibold tracking-tight">NextStep</div>
          <div className="flex gap-3">
            <button className="px-5 py-2 text-sm font-medium border border-gray-300 hover:border-gray-400 transition-colors">
              Login
            </button>
            <button className="px-5 py-2 text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6">
        <div className="pt-24 pb-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
              AI-Driven Career Intelligence Platform
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Get personalized career guidance, discover in-demand skills, and create professional portfolios 
              that get you noticed by recruiters.
            </p>
            <button className="px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
              Get Started
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-16 border-t border-gray-200">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-lg font-semibold mb-3">AI Career Chatbot</h3>
              <p className="text-gray-600 leading-relaxed">
                Have natural conversations about your career goals and get personalized recommendations 
                based on your skills and the current job market.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Skill Intelligence Hub</h3>
              <p className="text-gray-600 leading-relaxed">
                Explore in-demand skills, understand market trends, and find curated learning resources 
                to advance your career.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Portfolio Generator</h3>
              <p className="text-gray-600 leading-relaxed">
                Transform your resume into a professional portfolio website with a shareable link, 
                optimized to impress recruiters.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16 border-t border-gray-200">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="text-2xl font-bold text-gray-300 w-12">01</div>
              <div>
                <h4 className="font-semibold mb-2">Explore Your Career Path</h4>
                <p className="text-gray-600">
                  Chat with our AI to discover career options that match your background and aspirations.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-2xl font-bold text-gray-300 w-12">02</div>
              <div>
                <h4 className="font-semibold mb-2">Learn What Matters</h4>
                <p className="text-gray-600">
                  Identify skill gaps and access curated courses to build the expertise employers want.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-2xl font-bold text-gray-300 w-12">03</div>
              <div>
                <h4 className="font-semibold mb-2">Stand Out to Recruiters</h4>
                <p className="text-gray-600">
                  Generate a professional portfolio that showcases your qualifications in the best light.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 border-t border-gray-200">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to take the next step?</h2>
            <p className="text-gray-600 mb-8">
              Join thousands of professionals who are advancing their careers with NextStep.
            </p>
            <button className="px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors">
              Create Your Account
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © 2026 NextStep. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-black transition-colors">About</a>
              <a href="#" className="hover:text-black transition-colors">Privacy</a>
              <a href="#" className="hover:text-black transition-colors">Terms</a>
              <a href="#" className="hover:text-black transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App