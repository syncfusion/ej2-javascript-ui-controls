/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';

describe('crosshair Rendering', () => {
    it('checking with crosshair', () => {
        browser.load('/demos/chart/series/splineSeries/spline.html');
        browser.actions().mouseMove(element(by.id('container_Series_0'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/chart_crosshair');
        });
    });
    it('checking with crosshair tooltip', () => {
        let istool: ElementFinder = element(by.id('tool'));
        istool.click();
        browser.actions().mouseMove(element(by.id('container_Series_0'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/crosshair_with_tooltip');
        });
    });
    it('checking with crosshair in inside label position', () => {
        let isInside: ElementFinder = element(by.id('pos'));
        isInside.click();
        browser.actions().mouseMove(element(by.id('container_Series_0'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/crosshair_with_inside');
        });
        isInside.click();
    });
    it('checking crosshair different customization', () => {
        let isCustom: ElementFinder = element(by.id('custom'));
        isCustom.click();
        browser.actions().mouseMove(element(by.id('container_Series_0'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/crosshair_with_custom');
        });
        isCustom.click();
    });
    it('checking crosshair opposed position', () => {
        let isOppos: ElementFinder = element(by.id('oppo'));
        isOppos.click();
        browser.actions().mouseMove(element(by.id('container_Series_0'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/crosshair_with_opposed');
        });
        isOppos.click();
    });
});
describe('Trackball', () => {
    it('checking with shared tooltip', () => {
        browser.load('/demos/chart/series/trackball/trackball.html');
        browser.actions().mouseMove(element(by.id('container_Series_1'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'chart/chart_trackball');
        });
    });
});