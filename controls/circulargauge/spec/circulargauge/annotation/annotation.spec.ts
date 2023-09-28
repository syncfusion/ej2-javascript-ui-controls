/**
 * Circular Gauge pointer drag spec.
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { Annotations } from '../../../src/circular-gauge/annotations/annotations';
import { GaugeLocation } from '../../../src/circular-gauge/utils/helper-common';
import { ILoadedEventArgs } from '../../../src/circular-gauge/model/interface';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
CircularGauge.Inject(Annotations);

describe('Circular-Gauge Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Gauge Annotation', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let targetElement: HTMLElement;
        let template: string = '<script id=template type="text/x-template"><div>80</div></script>' +
            '<script id=template1 type="text/x-template"><div>100</div></script>';
        beforeAll((): void => {
            document.body.innerHTML = template;
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            ele.remove();
            gauge.annotationsModule = null;
            gauge.destroy();
        });
        it('default annotation element checking', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 0).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('checking annotation text', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('container_Annotations_0');
                expect(svg.textContent).toBe('Annotation');
                done();
            };
            gauge.axes[0].annotations[0].content = 'Annotation';
            gauge.refresh();
        });

        it('checking annotation numeric text', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('container_Annotations_0');
                expect(svg.textContent).toBe('30');
                svg = document.getElementById('container_Axis_0_Annotation_0');
                expect(svg.childElementCount == 1).toBe(true);
                expect(svg.children[0]['style'].color).toBe("red");
                expect(svg.children[0]['style']["font-size"]).toBe("50px");
                expect(svg.children[0]['style']["font-family"]).toBe("Roboto");
                done();
            };
            gauge.axes[0].annotations[0].content = '30';
            gauge.axes[0].annotations[0].textStyle = {
                    size: "50px",
                    color: "red",
                    fontFamily: "Roboto",
                    fontStyle: "Regular"
                  }
            gauge.refresh();
        })

        it('checking annotation template', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('annotation1');
                expect(svg.textContent).toBe('Annotation');
                done();
            };
            gauge.axes[0].annotations[0].content = '<div id=annotation1>Annotation</div>';
            gauge.refresh();
        });

        it('checking annotation as null', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 0).toBe(true);
                done();
            };
            gauge.axes[0].annotations[0].content = null;
            gauge.refresh();
        });

        it('checking annotation template', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('container_Axis_0_Annotation_0');
                expect(svg.firstElementChild.textContent).toBe('80');
                done();
            };
            gauge.axes[0].annotations[0].content = '#template';
            gauge.refresh();
        });

        it('checking annotation template with rotation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('container_Axis_0_Annotation_0');
                expect(svg.firstElementChild.textContent).toBe('80');
                done();
            };
            gauge.axes[0].annotations[0].autoAngle = true;
            gauge.refresh();
        });

        // it('checking to change annotation value using method', () => {
        //     gauge.setAnnotationValue(0, 0, '#template1')
        //     svg = document.getElementById('container_Secondary_Element');
        //     expect(svg.childElementCount == 1).toBe(true);
        //     svg = document.getElementById('container_Axis_0_Annotation_0');
        //     expect(svg.firstElementChild.textContent).toBe('100');
        // });

        it('checking to change add the annotation using method', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Secondary_Element');
                expect(true).toBe(true);
                gauge.setAnnotationValue(0, 0, '#template1');
                svg = document.getElementById('container_Annotations_0');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('container_Axis_0_Annotation_0');
                expect(svg.firstElementChild.textContent).toBe('100');
                done();
            };
            gauge.axes[0].annotations[0].autoAngle = false;
            gauge.axes[0].annotations[0].content = null;
            gauge.refresh();
        });

        it('checking multiple annotation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Annotations_0');
                expect(svg.childElementCount == 2).toBe(true);
                svg = document.getElementById('container_Axis_0_Annotation_0');
                expect(svg.firstElementChild.textContent).toBe('100');
                svg = document.getElementById('container_Axis_0_Annotation_1');
                expect(svg.firstElementChild.textContent).toBe('80');
                done();
            };
            gauge.axes[0].annotations[0].autoAngle = false;
            gauge.axes[0].annotations[1] = {
                content: '#template',
                angle: 90,
                radius: '0%',
                autoAngle: false,
                zIndex: '1'
            };
            gauge.refresh();
        });

        it('checking svg annotation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = <HTMLElement>document.getElementById('container_Axis_0_Annotation_1').childNodes[0];
                expect(svg.nodeName).toBe('svg');
                done();
            };
            gauge.axes[0].annotations[1].content = '<svg height="100" width="100">' +
                '<circle cx="50" cy="50" r="40" stroke="black"' +
                ' stroke-width="3" fill="red" /></svg>';
            gauge.refresh();
        });

        it('checking annotation with element visibility', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = <HTMLElement>document.getElementById('container_Axis_0_Annotation_1').childNodes[0];
                expect(svg.getAttribute('display')).toBe('none');
                done();
            };
            gauge.axes[0].annotations[1].content = '<svg id="annotation_svg" display="none"' +
                ' height="100" width="100">' +
                '<circle cx="50" cy="50" r="40" stroke="black"' +
                ' stroke-width="3" fill="red" /></svg>';
            gauge.refresh();
        });
        it('checking annotation with multiple element', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = <HTMLElement>document.getElementById('container_Axis_0_Annotation_1').childNodes[0];
                expect(svg.innerHTML == 'Annotation1').toBe(true);
                svg = <HTMLElement>document.getElementById('container_Axis_0_Annotation_1').childNodes[1];
                expect(svg.innerHTML == 'Annotation2').toBe(true);
                done();
            };
            gauge.axes[0].annotations[1].content = '<div id="content1">Annotation1</div><div id="content2">Annotation2</div>';
            gauge.refresh();
        });
    });
    describe('axis boarder with background', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let svg: HTMLElement;
        let value: string[] | string | number;
        let location: GaugeLocation;
        let boundingRect: ClientRect;
        let targetElement: HTMLElement;
        let template: string = '<script id=template type="text/x-template"><div>80</div></script>' +
            '<script id=template1 type="text/x-template"><div>100</div></script>';
        beforeAll((): void => {
            document.body.innerHTML = template;
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            ele.remove();
            gauge.annotationsModule = null;
            gauge.destroy();
        });
        it('default axis background', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisOuterLine_0');
                expect(svg.getAttribute('stroke')).toBe('transparent');
                expect(svg.getAttribute('stroke-width')).toBe('0');
                expect(svg.getAttribute('fill')).toBe('transparent');
                expect(svg != null).toBe(true);
                done();
            };
            gauge.axes[0].background = 'transparent';
            gauge.refresh();
        });

        it('axis background as null', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisOuterLine_0');
                expect(svg == null).toBe(true);
                done();
            };
            gauge.axes[0].background = null;
            gauge.refresh();
        });

        it('checking axis background', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisOuterLine_0');
                expect(svg.getAttribute('fill')).toBe('whitesmoke');
                done();
            };
            gauge.axes[0].background = 'whitesmoke';
            gauge.refresh();
        });
    });
    it('memory leak', () => {     
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});