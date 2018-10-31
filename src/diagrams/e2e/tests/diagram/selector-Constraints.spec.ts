/**
 * spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { Diagram } from '../../../src/diagram/diagram';
import { browser, element, By, ElementFinder, by, protractor } from '@syncfusion/ej2-base/e2e/index';

describe('Diagram Selector', () => {
    it('Selector Render', () => {
        browser.sleep(5000);
        browser.load('/demos/constraints/selector.html');
        browser.compareScreen(element(By.id('diagram')), 'NoneSelectorConstraintsNode');
    });
    it('Selector NoneEnableSelectorConstraintsNode', () => {
        browser.load('/demos/constraints/selector.html');
        executeClickEvent('Node-Select');
        executeSelectionOption('None');
        browser.compareScreen(element(By.id('diagram')), 'NoneEnableSelectorConstraintsNode');
    });
    it('Selector NoneDisableSelectorConstraintsNode', () => {
        executeSelectionOption('None');
        executeClickEvent('Node-Select');
        browser.compareScreen(element(By.id('diagram')), 'NoneDisableSelectorConstraintsNode');
    });
    it('Selector NoneEnableSelectorConstraintsConnector', () => {
        browser.load('/demos/constraints/selector.html');
        executeClickEvent('Connector-Select');
        executeSelectionOption('None');
        browser.compareScreen(element(By.id('diagram')), 'NoneSelectorConstraintsConnector');
    });
    it('Selector NoneDisableSelectorConstraintsConnector', () => {
        executeSelectionOption('None');
        executeClickEvent('Connector-Select');
        browser.compareScreen(element(By.id('diagram')), 'NoneDisableSelectorConstraintsConnector');
    });
    it('Selector SourceThumbDisableSelectorConstraints', () => {
        executeClickEvent('Connector-Select');
        executeSelectionOption('ConnectorSourceThumb');
        browser.compareScreen(element(By.id('diagram')), 'SourceThumbDisableSelectorConstraints');
    });
    it('Selector SourceThumbEnableSelectorConstraints', () => {
        executeSelectionOption('ConnectorSourceThumb');
        browser.compareScreen(element(By.id('diagram')), 'SourceThumbEnableSelectorConstraints');
    });
    it('Selector TargetThumbDisableSelectorConstraints', () => {
        executeClickEvent('Connector-Select');
        executeSelectionOption('ConnectorTargetThumb');
        browser.compareScreen(element(By.id('diagram')), 'TargetThumbDisableSelectorConstraints');
    });
    it('Selector TargetThumbEnableSelectorConstraints', () => {
        executeSelectionOption('ConnectorTargetThumb');
        browser.compareScreen(element(By.id('diagram')), 'TargetThumbEnableSelectorConstraints');
    });
    it('Selector ResizeSouthEastDisableSelectorConstraints', () => {
        executeClickEvent('Node-Select');
        executeSelectionOption('ResizeSouthEast');
        browser.compareScreen(element(By.id('diagram')), 'ResizeSouthEastDisableSelectorConstraints');
    });
    it('Selector ResizeSouthEastEnableSelectorConstraints', () => {
        executeSelectionOption('ResizeSouthEast');
        browser.compareScreen(element(By.id('diagram')), 'ResizeSouthEastEnableSelectorConstraints');
    });
    it('Selector ResizeSouthWestDisableSelectorConstraints', () => {
        executeSelectionOption('ResizeSouthWest');
        browser.compareScreen(element(By.id('diagram')), 'ResizeSouthWestDisableSelectorConstraints');
    });
    it('Selector ResizeSouthWestEnableSelectorConstraints', () => {
        executeSelectionOption('ResizeSouthWest');
        browser.compareScreen(element(By.id('diagram')), 'ResizeSouthWestEnableSelectorConstraints');
    });
    it('Selector ResizeNorthEastDisableSelectorConstraints', () => {
        executeSelectionOption('ResizeNorthEast');
        browser.compareScreen(element(By.id('diagram')), 'ResizeNorthEastDisableSelectorConstraints');
    });
    it('Selector ResizeNorthEastWestEnableSelectorConstraints', () => {
        executeSelectionOption('ResizeNorthEast');
        browser.compareScreen(element(By.id('diagram')), 'ResizeNorthEastEnableSelectorConstraints');
    });
    it('Selector ResizeNorthWestDisableSelectorConstraints', () => {
        executeSelectionOption('ResizeNorthWest');
        browser.compareScreen(element(By.id('diagram')), 'ResizeNorthWestDisableSelectorConstraints');
    });
    it('Selector ResizeNorthWestEastWestEnableSelectorConstraints', () => {
        executeSelectionOption('ResizeNorthWest');
        browser.compareScreen(element(By.id('diagram')), 'ResizeNorthWestEnableSelectorConstraints');
    });
    it('Selector ResizeEastDisableSelectorConstraints', () => {
        executeSelectionOption('ResizeEast');
        browser.compareScreen(element(By.id('diagram')), 'ResizeEastDisableSelectorConstraints');
    });
    it('Selector ResizeEastEastWestEnableSelectorConstraints', () => {
        executeSelectionOption('ResizeEast');
        browser.compareScreen(element(By.id('diagram')), 'ResizeEastEnableSelectorConstraints');
    });
    it('Selector ResizeWestDisableSelectorConstraints', () => {
        executeSelectionOption('ResizeWest');
        browser.compareScreen(element(By.id('diagram')), 'ResizeWestDisableSelectorConstraints');
    });
    it('Selector ResizeWestEnableSelectorConstraints', () => {
        executeSelectionOption('ResizeWest');
        browser.compareScreen(element(By.id('diagram')), 'ResizeWestEnableSelectorConstraints');
    });
    it('Selector ResizeSouthDisableSelectorConstraints', () => {
        executeSelectionOption('ResizeSouth');
        browser.compareScreen(element(By.id('diagram')), 'ResizeSouthDisableSelectorConstraints');
    });
    it('Selector ResizeSouthEnableSelectorConstraints', () => {
        executeSelectionOption('ResizeSouth');
        browser.compareScreen(element(By.id('diagram')), 'ResizeSouthEnableSelectorConstraints');
    });
    it('Selector ResizeNorthDisableSelectorConstraints', () => {
        executeSelectionOption('ResizeNorth');
        browser.compareScreen(element(By.id('diagram')), 'ResizeNorthDisableSelectorConstraints');
    });
    it('Selector ResizeNorthEnableSelectorConstraints', () => {
        executeSelectionOption('ResizeNorth');
        browser.compareScreen(element(By.id('diagram')), 'ResizeNorthEnableSelectorConstraints');
    });
    it('Selector RotateDisableSelectorConstraints', () => {
        executeSelectionOption('Rotate');
        browser.compareScreen(element(By.id('diagram')), 'RotateDisableSelectorConstraints');
    });
    it('Selector RotateEnableSelectorConstraints', () => {
        executeSelectionOption('Rotate');
        browser.compareScreen(element(By.id('diagram')), 'RotateEnableSelectorConstraints');
    });
    it('Selector RotateDisableSelectorConstraints', () => {
        executeSelectionOption('Rotate');
        browser.compareScreen(element(By.id('diagram')), 'RotateDisableSelectorConstraints');
    });
    it('Selector RotateEnableSelectorConstraints', () => {
        executeSelectionOption('Rotate');
        browser.compareScreen(element(By.id('diagram')), 'RotateEnableSelectorConstraints');
    });
    it('Selector ToolTipDisableSelectorConstraints', () => {
        executeSelectionOption('ToolTip');
        executeClickEvent('NodeConstraints-Drag');
        browser.compareScreen(element(By.id('diagram')), 'ToolTipDisableSelectorConstraints');
    });
    it('Selector ToolTipEnableSelectorConstraints', () => {
        executeSelectionOption('ToolTip');
        executeClickEvent('NodeConstraints-Drag');
        browser.compareScreen(element(By.id('diagram')), 'ToolTipEnableSelectorConstraints');
    });
    it('Selector ResizeAllDisableSelectorConstraints', () => {
        executeClickEvent('Node-Select');
        executeSelectionOption('ResizeAll');
        browser.compareScreen(element(By.id('diagram')), 'ResizeAllDisableSelectorConstraints');
    });
    it('Selector ResizeAllEnableSelectorConstraints', () => {
        executeSelectionOption('ResizeAll');
        browser.compareScreen(element(By.id('diagram')), 'ResizeAllEnableSelectorConstraints');
    });
    it('Selector UserHandleDisableSelectorConstraintsNode', () => {
        executeClickEvent('Node-Select');
        executeSelectionOption('UserHandle');
        executeClickEvent('AddUserHandle');
        browser.compareScreen(element(By.id('diagram')), 'UserHandleDisableSelectorConstraintsNode');
    });
    it('Selector UserHandleEnableSelectorConstraints', () => {
        executeSelectionOption('UserHandle');
        executeClickEvent('AddUserHandle');
        browser.compareScreen(element(By.id('diagram')), 'UserHandleEnableSelectorConstraintsNode');
    });
    it('Selector UserHandleDisableSelectorConstraintsConnector', () => {
        executeClickEvent('Connector-Select');
        executeSelectionOption('UserHandle');
        executeClickEvent('AddUserHandle');
        browser.compareScreen(element(By.id('diagram')), 'UserHandleDisableSelectorConstraintsConnector');
    });
    it('Selector UserHandleEnableSelectorConstraintsConnector', () => {
        executeSelectionOption('UserHandle');
        executeClickEvent('AddUserHandle');
        browser.compareScreen(element(By.id('diagram')), 'UserHandleEnableSelectorConstraintsConnector');
    });

    function executeSelectionOption(id: string): void {
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
