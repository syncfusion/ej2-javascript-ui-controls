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