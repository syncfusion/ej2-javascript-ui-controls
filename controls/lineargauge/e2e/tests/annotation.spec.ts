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
describe('Linear gauge annotation spec', () => {
    it('Vertical Alignment spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/annotation.html');
        element(By.id("annotation")).all(By.tagName("option")).then((Options: any[]) => {
            Options[0].click();
            browser.compareScreen(element(By.id('container')), 'Annotation-Vertical-Alignment');
        });
    });

    it('Axis Value spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/annotation.html');
        element(By.id("annotation")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Annotation-AxisValue');
        });
    });

    it('Axis Index spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/annotation.html');
        element(By.id("annotation")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Annotation-AxisIndex');
        });
    });

});
