import React from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {imageUrls} from '../../utils/constants'
import './index.css'

export const LoaderView = () => (
  <div className="loader-container" data-testid="loader">
    <Loader type="TailSpin" color="#3B82F6" height={50} width={50} />
  </div>
)

export const FailureView = props => {
  const {
    onRetry,
    imageUrl = imageUrls.failure,
    title = 'Something went wrong',
    description = 'Please try again.',
  } = props

  return (
    <div className="status-wrapper">
      <img src={imageUrl} alt="failure view" className="status-image" />
      <p className="status-title">{title}</p>
      <p className="status-text">{description}</p>
      <button type="button" className="status-button" onClick={onRetry}>
        Try Again
      </button>
    </div>
  )
}

export const EmptyView = props => {
  const {imageUrl, altText, heading, showHomeButton = false} = props

  return (
    <div className="status-wrapper">
      <img src={imageUrl} alt={altText} className="status-image" />
      <p className="status-title">{heading}</p>
      {showHomeButton ? (
        <Link to="/" className="status-link-button">
          Go to Home
        </Link>
      ) : null}
    </div>
  )
}
