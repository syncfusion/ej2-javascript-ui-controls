/**
 * Test cases for technical indicators with datasource
 */

import { createElement, remove } from '@syncfusion/ej2-base';
import { Chart } from '../../../src/chart/chart';
import { Legend } from '../../../src/chart/legend/legend';
import { LineSeries } from '../../../src/chart/series/line-series';
import { CandleSeries } from '../../../src/chart/series/candle-series';
import { SmaIndicator } from '../../../src/chart/technical-indicators/sma-indicator';
import { Tooltip } from '../../../src/chart/user-interaction/tooltip';
import { Crosshair } from '../../../src/chart/user-interaction/crosshair';
import { MouseEvents } from '../base/events.spec';
import { EmitType } from '@syncfusion/ej2-base';
import { ILoadedEventArgs, IAnimationCompleteEventArgs } from '../../../src/common/model/interface';
import { Category } from '../../../src/chart/axis/category-axis';
Chart.Inject(Legend, SmaIndicator, LineSeries, CandleSeries, Category, Tooltip, Crosshair);

let prevent: Function = (): void => {
    //Prevent Function
};

export interface Wheel {
    preventDefault: Function;
    wheelDelta: number;
    detail: number;
    clientX: number;
    clientY: number;
}
let animationComplete: EmitType<IAnimationCompleteEventArgs>;
let singleData: object[] = [{ x: 'Jan', low: 40, high: 100, open: 50, close: 70 }];

let financialData: object[] = [
    { x: 'Jan', low: 0.7, high: 6.1, open: 5, close: 2 },
    { x: 'Feb', low: 1.3, high: 6.3, open: 4.8, close: 2.5 },
    { x: 'Mar', low: 1.9, high: 8.5, open: 7, close: 4 },
    { x: 'Apr', low: 3.1, high: 10.8, open: 8, close: 4.2 },
    { x: 'May', low: 5.7, high: 14.40, open: 12.20, close: 7 },
    { x: 'Jun', low: 8.4, high: 16.90, open: 15, close: 10 },
    { x: 'Jul', low: 10.6, high: 19.20, open: 15.6, close: 13 },
    { x: 'Aug', low: 10.5, high: 18.9, open: 14, close: 12 },
    { x: 'Sep', low: 8.5, high: 16.1, open: 13, close: 9 },
    { x: 'Oct', low: 6.0, high: 12.5, open: 10, close: 7.8 },
    { x: 'Nov', low: 1.5, high: 6.9, open: 5.6, close: 3.8 },
    { x: 'Dec', low: 5.1, high: 12.1, open: 8, close: 10.34 }
];

describe('Chart', () => {
    let element: HTMLElement;

    describe('Independent Technical Indicators', () => {
        let chartObj: Chart;
        let loaded: EmitType<ILoadedEventArgs>;
        let trigger: MouseEvents = new MouseEvents();
        element = createElement('div', { id: 'container' });
        beforeAll(() => {
            document.body.appendChild(element);
            chartObj = new Chart(
                {
                    primaryXAxis: { title: 'PrimaryXAxis', valueType: 'Category' },
                    primaryYAxis: { title: 'PrimaryYAxis' },
                    series: [{
                        name: 'gold',
                        type: 'Candle',
                        animation: { enable: false },
                        dataSource: financialData,
                        xName: 'x', high: 'high', low: 'low', open: 'open', close: 'close'
                    }],
                    indicators: [{
                        type: 'Sma',
                        period: 3,
                        animation: { enable: false }
                    }],
                    width: '800',
                    title: 'Chart TS Title'

                });
            chartObj.appendTo('#container');

        });

        afterAll((): void => {
            chartObj.destroy();
            document.getElementById('container').remove();
        });

        it('Technical Indicators without data source', (done: Function) => {
            loaded = (args: Object): void => {
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(2);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();

        });

        it('Technical Indicators with datasource and without fields', (done: Function) => {
            loaded = (args: Object): void => {
                let indicator: HTMLElement = document.getElementById('containerIndicatorGroup0');
                expect(indicator != null).toBe(true);
                expect(indicator.childNodes.length).toBe(2);
                done();
            };
            chartObj.loaded = loaded;
            chartObj.indicators[0].dataSource = financialData;
            chartObj.refresh();

        });

        it('Technical Indicators with valid data source', (done: Function) => {
            loaded = (args: Object): void => {
                let signalLine: HTMLElement = document.getElementById('container_Indicator_0_SignalLine');
                expect(signalLine.getAttribute('d')).not.toBeNull();
                done();
            };
            chartObj.loaded = loaded;
            chartObj.refresh();
            chartObj.indicators[0].dataSource = financialData;
            chartObj.indicators[0].open = 'open';
            chartObj.indicators[0].close = 'close';
            chartObj.indicators[0].high = 'high';
            chartObj.indicators[0].low = 'low';
            chartObj.indicators[0].xName = 'x';

        });
    });
});