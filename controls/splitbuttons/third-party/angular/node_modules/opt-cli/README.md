# opt-cli
Execute CLI Statements based upon opt-in / out-out Rules.

[![version](https://img.shields.io/npm/v/opt-cli.svg?style=flat-square)](http://npm.im/opt-cli)
[![Build Status](https://img.shields.io/travis/ta2edchimp/opt-cli/master.svg?style=flat-square)](https://travis-ci.org/ta2edchimp/opt-cli)
[![Code Coverage](https://img.shields.io/codecov/c/github/ta2edchimp/opt-cli.svg?style=flat-square)](https://codecov.io/github/ta2edchimp/opt-cli)
[![Dependencies status](https://img.shields.io/david/ta2edchimp/opt-cli.svg?style=flat-square)](https://david-dm.org/ta2edchimp/opt-cli#info=dependencies)

[![MIT License](https://img.shields.io/npm/l/opt-cli.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![downloads](https://img.shields.io/npm/dm/opt-cli.svg?style=flat-square)](http://npm-stat.com/charts.html?package=opt-cli&from=2016-03-20)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors)

## Installation

Simply install locally as a development dependency to your project's package:

```
npm install --save-dev opt-cli
```

## Intended usage
Opting in/out of a configured tasks, **best use case is for ghooks**.
[This discussion](https://github.com/gtramontina/ghooks/issues/48#issuecomment-194002689) is the main motivation behind this module.

You can check out the [eslint-find-new-rules/package.json](https://github.com/kentcdodds/eslint-find-new-rules/blob/master/package.json#L67) for reference.

### `opt --in`

```JSON
"config": {
  "ghooks": {
    "pre-commit": "opt --in pre-commit --exec 'npm run validate'"
  }
},
```

While `commit`ing, `npm run validate` **will not be executed** by default.
However, one can **opt in by creating a `.opt-in` file in the root of the project, with the content `pre-commit`**

#### `.opt-in`

Each line in the `.opt-in` file, is the keyword used after the `opt --in` rule.

So for the above example, it's `pre-commit`

```
cat .opt-in
# "ghooks": {
#   "pre-commit": "opt --in pre-commit --exec 'npm run validate'"
# }
pre-commit # the keyword used after the opt --in command
```

### `opt --out`

`opt --out` works exactly, the opposite way of `opt --in`.

```JSON
"config": {
  "ghooks": {
    "pre-commit": "opt --out pre-commit --exec 'npm run validate'"
  }
},
```

In this case, `npm run validate` **will be executed** before any changes can be `commit`ed.
In order to **opt out, you have to create a `.opt-out` file in the root of the project, with the content `pre-commit`**

#### `.opt-out`

Similar to `.opt-in` file, each line in `.opt-out` file, is the keyword used after the `opt --out` rule.

So for the above example, it's `pre-commit`

```
cat .opt-out
# "ghooks": {
#   "pre-commit": "opt --out pre-commit --exec 'npm run validate'"
# }
pre-commit # the keyword used after the opt --out command
```

* **don't forget to update `.gitignore` to ignore this file.**
* `opt-in`, `opt-out` files can contain multiple rules
* every line must contain only a single rule.
* `#` can be used to comment any rule.

## Use As Library

You may also include opt-cli as a library:

```JavaScript
var opt = require( 'opt-cli' );
```

Given the example setup from above, usage would be as follows:

```JavaScript
opt.testOptIn( 'pre-commit' ) === true
opt.testOptOut( 'pre-push' ) === true
```

Using `opt.getExplicitOpts()` you would receive:

```JavaScript
{
  'pre-commit': true,
  'pre-push': false
}
```

## Advanced Usage

Rules to opt-into or opt-out of can also be specified using ...

- ... an `in` or `out` array of a `package.json`'s `config.opt` field:

```JSON
"config": {
  "opt": {
    "in": [ "pre-commit" ],
    "out": [ "pre-push" ]
  }
},
```

- ... the environment variables `OPT_IN` and `OPT_OUT`:

```
# Delimit multiple rules with ":" on *nix / ";" on Win
export OPT_IN="pre-commit"
export OPT_OUT="pre-push"
```

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [![Kent C. Dodds](https://avatars3.githubusercontent.com/u/1500684?v=3&s=100)<br /><sub>Kent C. Dodds</sub>](https://twitter.com/kentcdodds)<br />[💻](https://github.com/ta2edchimp/opt-cli/commits?author=kentcdodds) 👀 | [![Guilherme J. Tramontina](https://avatars2.githubusercontent.com/u/374635?v=3&s=100)<br /><sub>Guilherme J. Tramontina</sub>](https://github.com/gtramontina)<br />[💻](https://github.com/ta2edchimp/opt-cli/commits?author=gtramontina) | [![Andreas Windt](https://avatars1.githubusercontent.com/u/262436?v=3&s=100)<br /><sub>Andreas Windt</sub>](https://twitter.com/ta2edchimp)<br />[💻](https://github.com/ta2edchimp/opt-cli/commits?author=ta2edchimp) [📖](https://github.com/ta2edchimp/opt-cli/commits?author=ta2edchimp) [⚠️](https://github.com/ta2edchimp/opt-cli/commits?author=ta2edchimp) | [![Sarbbottam Bandyopadhyay](https://avatars1.githubusercontent.com/u/949380?v=3&s=100)<br /><sub>Sarbbottam Bandyopadhyay</sub>](https://twitter.com/sarbbottam)<br />[📖](https://github.com/ta2edchimp/opt-cli/commits?author=sarbbottam) |
| :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)).
[Contributions of any kind welcome](CONTRIBUTING.md)!

Special thanks to [@kentcdodds](https://github.com/kentcdodds) for encouraging to engage in oss, for the wonderful resources (check out the [Egghead videos!](https://egghead.io/series/how-to-write-an-open-source-javascript-library)) and — together with [gtramontina](https://github.com/gtramontina) — for coming up with [the original idea to this module](https://github.com/gtramontina/ghooks/issues/48#issuecomment-194002689)!
