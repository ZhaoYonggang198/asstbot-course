import { createActions, handleActions } from '../lib/redux-actions.min.js'
import { createStore, applyMiddleware } from '../lib/redux.js'
import thunk from '../lib/redux-thunk.js'

export const { setExhibitionChecked, exhibitionActionExecuted } = createActions({
  SET_EXHIBITION_CHECKED: (exhibitionId, chooseItemId, chooseItem, actions) => (
    {exhibitionId, chooseItemId, chooseItem, actions}),
  EXHIBITION_ACTION_EXECUTED: () => ({})
})

const initState = {exhibitionId: -1, chooseItemId: -1, chooseItem: {}, actions: []}

const exhibition = handleActions({
  [setExhibitionChecked]: (state, action) => {
    let payload = action.payload
    if (state.exhibitionId !== payload.exhibitionId || state.chooseItemId !== payload.chooseItemId) {
      return {...payload}
    } else {
      return {...initState}
    }
  },
  [exhibitionActionExecuted]: (state, action) => { return {...initState} }
},
{...initState})

const exhibitionStore = createStore(exhibition, applyMiddleware(thunk))

export const store = {
  exhibition: exhibitionStore
}
