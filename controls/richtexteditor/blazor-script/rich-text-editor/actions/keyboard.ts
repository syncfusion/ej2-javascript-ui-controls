import { EmitType, extend } from '../../../base'; /*externalscript*/
import { KeyboardEventsModel } from '../../../base'; /*externalscript*/

export interface KeyboardEventArgs extends KeyboardEvent {
    action: string;
}

const keyCode: { [key: string]: number } = {
    'backspace': 8,
    'tab': 9,
    'enter': 13,
    'shift': 16,
    'control': 17,
    'alt': 18,
    'pause': 19,
    'capslock': 20,
    'space': 32,
    'escape': 27,
    'pageup': 33,
    'pagedown': 34,
    'end': 35,
    'home': 36,
    'leftarrow': 37,
    'uparrow': 38,
    'rightarrow': 39,
    'downarrow': 40,
    'insert': 45,
    'delete': 46,
    'f1': 112,
    'f2': 113,
    'f3': 114,
    'f4': 115,
    'f5': 116,
    'f6': 117,
    'f7': 118,
    'f8': 119,
    'f9': 120,
    'f10': 121,
    'f11': 122,
    'f12': 123,
    'semicolon': 186,
    'plus': 187,
    'comma': 188,
    'minus': 189,
    'dot': 190,
    'forwardslash': 191,
    'graveaccent': 192,
    'openbracket': 219,
    'backslash': 220,
    'closebracket': 221,
    'singlequote': 222,
    ']': 221,
    '[': 219,
    '=': 187,
    '<': 188,
    '>': 190
};

/**
 * Keyboard Events Handler.
 * @param {HTMLElement} element - The HTML element to which keyboard events are bound.
 * @param {KeyboardEventsModel} [options] - Optional configuration options for keyboard events.
 */
export class KeyboardEvents {
    public eventName: string;
    public element: HTMLElement;
    public keyConfigs: { [key: string]: string };
    public keyAction: EmitType<KeyboardEventArgs>;
    private static configCache: { [key: string]: KeyData } = {};
    private onKeyPressHandler: EventListenerOrEventListenerObject;

    constructor(element: HTMLElement, options?: KeyboardEventsModel) {
        this.element = element;
        extend(this, this, options);
        this.onKeyPressHandler = this.keyPressHandler.bind(this);
        this.bind();
    }
    /**
     * Destroys the instance of KeyboardEvents and detaches all bound event listeners.
     * @returns {void}
     */
    public destroy(): void {
        this.unWireEvents();
    }

    protected bind(): void {
        this.wireEvents();
    }

    private wireEvents(): void {
        this.element.addEventListener(this.eventName, this.onKeyPressHandler);
    }

    private unWireEvents(): void {
        this.element.removeEventListener(this.eventName, this.onKeyPressHandler);
    }
    /**
     * Handles the key press event and triggers corresponding actions based on configured key combinations.
     * @param {KeyboardEventArgs} e - The keyboard event object.
     * @returns {void}
     */
    private keyPressHandler: EventListener = (e: KeyboardEventArgs): void => {
        const isAltKey: Boolean = e.altKey;
        const isCtrlKey: Boolean = e.ctrlKey;
        const isShiftKey: Boolean = e.shiftKey;
        const isMetaKey: Boolean = e.metaKey;
        const curkeyCode: number = e.which;
        const keys: string[] = Object.keys(this.keyConfigs);
        for (const key of keys) {
            const configCollection: string[] = this.keyConfigs[key as string].split(',');
            for (const rconfig of configCollection) {
                const rKeyObj: KeyData = KeyboardEvents.getKeyConfigData(rconfig.trim());
                if (isAltKey === rKeyObj.altKey && (isCtrlKey === rKeyObj.ctrlKey || isMetaKey) &&
                    isShiftKey === rKeyObj.shiftKey && curkeyCode === rKeyObj.keyCode) {
                    e.action = key;
                }
            }
        }
        if (this.keyAction) { this.keyAction(e); }
    }

    private static getKeyConfigData(config: string): KeyData {
        if (config in this.configCache) { return this.configCache[config as string]; }
        const keys: string[] = config.toLowerCase().split('+');
        const keyData: KeyData = {
            altKey: (keys.indexOf('alt') !== -1 ? true : false),
            ctrlKey: (keys.indexOf('ctrl') !== -1 ? true : false),
            shiftKey: (keys.indexOf('shift') !== -1 ? true : false),
            keyCode: null
        };
        if (keys[keys.length - 1].length > 1 && !!Number(keys[keys.length - 1])) {
            keyData.keyCode = Number(keys[keys.length - 1]);

        } else {
            keyData.keyCode = KeyboardEvents.getKeyCode(keys[keys.length - 1]);
        }
        KeyboardEvents.configCache[config as string] = keyData;
        return keyData;
    }

    private static getKeyCode(keyVal: string): number {
        return keyCode[keyVal as string] || keyVal.toUpperCase().charCodeAt(0);
    }
}

interface KeyData {
    altKey: Boolean;
    ctrlKey: Boolean;
    shiftKey: Boolean;
    keyCode: number | string;
}
