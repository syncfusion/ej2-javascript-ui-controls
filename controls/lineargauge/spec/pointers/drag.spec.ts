/**
 * Linear gauge spec document
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { MouseEvents } from '../base/events.spec';
import { GaugeTooltip } from '../../src/linear-gauge/user-interaction/tooltip';
LinearGauge.Inject(GaugeTooltip);


describe('Linear gauge control', () => {
    describe('Checking user interaction - marker drag', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let timeout: number;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            element.remove();
            gauge.destroy();
        });

        it('checking drag and drop  - marker drag', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.dragAndDropEvent(svg, 668.5, 223, (223 + 10), (668.5 + 10), '', gauge);
                done();
            };
            gauge.axes[0].pointers[0].value = 50;
            gauge.axes[0].pointers[0].enableDrag = true;
            gauge.refresh();
        });

        it('checking drag and drop  - marker drag', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                let bounds: ClientRect = svg.getBoundingClientRect();
                trigger.dragAndDropEvent(svg,bounds.left, bounds.top, (bounds.left), (bounds.top), '', gauge);
                done();
            };
            gauge.refresh();
        });

        it('checking drag and drop  - horizontal', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.dragAndDropEvent(svg, 630, 255, (630 + 10), (255 + 10), 'touchstart', gauge);
                done();
            };
            gauge.orientation = 'Horizontal';
            gauge.refresh();
        });

        it('checking drag and drop  - horizontal - axis inversed', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.dragAndDropEvent(svg, 630, 255, (630 + 10), (255 + 10), '', gauge);
                done();
            };
            gauge.axes[0].isInversed = true;
            gauge.refresh();
        });

        it('checking drag and drop - vertical - axis inversed', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.dragAndDropEvent(svg, 688.5, 223, (668.5 + 10), (223 + 10), '', gauge);
                done();
            };
            gauge.orientation = 'Vertical';
            gauge.refresh();
        });

        it('checking drag and drop - touch move - axis inversed', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                trigger.dragAndDropEvent(svg, (630 + 20), 255, (630 + 20 + 10), 255, 'touchmove', gauge);
                done();
            };
            gauge.axes[0].isInversed = false;
            gauge.orientation = 'Horizontal';
            gauge.refresh();
        });

        it('checking drag and drop - touch move - pointer image', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = <HTMLElement>document.getElementById('container_AxisIndex_0_MarkerPointer_0').children[0];
                let x: string =  svg.getAttribute('x');
                trigger.dragAndDropEvent(svg, 200, 255, 300, 255, 'touchmove', gauge);
                svg = <HTMLElement>document.getElementById('container_AxisIndex_0_MarkerPointer_0').children[0];
                expect(x != svg.getAttribute('x')).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].type = 'Marker';
            gauge.axes[0].pointers[0].markerType = 'Image';
            gauge.axes[0].pointers[0].imageUrl = '../img/img1.jpg'
            gauge.axes[0].pointers[0].animationDuration = 0;
            gauge.refresh();
        });

        // it('checking pointer image position', (): void => {
        //     gauge.loaded = null;
        //     svg = <HTMLElement>document.getElementById('container_AxisIndex_0_MarkerPointer_0').children[0];
        //     let x: string =  svg.getAttribute('x');
        //     expect(x).toBe('282');
        // });
    });

    describe('Checking user interaction - bar drag', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let timeout: number;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            element.remove();
        });

        it('checking drag and drop  - bar drag', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.dragAndDropEvent(<Element>svg.childNodes[0], 677.5, 233, 677.5, (233 + 5), '', gauge);
                done();
            };
            gauge.axes[0].pointers[0].type = 'Bar';
            gauge.axes[0].pointers[0].value = 50;
            gauge.axes[0].pointers[0].enableDrag = true;
            gauge.refresh();
        });

        it('checking with touch move event - bar drag', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.dragAndDropEvent(<Element>svg.childNodes[0], 677.5, 233, 677.5, (233 + 5), 'touchstart', gauge);
                done();
            };
            gauge.refresh();
        });

        it('checking drag and drop - RoundedRectangle drag', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.dragAndDropEvent(<Element>svg.childNodes[0], 677.5, 233, (677.5), (233 + 5), '', gauge);
                done();
            };
            gauge.container.type = 'RoundedRectangle';
            gauge.refresh();
        });

        it('checking drag and drop  - Thermometer drag', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.dragAndDropEvent(<Element>svg.childNodes[0], 660.7, (229.8 + 185.3), (660.7), (229.8 + 5), '', gauge);
                done();
            };
            gauge.container.type = 'Thermometer';
            gauge.refresh();
        });

        it('checking drag and drop  - Rounded rectangle drag - axis inversed', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.dragAndDropEvent(<Element>svg.childNodes[0], 677.5, (71.5 + 161.25), (677.5), ((71.5 + 161.25) - 5), '', gauge);
                done();
            };
            gauge.container.type = 'RoundedRectangle';
            gauge.axes[0].isInversed = true;
            gauge.refresh();
        });

        it('checking drag and drop  - Normal container drag - axis inversed', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.dragAndDropEvent(<Element>svg.childNodes[0], 677.5, (71.75 + 161.25), (677.5), ((71.75 + 161.25) - 5), '', gauge);
                done();
            };
            gauge.container.type = 'Normal';
            gauge.refresh();
        });

        it('checking drag and drop  - bar drag in horizontal orientation', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.dragAndDropEvent(<Element>svg.childNodes[0], (173.5 + 466.5), 264, (173.5 + 466.5) - 5, 264, '', gauge);
               // done();
            };
            gauge.axes[0].isInversed = false;
            gauge.orientation = 'Horizontal';
            gauge.refresh();
        });

        it('checking drag and drop  - Rounded rectangle bar drag', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.dragAndDropEvent(<Element>svg.childNodes[0], (173.5 + 466.5), 264, (173.5 + 466.5) - 5, 264, '', gauge);
                done();
            };
            gauge.container.type = 'RoundedRectangle';
            gauge.refresh();
        });

        it('checking drag and drop  - Thermometer bar drag', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.dragAndDropEvent(<Element>svg.childNodes[0], (152 + 490.5), 247, ((152.5 + 490.5) - 5), 247, '', gauge);
                done();
            };
            gauge.container.type = 'Thermometer';
            gauge.refresh();
        });

        it('checking drag and drop  - bar drag - inversed axis', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.dragAndDropEvent(<Element>svg.childNodes[0], 640, 264, (640 + 5), 264, '', gauge);
                done();
            };
            gauge.axes[0].isInversed = true;
            gauge.container.type = 'Normal';
            gauge.refresh();
        });

        it('checking drag and drop  - Rounded Rectangle bar drag - inversed axis', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
                trigger.dragAndDropEvent(<Element>svg.childNodes[0], 640, 264, (640 + 5), 264, '', gauge);
                done();
            };
            gauge.container.type = 'RoundedRectangle';
            gauge.refresh();
        });

        it('checking with mouse leave from element', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                trigger.mouseLeaveEvent(args.gauge.element);
                done();
            };
            gauge.tooltip.enable = true;
            gauge.mouseElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
            gauge.refresh();
        });
        it('checking with mouse move while pointer dragged', (done: Function): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                gauge.pointerDrag = true;
                trigger.mousemoveEvent(args.gauge.element, 0, 0, 10, 10);
                done();
            };
            gauge.mouseElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
            gauge.refresh();
        });

    });
});