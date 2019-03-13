import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('CircularGuage Event samples test spec', () => {
    let tooltipElement;
    it('Event testing spec 1', (done: Function) => {
        browser.load("/demos/testing/event-1.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "LoadEvent-Gauge-Size");
        done();
    });
    it('Event testing spec 2', (done: Function) => {
        browser.load("/demos/testing/event-2.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "AxisLabelEvent-RangeColor");
        done();
    });
    it('Event testing spec 3', (done: Function) => {
        browser.load("/demos/testing/event-3.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "AnnotationEvent-Annotation");
        done();
    });
    it('Event testing spec 4', (done: Function) => {
        browser.load("/demos/testing/event-4.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "LoadEvent-Background-Color");
        done();
    });
    it('Event testing spec 5', (done: Function) => {
        browser.load("/demos/testing/event-5.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "LoadEvent-Public-AnnotationValue");
        done();
    });
    it('Event testing spec 6', (done: Function) => {
        browser.load("/demos/testing/event-6.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "LoadEvent-Public-PointerValue");
        done();
    });
    it('Event testing spec 7', (done: Function) => {
        browser.load("/demos/events/axistext.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "AxisLabelRenderEvent-Text");
        done();
    });
    it('Axis Label Render Event testing spec 7', (done: Function) => {
        browser.load("/demos/events/axistext-1.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "AxisLabelRenderEvent-Cancel");
        done();
    });
    it('Event testing spec 8', (done: Function) => {
        browser.load("/demos/events/annotationText.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "AnnotationRenderEvent-Text");
        done();
    });
    it('Annotation Event testing Cancel true', (done: Function) => {
        browser.load("/demos/events/annotationText-1.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("static-gauge")), "AnnotationRenderEvent-Cancel");
        done();
    });
    it('Event testing spec 9', (done: Function) => {
        browser.load("/demos/events/tooltipEvent-1.html");
        tooltipElement = element(by.id('static-gauge_Axis_0_Pointer_NeedleRect_0'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("static-gauge")), "TooltipRenderEvent-Content");
        done();
    });
    it('Event testing spec 10', (done: Function) => {
        browser.load("/demos/events/tooltipEvent-2.html");
        tooltipElement = element(by.id('static-gauge_Axis_0_Pointer_NeedleRect_0'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("static-gauge")), "TooltipRenderEvent-TextStyle");
        done();
    });
    it('Event testing spec 11', (done: Function) => {
        browser.load("/demos/events/tooltipEvent-3.html");
        tooltipElement = element(by.id('static-gauge_Axis_0_Pointer_NeedleRect_0'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("static-gauge")), "TooltipRenderEvent-Template");
        done();
    });
    it('Event testing spec 12', (done: Function) => {
        browser.load("/demos/events/tooltipEvent-4.html");
        tooltipElement = element(by.id('static-gauge_Axis_0_Pointer_NeedleRect_0'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("static-gauge")), "TooltipRenderEvent-Location");
        done();
    });
    it('Event testing spec 13', (done: Function) => {
        browser.load("/demos/events/tooltipEvent-5.html");
        tooltipElement = element(by.id('static-gauge_Axis_0_Pointer_NeedleRect_0'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("static-gauge")), "TooltipRenderEvent-ShowAtMousePosition");
        done();
    });
    it('Event testing spec 14', (done: Function) => {
        browser.load("/demos/events/tooltipEvent-6.html");
        tooltipElement = element(by.id('static-gauge_Axis_0_Pointer_NeedleRect_0'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("static-gauge")), "TooltipRenderEvent-Cancel");
        done();
    });
});