/**
 * spec
 */
import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

describe('Multi level labels', () => {
    it('multi level label', () => {
        browser.load('/demos/chart/multi-label/multi-label.html');
        browser.compareScreen(element(By.id('container')), 'chart/chart_multilevel_label');
    });
});