/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('SB applewatchrings', () => {
    it('SB applewatchrings', () => {
        browser.load("/demos/SB/applewatchrings.html");
        browser.sleep(2000);
        browser.compareScreen(element(By.id("gauge")),"SB/applewatchrings");
    });
});