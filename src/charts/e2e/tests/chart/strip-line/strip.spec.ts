/**
 * spec
 */
import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

describe('Stipline', () => {
    it('all stripline', () => {
        browser.load('/demos/chart/stripline/stripline.html');
        browser.compareScreen(element(By.id('container')), 'chart/chart_stripline');
    });
});