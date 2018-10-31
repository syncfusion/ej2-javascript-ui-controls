/**
 * TreeMap e2e testing
 */
import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 2000);
}

describe('TreeMap component test spec', () => {
    let property;
    it('TreeMap Tooltip sample', () => {
        browser.get(browser.basePath + '/demo/tooltip.html');
       // browser.actions().mouseMove(by.id('container'), ).perform();
        browser.compareScreen(element(By.id('container')), 'tooltip');
    });
});