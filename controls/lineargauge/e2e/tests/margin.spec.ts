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
describe('Linear gauge margin spec', () => {
    it('Bottom spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/margin.html');
        browser.compareScreen(element(By.id('container')), 'Gauge-Bottom-Margin');
    });

    it('Top spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/margin.html');
        element(By.id("margin")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Gauge-Top-Margin');
        });
    });

    it('Left spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/margin.html');
        element(By.id("margin")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Gauge-Left-Margin');
        });
    });

    it('Right spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/margin.html');
        element(By.id("margin")).all(By.tagName("option")).then((Options: any[]) => {
            Options[3].click();
            browser.compareScreen(element(By.id('container')), 'Gauge-Right-Margin');
        });
    });

});
