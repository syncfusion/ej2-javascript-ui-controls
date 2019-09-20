import {
    Smithchart, ISmithchartLoadedEventArgs, ISmithchartLoadEventArgs, ITitleRenderEventArgs,
    ISubTitleRenderEventArgs, ISmithchartAxisLabelRenderEventArgs, ISmithchartLegendRenderEventArgs,
    ISmithchartSeriesRenderEventArgs, ISmithchartTextRenderEventArgs
} from '../../../src/smithchart/index';
import { EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { profile, inMB, getMemoryProfile } from '../../common.spec';


export function getElementByID(id: string): Element {
    return document.getElementById(id);
}
describe('Smithchart tooltip spec', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Events spec', () => {
        let id: string = 'container';
        let smithchart: Smithchart;
        let ele: HTMLDivElement;
        let svg: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            smithchart = new Smithchart({
                title: {
                    visible: true,
                    text: 'Transmission details'
                },
                radialAxis: {
                    visible: false,
                    labelIntersectAction: 'Hide',
                },
                series: [{
                    points: [
                        { resistance: 10, reactance: 25 }, { resistance: 8, reactance: 6 },
                        { resistance: 6, reactance: 4.5 }, { resistance: 4.5, reactance: 2 },
                        { resistance: 3.5, reactance: 1.6 }, { resistance: 2.5, reactance: 1.3 },
                        { resistance: 2, reactance: 1.2 }, { resistance: 1.5, reactance: 1 },
                        { resistance: 1, reactance: 0.8 }, { resistance: 0.5, reactance: 0.4 },
                        { resistance: 0.3, reactance: 0.2 }, { resistance: 0, reactance: 0.15 },
                    ],
                    name: 'Transmission1',
                    enableAnimation: true,
                    tooltip: { visible: true },
                    marker: {
                        shape: 'Circle',
                        visible: true,
                        border: { width: 2 }
                    }
                }
                ],
            });
            smithchart.appendTo('#container');
        });
        afterAll(() => {
            remove(ele);
            smithchart.destroy();
        });
        it('Checking Load Event', (done: Function) => {
            smithchart.load = (args: ISmithchartLoadEventArgs) => {
                args.smithchart.export('PNG', 'Smith chart');
            };
            smithchart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                svg = document.getElementById('container_svg_horizontalAxisMajorGridLines');
                expect(svg !== null).toBe(true);
                done();
            };
            smithchart.refresh();
        });
        it('Checking title Event', (done: Function) => {
            smithchart.titleRender = (args: ITitleRenderEventArgs) => {
                args.text = 'Transmission of resistance value';
            };
            smithchart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                svg = document.getElementById('container_Title_Group');
                expect(svg.childElementCount).toBe(1);
                svg = document.getElementById('container_Smithchart_title');
                expect(svg.textContent).toBe("Transmission of resistance value");
                done();
            };
            smithchart.title.text = "Transmission of resistance value";
            smithchart.refresh();
        });
        it('Checking axis Label location', (done: Function) => {
            smithchart.axisLabelRender = (args: ISmithchartAxisLabelRenderEventArgs): void => {
                if (args.text === '0.5') {
                    args.x = 700;
                    args.y = 100;
                }
            };
            smithchart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                svg = document.getElementById('container_HAxisLabels');
                expect(svg.childElementCount).toBe(12);
                expect(svg.children[2].textContent).toBe("0.5");
                svg = document.getElementById('container_HLabel_3');
                expect(svg.getAttribute('x')).toBe("700");
                expect(svg.getAttribute('y')).toBe("100");
                done();
            };
            smithchart.series[0].marker.shape = "Circle";
            smithchart.legendSettings.visible = true;
            smithchart.refresh();
        });
        it('Checking load event', (done: Function) => {
            smithchart.load = (args: ISmithchartLoadEventArgs): void => {
                args.smithchart.title.text = 'Title text changed by load event'
            };
            smithchart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                svg = document.getElementById('container_Title_Group');
                expect(svg.childElementCount).toBe(1);
                expect(svg.children[0].textContent).toBe("Transmission of resistance value");
                done();
            };
            smithchart.title.text = "Title text changed by load event";
            smithchart.refresh();
        });
        it('Checking legend event fill', (done: Function) => {
            smithchart.legendRender = (args: ISmithchartLegendRenderEventArgs): void => {
                args.fill = 'red'
            };
            smithchart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                svg = document.getElementById('container_svg_Legend0');
                expect(svg.childElementCount).toBe(2);
                svg = document.getElementById('container_svg_LegendItemShape0');
                expect(svg.getAttribute('fill')).toBe("red");
                done();
            };
            smithchart.series[0].name = "Transmission2";
            smithchart.legendSettings.visible = true;
            smithchart.refresh();
        });
        it('Checking legend event cancel', (done: Function) => {
            smithchart.legendRender = (args: ISmithchartLegendRenderEventArgs): void => {
                args.cancel = false;
            };
            smithchart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                svg = document.getElementById('container_svg_Legend0');
                expect(svg.childElementCount).toBe(2);
                svg = document.getElementById('container_svg_LegendItemShape0');
                expect(svg.getAttribute('fill')).toBe("#00bdae");
                done();
            };
            smithchart.series[0].name = "Transmission2";
            smithchart.legendSettings.visible = true;
            smithchart.refresh();
        });
        it('Checking legend event text', (done: Function) => {
            smithchart.legendRender = (args: ISmithchartLegendRenderEventArgs): void => {
                args.text = 'LegendEvent Text';
            };
            smithchart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                svg = document.getElementById('container_svg_Legend0');
                expect(svg.childElementCount).toBe(2);
                svg = document.getElementById('container_LegendItemText0');
                expect(svg.textContent).toBe("LegendEvent Text");
                done();
            };
            smithchart.series[0].name = "Transmission2";
            smithchart.legendSettings.visible = true;
            smithchart.refresh();
        });
        it('Checking legend event stroke', (done: Function) => {
            smithchart.seriesRender = (args: ISmithchartSeriesRenderEventArgs): void => {
                if (args.text === 'Transmission1') {
                    args.fill = 'red';
                }
            };
            smithchart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                svg = document.getElementById('container_svg0');
                expect(svg.childElementCount).toBe(1);
                svg = document.getElementById('container_series0_points');
                expect(svg.getAttribute('stroke')).toBe("red");
                done();
            };
            smithchart.series[0].name = "Transmission1";
            smithchart.refresh();
        });
        it('Checking subtitle event X', (done: Function) => {
            smithchart.subtitleRender = (args: ISubTitleRenderEventArgs): void => {
                args.x = 500;
            };
            smithchart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                svg = document.getElementById('container_Title_Group');
                expect(svg.childElementCount).toBe(2);
                svg = document.getElementById('container_Smithchart_title');
                expect(svg !== null).toBe(true);
                done();
            };
            smithchart.series[0].name = "Transmission1";
            smithchart.title.text = "Transmission details";
            smithchart.title.subtitle.text = "Sub Title";
            smithchart.refresh();
        });
        it('Checking subtitle event Y ', (done: Function) => {
            smithchart.subtitleRender = (args: ISubTitleRenderEventArgs): void => {
                args.y = 150;
            };
            smithchart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                svg = document.getElementById('container_Title_Group');
                expect(svg.children[1].getAttribute('y')).toBe("150");
                done();
            };
            smithchart.title.text = "Transmission details";
            smithchart.title.subtitle.text = "Sub Title";
            smithchart.refresh();
        });
        it('Checking loaded event', (done: Function) => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                smithchart.title.text = "Loaded Event";
            };
            smithchart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                svg = document.getElementById('container_Title_Group');
                expect(svg.childElementCount).toBe(2);
                expect(svg.children[0].textContent).toBe("Transmission of resistance value");
                done();
            };
            smithchart.legendSettings.visible = true;
            smithchart.legendSettings.shape = "Circle";
            smithchart.refresh();
        });
    });
    describe('Events spec', () => {
        let id: string = 'container';
        let smithchart: Smithchart;
        let ele: HTMLDivElement;
        let svg: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            smithchart = new Smithchart({
                title: {
                    visible: true,
                    text: 'Transmission details'
                },
                series: [
                    {
                        points: [
                            { resistance: 10, reactance: 25 }, { resistance: 8, reactance: 6 },
                            { resistance: 6, reactance: 4.5 }, { resistance: 4.5, reactance: 2 },
                            { resistance: 3.5, reactance: 1.6 }, { resistance: 2.5, reactance: 1.3 },
                            { resistance: 2, reactance: 1.2 }, { resistance: 1.5, reactance: 1 },
                            { resistance: 1, reactance: 0.8 }, { resistance: 0.5, reactance: 0.4 },
                            { resistance: 0.3, reactance: 0.2 }, { resistance: 0, reactance: 0.15 },
                        ],
                        name: 'Transmission1',
                        enableAnimation: true,
                        tooltip: { visible: true },
                        marker: {
                            dataLabel: {
                                visible: true,
                            }
                        }
                    },
                ],
                legendSettings: {
                    visible: true,
                    shape: 'Circle'
                },
            });
            smithchart.appendTo('#container');
        });
        afterAll(() => {
            remove(ele);
            smithchart.destroy();
        });
        it('Checking Datalabel Event', (done: Function) => {
            smithchart.textRender = (args: ISmithchartTextRenderEventArgs) => {
                if ((args.seriesIndex === 0) && (args.pointIndex === 0)) {
                    args.text = "Event";
                }
            };
            smithchart.loaded = (args: ISmithchartLoadedEventArgs): void => {
                svg = document.getElementById('container_svg_series0_Datalabel');
                expect(svg.childElementCount).toBe(24);
                svg = document.getElementById('container_Series0_Points0_dataLabel_displayText0')
                expect(svg.textContent).toBe("Event");
                done();
            };
            smithchart.refresh();
        });
    });
});