import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";
import { WebElement } from "selenium-webdriver";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Ticks and labels samples test spec', () => {
    let property;
    it('Ticks and labels sample', (done: Function) => {
        browser.load("/demos/default/ticksandlabels.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("labels-container")), "labels_default");
        done();
    });
    it('tick position outside', (done: Function) => {
        property = element(by.id('tickposition'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("labels-container")), "ticks-outside");
        done();
    });
    it('label position inside', (done: Function) => {
        property = element(by.id('labelposition'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("labels-container")), "labels-inside");
        done();
    });
    it('tick offset change', (done: Function) => {
        property = element(by.id('tickOffset'));
        browser.actions().dragAndDrop(property, { x: 5, y: 0}).perform();
        browser.compareScreen(element(By.id("labels-container")), "tick offset");
        done();
    });
    it('tick height change', (done: Function) => {
        property = element(by.id('tickHeight'));
        browser.actions().dragAndDrop(property, { x: 5, y: 0}).perform();
        browser.compareScreen(element(By.id("labels-container")), "tick height");
        done();
    });
    it('label offset change', (done: Function) => {
        property = element(by.id('labelOffset'));
        browser.actions().dragAndDrop(property, { x: 5, y: 0}).perform();
        browser.compareScreen(element(By.id("labels-container")), "label offset");
        done();
    });
    it('minor ticks', (done: Function) => {
        property = element(by.id('Ticks'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("labels-container")), "minor ticks");
        done();
    });
    it('minor tick position outside', (done: Function) => {
        property = element(by.id('tickposition'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("labels-container")), "minor-ticks-outside");
        done();
    });
    it('minor tick label position inside', (done: Function) => {
        property = element(by.id('labelposition'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("labels-container")), "minor-labels-inside");
        done();
    });
    it('minor tick tick offset change', (done: Function) => {
        property = element(by.id('tickOffset'));
        browser.actions().dragAndDrop(property, { x: 5, y: 0}).perform();
        browser.compareScreen(element(By.id("labels-container")), "minor-tick offset");
        done();
    });
    it('minor tick height change', (done: Function) => {
        property = element(by.id('tickHeight'));
        browser.actions().dragAndDrop(property, { x: 5, y: 0}).perform();
        browser.compareScreen(element(By.id("labels-container")), "minor-tick height");
        done();
    });
    it('minor tick label offset change', (done: Function) => {
        property = element(by.id('labelOffset'));
        browser.actions().dragAndDrop(property, { x: 5, y: 0}).perform();
        browser.compareScreen(element(By.id("labels-container")), "minor-label offset");
        done();
    });
});