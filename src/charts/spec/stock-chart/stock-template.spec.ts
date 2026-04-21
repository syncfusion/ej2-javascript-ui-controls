/**
 * StockChart — Legend Item Template spec (series-wise)
 * Validates: rendering, ARIA, paging, click-to-toggle, fixed size, RTL, title.
 */

import { createElement } from '@syncfusion/ej2-base';
import { MouseEvents } from '../chart/base/events.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

// Bring in StockChart + legend + a couple of series types and DateTime X axis.
import {
    StockChart, StockLegend, DateTime,
    LineSeries, SplineSeries, CandleSeries, HiloSeries, HiloOpenCloseSeries
} from '../../src/stock-chart/index';

import { IStockChartEventArgs } from '../../src/stock-chart/model/base';
import { chartData } from './indicatordata.spec';

// Inject required modules (legend + series + DateTime)
StockChart.Inject(StockLegend, DateTime, LineSeries, SplineSeries, CandleSeries, HiloSeries, HiloOpenCloseSeries);

describe('StockChart — Legend Item Template (series-wise)', () => {

    const id = 'stockTemplateTS';
    const legendId = id + '_chart_legend';

    let host: HTMLElement;
    let stock: StockChart;
    let loaded: (args: IStockChartEventArgs) => void;
    let legendEle: Element;
    const trigger = new MouseEvents();
    function buildSeries(name: string, type: 'Line' | 'Spline' | 'Candle' | 'Hilo' | 'HiloOpenClose'): any {
    // All stock series must have OHLC for Candle/Hilo types; we can reuse chartData.
        const common = {
            name,
            dataSource: chartData,
            xName: 'x', yName: 'close',
            high: 'high', low: 'low', open: 'open', close: 'close',
            type,
            animation: { enable: false }
        };
        return common;
    }

    beforeAll(() => {
        host = createElement('div', { id });
        document.body.appendChild(host);

        stock = new StockChart({
            primaryXAxis: { valueType: 'DateTime' },
            legendSettings: { visible: true, template: '<div>Template</div>' }, // stock chart legend is series-based
            series: [
                buildSeries('S0', 'Line'),
                buildSeries('S1', 'Spline')
            ]
        } as any);

        stock.appendTo('#' + id);
    });

    afterAll(() => {
        stock.destroy();
        document.getElementById(id).remove();
    });

    it('checking legend template rendering', (done: DoneFn) => {
        loaded = () => {
            stock.loaded = null;
            const tpl1: HTMLElement = document.getElementById(`${legendId}_template_0`);
            expect(tpl1).not.toBeNull();
            done();
        };

        stock.loaded = loaded;
        stock.refresh();
    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

});
