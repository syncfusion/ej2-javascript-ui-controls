import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Static samples test spec', () => {
    it('Static testing spec', (done: Function) => {
        browser.load("/demos/testing/static.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "background");
        done();
    });
    it('Static testing spec 1', (done: Function) => {
        browser.load("/demos/testing/static-1.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "border");
        done();
    });
    it('Static testing spec 2', (done: Function) => {
        browser.load("/demos/testing/static-2.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge_svg")), "size");
        done();
    });
    it('Static testing spec 3', (done: Function) => {
        browser.load("/demos/testing/static-3.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "margin");
        done();
    });
    it('Static testing spec 4', (done: Function) => {
        browser.load("/demos/testing/static-4.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "start-end");
        done();
    });
    it('Static testing spec 5', (done: Function) => {
        browser.load("/demos/testing/static-5.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "line-style");
        done();
    });
    it('Static testing spec 6', (done: Function) => {
        browser.load("/demos/testing/static-6.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "start-angle");
        done();
    });
});