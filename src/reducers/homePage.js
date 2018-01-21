import { createReducer } from "./createReducer";
const initialState = {
    selectedSuggestion: {}
}
export default createReducer(initialState, {
    SELECT_SUGGESTION: (state, payload) => {
        return Object.assign({}, state, { selectedSuggestion: payload.data })
    }
})