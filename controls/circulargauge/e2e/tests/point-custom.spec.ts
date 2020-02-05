import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";
import { WebElement } from "selenium-webdriver";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Pointer samples', () => {
    it('Pointer types sample', (done: Function) => {
         browser.load("/demos/pointer/pointer-customization.html");
         browser.compareScreen(element(By.id('container1')), 'Pointer_custom_1');
         browser.compareScreen(element(By.id('container2')), 'Pointer_custom_2');
         browser.compareScreen(element(By.id('container3')), 'Pointer_custom_3');
         browser.compareScreen(element(By.id('container4')), 'Pointer_custom_4');
         browser.compareScreen(element(By.id('container5')), 'Pointer_custom_5');
         browser.compareScreen(element(By.id('container6')), 'Pointer_custom_6');
		 done();
        });
});