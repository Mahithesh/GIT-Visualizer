import React, {Component} from 'react'
import {
  Line,
  LineChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Header from '../Header'
import AppContext from '../../context/AppContext'
import {EmptyView, FailureView, LoaderView} from '../StatusViews'
import {objectToChartData} from '../../utils/helpers'
import {apiStatus, apiUrls, imageUrls} from '../../utils/constants'
import './index.css'

const colors = ['#58d26c', '#33a3eb', '#f2c94c', '#f36587', '#8f67f6', '#6ed6f4', '#20bf6b']

class Analysis extends Component {
  static contextType = AppContext

  state = {
    status: apiStatus.initial,
    analysisData: null,
    fetchedUser: '',
  }

  componentDidMount() {
    const {username} = this.context
    if (username) {
      this.getAnalysisData(username)
    }
  }

  componentDidUpdate() {
    const {username} = this.context
    const {fetchedUser} = this.state
    if (username && username !== fetchedUser) {
      this.getAnalysisData(username)
    }
  }

  getAnalysisData = async user => {
    this.setState({status: apiStatus.loading, fetchedUser: user})

    try {
      const response = await fetch(apiUrls.analysis(user))
      if (!response.ok) {
        this.setState({status: apiStatus.failure})
        return
      }
      const data = await response.json()
      this.setState({status: apiStatus.success, analysisData: data})
    } catch (error) {
      this.setState({status: apiStatus.failure})
    }
  }

  onRetry = () => {
    const {username} = this.context
    if (username) {
      this.getAnalysisData(username)
    }
  }

  renderCharts = () => {
    const {analysisData} = this.state
    const repoCommitData = objectToChartData(analysisData.repoCommitCount)
    const langRepoData = objectToChartData(analysisData.langRepoCount)
    const langCommitData = objectToChartData(analysisData.langCommitCount)
    const quarterData = objectToChartData(analysisData.quarterCommitCount)

    if (
      repoCommitData.length === 0 &&
      langRepoData.length === 0 &&
      langCommitData.length === 0 &&
      quarterData.length === 0
    ) {
      return (
        <EmptyView
          imageUrl={imageUrls.noAnalysis}
          altText="no analysis"
          heading="No Analysis Found!"
        />
      )
    }

    return (
      <div className="analysis-wrap">
        <h1 className="analysis-title">Analysis</h1>
        <section className="chart-card">
          <h2 className="analysis-card-heading">Commits Per Quarter</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={quarterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1d5fab" />
                <XAxis dataKey="name" stroke="#4ea5ff" tick={{fontSize: 11}} />
                <YAxis stroke="#cbd5e1" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2f87ff"
                  strokeWidth={2}
                  dot={{r: 2, fill: '#2f87ff'}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="analysis-two-column">
          <article className="chart-card">
            <h2 className="analysis-card-heading">Language Per Repos</h2>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={langRepoData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={92}
                  >
                    {langRepoData.map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="square" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="chart-card">
            <h2 className="analysis-card-heading">Language Per Commits</h2>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={langCommitData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={92}
                  >
                    {langCommitData.map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="square" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>
        </section>

        <section className="chart-card">
          <h2 className="analysis-card-heading">Commits Per Repo (Top 10)</h2>
          <div className="commit-chart-layout">
            <div className="chart-wrap commit-chart-wrap">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={repoCommitData.slice(0, 10)}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={68}
                    outerRadius={112}
                  >
                    {repoCommitData.slice(0, 10).map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="commit-legend-list">
              {repoCommitData.slice(0, 10).map((entry, index) => (
                <li key={entry.name} className="commit-legend-item">
                  <span
                    className="legend-swatch"
                    style={{backgroundColor: colors[index % colors.length]}}
                  />
                  <span className="commit-legend-label">{entry.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    )
  }

  renderContent = () => {
    const {username} = this.context
    const {status} = this.state

    if (!username) {
      return (
        <EmptyView
          imageUrl={imageUrls.emptyAnalysis}
          altText="empty analysis"
          heading="No Data Found"
          showHomeButton
        />
      )
    }

    switch (status) {
      case apiStatus.loading:
        return <LoaderView />
      case apiStatus.success:
        return this.renderCharts()
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

export default Analysis
