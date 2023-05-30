import { TimePicker } from "../../src/timepicker/timepicker";
import { MaskedDateTime } from '../../src/maskbase/masked-date-time';
import { createElement,L10n, Ajax, loadCldr} from '@syncfusion/ej2-base';


function loadCultureFiles(name: string, base?: boolean): void {
    let files: string[] = !base ?
        ['ca-gregorian.json', 'numbers.json', 'timeZoneNames.json', 'currencies.json'] : ['numberingSystems.json'];
    files.push('weekData.json');
    for (let prop of files) {
        let val: Object;
        let ajax: Ajax;
        if (base || prop === 'weekData.json') {
            ajax = new Ajax('base/spec/cldr/supplemental/' + prop, 'GET', false);
        } else {
            ajax = new Ajax('base/spec/cldr/main/' + name + '/' + prop, 'GET', false);
        }
        ajax.onSuccess = (value: JSON) => {
            val = value;
        };
        ajax.send();
        loadCldr(JSON.parse(<string>val));
    }
}

L10n.load({
    'en': {
        'timepicker': { day: 'day' , month: 'month', year: 'year', hour: 'hour' ,minute: 'minute', second:'second' }
    },
    'de': {
        'timepicker': { day: 'Tag' , month: 'Monat', year: 'Jahr', hour: 'Stunde' ,minute: 'Minute', second:'Sekunden' }
    },
    'zh': {
        'timepicker': { day: '日' , month: '月', year: '年', hour: '小時' ,minute: '分鐘', second:'第二' }
    },
    'ja': {
        'timepicker': { day: '日' , month: '月', year: '年', hour: '時間' ,minute: '分', second:'秒'}
    },
});

let clickEvent: MouseEvent = document.createEvent('MouseEvents');
clickEvent.initEvent('mousedown', true, true);

TimePicker.Inject(MaskedDateTime);
describe('Timepicker', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Masked TimePicker', () => {
        let timepicker: any;
        let maskedDateTime: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation:(): void=>{},
            action: 'ArrowLeft',
            code: 'ArrowLeft',
            key: 'ArrowLeft'
        };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
            maskedDateTime = new MaskedDateTime();
            maskedDateTime.destroy();
        });
        it('default rendering without enableMask property ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker();
            timepicker.appendTo('#timepicker');
            expect(timepicker.element.value).toBe('');
            
            expect(timepicker.value).toBe(null);
        });
        it('default rendering with enableMask property ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss'});
            timepicker.appendTo('#timepicker');
            expect(timepicker.element.value).toBe('hour:minute:second');
            expect(timepicker.value).toBe(null);
        });
        it('Rendering with maskPlaceholder as custom type ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true, format: 'hh:mm:ss' , maskPlaceholder: {hour: 'h.', minute: 'm.', second: 's.'}});
            timepicker.appendTo('#timepicker');
            expect(timepicker.element.value).toBe('h.:m.:s.');
            expect(timepicker.value).toBe(null);
        });
        
        
        // it('Clear button', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
        //     document.body.appendChild(inputEle);
        //     timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss' , value: new Date('01/01/2021 01:01:01')});
        //     timepicker.appendTo('#timepicker');
        //     expect(timepicker.element.value).toBe('01:01:01');
        //     expect(+timepicker.value).toBe(+new Date());
        // (<HTMLInputElement>document.getElementsByClassName('e-clear-icon')[0]).dispatchEvent(clickEvent);
        // expect(timepicker.element.value).toBe('hour:minute:second');
        // expect(timepicker.value).toBe(null);
        // });
        it('Selection navigation using keyboard action', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss'});
            
            timepicker.appendTo('#timepicker');
            timepicker.focusIn();
            expect(timepicker.element.value).toBe('hour:minute:second');
            timepicker.element.selectionStart= 0;
            timepicker.element.selectionEnd= 4 ;
            expect(timepicker.value).toBe(null);
            keyEventArgs.action = 'right';
            keyEventArgs.key = 'ArrowRight';
            timepicker.inputHandler(keyEventArgs);
            expect(timepicker.element.selectionStart).toBe(5);
            expect(timepicker.element.selectionEnd).toBe(11);
            timepicker.inputHandler(keyEventArgs);
            expect(timepicker.element.selectionStart).toBe(12);
            expect(timepicker.element.selectionEnd).toBe(18);
            keyEventArgs.action = 'left';
            keyEventArgs.key = 'ArrowLeft';
            timepicker.inputHandler(keyEventArgs);
            expect(timepicker.element.selectionStart).toBe(5);
            expect(timepicker.element.selectionEnd).toBe(11);
            timepicker.inputHandler(keyEventArgs);
            expect(timepicker.element.selectionStart).toBe(0);
            expect(timepicker.element.selectionEnd).toBe(4);
        });
        it('Selection navigation using tab and shiftTab ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss'});
            timepicker.appendTo('#timepicker');
            timepicker.focusIn();
            expect(timepicker.element.value).toBe('hour:minute:second');
            timepicker.element.selectionStart= 0;
            timepicker.element.selectionEnd= 4 ;
            keyEventArgs.action = 'tab';
            keyEventArgs.key = 'Tab';
            timepicker.inputHandler(keyEventArgs);
            expect(timepicker.element.selectionStart).toBe(5);
            expect(timepicker.element.selectionEnd).toBe(11);
            timepicker.inputHandler(keyEventArgs);
            expect(timepicker.element.selectionStart).toBe(12);
            expect(timepicker.element.selectionEnd).toBe(18);
            keyEventArgs.action = 'shiftTab'
            timepicker.inputHandler(keyEventArgs);
            expect(timepicker.element.selectionStart).toBe(5);
            expect(timepicker.element.selectionEnd).toBe(11);
            timepicker.inputHandler(keyEventArgs);
            expect(timepicker.element.selectionStart).toBe(0);
            expect(timepicker.element.selectionEnd).toBe(4);
        });
        it('Increment and decrement of date using up arrow', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss'});
            timepicker.appendTo('#timepicker');
            timepicker.focusIn();
            expect(timepicker.element.value).toBe('hour:minute:second');
            timepicker.element.selectionStart = 0;
            timepicker.element.selectionEnd = 4;
            keyEventArgs.key = 'ArrowUp';
            let date: Date = new Date();
            timepicker.inputHandler(keyEventArgs);
            expect(timepicker.element.value).toBe('01:minute:second');
            expect(timepicker.value).toBe(null);
            timepicker.element.selectionStart = 0;
            timepicker.element.selectionEnd = 2;
            keyEventArgs.key = 'ArrowDown';
            timepicker.inputHandler(keyEventArgs);
            expect(timepicker.element.value).toBe('12:minute:second');
            expect(timepicker.value).toBe(null);
        });
        it('Value property', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss aa'});
            timepicker.appendTo('#timepicker');
            timepicker.focusIn();
            timepicker.mouseUpHandler(mouseEventArgs);
            expect(timepicker.element.value).toBe('hour:minute:second AM');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '1:minute:second AM';
            timepicker.element.selectionStart = 1;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:minute:second AM');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '01:2:second AM';
            timepicker.element.selectionStart = 4;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:02:second AM');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '01:02:9 AM';
            timepicker.element.selectionStart = 7;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:02:09 AM');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '01:02:09 P';
            timepicker.element.selectionStart = 10;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:02:09 PM');
            expect(timepicker.value).toBe(null);
            timepicker.inputBlurHandler()
            expect((timepicker.value.getHours() % 12).toString()+':'+timepicker.value.getMinutes().toString()+':'+timepicker.value.getSeconds().toString()).toBe('1:2:9');
        });
        it('24 hours format test', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true , format: 'HH:mm'});
            timepicker.appendTo('#timepicker');
            timepicker.focusIn();
            timepicker.mouseUpHandler(mouseEventArgs);
            expect(timepicker.element.value).toBe('hour:minute');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '1:minute';
            timepicker.element.selectionStart = 1;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:minute');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '01:2';
            timepicker.element.selectionStart = 4;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:02');
            expect(timepicker.value).toBe(null);
        });
        it('Deletion', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss aa'});
            timepicker.appendTo('#timepicker');
            timepicker.focusIn();
            timepicker.mouseUpHandler(mouseEventArgs);
            expect(timepicker.element.value).toBe('hour:minute:second AM');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '1:minute:second AM';
            timepicker.element.selectionStart = 1;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:minute:second AM');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '01:2:second AM';
            timepicker.element.selectionStart = 4;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:02:second AM');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '01:02:9 AM';
            timepicker.element.selectionStart = 7;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:02:09 AM');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '01:02:09 P';
            timepicker.element.selectionStart = 10;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:02:09 PM');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '01:02: PM';
            timepicker.element.selectionStart = 6;
            timepicker.element.selectionEnd = 8;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:02:second PM');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '01::second PM';
            timepicker.element.selectionStart = 3;
            timepicker.element.selectionEnd = 5;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:minute:second PM');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = ':minute:second PM';
            timepicker.element.selectionStart = 0;
            timepicker.element.selectionEnd = 2;
            keyEventArgs.action = keyEventArgs.key = keyEventArgs.code = 'Delete'
            timepicker.keydownHandler(keyEventArgs);
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('hour:minute:second PM');
            expect(timepicker.value).toBe(null);
        });

        
        // it('strict mode ', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
        //     document.body.appendChild(inputEle);
        //     timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss' , strictMode: true});
        //     timepicker.appendTo('#timepicker');
        //     timepicker.focusIn();
        //     timepicker.mouseUpHandler(mouseEventArgs);
        //     expect(timepicker.element.value).toBe('hour:minute:second');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.element.value = '1:minute:second';
        //     timepicker.element.selectionStart = 1;
        //     timepicker.inputEventHandler();
        //     expect(timepicker.element.value).toBe('01:minute:second');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.element.value = '01:2:second';
        //     timepicker.element.selectionStart = 4;
        //     timepicker.inputEventHandler();
        //     expect(timepicker.element.value).toBe('01:02:second');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.element.value = '01:02:9';
        //     timepicker.element.selectionStart = 7;
        //     timepicker.inputEventHandler();
        //     expect(timepicker.element.value).toBe('01:02:09');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.element.value = '01:02:09f';
        //     timepicker.inputBlurHandler()
        //     expect(timepicker.element.value).toBe('01:02:09');
        //   //  expect(timepicker.value).toBe(null);
        // });
        // it('strict mode with min and max property', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
        //     document.body.appendChild(inputEle);
        //     timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss' , strictMode: true , min: new Date(1,1,2021,1,1,1),
        //     max: new Date(1,1,2021,5,5,5)
        // });
        //     timepicker.appendTo('#timepicker');
        //     timepicker.focusIn();
        //     timepicker.mouseUpHandler(mouseEventArgs);
        //     expect(timepicker.element.value).toBe('hour:minute:second');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.element.value = '6:minute:second';
        //     timepicker.element.selectionStart = 1;
        //     timepicker.inputEventHandler();
        //     expect(timepicker.element.value).toBe('06:minute:second');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.element.value = '06:2:second';
        //     timepicker.element.selectionStart = 4;
        //     timepicker.inputEventHandler();
        //     expect(timepicker.element.value).toBe('06:02:second');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.element.value = '06:02:9';
        //     timepicker.element.selectionStart = 7;
        //     timepicker.inputEventHandler();
        //     expect(timepicker.element.value).toBe('06:02:09');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.inputBlurHandler()
        //     expect(timepicker.element.value).toBe('05:01:01');
        //   //  expect(timepicker.value).toBe(null);
        // });
        it('RTL mode with maskedDatepicker ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss' ,enableRtl: true});
            timepicker.appendTo('#timepicker');
            timepicker.focusIn();
            timepicker.mouseUpHandler(mouseEventArgs);
            expect(timepicker.element.value).toBe('hour:minute:second');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '1:minute:second';
            timepicker.element.selectionStart = 1;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:minute:second');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '01:2:second';
            timepicker.element.selectionStart = 4;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:02:second');
            expect(timepicker.value).toBe(null);
            timepicker.element.value = '01:02:9';
            timepicker.element.selectionStart = 7;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:02:09');
            expect(timepicker.value).toBe(null);
            timepicker.inputBlurHandler()
           // expect(+timepicker.value).toBe(+new Date());
        });
        // it('Enable mask with placeholder', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
        //     document.body.appendChild(inputEle);
        //     timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss' , placeholder: 'Enter the date'});
        //     timepicker.appendTo('#timepicker');
        //     expect(timepicker.element.value).toBe('');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.focusIn();
        //     expect(timepicker.element.value).toBe('hour:minute:second');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.focusOut();
        //     expect(timepicker.element.value).toBe('');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.focusIn();
        //     timepicker.element.value = '1:minute:second';
        //     timepicker.element.selectionStart = 1;
        //     timepicker.inputEventHandler();
        //     expect(timepicker.element.value).toBe('01:minute:second');
        //     timepicker.focusOut();
        //     expect(timepicker.element.value).toBe('01:minute:second');
        //     expect(timepicker.value).toBe(null);
        // });
        // it('FloatLabel type as auto', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
        //     document.body.appendChild(inputEle);
        //     timepicker = new TimePicker({enableMask: true , format: 'dd/MM/yy ddd' , placeholder: 'Enter the date' , floatLabelType: 'Auto'});
        //     timepicker.appendTo('#timepicker');
        //     expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter the date');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-bottom')).toBe(true);
        //     expect(timepicker.element.value).toBe('');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.focusIn();
        //     expect(timepicker.element.value).toBe('day/month/year');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top')).toBe(true);
        //     expect(timepicker.value).toBe(null);
        //     timepicker.focusOut();
        //     expect(timepicker.element.value).toBe('');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-bottom')).toBe(true);
        //     expect(timepicker.value).toBe(null);
        //     timepicker.focusIn();
        //     timepicker.element.value = '1/month/year';
        //     timepicker.element.selectionStart = 1;
        //     timepicker.inputEventHandler();
        //     expect(timepicker.element.value).toBe('01/month/year');
        //     timepicker.focusOut();
        //     expect(timepicker.element.value).toBe('01/month/year');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top')).toBe(true);
        //     expect(timepicker.value).toBe(null);
        // });
        // it('FloatLabel type as always', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
        //     document.body.appendChild(inputEle);
        //     timepicker = new TimePicker({enableMask: true , format: 'dd/MM/yy ddd' , placeholder: 'Enter the date' , floatLabelType: 'Always'});
        //     timepicker.appendTo('#timepicker');
        //     expect(document.querySelector('.e-float-text').innerHTML).toBe('Enter the date');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top')).toBe(true);
        //     expect(timepicker.element.value).toBe('day/month/year');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.focusIn();
        //     expect(timepicker.element.value).toBe('day/month/year');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top')).toBe(true);
        //     expect(timepicker.value).toBe(null);
        //     timepicker.focusOut();
        //     expect(timepicker.element.value).toBe('');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top')).toBe(true);
        //     expect(timepicker.value).toBe(null);
        //     timepicker.focusIn();
        //     timepicker.element.value = '1/month/year';
        //     timepicker.element.selectionStart = 1;
        //     timepicker.inputEventHandler();
        //     expect(timepicker.element.value).toBe('01/month/year');
        //     timepicker.focusOut();
        //     expect(timepicker.element.value).toBe('01/month/year');
        //     expect(document.getElementsByClassName('e-float-text')[0].classList.contains('e-label-top')).toBe(true);
        //     expect(timepicker.value).toBe(null);
        // });
        
        it('culture(ja) test case', () => {
            loadCultureFiles('ja');
            timepicker = new TimePicker({
                locale: 'ja',
                format: 'hh:mm:ss',
                enableMask: true
            });
            timepicker.appendTo('#date');
            expect(timepicker.locale).toBe('ja');
            timepicker.focusIn();
            expect(timepicker.element.value).toBe('時間:分:秒');
        });
        // it('culture(zh) test case', () => {
        //     loadCultureFiles('zh');
        //     timepicker = new TimePicker({
        //         locale: 'zh',
        //         format: 'hh:mm:ss',
        //         enableMask: true
        //     });
        //     timepicker.appendTo('#date');
        //     expect(timepicker.locale).toBe('zh');
        //     timepicker.focusIn();
        //     setTimeout(() => {
        //         expect(timepicker.element.value).toBe('小時:分鐘:第二');
        //     },100);
        //     timepicker.focusOut();
        // });
        // it('culture(de) test case', () => {
        //     loadCultureFiles('ja');
        //     timepicker = new TimePicker({
        //         locale: 'de',
        //         format: 'hh:mm:ss',
        //         enableMask: true
        //     });
        //     timepicker.appendTo('#date');
        //     expect(timepicker.locale).toBe('de');
        //     expect(timepicker.element.value).toBe('Stunde:Minute:Sekunden');
        // });
        
        it('dynamic mask module ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({format: 'hh:mm:ss'});
            timepicker.appendTo('#timepicker');
            expect(timepicker.element.value).toBe('');
            expect(timepicker.value).toBe(null);
            timepicker.enableMask = true;
            timepicker.dataBind();
            expect(timepicker.element.value).toBe('hour:minute:second');
            expect(timepicker.value).toBe(null);
            timepicker.enableMask = false;
            timepicker.dataBind();
            expect(timepicker.element.value).toBe('');
        });
        // it('ChangeEvent ', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
        //     document.body.appendChild(inputEle);
        //     timepicker = new TimePicker({enableMask: true , format: 'dd/MM/yyyy' ,
        //  change: function(args) {
        //     expect(+args.value).toBe(+new Date('01/01/2012'));
        //   }
        // });
        //     timepicker.appendTo('#timepicker');
        //     timepicker.focusIn();
        //     timepicker.mouseUpHandler(mouseEventArgs);
        //     expect(timepicker.element.value).toBe('hour:minute:second');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.element.value = '1:minute:second';
        //     timepicker.element.selectionStart = 1;
        //     timepicker.inputEventHandler();
        //     expect(timepicker.element.value).toBe('01:minute:second');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.element.value = '01:2:second';
        //     timepicker.element.selectionStart = 4;
        //     timepicker.inputEventHandler();
        //     expect(timepicker.element.value).toBe('01:02:second');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.element.value = '01:02:9';
        //     timepicker.element.selectionStart = 7;
        //     timepicker.inputEventHandler();
        //     expect(timepicker.element.value).toBe('01:02:09');
        //     expect(timepicker.value).toBe(null);
        //     timepicker.inputBlurHandler()
        //    // expect(+timepicker.value).toBe(+new Date());
        // });
        it('With format property  ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true , format: 'h:m:s H'});
            timepicker.appendTo('#timepicker');
            expect(timepicker.element.value).toBe('hour:minute:second hour');
            expect(timepicker.value).toBe(null);
        });
        it('With format property -1 ', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true , format: 'HH:mm:ss'});
            timepicker.appendTo('#timepicker');
            expect(timepicker.element.value).toBe('hour:minute:second');
            expect(timepicker.value).toBe(null);
        });
        it('with format property -2', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss aa'});
            timepicker.appendTo('#timepicker');
            expect(timepicker.element.value).toBe('hour:minute:second AM');
            expect(timepicker.value).toBe(null);
        });
        // it('with format property -3', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
        //     document.body.appendChild(inputEle);
        //     timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss zzzz'});
        //     timepicker.appendTo('#timepicker');
        //   //  expect(timepicker.element.value).toBe('hour:minute:second +05:30+5');
        //     expect(timepicker.value).toBe(null);
        // });
        // it('with format property -4', () => { 
        //     let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
        //     document.body.appendChild(inputEle);
        //     timepicker = new TimePicker({enableMask: true , format: 'hh:mm:ss zz'});
        //     timepicker.appendTo('#timepicker');
        //    // expect(timepicker.element.value).toBe('hour:minute:second +05');
        //     expect(timepicker.value).toBe(null);
        // });
});
describe('EJ2-54456-When enabling mask support, the change event will not be triggered', () => {
    let timepicker: any;
    let maskedDateTime: any;
    let keyEventArgs: any = {
        preventDefault: (): void => { /** NO Code */ },
        stopPropagation:(): void=>{},
        action: 'ArrowUp',
        code: 'ArrowUp',
        key: 'ArrowUp'
    };
    beforeAll(() => {
        let ele: HTMLElement = createElement('input', { id: 'date' });
        document.body.appendChild(ele);
    });
    afterAll(() => {
        if (timepicker) {
            timepicker.destroy();
        }
        document.body.innerHTML = '';
        maskedDateTime = new MaskedDateTime();
        maskedDateTime.destroy();
    });
    it('Testing change event ', () => { 
        let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
        document.body.appendChild(inputEle);
        timepicker = new TimePicker({enableMask: true , format: 'h:mm a', change: function(args){
            expect(args.text === timepicker.inputElement.value).toBe(true);
        },
     });
        timepicker.appendTo('#timepicker');
        (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
        timepicker.focusIn();
        expect(timepicker.inputWrapper.container.classList.contains('e-input-focus')).toBe(true);
         timepicker.liCollections[0].click();
        expect(timepicker.liCollections[0].classList.contains('e-active')).toBe(true);
        expect(timepicker.inputElement.value === "12:00 AM").toBe(true);
        timepicker.element.selectionStart = 0;
        timepicker.element.selectionEnd = 2;
        timepicker.element.value = '1:00 AM';
        keyEventArgs.action = 'shiftTab';
        timepicker.inputHandler(keyEventArgs);
        timepicker.inputBlurHandler();
        expect(timepicker.inputElement.value === "1:00 AM").toBe(true);
        timepicker.element.selectionStart = 0;
        timepicker.element.selectionEnd = 2;
        timepicker.element.value = '12:00 AM';
        keyEventArgs.key = 'ArrowDown';
        timepicker.inputHandler(keyEventArgs);
        timepicker.inputBlurHandler();
        expect(timepicker.inputElement.value === "12:00 AM").toBe(true);
      });
    });
      describe('EJ2-54761', () => {
        let timepicker: any;
        let maskedDateTime: any;
        let keyEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            stopPropagation:(): void=>{}
        };
        let mouseEventArgs: any = { preventDefault: function () { }, target: null };
        beforeAll(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
            maskedDateTime = new MaskedDateTime();
            maskedDateTime.destroy();
        });
        it('Mask support in TimePicker is not working properly when typing value starts with 0', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true , format: "HH:mm a"});
            timepicker.appendTo('#timepicker');
            timepicker.focusIn();
            expect(timepicker.element.value).toBe('hour:minute AM');
            timepicker.element.selectionStart= 0;
            timepicker.element.selectionEnd= 4 
            timepicker.mouseUpHandler(mouseEventArgs);
            timepicker.element.value = '0:minute AM';
            timepicker.element.selectionStart = 1;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('00:minute AM');
            expect(timepicker.value).toBe(null);
            timepicker.element.selectionStart = 0;
            timepicker.element.selectionEnd = 1;
            timepicker.element.value = '1:minute AM';
            timepicker.element.selectionStart = 1;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:minute AM');
            expect(timepicker.element.selectionStart).toBe(3);
            expect(timepicker.element.selectionEnd).toBe(9);
            timepicker.element.selectionStart = 3;
            timepicker.element.selectionEnd = 9;
            timepicker.element.value = '01:2 AM';
            timepicker.element.selectionStart = 4;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:02 AM');
            expect(timepicker.value).toBe(null);
            timepicker.element.selectionStart = 3;
            timepicker.element.selectionEnd = 5;
            timepicker.element.value = '01:3 AM';
            timepicker.element.selectionStart = 4;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:23 AM');
            expect(timepicker.element.selectionStart).toBe(6);
            expect(timepicker.element.selectionEnd).toBe(8);
        });
    });
    describe('EJ2-56789: change event is not trigger when mask property is enable and manually update the time in input', () => {
        let timepicker: any;
        let maskedDateTime: any;
        beforeAll(() => {
            let ele: HTMLElement = createElement('input', { id: 'date' });
            document.body.appendChild(ele);
        });
        afterAll(() => {
            if (timepicker) {
                timepicker.destroy();
            }
            document.body.innerHTML = '';
            maskedDateTime = new MaskedDateTime();
            maskedDateTime.destroy();
        });
        it('Testing change event trigger', () => { 
            let inputEle: HTMLElement = createElement('input', { id: 'timepicker' });
            document.body.appendChild(inputEle);
            timepicker = new TimePicker({enableMask: true , format: "hh:mm a", change: function(args) {
                expect((args.value) == (timepicker.value)).toBe(true);
            }});
            timepicker.appendTo('#timepicker');
            (<HTMLElement>document.getElementsByClassName(' e-input-group-icon e-time-icon  e-icons')[0]).dispatchEvent(clickEvent);
            timepicker.focusIn();
            timepicker.liCollections[0].click();
            expect(timepicker.inputElement.value === "12:00 AM").toBe(true);
            timepicker.element.selectionStart= 0;
            timepicker.element.selectionEnd= 2 
            timepicker.element.value = '1:00 AM';
            timepicker.element.selectionStart = 1;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:00 AM');
            timepicker.inputBlurHandler();
            timepicker.element.selectionStart = 3;
            timepicker.element.selectionEnd = 4;
            timepicker.element.value = '01:2 AM';
            timepicker.element.selectionStart = 4;
            timepicker.inputEventHandler();
            expect(timepicker.element.value).toBe('01:02 AM');
            timepicker.inputBlurHandler();
        });
    });
});