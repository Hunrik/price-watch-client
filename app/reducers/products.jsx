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
    const products = data.map((elem) => {
      let product = elem
      product.newPrice = elem.price ? elem.price[elem.price.length - 1] : 'N/A'
      product.oldPrice = elem.price ? elem.price[elem.price.length - 2] : 'N/A'
      product.percentage = typeof oldPrice === 'number' ? 100 - (product.newPrice / product.oldPrice * 100) : '0'
      return product
    }).sort((a, b) => {
      return b - a
    })
    return Object.assign({}, state, { products: products }, { isLoading: false })
  }
}

const initialState = {
  isLoading: false,
  products: []
}

export default function productsReducer (state = initialState , action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
