import { BlazorDotnetObject, enableBlazorMode } from '@syncfusion/ej2-base';
import { SfPivotView } from './pivotview/sf-pivotview-fn';
import { SfPivotFieldList } from './pivotfieldlist/sf-pivotfieldlist-fn';
import * as cls from './common/constants';
import { BlazorPivotElement, IPivotOptions, TreeData, ScrollPageInfo } from './common/interfaces';
import { IFieldOptions, IFilter } from '../src/base/engine';

/**
 * Blazor pivot components interop handler
 */

// tslint:disable
let PivotView: object = {
    initialize(element: BlazorPivotElement, options: IPivotOptions, dotnetRef: BlazorDotnetObject): void {
        enableBlazorMode();
        new SfPivotView(element, options, dotnetRef);
    },
    initializeFieldList(element: BlazorPivotElement, options: IPivotOptions, dotnetRef: BlazorDotnetObject): void {
        enableBlazorMode();
        new SfPivotFieldList(element, options, dotnetRef);
    },
    contentReady(element: BlazorPivotElement, options: IPivotOptions): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.options = options;
            element.blazor__instance.getOptions(element, options);
            element.blazor__instance.contentReady();
        }
    },
    getChartHeight(element: BlazorPivotElement, height: number) {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotView).getChartHeight(height);
        }
    },
    onShowFieldList(element: BlazorPivotElement, dialogElement: HTMLElement): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotFieldList).onShowFieldList(element, dialogElement);
        }
    },
    removeFieldListIcon(element: BlazorPivotElement): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotFieldList).removeFieldListIcon(element);
        }
    },
    updateFieldListIcons(element: BlazorPivotElement, id: string, treeData: TreeData[], dragText: string) {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotFieldList).treeRendererModule.updateFieldListIcons(id, treeData, dragText);
        }
    },
    setPivotButtonDraggable(element: BlazorPivotElement, options: IPivotOptions): void  {
        if (element && element.blazor__instance && element.blazor__instance.pivotButtonModule) {
            element.blazor__instance.options = options;
            element.blazor__instance.getOptions(element, options);
            element.blazor__instance.pivotButtonModule.createPivotButtonDrop();
            element.blazor__instance.pivotButtonModule.setPivotButtonDrag();
        }
    },
    isFullRowElement(element: BlazorPivotElement, top: number, left: number): string {
        if (element && element.blazor__instance) {
            return element.blazor__instance.commonActionModule.isFullRowElement(top, left);
        }
        return JSON.stringify(false);
    },
    getTreeNode(element: BlazorPivotElement, treeElement: HTMLElement, top: number, left: number): string {
        if (element && element.blazor__instance) {
            return element.blazor__instance.commonActionModule.getTreeNode(treeElement, top, left);
        }
        return null;
    },
    updateActiveNode(element: BlazorPivotElement, treeElement: HTMLElement, id: string): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.commonActionModule.updateActiveNode(treeElement, id);
        }
    },
    updateSelectedNodes(element: BlazorPivotElement, node: string, checkState: string): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotFieldList).updateSelectedNodes((window as any).sfBlazor.getElementByXpath(node), checkState);
        }
    },
    updateFieldList(element: BlazorPivotElement, containerElement: HTMLElement) {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotFieldList).updateFieldList(containerElement);
        }
    },
    renderToolbar(element: BlazorPivotElement): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotView).toolbarModule.renderToolbar();
        }
    },
    focusToolBar(element: BlazorPivotElement): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotView).toolbarModule.focusToolBar();
        }
    },
    getButtonPosition(element: BlazorPivotElement, target: string, droppedClass: string): string {
        if (element && element.blazor__instance) {
            return JSON.stringify(element.blazor__instance.pivotButtonModule.getButtonPosition((window as any).sfBlazor.getElementByXpath(target), droppedClass));
        }
        return null;
    },
    getButtonLocation(element: HTMLElement): string {
        let position: DOMRect = element.querySelector('.' + cls.AXISFIELD_ICON_CLASS).getBoundingClientRect() as DOMRect;
        return JSON.stringify([position.top + (window.scrollY || document.documentElement.scrollTop), position.left]);
    },
    selectInputRange(element: BlazorPivotElement, dialogElement: HTMLElement): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotView).toolbarModule.selectInputRange(dialogElement);
        }
    },
    focusOnElement(element: HTMLElement): void {
        element.focus();
    },
    copyMdxQuery(element: BlazorPivotElement, dialogElement: HTMLElement): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotView).toolbarModule.copyMdxQuery(dialogElement);
        }
    },
    validateInputs(element: BlazorPivotElement, filterInfo: IFilter) {
        if (element && element.blazor__instance) {
            element.blazor__instance.commonActionModule.validateInputs(filterInfo);
        }
    },
    selectedCell(element: BlazorPivotElement, colIndex: number, rowIndex: number, isHeader: boolean, headerCount: number): string {
        if (element && element.blazor__instance) {
            return (element.blazor__instance as SfPivotView).selectedCell(colIndex, rowIndex, isHeader, headerCount);
        }
        return undefined
    },
    hyperlinkCellclick(element: BlazorPivotElement, args: string, XPath: string): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotView).hyperlinkCellclick(JSON.parse(args), JSON.parse(XPath));
        }
    },
    updateEditOptions(element: BlazorPivotElement, accordId: string) {
        if (element && element.blazor__instance) {
            element.blazor__instance.calculatedFieldModule.updateEditOptions(accordId);
        }
    },
    accordionClick(element: BlazorPivotElement, clientX: string, clientY: string, id: string): string {
        if (element && element.blazor__instance) {
            return element.blazor__instance.calculatedFieldModule.accordionClick(clientX, clientY, id);
        }
        return undefined;
    },
    getAccordionValue(element: BlazorPivotElement): string {
        if (element && element.blazor__instance) {
            return element.blazor__instance.calculatedFieldModule.getAccordionValue();
        }
        return undefined;
    },
    updateAccordionLabel(element: BlazorPivotElement, target: string) {
        if (element && element.blazor__instance) {
            element.blazor__instance.calculatedFieldModule.updateAccordionLabel(target);
        }
    },
    getNodeLocation(element: BlazorPivotElement, treeElement : HTMLElement, id: string): string {
        if (element && element.blazor__instance) {
            return element.blazor__instance.calculatedFieldModule.getNodeLocation(treeElement, id);
        }
        return undefined;
    },
    getIconInfo(element: BlazorPivotElement, top: number, left: number): string {
        if (element && element.blazor__instance) {
            return element.blazor__instance.calculatedFieldModule.getIconInfo(top, left);
        }
        return undefined;
    },
    emptyFieldName(element: BlazorPivotElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.calculatedFieldModule.emptyFieldName(element.id);
        }
    },
    updateCalculatedFields(element: BlazorPivotElement, isEdit: boolean, top: number, left: number, title: string): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.calculatedFieldModule.editCalculatedFieldInfo(isEdit, top, left, title);
        }
    },
    updateCalculatedFieldExpandIcons(element: BlazorPivotElement, treeElement: HTMLElement, id: string): string {
        if (element && element.blazor__instance) {
            return element.blazor__instance.calculatedFieldModule.updateNodeExpandIcons(treeElement, id);
        }
        return JSON.stringify(false);
    },
    createFormulaDroppable(element: BlazorPivotElement, edit: string, drag: string, remove: string, edited: string, isEdit: boolean, fieldName: string, id:string): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.calculatedFieldModule.createFormulaDroppable(edit, drag, remove, edited, isEdit, fieldName, id);
        }
    },
    createSheet(element: BlazorPivotElement, format: string, id: string, index: number): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotView).createSheet(format, id, index);
        }
    },
    updateScrollInfo(element: BlazorPivotElement, columnCount: number, rowCount: number): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotView).virtualScrollModule.updateScrollInfo(element, columnCount, rowCount);
        }
    },
    getScrollInfo(element: BlazorPivotElement, scrollPageInfo: ScrollPageInfo): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotView).getScrollInfo(element, scrollPageInfo);
        }
    },
    exportDocument(element: BlazorPivotElement, filename: string, bytesBase64: string): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotView).exportDocument(element, filename, bytesBase64);
        }
    },
    calculateGridHeight(element: BlazorPivotElement, elementCreated: boolean, rowCount: number, columnCount: number): string {
        if (element && element.blazor__instance) {
            return (element.blazor__instance as SfPivotView).calculateGridHeight(elementCreated, rowCount, columnCount);
        }
        return null;
    },
    onContextMenuOpen(element: BlazorPivotElement): string {
        if (element && element.blazor__instance) {
            return (element.blazor__instance as SfPivotView).onContextMenuOpen();
        }
        return null;
    },
    getSelectedCells(element: BlazorPivotElement): string {
        if (element && element.blazor__instance) {
            return (element.blazor__instance as SfPivotView).getSelectedCells();
        }
        return null;
    },
    updateGridUI(element: BlazorPivotElement): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotView).updateGridUI(element);
        }
    },
    updateView(element: BlazorPivotElement, displayOption:string): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotView).updateView(element, displayOption);
        }
    },
    updateGridSettings (element: BlazorPivotElement, gridSetting: string): void {
        if (element && element.blazor__instance) {
            (element.blazor__instance as SfPivotView).updateGridSettings(element, gridSetting);
        }
    },
    getClientWidth (element: BlazorPivotElement, id: string): number {
        if (element && element.blazor__instance) {
            return (element.blazor__instance as SfPivotView).getClientWidth(element, id);
        }
        return null;
    },
    getTableCellNode(element: BlazorPivotElement, top: number, left: number): string {
        if (element && element.blazor__instance) {
            return (element.blazor__instance as SfPivotView).getTableCellNode(element, top, left);
        }
        return null;
    },
    updateColorPickerUI(element: BlazorPivotElement, dialogElement: HTMLElement): void {
        if (element && element.blazor__instance) {
            return (element.blazor__instance as SfPivotView).updateColorPickerUI(dialogElement);
        }
    },
    destroy(element: BlazorPivotElement): void {
        if (element && element.blazor__instance) {
            element.blazor__instance.destroy();
        }
    }
};
export default PivotView;