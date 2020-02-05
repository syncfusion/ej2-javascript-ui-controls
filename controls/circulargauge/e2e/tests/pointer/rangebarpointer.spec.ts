
/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('Rangebarpointer', () => {
    it('Rangebarpointer', () => {
        browser.load("/demos/pointer/Rangebarpointer.html");
        browser.compareScreen(element(By.id("element")), "Rangebarpointer");
        browser.findElement(By.id("rangebarvalue")).clear();
        browser.findElement(By.id("rangebarvalue")).sendKeys("87"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "Rangebarpointer_valuechange");
       });

    it('Rangebarpointer color vs border vs cornerradius', () => {
        browser.load("/demos/pointer/Rangebarpointer.html");
        browser.findElement(By.id("rangebarcolor")).sendKeys("blue"+Key.ENTER);
        browser.compareScreen(element(By.id("element")), "rangebarpointer_color");
        browser.findElement(By.id("bordercolor")).sendKeys("red"+Key.ENTER);
        browser.findElement(By.id("borderwidth")).sendKeys("3"+Key.ENTER);
        browser.compareScreen(element(By.id("element")), "rangebarpointer_bordercolor");
        browser.findElement(By.id("roundedcornerradius")).sendKeys("10"+Key.ENTER);
        browser.compareScreen(element(By.id("element")), "rangebarpointer_cornerradius");

    });

  

    it('rangebarpointer tooltip', () => {
        browser.load("/demos/pointer/Rangebarpointer.html");
        browser.findElement(By.id("enabletooltip")).click();
        browser.actions().mouseMove(element(By.id("element_Axis_0_Pointer_RangeBar_0"))).perform().then(function() {
            browser.compareScreen(element(By.id("element")), "rangebarpointer_tooltip");
        });
      
   
        browser.findElement(By.id("tooltipbordercolor")).sendKeys("yellow"+ Key.ENTER);
        browser.actions().mouseMove(element(By.id("element_Axis_0_Pointer_RangeBar_0"))).perform().then(function() {
        browser.compareScreen(element(By.id("element")), "rangebarpopinter_tooltipborder");
    });
  
    browser.findElement(By.id("tooltipborderwidth")).sendKeys("4"+ Key.ENTER);
    browser.actions().mouseMove(element(By.id("element_Axis_0_Pointer_RangeBar_0"))).perform().then(function() {
    browser.compareScreen(element(By.id("element")), "rangebarpointer_tooltipborderwidth");
});

browser.findElement(By.id("tooltipfill")).sendKeys("red"+ Key.ENTER);
browser.actions().mouseMove(element(By.id("element_Axis_0_Pointer_RangeBar_0"))).perform().then(function() {
browser.compareScreen(element(By.id("element")), "rangebarpointer_tooltipfill");
});

});

it('pointerwidth and values', () => {
    browser.load("/demos/pointer/Rangebarpointer.html");
    browser.findElement(By.id("pointerwidth")).sendKeys("40"+ Key.ENTER);
    browser.compareScreen(element(By.id("element")), "rangebarpointer_pointerwidth");
    browser.findElement(By.id("roundedcornerradius")).sendKeys("10"+Key.ENTER);    
    browser.compareScreen(element(By.id("element")), "rangebarpointer_pointerwidth_cornerradius");
});

});