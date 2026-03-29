import React, {Component} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import AppContext from './context/AppContext'
import Home from './components/Home'
import Repositories from './components/Repositories'
import RepositoryDetails from './components/RepositoryDetails'
import Analysis from './components/Analysis'
import NotFound from './components/NotFound'

class App extends Component {
  state = {
    username: '',
  }

  setUsername = username => {
    this.setState({username})
  }

  render() {
    const {username} = this.state

    return (
      <AppContext.Provider value={{username, setUsername: this.setUsername}}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/repositories" component={Repositories} />
          <Route exact path="/repositories/:repoName" component={RepositoryDetails} />
          <Route exact path="/analysis" component={Analysis} />
          <Route exact path="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </AppContext.Provider>
    )
  }
}

export default App