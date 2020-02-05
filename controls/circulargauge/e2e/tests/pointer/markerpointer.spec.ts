/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('Markerpointer', () => {
    it('Markerpointers', () => {
        browser.load("/demos/pointer/Markerpointers.html");
        browser.compareScreen(element(By.id("element")), "markerpointer_circle");
        browser.findElement(By.id("markershape")).sendKeys("Rectangle"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_rectangle");
        browser.findElement(By.id("markershape")).sendKeys("Triangle"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_triangle");
        browser.findElement(By.id("markershape")).sendKeys("InvertedTriangle"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_InvertedTriangle");
        browser.findElement(By.id("markershape")).sendKeys("Diamond"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_Diamond");
       });

    it('MarkerPointers_height and width', () => {
        browser.load("/demos/pointer/Markerpointers.html");
        browser.findElement(By.id("markerheight")).clear();
        browser.findElement(By.id("markerheight")).sendKeys("25"+Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_height");
        browser.findElement(By.id("markerwidth")).clear();
        browser.findElement(By.id("markerwidth")).sendKeys("25"+Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_Width");
    });

    it('MarkerPointers_markercolor', () => {
        browser.findElement(By.id("markercolor")).sendKeys("Black"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_circle_color");
        browser.findElement(By.id("markershape")).sendKeys("Rectangle"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_rectangle_color");
        browser.findElement(By.id("markershape")).sendKeys("Triangle"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_triangle_color");
        browser.findElement(By.id("markershape")).sendKeys("InvertedTriangle"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_InvertedTriangle_color");
        browser.findElement(By.id("markershape")).sendKeys("Diamond"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_Diamond_color");
    });


    it('MarkerPointers_bordercolor_width', () => {
        browser.findElement(By.id("markerbordercolor")).sendKeys("yellow"+ Key.ENTER);
        browser.findElement(By.id("markerborderwidth")).sendKeys("3"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_circle_color_border");
        browser.findElement(By.id("markershape")).sendKeys("Rectangle"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_rectangle_color_border");
        browser.findElement(By.id("markershape")).sendKeys("Triangle"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_triangle_color_border");
        browser.findElement(By.id("markershape")).sendKeys("InvertedTriangle"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_InvertedTriangle_color_border");
        browser.findElement(By.id("markershape")).sendKeys("Diamond"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "markerpointer_Diamond_color_border");
    });


    it('markerpointer tooltip', () => {
        browser.load("/demos/pointer/Markerpointers.html");
        browser.findElement(By.id("markerheight")).clear();
        browser.findElement(By.id("markerheight")).sendKeys("25"+Key.ENTER);
        browser.findElement(By.id("markerwidth")).clear();
        browser.findElement(By.id("markerwidth")).sendKeys("25"+Key.ENTER);

        browser.findElement(By.id("enabletooltip")).click();
        browser.actions().mouseMove(element(By.id("element_Axis_0_Pointer_Marker_0"))).perform().then(function() {
            browser.compareScreen(element(By.id("element")), "markerpointer_tooltip");
        });
      
   
        browser.findElement(By.id("tooltipbordercolor")).sendKeys("Blue"+ Key.ENTER);
        browser.actions().mouseMove(element(By.id("element_Axis_0_Pointer_Marker_0"))).perform().then(function() {
        browser.compareScreen(element(By.id("element")), "markerpointer_tooltipborder");
    });
  
    browser.findElement(By.id("tooltipborderwidth")).sendKeys("4"+ Key.ENTER);
    browser.actions().mouseMove(element(By.id("element_Axis_0_Pointer_Marker_0"))).perform().then(function() {
    browser.compareScreen(element(By.id("element")), "markerpointer_tooltipborderwidth");
});

browser.findElement(By.id("tooltipfill")).sendKeys("red"+ Key.ENTER);
browser.actions().mouseMove(element(By.id("element_Axis_0_Pointer_Marker_0"))).perform().then(function() {
browser.compareScreen(element(By.id("element")), "markerpointer_tooltipfill");
});

});

it('marker pointer value change', () => {
    browser.load("/demos/pointer/Markerpointers.html");
    browser.findElement(By.id("markervalue")).sendKeys("50"+ Key.ENTER);
    browser.compareScreen(element(By.id("element")), "markerpointer_changevalue");
});
});