/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';

describe('Tooltip Rendering', () => {
    it('Line chart with tooltip', () => {
        browser.load('/demos/chart/series/lineSeries/line.html');
        browser.actions().mouseMove(element(by.id('container_Series_0_Point_4_Symbol'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/line_tooltip');
        });
    });
    it('Area series with tooltip', () => {
        browser.load('/demos/chart/series/areaSeries/area.html');
        browser.actions().mouseMove(element(by.id('container_Series_0_Point_3_Symbol'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/area_tooltip');
        });
    });
    it(' Range Area series with tooltip', () => {
        browser.load('/demos/chart/series/rangeAreaSeries/rangeAreaSeries.html');
        browser.actions().mouseMove(element(by.id('container_Series_0_Point_5_Symbol'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/rangearea_tooltip');
        });
    });
    it('Range column series with tooltip', () => {
        browser.load('/demos/chart/series/rangeColumnSeries/rangeColumn.html');
        browser.actions().mouseMove(element(by.id('container_Series_1_Point_2'))).perform().then(function () {
            browser.sleep(3000);
            browser.compareScreen(element(By.id('container')), 'chart/range_tooltip');
        });
    });
    it(' financial series with tooltip', () => {
        browser.load('/demos/chart/series/hiloOpenCloseSeries/hiloOpenClose.html');
        browser.actions().mouseMove(element(by.id('container_Series_0_Point_3'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/financial_tooltip');
        });
    });
});
describe('Tooltip with different behaviours', () => {
    it('Chart without grouped tooltip', () => {
        browser.load('/demos/chart/tooltip/tooltip.html');
        browser.actions().mouseMove(element(by.id('container_Series_1_Point_2_Symbol'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/chart_with_tooltip');
        });
    });
    it('checking grouped tooltip', () => {
        let isGrouped: ElementFinder = element(by.id('group'));
        isGrouped.click();
        browser.actions().mouseMove(element(by.id('container_Series_1_Point_2_Symbol'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/grouped_tooltip');
        });
        isGrouped.click();
    });
    it('checking with or without seriesname', () => {
        let isName: ElementFinder = element(by.id('name'));
        isName.click();
        browser.actions().mouseMove(element(by.id('container_Series_0_Point_3_Symbol'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/series_name_tooltip');
        });
        isName.click();
    });
    it('checking with tooltip header', () => {
        let isHeader: ElementFinder = element(by.id('header'));
        isHeader.click();
        browser.actions().mouseMove(element(by.id('container_Series_1_Point_2_Symbol'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/header_tooltip');
        });
        isHeader.click();
    });
    it('checking with tooltip template', () => {
        let isTemp: ElementFinder = element(by.id('template'));
        isTemp.click();
        browser.actions().mouseMove(element(by.id('container_Series_1_Point_2_Symbol'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/template_tooltip');
        });
        isTemp.click();
    });
    it('checking with tooltip with errorbar', () => {
        let iserror: ElementFinder = element(by.id('iserror'));
        iserror.click();
        browser.actions().mouseMove(element(by.id('container_Series_1_Point_2_Symbol'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/error_tooltip');
        });
        iserror.click();
    });
});
describe('Tooltip with bar series', () => {
it('Checking positive tooltip with bar series', () => {
    browser.load('/demos/chart/series/barSeries/bar.html');
    browser.actions().mouseMove(element(by.id('container_Series_0_Point_2'))).perform().then(function () {
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'chart/bar_chart_positive_tooltip');
    });
});
});
describe('Tooltip with negative bar series', () => {
    it('Checking negative tooltip with bar series', () => {
    browser.load('/demos/chart/series/barSeries/bar.html');
    browser.actions().mouseMove(element(by.id('container_Series_0_Point_3'))).perform().then(function () {
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'chart/bar_chart_negative_tooltip');
        });
    });
    });