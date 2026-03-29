import React from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import {imageUrls} from '../../utils/constants'
import './index.css'

const NotFound = () => (
  <div className="page">
    <Header />
    <main className="main-content">
      <div className="not-found-wrap">
        <img src={imageUrls.notFound} alt="not found" className="not-found-image" />
        <h1>Page Not Found</h1>
        <p>Sorry, the page you are looking for could not be found.</p>
        <Link to="/" className="home-btn">
          Go to Home
        </Link>
      </div>
    </main>
  </div>
)

export default NotFound