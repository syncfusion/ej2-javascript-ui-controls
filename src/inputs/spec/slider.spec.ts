/**
 * Floating Input through Utility
 */
import { createElement, attributes, Browser, L10n } from '@syncfusion/ej2-base';
import { isNullOrUndefined, EventHandler } from '@syncfusion/ej2-base';
import { Slider } from '../src/slider/slider';

function copyObject(source: any, destination: any): Object {
    for (let prop in source) {
        destination[prop] = source[prop];
    }
    return destination;
}

function setMouseCoordinates(eventarg: any, x: number, y: number): Object {
    eventarg.pageX = x;
    eventarg.pageY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    return eventarg;
}

export function getEventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}


export function setTheme(theme: string) {
    let css: string = `.e-slider-container::after { content: '${theme}'; display: none;}`;
    let style: HTMLStyleElement = document.createElement('style'); style.type = 'text/css';
    let styleNode: Node = style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('body')[0].appendChild(style);
}
describe('Slider Control', () => {
    describe('Slider element', () => {
        let slider: Slider;
        let ele: HTMLElement
        beforeEach((): void => {
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
            slider = undefined;
            ele = createElement('div', { id: 'slider' });
            ele.style.height = '100px';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('Control class testing', () => {
            slider = new Slider({});
            slider.appendTo('#slider');
            expect(document.getElementById('slider').classList.contains('e-slider')).toEqual(true);
        });
        it('cssClass testing', () => {
            slider = new Slider({ cssClass: "class1" });
            slider.appendTo('#slider');
            expect(document.getElementById('slider').classList.contains('class1')).toEqual(true);
        });
        it('multiple cssClass testing', () => {
            slider = new Slider({ cssClass: "class1 class2" });
            slider.appendTo('#slider');
            expect(document.getElementById('slider').classList.contains('class1')).toEqual(true);
            expect(document.getElementById('slider').classList.contains('class2')).toEqual(true);
        });

        it('Empty options testing', () => {
            window.localStorage.setItem('sliderslider', '');
            slider = new Slider({ enablePersistence: true });
            expect(slider.element).toEqual(undefined);
            slider.appendTo('#slider');
            expect(document.getElementById('slider').classList.contains('e-slider')).toEqual(true);
        });
        it('DOM Hidden input testing', () => {
            slider = new Slider({});
            slider.appendTo('#slider');
            expect(document.querySelectorAll(".e-slider-input").length).toBe(1);
        });
        it('Hidden input value testing', () => {
            slider = new Slider({ value: 90 });
            slider.appendTo('#slider');
            expect((document.querySelectorAll(".e-slider-input")[0] as HTMLInputElement).value).toEqual('90');
        });
        it('Slider bar testing', () => {
            slider = new Slider({});
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll(".e-slider").length).toBe(1);
        });
        it('Slider handle testing', () => {
            slider = new Slider({});
            slider.appendTo('#slider');
            expect(document.getElementById('slider').querySelectorAll(".e-handle").length).toBe(1);
        });
        it('DOM minRange Slider rangebar element testing', () => {
            slider = new Slider({ type: 'MinRange' });
            slider.appendTo('#slider');
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
        });

        it('DOM Range Slider rangebar element testing', () => {
            slider = new Slider({ type: 'Range' });
            slider.appendTo('#slider');
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
            expect(document.getElementById('slider').querySelectorAll(".e-handle").length).toBe(2);
        });

        it('DOM Range Slider rangebar element testing', () => {
            slider = new Slider({ type: 'Range', value: [30, 30] });
            slider.appendTo('#slider');
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
            expect(document.getElementById('slider').querySelectorAll(".e-handle").length).toBe(2);
        });

        it('Slider with customvalue value testing', () => {
            let eventArgs: any;
            let events: any;
            slider = new Slider({ ticks: { placement: 'After' }, customValues: [10, 20, 70, 95, 100, 200, 500, 30, 90], value: 1 });
            slider.appendTo('#slider');
            expect((document.getElementById('slider').querySelectorAll(".e-large")[1] as HTMLElement).innerText).toBe("20");
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('20');
            slider.type = "MinRange";
            slider.customValues = ["poor", "average", "good", "excellent"],
            slider.value = 3;
            slider.dataBind();
            expect((document.getElementById('slider').querySelectorAll('.e-large')[3] as HTMLElement).innerText).toBe("excellent");
            slider.dataBind();
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
            events = new Slider({ type: 'Range', customValues: [10, 20, 25, 30, 40, 45, 60, 80, 70, 35, 90, 100], value: [0, 2], tooltip: { isVisible: true } });
            events.appendTo('#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement), target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe("10 - 25");
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('10');
            expect((document.getElementsByClassName('e-handle')[2] as HTMLElement).getAttribute('aria-valuenow')).toBe('25');
            slider.enableRtl =true;
            slider.dataBind();
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('10');
            expect((document.getElementsByClassName('e-handle')[2] as HTMLElement).getAttribute('aria-valuenow')).toBe('25');
            slider.orientation = "Vertical";
            slider.dataBind();
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-vertical")).toBe(true);
        });


        it('Range Slider with value declaration testing', () => {
            slider = new Slider({ type: 'Range', value: [10, 30] });
            slider.appendTo('#slider');
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
            expect(document.getElementById('slider').querySelectorAll(".e-handle").length).toBe(2);
        });

        it('Range Slider with value declaration testing', () => {
            slider = new Slider({ type: 'Range', value: [30, 10] });
            slider.appendTo('#slider');
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
            expect(document.getElementById('slider').querySelectorAll(".e-handle").length).toBe(2);
        });

        it('Slider Orientation:vertical testing', () => {
            slider = new Slider({ orientation: 'Vertical' });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-vertical")).toBe(true);
        });

        it('Dynamic Slider Orientation testing', () => {
            slider = new Slider({ orientation: 'Vertical' });
            slider.orientation = 'Horizontal';
            slider.dataBind();
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-horizontal")).toBe(true);
        });

        it('Dynamic Slider Orientation testing with tick', () => {
            slider = new Slider({ value: 7, ticks: { placement: 'Before', showSmallTicks: true }, enableRtl: true, });
            slider.appendTo('#slider');
            slider.orientation = "Vertical";
            slider.dataBind();
            expect((document.querySelectorAll('.e-scale')[0].children.length)).not.toEqual(0);
        });

        it('Slider Orientation:vertical with minRange slider testing', () => {
            slider = new Slider({ orientation: 'Vertical', type: 'MinRange' });
            slider.appendTo('#slider');
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-vertical")).toBe(true);
        });

        it('Dynamic minRange Slider Orientation testing', () => {
            slider = new Slider({ orientation: 'Vertical', type: 'MinRange' });
            slider.appendTo('#slider');
            slider.orientation = 'Horizontal';
            slider.dataBind();
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-horizontal")).toBe(true);
        });

        it('Dynamic Range Slider Orientation testing', () => {
            slider = new Slider({ orientation: 'Vertical', type: 'Range' });
            slider.appendTo('#slider');
            slider.orientation = 'Horizontal';
            slider.dataBind();
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-horizontal")).toBe(true);
        });

        it('Slider Orientation:vertical, enableRtl with minRange slider testing', () => {
            slider = new Slider({ orientation: 'Vertical', type: 'MinRange', enableRtl: true });
            slider.appendTo('#slider');
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-vertical")).toBe(true);
        });

        it('Slider showButtons:true testing', () => {
            slider = new Slider({ showButtons: true });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-first-button').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-second-button').length).toBe(1);
        });

        it('Slider enableRtl:true testing', () => {
            slider = new Slider({ enableRtl: true });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-rtl")).toBe(true);
        });

        it('Slider enableRtl:true with Range slider testing', () => {
            slider = new Slider({ enableRtl: true, type: 'Range' });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-rtl")).toBe(true);
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
        });

        it('Slider enableRtl:true with Range slider testing', () => {
            slider = new Slider({ enableRtl: true, type: 'MinRange' });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-rtl")).toBe(true);
        });

        it('Set Rtl value dynamic testing in slider', () => {
            slider = new Slider({});
            slider.enableRtl = true;
            slider.dataBind();
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-rtl")).toBe(true);
        });

        it('Set Rtl value dynamic testing in slider with button', () => {
            slider = new Slider({ showButtons: true });
            slider.appendTo('#slider');
            slider.enableRtl = true;
            slider.dataBind();
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-rtl")).toBe(true);
        });

        it('Set Rtl value dynamic testing in range slider', () => {
            slider = new Slider({ type: 'Range' });
            slider.appendTo('#slider');
            slider.enableRtl = true;
            slider.dataBind();
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-rtl")).toBe(true);
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
        });

        it('Set Rtl value dynamic testing in range slider with button', () => {
            slider = new Slider({ type: 'Range', showButtons: true });
            slider.appendTo('#slider');
            slider.enableRtl = true;
            slider.dataBind();
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-rtl")).toBe(true);
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
        });

        it('Set Rtl value dynamic testing in range slider with button', () => {
            slider = new Slider({ type: 'Range', showButtons: true });
            slider.appendTo('#slider');
            slider.enableRtl = true;
            slider.dataBind();
            slider.enableRtl = false;
            slider.dataBind();
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-rtl")).toBe(false);
        });

        it('Set Rtl value dynamic testing in minrange slider', () => {
            slider = new Slider({ type: 'MinRange' });
            slider.appendTo('#slider');
            slider.enableRtl = true;
            slider.dataBind();
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-rtl")).toBe(true);
        });

        it('Slider Ticks large step as negative value testing', () => {
            ele.style.height = '300px;'
            slider = new Slider({ ticks: { placement: 'Both', largeStep: -15, smallStep: 1, showSmallTicks: true } });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-h-scale').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-first-tick').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick').length).toBe(101);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-last-tick').length).toBe(1);
        });

        it('Slider Ticks small step as negative value testing', () => {
            slider = new Slider({ ticks: { placement: 'Both', largeStep: 10, smallStep: 1, showSmallTicks: true } });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-h-scale').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-first-tick').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick').length).toBe(101);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-last-tick').length).toBe(1);
        });

        it('Slider Ticks small step as negative value testing', () => {
            slider = new Slider({ ticks: { placement: 'Both', largeStep: 10, smallStep: -1, showSmallTicks: true } });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-h-scale').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-first-tick').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick').length).toBe(101);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-last-tick').length).toBe(1);
        });

        it('Slider Ticks with 1 deciaml values', () => {
            slider = new Slider({ min: 0, max: 1, step: 0.1, ticks: { placement: 'After', largeStep: 0.2, smallStep: 0.1, showSmallTicks: true } });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick-value')[3].textContent).toBe('0.6');
        });

        it('Slider Ticks with 2 deciaml values', () => {
            slider = new Slider({
                min: 0.1, max: 0.2, step: 0.01, ticks: {
                    placement: 'After', largeStep: 0.02, smallStep: 0.01,
                    showSmallTicks: true
                }
            });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick-value')[3].textContent).toBe('0.16');
        });

        it('Slider min and max in fractional with 1 deciaml values', () => {
            slider = new Slider({
                min: 100.5, max: 200.5, step: 1, ticks: {
                    placement: 'After', largeStep: 20, smallStep: 10,
                    showSmallTicks: true
                }
            });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick-value')[3].textContent).toBe('160.5');
        });

        it('Slider Ticks in fractional with 1 deciaml values', () => {
            slider = new Slider({
                min: 1.5, max: 10.5, step: 0.5, ticks: {
                    placement: 'After', largeStep: 0.5, smallStep: 0.1,
                    showSmallTicks: true
                }
            });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick-value')[4].textContent).toBe('3.5');
        });

        it('Slider Ticks in negative values', () => {
            slider = new Slider({
                min: -100, max: 0, step: 1, ticks: {
                    placement: 'After', largeStep: 20, smallStep: 10,
                    showSmallTicks: true
                }
            });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick-value')[3].textContent).toBe('-40');
        });

        it('Slider Ticks in negative values with decimal values', () => {
            slider = new Slider({ min: -20, max: 10, step: 2.5, ticks: { placement: 'After', largeStep: 2.5 } });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick-value')[5].textContent).toBe('-7.5');
        });

        it('Slider Ticks enabled testing', () => {
            slider = new Slider({ ticks: { placement: 'Both', largeStep: 10, smallStep: 1, showSmallTicks: true } });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-h-scale').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-first-tick').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick').length).toBe(101);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-last-tick').length).toBe(1);
        });

        it('Slider Ticks enabled without small ticks testing', () => {
            slider = new Slider({ ticks: { placement: 'Both', largeStep: 10, smallStep: 1, showSmallTicks: false } });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-h-scale').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-first-tick').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick').length).toBe(11);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-last-tick').length).toBe(1);
        });

        it('Slider Ticks with vertical orientation enabled testing', () => {
            slider = new Slider({ orientation: 'Vertical', ticks: { placement: 'After', largeStep: 10, smallStep: 1, showSmallTicks: true } });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-vertical")).toBe(true);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-first-tick').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick').length).toBe(101);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-last-tick').length).toBe(1);
        });

        it('Slider Ticks with vertical orientation enabled testing', () => {
            slider = new Slider({ orientation: 'Vertical', ticks: { placement: 'Both', largeStep: 10, smallStep: 1, showSmallTicks: true } });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-vertical")).toBe(true);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-first-tick').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick').length).toBe(101);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-last-tick').length).toBe(1);
        });

        it('Slider Ticks with vertical orientation without smallticks enabled testing', () => {
            slider = new Slider({ orientation: 'Vertical', ticks: { placement: 'Both', largeStep: 10, smallStep: 1, showSmallTicks: false } });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-vertical")).toBe(true);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-first-tick').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick').length).toBe(11);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-last-tick').length).toBe(1);
        });
        it('Slider Ticks with vertical orientation enabled testing with ticks after', () => {
            slider = new Slider({ orientation: 'Vertical', ticks: { placement: 'After', largeStep: 10, smallStep: 1, showSmallTicks: true } });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-vertical")).toBe(true);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-first-tick').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-tick').length).toBe(101);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-last-tick').length).toBe(1);
        });
        it('Slider vertical orientation slider enableRtl:true with Range slider testing', () => {
            slider = new Slider({ enableRtl: true, type: 'Range', orientation: 'Vertical' });
            slider.appendTo('#slider');
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-rtl")).toBe(false);
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-vertical")).toBe(true);
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
        });

        it('Slider aria attributes checking', () => {
            slider = new Slider({ showButtons: true });
            slider.appendTo('#slider');
            expect(document.getElementsByClassName('e-handle')[0].getAttribute('aria-orientation')).toEqual('horizontal');
            expect(document.getElementsByClassName('e-handle')[0].getAttribute('aria-labelledby')).toEqual('slider_title');
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuemin')).toBe('0');
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuemax')).toBe('100');
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('0');
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuetext')).toBe('0');
            expect((document.getElementsByClassName('e-first-button')[0] as HTMLElement).getAttribute('aria-label')).toBe('Decrease');
            expect((document.getElementsByClassName('e-second-button')[0] as HTMLElement).getAttribute('aria-label')).toBe('Increase');
        });

        it('Slider tooltip:true testing', () => {
            slider = new Slider({ showButtons: true, tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            expect((document.body.querySelectorAll(".e-tooltip-wrap")).length).toEqual(0);
            slider.destroy();
        });
        it('Slider tooltip:true testing', () => {
            slider = new Slider({ showButtons: true, type: 'Range', tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            setTheme('material');
            slider.appendTo('#slider');
            slider.destroy();
        });

        it('Slider tooltip testing without isVisible', () => {
            slider = new Slider({ showButtons: true, tooltip: { placement: 'After', showOn: 'Auto' } });
            slider.appendTo('#slider');
            expect((document.body.querySelectorAll(".e-tooltip-wrap")).length).toEqual(0);
            slider.destroy();
        });

        it('Slider tooltip with Range slider:true testing', () => {
            slider = new Slider({ type: 'Range', tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            expect((document.body.querySelectorAll(".e-tooltip-wrap")).length).toEqual(0);
            slider.destroy();
        });

        it('Slider tooltip with orientation testing', () => {
            slider = new Slider({ tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' }, orientation: 'Vertical' });
            slider.appendTo('#slider');
            expect((document.body.querySelectorAll(".e-tooltip-wrap")).length).toEqual(0);
            slider.destroy();
        });

        it('Range slider-Hidden input value testing', () => {
            slider = new Slider({ type: 'Range' });
            slider.appendTo('#slider');
            expect((document.querySelectorAll(".e-slider-input")[0] as HTMLInputElement).value).toEqual('0,100');
        });

        it('Range slider-Hidden input value with given min and max value testing', () => {
            slider = new Slider({ type: 'Range', min: 10, max: 90 });
            slider.appendTo('#slider');
            expect((document.querySelectorAll(".e-slider-input")[0] as HTMLInputElement).value).toEqual('10,90');
        });

        it('Range slider-Hidden input value with value testing', () => {
            slider = new Slider({ type: 'Range', value: [20, 45], min: 10, max: 90 });
            slider.appendTo('#slider');
            expect((document.querySelectorAll(".e-slider-input")[0] as HTMLInputElement).value).toEqual('20,45');
        });

        it('notify property changes testing-cssClass property', () => {
            slider = new Slider({});
            slider.appendTo('#slider');
            slider.cssClass = "css-classname";
            slider.dataBind();
            expect(document.getElementById('slider').classList.contains('css-classname')).toEqual(true);
        });
        it('mousedown on sliderbar container related test case', () => {
            let slider: any;
            slider = new Slider({ type: 'Range' });
            slider.appendTo('#slider');
            let event: object = {
                pageX: '300', pageY: '400',
                target: document.querySelectorAll('.e-slider-container')[0] as HTMLElement,
                currentTarget: document.querySelectorAll('.e-slider-container')[0] as HTMLElement, preventDefault: function () { }
            };
            (<HTMLElement>document.querySelectorAll('.e-handle')[0]).style.left = '10%'
        });
        it('Mouse move on sliderbar container related test case', () => {
            let slider: any;
            slider = new Slider({ type: 'Range' });
            slider.appendTo('#slider');
            let event: object = {
                pageX: '300', pageY: '400',
                target: document.querySelectorAll('.e-slider-container')[0] as HTMLElement,
                currentTarget: document.querySelectorAll('.e-slider-container')[0] as HTMLElement, preventDefault: function () { }
            };
            (<HTMLElement>document.querySelectorAll('.e-handle')[0]).style.left = '10%'
            slider.isMouseMove = true;
        });
        it('notify property changes testing-enabled property', () => {
            let slider: any;
            slider = new Slider({ enabled: false });
            slider.appendTo('#slider');
            slider.enabled = true;
            slider.dataBind();
            expect(slider.sliderContainer.classList.contains('e-disabled')).toEqual(false);
            slider.enabled = false;
            slider.dataBind();
            expect(slider.sliderContainer.classList.contains('e-disabled')).toEqual(true);
        });

        it('notify property changes testing-enabled property', () => {
            let slider: any;
            slider = new Slider({});
            slider.appendTo('#slider');
            slider.enabled = false;
            slider.dataBind();
            expect(slider.sliderContainer.classList.contains('e-disabled')).toEqual(true);
            slider.enabled = true;
            slider.dataBind();
            expect(slider.sliderContainer.classList.contains('e-disabled')).toEqual(false);
        });

        it('notify property changes testing-enabled property', () => {
            let slider: any;
            slider = new Slider({ type: 'Range', enabled: false });
            slider.appendTo('#slider');
            slider.enabled = true;
            slider.dataBind();
            expect(slider.sliderContainer.classList.contains('e-disabled')).toEqual(false);
            slider.enabled = false;
            slider.dataBind();
            expect(slider.sliderContainer.classList.contains('e-disabled')).toEqual(true);
        });

        it('notify property changes testing-enabled property', () => {
            let slider: any;
            slider = new Slider({ type: 'Range' });
            slider.appendTo('#slider');
            slider.enabled = false;
            slider.dataBind();
            expect(slider.sliderContainer.classList.contains('e-disabled')).toEqual(true);
            slider.enabled = true;
            slider.dataBind();
            expect(slider.sliderContainer.classList.contains('e-disabled')).toEqual(false);
        });
        it('notify property changes testing-enabled property with tooltip mode always ', () => {
            let slider: any;
            slider = new Slider({ enabled: false, tooltip: { isVisible: true, showOn: 'Always' } });
            slider.appendTo('#slider');
            slider.enabled = true;
            slider.firstTooltipObj.open(slider.firstHandle)
            slider.dataBind();
            expect(slider.sliderContainer.classList.contains('e-disabled')).toEqual(false);
            slider.enabled = false;
            slider.firstTooltipObj.open(slider.firstHandle)
            slider.dataBind();
            expect(slider.sliderContainer.classList.contains('e-disabled')).toEqual(true);
        });
        it('notify property changes testing-enabled property with tooltip mode always in range type', () => {
            let slider: any;
            slider = new Slider({ enabled: false, tooltip: { isVisible: true, showOn: 'Always' }, type: 'Range' });
            slider.appendTo('#slider');
            slider.enabled = true;
            slider.firstTooltipObj.open(slider.firstHandle);
            slider.secondTooltipObj.open(slider.secondHandle);
            slider.dataBind();
            expect(slider.sliderContainer.classList.contains('e-disabled')).toEqual(false);
            slider.enabled = false;
            slider.firstTooltipObj.open(slider.firstHandle);
            slider.secondTooltipObj.open(slider.secondHandle);
            slider.dataBind();
            expect(slider.sliderContainer.classList.contains('e-disabled')).toEqual(true);
        });

        it('default slider with change Event testing', () => {
            slider = new Slider({ change: onChange });
            slider.appendTo('#slider');
            slider.value = 70;
            slider.dataBind();
        });
        function onChange(args: any): void {
            expect(args.value).toBe(70);
        }
        it('range slider with change Event testing', () => {
            slider = new Slider({ change: onRangeChange, type: 'Range' });
            slider.appendTo('#slider');
            slider.value = [10, 50];
            slider.dataBind();

        });
        function onRangeChange(args: any): void {
            expect(args.value[0]).toBe(10);
            expect(args.value[1]).toBe(50);
        }

        it('range slider with change Event testing with higher values', () => {
            slider = new Slider({ change: onRangeChange1, type: 'Range', min: 1000, max: 80000 });
            slider.appendTo('#slider');
            (document.querySelectorAll('.e-slider-container')[0] as HTMLElement).classList.add('e-slider-active');
            slider.value = [10000, 50000];
            slider.dataBind();
        });
        function onRangeChange1(args: any): void {
            expect(args.value[0]).toBe(10000);
            expect(args.value[1]).toBe(50000);
        }

        it('notify property changes value  property', () => {
            slider = new Slider({});
            slider.appendTo('#slider');
            slider.value = 40;
            slider.dataBind();
            expect((document.querySelectorAll(".e-slider-input")[0] as HTMLInputElement).value).toEqual('40');
        });
        it('notify property changes min  property', () => {
            slider = new Slider({});
            slider.appendTo('#slider');
            slider.min = 10;
            slider.dataBind();
            expect(slider.min).toEqual(10);
        });

        it('notify property changes max  property', () => {
            slider = new Slider({});
            slider.appendTo('#slider');
            slider.max = 80;
            slider.dataBind();
            expect(slider.max).toEqual(80);
        });

        it('notify property changes testing-tooltip property', () => {
            let slider: any;
            slider = new Slider({ type: 'Range', tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            slider.tooltip.placement = "before";
            slider.dataBind();
            expect((document.body.querySelectorAll(".e-tooltip-wrap")).length).toEqual(0);
        });

        it('notify property changes testing tooltip property', () => {
            slider = new Slider({ type: 'Range', tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            setTheme('material');
            slider.tooltip.isVisible = false;
            expect((document.body.querySelectorAll(".e-tooltip-wrap")).length).toEqual(0);
        });

        it('notify property changes testing tooltip property', () => {
            slider = new Slider({ type: 'Range', tooltip: { placement: 'After', isVisible: false, showOn: 'Auto' } });
            slider.appendTo('#slider');
            slider.tooltip.isVisible = true;
            slider.dataBind();
            expect((document.body.querySelectorAll(".e-tooltip-wrap")).length).toEqual(0);
        });


        it('notify property changes testing-tooltip property', () => {
            slider = new Slider({ type: 'Range', orientation: 'Vertical', tooltip: { placement: 'Before', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            expect((document.body.querySelectorAll(".e-tooltip-wrap")).length).toEqual(0);
        });

        it('notify property changes testing-ticks property', () => {
            slider = new Slider({ ticks: { placement: 'Before', largeStep: 15, smallStep: 5, showSmallTicks: true }, });
            slider.appendTo('#slider');
            slider.ticks.placement = "Both";
            slider.dataBind();
            expect((document.querySelectorAll('.e-scale')[0].children.length)).toEqual(21);
        });


        it('notify property changes testing-cssClass property with existing class name', () => {
            slider = new Slider({ cssClass: 'class1' });
            slider.appendTo('#slider');
            slider.cssClass = "class2";
            slider.dataBind();
            expect(document.getElementById('slider').classList.contains('class2')).toEqual(true);
        });

        it('notify property changes testing-type property', () => {
            slider = new Slider({ value: 0 });
            slider.appendTo('#slider');
            slider.type = "MinRange";
            slider.dataBind()
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
        });

        it('notify property changes testing-type property', () => {
            setTheme('material');
            slider = new Slider({ value: [10, 20], type: 'Range', tooltip: { isVisible: true } });
            slider.appendTo('#slider');
            slider.type = "MinRange";
            slider.dataBind()
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(1);
        });

        it('notify property changes testing-type property', () => {
            slider = new Slider({ value: [10, 20], type: 'Range', tooltip: { placement: 'Before', isVisible: true } });
            slider.appendTo('#slider');
            slider.type = "Default";
            slider.dataBind()
            expect(document.getElementById('slider').querySelectorAll('.e-range').length).toBe(0);
        });


        it('notify property changes testing enableRtl with range type property', () => {
            slider = new Slider({ enableRtl: true, type: 'Range', tooltip: { isVisible: true } });
            slider.appendTo('#slider');
            expect(document.querySelectorAll('.e-rtl').length).toBe(1);
        });
        it('notify property changes testing enableRtl with minRange type property', () => {
            slider = new Slider({ enableRtl: true, type: 'MinRange', tooltip: { isVisible: true } });
            slider.appendTo('#slider');
            expect(document.querySelectorAll('.e-rtl').length).toBe(1);
        });

        it('notify property changes testing-showButtons property', () => {
            slider = new Slider({});
            slider.appendTo('#slider');
            slider.showButtons = true;
            slider.dataBind();
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-first-button').length).toBe(1);
            expect((document.getElementsByClassName('e-slider-container')[0]).querySelectorAll('.e-second-button').length).toBe(1);
        });

        it('notify property changes testing-multiple cssClass', () => {
            slider = new Slider({});
            slider.appendTo('#slider');
            slider.cssClass = "class1 class2";
            slider.dataBind();
            expect(document.getElementById('slider').classList.contains('class1')).toEqual(true);
            expect(document.getElementById('slider').classList.contains('class2')).toEqual(true);
        });

        it('slider check the handle value method', () => {
            let slider: any;
            slider = new Slider({ min: 10, max: 100 });
            slider.appendTo('#slider');
            let value: number = slider.checkHandleValue(500);
            expect(value).toEqual(100);
            let value1: number = slider.checkHandleValue(-500);
            expect(value1).toEqual(10);
            let value2: number = slider.checkHandleValue(500);
            expect(value2).toEqual(100);
        });

        it('slider repeat button testing', () => {
            let slider: any;
            slider = new Slider({ showButtons: true, enableRtl: true });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mousedown', currentTarget: slider.firstBtn, target: slider.firstBtn, preventDefault: (): void => { } };
            slider.repeatHandlerMouse(eventArgs);
            slider.repeatHandlerUp(eventArgs);
            let event = { type: 'touchstart', currentTarget: slider.firstBtn, target: slider.firstBtn, preventDefault: (): void => { } };
            slider.repeatHandlerMouse(event);
            slider.repeatHandlerUp(event);
            expect(event.type).toBe('touchstart')
        });
        it('slider repeat button testing with second button', () => {
            let slider: any;
            slider = new Slider({ showButtons: true, enableRtl: true, tooltip: { placement: 'Before', isVisible: true, showOn: 'Focus' } });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mousedown', currentTarget: slider.secondBtn, target: slider.firstBtn, preventDefault: (): void => { } };
            slider.repeatHandlerMouse(eventArgs);
            slider.repeatHandlerUp(eventArgs);
            let event = { type: 'touchstart', currentTarget: slider.secondBtn, target: slider.firstBtn, preventDefault: (): void => { } };
            slider.repeatHandlerMouse(event);
            slider.repeatHandlerUp(event);
            expect(event.type).toBe('touchstart')
        });
        it('slider repeat button testing with tooltip', () => {
            let slider: any;
            slider = new Slider({ showButtons: true, tooltip: { isVisible: true } });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mousedown', target: slider.firstBtn, currentTarget: slider.firstBtn, preventDefault: (): void => { } };
            slider.repeatButton(eventArgs);
            expect(eventArgs.type).toBe('mousedown')
        });
        it('slider repeat button testing with tooltip with range enabled for second button', () => {
            let slider: any;
            slider = new Slider({ showButtons: true, tooltip: { isVisible: true }, type: 'Range' });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mousedown', target: slider.secondBtn, currentTarget: slider.secondBtn, preventDefault: (): void => { } };
            slider.repeatButton(eventArgs);
            expect(eventArgs.type).toBe('mousedown')
        });
        it('slider repeat button testing with tooltip with range enabled for first button', () => {
            let slider: any;
            slider = new Slider({ showButtons: true, tooltip: { isVisible: true }, type: 'Range' });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mousedown', target: slider.firstBtn, currentTarget: slider.firstBtn, preventDefault: (): void => { } };
            slider.activeHandle = 1;
            slider.repeatButton(eventArgs);
            expect(eventArgs.type).toBe('mousedown')
        });
        it('slider repeat button testing with tooltip with range enabled for first button for second handle', () => {
            let slider: any;
            slider = new Slider({ showButtons: true, tooltip: { isVisible: true }, type: 'Range' });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mousedown', target: slider.firstBtn, currentTarget: slider.firstBtn, preventDefault: (): void => { } };
            slider.activeHandle = 2;
            slider.repeatButton(eventArgs);
            expect(eventArgs.type).toBe('mousedown');
            slider.repeatHandlerUp();
        });
        it('slider repeat button with first button as target testing', () => {
            let slider: any;
            slider = new Slider({ showButtons: true });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mouseup', currentTarget: slider.firstBtn, preventDefault: (): void => { } };
            slider.repeatHandlerUp(eventArgs);
            expect(eventArgs.type).toBe('mouseup')
        });
        it('slider repeat button with second button as target testing', () => {
            let slider: any;
            slider = new Slider({ showButtons: true });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mouseup', currentTarget: slider.secondBtn, preventDefault: (): void => { } };
            slider.repeatHandlerUp(eventArgs);
            expect(eventArgs.type).toBe('mouseup')
        });
        it('slider repeat button  with span icon as target testing', () => {
            let slider: any;
            slider = new Slider({ showButtons: true });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mouseup', target: slider.firstBtn.firstElementChild, preventDefault: (): void => { } };
            slider.repeatButton(eventArgs);
        });
        it('slider repeat button  with span icon  as target  testing', () => {
            let slider: any;
            slider = new Slider({ showButtons: true, enableRtl: true });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mouseup', target: slider.firstBtn.firstElementChild, preventDefault: (): void => { } };
            slider.repeatButton(eventArgs);
        });
        it('slider repeat button with span icon as target testing', () => {
            let slider: any;
            slider = new Slider({ showButtons: true });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mouseup', target: slider.secondBtn.firstElementChild, preventDefault: (): void => { } };
            slider.repeatButton(eventArgs);
        });
        it('slider repeat button with second button as target testing', () => {
            let slider: any;
            slider = new Slider({ showButtons: true });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mouseup', target: slider.secondBtn, preventDefault: (): void => { } };
            slider.repeatButton(eventArgs);
        });
        it('slider repeat button with span icon as target testing', () => {
            let slider: any;
            slider = new Slider({ showButtons: true, enableRtl: true });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mouseup', target: slider.secondBtn.firstElementChild, preventDefault: (): void => { } };
            slider.repeatButton(eventArgs);
        });
        it('slider repeat button  with first button as target  testing', () => {
            let slider: any;
            slider = new Slider({ showButtons: true, enableRtl: true });
            slider.appendTo('#slider');
            let eventArgs = { type: 'mouseup', target: slider.firstBtn, preventDefault: (): void => { } };
            slider.repeatButton(eventArgs);
        });

        it('Default slider key press- testing ', () => {
            let eventArgs: any;
            let events: any;
            events = new Slider({});
            events.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).focus();
            eventArgs = { keyCode: 37, currentTarget: events.element, target: events.element, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('0');
            eventArgs = { keyCode: 38, currentTarget: events.element, target: events.element, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('1');
            eventArgs = { keyCode: 39, currentTarget: events.element, target: events.element, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('2');
            eventArgs = { keyCode: 40, currentTarget: events.element, target: events.element, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('1');
            events.value = 40;
            events.dataBind();
            eventArgs = { keyCode: 36, currentTarget: events.element, target: events.element, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('0');
            eventArgs = { keyCode: 35, currentTarget: events.element, target: events.element, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('100');
            events.value = 40;
            events.dataBind();
            eventArgs = { keyCode: 33, currentTarget: events.element, target: events.element, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('50');
            eventArgs = { keyCode: 34, currentTarget: events.element, target: events.element, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('40');
            events.enableRtl = true;
            events.dataBind();
            eventArgs = { keyCode: 40, currentTarget: events.element, target: events.element, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('41');
            events.value = 40;
            events.dataBind();
            eventArgs = { keyCode: 36, currentTarget: events.element, target: events.element, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('0');
            eventArgs = { keyCode: 35, currentTarget: events.element, target: events.element, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('100');
            events.value = 40;
            events.dataBind();
            eventArgs = { keyCode: 33, currentTarget: events.element, target: events.element, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('30');
            eventArgs = { keyCode: 34, currentTarget: events.element, target: events.element, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('40');
            eventArgs = { keyCode: 35, target: events.firstHandle, preventDefault: (): void => { } };
        });
        it('Slider with disabled state ', () => {
            let eventArgs: any;
            let events: any;
            events = new Slider({ enabled: false });
            events.appendTo('#slider');
            expect(events.sliderContainer.classList.contains('e-disabled')).toEqual(true);
        });
        it(' Range slider keyDown test case', () => {
            let eventArgs: any;
            let events: any;
            events = new Slider({ type: 'Range' });
            events.appendTo('#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
        });
        it('Range tooltip test case', () => {
            let eventArgs: any;
            let events: any;
            events = new Slider({ type: 'Range', tooltip: { isVisible: true } });
            events.appendTo('#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement), target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 100')
        });

        it('Range tooltip test case with tooltip after placement', () => {
            let eventArgs: any;
            let events: any;
            events = new Slider({ type: 'Range', tooltip: { placement: 'After', isVisible: true } });
            events.appendTo('#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement), target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 100')
        });

        it('Range tooltip test case with tooltip after placement (KeyUp Coverage)', () => {
            let eventArgs: any;
            let eventArgs1: any;
            let events: any;
            events = new Slider({ type: 'Range', tooltip: { placement: 'After', isVisible: true } });
            events.appendTo('#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement), target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { } };
            eventArgs1 = { keyCode: 37, currentTarget: events.secondHandle, target: events.secondHandle, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            events.keyUp(eventArgs1);
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 100')
        });

        it('Range tooltip test case with tooltip after placement (KeyUp Coverage)', () => {
            let eventArgs: any;
            let eventArgs1: any;
            let events: any;
            events = new Slider({ type: 'Range', tooltip: { placement: 'After', isVisible: true } });
            events.appendTo('#slider');
            eventArgs = { keyCode: 9, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement), target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { } };
            eventArgs1 = { keyCode: 9, currentTarget: events.secondHandle, target: events.secondHandle, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            events.keyUp(eventArgs1);
            eventArgs = { keyCode: 9, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement), target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);

            // For Handle-02
            eventArgs = { keyCode: 9, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            eventArgs1 = { keyCode: 9, currentTarget: events.firstHandle, target: events.firstHandle, preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            events.keyUp(eventArgs1);
            eventArgs = { keyCode: 9, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('Range tooltip test case with tooltip after placement in vertical slider for activehandle 1', () => {
            let eventArgs: any;
            let events: any;
            events = new Slider({ type: 'Range', orientation: 'Vertical', tooltip: { placement: 'After', isVisible: true } });
            events.appendTo('#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement), target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 100');
            let targetEle = (document.getElementsByClassName("e-handle")[0] as HTMLElement);
            targetEle.classList.add('e-tab-handle');
            (document.getElementsByClassName("e-range")[0] as HTMLElement).classList.add("e-tab-range");
            (document.getElementsByClassName("e-slider-track")[0] as HTMLElement).classList.add("e-tab-track");
            events.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 100');
            targetEle.classList.remove('e-tab-handle');
            targetEle = (document.getElementsByClassName("e-handle")[1] as HTMLElement);
            targetEle.classList.add('e-tab-handle');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement), target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 100');
        });
        it('Range tooltip test case with tooltip after placement in vertical slider for activehandle 2', () => {
            let eventArgs: any;
            let events: any;
            events = new Slider({ type: 'Range', orientation: 'Vertical', tooltip: { placement: 'After', isVisible: true } });
            events.appendTo('#slider');
            events.activeHandle = 2;
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement), target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 98');
            let targetEle = (document.getElementsByClassName("e-handle")[0] as HTMLElement);
            targetEle.classList.add('e-tab-handle');
            (document.getElementsByClassName("e-range")[0] as HTMLElement).classList.add("e-tab-range");
            (document.getElementsByClassName("e-slider-track")[0] as HTMLElement).classList.add("e-tab-track");
            events.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 97');
            targetEle.classList.remove('e-tab-handle');
            targetEle = (document.getElementsByClassName("e-handle")[1] as HTMLElement);
            targetEle.classList.add('e-tab-handle');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement), target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 96');
        });
        it('Range tooltip test case with tooltip before placement in vertical slider', () => {
            let eventArgs: any;
            let events: any;
            events = new Slider({ type: 'Range', orientation: 'Vertical', tooltip: { placement: 'Before', isVisible: true } });
            events.appendTo('#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement), target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 100');
            let targetEle = (document.getElementsByClassName("e-handle")[0] as HTMLElement);
            targetEle.classList.add('e-tab-handle');
            (document.getElementsByClassName("e-range")[0] as HTMLElement).classList.add("e-tab-range");
            (document.getElementsByClassName("e-slider-track")[0] as HTMLElement).classList.add("e-tab-track");
            events.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 100');
            targetEle.classList.remove('e-tab-handle');
            targetEle = (document.getElementsByClassName("e-handle")[1] as HTMLElement);
            targetEle.classList.add('e-tab-handle');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement), target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { } };
            events.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 100');
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    })
    describe('Slider', () => {
        let slider: Slider;
        beforeEach((): void => {
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
            slider = undefined;
            let ele: HTMLElement = createElement('div', { id: 'slider' });
            ele.style.height = '10px';
            ele.style.width = '10px';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('parent height and width less than 10px  testing', () => {
            slider = new Slider({
                orientation: 'Vertical',
                value: 30,
                ticks: { placement: 'Both', largeStep: 15, smallStep: 5, showSmallTicks: true }
            });
            slider.appendTo('#slider');
            expect(document.getElementById('slider').classList.contains('e-slider')).toEqual(true);
        });
    })
    describe('Slider', () => {
        let slider: any;
        beforeEach((): void => {
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
            slider = undefined;
            let ele: HTMLElement = createElement('div', { id: 'slider' });
            ele.style.height = '10px';
            ele.style.width = '10px';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('parent height less than 10px  testing', () => {
            slider = new Slider({
                orientation: 'Horizontal',
                value: 30,
                type: 'Range',
                ticks: { placement: 'Both', largeStep: 15, smallStep: 5, showSmallTicks: true }
            });
            slider.appendTo('#slider');
            expect(document.getElementById('slider').classList.contains('e-slider')).toEqual(true);
            let event: any;
            event = {
                target: document.querySelectorAll('.e-slider-container')[0] as HTMLElement, preventDefault: function () { }
            };
            (<HTMLElement>document.querySelectorAll('.e-handle')[0]).style.left = '10%'
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).style.left).toBe('10%');
        });
    })
    describe('Slider - tick-pos', () => {
        let slider: any;
        let ua = Browser.userAgent;
        beforeEach((): void => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            slider = undefined;
            let ele: HTMLElement = createElement('div', { id: 'slider' });
            ele.style.height = '10px';
            ele.style.width = '10px';
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
            Browser.userAgent = ua;
        });
        it('tick-pos added', () => {
            slider = new Slider({
                orientation: 'Horizontal',
                value: 30,
                type: 'Range',
                ticks: { placement: 'Both', largeStep: 15, smallStep: 5, showSmallTicks: true }
            });
            slider.appendTo('#slider');
            expect(document.getElementsByClassName('e-tick-pos') !== null).toBe(true);
        });
    })
    describe('Slide related events testing with tooltip with mobile useragent', () => {
        let slider: Slider;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        let ua = Browser.userAgent;
        beforeEach(() => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range' }, '#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-handle");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-handle")[0];
        });
        it('Slide the slider handle testing', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('4');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
        });
        afterEach(() => {
            document.body.innerHTML = '';
            Browser.userAgent = ua;
        });
    });
    describe('Slide related events testing', () => {
        let slider: Slider;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        beforeEach(() => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range' }, '#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-handle");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-handle")[0];
        });
        it('Slide the slider handle testing', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('4');
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });
    describe('Event related test case', () => {
        let slider: any;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        beforeEach(() => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({}, '#slider');

        });
        it('hover releated testing', () => {
            (<HTMLElement>document.querySelectorAll('.e-handle')[0]).style.left = '40%'
            slider.hover();
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).style.left).toBe('40%');
        });
        it('mousedown on sliderbar container related test case', () => {
            let event: any;
            event = {
                pageX: '300', pageY: '400',
                target: document.querySelectorAll('.e-slider-container')[0] as HTMLElement,
                currentTarget: document.querySelectorAll('.e-slider-container')[0] as HTMLElement, preventDefault: function () { }
            };
            (<HTMLElement>document.querySelectorAll('.e-handle')[0]).style.left = '10%'
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).style.left).toBe('10%');
        });

        it('mousedown on sliderbar control related test case', () => {
            let event: any;
            event = {
                target: document.querySelectorAll('.e-slider-container')[0] as HTMLElement, preventDefault: function () { }
            };
            (<HTMLElement>document.querySelectorAll('.e-handle')[0]).style.left = '10%'
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).style.left).toBe('10%');
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });

    describe('Slide related events testing', () => {
        let slider: Slider;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        beforeEach(() => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ min: 20, max: 10, type: 'Range' }, '#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-handle")[0];
            EventHandler.trigger(document.getElementsByClassName("e-handle")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-handle");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-handle")[0];
        });
        it('Slide the slider handle with min is greater than max value testing', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('10');
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });

    describe('Slide related events testing', () => {
        let slider: any;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        beforeEach(() => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-handle");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-handle")[0];
        });
        it('Slide the range slider second handle testing1', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('4');
            slider.getPersistData();
            let val = { x: 90, y: 100 };
            slider.val = 110;
            slider.xyToPosition(val);

            slider.enableRtl = true;
            val = { x: 90, y: 100 };
            slider.val = 110;
            slider.xyToPosition(val);
            val = { x: 90, y: 100 };
            slider.val = 110;
            slider.xyToPosition(val);

            val = { x: 90, y: 100 };
            slider.min = 0;
            slider.max = 0;
            slider.val = 110;
            slider.xyToPosition(val);
        });
        it('Slide the range slider second handle testing1', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('4');
            slider.getPersistData();
            let val = { x: 90, y: 100 };
            slider.val = 110;
            slider.xyToPosition(val);
        });

        it('Slide the range slider second handle testing', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('4');
            slider.getPersistData();
            let val = { x: 90, y: 100 };
            slider.val = 110;
            slider.xyToPosition(val);
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });
    describe('Slider slidermove method testing', () => {
        let slider: any;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        it('Slide the range slider using sliderbarmove', () => {
            setTheme('material');
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];


            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('4');

        });
        it('Slide the range slider for second handle using sliderbarmove', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [0, 30], tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 519, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 512, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 519, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];


            mousemove = setMouseCoordinates(mousemove, 519, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('44');
        });
        it('Slide the range slider for second handle collide checking using sliderbarmove', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [30, 30], tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 519, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 519, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];


            mousemove = setMouseCoordinates(mousemove, 519, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('30');
        });
        it('Slide the range slider for first handle collide checking using sliderbarmove', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [30, 30], tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 512, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];


            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('30');
        });
        it('Slide the default slider using sliderbarmove', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];


            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('4');
        });
        it('Slide the default slider using sliderbarmove', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ tooltip: { placement: 'After', isVisible: true, showOn: 'Always' } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];


            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('4');
            slider.handlePos1 = 10;
            slider.handlePos2 = 20;
            let currentTarget = document.getElementsByClassName('e-slider')[0];
            let args = { changedTouches: [{ clientX: 148, clientY: 349 }], preventDefault: function () { }, type: 'touchstart', currentTarget: currentTarget };
            slider.sliderDown(args);
            slider.handlePos1 = 10;
            slider.handlePos2 = 20;
            args = {
                changedTouches: [{ clientX: 148, clientY: 349 }], type: 'touchmove', preventDefault: function () { },
                currentTarget: currentTarget
            };
            slider.sliderBarMove(args);
        });
        afterEach(() => {
            document.body.innerHTML = '';
        })
    })
    describe('Slide related events testing', () => {
        let slider: Slider;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        beforeEach(() => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } }, '#slider');
            (document.getElementsByClassName("e-handle")[1] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[1] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-handle")[1];
            EventHandler.trigger(document.getElementsByClassName("e-handle")[1] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-handle")[1];
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-handle")[1];
        });
        it('Slide the range slider second handle slide testing', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('0');
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });

    describe('Slide related events testing', () => {
        let slider: Slider;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        beforeEach(() => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', step: 0 }, '#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-handle")[0];
            EventHandler.trigger(document.getElementsByClassName("e-handle")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-handle");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-handle")[0];
        });
        it('Slide the second handle with step value as 0', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('100');
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });
    describe('Slide related events testing with mobile useragent', () => {
        let slider: any;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        let ua = Browser.userAgent;
        beforeEach(() => {
            let androidPhoneUa: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidPhoneUa;
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-handle");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-handle")[0];
        });
        it('Slide the range slider second handle testing1', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('4');
            slider.getPersistData();
            let val = { x: 90, y: 100 };
            slider.val = 110;
            slider.xyToPosition(val);
        });
        it('Slide the range slider second handle testing1', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('4');
            slider.getPersistData();
            let val = { x: 90, y: 100 };
            slider.val = 110;
            slider.xyToPosition(val);
        });

        it('Slide the range slider second handle testing', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('4');
            slider.getPersistData();
            let val = { x: 90, y: 100 };
            slider.val = 110;
            slider.xyToPosition(val);
        });
        afterEach(() => {
            document.body.innerHTML = '';
            Browser.userAgent = ua;
        });
    });

    describe('Slide related events testing', () => {
        let slider: Slider;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        beforeEach(() => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', step: 200 }, '#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-handle")[0];
            EventHandler.trigger(document.getElementsByClassName("e-handle")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-handle");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-handle")[0];
        });
        it('Slide the second handle with step value as above 100', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('0');
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });


    describe('Slide related events testing', () => {
        let slider: Slider;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        beforeEach(() => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', orientation: 'Vertical' }, '#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-handle")[0];
            EventHandler.trigger(document.getElementsByClassName("e-handle")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-handle");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-handle")[0];
        });
        it('Vertical Slider: Slide the first handle with step value as 0', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('0');
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });

    describe('Slide related events testing', () => {
        let slider: Slider;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        beforeEach(() => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', orientation: 'Vertical' }, '#slider');
            (document.getElementsByClassName("e-handle")[1] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[1] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-handle")[1];
            EventHandler.trigger(document.getElementsByClassName("e-handle")[1] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-handle");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-handle")[1];
        });
        it('Vertical Slider: Slide the second handle with step value as 0', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('100');
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });

    describe('Slider element', () => {
        let slider: Slider;
        let ele: HTMLElement
        beforeEach((): void => {
            let Chromebrowser: string = "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36";
            Browser.userAgent = Chromebrowser;
            slider = undefined;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            document.body.innerHTML = '';
        });
        it('refresh method testing', () => {
            slider = new Slider({});
            slider.appendTo('#slider');
            expect(document.getElementById('slider').classList.contains('e-slider')).toEqual(true);
        });
    });

    describe('Slide related events testing', () => {
        let slider: Slider;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        beforeEach(() => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', enableRtl: true }, '#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-handle")[0];
            EventHandler.trigger(document.getElementsByClassName("e-handle")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-handle");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-handle")[0];
        });
        it('RTL enabled Slider: Slide the second handle with step value as 0', () => {
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).style.left).toBe('auto');
            expect((document.getElementsByClassName('e-slider-container')[0]).classList.contains("e-rtl")).toBe(true);
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });

    describe('Sliderbar click testing ', () => {
        let ele: HTMLElement;
        beforeAll((done: Function) => {
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let clickFn: Function = jasmine.createSpy('click');
            let slider: Slider = new Slider({}, '#slider');
            slider.dataBind();
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-slider'))[0];
            ele1.click();
            setTimeout(() => { done(); }, 500);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('click event testing', () => {
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('0');
        });
    });

    describe('Sliderbar click with Range slider enabled testing ', () => {
        let ele: HTMLElement;
        beforeAll((done: Function) => {
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let clickFn: Function = jasmine.createSpy('click');
            let slider: Slider = new Slider({ type: 'Range' }, '#slider');
            slider.dataBind();
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-slider'))[0];
            ele1.click();
            setTimeout(() => { done(); }, 500);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('click event testing', () => {
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('0,100');
        });
    });

    describe('Slider Button click testing ', () => {
        let ele: HTMLElement;
        beforeAll((done: Function) => {
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let clickFn: Function = jasmine.createSpy('click');
            let slider: Slider = new Slider({ showButtons: true }, '#slider');
            slider.dataBind();
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-first-button'))[0];
            ele1.click();
            setTimeout(() => { done(); }, 500);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('click event testing', () => {
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('0');
        });
    });

    describe('Slider bar up ', () => {
        let ele: HTMLElement;

        afterAll(() => {
            document.body.innerHTML = '';

        });
        it('click event testing', () => {
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            setTheme('material');
            let slider: any = new Slider({ tooltip: { isVisible: true } }, '#slider');
            slider.sliderBarUp();
        });
    });

    describe('Slider Button click enabled with Range slider testing ', () => {
        let ele: HTMLElement;
        beforeAll((done: Function) => {
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let clickFn: Function = jasmine.createSpy('click');
            let slider: Slider = new Slider({ showButtons: true, type: 'Range' }, '#slider');
            slider.dataBind();
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-first-button'))[0];
            ele1.click();
            setTimeout(() => { done(); }, 500);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('click event testing', () => {
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('0,100');
        });
    });

    describe('Slider Button click enabled with Range slider testing ', () => {
        let ele: HTMLElement;
        let rangeSlider: any;
        beforeAll((done: Function) => {
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let clickFn: Function = jasmine.createSpy('click');
            rangeSlider = new Slider({ showButtons: true, type: 'Range' }, '#slider');
            rangeSlider.activeHandle = 2;
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-first-button'))[0];
            ele1.click();
            setTimeout(() => { done(); }, 500);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('click event testing', () => {
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('0,100');
        });
    });

    describe('Slider Button click enabled with Range slider with handle position as 100 testing ', () => {
        let ele: HTMLElement;
        let rangeSlider: any;
        beforeAll((done: Function) => {
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let clickFn: Function = jasmine.createSpy('click');
            rangeSlider = new Slider({ showButtons: true, type: 'Range', enableAnimation: false }, '#slider');
            rangeSlider.activeHandle = 1;
            rangeSlider.handlePos2 = 100;
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-first-button'))[0];
            ele1.click();
            setTimeout(() => { done(); }, 500);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('click event testing', () => {
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('0,100');
        });
    });

    describe('Slider Button click enabled with Range slider with handle position as negative value testing ', () => {
        let ele: HTMLElement;
        let rangeSlider: any;
        beforeAll((done: Function) => {
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let clickFn: Function = jasmine.createSpy('click');
            rangeSlider = new Slider({ showButtons: true, type: 'Range', enableAnimation: false }, '#slider');
            rangeSlider.handlePos = -1;
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-first-button'))[0];
            ele1.click();
            setTimeout(() => { done(); }, 500);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('click event testing', () => {
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('0,100');
        });
    });

    describe('RTL enabled Slider Button click enabled with Range slider testing ', () => {
        let ele: HTMLElement;
        beforeAll((done: Function) => {
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let clickFn: Function = jasmine.createSpy('click');
            let slider: Slider = new Slider({ showButtons: true, type: 'Range', enableRtl: true }, '#slider');
            slider.dataBind();
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-first-button'))[0];
            ele1.click();
            setTimeout(() => { done(); }, 500);
        });
        afterAll(() => {
            document.body.innerHTML = '';
        });
        it('click event testing', () => {
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('0,100');
        });
    });

    describe('RTL enabled Slider second Button click enabled with Range slider testing ', () => {
        let ele: HTMLElement;
        beforeAll((done: Function) => {
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let clickFn: Function = jasmine.createSpy('click');
            let slider: Slider = new Slider({ value: [10, 20], showButtons: true, type: 'Range', enableRtl: true }, '#slider');
            slider.dataBind();
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-second-button'))[0];
            ele1.click();
            setTimeout(() => { done(); }, 500);
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
        it('click event testing', () => {
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('10,20');
        });
    });

    function triggerMouseEvent(node: HTMLElement, eventType: string, x?: number, y?: number) {
        let mouseEve: MouseEvent = document.createEvent("MouseEvents");
        if (x && y) {
            mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);
        } else {
            mouseEve.initEvent(eventType, true, true);
        }
        node.dispatchEvent(mouseEve);
    }
    describe('Button hover test cases', () => {
        it('Button hover testing with range type on activehandle 1', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: [10, 20], showButtons: true, type: 'Range', enableRtl: true });
            slider.appendTo('#slider');
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-second-button'))[0];
            triggerMouseEvent(ele1, 'mouseenter');
        });
        it('Button hover testing with range type on activehandle 2', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: [10, 20], showButtons: true, type: 'Range', enableRtl: true });
            slider.appendTo('#slider');
            slider.activeHandle = 2;
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-second-button'))[0];
            triggerMouseEvent(ele1, 'mouseenter');
        });
        it('Button hover testing with no range type', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: [10], showButtons: true, enableRtl: true });
            slider.appendTo('#slider');
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-second-button'))[0];
            triggerMouseEvent(ele1, 'mouseenter');

        });
        it('Button hover testing with range type on mouse leave', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: [10, 20], showButtons: true, type: 'Range', enableRtl: true });
            slider.appendTo('#slider');
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-second-button'))[0];
            triggerMouseEvent(ele1, 'mouseleave');
        });
        it('Button hover testing with no range type on mouse leave', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: [10], showButtons: true, enableRtl: true });
            slider.appendTo('#slider');
            let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-second-button'))[0];
            triggerMouseEvent(ele1, 'mouseleave');
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });

    describe('Slider bootstrap theme testing', () => {
        let slider: any;
        let element: HTMLElement;
        let eventArgs: any;
        it('Before tooltip test', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            setTheme('bootstrap');
            slider = new Slider({ value: 10, min: 0, max: 100, type: 'Range', tooltip: { isVisible: true, placement: 'Before'} }, '#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            slider.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 100');
            slider.bootstrapCollisionArgs.collidedPosition = 'TopCenter';
            slider.tooltipBeforeOpen(eventArgs);
            slider.type = 'Default';
            slider.dataBind();
            slider.bootstrapCollisionArgs.collidedPosition = 'TopCenter';
            slider.tooltipBeforeOpen(eventArgs);
        });

        it('After tooltip test', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            setTheme('bootstrap');
            slider = new Slider({ value: 10, min: 0, max: 100, type: 'Range', tooltip: { isVisible: true, placement: 'After'} }, '#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            slider.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 100');
            slider.bootstrapCollisionArgs.collidedPosition = 'BottomCenter';
            slider.tooltipBeforeOpen(eventArgs);
            slider.type = 'Default';
            slider.dataBind();
            slider.bootstrapCollisionArgs.collidedPosition = 'BottomCenter';
            slider.tooltipBeforeOpen(eventArgs);
        });

        it('Before tooltip test in vertical', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            setTheme('bootstrap');
            slider = new Slider({ value: 10, min: 0, max: 100, type: 'Range', orientation: 'Vertical', tooltip: { isVisible: true, placement: 'Before'} }, '#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            slider.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 100');
            slider.bootstrapCollisionArgs.collidedPosition = 'LeftCenter';
            slider.tooltipBeforeOpen(eventArgs);
            slider.type = 'Default';
            slider.dataBind();
            slider.bootstrapCollisionArgs.collidedPosition = 'LeftCenter';
            slider.tooltipBeforeOpen(eventArgs);
        });

        it('After tooltip test in vertical', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            setTheme('bootstrap');
            slider = new Slider({ value: 10, min: 0, max: 100, type: 'Range', orientation: 'Vertical', tooltip: { isVisible: true, placement: 'After'} }, '#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            slider.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0 - 100');
            slider.bootstrapCollisionArgs.collidedPosition = 'RightCenter';
            slider.tooltipBeforeOpen(eventArgs);
            slider.type = 'Default';
            slider.dataBind();
            slider.bootstrapCollisionArgs.collidedPosition = 'RightCenter';
            slider.tooltipBeforeOpen(eventArgs);
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });
    });

    describe('Slider Tooltip format testing', () => {
        let slider: any;
        let element: HTMLElement;
        let eventArgs: any;
        it('Tooltip in dollar format', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({ value: 10, min: 0, max: 100, tooltip: { isVisible: true, placement: 'Before', format: 'C0' } }, '#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            slider.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('$9');
        });
        it('Tooltip in dollar format', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({ value: 10, min: 0, max: 100, ticks: { placement: 'Before', format: 'C0' } }, '#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            slider.keyDown(eventArgs);
        });
        it('Tooltip in percentage format', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({ value: 0, min: 0, max: 100, tooltip: { isVisible: true, placement: 'Before', format: 'P0' } }, '#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            slider.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('0%');
        });
        it('Tooltip in Numeric format', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({ value: 10, min: 0, max: 100, tooltip: { isVisible: true, placement: 'Before', format: 'N2' } }, '#slider');
            eventArgs = { keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement), target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { } };
            slider.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('9.00');
        });
        it('Tooltip Numeric format in range type', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({
                value: [10, 100], min: 0, max: 100, type: 'Range',
                tooltip: { isVisible: true, placement: 'Before', format: 'N2' }
            }, '#slider');
            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            slider.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('9.00 - 100.00');
        });
        it('Tooltip Numeric format in range type RTL case', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({
                value: [10, 100], min: 0, max: 100, type: 'Range', enableRtl: true,
                tooltip: { isVisible: true, placement: 'Before', format: 'N2' }
            }, '#slider');
            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { }
            };
            slider.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('100.00 - 9.00');
        });
        it('Tooltip Custom formats - Date', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({
                min: new Date("2013-06-13").getTime(),
                max: new Date("2013-06-21").getTime(),
                step: 86400000,
                tooltipChange: function (args: any) {
                    let totalMiliSeconds = Number(args.text);
                    let custom = { year: "numeric", month: "short", day: "numeric" };
                    args.text = new Date(totalMiliSeconds).toLocaleDateString("en-us", custom);
                },
                tooltip: {
                    isVisible: true,
                    placement: 'Before'
                }
            }, '#slider');
            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            slider.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('Jun 14, 2013');
            slider.setAriaAttrValue(slider.firstHandle);
        });
        it('Tooltip Custom formats - Date in range slider', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({
                min: new Date("2013-06-13").getTime(),
                max: new Date("2013-06-21").getTime(),
                step: 86400000,
                type: 'Range',
                tooltipChange: function (args: any) {
                    let totalMiliSeconds = Number(args.text.split(' ')[0]);
                    let custom = { year: "numeric", month: "short", day: "numeric" };
                    args.text = new Date(totalMiliSeconds).toLocaleDateString("en-us", custom);
                },
                tooltip: {
                    isVisible: true,
                    placement: 'Before',
                    cssClass: 'e-formatted-tooltip'
                }
            }, '#slider');
            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            slider.keyDown(eventArgs);
            expect(document.querySelectorAll('.e-tip-content')[0].textContent).toBe('Jun 14, 2013');
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    })

    describe('Slider Limits Testing', () => {
        let slider: any;
        let element: HTMLElement;
        let eventArgs: any;

        beforeEach(() => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
        });

        it('Default slider with limits enabled - minimum side testing', () => {
            slider = new Slider({ min: 0, max: 10, value: 5, limits: { enabled: true, minStart: 3, minEnd: 7 }, showButtons: true });
            slider.appendTo('#slider');

            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 5; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(3);
        });

        it('Default slider with limits enabled - maximum side testing', () => {
            slider = new Slider({ min: 0, max: 10, value: 5, limits: { enabled: true, minStart: 3, minEnd: 7 }, showButtons: true });
            slider.appendTo('#slider');

            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 5; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(7);
        });

        it('Default slider with limits enabled - minimum side only limited', () => {
            slider = new Slider({ min: 0, max: 10, value: 5, limits: { enabled: true, minStart: 4 }, showButtons: true });
            slider.appendTo('#slider');

            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 5; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(10);

            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 8; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(4);
        });

        it('Default slider with limits enabled - maximum side only limited', () => {
            slider = new Slider({ min: 0, max: 10, value: 5, limits: { enabled: true, minEnd: 7 }, showButtons: true });
            slider.appendTo('#slider');

            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 6; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(0);

            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 8; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(7);
        });

        it('MinRange slider with limits enabled - maximum side only limited RTL Mode', () => {
            slider = new Slider({ min: 0, max: 10, value: 5, limits: { enabled: true, minEnd: 7 }, showButtons: true, enableRtl: true });
            slider.appendTo('#slider');

            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 6; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(7);

            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 8; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(0);
        });

        it('Range slider with limits enabled - RTL Mode', () => {
            slider = new Slider({ min: 0, max: 10, value: [3, 6], limits: { enabled: true, maxEnd: 6 }, showButtons: true,
                enableRtl: true, type: 'Range' });
            slider.appendTo('#slider');

            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 6; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(6);

            slider.activeHandle = 2;
            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 3; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[1]).toBe(6);
        });

        it('Default slider with limits enabled - handle fixed', () => {
            slider = new Slider({ min: 0, max: 10, value: 5, limits: { enabled: true, minEnd: 7, startHandleFixed: true }, showButtons: true });
            slider.appendTo('#slider');

            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 2; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(5);

            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 2; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(5);
        });

        it('Range slider with limits enabled - only one limits enabled for both handle', () => {
            slider = new Slider({ min: 0, max: 10, value: [5, 6], limits: { enabled: true, minStart: 4, maxEnd: 7 }, showButtons: true,
             type: 'Range'});
            slider.appendTo('#slider');

            slider.activeHandle = 1;
            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 3; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(4);
            expect(slider.value[1]).toBe(6);

            slider.activeHandle = 2;
            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 3; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(4);
            expect(slider.value[1]).toBe(7);
        });

        it('Range slider with limits enabled - only limits enabled for first handle', () => {
            slider = new Slider({ min: 0, max: 10, value: [5, 8], limits: { enabled: true, minStart: 4, minEnd: 7 }, showButtons: true,
                type: 'Range' });
            slider.appendTo('#slider');

            slider.activeHandle = 1;
            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 2; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(4);
            expect(slider.value[1]).toBe(8);

            slider.activeHandle = 1;
            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 4; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(7);
            expect(slider.value[1]).toBe(8);
        });

        it('Range slider with limits enabled - both handle are fixed', () => {
            slider = new Slider({ min: 0, max: 10, value: [5, 6], limits: { enabled: true, minStart: 4, maxEnd: 7, startHandleFixed: true,
                endHandleFixed: true }, showButtons: true, type: 'Range'});
            slider.appendTo('#slider');

            slider.activeHandle = 1;
            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 2; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(5);
            expect(slider.value[1]).toBe(6);

            slider.activeHandle = 2;
            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 2; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(5);
            expect(slider.value[1]).toBe(6);
        });

        it('Range slider with limits enabled - only limits enabled for second handle', () => {
            slider = new Slider({ min: 0, max: 10, value: [5, 7], limits: { enabled: true, maxStart: 6, maxEnd: 8 }, showButtons: true,
                type: 'Range' });
            slider.appendTo('#slider');

            slider.activeHandle = 2;
            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 2; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(5);
            expect(slider.value[1]).toBe(6);

            slider.activeHandle = 2;
            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 3; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(5);
            expect(slider.value[1]).toBe(8);
        });

        it('Range slider with limits enabled - for both handle', () => {
            slider = new Slider({ min: 0, max: 10, value: [4, 8], limits: { enabled: true, minStart: 2, minEnd: 5, maxStart: 7, maxEnd: 9 },
                showButtons: true, type: 'Range' });
            slider.appendTo('#slider');

            slider.activeHandle = 1;
            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 3; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(2);
            expect(slider.value[1]).toBe(8);

            slider.activeHandle = 1;
            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 4; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(5);
            expect(slider.value[1]).toBe(8);

            slider.activeHandle = 2;
            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 2; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(5);
            expect(slider.value[1]).toBe(7);

            slider.activeHandle = 2;
            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 3; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(5);
            expect(slider.value[1]).toBe(9);
        });

        it('slider with limits enabled - limitbar element for default slider', () => {
            slider = new Slider({ min: 0, max: 10, value: 5, limits: { enabled: true, minStart: 2, minEnd: 8 }, showButtons: true });
            slider.appendTo('#slider');
            let sliderElement: HTMLElement = document.getElementById('slider');
            expect(sliderElement.querySelector('.e-limits').classList.contains('e-limit-bar')).toBe(true);
        });

        it('slider with limits enabled - limitbar element for range slider', () => {
            slider = new Slider({ min: 0, max: 10, value: [5, 7], limits: { enabled: true, minStart: 2, minEnd: 4, maxStart: 6, maxEnd: 8 },
                showButtons: true, type: 'Range' });
            slider.appendTo('#slider');
            let sliderElement: HTMLElement = document.getElementById('slider');
            expect(sliderElement.querySelectorAll('.e-limits')[0].classList.contains('e-limit-first')).toBe(true);
            expect(sliderElement.querySelectorAll('.e-limits')[1].classList.contains('e-limit-second')).toBe(true);
        });

        it('slider with limits enabled - feeding wrong limit values in default slider', () => {
            slider = new Slider({ min: 0, max: 5, value: 3, limits: { enabled: true, minStart: -3, minEnd: 50 }, showButtons: true });
            slider.appendTo('#slider');

            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 4; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(0);

            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 6; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(5);
        });

        it('slider with limits enabled - feeding wrong limit values in range slider', () => {
            slider = new Slider({ min: 0, max: 5, value: [0, 5], limits: { enabled: true, minStart: -10, minEnd: -1, maxStart: 10, maxEnd: 50 }, 
                showButtons: true, type: 'Range' });
            slider.appendTo('#slider');
            
            slider.activeHandle = 1;
            eventArgs = {
                keyCode: 37, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 2; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(0);

            slider.activeHandle = 2;
            eventArgs = {
                keyCode: 39, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 2; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[1]).toBe(5);
        });

        it('slider with limits enabled - in vertical orientation default slider', () => {
            document.getElementById('slider').style.height = '300px';
            slider = new Slider({ min: 0, max: 10, value: 4, limits: { enabled: true, minStart: 2, minEnd: 5 }, 
                showButtons: true, orientation: 'Vertical', type: 'Default' });
            slider.appendTo('#slider');

            eventArgs = {
                keyCode: 40, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 3; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(2);

            eventArgs = {
                keyCode: 38, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 4; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value).toBe(5);

            slider.type = 'MinRange';
            slider.dataBind();
            slider.type = 'Default';
            slider.dataBind();
            slider.limits.enabled = false;
            slider.dataBind();
            slider.limits.enabled = true;
            slider.dataBind();
        });

        it('slider with limits enabled - in vertical orientation range slider', () => {
            document.getElementById('slider').style.height = '300px';
            slider = new Slider({ min: 0, max: 10, value: [3, 7], limits: { enabled: true, minStart: 2, minEnd: 5, maxStart: 6, maxEnd: 8 }, 
                showButtons: true, type: 'Range', orientation: 'Vertical' });
            slider.appendTo('#slider');

            slider.activeHandle = 1;
            eventArgs = {
                keyCode: 40, currentTarget: (document.getElementsByClassName("e-handle")[0] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[0] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 2; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[0]).toBe(2);

            slider.activeHandle = 2;
            eventArgs = {
                keyCode: 38, currentTarget: (document.getElementsByClassName("e-handle")[1] as HTMLElement),
                target: (document.getElementsByClassName("e-handle")[1] as HTMLElement), preventDefault: (): void => { }
            };
            for (let i = 0; i < 2; i++) {
                (slider as any).keyDown(eventArgs);
            }
            expect(slider.value[1]).toBe(8);

            slider.type = 'Default';
            slider.dataBind();
        });

        it('slider with limits enabled - onPropertyChange method testing', () => {
            slider = new Slider({ min: 0, max: 10, value: [3, 7],  showButtons: true, type: 'Range' });
            slider.appendTo('#slider');
            slider.limits = { enabled: true, minStart: 2, minEnd: 5, maxStart: 6, maxEnd: 8 };
            slider.dataBind();
            slider.limits.minStart = 4;
            slider.dataBind();
            slider.limits.enabled = false;
            slider.dataBind();
        });

        it('slider with limits enabled - repeatbutton testing in default slider', () => {
            slider = new Slider({ min: 0, max: 10, value: 5, limits: { enabled: true, minStart: 4, minEnd: 7 }, showButtons: true });
            slider.appendTo('#slider');

            let eventArgs = { type: 'mousedown', target: slider.firstBtn, currentTarget: slider.firstBtn, preventDefault: (): void => { } };
            slider.repeatButton(eventArgs);
            slider.repeatButton(eventArgs);
            slider.repeatHandlerUp();

            expect(slider.value).toBe(4); 
        });

        it('slider with limits enabled - repeatbutton testing in range slider', () => {
            slider = new Slider({ min: 0, max: 10, value: [6, 7], limits: { enabled: true, minStart: 4, maxEnd: 7 }, showButtons: true,
            type: 'Range' });
            slider.appendTo('#slider');

            let eventArgs = { type: 'mousedown', target: slider.firstBtn, currentTarget: slider.firstBtn, preventDefault: (): void => { } };
            slider.repeatButton(eventArgs);
            slider.repeatButton(eventArgs);
            slider.repeatHandlerUp();
            expect(slider.value[0]).toBe(4);

            slider.activeHandle = 2;
            eventArgs = { type: 'mousedown', target: slider.secondBtn, currentTarget: slider.secondBtn, preventDefault: (): void => { } };
            slider.repeatButton(eventArgs);
            slider.repeatButton(eventArgs);
            slider.repeatHandlerUp();

            expect(slider.value[1]).toBe(7);
        });

        afterEach(() => {
            document.body.innerHTML = "";
        });
    });

    describe('Slider slidermove and sliderbarclick method testing with limits', () => {
        let slider: any;
        let dragEle: HTMLElement;
        let targetEle: HTMLElement;
        let mousemove: any;
        let instance: any;
        let mouseUp: any;
        it('Slide first handle in  the range slider using sliderbarmove', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' },
         limits: { enabled: true, minStart: 30, minEnd: 50, maxStart: 70, maxEnd: 90 } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];


            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('30');
        });

        it('Slide the range slider for second handle using sliderbarmove', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [0, 30], tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' },
            limits: { enabled: true, minStart: 30, minEnd: 50, maxStart: 70, maxEnd: 90 }  });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            slider.activeHandle = 2;
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 619, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 612, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 619, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];

            mousemove = setMouseCoordinates(mousemove, 619, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('70');
        });

        it('Slide the default slider using sliderbarmove', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' },
            limits: { enabled: true, minStart: 30, minEnd: 90 }   });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 312, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = setMouseCoordinates(mousemove, 319, 148);
            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];

            mousemove = setMouseCoordinates(mousemove, 319, 148);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('30');
        });

        afterEach(() => {
            document.body.innerHTML = '';
        })
    });

    describe('Slider Interval dragging test cases', () => {
        let dragEle: any;
        let targetEle: any;
        let slider: any;
        let mousemove: any;
        let mouseUp: any;

        it('Sliding the slider using range bar with drag interval enabled', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [0, 30], tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            (document.getElementsByClassName("e-range")[0] as HTMLElement).style.height = '6px';

            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 350, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-range")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 519, 148);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);

            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('34');
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('64');
        });

        it('Sliding the slider using range bar with drag interval and limits enabled - v1', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [10, 60],
            tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' },
            limits: {enabled: true, minStart: 10, minEnd: 30, maxStart: 60, maxEnd: 90 } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            (document.getElementsByClassName("e-range")[0] as HTMLElement).style.height = '6px';

            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 350, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-range")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 619, 148);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);

            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('30');
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('80');
        });

        it('Sliding the slider using range bar with drag interval and limits enabled - v2', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [10, 80],
            tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' },
            limits: {enabled: true, minStart: 0, minEnd: 30, maxStart: 70, maxEnd: 90 } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            (document.getElementsByClassName("e-range")[0] as HTMLElement).style.height = '6px';

            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 350, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-range")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 919, 148);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);

            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('20');
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('90');
        });

        it('Sliding the slider using range bar with drag interval and limits enabled - v3', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [10, 60],
            tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' },
            limits: {enabled: true, minStart: 10, minEnd: 30, maxStart: 60, maxEnd: 90 } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            (document.getElementsByClassName("e-range")[0] as HTMLElement).style.height = '6px';

            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 350, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-range")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 0, 148);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);

            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('10');
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('60');
        });

        it('Sliding the slider using range bar with drag interval and limits enabled - v4', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [10, 60],
            tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' },
            limits: { enabled: true, minStart: 10, minEnd: 30, maxStart: 60, maxEnd: 90, startHandleFixed: true } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            (document.getElementsByClassName("e-range")[0] as HTMLElement).style.height = '6px';

            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 350, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-range")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 0, 148);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);

            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('10');
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('60');
        });

        it('Sliding the slider using range bar with drag interval and limits enabled - v5', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [10, 60],
            tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' },
            limits: { enabled: true, minStart: 10, minEnd: 30, maxStart: 60, maxEnd: 90, endHandleFixed: true } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            (document.getElementsByClassName("e-range")[0] as HTMLElement).style.height = '6px';

            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 350, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-range")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 0, 148);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);

            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('10');
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('60');
        });

        it('Sliding the slider to max value using range bar with drag interval enabled', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [0, 30], tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            (document.getElementsByClassName("e-range")[0] as HTMLElement).style.height = '6px';

            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 350, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-range")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);

            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 819, 148);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);

            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('70');
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('100');
            
            slider.firstTooltipElement = true;
            slider.secondTooltipElement = true;
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 819, 148);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        });

        it('Sliding the slider to minimum value using range bar with drag interval enabled', () => {
            setTheme('material');
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [0, 30], tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');

            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            (document.getElementsByClassName("e-range")[0] as HTMLElement).style.height = '6px';

            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 350, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-range")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);

            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 0, 148);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);

            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('0');
            expect((document.getElementsByClassName('e-handle')[2] as HTMLElement).getAttribute('aria-valuenow')).toBe('30');

            slider.firstTooltipElement.classList.add('e-material-tooltip-open');
            slider.secondTooltipElement.classList.add('e-material-tooltip-open');
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 0, 148);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            slider.value = [0, 30];
            slider.dataBind();

            let args: any = {
                changedTouches: [{ clientX: 350, clientY: 144 }], type: 'touchstart', preventDefault: function () { },
                currentTarget: document.getElementsByClassName("e-range")[0], target: document.getElementsByClassName("e-range")[0]
            };
            slider.sliderDown(args);

            args = {
                changedTouches: [{ clientX: 0, clientY: 148 }], type: 'touchmove', preventDefault: function () { },
                currentTarget: document.getElementsByClassName("e-slider")[0]
            };
            slider.dragRangeBarMove(args);
        });

        it('Sliding the slider using range bar with drag interval and RTL enabled', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [70, 100], enableRtl: true });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            (document.getElementsByClassName("e-range")[0] as HTMLElement).style.height = '6px';

            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 350, 144);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-range")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 519, 148);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);

            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('36');
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('66');

            slider.value = [70, 100];
            slider.dataBind();

            let args: any = {
                changedTouches: [{ clientX: 350, clientY: 144 }], type: 'touchstart', preventDefault: function () { },
                currentTarget: document.getElementsByClassName("e-range")[0], target: document.getElementsByClassName("e-range")[0]
            };
            slider.sliderDown(args);

            args = {
                changedTouches: [{ clientX: 519, clientY: 148 }], type: 'touchmove', preventDefault: function () { },
                currentTarget: document.getElementsByClassName("e-slider")[0]
            };
            slider.dragRangeBarMove(args);
        });

        it('Sliding the slider using range bar with drag interval enabled in vertical slider', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [0, 30], orientation: 'Vertical', tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            (document.getElementsByClassName("e-range")[0] as HTMLElement).style.width = '6px';
            (document.getElementsByClassName("e-slider")[0] as HTMLElement).style.height = '300px';

            slider.handlePos2  = slider.checkHandlePosition(slider.handleVal2);
            slider.setRangeBar();
            let mousedown: any = getEventObject('MouseEvents', 'mousedown');
            mousedown = setMouseCoordinates(mousedown, 300, 200);
            mousedown.target = mousedown.currentTarget = document.getElementsByClassName("e-range")[0];
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
            
            mousemove = getEventObject('MouseEvents', 'mousemove');
            mousemove = setMouseCoordinates(mousemove, 300, 250);
            mousemove.srcElement = mousemove.target = mousemove.toElement = document.getElementsByClassName("e-slider");
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);

            mouseUp = getEventObject('MouseEvents', 'mouseup');
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = document.getElementsByClassName("e-slider")[0];
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);

            expect((document.getElementsByClassName('e-handle')[0] as HTMLElement).getAttribute('aria-valuenow')).toBe('53');
            expect((document.getElementsByClassName('e-handle')[1] as HTMLElement).getAttribute('aria-valuenow')).toBe('83');

            slider.value = [0, 30];
            slider.dataBind();

            let args: any = {
                changedTouches: [{ clientX: 300, clientY: 200 }], type: 'touchstart', preventDefault: function () { },
                currentTarget: document.getElementsByClassName("e-range")[0], target: document.getElementsByClassName("e-range")[0]
            };
            slider.sliderDown(args);
        });

        it('interval dragging property change method testing', () => {
            dragEle = createElement('div', { id: 'slider' });
            targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            targetEle.appendChild(dragEle);
            slider = new Slider({ type: 'Range', value: [0, 30], orientation: 'Vertical', tooltip: { placement: 'After', isVisible: true, showOn: 'Auto' } });
            slider.appendTo('#slider');

            slider.dragInterval = true;
            slider.dataBind();
            slider.dragInterval = false;
            slider.dataBind();
        })
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });

    describe('Slider Ticks Format Testing', () => {
        let slider: any;
        let element: HTMLElement;
        let eventArgs: any;

        it('Ticks in dollar format', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({ value: 0, min: 0, max: 100, ticks: { placement: 'After', format: 'C0' } }, '#slider');
            expect(document.querySelectorAll('.e-tick-value')[0].textContent).toBe('$0');
        });
        it('Ticks dollar format in RTL slider', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({ value: 0, min: 0, max: 100, showButtons: true, enableRtl: true, ticks: { placement: 'Both', format: 'C0' } }, '#slider');
            expect(document.querySelectorAll('.e-tick-value')[0].textContent).toBe('$0');
        });
        it('Ticks in percentage format', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({ value: 0, min: 0, max: 100, ticks: { placement: 'After', format: 'P0' } }, '#slider');
            expect(document.querySelectorAll('.e-tick-value')[0].textContent).toBe('0%');
        });
        it('Ticks in Numeric Format', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({ value: 0, min: 0, max: 100, ticks: { placement: 'After', format: 'N2' } }, '#slider');
            expect(document.querySelectorAll('.e-tick-value')[0].textContent).toBe('0.00');
        });
        it('Ticks with custom formatting - weekdays', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({
                value: 0,
                min: 0,
                max: 6,
                step: 1,
                showButtons: true,
                renderingTicks: function (args: any) {
                    let weekday: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday'];
                    args.text = weekday[parseFloat(args.value)];
                },
                ticks: {
                    placement: 'After',
                    largeStep: 1
                }
            }, '#slider');
            expect(document.querySelectorAll('.e-tick-value')[0].textContent).toBe('Sunday');
        });
        it('Ticks with custom formatting - Time', () => {
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({
                min: new Date(2013, 6, 13, 11).getTime(),
                max: new Date(2013, 6, 13, 17).getTime(),
                step: 3600000,
                renderingTicks: function (args: any) {
                    let totalMiliSeconds = Number(args.value);
                    let custom = { hour: '2-digit', minute: '2-digit' };
                    args.text = new Date(totalMiliSeconds).toLocaleTimeString("en-us", custom);
                },
                ticks: {
                    placement: 'Both',
                    largeStep: 2 * 3600000
                }
            }, '#slider');
            expect(document.querySelectorAll('.e-tick-value')[0].textContent).toBe('11:00 AM');
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
    })
    describe('Localization Testing', () => {
        it('Changing culture into European testing', () => {
            let slider: any;
            let element: HTMLElement;
            L10n.load({
                'de-DE': {
                    'slider': {
                        incrementTitle: 'Erh�hen, ansteigen', decrementTitle: 'verringern'
                    }
                }
            });
            element = createElement('div', { id: 'slider' });
            document.body.appendChild(element);
            slider = new Slider({ value: 10, showButtons: true, locale: 'en-US' }, '#slider');
            slider.locale = 'de-DE';
            slider.dataBind();
            expect(document.getElementsByClassName('e-slider-button')[1].getAttribute('title')).toBe('Erh�hen, ansteigen');
        })
        afterEach(() => {
            document.body.innerHTML = '';
        });
    })
    describe('To achive the coverage ', () => {
        let ele: HTMLElement;
        let slider: any;
        let ele1: HTMLElement
        beforeEach((done: Function) => {
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            slider = new Slider({ value: [10, 20], showButtons: true, type: 'Range', enableRtl: true }, '#slider');
            ele1 = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-second-button'))[0];
            triggerMouseEvent(ele1, 'mouseover');
            setTimeout(() => { done(); }, 500);
        });
        it('click event testing', () => {
            expect((document.querySelector('.e-slider-input') as HTMLInputElement).value).toEqual('10,20');
        });
        it('click event testing', () => {
            slider.round(100);
            slider.step = 2.3;
            slider.round(33);
        });
        it('setEnabled method specific case test', () => {
            slider = new Slider({ value: 10, showButtons: true, type: 'Range', tooltip: { isVisible: true, showOn: 'Always' } }, '#slider');
            slider.firstTooltipObj.open(slider.firstHandle);
            slider.secondTooltipObj.open(slider.secondHandle);
            slider.enabled = false;
            slider.setEnabled();
            expect(document.body.lastElementChild.classList.contains('e-disabled')).toBe(true);
        })
        it('Horizontal Rangebar method specific case test', () => {
            slider = new Slider({ value: 10, showButtons: true, type: 'MinRange', enableRtl: true }, '#slider');
            slider.handlePos1 = undefined;
            slider.setRangeBar();
        })
        it('Vertical Rangebar method specific case test', () => {
            slider = new Slider({ value: 10, showButtons: true, orientation: 'Vertical', type: 'MinRange', enableRtl: true }, '#slider');
            slider.handlePos1 = undefined;
            slider.setRangeBar();
        })
        afterEach(() => {
            document.body.innerHTML = '';
        });
    });
    describe('To achive coverage', () => {
        let timerCallback: any;
        beforeEach(() => {
            jasmine.clock().install();
        });
        it('Changehandlevalue method testing 1', () => {
            let ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            setTheme('material');
            let rangeSlider: any = new Slider({ showButtons: true, type: 'Range', tooltip: { placement: 'Before', isVisible: true, }, orientation: 'Vertical' }, '#slider');
            rangeSlider.openMaterialTooltip();
            jasmine.clock().tick(3000);
            rangeSlider.modifyZindex();
            rangeSlider.activeHandle = 2;
            rangeSlider.modifyZindex();
            rangeSlider.handlePos1 = 2000;
            rangeSlider.changeHandleValue(99);
        });
        it('Changehandlevalue method testing 1', () => {
            let ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            setTheme('material');
            let slider: any = new Slider({ value: 20, tooltip: { placement: 'After', isVisible: true, }, orientation: 'Vertical' }, '#slider');
            slider.openMaterialTooltip();
            jasmine.clock().tick(3000);
            slider.value = 0;
        });
        it('Changehandlevalue method testing 2', () => {
            let ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let rangeSlider: any = new Slider({ showButtons: true, type: 'Range' }, '#slider');
            rangeSlider.activeHandle = 1;
            rangeSlider.handlePos2 = 0;
            rangeSlider.changeHandleValue(99);
        })
        it('positionToValue method testing 2', () => {
            let ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let rangeSlider: any = new Slider({ showButtons: true, orientation: 'Vertical' }, '#slider');
            rangeSlider.positionToValue(99);
        })
        it('StepValueCalculation method testing 2', () => {
            let ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let rangeSlider: any = new Slider({ showButtons: true }, '#slider');
            rangeSlider.step = 0;
            rangeSlider.stepValueCalculation(50);
        })
        it('hover method testing', () => {
            let ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let rangeSlider: any = new Slider({ showButtons: true }, '#slider');
            let event = { type: 'touchmove' };
            rangeSlider.hover(event);
            event = { type: 'mousemove' };
            rangeSlider.hover(event);
            event = { type: 'pointermove' };
            rangeSlider.hover(event);
            event = { type: 'mouseout' };
            rangeSlider.hover(event);
        })
        it('SetIndex Method testing', () => {
            let ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let rangeSlider: any = new Slider({
                showButtons: true,
                ticks: { placement: 'Both', largeStep: 20, smallStep: 5, showSmallTicks: true }
            }, '#slider');
            rangeSlider.isMaterial = false;
            rangeSlider.setZindex();
        })
        afterEach(() => {
            jasmine.clock().uninstall();
            document.body.innerHTML = '';
        });
    })
    describe('Resize Method Testing ', () => {
        it('Resize method testing', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: [10, 20], showButtons: true, type: 'Range', enableRtl: true }, '#slider');
            slider.onResize();
        })
        it('Resize method testing', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: 0, orientation: 'Vertical', showButtons: true, type: 'MinRange', enableRtl: true }, '#slider');
            slider.onResize();
        })
        it('Resize method testing', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: 0, showButtons: true, type: 'MinRange', enableRtl: true }, '#slider');
            slider.onResize();
        })
        it('Resize method testing', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: [10, 20], showButtons: true, type: 'Range' }, '#slider');
            slider.onResize();

        })
        it('Resize method testing', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: [10, 20], showButtons: true, type: 'Range', enableRtl: true, orientation: 'Vertical' }, '#slider');
            slider.value = [10, 25];
            slider.dataBind();
            slider.onResize();
        })
        it('Resize method testing', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ type: 'MinRange' }, '#slider');
            slider.onResize();
        })
        it('Resize method testing', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ type: 'MinRange', orientation: 'Vertical' }, '#slider');
            slider.onResize();
        })
        it('Resize method testing', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ type: 'MinRange', orientation: 'Vertical' }, '#slider');
            slider.handlePos1 = undefined;
            slider.onResize();
        })
        it('Resize method testing', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ type: 'MinRange', orientation: 'Horizontal' }, '#slider');
            slider.handlePos1 = undefined;
            slider.onResize();
        })
        it('Resize method testing with RTL enabled', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ type: 'MinRange', orientation: 'Horizontal', enableRtl: true, tooltip: { isVisible: true } }, '#slider');
            slider.handlePos1 = undefined;
            slider.isMaterial = true;
            slider.dataBind();
            slider.onResize();
        })
        it('Resize method testing with RTL enabled in range', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ type: 'Range', orientation: 'Horizontal', enableRtl: true, tooltip: { isVisible: true } }, '#slider');
            slider.handlePos1 = undefined;
            slider.isMaterial = true;
            slider.dataBind();
            slider.onResize();
        })
        it('Resize method testing with RTL enabled in range with vertical', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ type: 'Range', orientation: 'Vertical', enableRtl: true, tooltip: { isVisible: true } }, '#slider');
            slider.handlePos1 = undefined;
            slider.isMaterial = true;
            slider.dataBind();
            slider.onResize();
        })
        it('Resize method testing with ticks enabled in range', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ type: 'MinRange', orientation: 'Horizontal', ticks: { placement: 'Before' } }, '#slider');
            slider.isMaterial = true;
            slider.dataBind();
            slider.onResize();
        })
        it('Resize method testing with ticks enabled in range with RTL', () => {
            setTheme('material');
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ type: 'Range', orientation: 'Horizontal', enableRtl: true, ticks: { placement: 'Before' },
                tooltip: { isVisible: true } }, '#slider');
            slider.isMaterial = true;
            slider.dataBind();
            slider.onResize();
        })
        it('Resize method testing with ticks and tooltip enabled in range', () => {
            setTheme('material');
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ type: 'Range', orientation: 'Horizontal', enableRtl: false, ticks: { placement: 'Before' },
                tooltip: { isVisible: true } }, '#slider');
            slider.isMaterial = true;
            slider.dataBind();
            slider.onResize();
        })
        it('Resize method testing with ticks enabled in range with RTL in vertical', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ type: 'Range', orientation: 'Vertical', ticks: { placement: 'Before' } }, '#slider');
            slider.isMaterial = true;
            slider.dataBind();
            slider.onResize();
        })
        it('Resize method testing with tooltip enabled in range with RTL in vertical', () => {
            setTheme('material');
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ type: 'Range', orientation: 'Vertical', ticks: { placement: 'Before' },
            tooltip: { isVisible: true } }, '#slider');
            
            slider.dataBind();
            slider.onResize();
            slider.openTooltip();
        })
        it('Resize method testing with limits enabled', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ type: 'MinRange', orientation: 'Horizontal', limits: { enabled: true, minStart: 20, minEnd: 40 } }, '#slider');
            slider.isMaterial = true;
            slider.dataBind();
            slider.onResize();
            slider.firstTooltipElement = undefined;
            slider.getTooltipTransformProperties('');
            slider.handleValueAdjust(60, 100, 3);
        })
        afterEach(() => {
            document.body.innerHTML = '';
        })
    });
    describe('Slider component value property testing', () => {
        it('When min and max are equal for horizontal slider', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ min: 10, max: 10, ticks: { placement: 'Before' } }, '#slider');
            expect(slider.value).toBe(10);
        })
        it('When min and max are equal for verical slider', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ min: 10, max: 10, orientation: 'Vertical', ticks: { placement: 'Before' } }, '#slider');
            expect(slider.value).toBe(10);
        })
        it('When min and max are equal for vertical slider with rtl', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ min: 10, max: 10, orientation: 'Vertical', enableRtl: true, ticks: { placement: 'Before' } }, '#slider');
            expect(slider.value).toBe(10);
        })
        it('When min and max are equal for horizontal slider with rtl', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ min: 10, max: 10, enableRtl: true, ticks: { placement: 'Before' } }, '#slider');
            expect(slider.value).toBe(10);
        })
        it('When min and max are equal for horizontal slider with tick placement(both)', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ min: 10, max: 10, enableRtl: true, ticks: { placement: 'Both' } }, '#slider');
            expect(slider.value).toBe(10);
            slider = new Slider({ min: 10, max: 100, enableRtl: true, ticks: { placement: 'Both', largeStep: -1 } }, '#slider');
        })
        it('When min is greater than max horizontal slider', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: 20, min: 10, max: 100, ticks: { placement: 'Before' } }, '#slider');
            expect(slider.value).toBe(20);
            slider.min = 1000;
        })
        afterEach(() => {
            document.body.innerHTML = '';
        })
    })
    describe('slider component tooltip events', () => {
        beforeEach(() => {
            jasmine.clock().install();
        });

        it('transitionEnd event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: 10, tooltip: { placement: 'Before', isVisible: true, showOn: 'Focus' } }, '#slider');
            let e: any = { propertyName: 'left' };
            slider.transitionEnd(e);
        });
        it('transitionEnd event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            setTheme('material');
            let slider: any = new Slider({ value: [10, 20], type: 'Range', tooltip: { placement: 'Before', isVisible: true, showOn: 'Focus' } }, '#slider');
            slider.activeHandle = 2;
            let e: any = { propertyName: 'left' };
            slider.transitionEnd(e);
        });
        it('TooltipBeforeClose event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            setTheme('material');
            let slider: any = new Slider({ value: [10, 20], type: 'Range', tooltip: { placement: 'Before', isVisible: true, showOn: 'Focus' } }, '#slider');
            slider.firstTooltipObj.open(slider.firstHandle);
            slider.secondTooltipObj.open(slider.secondHandle);
            slider.firstTooltipObj.close();
            slider.secondTooltipObj.close();
        });
        it('handleOver event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: 10, tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' } }, '#slider');
            let arg = { currentTarget: slider.firstHandle };
            slider.handleOver(arg);
        });
        it('handleOver event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: [10, 20], type: 'Range', tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' } }, '#slider');
            let arg = { currentTarget: slider.secondHandle };
            slider.handleOver(arg);
        });
        it('handleLeave event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: 10, tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' } }, '#slider');
            let arg = { currentTarget: slider.firstHandle };
            slider.handleLeave(arg);
        });
        it('handleLeave event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: [10, 20], showButtons: true, type: 'Range', tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' } }, '#slider');
            let arg = { currentTarget: slider.secondHandle };
            slider.showButtons = false;
            slider.handleLeave(arg);
        });

        it('tooltip class', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            setTheme('material');
            let slider: any = new Slider({ value: [10, 20], showButtons: true, type: 'Range', tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' } }, '#slider');
            slider.firstTooltipObj.open(slider.firstHandle);
            slider.tooltipValue();
        });
        it('tooltip class', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            setTheme('material');
            let slider: any = new Slider({ value: 10, showButtons: true, tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' } }, '#slider');
            slider.firstTooltipObj.open(slider.firstHandle);
            slider.tooltipValue();
        });
        it('buttonfocusOut event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            setTheme('material');
            let slider: any = new Slider({ value: 10, showButtons: true }, '#slider');
            slider.buttonFocusOut();
        });
        it('buttonUp event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: 10, showButtons: true, tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' } }, '#slider');
            let arg = { currentTarget: slider.firstBtn };
            slider.buttonUp(arg);
        });
        it('slider focus out event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            setTheme('material');
            let slider: any = new Slider({ type: 'Range', showButtons: true, tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' } }, '#slider');
            let args: any = { relatedTarget: null };
            slider.firstTooltipObj.open(slider.firstHandle);
            slider.secondTooltipObj.open(slider.secondHandle);
            slider.sliderFocusOut(args);
            jasmine.clock().tick(3000);
        });
        it('slider focus out event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            setTheme('fabric');
            let slider: any = new Slider({ type: 'Range', showButtons: true, tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' } }, '#slider');
            let args: any = { relatedTarget: null };
            let keyArgs = { keyCode: 9, target: slider.firstHandle }
            slider.keyUp(keyArgs)
            slider.sliderFocusOut(args);
        });
        it('slider focus out event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            setTheme('material');
            let slider: any = new Slider({ type: 'Range', showButtons: true, orientation: 'Vertical', tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' } }, '#slider');
            let args: any = { relatedTarget: null };
            slider.firstTooltipObj.open(slider.firstHandle);
            slider.secondTooltipObj.open(slider.secondHandle);
            slider.sliderFocusOut(args);
        });
        it('buttonUp event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({
                value: 10, showButtons: true, type: 'Range',
                tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' }
            }, '#slider');
            slider.activeHandle = 2;
            let arg = { currentTarget: slider.secondBtn };
            slider.buttonUp(arg);
        });

        it('mousedown event', () => {
            let ele = createElement('div', { id: 'slider' });
            let targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            setTheme('material');
            targetEle.appendChild(ele);
            let slider: any = new Slider({ type: 'Range', tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' } }, '#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            let mousedown: any = getEventObject('Mouseevents', 'mousedown');
            mousedown.target = slider.firstHandle;
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
        });
        it('mousedown event', () => {
            let ele = createElement('div', { id: 'slider' });
            let targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            setTheme('material');
            targetEle.appendChild(ele);
            let slider: any = new Slider({ type: 'Range', tooltip: { placement: 'Before', isVisible: false, showOn: 'Hover' } }, '#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            let mousedown: any = getEventObject('Mouseevents', 'mousedown');
            mousedown.target = slider.firstHandle;
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
        });
        it('mousedown event', () => {
            let ele = createElement('div', { id: 'slider' });
            let targetEle = createElement('div', {
                id: 'target', styles: 'top: 150px;left: 300px;height: 300px;width: 500px;position: absolute;'
            });
            document.body.appendChild(targetEle);
            setTheme('material');
            targetEle.appendChild(ele);
            let slider: any = new Slider({ type: 'Range', orientation: 'Vertical', tooltip: { placement: 'Before', isVisible: false, showOn: 'Hover' } }, '#slider');
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.height = '2px';
            (document.getElementsByClassName("e-handle")[0] as HTMLElement).style.width = '2px';
            let mousedown: any = getEventObject('Mouseevents', 'mousedown');
            mousedown.target = slider.firstHandle;
            EventHandler.trigger(document.getElementsByClassName("e-slider")[0] as HTMLElement, 'mousedown', mousedown);
        });
        it('handleFocusOut event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: 10, showButtons: true, tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' } }, '#slider');
            slider.firstHandle.classList.add('e-handle-focused');
            slider.handleFocusOut();
        });
        it('handleFocusOut event', () => {
            let ele: HTMLElement;
            ele = createElement('div', { id: 'slider' });
            document.body.appendChild(ele);
            let slider: any = new Slider({ value: [10, 20], type: 'Range', showButtons: true, tooltip: { placement: 'Before', isVisible: true, showOn: 'Hover' } }, '#slider');
            slider.secondHandle.classList.add('e-handle-focused');
            slider.handleFocusOut();
        });
        afterEach(() => {
            jasmine.clock().uninstall();
            document.body.innerHTML = '';
        });
    });

    describe('read only property testing', () => {
        let element: Element;

        describe('initialization', () => {
            beforeAll(() => {
                element = document.createElement('DIV');
                element.id = "slider";
                document.body.appendChild(element);
            });
            it('control initialization', () => {
                let slider: any = new Slider({
                    readonly: true
                }, '#slider');
                expect(slider.sliderContainer.classList.contains('e-read-only')).toBe(true);
            });

            afterAll(() => {
                element.remove();
            });
        });

        describe('button', () => {
            let slider: any;
            beforeAll(() => {
                element = document.createElement('DIV');
                element.id = "slider";
                document.body.appendChild(element);
                slider = new Slider({
                    readonly: true,
                    value: 30,
                    showButtons: true
                }, '#slider');
                let ele1: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-first-button'))[0];
                ele1.click();
            });
            it('button click', () => {
                expect(slider.sliderContainer.classList.contains('e-read-only')).toBe(true);
                expect(slider.value).toBe(30);
            });

            afterAll(() => {
                element.remove();
            });
        });

        describe('onProperty change', () => {
            let slider: any;
            beforeAll(() => {
                element = document.createElement('DIV');
                element.id = "slider";
                document.body.appendChild(element);
                slider = new Slider({
                    value: 30,
                    readonly: true,
                    showButtons: true,
                }, '#slider');
            });
            it('onProperty change method', () => {
                expect(slider.sliderContainer.classList.contains('e-read-only')).toBe(true);
                slider.readonly = false;
                slider.dataBind();
                expect(slider.sliderContainer.classList.contains('e-read-only')).toBe(false);
                slider.readonly = true;
                slider.dataBind();
                expect(slider.sliderContainer.classList.contains('e-read-only')).toBe(true);
            });
            afterAll(() => {
                element.remove();
            });
        });
    });
});