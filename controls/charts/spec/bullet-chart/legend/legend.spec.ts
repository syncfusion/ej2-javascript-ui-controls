import { BulletChart, IBulletLoadedEventArgs, RangeModel, BulletChartLegend } from '../../../src/bullet-chart/index';
import { createElement, EmitType } from '@syncfusion/ej2-base';
import { MouseEvents } from '../../chart/base/events.spec';
import { ObjectStatus } from '@syncfusion/ej2-pdf-export';
BulletChart.Inject(BulletChartLegend);
/**
 * Spec for Bulletchart scale, feature and comparative bar
 */

let multipleData: Object[] = [
    {
        value: 9.5, comparativeMeasureValue: 7.5,
        category: '2001'
    },
    {
        value: 9.5, comparativeMeasureValue: 5,
        category: '2002'
    },
    {
        value: 9.5, comparativeMeasureValue: 6,
        category: '2003'
    },
    {
        value: 9.5, comparativeMeasureValue: 8,
        category: '2004'
    },
    {
        value: 9.5, comparativeMeasureValue: 5,
        category: '2005'
    },
    {
        value: 9.5, comparativeMeasureValue: 6,
        category: '2006'
    }
];

let multiTarget: Object[] = [{ value: 7, target: [8, 12, 15, 16] }];

let rangeCollection: RangeModel[] = [{ end: 5.2, opacity: 1, color: 'skyblue', name: 'Poor' },
{ end: 7.3, opacity: 1, color: 'lawngreen', name: 'AVG ' },
{ end: 20, opacity: 1, color: 'red', name: 'Good ' }
];

describe('Bullet Chart Scale', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('with default rendering', () => {
        let bullet: BulletChart;
        let legendElement: Element;
        let range1: Element;
        let range2: Element;
        let range3: Element;
        let value: number;
        let count: number = 0;
        let loaded: EmitType<IBulletLoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        let bulletElement: Element = createElement('div', { id: 'container' });
        let legendId: string = bulletElement.id + '_chart_legend';
        beforeAll(() => {
            document.body.appendChild(bulletElement);
            bullet = new BulletChart({
                dataSource: [{ value: 7, target: 8 }],
                ranges: [{ end: 5.2, opacity: 1, color: 'skyblue', name: 'Poor' },
                { end: 7.3, opacity: 1, color: 'lawngreen', name: 'AVG ' },
                { end: 20, opacity: 1, color: 'red', name: 'Good ' }
                ],
                minimum: 0, maximum: 20, interval: 5,
                valueField: 'value', targetField: 'target',
                animation: { enable: false },
                legendSettings: {visible: true}
            });
            bullet.appendTo('#container');
        });
        afterAll((): void => {
            bullet.destroy();
            bulletElement.remove();
        });
        it('Single Series Static Name and Multiple series legend text', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById(legendId + '_text_0');
                expect(legendElement.textContent).toEqual('RangeOnetesting');
                for (let i: number = 0, length: number = bullet.ranges.length; i < length; i++) {
                    legendElement = document.getElementById(legendId + '_text_' + i);
                    expect(legendElement.textContent).toEqual(bullet.ranges[i].name);
                }
                done();
            };
            bullet.ranges[0].name = 'RangeOnetesting';
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Style fill, height, width', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                for (let i: number = 0, length: number = bullet.ranges.length; i < length; i++) {
                    legendElement = document.getElementById(legendId + '_shape_' + i);
                    if (i % 5 === 0 && i !== 0) {
                        expect(legendElement.getAttribute('fill')).toEqual('lightgray');
                    } else {
                        expect(legendElement.getAttribute('fill')).toEqual(bullet.ranges[i].color);
                    }
                    expect(legendElement.getAttribute('d')).not.toEqual('');
                }
                done();
            };
            bullet.legendSettings = {
                border: { color: 'red', width: 1 },
                shapePadding: 8, shapeHeight: 10, shapeWidth: 10,
                position: 'Right'
            };
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Style font, background, padding', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                let legendgroup: Element = document.getElementById(legendId + '_element');
                expect(legendgroup.getAttribute('fill')).toEqual('gray');
                legendElement = document.getElementById(legendId + '_shape_0');
                let d: string[] = legendElement.getAttribute('d').split(' ');
                expect(Number(d[7]) - Number(d[1])).toBe(10);
                expect(Number(d[8]) - Number(d[2])).toBe(10);
                legendElement = document.getElementById(legendId + '_text_0');
                expect(legendElement.getAttribute('x')).toEqual('39');
                expect(legendElement.getAttribute('font-size')).toEqual(bullet.legendSettings.textStyle.size);
                expect(legendElement.getAttribute('fill')).toEqual(bullet.legendSettings.textStyle.color);
                expect(parseFloat(legendElement.getAttribute('opacity'))).toEqual(bullet.legendSettings.textStyle.opacity);
                expect(legendElement.getAttribute('font-style')).toEqual(bullet.legendSettings.textStyle.fontStyle);
                expect(legendElement.getAttribute('font-family')).toEqual(bullet.legendSettings.textStyle.fontFamily);
                expect(legendElement.getAttribute('font-weight')).toEqual(bullet.legendSettings.textStyle.fontWeight);
                done();
            };
            bullet.legendSettings = {
                shapePadding: 4, border: { color: 'red', width: 5 }, padding: 10,
                textStyle: {
                    size: '12px', color: 'Blue', opacity: 0.5, fontStyle: 'italic', fontFamily: 'Lucida Console',
                    fontWeight: 'bold'
                },
                background: 'gray', alignment: 'Near',
                position: 'Bottom',
            };
            bullet.ranges[0].shape = 'Rectangle';
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Bottom Position', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                value = parseInt(legendElement.getAttribute('x'), 10);
                expect(value === 439.5 || value === 439 || value === 187 || value === 219).toBe(true);
                value = parseInt(legendElement.getAttribute('y'), 10);
                expect(value === 89 || value === 99 || value === 96).toBe(true);
                done();
            };
            bullet.legendSettings = {
                position: 'Bottom', alignment: 'Center',
            };
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Custom X and Y Position', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                let container: Element = document.getElementById(bulletElement.id + '_svg');
                expect(parseInt(legendElement.getAttribute('x'), 10)).toBe(100);
                expect(parseInt(legendElement.getAttribute('y'), 10)).toBe(100);
                done();
            };
            bullet.legendSettings = {
                position: 'Custom',
                location: { x: 100, y: 100 }
            };
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Right Position', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                value = parseInt(legendElement.getAttribute('x'), 10);
                expect(value === 597 || value === 1103 || value === 635).toBe(true);
                expect(parseInt(legendElement.getAttribute('y'), 10)).toBe(26);
                done();
            };
            bullet.legendSettings = {
                position: 'Right',
            };
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Top Position', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                value = parseInt(legendElement.getAttribute('x'), 10);
                expect(value == 439.5 || value === 439 || value === 187 || value === 219).toBe(true);
                expect(parseInt(legendElement.getAttribute('y'), 10)).toBe(20);
                done();
            };
            bullet.legendSettings = {
                position: 'Top',
            };
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Top Position With Title', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                value = parseInt(legendElement.getAttribute('x'), 10);
                expect(value == 439.5 || value === 439 || value == 187 || value === 219).toBe(true);
                value = parseInt(legendElement.getAttribute('y'), 10);
                expect(value === 41 || value === 50).toBe(true);
                done();
            };
            bullet.title = 'Chart Legend Spec Title';
            bullet.legendSettings = {
                position: 'Top',
            };
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Left Position', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('x'), 10)).toBe(15);
                let y: number = parseInt(legendElement.getAttribute('y'), 10);
                expect(y === 166 || y === 47).toBe(true);
                done();
            };
            bullet.legendSettings = {
                position: 'Left',
            };
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Legend Page Navigation Down and Up for vertical orientation', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById(legendId + '_pagedown');
                let pagenumber: number; let downclick: number = 3;
                for (let i: number = 1; i < downclick; i++) {
                    trigger.clickEvent(legendElement);
                    pagenumber = parseInt((document.getElementById(legendId + '_pagenumber').textContent.split('/')[0]), 10);
                }
                legendElement = document.getElementById(legendId + '_pageup');
                let upclick: number = 1;
                for (let i: number = 1; i <= upclick; i++) {
                    trigger.clickEvent(legendElement);
                    pagenumber = parseInt((document.getElementById(legendId + '_pagenumber').textContent.split('/')[0]), 10);
                }
                expect(pagenumber).toBe(downclick - upclick);
                trigger.clickEvent(legendElement);
                done();
            };
            bullet.ranges = rangeCollection;
            bullet.legendSettings = {
                position: 'Right', alignment: 'Near',
            };
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Legend Page Navigation Down and Up for horizontal orientation', () => {
            bullet.legendSettings = {
                position: 'Bottom', alignment: 'Near',
            };
            bullet.dataBind();
            legendElement = document.getElementById(legendId + '_pagedown');
            let pagenumber: number; let downclick: number = 3;
            for (let i: number = 1; i < downclick; i++) {
                trigger.clickEvent(legendElement);
                pagenumber = parseInt((document.getElementById(legendId + '_pagenumber').textContent.split('/')[0]), 10);
            }
            legendElement = document.getElementById(legendId + '_pageup');
            let upclick: number = 1;
            for (let i: number = 1; i <= upclick; i++) {
                trigger.clickEvent(legendElement);
                pagenumber = parseInt((document.getElementById(legendId + '_pagenumber').textContent.split('/')[0]), 10);
            }
            // expect(pagenumber).toBe(downclick - upclick);
            trigger.clickEvent(legendElement);
        });
        it('Legend Alignment Far placing for Horizontal', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                value = parseInt(legendElement.getAttribute('x'), 10);
                expect(value === 441 || value === 946 || value === 484).toBe(true);
                value = parseInt(legendElement.getAttribute('y'), 10);
                expect(value === 89 || value === 99 || value === 96).toBe(true);
                done();
            };
            bullet.legendSettings = { position: 'Bottom', alignment: 'Far' };
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Legend Alignment Far placing for Vertical', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect(parseInt(legendElement.getAttribute('x'), 10)).toBe(15);
                expect(parseInt(legendElement.getAttribute('y'), 10)).toBe(58);
                done();
            };
            bullet.legendSettings = { position: 'Left', alignment: 'Far' };
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Veritcal orientation bullet chart with Legend', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                value = parseInt(legendElement.getAttribute('x'), 10);
                expect(value === 44 || value === 15).toBe(true);
                value = parseInt(legendElement.getAttribute('y'), 10);
                expect(value === 178.5 || value === 178 || value === 170).toBe(true);
                done();
            };
            bullet.legendSettings = { position: 'Left', alignment: 'Center' };
            bullet.orientation = 'Vertical';
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Legend with background', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById(legendId + '_element');
                expect((legendElement.getAttribute('stroke'))).toBe('red');
                done();
            };
            bullet.legendSettings = { position: 'Left', alignment: 'Center', background: 'red' };
            bullet.orientation = 'Vertical';
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Checking with multiple target types', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById('container_chart_legend_translate_g');
                expect(legendElement.lastElementChild.childElementCount).toBe(2);
                legendElement =  document.getElementById('container_chart_legend_shape_6');
                expect(legendElement.getAttribute('rx')).toBe('4');
                done();
            };
            bullet.orientation = 'Vertical';
            bullet.dataSource = multiTarget;
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Checking with multiple data', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById('container_chart_legend_translate_g');
                expect(legendElement.childElementCount).toBe(5);
                done();
            };
            bullet.dataSource = multipleData;
            bullet.targetField = 'comparativeMeasureValue';
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Checking with multiple target types in horizontal mode', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement = document.getElementById('container_chart_legend_pagenumber');
                expect(legendElement.textContent === '1/2' || legendElement.textContent === '1/4' ).toBe(true);
                legendElement =  document.getElementById('container_chart_legend_shape_3');
                expect(legendElement.getAttribute('rx')).toBe('4');
                done();
            };
            bullet.orientation = 'Horizontal';
            bullet.dataSource = multiTarget;
            bullet.targetField = 'target';
            bullet.ranges = [{end: 10}, {end: 12}, {end: 20}];
            bullet.legendSettings.position = 'Right';
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Checking with target color as empty', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement =  document.getElementById('container_chart_legend_shape_0');
                expect(legendElement.getAttribute('fill')).toBe('black');
                done();
            };
            bullet.targetColor = null;
            bullet.legendSettings.background = 'transparent';
            bullet.loaded = loaded;
            bullet.refresh();
        });
        it('Checking with range color as empty', (done: Function) => {
            loaded = (args: Object): void => {
                bullet.loaded = null;
                legendElement =  document.getElementById('container_chart_legend_shape_0');
                expect(legendElement.getAttribute('fill')).toBe('black');
                done();
            };
            bullet.ranges = [{end: 10, color: null}, {end: 12,  color: null}, {end: 20,  color: null}];
            bullet.loaded = loaded;
            bullet.refresh();
        });
    });
});