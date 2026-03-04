import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import {
  FileText,
  Download,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Code,
  AlertCircle,
  Eye,
  ExternalLink,
} from 'lucide-react'

function ResumeBuilder() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)
  const resumeRef = useRef(null)

  useEffect(() => {
    fetchProfile()
  }, [user])

  const fetchProfile = async () => {
    if (!user) return
    try {
      const { data } = await supabase
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

  const calculateCompletion = () => {
    if (!profile) return 0
    const fields = [
      profile.experience?.length > 0,
      profile.education?.length > 0,
      profile.skills?.length > 0,
      profile.projects?.length > 0,
    ]
    return Math.round((fields.filter(Boolean).length / fields.length) * 100)
  }

  const handleDownloadPDF = () => {
    if (!resumeRef.current) return

    const printContents = resumeRef.current.innerHTML
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Please allow popups to download PDF')
      return
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${profile.full_name || 'Resume'} - Resume</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #1a1a2e;
            line-height: 1.5;
            font-size: 11pt;
            background: white;
          }

          .resume-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 48px;
          }

          .resume-header {
            text-align: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid #0f172a;
          }

          .resume-name {
            font-size: 28pt;
            font-weight: 700;
            color: #0f172a;
            letter-spacing: 0.02em;
            margin-bottom: 4px;
          }

          .resume-headline {
            font-size: 12pt;
            color: #475569;
            margin-bottom: 10px;
          }

          .contact-row {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 16px;
            font-size: 9pt;
            color: #64748b;
          }

          .contact-item {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .contact-item a {
            color: #64748b;
            text-decoration: none;
          }

          .section { margin-bottom: 20px; }

          .section-title {
            font-size: 11pt;
            font-weight: 700;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 4px;
            margin-bottom: 12px;
          }

          .summary-text {
            color: #334155;
            font-size: 10pt;
            line-height: 1.6;
          }

          .entry { margin-bottom: 14px; }
          .entry:last-child { margin-bottom: 0; }

          .entry-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 2px;
          }

          .entry-title {
            font-size: 11pt;
            font-weight: 600;
            color: #0f172a;
          }

          .entry-date {
            font-size: 9pt;
            color: #64748b;
            white-space: nowrap;
          }

          .entry-subtitle {
            font-size: 10pt;
            color: #475569;
            font-style: italic;
          }

          .entry-detail {
            font-size: 9pt;
            color: #64748b;
            margin-top: 1px;
          }

          .entry-description {
            font-size: 10pt;
            color: #334155;
            margin-top: 4px;
            line-height: 1.5;
          }

          .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .skill-tag {
            font-size: 9pt;
            padding: 3px 10px;
            border-radius: 3px;
            background: #f1f5f9;
            color: #334155;
            border: 1px solid #e2e8f0;
          }

          .projects-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .project-card {
            padding: 0;
          }

          .project-name {
            font-size: 10pt;
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 2px;
          }

          .project-desc {
            font-size: 9pt;
            color: #475569;
            line-height: 1.4;
          }

          .project-tech {
            font-size: 8pt;
            color: #94a3b8;
            margin-top: 3px;
          }

          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .resume-container { padding: 0; }
            @page { margin: 0.5in; size: letter; }
          }
        </style>
      </head>
      <body>
        ${printContents}
        <script>
          setTimeout(function() { window.print(); window.close(); }, 500);
        </script>
      </body>
      </html>
    `)
    printWindow.document.close()
    toast.success('PDF download started!')
  }

  const completion = calculateCompletion()

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
            <Briefcase className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Resume Builder</h1>
            <p className="text-sm text-slate-400">Generate an ATS-friendly resume from your profile</p>
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
          <button
            onClick={handleDownloadPDF}
            disabled={completion < 50}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 disabled:text-slate-500 font-medium rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {!previewMode ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Completion */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-sm font-medium text-slate-400 mb-4">PROFILE COMPLETION</h2>
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
                  className={`h-full rounded-full transition-all ${completion >= 50 ? 'bg-cyan-500' : 'bg-amber-500'}`}
                  style={{ width: `${completion}%` }}
                />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <CompletionRow done={profile?.experience?.length > 0} label="Work experience" />
                <CompletionRow done={profile?.education?.length > 0} label="Education" />
                <CompletionRow done={profile?.skills?.length > 0} label="Skills" />
                <CompletionRow done={profile?.projects?.length > 0} label="Projects" />
              </div>
            </div>

            {/* Tips */}
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <h2 className="text-sm font-medium text-slate-400 mb-4">ATS TIPS</h2>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Use standard section headings (Experience, Education, Skills)
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Include keywords from the job description in your skills
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Use simple formatting — ATS can't parse complex layouts
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  Quantify achievements with numbers when possible
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Resume Preview */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-slate-500">Resume Preview</span>
              </div>
              <div className="bg-white p-8 min-h-[500px]">
                <div ref={resumeRef}>
                  <ResumeContent profile={profile} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
          <div className="p-8">
            <div ref={resumeRef}>
              <ResumeContent profile={profile} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CompletionRow({ done, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${done ? 'bg-cyan-500' : 'bg-slate-700'}`}>
        {done && (
          <svg className="w-3 h-3 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={done ? 'text-slate-300' : 'text-slate-500'}>{label}</span>
    </div>
  )
}

function ResumeContent({ profile }) {
  if (!profile) {
    return (
      <div className="text-center text-gray-400 py-16">
        <p>Complete your profile to generate a resume</p>
      </div>
    )
  }

  const formatDate = (date) => {
    if (!date) return ''
    const [year, month] = date.split('-')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return month ? `${months[parseInt(month) - 1]} ${year}` : year
  }

  return (
    <div className="resume-container" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: '#1a1a2e', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '2px solid #0f172a' }}>
        <h1 style={{ fontSize: '26pt', fontWeight: 700, color: '#0f172a', letterSpacing: '0.02em', marginBottom: '4px', lineHeight: 1.2 }}>
          {profile.full_name || 'Your Name'}
        </h1>
        {profile.headline && (
          <p style={{ fontSize: '11pt', color: '#475569', marginBottom: '8px' }}>{profile.headline}</p>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '9pt', color: '#64748b' }}>
          {profile.email && (
            <span>{profile.email}</span>
          )}
          {profile.phone && (
            <span>| {profile.phone}</span>
          )}
          {profile.location && (
            <span>| {profile.location}</span>
          )}
          {profile.linkedin && (
            <span>| LinkedIn</span>
          )}
          {profile.github && (
            <span>| GitHub</span>
          )}
          {profile.website && (
            <span>| Portfolio</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {profile.about && (
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px' }}>
            Professional Summary
          </h2>
          <p style={{ color: '#334155', fontSize: '10pt', lineHeight: 1.6 }}>{profile.about}</p>
        </div>
      )}

      {/* Skills */}
      {profile.skills?.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px' }}>
            Technical Skills
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {profile.skills.map((skill, i) => (
              <span key={i} style={{ fontSize: '9pt', padding: '2px 10px', borderRadius: '3px', background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {profile.experience?.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '10px' }}>
            Professional Experience
          </h2>
          {profile.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: i < profile.experience.length - 1 ? '14px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1px' }}>
                <span style={{ fontSize: '11pt', fontWeight: 600, color: '#0f172a' }}>{exp.position}</span>
                <span style={{ fontSize: '9pt', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                </span>
              </div>
              <p style={{ fontSize: '10pt', color: '#475569', fontStyle: 'italic' }}>{exp.company}</p>
              {exp.description && (
                <p style={{ fontSize: '10pt', color: '#334155', marginTop: '4px', lineHeight: 1.5 }}>{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {profile.projects?.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '10px' }}>
            Projects
          </h2>
          {profile.projects.map((project, i) => (
            <div key={i} style={{ marginBottom: i < profile.projects.length - 1 ? '10px' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '2px' }}>
                <span style={{ fontSize: '10pt', fontWeight: 600, color: '#0f172a' }}>{project.name}</span>
                {project.technologies && (
                  <span style={{ fontSize: '8pt', color: '#94a3b8' }}>({project.technologies})</span>
                )}
              </div>
              {project.description && (
                <p style={{ fontSize: '9pt', color: '#475569', lineHeight: 1.4 }}>{project.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {profile.education?.length > 0 && (
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '11pt', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '10px' }}>
            Education
          </h2>
          {profile.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: i < profile.education.length - 1 ? '12px' : 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1px' }}>
                <span style={{ fontSize: '11pt', fontWeight: 600, color: '#0f172a' }}>{edu.degree}</span>
                <span style={{ fontSize: '9pt', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                </span>
              </div>
              <p style={{ fontSize: '10pt', color: '#475569', fontStyle: 'italic' }}>{edu.institution}</p>
              {edu.field && (
                <p style={{ fontSize: '9pt', color: '#64748b', marginTop: '1px' }}>{edu.field}</p>
              )}
              {edu.description && (
                <p style={{ fontSize: '9pt', color: '#334155', marginTop: '3px', lineHeight: 1.4 }}>{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ResumeBuilder
