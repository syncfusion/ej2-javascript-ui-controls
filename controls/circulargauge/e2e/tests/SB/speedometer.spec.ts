/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

 describe('speedometer', () =>{
     it('speedometer', () => {
        browser.load("/demos/SB/speedometer.html");
        browser.compareScreen(element(By.id("container")), "SB/speedometer");
        browser.findElement(By.id("showText")).click();
        browser.compareScreen(element(By.id("container")), "SB/speedometer_showtext");
        browser.findElement(By.id("combineRange")).click();
        browser.compareScreen(element(By.id("container")), "SB/speedometer_showtext_combineranges");
        browser.findElement(By.id("combineRange")).click();
        browser.findElement(By.id("range")).click();
        browser.compareScreen(element(By.id("container")), "SB/speedometer_showtext_gapranges");
        browser.findElement(By.id("showText")).click();
        browser.compareScreen(element(By.id("container")), "SB/speedometer_number_gapranges");
        browser.findElement(By.id("range")).click();
        browser.findElement(By.id("combineRange")).click();
        browser.compareScreen(element(By.id("container")), "SB/speedometer_number_combineranges");
     });
 });