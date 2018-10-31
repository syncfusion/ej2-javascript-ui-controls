/**
 * TreeMap e2e testing
 */
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 1200);
}

describe('TreeMap component test spec', () => {
    it('TreeMap Default layout', () => {
        browser.get(browser.basePath + '/demo/layout.html');
        browser.compareScreen(element(By.id('container')), 'layout_type1');
    });
    it('TreeMap  layout type SliceAndDiceHorizontal', () => {
        browser.get(browser.basePath + '/demo/layouttype2.html');
        browser.compareScreen(element(By.id('container')), 'layout_type2');
    });
    it('TreeMap  layout type SliceAndDiceVertical', () => {
        browser.get(browser.basePath + '/demo/layouttype3.html');
        browser.compareScreen(element(By.id('container')), 'layout_type3');
    });
    it('TreeMap  layout type SliceAndDiceAuto', () => {
        browser.get(browser.basePath + '/demo/layouttype4.html');
        browser.compareScreen(element(By.id('container')), 'layout_type4');
    });
    it('Hierarchical layout type SliceAndDiceAuto', () => {
        browser.get(browser.basePath + '/demo/layouttype4.html');
        browser.compareScreen(element(By.id('container')), 'layout_type4');
    });
});
