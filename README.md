# React-Complete

> simple customizable react autocomplete component

## Demo

[Codesandbox](https://codesandbox.io/s/react-complete-demo-165ef)

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

Custom Input Component

```javascript
<Complete
  inputComp={
    <input type="text" placeholder="search..." className="search-input" />
  }
/>
```

Custom Item Component

> Parameter is object that contain 'fetch' result(item) and searching array's field(raw)

```javascript
<Complete
  renderItem={({ item, raw }) => (
    <div className="item">
      <img src={item.img} />
      <span>{raw}</span>
    </div>
  )}
/>
```

## License

ISC
