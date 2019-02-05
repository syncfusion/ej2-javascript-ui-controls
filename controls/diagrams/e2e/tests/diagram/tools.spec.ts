/**
 * spec
 */
import { browser, element, By, ElementFinder, by } from '@syncfusion/ej2-base/e2e/index';

describe('Diagram Control', () => {
    it('Tool Rendering', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        //browser.compareScreen(element(By.id('diagram')), 'Rendering-Tool');
    });
    it('Orthogonal-DrawOnce', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('connectorType', 1);
        executeSelectionOption('Default');
        executeSelectionOption('DrawOnce');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'Orthogonal-DrawOnce');
    });
    it('Straight-DrawOnce', () => {
        changeConnectorType('connectorType', 0);
        executeSelectionOption('DrawOnce');
        executeSelectionOption('DrawOnce');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'Straight-DrawOnce');
    });
    it('Bezier-DrawOnce', () => {
        changeConnectorType('connectorType', 2);
        executeSelectionOption('DrawOnce');
        executeSelectionOption('DrawOnce');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'Bezier-DrawOnce');
    });
    it('Orthogonal-ContinuousDraw', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('connectorType', 1);
        executeSelectionOption('Default');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'Orthogonal-ContinuousDraw');
    });
    it('Straight-ContinuousDraw', () => {
        changeConnectorType('connectorType', 0);
        executeSelectionOption('ContinuousDraw');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'Straight-ContinuousDraw');
    });
    it('Bezier-ContinuousDraw', () => {
        changeConnectorType('connectorType', 2);
        executeSelectionOption('ContinuousDraw');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'Bezier-ContinuousDraw');
    });
    it('Rectangle-DrawOnce', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        executeSelectionOption('Default');
        executeSelectionOption('DrawOnce');
        changeConnectorType('basicShapes', 2);
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'Rectangle-DrawOnce');
    });
    it('Polygon-DrawOnce', () => {
        changeConnectorType('basicShapes', 5);
        executeSelectionOption('DrawOnce');
        executeSelectionOption('DrawOnce');
        executeClickEvent('Polygon');
        browser.compareScreen(element(By.id('diagram')), 'Polygon-DrawOnce');
    });
    it('Document-DrawOnce', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('flowShapes', 2);
        executeSelectionOption('Default');
        executeSelectionOption('DrawOnce');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'Document-DrawOnce');
    });
    it('PreDefinedProcess-DrawOnce', () => {
        changeConnectorType('flowShapes', 3);
        executeSelectionOption('DrawOnce');
        executeSelectionOption('DrawOnce');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'PreDefinedProcess-DrawOnce');
    });
    it('Path-DrawOnce', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('applyshapes', 2);
        executeSelectionOption('Default');
        executeSelectionOption('DrawOnce');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'Path-DrawOnce');
    });
    it('image-DrawOnce', () => {
        changeConnectorType('applyshapes', 3);
        executeSelectionOption('DrawOnce');
        executeSelectionOption('DrawOnce');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'image-DrawOnce');
    });
    it('svg-DrawOnce', () => {
        changeConnectorType('applyshapes', 4);
        executeSelectionOption('DrawOnce');
        executeSelectionOption('DrawOnce');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'svg-DrawOnce');
    });
    it('text-DrawOnce', () => {
        changeConnectorType('applyshapes', 5);
        executeSelectionOption('DrawOnce');
        executeSelectionOption('DrawOnce');
        executeClickEvent('EditText');
        browser.compareScreen(element(By.id('diagram')), 'text-DrawOnce');
    });
    it('Rectangle-ContinuousDraw', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('basicShapes', 2);
        executeSelectionOption('Default');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'Rectangle-ContinuousDraw');
    });
    it('Polygon-ContinuousDraw', () => {
        changeConnectorType('basicShapes', 5);
        executeSelectionOption('ContinuousDraw');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('Polygon');
        browser.compareScreen(element(By.id('diagram')), 'Polygon-ContinuousDraw');
    });
    it('Document-ContinuousDraw', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('flowShapes', 2);
        executeSelectionOption('Default');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'Document-ContinuousDraw');
    });
    it('PreDefinedProcess-ContinuousDraw', () => {
        changeConnectorType('flowShapes', 3);
        executeSelectionOption('ContinuousDraw');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'PreDefinedProcess-ContinuousDraw');
    });
    it('Path-ContinuousDraw', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('applyshapes', 3);
        executeSelectionOption('Default');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'Path-ContinuousDraw');
    });
    it('image-ContinuousDraw', () => {
        changeConnectorType('applyshapes', 4);
        executeSelectionOption('ContinuousDraw');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'image-ContinuousDraw');
    });
    it('svg-ContinuousDraw', () => {
        changeConnectorType('applyshapes', 5);
        executeSelectionOption('ContinuousDraw');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'svg-ContinuousDraw');
    });
    it('text-ContinuousDraw', () => {
        changeConnectorType('applyshapes', 6);
        executeSelectionOption('ContinuousDraw');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('EditText');
        browser.compareScreen(element(By.id('diagram')), 'text-ContinuousDraw');
    });
    it('SingleSelect-Node', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        executeSelectionOption('Default');
        executeSelectionOption('SingleSelect');
        executeClickEvent('select');
        executeClickEvent('multiselect');
        browser.compareScreen(element(By.id('diagram')), 'SingleSelect-Node');
    });
    it('Multiselect-Node', () => {
        executeSelectionOption('SingleSelect');
        executeSelectionOption('MultipleSelect');
        executeClickEvent('multiselect');
        browser.compareScreen(element(By.id('diagram')), 'Multiselect-Node');
    });
    it('SingleSelect-Connector', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        executeSelectionOption('Default');
        executeSelectionOption('SingleSelect');
        executeClickEvent('select-connector');
        executeClickEvent('multiselect-connector');
        browser.compareScreen(element(By.id('diagram')), 'SingleSelect-Connector');
    });
    it('Multiselect-Connector', () => {
        executeSelectionOption('SingleSelect');
        executeSelectionOption('MultipleSelect');
        executeClickEvent('multiselect-connector');
        browser.compareScreen(element(By.id('diagram')), 'Multiselect-Connector');
    });
    it('Multiselect-Drag', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        executeSelectionOption('Default');
        executeSelectionOption('MultipleSelect');
        executeClickEvent('AllDrag');
        browser.compareScreen(element(By.id('diagram')), 'Multiselect-Drag');
    });
    it('None-ToolConnector', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('connectorType', 1);
        executeSelectionOption('Default');
        executeSelectionOption('None');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'None-ToolConnector');
    });
    it('None-ToolShapes', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('flowShapes', 1);
        executeSelectionOption('Default');
        executeSelectionOption('None');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'None-ToolShapes');
    });
    it('ZoomPanContinuosDraw-ToolConnector', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('connectorType', 1);
        executeSelectionOption('Default');
        executeSelectionOption('ZoomPan');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'ZoomPanContinuosDraw-ToolConnector');
    });
    it('ZoomPanContinuos-ToolShapes', () => {
        changeConnectorType('flowShapes', 1);
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'ZoomPanContinuosDraw-ToolShapes');
    });
    it('ContinuosDrawSingleselect-ToolConnector', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('connectorType', 1);
        executeSelectionOption('Default');
        executeSelectionOption('SingleSelect');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'ContinuosDrawSingleselect-ToolConnector');
    });
    it('ContinuosDrawSingleselect-ToolShapes', () => {
        changeConnectorType('flowShapes', 1);
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'ContinuosDrawSingleselect-ToolShapes');
    });
    it('ContinuosDrawMultipleSelect-ToolConnector', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('connectorType', 1);
        executeSelectionOption('Default');
        executeSelectionOption('MultipleSelect');
        executeSelectionOption('ContinuousDraw');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'ContinuosDrawMultipleSelect-ToolConnector');
    });
    it('ContinuosDrawMultipleSelect-ToolShapes', () => {
        changeConnectorType('flowShapes', 1);
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'ContinuosDrawMultipleSelect-ToolShapes');
    });
    it('DrawOnceMultipleSelect-ToolConnector', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('connectorType', 1);
        executeSelectionOption('Default');
        executeSelectionOption('MultipleSelect');
        executeSelectionOption('DrawOnce');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'DrawOnceMultipleSelect-ToolConnector');
    });
    it('DrawOnceMultipleSelect-ToolShapes', () => {
        changeConnectorType('flowShapes', 1);
        executeSelectionOption('DrawOnce');
        executeSelectionOption('DrawOnce');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'DrawOnceMultipleSelect-ToolShapes');
    });
    it('DrawOnceSingleSelect-ToolConnector', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        changeConnectorType('connectorType', 1);
        executeSelectionOption('Default');
        executeSelectionOption('SingleSelect');
        executeSelectionOption('DrawOnce');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'DrawOnceSingleSelect-ToolConnector');
    });
    it('DrawOnceSingleSelect-ToolShapes', () => {
        changeConnectorType('flowShapes', 1);
        executeSelectionOption('DrawOnce');
        executeSelectionOption('DrawOnce');
        executeClickEvent('DrawObject');
        browser.compareScreen(element(By.id('diagram')), 'DrawOnceSingleSelect-ToolShapes');
    });
    it('Default-Tool', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        executeSelectionOption('Default');
        executeClickEvent('select');
        executeClickEvent('multiselect');
        browser.compareScreen(element(By.id('diagram')), 'Default-Tool');
    });
    it('ZoomPan-Tool', () => {
        browser.load('/demos/drawingTools/drawingTools.html');
        executeSelectionOption('Default');
        executeSelectionOption('ZoomPan');
        executeClickEvent('ZoomPanDiagram');
        browser.compareScreen(element(By.id('diagram')), 'ZoomPan-Tool');
    });

    it('Export-JPGContent', () => {
        browser.load('/demos/printandexport/printsettings.html');
        changeConnectorType('regionTypes', 2);
        changeConnectorType('exportTypes', 1);
        executeClickEvent('exportdivelement');
        browser.compareScreen(element(By.id('printingwindow')), 'Export-JPGContent');
    });
    it('Export-PNGContent', () => {
        browser.load('/demos/printandexport/printsettings.html');
        changeConnectorType('regionTypes', 2);
        changeConnectorType('exportTypes', 2);
        executeClickEvent('exportdivelement');
        browser.compareScreen(element(By.id('printingwindow')), 'Export-PNGContent');
    });
    it('Export-BMPContent', () => {
        browser.load('/demos/printandexport/printsettings.html');
        changeConnectorType('regionTypes', 2);
        changeConnectorType('exportTypes', 3);
        executeClickEvent('exportdivelement');
        browser.compareScreen(element(By.id('printingwindow')), 'Export-BMPContent');
    });
    it('Export-JPGPageSettings', () => {
        browser.load('/demos/printandexport/printsettings.html');
        changeConnectorType('regionTypes', 1);
        changeConnectorType('exportTypes', 1);
        executeClickEvent('exportdivelement');
        browser.compareScreen(element(By.id('printingwindow')), 'Export-JPGPageSettings');
    });
    it('Export-PNGPageSettings', () => {
        browser.load('/demos/printandexport/printsettings.html');
        changeConnectorType('regionTypes', 1);
        changeConnectorType('exportTypes', 2);
        executeClickEvent('exportdivelement');
        browser.compareScreen(element(By.id('printingwindow')), 'Export-PNGPageSettings');
    });
    it('Export-BMPPageSettings', () => {
        browser.load('/demos/printandexport/printsettings.html');
        changeConnectorType('regionTypes', 1);
        changeConnectorType('exportTypes', 3);
        executeClickEvent('exportdivelement');
        browser.compareScreen(element(By.id('printingwindow')), 'Export-BMPPageSettings');
    });
    it('Keyboard-default', () => {
        browser.load('/demos/keyboard/key-board-functions.html');
        browser.compareScreen(element(By.id('diagram')), 'Keyboard-default');
    });
    it('Keyboard-KeynavigationDown', () => {
        browser.load('/demos/keyboard/key-board-functions.html');
        executeClickEvent('KeynavigationDown');
        browser.compareScreen(element(By.id('diagram')), 'Keyboard-KeynavigationDown');
    });
    it('Keyboard-KeynavigationUp', () => {
        executeClickEvent('KeynavigationUp');
        browser.compareScreen(element(By.id('diagram')), 'Keyboard-KeynavigationUp');
    });
    it('Keyboard-KeynavigationRight', () => {
        executeClickEvent('KeynavigationDown');
        executeClickEvent('KeynavigationRight');
        executeClickEvent('KeynavigationRight');
        browser.compareScreen(element(By.id('diagram')), 'Keyboard-KeynavigationRight');
    });
    it('Keyboard-KeynavigationLeft', () => {
        executeClickEvent('KeynavigationLeft');
        browser.compareScreen(element(By.id('diagram')), 'Keyboard-KeynavigationLeft');
    });
    it('Keyboard-CustomCommand', () => {
        executeClickEvent('KeynavigationLeft');
        executeClickEvent('CustomCommand');
        browser.compareScreen(element(By.id('diagram')), 'Keyboard-CustomCommand');
    });
    it('scrollSettings-scrollLimit-Diagram', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        changeConnectorType('ScrollLimit', 0);
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-scrollLimitDiagram');
    });

    it('scrollSettings-scrollLimitInfinity', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        changeConnectorType('ScrollLimit', 1);
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-scrollLimitInfinity');
    });

    it('scrollSettings-Limited', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        changeConnectorType('ScrollLimit', 2);
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-Limited');
    });

    it('scrollSettings-autoScrollBorder', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        executeClickEvent('autoScrollBorder');
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-autoScrollBorder');
    });

    it('scrollSettings-EnablecanAutoScroll', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        executeClickEvent('EnablecanAutoScroll');
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-EnablecanAutoScroll');
    });

    it('scrollSettings-DisablecanAutoScroll', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        executeClickEvent('DisablecanAutoScroll');
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-DisablecanAutoScroll');
    });

    it('scrollSettings-currentZoom', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        executeClickEvent('currentZoom');
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-currentZoom');
    });

    it('scrollSettings-horizontalOffset', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        executeClickEvent('horizontalOffset');
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-horizontalOffset');
    });

    it('scrollSettings-maxZoom', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        executeClickEvent('maxZoom');
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-maxZoom');
    });

    it('scrollSettings-minZoom', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        executeClickEvent('minZoom');
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-minZoom');
    });

    it('scrollSettings-scrollableArea', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        executeClickEvent('scrollableArea');
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-scrollableArea');
    });

    it('scrollSettings-verticalOffset', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        executeClickEvent('verticalOffset');
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-verticalOffset');
    });

    it('scrollSettings-viewPortHeight', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        executeClickEvent('viewPortHeight');
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-viewPortHeight');
    });

    it('scrollSettings-viewPortWidth', () => {
        browser.load('/demos/scrollSettings/scrollSettings.html');
        executeClickEvent('viewPortWidth');
        browser.compareScreen(element(By.id('printingwindow')), 'scrollSettings-viewPortWidth');
    });

    function executeClickEvent(id: string): void {
        let buttonElement: ElementFinder = element(By.id(id));
        buttonElement.click();
    }
    function executeSelectionOption(id: string): void {
        let selectObject: ElementFinder = element(by.id('selectBox'));
        selectObject.click();
        let options: ElementFinder = element(by.id(id));
        options.click();
        selectObject.click();
    }
    function changeConnectorType(id: string, index: number): void {
        let buttonElement: ElementFinder = element(By.id(id));
        buttonElement.all(by.tagName('option'))
            .then((options: any) => {
                options[index].click();
            });
    }
});
