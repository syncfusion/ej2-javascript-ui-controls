/**
 * connector spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { browser, element, By, by, ElementFinder } from '@syncfusion/ej2-base/e2e/index';
let selectObjects: ElementFinder; let options: ElementFinder;
let undo: ElementFinder = element(by.id('undo'));
let redo: ElementFinder = element(by.id('redo'));
let copy: ElementFinder = element(by.id('copy'));
let paste: ElementFinder = element(by.id('paste'));
let drawingTools: ElementFinder = element(by.id('drawingTools'));
let addLabel: ElementFinder = element(by.id('addLabel'));
let removeLabel: ElementFinder = element(by.id('removeLabel'));
let addConnector: ElementFinder = element(by.id('addConnector'));
let removeConnector: ElementFinder = element(by.id('removeConnector'));
let cornerRadius: ElementFinder = element(by.id('cornerRadius'));
describe('Diagram Control', () => {
    describe('Default Connector - Straight', () => {
        it('Rendering', () => {
            browser.load('/demos/prevent-default/prevent-default-nodes.html');
        });
        it('Interaction -(default connector)', () => {
            browser.load('/demos/prevent-default/prevent-default-nodes.html');
            executeSave('btnSave');
            browser.compareScreen(element(By.id('diagram')), 'prevent-default-nodes');
        });
    });
    function executeSave(id: string): void {
        let buttonElement: ElementFinder = element(By.id(id));
        buttonElement.click();
    }
    // function executeSelectionEvent(id: string, index: number): void {
    //     let buttonElement: ElementFinder = element(By.id(id));
    //     buttonElement.all(by.tagName('option'))
    //         .then((options: any) => {
    //             options[index].click();
    //         });
    // }
    // function executeselectionOption(id: string): void {
    //     let selectObject: ElementFinder = element(by.id('selectBox'));
    //     selectObject.click();
    //     let options: ElementFinder = element(by.id(id));
    //     options.click();
    //     selectObject.click();
    // }
    // function executeClickEvent(id: string): void {
    //     let buttonElement: ElementFinder = element(By.id(id));
    //     buttonElement.click();
    // }
});