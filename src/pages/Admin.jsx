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
  const [reviews, setReviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingPhoto, setEditingPhoto] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [stats, setStats] = useState({ reviews: 0, photos: 0, messages: 0 })

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }
    loadPhotos()
    loadMessages()
    loadReviews()
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

  const loadReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (!error && data) {
      setReviews(data)
      setStats(prev => ({ ...prev, reviews: data.length }))
    }
  }

  const handleFileSelect = (e) => {
    const files = [...e.target.files]
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleSubmitPhoto = async () => {
    if (!selectedFile || !title) {
      alert('Please select a file and enter a title')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    const name = `${Date.now()}-${selectedFile.name.replace(/\s/g, '_')}`
    
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .upload(name, selectedFile, { upsert: true })

    if (error) {
      console.error('Upload error:', error)
      setUploading(false)
      alert('Upload failed. Please try again.')
      return
    }

    // Save metadata
    await supabase.from('gallery_items').insert({
      title: title,
      description: description || 'Student success photo',
      image_path: name,
      created_by: user?.id,
      approved: true  // Admin uploads are auto-approved
    })

    setUploading(false)
    setTitle('')
    setDescription('')
    setSelectedFile(null)
    loadPhotos()
    document.getElementById('file-input').value = ''
  }

  const approvePhoto = async (id) => {
    await supabase.from('gallery_items').update({ approved: true }).eq('id', id)
    loadPhotos()
  }

  const rejectPhoto = async (id, imagePath) => {
    if (!confirm('Reject and delete this photo?')) return
    await supabase.storage.from(SUPABASE_BUCKET).remove([imagePath])
    await supabase.from('gallery_items').delete().eq('id', id)
    loadPhotos()
  }

  const startEditPhoto = (photo) => {
    setEditingPhoto(photo)
    setEditTitle(photo.title)
    setEditDescription(photo.description || '')
  }

  const cancelEditPhoto = () => {
    setEditingPhoto(null)
    setEditTitle('')
    setEditDescription('')
  }

  const saveEditPhoto = async () => {
    if (!editingPhoto) return
    
    await supabase.from('gallery_items').update({
      title: editTitle,
      description: editDescription
    }).eq('id', editingPhoto.id)
    
    cancelEditPhoto()
    loadPhotos()
  }

  const approveReview = async (id) => {
    await supabase.from('reviews').update({ approved: true }).eq('id', id)
    loadReviews()
  }

  const rejectReview = async (id) => {
    if (!confirm('Delete this review?')) return
    await supabase.from('reviews').delete().eq('id', id)
    loadReviews()
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
            style={{gridColumn: '1 / -1'}}
          >
            <h3 style={{display:'flex',alignItems:'center',gap:8}}><BarChart3 size={20} /> Overview</h3>
            <div className="stat-grid">
              <div className="stat-box"><div className="stat-box-num">{stats.reviews}</div><div className="stat-box-label">Total Reviews</div></div>
              <div className="stat-box"><div className="stat-box-num">{stats.photos}</div><div className="stat-box-label">Gallery Photos</div></div>
              <div className="stat-box"><div className="stat-box-num">{stats.messages}</div><div className="stat-box-label">Messages</div></div>
              <div className="stat-box"><div className="stat-box-num" style={{color:'var(--success)'}}>5.0</div><div className="stat-box-label">Avg Rating</div></div>
            </div>
          </motion.div>

          {/* Gallery Management */}
          <motion.div 
            className="admin-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{gridColumn: '1 / -1'}}
          >
            <h3 style={{display:'flex',alignItems:'center',gap:8,marginBottom:'1.5rem'}}><Image size={20} /> Gallery Management</h3>
            
            <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:'2rem'}}>
              {/* Upload Section */}
              <div>
                <h4 style={{fontSize:'1rem',marginBottom:'1rem',color:'var(--text-muted)'}}>Upload New Photo</h4>
                <div className="upload-zone" onClick={() => document.getElementById('file-input').click()}>
                  <div className="upload-icon"><Upload size={48} /></div>
                  <strong>Click to upload photos</strong>
                  <p>JPG, PNG, WEBP — max 5 MB each</p>
                  {selectedFile && <p style={{color:'var(--primary)',marginTop:'0.5rem'}}>Selected: {selectedFile.name}</p>}
                </div>
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{display:'none'}}
                />
                <div className="form-group" style={{marginTop:'1.5rem'}}>
                  <label>Photo Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Photo title (e.g., 'John passed his Code B test')"
                  />
                </div>
                <div className="form-group" style={{marginTop:'1rem'}}>
                  <label>Photo Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Additional details about the photo"
                  />
                </div>
                <button 
                  onClick={handleSubmitPhoto} 
                  className="btn-primary btn-full" 
                  disabled={uploading || !selectedFile || !title}
                  style={{marginTop:'1rem'}}
                >
                  {uploading ? 'Uploading...' : 'Submit Photo'}
                </button>
              </div>

              {/* Manage Existing Photos */}
              <div>
                <h4 style={{fontSize:'1rem',marginBottom:'1rem',color:'var(--text-muted)'}}>Manage Photos ({photos.length})</h4>
                <div className="admin-photos-grid" style={{maxHeight:'400px',overflowY:'auto'}}>
                  {photos.map(photo => {
                    const { data: { publicUrl } } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(photo.image_path)
                    const isEditing = editingPhoto?.id === photo.id
                    return (
                      <div key={photo.id} className="admin-photo">
                        <img src={publicUrl} alt={photo.description} />
                        {isEditing ? (
                          <div className="admin-photo-edit" style={{padding:'0.5rem',background:'var(--card)',borderRadius:'4px'}}>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Title"
                              style={{width:'100%',padding:'4px',marginBottom:'4px',fontSize:'0.75rem'}}
                            />
                            <input
                              type="text"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              placeholder="Description"
                              style={{width:'100%',padding:'4px',marginBottom:'4px',fontSize:'0.75rem'}}
                            />
                            <div style={{display:'flex',gap:'4px'}}>
                              <button onClick={saveEditPhoto} style={{flex:1,background:'var(--success)',border:'none',color:'white',padding:'4px',borderRadius:'4px',cursor:'pointer',fontSize:'0.7rem'}}>Save</button>
                              <button onClick={cancelEditPhoto} style={{flex:1,background:'var(--danger)',border:'none',color:'white',padding:'4px',borderRadius:'4px',cursor:'pointer',fontSize:'0.7rem'}}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="admin-photo-status">
                              {photo.approved ? 
                                <span style={{color:'var(--success)',fontSize:'0.75rem',fontWeight:600}}>✓ Approved</span> : 
                                <span style={{color:'var(--text-muted)',fontSize:'0.75rem'}}>Pending</span>
                              }
                            </div>
                            <div className="admin-photo-actions">
                              <button onClick={() => startEditPhoto(photo)} style={{background:'var(--secondary)',border:'none',color:'white',padding:'4px 8px',borderRadius:'4px',cursor:'pointer',fontSize:'0.75rem',marginRight:'4px'}}>
                                Edit
                              </button>
                              <button onClick={() => rejectPhoto(photo.id, photo.image_path)} style={{background:'var(--danger)',border:'none',color:'white',padding:'4px 8px',borderRadius:'4px',cursor:'pointer',fontSize:'0.75rem'}}>
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Messages & Reviews Management */}
          <motion.div 
            className="admin-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{gridColumn: '1 / -1'}}
          >
            <h3 style={{display:'flex',alignItems:'center',gap:8,marginBottom:'1.5rem'}}><MessageSquare size={20} /> Messages & Reviews Management</h3>
            
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem'}}>
              {/* Messages */}
              <div>
                <h4 style={{fontSize:'1rem',marginBottom:'1rem',color:'var(--text-muted)'}}>Customer Messages ({messages.length})</h4>
                <div className="admin-messages" style={{maxHeight:'400px',overflowY:'auto'}}>
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
              </div>

              {/* Reviews */}
              <div>
                <h4 style={{fontSize:'1rem',marginBottom:'1rem',color:'var(--text-muted)'}}>User Reviews ({reviews.length})</h4>
                <div className="admin-messages" style={{maxHeight:'400px',overflowY:'auto'}}>
                  {reviews.length === 0 ? (
                    <div style={{color:'var(--text-muted)',fontSize:'0.85rem',textAlign:'center',padding:'1.5rem'}}>No reviews yet</div>
                  ) : (
                    reviews.map(review => (
                      <div key={review.id} className="admin-msg">
                        <div className="admin-msg-from">
                          {review.name} — {'★'.repeat(review.rating)}
                          {review.approved ? 
                            <span style={{color:'var(--success)',marginLeft:'8px',fontSize:'0.75rem'}}>✓ Approved</span> : 
                            <span style={{color:'var(--text-muted)',marginLeft:'8px',fontSize:'0.75rem'}}>Pending</span>
                          }
                        </div>
                        <div className="admin-msg-text">{review.text}</div>
                        <div className="admin-msg-date">{review.created_at?.split('T')[0] || ''}</div>
                        <div className="admin-msg-actions">
                          {!review.approved && (
                            <button onClick={() => approveReview(review.id)} style={{background:'var(--success)',border:'none',color:'white',padding:'4px 8px',borderRadius:'4px',cursor:'pointer',fontSize:'0.75rem',marginRight:'8px'}}>
                              Approve
                            </button>
                          )}
                          <button onClick={() => rejectReview(review.id)} style={{background:'var(--danger)',border:'none',color:'white',padding:'4px 8px',borderRadius:'4px',cursor:'pointer',fontSize:'0.75rem'}}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
