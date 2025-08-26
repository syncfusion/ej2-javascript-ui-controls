import { RibbonGroupBase } from '../ribbon-interfaces';
import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonGroupModel, RibbonItemModel, RibbonItemType, ItemOrientation, Ribbon } from '@syncfusion/ej2-ribbon';
import { ItemModel } from '@syncfusion/ej2-splitbuttons';
import { Editor, Selection, SelectionSectionFormat } from '../../../document-editor/implementation';
import { SectionBreakType } from '../../../document-editor/base/types';
import { BeforeItemRenderEventArgs } from '@syncfusion/ej2-dropdowns';
import { RIBBON_ID } from '../ribbon-base/ribbon-constants';

export const PAGE_SETUP_GROUP_ID: string = '_page_setup_group';
export const MARGINS_BUTTON_ID: string = '_margins_button';
export const MARGINS_DROPDOWN_ID: string = '_margins_dropdown';
export const ORIENTATION_DROPDOWN_ID: string = '_orientation_dropdown';
export const SIZE_DROPDOWN_ID: string = '_size_dropdown';
export const COLUMNS_DROPDOWN_ID: string = '_columns_dropdown';
export const BREAKS_DROPDOWN_ID: string = '_breaks_dropdown';

/**
 * Represents the Page Setup Group in Layout tab
 * @private
 */
export class PageSetupGroup extends RibbonGroupBase {
    private commonId: string;
    /**
     * Constructor for the PageSetupGroup
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    constructor(container: DocumentEditorContainer) {
        super(container);
        this.commonId = container.element.id + RIBBON_ID;
    }

    /**
     * Gets the ribbon group model for Page Setup
     * @returns {RibbonGroupModel} - Ribbon group model for Page Setup
     * @private
     */
    public getGroupModel(): RibbonGroupModel {
        return {
            id: this.commonId + PAGE_SETUP_GROUP_ID,
            header: this.localObj.getConstant('PageSetup'),
            orientation: ItemOrientation.Row,
            showLauncherIcon: true,
            enableGroupOverflow: true,
            overflowHeader: this.localObj.getConstant('PageSetup'),
            collections: [
                {
                    items: [
                        this.createMarginsDropdown(),
                        this.createOrientationDropdown(),
                        this.createSizeDropdown(),
                        this.createColumnsDropdown(),
                        this.createBreaksDropdown()
                    ]
                }
            ]
        };
    }

    private getCurrentMarginType(): string {
        const sectionFormat: SelectionSectionFormat = this.documentEditor.selection.sectionFormat;
        let currentMarginType: string = '';

        // Determine current margin type based on section format values
        if (sectionFormat) {
            const left: number = sectionFormat.leftMargin;
            const right: number = sectionFormat.rightMargin;
            const top: number = sectionFormat.topMargin;
            const bottom: number = sectionFormat.bottomMargin;

            // Normal: 72 points on all sides
            if (Math.abs(left - 72) < 1 && Math.abs(right - 72) < 1 &&
                Math.abs(top - 72) < 1 && Math.abs(bottom - 72) < 1) {
                currentMarginType = 'normal';
            }
            // Narrow: 36 points on all sides
            else if (Math.abs(left - 36) < 1 && Math.abs(right - 36) < 1 &&
                Math.abs(top - 36) < 1 && Math.abs(bottom - 36) < 1) {
                currentMarginType = 'narrow';
            }
            // Moderate: 72 points top/bottom, 54 points left/right
            else if (Math.abs(left - 54) < 1 && Math.abs(right - 54) < 1 &&
                Math.abs(top - 72) < 1 && Math.abs(bottom - 72) < 1) {
                currentMarginType = 'moderate';
            }
            // Wide: 72 points top/bottom, 144 points left/right
            else if (Math.abs(left - 144) < 1 && Math.abs(right - 144) < 1 &&
                Math.abs(top - 72) < 1 && Math.abs(bottom - 72) < 1) {
                currentMarginType = 'wide';
            }
            // Office 2003 Default: 90 points left/right, 72 points top/bottom
            else if (Math.abs(left - 90) < 1 && Math.abs(right - 90) < 1 &&
                Math.abs(top - 72) < 1 && Math.abs(bottom - 72) < 1) {
                currentMarginType = 'office-2003-default';
            } else {
                currentMarginType = 'custom-margins';
            }
        }

        return this.commonId + '_' + currentMarginType;
    }

    private createMarginsDropdown(): RibbonItemModel {
        const marginsItems: ItemModel[] = [
            {
                id: this.commonId + '_normal',
                text: this.localObj.getConstant('Normal'),
                iconCss: 'e-icons e-de-ctnr-margin-normal'
            },
            {
                id: this.commonId + '_narrow',
                text: this.localObj.getConstant('Narrow'),
                iconCss: 'e-icons e-de-ctnr-margin-narrow'
            },
            {
                id: this.commonId + '_moderate',
                text: this.localObj.getConstant('Moderate'),
                iconCss: 'e-icons e-de-ctnr-margin-moderate'
            },
            {
                id: this.commonId + '_wide',
                text: this.localObj.getConstant('Wide'),
                iconCss: 'e-icons e-de-ctnr-margin-wide'
            },
            {
                id: this.commonId + '_office-2003-default',
                text: this.localObj.getConstant('Office2003Default'),
                iconCss: 'e-icons e-de-ctnr-margin-default'
            },
            {
                id: this.commonId + '_custom-margins',
                text: this.localObj.getConstant('CustomMargins'),
                iconCss: 'e-icons e-de-ctnr-margin-custom'
            }
        ];

        return {
            type: 'DropDown',
            id: MARGINS_DROPDOWN_ID,
            keyTip: 'M',
            dropDownSettings: {
                content: this.localObj.getConstant('Margins'),
                items: marginsItems,
                iconCss: 'e-icons e-file-document',
                select: this.onMarginsChange.bind(this),
                beforeItemRender: (args: BeforeItemRenderEventArgs) => {
                    const currentMarginType: string = this.getCurrentMarginType();

                    // Set active class
                    if (args.item.id === currentMarginType) {
                        args.element.classList.add('e-active');
                    } else {
                        args.element.classList.remove('e-active');
                    }
                }
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Margins')
            }
        };
    }

    private onMarginsChange(args: any): void {
        const section: SelectionSectionFormat = this.documentEditor.selection.sectionFormat;
        if (!section) { return; }

        switch (args.item.text) {
        case this.localObj.getConstant('Normal'):
            this.container.documentEditor.editor.changeMarginValue('normal');
            break;
        case this.localObj.getConstant('Narrow'):
            this.container.documentEditor.editor.changeMarginValue('narrow');
            break;
        case this.localObj.getConstant('Moderate'):
            this.container.documentEditor.editor.changeMarginValue('moderate');
            break;
        case this.localObj.getConstant('Wide'):
            this.container.documentEditor.editor.changeMarginValue('wide');
            break;
        case this.localObj.getConstant('Office2003Default'):
            this.container.documentEditor.editor.changeMarginValue('office2003Default');
            break;
        case this.localObj.getConstant('CustomMargins'):
            this.documentEditor.showDialog('PageSetup');
            break;
        }
    }


    private createOrientationDropdown(): RibbonItemModel {
        const orientationItems: ItemModel[] = [
            {
                id: this.commonId + '_portrait',
                text: this.localObj.getConstant('Portrait'),
                iconCss: 'e-icons e-de-ctnr-page-portrait'
            },
            {
                id: this.commonId + '_landscape',
                text: this.localObj.getConstant('Landscape'),
                iconCss: 'e-icons e-de-ctnr-landscape'
            }
        ];

        return {
            type: 'DropDown',
            id: this.commonId + ORIENTATION_DROPDOWN_ID,
            keyTip: 'O',
            dropDownSettings: {
                content: this.localObj.getConstant('Orientation'),
                items: orientationItems,
                iconCss: 'e-icons e-de-ctnr-page-orientation',
                select: this.onOrientationChange.bind(this),
                beforeItemRender: (args: BeforeItemRenderEventArgs) => {

                    // Get current orientation
                    const sectionFormat: SelectionSectionFormat = this.documentEditor.selection.sectionFormat;
                    const isLandscape: boolean = sectionFormat && sectionFormat.pageWidth > sectionFormat.pageHeight;

                    // Set active class based on current orientation
                    if ((args.item.id === this.commonId + '_landscape' && isLandscape) ||
                        (args.item.id === this.commonId + '_portrait' && !isLandscape)) {

                        args.element.classList.add('e-active');
                    } else {
                        args.element.classList.remove('e-active');
                    }
                }
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Orientation')
            }
        };
    }

    private onOrientationChange(args: any): void {
        if (args.item.id === this.commonId + '_portrait') {
            this.documentEditor.editor.onPortrait();
        } else if (args.item.id === this.commonId + '_landscape') {
            this.documentEditor.editor.onLandscape();
        }
    }


    private getCurrentPageSizeType(): string {
        const sectionFormat: SelectionSectionFormat = this.documentEditor.selection.sectionFormat;
        let currentPageSize: string = '';

        // Determine current page size based on section format values
        if (sectionFormat) {
            const width: number = sectionFormat.pageWidth;
            const height: number = sectionFormat.pageHeight;

            // Letter: 8.5" x 11" (612 x 792 points)
            if (Math.abs(width - 612) < 1 && Math.abs(height - 792) < 1) {
                currentPageSize = 'letter';
            }
            // Legal: 8.5" x 14" (612 x 1008 points)
            else if (Math.abs(width - 612) < 1 && Math.abs(height - 1008) < 1) {
                currentPageSize = 'legal';
            }
            // Executive: 7.25" x 10.5" (522 x 756 points)
            else if (Math.abs(width - 522) < 1 && Math.abs(height - 756) < 1) {
                currentPageSize = 'executive';
            }
            // A4: 8.27" x 11.69" (595 x 842 points)
            else if (Math.abs(width - 595) < 1 && Math.abs(height - 842) < 1) {
                currentPageSize = 'a4';
            }
            // A5: 5.83" x 8.27" (420 x 595 points)
            else if (Math.abs(width - 420) < 1 && Math.abs(height - 595) < 1) {
                currentPageSize = 'a5';
            } else {
                currentPageSize = 'custom-page';
            }
        }

        return currentPageSize;
    }

    private createSizeDropdown(): RibbonItemModel {
        const sizeItems: ItemModel[] = [
            {
                id: this.commonId + '_letter',
                text: this.localObj.getConstant('Letter'),
                iconCss: 'e-icons e-de-ctnr-size-letter'
            },
            {
                id: this.commonId + '_legal',
                text: this.localObj.getConstant('Legal'),
                iconCss: 'e-icons e-de-ctnr-size-legal'
            },
            {
                id: this.commonId + '_executive',
                text: this.localObj.getConstant('Executive'),
                iconCss: 'e-icons e-de-ctnr-size-executive'
            },
            {
                id: this.commonId + '_a4',
                text: this.localObj.getConstant('A4'),
                iconCss: 'e-icons e-de-ctnr-size-a4'
            },
            {
                id: this.commonId + '_a5',
                text: this.localObj.getConstant('A5'),
                iconCss: 'e-icons e-de-ctnr-size-a5'
            },
            {
                id: this.commonId + '_custom-page',
                text: this.localObj.getConstant('CustomPageSize'),
                iconCss: 'e-icons e-de-ctnr-size-custom'
            }
        ];

        return {
            type: 'DropDown',
            id: this.commonId + SIZE_DROPDOWN_ID,
            keyTip: 'SZ',
            dropDownSettings: {
                content: this.localObj.getConstant('Size'),
                items: sizeItems,
                iconCss: 'e-icons e-page-size',
                select: this.onPageSizeChange.bind(this),
                beforeItemRender: (args: BeforeItemRenderEventArgs) => {
                    const currentPageSize: string = this.getCurrentPageSizeType();

                    // Set active class
                    if (args.item.id === this.commonId + '_' + currentPageSize) {
                        args.element.classList.add('e-active');
                    } else {
                        args.element.classList.remove('e-active');
                    }
                }
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Size')
            }
        };
    }

    private onPageSizeChange(args: any): void {
        const section: SelectionSectionFormat = this.documentEditor.selection.sectionFormat;
        if (!section) { return; }

        switch (args.item.text) {
        case this.localObj.getConstant('Letter'):
            this.container.documentEditor.editor.onPaperSize('letter');
            break;
        case this.localObj.getConstant('Legal'):
            this.container.documentEditor.editor.onPaperSize('legal');
            break;
        case this.localObj.getConstant('Executive'):
            this.container.documentEditor.editor.onPaperSize('executive');
            break;
        case this.localObj.getConstant('A4'):
            this.container.documentEditor.editor.onPaperSize('a4');
            break;
        case this.localObj.getConstant('A5'):
            this.container.documentEditor.editor.onPaperSize('a5');
            break;
        case this.localObj.getConstant('CustomPageSize'):
            this.documentEditor.showDialog('PageSetup');
            break;
        }
    }

    private getCurrentColumnType(): string {
        const sectionFormat: SelectionSectionFormat = this.documentEditor.selection.sectionFormat;
        let currentColumnType: string = '';

        if (sectionFormat) {
            const columnCount: number = sectionFormat.numberOfColumns;

            if (columnCount === 1) {
                currentColumnType = 'one';
            } else if (columnCount === 2) {
                currentColumnType = 'two';
            } else if (columnCount === 3) {
                currentColumnType = 'three';
            } else if (columnCount === 4) {
                currentColumnType = 'four';
            } else if (columnCount === 5) {
                currentColumnType = 'five';
            } else {
                currentColumnType = 'more-columns';
            }
            // Add checks for left/right column types
        }

        return currentColumnType;
    }

    private createColumnsDropdown(): RibbonItemModel {
        const columnsItems: ItemModel[] = [
            {
                id: this.commonId + '_one',
                text: this.localObj.getConstant('One'),
                iconCss: 'e-icons e-de-ctnr-page-column-one'
            },
            {
                id: this.commonId + '_two',
                text: this.localObj.getConstant('Two'),
                iconCss: 'e-icons e-de-ctnr-page-column-two'
            },
            {
                id: this.commonId + '_three',
                text: this.localObj.getConstant('Three'),
                iconCss: 'e-icons e-de-ctnr-page-column-three'
            },
            {
                id: this.commonId + '_left',
                text: this.localObj.getConstant('Left'),
                iconCss: 'e-icons e-de-ctnr-page-column-left'
            },
            {
                id: this.commonId + '_right',
                text: this.localObj.getConstant('Right'),
                iconCss: 'e-icons e-de-ctnr-page-column-right'
            },
            {
                id: this.commonId + '_more-columns',
                text: this.localObj.getConstant('MoreColumns'),
                iconCss: 'e-icons e-de-ctnr-more-column'
            }
        ];

        return {
            type: 'DropDown',
            id: this.commonId + COLUMNS_DROPDOWN_ID,
            keyTip: 'C',
            dropDownSettings: {
                content: this.localObj.getConstant('Columns'),
                items: columnsItems,
                iconCss: 'e-icons e-de-ctnr-columns',
                select: this.onColumnsChange.bind(this),
                beforeItemRender: (args: BeforeItemRenderEventArgs) => {
                    const currentColumnType: string = this.getCurrentColumnType();

                    // Set active class
                    if (args.item.id === this.commonId + '_' + currentColumnType) {
                        args.element.classList.add('e-active');
                    } else {
                        args.element.classList.remove('e-active');
                    }
                }
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Columns')
            }
        };
    }

    private onColumnsChange(args: any): void {
        const section: SelectionSectionFormat = this.documentEditor.selection.sectionFormat;
        if (!section) { return; }
        const editor: Editor = this.container.documentEditor.editor;
        switch (args.item.id) {
        case this.commonId + '_one':
            editor.applyColumnFormat(1, true);
            break;
        case this.commonId + '_two':
            editor.applyColumnFormat(2, true);
            break;
        case this.commonId + '_three':
            editor.applyColumnFormat(3, true);
            break;
        case this.commonId + '_left':
            editor.applyLeftColumnFormat();
            break;
        case this.commonId + '_right':
            editor.applyRightColumnFormat();
            break;
        case this.commonId + '_more-columns':
            this.documentEditor.showDialog('Columns');
            break;
        }
    }

    private createBreaksDropdown(): RibbonItemModel {
        const breaksItems: ItemModel[] = [
            {
                id: this.commonId + '_page-break',
                text: this.localObj.getConstant('PageBreak'),
                iconCss: 'e-icons e-de-ctnr-page-break'
            },
            {
                id: this.commonId + '_column-break',
                text: this.localObj.getConstant('ColumnBreak'),
                iconCss: 'e-icons e-de-ctnr-page-break-column'
            },
            {
                id: this.commonId + '_next-page',
                text: this.localObj.getConstant('Next Page'),
                iconCss: 'e-icons e-de-ctnr-section-break'
            },
            {
                id: this.commonId + '_continous',
                text: this.localObj.getConstant('Continuous'),
                iconCss: 'e-icons e-de-ctnr-section-break-continuous'
            }
        ];

        return {
            type: 'DropDown',
            id: this.commonId + BREAKS_DROPDOWN_ID,
            keyTip: 'B',
            dropDownSettings: {
                content: this.localObj.getConstant('Breaks'),
                items: breaksItems,
                iconCss: 'e-icons e-de-ctnr-break',
                select: this.onBreakInsert.bind(this)
            },
            ribbonTooltipSettings: {
                content: this.localObj.getConstant('Break')
            }
        };
    }

    private onBreakInsert(args: any): void {
        switch (args.item.id) {
        case this.commonId + '_page-break':
            this.documentEditor.editor.insertPageBreak();
            break;
        case this.commonId + '_column-break':
            this.documentEditor.editor.insertColumnBreak();
            break;
        case this.commonId + '_next-page':
            this.documentEditor.editor.insertSectionBreak();
            break;
        case this.commonId + '_continous':
            this.documentEditor.editorModule.insertSectionBreak(SectionBreakType.Continuous);
            break;
        default:
            break;
        }
    }
    /**
     * @returns {void}
     * @private
     */
    public updateSelection(): void {
        const selection: Selection = this.documentEditor.selection;
        const isHeaderFooter: boolean = selection.contextType.indexOf('Header') >= 0 ||
            selection.contextType.indexOf('Footer') >= 0;
        const isInTable: boolean = selection.contextType.indexOf('Table') >= 0;

        const ribbon: Ribbon = this.container.ribbon.ribbon;
        if (ribbon) {
            if (isInTable || isHeaderFooter || selection.isinFootnote || selection.isinEndnote) {
                ribbon.disableItem(this.commonId + BREAKS_DROPDOWN_ID);
            } else {
                ribbon.enableItem(this.commonId + BREAKS_DROPDOWN_ID);
            }
        }

        const sectionFormat: SelectionSectionFormat = selection.sectionFormat;
        const orientationDropdownId: string = this.commonId + ORIENTATION_DROPDOWN_ID;
        const portraitItem: HTMLElement = document.querySelector(`[id="${orientationDropdownId}_popup"] li[data-value="portrait"]`);
        const landscapeItem: HTMLElement = document.querySelector(`[id="${orientationDropdownId}_popup"] li[data-value="landscape"]`);

        if (portraitItem && landscapeItem) {
            if (sectionFormat.pageWidth > sectionFormat.pageHeight) {
                // Landscape orientation is active
                portraitItem.classList.remove('e-active');
                landscapeItem.classList.add('e-active');
            } else {
                // Portrait orientation is active
                portraitItem.classList.add('e-active');
                landscapeItem.classList.remove('e-active');
            }
        }

    }

}
