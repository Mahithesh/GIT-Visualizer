import React, {Component} from 'react'
import {AiOutlineFork} from 'react-icons/ai'
import {BiStar} from 'react-icons/bi'
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts'
import Header from '../Header'
import AppContext from '../../context/AppContext'
import {FailureView, LoaderView} from '../StatusViews'
import {apiStatus, apiUrls} from '../../utils/constants'
import './index.css'

const colors = ['#58d26c', '#33a3eb', '#f2c94c', '#f36587', '#8f67f6', '#6ed6f4', '#20bf6b']

class RepositoryDetails extends Component {
  static contextType = AppContext

  state = {
    status: apiStatus.initial,
    details: null,
  }

  componentDidMount() {
    this.getRepoDetails()
  }

  componentDidUpdate(prevProps) {
    const {repoName} = this.props.match.params
    const prevRepoName = prevProps.match.params.repoName
    if (prevRepoName !== repoName) {
      this.getRepoDetails()
    }
  }

  getRepoDetails = async () => {
    const {repoName} = this.props.match.params
    const {username} = this.context

    if (!username) {
      this.setState({status: apiStatus.failure})
      return
    }

    this.setState({status: apiStatus.loading})

    try {
      const response = await fetch(apiUrls.repoDetails(username, repoName))
      if (!response.ok) {
        this.setState({status: apiStatus.failure})
        return
      }
      const data = await response.json()
      this.setState({status: apiStatus.success, details: data})
    } catch (error) {
      this.setState({status: apiStatus.failure})
    }
  }

  renderDetails = () => {
    const {details} = this.state
    const languageData = (details.lanuages || details.languages || []).map(each => ({
      name: each.name,
      value: each.value,
    }))
    const contributors = details.contributors || []
    const visibleContributors = contributors.slice(0, 5)
    const remainingContributors = contributors.length - visibleContributors.length

    return (
      <div className="repo-details-card">
        <h1 className="repo-details-title">{details.name}</h1>
        <p className="repo-details-description">{details.description || 'No description available.'}</p>
        <div className="repo-details-stats-row">
          <p className="repo-details-stat">
            <BiStar /> {details.stargazers_count}
          </p>
          <p className="repo-details-stat">
            <AiOutlineFork /> {details.forks_count}
          </p>
          <p className="repo-details-stat">{details.open_issues_count}</p>
        </div>

        <div className="repo-details-metric-grid">
          <div className="metric-box">
            <p className="metric-label">Commits Count</p>
            <p className="metric-value">{details.watchers_count || 0}</p>
          </div>
          <div className="metric-box">
            <p className="metric-label">Issues Count</p>
            <p className="metric-value">{details.open_issues_count || 0}</p>
          </div>
        </div>

        <h2 className="repo-subheading">Contributors :</h2>
        <p className="member-count">{contributors.length} Members</p>
        <ul className="contributors-list-inline">
          {visibleContributors.map(eachContributor => (
            <li key={eachContributor.id} className="contributor-inline-item">
              <img
                src={eachContributor.avatar_url}
                alt="contributor profile"
                className="contributor-image-inline"
              />
            </li>
          ))}
          {remainingContributors > 0 && (
            <li className="contributor-more-badge">+{remainingContributors}</li>
          )}
        </ul>

        {languageData.length > 0 && (
          <div className="language-section">
            <h2 className="repo-subheading">Languages :</h2>
            <div className="language-chart-wrap">
              <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                  <Pie data={languageData} dataKey="value" nameKey="name" innerRadius={66} outerRadius={108}>
                    {languageData.map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="square" layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    )
  }

  renderContent = () => {
    const {status} = this.state

    switch (status) {
      case apiStatus.loading:
        return <LoaderView />
      case apiStatus.success:
        return this.renderDetails()
      case apiStatus.failure:
        return <FailureView onRetry={this.getRepoDetails} />
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

export default RepositoryDetails
