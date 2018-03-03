const assert = require('assert');

const KokiriConfig = require('../../../../lib/kokiri/kokiri-config');

describe('lib/kokiri/builders/linkshare', function() {
  beforeEach(function() {
    const approvals = [
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-6ef589c578ab8ac6',
      },
      {
        status: 'approved',
        audience: 'org-XXX',
        organization: 'org-139f1edad7388c6a',
      },
      {
        status: 'approved',
        audience: 'org-030575eddb72b4df',
        organization: 'org-6ef589c578ab8ac6',
      },
      {
        status: 'approved',
        audience: 'org-2d432a88b9bb8bda',
        organization: 'org-6ef589c578ab8ac6',
      },
      {
        status: 'approved',
        audience: 'org-030575eddb72b4df',
        organization: 'org-139f1edad7388c6a',
      },
      {
        status: 'approved',
        audience: 'org-2d432a88b9bb8bda',
        organization: 'org-139f1edad7388c6a',
      },
    ];

    this.config = new KokiriConfig([], [], [], [], { approvals });

    this.builder = this.config.createBuilder(
      'org-030575eddb72b4df',
      'org-139f1edad7388c6a'
    );
  });

  describe('#appAction', function() {
    it('returns an app action for gamestop from shopkick', function() {
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'http://www.gamestop.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://click.linksynergy.com/deeplink?id=gEO3*xWPBFA&mid=24348&murl=http%3A%2F%2Fwww.gamestop.com&u1=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action for gamestop from ibotta', function() {
      const gamestopBuilder = this.config.createBuilder(
        'org-2d432a88b9bb8bda',
        'org-139f1edad7388c6a'
      );

      assert.deepEqual(
        gamestopBuilder.appAction(
          {
            url: 'http://www.gamestop.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://click.linksynergy.com/deeplink?id=BLquFtB2nfI&mid=24348&murl=http%3A%2F%2Fwww.gamestop.com&u1=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
    it('returns an app action with destination', function() {
      const b = this.config.createBuilder(
        'org-030575eddb72b4df',
        'org-6ef589c578ab8ac6'
      );
      assert.deepEqual(
        b.appAction(
          {
            url: 'http://www.techarmor.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://click.linksynergy.com/deeplink?id=gEO3*xWPBFA&mid=38275&murl=http%3A%2F%2Fwww.techarmor.com&u1=srctok-XXX&btn_ref=srctok-XXX',
        }
      );

      assert.deepEqual(
        b.appAction(
          {
            url: 'http://www.techarmor.com',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://click.linksynergy.com/deeplink?id=gEO3*xWPBFA&mid=38275&murl=http%3A%2F%2Fwww.techarmor.com&u1=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns app action with null values if there is no org_id to mid mapping', function() {
      this.builder.merchantId = 'org-XXX';
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'http://www.example.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: null,
        }
      );
      assert.deepEqual(
        this.builder.appAction(
          {
            url: 'http://www.example.com',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: null,
        }
      );
    });

    it('returns app action with null values if there is no org_id to id mapping', function() {
      const b = this.config.createBuilder('org-XXX', 'org-6ef589c578ab8ac6');
      assert.deepEqual(
        b.appAction(
          {
            url: 'http://www.example.com',
          },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: null,
        }
      );
      assert.deepEqual(
        b.appAction(
          {
            url: 'http://www.example.com',
          },
          'android',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link: null,
        }
      );
    });
  });

  describe('#webAction', function() {
    it('returns a web action via shopkick', function() {
      assert.deepEqual(
        this.builder.webAction(
          { url: 'https://gamestop.com' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://click.linksynergy.com/deeplink?id=gEO3*xWPBFA&mid=24348&murl=https%3A%2F%2Fgamestop.com&u1=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action via ibotta', function() {
      const b = this.config.createBuilder(
        'org-2d432a88b9bb8bda',
        'org-6ef589c578ab8ac6'
      );
      assert.deepEqual(
        b.webAction({ url: 'https://techarmor.com' }, 'ios', 'srctok-XXX'),
        {
          app_link: null,
          browser_link:
            'https://click.linksynergy.com/deeplink?id=BLquFtB2nfI&mid=38275&murl=https%3A%2F%2Ftecharmor.com&u1=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });

    it('returns a web action with destination', function() {
      const b = this.config.createBuilder(
        'org-030575eddb72b4df',
        'org-6ef589c578ab8ac6'
      );
      assert.deepEqual(
        b.webAction(
          { url: 'https://techarmor.com/bloop?a=2' },
          'ios',
          'srctok-XXX'
        ),
        {
          app_link: null,
          browser_link:
            'https://click.linksynergy.com/deeplink?id=gEO3*xWPBFA&mid=38275&murl=https%3A%2F%2Ftecharmor.com%2Fbloop%3Fa%3D2&u1=srctok-XXX&btn_ref=srctok-XXX',
        }
      );
    });
  });

  describe('#destinationFromUrl', function() {
    it('returns a destination from a url', function() {
      this.builder = this.config.createBuilder(
        'org-030575eddb72b4df',
        'org-6ef589c578ab8ac6'
      );
      assert.deepEqual(
        this.builder.destinationFromUrl('https://www.techarmor.com/iphone-7'),
        {
          url: 'https://www.techarmor.com/iphone-7',
        }
      );

      assert.deepEqual(this.builder.destinationFromUrl(''), {
        url: '',
      });
    });
  });
});
