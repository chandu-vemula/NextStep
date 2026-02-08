import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import {
  FileText,
  Eye,
  Download,
  Share2,
  Copy,
  Check,
  Loader2,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from 'lucide-react'

const PORTFOLIO_THEMES = [
  { id: 'minimal', name: 'Minimal', description: 'Clean and simple design' },
  { id: 'modern', name: 'Modern', description: 'Bold and contemporary' },
  { id: 'professional', name: 'Professional', description: 'Traditional and elegant' },
]

function PortfolioGenerator() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('minimal')
  const [previewMode, setPreviewMode] = useState(false)
  const [portfolioUrl, setPortfolioUrl] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile({
          ...data,
          skills: data.skills || [],
          experience: data.experience || [],
          education: data.education || [],
          projects: data.projects || [],
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateProfileCompletion = () => {
    if (!profile) return 0

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
    return Math.round((completed / fields.length) * 100)
  }

  const generatePortfolio = async () => {
    if (calculateProfileCompletion() < 50) {
      toast.error('Please complete at least 50% of your profile first')
      return
    }

    setGenerating(true)

    // Simulate portfolio generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a unique portfolio URL (in production, this would be a real URL)
    const portfolioId = `${user.id.substring(0, 8)}-${Date.now().toString(36)}`
    setPortfolioUrl(`https://nextstep.dev/portfolio/${portfolioId}`)
    setGenerating(false)
    toast.success('Portfolio generated successfully!')
  }

  const copyToClipboard = async () => {
    if (portfolioUrl) {
      await navigator.clipboard.writeText(portfolioUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const completion = calculateProfileCompletion()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <FileText className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Portfolio Generator</h1>
            <p className="text-sm text-slate-400">Create a stunning portfolio website</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              previewMode
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
        </div>
      </div>

      {!previewMode ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Completion */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-sm font-medium text-slate-400 mb-4">PROFILE COMPLETION</h2>
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-white">{completion}%</span>
                  {completion < 50 && (
                    <span className="text-xs text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Min 50% required
                    </span>
                  )}
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      completion >= 50 ? 'bg-cyan-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <CompletionItem done={!!profile?.full_name} label="Full name" />
                <CompletionItem done={!!profile?.headline} label="Professional headline" />
                <CompletionItem done={!!profile?.about} label="About section" />
                <CompletionItem done={!!profile?.email} label="Contact email" />
                <CompletionItem done={profile?.skills?.length > 0} label="At least one skill" />
                <CompletionItem done={profile?.experience?.length > 0} label="Work experience" />
                <CompletionItem done={profile?.education?.length > 0} label="Education" />
              </div>
            </div>

            {/* Theme Selection */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-sm font-medium text-slate-400 mb-4">PORTFOLIO THEME</h2>
              <div className="space-y-2">
                {PORTFOLIO_THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedTheme === theme.id
                        ? 'bg-cyan-500/10 border border-cyan-500/50'
                        : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-medium text-white">{theme.name}</div>
                    <div className="text-xs text-slate-400">{theme.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePortfolio}
              disabled={generating || completion < 50}
              className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 disabled:text-slate-500 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Portfolio
                </>
              )}
            </button>

            {/* Portfolio URL */}
            {portfolioUrl && (
              <div className="bg-slate-900/50 rounded-xl border border-cyan-500/30 p-4">
                <div className="flex items-center gap-2 text-cyan-400 mb-3">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Portfolio Ready!</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={portfolioUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Open
                  </button>
                  <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Preview Card */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-slate-500">Portfolio Preview</span>
              </div>

              <div className="p-8">
                <PortfolioPreview profile={profile} theme={selectedTheme} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden min-h-[600px]">
          <PortfolioFullPreview profile={profile} theme={selectedTheme} />
        </div>
      )}
    </div>
  )
}

function CompletionItem({ done, label }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center ${
          done ? 'bg-cyan-500' : 'bg-slate-700'
        }`}
      >
        {done && <Check className="w-3 h-3 text-slate-950" />}
      </div>
      <span className={done ? 'text-slate-300' : 'text-slate-500'}>{label}</span>
    </div>
  )
}

function PortfolioPreview({ profile, theme }) {
  if (!profile) {
    return (
      <div className="text-center text-slate-500 py-12">
        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Complete your profile to see the preview</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 mx-auto mb-4 flex items-center justify-center">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-3xl font-bold text-white">
              {profile.full_name?.charAt(0) || '?'}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {profile.full_name || 'Your Name'}
        </h1>
        <p className="text-cyan-400 mb-3">{profile.headline || 'Your Headline'}</p>

        {/* Contact links */}
        <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
          {profile.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {profile.email}
            </span>
          )}
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {profile.location}
            </span>
          )}
        </div>
      </div>

      {/* About */}
      {profile.about && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">About</h2>
          <p className="text-slate-400 leading-relaxed">{profile.about}</p>
        </div>
      )}

      {/* Skills */}
      {profile.skills?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {profile.experience?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">Experience</h2>
          <div className="space-y-4">
            {profile.experience.slice(0, 2).map((exp, i) => (
              <div key={i} className="border-l-2 border-cyan-500 pl-4">
                <h3 className="font-medium text-white">{exp.position}</h3>
                <p className="text-sm text-cyan-400">{exp.company}</p>
                <p className="text-xs text-slate-500">
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {profile.education?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">Education</h2>
          <div className="space-y-4">
            {profile.education.slice(0, 2).map((edu, i) => (
              <div key={i} className="border-l-2 border-slate-600 pl-4">
                <h3 className="font-medium text-white">{edu.degree}</h3>
                <p className="text-sm text-slate-400">{edu.institution}</p>
                <p className="text-xs text-slate-500">{edu.field}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PortfolioFullPreview({ profile, theme }) {
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100 text-slate-500">
        <p>Complete your profile to see the full preview</p>
      </div>
    )
  }

  return (
    <div className="min-h-[600px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-16">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 mx-auto mb-6 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-5xl font-bold text-white">
                {profile.full_name?.charAt(0) || '?'}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-2">{profile.full_name || 'Your Name'}</h1>
          <p className="text-xl text-cyan-400 mb-4">{profile.headline || 'Your Headline'}</p>
          <p className="text-slate-400 max-w-2xl mx-auto">{profile.about}</p>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {profile.linkedin && (
              <a href={profile.linkedin} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <Linkedin className="w-5 h-5 text-slate-400" />
              </a>
            )}
            {profile.github && (
              <a href={profile.github} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <Github className="w-5 h-5 text-slate-400" />
              </a>
            )}
            {profile.website && (
              <a href={profile.website} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <Globe className="w-5 h-5 text-slate-400" />
              </a>
            )}
          </div>
        </div>

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">Skills</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">Experience</h2>
            <div className="space-y-6">
              {profile.experience.map((exp, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{exp.position}</h3>
                      <p className="text-cyan-400">{exp.company}</p>
                    </div>
                    <span className="text-sm text-slate-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-400 mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {profile.projects?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-6">Projects</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {profile.projects.map((project, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
                  <p className="text-slate-400 text-sm mb-3">{project.description}</p>
                  {project.technologies && (
                    <p className="text-xs text-cyan-400">{project.technologies}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="text-center py-12 border-t border-slate-700">
          <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
          <div className="flex items-center justify-center gap-6 text-slate-400">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                <Mail className="w-5 h-5" />
                {profile.email}
              </a>
            )}
            {profile.phone && (
              <span className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {profile.phone}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioGenerator
