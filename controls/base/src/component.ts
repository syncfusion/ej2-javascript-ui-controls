import { isUndefined, getValue, isNullOrUndefined, setValue, uniqueID, isBlazor } from './util';
import { ModuleLoader, ModuleDeclaration } from './module-loader';
import { Base } from './base';
import { Observer, BoundOptions } from './observer';
import { ChildProperty } from './child-property';
import { Property, NotifyPropertyChanges } from './notify-property-change';
import { onIntlChange, rightToLeft, defaultCulture } from './internationalization';
import { createElement, addClass, removeClass, ElementProperties, select } from './dom';
let componentCount: number = 0;
let lastPageID: number;
let lastHistoryLen: number = 0;
export let versionBasedStatePersistence: boolean = false;

/**
 * To enable or disable version based statePersistence functionality for all components globally.
 *
 * @param {boolean} status - Optional argument Specifies the status value to enable or disable versionBasedStatePersistence option.
 * @returns {void}
 */
export function enableVersionBasedPersistence(status: boolean): void {
    versionBasedStatePersistence = status;
}
/**
 * Base class for all Essential JavaScript components
 */
@NotifyPropertyChanges
export abstract class Component<ElementType extends HTMLElement> extends Base<ElementType> {

    public element: ElementType;
    private randomId: string = uniqueID();
    public ej2StatePersistenceVersion: string;
    /**
     * Enable or disable persisting component's state between page reloads.
     *
     * @default false
     */
    @Property(false)
    public enablePersistence: boolean;

    /**
     * Enable or disable rendering component in right to left direction.
     *
     * @default false
     */
    @Property()
    public enableRtl: boolean;
    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     *
     * @default ''
     */
    @Property()
    public locale: string;
    /**
     * string template option for Blazor template rendering
     *
     * @private
     */
    public isStringTemplate: boolean = false;
    // eslint-disable-next-line
    public currentContext: { calls?: Function, args?: any };
    protected needsID: boolean = false;
    protected isReactHybrid: boolean = false;
    protected moduleLoader: ModuleLoader;
    protected localObserver: Observer;
    protected abstract render(): void;
    protected abstract preRender(): void;
    protected abstract getPersistData(): string;
    protected injectedModules: Function[];
    protected mount: Function;
    protected requiredModules(): ModuleDeclaration[] {
        return [];
    }

    /**
     * Destroys the sub modules while destroying the widget
     *
     * @returns {void} ?
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
     *
     * @returns {void} ?
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

    private accessMount(): void {
        if (this.mount && !this.isReactHybrid) {
            this.mount();
        }
    }
    /**
     * Returns the route element of the component
     *
     * @returns {HTMLElement} ?
     */
    public getRootElement(): HTMLElement {
        if (this.isReactHybrid) {
            // eslint-disable-next-line
            return (this as any).actualElement;
        } else {
            return this.element;
        }
    }
    /**
     * Returns the persistence data for component
     *
     * @returns {any} ?
     */
    // eslint-disable-next-line
    public getLocalData(): any {
        const eleId: string = this.getModuleName() + this.element.id;
        if (versionBasedStatePersistence) {
            return window.localStorage.getItem(eleId + this.ej2StatePersistenceVersion);
        } else {
            return window.localStorage.getItem(eleId);
        }
    }
    /**
     * Appends the control within the given HTML element
     *
     * @param {string | HTMLElement} selector - Target element where control needs to be appended
     * @returns {void} ?
     */
    public appendTo(selector?: string | HTMLElement): void {
        if (!isNullOrUndefined(selector) && typeof (selector) === 'string') {
            this.element = <ElementType>select(<string>selector, document);
        } else if (!isNullOrUndefined(selector)) {
            this.element = <ElementType>selector;
        }
        if (!isNullOrUndefined(this.element)) {
            const moduleClass: string = 'e-' + this.getModuleName().toLowerCase();
            addClass([this.element], ['e-control', moduleClass]);
            this.isProtectedOnChange = false;
            if (this.needsID && !this.element.id) {
                this.element.id = this.getUniqueID(this.getModuleName());
            }
            if (this.enablePersistence) {
                this.mergePersistData();
                window.addEventListener('unload', this.setPersistData.bind(this));
            }
            const inst: Object[] = getValue('ej2_instances', this.element);
            if (!inst || inst.indexOf(this) === -1) {
                super.addInstance();
            }
            this.preRender();
            this.injectModules();
            this.render();
            if (!this.mount) {
                this.trigger('created');
            } else {
                this.accessMount();
            }
        }
    }

    /**
     * It is used to process the post rendering functionalities to a component.
     *
     * @param {Node} wrapperElement ?
     * @returns {void} ?
     */
    protected renderComplete(wrapperElement?: Node): void {
        if (isBlazor()) {
            const sfBlazor: string = 'sfBlazor';
            // eslint-disable-next-line
            (window as any)[sfBlazor].renderComplete(this.element, wrapperElement);
        }
        this.isRendered = true;
    }

    /**
     * When invoked, applies the pending property changes immediately to the component.
     *
     * @returns {void} ?
     */
    public dataBind(): void {
        this.injectModules();
        super.dataBind();
    }
    /**
     * Attach one or more  event handler to the current component context.
     * It is used for internal handling event internally within the component only.
     *
     * @param {BoundOptions[]| string} event - It is  optional type either to  Set the collection of event list or the eventName.
     * @param {Function} handler - optional parameter Specifies the handler to run when the event occurs
     * @param {Object} context - optional parameter Specifies the context to be bind in the handler.
     * @returns {void} ?
     * @private
     */
    public on(event: BoundOptions[] | string, handler?: Function, context?: Object): void {
        if (typeof event === 'string') {
            this.localObserver.on(event, handler, context);
        } else {
            for (const arg of event) {
                this.localObserver.on(arg.event, arg.handler, arg.context);
            }
        }

    }

    /**
     * To remove one or more event handler that has been attached with the on() method.
     *
     * @param {BoundOptions[]| string} event - It is  optional type either to  Set the collection of event list or the eventName.
     * @param {Function} handler - optional parameter Specifies the function to run when the event occurs
     * @returns {void} ?
     * @private
     */
    public off(event: BoundOptions[] | string, handler?: Function): void {
        if (typeof event === 'string') {
            this.localObserver.off(event, handler);
        } else {
            for (const arg of event) {
                this.localObserver.off(arg.event, arg.handler);
            }
        }
    }
    /**
     * To notify the handlers in the specified event.
     *
     * @param {string} property - Specifies the event to be notify.
     * @param {Object} argument - Additional parameters to pass while calling the handler.
     * @returns {void} ?
     * @private
     */
    public notify(property: string, argument: Object): void {
        if (this.isDestroyed !== true) {
            this.localObserver.notify(property, argument);
        }
    }
    /**
     * Get injected modules
     *
     * @returns {Function} ?
     * @private
     */
    public getInjectedModules(): Function[] {
        return this.injectedModules;
    }

    /**
     * Dynamically injects the required modules to the component.
     *
     * @param {Function} moduleList ?
     * @returns {void} ?
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
     *
     * @param {Object} options ?
     * @param {string} selector ?
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
     *
     * @param {string} tagName ?
     * @param {ElementProperties} prop ?
     * @param {boolean} isVDOM ?
     * @returns {any} ?
     * @private
     */
    // eslint-disable-next-line
    public createElement(tagName: string, prop?: ElementProperties, isVDOM?: boolean): any {
        return createElement(tagName, prop);
    }
    /**
     *
     * @param {Function} handler - handler to be triggered after state Updated.
     * @param {any} argument - Arguments to be passed to caller.
     * @returns {void} .
     * @private
     */
    // eslint-disable-next-line
    public triggerStateChange(handler?: Function, argument?: any): void {
        if (this.isReactHybrid) {
            // eslint-disable-next-line
            (this as any).setState();
            this.currentContext = { calls: handler, args: argument };
        }

    }
    // tslint: enable: no-any
    private injectModules(): void {
        if (this.injectedModules && this.injectedModules.length) {
            this.moduleLoader.inject(this.requiredModules(), this.injectedModules);
        }
    }

    private detectFunction(args: Object): void {
        const prop: string[] = Object.keys(args);
        if (prop.length) {
            this[prop[0]] = args[prop[0]];
        }
    }

    private mergePersistData(): void {
        let data: string;
        if (versionBasedStatePersistence) {
            data = window.localStorage.getItem(this.getModuleName() + this.element.id + this.ej2StatePersistenceVersion);
        } else {
            data = window.localStorage.getItem(this.getModuleName() + this.element.id);
        }
        if (!(isNullOrUndefined(data) || (data === ''))) {
            this.setProperties(JSON.parse(data), true);
        }
    }
    private setPersistData(): void {
        if (!this.isDestroyed) {
            if (versionBasedStatePersistence) {
                window.localStorage.setItem(this.getModuleName() +
                this.element.id + this.ej2StatePersistenceVersion, this.getPersistData());
            } else {
                window.localStorage.setItem(this.getModuleName() + this.element.id, this.getPersistData());
            }
        }
    }

    //tslint:disable-next-line
    protected renderReactTemplates(): void {
        //No Code
    }

    // eslint-disable-next-line
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
            const char: number = url.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    private isHistoryChanged(): boolean {
        return lastPageID !== this.pageID(location.href) || lastHistoryLen !== history.length;
    }

    protected addOnPersist(options: string[]): string {
        const persistObj: Object = {};
        for (const key of options) {
            let objValue: Object;
            // eslint-disable-next-line
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
        const newObj: { [key: string]: Object } = {};
        for (const key of Object.keys(obj)) {
            if (ignoreList.indexOf(key) === -1) {
                // eslint-disable-next-line
                const value: any = obj[key];
                if (typeof value === 'object' && !(value instanceof Array)) {
                    const newList: string[] = ignoreList.filter((str: string): boolean => {
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
