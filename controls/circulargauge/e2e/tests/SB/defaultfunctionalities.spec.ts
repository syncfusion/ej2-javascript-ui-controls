/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('SB default functionalities', () => {
    it('SB default Functionalities', () => {
        browser.load("/demos/SB/defaultfunctionalities.html");
        browser.compareScreen(element(By.id("gauge")),"SB/defaultfunctionalities");
    });
});