import { browser, element, By, by } from "@syncfusion/ej2-base/e2e/index";
import { WebElement, Options } from "selenium-webdriver";
import { Property } from "@syncfusion/ej2-base";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('Smithchart  component test spec', () => {
    it('Smithchart Print sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/event_print.html');
        browser.compareScreen(element(By.id('container')), 'event_print');
    });
});
describe('Smithchart  component test spec', () => {
    it('Smithchart Animation sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/event_export.html');
        browser.compareScreen(element(By.id('container')), 'event_export');
    });
});
describe('Smithchart  component test spec', () => {
    it('Smithchart title event sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/event_title.html');
        browser.compareScreen(element(By.id('container')), 'event_title');
    });
});
describe('Smithchart  component test spec', () => {
    it('Smithchart subtitle event sample', () => {
        browser.get(browser.basePath + '/demos/smithchart/event_subtitle.html');
        browser.compareScreen(element(By.id('container')), 'event_subtitle');
    });
});