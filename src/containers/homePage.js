import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCarsSuggestion } from "../actions/homePage";
import TypeAhead from "../components/typeAhead";

const mapStateToProps = state => ({
    selectedSuggestion: state.homePage.selectedSuggestion
});
const mapDispatchToProps = dispatch => ({
  dispatch
});

require("../styles/containers/homePage.scss");

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.onSuggestionClick = this.onSuggestionClick.bind(this);
  }
  onSuggestionClick(e, suggestion) {
    this.props.dispatch({
      type: "SET_SELECTED_SUGGESTION",
      payload: suggestion
    });
  }
  render() {
      const {selectedSuggestion} = this.props
    return (
      <div className="home-page">
        <div className="search-box-wrap">
          <TypeAhead
            url="/fetchCarsSuggestions"
            displayKey="name"
            placeholder="Type you car name"
            onSuggestionClick={this.onSuggestionClick}
          />
          <div className="message-wrap">
            {selectedSuggestion && JSON.stringify(selectedSuggestion)}
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
