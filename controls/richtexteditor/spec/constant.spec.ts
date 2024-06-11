export const ARROWRIGHT_EVENT_INIT: EventInit = {
    bubbles: true,
    key: "ArrowRight",
    keyCode: 39,
    which: 39,
    code: "ArrowRight",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;

export const TOOLBAR_FOCUS_SHORTCUT_EVENT_INIT = new KeyboardEvent('keydown', {
    key: "F10",
    keyCode: 121,
    which: 121,
    code: "F10",
    location: 0,
    altKey: true,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false
} as EventInit);

export const ENTERKEY_EVENT_INIT: KeyboardEventInit = {
    key: "Enter",
    keyCode: 13,
    which: 13,
    code: "Enter",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false
} as EventInit;

export const BACKSPACE_EVENT_INIT: KeyboardEventInit = {
    key: "Backspace",
    keyCode: 8,
    which: 8,
    code: "Backspace",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;

export const SPACE_EVENT_INIT: KeyboardEventInit = {
    key: " ",
    keyCode: 32,
    which: 32,
    code: "Space",
    location: 0,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    repeat: false,
} as EventInit;
