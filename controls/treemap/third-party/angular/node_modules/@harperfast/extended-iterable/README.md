[![license](https://img.shields.io/badge/license-MIT-brightgreen)](LICENSE)
[![npm version](https://img.shields.io/npm/v/extended-iterable.svg?style=flat-square)](https://www.npmjs.org/package/extended-iterable)
[![npm downloads](https://img.shields.io/npm/dw/extended-iterable)](https://www.npmjs.org/package/extended-iterable)

The extended-iterable package provides a class that implements the Iterable/Iterator protocol and provides array-like methods
with lazy evaluation, similar to [iterators helpers](https://github.com/tc39/proposal-iterator-helpers). However,
extended-iterable provides additional methods, the ability to handle both sync and async iteration, automatic handling of
asynchronous callbacks, and return/throw forwarding which can be critical for proper cleanup when used with
database transactions.

The package exports a single `ExtendedIterable` class, which can be constructed with a basic iterable or can be constructed
with no arguments and assigned (or overridden with) an `iterate` method that returns an iterator.

For example, we can create an `ExtendedIterable`:
```javascript
import { ExtendedIterable } from '@harperdb/extended-iterable';

function performQuery() {
	let results = new ExtendedIterable();
	results.iterate = function() {
		let txn = startTxn(); // we can start a transaction in some database, and be notified of when the iterable is completed below
		let cursor = txn.doQuery();
		return {
			// implement an iterator
			next() {
				// iterate through a query or table
				let entry = cursor.getNext();
				if (entry)
					return { value: entry };
				else
					return { done: true };
            },
			return () { // called when the iterator is done
				txn.commit();
            },
			throw () {
				txn.abort();
            }
        }
    };
	return results;
}
```


The returned `ExtendedIterable` is fully iterable: 

```js
let extendedIterable = performQuery();
for (let value of extendedIterable) {
	// for each value
}
```

Or we can use the provided iterative methods on the returned results:

```js
extendedIterable
	.filter((value) => test(value))
	.forEach((value) => {
		// for each value that matched the filter
	})
```

Note that `map` and `filter` are also lazy, they will only be executed once their returned iterable is iterated or `forEach` is called on it. The `map` and `filter` functions also support async/promise-based functions, and you can create an async iterable if the callback functions execute asynchronously (return a promise).

We can also query with offset to skip a certain number of entries, and limit the number of entries to iterate through:

```js
let sliced = extendedIterable.slice(10, 20); // skip first 10 and get next 10
```

If you want to get a true array from the results, the `asArray` property will return the results as an array.

### Catching Errors in iteration
With an array, `map` and `filter` callbacks are immediately executed, but wit iterators, they are executed during iteration, so if an error occurs during iteration, the error will be thrown when the iteration is attempted. It is also critical that when an iteration is finished, the cursor is closed, so by default, if an error occurs during iteration, the cursor will immediately be closed. However, if you want to catch errors that occur in `map` (and `flatMap`) callbacks during iteration, you can use the `mapError` method to catch errors that occur during iteration, and allow iteration to continue (without closing the cursor). For example:

```js 
let mapped = extendedIterable.map(({ key, value }) => {
	return thisMightThrowError(value);
}).mapError((error) => {
    // rather than letting the error terminate the iteration, we can catch it here and return a value to continue iterating:
    return 'error occurred';
})
for (let entry of mapped) {
...
}
```
A `mapError` callback can return a value to continue iterating, or throw an error to terminate the iteration.

## License

This library is licensed under the terms of the MIT license.

## Related Projects
