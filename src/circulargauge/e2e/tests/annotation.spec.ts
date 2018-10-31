import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Annotation samples test spec', () => {
    it('Annotation default spec', (done: Function) => {
        browser.load("/demos/default/annotations.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("clockgauge")), "annotation-default");
        done();
    });
});