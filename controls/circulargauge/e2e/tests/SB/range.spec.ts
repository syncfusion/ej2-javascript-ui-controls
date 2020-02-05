/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('SB range', () => {
    it('SB low range', () => {
        browser.load("/demos/SB/range.html");
        browser.compareScreen(element(By.id("range-container")),"SB/range");
        browser.findElement(By.id("startWidth")).clear();
        browser.findElement(By.id("startWidth")).sendKeys("20"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_low_startwidth");
        browser.findElement(By.id("endWidth")).clear();
        browser.findElement(By.id("endWidth")).sendKeys("10"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_low_endWidth");
        browser.findElement(By.id("start")).clear();
        browser.findElement(By.id("start")).sendKeys("20"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_low_startrange");
        browser.findElement(By.id("end")).clear();
        browser.findElement(By.id("end")).sendKeys("60"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_low_endrange");
        browser.findElement(By.id("radius")).clear();
        browser.findElement(By.id("radius")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_low_cornerradius");
        browser.findElement(By.id("rangeColor")).sendKeys("#FFDD00");
        browser.compareScreen(element(By.id("range-container")),"SB/range_low_rangecolor");
        browser.findElement(By.id("enable")).click();
        browser.compareScreen(element(By.id("range-container")),"SB/range_low_fontcolor");
    });

    it('SB medium range', () => {
        browser.load("/demos/SB/range.html");
        browser.findElement(By.id("rangeSelect")).sendKeys("Medium");
        browser.findElement(By.id("startWidth")).clear();
        browser.findElement(By.id("startWidth")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_medium_startwidth");
        browser.findElement(By.id("endWidth")).clear();
        browser.findElement(By.id("endWidth")).sendKeys("20"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_medium_endWidth");
        browser.findElement(By.id("start")).clear();
        browser.findElement(By.id("start")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_medium_startrange");
        browser.findElement(By.id("end")).clear();
        browser.findElement(By.id("end")).sendKeys("40"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_medium_endrange");
        browser.findElement(By.id("radius")).clear();
        browser.findElement(By.id("radius")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_medium_cornerradius");
        browser.findElement(By.id("rangeColor")).sendKeys("#30B32D");
        browser.compareScreen(element(By.id("range-container")),"SB/range_medium_rangecolor");
        browser.findElement(By.id("enable")).click();
        browser.compareScreen(element(By.id("range-container")),"SB/range_medium_fontcolor");
    });

    it('Highrange', () => {
        browser.load("/demos/SB/range.html");
        browser.findElement(By.id("rangeSelect")).sendKeys("High");
        browser.findElement(By.id("startWidth")).clear();
        browser.findElement(By.id("startWidth")).sendKeys("20"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_high_startwidth");
        browser.findElement(By.id("endWidth")).clear();
        browser.findElement(By.id("endWidth")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_high_endWidth");
        browser.findElement(By.id("start")).clear();
        browser.findElement(By.id("start")).sendKeys("75"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_high_startrange");
        browser.findElement(By.id("end")).clear();
        browser.findElement(By.id("end")).sendKeys("100"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_high_endrange");
        browser.findElement(By.id("radius")).clear();
        browser.findElement(By.id("radius")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_high_cornerradius");
        browser.findElement(By.id("rangeColor")).sendKeys("#30B32D");
        browser.compareScreen(element(By.id("range-container")),"SB/range_high_rangecolor");
        browser.findElement(By.id("enable")).click();
        browser.compareScreen(element(By.id("range-container")),"SB/range_high_fontcolor");
    });

    it('corner radius with ranges', () => {
        browser.load("/demos/SB/range.html");
        browser.findElement(By.id("rangeSelect")).sendKeys("High");
        browser.findElement(By.id("radius")).clear();
        browser.findElement(By.id("radius")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/high_cornerradius");
        browser.findElement(By.id("rangeSelect")).sendKeys("Low");
        browser.findElement(By.id("radius")).clear();
        browser.findElement(By.id("radius")).sendKeys("20"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/low_cornerradius");
        browser.findElement(By.id("rangeSelect")).sendKeys("Medium");
        browser.findElement(By.id("radius")).clear();
        browser.findElement(By.id("radius")).sendKeys("10"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/medium_cornerradius");
    });

    it('customize low range', () => {
        browser.load("/demos/SB/range.html");
        browser.findElement(By.id("startWidth")).clear();
        browser.findElement(By.id("startWidth")).sendKeys("20"+ Key.ENTER);
        browser.findElement(By.id("endWidth")).clear();
        browser.findElement(By.id("endWidth")).sendKeys("20"+ Key.ENTER);
        browser.findElement(By.id("start")).clear();
        browser.findElement(By.id("start")).sendKeys("36"+ Key.ENTER);
        browser.findElement(By.id("end")).clear();
        browser.findElement(By.id("end")).sendKeys("40"+ Key.ENTER);
        browser.findElement(By.id("radius")).clear();
        browser.findElement(By.id("radius")).sendKeys("30"+ Key.ENTER);
        browser.findElement(By.id("enable")).click();
        browser.compareScreen(element(By.id("range-container")),"SB/lowrange_customize");
    });


    it('customize medium range', () => {
        browser.load("/demos/SB/range.html");
        browser.findElement(By.id("rangeSelect")).sendKeys("Medium");
        browser.findElement(By.id("startWidth")).clear();
        browser.findElement(By.id("startWidth")).sendKeys("20"+ Key.ENTER);
        browser.findElement(By.id("endWidth")).clear();
        browser.findElement(By.id("endWidth")).sendKeys("20"+ Key.ENTER);
        browser.findElement(By.id("start")).clear();
        browser.findElement(By.id("start")).sendKeys("56"+ Key.ENTER);
        browser.findElement(By.id("end")).clear();
        browser.findElement(By.id("end")).sendKeys("60"+ Key.ENTER);
        browser.findElement(By.id("radius")).clear();
        browser.findElement(By.id("radius")).sendKeys("30"+ Key.ENTER);
        browser.findElement(By.id("enable")).click();
        browser.compareScreen(element(By.id("range-container")),"SB/mediumrange_customize");
    });

    it('customize high range', () => {
        browser.load("/demos/SB/range.html");
        browser.findElement(By.id("rangeSelect")).sendKeys("High");
        browser.findElement(By.id("startWidth")).clear();
        browser.findElement(By.id("startWidth")).sendKeys("20"+ Key.ENTER);
        browser.findElement(By.id("endWidth")).clear();
        browser.findElement(By.id("endWidth")).sendKeys("20"+ Key.ENTER);
        browser.findElement(By.id("start")).clear();
        browser.findElement(By.id("start")).sendKeys("96"+ Key.ENTER);
        browser.findElement(By.id("end")).clear();
        browser.findElement(By.id("end")).sendKeys("100"+ Key.ENTER);
        browser.findElement(By.id("radius")).clear();
        browser.findElement(By.id("radius")).sendKeys("30"+ Key.ENTER);
        browser.findElement(By.id("enable")).click();
        browser.compareScreen(element(By.id("range-container")),"SB/highrange_customize");
    });

    it('startwidth vs ranges', () => {
        browser.load("/demos/SB/range.html");
        browser.findElement(By.id("rangeSelect")).sendKeys("High");
        browser.findElement(By.id("startWidth")).clear();
        browser.findElement(By.id("startWidth")).sendKeys("25"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/highrange_startwidth");
        browser.findElement(By.id("rangeSelect")).sendKeys("Medium");
        browser.findElement(By.id("startWidth")).clear();
        browser.findElement(By.id("startWidth")).sendKeys("25"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/mediumrange_startwidth");
        browser.findElement(By.id("rangeSelect")).sendKeys("High");
        browser.findElement(By.id("startWidth")).clear();
        browser.findElement(By.id("startWidth")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/lowrange_startwidth");
    });

    it('Endwidth vs ranges', () => {
        browser.load("/demos/SB/range.html");
        browser.findElement(By.id("rangeSelect")).sendKeys("High");
        browser.findElement(By.id("endWidth")).clear();
        browser.findElement(By.id("endWidth")).sendKeys("25"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/highrange_endWidth");
        browser.findElement(By.id("rangeSelect")).sendKeys("Medium");
        browser.findElement(By.id("endWidth")).clear();
        browser.findElement(By.id("endWidth")).sendKeys("25"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/mediumrange_endWidth");
        browser.findElement(By.id("rangeSelect")).sendKeys("High");
        browser.findElement(By.id("endWidth")).clear();
        browser.findElement(By.id("endWidth")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/lowrange_endWidth");
    });

    it('star and End range vs ranges and fontcolor', () => {
        browser.load("/demos/SB/range.html");
        browser.findElement(By.id("enable")).click();
        browser.findElement(By.id("rangeSelect")).sendKeys("High");
        browser.findElement(By.id("start")).clear();
        browser.findElement(By.id("start")).sendKeys("40"+ Key.ENTER);
        browser.findElement(By.id("end")).clear();
        browser.findElement(By.id("end")).sendKeys("80"+ Key.ENTER);
        browser.findElement(By.id("rangeSelect")).sendKeys("Medium");
        browser.findElement(By.id("start")).clear();
        browser.findElement(By.id("start")).sendKeys("30"+ Key.ENTER);
        browser.findElement(By.id("end")).clear();
        browser.findElement(By.id("end")).sendKeys("100"+ Key.ENTER);
        browser.findElement(By.id("rangeSelect")).sendKeys("Low");
        browser.findElement(By.id("start")).clear();
        browser.findElement(By.id("start")).sendKeys("20"+ Key.ENTER);
        browser.findElement(By.id("end")).clear();
        browser.findElement(By.id("end")).sendKeys("120"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/range_combination1");
    });

    it('start and endwith vs corner radius', () => {
        browser.load("/demos/SB/range.html");
        browser.findElement(By.id("rangeSelect")).sendKeys("High");
        browser.findElement(By.id("startWidth")).clear();
        browser.findElement(By.id("startWidth")).sendKeys("20"+ Key.ENTER);
        browser.findElement(By.id("endWidth")).clear();
        browser.findElement(By.id("endWidth")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/highrange_combination1");
        browser.findElement(By.id("rangeSelect")).sendKeys("Low");
        browser.findElement(By.id("startWidth")).clear();
        browser.findElement(By.id("startWidth")).sendKeys("10"+ Key.ENTER);
        browser.findElement(By.id("endWidth")).clear();
        browser.findElement(By.id("endWidth")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/lowrange_combination1");
        browser.findElement(By.id("rangeSelect")).sendKeys("Medium");
        browser.findElement(By.id("startWidth")).clear();
        browser.findElement(By.id("startWidth")).sendKeys("10"+ Key.ENTER);
        browser.findElement(By.id("endWidth")).clear();
        browser.findElement(By.id("endWidth")).sendKeys("30"+ Key.ENTER);
        browser.compareScreen(element(By.id("range-container")),"SB/mediumrange_combination1");
        browser.findElement(By.id("enable")).click();
        browser.compareScreen(element(By.id("range-container")),"SB/range_combination2");
    });
});

