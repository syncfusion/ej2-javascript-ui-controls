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
describe('LinearGauge Label spec', () => {
    it('Label format spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/label.html');
        element(By.id("label")).all(By.tagName("option")).then((Options: any[]) => {
            Options[0].click();
            browser.compareScreen(element(By.id('container')), 'Label-Format');
        });
    });

    it('Label offset spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/label.html');
        element(By.id("label")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Label-Offset');
        });
    });

    it('Label range color spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/label.html');
        element(By.id("label")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Label-RangeColor');
        });
    });

});
