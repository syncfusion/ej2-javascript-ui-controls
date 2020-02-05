
/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('title', () => {
    it('title',() => {
        browser.load("/demos/properties/title.html");
        browser.compareScreen(element(By.id("element")), "properties/title");
        browser.findElement(By.id("title")).sendKeys("Circular Gauge"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "properties/title_enter");
        browser.findElement(By.id("titlecolor")).sendKeys("Red"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "properties/title_color");
});
    it('title font family and styles', () => {
        browser.load("/demos/properties/title.html");
        browser.findElement(By.id("title")).sendKeys("Circular Gauge"+ Key.ENTER);
        browser.findElement(By.id("fontfamily")).sendKeys("courier"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "properties/title_fontfamily");
        browser.findElement(By.id("fontstyle")).sendKeys("oblique"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "properties/title_fontstyle");
        browser.findElement(By.id("fontweight")).sendKeys("bold"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "properties/title_fontweight");
        browser.findElement(By.id("fontsize")).sendKeys("40px"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "properties/title_fontsize");   
        browser.findElement(By.id("titleopacity")).clear();
        browser.findElement(By.id("titleopacity")).sendKeys("0.4"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "properties/title_opacity"); 
    });

    it('minimum and maximum', () => {
        browser.load("/demos/properties/title.html");
        browser.findElement(By.id("minimum")).clear();
        browser.findElement(By.id("minimum")).sendKeys("18"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "properties/title_minimum");
        browser.findElement(By.id("maximum")).clear();
        browser.findElement(By.id("maximum")).sendKeys("189"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "properties/title_maximum");
    });
});