/**
 * Linear gauge spec document
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ILoadEventArgs, IAnimationCompleteEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { MouseEvents } from '../base/events.spec';

describe('Linear gauge control', () => {
    describe('Checking axis properties', () => {
        let gauge: LinearGauge;
        let element: HTMLElement;
        let svg: HTMLElement;
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

        it('checking with axis opposed position', (): void => {
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
            gauge.axes = [{}];
        });
        it('checking with axis opposed position', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Normal_Layout');
                expect(svg !== null).toBe(true);
            };
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
    });
});