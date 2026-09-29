import { DisposableCollection } from '../../src/events/disposable-collection';
import { IDisposable } from '../../src/events/types';

function makeDisposable(): { dispose: jasmine.Spy; item: IDisposable } {
    const spy = jasmine.createSpy('dispose');
    const item: IDisposable = { dispose: spy };
    return { dispose: spy, item };
}

describe('DisposableCollection', () => {
    it('disposes all added items when dispose() is called', () => {
        const collection = new DisposableCollection();
        const a = makeDisposable();
        const b = makeDisposable();

        collection.add(a.item);
        collection.add(b.item);
        collection.dispose();

        expect(a.dispose).toHaveBeenCalledTimes(1);
        expect(b.dispose).toHaveBeenCalledTimes(1);
    });

    it('is idempotent — second dispose() call does nothing', () => {
        const collection = new DisposableCollection();
        const a = makeDisposable();

        collection.add(a.item);
        collection.dispose();
        collection.dispose();

        expect(a.dispose).toHaveBeenCalledTimes(1);
    });

    it('isDisposed returns false before dispose and true after', () => {
        const collection = new DisposableCollection();
        expect(collection.isDisposed).toBe(false);
        collection.dispose();
        expect(collection.isDisposed).toBe(true);
    });

    it('immediately disposes items added after the collection is disposed', () => {
        const collection = new DisposableCollection();
        collection.dispose();

        const late = makeDisposable();
        collection.add(late.item);

        expect(late.dispose).toHaveBeenCalledTimes(1);
    });

    it('disposes items in registration order', () => {
        const order: string[] = [];
        const collection = new DisposableCollection();

        collection.add({ dispose: () => order.push('a') });
        collection.add({ dispose: () => order.push('b') });
        collection.add({ dispose: () => order.push('c') });

        collection.dispose();
        expect(order).toEqual(['a', 'b', 'c']);
    });
});
