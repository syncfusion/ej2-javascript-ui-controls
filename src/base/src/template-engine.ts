/**
 * Template Engine Bridge
 */
import { compile as render } from './template';
import { createElement } from './dom';
import { isNullOrUndefined, isBlazor } from './util';

const HAS_ROW: RegExp = /^[\n\r.]+<tr|^<tr/;
const HAS_SVG: RegExp = /^[\n\r.]+<svg|^<path|^<g/;
export const blazorTemplates: object = {};

/**
 *
 * @returns {string} ?
 */
export function getRandomId(): string {

    return '-' + Math.random().toString(36).substr(2, 5);
}

/**
 * Interface for Template Engine.
 */
export interface ITemplateEngine {
    compile: (templateString: string, helper?: Object, ignorePrefix?: boolean) => (data: Object | JSON) => string;
}

/**
 * Compile the template string into template function.
 *
 * @param {string} templateString - The template string which is going to convert.
 * @param {Object} helper - Helper functions as an object.
 * @param {boolean} ignorePrefix ?
 * @returns {NodeList} ?
 * @private
 */
// eslint-disable-next-line
export function compile(templateString: string, helper?: Object, ignorePrefix?:boolean): (data: Object | JSON, component?: any, propName?: any) => NodeList {
    const compiler: Function = engineObj.compile(templateString, helper, ignorePrefix);
    // eslint-disable-next-line
    return (data: Object, component?: any, propName?: any, templateId?: any, isStringTemplate?: boolean, index?: number, element?: any): NodeList => {
        const result: object = compiler(data, component, propName, element);
        const blazorTemplateId: string = 'BlazorTemplateId';
        if (isBlazor() && !isStringTemplate) {
            const randomId: string = getRandomId();
            let blazorId: string = templateId + randomId;
            if (!blazorTemplates[templateId]) {
                blazorTemplates[templateId] = [];
            }
            if (!isNullOrUndefined(index)) {
                const keys: string[] = Object.keys(blazorTemplates[templateId][index]);
                for (const key of keys) {
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
            // eslint-disable-next-line
            return propName === 'rowTemplate' ? [createElement('tr', { id: blazorId, className: 'e-blazor-template' })] as any :
                // eslint-disable-next-line
                [createElement('div', { id: blazorId, className: 'e-blazor-template' })] as any;

        }
        if (typeof result === 'string') {
            if (HAS_SVG.test(result)) {
                const ele: HTMLElement = createElement('svg', { innerHTML: result });
                return <NodeList>ele.childNodes;
            } else {
                const ele: HTMLElement = createElement((HAS_ROW.test(result) ? 'table' : 'div'), { innerHTML: result });
                return <NodeList>ele.childNodes;
            }
        } else {
            return <NodeList>result;
        }
    };
}

/**
 *
 * @param {string} templateId ?
 * @param {string} templateName ?
 * @param {string} comp ?
 * @param {boolean} isEmpty ?
 * @param {Function} callBack ?
 * @returns {void} ?
 */
export function updateBlazorTemplate(
    templateId?: string, templateName?: string, comp?: object,
    isEmpty?: boolean, callBack?: Function): void {
    if (isBlazor()) {
        const ejsIntrop: string = 'sfBlazor';
        window[ejsIntrop].updateTemplate(templateName, blazorTemplates[templateId], templateId, comp, callBack);
        if (isEmpty !== false) {
            blazorTemplates[templateId] = [];
        }
    }
}

/**
 *
 * @param {string} templateId ?
 * @param {string} templateName ?
 * @param {number} index ?
 * @returns {void} ?
 */
export function resetBlazorTemplate(templateId?: string, templateName?: string, index?: number): void {
    const templateDiv: HTMLElement = document.getElementById(templateId);
    if (templateDiv) {
        // eslint-disable-next-line
        const innerTemplates: HTMLElement[] = templateDiv.getElementsByClassName('blazor-inner-template') as any;
        for (let i: number = 0; i < innerTemplates.length; i++) {
            let tempId: string = ' ';
            if (!isNullOrUndefined(index)) {
                tempId = innerTemplates[index].getAttribute('data-templateId');
            } else {
                tempId = innerTemplates[i].getAttribute('data-templateId');
            }
            const tempElement: HTMLElement = document.getElementById(tempId);
            if (tempElement) {
                const length: number = tempElement.childNodes.length;
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
 *
 * @param  {ITemplateEngine} classObj - Class object for custom template.
 * @returns {void} ?
 * @private
 */
export function setTemplateEngine(classObj: ITemplateEngine): void {
    engineObj.compile = classObj.compile;
}

/**
 * Get current template engine for template rendering
 *
 * @returns {string} ?
 * @private
 */
export function getTemplateEngine(): (template: string, helper?: Object) => (data: Object | JSON) => string {
    return engineObj.compile;
}

//Default Engine Class
class Engine implements ITemplateEngine {
    // eslint-disable-next-line
    public compile(templateString: string, helper: Object = {}, ignorePrefix?:boolean): (data: Object | JSON) => string {
        return render(templateString, helper);
    }
}

const engineObj: ITemplateEngine = { compile: new Engine().compile };
