/**
 * Touch Spec
 */
import { Touch, SwipeEventArgs } from '../src/touch';
import { Browser } from '../src/browser';
import { createElement } from '../src/dom';

/*tslint:disable */
let touchTestObj: any;

interface CommonArgs {
    changedTouches?: any[];
    clientX?: number;
    clientY?: number;
    target?: Element | HTMLElement;
    type?: string;
    preventDefault(): void;
}
/*tslint:enable */

let node: Element;
let direction: string;
//Spy function for testing callback 
let tEvents: { tapEvent: Function, tapHold: Function, swipe: Function, scroll: Function, cancel: Function } = {
    tapEvent: (): void => { /** Do Nothing */ },
    tapHold: (): void => { /** Do Nothing */ },
    swipe: (e: SwipeEventArgs): void => { direction = e.swipeDirection },
    scroll: (): void => { /** Do Nothing */ },
    cancel: (): void => { /** Do Nothing */ }
};

//Simulated MouseEvents Args
let startMouseEventArs: CommonArgs = {
    clientX: 200, clientY: 200, target: node, type: 'touchstart',
    preventDefault: (): void => { /** Do Nothing */ }
};

let moveMouseEventArs: CommonArgs = {
    clientX: 500, clientY: 400, target: node, type: 'touchmove',
    preventDefault: (): void => { /** Do Nothing */ }
};

let endMouseEventArs: CommonArgs = {
    clientX: 200, clientY: 200, target: node, type: 'touchend',
    preventDefault: (): void => { /** Do Nothing */ }
};


//Async Test For Tap Event // Tap delay is 300ms
function TapEventTest(done: Function, delay: number): void {
    touchTestObj.startEvent(startMouseEventArs);
    touchTestObj.endEvent(endMouseEventArs);
    setTimeout(
        (): void => {
            done();
        },
        delay);
}

node = createElement('div', { id: 'test' });
touchTestObj = new Touch(<HTMLElement>node);
touchTestObj.swipe = (e: SwipeEventArgs) => { tEvents.swipe(e); };
touchTestObj.scroll = () => { tEvents.scroll(); };
touchTestObj.tap = () => { tEvents.tapEvent(); };
// //Cover on property change.
touchTestObj.onPropertyChanged();
// Spec for Touch Framework    
describe('Touch', () => {

    beforeEach(() => {
        spyOn(tEvents, 'tapEvent').and.callThrough();
        spyOn(tEvents, 'tapHold').and.callThrough();
        spyOn(tEvents, 'swipe').and.callThrough();
        spyOn(tEvents, 'scroll').and.callThrough();
        spyOn(tEvents, 'cancel').and.callThrough();
    });

    describe('Initialization of touch', () => {
        it('empty constructor', () => {
            let ele: HTMLElement = createElement('div', { id: 'test' });
            let objTouch: Touch = new Touch(ele);
            expect(ele.classList.contains('e-touch')).toEqual(true);
        });

        it('constructor with options', () => {
            let ele: HTMLElement = createElement('div', { id: 'test' });
            let objTouch: Touch = new Touch(ele, { tap: (): void => {/** test */ } });
            expect(typeof objTouch.tap).toEqual('function');
            expect(ele.classList.contains('e-touch')).toEqual(true);
        });

        it('ie browser constructor', () => {
            let ele: HTMLElement = createElement('div', { id: 'test' });
            let myWindow: any = window;
            myWindow['browserDetails'].isIE = true;
            let objTouch: Touch = new Touch(ele, { tap: (): void => {/** test */ } });
            expect(typeof objTouch.tap).toEqual('function');
            expect(ele.classList.contains('e-block-touch')).toEqual(true);
        });
    });

    describe('Swipe', () => {
        it('event handler callback on swipe vertical', () => {
            let movedEnd: CommonArgs = moveMouseEventArs;
            movedEnd.type = 'touchend';
            movedEnd.clientY = 400;
            let swipeFn: jasmine.Spy = jasmine.createSpy('clickEvent');
            touchTestObj.swipe = swipeFn;
            //Actions
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(moveMouseEventArs);
            touchTestObj.endEvent(movedEnd);
            //Asserts
            expect(swipeFn).toHaveBeenCalled();
            touchTestObj.swipe = undefined;
        });

        it('event handler callback on swipe horizontal', () => {
            let movedEnd: CommonArgs = moveMouseEventArs;
            movedEnd.type = 'touchend';
            movedEnd.clientX = 400;
            let swipeFn: jasmine.Spy = jasmine.createSpy('swipeEvent');
            touchTestObj.addEventListener('swipe', swipeFn);
            //Actions
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(moveMouseEventArs);
            touchTestObj.endEvent(movedEnd);
            //Asserts
            expect(swipeFn).toHaveBeenCalled();
        });

        it('swipe callback test on swipe down', () => {
            touchTestObj.swipe = (e: SwipeEventArgs) => { tEvents.swipe(e); };
            let movedEnd: CommonArgs = moveMouseEventArs;
            movedEnd.type = 'touchend';
            movedEnd.clientY = 400;
            //Actions
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(moveMouseEventArs);
            touchTestObj.endEvent(movedEnd);
            //Asserts
            expect(direction).toBe('Down');
            expect(tEvents.swipe).toHaveBeenCalled();
            expect(tEvents.scroll).toHaveBeenCalled();
            expect(tEvents.tapEvent).not.toHaveBeenCalled();
            expect(tEvents.tapHold).not.toHaveBeenCalled();
        });

        it('swipe callback test on swipe up', () => {
            let movedEnd: CommonArgs = moveMouseEventArs;
            movedEnd.type = 'touchend';
            movedEnd.clientY = 100;
            movedEnd.clientX = 200;
            //Actions
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(moveMouseEventArs);
            touchTestObj.endEvent(movedEnd);
            //Asserts
            expect(direction).toBe('Up');
            expect(tEvents.swipe).toHaveBeenCalled();
            expect(tEvents.scroll).toHaveBeenCalled();
            expect(tEvents.tapEvent).not.toHaveBeenCalled();
            expect(tEvents.tapHold).not.toHaveBeenCalled();
        });

        it('swipe callback test on swipe direction right.', () => {
            let movedEnd: CommonArgs = moveMouseEventArs;
            movedEnd.type = 'touchend';
            movedEnd.clientX = 400;
            //Actions
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(moveMouseEventArs);
            touchTestObj.endEvent(movedEnd);
            //Asserts
            expect(direction).toBe('Right');
            expect(tEvents.swipe).toHaveBeenCalled();
            expect(tEvents.scroll).toHaveBeenCalled();
            expect(tEvents.tapEvent).not.toHaveBeenCalled();
            expect(tEvents.tapHold).not.toHaveBeenCalled();
        });

        it('swipe callback test on swipe left', () => {
            let movedEnd: CommonArgs = moveMouseEventArs;
            movedEnd.clientX = 100;
            movedEnd.clientY = 200;
            //Actions
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(movedEnd);
            touchTestObj.endEvent(movedEnd);
            //Asserts
            expect(direction).toBe('Left');
            expect(tEvents.swipe).toHaveBeenCalled();
            expect(tEvents.scroll).toHaveBeenCalled();
            expect(tEvents.tapEvent).not.toHaveBeenCalled();
            expect(tEvents.tapHold).not.toHaveBeenCalled();
        });

        it('swipe event callback test without handler.', () => {
            let movedEnd: CommonArgs = moveMouseEventArs;
            movedEnd.clientX = 100;
            movedEnd.clientY = 200;
            touchTestObj.swipe = undefined;
            //Actions
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(movedEnd);
            touchTestObj.endEvent(movedEnd);
            //Asserts
            expect(tEvents.swipe).not.toHaveBeenCalled();
            expect(tEvents.scroll).toHaveBeenCalled();
            expect(tEvents.tapEvent).not.toHaveBeenCalled();
            expect(tEvents.tapHold).not.toHaveBeenCalled();
            touchTestObj.addEventListener('swipe', (e: SwipeEventArgs) => { tEvents.swipe(e); });
        });
    });



    describe('Scroll event', () => {

        it('event handler callback on scroll', () => {
            let movedEnd: CommonArgs = moveMouseEventArs;
            movedEnd.type = 'touchend';
            let moveArgs: CommonArgs = moveMouseEventArs;
            moveArgs.clientY = 300;
            let scrollFn: jasmine.Spy = jasmine.createSpy('scrollEvt');
            touchTestObj.scroll = scrollFn;
            //Actions
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(moveArgs);
            touchTestObj.endEvent(movedEnd);
            expect(scrollFn).toHaveBeenCalled();
        });

        it('scroll event callback test on vertical scrolling.', () => {
            touchTestObj.scroll = () => { tEvents.scroll(); };
            let movedEnd: CommonArgs = moveMouseEventArs;
            movedEnd.type = 'touchend';
            let moveArgs: CommonArgs = moveMouseEventArs;
            moveArgs.clientY = 300;
            //Actions
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(moveArgs);
            touchTestObj.endEvent(movedEnd);
            expect(tEvents.scroll).toHaveBeenCalled();
        });

        it('scroll event callback test on vertical scrolling.', () => {
            let movedEnd: CommonArgs = moveMouseEventArs;
            movedEnd.type = 'touchend';
            let moveArgs: CommonArgs = moveMouseEventArs;
            moveArgs.clientY = 300;
            //Actions
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(moveArgs);
            touchTestObj.endEvent(movedEnd);
            expect(tEvents.scroll).toHaveBeenCalled();
        });

        it('scroll event callback test on horizontal scrolling.', () => {
            let movedEnd: CommonArgs = moveMouseEventArs;
            movedEnd.type = 'touchend';
            let moveArgs: CommonArgs = moveMouseEventArs;
            moveArgs.clientX = 300;
            //Actions
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(moveArgs);
            touchTestObj.endEvent(movedEnd);
            expect(tEvents.scroll).toHaveBeenCalled();
        });

        it('scroll event callback test on without move action.', () => {
            //Actions
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(startMouseEventArs);
            touchTestObj.endEvent(startMouseEventArs);
            expect(tEvents.scroll).not.toHaveBeenCalled();
        });

        it('left and right scroll direction', () => {
            let movedEnd: CommonArgs = moveMouseEventArs;
            movedEnd.type = 'touchend';
            let moveArgs: CommonArgs = moveMouseEventArs;
            let direction: string = '';
            moveArgs.clientX = 400;
            touchTestObj.scroll = (e: any) => {
                direction = e.scrollDirection;
            };
            //Actions
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(moveArgs);
            touchTestObj.endEvent(movedEnd);
            expect(direction).toBe('Right');

            moveArgs.clientX = 50;
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(moveArgs);
            touchTestObj.endEvent(movedEnd);
            expect(direction).toBe('Left');
        });

        it('scroll event callback test without handler.', () => {
            let movedEnd: CommonArgs = moveMouseEventArs;
            movedEnd.type = 'touchend';
            let moveArgs: CommonArgs = moveMouseEventArs;
            moveArgs.clientX = 300;
            //Actions
            touchTestObj.scroll = undefined;
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.moveEvent(moveArgs);
            touchTestObj.endEvent(movedEnd);
            expect(tEvents.scroll).not.toHaveBeenCalled();
            touchTestObj.addEventListener('scroll', () => { tEvents.scroll(); });
        });
    });

    describe('TapHold event', () => {

        beforeEach((done: Function): void => {
            touchTestObj.startEvent(startMouseEventArs);
            setTimeout(
                () => {
                    done();
                },
                750);
        });

        it('taphold event callback with handler', () => {
            expect(tEvents.tapHold).not.toHaveBeenCalled();
            expect(tEvents.tapEvent).not.toHaveBeenCalled();
            expect(tEvents.swipe).not.toHaveBeenCalled();
            expect(tEvents.scroll).not.toHaveBeenCalled();
        });
    });
    describe('TapHold event', () => {
        beforeEach((done: Function): void => {
            touchTestObj.tapHold = () => { tEvents.tapHold(); };
            touchTestObj.startEvent(startMouseEventArs);
            setTimeout(
                () => {
                    done();
                },
                750);
        });

        it('taphold event callback with handler', () => {
            expect(tEvents.tapHold).toHaveBeenCalled();
            expect(tEvents.tapEvent).not.toHaveBeenCalled();
            expect(tEvents.swipe).not.toHaveBeenCalled();
            expect(tEvents.scroll).not.toHaveBeenCalled();
        });
    });

    describe('Touch cancel event', () => {
        beforeEach((done: Function): void => {
            touchTestObj.tapHold = () => { tEvents.tapHold(); };
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.cancelEvent(startMouseEventArs);
            setTimeout(
                () => {
                    done();
                },
                750);
        });

        it('cancel event callback with handler', () => {
            expect(tEvents.tapHold).not.toHaveBeenCalled();
            expect(tEvents.tapEvent).not.toHaveBeenCalled();
            expect(tEvents.swipe).not.toHaveBeenCalled();
            expect(tEvents.scroll).not.toHaveBeenCalled();
            expect(tEvents.cancel).not.toHaveBeenCalled();
        });
    });

    describe('swipe trigger during cancel event', () => {
        beforeEach((done: Function): void => {
            touchTestObj.tapHold = () => { tEvents.tapHold(); };
            touchTestObj.startEvent(startMouseEventArs);
            touchTestObj.cancelEvent(moveMouseEventArs);
            setTimeout(
                () => {
                    done();
                },
                750);
        });

        it('cancel event callback', () => {
            expect(tEvents.tapHold).not.toHaveBeenCalled();
            expect(tEvents.tapEvent).not.toHaveBeenCalled();
            expect(tEvents.swipe).toHaveBeenCalled();
            expect(tEvents.scroll).not.toHaveBeenCalled();
            expect(tEvents.cancel).not.toHaveBeenCalled();
        });
    });

    describe('Tap event', () => {
        let tapFn: jasmine.Spy = jasmine.createSpy('tapEvent');
        beforeEach((done: Function): void => {
            touchTestObj.tap = tapFn;
            TapEventTest(done, 500);
        });
        it('event handler for tap event', () => {
            expect(tapFn).toHaveBeenCalled();
        });

        beforeEach((done: Function): void => {
            touchTestObj.tap = () => { tEvents.tapEvent(); };
            TapEventTest(done, 500);
        });
        it('tap event callback 500ms delay with doubletap.', () => {
            expect(tEvents.tapEvent).toHaveBeenCalled();
            expect(tEvents.tapHold).not.toHaveBeenCalled();
            expect(tEvents.swipe).not.toHaveBeenCalled();
            expect(tEvents.scroll).not.toHaveBeenCalled();
        });

        beforeEach((done: Function): void => {
            TapEventTest(done, 0);
        });
        it('tap event callback 0ms delay without doubletap.', () => {
            expect(tEvents.tapEvent).toHaveBeenCalled();
            expect(tEvents.tapHold).not.toHaveBeenCalled();
            expect(tEvents.swipe).not.toHaveBeenCalled();
            expect(tEvents.scroll).not.toHaveBeenCalled();
        });
    });

    describe('Tap Count', () => {
        let tapCount: number = 0;
        let tapFn = jasmine.createSpy('tapEvent');
        beforeEach((done: Function): void => {
            tapCount++;
            touchTestObj.tap = tapFn;
            TapEventTest(done, 500);
        });

        it('Count for tap event', () => {
            expect(tapFn).toHaveBeenCalled();
        });
    });

    describe('Changed touches', () => {
        it('changed touches event argument', () => {
            let startEvt: CommonArgs = { changedTouches: [startMouseEventArs], preventDefault: (): void => { /** No Code */ } };
            let moveEvt: CommonArgs = { changedTouches: [moveMouseEventArs], preventDefault: (): void => { /** No Code */ } };
            //Actions
            touchTestObj.startEvent(startEvt);
            touchTestObj.moveEvent(moveEvt);
            touchTestObj.endEvent(moveEvt);
            //Asserts
            expect(tEvents.swipe).toHaveBeenCalled();
            expect(tEvents.scroll).toHaveBeenCalled();
            expect(tEvents.tapEvent).not.toHaveBeenCalled();
            expect(tEvents.tapHold).not.toHaveBeenCalled();
        });
    });

    describe('Method event', () => {
        it('destroy class test', () => {
            let ele: HTMLElement = createElement('div', { id: 'test' });
            let objTouch: Touch = new Touch(ele);
            objTouch.tapHoldThreshold = 650;
            expect(ele.classList.contains('e-touch')).toEqual(true);
            objTouch.destroy();
            expect(ele.classList.contains('e-touch')).toEqual(false);
        });
    });
    describe('swipe while scroll', () => {
        let inst: any;
        let element: HTMLElement;
        let spy: jasmine.Spy;
        let spy1: jasmine.Spy;
        beforeAll(() => {
            element = createElement('div', {
                // tslint:disable-next-line:no-multiline-string
                id: 'test', innerHTML: `Swipe while scroll
                India is a vast South Asian<br>
                Capital: New Delhi<br>
                President: Pranab Mukherjee<br>
                Prime minister: Narendra Modi<br>
                Population: 1.252 billion (2013) World Bank<br>
                Currency: Indian rupee<br>
                Gross domestic product: 1.877 trillion USD (2013) World Bank

                India is a vast South Asian country with<br>
                Capital: New Delhi<br>
                President: Pranab Mukherjee<br>
                Prime minister: Narendra Modi<br>
                Population: 1.252 billion (2013) World Bank<br>
                Currency: Indian rupee<br>
                Gross domestic product: 1.877 trillion USD (2013) World Bank
                India is a vast South Asian<br>
                Capital: New Delhi<br>
                President: Pranab Mukherjee<br>
                Prime minister: Narendra Modi<br>
                Population: 1.252 billion (2013) World Bank<br>
                Currency: Indian rupee<br>
                Gross domestic product: 1.877 trillion USD (2013) World Bank`,
                styles: 'overflow:auto;width:250px;height:350px'
            });
            document.body.appendChild(element);
            inst = new Touch(element, {});
        });
        beforeEach(() => {
            spy = jasmine.createSpy('testSpy');
            spy1 = jasmine.createSpy('tSpy');
        });
        afterAll(() => {
            let child: HTMLElement = document.getElementById('test');
            document.removeChild(child);
        });
        it('no swipe - Up', () => {
            inst.swipe = spy;
            inst.scroll = spy1;
            let startEvt: CommonArgs = {
                clientX: 100, clientY: 450, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            let moveEvt: CommonArgs = {
                clientX: 100, clientY: 400, target: node, type: 'touchmove',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            //Actions
            inst.startEvent(startEvt);
            inst.moveEvent(moveEvt);
            inst.endEvent(moveEvt);
            //Asserts
            expect(spy).not.toHaveBeenCalled();
            expect(spy1).toHaveBeenCalled();
        });
        it('no swipe - Down', () => {
            inst.swipe = spy;
            inst.scroll = spy1;
            let startEvt: CommonArgs = {
                clientX: 100, clientY: 400, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            let moveEvt: CommonArgs = {
                clientX: 100, clientY: 420, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            //Actions
            inst.startEvent(startEvt);
            inst.moveEvent(moveEvt);
            inst.endEvent(moveEvt);
            //Asserts
            expect(spy).not.toHaveBeenCalled();
            expect(spy1).toHaveBeenCalled();
        });
        it('no swipe - Left', () => {
            inst.swipe = spy;
            inst.scroll = spy1;
            let startEvt: CommonArgs = {
                clientX: 150, clientY: 450, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            let moveEvt: CommonArgs = {
                clientX: 100, clientY: 450, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            //Actions
            inst.startEvent(startEvt);
            inst.moveEvent(moveEvt);
            inst.endEvent(moveEvt);
            //Asserts
            expect(spy).not.toHaveBeenCalled();
            expect(spy1).toHaveBeenCalled();
        });
        it('no swipe - Right', () => {
            inst.swipe = spy;
            inst.scroll = spy1;
            let startEvt: CommonArgs = {
                clientX: 100, clientY: 450, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            let moveEvt: CommonArgs = {
                clientX: 150, clientY: 450, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            //Actions
            inst.startEvent(startEvt);
            inst.moveEvent(moveEvt);
            inst.endEvent(moveEvt);
            //Asserts
            expect(spy).not.toHaveBeenCalled();
            expect(spy1).toHaveBeenCalled();
        });
        it('swipe - Up', () => {
            inst.swipe = spy;
            let startEvt: CommonArgs = {
                clientX: 100, clientY: 470, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            let moveEvt: CommonArgs = {
                clientX: 100, clientY: 410, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            //Actions
            inst.startEvent(startEvt);
            inst.moveEvent(moveEvt);
            inst.endEvent(moveEvt);
            //Asserts
            expect(spy).toHaveBeenCalled();
        });
        it('swipe - Down', () => {
            inst.swipe = spy;
            let startEvt: CommonArgs = {
                clientX: 100, clientY: 410, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            let moveEvt: CommonArgs = {
                clientX: 105, clientY: 470, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            //Actions
            inst.startEvent(startEvt);
            inst.moveEvent(moveEvt);
            inst.endEvent(moveEvt);
            //Asserts
            expect(spy).toHaveBeenCalled();
        });
        it('swipe - Right', () => {
            inst.swipe = spy;
            let startEvt: CommonArgs = {
                clientX: 100, clientY: 450, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            let moveEvt: CommonArgs = {
                clientX: 170, clientY: 450, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            //Actions
            inst.startEvent(startEvt);
            inst.moveEvent(moveEvt);
            inst.endEvent(moveEvt);
            //Asserts
            expect(spy).toHaveBeenCalled();
        });
        it('swipe - Left', () => {
            inst.swipe = spy;
            let startEvt: CommonArgs = {
                clientX: 170, clientY: 450, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            let moveEvt: CommonArgs = {
                clientX: 100, clientY: 450, target: node, type: 'touchstart',
                preventDefault: (): void => { /** Do Nothing */ }
            };
            //Actions
            inst.startEvent(startEvt);
            inst.moveEvent(moveEvt);
            inst.endEvent(moveEvt);
            //Asserts
            expect(spy).toHaveBeenCalled();
        });
    });
});
