import { Component, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
/**
 * Specifies mulitselct interfaces.
 * @hidden
 */


export interface IMulitSelect extends Component<HTMLElement> {
    listCurrentOptions?: { [key: string]: Object };
    inputElement?: HTMLInputElement;
    popupWrapper?: HTMLDivElement;
    selectAll?(state?: boolean): void;
    selectAllHeight?: number;
    searchBoxHeight?: number;
    onInput?(): void;
    filterInput?: HTMLInputElement;
    KeyUp?(e?: KeyboardEventArgs): void;
    onKeyDown?(e?: KeyboardEventArgs): void;
    mainList?: HTMLElement;
    list?: HTMLElement;
    targetElement?(): string;
    targetInputElement?: HTMLInputElement | string;
    selectAllText?: string;
    unSelectAllText?: string;
    popupObj?: Popup;
    onDocumentFocus?: boolean;
    selectAllItems?(status: boolean, event?: MouseEvent): void;
    hidePopup?(): void;
    refreshPopup?(): void;
    refreshListItems?(data?: string): void;
    filterBarPlaceholder?: string;
    overAllWrapper?: HTMLDivElement;
    searchWrapper?: HTMLElement;
    componentWrapper?: HTMLDivElement;
    templateList?: { [key: string]: Object };
    itemTemplate?: string;
    headerTemplate?: string;
    mobFilter?: boolean;
    header?: HTMLElement;
    updateDelimView?(): void;
    updateValueState?(event?: KeyboardEventArgs | MouseEvent, newVal?: [string | number], oldVal?: [string | number]): void;
    tempValues?: [number | string];
    value?: [number | string];
    refreshInputHight?(): void;
    refreshPlaceHolder?(): void;
    ulElement?: HTMLElement;
    hiddenElement?: HTMLSelectElement;
    dispatchEvent?(element?: HTMLElement, type?: string): void;
    inputFocus?: boolean;
    enableSelectionOrder?: boolean;
    focusAtFirstListItem(): void;
    isPopupOpen(): boolean;
    showSelectAll: boolean;
    scrollFocusStatus: boolean;
    focused: boolean;
    onBlur(eve?: MouseEvent): void;
    keyAction?: boolean;
    removeFocus?(): void;

}