import { RibbonGroupBase, IRibbonGroup } from '../ribbon-interfaces';
import { Ribbon, RibbonGroupModel, RibbonItemSize } from '@syncfusion/ej2-ribbon';
import { BulletsGroup, BULLET_LIST_ID } from './bullets-group';
import { NumberingGroup, NUMBER_LIST_ID } from './numbering-group';
import { LineSpacingGroup, LINE_SPACING_ID } from './line-spacing-group';
import { DocumentEditorContainer } from '../../document-editor-container';
import { SelectionParagraphFormat } from '../../../document-editor/implementation';

// Paragraph group constants
export const PARAGRAPH_GROUP_ID: string = '_paragraph_group';
export const ALIGN_LEFT_ID: string = '_align_left';
export const ALIGN_CENTER_ID: string = '_align_center';
export const ALIGN_RIGHT_ID: string = '_align_right';
export const JUSTIFY_ID: string = '_justify';
export const DECREASE_INDENT_ID: string = '_decrease_indent';
export const INCREASE_INDENT_ID: string = '_increase_indent';
export const SHOW_HIDE_MARKS_ID: string = '_show_hide_marks';
export const BORDERS_ID: string = '_borders';

/**
 * HomeParagraphGroup class for handling paragraph formatting operations in Document Editor ribbon
 * @private
 */
export class HomeParagraphGroup extends RibbonGroupBase implements IRibbonGroup {
    // Child component instances
    private bulletsGroup: BulletsGroup;
    private numberingGroup: NumberingGroup;
    private lineSpacingGroup: LineSpacingGroup;

    /**
     * Constructor for HomeParagraphGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
        // Initialize child components
        this.bulletsGroup = new BulletsGroup(container);
        this.numberingGroup = new NumberingGroup(container);
        this.lineSpacingGroup = new LineSpacingGroup(container);
    }

    /**
     * Get the Ribbon group model for Paragraph formatting
     * @returns {RibbonGroupModel} - Ribbon group model for Paragraph formatting
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        const id: string = this.ribbonId;

        return {
            id: id + PARAGRAPH_GROUP_ID,
            cssClass: 'e-paragraph-group',
            header: this.localObj.getConstant('Paragraph'),
            isCollapsible: false,
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('More Paragraph Options'),
            groupIconCss: 'e-icons e-de-paragraph',
            orientation: 'Row',
            showLauncherIcon: true,
            launcherIconKeyTip: 'PG',
            collections: [{
                id: id + '_paragraph-bullets',
                items: [
                    this.bulletsGroup.getBulletListItem(),
                    this.numberingGroup.getNumberingListItem(),
                    {
                        type: 'Button',
                        keyTip: 'AO',
                        allowedSizes: RibbonItemSize.Small,
                        buttonSettings: {
                            content: this.localObj.getConstant('Increase indent'),
                            iconCss: 'e-icons e-de-ctnr-increaseindent',
                            clicked: () => {
                                this.increaseIndentAction();
                            }
                        },
                        id: id + INCREASE_INDENT_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('Increase indent') }
                    },
                    {
                        type: 'Button',
                        keyTip: 'AI',
                        allowedSizes: RibbonItemSize.Small,
                        buttonSettings: {
                            content: this.localObj.getConstant('Decrease indent'),
                            iconCss: 'e-icons e-de-ctnr-decreaseindent',
                            clicked: () => {
                                this.decreaseIndentAction();
                            }
                        },
                        id: id + DECREASE_INDENT_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('Decrease indent') }
                    },

                    {
                        type: 'Button',
                        keyTip: 'FM',
                        allowedSizes: RibbonItemSize.Small,
                        buttonSettings: {
                            content: this.localObj.getConstant('Show/Hide Marks'),
                            iconCss: 'e-icons e-de-e-paragraph-mark',
                            isToggle: true,
                            clicked: () => {
                                this.toggleHiddenMarks();
                            }
                        },
                        id: id + SHOW_HIDE_MARKS_ID,
                        ribbonTooltipSettings: { content: this.localObj.getConstant('ShowHiddenMarks Tooltip') }
                    }
                ]
            },
            {
                items: [{
                    // type: RibbonItemType.GroupButton,
                    // allowedSizes: RibbonItemSize.Small,
                    // groupButtonSettings: {
                    //     selection: RibbonGroupButtonSelection.Single,
                    //     header: 'Alignment',
                    // items: [{
                    type: 'Button',
                    keyTip: 'AL',
                    allowedSizes: RibbonItemSize.Small,
                    buttonSettings: {
                        content: this.localObj.getConstant('Align left Tooltip'),
                        iconCss: 'e-icons e-de-ctnr-alignleft',
                        isToggle: true,
                        clicked: () => {
                            this.leftAlignmentAction();
                        }
                    },
                    id: id + ALIGN_LEFT_ID,
                    ribbonTooltipSettings: { content: this.localObj.getConstant('Align left Tooltip') }
                },
                {
                    type: 'Button',
                    keyTip: 'AC',
                    allowedSizes: RibbonItemSize.Small,
                    buttonSettings: {
                        content: this.localObj.getConstant('Center Tooltip'),
                        iconCss: 'e-icons e-de-ctnr-aligncenter',
                        isToggle: true,
                        clicked: () => {
                            this.centerAlignmentAction();
                        }
                    },
                    id: id + ALIGN_CENTER_ID,
                    ribbonTooltipSettings: { content: this.localObj.getConstant('Center Tooltip') }
                },
                {
                    type: 'Button',
                    keyTip: 'AR',
                    allowedSizes: RibbonItemSize.Small,
                    buttonSettings: {
                        content: this.localObj.getConstant('Align right Tooltip'),
                        iconCss: 'e-icons e-de-ctnr-alignright',
                        isToggle: true,
                        clicked: () => {
                            this.rightAlignmentAction();
                        }
                    },
                    id: id + ALIGN_RIGHT_ID,
                    ribbonTooltipSettings: { content: this.localObj.getConstant('Align right Tooltip') }
                },
                {
                    type: 'Button',
                    keyTip: 'AJ',
                    allowedSizes: RibbonItemSize.Small,
                    buttonSettings: {
                        content: this.localObj.getConstant('Justify Tooltip'),
                        iconCss: 'e-icons e-de-ctnr-justify',
                        isToggle: true,
                        clicked: () => {
                            this.justifyAction();
                        }
                    },
                    id: id + JUSTIFY_ID,
                    ribbonTooltipSettings: { content: this.localObj.getConstant('Justify Tooltip') }
                    // }]
                    // }
                },
                this.lineSpacingGroup.getLineSpacingItem(),
                {
                    type: 'Button',
                    keyTip: 'B',
                    allowedSizes: RibbonItemSize.Small,
                    buttonSettings: {
                        content: this.localObj.getConstant('Borders'),
                        iconCss: 'e-icons e-de-ctnr-borders',
                        clicked: () => {
                            this.bordersAction();
                        }
                    },
                    id: id + BORDERS_ID,
                    ribbonTooltipSettings: { content: this.localObj.getConstant('Borders') }
                }
                ]
            }]
        };
    }

    /**
     * Update paragraph formatting buttons based on document state
     * @returns {void} - void
     * @private
     */
    public updateSelection(): void {
        // Get the ribbon from container
        const ribbon: Ribbon = this.container.ribbonModule.ribbon;
        if (!ribbon) { return; }

        const id: string = this.ribbonId;

        // Update toggle button states based on current selection
        if (this.documentEditor.selection) {
            const paragraphFormat: SelectionParagraphFormat = this.documentEditor.selection.paragraphFormat;

            // Update text alignment buttons
            this.updateToggleButtonState(id + ALIGN_LEFT_ID, paragraphFormat.textAlignment === 'Left');
            this.updateToggleButtonState(id + ALIGN_CENTER_ID, paragraphFormat.textAlignment === 'Center');
            this.updateToggleButtonState(id + ALIGN_RIGHT_ID, paragraphFormat.textAlignment === 'Right');
            this.updateToggleButtonState(id + JUSTIFY_ID, paragraphFormat.textAlignment === 'Justify');

            // Update show hidden marks button
            this.updateToggleButtonState(id + SHOW_HIDE_MARKS_ID, this.container.documentEditor.documentEditorSettings.showHiddenMarks);

            // Update line spacing
            this.lineSpacingGroup.setLineSpacing();

            // Disable buttons in read-only mode
            if (this.documentEditor.isReadOnly) {
                ribbon.disableItem(id + INCREASE_INDENT_ID);
                ribbon.disableItem(id + DECREASE_INDENT_ID);
                ribbon.disableItem(id + BULLET_LIST_ID);
                ribbon.disableItem(id + NUMBER_LIST_ID);
                ribbon.disableItem(id + BORDERS_ID);
                ribbon.disableItem(id + LINE_SPACING_ID);
            } else {
                ribbon.enableItem(id + INCREASE_INDENT_ID);
                ribbon.enableItem(id + BULLET_LIST_ID);
                ribbon.enableItem(id + NUMBER_LIST_ID);
                ribbon.enableItem(id + BORDERS_ID);
                ribbon.enableItem(id + LINE_SPACING_ID);
            }
        }
    }

    private updateToggleButtonState(buttonId: string, isActive: boolean): void {
        const buttonElement: HTMLElement = document.getElementById(buttonId);
        if (buttonElement) {
            if (isActive) {
                buttonElement.classList.add('e-active');
            } else {
                buttonElement.classList.remove('e-active');
            }
        }
    }

    private leftAlignmentAction(): void {
        if (!this.documentEditor.isReadOnly && this.documentEditor.selection) {
            this.documentEditor.selection.paragraphFormat.textAlignment = 'Left';
        }
    }

    private centerAlignmentAction(): void {
        if (!this.documentEditor.isReadOnly && this.documentEditor.selection) {
            this.documentEditor.selection.paragraphFormat.textAlignment = 'Center';
        }
    }

    private rightAlignmentAction(): void {
        if (!this.documentEditor.isReadOnly && this.documentEditor.selection) {
            this.documentEditor.selection.paragraphFormat.textAlignment = 'Right';
        }
    }

    private justifyAction(): void {
        if (!this.documentEditor.isReadOnly && this.documentEditor.selection) {
            this.documentEditor.selection.paragraphFormat.textAlignment = 'Justify';
        }
    }

    private increaseIndentAction(): void {
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.increaseIndent();
        }
    }

    private decreaseIndentAction(): void {
        if (!this.documentEditor.isReadOnly && this.documentEditor.editor) {
            this.documentEditor.editor.decreaseIndent();
        }
    }

    private toggleHiddenMarks(): void {
        if (this.documentEditor) {
            this.container.documentEditor.documentEditorSettings.showHiddenMarks =
            !this.container.documentEditor.documentEditorSettings.showHiddenMarks;
            setTimeout(() => {
                this.documentEditor.focusIn();
            }, 30);
        }
    }


    private bordersAction(): void {
        if (!this.documentEditor.isReadOnly) {
            this.documentEditor.showDialog('BordersAndShading');
        }
    }

    /**
     * Clean up resources when group is destroyed
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.bulletsGroup) {
            this.bulletsGroup.destroy();
            this.bulletsGroup = null;
        }
        if (this.numberingGroup) {
            this.numberingGroup.destroy();
            this.numberingGroup = null;
        }
        if (this.lineSpacingGroup) {
            this.lineSpacingGroup = null;
        }
    }
}
