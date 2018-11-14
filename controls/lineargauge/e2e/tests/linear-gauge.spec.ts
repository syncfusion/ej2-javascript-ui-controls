/**
 * spec
 */
import { browser, element, By } from '@syncfusion/ej2-base/e2e/index';
import { protractor } from 'protractor/built/ptor';
import { WebElement } from 'selenium-webdriver';
import { ElementFinder } from 'protractor/built/element';
import { Options } from 'selenium-webdriver/chrome';
import { Browser } from '@syncfusion/ej2-base';
import { prototype } from 'events';
describe('LinearGauge', () => {
    it('default rendering', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Default/default.html');
        browser.compareScreen(element(By.id('container')), 'default_gauge');
    });

    it('Annotation rendering', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Annotation/annotation.html');
        browser.compareScreen(element(By.id('container')), 'annotation_gauge');
    });

    it('Axes rendering', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Axes and Pointers/axes.html');
        browser.compareScreen(element(By.id('container')), 'axes_gauge');
    });

    it('Axis inversed', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Axes and Pointers/axes.html');
        element(By.id("axisInversed")).click();
        browser.compareScreen(element(By.id('container')), 'axis_inversed');
    });

    it('Axis opposed', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Axes and Pointers/axes.html');
        element(By.id("opposed")).click();
        browser.compareScreen(element(By.id('container')), 'axis_opposed');
    });

    it('Axis pointer type', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Axes and Pointers/axes.html');
        element(By.id("pointerType")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Bar_Pointer');
        });
    });

    it('Marker Placed in Near', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Axes and Pointers/axes.html');
        element(By.id("pointerPlace")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Marker_Place_Near');
        });
    });

    it('Marker Placed in Center', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Axes and Pointers/axes.html');
        element(By.id("pointerPlace")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Marker_Place_Center');
        });
    });

    it('Axis minimum range changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Axes and Pointers/axes.html');
        browser.actions().dragAndDrop(element(By.id("min")), { x: 50, y: 0 }).perform();
        browser.compareScreen(element(By.id('container')), 'Axis_Min_Change');
    });

    it('Axis maximum range changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Axes and Pointers/axes.html');
        browser.actions().dragAndDrop(element(By.id("max")), { x: -50, y: 0 }).perform();
        browser.compareScreen(element(By.id('container')), 'Axis_Max_Change');
    });

    it('Prefix Label format', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Axes and Pointers/axes.html');
        element(By.id("format")).clear();
        element(By.id("format")).sendKeys("gauge{value}", protractor.Key.ENTER);
        browser.compareScreen(element(By.id('container')), 'prefix_label');
    });

    it('Suffix Label format', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Axes and Pointers/axes.html');
        element(By.id("format")).clear();
        element(By.id("format")).sendKeys("{value}gauge", protractor.Key.ENTER);
        browser.compareScreen(element(By.id('container')), 'suffix_label');
    });

    it('Container', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Container/container.html');
        browser.compareScreen(element(By.id('container')), 'Container_Gauge');
    });

    it('Horizontal_Gauge', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Container/container.html');
        element(By.id("orientationMode")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Horizontal_Gauge');
        });
    });

    it('Rounded_Rectangle_Gauge', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Container/container.html');
        element(By.id("containerMode")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Rounded_Rectangle');
        });
    });

    it('Thermometer_Gauge', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Container/container.html');
        element(By.id("containerMode")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Thermometer');
        });
    });

    it('Thermometer_Gauge', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Container/container.html');
        element(By.id("containerMode")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Thermometer');
        });
    });

    it('Horizontal Thermometer Gauge', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Container/container.html');
        element(By.id("orientationMode")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            element(By.id("containerMode")).all(By.tagName("option")).then((Options: any[]) => {
                Options[2].click();
                browser.compareScreen(element(By.id('container')), 'Horizontal_Thermometer');
            });
        });
    });

    it('Data_Gauge', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Data/data.html');
        browser.compareScreen(element(By.id('gauge_control')), 'data_Gauge');
    });

    it('Ranges_Gauge', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        browser.compareScreen(element(By.id('container')), 'ranges_Gauge');
    });

    it('Range Color', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        element(By.id("useRangeColor")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'range_color');
        });
    });

    it('Use Range Color', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        element(By.id("useRangeColor")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Use_range_color');
        });
    });

    it('Low Color changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        element(By.id("color")).clear();
        element(By.id("color")).sendKeys("#4286f4", protractor.Key.ENTER);
        browser.compareScreen(element(By.id('container')), 'Low_Color');
    });

    it('Moderate Color changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        element(By.id("rangeIndex")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            element(By.id("color")).clear();
            element(By.id("color")).sendKeys("#ee41f4", protractor.Key.ENTER);
            browser.compareScreen(element(By.id('container')), 'Moderate_Color');
        });
    });

    it('High Color changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        element(By.id("rangeIndex")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            element(By.id("color")).clear();
            element(By.id("color")).sendKeys("#f44194", protractor.Key.ENTER);
            browser.compareScreen(element(By.id('container')), 'High_Color');
        });
    });

    it('Low Start range changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        browser.actions().dragAndDrop(element(By.id("end")), { x: 40, y: 0 }).perform();
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'Low_Start_Range_Change');
    });

    it('Low End range changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        browser.actions().dragAndDrop(element(By.id("end")), { x: 40, y: 0 }).perform();
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'Low_End_Range_Change');
    });

    it('Low start width changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        browser.actions().dragAndDrop(element(By.id("startWidth")), { x: 40, y: 0 }).perform();
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'Low_Start_Width_Change');
    });

    it('Low end width changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        browser.actions().dragAndDrop(element(By.id("endWidth")), { x: 40, y: 0 }).perform();
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'Low_End_Width_Change');
    });

    it('Moderate Start range changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        element(By.id("rangeIndex")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.actions().dragAndDrop(element(By.id("start")), { x: 75, y: 0 }).perform();
            browser.sleep(1000);
            browser.compareScreen(element(By.id('container')), 'Moderate_Start_Range_Change');
        });
    });

    it('Moderate End range changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        element(By.id("rangeIndex")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.actions().dragAndDrop(element(By.id("end")), { x: 75, y: 0 }).perform();
            browser.sleep(1000);
            browser.compareScreen(element(By.id('container')), 'Moderate_End_Range_Change');
        });
    });

    it('Moderate Start width changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        element(By.id("rangeIndex")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.actions().dragAndDrop(element(By.id("startWidth")), { x: 50, y: 0 }).perform();
            browser.sleep(1000);
            browser.compareScreen(element(By.id('container')), 'Moderate_Start_Width_Change');
        });
    });

    it('Moderate End width changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        element(By.id("rangeIndex")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.actions().dragAndDrop(element(By.id("endWidth")), { x: 50, y: 0 }).perform();
            browser.sleep(1000);
            browser.compareScreen(element(By.id('container')), 'Moderate_End_Width_Change');
        });
    });

    it('High Start range changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        element(By.id("rangeIndex")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.actions().dragAndDrop(element(By.id("start")), { x: 40, y: 0 }).perform();
            browser.sleep(1000);
            browser.compareScreen(element(By.id('container')), 'High_Start_Range_Change');
        });
    });

    it('High End range changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        element(By.id("rangeIndex")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.actions().dragAndDrop(element(By.id("end")), { x: 40, y: 0 }).perform();
            browser.sleep(1000);
            browser.compareScreen(element(By.id('container')), 'High_End_Range_Change');
        });
    });

    it('High Start width changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        element(By.id("rangeIndex")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.actions().dragAndDrop(element(By.id("startWidth")), { x: 50, y: 0 }).perform();
            browser.sleep(1000);
            browser.compareScreen(element(By.id('container')), 'High_Start_Width_Change');
        });
    });

    it('High End width changing', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Ranges/ranges.html');
        element(By.id("rangeIndex")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.actions().dragAndDrop(element(By.id("endWidth")), { x: 50, y: 0 }).perform();
            browser.sleep(1000);
            browser.compareScreen(element(By.id('container')), 'High_End_Width_Change');
        });
    });

    it('Styles', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Styles/style.html');
        browser.compareScreen(element(By.id('gauge_control')), 'Style_Gauge');
    });

    it('Tooltip', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Tooltip/tooltip.html');
        browser.compareScreen(element(By.id('container')), 'Tooltip_Gauge');
    });
    
    it('Axis2_tooltip', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/Tooltip/tooltip.html');
        browser.actions().mouseMove(element(By.id('container_AxisIndex_0_BarPointer_0'))).perform();
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'Axis2_Tooltip_Gauge');
    });

});
