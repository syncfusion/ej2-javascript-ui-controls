/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';

describe('category and log axis', () => {
    it('checking pie chart', () => {
         browser.load('/demos/accumulation-chart/pie-chart/pie.html');
         browser.compareScreen(element(By.id('chart')), 'chart/pie_chart');
    });
    it('checking with explode', () => {
        let pieExplodePoint: ElementFinder = element(by.id('container3_Series_0_Point_5'));
        let pyramidExplodePoint: ElementFinder = element(by.id('container5_Series_0_Point_4'));
        pieExplodePoint.click();
        pyramidExplodePoint.click();
        browser.compareScreen(element(By.id('chart')), 'chart/pie_chart_explode');
        pieExplodePoint.click();
        pyramidExplodePoint.click();
        browser.compareScreen(element(By.id('chart')), 'chart/pie_chart_explode_removed');
    });
    it('checking with legend click ', () => {
        let pieLegend: ElementFinder = element(by.id('container4_chart_legend_text_5'));
        let pyramidLegend: ElementFinder = element(by.id('container5_chart_legend_shape_1'));
        pieLegend.click();
        pyramidLegend.click();
        browser.compareScreen(element(By.id('chart')), 'chart/pie_chart_legend_click_toggle');
        pieLegend.click();
        pyramidLegend.click();
    });
    it('checking pie chart and pyramid ', () => {
         browser.load('/demos/accumulation-chart/pie-chart/pie-legend.html');
         browser.compareScreen(element(By.id('chart')), 'chart/pie_chart_legend');
    });
    it('checking with legend page down click', () => {
        let pageup: ElementFinder = element(by.id('container3_chart_legend_pageup'));
        pageup.click();
        browser.compareScreen(element(By.id('chart')), 'chart/pie_chart_legend_pageUp');
    });
    it('checking with legend page up click', () => {
        let pageup: ElementFinder = element(by.id('container3_chart_legend_pagedown'));
        pageup.click();
        browser.compareScreen(element(By.id('chart')), 'chart/pie_chart_legend_PageDown');
    });
});