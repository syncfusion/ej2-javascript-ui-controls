import { isUndefined, getValue, isNullOrUndefined, setValue, uniqueID, isBlazor } from './util';
import { ModuleLoader, ModuleDeclaration } from './module-loader';
import { Base } from './base';
import { Observer, BoundOptions } from './observer';
import { ChildProperty } from './child-property';
import { Property, NotifyPropertyChanges } from './notify-property-change';
import { onIntlChange, rightToLeft, defaultCulture } from './internationalization';
import { createElement, addClass, removeClass } from './dom';

let componentCount: number = 0;
let lastPageID: number;
let lastHistoryLen: number = 0;
/**
 * Base class for all Essential JavaScript components
 */
@NotifyPropertyChanges
export abstract class Component<ElementType extends HTMLElement> extends Base<ElementType> {

    public element: ElementType;
    private randomId: string = uniqueID();
    /**
     * Enable or disable persisting component's state between page reloads.
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Enable or disable rendering component in right to left direction.
     * @default false
     */
    @Property()
    public enableRtl: boolean;
    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     * @default ''
     */
    @Property()
    public locale: string;
    /**
     * string template option for Blazor template rendering
     * @private
     */
    public isStringTemplate: boolean = false;
    protected needsID: boolean = false;
    protected moduleLoader: ModuleLoader;
    protected localObserver: Observer;
    protected abstract render(): void;
    protected abstract preRender(): void;
    protected abstract getPersistData(): string;
    protected injectedModules: Function[];
    protected requiredModules(): ModuleDeclaration[] {
        return [];
    };
    protected isRendered: boolean = false;
    /**
     * Destroys the sub modules while destroying the widget
     */
    protected destroy(): void {
        if (this.isDestroyed) { return; }
        if (this.enablePersistence) {
            this.setPersistData();
        }
        this.localObserver.destroy();
        if (this.refreshing) { return; }
        removeClass([this.element], ['e-control']);
        this.trigger('destroyed', { cancel: false });
        super.destroy();
        this.moduleLoader.clean();
        onIntlChange.off('notifyExternalChange', this.detectFunction, this.randomId);
    }
    /**
     * Applies all the pending property changes and render the component again.
     */
    public refresh(): void {
        this.refreshing = true;
        this.moduleLoader.clean();
        this.destroy();
        this.clearChanges();
        this.localObserver = new Observer(this);
        this.preRender();
        this.injectModules();
        this.render();
        this.refreshing = false;
    }
    /**
     * Appends the control within the given HTML element
     * @param {string | HTMLElement} selector - Target element where control needs to be appended
     */
    public appendTo(selector?: string | HTMLElement): void {
        if (!isNullOrUndefined(selector) && typeof (selector) === 'string') {
            this.element = <ElementType>document.querySelector(<string>selector);
        } else if (!isNullOrUndefined(selector)) {
            this.element = <ElementType>selector;
        }
        if (!isNullOrUndefined(this.element)) {
            let moduleClass: string = 'e-' + this.getModuleName().toLowerCase();
            addClass([this.element], ['e-control', moduleClass]);
            this.isProtectedOnChange = false;
            if (this.needsID && !this.element.id) {
                this.element.id = this.getUniqueID(this.getModuleName());
            }
            if (this.enablePersistence) {
                this.mergePersistData();
                window.addEventListener('unload', this.setPersistData.bind(this));
            }
            let inst: Object[] = getValue('ej2_instances', this.element);
            if (!inst || inst.indexOf(this) === -1) {
                super.addInstance();
            }
            this.preRender();
            this.injectModules();
            this.render();
            this.trigger('created');
        }
    }

    /**
     * It is used to process the post rendering functionalities to a component.
     */
    protected renderComplete(wrapperElement?: Node): void {
        if (isBlazor()) {
            let ejsInterop: string = 'ejsInterop';
            // tslint:disable-next-line:no-any
            (window as any)[ejsInterop].renderComplete(this.element, wrapperElement);
        }
        this.isRendered = true;
    }

    /**
     * When invoked, applies the pending property changes immediately to the component.
     */
    public dataBind(): void {
        this.injectModules();
        super.dataBind();
    };
    /**
     * Attach one or more  event handler to the current component context.
     * It is used for internal handling event internally within the component only.
     * @param {BoundOptions[]| string} event - It is  optional type either to  Set the collection of event list or the eventName.
     * @param {Function} handler - optional parameter Specifies the handler to run when the event occurs
     * @param {Object} context - optional parameter Specifies the context to be bind in the handler.
     * @return {void}
     * @private
     */
    public on(event: BoundOptions[] | string, handler?: Function, context?: Object): void {
        if (typeof event === 'string') {
            this.localObserver.on(event, handler, context);
        } else {
            for (let arg of event) {
                this.localObserver.on(arg.event, arg.handler, arg.context);
            }
        }

    }

    /**
     * To remove one or more event handler that has been attached with the on() method.
     * @param {BoundOptions[]| string} event - It is  optional type either to  Set the collection of event list or the eventName.
     * @param {Function} handler - optional parameter Specifies the function to run when the event occurs
     * @return {void}
     * @private
     */
    public off(event: BoundOptions[] | string, handler?: Function): void {
        if (typeof event === 'string') {
            this.localObserver.off(event, handler);
        } else {
            for (let arg of event) {
                this.localObserver.off(arg.event, arg.handler);
            }
        }
    }
    /**
     * To notify the handlers in the specified event.
     * @param {string} property - Specifies the event to be notify.
     * @param {Object} argument - Additional parameters to pass while calling the handler.
     * @return {void}
     * @private
     */
    public notify(property: string, argument: Object): void {
        if (this.isDestroyed !== true) {
            this.localObserver.notify(property, argument);
        }
    }
    /**
     * Get injected modules
     * @private
     */
    public getInjectedModules(): Function[] {
        return this.injectedModules;
    };

    /**
     * Dynamically injects the required modules to the component.
     */
    public static Inject(...moduleList: Function[]): void {
        if (!this.prototype.injectedModules) {
            this.prototype.injectedModules = [];
        }
        for (let i: number = 0; i < moduleList.length; i++) {
            if (this.prototype.injectedModules.indexOf(moduleList[i]) === -1) {
                this.prototype.injectedModules.push(moduleList[i]);
            }
        }
    }

    /**
     * Initialize the constructor for component base
     */
    constructor(options?: Object, selector?: string | ElementType) {
        super(options, selector);
        if (isNullOrUndefined(this.enableRtl)) {
            this.setProperties({ 'enableRtl': rightToLeft }, true);
        }
        if (isNullOrUndefined(this.locale)) {
            this.setProperties({ 'locale': defaultCulture }, true);
        }
        this.moduleLoader = new ModuleLoader(this);
        this.localObserver = new Observer(this);
        // tslint:disable-next-line:no-function-constructor-with-string-args
        onIntlChange.on('notifyExternalChange', this.detectFunction, this, this.randomId);
        if (!isUndefined(selector)) {
            this.appendTo();
        }
    }
    /**
     * This is a instance method to create an element.
     * @private
     */
    public createElement: (
        tag: string,
        prop?: { id?: string, className?: string, innerHTML?: string, styles?: string, attrs?: { [key: string]: string } }
    ) => HTMLElement = createElement;

    private injectModules(): void {
        if (this.injectedModules && this.injectedModules.length) {
            this.moduleLoader.inject(this.requiredModules(), this.injectedModules);
        }
    }

    private detectFunction(args: Object): void {
        let prop: string[] = Object.keys(args);
        if (prop.length) {
            this[prop[0]] = args[prop[0]];
        }
    }

    private mergePersistData(): void {
        let data: string = window.localStorage.getItem(this.getModuleName() + this.element.id);
        if (!(isNullOrUndefined(data) || (data === ''))) {
            this.setProperties(JSON.parse(data), true);
        }
    }
    private setPersistData(): void {
        if (!this.isDestroyed) {
            window.localStorage.setItem(this.getModuleName() + this.element.id, this.getPersistData());
        }
    }

    //tslint:disable-next-line
    protected clearTemplate(templateName?: string[], index?: any): void {
        //No Code
    }

    private getUniqueID(definedName?: string): string {
        if (this.isHistoryChanged()) {
            componentCount = 0;
        }
        lastPageID = this.pageID(location.href);
        lastHistoryLen = history.length;
        return definedName + '_' + lastPageID + '_' + componentCount++;
    }

    private pageID(url: string): number {
        let hash: number = 0;
        if (url.length === 0) { return hash; }
        for (let i: number = 0; i < url.length; i++) {
            let char: number = url.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    private isHistoryChanged(): boolean {
        return lastPageID !== this.pageID(location.href) || lastHistoryLen !== history.length;
    }

    protected addOnPersist(options: string[]): string {
        let persistObj: Object = {};
        for (let key of options) {
            let objValue: Object;
            objValue = getValue(key, this);
            if (!isUndefined(objValue)) {
                setValue(key, this.getActualProperties(objValue), persistObj);
            }
        }
        return JSON.stringify(persistObj, (key: string, value: Object) => {
            return this.getActualProperties(value);
        });
    }

    protected getActualProperties<T>(obj: T): T {
        if (obj instanceof ChildProperty) {
            return <T>getValue('properties', obj);
        } else {
            return obj;
        }
    }

    protected ignoreOnPersist(options: string[]): string {
        return JSON.stringify(this.iterateJsonProperties(this.properties, options));
    }

    protected iterateJsonProperties(obj: { [key: string]: Object }, ignoreList: string[]): Object {
        let newObj: { [key: string]: Object } = {};
        for (let key of Object.keys(obj)) {
            if (ignoreList.indexOf(key) === -1) {
                // tslint:disable-next-line:no-any
                let value: any = obj[key];
                if (typeof value === 'object' && !(value instanceof Array)) {
                    let newList: string[] = ignoreList.filter((str: string): boolean => {
                        return new RegExp(key + '.').test(str);
                    }).map((str: string): string => {
                        return str.replace(key + '.', '');
                    });
                    newObj[key] = this.iterateJsonProperties(this.getActualProperties(value), newList);
                } else {
                    newObj[key] = value;
                }
            }
        }
        return newObj;
    }
}

//Function handling for page navigation detection 
/* istanbul ignore next */
(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener(
            'popstate',
            /* istanbul ignore next */
            () => {
                componentCount = 0;
            });
    }
})();
