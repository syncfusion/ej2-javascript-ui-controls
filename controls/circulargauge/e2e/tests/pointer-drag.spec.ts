import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";
import { WebElement } from "selenium-webdriver";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Pointer Drag samples test spec', () => {
    let property;
    it('Pointer Drag sample', (done: Function) => {
        browser.load("/demos/user-interactions/pointer-drag.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("user-container")), "pointer_drag_1");
        done();
    });
    it('Pointer Dragging range 1 spec', (done: Function) => {
        property = element(by.id('user-container_Axis_0_Pointer_NeedleRect_1'));
        browser.actions().dragAndDrop(property, { x: 30, y: 30}).perform();
        browser.compareScreen(element(By.id("user-container")), "pointer_drag_2");
        done();
    });
    it('Pointer Dragging range 2 spec', (done: Function) => {
        property = element(by.id('user-container_Axis_0_Pointer_NeedleRect_1'));
        browser.actions().dragAndDrop(property, { x: 40, y: 70}).perform();
        browser.compareScreen(element(By.id("user-container")), "pointer_drag_3");
        done();
    });
    it('Pointer Dragging range 0 spec', (done: Function) => {
        property = element(by.id('user-container_Axis_0_Pointer_NeedleRect_1'));
        browser.actions().dragAndDrop(property, element(by.id('user-container_Axis_0_Label_2'))).perform();
        browser.compareScreen(element(By.id("user-container")), "pointer_drag_0");
        done();
    });
    it('Pointer Dragging disabled check', (done: Function) => {
        property = element(by.id('enable'));
        property.click();
        property = element(by.id('user-container_Axis_0_Pointer_NeedleRect_1'));
        browser.actions().dragAndDrop(property, {x: 40, y: 40}).perform();
        browser.compareScreen(element(By.id("user-container")), "pointer_drag_disabled");
        done();
    });
});