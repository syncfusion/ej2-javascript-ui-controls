/**
 * Toolbar Module Interface
 *
 * Defines the contract that the Toolbar module must implement.
 * EditorBase uses this interface to communicate with the Toolbar module.
 */
import { ToolbarItemUpdate, ToolbarType, ToolbarPosition } from '../richtexteditor-ui/model/toolbar.types';
import { ColorPickerEventArgs, ColorPickerModel } from '@syncfusion/ej2-inputs';
/**
 * Interface for the Toolbar module integration with EditorBase.
 *
 * The Toolbar module is responsible for:
 * - Managing toolbar rendering and DOM operations
 * - Applying type, position, and floating changes to the UI
 * - Handling toolbar item updates via reconciliation
 *
 * EditorBase delegates all toolbar-related operations to this module
 * after validating input and running reconciliation logic.
 */
export interface IToolbar {
    /**
     * Updates the toolbar type (Expanded, MultiRow, Popup, Scrollable).
     *
     * @param type - The new toolbar type
     * @throws Error if implementation fails
     */
    updateType(type: ToolbarType): void;
    /**
     * Updates the toolbar position (Top, Bottom).
     *
     * @param position - The new toolbar position
     * @throws Error if implementation fails
     */
    updatePosition(position: ToolbarPosition): void;
    /**
     * Enables or disables floating behavior and sets the offset.
     *
     * @param enableFloating - Whether to enable floating mode
     * @param floatingOffset - Offset in pixels when floating is enabled (default: 0)
     * @throws Error if implementation fails
     */
    updateFloating(enableFloating: boolean, floatingOffset: number): void;
    /**
     * Updates toolbar items based on reconciliation operations or direct replacement.
     *
     * Accepts either:
     * 1. Array of operations: { action: 'add'|'remove'|'show'|'hide'|'enable'|'disable', ... }
     *    - Uses smart diffing to selectively add/remove/toggle items
     * 2. Empty array: Clears all toolbar items
     *
     * @param updates - Discriminated union operations to apply
     * @throws Error if implementation fails
     */
    updateToolbarItems(updates: ToolbarItemUpdate[]): void;
}
export interface IColorPickerModel extends ColorPickerModel {
    value?: string;
    command?: string;
}
/**
 * @hidden
 * @private
 */
export interface IColorPickerEventArgs extends ColorPickerEventArgs {
    item?: IColorPickerModel;
    cancel?: boolean;
}
