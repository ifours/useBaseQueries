# Base Queries

Support for added base queries to each path is provided by the `useBaseQueries` [enhancer](https://github.com/ReactTraining/history/blob/master/docs/Glossary.md#createhistoryenhancer) function. Simply use a wrapped version of your `useQueries` function to create your `history` object and you'll have base queries in all paths.

```js
import { createHistory, useQueries } from 'history';
import useBaseQueries from 'use-base-queries';

const history = useBaseQueries(useQueries(createHistory))({
  baseQueries() { return { token: '2323423'  } };
});

history.listen(function (location) {
  console.log(location.query);
});
```

