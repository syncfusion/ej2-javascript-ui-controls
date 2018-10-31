/**
 * AccumulationChart legend Series Spec file
 */
import { createElement } from '@syncfusion/ej2-base';
import { EmitType } from '@syncfusion/ej2-base';
import { PieSeries } from '../../../src/accumulation-chart/renderer/pie-series';
import { AccumulationChart } from '../../../src/accumulation-chart/accumulation';
import { AccumulationLegend } from '../../../src/accumulation-chart/renderer/legend';
import { removeElement, getElement } from '../../../src/common/utils/helper';
import { AccumulationDataLabel } from '../../../src/accumulation-chart/renderer/dataLabel';
import { piedata } from '../../chart/base/data.spec';
import { MouseEvents } from '../../chart/base/events.spec';
import { IAccLoadedEventArgs } from '../../../src/accumulation-chart/model/pie-interface';
import '../../../node_modules/es6-promise/dist/es6-promise';
AccumulationChart.Inject(PieSeries, AccumulationLegend, AccumulationDataLabel);
let pointData: Object[] = [];
export function generateData(count: number): Object[] {
    let currentPoint: Object;
    let value: number;
    for (let i: number = 0; i < count; i++) {
        value = Math.round(Math.random() * 100);
        currentPoint = { x: i, y: value + 1, text: 'Point_' + i };
        pointData.push(currentPoint);
    }
    return pointData;
}
describe('Legend checking for the pie series', () => {
    let ele: HTMLElement;
    let loaded: EmitType<IAccLoadedEventArgs>;
    let id: string = 'ej2-container';
    let legendEle: Element;
    let legendId: string = id + '_chart_legend';
    let accumulation: AccumulationChart;
    let trigger: MouseEvents = new MouseEvents();
    beforeAll((): void => {
        ele = createElement('div', { id: id });
        document.body.appendChild(ele);
        accumulation = new AccumulationChart({
            border: { width: 1, color: 'blue' },
            series: [
                {
                    type: 'Pie',
                    dataLabel: { visible: false, name: 'text' },
                    dataSource: piedata, animation: { enable: false }, xName: 'x', yName: 'y'
                }
            ], width: '600', height: '400', legendSettings: { visible: false }
        });
        accumulation.appendTo('#' + id);
    });

    afterAll((): void => {
        accumulation.accumulationLegendModule.destroy(accumulation);
        accumulation.destroy();
        accumulation.loaded = null;
        removeElement(id);
    });
    it('Pie Legend visibility false checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_g');
            expect(legendEle).toBe(null);
            done();
        };
        accumulation.refresh();
    });
    it('Pie Legend visibility visible checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_translate_g');
            expect(legendEle.childNodes.length).toBe(10);
            expect(legendEle.childNodes.length).toBe(accumulation.visibleSeries[0].points.length);
            done();
        };
        accumulation.legendSettings.visible = true;
        accumulation.refresh();
    });
    it('Pie Legend auto position chekcing width is greater than height', () => {
        legendEle = getElement(legendId + '_element');
        expect(legendEle.getAttribute('x') == '487' || legendEle.getAttribute('x') == '487.75').toBe(true);
        expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
        expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);
        expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);
    });
    it('Pie Legend auto position chekcing while width is less than height', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '42.5' || legendEle.getAttribute('x') == '43').toBe(true);

            expect(legendEle.getAttribute('y') === '496' || legendEle.getAttribute('y') === '496.75').toBe(true);

            expect(legendEle.getAttribute('height') === '33' || legendEle.getAttribute('height') === '32').toBe(true);

            expect(legendEle.getAttribute('width') == '315' || legendEle.getAttribute('width') == '314').toBe(true);
            done();
        };
        accumulation.height = '600';
        accumulation.width = '400';
        accumulation.refresh();
    });
    it('Pie Legend left position chekcing', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '68' || legendEle.getAttribute('x') == '68.25').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);
            expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
            done();
        };
        accumulation.legendSettings.position = 'Left';
        accumulation.height = '400';
        accumulation.width = '600';
        accumulation.refresh();
    });
    it('Pie Legend Top position chekcing', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '142.5' || legendEle.getAttribute('x') == '143').toBe(true);

            expect(legendEle.getAttribute('y') === '27.80000000000001' || legendEle.getAttribute('y') === '27.849999999999994').toBe(true);

            expect(legendEle.getAttribute('height') === '33' || legendEle.getAttribute('height') === '32').toBe(true);

            expect(legendEle.getAttribute('width') == '315' || legendEle.getAttribute('width') == '314').toBe(true);
            done();
        };
        accumulation.legendSettings.position = 'Top';
        accumulation.refresh();
    });
    it('Pie Legend Bottom position chekcing', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '142.5' || legendEle.getAttribute('x') == '143').toBe(true);

            expect(legendEle.getAttribute('y') === '339.20000000000005' || legendEle.getAttribute('y') === '340.15').toBe(true);

            expect(legendEle.getAttribute('height') === '33' || legendEle.getAttribute('height') === '32').toBe(true);

            expect(legendEle.getAttribute('width') == '315' || legendEle.getAttribute('width') == '314').toBe(true);
            done();
        };
        accumulation.legendSettings.position = 'Bottom';
        accumulation.refresh();
    });
    it('Pie Legend Right position chekcing', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '487' || legendEle.getAttribute('x') == '487.75').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);

            expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
            done();
        };
        accumulation.legendSettings.position = 'Right';
        accumulation.refresh();
    });
    it('Pie Legend Right position chekcing with fixed legend size', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle).not.toBe(null);
            done();
        };
        accumulation.legendSettings.height = '100';
        accumulation.legendSettings.width = '90';
        accumulation.refresh();
    });
    it('Pie Legend Left position chekcing with fixed legend size', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x')).toBe('56.75');
            expect(legendEle.getAttribute('y')).toBe('150');
            expect(legendEle.getAttribute('height')).toBe('100');
            expect(legendEle.getAttribute('width')).toBe('90');
            done();
        };
        accumulation.legendSettings.position = 'Left';
        accumulation.refresh();
    });
    it('Pie Legend Top position chekcing with fixed legend size', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x')).toBe('255');
            let y: number = parseInt(legendEle.getAttribute('y'), 10);
            expect(y).toBe(24);
            expect(legendEle.getAttribute('height')).toBe('100');
            expect(legendEle.getAttribute('width')).toBe('90');
            done();
        };
        accumulation.legendSettings.position = 'Top';
        accumulation.refresh();
    });
    it('Pie Legend Bottom position chekcing with fixed legend size', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle).not.toBe(null);
            done();
        };
        accumulation.legendSettings.position = 'Bottom';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position right, exploding length greater than chart width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '517.4000000000001' || legendEle.getAttribute('x') == '518.1500000000001').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);

            expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
            done();
        };
        accumulation.visibleSeries[0].explode = true;
        accumulation.visibleSeries[0].explodeOffset = '40%';
        accumulation.legendSettings.position = 'Right';
        accumulation.legendSettings.height = null;
        accumulation.legendSettings.width = null;
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position right, exploding length less than chart width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '667.4' || legendEle.getAttribute('x') == '668.15').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);

            expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
            done();
        };
        accumulation.width = '800';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position left, exploding length less than chart width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '87.6' || legendEle.getAttribute('x') == '87.85').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);

            expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
            done();
        };
        accumulation.legendSettings.position = 'Left';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position left, exploding length greater than chart width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '37.6' || legendEle.getAttribute('x') == '37.85').toBe(true);

            expect(legendEle.getAttribute('y') === '71' || legendEle.getAttribute('y') === '76').toBe(true);

            expect(legendEle.getAttribute('height') === '258' || legendEle.getAttribute('height') === '248').toBe(true);

            expect(legendEle.getAttribute('width') == '45' || legendEle.getAttribute('width') == '44').toBe(true);
            done();
        };
        accumulation.width = '600';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position top, exploding length greater than chart height', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle.getAttribute('x') == '42.5' || legendEle.getAttribute('x') == '43').toBe(true);

            expect(legendEle.getAttribute('y') === '11' || legendEle.getAttribute('y') === '11').toBe(true);

            expect(legendEle.getAttribute('height') === '33' || legendEle.getAttribute('height') === '32').toBe(true);

            expect(legendEle.getAttribute('width') == '315' || legendEle.getAttribute('width') == '314').toBe(true);
            done();
        };
        accumulation.legendSettings.position = 'Top';
        accumulation.width = '400';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position top, exploding length less than chart height', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle).not.toBe(null);
            done();
        };
        accumulation.height = '600';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position bottom, exploding length less than chart height', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle).not.toBe(null);
            done();
        };
        accumulation.legendSettings.position = 'Bottom';
        accumulation.refresh();
    });
    it('Smart Legend placing datalabel Inside, legend position bottom, exploding length greater than chart height', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_element');
            expect(legendEle).not.toBe(null);
            done();
        };
        accumulation.height = '400';
        accumulation.refresh();
    });
    it('Pie Legend paging feature checking for position right with default height, width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_translate_g');
            legendEle = getElement(legendId + '_pagedown');
            trigger.clickEvent(legendEle);
            legendEle = getElement(legendId + '_pagenumber');
            expect(legendEle.textContent).toBe('2/4');
            legendEle = getElement(legendId + '_element_clipPath_rect');

            expect(legendEle.getAttribute('x') == '308' || legendEle.getAttribute('x') == '310').toBe(true);
            expect(legendEle.getAttribute('y')).toBe('18');
            expect(legendEle.getAttribute('width') == '74' || legendEle.getAttribute('width') == '72').toBe(true);
            expect(legendEle.getAttribute('height') === '360' || legendEle.getAttribute('height') === '350').toBe(true);
            done();
        };
        accumulation.legendSettings.height = null;
        accumulation.legendSettings.width = null;
        accumulation.legendSettings.position = 'Right';
        accumulation.series[0].dataSource = generateData(100);
        accumulation.refresh();
    });
    it('Pie Legend paging feature checking for position bottom with default height, width', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            legendEle = getElement(legendId + '_translate_g');
            expect(legendEle.childNodes.length).toBe(100);
            expect(legendEle.childNodes.length).toBe(accumulation.visibleSeries[0].points.length);
            legendEle = getElement(legendId + '_pagedown');
            trigger.clickEvent(legendEle);
            legendEle = getElement(legendId + '_pagenumber');
            expect(legendEle.textContent).toBe('3/4');
            legendEle = getElement(legendId + '_pageup');
            trigger.clickEvent(legendEle);
            legendEle = getElement(legendId + '_pagenumber');
            expect(legendEle.textContent).toBe('2/4');
            done();
        };
        accumulation.legendSettings.position = 'Bottom';
        accumulation.dataBind();
    });
    it('Pie Legend point click visible and hidden checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            expect(accumulation.visibleSeries[0].points[4].visible).toBe(true);
            legendEle = getElement(legendId + '_shape_4');
            expect(legendEle.getAttribute('fill')).toBe('#f8b883');
            legendEle = getElement(legendId + '_text_4');
            expect(legendEle.getAttribute('fill')).not.toBe('#D3D3D3');
            trigger.clickEvent(legendEle);
            legendEle = getElement(legendId + '_text_4');
            expect(legendEle.getAttribute('fill')).toBe('#D3D3D3');
            legendEle = getElement(legendId + '_shape_4');
            expect(legendEle.getAttribute('fill')).toBe('#D3D3D3');
            expect(accumulation.visibleSeries[0].points[4].visible).toBe(false);
            trigger.clickEvent(legendEle);
            expect(accumulation.visibleSeries[0].points[4].visible).toBe(true);
            legendEle = getElement(legendId + '_shape_4');
            expect(legendEle.getAttribute('fill')).toBe('#f8b883');
            legendEle = getElement(legendId + '_text_4');
            expect(legendEle.getAttribute('fill')).not.toBe('#D3D3D3');
            done();
        };
        accumulation.series[0].dataSource = piedata;
        accumulation.refresh();
    });
    it('Doughnut Single point Legend', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            legendEle = getElement(legendId + '_shape_0');
            expect(legendEle.getAttribute('fill')).toBe('#00bdae');
            expect(accumulation.visibleSeries[0].points.length).toBe(1);
            expect(accumulation.visibleSeries[0].points[0].visible).toBe(true);
            legendEle = getElement(legendId + '_g_0');
            expect(legendEle.childNodes.length).toBe(3);
            expect((<HTMLElement>legendEle.childNodes[0]).getAttribute('fill')).toBe('#00bdae');
            expect((<HTMLElement>legendEle.childNodes[1]).getAttribute('fill')).toBe('#FFFFFF');
            expect((<HTMLElement>legendEle.childNodes[2]).textContent.indexOf('...') > -1 ||
                (<HTMLElement>legendEle.childNodes[2]).textContent === 'Single Point').toBe(true);
            done();
        };
        accumulation.series[0].dataSource = [{ x: 'Single Point', text: 'Single point text', y: 10 }];
        accumulation.series[0].innerRadius = '40%';
        accumulation.legendSettings.position = 'Right';
        accumulation.refresh();
    });
    it('Pie Single point Legend', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            legendEle = getElement(legendId + '_shape_0');
            expect(legendEle.getAttribute('fill')).toBe('#00bdae');
            expect(accumulation.visibleSeries[0].points.length).toBe(1);
            expect(accumulation.visibleSeries[0].points[0].visible).toBe(true);
            legendEle = getElement(legendId + '_g_0');
            expect(legendEle.childNodes.length).toBe(2);
            expect((<HTMLElement>legendEle.childNodes[0]).getAttribute('fill')).toBe('#00bdae');
            expect((<HTMLElement>legendEle.childNodes[1]).textContent).toBe('Single Point');
            done();
        };
        accumulation.series[0].innerRadius = '0%';
        accumulation.height = '400';
        accumulation.width = '600';
        accumulation.refresh();
    });
    it('Legend long text trimming feature checking', (done: Function) => {
        accumulation.loaded = (args: IAccLoadedEventArgs) => {
            accumulation.loaded = null;
            legendEle = getElement(legendId + '_shape_0');
            expect(legendEle.getAttribute('fill')).toBe('#00bdae');
            expect(accumulation.visibleSeries[0].points.length).toBe(1);
            expect(accumulation.visibleSeries[0].points[0].visible).toBe(true);
            legendEle = getElement(legendId + '_g_0');
            expect(legendEle.childNodes.length).toBe(2);
            expect((<HTMLElement>legendEle.childNodes[0]).getAttribute('fill')).toBe('#00bdae');
            expect((<HTMLElement>legendEle.childNodes[1]).textContent.indexOf('...') > -1).toBe(true);
            legendEle = getElement(legendId + '_text_0');
            trigger.mousemoveEvent(legendEle, 0, 0, 460, 210);
            legendEle = getElement('ej2-container_EJ2_Legend_Tooltip');
            expect(legendEle.textContent).toBe('Single Point legend long text trimming feature checking');
            legendEle = getElement(id);
            trigger.mousemoveEvent(legendEle, 0, 0, 100, 20);
            legendEle = getElement('ej2-container_EJ2_Legend_Tooltip');
            // expect(legendEle).toBe(null);
            removeElement('ej2-container_EJ2_Legend_Tooltip');
            done();
        };
        accumulation.series[0].dataSource = [
            { x: 'Single Point legend long text trimming feature checking', text: 'Single point text', y: 10 }];
        accumulation.refresh();
    });
});