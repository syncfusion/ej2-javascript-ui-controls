import { createElement } from '@syncfusion/ej2-base';
import { NumericTextBox, NumericTextBoxModel } from '@syncfusion/ej2-inputs';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, RibbonItemType } from '@syncfusion/ej2-ribbon';

import { RIBBON_ID } from '../ribbon-base/ribbon-constants';
import { RibbonGroupBase } from '../ribbon-interfaces';

// Constants for UI element IDs
export const LAYOUT_PARAGRAPH_GROUP: string = '_layout_paragraph_group';
export const INDENT_LEFT_ID: string = '_indent_left';
export const INDENT_RIGHT_ID: string = '_indent_right';
export const SPACING_BEFORE_ID: string = '_spacing_before';
export const SPACING_AFTER_ID: string = '_spacing_after';

/**
 * Layout Paragraph group implementation for simplified mode
 * @private
 */
export class LayoutParagraphGroup extends RibbonGroupBase {
    private indentLeftNumericBox: NumericTextBox;
    private indentRightNumericBox: NumericTextBox;
    private spacingBeforeNumericBox: NumericTextBox;
    private spacingAfterNumericBox: NumericTextBox;
    private templateContainer: HTMLElement;
    public isInitilized: boolean = false;
    private eventHandlers: { [id: string]: { element: HTMLElement; keydownHandler: EventListener; blurHandler: EventListener } } = {};

    /**
     * Constructor for LayoutParagraphGroup class
     *
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
        this.isInitilized = false;
        // Create a hidden container for templates
        this.templateContainer = createElement('div', {
            styles: 'position: absolute; visibility: hidden; height: 0; width: 0; overflow: hidden;'
        });
        document.body.appendChild(this.templateContainer);

        // Create template elements
        this.createIndentLeftTemplate();
        this.createIndentRightTemplate();
        this.createSpacingBeforeTemplate();
        this.createSpacingAfterTemplate();
    }

    /**
     * Get the Ribbon items for Layout Paragraph group
     *
     * @returns {RibbonGroupModel} The ribbon group model
     */
    public getGroupModel(): RibbonGroupModel {
        const id: string = this.container.element.id + RIBBON_ID;
        const leftIndentTemplate: any = () => `
            <div class="e-de-ctnr-layout-ribbon-segment e-de-ctnr-layout-tab"
                title="${this.localObj.getConstant('Indent Left')}">
                <div class="e-de-indent-label-container">
               
                    <span class="e-de-ribbon-property-label">${this.localObj.getConstant('Indent Left')}:</span>
                </div>
                <input id="${this.container.element.id + INDENT_LEFT_ID}" class="e-textbox" />
            </div>`;
        const rightIndentTemplate: any = () => `
            <div class="e-de-ctnr-layout-ribbon-segment e-de-ctnr-layout-tab"
                title="${this.localObj.getConstant('Indent Right')}">
                <div class="e-de-indent-label-container">
              
                    <span class="e-de-ribbon-property-label">${this.localObj.getConstant('Indent Right')}:</span>
                </div>
                <input id="${this.container.element.id + INDENT_RIGHT_ID}" class="e-textbox" />
            </div>
        `;
        const spacingBeforeTemplate: any = () => `
            <div class="e-de-ctnr-layout-ribbon-segment e-de-ctnr-layout-tab"
                title="${this.localObj.getConstant('Spacing Before')}">
                <div class="e-de-property-label-container">
                   
                    <span class="e-de-ribbon-property-label">${this.localObj.getConstant('Spacing Before')}:</span>
                </div>
                <input id="${this.container.element.id + SPACING_BEFORE_ID}" class="e-textbox" />
            </div>
        `;
        const spacingAfterTemplate: any = () => `
            <div class="e-de-ctnr-layout-ribbon-segment e-de-ctnr-layout-tab"
                title="${this.localObj.getConstant('Spacing After')}">
                <div class="e-de-property-label-container">
                    <span class="e-de-icon-spaceafter"></span>
                    <span class="e-de-ribbon-property-label">${this.localObj.getConstant('Spacing After')}:</span>
                </div>
                <input id="${this.container.element.id + SPACING_AFTER_ID}" class="e-textbox" />
            </div>
        `;
        return {
            header: this.localObj.getConstant('Paragraph'),
            showLauncherIcon: true,
            id: id + LAYOUT_PARAGRAPH_GROUP,
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('Paragraph'),
            collections: [
                {
                    items: [
                        {
                            type: RibbonItemType.Template,
                            itemTemplate: leftIndentTemplate,
                            ribbonTooltipSettings: {
                                title: this.localObj.getConstant('Indent Left'),
                                content: this.localObj.getConstant('Set the distance between paragraph and left margin')
                            }
                        },
                        {
                            type: RibbonItemType.Template,
                            itemTemplate: rightIndentTemplate,
                            ribbonTooltipSettings: {
                                title: this.localObj.getConstant('Indent Right'),
                                content: this.localObj.getConstant('Set the distance between paragraph and right margin')
                            }
                        }]
                },
                {
                    items: [
                        {
                            type: RibbonItemType.Template,
                            itemTemplate: spacingBeforeTemplate,
                            ribbonTooltipSettings: {
                                title: this.localObj.getConstant('Spacing Before'),
                                content: this.localObj.getConstant('Set the spacing before the paragraph')
                            }
                        },
                        {
                            type: RibbonItemType.Template,
                            itemTemplate: spacingAfterTemplate,
                            ribbonTooltipSettings: {
                                title: this.localObj.getConstant('Spacing After'),
                                content: this.localObj.getConstant('Set the spacing after the paragraph')
                            }
                        }
                    ]
                }
            ]
        };
    }

    /**
     * Creates indent left input template
     *
     * @returns {void}
     */
    private createIndentLeftTemplate(): void {
        const script: HTMLScriptElement = document.createElement('script');
        script.id = this.container.element.id + RIBBON_ID + '_indent_left';
        script.setAttribute('type', 'text/x-template');

        script.innerHTML = `
            <div class="e-de-ctnr-layout-ribbon-segment e-de-ctnr-layout-tab"
                title="${this.localObj.getConstant('Indent Left')}">
                <div class="e-de-indent-label-container">
               
                    <span class="e-de-ribbon-property-label">${this.localObj.getConstant('Indent Left')}:</span>
                </div>
                <input id="${this.container.element.id + INDENT_LEFT_ID}" class="e-textbox" />
            </div>
        `;

        document.head.appendChild(script);

        // Register numeric textbox for initialization
        this.container.ribbon.numericTextBoxCollection.add(this.container.element.id + INDENT_LEFT_ID, 'simplifiedTab');
    }

    /**
     * Creates indent right input template
     *
     * @returns {void}
     */
    private createIndentRightTemplate(): void {
        const script: HTMLScriptElement = document.createElement('script');
        script.id = this.container.element.id + RIBBON_ID + '_indent_right';
        script.setAttribute('type', 'text/x-template');

        script.innerHTML = `
            <div class="e-de-ctnr-layout-ribbon-segment e-de-ctnr-layout-tab"
                title="${this.localObj.getConstant('Indent Right')}">
                <div class="e-de-indent-label-container">
              
                    <span class="e-de-ribbon-property-label">${this.localObj.getConstant('Indent Right')}:</span>
                </div>
                <input id="${this.container.element.id + INDENT_RIGHT_ID}" class="e-textbox" />
            </div>
        `;

        document.head.appendChild(script);

        // Register numeric textbox for initialization
        this.container.ribbon.numericTextBoxCollection.add(this.container.element.id + INDENT_RIGHT_ID, 'simplifiedTab');
    }

    /**
     * Creates spacing before input template
     *
     * @returns {void}
     */
    private createSpacingBeforeTemplate(): void {
        const script: HTMLScriptElement = document.createElement('script');
        script.id = this.container.element.id + RIBBON_ID + '_spacing_before';
        script.setAttribute('type', 'text/x-template');

        script.innerHTML = `
            <div class="e-de-ctnr-layout-ribbon-segment e-de-ctnr-layout-tab"
                title="${this.localObj.getConstant('Spacing Before')}">
                <div class="e-de-property-label-container">
                   
                    <span class="e-de-ribbon-property-label">${this.localObj.getConstant('Spacing Before')}:</span>
                </div>
                <input id="${this.container.element.id + SPACING_BEFORE_ID}" class="e-textbox" />
            </div>
        `;

        document.head.appendChild(script);

        // Register numeric textbox for initialization
        this.container.ribbon.numericTextBoxCollection.add(this.container.element.id + SPACING_BEFORE_ID, 'simplifiedTab');
    }

    /**
     * Creates spacing after input template
     *
     * @returns {void}
     */
    private createSpacingAfterTemplate(): void {
        const script: HTMLScriptElement = document.createElement('script');
        script.id = this.container.element.id + RIBBON_ID + '_spacing_after';
        script.setAttribute('type', 'text/x-template');


        script.innerHTML = `
            <div class="e-de-ctnr-layout-ribbon-segment e-de-ctnr-layout-tab"
                title="${this.localObj.getConstant('Spacing After')}">
                <div class="e-de-property-label-container">
                    <span class="e-de-icon-spaceafter"></span>
                    <span class="e-de-ribbon-property-label">${this.localObj.getConstant('Spacing After')}:</span>
                </div>
                <input id="${this.container.element.id + SPACING_AFTER_ID}" class="e-textbox" />
            </div>
        `;
        document.head.appendChild(script);

        // Register numeric textbox for initialization
        this.container.ribbon.numericTextBoxCollection.add(this.container.element.id + SPACING_AFTER_ID, 'simplifiedTab');
    }

    /**
     * Initializes the NumericTextBox instances
     *
     * @returns {void}
     */
    public initializeNumericTextBoxes(): void {
        if (this.isInitilized) {
            return;
        }
        this.isInitilized = true;
        this.initializeIndentLeftNumericBox();
        this.initializeIndentRightNumericBox();
        this.initializeSpacingBeforeNumericBox();
        this.initializeSpacingAfterNumericBox();
    }

    /**
     * Resets the initialization state to allow re-initialization after layout changes
     *
     * @returns {void}
     */
    public resetInitializationState(): void {
        this.isInitilized = false;

        // Clean up existing instances if they exist before re-initialization
        if (this.indentLeftNumericBox) {
            this.indentLeftNumericBox.destroy();
            this.indentLeftNumericBox = undefined;
        }

        if (this.indentRightNumericBox) {
            this.indentRightNumericBox.destroy();
            this.indentRightNumericBox = undefined;
        }

        if (this.spacingBeforeNumericBox) {
            this.spacingBeforeNumericBox.destroy();
            this.spacingBeforeNumericBox = undefined;
        }

        if (this.spacingAfterNumericBox) {
            this.spacingAfterNumericBox.destroy();
            this.spacingAfterNumericBox = undefined;
        }
    }

    private initializeIndentLeftNumericBox(): void {
        this.indentLeftNumericBox = this.initializeNumericBox(INDENT_LEFT_ID, {
            format: 'n1',
            value: 0,
            min: -1584,
            max: 1584,
            placeholder: this.localObj.getConstant('Before text'),
            change: this.onIndentLeftChange.bind(this)
        }, this.applyIndentLeft);
    }


    private initializeIndentRightNumericBox(): void {
        this.indentRightNumericBox = this.initializeNumericBox(INDENT_RIGHT_ID, {
            format: 'n1',
            value: 0,
            min: -1584,
            max: 1584,
            change: this.onIndentRightChange.bind(this)
        }, this.applyIndentRight);
    }

    private initializeSpacingBeforeNumericBox(): void {
        this.spacingBeforeNumericBox = this.initializeNumericBox(SPACING_BEFORE_ID, {
            format: 'n1',
            value: 0,
            min: -1,
            max: 1584,
            step: 6,
            showSpinButton: true,
            change: this.onSpacingBeforeChange.bind(this)
        }, this.applySpacingBefore);
    }

    private initializeSpacingAfterNumericBox(): void {
        this.spacingAfterNumericBox = this.initializeNumericBox(SPACING_AFTER_ID, {
            format: 'n1',
            value: 0,
            min: -1,
            max: 1584,
            step: 6,
            showSpinButton: true,
            change: this.onSpacingAfterChange.bind(this)
        }, this.applySpacingAfter);
    }
    private initializeNumericBox(id: string, options: NumericTextBoxModel, applyMethod: Function): NumericTextBox | null {
        const element: HTMLElement = document.getElementById(this.container.element.id + id);
        if (!element) {
            return null;
        }

        const numericBox: NumericTextBox = new NumericTextBox({
            width: '100px',
            cssClass: 'e-de-paragraph-property',
            enablePersistence: false,
            floatLabelType: 'Always',
            ...options
        });
        numericBox.appendTo(element);

        const keydownHandler: EventListener = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                setTimeout(() => {
                    applyMethod.call(this);
                }, 30);
            }
        };
        const blurHandler: EventListener = applyMethod.bind(this);

        // Add event listeners
        element.addEventListener('keydown', keydownHandler);
        element.addEventListener('blur', blurHandler);

        /* eslint-disable */
        this.eventHandlers[id] = {
            element,
            keydownHandler,
            blurHandler
        };

        return numericBox;
    }


    private onIndentLeftChange(): void {
        this.applyIndentLeft();
    }

    private onIndentRightChange(): void {
        this.applyIndentRight();
    }

    private onSpacingBeforeChange(): void {
        this.applySpacingBefore();
    }

    private onSpacingAfterChange(): void {
        this.applySpacingAfter();
    }

    private applyIndentLeft(): void {
        if (!this.indentLeftNumericBox) {
            return;
        }

        const leftIndent: number = this.indentLeftNumericBox.value;
        if (leftIndent !== null) {
            this.container.documentEditor.selection.paragraphFormat.leftIndent = leftIndent;
        }
    }

    private applyIndentRight(): void {
        if (!this.indentRightNumericBox) {
            return;
        }

        const rightIndent: number = this.indentRightNumericBox.value;
        if (rightIndent !== null) {
            this.container.documentEditor.selection.paragraphFormat.rightIndent = rightIndent;
        }
    }

    private applySpacingBefore(): void {
        if (!this.spacingBeforeNumericBox) {
            return;
        }

        const spacingBefore: number = this.spacingBeforeNumericBox.value;
        if (spacingBefore !== null) {
            this.container.documentEditor.selection.paragraphFormat.beforeSpacing = spacingBefore;
        }
    }

    private applySpacingAfter(): void {
        if (!this.spacingAfterNumericBox) {
            return;
        }

        const spacingAfter: number = this.spacingAfterNumericBox.value;
        if (spacingAfter !== null) {
            this.container.documentEditor.selection.paragraphFormat.afterSpacing = spacingAfter;
        }
    }

    /**
     * Updates the paragraph formatting properties in the UI
     *
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        const paragraphFormat: any = this.container.documentEditor.selection.paragraphFormat;

        if (this.indentLeftNumericBox) {
            this.indentLeftNumericBox.value = paragraphFormat.leftIndent;
        }

        if (this.indentRightNumericBox) {
            this.indentRightNumericBox.value = paragraphFormat.rightIndent;
        }

        if (this.spacingBeforeNumericBox) {
            this.spacingBeforeNumericBox.value = paragraphFormat.beforeSpacing;
        }

        if (this.spacingAfterNumericBox) {
            this.spacingAfterNumericBox.value = paragraphFormat.afterSpacing;
        }
    }

    /**
     * Clean up resources when destroyed
     *
     * @returns {void}
     */
    public destroy(): void {
        this.isInitilized = false;

        // Remove event listeners
        const keys: string[] = Object.keys(this.eventHandlers);
        for (const key of keys) {
            /* eslint-disable */
            const handler: any = this.eventHandlers[key];
            if (handler.element) {
                if (handler.keydownHandler) {
                    handler.element.removeEventListener('keydown', handler.keydownHandler);
                }
                if (handler.blurHandler) {
                    handler.element.removeEventListener('blur', handler.blurHandler);
                }
            }
        }

        // Clear event handlers
        this.eventHandlers = {};
        this.resetInitializationState();

        // Remove template elements
        const elementsToRemove: (HTMLElement | null)[] = [
            document.getElementById(this.container.element.id + RIBBON_ID + '_indent_left'),
            document.getElementById(this.container.element.id + RIBBON_ID + '_indent_right'),
            document.getElementById(this.container.element.id + RIBBON_ID + '_spacing_before'),
            document.getElementById(this.container.element.id + RIBBON_ID + '_spacing_after')
        ];

        elementsToRemove.forEach((element: HTMLElement | null) => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        if (this.templateContainer && this.templateContainer.parentNode) {
            this.templateContainer.parentNode.removeChild(this.templateContainer);
            this.templateContainer = undefined;
        }
    }
}
