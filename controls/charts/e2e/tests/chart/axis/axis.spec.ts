/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';

describe('category and log axis', () => {
    let inversed: any = element(by.id('inversed'));
    it('checking default', () => {
         browser.load('/demos/chart/axis-type/category-log/category-log.html');
        //  browser.compareScreen(element(By.id('container')), 'category_log');
    });
});

describe('DateTime-Numeric axis', () => {
    let rangePadding: ElementFinder;
    let rangePaddingDT: ElementFinder;
    it('default', () => {
         browser.load('/demos/chart/axis-type/dateTime-numeric/dateTime-numeric.html');
         browser.compareScreen(element(By.id('container')), 'chart/default_date_double');
    });
    it('xAxis inversed', () => {
        let xInversed: ElementFinder = element(by.id('xInversed'));
        xInversed.click();
        let yInversed: ElementFinder = element(by.id('yInversed'));
        yInversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/dateTime_double_Inversed');
        xInversed.click();
        yInversed.click();
    });
    it('checked with minimum for axis', () => {
        let minimum: ElementFinder = element(by.id('minimum'));
        minimum.click();
        browser.compareScreen(element(By.id('container')), 'chart/datetime_doule_minimum');
        minimum.click();
    });
    it('checked with maximum for axis', () => {
        let maximum: ElementFinder = element(by.id('maximum'));
        maximum.click();
        browser.compareScreen(element(By.id('container')), 'chart/datetime_doule_maximum');
        maximum.click();
    });
    it('checked with interval axis', () => {
        let interval: ElementFinder = element(by.id('interval'));
        interval.click();
        browser.compareScreen(element(By.id('container')), 'chart/datetime_doule_interval');
        interval.click();
    });
    it('checked with range axis', () => {
        let range: ElementFinder = element(by.id('range'));
        range.click();
        browser.compareScreen(element(By.id('container')), 'chart/datetime_doule_range');
        range.click();
    });
    it('checked double RangePadding none', () => {
        rangePadding = element(by.id('rangePadding'));
        rangePadding.click();
        browser.compareScreen(element(By.id('container')), 'chart/rangePad_double');
        rangePadding.click();
    });
    it('checked dateTime RangePadding additional', () => {
        rangePadding = element(by.id('rangePadding_date'));
        rangePadding.all(by.tagName('option'))
            .then((options: any) => {
                options[1].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/rangePad_dateTime_Additional');
    });
    it('checked dateTime RangePadding round', () => {
        rangePadding = element(by.id('rangePadding_date'));
        rangePadding.all(by.tagName('option'))
            .then((options: any) => {
                options[2].click();
            });
        browser.compareScreen(element(By.id('container')), 'chart/rangePad_dateTime_round');
    });
    it('checked format double', () => {
        let labelFormatD: ElementFinder = element(by.id('labelFormatD'));
        labelFormatD.click();
        browser.compareScreen(element(By.id('container')), 'chart/labelFormat_double');
        labelFormatD.click();
    });
    // it('checked format date time', () => {
    //     let labelFormatDT: ElementFinder = element(by.id('labelFormatDT'));
    //     labelFormatDT.click();
    //     browser.compareScreen(element(By.id('container')), 'labelFormat_dateTime');
    //     labelFormatDT.click();
    // });
});

describe('smart axis', () => {
    let labelIntersect: ElementFinder;
    let edgeLabel: ElementFinder;
    let xInversed: ElementFinder = element(by.id('xInversed'));
    let yInversed: ElementFinder = element(by.id('yInversed'));
    it('default', () => {
         browser.load('/demos/chart/axis-type/smart-axis/smart-axis.html');
         browser.compareScreen(element(By.id('container')), 'chart/default_smartAxis');
    });
    it('checked label intersect', () => {
        labelIntersect = element(by.id('labelIntersect'));
        labelIntersect.click();
        browser.compareScreen(element(By.id('container')), 'chart/labelIntersect_smartAxis');
    });
    it('checked label intersect with x inversed', () => {
        xInversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/labelIntersect_xInversed');
        xInversed.click();
        labelIntersect.click();
    });
    it('checked edge label', () => {
        edgeLabel = element(by.id('edgeLabel'));
        edgeLabel.click();
        browser.compareScreen(element(By.id('container')), 'chart/edgeLabel');
    });
    it('checked edge label yInversed', () => {
        yInversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/edgeLabel_yInversed');
        yInversed.click();
    });
});
describe('checking dateTime and edgeLabel', () => {
    let inversed: ElementFinder = element(by.id('inversed'));
    it('checking normal Axis', () => {
        browser.load('/demos/chart/axis-type/edge-label/dateTime-edgeLabel.html');
        browser.compareScreen(element(By.id('container')), 'chart/edgeLabel_dateTimeAxis');
    });
});

describe('checking gridlines', () => {
    let xInversed: ElementFinder = element(by.id('xInversed'));
    let yInversed: ElementFinder = element(by.id('yInversed'));
    it('checking normal Axis', () => {
        browser.load('/demos/chart/axis-type/grid-lines/grid-lines.html');
        browser.compareScreen(element(By.id('container')), 'chart/gridLines');
    });
    it('checking inversed Axis', () => {
        xInversed.click();
        yInversed.click();
        browser.compareScreen(element(By.id('container')), 'chart/gridLines_inversed');
        xInversed.click();
        yInversed.click();
    });
});