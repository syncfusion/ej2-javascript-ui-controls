/**
 * Template Engine Bridge
 */
import { compile as render } from './template';
import { createElement } from './dom';

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
    return (data: Object, component?: any, propName?: any, templateId?: any, isStringTemplate?: boolean ): NodeList => {
        let result: object = compiler(data, component, propName);
        let blazor: string = 'Blazor'; let blazorTemplateId: string = 'BlazorTemplateId';
        if (window && window[blazor] && !isStringTemplate) {
            let randomId: string = getRandomId();
            if (!blazorTemplates[templateId]) {
                blazorTemplates[templateId] = [];
            }
            data[blazorTemplateId] = templateId + randomId;
            blazorTemplates[templateId].push(data);
            // tslint:disable-next-line:no-any
            return propName === 'rowTemplate' ? [createElement('tr', { id: templateId + randomId })] as any :
                // tslint:disable-next-line:no-any
                [createElement('div', { id: templateId + randomId })] as any;
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

export function updateBlazorTemplate(templateId?: string, templateName?: string, comp?: object): void {
    let blazor: string = 'Blazor';
    if (window && window[blazor]) {
        let ejsIntrop: string = 'ejsInterop';
        window[ejsIntrop].updateTemplate(templateName, blazorTemplates[templateId], templateId, comp);
        blazorTemplates[templateId] = [];
    }
}

export function resetBlazorTemplate(templateId?: string, templateName?: string): void {
    let templateDiv: HTMLElement = document.getElementById(templateId);
    if (templateDiv) {
        // tslint:disable-next-line:no-any
        let innerTemplates: HTMLElement[] = templateDiv.getElementsByClassName('blazor-inner-template') as any;
        for (let i: number = 0; i < innerTemplates.length; i++) {
            let tempId: string = innerTemplates[i].getAttribute('data-templateId');
            let tempElement: HTMLElement = document.getElementById(tempId);
            if (tempElement) {
                let length: number = tempElement.children.length;
                for (let j: number = 0; j < length; j++) {
                innerTemplates[i].appendChild(tempElement.children[0]);
                tempElement.appendChild(innerTemplates[i].children[j].cloneNode(true));
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
 * Get current template engine for template rendering.
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
