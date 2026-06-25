import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Car, Steering, MapPin, ShieldCheck, Award, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

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

const REVIEWS = [
  { name: 'Nqobile', color: '#2563a8', date: 'Nov 2023', text: "Jimmy was so patient with me from the beginning — very humble, and that helped me learn fast. He believed in me when I didn't. I passed Code B even though people told me it was hard!" },
  { name: 'Siyabonga', color: '#059669', date: 'Nov 2023', text: "The journey from fear to confidence was made possible by MMJ's exceptional patience. I passed on my first attempt. Shout out to Jimmy and Jacob — Ngiyabonga kakhulu!" },
  { name: 'Sherley', color: '#7c3aed', date: 'Nov 2023', text: "Jimmy and Jacob did a very good job teaching me to drive. It wasn't easy but we did it together. Buti Jimmy, you deserve Bells — thank you so much, may God bless you!" },
  { name: 'Zamaswazi', color: '#dc2626', date: 'Nov 2023', text: "Jimmy is such a great instructor — patient and teaches you important details to ensure a great and easy driving experience." },
  { name: 'Tracy', color: '#0891b2', date: 'Mar 2023', text: "Did my Code 10 with MMJ Driving School. Very professional and well-mannered instructors. I highly recommend!" },
  { name: 'Maharela', color: '#d97706', date: 'Nov 2020', text: "They were very patient with me, taught me everything about driving, very strict with time management, and I passed and got my driving licence on first attempt!" },
]

export default function Home() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  })
  const [contactSuccess, setContactSuccess] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)

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
                <Link to="/#contact" className="btn-primary">Book a Lesson</Link>
                <Link to="/#services" className="btn-outline">View Courses</Link>
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
              <div className="service-icon amber"><Steering size={32} /></div>
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
            <div className="gallery-empty">Photos coming soon — check back after our admin uploads student success shots!</div>
          </div>
        </div>
      </motion.section>

      {/* REVIEWS */}
      <motion.section 
        id="reviews" 
        className="section-pad" style={{background: 'white'}}
        {...fadeInUp}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="container">
          <div className="section-label">What Students Say</div>
          <h2 className="section-title">Real Reviews from Real Students</h2>
          <div className="reviews-grid">
            {REVIEWS.map((review, index) => {
              const initials = review.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()
              return (
                <div key={index} className="review-card">
                  <div className="review-header">
                    <div className="review-avatar" style={{background:review.color}}>{initials}</div>
                    <div><div className="review-name">{review.name}</div><div className="review-date">{review.date}</div></div>
                  </div>
                  <div className="stars">★★★★★</div>
                  <div className="review-text">"{review.text}"</div>
                </div>
              )
            })}
          </div>
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
