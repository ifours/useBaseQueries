import createBrowserHistory from 'history/lib/createBrowserHistory';
import useQueries from 'history/lib/useQueries';
import { createQuery } from 'history/lib/LocationUtils'
import execSteps from './execSteps';
import useBaseQueries from '../';
import expect from 'expect';

const stripHash = (path) =>
  path.replace(/^#/, '')

describe('browser history', () => {
  const token = 'foo';
  const ts = '123456789';
  const baseQueries = { token, ts };

  let history, unlisten;

  beforeEach(() => {
    history = useBaseQueries(useQueries(createBrowserHistory))({
      baseQueries() { return baseQueries }
    });
    history.push({ pathname: '/foo' });
  });

  afterEach(function () {
    if (unlisten) unlisten();
  });

  describe('base queries should be', () => {
    it('in push', (done) => {
      const steps = [
        (location) => {
          expect(location.search).toEqual(`?token=${token}&ts=${ts}`);
          expect(location.query).toEqual(baseQueries);

          history.push({
            pathname: '/home',
            query: { the: 'query value' }
          });
        },
        (location) => {
          expect(location.search).toEqual(`?the=query+value&token=${token}&ts=${ts}`);
          expect(location.query).toEqual({ ...baseQueries, the: 'query value' });

          history.push({
            ...location,
            query: { other: 'query value' }
          });
        },
        (location) => {
          expect(location.search).toEqual(`?other=query+value&token=${token}&ts=${ts}`);
          expect(location.query).toEqual({ ...baseQueries, other: 'query value' });

          history.push({
            ...location,
            query: {}
          });
        },
        (location) => {
          expect(location.search).toEqual(`?token=${token}&ts=${ts}`);
          expect(location.query).toEqual(baseQueries);
        }
      ]

      execSteps(steps, history, done);
    });

    it('in replace', (done) => {
      const steps = [
        (location) => {
          expect(location.search).toEqual(`?token=${token}&ts=${ts}`);
          expect(location.query).toEqual(baseQueries);

          history.replace({
            pathname: '/home',
            query: { the: 'query value' }
          });
        },
        (location) => {
          expect(location.search).toEqual(`?the=query+value&token=${token}&ts=${ts}`);
          expect(location.query).toEqual({ ...baseQueries, the: 'query value' });

          history.replace({
            ...location,
            query: { other: 'query value' }
          });
        },
        (location) => {
          expect(location.search).toEqual(`?other=query+value&token=${token}&ts=${ts}`);
          expect(location.query).toEqual({ ...baseQueries, other: 'query value' });

          history.replace({
            ...location,
            query: {}
          });
        },
        (location) => {
          expect(location.search).toEqual(`?token=${token}&ts=${ts}`);
          expect(location.query).toEqual(baseQueries);
        }
      ]

      execSteps(steps, history, done);
    });

    describe('in createPath', () => {
      it('works', () => {
        expect(
          history.createPath({
            pathname: '/the/path'
          })
        ).toEqual(`/the/path?token=${token}&ts=${ts}`);
      });

      it('with passed queries', () => {
        expect(
          history.createPath({
            pathname: '/the/path/',
            query: { the: 'query value' }
          })
        ).toEqual(`/the/path/?the=query+value&token=${token}&ts=${ts}`);
      });

      describe('when the path contains a hash', () => {
        it('puts the query before the hash', () => {
          expect(
            history.createPath({
              pathname: '/the/path',
              hash: '#the-hash',
            })
          ).toEqual(`/the/path?token=${token}&ts=${ts}#the-hash`);
        });
      });
    });

    describe('in createHref', () => {
      it('works', () => {
        expect(
          stripHash(history.createHref({
            pathname: '/the/path',
            query: { the: 'query value' }
          }))
        ).toEqual(`/the/path?the=query+value&token=${token}&ts=${ts}`);
      });
    });

    describe('in createLocation', () => {
      it.skip('works with string and does not add search to query', () => {
        const location = history.createLocation('/the/path?the=query');

        expect(location.query).toEqual(createQuery(baseQueries));
        expect(location.search).toEqual(`?the=query&token=${token}&ts=${ts}`);
      });

      it('works with object with query', () => {
        const location = history.createLocation({
          pathname: '/the/path',
          query: { the: 'query' }
        });

        expect(location.query).toEqual(createQuery({ ...baseQueries, the: 'query' }));
        expect(location.search).toEqual(`?the=query&token=${token}&ts=${ts}`);
      });

      it('works with object without query', () => {
        const location = history.createLocation({
          pathname: '/the/path'
        });

        expect(location.query).toEqual(createQuery(baseQueries));
        expect(location.search).toEqual(`?token=${token}&ts=${ts}`);
      });
    });

  });
});
