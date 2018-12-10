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
describe('Linear gauge events spec', () => {
    let tooltipElement;
    it('Load Event spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/loadEvent.html');
        browser.compareScreen(element(By.id('container')), 'LoadEvent-OpposedPosition');
    });

    it('Loaded Event spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/LoadedEvent.html');
        browser.compareScreen(element(By.id('container')), 'LoadedEvent-Container-Color');
    });

    it('Axis Label Event spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/axisLabelEvent.html');
        browser.compareScreen(element(By.id('container')), 'AxisLabelEvent-Label-Customization');
    });

    it('Annotation Event spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/annotationEvent.html');
        browser.compareScreen(element(By.id('container')), 'AnnotationEvent-Annotation-Customization');
    });
    it('Axis Label Event text spec', (done: Function) => {
        browser.load("/demos/events/axisLabelEvent-1.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("container")), "AxisLabelRenderEvent-Text");
        done();
    });
    it('Annotation Event textStyle spec', (done: Function) => {
        browser.load("/demos/events/annotationEvent-1.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("container")), "AnnotationRenderEvent-Text");
        done();
    });
    it('Annotation Event content spec', (done: Function) => {
        browser.load("/demos/events/annotationEvent-2.html");
        if(browser.browserName === 'internet explorer') {
            browser.executeScript('window.onload.call(this);');
        }
        browser.compareScreen(element(By.id("container")), "AnnotationRenderEvent-Content");
        done();
    });
    it('Tooltip Event tooltip textStyle spec', (done: Function) => {
        browser.get(browser.basePath + '/demos/linear-gauge/Tooltip/tooltipEvent-1.html');
        browser.actions().mouseMove(element(By.id('container_AxisIndex_0_BarPointer_0'))).perform();
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'Tooltip_Event_Tooltip_TextStyle');
    });
    it('Tooltip Event tooltip template spec', (done: Function) => {
        browser.get(browser.basePath + '/demos/linear-gauge/Tooltip/tooltipEvent-2.html');
        browser.actions().mouseMove(element(By.id('container_AxisIndex_0_BarPointer_0'))).perform();
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'Tooltip_Event_Tooltip_template');
    });
    it('Tooltip Event tooltip location spec', (done: Function) => {
        browser.get(browser.basePath + '/demos/linear-gauge/Tooltip/tooltipEvent-3.html');
        browser.actions().mouseMove(element(By.id('container_AxisIndex_0_BarPointer_0'))).perform();
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'Tooltip_Event_Location');
    });
    it('Tooltip Event tooltip content spec', (done: Function) => {
        browser.get(browser.basePath + '/demos/linear-gauge/Tooltip/tooltipEvent-4.html');
        browser.actions().mouseMove(element(By.id('container_AxisIndex_0_BarPointer_0'))).perform();
        browser.sleep(1000);
        browser.compareScreen(element(By.id('container')), 'Tooltip_Event_Content');
    });
});
