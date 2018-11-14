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

});
