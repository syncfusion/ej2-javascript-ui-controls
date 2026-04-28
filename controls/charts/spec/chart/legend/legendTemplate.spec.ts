/**
 * Tests for template of legend: paging, legend click, legend size (height/width), and RTL.
 */

import { createElement } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Legend } from '../../../src/chart/legend/legend';
import { LineSeries } from '../../../src/chart/series/line-series';
import { ColumnSeries } from '../../../src/chart/series/column-series';
import { Category } from '../../../src/chart/axis/category-axis';
import { MouseEvents } from '../base/events.spec';
import { ILoadedEventArgs } from '../../../src';

declare const describe: any;
declare const it: any;
declare const expect: any;
declare const beforeAll: any;
declare const afterAll: any;
declare const DoneFn: any;

/**
 * Note: Tests assume the project's MouseEvents helper and Jasmine-like test runner.
 * Adjust timeouts if your environment is slower/faster.
 */

describe('Legend Item Template — full-page tests (TypeScript)', () => {
    Chart.Inject(Legend, LineSeries, ColumnSeries, Category);

    const id: string = 'templateChartTS_full';
    const legendId: string = `${id}_chart_legend`;
    const ele: HTMLElement = createElement('div', { id });
    document.body.appendChild(ele);

    function buildSeries(name: string): any {
        return {
            name,
            dataSource: [
                { x: 'A', y: 10 },
                { x: 'B', y: 20 },
                { x: 'C', y: 15 }
            ],
            xName: 'x', yName: 'y',
            type: 'Line',
            animation: { enable: false }
        };
    }

    let chartObj: Chart;
    let loaded: (args: ILoadedEventArgs) => void;
    const trigger: MouseEvents = new MouseEvents();

    beforeAll(() => {
        chartObj = new Chart({
            primaryXAxis: { valueType: 'Category' },
            legendSettings: { visible: true, template: `<div id="${legendId}_template_0" class="legend-tmpl" role="button" tabindex="0">Tmpl S0</div>` },
            series: [buildSeries('S0'), buildSeries('S1')]
        } as any);
        chartObj.appendTo(ele);
    });

    afterAll(() => {
        chartObj.destroy();
        const el : HTMLElement = document.getElementById(id);
        if (el) { el.remove(); }
    });

    it('renders custom HTML when template (string) is set and template elements have ARIA/tabindex', (done: DoneFn) => {
        loaded = () => {
            chartObj.loaded = null;
            const tpl0: HTMLElement = document.getElementById(`${legendId}_template_0`);
            const tpl1: HTMLElement = document.getElementById(`${legendId}_template_1`);
            expect(tpl0).not.toBeNull();
            expect(tpl1).not.toBeNull();
            expect(tpl0!.getAttribute('role')).toBe('button');
            expect(tpl0!.getAttribute('tabindex')).toBe('0');
            expect(tpl0!.hasAttribute('aria-pressed')).toBe(true);
            done();
        };
        chartObj.loaded = loaded;
        chartObj.refresh();
    });

    it('legend height & width are honored with templates (legend element attributes)', (done: DoneFn) => {
        loaded = () => {
            chartObj.loaded = null;
            const element: HTMLElement = document.getElementById(`${legendId}_element`)!;
            // Expect width/height reflect configured values (numbers may depend on internal calculations)
            expect(parseInt(element.getAttribute('width')!, 10)).toBe(300);
            expect(parseInt(element.getAttribute('height')!, 10)).toBe(100);
            done();
        };
        chartObj.legendSettings = { width: '300', height: '100', position: 'Right' } as any;
        chartObj.loaded = loaded;
        chartObj.refresh();
    });

    it('enableRtl mirrors legend paging/navigation transform and templates remain interactive', (done: DoneFn) => {
        loaded = () => {
            chartObj.loaded = null;
            // clicking template element toggles visibility even in RTL
            const tpl0: HTMLElement = document.getElementById(`${legendId}_template_0`)!;
            expect(tpl0).not.toBeNull();
            trigger.clickEvent(tpl0 as HTMLElement);
            setTimeout(() => {
                expect(chartObj.series[0].visible).toBe(false);
                done();
            }, 150);
        };

        (chartObj as any).enableRtl = true;
        chartObj.legendSettings = { position: 'Bottom', width: '140', height: '80' } as any;
        chartObj.loaded = loaded;
        chartObj.refresh();
    });

});
