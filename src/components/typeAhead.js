import React, { Component } from "react";
import axios from "axios";
import index from "axios";

export default class TypeAhead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || "",
      suggestions: {},
      currentSuggestions: [],
      hint: "",
      selectedSuggestion: null,
      activeIndex: -1
    };
    this.onChange = this.onChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  onChange(e) {
    const query = e.target.value.trim();
    this.onInputChange(query);
  }
  onInputChange(query) {
    const { url, queryKey, itemsToShow } = this.props;
    const { suggestions, currentSuggestions } = this.state;
    this.setState({ value: query, activeIndex: -1 }, () => {
      if (query === "") {
        this.setState({ currentSuggestions: [], hint: "" });
        return;
      }
      if (suggestions[query] && suggestions[query].length) {
        this.setState({
          currentSuggestions: suggestions[query],
          hint: this.getHint(suggestions[query][0])
        });
        return;
      }
      this.fetchSuggestions(url, queryKey, query, itemsToShow);
    });
  }

  fetchSuggestions(url, queryKey = "q", query, itemsToShow = 5) {
    let params = {};
    params[queryKey] = query;
    axios
      .get(url, { requestId: "typeahead", params: params })
      .then(response => {
        this.setSuggestion(response.data, query);
      });
  }

  handleSuggestionClick(index, e) {
    const { onSuggestionClick } = this.props;
    const { currentSuggestions } = this.state;
    this.setSelectedSuggestion(index);
    if (typeof onSuggestionClick === "function") {
      onSuggestionClick(e, currentSuggestions[index]);
    }
  }

  setSelectedSuggestion(index) {
    const { currentSuggestions } = this.state;
    const { displayKey } = this.props;
    this.setState({
      value: currentSuggestions[index][displayKey],
      currentSuggestions: [],
      hint: "",
      selectedSuggestion: currentSuggestions[index],
      activeIndex: -1
    });
  }
  onSuggestionMounseHover(index, e) {
    const { currentSuggestions } = this.state;
    this.setState({ hint: this.getHint(currentSuggestions[index]) });
  }
  setSuggestion(suggestions, query) {
    let suggestionObj = {};
    suggestionObj[query] = suggestions;
    const updatedObj = Object.assign(this.state.suggestions, suggestionObj);
    this.setState({
      suggestions: updatedObj,
      currentSuggestions: suggestions,
      hint: suggestions.length ? this.getHint(suggestions[0]) : ""
    });
  }

  suggestionRender(suggestion) {
    const { displayKey } = this.props;
    return (
      <div className="dropdown-item">
        <span>{suggestion[displayKey]}</span>
      </div>
    );
  }

  handleKeyDown(event) {
    const key = event.key;
    const input = this.input;
    const { hint, currentSuggestions, activeIndex } = this.state;
    const { displayKey } = this.props;

    switch (key) {
      // case 'ArrowLeft':
      case "ArrowRight":
        if (
          hint &&
          hint !== "" &&
          !event.shiftKey &&
          this.isCursorAtEnd() &&
          currentSuggestions &&
          currentSuggestions.length
        ) {
          this.onInputChange(currentSuggestions[0][displayKey]);
          this.setState({activeIndex: 0})
        }
        break;
      case "Enter":
        if (activeIndex > -1 && activeIndex < currentSuggestions.length) {
            this.handleSuggestionClick(activeIndex, event)
        }
        break;
      case "Escape":
        break;
      case "ArrowUp":
      case "ArrowDown":
        if (currentSuggestions && currentSuggestions.length) {
          event.preventDefault();
          const dir = key === "ArrowUp" ? -1 : 1;
          const activeIndex = this.state.activeIndex + dir;
          if (activeIndex > -1 && activeIndex < currentSuggestions.length) {
            this.setState({
              activeIndex: activeIndex,
              value: currentSuggestions[activeIndex][displayKey],
              hint: ''
            });
          }
        }

        break;
    }
  }
  isCursorAtEnd() {
    const input = this.input;
    const valueLength = this.state.value.length;
    return (
      input.selectionStart === valueLength && input.selectionEnd === valueLength
    );
  }

  getHint(suggestion) {
    const { displayKey } = this.props;
    const value = this.state.value;
    const regex = new RegExp("^" + value, "i");
    if (value.length && regex.test(suggestion[displayKey])) {
      return suggestion[displayKey].replace(regex, value);
    }
    return "";
  }
  render() {
    const { suggestionRender, placeholder, identifierKey } = this.props;
    const { value, hint, currentSuggestions, activeIndex } = this.state;
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
            ref={ref => {
              this.input = ref;
            }}
            placeholder={placeholder}
            className="input-field"
            value={value}
            autoComplete="off"
            onChange={this.onChange}
            onKeyDown={this.handleKeyDown}
          />
        </div>
        <div
          className={`suggestions-wrap dropdown-menu ${currentSuggestions.length ? "show" : "hide"}`}
        >
          {currentSuggestions.map((suggestion, key) => {
            return (
              <div
                key={`${suggestion[identifierKey]}_${key}`}
                onClick={this.handleSuggestionClick.bind(this, key)}
                className={`${activeIndex === key ? "active" : ""}`}
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
