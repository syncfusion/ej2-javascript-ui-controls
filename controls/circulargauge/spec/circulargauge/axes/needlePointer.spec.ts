/**
 * Circular Gauge Spec Started
 */

import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { Range, Pointer } from '../../../src/circular-gauge/axes/axis';
import { ILoadedEventArgs, IAnimationCompleteEventArgs } from '../../../src/circular-gauge/model/interface';
import { GaugeLocation } from '../../../src/circular-gauge/utils/helper-common';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';

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
            ele = createElement('div', { id: 'gauge' });
            document.body.appendChild(ele);
            gauge = new CircularGauge({
                axes: [{
                    radius: '80%',
                    pointers: [{
                        animation: { enable: false },
                        value: 60,
                        radius: '60%',
                        color: '#F8C7FD',
                        pointerWidth: 7,
                        needleStartWidth:2,
                        needleEndWidth:4,
                        needleTail: {
                             length: '25%'
                           }
                    },
                    {
                        type:'Marker',
                        value:60
                    },
                    {
                        type:'RangeBar',
                        value:60
                    }
                          ]
                    }]
            });
            gauge.appendTo('#gauge');
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });

        it('Checking default pointer style', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('gauge_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('fill')).toBe('#F8C7FD');
                expect(svg.getAttribute('stroke')).toBe('#DDDDDD');
                expect(svg.getAttribute('stroke-width')).toBe('0');
                done();
            };
            gauge.refresh();
        });
      

        it('Checking startwidth and endwidth to set 0', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('gauge_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('needleStartWidth')).toBe(null);
                expect(svg.getAttribute('needleEndWidth')).toBe(null);
                done();
            };
            gauge.axes[0].pointers[0].needleStartWidth = 0;
            gauge.axes[0].pointers[0].needleEndWidth = 0;
            gauge.refresh();
        });
      it('Checking startwidth to set 0 and endwidth to set value', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('gauge_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('needleStartWidth')).toBe(null);
                expect(svg.getAttribute('needleEndWidth')).toBe(null);
                done();
            };
            gauge.axes[0].pointers[0].needleStartWidth = 0;
            gauge.axes[0].pointers[0].needleEndWidth = 3;
            gauge.refresh();
        });

      

        it('Checking startwidth to set value and endwidth to set 0', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('gauge_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('needleStartWidth')).toBe(null);
                expect(svg.getAttribute('needleEndWidth')).toBe(null);
                done();
            };
            gauge.axes[0].pointers[0].needleStartWidth = 3;
            gauge.axes[0].pointers[0].needleEndWidth = 0;
            gauge.refresh();
        });
    
        it('Checking pointer customization needle', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('gauge_Axis_0_Pointer_Needle_0');
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

        it('Checking value of the needle pointer', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('gauge_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('value')).toBe(null);
                done();
            };
            gauge.axes[0].pointers[0].value = 60;
            gauge.refresh();
        });
      
        it('Checking color of the needle pointer', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('gauge_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('color') == '#F8C7FD').toBe(false);
                done();
            };
            gauge.axes[0].pointers[0].color = '#F8C7FD';
            gauge.refresh();
        });

        it('Checking type of the pointer', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('gauge_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('type')=='marker').toBe(false);
                done();
            };
            gauge.refresh();
        });
        it('Checking element count', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_Axis_0_Pointer_0');
                expect(svg.childElementCount == 4).toBe(true);
                done();
            };
    
            gauge.refresh();
        });
       it('Checking pointer length - default', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('gauge_Axis_0_Pointer_Needle_0').getBoundingClientRect();
                expect(Math.round(boundingRect.height) == 92 || Math.round(boundingRect.height) == 91).toBe(true);
                expect(Math.round(boundingRect.width)).toBe(60);
                done();
            };
            gauge.refresh();
        });
        it('Checking pointer length - given length', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('gauge_Axis_0_Pointer_Needle_0').getBoundingClientRect();
                expect(Math.round(boundingRect.height)).toBe(149);
                expect(Math.round(boundingRect.width)).toBe(97);
                done();
            };
            gauge.axes[0].pointers[0].radius = '100%';
            gauge.refresh();
        });

        it('Checking needlePointer with markerpointer', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('value')).toBe(null);
                svg = document.getElementById('gauge_Axis_0_Pointer_Marker_1');
                expect(svg.getAttribute('value')).toBe(null);
                done();
            };
            gauge.axes[0].pointers[0].value = 60;
            gauge.refresh();
        });
        it('Checking Range bar pointer', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_Axis_0_Pointer_Needle_0');
                expect(svg.getAttribute('value')).toBe(null);
                svg = document.getElementById('gauge_Axis_0_Pointer_RangeBar_2');
                expect(svg.getAttribute('value')).toBe(null);
                done();
            
            };
            gauge.axes[0].pointers[0].value = 60;
            gauge.refresh();
        });

        it('Checking pointer value with aria-label', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_Axis_0_Pointer_0');
                expect(svg.getAttribute('aria-label')).toBe('Pointer:60');
                done();
            };
            gauge.axes[0].pointers[0].value = 60;
            gauge.refresh();
        });

    });              
});    
