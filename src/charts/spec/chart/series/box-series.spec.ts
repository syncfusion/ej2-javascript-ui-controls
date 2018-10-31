/**
 * Specifies the Bar series spec.
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Selection } from '../../../src/chart/user-interaction/selection';
import { getElement } from '../../../src/common/utils/helper';
import { BoxAndWhiskerSeries } from '../../../src/chart/series/box-and-whisker-series';
import { Category } from '../../../src/chart/axis/category-axis';
import { Series, Points } from '../../../src/chart/series/chart-series';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { DataLabel } from '../../../src/chart/series/data-label';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { unbindResizeEvents } from '../base/data.spec';
import { MouseEvents } from '../base/events.spec';
import { bar, barData, datetimeData, categoryData, categoryData1, negativeDataPoint, rotateData1, rotateData2 } from '../base/data.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs, IPointRenderEventArgs } from '../../../src/common/model/interface';


Chart.Inject(BoxAndWhiskerSeries, Tooltip, Crosshair, Category, DataLabel, Selection);

export interface wheel {
    preventDefault: Function,
    wheelDelta: number,
    detail: number,
    clientX: number,
    clientY: number
}

let prevent: Function = (): void => {
    //Prevent Function
};

describe('Chart Control - Box and Whisker Series', () => {
    describe('Box plot - default rendering', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let point: HTMLElement;
        let svg: Element;
        let loaded: EmitType<ILoadedEventArgs>;
        let done: Function;
        let currentPoint: Points;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { valueType: 'Category', title: 'Department' },
                    primaryYAxis: { title: 'Age' },
                    series: [{
                        dataSource: [
                            { x: "Development", yValues: [22, 22, 23, 25, 25, 25, 26, 27, 27, 28, 28, 29, 30, 32, 34, 32, 34, 36, 35, 38] },
                            { x: "Testing", yValues: [22, 33, 23, 25, 26, 28, 29, 30, 34, 33, 32, 31, 50] },
                            { x: "HR", yValues: [22, 24, 25, 30, 32, 34, 36, 38, 39, 41, 35, 36, 40, 56] },
                            { x: "Finance", yValues: [26, 27, 28, 30, 32, 34, 35, 37, 35, 37, 45] },
                            { x: "R&D", yValues: [26, 27, 29, 32, 34, 35, 36, 37, 38, 39, 41, 43, 58] },
                            { x: "Sales", yValues: [27, 26, 28, 29, 29, 29, 32, 35, 32, 38, 53] },
                            { x: "Inventory", yValues: [21, 23, 24, 25, 26, 27, 28, 30, 34, 36, 38] },
                            { x: "Graphics", yValues: [26, 28, 29, 30, 32, 33, 35, 36, 52] },
                            { x: "Training", yValues: [28, 29, 30, 31, 32, 34, 35, 36] }
                        ],
                        xName: 'x', yName: 'yValues',
                        animation: { enable: false }, type: 'BoxAndWhisker',
                        marker: {
                            visible: true,
                            height: 10,
                            width: 10
                        }
                    },
                    ], width: '800',
                    legendSettings: { visible: false },
                    title: 'Employees age group in various departments',
                });
            chartObj.appendTo('#container');
            unbindResizeEvents(chartObj);
        });

        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Checking with group elements', (done: Function) => {
            loaded = (args: Object): void => {
                svg = getElement('containerSeriesGroup0');
                expect(svg.childElementCount).toBe(10);
                svg = getElement('container_Series_0_Point_0');
                expect(svg.childElementCount).toBe(1);
                svg = getElement('container_Series_0_Point_1');
                expect(svg.childElementCount).toBe(2);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking with point default color customization', () => {
            svg = getElement('container_Series_0_Point_0_BoxPath');
            expect(svg.getAttribute('fill')).toBe('#00bdae');
            expect(svg.getAttribute('stroke')).toBe('#004c46');
            expect(svg.getAttribute('stroke-width')).toBe('1');
            expect(svg.getAttribute('opacity')).toBe('1');
            svg = getElement('container_Series_0_Point_1_Symbol');
            expect(svg.getAttribute('fill')).toBe('#00bdae');
            expect(svg.getAttribute('stroke')).toBe('#004c46');
            expect(svg.getAttribute('stroke-width')).toBe('2');
            expect(svg.getAttribute('opacity')).toBe('1');
        });

        it('Checking given customization', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_0_BoxPath');
                expect(svg.getAttribute('fill')).toBe('teal');
                expect(svg.getAttribute('stroke')).toBe('#eff4ff');
                expect(svg.getAttribute('stroke-width')).toBe('2');
                expect(svg.getAttribute('opacity')).toBe('1');
                svg = getElement('container_Series_0_Point_1_Symbol');
                expect(svg.getAttribute('fill')).toBe('teal');
                expect(svg.getAttribute('stroke')).toBe('#eff4ff');
                expect(svg.getAttribute('stroke-width')).toBe('2');
                expect(svg.getAttribute('opacity')).toBe('1');
                done();
            };
            chartObj.series[0].fill = 'teal';
            chartObj.series[0].border = {
                color: '#eff4ff',
                width: 2
            };
            chartObj.series[0].marker.border = {
                color: '#eff4ff',
                width: 2
            };
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking normal mode', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                currentPoint = (<Series>chartObj.series[0]).points[2];
                expect(currentPoint.average).toBe(34.857142857142854);
                expect(currentPoint.upperQuartile).toBe(39);
                expect(currentPoint.lowerQuartile).toBe(30);
                expect(currentPoint.minimum).toBe(22);
                expect(currentPoint.maximum).toBe(41);
                expect(currentPoint.median).toBe(35.5);
                expect(currentPoint.outliers.length).toBe(1);
                expect(currentPoint.outliers[0]).toBe(56);
                done();
            };
            chartObj.series[0].border = {
                color: null, width: 1
            };
            chartObj.series[0].marker.border = {
                color: null, width: 1
            };
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking exclusive mode', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                currentPoint = (<Series>chartObj.series[0]).points[2];
                expect(currentPoint.average).toBe(34.857142857142854);
                expect(currentPoint.upperQuartile).toBe(39.25);
                expect(currentPoint.lowerQuartile).toBe(28.75);
                expect(currentPoint.minimum).toBe(22);
                expect(currentPoint.maximum).toBe(41);
                expect(currentPoint.median).toBe(35.5);
                expect(currentPoint.outliers.length).toBe(1);
                expect(currentPoint.outliers[0]).toBe(56);
                done();
            };
            chartObj.series[0].boxPlotMode = 'Exclusive';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking inclusive mode', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                currentPoint = (<Series>chartObj.series[0]).points[2];
                expect(currentPoint.average).toBe(34.857142857142854);
                expect(currentPoint.upperQuartile).toBe(38.75);
                expect(currentPoint.lowerQuartile).toBe(30.5);
                expect(currentPoint.minimum).toBe(22);
                expect(currentPoint.maximum).toBe(41);
                expect(currentPoint.median).toBe(35.5);
                expect(currentPoint.outliers.length).toBe(1);
                expect(currentPoint.outliers[0]).toBe(56);
                done();
            };
            chartObj.series[0].boxPlotMode = 'Inclusive';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking normal mode and mean as true', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_3_BoxPath');
                expect((svg.getAttribute('d').match(/M/g) || []).length).toBe(8);
                done();
            };
            chartObj.series[0].boxPlotMode = 'Normal';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking normal mode and mean as false', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_3_BoxPath');
                expect((svg.getAttribute('d').match(/M/g) || []).length).toBe(6);
                done();
            };
            chartObj.series[0].showMean = false;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking animation complete event', (done: Function) => {
            chartObj.animationComplete = (args: Object) => {
                svg = getElement('container_Series_0_Point_0');
                expect((svg as HTMLElement).style.visibility).toBe('visible');
                done();
            }
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_0');
                expect((svg as HTMLElement).style.visibility).toBe('hidden');
            };
            chartObj.series[0].animation.enable = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking single yValues', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_0_BoxPath');
                expect(svg !== null).toBe(true)
                done();
            };
            chartObj.animationComplete = null;
            chartObj.series[0].animation.enable = false;
            chartObj.series[0].dataSource = [{
                x: "Development",
                yValues: [22, 22, 23, 25, 25, 25, 26, 27, 27, 28, 28, 29, 30, 32, 34, 32, 34, 36, 35, 38]
            }];
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking single yValues with empty point', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_0_BoxPath');
                expect(svg !== null).toBe(true)
                done();
            };
            chartObj.series[0].dataSource = [{
                x: "Development",
                yValues: [22, 22, 23, 25, 25, 25, 26, 27, null, undefined, 28, 29, 30, 32, 34, null, 34, 36, 35, 38]
            }];
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking single point', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_0_BoxPath');
                expect(svg !== null).toBe(true)
                done();
            };
            chartObj.series[0].dataSource = [{
                x: "Development",
                yValues: [22]
            }];
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking single point with exclusive mode', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_0_BoxPath');
                expect(svg !== null).toBe(true)
                done();
            };
            chartObj.series[0].boxPlotMode = 'Exclusive';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking single point with inclusive mode', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_0_BoxPath');
                expect(svg !== null).toBe(true)
                done();
            };
            chartObj.series[0].boxPlotMode = 'Inclusive';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking empty array point with inclusive', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_0_BoxPath');
                expect(svg === null).toBe(true)
                done();
            };
            chartObj.series[0].dataSource = [{
                x: "Development",
                yValues: []
            }];
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('Checking empty array point with exclusive', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_0_BoxPath');
                expect(svg === null).toBe(true)
                done();
            };
            chartObj.series[0].boxPlotMode = 'Exclusive';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });

        it('checking inverted axis', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_3_BoxPath');
                expect((svg.getAttribute('d').match(/M/g) || []).length).toBe(6);
                done();
            };
            chartObj.series[0].dataSource = [
                { x: 1, yValues: [22, 22, 23, 25, 25, 25, 26, 27, 27, 28, 28, 29, 30, 32, 34, 32, 34, 36, 35, 38] },
                { x: 2, yValues: [22, 33, 23, 25, 26, 28, 29, 30, 34, 33, 32, 31, 50] },
                { x: 3, yValues: [22, 24, 25, 30, 32, 34, 36, 38, 39, 41, 35, 36, 40, 56] },
                { x: 4, yValues: [26, 27, 28, 30, 32, 34, 35, 37, 35, 37, 45] },
                { x: 5, yValues: [26, 27, 29, 32, 34, 35, 36, 37, 38, 39, 41, 43, 58] },
                { x: 6, yValues: [27, 26, 28, 29, 29, 29, 32, 35, 32, 38, 53] },
                { x: 7, yValues: [21, 23, 24, 25, 26, 27, 28, 30, 34, 36, 38] },
                { x: 8, yValues: [26, 28, 29, 30, 32, 33, 35, 36, 52] },
                { x: 9, yValues: [28, 29, 30, 31, 32, 34, 35, 36] }
            ];
            chartObj.primaryXAxis.valueType = 'Double';
            chartObj.isTransposed = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('checking series with certain range', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_3_BoxPath');
                expect((svg.getAttribute('d').match(/M/g) || []).length).toBe(6);
                svg = getElement('containerSeriesGroup0');
                expect(svg.childElementCount).toBe(7);
                done();
            };
            chartObj.primaryXAxis.minimum = 3;
            chartObj.primaryXAxis.maximum = 6;
            chartObj.primaryXAxis.interval = 2;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('checking point render event', (done: Function) => {
            chartObj.pointRender = (args: IPointRenderEventArgs): void => {
                args.cancel = args.point.index != 3;
            };
            chartObj.loaded = (args: Object): void => {
                svg = getElement('containerSeriesGroup0');
                expect(svg.childElementCount).toBe(2);
                chartObj.pointRender = null;
                done();
            };
            chartObj.series[0].showMean = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
    });
    describe('Box plot - checking marker, datalabel', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let point: HTMLElement;
        let svg: Element;
        let svg1: Element;
        let loaded: EmitType<ILoadedEventArgs>;
        let done: Function;
        let currentPoint: Points;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { valueType: 'Category', title: 'Department' },
                    primaryYAxis: { title: 'Age' },
                    series: [{
                        dataSource: [
                            { x: "Development", yValues: [22, 22, 23, 25, 25, 25, 26, 27, 27, 28, 28, 29, 30, 32, 34, 32, 34, 36, 35, 38] },
                            { x: "Testing", yValues: [22, 33, 23, 25, 26, 28, 29, 30, 34, 33, 32, 31, 50] },
                            { x: "HR", yValues: [22, 24, 25, 30, 32, 34, 36, 38, 39, 41, 35, 36, 40, 56] },
                            { x: "Finance", yValues: [26, 27, 28, 30, 32, 34, 35, 37, 35, 37, 45] },
                            { x: "R&D", yValues: [26, 27, 29, 32, 34, 35, 36, 37, 38, 39, 41, 43, 58] },
                            { x: "Sales", yValues: [27, 26, 28, 29, 29, 29, 32, 35, 32, 38, 53] },
                            { x: "Inventory", yValues: [21, 23, 24, 25, 26, 27, 28, 30, 34, 36, 38] },
                            { x: "Graphics", yValues: [26, 28, 29, 30, 32, 33, 35, 36, 52] },
                            { x: "Training", yValues: [28, 29, 30, 31, 32, 34, 35, 36] }
                        ],
                        xName: 'x', yName: 'yValues',
                        animation: { enable: false }, type: 'BoxAndWhisker',
                        marker: {
                            visible: true
                        }
                    },
                    ], width: '800',
                    legendSettings: { visible: false },
                    title: 'Employees age group in various departments',
                });
            chartObj.appendTo('#container');
            unbindResizeEvents(chartObj);
        });

        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Checking marker visibility true', (done: Function) => {
            loaded = (args: Object): void => {
                svg = getElement('containerSymbolGroup0');
                expect(svg.childElementCount).toBe(1);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking data label visibility', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_1_Symbol');
                svg1 = getElement('container_Series_0_Point_1_Text_5');
                expect(+svg.getAttribute('cy') > +svg1.getAttribute('y')).toBe(true);
                svg = getElement('container_Series_0_Point_7_Symbol');
                svg1 = getElement('container_Series_0_Point_7_Text_5');
                expect(+svg.getAttribute('cy') > +svg1.getAttribute('y')).toBe(true);
                done();
            };
            chartObj.series[0].marker.dataLabel.visible = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking data label visibility with inversed axis', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_1_Symbol');
                svg1 = getElement('container_Series_0_Point_1_Text_5');
                expect(+svg.getAttribute('cy') < +svg1.getAttribute('y')).toBe(true);
                svg = getElement('container_Series_0_Point_7_Symbol');
                svg1 = getElement('container_Series_0_Point_7_Text_5');
                expect(+svg.getAttribute('cy') < +svg1.getAttribute('y')).toBe(true);
                done();
            };
            chartObj.primaryYAxis.isInversed = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking data label postioin as top', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_1_Symbol');
                svg1 = getElement('container_Series_0_Point_1_Text_5');
                expect(+svg.getAttribute('cy') > +svg1.getAttribute('y')).toBe(true);
                svg = getElement('container_Series_0_Point_7_Symbol');
                svg1 = getElement('container_Series_0_Point_7_Text_5');
                expect(+svg.getAttribute('cy') > +svg1.getAttribute('y')).toBe(true);
                done();
            };
            chartObj.primaryYAxis.isInversed = false;
            chartObj.series[0].marker.dataLabel.position = 'Top';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking data label present in isTransposed true', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
            let dataLabel: HTMLElement = document.getElementById('container_Series_0_Point_0_Text_0');
            expect(dataLabel).not.toBe(null);
            dataLabel = document.getElementById('container_Series_0_Point_0_Text_1');
            expect(dataLabel).not.toBe(null);
            dataLabel = document.getElementById('container_Series_0_Point_0_Text_2');
            expect(dataLabel).not.toBe(null);
            dataLabel = document.getElementById('container_Series_0_Point_0_Text_3');
            expect(dataLabel).not.toBe(null);
            dataLabel = document.getElementById('container_Series_0_Point_0_Text_4');
            expect(dataLabel).not.toBe(null);
            dataLabel = document.getElementById('container_Series_0_Point_1_Text_0');
            expect(dataLabel).not.toBe(null);
            done();
            };
            chartObj.isTransposed = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking data label postioin as auto', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_1_Symbol');
                svg1 = getElement('container_Series_0_Point_1_Text_5');
                expect(+svg.getAttribute('cy') > +svg1.getAttribute('y')).toBe(true);
                svg = getElement('container_Series_0_Point_7_Symbol');
                svg1 = getElement('container_Series_0_Point_7_Text_5');
                expect(+svg.getAttribute('cy') > +svg1.getAttribute('y')).toBe(true);
                done();
            };
            chartObj.isTransposed = false;
            chartObj.series[0].marker.dataLabel.position = 'Auto';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking data label postioin as bottom', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_1_Symbol');
                svg1 = getElement('container_Series_0_Point_1_Text_5');
                expect(+svg.getAttribute('cy') < +svg1.getAttribute('y')).toBe(true);
                svg = getElement('container_Series_0_Point_7_Symbol');
                svg1 = getElement('container_Series_0_Point_7_Text_5');
                expect(+svg.getAttribute('cy') < +svg1.getAttribute('y')).toBe(true);
                done();
            };
            chartObj.series[0].marker.dataLabel.position = 'Bottom';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking data label postioin as middle', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_1_Symbol');
                svg1 = getElement('container_Series_0_Point_1_Text_5');
                expect(+svg1.getAttribute('y') - +svg.getAttribute('cy') < 4).toBe(true);
                svg = getElement('container_Series_0_Point_7_Symbol');
                svg1 = getElement('container_Series_0_Point_7_Text_5');
                expect(+svg1.getAttribute('y') - +svg.getAttribute('cy') < 4).toBe(true);
                done();
            };
            chartObj.series[0].marker.dataLabel.position = 'Middle';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking data label postioin as outer', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_1_Symbol');
                svg1 = getElement('container_Series_0_Point_1_Text_5');
                expect(+svg.getAttribute('cy') > +svg1.getAttribute('y')).toBe(true);
                svg = getElement('container_Series_0_Point_7_Symbol');
                svg1 = getElement('container_Series_0_Point_7_Text_5');
                expect(+svg.getAttribute('cy') > +svg1.getAttribute('y')).toBe(true);
                done();
            };
            chartObj.series[0].marker.dataLabel.position = 'Outer';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking data label alignment as near', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_1_Symbol');
                svg1 = getElement('container_Series_0_Point_1_Text_5');
                expect(+svg.getAttribute('cy') < +svg1.getAttribute('y')).toBe(true);
                svg = getElement('container_Series_0_Point_7_Symbol');
                svg1 = getElement('container_Series_0_Point_7_Text_5');
                expect(+svg.getAttribute('cy') < +svg1.getAttribute('y')).toBe(true);
                done();
            };
            chartObj.series[0].marker.dataLabel.alignment = 'Near';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking data label alignment as far', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_Point_1_Symbol');
                svg1 = getElement('container_Series_0_Point_1_Text_5');
                expect(+svg.getAttribute('cy') > +svg1.getAttribute('y')).toBe(true);
                svg = getElement('container_Series_0_Point_7_Symbol');
                svg1 = getElement('container_Series_0_Point_7_Text_5');
                expect(+svg.getAttribute('cy') > +svg1.getAttribute('y')).toBe(true);
                done();
            };
            chartObj.series[0].marker.dataLabel.alignment = 'Center';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking data label with shape', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('containerShapeGroup0');
                expect(svg.childElementCount == 31 || svg.childElementCount == 28).toBe(true)
                done();
            };
            chartObj.series[0].marker.dataLabel.fill = 'red';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking data label with template', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                svg = getElement('container_Series_0_DataLabelCollections');
                expect(svg.childElementCount == 32 || svg.childElementCount == 28).toBe(true)
                done();
            };
            chartObj.series[0].marker.dataLabel.template = '<div>${point.average}</div>';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
    });
    describe('Box plot - checking user interaction', () => {
        let chartObj: Chart;
        let elem: HTMLElement;
        let point: HTMLElement;
        let svg: Element;
        let id: string = 'container';
        let selection: string = 'container_ej2_chart_selection_series_';
        let svg1: Element;
        let targetElement: Element;
        let draggedRectGroup: string = id + '_ej2_drag_rect';
        let trigger: MouseEvents = new MouseEvents();
        let x: number;
        let y: number;
        let loaded: EmitType<ILoadedEventArgs>;
        let done: Function;
        let currentPoint: Points;
        beforeAll(() => {
            elem = createElement('div', { id: 'container' });
            document.body.appendChild(elem);
            chartObj = new Chart(
                {
                    primaryXAxis: { valueType: 'Category', title: 'Department' },
                    primaryYAxis: { title: 'Age' },
                    series: [{
                        dataSource: [
                            { x: "Development", yValues: [22, 22, 23, 25, 25, 25, 26, 27, 27, 28, 28, 29, 30, 32, 34, 32, 34, 36, 35, 38] },
                            { x: "Testing", yValues: [22, 33, 23, 25, 26, 28, 29, 30, 34, 33, 32, 31, 50] },
                            { x: "HR", yValues: [22, 24, 25, 30, 32, 34, 36, 38, 39, 41, 35, 36, 40, 56] },
                            { x: "Finance", yValues: [26, 27, 28, 30, 32, 34, 35, 37, 35, 37, 45] },
                            { x: "R&D", yValues: [26, 27, 29, 32, 34, 35, 36, 37, 38, 39, 41, 43, 58] },
                            { x: "Sales", yValues: [27, 26, 28, 29, 29, 29, 32, 35, 32, 38, 53] },
                            { x: "Inventory", yValues: [21, 23, 24, 25, 26, 27, 28, 30, 34, 36, 38] },
                            { x: "Graphics", yValues: [26, 28, 29, 30, 32, 33, 35, 36, 52] },
                            { x: "Training", yValues: [28, 29, 30, 31, 32, 34, 35, 36] }
                        ],
                        xName: 'x', yName: 'yValues',
                        animation: { enable: false }, type: 'BoxAndWhisker',
                        marker: {
                            visible: true
                        }
                    },
                    ], width: '800',
                    legendSettings: { visible: false },
                    title: 'Employees age group in various departments',
                });
            chartObj.appendTo('#container');
            unbindResizeEvents(chartObj);
        });

        afterAll((): void => {
            chartObj.destroy();
            elem.remove();
        });
        it('Checking tooltip default - false', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = getElement('container_Series_0_Point_1_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(targetElement.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip == null).toBe(true);
                svg = getElement('container_Series_0_Point_1_Trackball_0');
                expect(svg != null).toBe(true);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking marker in hover', (done: Function) => {
            loaded = (args: Object): void => {
                targetElement = getElement('container_Series_0_Point_1_BoxPath');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(targetElement.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                let marker:HTMLElement = document.getElementById('container_Series_0_Point_1_Symbol');
                expect(marker == null).toBe(true);
                done();
            };
            chartObj.series[0].marker.visible = false;
            chartObj.loaded = loaded;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking default tooltip', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                targetElement = getElement('container_Series_0_Point_1_Symbol');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(targetElement.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
                let path: HTMLElement = group.childNodes[0] as HTMLElement;
                let text1: HTMLElement = group.childNodes[1] as HTMLElement;
                let headerPath: HTMLElement = group.childNodes[2] as HTMLElement;
                expect(path.localName == 'path').toBe(true);
                expect(path.getAttribute('d') != '' || ' ').toBe(true);
                expect(headerPath.getAttribute('d') != '' || ' ').toBe(true);
                expect(group.childNodes.length == 4).toBe(true);
                expect(text1.textContent == 'TestingOutliers : 50').toBe(true)
                svg = getElement('container_Series_0_Point_1_Trackball_0');
                expect(svg != null).toBe(true);
                targetElement = getElement('container_Series_0_Point_2_Symbol');
                y = parseFloat(targetElement.getAttribute('cy')) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(targetElement.getAttribute('cx')) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                tooltip = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                done();
            };
            chartObj.series[0].marker.visible = true;
            chartObj.tooltip.enable = true;
            chartObj.series[0].marker.visible = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking default tooltip - maximum position', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                targetElement = getElement('container_Series_0_Point_0_BoxPath');
                let pathElements: string[] = targetElement.getAttribute('d').split(' ');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(pathElements[2])  + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(pathElements[5]) - 2 + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
                let path: HTMLElement = group.childNodes[0] as HTMLElement;
                let text1: HTMLElement = group.childNodes[1] as HTMLElement;
                
                expect(path.localName == 'path').toBe(true);
                expect(path.getAttribute('d') != '' || ' ').toBe(true);
                expect(group.childNodes.length == 4).toBe(true);
                expect(text1.textContent == 'DevelopmentMaximum : 38Q1 : 33Median : 28Q3 : 25Minimum : 22').toBe(true);
                done();
            };
            chartObj.tooltip.enable = true;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking default tooltip - maximum position - overlapped', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                targetElement = getElement('container_Series_0_Point_3_BoxPath');
                let pathElements: string[] = targetElement.getAttribute('d').split(' ');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(pathElements[57]) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(pathElements[56]) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));
                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);
                let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
                let path: HTMLElement = group.childNodes[0] as HTMLElement;
                let text1: HTMLElement = group.childNodes[1] as HTMLElement;
                expect(path.localName == 'path').toBe(true);
                expect(path.getAttribute('d') != '' || ' ').toBe(true);
                expect(group.childNodes.length == 4).toBe(true);
                expect(text1.textContent == 'FinanceMaximum : 45Q1 : 37Median : 34Q3 : 28Minimum : 26').toBe(true);
                done();
            };
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking default tooltip - trackball', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                targetElement = getElement('container_Series_0_Point_3_BoxPath');
                let pathElements: string[] = targetElement.getAttribute('d').split(' ');
                let chartArea: HTMLElement = document.getElementById('container_ChartAreaBorder');
                y = parseFloat(pathElements[57]) + parseFloat(chartArea.getAttribute('y')) + elem.offsetTop;
                x = parseFloat(pathElements[56]) + parseFloat(chartArea.getAttribute('x')) + elem.offsetLeft;
                trigger.mousemovetEvent(targetElement, Math.ceil(x), Math.ceil(y));                
                let crosshair: Element = <Element>document.getElementById('container_UserInteraction');
                expect(crosshair.childNodes.length == 3).toBe(true);

                let tooltip: HTMLElement = document.getElementById('container_tooltip');
                expect(tooltip != null).toBe(true);  
                let group: HTMLElement = tooltip.childNodes[0].childNodes[0] as HTMLElement;
                let path: HTMLElement = group.childNodes[0] as HTMLElement;
                let text1: HTMLElement = group.childNodes[1] as HTMLElement;
                expect(path.localName == 'path').toBe(true);
                expect(path.getAttribute('d') != '' || ' ').toBe(true);
                expect(group.childNodes.length == 4).toBe(true);
                expect(text1.textContent == 'FinanceMaximum : 45Q1 : 37Median : 34Q3 : 28Minimum : 26').toBe(true);
                done();
            };
            chartObj.crosshair.enable = true;
            chartObj.crosshair.lineType = 'Vertical';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('checking default slection - false', (done: Function) => {
            chartObj.loaded = () => {
                svg = document.getElementById('container_Series_0_Point_0_BoxPath');
                trigger.clickEvent(svg);
                expect(document.getElementsByClassName(selection + '0').length).toBe(0);
                done();
            };
            chartObj.crosshair.enable = false;
            chartObj.tooltip.enable = false;
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('checking default slection - point mode', (done: Function) => {
            chartObj.loaded = () => {
                svg = document.getElementById('container_Series_0_Point_0_BoxPath');
                trigger.clickEvent(svg);
                svg = document.getElementById('container_Series_0_Point_1_BoxPath');
                trigger.clickEvent(svg);
                svg = document.getElementById('container_Series_0_Point_3_BoxPath');
                trigger.clickEvent(svg);
                expect(document.getElementsByClassName(selection + '0').length).toBe(1);
                done();
            };
            chartObj.selectionMode = 'Point';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('checking default slection - series mode', (done: Function) => {
            chartObj.loaded = () => {
                svg = getElement('container_Series_0_Point_0_BoxPath');
                trigger.clickEvent(svg);
                svg = document.getElementById('container_Series_0_Point_1_BoxPath');
                trigger.clickEvent(svg);
                for (let i: number = 0; i < 1; i++) {
                    //expect(document.getElementsByClassName(selection + i).length).toBe(1);
                }
                done();
            };
            chartObj.selectionMode = 'Series';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('checking default slection - cluster mode', (done: Function) => {
            chartObj.loaded = () => {
                svg = getElement('container_Series_0_Point_0_BoxPath');
                trigger.clickEvent(svg);
                svg = document.getElementById('container_Series_0_Point_1_BoxPath');
                trigger.clickEvent(svg);
                for (let i: number = 0; i < 1; i++) {
                    expect(document.getElementsByClassName(selection + i).length).toBe(1);
                }
                done();
            };
            chartObj.selectionMode = 'Cluster';
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('MultiSelect true Selection Mode Point', (done: Function) => {
            loaded = () => {
                svg = document.getElementById('container_Series_0_Point_0_BoxPath');
                trigger.clickEvent(svg);
                svg = document.getElementById('container_Series_0_Point_1_BoxPath');
                trigger.clickEvent(svg);
                svg = document.getElementById('container_Series_0_Point_2_BoxPath');
                trigger.clickEvent(svg);
                svg = document.getElementById('container_Series_0_Point_3_BoxPath');
                trigger.clickEvent(svg);
                svg = document.getElementById('container_Series_0_Point_4_BoxPath');
                trigger.clickEvent(svg);
                for (let i: number = 0; i < 5; i++) {
                    svg = getElement('container_Series_0_Point_' + i)
                    expect(svg.getAttribute('class')).toBe('container_ej2_chart_selection_series_0');
                }
                for (let i: number = 5; i < 9; i++) {
                    svg = getElement('container_Series_0_Point_' + i)
                    expect(svg.getAttribute('class')).toBe('container_ej2_deselected');
                }
                done();
            };
            chartObj.selectionMode = 'Point';
            chartObj.isMultiSelect = true;
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Selection mode Drag moving', (done: Function) => {
            loaded = () => {
                trigger.draganddropEvent(elem, 100, 100, 300, 300);
                trigger.touchdraganddropEvent(chartObj, elem, 150, 150, 200, 200);
                svg = document.getElementById(draggedRectGroup);
                expect(svg.getAttribute('x')).toEqual('142');
                expect(svg.getAttribute('y')).toEqual('142');
                expect(svg.getAttribute('height')).toEqual('200');
                expect(svg.getAttribute('width')).toEqual('200');
                svg = getElement('container_Series_0_Point_' + 1)
                expect(svg.getAttribute('class')).toBe('container_ej2_chart_selection_series_0');
                svg = getElement('container_Series_0_Point_' + 2)
                expect(svg.getAttribute('class')).toBe('container_ej2_chart_selection_series_0');
                svg = getElement('container_Series_0_Point_' + 3)
                expect(svg.getAttribute('class')).toBe('container_ej2_chart_selection_series_0');
                done();
            };
            chartObj.selectionMode = 'DragXY';
            chartObj.loaded = loaded;
            chartObj.selectionModule.selectedDataIndexes = [];
            chartObj.refresh(); unbindResizeEvents(chartObj);
        });
        it('Checking mouse wheel zooming and selection', (done: Function) => {
            loaded = (args: Object): void => {
                chartObj.loaded = null;
                let wheelArgs: wheel = {
                    preventDefault: prevent,
                    wheelDelta: 120,
                    detail: 3,
                    clientX: 210,
                    clientY: 300
                };
                chartObj.zoomModule.chartMouseWheel(<WheelEvent>wheelArgs);
                svg = document.getElementById('container_Series_0_Point_2_BoxPath');
                trigger.clickEvent(svg);
                let selected: HTMLCollection = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                trigger.clickEvent(svg);
                selected = document.getElementsByClassName('container_ej2_chart_selection_series_0 ');
                expect(selected.length).toBe(0);
                done();
            };
            chartObj.selectionMode = 'Point';
            chartObj.zoomSettings.enableMouseWheelZooming = true;
            chartObj.loaded = loaded;
            chartObj.refresh();
        });
    });
});