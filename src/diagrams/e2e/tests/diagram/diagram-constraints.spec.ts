/**
 * spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { browser, element, By, ElementFinder, by } from '@syncfusion/ej2-base/e2e/index';

describe('Diagram Control', () => {
    it('Diagram rendering', () => {        
        browser.load('/demos/constraints/diagram.html');
    });
    it('Diagram NoneEnableConstraints', () => {
        executeSelectionOption('None');
        executeClickEvent('NodeConstraints-Select');
        browser.compareScreen(element(By.id('diagram')), 'NoneConstraints-Diagram');
    });
    it('Diagram NoneDisableConstraints', () => {
        executeSelectionOption('None');
        executeClickEvent('NodeConstraints-Select');
        browser.compareScreen(element(By.id('diagram')), 'NoneConstraints-Diagram');
    });
    it('Diagram BridgingEnableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('Bridging');
        executeClickEvent('Bridging1');
        browser.compareScreen(element(By.id('diagram')), 'BridgingConstraints-Diagram');
    });
    it('Diagram BridgingDisableConstraints', () => {
        executeSelectionOption('Bridging');
        executeClickEvent('Bridging1');
        browser.compareScreen(element(By.id('diagram')), 'BridgingConstraints-Diagram');
    });
    it('Diagram UndoEnableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('UndoRedo');
        executeClickEvent('NodeConstraints-Select');
        executeClickEvent('SnapResizeWidth-node');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        executeClickEvent('Undo');
        browser.compareScreen(element(By.id('diagram')), 'UndoEnableConstraints-Diagram');
    });
    it('Diagram RedoEnableConstraints', () => {
        executeClickEvent('Redo');
        browser.compareScreen(element(By.id('diagram')), 'RedoEnableConstraints-Diagram');
    });
    it('Diagram UndoDisableConstraints', () => {
        executeSelectionOption('UndoRedo');
        executeClickEvent('NodeConstraints-Select');
        executeClickEvent('SnapResizeWidth-node');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        executeClickEvent('Undo');
        browser.compareScreen(element(By.id('diagram')), 'UndoDisableConstraints-Diagram');
    });
    it('Diagram RedoDisableConstraints', () => {
        executeClickEvent('Redo');
        browser.compareScreen(element(By.id('diagram')), 'RedoDisableConstraints-Diagram');
    });
    it('Diagram ToolTipEnableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('Tooltip');
        executeClickEvent('NodeConstraints-ToolTip');
        browser.compareScreen(element(By.id('diagram')), 'ToolTipEnableConstraints-Diagram');
    });
    it('Diagram ToolTipDisableConstraints', () => {
        executeSelectionOption('Tooltip');
        executeClickEvent('NodeConstraints-ToolTip');
        browser.compareScreen(element(By.id('diagram')), 'ToolTipDisableConstraints-Diagram');
    });
    it('Diagram UserInteractionEnableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('UserInteraction');
        executeClickEvent('NodeConstraints-Select');
        executeClickEvent('SnapResizeWidth-node');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        browser.compareScreen(element(By.id('diagram')), 'UserInteractionEnableConstraints-Diagram');
    });
    it('Diagram UserInteractionDisableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('UserInteraction');
        executeSelectionOption('UserInteraction');
        executeClickEvent('NodeConstraints-Select');
        executeClickEvent('SnapResizeWidth-node');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        browser.compareScreen(element(By.id('diagram')), 'UserInteractionDisableConstraints-Diagram');
    });
    it('Diagram PageEditingEnableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('PageEditable');
        executeClickEvent('NodeConstraints-Select');
        executeClickEvent('SnapResizeWidth-node');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        browser.compareScreen(element(By.id('diagram')), 'PageEditingEnableConstraints-Diagram');
    });
    it('Diagram PageEditingnDisableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('PageEditable');
        executeSelectionOption('PageEditable');
        executeClickEvent('NodeConstraints-Select');
        executeClickEvent('SnapResizeWidth-node');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        browser.compareScreen(element(By.id('diagram')), 'PageEditingDisableConstraints-Diagram');
    });
    it('Diagram PanEnableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('Pan');
        executeClickEvent('ZoomPan');
        executeClickEvent('ZoomPanDiagram');
        browser.compareScreen(element(By.id('diagram')), 'PanEnableConstraints-Diagram');
    });
    it('Diagram PandisableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('Pan');
        executeSelectionOption('Pan');
        executeClickEvent('ZoomPan');
        executeClickEvent('ZoomPanDiagram');
        browser.compareScreen(element(By.id('diagram')), 'PanDisableConstraints-Diagram');
    });
    it('Diagram PanXEnableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('Pan');
        executeSelectionOption('Pan');
        executeSelectionOption('PanX');
        executeClickEvent('ZoomPan');
        executeClickEvent('ZoomPanDiagram');
        browser.compareScreen(element(By.id('diagram')), 'PanXEnableConstraints-Diagram');
    });
    it('Diagram PanXdisableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('Pan');
        executeSelectionOption('Pan');
        executeSelectionOption('PanX');
        executeSelectionOption('PanX');
        executeClickEvent('ZoomPan');
        executeClickEvent('ZoomPanDiagram');
        browser.compareScreen(element(By.id('diagram')), 'PanXDisableConstraints-Diagram');
    });
    it('Diagram PanYEnableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('Pan');
        executeSelectionOption('Pan');
        executeSelectionOption('PanY');
        executeClickEvent('ZoomPan');
        executeClickEvent('ZoomPanDiagram');
        browser.compareScreen(element(By.id('diagram')), 'PanYEnableConstraints-Diagram');
    });
    it('Diagram PanYDisableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('Pan');
        executeSelectionOption('Pan');
        executeSelectionOption('PanY');
        executeSelectionOption('PanY');
        executeClickEvent('ZoomPan');
        executeClickEvent('ZoomPanDiagram');
        browser.compareScreen(element(By.id('diagram')), 'PanYDisableConstraints-Diagram');
    });
    it('Diagram ZoomInEnableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('Zoom');
        executeClickEvent('ZoomInDiagram');
        browser.compareScreen(element(By.id('diagram')), 'ZoomInEnableConstraints-Diagram');
    });
    it('Diagram ZoomIndisableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('Zoom');
        executeSelectionOption('Zoom');
        executeClickEvent('ZoomInDiagram');
        browser.compareScreen(element(By.id('diagram')), 'ZoomInDisableConstraints-Diagram');
    });
    it('Diagram ZoomOutEnableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('Zoom');
        executeClickEvent('ZoomOutDiagram');
        browser.compareScreen(element(By.id('diagram')), 'ZoomOutEnableConstraints-Diagram');
    });
    it('Diagram ZoomOutdisableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('Zoom');
        executeSelectionOption('Zoom');
        executeClickEvent('ZoomOutDiagram');
        browser.compareScreen(element(By.id('diagram')), 'ZoomOutDisableConstraints-Diagram');
    });
    it('Diagram DefaultDisableConstraints', () => {
        browser.load('/demos/constraints/diagram.html');
        executeSelectionOption('Default');
        executeClickEvent('NodeConstraints-Select');
        executeClickEvent('SnapResizeWidth-node');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        browser.compareScreen(element(By.id('diagram')), 'DefaultDisableConstraints-Diagram');
    });
    it('Diagram DefaultEnableConstraints', () => {
        executeSelectionOption('Default');
        executeClickEvent('NodeConstraints-Select');
        executeClickEvent('SnapResizeWidth-node');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        browser.compareScreen(element(By.id('diagram')), 'DefaultEnableConstraints-Diagram');
    });


    
    function executeSelectionOption(id: string): void {
        // let selectObject: ElementFinder = element(by.id('selectBox'));
        // selectObject.click();
        let options: ElementFinder = element(by.id(id));
        options.click();
        // selectObject.click();
    }
    function executeClickEvent(id: string): void {
        let buttonElement: ElementFinder = element(By.id(id));
        buttonElement.click();
    }
    function waitForElementTextToChange() {
        return browser.wait(function () {
            return element(by.id('diagram')).isDisplayed();
        });
    }
});
