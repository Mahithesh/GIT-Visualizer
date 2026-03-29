import React from 'react'

const AppContext = React.createContext({
  username: '',
  setUsername: () => {},
})

export default AppContext