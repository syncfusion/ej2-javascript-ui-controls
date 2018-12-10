import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

if(browser.isDesktop===true){
    browser.driver.manage().window().setSize(1900, 1200);
}
describe('Maps Event samples test spec', () => {
    let tooltipElement;
    it('Annotation Event testing content', (done: Function) => {
        browser.load("/demos/annotationEvent-1.html");
        browser.compareScreen(element(By.id("container")), "AnnotationEvent-Content");
        done();
    });
    it('Annotation Event testing cancel true', (done: Function) => {
        browser.load("/demos/annotationEvent-2.html");
        browser.compareScreen(element(By.id("container")), "AnnotationEvent-Cancel");
        done();
    });
    it('Bubble click Event testing', (done: Function) => {
        browser.load("/demos/bubbleClick.html");
        tooltipElement = element(by.id('container_LayerIndex_0_BubbleIndex_0_dataIndex_2'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "BubbleClick_Event");
        done();
    });
    it('Bubble mousemove Event testing', (done: Function) => {
        browser.load("/demos/bubbleMouseMove.html");        
        browser.actions().mouseMove(element(by.id('container_LayerIndex_0_BubbleIndex_0_dataIndex_2'))).perform().then(function () {
            browser.compareScreen(element(By.id("container")), "BubbleMouseMove_Event");
        });
        done();
    });
    it('Bubble Event testing border checking', (done: Function) => {
        browser.load("/demos/bubbleEvent-2.html");
        browser.compareScreen(element(By.id("container")), "BubbleEvent-Border");
        done();
    });
    it('Bubble Event testing fill checking', (done: Function) => {
        browser.load("/demos/bubbleEvent-1.html");
        browser.compareScreen(element(By.id("container")), "BubbleEvent-Fill");
        done();
    });
    it('Bubble Event testing cx checking', (done: Function) => {
        browser.load("/demos/bubbleEvent-3.html");
        browser.compareScreen(element(By.id("container")), "BubbleEvent-CX");
        done();
    });
    it('Bubble Event testing cy checking', (done: Function) => {
        browser.load("/demos/bubbleEvent-4.html");
        browser.compareScreen(element(By.id("container")), "BubbleEvent-CY");
        done();
    });
    it('Bubble Event testing radius checking', (done: Function) => {
        browser.load("/demos/bubbleEvent-5.html");
        browser.compareScreen(element(By.id("container")), "BubbleEvent-Radius");
        done();
    });
    it('Click Event testing', (done: Function) => {
        browser.load("/demos/click.html");
        tooltipElement = element(by.id('container'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "Click_Event");
        done();
    });
    it('Datalabel rendering Event testing text', (done: Function) => {
        browser.load("/demos/datalabelEvent-1.html");
        browser.compareScreen(element(By.id("container")), "DataLabelEvent_Text");
        done();
    });
    it('Datalabel rendering Event testing visibility', (done: Function) => {
        browser.load("/demos/datalabelEvent-2.html");
        browser.compareScreen(element(By.id("container")), "DataLabelEvent_Visibility");
        done();
    });
    it('Datalabel rendering Event testing fill', (done: Function) => {
        browser.load("/demos/datalabelEvent-3.html");
        browser.compareScreen(element(By.id("container")), "DataLabelEvent_Fill");
        done();
    });
    it('Datalabel rendering Event testing border', (done: Function) => {
        browser.load("/demos/datalabelEvent-4.html");
        browser.compareScreen(element(By.id("container")), "DataLabelEvent_Border");
        done();
    });
    it('Datalabel rendering Event testing template', (done: Function) => {
        browser.load("/demos/datalabelEvent-5.html");
        browser.compareScreen(element(By.id("container")), "DataLabelEvent_Template");
        done();
    });
    it('Double click Event testing', (done: Function) => {
        browser.load("/demos/doubleClick.html");
        tooltipElement = element(by.id('container'));
        browser.actions().click(tooltipElement).perform();
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "DoubleClick_Event");
        done();
    });
    it('item highlight Event testing fill', (done: Function) => {
        browser.load("/demos/itemHighlight-1.html");        
        browser.actions().mouseMove(element(by.id('container_LayerIndex_0_ShapeIndex_2_dataIndex_26'))).perform().then(function () {
            browser.compareScreen(element(By.id("container")), "itemHighlightEvent_Fill");
        });
        done();
    });
    it('item highlight Event testing opacity', (done: Function) => {
        browser.load("/demos/itemHighlight-2.html");        
        browser.actions().mouseMove(element(by.id('container_LayerIndex_0_ShapeIndex_2_dataIndex_26'))).perform().then(function () {
            browser.compareScreen(element(By.id("container")), "itemHighlightEvent_Fill");
        });
        done();
    });
    it('item highlight Event testing border', (done: Function) => {
        browser.load("/demos/itemHighlight-3.html");        
        browser.actions().mouseMove(element(by.id('container_LayerIndex_0_ShapeIndex_2_dataIndex_26'))).perform().then(function () {
            browser.compareScreen(element(By.id("container")), "itemHighlightEvent_Border");
        });
        done();
    });
    it('item selection Event testing opacity', (done: Function) => {
        browser.load("/demos/itemSelection-1.html");
        tooltipElement = element(by.id('container_Level_Index_0_Item_Index_0_RectPath'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "itemSelectionEvent_opacity");
        done();
    });
    it('item selection Event testing border', (done: Function) => {
        browser.load("/demos/itemSelection-2.html");
        tooltipElement = element(by.id('container_Level_Index_0_Item_Index_0_RectPath'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "itemSelectionEvent_border");
        done();
    });
    it('item selection Event testing fill', (done: Function) => {
        browser.load("/demos/itemSelection.html");
        tooltipElement = element(by.id('container_Level_Index_0_Item_Index_0_RectPath'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "itemSelectionEvent_fill");
        done();
    });
    it('loaded Event testing', (done: Function) => {
        browser.load("/demos/loadedEvent.html");
        browser.compareScreen(element(By.id("container")), "LoadedEvent");
        done();
    });
    it('marker click Event testing fill', (done: Function) => {
        browser.load("/demos/markerClick.html");
        tooltipElement = element(by.id('container_LayerIndex_0_MarkerIndex_0_DataIndex_13'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "MarkerClickEvent");
        done();
    });
    it('marker Event testing height', (done: Function) => {
        browser.load("/demos/markerEvent-1.html");
        browser.compareScreen(element(By.id("container")), "MarkerEvent-height");
        done();
    });
    it('marker Event testing width', (done: Function) => {
        browser.load("/demos/markerEvent-2.html");
        browser.compareScreen(element(By.id("container")), "MarkerEvent-width");
        done();
    });
    it('marker Event testing shape', (done: Function) => {
        browser.load("/demos/markerEvent-3.html");
        browser.compareScreen(element(By.id("container")), "MarkerEvent-shape");
        done();
    });
    it('marker Event testing imageUrl', (done: Function) => {
        browser.load("/demos/markerEvent-4.html");
        browser.compareScreen(element(By.id("container")), "MarkerEvent-imageUrl");
        done();
    });
    it('marker Event testing border', (done: Function) => {
        browser.load("/demos/markerEvent-6.html");
        browser.compareScreen(element(By.id("container")), "MarkerEvent-border");
        done();
    });
    it('marker Event testing template', (done: Function) => {
        browser.load("/demos/markerEvent-7.html");
        browser.compareScreen(element(By.id("container")), "MarkerEvent-template");
        done();
    });
    it('maker mouse move Event testing border', (done: Function) => {
        browser.load("/demos/markerMove.html");        
        browser.actions().mouseMove(element(by.id('container_LayerIndex_0_MarkerIndex_0_DataIndex_13'))).perform().then(function () {
            browser.compareScreen(element(By.id("container")), "markermoveEvent");
        });
        done();
    });
    it('shape highlight Event testing fill', (done: Function) => {
        browser.load("/demos/shapeHighlight-1.html");        
        browser.actions().mouseMove(element(by.id('container_LayerIndex_0_ShapeIndex_2_dataIndex_26'))).perform().then(function () {
            browser.compareScreen(element(By.id("container")), "shapeHighlight-fill");
        });
        done();
    });
    it('shape highlight Event testing opacity', (done: Function) => {
        browser.load("/demos/shapeHighlight-2.html");        
        browser.actions().mouseMove(element(by.id('container_LayerIndex_0_ShapeIndex_2_dataIndex_26'))).perform().then(function () {
            browser.compareScreen(element(By.id("container")), "shapeHighlight-opacity");
        });
        done();
    });
    it('shape highlight Event testing border', (done: Function) => {
        browser.load("/demos/shapeHighlight-3.html");        
        browser.actions().mouseMove(element(by.id('container_LayerIndex_0_ShapeIndex_2_dataIndex_26'))).perform().then(function () {
            browser.compareScreen(element(By.id("container")), "shapeHighlight-border");
        });
        done();
    });
    it('shape selection Event testing fill', (done: Function) => {
        browser.load("/demos/shapeSelection-1.html");
        tooltipElement = element(by.id('container_Level_Index_0_Item_Index_0_RectPath'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "shapeSelection-fill");
        done();
    });
    it('shape selection Event testing opacity', (done: Function) => {
        browser.load("/demos/shapeSelection-2.html");
        tooltipElement = element(by.id('container_Level_Index_0_Item_Index_0_RectPath'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "shapeSelection-opacity");
        done();
    });
    it('shape selection Event testing border', (done: Function) => {
        browser.load("/demos/shapeSelection-3.html");
        tooltipElement = element(by.id('container_Level_Index_0_Item_Index_0_RectPath'));
        browser.actions().click(tooltipElement).perform();
        browser.compareScreen(element(By.id("container")), "shapeSelection-border");
        done();
    });
    it('shape rendering Event testing border', (done: Function) => {
        browser.load("/demos/shapeRendering-1.html");
        browser.compareScreen(element(By.id("container")), "shapeRendering-border");
        done();
    });
    it('shape rendering Event testing shape', (done: Function) => {
        browser.load("/demos/shapeRendering-2.html");
        browser.compareScreen(element(By.id("container")), "shapeRendering-shape");
        done();
    });
    it('shape rendering Event testing fill', (done: Function) => {
        browser.load("/demos/shapeRendering.html");
        browser.compareScreen(element(By.id("container")), "shapeRendering-fill");
        done();
    });
});