/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';

describe('category and log axis', () => {
    let inversed: any = element(by.id('inversed'));
    it('checking default', () => {
         browser.load('/demos/chart/series-types/waterfall/waterfall.html');
         browser.compareScreen(element(By.id('container')), 'waterfall');
    });
    it('checking trendlines', () => {
         browser.load('/demos/chart/trendlines/trendline.html');
         browser.compareScreen(element(By.id('chart-container')), 'trendLines');
    })
});