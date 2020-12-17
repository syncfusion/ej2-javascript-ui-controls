import { Property, NotifyPropertyChanges, INotifyPropertyChanged, ModuleDeclaration, Event, isUndefined } from '@syncfusion/ej2-base';import { addClass, removeClass, EmitType, Complex, formatUnit, L10n, isNullOrUndefined, Browser } from '@syncfusion/ej2-base';import { detach, select, closest, setStyleAttribute, EventHandler } from '@syncfusion/ej2-base';import { MenuItemModel, BeforeOpenCloseMenuEventArgs, ItemModel } from '@syncfusion/ej2-navigations';import { initialLoad, mouseDown, spreadsheetDestroyed, keyUp, BeforeOpenEventArgs, clearViewer, blankWorkbook } from '../common/index';import { hideShow, performUndoRedo, overlay, DialogBeforeOpenEventArgs, createImageElement, deleteImage} from '../common/index';import { HideShowEventArgs, sheetNameUpdate, updateUndoRedoCollection, getUpdateUsingRaf, setAutoFit, created } from '../common/index';import { actionEvents, CollaborativeEditArgs, keyDown, enableFileMenuItems, hideToolbarItems, updateAction } from '../common/index';import { ICellRenderer, colWidthChanged, rowHeightChanged, hideRibbonTabs, addFileMenuItems, getSiblingsHeight } from '../common/index';import { defaultLocale, locale, setAriaOptions, setResize, updateToggleItem, initiateFilterUI, clearFilter } from '../common/index';import { CellEditEventArgs, CellSaveEventArgs, ribbon, formulaBar, sheetTabs, formulaOperation, addRibbonTabs } from '../common/index';import { addContextMenuItems, removeContextMenuItems, enableContextMenuItems, selectRange, addToolbarItems } from '../common/index';import { cut, copy, paste, PasteSpecialType, dialog, editOperation, activeSheetChanged, refreshFormulaDatasource } from '../common/index';import { Render } from '../renderer/render';import { Scroll, VirtualScroll, Edit, CellFormat, Selection, KeyboardNavigation, KeyboardShortcut, WrapText } from '../actions/index';import { Clipboard, ShowHide, UndoRedo, SpreadsheetHyperlink, Resize, Insert, Delete, FindAndReplace, Merge } from '../actions/index';import { ProtectSheet } from '../actions/index';import { CellRenderEventArgs, IRenderer, IViewport, OpenOptions, MenuSelectEventArgs, click, hideFileMenuItems } from '../common/index';import { Dialog, ActionEvents, Overlay } from '../services/index';import { ServiceLocator } from '../../workbook/services/index';import { SheetModel, getColumnsWidth, getSheetIndex, WorkbookHyperlink, HyperlinkModel, DefineNameModel } from './../../workbook/index';import { BeforeHyperlinkArgs, AfterHyperlinkArgs, getCellAddress, FindOptions, ValidationModel } from './../../workbook/common/index';import { activeCellChanged, BeforeCellFormatArgs, afterHyperlinkCreate, getColIndex, CellStyleModel } from './../../workbook/index';import { BeforeSaveEventArgs, SaveCompleteEventArgs, WorkbookInsert, WorkbookDelete, WorkbookMerge } from './../../workbook/index';import { getSheetNameFromAddress, DataBind, CellModel, beforeHyperlinkCreate, DataSourceChangedEventArgs } from './../../workbook/index';import { BeforeSortEventArgs, SortOptions, sortComplete, SortEventArgs, dataSourceChanged } from './../../workbook/index';import { getSheetIndexFromId, WorkbookEdit, WorkbookOpen, WorkbookSave, WorkbookCellFormat, WorkbookSort } from './../../workbook/index';import { FilterOptions, FilterEventArgs, ProtectSettingsModel, findKeyUp } from './../../workbook/index';import { Workbook } from '../../workbook/base/workbook';import { getRequiredModules, ScrollSettings, ScrollSettingsModel, SelectionSettingsModel, enableToolbarItems } from '../common/index';import { SelectionSettings, BeforeSelectEventArgs, SelectEventArgs, getStartEvent, enableRibbonTabs } from '../common/index';import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import { setRowHeight, getRowsHeight, getColumnWidth, getRowHeight } from './../../workbook/base/index';import { getRangeIndexes, getIndexesFromAddress, getCellIndexes, WorkbookNumberFormat, WorkbookFormula } from '../../workbook/index';import { RefreshValueArgs, Ribbon, FormulaBar, SheetTabs, Open, ContextMenu, Save, NumberFormat, Formula } from '../integrations/index';import { Sort, Filter, SpreadsheetImage, SpreadsheetChart } from '../integrations/index';import { isNumber, getColumn, WorkbookFilter } from '../../workbook/index';import { PredicateModel } from '@syncfusion/ej2-grids';import { RibbonItemModel } from '../../ribbon/index';import { DataValidation } from '../actions/index';import { WorkbookDataValidation, WorkbookConditionalFormat, WorkbookFindAndReplace } from '../../workbook/actions/index';import { FindAllArgs, findAllValues, ClearOptions, ConditionalFormatModel, ImageModel } from './../../workbook/common/index';import { ConditionalFormatting } from '../actions/conditional-formatting';import { WorkbookImage, WorkbookChart } from '../../workbook/integrations/index';import { WorkbookProtectSheet } from '../../workbook/actions/index';
import {WorkbookModel} from "../../workbook/base/workbook-model";

/**
 * Interface for a class Spreadsheet
 */
export interface SpreadsheetModel extends WorkbookModel{

    /**
     * To specify a CSS class or multiple CSS class separated by a space, add it in the Spreadsheet root element.
     * This allows you to customize the appearance of component.
     * ```html
     * <div id='spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *  cssClass: 'e-custom1 e-custom2',
     *  ...
     * }, '#spreadsheet');
     * ```
     * @default ''
     */
    cssClass?: string;

    /**
     * It specifies whether the Spreadsheet should be rendered with scrolling or not.
     * To customize the Spreadsheet scrolling behavior, use the [`scrollSettings`]
     * (https://ej2.syncfusion.com/documentation/api/spreadsheet/#scrollSettings) property.
     * @default true
     */
    allowScrolling?: boolean;

    /**
     * If `allowResizing` is set to true, spreadsheet columns and rows can be resized.
     * @default true
     */
    allowResizing?: boolean;

    /**
     * It enables or disables the clipboard operations (cut, copy, and paste) of the Spreadsheet.
     * @default true
     */
    enableClipboard?: boolean;

    /**
     * It enables or disables the context menu option of spreadsheet. By default, context menu will opens for row header,
     * column header, sheet tabs, and cell.
     * @default true
     */
    enableContextMenu?: boolean;

    /**
     * It allows you to interact with cell, pager, formula bar, and ribbon through the keyboard device.
     * @default true
     */
    enableKeyboardNavigation?: boolean;

    /**
     * It enables shortcut keys to perform Spreadsheet operations like open, save, copy, paste, and more.
     * @default true
     */
    enableKeyboardShortcut?: boolean;

    /**
     * It allows to enable/disable undo and redo functionalities.
     * @default true
     */
    allowUndoRedo?: boolean;

    /**
     * It allows to enable/disable wrap text feature. By using this feature the wrapping applied cell text can wrap to the next line,
     * if the text width exceeds the column width.
     * @default true
     */
    allowWrap?: boolean;

    /**
     * Configures the selection settings.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      selectionSettings: {
     *          mode: 'None'
     *      }
     * ...
     * }, '#Spreadsheet');
     * 
     * The selectionSettings `mode` property has three values and it is described below:
     * 
     * * None: Disables UI selection.
     * * Single: Allows single selection of cell, row, or column and disables multiple selection.
     * * Multiple: Allows multiple selection of cell, row, or column and disables single selection.
     * 
     * ```
     * @default { mode: 'Multiple' }
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Configures the scroll settings.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      scrollSettings: {
     *          isFinite: true,
     *          enableVirtualization: false
     *      }
     * ...
     *  }, '#Spreadsheet');
     * ```
     * > The `allowScrolling` property should be `true`.
     * @default { isFinite: false, enableVirtualization: true }
     */
    scrollSettings?: ScrollSettingsModel;

    /**
     * Triggers before the cell appended to the DOM.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      beforeCellRender: (args: CellRenderEventArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeCellRender?: EmitType<CellRenderEventArgs>;

    /**
     * Triggers before the cell or range of cells being selected.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      beforeSelect: (args: BeforeSelectEventArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeSelect?: EmitType<BeforeSelectEventArgs>;

    /**
     * Triggers after the cell or range of cells is selected.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *      select: (args: SelectEventArgs) => {
     *      }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    select?: EmitType<SelectEventArgs>;

    /**
     * Triggers before opening the context menu and it allows customizing the menu items.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       contextMenuBeforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    contextMenuBeforeOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before opening the file menu.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       fileMenuBeforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    fileMenuBeforeOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the context menu.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       contextMenuBeforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    contextMenuBeforeClose?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before opening the dialog box.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       dialogBeforeOpen: (args: DialogBeforeOpenEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    dialogBeforeOpen?: EmitType<DialogBeforeOpenEventArgs>;

    /**
     * Triggers before closing the file menu.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       fileMenuBeforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    fileMenuBeforeClose?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when the context menu item is selected.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       contextMenuItemSelect: (args: MenuSelectEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    contextMenuItemSelect?: EmitType<MenuSelectEventArgs>;

    /**
     * Triggers when the file menu item is selected.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       fileMenuItemSelect: (args: MenuSelectEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    fileMenuItemSelect?: EmitType<MenuSelectEventArgs>;

    /**
     * Triggers before the data is populated to the worksheet.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeDataBound: (args: Object) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeDataBound?: EmitType<Object>;

    /**
     * Triggers when the data is populated in the worksheet.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       dataBound: (args: Object) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event 
     */
    dataBound?: EmitType<Object>;

    /**
     * Triggers during data changes when the data is provided as `dataSource` in the Spreadsheet.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       dataSourceChanged: (args: DataSourceChangedEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    dataSourceChanged?: EmitType<DataSourceChangedEventArgs>;

    /**
     * Triggers when the cell is being edited.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       cellEdit: (args: CellEditEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    cellEdit?: EmitType<CellEditEventArgs>;

    /**
     * Triggers every time a request is made to access cell information.
     * This will be triggered when editing a cell.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       cellEditing: (args: CellEditEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    cellEditing?: EmitType<CellEditEventArgs>;

    /**
     * Triggers when the edited cell is saved.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       cellSave: (args: CellSaveEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    cellSave?: EmitType<CellSaveEventArgs>;

    /**
     * Triggers when before the cell is saved.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeCellSave: (args: CellEditEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeCellSave?: EmitType<CellEditEventArgs>;

    /**
     * Triggers when the component is created.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       created: () => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    created?: EmitType<Event>;

    /**
     * Triggers before sorting the specified range.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeSort: (args: BeforeSortEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeSort?: EmitType<BeforeSortEventArgs>;

    /**
     * Triggers before insert a hyperlink.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeHyperlinkCreate: (args: BeforeHyperlinkArgs ) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeHyperlinkCreate?: EmitType<BeforeHyperlinkArgs>;

    /**
     * Triggers after the hyperlink inserted.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       afterHyperlinkCreate: (args: afterHyperlinkArgs ) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    afterHyperlinkCreate?: EmitType<AfterHyperlinkArgs>;

    /**
     * Triggers when the Hyperlink is clicked.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       beforeHyperlinkClick: (args: BeforeHyperlinkArgs ) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    beforeHyperlinkClick?: EmitType<BeforeHyperlinkArgs>;

    /**
     * Triggers when the Hyperlink function gets completed.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       afterHyperlinkClick: (args: AfterHyperlinkArgs ) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    afterHyperlinkClick?: EmitType<AfterHyperlinkArgs>;

    /**
     * Triggers when the Spreadsheet actions (such as editing, formatting, sorting etc..) are starts.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       actionBegin: (args: BeforeCellFormatArgs|BeforeOpenEventArgs|BeforeSaveEventArgs|BeforeSelectEventArgs
     *                    |BeforeSortEventArgs|CellEditEventArgs|MenuSelectEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    actionBegin?: EmitType<BeforeCellFormatArgs | BeforeOpenEventArgs | BeforeSaveEventArgs | BeforeSelectEventArgs | BeforeSortEventArgs | CellEditEventArgs | MenuSelectEventArgs>;

    /**
     * Triggers when the spreadsheet actions (such as editing, formatting, sorting etc..) gets completed.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       actionComplete: (args: SortEventArgs|CellSaveEventArgs|SaveCompleteEventArgs|Object) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    actionComplete?: EmitType<SortEventArgs | CellSaveEventArgs | SaveCompleteEventArgs | Object>;

    /**
     * Triggers when the spreadsheet importing gets completed.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       openComplete: (args: Object) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    openComplete?: EmitType<Object>;

    /**
     * Triggers after sorting action is completed.
     * ```html
     * <div id='Spreadsheet'></div>
     * ```
     * ```typescript
     * new Spreadsheet({
     *       sortComplete: (args: SortEventArgs) => {
     *       }
     *      ...
     *  }, '#Spreadsheet');
     * ```
     * @event
     */
    sortComplete?: EmitType<SortEventArgs>;

}