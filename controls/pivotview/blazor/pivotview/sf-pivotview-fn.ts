import { BlazorPivotElement, IPivotOptions, ScrollPageInfo } from '../common/interfaces';
import { IOlapFieldListOptions } from '../../src/base/olap/engine';
import { DataSourceSettingsModel } from '../../src/pivotview/model/datasourcesettings-model';
import { GridSettings } from '../../src/pivotview/model/gridsettings';
import { DisplayOption, GroupingBarSettings } from '../../src/pivotview/base/pivotview';
import { CellEditSettings } from '../../src/pivotview/base/pivotview';
import { GroupingBar } from './grouping-bar';
import { BlazorDotnetObject, Browser, closest, EventHandler, formatUnit, addClass, removeClass, setStyleAttribute } from '@syncfusion/ej2-base';
import * as cls from '../common/constants';
import { PivotButton } from '../common/pivot-button';
import { CalculatedField } from '../common/calculated-field';
import { Toolbar } from './toolbar';
import { DrillThrough } from './drill-through';
import { ActionBase } from '../common/action-base';
import { HyperCellClickEventArgs } from '../../src/common/base/interface';
import { KeyboardInteraction } from './keyboard';
import { SfPivotFieldList } from '../pivotfieldlist/sf-pivotfieldlist-fn';
import { Selection } from '../pivotview/selection';
import { VirtualScroll } from '../pivotview/virtual-scroll';
import { ScrollInfo } from '../../src/common/base/interface';
import { IPageSettings } from '../../src/base/engine';
/**
 * SfPivotView client constructor
 */
export class SfPivotView {
    public element: BlazorPivotElement;
    public dotNetRef: BlazorDotnetObject;
    public parentElement: HTMLElement;
    public options: IPivotOptions;
    public groupingBarModule: GroupingBar;
    public pivotButtonModule: PivotButton;
    public calculatedFieldModule: CalculatedField;
    public toolbarModule: Toolbar;
    public commonActionModule: ActionBase;
    public dataSourceSettings: DataSourceSettingsModel;
    public groupingBarSettings: GroupingBarSettings;
    public displayOptions: DisplayOption;
    /* tslint:disable */
    public internalGrid: any;
    /* tslint:enable */
    public isDragging: boolean;
    public fieldList: IOlapFieldListOptions;
    public gridSettings: GridSettings;
    public pageSettings: IPageSettings;
    public currentView: string;
    public drillThroughModule: DrillThrough;
    public selectionModule: Selection;
    public virtualScrollModule: VirtualScroll;
    public editSettings: CellEditSettings;
    public isAdaptive: Boolean;
    public enableValueSorting: Boolean;
    public keyboardModule: KeyboardInteraction;
    public scrollPageInfo: ScrollPageInfo = { rowCount: 0, columnCount: 0, colFirstLvl: 0, rowFirstLvl: 0, colStartPos: 0, rowStartPos: 0 };
    public verticalScrollScale: number = 1;
    public horizontalScrollScale: number = 1;
    public scrollerBrowserLimit: number = 8000000;
    public scrollPosObject: ScrollInfo = { vertical: 0, horizontal: 0, verticalSection: 0, horizontalSection: 0, top: 0, left: 0, scrollDirection: { direction: '', position: 0 } };
    public pivotFieldListModule: SfPivotFieldList;

    private lastCellClicked: HTMLElement;
    private timeOutObj: any;

    constructor(element: BlazorPivotElement, options: IPivotOptions, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.element.blazor__instance = this;
        this.dotNetRef = dotnetRef;
        this.getOptions(element, options);
        this.initModules();
    }

    public getOptions(element: BlazorPivotElement, options: IPivotOptions): void {
        this.element = element;
        this.options = options;
        this.element.blazor__instance = this;
        this.parentElement = element;
        this.isAdaptive = Browser.isDevice;
        /* tslint:disable */
        this.internalGrid = options.internalGrid && options.internalGrid['blazor__instance'] ?
            options.internalGrid['blazor__instance'] as any : { element: options.internalGrid } as any;

        this.pivotFieldListModule = options.fieldListModule && options.fieldListModule.blazor__instance ?
            options.fieldListModule.blazor__instance as SfPivotFieldList : options.fieldListModule as any;
        /* tslint:enable */
        this.fieldList = options.fieldList;
        this.dataSourceSettings = options.dataSourceSettings;
        this.gridSettings = options.gridSettings;
        this.editSettings = options.editSettings;
        this.displayOptions = options.displayOptions;
        this.enableValueSorting = options.enableValueSorting;
        this.currentView = this.displayOptions.view === 'Both' ? this.displayOptions.primary : this.displayOptions.view;
        this.groupingBarSettings = this.options.groupingBarsettings;
        this.pageSettings = this.options.pageSettings;
    }

    private initModules(): void {
        if (this.options.showGroupingBar) {
            this.groupingBarModule = new GroupingBar(this);
        }
        if (this.options.showToolbar) {
            this.toolbarModule = new Toolbar(this);
        }
        if (this.options.allowDrillThrough || this.editSettings.allowEditing) {
            this.drillThroughModule = new DrillThrough(this);
        }
        if (this.options.allowCalculatedField) {
            this.calculatedFieldModule = new CalculatedField(this);
        }
        if (this.options.enableVirtualization) {
            this.virtualScrollModule = new VirtualScroll(this);
        }
        if (this.gridSettings.allowSelection) {
            this.selectionModule = new Selection(this);
        }
        this.keyboardModule = new KeyboardInteraction(this);
        this.commonActionModule = new ActionBase(this);
        this.contentReady();
        this.unWireEvents();
        this.wireEvents();
    }

    private updateModuleProperties(): void {
        if (this.options.showGroupingBar) {
            this.groupingBarModule.parent =
                this.pivotButtonModule.parent = this;
        }
        if (this.options.showToolbar) {
            this.toolbarModule.parent = this;
        }
        if (this.options.allowDrillThrough || this.editSettings.allowEditing) {
            this.drillThroughModule.parent = this;
        }
        if (this.options.allowCalculatedField) {
            this.calculatedFieldModule.parent = this;
        }
        this.keyboardModule.parent =
            this.commonActionModule.parent =
            this.commonActionModule.keyboardModule.parent = this;
    }

    public getChartHeight(height: number): string {
        if (this.element.querySelector('.' + cls.PIVOT_CHART) && this.element.querySelector('.' + cls.CHART_GROUPING_BAR_CLASS)) {
            (this.element.querySelector('.' + cls.CHART_GROUPING_BAR_CLASS) as HTMLElement).style.width = (this.element.querySelector('.' + cls.PIVOT_CHART) as HTMLElement).style.width;
            height = this.element.querySelector('.' + cls.CHART_GROUPING_BAR_CLASS).clientHeight;
        }
        let calculatedHeight: string;
        if (this.options.showToolbar && this.options.showGroupingBar) {
            calculatedHeight = (height - (this.element.querySelector('.e-pivot-toolbar') ? this.element.querySelector('.e-pivot-toolbar').clientHeight : 42) - (this.element.querySelector('.e-chart-grouping-bar') ? this.element.querySelector('.e-chart-grouping-bar').clientHeight : 76)).toString();
        } else if (this.options.showToolbar) {
            calculatedHeight = (height - (this.element.querySelector('.e-pivot-toolbar') ? this.element.querySelector('.e-pivot-toolbar').clientHeight : 42)).toString();
        } else if (this.options.showGroupingBar) {
            calculatedHeight = (height - (this.element.querySelector('.e-chart-grouping-bar') ? this.element.querySelector('.e-chart-grouping-bar').clientHeight : 76)).toString();
        }

        return calculatedHeight;
    }

    public contentReady(): void {
        this.updateModuleProperties();
        if (this.options.renderGrid) {
            if (this.options.showGroupingBar && this.groupingBarModule) {
                this.groupingBarModule.updatePivotButtons();
                this.groupingBarModule.refreshUI();
            }
            if ((this.options.allowDrillThrough || this.editSettings.allowEditing) && this.drillThroughModule) {
                this.drillThroughModule.addInternalEvents();
            }
            if (this.options.enableVirtualization && this.virtualScrollModule) {
                this.virtualScrollModule.addInternalEvents();
            }
            if (this.gridSettings.allowSelection && this.selectionModule) {
                this.selectionModule.addInternalEvents();
            }
        }
    }

    public getSelectedCellDom(domElement: HTMLElement): string {
        if (domElement) {
            return JSON.stringify((window as any).sfBlazor.getDomObject('currentCell', domElement));
        } else {
            return null;
        }
    }

    /* tslint:disable */
    public selectedCell(colIndex: number, rowIndex: number, isHeader: boolean): string {
        if (isHeader) {
            return this.getSelectedCellDom(this.element.querySelector('.' + (colIndex === 0 ? cls.FROZENHEADER_DIV : cls.MOVABLEHEADER_DIV) + ' th[index=' + '\"' + rowIndex + '\"' + '][aria-colindex=' + '\"' + colIndex + '\"' + ']'));
        } else {
            return this.getSelectedCellDom(this.element.querySelector('.' + (colIndex === 0 ? cls.FROZENCONTENT_DIV : cls.MOVABLECONTENT_DIV) + ' td[index=' + '\"' + rowIndex + '\"' + '][aria-colindex=' + '\"' + colIndex + '\"' + ']'));
        }
    }

    public hyperlinkCellclick(hyperargs: HyperCellClickEventArgs, xpath: string): void {
        if (hyperargs != null) {
            hyperargs.currentCell = (window as any).sfBlazor.getElementByXpath(xpath);
            let url: string = hyperargs.currentCell.getAttribute('data-url') ? hyperargs.currentCell.getAttribute('data-url') : hyperargs.currentCell.querySelector('a').getAttribute('data-url');
            window.open(url);
        }
    }

    public createSheet(format: string, id: string, index: number): void {
        let sheet: CSSStyleSheet = this.createStyleSheet() as CSSStyleSheet;
        sheet.insertRule('.format' + id + index + '{' + format + '}', 0);
    }

    public getScrollInfo(element: BlazorPivotElement, scrollPageInfo: ScrollPageInfo): void {
        this.scrollPageInfo.colFirstLvl = scrollPageInfo.colFirstLvl;
        this.scrollPageInfo.rowFirstLvl = scrollPageInfo.rowFirstLvl;
        this.scrollPageInfo.columnCount = scrollPageInfo.columnCount;
        this.scrollPageInfo.rowCount = scrollPageInfo.rowCount;
        this.scrollPageInfo.colStartPos = scrollPageInfo.colStartPos;
        this.scrollPageInfo.rowStartPos = scrollPageInfo.rowStartPos;
    }

    public exportDocument(element: BlazorPivotElement, filename: string, bytesBase64: string): void {
        if (navigator.msSaveBlob) {
            let data: string = window.atob(bytesBase64);
            let bytes: any = new Uint8Array(data.length);
            for (let i: number = 0; i < data.length; i++) {
                bytes[i] = data.charCodeAt(i);
            }
            let blob: any = new Blob([bytes.buffer], {
                type: "application/octet-stream",
            });
            navigator.msSaveBlob(blob, filename);
        }
        else {
            let link: HTMLAnchorElement = document.createElement("a");
            link.download = filename;
            link.href = "data:application/octet-stream;base64," + bytesBase64;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    private createStyleSheet(): StyleSheet {
        let style: HTMLStyleElement = document.createElement('style');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        return style.sheet;
    }

    public getSelectedCells(): string {
        let selectedElements: HTMLElement[] = [].slice.call(this.element.querySelectorAll('.' + cls.CELL_SELECTED_BGCOLOR + ',.' + cls.SELECTED_BGCOLOR));
        let domCollection: any[] = [];
        for (let element of selectedElements) {
            domCollection.push((window as any).sfBlazor.getDomObject('currentCell', element));
        }
        return JSON.stringify(domCollection);
    }

    public onContextMenuOpen(): string {
        if (this.options.allowGrouping && this.lastCellClicked) {
            let currentCell: HTMLElement = closest(this.lastCellClicked, 'td.' + cls.ROWSHEADER + ',th.' + cls.COLUMNSHEADER) as HTMLElement;
            this.lastCellClicked = undefined;
            if (currentCell && !currentCell.classList.contains(cls.VALUESHEADER)) {
                return JSON.stringify((window as any).sfBlazor.getDomObject('currentCell', currentCell));
            }
            return null;
        }
        return null;
    }

    private mouseRclickHandler(e: MouseEvent): void {
        this.lastCellClicked = e.target as HTMLElement;
    }

    /* tslint:disable */
    private mouseClickHandler(e: MouseEvent): void {
        if (this.element.querySelectorAll('.' + cls.BUTTON_FOCUSED).length > 0) {
            removeClass(this.element.querySelectorAll('.' + cls.BUTTON_FOCUSED), cls.BUTTON_FOCUSED);
        }
        if (this.element.querySelector('.' + cls.GRID_TOOLBAR) &&
            this.element.querySelector('.' + cls.GRID_TOOLBAR).querySelectorAll('.' + cls.MENU_ITEM_CLASS + '.' + cls.FOCUSED_CLASS).length > 0) {
            removeClass(this.element.querySelector('.' + cls.GRID_TOOLBAR).querySelectorAll('.' + cls.MENU_ITEM_CLASS + '.' + cls.FOCUSED_CLASS), cls.FOCUSED_CLASS);
        }
        let target: Element = (e.target as Element);
        if (this.enableValueSorting && this.options.dataType === 'pivot' && (target.classList.contains(cls.SORT_FILTER_DIV) || target.classList.contains(cls.STACKED_HEADER_TEXT) ||
            target.classList.contains(cls.STACKED_HEADER_CELL_DIV) || target.classList.contains(cls.HEADER_TEXT) || target.classList.contains(cls.STACKED_HEADER_CELL_DIV) ||
            target.classList.contains(cls.HEADER_CELL_DIV) || target.classList.contains(cls.HEADERCELL) || target.classList.contains(cls.CELLVALUE) ||
            target.classList.contains(cls.COLUMNSHEADER) || target.classList.contains(cls.ROWSHEADER))) {
            let element: Element = closest(target, 'td.' + cls.ROWSHEADER + ',th.' + cls.COLUMNSHEADER);
            if (element && ((closest(element, '.' + cls.MOVABLEHEADER_DIV) && this.dataSourceSettings.valueAxis === 'column') ||
                (closest(element, 'tr.' + cls.ROW) && this.dataSourceSettings.valueAxis === 'row') &&
                (element.classList.contains(cls.ROWSHEADER) || element.classList.contains(cls.SUBTOTAL)))) {
                if (this.enableValueSorting) {
                    let colIndex: number = Number(element.getAttribute('aria-colindex'));
                    let rowIndex: number = Number(element.getAttribute('index'));
                    if (this.dataSourceSettings.valueAxis === 'column' && (this.dataSourceSettings.values.length > 1 || this.dataSourceSettings.alwaysShowValueHeader)) {
                        colIndex = (Number(element.getAttribute('aria-colindex')) + Number(element.getAttribute('aria-colspan')) - 1);
                    }
                    this.dotNetRef.invokeMethodAsync('MouseClickHandler', rowIndex, colIndex);
                }
                e.preventDefault();
            }
        }
        else if (!this.gridSettings.allowSelection) {
            let element: Element = closest(target, 'td.' + cls.ROWSHEADER + ',th.' + cls.COLUMNSHEADER + ',td.' + cls.ROW_CELL_CLASS);
            if (element !== null) {
                let colIndex: number = Number(element.getAttribute('aria-colindex'));
                let rowIndex: number = Number(element.getAttribute('index'));
                if (!(target.classList.contains('e-expand') || target.classList.contains('e-collapse')))
                    this.dotNetRef.invokeMethodAsync('CellClickedHandler', rowIndex, colIndex, e, JSON.stringify((window as any).sfBlazor.getDomObject('cellElement', element)));
            }
        }
    }
    /* tslint:enable */
    private getHeightAsNumber(): number {
        let height: number;
        if (isNaN(this.options.height as number)) {
            if (this.options.height.toString().indexOf('%') > -1) {
                height = (parseFloat(this.options.height.toString()) / 100) * this.element.offsetHeight;
            } else if (this.options.height.toString().indexOf('px') > -1) {
                height = Number(this.options.height.toString().split('px')[0]);
            } else if (this.options.height === 'auto') {
                height = this.element.offsetHeight;
            }
        } else {
            height = Number(this.options.height);
        }
        if (height < 300) {
            height = 300;
        }
        return height;
    }

    public calculateGridHeight(elementCreated?: boolean, rowCount?: number, columnCount?: number): string {
        let gridHeight: number | string = this.options.height;
        let parHeight: number = this.getHeightAsNumber();
        let tableHeight: number = (rowCount * this.gridSettings.rowHeight);
        if (isNaN(parHeight)) {
            parHeight = parHeight > 300 ? parHeight : 300;
        }
        if (this.gridSettings.height === 'auto' && parHeight && this.element.querySelector('.' + cls.GRID_HEADER)) {
            let colHeaderHeight: number = (columnCount * this.gridSettings.rowHeight) + ((this.element.querySelector('.' + cls.GRID_HEADER) as HTMLElement).offsetHeight - (this.element.querySelector('.' + cls.HEADERCONTENT) as HTMLElement).offsetHeight);
            let gBarHeight: number = colHeaderHeight + (this.element.querySelector('.' + cls.GROUPING_BAR_CLASS) ?
                (this.element.querySelector('.' + cls.GROUPING_BAR_CLASS) as HTMLElement).offsetHeight : 0);
            let toolBarHeight: number = this.element.querySelector('.' + cls.GRID_TOOLBAR) ? this.element.querySelector('.' + cls.GRID_TOOLBAR).clientHeight : 0;
            gridHeight = parHeight - (gBarHeight + toolBarHeight) - 1;
            if (elementCreated) {
                let contentHeight: number = this.internalGrid && this.internalGrid.options && !isNaN(this.internalGrid.options.height) ?
                    Number(this.internalGrid.options.height) : (this.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement).offsetHeight;
                let tableWidth: number =
                    (this.element.querySelector('.' + cls.MOVABLECONTENT_DIV + ' .' + cls.TABLE) as HTMLElement).offsetWidth;
                let contentWidth: number =
                    (this.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement).offsetWidth;
                let horizontalOverflow: boolean = contentWidth < tableWidth;
                let verticalOverflow: boolean = contentHeight < tableHeight;
                let commonOverflow: boolean = horizontalOverflow && ((gridHeight - tableHeight) < 18) ? true : false;
                if (gridHeight >= tableHeight && (horizontalOverflow ? gridHeight >= contentHeight : true) &&
                    !verticalOverflow && !commonOverflow) {
                    return JSON.stringify('auto');
                }
            } else {
                if (gridHeight > (rowCount * this.gridSettings.rowHeight)) {
                    return JSON.stringify('auto');
                }
            }
        } else {
            gridHeight = this.gridSettings.height;
        }
        return gridHeight < this.gridSettings.rowHeight ? this.gridSettings.rowHeight.toString() : tableHeight < gridHeight ? tableHeight.toString() : gridHeight.toString();
    }


    public updateGridUI(element: HTMLElement): void {
        if (this.options.showGroupingBar && this.groupingBarModule) {
            this.groupingBarModule.refreshUI();
        } else {
            let emptyRowHeader: HTMLElement = element.querySelector('.' + cls.FROZENHEADER_DIV).querySelector('.' + cls.COLUMN_HEADER);
            if (emptyRowHeader && emptyRowHeader.querySelector('.' + cls.RESIZE_HANDLER)) {
                emptyRowHeader.style.height = (emptyRowHeader.querySelector('.' + cls.RESIZE_HANDLER) as HTMLElement).style.height = 'auto';
                emptyRowHeader.style.height = (emptyRowHeader.querySelector('.' + cls.RESIZE_HANDLER) as HTMLElement).style.height = (element.querySelector('.' + cls.HEADERCONTENT) as HTMLElement).offsetHeight + 'px';
            }
        }
        if (element.querySelector('.' + cls.MOVABLEHEADER_DIV + ' .' + cls.TABLE) && (element.querySelector('.' + cls.MOVABLEHEADER_DIV + ' .' + cls.TABLE) as HTMLElement).style.width == "0px") {
            (element.querySelector('.' + cls.MOVABLECONTENT_DIV + ' .' + cls.TABLE) as HTMLElement).style.width = (element.querySelector('.' + cls.MOVABLEHEADER_DIV + ' .' + cls.TABLE) as HTMLElement).style.width = "";
        }
        if (element.querySelector('.' + cls.MOVABLEHEADER_DIV + ' .' + cls.TABLE + ' th.e-firstcell.e-lastcell') && (element.querySelector('.' + cls.MOVABLEHEADER_DIV + ' .' + cls.TABLE + ' th.e-firstcell.e-lastcell') as HTMLElement).offsetWidth <= 0) {
            let headerColGroupElements: HTMLCollection = element.querySelector('.' + cls.MOVABLEHEADER_DIV + ' .' + cls.TABLE + ' colgroup').children;
            let contentColGroupElements: HTMLCollection = element.querySelector('.' + cls.MOVABLECONTENT_DIV + ' .' + cls.TABLE + ' colgroup').children;
            let columnWidth: string = formatUnit(this.options.gridSettings.columnWidth);
            if (headerColGroupElements.length > 1 && (headerColGroupElements[headerColGroupElements.length - 1] as HTMLElement).style.width == 'auto')
                (headerColGroupElements[headerColGroupElements.length - 1] as HTMLElement).style.width = columnWidth;
            if (contentColGroupElements.length > 1 && (contentColGroupElements[contentColGroupElements.length - 1] as HTMLElement).style.width == 'auto')
                (contentColGroupElements[contentColGroupElements.length - 1] as HTMLElement).style.width = columnWidth;
        }
        (this.element.querySelector('.' + cls.MOVABLECONTENT_DIV) as HTMLElement).style.overflow = 'auto';
        let hasVerticalScrollbar: boolean = element.querySelector('.' + cls.MOVABLECONTENT_DIV).scrollHeight > element.querySelector('.' + cls.MOVABLECONTENT_DIV).clientHeight;
        setStyleAttribute(element.querySelector('.' + cls.GRID_HEADER), this.options.enableRtl ? {
            'paddingLeft': hasVerticalScrollbar ? '16px' : ''
        } : {
                'paddingRight': hasVerticalScrollbar ? '16px' : ''
            });
        setStyleAttribute(element.querySelector('.' + cls.HEADERCONTENT), this.options.enableRtl ? {
            'borderLeftWidth': hasVerticalScrollbar ? '1px' : ''
        } : {
                'borderRightWidth': hasVerticalScrollbar ? '1px' : ''
            });
        (element.querySelector('.' + cls.FROZENCONTENT_DIV) as HTMLElement).style.height = formatUnit(element.querySelector('.' + cls.MOVABLECONTENT_DIV).clientHeight);
    };

    public updateView(element: BlazorPivotElement, displayOption: string): void {
        if (element) {
            this.displayOptions = JSON.parse(displayOption);
            if (this.displayOptions.view == 'Both' && this.displayOptions.primary == 'Table') {
                (this.element.querySelector('.' + cls.PIVOT_CHART) as HTMLElement).style.display = 'none';
                (this.element.querySelector('#' + this.element.id + '_grid') as HTMLElement).style.display = '';
                if (this.options.showGroupingBar) {
                    if (this.element.querySelector('.' + cls.PIVOT_CHART) && this.element.querySelector('.' + cls.CHART_GROUPING_BAR_CLASS)) {
                        (this.element.querySelector('.' + cls.CHART_GROUPING_BAR_CLASS) as HTMLElement).style.display = 'none';
                        (this.element.querySelector('.' + cls.GRID_GROUPING_BAR_CLASS) as HTMLElement).style.display = '';
                    }
                }
            } else if (this.displayOptions.view == 'Both' && this.displayOptions.primary == 'Chart') {
                (this.element.querySelector('.' + cls.PIVOT_CHART) as HTMLElement).style.display = '';
                (this.element.querySelector('#' + this.element.id + '_grid') as HTMLElement).style.display = 'none';
                if (this.options.showGroupingBar) {
                    if (this.element.querySelector('.' + cls.GRID_GROUPING_BAR_CLASS)) {
                        (this.element.querySelector('.' + cls.GRID_GROUPING_BAR_CLASS) as HTMLElement).style.display = 'none';
                        (this.element.querySelector('.' + cls.CHART_GROUPING_BAR_CLASS) as HTMLElement).style.display = '';
                    }
                }
            }
        }
    }

    public updateGridSettings(element: BlazorPivotElement, gridSetting: string): void {
        if (element && gridSetting !== null) {
            this.gridSettings = JSON.parse(gridSetting);
        }
    }

    public getClientWidth(element: BlazorPivotElement, id: string): number {
        if (element && id !== null) {
            return document.getElementById(id).clientWidth;
        }
        return null;
    }

    public getTableCellNode(element: BlazorPivotElement, top: number, left: number): string {
        if (element) {
            return document.elementFromPoint(left, top).getAttribute('cell');
        }
        return null;
    };


    public updateColorPickerUI(dialogElemnt: HTMLElement): void {
        if (dialogElemnt) {
            let fontColorPicker: HTMLElement[] = [].slice.call(dialogElemnt.querySelectorAll('.' + cls.COLOR_PICKER_CONTAINER + '.' + cls.FORMAT_FONT_COLOR_PICKER_CONTAINER));
            let backColorPicker: HTMLElement[] = [].slice.call(dialogElemnt.querySelectorAll('.' + cls.COLOR_PICKER_CONTAINER + '.' + cls.FORMAT_BACK_COLOR_PICKER_CONTAINER));
            for (let element of fontColorPicker) {
                addClass([element], [cls.FORMAT_COLOR_PICKER, cls.FORMAT_FONT_COLOR_PICKER]);
                addClass([element.querySelector('.' + cls.COLOR_PICKER)], cls.FORMAT_FONT_COLOR);
                addClass([element.querySelector('.' + cls.SELECTED_COLOR)], cls.ICON);
            }
            for (let element of backColorPicker) {
                addClass([element], cls.FORMAT_COLOR_PICKER);
                addClass([element.querySelector('.' + cls.COLOR_PICKER)], cls.FORMAT_BACK_COLOR);
                addClass([element.querySelector('.' + cls.SELECTED_COLOR)], cls.ICON);
            }
        }
    };

    private onWindowResize(): void {
        clearTimeout(this.timeOutObj);
        this.timeOutObj = setTimeout(() => {
            this.commonActionModule.getElementInfo();
            this.dotNetRef.invokeMethodAsync('LayoutRefresh');
        }, 500);
    };
    private wireEvents(): void {
        EventHandler.add(document, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler, this);
        EventHandler.add(this.element, this.isAdaptive ? 'touchend' : 'contextmenu', this.mouseRclickHandler, this);
        this.onWindowResize = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.onWindowResize, true);
    }

    private unWireEvents(): void {
        EventHandler.remove(document, this.isAdaptive ? 'touchend' : 'click', this.mouseClickHandler);
        EventHandler.remove(this.element, this.isAdaptive ? 'touchend' : 'contextmenu', this.mouseRclickHandler);
        window.removeEventListener('resize', this.onWindowResize, true);
    }

    public destroy(): void {
        this.unWireEvents();
        this.keyboardModule.destroy();
        this.commonActionModule.destroy();
        if (this.options.showGroupingBar) {
            this.groupingBarModule.destroy();
            this.pivotButtonModule.destroy();
        }
        if (this.options.showFieldList && this.pivotFieldListModule) {
            this.pivotFieldListModule.destroy();
        }
        if (this.options.allowDrillThrough || this.editSettings.allowEditing) {
            this.drillThroughModule.destroy();
        }
        if (this.options.enableVirtualization || this.virtualScrollModule) {
            this.virtualScrollModule.destroy();
        }
        if (this.gridSettings.allowSelection || this.selectionModule) {
            this.selectionModule.destroy();
        }
    }
    /* tslint:enable */
}