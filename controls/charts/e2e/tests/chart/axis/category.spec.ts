/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';

describe('category and log axis', () => {
    let inversed: any = element(by.id('inversed'));
    it('checking default', () => {
         browser.load('/demos/chart/axis-type/category-log/category-log.html');
         browser.compareScreen(element(By.id('container')), 'chart/category_log');
    });
    it('checking inversed', () => {
        let isInversed: ElementFinder = element(by.id('inversed'));
        isInversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/category_log_Inversed');
        isInversed.click();
    });
    it('checking with indexed axis', () => {
        let isIndexed: ElementFinder = element(by.id('indexed'));
        isIndexed.click();
        browser.compareScreen(element(By.id('container')), 'chart/category_log_Indexed');
        isIndexed.click();
    });
    it('checked with minimum for log axis', () => {
        let minimum: ElementFinder = element(by.id('minimum'));
        minimum.click();
        browser.compareScreen(element(By.id('container')), 'chart/category_log_minimum');
        minimum.click();
    });
    it('checked with maximum for log axis', () => {
        let maximum: ElementFinder = element(by.id('maximum'));
        maximum.click();
        browser.compareScreen(element(By.id('container')), 'chart/category_log_maximum');
        maximum.click();
    });
    it('checked with interval axis', () => {
        let interval: ElementFinder = element(by.id('interval'));
        interval.click();
        browser.compareScreen(element(By.id('container')), 'chart/category_log_interval');
        interval.click();
    });
    it('checked with range axis', () => {
        let range: ElementFinder = element(by.id('range'));
        range.click();
        browser.compareScreen(element(By.id('container')), 'chart/category_log_range');
        range.click();
    });
});