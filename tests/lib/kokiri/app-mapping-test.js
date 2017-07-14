/* eslint-disable object-shorthand */

const assert = require('assert');

const {
  mapWebToAppDestination,
  isSupportedAppDestination,
  matchHomepage,
  matchPathname,
  matchAnchor,
  matchIOS,
  matchAndroid,
  matchQuery,
  composeMatches,
} = require('../../../lib/kokiri/app-mapping');

describe('lib/kokiri/app-mapping', function() {
  beforeEach(function() {
    this.knownMappings = [
      {
        match: destination => {
          return destination.pathname === '/bloop' ? { bloop: true } : null;
        },
        destination: {
          pathname: '/AppBloop',
          query: match => match,
        },
      },
      {
        match: destination => {
          return destination.query.bloop === '1989' ? { bloop: 1989 } : false;
        },
        destination: {
          pathname: match => `/bloop/${match.bloop}`,
        },
      },
      {
        match: (destination, platform) => platform === 'android',
        destination: {
          pathname: '/android',
        },
      },
    ];
  });

  describe('#mapWebToAppDestination', function() {
    it('maps a web destination to an app destination', function() {
      const appDestination = mapWebToAppDestination(
        {},
        this.knownMappings,
        { pathname: '/bloop', query: { a: 1 } },
        'ios'
      );

      assert.deepEqual(appDestination, {
        pathname: '/AppBloop',
        query: { bloop: true },
      });
    });

    it('checks every potential match candidate', function() {
      const appDestination = mapWebToAppDestination(
        {},
        this.knownMappings,
        { pathname: '', query: { bloop: '1989' } },
        'ios'
      );

      assert.deepEqual(appDestination, {
        pathname: '/bloop/1989',
        query: { bloop: '1989' },
      });
    });

    it('is the identity with no mappings', function() {
      const appDestination = mapWebToAppDestination(
        {},
        null,
        { pathname: '/bloop', query: { a: 1 } },
        'ios'
      );

      assert.deepEqual(appDestination, { pathname: '/bloop', query: { a: 1 } });
    });

    it('returns null for an unknown app destination', function() {
      const appDestination = mapWebToAppDestination(
        {},
        this.knownMappings,
        { pathname: '/bleep', query: { a: 1 } },
        'ios'
      );

      assert.deepEqual(appDestination, null);
    });

    it('allows matching by platform', function() {
      const appDestination = mapWebToAppDestination(
        {},
        this.knownMappings,
        { pathname: '/blark', query: { a: 1 } },
        'android'
      );

      assert.deepEqual(appDestination, {
        pathname: '/android',
        query: { a: 1 },
      });
    });

    it('allows match to be any value', function() {
      const appDestination = mapWebToAppDestination(
        {},
        this.knownMappings.concat({
          match: { thing: 1 },
          destination: { query: match => match },
        }),
        { pathname: '/nope', query: {} },
        'ios'
      );

      assert.deepEqual(appDestination, {
        pathname: '/nope',
        query: { thing: 1 },
      });
    });

    it('matches and passes the old destination if not defined', function() {
      const appDestination = mapWebToAppDestination(
        {},
        this.knownMappings.concat({
          match: { thing: 1 },
        }),
        { pathname: '/nope', query: {} },
        'ios'
      );

      assert.deepEqual(appDestination, { pathname: '/nope', query: {} });
    });

    it('uses destination values directly if not functions', function() {
      const appDestination = mapWebToAppDestination(
        {},
        this.knownMappings.concat({
          match: { thing: 1 },
          destination: { pathname: '/1', query: { pavel: true } },
        }),
        { pathname: '/nope', query: {} },
        'ios'
      );

      assert.deepEqual(appDestination, {
        pathname: '/1',
        query: { pavel: true },
      });
    });

    it('forwards the context to match and destination functions', function() {
      const appDestination = mapWebToAppDestination(
        { pavel: true },
        this.knownMappings.concat({
          match: function() {
            return this.pavel === true;
          },
          destination: {
            query: function() {
              return this;
            },
          },
        }),
        { pathname: '/blark', query: { a: 1 } },
        'ios'
      );

      assert.deepEqual(appDestination, {
        pathname: '/blark',
        query: { pavel: true },
      });
    });
  });

  describe('#isSupportedAppDestination', function() {
    it('is true with a valid web destination to an app destination', function() {
      const isSupported = isSupportedAppDestination(
        {},
        this.knownMappings,
        { pathname: '/bloop', query: { a: 1 } },
        'ios'
      );

      assert(isSupported);
    });

    it('is true while checking every potential match candidate', function() {
      const isSupported = isSupportedAppDestination(
        {},
        this.knownMappings,
        { pathname: '', query: { bloop: '1989' } },
        'ios'
      );

      assert(isSupported);
    });

    it('is false with no mappings', function() {
      const isSupported = isSupportedAppDestination(
        {},
        null,
        { pathname: '/bloop', query: { a: 1 } },
        'ios'
      );

      assert(!isSupported);
    });

    it('is false for an unknown app destination', function() {
      const isSupported = isSupportedAppDestination(
        {},
        this.knownMappings,
        { pathname: '/bleep', query: { a: 1 } },
        'ios'
      );

      assert(!isSupported);
    });

    it('is true while matching by platform', function() {
      const isSupported = isSupportedAppDestination(
        {},
        this.knownMappings,
        { pathname: '/blark', query: { a: 1 } },
        'android'
      );

      assert(isSupported);
    });

    it('is true when match is any truthy value', function() {
      const isSupported = isSupportedAppDestination(
        {},
        this.knownMappings.concat({
          match: { thing: 1 },
          destination: { query: match => match },
        }),
        { pathname: '/nope', query: {} },
        'ios'
      );

      assert(isSupported);
    });

    it('can be true if destination if not defined', function() {
      const isSupported = isSupportedAppDestination(
        {},
        this.knownMappings.concat({
          match: { thing: 1 },
        }),
        { pathname: '/nope', query: {} },
        'ios'
      );

      assert(isSupported);
    });

    it('can be true with destination values', function() {
      const isSupported = isSupportedAppDestination(
        {},
        this.knownMappings.concat({
          match: { thing: 1 },
          destination: { pathname: '/1', query: { pavel: true } },
        }),
        { pathname: '/nope', query: {} },
        'ios'
      );

      assert(isSupported);
    });

    it('forwards the context to the match function', function() {
      let isSupported = isSupportedAppDestination(
        { pavel: true },
        this.knownMappings.concat({
          match: function() {
            return this.pavel === true;
          },
        }),
        { pathname: '/nope', query: {} },
        'ios'
      );

      assert(isSupported);

      isSupported = isSupportedAppDestination(
        { pavel: true },
        this.knownMappings.concat({
          match: function() {
            return this.pavel !== true;
          },
        }),
        { pathname: '/nope', query: {} },
        'ios'
      );

      assert(!isSupported);
    });
  });

  describe('#matchHomepage', function() {
    it('matches only the homepage', function() {
      assert.deepEqual(matchHomepage({ pathname: '' }), true);
      assert.deepEqual(matchHomepage({ pathname: undefined }), true);
      assert.deepEqual(matchHomepage({ pathname: null }), true);
      assert.deepEqual(matchHomepage({ pathname: '/' }), true);
      assert.deepEqual(matchHomepage({ pathname: '//' }), true);
      assert.deepEqual(matchHomepage({ pathname: '/1' }), false);
      assert.deepEqual(matchHomepage({ pathname: '1' }), false);
    });
  });

  describe('#matchPathname', function() {
    it('returns a match object with a match', function() {
      const matcher = matchPathname(/(\d)-(\d)-(\d)/, ['one', 'two', 'three']);

      assert.deepEqual(matcher({ pathname: '1-2-3' }), {
        one: '1',
        two: '2',
        three: '3',
      });
    });

    it('returns null with no match', function() {
      const matcher = matchPathname(/(\d)-(\d)-(\d)/, ['one', 'two', 'three']);

      assert.deepEqual(matcher({ pathname: '?pavel?' }), null);
    });
  });

  describe('#matchAnchor', function() {
    it('returns a match object with a match', function() {
      const matcher = matchAnchor(/(\d)-(\d)-(\d)/, ['one', 'two', 'three']);

      assert.deepEqual(matcher({ anchor: '1-2-3' }), {
        one: '1',
        two: '2',
        three: '3',
      });
    });

    it('returns null with no match', function() {
      const matcher = matchAnchor(/(\d)-(\d)-(\d)/, ['one', 'two', 'three']);

      assert.deepEqual(matcher({ anchor: '?pavel?' }), null);
    });
  });

  describe('#matchIOS', function() {
    it('returns an object with a match', function() {
      assert.deepEqual(matchIOS({}, 'ios'), {});
    });

    it('returns null with no match', function() {
      assert.deepEqual(matchIOS({}, 'pavel'), null);
    });
  });

  describe('#matchAndroid', function() {
    it('returns an object with a match', function() {
      assert.deepEqual(matchAndroid({}, 'android'), {});
    });

    it('returns null with no match', function() {
      assert.deepEqual(matchAndroid({}, 'pavel'), null);
    });
  });

  describe('#matchQuery', function() {
    it('matches a query', function() {
      assert.deepEqual(matchQuery({ bloop: /.*/ })({}), null);
      assert.deepEqual(
        matchQuery({ bloop: /.*/ })({ query: { a: '2' } }),
        false
      );
      assert.deepEqual(
        matchQuery({ bloop: /.*/ })({ query: { bloop: '2' } }),
        true
      );
      assert.deepEqual(
        matchQuery({ bloop: /.*/ })({ query: { bloop: '' } }),
        true
      );
    });

    it('must match all query params', function() {
      assert.deepEqual(matchQuery({ bloop: /.*/, bleep: /\d{2}/ })({}), null);
      assert.deepEqual(
        matchQuery({ bloop: /.*/, bleep: /\d{2}/ })({ query: { a: '2' } }),
        false
      );
      assert.deepEqual(
        matchQuery({ bloop: /.*/, bleep: /\d{2}/ })({
          query: { bloop: '2', bleep: '2' },
        }),
        false
      );
      assert.deepEqual(
        matchQuery({ bloop: /.*/, bleep: /\d{2}/ })({
          query: { bloop: '', bleep: '22' },
        }),
        true
      );
    });
  });

  describe('#composeMatches', function() {
    it('allows composing matches together', function() {
      const pathname = matchPathname(/(\d)-(\d)-(\d)/, ['one', 'two', 'three']);
      const platform = matchIOS;

      assert.deepEqual(
        composeMatches(pathname, platform)({ pathname: '1-2-3' }, 'ios'),
        { one: '1', two: '2', three: '3' }
      );
    });

    it(`returns null if any don't match`, function() {
      const pathname = matchPathname(/(\d)-(\d)-(\d)/, ['one', 'two', 'three']);
      const platform = matchIOS;

      assert.deepEqual(
        composeMatches(pathname, platform)({ pathname: '1-2-3' }, 'pavel'),
        null
      );

      assert.deepEqual(
        composeMatches(pathname, platform)({ pathname: '?pavel?' }, 'ios'),
        null
      );
    });

    it('merges all match objects', function() {
      const pathname1 = matchPathname(/(\d)-(\d)-(\d)/, [
        'one',
        'two',
        'three',
      ]);
      const pathname2 = matchPathname(/(\d)-(\d)-(\d)/, ['uno', 'dos', 'tres']);

      assert.deepEqual(
        composeMatches(pathname1, pathname2)({ pathname: '1-2-3' }, 'ios'),
        {
          one: '1',
          two: '2',
          three: '3',
          uno: '1',
          dos: '2',
          tres: '3',
        }
      );
    });
  });
});
