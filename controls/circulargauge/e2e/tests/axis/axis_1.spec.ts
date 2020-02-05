/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('axis', () => {
    it('axis background', () => {
        browser.load("/demos/Axes/axis_1.html");
        browser.compareScreen(element(By.id("element")), "axis_1_background");
        browser.findElement(By.id("autoangle")).click();
        browser.compareScreen(element(By.id("element")), "axis_1_autoangle");
    });

    it('axis label formats', () => {
        // browser.findElement(By.id("labelstyleformat")).clear();
        browser.findElement(By.id("labelstyleformat")).sendKeys("n2");
        browser.compareScreen(element(By.id("element")), "axis_1_labelformat_n2");
        browser.findElement(By.id("labelstyleformat")).sendKeys("n1");
        browser.compareScreen(element(By.id("element")), "axis_1_labelformat_n1");
        // browser.findElement(By.id("labelstyleformat")).clear();
        browser.findElement(By.id("labelstyleformat")).sendKeys("n3");
        browser.compareScreen(element(By.id("element")), "axis_1_labelformat_n3");
        // browser.findElement(By.id("labelstyleformat")).clear();
        browser.findElement(By.id("labelstyleformat")).sendKeys("p1");
        browser.compareScreen(element(By.id("element")), "axis_1_labelformat_p1");
    
        browser.findElement(By.id("labelstyleformat")).sendKeys("p2");
        browser.compareScreen(element(By.id("element")), "axis_1_labelformat_p2");
    
        browser.findElement(By.id("labelstyleformat")).sendKeys("p3");
        browser.compareScreen(element(By.id("element")), "axis_1_labelformat_p3");
    
        browser.findElement(By.id("labelstyleformat")).sendKeys("c1");
        browser.compareScreen(element(By.id("element")), "axis_1_labelformat_c1");
   
        browser.findElement(By.id("labelstyleformat")).sendKeys("c2");
        browser.compareScreen(element(By.id("element")), "axis_1_labelformat_c2");
    });

    it('hidden label', () => {
        browser.load("/demos/Axes/axis_1.html");
        browser.findElement(By.id("hiddenlabel")).sendKeys("Last");
        browser.compareScreen(element(By.id("element")), "axis_1_hiddenlabel_last");
        browser.findElement(By.id("hiddenlabel")).sendKeys("First");
        browser.compareScreen(element(By.id("element")), "axis_1_hiddenlabel_First");
        browser.findElement(By.id("hiddenlabel")).sendKeys("None");
        browser.compareScreen(element(By.id("element")), "axis_1_hiddenlabel_None");
    });

    it('background color', () => {
        browser.load("/demos/Axes/axis_1.html");
        browser.findElement(By.id("backgroundcolor")).sendKeys("#7FFF00");
        browser.compareScreen(element(By.id("element")), "axis_1_backgroundcolor_1");
        browser.findElement(By.id("backgroundcolor")).sendKeys("#8A2BE2");
        browser.compareScreen(element(By.id("element")), "axis_1_backgroundcolor_2");
        browser.findElement(By.id("backgroundcolor")).sendKeys("#FF7F50");
        browser.compareScreen(element(By.id("element")), "axis_1_backgroundcolor_3");
    });

    it('linewidth', () => {
        browser.findElement(By.id("dasharray")).sendKeys("6,7"+ Key.ENTER);
        browser.findElement(By.id("linestylewidth")).sendKeys("4"+ Key.ENTER);
        browser.findElement(By.id("linestylecolor")).sendKeys("Green");
        browser.compareScreen(element(By.id("element")), "axis_1_linecolor1_dasharray");
        browser.findElement(By.id("linestylecolor")).sendKeys("Red");
        browser.compareScreen(element(By.id("element")), "axis_1_linecolor2_dasharray");
        browser.findElement(By.id("linestylecolor")).sendKeys("Blue");
        browser.compareScreen(element(By.id("element")), "axis_1_linecolor3_dasharray");
    })

    it('line color and width', () => {
        browser.load("/demos/Axes/axis_1.html");
        browser.findElement(By.id("linestylecolor")).sendKeys("Green");
        browser.compareScreen(element(By.id("element")), "axis_1_linecolor1");
        browser.findElement(By.id("linestylecolor")).sendKeys("Red");
        browser.compareScreen(element(By.id("element")), "axis_1_linecolor2");
        browser.findElement(By.id("linestylecolor")).sendKeys("Blue");
        browser.compareScreen(element(By.id("element")), "axis_1_linecolor3");
        browser.findElement(By.id("linestylewidth")).sendKeys("4"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "axis_1_linecolor_width");
    });

    it('label font weight and color', () => {
        browser.load("/demos/Axes/axis_1.html");
        browser.findElement(By.id("labelcolor")).clear();
        browser.findElement(By.id("labelcolor")).sendKeys("Red"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "axis_1_labelcolor");
        browser.findElement(By.id("labelsize")).clear();
        browser.findElement(By.id("labelsize")).sendKeys("25"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "axis_1_labelsize");
        browser.findElement(By.id("labelfontweight")).clear();
        browser.findElement(By.id("labelfontweight")).sendKeys("Bold"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "axis_1_labelfontweight");
    });
});