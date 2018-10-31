/**
 * Specifies the annotation spec.
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { AccumulationChart } from '../../../src/accumulation-chart/accumulation';
import { AccPoints, AccumulationSeries } from '../../../src/accumulation-chart/model/acc-base';
import { Rect, getElement, removeElement } from '../../../src/common/utils/helper';
import { IAnnotationRenderEventArgs } from '../../../src/common/model/interface';
import { AccumulationLegend } from '../../../src/accumulation-chart/renderer/legend';
import { data, datetimeData1 } from '../../chart/base/data.spec';
import { MouseEvents } from '../../chart/base/events.spec';
import { AccumulationDataLabel } from '../../../src/accumulation-chart/renderer/dataLabel';
import { AccumulationAnnotation } from '../../../src/accumulation-chart/annotation/annotation';
import '../../../node_modules/es6-promise/dist/es6-promise';
AccumulationChart.Inject(AccumulationAnnotation, AccumulationLegend, AccumulationDataLabel);

describe('Accumumation Control', () => {
    describe('Annotation for Accumulation', () => {
        let chartObj: AccumulationChart;
        let element: Element;
        let chartElement: Element;
        let trigger: MouseEvents = new MouseEvents();
        chartElement = createElement('div', { id: 'container' });
        beforeAll(() => {          
            let template: Element = createElement('div', { id: 'template', styles: 'display: none;border: 2px solid red' });
            document.body.appendChild(template);
            template.innerHTML = "<img src='../base/spec/img/img1.jpg' style='border-radius: 30px;width: 30px;height: 30px;margin: 0 auto;' />";
            document.body.appendChild(chartElement);
            chartObj = new AccumulationChart(
                {
                    series: [{
                        animation: { enable: false },
                        name: 'ChartSeriesNameGold', dataSource: [{ x: 1000, y: 70 }, { x: 2000, y: -40 },
                        { x: 3000, y: 70 }, { x: 4000, y: 60 },
                        { x: 5000, y: -50 }, { x: 6000, y: -40 },
                        { x: 7000, y: 40 }, { x: 8000, y: 70 }], xName: 'x', yName: 'y'
                    }],
                    width: '800',
                    title: 'Chart TS Title',
                    legendSettings: { visible: false }
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.annotationModule.destroy(chartObj);
            chartObj.destroy();
            chartElement.remove();
            remove(document.getElementById('template'));
            remove(document.getElementById('template1'));
        });

        it('Checking Secondary element child count', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Secondary_Element');
                expect(element.childElementCount).toBe(0);
                done();
            };
            chartObj.refresh();
        });

        it('Checking annotaiton as default', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Secondary_Element');
                expect(element.childElementCount).toBe(1);
                expect(element.children[0].id).toBe('container_Annotation_Collections');
                expect(element.children[0].children[0].id).toBe('container_Annotation_0');
                done();
            };
            chartObj.annotations = [{
                content: '#template'
            }]
            chartObj.refresh();
        });

        it('Checking default annotation position', () => {
            element = getElement('container_Annotation_0');
            expect((element as HTMLElement).style.left).toBe('-15px');
            expect((element as HTMLElement).style.top).toBe('-17px');
        });


        it('Checking annotaiton region as series', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '221px' || (element as HTMLElement).style.left == '219.8px').toBe(true);
                expect((element as HTMLElement).style.top == '54px' || (element as HTMLElement).style.top == '51.3px').toBe(true);
                done();
            };
            chartObj.annotations[0].region = 'Series';
            chartObj.refresh();
        });

        it('Checking annotaiton region as series with near and top', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '206px' || (element as HTMLElement).style.left == '204.8px').toBe(true);
                expect((element as HTMLElement).style.top == '34.3px' || (element as HTMLElement).style.top == '37px').toBe(true);
                done();
            };
            chartObj.annotations[0].horizontalAlignment = 'Near';
            chartObj.annotations[0].verticalAlignment = 'Top';
            chartObj.refresh();
        });

        it('Checking annotaiton region as series with near and middle', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '206px' || (element as HTMLElement).style.left == '204.8px').toBe(true);
                expect((element as HTMLElement).style.top == '51.3px' || (element as HTMLElement).style.top == '54px').toBe(true);
                done();
            };
            chartObj.annotations[0].horizontalAlignment = 'Near';
            chartObj.annotations[0].verticalAlignment = 'Middle';
            chartObj.refresh();
        });

        it('Checking annotaiton region as series with near and bottom', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '206px' || (element as HTMLElement).style.left == '204.8px').toBe(true);
                expect((element as HTMLElement).style.top == '71px' || (element as HTMLElement).style.top == '68.3px').toBe(true);
                done();
            };
            chartObj.annotations[0].horizontalAlignment = 'Near';
            chartObj.annotations[0].verticalAlignment = 'Bottom';
            chartObj.refresh();
        });

        it('Checking annotaiton region as series with far and top', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '234.8px' || (element as HTMLElement).style.left == '236px').toBe(true);
                expect((element as HTMLElement).style.top == '34.3px' || (element as HTMLElement).style.top == '37px').toBe(true);
                done();
            };
            chartObj.annotations[0].horizontalAlignment = 'Far';
            chartObj.annotations[0].verticalAlignment = 'Top';
            chartObj.refresh();
        });

        it('Checking annotaiton region as series with far and middle', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '234.8px' || (element as HTMLElement).style.left == '236px').toBe(true);
                expect((element as HTMLElement).style.top == '51.3px' || (element as HTMLElement).style.top == '54px').toBe(true);
                done();
            };
            chartObj.annotations[0].horizontalAlignment = 'Far';
            chartObj.annotations[0].verticalAlignment = 'Middle';
            chartObj.refresh();
        });

        it('Checking annotaiton region as series with far and bottom', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '234.8px' || (element as HTMLElement).style.left == '236px').toBe(true);
                expect((element as HTMLElement).style.top == '71px' || (element as HTMLElement).style.top == '68.3px').toBe(true);
                done();
            };
            chartObj.annotations[0].horizontalAlignment = 'Far';
            chartObj.annotations[0].verticalAlignment = 'Bottom';
            chartObj.refresh();
        });

        it('Checking annotaiton region as series with center and top', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '219.8px' || (element as HTMLElement).style.left == '221px').toBe(true);
                expect((element as HTMLElement).style.top == '34.3px' || (element as HTMLElement).style.top == '37px').toBe(true);
                done();
            };
            chartObj.annotations[0].horizontalAlignment = 'Center';
            chartObj.annotations[0].verticalAlignment = 'Top';
            chartObj.refresh();
        });

        it('Checking annotaiton region as series with center and bottom', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '219.8px' || (element as HTMLElement).style.left == '221px').toBe(true);
                expect((element as HTMLElement).style.top == '71px' || (element as HTMLElement).style.top == '68.3px').toBe(true);
                done();
            };
            chartObj.annotations[0].horizontalAlignment = 'Center';
            chartObj.annotations[0].verticalAlignment = 'Bottom';
            chartObj.refresh();
        });

        it('Checking annotaiton unit as pixel, region as chart with percentage', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left).toBe('385px');
                expect((element as HTMLElement).style.top).toBe('208px');
                done();
            };
            chartObj.series[0].innerRadius = '30%';
            chartObj.annotations[0].horizontalAlignment = 'Center';
            chartObj.annotations[0].verticalAlignment = 'Middle';
            chartObj.annotations[0].region = 'Chart';
            chartObj.annotations[0].x = '50%';
            chartObj.annotations[0].y = '50%';
            chartObj.refresh();
        });

        it('Checking annotaiton unit as pixel, region as series with percentage', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left).toBe('385px');
                expect((element as HTMLElement).style.top == '218px' || (element as HTMLElement).style.top == '216.5px').toBe(true);
                done();
            };
            chartObj.annotations[0].region = 'Series';
            chartObj.refresh();
        });


        it('Checking annotaiton unit as pixel, region as series with number', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '606px' || (element as HTMLElement).style.left == '604.8px').toBe(true);
                expect((element as HTMLElement).style.top == '262px' || (element as HTMLElement).style.top == '259.3px').toBe(true);
                done();
            };
            chartObj.annotations[0].x = 385;
            chartObj.annotations[0].y = 208;
            chartObj.refresh();
        });


        it('Checking annotaiton unit as pixel, region as chart with date', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left).toBe('-15px');
                expect((element as HTMLElement).style.top).toBe('191px');
                done();
            };
            chartObj.annotations[0].region = 'Chart';
            chartObj.annotations[0].x = new Date(2017, 9, 5);
            chartObj.annotations[0].y = 208;
            chartObj.refresh();
        });

        it('Checking annotaiton unit as pixel, region as series with date', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '221px' || (element as HTMLElement).style.left == '219.8px').toBe(true);
                expect((element as HTMLElement).style.top == '262px' || (element as HTMLElement).style.top == '259.3px').toBe(true);
                done();
            };
            chartObj.annotations[0].region = 'Series';
            chartObj.refresh();
        });


        it('Checking annotaiton unit as point with unwanted data', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect(element).toBe(null);
                done();
            };
            chartObj.annotations[0].coordinateUnits = 'Point';
            chartObj.annotations[0].x = 6000;
            chartObj.annotations[0].y = -50;
            chartObj.refresh();
        });


        it('Checking annotaiton unit as point with exact data', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '282.718px' || (element as HTMLElement).style.left == '281.97px'|| (element as HTMLElement).style.left == '252.97px').toBe(true);
                expect((element as HTMLElement).style.top == '248.034px' || (element as HTMLElement).style.top == '246.754px').toBe(true);
                let legendEle: Element = getElement('container_chart_legend_text_0');
                chartObj.loaded = null;
                trigger.clickEvent(legendEle);
                setTimeout(() => {
                    expect(element).not.toBe(null);
                    done();
                }, 300);
            };
            chartObj.legendSettings.visible = true;
            chartObj.enableAnimation = true;
            chartObj.annotations[0].y = -40;
            chartObj.refresh();
        });

        it('Checking annotaiton unit as point with numeric value type as string', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect(element !== null).toBe(true);
                done();
            };
            chartObj.legendSettings.visible = false;
            chartObj.enableAnimation = false;
            chartObj.annotations[0].x = '6000';
            chartObj.refresh();
        });

        it('Checking annotaiton unit as point with date time value type', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '400.103px' || (element as HTMLElement).style.left == '400.213px').toBe(true);
                expect((element as HTMLElement).style.top == '112.475px' || (element as HTMLElement).style.top == '110.203px').toBe(true);
                done();
            };
            chartObj.series[0].dataLabel.visible = true;
            chartObj.series[0].dataSource = datetimeData1;
            chartObj.annotations[0].x = new Date(2000, 3, 21);
            chartObj.annotations[0].y = 10;
            chartObj.refresh();
        });

        it('Checking annotaiton unit as point with date time value type and numeric value', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect(element).toBe(null);
                done();
            };
            chartObj.annotations[0].x = 2000;
            chartObj.refresh();
        });

        it('Checking annotaiton unit as point with date time value as string', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect(element).toBe(null);
                done();
            };
            chartObj.annotations[0].x = 'new Date(2000, 3, 21)';
            chartObj.refresh();
        });

    });

    describe('Annotation for Chart', () => {
        let chartObj: AccumulationChart;
        let element: Element;
        let chartElement: Element;
        chartElement = createElement('div', { id: 'container' });
        beforeAll(() => {
            let template: Element = createElement('div', { id: 'template', styles: 'display: none;border: 2px solid red' });
            document.body.appendChild(template);
            template.innerHTML = "<img src='../base/spec/img/img1.jpg' style='border-radius: 30px;width: 30px;height: 30px;margin: 0 auto;' />";
            let template1: Element = createElement('div', { id: 'template1', styles: 'display: none;' });
            document.body.appendChild(template1);
            template1.innerHTML = '<div>${point.y}</div>';
            document.body.appendChild(chartElement);
            chartObj = new AccumulationChart(
                {
                    series: [
                        {
                            dataSource: [
                                { x: { xValue: 'Jan' }, y: 15 }, { x: { xValue: 'Feb' }, y: 20 }, { x: { xValue: 'Mar' }, y: 35 }, { x: { xValue: 'Apr' }, y: 40 },
                                { x: { xValue: 'May' }, y: 80 }, { x: { xValue: 'Jun' }, y: 70 }, { x: { xValue: 'Jul' }, y: 65 }, { x: { xValue: 'Aug' }, y: 55 },
                                { x: { xValue: 'Sep' }, y: 50 }, { x: { xValue: 'Oct' }, y: 30 }, { x: { xValue: 'Nov' }, y: 35 }, { x: { xValue: 'Dec' }, y: 35 }
                            ], animation: { enable: false },
                            xName: 'x.xValue', yName: 'y'
                        }
                    ],
                    annotations: [{
                        content: '#template',
                        x: '50%',
                        y: '50%'
                    }, {
                        content: '#template1',
                        x: '50%',
                        y: '50%',
                        region: 'Series'
                    }], title: 'Annotations'
                });
            chartObj.appendTo('#container');
        });

        afterAll((): void => {
            chartObj.destroy();
            chartElement.remove();
            remove(document.getElementById('template'));
            remove(document.getElementById('template1'));
        });

        it('Checking Secondary element child count with error', (done: Function) => {
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Secondary_Element');
                expect(element.children[0].childElementCount).toBe(1);
                done();
            };
            chartObj.refresh();
        });

        it('Checking Secondary element child count without error', (done: Function) => {
            let template1: Element = getElement('template1')
            template1.innerHTML = '<div>${chart.title}</div>';
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Secondary_Element');
                expect(element.children[0].childElementCount).toBe(2);
                done();
            };
            chartObj.refresh();
        });

        it('Checking annotaiton in series region', (done: Function) => {
            let template1: Element = getElement('template1')
            template1.innerHTML = '<div>${chart.title}</div>';
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Secondary_Element');
                expect(element.children[0].childElementCount).toBe(2);
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '335.5px' || (element as HTMLElement).style.left == '341.5px').toBe(true);
                expect((element as HTMLElement).style.top == '218px' || (element as HTMLElement).style.top == '216.5px').toBe(true);
                element = getElement('container_Annotation_1');
                expect((element as HTMLElement).style.left == '311.391px' || (element as HTMLElement).style.left == '317.391px').toBe(true);
                expect((element as HTMLElement).style.top == '226px' || (element as HTMLElement).style.top == '224.5px').toBe(true);
                done();
            };
            chartObj.annotations[0].region = 'Series';
            chartObj.refresh();
        });

        it('Checking annotaiton in point units', (done: Function) => {
            let template1: Element = getElement('template1')
            template1.innerHTML = '<div>${chart.title}</div>';
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left == '342.781px' || (element as HTMLElement).style.left == '348.835px').toBe(true);
                expect((element as HTMLElement).style.top == '136.324px' || (element as HTMLElement).style.top == '134.226px').toBe(true);
                element = getElement('container_Annotation_1');
                expect((element as HTMLElement).style.left == '318.672px' || (element as HTMLElement).style.left == '324.725px').toBe(true);
                expect((element as HTMLElement).style.top == '144.324px' || (element as HTMLElement).style.top == '142.226px').toBe(true);
                done();
            };
            chartObj.annotations[0].coordinateUnits = 'Point';
            chartObj.annotations[1].coordinateUnits = 'Point';
            chartObj.annotations[0].x = 'Jan';
            chartObj.annotations[0].y = 15;
            chartObj.annotations[1].x = 'Jan';
            chartObj.annotations[1].y = 15;
            chartObj.refresh();
        });

        it('Checking annotaiton in point units with yAxis out of x axis label', (done: Function) => {
            let template1: Element = getElement('template1')
            template1.innerHTML = '<div>${chart.title}</div>';
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect(element).toBe(null);
                element = getElement('container_Annotation_1');
                expect((element as HTMLElement).style.left == '318.672px' || (element as HTMLElement).style.left == '324.725px').toBe(true);
                expect((element as HTMLElement).style.top == '144.324px' || (element as HTMLElement).style.top == '142.226px').toBe(true);
                done();
            };
            chartObj.annotations[0].x = 'Annotation';
            chartObj.refresh();
        });
        it('Checking annotation render event', (done: Function) => {
            let template1: Element = getElement('template1')
            template1.innerHTML = '<div>${chart.title}</div>';
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect((element as HTMLElement).style.left).toBe('35px');
                expect((element as HTMLElement).style.top).toBe('33px');
                element = getElement('container_Annotation_1');
                expect((element as HTMLElement).style.left).toBe('10.8906px');
                expect((element as HTMLElement).style.top).toBe('41px');
                done();
            };
            chartObj.annotations[0].x = 'Jan';
            chartObj.annotationRender = (args: IAnnotationRenderEventArgs): void => {
                args.location.x = 50;
                args.location.y = 50;
            }
            chartObj.refresh();
        });

        it('Checking annotation render event with cancel', (done: Function) => {
            let template1: Element = getElement('template1')
            template1.innerHTML = '<div>${chart.title}</div>';
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect(element).toBe(null);
                element = getElement('container_Annotation_1');
                expect(element).toBe(null);
                done();
            };
            chartObj.annotations[0].x = 'Jan';
            chartObj.annotationRender = (args: IAnnotationRenderEventArgs): void => {
                args.cancel = true;
            }
            chartObj.refresh();
        });

        it('Checking set Annotation method', (done: Function) => {
            let template1: Element = getElement('template1')
            template1.innerHTML = '<div>${chart.title}</div>';
            chartObj.loaded = (args: Object): void => {
                element = getElement('container_Annotation_0');
                expect(element).toBe(null);
                element = getElement('container_Annotation_1');
                chartObj.setAnnotationValue(1, '<div>Annotation has been changed</div>');
                element = getElement('container_Annotation_1');
                expect(element.children[0].innerHTML).toBe('Annotation has been changed');
                done();
            };
            chartObj.annotationRender = null;
            chartObj.annotations[0].x = 'Annotation';
            chartObj.refresh();
        });

        it('Checking set annotation method for null parent', (done: Function) => {
            let template1: Element = getElement('template1')
            template1.innerHTML = '<div>${chart.title}</div>';
            chartObj.loaded = (args: Object): void => {
                chartObj.setAnnotationValue(0, '#template1');
                element = getElement('container_Annotation_0');
                expect(element.children[0].innerHTML).toBe('Annotations');
                done();
            };
            chartObj.annotations[0].content = 'y';
            chartObj.annotations[0].x = 'Jan';
            chartObj.annotations[0].y = 15;
            chartObj.annotations[1].content = 'y';           
            chartObj.refresh();
        });
    })
});