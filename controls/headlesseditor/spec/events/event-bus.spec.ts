import { EventBus, IErrorReporter, SubscriberPriority } from '../../src/events/event-bus';
import { EditorEvent } from '../../src/events/editor-event';

function makeReporter(): { reporter: IErrorReporter; errorSpy: jasmine.Spy } {
    const errorSpy = jasmine.createSpy('error');
    const reporter: IErrorReporter = { error: errorSpy };
    return { reporter, errorSpy };
}

function makeEvent<T>(type: string, payload: T): EditorEvent<T> {
    return { type, payload };
}

describe('EventBus', () => {
    describe('subscribe and publish', () => {
        it('calls the handler when a matching event is published', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const handler = jasmine.createSpy('handler');

            bus.subscribe<string>('test', handler);
            bus.publish(makeEvent('test', 'hello'));

            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler).toHaveBeenCalledWith(makeEvent('test', 'hello'));
        });

        it('does not call handlers registered for a different event type', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const handler = jasmine.createSpy('handler');

            bus.subscribe('other', handler);
            bus.publish(makeEvent('test', null));

            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('priority ordering', () => {
        it('dispatches High before Normal before Low', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const order: string[] = [];

            bus.subscribe('e', () => order.push('low'), SubscriberPriority.Low);
            bus.subscribe('e', () => order.push('normal'), SubscriberPriority.Normal);
            bus.subscribe('e', () => order.push('high'), SubscriberPriority.High);

            bus.publish(makeEvent('e', null));
            expect(order).toEqual(['high', 'normal', 'low']);
        });

        it('dispatches same-priority subscribers in registration order', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const order: string[] = [];

            bus.subscribe('e', () => order.push('a'));
            bus.subscribe('e', () => order.push('b'));
            bus.subscribe('e', () => order.push('c'));

            bus.publish(makeEvent('e', null));
            expect(order).toEqual(['a', 'b', 'c']);
        });
    });

    describe('error isolation', () => {
        it('continues dispatching to remaining subscribers after one throws', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const afterHandler = jasmine.createSpy('afterHandler');

            bus.subscribe('e', () => { throw new Error('boom'); });
            bus.subscribe('e', afterHandler);

            bus.publish(makeEvent('e', null));
            expect(afterHandler).toHaveBeenCalledTimes(1);
        });

        it('reports the error to the error reporter', () => {
            const { reporter, errorSpy } = makeReporter();
            const bus = new EventBus(reporter);

            bus.subscribe('e', () => { throw new Error('bad'); });
            bus.publish(makeEvent('e', null));

            expect(errorSpy).toHaveBeenCalledTimes(1);
            const [message] = errorSpy.calls.first().args as [string, unknown];
            expect(message).toContain('"e"');
            expect(message).toContain('bad');
        });

        it('handles non-Error thrown values by stringifying them', () => {
            const { reporter, errorSpy } = makeReporter();
            const bus = new EventBus(reporter);

            // Throw a non-Error value (string) to exercise the String(err) branch
            bus.subscribe('e', () => { throw 'plain string error'; });
            bus.publish(makeEvent('e', null));

            expect(errorSpy).toHaveBeenCalledTimes(1);
            const [message] = errorSpy.calls.first().args as [string, unknown];
            expect(message).toContain('plain string error');
        });
    });

    describe('inactive entry handling', () => {
        it('skips subscribers marked inactive during dispatch', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const handlerA = jasmine.createSpy('handlerA');
            const handlerB = jasmine.createSpy('handlerB');

            const subA = bus.subscribe('e', () => {
                subA.dispose();
            });
            bus.subscribe('e', handlerB);

            // First publish: A fires and disposes itself, B fires
            bus.publish(makeEvent('e', null));
            // Second publish: A is inactive, only B fires
            bus.publish(makeEvent('e', null));

            expect(handlerB).toHaveBeenCalledTimes(2);
        });

        it('skips a lower-priority subscriber that was disposed by a higher-priority handler during dispatch', () => {
            // This exercises the `continue` branch: the snapshot is a copy of the
            // subscriptions list, so an entry that gets removed from the list
            // mid-dispatch is still iterated, and its `active=false` triggers continue.
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const handlerB = jasmine.createSpy('handlerB');
            let subB: { dispose: () => void } | undefined;

            bus.subscribe('e', () => {
                // High-priority handler disposes the low-priority subscription
                subB!.dispose();
            }, SubscriberPriority.High);

            subB = bus.subscribe('e', handlerB, SubscriberPriority.Low);

            bus.publish(makeEvent('e', null));

            // B was disposed during dispatch and should be skipped
            expect(handlerB).not.toHaveBeenCalled();
        });
    });

    describe('disposal', () => {
        it('disposed subscriber no longer receives events', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const handler = jasmine.createSpy('handler');

            const subscription = bus.subscribe('e', handler);
            subscription.dispose();
            bus.publish(makeEvent('e', null));

            expect(handler).not.toHaveBeenCalled();
        });

        it('subscribe after dispose returns a no-op disposable', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const handler = jasmine.createSpy('handler');

            bus.dispose();
            const subscription = bus.subscribe('e', handler);

            // No-op disposable should be returned - calling dispose() should not throw
            expect(() => subscription.dispose()).not.toThrow();

            // Publish should also be a no-op after dispose
            bus.publish(makeEvent('e', null));
            expect(handler).not.toHaveBeenCalled();
        });

        it('double dispose is safe (early return on second call)', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);

            bus.dispose();
            // Second dispose should not throw
            expect(() => bus.dispose()).not.toThrow();
        });

        it('disposing one subscriber does not affect others', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const handlerA = jasmine.createSpy('handlerA');
            const handlerB = jasmine.createSpy('handlerB');

            const subA = bus.subscribe('e', handlerA);
            bus.subscribe('e', handlerB);
            subA.dispose();
            bus.publish(makeEvent('e', null));

            expect(handlerA).not.toHaveBeenCalled();
            expect(handlerB).toHaveBeenCalledTimes(1);
        });

        it('self-disposal during dispatch does not crash or re-call', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            let callCount = 0;
            let subscription = bus.subscribe('e', () => {
                callCount++;
                subscription.dispose();
            });

            bus.publish(makeEvent('e', null));
            bus.publish(makeEvent('e', null)); // second publish — should be no-op for handler

            expect(callCount).toBe(1);
        });

        it('post-dispose publish is a no-op', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const handler = jasmine.createSpy('handler');

            bus.subscribe('e', handler);
            bus.dispose();
            bus.publish(makeEvent('e', null));

            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('subscribeBulk', () => {
        it('registers all handlers and dispatches correctly', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const handlerA = jasmine.createSpy('handlerA');
            const handlerB = jasmine.createSpy('handlerB');

            bus.subscribeBulk({ eventA: handlerA, eventB: handlerB });
            bus.publish(makeEvent('eventA', null));
            bus.publish(makeEvent('eventB', null));

            expect(handlerA).toHaveBeenCalledTimes(1);
            expect(handlerB).toHaveBeenCalledTimes(1);
        });

        it('bulk dispose removes all handlers at once', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const handlerA = jasmine.createSpy('handlerA');
            const handlerB = jasmine.createSpy('handlerB');

            const bulk = bus.subscribeBulk({ eventA: handlerA, eventB: handlerB });
            bulk.dispose();

            bus.publish(makeEvent('eventA', null));
            bus.publish(makeEvent('eventB', null));

            expect(handlerA).not.toHaveBeenCalled();
            expect(handlerB).not.toHaveBeenCalled();
        });
    });

    describe('defensive entry removal', () => {
        it('double-disposing a subscription is safe (no-op on second call)', () => {
            const { reporter } = makeReporter();
            const bus = new EventBus(reporter);
            const handler = jasmine.createSpy('handler');

            const subscription = bus.subscribe('e', handler);

            // First dispose - removes the entry from the map
            subscription.dispose();
            // Second dispose - the entry no longer exists, removeEntry should handle gracefully
            expect(() => subscription.dispose()).not.toThrow();

            bus.publish(makeEvent('e', null));
            expect(handler).not.toHaveBeenCalled();
        });
    });
});
