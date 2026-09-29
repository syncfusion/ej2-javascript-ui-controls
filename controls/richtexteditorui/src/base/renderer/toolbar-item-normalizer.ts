/**
 * Toolbar item normalizer.
 *
 * Converts the heterogeneous ToolbarItem union into a uniform internal
 * ToolbarItemModel used throughout the toolbar module stack.
 */

import { ItemModel } from '@syncfusion/ej2-navigations';
import { L10n, Browser } from '@syncfusion/ej2-base';
import { ToolbarItem, BuiltInToolbarItem, BuiltInToolbarItemConfig, CustomToolbarItem } from '../../richtexteditor-ui/model';
import { getLinkToolbarItemConfig, getTableToolbarItemConfig, getImageToolbarItemConfig, getToolbarItemConfig, LINK_TOOLBAR_ITEM_CONFIGS, LinkToolbarItem, TABLE_TOOLBAR_ITEM_CONFIGS, TableToolbarItem, IMAGE_TOOLBAR_ITEM_CONFIGS, ImageToolbarItem, ToolbarItemConfig, ToolbarSubItem } from './toolbar-item-config';
import { CustomUserAgentData } from './../../common/user-agent';



/**
 * Error thrown when initialization of toolbar items fails due to invalid input.
 */
export class ToolbarInitializationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ToolbarInitializationError';
    }
}

/**
 * Normalizes ToolbarItem values into uniform ToolbarItemModel objects.
 */
export class ToolbarItemNormalizer {

    private localeObj: L10n | null;
    public userAgentData: CustomUserAgentData | null;
    private toolbarContext: 'Image' | 'Table' | 'Link' | null;

    public constructor(localeObj?: L10n | null, toolbarContext?: 'Image' | 'Table' | 'Link' | null) {
        this.localeObj = localeObj || null;
        this.userAgentData = new CustomUserAgentData(Browser.userAgent, false);
        this.toolbarContext = toolbarContext || null;
    }
    private getConfig(item: string): ToolbarItemConfig {
        if (this.toolbarContext === 'Image' && item in IMAGE_TOOLBAR_ITEM_CONFIGS) {
            return getImageToolbarItemConfig(item as ImageToolbarItem);
        }
        if (this.toolbarContext === 'Table' && item in TABLE_TOOLBAR_ITEM_CONFIGS) {
            return getTableToolbarItemConfig(item as TableToolbarItem);
        }
        if (this.toolbarContext === 'Link' && item in LINK_TOOLBAR_ITEM_CONFIGS) {
            return getLinkToolbarItemConfig(item as LinkToolbarItem);
        }

        return getToolbarItemConfig(item as BuiltInToolbarItem);
    }
    /*
     * Normalizes a ToolbarItem into a ToolbarItemModel.
     *
     * Supports separators, built-in items, built-in configs,
     * and custom items.
     *
     * @param item - Item to normalize
     * @param position - Item position
     * @returns Normalized item model
     */
    public create(item: ToolbarItem, position: number, shortcuts?: Readonly<Record<string, string>>): ToolbarItemModel {
        // Separator
        if (item === '|') {
            return {
                id: '__separator_' + position,
                source: item,
                controlType: 'separator',
                toolbarItem: { type: 'Separator' }
            };
        }

        // Built-in item string (e.g., 'Bold')
        if (typeof item === 'string') {
            const config: ToolbarItemConfig  = this.getConfig(item as BuiltInToolbarItem);
            const shortcut: string | undefined = this.getToolbarShortcut(config.command, shortcuts);

            const toolbarItem: ItemModel & { items?: ToolbarSubItem[] } = {
                id: item,
                prefixIcon: config.iconCss,
                tooltipText: this.buildTooltipText(this.getLocaleText(config.tooltipKey), shortcut ?
                    this.toTooltipShortcut(shortcut) : config.shortcuts),
                type: 'Button'
            };
            // Attach optional nested items for dropdown / splitButton items.
            if (config.items) {
                toolbarItem.items = this.getLocalizedItems(config.items);
            }
            return {
                id: item,
                source: item,
                controlType: config.controlType,
                editorColorPickerType: config.editorColorPickerType,
                command: config.command,
                shortcut: shortcut ? this.toAriaShortcut(shortcut) : undefined,
                toolbarItem: toolbarItem,
                renderMode: config.renderMode
            };
        }

        const customItem: CustomToolbarItem = item as CustomToolbarItem;

        // Template custom item
        if (customItem.template) {
            return {
                id: customItem.id as string,
                source: item,
                controlType: 'template',
                toolbarItem: {
                    id: customItem.id,
                    template: customItem.template,
                    type: 'Input'
                }
            };
        }

        // Existing custom button logic
        const customTooltip: string = customItem.tooltipText ||
            this.buildShortcutOnlyTooltip(customItem.windowsShortcutText, customItem.macShortcutText);
        return {
            id: customItem.id || customItem.actionId,
            source: item,
            controlType: 'button',
            command: customItem.actionId,
            toolbarItem: {
                id: customItem.id || customItem.actionId,
                text: customItem.text,
                prefixIcon: customItem.prefixIcon,
                tooltipText: customTooltip,
                type: 'Button'
            }
        };
    }

    /*
     * Normalizes a collection of ToolbarItems.
     *
     * Ensures item IDs are unique before returning
     * the normalized item list.
     *
     * @param items - Items to normalize
     * @returns Normalized item models
     * @throws ToolbarInitializationError on duplicate IDs
     */
    public createAll(items: ToolbarItem[], shortcuts?: Readonly<Record<string, string>>): ToolbarItemModel[] {
        const normalized: ToolbarItemModel[] = [];
        for (let i: number = 0; i < items.length; i++) {
            normalized.push(this.create(items[i as number], i, shortcuts));
        }

        // Check for duplicate IDs (excluding separators which have unique synthetic IDs)
        const seenIds: string[] = [];
        for (let i: number = 0; i < normalized.length; i++) {
            const id: string = normalized[i as number].id;
            if (id.indexOf('__separator_') === 0) {
                // Separators use position-based IDs, always unique
                continue;
            }
            if (seenIds.indexOf(id) !== -1) {
                throw new ToolbarInitializationError(
                    'Duplicate toolbar item ID detected: "' + id + '". ' +
                    'Each toolbar item must have a unique ID. ' +
                    'The entire items batch has been rejected.'
                );
            }
            seenIds.push(id);
        }

        return normalized;
    }

    /*
     * Builds a tooltip with an optional shortcut hint.
     *
     * @param label - Tooltip label
     * @param shortcuts - Shortcut configuration
     * @returns Tooltip text
     */
    private buildTooltipText(label: string, shortcuts?: { windows?: string[]; mac?: string[] }): string {
        if (!label) {
            return '';
        }
        const hint: string | undefined = this.getShortcutHint(shortcuts);
        return hint ? label + ' (' + hint + ')' : label;
    }

    private getLocaleText(key: string): string {
        const localeKey: string = key.charAt(0).toLowerCase() + key.slice(1);
        return this.localeObj ? this.localeObj.getConstant(localeKey) : key;
    }

    private getLocalizedItems(items: ItemModel[]): ItemModel[] {
        return items.map((item: ItemModel) => {
            const localizedItem: ItemModel = { ...item };
            const key: string | undefined = this.getNestedLocaleKey(item.id as string);
            if (key) {
                localizedItem.text = this.getLocaleText(key);
            }
            return localizedItem;
        });
    }

    private getNestedLocaleKey(id: string): string | undefined {
        const keys: { [key: string]: string } = {
            'Paragraph': 'paragraph',
            'Heading 1': 'heading1',
            'Heading 2': 'heading2',
            'Heading 3': 'heading3',
            'Heading 4': 'heading4',
            'AlignLeft': 'alignLeft',
            'AlignCenter': 'alignCenter',
            'AlignRight': 'alignRight',
            'AlignJustify': 'alignJustify'
        };
        return keys[id as string];
    }

    /*
     * Builds a tooltip string from shortcut-only text (no label).
     * Used by custom items that only define shortcut text.
     */
    private buildShortcutOnlyTooltip(windows?: string, mac?: string): string {
        return this.isMacPlatform() ? (mac || windows || '') : (windows || mac || '');
    }

    private getToolbarShortcut(command?: string, shortcuts?: Readonly<Record<string, string>>): string | undefined {
        return command && shortcuts ? shortcuts[command as string] : undefined;
    }

    private toTooltipShortcut(binding: string): { windows?: string[]; mac?: string[] } {
        const tokens: string[] = binding.split('+');
        const display: string[] = tokens.map((token: string): string => {
            switch (token) {
            case 'meta': return '⌘';
            case 'ctrl': return 'Ctrl';
            case 'alt': return 'Alt';
            case 'shift': return 'Shift';
            case 'tab': return 'Tab';
            default: return token.toUpperCase();
            }
        });
        return tokens.indexOf('meta') !== -1 ? { mac: [display.join(' ')] } : { windows: [display.join('+')] };
    }

    private toAriaShortcut(binding: string): string {
        return binding.split('+').map((token: string): string => {
            switch (token) {
            case 'meta': return 'Meta';
            case 'ctrl': return 'Control';
            case 'alt': return 'Alt';
            case 'shift': return 'Shift';
            default: return token.toUpperCase();
            }
        }).join('+');
    }

    /*
     * Returns the shortcut hint for the current platform.
     *
     * @param shortcuts - Optional shortcut configuration
     * @returns Shortcut hint string, or undefined if no shortcut is available
     */
    private getShortcutHint(shortcuts?: { windows?: string[]; mac?: string[] }): string | undefined {
        if (!shortcuts) {
            return undefined;
        }
        if (this.isMacPlatform() && shortcuts.mac && shortcuts.mac.length > 0) {
            return shortcuts.mac.join(', ');
        }
        if (shortcuts.windows && shortcuts.windows.length > 0) {
            return shortcuts.windows.join(', ');
        }
        if (shortcuts.mac && shortcuts.mac.length > 0) {
            return shortcuts.mac.join(', ');
        }
        return undefined;
    }

    /*
     * Returns true when the current platform is macOS or iOS.
     *
     * Delegates to userAgentData so platform detection stays consistent
     * with the rest of the editor (and tests using the `isTesting` flag).
     */
    private isMacPlatform(): boolean {
        if (!this.userAgentData) {
            return false;
        }
        const platform: string = this.userAgentData.getPlatform();
        return platform === 'macOS' || platform === 'iOS';
    }

    /*
     * Destroys the normalizer and releases the userAgentData reference.
     *
     * Should be called when the owning toolbar is being disposed.
     */
    public destroy(): void {
        this.userAgentData = null;
        this.localeObj = null;
    }
}

/**
 * Internal normalized representation of a toolbar item.
 * Not exported — internal to the toolbar module only.
 */
interface ToolbarItemModel {
    /** Stable, unique item ID */
    id: string;
    /** Original source item before normalization */
    source: ToolbarItem;
    /** Control rendering type */
    controlType: 'button' | 'dropdown' | 'splitButton' | 'colorPicker' | 'template' | 'separator';
    /** Editor command name to execute on click */
    command?: string;
    /** EJ2 Toolbar ItemModel (extended with optional `items`) for rendering */
    toolbarItem: ItemModel & { items?: ToolbarSubItem[] };
    /** Identifies the color picker variant used by the editor. Only applicable when controlType is 'colorPicker'. */
    editorColorPickerType?: 'FontColor' | 'BackgroundColor';
    /** Resolved shortcut in ARIA keyshortcuts format. */
    shortcut?: string;
    /** Specify the rendering way for the dropdown button content */
    renderMode?: string;
}

export { ToolbarItemModel };
