import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCarsSuggestion } from "../actions/homePage";
import TypeAhead from "../components/typeAhead";

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  dispatch
});

require("../styles/containers/homePage.scss");

class HomePage extends Component {
  suggestionRender(suggestion) {
    return (
      <a className="dropdown-item" href="#">
        <span>{suggestion.name}</span>
      </a>
    );
  }
  // <TypeAhead url="/fetchCarsSuggestions" suggestionRender={this.suggestionRender} />
  render() {
    return (
      <div className="home-page">
        <div className="search-box-wrap">
          <TypeAhead
            url="/fetchCarsSuggestions"
            displayKey="name"
            placeholder="Search by brand"
          />
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
