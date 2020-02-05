/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('SB legend', () => {
    it('SB legend and position', () => {
        browser.load("/demos/SB/legend.html");
        browser.compareScreen(element(By.id("legend-container")),"SB/legend_Bottom");
       
        browser.findElement(By.id("position")).sendKeys("Auto");
        browser.compareScreen(element(By.id("legend-container")),"SB/legend_Auto");
       
        browser.findElement(By.id("position")).sendKeys("Top");
        browser.compareScreen(element(By.id("legend-container")),"SB/legend_Top");
       
        browser.findElement(By.id("position")).sendKeys("Left");
        browser.compareScreen(element(By.id("legend-container")),"SB/legend_Left");
       
        browser.findElement(By.id("position")).sendKeys("Right");
        browser.compareScreen(element(By.id("legend-container")),"SB/legend_Right");
    });

    it('SB legend sahpe and show legend', () => {
        browser.load("/demos/SB/legend.html");
        let legend = element(By.id("enable"));
        legend.click();
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_disable");
       
        browser.findElement(By.id("shape")).sendKeys("Rectangle");
        legend.click();   
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_rectangle");
       
        browser.findElement(By.id("shape")).sendKeys("Circle");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_circle");
       
        browser.findElement(By.id("shape")).sendKeys("Triangle");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Triangle");

        browser.findElement(By.id("shape")).sendKeys("Inverted triangle");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_InvertedTriangle");

        browser.findElement(By.id("shape")).sendKeys("Diamond");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Diamond");     
      
    });

    it('SB label Bottom Alignment', () => {
        browser.load("/demos/SB/legend.html");       
        browser.findElement(By.id("alignment")).sendKeys("Near");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_bottom_near");

        browser.findElement(By.id("alignment")).sendKeys("Far");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_bottom_Far");
       
        browser.findElement(By.id("alignment")).sendKeys("Center");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_bottom_Center");
    });

    it('SB label Left Alignment', () => {
        browser.load("/demos/SB/legend.html");       
        browser.findElement(By.id("position")).sendKeys("Left");       
        browser.findElement(By.id("alignment")).sendKeys("Near");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Left_near");
       
        browser.findElement(By.id("alignment")).sendKeys("Far");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Left_Far");
       
        browser.findElement(By.id("alignment")).sendKeys("Center");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Left_Center");
    });

    it('SB label Top Alignment', () => {
        browser.load("/demos/SB/legend.html");       
        browser.findElement(By.id("position")).sendKeys("Top");       
        browser.findElement(By.id("alignment")).sendKeys("Near");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Top_near");
       
        browser.findElement(By.id("alignment")).sendKeys("Far");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Top_Far");
       
        browser.findElement(By.id("alignment")).sendKeys("Center");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Top_Center");
    });

    it('SB label Right Alignment', () => {
        browser.load("/demos/SB/legend.html");       
        browser.findElement(By.id("position")).sendKeys("Right");       
        browser.findElement(By.id("alignment")).sendKeys("Near");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Right_near");
       
        browser.findElement(By.id("alignment")).sendKeys("Far");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Right_Far");
       
        browser.findElement(By.id("alignment")).sendKeys("Center");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Right_Center");
    });

    it('SB label Auto Alignment', () => {
        browser.load("/demos/SB/legend.html");       
        browser.findElement(By.id("position")).sendKeys("Auto");       
        browser.findElement(By.id("alignment")).sendKeys("Near");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Auto_near");
       
        browser.findElement(By.id("alignment")).sendKeys("Far");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Auto_Far");
       
        browser.findElement(By.id("alignment")).sendKeys("Center");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_Auto_Center");
    });

    it('SB toggle', () => {
        browser.load("/demos/SB/legend.html");
        browser.findElement(By.id("toggle")).click();
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_4")).click();
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_toggle_disable");
        browser.findElement(By.id("toggle")).click();
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_4")).click();
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_toggle_enable");       
        browser.findElement(By.id("shape")).sendKeys("Diamond");
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_toggle_enable_diamond");
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_4")).click();
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_toggle_enable1");
    });

    it('show legend with toggle', () => {
        browser.load("/demos/SB/legend.html");
        browser.findElement(By.id("toggle")).click();
        browser.findElement(By.id("legend-container_gauge_legend_Axis_0_text_4")).click();
        browser.findElement(By.id("enable")).click();
        browser.compareScreen(element(By.id("legend-container")), "SB/legend_toggle_dhowlegend");
    });
});