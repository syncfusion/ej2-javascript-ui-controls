/**
 * Spec for event handlers
 */
import { EventHandler } from '../src/event-handler';
import { createElement } from '../src/dom';

describe('EventHandler', () => {
    describe('add event', () => {
        it('Check event binding', () => {
            let node: HTMLElement = createElement('div', { id: 'test' });
            let clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');
            let event: EventHandler = new EventHandler();
            EventHandler.add(node, 'click', clickFn);
            expect(clickFn).not.toHaveBeenCalled();
            EventHandler.trigger(node, 'click');
            expect(clickFn).toHaveBeenCalled();
        });
    });
    describe('add event with debounce', () => {
        beforeEach((done: any) => {
            setTimeout(() => {
                done();
            }, 100);
        });
        // to check click event
        let node: HTMLElement = createElement('div', { id: 'test' });
        let clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');
        EventHandler.add(node, 'click', clickFn, this, 100);
        EventHandler.trigger(node, 'click');
        it('Check event binding', () => {
            expect(clickFn).toHaveBeenCalled();
        });
    });
    describe('remove event', () => {
        it('remove event without binding', () => {
            let node: HTMLElement = createElement('div', { id: 'test' });
            let clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');

            clickFn = jasmine.createSpy('clickEvent');
            EventHandler.remove(node, 'click', clickFn);
            EventHandler.trigger(node, 'click');
            expect(clickFn).not.toHaveBeenCalled();
        });

        it('remove event listener', () => {
            let node: HTMLElement = createElement('div', { id: 'test' });
            let clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');
            EventHandler.add(node, 'click', clickFn);
            EventHandler.trigger(node, 'click');
            expect(clickFn).toHaveBeenCalled();

            clickFn = jasmine.createSpy('clickEvent');
            EventHandler.remove(node, 'click', clickFn);
            EventHandler.trigger(node, 'click');
            expect(clickFn).not.toHaveBeenCalled();
        });

        it('remove different event listener', () => {
            let node: HTMLElement = createElement('div', { id: 'test' });
            let clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');
            EventHandler.add(node, 'click', clickFn);
            EventHandler.trigger(node, 'click');
            expect(clickFn).toHaveBeenCalled();

            let clickFunc: jasmine.Spy = jasmine.createSpy('clickEvent');
            EventHandler.remove(node, 'click', clickFunc);
            EventHandler.trigger(node, 'click');
            expect(clickFn).toHaveBeenCalled();
        });

        it('remove unbound events', () => {
            let node: HTMLElement = createElement('div', { id: 'test' });
            let clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');

            // added click event
            EventHandler.add(node, 'click', clickFn);
            EventHandler.trigger(node, 'click');
            expect(clickFn).toHaveBeenCalled();

            // removing unbound event
            clickFn = jasmine.createSpy('clickEvent');
            EventHandler.remove(node, '', clickFn);
            EventHandler.trigger(node, '');
            expect(clickFn).not.toHaveBeenCalled();
        });

        it('remove bound events', () => {
            let node: HTMLElement = createElement('div', { id: 'test' });
            let clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');
            EventHandler.add(node, 'click', clickFn);
            EventHandler.trigger(node, 'click');
            expect(clickFn).toHaveBeenCalled();

            clickFn = jasmine.createSpy('clickEvent');
            EventHandler.remove(node, 'click', clickFn);
            EventHandler.trigger(node, 'click');
            expect(clickFn).not.toHaveBeenCalled();
        });
    });
    describe('clear event', () => {
        it('Check event cleared properly using instance method', () => {
            let node: HTMLElement = createElement('div', { id: 'test' });
            // click event bind
            let clickFn: jasmine.Spy = jasmine.createSpy('clickEvent');
            EventHandler.add(node, 'click', clickFn);

            // mouseup event bind
            let mouseup: jasmine.Spy = jasmine.createSpy('clickEvent');
            EventHandler.add(node, 'mouseup', mouseup);

            // clear all the events from element
            EventHandler.clearEvents(node);
            EventHandler.trigger(node, 'click');
            EventHandler.trigger(node, 'mouseup');
            expect(clickFn).not.toHaveBeenCalled();
            expect(mouseup).not.toHaveBeenCalled();
        });
    });

    describe('multiple events', () => {
        it('trigger handler', () => {
            let node: HTMLElement = createElement('div', { id: 'test' });
            // click event bind
            let clickFn1: jasmine.Spy = jasmine.createSpy('clickEvent1');

            EventHandler.add(node, 'click', clickFn1);
            EventHandler.add(node, 'click', clickFn1);
            EventHandler.add(node, 'click', clickFn1);

            EventHandler.trigger(node, 'click');
            expect(clickFn1).toHaveBeenCalledTimes(3);
        });
    });
});