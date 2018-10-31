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
describe('TreeMap component print test spec', () => {
    it('TreeMap print ', () => {
        browser.get(browser.basePath + '/demo/event_print.html');
        browser.compareScreen(element(By.id('container')), 'event_print');
    });
});
describe('TreeMap component export test spec', () => {
    it('TreeMap export ', () => {
        browser.get(browser.basePath + '/demo/event_export.html');
        browser.compareScreen(element(By.id('container')), 'event_exports');
    });
});
describe('TreeMap component label test spec', () => {
    it('TreeMap data label event ', () => {
        browser.get(browser.basePath + '/demo/event_datalabel.html');
        browser.compareScreen(element(By.id('container')), 'event_datalabel');
    });
});
describe('TreeMap component legend test spec', () => {
    it('TreeMap legend ', () => {
        browser.get(browser.basePath + '/demo/event_legend.html');
        browser.compareScreen(element(By.id('container')), 'event_legend');
    });
});
describe('TreeMap component drilldown test spec', () => {
    it('TreeMap drilldown ', () => {
        browser.get(browser.basePath + '/demo/event_drilldown.html');
        browser.compareScreen(element(By.id('container')), 'event_drilldown');
    });
});
