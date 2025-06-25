import { DocumentEditorContainer } from '../../document-editor-container';
import { DocumentEditor } from '../../../document-editor/document-editor';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';
import { createElement, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { ItemModel } from '@syncfusion/ej2-splitbuttons';
import { RibbonItemModel, RibbonSplitButtonSettingsModel, RibbonItemSize } from '@syncfusion/ej2-ribbon';
import { ParagraphWidget } from '../../../document-editor/implementation/viewer/page';
import { BulletListHelper } from '../../helper/bullet-list-helper';
import { ElementsMap } from '../../helper/ribbon-interfaces';

// Bullet list constants
export const BULLET_LIST_ID: string = '_bullet_list';

/**
 * BulletsGroup class for handling bullet list operations in Document Editor ribbon
 * @private
 */
export class BulletsGroup {
    // Track the last applied bullet style
    private appliedBulletStyle: string = 'dot';
    private container: DocumentEditorContainer;
    private ribbonId: string;
    private localObj: L10n;
    private eventHandlers: { [key: string]: { element: HTMLElement, handler: (e: MouseEvent) => void } } = {};


    // HTML Elements for bullet options
    private bulletElements: ElementsMap = {};

    /**
     * Constructor for BulletsGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.ribbonId = this.container.element.id + RIBBON_ID;
        this.localObj = this.container.localObj;
    }

    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    /**
     * Get the bullet list split button item configuration
     * @returns {RibbonItemModel} The ribbon item model for bullet list
     * @private
     */
    public getBulletListItem(): RibbonItemModel {
        const id: string = this.ribbonId;

        return {
            type: 'SplitButton',
            allowedSizes: RibbonItemSize.Small,
            keyTip: 'U',
            splitButtonSettings: this.createBulletSplitButton(),
            id: id + BULLET_LIST_ID,
            ribbonTooltipSettings: { content: this.localObj.getConstant('Bullets') }
        };
    }

    /**
     * Create bullet dropdown in ribbon
     * @returns {RibbonSplitButtonSettingsModel} SplitButtonModel configuration
     * @private
     */
    private createBulletSplitButton(): RibbonSplitButtonSettingsModel {
        let bulletIconCss: string = 'e-de-ctnr-bullets e-icons';
        if (this.container.enableRtl) {
            bulletIconCss += ' e-de-flip';
        }

        // Create the HTML template for bullets dropdown
        const bulletDropDiv: HTMLElement = createElement('div', {
            id: this.ribbonId + '_bullet_list_div',
            styles: 'width: 196px;height: auto;visibility: hidden'
        });

        const bulletDropUlTag: HTMLElement = createElement('ul', {
            styles: 'visibility: visible; outline: 0px;',
            id: this.ribbonId + '_listMenu',
            className: 'e-de-floating-menu e-de-bullets-menu e-de-list-container e-de-list-thumbnail'
        });

        bulletDropDiv.appendChild(bulletDropUlTag);

        // Create bullet list options using a more efficient approach
        this.createBulletElements(bulletDropUlTag);

        return {
            target: bulletDropDiv,
            iconCss: bulletIconCss,
            content: this.localObj.getConstant('Bullets'),
            items: this.getBulletItems(),
            select: this.handleBulletSelection.bind(this),
            beforeOpen: (): void => {
                bulletDropDiv.style.visibility = 'visible';
                if (!isNullOrUndefined(this.documentEditor.selectionModule)) {
                    if (isNullOrUndefined(this.documentEditor.selectionModule.paragraphFormat.listId) ||
                        this.documentEditor.selectionModule.paragraphFormat.listId === -1) {
                        // No current list format
                        this.updateSelectedBulletListType(this.documentEditor.selectionModule.paragraphFormat.listText);
                    } else {
                        // Get current bullet list format
                        const startParagraph: ParagraphWidget = this.documentEditor.selectionModule.isForward ?
                            this.documentEditor.selectionModule.start.paragraph : this.documentEditor.selectionModule.end.paragraph;
                        this.updateSelectedBulletListType(startParagraph.paragraphFormat.listFormat.listLevel.numberFormat);
                    }
                }
            },
            beforeClose: (): void => {
                bulletDropDiv.style.visibility = 'hidden';
                this.removeSelectedList();
            },
            click: () => {
                this.applyLastAppliedBullet();
            }
        };
    }

    private createBulletElements(ulTag: HTMLElement): void {
        // Define bullet types with their properties
        const bulletTypes: any[] = [
            { key: 'none', cssClass: 'e-de-ctnr-bullet-none e-icons e-de-ctnr-list', isNone: true, handler: this.bulletNoneClick.bind(this) },
            { key: 'dot', cssClass: 'e-de-ctnr-bullet-dot e-icons e-de-ctnr-list', isNone: false, handler: this.bulletDotClick.bind(this) },
            { key: 'circle', cssClass: 'e-de-ctnr-bullet-circle e-icons e-de-ctnr-list', isNone: false, handler: this.bulletCircleClick.bind(this) },
            { key: 'square', cssClass: 'e-de-ctnr-bullet-square e-icons e-de-ctnr-list', isNone: false, handler: this.bulletSquareClick.bind(this) },
            { key: 'flower', cssClass: 'e-de-ctnr-bullet-flower e-icons e-de-ctnr-list', isNone: false, handler: this.bulletFlowerClick.bind(this) },
            { key: 'arrow', cssClass: 'e-de-ctnr-bullet-arrow e-icons e-de-ctnr-list', isNone: false, handler: this.bulletArrowClick.bind(this) },
            { key: 'tick', cssClass: 'e-de-ctnr-bullet-tick e-icons e-de-ctnr-list', isNone: false, handler: this.bulletTickClick.bind(this) }
        ];

        // Create all elements and store them
        bulletTypes.forEach((type: any) => {
            const element: HTMLElement = this.createBulletListTag(ulTag, type.cssClass, type.isNone);
            element.addEventListener('click', type.handler);
            this.bulletElements[type.key] = element;
            this.eventHandlers[type.key] = { element, handler: type.handler };
        });
    }

    private getBulletItems(): ItemModel[] {
        return [
            { id: this.ribbonId + '_bullet-none', text: this.localObj.getConstant('None') },
            { id: this.ribbonId + '_bullet-dot', text: this.localObj.getConstant('Dot') },
            { id: this.ribbonId + '_bullet-circle', text: this.localObj.getConstant('Circle') },
            { id: this.ribbonId + '_bullet-square', text: this.localObj.getConstant('Square') },
            { id: this.ribbonId + '_bullet-flower', text: this.localObj.getConstant('Flower') },
            { id: this.ribbonId + '_bullet-arrow', text: this.localObj.getConstant('Arrow') },
            { id: this.ribbonId + '_bullet-tick', text: this.localObj.getConstant('Tick') }
        ];
    }

    private createBulletListTag(ulTag: HTMLElement, iconCss: string, isNone: boolean): HTMLElement {
        return BulletListHelper.createBulletListTag(ulTag, iconCss, isNone, this.localObj);
    }


    private updateSelectedBulletListType(listText: string): void {
        BulletListHelper.updateSelectedBulletListType(listText, this.bulletElements);
    }

    private removeSelectedList(): void {
        BulletListHelper.removeSelectedList(this.bulletElements);
    }

    /**
     * Apply the last used bullet style
     * @returns {void}
     * @private
     */
    public applyLastAppliedBullet(): void {
        this.applyBulletStyle(this.appliedBulletStyle);
    }

    /**
     * Handle bullet style selection from dropdown
     * @param {any} args - The event arguments
     * @returns {void}
     * @private
     */
    public handleBulletSelection(args: any): void {
        const styleMap: { [key: string]: string } = {};
        styleMap[this.localObj.getConstant('None')] = 'none';
        styleMap[this.localObj.getConstant('Dot')] = 'dot';
        styleMap[this.localObj.getConstant('Circle')] = 'circle';
        styleMap[this.localObj.getConstant('Square')] = 'square';
        styleMap[this.localObj.getConstant('Flower')] = 'flower';
        styleMap[this.localObj.getConstant('Arrow')] = 'arrow';
        styleMap[this.localObj.getConstant('Tick')] = 'tick';

        const style: string = styleMap[args.item.text];
        if (style) {
            this.applyBulletStyle(style);
        }
    }


    private applyBulletStyle(style: string): void {
        const appliedStyle: any = { value: this.appliedBulletStyle };
        BulletListHelper.applyBulletStyle(this.documentEditor, style, appliedStyle);
        this.appliedBulletStyle = appliedStyle.value;
    }


    private bulletNoneClick(): void {
        BulletListHelper.clearList(this.documentEditor);
    }


    private bulletDotClick(): void {
        this.applyBulletStyle('dot');
    }

    private bulletCircleClick(): void {
        this.applyBulletStyle('circle');
    }

    private bulletSquareClick(): void {
        this.applyBulletStyle('square');
    }

    private bulletFlowerClick(): void {
        this.applyBulletStyle('flower');
    }

    private bulletArrowClick(): void {
        this.applyBulletStyle('arrow');
    }

    private bulletTickClick(): void {
        this.applyBulletStyle('tick');
    }
    public destroy(): void {
        // Remove event listeners
        const keys: any = Object.keys(this.eventHandlers);
        for (const key of keys) {
            /* eslint-disable */
            const item: any = this.eventHandlers[key];
            if (item.element && item.handler) {
                item.element.removeEventListener('click', item.handler);
            }
        }

        // Clear references
        this.eventHandlers = {};
        this.bulletElements = {};
    }
}
