
/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('legendrendereent', () => {
    it('legendrenderevent1', () => {
        browser.load("/demos/events/legendrenderevent_1.html");
        browser.compareScreen(element(By.id("legend-container")), "events/legendrenderevent_legendshape");
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_4")).click();
        browser.compareScreen(element(By.id("legend-container")), "events/legendrenderevent_legendshape_legendclick");
    });
    it('legendrenderevent2', () => {
        browser.load("/demos/events/legendrenderevent_2.html");
        browser.compareScreen(element(By.id("legend-container")), "events/legendrenderevent_legendcolor");
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_2")).click();
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_0")).click();
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_1")).click();
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_4")).click();
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_5")).click();
        browser.compareScreen(element(By.id("legend-container")), "events/legendrenderevent_legendcolor_legendclick");
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_2")).click();
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_0")).click();
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_1")).click();
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_4")).click();
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_5")).click();
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_3")).click();
        browser.compareScreen(element(By.id("legend-container")), "events/legendrenderevent_legendcolor_legendclick1");
    });
    it('legendrenderevent3', () => {
        browser.load("/demos/events/legendrenderevent_3.html");
        browser.compareScreen(element(By.id("legend-container")), "events/legendrenderevent_legendname");
    });
    it('legendrenderevent_cancel', () => {
        browser.load("/demos/events/legendrenderevent_cancel.html");
        browser.compareScreen(element(By.id("legend-container")), "events/legendrenderevent_cancel");
    });
});

describe('radiusevent', () => {
    it('radius1', () => {
        browser.load("/demos/events/radiusevent_1.html");
        browser.compareScreen(element(By.id("legend-container")), "events/radiusevent_radius");
    });
    it('radiusevent midradius', () => {
        browser.load("/demos/events/radiusevent_2.html");
        browser.compareScreen(element(By.id("legend-container")), "events/radiusevent_midradius");
    });
    it('radiusevent cancel', () => {
        browser.load("/demos/events/radiusevent_cancel.html");
        browser.compareScreen(element(By.id("legend-container")), "events/radiusevent_cancel");
    });
});