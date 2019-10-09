import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";
import { WebElement } from "selenium-webdriver";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Tooltip samples test spec', () => {
    let property;
    it('Without Tooltip', (done: Function) => {
        browser.load("/demos/user-interactions/tooltip.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("tooltip-container")), "tooltip");
        done();
    });
    it('With Tooltip in range 2', (done: Function) => {
        property = element(by.id('tooltip-container_Axis_0_Pointer_NeedleRect_0'));
        browser.actions().click(property).perform();
        browser.compareScreen(element(By.id("tooltip-container")), "tooltip-visible");
        done();
    });
    it('With Tooltip in range 1', (done: Function) => {
        // tooltip-container_Axis_0_Label_3
        property = element(by.id('tooltip-container_Axis_0_Label_3'));
        property = element(by.id('tooltip-container_Axis_0_Pointer_NeedleRect_0'));
        browser.actions().dragAndDrop(property, element(by.id('tooltip-container_Axis_0_Label_3'))).perform();
        browser.actions().click(property).perform();
        browser.compareScreen(element(By.id("tooltip-container")), "tooltip-drag-visible");
        done();
    });
});