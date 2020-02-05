/**
 * spec
 */

import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('margin', () => {
    it('margin bottom',() => {
        browser.load("/demos/properties/margin.html");
        browser.compareScreen(element(By.id("gauge")), "properties/margin");
        browser.findElement(By.id("marginbottom")).clear();
        browser.findElement(By.id("marginbottom")).sendKeys("50"+ Key.ENTER);
        browser.compareScreen(element(By.id("gauge")), "properties/margin_bottom");
});
it('margin top',() => {
    browser.load("/demos/properties/margin.html");
    browser.findElement(By.id("margintop")).clear();
    browser.findElement(By.id("margintop")).sendKeys("50"+ Key.ENTER);
    browser.compareScreen(element(By.id("gauge")), "properties/margin_top");
});   
it('margin left',() => {
    browser.load("/demos/properties/margin.html");
    browser.findElement(By.id("marginleft")).clear();
    browser.findElement(By.id("marginleft")).sendKeys("60"+ Key.ENTER);
    browser.compareScreen(element(By.id("gauge")), "properties/margin_left");
}); 
it('margin left',() => {
    browser.load("/demos/properties/margin.html");
    browser.findElement(By.id("marginright")).clear();
    browser.findElement(By.id("marginright")).sendKeys("80"+ Key.ENTER);
    browser.compareScreen(element(By.id("gauge")), "properties/margin_right");
}); 

it('bottom with top', () => {
    browser.load("/demos/properties/margin.html");
    browser.findElement(By.id("marginbottom")).clear();
    browser.findElement(By.id("marginbottom")).sendKeys("50"+ Key.ENTER);
    browser.findElement(By.id("margintop")).clear();
    browser.findElement(By.id("margintop")).sendKeys("70"+ Key.ENTER);
    browser.compareScreen(element(By.id("gauge")), "properties/margin_bottom_top");
});

it('bottom with left', () => {
    browser.load("/demos/properties/margin.html");
    browser.findElement(By.id("marginbottom")).clear();
    browser.findElement(By.id("marginbottom")).sendKeys("50"+ Key.ENTER);
    browser.findElement(By.id("marginleft")).clear();
    browser.findElement(By.id("marginleft")).sendKeys("70"+ Key.ENTER);
    browser.compareScreen(element(By.id("gauge")), "properties/margin_bottom_left");
});

it('bottom with right', () => {
    browser.load("/demos/properties/margin.html");
    browser.findElement(By.id("marginbottom")).clear();
    browser.findElement(By.id("marginbottom")).sendKeys("50"+ Key.ENTER);
    browser.findElement(By.id("marginright")).clear();
    browser.findElement(By.id("marginright")).sendKeys("80"+ Key.ENTER);
    browser.compareScreen(element(By.id("gauge")), "properties/margin_bottom_right");
});

it('top with left', () => {
    browser.load("/demos/properties/margin.html");
    browser.findElement(By.id("margintop")).clear();
    browser.findElement(By.id("margintop")).sendKeys("80"+ Key.ENTER);
    browser.findElement(By.id("marginleft")).clear();
    browser.findElement(By.id("marginleft")).sendKeys("80"+ Key.ENTER);
    browser.compareScreen(element(By.id("gauge")), "properties/margin_top_left");
});

it('top with right', () => {
    browser.load("/demos/properties/margin.html");
    browser.findElement(By.id("margintop")).clear();
    browser.findElement(By.id("margintop")).sendKeys("80"+ Key.ENTER);
    browser.findElement(By.id("marginright")).clear();
    browser.findElement(By.id("marginright")).sendKeys("80"+ Key.ENTER);
    browser.compareScreen(element(By.id("gauge")), "properties/margin_top_right");
});

it('left with right', () => {
    browser.load("/demos/properties/margin.html");
    browser.findElement(By.id("marginleft")).clear();
    browser.findElement(By.id("marginleft")).sendKeys("80"+ Key.ENTER);
    browser.findElement(By.id("marginright")).clear();
    browser.findElement(By.id("marginright")).sendKeys("80"+ Key.ENTER);
    browser.compareScreen(element(By.id("gauge")), "properties/margin_left_right");
});

it('margin with all', () =>{
    browser.load("/demos/properties/margin.html");
    browser.findElement(By.id("marginbottom")).clear();
    browser.findElement(By.id("marginbottom")).sendKeys("100"+ Key.ENTER);
    browser.findElement(By.id("margintop")).clear();
    browser.findElement(By.id("margintop")).sendKeys("70"+ Key.ENTER);
    browser.findElement(By.id("marginleft")).clear();
    browser.findElement(By.id("marginleft")).sendKeys("80"+ Key.ENTER);
    browser.findElement(By.id("marginright")).clear();
    browser.findElement(By.id("marginright")).sendKeys("100"+ Key.ENTER);
    browser.compareScreen(element(By.id("gauge")), "properties/margin_all");
});
});