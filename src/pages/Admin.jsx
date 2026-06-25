import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase, SUPABASE_BUCKET } from '../lib/supabase'
import { Upload, X, Trash2, LogOut, Image, MessageSquare, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Admin() {
  const { user, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const [photos, setPhotos] = useState([])
  const [messages, setMessages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [description, setDescription] = useState('')
  const [stats, setStats] = useState({ reviews: 17, photos: 0, messages: 0 })

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }
    loadPhotos()
    loadMessages()
  }, [isAdmin, navigate])

  const loadPhotos = async () => {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (!error && data) {
      setPhotos(data)
      setStats(prev => ({ ...prev, photos: data.length }))
    }
  }

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    
    if (!error && data) {
      setMessages(data)
      setStats(prev => ({ ...prev, messages: data.length }))
    }
  }

  const handleFileUpload = async (e) => {
    const files = [...e.target.files]
    if (!files.length) return

    setUploading(true)
    setUploadProgress(0)

    let completed = 0
    for (const file of files) {
      const name = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
      
      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(name, file, { upsert: true })

      if (error) {
        console.error('Upload error:', error)
        continue
      }

      // Save metadata
      await supabase.from('gallery_items').insert({
        title: description || 'Student Success',
        description: description || 'Student success photo',
        image_path: name,
        created_by: user?.id
      })

      completed++
      setUploadProgress((completed / files.length) * 100)
    }

    setUploading(false)
    setDescription('')
    loadPhotos()
    e.target.value = ''
  }

  const deletePhoto = async (id, imagePath) => {
    if (!confirm('Delete this photo?')) return

    await supabase.storage.from(SUPABASE_BUCKET).remove([imagePath])
    await supabase.from('gallery_items').delete().eq('id', id)
    loadPhotos()
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (!isAdmin) return null

  return (
    <motion.div 
      className="admin-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <div className="admin-header">
          <div>
            <h2 style={{fontSize:'1.5rem',fontWeight:800,marginBottom:'6px'}}>Admin Dashboard</h2>
            <p style={{opacity:0.8,fontSize:'0.9rem'}}>MMJ Driving School Management</p>
          </div>
          <button className="btn-primary" onClick={handleSignOut}>
            <LogOut size={18} style={{marginRight:8}} />
            Sign Out
          </button>
        </div>

        <div className="admin-grid">
          {/* Stats */}
          <motion.div 
            className="admin-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 style={{display:'flex',alignItems:'center',gap:8}}><BarChart3 size={20} /> Overview</h3>
            <div className="stat-grid">
              <div className="stat-box"><div className="stat-box-num">{stats.reviews}</div><div className="stat-box-label">Total Reviews</div></div>
              <div className="stat-box"><div className="stat-box-num">{stats.photos}</div><div className="stat-box-label">Gallery Photos</div></div>
              <div className="stat-box"><div className="stat-box-num">{stats.messages}</div><div className="stat-box-label">Messages</div></div>
              <div className="stat-box"><div className="stat-box-num" style={{color:'var(--success)'}}>5.0</div><div className="stat-box-label">Avg Rating</div></div>
            </div>
          </motion.div>

          {/* Upload Photos */}
          <motion.div 
            className="admin-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 style={{display:'flex',alignItems:'center',gap:8}}><Image size={20} /> Upload Gallery Photos</h3>
            <div className="upload-zone" onClick={() => document.getElementById('file-input').click()}>
              <div className="upload-icon"><Upload size={48} /></div>
              <strong>Click to upload photos</strong>
              <p>JPG, PNG, WEBP — max 5 MB each</p>
            </div>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              style={{display:'none'}}
            />
            <div className="form-group" style={{marginTop:'1.5rem'}}>
              <label>Photo Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this photo (e.g., 'John passed his Code B test')"
              />
            </div>
            {uploading && (
              <div className="upload-progress" style={{display:'block'}}>
                <p style={{fontSize:'0.85rem',color:'var(--text-muted)',fontWeight:'600'}}>Uploading...</p>
                <div className="progress-bar"><div className="progress-fill" style={{width:`${uploadProgress}%`}}></div></div>
              </div>
            )}
            <div className="admin-photos-grid">
              {photos.map(photo => {
                const { data: { publicUrl } } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(photo.image_path)
                return (
                  <div key={photo.id} className="admin-photo">
                    <img src={publicUrl} alt={photo.description} />
                    <button className="admin-photo-del" onClick={() => deletePhoto(photo.id, photo.image_path)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Messages */}
          <motion.div 
            className="admin-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 style={{display:'flex',alignItems:'center',gap:8}}><MessageSquare size={20} /> Customer Messages</h3>
            <div className="admin-messages">
              {messages.length === 0 ? (
                <div style={{color:'var(--text-muted)',fontSize:'0.85rem',textAlign:'center',padding:'1.5rem'}}>No messages yet</div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="admin-msg">
                    <div className="admin-msg-from">{msg.name} — {msg.phone || 'No phone'}</div>
                    <div className="admin-msg-text">{msg.message}</div>
                    <div className="admin-msg-date">{msg.course || ''} · {msg.created_at?.split('T')[0] || ''}</div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
