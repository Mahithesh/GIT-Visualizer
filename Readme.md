# GitHub Profile Visualizer

GitHub Profile Visualizer is a React application that lets you search for a GitHub username and explore profile details, repositories, and analysis data in one place.

## Features

- Search for a GitHub user
- View profile information such as avatar, bio, followers, following, company, blog, and location
- Browse repository listings for the searched user
- Open repository-specific details
- View analysis data and charts based on the selected GitHub account
- Handle loading, empty, failure, and not found states

## Tech Stack

- React 17
- React Router DOM
- Recharts
- React Icons
- CSS

## Project Structure

```text
src/
  components/
  context/
  utils/
  App.js
  index.js
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and add:

```env
REACT_APP_GITHUB_API_KEY=your_api_key_here
```

You can use [`.env.example`](e:\GIT%20pro\.env.example) as a reference.

### Run Locally

```bash
npm start
```

The app will run on `http://localhost:3000`.

### Production Build

```bash
npm run build
```

## Routes

- `/` : Home page and user search
- `/repositories` : Repository list
- `/repositories/:repoName` : Repository details
- `/analysis` : Profile analysis
- `/not-found` : Fallback route

## Deployment

This project is configured for GitHub Pages deployment through GitHub Actions.

- Production URL: `https://mahithesh.github.io/GIT-Visualizer/`
- Workflow file: [`.github/workflows/deploy-pages.yml`](e:\GIT%20pro\.github\workflows\deploy-pages.yml)

Before deployment, add this repository secret in GitHub:

- `REACT_APP_GITHUB_API_KEY`

## Available Scripts

```bash
npm start
npm run build
npm test
```

## Notes

- The app uses `HashRouter` for GitHub Pages compatibility.
- API access depends on a valid `REACT_APP_GITHUB_API_KEY`.

## License

This project is for learning and personal project use.
