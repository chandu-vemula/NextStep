import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import CareerChat from '../features/CareerChat'
import SkillHub from '../features/SkillHub'
import PortfolioGenerator from '../features/PortfolioGenerator'
import {
  MessageSquare,
  Lightbulb,
  FileText,
  Settings,
  User,
  LogOut,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Briefcase,
  Menu,
  X,
  Home,
} from 'lucide-react'

function DashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    conversations: 0,
    skills: 0,
    profileComplete: 0,
  })

  useEffect(() => {
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    if (!user) return

    try {
      // Fetch profile to calculate completion
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        const fields = [
          profile.full_name,
          profile.headline,
          profile.about,
          profile.email,
          profile.skills?.length > 0,
          profile.experience?.length > 0,
          profile.education?.length > 0,
        ]
        const completed = fields.filter(Boolean).length
        const profileComplete = Math.round((completed / fields.length) * 100)

        setStats({
          conversations: 0, // Would come from chat_history count
          skills: profile.skills?.length || 0,
          profileComplete,
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Error signing out')
    } else {
      toast.success('Signed out successfully')
      navigate('/')
    }
  }

  const navigation = [
    {
      id: 'overview',
      name: 'Overview',
      icon: Home,
      description: 'Your career dashboard',
    },
    {
      id: 'career-chat',
      name: 'AI Career Chatbot',
      icon: MessageSquare,
      description: 'Get personalized career advice',
      badge: 'AI',
    },
    {
      id: 'skills',
      name: 'Skill Intelligence',
      icon: TrendingUp,
      description: 'Explore in-demand skills',
    },
    {
      id: 'portfolio',
      name: 'Portfolio Generator',
      icon: FileText,
      description: 'Create your professional portfolio',
    },
    {
      id: 'resume',
      name: 'Resume Builder',
      icon: Briefcase,
      description: 'Build an ATS-friendly resume',
      badge: 'Coming Soon',
    },
  ]

  const bottomNav = [
    { id: 'profile', name: 'Profile', icon: User, action: () => navigate('/profile') },
    { id: 'settings', name: 'Settings', icon: Settings },
    { id: 'logout', name: 'Logout', icon: LogOut, action: handleSignOut },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewContent navigation={navigation} setActiveSection={setActiveSection} stats={stats} />
      case 'career-chat':
        return <CareerChat />
      case 'skills':
        return <SkillHub />
      case 'portfolio':
        return <PortfolioGenerator />
      case 'resume':
        return <PlaceholderContent title="Resume Builder" description="Create an ATS-optimized resume that gets you noticed by recruiters." icon={Briefcase} comingSoon />
      default:
        return <OverviewContent navigation={navigation} setActiveSection={setActiveSection} stats={stats} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-transform duration-300 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <button
            onClick={() => navigate('/')}
            className="text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
          >
            <span className="text-cyan-400">Next</span>
            <span className="text-white">Step</span>
          </button>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 font-medium">{item.name}</span>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      item.badge === 'AI'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom navigation */}
        <div className="px-4 py-4 border-t border-slate-800 space-y-1">
          {bottomNav.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  item.id === 'logout'
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            )
          })}
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <User className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-lg font-semibold text-white capitalize hidden sm:block">
            {activeSection === 'career-chat' ? 'AI Career Chatbot' : activeSection.replace('-', ' ')}
          </h1>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  )
}

// Overview Content Component
function OverviewContent({ navigation, setActiveSection, stats }) {
  const features = navigation.filter((n) => n.id !== 'overview')

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="p-8 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-900 rounded-2xl border border-cyan-500/20">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome to <span className="text-cyan-400">NextStep</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Your AI-powered career intelligence platform. Start exploring the tools below to
          accelerate your professional growth.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800">
          <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.conversations}</div>
          <div className="text-slate-400">AI Conversations</div>
        </div>
        <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800">
          <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.skills}</div>
          <div className="text-slate-400">Skills Tracked</div>
        </div>
        <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800">
          <div className="text-3xl font-bold text-cyan-400 mb-1">{stats.profileComplete}%</div>
          <div className="text-slate-400">Profile Complete</div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Explore Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <button
                key={feature.id}
                onClick={() => setActiveSection(feature.id)}
                className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg text-cyan-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {feature.name}
                      </h3>
                      {feature.badge && (
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            feature.badge === 'AI'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Placeholder Content Component
function PlaceholderContent({ title, description, icon: Icon, comingSoon = false }) {
  return (
    <div className="max-w-2xl mx-auto h-full flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex p-4 bg-cyan-500/10 rounded-2xl text-cyan-400 mb-6">
          <Icon className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-slate-400 mb-6">{description}</p>
        {comingSoon ? (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-400 rounded-lg">
            <Lightbulb className="w-4 h-4" />
            Coming Soon
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg">
            <Sparkles className="w-4 h-4" />
            Feature Ready - Implementation Pending
          </span>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
