import { createReducer } from "./createReducer";
const initialState = {
    selectedSuggestion: null
}
export default createReducer(initialState, {
    SET_SELECTED_SUGGESTION: (state, payload) => {
        return Object.assign({}, state, { selectedSuggestion: payload })
    }
})