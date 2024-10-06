import React, { Component } from 'react';

class Learning extends Component {
  state = {
    fruits: [
      { name: 'mango', weight: '100gm' },
      { name: 'banana', weight: '1000gm' },
      { name: 'apple', weight: '10000gm' },
    ]
  };

  render() {
    return <h1>Fruit name is {this.state.fruits[0].name}</h1>;
  }
}

export default Learning;
