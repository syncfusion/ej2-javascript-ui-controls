import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";
import { WebElement } from "selenium-webdriver";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Compass samples test spec', () => {
    let property;
    it('Compass sample', (done: Function) => {
        browser.load("/demos/default/compass.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("direction-container")), "compass_default");
        done();
    });
    it('Compass pointer color 1 sample', (done: Function) => {
        property = element(by.id('poiterColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("direction-container")), "compass_pointer-1");
        done();
    });
    it('Compass pointer color 2 sample', (done: Function) => {
        property = element(by.id('poiterColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("direction-container")), "compass_pointer-2");
        done();
    });
    it('Compass label color 1 sample', (done: Function) => {
        property = element(by.id('labelColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("direction-container")), "compass_label-1");
        done();
    });
    it('Compass label color 2 sample', (done: Function) => {
        property = element(by.id('labelColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("direction-container")), "compass_label-2");
        done();
    });
});