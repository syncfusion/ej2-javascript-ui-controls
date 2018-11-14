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
describe('Linear gauge public methods spec', () => {
    it('pointer value method spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/pointerMethod.html');
        browser.compareScreen(element(By.id('container')), 'PointerValue-Method');
    });

    it('annotation value method spec', () => {
        browser.get(browser.basePath + '/demos/linear-gauge/testing/annotationMethod.html');
        browser.compareScreen(element(By.id('container')), 'AnnotationValue-Method');
    });

});
