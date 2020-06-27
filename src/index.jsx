import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import './index.css';

const KEYCODE = {
  up: 38,
  down: 40,
  enter: 13,
};

function SearchInput({ input, value, onChange, onKeyUp, ...props }) {
  if (input && React.isValidElement(input)) {
    return React.cloneElement(input, {
      value: value,
      onChange: onChange,
      onKeyUp: onKeyUp,
      ...props,
    });
  }

  return (
    <input
      className="autocomplete-input"
      placeholder="what are you search?"
      value={value}
      onChange={onChange}
      onKeyUp={onKeyUp}
      {...props}
    />
  );
}

function Complete(props) {
  const { delay, limit, prop, field, inputComp, renderItem } = props;
  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const timeOut = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getObjProp = useCallback((data, prop) => {
    const properties = prop.split('.');

    let active = data;
    properties.forEach((item) => {
      if (active[item]) {
        active = active[item];
      } else {
        active = false;
      }
    });
    return active;
  }, []);

  const fetchData = useCallback(async () => {
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
    data.forEach((item) => {
      if (field) {
        activeItem = item[field];
      } else {
        activeItem = item;
      }

      if (activeItem.toLowerCase().includes(value.toLowerCase())) {
        suggestions.push(
          field ? { item, raw: activeItem } : { raw: activeItem }
        );
      }
    });
    suggestions = suggestions ? suggestions.slice(0, limit) : [];
    setResults(suggestions);
  }, [field, limit, value, prop, props.data]);

  const changeHandle = useCallback(({ target }) => {
    setValue(target.value);
    setShowSuggestions(true);
  }, []);

  const changeIndex = useCallback((index = -1) => {
    setActiveIndex(index);
  }, []);

  const changeValue = useCallback(() => {
    const result = results[activeIndex].raw;
    setValue(result);
    setActiveIndex(0);
    setShowSuggestions(false);
  }, [results, activeIndex]);

  const keyPressHandle = useCallback(
    (event) => {
      const { keyCode } = event;

      if (keyCode === KEYCODE.up) {
        if (activeIndex > 0) {
          setActiveIndex(activeIndex - 1);
        } else {
          setActiveIndex(results.length - 1);
        }
      } else if (keyCode === KEYCODE.down) {
        if (activeIndex < results.length - 1) {
          setActiveIndex(activeIndex + 1);
        } else {
          setActiveIndex(0);
        }
      } else if (keyCode === KEYCODE.enter) {
        event.preventDefault();
        changeValue();
      }
    },
    [activeIndex, results.length, changeValue]
  );

  useEffect(() => {
    if (!showSuggestions) return;

    if (timeOut.current) {
      clearTimeout(timeOut.current);
    }

    if (value.length > 0) {
      timeOut.current = setTimeout(fetchData, delay);
    }
  }, [value]);

  return (
    <React.Fragment>
      {showSuggestions && (
        <div
          className="overlay"
          onClick={() => {
            setShowSuggestions(false);
          }}
        ></div>
      )}
      <div className="autocomplete">
        <SearchInput
          input={inputComp}
          value={value}
          onChange={changeHandle}
          onKeyUp={keyPressHandle}
          onFocus={() => setShowSuggestions(true)}
        />
        <div className="autocomplete-results">
          {showSuggestions &&
            results.length > 0 &&
            results.map((result, index) => (
              <div
                key={index}
                onClick={() => changeValue()}
                onFocus={() => changeIndex(index)}
                onBlur={() => changeIndex(-1)}
                onMouseOver={() => changeIndex(index)}
                onMouseLeave={() => changeIndex(-1)}
                className={`autocomplete-result ${
                  activeIndex === index && 'active'
                }`}
              >
                {renderItem ? (
                  renderItem(result)
                ) : (
                  <span className="result-text">{result.raw}</span>
                )}
              </div>
            ))}
        </div>
      </div>
    </React.Fragment>
  );
}

Complete.propTypes = {
  limit: PropTypes.number,
  delay: PropTypes.number,
  field: PropTypes.string,
  prop: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.func])
    .isRequired,
};

Complete.defaultProps = {
  limit: 10,
  delay: 300,
};

export default Complete;
