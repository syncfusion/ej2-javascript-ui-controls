import { Smithchart, SmithchartLegend, TooltipRender, ISmithchartLoadedEventArgs } from '../../../src/smithchart/index';
import { createElement, remove } from '@syncfusion/ej2-base';
import { MouseEvents } from '../base/events.spec';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';

Smithchart.Inject(SmithchartLegend, TooltipRender);

/**
 * theme spec
 */
describe('Smithchart legend properties tesing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe(' default themes testing', () => {
        let id: string = 'smithchart';
        let smithchart: Smithchart;
        let ele: HTMLDivElement;
        let targetElement: HTMLElement;
        let tooltipElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            smithchart = new Smithchart({
                title:{
                    text:'Impedance Transmission'
                },
                horizontalAxis: {
                    minorGridLines: {
                        visible: true
                    },
                    majorGridLines:{
                        visible: true
                    }
                },
            series: [{
                points: [
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0.3, reactance: 0.1 },
                    { resistance: 0.3, reactance: 0.1 }, { resistance: 0.3, reactance: 0.1 },
                    { resistance: 0.3, reactance: 0.1 }, { resistance: 0.5, reactance: 0.2 },
                    { resistance: 1.0, reactance: 0.4 },
                    { resistance: 1.5, reactance: 0.5 }, { resistance: 2.0, reactance: 0.5 },
                    { resistance: 2.5, reactance: 0.4 }, { resistance: 3.5, reactance: 0.0 },
                    { resistance: 4.5, reactance: -0.5 }, { resistance: 5.0, reactance: -1.0 }
                ],
                name: 'Transmission1',
                tooltip: { visible: true },
                marker: {
                    visible: true,
                   dataLabel:{
                       visible: true
                   }
                }
            }],
            legendSettings: {
                visible: true,
            }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            smithchart.destroy();
        });

        it('Checking with axis Label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_RLabel_0');
                expect(element.getAttribute('fill')).toEqual('#686868');
            };
            smithchart.refresh();
        });
        it('Checking with axis Line', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
                expect(element.getAttribute('stroke')).toEqual('#00bdae');
            };
            smithchart.refresh();
        });
        it('Checking with major GridLine', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_horizontalAxisMajorGridLines');
                expect(element.getAttribute('stroke')).toEqual('#dbdbdb');
            };
            smithchart.refresh();
        });
        it('Checking with minor GridLine', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_horizontalAxisMinorGridLines');
                expect(element.getAttribute('stroke')).toEqual('#eaeaea');
            };
            smithchart.refresh();
        });
        it('Checking with chartTitle', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Smithchart_title');
                expect(element.getAttribute('fill')).toEqual('#424242');
            };
            smithchart.refresh();
        });
        it('Checking with legend label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_LegendItemText0');
                expect(element.getAttribute('fill')).toEqual('#353535');
            };
            smithchart.refresh();
        });
        it('Checking with background', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_SmithchartBorder');
                expect(element.getAttribute('fill')).toEqual('#FFFFFF');
            };
            smithchart.refresh();
        });
        it('Checking with data label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_symbol0');
                expect(element.getAttribute('fill')).toEqual('#00bdae');
            };
            smithchart.refresh();
        });
        it('Checking with data label font family', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_displayText0');
                expect(element.getAttribute('font-family')).toEqual('Roboto, Segoe UI, Noto, Sans-serif');
            };
            smithchart.refresh();
        });
        it('Checking with data label font size', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_displayText0');
                expect(element.getAttribute('font-size')).toEqual('12px');
            };
            smithchart.refresh();
        });
        // it('tooltip checking with mouse move', (done: Function) => {
        //     smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
        //         let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
        //         trigger.mousemoveEvent(element, 0, 0, 50, 255);
        //         debugger;
        //         element = document.getElementById(smithchart.element.id + '_smithchart_tooltip_div_text');
        //         expect(element.getAttribute('fill')).toBe('rgba(0, 8, 22, 0.75)');
        //         trigger.mousemoveEvent(element, 0, 0, 35, 255);
        //         done();
        //     };
        //     smithchart.refresh();
        // });
        
    });
    describe('Material themes testing', () => {
        let id: string = 'smithchart';
        let smithchart: Smithchart;
        let ele: HTMLDivElement;
        let targetElement: HTMLElement;
        let tooltipElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            smithchart = new Smithchart({
                theme :'MaterialDark',
                title:{
                    text:'Impedance Transmission'
                },
                horizontalAxis: {
                    minorGridLines: {
                        visible: true
                    },
                    majorGridLines:{
                        visible: true
                    }
                },
            series: [{
                points: [
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0.3, reactance: 0.1 },
                    { resistance: 0.3, reactance: 0.1 }, { resistance: 0.3, reactance: 0.1 },
                    { resistance: 0.3, reactance: 0.1 }, { resistance: 0.5, reactance: 0.2 },
                    { resistance: 1.0, reactance: 0.4 },
                    { resistance: 1.5, reactance: 0.5 }, { resistance: 2.0, reactance: 0.5 },
                    { resistance: 2.5, reactance: 0.4 }, { resistance: 3.5, reactance: 0.0 },
                    { resistance: 4.5, reactance: -0.5 }, { resistance: 5.0, reactance: -1.0 }
                ],
                name: 'Transmission1',
                tooltip: { visible: true },
                marker: {
                    visible: true,
                   dataLabel:{
                       visible: true
                   }
                }
            }],
            legendSettings: {
                visible: true,
            }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            smithchart.destroy();
        });

        it('Checking with axis Label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_RLabel_0');
                expect(element.getAttribute('fill')).toEqual('#DADADA');
            };
            smithchart.refresh();
        });
        it('Checking with axis Line', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
                expect(element.getAttribute('stroke')).toEqual('#00bdae');
            };
            smithchart.refresh();
        });
        it('Checking with major GridLine', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_horizontalAxisMajorGridLines');
                expect(element.getAttribute('stroke')).toEqual('#414040');
            };
            smithchart.refresh();
        });
        it('Checking with minor GridLine', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_horizontalAxisMinorGridLines');
                expect(element.getAttribute('stroke')).toEqual('#514F4F');
            };
            smithchart.refresh();
        });
        it('Checking with chartTitle', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Smithchart_title');
                expect(element.getAttribute('fill')).toEqual('#ffffff');
            };
            smithchart.refresh();
        });
        it('Checking with legend label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_LegendItemText0');
                expect(element.getAttribute('fill')).toEqual('#DADADA');
            };
            smithchart.refresh();
        });
        it('Checking with background', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_SmithchartBorder');
                expect(element.getAttribute('fill')).toEqual('#000000');
            };
            smithchart.refresh();
        });
        it('Checking with data label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_symbol0');
                expect(element.getAttribute('fill')).toEqual('#00bdae');
            };
            smithchart.refresh();
        });
        it('Checking with data label font family', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_displayText0');
                expect(element.getAttribute('font-family')).toEqual('Roboto, Segoe UI, Noto, Sans-serif');
            };
            smithchart.refresh();
        });
        it('Checking with data label font size', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_displayText0');
                expect(element.getAttribute('font-size')).toEqual('12px');
            };
            smithchart.refresh();
        });
        // it('tooltip checking with mouse move', (done: Function) => {
        //     smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
        //         let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
        //         trigger.mousemoveEvent(element, 0, 0, 50, 255);
        //         debugger;
        //         element = document.getElementById(smithchart.element.id + '_smithchart_tooltip_div_text');
        //         expect(element.getAttribute('fill')).toBe('rgba(0, 8, 22, 0.75)');
        //         trigger.mousemoveEvent(element, 0, 0, 35, 255);
        //         done();
        //     };
        //     smithchart.refresh();
        // });
        
    });
    describe('High Contrast themes testing', () => {
        let id: string = 'smithchart';
        let smithchart: Smithchart;
        let ele: HTMLDivElement;
        let targetElement: HTMLElement;
        let tooltipElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            smithchart = new Smithchart({
                theme :'HighContrast',
                title:{
                    text:'Impedance Transmission'
                },
                horizontalAxis: {
                    minorGridLines: {
                        visible: true
                    },
                    majorGridLines:{
                        visible: true
                    }
                },
            series: [{
                points: [
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0.3, reactance: 0.1 },
                    { resistance: 0.3, reactance: 0.1 }, { resistance: 0.3, reactance: 0.1 },
                    { resistance: 0.3, reactance: 0.1 }, { resistance: 0.5, reactance: 0.2 },
                    { resistance: 1.0, reactance: 0.4 },
                    { resistance: 1.5, reactance: 0.5 }, { resistance: 2.0, reactance: 0.5 },
                    { resistance: 2.5, reactance: 0.4 }, { resistance: 3.5, reactance: 0.0 },
                    { resistance: 4.5, reactance: -0.5 }, { resistance: 5.0, reactance: -1.0 }
                ],
                name: 'Transmission1',
                tooltip: { visible: true },
                marker: {
                    visible: true,
                   dataLabel:{
                       visible: true
                   }
                }
            }],
            legendSettings: {
                visible: true,
            }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            smithchart.destroy();
        });

        it('Checking with axis Label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_RLabel_0');
                expect(element.getAttribute('fill')).toEqual('#ffffff');
            };
            smithchart.refresh();
        });
        it('Checking with axis Line', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
                expect(element.getAttribute('stroke')).toEqual('#00bdae');
            };
            smithchart.refresh();
        });
        it('Checking with major GridLine', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_horizontalAxisMajorGridLines');
                expect(element.getAttribute('stroke')).toEqual('#BFBFBF');
            };
            smithchart.refresh();
        });
        it('Checking with minor GridLine', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_horizontalAxisMinorGridLines');
                expect(element.getAttribute('stroke')).toEqual('#969696');
            };
            smithchart.refresh();
        });
        it('Checking with chartTitle', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Smithchart_title');
                expect(element.getAttribute('fill')).toEqual('#ffffff');
            };
            smithchart.refresh();
        });
        it('Checking with legend label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_LegendItemText0');
                expect(element.getAttribute('fill')).toEqual('#ffffff');
            };
            smithchart.refresh();
        });
        it('Checking with background', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_SmithchartBorder');
                expect(element.getAttribute('fill')).toEqual('#000000');
            };
            smithchart.refresh();
        });
        it('Checking with data label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_symbol0');
                expect(element.getAttribute('fill')).toEqual('#00bdae');
            };
            smithchart.refresh();
        });
        it('Checking with data label font family', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_displayText0');
                expect(element.getAttribute('font-family')).toEqual('Roboto, Segoe UI, Noto, Sans-serif');
            };
            smithchart.refresh();
        });
        it('Checking with data label font size', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_displayText0');
                expect(element.getAttribute('font-size')).toEqual('12px');
            };
            smithchart.refresh();
        });
        // it('tooltip checking with mouse move', (done: Function) => {
        //     smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
        //         let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
        //         trigger.mousemoveEvent(element, 0, 0, 50, 255);
        //         debugger;
        //         element = document.getElementById(smithchart.element.id + '_smithchart_tooltip_div_text');
        //         expect(element.getAttribute('fill')).toBe('rgba(0, 8, 22, 0.75)');
        //         trigger.mousemoveEvent(element, 0, 0, 35, 255);
        //         done();
        //     };
        //     smithchart.refresh();
        // });
        
    });
    describe('Bootstrap4 themes testing', () => {
        let id: string = 'smithchart';
        let smithchart: Smithchart;
        let ele: HTMLDivElement;
        let targetElement: HTMLElement;
        let tooltipElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            smithchart = new Smithchart({
                theme :'Bootstrap4',
                title:{
                    text:'Impedance Transmission'
                },
                horizontalAxis: {
                    minorGridLines: {
                        visible: true
                    },
                    majorGridLines:{
                        visible: true
                    }
                },
            series: [{
                points: [
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0.3, reactance: 0.1 },
                    { resistance: 0.3, reactance: 0.1 }, { resistance: 0.3, reactance: 0.1 },
                    { resistance: 0.3, reactance: 0.1 }, { resistance: 0.5, reactance: 0.2 },
                    { resistance: 1.0, reactance: 0.4 },
                    { resistance: 1.5, reactance: 0.5 }, { resistance: 2.0, reactance: 0.5 },
                    { resistance: 2.5, reactance: 0.4 }, { resistance: 3.5, reactance: 0.0 },
                    { resistance: 4.5, reactance: -0.5 }, { resistance: 5.0, reactance: -1.0 }
                ],
                name: 'Transmission1',
                tooltip: { visible: true },
                marker: {
                    visible: true,
                   dataLabel:{
                       visible: true
                   }
                }
            }],
            legendSettings: {
                visible: true,
            }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            smithchart.destroy();
        });

        it('Checking with axis Label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_RLabel_0');
                expect(element.getAttribute('fill')).toEqual('#212529');
            };
            smithchart.refresh();
        });
        it('Checking with axis Line', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
                expect(element.getAttribute('stroke')).toEqual('#00bdae');
            };
            smithchart.refresh();
        });
        it('Checking with major GridLine', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_horizontalAxisMajorGridLines');
                expect(element.getAttribute('stroke')).toEqual('#CED4DA');
            };
            smithchart.refresh();
        });
        it('Checking with minor GridLine', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_horizontalAxisMinorGridLines');
                expect(element.getAttribute('stroke')).toEqual('#DEE2E6');
            };
            smithchart.refresh();
        });
        it('Checking with chartTitle', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Smithchart_title');
                expect(element.getAttribute('fill')).toEqual('#212529');
            };
            smithchart.refresh();
        });
        it('Checking with legend label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_LegendItemText0');
                expect(element.getAttribute('fill')).toEqual('#212529');
            };
            smithchart.refresh();
        });
        it('Checking with background', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_SmithchartBorder');
                expect(element.getAttribute('fill')).toEqual('#FFFFFF');
            };
            smithchart.refresh();
        });
        it('Checking with data label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_symbol0');
                expect(element.getAttribute('fill')).toEqual('#00bdae');
            };
            smithchart.refresh();
        });
        it('Checking with data label font family', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_displayText0');
                expect(element.getAttribute('font-family')).toEqual('Roboto, Segoe UI, Noto, Sans-serif');
            };
            smithchart.refresh();
        });
        it('Checking with data label font size', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_displayText0');
                expect(element.getAttribute('font-size')).toEqual('12px');
            };
            smithchart.refresh();
        });
        // it('tooltip checking with mouse move', (done: Function) => {
        //     smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
        //         let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
        //         trigger.mousemoveEvent(element, 0, 0, 50, 255);
        //         debugger;
        //         element = document.getElementById(smithchart.element.id + '_smithchart_tooltip_div_text');
        //         expect(element.getAttribute('fill')).toBe('rgba(0, 8, 22, 0.75)');
        //         trigger.mousemoveEvent(element, 0, 0, 35, 255);
        //         done();
        //     };
        //     smithchart.refresh();
        // });
        
    });
	describe('Tailwind themes testing', () => {
        let id: string = 'smithchart';
        let smithchart: Smithchart;
        let ele: HTMLDivElement;
        let targetElement: HTMLElement;
        let tooltipElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            smithchart = new Smithchart({
                theme :'Tailwind',
                title:{
                    text:'Impedance Transmission'
                },
                horizontalAxis: {
                    minorGridLines: {
                        visible: true
                    },
                    majorGridLines:{
                        visible: true
                    }
                },
            series: [{
                points: [
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0.3, reactance: 0.1 },
                    { resistance: 0.3, reactance: 0.1 }, { resistance: 0.3, reactance: 0.1 },
                    { resistance: 0.3, reactance: 0.1 }, { resistance: 0.5, reactance: 0.2 },
                    { resistance: 1.0, reactance: 0.4 },
                    { resistance: 1.5, reactance: 0.5 }, { resistance: 2.0, reactance: 0.5 },
                    { resistance: 2.5, reactance: 0.4 }, { resistance: 3.5, reactance: 0.0 },
                    { resistance: 4.5, reactance: -0.5 }, { resistance: 5.0, reactance: -1.0 }
                ],
                name: 'Transmission1',
                tooltip: { visible: true },
                marker: {
                    visible: true,
                   dataLabel:{
                       visible: true
                   }
                }
            }],
            legendSettings: {
                visible: true,
            }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            smithchart.destroy();
        });

        it('Checking with axis Label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_RLabel_0');
                expect(element.getAttribute('fill')).toEqual('#6B7280');
            };
            smithchart.refresh();
        });
        it('Checking with major GridLine', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_horizontalAxisMajorGridLines');
                expect(element.getAttribute('stroke')).toEqual('#E5E7EB');
            };
            smithchart.refresh();
        });
        it('Checking with minor GridLine', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_horizontalAxisMinorGridLines');
                expect(element.getAttribute('stroke')).toEqual('#D1D5DB');
            };
            smithchart.refresh();
        });
        it('Checking with chartTitle', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Smithchart_title');
                expect(element.getAttribute('fill')).toEqual('#374151');
            };
            smithchart.refresh();
        });
        it('Checking with legend label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_LegendItemText0');
                expect(element.getAttribute('fill')).toEqual('#374151');
            };
            smithchart.refresh();
        });
        it('Checking with background', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_SmithchartBorder');
                expect(element.getAttribute('fill')).toEqual('#FFFFFF');
            };
            smithchart.refresh();
        });
        it('Checking with data label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_symbol0');
                expect(element.getAttribute('fill')).toEqual('#5A61F6');
            };
            smithchart.refresh();
        });
        it('Checking with data label font family', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_displayText0');
                expect(element.getAttribute('font-family')).toEqual('Roboto, Segoe UI, Noto, Sans-serif');
            };
            smithchart.refresh();
        });
        it('Checking with data label font size', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_displayText0');
                expect(element.getAttribute('font-size')).toEqual('12px');
            };
            smithchart.refresh();
        });
        
        
    });
	describe('TailwindDark themes testing', () => {
        let id: string = 'smithchart';
        let smithchart: Smithchart;
        let ele: HTMLDivElement;
        let targetElement: HTMLElement;
        let tooltipElement: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            smithchart = new Smithchart({
                theme :'TailwindDark',
                title:{
                    text:'Impedance Transmission'
                },
                horizontalAxis: {
                    minorGridLines: {
                        visible: true
                    },
                    majorGridLines:{
                        visible: true
                    }
                },
            series: [{
                points: [
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0, reactance: 0.05 },
                    { resistance: 0, reactance: 0.05 }, { resistance: 0.3, reactance: 0.1 },
                    { resistance: 0.3, reactance: 0.1 }, { resistance: 0.3, reactance: 0.1 },
                    { resistance: 0.3, reactance: 0.1 }, { resistance: 0.5, reactance: 0.2 },
                    { resistance: 1.0, reactance: 0.4 },
                    { resistance: 1.5, reactance: 0.5 }, { resistance: 2.0, reactance: 0.5 },
                    { resistance: 2.5, reactance: 0.4 }, { resistance: 3.5, reactance: 0.0 },
                    { resistance: 4.5, reactance: -0.5 }, { resistance: 5.0, reactance: -1.0 }
                ],
                name: 'Transmission1',
                tooltip: { visible: true },
                marker: {
                    visible: true,
                   dataLabel:{
                       visible: true
                   }
                }
            }],
            legendSettings: {
                visible: true,
            }
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            smithchart.destroy();
        });

        it('Checking with axis Label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_RLabel_0');
                expect(element.getAttribute('fill')).toEqual('#9CA3AF');
            };
            smithchart.refresh();
        });
        it('Checking with major GridLine', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_horizontalAxisMajorGridLines');
                expect(element.getAttribute('stroke')).toEqual('#374151');
            };
            smithchart.refresh();
        });
        it('Checking with minor GridLine', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_horizontalAxisMinorGridLines');
                expect(element.getAttribute('stroke')).toEqual('#4B5563');
            };
            smithchart.refresh();
        });
        it('Checking with chartTitle', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Smithchart_title');
                expect(element.getAttribute('fill')).toEqual('#D1D5DB');
            };
            smithchart.refresh();
        });
        it('Checking with legend label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_LegendItemText0');
                expect(element.getAttribute('fill')).toEqual('#D1D5DB');
            };
            smithchart.refresh();
        });
        it('Checking with background', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_SmithchartBorder');
                expect(element.getAttribute('fill')).toEqual('transprent');
            };
            smithchart.refresh();
        });
        it('Checking with data label', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_symbol0');
                expect(element.getAttribute('fill')).toEqual('#8B5CF6');
            };
            smithchart.refresh();
        });
        it('Checking with data label font family', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_displayText0');
                expect(element.getAttribute('font-family')).toEqual('Roboto, Segoe UI, Noto, Sans-serif');
            };
            smithchart.refresh();
        });
        it('Checking with data label font size', () => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_Series0_Points0_dataLabel_displayText0');
                expect(element.getAttribute('font-size')).toEqual('12px');
            };
            smithchart.refresh();
        });
        
        
    });
});
