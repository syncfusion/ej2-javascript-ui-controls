import { Property, NotifyPropertyChanges, INotifyPropertyChanged, Event } from './notify-property-change';
import { Base, EmitType } from './base';
import { KeyboardEventsModel } from './keyboard-model';
/**
 * KeyboardEvents
 */
export interface KeyboardEventArgs extends KeyboardEvent {
    /**
     * action of the KeyboardEvent
     */
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
    'singlequote': 222
};

/**
 * KeyboardEvents class enables you to bind key action desired key combinations for ex., Ctrl+A, Delete, Alt+Space etc.
 * ```html
 * <div id='testEle'>  </div>;
 * <script>
 *   let node: HTMLElement = document.querySelector('#testEle');
 *   let kbInstance = new KeyboardEvents({
 *       element: node,
 *       keyConfigs:{ selectAll : 'ctrl+a' },
 *       keyAction: function (e:KeyboardEvent, action:string) { 
 *           // handler function code
 *       }
 *   });
 * </script>
 * ```   
 */
@NotifyPropertyChanges
export class KeyboardEvents extends Base<HTMLElement> implements INotifyPropertyChanged {

    /**
     * Specifies key combination and it respective action name.
     * @default null
     */
    @Property({})
    public keyConfigs: { [key: string]: string };

    /**
     * Specifies on which event keyboardEvents class should listen for key press. For ex., `keyup`, `keydown` or `keypress`
     * @default keyup
     */
    @Property('keyup')
    public eventName: string;

    /**
     * Specifies the listener when keyboard actions is performed. 
     * @event
     */
    @Event()
    public keyAction: EmitType<KeyboardEventArgs>;

    /**
     * Initializes the KeyboardEvents
     * @param {HTMLElement} element 
     * @param {KeyboardEventsModel} options 
     */
    constructor(element: HTMLElement, options?: KeyboardEventsModel) {
        super(options, element);
        this.bind();
    }

    /**
     * Unwire bound events and destroy the instance.
     * @return {void}
     */
    public destroy(): void {
        this.unwireEvents();
        super.destroy();
    }

    /**
     * Function can be used to specify certain action if a property is changed
     * @param newProp 
     * @param oldProp 
     * @returns {void}
     * @private
     */
    public onPropertyChanged(newProp: KeyboardEventsModel, oldProp?: KeyboardEventsModel): void {
        // No code are needed
    };

    protected bind(): void {
        this.wireEvents();
    }

    /**
     * To get the module name, returns 'keyboard'.
     * @private
     */
    public getModuleName(): string {
        return 'keyboard';
    }

    /**
     * Wiring event handlers to events
     */
    private wireEvents(): void {
        this.element.addEventListener(this.eventName, this.keyPressHandler);
    }

    /**
     * Unwiring event handlers to events
     */

    private unwireEvents(): void {
        this.element.removeEventListener(this.eventName, this.keyPressHandler);
    }

    /**
     * To handle a key press event returns null
     */

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
                    if (this.keyAction) { this.keyAction(e); }
                }
            }
        }
    }

    private static configCache: { [key: string]: KeyData } = {};

    /**
     * To get the key configuration data
     * @param {string} config - configuration data
     * returns {KeyData}
     */

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

    // Return the keycode value as string 
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

