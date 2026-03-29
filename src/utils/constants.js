import invalidUsernameImage from './Frame 8830.png'
import homeImage from './Home.png'
import notFOund from './not found.png'
import dataNotFound from './Empty_Box_Illustration 1.png'

export const API_KEY = process.env.REACT_APP_GITHUB_API_KEY || ''

export const apiUrls = {
  profileDetails: username =>
    `https://apis2.ccbp.in/gpv/profile-details/${encodeURIComponent(
      username,
    )}?api_key=${API_KEY}`,
  repos: username =>
    `https://apis2.ccbp.in/gpv/repos/${encodeURIComponent(
      username,
    )}?api_key=${API_KEY}`,
  repoDetails: (username, repoName) =>
    `https://apis2.ccbp.in/gpv/specific-repo/${encodeURIComponent(
      username,
    )}/${encodeURIComponent(repoName)}?api_key=${API_KEY}`,
  analysis: username =>
    `https://apis2.ccbp.in/gpv/profile-summary/${encodeURIComponent(
      username,
    )}?api_key=${API_KEY}`,
}

export const apiStatus = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

export const imageUrls = {
  home: homeImage,
  failure:
    'https://assets.ccbp.in/frontend/react-js/api-failure-view.png',
  emptyRepositories: dataNotFound,
  noRepositories: dataNotFound,
  emptyAnalysis:
    dataNotFound,
  noAnalysis: dataNotFound,
  notFound: notFOund,
  invalidUsername: invalidUsernameImage,
}
