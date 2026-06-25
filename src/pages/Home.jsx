import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Car, MapPin, ShieldCheck, Award, Clock, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Static reviews (will be replaced with database later)
const STATIC_REVIEWS = [
  {
    name: 'Sherley',
    rating: 5,
    text: 'I will to take this opportunity to thank MMJ driving school team more especially Jimmy and Jacob wow guys you done a very good job of teaching me how to driver i know it wasn\'t easy but yes we did together one More time buti Jimmy you deserve Bells. Thank you so much may God bless you',
    date: '30 November 2023'
  },
  {
    name: 'Nqobile',
    rating: 5,
    text: 'I\'d like to take this opportunity and thank MMJ driving School more specially to my instructor Mr Moloisi (Jimmy), you have been so patient with me from the beginning, very humble and with that I was able to learn fast, you even believed in me when I didn\'t. Today I passed my driving licence code B even though people told me it was hard to pass it but you made it easy for me. Thank you very much. I will always recommend anyone to come have lessons with you because you\'re the best teacher. Super proud. Thank you.',
    date: '14 November 2023'
  },
  {
    name: 'Zamaswazi',
    rating: 5,
    text: 'Jimmy is such a great instructor, patient and teaches you important details to ensure a great and east driving experience.',
    date: '14 November 2023'
  },
  {
    name: 'Siyabonga',
    rating: 5,
    text: 'The journey from fear to confidence in driving was made possible by MMJ\'s exceptional patience and effective lessons. Obtaining my license today feels like a significant achievement, and I credit MMJ Driving School for teaching me so well that I succeeded in passing the test on my first attempt. For those hesitant about learning to drive, I enthusiastically recommend this driving school. The thought of starting can be daunting, but MMJ Driving School creates a supportive environment that fosters learning and boosts confidence. Their approach is truly commendable. Shout out to Jimmy and Jacob, Ngiyabonga kakhulu.',
    date: '08 November 2023'
  },
  {
    name: 'ndivhuwo',
    rating: 5,
    text: 'Great place to do your driving lessons, the driving lesson instructors are very patient and good at they\'re job so i highly recommend for first timer. Thank you for the wonderful service',
    date: '15 September 2023'
  },
  {
    name: 'Mbali',
    rating: 5,
    text: 'Very patient and there\'s no way you won\'t learn, if mj could see how I drive now he\'d be absolutely mortified',
    date: '29 April 2023'
  },
  {
    name: 'Tracy',
    rating: 5,
    text: 'Did my license (code 10) with MMJ driving school. Very professional and well mannered instructors. I highly recommend',
    date: '16 March 2023'
  },
  {
    name: 'Kelebogile',
    rating: 5,
    text: 'The instructor was very patient, they made learning how to park easy. He is good teacher, Highly recommend',
    date: '13 March 2023'
  },
  {
    name: 'Zama',
    rating: 5,
    text: 'Very awesome experience I had with MMJ. He is very patient and you can tell from His teachings that He know\'s his story. The whole experience was enjoyable with him. I\'m happy',
    date: '07 November 2022'
  },
  {
    name: 'user',
    rating: 5,
    text: 'Excellent teacher. Patient and very punctual. I miss his lesson every time when I\'m driving.',
    date: '27 September 2022'
  },
  {
    name: 'Ofentse',
    rating: 5,
    text: 'I absolutely enjoyed driving with MJ. He is patient, attentive and very helpful. 5* service.',
    date: '22 July 2022'
  },
  {
    name: 'Tracey',
    rating: 5,
    text: 'Communication with clients is excellent, always keeps me up to date with events going on, great accommodating skills in terms of when I can be free, very patient',
    date: '15 May 2022'
  },
  {
    name: 'Khethiwe',
    rating: 5,
    text: 'MMJ always keep their clients updated and always professional. So far I\'m grateful and happy',
    date: '16 October 2021'
  },
  {
    name: 'Wanda',
    rating: 5,
    text: 'Amazing experience, the instructor is very patient. They go out of their way to make sure you are ready for your test.',
    date: '23 January 2021'
  },
  {
    name: 'Stephina',
    rating: 5,
    text: 'Great service ever. They communicate with clients pretty well and pay attention to each and everyone. Very certisfying service',
    date: '05 December 2020'
  },
  {
    name: 'Maharela',
    rating: 5,
    text: 'I had a good experience with this driving school, they were very patient with me, taught me everything I needed to to know with driving, they very strict with time management alway make sure that you learn something before going home n I passed n got my driving licence on first attempt',
    date: '14 November 2020'
  },
  {
    name: 'Tholakele',
    rating: 5,
    text: 'Instructor is very patient and has taught me driving very well now I have my driving licence Code: C1',
    date: '26 October 2020'
  }
]

export default function Home() {
  const { user } = useAuth()
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  })
  const [contactSuccess, setContactSuccess] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)
  const [galleryPhotos, setGalleryPhotos] = useState([])
  const [reviews, setReviews] = useState(STATIC_REVIEWS)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, text: '' })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  useEffect(() => {
    loadGalleryPhotos()
    // loadReviews() - Disabled for now, using static reviews
  }, [])

  const loadGalleryPhotos = async () => {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .limit(12)
    
    if (!error && data) {
      setGalleryPhotos(data)
    }
  }

  const loadReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setReviews(data)
    }
  }

  const handleContactSubmit = async (e) => {
    e.preventDefault()
    setContactLoading(true)
    setContactSuccess(false)

    const { error } = await supabase
      .from('contact_messages')
      .insert({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        course: contactForm.course,
        message: contactForm.message
      })

    setContactLoading(false)

    if (error) {
      alert('Failed to send message. Please try again.')
    } else {
      setContactSuccess(true)
      setContactForm({ name: '', email: '', phone: '', course: '', message: '' })
      setTimeout(() => setContactSuccess(false), 5000)
    }
  }

  const handleContactChange = (e) => {
    setContactForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setReviewSubmitting(true)

    console.log('Submitting review for user:', user?.id)
    console.log('Review data:', reviewForm)

    const { error } = await supabase
      .from('reviews')
      .insert({
        user_id: user?.id,
        name: reviewForm.name,
        rating: reviewForm.rating,
        text: reviewForm.text
      })

    setReviewSubmitting(false)

    if (error) {
      console.error('Review submission error:', error)
      alert('Failed to submit review. Please try again.')
    } else {
      alert('Review submitted! It will appear after admin approval.')
      setReviewForm({ name: '', rating: 5, text: '' })
      setShowReviewForm(false)
    }
  }
  return (
    <>
      {/* HERO */}
      <motion.section 
        id="hero" 
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-bg-animation">
          <div className="road-line"></div>
          <div className="road-line"></div>
          <div className="road-line"></div>
          <div className="car-animation car-1">
            <svg viewBox="0 0 100 50" fill="currentColor"><rect x="10" y="20" width="80" height="25" rx="8"/><rect x="25" y="12" width="50" height="18" rx="6"/><circle cx="25" cy="47" r="8"/><circle cx="75" cy="47" r="8"/></svg>
          </div>
          <div className="car-animation car-2">
            <svg viewBox="0 0 100 50" fill="currentColor"><rect x="10" y="20" width="80" height="25" rx="8"/><rect x="25" y="12" width="50" height="18" rx="6"/><circle cx="25" cy="47" r="8"/><circle cx="75" cy="47" r="8"/></svg>
          </div>
          <div className="car-animation car-3">
            <svg viewBox="0 0 100 50" fill="currentColor"><rect x="10" y="20" width="80" height="25" rx="8"/><rect x="25" y="12" width="50" height="18" rx="6"/><circle cx="25" cy="47" r="8"/><circle cx="75" cy="47" r="8"/></svg>
          </div>
        </div>
        <div className="hero-bg-shape"></div>
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-eyebrow"><Car size={16} style={{marginRight:8}} /> Germiston's Most Trusted</div>
              <h1 className="hero-title">Drive With <em>Confidence</em> From Day One</h1>
              <p className="hero-desc">MMJ Driving School has helped hundreds of students pass their driving tests on the first attempt. Patient, professional instructors ready to guide you every step of the way.</p>
              <div className="hero-ctas">
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})} className="btn-primary">Book a Lesson</button>
                <button onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})} className="btn-outline">View Courses</button>
              </div>
              <div className="hero-stats">
                <div><div className="hero-stat-num">500+</div><div className="hero-stat-label">Students Passed</div></div>
                <div><div className="hero-stat-num">5★</div><div className="hero-stat-label">Average Rating</div></div>
                <div><div className="hero-stat-num">10+</div><div className="hero-stat-label">Years Experience</div></div>
              </div>
            </div>
            <div className="hero-card">
              <div className="hero-card-title">Our Courses</div>
              <div className="course-list">
                <div className="course-item">
                  <div className="course-item-info"><h4>Code B – Light Vehicle</h4><p>Cars, bakkies, small vans</p></div>
                  <div className="course-badge">Popular</div>
                </div>
                <div className="course-item">
                  <div className="course-item-info"><h4>Code C1 – Medium Vehicle</h4><p>Trucks up to 16,000 kg</p></div>
                  <div className="course-badge" style={{background:'rgba(255,255,255,0.15)',color:'white'}}>C1</div>
                </div>
                <div className="course-item">
                  <div className="course-item-info"><h4>Code 10 – Heavy Vehicle</h4><p>Rigid trucks & buses</p></div>
                  <div className="course-badge" style={{background:'rgba(255,255,255,0.15)',color:'white'}}>C</div>
                </div>
                <div className="course-item">
                  <div className="course-item-info"><h4>Learner's Licence Prep</h4><p>Written test preparation</p></div>
                  <div className="course-badge" style={{background:'rgba(255,255,255,0.15)',color:'white'}}>K53</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ABOUT */}
      <motion.section 
        id="about" 
        className="about section-pad"
        {...fadeInUp}
      >
        <div className="container">
          <div className="about-grid">
            <div className="about-img-wrap">
              <div className="about-img-placeholder">
                <svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="25" width="80" height="25" rx="6" fill="white" opacity="0.5"/>
                  <circle cx="25" cy="52" r="8" fill="white" opacity="0.7"/>
                  <circle cx="75" cy="52" r="8" fill="white" opacity="0.7"/>
                  <rect x="30" y="18" width="40" height="22" rx="4" fill="white" opacity="0.4"/>
                  <rect x="15" y="30" width="15" height="10" rx="2" fill="#f59e0b" opacity="0.8"/>
                  <rect x="70" y="30" width="15" height="10" rx="2" fill="#f59e0b" opacity="0.8"/>
                </svg>
              </div>
              <div className="about-badge">
                <div className="about-badge-num">5.0</div>
                <div className="about-badge-text">Google Rating</div>
              </div>
            </div>
            <div style={{paddingTop: '2rem'}}>
              <div className="section-label">About MMJ Driving School</div>
              <h2 className="section-title">Shaping Safe Drivers Since Day One</h2>
              <p className="section-sub">Located in Elsburg, Germiston, MMJ Driving School is built on patience, professionalism, and genuine care for every student's success. Our lead instructors Jimmy and Jacob have transformed nervous beginners into confident, road-ready drivers.</p>
              <div className="about-features">
                <div className="about-feature">
                  <div className="about-feature-icon"><Car size={24} /></div>
                  <div><div className="about-feature-title">Expert Instructors</div><div className="about-feature-desc">Jimmy & Jacob — patient, professional, and dedicated to your success.</div></div>
                </div>
                <div className="about-feature">
                  <div className="about-feature-icon"><Award size={24} /></div>
                  <div><div className="about-feature-title">First-Time Pass Rate</div><div className="about-feature-desc">Hundreds of students have passed their K53 test on the very first attempt.</div></div>
                </div>
                <div className="about-feature">
                  <div className="about-feature-icon"><MapPin size={24} /></div>
                  <div><div className="about-feature-title">Convenient Location</div><div className="about-feature-desc">33 Delport St, Elsburg, Germiston — easy to reach, with flexible hours.</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SERVICES */}
      <motion.section 
        id="services" 
        className="section-pad"
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="container">
          <div className="section-label">What We Offer</div>
          <h2 className="section-title">Our Driving Courses</h2>
          <p className="section-sub">Whether you're a first-timer or upgrading your licence, we have a course tailored for you.</p>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon blue"><Car size={32} /></div>
              <h3>Code B – Light Motor Vehicle</h3>
              <p>The most popular option — covers cars, bakkies, and small vans. We take you from zero to test-ready with patient, structured lessons.</p>
              <div className="service-price">
                <div><div className="service-price-val">Contact Us</div><div className="service-price-label">for pricing</div></div>
                <button className="btn-sm" onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})}>Enquire</button>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon amber"><Settings size={32} /></div>
              <h3>Code C1 – Medium Truck</h3>
              <p>For vehicles between 3,500 kg and 16,000 kg. Perfect for those entering the transport and logistics industry.</p>
              <div className="service-price">
                <div><div className="service-price-val">Contact Us</div><div className="service-price-label">for pricing</div></div>
                <button className="btn-sm" onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})}>Enquire</button>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon green"><Car size={32} /></div>
              <h3>Code 10 – Heavy Vehicle</h3>
              <p>Full rigid truck and bus licence. Tracy got hers through us — join the many professionals we've certified.</p>
              <div className="service-price">
                <div><div className="service-price-val">Contact Us</div><div className="service-price-label">for pricing</div></div>
                <button className="btn-sm" onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})}>Enquire</button>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon purple"><ShieldCheck size={32} /></div>
              <h3>Learner's Licence Preparation</h3>
              <p>Struggling with the K53 theory test? Our written test prep covers all rules, signs, and controls you need to know.</p>
              <div className="service-price">
                <div><div className="service-price-val">Contact Us</div><div className="service-price-label">for pricing</div></div>
                <button className="btn-sm" onClick={() => document.getElementById('contact').scrollIntoView({behavior: 'smooth'})}>Enquire</button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* GALLERY */}
      <motion.section 
        id="gallery" 
        className="gallery section-pad"
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="container">
          <div className="section-label">Happy Students</div>
          <h2 className="section-title">Our Success Stories</h2>
          <p className="section-sub">Celebrating every student who drives away with their licence in hand.</p>
          <div className="gallery-grid">
            {galleryPhotos.length === 0 ? (
              <div className="gallery-empty">Photos coming soon — check back after our admin uploads student success shots!</div>
            ) : (
              galleryPhotos.map(photo => {
                const { data: { publicUrl } } = supabase.storage.from('MMJ Pictures').getPublicUrl(photo.image_path)
                return (
                  <div key={photo.id} className="gallery-item">
                    <img src={publicUrl} alt={photo.title} />
                    {photo.description && <div className="gallery-caption">{photo.description}</div>}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </motion.section>

      {/* REVIEWS */}
      <motion.section 
        id="reviews" 
        className="section-pad"
        style={{background: 'var(--card)'}}
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="container">
          <div className="section-label">What Students Say</div>
          <h2 className="section-title">Real Reviews from Real Students</h2>
          <div className="reviews-grid">
            {reviews.length === 0 ? (
              <div style={{color:'var(--text-muted)',textAlign:'center',padding:'2rem'}}>No reviews yet. Sign in to leave a review!</div>
            ) : (
              reviews.map((review, index) => {
                const initials = review.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()
                return (
                  <div key={review.id || index} className="review-card">
                    <div className="review-header">
                      <div className="review-avatar" style={{background:review.rating >= 4 ? 'var(--success)' : 'var(--primary)'}}>{initials}</div>
                      <div><div className="review-name">{review.name}</div><div className="review-date">{review.date || (review.created_at ? new Date(review.created_at).toLocaleDateString() : '')}</div></div>
                    </div>
                    <div className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                    <div className="review-text">"{review.text}"</div>
                  </div>
                )
              })
            )}
          </div>
          {user && (
            <div style={{textAlign:'center',marginTop:'2rem'}}>
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="btn-primary"
                style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>
          )}
          {showReviewForm && user && (
            <div style={{maxWidth:'500px',margin:'2rem auto',padding:'2rem',background:'var(--card)',borderRadius:'var(--radius)',border:'1px solid var(--border)'}}>
              <h3 style={{marginBottom:'1.5rem',textAlign:'center'}}>Submit Your Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm(prev => ({...prev, name: e.target.value}))}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm(prev => ({...prev, rating: parseInt(e.target.value)}))}
                  >
                    <option value={5}>★★★★★ - Excellent</option>
                    <option value={4}>★★★★☆ - Good</option>
                    <option value={3}>★★★☆☆ - Average</option>
                    <option value={2}>★★☆☆☆ - Fair</option>
                    <option value={1}>★☆☆☆☆ - Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Your Review</label>
                  <textarea
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm(prev => ({...prev, text: e.target.value}))}
                    placeholder="Share your experience with MMJ Driving School..."
                    rows={4}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary btn-full" disabled={reviewSubmitting}>
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
          {!user && (
            <div style={{textAlign:'center',marginTop:'2rem'}}>
              <Link to="/auth" className="btn-outline" style={{display:'inline-flex',alignItems:'center',gap:'0.5rem'}}>
                Sign In to Write a Review
              </Link>
            </div>
          )}
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.section 
        id="contact" 
        className="contact section-pad"
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="container">
          <div className="section-label">Get in Touch</div>
          <h2 className="section-title">Book a Lesson Today</h2>
          <p className="section-sub">Fill in the form, send us a WhatsApp, or give us a call. We'll get back to you promptly.</p>

          <div className="contact-grid">
            <div>
              <div className="contact-info">
                <div className="contact-info-item">
                  <div className="contact-info-icon"><MapPin size={24} /></div>
                  <div><div className="contact-info-title">Address</div><div className="contact-info-val">33 Delport St, Elsburg<br/>Germiston, South Africa</div></div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><Car size={24} /></div>
                  <div><div className="contact-info-title">Phone</div><div className="contact-info-val"><a href="tel:+27769255790" style={{color:'var(--primary-light)',textDecoration:'none'}}>+27 76 925 5790</a></div></div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-info-icon"><Clock size={24} /></div>
                  <div>
                    <div className="contact-info-title">Hours</div>
                    <div className="contact-info-val">Mon–Thu: 06:00–18:00<br/>Fri: 06:00–17:00<br/>Sat: 07:00–15:00</div>
                  </div>
                </div>
              </div>
              <a href="https://wa.me/27769255790?text=Hi%20MMJ%20Driving%20School%2C%20I'd%20like%20to%20book%20a%20lesson" target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.124 1.535 5.857L.057 23.625a.5.5 0 00.617.617l5.768-1.478A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.693-.528-5.214-1.443l-.374-.214-3.882.994 1.012-3.77-.234-.389A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Chat on WhatsApp
              </a>
              <div className="map-container">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7155.396025029279!2d28.19585337619613!3d-26.27146277703526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e951188ce5bfadf%3A0xae94bc2b9a4a10a!2sMMJ%20Driving%20School!5e0!3m2!1sen!2sza!4v1782307195165!5m2!1sen!2sza" width="600" height="450" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>
              </div>
            </div>

            <div className="contact-form">
              <h3 style={{fontSize:'1.2rem',fontWeight:800,color:'var(--foreground)',marginBottom:'2rem'}}>Send Us a Message</h3>
              <form onSubmit={handleContactSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      placeholder="Your name" 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={contactForm.phone}
                      onChange={handleContactChange}
                      placeholder="+27..." 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    placeholder="your@email.com" 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Course Interested In</label>
                  <select 
                    name="course"
                    value={contactForm.course}
                    onChange={handleContactChange}
                  >
                    <option value="">Select a course...</option>
                    <option value="Code B">Code B – Light Motor Vehicle</option>
                    <option value="Code C1">Code C1 – Medium Truck</option>
                    <option value="Code 10">Code 10 – Heavy Vehicle</option>
                    <option value="Learner's Licence">Learner's Licence Preparation</option>
                    <option value="Other">Other / Not sure yet</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <textarea 
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    placeholder="Tell us a bit about yourself and when you'd like to start..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary btn-full" disabled={contactLoading}>
                  {contactLoading ? 'Sending...' : 'Send Message'}
                </button>
                {contactSuccess && (
                  <div className="contact-success" style={{display:'block'}}>
                    Message sent! We'll be in touch within 24 hours.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  )
}
