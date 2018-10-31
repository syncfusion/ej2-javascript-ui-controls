import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";
import { WebElement } from "selenium-webdriver";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Default samples test spec', () => {
    it('Default sample', (done: Function) => {
        browser.load("/demos/default/default.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("gauge")), "default_gauge");
        done();
    });
});