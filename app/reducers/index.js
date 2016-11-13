import { combineReducers } from 'redux'
import user from 'reducers/user'
import topic from 'reducers/topic'
import message from 'reducers/message'
import home from 'reducers/home'
import statistics from 'reducers/statistics'
import { routerReducer as routing } from 'react-router-redux'
import * as types from 'types'
import { reducer as formReducer } from 'redux-form'
import products from 'reducers/products'
const isFetching = (state = false, action) => {
  switch (action.type) {
    case types.CREATE_REQUEST:
      return true
    case types.REQUEST_SUCCESS:
    case types.REQUEST_FAILURE:
      return false
    default:
      return state
  }
}

// Combine reducers with routeReducer which keeps track of
// router state
const rootReducer = combineReducers({
  isFetching,
  topic,
  user,
  message,
  routing,
  home,
  statistics,
  form: formReducer,
  products
})

export default rootReducer
