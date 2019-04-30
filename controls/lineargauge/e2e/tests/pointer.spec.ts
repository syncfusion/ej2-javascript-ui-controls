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
describe('Pointers spec', () => {
    it('Bar pointer spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/pointer.html');
        element(By.id("barpointer")).all(By.tagName("option")).then((Options: any[]) => {
            Options[0].click();
            browser.compareScreen(element(By.id('container')), 'Barpointer-Border');
        });
    });

    it('Bar pointer spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/pointer.html');
        element(By.id("barpointer")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Barpointer-Opacity');
        });
    });

    it('Pointer - Position spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/pointer.html');
        element(By.id("position")).all(By.tagName("option")).then((Options: any[]) => {
            Options[0].click();
            browser.compareScreen(element(By.id('container')), 'Pointer-Near');
        });
    });

    it('Pointer - Position spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/pointer.html');
        element(By.id("position")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Pointer-Far');
        });
    });

    it('Pointer - Position spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/pointer.html');
        element(By.id("position")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Pointer-Center');
        });
    });

    it('Arrow Marker', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/pointer.html');
        element(By.id("markerpointer")).all(By.tagName("option")).then((Options: any[]) => {
            Options[0].click();
            browser.compareScreen(element(By.id('container')), 'Arrow-Marker');
        });
    });

    it('Circle Marker', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/pointer.html');
        element(By.id("markerpointer")).all(By.tagName("option")).then((Options: any[]) => {
            Options[1].click();
            browser.compareScreen(element(By.id('container')), 'Circle-Marker');
        });
    });

    it('Diamond Marker', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/pointer.html');
        element(By.id("markerpointer")).all(By.tagName("option")).then((Options: any[]) => {
            Options[2].click();
            browser.compareScreen(element(By.id('container')), 'Diamond-Marker');
        });
    });

    it('Inverted Arrow Marker', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/pointer.html');
        element(By.id("markerpointer")).all(By.tagName("option")).then((Options: any[]) => {
            Options[3].click();
            browser.compareScreen(element(By.id('container')), 'InvertedArrow-Marker');
        });
    });

    it('Reactangle Marker', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/pointer.html');
        element(By.id("markerpointer")).all(By.tagName("option")).then((Options: any[]) => {
            Options[4].click();
            browser.compareScreen(element(By.id('container')), 'Rectangle-Marker');
        });
    });

    it('Triangle Marker', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/pointer.html');
        element(By.id("markerpointer")).all(By.tagName("option")).then((Options: any[]) => {
            Options[5].click();
            browser.compareScreen(element(By.id('container')), 'Triangle-Marker');
        });
    });

});
