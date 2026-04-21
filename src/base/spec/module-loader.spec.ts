/**
 *  Module loader specification
*/
import { createElement } from '../src/dom';
import { Styler1 } from './component.spec';
import { Touch } from '../src/touch';
import { Animation } from '../src/animation';
import { getValue } from '../src/util';
import { ModuleDeclaration } from '../src/module-loader';

describe('ModuleLoader inject modules', () => {
    describe('Different modules injection', () => {
        it('Required modules without module declaration', () => {
            Styler1.prototype.requiredModules = (): ModuleDeclaration[] => {
                return [];
            };
            Styler1.Inject();
            let elem: HTMLElement = createElement('div', { id: 'myStyleDiv0' });
            document.body.appendChild(elem);
            let styleObj: Styler1 = new Styler1({ size: '20px' }, '#myStyleDiv0');
            expect(styleObj.getInjectedModules().indexOf(Animation)).toBe(-1);
            styleObj.destroy();
            document.body.innerHTML = '';
        });

        it('Injected modules without module declaration', () => {
            let elem: HTMLElement = createElement('div', { id: 'myStyleDiv0' });
            document.body.appendChild(elem);
            Styler1.prototype.requiredModules = (): ModuleDeclaration[] => {
                return [{ args: [elem], member: 'touch' }];
            };
            Styler1.Inject();
            let styleObj: Styler1 = new Styler1({ size: '20px' }, '#myStyleDiv0');
            expect(styleObj.getInjectedModules().indexOf(Touch)).toBe(-1);
            styleObj.destroy();
            document.body.innerHTML = '';
        });

        it('Difference injected modules with required modules', () => {
            Styler1.Inject(Animation);
            let elem: HTMLElement = createElement('div', { id: 'myStyleDiv0' });
            document.body.appendChild(elem);
            let styleObj: Styler1 = new Styler1({ size: '20px' }, '#myStyleDiv0');
            expect(styleObj.getInjectedModules().indexOf(Touch)).toBe(-1);
            styleObj.destroy();
            document.body.innerHTML = '';
        });
    });

    describe('Check property declarations', () => {
        it('Testing without isProperty module declaration', () => {
            let elem: HTMLElement = createElement('div', { id: 'myStyleDiv0' });
            document.body.appendChild(elem);
            Styler1.prototype.requiredModules = (): ModuleDeclaration[] => {
                return [{ args: [elem], member: 'touch' }];
            };
            Styler1.Inject(Touch);
            let styleObj: Styler1 = new Styler1({ size: '20px' }, '#myStyleDiv0');
            expect(getValue('touchModule', styleObj) instanceof Touch).toEqual(true);
            styleObj.destroy();
            document.body.innerHTML = '';
        });

        it('Testing with isProperty module declaration', () => {
            Styler1.prototype.requiredModules = (): ModuleDeclaration[] => {
                return [{ args: [elem], member: 'animation', isProperty: true }];
            };
            let elem: HTMLElement = createElement('div', { id: 'myStyleDiv0' });
            document.body.appendChild(elem);
            let styleObj: Styler1 = new Styler1({ size: '20px' }, '#myStyleDiv0');
            expect(getValue('animationModule', styleObj)).toEqual(Animation);
            styleObj.destroy();
            document.body.innerHTML = '';
        });
    });

    describe('Dynamic module loading and unloading on property  value changed', () => {
        let dynamicLoad: Styler1;
        beforeAll((done: Function) => {
            let elem: HTMLElement = createElement('div', { id: 'myStyleDiv0' });
            document.body.appendChild(elem);
            Styler1.prototype.requiredModules = function (): ModuleDeclaration[] {
                let ret: ModuleDeclaration[] = [];
                if (this.enableTouch) {
                    ret.push({ args: [elem], member: 'touch' });
                }
                ret.push({ args: [elem], member: 'animation' });
                return ret;
            };
            dynamicLoad = new Styler1({ size: '20px' }, '#myStyleDiv0');
            setTimeout(() => { done(); }, 50);
        });
        describe('', () => {
            it('check by default modules are loaded based on property value', () => {
                expect(getValue('animationModule', dynamicLoad) instanceof Animation).toEqual(true);
                expect(getValue('touchModule', dynamicLoad) instanceof Touch).toEqual(true);
            });
        });
        describe('Unload  and load module while property value changed', () => {
            beforeAll((done: Function) => {
                dynamicLoad.enableTouch = false;
                setTimeout(() => { done(); }, 50);
            });
            describe('unload', () => {
                it('Check whether the touch module is removed', () => {
                    expect((dynamicLoad as Object).hasOwnProperty('touchModule')).toBe(false);
                });
                it('check the loaded modules length', () => {
                    expect((dynamicLoad as any).moduleLoader.loadedModules.length).toBe(1);
                });
            });
            describe('load', () => {
                beforeAll((done: Function) => {
                    dynamicLoad.enableTouch = true;
                    setTimeout(() => { done(); }, 50);
                });
                it('check touch module is added', () => {
                    expect(getValue('animationModule', dynamicLoad) instanceof Animation).toEqual(true);
                    expect(getValue('touchModule', dynamicLoad) instanceof Touch).toEqual(true);
                });
                it('check the loaded modules length', () => {
                    expect((dynamicLoad as any).moduleLoader.loadedModules.length).toBe(2);
                });
            });
            describe('Refresh inject modules not add duplicate loaded modules', () => {
                beforeAll((done: Function) => {
                    dynamicLoad.size = '23px';
                    setTimeout(() => { done(); }, 50);
                });
                it('', () => {
                    expect((dynamicLoad as any).moduleLoader.loadedModules.length).toBe(2);
                });
            });
            describe('Property change with databind calling', () => {
                it('', () => {
                    dynamicLoad.enableTouch = false;
                    dynamicLoad.dataBind();
                    expect((dynamicLoad as any).moduleLoader.loadedModules.length).toBe(1);
                    expect((dynamicLoad as Object).hasOwnProperty('touchModule')).toBe(false);
                });
            });
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
    });

    describe('Clean loaded modules', () => {
        it('after clean', () => {
            let elem: HTMLElement = createElement('div', { id: 'myStyleDiv1' });
            document.body.appendChild(elem);
            Styler1.prototype.requiredModules = (): ModuleDeclaration[] => {
                return [{ args: [elem], member: 'touch' }];
            };
            Styler1.Inject(Touch);
            let styleObj: Styler1 = new Styler1({ size: '20px' }, '#myStyleDiv1');
            spyOn(Touch.prototype, 'destroy');
            expect(Touch.prototype.destroy).not.toHaveBeenCalled();
            styleObj.destroy();
            document.body.innerHTML = '';
            expect(Touch.prototype.destroy).toHaveBeenCalled();
        });
    });

    describe('Multiple injection', () => {
        it('testing duplicates', () => {
            let elem: HTMLElement = createElement('div', { id: 'myStyleDiv1' });
            document.body.appendChild(elem);
            Styler1.prototype.requiredModules = (): ModuleDeclaration[] => {
                return [{ args: [elem], member: 'touch' }, { args: [elem], member: 'animation', isProperty: true }];
            };
            Styler1.Inject(Touch);
            Styler1.Inject(Touch, Animation);
            let styleObj: Styler1 = new Styler1({ size: '20px' }, '#myStyleDiv1');
            expect(getValue('touchModule', styleObj)).not.toEqual(undefined);
            styleObj.destroy();
            document.body.innerHTML = '';
        });
    });
    afterAll(() => {
        (<any>Styler1.prototype).injectedModules = [];
    });
});