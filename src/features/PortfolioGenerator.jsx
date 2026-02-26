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
  ArrowRight,
  Calendar,
} from 'lucide-react'

const PORTFOLIO_THEMES = [
  { id: 'minimal', name: 'Minimal', description: 'Clean typography, no photo, elegant whitespace' },
  { id: 'modern', name: 'Modern', description: 'Bold gradients, vibrant colors, creative layout' },
  { id: 'professional', name: 'Professional', description: 'Classic structure, polished and corporate' },
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
      profile.experience?.length > 0,
      profile.education?.length > 0,
      profile.skills?.length > 0,
      profile.projects?.length > 0,
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
    await new Promise((resolve) => setTimeout(resolve, 2000))
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
                <CompletionItem done={profile?.experience?.length > 0} label="Work experience" />
                <CompletionItem done={profile?.education?.length > 0} label="Education" />
                <CompletionItem done={profile?.skills?.length > 0} label="At least one skill" />
                <CompletionItem done={profile?.projects?.length > 0} label="Projects" />
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
                <span className="ml-4 text-sm text-slate-500">Portfolio Preview — {PORTFOLIO_THEMES.find(t => t.id === selectedTheme)?.name}</span>
              </div>

              <div className="p-8">
                <PortfolioPreview profile={profile} theme={selectedTheme} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden min-h-[600px]">
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

/* ─────────────────────────────────────────────
   PREVIEW CARDS (shown in edit mode sidebar)
   ───────────────────────────────────────────── */
function PortfolioPreview({ profile, theme }) {
  if (!profile) {
    return (
      <div className="text-center text-slate-500 py-12">
        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Complete your profile to see the preview</p>
      </div>
    )
  }

  if (theme === 'minimal') return <MinimalPreviewCard profile={profile} />
  if (theme === 'modern') return <ModernPreviewCard profile={profile} />
  return <ProfessionalPreviewCard profile={profile} />
}

/* ── Minimal Preview Card ── */
function MinimalPreviewCard({ profile }) {
  return (
    <div className="max-w-2xl mx-auto font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-light tracking-wide text-white mb-1">
          {profile.full_name || 'Your Name'}
        </h1>
        <p className="text-sm text-slate-400 tracking-widest uppercase">
          {profile.headline || 'Your Headline'}
        </p>
        <div className="w-12 h-px bg-slate-600 mt-4" />
      </div>

      {profile.about && (
        <p className="text-slate-400 text-sm leading-relaxed mb-6">{profile.about}</p>
      )}

      {profile.skills?.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {profile.skills.slice(0, 6).map((skill, i) => (
              <span key={i} className="text-xs text-slate-300 border border-slate-700 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {profile.experience?.length > 0 && (
        <div className="space-y-3">
          {profile.experience.slice(0, 2).map((exp, i) => (
            <div key={i} className="flex gap-4">
              <span className="text-xs text-slate-500 w-20 flex-shrink-0 pt-0.5">
                {exp.startDate?.substring(0, 7)}
              </span>
              <div>
                <h3 className="text-sm font-medium text-white">{exp.position}</h3>
                <p className="text-xs text-slate-500">{exp.company}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Modern Preview Card ── */
function ModernPreviewCard({ profile }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-5 mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-fuchsia-500/20">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full rounded-2xl object-cover" />
          ) : (
            <span className="text-2xl font-bold text-white">{profile.full_name?.charAt(0) || '?'}</span>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{profile.full_name || 'Your Name'}</h1>
          <p className="text-sm text-fuchsia-400">{profile.headline || 'Your Headline'}</p>
        </div>
      </div>

      {profile.skills?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {profile.skills.slice(0, 6).map((skill, i) => (
            <span key={i} className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
              {skill}
            </span>
          ))}
        </div>
      )}

      {profile.experience?.length > 0 && (
        <div className="space-y-3">
          {profile.experience.slice(0, 2).map((exp, i) => (
            <div key={i} className="p-3 rounded-xl bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 border border-fuchsia-500/10">
              <h3 className="text-sm font-semibold text-white">{exp.position}</h3>
              <p className="text-xs text-fuchsia-400">{exp.company}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Professional Preview Card ── */
function ProfessionalPreviewCard({ profile }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mx-auto mb-3 flex items-center justify-center ring-4 ring-amber-500/20">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-white">{profile.full_name?.charAt(0) || '?'}</span>
          )}
        </div>
        <h1 className="text-xl font-bold text-white">{profile.full_name || 'Your Name'}</h1>
        <p className="text-sm text-amber-400">{profile.headline || 'Your Headline'}</p>
      </div>

      {profile.skills?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {profile.skills.slice(0, 6).map((skill, i) => (
            <span key={i} className="px-3 py-1 text-xs font-medium rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {skill}
            </span>
          ))}
        </div>
      )}

      {profile.experience?.length > 0 && (
        <div className="space-y-3">
          {profile.experience.slice(0, 2).map((exp, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border-l-2 border-amber-500">
              <Briefcase className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-white">{exp.position}</h3>
                <p className="text-xs text-amber-400/80">{exp.company}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   FULL PREVIEW TEMPLATES (Preview Mode)
   ───────────────────────────────────────────── */
function PortfolioFullPreview({ profile, theme }) {
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-100 text-slate-500 min-h-[600px]">
        <p>Complete your profile to see the full preview</p>
      </div>
    )
  }

  if (theme === 'minimal') return <MinimalPortfolio profile={profile} />
  if (theme === 'modern') return <ModernPortfolio profile={profile} />
  return <ProfessionalPortfolio profile={profile} />
}

/* ═══════════════════════════════════════════════
   1. MINIMAL PORTFOLIO
   Clean, text-focused, no photo, lots of whitespace
   ═══════════════════════════════════════════════ */
function MinimalPortfolio({ profile }) {
  return (
    <div className="min-h-[600px] bg-slate-950 text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="max-w-3xl mx-auto px-8 py-16">
        {/* Header — text only, no avatar */}
        <header className="mb-16">
          <h1 className="text-5xl font-extralight tracking-tight text-white mb-2">
            {profile.full_name || 'Your Name'}
          </h1>
          <p className="text-lg text-slate-400 tracking-widest uppercase font-light">
            {profile.headline || 'Your Headline'}
          </p>
          <div className="w-16 h-px bg-slate-700 mt-6" />
        </header>

        {/* About */}
        {profile.about && (
          <section className="mb-14">
            <p className="text-slate-400 leading-relaxed text-lg font-light max-w-2xl">
              {profile.about}
            </p>
          </section>
        )}

        {/* Contact row */}
        <div className="flex flex-wrap gap-6 mb-14 text-sm text-slate-500">
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" /> {profile.email}
            </a>
          )}
          {profile.location && (
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {profile.location}</span>
          )}
          {profile.phone && (
            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> {profile.phone}</span>
          )}
        </div>

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, i) => (
                <span key={i} className="text-sm text-slate-300 border border-slate-800 px-4 py-2 rounded-sm hover:border-slate-600 transition-colors">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-6">Experience</h2>
            <div className="space-y-8">
              {profile.experience.map((exp, i) => (
                <div key={i} className="grid grid-cols-[140px_1fr] gap-6">
                  <div className="text-sm text-slate-600">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{exp.position}</h3>
                    <p className="text-slate-500 text-sm">{exp.company}</p>
                    {exp.description && (
                      <p className="text-slate-400 text-sm mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {profile.education?.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-6">Education</h2>
            <div className="space-y-6">
              {profile.education.map((edu, i) => (
                <div key={i} className="grid grid-cols-[140px_1fr] gap-6">
                  <div className="text-sm text-slate-600">
                    {edu.startDate} — {edu.endDate}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{edu.degree}</h3>
                    <p className="text-slate-500 text-sm">{edu.institution}</p>
                    {edu.field && <p className="text-slate-600 text-xs mt-1">{edu.field}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {profile.projects?.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xs tracking-[0.2em] uppercase text-slate-500 mb-6">Projects</h2>
            <div className="space-y-6">
              {profile.projects.map((project, i) => (
                <div key={i} className="border-b border-slate-900 pb-6 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-medium">{project.name}</h3>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-white transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-slate-400 text-sm leading-relaxed">{project.description}</p>
                  )}
                  {project.technologies && (
                    <p className="text-slate-600 text-xs mt-2">{project.technologies}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        <footer className="pt-8 border-t border-slate-900 flex gap-4">
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          )}
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-white transition-colors">
              <Globe className="w-5 h-5" />
            </a>
          )}
        </footer>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   2. MODERN PORTFOLIO
   Bold gradients, vibrant purple-fuchsia-pink palette,
   creative card layouts, rounded corners
   ═══════════════════════════════════════════════ */
function ModernPortfolio({ profile }) {
  return (
    <div className="min-h-[600px] bg-[#0a0a1a] text-white">
      {/* Hero with gradient blob */}
      <div className="relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/30 via-fuchsia-600/20 to-transparent blur-3xl" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-pink-600/20 to-transparent blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-8 pt-20 pb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-36 h-36 rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 p-1 shadow-2xl shadow-fuchsia-500/20 flex-shrink-0">
              <div className="w-full h-full rounded-3xl bg-[#0a0a1a] flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full rounded-3xl object-cover" />
                ) : (
                  <span className="text-5xl font-bold bg-gradient-to-br from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    {profile.full_name?.charAt(0) || '?'}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                  {profile.full_name || 'Your Name'}
                </span>
              </h1>
              <p className="text-xl text-fuchsia-300/80 mb-4">{profile.headline || 'Your Headline'}</p>

              {/* Social links */}
              <div className="flex gap-3">
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-fuchsia-500/50 text-slate-400 hover:text-fuchsia-400 transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-fuchsia-500/50 text-slate-400 hover:text-fuchsia-400 transition-all">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-fuchsia-500/50 text-slate-400 hover:text-fuchsia-400 transition-all">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
                {profile.email && (
                  <a href={`mailto:${profile.email}`} className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-fuchsia-500/50 text-slate-400 hover:text-fuchsia-400 transition-all">
                    <Mail className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 pb-16">
        {/* About */}
        {profile.about && (
          <section className="mb-12">
            <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
              {profile.about}
            </p>
          </section>
        )}

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Tech Stack</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-5 py-2.5 rounded-2xl text-sm font-medium bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-violet-300 hover:border-fuchsia-500/40 transition-all hover:shadow-lg hover:shadow-fuchsia-500/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Experience</span>
            </h2>
            <div className="space-y-4">
              {profile.experience.map((exp, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-fuchsia-500/30 transition-all hover:shadow-lg hover:shadow-fuchsia-500/5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-fuchsia-300 transition-colors">{exp.position}</h3>
                      <p className="text-fuchsia-400/70">{exp.company}</p>
                    </div>
                    <span className="text-sm text-slate-500 flex items-center gap-1.5 mt-1 md:mt-0">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-400 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {profile.projects?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Projects</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {profile.projects.map((project, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 border border-white/[0.06] hover:border-fuchsia-500/30 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-fuchsia-400 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-slate-400 text-sm mb-3 leading-relaxed">{project.description}</p>
                  )}
                  {project.technologies && (
                    <p className="text-xs text-fuchsia-400/60">{project.technologies}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {profile.education?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Education</span>
            </h2>
            <div className="space-y-4">
              {profile.education.map((edu, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-3 mb-1">
                    <GraduationCap className="w-5 h-5 text-fuchsia-400" />
                    <h3 className="font-semibold text-white">{edu.degree}</h3>
                  </div>
                  <p className="text-fuchsia-400/70 ml-8">{edu.institution}</p>
                  {edu.field && <p className="text-slate-500 text-sm ml-8">{edu.field}</p>}
                  <p className="text-slate-600 text-xs ml-8 mt-1">{edu.startDate} — {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <footer className="pt-8 border-t border-white/[0.06] text-center">
          <p className="text-slate-500 mb-4">Let's connect</p>
          <div className="flex items-center justify-center gap-6 text-slate-400">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-sm hover:text-fuchsia-400 transition-colors">
                <Mail className="w-4 h-4" /> {profile.email}
              </a>
            )}
            {profile.phone && (
              <span className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" /> {profile.phone}
              </span>
            )}
            {profile.location && (
              <span className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" /> {profile.location}
              </span>
            )}
          </div>
        </footer>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   3. PROFESSIONAL PORTFOLIO
   Classic, corporate feel with warm amber/gold accent,
   structured sections, centered photo, serif-like headers
   ═══════════════════════════════════════════════ */
function ProfessionalPortfolio({ profile }) {
  return (
    <div className="min-h-[600px] bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-900/30 via-slate-900 to-amber-900/30 border-b border-amber-500/10">
        <div className="max-w-4xl mx-auto px-8 py-16 text-center">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-gradient-to-br from-amber-400 to-orange-500 p-1 shadow-xl shadow-amber-500/10">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-amber-400">
                  {profile.full_name?.charAt(0) || '?'}
                </span>
              )}
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">{profile.full_name || 'Your Name'}</h1>
          <p className="text-lg text-amber-400/80 mb-4">{profile.headline || 'Your Headline'}</p>

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400 mb-6">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                <Mail className="w-4 h-4" /> {profile.email}
              </a>
            )}
            {profile.phone && (
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {profile.phone}</span>
            )}
            {profile.location && (
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.location}</span>
            )}
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-3">
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-800 border border-slate-700 hover:border-amber-500/50 hover:text-amber-400 text-slate-400 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-800 border border-slate-700 hover:border-amber-500/50 hover:text-amber-400 text-slate-400 transition-all">
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-slate-800 border border-slate-700 hover:border-amber-500/50 hover:text-amber-400 text-slate-400 transition-all">
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* About */}
        {profile.about && (
          <section className="mb-12">
            <SectionHeader title="About" icon={<User className="w-5 h-5" />} />
            <p className="text-slate-300 leading-relaxed text-lg">{profile.about}</p>
          </section>
        )}

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <section className="mb-12">
            <SectionHeader title="Core Competencies" icon={<Code className="w-5 h-5" />} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {profile.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-sm text-slate-300">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {profile.experience?.length > 0 && (
          <section className="mb-12">
            <SectionHeader title="Professional Experience" icon={<Briefcase className="w-5 h-5" />} />
            <div className="space-y-6">
              {profile.experience.map((exp, i) => (
                <div key={i} className="relative pl-8 pb-6 border-l-2 border-slate-800 last:pb-0">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-amber-500 border-4 border-slate-950" />
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{exp.position}</h3>
                      <p className="text-amber-400/80 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm text-slate-500 mt-1 md:mt-0">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-slate-400 leading-relaxed mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {profile.education?.length > 0 && (
          <section className="mb-12">
            <SectionHeader title="Education" icon={<GraduationCap className="w-5 h-5" />} />
            <div className="space-y-4">
              {profile.education.map((edu, i) => (
                <div key={i} className="p-5 rounded-xl bg-slate-800/30 border border-slate-800">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{edu.degree}</h3>
                      <p className="text-amber-400/70">{edu.institution}</p>
                      {edu.field && <p className="text-slate-500 text-sm">{edu.field}</p>}
                    </div>
                    <span className="text-sm text-slate-500 mt-1 md:mt-0">{edu.startDate} — {edu.endDate}</span>
                  </div>
                  {edu.description && (
                    <p className="text-slate-400 text-sm mt-3">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {profile.projects?.length > 0 && (
          <section className="mb-12">
            <SectionHeader title="Key Projects" icon={<FileText className="w-5 h-5" />} />
            <div className="grid md:grid-cols-2 gap-4">
              {profile.projects.map((project, i) => (
                <div key={i} className="p-5 rounded-xl bg-slate-800/30 border border-slate-800 hover:border-amber-500/30 transition-all group">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors">{project.name}</h3>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-amber-400 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-slate-400 text-sm leading-relaxed mb-2">{project.description}</p>
                  )}
                  {project.technologies && (
                    <p className="text-amber-500/50 text-xs">{project.technologies}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} {profile.full_name || 'Portfolio'}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}

function SectionHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="flex-1 h-px bg-slate-800 ml-2" />
    </div>
  )
}

export default PortfolioGenerator
