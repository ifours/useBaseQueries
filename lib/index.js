'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _PathUtils = require('history/lib/PathUtils');

/**
 * Returns a new createHistory function that may be used to create
 * history objects that will keep base queries on write operations
 */
function useBaseQueries(createHistory) {
  return function () {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var history = createHistory(options);

    var baseQueries = options.baseQueries;


    function addBaseQuery(location, query) {
      if (typeof location === 'string') {
        location = (0, _PathUtils.parsePath)(location);
      }

      return _extends({}, location, {
        query: _extends({}, baseQueries(), query || location.query || {})
      });
    }

    // Override all write methods with query-aware versions.
    function push(location) {
      history.push(addBaseQuery(location));
    }

    function replace(location) {
      history.replace(addBaseQuery(location));
    }

    function createPath(location, query) {
      return history.createPath(addBaseQuery(location, query));
    }

    function createHref(location, query) {
      return history.createHref(addBaseQuery(location, query));
    }

    function createLocation(location) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return history.createLocation.apply(history, [addBaseQuery(location)].concat(args));
    }

    return _extends({}, history, {
      push: push,
      replace: replace,
      createPath: createPath,
      createHref: createHref,
      createLocation: createLocation
    });
  };
}

exports.default = useBaseQueries;