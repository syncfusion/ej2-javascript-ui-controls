/**
 * Template Engine Bridge
 */
import { compile as render } from './template';
import { createElement } from './dom';
import { isNullOrUndefined, isBlazor } from './util';

const HAS_ROW: RegExp = /^[\n\r.]+\<tr|^\<tr/;
const HAS_SVG: RegExp = /^[\n\r.]+\<svg|^\<path|^\<g/;
export let blazorTemplates: object = {};


export function getRandomId(): string {

    return '-' + Math.random().toString(36).substr(2, 5);
}

/**
 * Interface for Template Engine.
 */
export interface ITemplateEngine {
    compile: (templateString: string, helper?: Object) => (data: Object | JSON) => string;
}

/**
 * Compile the template string into template function.
 * @param  {string} templateString - The template string which is going to convert.
 * @param  {Object} helper? - Helper functions as an object.
 * @private
 */
//tslint:disable-next-line
export function compile(templateString: string, helper?: Object): (data: Object | JSON, component?: any, propName?: any) => NodeList {
    let compiler: Function = engineObj.compile(templateString, helper);
    //tslint:disable-next-line
    return (data: Object, component?: any, propName?: any, templateId?: any, isStringTemplate?: boolean, index?: number, element?: any): NodeList => {
        let result: object = compiler(data, component, propName, element);
        let blazor: string = 'Blazor'; let blazorTemplateId: string = 'BlazorTemplateId';
        if (isBlazor() && !isStringTemplate) {
            let randomId: string = getRandomId();
            let blazorId: string = templateId + randomId;
            if (!blazorTemplates[templateId]) {
                blazorTemplates[templateId] = [];
            }
            if (!isNullOrUndefined(index)) {
                let keys: string[] = Object.keys(blazorTemplates[templateId][index]);
                for (let key of keys) {
                    if (key !== blazorTemplateId && data[key]) {
                        blazorTemplates[templateId][index][key] = data[key];
                    }
                    if (key === blazorTemplateId) {
                        blazorId = blazorTemplates[templateId][index][key];
                    }
                }
            } else {
                data[blazorTemplateId] = blazorId;
                blazorTemplates[templateId].push(data);
            }
            // tslint:disable-next-line:no-any
            return propName === 'rowTemplate' ? [createElement('tr', { id: blazorId, className: 'e-blazor-template' })] as any :
                // tslint:disable-next-line:no-any
                [createElement('div', { id: blazorId, className: 'e-blazor-template' })] as any;

        }
        if (typeof result === 'string') {
            if (HAS_SVG.test(result)) {
                let ele: HTMLElement = createElement('svg', { innerHTML: result });
                return <NodeList>ele.childNodes;
            } else {
                let ele: HTMLElement = createElement((HAS_ROW.test(result) ? 'table' : 'div'), { innerHTML: result });
                return <NodeList>ele.childNodes;
            }
        } else {
            return <NodeList>result;
        }
    };
}

export function updateBlazorTemplate(
    templateId?: string, templateName?: string, comp?: object,
    isEmpty?: boolean, callBack?: Function): void {
    let blazor: string = 'Blazor';
    if (isBlazor()) {
        let ejsIntrop: string = 'sfBlazor';
        window[ejsIntrop].updateTemplate(templateName, blazorTemplates[templateId], templateId, comp, callBack);
        if (isEmpty !== false) {
            blazorTemplates[templateId] = [];
        }
    }
}

export function resetBlazorTemplate(templateId?: string, templateName?: string, index?: number): void {
    let templateDiv: HTMLElement = document.getElementById(templateId);
    if (templateDiv) {
        // tslint:disable-next-line:no-any
        let innerTemplates: HTMLElement[] = templateDiv.getElementsByClassName('blazor-inner-template') as any;
        for (let i: number = 0; i < innerTemplates.length; i++) {
            let tempId: string = ' ';
            if (!isNullOrUndefined(index)) {
                tempId = innerTemplates[index].getAttribute('data-templateId');
            } else {
                tempId = innerTemplates[i].getAttribute('data-templateId');
            }
            let tempElement: HTMLElement = document.getElementById(tempId);
            if (tempElement) {
                let length: number = tempElement.childNodes.length;
                for (let j: number = 0; j < length; j++) {
                    if (!isNullOrUndefined(index)) {
                        innerTemplates[index].appendChild(tempElement.childNodes[0]);
                        i = innerTemplates.length;
                    } else {
                        innerTemplates[i].appendChild(tempElement.childNodes[0]);
                    }
                }

            }
        }
    }
}

/**
 * Set your custom template engine for template rendering.
 * @param  {ITemplateEngine} classObj - Class object for custom template.
 * @private
 */
export function setTemplateEngine(classObj: ITemplateEngine): void {
    engineObj.compile = classObj.compile;
}

/**
 * Get current template engine for template rendering
 * @param  {ITemplateEngine} classObj - Class object for custom template.
 * @private
 */
export function getTemplateEngine(): (template: string, helper?: Object) => (data: Object | JSON) => string {
    return engineObj.compile;
}

//Default Engine Class
class Engine implements ITemplateEngine {
    public compile(templateString: string, helper: Object = {}): (data: Object | JSON) => string {
        return render(templateString, helper);
    }
}

let engineObj: ITemplateEngine = { compile: new Engine().compile };
