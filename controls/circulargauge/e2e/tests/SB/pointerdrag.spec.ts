/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('SB pointer drag', () => {
    it('SB pointer drag', () => {
        browser.load("/demos/SB/pointerdrag.html");
        browser.compareScreen(element(By.id("user-container")),"SB/pointerdrag");

        browser.findElement(By.id("value")).clear();
        browser.findElement(By.id("value")).sendKeys("36"+ Key.ENTER);
        browser.compareScreen(element(By.id("user-container")),"SB/pointerdrag_changevalue");

        browser.findElement(By.id("value")).clear();
        browser.findElement(By.id("value")).sendKeys("106"+ Key.ENTER);
        browser.compareScreen(element(By.id("user-container")),"SB/pointerdrag_changevalue1");
    });
});