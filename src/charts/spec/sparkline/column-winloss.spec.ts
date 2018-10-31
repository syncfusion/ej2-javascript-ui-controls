/**
 * Sparkline Column WinLoss Series Spec
 */
import { Sparkline, ISparklineLoadedEventArgs } from '../../src/sparkline/index';
import { removeElement, getIdElement, Rect, RectOption } from '../../src/sparkline/utils/helper';
import { createElement } from '@syncfusion/ej2-base';
import { Label, getLabelOptions} from './datalabel.spec';
export let getRect: Function = (ele: Element): Rect => {
    let d: string[] = ele.getAttribute('d').split(' ');
    let x: number = parseInt(d[1], 10);
    let y: number = parseInt(d[2], 10);
    let width: number = parseInt(d[9], 10) - x;
    let height: number = parseInt(d[18], 10) - y;
    return new Rect(x, y, width, height);
};
describe('Sparkline Column and WinLoss series spec', () => {
    describe('Sparkline Column Series Spec', () => {
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'sparks';
        let ele: Element;
        let rect: Rect;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '400px';
            (element as HTMLDivElement).style.height = '100px';
            document.body.appendChild(element);
            sparkline = new Sparkline({
                width: '400', height: '100',
                type: 'Column',
                fill: '#0ffa847c',
                border: { color: '#0cfd84', width: 1 },
                containerArea: {
                    border: {
                        color: '#a9fd0c', width: 1
                    },
                },
                dataSource: [
                    { id: 10, value: 6346152600 },
                    { id: 20, value: 7427152600 },
                    { id: 30, value: 4314152600 },
                    { id: 40, value: 9493152600 },
                    { id: 50, value: 5787152600 },
                    { id: 60, value: 7492152600 },
                    { id: 70, value: 4323152600 },
                    { id: 80, value: 8745152600 },
                    { id: 90, value: 1098152600 },
                    { id: 100, value: 3876152600 }
                ], yName: 'value', xName: 'id'
            });
        });
        afterAll(() => {
            sparkline.destroy();
            removeElement(id);
        });
        it('Sparkline Column path and border path checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_column_1');
                rect = getRect(ele);
                expect(ele.getAttribute('fill')).toBe('#0ffa847c');
                expect(ele.getAttribute('stroke')).toBe('#0cfd84');
                expect(ele.getAttribute('stroke-width')).toBe('1');
                expect(rect.x).toBe(44);
                expect(rect.y).toBe(27);
                expect(rect.height).toBe(68);
                expect(rect.width).toBe(38);
            };
            sparkline.appendTo('#' + id);
        });
        it('Sparkline Column x and y value first point checking', () => {
            ele = getIdElement(id + '_sparkline_column_0');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#0ffa847c');
            expect(ele.getAttribute('stroke')).toBe('#0cfd84');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(5);
            expect(rect.y).toBe(38);
            expect(rect.height).toBe(57);
            expect(rect.width).toBe(38);
        });
        it('Sparkline Column x and y value last point checking', () => {
            ele = getIdElement(id + '_sparkline_column_9');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#0ffa847c');
            expect(ele.getAttribute('stroke')).toBe('#0cfd84');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(356);
            expect(rect.y).toBe(65);
            expect(rect.height).toBe(30);
            expect(rect.width).toBe(38);
        });
        it('Sparkline Column x and y value random point checking', () => {
            ele = getIdElement(id + '_sparkline_column_8');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#0ffa847c');
            expect(ele.getAttribute('stroke')).toBe('#0cfd84');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(317);
            expect(rect.y).toBe(89);
            expect(rect.height).toBe(6);
            expect(rect.width).toBe(38);
        });
        it('Sparkline Column x and y value checking after axis value', () => {
            sparkline.axisSettings.value = 1098152600;
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_column_8');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#0ffa847c');
            expect(ele.getAttribute('stroke')).toBe('#0cfd84');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(317);
            expect(rect.y).toBe(95);
            expect(rect.height).toBe(0);
            expect(rect.width).toBe(38);
        });
        it('Sparkline Column x and y value checking after axis value is 0 and minus values', () => {
            sparkline.axisSettings.value = 0;
            sparkline.dataSource[2]['value'] *= -1;
            sparkline.dataSource[4]['value'] *= -1;
            sparkline.dataSource[6]['value'] *= -1;
            sparkline.dataSource[8]['value'] *= -1;
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_column_8');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#0ffa847c');
            expect(ele.getAttribute('stroke')).toBe('#0cfd84');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(317);
            expect(rect.y).toBe(61);
            expect(rect.height).toBe(6);
            expect(rect.width).toBe(38);
        });
        it('Sparkline Column minus values and axis value 0 checking low point', () => {
            ele = getIdElement(id + '_sparkline_column_4');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#0ffa847c');
            expect(ele.getAttribute('stroke')).toBe('#0cfd84');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(161);
            expect(rect.y).toBe(61);
            expect(rect.height).toBe(34);
            expect(rect.width).toBe(38);
        });
        it('Sparkline Column minus values and axis value 0 checking high point', () => {
            ele = getIdElement(id + '_sparkline_column_3');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#0ffa847c');
            expect(ele.getAttribute('stroke')).toBe('#0cfd84');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(122);
            expect(rect.y).toBe(5);
            expect(rect.height).toBe(56);
            expect(rect.width).toBe(38);
        });
        it('Sparkline Column web accessibility checking', () => {
            ele = getIdElement(id + '_sparkline_column_3');
            expect(ele.getAttribute('aria-label')).toBe('40 : 9493152600');
        });
        it('Sparkline column datalabel', () => {
            sparkline.dataLabelSettings.visible = ['All'];
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_label_text_8');
            let options: Label = getLabelOptions(ele);
            expect(options.text).toBe('-1098152600');
            expect(options.x).toBe(336);
            // first test case local and second for server value
            expect(options.y === 77 || options.y === 76).toBe(true);
        });
    });
    describe('Sparkline WinLoss Series Spec', () => {
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'sparks';
        let ele: Element;
        let rect: Rect;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '400px';
            (element as HTMLDivElement).style.height = '100px';
            document.body.appendChild(element);
            sparkline = new Sparkline({
                width: '400', height: '100',
                type: 'WinLoss',
                fill: '#0ffa847c',
                border: { width: 1 },
                containerArea: {
                    border: {
                        color: '#a9fd0c', width: 1
                    },
                },
                axisSettings: {
                    value: 5787152600
                },
                dataSource: [
                    { id: 10, value: 6346152600 },
                    { id: 20, value: 7427152600 },
                    { id: 30, value: 4314152600 },
                    { id: 40, value: 9493152600 },
                    { id: 50, value: 5787152600 },
                    { id: 60, value: 7492152600 },
                    { id: 70, value: 4323152600 },
                    { id: 80, value: 8745152600 },
                    { id: 90, value: 1098152600 },
                    { id: 100, value: 3876152600 }
                ], yName: 'value', xName: 'id'
            });
        });
        afterAll(() => {
            sparkline.destroy();
            removeElement(id);
        });
        it('Sparkline WinLoss path and border path checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_winloss_1');
                rect = getRect(ele);
                expect(ele.getAttribute('fill')).toBe('#0ffa847c');
                expect(ele.getAttribute('stroke')).toBe('#0ffa847c');
                expect(ele.getAttribute('stroke-width')).toBe('1');
                expect(rect.x).toBe(44);
                expect(rect.y).toBe(27);
                expect(rect.height).toBe(23);
                expect(rect.width).toBe(38);
            };
            sparkline.appendTo('#' + id);
        });
        it('Sparkline WinLoss x and y value negative point border checking', () => {
            ele = getIdElement(id + '_sparkline_winloss_2');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#e20f07');
            expect(ele.getAttribute('stroke')).toBe('#e20f07');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(83);
            expect(rect.y).toBe(50);
            expect(rect.height).toBe(22);
            expect(rect.width).toBe(38);
        });
        it('Sparkline WinLoss x and y value tie point border checking', () => {
            ele = getIdElement(id + '_sparkline_winloss_4');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#a216f3');
            expect(ele.getAttribute('stroke')).toBe('#a216f3');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(161);
            expect(rect.y).toBe(47);
            expect(rect.height).toBe(5);
            expect(rect.width).toBe(38);
        });
        it('Sparkline WinLoss x and y value all positive points checking with previous tie point', () => {
            sparkline.axisSettings.value = null;
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_winloss_4');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#0ffa847c');
            expect(ele.getAttribute('stroke')).toBe('#0ffa847c');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(161);
            expect(rect.y).toBe(27);
            expect(rect.height).toBe(23);
            expect(rect.width).toBe(38);
        });
        it('Sparkline WinLoss x and y value all positive points checking with previous negative point', () => {
            ele = getIdElement(id + '_sparkline_winloss_2');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#0ffa847c');
            expect(ele.getAttribute('stroke')).toBe('#0ffa847c');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(83);
            expect(rect.y).toBe(27);
            expect(rect.height).toBe(23);
            expect(rect.width).toBe(38);
        });
        it('Sparkline WinLoss x and y value all negative points checking with previous positive point', () => {
            sparkline.axisSettings.value = 94931526000;
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_winloss_7');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#e20f07');
            expect(ele.getAttribute('stroke')).toBe('#e20f07');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(278);
            expect(rect.y).toBe(50);
            expect(rect.height).toBe(22);
            expect(rect.width).toBe(38);
        });
        it('Sparkline WinLoss points border customization checking', () => {
            sparkline.border = { color: '#33CCFF', width: 2 };
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_winloss_3');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#e20f07');
            expect(ele.getAttribute('stroke')).toBe('#33CCFF');
            expect(ele.getAttribute('stroke-width')).toBe('2');
            expect(rect.x).toBe(122);
            expect(rect.y).toBe(50);
            expect(rect.height).toBe(22);
            expect(rect.width).toBe(38);
        });
        it('Sparkline Winloss web accessibility checking', () => {
            ele = getIdElement(id + '_sparkline_winloss_3');
            expect(ele.getAttribute('aria-label')).toBe('40 : 9493152600');
        });
        it('Sparkline WinLoss array of data checking without border', () => {
            sparkline.dataSource = [1, -1, 1, 1, 0, -1, -1, 0, -1, 1];
            sparkline.border = { color: '#33CCFF', width: 2 };
            sparkline.axisSettings.value = 0;
            sparkline.dataBind();
            ele = getIdElement(id + '_sparkline_winloss_1');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#e20f07');
            expect(ele.getAttribute('stroke')).toBe('#33CCFF');
            expect(ele.getAttribute('stroke-width')).toBe('2');
            expect(rect.x).toBe(44);
            expect(rect.y).toBe(50);
            expect(rect.height).toBe(22);
            expect(rect.width).toBe(38);
        });
        it('Sparkline WinLoss array of data checking without border', () => {
            ele = getIdElement(id + '_sparkline_winloss_9');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('#0ffa847c');
            expect(ele.getAttribute('stroke')).toBe('#33CCFF');
            expect(ele.getAttribute('stroke-width')).toBe('2');
            expect(rect.x).toBe(356);
            expect(rect.y).toBe(27);
            expect(rect.height).toBe(23);
            expect(rect.width).toBe(38);
        });
    });
    describe('Sparkline Column Series Special points Spec', () => {
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'sparks';
        let ele: Element;
        let rect: Rect;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '400px';
            (element as HTMLDivElement).style.height = '100px';
            document.body.appendChild(element);
            sparkline = new Sparkline({
                width: '400', height: '100',
                type: 'Column',
                fill: '#5af02c',
                border: { width: 1 },
                startPointColor: 'green',
                highPointColor: 'blue',
                lowPointColor: 'orange',
                endPointColor: 'purple',
                negativePointColor: 'red',
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
                ], yName: 'value', xName: 'id'
            });
        });
        afterAll(() => {
            sparkline.destroy();
            removeElement(id);
        });
        it('Sparkline Column with non-special point customization checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = () => { /* null function */ };
                ele = getIdElement(id + '_sparkline_column_1');
                rect = getRect(ele);
                expect(ele.getAttribute('fill')).toBe('#5af02c');
                expect(ele.getAttribute('stroke-width')).toBe('1');
                expect(rect.x).toBe(44);
                expect(rect.y).toBe(37);
                expect(rect.height).toBe(19);
                expect(rect.width).toBe(38);
            };
            sparkline.appendTo('#' + id);
        });
        it('Sparkline Column Special point Start Color checking', () => {
            ele = getIdElement(id + '_sparkline_column_0');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('green');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(5);
            expect(rect.y).toBe(24);
            expect(rect.height).toBe(32);
            expect(rect.width).toBe(38);
        });
        it('Sparkline Column Special point End Color checking', () => {
            ele = getIdElement(id + '_sparkline_column_9');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('purple');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(356);
            expect(rect.y).toBe(27);
            expect(rect.height).toBe(29);
            expect(rect.width).toBe(38);
        });
        it('Sparkline Column Special point High Color checking', () => {
            ele = getIdElement(id + '_sparkline_column_8');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('blue');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(317);
            expect(rect.y).toBe(5);
            expect(rect.height).toBe(51);
            expect(rect.width).toBe(38);
        });
        it('Sparkline Column Special point Low Color checking', () => {
            ele = getIdElement(id + '_sparkline_column_4');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('orange');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(161);
            expect(rect.y).toBe(56);
            expect(rect.height).toBe(39);
            expect(rect.width).toBe(38);
        });
        it('Sparkline Column Special point Negative Color checking', () => {
            ele = getIdElement(id + '_sparkline_column_2');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('red');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(83);
            expect(rect.y).toBe(56);
            expect(rect.height).toBe(26);
            expect(rect.width).toBe(38);
            ele = getIdElement(id + '_sparkline_column_7');
            rect = getRect(ele);
            expect(ele.getAttribute('fill')).toBe('red');
            expect(ele.getAttribute('stroke-width')).toBe('1');
            expect(rect.x).toBe(278);
            expect(rect.y).toBe(56);
            expect(rect.height).toBe(35);
            expect(rect.width).toBe(38);
            new RectOption('dasda', 'red', {color: 'blue', width: 2}, 1, new Rect(0, 0, 10, 20), 5, 5, 5, 5);
        });
    });
});