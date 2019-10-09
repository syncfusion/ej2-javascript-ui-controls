import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Axes samples test spec', () => {
    let property;
    it('Axis sample', (done: Function) => {
        browser.load("/demos/Axes/axis.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("axis-container")), "axis-1");
        done();
    });
    it('Axis 1 sample anti clock', (done: Function) => {
        property = element(by.id('axisDirection'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("axis-container")), "axis-1-anti-clock");
        done();
    });
    it('Axis 2 sample anti clock', (done: Function) => {
        property = element(by.id('axisIndex'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        property = element(by.id('axisDirection'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("axis-container")), "axis-2-anti-clock");
        done();
    });
});