import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Custom samples test spec', () => {
    let property;
    it('Custom Guage sample', (done: Function) => {
        browser.load("/demos/default/custom-gauge.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("cutomization-container")), "custom_default");
        done();
    });
    it('Custom Guage bar color 1 sample', (done: Function) => {
        property = element(by.id('barColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("cutomization-container")), "custom_bar-color-1");
        done();
    });
    it('Custom Guage bar color 2 sample', (done: Function) => {
        property = element(by.id('barColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("cutomization-container")), "custom_bar-color-2");
        done();
    });
    it('Custom Guage range color 1 sample', (done: Function) => {
        property = element(by.id('rangeColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("cutomization-container")), "custom_range-color-1");
        done();
    });
    it('Custom Guage range color 2 sample', (done: Function) => {
        property = element(by.id('rangeColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("cutomization-container")), "custom_range-color-2");
        done();
    });
    it('Custom Guage pointer color 1 sample', (done: Function) => {
        property = element(by.id('pointerColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("cutomization-container")), "custom_pointer-color-1");
        done();
    });
    it('Custom Guage pointer color 2 sample', (done: Function) => {
        property = element(by.id('pointerColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("cutomization-container")), "custom_pointer-color-2");
        done();
    });
    it('Custom Guage 2 sample', (done: Function) => {
        property = element(by.id('usage'));
        property.click();
        browser.compareScreen(element(By.id("cutomization-container")), "custom_gauge-2");
        done();
    });
    it('Custom Guage 2 bar color 1 sample', (done: Function) => {
        property = element(by.id('barColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("cutomization-container")), "custom_gauge-2-bar-color-1");
        done();
    });
    it('Custom Guage 2 bar color 2 sample', (done: Function) => {
        property = element(by.id('barColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("cutomization-container")), "custom_gauge-2-bar-color-2");
        done();
    });
    it('Custom Guage 2 range color 1 sample', (done: Function) => {
        property = element(by.id('rangeColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("cutomization-container")), "custom_gauge-2-range-color-1");
        done();
    });
    it('Custom Guage 2range color 2 sample', (done: Function) => {
        property = element(by.id('rangeColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("cutomization-container")), "custom_gauge-2-range-color-2");
        done();
    });
    it('Custom Guage 2 pointer color 1 sample', (done: Function) => {
        property = element(by.id('pointerColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[1].click();
        });
        browser.compareScreen(element(By.id("cutomization-container")), "custom_gauge-2-pointer-color-1");
        done();
    });
    it('Custom Guage 2 pointer color 2 sample', (done: Function) => {
        property = element(by.id('pointerColor'));
        property.all(by.tagName('option'))
        .then((options: any) => {
            options[2].click();
        });
        browser.compareScreen(element(By.id("cutomization-container")), "custom_gauge-2-pointer-color-2");
        done();
    });
});