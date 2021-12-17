/**
 * Linear gauge spec document
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { MouseEvents } from '../base/events.spec';
import  {profile , inMB, getMemoryProfile} from '../common.spec';

describe('Linear gauge control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Checking axis properties', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let containerPosition: string;
        let newContainerPosition: string;
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

        it('checking with axis isInversed', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Group_0');
                expect(svg.childElementCount > 0).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes[0].isInversed = true;
            gauge.refresh();
        });

        it('Checking with axis opposed position', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Group_0');
                expect(svg.childElementCount > 0).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes[0].opposedPosition = true;
            gauge.refresh();
        });

        it('checking with axis line height', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes[0].line.height = 300;
            gauge.refresh();
        });

        it('checking with axis line width', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes[0].line.width = 5;
            gauge.refresh();
        });

        it('checking with two axis', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Group_0');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_Axis_Group_1');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes = [{}, {
                opposedPosition: true
            }];
            gauge.refresh();
        });

        it('checking the axis element', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Group_0');
                expect(svg.childElementCount > 0).toBe(true);
            };
            gauge.refresh();
        });

        it('checking with axis line element', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg != null).toBe(true);
            };
            gauge.refresh();
        });

        it('checking with axis line color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg === null).toBe(true);
            };
            gauge.axes[0].line.width = 0;
            gauge.axes[0].line.color = 'green';
            gauge.refresh();
        });

        it('checking with axis line height', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg !== null).toBe(true);
            };
            gauge.axes[0].line.width = 1;
            gauge.axes[0].line.height = 400;
            gauge.refresh();
        });


        it('checking with axis line width', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('stroke-width') == '5').toBe(true);
            };
            gauge.axes[0].line.width = 5;
            gauge.refresh();
        });

        it('checking with major tick line', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg != null).toBe(true);
            };
            gauge.refresh();
        });

        it('checking with major tick line color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('stroke')).toEqual('red');
            };
            gauge.axes[0].majorTicks.color = 'red';
            gauge.refresh();
        });

        it('checking with major tick line color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('stroke')).toEqual('green');
            };
            gauge.axes[0].majorTicks.color = 'green';
            gauge.refresh();
        });

        it('checking with major tick line width', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg.getAttribute('stroke-width')).toEqual('5');
            };
            gauge.axes[0].majorTicks.width = 5;
            gauge.refresh();
        });

        it('checking with minor tick line', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg != null).toBe(true);
            };
            gauge.refresh();
        });

        it('checking with minor tick line color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('stroke')).toEqual('red');
            };
            gauge.axes[0].minorTicks.color = 'red';
            gauge.refresh();
        });

        it('checking with minor tick line color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('stroke')).toEqual('green');
            };
            gauge.axes[0].minorTicks.color = 'green';
            gauge.refresh();
        });

        it('checking with minor tick line width', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MinorTicksLine_0');
                expect(svg.getAttribute('stroke-width')).toEqual('5');
            };
            gauge.axes[0].minorTicks.width = 5;
            gauge.refresh();
        });

        it('checking with axis labels group', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabelsGroup');
                expect(svg.childElementCount > 0).toBe(true);
            };
            gauge.refresh();
        });

        it('checking with axis labels comparison in vertical orientation', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_0');
                expect(svg !== null).toBe(true);
            };
            gauge.refresh();
        });

        it('checking with axis labels font color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_3');
                expect(svg !== null).toBe(true);
            };
            gauge.axes[0].labelStyle.font.color = 'red';
            gauge.refresh();
        });

        it('checking with axis labels font size', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_0');
                expect(svg.style.fontSize == '10px').toBe(true);
            };
            gauge.axes[0].labelStyle.font.size = '10px';
            gauge.refresh();
        });

        it('checking with axis labels font family', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_0');
                expect(svg.style.fontFamily == 'Georgia').toBe(true);
            };
            gauge.axes[0].labelStyle.font.fontFamily = 'Georgia';
            gauge.refresh();
        });

        it('checking with axis labels font style', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_0');
                expect(svg.style.fontStyle == 'italic').toBe(true);
            };
            gauge.axes[0].labelStyle.font.fontStyle = 'italic';
            gauge.refresh();
        });

        it('checking with axis labels in range colors', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_0');
                expect(svg !== null).toBe(true);
            };
            gauge.axes[0].labelStyle.useRangeColor = true;
            gauge.axes[0].ranges[0].start = 0;
            gauge.axes[0].ranges[0].end = 30;
            gauge.refresh();
        });

        it('checking with axis labels font weight', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_0');
                expect(svg.style.fontWeight == 'lighter').toBe(true);
            };
            gauge.axes[0].labelStyle.font.fontWeight = 'lighter';
            gauge.refresh();
        });

        it('checking with axis labels font opacity', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_0');
                expect(svg.style.opacity == '1').toBe(true);
            };
            gauge.refresh();
        });

        it('checking with axis labels text content', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_0');
                expect(svg.textContent == '0').toBe(true);
            };
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 50;
            gauge.axes[0].majorTicks.interval = 10;
            gauge.refresh();
        });


        it('checking with axis labels format', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_0');
                expect(svg.textContent == '0%').toBe(true);
            };
            gauge.axes[0].labelStyle.format = '{value}%';
            gauge.refresh();
        });

        it('checking with axis labels text content', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_5');
                expect(svg.textContent == '50').toBe(true);
            };
            gauge.axes[0].minimum = 0;
            gauge.axes[0].maximum = 50;
            gauge.axes[0].labelStyle.format = '';
            gauge.axes[0].majorTicks.interval = 10;
            gauge.refresh();
        });

        it('checking with axis inversed', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg1: HTMLElement = document.getElementById('container_AxisLabel_5');
                expect(svg1 !== null).toBe(true);
            };
            gauge.axes[0].isInversed = true;
            gauge.refresh();
        });

        it('checking with axis inversed with interval', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_1');
                expect(svg.textContent == '50').toBe(true);
            };
            gauge.axes[0].isInversed = true;
            gauge.axes[0].majorTicks.interval = 50;
            gauge.refresh();
        });

        it('checking with axis maximum', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_1');
                expect(svg.textContent == '200').toBe(true);
            };
            gauge.axes[0].maximum = 200;
            gauge.axes[0].majorTicks.interval = 200;
            gauge.refresh();
        });

        it('checking with axis minimum', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_0');
                expect(svg.textContent == '20').toBe(true);
            };
            gauge.axes[0].minimum = 20;
            gauge.refresh();
        });

        it('checking with multiple axis', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Group_0');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_Axis_Group_1');
                expect(svg != null).toBe(true);
                svg = document.getElementById('container_Axis_Group_2');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes = [{}, {
                opposedPosition: true
            }, {}];
            gauge.refresh();
        });
        it('checking with axis opposed position', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Normal_Layout');
                expect(svg !== null).toBe(true);
            };
            gauge.axes = [{}];
            gauge.container.height = 400;
            gauge.container.width = 30;
            gauge.container.border.width = 5;
            gauge.axes[0].opposedPosition = true;
            gauge.refresh();
        });

        it('checking with multiple axes', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                let svg1: HTMLElement = document.getElementById('container_AxisLine_1');
                expect(svg != null).toBe(true);
                expect(svg1 != null).toBe(true);
            };
            gauge.axes = [
                {
                    opposedPosition: false,
                    majorTicks: {
                        interval: 20
                    }
                },
                {
                    opposedPosition: true,
                    majorTicks: {
                        interval: 10
                    }
                }
            ];
            gauge.refresh();
        });

        it('checking with three axes', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Group_0');
                let svg1: HTMLElement = document.getElementById('container_Axis_Group_1');
                let svg2: HTMLElement = document.getElementById('container_Axis_Group_2');
                expect(svg != null).toBe(true);
                expect(svg1 != null).toBe(true);
                expect(svg2 != null).toBe(true);
            };
            gauge.axes = [
                {
                    opposedPosition: false,
                    majorTicks: {
                        interval: 20
                    }
                },
                {
                    opposedPosition: true,
                    majorTicks: {
                        interval: 10
                    }
                },
                {
                    opposedPosition: false,
                    majorTicks: {
                        interval: 20
                    }
                }

            ];
            gauge.refresh();
        });

        it('checking with three axes - horizontal', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Axis_Group_0');
                let svg1: HTMLElement = document.getElementById('container_Axis_Group_1');
                let svg2: HTMLElement = document.getElementById('container_Axis_Group_2');
                // expect(svg != null).toBe(true);
                // expect(svg1 != null).toBe(true);
                // expect(svg2 != null).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.axes = [
                {
                    opposedPosition: false,
                    majorTicks: {
                        interval: 20
                    }
                },
                {
                    opposedPosition: true,
                    majorTicks: {
                        interval: 10
                    }
                },
                {
                    opposedPosition: false,
                    majorTicks: {
                        interval: 20
                    }
                }

            ];
            gauge.refresh();
        });

        it('checking with allow margin property', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                let path = svg.getAttribute('d');
                let split = path.split(" ");
                element = document.getElementById('container_LinearGaugeTitle');
                let y = element.getAttribute('y');
                expect(Number(y) == Number(split[1]) - 25).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.allowMargin = false;
            gauge.title = 'LinearGauge';
            gauge.titleStyle.size = '30px';
            gauge.container.type = 'Normal';
            gauge.axes = [{}];
            gauge.refresh();
        });

        it('checking with allow margin property - axis inversed', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                let path = svg.getAttribute('d');
                let split = path.split(" ");
                element = document.getElementById('container_LinearGaugeTitle');
                let y = element.getAttribute('y');
                expect(Number(y) == Number(split[1]) - 25).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.allowMargin = false;
            gauge.title = 'LinearGauge';
            gauge.axes[0].isInversed = true;
            gauge.titleStyle.size = '30px';
            gauge.container.type = 'Normal';
            gauge.axes = [{}];
            gauge.refresh();
        });

        it('checking with allow margin property - thermometer type container', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Thermometer_Layout');
                let path = svg.getAttribute('d');
                let split = path.split(" ");
                element = document.getElementById('container_LinearGaugeTitle');
                let y = element.getAttribute('y');
                expect(Number(y) + 10 <= Number(split[split.length -3])).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.container.type = 'Thermometer';
            gauge.allowMargin = false;
            gauge.title = 'LinearGauge';
            gauge.titleStyle.size = '30px';
            gauge.width = '10';
            gauge.axes = [{}];
            gauge.refresh();
        });

        it('checking with allow margin property - thermometer type container width is zero', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Thermometer_Layout');
                let path = svg.getAttribute('d');
                let split = path.split(" ");
                element = document.getElementById('container_LinearGaugeTitle');
                let y = element.getAttribute('y');
                expect(Number(y) + 10 <= Number(split[split.length -3])).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.container.type = 'Thermometer';
            gauge.allowMargin = false;
            gauge.title = 'LinearGauge';
            gauge.titleStyle.size = '30px';
            gauge.width = '0';
            gauge.axes = [{}];
            gauge.refresh();
        });

        it('checking label offset - Vertical', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Container_Group');
                if(gauge.axes[0].labelStyle.offset === 0){
                    containerPosition = svg.getAttribute('transform');
                } else{
                    newContainerPosition = svg.getAttribute('transform');
                    expect(containerPosition == newContainerPosition).toBe(true);
                }
            };
            gauge.orientation = 'Vertical';
            gauge.axes = [
                {
                    minimum: 0,
                    maximum: 100
                },
                {
                    minimum: 20,
                    maximum: 50
                },
            ];
            gauge.refresh();
            gauge.axes[0].labelStyle.offset = 50;
            gauge.refresh();
        });

        it('checking label offset - Vertical with opposed position', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Container_Group');
                let svg1 = document.getElementById('container_Axis_Collections');
                if(gauge.axes[0].labelStyle.offset === 0){
                    containerPosition = svg.getAttribute('transform');
                } else{
                    newContainerPosition = svg.getAttribute('transform');
                    expect(containerPosition == newContainerPosition).toBe(true);
                }  
            };
            gauge.orientation = 'Vertical';
            gauge.axes = [
                {
                    opposedPosition: true,
                    minimum: 0,
                    maximum: 100
                },
                {
                    minimum: 20,
                    maximum: 50
                },
            ];
            gauge.refresh();
            gauge.axes[0].labelStyle.offset = 50;
            gauge.refresh();
        });

        it('checking label offset - Horizontal', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Container_Group');
                let svg1 = document.getElementById('container_Axis_Collections');
                if(gauge.axes[0].labelStyle.offset === 0){
                    containerPosition = svg.getAttribute('transform');
                } else{
                    newContainerPosition = svg.getAttribute('transform');
                    expect(containerPosition == newContainerPosition).toBe(true);
                }
            };
            gauge.orientation = 'Horizontal';
            gauge.axes = [
                {
                    minimum: 0,
                    maximum: 100
                },
                {
                    minimum: 20,
                    maximum: 50
                },
            ];
            gauge.refresh();
            gauge.axes[0].labelStyle.offset = 50;
            gauge.refresh();
        });

        it('checking label offset - Horizontal with opposed position', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Container_Group');
                let svg1 = document.getElementById('container_Axis_Collections');
                if(gauge.axes[0].labelStyle.offset === 0){
                    containerPosition = svg.getAttribute('transform');
                } else{
                    newContainerPosition = svg.getAttribute('transform');
                    expect(containerPosition == newContainerPosition).toBe(true);
                }
            };
            gauge.orientation = 'Horizontal';
            gauge.axes = [
                {
                    opposedPosition: true,
                    minimum: 0,
                    maximum: 100
                },
                {
                    minimum: 20,
                    maximum: 50
                },
            ];
            gauge.refresh();
            gauge.axes[0].labelStyle.offset = 50;
            gauge.refresh();
        });

        it('checking with axes same minimum and maximum - horizontal', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg1: HTMLElement = <HTMLElement>document.getElementById('container_AxisLine_0');
                let path = svg1.getAttribute('d');
                let split = path.split(" ");
                expect(split[0].slice(-1) == split[3] ).toBe(true);
                expect(split[1] == split[4].match(/\d/g)[0]).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes = [
                {
                    minimum: 0,
                    maximum: 0
                }
            ];
            gauge.refresh();
        });

        it('checking with axes same minimum and maximum - Vertical', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg1: HTMLElement = <HTMLElement>document.getElementById('container_AxisLine_0');
                let path = svg1.getAttribute('d');
                let split = path.split(" ");
                expect(split[0].slice(-1) == split[3] ).toBe(true);
                expect(split[1] == split[4].match(/\d/g)[0]).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.axes = [
                {
                    minimum: 0,
                    maximum: 0
                }
            ];
            gauge.refresh();
        });

        it('checking with multiple axes - horizontal with same minimum and maximum', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg1: HTMLElement = <HTMLElement>document.getElementById('container_Axis_Group_0').childNodes[4];
                let svg2: HTMLElement = <HTMLElement>document.getElementById('container_Axis_Group_1').childNodes[4];
                let svg3: HTMLElement = <HTMLElement>document.getElementById('container_Axis_Group_2').childNodes[4];
                expect(svg1.childElementCount == 0).toBe(true);
                expect(svg2.childElementCount != 0).toBe(true);
                expect(svg3.childElementCount == 0).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes = [
                {
                    minimum: 0,
                    maximum: 0
                },
                {
                    minimum: 10,
                    maximum: 20
                },
                {
                    minimum: 50,
                    maximum: 50
                }
            ];
            gauge.refresh();
        });

        it('checking with multiple axes - Vertical with same minimum and maximum', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg1: HTMLElement = <HTMLElement>document.getElementById('container_Axis_Group_0').childNodes[4];
                let svg2: HTMLElement = <HTMLElement>document.getElementById('container_Axis_Group_1').childNodes[4];
                let svg3: HTMLElement = <HTMLElement>document.getElementById('container_Axis_Group_2').childNodes[4];
                expect(svg1.childElementCount == 0).toBe(true);
                expect(svg2.childElementCount != 0).toBe(true);
                expect(svg3.childElementCount == 0).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.axes = [
                {
                    minimum: 0,
                    maximum: 0
                },
                {
                    minimum: 10,
                    maximum: 20
                },
                {
                    minimum: 50,
                    maximum: 50
                }
            ];
            gauge.refresh();
        });

        it('checking container rendering - RoundedRectangle type in Horizontal', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Container_Group');
                expect(svg == null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.container.type = 'RoundedRectangle';
            gauge.container.height = 0;
            gauge.container.width = 0;
            gauge.axes = [
                {
                    opposedPosition: true,
                    minimum: 0,
                    maximum: 100
                },
                {
                    minimum: 20,
                    maximum: 50
                },
            ];
            gauge.refresh();
        });

        it('checking container rendering - RoundedRectangle type in Vertical', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Container_Group');
                expect(svg == null).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.container.type = 'RoundedRectangle';
            gauge.container.height = 0;
            gauge.container.width = 0;
            gauge.axes = [
                {
                    opposedPosition: true,
                    minimum: 0,
                    maximum: 100
                },
                {
                    minimum: 20,
                    maximum: 50
                },
            ];
            gauge.refresh();
        });

        it('checking container rendering - Thermometer type in Horizontal', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Container_Group');
                expect(svg == null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.container.type = 'Thermometer';
            gauge.container.height = 0;
            gauge.container.width = 0;
            gauge.axes = [
                {
                    opposedPosition: true,
                    minimum: 0,
                    maximum: 100
                },
                {
                    minimum: 20,
                    maximum: 50
                },
            ];
            gauge.refresh();
        });

        it('checking container rendering - Thermometer type in Vertical', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Container_Group');
                expect(svg == null).toBe(true);
            };
            gauge.orientation = 'Vertical';
            gauge.container.type = 'Thermometer';
            gauge.container.height = 0;
            gauge.container.width = 0;
            gauge.axes = [
                {
                    opposedPosition: true,
                    minimum: 0,
                    maximum: 100
                },
                {
                    minimum: 20,
                    maximum: 50
                },
            ];
            gauge.refresh();
        });

        it('checking label color with repsect to range color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLabel_2');
                let firstColor = svg.getAttribute('style').split(":");
                expect(firstColor[1].split(';')[0] != 'red').toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.axes = [
                {
                    minimum: 0,
                    maximum: 50,
                    ranges:[
                        {
                            start: 20,
                            end: 20,
                            color: 'red'
                        }
                    ],
                    labelStyle: {
                        useRangeColor: true
                    }
                }
            ]
            gauge.axes[0].majorTicks.interval = 10;
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

    describe('Checking axis properties', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
        let trigger: MouseEvents = new MouseEvents();
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge({
                orientation: 'Horizontal',
                axes: [{
                    line: {
                        color: '#9E9E9E'
                    },
                    pointers: [{
                        value: 10,
                        height: 15,
                        width: 15,
                        placement: 'Near',
                        color: '#757575',
                        offset: -50,
                        markerType: 'Triangle'
                    }],
                    majorTicks: {
                        color: '#9E9E9E',
                        interval: 10
                    },
                    minorTicks: {
                        color: '#9E9E9E',
                        interval: 2
                    },
                    labelStyle: {
                        font: {
                            color: '#424242'
                        },
                        offset: 48
                    }
                }],
                annotations: [{
                    content: '<div id="pointer" style="width:70px"><h1 style="font-size:14px;color:#424242">10 MPH</h1></div>',
                    axisIndex: 0,
                    axisValue: 10,
                    x: 10, zIndex: '1',
                    y: -70
                }]
            });
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            element.remove();
        });

        it('checking with axis color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_MajorTicksLine_0');
                expect(svg !== null).toBe(true);
            };
            gauge.refresh();
        });

        it('Checking with axis Label color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_AxisLine_0');
                expect(svg.getAttribute('fill')).toBe('#9E9E9E');
            };
            gauge.refresh();
        });
    });
    describe('Axis Label behaviour', () => {
        let gauge: LinearGauge;
        let ele: HTMLElement;
        let direction: string;
        let boundingRect: ClientRect;
        let boundingRect1: ClientRect;
        let svg: HTMLElement;
        let value: string[] | string | number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'gauge' });
            document.body.appendChild(ele);
            gauge = new LinearGauge({
                axes: [{                       
                    showLastLabel: false,
                    majorTicks: {
                        width: 2,
                        interval: 8
                    },
                        minorTicks: {
                        width: 1
                    },
                    labelStyle: {
                        font: {
                            color: 'green',
                            fontFamily: 'Roboto',
                            size: '12px',
                            fontWeight: 'Regular'
                        },
                        offset: -5
                    },
                    pointers: [{
                        value: 60,
                        color: '#757575'
                    }]

                }]
            },
                '#gauge'
        );
    });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking last label', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_Axis_Collections');
                expect(svg.childElementCount == 1).toBe(true);
                svg = document.getElementById('gauge_AxisLabel_12');
                expect(svg.textContent == '96').toBe(true);
                let svg1 = parseFloat(svg.textContent);
                svg = document.getElementById('gauge_AxisLabel_13');
                expect(svg.textContent == '100').toBe(true);
                let svg2 = parseFloat(svg.textContent);
                expect(svg1 != svg2).toBe(true);
                expect(gauge.axes[0].labelStyle.format != null).toBe(true);
                done();
            };
            gauge.axes[0].showLastLabel = true;
            gauge.refresh();
        });

        it('Checking label format', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_13');
                expect(gauge.axes[0].labelStyle.format == "{value}").toBe(true);
                done();
            };
            gauge.axes[0].labelStyle.format = "{value}";
            gauge.refresh();
        });
    });
    describe('Axis Label and ticks position based on position property', () => {
        let gauge: LinearGauge;
        let ele: HTMLElement;
        let direction: string;
        let boundingRect: ClientRect;
        let boundingRect1: ClientRect;
        let svg: HTMLElement;
        let value: string[] | string | number;
        beforeAll((): void => {
            ele = createElement('div', { id: 'gauge' });
            document.body.appendChild(ele);
            gauge = new LinearGauge({
                orientation : "Horizontal",
                axes: [{    
                    majorTicks: {
                        width: 2, offset: 10,
                        interval: 8,
                    },
                        minorTicks: {
                        width: 1, offset: 10,
                    },
                    labelStyle: {
                        offset: 10
                    },
                }]
            },
                '#gauge'
        );
    });
        afterAll((): void => {
            gauge.destroy();
            ele.remove();
        });
        it('Checking defualt position of label and ticks', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('y')).toBe('219');
                done();
            };
            gauge.refresh();
        });
        it('Checking Inside position of label and ticks', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('y')).toBe('179');
                done();
            };
            gauge.axes[0].minorTicks.position = 'Inside';
            gauge.axes[0].majorTicks.position = 'Inside';
            gauge.axes[0].labelStyle.position = 'Inside';
            gauge.refresh();
        });
        it('Checking Inside position of label and ticks with opposed', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('y') == '278.5' || svg.getAttribute('y') == '279').toBe(true);
                done();
            };
            gauge.axes[0].opposedPosition = true;
            gauge.refresh();
        });
        it('Checking Outside position of label and ticks', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('y') == '278.5' || svg.getAttribute('y') == '279').toBe(true);
                done();
            };
            gauge.axes[0].opposedPosition = false;
            gauge.axes[0].minorTicks.position = 'Outside';
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.axes[0].labelStyle.position = 'Outside';
            gauge.refresh();
        });
        it('Checking Outside position of label and ticks with opposed', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('y')).toBe('179');
                done();
            };
            gauge.axes[0].opposedPosition = true;
            gauge.refresh();
        });
        it('Checking Cross position of label and ticks', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('y') == '218.75' || svg.getAttribute('y') == '219').toBe(true);
                done();
            };
            gauge.axes[0].opposedPosition = false;
            gauge.axes[0].minorTicks.position = 'Cross';
            gauge.axes[0].majorTicks.position = 'Cross';
            gauge.axes[0].labelStyle.position = 'Cross';
            gauge.refresh();
        });
        it('Checking cross label position with inside outside position of ticks', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('y') == '218.75' || svg.getAttribute('y') == '219').toBe(true);
                done();
            };
            gauge.axes[0].minorTicks.position = 'Inside';
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.axes[0].labelStyle.position = 'Cross';
            gauge.refresh();
        });
        it('Checking inside label position with cross position of ticks', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('y')).toBe('200');
                done();
            };
            gauge.axes[0].minorTicks.position = 'Cross';
            gauge.axes[0].majorTicks.position = 'Cross';
            gauge.axes[0].labelStyle.position = 'Inside';
            gauge.refresh();
        });
        it('Checking label inside position with oppsed inside and outside position of ticks', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('y')).toBe('189');
                done();
            };
            gauge.axes[0].minorTicks.position = 'Inside';
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.axes[0].labelStyle.position = 'Inside';
            gauge.refresh();
        });
        it('Checking label inside position with oppesed inside and outside position of ticks and orientation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('y') == '268.5' || svg.getAttribute('y') == '269').toBe(true);
                done();
            };
            gauge.axes[0].opposedPosition = true;
            gauge.refresh();
        });


        it('Checking Inside position of label and ticks with vertical orientation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('x') == '326.5' || svg.getAttribute('x') == '320' || svg.getAttribute('x') == '322.5').toBe(true);
                done();
            };
            gauge.orientation = "Vertical";
            gauge.axes[0].opposedPosition = false;
            gauge.axes[0].minorTicks.position = 'Inside';
            gauge.axes[0].majorTicks.position = 'Inside';
            gauge.axes[0].labelStyle.position = 'Inside';
            gauge.refresh();
        });
        it('Checking Inside position of label and ticks with vertical orientation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('x') == '430.5' || svg.getAttribute('x') == '425' || svg.getAttribute('x') == '427.5').toBe(true);
                done();
            };
            gauge.axes[0].opposedPosition = true;
            gauge.refresh();
        });
        it('Checking Outside position of label and ticks with vertical orientation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('x') == '430.5' || svg.getAttribute('x') == '425' || svg.getAttribute('x') == '427.5').toBe(true);
                done();
            };
            gauge.axes[0].opposedPosition = false;
            gauge.axes[0].minorTicks.position = 'Outside';
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.axes[0].labelStyle.position = 'Outside';
            gauge.refresh();
        });
        it('Checking Outside position of label and ticks with oppsed and vertical orientation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('x') == '326.5' || svg.getAttribute('x') == '320' || svg.getAttribute('x') == '322.5').toBe(true);
                done();
            };
            gauge.axes[0].opposedPosition = true;
            gauge.refresh();
        });
        it('Checking Cross position of label and ticks with vertical orientation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('x') == '371.5' || svg.getAttribute('x') == '365.75' || svg.getAttribute('x') == '368.25'
                || svg.getAttribute('x') == '496.75').toBe(true);
                done();
            };
            gauge.axes[0].opposedPosition = false;
            gauge.axes[0].minorTicks.position = 'Cross';
            gauge.axes[0].majorTicks.position = 'Cross';
            gauge.axes[0].labelStyle.position = 'Cross';
            gauge.refresh();
        });
        it('Checking cross label position with inside outside position of ticks with vertical orientation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('x') == '371.5' || svg.getAttribute('x') == '365.75' || svg.getAttribute('x') == '368.25').toBe(true);
                done();
            };
            gauge.axes[0].minorTicks.position = 'Inside';
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.axes[0].labelStyle.position = 'Cross';
            gauge.refresh();
        });
        // it('Checking inside label position with cross position of ticks with vertical orientation', (done: Function) => {
        //     debugger
        //     gauge.loaded = (args: ILoadedEventArgs): void => {
        //         svg = document.getElementById('gauge_AxisLabel_0');
        //         expect(svg.getAttribute('x') == '335.5' || svg.getAttribute('x') == '347.5' || svg.getAttribute('x') == '343.5' || svg.getAttribute('x') == '472' || svg.getAttribute('x') == '329'
        //         || svg.getAttribute('x') == '461' || svg.getAttribute('x') == '331.5').toBe(true);
        //         done();
        //     };
        //     gauge.axes[0].minorTicks.position = 'Cross';
        //     gauge.axes[0].majorTicks.position = 'Cross';
        //     gauge.axes[0].labelStyle.position = 'Inside';
        //     gauge.refresh();
        // });
        it('Checking label inside position with opposed inside and outside position of ticks, vertical orientation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('x') == '336.5' || svg.getAttribute('x') == '330' || svg.getAttribute('x') == '332.5'
                || svg.getAttribute('x') == '461').toBe(true);
                done();
            };
            gauge.axes[0].minorTicks.position = 'Inside';
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.axes[0].labelStyle.position = 'Inside';
            gauge.refresh();
        });
        it('Checking label inside position with oppesed inside and outside position of ticks, vertical orientation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('x') == '420.5' || svg.getAttribute('x') == '415' || svg.getAttribute('x') == '417.5').toBe(true);
                done();
            };
            gauge.axes[0].opposedPosition = true;
            gauge.refresh();
        });
        it('Checking label outside position with oppesed inside position of ticks, vertical orientation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('x') == '390.5' || svg.getAttribute('x') == '516' || svg.getAttribute('x') == '385' || svg.getAttribute('x') == '387.5').toBe(true);
                done();
            };
            gauge.axes[0].opposedPosition = false;
            gauge.axes[0].minorTicks.position = 'Inside';
            gauge.axes[0].majorTicks.position = 'Inside';
            gauge.axes[0].labelStyle.position = 'Outside';
            gauge.refresh();
        });
        it('Checking label inside position with oppesed outside position of ticks, vertical orientation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('x') == '366.5' || svg.getAttribute('x') == '491' || svg.getAttribute('x') == '360' || svg.getAttribute('x') == '362.5').toBe(true);
                done();
            };
            gauge.axes[0].minorTicks.position = 'Outside';
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.axes[0].labelStyle.position = 'Inside';
            gauge.refresh();
        });
        it('Checking label outside position with oppesed inside position of ticks, horizontal orientation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('y') == '238.5' || svg.getAttribute('y') == '239').toBe(true);
                done();
            };
            gauge.orientation = 'Horizontal';
            gauge.axes[0].minorTicks.position = 'Inside';
            gauge.axes[0].majorTicks.position = 'Inside';
            gauge.axes[0].labelStyle.position = 'Outside';
            gauge.refresh();
        });
        it('Checking label inside position with oppesed outside position of ticks, horizontal orientation', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('gauge_AxisLabel_0');
                expect(svg.getAttribute('y')).toBe('219');
                done();
            };
            gauge.axes[0].minorTicks.position = 'Outside';
            gauge.axes[0].majorTicks.position = 'Outside';
            gauge.axes[0].labelStyle.position = 'Inside';
            gauge.refresh();
        });

    });
});