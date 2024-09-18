import { Component, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { VirtualInfo } from '../common/virtual-scroll';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { GeneratedData } from '../drop-down-list/drop-down-list';
import { visualMode } from '../multi-select';
/**
 * Specifies virtual scroll interfaces.
 *
 * @hidden
 */

export interface IDropdownlist extends Component<HTMLElement> {
    popupContentElement: HTMLElement;
    isPreventScrollAction: boolean;
    listHeight: string;
    previousStartIndex: number;
    previousEndIndex: number;
    previousInfo: VirtualInfo;
    startIndex: number;
    currentPageNumber: number;
    isMouseScrollAction: boolean;
    isPreventKeyAction: boolean;
    pageCount: number;
    isKeyBoardAction: boolean;
    viewPortInfo: VirtualInfo;
    isUpwardScrolling: boolean;
    queryString: string;
    containerElementRect: ClientRect;
    isScrollActionTriggered: boolean;
    virtualListInfo: VirtualInfo;
    selectedValueInfo: VirtualInfo;
    value: number | string | boolean;
    totalItemCount: number;
    virtualItemCount: number;
    virtualItemEndIndex: number;
    virtualItemStartIndex: number;
    popupObj: Popup;
    listItemHeight: number;
    scrollPreStartIndex: number;
    list: HTMLElement;
    liCollections: HTMLElement[];
    typedString: string
    isVirtualScrolling: boolean;
    isCustomFilter: boolean;
    customFilterQuery: Query;
    allowFiltering: boolean;
    isPopupOpen: boolean;
    isTyped: boolean;
    setCurrentView: boolean;
    isRequesting: boolean;
    itemCount: number;
    fields: FieldSettingsModel;
    generatedDataObject: GeneratedData;
    keyboardEvent: KeyboardEventArgs;
    dataCount: number;
    filterInput: HTMLInputElement;
    dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[];
    listData: { [key: string]: Object }[] | string[] | boolean[] | number[];
    hideSelectedItem: boolean;
    closePopupOnSelect: boolean;
    mode: visualMode;
    isVirtualTrackHeight: boolean;
    virtualCustomData: { [key: string]: string | Object };
    virtualCustomSelectData: { [key: string]: Object }[] | string[] | number[] | boolean[];
    allowCustomValue: boolean;
    enableSelectionOrder: boolean;
    popupWrapper: HTMLDivElement;
    currentFocuedListElement: HTMLElement;
    isScrollChanged: boolean;
    appendUncheckList: boolean;
    keyCode: number;
    preventSetCurrentData: boolean;
    virtualGroupDataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[];
    renderItems(listData: { [key: string]: Object }[], fields: FieldSettingsModel): HTMLElement;
    renderItems(listData: { [key: string]: Object }[], fields: FieldSettingsModel, isCheckBoxUpdate?: boolean): HTMLElement;
    updatevirtualizationList(): void;
    scrollTop(selectedLI: HTMLElement, activeIndex: number, keyCode: number | null): void;
    updateVirtualReOrderList(isCheckBoxUpdate?: boolean): void;
    getForQuery(valuecheck: string[] | number[] | boolean[]): Query;
    skeletonCount: number;
    getElementByValue(value: string | number | boolean): Element
    getSkeletonCount(retainSkeleton?: boolean): void;
    getItems(): HTMLElement[];
    getQuery(query: Query): Query;
    getTransformValues(): string;
    addListFocus(element: HTMLElement): void;
    UpdateSkeleton(): void;
    updateSelectionList(): void;
    totalItemsCount(): void
    GetVirtualTrackHeight(): string;
    getPageCount(returnExactCount?: boolean): number;
    handleVirtualKeyboardActions(e: KeyboardEventArgs, pageCount: number): void;
    resetList(
        dataSource?: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        fields?: FieldSettingsModel, query?: Query, e?: MouseEvent | KeyboardEventArgs | TouchEvent): void
    findListElement(list: HTMLElement, findNode: string, attribute: string, value: string | boolean | number): HTMLElement;
    scrollStop(e?: Event): void;
}

