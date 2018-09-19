const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

const TARGET_ORG_ID = 'org-24621b367f4280bc';
const KOHLS_ORG_ID = 'org-2ef55bcceba936bf';
const MVMT_ORG_ID = 'org-22e0c0464157d00d';
const BACKCOUNTRY_ORG_ID = 'org-3bec3b5c0cac44ad';
const HOUZZ_ORG_ID = 'org-03418dec42db44bc';
const HOTWIRE_ORG_ID = 'org-7829938c0c640b81';

const IBOTTA_ORG_ID = 'org-2d432a88b9bb8bda';
const SAMSUNG_ORG_ID = 'org-4738195f8e741d19';
const SPENT_ORG_ID = 'org-7537ad90e42d2ec0';

describe('lib/kokiri/builders/impact-radius', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: TARGET_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: KOHLS_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: MVMT_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: BACKCOUNTRY_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: HOUZZ_ORG_ID,
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: HOTWIRE_ORG_ID,
      },
      {
        status: 'approved',
        audience: IBOTTA_ORG_ID,
        organization: BACKCOUNTRY_ORG_ID,
      },
      {
        status: 'approved',
        audience: SAMSUNG_ORG_ID,
        organization: BACKCOUNTRY_ORG_ID,
      },
      {
        status: 'approved',
        audience: SPENT_ORG_ID,
        organization: TARGET_ORG_ID,
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });
  });

  describe('#appAction', function() {
    it('returns an app action for each merchant', function() {
      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', TARGET_ORG_ID)
          .appAction({ url: 'https://www.target.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://goto.target.com/c/415484/81938/2092?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.target.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', KOHLS_ORG_ID)
          .appAction({ url: 'https://www.kohls.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://kohls.sjv.io/c/415484/362118/5349?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.kohls.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', MVMT_ORG_ID)
          .appAction({ url: 'https://www.mvmt.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://mvmt.7eer.net/c/415484/222268/3856?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.mvmt.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', BACKCOUNTRY_ORG_ID)
          .appAction(
            { url: 'https://www.backcountry.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'http://backcountry.pxf.io/c/415484/358742/5311?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.backcountry.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', HOUZZ_ORG_ID)
          .appAction({ url: 'https://www.houzz.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://hpn.houzz.com/c/415484/372747/5454?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.houzz.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', HOTWIRE_ORG_ID)
          .appAction({ url: 'https://www.hotwire.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://partners.hotwire.com/c/415484/205226/3435?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.hotwire.com&btn_tkn=srctok-XXX',
        }
      );
    });

    it('returns an app action for specific publishers', function() {
      assert.deepEqual(
        this.config
          .createBuilder(SPENT_ORG_ID, TARGET_ORG_ID)
          .appAction({ url: 'https://www.target.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://goto.target.com/c/381635/81938/2092?subId1=srctok-XXX&subId2=org-7537ad90e42d2ec0&sharedid=org-7537ad90e42d2ec0&u=https%3A%2F%2Fwww.target.com&btn_tkn=srctok-XXX',
        }
      );
      assert.deepEqual(
        this.config
          .createBuilder(SAMSUNG_ORG_ID, BACKCOUNTRY_ORG_ID)
          .appAction(
            { url: 'https://www.backcountry.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'http://backcountry.pxf.io/c/415484/358742/5311?subId1=srctok-XXX&subId2=org-4738195f8e741d19&sharedid=org-4738195f8e741d19&u=https%3A%2F%2Fwww.backcountry.com&btn_tkn=srctok-XXX',
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action', function() {
      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', TARGET_ORG_ID)
          .webAction({ url: 'https://www.target.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://goto.target.com/c/415484/81938/2092?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.target.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', KOHLS_ORG_ID)
          .webAction({ url: 'https://www.kohls.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://kohls.sjv.io/c/415484/362118/5349?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.kohls.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', MVMT_ORG_ID)
          .webAction({ url: 'https://www.mvmt.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://mvmt.7eer.net/c/415484/222268/3856?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.mvmt.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', BACKCOUNTRY_ORG_ID)
          .webAction(
            { url: 'https://www.backcountry.com' },
            'ios',
            'srctok-XXX'
          ),
        {
          app_link: null,
          browser_link:
            'http://backcountry.pxf.io/c/415484/358742/5311?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.backcountry.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', HOUZZ_ORG_ID)
          .webAction({ url: 'https://www.houzz.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://hpn.houzz.com/c/415484/372747/5454?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.houzz.com&btn_tkn=srctok-XXX',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', HOTWIRE_ORG_ID)
          .webAction({ url: 'https://www.hotwire.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'http://partners.hotwire.com/c/415484/205226/3435?subId1=srctok-XXX&subId2=org-XXX&sharedid=org-XXX&u=https%3A%2F%2Fwww.hotwire.com&btn_tkn=srctok-XXX',
        }
      );
    });
  });

  describe('destinationFromUrl', function() {
    it('returns a destination from a url', function() {
      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', HOTWIRE_ORG_ID)
          .destinationFromUrl('https://www.target.com/iphone-7'),
        {
          url: 'https://www.target.com/iphone-7',
        }
      );

      assert.deepEqual(
        this.config
          .createBuilder('org-XXX', HOTWIRE_ORG_ID)
          .destinationFromUrl(''),
        {
          url: '',
        }
      );
    });
  });
});
