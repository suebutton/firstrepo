const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const GRUBHUB_ORG_ID = 'org-1cd5b143f9e24cba';
const SHOPKICK_ORG_ID = 'org-030575eddb72b4df';

describe('lib/kokiri/builders/grubhub', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: GRUBHUB_ORG_ID,
      },
      {
        status: 'approved',
        audience: SHOPKICK_ORG_ID,
        organization: GRUBHUB_ORG_ID,
      },
    ];

    const partnerParameters = [
      {
        id: '12345',
        organization: GRUBHUB_ORG_ID,
        default_value: '1166',
        name: 'publisherid',
      },
    ];

    const partnerValues = [
      {
        partner_parameter: '12345',
        organization: SHOPKICK_ORG_ID,
        value: '1041',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], {
      approvals,
      partnerParameters,
      partnerValues,
    });

    this.builder = this.config.createBuilder('org-XXX', GRUBHUB_ORG_ID);
  });

  describe('#appAction', function() {
    it('returns an app action', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.grubhub.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'grubhubapp://account/favorites?utm_medium=affiliate&utm_source=button-affiliate-network&utm_campaign=1166&affiliate=1166&affiliate_data=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://grubhub.com?utm_medium=affiliate&utm_source=button-affiliate-network&utm_campaign=1166&affiliate=1166&affiliate_data=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for android', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://www.grubhub.com',
          'android',
          'srctok-XXX'
        ),
        {
          app_link:
            'grubhubapp://account/favorites/?utm_medium=affiliate&utm_source=button-affiliate-network&utm_campaign=1166&affiliate=1166&affiliate_data=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://grubhub.com?utm_medium=affiliate&utm_source=button-affiliate-network&utm_campaign=1166&affiliate=1166&affiliate_data=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action for a non-supported app path', function() {
      assert.deepEqual(
        this.builder.appActionFromUrl(
          'https://grubhub.com/bloop',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://grubhub.com/bloop?utm_medium=affiliate&utm_source=button-affiliate-network&utm_campaign=1166&affiliate=1166&affiliate_data=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns an app action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(
        SHOPKICK_ORG_ID,
        GRUBHUB_ORG_ID
      );
      assert.deepEqual(
        builder.appActionFromUrl(
          'https://www.grubhub.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'grubhubapp://account/favorites?utm_medium=affiliate&utm_source=button-affiliate-network&utm_campaign=1041&affiliate=1041&affiliate_data=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://grubhub.com?utm_medium=affiliate&utm_source=button-affiliate-network&utm_campaign=1041&affiliate=1041&affiliate_data=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://www.grubhub.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://grubhub.bttn.io/search?utm_medium=affiliate&utm_source=button-affiliate-network&utm_campaign=1166&affiliate=1166&affiliate_data=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://grubhub.com?utm_medium=affiliate&utm_source=button-affiliate-network&utm_campaign=1166&affiliate=1166&affiliate_data=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination', function() {
      assert.deepEqual(
        this.builder.webActionFromUrl(
          'https://www.grubhub.com/bloop?a=2',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://grubhub.com/bloop?a=2&utm_medium=affiliate&utm_source=button-affiliate-network&utm_campaign=1166&affiliate=1166&affiliate_data=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with per-publisher tokens', function() {
      const builder = this.config.createBuilder(
        SHOPKICK_ORG_ID,
        GRUBHUB_ORG_ID
      );
      assert.deepEqual(
        builder.webActionFromUrl(
          'https://www.grubhub.com',
          'ios',
          'srctok-XXX'
        ),
        {
          app_link:
            'https://grubhub.bttn.io/search?utm_medium=affiliate&utm_source=button-affiliate-network&utm_campaign=1041&affiliate=1041&affiliate_data=srctok-XXX&btn_ref=srctok-XXX',
          browser_link:
            'https://grubhub.com?utm_medium=affiliate&utm_source=button-affiliate-network&utm_campaign=1041&affiliate=1041&affiliate_data=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });
});
