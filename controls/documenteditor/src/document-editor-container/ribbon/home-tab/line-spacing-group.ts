import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';
import { L10n } from '@syncfusion/ej2-base';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';
import { DocumentEditor } from '../../../document-editor/document-editor';
import { MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { RibbonItemModel, RibbonItemSize } from '@syncfusion/ej2-ribbon';
import { LineSpacingHelper } from '../../helper/line-spacing-helper';

// Line spacing constants
export const LINE_SPACING_ID: string = '_line_spacing';

/**
 * LineSpacingGroup class for handling line spacing operations in Document Editor ribbon
 * @private
 */
export class LineSpacingGroup {
    // Property to track the last applied line spacing value
    private appliedLineSpacing: string = '1';
    private container: DocumentEditorContainer;
    private ribbonId: string;
    private localObj: L10n;

    /**
     * Constructor for LineSpacingGroup
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
     * Get the line spacing dropdown item configuration
     * @returns {RibbonItemModel} - Line spacing dropdown item configuration
     * @private
     */
    public getLineSpacingItem(): RibbonItemModel {
        const id: string = this.ribbonId;

        return {
            type: 'DropDown',
            keyTip: 'K',
            allowedSizes: RibbonItemSize.Small,
            dropDownSettings: {
                iconCss: 'e-de-ctnr-linespacing e-icons',
                content: this.localObj.getConstant('Line spacing'),
                items: LineSpacingHelper.getLineSpacingItems(this.localObj),
                select: (args: any) => {
                    this.lineSpacingAction(args);
                },
                beforeItemRender: (args: MenuEventArgs) => {
                    LineSpacingHelper.customizeLineSpacingItem(args, this.appliedLineSpacing);
                }
            },
            id: id + LINE_SPACING_ID,
            ribbonTooltipSettings: { content: this.localObj.getConstant('Line spacing') }
        };
    }

    /**
     * Set the line spacing based on current paragraph format
     * @returns {void}
     * @private
     */
    public setLineSpacing(): void {
        this.appliedLineSpacing = LineSpacingHelper.getCurrentLineSpacing(this.documentEditor, this.localObj);
    }

    private lineSpacingAction(args: any): void {
        const appliedSpacing: any = { value: this.appliedLineSpacing };
        LineSpacingHelper.applyLineSpacing(this.documentEditor, args.item.text, appliedSpacing, this.localObj);
        this.appliedLineSpacing = appliedSpacing.value;
    }
}
