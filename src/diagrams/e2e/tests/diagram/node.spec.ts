/**
 * spec
 */
import { browser, element, By, ElementFinder, by } from '@syncfusion/ej2-base/e2e/index';
import { Diagram } from '../../../src';

describe('Diagram Control', () => {
    it('Node Rendering', () => {
        browser.load('/demos/nodes/node.html');
        browser.compareScreen(element(By.id('diagram')), 'default-Node');
    });
    it('Node Appearance', () => {
        browser.load('/demos/nodes/node.html');
        executeClickEvent('Appearance-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Appearance');
    });
    it('Node Selection', () => {
        executeClickEvent('Select-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Selection');
    });
    it('Node Drag', () => {
        executeClickEvent('Drag-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Drag');
    });
    it('Node Resize', () => {
        executeClickEvent('Resize-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Resize');
    });
    it('Node Rotate', () => {
        executeClickEvent('Rotate-node');
        browser.compareScreen(element(By.id('diagram')), 'Node-Rotate');
    });
    it('Node Label', () => {
        executeClickEvent('Label-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Label');
    });
    it('Node LabelAppearance', () => {
        executeClickEvent('LabelAppearance-node');
        browser.compareScreen(element(By.id('diagram')), 'node-LabelAppearance');
    });
    it('Node LabelEdit', () => {
        executeClickEvent('LabelEdit-node');
        browser.compareScreen(element(By.id('diagram')), 'node-LabelEdit');
    });
    it('Node Port', () => {
        executeClickEvent('Port-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Port');
    });
    it('Node Connection', () => {
        executeClickEvent('Connection-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Connection');
    });
    it('Node Group', () => {
        executeClickEvent('Group-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Group');
    });
    it('Node UnGroup', () => {
        executeClickEvent('UnGroup-node');
        browser.compareScreen(element(By.id('diagram')), 'node-UnGroup');
    });
    it('Node Scrolling', () => {
        executeClickEvent('Scroll-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Scroll');
    });
    it('Node Delete', () => {
        executeClickEvent('Delete-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Delete');
    });
    it('Node CopyPaste', () => {
        executeClickEvent('CopyPaste-node');
        browser.compareScreen(element(By.id('diagram')), 'node-CopyPaste');
    });
    it('Node CutPaste', () => {
        executeClickEvent('CutPaste-node');
        browser.compareScreen(element(By.id('diagram')), 'node-CutPaste');
    });
    it('Node SaveLoad', () => {
        executeClickEvent('SaveLoad-node');
        browser.compareScreen(element(By.id('diagram')), 'node-SaveLoad');
    });
    it('Node SelectAll', () => {
        executeClickEvent('SelectAll-node');
        browser.compareScreen(element(By.id('diagram')), 'node-SelectAll');
    });
    it('Node SizingWidth', () => {
        executeClickEvent('SizingWidth-node');
        browser.compareScreen(element(By.id('diagram')), 'node-SizingWidth');
    });
    it('Node SizingHeight', () => {
        executeClickEvent('SizingHeight-node');
        browser.compareScreen(element(By.id('diagram')), 'node-SizingHeight');
    });
    it('Node Size', () => {
        executeClickEvent('Size-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Size');
    });
    it('Node ALeft', () => {
        browser.load('/demos/nodes/node.html');
        executeClickEvent('ALeft-node');
        browser.compareScreen(element(By.id('diagram')), 'node-A-Left');
    });
    it('Node ARight', () => {
        executeClickEvent('ARight-node');
        browser.compareScreen(element(By.id('diagram')), 'node-A-Right');
    });
    it('Node ATop', () => {
        executeClickEvent('ATop-node');
        browser.compareScreen(element(By.id('diagram')), 'node-A-Top');
    });
    it('Node ABottom', () => {
        executeClickEvent('ABottom-node');
        browser.compareScreen(element(By.id('diagram')), 'node-A-Bottom');
    });
    it('Node ACenter', () => {
        executeClickEvent('ACenter-node');
        browser.compareScreen(element(By.id('diagram')), 'node-A-Center');
    });
    it('Node AMiddle', () => {
        executeClickEvent('AMiddle-node');
        browser.compareScreen(element(By.id('diagram')), 'node-A-Middle');
    });
    it('Node DHorizontalLeft', () => {
        executeClickEvent('DHLeft-node');
        browser.compareScreen(element(By.id('diagram')), 'node-D-HorizontalLeft');
    });
    it('Node DHorizontalR', () => {
        executeClickEvent('DHRight-node');
        browser.compareScreen(element(By.id('diagram')), 'node-D-HorizontalRight');
    });
    it('Node DVerticalTop', () => {
        executeClickEvent('DVTop-node');
        browser.compareScreen(element(By.id('diagram')), 'node-D-VerticalTop');
    });
    it('Node DVerticalBottom', () => {
        executeClickEvent('DVBottom-node');
        browser.compareScreen(element(By.id('diagram')), 'node-D-VerticalBottom');
    });
    it('Node SendToBack', () => {
        browser.load('/demos/nodes/node.html');
        executeClickEvent('SendToBack-node');
        browser.compareScreen(element(By.id('diagram')), 'node-SendToBack');
    });
    it('Node BringToFront', () => {
        executeClickEvent('BringToFront-node');
        browser.compareScreen(element(By.id('diagram')), 'node-BringToFront');
    });
    it('Node SendBackward', () => {
        executeClickEvent('SendBackward-node');
        browser.compareScreen(element(By.id('diagram')), 'node-SendBackward');
    });
    it('Node BringForward', () => {
        executeClickEvent('BringForward-node');
        browser.compareScreen(element(By.id('diagram')), 'node-BringForward');
    });
    it('Node Stroke0', () => {
        executeClickEvent('Stroke0-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Stroke0');
    });
    it('Node Stroke2', () => {
        executeClickEvent('Stroke2-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Stroke2');
    });
    it('Node StrokeDashArray', () => {
        executeClickEvent('StrokeDashArray-node');
        browser.compareScreen(element(By.id('diagram')), 'node-StrokeDashArray');
    });
    it('Node RadialGradient', () => {
        executeClickEvent('RadialGradient-node');
        browser.compareScreen(element(By.id('diagram')), 'node-RadialGradient');
    });
    it('Node LinearGradient', () => {
        executeClickEvent('LinearGradient-node');
        browser.compareScreen(element(By.id('diagram')), 'node-LinearGradient');
    });
    it('Node Shadow', () => {
        executeClickEvent('Shadow-node');
        browser.compareScreen(element(By.id('diagram')), 'node-Shadow');
    });
    it('Node FitToPage', () => {
        executeClickEvent('FitToPage-node');
        browser.compareScreen(element(By.id('diagram')), 'node-FitToPage');
    });
    it('Node FitToPageWidth', () => {
        executeClickEvent('FitToPageWidth-node');
        browser.compareScreen(element(By.id('diagram')), 'node-FitToPageWidth');
    });
    it('Node FitToPageHeight', () => {
        executeClickEvent('FitToPageHeight-node');
        browser.compareScreen(element(By.id('diagram')), 'node-FitToPageHeight');
    });
    it('Node UserHandle', () => {
        browser.load('/demos/basicshapes/userHandle.html');
        browser.compareScreen(element(By.id('diagram')), 'node-UserHandle');
    });
    it('Node UserHandleSideChange', () => {
        executeClickEvent('UserHandleSideChange-node');
        browser.compareScreen(element(By.id('diagram')), 'node-UserHandleSideChange');
    });
    it('Node Overview', () => {
        browser.load('/demos/overview/overview.html');
        browser.compareScreen(element(By.id('overviewdiagram')), 'node-Overview');
    });
    it('Node Palette', () => {
        browser.load('/demos/symbol-palette/symbol-palette.html');
        browser.compareScreen(element(By.id('diagrampalette')), 'node-Palette');
    });
    it('Node PreDefinedBasicShapes', () => {
        browser.load('/demos/nodes/shape-gallery.html');
        browser.compareScreen(element(By.id('diagram')), 'node-BasicShapes');
    });
    it('Node PreDefinedFlowShapes', () => {
        executeClickEvent('FlowShapes-node');
        browser.compareScreen(element(By.id('diagram')), 'node-FlowShapes');
    });
    it('Node PreDefinedBpmnShapes', () => {
        executeClickEvent('BpmnShapes-node');
        browser.compareScreen(element(By.id('diagram')), 'node-BpmnShapes');
    });
    it('Node SnapDrag', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('SnapDrag-node');
        browser.compareScreen(element(By.id('diagram')), 'node-SnapDrag');
    });
    it('Node SnapResizeHeight', () => {
        executeClickEvent('SnapResizeHeight-node');
        browser.compareScreen(element(By.id('diagram')), 'node-SnapResizeHeight');
    });
    it('Node SnapResizeWidth', () => {
        executeClickEvent('SnapResizeWidth-node');
        browser.compareScreen(element(By.id('diagram')), 'node-SnapResizeWidth');
    });



    it('Node NoneEnableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('None');
        browser.compareScreen(element(By.id('diagram')), 'node-NoneEnable');
    });
    it('Node NoneDisableConstraints', () => {
        executeSelectionOption('None');
        browser.compareScreen(element(By.id('diagram')), 'node-NoneDisable');
    });
    it('Node DeleteDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Delete');
        executeClickEvent('NodeConstraints-Delete');
        browser.compareScreen(element(By.id('diagram')), 'node-DeleteDisable');
    });
    it('Node DeleteEnableConstraints', () => {
        executeSelectionOption('Delete');
        executeClickEvent('NodeConstraints-Delete');
        browser.compareScreen(element(By.id('diagram')), 'node-DeleteEnable');
    });
    it('Node SelectDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Select');
        browser.compareScreen(element(by.id('diagram')), 'node-SelectDisable');
    });
    it('Node selectEnableConstraints', () => {
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Select');
        browser.compareScreen(element(By.id('diagram')), 'node-SelectEnable');
    });
    it('Node DragDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Drag');
        executeClickEvent('NodeConstraints-Drag');
        browser.compareScreen(element(By.id('diagram')), 'node-DragDisable');
    });
    it('Node DragEnableConstraints', () => {
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Drag');
        executeClickEvent('NodeConstraints-Drag');
        browser.compareScreen(element(By.id('diagram')), 'node-DragEnable');
    });
    it('Node RotateDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Rotate');
        browser.compareScreen(element(By.id('diagram')), 'node-RotateDisable');
    });
    it('Node RotateEnableConstraints', () => {
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Rotate');
        executeClickEvent('NodeConstraints-Rotate');
        browser.compareScreen(element(By.id('diagram')), 'node-RotateEnable');
    });
    it('Node ShadowDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Shadow');
        browser.compareScreen(element(By.id('diagram')), 'node-ShadowDisable');
    });
    it('Node ShadowEnableConstraints', () => {
        executeSelectionOption('Shadow');
        browser.compareScreen(element(By.id('diagram')), 'node-ShadowEnable');
    });

    it('Node PointerEventsEnableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('PointerEvents');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        browser.compareScreen(element(By.id('diagram')), 'node-PointerEventsEnable');
    });
    it('Node PointerEventsDisableConstraints', () => {
        executeSelectionOption('PointerEvents');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        browser.compareScreen(element(By.id('diagram')), 'node-PointerEventsDisable');
    });
    it('Node InConnectDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-InConnectselect');
        executeSelectionOption('InConnect');
        executeClickEvent('NodeConstraints-Connect');
        browser.compareScreen(element(By.id('diagram')), 'node-InConnectDisable');
    });
    it('Node InConnectEnableConstraints', () => {
        executeClickEvent('NodeConstraints-InConnectselect');
        executeSelectionOption('InConnect');
        executeClickEvent('NodeConstraints-Connect');
        browser.compareScreen(element(By.id('diagram')), 'node-InConnectEnable');
    });

    it('Node AllowDropEnableConstraintsDrop', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-InConnectselect');
        executeSelectionOption('AllowDrop');
        executeClickEvent('NodeConstraints-AllowDrag');
        browser.compareScreen(element(By.id('diagram')), 'node-AllowDropEnable-Drop');
    });
    it('Node AllowDropDisableConstraintsDrop', () => {
        executeClickEvent('NodeConstraints-InConnectselect');
        executeSelectionOption('AllowDrop');
        executeClickEvent('NodeConstraints-AllowDrag');
        browser.compareScreen(element(By.id('diagram')), 'node-AllowDropDisable-Drop');
    });
    it('Node AllowDropEnableConstraintsHighlight', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-InConnectselect');
        executeSelectionOption('AllowDrop');
        executeClickEvent('NodeConstraints-AllowDragHighlight');
        browser.compareScreen(element(By.id('diagram')), 'node-AllowDropEnable-Highlight');
    });
    it('Node AllowDropDisableConstraintsHighlight', () => {
        executeClickEvent('NodeConstraints-InConnectselect');
        executeSelectionOption('AllowDrop');
        executeClickEvent('NodeConstraints-AllowDragHighlight');
        browser.compareScreen(element(By.id('diagram')), 'node-AllowDropDisable-Highlight');
    });
    it('Node OutConnectDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('OutConnect');
        executeClickEvent('NodeConstraints-Connect');
        browser.compareScreen(element(By.id('diagram')), 'node-OutConnectDisable');
    });
    it('Node OutConnectEnableConstraints', () => {
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('OutConnect');
        executeClickEvent('NodeConstraints-Connect');
        browser.compareScreen(element(By.id('diagram')), 'node-OutConnectEnable');
    });
    it('Node ExpandableDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-ExpandSelect');
        executeSelectionOption('Expandable');
        executeClickEvent('NodeConstraints-ConnectwithExpandable');
        browser.compareScreen(element(By.id('diagram')), 'node-ExpandableDisable');
    });
    it('Node ExpandableEnableConstraints', () => {
        executeClickEvent('NodeConstraints-ExpandSelect');
        executeSelectionOption('Expandable');
        executeClickEvent('NodeConstraints-ConnectwithExpandable');
        browser.compareScreen(element(By.id('diagram')), 'node-ExpandableEnable');
    });

    it('Node InheritDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Inherit');
        executeClickEvent('SnapResizeWidth-node');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        browser.compareScreen(element(By.id('diagram')), 'node-InheritDisable');
    });
    it('Node InheritEnableConstraints', () => {
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Inherit');
        executeClickEvent('SnapResizeWidth-node');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        browser.compareScreen(element(By.id('diagram')), 'node-InheritEnable');
    });

    it('Node TooltipEnableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        let selectObject: ElementFinder = element(by.id('selectBox'));
        selectObject.click();
        let inheritTooltip: ElementFinder = element(by.id('InheritTooltip'));
        inheritTooltip.click();
        let options: ElementFinder = element(by.id('Tooltip'));
        options.click();
        selectObject.click();
        executeClickEvent('NodeConstraints-ToolTip');
        browser.compareScreen(element(By.id('diagram')), 'node-TooltipEnable');
    });
    it('Node TooltipDisableConstraints', () => {
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Tooltip');
        executeClickEvent('NodeConstraints-ToolTip');
        browser.compareScreen(element(By.id('diagram')), 'node-TooltipDisable');
    });
    it('Node ResizeNorthEastDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('ResizeNorthEast');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeNorthEastDisable');
    });
    it('Node ResizeNorthEastEnableConstraints', () => {
        executeSelectionOption('ResizeNorthEast');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeNorthEastEnable');
    });
    it('Node ResizeEastDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('ResizeEast');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeEastDisable');
    });
    it('Node ResizeEastEnableConstraints', () => {
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('ResizeEast');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeEastEnable');
    });
    it('Node ResizeSouthEastDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('ResizeSouthEast');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeSouthEastDisable');
    });
    it('Node ResizeSouthEastEnableConstraints', () => {
        executeSelectionOption('ResizeSouthEast');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeSouthEastEnable');
    });
    it('Node ResizeSouthDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('ResizeSouth');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeSouthDisable');
    });
    it('Node ResizeSouthEnableConstraints', () => {
        executeSelectionOption('ResizeSouth');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeSouthEnable');
    });
    it('Node ResizeSouthWestDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('ResizeSouthWest');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeSouthWestDisable');
    });
    it('Node ResizeSouthWestConstraints', () => {
        executeSelectionOption('ResizeSouthWest');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeSouthWestEnable');
    });
    it('Node ResizeWestDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('ResizeWest');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeWestDisable');
    });
    it('Node ResizeWestEnableConstraints', () => {
        executeSelectionOption('ResizeWest');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeWestEnable');
    });
    it('Node ResizeNorthWestDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('ResizeNorthWest');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeNorthWestDisable');
    });
    it('Node ResizeNorthWestEnableConstraints', () => {
        executeSelectionOption('ResizeNorthWest');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeNorthWestEnable');
    });
    it('Node ResizeNorthConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('ResizeNorth');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeNorthDisable');
    });
    it('Node ResizeNorthEnableConstraints', () => {
        executeSelectionOption('ResizeNorth');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeNorthEnable');
    });
    it('Node ResizeDisableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Resize');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeDisable');
    });
    it('Node ResizeEnabelConstraints', () => {
        executeSelectionOption('Resize');
        browser.compareScreen(element(By.id('diagram')), 'node-ResizeEnable');
    });
    it('Node AspectRatioEnableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('AspectRatio');
        executeClickEvent('NodeConstraints-AspectRatio');
        browser.compareScreen(element(By.id('diagram')), 'node-AspectRatioEnable');
    });
    it('Node AspectRatioDisableConstraints', () => {
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('AspectRatio');
        executeClickEvent('NodeConstraints-AspectRatio');
        browser.compareScreen(element(By.id('diagram')), 'node-AspectRatioDisable');
    });
    it('Node ReadOnlyEnableConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('ReadOnly');
        executeClickEvent('NodeConstraints-ReadOnly');
        browser.compareScreen(element(By.id('diagram')), 'node-ReadOnlyEnable');
    });
    it('Node ReadOnlyDisableConstraints', () => {
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('ReadOnly');
        executeClickEvent('NodeConstraints-ReadOnly');
        browser.compareScreen(element(By.id('diagram')), 'node-ReadOnlyDisable');
    });
    it('Node DefaultEnabelConstraints', () => {
        browser.load('/demos/snapping/snap.html');
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Default');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        browser.compareScreen(element(By.id('diagram')), 'node-DefaultEnabel');
    });
    it('Node DefaultDisableConstraints', () => {
        executeClickEvent('NodeConstraints-Select');
        executeSelectionOption('Default');
        executeClickEvent('NodeConstraints-Drag');
        executeClickEvent('NodeConstraints-Rotate');
        browser.compareScreen(element(By.id('diagram')), 'node-DefaultDisable');
    });

    it('Node AutoScroll', () => {
        browser.load('/demos/nodes/node.html');
        let selectObject: ElementFinder = element(By.id('diagram'));
        executeClickEvent('AutoScroll');
        setTimeout(() => {
            //        if (selectObject.scrollSettings.canAutoScroll) {
            browser.compareScreen(element(By.id('diagram')), 'AutoScroll-Node');
            // }
        }, 4000);
        // browser.compareScreen(element(By.id('diagram')), 'AutoScroll-Node');
    });
    it('Connector AutoScroll', () => {
        browser.load('/demos/nodes/node.html');
        let selectObject: ElementFinder = element(By.id('diagram'));
        executeClickEvent('AutoScroll-Connector');
        setTimeout(() => {
            //        if (selectObject.scrollSettings.canAutoScroll) {
            browser.compareScreen(element(By.id('diagram')), 'AutoScroll-Connector');
            // }
        }, 4000);
        // browser.compareScreen(element(By.id('diagram')), 'AutoScroll-Connector');
    });
    it('Rubberband AutoScroll', () => {
        browser.load('/demos/nodes/node.html');
        let selectObject: ElementFinder = element(By.id('diagram'));
        executeClickEvent('AutoScroll-Rubberband');
        setTimeout(() => {
            //        if (selectObject.scrollSettings.canAutoScroll) {
            browser.compareScreen(element(By.id('diagram')), 'AutoScroll-Rubberband');
            // }
        }, 4000);
        // browser.compareScreen(element(By.id('diagram')), 'AutoScroll-Rubberband');
    });


    function executeClickEvent(id: string): void {
        let buttonElement: ElementFinder = element(By.id(id));
        buttonElement.click();
    }
    function executeSelectionOption(id: string): void {
        let options: ElementFinder = element(by.id(id));
        options.click();
    }
});
