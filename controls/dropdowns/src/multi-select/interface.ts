import { Component, KeyboardEventArgs } from '@syncfusion/ej2-base';
import { Popup } from '@syncfusion/ej2-popups';
/**
 * Specifies mulitselct interfaces.
 *
 * @hidden
 */


export interface IMulitSelect extends Component<HTMLElement> {
    listCurrentOptions?: { [key: string]: Object }
    inputElement?: HTMLInputElement
    popupWrapper?: HTMLDivElement
    selectAll?(state?: boolean): void
    selectAllHeight?: number
    searchBoxHeight?: number
    onInput?(): void
    filterInput?: HTMLInputElement
    keyUp?(e?: KeyboardEventArgs): void
    onKeyDown?(e?: KeyboardEventArgs): void
    mainList?: HTMLElement
    list?: HTMLElement
    listData?: { [key: string]: Object }[]
    targetElement?(): string
    targetInputElement?: HTMLInputElement | string
    selectAllText?: string
    unSelectAllText?: string
    popupObj?: Popup
    onDocumentFocus?: boolean
    selectAllItems?(status: boolean, event?: MouseEvent): void
    hidePopup?(): void
    refreshPopup?(): void
    refreshListItems?(data?: string): void
    filterBarPlaceholder?: string
    overAllWrapper?: HTMLDivElement
    searchWrapper?: HTMLElement
    componentWrapper?: HTMLDivElement
    templateList?: { [key: string]: Object }
    itemTemplate?: string
    headerTemplate?: string
    mobFilter?: boolean
    header?: HTMLElement
    updateDelimView?(): void
    updateValueState?(event?: KeyboardEventArgs | MouseEvent, newVal?: [string | number], oldVal?: [string | number]): void
    tempValues?: [number | string]
    value?: [number | string]
    refreshInputHight?(): void
    refreshPlaceHolder?(): void
    ulElement?: HTMLElement
    hiddenElement?: HTMLSelectElement
    dispatchEvent?(element?: HTMLElement, type?: string): void
    inputFocus?: boolean
    enableSelectionOrder?: boolean
    focusAtFirstListItem(): void
    isPopupOpen(): boolean
    showSelectAll: boolean
    scrollFocusStatus: boolean
    focused: boolean
    onBlurHandler(eve?: MouseEvent, isDocClickFromCheck?: boolean): void
    keyAction?: boolean
    removeFocus?(): void
    getLocaleName?(): string
    filterParent: HTMLElement
    enableGroupCheckBox : boolean
    pasteHandler?(e?: KeyboardEventArgs): void
    cssClass: string
    isDynamicDataChange?: boolean
    search?(e: KeyboardEventArgs): void
    allowFiltering?: boolean
}
