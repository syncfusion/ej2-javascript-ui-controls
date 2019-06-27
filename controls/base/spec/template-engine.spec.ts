import * as template from '../src/template-engine';
import { createElement } from '../src/dom';
/**
 * Template Engine Spec
 */

let dsJSONArray: any = [{ name: 'one', info: { id: '01' } }, { name: 'two', info: { id: '02' } }];
let dsSubArray: any = [{ name: 'one', items: ['AR Item1', 'AR Item2'] }, { name: 'two', items: ['AR Item1', 'AR Item2'] }];
let dsJSONSubArray: any = [{ name: 'one', info: { id: '01', items: ['AR Item1', 'AR Item2'] } }, { name: 'two', info: { id: '02', items: ['AR Item1', 'AR Item2'] } }];

let tempObj: any;

interface MyWindow extends Window {
    getName: Function;
}

declare var window: MyWindow

window.getName = function () {
    return "TestName";
}

let outDOM: Function = (tempFunction: Function, data: Object[], templateID?: string, propName?: string) => {
    let output: any[] = [];
    for (let item of data) {
        let htmlEle: HTMLCollection = tempFunction(item, templateID, propName);
        output = output.concat(Array.prototype.slice.call(htmlEle));
    }
    return output.concat([]);
}

describe('Template Engine', () => {


    it('JSON Array Input With Template String', () => {
        let templateStr: string = '<div>${name}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'one' }));
        result.push(createElement('div', { innerHTML: 'two' }));
        let res: any = outDOM(template.compile(templateStr), dsJSONArray);
        expect(res).toEqual(result);
    });

    it('JSON Array input with multiple key mapping String', () => {
        let templateStr: string = '<div>${name}${info.id}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'one01' }));
        result.push(createElement('div', { innerHTML: 'two02' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('Table tag with custom parent tag', () => {
        let templateStr: string = '<tr><td><span>${name}</span></td><td><span>${info.id}</span></td></tr>';
        let result: any = outDOM(template.compile(templateStr), dsJSONArray);
        expect(result[0].firstElementChild.tagName.toLowerCase()).toEqual('tr');
        expect(result[1].firstElementChild.tagName.toLowerCase()).toEqual('tr');
    });

    it('Testing for svg tag', () => {
        let templateStr: string = '<path d= "M150 0 L75 200 L225 200 Z"></path>';
        let result: any = outDOM(template.compile(templateStr), dsJSONArray)
        expect(result[0].parentNode.localName).toEqual('svg');
    });

    it('Testing for blazor others templates', () => {
        let templateStr: string = '<div> Blazor  template</div>';
        let Blazor: string = 'Blazor';
        window[Blazor] = 'template';
        let result: any = outDOM(template.compile(templateStr), [dsJSONArray[0]], '', 'Template')
        window[Blazor] = null;
        expect(result[0].tagName).toEqual('DIV');
    });

    it('Check blazor template', () => {
        let templateStr: string = '<div class="   class1">blazor</div>';
        let result: any = [];
        let blazor: string = 'Blazor';
        let ejsIntrop: string = 'ejsIntrop';
        window[blazor] = 'Template';
        window[ejsIntrop] = { updateTemplate: function () { } };
        result = (template.updateBlazorTemplate('template', 'Template'));
        window[blazor] = null;
        window[ejsIntrop] = null;
        expect(result).toBeUndefined();
    });

    it('Check blazor row template', () => {
        let templateStr: string = '<div class="   class1">blazor</div>';
        let result: any = [];
        let blazor: string = 'Blazor';
        let ejsIntrop: string = 'ejsIntrop';
        window[blazor] = 'Template';
        window[ejsIntrop] = { updateTemplate: function () { } };
        result = (template.updateBlazorTemplate('rowtemplate', 'RowTemplate'));
        window[blazor] = null;
        window[ejsIntrop] = null;
        expect(result).toBeUndefined();
    });

    it('Check reset blazor template', () => {
        let result: any = [];
        result = (template.resetBlazorTemplate('template', 'Template'));
        expect(result).toBeUndefined();
    });

    it('Check append the blazor template to the body', () => {
        let elem: HTMLElement = document.createElement('div');
        elem.setAttribute('id', 'template');
        let newElement: HTMLElement = document.createElement('div');
        newElement.setAttribute('class', 'blazor-inner-template');
        newElement.setAttribute('data-templateId', 'tempID');
        elem.appendChild(newElement);
        let elem2: HTMLElement = document.createElement('div');
        elem2.setAttribute('id', 'tempID');
        elem2.setAttribute('data-templateId', 'tempID');
        document.activeElement.appendChild(elem2);
        document.activeElement.appendChild(elem);
        let result: any = [];
        result = (template.resetBlazorTemplate('template', 'Template'));
        expect(result).toBeUndefined();
    });

    it('Testing for blazor Row template', () => {
        let templateStr: string = '<tr> Blazor template</tr>';
        let Blazor: string = 'Blazor';
        window[Blazor] = 'template';
        let result: any = outDOM(template.compile(templateStr), [dsJSONArray[0]], '', 'rowTemplate')
        window[Blazor] = null;
        expect(result[0].tagName).toEqual('TR');
    });

    it('custom helper', () => {
        let templateStr: string = '<div>${uCase(name)}${info.id}</div>';
        let result: Element[] = [];
        let cHelper: any = {
            uCase: (str: string) => {
                return str.toUpperCase();
            }
        };
        result.push(createElement('div', { innerHTML: 'ONE01' }));
        result.push(createElement('div', { innerHTML: 'TWO02' }));
        expect(outDOM(template.compile(templateStr, cHelper), dsJSONArray)).toEqual(result);
    });

    it('custom engine', () => {
        let spyCompiler = jasmine.createSpy("compile");
        class CustomEngine implements template.ITemplateEngine {
            public compile(tStr: string, helper?: Object): (data: Object | JSON) => string {
                return spyCompiler;
            }
        }
        let templateStr: string = '<div>${uCase(name)}${info.id}</div>';
        template.setTemplateEngine(new CustomEngine());
        let tmpFun: Function = template.compile(templateStr);
        tmpFun(dsJSONArray[0]);
        expect(spyCompiler).toHaveBeenCalled();
    });

    it('get template engine', () => {
        class CustomEngine implements template.ITemplateEngine {
            public compile(tStr: string, helper?: Object): (data: Object | JSON) => string {
                return (): any => {
                    //no code
                };
            }
        }
        let tempEngine: CustomEngine = new CustomEngine();
        template.setTemplateEngine(tempEngine);
        expect(template.getTemplateEngine()).toBe(tempEngine.compile);
    });


});