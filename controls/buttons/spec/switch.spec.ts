import { Switch } from './../src/switch/switch';
import { createElement } from '@syncfusion/ej2-base';
import { EventHandler } from '@syncfusion/ej2-base';

/* tslint:disable */
function copyObject(source: any, destination: any): Object {
    for (let prop in source) {
        destination[prop] = source[prop];
    }
    return destination;
}

function setMouseCoordinates(eventarg: any, x: number, y: number): Object {
    eventarg.pageX = x;
    eventarg.pageY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    return eventarg;
}
export function getEventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}
/* tslint:enable */

/**
 * Switch Spec document.
 */
describe('Switch', () => {
    let specSwitch: any;
    let element: HTMLFormElement = createElement('input', {id: 'specSwitch'}) as HTMLFormElement;
    element.setAttribute('type', 'checkbox');
    document.body.appendChild(element);
    describe('DOM', () => {
        let i: number = 0;
        function changeFn(): void {
            i = 1;
        }
        afterEach(() => {
            specSwitch.destroy();
        });

        it('Normal Switch', () => {
            specSwitch = new Switch({}, '#specSwitch');
            expect(element.classList.contains('e-switch')).toEqual(true);
            expect(element.parentElement.classList.contains('e-switch-wrapper')).toEqual(true);
            expect(element.parentElement.children[1].classList.contains('e-switch-inner')).toEqual(true);
            expect(element.parentElement.children[1].children[0].classList.contains('e-switch-on')).toEqual(true);
            expect(element.parentElement.children[1].children[1].classList.contains('e-switch-off')).toEqual(true);
            expect(element.parentElement.children[2].classList.contains('e-switch-handle')).toEqual(true);
        });
        it('Switch with on and off label', () => {
            specSwitch = new Switch({onLabel: 'ON', offLabel: 'OFF'}, '#specSwitch');
            expect(element.nextElementSibling.children[0].textContent).toEqual('ON');
            expect(element.nextElementSibling.children[1].textContent).toEqual('OFF');
        });
        it('Switch with checked state', () => {
            specSwitch = new Switch({checked: true}, '#specSwitch');
            expect(element.parentElement.children[1].classList.contains('e-switch-active')).toEqual(true);
            expect(element.parentElement.children[2].classList.contains('e-switch-active')).toEqual(true);
        });
        it('Switch with disabled state', () => {
            specSwitch = new Switch({disabled: true}, '#specSwitch');
            expect(element.disabled).toEqual(true);
            expect(element.parentElement.classList.contains('e-switch-disabled')).toEqual(true);
        });
        it('Switch with disabled state false', () => {
            specSwitch = new Switch({ disabled: false }, '#specSwitch');
            expect(element.disabled).toEqual(false);
            expect(element.parentElement.classList.contains('e-switch-disabled')).toEqual(false);
        });
        it('Switch with RTL', () => {
            specSwitch = new Switch({enableRtl: true}, '#specSwitch');
            expect(element.parentElement.classList.contains('e-rtl')).toEqual(true);
        });
        it('Switch with RTL disabled', () => {
            specSwitch = new Switch({ enableRtl: false }, '#specSwitch');
            expect(element.parentElement.classList.contains('e-rtl')).toEqual(false);
        });
        it('Switch with name property', () => {
            specSwitch = new Switch({name: 'Wifi'}, '#specSwitch');
            expect(element.getAttribute('name')).toEqual('Wifi');
        });
        it('Switch with value property', () => {
            specSwitch = new Switch({value: 'on'}, '#specSwitch');
            expect(element.getAttribute('value')).toEqual('on');
        });
        it('Switch with cssClass', () => {
            specSwitch = new Switch({cssClass: 'custom'}, '#specSwitch');
            expect(element.parentElement.classList.contains('custom')).toEqual(true);
        });
        it('Switch with change event', () => {
            specSwitch = new Switch({change: changeFn}, '#specSwitch');
            element.parentElement.click();
            expect(i).toEqual(1);
        });
        it('Switch with ARIA property', () => {
            specSwitch = new Switch({}, '#specSwitch');
            expect(element.parentElement.getAttribute('role')).toEqual('switch');
            expect(element.parentElement.getAttribute('aria-checked')).toEqual('false');
        });
        it('Mouse click test', () => {
            specSwitch = new Switch({}, '#specSwitch');
            element.parentElement.click();
            expect(element.parentElement.children[1].classList.contains('e-switch-active')).toEqual(true);
            expect(element.parentElement.children[2].classList.contains('e-switch-active')).toEqual(true);
            element.parentElement.click();
            expect(element.parentElement.children[1].classList.contains('e-switch-active')).toEqual(false);
            expect(element.parentElement.children[2].classList.contains('e-switch-active')).toEqual(false);
        });
        it('Wrapper touch', () => {
            specSwitch = new Switch({}, '#specSwitch');
            let start: MouseEvent = document.createEvent('MouseEvent');
            start.initEvent('touchstart', true, true);
            element.parentElement.dispatchEvent(start);
            let move: MouseEvent = document.createEvent('MouseEvent');
            move.initEvent('touchmove', true, true);
            element.parentElement.dispatchEvent(move);
            let end: MouseEvent = document.createEvent('MouseEvent');
            end.initEvent('touchend', true, true);
            element.parentElement.dispatchEvent(end);
            expect(element.parentElement.children[1].classList.contains('e-switch-active')).toEqual(true);
            let up: MouseEvent = document.createEvent('MouseEvent');
            up.initEvent('mouseup', true, true);
            element.parentElement.parentElement.dispatchEvent(up);
        });
        it('Wrapper Mouse', () => {
            specSwitch = new Switch({}, '#specSwitch');
            let event: MouseEvent = document.createEvent('MouseEvent');
            event.initEvent('mousedown', true, true);
            element.parentElement.dispatchEvent(event);
            expect(specSwitch.isKeyPressed).toEqual(false);
            let up: MouseEvent = document.createEvent('MouseEvent');
            up.initEvent('mouseup', true, true);
            element.parentElement.dispatchEvent(up);
            let events: MouseEvent = document.createEvent('MouseEvent');
            events.initEvent('mousedown', true, true);
            document.dispatchEvent(events);
        });
    });


    describe('property', () => {
        let i: number = 0;
        function changeFn(): void {
            i = 1;
        }
        afterEach(() => {
            specSwitch.destroy();
        });
        it('Switch with on and off label', () => {
            specSwitch = new Switch({ onLabel: 'ON', offLabel: 'OFF' }, '#specSwitch');
            expect(specSwitch.onLabel).toEqual('ON');
            expect(specSwitch.offLabel).toEqual('OFF');
        });

        it('Switch with checked state', () => {
            specSwitch = new Switch({ checked: true }, '#specSwitch');
            expect(specSwitch.checked).toEqual(true);
        });
        it('Switch with checked state false', () => {
            specSwitch = new Switch({ checked: false }, '#specSwitch');
            expect(specSwitch.checked).toEqual(false);
        });
        it('Switch with disabled state', () => {
            specSwitch = new Switch({ disabled: true }, '#specSwitch');
            expect(specSwitch.disabled).toEqual(true);
        });
        it('Switch with disabled state', () => {
            specSwitch = new Switch({ disabled: false }, '#specSwitch');
            expect(specSwitch.disabled).toEqual(false);
        });
        it('Switch with RTL', () => {
            specSwitch = new Switch({ enableRtl: true }, '#specSwitch');
            expect(specSwitch.enableRtl).toEqual(true);
        });
        it('Switch with name property', () => {
            specSwitch = new Switch({ name: 'Wifi' }, '#specSwitch');
            expect(specSwitch.name).toEqual('Wifi');
        });
        it('Switch with value property', () => {
            specSwitch = new Switch({ value: 'on' }, '#specSwitch');
            expect(specSwitch.value).toEqual('on');
        });
        it('Switch with cssClass', () => {
            specSwitch = new Switch({ cssClass: 'custom' }, '#specSwitch');
            expect(specSwitch.cssClass).toEqual('custom');
        });
        it('Switch with change event', () => {
            specSwitch = new Switch({ change: changeFn }, '#specSwitch');
            expect(specSwitch.change).toEqual(changeFn);
        });
        it('Switch with persistence', () => {
            specSwitch = new Switch({ enablePersistence: true }, '#specSwitch');
            expect(specSwitch.enablePersistence).toEqual(true);
        });
    });
    describe('Notify property Changes', () => {
        afterEach(() => {
            specSwitch.destroy();
        })
        it('onLabel checking', () => {
            specSwitch = new Switch({}, '#specSwitch');
            specSwitch.onLabel = 'ON';
            specSwitch.dataBind();
            expect(specSwitch.onLabel).toEqual('ON');
            expect(element.parentElement.children[1].children[0].textContent).toEqual('ON');
        });
        it('offLabel checking',() => {
            specSwitch = new Switch({}, '#specSwitch');
            specSwitch.offLabel = 'NO';
            specSwitch.dataBind();
            expect(specSwitch.offLabel).toEqual('NO');
            expect(element.parentElement.children[1].children[1].textContent).toEqual('NO');
        });
        it('Switch with checked state', () => {
            specSwitch = new Switch({}, '#specSwitch');
            specSwitch.checked = true;
            specSwitch.dataBind();
            expect(specSwitch.checked).toEqual(true);
            expect(element.parentElement.children[1].classList.contains('e-switch-active')).toEqual(true);
            expect(element.parentElement.children[2].classList.contains('e-switch-active')).toEqual(true);
            specSwitch.checked = false;
            specSwitch.dataBind();
            expect(specSwitch.checked).toEqual(false);
            expect(element.parentElement.children[1].classList.contains('e-switch-active')).toEqual(false);
            expect(element.parentElement.children[2].classList.contains('e-switch-active')).toEqual(false);
        });
        it('Switch with disabled state', () => {
            specSwitch = new Switch({}, '#specSwitch');
            specSwitch.disabled = true;
            specSwitch.dataBind();
            expect(specSwitch.disabled).toEqual(true);
            expect(element.parentElement.classList.contains('e-switch-disabled')).toEqual(true);
            specSwitch.disabled = false;
            specSwitch.dataBind();
            expect(specSwitch.disabled).toEqual(false);
            expect(element.parentElement.classList.contains('e-switch-disabled')).toEqual(false);
        });
        it('Switch with RTL', () => {
            specSwitch = new Switch({}, '#specSwitch');
            specSwitch.enableRtl = true;
            specSwitch.dataBind();
            expect(specSwitch.enableRtl).toEqual(true);
            expect(element.parentElement.classList.contains('e-rtl')).toEqual(true);
            specSwitch.enableRtl = false;
            specSwitch.dataBind();
            expect(specSwitch.enableRtl).toEqual(false);
            expect(element.parentElement.classList.contains('e-rtl')).toEqual(false);
        });
        it('Switch with name', () => {
            specSwitch = new Switch({}, '#specSwitch');
            specSwitch.name = 'Wifi';
            specSwitch.dataBind();
            expect(specSwitch.name).toEqual('Wifi');
            expect(element.getAttribute('name')).toEqual('Wifi');
        });
        it('Switch with value', () => {
            specSwitch = new Switch({}, '#specSwitch');
            specSwitch.value = 'on';
            specSwitch.dataBind();
            expect(specSwitch.value).toEqual('on');
            expect(element.getAttribute('value')).toEqual('on');
        });
        it('Switch with cssClass', () => {
            specSwitch = new Switch({}, '#specSwitch');
            specSwitch.cssClass = 'customCSS';
            specSwitch.dataBind();
            expect(specSwitch.cssClass).toEqual('customCSS');
            expect(element.parentElement.classList.contains('customCSS')).toEqual(true);
            specSwitch.cssClass = 'newClass';
            specSwitch.dataBind();
            expect(element.parentElement.classList.contains('newClass')).toEqual(true);
        });
    });
    describe('Methods test', () => {
        it('Destroy method', () => {
            specSwitch = new Switch({
                checked: true, onLabel: 'YES', offLabel: 'NO', name: 'switch', value: 'true', disabled: true
            }, '#specSwitch');
            specSwitch.destroy();
            expect(element.parentElement.classList.contains('e-switch-wrapper')).toEqual(false);
            expect(specSwitch.checked).toEqual(true);
            expect(specSwitch.onLabel).toEqual('YES');
            expect(specSwitch.offLabel).toEqual('NO');
            expect(specSwitch.name).toEqual('switch');
            expect(specSwitch.value).toEqual('true');
            expect(specSwitch.disabled).toEqual(true);
            expect(element.getAttribute('name')).toEqual(null);
            expect(element.getAttribute('value')).toEqual(null);
        });
        it('Keyboard Event', () => {
            specSwitch = new Switch({}, '#specSwitch');
            element.parentElement.focus();
            specSwitch.switchFocusHandler();
            specSwitch.focusHandler();
            expect(element.parentElement.classList.contains('e-focus')).toEqual(true);
            specSwitch.isKeyPressed = false;
            specSwitch.focusOutHandler();
            expect(element.parentElement.classList.contains('e-focus')).toEqual(false);
        });

        it('Pre render method', () => {
            document.body.appendChild(createElement('EJS-SWITCH', { id: 'ngswitch' }));
            specSwitch = new Switch({}, '#ngswitch');
            expect(specSwitch.element.parentElement.tagName).toEqual('EJS-SWITCH');
            expect(specSwitch.element.parentElement.children[0].tagName).toEqual('INPUT');
            specSwitch.destroy();
            expect((document.getElementById('ngswitch')).tagName).toBe('EJS-SWITCH');
            specSwitch = new Switch({}, document.body.appendChild(createElement('input')) as HTMLInputElement);
            expect(specSwitch.element.classList).toContain('e-switch');
            expect(specSwitch.element.type).toEqual('checkbox');
        });
        it('toggle method', () => {
            specSwitch = new Switch({}, '#specSwitch');
            specSwitch.toggle();
            expect(specSwitch.checked).toEqual(true);
            specSwitch.toggle();
            expect(specSwitch.checked).toEqual(false);
        })
    });
});

