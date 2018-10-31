/**
 * spec
 */
import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

describe('Legend', () => {
    it('all legend shapes shapes', () => {
        browser.load('/demos/chart/legend-e2e/legend.html');
        browser.compareScreen(element(By.id('container')), 'chart/legend shapes');
    });
});