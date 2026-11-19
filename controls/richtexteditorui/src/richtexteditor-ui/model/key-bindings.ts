export type EditorKeyBindingAction =
    | 'toolbar-focus'
    | 'link'
    | 'image'
    | 'audio'
    | 'video'
    | 'table'
    | 'undo'
    | 'redo'
    | 'bold'
    | 'italic'
    | 'underline'
    | 'strikethrough'
    | 'superscript'
    | 'subscript'
    | 'indents'
    | 'outdents'
    | 'clear-format'
    | 'ordered-list'
    | 'unordered-list'
    | 'checklist'
    | 'inlinecode'
    | 'uppercase'
    | 'lowercase'
    | 'code-block';

export type EditorKeyBindingMap = Partial<Record<EditorKeyBindingAction, string>>;

export const DEFAULT_EDITOR_KEY_BINDINGS: EditorKeyBindingMap = {
    'toolbar-focus': 'alt+f10',
    link: 'ctrl+k',
    image: 'ctrl+shift+i',
    table: 'ctrl+shift+e',
    undo: 'ctrl+z',
    redo: 'ctrl+shift+z',
    bold: 'ctrl+b',
    italic: 'ctrl+i',
    underline: 'ctrl+u',
    strikethrough: 'ctrl+shift+s',
    superscript: 'ctrl+shift+=',
    uppercase: 'ctrl+shift+u',
    lowercase: 'ctrl+shift+l',
    subscript: 'ctrl+=',
    indents: 'tab',
    outdents: 'shift+tab',
    'clear-format': 'ctrl+shift+r',
    'ordered-list': 'ctrl+shift+o',
    'unordered-list': 'ctrl+alt+o',
    checklist: 'ctrl+shift+7',
    inlinecode: 'ctrl+e',
    'code-block': 'ctrl+shift+b'
};
