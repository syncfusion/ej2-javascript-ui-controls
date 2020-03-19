import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('Sparkline Event samples test spec', () => {
    let tooltipElement;
    it('loaded Event testing text Style', (done: Function) => {
        browser.load("/demos/sparkline/loadedEvent.html");
        browser.compareScreen(element(By.id("container")), "LoadedEvent_Triggerd");
        done();
    });
    it('tooltip Event testing text changes', (done: Function) => {
        browser.load("/demos/sparkline/tooltipEvent.html");
        tooltipElement = element(by.id('container_sparkline_column_0'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "TooltipEvent-Text");
        done();
    });
    it('tooltip Event testing  textStyle changes', (done: Function) => {
        browser.load("/demos/sparkline/tooltipEvent-1.html");
        tooltipElement = element(by.id('container_sparkline_column_0'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "TooltipEvent-TextStyle");
        done();
    });
    it('tooltip Event testing  cancel true', (done: Function) => {
        browser.load("/demos/sparkline/tooltipEvent-2.html");
        tooltipElement = element(by.id('container_sparkline_column_0'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "TooltipEvent-Cancel");
        done();
    });
    it('series rendering Event testing fill change', (done: Function) => {
        browser.load("/demos/sparkline/seriesEvent-1.html");
        browser.compareScreen(element(By.id("container")), "SeriesEvent-Fill");
        done();
    });
    it('series rendering Event testing lineWidth change', (done: Function) => {
        browser.load("/demos/sparkline/seriesEvent-2.html");
        browser.compareScreen(element(By.id("container")), "SeriesEvent-LineWidth");
        done();
    });
    it('series rendering Event testing border change', (done: Function) => {
        browser.load("/demos/sparkline/seriesEvent-3.html");
        browser.compareScreen(element(By.id("container")), "SeriesEvent-Border");
        done();
    });
    it('point rendering Event testing fill change', (done: Function) => {
        browser.load("/demos/sparkline/pointEvent.html");
        browser.compareScreen(element(By.id("container")), "PointEvent-Fill");
        done();
    });
    it('point rendering Event testing border change', (done: Function) => {
        browser.load("/demos/sparkline/pointEvent-1.html");
        browser.compareScreen(element(By.id("container")), "PointEvent-Border");
        done();
    });
    it('point rendering Event testing cancel change', (done: Function) => {
        browser.load("/demos/sparkline/pointEvent-2.html");
        browser.compareScreen(element(By.id("container")), "PointEvent-Cancel");
        done();
    });
    it('pointRegion mousemove Event testing', (done: Function) => {
        browser.load("/demos/sparkline/pointMouseMove.html");
        browser.actions().mouseMove(element(by.id('container_sparkline_column_3'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'pointMouseMoveEvent-Triggered');
        });
        done();
    });
    it('pointRegion mouseclick Event testing', (done: Function) => {
        browser.load("/demos/sparkline/pointMouseClick.html");
        tooltipElement = element(by.id('container_sparkline_column_3'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "pointMouseClickEvent-Triggered");
        done();
    });
    it('sparkline mousemove Event testing', (done: Function) => {
        browser.load("/demos/sparkline/mouseMove.html");
        browser.actions().mouseMove(element(by.id('container_sparkline_column_3'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'sparklineMouseMoveEvent-Triggered');
        });
        done();
    });
    it('sparkline mouseclick Event testing', (done: Function) => {
        browser.load("/demos/sparkline/mouseClick.html");
        tooltipElement = element(by.id('container_sparkline_column_3'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "sparklineMouseClickEvent-Triggered");
        done();
    });
    it('data label rendering Event testing text change', (done: Function) => {
        browser.load("/demos/sparkline/datalabelEvent-1.html");
        browser.compareScreen(element(By.id("container")), "DatalabelEvent-Text");
        done();
    });
    it('data label rendering Event testing x and y location change', (done: Function) => {
        browser.load("/demos/sparkline/datalabelEvent-2.html");
        browser.compareScreen(element(By.id("container")), "DatalabelEvent-XY_Location");
        done();
    });
    it('data label rendering Event testing fill change', (done: Function) => {
        browser.load("/demos/sparkline/datalabelEvent-3.html");
        browser.compareScreen(element(By.id("container")), "DatalabelEvent-Fill");
        done();
    });
    it('data label rendering Event testing color change', (done: Function) => {
        browser.load("/demos/sparkline/datalabelEvent-4.html");
        browser.compareScreen(element(By.id("container")), "DatalabelEvent-Color");
        done();
    });
    it('data label rendering Event testing border change', (done: Function) => {
        browser.load("/demos/sparkline/datalabelEvent-5.html");
        browser.compareScreen(element(By.id("container")), "DatalabelEvent-Border");
        done();
    });
    it('data label rendering Event testing cancel true', (done: Function) => {
        browser.load("/demos/sparkline/datalabelEvent-6.html");
        browser.compareScreen(element(By.id("container")), "DatalabelEvent-Cancel");
        done();
    });
    it('marker rendering Event testing x and y location change', (done: Function) => {
        browser.load("/demos/sparkline/markerEvent-1.html");
        browser.compareScreen(element(By.id("container")), "MarkerEvent-XY_Lacation");
        done();
    });
    it('marker rendering Event testing size change', (done: Function) => {
        browser.load("/demos/sparkline/markerEvent-2.html");
        browser.compareScreen(element(By.id("container")), "MarkerEvent-Size");
        done();
    });
    it('marker rendering Event testing border change', (done: Function) => {
        browser.load("/demos/sparkline/markerEvent-3.html");
        browser.compareScreen(element(By.id("container")), "MarkerEvent-Border");
        done();
    });
    it('marker rendering Event testing cancel change', (done: Function) => {
        browser.load("/demos/sparkline/markerEvent-4.html");
        browser.compareScreen(element(By.id("container")), "MarkerEvent-Cancel");
        done();
    });
    it('axis rendering Event testing maxY change', (done: Function) => {
        browser.load("/demos/sparkline/axisLabelEvent.html");
        browser.compareScreen(element(By.id("container")), "AxisLabelEvent-maxY");
        done();
    });
    it('axis rendering Event testing minY change', (done: Function) => {
        browser.load("/demos/sparkline/axisLabelEvent-1.html");
        browser.compareScreen(element(By.id("container")), "AxisLabelEvent-minY");
        done();
    });
    it('axis rendering Event testing minX change', (done: Function) => {
        browser.load("/demos/sparkline/axisLabelEvent-2.html");
        browser.compareScreen(element(By.id("container")), "AxisLabelEvent-minX");
        done();
    });
    it('axis rendering Event testing maxX change', (done: Function) => {
        browser.load("/demos/sparkline/axisLabelEvent-3.html");
        browser.compareScreen(element(By.id("container")), "AxisLabelEvent-maxX");
        done();
    });
    it('axis rendering Event testing lineColor change', (done: Function) => {
        browser.load("/demos/sparkline/axisLabelEvent-4.html");
        browser.compareScreen(element(By.id("container")), "AxisLabelEvent-LineColor");
        done();
    });
    it('axis rendering Event testing lineWidth change', (done: Function) => {
        browser.load("/demos/sparkline/axisLabelEvent-5.html");
        browser.compareScreen(element(By.id("container")), "AxisLabelEvent-LineWidth");
        done();
    });
    it('axis rendering Event testing value change', (done: Function) => {
        browser.load("/demos/sparkline/axisLabelEvent-6.html");
        browser.compareScreen(element(By.id("container")), "AxisLabelEvent-Value");
        done();
    });
});
