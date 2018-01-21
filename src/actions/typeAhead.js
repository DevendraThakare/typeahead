import axios from "axios";

export function fetchCarsSuggestion(query) {
  return (dispatch, getState) => {
    return axios
      .get(`/fetchCarsSuggestions?q=${query}`)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
}
