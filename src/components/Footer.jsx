import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">MMJ Driving School</div>
            <p className="footer-desc">Building confident, safe drivers in Germiston and beyond. Patient instructors, proven results, first-time pass guarantee approach.</p>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <Link to="/#about">About Us</Link>
              <Link to="/#services">Our Courses</Link>
              <Link to="/#gallery">Gallery</Link>
              <Link to="/#reviews">Reviews</Link>
              <Link to="/#contact">Contact</Link>
            </div>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-links">
              <a href="tel:+27769255790">+27 76 925 5790</a>
              <a href="https://wa.me/27769255790" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
              <a href="#">33 Delport St, Elsburg</a>
              <a href="#">Germiston, South Africa</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 MMJ Driving School. All rights reserved.</span>
          <span>Built for safe roads</span>
        </div>
      </div>
    </footer>
  )
}
