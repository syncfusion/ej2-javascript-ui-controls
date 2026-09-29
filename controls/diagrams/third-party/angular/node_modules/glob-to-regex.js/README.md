# glob-to-regex.js

Transform GLOB patterns to JavaScript regular expressions for fast file path matching.

This tiny library converts familiar shell-style glob patterns like `**/*.ts` or `src/{a,b}/**/*.js` into JavaScript `RegExp` objects and provides a convenient matcher utility. Matching semantics follow `minimatch`,
so the regexes can stand in for it segment by segment.

## Install

```bash
yarn add glob-to-regex.js
# or
npm i glob-to-regex.js
```

## Quick start

```ts
import {toRegex, toMatcher, expandBraces} from 'glob-to-regex.js';

// Build a RegExp from a glob
const re = toRegex('src/**/test.ts');
re.test('src/a/b/test.ts'); // true
re.test('src/test.ts');     // true
re.test('src/test.tsx');    // false

// Shell rules for dotfiles and extended globs
const shell = toRegex('**/!(*.test).js', {dot: false, extglob: true});
shell.test('src/index.js');    // true
shell.test('src/app.test.js'); // false
shell.test('.git/hooks.js');   // false

// Build a predicate function from a pattern or an array of patterns
const match = toMatcher(['**/*.ts', '/\\.d\\.ts$/']);
match('index.ts');   // true
match('types.d.ts'); // true

expandBraces('src/{lib,test}/{1..3}.ts');
// ['src/lib/1.ts', 'src/lib/2.ts', ..., 'src/test/3.ts']
```

## API

- `toRegex(pattern: string, options?: GlobOptions): RegExp`
	- Converts a glob pattern to an anchored regular expression (`^...$`).

- `toMatcher(pattern: string | RegExp | Array<string | RegExp>, options?: GlobOptions): (path: string) => boolean`
	- Accepts a glob string, a RegExp, or an array of them. If given an array, it returns true if any item matches (logical OR, short-circuited).
	- Strings starting with `/` and ending with `/flags?` are treated as regular expressions (e.g. `"/\\.test\\.ts$/"`).

- `expandBraces(pattern: string, max?: number): string[]`
	- Expands `{a,b}` alternations and `{1..3}` ranges into the list of patterns they stand for, nesting included. Stops after `max` patterns (default 100,000).

### Options

- `nocase` — case-insensitive matching.
- `extglob` — enables the `?(...)`, `*(...)`, `+(...)`, `@(...)` and `!(...)` groups.
- `dot` — whether `*`, `?`, `[...]` and extglobs match a leading `.` of a path segment. Defaults to `true`; `false` is the shell rule, where a dotfile is matched only by a literal dot in the pattern (`.*` matches `.gitignore`, `*` does not) and `**` does not descend into dot directories.

## Supported glob features

- `/` separates path segments
- `*` matches zero or more characters within a single segment (does not cross `/`). A segment that is only `*` matches at least one character, as a file name is never empty: `a/*` does not match `a/`
- `?` matches exactly one character within a single segment
- `**` matches across path segments, including none. `**/**/` is the same as `**/`
- `{a,b,c}` alternation groups, nested as in `{a,{b,c}}`. Each item can itself contain glob syntax
- `{1..3}`, `{a..c}`, `{01..10..2}` ranges, with the step and zero padding of bash
- Character classes: `[abc]`, `[a-z]`, `[!a-z]`, `[^a-z]`, and POSIX classes such as `[[:alpha:]]` or `[a[:digit:]]`. A `]` right after the opening bracket is a member of the class: `[]a]` matches `]` or `a`
- **Extended globbing** (when `extglob: true` option is set):
  - `?(pattern-list)` matches zero or one occurrence of the given patterns
  - `*(pattern-list)` matches zero or more occurrences of the given patterns
  - `+(pattern-list)` matches one or more occurrences of the given patterns
  - `@(pattern-list)` matches exactly one of the given patterns
  - `!(pattern-list)` matches anything except one of the given patterns. The exclusion covers the rest of the pattern, so `!(a).js` rejects `a.js` and accepts `ab.js`; `!()` matches any non-empty segment
  - Pattern lists use `|` as separator (e.g., `@(jpg|png|gif)`)

Notes:
- The produced RegExp is anchored at start and end (`^...$`).
- A brace group without a comma or range (`{a}`, `{}`) and an unmatched `{`, `[` or `(` are literal.
- A range with its ends reversed, like `[z-a]`, matches nothing instead of throwing.
- There is no escape character: a backslash is a literal backslash.

## Examples

```ts
toRegex('a/b/c.txt').test('a/b/c.txt'); // true
toRegex('a/*.txt').test('a/file.txt');  // true
toRegex('a/*.txt').test('a/x/y.txt');   // false
toRegex('file?.js').test('file1.js');   // true
toRegex('src/**/test.ts').test('src/a/b/test.ts'); // true
toRegex('assets/**').test('assets/a/b.png');       // true
toRegex('*.{html,txt}').test('page.html');         // true
toRegex('src/{a,b}/**/*.ts').test('src/b/x/y.ts'); // true
toRegex('v{1..3}.tgz').test('v2.tgz');             // true
toRegex('file[0-9].txt').test('file5.txt');        // true
toRegex('file[!0-9].txt').test('filea.txt');       // true
toRegex('[[:upper:]]*.ts').test('App.ts');         // true
toRegex('**/*.[jt]s{,x}').test('dir/a/b.jsx');     // true

// Dotfiles
toRegex('*.js').test('.eslintrc.js');               // true
toRegex('*.js', {dot: false}).test('.eslintrc.js'); // false
toRegex('.*', {dot: false}).test('.eslintrc.js');   // true
toRegex('**/*.js', {dot: false}).test('node_modules/.cache/a.js'); // false

// Extended globbing examples
toRegex('file?(s).txt', {extglob: true}).test('file.txt');  // true
toRegex('file?(s).txt', {extglob: true}).test('files.txt'); // true
toRegex('file.@(jpg|png|gif)', {extglob: true}).test('file.jpg'); // true
toRegex('/var/log/!(*.gz)', {extglob: true}).test('/var/log/syslog'); // true
toRegex('/var/log/!(*.gz)', {extglob: true}).test('/var/log/error.log.gz'); // false
toRegex('src/**/!(*.test).js', {extglob: true}).test('src/app.test.js'); // false
toRegex('src/**/!(*.test).js', {extglob: true}).test('src/index.js'); // true
toRegex('!(a).js', {extglob: true}).test('ab.js'); // true
toRegex('!(a).js', {extglob: true}).test('a.js');  // false
```

## TypeScript

Types are bundled. The library targets modern Node.js and browsers.

## Performance

`toRegex` performs a single pass over the pattern and creates a native RegExp. Matching is then performed by V8's highly optimized engine.

## Limitations

- Negated globs like `!**/*.d.ts` are not parsed specially. If you need exclusion, combine multiple matchers or filter results separately.
- `**` is a globstar wherever it appears, not only as a whole segment: `a**` matches across `/`.
- Like minimatch, `!(a)*` does not match `a`: the negation rejects the whole remainder, while bash tries every split.

## License

Apache-2.0 © streamich
