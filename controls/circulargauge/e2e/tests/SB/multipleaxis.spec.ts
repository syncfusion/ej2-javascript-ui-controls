/**
 * spec
 */
import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('Multiple Axis', () => {
    it('Multiple Axis', () => {
        browser.load("/demos/SB/multipleaxis.html");
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis");
    });
    it('Axis1 directions start angle', () => {
        browser.findElement(By.id("startAngle")).clear();
        browser.findElement(By.id("startAngle")).sendKeys("180"+ Key.ENTER);
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis1_startangle_clockwise");
     
        browser.findElement(By.id("axisDirection")).sendKeys("AntiClockWise");
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis1_startangle_Anticlockwise");
    });

    it('Axis1 directions End angle', () => {
        browser.load("/demos/SB/multipleaxis.html");
        browser.findElement(By.id("endAngle")).clear();
        browser.findElement(By.id("endAngle")).sendKeys("80"+ Key.ENTER);
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis1_endAngle_clockwise");
     
        browser.findElement(By.id("axisDirection")).sendKeys("AntiClockWise");
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis1_endAngle_Anticlockwise");
    });

    it('Axis2 directions start angle', () => {
        browser.load("/demos/SB/multipleaxis.html");
       
        browser.findElement(By.id("axisIndex")).sendKeys("Axis 2");
        browser.findElement(By.id("startAngle")).clear();
        browser.findElement(By.id("startAngle")).sendKeys("160"+ Key.ENTER);
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis2_startangle_clockwise");
     
        browser.findElement(By.id("axisDirection")).sendKeys("AntiClockWise");
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis2_startangle_Anticlockwise");
    });

    it('Axis2 directions End angle', () => {
        browser.load("/demos/SB/multipleaxis.html");
       
        browser.findElement(By.id("axisIndex")).sendKeys("Axis 2");
        browser.findElement(By.id("endAngle")).clear();
        browser.findElement(By.id("endAngle")).sendKeys("100"+ Key.ENTER);
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis2_endAngle_clockwise");
     
        browser.findElement(By.id("axisDirection")).sendKeys("AntiClockWise");
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis2_endAngle_Anticlockwise");
    });

    it('Axis1 direction with start and end angles', () => {
        browser.load("/demos/SB/multipleaxis.html");
     
        browser.findElement(By.id("axisDirection")).sendKeys("AntiClockWise");
        browser.findElement(By.id("startAngle")).clear();
        browser.findElement(By.id("startAngle")).sendKeys("160"+ Key.ENTER);
        browser.findElement(By.id("endAngle")).clear();
        browser.findElement(By.id("endAngle")).sendKeys("100"+ Key.ENTER);
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis1_start_endangle_anticlockwise");

     
        browser.findElement(By.id("axisDirection")).sendKeys("ClockWise");
        browser.findElement(By.id("startAngle")).clear();
        browser.findElement(By.id("startAngle")).sendKeys("120"+ Key.ENTER);
        browser.findElement(By.id("endAngle")).clear();
        browser.findElement(By.id("endAngle")).sendKeys("90"+ Key.ENTER);
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis1_start_endangle_clockwise");

    });


    it('Axis2 direction with start and end angles', () => {
        browser.load("/demos/SB/multipleaxis.html");
       
        browser.findElement(By.id("axisIndex")).sendKeys("Axis 2");
     
        browser.findElement(By.id("axisDirection")).sendKeys("AntiClockWise");
        browser.findElement(By.id("startAngle")).clear();
        browser.findElement(By.id("startAngle")).sendKeys("160"+ Key.ENTER);
        browser.findElement(By.id("endAngle")).clear();
        browser.findElement(By.id("endAngle")).sendKeys("100"+ Key.ENTER);
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis2_start_endangle_anticlockwise");

     
        browser.findElement(By.id("axisDirection")).sendKeys("ClockWise");
        browser.findElement(By.id("startAngle")).clear();
        browser.findElement(By.id("startAngle")).sendKeys("150"+ Key.ENTER);
        browser.findElement(By.id("endAngle")).clear();
        browser.findElement(By.id("endAngle")).sendKeys("260"+ Key.ENTER);
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis2_start_endangle_clockwise");

    });


    it('Axis direction with all combinations', () => {
        browser.load("/demos/SB/multipleaxis.html");
        browser.findElement(By.id("startAngle")).clear();
        browser.findElement(By.id("startAngle")).sendKeys("210"+ Key.ENTER);
        browser.findElement(By.id("endAngle")).clear();
        browser.findElement(By.id("endAngle")).sendKeys("290"+ Key.ENTER);

       
        browser.findElement(By.id("axisIndex")).sendKeys("Axis 2");
        browser.findElement(By.id("startAngle")).clear();
        browser.findElement(By.id("startAngle")).sendKeys("100"+ Key.ENTER);
        browser.findElement(By.id("endAngle")).clear();
        browser.findElement(By.id("endAngle")).sendKeys("140"+ Key.ENTER);
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_bothaxis_clockwsie");
     
        browser.findElement(By.id("axisDirection")).sendKeys("AntiClockWise");
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis2_anticlock_axis1_clock");
       
        browser.findElement(By.id("axisIndex")).sendKeys("Axis 1");
     
        browser.findElement(By.id("axisDirection")).sendKeys("AntiClockWise");
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_bothaxis_anticlockwsie");
       
        browser.findElement(By.id("axisIndex")).sendKeys("Axis 2");
     
        browser.findElement(By.id("axisDirection")).sendKeys("ClockWise");
        browser.compareScreen(element(By.id("axis-container")),"SB/multipleaxis_Axis1_anticlock_axis2_clock");
    });
});