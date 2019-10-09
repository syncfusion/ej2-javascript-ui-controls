/**
 * TreeMap e2e testing
 */
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

describe('TreeMap component test spec', () => {
    it('TreeMap print ', () => {
        browser.get(browser.basePath + '/demo/print.html');
        browser.compareScreen(element(By.id('container')), 'print');
    });
});
describe('TreeMap component test spec', () => {
    it('TreeMap export ', () => {
        browser.get(browser.basePath + '/demo/export.html');
        browser.compareScreen(element(By.id('container')), 'export');
    });
});
