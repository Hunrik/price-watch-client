import React from 'react'
import { Route, IndexRoute } from 'react-router'

import { fetchVoteData } from 'fetch-data'
import App from 'containers/App'
import Vote from 'containers/Vote'
import About from 'containers/About'
import LoginOrRegister from 'containers/LoginOrRegister'
import Dashboard from 'containers/Dashboard'
import Home from 'containers/Home'
import PriceList from 'containers/PriceList'
import AddNewSite from 'containers/AddNewSite'
/*
 * @param {Redux Store}
 * We require store as an argument here because we wish to get
 * state from the store after it has been authenticated.
 */
export default (store) => {
  const requireAuth = (nextState, replace, callback) => {
    const { user: { authenticated }} = store.getState()
    if (!authenticated) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      })
    }
    callback()
  }

  const redirectAuth = (nextState, replace, callback) => {
    const { user: { authenticated }} = store.getState()
    if (authenticated) {
      replace({
        pathname: '/'
      })
    }
    callback()
  }
  return (
    <Route path='/' component={App}>
      <IndexRoute component={Home} />
      <Route path='login' component={LoginOrRegister} onEnter={redirectAuth} />
      <Route path='dashboard' component={Dashboard} /*onEnter={requireAuth}*/ />
      <Route path='new' component={AddNewSite} />
      <Route path='/pricelist' component={PriceList} />
    </Route>
  )
}
