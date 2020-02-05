/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('SB direction compass', () => {
    it('SB direction compass', () => {
        browser.load("/demos/SB/directioncompass.html");
        browser.compareScreen(element(By.id("direction-container")),"SB/directioncompass");
    });

    it('direction compass pointer color with labelcolor1', () => {        
        browser.findElement(By.id("labelColor")).sendKeys("#4472c4");
        browser.compareScreen(element(By.id("direction-container")),"SB/directioncompass_pointer1_labelcolor1");
        
        browser.findElement(By.id("labelColor")).sendKeys("#f03e3e");
        browser.compareScreen(element(By.id("direction-container")),"SB/directioncompass_pointer1_labelcolor2");
        
        browser.findElement(By.id("labelColor")).sendKeys("#ed7d31");
        browser.compareScreen(element(By.id("direction-container")),"SB/directioncompass_pointer1_labelcolor3");
    });


    it('direction compass pointer color1 with labelcolor1', () => {   
        browser.findElement(By.id("poiterColor")).sendKeys("#4472c4");        
        browser.findElement(By.id("labelColor")).sendKeys("#4472c4");
        browser.compareScreen(element(By.id("direction-container")),"SB/directioncompass_pointer2_labelcolor1");
        
        browser.findElement(By.id("labelColor")).sendKeys("#f03e3e");
        browser.compareScreen(element(By.id("direction-container")),"SB/directioncompass_pointer2_labelcolor2");
        
        browser.findElement(By.id("labelColor")).sendKeys("#ed7d31");
        browser.compareScreen(element(By.id("direction-container")),"SB/directioncompass_pointer2_labelcolor3");
    });


    it('direction compass pointer color2 with labelcolor1', () => {      
        browser.findElement(By.id("poiterColor")).sendKeys("#ed7d31");        
        browser.findElement(By.id("labelColor")).sendKeys("#4472c4");
        browser.compareScreen(element(By.id("direction-container")),"SB/directioncompass_pointer3_labelcolor1");
        
        browser.findElement(By.id("labelColor")).sendKeys("#f03e3e");
        browser.compareScreen(element(By.id("direction-container")),"SB/directioncompass_pointer3_labelcolor2");
        
        browser.findElement(By.id("labelColor")).sendKeys("#ed7d31");
        browser.compareScreen(element(By.id("direction-container")),"SB/directioncompass_pointer3_labelcolor3");
    });
});