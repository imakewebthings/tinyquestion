# Tiny Question

[tinyquestion.com](http://tinyquestion.com) [![Master Build Status](https://travis-ci.org/imakewebthings/jquery-confirms.png?branch=master)](https://travis-ci.org/imakewebthings/jquery-confirms)

A small tool for better conference Q&A sessions. Presenters can create question sessions and share the link with their audience. Audience members ask questions and upvote questions they like.

## Local Setup

1. Install [Redis](http://redis.io).
2. Run `npm install`.
3. Create a [Twitter application](https://dev.twitter.com).
4. Copy `config.example.json` to `config.json` and replace the values with your
   own.
5. Start your server with `npm start`.

## Config Options

- **PORT**: Port the server listens on. Should be 80 in production.
- **COOKIE_SECRET**: Cookie secret used by express cookie parser.
- **COOKIE_KEY**: Key in the cookie where session information is stored.
- **PERSISTENCE_STRATEGY**: If set to "redis" all question and question session data will be stored in Redis and expired after 48 hours. If set to "memory" this data will be kept in local memory and be lost whenever the server is restarted. The memory persistence strategy is intended for test environments and development environments where Redis cannot be installed or persistence is not important.
- **TWITTER_CONSUMER_KEY**: Key provided by the Twitter application used for authentication/identity.
- **TWITTER_CONSUMER_SECRET**: Secret provided by the Twitter application used for authentication/identity.
- **TWITTER_CALLBACK_URL**: URL that Twitter redirects back to after successful authentication. This needs to point to the absolute URL for the `/auth/twitter/callback/` path.

These config options may be specified in the `config.json` file mentioned in the setup above, through environment variables, or through arguments passed node at startup.

## Tests

Tests can be run with the Testem test runner in TDD mode using `npm run tdd` or in TAP-output CI mode using `npm test`.

## License

Copyright © 2014 - Caleb Troughton. Licensed under the [MIT license](http://opensource.org/licenses/MIT)

## Donations

[![Gittip donate button](http://img.shields.io/gittip/imakewebthings.png)](https://www.gittip.com/imakewebthings/ "Donate weekly to this project using Gittip")
