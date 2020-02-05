import { browser, element, By, by, Key } from "@syncfusion/ej2-base/e2e/index";

describe('needlepointer', () => {
    it('needlepointer_pointerwidth', () => {
        browser.load('/demos/pointer/NeedlePointer.html');
        browser.compareScreen(element(By.id('element')), 'needlepointer');
        browser.findElement(By.id('pointercolor')).sendKeys("red"+ Key.ENTER);
        browser.compareScreen(element(By.id('element')), 'needlepointer_pointercolor');
        browser.findElement(By.id('pointerwidth')).clear();
        browser.findElement(By.id('pointerwidth')).sendKeys("44"+ Key.ENTER);
        browser.compareScreen(element(By.id('element')), 'needlepointer_pointerwidth');
    });
  
    it('needlepointer_cap', () => {
        browser.load('/demos/pointer/NeedlePointer.html');
        browser.findElement(By.id('pointercapcolor')).sendKeys("Blue"+ Key.ENTER);
        browser.compareScreen(element(By.id('element')), 'needlepointer_capcolor');
        browser.findElement(By.id('pointercapradius')).clear();
        browser.findElement(By.id('pointercapradius')).sendKeys("15"+ Key.ENTER);
        browser.compareScreen(element(By.id('element')), 'needlepointer_capradius');
        browser.findElement(By.id('pointercapborderwidth')).clear();
        browser.findElement(By.id('pointercapborderwidth')).sendKeys("2"+ Key.ENTER);
        browser.findElement(By.id('pointercapbordercolor')).sendKeys("red"+ Key.ENTER);
        browser.compareScreen(element(By.id('element')), 'needlepointer_capbordercolor');
        browser.findElement(By.id('pointercapborderwidth')).clear();
        browser.findElement(By.id('pointercapborderwidth')).sendKeys("5"+ Key.ENTER);
        browser.compareScreen(element(By.id('element')), 'needlepointer_capborderwidth');
    });

    it('needlepointer_tail', () => {
        browser.load('/demos/pointer/NeedlePointer.html');
        browser.findElement(By.id('needletaillength')).sendKeys("30%"+ Key.ENTER);
        browser.compareScreen(element(By.id('element')), 'needlepointer_neendletail_length');
        browser.findElement(By.id('needletail')).sendKeys("green"+ Key.ENTER);
        browser.compareScreen(element(By.id('element')), 'needlepointer_neendletail_color');
        browser.findElement(By.id('needletailbordercolor')).sendKeys("red"+ Key.ENTER);
        browser.findElement(By.id('needletailborderwidth')).sendKeys("4"+ Key.ENTER);
        browser.compareScreen(element(By.id('element')), 'needlepointer_neendletail_bordercolor');
    });

    it('needlepointer_range tooltip', () => {
        browser.load('/demos/pointer/NeedlePointer.html');
        browser.findElement(By.id('enabletooltip')).click();
        browser.actions().mouseMove(element(By.id('element_Axis_0_Pointer_NeedleRect_0'))).perform().then(function() {
            browser.compareScreen(element(By.id('element')), 'needlepointer_pointer_tooltip');
        });
        browser.actions().mouseMove(element(By.id('element_Axis_0_Range_4'))).perform().then(function() {
            browser.compareScreen(element(By.id('element')), 'needlepointer_range_tooltip');
        });
   
        browser.findElement(By.id('tooltipbordercolor')).sendKeys("Blue"+ Key.ENTER);
        browser.actions().mouseMove(element(By.id('element_Axis_0_Pointer_NeedleRect_0'))).perform().then(function() {
        browser.compareScreen(element(By.id('element')), 'needlepointer_pointer_tooltipborder');
    });
    browser.actions().mouseMove(element(By.id('element_Axis_0_Range_2'))).perform().then(function() {
        browser.compareScreen(element(By.id('element')), 'needlepointer_range_tooltipborder');
    });

    browser.findElement(By.id('tooltipborderwidth')).sendKeys("4"+ Key.ENTER);
    browser.actions().mouseMove(element(By.id('element_Axis_0_Pointer_NeedleRect_0'))).perform().then(function() {
    browser.compareScreen(element(By.id('element')), 'needlepointer_pointer_tooltipborderwidth');
});
browser.actions().mouseMove(element(By.id('element_Axis_0_Range_0'))).perform().then(function() {
    browser.compareScreen(element(By.id('element')), 'needlepointer_range_tooltipborderwidth');
});


browser.findElement(By.id('tooltipfill')).sendKeys("red"+ Key.ENTER);
browser.actions().mouseMove(element(By.id('element_Axis_0_Pointer_NeedleRect_0'))).perform().then(function() {
browser.compareScreen(element(By.id('element')), 'needlepointer_pointer_tooltipfill');
});
browser.actions().mouseMove(element(By.id('element_Axis_0_Range_5'))).perform().then(function() {
browser.compareScreen(element(By.id('element')), 'needlepointer_range_tooltipfill');
});
});

it('tooltip at mouseposition', () => {
    browser.load('/demos/pointer/NeedlePointer.html');
    browser.findElement(By.id('enabletooltip')).click();
    browser.findElement(By.id('mouseposition')).click();
    browser.actions().mouseMove(element(By.id('element_Axis_0_Pointer_NeedleCap_0'))).perform().then( function () {
        browser.compareScreen(element(By.id('element')), 'needlepointer_mouseposition_tooltip');
    });

    browser.findElement(By.id('tooltipbordercolor')).sendKeys("red"+ Key.ENTER);
    browser.actions().mouseMove(element(By.id('element_Axis_0_Pointer_NeedleCap_0'))).perform().then(function() {
    browser.compareScreen(element(By.id('element')), 'needlepointer_mouseposition_tooltip_bordercolor');
});

browser.findElement(By.id('tooltipborderwidth')).sendKeys("4"+ Key.ENTER);
browser.actions().mouseMove(element(By.id('element_Axis_0_Pointer_NeedleCap_0'))).perform().then(function() {
browser.compareScreen(element(By.id('element')), 'needlepointer_mouseposition_tooltip_borderwidth');
});

browser.findElement(By.id('tooltipfill')).sendKeys("Blue"+ Key.ENTER);
browser.actions().mouseMove(element(By.id('element_Axis_0_Pointer_NeedleCap_0'))).perform().then(function() {
browser.compareScreen(element(By.id('element')), 'needlepointer_mouseposition_tooltipfill');
});
});

it('Needle pointer value change', () => {
    browser.load('/demos/pointer/NeedlePointer.html');
    browser.findElement(By.id('pointervalue')).sendKeys("90"+ Key.ENTER);
    browser.compareScreen(element(By.id('element')), 'needlepointer_changevalue');
});
});
