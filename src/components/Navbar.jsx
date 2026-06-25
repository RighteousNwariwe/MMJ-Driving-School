import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { Car, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await signOut()
  }

  const isAuthPage = location.pathname === '/auth'

  const scrollToSection = (sectionId) => {
    setMobileOpen(false)
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`
      return
    }
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <Link to="/" className="nav-logo">
        <div className="nav-logo-icon"><Car size={24} /></div>
        <div className="nav-logo-text">MMJ Driving School<span>Germiston, South Africa</span></div>
      </Link>
      
      <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
        <button onClick={() => scrollToSection('about')} className="nav-link-btn">About</button>
        <button onClick={() => scrollToSection('services')} className="nav-link-btn">Services</button>
        <button onClick={() => scrollToSection('gallery')} className="nav-link-btn">Gallery</button>
        <button onClick={() => scrollToSection('reviews')} className="nav-link-btn">Reviews</button>
        <button onClick={() => scrollToSection('contact')} className="nav-link-btn">Contact</button>
        
        {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>}
        
        {!isAuthPage && !user && <Link to="/auth" className="nav-btn" onClick={() => setMobileOpen(false)}>Sign In</Link>}
      </div>

      {user && (
        <div className="nav-auth">
          <span className="nav-user">{user.user_metadata?.full_name || user.email}</span>
          <button className="btn-logout" onClick={handleSignOut}>Sign Out</button>
        </div>
      )}

      <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </nav>
  )
}
