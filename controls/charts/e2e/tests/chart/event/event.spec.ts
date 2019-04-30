/**
 * spec
 */
import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

describe('Events', () => {
    it('all chart events', () => {
        browser.load('/demos/chart/event/event.html');
        browser.compareScreen(element(By.id('container')), 'chart/chart_events');
    });
});