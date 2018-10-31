/**
 * draggable spec.
 */
import { Draggable } from '../src/draggable';
import { createElement } from '../src/dom';
import { extend } from '../src/util';
import { EventHandler } from '../src/event-handler';
import { Droppable } from '../src/droppable';
import { Touch } from '../src/touch';
const eventstr: string = '__eventList';
let element: HTMLElement;
/* tslint:disable */
function copyObject(source: Object, destiation: Object): Object {
    for (let prop in source) {
        destiation[prop] = source[prop];
    }
    return destiation;
}
function getElement(id?: string, style?: string, ihtml?: string): HTMLElement {
    var element = createElement('div', {
        id: !id ? 'drag1' : id, innerHTML: !ihtml ? '<div id="outer"><P>Draggable Text</P></div>' : ihtml,
        styles: !style ? 'border:1px solid black;width:300px;height:150px' : style, className: 'common'
    });
    document.body.appendChild(element);
    return element;
}
function setMouseCordinates(eventarg: any, x: number, y: number): Object {
    eventarg.pageX = x;
    eventarg.pageY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    return eventarg;
}
/* tslint:enable */
export function getEventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}
describe('draggable', () => {
    describe('Initialize of draggable', () => {
        let instance: Draggable;
        let eventlist: any;
        let events: any;
        let evt: string[] = ['touchstart', 'mousedown'];
        beforeAll(() => {
            element = getElement();
            instance = new Draggable(element);
            eventlist = element[eventstr];
            events = eventlist.events || [];
        });
        it('class name', () => {
            expect(element.classList.contains('e-control')).toBe(true);
            expect(element.classList.contains('e-draggable')).toBe(true);
        });
        it('check Event bind', () => {
            for (let i: number = 0; i < events.length; i++) {
                let result: boolean = evt.indexOf(events[i].name) !== -1;
                expect(result).toEqual(true);
            }
        });
        it('check element instance', () => {
            expect((<any>element).ej2_instances[0].constructor.name).toBe('Draggable');
        });
        afterAll(() => {
            element.remove();
        });
    });
    describe('Check Mousedown event', () => {
        let mousedown: any = getEventObject('MouseEvents', 'mousedown');
        mousedown.pageX = 8;
        mousedown.pageY = 9;
        mousedown.clientX = 8;
        mousedown.clientY = 9;
        mousedown.screenX = 8;
        mousedown.screenY = 75;
        window['browserDetails'].isIE = false;
        beforeEach(() => {
            element = getElement();
            mousedown.target = mousedown.currentTarget = element;
        });
        it('Mouse down event with no handle,abort and default clone  option ', () => {
            let instance: any = new Draggable(element);
            mousedown.target = mousedown.currentTarget = element;
            EventHandler.trigger(element, 'mousedown', mousedown);
            expect(instance.initialPosition).toEqual({ x: 8, y: 9 });
            expect(instance.relativeXPosition).toBeUndefined();
            expect(instance.relativeYPosition).toBeUndefined();
            instance.intDestroy(mousedown);
        });
        ///EJ2-4640-click event not triggered issue fixed.
        it('Mouse down event not preventing the click event  ', () => {
            let instance: any = new Draggable(element);
            let clickSpy: jasmine.Spy = jasmine.createSpy('click');
            element.addEventListener('click', clickSpy);
            mousedown.target = mousedown.currentTarget = element;
            mousedown.changedTouches = [{}, {}];
            let click: any = getEventObject('MouseEvents', 'clcik');
            click.srcElement = click.target = click.toElement = element;
            EventHandler.trigger(element, 'mousedown', mousedown);
            element.click();
            expect(clickSpy).toHaveBeenCalled();
            instance.intDestroy(mousedown);
        });
        it('Mouse down with handle option and target as the handle element', () => {
            let instance: any = new Draggable(element, { handle: 'p' });
            let elem: Element = element.getElementsByTagName('p')[0];
            mousedown.target = mousedown.currentTarget = elem;
            EventHandler.trigger(elem as HTMLElement, 'mousedown', mousedown);
            expect(instance.initialPosition).toEqual({ x: 8, y: 9 });
            instance.intDestroy(mousedown);
        });
        it('Mouse down with handle option and target as the handle element', () => {
            document.body.appendChild(createElement('p',{className:'external'}))
            let instance: any = new Draggable(element, { handle: 'p' });
            let elem: Element = document.getElementsByTagName('p')[1];
            mousedown.target = mousedown.currentTarget = elem;
            EventHandler.trigger(elem as HTMLElement, 'mousedown', mousedown);
            expect(instance.initialPosition).toEqual(undefined);
            instance.intDestroy(mousedown);
        });
        it('Mouse down with handle option and target as the inner element of handle element', () => {
            let instance: any = new Draggable(element, { handle: '#outer' });
            let elem: Element = document.getElementsByTagName('p')[0];
            mousedown.target = mousedown.currentTarget = elem;
            EventHandler.trigger(document.getElementById('outer'), 'mousedown', mousedown);
            expect(instance.initialPosition).toEqual({ x: 8, y: 9 });
            instance.intDestroy(mousedown);
        });
        it('Mouse down with handle option and target as the parent element', () => {
            let instance: any = new Draggable(element, { handle: 'p' });
            mousedown.target = mousedown.currentTarget = element;
            EventHandler.trigger(element, 'mousedown', mousedown);
            expect(instance.initialPosition).toBe(undefined);
        });
        it('Mouse down with handle option and invalid target selector', () => {
            let instance: any = new Draggable(element, { handle: '#td', enableTailMode:true });
            mousedown.target = mousedown.currentTarget = element;
            EventHandler.trigger(element, 'mousedown', mousedown);
            expect(instance.initialPosition).toEqual({ x: 8, y: 9 });
        });
        it('Mouse down with abort option and target as the aborted element', () => {
            let instance: any = new Draggable(element, { abort: 'p' });
            mousedown.target = mousedown.currentTarget = document.getElementsByTagName('p')[0];
            EventHandler.trigger(element, 'mousedown', mousedown);
            expect(instance.initialPosition).toBe(undefined);
            instance.intDestroy(mousedown);
        });
        it('Mouse down with abort option and target as the parent element', () => {
            let instance: any = new Draggable(element, { abort: 'p' });
            mousedown.target = mousedown.currentTarget = element;
            EventHandler.trigger(element, 'mousedown', mousedown);
            expect(instance.initialPosition).toEqual({ x: 8, y: 9 });
            instance.intDestroy(mousedown);
        });
        it('Mouse down without clone option stores the relative position of element', () => {
            let instance: any = new Draggable(element, { enableTailMode:true,clone: false });
            mousedown.target = mousedown.currentTarget = element;
            EventHandler.trigger(element, 'mousedown', mousedown);
            expect(instance.relativeXPosition).not.toBeUndefined();
            expect(instance.relativeYPosition).not.toBeUndefined();
            instance.intDestroy(mousedown);
        });
        afterEach(() => {
            element.remove();
            document.body.innerHTML = '';
        });
    });
    describe('check MouseMove event', () => {
        let mousedown: any = getEventObject('MouseEvents', 'mousedown');
        mousedown = setMouseCordinates(mousedown, 17, 13);
        let mousemove: any;
        beforeEach(() => {
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCordinates(mousemove, 17, 14);
        });
        describe('Drag Start', () => {
            let instance: any;
            let dragstartEvent: jasmine.Spy;
            beforeEach(() => {
                element = getElement();
                mousedown.target = mousedown.currentTarget = element;
                dragstartEvent = jasmine.createSpy('dragStart');
                instance = new Draggable(element, { clone: false, dragStart: dragstartEvent, dragArea: '#ss' });
                EventHandler.trigger(element, 'mousedown', mousedown);
                mousemove.srcElement = mousemove.targetElement = mousemove.toElement = element;
            });
            it('Check aria-grabbed attribute is added to the draggable element', () => {
                expect(instance.element.getAttribute('aria-grabbed')).toBe('true');
                instance.intDestroy(mousedown);
            });
            it('Drag start movement called properly based on the distance moved and without element cloning', () => {
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(document.body.classList.contains('e-prevent-select')).toBe(true);
                expect(dragstartEvent).toHaveBeenCalled();
                instance.intDestroy(mousedown);
            });
            it('Drag start movement called properly based on the distance moved and without element cloning', () => {
                instance.clone = true;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(dragstartEvent).toHaveBeenCalled();
                instance.intDestroy(mousedown);
                expect(document.body.classList.contains('e-prevent-select')).toBe(false);
            });
            it('Drag start with helper property works properly', () => {
                instance.clone = true;
                instance.helper = () => {
                    let ele: HTMLElement = document.createElement('div');
                    ele.innerHTML = 'Helper element';
                    return ele;
                };
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(dragstartEvent).toHaveBeenCalled();
                instance.intDestroy(mousedown);
            });
            it('Drag start with helper property returns the proper target element', () => {
                let temp: Element;
                let ele: HTMLElement = document.createElement('div');
                ele.innerHTML = 'Helper element';
                instance.clone = true;
                instance.helper = () => {
                    document.body.appendChild(ele);
                    return ele;
                };
                instance.dragStart = (e: any) => {
                    temp = e.target;
                };
                mousemove.target = ele;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(temp).not.toEqual(ele);
                instance.intDestroy(mousedown);
            });
            it('Drag start with helper property works properly', () => {
                instance.clone = true;
                instance.helper = (): HTMLElement => {
                    return null;
                };
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(dragstartEvent).not.toHaveBeenCalled();
                instance.intDestroy(mousedown);
            });
            it('Drag start movement prevented if distance moved is lesser than model distance value ', () => {
                mousemove = setMouseCordinates(mousemove, 17, 13);
                instance.dragArea = undefined;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(dragstartEvent).not.toHaveBeenCalled();
                instance.intDestroy(mousedown);
            });
            it('Drag start event not triggered while model value is not set ', () => {
                instance.dragArea = instance.dragStart = undefined;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(dragstartEvent).not.toHaveBeenCalled();
                instance.intDestroy(mousedown);
            });

            afterEach(() => {
                element.remove();
            });
        });
        describe('drag start with position attributes', () => {
            let ele: Element;
            let mElement: HTMLElement;
            let inst: any;
            let dragsEvent: jasmine.Spy;
            let mdown: any = getEventObject('MouseEvents', 'mousedown');
            let mmove: any;
            beforeAll(() => {
                let str: string = `<div id='dragarea' tabindex='1' style='border:1px solid magenta;height:400px;width:500px;position:absolute'>
                         <div id ='dragEle' style='border:1px solid blue;height:40px;width:80px'>"
                        Draggable
                        </div> </div>`;
                mElement = getElement('outer', null, str);
                mdown = setMouseCordinates(mdown, 17, 13);
                mmove = getEventObject('MouseEvents', 'mousemove');
                mmove = setMouseCordinates(mousemove, 17, 14);
                ele = mElement.querySelector('#dragEle');
                dragsEvent = jasmine.createSpy('dragStart');
                inst = new Draggable(ele as HTMLElement, { clone: false, dragStart: dragsEvent });
                EventHandler.trigger(ele as HTMLElement, 'mousedown', mdown);
                mmove.srcElement = mmove.targetElement = mmove.toElement = ele;
            });
            it('Drag start event triggers properly', () => {
                EventHandler.trigger(<any>(document), 'mousemove', mmove);
                expect(dragsEvent).toHaveBeenCalled();
                inst.intDestroy(mdown);
            });
            afterAll(() => {
                mElement.remove();
            });
        });
        describe('drag start with position relative set to the parent element', () => {
            let ele: Element;
            let mElement: HTMLElement;
            let inst: any;
            let dragsEvent: jasmine.Spy;
            let mdown: any = getEventObject('MouseEvents', 'mousedown');
            let mmove: any;
            beforeAll(() => {
                /* tslint:disable no-multiline-string */
                let str: string = `<div id ='dragEle' style='border: 1px solid; height: 300px; width: 200px;'>
                        Draggable
                        </div> `;
                mElement = getElement('outer', `border:1px solid greenyellow;height:500px;
                width:400px;padding:50px;margin-top:5px;position:relative`,
                    str);
                mdown = setMouseCordinates(mdown, 67, 69);
                mmove = getEventObject('MouseEvents', 'mousemove');
                mmove = setMouseCordinates(mousemove, 76, 80);
                ele = mElement.querySelector('#dragEle');
                dragsEvent = jasmine.createSpy('dragStart');
                inst = new Draggable(ele as HTMLElement, { clone: false, dragStart: dragsEvent });
                EventHandler.trigger(ele as HTMLElement, 'mousedown', mdown);
                mmove.srcElement = mmove.targetElement = mmove.toElement = ele;
                EventHandler.trigger(<any>(document), 'mousemove', mmove);
            });
            it('Drag start event triggers properly', () => {
                expect((<HTMLElement>ele).offsetTop).toBeGreaterThan(20);
                expect((<HTMLElement>ele).offsetLeft).toBeGreaterThan(30);
                expect(dragsEvent).toHaveBeenCalled();
                inst.intDestroy(mdown);
            });
            afterAll(() => {
                mElement.remove();
            });
        });
        describe('drag start dragTarget', () => {
            let ele: Element;
            let mElement: HTMLElement;
            let inst: any;
            let dragsEvent: jasmine.Spy;
            let mdown: any = getEventObject('MouseEvents', 'mousedown');
            let mmove: any;
            beforeEach(() => {
                let str: string = `<div id='dragarea' tabindex='1' style='border:1px solid magenta;height:400px;width:500px'>
                    <div id ='dragEle' class='dragTarget' style='border:1px solid blue;height:40px;width:80px'>
                     Draggable
                    </div> </div>`;
                mElement = getElement('outer', null, str);
                mdown = setMouseCordinates(mdown, 24, 15);
                mmove = getEventObject('MouseEvents', 'mousemove');
                mmove = setMouseCordinates(mousemove, 24, 18);
                ele = mElement.querySelector('#dragarea');
                dragsEvent = jasmine.createSpy('dragStart');
                inst = new Draggable(ele as HTMLElement, { clone: true, dragStart: dragsEvent, dragTarget: '.dragTarget' });
                EventHandler.trigger(ele as HTMLElement, 'mousedown', mdown);
                mmove.srcElement = mmove.target = mElement.querySelector('.dragTarget');
            });
            it('Drag start event triggers properly', () => {
                EventHandler.trigger(<any>(document), 'mousemove', mmove);
                expect(dragsEvent).toHaveBeenCalled();
                expect(inst.diffX).toBe(14);
                expect(inst.diffY).toBe(8);
                inst.intDestroy(mdown);
            });
            it('Invalid dragTarget', () => {
                inst.dragTarget = '.test';
                EventHandler.trigger(<any>(document), 'mousemove', mmove);
                expect(dragsEvent).toHaveBeenCalled();
                inst.intDestroy(mdown);
            });
            afterAll(() => {
                mElement.remove();
            });
        });
        describe('drag start with multiple touch points', () => {
            let ele: Element;
            let mElement: HTMLElement;
            let inst: any;
            let dragsEvent: jasmine.Spy;
            let mdown: any = getEventObject('MouseEvents', 'mousedown');
            let mmove: any;
            beforeEach(() => {
                let str: string = `<div id='dragarea' tabindex='1' style='border:1px solid magenta;height:400px;width:500px'>
                     <div id ='dragEle' class='dragTarget' style='border:1px solid blue;height:40px;width:80px'>
                       Draggable
                     </div> </div>`;
                mElement = getElement('outer', null, str);
                mdown = setMouseCordinates(mdown, 24, 15);
                mmove = getEventObject('MouseEvents', 'mousemove');
                ele = mElement.querySelector('#dragarea');
                dragsEvent = jasmine.createSpy('dragStart');
                inst = new Draggable(ele as HTMLElement, { clone: true, dragStart: dragsEvent, dragTarget: '.dragTarget' });
                EventHandler.trigger(ele as HTMLElement, 'mousedown', mdown);
                mmove.srcElement = mmove.target = mElement.querySelector('.dragTarget');
            });
            it('Drag start event triggers properly', () => {
                let dMouseDown: any = extend({}, mmove);
                dMouseDown.changedTouches = [{}, {}];
                EventHandler.trigger(<any>(document), 'mousemove', dMouseDown);
                expect(dragsEvent).not.toHaveBeenCalled();
                expect(inst.diffX).toBe(0);
                expect(inst.diffY).toBe(0);
                inst.intDestroy(mdown);
            });
            afterAll(() => {
                mElement.remove();
            });
        });
        describe('Set Drag area', () => {
            let instance: any;
            let outerEle: HTMLElement;
            beforeEach(() => {
                element = createElement('div', {
                    id: 'drag', innerHTML: '<P>Draggable Text</P>',
                    styles: 'border:1px solid black;width:300px;height:150px'
                });
                outerEle = createElement('div', {
                    id: 'outer',
                    innerHTML: element.outerHTML,
                    styles: 'border:1px solid grey;width:700px;height:600px;padding:2px'
                });
                document.body.appendChild(outerEle);
                element = document.getElementById('drag');
                mousedown.target = mousedown.currentTarget = element;
                instance = new Draggable(element, { clone: false, dragArea: '#outer' });
                EventHandler.trigger(element, 'mousedown', mousedown);
                mousemove.srcElement = mousemove.targetElement = mousemove.toElement = element;
            });
            it('Drag Area is initiated properly using selector', () => {
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(instance.dragLimit).toEqual({ left: 11, right: 711, top: 11, bottom: 611 });
                instance.intDestroy(mousedown);
            });
            it('Drag Area is initiated properly using element options', () => {
                instance.dragArea = outerEle;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(instance.dragLimit).toEqual({ left: 11, right: 711, top: 11, bottom: 611 });
                instance.intDestroy(mousedown);
            });
            it('Drag Area is not initiated when property is not specifed', () => {
                instance.dragArea = undefined;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(instance.dragLimit).toEqual({ left: 0, right: 0, top: 0, bottom: 0 });
                instance.intDestroy(mousedown);
            });
            it('Drag Area with min width and height', () => {
                outerEle.style.width = '0px';
                outerEle.style.height = '0px';
                outerEle.style.border = 'none';
                outerEle.style.padding = '0px';
                instance.dragArea = outerEle;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(instance.dragLimit).toEqual({ left: 8, right: 8, top: 8, bottom: 8 });
                instance.intDestroy(mousedown);
            });
        });
        describe('Drag with draggable area', () => {
            let instance: any;
            let dragEvent: jasmine.Spy;
            let outerEle: HTMLElement;
            beforeEach(() => {
                element = createElement('div', {
                    id: 'drag', innerHTML: '<P>Draggable Text</P>',
                    styles: 'border:1px solid black;width:300px;height:150px'
                });
                outerEle = createElement('div', {
                    id: 'outer',
                    innerHTML: element.outerHTML,
                    styles: 'border:1px solid grey;width:700px;height:600px;padding:2px'
                });
                document.body.appendChild(outerEle);
                element = document.getElementById('drag');
                mousedown.target = mousedown.currentTarget = element;
                dragEvent = jasmine.createSpy('drag');
                instance = new Draggable(element, { clone: false, drag: dragEvent, dragArea: '#outer' });
                EventHandler.trigger(element, 'mousedown', mousedown);
                mousemove.srcElement = mousemove.target = mousemove.toElement = element;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 19, 20);
            });
            it('drag event is triggered properly', () => {
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(dragEvent).toHaveBeenCalled();
                instance.intDestroy(mousedown);
            });
            it('check queryPositionInfo value not returns nan',()=>{
                let returnValue: any = {};
                instance.queryPositionInfo = (value: any) => {
                    returnValue = value;
                    return {left:'20px',top:'20px'};
                }
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(returnValue).not.toEqual({top: "NaNpx", left: "NaNpx"});
                instance.intDestroy(mousedown);
            });
            it('check queryPositionInfo value not returns nan',()=>{
                let returnValue: any = {};
                instance.queryPositionInfo = (value: any) => {
                    returnValue = value;
                    return {left:'20px',top:'20px'};
                }
                instance.skipDistanceCheck = true;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(returnValue).toEqual({top: "17px", left: "12px"});
                instance.intDestroy(mousedown);
            });
            it('drag event is prevented from triggered', () => {
                instance.drag = null;
                instance.dragArea = null;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(dragEvent).not.toHaveBeenCalled();
                instance.intDestroy(mousedown);
            });
            it('drag operation with drag area exceeding right value and minimum top value', () => {
                mousemove = setMouseCordinates(mousemove, 1500, 12);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.body;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(instance.element.style.top).toBe('10px');
                expect(instance.element.style.left).toBe('408px');
                instance.intDestroy(mousedown);
            });
            it('drag operation with drag area exceeding top value and minimum left value', () => {
                mousemove = setMouseCordinates(mousemove, 8, 700);
                mousemove.srcElement = mousemove.target = mousemove.toElement = document.body;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(instance.element.style.top).toBe('458px');
                expect(instance.element.style.left).toBe('10px');
                instance.intDestroy(mousedown);
            });
            it('drag operation within the draggable area', () => {
                mousemove = setMouseCordinates(mousemove, 25, 35);
                mousemove.srcElement = mousemove.targetElement = mousemove.toElement = document.body;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(instance.element.style.top).toBe('32px');
                expect(instance.element.style.left).toBe('18px');
                instance.intDestroy(mousedown);
            });
            it('drag operation with previous value', () => {
                mousemove = setMouseCordinates(mousemove, 25, 35);
                mousemove.srcElement = mousemove.targetElement = mousemove.toElement = document.body;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(instance.element.style.top).toBe('32px');
                expect(instance.element.style.left).toBe('18px');
                instance.intDestroy(mousedown);
            });
            it('drag operation with invalid  values', () => {
                mousemove = setMouseCordinates(mousemove, 0, 0);
                mousemove.srcElement = mousemove.targetElement = mousemove.toElement = document.body;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                expect(instance.element.style.top).toBe('10px');
                expect(instance.element.style.left).toBe('10px');
                instance.intDestroy(mousedown);
            });
            it('drag event with multi touch point is prevented properly', () => {
                let dMouseMove: any = extend({}, mousemove);
                dMouseMove.changedTouches = [{}, {}];
                EventHandler.trigger(<any>(document), 'mousemove', dMouseMove);
                expect(dragEvent).not.toHaveBeenCalled();
                instance.intDestroy(mousedown);
            });
        });
        describe('Drag without draggable area and negative values', () => {
            let instance: any;
            beforeEach(() => {
                element = getElement();
                mousedown.target = mousedown.currentTarget = element;
                instance = new Draggable(element, { clone: false });
                EventHandler.trigger(element, 'mousedown', mousedown);
                mousemove.srcElement = mousemove.target = mousemove.toElement = element;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 0, 0);
            });
            it('drag event is triggered properly', () => {
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let style: CSSStyleDeclaration = instance.element.style;
                expect(style.top).toBe('-5px');
                expect(style.left).toBe('-9px');
                instance.intDestroy(mousedown);
            });
            it('drag axis invalid value', () => {
                instance.axis = 'invalid';
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let style: CSSStyleDeclaration = instance.element.style;
                expect(style.top).toBe('-5px');
                expect(style.left).toBe('-9px');
                instance.intDestroy(mousedown);
            });
            it('drag horizontally', () => {
                instance.axis = 'x';
                instance.element.style.top = "";
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let style: CSSStyleDeclaration = instance.element.style;
                expect(style.top).toBe("");
                instance.intDestroy(mousedown);
            });
            it('drag vertically', () => {
                instance.axis = 'y';
                instance.element.style.left = "";
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let style: CSSStyleDeclaration = instance.element.style;
                expect(style.left).toBe("");
                instance.intDestroy(mousedown);
            });
            it('drag set position', () => {
                instance.queryPositionInfo = (val: any): any => {
                    return { left: '100px', top: '100px' };
                }
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let style: CSSStyleDeclaration = instance.element.style;
                expect(style.left).toBe('100px');
                expect(style.top).toBe('100px');
                instance.intDestroy(mousedown);
            });
            afterEach(() => {
                element.remove();
                document.body.innerHTML = '';
            });
        });
        describe('Drag Stop', () => {
            let instance: any;
            let dragEndEvent: jasmine.Spy;
            let outerEle: HTMLElement;
            let mouseUp: any;
            beforeEach(() => {
                element = getElement();
                mousedown.target = mousedown.currentTarget = element;
                dragEndEvent = jasmine.createSpy('dragEnd');
                instance = new Draggable(element, { clone: false, dragStop: dragEndEvent, });
                EventHandler.trigger(element, 'mousedown', mousedown);
                mousemove.srcElement = mousemove.target = mousemove.toElement = element;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 50, 50);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mouseUp = getEventObject('MouseEvents', 'mouseup');
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = element;
            });
            it('Drag stop event triggered properly', () => {
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                expect(dragEndEvent).toHaveBeenCalled();
            });
            it('Check the aria-grabbed value on the drag-stop action', () => {
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                expect(instance.element.getAttribute('aria-grabbed')).toBe('false');
            });
            it('Drag stop not triggered while model value is not set', () => {
                instance.dragStop = undefined;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                expect(dragEndEvent).not.toHaveBeenCalled();
            });
            it('Drag stop prevented on invalid event type', () => {
                mouseUp.type = 'mousemove';
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                expect(dragEndEvent).not.toHaveBeenCalled();
                instance.intDestroy(mousedown);
            });
            it('Drag stop using touch event', () => {
                mouseUp.type = 'touchend';
                mouseUp.changedTouches = [setMouseCordinates({ target: element }, mouseUp.pageX, mouseUp.pageY)]
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                expect(dragEndEvent).toHaveBeenCalled();
            });
            it('Drag stop using touch event with multiple touch points', () => {
                let dMouseUp: any = extend({}, mouseUp);
                dMouseUp.changedTouches = [{}, {}];
                EventHandler.trigger(<any>(document), 'mouseup', dMouseUp);
                expect(dragEndEvent).not.toHaveBeenCalled();
                instance.intDestroy(mousedown);
            });
        });
        afterEach(() => {
            element.remove();
            document.body.innerHTML = '';
        });
    });
    describe('drag is prevented while element is removed from dragstart event', () => {
        let inst: any;
        let cloneDrag: jasmine.Spy;
        let dMousedown: any;
        let dMousemove: any;
        let dEle: HTMLElement = getElement();
        beforeAll(() => {
            cloneDrag = jasmine.createSpy('drag');
            dMousedown = getEventObject('MouseEvents', 'mousedown');
            dMousedown = setMouseCordinates(dMousedown, 17, 200);
            dMousemove = getEventObject('MouseEvents', 'mousemove');
            dMousemove = setMouseCordinates(dMousemove, 18, 200);
            let elem: HTMLElement = createElement('div', {
                id: 'clonevis',
                innerHTML: 'Test Drag Element',
                styles: 'border: 1px red solid; width: 200px; height: 100px'
            });
            dMousedown.target = dMousedown.currentTarget = elem;
            inst = new Draggable(dEle, {
                helper: () => {
                    document.body.appendChild(elem);
                    return elem;
                },
                dragStart: () => {
                    document.getElementById('clonevis').remove();
                }, drag: cloneDrag
            });
            EventHandler.trigger(dEle, 'mousedown', dMousedown);
            dMousemove.srcElement = dMousemove.target = dMousemove.toElement = dEle;
        });
        it('prevent drag action while dragabble element is removed', () => {
            EventHandler.trigger(<any>(document), 'mousemove', dMousemove);
            dMousemove = setMouseCordinates(dMousemove, 20, 200);
            EventHandler.trigger(<any>(document), 'mousemove', dMousemove);
            expect(cloneDrag).not.toHaveBeenCalled();
            inst.intDestroy(dMousedown);
        });
        afterAll(()=>{
            document.body.innerHTML = '';
        })
    });
    describe('drag  with splifrom cursor using clone element', () => {
        let inst: any;
        let cloneDrag: jasmine.Spy;
        let dMousedown: any;
        let dMousemove: any;
        beforeEach(() => {
            let dEle: HTMLElement = getElement();
            cloneDrag = jasmine.createSpy('drag');
            dMousedown = getEventObject('MouseEvents', 'mousedown');
            dMousedown = setMouseCordinates(dMousedown, 17, 10);
            dMousemove = getEventObject('MouseEvents', 'mousemove');
            dMousemove = setMouseCordinates(dMousemove, 18, 12);
            let elem: HTMLElement = createElement('div', {
                id: 'clonevis',
                innerHTML: 'Test Drag Element',
                styles: 'border: 1px red solid; width: 200px; height: 100px'
            });
            dMousedown.target = dMousedown.currentTarget = elem;
            inst = new Draggable(dEle, {
                helper: () => {
                    document.body.appendChild(elem);
                    return elem;
                },
                dragStop: () => {
                    document.getElementById('clonevis').remove();
                }, drag: cloneDrag,enableTailMode: true, cursorAt:{left: -20,top:-10}
            });
            EventHandler.trigger(dEle, 'mousedown', dMousedown);
            dMousemove.srcElement = dMousemove.target = dMousemove.toElement = dEle;
        });
        it('cusrorAt with splitformcursor woking properly', () => {
            EventHandler.trigger(<any>(document), 'mousemove', dMousemove);
            dMousemove = setMouseCordinates(dMousemove, 20, 30);
            EventHandler.trigger(<any>(document), 'mousemove', dMousemove);
            expect(inst.helperElement.style.left).toBe('40px');
            expect(inst.helperElement.style.top).toBe('40px');
            inst.intDestroy(dMousedown);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
    });
});
describe('droppable', () => {
    let dropInstance: Droppable;
    let dropElem: any;
    let mousup: any;
    dropElem = getElement('drop');
    let drop: jasmine.Spy = jasmine.createSpy('drop');
    beforeEach(() => {
        dropInstance = new Droppable(dropElem, { drop: drop });
        mousup = getEventObject('MouseEvents', 'mouseup');
        mousup.target = mousup.currentTarget = dropElem;
        EventHandler.trigger(dropElem, 'mouseup', mousup);
    });
    it('initialize droppable', () => {
        expect(dropElem.classList.contains('e-control')).toBe(true);
        expect(dropElem.classList.contains('e-droppable')).toBe(true);
    });
    it('check element instance', () => {
        expect(dropElem.ej2_instances[0].constructor.name).toBe('Droppable');
    });
    it('check drop event', () => {
        expect(drop).not.toHaveBeenCalled();
        dropInstance.drop = null;
        // Called for function cover, Since onPropertyChanged in not necessary for this component
        dropInstance.onPropertyChanged({}, {});
    });
    afterEach(() => {
        dropElem.remove();
        document.body.innerHTML = '';
    });
});
describe('Drag and Drop', () => {
    let dropInstance: any;
    let dropElem: any;
    let dragElem: HTMLElement;
    let dragInstance: any;
    let dragOut: jasmine.Spy;
    let dragOver: jasmine.Spy;
    let dropevt: jasmine.Spy;
    let dropArgs:any;
    let mousedown: any = getEventObject('MouseEvents', 'mousedown');
    mousedown = setMouseCordinates(mousedown, 14, 296);
    let mousemove: any = getEventObject('MouseEvents', 'mousemove');
    describe('intDrag and intDrop and ', () => {
        beforeEach(() => {
            dropElem = getElement('drop', 'border:1px solid grey;width:500px;height:350px;padding:10px;margin:10px', ' ');
            dragElem = getElement();
            dragOut = jasmine.createSpy('out');
            dragOver = jasmine.createSpy('over');
            dropevt = jasmine.createSpy('drop');
            dropInstance = new Droppable(dropElem, { out: dragOut, over: dragOver, drop: dropevt });
            dragInstance = new Draggable(dragElem, { clone: false });
            mousedown.target = mousedown.currentTarget = dragElem;
            EventHandler.trigger(dragElem, 'mousedown', mousedown);
            mousemove = setMouseCordinates(mousemove, 15, 402);
            mousemove.srcElement = mousemove.targetElement = mousemove.toElement = dragElem;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        });
        it('Check Mouse over droppable element', () => {
            mousemove = setMouseCordinates(mousemove, 34, 380);
            let tempElem: Element = document.getElementById('drag1');
            mousemove.target = mousemove.srcElement = mousemove.toElement = tempElem;
            mousemove.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(dragOver).toHaveBeenCalled();
            dragInstance.intDestroy();
        });
        it('Check Mouse over droppable element and mouse with mouseover set as true', () => {
            mousemove = setMouseCordinates(mousemove, 34, 380);
            let tempElem: Element = document.getElementById('drag1');
            mousemove.target = mousemove.srcElement = mousemove.toElement = tempElem;
            mousemove.currentTarget = document;
            dropInstance.mouseOver = true;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(dragOver).not.toHaveBeenCalled();
            dragInstance.intDestroy();
        });
        it('Check Mouse out droppable element', () => {
            mousemove = setMouseCordinates(mousemove, 34, 380);
            let tempElem: Element = document.getElementById('drag1');
            mousemove.target = mousemove.srcElement = mousemove.toElement = tempElem;
            mousemove.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 100, 386);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(dragOut).toHaveBeenCalled();
            dragInstance.intDestroy();
        });
        it('Check Mouse out droppable element with mouseover set to false', () => {
            mousemove = setMouseCordinates(mousemove, 34, 380);
            let tempElem: Element = document.getElementById('drag1');
            mousemove.target = mousemove.srcElement = mousemove.toElement = tempElem;
            mousemove.currentTarget = document;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCordinates(mousemove, 100, 386);
            dropInstance.mouseOver = false;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(dragOut).not.toHaveBeenCalled();
            dragInstance.intDestroy();
        });
        it('Check Drop event is called ', () => {
            let tempElem: Element = document.getElementById('drag1');
            mousemove.target = mousemove.srcElement = mousemove.toElement = tempElem;
            mousemove.currentTarget = document;
            mousemove = setMouseCordinates(mousemove, 129, 116);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup');
            mouseup.target = mouseup.srcElement = mouseup.toElement = tempElem;
            mouseup.currentTarget = document;
            mouseup = setMouseCordinates(mouseup, 129, 116);
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(dropevt).toHaveBeenCalled();
        });
        it('Check Drop event argument contains drag target ', () => {
            let tempElem: Element = document.getElementById('drag1');
            mousemove.target = mousemove.srcElement = mousemove.toElement = tempElem;
            mousemove.currentTarget = document;
            mousemove = setMouseCordinates(mousemove, 129, 116);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup');
            mouseup.target = mouseup.srcElement = mouseup.toElement = tempElem;
            mouseup.currentTarget = document;
            mouseup = setMouseCordinates(mouseup, 129, 116);
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(dropevt).toHaveBeenCalled();
        });
        it('Check Drop event without calling the drag event ', () => {
            let tempElem: Element = document.getElementById('drag1');
            let mouseup: any = getEventObject('MouseEvents', 'mouseup');
            mouseup.target = mouseup.srcElement = mouseup.toElement = tempElem;
            mouseup.currentTarget = document;
            mouseup = setMouseCordinates(mouseup, 129, 116);
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(dropevt).toHaveBeenCalled();
        });
        it('Check Drop event arguments ', () => {
            dropInstance.drop = (args:any) =>{
                             dropArgs = args;
                         }
            let tempElem: Element = document.getElementById('drag1');
            mousemove.target = mousemove.srcElement = mousemove.toElement = tempElem;
            mousemove.currentTarget = document;
            mousemove = setMouseCordinates(mousemove, 129, 116);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup');
            mouseup.target = mouseup.srcElement = mouseup.toElement = tempElem;
            mouseup.currentTarget = document;
            mouseup = setMouseCordinates(mouseup, 129, 116);
            dropInstance.accept = '.common';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(dropArgs.dragData.draggedElement).toBe(dragInstance.element);
        });
        it('Check Drop event with invalid accept selector   is not called ', () => {
            let tempElem: Element = document.getElementById('drag1');
            mousemove.target = mousemove.srcElement = mousemove.toElement = tempElem;
            mousemove.currentTarget = document;
            mousemove = setMouseCordinates(mousemove, 129, 116);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup');
            mouseup.target = mouseup.srcElement = mouseup.toElement = tempElem;
            mouseup.currentTarget = document;
            mouseup = setMouseCordinates(mouseup, 129, 116);
            dropInstance.accept = '.drag1';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(dropevt).not.toHaveBeenCalled();
        });
        it('Check Drop event using touch event', () => {
            let tempElem: Element = document.getElementById('drag1');
            mousemove.target = mousemove.srcElement = mousemove.toElement = tempElem;
            mousemove.currentTarget = document;
            mousemove = setMouseCordinates(mousemove, 129, 116);
            dropInstance.out = (): string => { return null; };
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = getEventObject('MouseEvents', 'mouseup');
            mouseup.target = mouseup.srcElement = mouseup.toElement = tempElem;
            mouseup.currentTarget = document;
            mouseup = setMouseCordinates(mouseup, 129, 116);
            mouseup.type = 'touchend';
            mouseup.changedTouches = [setMouseCordinates({ target: tempElem }, mouseup.pageX, mouseup.pageY)];
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect(dropevt).toHaveBeenCalled();
        });
        it('check child element inside droppable pop  up to parnet properly', () => {
            let touchEle: any = getElement('touch', 'border:1px solid cyan;height:200px;width:300px;margin:10px');
            dropElem.appendChild(touchEle);
            let touchInst: Touch = new Touch(touchEle);
            let tempElem: Element = document.getElementById('drag1');
            mousemove.target = mousemove.srcElement = mousemove.toElement = tempElem;
            mousemove.currentTarget = document;
            mousemove = setMouseCordinates(mousemove, 254, 229);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            expect(dragOver).toHaveBeenCalled();
            dragInstance.intDestroy();
        });
        describe('check destroy method', () => {
            it('Destroy for Draggable', () => {
                let instance: any = new Draggable(element, { handle: 'p' });
                instance.destroy();
                mousedown.target = mousedown.currentTarget = document.getElementsByTagName('p')[0];
                EventHandler.trigger(element, 'mousedown', mousedown);
                expect(instance.initialPosition).toBeUndefined();
                expect(element.classList.contains('e-draggable')).toBe(false);
            });
            it('Destroy for Droppable', () => {
                let instance: Droppable = new Droppable(element);
                instance.destroy();
                expect(element.classList.contains('e-droppable')).toBe(false);
            });
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });
});
