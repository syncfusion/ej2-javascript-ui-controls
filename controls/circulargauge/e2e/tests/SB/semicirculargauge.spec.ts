/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('SB semi circular gauge', () => {
    it('SB semi circular gauge', () => {
        browser.load("/demos/SB/semicirculargauge.html");
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge");
        browser.findElement(By.id("angle")).click();
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_radius_basedonangle");
        browser.findElement(By.id("startangle")).clear();
        browser.findElement(By.id("startangle")).sendKeys("120"+ Key.ENTER);
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_radius_startangle");
        browser.findElement(By.id("endangle")).clear();
        browser.findElement(By.id("endangle")).sendKeys("180"+Key.ENTER);
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_radius_endangle");
    });


    it('hide intersecting label', () => {
        browser.load("/demos/SB/semicirculargauge.html");
        browser.findElement(By.id("startangle")).clear();
        browser.findElement(By.id("startangle")).sendKeys("300"+ Key.ENTER);
        browser.findElement(By.id("endangle")).clear();
        browser.findElement(By.id("endangle")).sendKeys("30"+ Key.ENTER);
        browser.findElement(By.id("hidelabel")).click();
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_intersecting_labels");
        browser.findElement(By.id("hidelabel")).click();
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_hide_intersecting_labels");
    });

    it('start end angle', () => {
        browser.load("/demos/SB/semicirculargauge.html");
        browser.findElement(By.id("startangle")).clear();
        browser.findElement(By.id("startangle")).sendKeys("200"+Key.ENTER);
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_start_angle");
        browser.refresh();
        browser.findElement(By.id("endangle")).clear();
        browser.findElement(By.id("endangle")).sendKeys("50%"+ Key.ENTER);
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_end_angle");
    });


    it('center x and y', () => {
        browser.load("/demos/SB/semicirculargauge.html");
        browser.findElement(By.id("centerX")).clear();
        browser.findElement(By.id("centerX")).sendKeys("80%"+ Key.ENTER);
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_centerX");
        browser.refresh();
        browser.findElement(By.id("centerY")).clear();
        browser.findElement(By.id("centerY")).sendKeys("90%"+ Key.ENTER);
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_cnterY");
    });

    it('radius', () => {
        browser.load("/demos/SB/semicirculargauge.html");
        browser.findElement(By.id("radius")).clear();
        browser.findElement(By.id("radius")).sendKeys("60%"+ Key.ENTER);
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_radius");
        browser.findElement(By.id("startangle")).clear();
        browser.findElement(By.id("startangle")).sendKeys("170"+Key.ENTER);
        browser.findElement(By.id("endangle")).clear();
        browser.findElement(By.id("endangle")).sendKeys("70"+ Key.ENTER);
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_radius_startend_angle");
        browser.findElement(By.id("centerX")).clear();
        browser.findElement(By.id("centerX")).sendKeys("30%"+Key.ENTER);
        browser.findElement(By.id("centerY")).clear();
        browser.findElement(By.id("centerY")).sendKeys("90%"+ Key.ENTER);
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_radius_center_XY");
        browser.findElement(By.id("angle")).click();
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_center_XY_radiusbasedon_angle");
    });

    it('center XY with based on radius', () => {
        browser.load("/demos/SB/semicirculargauge.html");
        browser.findElement(By.id("centerX")).clear();
        browser.findElement(By.id("centerX")).sendKeys("80%"+Key.ENTER);
        browser.findElement(By.id("centerY")).clear();
        browser.findElement(By.id("centerY")).sendKeys("40%"+ Key.ENTER);
        browser.findElement(By.id("angle")).click();
        browser.compareScreen(element(By.id("gauge")),"SB/semicirculargauge_center_XY_angle");
    });
});