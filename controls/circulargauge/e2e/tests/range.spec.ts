import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";
import { WebElement } from "selenium-webdriver";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Range samples test spec', () => {
    let property;
    it('Range sample', (done: Function) => {
        browser.load("/demos/default/range.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("range-container")), "range_default");
        done();
    });
    it('Range font color spec', (done: Function) => {
        property = element(by.id('enable'));
        property.click();
        browser.compareScreen(element(By.id("range-container")), "range-font-color");
        property = element(by.id('enable'));
        property.click();
        browser.compareScreen(element(By.id("range-container")), "range-font-color-disabled");
        done();
    });
    it('Range 1 color change spec', (done: Function) => {
        property = element(by.id('rangeColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("range-container")), "range-1-color-1");
        done();
    });
    it('Range 1 color change spec', (done: Function) => {
        property = element(by.id('rangeColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("range-container")), "range-1-color-2");
        done();
    });
    it('Range 1 color change spec', (done: Function) => {
        property = element(by.id('rangeColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[0].click();
        });
        browser.compareScreen(element(By.id("range-container")), "range-1-color-0");
        done();
    });
    it('Range 1 start width change spec', (done: Function) => {
        property = element(by.id('startWidth'));
        browser.actions().dragAndDrop(property, { x: 30, y: 0}).perform();
        browser.compareScreen(element(By.id("range-container")), "range-1-start-width-1");
        done();
    });
    it('Range 1 end width change spec', (done: Function) => {
        property = element(by.id('endWidth'));
        browser.actions().dragAndDrop(property, { x: 50, y: 0}).perform();
        browser.compareScreen(element(By.id("range-container")), "range-1-end-width-1");
        done();
    });
    it('Range 1 start range change spec', (done: Function) => {
        property = element(by.id('start'));
        browser.actions().dragAndDrop(property, { x: 1, y: 0}).perform();
        browser.compareScreen(element(By.id("range-container")), "range-1-start-range-1");
        done();
    });
    it('Range 1 end range change spec', (done: Function) => {
        property = element(by.id('end'));
        browser.actions().dragAndDrop(property, { x: 50, y: 0}).perform();
        browser.compareScreen(element(By.id("range-container")), "range-1-end-range-1");
        done();
    });
    it('Range 2 refresh', (done: Function) => {
        browser.refresh();
        browser.compareScreen(element(By.id("range-container")), "range-refresh");
        property = element(by.id('rangeSelect'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        done();
    });
    it('Range 2 color change spec', (done: Function) => {
        property = element(by.id('rangeColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[0].click();
        });
        browser.compareScreen(element(By.id("range-container")), "range-2-color-1");
        done();
    });
    it('Range 2 color change spec', (done: Function) => {
        property = element(by.id('rangeColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("range-container")), "range-2-color-2");
        done();
    });
    it('Range 2 color change spec', (done: Function) => {
        property = element(by.id('rangeColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("range-container")), "range-2-color-0");
        done();
    });
    it('Range 2 start width change spec', (done: Function) => {
        property = element(by.id('startWidth'));
        browser.actions().dragAndDrop(property, { x: 30, y: 0}).perform();
        browser.compareScreen(element(By.id("range-container")), "range-2-start-width-1");
        done();
    });
    it('Range 2 end width change spec', (done: Function) => {
        property = element(by.id('endWidth'));
        browser.actions().dragAndDrop(property, { x: 50, y: 0}).perform();
        browser.compareScreen(element(By.id("range-container")), "range-2-end-width-1");
        done();
    });
    it('Range 2 start range change spec', (done: Function) => {
        property = element(by.id('start'));
        browser.actions().dragAndDrop(property, { x: 1, y: 0}).perform();
        browser.compareScreen(element(By.id("range-container")), "range-2-start-range-1");
        done();
    });
    it('Range 2 end range change spec', (done: Function) => {
        property = element(by.id('end'));
        browser.actions().dragAndDrop(property, { x: 50, y: 0}).perform();
        browser.compareScreen(element(By.id("range-container")), "range-2-end-range-1");
        done();
    });
    it('Range 3 refresh', (done: Function) => {
        browser.refresh();
        browser.compareScreen(element(By.id("range-container")), "range-refresh-2");
        property = element(by.id('rangeSelect'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        done();
    });
    it('Range 3 color change spec', (done: Function) => {
        property = element(by.id('rangeColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("range-container")), "range-3-color-1");
        done();
    });
    it('Range 3 color change spec', (done: Function) => {
        property = element(by.id('rangeColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[0].click();
        });
        browser.compareScreen(element(By.id("range-container")), "range-3-color-2");
        done();
    });
    it('Range 3 color change spec', (done: Function) => {
        property = element(by.id('rangeColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("range-container")), "range-3-color-0");
        done();
    });
    it('Range 3 start width change spec', (done: Function) => {
        property = element(by.id('startWidth'));
        browser.actions().dragAndDrop(property, { x: 30, y: 0}).perform();
        browser.compareScreen(element(By.id("range-container")), "range-3-start-width-1");
        done();
    });
    it('Range 3 end width change spec', (done: Function) => {
        property = element(by.id('endWidth'));
        browser.actions().dragAndDrop(property, { x: 50, y: 0}).perform();
        browser.compareScreen(element(By.id("range-container")), "range-3-end-width-1");
        done();
    });
    it('Range 3 start range change spec', (done: Function) => {
        property = element(by.id('start'));
        browser.actions().dragAndDrop(property, { x: 1, y: 0}).perform();
        browser.compareScreen(element(By.id("range-container")), "range-3-start-range-1");
        done();
    });
    it('Range 3 end range change spec', (done: Function) => {
        property = element(by.id('end'));
        browser.actions().dragAndDrop(property, { x: 50, y: 0}).perform();
        browser.compareScreen(element(By.id("range-container")), "range-3-end-range-1");
        done();
    });
});