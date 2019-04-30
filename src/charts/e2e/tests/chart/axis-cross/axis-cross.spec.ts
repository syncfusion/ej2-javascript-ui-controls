/**
 * spec
 */
import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

describe('Axis Crossing', () => {
    it('checking cross with different axis', () => {
        browser.load('/demos/chart/axis-cross/axis-cross.html');
        browser.compareScreen(element(By.id('container1')), 'chart/chart_x_axis_cross');
        browser.compareScreen(element(By.id('container2')), 'chart/chart_y_axis_cross');
    });
});