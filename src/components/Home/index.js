import React, {Component} from 'react'
import {HiOutlineSearch} from 'react-icons/hi'
import {RiBuildingLine} from 'react-icons/ri'
import {IoMdLink} from 'react-icons/io'
import {IoLocationOutline} from 'react-icons/io5'
import Header from '../Header'
import {FailureView, LoaderView} from '../StatusViews'
import AppContext from '../../context/AppContext'
import {apiStatus, apiUrls, imageUrls} from '../../utils/constants'
import './index.css'

class Home extends Component {
  static contextType = AppContext

  state = {
    searchInput: '',
    status: apiStatus.initial,
    profile: null,
    isInvalidUsername: false,
  }

  componentDidMount() {
    const {username} = this.context
    if (username) {
      this.setState({searchInput: username}, this.getProfileDetails)
    }
  }

  getProfileDetails = async () => {
    const {searchInput} = this.state
    const trimmed = searchInput.trim()

    if (!trimmed) {
      this.context.setUsername('')
      this.setState({
        status: apiStatus.initial,
        profile: null,
        isInvalidUsername: true,
      })
      return
    }

    this.setState({status: apiStatus.loading, isInvalidUsername: false})

    try {
      const response = await fetch(apiUrls.profileDetails(trimmed))
      if (!response.ok) {
        const isInvalidUsername = true
        this.context.setUsername('')
        this.setState({
          status: apiStatus.failure,
          profile: null,
          isInvalidUsername,
        })
        return
      }

      const data = await response.json()
      this.context.setUsername(trimmed)
      this.setState({status: apiStatus.success, profile: data, isInvalidUsername: false})
    } catch (error) {
      this.setState({status: apiStatus.failure, isInvalidUsername: false})
    }
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value, isInvalidUsername: false})
  }

  onClickSearch = () => {
    this.getProfileDetails()
  }

  onKeyDownSearch = event => {
    if (event.key === 'Enter') {
      this.getProfileDetails()
    }
  }

  renderProfile = () => {
    const {profile} = this.state
    const formatCount = value => new Intl.NumberFormat('en-US').format(value || 0)

    return (
      <div className="home-profile-card">
        <img
          src={profile.avatar_url}
          alt={profile.name}
          className="home-avatar"
        />
        <div className="home-profile-meta">
          <h1>{profile.name}</h1>
          <p className="home-username">{profile.login}</p>
          <p className="home-bio">{profile.bio}</p>
          <div className="home-stats">
            <div className="home-stat-item">
              <p className="home-stat-value">{formatCount(profile.followers)}</p>
              <p className="home-stat-label">FOLLOWERS</p>
            </div>
            <div className="home-stat-item home-stat-divider">
              <p className="home-stat-value">{formatCount(profile.following)}</p>
              <p className="home-stat-label">FOLLOWING</p>
            </div>
            <div className="home-stat-item">
              <p className="home-stat-value">{formatCount(profile.public_repos)}</p>
              <p className="home-stat-label">PUBLIC REPOS</p>
            </div>
          </div>
          <div className="home-extras-grid">
            <div className="home-extra-item">
              <p className="home-extra-title">Company</p>
              <p className="home-extra-value">
                <RiBuildingLine /> {profile.company || 'N/A'}
              </p>
            </div>
            <div className="home-extra-item">
              <p className="home-extra-title">Company Url</p>
              <p className="home-extra-value">
                <IoMdLink /> {profile.blog || 'N/A'}
              </p>
            </div>
            <div className="home-extra-item">
              <p className="home-extra-title">Location</p>
              <p className="home-extra-value">
                <IoLocationOutline /> {profile.location || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderContent = () => {
    const {status, isInvalidUsername} = this.state

    switch (status) {
      case apiStatus.loading:
        return <LoaderView />
      case apiStatus.success:
        return this.renderProfile()
      case apiStatus.failure:
        return (
          <FailureView
            onRetry={this.getProfileDetails}
            imageUrl={isInvalidUsername ? imageUrls.invalidUsername : imageUrls.failure}
          />
        )
      default:
        return (
          <div className="home-empty">
            <img
              src={imageUrls.home}
              alt="github profile visualizer home page"
              className="home-image"
            />
          </div>
        )
    }
  }

  render() {
    const {searchInput, isInvalidUsername} = this.state
    const searchBarClassName = isInvalidUsername
      ? 'search-bar home-search-centered search-bar-error'
      : 'search-bar home-search-centered'

    return (
      <div className="page">
        <Header />
        <main className="main-content">
          <div className={searchBarClassName}>
            <input
              type="search"
              value={searchInput}
              onChange={this.onChangeSearch}
              onKeyDown={this.onKeyDownSearch}
              placeholder="Enter GitHub username"
              className="search-input"
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-btn"
              onClick={this.onClickSearch}
            >
              <HiOutlineSearch />
            </button>
          </div>
          {isInvalidUsername && (
            <p className="search-error-text">Enter the valid github username</p>
          )}
          <div className="home-content-area">{this.renderContent()}</div>
        </main>
      </div>
    )
  }
}

export default Home
