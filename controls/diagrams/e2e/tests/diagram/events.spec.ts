/**
 * spec
 */

import { browser, element, By, ElementFinder, by } from '@syncfusion/ej2-base/e2e/index';
describe('Diagram Control', () => {
    it('Diagram Events', () => {
        browser.load('/demos/events/events.html');
        browser.compareScreen(element(by.id('Completediagram')), 'Diagram');
    });
    it('Diagram SelectionChange', () => {
        executeClickEvent('Select-node');
        browser.compareScreen(element(by.id('Completediagram')), 'Diagram-SelectionChange');
    });
    it('Diagram scrollChange', () => {
        executeClickEvent('eventclear');
        executeClickEvent('scroll-node');
        browser.compareScreen(element(by.id('Completediagram')), 'DiagramscrollChange');
    });
    it('Diagram rotationchange', () => {
        executeClickEvent('eventclear');
        executeClickEvent('Select-node');
        executeClickEvent('Rotate-node');
        browser.compareScreen(element(by.id('Completediagram')), 'Diagramrotationchange');
    });
    it('Diagram collectionChange', () => {
        executeClickEvent('eventclear');
        executeClickEvent('Appearance-node');
        browser.compareScreen(element(by.id('Completediagram')), 'DiagramcollectionChange');
    });
    it('Diagram  sizeChange', () => {
        executeClickEvent('eventclear');
        executeClickEvent('Resize-node');
        browser.compareScreen(element(by.id('Completediagram')), 'DiagramsizeChange');
    });
    it('Diagram PositionChange', () => {
        executeClickEvent('eventclear');
        executeClickEvent('Drag-node');
        browser.compareScreen(element(by.id('Completediagram')), 'DiagramPositionChange');
    });
    it('Diagram sourcePointChange', () => {
        executeClickEvent('eventclear');
        executeClickEvent('sourcePointChange');
        browser.compareScreen(element(by.id('Completediagram')), 'sourcePointChange');
    });
    it('Diagram targetPointChange', () => {
        executeClickEvent('eventclear');
        executeClickEvent('sourcePointChange');
        browser.compareScreen(element(by.id('Completediagram')), 'targetPointChange');
    });
    it('Diagram Double click', () => {
        executeClickEvent('eventclear');
        browser.compareScreen(element(by.id('Completediagram')), 'Double click');
    });
    it('Diagram TextEdit', () => {
        executeClickEvent('eventclear');
        executeClickEvent('LabelEdit-node');
        browser.compareScreen(element(by.id('Completediagram')), 'TextEdit');
    });
    function executeClickEvent(id: string): void {
        let buttonElement: ElementFinder = element(By.id(id));
        buttonElement.click();
    }
    function waitForElementTextToChange() {
        return browser.wait(function () {
            return element(by.id('Completediagram')).isDisplayed();
        });
    }
});
