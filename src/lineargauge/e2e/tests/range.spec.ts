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
describe('Ranges spec', () => {
    it('Ranges spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/ranges.html');
        element(By.id("range1")).all(By.tagName("option")).then((Options: any[]) => {
            Options[0].click();
        browser.compareScreen(element(By.id('container')), 'Range1-Border');
        });
    });

    it('Ranges spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/ranges.html');
        element(By.id("range1")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Range1-Color');
        });
    });

    it('Ranges spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/ranges.html');
        element(By.id("range1")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Range1-Offset');
        });
    });

    it('Ranges spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/ranges.html');
        element(By.id("range1")).all(By.tagName("option")).then((Options: any[]) => {
            Options[3].click();
            browser.compareScreen(element(By.id('container')), 'Range1-Position');
        });
    });
    it('Ranges spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/ranges.html');
        element(By.id("range2")).all(By.tagName("option")).then((Options: any[]) => {
            Options[0].click();
        browser.compareScreen(element(By.id('container')), 'Range2-Border');
        });
    });

    it('Ranges spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/ranges.html');
        element(By.id("range2")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Range2-Color');
        });
    });

    it('Ranges spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/ranges.html');
        element(By.id("range2")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Range2-Offset');
        });
    });

    it('Ranges spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/ranges.html');
        element(By.id("range2")).all(By.tagName("option")).then((Options: any[]) => {
            Options[3].click();
            browser.compareScreen(element(By.id('container')), 'Range2-Position');
        });
    });

    it('Same value Ranges spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/dualRange.html');
        browser.compareScreen(element(By.id('container')), 'SameValue-Range');
    });

    it('Overlap Ranges spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/overlapRange.html');
        browser.compareScreen(element(By.id('container')), 'Ranges-Overlap');
    });

});