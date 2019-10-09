/**
 * spec
 */
import { browser, element, By, ElementFinder, by } from '@syncfusion/ej2-base/e2e/index';

describe('Barcode Control', () => {
    it('Barcode Rendering with background color', () => {
        browser.load('/demos/basic/testcases.html');
        browser.compareScreen(element(By.id('barcode')), 'rendering');
    });
    it('Barcode Rendering without color', () => {
        browser.load('/demos/basic/testcases2.html');
        browser.compareScreen(element(By.id('barcode')), 'renderingnocolor');
    });
    it('Barcode Rendering with displaytext margin feature', () => {
        browser.load('/demos/basic/testcases3.html');
        browser.compareScreen(element(By.id('barcode')), 'dispalytextmargin');
    });
    it('Barcode Rendering with displaytext left right margin feature', () => {
        browser.load('/demos/basic/testcases4.html');
        browser.compareScreen(element(By.id('barcode')), 'dispalytextmarginleft');
    });
    it('Barcode Rendering with displaytext top bottom margin feature', () => {
        browser.load('/demos/basic/testcases5.html');
        browser.compareScreen(element(By.id('barcode')), 'dispalytextmargintbottom');
    });
    it('Barcode Rendering barcode margin', () => {
        browser.load('/demos/basic/testcases6.html');
        browser.compareScreen(element(By.id('barcode')), 'dispalybarcodemargin');
    });
    it('Barcode Rendering larger display text value', () => {
        browser.load('/demos/basic/testcases7.html');
        browser.compareScreen(element(By.id('barcode')), 'dispalytext');
    });
    it('Barcode Rendering with display text visibility as false', () => {
        browser.load('/demos/basic/testcases8.html');
        browser.compareScreen(element(By.id('barcode')), 'dispalytextvisibility');
    });
    it('Barcode Rendering with display text visibility as false', () => {
        browser.load('/demos/basic/testcases9.html');
        browser.compareScreen(element(By.id('barcode')), 'dispalytextmarginall');
    });
    it('checking bar code when 100% width is given', () => {
        browser.load('/demos/basic/testcases10.html');
        browser.compareScreen(element(By.id('barcode')), 'barcodewidth');
    });
    it('checking bar code when numerical width is given', () => {
        browser.load('/demos/basic/testcases11.html');
        browser.compareScreen(element(By.id('barcode')), 'barcodewidthnumber');
    });
})