/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('annotations', () => {
    it('annotations', () => {
        browser.load("/demos/annotations/annotations_1.html");
        browser.compareScreen(element(By.id("element")), "annotations_1");
        browser.findElement(By.id("angle")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "annotations_1_angle");
        browser.findElement(By.id("autoangle")).click();
        browser.compareScreen(element(By.id("element")), "annotations_1_autoangle");
    });
    it('annotation radius', () => {
        browser.load("/demos/annotations/annotations_1.html");
        browser.findElement(By.id("annotationradius")).sendKeys("70"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "annotations_1_radius");
        browser.findElement(By.id("annotationtextcolor")).sendKeys("Red"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "annotations_1_textcolor");
    });  

    it('annotation font styles', () => {
        browser.load("/demos/annotations/annotations_1.html");
        browser.findElement(By.id("annotationfontfamily")).sendKeys("courier"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "annotations_1_fontfamily");
        browser.findElement(By.id("annotationfontstyle")).sendKeys("italic"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "annotations_1_fontstyle");
        browser.findElement(By.id("annotationtextsize")).sendKeys("40px"+ Key.ENTER);
        browser.compareScreen(element(By.id("element")), "annotations_1_fontsize");
    });  
});