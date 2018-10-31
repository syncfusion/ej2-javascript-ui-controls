import { Sparkline, SparklineTooltip } from '../../src/sparkline/index';
import { createElement } from '@syncfusion/ej2-base';
import { removeElement, getIdElement, TextOption } from '../../src/sparkline/utils/helper';
import { ISparklineLoadedEventArgs, ISparklineResizeEventArgs } from '../../src/sparkline/model/interface';
Sparkline.Inject(SparklineTooltip);
/**
 * Sparkline Test case file
 */

describe('Sparkline Component Base Spec', () => {

    describe('Sparkline testing spec', () => {
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
                containerArea: {
                    background: 'green',
                    border: { color: 'yellow', width: 3},
                },
                tooltipSettings: { visible: true }
            });
        });
        afterAll(() => {
            sparkline.destroy();
            sparkline.sparklineResize(null);
            removeElement(id);
        });
        it('Sparkline height and width percentage checking', () => {
            sparkline.loaded = () => {
                ele = getIdElement(id + '_SparklineBorder');
                d = ele.getAttribute('d').split(' ');
                let x: number = Number(d[1]);
                let y: number = Number(d[2]);
                let width: number = Number(d[9]) - x;
                let height: number = Number(d[18]) - y;
                expect(x).toBe(1.5);
                expect(y).toBe(1.5);
                expect(width).toBe(77);
                expect(height).toBe(37);
                removeElement('nothing');
            };
            sparkline.appendTo('#' + id);
        });
        it('Sparkline background and border checking', () => {
            let fill: string = ele.getAttribute('fill');
            expect(fill).toBe('green');
            let stroke: string = ele.getAttribute('stroke');
            expect(stroke).toBe('yellow');
            let strwid: string = ele.getAttribute('stroke-width');
            expect(strwid).toBe('3');
        });
        it('Sparkline height and width pixel checking', () => {
            sparkline.loaded = () => {
                ele = getIdElement(id + '_SparklineBorder');
                d = ele.getAttribute('d').split(' ');
                let x: number = Number(d[1]);
                let y: number = Number(d[2]);
                let width: number = Number(d[9]) - x;
                let height: number = Number(d[18]) - y;
                expect(x).toBe(1.5);
                expect(y).toBe(1.5);
                expect(width).toBe(117);
                expect(height).toBe(57);
            };
            sparkline.height = '60px';
            sparkline.width = '120px';
            sparkline.refresh();
        });
        it('Sparkline height and width default checking', () => {
            sparkline.loaded = () => {
                ele = getIdElement(id + '_SparklineBorder');
                d = ele.getAttribute('d').split(' ');
                let x: number = Number(d[1]);
                let y: number = Number(d[2]);
                let width: number = Number(d[9]) - x;
                let height: number = Number(d[18]) - y;
                expect(x).toBe(1.5);
                expect(y).toBe(1.5);
                expect(width).toBe(397);
                expect(height).toBe(97);
            };
            sparkline.height = null;
            sparkline.width = null;
            sparkline.refresh();
        });
        it('Sparkline tooltip module checking', () => {
            sparkline.sparklineRenderer.processData();
            expect(sparkline.sparklineTooltipModule).not.toBe(null);
            expect(sparkline.sparklineTooltipModule).not.toBe(undefined);
        });
    });
    describe('Sparkline other scenario spec', () => {
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
                containerArea: {
                    background: 'blue',
                    border: { color: 'orange', width: 1},
                },
                dataSource: [
                    {xDate: new Date(2017, 1, 1), yval: 2900 },
                    {xDate: new Date(2017, 1, 2), yval: 3900 },
                    {xDate: new Date(2017, 1, 3), yval: 3500 },
                    {xDate: new Date(2017, 1, 4), yval: 3800 },
                    {xDate: new Date(2017, 1, 5), yval: 2500 },
                    {xDate: new Date(2017, 1, 6), yval: 3200 }
                ], yName: 'yval',
            });
        });
        afterAll(() => {
            sparkline.destroy();
            removeElement(id);
        });
        it('Sparkline height and width parent size checking', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                ele = getIdElement(id + '_SparklineBorder');
                d = ele.getAttribute('d').split(' ');
                let x: number = Number(d[1]);
                let y: number = Number(d[2]);
                let width: number = Number(d[9]) - x;
                let height: number = Number(d[18]) - y;
                expect(x).toBe(0.5);
                expect(y).toBe(0.5);
                expect(width).toBe(399);
                expect(height).toBe(99);
                args.sparkline.loaded = null;
            };
            sparkline.appendTo('#' + id);
            sparkline.getPersistData();
        });
        it('Sparkline value type Category and series type Pie coverage', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = null;
                expect(args.sparkline.valueType).toBe('Category');
                expect(args.sparkline.type).toBe('Pie');
            };
            sparkline.valueType = 'Category';
            sparkline.type = 'Pie';
            sparkline.refresh();
        });
        it('Sparkline value type DateTime and series type WinLoss coverage', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = null;
                expect(args.sparkline.valueType).toBe('DateTime');
                expect(args.sparkline.type).toBe('WinLoss');
            };
            sparkline.valueType = 'DateTime';
            sparkline.type = 'WinLoss';
            sparkline.xName = 'xDate';
            sparkline.refresh();
        });
        it('Sparkline value type Numeric and series type Pie coverage array data', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = null;
                expect(args.sparkline.valueType).toBe('Numeric');
                expect(args.sparkline.type).toBe('Pie');
            };
            sparkline.valueType = 'Numeric';
            sparkline.type = 'Pie';
            sparkline.dataSource = [5, 6, 7, 8, 3];
            sparkline.refresh();
        });
        it('Sparkline value type Numeric and series type Column coverage array data', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = null;
                expect(args.sparkline.valueType).toBe('Numeric');
                expect(args.sparkline.type).toBe('Column');
            };
            sparkline.valueType = 'Numeric';
            sparkline.type = 'Column';
            sparkline.dataSource = [1, 0, 1, -1, 0, -1, 1];
            sparkline.refresh();
        });
        it('Sparkline single array data', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = null;
                expect(args.sparkline.valueType).toBe('Numeric');
                expect(args.sparkline.type).toBe('Column');
            };
            sparkline.dataSource = [5];
            sparkline.refresh();
        });
        it('Sparkline Column array minus data', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = null;
                expect(args.sparkline.valueType).toBe('Numeric');
                expect(args.sparkline.type).toBe('Column');
            };
            sparkline.dataSource = [-5, -4, -7, -9];
            sparkline.refresh();
        });
        it('Sparkline WinLoss array minus data', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = null;
                expect(args.sparkline.valueType).toBe('Numeric');
                expect(args.sparkline.type).toBe('WinLoss');
            };
            sparkline.type = 'WinLoss';
            sparkline.refresh();
        });
        it('Sparkline WinLoss array tristate data', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = null;
                expect(args.sparkline.valueType).toBe('Numeric');
                expect(args.sparkline.type).toBe('WinLoss');
            };
            sparkline.dataSource = [-5, -4, 0, 7, -9];
            sparkline.refresh();
        });
        it('Sparkline Line with single data', () => {
            sparkline.loaded = (args: ISparklineLoadedEventArgs) => {
                args.sparkline.loaded = null;
                expect(args.sparkline.valueType).toBe('Numeric');
                expect(args.sparkline.type).toBe('Line');
                new TextOption('sdad', 0, 0, 'middle', 'coverage', 'middle', 'translate(90, 0)');
            };
            sparkline.dataSource = [5];
            sparkline.type = 'Line';
            sparkline.refresh();
        });
        it('Sparkline resize event checking', (done: Function) => {
            sparkline.sparklineResize(null);
            sparkline.resize = (args: ISparklineResizeEventArgs) => {
                expect(args.name).toBe('resize');
                sparkline.resize = null;
                done();
            };
            sparkline.sparklineResize(null);
        });
    });
});