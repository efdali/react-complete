# React-Complete

> simple customizable react autocomplete component

## Install

```bash
npm install react-complete --save
```

## Usage

```javascript
import Complete from 'react-complete';
```

```javascript
<Complete data={data} prop={prop} field={field} />
```

Data

```javascript
const data = ['react', 'vue', 'angular'];

const data = (value) => fetch('...').then((res) => res.json());
```

```javascript
const data = {
  languages: {
    name: 'javascript',
    frameworks: [
      {
        name: 'react',
      },
      {
        name: 'vue',
      },
      {
        name: 'angular',
      },
    ],
  },
};
```

```javascript
<Complete data={data} prop="languages.frameworks" field="name" />
```

## License

ISC
