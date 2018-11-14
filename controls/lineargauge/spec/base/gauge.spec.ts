/**
 * Linear gauge spec document
 */
import { Browser, EventHandler, createElement, EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, ILoadEventArgs } from '../../src/linear-gauge/model/interface';
import { LinearGauge } from '../../src/linear-gauge/linear-gauge';
import { Annotations } from '../../src/linear-gauge/annotations/annotations';
LinearGauge.Inject(Annotations);

describe('Linear gauge control', () => {
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

        it('checking with guage instance', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                expect(gauge != null).toBe(true);
            };
        });

        it('checking wkith gauge element', () => {
            let ele: HTMLElement = document.getElementById("container");
            expect(ele.childNodes.length).toBeGreaterThan(0);
        });

        it('checking with module name', (): void => {
            expect(gauge.getModuleName()).toBe('lineargauge');
        });

        it('checking with empty width property', (): void => {
            svg = document.getElementById('container_svg');
            expect(svg.getAttribute('width') != null).toBe(true);
        });

        it('checking with empty height property', (): void => {
            svg = document.getElementById('container_svg');
            expect(svg.getAttribute('height')).toEqual('450');
        });

        it('checking with background color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_svg');
                expect(svg != null).toBe(true);
            };
            gauge.background = 'red';
            gauge.border.width = 2;
            gauge.refresh();
        });

        it('checking with background color', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeBorder');
                expect(svg != null).toBe(true);
            };
            gauge.background = 'green';
            gauge.refresh();
        });

        it('checking with height property', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_svg');
                expect(svg.getAttribute('height')).toEqual('600');
            };
            gauge.height = '600';
            gauge.refresh();
        });

        it('checking with height in percentage', (done: Function) => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_svg');
                expect(svg.getAttribute('height') == '450').toBe(true);
                done();
            };
            gauge.height = '50%';
            gauge.refresh();
        });

        it('checking with width in percentage', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_svg');
                expect(svg !== null).toBe(true);
            };
            gauge.width = '50%';
            gauge.refresh();
        });

        it('checking with width property', () => {
            gauge.loaded = (arg: ILoadedEventArgs): void => {
                svg = document.getElementById('container_svg');
                expect(svg.getAttribute('width')).toBe('800');
            };
            gauge.width = '800';
            gauge.refresh();
        });

        it('checking the load event', () => {
            gauge.width = '600';
            gauge.height = '450';
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById("container_svg");
                expect(svg.getAttribute('width')).toEqual('900');
                expect(svg.getAttribute('height')).toEqual('600');
            };
            gauge.load = (args: ILoadEventArgs): void => {
                gauge.width = '900';
                gauge.height = '600';
            };
            gauge.refresh();
        });

        it('checking with empty gauge title', () => {
            svg = document.getElementById('container_LinearGaugeTitle');
            expect(svg == null).toEqual(true);
        });

        it('checking with gauge title', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeTitle');
                expect(svg != null).toBe(true);
            };
            gauge.title = 'linear gauge';
            gauge.refresh();
        });

        it('checking with gauge title content', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeTitle');
                expect(svg.textContent == 'linear gauge').toBe(true);
            };
            gauge.title = 'linear gauge';
            gauge.refresh();
        });

        it('checking with title font size', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeTitle');
                expect(svg.style.fontSize).toEqual('20px');
            };
            gauge.titleStyle.size = '20px';
            gauge.refresh();
        });

        it('checking with title font family', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeTitle');
                expect(svg.style.fontFamily).toEqual('serif');
            };
            gauge.titleStyle.fontFamily = 'Serif';
            gauge.refresh();
        });

        it('checking with title font style', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeTitle');
                expect(svg.style.fontStyle).toEqual('oblique');
            };
            gauge.titleStyle.fontStyle = 'oblique';
            gauge.refresh();
        });

        it('checking with title font weight', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeTitle');
                expect(svg.style.fontWeight).toEqual('bold');
            };
            gauge.titleStyle.fontWeight = 'bold';
            gauge.refresh();
        });

        it('checking with gauge border color', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeBorder');
                expect(svg.getAttribute('stroke')).toEqual('green');
            };
            gauge.border.color = 'green';
            gauge.border.width = 1;
            gauge.refresh();
        });

        it('checking with gauge border opacity', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeBorder');
                expect(svg != null).toBe(true);
            };
            gauge.border.width = 5;
            gauge.refresh();
        });

        it('checking with gauge border color', () => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeBorder');
                expect(svg.getAttribute('stroke')).toEqual('red');
            };
            gauge.border.color = 'red';
            gauge.refresh();
        });

        it('checking with gauge border width', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_LinearGaugeBorder');
                expect(svg.getAttribute('stroke-width')).toEqual('5');
            };
            gauge.border.width = 5;
            gauge.refresh();
        });

        it('checking with container group', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Normal_Layout');
                expect(svg != null).toBe(true);
            };
            gauge.container.height = 400;
            gauge.container.width = 30;
            gauge.refresh();
        });

        it('checking with container normal rectangle box', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Normal_Layout');
                expect(svg != null).toBe(true);
            };
            gauge.container.height = 400;
            gauge.container.width = 30;
            gauge.container.type = 'Normal';
            gauge.refresh();
        });

        it('checking with container rounded rectangle box', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_RoundedRectangle_Layout');
                expect(svg != null).toBe(true);
            };
            gauge.container.height = 400;
            gauge.container.width = 30;
            gauge.container.type = 'RoundedRectangle';
            gauge.refresh();
        });

        it('checking with container thermometer', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Thermometer_Layout');
                expect(svg != null).toBe(true);
            };
            gauge.container.height = 400;
            gauge.container.width = 30;
            gauge.container.type = 'Thermometer';
            gauge.refresh();
        });

        it('checking with container fill', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Thermometer_Layout');
                expect(svg.getAttribute('stroke') == '#bfbfbf').toBe(true);
            };
            gauge.container.height = 400;
            gauge.container.width = 30;
            gauge.refresh();
        });

        it('checking with container fill', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Thermometer_Layout');
                expect(svg.getAttribute('fill') == 'green').toBe(true);
            };
            gauge.container.height = 400;
            gauge.container.width = 30;
            gauge.container.backgroundColor = 'green';
            gauge.refresh();
        });

        it('checking with container stroke', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Thermometer_Layout');
                expect(svg.getAttribute('stroke') == 'red').toBe(true);
            };
            gauge.container.height = 400;
            gauge.container.width = 30;
            gauge.container.border.color = 'red';
            gauge.refresh();
        });

        it('checking with container stroke width', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Thermometer_Layout');
                expect(svg.getAttribute('stroke-width') == '5').toBe(true);
            };
            gauge.container.height = 400;
            gauge.container.width = 30;
            gauge.container.border.width = 5;
            gauge.refresh();
        });

        it('checking with horizontal orientation', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_svg');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.refresh();
        });

        it('checking with Normal Container', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Normal_Layout');
                expect(svg != null).toBe(true);
            };
            gauge.container.type = 'Normal'
            gauge.orientation = 'Horizontal';
            gauge.refresh();
        });

        it('checking with Container height and width', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Normal_Layout');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.container.height = 400;
            gauge.container.width = 20;
            gauge.refresh();
        });

        it('checking with Rounded Rectangle Container', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_RoundedRectangle_Layout');
                expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.container.type = 'RoundedRectangle';
            gauge.refresh();
        });

        it('checking with Thermometer Container', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                svg = document.getElementById('container_Thermometer_Layout');
                // expect(svg != null).toBe(true);
            };
            gauge.orientation = 'Horizontal';
            gauge.container.type = 'Thermometer';
            gauge.refresh();
        });

        it('checking with persist data method', (): void => {
            gauge.getPersistData();
        });
    });

    describe('set pointer value', () => {
        let element: HTMLElement;
        let gauge: LinearGauge;
        beforeAll((): void => {
            element = createElement('div', { id: 'container' });
            document.body.appendChild(element);
            gauge = new LinearGauge();
            gauge.appendTo('#container');
        });
        afterAll((): void => {
            element.remove();
        });

        it('checking with setPointerValue Method in vertical orientation', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg != null).toBe(true);
            };
            gauge.setPointerValue(0, 0, 30);
        });

        it('checking with setPointerValue Method in horizontal orientation', (): void => {
            gauge.loaded = (args: ILoadedEventArgs): void => {
                let svg: HTMLElement = document.getElementById('container_AxisIndex_0_MarkerPointer_0');
                expect(svg != null).toBe(true);
            };
            gauge.setPointerValue(0, 0, 30);
        });
    });
    describe('Checking onproperty changed method ', () => {
        let element: HTMLElement;
        let gauge: LinearGauge;
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
        it('checking with height and width', (): void => {
            gauge.height = '600';
            gauge.width = '900';
            gauge.dataBind();
        });

        it('checking with title', (): void => {
            gauge.title = 'Linear gauge';
            gauge.dataBind();
        });

        it('checking with title style', (): void => {
            gauge.titleStyle.size = '30px';
            gauge.dataBind();
        });

        it('checking with border', (): void => {
            gauge.border.color = 'red';
            gauge.border.width = 5;
            gauge.dataBind();
        });

        it('checking with background', (): void => {
            gauge.background = 'green';
            gauge.dataBind();
        });

        it('checking with title font Weight', (): void => {
            gauge.titleStyle.fontWeight = 'Bold';
            gauge.dataBind();
        });

        it('checking with container', (): void => {
            gauge.container.type = 'Thermometer';
            gauge.dataBind();
        });

        it('Checking resize event', () => {
            gauge.gaugeResize(<Event>{});
        });
    });
});

