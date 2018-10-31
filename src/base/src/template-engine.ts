/**
 * Template Engine Bridge
 */
import { compile as render } from './template';
import { createElement } from './dom';

const HAS_ROW: RegExp = /^[\n\r.]+\<tr|^\<tr/;
const HAS_SVG: RegExp = /^[\n\r.]+\<svg|^\<path|^\<g/;

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
    return (data: Object, component?: any, propName?: any): NodeList => {
        let result: object = compiler(data, component, propName);
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