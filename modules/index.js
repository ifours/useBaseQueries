import { parsePath } from 'history/lib/PathUtils';

/**
 * Returns a new createHistory function that may be used to create
 * history objects that will keep base queries on write operations
 */
function useBaseQueries(createHistory) {
  return (options = {}) => {
    const history = createHistory(options);

    const { baseQueries } = options;

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
      return history.createLocation(addBaseQuery(location), ...args);
    }

    return {
      ...history,
      push,
      replace,
      createPath,
      createHref,
      createLocation
    };
  };
}

export default useBaseQueries;
