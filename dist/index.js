'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

require('./index.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var KEYCODE = {
  up: 38,
  down: 40,
  enter: 13
};

function AutoComplete(props) {
  var _this = this;

  var delay = props.delay,
      limit = props.limit,
      prop = props.prop,
      field = props.field;

  var _useState = (0, _react.useState)(''),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      results = _useState4[0],
      setResults = _useState4[1];

  var _useState5 = (0, _react.useState)(-1),
      _useState6 = _slicedToArray(_useState5, 2),
      activeIndex = _useState6[0],
      setActiveIndex = _useState6[1];

  var timeOut = (0, _react.useRef)(null);
  var isClicked = (0, _react.useRef)(false);

  var getObjProp = (0, _react.useCallback)(function (data, prop) {
    var properties = prop.split('.');

    var active = data;
    properties.forEach(function (item) {
      if (active[item]) {
        active = active[item];
      } else {
        active = false;
      }
    });
    return active;
  }, []);

  var fetchData = (0, _react.useCallback)(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var data, suggestions, activeItem;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = props.data;

            if (!(typeof data === 'function')) {
              _context.next = 5;
              break;
            }

            _context.next = 4;
            return data(value);

          case 4:
            data = _context.sent;

          case 5:

            if (prop) {
              data = getObjProp(data, prop);
            }

            if (!Array.isArray(data)) {
              data = [];
            }

            suggestions = [];
            activeItem = void 0;

            data.forEach(function (item) {
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

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  })), [field, limit, value, prop, props.data]);

  var changeHandle = (0, _react.useCallback)(function (_ref2) {
    var target = _ref2.target;

    setValue(target.value);
    isClicked.current = false;
  }, []);

  var changeIndex = (0, _react.useCallback)(function () {
    var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;

    setActiveIndex(index);
  }, []);

  var changeValue = (0, _react.useCallback)(function () {
    var result = results[activeIndex];
    setValue(result);
    setActiveIndex(0);
    // setResults([]);
    isClicked.current = true;
  }, [results, activeIndex]);

  var keyPressHandle = (0, _react.useCallback)(function (event) {
    var keyCode = event.keyCode;


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

  (0, _react.useEffect)(function () {
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
      placeholder: '...',
      value: value,
      onChange: changeHandle,
      onKeyUp: keyPressHandle
    }),
    _react2.default.createElement(
      'div',
      { className: 'autocomplete-results' },
      !isClicked.current && results.length > 0 && results.map(function (result, index) {
        return _react2.default.createElement('div', {
          key: index,
          onClick: function onClick() {
            return changeValue();
          },
          onFocus: function onFocus() {
            return changeIndex(index);
          },
          onBlur: function onBlur() {
            return changeIndex(-1);
          },
          onMouseOver: function onMouseOver() {
            return changeIndex(index);
          },
          onMouseLeave: function onMouseLeave() {
            return changeIndex(-1);
          },
          className: 'autocomplete-result ' + (activeIndex === index && 'active'),
          dangerouslySetInnerHTML: { __html: result }
        });
      })
    )
  );
}

AutoComplete.propTypes = {
  limit: _propTypes2.default.number,
  delay: _propTypes2.default.number,
  field: _propTypes2.default.string,
  prop: _propTypes2.default.string,
  data: _propTypes2.default.oneOfType([_propTypes2.default.array, _propTypes2.default.object, _propTypes2.default.func]).isRequired
};

AutoComplete.defaultProps = {
  limit: 10,
  delay: 300
};

exports.default = AutoComplete;