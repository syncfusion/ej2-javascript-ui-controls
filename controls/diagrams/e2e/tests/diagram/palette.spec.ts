/**
 * spec
 */
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';
let selectObjects: ElementFinder;
describe('Diagram - Symbol Palette Control', () => {
        describe('Symbol Palette', () => {
            it('Symbol Palette Load', () => {
                browser.load('/demos/symbol-palette/symbol-palette.html');
                browser.compareScreen(element(By.id('diagram')), 'Symbol Palette');
            });
            it('Symbol Palette Expand- Multiple', () => {
                selectObjects = element(by.id('expand'));
                selectObjects.click();
                browser.compareScreen(element(By.id('diagram')), 'Symbol-Palette-Expand-Multiple');
            });
            it('Symbol Palette Expand- Single', () => {
                selectObjects = element(by.id('expand'));
                selectObjects.click();
                browser.compareScreen(element(By.id('diagram')), 'Symbol-Palette-Expand-Single');
            });
            it('Symbol-Palette-Animation-True', () => {
                selectObjects = element(by.id('animation'));
                selectObjects.click();
                browser.compareScreen(element(By.id('diagram')), 'Symbol-Palette-Animation-True');
            });
            it('Symbol-Palette-Animation-False', () => {
                selectObjects = element(by.id('animation'));
                selectObjects.click();
                browser.compareScreen(element(By.id('diagram')), 'Symbol-Palette-Animation-False');
            });

            it('Symbol-Palette-Symbol-Size-True', () => {
                selectObjects = element(by.id('symbolsize'));
                selectObjects.click();
                browser.compareScreen(element(By.id('diagram')), 'Symbol-Palette-Symbol-Size-True');
            });
            it('Symbol-Palette-Symbol-Size-False', () => {
                selectObjects = element(by.id('symbolsize'));
                selectObjects.click();
                browser.compareScreen(element(By.id('diagram')), 'Symbol-Palette-Symbol-Size-False');
            });
            it('Symbol-Palette-Custom-Size-True', () => {
                selectObjects = element(by.id('customsize'));
                selectObjects.click();
                browser.compareScreen(element(By.id('diagram')), 'Symbol-Palette-Custom-Size-True');
            });
            it('Symbol-Palette-Custom-Size-False', () => {
                selectObjects = element(by.id('customsize'));
                selectObjects.click();
                browser.compareScreen(element(By.id('diagram')), 'Symbol-Palette-Custom-Size-False');
            });
            it('Symbol-Palette-Description-True', () => {
                selectObjects = element(by.id('description'));
                selectObjects.click();
                browser.compareScreen(element(By.id('diagram')), 'Symbol-Palette-Description-True');
            });
            it('Symbol-Palette-Description-False', () => {
                selectObjects = element(by.id('description'));
                selectObjects.click();
                browser.compareScreen(element(By.id('diagram')), 'Symbol-Palette-Description-False');
            });
            it('Symbol-Palette-Fit-True', () => {
                selectObjects = element(by.id('fit'));
                selectObjects.click();
                browser.compareScreen(element(By.id('diagram')), 'Symbol-Palette-Fit-True');
            });
            it('Symbol-Palette-Fit-False', () => {
                selectObjects = element(by.id('fit'));
                selectObjects.click();
                browser.compareScreen(element(By.id('diagram')), 'Symbol-Palette-Fit-False');
            });
        });
    function executeClickEvent(id: string): void {
        let buttonElement: ElementFinder = element(By.id(id));
        buttonElement.click();
    }
});