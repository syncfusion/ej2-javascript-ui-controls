import { Smithchart, ISmithchartLoadedEventArgs, TooltipRender } from '../../../src/smithchart/index';
import { createElement, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Tooltip} from '@syncfusion/ej2-svg-base';
import { MouseEvents } from '../base/events.spec';
import { SmithchartRect} from '../../../src/smithchart/utils/utils';

Smithchart.Inject(TooltipRender);

/**
 * Title spec
 */
    describe('Smithchart tooltip spec', () => {
        describe('Tooltip spec', () => {
        let id: string = 'container';
        let smithchart: Smithchart;
        let ele: HTMLDivElement;
        let trigger: MouseEvents = new MouseEvents();
        let spec: Element;
        beforeAll(() => {
            ele = <HTMLDivElement>createElement('div', { id: id, styles: 'height: 512px; width: 512px;' });
            document.body.appendChild(ele);
            smithchart = new Smithchart({
                series: [
         {
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
    fill: 'red',
    tooltip: { visible: true},
    marker: {
        visible: true,
        dataLabel: {
        visible: true,
        fill: 'red'
        },
        width: 10,
        height: 10
    }
    },
],
            }, '#' + id);
        });
        afterAll(() => {
            remove(ele);
            smithchart.destroy();
        });
        it('tooltip checking with mouse move', (done: Function) => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
                trigger.mousemoveEvent(element, 0, 0, 50, 255);
                element = document.getElementById(id + '_smithchart_tooltip_div_text');
                expect(element.firstChild.textContent).toBe('0 : ');
                expect(element.lastChild.textContent).toBe('0.05');
                trigger.mousemoveEvent(element, 0, 0, 35, 255);
                done();
            };
            smithchart.refresh();
        });
        it('tooltip template checking with mouse move', (done: Function) => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
                trigger.mousemoveEvent(element, 0, 0, 156, 250);
                element = document.getElementById(id + '_smithchart_tooltip_divparent_template');
                expect(element.firstChild.textContent).toBe('0.1');
                trigger.mousemoveEvent(element, 0, 0, 35, 255);
                done();
            };
            smithchart.series[0].tooltip.template = '<div style="border: 2px solid green;background: #a0e99680">${reactance}</div>';
            smithchart.refresh();
        });
        it('tooltip checking with mouse up on touchend', (done: Function) => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
                smithchart.mouseEnd(<PointerEvent>trigger.onTouchEnd(element, 0, 0, 0, 0, 50, 255));
                element = document.getElementById(id + '_smithchart_tooltip_div_text');
                expect(element.firstChild.textContent).toBe('0 : ');
                expect(element.lastChild.textContent).toBe('0.05');
                smithchart.mouseEnd(<PointerEvent>trigger.onTouchEnd(element, 0, 0, 0, 0, 35, 255));
                //done();
            };
            smithchart.animationComplete =  (args: Object): void => {
                let tooltip: HTMLElement = document.getElementById(smithchart.element.id + '_smithchart_tooltip_div_text');
                expect(tooltip == null).toBe(false);
                done();
            };
            smithchart.series[0].tooltip.template = '';
            smithchart.series[0].enableAnimation = true;
            smithchart.series[0].animationDuration = '2000ms';
            smithchart.refresh();
        });
        it('tooltip checking with mouse up on touchmove', (done: Function) => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
                smithchart.mouseEnd(<PointerEvent>trigger.onTouchMove(element, 0, 0, 0, 0, 156, 250));
                //trigger.mouseupEvent(element, 0, 0, 65, 255);
                element = document.getElementById(id + '_smithchart_tooltip_div_text');
                // expect(element.firstChild.textContent).toBe('0.3 : ');
                // expect(element.lastChild.textContent).toBe('0.1');
                //smithchart.mouseEnd(<PointerEvent>trigger.onTouchMove(element, 0, 0, 0, 0, 35, 255));
                done();
            };
            smithchart.refresh();
        });
        it('tooltip checking with mouse move on touchmove', (done: Function) => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
                smithchart.mouseMove(<PointerEvent>trigger.onTouchMove(element, 0, 0, 0, 0, 50, 255));
                //trigger.mouseupEvent(element, 0, 0, 65, 255);
                element = document.getElementById(id + '_smithchart_tooltip_div_text');
                // expect(element.firstChild.textContent).toBe('0 : ');
                // expect(element.lastChild.textContent).toBe('0.05');
                //smithchart.mouseMove(<PointerEvent>trigger.onTouchMove(element, 0, 0, 0, 0, 35, 255));
                done();
            };
            smithchart.refresh();
        });
        // it('tooltip checking with mouse up on touchmove', (done: Function) => {
        //     smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
        //         let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
        //         smithchart.mouseEnd(<PointerEvent>trigger.onTouchEnd(element, 0, 0, 0, 0, 156, 250));
        //         //trigger.mouseupEvent(element, 0, 0, 65, 255);
        //         element = document.getElementById(id + '_smithchart_tooltip_div_text');
        //         expect(element.firstChild.textContent).toBe('0.3 : ');
        //         expect(element.lastChild.textContent).toBe('0.1');
        //         smithchart.mouseEnd(<PointerEvent>trigger.onTouchEnd(element, 0, 0, 0, 0, 35, 255));
        //         done();
        //     };
        //     smithchart.refresh();
        // });
       /* it('tooltip checking with mouse move on touchmove', (done: Function) => {
            smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_series0_points');
                smithchart.mouseMove(<PointerEvent>trigger.onTouchEnd(element, 0, 0, 0, 0, 50, 255));
                //trigger.mouseupEvent(element, 0, 0, 65, 255);
                element = document.getElementById(id + '_smithchart_tooltip_div_text');
                expect(element.firstChild.textContent).toBe('0 : ');
                expect(element.lastChild.textContent).toBe('0.05');
                smithchart.mouseMove(<PointerEvent>trigger.onTouchEnd(element, 0, 0, 0, 0, 35, 255));
                done();
            };
            smithchart.refresh();
        });*/
        it('legend checking with mouse click as togglevisibility set to true', (done: Function) => { 
          smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_LegendItemText0');
                trigger.clickEvent(element);
                done();
            };
            smithchart.legendSettings.visible = true;
            smithchart.legendSettings.toggleVisibility = true;
            smithchart.refresh();
        });
        it(' Second time legend checking with mouse click as togglevisibility set to true', (done: Function) => { 
          smithchart.loaded = (args: ISmithchartLoadedEventArgs) => {
                let element: Element = document.getElementById(smithchart.element.id + '_LegendItemText0');
                trigger.clickEvent(element);
                done();
            };
            smithchart.legendSettings.visible = true;
            smithchart.series[0].visibility = 'hidden';
            smithchart.legendSettings.toggleVisibility = true;
            smithchart.refresh();
        });
    });
    });