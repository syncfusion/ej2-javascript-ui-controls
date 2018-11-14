/**
 * Linear gauge spec document.
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { Annotations } from '../../src/linear-gauge/annotations/annotations';
import { MouseEvents } from '../base/events.spec';
LinearGauge.Inject(Annotations);

describe('Linear gauge control', () => {
    describe('Cheking annotation', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let divElement: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        let template: string = '<script id=template type="text/x-template"><div id="tool">80</div></script>' +
            '<script id=template1 type="text/x-template"><div>100</div></script>';
        let annotationDiv: HTMLElement = createElement('div', { id: 'annotation', innerHTML: 'Gauge' });
        annotationDiv.style.display = 'none';
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            element.remove();
        });

        it('Checking annotation without div element checking', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toEqual(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].x = 100;
            gauge.annotations[0].y = 100;
            gauge.refresh();
        });

        it('Checking annotation x and y', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toEqual(true);
            };
            document.body.appendChild(annotationDiv);
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].x = 100;
            gauge.annotations[0].y = 100;
            gauge.refresh();
        });

        it('Checking annotation vertical alignment - near', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toEqual(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].verticalAlignment = 'Near';
            gauge.refresh();
        });

        it('Checking annotation vertical alignment - center', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toEqual(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].verticalAlignment = 'Center';
            gauge.refresh();
        });

        it('Checking annotation vertical alignment - far', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toBe(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].verticalAlignment = 'Far';
            gauge.refresh();
        });

        it('Checking annotation horizontal alignment - near', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toBe(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].horizontalAlignment = 'Near';
            gauge.refresh();
        });

        it('Checking annotation horizontal alignment - center', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement != null).toBe(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].horizontalAlignment = 'Center';
            gauge.refresh();
        });

        it('Checking annotation horizontal alignment - far', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Annotation_0');
                expect(divElement != null).toBe(true);
            };
            gauge.annotations[0].content = '#annotation';
            gauge.annotations[0].horizontalAlignment = 'Far';
            gauge.refresh();
        });

        it('Checking annotation with template ', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Annotation_0');
                expect(divElement != null).toBe(true);
            };
            gauge.annotations[0].content = '<div id=annotation1>Annotation</div>';
            gauge.annotations[0].horizontalAlignment = 'Far';
            gauge.refresh();
        });

        it('Checking annotation with empty content ', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                divElement = document.getElementById('container_Annotation_0');
                expect(divElement == null).toBe(true);
            };
            gauge.annotations[0].content = null;
            gauge.refresh();
        });

        it('set annotation value ', (): void => {
            let content: string = '<div id="annotation1">Linear gauge</div>';
            gauge.annotations[0].axisIndex = 0;
            gauge.annotations[0].axisValue = 1;
            gauge.setAnnotationValue(0, content);
        });

        it('set annotation value in horizontal ', (): void => {
            let content: string = '<div id="annotation2">Gauge</div>';
            gauge.orientation = 'Horizontal';
            gauge.setAnnotationValue(0, content);
        });

        it('set annotation value with null ', (): void => {
            let content: string = '<div id="annotation2">Gauge</div>';
            gauge.orientation = 'Horizontal';
            gauge.annotations[0].axisIndex = null;
            gauge.setAnnotationValue(0, content);
        });


        it('set annotation value with maximum ', (): void => {
            let content: string = '<div id="annotation2">Gauge</div>';
            gauge.orientation = 'Horizontal';
            gauge.axes[0].maximum = 40;
            gauge.annotations[0].axisValue = 50;
            gauge.setAnnotationValue(0, content);
        });
    });
});