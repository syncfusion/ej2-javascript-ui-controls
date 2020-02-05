/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('SB tooltip', () => {
    it('SB tooltip', () => {
        browser.load("/demos/SB/tooltip.html");
        browser.compareScreen(element(By.id("tooltip-container")),"SB/tooltip");
        browser.actions().mouseMove(element(By.id("tooltip-container_Axis_0_Pointer_NeedleRect_0"))).perform().then(function() {
            browser.compareScreen(element(By.id("tooltip-container")),"SB/tooltip_pointer");
        });
        browser.actions().mouseMove(element(By.id("tooltip-container_Axis_0_Range_0"))).perform().then(function() {
            browser.compareScreen(element(By.id("tooltip-container")),"SB/tooltip_range");
        });
    });
});