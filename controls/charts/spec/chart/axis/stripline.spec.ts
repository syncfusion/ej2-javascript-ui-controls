/**
 * Stripline Spec 
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { ILoadedEventArgs } from '../../../src/common/model/interface';
import { Series } from '../../../src/chart/series/chart-series';
import { StripLine } from '../../../src/chart/axis/strip-line';
import { DateTime } from '../../../src/chart/axis/date-time-axis';
import { DateTimeCategory } from '../../../src/chart/axis/date-time-category-axis';
import { Category } from '../../../src/chart/axis/category-axis';
import { Logarithmic } from '../../../src/chart/axis/logarithmic-axis';
import { SeriesModel } from '../../../src/chart/series/chart-series-model';
import { LineSeries } from '../../../src/chart/series/line-series';
import { AreaSeries } from '../../../src/chart/series/area-series';
import { Legend } from '../../../src/chart/legend/legend';
import { unbindResizeEvents } from '../base/data.spec';
import { sizeType } from '../../../src/chart/utils/enum';
import '../../../node_modules/es6-promise/dist/es6-promise';
Chart.Inject(LineSeries, AreaSeries, Legend, StripLine, DateTime, Category, Logarithmic,DateTimeCategory);
let i: number; let data: Points[] = []; let seriesCollection: SeriesModel[] = [];
for (let j: number = 0; j < 5; j++) {
    for (i = 0; i < 10; i++) {
        data.push({ x: i, y: Math.random() * 100 });
    }
    seriesCollection[j] = {
        name: 'Series ' + j,
        animation: { enable: false },
        dataSource: data, xName: 'x', yName: 'y', type: 'Line'
    };
    data = [];
}
let data1: Object[] = [
    { x: new Date(2000, 6, 11), y: 10 }, { x: new Date(2002, 3, 7), y: 30 },
    { x: new Date(2004, 3, 6), y: 15 }, { x: new Date(2006, 3, 30), y: 65 },
    { x: new Date(2008, 3, 8), y: 90 }, { x: new Date(2010, 3, 8), y: 85 }
];
let data2: Object[] = [
    { x: 'USA', y: 30 }, { x: 'China', y: 23 },
    { x: 'Japan', y: 10 }, { x: 'Australia', y: 23 },
    { x: 'France', y: 20 }, { x: 'Germany', y: 45 },
    { x: 'Italy', y: 45 }, { x: 'Sweden', y: 31 }
];
interface Points {
    x: number;
    y: number;
}
describe('Chart control checking', () => {
    let chart: Chart;
    let id: string = 'stripline';
    let stripLineId: string = id + '_stripline';
    let stripLineElement: Element;
    let loaded: EmitType<ILoadedEventArgs>;
    let ele: HTMLElement;
    describe('Stripline checking', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            ele.style.background = 'transparent';
            document.body.appendChild(ele);
            chart = new Chart({
                primaryXAxis: { title: 'Sales Across Years' },
                height: '400', width: '600',
                primaryYAxis: { title: 'Sales Amount in millions(USD)', rangePadding: 'Additional' },
                series: seriesCollection,
                loaded: loaded
            });

        });
        afterAll((): void => {
            chart.destroy();
            document.getElementById(id).remove();
        });
        it('Stripline visible false', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById(stripLineId + '_Behind_rect_0');
                expect(element).toBe(null);
                element = document.getElementById(stripLineId + '_Over_rect_0');
                expect(element).toBe(null);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#' + id);
        });
        it(' XAxis Stripline', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Over_rect_0');
                expect(stripLineElement).not.toEqual(null);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                expect(stripLineElement).not.toEqual(null);
                done();
            };
            chart.primaryXAxis.stripLines = [
                {
                    startFromAxis: false, start: 1, size: 4,
                    verticalAlignment: 'End', opacity: 0.5,
                    color: 'red', zIndex: 'Behind', text: 'Behind'
                },
                {
                    start: 6, end: 8, opacity: 0.3,
                    color: 'blue', textStyle: { color: '#ffffff' },
                    text: 'Over', zIndex: 'Over'
                }];
            chart.loaded = loaded;
            chart.refresh();

        });
        it(' YAxis Stripline', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Over_rect_0');
                expect(stripLineElement).not.toEqual(null);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                expect(stripLineElement).not.toEqual(null);
                done();
            };
            chart.primaryXAxis.stripLines = [];
            chart.primaryYAxis.stripLines = [
                {
                    start: 10, end: 50,
                    zIndex: 'Over', color: '#663AB6'
                },
                {
                    start: 60, end: 100,
                    color: '#EB3F79'
                }];
            chart.loaded = loaded;
            chart.refresh();

        });
        it('XAxis Size', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let width: string = Number(stripLineElement.getAttribute('width')).toFixed(1);
                expect(width == '175.5' || width == '176.8').toBe(true);
                let x: string = Number(stripLineElement.getAttribute('x')).toFixed(1);
                expect(x == '122.0' || x == '118.4').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                width = Number(stripLineElement.getAttribute('width')).toFixed(1);
                expect(width == '117.0' || width == '117.9').toBe(true);
                x = Number(stripLineElement.getAttribute('x')).toFixed(1);
                expect(x == '414.5' || x == '413.2').toBe(true);
                done();
            };
            chart.primaryYAxis.stripLines = [];
            chart.primaryXAxis.stripLines = [{ start: 1, color: '#663AB6', size: 3 },
            { start: 6, color: '#EB3F79', size: 2 }];
            chart.loaded = loaded;
            chart.refresh();


        });
        it('YAxis Size', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let height: number = parseInt(stripLineElement.getAttribute('height'), 10);
                expect(height == 84 || height == 85).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 157 || y == 160).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                expect(parseInt(stripLineElement.getAttribute('height'), 10)).toEqual(21);
                y = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 117 || y == 115).toBe(true);
                done();
            };
            chart.primaryXAxis.stripLines = [];
            chart.primaryYAxis.stripLines = [{ start: 10, end: 50, color: '#663AB6', size: 60 },
            { start: 60, end: 70, color: '#EB3F79', size: 40 }];
            chart.loaded = loaded;
            chart.refresh();

        });
        it('Stripline Dash Array Present', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let dasharray: string = stripLineElement.getAttribute("stroke-dasharray");
                expect(dasharray).toEqual("null");
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                let dasharray1: string = stripLineElement.getAttribute("stroke-dasharray");
                expect(dasharray1).not.toEqual("null");
                done();
            };

            chart.primaryYAxis.stripLines = [{ start: 1, color: '#663AB6', size: 3 },
            { start: 1, color: '#663AB6', size: 3, dashArray: "10,2" }];

            chart.loaded = loaded;
            chart.appendTo('#' + id);
        });

        it('Basic Dash Array Requirement Checking', (done: Function) => {
            loaded = () => {

                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let height: number = parseInt(stripLineElement.getAttribute('height'), 10);
                expect(height >= 0).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y != null).toBe(true);
                let width: string = Number(stripLineElement.getAttribute('width')).toFixed(1);
                expect(width != null).toBe(true);
                let x: string = Number(stripLineElement.getAttribute('x')).toFixed(1);
                expect(x != null).toBe(true);
                let dashArray: string = stripLineElement.getAttribute('stroke-dasharray');
                expect(dashArray != null).toBe(true);
                done();
            };
            chart.primaryXAxis.stripLines = [];
            chart.primaryYAxis.stripLines = [{ start: 0, end: 5, color: '#663AB6', dashArray: "10,2" }];
            chart.loaded = loaded;
            chart.refresh();

        });
        it('Color, Opacity, Border Color and Dash Array', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                expect(stripLineElement.getAttribute('fill')).toEqual('#663AB6');
                expect(stripLineElement.getAttribute('stroke')).toEqual('gray');
                expect(stripLineElement.getAttribute('opacity')).toEqual('0.5');
                expect(stripLineElement.getAttribute('stroke-dasharray')).toEqual('10,2');
                done();
            };
            chart.primaryYAxis.stripLines = [];
            chart.primaryXAxis.stripLines = [{
                start: 1, color: '#663AB6', border: { color: 'gray', width: 1 },
                dashArray: '10,2', opacity: 0.5, size: 5
            }];
            chart.loaded = loaded;
            chart.refresh();

        });
        it('Inversed axis stripline', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let temp: number = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(temp === 239 || temp === 236).toBe(true);
                expect(parseInt(stripLineElement.getAttribute('y'), 10)).toBe(10);
                temp = parseInt(stripLineElement.getAttribute('height'), 10);
                expect(temp === 295 || temp === 300).toBe(true);
                temp = parseInt(stripLineElement.getAttribute('width'), 10);
                expect(temp === 294 || temp === 292).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                temp = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(temp === 63 || temp === 59).toBe(true);
                temp = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(temp === 115 || temp === 117).toBe(true);
                expect(parseInt(stripLineElement.getAttribute('height'), 10)).toBe(42);
                temp = parseInt(stripLineElement.getAttribute('width'), 10);
                expect(temp === 526 || temp === 530).toBe(true);
                done();
            };
            chart.primaryYAxis.isInversed = true;
            chart.primaryXAxis.isInversed = true;
            chart.primaryYAxis.stripLines=[{
                start: 30,
                end: 50
            }];
    
            chart.loaded = loaded;
            chart.refresh();

        });
    });
    describe('Stripline Size Type checking', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            ele.style.background = 'transparent';
            document.body.appendChild(ele);
            chart = new Chart({
                border: { width: 1, color: 'red' },

                primaryXAxis: {
                    valueType: 'DateTime',
                },
                primaryYAxis: {

                },
                chartArea: { border: { width: 1, color: 'blue' } },
                series: [{

                    dataSource: [{ x: new Date(2005, 0, 1), y: 21 }, { x: new Date(2006, 0, 1), y: 24 },
                    { x: new Date(2007, 0, 1), y: 36 }, { x: new Date(2008, 0, 1), y: 38 },
                    { x: new Date(2009, 0, 1), y: 54 }, { x: new Date(2010, 0, 1), y: 57 },
                    { x: new Date(2011, 0, 1), y: 70 }],
                    xName: 'x',
                    yName: 'y', name: 'Browser', type: 'Line', drawType: 'Area', marker: {
                        visible: true, width: 5, height: 5
                    },
                }],
                legendSettings: {
                    visible: true,
                    border: { width: 1, color: 'red' }
                },
                tooltip: { enable: true, header: 'Browser', format: '${point.x}:<b> ${point.y}%<b>' },
                title: 'Mobile Browser Statistics',
                titleStyle: { textAlignment: "Center", }
            }, ele);
        });
        afterAll((): void => {
            chart.destroy();
            document.getElementById(id).remove();
        });

        it('Pixel Type', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_path_0');
                expect(stripLineElement.getAttribute("stroke-width")).toEqual('1');
                expect(stripLineElement.getAttribute("d")).not.toEqual(null);
                let height: number = stripLineElement.getBoundingClientRect().height;
                expect(height == 333 || height == 338).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                intervalType: 'Years',
                stripLines: [
                    {
                        startFromAxis: true, size: 1, sizeType: 'Pixel',
                    },
                    {
                        start: new Date(2011, 0, 1), size: 1, sizeType: 'Pixel',
                    },

                ]
            };
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Pixel Type without start value', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_path_2');
                expect(stripLineElement == null).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                intervalType: 'Years',
                stripLines: [
                    {
                        visible: true,                  
                        size: 10,
                        sizeType: 'Pixel',
                        isRepeat: true,
                        repeatEvery: 2,
                        color: 'black',
                        text: 'text',
                    },
                    

                ]
            };
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Inverse axis Pixel Type', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_path_0');
                let height: number = stripLineElement.getBoundingClientRect().height;
                expect(height == 333 || height == 338).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                isInversed: true,
                stripLines: [{ startFromAxis: true, size: 1, sizeType: 'Pixel' },
                { start: new Date(2009, 0, 1), size: 1, sizeType: 'Pixel', text: 'test' },
                {
                    start: new Date(2000, 0, 1), size: 1, sizeType: 'Pixel'
                },
                {
                    start: new Date(2018, 0, 1), size: 1, sizeType: 'Pixel'
                }]
            };
            chart.primaryYAxis = {
                isInversed: true,
                stripLines: [{ startFromAxis: true, size: 1, sizeType: 'Pixel' },
                { start: 100, size: 1, sizeType: 'Pixel', text: 'test' },
                {
                    start: -100, size: 1, sizeType: 'Pixel'
                }]
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Years Type', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute("x"), 10);
                expect(x == 33 || x == 32).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute("y"), 10);
                expect(y == 45 || y == 42).toBe(true);
                let width: number = parseInt(stripLineElement.getAttribute("width"), 10);
                expect(width == 119 || width == 120).toBe(true);
                let height: number = parseInt(stripLineElement.getAttribute("height"), 10);
                expect(height == 333 || height == 338).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                intervalType: 'Years',
                isInversed: false,
                stripLines: [{ start: new Date(2005, 0, 1), size: 1, sizeType: "Years" },
                { start: new Date(2005, 0, 1), end: new Date(2005, 0, 1), sizeType: "Years" }],
            };
            chart.primaryYAxis = {
                isInversed: false,
            };
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Months Type', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute("x"), 10);
                expect(x == 33 || x == 32).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute("y"), 10);
                expect(y == 45 || y == 42).toBe(true);
                let width: number = parseInt(stripLineElement.getAttribute("width"), 10);
                expect(width == 10).toBe(true);
                let height: number = parseInt(stripLineElement.getAttribute("height"), 10);
                expect(height == 333 || height == 338).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                valueType: 'DateTime',
                intervalType: 'Months',
                stripLines: [{ start: new Date(2005, 0, 1), size: 1, sizeType: "Months" },
                { start: new Date(2005, 0, 1), end: new Date(2005, 1, 1), sizeType: "Months" }]
            },
                chart.loaded = loaded;
            chart.refresh();
        });

        it('Days Type', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute("x"), 10);
                expect(x == 33 || x == 32).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute("y"), 10);
                expect(y == 45 || y == 42).toBe(true);
               let width: number = parseInt(stripLineElement.getAttribute("width"), 10);
                expect(width == 9).toBe(true);
               
                let height: number = parseInt(stripLineElement.getAttribute("height"), 10);
                expect(height == 333 || height == 338).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                valueType: 'DateTime',
                intervalType: 'Days',
                stripLines: [{ start: new Date(2005, 0, 1), size: 30, sizeType: "Days" },
                { start: new Date(2005, 0, 1), end: new Date(2005, 0, 30), sizeType: "Days" }]
            },
                chart.loaded = loaded;
            chart.refresh();
        });

        it('Hours Type', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute("x"), 10);
                expect(x == 33 || x == 32).toBe(true);
                
                let y: number = parseInt(stripLineElement.getAttribute("y"), 10);
                expect(y == 45 || y == 42).toBe(true);
               
                let width: number = parseInt(stripLineElement.getAttribute("width"), 10);
                expect(width == 9).toBe(true);
                
                let height: number = parseInt(stripLineElement.getAttribute("height"), 10);
                expect(height == 333 || height == 338).toBe(true);
                
                done();
            };
            chart.primaryXAxis = {
                valueType: 'DateTime',
                intervalType: 'Hours',
                stripLines: [{ start: new Date(2005, 0, 1), size: 720, sizeType: "Hours" },
                { start: new Date(2005, 0, 1), end: new Date(2005, 0, 2, 20), sizeType: "Hours" }]
            },
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Minutes Type', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute("x"), 10);
                expect(x == 33 || x == 32).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute("y"), 10);
                expect(y == 45 || y == 42).toBe(true);
                let width: number = parseInt(stripLineElement.getAttribute("width"), 10);
                expect(width == 9).toBe(true);
                let height: number = parseInt(stripLineElement.getAttribute("height"), 10);
                expect(height == 333 || height == 338).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                valueType: 'DateTime',
                intervalType: 'Minutes',
                stripLines: [{ start: new Date(2005, 0, 1), size: 43200, sizeType: "Minutes" },
                { start: new Date(2005, 0, 1), end: new Date(2005, 0, 1, 1, 60), sizeType: "Minutes" }]
            },
                chart.loaded = loaded;
            chart.refresh();
        });

        it('Seconds Type', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute("x"), 10);
                expect(x == 33 || x == 32).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute("y"), 10);
                expect(y == 45 || y == 42).toBe(true);
                let width: number = parseInt(stripLineElement.getAttribute("width"), 10);
                expect(width == 9).toBe(true);
                let height: number = parseInt(stripLineElement.getAttribute("height"), 10);
                expect(height == 333 || height == 338).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                valueType: 'DateTime',
                intervalType: 'Seconds',
                stripLines: [{ start: new Date(2005, 0, 1), size: 2592000, sizeType: "Seconds" },
                { start: new Date(2005, 0, 1), end: new Date(2005, 0, 1, 5, 59, 44), sizeType: "Seconds" }]
            },
                chart.loaded = loaded;
            chart.refresh();
        });

        it('sizeType Auto checking', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute("x"), 10);
                
                expect(x == 33 || x == 32).toBe(true);
                let width: number = parseInt(stripLineElement.getAttribute("width"), 10);
                
                expect(width == 199 || width == 201).toBe(true);
                let height: number = parseInt(stripLineElement.getAttribute("height"), 10);
                
                expect(height == 333 || height == 338).toBe(true);
                done();
            };
            chart.primaryXAxis.valueType = 'DateTime';
            chart.primaryXAxis.intervalType = 'Months';
            chart.primaryXAxis.stripLines = [{
                startFromAxis: true, size: 2, sizeType: 'Auto'
            }]
            chart.loaded = loaded;
            chart.refresh();
        });
    });
    describe('Stripline recurrence checking', () => {

        beforeAll((): void => {
            ele = createElement('div', { id: id });
            ele.style.background = 'transparent';
            document.body.appendChild(ele);
            chart = new Chart({

                primaryYAxis: {

                },

                series: [{
                    dataSource: [{ x: 1, y: 7 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 14 }, { x: 5, y: 1 }, { x: 6, y: 10 },
                    { x: 7, y: 8 }, { x: 8, y: 6 }, { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 16 }, { x: 12, y: 6 },
                    { x: 13, y: 14 }, { x: 14, y: 7 }, { x: 15, y: 5 }, { x: 16, y: 2 }, { x: 17, y: 14 }, { x: 18, y: 7 },
                    { x: 19, y: 7 }, { x: 20, y: 10 }],
                    xName: 'x',
                    yName: 'y', name: 'Browser', type: 'Line', drawType: 'Area', marker: {
                        visible: true, width: 5, height: 5
                    },
                }
                ],
                tooltip: { enable: true, header: 'Browser', format: '${point.x}:<b> ${point.y}%<b>' },
                //Initializing Title
                title: 'Mobile Browser Statistics',
                titleStyle: { textAlignment: "Center", }
            }, ele);
        });
        afterAll((): void => {
            chart.destroy();
            document.getElementById(id).remove();
        });


        it('Horizontal Recurrence for Numeric Axis', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute("x"), 10);
                expect(x == 33 || x == 32).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                let x1: number = parseInt(stripLineElement.getAttribute("x"), 10);
                expect(x1 == 109 || x1 == 108).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_2');
                let x2: number = parseInt(stripLineElement.getAttribute("x"), 10);
                expect(x2 == 184 || x2 == 185).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                valueType: 'Double',
                stripLines: [{
                    startFromAxis: true, size: 1, isRepeat: true,
                    repeatEvery: 2, color: "yellow"
                },]
            };
            chart.primaryYAxis = {};
            chart.series = [{
                dataSource: [{ x: 1, y: 7 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 14 }, { x: 5, y: 1 }, { x: 6, y: 10 },
                { x: 7, y: 8 }, { x: 8, y: 6 }, { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 16 }, { x: 12, y: 6 },
                { x: 13, y: 14 }, { x: 14, y: 7 }, { x: 15, y: 5 }, { x: 16, y: 2 }, { x: 17, y: 14 }, { x: 18, y: 7 },
                { x: 19, y: 7 }, { x: 20, y: 10 }],
                xName: 'x',
                yName: 'y', name: 'Browser', type: 'Line', drawType: 'Area', marker: {
                    visible: true, width: 5, height: 5
                },
            }];
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Horizontal Recurrence for Category Axis', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 33 || x == 32).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                let x1: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x1 == 153).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_2');
                let x2: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x2 == 273 || x2 == 274).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                valueType: 'Category',
            };
            chart.primaryYAxis = {};
            chart.series = [{
                dataSource: [
                    { 'x': 'Chrome', y: 27, text: '37%' }, { 'x': 'UC Browser', y: 17, text: '17%' },
                    { 'x': 'iPhone', y: 19, text: '19%' },
                    { 'x': 'Others', y: 4, text: '4%' }, { 'x': 'Opera', y: 11, text: '11%' },
                    { 'x': 'Android', y: 12, text: '12%' }
                ],
                xName: 'x',
                yName: 'y', name: 'india', type: 'Line', drawType: 'Area', marker: {
                    visible: true, width: 5, height: 5
                },
            }];
            chart.primaryXAxis = {
                valueType: "Category",
                stripLines: [{ startFromAxis: true, size: 0.5, isRepeat: true, repeatEvery: 1, color: "yellow" },
                { start: 1, size: 1, sizeType: "Pixel", color: "red" },
                { start: 1, size: 0.5, isRepeat: true, repeatEvery: 1, repeatUntil: 5, color: "yellow" },
                ]
            };

            chart.loaded = loaded;
            chart.refresh();
        });

        it('Recurrence checking with size and end value', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                expect(stripLineElement !== null).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                expect(stripLineElement !== null).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_2');
                expect(stripLineElement !== null).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_3');
                expect(stripLineElement === null).toBe(true);
                done();
            };
            chart.primaryYAxis = {};
            chart.series = [{
                dataSource: [
                    { 'x': 'Chrome', y: 27, text: '37%' }, { 'x': 'UC Browser', y: 17, text: '17%' },
                    { 'x': 'iPhone', y: 19, text: '19%' },
                    { 'x': 'Others', y: 4, text: '4%' }, { 'x': 'Opera', y: 11, text: '11%' },
                    { 'x': 'Android', y: 12, text: '12%' }
                ],
                xName: 'x',
                yName: 'y', name: 'india', type: 'Line', drawType: 'Area', marker: {
                    visible: true, width: 5, height: 5
                }}];
                chart.primaryXAxis = {
                    valueType: "Category",
                    stripLines: [{
                        visible: true,
                        start: 1,
                        end: 4,
                        size: 0.5,
                        isRepeat: true,
                        repeatEvery: 2,
                        color: 'yellow',
                        text: 'text',
                    }
                    
                    ]
                };
    
                chart.loaded = loaded;
                chart.refresh();
        });

        it('Recurrence checking without repeatEvery', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                expect(stripLineElement !== null).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                expect(stripLineElement === null).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_2');
                expect(stripLineElement === null).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_3');
                expect(stripLineElement === null).toBe(true);
                done();
            };
            chart.primaryYAxis = {};
            chart.series = [{
                dataSource: [
                    { 'x': 'Chrome', y: 27, text: '37%' }, { 'x': 'UC Browser', y: 17, text: '17%' },
                    { 'x': 'iPhone', y: 19, text: '19%' },
                    { 'x': 'Others', y: 4, text: '4%' }, { 'x': 'Opera', y: 11, text: '11%' },
                    { 'x': 'Android', y: 12, text: '12%' }
                ],
                xName: 'x',
                yName: 'y', name: 'india', type: 'Line', drawType: 'Area', marker: {
                    visible: true, width: 5, height: 5
                }}];
                chart.primaryXAxis = {
                    valueType: "Category",
                    stripLines: [{
                        visible: true,
                        start: 4,
                        size: 0.5,
                        isRepeat: true,                 
                        color: 'yellow',
                        text: 'text',
                    }
                    
                    ]
                };
    
                chart.loaded = loaded;
                chart.refresh();

        });
        
        it('Horizontal Recurrence for DateTime Axis', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 33 || x == 32).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                let x1: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x1 == 273 || x1 == 274).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_2');
                let x2: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x2 == 513 || x2 == 516).toBe(true);
                done();
            };
            chart.series = [{
                dataSource: [{ x: new Date(2005, 0, 1), y: 21 }, { x: new Date(2006, 0, 1), y: 24 },
                { x: new Date(2007, 0, 1), y: 36 }, { x: new Date(2008, 0, 1), y: 38 },
                { x: new Date(2009, 0, 1), y: 54 }, { x: new Date(2010, 0, 1), y: 57 },
                { x: new Date(2011, 0, 1), y: 70 }
                ], xName: 'x',
                yName: 'y', name: 'Browser', type: 'Line', marker: {
                    visible: true, width: 5, height: 5
                },
            }];
            chart.primaryXAxis = {
                valueType: "DateTime",
                intervalType: "Years",
                stripLines: [{
                    start: new Date(2005, 0, 1), size: 1, sizeType: "Years", isRepeat: true,
                    repeatEvery: 2, color: "yellow"
                },
                {
                    start: new Date(2005, 0, 1), size: 1, sizeType: "Years", isRepeat: true,
                    repeatEvery: 3, repeatUntil: new Date(2011, 0, 1), color: "yellow",
                    isSegmented: true, segmentStart: 30, segmentEnd: 60
                },
                {
                    start: new Date(2005, 0, 1), size: 1, sizeType: "Years", isRepeat: true,
                    repeatEvery: 3, repeatUntil: new Date(2011, 0, 1), color: "yellow",
                },

                ]
            };
            chart.primaryYAxis = {};
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Horizontal Recurrence for Logarithmic Axis', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 33 || x == 32).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                let x1: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x1 == 213 || x1 == 214).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_2');
                let x2: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x2 == 393 || x2 == 395).toBe(true);
                done();
            };
            chart.series = [{
                dataSource: [{ x: 10, y: 7 }, { x: 20, y: 19 }, { x: 30, y: 14 }, { x: 100, y: 14 }, { x: 501, y: 22 }, { x: 699, y: 10 },
                { x: 300, y: 20 }, { x: 1000, y: 14 },
                ], xName: 'x',
                yName: 'y', name: 'Browser', type: 'Line', marker: {
                    visible: true, width: 5, height: 5
                },
            }];
            chart.primaryXAxis = {
                valueType: "Logarithmic",
                stripLines: [{ startFromAxis: true, size: 0.2, isRepeat: true, repeatEvery: 0.5, color: "yellow" },
                { startFromAxis: true, size: 2, sizeType: "Pixel", isRepeat: true, repeatEvery: 0.5, color: "red" }]

            };
            chart.primaryYAxis = {};
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Horizontal Recurrence for Multiple Axis', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 33 || x == 32).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                let x1: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x1 == 93 || x1 == 92).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_2');
                let x2: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x2 == 153).toBe(true);
                done();
            };
            chart.series = [{
                dataSource: [
                    { 'x': 'Chrome', y: 27, text: '37%' }, { 'x': 'UC Browser', y: 17, text: '17%' },
                    { 'x': 'iPhone', y: 19, text: '19%' },
                    { 'x': 'Others', y: 4, text: '4%' }, { 'x': 'Opera', y: 11, text: '11%' },
                    { 'x': 'Android', y: 12, text: '12%' }
                ],
                xName: 'x',
                yName: 'y', name: 'india', type: 'Line', drawType: 'Area', marker: {
                    visible: true, width: 5, height: 5
                },
            },
            {
                dataSource: [
                    { 'x': 'Chrome', y: 37, text: '37%' }, { 'x': 'UC Browser', y: 27, text: '17%' },
                    { 'x': 'iPhone', y: 29, text: '19%' },
                    { 'x': 'Others', y: 14, text: '4%' }, { 'x': 'Opera', y: 21, text: '11%' },
                    { 'x': 'Android', y: 22, text: '12%' }
                ],
                xName: 'x',
                yName: 'y', name: 'US', xAxisName: 'xAxis', type: 'Line', drawType: 'Area', marker: {
                    visible: true, width: 5, height: 5,
                },
            }
            ],
                chart.primaryXAxis = {
                    valueType: "Category",


                };
            chart.primaryYAxis = {
                lineStyle: { width: 0 }, majorGridLines: { width: 0 }
            };
            chart.axes = [

                {
                    valueType: "Category",
                    rowIndex: 0, opposedPosition: true,

                    name: 'xAxis',
                    stripLines: [{ startFromAxis: true, size: 0.5, isRepeat: true, repeatEvery: 1, color: "yellow" }]

                }
            ];
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Vertical Recurrence for Numeric Axis', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let y: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y == 55 || y == 52).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                let y1: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y1 == 55 || y1 == 52).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_2');
                let y2: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y2 == 55 || y1 == 52).toBe(true);
                done();
            };
            chart.primaryXAxis = {};
            chart.primaryYAxis.valueType = 'Double';
            chart.primaryYAxis = {
                stripLines: [{
                    startFromAxis: true, size: 2, isRepeat: true,
                    repeatEvery: 4, color: "yellow", opacity: 0.5
                }]
            };
            chart.series = [{
                dataSource: [{ x: 1, y: 7 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 14 }, { x: 5, y: 1 }, { x: 6, y: 10 },
                { x: 7, y: 8 }, { x: 8, y: 6 }, { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 16 }, { x: 12, y: 6 },
                { x: 13, y: 14 }, { x: 14, y: 7 }, { x: 15, y: 5 }, { x: 16, y: 2 }, { x: 17, y: 14 }, { x: 18, y: 7 },
                { x: 19, y: 7 }, { x: 20, y: 10 }],
                xName: 'x',
                yName: 'y', type: 'Line', marker: {
                    visible: true, width: 5, height: 5
                },
            }];
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Vertical Recurrence for Logarithmic Axis', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let y: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y == 55 || y == 52).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                let y1: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y1 == 55 || y == 52).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_2');
                let y2: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y2 == 55 || y == 52).toBe(true);
                done();
            };
            chart.series = [{
                dataSource: [{ y: 10, x: 1 }, { y: 100, x: 2 }, { y: 1000, x: 3 }, { y: 10000, x: 4 }, { y: 100000, x: 5 }, { y: 1000000, x: 6 }],
                xName: 'x', yName: 'y', type: 'Line', marker: {
                    visible: true, width: 5, height: 5
                },
            }];
            chart.primaryXAxis = {

            };
            chart.primaryYAxis.valueType = "Logarithmic";
            chart.primaryYAxis = {
                stripLines: [{
                    startFromAxis: true, size: 0.5, isRepeat: true,
                    repeatEvery: 1, color: "yellow"
                }]

            };
            chart.loaded = loaded;
            chart.refresh();
        });

    });
    describe('Segmented Stripline checking', () => {
        let chart: Chart;
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            ele.style.background = 'transparent';
            document.body.appendChild(ele);
            chart = new Chart({

                primaryXAxis: {
                },
                primaryYAxis: {},
                series: [{
                    dataSource: [{ x: 1, y: 7 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 14 }, { x: 5, y: 1 }, { x: 6, y: 10 },
                    { x: 7, y: 8 }, { x: 8, y: 6 }, { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 16 }, { x: 12, y: 6 },
                    { x: 13, y: 14 }, { x: 14, y: 7 }, { x: 15, y: 5 }, { x: 16, y: 2 }, { x: 17, y: 14 }, { x: 18, y: 7 },
                    { x: 19, y: 7 }, { x: 20, y: 10 }],
                    xName: 'x',
                    yName: 'y', type: 'Line', marker: {
                        visible: true, width: 5, height: 5
                    },
                }
                ],
                tooltip: { enable: true, header: 'Browser', format: '${point.x}:<b> ${point.y}%<b>' },
                //Initializing Title
                title: 'Mobile Browser Statistics',
                titleStyle: { textAlignment: "Center", }
            }, ele);
        });
        afterAll((): void => {
            chart.destroy();
            document.getElementById(id).remove();
        });

        it('Vertical Segmented stripline on Numeric Axis', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 109 || x == 108).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y == 249).toBe(true);
                let width: number = parseInt(stripLineElement.getAttribute('width'));
                expect(width == 113 || width == 114).toBe(true);
                let height: number = parseInt(stripLineElement.getAttribute('height'));
                expect(height == 81 || height == 82).toBe(true);
                done();
            };
            chart.primaryXAxis = {};
            chart.primaryYAxis = {
                stripLines: [{
                    start: 4, end: 8, isSegmented: true, segmentStart: 3, segmentEnd: 6, color: "green",
                    segmentAxisName: 'primaryXAxis'
                }]
            };
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Vertical Segmented stripline on Category Axis', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 453 || x == 456).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y == 331).toBe(true);
                let width: number = parseInt(stripLineElement.getAttribute('width'));
                expect(width == 119 || width == 121).toBe(true);
                let height: number = parseInt(stripLineElement.getAttribute('height'));
                expect(height == 40 || height == 41).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
                width = parseInt(stripLineElement.getAttribute('width'));
                expect(width >= 100).toBe(true);
                height = parseInt(stripLineElement.getAttribute('height'));
                expect(height >= 5).toBe(true);
                done();
            };
            chart.primaryXAxis = { valueType: 'Category', };
            chart.primaryYAxis = {
                stripLines: [{
                    start: 5, end: 10, isSegmented: true, segmentStart: 3, segmentEnd: 4, color: "green"
                },
                {
                    start: 1, size: 1, isSegmented: true, segmentStart: 1, segmentEnd: 2
                }]
            };
            chart.series = [
                {
                    dataSource: [
                        { 'x': 'Chrome', y: 37, text: '37%' }, { 'x': 'UC Browser', y: 17, text: '17%' },
                        { 'x': 'iPhone', y: 19, text: '19%' },
                        { 'x': 'Others', y: 4, text: '4%' }, { 'x': 'Opera', y: 11, text: '11%' },
                        { 'x': 'Android', y: 12, text: '12%' }
                    ],
                    xName: 'x',
                    yName: 'y', type: 'Line', marker: {
                        visible: true, width: 5, height: 5
                    }
                },
            ];
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Segment check without segmentStart and segmentEnd', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 213 || x ==214 ).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y == 45 || y == 42).toBe(true);
                let width: number = parseInt(stripLineElement.getAttribute('width'));
                expect(width == 119 || width == 121).toBe(true);
                let height: number = parseInt(stripLineElement.getAttribute('height'));
                expect(height == 368 || height == 372).toBe(true);
                done();
            };
            chart.primaryXAxis = { valueType: 'Category',
            stripLines: [
                {
                    start: 1, end: 2, color: 'black', opacity: 0.2, isSegmented: true
                }
            ] };
            chart.primaryYAxis = {};
            chart.series = [
                {
                    dataSource: [
                        { 'x': 'Chrome', y: 37, text: '37%' }, { 'x': 'UC Browser', y: 17, text: '17%' },
                        { 'x': 'iPhone', y: 19, text: '19%' },
                        { 'x': 'Others', y: 4, text: '4%' }, { 'x': 'Opera', y: 11, text: '11%' },
                        { 'x': 'Android', y: 12, text: '12%' }
                    ],
                    xName: 'x',
                    yName: 'y', type: 'Line', marker: {
                        visible: true, width: 5, height: 5
                    }
                },
            ];
            chart.loaded = loaded;
            chart.refresh();
        });
        
        it('Vertical Segmented stripline on DateTime Axis', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 273 || x == 274).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y == 137 || y == 135).toBe(true);
                let width: number = parseInt(stripLineElement.getAttribute('width'));
                expect(width == 359 || width == 363).toBe(true);
                let height: number = parseInt(stripLineElement.getAttribute('height'));
                expect(height == 92 || height == 93).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                valueType: 'DateTime',
                intervalType: "Years",
                stripLines: [
                    {
                        start: 1, end: 2, color: 'black', opacity: 0.2, isSegmented: true,
                        visible: false
                    }
                ] 
            };
            chart.primaryYAxis = {

                stripLines: [{

                    start: 40, end: 60, isSegmented: true, segmentStart: new Date(2007, 0, 1), segmentEnd: new Date(2010, 0, 1), color: "green"
                }]
            };
            chart.series = [
                {
                    dataSource: [{ x: new Date(2005, 0, 1), y: 21 }, { x: new Date(2006, 0, 1), y: 24 },
                    { x: new Date(2007, 0, 1), y: 36 }, { x: new Date(2008, 0, 1), y: 38 },
                    { x: new Date(2009, 0, 1), y: 54 }, { x: new Date(2010, 0, 1), y: 57 },
                    { x: new Date(2011, 0, 1), y: 70 }],
                    xName: 'x',
                    yName: 'y', type: 'Line', marker: {
                        visible: true, width: 5, height: 5
                    }
                },
            ];
            chart.loaded = loaded;
            chart.refresh();
        });


        it('Horizontal Segmented stripline on Numeric Axis', (done: Function) => {
            loaded = () => {

                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 393 || x == 395).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y == 130 || y == 124).toBe(true);
                let width: number = parseInt(stripLineElement.getAttribute('width'));
                expect(width == 5).toBe(true);
                let height: number = parseInt(stripLineElement.getAttribute('height'));
                expect(height == 85 || height == 82).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                stripLines: [{
                    start: 10, end: 14, isSegmented: true, segmentStart: 10, segmentEnd: 14, color: "blue"
                },
                {
                    start: 10, end: 14, isSegmented: true, segmentStart: 10, segmentEnd: 14, color: "blue",
                    segmentAxisName: 'primaryYAxis'
                }]
            };
            chart.primaryYAxis = {};
            chart.series = [{
                dataSource: [{ x: 1, y: 7 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 14 }, { x: 5, y: 1 }, { x: 6, y: 10 },
                { x: 7, y: 8 }, { x: 8, y: 6 }, { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 16 }, { x: 12, y: 6 },
                { x: 13, y: 14 }, { x: 14, y: 7 }, { x: 15, y: 5 }, { x: 16, y: 2 }, { x: 17, y: 14 }, { x: 18, y: 7 },
                { x: 19, y: 7 }, { x: 20, y: 10 }],
                xName: 'x',
                yName: 'y', type: 'Line', marker: {
                    visible: true, width: 5, height: 5
                },
            }
            ];
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Horizontal Segmented stripline on Logarithmic Axis', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 409 || x == 410).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y == 122 || y == 116).toBe(true);
                let width: number = parseInt(stripLineElement.getAttribute('width'));
                expect(width == 1).toBe(true);
                let height: number = parseInt(stripLineElement.getAttribute('height'));
                expect(height == 153 || height == 148).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                stripLines: [{
                    start: 2.5, end: 3.5, isSegmented: true, segmentStart: 3, segmentEnd: 5, color: "red",
                },]
            };
            chart.primaryYAxis = {
                valueType: "Logarithmic",
            };
            chart.series = [{
                dataSource: [{ y: 10, x: 1 }, { y: 100, x: 2 }, { y: 1000, x: 3 }, { y: 10000, x: 4 }, { y: 100000, x: 5 }, { y: 1000000, x: 6 }],
                xName: 'x',
                yName: 'y', type: 'Line', marker: {
                    visible: true, width: 5, height: 5
                }
            },];
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Segmented stripline in Multiple Axis', (done: Function) => {

            loaded = () => {

                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 384 || x == 387).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y == 216 || y == 207).toBe(true);
                let width: number = parseInt(stripLineElement.getAttribute('width'));
                expect(width == 6).toBe(true);
                let height: number = parseInt(stripLineElement.getAttribute('height'));
                expect(height == 106 || height == 103).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                stripLines: [{
                    start: 5, end: 10, isSegmented: true, segmentStart: 5, segmentEnd: 10, color: "red",
                    segmentAxisName: 'yAxis'
                }]
            };
            chart.axes = [{
                name: "yAxis",
                opposedPosition: true,
            }];
            chart.series = [
                {
                    dataSource: [{ x: 1, y: 7 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 14 }, { x: 5, y: 1 }, { x: 6, y: 10 },
                    { x: 7, y: 8 }, { x: 8, y: 6 }, { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 16 }, { x: 12, y: 6 },
                    { x: 13, y: 14 }, { x: 14, y: 7 }, { x: 15, y: 5 }, { x: 16, y: 2 }, { x: 17, y: 14 }, { x: 18, y: 7 },
                    { x: 19, y: 7 }, { x: 20, y: 10 }],
                    xName: 'x',
                    yName: 'y', type: 'Line', marker: {
                        visible: true, width: 5, height: 5
                    }
                },
                {
                    dataSource: [{ x: 1, y: 7 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 14 }, { x: 5, y: 1 }, { x: 6, y: 10 },
                    { x: 7, y: 8 }, { x: 8, y: 6 }, { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 16 }, { x: 12, y: 6 },
                    { x: 13, y: 14 }, { x: 14, y: 7 }, { x: 15, y: 5 }, { x: 16, y: 2 }, { x: 17, y: 14 }, { x: 18, y: 7 },
                    { x: 19, y: 7 }, { x: 20, y: 10 }],
                    xName: 'x', yAxisName: "yAxis",
                    yName: 'y', type: 'Scatter', marker: {
                        visible: true, width: 5, height: 5
                    },
                }
            ];

            chart.loaded = loaded;
            chart.refresh();
        });
        it('Vertical Segmented stripline on Logarithmic Axis', (done: Function) => {
            loaded = () => {

                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 587 || x == 593).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y == 45 || y == 42).toBe(true);
                let width: number = parseInt(stripLineElement.getAttribute('width'));
                expect(width == 138 || width == 140).toBe(true);
                let height: number = parseInt(stripLineElement.getAttribute('height'));
                expect(height == 33).toBe(true);
                done();
            };
            chart.primaryXAxis = {
                valueType: "Logarithmic",
            };
            chart.primaryYAxis = {
                stripLines: [{

                    start: 3, end: 6, isSegmented: true, segmentStart: 4, segmentEnd: 5, color: "red",


                },
                ]
            };
            chart.series = [{
                dataSource: [{ x: 10, y: 1 }, { x: 100, y: 2 }, { x: 1000, y: 3 }, { x: 10000, y: 4 }, { x: 100000, y: 5 }, { x: 1000000, y: 6 }],
                xName: 'x',
                yName: 'y', type: 'Line', marker: {
                    visible: true, width: 5, height: 5
                }
            },];
            chart.loaded = loaded;
            chart.refresh();
        });
        it('Segmented stripline on DateTimeCategory axis', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 68 || x == 67).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y == 45 || y == 42).toBe(true)
                let width: number = parseInt(stripLineElement.getAttribute('width'));
                expect(width == 69 || width == 70).toBe(true)
                let height: number = parseInt(stripLineElement.getAttribute('height'));
                expect(height == 368 || height == 372).toBe(true)
                done();
            };
            chart.primaryXAxis = {
                valueType: 'DateTimeCategory',
                stripLines: [
                    {
                        start: new Date(2017, 11, 20), end: new Date(2017, 11, 21),

                    },
                    {
                        start: new Date(2017, 11, 20), end: new Date(2017, 11, 21),
                        isSegmented: true, segmentStart: 20, segmentEnd: 50,

                    },
                    {
                        start: 1, end: 2,
                        isSegmented: true, segmentStart: 20, segmentEnd: 50,

                    }
                ],
            };
            chart.primaryYAxis = {
                valueType: 'Double',
            };
            chart.series = [
                {
                    dataSource: [{ x: new Date(2017, 11, 20), y: 21 }, { x: new Date(2017, 11, 21), y: 24 },
                    { x: new Date(2017, 11, 22), y: 24 }, { x: new Date(2017, 11, 26), y: 70 },
                    { x: new Date(2017, 11, 27), y: 75 }, { x: new Date(2018, 0, 2), y: 82 },
                    { x: new Date(2018, 0, 3), y: 53 }, { x: new Date(2018, 0, 4), y: 54 },
                    { x: new Date(2018, 0, 5), y: 53 }, { x: new Date(2018, 0, 8), y: 45 }
                    ], xName: 'x', yName: 'y', type: 'Line',
                }
            ];
            chart.loaded = loaded;
            chart.refresh();
        });


    });
    describe('Stripline text checking', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            ele.style.background = 'transparent';
            document.body.appendChild(ele);
            chart = new Chart({
                primaryXAxis: { title: 'Sales Across Years' },
                height: '400', width: '600',
                primaryYAxis: { title: 'Sales Amount in millions(USD)', rangePadding: 'Additional' },
                rows: [{ height: '180' }, { height: '180' }],
                columns: [{ width: '250' }, { width: '250' }],
                axes: [{
                    rowIndex: 1, name: 'yAxis1',
                    stripLines: [{ start: 30, color: '#663AB6', text: 'Row Definition Stripline', size: 30 }],
                }, {
                    columnIndex: 1, name: 'xAxis1',
                    stripLines: [{ start: 20, color: '#663AB6', text: 'Column Definition Stripline', size: 15 }],
                }],
                series: [
                    {
                        name: 'series1', type: 'Line', fill: '#ACE5FF', width: 2, xAxisName: 'xAxis1', xName: 'x', yName: 'y',
                        animation: { enable: false },
                        dataSource: [{ x: 10, y: 124 }, { x: 20, y: 120 }, { x: 30, y: 115 }, { x: 40, y: 147 }, { x: 50, y: 122 }]
                    },
                    {
                        name: 'series2', type: 'Line', fill: 'red', width: 2, yAxisName: 'yAxis1', xName: 'x', yName: 'y',
                        animation: { enable: false },
                        dataSource: [{ x: 10, y: 24 }, { x: 20, y: 20 }, { x: 30, y: 55 }, { x: 40, y: 47 }, { x: 50, y: 72 }]
                    }],
            });


        });
        afterAll((): void => {

            chart.destroy();
            document.getElementById(id).remove();
        });
        it('Location y and Height', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let height: number = parseInt(stripLineElement.getAttribute('height'), 10);
                expect(height == 34 || height == 36).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 56 || y == 58).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#' + id);
        });
        it('Location x and Width', (done: Function) => {
            stripLineElement = document.getElementById(stripLineId + '_Behind_rect_1');
            let width: number = parseInt(stripLineElement.getAttribute('width'), 10);
            expect(width == 103 || width == 105).toBe(true);
            let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
            expect(x == 382 || x == 379).toBe(true);
            done();
        });
        it('text content', (done: Function) => {
            stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
            expect(stripLineElement.textContent).toEqual('Row Definition Stripline');
            stripLineElement = document.getElementById(stripLineId + '_Behind_text_1');
            expect(stripLineElement.textContent).toEqual('Column Definition Stripline');
            done();
        });
        it('Middle horizontalAlignment and Middle verticalAlignment', (done: Function) => {
            stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
            let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
            expect(x == 326 || x == 324).toBe(true);
            let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
            expect(y == 74 || y == 77).toBe(true);
            stripLineElement = document.getElementById(stripLineId + '_Behind_text_1');
            x = parseInt(stripLineElement.getAttribute('x'), 10);
            expect(x == 434 || x == 432).toBe(true);
            y = parseInt(stripLineElement.getAttribute('y'), 10);
            expect(y == 157 || y == 160).toBe(true);
            done();
        });
        it('Start horizontalAlignment and Start verticalAlignment', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
                expect(stripLineElement.getAttribute('text-anchor') === 'Start').toBe(true);
                let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 68 || x == 64).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 68 || y == 69).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_1');
                expect(stripLineElement.getAttribute('text-anchor') === 'Start').toBe(true);
                x = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 393 || x == 390).toBe(true);
                expect(parseInt(stripLineElement.getAttribute('y'), 10)).toEqual(15);
                done();
            };
            chart.axes[0].stripLines[0].horizontalAlignment = 'Start';
            chart.axes[0].stripLines[0].verticalAlignment = 'Start';
            chart.axes[1].stripLines[0].horizontalAlignment = 'Start';
            chart.axes[1].stripLines[0].verticalAlignment = 'Start';
            chart.loaded = loaded;
            chart.refresh();

        });
        it('Start horizontalAlignment and Middle verticalAlignment', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 68 || x == 64).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 74 || y == 77).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_1');
                x = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 393 || x == 390).toBe(true);
                y = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 157 || y == 160).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.axes[0].stripLines[0].verticalAlignment = 'Middle';
            chart.axes[1].stripLines[0].verticalAlignment = 'Middle';
            chart.refresh();

        });
        it('Start horizontalAlignment and End verticalAlignment', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 68 || x == 64).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 80 || y == 84).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_1');
                x = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 393 || x == 390).toBe(true);
                y = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 300 || y == 305).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.axes[0].stripLines[0].verticalAlignment = 'End';
            chart.axes[1].stripLines[0].verticalAlignment = 'End';
            chart.refresh();

        });
        it('Middle horizontalAlignment and End verticalAlignment', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 326 || x == 324).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 80 || y == 84).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_1');
                x = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 434 || x == 432).toBe(true);
                y = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 300 || y == 305).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.axes[0].stripLines[0].horizontalAlignment = 'Middle';
            chart.axes[1].stripLines[0].horizontalAlignment = 'Middle';
            chart.refresh();

        });
        it('Middle horizontalAlignment and Start verticalAlignment', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 326 || x == 324).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 68 || y == 69).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_1');
                x = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 434 || x == 432).toBe(true);
                expect(parseInt(stripLineElement.getAttribute('y'), 10)).toEqual(15);
                done();
            };
            chart.loaded = loaded;
            chart.axes[0].stripLines[0].verticalAlignment = 'Start';
            chart.axes[1].stripLines[0].verticalAlignment = 'Start';
            chart.refresh();

        });
        it('End horizontalAlignment and Start verticalAlignment', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
                expect(parseInt(stripLineElement.getAttribute('x'), 10)).toEqual(585);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 68 || y == 69).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_1');
                let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 475 || x == 474).toBe(true);
                expect(parseInt(stripLineElement.getAttribute('y'), 10)).toEqual(15);
                done();
            };
            chart.loaded = loaded;
            chart.axes[0].stripLines[0].horizontalAlignment = 'End';
            chart.axes[1].stripLines[0].horizontalAlignment = 'End';
            chart.refresh();

        });
        it('End horizontalAlignment and Middle verticalAlignment', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
                expect(parseInt(stripLineElement.getAttribute('x'), 10)).toEqual(585);
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 585).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_1');
                x = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 475 || x == 474).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y == 157 || y == 160).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.axes[0].stripLines[0].verticalAlignment = 'Middle';
            chart.axes[1].stripLines[0].verticalAlignment = 'Middle';
            chart.refresh();

        });
        it('End horizontalAlignment and End verticalAlignment', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
                expect(parseInt(stripLineElement.getAttribute('x'), 10)).toEqual(585);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 80 || y == 84).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_1');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 475 || x == 474).toBe(true);
                y = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 300 || y == 305).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.axes[0].stripLines[0].verticalAlignment = 'End';
            chart.axes[1].stripLines[0].verticalAlignment = 'End';
            chart.refresh();

        });
        it('Text Rotation', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
                expect(stripLineElement.getAttribute('transform').indexOf('rotate(-30') > -1).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_1');
                expect(stripLineElement.getAttribute('transform').indexOf('rotate(60') > -1).toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.axes[0].stripLines[0].rotation = -30;
            chart.axes[1].stripLines[0].rotation = 60;
            chart.refresh();

        });
        it('Category Value', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Over_text_0');
                expect(stripLineElement.textContent).toEqual('Category Axis Over');
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
                expect(stripLineElement.textContent).toEqual('Category Axis Behind');
                done();
            };
            chart.axes = [];
            chart.primaryXAxis = {
                labelPlacement: 'OnTicks', valueType: 'Category',
                stripLines: [
                    {
                        startFromAxis: true, start: 2, size: 3,
                        opacity: 0.5, color: 'red', text: 'Category Axis Behind'
                    },
                    {
                        start: 4, end: 6, opacity: 0.3,
                        color: 'blue', text: 'Category Axis Over', zIndex: 'Over'
                    }]
            };
            chart.series = [
                {
                    name: 'series1', type: 'Line', fill: '#ACE5FF', width: 2, animation: { enable: false },
                    dataSource: data2, xName: 'x', yName: 'y'
                }];
            chart.loaded = loaded;
            chart.refresh();

        });
        it('Date Time Value', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Over_text_0');
                expect(stripLineElement.textContent).toEqual('Date time Axis Over');
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
                expect(stripLineElement.textContent).toEqual('Date time Axis Behind');
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis = {
                minimum: new Date(2000, 6, 1), maximum: new Date(2010, 6, 1), interval: 1,
                intervalType: 'Years', valueType: 'DateTime',
                stripLines: [
                    {
                        start: new Date(2001, 6, 1), size: 90000000009,
                        opacity: 0.5, color: 'red',
                        text: 'Date time Axis Behind'
                    },
                    {
                        start: new Date(2005, 0, 1), end: new Date(2007, 0, 1),
                        opacity: 0.3, color: 'blue', textStyle: { color: '#ffffff' },
                        text: 'Date time Axis Over', zIndex: 'Over'
                    }]
            };
            chart.series = [
                {
                    name: 'series1', type: 'Line', fill: '#ACE5FF', width: 2, animation: { enable: false },
                    dataSource: data1, xName: 'x', yName: 'y'
                }];
            chart.refresh();

        });
        it('Logarithmic Value', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Over_text_0');
                expect(stripLineElement.textContent).toEqual('Logarithmic Axis Over');
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_0');
                expect(stripLineElement.textContent).toEqual('Logarithmic Axis Behind');
                done();
            };
            chart.loaded = loaded;
            chart.primaryXAxis.stripLines = [];
            chart.primaryYAxis = {
                valueType: 'Logarithmic',
                stripLines: [
                    {
                        start: 10, size: 50,
                        opacity: 0.5, color: 'red',
                        text: 'Logarithmic Axis Behind'
                    },
                    {
                        start: 80, end: 100,
                        opacity: 0.3, color: 'blue', textStyle: { color: '#ffffff' },
                        text: 'Logarithmic Axis Over', zIndex: 'Over'
                    }]
            };
            chart.refresh();

        });
    });

    describe('Stripline checking with rows and columns', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            ele.style.background = 'transparent';
            document.body.appendChild(ele);
            chart = new Chart({
                primaryXAxis: {
                    valueType: 'Category',
                    title: '1stxAxis',
                   
                },
                primaryYAxis: {
                    minimum: 10, maximum: 40, interval: 5, title: '1styAxis',
                },
                rows: [
                    { height: '50%', border: { color: 'black' } },
                    { height: '50%', border: { color: 'red' } },
                ],
                columns: [
                    { width: '50%', border: { color: 'black' } },
                    { width: '50%', border: { color: 'red' } },
                ],
                axes: [{ name: '2ndyAxis', rowIndex: 1, title: '2ndyAxis' },
                {
                    name: 'xAxis',
                    columnIndex: 1,
                    title: '2ndxAxis',
                    valueType: 'Category',
                    
                }
                ],
            
            series: [
                {
                    dataSource: [
                        { x: 'Sun', y: 25 }, { x: 'Mon', y: 27 }, { x: 'Tue', y: 33 }, { x: 'Wed', y: 36 },
                        { x: 'Thu', y: 26 }, { x: 'Fri', y: 27.5 }, { x: 'Sat', y: 23 }
                    ],
                    xName: 'x', width: 2, yName: 'y', fill: 'red', type: 'Line', name: 'Weather',
                    marker: { visible: true, width: 10, height: 10, border: { width: 2, color: '#ffffff' }, fill: '#666666' },
                },
                {
                    dataSource: [
                        { x: 'Sun', y: 25 }, { x: 'Mon', y: 27 }, { x: 'Tue', y: 33 }, { x: 'Wed', y: 36 },
                        { x: 'Thu', y: 26 }, { x: 'Fri', y: 27.5 }, { x: 'Sat', y: 23 }
                    ],
                    xName: 'x', width: 2, yName: 'y', fill: 'red', type: 'Line', name: 'Weather', xAxisName: 'xAxis',
                    marker: { visible: true, width: 10, height: 10, border: { width: 2, color: '#ffffff' }, fill: '#666666' },
                },
                {
                    dataSource: [
                        { x: 'Sun', y: 25 }, { x: 'Mon', y: 27 }, { x: 'Tue', y: 33 }, { x: 'Wed', y: 36 },
                        { x: 'Thu', y: 26 }, { x: 'Fri', y: 27.5 }, { x: 'Sat', y: 23 }
                    ],
                    xName: 'x', width: 2, yName: 'y', fill: 'red', type: 'Line', name: 'Weather', yAxisName: '2ndyAxis',
                    marker: { visible: true, width: 10, height: 10, border: { width: 2, color: '#ffffff' }, fill: '#666666' },
                },
            ],
        }, ele);
        });
        afterAll((): void => {
            chart.destroy();
            document.getElementById(id).remove();
        });

        it('Default segmentAxisName checking', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 479 || x == 481).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'));
                expect(y == 240 || y == 243).toBe(true)
                let width: number = parseInt(stripLineElement.getAttribute('width'));
                expect(width == 49 || width == 50).toBe(true)
                let height: number = parseInt(stripLineElement.getAttribute('height'));
                expect(height == 57 || height == 58).toBe(true)
                done();
            };
            chart.axes[1].stripLines = [
                
                    {
                        start: 1, end: 2,
                        isSegmented: true,
                        segmentStart: 20,
                        segmentEnd: 30,
                    },
            
            ];
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Zooming checking', (done: Function) => {
            loaded = () => {
                let column1: Element = document.getElementById(id + '_AxisBottom_Column1');
                let columnX: number = parseInt(column1.getAttribute('x1'));
               
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_2');
               
                expect(parseInt(stripLineElement.getAttribute('x')) <= columnX).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_3');
                
                expect(parseInt(stripLineElement.getAttribute('x')) >= columnX).toBe(true);
                done();
            };
            chart.primaryXAxis.zoomFactor = 0.9;
            chart.primaryXAxis.zoomPosition = 0.5;
            chart.primaryXAxis.stripLines = [{
                start: 1,
                size: 1,
                isRepeat: true,
                repeatEvery: 2,
                opacity: 0.2
            }];
            chart.axes[1].zoomFactor = 0.9;
            chart.axes[1].zoomPosition = 0.5;
            chart.axes[1].stripLines = [{

                start: -10,
                size: 1,
                isRepeat: true,
                repeatEvery: 2,
                opacity: 0.2
            }];
            chart.loaded = loaded;
            chart.refresh();
        });
    });
});