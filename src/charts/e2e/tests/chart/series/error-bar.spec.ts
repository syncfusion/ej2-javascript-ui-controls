/**
 * spec
 */
import { browser, element, By, ElementFinder, by } from '@syncfusion/ej2-base/e2e/index';

describe('Error Bar', () => {
    let errorBarType: ElementFinder;
    it('fixed type', () => {
        browser.load('/demos/chart/series-types/error-bar/error-bar.html');
        browser.compareScreen(element(By.id('container')), 'chart/errorBar_fixedType');
    });
    it('Percentage type', () => {
        browser.load('/demos/chart/series-types/error-bar/error-bar.html');
        errorBarType = element(by.id('errortype'));
        errorBarType.all(by.tagName('option'))
            .then((options: any) => {
                options[1].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/errorBar_PercentageType');
    });
    it('StandardDeviation type', () => {
        errorBarType.all(by.tagName('option'))
            .then((options: any) => {
                options[2].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/errorBar_StandardDeviationType');
    });
    it('StandardError type', () => {
        errorBarType.all(by.tagName('option'))
            .then((options: any) => {
                options[3].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/errorBar_StandardErrorType');
    });
    it('Custom type', () => {
        errorBarType.all(by.tagName('option'))
            .then((options: any) => {
                options[4].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/errorBar_CustomType');
    });
    it('inversed', () => {
        browser.load('/demos/chart/series-types/error-bar/error-bar.html');
        let inversed: ElementFinder = element(by.id('inversed'));
        inversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/errorBar with inversed');
        inversed.click();
    });
    it('vertical', () => {
        let vertical: ElementFinder = element(by.id('vertical'));
        vertical.click();
        browser.compareScreen(element(By.id('container')), 'chart/errorBar with vertical');
        vertical.click();
    });
    it('stacking series', () => {
        browser.load('/demos/chart/series-types/error-bar/error-bar.html');
        let stacking: ElementFinder = element(by.id('stacking'));
        stacking.click();
        browser.compareScreen(element(By.id('container')), 'chart/errorBar with stacking series');
        stacking.click();
    });
});