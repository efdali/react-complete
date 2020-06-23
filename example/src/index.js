import React from 'react';
import { render } from 'react-dom';
import Complete from '../../src/index';

const App = () => (
  <div>
    <Complete
      data={(value) =>
        fetch(
          `https://rickandmortyapi.com/api/character/?name=${value}`
        ).then((res) => res.json())
      }
      prop="results"
      field="name"
    />
  </div>
);

render(<App />, document.getElementById('app'));
