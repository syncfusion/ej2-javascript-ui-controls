/**
 * Circular Gauge Spec Started
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { Range, Pointer } from '../../../src/circular-gauge/axes/axis';
import { ILoadedEventArgs, IAnimationCompleteEventArgs } from '../../../src/circular-gauge/model/interface';
import { GaugeLocation } from '../../../src/circular-gauge/utils/helper-common';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { MouseEvents } from '../user-interaction/mouse-events.spec';

describe('Circular-Gauge Control', () => {
    let gauge: CircularGauge;
    let ele: HTMLElement;
    let svg: HTMLElement;
    let svg1: HTMLElement;
    let location: GaugeLocation;
    let boundingRect: ClientRect;
    let boundingRect1: ClientRect;
    let value: string[] | string | number;
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Gauge axis pointer behavior - Needle Pointer', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    pointers: [{
                        color: '#b5b5b5',
                        needleTail: {
                            length: '10%'
                        },
                        pointerWidth: 8,
                        cap: {
                            color: '#b5b5b5',
                            border: {
                                width: 0,
                                color: '#DDDDDD'
                            }
                        }
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking default pointer', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 4).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,365.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,365.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].ranges[0].radius = '80%';
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.refresh();
        });
        it('Checking default pointer style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('fill')).toBe('#b5b5b5');
                expect(svg.getAttribute('stroke')).toBe('#DDDDDD');
                expect(svg.getAttribute('stroke-width')).toBe('0');
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('fill')).toBe('#757575');
                expect(svg.getAttribute('stroke-width')).toBe('0');
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('fill')).toBe('#b5b5b5');
                expect(svg.getAttribute('stroke')).toBe('#DDDDDD');
                expect(svg.getAttribute('stroke-width')).toBe('0');
                done();
            };
            gauge.axes[0].majorTicks.position = 'Inside';
            gauge.refresh();
        });
        it('Checking pointer negative point value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 4).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,365.5,225)').toBe(true);
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,365.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = -10;
            gauge.refresh();
        });

        it('Checking pointer value with aria-label', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.getAttribute('aria-label')).toBe('Pointer:90');
                expect(svg.childElementCount == 4).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(38,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,365.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(38,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,365.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(38,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 90;
            gauge.refresh();
        });

        it('Checking pointer value as maximum with description', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.getAttribute('aria-label')).toBe('This is pointer');
                expect(svg.childElementCount == 4).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(70,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,365.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(70,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,365.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(70,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].description = 'This is pointer';
            gauge.axes[0].pointers[0].value = 100;
            gauge.refresh();
        });

        it('Checking pointer value - to exceed', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 4).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(70,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,365.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(70,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,365.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(70,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 200;
            gauge.refresh();
        });
       
        it('Checking pointer customization needle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('fill') == 'violet').toBe(true);
                expect(svg.getAttribute('stroke') == 'red').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].border.color = 'red';
            gauge.axes[0].pointers[0].border.width = 2;
            gauge.axes[0].pointers[0].color = 'violet';
            gauge.refresh();
        });

        it('Checking pointer customization cap', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('fill') != 'violet').toBe(true);
                expect(svg.getAttribute('stroke') != 'red').toBe(true);
                expect(svg.getAttribute('stroke-width') != '2').toBe(true);
                expect(svg.getAttribute('fill') == 'green').toBe(true);
                expect(svg.getAttribute('stroke') == 'blue').toBe(true);
                expect(svg.getAttribute('stroke-width') == '3').toBe(true);
                done();
            };

            gauge.axes[0].pointers[0].cap.color = 'green';
            gauge.axes[0].pointers[0].cap.border.color = 'blue';
            gauge.axes[0].pointers[0].cap.border.width = 3;
            gauge.refresh();
        });

        it('Checking pointer customization tail', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('fill') == 'black').toBe(true);
                expect(svg.getAttribute('stroke') == 'yellow').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1').toBe(true);
                done();
            };
            
            gauge.axes[0].pointers[0].needleTail.color = 'black';
            gauge.axes[0].pointers[0].needleTail.border.color = 'yellow';
            gauge.axes[0].pointers[0].needleTail.border.width = 1;
            gauge.refresh();
        });

        it('Checking pointer customization overall', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('fill') == 'violet').toBe(true);
                expect(svg.getAttribute('stroke') == 'red').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('fill') == 'green').toBe(true);
                expect(svg.getAttribute('stroke') == 'blue').toBe(true);
                expect(svg.getAttribute('stroke-width') == '3').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('fill') == 'black').toBe(true);
                expect(svg.getAttribute('stroke') == 'yellow').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking pointer length - default', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_0_Pointer_Needle_0').getBoundingClientRect();
                expect(Math.round(boundingRect.height) == 164 || Math.round(boundingRect.height) == 163).toBe(true);
                expect(Math.round(boundingRect.width)).toBe(66);
                done();
            };
            gauge.refresh();
        });

        it('Checking pointer length - given length', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_0_Pointer_Needle_0').getBoundingClientRect();
                expect(Math.round(boundingRect.height)).toBe(204);
                expect(Math.round(boundingRect.width)).toBe(81);
                done();
            };
            gauge.axes[0].pointers[0].radius = '100%';
            gauge.refresh();
        });
       
        it('Checking pointer width - given value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_0_Pointer_Needle_0').getBoundingClientRect();
                expect(Math.round(boundingRect.height)).toBe(208);
                expect(Math.round(boundingRect.width)).toBe(92);
                done();
            };
            gauge.axes[0].pointers[0].pointerWidth = 20;
            gauge.refresh();
        });

        it('Checking pointer cap - radius', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_0_Pointer_NeedleCap_0').getBoundingClientRect();
                expect(Math.round(boundingRect.height) == 26).toBe(true);
                expect(Math.round(boundingRect.width) == 26).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].cap.radius = 10;
            gauge.refresh();
        });

        it('Checking pointer cap - radius as 0', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg == null).toBe(true)
                done();
            };
            gauge.axes[0].pointers[0].cap.radius = 0;
            gauge.refresh();
        });

        it('Checking needle tail length - default', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_0_Pointer_NeedleTail_0').getBoundingClientRect();
                expect(Math.round(boundingRect.height)).toBe(27);
                expect(Math.round(boundingRect.width)).toBe(26);
                done();
            };
            gauge.refresh();
        });

        it('Checking needle tail length - given value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('container_Axis_0_Pointer_NeedleTail_0').getBoundingClientRect();
                expect(Math.round(boundingRect.height)).toBe(57);
                expect(Math.round(boundingRect.width)).toBe(37);
                done();
            };
            gauge.axes[0].pointers[0].needleTail.length = '25%';
            gauge.refresh();
        });

        it('Checking needle tail length - given value as 0', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg == null).toBe(true)
                done();
            };
            gauge.axes[0].pointers[0].needleTail.length = '0%';
            gauge.refresh();
        });
    });

    describe('Gauge axis pointer behavior - Marker Pointer', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    pointers: [{
                        type: 'Marker',
                        radius: '80%', color: '#b5b5b5',
                        needleTail: {
                            length: '10%'
                        },
                        pointerWidth: 8,
                        cap: {
                            color: '#b5b5b5',
                            border: {
                                width: 0,
                                color: '#DDDDDD'
                            }
                        }
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking default pointer - Circle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 1).toBe(true);
                done();
            };
            gauge.axes[0].ranges[0].radius = '80%';
            gauge.refresh();
        });
        it('Checking default style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.tagName == 'ellipse').toBe(true);
                expect(svg.getAttribute('rx') == '2.5').toBe(true);
                expect(svg.getAttribute('ry') == '2.5').toBe(true);
                expect(svg.getAttribute('stroke') == '#DDDDDD').toBe(true);
                expect(svg.getAttribute('fill') == '#b5b5b5').toBe(true);
                expect(svg.getAttribute('stroke-width') == '0').toBe(true);
                done();
            };
            gauge.refresh();
        });
        it('Checking pointer - marker customization', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('rx') == '5').toBe(true);
                expect(svg.getAttribute('ry') == '5').toBe(true);
                expect(svg.getAttribute('stroke') == 'violet').toBe(true);
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].color = 'red';
            gauge.axes[0].pointers[0].border.width = 2;
            gauge.axes[0].pointers[0].border.color = 'violet';
            gauge.axes[0].pointers[0].markerWidth = 10;
            gauge.axes[0].pointers[0].markerHeight = 10;
            gauge.refresh();
        });

        it('Checking pointer - default pointer value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,365.5,225)').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking pointer - given pointer value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(70,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 100;
            gauge.refresh();
        });

        it('Checking marker shape pointer - Triangle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.tagName == 'path').toBe(true);
                expect(Math.round((<SVGPathElement>(<Element>svg)).getTotalLength())).toBe(32);
                done();
            };
            gauge.axes[0].pointers[0].markerShape = 'Triangle';
            gauge.refresh();
        });

        it('Checking triangle style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('stroke') == 'violet').toBe(true);
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking triangle - given pointer value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 0;
            gauge.refresh();
        });

        it('Checking marker shape pointer - InvertedTriangle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.tagName == 'path').toBe(true);
                expect(Math.round((<SVGPathElement>(<Element>svg)).getTotalLength())).toBe(32);
                done();
            };
            gauge.axes[0].pointers[0].markerShape = 'InvertedTriangle';
            gauge.refresh();
        });

        it('Checking inverted triangle style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('stroke') == 'violet').toBe(true);
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking inverted triangle - given pointer value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 0;
            gauge.refresh();
        });

        it('Checking marker shape pointer - Rectangle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.tagName == 'path').toBe(true);
                expect(Math.round((<SVGPathElement>(<Element>svg)).getTotalLength())).toBe(40);
                done();
            };
            gauge.axes[0].pointers[0].markerShape = 'Rectangle';
            gauge.refresh();
        });

        it('Checking rectangle triangle style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('stroke') == 'violet').toBe(true);
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking rectangle triangle - given pointer value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 0;
            gauge.refresh();
        });

        it('Checking marker shape pointer - Diamond', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.tagName == 'path').toBe(true);
                expect(Math.round((<SVGPathElement>(<Element>svg)).getTotalLength())).toBe(28);
                done();
            };
            gauge.axes[0].pointers[0].markerShape = 'Diamond';
            gauge.refresh();
        });

        it('Checking diamond triangle style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('stroke') == 'violet').toBe(true);
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking diamond triangle - given pointer value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 0;
            gauge.refresh();
        });

        it('Checking marker shape pointer - Image', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.tagName == 'image').toBe(true);
                expect(svg.getAttribute('href') == 'base/spec/img/img1.jpg').toBe(true); done();
                done();
            };
            gauge.axes[0].pointers[0].markerShape = 'Image';
            gauge.axes[0].pointers[0].imageUrl = 'base/spec/img/img1.jpg';
            gauge.refresh();
        });

        it('Checking marker shape pointer inside - InvertedTriangle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg).not.toBe(null);
                done();
            };
            gauge.axes[0].pointers[0].position = 'Inside';
            gauge.axes[0].pointers[0].value = 80;
            gauge.axes[0].pointers[0].radius = null;
            gauge.axes[0].pointers[0].markerShape = 'InvertedTriangle';
            gauge.refresh();
        });

        it('Checking marker shape pointer cross - Text', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg).not.toBe(null);
                done();
            };
            gauge.axes[0].pointers[0].position = 'Cross';
            gauge.axes[0].pointers[0].value = 80;
            gauge.axes[0].pointers[0].radius = null;
            gauge.axes[0].pointers[0].markerShape = 'Text';
            gauge.axes[0].pointers[0].text = "Text";
            gauge.axes[0].pointers[0].textStyle.fontWeight = null;
            gauge.refresh();
        });
    });

    describe('Gauge axis pointer behavior - Range Bar Pointer', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    pointers: [{
                        type: 'RangeBar',
                        radius: '80%',
                        color: '#b5b5b5',
                        needleTail: {
                            length: '10%'
                        },
                        pointerWidth: 8,
                        cap: {
                            color: '#b5b5b5',
                            border: {
                                width: 0,
                                color: '#DDDDDD'
                            }
                        }
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking default pointer - Range-Bar', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 1).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 10;
            gauge.refresh();
        });

        it('Checking default pointer - with default value as 0', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 1).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = null;
            gauge.refresh();
        });

        it('Checking default pointer styles', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                expect(svg.getAttribute('fill') == '#b5b5b5').toBe(true);
                expect(svg.getAttribute('stroke') == '#DDDDDD').toBe(true);
                expect(svg.getAttribute('stroke-width') == '0').toBe(true);
                expect(svg.tagName == 'path').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 90;
            gauge.refresh();
        });

        it('Checking pointer styles customization', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                expect(svg.getAttribute('stroke') == 'blue').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                expect(svg.tagName == 'path').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].color = 'red';
            gauge.axes[0].pointers[0].border.color = 'blue';
            gauge.axes[0].pointers[0].border.width = 2;
            gauge.axes[0].pointers[0].pointerWidth = 15;
            gauge.refresh();
        });

        it('Checking range bar start point', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '320.4461514626455' || value[1] == '325.9461514626455' || value[1] == '306.9461514626455' || value[1] == '315.9461514626455').toBe(true);
                expect(value[2]).toBe('385.8753766785475');
                done();
            };
            gauge.refresh();
        });

        it('Checking range bar as anti clock wise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '244.0925589825292' || value[1] == '249.5925589825292' || value[1] == '230.5925589825292' || value[1] == '239.5925589825292').toBe(true);
                expect(value[2]).toBe('330.40124457575274');
                done();
            };
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.refresh();
        });

        it('Checking range bar rendering shape with end Angle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                value = svg.getAttribute('d').split(' ');
                expect(value[22] == '0').toBe(true);
                done();
            };
            gauge.axes = [{
                minimum: 0,
                maximum: 150,
                startAngle: 0,
                endAngle: 50,
                pointers: [
                    {
                        value: 20,
                        type: 'RangeBar',
                        roundedCornerRadius: 10,
                        pointerWidth: 10,
                    }
                ]
            }];
            gauge.refresh();
        });

        it('Checking range bar rendering shape with start Angle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                value = svg.getAttribute('d').split(' ');
                expect(value[22] == '0').toBe(true);
                done();
            };
            gauge.axes = [{
                minimum: 0,
                maximum: 150,
                startAngle: 50,
                endAngle: 0,
                pointers: [
                    {
                        value: 20,
                        type: 'RangeBar',
                        roundedCornerRadius: 10,
                        pointerWidth: 10,
                    }
                ]
            }];
            gauge.refresh();
        });
    });

    describe('Gauge axis pointer behavior - Range Bar Pointer with Rounded Corner', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    pointers: [{
                        type: 'RangeBar',
                        radius: '80%',
                        color: '#b5b5b5',
                        roundedCornerRadius: 10,
                        pointerWidth: 10,
                        cap: {
                            color: '#b5b5b5',
                            border: {
                                width: 0,
                                color: '#DDDDDD'
                            }
                        }
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking default pointer - Rounded Range-Bar', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 1).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 20;
            gauge.refresh();
        });
        it('Checking default pointer - Rounded Range-Bar', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 1).toBe(true);
                done();
            };
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.axes[0].pointers[0].value = 65;
            gauge.axes[0].pointers[0].animation.enable = true;
            gauge.refresh();
        });

        it('Checking default pointer - with default value as 0', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 1).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = null;
            gauge.refresh();
        });

        it('Checking default pointer styles', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                expect(svg.getAttribute('fill') == '#b5b5b5').toBe(true);
                expect(svg.getAttribute('stroke') == '#DDDDDD').toBe(true);
                expect(svg.getAttribute('stroke-width') == '0').toBe(true);
                expect(svg.tagName == 'path').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 70;
            gauge.refresh();
        });

        it('Checking pointer styles customization', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                expect(svg.getAttribute('fill') == 'green').toBe(true);
                expect(svg.getAttribute('stroke') == 'red').toBe(true);
                expect(svg.getAttribute('stroke-width') == '1').toBe(true);
                expect(svg.tagName == 'path').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].color = 'green';
            gauge.axes[0].pointers[0].border.color = 'red';
            gauge.axes[0].pointers[0].border.width = 1;
            gauge.axes[0].pointers[0].pointerWidth = 10;
            gauge.refresh();
        });
    });

    describe('Gauge axis pointer - Dynamic update', () => {
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    pointers: [{
                        animation: { enable: false },
                        radius: '80%', color: '#b5b5b5',
                        needleTail: {
                            length: '10%'
                        },
                        pointerWidth: 8,
                        cap: {
                            color: '#b5b5b5',
                            border: {
                                width: 0,
                                color: '#DDDDDD'
                            }
                        }
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking default pointer - angle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 4).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(142,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(142,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(142,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(142,365.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(142,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(142,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(142,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(142,365.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(142,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(142,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(142,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(142,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 10;
            gauge.refresh();
        });

        it('Checking default pointer - anti clock wise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 4).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') == 'rotate(38,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,365.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleTail_0');
                expect(svg.getAttribute('transform') == 'rotate(38,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,365.5,225)').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_NeedleCap_0');
                expect(svg.getAttribute('transform') == 'rotate(38,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(38,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.refresh();
        });

        it('Dynamic update - clock wise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(true).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') != 'rotate(142,379,225)' ||
                    svg.getAttribute('transform') != 'rotate(142,384.5,225)').toBe(true);
                gauge.setPointerValue(0, 0, 0);
                expect(svg.getAttribute('transform') != 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') != 'rotate(110,379,225)').toBe(true);
                done();
            };
            gauge.axes[0].direction = 'ClockWise';
            gauge.refresh();
        });

        it('Dynamic update - Anti clock wise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(true).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') != 'rotate(38,379,225)' ||
                    svg.getAttribute('transform') != 'rotate(38,384.5,225)').toBe(true);
                gauge.setPointerValue(0, 0, 0);
                expect(svg.getAttribute('transform') != 'rotate(70,384.5,225)' ||
                    svg.getAttribute('transform') != 'rotate(70,379,225)').toBe(true);
                done();
            };
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.axes[0].pointers[0].value = 10;
            gauge.refresh();
        });

        it('Dynamic update - out of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 4).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') != 'rotate(38,384.5,225)' ||
                    svg.getAttribute('transform') != 'rotate(38,379,225)').toBe(true);
                gauge.setPointerValue(0, 0, -10);
                expect(svg.getAttribute('transform') == 'rotate(70,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(70,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 10;
            gauge.refresh();
        });

        it('Dynamic update - out of the range', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_0');
                expect(svg.childElementCount == 4).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('transform') != 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') != 'rotate(110,379,225)').toBe(true);
                gauge.setPointerValue(0, 0, 110);
                expect(svg.getAttribute('transform') == 'rotate(110,384.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,379,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,374.5,225)' ||
                    svg.getAttribute('transform') == 'rotate(110,365.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 100;
            gauge.refresh();
        });

        it('Dynamic update for Range Bar', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                value = svg.getAttribute('d').split(' ');
                expect(value[9] != '437.5538485373545' || value[9] == '424.0538485373545' || value[9] != '443.0538485373545').toBe(true);
                expect(true).toBe(true);
                gauge.setPointerValue(0, 0, 90);
                value = svg.getAttribute('d').split(' ');
                expect(value[9] == '519.4074410174708' || value[9] == '500.40744101747083' || value[9] == '513.9074410174708' || value[9] == '509.40744101747083').toBe(true);
                expect(value[10]).toBe('330.4012445757527');
                done();
            };
            gauge.axes[0].pointers[0].type = 'RangeBar';
            gauge.axes[0].direction = 'ClockWise';
            gauge.refresh();
        });

        it('Dynamic update for Range Bar - with complete circle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                value = svg.getAttribute('d').split(' ');
                expect(true).toBe(true);
                gauge.setPointerValue(0, 0, 10);
                value = svg.getAttribute('d').split(' ');
                expect(value[9] == '523.0037270000339' || value[9] == '517.5037270000339' || value[9] == '504.0037270000339' || value[9] == '513.0037270000339').toBe(true);
                expect(true).toBe(true);
                gauge.setPointerValue(0, 0, 0);
                value = svg.getAttribute('d').split(' ');
                expect(Math.round(+value[9]) == 556 || Math.round(+value[9]) == 550 || Math.round(+value[9]) == 537 || Math.round(+value[9]) == 546).toBe(true);
                expect(Math.round(+value[10])).toBe(225);
                expect(Math.round(+value[1]) == 556 || Math.round(+value[1]) == 550 || Math.round(+value[1]) == 537 || Math.round(+value[1]) == 546).toBe(true);
                expect(Math.round(+value[2])).toBe(225);
                done();
            };
            gauge.axes[0].startAngle = 90;
            gauge.axes[0].endAngle = 90;
            gauge.axes[0].pointers[0].value = 100;
            gauge.refresh();
        });

        it('Dynamic update for Range Bar - Anti clock wise', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] != '545.3753766785476' || value[1] != '539.8753766785476').toBe(true);
                expect(true).toBe(true);
                expect(value[9] == '545.3753766785476' || value[9] == '539.8753766785476' || value[9] == '526.3753766785476' || value[9] == '535.3753766785476').toBe(true);
                expect(value[10]).toBe('166.44615146264553');
                gauge.setPointerValue(0, 0, 90);
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '489.9012445757527' || value[1] == '484.4012445757527' || value[1] == '470.9012445757527' || value[1] == '479.9012445757527').toBe(true);
                expect(value[2]).toBe('359.90744101747083');
                expect(value[9] == '545.3753766785476' || value[9] == '539.8753766785476' || value[9] == '526.3753766785476' || value[9] == '535.3753766785476').toBe(true);
                expect(value[10]).toBe('166.44615146264553');
                done();
            };
            gauge.axes[0].pointers[0].type = 'RangeBar';
            gauge.axes[0].pointers[0].value = 110;
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.axes[0].startAngle = 110;
            gauge.axes[0].endAngle = 70;
            gauge.refresh();
        });
        it('Dynamic update for Range Bar - Anti clock wise and roundedCornerRadius', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                gauge.setPointerValue(0, 0, 0);
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '544.3753766785476' || value[1] == '545.3753766785476' || value[1] == '526.3753766785476' || value[1] == '535.3753766785476').toBe(true);
                gauge.setPointerValue(0, 0, 20);
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '407.3264348843632' || value[1] == '408.3264348843632' || value[1] == '389.3264348843632' || value[1] == '398.3264348843632').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].type = 'RangeBar';
            gauge.axes[0].pointers[0].value = 110;
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.axes[0].startAngle = 110;
            gauge.axes[0].endAngle = 70;
            gauge.axes[0].pointers[0].roundedCornerRadius = 3;
            gauge.refresh();
        });
        it('Dynamic update for Marker - Anti clock wise and markerShape as Text', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                value = svg.getAttribute('transform');
                expect(value == 'rotate(110,544.3753766785476,283.5538485373545)' || value == 'rotate(110,545.3753766785476,283.5538485373545)'
                    || value == 'rotate(110,526.3753766785476,283.5538485373545)' || value == 'rotate(110,535.3753766785476,283.5538485373545)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].type = 'Marker';
            gauge.axes[0].pointers[0].value = 110;
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.axes[0].startAngle = 110;
            gauge.axes[0].endAngle = 150;
            gauge.axes[0].pointers[0].roundedCornerRadius = 3;
            gauge.axes[0].pointers[0].markerShape = 'Text';
            gauge.axes[0].pointers[0].position = 'Cross';
            gauge.axes[0].pointers[0].text = 'Text';
            gauge.refresh();
        });
        it('Dynamic update for Marker - Anti clock wise and markerShape as Triangle', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                value = svg.getAttribute('transform');
                expect(value == 'rotate(20,383.5,225)' || value == 'rotate(20,384.5,225)' || value == 'rotate(20,365.5,225)' || value == 'rotate(20,374.5,225)').toBe(true);
                gauge.setPointerValue(0, 0, 20);
                value = svg.getAttribute('transform');
                expect(value == 'rotate(52,383.5,225)' || value == 'rotate(52,384.5,225)' || value == 'rotate(52,365.5,225)' || value == 'rotate(52,374.5,225)').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].type = 'Marker';
            gauge.axes[0].pointers[0].value = 110;
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.axes[0].startAngle = 110;
            gauge.axes[0].endAngle = 150;
            gauge.axes[0].pointers[0].radius = null;
            gauge.axes[0].pointers[0].markerShape = 'Triangle';
            gauge.axes[0].pointers[0].position = 'Cross';
            gauge.axes[0].pointers[0].text = 'Text';
            gauge.refresh();
        });
        it('Right click event trigger', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {                
                trigger.rightClick(ele, 0, 0, 'touch', 5, gauge);
                done();
            };
            gauge.axes[0].pointers[0].type = 'Marker';
            gauge.axes[0].pointers[0].value = 110;
            gauge.axes[0].direction = 'AntiClockWise';
            gauge.axes[0].startAngle = 110;
            gauge.axes[0].endAngle = 150;
            gauge.axes[0].pointers[0].radius = null;
            gauge.axes[0].pointers[0].markerShape = 'Triangle';
            gauge.axes[0].pointers[0].position = 'Cross';
            gauge.axes[0].pointers[0].text = 'Text';
            gauge.refresh();
        });
    });

    describe('Gauge axis pointer - Animation', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    pointers: [{
                        type: 'Needle',
                        radius: '80%',
                        color: '#b5b5b5',
                        needleTail: {
                            length: '10%'
                        },
                        pointerWidth: 8,
                        cap: {
                            color: '#b5b5b5',
                            border: {
                                width: 0,
                                color: '#DDDDDD'
                            }
                        }
                    }]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking animation event name', (done: Function) => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                expect(args.name == 'animationComplete').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 40;
            gauge.refresh();
        });
        it('Checking needle', (done: Function) => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                expect(svg != null).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].animation.duration = 500;
            gauge.refresh();
        });
        it('Checking pointer animation', (done: Function) => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg != null).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].type = 'Marker';
            gauge.axes[0].pointers[0].markerShape = 'Triangle';
            gauge.refresh();
        });
        it('Checking range bar animation', (done: Function) => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                expect(svg != null).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].type = 'RangeBar';
            gauge.refresh();
        });
		it('Checking animation for changing the value on setPointerValue method', (done: Function) => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_0');
                expect(svg != null).toBe(true);
                done();
            }; 
            gauge.setPointerValue(0, 0, 80);
        });
        it('Checking without animation for changing the pointer value and Text', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.textContent === 'Marker').toBe(true);
                done();
            }; 
            gauge.axes[0].pointers[0].type = 'Marker';
            gauge.axes[0].pointers[0].markerShape = 'Text';
            gauge.axes[0].pointers[0].text = 'Marker';
        });
        it('Checking animation for changing the pointer value and Text', (done: Function) => {
            gauge.animationComplete = (args: IAnimationCompleteEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                expect(svg.textContent === 'Marker').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 50;
        });
    });

    describe('Gauge axis pointer - with multiple pointer and multiple ranges', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    pointers: [
                        {
                            type: 'Marker', markerShape: 'Triangle', radius: '80%', color: '#b5b5b5',
                            needleTail: { length: '10%' }, pointerWidth: 8,
                            cap: { color: '#b5b5b5', border: { width: 0, color: '#DDDDDD' } }
                        },
                        {
                            type: 'Marker', markerShape: 'Triangle', radius: '80%', color: '#b5b5b5',
                            needleTail: { length: '10%' }, pointerWidth: 8,
                            cap: { color: '#b5b5b5', border: { width: 0, color: '#DDDDDD' } }
                        },
                        {
                            type: 'Marker', markerShape: 'Triangle', radius: '80%', color: '#b5b5b5',
                            needleTail: { length: '10%' }, pointerWidth: 8,
                            cap: { color: '#b5b5b5', border: { width: 0, color: '#DDDDDD' } }
                        }, {
                            type: 'Marker', markerShape: 'Triangle', radius: '80%', color: '#b5b5b5',
                            needleTail: { length: '10%' }, pointerWidth: 8,
                            cap: { color: '#b5b5b5', border: { width: 0, color: '#DDDDDD' } }
                        },
                    ]
                }, {
                    pointers: [
                        {
                            type: 'Marker', markerShape: 'Triangle', radius: '80%', color: '#b5b5b5',
                            needleTail: { length: '10%' }, pointerWidth: 8,
                            cap: { color: '#b5b5b5', border: { width: 0, color: '#DDDDDD' } }
                        }, {
                            type: 'Marker', markerShape: 'Triangle', radius: '80%', color: '#b5b5b5',
                            needleTail: { length: '10%' }, pointerWidth: 8,
                            cap: { color: '#b5b5b5', border: { width: 0, color: '#DDDDDD' } }
                        }, {
                            type: 'Marker', markerShape: 'Triangle', radius: '80%', color: '#b5b5b5',
                            needleTail: { length: '10%' }, pointerWidth: 8,
                            cap: { color: '#b5b5b5', border: { width: 0, color: '#DDDDDD' } }
                        }, {
                            type: 'Marker', markerShape: 'Triangle', radius: '80%', color: '#b5b5b5',
                            needleTail: { length: '10%' }, pointerWidth: 8,
                            cap: { color: '#b5b5b5', border: { width: 0, color: '#DDDDDD' } }
                        }
                    ]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('checking elements counts', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxesCollection');
                expect(svg.childElementCount).toBe(2);
                svg = document.getElementById('container_Axis_Pointers_0');
                expect(svg.childElementCount).toBe(4);
                svg = document.getElementById('container_Axis_Pointers_1');
                expect(svg.childElementCount).toBe(4);
                done();
            };
            gauge.axes[0].pointers[0].value = 40;
            gauge.refresh();
        });

        it('checking multiple pointers with multiple gauge', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Marker_0');
                svg1 = document.getElementById('container_Axis_1_Pointer_Marker_0');
                expect(svg.getAttribute('transform') == svg1.getAttribute('transform')).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_1');
                svg1 = document.getElementById('container_Axis_1_Pointer_Marker_1');
                expect(svg.getAttribute('transform') == svg1.getAttribute('transform')).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_2');
                svg1 = document.getElementById('container_Axis_1_Pointer_Marker_2');
                expect(svg.getAttribute('transform') == svg1.getAttribute('transform')).toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_3');
                svg1 = document.getElementById('container_Axis_1_Pointer_Marker_3');
                expect(svg.getAttribute('transform') == svg1.getAttribute('transform')).toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].value = 30;
            gauge.axes[1].pointers[0].value = 30;
            gauge.axes[0].pointers[1].value = 60;
            gauge.axes[1].pointers[1].value = 60;
            gauge.axes[0].pointers[2].value = 90;
            gauge.axes[1].pointers[2].value = 90
            gauge.axes[0].pointers[3].value = 100;
            gauge.axes[1].pointers[3].value = 100;
            gauge.refresh();
        });

        it('checking complete circle of an both axes', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_1_Pointer_Marker_3');
                svg1 = document.getElementById('container_Axis_0_Pointer_Marker_3');
                value = svg.getAttribute('transform').split(',')[0].split('rotate(')[1];
                expect(Math.round(+value)).toBe(180);
                value = svg1.getAttribute('transform').split(',')[0].split('rotate(')[1];
                expect(Math.round(+value)).toBe(-0);
                done();
            };
            gauge.axes[0].labelStyle.autoAngle = true;
            gauge.axes[1].labelStyle.autoAngle = true;
            gauge.axes[0].startAngle = 90;
            gauge.axes[0].endAngle = 90;
            gauge.axes[1].startAngle = 270;
            gauge.axes[1].endAngle = 270;
            gauge.refresh();
        });

        it('checking the range bar pointer', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_1_Pointer_RangeBar_1');
                value = svg.getAttribute('d').split(' ');
                expect(Math.round(+value[1]) == 251 || Math.round(+value[1]) == 256 || Math.round(+value[1]) == 237 || Math.round(+value[1]) == 246).toBe(true);
                expect(Math.round(+value[2])).toBe(225);
                expect(Math.round(+value[9]) == 488 || Math.round(+value[9]) == 483 || Math.round(+value[9]) == 469 || Math.round(+value[9]) == 478).toBe(true);
                expect(Math.round(+value[10])).toBe(300);
                done();
            };
            gauge.axes[1].pointers[1].type = 'RangeBar';
            gauge.axes[1].pointers[1].radius = '60%';
            gauge.refresh();
        });
    });

    describe('Gauge axis pointer behavior - with position', () => {
        beforeAll((): void => {
            ele = createElement('div', { id: 'container' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    pointers: [{
                        offset: '0%',
                        value: 20
                    },
                    {
                        value: 30,
                        type: "Marker",
                        offset: '0%',
                        markerShape: "Rectangle",
                    },
                    {
                        value: 10,
                        type: "RangeBar",
                        offset: '0%'
                    },
                ]
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking default pointer positions', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                value = svg.getAttribute('d').split(' ');
                expect(value[4] == '550' || value[4] == '556.5' || value[4] == '536.5' || value[4] == '546.5').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_1');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '547.5' || value[1] == '554' || value[1] == '534' || value[1] == '544').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_2');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '325.672535347985' || value[1] == '320.51455549131066' || value[1] == '315.672535347985' || value[1] == '307.01455549131066').toBe(true);
                done();
            };
            gauge.refresh();
        });
        it('Checking pointer outside position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svgRect: ClientRect | DOMRect  = document.getElementById('container_Axis_0_Pointer_Needle_0').getBoundingClientRect();
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                value = svg.getAttribute('d').split(' ');
                expect(value[4] == '597.5' || value[4] == '592' || value[4] == '578.5' || value[4] == '587.5').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_1');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '592.5' || value[1] == '587' || value[1] == '573.5' || value[1] == '582.5').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_2');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '311.64970947163255' || value[1] == '301.64970947163255' || value[1] == '306.14970947163255' || value[1] == '292.64970947163255').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].position = 'Inside';
            gauge.axes[0].pointers[1].position = 'Inside';
            gauge.axes[0].pointers[2].position = 'Inside';
            gauge.refresh();
        });
        it('Checking pointer negative point value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                value = svg.getAttribute('d').split(' ');
                expect(value[4] == '598.5' || value[4] == '593' || value[4] == '579.5' || value[4] == '588.5').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_1');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '596' || value[1] == '590.5' || value[1] == '577' || value[1] == '586').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_2');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '307.8874878950502' || value[1] == '302.3874878950502' || value[1] == '288.8874878950502' || value[1] == '297.8874878950502').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].position = 'Cross';
            gauge.axes[0].pointers[1].position = 'Cross';
            gauge.axes[0].pointers[2].position = 'Cross';
            gauge.refresh();
        });

        it('Checking pointer with offset in percentage', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                value = svg.getAttribute('d').split(' ');
                expect(value[4] == '555.7' || value[4] == '550.2' || value[4] == '550.2' || value[4] == '536.7' || value[4] == '545.7').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_1');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '553.2' || value[1] == '547.7' || value[1] == '534.2' || value[1] == '543.2').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_2');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '322.5259500293888' || value[1] == '312.5259500293888' || value[1] == '317.0259500293888' || value[1] == '303.5259500293888').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].offset = '20%';
            gauge.axes[0].pointers[1].offset = '20%';
            gauge.axes[0].pointers[2].offset = '20%';
            gauge.refresh();
        });

        it('Checking pointer with offset in percentage', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_0_Pointer_Needle_0');
                value = svg.getAttribute('d').split(' ');
                expect(value[4] == '619.5' || value[4] == '614' || value[4] == '609.5' || value[4] == '600.5').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_Marker_1');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '619.5' || value[1] == '614' || value[1] == '600.5' || value[1] == '609.5').toBe(true);
                svg = document.getElementById('container_Axis_0_Pointer_RangeBar_2');
                value = svg.getAttribute('d').split(' ');
                expect(value[1] == '297.2848634519545' || value[1] == '287.2848634519545' || value[1] == '291.7848634519545' || value[1] == '278.2848634519545').toBe(true);
                done();
            };
            gauge.axes[0].pointers[0].offset = 20;
            gauge.axes[0].pointers[1].offset = 20;
            gauge.axes[0].pointers[2].offset = 20;
            gauge.axes[0].pointers[0].position = 'Outside';
            gauge.axes[0].pointers[1].position = 'Outside';
            gauge.axes[0].pointers[2].position = 'Outside';
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