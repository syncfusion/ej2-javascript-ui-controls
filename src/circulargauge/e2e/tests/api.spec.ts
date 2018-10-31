import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage API samples test spec', () => {
    it('api testing spec 1', (done: Function) => {
        browser.load("/demos/testing/api-1.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "Annotation-Autoangle");
        done();
    });
    it('api testing spec 2', (done: Function) => {
        browser.load("/demos/testing/api-2.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "Pointer-Cap-Border");
        done();
    });
    it('api testing spec 3', (done: Function) => {
        browser.load("/demos/testing/api-3.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "HiddenLabel");
        done();
    });
    it('api testing spec 4', (done: Function) => {
        browser.load("/demos/testing/api-4.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "NeedlePointer");
        done();
    });
    it('api testing spec 5', (done: Function) => {
        browser.load("/demos/testing/api-5.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "LabelFormat");
        done();
    });
    it('api testing spec 6', (done: Function) => {
        browser.load("/demos/testing/api-6.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "LabelFormat-1");
        done();
    });
    it('api testing spec 7', (done: Function) => {
        browser.load("/demos/testing/api-7.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "Pointer-MarkerShape");
        done();
    });
    it('api testing spec 8', (done: Function) => {
        browser.load("/demos/testing/api-8.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "MajorTicks-Interval");
        done();
    });
    it('api testing spec 9', (done: Function) => {
        browser.load("/demos/testing/api-9.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "MajorTicks-RangeColor");
        done();
    });
    it('api testing spec 10', (done: Function) => {
        browser.load("/demos/testing/api-10.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "Gauge-Title");
        done();
    });
    it('api testing spec 11', (done: Function) => {
        browser.load("/demos/testing/api-11.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "DualRangebar-Pointer");
        done();
    });
    it('api testing spec 12', (done: Function) => {
        browser.load("/demos/testing/api-12.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "DualRanges-SameValue");
        done();
    });
    it('api testing spec 13', (done: Function) => {
        browser.load("/demos/testing/api-13.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "TwoPointers");
        done();
    });
    it('api testing spec 14', (done: Function) => {
        browser.load("/demos/testing/api-14.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "Ranges");
        done();
    });
    it('api testing spec 15', (done: Function) => {
        browser.load("/demos/testing/api-15.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "Ranges-1");
        done();
    });
    it('api testing spec 16', (done: Function) => {
        browser.load("/demos/testing/api-16.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "Ranges-2");
        done();
    });
    it('api testing spec 17', (done: Function) => {
        browser.load("/demos/testing/api-17.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "Ranges-3");
        done();
    });
    it('api testing spec 18', (done: Function) => {
        browser.load("/demos/testing/api-18.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "Ranges-Rangebar");
        done();
    });
    it('api testing spec 19', (done: Function) => {
        browser.load("/demos/testing/api-19.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "Overlap-Ranges-Rangebar");
        done();
    });
});