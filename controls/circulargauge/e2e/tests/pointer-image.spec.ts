import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";
import { WebElement } from "selenium-webdriver";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Pointer Image samples test spec', () => {
    it('Pointer Image sample', (done: Function) => {
        browser.load("/demos/pointer/pointer-image.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("pointer-container")), "pointer_image");
        done();
    });
});