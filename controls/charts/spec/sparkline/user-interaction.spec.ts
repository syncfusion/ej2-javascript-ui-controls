/**
 * Sparkline Column WinLoss Series Spec
 */
import { Sparkline, ISparklineLoadedEventArgs, SparklineTooltip } from '../../src/sparkline/index';
import { removeElement, getIdElement, Rect } from '../../src/sparkline/utils/helper';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { MouseEvents } from './events.spec';
Sparkline.Inject(SparklineTooltip);
describe('Sparkline tooltip and tracker checking Spec', () => {
    describe('Sparkline tracker Spec', () => {
        let trigger: MouseEvents = new MouseEvents();
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'sparks';
        let ele: Element;
        let rect: Rect;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            document.body.appendChild(element);
            sparkline = new Sparkline({
                width: '400', height: '100',
                type: 'Column',
                fill: '#5af02c',
                dataSource: [
                    { id: 10, value: 50 },
                    { id: 20, value: 30 },
                    { id: 30, value: -40 },
                    { id: 40, value: 10 },
                    { id: 50, value: -60 },
                    { id: 60, value: 20 },
                    { id: 70, value: 70 },
                    { id: 80, value: -55 },
                    { id: 90, value: 80 },
                    { id: 100, value: 45 }
                ], yName: 'value', xName: 'id',
                tooltipSettings: {
                    trackLineSettings: {
                        visible: true,
                        color: 'red', width: 2
                    }
                }
            });
        });
        afterAll(() => {
            sparkline.destroy();
            removeElement(id);
        });
        it('Sparkline tracker line checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_column_1');
                trigger.mousemoveEvent(ele, 0, 0, 30, 30);
                ele = getIdElement(id + '_sparkline_tracker');
                let path: string[] = ele.getAttribute('d').split(' ');
                expect(path[1]).toBe('24.5');
                expect(path[2]).toBe('5');
                expect(path[4]).toBe('24.5');
                expect(path[5]).toBe('95');
                expect(ele.getAttribute('fill')).toBe('transparent');
                expect(ele.getAttribute('stroke')).toBe('red');
                expect(ele.getAttribute('stroke-width')).toBe('2');
            };
            sparkline.appendTo('#' + id);
        });
        it('Sparkline tracker line move to other point checking', () => {
            ele = getIdElement(id);
            trigger.mousemoveEvent(ele, 0, 0, 80, 30);
            ele = getIdElement(id + '_sparkline_tracker');
            let path: string[] = ele.getAttribute('d').split(' ');
            expect(path[1]).toBe('63.5');
            expect(path[2]).toBe('5');
            expect(path[4]).toBe('63.5');
            expect(path[5]).toBe('95');
            expect(ele.getAttribute('fill')).toBe('transparent');
            expect(ele.getAttribute('stroke')).toBe('red');
            expect(ele.getAttribute('stroke-width')).toBe('2');
        });
        it('Sparkline tracker line move to other point checking', () => {
            ele = getIdElement(id);
            trigger.mousemoveEvent(ele, 0, 0, 200, 30);
            ele = getIdElement(id + '_sparkline_tracker');
            let path: string[] = ele.getAttribute('d').split(' ');
            expect(path[1]).toBe('180.5');
            expect(path[2]).toBe('5');
            expect(path[4]).toBe('180.5');
            expect(path[5]).toBe('95');
            expect(ele.getAttribute('fill')).toBe('transparent');
            expect(ele.getAttribute('stroke')).toBe('red');
            expect(ele.getAttribute('stroke-width')).toBe('2');
        });
        it('Sparkline tracker line move out of container checking', () => {
            ele = getIdElement(id);
            trigger.mouseLeaveEvent(ele);
            ele = getIdElement(id + '_sparkline_tracker');
            expect(isNullOrUndefined(ele)).toBe(true);
        });
        it('Sparkline tracker line visible false checking', () => {
            sparkline.tooltipSettings.trackLineSettings.visible = false;
            sparkline.dataBind();
            ele = getIdElement(id);
            trigger.mousemoveEvent(ele, 0, 0, 200, 30);
            ele = getIdElement(id + '_sparkline_tracker');
            expect(isNullOrUndefined(ele)).toBe(true);
            ele = getIdElement(id);
            trigger.mouseLeaveEvent(ele);
            sparkline.sparklineTooltipModule['removeTracker']();
        });
    });
    describe('Sparkline tooltip Spec', () => {
        let trigger: MouseEvents = new MouseEvents();
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'sparks';
        let ele: Element;
        let rect: Rect;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            document.body.appendChild(element);
            sparkline = new Sparkline({
                width: '600', height: '300',
                type: 'Column',
                fill: '#5af02c',
                markerSettings: {
                    visible: ['All']
                },
                dataSource: [
                    { id: 10, value: 50 },
                    { id: 20, value: 30 },
                    { id: 30, value: -40 },
                    { id: 40, value: 10 },
                    { id: 50, value: -60 },
                    { id: 60, value: 20 },
                    { id: 70, value: 70 },
                    { id: 80, value: -55 },
                    { id: 90, value: 80 },
                    { id: 100, value: 45 }
                ], yName: 'value', xName: 'id',
                tooltipSettings: {
                    visible: true,
                    trackLineSettings: {
                        visible: true,
                    }
                }
            });
        });
        afterAll(() => {
            sparkline.destroy();
            removeElement(id);
        });
        it('Sparkline tracker line checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_column_1');
                trigger.mousemoveEvent(ele, 0, 0, 30, 30);
                ele = getIdElement(id + '_sparkline_tooltip_div_text');
                expect(ele.firstChild.textContent).toBe('50');
                expect(ele.lastChild.textContent).toBe('50');
                ele = getIdElement(id + '_sparkline_tracker');
                expect(ele.getAttribute('fill')).toBe('transparent');
                expect(ele.getAttribute('stroke')).toBe('#000000');
                expect(ele.getAttribute('stroke-width')).toBe('1');
            };
            sparkline.appendTo('#' + id);
        });
        it('Sparkline tooltip moving same point checking', () => {
            sparkline.markerSettings.visible = [];
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_column_1');
            trigger.mousemoveEvent(ele, 0, 0, 30, 20);
            ele = getIdElement(id + '_sparkline_tooltip_div_text');
            expect(ele.firstChild.textContent).toBe('50');
            expect(ele.lastChild.textContent).toBe('50');
        });
        it('Sparkline tooltip moving other point checking', () => {
            ele = getIdElement(id + '_sparkline_column_6');
            trigger.mousemoveEvent(ele, 0, 0, 400, 50);
            ele = getIdElement(id + '_sparkline_tooltip_div_text');
            expect(ele.firstChild.textContent).toBe('70');
            expect(ele.lastChild.textContent).toBe('70');
        });
        it('Sparkline tooltip moving negative point checking', () => {
            ele = getIdElement(id + '_sparkline_column_7');
            trigger.mousemoveEvent(ele, 0, 0, 470, 150);
            ele = getIdElement(id + '_sparkline_tooltip_div_text');
            expect(ele.firstChild.textContent).toBe('-55');
            expect(ele.lastChild.textContent).toBe('-55');
            ele = getIdElement(id);
            trigger.mouseLeaveEvent(ele);
            ele = getIdElement(id + '_sparkline_tooltip_div_text');
            expect(isNullOrUndefined(ele)).toBe(true);
        });
        it('Sparkline tooltip moving for pie series checking', () => {
            sparkline.type = 'Pie';
            sparkline.format = 'c0';
            sparkline.useGroupingSeparator = false;
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_pie_4');
            trigger.mousemoveEvent(ele, 0, 0, 400, 150);
            ele = getIdElement(id + '_sparkline_tooltip_div_text');
            expect(ele.firstChild.textContent).toBe('-$60');
            expect(ele.lastChild.textContent).toBe('-$60');
            ele = getIdElement(id + '_sparkline_pie_4');
            trigger.mouseupEvent(ele, 400, 150, 400, 150);
        });
        it('Sparkline tooltip moving for not valid pie point checking', () => {
            ele = getIdElement(id);
            trigger.mousemoveEvent(ele, 0, 0, 400, 150);
            ele = getIdElement(id + '_sparkline_tooltip_div_text');
            expect(isNullOrUndefined(ele)).toBe(true);
        });
        it('Sparkline tooltip format checking', () => {
            sparkline.tooltipSettings.format = '${id} : ${value}$';
            sparkline.format = null;
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_pie_4');
            trigger.mousemoveEvent(ele, 0, 0, 400, 150);
            ele = getIdElement(id + '_sparkline_tooltip_div_text');
            expect(ele.firstChild.textContent).toBe('50 : -60$');
            expect(ele.lastChild.textContent).toBe('50 : -60$');
        });
        it('Sparkline tooltip template checking', () => {
            sparkline.tooltipSettings.template = '<div style="border: 2px solid green;background: #a0e99680">${id}<br>${value}$</div>';
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_pie_4');
            sparkline.isTouch = true;
            sparkline.mouseX = 400;
            sparkline.mouseY = 150;
            sparkline.sparklineTooltipModule['mouseUpHandler']({ target: ele} as any);
            ele = getIdElement(id + '_sparkline_tooltip_divparent_template');
            expect(ele.textContent).toBe('50-60$');
            ele = getIdElement(id + '_sparkline_tooltip_div');
            expect(ele.children[0].innerHTML.indexOf('<div style="border: 2px solid green;background: #a0e99680">50<br>-60$</div>') > -1).toBe(true);
        });
    });
});