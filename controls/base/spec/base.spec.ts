/**
 * Library Spec
 */
import { Base, getComponent, removeChildInstance, DomElements, setProxyToRaw } from '../src/base';
import { NotifyPropertyChanges, INotifyPropertyChanged, Event, Property } from '../src/notify-property-change';
import { createElement } from '../src/dom';
import { Touch } from '../src/touch';
import { enableBlazorMode, disableBlazorMode, isBlazor } from '../src/util';

@NotifyPropertyChanges
class DemoClass extends Base<HTMLElement> implements INotifyPropertyChanged {

    @Property('Value')
    public text: string;

    @Property('Property')
    public value: string;


    public testFunction: Function = () => { };

    @Event()
    public test: Function;
    constructor(element?: HTMLElement) {
        super({}, element);
    }

    @Event()
    public testCollection: Function[];

    protected getModuleName(): string {
        return 'demolib';
    }

    public callServerDataBind(): void {
        this.serverDataBind();
    }

    public setServerDataBinding(isServerDataBind: boolean): void {
        this.allowServerDataBinding = isServerDataBind;
    }

    protected bind(): void {
        //
    }

    public onPropertyChanged(newProp: Object, oldProp: Object): void {
        let keys: string[] = Object.keys(newProp);
        for (let prop of keys) {
            switch (prop) {
                case 'value':
                    this.text = this.value;
                    this.trigger('test', {});
                    break;
            }
        }
        this.testFunction(newProp, oldProp);
    }

    public destroy(): void {
        super.destroy();
    }

}

let ele: HTMLElement = createElement('div', { id: 'singleEle', styles: 'height:100px;width:100px;' });
let objClass: DemoClass = new DemoClass();
describe('Library', (): void => {
    describe('base method availability', (): void => {
        it('addEvent Listener', () => {
            expect(typeof objClass.addEventListener).toEqual('function');
        });
        it('removeEvent Listener', () => {
            expect(typeof objClass.removeEventListener).toEqual('function');
        });
    });

    describe('element binding', (): void => {
        it('bind element in constructor', () => {
            let obj: DemoClass = new DemoClass(ele);
            expect(obj.element).toEqual(ele);
        });
        it(' destroy property', () => {
            let obj: DemoClass = new DemoClass(ele);
            expect(obj.isDestroyed).toEqual(false);
            obj.destroy();
            expect(obj.isDestroyed).toEqual(true);
        });
        it('destroy Vue instance', () => {
            let vueEle: HTMLElement = createElement('div', { id: 'singleEle', styles: 'height:100px;width:100px;' });
            let reactive = function (instance: DemoClass) {
                instance['__reactive'] = true;
                return instance;
            }
            let toRaw = function (instance: DemoClass) {
                delete instance['__reactive'];
                return instance;
            }
            setProxyToRaw(toRaw);
            let vueObj: DemoClass = reactive(new DemoClass(vueEle));
            expect((<DomElements>vueObj.element).ej2_instances.length).toEqual(1);
            expect(vueObj.isDestroyed).toEqual(false);
            vueObj.destroy();
            expect(vueObj.isDestroyed).toEqual(true);
            expect((<DomElements>vueObj.element).ej2_instances.length).toEqual(0);
        });
    });

    describe('event binding', (): void => {
        let propspy: jasmine.Spy;
        let externalHandler: jasmine.Spy;
        beforeEach(() => {
            propspy = jasmine.createSpy('functionSpy');
            externalHandler = jasmine.createSpy('temp');
        });
        it('addEventListener using property and external adding ', () => {
            let obj: any = new DemoClass(ele);
            obj.test = propspy;
            obj.addEventListener('test', externalHandler);
            obj.trigger('test');
            expect(propspy).toHaveBeenCalledTimes(1);
            expect(externalHandler).toHaveBeenCalled();
        });
        it('removeEventListener using  property value and external removal', () => {
            let obj: any = new DemoClass(ele);
            obj.test = propspy;
            let spy2: jasmine.Spy = jasmine.createSpy('temp');
            obj.test = undefined;
            obj.addEventListener('test', spy2);
            obj.removeEventListener('test', spy2);
            obj.trigger('test');
            expect(propspy).not.toHaveBeenCalled();
            expect(spy2).not.toHaveBeenCalled();
        });

        it('trigger event instance method', () => {
            let obj: DemoClass = new DemoClass(ele);
            obj.addEventListener('test', propspy);
            obj.trigger('test', { arg1: 'val1' });
            expect(propspy).toHaveBeenCalled();
        });
    });

    describe('Root class declaration', (): void => {
        it(' test module class name at class instance creation', () => {
            let obj: DemoClass = new DemoClass(ele);
            expect(obj.element.className.indexOf('e-lib e-demolib')).toEqual(0);
        });

        it(' test module class name at class instance destroy', () => {
            let ele: HTMLElement = createElement('div', { id: 'element' });
            let obj: DemoClass = new DemoClass(ele);
            obj.destroy();
            expect(obj.element.className.indexOf('e-lib e-demolib')).toEqual(-1);
        });
    });
    describe('check whether the notify trigger after component destroyed', () => {
        let destInst: DemoClass;
        beforeEach(() => {
            destInst = new DemoClass(ele);
        });
        it('check destroyed before notify', () => {
            let spy: jasmine.Spy = jasmine.createSpy('test');
            destInst.test = spy;
            destInst.destroy();
            destInst.trigger('test');
            expect(spy).not.toHaveBeenCalled();
        });
        it('notify with success', (done) => {
            let spy: jasmine.Spy = jasmine.createSpy('test');
            destInst.test = spy;
            destInst.trigger('test', {}, () => {
                expect(spy).toHaveBeenCalled();
                done();
            });
        });
        it('notify with success for not registed event', (done) => {
            let spy: jasmine.Spy = jasmine.createSpy('test');
            destInst.test = spy;
            destInst.trigger('test1', {}, () => {
                expect(spy).not.toHaveBeenCalled();
                done();
            });
        });
        it('notify with success', (done) => {
            window["Blazor"] = true;

            destInst.test = () => {
                let promise = new Promise(function (resolve, reject) {
                    setTimeout(() => resolve("done"), 0);
                });
                return promise;
            };
            destInst.trigger('test', {}, () => {
                window["Blazor"] = false;
                done();
            });
        });
        it('notify with success -non promise call', (done) => {
            window["Blazor"] = true;
            destInst.test = () => {

            };
            destInst.trigger('test', {}, () => {
                window["Blazor"] = false;
                done();
            });
        });
        it('notify with success json', (done) => {
            window["Blazor"] = true;

            destInst.test = () => {
                let promise = new Promise(function (resolve, reject) {
                    setTimeout(() => resolve('{"data":"success"}'), 0);
                });
                return promise;
            };
            destInst.trigger('test', {}, () => {
                window["Blazor"] = false;
                done();
            });
        });
        it('notify with error for registed event', (done) => {
            window["Blazor"] = true;
            destInst.test = () => {
                return Promise.reject({ data: { message: 'Error message' } });
            };
            destInst.trigger('test', {}, () => { }, () => {
                window["Blazor"] = false;
                done();
            });
        });
        it('notify with error for registed event -stringify', (done) => {
            window["Blazor"] = true;
            destInst.test = () => {
                return Promise.reject('{"data":"error"}');
            };
            destInst.trigger('test', {}, () => { }, () => {
                window["Blazor"] = false;
                done();
            });
        });
    });

    describe('check whether the notify trigger after component destroyed', () => {
        let destInst: DemoClass;
        var originalTimeout = 0;
        beforeEach(() => {
            destInst = new DemoClass(ele);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        });

        it('notify with success json with array', (done) => {
            window["Blazor"] = true;
            destInst.addEventListener("testCollection", () => {
                let promise = new Promise(function (resolve, reject) {
                    setTimeout(() => resolve('{"data":"success"}'), 0);
                });
                return promise;
            });
            destInst.addEventListener("testCollection", () => {
                return { data2: "success" };
            });
            destInst.addEventListener("testCollection", () => {
                let promise = new Promise(function (resolve, reject) {
                    setTimeout(() => resolve({ data: "successs-done" }), 0);
                });
                return promise;
            });
            destInst.trigger('testCollection', { data: "preparing", add: "good" }, () => {
                window["Blazor"] = false;
                done();
            });
        });
        it('notify with success json with array', (done) => {
            window["Blazor"] = true;
            destInst.addEventListener("testCollection", () => {
                let promise = new Promise(function (resolve, reject) {
                    setTimeout(() => resolve('{"data":"success"}'), 0);
                });
                return promise;
            });
            destInst.addEventListener("testCollection", () => {
                return { data2: "success-final" };
            });
            destInst.trigger('testCollection', { data: "preparing", add: "good" }, () => {
                window["Blazor"] = false;
                done();
            });
        });
        it('notify with out success json with array', () => {
            window["Blazor"] = true;
            let data: object = destInst.trigger('testCollection', { data: "preparing", add: "good" }) as object;
            expect(data).not.toBe(null);
            window["Blazor"] = false;
        });
        afterEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            destInst.destroy();
        });
    });


    describe('change detection inside of onproperty', (): void => {
        it('inside property change', () => {
            let obj: DemoClass = new DemoClass(ele);
            spyOn(obj, 'testFunction');
            obj.value = 'newVal';
            obj.dataBind();
            obj.dataBind();
            expect(obj.testFunction).toHaveBeenCalledTimes(1);
        });
        it('inside property change', () => {
            let obj: DemoClass = new DemoClass(ele);
            obj.test = (arg: Object) => {
                obj.value = 'ValueAdded';
            };
            spyOn(obj, 'testFunction');
            obj.value = 'newVal';
            obj.dataBind();
            obj.dataBind();
            expect(obj.testFunction).toHaveBeenCalledTimes(2);
        });
    });

    describe("Blazor", function () {
        let bulkChanges: any = null;
        beforeAll(() => {
            enableBlazorMode();
            window['sfBlazor'] = {
                updateModel: (comp: any) => {
                    bulkChanges = comp.bulkChanges;
                    return true;
                }
            };
        });
        it('single property change', (done) => {
            let obj: DemoClass = new DemoClass(ele);
            obj.text = "testing";
            obj.dataBind();
            expect(bulkChanges).not.toBeNull();
            expect(bulkChanges).toEqual({ text: "testing" });
            bulkChanges = null;
            done();
        });
        it('bulk property changes', (done) => {
            let obj: DemoClass = new DemoClass(ele);
            obj.setServerDataBinding(false);
            obj.text = "textValue";
            obj.dataBind();
            obj.value = "valueText";
            obj.dataBind();
            obj.setServerDataBinding(true);
            obj.callServerDataBind();
            expect(bulkChanges).not.toBeNull();
            // the text value changed in the DemoClass OnPropertyChanged
            expect(bulkChanges).toEqual({ text: "valueText", value: "valueText" });
            bulkChanges = null;
            done();
        });
        it('setProperties', (done) => {
            let obj: DemoClass = new DemoClass(ele);
            obj.setProperties({ text: "texting" }, true);
            expect(bulkChanges).not.toBeNull();
            expect(bulkChanges).toEqual({ text: "texting" });
            bulkChanges = null;
            done();
        });
        afterAll(() => {
            disableBlazorMode();
            delete window['sfBlazor'];
        });
    });
});

// spec for getComponent() funtion
describe("getcomponent funtion", function () {
    it("if statement", function () {
        let elem: any = createElement('div', { id: 'test' });
        let comp: any = { ej2_instances: [new Touch(elem)] };
        expect(getComponent(comp, 'touch') instanceof Touch).toBe(true);
    });
    it("For element value as string type", function () {
        let elem: any = createElement('div', { id: 'test' });
        let touchObj: any = new Touch(<HTMLElement>elem);
        var stringElement: string = touchObj.element.id;
        document.body.appendChild(elem);
        expect(getComponent(stringElement, 'touch') instanceof Touch).toBe(true);
    });
    it("else statement", function () {
        let elem: any = createElement('div', { id: 'test' });
        let comp: any = { ej2_instances: [new Touch(elem)] };
        expect(getComponent(comp, 'button') instanceof Touch).toBe(false);
    });
    it("compenent instance", function () {
        let elem: any = createElement('div', { id: 'test' });
        let comp: any = { ej2_instances: [new Touch(elem)] };
        expect(getComponent(comp, Touch) instanceof Touch).toBe(true);
    });
    it("component not instance", function () {
        let elem: any = createElement('div', { id: 'test' });
        let comp: any = { ej2_instances: [new Touch(elem)] };
        expect(getComponent(comp, DemoClass) instanceof Touch).toBe(false);
    });

});
// spec for removeChildInstance() funtion
describe('removeChildInstance', function () {
    it('destroying the element Instance', function () {
        let elem: any =createElement('div', { id: 'test' });
        let comp: any = { ej2_instances: [new Touch(elem)] };
        let compEle: any = comp.ej2_instances[0].element;
        compEle.className = 'e-control e-touch ' + compEle.className;
        let htmlEle: HTMLElement = createElement('div', { id: 'parent', className: 'parentclass' });
        htmlEle.appendChild(compEle);
        removeChildInstance(htmlEle);
        expect(document.getElementsByClassName('e-control').length).toBe(0);
    });
    it('destroying the element Instance when component is not instance', function () {
        let elem:any =createElement('div', { id: 'test' });
        let comp: any = { ej2_instances: [new Touch(elem)] };
        let compEle: any = comp.ej2_instances[0].element;
        let htmlEle: HTMLElement = createElement('div', { id: 'parent', className: 'parentclass' });
        htmlEle.appendChild(compEle);
        removeChildInstance(htmlEle);
        expect(htmlEle.getElementsByClassName('e-control').length).toBe(0);
    });
});