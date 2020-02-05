/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('ranges', () => {
    it('ranges1  opaity and radius',() => {
        browser.load("/demos/properties/ranges.html");
        browser.compareScreen(element(By.id("range-container")), "properties/ranges");
        browser.findElement(By.id("opacity")).sendKeys("0.4"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")), "properties/ranges1_opacity");
        browser.findElement(By.id("radius")).sendKeys("70%"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")), "properties/ranges1_radius");
});
it('ranges2  opaity and radius',() => {
    browser.load("/demos/properties/ranges.html");
    browser.findElement(By.id("rangeSelect")).sendKeys("Medium");
    browser.findElement(By.id("opacity")).sendKeys("0.3"+ Key.ENTER);
    browser.compareScreen(element(By.id("range-container")), "properties/ranges2_opacity");
    browser.findElement(By.id("radius")).sendKeys("40%"+ Key.ENTER);
    browser.compareScreen(element(By.id("range-container")), "properties/ranges2_radius");
});
it('ranges3  opaity and radius',() => {
    browser.load("/demos/properties/ranges.html");
    browser.findElement(By.id("rangeSelect")).sendKeys("High");
    browser.findElement(By.id("opacity")).clear();
    browser.findElement(By.id("opacity")).sendKeys("0.3"+ Key.ENTER);
    browser.compareScreen(element(By.id("range-container")), "properties/ranges3_opacity");
    browser.findElement(By.id("radius")).clear();
    browser.findElement(By.id("radius")).sendKeys("110%"+ Key.ENTER);
    browser.compareScreen(element(By.id("range-container")), "properties/ranges3_radius");
});

it('change ranges radius', () => {
    browser.load("/demos/properties/ranges.html");
    browser.findElement(By.id("rangeSelect")).sendKeys("High");
    browser.findElement(By.id("radius")).clear();
    browser.findElement(By.id("radius")).sendKeys("50%"+ Key.ENTER);
    browser.findElement(By.id("rangeSelect")).sendKeys("Medium");
    browser.findElement(By.id("radius")).clear();
    browser.findElement(By.id("radius")).sendKeys("110%"+ Key.ENTER);
    browser.findElement(By.id("rangeSelect")).sendKeys("Low");
    browser.findElement(By.id("radius")).clear();
    browser.findElement(By.id("radius")).sendKeys("70%"+ Key.ENTER);
    browser.compareScreen(element(By.id("range-container")), "properties/ranges_radius");
});

it('change ranges opacity', () => {
    browser.load("/demos/properties/ranges.html");
    browser.findElement(By.id("rangeSelect")).sendKeys("High");
    browser.findElement(By.id("opacity")).clear();
    browser.findElement(By.id("opacity")).sendKeys("0.2"+ Key.ENTER);
    browser.findElement(By.id("rangeSelect")).sendKeys("Medium");
    browser.findElement(By.id("opacity")).clear();
    browser.findElement(By.id("opacity")).sendKeys("0.7"+ Key.ENTER);
    browser.findElement(By.id("rangeSelect")).sendKeys("Low");
    browser.findElement(By.id("opacity")).clear();
    browser.findElement(By.id("opacity")).sendKeys("0.4"+ Key.ENTER);
    browser.compareScreen(element(By.id("range-container")), "properties/ranges_opacity");
});
});