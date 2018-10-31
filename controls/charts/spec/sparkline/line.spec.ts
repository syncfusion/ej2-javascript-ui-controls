import { Sparkline, SparklineTooltip } from '../../src/sparkline/index';
import { createElement } from '@syncfusion/ej2-base';
import { removeElement, getIdElement } from '../../src/sparkline/utils/helper';
import { ISparklineLoadedEventArgs } from '../../src/sparkline/model/interface';
Sparkline.Inject(SparklineTooltip);
/**
 * Sparkline Test case file
 */

describe('Sparkline Component Line Series Spec', () => {

    describe('Sparkline testing Line series spec', () => {
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
                dataSource: [-10, 5, -15, 10, 5, 15, -20, 25]
            });
        });
        afterAll(() => {
            sparkline.destroy();
            removeElement(id);
        });
        it('Sparkline line series checking with array of data', () => {
            sparkline.loaded = () => {
                ele = getIdElement(id + '_sparkline_line');
                expect(ele.getAttribute('opacity')).toBe('1');
                expect(ele.getAttribute('stroke')).toBe('#00bdae');
                expect(ele.getAttribute('stroke-width')).toBe('1');
                expect(ele.getAttribute('fill')).toBe('transparent');
                d = ele.getAttribute('d').split(' ');
                expect(d.length).toBe(28);
                d = ele.getAttribute('d').split('M');
                expect(d.length).toBe(2);
                d = ele.getAttribute('d').split('L');
                expect(d.length).toBe(9);
            };
            sparkline.appendTo('#' + id);
        });
        it('Sparkline line series checking with object array of data', () => {
            sparkline.loaded = () => {
                ele = getIdElement(id + '_sparkline_line');
                expect(ele.getAttribute('opacity')).toBe('1');
                expect(ele.getAttribute('stroke')).toBe('#00bdae');
                expect(ele.getAttribute('stroke-width')).toBe('1');
                expect(ele.getAttribute('fill')).toBe('transparent');
                d = ele.getAttribute('d').split(' ');
                expect(d.length).toBe(22);
                d = ele.getAttribute('d').split('M');
                expect(d.length).toBe(2);
                d = ele.getAttribute('d').split('L');
                expect(d.length).toBe(7);
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
        it('Sparkline range band checking spec', () => {
            sparkline.loaded = () => {
                ele = getIdElement(id + '_rangeBand_1');
                expect(ele.getAttribute('opacity')).toBe('0.5');
                expect(ele.getAttribute('stroke')).toBe('transparent');
                expect(ele.getAttribute('stroke-width')).toBe('1');
                expect(ele.getAttribute('fill')).toBe('blue');
                d = ele.getAttribute('d').split(' ');
                expect(d.length).toBe(14);
                d = ele.getAttribute('d').split('M');
                expect(d.length).toBe(2);
                d = ele.getAttribute('d').split('L');
                expect(d.length).toBe(4);
            };
            sparkline.rangeBandSettings = [
                { startRange: 1500, endRange: 6000, color: 'gray', opacity: 1 },
                { startRange: 500, endRange: 1500, color: 'blue', opacity: 0.5 },
                { startRange: 1500, endRange: 3500, color: 'red', opacity: 1 },
                { startRange: 4000, endRange: 6000, color: 'blue', opacity: 2 },
            ];
            sparkline.refresh();
        });
        it('Sparkline line series checking with axis settings', () => {
            sparkline.loaded = () => {
                ele = getIdElement(id + '_Sparkline_XAxis');
                expect(ele.getAttribute('x1')).toBe('5');
                expect(ele.getAttribute('y1')).toBe('35');
                expect(ele.getAttribute('x2')).toBe('75');
                expect(ele.getAttribute('y2')).toBe('35');
                expect(ele.getAttribute('stroke')).toBe('#000000');
                expect(ele.getAttribute('stroke-width')).toBe('1');
            };
            sparkline.axisSettings = {
                minX: 1, maxX: 4, minY: 2800, maxY: 3800,
                lineSettings: { visible: true}
            };
            sparkline.refresh();
        });
        it('Sparkline axis custom value and line customization', () => {
            sparkline.loaded = () => {
                ele = getIdElement(id + '_Sparkline_XAxis');
                expect(ele.getAttribute('x1')).toBe('5');
                expect(ele.getAttribute('y1')).toBe('20');
                expect(ele.getAttribute('x2')).toBe('75');
                expect(ele.getAttribute('y2')).toBe('20');
                expect(ele.getAttribute('stroke')).toBe('#9900cc');
                expect(ele.getAttribute('stroke-width')).toBe('3');
            };
            sparkline.axisSettings = {
                value: 3300,
                lineSettings: { visible: true, color: '#9900cc', width: 3}
            };
            sparkline.refresh();
        });
        it('Sparkline line with negative values', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_sparkline_line');
                d = ele.getAttribute('d').split(' ');
                expect(d.length).toBe(31);
                d = ele.getAttribute('d').split('M');
                expect(d.length).toBe(2);
                d = ele.getAttribute('d').split('L');
                expect(d.length).toBe(10);
            };
            sparkline.axisSettings = {minY: -9, maxY: -1, value: -5, minX: 0, maxX: 8};
            sparkline.dataSource = [-3, -8, -5, -1, -7, -4, -9, -2, -6];
            sparkline.refresh();
        });
        it('Sparkline line with category axis', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_sparkline_line');
                d = ele.getAttribute('d').split(' ');
                expect(d.length).toBe(28);
                d = ele.getAttribute('d').split('M');
                expect(d.length).toBe(2);
                d = ele.getAttribute('d').split('L');
                expect(d.length).toBe(9);
            };
            sparkline.axisSettings = {minY: 3000, maxY: 5500, value: -5, minX: 0, maxX: 8};
            sparkline.dataSource = [
                {xDate: new Date(2017, 1, 1), x: 0, xval: 'Jan', yval: 2900 },
                {xDate: new Date(2017, 1, 2), x: 1, xval: 'Feb', yval: 3900 },
                {xDate: new Date(2017, 1, 3), x: 2, xval: 'Mar', yval: 3500 },
                {xDate: new Date(2017, 1, 4), x: 3, xval: 'Apr', yval: 3800 },
                {xDate: new Date(2017, 1, 5), x: 4, xval: 'May', yval: 2500 },
                {xDate: new Date(2017, 1, 6), x: 5, xval: 'Jun', yval: 3200 },
                {xDate: new Date(2017, 1, 7), x: 6, xval: 'Jul', yval: 1800 },
                {xDate: new Date(2017, 1, 8), x: 7, xval: 'Aug', yval: 5000 },
            ];
            sparkline.refresh();
        });
        it('Sparkline line with datetime axis', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_sparkline_line');
                d = ele.getAttribute('d').split(' ');
                expect(d.length).toBe(28);
                d = ele.getAttribute('d').split('M');
                expect(d.length).toBe(2);
                d = ele.getAttribute('d').split('L');
                expect(d.length).toBe(9);
            };
            sparkline.axisSettings = { minX: new Date(2017, 1, 1).getTime(), maxX: new Date(2017, 1, 8).getTime()};
            sparkline.dataSource = [
                {xDate: new Date(2017, 1, 1), x: 0, xval: 'Jan', yval: 2900 },
                {xDate: new Date(2017, 1, 2), x: 1, xval: 'Feb', yval: 3900 },
                {xDate: new Date(2017, 1, 3), x: 2, xval: 'Mar', yval: 3500 },
                {xDate: new Date(2017, 1, 4), x: 3, xval: 'Apr', yval: 3800 },
                {xDate: new Date(2017, 1, 5), x: 4, xval: 'May', yval: 2500 },
                {xDate: new Date(2017, 1, 6), x: 5, xval: 'Jun', yval: 3200 },
                {xDate: new Date(2017, 1, 7), x: 6, xval: 'Jul', yval: 1800 },
                {xDate: new Date(2017, 1, 8), x: 7, xval: 'Aug', yval: 5000 },
            ];
            sparkline.xName = 'xDate';
            sparkline.refresh();
        });
    });
});