import { BlazorDotnetObject, EventHandler, isNullOrUndefined, enableBlazorMode } from '@syncfusion/ej2-base';
import { SfGrid } from './sf-grid-fn';
import { getScrollBarWidth } from './util';
import { BlazorGridElement, IGridOptions, Column } from './interfaces';
/**
 * Blazor grid interop handler
 */
// tslint:disable
let Grid: object = {
    initialize(element: BlazorGridElement, options: IGridOptions, dotnetRef: BlazorDotnetObject): void {
        enableBlazorMode();
        new SfGrid(element, options, dotnetRef);
    },

    contentReady(element: BlazorGridElement, options: IGridOptions, action: string) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            var instance = element.blazor__instance;
            instance.setOptions(options, instance.options);
            instance.options = options;
            instance.contentReady(action);
        }
    },

    reorderColumns(element: BlazorGridElement, fromFName: string | string[], toFName: string) { //NEW
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.reorderModule.reorderColumns(fromFName, toFName);
        }
    },

    reorderColumnByIndex(element: BlazorGridElement, fromIndex: number, toIndex: number) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.reorderModule.reorderColumnByIndex(fromIndex, toIndex);
        }
    },

    reorderColumnByTargetIndex(element: BlazorGridElement, fieldName: string, toIndex: number) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.reorderModule.reorderColumnByTargetIndex(fieldName, toIndex);
        }
    },
    renderColumnChooser: function (element: BlazorGridElement) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.columnChooserModule.renderColumnChooser();
        }
    },
    renderColumnMenu: function (element: BlazorGridElement, uid: string, isFilter: boolean, key: string) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            return element.blazor__instance.columnMenuModule.renderColumnMenu(uid, isFilter, key);
        }
        else {
            return { Left: 1, Top: 1 };
        }
    },
    filterPopupRender: function filterPopupRender(element: BlazorGridElement, dlgID: string, uid: string, type: string, isColumnMenu: boolean) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.filterModule.filterPopupRender(dlgID, uid, type, isColumnMenu);
        }
    },
    clientTransformUpdate: function clientTransformUpdate(element: BlazorGridElement, xPosition: number, yPosition: number) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.virtualContentModule.updateTransform(xPosition, yPosition);
        }
    },
    autoFitColumns(element: BlazorGridElement, columns: Column[], fieldNames: string | string[]) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            var instance = element.blazor__instance;
            instance.options.columns = columns;
            element.blazor__instance.resizeModule.autoFitColumns(fieldNames);
        }
    },
    refreshColumnIndex(element: BlazorGridElement, columns: Column[]) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            var instance = element.blazor__instance;
            instance.options.columns = columns;
            instance.virtualContentModule.refreshColumnIndexes();
        }
    },
    focus(element: BlazorGridElement, rowuid: string, celluid: string, action: string) {
        let cell: HTMLElement = element.querySelector("[data-uid=\"" + celluid + "\"]");
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance) && !isNullOrUndefined(cell)) {
            var instance = element.blazor__instance;
            if (!instance.options.enableVirtualization) {
                cell.focus();
            } else {
                instance.virtualContentModule.focusCell(cell, action);
            }
        }
    },
    focusExcelInput(element: BlazorGridElement, celluid: string) {
        let excelPopup: HTMLElement = document.querySelector("#" + celluid + "_excelDlg");
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance) && !isNullOrUndefined(excelPopup)) {
            setTimeout(() => {
                (excelPopup.querySelector("#" + element.id + "_SearchBox") as HTMLElement).focus();
            }, 10);
        }
    },
    refreshOnDataChange(element: BlazorGridElement) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.virtualContentModule.refreshOnDataChange();
        }
    },
    updateAutofillPosition(element: BlazorGridElement, cellindex: number, index: number) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            var _this = element.blazor__instance;
            return _this.selectionModule.updateAutofillPosition(cellindex, index);
        }
        else{
            return null;
        }
    },
    createBorder(element: BlazorGridElement, rowIndex: number, cellIndex: number) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            var _this = element.blazor__instance;
            return _this.selectionModule.createBorder(rowIndex, cellIndex);
        }
        else{
            return null;
        }
    },
    removePersistItem(element: BlazorGridElement, id: string) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            let _this: SfGrid = element.blazor__instance;
            (_this.getHeaderTable() as HTMLTableElement).style.width = "";
            (_this.getContentTable() as HTMLTableElement).style.width = "";
            if (_this.options.aggregatesCount != 0) {
                (_this.getFooterContent().querySelector(".e-table") as HTMLTableElement).style.width  = "";
            }
            if (_this.options.frozenColumns > 0) {
                (_this.element.querySelector(".e-movableheader").querySelector('.e-table') as HTMLTableElement).style.width = "";
                (_this.element.querySelector(".e-movablecontent").querySelector('.e-table') as HTMLTableElement).style.width = "";
            }
        }
        localStorage.removeItem(id);
    },
    focusChild(element: BlazorGridElement, rowuid: string, celluid: string) {
        let query = 'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';
        let child = [].slice.call(element.querySelector("[data-uid=\"" + celluid + "\"]").querySelectorAll(query));

        /* Select the first focusable child element
         * if no child found then select the cell itself.
         * if Grid is in editable state, check for editable control inside child.
         */
        child.length > 0 ? child[0].focus() : (<HTMLElement>element.querySelector("[data-uid=\"" + celluid + "\"]")).focus();
        return child.length ? true : false;
    },
    exportSave(filename: string, bytesBase64: string) {
        if (navigator.msSaveBlob) {
            //Download document in Edge browser
            let data: string = window.atob(bytesBase64);
            let bytes: any = new Uint8Array(data.length);
            for (var i = 0; i < data.length; i++) {
                bytes[i] = data.charCodeAt(i);
            }
            let blob = new Blob([bytes.buffer], { type: "application/octet-stream" });
            navigator.msSaveBlob(blob, filename);
        }
        else {
            let link: HTMLAnchorElement = document.createElement('a');
            link.download = filename;
            link.href = "data:application/octet-stream;base64," + bytesBase64;
            document.body.appendChild(link); // Needed for Firefox
            link.click();
            document.body.removeChild(link);
        }
    },
    destroy(element: BlazorGridElement) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.destroy();
        }
    },

    validation(element: BlazorGridElement, results: object[], isAdd: boolean) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.editModule.createTooltip(results, isAdd);
        }
    },

    focusCell(element: BlazorGridElement, field: string, isAdd: boolean) {
        if (isAdd && !isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance) && element.blazor__instance.options.frozenColumns) {
            (element.querySelector('.e-frozencontent') as HTMLElement).style.height =
                element.querySelector('.e-movablecontent').getBoundingClientRect().height + 'px';
        }
        let complexField: string = `#${field.replace(/[.]/g, "___")}`;
        if (field === "" && element.querySelector("input.e-boolcell")) {
            (element.querySelector("input.e-boolcell") as HTMLElement).focus();
        } else if (field !== "" && element.querySelector(complexField)) {
            (element.querySelector(complexField) as HTMLElement).focus();
        }
    },

    setFrozenHeight(element: BlazorGridElement) {
        (element.querySelector('.e-frozencontent') as HTMLElement).style.height =
            (element.querySelector('.e-movablecontent') as HTMLElement).offsetHeight - getScrollBarWidth() + 'px';
    },

    printGrid(element: BlazorGridElement) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.print();
        }
    },
    updateMediaColumns(element: BlazorGridElement, mediaColumnsUid: { [uid: string]: boolean }) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.columnChooserModule.updateMediaColumns(mediaColumnsUid);
        }
    },
    copyToClipBoard(element: BlazorGridElement, withHeader?: boolean) {
        if (!isNullOrUndefined(element) && !isNullOrUndefined(element.blazor__instance)) {
            element.blazor__instance.clipboardModule.copy(withHeader);
        }
    },
    gridFocus(element: BlazorGridElement) {
        if (!isNullOrUndefined(element)) {
            element.focus();
        }
    },

    isMacDevice() {
		return navigator.userAgent.indexOf("Mac OS") !== -1;
	},
};

export default Grid;