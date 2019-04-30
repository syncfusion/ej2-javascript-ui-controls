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
describe('Linear gauge spec', () => {
    it('Border spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/gauge.html');
        browser.compareScreen(element(By.id('container')), 'Gauge-Border');
    });

    it('Background spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/gauge.html');
        element(By.id("gauge")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Gauge-Background');
        });
    });

    it('Height spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/gauge.html');
        element(By.id("gauge")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Gauge-Height');
        });
    });

    it('Width spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/gauge.html');
        element(By.id("gauge")).all(By.tagName("option")).then((Options: any[]) => {
            Options[3].click();
            browser.compareScreen(element(By.id('container')), 'Gauge-Width');
        });
    });

    it('Orientation spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/gauge.html');
        element(By.id("gauge")).all(By.tagName("option")).then((Options: any[]) => {
            Options[4].click();
            browser.compareScreen(element(By.id('container')), 'Gauge-Orientation');
        });
    });

    it('Title spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/gauge.html');
        element(By.id("gauge")).all(By.tagName("option")).then((Options: any[]) => {
            Options[5].click();
            browser.compareScreen(element(By.id('container')), 'Gauge-Title');
        });
    });

    it('Title Style spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/gauge.html');
        element(By.id("gauge")).all(By.tagName("option")).then((Options: any[]) => {
            Options[6].click();
            browser.compareScreen(element(By.id('container')), 'Gauge-Title-Style');
        });
    });

});
