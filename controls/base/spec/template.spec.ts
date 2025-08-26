import * as template from '../src/template';
import {  createElement} from '../src/dom';
/**
 * Template Engine Spec
 */

let arrayOfObj = [
    {
        "IDPRATICA": 700,
        "@DRNT": 0,
        "Giorni": [
            {
                "Data": "2019-05-01T00:00:00",
                "IDSTATO": 99,
            },
            {
                "Data": "2019-05-02T00:00:00",
                "IDSTATO": 99,
            }
        ],
        "@Prior": [
            {
                "IDTAG": 0,
                "Date": "2019-05-02T00:00:00",
            },
            {
                "IDTAG": 10,
                "Date": "2019-05-02T00:00:00",
            }
        ]
    }
];
let specialCharValue = [{'@ShipCountry': 'France'}];
let dsJSONArrayBoolean: any=[{name: true,info:{ id:'01'} }, { name: false, info: { id:'02'} }];
let dsJSONArray: any = [{ name: 'one', info: { id: '01' } }, { name: 'two', info: { id: '02' } }];
let dsSubArray: any = [{ name: 'one', items: ['AR Item1', 'AR Item2'] }, { name: 'two', items: ['AR Item1', 'AR Item2'] }];
let dsJSONSubArray: any = [{ name: 'one', info: { id: '01', items: ['AR Item1', 'AR Item2'] } }, { name: 'two', info: { id: '02', items: ['AR Item1', 'AR Item2'] } }];
let JSONArray: any = [{ name:'one   two', info: { id:'01' } }, { name:'two three', info: { id:'02' } }];
let spaceDS: any = [{ name:'one   two', info: { id:'01' } }, { name:'two three   ', info: { id:'02' } }];

let tempObj: any;

interface MyWindow extends Window {
    getName: Function;
    check: Function;
    custom : String;
}

declare var window: MyWindow

window.getName = function () {
    return "TestName";
}

window.check = function (args: number) {
    if(args % 2 === 0) {
        return true;
    }
    else {
        return false;
    }
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

    it('JSON Array Input With Template String which has special character', () => {
        let templateStr: string = '<div>${@ShipCountry}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'France' }));
        expect(outDOM(template.compile(templateStr), specialCharValue)).toEqual(result);
    });

    it('JSON Array Input With IF Condition which has special character', () => {
        let templateStr: string = '${if(@DRNT==0)}<div>true</div>${else}<div>false</div>${/if}';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'true' }));
        expect(outDOM(template.compile(templateStr), arrayOfObj)).toEqual(result);
    });
    
    it('JSON Array Input With Template String with array of value within object', () => {
        let templateStr: string = '${if(Giorni[0].IDSTATO==99)}<div>true</div>${else}<div>false</div>${/if}';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'true' }));
        expect(outDOM(template.compile(templateStr), arrayOfObj)).toEqual(result);
    });

    it('JSON Array Input With IF Condition which has special character with array of value within object', () => {
        let templateStr: string = '${if(@Prior[0].IDTAG==0)}<div>true</div>${else}<div>false</div>${/if}';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'true' }));
        expect(outDOM(template.compile(templateStr), arrayOfObj)).toEqual(result);
    });

    it('JSON Array Input With two space between class Names', () => {
        let templateStr: string = '<div class="class1  class2  class3">${name}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'one', className:'class1 class2 class3' }));
        result.push(createElement('div', { innerHTML: 'two', className:'class1 class2 class3' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('JSON Array Input With more than two space between two class Names', () => {
        let templateStr: string = '<div class="class1    class2">${name}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'one', className:'class1 class2' }));
        result.push(createElement('div', { innerHTML: 'two', className:'class1 class2' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('JSON Array Input With more than two space between three class Names', () => {
        let templateStr: string = '<div class="class1    class2    class3">${name}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'one', className:'class1 class2 class3' }));
        result.push(createElement('div', { innerHTML: 'two', className:'class1 class2 class3' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('JSON Array Input With more than two space in first class name', () => {
        let templateStr: string = '<div class="   class1">${name}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'one', className:' class1' }));
        result.push(createElement('div', { innerHTML: 'two', className:' class1' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('JSON Array Input With two space in first class name and multiple space between three class names', () => {
        let templateStr: string = '<div class="  class1    class2   class3">${name}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'one', className:' class1 class2 class3' }));
        result.push(createElement('div', { innerHTML: 'two', className:' class1 class2 class3' }));
        expect(outDOM(template.compile(templateStr), dsJSONArray)).toEqual(result);
    });

    it('JSON Array Input With multiple space between inner text', () => {
        let templateStr: string = '<div class=" class1   class2    class3">${name}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'one   two', className:' class1 class2 class3' }));
        result.push(createElement('div', { innerHTML: 'two three', className:' class1 class2 class3' }));
        expect(outDOM(template.compile(templateStr), JSONArray)).toEqual(result);
    });

    it('Multiple space between inner text template string', () => {
        let templateStr: string = "<div>${name}</div>";
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'one   two' }));
        result.push(createElement('div', { innerHTML: 'two three   ' }));
        let templateResult: Element[] = outDOM(template.compile(templateStr), spaceDS)
        expect(templateResult).toEqual(result);
        expect(templateResult[0].innerHTML).toEqual('one   two');
        expect(templateResult[1].innerHTML).toEqual('two three   ');
    });

    it('Multiple space between inner tags template string', () => {
        let templateStr: string = "<div>${name}</div>   <div>${name}</div>";
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'one   two' }));
        result.push(createElement('div', { innerHTML: 'two three   ' }));
        let templateResult: Element[] = outDOM(template.compile(templateStr), spaceDS)
        expect(templateResult.length).toEqual(2);
        expect(templateResult).toEqual(result);
    });
    
    it('JSON array input with href value with apostrophe', () => {
        let templateStr: string = `<div><a href='https://en.wikipedia.org/wiki/France'>France</a><a href='/Projects/Details?id=VINET'>VINET</a></div>`;
        let getString: any = template.compile(templateStr);
        let output: any = getString(templateStr);
        expect(output).toEqual("<div><a href=\"https://en.wikipedia.org/wiki/France\">France</a><a href=\"/Projects/Details?id=VINET\">VINET</a></div>");
    });

    it('JSON array input with special character apostrophe', () => {
        let templateStr: string = `<div><input value='HANAR's'></div>`;
        let getString: any = template.compile(templateStr);
        let output: any = getString(templateStr);
        expect(output).toEqual("<div><input value=\"HANAR's\"></div>");
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

    it('JSON Array Input With IF ELSE Condition Boolean', () => {
        let templateStr: string = '<div>${if(name===true)}${info.id}${else}${name}${/if}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: '01' }));
        result.push(createElement('div', { innerHTML: 'false' }));
        expect(outDOM(template.compile(templateStr), dsJSONArrayBoolean)).toEqual(result);
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
    
    it('Template string pass with double slash with special character',()=>{
        let data: object = { "Quickbrain\\Models\\AllowedListValue#id": 123456};
        let getDOMString: (data: object) => any = template.compile('<div>${Quickbrain\\Models\\AllowedListValue#id}</div>');
        let output: any = getDOMString(data);
        expect(output).toEqual("<div>123456</div>");
    });

    it('Template string pass with double slash',()=>{
        let data: object = { "Quickbrain\\Models\\AllowedListValue": 2468};
        let getDOMString: (data: object) => any = template.compile('<div>${Quickbrain\\Models\\AllowedListValue}</div>');
        let output: any = getDOMString(data);
        expect(output).toEqual("<div>2468</div>");
    });

    it('multiple string pass in the template engine',()=>{
        let data: object = { name: 'Aston Martin',val: 'hi' };
        let getDOMString: (data: object) => any = template.compile('<div>${name,val}</div>');
        let output: any = getDOMString(data);
        expect(output).toEqual("<div>Aston Martinhi</div>");
    });
    it('single string pass in the template engine',()=>{
        let data: object = { name: 'Aston Martin',val: 'hi' };
        let getDOMString: (data: object) => any = template.compile('<div>${name}</div>');
        let output: any = getDOMString(data);
        expect(output).toEqual("<div>Aston Martin</div>");
    });
    it('string pass with out data attribute in the window function',()=>{
        (window as any).translate= function(str: string){  
            return  str.toUpperCase();
        }
        let data: object = { name: 'Aston Martin',val: 'hi' };
        let getDOMString: (data: object) => any = template.compile('<div>${translate(name,val)}</div>');
        let output: any = getDOMString(data);
        expect(output).toEqual("<div>ASTON MARTIN</div>");
    });
    it('empty string pass in the window function',()=>{
        (window as any).translate= function(){  
            let str : string = "hello"
            return  str.toUpperCase();
        }
        let data: object = { name: 'Aston Martin',val: 'hi' };
        let getDOMString: (data: object) => any = template.compile('<div>${translate()}</div>');
        let output: any = getDOMString(data);
        expect(output).toEqual("<div>HELLO</div>");
    });
    it('string pass with data attribute  in the  window function',()=>{
        (window as any).translate= function(str: string){  
            return  str.toUpperCase();
        }
        let data: object = { name: 'Aston Martin',val: 'hi' };
        let getDOMString: (data: object) => any = template.compile('<div>${translate(data.name,data.val)}</div>');
        let output: any = getDOMString(data);
        expect(output).toEqual("<div>ASTON MARTIN</div>");
    });
    it('string pass with window variable  in the  window function',()=>{
        (window as any).translate= function(str: string, lstname: string, last: string ){  
            return  (str+lstname+last).toUpperCase();
        }
        window.custom = 'MARTIN';
        let data: object = { name: 'Aston',val: 'hi' };
        let getDOMString: (data: object) => any = template.compile('<div>${translate(data.name,data.val,window.custom)}</div>');
        let output: any = getDOMString(data);
        expect(output).toEqual("<div>ASTONHIMARTIN</div>");
    });
    it('JSON Array Input with IF Condition which has window function', () => {
        let templateStr: string = '${if(window.check(IDPRATICA))}<div>true</div>${else}<div>false</div>${/if}';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'true' }));
        expect(outDOM(template.compile(templateStr), arrayOfObj)).toEqual(result);
    });
    it('JSON Array Input With IF Condition with window function which has special character', () => {
        let templateStr: string = '${if(window.check(@DRNT))}<div>true</div>${else}<div>false</div>${/if}';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'true' }));
        expect(outDOM(template.compile(templateStr), arrayOfObj)).toEqual(result);
    });
    it('JSON Array Input With IF Condition with window function which has array of value within object', () => {
        let templateStr: string = '${if(window.check(Giorni[0].IDSTATO))}<div>true</div>${else}<div>false</div>${/if}';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'false' }));
        expect(outDOM(template.compile(templateStr), arrayOfObj)).toEqual(result);
    });

    it('JSON Array Input With IF Condition with window function which has special character with array of value within object', () => {
        let templateStr: string = '${if(window.check(@Prior[0].IDTAG))}<div>true</div>${else}<div>false</div>${/if}';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'true' }));
        expect(outDOM(template.compile(templateStr), arrayOfObj)).toEqual(result);
    });
	
	it('JSON Array Input with window function which has special character', () => {
        let templateStr: string = '<div>${window.check(@DRNT)}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'true' }));
        expect(outDOM(template.compile(templateStr), arrayOfObj)).toEqual(result);
    });
    it('JSON Array Input With window function which has array of value within object', () => {
        let templateStr: string = '<div>${window.check(Giorni[0].IDSTATO)}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'false' }));
        expect(outDOM(template.compile(templateStr), arrayOfObj)).toEqual(result);
    });
    it('JSON Array Input With window function which has special character with array of value within object', () => {
        let templateStr: string = '<div>${window.check(@Prior[0].IDTAG)}</div>';
        let result: Element[] = [];
        result.push(createElement('div', { innerHTML: 'true' }));
        expect(outDOM(template.compile(templateStr), arrayOfObj)).toEqual(result);
    });

    it('JSON Array Input with function template', () => {
        let templateFunc: Function = (data: any) => `<span>${data['IDPRATICA']}</span>`;
        let result: HTMLElement = document.createElement('span');
        result.textContent = '700';
        expect(outDOM(template.compile(templateFunc), arrayOfObj)[0]).toEqual(result);
    });

    it('JSON Array Input with function template with if condition', () => {;
        let templateFunc: Function = (data: any) => `${data['IDPRATICA'] === 700 ? `<span>${data['IDPRATICA']}</span>` : ''}`;
        let result: HTMLElement = document.createElement('span');
        result.textContent = '700';        
        expect(outDOM(template.compile(templateFunc), arrayOfObj)[0]).toEqual(result);
    });

    it('JSON Array Input with complex function template', () => {
        let data: any = {
            people: [
                { firstName: "Todd", age: 16 },
                { firstName: "Mike", age: 23, driver: true },
                { firstName: "Amanda", age: 21 },
                { firstName: "Stacy", age: 19 }
            ]
        };
        let output: string = "<ul><li style='color: red;'>Name: Todd Age: 16</li><li style='color: green;'>Name: Mike Age: 23 is a driver.</li><li style='color: blue;'>Name: Amanda Age: 21</li><li style='color: red;'>Name: Stacy Age: 19</li></ul>";
        var templateFunc: (data: any) => string = ({ people }) => {
            var result = "<ul>";
            for (let i = 0; i < people.length; i++) {
                let person = people[i];

                if (person.age > 20) {
                    if (person.driver) {
                        result += `<li style='color: green;'>Name: ${person.firstName} Age: ${person.age} is a driver.</li>`;
                    } else {
                        result += `<li style='color: blue;'>Name: ${person.firstName} Age: ${person.age}</li>`;
                    }
                } else {
                    result += `<li style='color: red;'>Name: ${person.firstName} Age: ${person.age}</li>`;
                }
            }
            result += "</ul>";
            return result;
        };
        let outputDOM: Function = template.compile(templateFunc);
        expect(outputDOM(data)).toEqual(output);
    });
    
    it('Template string with encrypted value: ', () => {
        // Below is an base64 encrypted value `jaVasCript:/*-/*`/*\`/*'/*/**/"(/* */oNcliCk=alert('XSS') )//%0D%0A%0D%0A//`
        const unformattedValue: string = window.atob(
            'amFWYXNDcmlwdDovKi0vKmAvKlxgLyonLyovKiovIigvKiAqL29OY2xpQ2s9YWxlcnQoJ1hTUycpICkvLyUwRCUwQSUwRCUwQS8v'
        );
        const templateFn: Function = template.compile(unformattedValue);
        expect(templateFn()).toBe('jaVasCript:/*-/*`/*`/*\'/*/**/"(/* */oNcliCk=alert(\'XSS\') )//%0D%0A%0D%0A//');
    });
});
