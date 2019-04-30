/**
 * spec
 */
import { browser, element, By, ElementFinder, by } from '@syncfusion/ej2-base/e2e/index';

describe('Box and Whisker', () => {
   it('all modes', () => {
        browser.load('/demos/chart/series-types/boxandwhisker/boxandwhisker.html');
        browser.compareScreen(element(By.id('container')), 'chart/boxandwhisker_all_Modes');
    });
    it('inversed', () => {
        let inversed: ElementFinder;
        inversed = element(by.id('axisinversed'));
        inversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/boxandwhisker_inversed');
        inversed.click();
    });
    it('vertical', () => {
        let vertical: ElementFinder;
        vertical = element(by.id('verticalchart'));
        vertical.click();
        browser.compareScreen(element(By.id('container')), 'chart/boxandwhisker_vertical');
        vertical.click();
    });
});