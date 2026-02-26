import React, { useState, useEffect } from 'react'
import { sendMessage } from '../lib/gemini'
import {
  TrendingUp,
  Search,
  BookOpen,
  ExternalLink,
  Loader2,
  Star,
  Clock,
  DollarSign,
  Briefcase,
  ChevronRight,
  Sparkles,
  Code,
  Palette,
  BarChart,
  Users,
  Shield,
  Cloud,
  Cpu,
  Megaphone,
  RefreshCw,
} from 'lucide-react'

const SKILL_CATEGORIES = [
  { id: 'programming', name: 'Programming', icon: Code, color: 'cyan' },
  { id: 'design', name: 'Design', icon: Palette, color: 'pink' },
  { id: 'data', name: 'Data Science', icon: BarChart, color: 'purple' },
  { id: 'management', name: 'Management', icon: Users, color: 'orange' },
  { id: 'security', name: 'Cybersecurity', icon: Shield, color: 'red' },
  { id: 'cloud', name: 'Cloud & DevOps', icon: Cloud, color: 'blue' },
  { id: 'ai', name: 'AI & ML', icon: Cpu, color: 'emerald' },
  { id: 'marketing', name: 'Marketing', icon: Megaphone, color: 'yellow' },
]

function SkillHub() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [skillAnalysis, setSkillAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [trendingSkills, setTrendingSkills] = useState([])
  const [trendingLoading, setTrendingLoading] = useState(true)
  const [trendingError, setTrendingError] = useState(false)

  useEffect(() => {
    fetchTrendingSkills()
  }, [])

  const fetchTrendingSkills = async () => {
    setTrendingLoading(true)
    setTrendingError(false)

    try {
      const prompt = `List the top 8 most in-demand and trending tech/professional skills in the job market right now in ${new Date().getFullYear()}. For each skill provide:
- name: the skill name
- demand: a number from 60-98 representing current job market demand percentage
- growth: year-over-year growth as a string like "+120%"
- category: one of these exact values: programming, design, data, management, security, cloud, ai, marketing

Respond ONLY with a valid JSON array, no markdown, no explanation. Example format:
[{"name":"Skill Name","demand":90,"growth":"+120%","category":"ai"}]`

      const response = await sendMessage([{ role: 'user', content: prompt }])

      // Extract JSON from response (handle potential markdown wrapping)
      let jsonStr = response.trim()
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
      }

      const skills = JSON.parse(jsonStr)

      if (Array.isArray(skills) && skills.length > 0) {
        setTrendingSkills(skills.slice(0, 8))
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Error fetching trending skills:', error)
      setTrendingError(true)
      // Fallback to avoid empty state
      setTrendingSkills([
        { name: 'Generative AI', demand: 95, growth: '+180%', category: 'ai' },
        { name: 'Prompt Engineering', demand: 88, growth: '+250%', category: 'ai' },
        { name: 'Kubernetes', demand: 85, growth: '+45%', category: 'cloud' },
        { name: 'Rust', demand: 78, growth: '+120%', category: 'programming' },
        { name: 'Data Engineering', demand: 90, growth: '+65%', category: 'data' },
        { name: 'Product Management', demand: 82, growth: '+30%', category: 'management' },
      ])
    } finally {
      setTrendingLoading(false)
    }
  }

  const analyzeSkill = async (skillName) => {
    setSelectedSkill(skillName)
    setIsLoading(true)

    try {
      const prompt = `Provide a comprehensive analysis of "${skillName}" as a career skill. Include:

1. **Overview**: Brief description of the skill and its importance (2-3 sentences)
2. **Market Demand**: Current job market demand and trends
3. **Salary Impact**: How this skill affects earning potential
4. **Learning Path**: Recommended steps to learn this skill (3-5 steps)
5. **Top Resources**: 3-4 specific learning resources (courses, books, websites)
6. **Related Skills**: 4-5 complementary skills to learn
7. **Job Roles**: 3-4 job titles that require this skill

Format with clear sections and bullet points. Be specific with resource names and realistic with assessments.`

      const response = await sendMessage([{ role: 'user', content: prompt }])
      setSkillAnalysis(response)
    } catch (error) {
      console.error('Error analyzing skill:', error)
      setSkillAnalysis('Unable to analyze skill. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      analyzeSkill(searchQuery.trim())
    }
  }

  const formatAnalysis = (content) => {
    if (!content) return null

    return content.split('\n').map((line, i) => {
      // Headers
      if (line.includes('**') && line.includes(':')) {
        const headerText = line.replace(/\*\*/g, '').replace(/:$/, '')
        return (
          <h3 key={i} className="text-lg font-semibold text-cyan-400 mt-6 mb-3 first:mt-0">
            {headerText}
          </h3>
        )
      }
      // Bold text
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
      // Bullet points
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={i} className="ml-4 mb-1 text-slate-300" dangerouslySetInnerHTML={{ __html: line.substring(2) }} />
        )
      }
      // Numbered lists
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <li key={i} className="ml-4 mb-1 list-decimal text-slate-300" dangerouslySetInnerHTML={{ __html: line.replace(/^\d+\.\s/, '') }} />
        )
      }
      // Regular text
      return line.trim() ? (
        <p key={i} className="mb-2 text-slate-300" dangerouslySetInnerHTML={{ __html: line }} />
      ) : null
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-cyan-500/10 rounded-lg">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">Skill Intelligence Hub</h1>
          <p className="text-sm text-slate-400">Explore in-demand skills and learning resources</p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for any skill (e.g., Python, UX Design, Project Management)"
          className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium rounded-lg transition-colors"
        >
          Analyze
        </button>
      </form>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Categories & Trending */}
        <div className="lg:col-span-1 space-y-6">
          {/* Categories */}
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
            <h2 className="text-sm font-medium text-slate-400 mb-3">SKILL CATEGORIES</h2>
            <div className="space-y-1">
              {SKILL_CATEGORIES.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{category.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Trending Skills */}
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-medium text-slate-400">TRENDING IN {new Date().getFullYear()}</h2>
              </div>
              <button
                onClick={fetchTrendingSkills}
                disabled={trendingLoading}
                className="p-1.5 text-slate-500 hover:text-cyan-400 transition-colors disabled:opacity-50"
                title="Refresh trending skills"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${trendingLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {trendingLoading && trendingSkills.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <p className="text-xs">Fetching live trends...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {trendingError && (
                  <p className="text-xs text-amber-400/70 mb-2">Using cached data. Click refresh to retry.</p>
                )}
                {trendingSkills.map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => analyzeSkill(skill.name)}
                    className="w-full text-left group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white group-hover:text-cyan-400 transition-colors">
                        {skill.name}
                      </span>
                      <span className="text-xs text-emerald-400">{skill.growth}</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${skill.demand}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Skill Analysis */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 min-h-[500px]">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                <p className="text-slate-400">Analyzing {selectedSkill}...</p>
              </div>
            ) : skillAnalysis ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">{selectedSkill}</h2>
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-sm rounded-full">
                    AI Analysis
                  </span>
                </div>
                <div className="prose prose-invert max-w-none">
                  {formatAnalysis(skillAnalysis)}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="p-4 bg-slate-800 rounded-2xl mb-6">
                  <BookOpen className="w-12 h-12 text-slate-500" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Select a Skill to Analyze
                </h2>
                <p className="text-slate-400 max-w-md">
                  Search for any skill or click on a trending skill to get detailed insights,
                  learning paths, and career opportunities.
                </p>

                {/* Quick skill suggestions */}
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {['Python', 'React', 'AWS', 'Data Analysis', 'Leadership'].map((skill) => (
                    <button
                      key={skill}
                      onClick={() => analyzeSkill(skill)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 rounded-full text-sm text-slate-300 transition-colors"
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillHub
