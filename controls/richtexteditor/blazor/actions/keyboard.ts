import { EmitType, extend } from '@syncfusion/ej2-base';
import { KeyboardEventsModel } from '@syncfusion/ej2-base';

export interface KeyboardEventArgs extends KeyboardEvent {
    action: string;
}

let keyCode: { [key: string]: number } = {
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
    '=': 187
};

/**
 * Keyboard
 */
export class KeyboardEvents {
    public eventName: string;
    public element: HTMLElement;
    public keyConfigs: { [key: string]: string };
    public keyAction: EmitType<KeyboardEventArgs>;
    private static configCache: { [key: string]: KeyData } = {};

    constructor(element: HTMLElement, options?: KeyboardEventsModel) {
        this.element = element;
        extend(this, this, options);
        this.bind();
    }
    public destroy(): void {
        this.unwireEvents();
    }

    protected bind(): void {
        this.wireEvents();
    }

    private wireEvents(): void {
        this.element.addEventListener(this.eventName, this.keyPressHandler);
    }

    private unwireEvents(): void {
        this.element.removeEventListener(this.eventName, this.keyPressHandler);
    }

    private keyPressHandler: EventListener = (e: KeyboardEventArgs): void => {
        let isAltKey: Boolean = e.altKey;
        let isCtrlKey: Boolean = e.ctrlKey;
        let isShiftKey: Boolean = e.shiftKey;
        let curkeyCode: number = e.which;
        let keys: string[] = Object.keys(this.keyConfigs);
        for (let key of keys) {
            let configCollection: string[] = this.keyConfigs[key].split(',');
            for (let rconfig of configCollection) {
                let rKeyObj: KeyData = KeyboardEvents.getKeyConfigData(rconfig.trim());
                if (isAltKey === rKeyObj.altKey && isCtrlKey === rKeyObj.ctrlKey &&
                    isShiftKey === rKeyObj.shiftKey && curkeyCode === rKeyObj.keyCode) {
                    e.action = key;
                }
            }
        }
        if (this.keyAction) { this.keyAction(e); }
    }

    private static getKeyConfigData(config: string): KeyData {
        if (config in this.configCache) { return this.configCache[config]; }
        let keys: string[] = config.toLowerCase().split('+');
        let keyData: KeyData = {
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
        KeyboardEvents.configCache[config] = keyData;
        return keyData;
    }

    private static getKeyCode(keyVal: string): number {
        return keyCode[keyVal] || keyVal.toUpperCase().charCodeAt(0);
    }
}

interface KeyData {
    altKey: Boolean;
    ctrlKey: Boolean;
    shiftKey: Boolean;
    keyCode: number | string;
}
