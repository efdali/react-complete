import React from 'react';
import { render } from 'react-dom';
import Complete from '../../src/index';

const App = () => (
  <div className="container">
    <Complete
      data={(value) =>
        fetch(
          `https://rickandmortyapi.com/api/character/?name=${value}`
        ).then((res) => res.json())
      }
      prop="results"
      field="name"
      inputComp={
        <input type="text" placeholder="ara ulan" className="input-element" />
      }
      renderItem={({ item, raw }) => (
        <div className="item">
          <img src={item.image} alt={raw} className="item-image" />
          <h5 className="item-title">{raw}</h5>
        </div>
      )}
    />
  </div>
);

render(<App />, document.getElementById('app'));
