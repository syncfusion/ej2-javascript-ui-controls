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
describe('LinearGauge Axis Line spec', () => {
    it('Line width spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/axisLine.html');
        browser.compareScreen(element(By.id('container')), 'Line-width');
    });

    it('Line Color spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/axisLine.html');
        element(By.id("line")).all(By.tagName("option")).then((Options: any[]) => {
            Options[0].click();
            browser.compareScreen(element(By.id('container')), 'Line-Color');
        });
    });

    it('Line Dash Array spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/axisLine.html');
        element(By.id("line")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Line-DashArray');
        });
    });

    it('Line height spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/axisLine.html');
        element(By.id("line")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Line-Height');
        });
    });

    it('Line offset spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/axisLine.html');
        element(By.id("line")).all(By.tagName("option")).then((Options: any[]) => {
            Options[3].click();
            browser.compareScreen(element(By.id('container')), 'Line-Offset');
        });
    });

});
