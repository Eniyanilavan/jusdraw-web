import React, { Component } from 'react';
import '../App.css';

class Tab extends Component {
  constructor(props)
  {
    super(props);
  }

  render() {
    return (
              <button className="Disp" title={this.props.title} onClick={this.props.onclick}>{this.props.button}</button>
    );
  }
}

export default Tab;
