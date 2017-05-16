import { parsePath } from 'history/lib/PathUtils';
import { stringifyQuery } from 'history/lib/LocationUtils';

/**
 * Returns a new createHistory function that may be used to create
 * history objects that will keep base queries on write operations
 */
function useBaseQueries(createHistory) {
  return (options = {}) => {
    const history = createHistory(options);

    const { baseQueries } = options;

    // TODO: add support for a path string for all situations
    function addBaseQuery(location, query) {
      if (typeof location === 'string') {
        location = parsePath(location);
      }

      return {
        ...location,

        query: {
          ...baseQueries(),
          ...(query || location.query || {})
        }
      };
    }

    // Override all read methods with query-aware versions.
    function getCurrentLocation() {
      return addBaseQuery(history.getCurrentLocation());
    }

    function listenBefore(hook) {
      return history.listenBefore(
        (location, callback) =>
          runTransitionHook(hook, addBaseQuery(location), callback)
      )
    }

    function listen(listener) {
      return history.listen(location => listener(addBaseQuery(location)));
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

    function createLocation(location, ...args) {
      const newLocation = history.createLocation(addBaseQuery(location), ...args);

      return newLocation;
    }

    return {
      ...history,
      getCurrentLocation,
      listenBefore,
      listen,
      push,
      replace,
      createPath,
      createHref,
      createLocation
    };
  };
}

export default useBaseQueries;
