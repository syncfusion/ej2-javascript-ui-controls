import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

//if(browser.isDesktop===true){
//    browser.driver.manage().window().setSize(1900, 1200);
//}
describe('Treemap Event samples test spec', () => {
    let tooltipElement;
    it('tooltip Event testing text Style', (done: Function) => {
        browser.load("/demo/tooltipEvent-1.html");
        tooltipElement = element(by.id('container_Level_Index_0_Item_Index_0_RectPath'));
        browser.actions().mouseMove(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "TootlipEvent-TextStyle");
        done();
    });
    it('tooltip Event testing cancel true', (done: Function) => {
        browser.load("/demo/tooltipEvent.html");
        tooltipElement = element(by.id('container_Level_Index_0_Item_Index_0_RectPath'));
        browser.actions().mouseMove(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "TooltipEvent-Cancel");
        done();
    });
    it('click Event testing', (done: Function) => {
        browser.load("/demo/clickEvent.html");
        tooltipElement = element(by.id('container'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "Click_Event-Triggered");
        done();
    });
    it('drillEnd Event testing', (done: Function) => {
        browser.load("/demo/drillEnd-Event.html");
        tooltipElement = element(by.id('container_Level_Index_0_Item_Index_0_Text'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "DrillEnd_Event-Triggered");
        done();
    });
    it('itemClick Event testing', (done: Function) => {
        browser.load("/demo/itemClickEvent.html");
        tooltipElement = element(by.id('container_Level_Index_2_Item_Index_1_RectPath'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "ItemClick_Event-Triggered");
        done();
    });
    it('itemHighlight Event testing', (done: Function) => {
        browser.load("/demo/itemHighlight-Event.html");
        browser.actions().mouseMove(element(by.id('container_Level_Index_0_Item_Index_0_RectPath'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'ItemHighlight_Event-Triggered');
        });
        done();
    });
    it('itemMove Event testing', (done: Function) => {
        browser.load("/demo/itemMoveEvent.html");
        browser.actions().mouseMove(element(by.id('container_Level_Index_2_Item_Index_1_RectPath'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'ItemMove_Event-Triggered');
        });
        done();
    });
    it('itemSelection Event testing', (done: Function) => {
        browser.load("/demo/itemSelection-Event.html");
        tooltipElement = element(by.id('container_Level_Index_2_Item_Index_4_RectPath'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "ItemSelection_Event-Triggered");
        done();
    });
    it('mouseMove Event testing', (done: Function) => {
        browser.load("/demo/mouseMoveEvent.html");
        browser.actions().mouseMove(element(by.id('container'))).perform().then(function () {
            browser.compareScreen(element(By.id('container')), 'MouseMove_Event-Triggered');
        });
        done();
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
    let drillElement;
    it('TreeMap drilldown ', () => {
        browser.get(browser.basePath + '/demo/event_drilldown.html');
        drillElement = element(by.id('container_Level_Index_0_Item_Index_0_Text'));
        browser.actions().click(drillElement).perform();
        browser.compareScreen(element(By.id('container')), 'event_drilldown');
    });
});