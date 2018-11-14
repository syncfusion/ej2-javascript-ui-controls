/**
 * Linear gauge spec document
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { Axis, Pointer } from '../../src/linear-gauge/axes/axis';
import { ILoadedEventArgs, ILoadEventArgs } from '../../src/linear-gauge/model/interface';
import { Annotations } from '../../src/linear-gauge/annotations/annotations';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
LinearGauge.Inject(Annotations);

describe('linear gauge direct properties', () => {
    let gauge: LinearGauge;
    let element: HTMLElement;
    let svg: HTMLElement;
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

    it('checking with bar drag manual in axis inversed', (done: Function): void => {
        gauge.loaded = (args: ILoadedEventArgs): void => {
            gauge.mouseX = 200;
            gauge.mouseElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
            gauge.barDrag(<Axis>gauge.axes[0], <Pointer>gauge.axes[0].pointers[0]);
            done();
        };
        gauge.axes[0].pointers[0].value = 50;
        gauge.orientation = 'Horizontal';
        gauge.axes[0].pointers[0].type = 'Bar';
        gauge.refresh();
    });

    it('checking with bar drag manual', (done: Function): void => {
        gauge.loaded = (args: ILoadedEventArgs): void => {
            gauge.mouseX = 400;
            gauge.barDrag(<Axis>gauge.axes[0], <Pointer>gauge.axes[0].pointers[0]);
            done();
        };
        gauge.axes[0].isInversed = true;
        gauge.axes[0].pointers[0].value = 50;
        gauge.orientation = 'Horizontal';
        gauge.axes[0].pointers[0].type = 'Bar';
        gauge.refresh();
    });


    it('checking with bar drag manual - Rounded Rectangle', (done: Function): void => {
        gauge.loaded = (args: ILoadedEventArgs): void => {
            gauge.mouseX = 400;
            gauge.barDrag(<Axis>gauge.axes[0], <Pointer>gauge.axes[0].pointers[0]);
            done();
        };
        gauge.container.type = 'RoundedRectangle';
        gauge.axes[0].isInversed = false;
        gauge.axes[0].pointers[0].value = 50;
        gauge.orientation = 'Horizontal';
        gauge.axes[0].pointers[0].type = 'Bar';
        gauge.refresh();
    });

    it('checking with bar drag manual - Rounded Rectangle - isInversed', (done: Function): void => {
        gauge.loaded = (args: ILoadedEventArgs): void => {
            gauge.mouseX = 400;
            gauge.barDrag(<Axis>gauge.axes[0], <Pointer>gauge.axes[0].pointers[0]);
            done();
        };
        gauge.container.type = 'RoundedRectangle';
        gauge.axes[0].isInversed = true;
        gauge.axes[0].pointers[0].value = 50;
        gauge.orientation = 'Horizontal';
        gauge.axes[0].pointers[0].type = 'Bar';
        gauge.refresh();
    });

    it('checking with mouse leave', (): void => {
        gauge.loaded = (args: ILoadedEventArgs): void => {
            gauge.mouseLeave(<PointerEvent>{});
        };
        gauge.mouseElement = document.getElementById('container_AxisIndex_0_BarPointer_0');
    });

    it('checking annotation', (done: Function): void => {
        let content: string = '<div id="annotation">Hello</div>'
        gauge.annotations[0].content = content;
        gauge.refresh();
        done();
    });

    it('checking annotation without element', (done: Function): void => {
        let conent: string = '<div id="annotation">Hello</div>'
        gauge.setAnnotationValue(0, conent);
        done();
    });
});

describe('linear gauge direct properties', () => {
    let gauge: LinearGauge;
    let element: HTMLElement;
    let svg: HTMLElement;
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

    it('checking with marker pointer in arrow', (): void => {
        gauge.loaded = (args: ILoadedEventArgs): void => {
            svg = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
            expect(svg != null).toBe(true);
        };
        gauge.axes[0].pointers[0].markerType = 'Arrow';
        gauge.refresh();
    });

    it('checking with marker pointer in inverted arrow', (): void => {
        gauge.loaded = (args: ILoadedEventArgs): void => {
            svg = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
            expect(svg != null).toBe(true);
        };
        gauge.axes[0].pointers[0].markerType = 'InvertedArrow';
        gauge.refresh();
    });

    it('checking with marker pointer in arrow - axis inversed', (): void => {
        gauge.loaded = (args: ILoadedEventArgs): void => {
            svg = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
            expect(svg != null).toBe(true);
        };
        gauge.axes[0].isInversed = true;
        gauge.axes[0].pointers[0].markerType = 'Arrow';
        gauge.refresh();
    });

    it('checking with marker pointer in inverted arrow - axis inversed', (): void => {
        gauge.loaded = (args: ILoadedEventArgs): void => {
            svg = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
            expect(svg != null).toBe(true);
        };
        gauge.axes[0].pointers[0].markerType = 'InvertedArrow';
        gauge.refresh();
    });

});