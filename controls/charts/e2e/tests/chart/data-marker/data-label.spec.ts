/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';

describe('DataLabel', () => {
    let seriesType: ElementFinder;
    let sidebyside: ElementFinder;
    let inversed: ElementFinder;
    let vertical: ElementFinder;
    it('line charts all datalabel', () => {
        browser.load('/demos/chart/datalabel/datalabel.html');
        browser.compareScreen(element(By.id('container')), 'chart/line charts all datalabel');
    });
    it('line charts datalabel with inversed', () => {
        inversed = element(by.id('inversed'));
        inversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/line charts inversed with datalabel');
        inversed.click();
    });
    it('line charts - vertical with datalabel', () => {
        vertical = element(by.id('vertical'));
        vertical.click();
        browser.compareScreen(element(By.id('container')), 'chart/line charts vertical with datalabel');
    });
    it('column charts all datalabel', () => {
        browser.load('/demos/chart/datalabel/datalabel.html');
        seriesType = element(by.id('seriestype'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[1].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/column charts all datalabel');
    });
    it('column charts enable side by side', () => {
        sidebyside = element(by.id('sidebyside'));
        sidebyside.click();
        browser.compareScreen(element(By.id('container')), 'chart/column charts enable side by side');
        sidebyside.click();
    });
    it('column charts datalabel with inversed', () => {
        inversed = element(by.id('inversed'));
        inversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/column charts inversed with datalabel');
        inversed.click();
    });
    it('column charts - vertical with datalabel', () => {
        vertical = element(by.id('vertical'));
        vertical.click();
        browser.compareScreen(element(By.id('container')), 'chart/column charts vertical with datalabel');
    });
    it('bar charts all datalabel', () => {
        browser.load('/demos/chart/datalabel/datalabel.html');
        seriesType = element(by.id('seriestype'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[2].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/bar charts all datalabel');
    });
    it('bar charts enable side by side', () => {
        sidebyside = element(by.id('sidebyside'));
        sidebyside.click();
        browser.compareScreen(element(By.id('container')), 'chart/bar charts enable side by side');
        sidebyside.click();
    });
    it('bar charts datalabel with inversed', () => {
        inversed = element(by.id('inversed'));
        inversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/bar charts inversed with datalabel');
        inversed.click();
    });
    it('bar charts - vertical with datalabel', () => {
        vertical = element(by.id('vertical'));
        vertical.click();
        browser.compareScreen(element(By.id('container')), 'chart/bar charts vertical with datalabel');
    });
    it('bubble charts all datalabel', () => {
        browser.load('/demos/chart/datalabel/datalabel.html');
        seriesType = element(by.id('seriestype'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[3].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/bubble charts all datalabel');
    });
    it('bubble charts datalabel with inversed', () => {
        inversed = element(by.id('inversed'));
        inversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/bubble charts inversed with datalabel');
        inversed.click();
    });
    it('bubble charts - vertical with datalabel', () => {
        vertical = element(by.id('vertical'));
        vertical.click();
        browser.compareScreen(element(By.id('container')), 'chart/bubble charts vertical with datalabel');
    });
    it('financial charts all datalabel', () => {
        browser.load('/demos/chart/datalabel/datalabel.html');
        seriesType = element(by.id('seriestype'));
        seriesType.all(by.tagName('option'))
            .then((options: any) => {
                options[4].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/financial charts all datalabel');
    });
    it('financial charts datalabel with inversed', () => {
        inversed = element(by.id('inversed'));
        inversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/financial charts inversed with datalabel');
        inversed.click();
    });
    it('financial charts - vertical with datalabel', () => {
        vertical = element(by.id('vertical'));
        vertical.click();
        browser.compareScreen(element(By.id('container')), 'chart/financial charts vertical with datalabel');
    });
}); 