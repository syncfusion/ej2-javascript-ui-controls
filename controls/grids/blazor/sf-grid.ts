import { BlazorDotnetObject, EventHandler, enableBlazorMode } from '@syncfusion/ej2-base';
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

    contentReady (element: BlazorGridElement, options: IGridOptions, action: string) {
        var instance = element.blazor__instance;
        instance.setOptions(options, instance.options);
        instance.options = options;
        instance.contentReady(action);
    },

    reorderColumns(element: BlazorGridElement, fromFName: string | string[], toFName: string) { //NEW
        element.blazor__instance.reorderModule.reorderColumns(fromFName, toFName);
    },

    reorderColumnByIndex(element: BlazorGridElement, fromIndex: number, toIndex: number) {
        element.blazor__instance.reorderModule.reorderColumnByIndex(fromIndex, toIndex);
    },

    reorderColumnByTargetIndex(element: BlazorGridElement, fieldName: string, toIndex: number) {
        element.blazor__instance.reorderModule.reorderColumnByTargetIndex(fieldName, toIndex);
    },
    renderColumnChooser: function (element: BlazorGridElement) {
        element.blazor__instance.columnChooserModule.renderColumnChooser();
    },
    renderColumnMenu: function (element : BlazorGridElement, uid: string, isFilter: boolean, key: string) {
        return element.blazor__instance.columnMenuModule.renderColumnMenu(uid, isFilter, key);
    },
    filterPopupRender: function filterPopupRender(element: BlazorGridElement, dlgID: string, uid: string, type: string, isColumnMenu: boolean) {
        element.blazor__instance.filterModule.filterPopupRender(dlgID, uid, type, isColumnMenu);
    },
    autoFitColumns(element: BlazorGridElement, fieldNames: string | string[]) {
        element.blazor__instance.resizeModule.autoFitColumns(fieldNames);
    },
    refreshColumnIndex(element: BlazorGridElement, columns: Column[]) {
        var instance = element.blazor__instance;
        instance.options.columns = columns;
		instance.virtualContentModule.refreshColumnIndexes();
	},
    focus(element: BlazorGridElement, rowuid: string, celluid: string, action: string) {
        let cell: HTMLElement = element.querySelector("[data-uid=\"" + celluid + "\"]");
		var instance = element.blazor__instance;
		if (!instance.options.enableVirtualization) {
			cell.focus();
		} else {
            instance.virtualContentModule.focusCell(cell, action);
		}
    },
	refreshOnDataChange(element: BlazorGridElement) {
		element.blazor__instance.virtualContentModule.refreshOnDataChange();
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
        element.blazor__instance.destroy();
    },

    validation(element: BlazorGridElement, results: object[], isAdd: boolean) {
        element.blazor__instance.editModule.createTooltip(results, isAdd);
    },
      
    focusCell(element: BlazorGridElement, field: string, isAdd: boolean) {
        if (isAdd && element.blazor__instance.options.frozenColumns) {
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
        (element.querySelector('.e-movablecontent')as HTMLElement).offsetHeight - getScrollBarWidth() + 'px'; 
    },

    printGrid(element: BlazorGridElement) {
        element.blazor__instance.print();
    },
    updateMediaColumns(element: BlazorGridElement, mediaColumnsUid: { [uid: string]: boolean }) {
        element.blazor__instance.columnChooserModule.updateMediaColumns(mediaColumnsUid);
    },
    copyToClipBoard(element: BlazorGridElement, withHeader?: boolean){
        element.blazor__instance.clipboardModule.copy(withHeader);
    }
};

export default Grid;