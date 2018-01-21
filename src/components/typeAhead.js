import React, { Component } from "react";
import axios from "axios";

export default class TypeAhead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || "",
      suggestions: {},
      showHint: false,
      selectedSuggestion:null,
      hoveredSuggestion: null
    };
    // this.axiosCancelToken = null;
    this.onChange = this.onChange.bind(this);
    this.handleSuggestionClick = this.handleSuggestionClick.bind(this);
  }
  onChange(e) {
    const { url, queryKey, itemsToShow } = this.props;
    const { suggestions } = this.state;
    const query = e.target.value.trim();
    this.setState({ value: query });
    if (suggestions[query] || query === "") {
      return;
    }
    this.fetchSuggestions(url, queryKey, query, itemsToShow);
  }
  fetchSuggestions(url, queryKey = "q", query, itemsToShow = 5) {
    let params = {};
    params[queryKey] = query;
    // if(this.axiosCancelToken){
    //     debugger
    //     axiosCancelToken.cancel();
    //     this.axiosCancelToken = null
    // }
    // this.axiosCancelToken = axios.CancelToken.source()
    axios
      .get(url, { requestId: "typeahead", params: params })
      .then(response => {
        this.setSuggestion(response.data, query);
        // this.axiosCancelToken = null
      })
  }

  handleSuggestionClick(index, e) {
    const { onOptionClick } = this.props;
    // _this.focus();
    // _this.hideHint();
    // _this.hideDropdown();
    this.setSelectedSuggestion(index);
    this.setState({})
    if (typeof onOptionClick === "function") {
      onOptionClick(e, props.options[index]);
    }
  }

  setSelectedSuggestion(index){
    const currentSuggestions = this.getCurrentSuggestions()
    this.setState({selectedSuggestion: currentSuggestions[index]})
  }
  onSuggestionMounseHover(index, e){

  }
  setSuggestion(suggestions, query) {
    let suggestionObj = {};
    suggestionObj[query] = suggestions;
    const updatedObj = Object.assign(this.state.suggestions, suggestionObj);
    this.setState({ suggestions: updatedObj });
  }

  suggestionRender(suggestion) {
    const { displayKey } = this.props;
    return (
      <div className="dropdown-item">
        <span>{suggestion[displayKey]}</span>
      </div>
    );
  }

  getHint() {
    const currentSuggestions = this.getCurrentSuggestions();
    const { displayKey } = this.props;
    const value = this.state.value;
    const regex = new RegExp("^" + value, "i");
    if (
      value.length &&
      currentSuggestions.length &&
      regex.test(currentSuggestions[0][displayKey])
    ) {
      return currentSuggestions[0][displayKey].replace(regex, value);
    }
    return "";
  }
  getCurrentSuggestions() {
    const { value, suggestions } = this.state;
    return suggestions[value] || [];
  }
  render() {
    const { suggestionRender, placeholder, identifierKey } = this.props;
    const { value } = this.state;
    const suggestionsToRender = this.getCurrentSuggestions();
    const hint = this.getHint();
    return (
      <div className="typeahead dropdown">
        <div className="input-wrap">
          <input
            type="text"
            className="hint-field"
            value={hint}
            tabIndex="-1"
          />
          <input
            type="text"
            placeholder={placeholder}
            className="input-field"
            value={value}
            autoComplete="off"
            onChange={this.onChange}
          />
        </div>
        <div
          className={`suggestions-wrap dropdown-menu ${suggestionsToRender.length ? "show" : "hide"}`}
        >
          {suggestionsToRender.map((suggestion, key) => {
            return (
              <div
                key={`${suggestion[identifierKey]}_${key}`}
                onClick={this.handleSuggestionClick.bind(this, key)}
                onMouseOver={this.onSuggestionMounseHover.bind(this, key)}
              >
                {suggestionRender
                  ? suggestionRender(suggestion)
                  : this.suggestionRender(suggestion)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
