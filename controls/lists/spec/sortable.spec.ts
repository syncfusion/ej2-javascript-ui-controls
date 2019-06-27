import { Sortable } from '../src/sortable/index';
import { createElement, remove, EventHandler, getComponent, Draggable } from '@syncfusion/ej2-base';
import { profile , inMB, getMemoryProfile } from './common.spec';

function setMouseCordinates(eventarg: any, x: number, y: number): Object {
    eventarg.pageX = x;
    eventarg.pageY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    return eventarg;
}
function copyObject(source: any, destination: any): Object {
    for (let prop in source) {
        destination[prop] = source[prop];
    }
    return destination;
}
function getEventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {}) as any;
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

/**
 * @param  {} 'Sortable'
 * @param  {} function(
 */
describe('Sortable', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); // skips test (in Chai)
            return;
        }
    });
    afterAll(() => {
        document.body.innerHTML = null;
    })
    let sortable: any;
    let element: HTMLElement = createElement('div');
    for (let i: number = 0; i < 8; i++) {
        element.appendChild(createElement('div'));
    }
    document.body.appendChild(element);
    describe('DOM', () => {
        afterEach(() => {
            sortable.destroy();
        });
        it('Default - without item class', () => {
            sortable = new Sortable(element, {});
            expect(element.classList.contains('e-sortable')).toBeTruthy();
            expect(element.firstElementChild.classList.contains('e-sort-item')).toBeTruthy();
        });
        it('Default - with item class', () => {
            for (let i: number = 0; i < 8; i++) {
                element.children[i].classList.add('e-item');
            }
            sortable = new Sortable(element, { itemClass: 'e-item' });
            expect(element.firstElementChild.classList.contains('e-item')).toBeTruthy();
            expect(element.firstElementChild.getAttribute('tabindex')).toEqual(null);
        });
    });
    describe('Property', () => {
        afterEach(() => {
            sortable.destroy();
        });
        it('itemClass', () => {
            sortable = new Sortable(element, { itemClass: 'e-item' });
            expect(element.firstElementChild.classList.contains('e-item')).toBeTruthy();
            expect(sortable.itemClass).toEqual('e-item');
        });
        it('enableAnimation', () => {
            sortable = new Sortable(element, { enableAnimation: true });
            expect(sortable.enableAnimation).toEqual(true);
        });
        it('scope', () => {
            sortable = new Sortable(element, { scope: 'list' });
            expect(sortable.scope).toEqual('list');
        });
    });
    describe('Actions', () => {
        afterEach(() => {
            sortable.destroy();
        });
        let mousedown: any; let mousemove: any; let mouseUp: any; let dragStartEvent: jasmine.Spy;
        beforeEach(() => { 
            mousedown= getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCordinates(mousedown, 17, 13);
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCordinates(mousemove, 17, 40);
            mousedown.target = mousedown.currentTarget = element;
        });
        it('Sorting from different target', () => {
            sortable = new Sortable(element, { itemClass: 'e-item' });
            EventHandler.trigger(element, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.body;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.body;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.body;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
        });
        it('Sorting within same element', () => {
            sortable = new Sortable(element, { itemClass: 'e-item' });
            EventHandler.trigger(element, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[0];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 50, 50);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[0];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = element.children[0];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
        });
        it('Sorting mulitiple times', () => {
            sortable = new Sortable(element, { itemClass: 'e-item', placeHolder: function(args: any) {
                return args.target.cloneNode(true);
            } });
            EventHandler.trigger(element, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[0];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 50, 50);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[3];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 40, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[2];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 60, 90);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[5];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = element.children[5];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
        });
    });
    describe('Property - callback functions', () => {
        let mousedown: any; let mousemove: any; let mouseUp: any; let dragStartEvent: jasmine.Spy;
        beforeEach(() => { 
            mousedown= getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCordinates(mousedown, 17, 13);
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCordinates(mousemove, 17, 40);
            mousedown.target = mousedown.currentTarget = element;
            dragStartEvent = jasmine.createSpy('dragStart');
        });
        afterEach(() => {
            sortable.destroy();
        });
        it('helper', () => {
            sortable = new Sortable(element, { itemClass: 'e-item', dragStart: dragStartEvent });
            EventHandler.trigger(element, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[1];
            sortable.helper = (args: any): HTMLElement => {
                expect(args.element).toEqual(sortable.element);
                expect(args.sender).toEqual(element.children[1]);
                return args.sender.cloneNode(true) as HTMLElement;
            }
            EventHandler.trigger(element, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[1];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(dragStartEvent).toHaveBeenCalled();
            remove(element.querySelector('.e-sortableclone'));
        });
        it('placeHolder', () => {
            sortable = new Sortable(element, { itemClass: 'e-item', dragStart: dragStartEvent, placeHolder: (args: any): HTMLElement => {
                expect(args.element).toEqual(sortable.element);
                expect(args.grabbedElement).toEqual(element.children[1]);
                expect(args.target).toEqual(mousemove.toElement);
                return args.target.cloneNode(true);
            } });
            EventHandler.trigger(element, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[1];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 50, 50);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[0];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = element.children[0];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect(dragStartEvent).toHaveBeenCalled();
        });
    });
    describe('Combined sortable', () => {
        let mousedown: any; let mousemove: any; let mouseUp: any; let dragEndEvent: jasmine.Spy;
        let element2: HTMLElement = createElement('div', { id: 'sortable2' });
        document.body.appendChild(element2);
        beforeEach(() => { 
            mousedown= getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCordinates(mousedown, 17, 13);
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCordinates(mousemove, 17, 40);
            mousedown.target = mousedown.currentTarget = element;
            dragEndEvent = jasmine.createSpy('dragEnd');
        });
        afterEach(() => {
            sortable.destroy();
        });
        it('With empty sortable', () => {
            sortable = new Sortable(element, { itemClass: 'e-item', drop: dragEndEvent, scope: 'combined' });
            let sortable2: any = new Sortable(element2, { itemClass: 'e-item2', scope: 'combined' });
            expect(sortable2.element.childElementCount).toEqual(0);
            EventHandler.trigger(element, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[1];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 50, 50);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element2;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = element2;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect(sortable2.element.childElementCount).toEqual(1);
            expect(dragEndEvent).toHaveBeenCalled();
            sortable2.destroy();
        });
        it('Between two sortables', () => {
            sortable = new Sortable(element, { itemClass: 'e-item', dragStart: dragEndEvent, scope: 'combined' });
            for (let i: number = 0; i < 5; i++) {
                element2.appendChild(createElement('div', { className: 'e-item2' }));
            }
            let sortable2: any = new Sortable(element2, { itemClass: 'e-item2', scope: 'combined' });
            expect(sortable2.element.childElementCount).toEqual(6);
            EventHandler.trigger(element, 'mousedown', mousedown);
            let target: Element = element.children[1];
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[1];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 50, 50);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element2.children[2];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = element2.children[2];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect(sortable2.element.childElementCount).toEqual(7);
            expect(sortable2.element.children[2]).toEqual(target);
            expect(dragEndEvent).toHaveBeenCalled();
            element.appendChild(createElement('div'));
            sortable2.destroy();
        });
        it('Between two sortables - append to last element', () => {
            sortable = new Sortable(element, { itemClass: 'e-item', dragStart: dragEndEvent, scope: 'combined', placeHolder: function(args: any) {
                return args.target.cloneNode(true);
            } });
            let sortable2: any = new Sortable(element2, { itemClass: 'e-item2', scope: 'combined', placeHolder: function(args: any) {
                return args.target.cloneNode(true);
            }});
            EventHandler.trigger(element, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[1];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 50, 50);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element2.children[6];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mousemove = setMouseCordinates(mousemove, 100, 100);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.body;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.body;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect(dragEndEvent).toHaveBeenCalled();
            sortable2.destroy();
            remove(element2);
        });
    });
    describe('Disabled support', () => {
        let mousedown: any; let mousemove: any; let mouseUp: any; let dragEndEvent: jasmine.Spy;
        let element2: HTMLElement = createElement('div', { id: 'sortable2' });
        it('With empty sortable', () => {
            element.appendChild(createElement('div'));
            for (let i: number = 0; i < 7; i++) {
                element.children[i].classList.remove('e-item');
                if (i === 2 || i === 4 || i === 6) {
                    element.children[i].classList.add('e-disabled');
                }
            }
            mousedown= getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCordinates(mousedown, 17, 13);
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCordinates(mousemove, 17, 40);
            mousedown.target = mousedown.currentTarget = element;
            dragEndEvent = jasmine.createSpy('dragEnd');
            sortable = new Sortable(element, { drop: dragEndEvent });
            EventHandler.trigger(element, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[1];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 50, 50);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[5];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = element.children[5];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect(dragEndEvent).toHaveBeenCalled();
            sortable.destroy();
            [2, 4, 6].forEach((idx: number) => {
                element.children[idx].classList.remove('e-disabled');
            });
        });
    });
    describe('Events', () => {
        let mousedown: any; let mousemove: any; let mouseUp: any;
        beforeEach(() => { 
            mousedown= getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCordinates(mousedown, 17, 13);
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCordinates(mousemove, 17, 40);
            mousedown.target = mousedown.currentTarget = element;
        });
        afterEach(() => {
            sortable.destroy();
        });
        it('dragStart', () => {
            sortable = new Sortable(element, {
                dragStart: (args: any)  => {
                    expect(args.element).toEqual(sortable.element);
                    expect(args.event.type).toEqual('mousemove');
                    expect(args.target).toEqual(mousemove.toElement);
                }
            });
            EventHandler.trigger(element, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[3];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            remove(element.querySelector('.e-sortableclone'));
        });
        it('drag', () => {
            sortable = new Sortable(element, {
                drag: (args: any)  => {
                    expect(args.element).toEqual(sortable.element);
                    expect(args.event.type).toEqual('mousemove');
                    expect(args.target).toEqual(mousemove.toElement);
                }
            });
            EventHandler.trigger(element, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[1];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 50, 50);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[2];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            remove(element.querySelector('.e-sortableclone'));
        });
        it('Drop - without placeholder', () => {
            sortable = new Sortable(element, {
                drop: (args: any) => {
                    expect(args.element).toEqual(sortable.element);
                    expect(args.event.type).toEqual('mousemove');
                    expect(args.target).toEqual(mousemove.toElement);
                    expect(args.previousIndex).toEqual(1);
                    expect(args.currentIndex).toEqual(2);
                    expect(args.helper).toEqual(element.querySelector('.e-sortableclone'));
                    expect(args.droppedElement).toEqual(element.children[2]);
                    expect(args.scope).toEqual(null);
                }
            });
            EventHandler.trigger(element, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[1];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 50, 50);
            mousemove.srcElement = mousemove.target = mousemove.toElement = element.children[2];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = element.children[2];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            (getComponent(element, Draggable) as any).intDestroy(mousemove);
        });
    });
    describe('onPropertyChanged', () => {
        it('itemClass', () => {
            sortable = new Sortable(element);
            expect(element.firstElementChild.classList.contains('e-sort-item')).toBeTruthy();
            sortable.itemClass = 'new-item';
            sortable.dataBind();
            expect(element.firstElementChild.classList.contains('e-sort-item')).toBeFalsy();
            expect(element.firstElementChild.classList.contains('new-item')).toBeTruthy();
            sortable.itemClass = '';
            sortable.dataBind();
            expect(element.firstElementChild.classList.contains('new-item')).toBeFalsy();
            sortable.destroy();
        });
    });
    describe('methods', () => {
        it('destroy method', () => {
            sortable = new Sortable(element, {});
            sortable.destroy();
            expect(element.classList.contains('e-sortable')).toBeFalsy();
        });
        it('getModuleName method', () => {
            sortable = new Sortable(element, {});
            expect(sortable.getModuleName()).toEqual('sortable');
            sortable.destroy();
        });
        it('moveTo - Within element', () => {
            sortable = new Sortable(element, {});
            let targetElement: Element = sortable.element.firstElementChild;
            // Before sorted.
            expect(sortable.getIndex(targetElement)).toEqual(0);
            sortable.moveTo(null, [0, 3, 6]);
            // After sorted.
            expect(sortable.getIndex(targetElement)).toEqual(5);
            targetElement = sortable.element.children[5];
            // Before sorted.
            expect(sortable.getIndex(targetElement)).toEqual(5);
            sortable.moveTo(null, [5, 7], 2);
            expect(sortable.getIndex(targetElement)).toEqual(2);
            // After sorted.
            sortable.destroy();
        });
        it('moveTo - Between different element', () => {
            let element2: any = createElement('div');
            document.body.appendChild(element2);
            sortable = new Sortable(element, {});
            let sortable2 = new Sortable(element2, {});
            expect(sortable.element.childElementCount).toEqual(8);
            expect(sortable2.element.childElementCount).toEqual(0);
            sortable.moveTo(sortable2.element);
            expect(sortable.element.childElementCount).toEqual(0);
            expect(sortable2.element.childElementCount).toEqual(8);
            sortable.destroy(); sortable2.destroy();
            remove(element2);
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        // check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        // check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});