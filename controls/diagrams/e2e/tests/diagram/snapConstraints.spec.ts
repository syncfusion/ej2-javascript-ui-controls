/**
 * spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { browser, element, By, ElementFinder, by } from '@syncfusion/ej2-base/e2e/index';

describe('Diagram Snapping', () => {

    it('SnapConstraints Load', () => {
        browser.load('/demos/constraints/snapping.html');
        browser.compareScreen(element(By.id('diagram')), 'SnapConstraints');
    });
    it('NoneSnapConstraintsEnable', () => {
        browser.load('/demos/constraints/snapping.html');
        executeSelectionOption('None');
        browser.compareScreen(element(By.id('diagram')), 'NoneSnapConstraintsEnable');
    });
    it('NoneSnapConstraintsDisable', () => {
        executeSelectionOption('None');
        browser.compareScreen(element(By.id('diagram')), 'NoneSnapConstraintsDisable');
    });
    it('ShowHorizontalLinesSnapDisable', () => {
        browser.load('/demos/constraints/snapping.html');
        executeSelectionOption('ShowHorizontalLines');
        browser.compareScreen(element(By.id('diagram')), 'ShowHorizontalLinesSnapDisable');
    });
    it('ShowHorizontalLinesSnapEnable', () => {
        executeSelectionOption('ShowHorizontalLines');
        browser.compareScreen(element(By.id('diagram')), 'ShowHorizontalLinesSnapEnable');
    });

    it('ShowVerticalLinesSnapDisable', () => {
        executeSelectionOption('ShowVerticalLines');
        browser.compareScreen(element(By.id('diagram')), 'ShowVerticalLinesSnapDisable');
    });
    it('ShowVerticalLinesSnapEnable', () => {
        browser.load('/demos/constraints/snapping.html');
        executeSelectionOption('ShowVerticalLines');
        browser.compareScreen(element(By.id('diagram')), 'ShowVerticalLinesSnapEnable');
    });
    it('ShowLinesSnapDisable', () => {
        executeSelectionOption('ShowLines');
        browser.compareScreen(element(By.id('diagram')), 'ShowLinesSnapDisable');
    });
    it('ShowLinesSnapEnable', () => {
        executeSelectionOption('ShowLines');
        browser.compareScreen(element(By.id('diagram')), 'ShowLinesSnapEnable');
    });
    it('SnapToObjectSnapEnable', () => {
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('SnapToObject');
        executeClickEvent('SnapResizeWidth-node');
        browser.compareScreen(element(By.id('diagram')), 'SnapToObjectSnapEnable');
    });
    it('SnapToObjectSnapDisable', () => {
        browser.load('/demos/constraints/snapping.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('SnapToObject');
        executeClickEvent('SnapResizeWidth-node');
        browser.compareScreen(element(By.id('diagram')), 'SnapToObjectSnapDisable');
    });

    it('AllSnapDisable', () => {
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('All');
        executeClickEvent('SnapResizeWidth-node');
        browser.compareScreen(element(By.id('diagram')), 'AllSnapDisable');
    });
    it('AllSnapEnable', () => {
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('All');
        executeClickEvent('SnapResizeWidth-node');
        browser.compareScreen(element(By.id('diagram')), 'AllSnapEnable');
    });
    it('EnableDiagramBoundaryConstraintsConnector', () => {
        browser.load('/demos/constraints/snapping.html');
        executeSelectionOption('ShowLines');
        executeSelectionOption1('Diagram');
        executeClickEvent('SetDiagramSize');
        executeClickEvent('AddConnector');
        executeClickEvent('DragConnector');
        browser.compareScreen(element(By.id('diagram')), 'EnableDiagramBoundaryConstraintsConnector');
    });
    it('DisableDiagramBoundaryConstraintsConnector', () => {
        browser.load('/demos/constraints/snapping.html');
        executeSelectionOption('ShowLines');
        executeClickEvent('SetDiagramSize');
        executeClickEvent('AddConnector');
        executeClickEvent('DragConnector');
        browser.compareScreen(element(By.id('diagram')), 'DisableDiagramBoundaryConstraintsConnector');
    });
    it('EnableDiagramBoundaryConstraintsNode', () => {
        browser.load('/demos/constraints/snapping.html');
        executeSelectionOption('ShowLines');
        executeSelectionOption1('Diagram');
        executeClickEvent('SetDiagramSize');
        executeClickEvent('NodeConstraints-Drag');
        browser.compareScreen(element(By.id('diagram')), 'EnableDiagramBoundaryConstraintsNode');
    });
    it('DisableDiagramBoundaryConstraintsNode', () => {
        browser.load('/demos/constraints/snapping.html');
        executeSelectionOption('ShowLines');
        executeClickEvent('SetDiagramSize');
        executeClickEvent('NodeConstraints-Drag');
        browser.compareScreen(element(By.id('diagram')), 'DisableDiagramBoundaryConstraintsNode');
    });
    it('EnablePageBoundaryConstraintsNode', () => {
        browser.load('/demos/constraints/snapping.html');
        executeSelectionOption('ShowLines');
        executeSelectionOption1('Page');
        executeClickEvent('SetPageSetting');
        executeClickEvent('NodeConstraints-Drag');
        browser.compareScreen(element(By.id('diagram')), 'EnablePageBoundaryConstraintsNode');
    });
    it('DisablePageBoundaryConstraintsNode', () => {
        browser.load('/demos/constraints/snapping.html');
        executeSelectionOption('ShowLines');
        executeClickEvent('SetPageSetting');
        executeClickEvent('NodeConstraints-Drag');
        browser.compareScreen(element(By.id('diagram')), 'DisablePageBoundaryConstraintsNode');
    });
    it('EnablePageBoundaryConstraintsConnector', () => {
        browser.load('/demos/constraints/snapping.html');
        executeSelectionOption('ShowLines');
        executeSelectionOption1('Page');
        executeClickEvent('SetPageSetting');
        executeClickEvent('AddConnector');
        executeClickEvent('DragConnector');
        browser.compareScreen(element(By.id('diagram')), 'EnablePageBoundaryConstraintsConnector');
    });
    it('DisableDiagramBoundaryConstraintsConnector', () => {
        browser.load('/demos/constraints/snapping.html');
        executeSelectionOption('ShowLines');
        executeClickEvent('SetPageSetting');
        executeClickEvent('AddConnector');
        executeClickEvent('DragConnector');
        browser.compareScreen(element(By.id('diagram')), 'DisablePageBoundaryConstraintsConnector');
    });

    function executeSelectionOption(id: string): void {
        let selectObject: ElementFinder = element(by.id('selectBox'));
        selectObject.click();
        let options: ElementFinder = element(by.id(id));
        options.click();
        selectObject.click();
    }
    function executeSelectionOption1(id: string): void {
        let selectObject: ElementFinder = element(by.id('selectBox'));
        selectObject.click();
        let options: ElementFinder = element(by.id(id));
        options.click();
        selectObject.click();
    }
    function executeClickEvent(id: string): void {
        let buttonElement: ElementFinder = element(By.id(id));
        buttonElement.click();
    }

});
