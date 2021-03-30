/**
 * Module loading operations
 */
import { isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';
const MODULE_SUFFIX: string = 'Module';

export interface ModuleDeclaration {
    args: Object[];
    member: string;
    isProperty?: boolean;
}

export interface IParent {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [key: string]: any;
}

/**
 * To get nameSpace value from the desired object.
 *
 * @param {string} nameSpace - String value to the get the inner object
 * @param {any} obj - Object to get the inner object value.
 * @returns {any} - To get nameSpace value from the desired object.
 * @private
 */
export function getValue(nameSpace: string, obj: any): any {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    let value: any = obj;
    const splits: string[] = nameSpace.replace(/\[/g, '.').replace(/\]/g, '').split('.');

    for (let j: number = 0; j < splits.length && !isUndefined(value); j++) {
        value = value[splits[j]];
    }
    return value;
}

/**
 * To set value for the nameSpace in desired object.
 *
 * @param {string} nameSpace - String value to get the inner object
 * @param {any} value - Value that you need to set.
 * @param {any} obj - Object to get the inner object value.
 * @returns {void} - To set value for the nameSpace in desired object.
 * @private
 */
export function setValue(nameSpace: string, value: any, obj: any): any {
    const keyValues: string[] = nameSpace.replace(/\[/g, '.').replace(/\]/g, '').split('.');
    const start: any = obj || {};
    let fromObj: any = start;
    let j: number;
    const length: number = keyValues.length;
    let key: string;

    for (j = 0; j < length; j++) {
        key = keyValues[j];

        if (j + 1 === length) {
            fromObj[key] = value === undefined ? {} : value;
        } else if (isNullOrUndefined(fromObj[key])) {
            fromObj[key] = {};
        }

        fromObj = fromObj[key];
    }

    return start;
}

export class ModuleLoader {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private parent: any;
    private loadedModules: ModuleDeclaration[] = [];
    constructor(parent: IParent) {
        this.parent = parent;
    }

    /**
     * Inject required modules in component library
     *
     * @param {ModuleDeclaration[]} requiredModules -  specify the required modules
     * @param {Function[]} moduleList - specify the module list
     * @returns {void} - Inject required modules in component library
     * @hidden
     */
    public inject(requiredModules: ModuleDeclaration[], moduleList: Function[]): void {
        const reqLengthVal: number = requiredModules.length;
        if (reqLengthVal === 0) {
            this.clean();
            return;
        }
        if (this.loadedModules.length) {
            this.clearUnusedModule(requiredModules);
        }
        for (let i: number = 0; i < reqLengthVal; i++) {
            const modl: ModuleDeclaration = requiredModules[i];
            for (const module of moduleList) {
                const modName: string = modl.member;
                if (module.prototype.getModuleName() === modl.member && !this.isModuleLoaded(modName)) {
                    const moduleObject: Object = this.createInstance(module, modl.args);
                    const memberName: string = this.getMemberName(modName);
                    if (modl.isProperty) {
                        setValue(memberName, module, this.parent);
                    } else {
                        setValue(memberName, moduleObject, this.parent);
                    }
                    const loadedModule: ModuleDeclaration = modl;
                    loadedModule.member = memberName;
                    this.loadedModules.push(loadedModule);
                }
            }
        }
    }

    /**
     * Create Instance from constructor function with desired parameters.
     *
     * @param {Function} classFunction - Class function to which need to create instance
     * @param {any[]} params - Parameters need to passed while creating instance
     * @returns {any} - Create Instance from constructor function with desired parameters.
     * @private
     */
    private createInstance(classFunction: Function, params: any[]): any {
        const arrayParam: Object[] = params;
        arrayParam.unshift(undefined);
        return new (Function.prototype.bind.apply(classFunction, arrayParam));
    }


    /**
     * To remove the created object while control is destroyed
     *
     * @hidden
     * @returns {void} - To remove the created object while control is destroyed
     */
    public clean(): void {
        for (const modules of this.loadedModules) {
            if (!modules.isProperty) {
                getValue(modules.member, this.parent).destroy();
            }
        }
        this.loadedModules = [];
    }

    /**
     * Removes all unused modules
     *
     * @param {ModuleDeclaration[]} moduleListName -  specify the module list name
     * @returns {void} - Removes all unused modules
     */
    private clearUnusedModule(moduleListName: ModuleDeclaration[]): void {
        const usedModule: string[] = moduleListName.map((arg: ModuleDeclaration) => { return this.getMemberName(arg.member); });
        const removeModule: ModuleDeclaration[] = this.loadedModules.filter((module: ModuleDeclaration) => {
            return usedModule.indexOf(module.member) === -1;
        });
        for (const moduleName of removeModule) {
            if (!moduleName.isProperty) {
                getValue(moduleName.member, this.parent).destroy();
            }
            this.loadedModules.splice(this.loadedModules.indexOf(moduleName), 1);
            this.deleteObject(this.parent, moduleName.member);
        }
    }

    /**
     * To get the name of the member.
     *
     * @param {string} name - specify the name
     * @returns {string} - To get the name of the member.
     */
    private getMemberName(name: string): string {
        return name[0].toLowerCase() + name.substring(1) + MODULE_SUFFIX;
    }

    /**
     * Delete an item from Object
     *
     * @param {any} obj - Object in which we need to delete an item.
     * @param {string} key - String value to the get the inner object
     * @returns {void} - Delete an item from Object
     * @private
     */
    private deleteObject(obj: any, key: string): void {
        delete obj[key];
    }


    /**
     * Returns boolean based on whether the module specified is loaded or not
     *
     * @param {string} modName - specify the name
     * @returns {boolean} - Returns boolean value
     */

    private isModuleLoaded(modName: string): boolean {
        for (const mod of this.loadedModules) {
            if (mod.member === this.getMemberName(modName)) {
                return true;
            }
        }
        return false;
    }
}
