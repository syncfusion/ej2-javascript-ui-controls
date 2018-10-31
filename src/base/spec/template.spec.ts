import * as template from '../src/template';
import {  createElement} from '../src/dom';
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

let outDOM: Function = (tempFunction: Function, data: Object[]) => {
    let output: any[] = [];
    for (let item of data) {
        let htmlEle: HTMLElement = createElement('div', { innerHTML: tempFunction(item) });
        output.push(htmlEle.children[0]);
    }
    return output;
}

describe('Template', () => {


    it('JSON Array Input With Template String', () => {
        let templateStr: string = '<div>${name}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'one' }));
        result.push(createElement('div', { innerHTML: 'two' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('JSON Array input with multiple key mapping String', () => {
        let templateStr: string = '<div>${name}${info.id}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'one01' }));
        result.push(createElement('div', { innerHTML: 'two02' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('JSON Array input with cacheTemplate', () => {
        let templateStr: string = '<div>${name}${info.id}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'one01' }));
        result.push(createElement('div', { innerHTML: 'two02' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('JSON Array input multi line template', () => {
        template.expression(/\{{([^}]*)}}/g);
        /* tslint:disable */
        let templateStr: string = `<div>
            <span>{{name}}</span>{{info.id}}
            </div>`;
        /* tslint:enable */
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: '<span>one</span>01' }));
        result.push(createElement('div', { innerHTML: '<span>two</span>02' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
        template.expression(new RegExp('\\${([^}]*)}', 'g'));
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

    it('variable function access', () => {
        let templateStr: string = '<div>${name.toUpperCase()}${info.id}</div>';
        let result: Element[] = [];

        result.push(createElement('div', { innerHTML: 'ONE01' }));
        result.push(createElement('div', { innerHTML: 'TWO02' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('window function access', () => {
        let templateStr: string = '<div>${getName()}${info.id}</div>';
        let result: Element[] = [];

        result.push(createElement('div', { innerHTML: 'TestName01' }));
        result.push(createElement('div', { innerHTML: 'TestName02' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('JSON Array Input With IF Condition', () => {
        let templateStr: string = '<div>${if(name=="one")}${info.id}${/if}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: '01' }));
        result.push(createElement('div', { innerHTML: '' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('JSON Array Input With else IF Condition', () => {
        let templateStr: string = '<div>${if(name=="one")}${id}${else if(name=="two")}${id}${/if}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: '02' }));

        expect(outDOM(template.compile(templateStr), [{name:'two',id:'02'}])).toEqual(result);
        
    });

    it('JSON Array Input With IF ELSE Condition', () => {
        let templateStr: string = '<div>${if(name=="one")}${info.id}${else}${name}${/if}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: '01' }));
        result.push(createElement('div', { innerHTML: 'two' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('JSON Array Input With Multiple IF Condition', () => {
        let templateStr: string = '<div>${if(name=="one" && info.id != "01")}${info.id}${/if}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: '' }));
        result.push(createElement('div', { innerHTML: '' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('JSON Array Input With For Condition', () => {
        let templateStr: string = '<div>${for(item of items)}${item} <br/> ${/for}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'AR Item1 <br/> AR Item2 <br/> ' }));
        result.push(createElement('div', { innerHTML: 'AR Item1 <br/> AR Item2 <br/> ' }));
        expect(outDOM(template.compile(templateStr), dsSubArray)).toEqual(result);
    });

    it('JSON Array Input With For Condition item index', () => {
        let templateStr: string = '<div>${for(item of items)}${itemIndex},${/for}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: '0,1,' }));
        result.push(createElement('div', { innerHTML: '0,1,' }));
        expect(outDOM(template.compile(templateStr), dsSubArray)).toEqual(result);
    });

    it('JSON Array Input With IF and FOR Condition', () => {
        let templateStr: string = '<div>${if(name=="one")}${for(item of items)}${item} <br/> ${/for}${/if}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'AR Item1 <br/> AR Item2 <br/> ' }));
        result.push(createElement('div', { innerHTML: '' }));
        expect(outDOM(template.compile(templateStr), dsSubArray)).toEqual(result);
    });

    it('JSON Array Input With FOR and IF Condition', () => {
        let templateStr: string = '<div>${for(item of items)}${if(item == "AR Item1")}${item}${/if}${/for}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'AR Item1' }));
        result.push(createElement('div', { innerHTML: 'AR Item1' }));
        expect(outDOM(template.compile(templateStr), dsSubArray)).toEqual(result);
    });

    it('JSON Array Input With Nesting two false Condition', () => {
        let templateStr: string = '<div>${if(name=="two")}${if(info.id != "02")}${info.id}${/if}${/if}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: '' }));
        result.push(createElement('div', { innerHTML: '' }));
        expect(outDOM(template.compile(templateStr), dsJSONSubArray)).toEqual(result);
    });

});