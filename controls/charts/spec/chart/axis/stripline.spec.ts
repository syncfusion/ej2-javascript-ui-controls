/**
 * Stripline Spec 
 */
import { EmitType } from '@syncfusion/ej2-base';
import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { ILoadedEventArgs } from '../../../src/chart/model/chart-interface';
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
import { secureRandom, unbindResizeEvents } from '../base/data.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile } from '../../common.spec';
Chart.Inject(LineSeries, AreaSeries, Legend, StripLine, DateTime, Category, Logarithmic, DateTimeCategory);
let i: number; let data: Points[] = []; let seriesCollection: SeriesModel[] = [];
for (let j: number = 0; j < 5; j++) {
    for (i = 0; i < 10; i++) {
        data.push({ x: i, y: secureRandom() * 100 });
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
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
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
                loaded: loaded,
                enableAnimation: false
            });

        });
        afterAll((): void => {
            chart.destroy();
            document.getElementById(id).remove();
        });
        it('Stripline visible false', (done: Function) => {
            loaded = () => {
                let element: Element = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis' + '_0');
                expect(element).toBe(null);
                element = document.getElementById(stripLineId + '_Over_rect_' + 'primaryXAxis' + '_0');
                expect(element).toBe(null);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#' + id);
        });
        it(' XAxis Stripline', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Over_rect_' + 'primaryXAxis' + '_0');
                expect(stripLineElement).not.toEqual(null);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis' + '_0');
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
                stripLineElement = document.getElementById(stripLineId + '_Over_rect_' + 'primaryYAxis' + '_0');
                expect(stripLineElement).not.toEqual(null);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryYAxis' + '_0');
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis' + '_0');
                let direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 207.58333333333331 10.25 L 207.58333333333331 309.5' ||
                    direction === 'M 206.8611111111111 10.25 L 206.8611111111111 310.5').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '1');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 472.3333333333333 10.25 L 472.3333333333333 309.5' ||
                    direction === 'M 472.1111111111111 10.25 L 472.1111111111111 310.5').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryYAxis_' + '0');
                let direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 60.5 202.625 L 590 202.625' || direction === 'M 59.5 203.26785714285714 L 590 203.26785714285714').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryYAxis_' + '1');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 60.5 127.81249999999999 L 590 127.81249999999999' ||
                    direction === 'M 59.5 128.20535714285714 L 590 128.20535714285714').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryYAxis_' + '0');
                let dasharray: string = stripLineElement.getAttribute("stroke-dasharray");
                expect(dasharray).toEqual("null");
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryYAxis_' + '1');
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

                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryYAxis_' + '0');
                const d: string = stripLineElement.getAttribute('height');
                expect(d === null).toBe(true);
                const dashArray: string = stripLineElement.getAttribute('stroke-dasharray');
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                expect(stripLineElement.getAttribute('fill')).toEqual('none');
                expect(stripLineElement.getAttribute('stroke')).toEqual('#663AB6');
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                let temp: string = stripLineElement.getAttribute('d');
                expect(temp === 'M 384.08333333333337 10.25 L 384.08333333333337 309.5' ||
                    temp === 'M 383.69444444444446 10.25 L 383.69444444444446 310.5').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryYAxis_' + '0');
                temp = stripLineElement.getAttribute('d');
                expect(temp === 'M 60.5 138.50000000000003 L 590 138.50000000000003' ||
                    temp === 'M 59.5 138.92857142857144 L 590 138.92857142857144').toBe(true);
                done();
            };
            chart.primaryYAxis.isInversed = true;
            chart.primaryXAxis.isInversed = true;
            chart.primaryYAxis.stripLines = [{
                start: 30,
                end: 50
            }];

            chart.loaded = loaded;
            chart.refresh();

        });
        it(' XAxis Stripline with image', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Over_rect_' + 'primaryXAxis' + '_0');
                expect(stripLineElement).not.toEqual(null);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis' + '_0');
                expect(stripLineElement).not.toEqual(null);
                done();
            };
            chart.primaryXAxis.stripLines = [
                {
                    startFromAxis: false, start: 1, size: 4, imageUrl: 'base/spec/img/img1.jpg',
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_path_' + 'primaryXAxis_' + '0');
                expect(stripLineElement.getAttribute("stroke-width")).toEqual('1');
                expect(stripLineElement.getAttribute("d")).not.toEqual(null);
                let height: number = stripLineElement.getBoundingClientRect().height;
                expect(height == 333 || height == 336).toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_path_' + 'primaryXAxis_' + '0');
                let height: number = stripLineElement.getBoundingClientRect().height;
                expect(height == 333 || height == 336).toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                const d: string = stripLineElement.getAttribute('d');
                expect(d === 'M 134.16191236878137 43.5 L 134.16191236878137 380.5' ||
                    d === 'M 93.84744408945687 44.5 L 93.84744408945687 380.5').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 41.13429940666362 43.5 L 41.13429940666362 380.5' ||
                    direction === 'M 38.62539936102237 44.5 L 38.62539936102237 380.5').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 40.85577361935189 43.5 L 40.85577361935189 380.5' ||
                    direction === 'M 38.460063897763575 44.5 L 38.460063897763575 380.5').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 40.85577361935189 43.5 L 40.85577361935189 380.5' ||
                    direction === 'M 38.460063897763575 44.5 L 38.460063897763575 380.5').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 40.85577361935189 43.5 L 40.85577361935189 380.5' ||
                    direction === 'M 38.460063897763575 44.5 L 38.460063897763575 380.5').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 40.85577361935189 43.5 L 40.85577361935189 380.5' ||
                    direction === 'M 38.460063897763575 44.5 L 38.460063897763575 380.5').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 117.17183934276585 43.5 L 117.17183934276585 380.5' ||
                    direction === 'M 134.02396166134184 44.5 L 134.02396166134184 380.5').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                let direction: string = stripLineElement.getAttribute('d');
                expect( direction === 'M 64.64473684210526 43.25 L 64.64473684210526 381.5' || direction === 'M 51.618421052631575 43.25 L 51.618421052631575 381.5' ).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '1');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 193.2236842105263 43.25 L 193.2236842105263 381.5' || direction === 'M 128.0921052631579 43.25 L 128.0921052631579 381.5').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '2');
                direction = stripLineElement.getAttribute('d');
                expect( direction === 'M 321.80263157894734 43.25 L 321.80263157894734 381.5' || direction === 'M 204.56578947368422 43.25 L 204.56578947368422 381.5' ).toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                let direction : string = stripLineElement.getAttribute('d');
                expect(direction === 'M 83.39583333333333 43.25 L 83.39583333333333 381.5' || direction === 'M 62.77083333333333 43.25 L 62.77083333333333 381.5').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '1');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 286.97916666666663 43.25 L 286.97916666666663 381.5'|| direction === 'M 183.85416666666666 43.25 L 183.85416666666666 381.5' ).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '2');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 490.5625 43.25 L 490.5625 381.5' || direction === 'M 304.9375 43.25 L 304.9375 381.5' ).toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                expect(stripLineElement !== null).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '1');
                expect(stripLineElement !== null).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '2');
                expect(stripLineElement !== null).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '3');
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
                }
            }];
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                expect(stripLineElement !== null).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '1');
                expect(stripLineElement === null).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '2');
                expect(stripLineElement === null).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '3');
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
                }
            }];
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                let direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 134.24520766773162 43.25 L 134.24520766773162 381.5' || direction === 'M 93.01403468735737 43.25 L 93.01403468735737 381.5').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '1');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 541.2260383386581 43.25 L 541.2260383386581 381.5' || direction === 'M 335.07017343678683 43.25 L 335.07017343678683 381.5').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '2');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 948.7643769968051 43.25 L 948.7643769968051 381.5' || direction === 'M 577.4578959379279 43.25 L 577.4578959379279 381.5').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                let direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 93.57499999999999 43.25 L 93.57499999999999 381.5' || direction === 'M 68.82499999999999 43.25 L 68.82499999999999 381.5' ).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '1');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 398.95 43.25 L 398.95 381.5' || direction === 'M 250.45 43.25 L 250.45 381.5').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '2');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 704.325 43.25 L 704.325 381.5' || direction === 'M 432.07500000000005 43.25 L 432.07500000000005 381.5').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                let direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 52.36666666666667 67.75 L 52.36666666666667 381.5' || direction === 'M 44.11666666666667 68.75 L 44.11666666666667 381.5').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '1');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 154.2 67.75 L 154.2 381.5' || direction === 'M 104.69999999999999 68.75 L 104.69999999999999 381.5').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '2');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 256.0333333333333 67.75 L 256.0333333333333 381.5' || direction === 'M 165.28333333333333 68.75 L 165.28333333333333 381.5').toBe(true);
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
            ];
            chart.primaryXAxis = {
                valueType: "Category"
            };
            chart.primaryYAxis = {
                lineStyle: { width: 0 }, majorGridLines: { width: 0 }
            };
            chart.axes = [{
                valueType: "Category",
                rowIndex: 0, opposedPosition: true,
                name: 'xAxis',
                stripLines: [{ startFromAxis: true, size: 0.5, isRepeat: true, repeatEvery: 1, color: "yellow" }]

            }];
            chart.loaded = loaded;
            chart.refresh();
        });

        it('Vertical Recurrence for Numeric Axis', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                let direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 38.11 53.75 L 38.11 414.5' || direction === 'M 35.635 53.75 L 35.635 413.5').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '1');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 68.66 53.75 L 68.66 414.5' || direction === 'M 53.809999999999995 53.75 L 53.809999999999995 413.5').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '2');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 99.21 53.75 L 99.21 414.5' || direction === 'M 71.98499999999999 53.75 L 71.98499999999999 413.5').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                let direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 81.86666666666667 53.75 L 81.86666666666667 414.5' || direction === 'M 73.61666666666667 53.75 L 73.61666666666667 413.5').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '1');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 181.2 53.75 L 181.2 414.5' || direction === 'M 131.7 53.75 L 131.7 413.5').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '2');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 280.5333333333333 53.75 L 280.5333333333333 414.5' || direction === 'M 189.78333333333333 53.75 L 189.78333333333333 413.5').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryYAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 161.07894736842104 291.4166666666667 L 353.9473684210526 291.4166666666667' ||
                direction === 'M 108.97368421052632 290.75 L 223.68421052631578 290.75').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryYAxis_' + '0');
                let direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 745.0416666666667 353.4583333333333 L 948.625 353.4583333333333' ||
                    direction === 'M 456.2916666666667 352.625 L 577.375 352.625').toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryYAxis_' + '1');
                direction = stripLineElement.getAttribute('d');
                expect(direction === 'M 337.875 403.0916666666667 L 541.4583333333334 403.0916666666667' || direction === 'M 214.125 402.125 L 335.20833333333337 402.125').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 439.6666666666667 43.25 L 439.6666666666667 415.5' || direction === 'M 274.6666666666667 43.25 L 274.6666666666667 414.5').toBe(true);
                done();
            };
            chart.primaryXAxis = {
                valueType: 'Category',
                stripLines: [
                    {
                        start: 1, end: 2, color: 'black', opacity: 0.2, isSegmented: true
                    }
                ]
            };
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryYAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 439.4808306709265 182.84375 L 1050.5095846645368 182.84375' ||
                    direction === 'M 274.55613874942946 182.46875 L 637.9719306252853 182.46875').toBe(true);
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

                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 643.2500028275463 129.08333333333331 L 643.2500028275463 214.91666666666663' ||
                    direction === 'M 395.75000168171294 125.75 L 395.75000168171294 208.25').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 658.2500006895256 120.5 L 658.2500006895256 275' || direction === 'M 410.75000040306713 117.5 L 410.75000040306713 266').toBe(true);
                done();
            };
            chart.primaryXAxis = {
                stripLines: [{
                    start: 2.5, end: 3.5, isSegmented: true, segmentStart: 3, segmentEnd: 5, color: "red",
                }]
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

                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 635.0000017259838 214.91666666666666 L 635.0000017259838 322.2083333333333' ||
                    direction === 'M 387.50000100983794 208.25 L 387.50000100983794 311.375').toBe(true);
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

                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryYAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 453.09999999999997 181.49004124019885 L 593.3 181.49004124019885' || direction === 'M 663.4000000000001 43.25 L 663.4000000000001 77.00000000000001').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 152.10000000000002 43.25 L 152.10000000000002 415.5' || direction === 'M 102.60000000000001 43.25 L 102.60000000000001 414.5').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'yAxis1_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 82.5 75.8375 L 590 75.8375' || direction === 'M 80.5 76.3875 L 590 76.3875').toBe(true);
                done();
            };
            chart.loaded = loaded;
            chart.appendTo('#' + id);
        });
        it('Location x and Width', (done: Function) => {
            stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'xAxis1_' + '0');
            const direction: string = stripLineElement.getAttribute('d');
            expect(direction === 'M 445.15625 10.25 L 445.15625 309.5' || direction === 'M 444.03125 10.25 L 444.03125 310.5').toBe(true);
            done();
        });
        it('text content', (done: Function) => {
            stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'yAxis1_' + '0');
            expect(stripLineElement.textContent).toEqual('Row Definition Stripline');
            stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'xAxis1_' + '0');
            expect(stripLineElement.textContent).toEqual('Column Definition Stripline');
            done();
        });
        it('Middle horizontalAlignment and Middle verticalAlignment', (done: Function) => {
            stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'yAxis1_' + '0');
            let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
            expect(x == 326 || x == 335).toBe(true);
            let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
            expect(y == 74 || y == 77).toBe(true);
            stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'xAxis1_' + '0');
            x = parseInt(stripLineElement.getAttribute('x'), 10);
            expect(x == 434 || x == 444).toBe(true);
            y = parseInt(stripLineElement.getAttribute('y'), 10);
            expect(y == 157 || y == 160).toBe(true);
            done();
        });
        it('Start horizontalAlignment and Start verticalAlignment', (done: Function) => {
            loaded = () => {
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'yAxis1_' + '0');
                expect(stripLineElement.getAttribute('text-anchor') === 'Start').toBe(true);
                let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 68 || x == 85).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 68 || y == 69).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'xAxis1_' + '0');
                expect(stripLineElement.getAttribute('text-anchor') === 'End').toBe(true);
                x = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 393 || x == 406).toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'yAxis1_' + '0');
                let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 68 || x == 85).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 74 || y == 77).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'xAxis1_' + '0');
                x = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 393 || x == 406).toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'yAxis1_' + '0');
                let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 68 || x == 85).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 80 || y == 84).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'xAxis1_' + '0');
                x = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 393 || x == 406).toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'yAxis1_' + '0');
                let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 326 || x == 335).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 80 || y == 84).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'xAxis1_' + '0');
                x = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 434 || x == 444).toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'yAxis1_' + '0');
                let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 326 || x == 335).toBe(true);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 68 || y == 69).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'xAxis1_' + '0');
                x = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 444 || x == 432).toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'yAxis1_' + '0');
                expect(parseInt(stripLineElement.getAttribute('x'), 10)).toEqual(585);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 68 || y == 69).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'xAxis1_' + '0');
                let x: number = parseInt(stripLineElement.getAttribute('x'), 10);
                expect(x == 475 || x == 482).toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'yAxis1_' + '0');
                expect(parseInt(stripLineElement.getAttribute('x'), 10)).toEqual(585);
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 585).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'xAxis1_' + '0');
                x = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 475 || x == 482).toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'yAxis1_' + '0');
                expect(parseInt(stripLineElement.getAttribute('x'), 10)).toEqual(585);
                let y: number = parseInt(stripLineElement.getAttribute('y'), 10);
                expect(y == 80 || y == 84).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'xAxis1_' + '0');
                let x: number = parseInt(stripLineElement.getAttribute('x'));
                expect(x == 475 || x == 482).toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'yAxis1_' + '0');
                expect(stripLineElement.getAttribute('transform').indexOf('rotate(-30') > -1).toBe(true);
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'xAxis1_' + '0');
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
                stripLineElement = document.getElementById(stripLineId + '_Over_text_' + 'primaryXAxis_' + '0');
                expect(stripLineElement.textContent).toEqual('Category Axis Over');
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'primaryXAxis_' + '0');
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
                stripLineElement = document.getElementById(stripLineId + '_Over_text_' + 'primaryXAxis_' + '0');
                expect(stripLineElement.textContent).toEqual('Date time Axis Over');
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'primaryXAxis_' + '0');
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
                stripLineElement = document.getElementById(stripLineId + '_Over_text_' + 'primaryYAxis_' + '0');
                expect(stripLineElement.textContent).toEqual('Logarithmic Axis Over');
                stripLineElement = document.getElementById(stripLineId + '_Behind_text_' + 'primaryYAxis_' + '0');
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'xAxis_' + '0');
                const direction: string = stripLineElement.getAttribute('d');
                expect(direction === 'M 825.6071428571429 243.08333333333334 L 825.6071428571429 301.2916666666667' ||
                    direction === 'M 507.0357142857143 243.75 L 507.0357142857143 302.125').toBe(true);
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
                stripLineElement = document.getElementById(stripLineId + '_Behind_rect_' + 'primaryXAxis_' + '2');
                expect(stripLineElement.getAttribute('d') !== null).toBe(true);
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
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});
