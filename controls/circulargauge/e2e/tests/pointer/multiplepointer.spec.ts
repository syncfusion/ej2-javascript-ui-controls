/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('SB multiple pointers', () => {
    it('SB multiple pointers', () => {
        browser.load("/demos/pointer/multiplepointer.html");
        browser.compareScreen(element(By.id("element")),"SB/multiplepointers");
    });
});