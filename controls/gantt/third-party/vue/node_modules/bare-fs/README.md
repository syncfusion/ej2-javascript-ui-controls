# bare-fs

Native file system operations for Bare. The API closely follows that of the Node.js `fs` module.

```
npm i bare-fs
```

## Usage

```js
const fs = require('bare-fs')

const fd = await fs.open('hello.txt')

const buffer = Buffer.alloc(1024)

try {
  const length = await fs.read(fd, buffer)

  console.log('Read', length, 'bytes')
} finally {
  await fs.close(fd)
}
```

## API

See the [`bare-fs` reference](https://docs.pears.com/reference/bare/modules/bare-fs).

## License

Apache-2.0
