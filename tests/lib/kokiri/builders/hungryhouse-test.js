const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/hungryhouse', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-714d6d52c2e268ac',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-714d6d52c2e268ac');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'hungryhouse://hungryhouse.co.uk?btn_ref=srctok-XXX',
        browser_link: 'https://www.hungryhouse.co.uk?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for restaurant', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/italian-pizza',
            query: {},
            hash: '#menu',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'hungryhouse://hungryhouse.co.uk/italian-pizza?btn_ref=srctok-XXX#menu',
          browser_link:
            'https://www.hungryhouse.co.uk/italian-pizza?btn_ref=srctok-XXX#menu',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link:
          'https://hungryhouse.bttn.io?btn_fallback_exp=web&btn_ref=srctok-XXX',
        browser_link: 'https://www.hungryhouse.co.uk?btn_ref=srctok-XXX',
      });
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webAction(
          { pathname: '/bloop', query: { a: 2 } },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://hungryhouse.bttn.io/bloop?a=2&btn_fallback_exp=web&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hungryhouse.co.uk/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination for android', function() {
      assert.deepEqual(
        this.builder.webAction(
          { pathname: '/bloop', query: { a: 2 } },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: 'https://hungryhouse.bttn.io/bloop?a=2&btn_ref=srctok-XXX',
          browser_link:
            'https://www.hungryhouse.co.uk/bloop?a=2&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
