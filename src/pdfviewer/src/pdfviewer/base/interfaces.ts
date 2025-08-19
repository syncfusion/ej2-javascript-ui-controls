/**
 * ContextMenu module is used to handle the context menus used in the control.
 *
 * @hidden
 */
export interface IContextMenu {
    contextMenuElement: HTMLElement
    currentTarget: HTMLElement
    previousAction: string
    createContextMenu(): void
    open(top: number, left: number, target: HTMLElement): void
    close(): void
    destroy(): void
    OnItemSelected(selectedMenu: string): void
}

/**
 * This event arguments to send the disabled or hidden contextmenu items details to the C# for blazor alone.
 *
 * @hidden
 */
export interface MouseDownEventArgs {
    /**
     * Specified the hidden contextmenu items to server.
     */
    hidenItems: string[]

    /**
     * Specified the disabled contextmenu items to server.
     */
    disabledItems: string[]

    /**
     * Specified the cancel the event.
     */
    isCancel: boolean
}
