/**
 * Spec for component source
 */
import { createElement } from '../src/dom';
import { getValue } from '../src/util';
import { Component } from '../src/component';
import { ChildProperty } from '../src/child-property';
import { ModuleDeclaration } from '../src/module-loader';
import { Property, Complex, NotifyPropertyChanges, INotifyPropertyChanged, Event } from '../src/notify-property-change';
import { Touch } from '../src/touch';
import { enableRtl, setCulture } from '../src/internationalization';
import { setCurrencyCode } from '../src/index';
//classes


export class InnerTable extends ChildProperty<Table> {
    @Property('id')
    public id: string;

    @Property('name')
    public name: string;

}

export class Table extends ChildProperty<Table> {
    @Property('id')
    public id: string;

    @Property('name')
    public name: string;

    @Complex({}, InnerTable)
    public innerTable: InnerTable;

}

export class Fields extends ChildProperty<Fields> {
    @Property('id')
    public id: string;

    @Property('name')
    public name: string;

    @Complex({}, Table)
    public table: Table;
}

@NotifyPropertyChanges
export class Styler extends Component<HTMLElement> implements INotifyPropertyChanged {
    @Property('12px')
    public size: string;

    @Property(false)
    public enablePersistence: boolean;

    @Complex({}, Fields)
    public fields: Fields;

    @Property({ color: 'red' })
    public settings: { color: string, size: number };

    @Property([])
    public items: string[];

    @Property()
    public event1: Function;
    @Property('true')
    public enableTouch: boolean;
    @Property()
    public event2: Function;
    @Property()
    public currencyCode: string;
    @Property()
    public event3: Function;
    @Event()
    public created: Function;
    @Event()
    public destroyed: Function;

    constructor(fontObj?: {
        size: string, enablePersistence?: boolean, enableRtl?: boolean, locale?: string
        , created?: Function, destroyed?: Function
    }, id?: string | HTMLElement) {
        super(fontObj, id);
    }
    public touchModule: Touch;
    public preRender(): void { }
    public getModuleName(): string {
        return 'Styler';
    }
    public getPersistData(): string {
        return this.ignoreOnPersist(['size']);
    }
    public render(): void {
        this.element.classList.add('e-styler');
        this.element.style.fontSize = this.size;
    }
    public destroy(): void {
        this.element.classList.remove('e-styler');
        ////toCover coverage
        this.clearTemplate();
        super.destroy();
    }
    public onPropertyChanged(newProp: any, oldProp: any): void {
        this.element.style.fontSize = newProp['size'];
    }
}

@NotifyPropertyChanges
export class Styler1 extends Styler implements INotifyPropertyChanged {
    @Event()
    public destroyed: Function;
    constructor(fontObj: { size: string, enablePersistence?: boolean, destroyed?: Function}, id?: string | HTMLElement) {
        super(fontObj, id);
    }

    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [{
            args: [this.element],
            member: 'touch'
        }];
        return modules;
    };
}
@NotifyPropertyChanges
export class ObserveComponent extends Component<HTMLElement> implements INotifyPropertyChanged {

    @Property()
    public event1: Function;
    @Property()
    public event2: Function;
    @Property()
    public event3: Function;
    constructor(id: string | HTMLElement, option: Object) {
        super(option, id);
    }

    public preRender(): void {
        // 
    }
    public getModuleName(): string {
        return 'observeComponent';
    }
    public getPersistData(): string {
        return this.ignoreOnPersist([]);
    }
    public render(): void {
        /////
    }
    public destroy(): void {
        this.element.classList.remove('e-styler');
        super.destroy();
    }
    public onPropertyChanged(newProp: Object, oldProp: Object): void {
        //
    }
}
describe('Component', () => {
    it('Uninjecting with empty required modules', () => {
        Styler.Inject();
        let elem: HTMLElement = createElement('div', { id: 'myStyleDiv0' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '20px' }, '#myStyleDiv0');
        expect(styleObj.getInjectedModules()).toEqual([]);
        styleObj.destroy();
        document.body.innerHTML = '';
    });

    it('Injecting modules with out required modules', () => {
        Styler.Inject(Touch);
        let elem: HTMLElement = createElement('div', { id: 'myStyleDiv0' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '20px' }, '#myStyleDiv0');
        expect(getValue('touchModule', styleObj)).toEqual(undefined);
        styleObj.destroy();
        document.body.innerHTML = '';
    });

    it('Injecting dependent modules without required modules', () => {
        Styler.Inject(Touch);
        let elem: HTMLElement = createElement('div', { id: 'myStyleDiv0' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '20px' }, '#myStyleDiv0');
        expect(getValue('touchModule', styleObj)).toEqual(undefined);
        styleObj.destroy();
        document.body.innerHTML = '';
    });
    it('Check wheter changing currencyCode will trigger the onProperty Change', () => {
        let elem: HTMLElement = createElement('div', { id: 'myStyleDiv0' });
        document.body.appendChild(elem);
        let currencyStyler: any = new Styler({ size: '20px' }, '#myStyleDiv0');
        let curSpy: jasmine.Spy = jasmine.createSpy('curChange');
        currencyStyler.__proto__.onPropertyChanged = curSpy;
        setCurrencyCode('EUR');
        currencyStyler.dataBind();
        currencyStyler.destroy();
        expect(curSpy).toHaveBeenCalled();
        document.body.innerHTML = '';
        setCurrencyCode('USD');
    });
    it('Check wheter changing currencyCode will not trigger threw error on property change', () => {
        let elem: HTMLElement = createElement('div', { id: 'myStyleDiv0' });
        document.body.appendChild(elem);
        let currencyStyler: any = new ObserveComponent('#myStyleDiv0',{});
        let curSpy: jasmine.Spy = jasmine.createSpy('curChange');
        currencyStyler.__proto__.onPropertyChanged = curSpy;
        setCurrencyCode('EUR');
        currencyStyler.dataBind();
        currencyStyler.destroy();
        expect(curSpy).not.toHaveBeenCalled();
        document.body.innerHTML = '';
        setCurrencyCode('USD');
    });
    
    it('Injecting dependent modules with required modules', () => {
        Styler1.Inject(Touch);
        let elem: HTMLElement = createElement('div', { id: 'myStyleDiv0' });
        document.body.appendChild(elem);
        let styleObj: Styler1 = new Styler1({ size: '20px' }, '#myStyleDiv0');
        expect(getValue('touchModule', styleObj) instanceof Touch).toEqual(true);
        styleObj.destroy();
        document.body.innerHTML = '';
    });

    it('Controls render by default', () => {
        let elem: HTMLElement = createElement('div', { id: 'myStyleDiv0' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '20px', enablePersistence: true }, '#myStyleDiv0');
        expect(document.getElementById('myStyleDiv0').style.fontSize).toEqual('20px');
        styleObj.refresh();
        styleObj.destroy();
        document.body.innerHTML = '';
    });

    it('Control render by appendto ', () => {
        let elem: HTMLElement = createElement('div', { id: 'myStyleDiv1' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '25px' });
        styleObj.appendTo();
        styleObj.appendTo('#myStyleDiv1');
        expect(document.getElementById('myStyleDiv1').style.fontSize).toEqual('25px');
        styleObj.destroy();
        document.body.innerHTML = '';
    });

    it('Controls render by default from element', () => {
        let elem: HTMLElement = createElement('div', { id: 'myStyleDiv2' });
        document.body.appendChild(elem);
        let myElem: HTMLElement = document.getElementById('myStyleDiv2');
        let styleObj: Styler = new Styler({ size: '20px' }, myElem);
        expect(document.getElementById('myStyleDiv2').style.fontSize).toEqual('20px');
        styleObj.destroy();
        document.body.innerHTML = '';
    });

    it('Control render by appendto from element', () => {
        let elem: HTMLElement = createElement('div', { id: 'myStyleDiv3' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '25px' });
        let myElem: HTMLElement = document.getElementById('myStyleDiv3');
        styleObj.appendTo(myElem);
        expect(document.getElementById('myStyleDiv3').style.fontSize).toEqual('25px');
        styleObj.destroy();
        document.body.innerHTML = '';
    });

    it('instance creation check in appendTo', () => {
        let elem: any = createElement('div', { id: 'instanceEle' });
        let styleObj: Styler = new Styler({ size: '25px' });
        styleObj.appendTo(elem);
        expect(elem.ej2_instances[0]).toEqual(styleObj);
        expect(elem.ej2_instances.length).toEqual(1);
    });

    it('instance creation check in constructor creation', () => {
        let elem: any = createElement('div', { id: 'instanceEle1' });
        let styleObj: Styler = new Styler({ size: '25px' }, elem);
        expect(elem.ej2_instances[0]).toEqual(styleObj);
        expect(elem.ej2_instances.length).toEqual(1);
    });


    it('change detection for enableRtl', () => {
        let elem: HTMLElement = createElement('div', { id: 'rtlDiv' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '24px' }, elem);
        let onChangeFn: any = jasmine.createSpy('onPropertyChanged');
        styleObj.onPropertyChanged = onChangeFn;
        styleObj.enableRtl = true;
        styleObj.dataBind();
        expect(onChangeFn).toHaveBeenCalledWith({ enableRtl: true }, { enableRtl: false });
        styleObj.destroy();
        document.body.innerHTML = '';
    });
    it('Check defaultrtlstatus is set to component corrctly', () => {
        let elem: HTMLElement = createElement('div', { id: 'rtlDiv' });
        document.body.appendChild(elem);
        enableRtl();
        let styleObj: Styler = new Styler({ size: '24px' }, elem);
        expect(styleObj.enableRtl).toBe(true);
        styleObj.destroy();
        enableRtl(false);
    });
    it('change detection for enableRtl with enableRtl function ', () => {
        let elem: HTMLElement = createElement('div', { id: 'rtlDiv' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '24px' }, elem);
        let onChangeFn: any = jasmine.createSpy('onPropertyChanged');
        styleObj.onPropertyChanged = onChangeFn;
        enableRtl();
        styleObj.dataBind();
        expect(onChangeFn).toHaveBeenCalledWith({ enableRtl: true }, { enableRtl: false });
        styleObj.destroy();
        document.body.innerHTML = '';
        enableRtl(false);
    });
    it('set enableRtl in component side works properly', () => {
        let elem: HTMLElement = createElement('div', { id: 'rtlDiv' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '24px', enableRtl: true }, elem);
        expect(styleObj.enableRtl).toBe(true);
        styleObj.destroy();
    });
    it('Check defaultculture is set to component corrctly', () => {
        let elem: HTMLElement = createElement('div', { id: 'rtlDiv' });
        document.body.appendChild(elem);
        setCulture('ar');
        let styleObj: Styler = new Styler({ size: '24px' }, elem);
        expect(styleObj.locale).toBe('ar');
        styleObj.destroy();
        setCulture('en-US');
    });
    it('change detection for culture with setCulture function ', () => {
        let elem: HTMLElement = createElement('div', { id: 'rtlDiv' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '24px' }, elem);
        let onChangeFn: any = jasmine.createSpy('onPropertyChanged');
        styleObj.onPropertyChanged = onChangeFn;
        setCulture('ja');
        styleObj.dataBind();
        expect(onChangeFn).toHaveBeenCalledWith({ locale: 'ja' }, { locale: 'en-US' });
        styleObj.destroy();
        document.body.innerHTML = '';
        setCulture('en-US');
    });
    it('set locale in component side works properly', () => {
        let elem: HTMLElement = createElement('div', { id: 'rtlDiv' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '24px', locale: 'ar-QA' }, elem);
        expect(styleObj.locale).toBe('ar-QA');
        styleObj.destroy();
    });
    it('change detection for when refresh', (done) => {
        let elem: HTMLElement = createElement('div', { id: 'rtlDiv' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '24px' }, elem);
        let onChangeFn: any = jasmine.createSpy('onPropertyChange');
        styleObj.onPropertyChanged = onChangeFn;
        styleObj.enableRtl = true;
        styleObj.refresh();
        setTimeout(() => {
            expect(onChangeFn).not.toHaveBeenCalled();
            styleObj.destroy();
            document.body.innerHTML = '';
            done();
        }, 100);

    });

    it('addEventListener', () => {
        let i: number = 0;
        let elem: HTMLElement = createElement('div', { id: 'myStyleDiv2' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '25px' });
        styleObj.appendTo('#myStyleDiv2');
        styleObj.addEventListener('click', () => {
            i++;
        });
        styleObj.trigger('click');
        expect(i).toEqual(1);
        styleObj.destroy();
        document.body.innerHTML = '';
    });

    it('removeEventListener', () => {
        let i: number = 0;
        let elem: HTMLElement = createElement('div', { id: 'myStyleDiv3' });
        document.body.appendChild(elem);
        let styleObj: Styler = new Styler({ size: '25px' });
        let func: Function = () => {
            i++;
        };
        styleObj.appendTo('#myStyleDiv3');
        styleObj.addEventListener('click', func);
        styleObj.removeEventListener('click', func);
        styleObj.trigger('click');
        expect(i).toEqual(0);
        styleObj.destroy();
        document.body.innerHTML = '';
    });

    it('add on persistence with complex object', () => {
        window.localStorage.clear();
        let elem: HTMLElement = createElement('div', { id: 'addonP' });
        document.body.appendChild(elem);
        let list: string[] = ['size', 'fields.id', 'fields.table.id', 'fields.table.innerTable.id', 'settings', 'columns'];
        let actual: () => string = Styler.prototype.getPersistData;
        Styler.prototype.getPersistData = function (): string {
            return this.addOnPersist(list);
        };
        let styleObj2: Styler = new Styler({ size: '20px', enablePersistence: true }, '#addonP');

        styleObj2.fields.id = 'EmpID';
        styleObj2.fields.name = 'EmpName';
        styleObj2.fields.table.id = 'TableID';
        styleObj2.fields.table.name = 'TableName';
        styleObj2.fields.table.innerTable.id = 'InnerTableID';
        styleObj2.fields.table.innerTable.name = 'InnerTableName';
        styleObj2.destroy();
        let styleObj3: Styler = new Styler({ size: '20px', enablePersistence: true }, '#addonP');
        expect(styleObj3.fields.id).toBe('EmpID');
        expect(styleObj3.fields.name).toBe('name');
        expect(styleObj3.fields.table.id).toBe('TableID');
        expect(styleObj3.fields.table.name).toBe('name');
        expect(styleObj3.fields.table.innerTable.id).toBe('InnerTableID');
        expect(styleObj3.fields.table.innerTable.name).toBe('name');
        styleObj3.destroy();
        elem.remove();
        Styler.prototype.getPersistData = actual;
    });

    it('add on persistence with complex whole object', () => {
        window.localStorage.clear();
        let elem: HTMLElement = createElement('div', { id: 'addonP' });
        document.body.appendChild(elem);
        let list: string[] = ['fields'];
        let actual: () => string = Styler.prototype.getPersistData;
        Styler.prototype.getPersistData = function (): string {
            return this.addOnPersist(list);
        };
        let styleObj2: Styler = new Styler({ size: '20px', enablePersistence: true }, '#addonP');
        styleObj2.fields.id = 'EmpID';
        styleObj2.fields.name = 'EmpName';
        styleObj2.fields.table.id = 'TableID';
        styleObj2.fields.table.name = 'TableName';
        styleObj2.fields.table.innerTable.id = 'InnerTableID';
        styleObj2.fields.table.innerTable.name = 'InnerTableName';
        styleObj2.destroy();
        let styleObj3: Styler = new Styler({ size: '20px', enablePersistence: true }, '#addonP');
        expect(styleObj3.fields.id).toBe('EmpID');
        expect(styleObj3.fields.name).toBe('EmpName');
        expect(styleObj3.fields.table.id).toBe('TableID');
        expect(styleObj3.fields.table.name).toBe('TableName');
        expect(styleObj3.fields.table.innerTable.id).toBe('InnerTableID');
        expect(styleObj3.fields.table.innerTable.name).toBe('InnerTableName');
        styleObj3.destroy();
        elem.remove();
        Styler.prototype.getPersistData = actual;
    });

    it('add on persistence without complex object', () => {
        window.localStorage.clear();
        let elem: HTMLElement = createElement('div', { id: 'addonP' });
        document.body.appendChild(elem);
        let list: string[] = ['size'];
        let actual: () => string = Styler.prototype.getPersistData;
        Styler.prototype.getPersistData = function (): string {
            return this.addOnPersist(list);
        };
        let styleObj2: Styler = new Styler({ size: '20px', enablePersistence: true }, '#addonP');
        styleObj2.size = '200px';
        styleObj2.fields.id = 'EmpID';
        styleObj2.fields.name = 'EmpName';
        styleObj2.fields.table.id = 'TableID';
        styleObj2.fields.table.name = 'TableName';
        styleObj2.fields.table.innerTable.id = 'InnerTableID';
        styleObj2.fields.table.innerTable.name = 'InnerTableName';
        styleObj2.destroy();
        let styleObj3: Styler = new Styler({ size: '20px', enablePersistence: true }, '#addonP');
        expect(styleObj3.size).toBe('200px');
        expect(styleObj3.fields.id).toBe('id');
        expect(styleObj3.fields.name).toBe('name');
        expect(styleObj3.fields.table.id).toBe('id');
        expect(styleObj3.fields.table.name).toBe('name');
        expect(styleObj3.fields.table.innerTable.id).toBe('id');
        expect(styleObj3.fields.table.innerTable.name).toBe('name');
        styleObj3.destroy();
        elem.remove();
        Styler.prototype.getPersistData = actual;
    });

    it('add on persistence with an array', () => {
        window.localStorage.clear();
        let elem: HTMLElement = createElement('div', { id: 'addonP' });
        document.body.appendChild(elem);
        let list: string[] = ['items'];
        let actual: () => string = Styler.prototype.getPersistData;
        Styler.prototype.getPersistData = function (): string {
            return this.addOnPersist(list);
        };
        let styleObj2: Styler = new Styler({ size: '20px', enablePersistence: true }, '#addonP');
        styleObj2.items = ['i1', 'i2', 'i3'];
        styleObj2.fields.id = 'EmpID';
        styleObj2.fields.name = 'EmpName';
        styleObj2.fields.table.id = 'TableID';
        styleObj2.fields.table.name = 'TableName';
        styleObj2.fields.table.innerTable.id = 'InnerTableID';
        styleObj2.fields.table.innerTable.name = 'InnerTableName';
        styleObj2.destroy();
        let styleObj3: Styler = new Styler({ size: '20px', enablePersistence: true }, '#addonP');
        expect(styleObj3.items).toEqual(['i1', 'i2', 'i3']);
        expect(styleObj3.fields.id).toBe('id');
        expect(styleObj3.fields.name).toBe('name');
        expect(styleObj3.fields.table.id).toBe('id');
        expect(styleObj3.fields.table.name).toBe('name');
        expect(styleObj3.fields.table.innerTable.id).toBe('id');
        expect(styleObj3.fields.table.innerTable.name).toBe('name');
        styleObj3.destroy();
        elem.remove();
        Styler.prototype.getPersistData = actual;
    });

    it('add on persistence with an empty list', () => {
        window.localStorage.clear();
        let elem: HTMLElement = createElement('div', { id: 'addonP' });
        document.body.appendChild(elem);
        let list: string[] = [];
        let actual: () => string = Styler.prototype.getPersistData;
        Styler.prototype.getPersistData = function (): string {
            return this.addOnPersist(list);
        };
        let styleObj2: Styler = new Styler({ size: '20px', enablePersistence: true }, '#addonP');
        styleObj2.items = ['i1', 'i2', 'i3'];
        styleObj2.fields.id = 'EmpID';
        styleObj2.fields.name = 'EmpName';
        styleObj2.fields.table.id = 'TableID';
        styleObj2.fields.table.name = 'TableName';
        styleObj2.fields.table.innerTable.id = 'InnerTableID';
        styleObj2.fields.table.innerTable.name = 'InnerTableName';
        styleObj2.destroy();
        expect(window.localStorage.getItem('StyleraddonP')).toEqual('{}');
        let styleObj3: Styler = new Styler({ size: '20px', enablePersistence: true }, '#addonP');
        expect(styleObj3.items).toEqual([]);
        expect(styleObj3.fields.id).toBe('id');
        expect(styleObj3.fields.name).toBe('name');
        expect(styleObj3.fields.table.id).toBe('id');
        expect(styleObj3.fields.table.name).toBe('name');
        expect(styleObj3.fields.table.innerTable.id).toBe('id');
        expect(styleObj3.fields.table.innerTable.name).toBe('name');
        styleObj3.destroy();
        elem.remove();
        Styler.prototype.getPersistData = actual;
    });

    it('ignore on persistence with out complex', () => {
        let elem: HTMLElement = createElement('div', { id: 'ignoreP' });
        let list: string[] = ['size'];
        document.body.appendChild(elem);
        window.localStorage.clear();
        let actual: () => string = Styler.prototype.getPersistData;
        Styler.prototype.getPersistData = function (): string {
            return this.ignoreOnPersist(list);
        };

        let styleObj2: Styler = new Styler({ size: '20px', enablePersistence: true }, '#ignoreP');

        styleObj2.size = '200px';
        styleObj2.fields.id = 'EmpID';
        styleObj2.fields.name = 'EmpName';
        styleObj2.fields.table.id = 'TableID';
        styleObj2.fields.table.name = 'TableName';
        styleObj2.fields.table.innerTable.id = 'innerTableID';
        styleObj2.fields.table.innerTable.name = 'InnerTableName';
        styleObj2.destroy();
        expect(JSON.parse(window.localStorage.getItem('StylerignoreP')).fields).not.toEqual('');
        let styleObj3: Styler = new Styler({ size: '20px', enablePersistence: true }, '#ignoreP');
        expect(styleObj3.size).toEqual('20px');
        expect(styleObj3.fields.id).toBe('EmpID');
        expect(styleObj3.fields.name).toBe('EmpName');
        expect(styleObj3.fields.table.id).toBe('TableID');
        expect(styleObj3.fields.table.name).toBe('TableName');
        expect(styleObj3.fields.table.innerTable.id).toBe('innerTableID');
        expect(styleObj3.fields.table.innerTable.name).toBe('InnerTableName');
        styleObj3.destroy();
        elem.remove();
        Styler.prototype.getPersistData = actual;
    });

    it('ignore on persistence with an array', () => {
        let elem: HTMLElement = createElement('div', { id: 'ignoreP' });
        let list: string[] = ['items'];
        document.body.appendChild(elem);
        window.localStorage.clear();
        let actual: () => string = Styler.prototype.getPersistData;
        Styler.prototype.getPersistData = function (): string {
            return this.ignoreOnPersist(list);
        };

        let styleObj2: Styler = new Styler({ size: '20px', enablePersistence: true }, '#ignoreP');
        styleObj2.items = ['i1', 'i2'];
        styleObj2.size = '200px';
        styleObj2.fields.id = 'EmpID';
        styleObj2.fields.name = 'EmpName';
        styleObj2.fields.table.id = 'TableID';
        styleObj2.fields.table.name = 'TableName';
        styleObj2.fields.table.innerTable.id = 'innerTableID';
        styleObj2.fields.table.innerTable.name = 'InnerTableName';
        styleObj2.destroy();
        expect(JSON.parse(window.localStorage.getItem('StylerignoreP')).fields).not.toEqual('');
        let styleObj3: Styler = new Styler({ size: '20px', enablePersistence: true }, '#ignoreP');
        expect(styleObj3.items).toEqual([]);
        expect(styleObj3.size).toEqual('200px');
        expect(styleObj3.fields.id).toBe('EmpID');
        expect(styleObj3.fields.name).toBe('EmpName');
        expect(styleObj3.fields.table.id).toBe('TableID');
        expect(styleObj3.fields.table.name).toBe('TableName');
        expect(styleObj3.fields.table.innerTable.id).toBe('innerTableID');
        expect(styleObj3.fields.table.innerTable.name).toBe('InnerTableName');
        styleObj3.destroy();
        elem.remove();
        Styler.prototype.getPersistData = actual;
    });

    it('ignore on persistence with complex', () => {
        let elem: HTMLElement = createElement('div', { id: 'ignoreP' });
        let list: string[] = ['size', 'fields.name', 'fields.table.name', 'fields.table.innerTable.id'];
        document.body.appendChild(elem);
        window.localStorage.clear();
        let actual: () => string = Styler.prototype.getPersistData;
        Styler.prototype.getPersistData = function (): string {
            return this.ignoreOnPersist(list);
        };

        let styleObj2: Styler = new Styler({ size: '20px', enablePersistence: true }, '#ignoreP');
        styleObj2.size = '200px';
        styleObj2.fields.id = 'EmpID';
        styleObj2.fields.name = 'EmpName';
        styleObj2.fields.table.id = 'TableID';
        styleObj2.fields.table.name = 'TableName';
        styleObj2.fields.table.innerTable.id = 'innerTableID';
        styleObj2.fields.table.innerTable.name = 'InnerTableName';
        styleObj2.settings.color = 'Yellow';
        styleObj2.destroy();
        expect(JSON.parse(window.localStorage.getItem('StylerignoreP')).fields).not.toEqual('');
        let styleObj3: Styler = new Styler({ size: '20px', enablePersistence: true }, '#ignoreP');
        expect(styleObj3.size).toEqual('20px');
        expect(styleObj3.fields.id).toBe('EmpID');
        expect(styleObj3.fields.name).toBe('name');
        expect(styleObj3.fields.table.id).toBe('TableID');
        expect(styleObj3.fields.table.name).toBe('name');
        expect(styleObj3.fields.table.innerTable.id).toBe('id');
        expect(styleObj3.fields.table.innerTable.name).toBe('InnerTableName');
        expect(styleObj3.settings.color).toBe('Yellow');
        styleObj3.destroy();
        elem.remove();
        Styler.prototype.getPersistData = actual;
    });

    it('ignore on persistence with an empty list', () => {
        let elem: HTMLElement = createElement('div', { id: 'ignoreP' });
        let list: string[] = [];
        document.body.appendChild(elem);
        window.localStorage.clear();
        let actual: () => string = Styler.prototype.getPersistData;
        Styler.prototype.getPersistData = function (): string {
            return this.ignoreOnPersist(list);
        };

        let styleObj2: Styler = new Styler({ size: '20px', enablePersistence: true }, '#ignoreP');
        styleObj2.size = '200px';
        styleObj2.fields.id = 'EmpID';
        styleObj2.fields.name = 'EmpName';
        styleObj2.fields.table.id = 'TableID';
        styleObj2.fields.table.name = 'TableName';
        styleObj2.fields.table.innerTable.id = 'innerTableID';
        styleObj2.fields.table.innerTable.name = 'InnerTableName';
        styleObj2.settings.color = 'Yellow';
        styleObj2.destroy();
        expect(JSON.parse(window.localStorage.getItem('StylerignoreP')).fields).not.toEqual('');
        let styleObj3: Styler = new Styler({ size: '20px', enablePersistence: true }, '#ignoreP');
        expect(styleObj3.size).toEqual('200px');
        expect(styleObj3.fields.id).toBe('EmpID');
        expect(styleObj3.fields.name).toBe('EmpName');
        expect(styleObj3.fields.table.id).toBe('TableID');
        expect(styleObj3.fields.table.name).toBe('TableName');
        expect(styleObj3.fields.table.innerTable.id).toBe('innerTableID');
        expect(styleObj3.fields.table.innerTable.name).toBe('InnerTableName');
        expect(styleObj3.settings.color).toBe('Yellow');
        styleObj3.destroy();
        elem.remove();
        Styler.prototype.getPersistData = actual;
    });
    describe('Eventlisteners', () => {
        let event1Spy: jasmine.Spy;
        let event2SPy: jasmine.Spy;
        let observeIns: Styler;
        let evtName: string[] = ['event1'];
        let value: Object;
        let componentObj: Object = { test: 'context' };
        let cntxtFunction: Function = function (): void { value = this; };
        beforeEach(() => {
            let elem: HTMLElement = createElement('div', { id: 'observe' });
            document.body.appendChild(elem);
            observeIns = new Styler({ size: '20px' }, '#observe');
            event1Spy = jasmine.createSpy('event1');
            event2SPy = jasmine.createSpy('event2');
        });
        it('on adds handlers to the event properly', () => {
            observeIns.on('event1', event1Spy);
            observeIns.on([{ event: 'event2', handler: event2SPy }]);
            observeIns.notify('event1', {});
            observeIns.notify('event2', {});
            expect(event1Spy).toHaveBeenCalled();
        });
        it('off removes handlers from the specified event', () => {
            observeIns.event1 = event1Spy;
            observeIns.on([{ event: 'event1', handler: observeIns.event1 }, { event: 'event2', handler: cntxtFunction, context: componentObj }]);
            observeIns.off('event1', observeIns.event1);
            observeIns.notify('event1', {});
            observeIns.notify('event2', {});
            observeIns.off([{ event: 'event2', handler: cntxtFunction }]);
            expect(event1Spy).not.toHaveBeenCalled();
            expect(value).toBe(componentObj);
        });
        it('Check created event trigger properly ', () => {
            let spy: jasmine.Spy = jasmine.createSpy('created');
            let elem: HTMLElement = createElement('div', { id: 'myStyleDiv1' });
            document.body.appendChild(elem);
            let styleObj: Styler = new Styler({ size: '25px', created: spy }, elem);
            expect(spy).toHaveBeenCalled();
            styleObj.destroy();
            document.body.innerHTML = '';
        });
        it('Check destroy event trigger properly ', () => {
            let spy: jasmine.Spy = jasmine.createSpy('destroyed');
            let elem: HTMLElement = createElement('div', { id: 'myStyleDiv1' });
            document.body.appendChild(elem);
            let styleObj: Styler = new Styler({ size: '25px', destroyed: spy }, elem);
            styleObj.destroy();
            expect(spy).toHaveBeenCalled();
            document.body.innerHTML = '';
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });

    describe('no change detection', (): void => {
        let obj: Styler = new Styler();
        let spy: jasmine.Spy = jasmine.createSpy('detectSpy');
        it('before element', () => {
            obj.onPropertyChanged = spy;
            obj.size = '10px';
            obj.dataBind();
            expect(spy).not.toHaveBeenCalled();
        });
        it('after element', () => {
            let elem: HTMLElement = createElement('div', { id: 'ignoreP' });
            spy.calls.reset();
            obj.appendTo(elem);
            obj.size = '20px';
            obj.dataBind();
            expect(spy).toHaveBeenCalled();
        });
    });
    afterAll(() => {
        (<any>Styler1.prototype).injectedModules = [];
    });

    describe('refresh component', () => {
        let elem: HTMLElement = createElement('div');
        let refComponent: Styler;
        beforeAll(() => {
            refComponent = new Styler();
            refComponent.appendTo(elem);
        });
        it('before refresh', () => {
            expect(elem.classList.contains('e-control')).toBe(true);
            expect(elem.classList.contains('e-styler')).toBe(true);
        });
        it('after refresh', () => {
            refComponent.refresh();
            expect(elem.classList.contains('e-control')).toBe(true);
            expect(elem.classList.contains('e-styler')).toBe(true);
        });
    });

    describe('set element id', () => {
        let elem: HTMLElement = createElement('div');
        it('needsID, id dont exist', () => {
            let obj: any = new Styler();
            obj.needsID = true;
            obj.appendTo(elem);
            expect(elem.id).toBe('Styler_1135402174_0');
        });
        it('needsID, id dont exist with second', () => {
            let obj: any = new Styler();
            elem.id = '';
            obj.needsID = true;
            obj.appendTo(elem);
            expect(elem.id).toBe('Styler_1135402174_1');
        });
        it('needsID, id exists', () => {
            let obj1: any = new Styler();
            obj1.needsID = true;
            elem.id = 'demo';
            obj1.appendTo(elem);
            expect(elem.id).toBe('demo');
        });
    });

    describe('clean moduleloader ', () => {
        Styler1.Inject(Touch);
        let elem: HTMLElement = createElement('div');
        let spy: jasmine.Spy = jasmine.createSpy('refreshed');
        it('remove object when refresh', () => {
            let Obj: Styler1 = new Styler1({ size: '25px', destroyed: spy }, elem);
            Obj.appendTo(elem);
            Obj.touchModule.destroy = spy;
            Obj.refresh();
            expect(spy).toHaveBeenCalled();
        });
    });
});