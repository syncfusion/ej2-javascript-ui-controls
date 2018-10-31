/**
 * Multi Colored Line and Area Series Spec
 */
import { createElement, SvgRenderer, EmitType, debounce } from '@syncfusion/ej2-base';
import { MultiColoredLineSeries, ILoadedEventArgs, DateTime, Category, IAnimationCompleteEventArgs } from '../../../src/index';
import { MultiColoredAreaSeries, Legend, Series, Points, Chart, getElement } from '../../../src/index';
Chart.Inject(DateTime, Category, MultiColoredLineSeries, MultiColoredAreaSeries, Legend);

export interface series1 {
    series: Series;
}

let colors: string[] = ["red", "green", "fuchsia", "crimson", "blue", null, "deepskyblue", "mediumvioletred", "violet", "peru", "gray", "deeppink", "navy"];
let fill: string[] = ["red", "red", "red", "red", "blue", null, "blue", "blue", "blue", "peru", "peru", "deeppink", "navy"];
let numericData: number[] = [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 4.1, 95.6, 54.4];
let emptyData: number[] = [29.9, 71.5, 106.4, null, 144.0, 176.0, null, 148.5, 216.4, null, 95.6, 54.4];
let categoryData: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
let dataTimeData: Date[] = [
    new Date(1998, 11, 11), new Date(1998, 12, 12),
    new Date(1998, 13, 13), new Date(1998, 14, 14),
    new Date(1998, 15, 15), new Date(1998, 16, 16),
    new Date(1998, 17, 17), new Date(1998, 18, 18),
    new Date(1998, 19, 19), new Date(1998, 20, 20),
    new Date(1998, 21, 21), new Date(1998, 22, 22)
];

function getData(interiors: string[], values?: any, isEmpty?: boolean): Object[] {
    let series1: Object[] = [];
    for (var i = 0; i < 12; i++) {
        var point = {
            XValue: values ? values[i] : i,
            YValue: isEmpty ? emptyData[i] : numericData[i], color: interiors[i % 16]
        };
        series1.push(point);
    }
    return series1;
}

describe('Chart Control Multi Colored Series', () => {
    /**
     * Multi Colored Line
     */
    describe('Multi Colored Line series - Point color mapping', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        let chartElement: Element;
        chartElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(chartElement);
            chartObj = new Chart(
                {
                    series: [{
                        animation: { enable: false },
                        dataSource: getData(colors),
                        pointColorMapping: 'color',
                        width: 3,
                        xName: 'XValue', yName: 'YValue', name: 'India',
                        fill: '#E94649', type: 'MultiColoredLine',
                        marker: { visible: true, width: 10, height: 10 }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: true }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
        });

        it('Checking the child Element count', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(12)
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking Point Color with null', () => {
            let color: string;
            for (let i: number = 0; i < 11; i++) {
                element = getElement('container_Series_0_Point_' + i);
                color = colors[i] ? colors[i] : '#E94649';
                expect(element.getAttribute('stroke')).toBe(color);
            }
        });

        it('Checking Point Color - marker', () => {
            let color: string;
            for (let i: number = 0; i < 12; i++) {
                element = getElement('container_Series_0_Point_' + i + '_Symbol');
                color = colors[i] ? colors[i] : '#E94649';
                expect(element.getAttribute('stroke')).toBe(color);
                expect(element.getAttribute('fill')).toBe('#ffffff');
            }
        });

        it('Checking the child Element count - Same Interior', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(6)
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = getData(fill);
            chartObj.refresh();
        });

        it('Checking Point Color with null  - Same Interior', () => {
            element = getElement('container_Series_0_Point_3');
            expect(element.getAttribute('stroke')).toBe('red');
            element = getElement('container_Series_0_Point_4');
            expect(element.getAttribute('stroke')).toBe('blue');
            element = getElement('container_Series_0_Point_5');
            expect(element.getAttribute('stroke')).toBe('#E94649');
            element = getElement('container_Series_0_Point_8');
            expect(element.getAttribute('stroke')).toBe('blue');
            element = getElement('container_Series_0_Point_10');
            expect(element.getAttribute('stroke')).toBe('peru');
        });

        it('Checking Point Color - marker  - Same Interior', () => {
            let color: string;
            for (let i: number = 0; i < 12; i++) {
                element = getElement('container_Series_0_Point_' + i + '_Symbol');
                color = fill[i] ? fill[i] : '#E94649';
                expect(element.getAttribute('stroke')).toBe(color);
                expect(element.getAttribute('fill')).toBe('#ffffff');
            }
        });
    });
    /**
    * Multi Colored Area
    */
    describe('Multi Colored Area series - Point color mapping', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        let chartElement: Element;
        chartElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(chartElement);
            chartObj = new Chart(
                {
                    series: [{
                        animation: { enable: false },
                        dataSource: getData(colors),
                        pointColorMapping: 'color',
                        width: 3,
                        xName: 'XValue', yName: 'YValue', name: 'India',
                        fill: '#E94649', type: 'MultiColoredArea',
                        marker: { visible: true, width: 10, height: 10 }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: true }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
        });
        it('Checking the child Element count', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(12)
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking Point Color with null', () => {
            let color: string;
            for (let i: number = 0; i < 11; i++) {
                element = getElement('container_Series_0_Point_' + i);
                color = colors[i] ? colors[i] : '#E94649';
                expect(element.getAttribute('fill')).toBe(color);
            }
        });

        it('Checking Point Color - marker', () => {
            let color: string;
            for (let i: number = 0; i < 12; i++) {
                element = getElement('container_Series_0_Point_' + i + '_Symbol');
                color = colors[i] ? colors[i] : '#E94649';
                expect(element.getAttribute('stroke')).toBe(color);
                expect(element.getAttribute('fill')).toBe('#ffffff');
            }
        });

        it('Checking the child Element count - Same Interior', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(6)
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].dataSource = getData(fill);
            chartObj.refresh();
        });

        it('Checking Point Color with null  - Same Interior', () => {
            element = getElement('container_Series_0_Point_3');
            expect(element.getAttribute('fill')).toBe('red');
            element = getElement('container_Series_0_Point_4');
            expect(element.getAttribute('fill')).toBe('blue');
            element = getElement('container_Series_0_Point_5');
            expect(element.getAttribute('fill')).toBe('#E94649');
            element = getElement('container_Series_0_Point_8');
            expect(element.getAttribute('fill')).toBe('blue');
            element = getElement('container_Series_0_Point_10');
            expect(element.getAttribute('fill')).toBe('peru');
        });

        it('Checking Point Color - marker  - Same Interior', () => {
            let color: string;
            for (let i: number = 0; i < 12; i++) {
                element = getElement('container_Series_0_Point_' + i + '_Symbol');
                color = fill[i] ? fill[i] : '#E94649';
                expect(element.getAttribute('stroke')).toBe(color);
                expect(element.getAttribute('fill')).toBe('#ffffff');
            }
        });
    });

    /**
     * Multi Colored Line Segments
     */
    describe('Line series Segments', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        let chartElement: Element;
        chartElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(chartElement);
            chartObj = new Chart(
                {
                    series: [{
                        animation: { enable: false },
                        dataSource: getData(colors),
                        segments: [{
                            color: 'orange',
                            value: 50
                        }, {
                            color: 'teal',
                            value: 100
                        }, {
                            color: 'yellow',
                            value: 150
                        }],
                        segmentAxis: 'Y',
                        pointColorMapping: 'color',
                        width: 3,
                        xName: 'XValue', yName: 'YValue', name: 'India',
                        fill: '#E94649', type: 'MultiColoredLine',
                        marker: { visible: true, width: 10, height: 10 }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: true }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
        });

        it('Checking the child Element count', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(12);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking segment without point color mapping', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(9);
                element = getElement('container_Series_0_Segment_3');
                expect(element.getAttribute('stroke')).toBe('#E94649');
                element = getElement('container_Series_0_Segment_0');
                expect(element.getAttribute('stroke')).toBe('orange');
                element = getElement('container_Series_0_Segment_1');
                expect(element.getAttribute('stroke')).toBe('teal');
                element = getElement('container_Series_0_Segment_2');
                expect(element.getAttribute('stroke')).toBe('yellow');
                done();
            };
            chartObj.series[0].pointColorMapping = '';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking segment - X Segment', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(5);
                element = getElement('container_Series_0_Segment_0');
                expect(element.getAttribute('stroke')).toBe('orange');
                element = getElement('container_Series_0_Segment_1');
                expect(element.getAttribute('stroke')).toBe('teal');
                done();
            };
            chartObj.series[0].segments = [{
                color: 'orange',
                value: 5
            }, {
                color: 'teal'
            }],
                chartObj.series[0].segmentAxis = 'X';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });

    /**
     * Multi Colored Area Segments
     */
    describe('Area series Segments', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        let chartElement: Element;
        chartElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(chartElement);
            chartObj = new Chart(
                {
                    series: [{
                        animation: { enable: false },
                        dataSource: getData(colors),
                        segments: [{
                            color: 'orange',
                            value: 50
                        }, {
                            color: 'teal',
                            value: 100
                        }, {
                            color: 'yellow',
                            value: 150
                        }],
                        segmentAxis: 'Y',
                        pointColorMapping: 'color',
                        width: 3,
                        xName: 'XValue', yName: 'YValue', name: 'India',
                        fill: '#E94649', type: 'MultiColoredArea',
                        marker: { visible: true, width: 10, height: 10 }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: true }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
        });

        it('Checking the child Element count', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(12);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking segment without point color mapping', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(9);
                element = getElement('container_Series_0_Segment_3');
                expect(element.getAttribute('fill')).toBe('#E94649');
                element = getElement('container_Series_0_Segment_0');
                expect(element.getAttribute('fill')).toBe('orange');
                element = getElement('container_Series_0_Segment_1');
                expect(element.getAttribute('fill')).toBe('teal');
                element = getElement('container_Series_0_Segment_2');
                expect(element.getAttribute('fill')).toBe('yellow');
                done();
            };
            chartObj.series[0].pointColorMapping = '';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking segment - X Segment', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(5);
                element = getElement('container_Series_0_Segment_0');
                expect(element.getAttribute('fill')).toBe('orange');
                element = getElement('container_Series_0_Segment_1');
                expect(element.getAttribute('fill')).toBe('teal');
                done();
            };
            chartObj.series[0].segments = [{
                color: 'orange',
                value: 5
            }, {
                color: 'teal'
            }];
            chartObj.series[0].segmentAxis = 'X';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });

    /**
     * Multi Colored Line Segments
     */
    describe('Line series Segments - dateTime', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        let chartElement: Element;
        chartElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(chartElement);
            chartObj = new Chart(
                {
                    primaryXAxis: { valueType: 'DateTime' },
                    series: [{
                        animation: { enable: false },
                        dataSource: getData(colors, dataTimeData),
                        segments: [{
                            color: 'orange',
                            value: new Date(1998, 15, 15)
                        }, {
                            value: new Date(1998, 20, 20)
                        }, {
                            color: 'yellow'
                        }],
                        segmentAxis: 'X',
                        pointColorMapping: 'color',
                        width: 3,
                        xName: 'XValue', yName: 'YValue', name: 'India',
                        fill: '#E94649', type: 'MultiColoredLine',
                        marker: { visible: true, width: 10, height: 10 }
                    }],
                    isTransposed: true,
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: true }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
        });

        it('Checking the child Element count', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(12);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking segment without point color mapping', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(7);
                element = getElement('container_Series_0_Segment_0');
                expect(element.getAttribute('stroke')).toBe('orange');
                element = getElement('container_Series_0_Segment_1');
                expect(element.getAttribute('stroke')).toBe('#E94649');
                element = getElement('container_Series_0_Segment_2');
                expect(element.getAttribute('stroke')).toBe('yellow');
                done();
            };
            chartObj.series[0].pointColorMapping = '';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });

    describe('Checking sorting in segments', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        let chartElement: Element;
        chartElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(chartElement);
            chartObj = new Chart(
                {
                    primaryXAxis: {
                        title: 'Year',
                        minimum: 2004, maximum: 2012, interval: 1
                    },
                    primaryYAxis: {
                        minimum: 20, maximum: 40, interval: 5,
                        title: 'Efficiency',
                        labelFormat: '{value}%'
                    },
                    series: [{
                            dataSource: [
                                { x: 2005, y: 28, color: 'red' }, { x: 2006, y: 25, color: 'green' }, { x: 2007, y: 26, color: 'fuchsia' }, 
                                { x: 2008, y: 27, color: 'crimson' },
                                { x: 2009, y: 32, color: 'blue' }, { x: 2010, y: 35, color: 'darkorange' }, { x: 2011, y: 30, color: 'red' }
                            ], width: 2,
                            xName: 'x', yName: 'y',
                            name: 'India',
                           
                          //  pointColorMapping: 'color',
                            marker: { visible: true },
                            type: 'MultiColoredLine', animation: { enable: false }
                        }],
                    title: 'Efficiency of oil-fired power production'
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
        });

        it('Checking the child Element count', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(3);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking marker color', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(7);               
                element = getElement('container_Series_0_Point_0_Symbol');
                expect(element.getAttribute('stroke') == 'green');
                element = getElement('container_Series_0_Point_5_Symbol');
                expect(element.getAttribute('stroke') == 'red');
                done();
            };
            chartObj.series[0].segmentAxis = 'Y';
            chartObj.series[0].segments = [{
                value: 35,
                color: 'red'
            }, {
                value: 30,
                color: 'green'
            }, {
                value: 40,
                color: 'blue'
            }];
            chartObj.loaded = loaded;
            chartObj.refresh();
            
        });

        it('Checking marker color', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(5);               
                element = getElement('container_Series_0_Point_0_Symbol');
                expect(element.getAttribute('stroke') == 'green');
                element = getElement('container_Series_0_Point_5_Symbol');
                expect(element.getAttribute('stroke') == 'blue');
                done();
            };
           
            chartObj.series[0].segments=  [{
            value: 10,
            color: 'red'
        }, {
            value: 30,
            color: 'green'
        }, {
            value: 40,
            color: 'blue'
        }]
        chartObj.loaded = loaded;
        chartObj.refresh();
    });
       
    });

    /**
     * Multi Colored Area Segments
     */
    describe('Area series Segments - category', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        let chartElement: Element;
        chartElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(chartElement);
            chartObj = new Chart(
                {
                    primaryXAxis: { valueType: 'Category' },
                    series: [{
                        animation: { enable: false },
                        dataSource: getData(colors, categoryData),
                        segments: [{
                            color: 'orange',
                            value: 'C'
                        }, {
                            value: 7
                        }, {
                            color: 'yellow'
                        }],
                        segmentAxis: 'X',
                        pointColorMapping: 'color',
                        width: 3,
                        xName: 'XValue', yName: 'YValue', name: 'India',
                        fill: '#E94649', type: 'MultiColoredArea',
                        marker: { visible: true, width: 10, height: 10 }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: true }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
        });

        it('Checking the child Element count', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(12);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
        it('Checking segment without point color mapping', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(7);
                element = getElement('container_Series_0_Segment_0');
                expect(element.getAttribute('fill')).toBe('orange');
                element = getElement('container_Series_0_Segment_1');
                expect(element.getAttribute('fill')).toBe('#E94649');
                element = getElement('container_Series_0_Segment_2');
                expect(element.getAttribute('fill')).toBe('yellow');
                done();
            };
            chartObj.series[0].pointColorMapping = '';
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });


    /**
     * Multi Colored Area Segments
     */
    describe('Area series Segments - Empty poinys', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        let chartElement: Element;
        chartElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(chartElement);
            chartObj = new Chart(
                {
                    primaryXAxis: { valueType: 'Category' },
                    series: [{
                        animation: { enable: false },
                        dataSource: getData(colors, categoryData, true),
                        pointColorMapping: 'color',
                        width: 3,
                        xName: 'XValue', yName: 'YValue', name: 'India',
                        fill: '#E94649', type: 'MultiColoredArea',
                        marker: { visible: true, width: 10, height: 10 }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: true }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
        });

        it('Checking the child Element count', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(9);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking empty point as drop', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(9);
                element = getElement('container_Series_0_Point_2');
                expect(element.getAttribute('fill')).toBe('fuchsia');
                element = getElement('container_Series_0_Point_3');
                expect(element).toBe(null);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].emptyPointSettings.mode = 'Drop';
            chartObj.refresh();
        });

        it('Checking empty point as average', (done: Function) => {
            loaded = (args: Object): void => {
                let color: string;
                for (let i: number = 0; i < 11; i++) {
                    element = getElement('container_Series_0_Point_' + i);
                    color = colors[i] ? colors[i] : '#E94649';
                    expect(element.getAttribute('fill')).toBe(color);
                }
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].emptyPointSettings.mode = 'Average';
            chartObj.refresh();
        });

        it('Checking empty point as Zero', (done: Function) => {
            loaded = (args: Object): void => {
                let color: string;
                for (let i: number = 0; i < 11; i++) {
                    element = getElement('container_Series_0_Point_' + i);
                    color = colors[i] ? colors[i] : '#E94649';
                    expect(element.getAttribute('fill')).toBe(color);
                }
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].emptyPointSettings.mode = 'Zero';
            chartObj.refresh();
        });

        it('Animation', (done: Function) => {
            chartObj.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let pathLength: number = (<SVGPathElement>args.series.pathElement).getTotalLength();
                expect(pathLength >= 200).toBe(true);
                done();
            };
            chartObj.series[0].animation.enable = true;
            chartObj.refresh();

        });
    });


    /**
     * Multi Colored Line Segments
     */
    describe('Line series Segments - Empty poinys', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let element: Element;
        let chartElement: Element;
        chartElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(chartElement);
            chartObj = new Chart(
                {
                    primaryXAxis: { valueType: 'Category' },
                    series: [{
                        animation: { enable: false },
                        dataSource: getData(colors, categoryData, true),
                        pointColorMapping: 'color',
                        width: 3,
                        xName: 'XValue', yName: 'YValue', name: 'India',
                        fill: '#E94649', type: 'MultiColoredLine',
                        marker: { visible: true, width: 10, height: 10 }
                    }],
                    width: '800',
                    title: 'Chart TS Title', loaded: loaded,
                    legendSettings: { visible: true }
                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
        });

        it('Checking the child Element count', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(6);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
        });

        it('Checking empty point as drop', (done: Function) => {
            loaded = (args: Object): void => {
                element = getElement('containerSeriesGroup0');
                expect(element.childElementCount).toBe(9);
                element = getElement('container_Series_0_Point_2');
                expect(element.getAttribute('stroke')).toBe('fuchsia');
                element = getElement('container_Series_0_Point_3');
                expect(element).toBe(null);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].emptyPointSettings.mode = 'Drop';
            chartObj.refresh();
        });

        it('Checking empty point as average', (done: Function) => {
            loaded = (args: Object): void => {
                let color: string;
                for (let i: number = 0; i < 11; i++) {
                    element = getElement('container_Series_0_Point_' + i);
                    color = colors[i] ? colors[i] : '#E94649';
                    expect(element.getAttribute('stroke')).toBe(color);
                }
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].emptyPointSettings.mode = 'Average';
            chartObj.refresh();
        });

        it('Checking empty point as Zero', (done: Function) => {
            loaded = (args: Object): void => {
                let color: string;
                for (let i: number = 0; i < 11; i++) {
                    element = getElement('container_Series_0_Point_' + i);
                    color = colors[i] ? colors[i] : '#E94649';
                    expect(element.getAttribute('stroke')).toBe(color);
                }
                done();
            };
            chartObj.loaded = loaded;
            chartObj.series[0].emptyPointSettings.mode = 'Zero';
            chartObj.refresh();
        });

        it('Animation', (done: Function) => {
            chartObj.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                let pathLength: number = (<SVGPathElement>args.series.pathElement).getTotalLength();
                expect(pathLength >= 50).toBe(true);
                done();
            };
            chartObj.series[0].animation.enable = true;
            chartObj.refresh();
        });
    });

});