import axios from 'axios'
import _ from 'lodash'

const SET_PRODUCT = 'SET_PRODUCT'

export const getProducts = (data) => {
  return _.throttle((dispatch, getState) => {
    axios.get('products', {
      params: {
        page: 1
      }
    }).then(({data}) => {
      dispatch(setproduct(data))
    })
  }, 100)
}
const setproduct = (data) => {
  return {
    type: SET_PRODUCT,
    data: data
  }
}

const ACTION_HANDLERS = {
  [SET_PRODUCT]: (state, {data}) => {
    data = data.sort(function (a, b) {
      if (a.difference < b.difference) {
        return 1
      }
      if (a.difference > b.difference) {
        return -1
      }
      // a must be equal to b
      return 0
    })
    return Object.assign({}, state, { products: data }, { isLoading: false })
  }
}

const initialState = {
  isLoading: false,
  products: []
}

export default function productsReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
