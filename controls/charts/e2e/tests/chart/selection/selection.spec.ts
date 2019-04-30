/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';

describe('Selection', () => {
    let seriesType: ElementFinder;
    let point1: ElementFinder;
    let point2: ElementFinder;
    let point3: ElementFinder;
    it('selection mode point', () => {
        browser.load('/demos/chart/selection/selection.html');
        seriesType = element(by.id('selectiontype'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[0].click();
            });
        point1 = element(by.id('container_Series_0_Point_1'));
        point1.click();
        browser.compareScreen(element(By.id('container')), 'chart/point_selection');
        point1.click();
    });
    it('selection mode Series', () => {
        browser.load('/demos/chart/selection/selection.html');
        seriesType = element(by.id('selectiontype'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[1].click();
            });
        point2 = element(by.id('container_Series_1_Point_2'));
        point2.click();
        browser.compareScreen(element(By.id('container')), 'chart/series_selection');
        point2.click();
    });
    it('selection mode cluster', () => {
        browser.load('/demos/chart/selection/selection.html');
        seriesType = element(by.id('selectiontype'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[2].click();
            });
        point1 = element(by.id('container_Series_0_Point_1'));
        point1.click();
        browser.compareScreen(element(By.id('container')), 'chart/cluster_selection');
        point1.click();
    });
    it('checking with multi select', () => {
        browser.load('/demos/chart/selection/selection.html');
        let isMulti: ElementFinder = element(by.id('multi'));
        isMulti.click();
        point1 = element(by.id('container_Series_2_Point_1'));
        point1.click();
        point2 = element(by.id('container_Series_0_Point_2'));
        point2.click();
        point3 = element(by.id('container_Series_1_Point_2'));
        point3.click();
        browser.compareScreen(element(By.id('container')), 'chart/multi_select');
        isMulti.click();
    });
    it('selection through on legend', () => {
        browser.load('/demos/chart/selection/selection.html');
        point1 = element(by.id('container_chart_legend_shape_0'));
        point1.click();
        browser.compareScreen(element(By.id('container')), 'chart/legend_through_select');
    });
    it('selection mode dragx', () => {
        browser.load('/demos/chart/range-selection/range.html');
        seriesType = element(by.id('range'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[0].click();
            });
        point1 = element(by.id('container_Series_0_Point_12'));
        browser.actions().dragAndDrop(point1, element(by.id('container_Series_0_Point_25'))).perform();
        browser.actions().click(point1).perform();
        browser.compareScreen(element(By.id('container')), 'chart/drag_x_selection');
    });
    it('selection mode dragY', () => {
        browser.load('/demos/chart/range-selection/range.html');
        seriesType = element(by.id('range'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[0].click();
            });
        point1 = element(by.id('container_Series_0_Point_0'));
        browser.actions().dragAndDrop(point1, element(by.id('container_Series_0_Point_40'))).perform();
        browser.actions().click(point1).perform();
        browser.compareScreen(element(By.id('container')), 'chart/drag_y_selection');
    });
    it('selection mode dragXY', () => {
        browser.load('/demos/chart/range-selection/range.html');
        seriesType = element(by.id('range'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[0].click();
            });
        point1 = element(by.id('container_Series_0_Point_26'));
        browser.actions().dragAndDrop(point1, element(by.id('container_Series_0_Point_40'))).perform();
        browser.actions().click(point1).perform();
        browser.compareScreen(element(By.id('container')), 'chart/drag_xy_selection');
    });
});