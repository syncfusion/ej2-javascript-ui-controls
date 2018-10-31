/**
 * spec
 */
import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

describe('Marker', () => {
    it('all Marker shapes', () => {
        browser.load('/demos/chart/marker-types/marker.html');
        browser.compareScreen(element(By.id('container')), 'chart/marker shapes');
    });
});