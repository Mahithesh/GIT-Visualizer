import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {AiOutlineFork} from 'react-icons/ai'
import {BiStar} from 'react-icons/bi'
import Header from '../Header'
import AppContext from '../../context/AppContext'
import {EmptyView, FailureView, LoaderView} from '../StatusViews'
import {apiStatus, apiUrls, imageUrls} from '../../utils/constants'
import './index.css'

const tagPalette = ['tag-pink', 'tag-green', 'tag-blue', 'tag-magenta', 'tag-yellow', 'tag-purple']

class Repositories extends Component {
  static contextType = AppContext

  state = {
    status: apiStatus.initial,
    repos: [],
    fetchedUser: '',
  }

  componentDidMount() {
    const {username} = this.context
    if (username) {
      this.getRepositories(username)
    }
  }

  componentDidUpdate() {
    const {username} = this.context
    const {fetchedUser} = this.state

    if (username && username !== fetchedUser) {
      this.getRepositories(username)
    }
  }

  getRepositories = async user => {
    this.setState({status: apiStatus.loading, fetchedUser: user})

    try {
      const response = await fetch(apiUrls.repos(user))
      if (!response.ok) {
        this.setState({status: apiStatus.failure})
        return
      }
      const data = await response.json()
      this.setState({status: apiStatus.success, repos: data})
    } catch (error) {
      this.setState({status: apiStatus.failure})
    }
  }

  onRetry = () => {
    const {username} = this.context
    if (username) {
      this.getRepositories(username)
    }
  }

  renderRepoList = () => {
    const {repos} = this.state

    if (repos.length === 0) {
      return (
        <EmptyView
          imageUrl={imageUrls.noRepositories}
          altText="no repositories"
          heading="No Repositories Found!"
        />
      )
    }

    return (
      <div>
        <div className="repo-owner-strip">
          <img
            src={repos[0].owner.avatar_url}
            alt={repos[0].owner.login}
            className="repo-owner-avatar"
          />
        </div>
        <h1 className="tab-title">Repositories</h1>
        <ul className="repo-list">
          {repos.map(eachRepo => (
            <li key={eachRepo.id} className="repo-item" data-testid="repoItem">
              <Link to={`/repositories/${eachRepo.name}`} className="repo-link">
                <h1 className="repo-name">{eachRepo.name}</h1>
                <p className="repo-description">{eachRepo.description || 'No description available'}</p>
                <ul className="repo-tags">
                  {(eachRepo.languages || [])
                    .slice(0, 6)
                    .map((language, index) => (
                      <li
                        key={`${eachRepo.id}-${language.name}`}
                        className={`repo-tag ${tagPalette[index % tagPalette.length]}`}
                      >
                        {language.name}
                      </li>
                    ))}
                </ul>
                <div className="repo-stats-row">
                  <p className="repo-stat">
                    <BiStar /> {eachRepo.stargazers_count}
                  </p>
                  <p className="repo-stat">
                    <AiOutlineFork /> {eachRepo.forks_count}
                  </p>
                  <p className="repo-stat">{eachRepo.open_issues_count}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderContent = () => {
    const {username} = this.context
    const {status} = this.state

    if (!username) {
      return (
        <EmptyView
          imageUrl={imageUrls.emptyRepositories}
          altText="empty repositories"
          heading="No Data Found"
          showHomeButton
        />
      )
    }

    switch (status) {
      case apiStatus.loading:
        return <LoaderView />
      case apiStatus.success:
        return this.renderRepoList()
      case apiStatus.failure:
        return <FailureView onRetry={this.onRetry} />
      default:
        return <LoaderView />
    }
  }

  render() {
    return (
      <div className="page">
        <Header />
        <main className="main-content">{this.renderContent()}</main>
      </div>
    )
  }
}

export default Repositories
