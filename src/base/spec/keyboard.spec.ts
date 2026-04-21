/**
 * Keyboard Event Spec
 */
import { KeyboardEvents } from '../src/keyboard';
import { extend } from '../src/util';
import { createElement } from '../src/dom';

let ele: HTMLElement;
let objKeyConfig: any;

ele = createElement('div', { id: 'keytest' });


// Spec for KeyConfig Framework    
describe('KeyConfig', (): void => {
    describe('instance creation', () => {
        it('with default option', () => {
            let ele1: HTMLElement = createElement('div', { id: 'keytest' });
            let kbEvt: KeyboardEvents = new KeyboardEvents(
                ele1,
                {
                    keyConfigs: { selectAll: 'ctrl+a' },
                    keyAction: (): void => { /** Empty */ }
                });
            //Cover onPropertyChanged function
            kbEvt.onPropertyChanged({}, {});
            expect(kbEvt.element.classList.contains('e-keyboard')).toEqual(true);
        });

        it('without default option', () => {
            ele = createElement('div', { id: 'keytest' });
            objKeyConfig = new KeyboardEvents(ele);
            objKeyConfig.keyConfigs = { selectAll: 'ctrl+a' };
            objKeyConfig.keyAction = () => { /** Empty */ };
            //Cover the code since its not used.
            objKeyConfig.getModuleName();
            expect(objKeyConfig.element.classList.contains('e-keyboard')).toEqual(true);
        })
    });
    describe('Action', () => {
        beforeAll(function () {
            spyOn(objKeyConfig, 'keyAction');
        });
        beforeEach(function () {
            objKeyConfig.keyAction.calls.reset();
        });
        it('single special key (ESC)', () => {
            let eventArgs: any = { which: 27, altKey: false, ctrlKey: false, shiftKey: false };
            objKeyConfig.keyConfigs = { close: 'escape' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            eventArgs.action = 'close';
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs);
        });

        it('single character key (A)', () => {
            let eventArgs: any = { which: 65, altKey: false, ctrlKey: false, shiftKey: false };
            objKeyConfig.keyConfigs = { close: 'A' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            eventArgs.action = 'close';
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs);
        });

        it('two key combination (Ctrl + A)', () => {
            let eventArgs: any = { which: 65, altKey: false, ctrlKey: true, shiftKey: false };
            objKeyConfig.keyConfigs = { selectAll: 'ctrl+a' }
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            eventArgs.action = 'selectAll';
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs);
        });

        it('three key combination (Ctrl + Shift + Delete)', () => {
            let eventArgs: any = { which: 46, altKey: false, ctrlKey: true, shiftKey: true };
            objKeyConfig.keyConfigs = { permanentDelete: 'ctrl+shift+delete' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            eventArgs.action = 'permanentDelete';
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs);
        });

        it('unhandled key code 202', () => {
            let eventArgs: any = { which: 202, altKey: true, ctrlKey: false, shiftKey: true };
            objKeyConfig.keyConfigs = { maximize: 'alt+shift+a' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            expect(objKeyConfig.keyAction).not.toHaveBeenCalled();
        });

        it('multiple key config', () => {
            let eventArgs1: any = { which: 65, altKey: true, ctrlKey: false, shiftKey: true };
            objKeyConfig.keyConfigs = { maximize: 'alt+shift+a', open: 'enter' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs1));
            let eventArgs2: any = { which: 13, altKey: false, ctrlKey: false, shiftKey: false };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs2));
            expect(objKeyConfig.keyAction).toHaveBeenCalledTimes(2);
            eventArgs1.action = 'maximize';
            eventArgs2.action = 'open';
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs1);
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs2);
        });
        it('single action with multiple config', () => {
            let eventArgs1: any = { which: 40, altKey: false, ctrlKey: false, shiftKey: false };
            let eventArgs2: any = { which: 40, altKey: false, ctrlKey: true, shiftKey: false };
            let eventArgs3: any = { which: 38, altKey: false, ctrlKey: false, shiftKey: false };
            let eventArgs4: any = { which: 38, altKey: false, ctrlKey: true, shiftKey: false };
            objKeyConfig.keyConfigs = { down: 'downarrow,ctrl+downarrow', up: 'uparrow,ctrl+uparrow' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs1));
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs2));
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs3));
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs4));
            expect(objKeyConfig.keyAction).toHaveBeenCalledTimes(4);
            eventArgs1.action = 'down';
            eventArgs2.action = 'down';
            eventArgs3.action = 'up';
            eventArgs4.action = 'up';
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs1);
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs2);
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs3);
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs4);
        });
    });

    describe('Control Keys', () => {

        beforeEach(function () {
            objKeyConfig.keyAction.calls.reset();
        });

        it('key (Alt + Shift + Enter) with key (Alt,Ctrl,Shift) => (true,true,true)', () => {
            let eventArgs: any = { which: 13, altKey: true, ctrlKey: true, shiftKey: true };
            objKeyConfig.keyConfigs = { maximize: 'alt+shift+enter' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            expect(objKeyConfig.keyAction).not.toHaveBeenCalled();
        });
        it('key (Alt + Shift + Enter) with key (Alt,Ctrl,Shift) => (false,true,true)', () => {
            let eventArgs: any = { which: 13, altKey: false, ctrlKey: true, shiftKey: true };
            objKeyConfig.keyConfigs = { maximize: 'alt+shift+enter' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            expect(objKeyConfig.keyAction).not.toHaveBeenCalled();
        });
        it('key (Alt + Shift + Enter) with key (Alt,Ctrl,Shift) => (true,true,false)', () => {
            let eventArgs: any = { which: 13, altKey: true, ctrlKey: true, shiftKey: false };
            objKeyConfig.keyConfigs = { maximize: 'alt+shift+enter' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            expect(objKeyConfig.keyAction).not.toHaveBeenCalled();
        });
        it('key (Alt + Shift + Enter) with key (Alt,Ctrl,Shift) => (true,false,true)', () => {
            let eventArgs: any = { which: 13, altKey: true, ctrlKey: false, shiftKey: true };
            objKeyConfig.keyConfigs = { maximize: 'alt+shift+enter' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            eventArgs.action = 'maximize';
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs);
        });

        it('key (Alt + Shift + Enter) with key (Alt,Ctrl,Shift) => (false,false,true)', () => {
            let eventArgs: any = { which: 13, altKey: false, ctrlKey: false, shiftKey: true };
            objKeyConfig.keyConfigs = { maximize: 'alt+shift+enter' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            expect(objKeyConfig.keyAction).not.toHaveBeenCalled();
        });
        it('key (Alt + Shift + Enter) with key (Alt,Ctrl,Shift) => (false,true,false)', () => {
            let eventArgs: any = { which: 13, altKey: false, ctrlKey: true, shiftKey: false };
            objKeyConfig.keyConfigs = { maximize: 'alt+shift+enter' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            expect(objKeyConfig.keyAction).not.toHaveBeenCalled();
        });
        it('key (Alt + Shift + Enter) with key (Alt,Ctrl,Shift) => (true,false,false)', () => {
            let eventArgs: any = { which: 13, altKey: true, ctrlKey: false, shiftKey: false };
            objKeyConfig.keyConfigs = { maximize: 'alt+shift+enter' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            eventArgs.action = 'maximize';
            expect(objKeyConfig.keyAction).not.toHaveBeenCalled();
        });
        it('key ( Alt + Shift + Enter) with key (Alt,Ctrl,Shift) => (false,false,true)', () => {
            let eventArgs: any = { which: 13, altKey: false, ctrlKey: false, shiftKey: true };
            objKeyConfig.keyConfigs = { maximize: 'alt+shift+enter' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            expect(objKeyConfig.keyAction).not.toHaveBeenCalled();
        });
    });

    describe('Key Code', () => {

        beforeEach(function () {
            objKeyConfig.keyAction.calls.reset();
        });

        it('single key code (67)', () => {
            let eventArgs: any = { which: 67, altKey: false, ctrlKey: true, shiftKey: false };
            objKeyConfig.keyConfigs = { maximize: 'ctrl+67' }
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            eventArgs.action = 'maximize';
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs);
        });
        it('single special key code 202', () => {
            let eventArgs: any = { which: 202, altKey: false, ctrlKey: false, shiftKey: false };
            objKeyConfig.keyConfigs = { maximize: '202' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            eventArgs.action = 'maximize';
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs);
        });

        it('two key combination with keycode (Ctrl + 65)', () => {
            let eventArgs: any = { which: 65, altKey: false, ctrlKey: true, shiftKey: false };
            objKeyConfig.keyConfigs = { selectAll: 'ctrl+65' }
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            eventArgs.action = 'selectAll';
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs);
        });
        it('three key combination with keycode (Alt + Shift + 13) ', () => {
            let eventArgs: any = { which: 13, altKey: true, ctrlKey: false, shiftKey: true };
            objKeyConfig.keyConfigs = { maximize: 'alt+shift+13' };
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            eventArgs.action = 'maximize';
            expect(objKeyConfig.keyAction).toHaveBeenCalledWith(eventArgs);
        });
    });

    describe('API/Method', () => {
        it('keyAction handler test', () => {
            let eventArgs: any = { which: 13, altKey: true, ctrlKey: false, shiftKey: true };
            objKeyConfig.keyConfigs = { maximize: 'alt+shift+13' };
            let spyFun = jasmine.createSpy('keyAction')
            objKeyConfig.keyAction = spyFun;
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            objKeyConfig.keyAction = null;
            objKeyConfig.keyPressHandler(extend({}, {}, eventArgs));
            eventArgs.action = 'maximize';
            expect(spyFun).toHaveBeenCalledTimes(1);
            expect(spyFun).toHaveBeenCalledWith(eventArgs);
        });
        it('destroy class test', () => {
            expect(ele.classList.contains('e-keyboard')).toEqual(true);
            objKeyConfig.destroy();
            expect(ele.classList.contains('e-keyboard')).toEqual(false);
        });
    });
});
