/**
 * spec
 */
import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';

describe('Chart annotation', () => {
    it('all chart annotations', () => {
        browser.load('/demos/chart/annotation/annotation.html');
        browser.compareScreen(element(By.id('container1')), 'chart/chart_annotation1');
        browser.compareScreen(element(By.id('container2')), 'chart/chart_annotation2'); 
        browser.compareScreen(element(By.id('container3')), 'chart/chart_annotation3');
        browser.compareScreen(element(By.id('container4')), 'chart/chart_annotation4');
    });
});