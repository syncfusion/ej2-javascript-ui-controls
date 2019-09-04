import { createInstance, isUndefined, merge, extend, getValue } from './util';
/**
 * Interface for Class Object
 */
interface ClassObject {
    properties: Object & { [key: string]: Object };
    setProperties: (arg: Object, muteOnChange?: boolean) => void;
}
/**
 * Interface for Parent Options
 */
interface ParentOption {
    context: EventListener;
    prefix?: string;
}
/**
 * Interface for Event Listener
 */
interface EventListener {
    addEventListener: Function;
    removeEventListener: Function;
}
/**
 * Interface for builder options.
 */
interface BuildInfo {
    /**
     * Specifies the builder object used for component builder.
     */
    builderObject: { [key: string]: Object };
    props?: string[];
    events?: string[];
    propList: {
        props: PropertyCollectionInfo[],
        complexProps: PropertyCollectionInfo[],
        colProps: PropertyCollectionInfo[],
        events: PropertyCollectionInfo[],
        propNames: PropertyCollectionInfo[],
        complexPropNames: PropertyCollectionInfo[],
        colPropNames: PropertyCollectionInfo[],
        eventNames: PropertyCollectionInfo[]
    };
}

/**
 * Interface for property collection options.
 */
interface PropertyCollectionInfo {
    /**
     * Specifies name of the property
     */
    propertyName: string;
    /**
     * Specifies type of the property
     */
    propertyType: string;

    type: FunctionConstructor | Object;
    /**
     * Specifies the default value
     */
    defaultValue: Object;
    /**
     * Specifies if the property is complex.
     */
    isComplex: boolean;
}

/**
 * Interface for child builder options.
 */
interface ChildInfo {
    /**
     * Specifies the child properties. 
     */
    properties?: { [key: string]: Object };
    /**
     * Specifies whether the property value is array type.
     */
    isPropertyArray?: boolean;
    /**
     *  Specifies whether the array collection of the values.
     */
    propCollections?: Object[];
    [key: string]: Object;
}
/**
 * Returns the Class Object
 * @param {ClassObject} instance - instance of ClassObject
 * @param {string} curKey - key of the current instance
 * @param {Object} defaultValue - default Value
 * @param {Object[]} type 
 */
function getObject<T>(instance: ClassObject & Object, curKey: string, defaultValue: Object, type:
    (...arg: Object[]) => void): ClassObject {
    if (!instance.properties.hasOwnProperty(curKey) || !(instance.properties[curKey] instanceof type)) {
        instance.properties[curKey] = createInstance(type, [instance, curKey, defaultValue]);
    }
    return <ClassObject>instance.properties[curKey];
}
/**
 * Returns object array 
 * @param {ClassObject} instance 
 * @param {string} curKey 
 * @param {Object[]} defaultValue 
 * @param type 
 * @param {boolean} isSetter 
 * @returns {Object[]}
 */
function getObjectArray<T>(
    instance: ClassObject & Object,
    curKey: string,
    defaultValue: Object[],
    type: (...arg: Object[]) => Object,
    isSetter?: boolean,
    isFactory?: boolean
): Object[] {

    let result: Object[] = [];
    let len: Number = defaultValue ? defaultValue.length : 0;
    for (let i: number = 0; i < len; i++) {
        let curType: (...arg: Object[]) => void = type;
        if (isFactory) {
            curType = <(...arg: Object[]) => void>type(defaultValue[i], instance);
        }
        if (isSetter) {
            let inst: ClassObject = createInstance(curType, [instance, curKey, {}, true]);
            inst.setProperties(defaultValue[i], true);
            result.push(inst);
        } else {
            result.push(createInstance(curType, [instance, curKey, defaultValue[i], true]));
        }
    }
    return result;
}

/**
 * Returns the properties of the object
 * @param {Object} defaultValue 
 * @param {string} curKey 
 */
function propertyGetter(defaultValue: Object, curKey: string): () => void {
    return function (): Object {
        if (!this.properties.hasOwnProperty(curKey)) {
            this.properties[curKey] = defaultValue;
        }
        return this.properties[curKey];
    };
}
/**
 * Set the properties for the object
 * @param {Object} defaultValue 
 * @param {string} curKey 
 */
function propertySetter(defaultValue: Object, curKey: string): (arg: Object) => void {
    return function (newValue: Object): void {
        if (this.properties[curKey] !== newValue) {
            let oldVal: Object = this.properties.hasOwnProperty(curKey) ? this.properties[curKey] : defaultValue;
            this.saveChanges(curKey, newValue, oldVal);
            this.properties[curKey] = newValue;
        }
    };
}
/**
 * Returns complex objects
 */
function complexGetter<T>(defaultValue: Object, curKey: string, type: (...arg: Object[]) => void): () => void {
    return function (): Object {
        return getObject(this, curKey, defaultValue, type);
    };
}
/**
 * Sets complex objects
 */
function complexSetter(defaultValue: Object, curKey: string, type: (...arg: Object[]) => void): (arg: Object) => void {
    return function (newValue: Object): void {
        getObject(this, curKey, defaultValue, type).setProperties(newValue);
    };
}
function complexFactoryGetter<T>(defaultValue: Object, curKey: string, type: FunctionConstructor): () => void {
    return function (): Object {
        let curType: Function = (<(arg: Object) => Function>type)({});
        if (this.properties.hasOwnProperty(curKey)) {
            return this.properties[curKey];
        } else {
            return getObject(this, curKey, defaultValue, <FunctionConstructor>curType);
        }
    };
}

function complexFactorySetter(
    defaultValue: Object,
    curKey: string,
    type: (...arg: Object[]) => Object): (arg: Object) => void {
    return function (newValue: Object): void {
        let curType: (...arg: Object[]) => void = <(...arg: Object[]) => void>type(newValue, this);
        getObject(this, curKey, defaultValue, curType).setProperties(newValue);
    };
}

function complexArrayGetter(defaultValue: Object[], curKey: string, type: (...arg: Object[]) => object): () => void {
    return function (): Object[] {
        if (!this.properties.hasOwnProperty(curKey)) {
            let defCollection: Object[] = getObjectArray(this, curKey, defaultValue, type, false);
            this.properties[curKey] = defCollection;
        }
        return this.properties[curKey];
    };
}

function complexArraySetter(defaultValue: Object[], curKey: string, type: (...arg: Object[]) => object): (arg: Object) => void {
    return function (newValue: Object[]): void {
        let oldValueCollection: Object[] = getObjectArray(this, curKey, defaultValue, type, false);
        let newValCollection: Object[] = getObjectArray(this, curKey, newValue, type, true);
        this.saveChanges(curKey, newValCollection, oldValueCollection);
        this.properties[curKey] = newValCollection;
    };
}

function complexArrayFactorySetter(
    defaultValue: Object[],
    curKey: string,
    type: (...arg: Object[]) => void): (arg: Object) => void {
    return function (newValue: Object[]): void {
        let oldValueCollection: Object[] = this.properties.hasOwnProperty(curKey) ? this.properties[curKey] : defaultValue;
        let newValCollection: Object[] = getObjectArray(this, curKey, newValue, <(...arg: Object[]) => object>type, true, true);
        this.saveChanges(curKey, newValCollection, oldValueCollection);
        this.properties[curKey] = newValCollection;
    };
}

function complexArrayFactoryGetter(
    defaultValue: Object[],
    curKey: string,
    type: FunctionConstructor
): () => void {
    return function (): Object[] {
        let curType: Function = (<(arg: Object) => Function>type)({});
        if (!this.properties.hasOwnProperty(curKey)) {
            let defCollection: Object[] = getObjectArray(this, curKey, defaultValue, <FunctionConstructor>curType, false);
            this.properties[curKey] = defCollection;
        }
        return this.properties[curKey];
    };
}

/**
 * Method used to create property. General syntax below.
 * @param  {T} defaultValue? - Specifies the default value of property.
 * ```
 * @Property('TypeScript')
 * propertyName: Type;
 * ```
 * @private
 */
export function Property<T>(defaultValue?: T | Object): PropertyDecorator {

    return (target: Object, key: string) => {
        let propertyDescriptor: Object = {
            set: propertySetter(defaultValue, key),
            get: propertyGetter(defaultValue, key),
            enumerable: true,
            configurable: true
        };

        //new property creation
        Object.defineProperty(target, key, propertyDescriptor);
        addPropertyCollection(<BuildInfo>target, key, 'prop', defaultValue);
    };
}

/**
 * Method used to create complex property. General syntax below.
 * @param  {T} defaultValue - Specifies the default value of property.
 * @param  {Function} type - Specifies the class type of complex object.
 * ```
 * @Complex<Type>({},Type)
 * propertyName: Type;
 * ```
 * @private
 */
export function Complex<T>(defaultValue: T, type: Function): PropertyDecorator {

    return (target: Object, key: string) => {
        let propertyDescriptor: Object = {
            set: complexSetter(defaultValue, key, <FunctionConstructor>type),
            get: complexGetter(defaultValue, key, <FunctionConstructor>type),
            enumerable: true,
            configurable: true
        };

        //new property creation
        Object.defineProperty(target, key, propertyDescriptor);
        addPropertyCollection(<BuildInfo>target, key, 'complexProp', defaultValue, <Function>type);
    };
}


/**
 * Method used to create complex Factory property. General syntax below.
 * @param  {Function} defaultType - Specifies the default value of property.
 * @param  {Function} type - Specifies the class factory type of complex object.
 * ```
 * @ComplexFactory(defaultType, factoryFunction)
 * propertyName: Type1 | Type2;
 * ```
 * @private
 */
export function ComplexFactory(type: Function): PropertyDecorator {
    return (target: Object, key: string) => {
        let propertyDescriptor: Object = {
            set: complexFactorySetter({}, key, <FunctionConstructor>type),
            get: complexFactoryGetter({}, key, <FunctionConstructor>type),
            enumerable: true,
            configurable: true
        };

        //new property creation
        Object.defineProperty(target, key, propertyDescriptor);
        addPropertyCollection(<BuildInfo>target, key, 'complexProp', {}, <Function>type);
    };
}

/**
 * Method used to create complex array property. General syntax below.
 * @param  {T[]} defaultValue - Specifies the default value of property.
 * @param  {Function} type - Specifies the class type of complex object.
 * ```
 * @Collection([], Type);
 * propertyName: Type;
 * ```
 * @private
 */
export function Collection<T>(defaultValue: T[], type: Function): PropertyDecorator {

    return (target: Object, key: string) => {
        let propertyDescriptor: Object = {
            set: complexArraySetter(defaultValue, key, <FunctionConstructor>type),
            get: complexArrayGetter(defaultValue, key, <FunctionConstructor>type),
            enumerable: true,
            configurable: true
        };

        //new property creation
        Object.defineProperty(target, key, propertyDescriptor);
        addPropertyCollection(<BuildInfo>target, key, 'colProp', defaultValue, <Function>type);
    };
}

/**
 * Method used to create complex factory array property. General syntax below.
 * @param  {T[]} defaultType - Specifies the default type of property.
 * @param  {Function} type - Specifies the class type of complex object.
 * ```
 * @Collection([], Type);
 * propertyName: Type;
 * ```
 * @private
 */
export function CollectionFactory(type: Function): PropertyDecorator {
    return (target: Object, key: string) => {
        let propertyDescriptor: Object = {
            set: complexArrayFactorySetter([], key, <FunctionConstructor>type),
            get: complexArrayFactoryGetter([], key, <FunctionConstructor>type),
            enumerable: true,
            configurable: true
        };

        //new property creation
        Object.defineProperty(target, key, propertyDescriptor);
        addPropertyCollection(<BuildInfo>target, key, 'colProp', {}, <Function>type);
    };
}



/** 
 * Method used to create event property. General syntax below. 
 * @param  {Function} defaultValue? - Specifies the default value of property.
 * @param  {boolean} isComplex? - Specifies the whether it is complex object.
 * ```
 * @Event(()=>{return true;})
 * ``` 
 * @private
 */
export function Event(): PropertyDecorator {
    return (target: Object, key: string) => {
        let eventDescriptor: Object = {
            set: function (newValue: Function): void {
                let oldValue: Function = this.properties[key];
                if (oldValue !== newValue) {
                    let finalContext: ParentOption = getParentContext(this, key);
                    if (isUndefined(oldValue) === false) {
                        finalContext.context.removeEventListener(finalContext.prefix, oldValue);
                    }
                    finalContext.context.addEventListener(finalContext.prefix, newValue);
                    this.properties[key] = newValue;
                }
            },
            get: propertyGetter(undefined, key),
            enumerable: true,
            configurable: true
        };
        Object.defineProperty(target, key, eventDescriptor);
        addPropertyCollection(<BuildInfo>target, key, 'event');
    };

}
/**
 * NotifyPropertyChanges is triggers the call back when the property has been changed.
 *
 * ```
 *  @NotifyPropertyChanges
 * class DemoClass implements INotifyPropertyChanged {
 *
 *     @Property()
 *     property1: string;
 *
 *     dataBind: () => void;
 *
 *     constructor() { }
 *
 *     onPropertyChanged(newProp: any, oldProp: any) {
 *         // Called when property changed
 *     }
 * }
 * ```
 * @private
 */
export function NotifyPropertyChanges(classConstructor: Function): void {
    /** Need to code */
}

/**
 * Method  used to create the builderObject for the target component.
 * @private
 */
function addPropertyCollection<T>(
    target: BuildInfo, key: string, propertyType: string, defaultValue?: Object,
    type?: T & Function): void {

    if (isUndefined(target.propList)) {
        target.propList = {
            props: [],
            complexProps: [],
            colProps: [],
            events: [],
            propNames: [],
            complexPropNames: [],
            colPropNames: [],
            eventNames: []
        };
    }

    /* tslint:disable no-any */
    (<any>target).propList[propertyType + 's'].push({
        propertyName: key,
        defaultValue: defaultValue,
        type: type
    });
    (<any>target).propList[propertyType + 'Names'].push(key);
    /* tslint:enable no-any */

}

/**
 * Returns an object containing the builder properties
 * @param {Function} component
 * @private
 */

function getBuilderProperties(component: Function): Object {
    if (isUndefined(component.prototype.builderObject)) {
        component.prototype.builderObject = {
            properties: {}, propCollections: [], add: function (): void {
                this.isPropertyArray = true;
                this.propCollections.push(extend({}, this.properties, {}));
            }
        };
        let rex: RegExp = /complex/;
        for (let key of Object.keys(component.prototype.propList)) {
            for (let prop of component.prototype.propList[key]) {
                if (rex.test(key)) {
                    component.prototype.builderObject[prop.propertyName] = function (value: Function): Object {
                        let childType: ChildInfo = {};
                        merge(childType, getBuilderProperties(prop.type));
                        value(childType);
                        let tempValue: Object;
                        if (!childType.isPropertyArray) {
                            tempValue = extend({}, childType.properties, {});
                        } else {
                            tempValue = childType.propCollections;
                        }
                        this.properties[prop.propertyName] = tempValue;
                        childType.properties = {};
                        childType.propCollections = [];
                        childType.isPropertyArray = false;
                        return this;
                    };
                } else {
                    component.prototype.builderObject[prop.propertyName] = function (value: Object): Object {
                        this.properties[prop.propertyName] = value;
                        return this;
                    };
                }
            }
        }
    }
    return component.prototype.builderObject;
}
/**
 * Interface to notify the changed properties
 */
export interface INotifyPropertyChanged {
    onPropertyChanged(newProperties: Object, oldProperties?: Object): void;
}
/**
 * Method used to create builder for the components
 * @param {any} component -specifies the target component for which builder to be created.
 * @private 
 */
export function CreateBuilder<T>(component: T): Object {

    let builderFunction: Function = function (element: string | HTMLElement | HTMLInputElement | HTMLButtonElement): void {
        this.element = element;
        return this;
    };
    let instanceFunction: Function = (element: string | HTMLElement | HTMLInputElement | HTMLButtonElement): Object => {
        if (!builderFunction.prototype.hasOwnProperty('create')) {
            builderFunction.prototype = getBuilderProperties(<Function & T>component);
            builderFunction.prototype.create = function (): Object {
                let temp: string = <string>extend({}, {}, this.properties);
                this.properties = {};
                return new (<FunctionConstructor & T>component)(temp, this.element);
            };
        }
        return new (builderFunction as FunctionConstructor)(<string>element);
    };
    return instanceFunction;

}
/**
 * Returns parent options for the object
 * @param {Object} context 
 * @param {string} prefix 
 * @private
 */
function getParentContext(context: Object, prefix: string): ParentOption {
    if (context.hasOwnProperty('parentObj') === false) {
        return { context: <EventListener>context, prefix: prefix };
    } else {
        let curText: string = getValue('propName', context);
        if (curText) {
            prefix = curText + '-' + prefix;
        }
        return getParentContext(getValue('parentObj', context), prefix);
    }
}