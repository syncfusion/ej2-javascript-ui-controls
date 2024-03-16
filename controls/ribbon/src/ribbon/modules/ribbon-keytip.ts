import { Ribbon } from '../base';
import { getGroup, getItem } from '../base/utils';
import { itemProps } from '../base/interface';
import { getIndex} from '../base/index';
import * as constants from '../base/constant';
import { Popup } from '@syncfusion/ej2-popups';
import { getInstance, remove } from '@syncfusion/ej2-base';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';

/**
 * Defines the keytip of Ribbon.
 */
export class RibbonKeyTip {
    private parent: Ribbon;
    private isKeytipPopupOpen: boolean = false;
    private isKeytipPresent: boolean;

    constructor(parent: Ribbon) {
        this.parent = parent;
    }
    protected getModuleName(): string {
        return 'ribbonKeyTip';
    }
    protected destroy(): void {
        this.parent = null;
    }

    /**
     * Creates the keytips.
     *
     * @param {string} key - get's the keytip type.
     * @returns {void}
     * @hidden
     */
    public createKeytip(key?: string): void {
        if (this.parent.keyTipElements) {
            let keytipData: any;
            if (key === 'tab') {
                for (let i: number = 0; i < this.parent.tabs.length; i++) {
                    if (this.parent.keyTipElements[parseInt(i.toString(), 10)]) {
                        // eslint-disable-next-line
                        keytipData = (this.parent.keyTipElements[i] as {[key: string]: object})[key];
                        this.createKeyTipElement((keytipData[0].id), keytipData[0].keyTip, 'tab', 'center', 'bottom', true);
                    }
                }
                if ((this.parent.keyTipElements as {[key: string]: object})['filemenu']) {
                    keytipData = (this.parent.keyTipElements as {[key: string]: object})['filemenu'];
                    this.createKeyTipElement((keytipData[0].id), keytipData[0].keyTip, 'filemenu');
                }
                if ((this.parent.keyTipElements as {[key: string]: object})['backstage']) {
                    keytipData = (this.parent.keyTipElements as {[key: string]: object})['backstage'];
                    this.createKeyTipElement((keytipData[0].id), keytipData[0].keyTip, 'backstage');
                }
                if ((this.parent.keyTipElements as {[key: string]: object})['collapse']) {
                    keytipData = (this.parent.keyTipElements as {[key: string]: object})['collapse'];
                    this.createKeyTipElement((keytipData[0].id), keytipData[0].keyTip, 'collapse');
                }
                if ((this.parent.keyTipElements as {[key: string]: object})['taboverflow']) {
                    keytipData = (this.parent.keyTipElements as {[key: string]: object})['taboverflow'];
                    this.createKeyTipElement((keytipData[0].id), keytipData[0].keyTip, 'taboverflow');
                }
            }
            else if (key === 'popupitem') {
                if ((this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['popupitem']) {
                    const popupKeyTipData: any = (this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['popupitem'];
                    for (let i: number = 0; i < Object.keys((this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['popupitem']).length; i++) {
                        this.createKeyTipElement((popupKeyTipData[parseInt(i.toString(), 10)].id), popupKeyTipData[parseInt(i.toString(), 10)].keyTip, 'popupitem', 'left', 'top', false, true);
                    }
                }
            }
            else if (key === 'backstageMenu') {
                if ((this.parent.keyTipElements as {[key: string]: object})['backstageMenu']) {
                    const backstageKeyTipData: any = (this.parent.keyTipElements as {[key: string]: object})['backstageMenu'];
                    for (let i: number = 0; i < Object.keys((this.parent.keyTipElements as {[key: string]: object})['backstageMenu']).length; i++) {
                        this.createKeyTipElement((backstageKeyTipData[parseInt(i.toString(), 10)].id), backstageKeyTipData[parseInt(i.toString(), 10)].keyTip, 'backstageMenu', 'left', 'center');
                    }
                }
            }
            else if (key === 'grpoverflowpopup' && this.parent.activeLayout === 'Classic') {
                if ((this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['grpoverflowpopup']) {
                    this.calculateItemPosition(key);
                }
                if ((this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['launcher']) {
                    for (let i: number = 0; i < Object.keys((this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['launcher']).length; i++) {
                        keytipData = (this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['launcher'];
                        this.createKeyTipElement((keytipData[parseInt(i.toString(), 10)].id), keytipData[parseInt(i.toString(), 10)].keyTip, 'launcher', 'center', 'bottom', false, true);
                    }
                }
            }
            else {
                this.calculateItemPosition(key);
                if (this.parent.activeLayout === 'Classic') {
                    if ((this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['launcher']) {
                        for (let i: number = 0; i < Object.keys((this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['launcher']).length; i++) {
                            keytipData = (this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['launcher'];
                            this.createKeyTipElement((keytipData[parseInt(i.toString(), 10)].id), keytipData[parseInt(i.toString(), 10)].keyTip, 'launcher');
                        }
                    }
                    if ((this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['grpoverflow']) {
                        for (let i: number = 0; i < Object.keys((this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['grpoverflow']).length; i++) {
                            keytipData = (this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['grpoverflow'];
                            this.createKeyTipElement((keytipData[parseInt(i.toString(), 10)].id), keytipData[parseInt(i.toString(), 10)].keyTip, 'grpoverflow');
                        }
                    }
                }
                if (this.parent.activeLayout === 'Simplified') {
                    if ((this.parent.keyTipElements as {[key: string]: object})['overflowbtn']) {
                        keytipData = (this.parent.keyTipElements as {[key: string]: object})['overflowbtn'];
                        this.createKeyTipElement((keytipData[0].id), keytipData[0].keyTip, 'overflowbtn');
                    }
                    if ((this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['grpofbtn']) {
                        for (let i: number = 0; i < Object.keys((this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['grpofbtn']).length; i++) {
                            keytipData = (this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})['grpofbtn'];
                            this.createKeyTipElement((keytipData[parseInt(i.toString(), 10)].id), keytipData[parseInt(i.toString(), 10)].keyTip, 'grpofbtn');
                        }
                    }
                }
            }
        }
    }

    private calculateItemPosition(key: string, isMethod: boolean = false, keyTip ?: string): void {
        let xOffset: string;
        let yOffset: string;
        let keytipData: any;
         /* eslint-disable */
        keytipData = (this.parent.keyTipElements[parseInt(this.parent.selectedTab.toString(), 10)] as {[key: string]: object})[key];
        if (keytipData) {
            for (let i: number = 0; i < Object.keys((this.parent.keyTipElements[parseInt(this.parent.selectedTab.toString(), 10)] as {[key: string]: object})[key]).length; i++) {
                /* eslint-enable */
                if ((isMethod && (keytipData[parseInt(i.toString(), 10)].keyTip === keyTip)) || !isMethod) {
                    let itemID: string = keytipData[parseInt(i.toString(), 10)].id;
                    if (keytipData[parseInt(i.toString(), 10)].id.includes("_grpbtn")) {
                        itemID = keytipData[parseInt(i.toString(), 10)].id.replace(/_grpbtn\d+/, '');
                    }
                    const itemProp: itemProps = getItem(this.parent.tabs, itemID);
                    if (itemProp && itemProp.group.orientation === 'Column' && itemProp.collection.items.length > 1 && this.parent.activeLayout !== 'Simplified') {
                        if (itemProp.itemIndex === 0) {
                            xOffset = 'center';
                            yOffset = 'top';
                        }
                        else if (itemProp.itemIndex === 1) {
                            xOffset = 'center';
                            yOffset = 'center';
                        }
                        else {
                            xOffset = 'center';
                            yOffset = 'bottom';
                        }
                    }
                    else if (itemProp && itemProp.group.orientation === 'Row' && itemProp.group.collections.length > 1 && this.parent.activeLayout !== 'Simplified') {
                        if (itemProp.collectionIndex === 0) {
                            xOffset = 'center';
                            yOffset = 'top';
                        }
                        else {
                            xOffset = 'center';
                            yOffset = 'bottom';
                        }
                    }
                    key === 'item' ? this.createKeyTipElement((keytipData[parseInt(i.toString(), 10)].id), keytipData[parseInt(i.toString(), 10)].keyTip, key, xOffset, yOffset) : this.createKeyTipElement((keytipData[parseInt(i.toString(), 10)].id), keytipData[parseInt(i.toString(), 10)].keyTip, key, xOffset, yOffset, false, true);
                }
            }
        }
    }

    private createKeyTipElement(id: string, keyTip: string, type: string, xOffset: string = 'center', yOffset: string = 'bottom', isTab: boolean = false, isPopUpItem: boolean = false): void {
        let keyEle: HTMLElement = document.querySelector('#' + id);
        let isPopUpPresent: boolean = false;
        let splitBtnID: string;
        if (isTab) {
            keyEle = document.querySelector('#' + id + constants.HEADER_ID);
        }
        if (keyEle) {
            if (keyEle.closest('.e-ribbon-group-overflow-ddb')) {
                isPopUpPresent = true;
            }
            if ((isTab && isPopUpItem) && keyEle.closest('.e-toolbar-pop')) {
                isPopUpPresent = true;
            }
            if (keyEle.closest('.e-split-btn-wrapper')) {
                let splitBtn: HTMLElement = keyEle.closest('.e-split-btn-wrapper') as HTMLElement;
                splitBtnID = splitBtn.closest('.e-ribbon-item').id;
            }
            else {
                if (keyEle.closest('.e-colorpicker-wrapper')) {
                    keyEle = keyEle.closest('.e-colorpicker-wrapper') as HTMLElement;
                    splitBtnID = keyEle.closest('.e-ribbon-item').id;
                }
            }
        }
        if ((keyEle && keyEle.offsetParent) || (isTab && isPopUpItem)) {
            if ((isPopUpItem && isPopUpPresent) || !isPopUpItem) {
                const keytipElement: HTMLElement = this.parent.createElement('div', {
                    className: constants.RIBBON_KEYTIP,
                    id: id + constants.RIBBON_KEYTIP_ID
                });
                document.body.append(keytipElement);
                const keytipPopup: Popup = new Popup(keytipElement, {
                    relateTo: '#' + (isTab ? id + constants.HEADER_ID : splitBtnID ? splitBtnID : id),
                    content: keyTip,
                    collision: { X: 'fit', Y: 'flip' },
                    targetType: 'relative',
                    position: { X: xOffset, Y: yOffset },
                    enableRtl: this.parent.enableRtl
                });
                keytipPopup.show();
                this.calculateKeyTipPosition(keyEle, keytipElement, type, yOffset, (isTab && isPopUpItem));
                this.parent.isKeytipOpen = true;
            }
        }
    }

    private calculateKeyTipPosition(itemEle: HTMLElement, keytipElement: HTMLElement, type: string, yOffset: string, isTabOverflow: boolean = false): void {
        const position: ClientRect = itemEle.getBoundingClientRect();
        if (type === 'backstageMenu') {
            keytipElement.style.top = position.top + ((keytipElement.offsetHeight) / 2) + 'px';
            keytipElement.style.left = position.left + (itemEle.offsetWidth/5) + 'px';
        }
        else {
            if (type !== 'popupitem') {
                keytipElement.style.left = position.left + (position.width - keytipElement.offsetWidth) / 2 + 'px';
            }
        }
        if (type === 'filemenu' || type === 'backstage') {
            keytipElement.style.top = position.top + ((itemEle.offsetHeight - (itemEle.offsetHeight/3)) + (keytipElement.offsetHeight/6)) + 'px';
        }
        else if ((type === 'item' && yOffset === 'top')) {
            keytipElement.style.top = (position.top - (itemEle.offsetHeight)/2) + 'px';
        }
    }
    /**
     * Performs keytip action.
     *
     * @param {string} keyPress - Gets the keytip text.
     * @returns {void}
     * @hidden
     */
    public keytipPress(keyPress: string, isMethod: boolean = false): void {
        this.isKeytipPresent = false;
        for (let i: number = 0; ((i < Object.keys(this.parent.keyTipElements).length) && !this.isKeytipPresent); i++) {
            if (this.parent.keyTipElements[parseInt(i.toString(), 10)]) {
                for (let j: number = 0; ((j < Object.keys(this.parent.keyTipElements[parseInt(i.toString(), 10)]).length) && !this.isKeytipPresent); j++) {
                    let keytipData: any = (this.parent.keyTipElements[parseInt(i.toString(), 10)] as {[key: string]: object})[Object.keys(this.parent.keyTipElements[parseInt(i.toString(), 10)])[parseInt(j.toString(), 10)]];
                    for (let k: number = 0; ((k < keytipData.length) && !this.isKeytipPresent); k++) {
                        if (keyPress.toUpperCase() === keytipData[parseInt(k.toString(), 10)].keyTip) {
                            const keyTipElement: HTMLElement = document.querySelector('#' + keytipData[parseInt(k.toString(), 10)].id + constants.RIBBON_KEYTIP_ID);
                            if (keyTipElement || isMethod) {
                                this.isKeytipPresent = true;
                                this.removeKeytip();
                                if (keytipData[parseInt(k.toString(), 10)].type === 'tab') {
                                    if (i !== this.parent.selectedTab) {
                                        this.parent.tabObj.select(i);
                                        setTimeout(() => {
                                            const tabOverflow: HTMLElement = this.parent.tabObj.element.querySelector('.e-nav-active');
                                            if (tabOverflow)
                                                tabOverflow.click();
                                            this.createKeytip('item');
                                        }, 600);
                                    } else {
                                        this.createKeytip('item');
                                    }
                                }
                                else {
                                    if (keytipData[parseInt(k.toString(), 10)].type === 'item' || keytipData[parseInt(k.toString(), 10)].type === 'grpoverflowpopup' || keytipData[parseInt(k.toString(), 10)].type === 'popupitem') {
                                        if (document.getElementById(keytipData[parseInt(k.toString(), 10)].id) && document.getElementById(keytipData[parseInt(k.toString(), 10)].id).classList.contains('e-ribbon-group-button')) {
                                            (document.getElementById(keytipData[parseInt(k.toString(), 10)].id) as HTMLElement).click();
                                        }
                                        else {
                                            let itemProp: itemProps;
                                            if ((keytipData[parseInt(k.toString(), 10)].id).includes("_popupButton")) {
                                                const galleryID: string = keytipData[parseInt(k.toString(), 10)].id.replace(/_popupButton/g, '');
                                                itemProp = getItem(this.parent.tabs, galleryID);
                                            }
                                            else {
                                                itemProp = getItem(this.parent.tabs, keytipData[parseInt(k.toString(), 10)].id);
                                            }
                                            if (!isMethod || (isMethod && itemProp.tabIndex === this.parent.selectedTab)) {
                                                this.clickItems(itemProp, keytipData, k, false, isMethod);
                                            }
                                        }
                                    }
                                    else if (keytipData[parseInt(k.toString(), 10)].type === 'grpoverflow' || keytipData[parseInt(k.toString(), 10)].type === 'grpofbtn' || keytipData[parseInt(k.toString(), 10)].type === 'launcher') {
                                        const keyEle: HTMLElement = document.querySelector('#' + keytipData[parseInt(k.toString(), 10)].id);
                                        this.removeKeytip();
                                        if (keyEle) {
                                            let groupID: string = keytipData[parseInt(k.toString(), 10)].id;
                                            if (isMethod) {
                                                if (keytipData[parseInt(k.toString(), 10)].id.includes("_launcher") || keytipData[parseInt(k.toString(), 10)].id.includes("_sim_grp_overflow") || keytipData[parseInt(k.toString(), 10)].id.includes("_overflow_dropdown")) {
                                                    groupID = keytipData[parseInt(k.toString(), 10)].id.replace(/_launcher|_sim_grp_overflow|_overflow_dropdown/g, '');
                                                    const itemProp: itemProps = getGroup(this.parent.tabs, groupID);
                                                    if (itemProp.tabIndex === this.parent.selectedTab) {
                                                        this.clickItems(itemProp, keytipData, k, true, isMethod, keyEle);
                                                    }
                                                }
                                            }
                                            else {
                                                this.clickItems(null, keytipData, k, true, isMethod, keyEle);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                if (this.parent.keyTipElements) {
                    this.commonItemsKeyTipPress(keyPress, Object.keys(this.parent.keyTipElements)[parseInt(i.toString(), 10)], isMethod);
                }
            }
        }
    }

    private clickItems(itemProp: itemProps, keytipData: any, k: number, isGroupItems: boolean, isMethod: boolean, keyEle?: HTMLElement): void {
        if (isGroupItems) {
            keyEle.click();
            if (!(keytipData[parseInt(k.toString(), 10)].type === 'launcher')) {
                this.isKeytipPopupOpen = true;
                keytipData[parseInt(k.toString(), 10)].type === 'grpoverflow' ? this.createKeytip('grpoverflowpopup') : this.createKeytip('popupitem');
            }
        }
        else {
            let itemID: string = keytipData[parseInt(k.toString(), 10)].id;
            if (document.querySelector('#' + itemID) && isMethod) {
                if (this.parent.activeLayout === 'Simplified') {
                    if (document.querySelector('#' + itemID).closest('#' + itemProp.group.id + '_sim_grp_overflow-popup') && document.querySelector('#' + itemID).closest('#' + itemProp.group.id + '_sim_grp_overflow-popup').classList.contains('e-popup-close')) {
                        (document.querySelector('#' + itemProp.group.id + '_sim_grp_overflow') as HTMLElement).click();
                    }
                    else if (document.querySelector('#' + itemID).closest('#' + this.parent.tabObj.element.id + constants.OVRLOF_BUTTON_ID + '-popup') && document.querySelector('#' + itemID).closest('#' + this.parent.tabObj.element.id + constants.OVRLOF_BUTTON_ID + '-popup').classList.contains('e-popup-close')) {
                        (document.querySelector('#' + this.parent.tabObj.element.id + constants.OVRLOF_BUTTON_ID) as HTMLElement).click();
                    }
                }
                else {
                    if (document.querySelector('#' + itemID).closest('#' + itemProp.group.id + constants.OVERFLOW_ID + constants.DROPDOWN_ID + '-popup') && document.querySelector('#' + itemID).closest('#' + itemProp.group.id + constants.OVERFLOW_ID + constants.DROPDOWN_ID + '-popup').classList.contains('e-popup-close')) {
                        (document.querySelector('#' + itemProp.group.id + constants.OVERFLOW_ID + constants.DROPDOWN_ID) as HTMLElement).click();
                    }
                }
            }
            const itemType: string = this.parent.getItemModuleName(itemProp.item);
            switch (itemType) {
            case 'btn':
                this.parent.ribbonButtonModule.click(itemID);
                break;
            case 'dropdown-btn':
                this.parent.ribbonDropDownModule.toggle(itemID);
                break;
            case 'split-btn':
                this.parent.ribbonSplitButtonModule.toggle(itemID);
                break;
            case 'checkbox':
                this.parent.ribbonCheckBoxModule.click(itemID);
                break;
            case 'colorpicker':
                this.parent.ribbonColorPickerModule.toggle(itemID);
                break;
            case 'combobox':
                const itemEle: HTMLElement = document.querySelector('#' + itemID);
                setTimeout(() => {
                    itemEle.focus();
                }, 100);
                break;
            case 'gallery':
                const galleryEle: HTMLElement = document.querySelector('#' + itemID);
                galleryEle.click();
                break;
            case 'template':
                const templateEle: HTMLElement = document.querySelector('#' + itemID);
                templateEle.focus();
                break;
            case 'group-btn':
                const itemElement: HTMLElement = document.querySelector('#' + itemID);
                if (itemElement) {
                    const item: DropDownButton = getInstance(itemElement, DropDownButton) as DropDownButton;
                    item.toggle();
                    for (let i: number = 0; i < itemProp.item.groupButtonSettings.items.length; i++) {
                        if (itemProp.item.groupButtonSettings.items[parseInt(i.toString(), 10)].keyTip) {
                            this.createKeyTipElement(itemID + (constants.RIBBON_GROUP_BUTTON_ID + i), itemProp.item.groupButtonSettings.items[parseInt(i.toString(), 10)].keyTip, 'item');
                        }
                    }
                }
                break;
            }
        }
    }

    private commonItemsKeyTipPress(keyPress: string, key: string, isMethod: boolean): void {
        /* eslint-disable */
        if ((this.parent.keyTipElements as {[key: string]: object})[key]) {
            let isKeyPressed: boolean = false;
            let keytipData: any = (this.parent.keyTipElements as {[key: string]: object})[key];
            let keyEle: HTMLElement;
            let keytipElement: HTMLElement;
            if (keytipData) {
                if (key === 'backstageMenu') {
                    for (let i: number = 0; i < Object.keys((this.parent.keyTipElements as {[key: string]: object})[key]).length; i++){
                        /* eslint-enable */
                        if (keytipData[parseInt(i.toString(), 10)].keyTip === keyPress.toUpperCase()) {
                            keyEle = document.querySelector('#' + keytipData[parseInt(i.toString(), 10)].id);
                            keytipElement = document.querySelector('#' + keyEle.id + constants.RIBBON_KEYTIP_ID) as HTMLElement;
                            if (keytipElement || isMethod) {
                                isKeyPressed = true;
                                if (isMethod && document.querySelector('.e-ribbon-backstage-popup').classList.contains('e-popup-close')) {
                                    (this.parent.tabObj.element.querySelector('.e-ribbon-backstage') as HTMLElement).click();
                                }
                                break;
                            }
                        }
                    }
                }
                else {
                    if (keytipData[0] && keytipData[0].keyTip === keyPress.toUpperCase()) {
                        keyEle = document.querySelector('#' + keytipData[0].id);
                        keytipElement = document.querySelector('#' + keytipData[0].id + constants.RIBBON_KEYTIP_ID) as HTMLElement;
                        if (keytipElement || isMethod) {
                            isKeyPressed = true;
                        }
                    }
                }
            }
            if (isKeyPressed) {
                this.removeKeytip();
                this.isKeytipPresent = true;
                if (keyEle) {
                    keyEle.click();
                    if (key === 'backstage') {
                        this.createKeytip('backstageMenu');
                    }
                    else if (key === 'overflowbtn') {
                        this.isKeytipPopupOpen = true;
                        this.createKeytip('popupitem');
                    }
                    else if (key === 'taboverflow') {
                        setTimeout(() => {
                            for (let i: number = 0; i < Object.keys(this.parent.keyTipElements).length; i++) {
                                if (this.parent.keyTipElements[parseInt(i.toString(), 10)]) {
                                    let keytipData: any = (this.parent.keyTipElements[parseInt(i.toString(), 10)] as {[key: string]: object})['tab'];
                                    this.createKeyTipElement((keytipData[0].id), keytipData[0].keyTip, 'tab', 'center', 'bottom', true, true);
                                }
                            }
                        }, 600);
                    }
                }
            }
        }
    }

    /**
     * Removes the keytip.
     *
     * @param {string} key - Gets the keyboard key element.
     * @returns {void}
     * @hidden
     */
    public removeKeytip(key ?: string): void {
        const keyTipItems: NodeListOf<Element> = document.querySelectorAll('.e-ribbon-keytip');
        let isKeyTipExist: boolean = false;
        this.parent.keysPress = '';
        for (let i: number = 0; i < keyTipItems.length; i++) {
            const keyTipItem: HTMLElement = keyTipItems[parseInt(i.toString(), 10)] as HTMLElement;
            if (key === 'Escape' && this.parent.keyTipElements && this.parent.keyTipElements[this.parent.selectedTab]) {
                /* eslint-disable */
                for (let j: number = 0; j < Object.keys(this.parent.keyTipElements[this.parent.selectedTab]).length; j++) {
                    let keyText: string = (Object.keys(this.parent.keyTipElements[this.parent.selectedTab]))[j];
                    if ((this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})[keyText]) {
                        const index: number = getIndex((this.parent.keyTipElements[this.parent.selectedTab] as {[key: string]: object})[keyText] as object[], (e: object) => { return (e as any).id + constants.RIBBON_KEYTIP_ID === keyTipItems[parseInt(i.toString(), 10)].id; });
                        /* eslint-enable */
                        if (index !== -1) {
                            if ((keyText === 'item' && !(this.isKeytipPopupOpen)) || (keyText === 'grpoverflow' && this.parent.activeLayout === 'Classic')) {
                                this.createKeytip('tab');
                                key = '';
                                isKeyTipExist = true;
                                break;
                            }
                            else if (this.isKeytipPopupOpen) {
                                if ((keyText === 'popupitem' && this.parent.activeLayout === 'Simplified') || (keyText === 'grpoverflowpopup' && this.parent.activeLayout === 'Classic')) {
                                    this.createKeytip('item');
                                    key = '';
                                    isKeyTipExist = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                for (let n: number = 0; n < Object.keys(this.parent.keyTipElements).length; n++) {
                    if (this.parent.keyTipElements[parseInt(n.toString(), 10)]) {
                        let keytipData: any = (this.parent.keyTipElements[parseInt(n.toString(), 10)] as {[key: string]: object})['tab'];
                        for (let j: number = 0; j < keytipData.length; j++) {
                            if (keyTipItem.id === keytipData[0].id + constants.RIBBON_KEYTIP_ID) {
                                if (document.querySelector('#' + keytipData[0].id + constants.HEADER_ID).closest('.e-toolbar-pop')) {
                                    const tabOverflow: HTMLElement = this.parent.tabObj.element.querySelector('.e-nav-active');
                                    tabOverflow.click();
                                    setTimeout(() => {
                                        this.createKeytip('tab');
                                    }, 600);
                                    key = '';
                                    isKeyTipExist = true;
                                    break;
                                }
                            }
                        }
                        if (isKeyTipExist) {
                            break;
                        }
                    }
                }
                if (!isKeyTipExist && (this.parent.keyTipElements as {[key: string]: object})['backstageMenu']) {
                    const index: number = getIndex((this.parent.keyTipElements as {[key: string]: object})['backstageMenu'] as object[], (e: object) => { return (e as any).id + constants.RIBBON_KEYTIP_ID === keyTipItems[parseInt(i.toString(), 10)].id; });
                    if (index !== -1) {
                        this.createKeytip('tab');
                        key = '';
                        isKeyTipExist = true;
                    }
                }
            }
            if (keyTipItem) {
                remove(keyTipItem);
            }
        }
        this.isKeytipPopupOpen = false;
        if (!isKeyTipExist)
            this.parent.isKeytipOpen = false;
    }

    /**
     * Shows the Keytip dynamically.
     *
     * @param  {string} keyAction - Item for which the tooltip is to be shown.
     * @returns {void}
     */
    public showKeyTips(keyAction?: string): void {
        if (this.parent.enableKeyTips) {
            if (keyAction) {
                this.keytipPress(keyAction, true);
            }
            else {
                this.createKeytip('tab');
            }
        }
    }

    /**
     * Hides the Keytip dynamically.
     *
     * @returns {void}
     */
    public hideKeyTips(): void {
        this.removeKeytip();
    }
}
