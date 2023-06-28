import { Sparkline, SparklineTooltip, SparklineMarkerSettings } from '../../src/sparkline/index';
import { createElement } from '@syncfusion/ej2-base';
import { removeElement, getIdElement, TextOption } from '../../src/sparkline/utils/helper';
import { ISparklineLoadedEventArgs, ISparklineResizeEventArgs, ISeriesRenderingEventArgs, IPointRegionEventArgs, ISparklinePointEventArgs, IDataLabelRenderingEventArgs, IMarkerRenderingEventArgs, IAxisRenderingEventArgs } from '../../src/sparkline/model/interface';
import  {profile , inMB, getMemoryProfile} from '../common.spec';
Sparkline.Inject(SparklineTooltip);
/**
 * Sparkline Test case file
 */

describe('Sparkline Component Base Spec', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Sparkline testing spec', () => {
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'container';
        let ele: Element;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '400px';
            (element as HTMLDivElement).style.height = '100px';
            document.body.appendChild(element);
            sparkline = new Sparkline({
                height: '50px',
                width: '90%',
                lineWidth: 2,
                type: 'Column',
                valueType: 'Category',
                fill: '#3C78EF',
                negativePointColor: '#fc5070',
                format: 'n',
                useGroupingSeparator: true,
                dataSource: [
                    { x: 0, xval: '2005', yval: 24090440 },
                    { x: 1, xval: '2006', yval: 22264080 },
                    { x: 2, xval: '2007', yval: 20434180 },
                    { x: 3, xval: '2008', yval: 21007310 },
                    { x: 4, xval: '2009', yval: 21262640 },
                    { x: 5, xval: '2010', yval: 21515750 },
                    { x: 6, xval: '2011', yval: 21766710 },
                    { x: 7, xval: '2012', yval: 22015580 },
                    { x: 8, xval: '2013', yval: 22262500 },
                    { x: 9, xval: '2014', yval: 22507620 },
                ],
                xName: 'xval', yName: 'yval',
            });
            sparkline.appendTo('#' + id);
        });
        afterAll(() => {
            sparkline.destroy();
            sparkline.sparklineResize(null);
            removeElement(id);
        });
        it('Checking withseries event', (done: Function) => {
            sparkline.seriesRendering = (args: ISeriesRenderingEventArgs) => {
                args.fill = "red";
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_g');
                expect(ele.childElementCount).toBe(10);
                ele = document.getElementById('container_sparkline_column_0');
                expect(ele.getAttribute('fill')).toBe("#00bdae");
                done();
            };
            sparkline.refresh();
        });
        it('Checking with series event line width', (done: Function) => {
            sparkline.seriesRendering = (args: ISeriesRenderingEventArgs) => {
                args.lineWidth = 5;
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_g');
                expect(ele.childElementCount).toBe(1);
                ele = document.getElementById('container_sparkline_line');
                expect(ele.getAttribute('stroke-width')).toBe("5");
                done();
            };
            sparkline.type = "Line";
            sparkline.refresh();
        });
        it('Checking with series event border', (done: Function) => {
            sparkline.seriesRendering = (args: ISeriesRenderingEventArgs) => {
                args.border.color = "red";
                args.border.width = 2;
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_g');
                expect(ele.childElementCount).toBe(10);
                ele = document.getElementById('container_sparkline_column_0');
                expect(ele.getAttribute('stroke-width')).toBe("2");
                expect(ele.getAttribute('stroke')).toBe("red");
                done();
            };
            sparkline.type = "Column";
            sparkline.refresh();
        });
    });
    describe('Sparkline testing spec', () => {
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'container';
        let ele: Element;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '400px';
            (element as HTMLDivElement).style.height = '100px';
            document.body.appendChild(element);
            sparkline = new Sparkline({
                height: '50px',
                width: '90%',
                lineWidth: 2,
                type: 'Column',
                valueType: 'Category',
                fill: '#3C78EF',
                negativePointColor: '#fc5070',
                format: 'n',
                useGroupingSeparator: true,
                dataSource: [
                    { x: 0, xval: '2005', yval: 24090440 },
                    { x: 1, xval: '2006', yval: 23264080 },
                    { x: 2, xval: '2007', yval: 20434180 },
                    { x: 3, xval: '2008', yval: 21007310 },
                    { x: 4, xval: '2009', yval: 21262640 },
                    { x: 5, xval: '2010', yval: 21515750 },
                    { x: 6, xval: '2011', yval: 21766710 },
                    { x: 7, xval: '2012', yval: 22015580 },
                    { x: 8, xval: '2013', yval: 22262500 },
                    { x: 9, xval: '2014', yval: 22507620 },
                ],
                xName: 'xval', yName: 'yval',
            });
            sparkline.appendTo('#' + id);
        });
        afterAll(() => {
            sparkline.destroy();
            sparkline.sparklineResize(null);
            removeElement(id);
        });
        it('Checking with  point event', (done: Function) => {
            sparkline.pointRendering = (args: ISparklinePointEventArgs) => {
                if (args.pointIndex === 1) {
                    args.fill = "red";
                }
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_g');
                expect(ele.childElementCount).toBe(10);
                expect(ele.children[1].getAttribute('fill')).toBe("red");
                done();
            };
            sparkline.refresh();
        });
        it('Checking with  point event border', (done: Function) => {
            sparkline.pointRendering = (args: ISparklinePointEventArgs) => {
                if (args.pointIndex === 1) {
                    args.border.color = 'green';
                    args.border.width = 2;
                }
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_g');
                expect(ele.childElementCount).toBe(10);
                ele = document.getElementById('container_sparkline_column_1')
                expect(ele.getAttribute('fill')).toBe("#00bdae");
                expect(ele.getAttribute('stroke-width')).toBe("2");
                done();
            };
            sparkline.refresh();
        });
        it('Checking with  point event cancel', (done: Function) => {
            sparkline.pointRendering = (args: ISparklinePointEventArgs) => {
                if (args.pointIndex === 1) {
                    args.cancel = true;
                }
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_g');
                expect(ele.childElementCount).toBe(9);
                ele = document.getElementById('container_sparkline_column_2')
                expect(ele.getAttribute('stroke-width')).toBe("0");
                done();
            };
            sparkline.refresh();
        });
    });
    describe('Sparkline testing spec', () => {
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'container';
        let ele: Element;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '400px';
            (element as HTMLDivElement).style.height = '100px';
            document.body.appendChild(element);
            sparkline = new Sparkline({
                height: '50px',
                width: '90%',
                border:{
                    color:'red',
                    width:3
                },
                dataLabelSettings:{
                    visible: ['All'],
                    border:{
                        color:'blue',
                        width:5
                    }
                },
                valueType: 'Numeric',
                dataSource: [
                    { x: 0, xval: '2005', yval: 32805040 },
                    { x: 1, xval: '2006', yval: 33098930 },
                    { x: 2, xval: '2007', yval: 33390140 },
                    { x: 3, xval: '2008', yval: 33212700 },
                    { x: 4, xval: '2009', yval: 33487210 },
                    { x: 5, xval: '2010', yval: 33759740 },
                    { x: 6, xval: '2011', yval: 34030590 },
                    { x: 7, xval: '2012', yval: 34300080 },
                    { x: 8, xval: '2013', yval: 34568210 },
                    { x: 9, xval: '2014', yval: 34834840 },
                ],
                xName: 'xval', yName: 'yval',
            });
            sparkline.appendTo('#' + id);
        });
        afterAll(() => {
            sparkline.destroy();
            sparkline.sparklineResize(null);
            removeElement(id);
        });
        it('Checking with  datalabel Text', (done: Function) => {
            sparkline.dataLabelRendering = (args: IDataLabelRenderingEventArgs) => {
                if (args.pointIndex === 1) {
                    args.text = "Event";
                }
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_label_g');
                expect(ele.childElementCount).toBe(10);
                ele = document.getElementById('container_sparkline_label_g1');
                expect(ele.textContent).toBe("Event");
                done();
            };
            sparkline.refresh();
        });
        it('Checking with  datalabel XY location', (done: Function) => {
            sparkline.dataLabelRendering = (args: IDataLabelRenderingEventArgs) => {
                if (args.pointIndex === 2) {
                    args.x = 100;
                    args.y = 100;
                }
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_label_g');
                expect(ele.childElementCount).toBe(10);
                ele = document.getElementById('container_sparkline_label_g2');
                expect(ele.childElementCount).toBe(2);
                ele = document.getElementById('container_sparkline_label_text_2');
                expect(ele.getAttribute('x')).toBe("100");
                expect(ele.getAttribute('y')).toBe("100");
                done();
            };
            sparkline.refresh();
        });
        it('Checking with  datalabel Event fill', (done: Function) => {
            sparkline.dataLabelRendering = (args: IDataLabelRenderingEventArgs) => {
                if (args.pointIndex === 1) {
                    args.fill = "red";
                }
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_label_g');
                expect(ele.childElementCount).toBe(10);
                ele = document.getElementById('container_sparkline_label_g1');
                expect(ele.childElementCount).toBe(2);
                ele = document.getElementById('container_sparkline_label_rect_1');
                expect(ele.getAttribute('fill')).toBe("red");
                done();
            };
            sparkline.refresh();
        });
        it('Checking with  datalabel Event color', (done: Function) => {
            sparkline.dataLabelRendering = (args: IDataLabelRenderingEventArgs) => {
                if (args.pointIndex === 1) {
                    args.color = "green";
                }
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_label_g');
                expect(ele.childElementCount).toBe(10);
                ele = document.getElementById('container_sparkline_label_g1');
                expect(ele.childElementCount).toBe(2);
                ele = document.getElementById('container_sparkline_label_text_1');
                expect(ele.getAttribute('fill')).toBe("green");
                done();
            };
            sparkline.refresh();
        });
        it('Checking with  datalabel Event border', (done: Function) => {
            sparkline.dataLabelRendering = (args: IDataLabelRenderingEventArgs) => {
                if (args.pointIndex === 1) {
                    args.border.color = 'orange';
                    args.border.width = 2;
                 }
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_label_g');
                expect(ele.childElementCount).toBe(10);
                ele = document.getElementById('container_sparkline_label_g0');
                expect(ele.childElementCount).toBe(2);
                ele = document.getElementById('container_sparkline_label_rect_0');
                expect(ele.getAttribute('stroke')).toBe("blue");
                expect(ele.getAttribute('stroke-width')).toBe("5");
                done();
            };
            sparkline.refresh();
        });
        it('Checking with  datalabel Event cancel', (done: Function) => {
            sparkline.dataLabelRendering = (args: IDataLabelRenderingEventArgs) => {
                if (args.pointIndex === 3) {
                    args.cancel = true;
                 }
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_label_g');
                expect(ele.childElementCount).toBe(9);
                ele = document.getElementById('container_sparkline_label_g1');
                expect(ele.childElementCount).toBe(2);
                ele = document.getElementById('container_sparkline_label_rect_1');
                expect(ele.getAttribute('stroke')).toBe("orange");
                expect(ele.getAttribute('stroke-width')).toBe("2");
                done();
            };
            sparkline.refresh();
        });
    });
    describe('Sparkline testing spec', () => {
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'container';
        let ele: Element;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '400px';
            (element as HTMLDivElement).style.height = '100px';
            document.body.appendChild(element);
            sparkline = new Sparkline({
                height: '50px',
                width: '90%',
                lineWidth: 2,
                type: 'Line',
                valueType: 'Category',
                fill: '#3C78EF',
                negativePointColor: '#fc5070',
                format: 'n',
                useGroupingSeparator: true,
                dataSource: [
                    { x: 0, xval: '2005', yval: 20090440 },
                    { x: 1, xval: '2006', yval: 20264080 },
                    { x: 2, xval: '2007', yval: 20434180 },
                    { x: 3, xval: '2008', yval: 21007310 },
                    { x: 4, xval: '2009', yval: 21262640 },
                    { x: 5, xval: '2010', yval: 21515750 },
                    { x: 6, xval: '2011', yval: 21766710 },
                    { x: 7, xval: '2012', yval: 22015580 },
                    { x: 8, xval: '2013', yval: 22262500 },
                    { x: 9, xval: '2014', yval: 22507620 },
                ],
                dataLabelSettings:{
                    visible:['All']
                },
                markerSettings:{
                   visible:['All']
                },
                xName: 'xval', yName: 'yval'
            });
            sparkline.appendTo('#' + id);
        });
        afterAll(() => {
            sparkline.destroy();
            sparkline.sparklineResize(null);
            removeElement(id);
        });
        it('Checking with Marker event XY Location', (done: Function) => {
            sparkline.markerRendering = (args: IMarkerRenderingEventArgs) => {
                if (args.pointIndex === 1) {
                    args.x = 100;
                    args.y = 100;
                }
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_marker_g');
                expect(ele.childElementCount).toBe(10);
                ele = document.getElementById('container_sparkline_marker_1');
                expect(ele !== null).toBe(true);
                done();
            };
            sparkline.refresh();
        });
        it('Checking with Marker event size', (done: Function) => {
            sparkline.markerRendering = (args: IMarkerRenderingEventArgs) => {
                if (args.pointIndex === 1) {
                    args.size = 10;
                }
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_marker_g');
                expect(ele.childElementCount).toBe(10);
                ele = document.getElementById('container_sparkline_marker_1');
                expect(ele.getAttribute('r')).toBe("5");
                done();
            };
            sparkline.refresh();
        });
        it('Checking with Marker event border', (done: Function) => {
            sparkline.markerRendering = (args: IMarkerRenderingEventArgs) => {
                if (args.pointIndex === 1) {
                    args.border.color = "lime";
                    args.border.width = 2;
                }
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_marker_g');
                expect(ele.childElementCount).toBe(10);
                ele = document.getElementById('container_sparkline_marker_1');
                expect(ele.getAttribute('stroke')).toBe("lime");
                expect(ele.getAttribute('stroke-width')).toBe("2");
                done();
            };
            sparkline.refresh();
        });
    });
    describe('Sparkline testing spec', () => {
        let element: Element;
        let sparkline: Sparkline;
        let id: string = 'container';
        let ele: Element;
        let d: string[];
        beforeAll(() => {
            element = createElement('div', { id: id });
            (element as HTMLDivElement).style.width = '400px';
            (element as HTMLDivElement).style.height = '100px';
            document.body.appendChild(element);
            sparkline = new Sparkline({
                height: '50px',
                width: '90%',
                lineWidth: 2,
                type: 'Line',
                valueType: 'Category',
                fill: '#3C78EF',
                negativePointColor: '#fc5070',
                format: 'n',
                axisSettings: {
                    lineSettings: {
                        visible: true
                    }
                },
                useGroupingSeparator: true,
                dataSource: [
                    { x: 0, xval: '2005', yval: 20090440 },
                    { x: 1, xval: '2006', yval: 20264080 },
                    { x: 2, xval: '2007', yval: 20434180 },
                    { x: 3, xval: '2008', yval: 21007310 },
                    { x: 4, xval: '2009', yval: 21262640 },
                    { x: 5, xval: '2010', yval: 21515750 },
                    { x: 6, xval: '2011', yval: 21766710 },
                    { x: 7, xval: '2012', yval: 22015580 },
                    { x: 8, xval: '2013', yval: 22262500 },
                    { x: 9, xval: '2014', yval: 22507620 },
                ],
                xName: 'xval', yName: 'yval',
            });
            sparkline.appendTo('#' + id);
        });
        afterAll(() => {
            sparkline.destroy();
            sparkline.sparklineResize(null);
            removeElement(id);
        });
        it('Checking with axis label event maxY', (done: Function) => {
            sparkline.axisRendering = (args: IAxisRenderingEventArgs) => {
                args.maxY = 25000000
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_sparkline_g');
                expect(ele !== null).toBe(true);
                done();
            };
            sparkline.refresh();
        });
        it('Checking with axis label event minY', (done: Function) => {
            sparkline.axisRendering = (args: IAxisRenderingEventArgs) => {
                args.minY = 19000000
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_Sparkline_XAxis');
                expect(ele !== null).toBe(true);
                done();
            };
            sparkline.refresh();
        });
        it('Checking with axis label event minX', (done: Function) => {
            sparkline.axisRendering = (args: IAxisRenderingEventArgs) => {
                args.minX = 5;
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_Sparkline_XAxis');
                expect(ele != null).toBe(true);
                done();
            };
            sparkline.refresh();
        });
        it('Checking with axis label event maxX', (done: Function) => {
            sparkline.axisRendering = (args: IAxisRenderingEventArgs) => {
                args.maxX = 6;
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_Sparkline_XAxis');
                expect(ele !== null).toBe(true);
                done();
            };
            sparkline.refresh();
        });
        it('Checking with axis label event Line color', (done: Function) => {
            sparkline.axisRendering = (args: IAxisRenderingEventArgs) => {
                args.lineColor = "red";
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_Sparkline_XAxis');
                expect(ele.getAttribute('stroke')).toBe("red");
                done();
            };
            sparkline.refresh();
        });
        it('Checking with axis label event Line width', (done: Function) => {
            sparkline.axisRendering = (args: IAxisRenderingEventArgs) => {
                args.lineWidth = 2;
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_Sparkline_XAxis');
                expect(ele.getAttribute('stroke-width')).toBe("2");
                done();
            };
            sparkline.refresh();
        });
        it('Checking with axis label event value', (done: Function) => {
            sparkline.axisRendering = (args: IAxisRenderingEventArgs) => {
                args.value = 21007310;
            };
            sparkline.loaded = (args: ISparklineLoadedEventArgs): void => {
                ele = document.getElementById('container_Sparkline_XAxis');
                expect(ele !== null).toBe(true);
                done();
            };
            sparkline.refresh();
        });
    });
});