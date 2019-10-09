/**
 * spec
 */
import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

describe('Pareto Series', () => {
    it('pareto chart', () => {
        browser.load('/demos/chart/series/pareto-series/pareto.html');
        browser.compareScreen(element(By.id('container')), 'chart/pareto_chart');
    });
});