import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Event samples test spec', () => {
    it('Event testing spec 1', (done: Function) => {
        browser.load("/demos/testing/event-1.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "LoadEvent-Gauge-Size");
        done();
    });
    it('Event testing spec 2', (done: Function) => {
        browser.load("/demos/testing/event-2.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "AxisLabelEvent-RangeColor");
        done();
    });
    it('Event testing spec 3', (done: Function) => {
        browser.load("/demos/testing/event-3.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "AnnotationEvent-Annotation");
        done();
    });
    it('Event testing spec 4', (done: Function) => {
        browser.load("/demos/testing/event-4.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "LoadedEvent-Background-Color");
        done();
    });
    it('Event testing spec 5', (done: Function) => {
        browser.load("/demos/testing/event-5.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "LoadedEvent-Public-AnnotationValue");
        done();
    });
    it('Event testing spec 6', (done: Function) => {
        browser.load("/demos/testing/event-6.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "LoadedEvent-Public-PointerValue");
        done();
    });
});