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
describe('Gauge Size spec', () => {
    it('Gauge size height spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/size.html');
        browser.compareScreen(element(By.id('container')), 'Gauge-Height');
    });

    it('Gauge size width spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/size.html');
        element(By.id("size")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Gauge-Width');
        });
    });

});
