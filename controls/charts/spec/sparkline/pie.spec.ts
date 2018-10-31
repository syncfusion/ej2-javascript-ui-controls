import { Sparkline, SparklineTooltip } from '../../src/sparkline/index';
import { createElement } from '@syncfusion/ej2-base';
import { removeElement, getIdElement } from '../../src/sparkline/utils/helper';
Sparkline.Inject(SparklineTooltip);
/**
 * Sparkline Test case file for pie series
 */

describe('Sparkline Component Pie Series Spec', () => {

    describe('Sparkline testing Pie series spec', () => {
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'spark-container';
        let ele: Element;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '400px';
            (element as HTMLDivElement).style.height = '100px';
            document.body.appendChild(element);
            sparkline = new Sparkline({
                height: '40%',
                width: '20%',
                type: 'Pie',
                dataSource: [-10, 5, -15, 10, 5, 15, -20, 25]
            });
        });
        afterAll(() => {
            sparkline.destroy();
            removeElement(id);
        });
        it('Sparkline pie series checking with array of data', () => {
            sparkline.loaded = () => {
                ele = getIdElement(id + '_sparkline_pie_1');
                expect(ele.getAttribute('opacity')).toBe('1');
                expect(ele.getAttribute('stroke-width')).toBe('0');
                expect(ele.getAttribute('fill')).toBe('#404041');
                d = ele.getAttribute('d').split(' ');
                expect(d.length).toBe(14);
                d = ele.getAttribute('d').split('M');
                expect(d.length).toBe(2);
                d = ele.getAttribute('d').split('L');
                expect(d.length).toBe(2);
            };
            sparkline.appendTo('#' + id);
        });
        it('Sparkline pie series checking with object array of data', () => {
            sparkline.loaded = () => {
                ele = getIdElement(id + '_sparkline_pie_1');
                expect(ele.getAttribute('opacity')).toBe('1');
                expect(ele.getAttribute('stroke-width')).toBe('0');
                expect(ele.getAttribute('fill')).toBe('#404041');
                d = ele.getAttribute('d').split(' ');
                expect(d.length).toBe(14);
                d = ele.getAttribute('d').split('M');
                expect(d.length).toBe(2);
                d = ele.getAttribute('d').split('L');
                expect(d.length).toBe(2);
            };
            sparkline.dataSource = [
                { x: 0, yval: 2900 },
                { x: 1, yval: 3900 },
                { x: 2, yval: 3500 },
                { x: 3, yval: 3800 },
                { x: 4, yval: 2500 },
                { x: 5, yval: 3200 }
            ];
            sparkline.xName = 'x';
            sparkline.yName = 'yval';
            sparkline.refresh();
        });
    });
});
describe('Sparkline testing Pie series spec for height greater than width', () => {
    let element: Element;
    let sparkline: Sparkline;
    let id: string = 'spark-container';
    let ele: Element;
    let d: string[];
    beforeAll(() => {
        element = createElement('div', { id: id });
        (element as HTMLDivElement).style.width = '400px';
        (element as HTMLDivElement).style.height = '500px';
        document.body.appendChild(element);
        sparkline = new Sparkline({
            height: '40%',
            width: '20%',
            type: 'Pie',
            dataSource: [1, 10],
            dataLabelSettings: {
                visible: ['All']
            }
        });
    });
    afterAll(() => {
        sparkline.destroy();
        removeElement(id);
    });
    it('Sparkline pie series checking with array of data', () => {
        sparkline.loaded = () => {
            sparkline.loaded =  () => { /* null function */ };
            ele = getIdElement(id + '_sparkline_pie_1');
            expect(ele.getAttribute('opacity')).toBe('1');
            expect(ele.getAttribute('stroke-width')).toBe('0');
            expect(ele.getAttribute('fill')).toBe('#404041');
            d = ele.getAttribute('d').split(' ');
            expect(d.length).toBe(14);
            d = ele.getAttribute('d').split('M');
            expect(d.length).toBe(2);
            d = ele.getAttribute('d').split('L');
            expect(d.length).toBe(2);
        };
        sparkline.appendTo('#' + id);
        sparkline.refresh();
    });
    it('Sparkline pie series datalabel', () => {
        let ele: Element = getIdElement(id + '_sparkline_label_text_1');
        expect(ele.textContent).toBe('10');
        expect(ele.getAttribute('fill')).toBe('#424242');
        expect(parseInt(ele.getAttribute('x'), 10)).toBe(23);
        expect(parseInt(ele.getAttribute('y'), 10)).toBe(95);
    });
    it('Sparkline pie special points', () => {
        sparkline.startPointColor = 'green';
        sparkline.highPointColor = 'blue';
        sparkline.lowPointColor = 'orange';
        sparkline.endPointColor = 'purple';
        sparkline.negativePointColor = 'red';
        sparkline.dataSource = [1, 10, 5, 7, -6, 2, -4, 8];
        sparkline.dataBind();
        ele = getIdElement(id + '_sparkline_pie_0');
        expect(ele.getAttribute('fill')).toBe('green');
        ele = getIdElement(id + '_sparkline_pie_7');
        expect(ele.getAttribute('aria-label')).toBe('undefined : 8');
        expect(ele.getAttribute('fill')).toBe('purple');
        ele = getIdElement(id + '_sparkline_pie_6');
        expect(ele.getAttribute('fill')).toBe('red');
        ele = getIdElement(id + '_sparkline_pie_4');
        expect(ele.getAttribute('fill')).toBe('orange');
        ele = getIdElement(id + '_sparkline_pie_1');
        expect(ele.getAttribute('fill')).toBe('blue');
    });
});