/**
 * TreeMap e2e testing
 */
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";



describe('TreeMap component test spec', () => {
    it('TreeMap Default sample', () => {
        browser.get(browser.basePath + '/demo/default.html');
        browser.compareScreen(element(By.id('container')), 'default_treemap');
    });
});