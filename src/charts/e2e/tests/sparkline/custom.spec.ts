/**
 * Sparkline e2e testing
 */
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('Sparkline component test spec', () => {
    let property;
    it('custom sample', (done: Function) => {
        browser.load('/demos/sparkline/custom.html');
        browser.compareScreen(element(By.id("percentage")), "range_default");
        done();
    });
    it('visible axisline', (done: Function) => {
        property = element(by.id('axisline'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "axisline");
        property = element(by.id('axisline'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "axisline-disabled");
        done();
    });
    it('visible all point marker', (done: Function) => {
        property = element(by.id('markerwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "all_marker");
        property = element(by.id('markerwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "all_marker-disabled");
        done();
    });
    it('visible all point label', (done: Function) => {
        property = element(by.id('labelwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "all_label");
        property = element(by.id('labelwithall'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "all_label-disabled");
        done();
    });
    it('visible negative point marker', (done: Function) => {
        property = element(by.id('markerwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "negative_marker");
        property = element(by.id('markerwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "negative_marker-disabled");
        done();
    });
    it('visible negative point label', (done: Function) => {
        property = element(by.id('labelwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "negative_label");
        property = element(by.id('labelwithnegative'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "negative_label-disabled");
        done();
    });
    it('visible first point marker', (done: Function) => {
        property = element(by.id('markerwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "first_marker");
        property = element(by.id('markerwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "first_marker-disabled");
        done();
    });
    it('visible first point label', (done: Function) => {
        property = element(by.id('labelwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "first_label");
        property = element(by.id('labelwithfirst'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "first_label-disabled");
        done();
    });
    it('visible last point marker', (done: Function) => {
        property = element(by.id('markerwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "last_marker");
        property = element(by.id('markerwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "last_marker-disabled");
        done();
    });
    it('visible last point label', (done: Function) => {
        property = element(by.id('labelwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "last_label");
        property = element(by.id('labelwithlast'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "last_label-disabled");
        done();
    });
    it('visible high point marker', (done: Function) => {
        property = element(by.id('markerwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "high_marker");
        property = element(by.id('markerwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "high_marker-disabled");
        done();
    });
    it('visible high point label', (done: Function) => {
        property = element(by.id('labelwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "high_label");
        property = element(by.id('labelwithhigh'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "high_label-disabled");
        done();
    });
    it('visible low point marker', (done: Function) => {
        property = element(by.id('markerwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "low_marker");
        property = element(by.id('markerwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "low_marker-disabled");
        done();
    });
    it('visible high point label', (done: Function) => {
        property = element(by.id('labelwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "low_label");
        property = element(by.id('labelwithlow'));
        property.click();
        browser.compareScreen(element(By.id("percentage")), "low_label-disabled");
        done();
    });
});
describe('Sparkline component default test spec', () => {
    let property;
    it('Sparkline line sample', () => {
        browser.load('/demos/sparkline/sample_default.html');
        browser.compareScreen(element(By.id('p-australia')), 'default_line');
    });
    it('Sparkline Area sample', () => {
        browser.load('/demos/sparkline/sample_default.html');
        browser.compareScreen(element(By.id('d-australia')), 'default_area');
    });
    it('Sparkline winloss sample', () => {
        browser.load('/demos/sparkline/sample_default.html');
        browser.compareScreen(element(By.id('g-australia')), 'default_winloss');
    });
    it('Sparkline column sample', () => {
        browser.load('/demos/sparkline/sample_default.html');
        browser.compareScreen(element(By.id('b-australia')), 'default_column');
    });
});
describe('Sparkline component Series test spec', () => {
    let property;
    it('Sparkline line sample', () => {
        browser.load('/demos/sparkline/series.html');
        browser.compareScreen(element(By.id('line')), 'series_line');
    });
    it('Sparkline Area sample', () => {
        browser.load('/demos/sparkline/series.html');
        browser.compareScreen(element(By.id('area')), 'series_area');
    });
    it('Sparkline column sample', () => {
        browser.load('/demos/sparkline/series.html');
        browser.compareScreen(element(By.id('column')), 'series_column');
    });
    it('Sparkline winloss sample', () => {
        browser.load('/demos/sparkline/series.html');
        browser.compareScreen(element(By.id('winloss')), 'series_winloss');
    });
    it('Sparkline Pie1 sample', () => {
        browser.load('/demos/sparkline/series.html');
        browser.compareScreen(element(By.id('pie1')), 'series_pie1');
    });
    it('Sparkline Pie2 sample', () => {
        browser.load('/demos/sparkline/series.html');
        browser.compareScreen(element(By.id('pie2')), 'series_pie2');
    });
    it('Sparkline Pie3 sample', () => {
        browser.load('/demos/sparkline/series.html');
        browser.compareScreen(element(By.id('pie3')), 'series_pie3');
    });
});
describe('Sparkline component Axistype test spec', () => {
    let property;
    it('Sparkline line sample', () => {
        browser.load('/demos/sparkline/axisvaluetype.html');
        browser.compareScreen(element(By.id('datetime')), 'axistype_datetime');
    });
    it('Sparkline Category sample', () => {
        browser.load('/demos/sparkline/axisvaluetype.html');
        browser.compareScreen(element(By.id('category')), 'axistype_category');
    });
    it('Sparkline numeric sample', () => {
        browser.load('/demos/sparkline/axisvaluetype.html');
        browser.compareScreen(element(By.id('numeric')), 'axistype_numeric');
    });
});
 describe('Sparkline component Padding and contain area test spec', () => {
    let property;
    it('Sparkline padding Top sample', () => {
        browser.load('/demos/sparkline/padding.html');
        browser.compareScreen(element(By.id('container')), 'padding_top');
    });
    it('Sparklinepadding bottom sample', () => {
        browser.load('/demos/sparkline/padding_bottom.html');
        browser.compareScreen(element(By.id('container')), 'padding_bottom');
    });
    it('Sparkline padding Right sample', () => {
        browser.load('/demos/sparkline/padding_right.html');
        browser.compareScreen(element(By.id('container')), 'padding_right');
    });
    it('Sparkline padding Left sample', () => {
        browser.load('/demos/sparkline/padding_left.html');
        browser.compareScreen(element(By.id('container')), 'padding_left');
    });
    it('Sparkline background sample', () => {
        browser.load('/demos/sparkline/background.html');
        browser.compareScreen(element(By.id('container')), 'background');
    });
     it('Sparkline border sample', () => {
        browser.load('/demos/sparkline/border.html');
        browser.compareScreen(element(By.id('container')), 'border');
    });
    it('Sparkline range band sample', () => {
        browser.load('/demos/sparkline/rangeband.html');
        browser.compareScreen(element(By.id('container')), 'rangeband');
    });
     it('Sparkline range band opacity sample', () => {
        browser.load('/demos/sparkline/opacity.html');
        browser.compareScreen(element(By.id('container')), 'rangeband_opacity');
    });
     it('Sparkline shape border sample', () => {
        browser.load('/demos/sparkline/border1.html');
        browser.compareScreen(element(By.id('container')), 'border1');
    });
    it('Sparkline datalabel border sample', () => {
        browser.load('/demos/sparkline/datalabel.html');
        browser.compareScreen(element(By.id('container')), 'datalabel');
    });
     it('Sparkline datalabel offset sample', () => {
        browser.load('/demos/sparkline/datalabel.html');
        browser.compareScreen(element(By.id('container')), 'label_offest');
    });
});
describe('Sparkline component Padding and contain area test spec', () => {
    let property;
    it('Sparkline load event sample', () => {
        browser.load('/demos/sparkline/event_load.html');
        browser.compareScreen(element(By.id('container')), 'event_load');
    });
    it('Sparkline loaded event sample', () => {
        browser.load('/demos/sparkline/event_loaded.html');
        browser.compareScreen(element(By.id('container')), 'event_loaded');
    });
    it('Sparkline data label event sample', () => {
        browser.load('/demos/sparkline/event_point.html');
        browser.compareScreen(element(By.id('container')), 'event_point');
    });
    it('Sparkline marker event sample', () => {
        browser.load('/demos/sparkline/event_marker.html');
        browser.compareScreen(element(By.id('container')), 'event_marker');
    });
    it('Sparkline data label offset sample', () => {
        browser.load('/demos/sparkline/datalabel_offset.html');
        browser.compareScreen(element(By.id('container')), 'datalabel_offset');
    });
});