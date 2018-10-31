/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';

describe('Zoom', () => {
    it('Checking with zooming', () => {
        browser.load('/demos/chart/zoom/zoom.html');
        let point1: ElementFinder = element(by.id('container_Series_0_Point_1_Symbol'));
        browser.actions().dragAndDrop(point1, element(by.id('container_Series_0_Point_8_Symbol'))).perform();
        browser.actions().click(point1).perform();
        browser.compareScreen(element(By.id('container')), 'chart/chart_zoom');
    });
    it('Checking with zoomin', () => {
        browser.load('/demos/chart/zoom/zoom.html');
        let point1: ElementFinder = element(by.id('container_Series_0_Point_1_Symbol'));
        browser.actions().dragAndDrop(point1, element(by.id('container_Series_0_Point_8_Symbol'))).perform();
        browser.actions().click(point1).perform();
        let zoomIn: ElementFinder = element(by.id('container_Zooming_ZoomIn_2'));
        zoomIn.click();
        browser.compareScreen(element(By.id('container')), 'chart/chart_zoomIn');
        zoomIn.click();
    });
    it('Checking with zoom out', () => {
        browser.load('/demos/chart/zoom/zoom.html');
        let point1: ElementFinder = element(by.id('container_Series_0_Point_1_Symbol'));
        browser.actions().dragAndDrop(point1, element(by.id('container_Series_0_Point_8_Symbol'))).perform();
        browser.actions().click(point1).perform();
        let zoomIn: ElementFinder = element(by.id('container_Zooming_ZoomOut_2'));
        zoomIn.click();
        browser.compareScreen(element(By.id('container')), 'chart/chart_zoomOut');
        zoomIn.click();
    });
    it('Checking with zoom pan', () => {
        browser.load('/demos/chart/zoom/zoom.html');
        let point1: ElementFinder = element(by.id('container_Series_0_Point_1_Symbol'));
        browser.actions().dragAndDrop(point1, element(by.id('container_Series_0_Point_8_Symbol'))).perform();
        browser.actions().click(point1).perform();
        let zoomIn: ElementFinder = element(by.id('container_Zooming_Pan_1'));
        zoomIn.click();
        let series: ElementFinder = element(by.id('container_Series_0'));
        series.click();
        browser.actions().mouseMove(series).perform();
        browser.compareScreen(element(By.id('container')), 'chart/chart_zoompan');
        zoomIn.click();
    });
    it('Checking with zoom reset', () => {
        browser.load('/demos/chart/zoom/zoom.html');
        let point1: ElementFinder = element(by.id('container_Series_0_Point_1_Symbol'));
        browser.actions().dragAndDrop(point1, element(by.id('container_Series_0_Point_8_Symbol'))).perform();
        browser.actions().click(point1).perform();
        let zoomIn: ElementFinder = element(by.id('container_Zooming_Reset_2'));
        zoomIn.click();
        browser.compareScreen(element(By.id('container')), 'chart/chart_zoomreset');
        zoomIn.click();
    });
    it('Checking zooming with scrollbar', () => {
        browser.load('/demos/chart/zoom/zoom.html');
        let scroll: ElementFinder = element(by.id('scroll'));
        scroll.click();
        let point1: ElementFinder = element(by.id('container_Series_0_Point_1_Symbol'));
        browser.actions().dragAndDrop(point1, element(by.id('container_Series_0_Point_8_Symbol'))).perform();
        browser.actions().click(point1).perform();
        browser.compareScreen(element(By.id('container')), 'chart/chart_zoomScroll');
        scroll.click();
    });
});