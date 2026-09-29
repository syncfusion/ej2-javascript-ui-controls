import { DEFAULT_EDITOR_KEY_BINDINGS, EditorKeyBindingAction, EditorKeyBindingMap } from '../model/key-bindings';
import { RichTextEditorUI } from '..';
import { ActionBeginEventArgs, EditorCommandName } from '../../controller/interface';
import { Browser, extend } from '@syncfusion/ej2-base';
import { CustomUserAgentData } from '../../common/user-agent';

export class KeyBindingRegistry {
    public static normalizeKeyBinding(binding: string, isMac: boolean): string {
        const tokens: string[] = binding
            .split('+')
            .map((token: string) => token.trim().toLowerCase())
            .filter((token: string) => token.length > 0);
        if (tokens.length === 0) {
            return binding;
        }
        const normalizedTokens: string[] = tokens.map((token: string): string => {
            /* eslint-disable */
            if (token === 'ctrl') {
                return isMac ? 'meta' : 'ctrl';
            }
            if (token === 'cmd') {
                return 'meta';
            }
            return token;
        });
        const keyToken: string = normalizedTokens[normalizedTokens.length - 1];
        const modifiers: string[] = normalizedTokens.slice(0, -1).sort((a: string, b: string) => {
            const order: string[] = ['meta', 'ctrl', 'alt', 'shift'];
            return order.indexOf(a) - order.indexOf(b);
        });
        const shortcutParts: string[] = extend([], modifiers) as string[];
        shortcutParts.push(keyToken);
        return shortcutParts.join('+');
    }

    public static toHeadlessShortcut(binding: string): string {
        const normalized: string = binding.replace(/\s+/g, '');
        const tokens: string[] = normalized.split('+').filter((token: string) => token.length > 0);
        if (tokens.length === 0) {
            return binding;
        }
        const keyToken: string = tokens[tokens.length - 1];
        const modifierTokens: string[] = tokens.slice(0, -1).map((token: string): string => token.toLowerCase());
        const hasCtrl: boolean = modifierTokens.indexOf('ctrl') !== -1 || modifierTokens.indexOf('meta') !== -1;
        const hasMeta: boolean = modifierTokens.indexOf('meta') !== -1;
        const hasAlt: boolean = modifierTokens.indexOf('alt') !== -1;
        const hasShift: boolean = modifierTokens.indexOf('shift') !== -1;
        const headlessParts: string[] = [];
        if (hasMeta) {
            headlessParts.push('Meta');
        } else if (hasCtrl) {
            headlessParts.push('Ctrl');
        }
        if (hasAlt) {
            headlessParts.push('Alt');
        }
        if (hasShift) {
            headlessParts.push('Shift');
        }
        if (headlessParts.length === 0) {
            return keyToken.toUpperCase();
        }
        return headlessParts.join('-') + '-' + keyToken;
    }

    public static getResolvedKeyBinding(editor: RichTextEditorUI, action: EditorKeyBindingAction): string | undefined {
        const platform: string = new CustomUserAgentData(Browser.userAgent, true).getPlatform();
        const isMac: boolean = platform === 'macOS' || platform === 'iOS';
        const merged: EditorKeyBindingMap = extend({}, DEFAULT_EDITOR_KEY_BINDINGS, editor.keyBindings) as EditorKeyBindingMap;
        const rawBinding: string | undefined = merged[action as EditorKeyBindingAction ];
        if (!rawBinding) {
            return undefined;
        }
        return KeyBindingRegistry.normalizeKeyBinding(rawBinding, isMac);
    }

    public static getKeyboardShortcutMap(editor: RichTextEditorUI, ...actions: EditorKeyBindingAction[]): Record<string,
    (event?: KeyboardEvent) => void> {
        const shortcuts: Record<string, (event?: KeyboardEvent) => void> = {};
        const commandNameMap: Partial<Record<EditorKeyBindingAction, string>> = {
            bold: 'bold',
            italic: 'italic',
            underline: 'underline',
            strikethrough: 'strikethrough',
            superscript: 'superscript',
            subscript: 'subscript',
            undo: 'undo',
            redo: 'redo',
            indents: 'indent',
            outdents: 'outdent',
            'ordered-list': 'numberedList',
            'unordered-list': 'bulletList',
            'clear-format': 'clearFormat',
            'code-block': 'codeBlock',
            inlinecode: 'inlineCode',
            uppercase: 'uppercase',
            lowercase: 'lowercase'
        };

        const registerShortcut: (action: EditorKeyBindingAction) => void = (action: EditorKeyBindingAction): void => {
            const normalized: string | undefined = KeyBindingRegistry.getResolvedKeyBinding(editor, action);
            if (!normalized) {
                return;
            }
            const headlessShortcut: string = KeyBindingRegistry.toHeadlessShortcut(normalized);
            const handler: (event?: KeyboardEvent | undefined) => boolean = (event?: KeyboardEvent): boolean => {
                if (!editor.enable || editor.readonly) {
                    return false;
                }
                if (!editor.isSelectionInRTE()) {
                    return false;
                }
                switch (action) {
                case 'link':
                case 'image':
                case 'table':
                    editor.keyboardShortcutAction = action;
                    return true;
                default:
                    const commandName: string | undefined = commandNameMap[action as EditorKeyBindingAction];
                    if (commandName) {
                        const actionArgs: ActionBeginEventArgs = {
                            name: 'actionBegin',
                            action: commandName as EditorCommandName,
                            cancel: false,
                            actionId: '',
                            source: { source: 'keyboard' },
                            isInteracted: true
                        };
                        editor.editorController.process(editor, actionArgs, event);
                    }
                    return true;
                }
            };
            if (shortcuts[headlessShortcut as string] && shortcuts[headlessShortcut as string] !== handler) {
                throw new Error(`Duplicate editor key binding detected for "${action}".`);
            }
            shortcuts[headlessShortcut as string] = handler;
            const normalizedTokens: string[] = normalized.split('+');
            const keyToken: string = normalizedTokens[normalizedTokens.length - 1];
            if (normalizedTokens.indexOf('shift') !== -1 && /^[a-z]$/.test(keyToken)) {
                const uppercaseBinding: string = normalizedTokens.slice(0, -1).concat(keyToken.toUpperCase()).join('+');
                const uppercaseShortcut: string = KeyBindingRegistry.toHeadlessShortcut(uppercaseBinding);
                shortcuts[uppercaseShortcut as string] = handler;
            }
        };

        for (const action of actions) {
            registerShortcut(action);
        }
        return shortcuts;
    }
}
