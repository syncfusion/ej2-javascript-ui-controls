import { Observer } from '../src/observer';
/**
 * Spec for Observe module.
 */
let event1Spy: jasmine.Spy;
let event2Spy: jasmine.Spy;
let event3Spy: jasmine.Spy;
describe('Observable', () => {
    let instance: any;
    let evtName: string[] = ['event1'];
    let obj: Object = { test: 'context' };
    let obj2: Object = { dynamicContext: 'dynamic' };
    beforeEach(() => {
        instance = new Observer(obj);
        event1Spy = jasmine.createSpy('event1');
        event2Spy = jasmine.createSpy('event2');
        event3Spy = jasmine.createSpy('event3');
    });
    describe('on', () => {
        it('check private custom event using the on function works properly', () => {
            instance.on('event1', event2Spy);
            expect(instance.boundedEvents[evtName[0]].length).toBe(1);
            expect(instance.boundedEvents[evtName[0]][0].handler).toEqual(event2Spy);
        });
        it('handler not binded to event while handle is not valid', () => {
            let invalidHandler: Function;
            instance.on('event2', invalidHandler);
            expect(instance.boundedEvents.hasOwnProperty('event2')).toBe(false);
        });
    });
    describe('on with multiple handlers', () => {
        beforeEach(() => {
            instance.on('event1', event1Spy);
            instance.on('event1', event2Spy);
            instance.on('event1', event3Spy);
        });
        it('All handlers are added proeprly to the event', () => {
            expect(instance.boundedEvents[evtName[0]].length).toBe(3);
        });
        it('check inserting duplicate handlers', () => {
            instance.on('event1', event1Spy);
            expect(instance.boundedEvents[evtName[0]].length).toBe(3);
        });
    });
    describe('off', () => {
        it('Removing all handlers', () => {
            instance.on('event1', event2Spy);
            instance.on('event1', event2Spy);
            instance.off('event1');
            expect(instance.boundedEvents[evtName[0]]).toBeUndefined();
        });
    });
    describe('off with multiple handlers', () => {
        it('Removing the specific handler form the list of handlers works proelry', () => {
            instance.on('event1', event1Spy);
            instance.on('event1', event2Spy);
            instance.off('event1', event1Spy);
            expect(instance.boundedEvents[evtName[0]].length).toBe(1);
            expect(instance.boundedEvents[evtName[0]][0].handler).toEqual(event2Spy);
        });
    });
    describe('off with invalid event Name', () => {
        it('Works properly', () => {
            instance.off('eventtest', event3Spy);
            expect(event3Spy).not.toHaveBeenCalled();
        });
    });
    describe('off with invalid handler', () => {
        it('Not removes the actual event handlers', () => {
            instance.on('event1', event1Spy);
            instance.off('event1', (): string => { return 'test'; });
            expect(instance.boundedEvents[evtName[0]].length).toBe(1);
        });
    });
    describe('notify', () => {
        it('check private custom event using the notify function works properly', () => {
            instance.on('event1', event2Spy);
            instance.notify('event1', { a: 2, b: 3 });
            expect(event2Spy).toHaveBeenCalledWith({ name: 'event1', a: 2, b: 3 });
        });
        describe('notify processing handler properly', () => {
            let inst: Observer = new Observer();
            let sk: Function = () => {
                inst.off('eventskip', sk);
            };
            let eventsk1: jasmine.Spy = jasmine.createSpy('event1');
            let eventsk2: jasmine.Spy = jasmine.createSpy('event2');
            beforeAll(() => {
                inst.on('eventskip', sk);
                inst.on('eventskip', eventsk1);
                inst.on('eventskip', eventsk2);
                inst.notify('eventskip');
            });
            it('dont skip events ', () => {
                expect(eventsk1).toHaveBeenCalled();
                expect(eventsk2).toHaveBeenCalled();
            });
        });
    });
    describe('check the context set to the instance', () => {
        it('returns properly', () => {
            let value: any;
            let cntxt: Function = function (): void { value = this; };
            instance.on('eventtest', cntxt);
            instance.notify('eventtest');
            expect(value).toEqual(obj);
        });
    });
    describe('check the context set using on method dynamically', () => {
        it('returns properly', () => {
            let value: any;
            let cntxt: Function = function (): void { value = this; };
            instance.on('eventtest', cntxt, obj2);
            instance.notify('eventtest');
            expect(value).toEqual(obj2);
        });
    })
    describe('notify with multiple handlers', () => {
        beforeEach(() => {
            instance.on('event1', event1Spy);
            instance.on('event1', event2Spy);
            instance.on('event1', event3Spy);
        });
        it('multiple properties works properly', () => {
            instance.notify('event1');
            expect(event1Spy).toHaveBeenCalled();
            expect(event2Spy).toHaveBeenCalled();
            expect(event3Spy).toHaveBeenCalled();
        });
    });
    describe('Test instance without passsing context', () => {
        let instance1: Observer = new Observer();
        it('Event operations working fine', () => {
            instance1.on('event1', event1Spy);
            instance1.notify('event1', {});
            expect(event1Spy).toHaveBeenCalled();
        });
        it('Check the context in the handler', () => {
            let value: Object;
            instance.on('eventcntxt', function (): void { value = this; });
            expect(value).toBeUndefined();
        });
    });
    describe('destroy', () => {
        it('Works properly', () => {
            instance.on('event1', event1Spy);
            instance.on('on', event2Spy);
            instance.on('event', event3Spy);
            instance.destroy();
            expect(instance.boundedEvents).toBeUndefined();
            expect(instance.context).toBeUndefined();
        });

    });
});