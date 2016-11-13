import axios from 'axios'
import _ from 'lodash'

const GET_STATUS = 'GET_STATUS'
const SET_STATUS = 'SET_STATUS'
const START_STATUS = 'START_STATUS'

export const startStatus = () => {
    //setInterval(getStatus(), 2000)
}
export const getStatus = (data) => {
  return _.throttle((dispatch, getState) => {
    axios.get('status').then(({data}) => {
      dispatch(setStatus(data))
    })
  }, 100)
}
const setStatus = (data) => {
  return {
    type: SET_STATUS,
    data: data
  }
}

const ACTION_HANDLERS = {
  [START_STATUS]: (state, action) => {
    return Object.assign({}, state)
  },
  [GET_STATUS]: (state, { data }) => {
    return Object.assign({}, state, { isLoading: true })
  },
  [SET_STATUS]: (state, { data }) => {
    return Object.assign({}, state, data, { isLoading: false })
  }
}

const initialState = {
  isLoading: false,
  sitesInQueue: 0,
  productsInQueue: 0
}

export default function statisticsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
