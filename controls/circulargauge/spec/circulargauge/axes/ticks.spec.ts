import { createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../../src/circular-gauge/circular-gauge';
import { Axis, Label } from '../../../src/circular-gauge/axes/axis';
import { getAngleFromLocation, GaugeLocation } from '../../../src/circular-gauge/utils/helper-common';
import { ILoadedEventArgs, IAxisLabelRenderEventArgs } from '../../../src/circular-gauge/model/interface';
import  {profile , inMB, getMemoryProfile} from '../../common.spec';
import { axisLabelRender } from '../../../src/circular-gauge/model/constants';

describe('Circular-Gauge Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Axis Tick Lines(Major and Minor)', () => {
        let gauge: CircularGauge;
        let ele: HTMLElement;
        let direction: string;
        let boundingRect: ClientRect;
        let boundingRect1: ClientRect;
        let svg: HTMLElement;
        let value: string | number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'sam' });
            document.body.appendChild(ele);
            gauge = new CircularGauge(
                {
                    axes: [{
                        radius:'100%',
                        startAngle:0,
                        endAngle:0,
                        lineStyle:
                        {
                            width:2
                        },
               
                        majorTicks: 
                        { 
                        width: 3,
                        height: 25, 
                        interval: 10,
                        dashArray:"1,1"
                       },
                       minorTicks: 
                           { 
                           height: 15, 
                           width: 1, 
                           interval:2,
                           dashArray:"1,1"
                           
                       },
                       minimum:0,
                       maximum:100,
                       labelStyle:
                       {
                           hiddenLabel:'Last',
                          
                       }
                    }
               
            ]
                },
                '#sam'
            );
        });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });

        it('Checking axis value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('sam_Axis_0_Label_0');
                expect(svg.textContent == '0').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking axis dashArray major tick line default style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('sam_Axis_Major_TickLine_0_2');
                expect(svg.getAttribute('fill')).toBe('transparent');
                expect(svg.getAttribute('stroke')).toBe('#9E9E9E');
                expect(svg.getAttribute('stroke-width')).toBe('3');
                expect(svg.getAttribute('stroke-dasharray')).toBe('1,1');
                done();
            };
            gauge.refresh();
        });


        it('Checking axis dashArray major tick line given style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('sam_Axis_Major_TickLine_0_2');
                expect(svg.getAttribute('fill') == 'transparent').toBe(true);
                expect(svg.getAttribute('stroke') == 'red').toBe(true);
                expect(svg.getAttribute('stroke-width') == '4').toBe(true);
                expect(svg.getAttribute('stroke-dasharray') == '2,2').toBe(true);
                done();
            };
            gauge.axes[0].majorTicks.color = 'red';
            gauge.axes[0].majorTicks.width = 4;
            gauge.axes[0].majorTicks.dashArray = '2,2';
            gauge.refresh();
        });

        it('Checking default dashArray major interval of the axis', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                direction = document.getElementById('sam_Axis_Major_TickLine_0_2').getAttribute('d');
                expect(direction.match(new RegExp('M', 'g')).length == 1).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking dashArray major interval of the axis given value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                direction = document.getElementById('sam_Axis_Major_TickLine_0_2').getAttribute('d');
                expect(direction.match(new RegExp('M', 'g')).length == 1).toBe(true);
                done();
            };
            gauge.axes[0].majorTicks.position = 'Inside';
            gauge.axes[0].majorTicks.interval = 10;
            gauge.refresh();
        });

        it('Checking dashArray axis major tick inside position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('sam_Axis_MajorTickLines_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('sam_AxisLine_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) > Math.round(boundingRect1.top)).toBe(true);
                expect(Math.round(boundingRect.bottom) < Math.round(boundingRect1.bottom)).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking axis dashArray major tick outside position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('sam_Axis_MajorTickLines_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('sam_AxisLine_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) < Math.round(boundingRect1.top)).toBe(true);
                expect(Math.round(boundingRect.bottom) > Math.round(boundingRect1.bottom)).toBe(true);
                done();
            };
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.refresh();
        });

        it('checking dashArray behaviour to set tick height to 10', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('sam_Axis_MajorTickLines_0');
                expect(svg.getAttribute("height")).toBe(null);
                expect(svg.getAttribute("stroke-dashArray")).toBe(null)
                done();
            };
            gauge.axes[0].majorTicks.height = 10;
            gauge.axes[0].majorTicks.dashArray="2";
            gauge.refresh();
        });

        
        it('checking dashArray behaviour to set tick height greater than dashArray', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('sam_Axis_MajorTickLines_0');
                expect(svg.getAttribute("height")).toBe(null);
                expect(svg.getAttribute("stroke-dashArray")).toBe(null)
                done();
            };
            gauge.axes[0].majorTicks.height = 5;
            gauge.axes[0].majorTicks.dashArray="6";
            gauge.refresh();
        });
           
      

        it('Checking axis dashArray minor tick line default style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('sam_Axis_Minor_TickLine_0_2');
                expect(svg.getAttribute('fill')).toBe('transparent');
                expect(svg.getAttribute('stroke')).toBe('#9E9E9E');
                expect(svg.getAttribute('stroke-width')).toBe('1');
                expect(svg.getAttribute('stroke-dasharray')).toBe('1,1');
                done();
            };
            gauge.refresh();
        });

        it('Checking axis dashArray minor tick line given style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('sam_Axis_Minor_TickLine_0_2');
                expect(svg.getAttribute('fill') == 'transparent').toBe(true);
                expect(svg.getAttribute('stroke') == 'red').toBe(true);
                expect(svg.getAttribute('stroke-width') == '2').toBe(true);
                expect(svg.getAttribute('stroke-dasharray') == '2,2').toBe(true);
                done();
            };
            gauge.axes[0].minorTicks.color = 'red';
            gauge.axes[0].minorTicks.width = 2;
            gauge.axes[0].minorTicks.dashArray = '2,2';
            gauge.refresh();
        });
        it('Checking axis dashArray minor tick inside position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('sam_Axis_Minor_TickLine_0_2').getBoundingClientRect();
                boundingRect1 = document.getElementById('sam_AxisLine_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) > Math.round(boundingRect1.top)).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking axis dashArray minor tick outside position', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('sam_Axis_MinorTickLines_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('sam_AxisLine_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) < Math.round(boundingRect1.top)).toBe(true);
                done();
            };
            gauge.axes[0].minorTicks.position = 'Outside';
            gauge.refresh();
        });

        it('Checking default dashArray minor tick interval of the axis', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                direction = document.getElementById('sam_Axis_Minor_TickLine_0_2').getAttribute('d');
                expect(direction.match(new RegExp('M', 'g')).length == 1).toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking dashArray minor ticks interval of the axis given value', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                direction = document.getElementById('sam_Axis_Minor_TickLine_0_2').getAttribute('d');
                expect(direction.match(new RegExp('M', 'g')).length == 1).toBe(true);
                done();
            };
            gauge.axes[0].minorTicks.position = 'Inside';
            gauge.axes[0].minorTicks.interval = 2;
            gauge.refresh();
        });

        it('checking minor dashArray tick lines width', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('sam_Axis_MinorTickLines_0');
                expect(svg.getAttribute("stroke-width")).toBe(null);
                expect(svg.getAttribute("stroke-dashArray")).toBe(null)
                done();
            };
            gauge.axes[0].minorTicks.width = 2;
            gauge.axes[0].minorTicks.dashArray="2";
            gauge.refresh();
        });

        it('Checking axis default label', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('sam_Axis_Labels_0');
                expect(svg.childElementCount == 10).toBe(true);
                svg = document.getElementById('sam_Axis_0_Label_0');
                expect(svg.textContent == '10').toBe(false);
                expect(svg.getAttribute('text-anchor') == 'end').toBe(false);
                svg = document.getElementById('sam_Axis_0_Label_3');
                expect(svg.textContent == '20').toBe(false);
                expect(svg.getAttribute('text-anchor') == 'end').toBe(true);
                done();
            };
            gauge.refresh();
        });

        it('Checking axis default label style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('sam_Axis_0_Label_0');
                expect(svg.getAttribute('fill')).toBe('#212121');
                expect(svg.style.fontSize).toBe('12px');
                expect(svg.style.fontStyle).toBe('normal');
                expect(svg.style.fontWeight).toBe('normal');
                done();
            };
            gauge.refresh();
        });


        it('Checking axis given label style', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('sam_Axis_0_Label_0');
                expect(svg.getAttribute('fill') == 'red').toBe(true);
                expect(svg.style.fontSize == '14px').toBe(true);
                expect(svg.style.fontStyle == 'normal').toBe(true);
                expect(svg.style.fontWeight == 'normal').toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.font.color = 'red';
            gauge.axes[0].labelStyle.font.size = '14px';
            gauge.refresh();
        });

        it('Checking axis labels outside position dashArray major tick outside', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('sam_Axis_Labels_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('sam_Axis_MajorTickLines_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) < Math.round(boundingRect1.top)).toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.position = 'Outside';
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.axes[0].majorTicks.width = 2;
            gauge.axes[0].majorTicks.height = 20;
            gauge.axes[0].majorTicks.interval = 10;
            gauge.refresh();
        });

        it('Checking axis labels outside position dashArray minor tick outside', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                boundingRect = document.getElementById('sam_Axis_Labels_0').getBoundingClientRect();
                boundingRect1 = document.getElementById('sam_Axis_MinorTickLines_0').getBoundingClientRect();
                expect(Math.round(boundingRect.top) < Math.round(boundingRect1.top)).toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.position = 'Outside';
            gauge.axes[0].minorTicks.position = 'Outside';
            gauge.axes[0].minorTicks.interval = 2;

            gauge.refresh();
        });
         
        

        it('checking dashArray behaviour to set startangle and endangle', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('sam_AxisLine_0');
                expect(svg.getAttribute('startAngle')).toBe(null);
                expect(svg.getAttribute('endAngle')).toBe(null);
                done();
            };
            gauge.axes[0].startAngle = 270;
            gauge.axes[0].endAngle = 90;
            gauge.refresh();
        });

        
        it('checking dashArray behaviour to set single value', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('sam_AxisLine_0');
                expect(svg.getAttribute('dashArray')).toBe(null);
                done();
            };
            gauge.axes[0].majorTicks.dashArray = '3';
            gauge.refresh();
        });

        it('checking dashArray behaviour to set two values', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('sam_AxisLine_0');
                expect(svg.getAttribute('dashArray')).toBe(null);
                done();
            };
            gauge.axes[0].majorTicks.dashArray = '1,1';
            gauge.refresh();
        });

        
        it('checking offset property to dashArray', function (done) {
            gauge.loaded = function (args) {
                svg = document.getElementById('sam_AxisLine_0');
                expect(svg.getAttribute('offset')).toBe(null);
                done();
            };
            gauge.axes[0].majorTicks.offset = 2;
            gauge.refresh();
        });

        

        it('checking behaviour to set dashArray to (0,0)', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('sam_Axis_MajorTickLines_0');
                expect(svg.getAttribute('stroke-dasharray')=='0,0').toBe(false);
                done();
            };
            gauge.axes[0].majorTicks.dashArray = '0,0';
            gauge.refresh();
        });
    });
});