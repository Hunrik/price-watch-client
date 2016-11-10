import axios from 'axios'
import _ from 'lodash'
import { getStatus } from './statistics'
const SET_SITES = 'SET_SITES'
const TOGGLE_ROW = 'TOGGLE_ROW'
const OPEN_ADD_NEW = 'OPEN_ADD_NEW'
const CLOSE_ADD_NEW = 'CLOSE_ADD_NEW'
const SAVE_ADD_NEW = 'SAVE_ADD_NEW'
const REPARSE_SITE = 'REPARSE_SITE'
export const getSites = (data) => {
  return (dispatch, getState) => {
    axios.get('sites').then(({data}) => {
      dispatch(setSites(data))
    })
  }
}
export const saveAndCloseNewSite = (data) => {
  return (dispatch, getState) => {
    const siteData = _.pick(data, 'domainName', 'productIdSelector', 'productNameSelector', 'priceSelector', 'productPageSelector', 'sitemap')
    axios.post('sites', siteData).then(({data}) => {
      dispatch(saveNewSite(data))
    })
  }
}
export const reParse = (data) => {
  return (dispatch, getState) => {
    axios.get('sites/' + data + '/parse').then(({data}) => {
      dispatch(getStatus())
    }).catch((e) => console.log(e))
  }
}
export const emptySitesQueue = () => {
  return (dispatch, getState) => {
    axios.Delete('queue/site').then((response) => {
      dispatch(getStatus())
    })
  }
}
export const emptyProductsQueue = () => {
  axios.Delete('queue/product').then((response) => {
    getStatus()
  })
}
export function toggleRow (rowId) {
  return {
    type: TOGGLE_ROW,
    rowId
  }
}
export function saveNewSite (data) {
  return {
    type: SAVE_ADD_NEW,
    data
  }
}
export function addNewSite (data) {
  return {
    type: OPEN_ADD_NEW,
    data
  }
}
export function closeNewSite () {
  return {
    type: CLOSE_ADD_NEW
  }
}
const setSites = (data) => {
  return {
    type: SET_SITES,
    data: data
  }
}
export const editSite = data => {
  return (dispatch, getState) => {
    const siteData = _.pick(data, 'domainName', 'productIdSelector', 'productNameSelector', 'priceSelector', 'productPageSelector', 'sitemap')
    axios.put('sites', siteData).then(({data}) => {
      dispatch(saveNewSite(data))
    }).catch(console.log)
  }
}
const ACTION_HANDLERS = {
  [SET_SITES]: (state, { data }) => {
    return Object.assign({}, state, { sites: data, isLoading: false })
  },
  [TOGGLE_ROW]: (state, { type, rowId }) => {
    let newRowsOpen = []

    if (state.rowsOpen.includes(rowId)) newRowsOpen = _.without(state.rowsOpen, rowId)
    else newRowsOpen = _.union(state.rowsOpen, [rowId])

    return Object.assign({}, state, { rowsOpen: newRowsOpen })
  },
  [OPEN_ADD_NEW]: (state, { type, data }) => {
    return Object.assign({}, state, { isAddNewOpen: true })
  },
  [CLOSE_ADD_NEW]: (state) => {
    return Object.assign({}, state, { isAddNewOpen: false })
  },
  [SAVE_ADD_NEW]: (state, { data }) => {
    const sites = [...state.sites, data]
    return Object.assign({}, state, { sites })
  }
}

const initialState = {
  isLoading: true,
  sites: [],
  atcPopup: {
    isEnabled: false
  },
  rowsOpen: [],
  isAddNewOpen: false
}

export default function home (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
