const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/1800flowers', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-78f56ab485a9d61e',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder('org-XXX', 'org-78f56ab485a9d61e');
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(this.builder.appAction({}, 'ios', 'srctok-XXX'), {
        app_link: 'bestsellingflowers://?btn_ref=srctok-XXX',
        browser_link: 'https://m.www.1800flowers.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for android', function() {
      assert.deepEqual(this.builder.appAction({}, 'android', 'srctok-XXX'), {
        app_link: 'flowersbutton://?btn_ref=srctok-XXX',
        browser_link: 'https://m.www.1800flowers.com?btn_ref=srctok-XXX',
      });
    });

    it('returns an app action for christmasflowers page', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.1800flowers.com/christmasflowers',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://m.www.1800flowers.com/christmasflowers?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a product app action with destination', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            pathname: '/mothers-day-best-sellers',
            query: null,
            hash: null,
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: 'https://m.www.1800flowers.com?btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(this.builder.webAction({}, 'ios', 'srctok-XXX'), {
        app_link: null,
        browser_link: 'https://m.www.1800flowers.com?btn_ref=srctok-XXX',
      });
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webAction(
          { pathname: '/mothers-day-best-sellers', query: null },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: 'https://m.www.1800flowers.com?btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action for christmasflowers page', function() {
      assert.deepEqual(
        this.builder.webAction(
          { pathname: '/christmasflowers', query: null },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://m.www.1800flowers.com/christmasflowers?btn_ref=srctok-XXX',
        }
      );
    });
  });
});
