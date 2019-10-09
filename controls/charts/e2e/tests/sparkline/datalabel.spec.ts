/**
 * Sparkline e2e testing
 */
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('Sparkline component type: Area test spec', () => {
    let property;
    it('custom sample', (done: Function) => {
        browser.load('/demos/sparkline/area_custom.html');
        browser.compareScreen(element(By.id("percentage")), "area_range_default");
        done();
    });
    it('visible axisline', (done: Function) => {
        property = element(by.id('axisline'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_axisline");
        property = element(by.id('axisline'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_axisline-disabled");
        done();
    });
    it('visible all point marker', (done: Function) => {
        property = element(by.id('markerwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_all_marker");
        property = element(by.id('markerwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_all_marker-disabled");
        done();
    });
    it('visible all point label', (done: Function) => {
        property = element(by.id('labelwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_all_label");
        property = element(by.id('labelwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_all_label-disabled");
        done();
    });
    it('visible negative point marker', (done: Function) => {
        property = element(by.id('markerwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_negative_marker");
        property = element(by.id('markerwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_negative_marker-disabled");
        done();
    });
    it('visible negative point label', (done: Function) => {
        property = element(by.id('labelwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_negative_label");
        property = element(by.id('labelwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_negative_label-disabled");
        done();
    });
    it('visible first point marker', (done: Function) => {
        property = element(by.id('markerwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_first_marker");
        property = element(by.id('markerwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_first_marker-disabled");
        done();
    });
    it('visible first point label', (done: Function) => {
        property = element(by.id('labelwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_first_label");
        property = element(by.id('labelwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_first_label-disabled");
        done();
    });
    it('visible last point marker', (done: Function) => {
        property = element(by.id('markerwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_last_marker");
        property = element(by.id('markerwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_last_marker-disabled");
        done();
    });
    it('visible last point label', (done: Function) => {
        property = element(by.id('labelwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_last_label");
        property = element(by.id('labelwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_last_label-disabled");
        done();
    });
    it('visible high point marker', (done: Function) => {
        property = element(by.id('markerwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_high_marker");
        property = element(by.id('markerwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_high_marker-disabled");
        done();
    });
    it('visible high point label', (done: Function) => {
        property = element(by.id('labelwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_high_label");
        property = element(by.id('labelwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_high_label-disabled");
        done();
    });
    it('visible low point marker', (done: Function) => {
        property = element(by.id('markerwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_low_marker");
        property = element(by.id('markerwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_low_marker-disabled");
        done();
    });
    it('visible high point label', (done: Function) => {
        property = element(by.id('labelwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_low_label");
        property = element(by.id('labelwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "area_low_label-disabled");
        done();
    });
});
describe('Sparkline component type: Column test spec', () => {
    let property;
    it('custom sample', (done: Function) => {
        browser.load('/demos/sparkline/array_custom.html');
        browser.compareScreen(element(By.id("percentage")), "Column_range_default");
        done();
    });
    it('visible axisline', (done: Function) => {
        property = element(by.id('axisline'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_axisline");
        property = element(by.id('axisline'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_axisline-disabled");
        done();
    });
    it('visible all point marker', (done: Function) => {
        property = element(by.id('markerwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_all_marker");
        property = element(by.id('markerwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_all_marker-disabled");
        done();
    });
    it('visible all point label', (done: Function) => {
        property = element(by.id('labelwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_all_label");
        property = element(by.id('labelwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_all_label-disabled");
        done();
    });
    it('visible negative point marker', (done: Function) => {
        property = element(by.id('markerwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_negative_marker");
        property = element(by.id('markerwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_negative_marker-disabled");
        done();
    });
    it('visible negative point label', (done: Function) => {
        property = element(by.id('labelwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_negative_label");
        property = element(by.id('labelwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_negative_label-disabled");
        done();
    });
    it('visible first point marker', (done: Function) => {
        property = element(by.id('markerwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_first_marker");
        property = element(by.id('markerwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_first_marker-disabled");
        done();
    });
    it('visible first point label', (done: Function) => {
        property = element(by.id('labelwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_first_label");
        property = element(by.id('labelwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_first_label-disabled");
        done();
    });
    it('visible last point marker', (done: Function) => {
        property = element(by.id('markerwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_last_marker");
        property = element(by.id('markerwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_last_marker-disabled");
        done();
    });
    it('visible last point label', (done: Function) => {
        property = element(by.id('labelwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_last_label");
        property = element(by.id('labelwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_last_label-disabled");
        done();
    });
    it('visible high point marker', (done: Function) => {
        property = element(by.id('markerwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_high_marker");
        property = element(by.id('markerwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_high_marker-disabled");
        done();
    });
    it('visible high point label', (done: Function) => {
        property = element(by.id('labelwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_high_label");
        property = element(by.id('labelwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_high_label-disabled");
        done();
    });
    it('visible low point marker', (done: Function) => {
        property = element(by.id('markerwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_low_marker");
        property = element(by.id('markerwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_low_marker-disabled");
        done();
    });
    it('visible high point label', (done: Function) => {
        property = element(by.id('labelwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_low_label");
        property = element(by.id('labelwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Column_low_label-disabled");
        done();
    });
});
describe('Sparkline component type: array test spec', () => {
    let property;
    it('custom sample', (done: Function) => {
        browser.load('/demos/sparkline/array_custom.html');
        browser.compareScreen(element(By.id("percentage")), "array_range_default");
        done();
    });
    it('visible axisline', (done: Function) => {
        property = element(by.id('axisline'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_axisline");
        property = element(by.id('axisline'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_axisline-disabled");
        done();
    });
    it('visible all point marker', (done: Function) => {
        property = element(by.id('markerwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_all_marker");
        property = element(by.id('markerwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_all_marker-disabled");
        done();
    });
    it('visible all point label', (done: Function) => {
        property = element(by.id('labelwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_all_label");
        property = element(by.id('labelwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_all_label-disabled");
        done();
    });
    it('visible negative point marker', (done: Function) => {
        property = element(by.id('markerwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_negative_marker");
        property = element(by.id('markerwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_negative_marker-disabled");
        done();
    });
    it('visible negative point label', (done: Function) => {
        property = element(by.id('labelwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_negative_label");
        property = element(by.id('labelwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_negative_label-disabled");
        done();
    });
    it('visible first point marker', (done: Function) => {
        property = element(by.id('markerwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_first_marker");
        property = element(by.id('markerwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_first_marker-disabled");
        done();
    });
    it('visible first point label', (done: Function) => {
        property = element(by.id('labelwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_first_label");
        property = element(by.id('labelwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_first_label-disabled");
        done();
    });
    it('visible last point marker', (done: Function) => {
        property = element(by.id('markerwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_last_marker");
        property = element(by.id('markerwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_last_marker-disabled");
        done();
    });
    it('visible last point label', (done: Function) => {
        property = element(by.id('labelwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_last_label");
        property = element(by.id('labelwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_last_label-disabled");
        done();
    });
    it('visible high point marker', (done: Function) => {
        property = element(by.id('markerwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_high_marker");
        property = element(by.id('markerwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_high_marker-disabled");
        done();
    });
    it('visible high point label', (done: Function) => {
        property = element(by.id('labelwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_high_label");
        property = element(by.id('labelwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_high_label-disabled");
        done();
    });
    it('visible low point marker', (done: Function) => {
        property = element(by.id('markerwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_low_marker");
        property = element(by.id('markerwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_low_marker-disabled");
        done();
    });
    it('visible high point label', (done: Function) => {
        property = element(by.id('labelwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_low_label");
        property = element(by.id('labelwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "array_low_label-disabled");
        done();
    });
});
describe('Sparkline component type: Line test spec', () => {
    let property;
    it('custom sample', (done: Function) => {
        browser.load('/demos/sparkline/Line_custom.html');
        browser.compareScreen(element(By.id("percentage")), "Line_range_default");
        done();
    });
    it('visible axisline', (done: Function) => {
        property = element(by.id('axisline'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_axisline");
        property = element(by.id('axisline'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_axisline-disabled");
        done();
    });
    it('visible all point marker', (done: Function) => {
        property = element(by.id('markerwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_all_marker");
        property = element(by.id('markerwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_all_marker-disabled");
        done();
    });
    it('visible all point label', (done: Function) => {
        property = element(by.id('labelwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_all_label");
        property = element(by.id('labelwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_all_label-disabled");
        done();
    });
    it('visible negative point marker', (done: Function) => {
        property = element(by.id('markerwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_negative_marker");
        property = element(by.id('markerwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_negative_marker-disabled");
        done();
    });
    it('visible negative point label', (done: Function) => {
        property = element(by.id('labelwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_negative_label");
        property = element(by.id('labelwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_negative_label-disabled");
        done();
    });
    it('visible first point marker', (done: Function) => {
        property = element(by.id('markerwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_first_marker");
        property = element(by.id('markerwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_first_marker-disabled");
        done();
    });
    it('visible first point label', (done: Function) => {
        property = element(by.id('labelwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_first_label");
        property = element(by.id('labelwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_first_label-disabled");
        done();
    });
    it('visible last point marker', (done: Function) => {
        property = element(by.id('markerwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_last_marker");
        property = element(by.id('markerwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_last_marker-disabled");
        done();
    });
    it('visible last point label', (done: Function) => {
        property = element(by.id('labelwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_last_label");
        property = element(by.id('labelwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_last_label-disabled");
        done();
    });
    it('visible high point marker', (done: Function) => {
        property = element(by.id('markerwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_high_marker");
        property = element(by.id('markerwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_high_marker-disabled");
        done();
    });
    it('visible high point label', (done: Function) => {
        property = element(by.id('labelwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_high_label");
        property = element(by.id('labelwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_high_label-disabled");
        done();
    });
    it('visible low point marker', (done: Function) => {
        property = element(by.id('markerwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_low_marker");
        property = element(by.id('markerwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_low_marker-disabled");
        done();
    });
    it('visible high point label', (done: Function) => {
        property = element(by.id('labelwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_low_label");
        property = element(by.id('labelwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "Line_low_label-disabled");
        done();
    });
});