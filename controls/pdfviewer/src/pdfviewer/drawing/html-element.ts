import { compile as baseTemplateComplier } from '@syncfusion/ej2-base';
import { DrawingElement } from '@syncfusion/ej2-drawings';

/**
 * HTMLElement defines the basic html elements
 */
export class DiagramHtmlElement extends DrawingElement {
    /**
     * set the id for each element
     *
     * @param {string} nodeTemplate - Set the id for each element.
     * @returns {void}
     *
     * @private
     */
    public constructor(nodeTemplate?: string | Function) {
        super();
        this.templateFn = this.templateCompiler(nodeTemplate);
    }

    public templateCompiler(template: string | Function): Function {
        if (template) {
            try {
                if (typeof template !== 'function' && document.querySelectorAll(template).length) {
                    return baseTemplateComplier(document.querySelector(template).innerHTML.trim());
                } else {
                    return baseTemplateComplier(template);
                }
            } catch (e) {
                return baseTemplateComplier(template);
            }
        }
        return undefined;
    }

    /**
     * getNodeTemplate method \
     *
     * @returns { Function } getNodeTemplate method .\
     *
     * @private
     */
    public getNodeTemplate(): Function {
        return this.templateFn;
    }
    private templateFn: Function;
    /**
     * check whether it is html element or not
     *
     * @private
     */
    public isTemplate: boolean;
    /**
     * defines geometry of the html element
     *
     * @private
     */
    public template: HTMLElement;
}
