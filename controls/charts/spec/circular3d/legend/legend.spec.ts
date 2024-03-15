import { createElement } from '@syncfusion/ej2-base';
import { CircularChart3D } from '../../../src/circularchart3d/circularchart3d';
import { getElement, removeElement } from '../../../src/common/utils/helper';
import { PieSeries3D } from '../../../src/circularchart3d/renderer/series';
import { CircularChartLegend3D} from '../../../src/circularchart3d/legend/legend';
import { CircularChart3DLegendRenderEventArgs, CircularChart3DLegendClickEventArgs } from '../../../src/circularchart3d/model/pie-interface';
import { MouseEvents } from '../../chart3d/base/events.spec';
import { CircularChartDataLabel3D } from '../../../src/circularchart3d/renderer/dataLabel';
import { CircularChartHighlight3D } from '../../../src/circularchart3d/user-interaction/high-light';
import { CircularChartSelection3D } from '../../../src/circularchart3d/user-interaction/selection';
import { getMemoryProfile, inMB, profile } from '../../common.spec';

CircularChart3D.Inject(PieSeries3D, CircularChartLegend3D, CircularChartDataLabel3D, CircularChartSelection3D, CircularChartHighlight3D);

export const piedata: Object[] = [
    { y: 18, x: 'Bald Eagle', text: 'Bald Eagle : 18' }, { y: 23, x: 'Bison', text: 'Bison : 23' },
    { y: 30, x: 'Brown Bear', text: 'Brown Bear : 30' }, { y: 44, x: 'Elk', text: 'Elk : 44' },
    { y: 52, x: 'Pronghorn', text: 'Pronghorn : 52' }, { y: 62, x: 'Turkey', text: 'Turkey : 62' }
];

describe('Accumulation Chart Control', () => {
    beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/tslint/config
        const isDef = (o: unknown) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Pie Legend checking', () => {
        let ele: HTMLElement;
        const id: string = 'ej2container';
        let legendEle: Element;
        const legendId: string = id + '_chart_legend';
        let pie: CircularChart3D;
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            pie = new CircularChart3D({
                series: [
                    {
                        dataSource: piedata,
                        dataLabel: { visible: false, name: 'text' },
                        animation: { enable: false }, xName: 'x', yName: 'y'
                    }
                ], width: '600', height: '400', legendSettings: { visible: false }, tilt: 30
            });
            pie.appendTo('#' + id);
        });

        afterAll((): void => {
            pie.loaded = null;
            pie.destroy();
            removeElement(id);
        });
        it('Pie Legend visibility false checking', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_g');
                expect(legendEle).toBe(null);
                done();
            };
            pie.refresh();
        });
        it('Pie Legend visibility visible checking', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_translate_g');
                expect(legendEle.childNodes.length).toBe(6);
                expect(legendEle.childNodes.length).toBe(pie.visibleSeries[0].points.length);
                done();
            };
            pie.legendSettings.visible = true;
            pie.refresh();
        });
        it('Pie Legend auto position chekcing width is greater than height', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('488');
                expect(legendEle.getAttribute('y')).toBe('124');
                expect(legendEle.getAttribute('height')).toBe('152');
                expect(legendEle.getAttribute('width')).toBe('102');
                done();
            };
            pie.refresh();
        });
        it('Pie Legend auto position chekcing while width is less than height', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('35');
                expect(legendEle.getAttribute('y')).toBe('534');
                expect(legendEle.getAttribute('height')).toBe('56');
                expect(legendEle.getAttribute('width')).toBe('330');
                done();
            };
            pie.height = '600';
            pie.width = '400';
            pie.refresh();
        });
        it('Pie Legend left position chekcing', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(parseInt(legendEle.getAttribute('x'), 10)).toBe(10);
                expect(legendEle.getAttribute('y')).toBe('124');
                expect(legendEle.getAttribute('height')).toBe('152');
                expect(legendEle.getAttribute('width')).toBe('102');
                done();
            };
            pie.legendSettings.position = 'Left';
            pie.height = '400';
            pie.width = '600';
            pie.refresh();
        });
        it('Pie Legend Top position chekcing', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('47.5');
                expect(parseInt(legendEle.getAttribute('y'), 10)).toBe(11);
                expect(legendEle.getAttribute('height')).toBe('32');
                expect(legendEle.getAttribute('width')).toBe('505');
                done();
            };
            pie.legendSettings.position = 'Top';
            pie.refresh();
        });
        it('Pie Legend Bottom position checking', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('47.5');
                expect(legendEle.getAttribute('y')).toBe('358');
                expect(legendEle.getAttribute('height')).toBe('32');
                expect(legendEle.getAttribute('width')).toBe('505');
                done();
            };
            pie.legendSettings.position = 'Bottom';
            pie.refresh();
        });
        it('Pie Legend Right position chekcing', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('488');
                expect(legendEle.getAttribute('y')).toBe('124');
                expect(legendEle.getAttribute('height')).toBe('152');
                expect(legendEle.getAttribute('width')).toBe('102');
                done();
            };
            pie.legendSettings.position = 'Right';
            pie.refresh();
        });
        it('Pie Legend Right position chekcing with fixed legend size', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle).not.toBe(null);
                done();
            };
            pie.legendSettings.height = '100';
            pie.legendSettings.width = '90';
            pie.refresh();
        });
        it('Pie Legend position chekcing with fixed legend position', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('100');
                expect(legendEle.getAttribute('y')).toBe('100');
                done();
            };
            pie.legendSettings.position = 'Custom';
            pie.legendSettings.location = { x: 100, y: 100 };
            pie.refresh();
        });
        it('Pie Legend chekcing with padding', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                const legendBoundX: number = parseInt(legendEle.getAttribute('x'), 10);
                legendEle = getElement(legendId + '_shape_0');
                const legendShapeX: number = parseInt(legendEle.getAttribute('d').split(' ')[1], 10);
                expect(legendShapeX - legendBoundX).toBe(15);
                done();
            };
            pie.legendSettings.padding = 10;
            pie.refresh();
        });
        it('Pie Legend chekcing with itemPadding', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                const legendBoundY: number = parseInt(legendEle.getAttribute('y'), 10);
                legendEle = getElement(legendId + '_text_0');
                const legendTextY: number = parseInt(legendEle.getAttribute('y'), 10);
                expect(legendTextY - legendBoundY).toBe(20);
                done();
            };
            pie.legendSettings.padding = 8;
            pie.legendSettings.itemPadding = 10;
            pie.refresh();
        });
        it('Pie Legend chekcing with shape height', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_shape_0');
                expect(legendEle.getAttribute('d')).toBe('M 113 116 L 118 116 A 5 5 0 1 1 113 111 Z M 114 114.8 L118 114.8 A 5 5 0 0 0 114 111 Z');
                done();
            };
            pie.legendSettings.itemPadding = null;
            pie.legendSettings.shapeHeight = 12;
            pie.refresh();
        });
        it('Pie Legend chekcing with shape width', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_shape_1');
                expect(legendEle.getAttribute('d')).toBe('M 114 140 L 119 140 A 5 5 0 1 1 114 135 Z M 115.2 139 L119 139 A 5 5 0 0 0 115.2 135 Z');
                done();
            };
            pie.legendSettings.shapeHeight = 10;
            pie.legendSettings.shapeWidth = 12;
            pie.refresh();
        });
        it('Pie Legend chekcing with shapePadding', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_shape_1');
                expect(legendEle.getAttribute('d')).toBe('M 113 140 L 118 140 A 5 5 0 1 1 113 135 Z M 114 139 L118 139 A 5 5 0 0 0 114 135 Z');
                done();
            };
            pie.legendSettings.shapeWidth = 10;
            pie.legendSettings.shapePadding = 10;
            pie.refresh();
        });
        it('Pie Legend chekcing with backround', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('fill')).toBe('blue');
                done();
            };
            pie.legendSettings.background = 'blue';
            pie.refresh();
        });
        it('Pie Legend chekcing with opacity', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('opacity')).toBe('2');
                done();
            };
            pie.legendSettings.opacity = 2;
            pie.refresh();
        });
        it('Pie Legend chekcing with description', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_g_0');
                expect(legendEle.getAttribute('aria-label')).toBe('Pie Legend chekcing with description');
                done();
            };
            pie.legendSettings.description = 'Pie Legend chekcing with description';
            pie.refresh();
        });
        it('Pie Legend chekcing with alignment as Near', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('10');
                const y: number = parseInt(legendEle.getAttribute('y'), 10);
                expect(y).toBe(290);
                done();
            };
            pie.legendSettings.position = 'Bottom';
            pie.legendSettings.alignment = 'Near';
            pie.refresh();
        });
        it('Pie Legend chekcing with alignment as Far', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('500');
                const y: number = parseInt(legendEle.getAttribute('y'), 10);
                expect(y).toBe(290);
                done();
            };
            pie.legendSettings.alignment = 'Far';
            pie.refresh();
        });
        it('Pie Legend chekcing with alignment as Center', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('255');
                const y: number = parseInt(legendEle.getAttribute('y'), 10);
                expect(y).toBe(290);
                done();
            };
            pie.legendSettings.alignment = 'Center';
            pie.refresh();
        });
        it('Pie Legend chekcing with text styles and text alignment as Near', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('255');
                const y: number = parseInt(legendEle.getAttribute('y'), 10);
                expect(y).toBe(290);
                done();
            };
            pie.legendSettings.textStyle.textAlignment = 'Near';
            pie.refresh();
        });
        it('Pie Legend chekcing with text styles and text alignment as Far', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('255');
                const y: number = parseInt(legendEle.getAttribute('y'), 10);
                expect(y).toBe(290);
                done();
            };
            pie.legendSettings.textStyle.textAlignment = 'Far';
            pie.refresh();
        });
        it('Pie Legend chekcing with text styles and text alignment as Center', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('255');
                const y: number = parseInt(legendEle.getAttribute('y'), 10);
                expect(y).toBe(290);
                done();
            };
            pie.legendSettings.textStyle.textAlignment = 'Center';
            pie.refresh();
        });
        it('Pie Legend chekcing with all text styles', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_text_0');
                expect(legendEle.getAttribute('fill')).toBe('red');
                expect(legendEle.getAttribute('font-size')).toBe('16px');
                expect(legendEle.getAttribute('font-style')).toBe('italic');
                expect(legendEle.getAttribute('font-weight')).toBe('500');
                expect(legendEle.getAttribute('font-family')).toBe('verdana');
                expect(legendEle.getAttribute('opacity')).toBe('2');
                done();
            };
            pie.legendSettings.textStyle.color = 'red';
            pie.legendSettings.textStyle.size = '16px';
            pie.legendSettings.textStyle.fontStyle = 'italic';
            pie.legendSettings.textStyle.fontWeight = '500';
            pie.legendSettings.textStyle.fontFamily = 'verdana';
            pie.legendSettings.textStyle.opacity = 2;
            pie.refresh();
        });
        it('Pie Legend chekcing with border', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('stroke')).toBe('black');
                expect(legendEle.getAttribute('stroke-width')).toBe('3');
                done();
            };
            pie.legendSettings.border.color = 'black';
            pie.legendSettings.border.width = 3;
            pie.refresh();
        });
        it('Pie Legend chekcing with margin', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_text_0');
                expect(legendEle.getAttribute('x')).toBe('283');
                const y: number = parseInt(legendEle.getAttribute('y'), 10);
                expect(y).toBe(296);
                done();
            };
            pie.legendSettings.margin.left = 15;
            pie.legendSettings.margin.right = 15;
            pie.legendSettings.margin.top = 15;
            pie.legendSettings.margin.bottom = 15;
            pie.refresh();
        });
        it('Pie Legend chekcing with containerPadding', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_text_0');
                expect(legendEle.getAttribute('x')).toBe('283');
                const y: number = parseInt(legendEle.getAttribute('y'), 10);
                expect(y).toBe(281);
                done();
            };
            pie.legendSettings.containerPadding.left = 15;
            pie.legendSettings.containerPadding.right = 15;
            pie.legendSettings.containerPadding.top = 15;
            pie.legendSettings.containerPadding.bottom = 15;
            pie.refresh();
        });
        it('Pie Legend chekcing with isIversed', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_text_0');
                expect(legendEle.getAttribute('x')).toBe('263');
                const y: number = parseInt(legendEle.getAttribute('y'), 10);
                expect(y).toBe(281);
                done();
            };
            pie.legendSettings.isInversed = true;
            pie.refresh();
        });
        it('Pie Legend chekcing with reverse', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_text_0');
                expect(legendEle.getAttribute('x')).toBe('283');
                const y: number = parseInt(legendEle.getAttribute('y'), 10);
                expect(y).toBe(411);
                done();
            };
            pie.legendSettings.isInversed = false;
            pie.legendSettings.reverse = true;
            pie.refresh();
        });
    });

    describe('Pie Legend checking with Title', () => {
        let ele: HTMLElement;
        const id: string = 'ej2container';
        let legendEle: Element;
        const legendId: string = id + '_chart_legend';
        let pie: CircularChart3D;
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            pie = new CircularChart3D({
                series: [
                    {
                        dataSource: piedata,
                        dataLabel: { visible: true, name: 'text' },
                        animation: { enable: false }, xName: 'x', yName: 'y'
                    }
                ], width: '600', height: '400', legendSettings: { visible: true }, tilt: 30
            });
            pie.appendTo('#' + id);
        });

        afterAll((): void => {
            pie.loaded = null;
            pie.destroy();
            removeElement(id);
        });
        it('Pie Legend title visibility checking', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_title');
                expect(legendEle.textContent).toBe('Legend Title');
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('469.1');
                expect(legendEle.getAttribute('y')).toBe('116');
                expect(legendEle.getAttribute('height')).toBe('168');
                expect(legendEle.getAttribute('width')).toBe('102');
                done();
            };
            pie.legendSettings.title = 'Legend Title';
            pie.refresh();
        });
        it('Pie Legend title checking with Title Postion as Left', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_title');
                expect(legendEle.textContent).toBe('Legend Title');
                expect(legendEle.getAttribute('x')).toBe('520.1');
                expect(legendEle.getAttribute('y')).toBe('140');
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('469.1');
                expect(legendEle.getAttribute('y')).toBe('124');
                expect(legendEle.getAttribute('height')).toBe('152');
                expect(legendEle.getAttribute('width')).toBe('102');
                done();
            };
            pie.legendSettings.titlePosition = 'Left';
            pie.refresh();
        });
        it('Pie Legend title checking with Title Postion as Right', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_title');
                expect(legendEle.textContent).toBe('Legend Title');
                expect(legendEle.getAttribute('x')).toBe('520.1');
                expect(legendEle.getAttribute('y')).toBe('140');
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('469.1');
                expect(legendEle.getAttribute('y')).toBe('124');
                expect(legendEle.getAttribute('height')).toBe('152');
                expect(legendEle.getAttribute('width')).toBe('102');
                done();
            };
            pie.legendSettings.titlePosition = 'Right';
            pie.refresh();
        });
        it('Pie Legend title checking with Legend Position as Top', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_title');
                expect(legendEle.textContent).toBe('Legend Title');
                expect(legendEle.getAttribute('x')).toBe('300');
                expect(legendEle.getAttribute('y')).toBe('27');
                legendEle = getElement(legendId + '_element');
                expect(legendEle.getAttribute('x')).toBe('47.5');
                expect(legendEle.getAttribute('y')).toBe('11');
                expect(legendEle.getAttribute('height')).toBe('48');
                expect(legendEle.getAttribute('width')).toBe('505');
                done();
            };
            pie.legendSettings.titlePosition = 'Top';
            pie.legendSettings.position = 'Top';
            pie.refresh();
        });
        it('Pie Legend title with all styles', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_title');
                expect(legendEle.getAttribute('fill')).toBe('red');
                expect(legendEle.getAttribute('font-size')).toBe('16px');
                expect(legendEle.getAttribute('font-style')).toBe('italic');
                expect(legendEle.getAttribute('font-weight')).toBe('500');
                expect(legendEle.getAttribute('font-family')).toBe('verdana');
                expect(legendEle.getAttribute('opacity')).toBe('2');
                done();
            };
            pie.legendSettings.titleStyle.color = 'red';
            pie.legendSettings.titleStyle.size = '16px';
            pie.legendSettings.titleStyle.fontStyle = 'italic';
            pie.legendSettings.titleStyle.fontWeight = '500';
            pie.legendSettings.titleStyle.fontFamily = 'verdana';
            pie.legendSettings.titleStyle.opacity = 2;
            pie.refresh();
        });

    });

    describe('Checking Pie Legend Events', () => {
        let ele: HTMLElement;
        const id: string = 'ej2container';
        let legendEle: Element;
        const legendId: string = id + '_chart_legend';
        const trigger: MouseEvents = new MouseEvents();
        let pie: CircularChart3D;
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            pie = new CircularChart3D({
                series: [
                    {
                        dataSource: piedata,
                        dataLabel: { visible: false, name: 'text' },
                        animation: { enable: false }, xName: 'x', yName: 'y'
                    }
                ], width: '600', height: '400', legendSettings: { visible: true }, tilt: 30
            });
            pie.appendTo('#' + id);
        });

        afterAll((): void => {
            pie.loaded = null;
            pie.destroy();
            removeElement(id);
        });

        it('Pie Legend chekcing with toggle visibilty as true', (done: Function) => {
            let isFirstClick: boolean = true;
            pie.loaded = () => {
                if (isFirstClick) {
                    isFirstClick = false;
                    legendEle = getElement(legendId + '_text_0');
                    trigger.clickEvent(legendEle);
                    expect(pie.visibleSeries[0].points[0].visible).toBe(false);
                }
                done();
            };
            pie.refresh();
        });
        it('Pie Legend chekcing with toggle visibilty as false', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_text_0');
                trigger.clickEvent(legendEle);
                expect(pie.visibleSeries[0].points.length).toBe(6);
                done();
            };
            pie.legendSettings.toggleVisibility = false;
            pie.refresh();
        });
        it('Check Legend Click event', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_text_0');
                trigger.clickEvent(legendEle);
                expect(legendEle.textContent).toBe('Bald Eagle');
                done();
            };
            pie.legendClick = (args: CircularChart3DLegendClickEventArgs): void => {
                args.legendText = 'Legend Text changed Using Legend Click';
            };
            pie.refresh();
        });
        it('Check Legend Render event with HTML Entity', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_text_0');
                expect(legendEle.textContent).toBe('Legend Text changed Using Legend Render & added the HTML Entity');
                done();
            };
            pie.legendRender = (args: CircularChart3DLegendRenderEventArgs): void => {
                args.text = 'Legend Text changed Using Legend Render &amp; added the HTML Entity';
            };
            pie.legendSettings.position = 'Bottom';
            pie.refresh();
        });
        it('Pie Legend chekcing with maximumLabelWidth', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_g_0');
                expect((<HTMLElement>legendEle.childNodes[1]).textContent.indexOf('...') > -1).toBe(true);
                done();
            };
            pie.legendSettings.maximumLabelWidth = 100;
            pie.refresh();
        });
        it('Legend long text trimming feature checking textover flow as Clip', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_g_0');
                expect((<HTMLElement>legendEle.childNodes[1]).textContent.indexOf('...') === -1).toBe(true);
                done();
            };
            pie.legendSettings.textOverflow = 'Clip';
            pie.refresh();
        });
        it('Legend long text trimming feature checking textWrap as Wrap', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_g_0');
                expect((legendEle.childNodes[1].childNodes.length > 1)).toBe(true);
                done();
            };
            pie.legendSettings.textWrap = 'Wrap';
            pie.refresh();
        });
        it('Check Legend mouse move event', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_text_0');
                trigger.mousemovetEvent(legendEle, 0, 0);
                done();
            };
            pie.legendSettings.enableHighlight = true;
            pie.refresh();
        });
    });
    describe('Checking Pie series themes and palletes', () => {
        let ele: HTMLElement;
        const id: string = 'ej2container';
        let pie: CircularChart3D;
        let legendEle: Element;
        const legendId: string = id + '_chart_legend';
        beforeAll((): void => {
            ele = createElement('div', { id: id });
            document.body.appendChild(ele);
            pie = new CircularChart3D({
                series: [
                    {
                        dataSource: piedata,
                        dataLabel: { visible: false, name: 'text' },
                        animation: { enable: false }, xName: 'x', yName: 'y'
                    }
                ], width: '600', height: '400', legendSettings: { visible: true }, tilt: 30
            });
            pie.appendTo('#' + id);
        });

        afterAll((): void => {
            pie.loaded = null;
            pie.destroy();
            removeElement(id);
        });
        it('Check Material theme  ', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_text_0');
                expect(legendEle.getAttribute('fill')).toBe('rgba(97, 97, 97, 1)');
                expect(legendEle.getAttribute('font-family')).toBe('Roboto');
                legendEle = getElement(legendId + '_shape_0');
                expect(legendEle.getAttribute('fill')).toBe('#00bdae');
                done();
            };
            pie.theme = 'Material';
            pie.refresh();
        });
        it('Check Fabric theme  ', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_text_0');
                expect(legendEle.getAttribute('fill')).toBe('#666666');
                expect(legendEle.getAttribute('font-family')).toBe('Segoe UI');
                legendEle = getElement(legendId + '_shape_0');
                expect(legendEle.getAttribute('fill')).toBe('#4472c4');
                done();
            };
            pie.theme = 'Fabric';
            pie.refresh();
        });
        it('Check Bootstrap theme  ', (done: Function) => {
            pie.loaded = () => {
                legendEle = getElement(legendId + '_text_0');
                expect(legendEle.getAttribute('fill')).toBe('#666666');
                expect(legendEle.getAttribute('font-family')).toBe('Helvetica');
                legendEle = getElement(legendId + '_shape_0');
                expect(legendEle.getAttribute('fill')).toBe('#a16ee5');
                done();
            };
            pie.theme = 'Bootstrap';
            pie.refresh();
        });
    });
    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
