'use strict';

const URL = require('url');

const _ = require('lodash');
const scraperjs = require('scraperjs');

const redditConfig = {
  url: 'http://www.reddit.com',

  search: {
    locator: 'search?q={}',
    selectors: {
      link: [
        'div.search-result-link',
        'a.search-title'
      ]
    }
  },

  category: {
    locator: '{}',
    selectors: {
      link: [
        'div.link',
        'a.title'
      ]
    }
  }
};

const youtubeConfig = {
  url: 'https://www.youtube.com',

  search: {
    locator: 'results?search_query={}',
    selectors: {
      link: [
        'ol.item-section',
        'a.yt-uix-tile-link'
      ]
    }
  },

  category: {
    values: ['trending'],
    locator: 'feed/{}',
    selectors: {
      link: [
        'ul.expanded-shelf-content-list',
        'a.yt-uix-tile-link'
      ]
    }
  }
};

const twitterConfig = {
  url: 'https://twitter.com',

  search: {
    locator: 'search?q={}',
    selectors: {
      link: [
        'div.stream-item-header',
        'a.js-permalink'
      ],
      title: [
        'div.js-tweet-text-container',
        'p.js-tweet-text'
      ]
    },
    textSelectors: []
  },

  category: {
    values: ['moments'],
    locator: 'i/{}',
    selectors: {
      link: [
        'div.MomentCapsuleSummary-details',
        'a.MomentCapsuleSummary-title'
      ]
    }
  }
};

class Dig {
  constructor(config) {
    this.config = _.merge({}, config);
  }

  category(term, cb) {
    const url = `${this.config.url}/${this.config.category.locator.replace('{}', term)}`;
    this.scrapeLink(this.config.category.selectors, 'href', url, cb);
  }

  search(term, cb) {
    const url = `${this.config.url}/${this.config.search.locator.replace('{}', term)}`;
    this.scrapeLink(this.config.search.selectors, this.config.search.href || 'href', url, cb);
  }

  scrapeLink(selectors, href, url, cb) {
    scraperjs.StaticScraper.create(url)
      .scrape($ => {

        const selectorReducer = (a, selector) => {
          let find;
          if (!a) {
            find = $(selector);
            if (find) {
              a = {element: find[0]};
            }
          } else if (a.element) {
            find = $(a.element).find(selector);
            if (find) {
              a = {element: find[0]};
            } else {
              a = {element: null}
            }
          }
          return a;
        };

        const link = selectors.link.reduce(selectorReducer, false);

        let href = link.element.attribs['href'];
        if (!href.startsWith('http')) {
          href = addDomain(url, href);
        }

        let ret = {
          href:    href,
          title:   link.element.attribs.title,
          text:    $(link.element).text(),
          display: link.element.attribs.title || $(link.element).text()
        };

        if (selectors.title) {
          const title = selectors.title.reduce(selectorReducer, false);
          ret.display = $(title.element).text();
        }

        return ret;
      })
      .then(element => cb(null, element))
      .catch(err => cb(err, null));
  }

}

module.exports = {
  reddit: new Dig(redditConfig),
  twitter: new Dig(twitterConfig),
  youtube: new Dig(youtubeConfig)
};


function addDomain(url, href) {
  var parsedURL = URL.parse(url);
  return `${parsedURL.protocol}//${parsedURL.host}${href}`
}

if (!module.parent) {
  main();
}


function main() {
  const args = process.argv.slice(2);
  console.log(args);

  const dig       = module.exports[args[0]];
  const operation = args[1];
  const term      = args[2];

  dig[operation](term, (err, ret) => {
    if (err) {
      return console.error(err);
    }
    console.log(ret);
  })
}