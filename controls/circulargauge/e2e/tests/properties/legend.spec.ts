/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('legend', () => {
    it('legend height',() => {
        browser.load("/demos/properties/legend.html");
        browser.compareScreen(element(By.id("legend-container")), "properties/legend");
        browser.findElement(By.id("legendbordercolor")).sendKeys("red"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_bordercolor");
        browser.findElement(By.id("legendborderwidth")).sendKeys("6"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_borderwidth");
        browser.findElement(By.id("legendheight")).sendKeys("150px"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_height");
    });

    it('legend width',() => {
        browser.load("/demos/properties/legend.html");
        browser.findElement(By.id("legendbordercolor")).sendKeys("red"+ Key.ENTER);
        browser.findElement(By.id("legendwidth")).sendKeys("100px"+ Key.ENTER);
        browser.findElement(By.id("legendborderwidth")).sendKeys("6"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_width");
        browser.findElement(By.id("legendbackground")).sendKeys("blue"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_background");
        browser.findElement(By.id("padding")).sendKeys("20"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_padding");
    });

    it('shape border color and width', () => {
        browser.load("/demos/properties/legend.html");
        browser.findElement(By.id("shapebordercolor")).sendKeys("black"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_shapebordercolor");
        browser.findElement(By.id("shapeborderwidth")).sendKeys("4"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_shapeborderwidth");
    });

    it('shape padding', () => {
        browser.load("/demos/properties/legend.html");
        browser.findElement(By.id("shapepadding")).sendKeys("15"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_shapepadding");
     });

    it('shape border color and width', () => {
        browser.load("/demos/properties/legend.html");
        browser.findElement(By.id("shapeheight")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_shapeheight");
    });

    it('shape border color and width', () => {
        browser.load("/demos/properties/legend.html");
        browser.findElement(By.id("shapewidth")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_shapewidth");
    });

    it('legend and shape padding', () => {
        browser.load("/demos/properties/legend.html");
        browser.findElement(By.id("padding")).sendKeys("20"+ Key.ENTER);
        browser.findElement(By.id("shapepadding")).sendKeys("15"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_shape_paddings");
    });

    it('shape padding with height', () => {
        browser.load("/demos/properties/legend.html");
        browser.findElement(By.id("shapepadding")).sendKeys("30"+ Key.ENTER);
        browser.findElement(By.id("shapeheight")).sendKeys("20"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_shapepadding_shapeheight");
    });

    it('shape padding with width', () => {
        browser.load("/demos/properties/legend.html");
        browser.findElement(By.id("shapepadding")).sendKeys("30"+ Key.ENTER);
        browser.findElement(By.id("shapewidth")).sendKeys("20"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_shapepadding_shapewidth");
    });

    it('legend height and width padding', () =>{
        browser.load("/demos/properties/legend.html");
        browser.findElement(By.id("legendheight")).sendKeys("150px"+ Key.ENTER);
        browser.findElement(By.id("legendwidth")).sendKeys("150px"+ Key.ENTER);
        browser.findElement(By.id("padding")).sendKeys("20"+ Key.ENTER);
        browser.compareScreen(element(By.id("legend-container")), "properties/legend_heightwidth_padding");
   });

   it('shape height and width and padding', () =>{
    browser.load("/demos/properties/legend.html");
    browser.findElement(By.id("shapepadding")).sendKeys("30"+ Key.ENTER);
    browser.findElement(By.id("shapeheight")).sendKeys("25"+ Key.ENTER);
    browser.findElement(By.id("shapewidth")).sendKeys("40"+ Key.ENTER);
    browser.compareScreen(element(By.id("legend-container")), "properties/legend_shapeheightwidth_padding");
});
});