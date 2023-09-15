import { Component, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
import { VirtualInfo } from '../common/virtual-scroll';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { GeneratedData } from '../drop-down-list/drop-down-list';
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
    allowFiltering: boolean;
    isPopupOpen: boolean;
    isTyped: boolean;
    itemCount: number;
    fields: FieldSettingsModel;
    generatedDataObject: GeneratedData;
    keyboardEvent: KeyboardEventArgs;
    dataCount: number;
    filterInput: HTMLInputElement;
    dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[];
    listData: { [key: string]: Object }[] | string[] | boolean[] | number[];
    getSkeletonCount(retainSkeleton?: boolean): void;
    getItems(): HTMLElement[];
    getQuery(query: Query): Query;
    getTransformValues(): string;
    UpdateSkeleton(): void;
    updateSelectionList(): void;
    GetVirtualTrackHeight(): string;
    getPageCount(returnExactCount?: boolean): number;
    handleVirtualKeyboardActions(e: KeyboardEventArgs, pageCount: number): void;
    renderItems(listData: { [key: string]: Object }[], fields: FieldSettingsModel): HTMLElement
    resetList(
        dataSource?: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        fields?: FieldSettingsModel, query?: Query, e?: MouseEvent | KeyboardEventArgs | TouchEvent): void
    findListElement(list: HTMLElement, findNode: string, attribute: string, value: string | boolean | number): HTMLElement;
}

