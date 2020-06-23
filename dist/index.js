'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./index.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const KEYCODE = {
  up: 38,
  down: 40,
  enter: 13
};

function Complete(props) {
  const { delay, limit, prop, field } = props;
  const [value, setValue] = (0, _react.useState)('');
  const [results, setResults] = (0, _react.useState)([]);
  const [activeIndex, setActiveIndex] = (0, _react.useState)(-1);
  const timeOut = (0, _react.useRef)(null);
  const isClicked = (0, _react.useRef)(false);

  const getObjProp = (0, _react.useCallback)((data, prop) => {
    const properties = prop.split('.');

    let active = data;
    properties.forEach(item => {
      if (active[item]) {
        active = active[item];
      } else {
        active = false;
      }
    });
    return active;
  }, []);

  const fetchData = (0, _react.useCallback)(async () => {
    let data = props.data;

    if (typeof data === 'function') {
      data = await data(value);
    }

    if (prop) {
      data = getObjProp(data, prop);
    }

    if (!Array.isArray(data)) {
      data = [];
    }

    let suggestions = [];
    let activeItem;
    data.forEach(item => {
      if (field) {
        activeItem = item[field];
      } else {
        activeItem = item;
      }

      if (activeItem.toLowerCase().includes(value.toLowerCase())) {
        suggestions.push(activeItem);
      }
    });
    suggestions = suggestions ? suggestions.slice(0, limit) : [];
    setResults(suggestions);
  }, [field, limit, value, prop, props.data]);

  const changeHandle = (0, _react.useCallback)(({ target }) => {
    setValue(target.value);
    isClicked.current = false;
  }, []);

  const changeIndex = (0, _react.useCallback)((index = -1) => {
    setActiveIndex(index);
  }, []);

  const changeValue = (0, _react.useCallback)(() => {
    const result = results[activeIndex];
    setValue(result);
    setActiveIndex(0);
    isClicked.current = true;
  }, [results, activeIndex]);

  const keyPressHandle = (0, _react.useCallback)(event => {
    const { keyCode } = event;

    if (keyCode === KEYCODE.up) {
      if (activeIndex > 0) {
        changeIndex(activeIndex - 1);
      } else {
        changeIndex(results.length - 1);
      }
    } else if (keyCode === KEYCODE.down) {
      if (activeIndex < results.length - 1) {
        changeIndex(activeIndex + 1);
      } else {
        changeIndex(0);
      }
    } else if (keyCode === KEYCODE.enter) {
      event.preventDefault();
      changeValue();
    }
  }, [activeIndex, changeIndex, results.length, changeValue]);

  (0, _react.useEffect)(() => {
    if (isClicked.current) return;

    if (timeOut.current) {
      clearTimeout(timeOut.current);
    }

    if (value.length > 0) {
      timeOut.current = setTimeout(fetchData, delay);
    }
  }, [value]);

  return _react2.default.createElement(
    'div',
    { className: 'autocomplete' },
    _react2.default.createElement('input', {
      className: 'autocomplete-input',
      placeholder: 'what are you search?',
      value: value,
      onChange: changeHandle,
      onKeyUp: keyPressHandle
    }),
    _react2.default.createElement(
      'div',
      { className: 'autocomplete-results' },
      !isClicked.current && results.length > 0 && results.map((result, index) => _react2.default.createElement('div', {
        key: index,
        onClick: () => changeValue(),
        onFocus: () => changeIndex(index),
        onBlur: () => changeIndex(-1),
        onMouseOver: () => changeIndex(index),
        onMouseLeave: () => changeIndex(-1),
        className: `autocomplete-result ${activeIndex === index && 'active'}`,
        dangerouslySetInnerHTML: { __html: result }
      }))
    )
  );
}

Complete.propTypes = {
  limit: _propTypes2.default.number,
  delay: _propTypes2.default.number,
  field: _propTypes2.default.string,
  prop: _propTypes2.default.string,
  data: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object, _propTypes2.default.func]).isRequired
};

Complete.defaultProps = {
  limit: 10,
  delay: 300
};

exports.default = Complete;