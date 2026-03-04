import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  Camera,
  Plus,
  Trash2,
  Save,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Loader2,
  Link as LinkIcon,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'

function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')

  const [profile, setProfile] = useState({
    full_name: '',
    headline: '',
    about: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    avatar_url: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
  })

  const [newSkill, setNewSkill] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

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

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProfile({
          ...profile,
          ...data,
          skills: data.skills || [],
          experience: data.experience || [],
          education: data.education || [],
          projects: data.projects || [],
        })
      } else {
        // Set default email from auth
        setProfile((prev) => ({ ...prev, email: user.email }))
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success('Profile saved successfully!')
    } catch (error) {
      toast.error('Error saving profile: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((skill) => skill !== skillToRemove),
    })
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB')
      return
    }

    setUploadingPhoto(true)
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      setProfile({ ...profile, avatar_url: publicUrl })

      await supabase.from('profiles').upsert({
        id: user.id,
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })

      toast.success('Photo uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Error uploading photo: ' + error.message)
    } finally {
      setUploadingPhoto(false)
    }
  }

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [
        ...profile.experience,
        {
          id: Date.now(),
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    })
  }

  const updateExperience = (id, field, value) => {
    setProfile({
      ...profile,
      experience: profile.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    })
  }

  const removeExperience = (id) => {
    setProfile({
      ...profile,
      experience: profile.experience.filter((exp) => exp.id !== id),
    })
  }

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [
        ...profile.education,
        {
          id: Date.now(),
          institution: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    })
  }

  const updateEducation = (id, field, value) => {
    setProfile({
      ...profile,
      education: profile.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    })
  }

  const removeEducation = (id) => {
    setProfile({
      ...profile,
      education: profile.education.filter((edu) => edu.id !== id),
    })
  }

  const addProject = () => {
    setProfile({
      ...profile,
      projects: [
        ...profile.projects,
        {
          id: Date.now(),
          name: '',
          description: '',
          url: '',
          technologies: '',
        },
      ],
    })
  }

  const updateProject = (id, field, value) => {
    setProfile({
      ...profile,
      projects: profile.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    })
  }

  const removeProject = (id) => {
    setProfile({
      ...profile,
      projects: profile.projects.filter((proj) => proj.id !== id),
    })
  }

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'projects', label: 'Projects', icon: LinkIcon },
  ]

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>

          <h1 className="text-xl font-semibold text-white">Edit Profile</h1>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 bg-slate-900/50 rounded-xl border border-slate-800">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-slate-500" />
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-2 bg-cyan-500 rounded-full text-slate-950 hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              {uploadingPhoto ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </label>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white">
              {profile.full_name || 'Your Name'}
            </h2>
            <p className="text-slate-400">
              {profile.headline || 'Add your professional headline'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Personal Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) =>
                      setProfile({ ...profile, full_name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={profile.headline}
                    onChange={(e) =>
                      setProfile({ ...profile, headline: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Senior Software Engineer at Tech Corp"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  About Me
                </label>
                <textarea
                  value={profile.about}
                  onChange={(e) =>
                    setProfile({ ...profile, about: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Tell us about yourself, your experience, and what drives you..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) =>
                      setProfile({ ...profile, location: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Linkedin className="w-4 h-4 inline mr-2" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={profile.linkedin}
                    onChange={(e) =>
                      setProfile({ ...profile, linkedin: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Github className="w-4 h-4 inline mr-2" />
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={profile.github}
                    onChange={(e) =>
                      setProfile({ ...profile, github: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div
                  key={exp.id}
                  className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">
                      Experience {index + 1}
                    </h3>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, 'company', e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Company Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(exp.id, 'position', e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Job Title"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(exp.id, 'startDate', e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExperience(exp.id, 'endDate', e.target.value)
                        }
                        disabled={exp.current}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
                      />
                      <label className="flex items-center gap-2 mt-2 text-sm text-slate-400">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) =>
                            updateExperience(exp.id, 'current', e.target.checked)
                          }
                          className="rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                        />
                        Currently working here
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) =>
                        updateExperience(exp.id, 'description', e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addExperience}
                className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Experience
              </button>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              {profile.education.map((edu, index) => (
                <div
                  key={edu.id}
                  className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">
                      Education {index + 1}
                    </h3>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Institution
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(edu.id, 'institution', e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="University Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(edu.id, 'degree', e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Bachelor's, Master's, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Field of Study
                    </label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) =>
                        updateEducation(edu.id, 'field', e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Computer Science, Business, etc."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Start Date
                      </label>
                      <input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) =>
                          updateEducation(edu.id, 'startDate', e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        End Date
                      </label>
                      <input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) =>
                          updateEducation(edu.id, 'endDate', e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={edu.description}
                      onChange={(e) =>
                        updateEducation(edu.id, 'description', e.target.value)
                      }
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                      placeholder="Achievements, activities, or relevant coursework..."
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addEducation}
                className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Education
              </button>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800">
                <h3 className="text-lg font-medium text-white mb-4">Your Skills</h3>

                <div className="flex flex-wrap gap-2 mb-6">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {profile.skills.length === 0 && (
                    <p className="text-slate-500">No skills added yet</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Add a skill (e.g., JavaScript, Project Management)"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {profile.projects.map((project, index) => (
                <div
                  key={project.id}
                  className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-white">
                      Project {index + 1}
                    </h3>
                    <button
                      onClick={() => removeProject(project.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) =>
                          updateProject(project.id, 'name', e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Project Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Project URL
                      </label>
                      <input
                        type="url"
                        value={project.url}
                        onChange={(e) =>
                          updateProject(project.id, 'url', e.target.value)
                        }
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="https://project-url.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Technologies Used
                    </label>
                    <input
                      type="text"
                      value={project.technologies}
                      onChange={(e) =>
                        updateProject(project.id, 'technologies', e.target.value)
                      }
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="React, Node.js, PostgreSQL, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={project.description}
                      onChange={(e) =>
                        updateProject(project.id, 'description', e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                      placeholder="Describe your project, its purpose, and your contributions..."
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addProject}
                className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
