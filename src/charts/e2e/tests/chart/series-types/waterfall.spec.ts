/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';

describe('category and log axis', () => {
    let inversed: any = element(by.id('inversed'));
    it('checking default', () => {
         browser.load('/demos/chart/series-types/waterfall/waterfall.html');
         browser.compareScreen(element(By.id('container')), 'chart/waterfall');
    });
    it('checking trendlines', () => {
        browser.load('/demos/chart/trendlines/trendline2.html');
        browser.compareScreen(element(By.id('container1')), 'chart/trendLines1');
        browser.compareScreen(element(By.id('container2')), 'chart/trendLines2');
        browser.compareScreen(element(By.id('container3')), 'chart/trendLines3');
        browser.compareScreen(element(By.id('container4')), 'chart/trendLines4');
    });
    it('checking default trend', () => {
        browser.load('/demos/chart/trendlines/trendline.html');
        browser.compareScreen(element(By.id('container1')), 'chart/trendLines5');
        browser.compareScreen(element(By.id('container2')), 'chart/trendLines6');
   });
  
});