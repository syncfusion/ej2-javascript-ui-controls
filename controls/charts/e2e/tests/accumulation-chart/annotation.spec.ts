/**
 * spec
 */
import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

describe('accumulation annotation', () => {
    it('all accumulation annotation', () => {
        browser.load('/demos/accumulation-chart/acc-annotation/acc-annotation.html');
        browser.compareScreen(element(By.id('container1')), 'chart/acc_annotation1'); 
        browser.compareScreen(element(By.id('container2')), 'chart/acc_annotation2');
        browser.compareScreen(element(By.id('container3')), 'chart/acc_annotation3');
        browser.compareScreen(element(By.id('container4')), 'chart/acc_annotation4');
    });
});