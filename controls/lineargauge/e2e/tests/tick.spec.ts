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
describe('Ticks spec', () => {
    it('Major tick interval spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/tick.html');
        element(By.id("majortick")).all(By.tagName("option")).then((Options: any[]) => {
            Options[0].click();
            browser.compareScreen(element(By.id('container')), 'Majortick-Interval');
        });
    });

    it('Major tick color spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/tick.html');
        element(By.id("majortick")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Majortick-Color');
        });
    });

    it('Major tick height spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/tick.html');
        element(By.id("majortick")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Majortick-Height');
        });
    });

    it('Major tick width spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/tick.html');
        element(By.id("majortick")).all(By.tagName("option")).then((Options: any[]) => {
            Options[3].click();
            browser.compareScreen(element(By.id('container')), 'Majortick-Width');
        });
    });

    it('Major tick offset spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/tick.html');
        element(By.id("majortick")).all(By.tagName("option")).then((Options: any[]) => {
            Options[4].click();
            browser.compareScreen(element(By.id('container')), 'Majortick-Offset');
        });
    });

    it('Minor tick interval spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/tick.html');
        element(By.id("minortick")).all(By.tagName("option")).then((Options: any[]) => {
            Options[0].click();
            browser.compareScreen(element(By.id('container')), 'Minortick-Interval');
        });
    });

    it('Minor tick color spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/tick.html');
        element(By.id("minortick")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Minortick-Color');
        });
    });

    it('Minor tick height spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/tick.html');
        element(By.id("minortick")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Minortick-Height');
        });
    });

    it('Minor tick width spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/tick.html');
        element(By.id("minortick")).all(By.tagName("option")).then((Options: any[]) => {
            Options[3].click();
            browser.compareScreen(element(By.id('container')), 'Minortick-Width');
        });
    });

    it('Minor tick offset spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/tick.html');
        element(By.id("minortick")).all(By.tagName("option")).then((Options: any[]) => {
            Options[4].click();
            browser.compareScreen(element(By.id('container')), 'Minortick-Offset');
        });
    });

});
