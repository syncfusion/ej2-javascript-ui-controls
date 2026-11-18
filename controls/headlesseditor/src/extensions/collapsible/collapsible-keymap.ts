/**
 * Collapsible Keymap Extension
 */

import { defineExtension } from '../define-extension';
import { ExtensionDefinition, ExtensionOptions, ExtensionScope } from '../types';

export type CollapsibleKeymapExtensionOptions = ExtensionOptions;

export const collapsibleKeymapExtension: ExtensionDefinition<CollapsibleKeymapExtensionOptions> = defineExtension({
    name: 'collapsibleKeymap',
    priority: 5,
    defineOptions(): CollapsibleKeymapExtensionOptions {
        return {};
    },
    keyboardShortcuts(this: ExtensionScope<CollapsibleKeymapExtensionOptions>): Record<string, () => boolean> {
        const onBackspace: () => boolean = (): boolean => {
            if (this.editor.commands.backspaceCollapsible()) {
                return true;
            }
            return false;
        };
        const onDelete: () => boolean = (): boolean => {
            if (this.editor.commands.deleteCollapsible()) {
                return true;
            }
            return false;
        };
        const onEnter: () => boolean = (): boolean => {
            if (this.editor.commands.enterCollapsible()) {
                return true;
            }
            return false;
        };
        return {
            'Backspace': onBackspace,
            'Mod-Backspace': onBackspace,
            'Delete': onDelete,
            'Mod-Delete': onDelete,
            'Enter': onEnter
        };
    }
});

export default collapsibleKeymapExtension;
