import { browser, element, By } from "@syncfusion/ej2-base/e2e/index";

if (browser.isDesktop === true) {
    browser.driver.manage().window().setSize(1600, 1200);
}

describe('Document editor', function () {

    it('zoom', function () {
        browser.load('/demos/documenteditor/zoom.html');
        browser.sleep(3000);
        browser.compareScreen(element(By.id('container')), 'zoom');
    });
    it('document load', function () {
        browser.load('/demos/documenteditor/document-load.html');
        browser.sleep(3000);
        browser.compareScreen(element(By.id('container')), 'document-load');
    });
    it('Insert Text', function () {
        browser.load('/demos/documenteditor/insert_Text.html');
        browser.sleep(2000);
        browser.compareScreen(element(By.id('container')), 'insert_Text');
    });
});