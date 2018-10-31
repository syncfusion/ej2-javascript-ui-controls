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
            browser.load('/demos/connectors/connector.html')
        });
        it('Interaction -(default connector)', () => {
            executeSelectionEvent('selectionOption', 1);
            executeClickEvent('connectorInteraction');
            browser.compareScreen(element(By.id('diagram')), 'default-connector-interaction');
        });
        it('Drawing tool - Connectors', () => {
            executeClickEvent('drawConnectorUsingDrawingTool');
            browser.compareScreen(element(By.id('diagram')), 'draw-straight-connector');
        });
        it('Copy paste -(default connector)', () => {
            copy.click();
            paste.click();
            browser.compareScreen(element(By.id('diagram')), 'default-connector-copy-paste');
        });
        it('Remove Connector -(default connector)', () => {
            removeConnector.click();
            browser.compareScreen(element(By.id('diagram')), 'default-connector-remove-connector');
        });
        it('add label -(default connector)', () => {
            executeSelectionEvent('selectionOption', 4);
            executeClickEvent('addLabel');
            browser.compareScreen(element(By.id('diagram')), 'default-connector-with-label-select');
        });
        it('Interaction -(default connector with label)', () => {
            executeClickEvent('connectorInteraction');
            browser.compareScreen(element(By.id('diagram')), 'default-connector-with-label-drag');
        });
        it('Copy paste -(default connector with label)', () => {
            copy.click();
            paste.click();
            browser.compareScreen(element(By.id('diagram')), 'default-connector-with-label-copy-paste');
        });
        it('Remove Connector -(default connector with label)', () => {
            removeConnector.click();
            browser.compareScreen(element(By.id('diagram')), 'default-connector-with-label-remove-connector');
        });
        it('Undo -(default connector with label)', () => {
            undo.click();
            browser.compareScreen(element(By.id('diagram')), 'default-connector-with-label-undo1');
        });
        it('Redo -(default connector with label)', () => {
            redo.click();
            browser.compareScreen(element(By.id('diagram')), 'default-connector-with-label-redo1');
        });
    });
    describe('Default Connector - Orthogonal', () => {

        it('Interaction - (default connector)', () => {
            browser.load('/demos/connectors/connector.html');
            executeSelectionEvent('selectionOption', 5);
            executeClickEvent('connectorInteraction');
            browser.compareScreen(element(By.id('diagram')), 'default-ortho-interaction');
        });

        it('add label -(default connector)', () => {
            executeSelectionEvent('selectionOption', 8);
            executeClickEvent('addLabel');
            browser.compareScreen(element(By.id('diagram')), 'default-ortho-with-label-select');
        });
        it('Interaction -(default connector with label)', () => {
            executeClickEvent('connectorInteraction');
            browser.compareScreen(element(By.id('diagram')), 'default-ortho-with-label-interaction');
        });

        it('Style', () => {
            executeClickEvent('connectorStyle');
            browser.compareScreen(element(By.id('diagram')), 'connector-style');
        });

        it('Properties', () => {
            executeClickEvent('connectorProperties');
            browser.compareScreen(element(By.id('diagram')), 'connector-properties');
        });
        it('Bezier - interaction', () => {
            executeSelectionEvent('selectionOption', 6);
            executeClickEvent('connectorInteraction');
            browser.compareScreen(element(By.id('diagram')), 'connector-bezier-interaction');
        });
        it('Multiple Selection - Connector interaction', () => {
            browser.load('/demos/connectors/connector.html');
            debugger
            executeClickEvent('MultipleSelection');
            executeSelectionEvent('selectionOption', 1);
            executeSelectionEvent('selectionOption', 2);
            executeSelectionEvent('selectionOption', 3);
            executeClickEvent('connectorInteraction');
            browser.compareScreen(element(By.id('diagram')), 'MultipleSelection-Connector-Interaction');
        });
    });

    describe('Connector - Docking and Segment Editing(Orthogonal)', () => {
        let connect: ElementFinder = element(by.id('connect'));
        let disConnect: ElementFinder = element(by.id('disConnect'));
        let dragsegmentEditing: ElementFinder = element(by.id('segmentEditing'));
        let dragsegmentEditing1: ElementFinder = element(by.id('segmentEditing1'));
        let dragsegmentEditing2: ElementFinder = element(by.id('segmentEditing2'));
        let dragsegmentEditing5: ElementFinder = element(by.id('segmentEditing6'));
        let dragsegmentEditing6: ElementFinder = element(by.id('segmentEditing7'));
        it('Render - Docking', () => {
            browser.load('/demos/connectors/dock.html');
            browser.compareScreen(element(By.id('diagram')), 'Connector-docking');
        });
        it('DisConnect - node to point(default Connector) ', () => {
            disConnect.click();
            browser.compareScreen(element(By.id('diagram')), 'Connector-disconnect');
        });

        it('SegmentEditing - Drag the intermediate segment', () => {
            dragsegmentEditing.click();
            browser.compareScreen(element(By.id('diagram')), 'Connector-SegmentEditing1');
        });

        it('SegmentEditing - Drag the second segment over lap to node(port connection)', () => {
            dragsegmentEditing1.click();
            browser.compareScreen(element(By.id('diagram')), 'Connector-SegmentEditing2');
        });

        it('SegmentEditing - DisConnect (port to point)', () => {
            dragsegmentEditing5.click();
            browser.compareScreen(element(By.id('diagram')), 'Connector-SegmentEditing-disconnect');
        });

        it('SegmentEditing - Connect (point to node)', () => {
            dragsegmentEditing5.click();
            browser.compareScreen(element(By.id('diagram')), 'Connector-SegmentEditing-connect');
        });
    });
    describe('Connector - Bridging', () => {
        it('add connector overlap to existing connector', () => {
            browser.load('/demos/connectors/connector.html')
            selectObjects = element(by.id('connectorbridging'));
            selectObjects.click();
            browser.compareScreen(element(By.id('diagram')), 'selectObjects-addNewConnector-Bridging');
        });
        it('Drag connector - Briging', () => {
            selectObjects = element(by.id('selectionOption'));
            selectObjects.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            options = element(by.id('interaction'));
            options.all(by.tagName('option'))
                .then((options: any) => {
                    options[1].click();
                });
            browser.compareScreen(element(By.id('diagram')), 'default-MultipleSelection-drag-Briging');
        });
    });

    function executeSelectionEvent(id: string, index: number): void {
        let buttonElement: ElementFinder = element(By.id(id));
        buttonElement.all(by.tagName('option'))
            .then((options: any) => {
                options[index].click();
            });
    }
    function executeselectionOption(id: string): void {
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