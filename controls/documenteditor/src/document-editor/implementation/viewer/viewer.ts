/* eslint-disable */
import { Dictionary } from '../../base/dictionary';
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { WLevelOverride } from '../list/level-override';
import { WSectionFormat, WCharacterFormat, WParagraphFormat, WStyles, WStyle, WColumnFormat, WBorder } from '../format/index';
import { Layout } from './layout';
import { Renderer } from './render';
import { createElement, Browser, L10n } from '@syncfusion/ej2-base';
import {
    Page, Rect, Widget, ListTextElementBox, FieldElementBox, ParagraphWidget, HeaderFooterWidget, EditRangeStartElementBox,
    CommentElementBox, CommentCharacterElementBox, Padding, DropDownFormField, TextFormField, CheckBoxFormField, ShapeElementBox,
    TextFrame, BlockContainer, ContentControl, Footnote, FootnoteElementBox, FootNoteWidget, IWidget, TextElementBox, ShapeBase, ImageElementBox
} from './page';
import { DocumentEditor } from '../../document-editor';
import {
    BodyWidget, LineWidget, TableWidget, TableRowWidget, TableCellWidget,
    ElementBox, BlockWidget, HeaderFooters, BookmarkElementBox
} from './page';
import {
    HelperMethods, Point, TextPositionInfo, ImagePointInfo,
    PageInfo, CanvasInfo, ShapeInfo, ElementInfo, BorderRenderInfo, ParagraphInfo
} from '../editor/editor-helper';
import { TextHelper, TextHeightInfo } from './text-helper';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Selection, CommentReviewPane, HistoryInfo } from '../index';
import { TextPosition } from '../selection/selection-helper';
import { Zoom } from './zooming';
import { Dialog, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { ImageResizer } from '../editor/image-resizer';
import {
    HeaderFooterType, PageFitType, TableAlignment, ProtectionType, FormFieldType,
    FootnoteRestartIndex, FootEndNoteNumberFormat, FootnoteType, CompatibilityMode, TextWrappingStyle
} from '../../base/types';
import { Editor } from '../index';
import { CaretHeightInfo } from '../editor/editor-helper';
import { DocumentEditorKeyDownEventArgs, BeforePaneSwitchEventArgs, FormFieldFillEventArgs, beforePaneSwitchEvent, keyDownEvent, beforeFormFieldFillEvent, afterFormFieldFillEvent, AutoResizeEventArgs } from '../../base/index';
import { RestrictEditing } from '../restrict-editing/restrict-editing-pane';
import { FormFieldPopUp } from '../dialogs/form-field-popup';
import { Revision } from '../track-changes/track-changes';
import { TrackChangesPane } from '../track-changes/track-changes-pane';
import { Themes } from '../themes/themes';
import { beforeAutoResize, internalAutoResize } from '../../base/constants';

/**
 * @private
 */
export class DocumentHelper {
    /**
     * @private
     */
    public isCompleted: boolean = true;
    /**
     * @private
     */
    public isSelectionCompleted: boolean = true;
    /**
     * @private
     */
    public scrollbarWidth: number = 0;
    /**
     * @private
     */
    public isWebPrinting: boolean = false;
    /**
     * @private
     */
    public isHeaderFooter: boolean = false;
    /**
     * @private
     */
    public owner: DocumentEditor;
    /**
     * @private
     */
    public pageContainer: HTMLElement;
    /**
     * @private
     */
    public viewerContainer: HTMLElement;
    /**
     * @private
     */
    public optionsPaneContainer: HTMLElement;
    /**
     * @private
     */
    public reviewPaneContainer: HTMLElement;
    /**
     * @private
     */
    public pages: Page[];
    /**
     * @private
     */
    public currentPage: Page = undefined;
    private selectionStartPageIn: Page = undefined;
    private selectionEndPageIn: Page = undefined;
    /**
     * @private
     */
    public iframe: HTMLIFrameElement;
    /**
     * @private
     */
    public editableDiv: HTMLElement;
    /**
     * @private
     */
    public isShowReviewPane: boolean;
    /**
     * @private
     */
    public fieldStacks: FieldElementBox[] = [];
    /**
     * @private
     */
    public showRevision: boolean = false;
    /**
     * @private
     */
    public splittedCellWidgets: TableCellWidget[] = [];
    /**
     * @private
     */
    public tableLefts: number[] = [];
    /**
     * @private
     */
    public tapCount: number = 0;
    private timer: number = -1;
    private isTimerStarted: boolean = false;
    /**
     * @private
     */
    public isFirstLineFitInShiftWidgets: boolean = false;
    /**
     * @private
     */
    public preZoomFactor: number = 0;
    /**
     * @private
     */
    public preDifference: number = -1;
    /**
     * @private
     */
    public fieldEndParagraph: ParagraphWidget = undefined;
    /**
     * @private
     */
    public fieldToLayout: FieldElementBox = undefined;

    /**
     * @private
     */
    public backgroundColor: string = '#FFFFFF';
    //Module declaration
    /**
     * @private
     */
    public layout: Layout;
    /**
     * @private
     */
    public render: Renderer;
    private containerCanvasIn: HTMLCanvasElement;
    private selectionCanvasIn: HTMLCanvasElement;
    /**
     * @private
     */
    public zoomModule: Zoom;
    // Event
    /**
     * @private
     */
    public isMouseDown: boolean = false;
    private isMouseEntered: boolean = false;
    private scrollMoveTimer: any = 0;
    /**
     * @private
     */
    public isSelectionChangedOnMouseMoved: boolean = false;
    /**
     * @private
     */
    public isControlPressed: boolean = false;
    //Touch Event
    /**
     * @private
     */
    public touchStart: HTMLElement;
    /**
     * @private
     */
    public touchEnd: HTMLElement;
    /**
     * @private
     */
    public isTouchInput: boolean = false;
    /**
     * @private
     */
    public isTouchMoved: boolean = false;
    /**
     * @private
     */
    public useTouchSelectionMark: boolean = false;
    /**
     * @private
     */
    public touchDownOnSelectionMark: number = 0;
    // Helper Methods
    /**
     * @private
     */
    public textHelper: TextHelper;
    /**
     * @private
     */
    public isComposingIME: boolean = false;
    /**
     * @private
     */
    public lastComposedText: string = '';
    /**
     * @private
     */
    public isCompositionStart: boolean = false;
    /**
     * @private
     */
    public isCompositionUpdated: boolean = false;
    /**
     * @private
     */
    public isCompositionCanceled: boolean = false;
    /**
     * @private
     */
    public isCompositionEnd: boolean = false;
    /**
     * @private
     */
    public prefix: string = '';
    /**
     * @private
     */
    public suffix: string = '';
    //DialogDialog
    private dialogInternal: Dialog;
    private dialogTarget1: HTMLElement;
    private dialogTarget2: HTMLElement;
    private dialogInternal2: Dialog;
    private dialogInternal3: Dialog;
    private dialogTarget3: HTMLElement;

    /**
     * @private
     */
    public fields: FieldElementBox[] = [];
    /**
     * @private
     */
    public blockToShift: BlockWidget;
    /**
     * @private
     */
    public heightInfoCollection: TextHeightInfo = {};
    private animationTimer: number;
    /**
     * @private
     */
    public isListTextSelected: boolean;
    /**
     * @private
     */
    public selectionLineWidget: LineWidget;
    /**
     * @private
     */
    public characterFormat: WCharacterFormat;
    /**
     * @private
     */
    public paragraphFormat: WParagraphFormat;
    /**
     * @private
     */
    public themeFontLanguage: WCharacterFormat;
    /**
     * @private
     */
    public renderedLists: Dictionary<WAbstractList, Dictionary<number, number>>;
    /**
     * @private
     */
    public renderedLevelOverrides: WLevelOverride[];
    /**
     * @private
     */
    public headersFooters: HeaderFooters[];
    private fieldSeparator: FieldElementBox;
    /**
     * @private
     */
    public defaultTabWidth: number = 36;

    /**
     * @private
     */
    public dontUseHtmlParagraphAutoSpacing: boolean = false;
    /**
     * @private
     */
    public allowSpaceOfSameStyleInTable: boolean = false;
    /**
     * @private
     */
    public alignTablesRowByRow: boolean = false;
    /**
     * @private
     */
    public compatibilityMode: CompatibilityMode = 'Word2013';
    /**
     * @private
     */
    public lists: WList[] = [];
    /**
     * @private
     */
    public images: Dictionary<number, string[]>;
    /**
     * @private
     */
    public comments: CommentElementBox[] = [];
    /**
     * @private
     */
    public authors: Dictionary<string, string> = new Dictionary<string, string>();
    /**
     * @private
     */
    public revisionsInternal: Dictionary<string, Revision> = new Dictionary<string, Revision>();
    /**
     * @private
     */
    public commentUserOptionId: number = 1;
    /**
     * @private
     */
    public abstractLists: WAbstractList[] = [];
    /**
     * @private
     */
    public styles: WStyles = new WStyles();
    /**
     * @private
     */
    public stylesMap: Dictionary<string, any[]> = new Dictionary<string, any[]>();
    /**
     * @private
     */
    public listParagraphs: ParagraphWidget[];
    /**
     * @private
     */
    public preDefinedStyles: Dictionary<string, string> = undefined;
    /**
     * @private
     */
    public isRowOrCellResizing: boolean = false;
    /**
     * @private
     */
    public bookmarks: Dictionary<string, BookmarkElementBox>;
    /**
     * @private
     */
    public endBookmarksUpdated: string[] = [];
    /**
     * @private
     */
    public formFields: FieldElementBox[] = [];
    /**
     * @private
     */
    public editRanges: Dictionary<string, EditRangeStartElementBox[]>;
    private isMouseDownInFooterRegion: boolean = false;
    private pageFitTypeIn: PageFitType = 'None';
    /**
     * @private
     */
    public fieldCollection: FieldElementBox[] = [];
    /**
     * @private
     */
    public isPageField: boolean = false;
    /**
     * @private
     */
    public mouseDownOffset: Point = new Point(0, 0);
    /**
     * @private
     */
    public zoomX: number;
    /**
     * @private
     */
    public zoomY: number;
    private zoomFactorInternal: number = 1;

    /**
     * If movecaretposition is 1, Home key is pressed
     * If moveCaretPosition is 2, End key is pressed
     *
     * @private
     */
    public moveCaretPosition: number = 0;
    /**
     * @private
     */
    public isTextInput: boolean = false;
    /**
     * @private
     */
    public isTextFormEmpty: boolean = false;
    /**
     * @private
     */
    public isScrollHandler: boolean = false;
    /**
     * @private
     */
    public triggerElementsOnLoading: boolean = false;

    /**
     * @private
     */
    public triggerSpellCheck: boolean = false;

    /**
     * @private
     */
    public scrollTimer: number;

    public resizeTimer: number;
    /**
     * @private
     * @default false
     */
    public isScrollToSpellCheck: boolean;

    //Document Protection Properties Starts
    /**
     * preserve the format
     *
     * @private
     */
    public restrictFormatting: boolean = false;
    /**
     * preserve the document protection type either readonly or no protection
     *
     * @private
     */
    public protectionType: ProtectionType = 'NoProtection';
    /**
     * Preserve the password protection is enforced or not
     *
     * @private
     */
    public isDocumentProtected: boolean = false;
    /**
     * preserve the hash value of password
     *
     * @private
     */
    public hashValue: string = '';
    /**
     * @private
     */
    public saltValue: string = '';
    /**
     * @private
     */
    public userCollection: string[] = [];
    /**
     * @private
     */
    public restrictEditingPane: RestrictEditing;

    public formFillPopup: FormFieldPopUp;
    /**
     * @private
     */
    public cachedPages: number[] = [];
    public longTouchTimer: number;
    /**
     * @private
     */
    public skipScrollToPosition: boolean = false;
    /**
     * @private
     */
    public isIosDevice: boolean = false;
    /**
     * @private
     */
    public isMobileDevice: boolean = false;
    /**
     * @private
     */
    public visibleBoundsIn: Rect;

    /**
     * @private
     */
    public currentSelectedCommentInternal: CommentElementBox;
    /**
     * @private
     */
    public currentSelectedRevisionInternal: Revision;
    /**
     * @private
     */
    public resizerTimer: number;
    /**
     * @private
     */
    public isFormFilling: boolean = false;
    /**
     * @private
     */
    public customXmlData: Dictionary<string, string>;
    /**
     * @private
     */
    public themes: Themes = new Themes();
    /**
     * @private
     */
    public hasThemes: boolean = false;
    /**
     * @private
     */
    public contentControlCollection: ContentControl[];
    /**
     * @private
     */
    public footnotes: Footnote = new Footnote();
    /**
     * @private
     */
    public endnotes: Footnote = new Footnote();
    /**
     * @private
     */
    public endnoteNumberFormat: FootEndNoteNumberFormat;
    /**
     * @private
     */
    public footNoteNumberFormat: FootEndNoteNumberFormat;
    /**
     * @private
     */
    public restartIndexForFootnotes: FootnoteRestartIndex;
    /**
     * @private
     */
    public restartIndexForEndnotes: FootnoteRestartIndex;
    /**
     * @private
     */
    public footnoteCollection: FootnoteElementBox[];
    /**
     * @private
     */
    public endnoteCollection: FootnoteElementBox[];
    /**
     * @private
     */
    public isFootnoteWidget: boolean = false;
    /**
     * @private
     */
    public isDragStarted: boolean = false;
    /**
     * @private
     */
    public isMouseDownInSelection: boolean = false;
    /**
     * @private
     */
    public dragStartParaInfo: ParagraphInfo;
    /**
     * @private
     */
    public dragEndParaInfo: ParagraphInfo;
    /**
     * @private
     */
    public isBookmarkInserted: boolean = true;
    private L10n: L10n;

    private isAutoResizeCanStart: boolean = false;

    /**
     * Gets visible bounds.
     *
     * @private
     * @returns {Rect} - Returns visible bounds.
     */
    public get visibleBounds(): Rect {
        return this.visibleBoundsIn;
    }
    /**
     * @private
     */
    get viewer(): LayoutViewer {
        return this.owner.viewer;
    }
    //Document Protection Properties Ends

    //#region Properties
    /**
     * Gets container canvas.
     *
     * @private
     * @returns {HTMLCanvasElement} - Returns page canvas.
     */
    public get containerCanvas(): HTMLCanvasElement {
        if (isNullOrUndefined(this.containerCanvasIn)) {
            this.containerCanvasIn = document.createElement('canvas');
            this.containerCanvasIn.getContext('2d').save();
        }
        if (!isNullOrUndefined(this.pageContainer)
            && this.containerCanvasIn.parentElement !== this.pageContainer) {
            this.pageContainer.appendChild(this.containerCanvasIn);
        }
        return this.containerCanvasIn;
    }
    /**
     * Gets selection canvas.
     *
     * @private
     * @returns {HTMLCanvasElement} - Returns selection canvas.
     */
    public get selectionCanvas(): HTMLCanvasElement {
        if (isNullOrUndefined(this.selectionCanvasIn)) {
            this.selectionCanvasIn = document.createElement('canvas');
            this.selectionCanvas.getContext('2d').save();
        }
        if (!isNullOrUndefined(this.pageContainer)
            && this.selectionCanvasIn.parentElement !== this.pageContainer) {
            this.pageContainer.appendChild(this.selectionCanvasIn);
        }
        return this.selectionCanvasIn;
    }
    /**
     * Gets container context.
     *
     * @private
     * @returns {CanvasRenderingContext2D} - Returns page canvas context.
     */
    public get containerContext(): CanvasRenderingContext2D {
        return this.containerCanvas.getContext('2d');
    }
    /**
     * Gets selection context.
     *
     * @private
     * @returns {CanvasRenderingContext2D} - Returns selection canvas context.
     */
    public get selectionContext(): CanvasRenderingContext2D {
        return this.selectionCanvas.getContext('2d');
    }

    /**
     * Gets the current rendering page.
     *
     * @returns {Page} - Returns current rendering page.
     */
    public get currentRenderingPage(): Page {
        if (this.pages.length === 0) {
            return undefined;
        }
        return this.pages[this.pages.length - 1];
    }
    /**
     * Gets or sets zoom factor.
     *
     * @private
     * @returns {number} - Returns zoom factor value.
     */
    public get zoomFactor(): number {
        return this.zoomFactorInternal;
    }
    public set zoomFactor(value: number) {
        if (this.zoomFactorInternal !== value) {
            this.preZoomFactor = this.zoomFactor;
            this.zoomFactorInternal = value;
            this.zoomModule.setZoomFactor();
            this.owner.zoomFactor = value;
        }
    }
    /**
     * Gets the selection.
     *
     * @private
     * @returns {Selection} - Returns selection module.
     */
    public get selection(): Selection {
        return this.owner.selection;
    }
    /**
     * Gets or sets selection start page.
     *
     * @private
     * @returns {Page} - Return selection start page.
     */
    public get selectionStartPage(): Page {
        return this.selectionStartPageIn;
    }
    public set selectionStartPage(value: Page) {
        this.selectionStartPageIn = value;
    }
    /**
     * Gets or sets selection end page.
     *
     * @private
     * @returns {Page} - Return selection end page.
     */
    public get selectionEndPage(): Page {
        return this.selectionEndPageIn;
    }
    public set selectionEndPage(value: Page) {
        this.selectionEndPageIn = value;
    }
    /**
     * Gets the initialized default dialog.
     *
     * @private
     * @returns {Dialog} - Returns dialog instance.
     */
    public get dialog(): Dialog {
        if (!this.dialogInternal) {
            this.initDialog(this.owner.enableRtl);
        }
        return this.dialogInternal;
    }
    /**
     * Gets the initialized default dialog.
     *
     * @private
     * @returns {Dialog} - Returns dialog instance.
     */
    public get dialog2(): Dialog {
        if (!this.dialogInternal2) {
            this.initDialog2(this.owner.enableRtl);
        }
        return this.dialogInternal2;
    }

    /**
     * Gets the initialized default dialog.
     *
     * @private
     * @returns {Dialog} - Returns dialog instance.
     */
    public get dialog3(): Dialog {
        if (!this.dialogInternal3) {
            this.initDialog3(this.owner.enableRtl);
        }
        return this.dialogInternal3;
    }
    /**
     * @private
     * @returns {void}
     */
    public get currentSelectedComment(): CommentElementBox {
        return this.currentSelectedCommentInternal;
    }

    public set currentSelectedComment(value: CommentElementBox) {
        if (this.owner && this.owner.commentReviewPane) {
            this.owner.commentReviewPane.previousSelectedComment = this.currentSelectedCommentInternal;
        }
        this.currentSelectedCommentInternal = value;
    }
    /**
     * @private
     * @returns {void}
     */
    public get currentSelectedRevision(): Revision {
        return this.currentSelectedRevisionInternal;
    }

    public set currentSelectedRevision(value: Revision) {
        // if (this.owner && this.owner.commentReviewPane) {
        //     this.owner.commentReviewPane.previousSelectedComment = this.currentSelectedCommentInternal;
        // }
        this.currentSelectedRevisionInternal = value;
    }
    /**
     * @private
     * @returns {void}
     */
    public get isInlineFormFillProtectedMode(): boolean {
        return this.isFormFillProtectedMode && this.owner.documentEditorSettings.formFieldSettings.formFillingMode === 'Inline';
    }
    /**
     * @private
     * @returns {void}
     */
    public get isFormFillProtectedMode(): boolean {
        return this.isDocumentProtected && this.protectionType === 'FormFieldsOnly';
    }
    /**
     * @private
     * @returns {Boolean}
     */
     public get isCommentOnlyMode(): boolean {
        return this.isDocumentProtected && this.protectionType === 'CommentsOnly';
    }
    public get isTrackedOnlyMode() : boolean{
        return this.isDocumentProtected && this.protectionType === 'RevisionsOnly';
    }
    //#endregion

    public constructor(owner: DocumentEditor) {
        this.owner = owner;
        this.pages = [];
        this.lists = [];
        this.abstractLists = [];
        this.render = new Renderer(this);
        this.characterFormat = new WCharacterFormat(this);
        this.themeFontLanguage = new WCharacterFormat(this);
        this.paragraphFormat = new WParagraphFormat(this);
        this.renderedLists = new Dictionary<WAbstractList, Dictionary<number, number>>();
        this.renderedLevelOverrides = [];
        this.headersFooters = [];
        this.styles = new WStyles();
        this.stylesMap = new Dictionary<string, any[]>();
        if(this.owner) {
            this.L10n = new L10n('documenteditor', this.owner.defaultLocale);
            this.L10n.setLocale(this.owner.locale);
        }
        this.preDefinedStyles = new Dictionary<string, string>();
        this.initalizeStyles();
        this.bookmarks = new Dictionary<string, BookmarkElementBox>();
        this.editRanges = new Dictionary<string, EditRangeStartElementBox[]>();
        this.isIosDevice = typeof window !== 'undefined' ? /Mac|iPad|iPod/i.test(navigator.userAgent) : false;
        this.isMobileDevice = typeof window !== 'undefined' ? /Android|Windows Phone|webOS/i.test(navigator.userAgent) : false;
        this.formFillPopup = new FormFieldPopUp(this.owner);
        this.customXmlData = new Dictionary<string, string>();
        this.contentControlCollection = [];
        this.footnoteCollection = [];
        this.endnoteCollection = [];
        this.themes = new Themes();
        this.images = new Dictionary<number, string[]>();
    }
    private initalizeStyles(): void {
        this.preDefinedStyles.add('Normal', '{"type":"Paragraph","name":"Normal","next":"Normal"}');
        this.preDefinedStyles.add('Heading 1', '{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Normal","link":"Heading 1 Char","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":12.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level1"}}');
        this.preDefinedStyles.add('Heading 2', '{"type":"Paragraph","name":"Heading 2","basedOn":"Normal","next":"Normal","link":"Heading 2 Char","characterFormat":{"fontSize":13.0,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level2"}}');
        this.preDefinedStyles.add('Heading 3', '{"type":"Paragraph","name":"Heading 3","basedOn":"Normal","next":"Normal","link":"Heading 3 Char","characterFormat":{"fontSize":12.0,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level3"}}');
        this.preDefinedStyles.add('Heading 4', '{"type":"Paragraph","name":"Heading 4","basedOn":"Normal","next":"Normal","link":"Heading 4 Char","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level4"}}');
        this.preDefinedStyles.add('Heading 5', '{"type":"Paragraph","name":"Heading 5","basedOn":"Normal","next":"Normal","link":"Heading 5 Char","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level5"}}');
        this.preDefinedStyles.add('Heading 6', '{"type":"Paragraph","name":"Heading 6","basedOn":"Normal","next":"Normal","link":"Heading 6 Char","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level6"}}');
        this.preDefinedStyles.add('Default Paragraph Font', '{"type":"Character","name":"Default Paragraph Font"}');
        this.preDefinedStyles.add('Heading 1 Char', '{"type":"Character","name":"Heading 1 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#2F5496"}}');
        this.preDefinedStyles.add('Heading 2 Char', '{"type":"Character","name":"Heading 2 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":13.0,"fontFamily":"Calibri Light","fontColor":"#2F5496"}}');
        this.preDefinedStyles.add('Heading 3 Char', '{"type":"Character","name":"Heading 3 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"fontFamily":"Calibri Light","fontColor": "#1F3763"}}');
        this.preDefinedStyles.add('Heading 4 Char', '{"type":"Character","name":"Heading 4 Char","basedOn":"Default Paragraph Font","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"}}');
        this.preDefinedStyles.add('Heading 5 Char', '{"type":"Character","name":"Heading 5 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"}}');
        this.preDefinedStyles.add('Heading 6 Char', '{"type":"Character","name":"Heading 6 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"}}');
        this.preDefinedStyles.add('Hyperlink', '{"type":"Character","name":"Hyperlink","basedOn":"Default Paragraph Font","next":"Normal","characterFormat":{"fontColor":"#0563C1","underline": "Single"}}');
        this.preDefinedStyles.add('TOC 1', '{"type":"Paragraph","name":"TOC 1","basedOn":"Normal","next":"Normal","paragraphFormat":{"afterSpacing":5.0}}');
        this.preDefinedStyles.add('TOC 2', '{"type":"Paragraph","name":"TOC 2","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :11.0,"afterSpacing":5.0}}');
        this.preDefinedStyles.add('TOC 3', '{"type":"Paragraph","name":"TOC 3","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :22.0,"afterSpacing":5.0}}');
        this.preDefinedStyles.add('TOC 4', '{"type":"Paragraph","name":"TOC 4","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :33.0,"afterSpacing":5.0}}');
        this.preDefinedStyles.add('TOC 5', '{"type":"Paragraph","name":"TOC 5","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :44.0,"afterSpacing":5.0}}');
        this.preDefinedStyles.add('TOC 6', '{"type":"Paragraph","name":"TOC 6","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :55.0,"afterSpacing":5.0}}');
        this.preDefinedStyles.add('TOC 7', '{"type":"Paragraph","name":"TOC 7","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :66.0,"afterSpacing":5.0}}');
        this.preDefinedStyles.add('TOC 8', '{"type":"Paragraph","name":"TOC 8","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :77.0,"afterSpacing":5.0}}');
        this.preDefinedStyles.add('TOC 9', '{"type":"Paragraph","name":"TOC 9","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :88.0,"afterSpacing":5.0}}');
        this.preDefinedStyles.add('Header', '{"type":"Paragraph","name":"Header","basedOn":"Normal","next":"Header","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple"}}');
        this.preDefinedStyles.add('Footer', '{"type":"Paragraph","name":"Footer","basedOn":"Normal","next":"Footer","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple"}}');
    }
    /**
     * @private
     * @returns {void}
     */
    public clearDocumentItems(): void {
        if (this.owner.editor) {
            this.owner.editor.clear();
        }
        if(this.owner.search) {
            this.owner.search.clearSearchHighlight();
        }
        if (this.owner.selection) {
            this.owner.selection.clear();
        }
        this.editRanges.clear();
        this.headersFooters = [];
        this.fields = [];
        this.formFields = [];
        this.currentSelectedComment = undefined;
        this.currentSelectedRevision = undefined;
        for (let i: number = 0; i < this.comments.length; i++) {
            const commentStart: CommentCharacterElementBox = this.comments[i].commentStart;
            if (commentStart) {
                commentStart.destroy();
            }
        }
        this.comments = [];
        this.bookmarks.clear();
        this.endBookmarksUpdated = [];
        this.styles.clear();
        this.stylesMap.clear();
        if (this.pages && this.pages.length > 0) {
            for (let i: number = 0; i < this.pages.length; i++) {
                let page: Page = this.pages[i] as Page;
                page.componentDestroy();
            }
            this.pages = [];
        }
        this.authors.clear();
        this.revisionsInternal.clear();
        this.owner.revisions.clear();
        this.characterFormat.clearFormat();
        this.themeFontLanguage.clearFormat();
        this.paragraphFormat.clearFormat();
        if (this.owner.trackChangesPane) {
            this.owner.trackChangesPane.clear();
        }
        this.setDefaultCharacterValue(this.characterFormat);
        this.setDefaultParagraphValue(this.paragraphFormat);
        if (this.owner.commentReviewPane) {
            this.owner.commentReviewPane.clear();
        }
        this.isHeaderFooter = false;
        this.defaultTabWidth = 36;
        this.isDocumentProtected = false;
        this.protectionType = 'NoProtection';
        this.restrictFormatting = false;
        this.hashValue = '';
        this.saltValue = '';
        this.userCollection = [];
        if (this.formFillPopup) {
            this.formFillPopup.hidePopup();
        }
        this.customXmlData.clear();
        this.images.clear();
        this.contentControlCollection = [];
        this.endnotes.clear();
        this.footnotes.clear();
        this.footnoteCollection = [];
        this.endnoteCollection = [];
        if (this.lists && this.lists.length > 0) {
            for (let i: number = 0; i < this.lists.length; i++) {
                let list: WList = this.lists[i] as WList;
                list.clear();
            }
        }
        this.lists = [];
        this.abstractLists = [];
        this.themes = new Themes();
        this.hasThemes = false;
    }
    /**
     * @private
     * @returns {void}
     */
    public setDefaultDocumentFormat(): void {
        this.owner.parser.parseCharacterFormat(0, this.owner.characterFormat, this.characterFormat);
        this.owner.parser.parseParagraphFormat(0, this.owner.paragraphFormat, this.paragraphFormat);
    }

    private setDefaultCharacterValue(characterFormat: WCharacterFormat): void {
        characterFormat.bold = false;
        characterFormat.italic = false;
        characterFormat.fontFamily = 'Calibri';
        characterFormat.fontSize = 11;
        characterFormat.underline = 'None';
        characterFormat.strikethrough = 'None';
        characterFormat.fontSizeBidi = 11;
        characterFormat.fontFamilyBidi = 'Calibri';
        characterFormat.baselineAlignment = 'Normal';
        characterFormat.highlightColor = 'NoColor';
        characterFormat.fontColor = '#00000000';
        characterFormat.allCaps = false;
    }
    private setDefaultParagraphValue(paragraphFormat: WParagraphFormat): void {
        paragraphFormat.leftIndent = 0;
        paragraphFormat.rightIndent = 0;
        paragraphFormat.firstLineIndent = 0;
        paragraphFormat.textAlignment = 'Left';
        paragraphFormat.beforeSpacing = 0;
        paragraphFormat.afterSpacing = 0;
        paragraphFormat.lineSpacing = 1;
        paragraphFormat.lineSpacingType = 'Multiple';
        paragraphFormat.bidi = false;
        paragraphFormat.keepWithNext = false;
        paragraphFormat.keepLinesTogether = false;
        paragraphFormat.widowControl = true;
    }
    /**
     * @private
     * @param {number} id - Specfies abstract list id.
     * @returns {WAbstractList} - Returns abstract list.
     */
    public getAbstractListById(id: number, isNsid?: boolean): WAbstractList {
        if (isNullOrUndefined(this.abstractLists)) {
            return undefined;
        }
        for (let i: number = 0; i < this.abstractLists.length; i++) {
            const abstractList: WAbstractList = this.abstractLists[i];
            if (!isNullOrUndefined(abstractList)) {
                if (isNsid && abstractList.nsid === id) {
                    return abstractList;
                } else if (abstractList.abstractListId === id) {
                    return abstractList;
                }
            }
        }
        return undefined;
    }
    /**
     * @private
     * @param {number} id - Specfies list id.
     * @returns {WAbstractList} - Returns list.
     */
    public getListById(id: number, isNsid?: boolean): WList {
        if (isNullOrUndefined(this.lists)) {
            return undefined;
        }
        for (let i: number = 0; i < this.lists.length; i++) {
            let list: WList = this.lists[i];
            if (!isNullOrUndefined(list)) {
                if (isNsid && list.nsid === id) {
                    return list;
                } else if (list.listId === id) {
                    return list;
                }
            }
        }
        return undefined;
    }
    /**
     * @private
     * @param {WListLevel} listLevel - Specfies list level.
     * @returns {number} - Returns list level number.
     */
    public static getListLevelNumber(listLevel: WListLevel): number {
        if (listLevel.ownerBase instanceof WLevelOverride) {
            return (listLevel.ownerBase as WLevelOverride).levelNumber;
        } else if (listLevel.ownerBase instanceof WAbstractList && !isNullOrUndefined((listLevel.ownerBase as WAbstractList).levels)) {
            return (listLevel.ownerBase as WAbstractList).levels.indexOf(listLevel);
        } else {
            return -1;
        }
    }
    /**
    * @private
    * @param {ImageElementBox} image - Specfies image.
    * @returns {number} - Returns base64string.
    */
    public getImageString(image: ImageElementBox): string {
        let base64ImageString: string[] = this.images.get(parseInt(image.imageString));
        return image.isMetaFile ? base64ImageString[1] : base64ImageString[0];
    }
    /**
     * @private
     * @param {ImageElementBox} image - Specfies image.
     * @returns {number} - Returns key for specific image.
     */
    public addBase64StringInCollection(image: ImageElementBox): void {
        let key: number = this.images.length;
        let addToCollection: boolean = true;
        let base64ImageString: string[] = [];
        for (let i: number = 0; i < this.images.length; i++) {
            let imageStringCol: string[] = this.images.get(i);
            if (image.isMetaFile && image.metaFileImageString === imageStringCol[0]) {
                key = i;
                addToCollection = false;
                break;
            } else if (image.imageString === imageStringCol[0]) {
                key = i;
                addToCollection = false;
                break;
            }
        }
        if (addToCollection) {
            if (image.isMetaFile) {
                base64ImageString.push(image.metaFileImageString);
                base64ImageString.push(image.imageString === "" ? image.metaFileImageString : image.imageString);
            } else {
                base64ImageString.push(image.imageString);
            }
            this.images.add(this.images.length, base64ImageString);
        }
        if (image.isMetaFile) {
            image.metaFileImageString = key.toString();
        }
        image.imageString = key.toString();
    }
    /**
     * Gets the bookmarks.
     *
     * @private
     * @param {boolean} includeHidden - Include hidden bookmark.
     * @returns {string[]} - Returns bookmars present in current document.
     */
    public getBookmarks(includeHidden?: boolean): string[] {
        const bookmarks: string[] = [];
        for (let i: number = 0; i < this.bookmarks.keys.length; i++) {
            const bookmark: string = this.bookmarks.keys[i];
            if (includeHidden || bookmark.indexOf('_') !== 0) {
                bookmarks.push(bookmark);
            }
        }
        return bookmarks;
    }
    public selectComment(comment: CommentElementBox): void {
        if (this.owner.selection && this.owner.commentReviewPane) {
            this.owner.showComments = true;
            setTimeout(() => {
                if (this.owner && this.owner.selection) {
                    this.owner.selection.selectComment(comment);
                }
            });
        }
    }
    public showComments(show: boolean): void {
        if (this.owner && show && this.owner.enableComment) {
            const eventArgs: BeforePaneSwitchEventArgs = { type: 'Comment' };
            this.owner.trigger(beforePaneSwitchEvent, eventArgs);
        }
        this.owner.commentReviewPane.reviewTab.hideTab(0, false);
        this.owner.commentReviewPane.reviewTab.hideTab(1, false);
        this.owner.commentReviewPane.showHidePane(show && this.owner.enableComment, 'Comments');
    }
    public showRevisions(show: boolean): void {
        let isCommentTabVisible: boolean = false;
        this.showRevision = show;
        if (this.owner && show) {
            const eventArgs: BeforePaneSwitchEventArgs = { type: 'comment' };
            this.owner.trigger(beforePaneSwitchEvent, eventArgs);
        }
        if (!show && this.owner.showComments) {
            this.owner.commentReviewPane.reviewTab.hideTab(0, false);
            this.owner.commentReviewPane.showHidePane(true, 'Comments');
        } else {
            this.owner.commentReviewPane.showHidePane(show, 'Changes');
            if (!this.owner.enableComment) {
                isCommentTabVisible = true;
            }
            // this.owner.commentReviewPane.reviewTab.hideTab(0, isCommentTabVisible);
            this.showRevision = false;
        }
        if (show) {
            this.owner.trackChangesPane.enableDisableButton(!this.owner.isReadOnly && !this.isDocumentProtected);
        }
    }
    /**
     * Initializes components.
     *
     * @private
     * @returns {void}
     */
    public initializeComponents(): void {
        let element: HTMLElement = this.owner.element;
        if (isNullOrUndefined(element)) {
            return;
        }
        //let viewer: LayoutViewer = this;
        this.optionsPaneContainer = createElement('div', {
            className: 'e-documenteditor-optionspane'
        }) as HTMLDivElement;
        this.optionsPaneContainer.contentEditable = 'false';
        element.appendChild(this.optionsPaneContainer);
        const isRtl: boolean = this.owner.enableRtl;
        let viewerContainerStyle: string;
        if (isRtl) {
            viewerContainerStyle = 'direction:ltr;';
        }
        this.viewerContainer = createElement('div', { id: this.owner.containerId + '_viewerContainer' });
        this.viewerContainer.style.cssText = 'position:relative;backgroundColor:#FBFBFB;overflow:auto;' + viewerContainerStyle;
        this.optionsPaneContainer.appendChild(this.viewerContainer);
        this.viewerContainer.tabIndex = -1;
        this.viewerContainer.style.outline = 'none';
        this.pageContainer = createElement('div', { id: this.owner.containerId + '_pageContainer', className: 'e-de-background' });
        this.viewerContainer.appendChild(this.pageContainer);
        this.pageContainer.style.top = '0px';
        this.pageContainer.style.left = '0px';
        this.pageContainer.style.position = 'relative';
        this.pageContainer.style.pointerEvents = 'none';
        if (Browser.isDevice) {
            this.createEditableDiv(element);

        } else {
            this.createEditableIFrame();
        }
        if (this.owner.enableImageResizerMode) {
            this.owner.imageResizerModule.initializeImageResizer();
        }
        this.updateViewerSizeInternal(element);
        this.layout = new Layout(this);
        this.textHelper = new TextHelper(this);
        this.zoomModule = new Zoom(this);
        this.initTouchEllipse();
        this.wireEvent();
        this.restrictEditingPane = new RestrictEditing(this);
        this.owner.commentReviewPane = new CommentReviewPane(this.owner);
        this.owner.trackChangesPane = new TrackChangesPane(this.owner, this.owner.commentReviewPane);
        createSpinner({ target: this.owner.element, cssClass: 'e-spin-overlay' });
    }
    private measureScrollbarWidth(element: HTMLElement): void {
        const parentDiv: HTMLElement = document.createElement('div');
        parentDiv.setAttribute('style', 'visibility:hidden;overflow:scroll');
        element.appendChild(parentDiv);
        const childDiv: HTMLElement = document.createElement('div');
        parentDiv.appendChild(childDiv);
        this.scrollbarWidth = (parentDiv.getBoundingClientRect().width - childDiv.getBoundingClientRect().width);
        parentDiv.parentNode.removeChild(parentDiv);
    }
    private createEditableDiv(element: HTMLElement): void {
        this.editableDiv = document.createElement('div');
        this.editableDiv.contentEditable = 'true';
        this.editableDiv.style.position = 'fixed';
        this.editableDiv.style.left = '-150em';
        this.editableDiv.style.width = '100%';
        this.editableDiv.style.height = '100%';
        this.editableDiv.id = element.id + '_editableDiv';
        document.body.appendChild(this.editableDiv);
    }
    private createEditableIFrame(): void {
        this.iframe = createElement('iframe', {
            attrs: {
                'scrolling': 'no',
                'title': 'Document Editor',
                'style': 'pointer-events:none;position:absolute;left:0px;top:0px;outline:none;background-color:transparent;width:0px;height:0px;overflow:hidden'
            },
            className: 'e-de-text-target'
        }) as HTMLIFrameElement;

        this.viewerContainer.appendChild(this.iframe);
        this.initIframeContent();
    }
    private initIframeContent(): void {
        const style: string = 'background-color:transparent;width:100%;height:100%;padding: 0px; margin: 0px;';
        const innerHtml: string = '<!DOCTYPE html>'
            + '<html lang="' + this.owner.locale +'"><head></head>'
            + '<body spellcheck="false" style=' + style + ' >'
            + '<div contenteditable="true" style=' + style + '></div>'
            + '</body>'
            + '</html>';
        if (!isNullOrUndefined(this.iframe.contentDocument)) {
            this.iframe.contentDocument.open();
            this.iframe.contentDocument.write(innerHtml);
            this.iframe.contentDocument.close();
            this.editableDiv = this.iframe.contentDocument.body.children[0] as HTMLElement;
        }
    }
    /**
     * Wires events and methods.
     *
     * @returns {void}
     */
    private wireEvent(): void {
        if (!isNullOrUndefined(this.selection)) {
            this.selection.initCaret();
        }
        this.wireInputEvents();
        if (!isNullOrUndefined(this.iframe)) {
            this.iframe.addEventListener('load', this.onIframeLoad.bind(this));
        }
        this.viewerContainer.addEventListener('scroll', this.scrollHandler);
        this.viewerContainer.addEventListener('mousedown', this.onMouseDownInternal);
        this.viewerContainer.addEventListener('keydown', this.onKeyDownInternal);
        this.viewerContainer.addEventListener('mousemove', this.onMouseMoveInternal);
        this.viewerContainer.addEventListener('mouseleave', this.onMouseLeaveInternal);
        this.viewerContainer.addEventListener('mouseenter', this.onMouseEnterInternal);
        this.viewerContainer.addEventListener('contextmenu', this.onContextMenu);
        this.viewerContainer.addEventListener('dblclick', this.onDoubleTap);
        this.viewerContainer.addEventListener('mouseup', this.onMouseUpInternal);
        window.addEventListener('resize', this.onWindowResize);
        window.addEventListener('keyup', this.onKeyUpInternal);
        window.addEventListener('mouseup', this.onImageResizer);
        window.addEventListener('touchend', this.onImageResizer);
        this.viewerContainer.addEventListener('touchstart', this.onTouchStartInternal);
        this.viewerContainer.addEventListener('touchmove', this.onTouchMoveInternal);
        this.viewerContainer.addEventListener('touchend', this.onTouchUpInternal);
        if (navigator !== undefined && navigator.userAgent.match('Firefox')) {
            this.viewerContainer.addEventListener('DOMMouseScroll', this.zoomModule.onMouseWheelInternal);
        }
        this.viewerContainer.addEventListener('mousewheel', this.zoomModule.onMouseWheelInternal);
        this.editableDiv.addEventListener('focus',this.updateFocus);
    }
    private wireInputEvents(): void {
        if (isNullOrUndefined(this.editableDiv)) {
            return;
        }
        this.editableDiv.addEventListener('paste', this.onPaste);
        if (!Browser.isDevice) {
            this.editableDiv.addEventListener('keypress', this.onKeyPressInternal);
            if (Browser.info.name === 'chrome') {
                this.editableDiv.addEventListener('textInput', this.onTextInput);
            }
        } else {
            this.editableDiv.addEventListener('input', this.onTextInputInternal);
        }
        this.editableDiv.addEventListener('blur', this.onFocusOut);
        this.editableDiv.addEventListener('keydown', this.onKeyDownInternal);
        this.editableDiv.addEventListener('compositionstart', this.compositionStart);
        this.editableDiv.addEventListener('compositionupdate', this.compositionUpdated);
        this.editableDiv.addEventListener('compositionend', this.compositionEnd);
    }
    private onIframeLoad(): void {
        if (!isNullOrUndefined(this.iframe) && this.iframe.contentDocument.body.children.length === 0) {
            this.initIframeContent();
            this.wireInputEvents();
        }
    }
    /**
     * @private
     * @param {TextEvent} event - Specifies text event.
     * @returns {void}
     */
    private onTextInput = (event: TextEvent): void => {
        if (!this.isComposingIME) {
            event.preventDefault();
            const text: string = event.data;
            this.owner.editor.handleTextInput(text);
        }
    };
    //#region Composition Event
    /**
     * Fires when composition starts.
     *
     * @private
     * @returns {void}
     */
    private compositionStart = (): void => {
        if (!Browser.isDevice && !this.owner.isReadOnlyMode) {
            this.isComposingIME = true;
            this.positionEditableTarget();
            if (this.owner.editorHistory) {
                this.owner.editor.initComplexHistory('IMEInput');
            }
        }
        this.isCompositionStart = true;
    };
    /**
     * Fires on every input during composition.
     *
     * @private
     * @returns {void}
     */
    private compositionUpdated = (): void => {
        if (this.isComposingIME && !this.owner.isReadOnlyMode) {
            setTimeout(() => {
                this.owner.editor.insertIMEText(this.getEditableDivTextContent(), true);
            }, 0);
        }
        this.isCompositionUpdated = true;
    };
    /**
     * Fires when user selects a character/word and finalizes the input.
     *
     * @private
     * @param {CompositionEvent} event - Specifies text compisition event.
     * @returns {void}
     */
    private compositionEnd = (event: CompositionEvent): void => {
        if (this.isComposingIME && !this.owner.isReadOnlyMode) {
            const text: string = this.getEditableDivTextContent();
            if (text !== '') {
                this.owner.editor.insertIMEText(text, false);
            }
            this.isComposingIME = false;
            this.lastComposedText = '';
            this.iframe.setAttribute('style', 'pointer-events:none;position:absolute;left:' + this.owner.viewer.containerLeft + 'px;top:' + this.owner.viewer.containerTop + 'px;outline:none;background-color:transparent;width:0px;height:0px;overflow:hidden');
            this.editableDiv.innerHTML = '';
            if (this.owner.editorHistory) {
                if (text !== '') {
                    this.owner.editor.isSkipOperationsBuild = true;
                }
                this.owner.editorHistory.updateComplexHistory();
                if (text === '') {
                    //When the composition in live. The Undo operation will terminate the composition and empty text will be return from text box.
                    //At that time the the history should be updated. Undo the operation and clear the redo stack. This undo operation will not be saved for redo operation.
                    this.owner.editor.isSkipOperationsBuild = true;
                    this.owner.editorHistory.undo();
                    this.owner.editorHistory.redoStack.pop();
                }
                this.owner.editor.isSkipOperationsBuild = false;
            }
        }
        event.preventDefault();
        this.isCompositionUpdated = false;
        this.isCompositionEnd = true;
    };
    private getEditableDivTextContent(): string {
        return this.editableDiv.textContent;
    }
    public updateAuthorIdentity(): void {
        const revisions: Revision[] = this.owner.revisions.changes;
        for (let i: number = 0; i < revisions.length; i++) {
            this.getAuthorColor(revisions[i].author);
        }
    }
    public getAvatar(userInfo: HTMLElement, userName: HTMLElement, comment: CommentElementBox, revision: Revision): void {
        let author: string;
        let userinitial: string;
        if (!isNullOrUndefined(comment)) {
            author = comment.author;
            userinitial = comment.initial;
        } else {
            author = revision.author;
        }
        if (!isNullOrUndefined(author)) {
            const avatarDiv: HTMLElement = createElement('div', { className: 'e-de-cmt-avatar' });
            const avatar: HTMLElement = createElement('div', { className: 'e-de-ff-cmt-avatar' });
            avatar.style.backgroundColor = this.owner.documentHelper.getAuthorColor(author);
            if (userinitial === '' || isNullOrUndefined(userinitial)) {
                const authorName: string[] = author.split(' ');
                let initial: string = authorName[0].charAt(0);
                if (authorName.length > 1) {
                    initial += authorName[authorName.length - 1][0];
                }
                avatar.innerText = initial.toUpperCase();
            } else {
                if (userinitial.length > 2) {
                    avatar.innerText = userinitial.substring(0, 2);
                } else {
                    avatar.innerText = userinitial;
                }
            }
            avatarDiv.appendChild(avatar);
            avatarDiv.appendChild(userName);
            userInfo.appendChild(avatarDiv);
        }
    }
    /**
     * @private
     * @param {string} author - Specifies author name.
     * @returns {string} - Return autor color.
     */
    public getAuthorColor(author: string): string {
        if (this.authors.containsKey(author)) {
            return this.authors.get(author);
        }
        let color: string;
        if (this.authors.length === 0) {
            color = '#b5082e';  //dark red
        } else {
            color = this.generateRandomColor();
        }
        this.authors.add(author, color);
        return color;
    }

    public generateRandomColor(): string {
        const userColors: string[] = ['#b5082e',  //dark red
            '#2e97d3',                          //sky blue
            '#bb00ff',                          //purple
            '#f37e43',                          //dark orange
            '#03a60b',                          //green
            '#881824',                          //brown
            '#e09a2b',                          //dark yellow
            '#50565e'];                         //dark grey
        return userColors[(this.authors.length % 8)];
    }
    /**
     * @private
     * @returns {void}
     */
    public positionEditableTarget(): void {
        const point: Point = this.selection.getRect(this.selection.start);
        const page: Page = this.selection.getSelectionPage(this.selection.start);
        // const caretInfo: CaretHeightInfo = this.selection.updateCaretSize(this.owner.selection.start);
        const sectionFormat: WSectionFormat = page.bodyWidgets[0].sectionFormat;
        const left: number = page.boundingRectangle.x + (HelperMethods.convertPointToPixel(sectionFormat.leftMargin) * this.zoomFactor);
        const top: number = point.y;
        const pageWidth: number = sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin;

        let iframeStyle: string = 'left:' + left + 'px;';
        iframeStyle += 'top:' + top + 'px;';
        iframeStyle += 'width:' + (HelperMethods.convertPointToPixel(pageWidth) * this.zoomFactor) + 'px;';
        iframeStyle += 'height:250px;outline-style:none;position:absolute';
        this.iframe.setAttribute('style', iframeStyle);

        let style: string = 'background-color:transparent;width:100%;height:250px;padding: 0px; margin: 0px;';
        style += 'text-indent:' + (point.x - left) + 'px;';
        style += 'color:transparent;pointer-events:none;outline-style:none;';
        style += 'font-size:' + (HelperMethods.convertPointToPixel(this.selection.characterFormat.fontSize) * this.zoomFactor) + 'px;';
        style += 'font-family' + this.selection.characterFormat.fontFamily + ';';
        style += 'overflow:hidden;text-decoration:none;white-space:normal;';
        this.editableDiv.setAttribute('style', style);
    }
    /* eslint-disable @typescript-eslint/no-explicit-any */
    private onImageResizer = (args: any): void => {
        if (!isNullOrUndefined(this.owner) && !isNullOrUndefined(this.owner.imageResizerModule) &&
            this.owner.imageResizerModule.isImageResizerVisible && this.owner.imageResizerModule.isImageResizing) {
            if (args instanceof MouseEvent) {
                this.onMouseUpInternal(args);
            } else if (args instanceof TouchEvent) {
                this.onTouchUpInternal(args);
            }
        }
        if (this.scrollMoveTimer) {
            this.isMouseEntered = true;
            clearInterval(this.scrollMoveTimer);
        }

    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    /**
     * @private
     * @param {KeyboardEvent} event - Specifies keyboard event
     * @returns {void}
     */
    public onKeyPressInternal = (event: KeyboardEvent): void => {
        const key: number = event.which || event.keyCode;
        this.triggerElementsOnLoading = false;
        let ctrl: boolean = (event.ctrlKey || event.metaKey) ? true : ((key === 17) ? true : false); // ctrl detection
        const alt: boolean = event.altKey ? event.altKey : ((key === 18) ? true : false); // alt key detection
        if (Browser.isIE && alt && ctrl) {
            ctrl = false;
        }
        // tslint:disable-next-line:max-line-length
        if (ctrl && event.key === 'v' || ctrl && event.key === 'a' || (ctrl || (this.isControlPressed && Browser.isIE)) && event.key === 'p') {
            if (Browser.isIE) {
                this.isControlPressed = false;
            }
            return;
        }
        if (!this.owner.isReadOnlyMode || (this.selection && this.selection.isInlineFormFillMode())) {
            const key: number = event.keyCode || event.charCode;
            let char: string = '';
            if (key) {
                char = String.fromCharCode(key);
            } else if (event.key) {
                char = event.key;
            }
            if (char !== ' ' && char !== '\r' && char !== '\b' && char !== String.fromCharCode(27) && !ctrl) {
                this.owner.editorModule.handleTextInput(char);
            } else if (char === ' ') {
                this.triggerSpellCheck = true;
                this.owner.editorModule.handleTextInput(' ');
                this.triggerSpellCheck = false;
            }
            event.preventDefault();
        }
        this.owner.focusIn();
    };
    /**
     * @private
     * @param {KeyboardEvent} event - Specifies keyboard event
     * @returns {void}
     */
    private onTextInputInternal = (event: KeyboardEvent): void => {
        if (!this.owner.isReadOnlyMode) {
            this.owner.editorModule.onTextInputInternal();
        } else {
            this.editableDiv.innerText = '';
        }
    };

    /**
     * Fired on paste.
     *
     * @private
     * @param {ClipboardEvent} event - Specifies clipboard event.
     * @returns {void}
     */
    public onPaste = (event: ClipboardEvent): void => {
        if ((!this.owner.isReadOnlyMode && this.owner.editor.canEditContentControl) || this.selection.isInlineFormFillMode()) {
            this.owner.editorModule.pasteInternal(event);
        }
        this.editableDiv.innerText = '';
        event.preventDefault();
    };

    private initDialog(isRtl?: boolean): void {
        if (!this.dialogInternal) {
            this.dialogTarget1 = createElement('div', { className: 'e-de-dlg-target' });
            this.dialogTarget1.contentEditable = 'false';
            document.body.appendChild(this.dialogTarget1);
            if (isRtl) {
                this.dialogTarget1.classList.add('e-de-rtl');
            }
            this.dialogInternal = new Dialog({
                target: document.body, showCloseIcon: true,
                allowDragging: true, enableRtl: isRtl, visible: false,
                width: '1px', isModal: true, position: { X: 'center', Y: 'center' }, zIndex: this.owner.zIndex + 20,
                animationSettings: { effect: 'None' }
            });
            this.dialogInternal.isStringTemplate = true;
            this.dialogInternal.open = this.selection.hideCaret;
            this.dialogInternal.beforeClose = this.updateFocus;
            this.dialogInternal.appendTo(this.dialogTarget1);
        }
    }
    private initDialog3(isRtl?: boolean): void {
        if (!this.dialogInternal3) {
            this.dialogTarget3 = createElement('div', { className: 'e-de-dlg-target' });
            this.dialogTarget3.contentEditable = 'false';
            document.body.appendChild(this.dialogTarget3);
            if (isRtl) {
                this.dialogTarget3.classList.add('e-de-rtl');
            }
            this.dialogInternal3 = new Dialog({
                target: document.body, showCloseIcon: true,
                allowDragging: true, enableRtl: isRtl, visible: false,
                width: '1px', isModal: true, position: { X: 'center', Y: 'center' }, zIndex: this.owner.zIndex,
                animationSettings: { effect: 'None' }
            });
            this.dialogInternal3.isStringTemplate = true;
            this.dialogInternal3.open = this.selection.hideCaret;
            this.dialogInternal3.beforeClose = this.updateFocus;
            this.dialogInternal3.appendTo(this.dialogTarget3);
        }
    }

    public hideDialog(): void {
        this.dialog.hide();
        this.updateFocus();
    }

    private initDialog2(isRtl?: boolean): void {
        if (!this.dialogInternal2) {
            this.dialogTarget2 = createElement('div', { className: 'e-de-dlg-target' });
            this.dialogTarget2.contentEditable = 'false';
            document.body.appendChild(this.dialogTarget2);
            if (isRtl) {
                this.dialogTarget2.classList.add('e-de-rtl');
            }
            this.dialogInternal2 = new Dialog({
                target: document.body, showCloseIcon: true,
                allowDragging: true, enableRtl: isRtl, visible: false,
                width: '1px', isModal: true, position: { X: 'center', Y: 'Top' }, zIndex: this.owner.zIndex + 10
            });
            this.dialogInternal2.isStringTemplate = true;
            this.dialogInternal2.appendTo(this.dialogTarget2);
        }
    }
    /**
     * Fires when editable div loses focus.
     *
     * @private
     * @returns {void}
     */
    public onFocusOut = (): void => {
        if (!isNullOrUndefined(this.selection)) {
            if (this.owner.contextMenuModule && this.owner.contextMenuModule.contextMenuInstance &&
                this.owner.contextMenuModule.contextMenuInstance.element.style.display === 'block') {
                return;
            }
            this.selection.hideCaret();
        }
    };
    /**
     * Updates focus to editor area.
     *
     * @private
     * @returns {void}
     */
    public updateFocus = (): void => {
        if (!isNullOrUndefined(this.currentSelectedComment) && !this.owner.commentReviewPane.commentPane.isEditMode) {
            if (this.owner.commentReviewPane && this.owner.commentReviewPane.commentPane.isEditMode) {
                this.owner.commentReviewPane.commentPane.selectComment(this.currentSelectedComment);
            }
            this.selection.hideCaret();
            return;
        }
        if (this.selection && !(this.isMobileDevice && this.owner.isReadOnly)) {
            if (navigator !== undefined && !Browser.isDevice && !Browser.isIE && !navigator.userAgent.match('Edge')
                && !isNullOrUndefined(this.iframe)) {
                this.iframe.focus();
            }
            if (!isNullOrUndefined(this.editableDiv)) {
                this.editableDiv.focus();
            }
            this.selection.showCaret();
        }
    };


    /**
     * Clears the context.
     *
     * @private
     * @returns {void}
     */
    public clearContent(): void {
        this.containerContext.clearRect(0, 0, this.containerCanvas.width, this.containerCanvas.height);
        this.selectionContext.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
        // Hide comment mark
        if (this.pageContainer) {
            const commentMarkElement: HTMLCollectionOf<Element> = this.pageContainer.getElementsByClassName('e-de-cmt-mark');
            for (let i: number = 0; i < commentMarkElement.length; i++) {
                (commentMarkElement[i] as HTMLElement).style.display = 'none';
            }
        }
        if (this.pageContainer) {
            const editRangeStart: HTMLCollectionOf<Element> = this.pageContainer.getElementsByClassName('e-de-lock-mark');
            for (let i: number = 0; i < editRangeStart.length; i++) {
                (editRangeStart[i] as HTMLElement).style.display = 'none';
            }
        }
    }
    /**
     * Fired when the document gets changed.
     *
     * @private
     * @param {BodyWidget[]} sections - Specified document content.
     * @returns {void}
     */
    public onDocumentChanged(sections: BodyWidget[]): void {
        this.clearContent();
        if (this.owner.editorModule) {
            this.owner.editorModule.tocStyles = {};
            this.owner.editorModule.tocBookmarkId = 0;
        }
        this.heightInfoCollection = {};
        this.owner.isDocumentLoaded = false;
        this.viewer.columnLayoutArea.clear();
        this.layout.isDocumentContainsRtl = false;
        this.layout.isMultiColumnDoc = false;
        this.updateAuthorIdentity();
        for (let i: number = 0; i < this.pages.length; i++) {
            for (let j: number = 0; j < this.pages[i].bodyWidgets.length; j++) {
                this.pages[i].bodyWidgets[j].destroy();
            }
        }
        this.pages = [];
        if (!isNullOrUndefined(this.renderedLists)) {
            this.renderedLists.clear();
        }
        if (!isNullOrUndefined(this.renderedLevelOverrides)) {
            this.renderedLevelOverrides = [];
        }
        if (!isNullOrUndefined(this.owner.editorHistory)) {
            this.owner.editorHistory.destroy();
        }
        this.owner.isDocumentLoaded = true;
        this.layout.isInitialLoad = true;
        this.layout.footHeight = 0;
        this.layout.footnoteHeight = 0;
        this.layout.layoutItems(sections, false);
        if (this.owner.selection) {
            this.selection.previousSelectedFormField = undefined;
            if (this.formFields.length > 0) {
                this.owner.selection.highlightFormFields();
            }
            this.owner.selection.editRangeCollection = [];
            this.owner.selection.selectRange(this.owner.documentStart, this.owner.documentStart);
            if(this.isDocumentProtected && this.protectionType == 'FormFieldsOnly'){
                this.owner.selection.navigateToNextFormField();
            }
            if (this.isDocumentProtected) {
                this.restrictEditingPane.showHideRestrictPane(true);
            }
        }
        if (this.owner.optionsPaneModule) {
            this.owner.optionsPaneModule.showHideOptionsPane(false);
        }
        if (this.restrictEditingPane.restrictPane && !this.isDocumentProtected) {
            this.restrictEditingPane.showHideRestrictPane(false);
        }
        if (!isNullOrUndefined(this.owner.selection) && this.owner.selection.isViewPasteOptions) {
            this.owner.selection.isViewPasteOptions = false;
            this.owner.selection.showHidePasteOptions(undefined, undefined);
        }
        this.owner.fireDocumentChange();
        setTimeout((): void => {
            if (!isNullOrUndefined(this.owner) && this.owner.showRevisions) {
                this.showRevisions(true);
            }
        });
    }
    /**
     * Fires on scrolling.
     *
     * @returns {void}
     */
    private scrollHandler = (): void => {
        if (this.scrollTimer) {
            clearTimeout(this.scrollTimer);
        }
        this.clearContent();
        this.isScrollHandler = true;
        if (!Browser.isDevice && !this.isComposingIME) {
            this.iframe.style.top = this.owner.viewer.containerTop + 'px';
            this.iframe.style.left = this.owner.viewer.containerLeft + 'px';
        }
        this.owner.viewer.updateScrollBars();
        const vtHeight: number = this.owner.viewer.containerTop + this.visibleBounds.height - (this.owner.viewer.padding.top + this.owner.viewer.padding.bottom);
        if (vtHeight > this.pageContainer.offsetHeight) {
            this.viewerContainer.scrollTop = this.owner.viewer.containerTop - (vtHeight - this.pageContainer.offsetHeight);
        }
        if (this.owner.viewer instanceof PageLayoutViewer && !isNullOrUndefined(this.owner)) {
            this.owner.fireViewChange();
        }
        this.isScrollHandler = false;
        this.scrollTimer = setTimeout(() => {
            if (!this.isScrollHandler && !isNullOrUndefined(this.owner) && this.owner.isSpellCheck) {
                this.isScrollToSpellCheck = true;
                this.owner.viewer.updateScrollBars();
            }
        }, 200);
    };
    /**
     * Fires when the window gets resized.
     *
     * @private
     * @returns {void}
     */
    public onWindowResize = (): void => {
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout((): void => {
            if (!isNullOrUndefined(this.owner) && !isNullOrUndefined(this.owner.element)) {
                this.updateViewerSize();
                this.clearContent();
                this.owner.viewer.updateScrollBars();
                if (!isNullOrUndefined(this.selection)) {
                    this.selection.updateCaretPosition();
                }
                this.updateTouchMarkPosition();
                if (this.owner.contextMenuModule && this.owner.contextMenuModule.contextMenuInstance) {
                    this.owner.contextMenuModule.contextMenuInstance.close();
                }
                if (this.resizeTimer) {
                    clearTimeout(this.resizeTimer);
                }
            }
        }, 200);
    };
    /**
     * @private
     * @param {MouseEvent} event - Specified mouse event.
     * @returns {void}
     */
    public onContextMenu = (event: MouseEvent): void => {
        if (this.owner.contextMenuModule) {
            if (this.isMouseDown) {
                this.isMouseDown = false;
            }
            this.owner.contextMenuModule.onContextMenuInternal(event);
            this.updateFocus();
        }
    };
    /**
     * Initialize touch ellipse.
     *
     * @returns {void}
     */
    private initTouchEllipse(): void {
        const style: string = 'height: 30px;width: 30px;position: absolute;background-color: transparent;margin: 0px;padding: 0px;z-index:5';
        const ellipse: string = ' height: 12px;width: 12px;border-radius: 50%;background-color: white;position: absolute;margin: 0px 6px 0px 6px;border-width: 2px;border-style: solid;border-color: #000000;box-sizing: unset;';
        this.touchStart = createElement('div', { className: 'e-touch-ellipse', styles: style });
        const start: HTMLElement = createElement('div', { styles: ellipse });
        this.touchEnd = createElement('div', { className: 'e-touch-ellipse', styles: style });
        this.touchStart.style.display = 'none';
        const end: HTMLElement = createElement('div', { styles: ellipse });
        this.touchStart.appendChild(start);
        this.touchEnd.appendChild(end);
        this.touchEnd.style.display = 'none';
        this.viewerContainer.appendChild(this.touchStart);
        this.viewerContainer.appendChild(this.touchEnd);
    }
    /**
     * Updates touch mark position.
     *
     * @private
     * @returns {void}
     */
    public updateTouchMarkPosition(): void {
        if (this.touchStart.style.display !== 'none' && !isNullOrUndefined(this.selection)) {
            if (!this.selection.isEmpty) {
                let y: number = this.selection.getCaretBottom(this.selection.start, false);
                let page: Page = this.selection.getPage(this.selection.start.paragraph);
                const pageTop: number = (page.boundingRectangle.y - (this.owner.viewer.pageGap * (this.pages.indexOf(page) + 1)) * this.zoomFactor + (this.owner.viewer as PageLayoutViewer).pageGap * (this.pages.indexOf(page) + 1));
                this.touchStart.style.left = page.boundingRectangle.x + (Math.round(this.selection.start.location.x) * this.zoomFactor - 14) + 'px';
                this.touchStart.style.top = pageTop + ((y) * this.zoomFactor) + 'px';
                if (!this.selection.isEmpty) {
                    y = this.selection.getCaretBottom(this.selection.end, false);
                    page = this.selection.getPage(this.selection.end.paragraph);
                }
                this.touchEnd.style.left = page.boundingRectangle.x + (Math.round(this.selection.end.location.x) * this.zoomFactor - 14) + 'px';
                this.touchEnd.style.top = pageTop + (y * this.zoomFactor) + 'px';
            } else {
                this.selection.updateCaretPosition();
            }
        }
    }
    /**
     * Called on mouse down.
     *
     * @private
     * @param {MouseEvent} event - Specifies mouse event.
     * @returns {void}
     */
    public onMouseDownInternal = (event: MouseEvent): void => {
        const target: HTMLElement = event.target as HTMLElement;
        this.owner.focusIn();
        if ((!isNullOrUndefined(target) && target !== this.viewerContainer) || this.isTouchInput ||
            event.offsetX > (this.visibleBounds.width - (this.visibleBounds.width - this.viewerContainer.clientWidth))
            || event.offsetY > (this.visibleBounds.height - (this.visibleBounds.height - this.viewerContainer.clientHeight))) {
            return;
        }
        this.isFootnoteWidget = false;
        if (!isNullOrUndefined(this.selection)) {
            this.updateCursor(event);
            if (this.formFillPopup) {
                this.formFillPopup.hidePopup();
            }
            if (this.isLeftButtonPressed(event) && !this.owner.isReadOnlyMode && this.owner.enableImageResizerMode && !isNullOrUndefined(this.owner.imageResizerModule.selectedResizeElement)) {
                if (this.selection.isInShape) {
                    const textFram: TextFrame = this.owner.selection.getCurrentTextFrame();
                    const shape: ShapeElementBox = textFram.containerShape as ShapeElementBox;
                    this.selection.selectShape(shape);
                }
                this.owner.imageResizerModule.isImageResizing = true;
            }
            event.preventDefault();
            if (!this.isTouchInput) {
                this.selection.hideCaret();
            }
            const cursorPoint: Point = new Point(event.offsetX, event.offsetY);
            const touchPoint: Point = this.owner.viewer.findFocusedPage(cursorPoint, true, true);
            this.mouseDownOffset.x = touchPoint.x;
            this.mouseDownOffset.y = touchPoint.y;
            this.isMouseDownInFooterRegion = this.selection.isCursorInsidePageRect(cursorPoint, this.currentPage) && this.selection.isCursorInFooterRegion(cursorPoint, this.currentPage);
            this.isSelectionChangedOnMouseMoved = false;
            if (!this.owner.isReadOnlyMode && (this.owner.editorModule.tableResize.isInCellResizerArea(touchPoint) ||
                this.owner.editorModule.tableResize.isInRowResizerArea(touchPoint))) {
                this.selection.hideCaret();
                this.isMouseDown = true;
                this.isSelectionChangedOnMouseMoved = false;
                if (this.isLeftButtonPressed(event)) {
                    this.owner.editorModule.tableResize.startingPoint.x = touchPoint.x;
                    this.owner.editorModule.tableResize.startingPoint.y = touchPoint.y;
                    this.owner.editorModule.tableResize.handleResize(touchPoint);
                }
                return;
            }
            if (event.ctrlKey) {
                this.isControlPressed = true;
            }
            if (this.owner.selection.isEmpty) {
                this.useTouchSelectionMark = false;
            }
            const widget: IWidget = this.getLineWidget(touchPoint);
            if (event.which === 3 && !this.owner.selection.isEmpty
                && this.selection.checkCursorIsInSelection(widget, touchPoint)) {
                event.preventDefault();
                return;
            }
            if (this.owner && this.owner.documentEditorSettings && this.owner.documentEditorSettings.allowDragAndDrop &&
                !this.owner.selection.isEmpty
                && this.selection.checkCursorIsInSelection(widget, touchPoint)) {
                this.isMouseDownInSelection = true;
            }
            this.isTouchInput = false;
            this.isMouseDown = true;
            this.updateFocus();
            /* eslint-disable @typescript-eslint/indent */
            this.timer = setTimeout((): void => {
                this.tapCount++;
                if (this.tapCount > 1) {
                    this.tapCount = 1;
                }
                if (!this.isScrollHandler && !isNullOrUndefined(this.owner) && this.owner.isSpellCheck) {
                    this.isScrollToSpellCheck = true;
                    this.owner.viewer.updateScrollBars();
                }
            }, 100);
        }
    };

    /**
     * Called on mouse move.
     *
     * @private
     * @param {MouseEvent} event - Specified mouse event.
     * @returns {void}
     */
    public onMouseMoveInternal = (event: MouseEvent): void => {
        if (!isNullOrUndefined(event.target) && event.target !== this.viewerContainer) {
            return;
        }
        event.preventDefault();
        if (!isNullOrUndefined(this.selection)) {
            //For image Resizing
            if (!this.owner.isReadOnlyMode && this.owner.enableImageResizerMode
                && this.owner.imageResizerModule.isImageResizing) {
                if (!this.owner.imageResizerModule.isImageMoveToNextPage) {
                    this.owner.imageResizerModule.handleImageResizingOnMouse(event);
                }
                return;
            }
            const cursorPoint: Point = new Point(event.offsetX, event.offsetY);
            const touchPoint: Point = this.owner.viewer.findFocusedPage(cursorPoint, !this.owner.enableHeaderAndFooter);
            const widget: LineWidget = this.getLineWidget(touchPoint);
            if (this.isMouseDown) {
                if (!isNullOrUndefined(this.currentPage)) {
                    const xPosition: number = touchPoint.x;
                    const yPosition: number = touchPoint.y;
                    if (!this.owner.isReadOnlyMode && this.isRowOrCellResizing) {
                        const table: TableWidget = this.owner.editorModule.tableResize.currentResizingTable;
                        const startPosition: TextPosition = this.selection.setPositionForBlock(table, true);
                        const endPosition: TextPosition = this.selection.setPositionForBlock(table, false);
                        if (!(this.owner.documentHelper.isDocumentProtected) || this.selection.checkSelectionIsAtEditRegion(startPosition, endPosition)) {
                            this.owner.editorModule.tableResize.handleResizing(touchPoint);
                        }
                    } else {
                        if (!this.isDragStarted
                            && this.isMouseDownInSelection
                            && this.isLeftButtonPressed(event)
                            && !this.owner.selection.isEmpty
                            && this.selection.checkCursorIsInSelection(widget, touchPoint)) {
                            this.isDragStarted = true;
                            this.isMouseDownInSelection = false;
                            if (this.selection.isForward) {
                                this.dragStartParaInfo = this.selection.getParagraphInfo(this.selection.start);
                                this.dragEndParaInfo = this.selection.getParagraphInfo(this.selection.end);
                            }
                            else {
                                this.dragStartParaInfo = this.selection.getParagraphInfo(this.selection.end);
                                this.dragEndParaInfo = this.selection.getParagraphInfo(this.selection.start);
                            }
                            this.selection.caret.classList.remove("e-de-cursor-animation");
                        }
                        if (!(this.isTouchInput || this.isSelectionChangedOnMouseMoved || this.touchDownOnSelectionMark > 0 || this.isDragStarted)) {
                            this.updateTextPositionForSelection(touchPoint, 1);
                        }
                        if (this.isLeftButtonPressed(event) && !this.isDragStarted) {
                            event.preventDefault();
                            const touchY: number = yPosition;
                            const textPosition: TextPosition = this.owner.selection.end;
                            const touchPoint: Point = new Point(xPosition, touchY);
                            if (!this.owner.enableImageResizerMode || !this.owner.imageResizerModule.isImageResizerVisible
                                || this.owner.imageResizerModule.isShapeResize) {
                                this.isCompleted = false;
                                this.owner.selection.moveTextPosition(touchPoint, textPosition);
                            }
                            this.isSelectionChangedOnMouseMoved = true;
                        }
                        if (this.isDragStarted && this.isLeftButtonPressed(event)) {
                            this.autoScrollOnSelection(cursorPoint);
                            this.selection.updateTextPosition(widget, touchPoint);
                        }
                    }
                }
                this.selection.checkForCursorVisibility();
            }
            if (!this.isRowOrCellResizing && !this.isSelectionChangedOnMouseMoved) {
                this.updateCursor(event);
            }
            if (this.isRowOrCellResizing) {
                this.selection.hideCaret();
            }
        }
    };
    private autoScrollOnSelection(cursorPoint: Point): void {
        //Auto scroll when mouse moved hold on the edge of the viewer container.
        if (this.scrollMoveTimer && (cursorPoint.y <= 0 || cursorPoint.y > 50 || cursorPoint.y < (this.viewerContainer.offsetHeight - 50))) {
            clearInterval(this.scrollMoveTimer);
            this.scrollMoveTimer = 0;
        } else if (cursorPoint.y < 60) {
            clearInterval(this.scrollMoveTimer);
            //Scroll up
            this.scrollMoveTimer = setInterval(() => {
                this.viewerContainer.scrollTop -= 20;
                setTimeout(() => {
                    const touchPoint: Point = this.owner.viewer.findFocusedPage(cursorPoint, !this.owner.enableHeaderAndFooter);
                    const widget: LineWidget = this.getLineWidget(touchPoint);
                    this.selection.updateTextPosition(widget, touchPoint);
                }, 200);
            }, 200);
        } else if (cursorPoint.y > (this.viewerContainer.offsetHeight - 70)) {
            clearInterval(this.scrollMoveTimer);
            //Scroll down
            this.scrollMoveTimer = setInterval(() => {
                this.viewerContainer.scrollTop += 20;
                setTimeout(() => {
                    const touchPoint: Point = this.owner.viewer.findFocusedPage(cursorPoint, !this.owner.enableHeaderAndFooter);
                    const widget: LineWidget = this.getLineWidget(touchPoint);
                    this.selection.updateTextPosition(widget, touchPoint);
                }, 200);
            }, 200);
        }
    }
    /**
     * @private
     * @param {MouseEvent} event - Specifies mouse event
     * @returns {void}
     */
    public onMouseLeaveInternal = (event: MouseEvent): void => {
        event.preventDefault();
        const cursorPoint: Point = new Point(event.offsetX, event.offsetY);
        if (this.isMouseDown) {
            const viewerTop: number = this.viewerContainer.scrollTop;
            clearInterval(this.scrollMoveTimer);
            if (event.offsetY + viewerTop > viewerTop) {
                this.scrollMoveTimer = setInterval((): void => {
                    this.scrollForwardOnSelection(cursorPoint);
                }, 100);
            } else {
                this.scrollMoveTimer = setInterval((): void => {
                    this.scrollBackwardOnSelection(cursorPoint);
                }, 100);
            }
            if (this.isMouseEntered) {
                this.isMouseEntered = false;
            }
        }
        if (this.isDragStarted) {
            this.selection.hideCaret();
            if (this.scrollMoveTimer) {
                clearInterval(this.scrollMoveTimer);
                this.scrollMoveTimer = 0;
            }
        }
    };
    private scrollForwardOnSelection(cursorPoint: Point): void {
        if (this.viewerContainer) {
            this.viewerContainer.scrollTop = this.viewerContainer.scrollTop + 200;
            const touchPoint: Point = this.owner.viewer.findFocusedPage(cursorPoint, !this.owner.enableHeaderAndFooter);
            const textPosition: TextPosition = this.owner.selection.end;
            if (!this.owner.enableImageResizerMode || !this.owner.imageResizerModule.isImageResizerVisible
                || this.owner.imageResizerModule.isShapeResize) {
                this.skipScrollToPosition = true;
                this.owner.selection.moveTextPosition(touchPoint, textPosition, true);
            }
        }
    }

    private scrollBackwardOnSelection(cursorPoint: Point): void {
        this.viewerContainer.scrollTop = this.viewerContainer.scrollTop - 200;
        const touchPoint: Point = this.owner.viewer.findFocusedPage(cursorPoint, !this.owner.enableHeaderAndFooter);
        const textPosition: TextPosition = this.owner.selection.end;
        if (!this.owner.enableImageResizerMode || !this.owner.imageResizerModule.isImageResizerVisible
            || this.owner.imageResizerModule.isShapeResize) {
            this.skipScrollToPosition = true;
            this.owner.selection.moveTextPosition(touchPoint, textPosition, true);
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public onMouseEnterInternal = (event?: MouseEvent): void => {
        if (!this.isMouseEntered) {
            this.owner.viewer.updateScrollBars();
        }
        this.isMouseEntered = true;
        if (this.scrollMoveTimer) {
            clearInterval(this.scrollMoveTimer);
        }
        if(!this.isLeftButtonPressed(event) && this.isDragStarted) {
            if (!this.selection.caret.classList.contains("e-de-cursor-animation")) {
                this.selection.caret.classList.add("e-de-cursor-animation")
            }
            this.isDragStarted = false;
        }
        if (!this.isLeftButtonPressed(event) && this.isMouseDown) {
            this.onMouseUpInternal(event);
        }
    };



    /**
     * Fired on double tap.
     *
     * @private
     * @param {MouseEvent} event - Specifies mouse event.
     * @returns {void}
     */
    public onDoubleTap = (event: MouseEvent): void => {
        this.owner.focusIn();
        if (!isNullOrUndefined(event.target) && event.target !== this.viewerContainer) {
            return;
        }
        if (!isNullOrUndefined(this.selection)) {
            this.isTouchInput = false;
            const cursorPoint: Point = new Point(event.offsetX, event.offsetY);
            const touchPoint: Point = this.owner.viewer.findFocusedPage(cursorPoint, true);
            if (this.selection.checkAndEnableHeaderFooter(cursorPoint, this.owner.viewer.findFocusedPage(cursorPoint, true))) {
                return;
            }
            const widget: LineWidget = this.getLineWidget(touchPoint);
            let formField: FieldElementBox = this.selection.getHyperLinkFieldInCurrentSelection(widget, touchPoint, true);
            if (isNullOrUndefined(formField)) {
                formField = this.selection.getCurrentFormField();
            }
            if (!this.isDocumentProtected && this.owner.enableFormField) {
                const formatType: FormFieldType = this.selection.getFormFieldType(formField);
                if (formatType) {
                    if (formatType.toString() !== '') {
                        this.selection.selectField(formField);
                    }
                    switch (formatType) {
                        case 'Text':
                            this.owner.textFormFieldDialogModule.show();
                            break;
                        case 'CheckBox':
                            this.owner.checkBoxFormFieldDialogModule.show();
                            break;
                        case 'DropDown':
                            this.owner.dropDownFormFieldDialogModule.show();
                            break;
                    }
                }
            } else if (this.isDocumentProtected && formField && formField.formFieldData instanceof TextFormField
                && formField.formFieldData.type === 'Text') {
                this.selection.selectField();
            }
            const startPosition: TextPosition = this.selection.start.clone();
            const endPosition: TextPosition = this.selection.end.clone();
            const inlineObj: ElementInfo = startPosition.currentWidget.getInline(startPosition.offset, 0);
            const inline: ElementBox = inlineObj.element;
            if (this.owner.layoutType === 'Pages') {
                if (inline instanceof FootnoteElementBox) {
                    if (inline.footnoteType === 'Footnote') {
                        const footnotes: FootNoteWidget = this.currentPage.footnoteWidget;
                        let i: number;
                        for (i = 0; i <= footnotes.bodyWidgets.length; i++) {
                            const footnoteText: FootnoteElementBox = (footnotes.bodyWidgets[i]).footNoteReference;
                            if (inline.text === footnoteText.text) {
                                break;
                            }
                        }
                        startPosition.setPositionParagraph((footnotes.bodyWidgets[i].childWidgets[0] as BlockWidget).childWidgets[0] as LineWidget, 0);
                        endPosition.setPositionParagraph((footnotes.bodyWidgets[i].childWidgets[0] as BlockWidget).childWidgets[0] as LineWidget, 0);
                        this.selection.selectRange(startPosition, endPosition);
                    } else {
                        const endnotes: FootNoteWidget = this.pages[this.pages.length - 1].endnoteWidget;
                        let i: number;
                        if (!isNullOrUndefined(endnotes)) {
                            for (i = 0; i <= endnotes.childWidgets.length; i++) {
                                const endnoteText: FootnoteElementBox = (endnotes.bodyWidgets[i]).footNoteReference;
                                if (inline.text === endnoteText.text) {
                                    break;
                                }
                            }
                        }
                        startPosition.setPositionParagraph((endnotes.bodyWidgets[i].childWidgets[0] as BlockWidget).childWidgets[0] as LineWidget, 0);
                        endPosition.setPositionParagraph((endnotes.bodyWidgets[i].childWidgets[0] as BlockWidget).childWidgets[0] as LineWidget, 0);
                        this.selection.selectRange(startPosition, endPosition);
                    }
                } else {
                    if (inline instanceof TextElementBox && (this.selection.isinEndnote || this.selection.isinFootnote)) {
                        this.selection.footnoteReferenceElement(startPosition, endPosition, inline);
                    }
                }
            }
            if (this.selection.isEmpty && !isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.owner.selection.start)) {
                this.owner.selection.selectCurrentWord();
                this.selection.checkForCursorVisibility();
                this.tapCount = 2;
            }
        }
    };
    /**
     * Called on mouse up.
     *
     * @private
     * @param {MouseEvent} event - Specifies mouse event.
     * @return {void}
     */
    /* eslint-disable  */
    public onMouseUpInternal = (event: MouseEvent): void => {
        if (!isNullOrUndefined(event.target) && event.target !== this.viewerContainer) {
            return;
        }
        event.preventDefault();
        this.isListTextSelected = false;
        let cursorPoint: Point = new Point(event.offsetX, event.offsetY);
        let touchPoint: Point = this.owner.viewer.findFocusedPage(cursorPoint, true);
        if (!isNullOrUndefined(this.selection)) {
            let tapCount: number = 1;
            if (!Browser.isIE) {
                if (event.detail > 2) {
                    tapCount = event.detail;
                }
            } else {
                tapCount = this.tapCount;
            }
            if (this.isRowOrCellResizing) {
                this.owner.editorModule.tableResize.updateResizingHistory(touchPoint);
            }
            if (this.isMouseDown && !this.isSelectionChangedOnMouseMoved
                && !isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.owner.selection.start)
                && (!this.owner.enableImageResizerMode || !this.owner.imageResizerModule.isImageResizing)) {
                if (this.touchDownOnSelectionMark === 0 && !this.isRowOrCellResizing) {
                    let isShiftKeyPressed: boolean = event.shiftKey;
                    if(isShiftKeyPressed)
                    {
                        const textPosition: TextPosition = this.owner.selection.end;
                        this.owner.selection.moveTextPosition(touchPoint,textPosition); 
                    }
                    else
                    {
                        this.updateTextPositionForSelection(touchPoint, tapCount);
                    }
                    if (Browser.isIE && tapCount === 2) {
                        this.selection.checkAndEnableHeaderFooter(cursorPoint, touchPoint);
                    }
                }
                this.selection.checkForCursorVisibility();
                if (!isNullOrUndefined(this.currentSelectedComment) && this.owner.commentReviewPane
                    && !this.owner.commentReviewPane.commentPane.isEditMode) {
                    this.currentSelectedComment = undefined;
                }
            }
            let isCtrlkeyPressed: boolean = this.isIosDevice ? event.metaKey : event.ctrlKey;
            if (!isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.owner.selection.start)
                && (this.owner.selection.isEmpty || this.owner.selection.isImageSelected) &&
                (((isCtrlkeyPressed && this.owner.useCtrlClickToFollowHyperlink ||
                    !this.owner.useCtrlClickToFollowHyperlink) && this.isLeftButtonPressed(event) === true))) {
                this.selection.navigateHyperLinkOnEvent(touchPoint, false);
            }
            if (this.isMouseDown && this.isLeftButtonPressed(event) && this.isDocumentProtected
                && this.protectionType === 'FormFieldsOnly' && this.selection) {
                let widget: LineWidget = this.getLineWidget(touchPoint);
                let formField: FieldElementBox = this.selection.getHyperLinkFieldInCurrentSelection(widget, touchPoint, true);
                if (isNullOrUndefined(formField)) {
                    formField = this.selection.getCurrentFormField(true);
                }
                if (formField && formField.formFieldData && formField.formFieldData.enabled && !this.selection.isInlineFormFillMode(formField)) {
                    let data: FormFieldFillEventArgs = { 'fieldName': formField.formFieldData.name };
                    if (formField.formFieldData instanceof TextFormField) {
                        data.value = formField.resultText;
                    } else if (formField.formFieldData instanceof CheckBoxFormField) {
                        data.value = formField.formFieldData.checked;
                    } else {
                        data.value = (formField.formFieldData as DropDownFormField).selectedIndex;
                    }
                    data.isCanceled = false;
                    if(this.selection.previousSelectedFormField !== this.selection.getCurrentFormField()){
                        this.owner.trigger(beforeFormFieldFillEvent, data);
                    }
                    if (!data.isCanceled) {
                        if (this.owner.documentEditorSettings.formFieldSettings.formFillingMode === 'Popup' && !(formField.formFieldData instanceof CheckBoxFormField)
                            || (formField.formFieldData instanceof TextFormField && !(formField.formFieldData.type === 'Text'))
                            || formField.formFieldData instanceof DropDownFormField) {
                            this.formFillPopup.showPopUp(formField);
                        } else {
                            this.owner.editor.toggleCheckBoxFormField(formField);
                            data.value = (formField.formFieldData as CheckBoxFormField).checked;
                            data.isCanceled = false;
                            this.owner.trigger(afterFormFieldFillEvent, data);
                        }
                    }      
                }
                if (!formField && this.isFormFillProtectedMode) {
                    this.selection.navigateToNextFormField();
                }
            } else if (this.isMouseDown) {
                if (this.formFields.length > 0) {
                    let formField: FieldElementBox = this.selection.getCurrentFormField(true);
                    if (formField && formField.formFieldData instanceof TextFormField) {
                        this.selection.selectField();
                    } else if (this.isLeftButtonPressed(event) && formField && formField.formFieldData instanceof DropDownFormField) {
                        let offset: number = formField.line.getOffset(formField, 0);
                        let point: Point = this.selection.getPhysicalPositionInternal(formField.line, offset, false);
                        this.selection.selectInternal(formField.line, formField, 0, point);
                    }
                }
                if(this.isSelectionChangedOnMouseMoved){
                    this.selection.fireSelectionChanged(true);
                }
            }
            if (!this.owner.isReadOnlyMode && this.isSelectionInListText(touchPoint)) {
                this.selection.selectListText();
            }
            if (!this.owner.isReadOnlyMode && this.owner.enableImageResizerMode && this.owner.imageResizerModule.isImageResizing) {
                this.owner.imageResizerModule.mouseUpInternal();
                this.scrollToPosition(this.owner.selection.start, this.owner.selection.end);
                this.owner.imageResizerModule.isImageResizing = false;
            }
            if (this.owner.enableImageResizerMode && this.owner.imageResizerModule.isImageResizerVisible && !isNullOrUndefined(this.selection.caret)) {
                this.selection.caret.style.display = 'none';
            }
            if (this.isDragStarted) {
                this.moveSelectedContent();
            }
            if(this.isMouseDown) {
                this.updateFocus();
            }
            this.isMouseDownInSelection = false;
            this.isMouseDown = false;
            this.isFootnoteWidget = false;
            this.isSelectionChangedOnMouseMoved = false;
            this.isTouchInput = false;
            this.useTouchSelectionMark = true;
            this.isControlPressed = false;
            if (this.isListTextSelected) {
                this.selection.hideCaret();
            }
            if (this.owner.enableImageResizerMode) {
                let imageResizer: ImageResizer = this.owner.imageResizerModule;
                imageResizer.isImageResizing = false;
                imageResizer.isImageMoveToNextPage = false;
                imageResizer.leftValue = undefined;
                imageResizer.topValue = undefined;
            }
            this.isMouseDownInFooterRegion = false;
        }
        if (this.selection) {
            this.selection.isCellPrevSelected = false;
        }
    }
    private moveSelectedContent(): void {
        this.isDragStarted = false;
        let dropSelectionStartParaInfo: ParagraphInfo = this.selection.getParagraphInfo(this.selection.start);
        let dropSelectionEndParaInfo: ParagraphInfo = this.selection.getParagraphInfo(this.selection.end);
        let dropSelectionStartParaIndex: string = this.selection.getHierarchicalIndex(dropSelectionStartParaInfo.paragraph, dropSelectionStartParaInfo.offset.toString());
        let dropSelectionEndParaIndex: string = this.selection.getHierarchicalIndex(dropSelectionEndParaInfo.paragraph, dropSelectionEndParaInfo.offset.toString());
        let dropSelectionStartPos: TextPosition = this.selection.getTextPosBasedOnLogicalIndex(dropSelectionStartParaIndex);
        let dropSelectionEndPos: TextPosition = this.selection.getTextPosBasedOnLogicalIndex(dropSelectionEndParaIndex);
        let dragOnSelectionStartParaIndex: string = this.selection.getHierarchicalIndex(this.dragStartParaInfo.paragraph, this.dragStartParaInfo.offset.toString());
        let dragOnSelectionEndParaIndex: string = this.selection.getHierarchicalIndex(this.dragEndParaInfo.paragraph, this.dragEndParaInfo.offset.toString());
        let dragOnSelectionStartPos: TextPosition = this.selection.getTextPosBasedOnLogicalIndex(dragOnSelectionStartParaIndex);
        let dragOnSelectionEndPos: TextPosition = this.selection.getTextPosBasedOnLogicalIndex(dragOnSelectionEndParaIndex);
        if (dropSelectionStartPos.isExistBefore(dragOnSelectionStartPos)
            || dropSelectionEndPos.isExistAfter(dragOnSelectionEndPos)) {
            this.owner.editor.initComplexHistory('DragAndDropContent');
            this.selection.start = dragOnSelectionStartPos;
            this.selection.end = dragOnSelectionEndPos;
            let isEnableLocalPasteTrue: boolean = this.owner.enableLocalPaste;
            if (!isEnableLocalPasteTrue) {
                this.owner.enableLocalPaste = true;
            }
            let dropExtraOffset: number = this.dragEndParaInfo.paragraph.getLength();
            let hasNewLineChar: boolean = false;
            if (dropExtraOffset < this.dragEndParaInfo.offset
                || !this.dragStartParaInfo.paragraph.equals(this.dragEndParaInfo.paragraph)) {
                hasNewLineChar = true;
            }
            this.owner.editor.cut();
            if (this.dragEndParaInfo.paragraph.equals(dropSelectionStartParaInfo.paragraph)
                && this.dragEndParaInfo.offset < dropSelectionStartParaInfo.offset
                && !this.owner.enableTrackChanges) {
                dropExtraOffset -= this.dragEndParaInfo.paragraph.getLength();
                dropSelectionStartParaInfo.offset -= dropExtraOffset;
                dropSelectionEndParaInfo.offset -= dropExtraOffset;
                dropSelectionStartParaIndex = this.selection.getHierarchicalIndex(dropSelectionStartParaInfo.paragraph, dropSelectionStartParaInfo.offset.toString());
                dropSelectionEndParaIndex = this.selection.getHierarchicalIndex(dropSelectionEndParaInfo.paragraph, dropSelectionEndParaInfo.offset.toString());
            }
            if (!hasNewLineChar || !this.dragEndParaInfo.paragraph.equals(dropSelectionEndParaInfo.paragraph)) {
                dropSelectionStartParaIndex = this.selection.getHierarchicalIndex(dropSelectionStartParaInfo.paragraph, dropSelectionStartParaInfo.offset.toString());
                dropSelectionEndParaIndex = this.selection.getHierarchicalIndex(dropSelectionEndParaInfo.paragraph, dropSelectionEndParaInfo.offset.toString());
            }
            dropSelectionStartPos = this.selection.getTextPosBasedOnLogicalIndex(dropSelectionStartParaIndex);
            dropSelectionEndPos = this.selection.getTextPosBasedOnLogicalIndex(dropSelectionEndParaIndex);
            this.selection.start = dropSelectionStartPos;
            this.selection.end = dropSelectionEndPos;
            this.owner.editor.copiedTextContent = '';
            this.owner.editor.paste();
            if (!isEnableLocalPasteTrue) {
                this.owner.enableLocalPaste = false;
            }
            this.owner.editorHistory.updateComplexHistory();
        } else {
            this.owner.selection.selectPosition(dragOnSelectionStartPos, dragOnSelectionEndPos);
        }
        this.dragStartParaInfo = undefined;
        this.dragEndParaInfo = undefined;
        this.selection.caret.classList.add("e-de-cursor-animation");
    }
    private isSelectionInListText(cursorPoint: Point): boolean {
        let widget: LineWidget = this.getLineWidget(cursorPoint);
        if (!isNullOrUndefined(widget) && widget.children[0] instanceof ListTextElementBox) {
            let left: number = this.getLeftValue(widget);
            let width: number = widget.children[0].width;
            let height: number = widget.children[0].height;
            if (this.isInsideRect(left, widget.paragraph.y, width, height, cursorPoint)) {
                this.selectionLineWidget = widget;
                return true;
            }
        }
        return false;
    }
    public isInShapeBorder(floatElement: ShapeBase, cursorPoint: Point): boolean {
        if (!isNullOrUndefined(floatElement)) {
            let width: number = floatElement.width;
            let height: number = floatElement.height;
            if (this.isInsideRect(floatElement.x - floatElement.margin.left, floatElement.y - floatElement.margin.top, width, height, cursorPoint)) {
                // this.selectionLineWidget = this.getLineWidget(cursorPoint);
                if (floatElement instanceof ImageElementBox) {
                    return true;
                } else if (floatElement instanceof ShapeElementBox) {
                    let lineWidth: number = floatElement.lineFormat.weight;
                    if (!(this.isInsideRect(floatElement.x + lineWidth, floatElement.y + lineWidth + floatElement.textFrame.marginTop,
                        width - (lineWidth * 2), height - ((lineWidth * 2) + floatElement.textFrame.marginTop + floatElement.textFrame.marginBottom), cursorPoint))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     * Check whether touch point is inside the rectangle or not.
     * 
     * @private
     * @param {number} x - Specifies left position.
     * @param {number} y - Specifies top position.
     * @param {number} width - Specifies width.
     * @param {number} height - Specifies height
     * @param {Point} touchPoint - Specifies the point to check.
     * @returns {boolean} - Return true if points intersect.
     */
    public isInsideRect(x: number, y: number, width: number, height: number, touchPoint: Point): boolean {
        if ((touchPoint.x > x && touchPoint.x <= x + width) && (touchPoint.y > y && touchPoint.y <= y + height)) {
            return true;
        }
        return false;
    }
    public getLeftValue(widget: LineWidget): number {
        let left: number = widget.paragraph.x;
        let paragraphFormat: WParagraphFormat = (widget.paragraph as ParagraphWidget).paragraphFormat;
        if (this.selection.isParagraphFirstLine(widget)) {
            if (paragraphFormat.textAlignment === 'Right') {
                left -= HelperMethods.convertPointToPixel(paragraphFormat.firstLineIndent);
                left -= HelperMethods.convertPointToPixel(paragraphFormat.leftIndent);
            } else {
                left += HelperMethods.convertPointToPixel(paragraphFormat.firstLineIndent);
            }
        }
        let element: ElementBox = widget.children[0];
        if (element instanceof ListTextElementBox) {
            left += element.margin.left;
        }
        return left;
    }
    /**
     * Checks whether left mouse button is pressed or not.
     * 
     * @param {MouseEvent} event - Specifies mouse event.
     * @returns {boolean} - Returns true if left mouse button is clicked.
     */
    private isLeftButtonPressed(event: MouseEvent): boolean {
        this.isTouchInput = false;
        let button: number = event.which || event.button;
        return button === 1;
    }
    /**
     * Fired on touch start.
     * 
     * @private
     * @param {TouchEvent} event - Specifies touch event.
     * @returns {void}
     */
    public onTouchStartInternal = (event: Event): void => {
        if (this.selection) {
            this.isTouchMoved = false;
            this.isCompositionStart = false;
            this.isCompositionEnd = false;
            this.isCompositionUpdated = false;
            this.isCompositionCanceled = true;
            this.isTouchInput = true;
            if (this.isTimerStarted) {
                if (this.tapCount === 1) {
                    this.tapCount = 2;
                } else {
                    this.tapCount = 3;
                    this.isTimerStarted = false;
                }
            } else {
                this.isTimerStarted = true;
                this.tapCount = 1;
            }
            if ((event as TouchEvent).touches.length === 1) {
                this.zoomX = (event as TouchEvent).touches[0].clientX;
                this.zoomY = (event as TouchEvent).touches[0].clientY;
                if (this.owner.selection.isEmpty) {
                    this.useTouchSelectionMark = false;
                }
                this.isMouseDown = true;
                this.isSelectionChangedOnMouseMoved = false;
                let point: Point;
                if (this.isMouseDown) {
                    point = this.getTouchOffsetValue(event as TouchEvent);
                }
                point = this.owner.viewer.findFocusedPage(point, true, true);
                if (this.owner.enableImageResizerMode) {
                    let resizeObj: ImagePointInfo = this.owner.imageResizerModule.getImagePointOnTouch(point);
                    this.owner.imageResizerModule.selectedResizeElement = resizeObj.selectedElement;
                }
                if (this.owner.enableImageResizerMode && !isNullOrUndefined(this.owner.imageResizerModule.selectedResizeElement)) {
                    this.owner.imageResizerModule.isImageResizing = true;
                }
                let x: number = this.owner.selection.end.location.x;
                let y: number = this.selection.getCaretBottom(this.owner.selection.end, this.owner.selection.isEmpty) + 9;
                //TouchDownOnSelectionMark will be 2 when touch end is pressed
                this.touchDownOnSelectionMark = ((point.y <= y && point.y >= y - 20 || point.y >= y && point.y <= y + 20)
                    && (point.x <= x && point.x >= x - 20 || point.x >= x && point.x <= x + 20)) ? 1 : 0;
                if (!this.owner.selection.isEmpty && this.touchDownOnSelectionMark === 0) {
                    x = this.owner.selection.start.location.x;
                    y = this.selection.getCaretBottom(this.owner.selection.start, false) + 9;
                    //TouchDownOnSelectionMark will be 1 when touch start is pressed
                    this.touchDownOnSelectionMark = ((point.y <= y && point.y >= y - 20 || point.y >= y && point.y <= y + 20)
                        && (point.x <= x && point.x >= x - 20 || point.x >= x && point.x <= x + 20)) ? 2 : 0;
                }
            }
            if (!isNullOrUndefined(this.owner.contextMenuModule) && this.owner.contextMenuModule.contextMenuInstance) {
                this.owner.contextMenuModule.contextMenuInstance.close();
            }
            if (this.touchDownOnSelectionMark || (event as TouchEvent).touches.length > 1) {
                event.preventDefault();
            }
            this.longTouchTimer = setTimeout(this.onLongTouch, 500, event as TouchEvent);
            this.timer = setTimeout((): void => {
                this.isTimerStarted = false;
            }, 200);
            this.owner.focusIn();
        }
    }
    /**
     * Fired on long touch
     * 
     * @private
     * @param {TouchEvent} event - Specifies touch event.
     * @returns {void}
     */
    public onLongTouch = (event: TouchEvent): void => {
        if (isNullOrUndefined(this.owner) || isNullOrUndefined(this.viewerContainer) || this.isTouchMoved || event.touches.length !== 1) {
            return;
        }
        let point: Point = this.getTouchOffsetValue(event);
        let pointRelToPage: Point = this.owner.viewer.findFocusedPage(point, true);
        let selStart: TextPosition = this.selection.start;
        let selEnd: TextPosition = this.selection.end;
        let updateSel: boolean = false;
        if (!this.selection.isForward) {
            selStart = this.selection.end;
            selEnd = this.selection.start;
        }
        let selStartPt: Point = selStart.location;
        let selEndPt: Point = selEnd.location;
        if (selStart.currentWidget !== selEnd.currentWidget) {
            updateSel = !(pointRelToPage.x >= selStartPt.x && pointRelToPage.x <= selEndPt.x)
                && !(pointRelToPage.y >= selStartPt.y && pointRelToPage.y <= selEndPt.y);
        } else {
            updateSel = !(pointRelToPage.x >= selStartPt.x && pointRelToPage.x <= selEndPt.x)
                || !(pointRelToPage.y >= selStartPt.y && pointRelToPage.y <= selEndPt.y);
        }
        if (event.changedTouches.length === 1 && updateSel) {
            this.updateSelectionOnTouch(point, pointRelToPage);
            this.isMouseDown = false;
            this.touchDownOnSelectionMark = 0;
            this.useTouchSelectionMark = true;
            this.isSelectionChangedOnMouseMoved = false;
        }
        if (this.selection.isEmpty) {
            this.selection.selectCurrentWord();
        }
        if (!isNullOrUndefined(this.owner.contextMenuModule) && this.owner.contextMenuModule.contextMenuInstance) {
            this.owner.contextMenuModule.onContextMenuInternal(event);
        }
    }
    /**
     * 
     * @private
     * @param {TouchEvent} event - Specifies touch event.
     * @returns {void}
     */
    public onTouchMoveInternal = (event: TouchEvent): void => {
        this.isTouchMoved = true;
        let touch: TouchList = (event as TouchEvent).touches;
        let cursorPoint: Point;
        if (!isNullOrUndefined(this.selection)) {
            if (this.owner.editorModule && this.owner.enableImageResizerMode && this.owner.imageResizerModule.isImageResizing) {
                event.preventDefault();
                if (!this.owner.imageResizerModule.isImageMoveToNextPage) {
                    this.owner.imageResizerModule.handleImageResizingOnTouch(event);
                    this.selection.caret.style.display = 'none';
                }
                return;
            }
            if (this.isMouseDown) {
                cursorPoint = this.getTouchOffsetValue(event);
                let touchPoint: Point = this.owner.viewer.findFocusedPage(cursorPoint, true);
                if (this.touchDownOnSelectionMark > 0 /*|| !this.useTouchSelectionMark*/) {
                    this.isCompleted = false;
                    event.preventDefault();
                    let touchY: number = touchPoint.y;
                    let textPosition: TextPosition = this.owner.selection.end;
                    let touchPointer: Point;
                    if (touchPoint.y <= 26) {
                        touchY -= touchPoint.y < 0 ? 0 : touchPoint.y + 0.5;
                    } else {
                        touchY -= 36.5;
                    }
                    textPosition = this.touchDownOnSelectionMark === 2 ? this.selection.start : this.selection.end;
                    touchPoint = new Point(touchPoint.x, touchY);
                    this.owner.selection.moveTextPosition(touchPoint, textPosition);
                    this.isSelectionChangedOnMouseMoved = true;
                }
                this.selection.checkForCursorVisibility();
                this.updateTouchMarkPosition();
            }
        }
        if (touch.length > 1) {
            event.preventDefault();
            this.isMouseDown = false;
            this.zoomX = (touch[0].clientX + touch[1].clientX) / 2;
            this.zoomY = (touch[0].clientY + touch[1].clientY) / 2;
            let currentDiff: number = Math.sqrt(Math.pow((touch[0].clientX - touch[1].clientX), 2) + Math.pow((touch[0].clientY - touch[1].clientY), 2));
            if (this.preDifference > -1) {
                if (currentDiff > this.preDifference) {
                    this.onPinchOutInternal(event);
                } else if (currentDiff < this.preDifference) {
                    this.onPinchInInternal(event);
                }
            } else if (this.zoomFactor < 2) {
                if (this.preDifference !== -1) {
                    if (currentDiff > this.preDifference) {
                        this.onPinchInInternal(event);
                    }
                }
            } else if (this.preDifference === -1) {
                if (this.zoomFactor > 2) {
                    if (currentDiff > this.preDifference) {
                        this.onPinchInInternal(event);
                    }
                }
            }
            this.preDifference = currentDiff;
        }
        if (this.longTouchTimer) {
            clearTimeout(this.longTouchTimer);
            this.longTouchTimer = undefined;
        }
    }
    /**
     * Fired on touch up.
     * 
     * @private
     * @param {TouchEvent} event - Specifies touch event.
     * @returns {void}
     */
    public onTouchUpInternal = (event: TouchEvent): void => {
        if (!isNullOrUndefined(this.selection)) {
            let point: Point = this.getTouchOffsetValue(event);
            let touchPoint: Point = this.owner.viewer.findFocusedPage(point, true);
            if (event.changedTouches.length === 1) {
                if (!this.isTouchMoved || (this.owner.enableImageResizerMode && this.owner.imageResizerModule.isImageResizing)) {
                    this.updateSelectionOnTouch(point, touchPoint);
                    if (!isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.selection.start)
                        && !this.isSelectionChangedOnMouseMoved && (this.selection.isEmpty ||
                            this.selection.isImageField() && (!this.owner.enableImageResizerMode ||
                                this.owner.enableImageResizerMode && !this.owner.imageResizerModule.isImageResizing))) {
                        this.selection.navigateHyperLinkOnEvent(touchPoint, true);
                    }
                }
                if(this.isSelectionChangedOnMouseMoved){
                    this.selection.fireSelectionChanged(true);
                }
                this.isMouseDown = false;
                this.touchDownOnSelectionMark = 0;
                this.useTouchSelectionMark = true;
                this.isSelectionChangedOnMouseMoved = false;
            }
            if (this.owner.enableImageResizerMode && this.owner.imageResizerModule.isImageResizing) {
                this.owner.imageResizerModule.mouseUpInternal();
                this.owner.imageResizerModule.isImageResizing = false;
                this.owner.imageResizerModule.isImageMoveToNextPage = false;
                this.scrollToPosition(this.owner.selection.start, this.owner.selection.end);
            }

            if (this.owner.enableImageResizerMode && this.owner.imageResizerModule.isImageResizerVisible && this.isTouchInput) {
                this.touchStart.style.display = 'none';
                this.touchEnd.style.display = 'none';
            }
            // if (!this.owner.isReadOnlyMode && this.isSelectionInListText(touchPoint)) {
            //     this.selection.selectListText();
            // }
            event.preventDefault();
        }
        this.preDifference = -1;
        this.isTouchInput = false;
        if (this.longTouchTimer) {
            clearTimeout(this.longTouchTimer);
            this.longTouchTimer = undefined;
        }
        if (!this.isTimerStarted) {
            this.tapCount = 1;
        }
        if (this.isListTextSelected) {
            this.selection.hideCaret();
        }
        this.owner.focusIn();
    }

    private updateSelectionOnTouch(point: Point, touchPoint: Point): void {
        this.zoomX = undefined;
        this.zoomY = undefined;
        if (this.isMouseDown && !this.isSelectionChangedOnMouseMoved && !isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.owner.selection.start)) {
            if (!isNullOrUndefined(this.currentSelectedComment) && this.owner.commentReviewPane
                && !this.owner.commentReviewPane.commentPane.isEditMode) {
                this.currentSelectedComment = undefined;
            }
            if (this.touchDownOnSelectionMark === 0) {
                this.updateTextPositionForSelection(new Point(touchPoint.x, touchPoint.y), this.tapCount);
                if (this.tapCount === 2) {
                    this.selection.checkAndEnableHeaderFooter(point, touchPoint);
                }
            }
            if (this.owner.selection.isEmpty) {
                this.selection.updateCaretPosition();
            }
            this.selection.checkForCursorVisibility();
        }
    }
    /**
     * Gets touch offset value.
     * 
     * @private
     * @param {TouchEvent} event - Specifies touch event
     * @returns {Point}  - Returns modified touch offset
     */
    public getTouchOffsetValue(event: TouchEvent): Point {
        let targetElement: HTMLElement = this.viewerContainer as HTMLElement;
        let offset: ClientRect = targetElement.getBoundingClientRect();
        let touchOffsetValues: Touch = event.touches[0];
        if (isNullOrUndefined(touchOffsetValues)) {
            touchOffsetValues = event.changedTouches[0];
        }
        let offsetX: number = touchOffsetValues.pageX - offset.left;
        let offsetY: number = touchOffsetValues.pageY - offset.top;
        return new Point(offsetX, offsetY);
    }
    /**
     * Fired on pinch zoom in.
     * 
     * @private
     * @param {TouchEvent} event - Specifies touch event
     * @returns {void}
     */
    public onPinchInInternal(event: TouchEvent): void {
        this.preZoomFactor = this.zoomFactor;
        let updatedZoomFactor: number = this.zoomFactor - 0.01;
        if (updatedZoomFactor < 5 && updatedZoomFactor > 2) {
            updatedZoomFactor = updatedZoomFactor - 0.01;
        }
        if (updatedZoomFactor < 0.1) {
            updatedZoomFactor = 0.1;
        }
        this.zoomFactor = updatedZoomFactor;
    }

    private onPinchOutInternal(event: TouchEvent): void {
        this.preZoomFactor = this.zoomFactor;
        let updatedZoomFactor: number = this.zoomFactor + 0.01;
        if (updatedZoomFactor > 2) {
            updatedZoomFactor = updatedZoomFactor + 0.01;
        }
        if (updatedZoomFactor > 5) {
            updatedZoomFactor = 5;
        }
        this.zoomFactor = updatedZoomFactor;
    }
    public getPageWidth(page: Page): number {
        let width: number = page.boundingRectangle.width;
        return width;
    }

    /**
     * Removes specified page.
     * @private
     * @param {Page} page - Specifies page to remove
     * @returns {void}
     */
    public removePage(page: Page): void {
        if (this.currentPage === page) {
            this.currentPage = undefined;
        }
        if (page.headerWidgetIn) {
            page.headerWidgetIn.page = undefined;
        }
        if (page.footerWidgetIn) {
            page.footerWidgetIn.page = undefined;
        }
        let index: number = this.pages.indexOf(page);
        // if (index > -1) {
        this.pages.splice(index, 1);
        // }        
        //this.removeRenderedPages();
        if (!isNullOrUndefined((this.owner.viewer as PageLayoutViewer).visiblePages)) {
            if (((this.owner.viewer as PageLayoutViewer).visiblePages).indexOf(page) > -1) {
                let pageIndex: number = ((this.owner.viewer as PageLayoutViewer).visiblePages).indexOf(page);
                ((this.owner.viewer as PageLayoutViewer).visiblePages).splice(pageIndex, 1);
            }
        }
        //(viewer as PageLayoutViewer).visiblePages.remove(page);
        let height: number = 0;
        for (let i: number = 0; i < this.pages.length; i++) {
            height = height + this.pages[i].boundingRectangle.height;
        }
        //Updates the vertical height.
        height -= page.boundingRectangle.height + 20;
        //ToDo:Update horizontal width, if removed page has max width.
        let top: number = 20;
        if (index > 0) {
            top += this.pages[index - 1].boundingRectangle.bottom;
        }
        if (index !== -1) {
            for (let i: number = index; i < this.pages.length; i++) {
                //Update bounding rectangle of next pages in collection.
                page = this.pages[i];
                page.boundingRectangle = new Rect(page.boundingRectangle.x, top, page.boundingRectangle.width, page.boundingRectangle.height);
                top = page.boundingRectangle.bottom + 20;
                if (!isNullOrUndefined(page.bodyWidgets[0].firstChild) && !(page.bodyWidgets[0].firstChild instanceof TableWidget && page.bodyWidgets[0].firstChild.header)) {
                    page.repeatHeaderRowTableWidget = false;
                }
            }
        }
    }
    // private removeRenderedPages(): void {
    //     for (let i: number = 0; i < this.pages.length; i++) {
    //         this.clearContainer(this.pages[i]);
    //     }
    // }

    /**
     * Updates viewer size on window resize.
     * 
     * @private
     * @returns {void}
     */
    public updateViewerSize(): void {
        let element: HTMLElement = this.owner.getDocumentEditorElement();
        this.updateViewerSizeInternal(element);
        this.owner.viewer.updateScrollBars();
        if (this.owner.viewer instanceof WebLayoutViewer && (!isNullOrUndefined(this.owner)) && (!isNullOrUndefined(element))) {
            if (this.resizerTimer) {
                clearTimeout(this.resizerTimer);
            }
            /* eslint-disable @typescript-eslint/indent */
            this.resizerTimer = setTimeout((): void => {
                if (!isNullOrUndefined(this.owner)) {
                    let currentVisibleWidth: number;
                    if (!isNullOrUndefined(this.visibleBounds)) {
                        currentVisibleWidth = this.visibleBounds.width;
                    } else {
                        currentVisibleWidth = 0;
                    }
                    if (isNullOrUndefined(this.owner.viewer.preVisibleWidth)) {
                        this.owner.viewer.preVisibleWidth = 0;
                    }
                    if ((!isNullOrUndefined(this.visibleBounds) && (currentVisibleWidth !== this.owner.viewer.preVisibleWidth))) {
                        this.owner.editorModule.layoutWholeDocument();
                        this.owner.viewer.preVisibleWidth = currentVisibleWidth;
                    }
                    if (this.resizerTimer) {
                        clearTimeout(this.resizerTimer);
                    }
                }
            }, 50);
        }
        if (!isNullOrUndefined(this.selection)) {
            this.selection.updateCaretPosition();
        }
    }

    /**
     * @private
     */
    public triggerAutoResizeInterval(): void {
        let timer: number = 0;
        let element: HTMLElement = this.owner.element;
        let args: AutoResizeEventArgs = { cancel: false }
        this.owner.notify(beforeAutoResize, args);
        if (!isNullOrUndefined(args.element)) {
            element = args.element;
        }
        element.style.visibility = 'hidden';
        showSpinner(element);
        let counter: number = 0;
        let internal: number = this.owner.documentEditorSettings.autoResizeSettings.interval;
        if (this.isAutoResizeCanStart) {
            timer = setInterval(() => {
                counter++;
                let tempRect: ClientRect = this.owner.element.getBoundingClientRect();
                if (tempRect.width !== 0 && tempRect.height !== 0) {
                    this.isAutoResizeCanStart = false;
                    let args: AutoResizeEventArgs = { cancel : false }
                    this.owner.notify(internalAutoResize, args);
                    clearInterval(timer);
                    if (!args.cancel) {
                        this.owner.resize();
                    }
                    hideSpinner(element);
                    element.style.visibility = 'visible';
                } else if (counter > this.owner.documentEditorSettings.autoResizeSettings.iterationCount) {
                    clearInterval(timer);
                    hideSpinner(element);
                    element.style.visibility = 'visible';
                }
            }, internal);
        } else {
            hideSpinner(element);
            element.style.visibility = 'visible';
        }
    }

    private updateViewerSizeInternal(element: HTMLElement): void {
        if (!isNullOrUndefined(element)) {
            let rect = element.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) {
                this.isAutoResizeCanStart = true;
            } else {
                this.isAutoResizeCanStart = false;
            }       
            let width: number = 0;
            let height: number = 0;
            height = rect.height > 0 ? rect.height : 200;
            let restrictPaneRect: ClientRect = this.restrictEditingPane && this.restrictEditingPane.isShowRestrictPane ?
                this.restrictEditingPane.restrictPane.getBoundingClientRect() : undefined;
            let optionsRect: ClientRect = this.owner.optionsPaneModule && this.owner.optionsPaneModule.isOptionsPaneShow ?
                this.owner.optionsPaneModule.optionsPane.getBoundingClientRect() : undefined;
            let commentPane: ClientRect = this.owner.commentReviewPane && this.owner.commentReviewPane.parentPaneElement ?
                this.owner.commentReviewPane.parentPaneElement.getBoundingClientRect() : undefined;
            if (restrictPaneRect || optionsRect || commentPane) {
                let paneWidth: number = restrictPaneRect ? restrictPaneRect.width : 0;
                paneWidth += optionsRect ? optionsRect.width : 0;
                paneWidth += commentPane ? commentPane.width : 0;
                width = (rect.width - paneWidth) > 0 ? (rect.width - paneWidth) : 200;
            } else {
                width = rect.width > 0 ? rect.width : 200;
            }
            this.viewerContainer.style.height = height.toString() + 'px';
            this.viewerContainer.style.width = Math.ceil(width) + 'px';
            this.visibleBoundsIn = new Rect(0, 0, width, height);
            this.containerCanvas.width = width;
            this.containerCanvas.height = height;
            this.selectionCanvas.width = width;
            this.selectionCanvas.height = height;
            this.measureScrollbarWidth(element);
        }
    }
    /**
     * Inserts page in specified index.
     * 
     * @private
     * @param {number} index - Specifes index to insert page
     * @param {Page} page - Page to insert.
     * @returns {void}
     */
    public insertPage(index: number, page: Page): void {
        if (this.pages.indexOf(page) > -1) {
            this.pages.splice(this.pages.indexOf(page), 1);
        }
        this.pages.splice(index, 0, page);
        let top: number = 20;
        if (index > 0) {
            top += this.pages[index - 1].boundingRectangle.bottom;
        }
        for (let i: number = index; i < this.pages.length; i++) {
            //Update bounding rectangle of next pages in collection.
            page = this.pages[i];
            page.boundingRectangle = new Rect(page.boundingRectangle.x, top, page.boundingRectangle.width, page.boundingRectangle.height);
            top = page.boundingRectangle.bottom + 20;
        }
    }

    public updateTextPositionForSelection(cursorPoint: Point, tapCount: number): void {
        let widget: LineWidget = this.getLineWidget(cursorPoint);
        if (!isNullOrUndefined(widget)) {
            this.selection.updateTextPosition(widget, cursorPoint);
        }

        if (tapCount > 1) {
            this.isMouseDown = false;
            this.useTouchSelectionMark = false;
            if (this.pages.length === 0) {
                return;
            }
            //Double tap/triple tap selection
            if (!isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.owner.selection.start)) {
                if (tapCount % 2 === 0) {
                    this.owner.selection.selectCurrentWord();
                } else {
                    this.owner.selection.selectParagraph();
                }
            }
        }
    }
    public scrollToPosition(startPosition: TextPosition, endPosition: TextPosition, skipCursorUpdate?: boolean, isBookmark?: boolean): void {
        if (this.skipScrollToPosition || this.isWebPrinting || (this.owner.editor && this.owner.editor.isRemoteAction)) {
            this.skipScrollToPosition = false;
            return;
        }
        if (this.owner.enableImageResizerMode && this.owner.imageResizerModule.isImageResizing
            || this.isMouseDownInFooterRegion || this.isRowOrCellResizing) {
            return;
        }
        let lineWidget: LineWidget = this.selection.getLineWidgetInternal(endPosition.currentWidget, endPosition.offset, true);
        if (isNullOrUndefined(lineWidget)) {
            return;
        }
        let top: number = this.selection.getTop(lineWidget);
        if (this.isMouseDown) {
            let prevLineWidget: LineWidget = this.selection.getLineWidgetInternal(endPosition.currentWidget, endPosition.offset, false);
            let prevTop: number = this.selection.getTop(prevLineWidget);
            if (prevLineWidget !== lineWidget && endPosition.location.y >= prevTop) {
                lineWidget = prevLineWidget;
            }
        }
        let height: number = lineWidget.height;
        //Gets current page.
        let endPage: Page = this.selection.getPage(lineWidget.paragraph);
        this.currentPage = endPage;
        let x: number = 0;
        let y: number = 0;
        let horizontalWidth: number = 0;
        let isPageLayout: boolean = this.owner.viewer instanceof PageLayoutViewer;
        let pageLayout: PageLayoutViewer = this.owner.viewer as PageLayoutViewer;
        if (isNullOrUndefined(endPage)) {
            return;
        }
        let pageWidth: number = endPage.boundingRectangle.width;
        x = (this.visibleBounds.width - pageWidth * this.zoomFactor) / 2;
        if (x < 30) {
            x = 30;
        }
        y = endPage.boundingRectangle.y * this.zoomFactor + (this.pages.indexOf(endPage) + 1) * (this.owner.viewer as PageLayoutViewer).pageGap * (1 - this.zoomFactor);
        let scrollTop: number = this.owner.viewer.containerTop;
        let scrollLeft: number = this.owner.viewer.containerLeft;
        let pageHeight: number = this.visibleBounds.height;
        let caretInfo: CaretHeightInfo = this.selection.updateCaretSize(this.owner.selection.end, true);
        let topMargin: number = caretInfo.topMargin;
        let caretHeight: number = caretInfo.height;
        x += (endPosition.location.x) * this.zoomFactor;
        y += (endPosition.location.y + topMargin) * this.zoomFactor;
        if (!isBookmark) {
            //vertical scroll bar update
            if ((scrollTop + 20) > y) {
                this.viewerContainer.scrollTop = (y - 10);
            } else if (scrollTop + pageHeight < y + caretHeight) {
                this.viewerContainer.scrollTop = y + caretHeight - pageHeight + 10;
            }
        } else {
            // As per MS Word behaviour, update vertical scroll bar using static value while navigate bookmark
            this.viewerContainer.scrollTop = y - 96;
        }
        if (!skipCursorUpdate) {
            this.selection.updateCaretToPage(startPosition, endPage);
        }

        let scrollBarWidth: number = this.viewerContainer.offsetWidth - this.viewerContainer.clientWidth;
        if (scrollLeft > x) {
            this.viewerContainer.scrollLeft = x - (this.pageContainer.offsetWidth / 100) * 20;
        } else if (scrollLeft + this.visibleBounds.width < x + scrollBarWidth) {
            this.viewerContainer.scrollLeft = scrollLeft + (this.pageContainer.offsetWidth / 100) * 15 + scrollBarWidth;
            while (x < this.owner.viewer.containerWidth && this.viewerContainer.scrollLeft + this.visibleBounds.width < x + scrollBarWidth) {
                this.viewerContainer.scrollLeft = this.viewerContainer.scrollLeft + (this.pageContainer.offsetWidth / 100) * 15 + scrollBarWidth;
            }
        }
    }
    public getLineWidget(cursorPoint: Point): LineWidget {
        return this.getLineWidgetInternal(cursorPoint, false);
    }
    public getLineWidgetInternal(cursorPoint: Point, isMouseDragged: boolean): LineWidget {
        let widget: LineWidget = undefined;
        if (!isNullOrUndefined(this.currentPage)) {
            let childWidgets: Widget;
            if (this.owner.enableHeaderAndFooter) {
                let page: Page = this.currentPage;
                let pageBottom: number = page.boundingRectangle.height;
                let headerHeight: number = Math.max((page.headerWidget.y + page.headerWidget.height),
                    HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.topMargin)) * this.zoomFactor;
                let footerDistance: number = HelperMethods.convertPointToPixel(page.bodyWidgets[0].sectionFormat.footerDistance);
                let footerHeight: number = (page.boundingRectangle.height -
                    Math.max(page.footerWidget.height + footerDistance, footerDistance * 2));
                if (isMouseDragged) {
                    if (this.isBlockInHeader(this.selection.start.paragraph)) {
                        childWidgets = this.currentPage.headerWidget;
                    } else {
                        childWidgets = this.currentPage.footerWidget;
                    }
                } else {
                    if (cursorPoint.y <= pageBottom && cursorPoint.y >= footerHeight) {
                        childWidgets = this.currentPage.footerWidget;
                    } else if ((cursorPoint.y) >= 0 && (cursorPoint.y) <= headerHeight) {
                        childWidgets = this.currentPage.headerWidget;
                    }
                }
                if (isNullOrUndefined(childWidgets)) {
                    return undefined;
                }
                let shapeElementInfo: ShapeInfo = this.checkFloatingItems(childWidgets as BlockContainer, cursorPoint, isMouseDragged);
                if (shapeElementInfo.isShapeSelected) {
                    if (shapeElementInfo.isInShapeBorder) {
                        return shapeElementInfo.element.line;
                    }
                    return this.selection.getLineWidgetBodyWidget((shapeElementInfo.element as ShapeElementBox).textFrame, cursorPoint);
                } else {
                    return this.selection.getLineWidgetBodyWidget(childWidgets, cursorPoint);
                }
            } else {
                let shapeInfo: ShapeInfo = this.checkFloatingItems(this.currentPage.bodyWidgets[0], cursorPoint, isMouseDragged, false);
                let behindShapeInfo: ShapeInfo = this.checkFloatingItems(this.currentPage.bodyWidgets[0], cursorPoint, isMouseDragged, true);
                if (shapeInfo.isShapeSelected && !this.isEmptyShape(shapeInfo)) {
                    if (shapeInfo.isInShapeBorder) {
                        return shapeInfo.element.line;
                    }
                    if (shapeInfo.element instanceof ShapeElementBox) {
                        widget = this.selection.getLineWidgetBodyWidget((shapeInfo.element as ShapeElementBox).textFrame, cursorPoint);
                    }
                } else if (isMouseDragged && this.isFootnoteWidget) {
                    if (this.selection.start.paragraph.bodyWidget.footNoteReference !== undefined && this.selection.start.paragraph.bodyWidget.containerWidget instanceof FootNoteWidget && this.selection.start.paragraph.bodyWidget.containerWidget.footNoteType === 'Footnote') {
                        return this.selection.getLineWidgetBodyWidget(this.currentPage.footnoteWidget, cursorPoint);
                    } else if (this.selection.start.paragraph.bodyWidget.footNoteReference !== undefined &&
                        this.selection.start.paragraph.bodyWidget.containerWidget instanceof FootNoteWidget
                        && this.selection.start.paragraph.bodyWidget.containerWidget.footNoteType === 'Endnote') {
                        return this.selection.getLineWidgetBodyWidget(this.currentPage.endnoteWidget, cursorPoint);
                    }
                } else {
                    if (!isMouseDragged && this.currentPage.footnoteWidget && this.isInFootnoteWidget(this.currentPage.footnoteWidget, cursorPoint)) {
                        widget = this.selection.getLineWidgetBodyWidget(this.currentPage.footnoteWidget, cursorPoint);
                        if (widget) {
                            this.isFootnoteWidget = true;
                        }
                    } else if (!isMouseDragged && this.currentPage.endnoteWidget &&
                        this.isInFootnoteWidget(this.currentPage.endnoteWidget, cursorPoint)) {
                        widget = this.selection.getLineWidgetBodyWidget(this.currentPage.endnoteWidget, cursorPoint);
                        if (widget) {
                            this.isFootnoteWidget = true;
                        }
                    } else {
                        for (let i: number = 0; i < this.currentPage.bodyWidgets.length; i++) {
                            let bodyWidget: BodyWidget = this.currentPage.bodyWidgets[i];
                            if (i < this.currentPage.bodyWidgets.length - 1) {
                                if (cursorPoint.x <= bodyWidget.x + bodyWidget.width) {
                                    //let isGetFirstChild: boolean = i === this.currentPage.bodyWidgets.length - 1;
                                    widget = this.selection.getLineWidgetBodyWidget(bodyWidget, cursorPoint, true);
                                    if (!isNullOrUndefined(widget) && widget.paragraph.y <= cursorPoint.y
                                    && (widget.paragraph.y + widget.paragraph.height) >= cursorPoint.y) {
                                        this.isFootnoteWidget = false;
                                        break;
                                    }
                                }
                            }
                            if (cursorPoint.x > bodyWidget.x + bodyWidget.width && this.layout.getNextWidgetHeight(bodyWidget) >= cursorPoint.y && bodyWidget.y <= cursorPoint.y) {
                                if (isNullOrUndefined(bodyWidget.nextRenderedWidget) || !(this.layout.getNextWidgetHeight(bodyWidget.nextRenderedWidget as BodyWidget) >= cursorPoint.y && bodyWidget.nextRenderedWidget.y <= cursorPoint.y)) {
                                    widget = this.selection.getLineWidgetBodyWidget(bodyWidget, cursorPoint, true);
                                    if (!isNullOrUndefined(widget) && widget.paragraph.y <= cursorPoint.y
                                        && (widget.paragraph.y + widget.paragraph.height) >= cursorPoint.y) {
                                        this.isFootnoteWidget = false;
                                        break;
                                    }
                                }
                            }
                            if (i == this.currentPage.bodyWidgets.length - 1) {
                                widget = this.selection.getLineWidgetBodyWidget(bodyWidget, cursorPoint, true);
                                if (!isNullOrUndefined(widget) && widget.paragraph.y <= cursorPoint.y
                                && (widget.paragraph.y + widget.paragraph.height) >= cursorPoint.y) {
                                    this.isFootnoteWidget = false;
                                    break;
                                }
                            }
                            if (cursorPoint.x < bodyWidget.x && i < this.currentPage.bodyWidgets.length - 1) {
                                widget = this.selection.getLineWidgetBodyWidget(bodyWidget, cursorPoint, true);
                                if (!isNullOrUndefined(widget) && widget.paragraph.y <= cursorPoint.y
                                && (widget.paragraph.y + widget.paragraph.height) >= cursorPoint.y) {
                                    this.isFootnoteWidget = false;
                                    break;
                                } else if (!isNullOrUndefined(widget) && i === this.currentPage.bodyWidgets.length - 1) {
                                    this.isFootnoteWidget = false;
                                    break;
                                }
                            }
                        }
                    }
                let inlineShapeInfo: ShapeInfo = this.checkInlineShapeItems(widget, cursorPoint, isMouseDragged);
                if (inlineShapeInfo.isShapeSelected) {
                    if (inlineShapeInfo.isInShapeBorder) {
                        return inlineShapeInfo.element.line;
                    }
                    if (inlineShapeInfo.element instanceof ShapeElementBox) {
                        widget = this.selection.getLineWidgetBodyWidget((inlineShapeInfo.element as ShapeElementBox).textFrame, cursorPoint);
                    }
                } else if (!this.checkPointIsInLine(widget, cursorPoint) && behindShapeInfo.isShapeSelected) {
                    if (behindShapeInfo.isInShapeBorder) {
                        return behindShapeInfo.element.line;
                    }
                    if (behindShapeInfo.element instanceof ShapeElementBox) {
                        widget = this.selection.getLineWidgetBodyWidget((behindShapeInfo.element as ShapeElementBox).textFrame, cursorPoint);
                    }
                }
            }
        }
    }
        return widget;
    }
    private checkInlineShapeItems(widget: LineWidget, cursorPoint: Point, isMouseDragged: boolean): ShapeInfo {
        let isInShape: boolean = false;
        let isInShapeBorder: boolean = false;
        let floatingElement: ShapeElementBox;
        let selectionInShape: boolean = this.selection.isInShape;
        let isMouseDraggedInShape: boolean = isMouseDragged && selectionInShape;
        if (!isNullOrUndefined(widget) && widget.children.length > 0) {
            if (isMouseDraggedInShape) {
                let textFrame: TextFrame = this.owner.selection.getCurrentTextFrame();
                if (textFrame) {
                    floatingElement = textFrame.containerShape as ShapeElementBox;
                    isInShape = true;
                }
            } else {
                for (let i: number = 0; i < widget.children.length; i++) {
                    if (!(widget.children[i] instanceof ShapeElementBox && (widget.children[i] as ShapeElementBox).textWrappingStyle === 'Inline')) {
                        continue;
                    }
                    floatingElement = widget.children[i] as ShapeElementBox;
                    if (cursorPoint.x < floatingElement.x + floatingElement.margin.left + floatingElement.width &&
                        cursorPoint.x > floatingElement.x && cursorPoint.y < floatingElement.y + floatingElement.margin.top +
                        floatingElement.height && cursorPoint.y > floatingElement.y) {
                        isInShape = true;
                        if (this.isInShapeBorder(floatingElement, cursorPoint)) {
                            isInShapeBorder = true;
                        }
                        break;
                    }
                }
                if (isMouseDragged && !selectionInShape) {
                    isInShape = false;
                }
            }
        }
        return {
            'element': floatingElement,
            'caretPosition': cursorPoint,
            'isInShapeBorder': isInShapeBorder,
            'isShapeSelected': isInShape
        }
    }
    /**
     * @private
     */
    public checkPointIsInLine(widget: LineWidget, cursorPoint: Point): boolean {
        if (!isNullOrUndefined(widget) && widget.children.length > 0) {
            let element: ElementBox;
            let left: number = widget.paragraph.x;
            let top: number = this.selection.getTop(widget);
            for (let i: number = widget.children.indexOf(widget.children[0]); i < widget.children.length; i++) {
                element = widget.children[i];
                if (element instanceof ShapeBase && element.textWrappingStyle !== 'Inline') {
                    continue;
                }
                if (cursorPoint.x < left + element.margin.left + element.width + element.padding.left
                    && cursorPoint.x > left && cursorPoint.y < top + widget.height && cursorPoint.y > top) {
                    return true;
                }
                left += element.margin.left + element.width + element.padding.left;
            }
        }
        return false;
    }
    private isInFootnoteWidget(footnoteWidget: FootNoteWidget, point: Point): boolean {
        for (let i: number = 0; i < footnoteWidget.bodyWidgets.length; i++) {
            for (let j: number = 0; j < footnoteWidget.bodyWidgets[i].childWidgets.length; j++) {
            let childWidget: IWidget = footnoteWidget.bodyWidgets[i].childWidgets[j];
            if (childWidget instanceof Widget && (childWidget as Widget).y <= point.y
                && ((childWidget as Widget).y + (childWidget as Widget).height) >= point.y) {
                return true;
            }
        }
        }
        return false;
    }
    private checkFloatingItems(blockContainer: BlockContainer, cursorPoint: Point, isMouseDragged: boolean, isBehind?: boolean): ShapeInfo {
        let isInShape: boolean = false;
        let isInShapeBorder: boolean = false;
        let floatElement: ShapeBase;
        let selectionInShape: boolean = this.selection.isInShape;
        let isMouseDraggedInShape: boolean = isMouseDragged && selectionInShape;
        if (blockContainer.floatingElements.length > 0) {
            let page: Page = this.currentPage;
            /* eslint-disable */
            blockContainer.floatingElements.sort(function (a, b) {
                if (a instanceof TableWidget || b instanceof TableWidget) {
                    return 0;
                } else {
                    return a.zOrderPosition - b.zOrderPosition;
                }
            });
            if (isMouseDraggedInShape) {
                let textFrame: TextFrame = this.owner.selection.getCurrentTextFrame();
                if (textFrame) {
                    floatElement = textFrame.containerShape as ShapeElementBox;
                    isInShape = true;
                }
            } else {
                for (let i: number = blockContainer.floatingElements.length - 1; i >= 0; i--) {
                    if (blockContainer.floatingElements[i] instanceof TableWidget
                        || (!isNullOrUndefined(isBehind) && isBehind ? (blockContainer.floatingElements[i] as ShapeBase).textWrappingStyle !== 'Behind' : (blockContainer.floatingElements[i] as ShapeBase).textWrappingStyle === 'Behind')) {
                        continue;
                    }
                    floatElement = blockContainer.floatingElements[i] as ShapeBase;
                    if (cursorPoint.x < floatElement.x + floatElement.margin.left + floatElement.width &&
                        cursorPoint.x > floatElement.x && cursorPoint.y < floatElement.y + floatElement.margin.top +
                        floatElement.height && cursorPoint.y > floatElement.y) {
                        isInShape = true;
                        if (this.isInShapeBorder(floatElement, cursorPoint)) {
                            isInShapeBorder = true;
                        }
                        break;
                    }
                }
                if (isMouseDragged && !selectionInShape) {
                    isInShape = false;
                }
            }
        }
        return {
            'element': floatElement,
            'caretPosition': cursorPoint,
            'isShapeSelected': isInShape,
            'isInShapeBorder': isInShapeBorder
        }
    }
    public isBlockInHeader(block: Widget): boolean {
        while (!(block.containerWidget instanceof HeaderFooterWidget)) {
            if (!block.containerWidget) {
                return false;
            }
            block = block.containerWidget as BlockWidget;
            if (block instanceof TextFrame) {
                block = block.containerShape.paragraph;
            }
        }
        return (block.containerWidget as HeaderFooterWidget).headerFooterType.indexOf('Header') !== -1;
    }
    public clearSelectionHighlight(): void {
        let canClear: boolean = true;
        canClear = (!this.isControlPressed || !this.isMouseDown);
        // if (this.owner.selection.selectionRanges.length > 0 && canClear) {
        if (this.owner.selection.clearSelectionHighlightInSelectedWidgets()) {
            this.selectionContext.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
        }
        // } else if (!isNullOrUndefined(this.owner.selection.currentSelectionRange) && this.isMouseDown) {
        //     this.owner.selection.currentSelectionRange.clearSelectionHighlight();
        // }
        //this.renderVisiblePages();
    }
    /**
     * Fired on keyup event.
     * 
     * @private
     * @param {KeyboardEvent} event - Specifies keyboard event.
     * @returns {void}
     */
    public onKeyUpInternal = (event: KeyboardEvent): void => {
        if (Browser.isDevice && (event.target as HTMLElement) === this.editableDiv) {
            if (window.getSelection().anchorOffset !== this.prefix.length) {
                this.selection.setEditableDivCaretPosition(this.editableDiv.innerText.length);
            }
        }
        if (event.ctrlKey || (event.keyCode === 17 || event.which === 17)) {
            this.isControlPressed = false;
        }
    }
    /**
     * Fired on keydown.
     * 
     * @private
     * @param {KeyboardEvent} event - Specifies keyboard event.
     * @returns {void}
     */
    public onKeyDownInternal = (event: KeyboardEvent): void => {
        if (!isNullOrUndefined(event.target) && (event.target as HTMLElement) !== this.editableDiv) {
            return;
        }
        this.owner.focusIn();
        let isHandled: boolean = false;
        let keyEventArgs: DocumentEditorKeyDownEventArgs = { 'event': event, 'isHandled': false, source: this.owner };
        this.owner.trigger(keyDownEvent, keyEventArgs);
        if (keyEventArgs.isHandled) {
            return;
        }
        let key: number = event.which || event.keyCode;
        let ctrl: boolean = (event.ctrlKey || event.metaKey) ? true : ((key === 17) ? true : false); // ctrl detection       
        let shift: boolean = event.shiftKey ? event.shiftKey : ((key === 16) ? true : false); // Shift Key detection        
        let alt: boolean = event.altKey ? event.altKey : ((key === 18) ? true : false); // alt key detection
        if (ctrl && !shift && !alt) {
            switch (key) {
                case 80:
                    event.preventDefault();
                    this.owner.print();
                    isHandled = true;
                    break;
                case 83:
                    event.preventDefault();
                    this.owner.save(this.owner.documentName === '' ? 'sample' : this.owner.documentName, 'Sfdt');
                    isHandled = true;
                    break;
            }
        }
        if (!isHandled && !isNullOrUndefined(this.selection)) {
            this.selection.onKeyDownInternal(event, ctrl, shift, alt);
        }
        if (isHandled) {
            event.preventDefault();
        }
        this.timer = setTimeout((): void => {
            if (!this.isScrollHandler && !isNullOrUndefined(this.owner) && this.owner.isSpellCheck) {
                this.isScrollToSpellCheck = true;
                this.owner.viewer.updateScrollBars();
            }
        }, 100);
    }
    /**
     * @private
     * @returns {void}
     */
    public removeEmptyPages(): void {
        let scrollToLastPage: boolean = false;
        for (let j: number = 0; j < this.pages.length; j++) {
            let page: Page = this.pages[j];
            for (let i = 0; i < page.bodyWidgets.length; i++) {
                if (page.bodyWidgets.length === 0 || page.bodyWidgets[i].childWidgets.length === 0) {
                    if (page.bodyWidgets.length >= 1) {
                        let startindex: number = page.bodyWidgets.indexOf(page.bodyWidgets[i]);
                        page.bodyWidgets.splice(startindex, 1);
                        i--;
                    }
                }
            }
            if (page.bodyWidgets.length <= 0) {
                if (j === this.pages.length - 1 && this.owner.viewer instanceof PageLayoutViewer && this.owner.viewer.visiblePages.indexOf(this.pages[j]) !== -1) {
                    scrollToLastPage = true;
                }
               this.removePage(this.pages[j]);
               j--;
            }
            
        }
        if (scrollToLastPage) {
            this.scrollToBottom();
        }
    }
    /**
     * @private
     * @returns {void}
     */
    public scrollToBottom(): void {
        if (this.selection.start.paragraph && this.selection.start.paragraph.bodyWidget) {
            let page: Page = this.selection.start.paragraph.bodyWidget.page;
            let containerHeight: number = this.visibleBounds.height;
            this.viewerContainer.scrollTop = page.boundingRectangle.bottom - containerHeight;
        }
    }
    public getFieldResult(fieldBegin: FieldElementBox, page: Page): string {
        if (!isNullOrUndefined(page) && !isNullOrUndefined(this.selection)) {
            let fieldCode: string = this.selection.getFieldCode(fieldBegin);
            let fieldCodes: string[] = fieldCode.split('\*');
            let fieldCategory: string = fieldCodes[0].replace(/[^\w\s]/gi, '').trim().toLowerCase();
            let fieldPattern: string = '';
            if (fieldCodes.length > 1) {
                if(fieldCodes[1] !== ' MERGEFORMAT'){
                    fieldPattern = fieldCodes[1].replace(/[^\w\s]/gi, '').trim();
                }
            }
            if(fieldPattern == '') {
                fieldPattern = page.bodyWidgets[0].sectionFormat.pageNumberStyle;
            }
            fieldCategory = (!fieldCategory.match('numpages') && !fieldCategory.match('sectionpages') &&
                fieldCategory.match('page')) ? 'page' : fieldCategory;
            switch (fieldCategory) {
                case 'page':
                    if (page.bodyWidgets[0].sectionFormat.restartPageNumbering && page.sectionIndex !== 0) {
                        let currentSectionIndex: number = page.sectionIndex;
                        let previousPage: Page = page.previousPage;
                        if (currentSectionIndex !== previousPage.sectionIndex) {
                            page.currentPageNum = (page.bodyWidgets[0].sectionFormat.pageStartingNumber);
                            return this.getFieldText(fieldPattern, page.currentPageNum);
                        }
                        if (previousPage.currentPageNum === 1) {
                            previousPage.currentPageNum = (page.bodyWidgets[0].sectionFormat.pageStartingNumber);
                        }
                        page.currentPageNum = previousPage.currentPageNum + 1;
                        return this.getFieldText(fieldPattern, page.currentPageNum);
                    } else if (page.bodyWidgets[0].sectionFormat.restartPageNumbering && page.sectionIndex === 0) {
                        page.currentPageNum = page.bodyWidgets[0].sectionFormat.pageStartingNumber + page.index;
                        return this.getFieldText(fieldPattern, page.currentPageNum);
                    }
                    page.currentPageNum = (!isNullOrUndefined(page.previousPage)) ? page.previousPage.currentPageNum + 1 : page.index + 1;
                    page.currentPageNum = page.index + 1;
                    return this.getFieldText(fieldPattern, page.currentPageNum);
                case 'numpages':
                    return this.getFieldText(fieldPattern, page.documentHelper.pages.length);
                case 'sectionpages':
                    let currentSectionIndex: number = page.sectionIndex;
                    let currentPageCount: number = 0;
                    for (let i: number = 0; i < page.documentHelper.pages.length; i++) {
                        if (page.documentHelper.pages[i].sectionIndex === currentSectionIndex) {
                            currentPageCount++;
                        } else if (currentPageCount !== 0) {
                            break;
                        }
                    }
                    return this.getFieldText(fieldPattern, currentPageCount);
                default:
                    break;
            }
        }
        return '';
    }
    private getFieldText(pattern: string, value: number): string {
        switch (pattern) {
            case 'ALPHABETIC':
                return this.layout.getAsLetter(value).toUpperCase();
            case 'alphabetic':
                return this.layout.getAsLetter(value).toLowerCase();
            case 'roman':
                return this.layout.getAsRoman(value).toLowerCase();
            case 'ROMAN':
                return this.layout.getAsRoman(value).toUpperCase();
            case 'RomanUpper':
                return this.layout.getAsRoman(value).toUpperCase();
            case 'RomanLower':
                return this.layout.getAsRoman(value).toLowerCase();
            case 'LetterUpper':
                return this.layout.getAsLetter(value).toUpperCase();
            case 'LetterLower':
                return this.layout.getAsLetter(value).toLowerCase();
            default:
                return value.toString();
        }
    }
    private isEmptyShape(shape: ShapeInfo): boolean {
        let isEmpty: boolean = true;
        if (shape.element instanceof ImageElementBox) {
            return isEmpty;
        }
        let textFrame: TextFrame = (shape.element as ShapeElementBox).textFrame;
        if (textFrame.childWidgets.length === 0) {
            return isEmpty;
        } else {
            return false;
        }
    }
    /**
     * Destroys the internal objects maintained for control.
     * 
     * @returns {void}
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.owner)) {
            this.unWireEvent();
        }
        if (this.styles) {
            this.styles.destroy();
            this.styles = undefined;
        }
        if (this.stylesMap) {
            this.stylesMap.destroy();
            this.stylesMap = undefined;
        }
        if (this.characterFormat) {
            this.characterFormat.destroy();
            this.characterFormat = undefined;
        }
        if (this.themeFontLanguage) {
            this.themeFontLanguage.destroy();
            this.themeFontLanguage = undefined;
        }
        if (this.paragraphFormat) {
            this.paragraphFormat.destroy();
            this.paragraphFormat = undefined;
        }
        if (this.pages && this.pages.length > 0) {
            for (let i: number = 0; i < this.pages.length; i++) {
                let page: Page = this.pages[i];
                page.componentDestroy();
            }
            this.pages = [];
        }
        this.pages = undefined;
        if (this.lists && this.lists.length > 0) {
            for (let i: number = 0; i < this.lists.length; i++) {
                let list: WList = this.lists[i];
                list.destroy();
            }
            this.lists = [];
        }
        this.lists = undefined;
        if (this.formFillPopup) {
            this.formFillPopup.destroy();
            this.formFillPopup = undefined;
        }
        this.L10n = undefined;
        this.currentPage = undefined;
        this.selectionStartPageIn = undefined;
        this.selectionEndPageIn = undefined;
        this.fieldStacks = [];
        this.fieldStacks = undefined;
        this.splittedCellWidgets = [];
        this.splittedCellWidgets = undefined;
        this.fields = [];
        this.fields = undefined;
        this.abstractLists = [];
        this.abstractLists = undefined;
        if (!isNullOrUndefined(this.owner)) {
        this.renderedLists.destroy();
        }
        this.renderedLists = undefined;
        if (!isNullOrUndefined(this.owner)) {
        this.authors.destroy();
        }
        this.authors = undefined;
        if (!isNullOrUndefined(this.owner)) {
        this.revisionsInternal.destroy();
        }
        this.revisionsInternal = undefined;
        if (!isNullOrUndefined(this.owner)) {
        this.preDefinedStyles.destroy();
        }
        this.preDefinedStyles = undefined;
        if (!isNullOrUndefined(this.owner)) {
        this.bookmarks.destroy();
        }
        this.bookmarks = undefined;
        if (!isNullOrUndefined(this.owner)) {
        this.editRanges.destroy();
        }
        this.editRanges = undefined;
        if (!isNullOrUndefined(this.owner)) {
        this.customXmlData.destroy();
        }
        if (!isNullOrUndefined(this.owner)) {
            this.images.destroy();
        }
        this.customXmlData = undefined;
        this.images = undefined;
        this.blockToShift = undefined;
        this.cachedPages = [];
        this.cachedPages = undefined;
        if (this.comments && this.comments.length > 0) {
            for (let i: number = 0; i < this.comments.length; i++) {
                let comment: CommentElementBox = this.comments[i];
                comment.destroy();
            }
            this.comments = [];
        }
        this.comments = undefined;
        this.compositionEnd = undefined;
        this.compositionStart = undefined;
        this.compositionUpdated = undefined;
        this.contentControlCollection = [];
        this.contentControlCollection = undefined;
        this.renderedLevelOverrides = [];
        this.renderedLevelOverrides = undefined;
        this.headersFooters = [];
        this.headersFooters = undefined;
        this.listParagraphs = [];
        this.listParagraphs = undefined;
        this.formFields = [];
        this.formFields = undefined;
        this.fieldCollection = [];
        this.fieldCollection = undefined;
        this.userCollection = [];
        this.userCollection = undefined;
        if (this.footnotes) {
            this.footnotes.componentDestroy();
            this.footnotes = undefined;
        }
        if (this.endnotes) {
            this.endnotes.componentDestroy();
            this.endnotes = undefined;
        }
        if (this.zoomModule) {
            this.zoomModule.destroy();
            this.zoomModule = undefined;
        }
        this.footnoteCollection = [];
        this.footnoteCollection = undefined;
        this.endnoteCollection = [];
        this.endnoteCollection = undefined;

        if (this.restrictEditingPane) {
            this.restrictEditingPane.destroy();
            this.restrictEditingPane = undefined;
        }
        
        if (this.layout) {
            this.layout.destroy();
        }
        this.layout = undefined;
        if (!isNullOrUndefined(this.render)) {
            this.render.destroy();
        }
        this.render = undefined;
        if (this.dialogInternal) {
            this.dialogInternal.destroy();
        }
        this.dialogInternal = undefined;
        if (this.dialogInternal2) {
            this.dialogInternal2.destroy();
            this.dialogInternal2 = undefined;
        }
        if (this.dialogInternal3) {
            this.dialogInternal3.destroy();
            this.dialogInternal3 = undefined;
        }
        if (this.dialogTarget1 && this.dialogTarget1.parentElement) {
            this.dialogTarget1.parentElement.removeChild(this.dialogTarget1);
        }
        this.dialogTarget1 = undefined;
        if (this.dialogTarget2 && this.dialogTarget2.parentElement) {
            this.dialogTarget2.parentElement.removeChild(this.dialogTarget2);
        }
        this.dialogTarget2 = undefined;
        if (this.dialogTarget3 && this.dialogTarget3.parentElement) {
            this.dialogTarget3.parentElement.removeChild(this.dialogTarget3);
        }
        this.dialogTarget3 = undefined;
        if (!isNullOrUndefined(this.touchStart)) {
            this.touchStart.innerHTML = '';
            if (!isNullOrUndefined(this.touchStart.parentElement)) {
                this.touchStart.parentElement.removeChild(this.touchStart);
            }
        }
        this.touchStart = undefined;
        if (this.textHelper) {
            this.textHelper.destroy();
        }
        this.textHelper = undefined;
        if (!isNullOrUndefined(this.touchEnd)) {
            this.touchEnd.innerHTML = '';
            if (!isNullOrUndefined(this.touchEnd.parentElement)) {
                this.touchEnd.parentElement.removeChild(this.touchEnd);
            }
        }
        this.touchEnd = undefined;
        if (!isNullOrUndefined(this.containerCanvasIn)) {
            this.containerCanvasIn.innerHTML = '';
            if (!isNullOrUndefined(this.containerCanvasIn.parentElement)) {
                this.containerCanvasIn.parentElement.removeChild(this.containerCanvasIn);
            }
        }
        this.containerCanvasIn = undefined;
        if (!isNullOrUndefined(this.selectionCanvasIn)) {
            this.selectionCanvasIn.innerHTML = '';
            if (!isNullOrUndefined(this.selectionCanvasIn.parentElement)) {
                this.selectionCanvasIn.parentElement.removeChild(this.selectionCanvasIn);
            }
        }
        this.selectionCanvasIn = undefined;
        if (!isNullOrUndefined(this.editableDiv)) {
            this.editableDiv.innerHTML = '';
            if (!isNullOrUndefined(this.editableDiv.parentElement)) {
                this.editableDiv.parentElement.removeChild(this.editableDiv);
            }
        }
        this.editableDiv = undefined;
        if (!isNullOrUndefined(this.pageContainer)) {
            this.pageContainer.innerHTML = '';
            if (!isNullOrUndefined(this.pageContainer.parentElement)) {
                this.pageContainer.parentElement.removeChild(this.pageContainer);
            }
        }
        this.pageContainer = undefined;
        if (!isNullOrUndefined(this.viewerContainer)) {
            this.viewerContainer.innerHTML = '';
            if (!isNullOrUndefined(this.viewerContainer.parentElement)) {
                this.viewerContainer.parentElement.removeChild(this.viewerContainer);
            }
            
        }
        if(!isNullOrUndefined(this.iframe)){
            this.iframe.innerHTML = '';
            if (!isNullOrUndefined(this.iframe.parentElement)) {
                this.iframe.parentElement.removeChild(this.iframe);
            }
            this.iframe = undefined;
        }
        if (this.optionsPaneContainer) {
            this.optionsPaneContainer.innerHTML = '';
            if (!isNullOrUndefined(this.optionsPaneContainer.parentElement)) {
                this.optionsPaneContainer.parentElement.removeChild(this.optionsPaneContainer);
            }
        }
        this.optionsPaneContainer = undefined;
        this.visibleBoundsIn = undefined;
        this.mouseDownOffset = undefined;
        this.viewerContainer = undefined;
        this.currentPage = undefined;
        this.selectionStartPageIn = undefined;
        this.selectionEndPageIn = undefined;
        this.currentSelectedCommentInternal = undefined;
        this.currentSelectedRevisionInternal = undefined;
        this.owner = undefined;
        this.heightInfoCollection = undefined;
    }
    /**
     * Un-Wires events and methods
     * 
     * @returns {void}
     */
    private unWireEvent(): void {
        this.viewerContainer.removeEventListener('scroll', this.scrollHandler);
        this.viewerContainer.removeEventListener('mousedown', this.onMouseDownInternal);
        this.viewerContainer.removeEventListener('mousemove', this.onMouseMoveInternal);
        if (!Browser.isDevice) {
            this.editableDiv.removeEventListener('keypress', this.onKeyPressInternal);
            if (Browser.info.name === 'chrome') {
                this.editableDiv.removeEventListener('textInput', this.onTextInput);
            }
        } else {
            this.editableDiv.removeEventListener('input', this.onTextInputInternal);
        }
        this.editableDiv.removeEventListener('paste', this.onPaste);
        this.viewerContainer.removeEventListener('contextmenu', this.onContextMenu);
        this.editableDiv.removeEventListener('blur', this.onFocusOut);
        this.editableDiv.removeEventListener('keydown', this.onKeyDownInternal);
        this.editableDiv.removeEventListener('compositionstart', this.compositionStart);
        this.editableDiv.removeEventListener('compositionupdate', this.compositionUpdated);
        this.editableDiv.removeEventListener('compositionend', this.compositionEnd);
        this.viewerContainer.removeEventListener('mouseup', this.onMouseUpInternal);
        if (!isNullOrUndefined(this.iframe)) {
            this.iframe.removeEventListener('load', this.onIframeLoad);
        }
        this.viewerContainer.removeEventListener('dblclick', this.onDoubleTap);
        window.removeEventListener('resize', this.onWindowResize);
        window.removeEventListener('keyup', this.onKeyUpInternal);
        window.removeEventListener('mouseup', this.onImageResizer);
        window.removeEventListener('touchend', this.onImageResizer);
        if (navigator !== undefined && navigator.userAgent.match('Firefox')) {
            this.viewerContainer.removeEventListener('DOMMouseScroll', this.zoomModule.onMouseWheelInternal);
        }
        this.viewerContainer.removeEventListener('mousewheel', this.zoomModule.onMouseWheelInternal);
    }
    public updateCursor(event: MouseEvent): void {
        let hyperlinkField: FieldElementBox = undefined;
        let footnoteElement: FootnoteElementBox = undefined;
        let div: HTMLDivElement = this.viewerContainer as HTMLDivElement;
        let point: Point = new Point(event.offsetX, event.offsetY);
        let touchPoint: Point = this.owner.viewer.findFocusedPage(point, true);
        let widget: LineWidget = this.getLineWidget(touchPoint);
        let widgetInfo: TextPositionInfo;
        let left: number;
        let top: number;
        let editor: Editor = !this.owner.isReadOnlyMode ? this.owner.editorModule : undefined;
        let isRowResize: boolean = editor ? editor.tableResize.isInRowResizerArea(touchPoint) : false;
        let isCellResize: boolean = editor ? editor.tableResize.isInCellResizerArea(touchPoint) : false;
        let floatItemInfo: ShapeInfo = this.selection.checkAllFloatingElements(widget, touchPoint);
        let resizePosition: string = '';
        if (this.owner.enableImageResizerMode) {
            let resizeObj: ImagePointInfo = this.owner.imageResizerModule.getImagePoint(touchPoint);
            this.owner.imageResizerModule.selectedResizeElement = resizeObj.selectedElement;
            resizePosition = resizeObj.resizePosition;
        }
        let lineLeft: number = 0;
        let formField: FieldElementBox = undefined;
        let referenceField: FieldElementBox = undefined;
        let isInInline: boolean = this.checkPointIsInLine(widget, touchPoint);
        if (!isNullOrUndefined(widget)) {
            lineLeft = this.selection.getLineStartLeft(widget);
            hyperlinkField = this.selection.getHyperLinkFieldInCurrentSelection(widget, touchPoint);

            if (isNullOrUndefined(hyperlinkField)) {
                formField = this.selection.getHyperLinkFieldInCurrentSelection(widget, touchPoint, true);
            }
            if (!isNullOrUndefined(hyperlinkField)) {
                let code: string = this.selection.getFieldCode(hyperlinkField);
                if (code.toLowerCase().indexOf('ref ') === 0 && !code.match('\\h')) {
                    hyperlinkField = undefined;
                }
            }
            widgetInfo = this.selection.updateTextPositionIn(widget, undefined, 0, touchPoint, true);
            left = this.selection.getLeft(widget);
            top = this.selection.getTop(widget);
            if (isNullOrUndefined(hyperlinkField) && !isNullOrUndefined(formField) && this.isDocumentProtected &&
                this.protectionType === 'FormFieldsOnly' && !this.isFormFilling) {
                this.selection.setHyperlinkContentToToolTip(formField, widget, touchPoint.x, true);
            } else {
                this.selection.setHyperlinkContentToToolTip(hyperlinkField, widget, touchPoint.x, false);
            }
            if (formField) {
                let isInlineFormFillMode: boolean = (formField.formFieldData instanceof TextFormField) && formField.formFieldData.type === 'Text';
                if (this.owner.documentEditorSettings.formFieldSettings.formFillingMode === 'Inline' && isInlineFormFillMode) {
                    //Update text cursor in text form field.
                    formField = undefined;
                }
            }
            if (this.owner.enableLockAndEdit) {
                let isLocked: boolean = false;
                let block: BlockWidget = widget.paragraph;
                if (block.isInsideTable) {
                    block = this.layout.getParentTable(block);
                }
                if (block.locked && block.lockedBy !== this.owner.currentUser) {
                    isLocked = true;
                }
                let sectionFormat: WSectionFormat = widget.paragraph.bodyWidget.sectionFormat;
                let pageWidth: number = sectionFormat.pageWidth - sectionFormat.rightMargin - sectionFormat.leftMargin;
                pageWidth = HelperMethods.convertPointToPixel(pageWidth) * this.zoomFactor;
                if (this.viewer instanceof WebLayoutViewer) {
                    pageWidth = (this.visibleBounds.width - (this.viewer.padding.right * 5)) / this.zoomFactor;
                }
                if (isLocked && touchPoint.x >= lineLeft && touchPoint.x < lineLeft + pageWidth) {
                    this.selection.setLockInfoTooptip(widget, touchPoint.x, block.lockedBy);
                } else {
                    this.selection.setLockInfoTooptip(undefined, touchPoint.x, '');
                }
            }
        }
        if (!isNullOrUndefined(widget)) {
            if (isNullOrUndefined(footnoteElement) && this.owner.layoutType == 'Pages') {
                footnoteElement = this.selection.getFootNoteElementInCurrentSelection(widget, touchPoint)
                if (footnoteElement instanceof FootnoteElementBox) {
                    this.selection.setFootnoteContentToToolTip(footnoteElement, widget, touchPoint.x);
                }
            }
        }
        let isCtrlkeyPressed: boolean = this.isIosDevice ? event.metaKey : event.ctrlKey;
        if ((!isNullOrUndefined(hyperlinkField) && (isCtrlkeyPressed &&
            this.owner.useCtrlClickToFollowHyperlink || !this.owner.useCtrlClickToFollowHyperlink)) || formField) {
            if (!isNullOrUndefined(formField)) {
                if (this.isFormFillProtectedMode) {
                    div.style.cursor = 'default';
                }
            } else {
                div.style.cursor = 'pointer';
            }
            return;
        } else if (touchPoint.x >= lineLeft &&
            event.offsetX < (this.visibleBounds.width - (this.visibleBounds.width - this.viewerContainer.clientWidth)) &&
            event.offsetY < (this.visibleBounds.height - (this.visibleBounds.height - this.viewerContainer.clientHeight))) {
            if (this.selection.isEmpty) {
                div.style.cursor = 'text';
            } else {
                div.style.cursor = this.selection.checkCursorIsInSelection(widget, touchPoint) ? 'default' : 'text';
            }
        } else {
            div.style.cursor = 'default';
        }

        if (!isNullOrUndefined(resizePosition) && resizePosition !== '') {
            if (!this.owner.imageResizerModule.isShapeResize || this.owner.imageResizerModule.isShapeResize && resizePosition !== 'move') {
                div.style.cursor = resizePosition;
            }
        } else if (!isNullOrUndefined(widgetInfo) && widgetInfo.isImageSelected && left < touchPoint.x && top < touchPoint.y &&
            left + widget.width > touchPoint.x && top + widget.height > touchPoint.y) {
            div.style.cursor = 'move';
        }
        if (isRowResize) {
            div.style.cursor = 'row-resize';
        } else if (isCellResize) {
            div.style.cursor = 'col-resize';
        }
        if (floatItemInfo.isInShapeBorder && !isInInline) {
            div.style.cursor = 'all-scroll';
        }
    }
    /**
     * @private
     */
    public updateDialogTabHeight(dialogElement: HTMLElement, targetElement: HTMLElement): number {
        const header: HTMLElement = dialogElement.getElementsByClassName('e-dlg-header-content')[0] as HTMLElement;
        const contentElement: HTMLElement = dialogElement.getElementsByClassName('e-dlg-content')[0] as HTMLElement;
        const footer: HTMLElement = dialogElement.getElementsByClassName('e-footer-content')[0] as HTMLElement;
        const contentStyle: CSSStyleDeclaration = getComputedStyle(contentElement);
        const dialogStyle: CSSStyleDeclaration = getComputedStyle(dialogElement);
        const paddingTop: number = parseInt(contentStyle.paddingTop, 10);
        const paddingBottom: number = parseInt(contentStyle.paddingBottom, 10);
        const paddingVertical: number = (isNaN(paddingTop) ? 0 : paddingTop) + (isNaN(paddingBottom) ? 0 : paddingBottom);
        const borderTop: number = parseInt(dialogStyle.borderTop, 10);
        const borderBottom: number = parseInt(dialogStyle.borderBottom, 10);
        const borderVertical: number = (isNaN(borderTop) ? 0 : borderTop) + (isNaN(borderBottom) ? 0 : borderBottom);
        const contentHeight: number = dialogElement.offsetHeight - (header.offsetHeight + footer.offsetHeight + paddingVertical + borderVertical);
        targetElement.style.height = contentHeight + 'px';
        const paddingLeft: number = parseInt(contentStyle.paddingLeft, 10);
        const paddingRight: number = parseInt(contentStyle.paddingRight, 10);
        const paddingHorizontal: number = (isNaN(paddingLeft) ? 0 : paddingLeft) + (isNaN(paddingRight) ? 0 : paddingRight);
        const borderLeft: number = parseInt(dialogStyle.borderLeft, 10);
        const borderRight: number = parseInt(dialogStyle.borderRight, 10);
        const borderHorizontal: number = (isNaN(borderLeft) ? 0 : borderLeft) + (isNaN(borderRight) ? 0 : borderRight);
        const contentWidth: number = dialogElement.offsetWidth - (paddingHorizontal + borderHorizontal);
        return contentWidth;
    }
    /**
     * 
     * @private
     */
    public canRenderBorder(paragraph: ParagraphWidget): BorderRenderInfo {
        let skipTopBorder: boolean = false;
        let skipBottomBorder: boolean = false;
        let isSamePreviousBorder: boolean;
        let isSameNextBorder: boolean;
        let isSameTopBorder: boolean;
        let isSameBottomBorder: boolean;
        let isSameLeftBorder: boolean;
        let isSameRightBorder: boolean;
        let previousBlock: BlockWidget = paragraph.previousRenderedWidget as BlockWidget;
        let nextBlock: BlockWidget = paragraph.nextRenderedWidget as BlockWidget;
        let paragraphX: number = this.getParagraphLeftPosition(paragraph);
        let previousBlockX: number = 0;
        let nextBlockX: number = 0;
        if (!isNullOrUndefined(previousBlock) && previousBlock instanceof ParagraphWidget) {
            previousBlockX = this.getParagraphLeftPosition(previousBlock);
        }
        if (!isNullOrUndefined(nextBlock) && nextBlock instanceof ParagraphWidget) {
            nextBlockX = this.getParagraphLeftPosition(nextBlock);
        }
        if (!isNullOrUndefined(previousBlock) && previousBlock instanceof ParagraphWidget && paragraphX === previousBlockX) {
            isSameTopBorder = this.checkEqualBorder(paragraph.paragraphFormat.borders.top, previousBlock.paragraphFormat.borders.top);
            isSameBottomBorder = this.checkEqualBorder(paragraph.paragraphFormat.borders.bottom, previousBlock.paragraphFormat.borders.bottom);
            isSameLeftBorder = this.checkEqualBorder(paragraph.paragraphFormat.borders.left, previousBlock.paragraphFormat.borders.left);
            isSameRightBorder = this.checkEqualBorder(paragraph.paragraphFormat.borders.right, previousBlock.paragraphFormat.borders.right);
            if (isSameTopBorder && isSameBottomBorder && isSameLeftBorder && isSameRightBorder
                && !isNullOrUndefined(previousBlock.paragraphFormat.borders.horizontal) && previousBlock.paragraphFormat.borders.horizontal.lineStyle === 'None') {
                skipTopBorder = true;
            }
        }
        if (!isNullOrUndefined(nextBlock) && nextBlock instanceof ParagraphWidget && (paragraphX === nextBlockX || (this.owner.documentHelper.layout.isInitialLoad && this.skipBottomBorder(paragraph, nextBlock)))) {
            isSameTopBorder = this.checkEqualBorder(paragraph.paragraphFormat.borders.top, nextBlock.paragraphFormat.borders.top);
            isSameBottomBorder = this.checkEqualBorder(paragraph.paragraphFormat.borders.bottom, nextBlock.paragraphFormat.borders.bottom);
            isSameLeftBorder = this.checkEqualBorder(paragraph.paragraphFormat.borders.left, nextBlock.paragraphFormat.borders.left);
            isSameRightBorder = this.checkEqualBorder(paragraph.paragraphFormat.borders.right, nextBlock.paragraphFormat.borders.right);
            if (isSameBottomBorder && isSameTopBorder && isSameLeftBorder && isSameRightBorder) {
                skipBottomBorder = true;
            }
        }
        return {
            'skipTopBorder': skipTopBorder,
            'skipBottomBorder': skipBottomBorder
        };
    }
    private checkEqualBorder(source: WBorder, dest: WBorder): boolean {
        if (!isNullOrUndefined(source) && !isNullOrUndefined(dest)) {
            return source.isEqualFormat(dest);
        } else {
            if (isNullOrUndefined(source) && isNullOrUndefined(dest)) {
                return true;
            } else {
                return false;
            }
        }
    }
    /**
    * @private
    */
    public getParagraphLeftPosition(paragraphWidet: ParagraphWidget): number {
        let hangingIndent: number = 0;
        let startX: number = 0;
        if (paragraphWidet.paragraphFormat.firstLineIndent < 0) {
            hangingIndent = HelperMethods.convertPointToPixel(Math.abs(paragraphWidet.paragraphFormat.firstLineIndent));
            hangingIndent = parseFloat(hangingIndent.toFixed(5));
        }
        if (paragraphWidet.isEmpty() && paragraphWidet.paragraphFormat.textAlignment !== 'Left' && paragraphWidet.paragraphFormat.textAlignment !== 'Justify') {
            startX = paragraphWidet.clientX > hangingIndent ? paragraphWidet.clientX - hangingIndent : paragraphWidet.clientX;
            return startX;
        } else {
            startX = paragraphWidet.x > hangingIndent ? paragraphWidet.x - hangingIndent : paragraphWidet.x;
            return startX;
        }
    }
    /**
  * @private
  */
    public skipBottomBorder(paragraph: ParagraphWidget, nextWidget: ParagraphWidget): boolean {
        let currentIndent: number = 0;
        let previousIndent: number = 0;
        if (paragraph.paragraphFormat.leftIndent === nextWidget.paragraphFormat.leftIndent) {
            return true;
        } else {
            currentIndent = paragraph.paragraphFormat.firstLineIndent < 0 ? Math.abs(paragraph.paragraphFormat.firstLineIndent) : 0;
            previousIndent = nextWidget.paragraphFormat.firstLineIndent < 0 ? Math.abs(nextWidget.paragraphFormat.firstLineIndent) : 0;
            currentIndent = paragraph.paragraphFormat.leftIndent > currentIndent ? paragraph.paragraphFormat.leftIndent - currentIndent : 0;
            previousIndent = nextWidget.paragraphFormat.leftIndent > previousIndent ? nextWidget.paragraphFormat.leftIndent - previousIndent : 0;
            if (currentIndent === previousIndent) {
                return true;
            } else {
                return false;
            }
        }
    }
    /**
     * @private
     */
    public isPageInVisibleBound(page: Page, pageTop: number): boolean {
        let height: number = this.visibleBounds.height;
        let vertical: number = this.viewerContainer.scrollTop;
        let pageH: number = page.boundingRectangle.height * this.zoomFactor;
        let isTopFit: boolean = pageTop >= vertical && pageTop <= vertical + height;
        let isBottomFit: boolean = pageTop + pageH >= vertical && pageTop + pageH <= vertical + height;
        let isMiddleFit: boolean = pageTop <= vertical && pageTop + pageH >= vertical + height;
        return isTopFit || isBottomFit || isMiddleFit;
    }
    /**
     * Get first paragraph in cell
     *
     * @private
     * @returns {ParagraphWidget}
     */
    public getFirstParagraphInCell(cell: TableCellWidget): ParagraphWidget {
        const firstBlock: BlockWidget = cell.childWidgets[0] as BlockWidget;
        if (firstBlock instanceof ParagraphWidget) {
            return firstBlock as ParagraphWidget;
        } else {
            return this.getFirstParagraphInFirstCell((firstBlock as TableWidget));
        }
    }
    /**
     * Get first paragraph in first cell
     *
     * @private
     * @returns {TableWidget}
     */
     public getFirstParagraphInFirstCell(table: TableWidget): ParagraphWidget {
        if (!isNullOrUndefined(table.childWidgets) && table.childWidgets.length > 0) {
            const firstRow: TableRowWidget = table.childWidgets[0] as TableRowWidget;
            const cell: TableCellWidget = firstRow.childWidgets[0] as TableCellWidget;
            const block: BlockWidget = cell.childWidgets[0] as BlockWidget;
            return this.getFirstParagraphBlock(block);
        }
        return undefined;
    }
    /**
     * Get last paragraph in last cell
     *
     * @private
     * @returns {ParagraphWidget}
     */
    public getLastParagraphInLastCell(table: TableWidget): ParagraphWidget {
        if (!isNullOrUndefined(table.childWidgets) && table.childWidgets.length > 0) {
            const lastrow: TableRowWidget = table.lastChild as TableRowWidget;
            const lastcell: TableCellWidget = lastrow.lastChild as TableCellWidget;
            const lastBlock: BlockWidget = lastcell.lastChild as BlockWidget;
            return this.getLastParagraphBlock(lastBlock);
        }
        return undefined;
    }
    /**
     * Get first paragraph in block
     *
     * @private
     * @returns {ParagraphWidget}
     */
    public getFirstParagraphBlock(block: BlockWidget): ParagraphWidget {
        if (block instanceof ParagraphWidget) {
            return block as ParagraphWidget;
        } else if (block instanceof TableWidget) {
            return this.getFirstParagraphInFirstCell(block as TableWidget);
        }
        return undefined;
    }
    /**
     * Get last paragraph in block
     *
     * @private
     * @returns {ParagraphWidget}
     */
    public getLastParagraphBlock(block: BlockWidget): ParagraphWidget {
        if (block instanceof ParagraphWidget) {
            return block as ParagraphWidget;
        } else if (block instanceof TableWidget) {
            return this.getLastParagraphInLastCell(block as TableWidget);
        }
        return undefined;
    }
    /**
     * Get last paragraph in first row
     *
     * @private
     * @returns {ParagraphWidget}
     */
    public getLastParagraphInFirstRow(table: TableWidget): ParagraphWidget {
        if (table.childWidgets.length > 0) {
            const row: TableRowWidget = table.firstChild as TableRowWidget;
            const lastcell: TableCellWidget = row.lastChild as TableCellWidget;
            const lastBlock: BlockWidget = lastcell.lastChild as BlockWidget;
            return this.getLastParagraphBlock(lastBlock);
        }
        return undefined;
    }
    /**
     * Get first paragraph in last row
     *
     * @private
     */
    public getFirstParagraphInLastRow(table: TableWidget): ParagraphWidget {
        if (table.childWidgets.length > 0) {
            const lastRow: TableRowWidget = table.childWidgets[table.childWidgets.length - 1] as TableRowWidget;
            const lastCell: TableCellWidget = lastRow.childWidgets[0] as TableCellWidget;
            const lastBlock: BlockWidget = lastCell.childWidgets[0] as BlockWidget;
            return this.getFirstParagraphBlock(lastBlock);
        }
        return undefined;
    }
    /**
     * Add the given WStyle Object ot stylesMap Dictionary
     *
     * @private
     */
    /* eslint-disable  */
    public addToStylesMap(style: WStyle): void {
        const returnStyle: any = {};
        const returnStyleObject: any = {};
        const paraIcon: string = 'e-list-icon e-de-listview-icon e-de-e-paragraph-style-mark e-icons';
        const charIcon: string = 'e-list-icon e-de-listview-icon e-de-e-character-style-mark e-icons';
        const linkedIcon: string = 'e-list-icon e-de-listview-icon e-de-e-linked-style-mark e-icons';
        // StyleName for the dropDownItem
        if (!isNullOrUndefined(style)) {
            const styleName: string = this.owner ? this.L10n.getConstant(style.name) : style.name;
            returnStyle.StyleName = (styleName === '') ? style.name : styleName;
            if (style.type == "Paragraph") {
                returnStyleObject.paragraphFormat = {};
                HelperMethods.writeParagraphFormat(returnStyleObject.paragraphFormat, true, (style as any).paragraphFormat);
            }
            returnStyleObject.characterFormat = {};
            HelperMethods.writeCharacterFormat(returnStyleObject.characterFormat, true, (style as any).characterFormat);
            // CSS Style for dropDownItem
            returnStyle.Style = this.parseStyle(JSON.stringify(returnStyleObject));
            // Setting type for segregating and adding iconcss
            if (!isNullOrUndefined(style.type)) {
                returnStyle.type = style.type;
                if (returnStyle.type == "Paragraph" && !isNullOrUndefined(style.link)) {
                    returnStyle.type = "Linked";
                }
            }
            // Adding IconCss to the dropDownItem
            if (returnStyle.type == "Paragraph") {
                returnStyle.IconClass = paraIcon;
            } else if (returnStyle.type == "Character") {
                returnStyle.IconClass = charIcon;
            } else {
                returnStyle.IconClass = linkedIcon;
            }
            if (this.stylesMap.get(returnStyle.type)) {
                this.stylesMap.get(returnStyle.type).push(returnStyle);
            } else {
                this.stylesMap.add(returnStyle.type, [returnStyle])
            }
        }
    }
    private parseStyle(style: string): string {
        let domStyle: string = '';
        const styleObj: any = JSON.parse(style);
        let textDecoration: string = '';
        if (!isNullOrUndefined(styleObj.characterFormat.baselineAlignment) && styleObj.characterFormat.baselineAlignment !== 'Normal') {
            let vAlign: string = '';
            switch (styleObj.characterFormat.baselineAlignment) {
                case 'Superscript':
                    vAlign = 'super';
                    break;
                case 'Subscript':
                    vAlign = 'sub';
                    break;
            }
            if (vAlign.length > 1) {
                domStyle += 'vertical-align:' + vAlign + ';';
            }
        }
        if (!isNullOrUndefined(styleObj.characterFormat.underline) && styleObj.characterFormat.underline !== 'None') {
            textDecoration += 'underline ';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.strikethrough) && styleObj.characterFormat.strikethrough !== 'None') {
            textDecoration += 'line-through ';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.fontSize)) {
            domStyle += 'font-size:' + styleObj.characterFormat.fontSize + 'px;';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.fontFamily)) {
            domStyle += 'font-family:' + styleObj.characterFormat.fontFamily + ';';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.bold) && styleObj.characterFormat.bold) {
            domStyle += 'font-weight:bold;';
        }
        if (!isNullOrUndefined(styleObj.characterFormat.italic) && styleObj.characterFormat.italic) {
            domStyle += 'font-style:italic;';
        }
        // if (!isNullOrUndefined(styleObj.characterFormat.fontColor)) {
        //     domStyle += 'color: ' + styleObj.characterFormat.fontColor + ';';
        // }
        if (textDecoration.length > 1) {
            domStyle += 'text-decoration:' + textDecoration + ';';
        }
        return domStyle;
    }
}
/**
 * @private
 */
export abstract class LayoutViewer {
    public owner: DocumentEditor;
    constructor(owner: DocumentEditor) {
        this.owner = owner;
        this.columnLayoutArea = new ColumnLayout(this);
    }
    get documentHelper(): DocumentHelper {
        return this.owner.documentHelper;
    }
    /**
     * @private
     */
    public visiblePages: Page[] = [];
    /** 
     * @private
     */
    public padding: Padding = new Padding(10, 10, 10, 10);
    /**
     * @private
     */
    public clientActiveArea: Rect;
    /**
     * @private
     */
    public clientArea: Rect;
    /**
     * @private
     */
     public columnLayoutArea: ColumnLayout;
    /**
     * @private
     */
    public textWrap: boolean = true;
    /**
     * @private
     */
    public preVisibleWidth: number;
    /**
     * @private
     */
    private pageFitTypeIn: PageFitType = 'None';
    /**
     * @private
     */
    public containerTop: number = 0;
    /**
     * @private
     */
    public containerWidth: number = 0;
    /**
     * @private
     */
    public containerLeft: number = 0;
    /**
     * Gets or sets page fit type.
     * @private
     */
    get pageFitType(): PageFitType {
        return this.pageFitTypeIn;
    }
    set pageFitType(value: PageFitType) {
        this.pageFitTypeIn = value;
        this.onPageFitTypeChanged(this.pageFitTypeIn);
    }
    public updateClientArea(bodyWidget: BodyWidget, page: Page, isReLayout?: boolean): void {
        let sectionFormat: WSectionFormat;
        if (!isNullOrUndefined(bodyWidget)) {
            sectionFormat = bodyWidget.sectionFormat;
            this.columnLayoutArea.setColumns(sectionFormat);
        }
        let width: number = 0; let height: number = 0;
        if (this instanceof WebLayoutViewer) {
            let top: number = 0;
            width = (this.documentHelper.visibleBounds.width - (this.padding.right * 4) - (this.padding.left * 2)) / this.documentHelper.zoomFactor;
            if (width < 0) {
                width = 0;
            }
            height = Number.POSITIVE_INFINITY;
            this.clientArea = new Rect(this.padding.left / this.documentHelper.zoomFactor, top, width, height);
            this.clientActiveArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
        } else {
            let top: number = 0;
            let headerDistance: number = 48;
            let footerDistance: number = 48;
            let pageHeight: number = HelperMethods.convertPointToPixel(sectionFormat.pageHeight);
            let bottomMargin: number = HelperMethods.convertPointToPixel(sectionFormat.bottomMargin);
            if (!isNullOrUndefined(sectionFormat)) {
                top = HelperMethods.convertPointToPixel(sectionFormat.topMargin);
                headerDistance = HelperMethods.convertPointToPixel(sectionFormat.headerDistance);
                footerDistance = HelperMethods.convertPointToPixel(sectionFormat.footerDistance);
            }
            let isEmptyWidget: boolean = false;
            if (!isNullOrUndefined(page.headerWidget)) {
                isEmptyWidget = page.headerWidget.isEmpty;
                if(top >= 0) {
                    if (!isEmptyWidget || isEmptyWidget && this.owner.enableHeaderAndFooter) {
                        top = Math.min(Math.max(headerDistance + page.headerWidget.height, top), pageHeight / 100 * 40);
                    }
                } else {
                    top = Math.abs(top);
                }
            }
            let bottom: number = 0.667 + bottomMargin;
            if (!isNullOrUndefined(page.footerWidget)) {
                isEmptyWidget = page.footerWidget.isEmpty;
                let footnoteHeight: number = !isNullOrUndefined(page.footnoteWidget) ? page.footnoteWidget.height : 0;
                footnoteHeight = Math.min(footnoteHeight, ((pageHeight - top - bottom) / 100 * 90));
                if (bottom >= 0) {
                    if (!isEmptyWidget || isEmptyWidget && this.owner.enableHeaderAndFooter) {
                        bottom = 0.667 + Math.min(pageHeight / 100 * 40, Math.max(footerDistance + page.footerWidget.height, bottomMargin));
                    }
                } else {
                    bottom = Math.abs(bottom);
                }
                bottom += footnoteHeight;
            }
            if (!isNullOrUndefined(sectionFormat)) {
                width = HelperMethods.convertPointToPixel(sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin);
                height = pageHeight - top - bottom;
            }
            if (width < 0) {
                width = 0;
            }
            let clientArea: Rect = new Rect(HelperMethods.convertPointToPixel(sectionFormat.leftMargin), top, width, pageHeight - top - bottom);
            if (page.footnoteWidget && isReLayout && !this.documentHelper.owner.editor.isFootNote) {
                if (page.footnoteWidget.y !== 0 && this.clientArea.y + this.clientArea.height > page.footnoteWidget.y) {
                    let sub: number = (this.clientArea.y + this.clientArea.height - page.footnoteWidget.y);
                    this.clientArea.height -= sub / 2;
                }
            }
            if (bodyWidget.page.bodyWidgets[0].columnIndex !== 0) {
                this.owner.editor.updateColumnIndex(bodyWidget, false);
            }
            this.setClientArea(bodyWidget, clientArea);
            this.clientActiveArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
        }
    }
    public setClientArea(bodyWidget: BodyWidget, clientArea: Rect) {
        this.clientArea = this.columnLayoutArea.getColumnBoundsByBodyWidget(bodyWidget, clientArea);
        bodyWidget.x = this.clientArea.x;
        bodyWidget.width = this.clientArea.width;
    }
    public updateClientAreaTopOrLeft(tableWidget: TableWidget, beforeLayout: boolean): void {
        if (beforeLayout) {
            this.clientActiveArea.y = this.clientActiveArea.y + tableWidget.topBorderWidth;
            this.clientActiveArea.x = this.clientActiveArea.x + tableWidget.leftBorderWidth;
        }
    }
    public updateClientAreaForTable(tableWidget: TableWidget): void {
        this.clientActiveArea.x = this.clientArea.x = tableWidget.x;
        this.clientActiveArea.width = this.clientArea.width = tableWidget.width;
    }
    public updateClientAreaForRow(row: TableRowWidget, beforeLayout: boolean): void {
        let tableWidget: TableWidget = row.ownerTable as TableWidget;
        if (beforeLayout) {
        } else {
            this.clientActiveArea.x = this.clientArea.x = tableWidget.x;
            this.clientActiveArea.width = this.clientArea.width = tableWidget.width;
            this.clientArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
            this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);
        }
    }
    public updateClientAreaForCell(cell: TableCellWidget, beforeLayout: boolean): void {

        let rowWidget: TableRowWidget = (cell as TableCellWidget).ownerRow as TableRowWidget;
        let cellWidget: TableCellWidget = cell as TableCellWidget;
        if (beforeLayout) {
            this.clientActiveArea.x = this.clientArea.x = cellWidget.x;
            this.clientActiveArea.y = cellWidget.y;
            this.clientActiveArea.width = this.clientArea.width = cellWidget.width > 0 ? cellWidget.width : 0;
            if (this instanceof PageLayoutViewer) {
                this.clientActiveArea.height = Number.POSITIVE_INFINITY;
            }
            this.clientArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
            this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);
        } else {
            this.clientActiveArea.x = this.clientArea.x = cellWidget.x + cellWidget.width + cellWidget.margin.right;
            if (rowWidget.x + rowWidget.width - this.clientArea.x < 0) {
                this.clientActiveArea.width = this.clientArea.width = 0;
            } else {
                this.clientActiveArea.width = this.clientArea.width = rowWidget.x + rowWidget.width - this.clientArea.x;
            }
            this.clientActiveArea.y = cellWidget.y - cellWidget.margin.top - HelperMethods.convertPointToPixel(cell.ownerTable.tableFormat.cellSpacing);
            if (!cell.ownerTable.isInsideTable) {
                this.clientActiveArea.height = this.clientArea.bottom - rowWidget.y > 0 ? this.clientArea.bottom - rowWidget.y : 0;
                if(!cell.ownerTable.wrapTextAround && this.documentHelper.layout.existFootnoteHeight > 0) {
                    let updateHeight: number = this.clientActiveArea.height - this.documentHelper.layout.existFootnoteHeight;
                    this.clientActiveArea.height = updateHeight < 0 ? 0 : updateHeight;
                }
            }
            this.clientArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
            this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);
        }
    }

    public updateClientAreaForTextBoxShape(textBox: ShapeElementBox, beforeLayout: boolean): void {
        if (textBox.textWrappingStyle === 'Inline' && this.documentHelper.layout.isInitialLoad) {
            textBox.y = this.clientActiveArea.y;
            textBox.x = this.clientActiveArea.x;
        }
        if (beforeLayout) {
            let marginLeft: number = HelperMethods.convertPointToPixel(textBox.textFrame.marginLeft);
            let marginRight: number = HelperMethods.convertPointToPixel(textBox.textFrame.marginRight);
            let marginTop: number = HelperMethods.convertPointToPixel(textBox.textFrame.marginTop);
            let marginBottom: number = HelperMethods.convertPointToPixel(textBox.textFrame.marginBottom);
            let width: number = textBox.width;
            let height: number = Number.POSITIVE_INFINITY;
            this.clientArea = new Rect(textBox.x + marginLeft, textBox.y + marginTop, width - marginLeft - marginRight, height - marginTop - marginBottom);
            this.clientActiveArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
        }
    }

    public updateClientAreaByWidgetFootNote(widget: FootNoteWidget): void {
        this.clientArea.x = widget.x;
        this.clientArea.y = widget.y;
        this.clientActiveArea.x = widget.x;
        this.clientActiveArea.y = widget.y;
    }
    /**
     * @private
     */
    public updateClientAreaForTextWrap(area: Rect): void {
        this.clientActiveArea = new Rect(area.x, area.y, area.width, area.height);
    }
    private updateBoundsBasedOnTextWrap(bottom: number) {
        let diff: number = bottom - this.clientActiveArea.y;
        this.clientActiveArea.y = bottom;
        this.clientActiveArea.height = this.clientActiveArea.height - diff;
    }
    public updateClientAreaByWidget(widget: ParagraphWidget): void {
        this.clientArea.x = widget.x;
        this.clientArea.y = widget.y;
        this.clientActiveArea.x = widget.x;
        this.clientActiveArea.y = widget.y;
    }
    public updateClientAreaLocation(widget: Widget, area: Rect): void {
        widget.x = area.x;
        widget.y = area.y;
        widget.width = area.width;
    }
    public updateClientAreaForBlock(block: BlockWidget, beforeLayout: boolean, tableCollection?: TableWidget[], updateYPosition?: boolean): void {
        let leftIndent: number = HelperMethods.convertPointToPixel((block as BlockWidget).leftIndent);
        let rightIndent: number = HelperMethods.convertPointToPixel((block as BlockWidget).rightIndent);
        let bidi: boolean = block.bidi;
        let width: number = 0;
        if (beforeLayout) {
            if (block instanceof TableWidget && tableCollection) {
                let tableWidget: TableWidget = tableCollection[0];
                if (block.bodyWidget.sectionFormat.columns.length <= 1) {
                    this.clientActiveArea.x = this.clientArea.x = tableWidget.x;
                    this.clientActiveArea.width = this.clientArea.width = tableWidget.width;
                }
                //Updates the location of last item.
                tableWidget = tableCollection[tableCollection.length - 1] as TableWidget;
                tableWidget.x = this.clientActiveArea.x;
                tableWidget.y = this.clientActiveArea.y;
            } else {
                if (block instanceof TableWidget && !isNullOrUndefined((block as TableWidget).tableFormat)) {
                    if (!block.isGridUpdated) {
                        block.buildTableColumns();
                        block.isGridUpdated = true;
                    }
                    let tableAlignment: TableAlignment = this.tableAlignmentForBidi(block, bidi);
                    if (tableAlignment !== 'Left') {
                        let tableWidth: number = 0;
                        // If the grid is calculated, we can direclty get the width from the grid.
                        // Otherwise, calculate the width.
                        tableWidth = HelperMethods.convertPointToPixel(block.tableHolder.getTotalWidth(0));
                        tableWidth = tableWidth === 0 ? block.tableHolder.tableWidth === 0 ?
                            block.getTableClientWidth(block.getOwnerWidth(false)) : block.tableHolder.tableWidth : tableWidth;
                        // Fore resizing table, the tableholder table width taken for updated width. 
                        // Since, the columns will be cleared if we performed resizing.
                        if (this.owner.editor && this.owner.editor.tableResize.currentResizingTable === block
                            && this.owner.editor.tableResize.resizerPosition === 0) {
                            tableWidth = HelperMethods.convertPointToPixel(block.tableHolder.tableWidth);
                        }
                        if (tableAlignment === 'Center') {
                            if (!this.documentHelper.isRowOrCellResizing) {
                                tableWidth = block.getTableCellWidth();
                            }
                            leftIndent = (this.clientArea.width - tableWidth) / 2;
                        } else {
                            leftIndent = this.clientArea.width - tableWidth;
                        }
                        if (bidi) {
                            leftIndent = leftIndent - HelperMethods.convertPointToPixel(block.leftIndent);
                            rightIndent = leftIndent;
                        }
                        if (!block.isInsideTable) {
                            //leftIndent = (block.tableFormat.horizontalPositionAbs === 'Left') ? block.tableFormat.horizontalPosition : leftIndent;
                        }
                        this.documentHelper.tableLefts.push(leftIndent);
                    }
                }

                width = this.clientArea.width - (leftIndent + HelperMethods.convertPointToPixel(block.rightIndent));
                let x: number = this.clientArea.x + (bidi ? rightIndent : leftIndent);
                width = width > 0 ? width : 0;
                this.clientActiveArea.x = this.clientArea.x = x;
                this.clientActiveArea.width = this.clientArea.width = width;
                if(updateYPosition){
                    this.updateParagraphYPositionBasedonTextWrap(block as ParagraphWidget, new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height));
                }
            }
        } else {
            // Clears table left for table with right or center alignment.
            if (block instanceof TableWidget && !isNullOrUndefined((block as TableWidget).tableFormat)) {
                let tableAlignment: TableAlignment = this.tableAlignmentForBidi(block, bidi);
                if (!block.isGridUpdated) {
                    block.buildTableColumns();
                    block.isGridUpdated = true;
                }
                if (tableAlignment !== 'Left' && this.documentHelper.tableLefts.length > 0) {
                    leftIndent = this.documentHelper.tableLefts.pop();
                    if (bidi) {
                        rightIndent = leftIndent;
                    }
                }
            }
            width = this.clientArea.width + leftIndent + HelperMethods.convertPointToPixel(block.rightIndent);
            let x: number = this.clientArea.x - (bidi ? rightIndent : leftIndent);
            width = width > 0 ? width : 0;
            this.clientActiveArea.x = this.clientArea.x = x;
            this.clientActiveArea.width = this.clientArea.width = width;
        }
        this.clientArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
        this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);
    }

    private updateParagraphYPositionBasedonTextWrap(block: BlockWidget, rect: Rect): void {
        let bodyWidget: BlockContainer = block.bodyWidget;
        let clientLayoutArea: Rect = this.clientActiveArea;
        if (bodyWidget && bodyWidget.floatingElements.length > 0 && block instanceof ParagraphWidget && !(block.containerWidget instanceof TextFrame)
            && !block.isInsideTable && !(block.containerWidget instanceof FootNoteWidget)) {
            let isWord2013: boolean = this.documentHelper.compatibilityMode === 'Word2013';
            let paragraph = block as ParagraphWidget;
            let isEmptyPara: boolean = paragraph.isEmpty();
            let paragraphHeight: number = paragraph.height;
            if (paragraphHeight === 0) {
                paragraphHeight = this.documentHelper.textHelper.getParagraphMarkSize(paragraph.characterFormat).Height;
            }
            //Update Layout area based on text wrap
            if (((!paragraph.isInHeaderFooter || paragraph.isInsideTable)
                || isWord2013)) {
                let yposition = rect.y;
                // As per Microsoft Word behavior, need to update bottom position of first inline item to floating item bottom,
                // when first inline item of page intersects in-between two adjacent floating items parallel in vertical
                // for Word document lower than Microsoft Word 2013 version.
                // To do: Currently this behavior handled for bottom position update based on Y position,
                // need to handle this behavior for bottom position update based on X position in UpdateParagraphXPositionBasedOnTextWrap method.
                let isFirstItemBottomPositionUpdated: boolean = false;
                //Need to handle sorting floating items.
                // Sort based on Y position
                bodyWidget.floatingElements.sort(function (a, b) { return a.y - b.y; });
                // Sort based on X position
                bodyWidget.floatingElements.sort(function (a, b) { return a.x - b.x; });
                let previousItem: BlockWidget = paragraph.previousRenderedWidget as BlockWidget;
                for (let i: number = 0; i < bodyWidget.floatingElements.length; i++) {
                    let floatingItem: ShapeBase | TableWidget = bodyWidget.floatingElements[i];
                    let isInsideHeaderFooter: boolean = false;
                    if (floatingItem instanceof ShapeBase) {
                        isInsideHeaderFooter = floatingItem.paragraph.isInHeaderFooter;
                    } else {
                        isInsideHeaderFooter = floatingItem.bodyWidget instanceof HeaderFooterWidget ? true : false;
                    }
                    if (paragraph.isInsideTable) {
                        if (floatingItem instanceof TableWidget && !floatingItem.isInsideTable) {
                            continue;
                        }
                    }
                    let textWrappingBounds: Rect = this.getTextWrappingBound(floatingItem);
                    let textWrappingStyle: TextWrappingStyle = floatingItem instanceof TableWidget ? 'Square' : floatingItem.textWrappingStyle;
                    let textWrappingType: string = floatingItem instanceof TableWidget ? 'Both' : floatingItem.textWrappingType;

                    let minimumWidthRequired: number = 24;
                    if (!(clientLayoutArea.x > (textWrappingBounds.right + minimumWidthRequired) || clientLayoutArea.right < textWrappingBounds.x - minimumWidthRequired)) {
                        if ((((rect.y + paragraph.height > textWrappingBounds.y || isFirstItemBottomPositionUpdated)
                            && rect.y < (textWrappingBounds.bottom))) && textWrappingStyle !== 'Inline'
                            && textWrappingStyle !== 'TopAndBottom' && textWrappingStyle !== 'InFrontOfText'
                            && textWrappingStyle !== 'Behind') {
                            let rightIndent: number = 0;
                            let paragarphRightIndent: number = HelperMethods.convertPointToPixel(paragraph.paragraphFormat.rightIndent);
                            let firstLineIndent: number = HelperMethods.convertPointToPixel(paragraph.paragraphFormat.firstLineIndent);
                            firstLineIndent = ((!isEmptyPara && (paragraph.childWidgets[0] as LineWidget).isFirstLine()) && firstLineIndent > 0) ? firstLineIndent : 0;
                            if (rect.x >= textWrappingBounds.x && textWrappingType !== 'Left') {
                                rightIndent = paragarphRightIndent;
                            }
                            // Gets the value from right indent when it is negative, otherwise sets the value as zero.
                            rightIndent = rightIndent < 0 ? rightIndent : 0;
                            if (rect.x < textWrappingBounds.x && rect.x > textWrappingBounds.x && textWrappingType !== 'Left') {
                                if (rect.right > textWrappingBounds.x) {
                                    rect.width = rect.width - (rect.right - textWrappingBounds.right);
                                }
                                if (rect.width < minimumWidthRequired) {
                                    //Skip to wrap the immediate paragraph of floating table based on corresponding floating table. 
                                    if (isWord2013 || !((floatingItem instanceof TableWidget) && previousItem === floatingItem)) {
                                        this.updateBoundsBasedOnTextWrap(textWrappingBounds.bottom);
                                        rect = this.clientActiveArea;
                                    }
                                    if ((!isEmptyPara && (paragraph.childWidgets[0] as LineWidget).isFirstLine() || isEmptyPara) && isWord2013 ? true : !isInsideHeaderFooter) {
                                        paragraph.y = this.clientActiveArea.y;
                                    }
                                }
                                else {
                                    rect.x = textWrappingBounds.right;
                                }
                            }
                            else if (rect.x >= textWrappingBounds.x && rect.x < textWrappingBounds.right) {
                                rect.width = rect.width - (textWrappingBounds.right - rect.x) - rightIndent;
                                //checks minimum width
                                if (rect.width < minimumWidthRequired || isFirstItemBottomPositionUpdated) {
                                    rect.width = this.clientActiveArea.right - textWrappingBounds.right - rightIndent;
                                    let isPositionsUpdated: boolean = false;
                                    if (rect.width < minimumWidthRequired || isFirstItemBottomPositionUpdated) {
                                        // If left side of floating item has minimum width to layout the paragraph, then find the minimum bottom among the floating items to the left side of current floating item.
                                        // Then update the Y position to that bottom.
                                        if (this.clientActiveArea.x + minimumWidthRequired < textWrappingBounds.x) {
                                            let tempBounds: Rect = this.getIntersectingItemBounds(bodyWidget.floatingElements, floatingItem, yposition);
                                            if (!isNullOrUndefined(tempBounds) && tempBounds.bottom <= textWrappingBounds.bottom) {
                                                this.updateBoundsBasedOnTextWrap(tempBounds.bottom);
                                                rect = this.clientActiveArea;
                                                isPositionsUpdated = true;
                                                //When we update the client area to the bottom of floating item, we also need to updtae the X position. 
                                                //To-Do: Some more X position updating cases also need to handle.
                                                paragraph.x = tempBounds.x;
                                            }
                                        }
                                        // Skip to wrap the immediate paragraph of floating table based on corresponding floating table.
                                        if ((isWord2013) && !isPositionsUpdated) {
                                            this.updateBoundsBasedOnTextWrap(textWrappingBounds.bottom);
                                            rect = this.clientActiveArea;
                                        }
                                        if ((!isEmptyPara && (paragraph.childWidgets[0] as LineWidget).isFirstLine() || isEmptyPara) && isWord2013 ? true : !isInsideHeaderFooter) {
                                            paragraph.y = this.clientActiveArea.y;
                                        }
                                    }
                                    else {
                                        rect.x = textWrappingBounds.right;
                                    }
                                }
                                else {
                                    rect.x = textWrappingBounds.right;
                                }
                            }
                            else if (textWrappingBounds.x > rect.x && rect.right > textWrappingBounds.x) {
                                rect.width = textWrappingBounds.x - rect.x;
                                //checks minimum width
                                if (rect.width < minimumWidthRequired) {
                                    rect.width = this.clientActiveArea.right - textWrappingBounds.right - rightIndent;
                                    if (rect.width < minimumWidthRequired) {
                                        //Skip to wrap the immediate paragraph of floating table based on corresponding floating table. 
                                        if (isWord2013 || !((floatingItem instanceof TableWidget) && previousItem === floatingItem)) {
                                            this.updateBoundsBasedOnTextWrap(textWrappingBounds.bottom);
                                            rect = this.clientActiveArea;
                                        }
                                        if ((!isEmptyPara && (paragraph.childWidgets[0] as LineWidget).isFirstLine() || isEmptyPara) && isWord2013 ? true : !isInsideHeaderFooter) {
                                            paragraph.y = this.clientActiveArea.y;
                                        }
                                    }
                                    else {
                                        rect.x = textWrappingBounds.right;
                                    }
                                }
                            }
                        }
                        else if ((bodyWidget.floatingElements.length > 0 && ((rect.y >= (textWrappingBounds.y) && rect.y < (textWrappingBounds.bottom))
                            || ((rect.y + paragraphHeight >= textWrappingBounds.y) && (rect.y + paragraphHeight < (textWrappingBounds.bottom))))
                            && textWrappingStyle === 'TopAndBottom')) {
                            //Skip to wrap the immediate paragraph of floating table based on corresponding floating table. 
                            if (isWord2013 || !((floatingItem instanceof TableWidget) && previousItem === floatingItem)) {

                                this.updateBoundsBasedOnTextWrap(textWrappingBounds.bottom);
                                // Sets true to update bottom position of first inline item in page
                                // when this item's bottom position already updated based on previous floating item.
                                if (!isWord2013 && (!isEmptyPara && (paragraph.childWidgets[0] as LineWidget).isFirstLine() || isEmptyPara)) {
                                    isFirstItemBottomPositionUpdated = true;
                                }
                            }
                            if ((!isEmptyPara && (paragraph.childWidgets[0] as LineWidget).isFirstLine() || isEmptyPara) && isWord2013 ? true : !isInsideHeaderFooter) {
                                paragraph.y = this.clientActiveArea.y;
                            }
                        }
                    }
                    // //Reset the floating item bounds to original position
                    // ResetXPositionForRTLLayouting(i, ref textWrappingBounds, floatingItemXPosition);
                }
                //Update the wrapping difference value.
                // if (isFirstItem && yValue < rect.Y) {
                //     (m_lcOperator as Layouter).WrappingDifference = (float)(rect.Y - (m_lcOperator as Layouter).PageTopMargin);
                // }
            }
        }
    }
    private getIntersectingItemBounds(floatingElements: (ShapeBase | TableWidget)[], intersectedfloatingItem: ShapeBase | TableWidget, yPosition: number): Rect {
        let floatingItem: ShapeBase | TableWidget = this.getMinBottomFloatingItem(floatingElements, this.getIntersectingFloatingItems(floatingElements, intersectedfloatingItem, yPosition));

        if (!isNullOrUndefined(floatingItem)) {
            let floatingItemBound: Rect = this.getTextWrappingBound(floatingItem);
            return floatingItemBound;
        }
        return undefined;
    }
    private getMinBottomFloatingItem(floatingElements: (ShapeBase | TableWidget)[], fItems: (ShapeBase | TableWidget)[]): ShapeBase | TableWidget {
        let minBottomItemIndex: number = -1;
        let minBottom: number = Number.MAX_VALUE;
        let skippedCount: number = 0;
        // Sort based on X position
        floatingElements.sort(function (a, b) { return a.x - b.x; });
        for (let i: number = 0; i < fItems.length; i++) {
            let floatingItem: ShapeBase | TableWidget = floatingElements[i];
            let item: Rect = this.getTextWrappingBound(floatingItem);
            if (minBottom > item.bottom) {
                // Need to ignore if floating items preserved in same frame.
                if (floatingItem && fItems.indexOf(floatingItem) + 1 < fItems.length) {
                    skippedCount++;
                }
                else {
                    minBottom = item.bottom;
                    minBottomItemIndex = fItems.indexOf(floatingItem);
                }
            }
        }
        //If floating item which has minimum bottom is first item (no items preserved left side of this item).
        //Then return current item Other cases need to handle.
        return minBottomItemIndex - skippedCount == 0 ? fItems[minBottomItemIndex] : null;
    }
    private getIntersectingFloatingItems(floatingElements: (ShapeBase | TableWidget)[], intersectedfloatingItem: ShapeBase | TableWidget, yPosition: number): (ShapeBase | TableWidget)[] {
        let fItems: (ShapeBase | TableWidget)[] = [];
        //Get all the items which preserved left side of the current floating item.
        for (let i: number = 0; i < floatingElements.length; i++) {
            {
                let floatingItem: ShapeBase | TableWidget = floatingElements[i];
                let itemTextWrapBound: Rect = this.getTextWrappingBound(floatingItem);
                let intersectItemTextWrapBound: Rect = this.getTextWrappingBound(intersectedfloatingItem);
                if (yPosition <= itemTextWrapBound.bottom
                    && intersectItemTextWrapBound.bottom >= itemTextWrapBound.bottom
                    && itemTextWrapBound.right > this.clientActiveArea.x
                    && itemTextWrapBound.x < intersectItemTextWrapBound.x)
                    fItems.push(floatingItem);
            }
        }
        return fItems;
    }
    private getTextWrappingBound(floatingItem: ShapeBase | TableWidget): Rect {
        let distanceLeft: number = 0;
        let distanceTop: number = 0;
        let distanceRight: number = 0;
        let distanceBottom: number = 0;
        let width: number = 0;
        if (floatingItem instanceof ShapeBase) {
            distanceLeft = floatingItem.distanceLeft;
            distanceTop = floatingItem.distanceTop;
            distanceRight = floatingItem.distanceRight;
            distanceBottom = floatingItem.distanceBottom;
            width = floatingItem.width;
        } else {
            width = floatingItem.getTableCellWidth();
            distanceLeft = floatingItem.positioning.distanceLeft;
            distanceTop = floatingItem.positioning.distanceTop;
            distanceRight = floatingItem.positioning.distanceRight;
            distanceBottom = floatingItem.positioning.distanceBottom;
        }
        let textWrappingBounds: Rect = new Rect(floatingItem.x - distanceLeft, floatingItem.y - distanceTop,
            width + distanceLeft + distanceRight,
            floatingItem.height + distanceTop + distanceBottom);
        return textWrappingBounds;
    }

    private tableAlignmentForBidi(block: TableWidget, bidi: boolean): TableAlignment {
        let tableAlignment: TableAlignment = block.tableFormat.tableAlignment;
        if (bidi) {
            if (tableAlignment === 'Left') {
                tableAlignment = 'Right';
            } else if (tableAlignment === 'Right') {
                tableAlignment = 'Left';
            }
        }
        return tableAlignment;
    }
    public cutFromLeft(x: number): void {
        if (x < this.clientActiveArea.x) {
            x = this.clientActiveArea.x;
        }
        if (x > this.clientActiveArea.right && this.textWrap) {
            x = this.clientActiveArea.right;
        }
        this.clientActiveArea.width = this.clientActiveArea.right > x ? this.clientActiveArea.right - x : 0;
        this.clientActiveArea.x = x;
    }
    public cutFromTop(y: number): void {
        if (y < this.clientActiveArea.y) {
            y = this.clientActiveArea.y;
        }
        if (y > this.clientActiveArea.bottom) {
            y = this.clientActiveArea.bottom;
        }
        this.clientActiveArea.height = this.clientActiveArea.bottom - y;
        this.clientActiveArea.x = this.clientArea.x;
        this.clientActiveArea.width = this.clientArea.width;
        this.clientActiveArea.y = y;
    }
    public updateClientWidth(width: number): void {
        this.clientActiveArea.x -= width;
        if (this.clientActiveArea.width + width > 0) {
            this.clientActiveArea.width += width;
        } else {
            this.clientActiveArea.width = 0;
        }
    }
    public findFocusedPage(currentPoint: Point, updateCurrentPage: boolean, updateHeaderFooterPage?: boolean): Point {
        let point: Point = new Point(currentPoint.x, currentPoint.y);
        point.x += this.documentHelper.viewerContainer.scrollLeft;
        point.y += this.documentHelper.viewerContainer.scrollTop;
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            let page: Page = this.documentHelper.pages[i];
            let pageTop: number = (page.boundingRectangle.y - this.pageGap * (i + 1)) * this.documentHelper.zoomFactor + this.pageGap * (i + 1);
            let pageHeight: number = (page.boundingRectangle.height * this.documentHelper.zoomFactor) + this.pageGap;
            let pageLeft: number = page.boundingRectangle.x;
            let pageRight: number;
            if (this instanceof PageLayoutViewer) {
                pageRight = ((page.boundingRectangle.right - pageLeft) * this.documentHelper.zoomFactor) + pageLeft;
            } else {
                pageRight = page.boundingRectangle.right + pageLeft;
            }
            if (pageTop <= point.y && pageTop + pageHeight >= point.y) {
                if (updateCurrentPage) {
                    this.documentHelper.currentPage = page;
                    if(updateHeaderFooterPage) {
                        if (!isNullOrUndefined(page.headerWidget)) {
                            page.headerWidget.page = page;
                        }
                        if (!isNullOrUndefined(page.footerWidget)) {
                            page.footerWidget.page = page;
                        }
                    }
                }
                point.y = (point.y - (pageTop)) / this.documentHelper.zoomFactor;
                if (point.x > pageRight) {
                    point.x = page.boundingRectangle.right;
                } else if (point.x < pageLeft) {
                    point.x = 0;
                } else {
                    point.x = (point.x - pageLeft) / this.documentHelper.zoomFactor;
                }
                return point;
            }
        }
        return point;
    }

    public getPageHeightAndWidth(height: number, width: number, viewerWidth: number, viewerHeight: number): PageInfo {
        height = 0;
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            height = height + this.documentHelper.pages[i].boundingRectangle.height;
        }
        width = 0;
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            if (width < this.documentHelper.pages[i].boundingRectangle.width) {
                width = this.documentHelper.pages[i].boundingRectangle.width;
            }
        }
        //this.documentHelper.visibleBoundsIn = new Rect(0, 0, width, height);
        viewerWidth = this.documentHelper.visibleBounds.width;
        viewerHeight = this.documentHelper.visibleBounds.height;
        return {
            'height': height,
            'width': width,
            'viewerWidth': viewerWidth,
            'viewerHeight': viewerHeight
        };
    }
    public renderVisiblePages(): void {
        if (isNullOrUndefined(this.visiblePages) || this.visiblePages.length < 1) {
            return;
        }
        this.documentHelper.clearContent();
        for (let i: number = 0; i < this.visiblePages.length; i++) {
            let page: Page = this.visiblePages[i];
            let width: number = page.boundingRectangle.width * this.documentHelper.zoomFactor;
            let height: number = page.boundingRectangle.height * this.documentHelper.zoomFactor;
            let x: number = page.boundingRectangle.x;
            let y: number = (page.boundingRectangle.y - this.pageGap * (i + 1)) * this.documentHelper.zoomFactor + this.pageGap * (i + 1);
            this.owner.viewer.renderPage(page, x, y, width, height);
        }
    }
    /* eslint-disable  */
    public handleZoom(): void {
        let prevScaleFactor: number = this.documentHelper.preZoomFactor;
        let page: Page = null;
        let verticalHeight: number = 0;
        let scrollToPosition: boolean = false;
        if (this.documentHelper.selection && isNullOrUndefined(this.documentHelper.zoomX && isNullOrUndefined(this.documentHelper.zoomY))) {
            let x: number = 0;
            let y: number = 0;
            let endPage: Page = this.documentHelper.selection.getPage(this.documentHelper.selection.end.currentWidget.paragraph);
            x = (this.documentHelper.visibleBounds.width - endPage.boundingRectangle.width * prevScaleFactor) / 2;
            if (x < 30) {
                x = 30;
            }
            y = endPage.boundingRectangle.y * prevScaleFactor + (this.documentHelper.pages.indexOf(endPage) + 1) * this.pageGap * (1 - prevScaleFactor);
            let caretInfo: CaretHeightInfo = this.documentHelper.selection.updateCaretSize(this.owner.selection.end, true);
            let topMargin: number = caretInfo.topMargin;
            let caretHeight: number = caretInfo.height;
            x += (this.documentHelper.selection.end.location.x) * prevScaleFactor;
            y += (this.documentHelper.selection.end.location.y + topMargin) * prevScaleFactor;
            if (x >= this.containerLeft && x <= this.documentHelper.visibleBounds.width &&
                y >= this.containerTop && y <= this.containerTop + this.documentHelper.visibleBounds.height) {
                scrollToPosition = true;
            }
        }
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            verticalHeight = verticalHeight + this.documentHelper.pages[i].boundingRectangle.height;
        }
        let horizontalWidth: number = 0;
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            if (horizontalWidth < this.documentHelper.pages[i].boundingRectangle.width) {
                horizontalWidth = this.documentHelper.pages[i].boundingRectangle.width;
            }
        }
        let height: number = (verticalHeight * this.documentHelper.zoomFactor + (this.documentHelper.pages.length + 1) * this.pageGap * (1 - this.documentHelper.zoomFactor)) - this.documentHelper.visibleBounds.height;
        let horWidth: number = horizontalWidth * this.documentHelper.zoomFactor - this.documentHelper.visibleBounds.width;
        if (this.documentHelper.visibleBounds.width - horizontalWidth * this.documentHelper.zoomFactor < 60) {
            horWidth += 60;
        }
        //Update Vertical Scroll bar
        if (height > 0) {
            let value: number = this.containerTop;
            if (this.visiblePages.length > 0) {
                page = this.visiblePages[0];
                let prevPageTop: number = (page.boundingRectangle.y - (page.index + 1) * this.pageGap) * prevScaleFactor + (page.index + 1) * this.pageGap;
                let zoomY: number = this.documentHelper.zoomY;
                if (isNullOrUndefined) {
                    zoomY = this.documentHelper.visibleBounds.height / 2;
                }
                let prevY: number = value + zoomY;
                while (prevY > prevPageTop + (page.boundingRectangle.height * prevScaleFactor)) {
                    let pageIndex: number = page.index + 1;
                    if (pageIndex === this.documentHelper.pages.length) {
                        break;
                    }
                    page = this.documentHelper.pages[pageIndex];
                    prevPageTop = (page.boundingRectangle.y - (page.index + 1) * this.pageGap) * prevScaleFactor + (page.index + 1) * this.pageGap;
                }
                let currentY: number = (page.boundingRectangle.y - (page.index + 1) * this.pageGap) * this.documentHelper.zoomFactor + (page.index + 1) * this.pageGap
                    + ((prevY - prevPageTop) < 0 ? prevY - prevPageTop : (prevY - prevPageTop) * (this.documentHelper.zoomFactor / prevScaleFactor));
                value = currentY - zoomY;
                zoomY = this.documentHelper.visibleBounds.height / 2;
            }
            this.documentHelper.viewerContainer.scrollTop = value;
        } else {
            this.documentHelper.viewerContainer.scrollTop = 0;
        }
        // update Horizontal Scroll Bar
        if (horWidth > 0) {
            let value: number = this.containerLeft;
            if (this.visiblePages.length > 0) {
                if (page === null) {
                    page = this.visiblePages[0];
                }
                let zoomX: number = this.documentHelper.zoomX;
                if (isNullOrUndefined(zoomX)) {
                    zoomX = this.documentHelper.visibleBounds.width / 2;
                }
                let prevValue: number = (page.boundingRectangle.width * prevScaleFactor) / page.boundingRectangle.width;
                let prevX: number = value + zoomX;
                let currentX: number = page.boundingRectangle.x
                    + ((prevX - page.boundingRectangle.x) < 0 ? prevX - page.boundingRectangle.x : (prevX - page.boundingRectangle.x) * (this.documentHelper.zoomFactor / prevValue));
                value = currentX - zoomX;
                zoomX = this.documentHelper.visibleBounds.width / 2;
            }
            this.documentHelper.viewerContainer.scrollLeft = value;
        } else {
            this.documentHelper.viewerContainer.scrollLeft = 0;
        }
        this.updateScrollBars();
        if (scrollToPosition) {
            this.documentHelper.scrollToPosition(this.documentHelper.selection.start, this.documentHelper.selection.end);
        }
        if (this instanceof WebLayoutViewer) {
            this.owner.editorModule.layoutWholeDocument();
        }
    }
    public updateCanvasWidthAndHeight(viewerWidth: number, viewerHeight: number, containerHeight: number, containerWidth: number, width: number, height: number): CanvasInfo {
        if (this instanceof PageLayoutViewer) {
            if (this.documentHelper.visibleBounds.width !== this.documentHelper.viewerContainer.clientWidth) {
                viewerWidth -= (this.documentHelper.visibleBounds.width - this.documentHelper.viewerContainer.clientWidth);
            } else if (containerHeight > viewerHeight) {
                viewerWidth -= this.documentHelper.viewerContainer.offsetWidth - this.documentHelper.viewerContainer.clientWidth;
            }
        } else {
            if (containerHeight > viewerHeight) {
                viewerWidth -= this.documentHelper.scrollbarWidth;
                containerWidth -= this.documentHelper.scrollbarWidth;
            }
        }
        if (containerWidth > viewerWidth) {
            viewerHeight -= this.documentHelper.scrollbarWidth;
        }
        width = containerWidth > viewerWidth ? containerWidth : viewerWidth;
        height = containerHeight > viewerHeight ? containerHeight : viewerHeight;
        if (parseInt(this.documentHelper.pageContainer.style.width.replace('px', ''), 10) !== width ||
            parseInt(this.documentHelper.pageContainer.style.height.replace('px', ''), 10) !== width) {
            this.documentHelper.pageContainer.style.width = width.toString() + 'px';
            this.documentHelper.pageContainer.style.height = height.toString() + 'px';
        }
        // if (!isNullOrUndefined(this.selection) && !this.selection.isEmpty) {
        //     this.selectionContext.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
        let displayPixelRatio: number = Math.max(1, window.devicePixelRatio || 1);
        if (this.documentHelper.containerCanvas.width !== Math.floor(viewerWidth * displayPixelRatio)
            || this.documentHelper.containerCanvas.height !== Math.floor(viewerHeight * displayPixelRatio)) {
            this.documentHelper.containerCanvas.width = viewerWidth * displayPixelRatio;
            this.documentHelper.containerCanvas.height = viewerHeight * displayPixelRatio;
            this.documentHelper.containerCanvas.style.width = viewerWidth + 'px';
            this.documentHelper.containerCanvas.style.height = viewerHeight + 'px';
            this.documentHelper.containerContext.scale(displayPixelRatio, displayPixelRatio);
            this.documentHelper.selectionCanvas.width = viewerWidth * displayPixelRatio;
            this.documentHelper.selectionCanvas.height = viewerHeight * displayPixelRatio;
            this.documentHelper.selectionCanvas.style.width = viewerWidth + 'px';
            this.documentHelper.selectionCanvas.style.height = viewerHeight + 'px';
            this.documentHelper.selectionContext.scale(displayPixelRatio, displayPixelRatio);
        }
        return {
            'height': height,
            'width': width,
            'viewerWidth': viewerWidth,
            'viewerHeight': viewerHeight,
            'containerHeight': containerHeight,
            'containerWidth': containerWidth
        };
    }
    public updateScrollBarPosition(containerWidth: number, containerHeight: number, viewerWidth: number, viewerHeight: number, width: number, height: number): void {
        this.owner.viewer.containerTop = this.documentHelper.viewerContainer.scrollTop;
        this.owner.viewer.containerWidth = containerWidth;
        this.documentHelper.containerCanvas.style.position = 'absolute';
        this.documentHelper.containerCanvas.style.top = this.owner.viewer.containerTop.toString() + 'px';
        this.documentHelper.selectionCanvas.style.position = 'absolute';
        this.documentHelper.selectionCanvas.style.top = this.owner.viewer.containerTop.toString() + 'px';
        this.owner.viewer.containerLeft = this.documentHelper.viewerContainer.scrollLeft;
        this.documentHelper.containerCanvas.style.left = this.owner.viewer.containerLeft + 'px';
        this.documentHelper.selectionCanvas.style.left = this.owner.viewer.containerLeft + 'px';
    }
    /**
     * @private
     */
    abstract get pageGap(): number;
    /**
     * @private
     */
    public abstract createNewPage(section: BodyWidget, index?: number): Page;
    /**
     * @private
     */
    public abstract renderPage(page: Page, x: number, y: number, width: number, height: number): void;
    /**
     * @private
     */
    public abstract updateScrollBars(): void;
    /**
     * private
     */
    public abstract scrollToPage(pageIndex: number): void;
    /**
     * @private
     */
    public abstract onPageFitTypeChanged(pageFitType: PageFitType): void;

    public destroy(): void {
        this.clientArea = undefined;
        this.clientActiveArea = undefined;
    }
    /**
     * Disposes the internal objects which are maintained.
     * @private
     */
    public componentDestroy(): void {
        this.clientArea = undefined;
        this.clientActiveArea = undefined;
        this.owner = undefined;
    }
}
/** 
 * @private
 */
export class PageLayoutViewer extends LayoutViewer {
    private pageLeft: number = 30;
    /**
     * @private
     */
    get pageGap(): number {
        return this.owner.pageGap;
    }
    /**
     * Initialize the constructor of PageLayoutViewer
     */
    constructor(owner: DocumentEditor) {
        super(owner);
        // if (isNullOrUndefined(owner) || isNullOrUndefined(owner.element)) {
        //     return;
        // }
        this.owner = owner;
    }
    public get documentHelper(): DocumentHelper {
        return this.owner.documentHelper;
    }
    public createNewPage(section: BodyWidget, index?: number): Page {
        let viewer: PageLayoutViewer = this;
        let yPos: number = this.pageGap;
        if (this.documentHelper.pages.length > 0) {
            yPos = this.documentHelper.pages[this.documentHelper.pages.length - 1].boundingRectangle.bottom + this.pageGap;
        }
        let page: Page = new Page(this.documentHelper);
        this.updatePageBoundingRectangle(section, page, yPos);
        if (isNullOrUndefined(index)) {
            this.documentHelper.pages.push(page);
        } else {
            this.documentHelper.pages.splice(index, 0, page);
        }
        page.bodyWidgets.push(section);
        page.bodyWidgets[page.bodyWidgets.length - 1].page = page;
        this.updateClientArea(section, page);
        this.documentHelper.layout.layoutHeaderFooter(section, viewer, page);
        this.updateClientArea(section, page);
        this.documentHelper.layout.footnoteHeight = 0;
        return page;
    }
    public updatePageBoundingRectangle(section: BodyWidget, page: Page, yPosition: number): void {
        //page.viewer = this;
        let pageWidth: number = !isNullOrUndefined(section.sectionFormat) ? HelperMethods.convertPointToPixel(section.sectionFormat.pageWidth) : 816;
        let pageHeight: number = !isNullOrUndefined(section.sectionFormat) ? HelperMethods.convertPointToPixel(section.sectionFormat.pageHeight) : 1056;
        let xPos: number = (this.documentHelper.visibleBounds.width - pageWidth * this.documentHelper.zoomFactor) / 2;
        if (xPos < this.pageLeft) {
            xPos = this.pageLeft;
        }
        page.boundingRectangle = new Rect(xPos, yPosition, pageWidth, pageHeight);
    }
    public onPageFitTypeChanged(pageFitType: PageFitType): void {
        let width: number = this.documentHelper.visibleBounds.width;
        let height: number = this.documentHelper.visibleBounds.height;
        let section: BodyWidget = this.visiblePages[0].bodyWidgets[0] as BodyWidget;
        let pageWidth: number = HelperMethods.convertPointToPixel(section.sectionFormat.pageWidth);
        let pageHeight: number = HelperMethods.convertPointToPixel(section.sectionFormat.pageHeight);
        switch (pageFitType) {
            case 'FitOnePage':
                if (height > 0 && pageHeight > 0) {
                    let zoomFactor: number = (this.documentHelper.visibleBounds.height - 2 * this.pageGap - (this.pageGap - 2)) / pageHeight;
                    if (zoomFactor === this.documentHelper.zoomFactor) {
                        if (!isNullOrUndefined(this.owner.selection) && !isNullOrUndefined(this.owner.selection.start) &&
                            !isNullOrUndefined(this.owner.selection.end)) {
                            this.documentHelper.scrollToPosition(this.owner.selection.start, this.owner.selection.end);
                        }
                    } else {
                        this.documentHelper.zoomFactor = zoomFactor;
                    }
                }
                break;
            case 'FitPageWidth':
                if (width > 0 && pageWidth > 0) {
                    this.documentHelper.zoomFactor = (this.documentHelper.visibleBounds.width - 80) / pageWidth;
                }
                break;
            default:
                this.documentHelper.zoomFactor = 100 / 100;
                break;
        }
    }
    public getCurrentPageHeaderFooter(section: BodyWidget, isHeader: boolean): HeaderFooterWidget {
        return this.getCurrentHeaderFooter(this.getHeaderFooterType(section, isHeader), section.index);
    }
    public getHeaderFooterType(section: BodyWidget, isHeader: boolean): HeaderFooterType {
        let type: HeaderFooterType;
        type = isHeader ? 'OddHeader' : 'OddFooter';
        let page: Page = section.page;
        if (section.sectionFormat.differentFirstPage && (isNullOrUndefined(page.previousPage) || (!isNullOrUndefined(page.previousPage) && page.sectionIndex !== page.previousPage.sectionIndex && page.previousPage.bodyWidgets[page.previousPage.bodyWidgets.length - 1].sectionIndex !== page.bodyWidgets[0].sectionIndex))) {
            type = isHeader ? 'FirstPageHeader' : 'FirstPageFooter';
        } else if (section.sectionFormat.differentOddAndEvenPages && (page.index + 1) % 2 === 0) {
            type = isHeader ? 'EvenHeader' : 'EvenFooter';
        }
        return type;
    }
    public getCurrentHeaderFooter(type: HeaderFooterType, sectionIndex: number): HeaderFooterWidget {
        if (this.documentHelper.headersFooters[sectionIndex]) {
            let index: number = this.getHeaderFooter(type);
            let headerFooter: HeaderFooterWidget = this.documentHelper.headersFooters[sectionIndex][index];
            if (!headerFooter) {
                let currentSecIndex: number = sectionIndex > 0 ? sectionIndex - 1 : sectionIndex;
                while (!headerFooter && currentSecIndex !== -1) {
                    headerFooter = this.documentHelper.headersFooters[currentSecIndex][index];
                    currentSecIndex--;
                }
                if (!headerFooter) {
                    headerFooter = this.createHeaderFooterWidget(type);
                    headerFooter.isEmpty = true;
                }
                if (sectionIndex == 0) {
                    this.documentHelper.headersFooters[sectionIndex][index] = headerFooter;
                }
            }
            return headerFooter;
        } else if (sectionIndex > 0) {
            return this.getCurrentHeaderFooter(type, sectionIndex - 1);
        }
        return undefined;
    }
    private createHeaderFooterWidget(type: HeaderFooterType): HeaderFooterWidget {
        const headerFooter: HeaderFooterWidget = new HeaderFooterWidget(type);
        const paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.childWidgets.push(new LineWidget(paragraph));
        let style;
        if(type.indexOf('Header') !== -1) {
            style = this.documentHelper.styles.findByName('Header') as WStyle;
        }
        else {
            style = this.documentHelper.styles.findByName('Footer') as WStyle;
        }
        paragraph.paragraphFormat.baseStyle = style;
        paragraph.paragraphFormat.listFormat.baseStyle = style;
        headerFooter.childWidgets.push(paragraph);
        paragraph.containerWidget = headerFooter;
        return headerFooter;
    }
    public getHeaderFooter(type: HeaderFooterType): number {
        switch (type) {
            case 'OddHeader':
                return 0;
            case 'OddFooter':
                return 1;
            case 'EvenHeader':
                return 2;
            case 'EvenFooter':
                return 3;
            case 'FirstPageHeader':
                return 4;
            case 'FirstPageFooter':
                return 5;
        }
    }
    public updateHFClientArea(sectionFormat: WSectionFormat, isHeader: boolean): void {
        let width: number = HelperMethods.convertPointToPixel(sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin);
        if (width < 0) {
            width = 0;
        }
        if (isHeader) {
            this.clientArea = new Rect(HelperMethods.convertPointToPixel(sectionFormat.leftMargin), HelperMethods.convertPointToPixel(sectionFormat.headerDistance), width, Number.POSITIVE_INFINITY);
        } else {
            this.clientArea = new Rect(HelperMethods.convertPointToPixel(sectionFormat.leftMargin), HelperMethods.convertPointToPixel(sectionFormat.pageHeight - sectionFormat.footerDistance), width, Number.POSITIVE_INFINITY);
        }
        this.clientActiveArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
    }
    public updateHeaderFooterClientAreaWithTop(sectionFormat: WSectionFormat, isHeader: boolean, page: Page): void {
        this.updateHFClientArea(sectionFormat, isHeader);
        if (!isHeader) {
            if (page.footerWidget.y < this.clientActiveArea.y) {
                this.clientActiveArea.y = page.footerWidget.y;
                this.clientActiveArea.height = Number.POSITIVE_INFINITY;
            }
        }
    }
    public updateFootnoteClientArea(sectionFormat: WSectionFormat, footnote: FootNoteWidget, footNoteType?: FootnoteType, para?: ParagraphWidget): void {
        let width = HelperMethods.convertPointToPixel(sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin);
        let left: number = HelperMethods.convertPointToPixel(sectionFormat.leftMargin);
        let bottomMargin: number = HelperMethods.convertPointToPixel(sectionFormat.bottomMargin);
        let footerDistance: number = HelperMethods.convertPointToPixel(sectionFormat.footerDistance);
        let top: number = HelperMethods.convertPointToPixel(sectionFormat.pageHeight) - Math.max(footerDistance + footnote.page.footerWidget.height, bottomMargin);
        this.clientArea = new Rect(left, top, width, Number.POSITIVE_INFINITY);
        this.clientActiveArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, Number.POSITIVE_INFINITY);
    }
    public scrollToPage(pageIndex: number): void {
        let top: number = 0;
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            top = this.documentHelper.pages[i].boundingRectangle.y - (this.pageGap / 2);
            if (i === pageIndex) {
                break;
            }
        }
        this.documentHelper.viewerContainer.scrollTop = top;
        this.updateScrollBars();
    }
    public updateScrollBars(): void {
        let updatePositionObj: PageInfo;
        updatePositionObj = this.getPageHeightAndWidth(0, 0, 0, 0);
        let containerWidth: number = (updatePositionObj.width * this.documentHelper.zoomFactor) + (this.pageLeft * 2);
        let containerHeight: number = (updatePositionObj.height * this.documentHelper.zoomFactor) + (this.documentHelper.pages.length + 1) * this.pageGap;
        let updateObj: CanvasInfo;
        updateObj = this.updateCanvasWidthAndHeight(updatePositionObj.viewerWidth, updatePositionObj.viewerHeight, containerHeight, containerWidth, updatePositionObj.width, updatePositionObj.height);
        containerHeight = updateObj.containerHeight;
        containerWidth = updateObj.containerWidth;
        this.documentHelper.containerContext.globalAlpha = 1;
        this.documentHelper.selectionContext.globalAlpha = 0.4;
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            let left: number = (updateObj.width - this.documentHelper.pages[i].boundingRectangle.width * this.documentHelper.zoomFactor) / 2;
            if (left > this.pageLeft) {
                this.documentHelper.pages[i].boundingRectangle = new Rect(left, this.documentHelper.pages[i].boundingRectangle.y, this.documentHelper.pages[i].boundingRectangle.width, this.documentHelper.pages[i].boundingRectangle.height);
            } else {
                this.documentHelper.pages[i].boundingRectangle = new Rect(this.pageLeft, this.documentHelper.pages[i].boundingRectangle.y, this.documentHelper.pages[i].boundingRectangle.width, this.documentHelper.pages[i].boundingRectangle.height);
            }
        }
        this.updateScrollBarPosition(containerWidth, containerHeight, updateObj.viewerWidth, updateObj.viewerHeight, updateObj.width, updateObj.height);
        this.updateVisiblePages();
        this.documentHelper.isScrollToSpellCheck = false;

    }
    public updateVisiblePages(): void {
        // Clears the container first.
        this.visiblePages = [];
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            let page: Page = this.documentHelper.pages[i];
            let y: number = (page.boundingRectangle.y - this.pageGap * (i + 1)) * this.documentHelper.zoomFactor + this.pageGap * (i + 1);
            let left: number = page.boundingRectangle.x;
            //UI Virtualization
            if (this.documentHelper.isPageInVisibleBound(page, y)) {
                this.addVisiblePage(page, left, y);
            }
        }
    }
    private addVisiblePage(page: Page, x: number, y: number): void {
        let width: number = page.boundingRectangle.width * this.documentHelper.zoomFactor;
        let height: number = page.boundingRectangle.height * this.documentHelper.zoomFactor;
        if (this.owner.enableImageResizerMode && this.owner.imageResizerModule.currentPage !== undefined && this.owner.imageResizerModule.currentPage === page && this.owner.imageResizerModule.isImageResizerVisible) {
            this.owner.imageResizerModule.setImageResizerPositions(x, y, width, height);
        }
        this.visiblePages.push(page);
        if (this.documentHelper.owner.isSpellCheck && this.documentHelper.owner.spellChecker.enableOptimizedSpellCheck && (this.owner.documentHelper.triggerElementsOnLoading || this.owner.documentHelper.isScrollHandler) && (this.documentHelper.cachedPages.indexOf(page.index) < 0 || this.owner.editor.isPasteContentCheck)) {
            this.owner.documentHelper.cachedPages.push(page.index);
            let content: string;
            if (this.owner.editor.isPasteContentCheck) {
                content = !isNullOrUndefined(this.owner.editor.copiedTextContent) ? this.owner.editor.copiedTextContent : '';
            } else {
                content = this.documentHelper.owner.spellChecker.getPageContent(page);
            }
            if (content.trim().length > 0) {
                page.allowNextPageRendering = false;
                if (!isNullOrUndefined(this.owner) && !isNullOrUndefined(this.owner.spellChecker)) {
                    this.owner.spellChecker.updateUniqueWords(HelperMethods.getSpellCheckData(content));
                }
                /* eslint-disable @typescript-eslint/no-explicit-any */
                this.owner.spellChecker.callSpellChecker(this.owner.spellChecker.languageID, content, true, false, false, true).then((data: any) => {
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    let jsonObject: any = JSON.parse(data);
                    if (!isNullOrUndefined(this.owner) && !isNullOrUndefined(this.owner.spellChecker)) {
                        this.owner.spellChecker.updateUniqueWords(jsonObject.SpellCollection);
                    }
                    page.allowNextPageRendering = true;
                    this.documentHelper.triggerElementsOnLoading = true;
                    this.documentHelper.triggerSpellCheck = true;
                    this.documentHelper.triggerElementsOnLoading = true;
                    this.renderPage(page, x, y, width, height);
                    this.documentHelper.triggerSpellCheck = false;
                    this.documentHelper.triggerElementsOnLoading = false;
                });
            } else {
                this.renderPage(page, x, y, width, height);
            }
        } else {
            this.renderPage(page, x, y, width, height);
        }
    }
    public renderPage(page: Page, x: number, y: number, width: number, height: number): void {
        this.documentHelper.render.renderWidgets(page, x - this.owner.viewer.containerLeft, y - this.owner.viewer.containerTop, width, height);
    }
 
}


export class WebLayoutViewer extends LayoutViewer {

    constructor(owner: DocumentEditor) {
        super(owner);
        /* if (isNullOrUndefined(owner) || isNullOrUndefined(owner.element)) {
             return;
         }*/
        this.owner = owner;
    }
    get documentHelper(): DocumentHelper {
        return this.owner.documentHelper;
    }
    /**
     * @private
     */
    public visiblePages: Page[] = [];
    /**
     * @private
     */
    get pageGap(): number {
        return 0;
    }
    /**
     * Creates new page.
     * @private
     */
    public createNewPage(section: BodyWidget, index?: number): Page {
        let page: Page;
        let yPos: number = 0;
        let x: number = 10;
        if (this.documentHelper.pages.length > 0) {
            yPos = this.documentHelper.pages[this.documentHelper.pages.length - 1].boundingRectangle.bottom;
        }
        page = new Page(this.documentHelper);
        if (this.documentHelper.pages.length === 0) {
            page.boundingRectangle = new Rect(x, yPos, this.documentHelper.visibleBounds.width, this.documentHelper.visibleBounds.height);
        } else {
            page.boundingRectangle = new Rect(x, yPos - 20, this.documentHelper.visibleBounds.width, this.documentHelper.visibleBounds.height);
        }
        this.documentHelper.pages.push(page);
        this.updateClientArea(undefined, page);
        page.bodyWidgets.push(section);
        page.bodyWidgets[page.bodyWidgets.length - 1].page = page;
        return page;
    }
    public onPageFitTypeChanged(pageFitType: PageFitType): void {
        this.documentHelper.zoomFactor = 1;
    }
    public scrollToPage(pageIndex: number): void {
        this.updateScrollBars();
    }
    public getContentHeight(): number {
        let height: number = 0;
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            let page: Page = this.documentHelper.pages[i];
            if (i === 0) {
                height += this.padding.top;
                page.boundingRectangle.y = this.padding.top;
            } else {
                page.boundingRectangle.y = this.documentHelper.pages[i - 1].boundingRectangle.bottom;
            }
            page.boundingRectangle.height = page.bodyWidgets[0].height;
            height += page.bodyWidgets[0].height;
            if (i === this.documentHelper.pages.length - 1) {
                height += this.padding.bottom;
            }
        }
        return height;
    }
    /**
     * @private
     */
    public getContentWidth(): number {
        let width: number = this.documentHelper.visibleBounds.width;
        let currentWidth: number = width;
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            let page: Page = this.documentHelper.pages[i];
            for (let j: number = 0; j < (page.bodyWidgets[0] as BodyWidget).childWidgets.length; j++) {
                if ((page.bodyWidgets[0] as BodyWidget).childWidgets[j] instanceof TableWidget) {
                    let tableWidget: TableWidget = page.bodyWidgets[0].childWidgets[j] as TableWidget;
                    let tableWidth: number = HelperMethods.convertPointToPixel((tableWidget as TableWidget).getTableWidth()) *
                        this.documentHelper.zoomFactor + this.padding.left * 4 + this.padding.right * 4
                        + page.boundingRectangle.x;
                    if (currentWidth < tableWidth) {
                        width = tableWidth;
                        currentWidth = tableWidth;
                    }
                }
            }
            page.boundingRectangle.width = width;
        }
        return width;
    }
    public updateScrollBars(): void {
        let updatePositionObj: PageInfo;
        updatePositionObj = this.getPageHeightAndWidth(0, 0, 0, 0);
        let containerWidth: number = this.getContentWidth() * this.documentHelper.zoomFactor + this.padding.left + this.padding.right;
        let containerHeight: number = this.getContentHeight() * this.documentHelper.zoomFactor + this.padding.top + this.padding.bottom;
        let updateObj: CanvasInfo;
        updateObj = this.updateCanvasWidthAndHeight(updatePositionObj.viewerWidth, updatePositionObj.viewerHeight, containerHeight, containerWidth, updatePositionObj.width, updatePositionObj.height);
        this.documentHelper.containerContext.globalAlpha = 1;
        this.documentHelper.selectionContext.globalAlpha = 0.4;
        this.updateScrollBarPosition(containerWidth, containerHeight, updateObj.viewerWidth, updateObj.viewerHeight, updateObj.width, updateObj.height);
        this.updateVisiblePages();
        this.documentHelper.isScrollToSpellCheck = false;
    }
    public updateVisiblePages(): void {
        this.visiblePages = [];
        let page: Page;
        let y: number;
        let height: number = this.documentHelper.visibleBounds.height;
        let vertical: number = this.documentHelper.viewerContainer.scrollTop;
        for (let i: number = 0; i < this.documentHelper.pages.length; i++) {
            page = this.documentHelper.pages[i];
            y = (page.boundingRectangle.y) * this.documentHelper.zoomFactor;
            let pageH: number = page.boundingRectangle.height * this.documentHelper.zoomFactor;
            let isTopFit: boolean = y >= vertical && y <= vertical + height;
            let isBottomFit: boolean = y + pageH >= vertical && y + pageH <= vertical + height;
            let isMiddleFit: boolean = y <= vertical && y + pageH >= vertical + height;
            //UI Virtualization
            if (isTopFit || isBottomFit || isMiddleFit) {
                this.addVisiblePage(page, this.padding.left, y);
            }
        }

    }
    public addVisiblePage(page: Page, x: number, y: number): void {
        let width: number = this.getContentWidth();
        let height: number = this.getContentHeight() * this.documentHelper.zoomFactor + this.padding.top + this.padding.bottom;
        if (this.owner.enableImageResizerMode && this.owner.imageResizerModule.currentPage !== undefined && this.owner.imageResizerModule.currentPage === page && this.owner.imageResizerModule.isImageResizerVisible) {
            this.owner.imageResizerModule.setImageResizerPositions(x, y, width, height);
        }
        this.visiblePages.push(page);
        if (this.documentHelper.owner.isSpellCheck && this.documentHelper.owner.spellChecker.enableOptimizedSpellCheck && (this.owner.documentHelper.triggerElementsOnLoading || this.owner.documentHelper.isScrollHandler) && (this.documentHelper.cachedPages.indexOf(page.index) < 0 || this.owner.editor.isPasteContentCheck)) {
            this.owner.documentHelper.cachedPages.push(page.index);
            let contentlen: string;
            if (this.owner.editor.isPasteContentCheck) {
                contentlen = !isNullOrUndefined(this.owner.editor.copiedTextContent) ? this.owner.editor.copiedTextContent : '';
            } else {
                contentlen = this.documentHelper.owner.spellChecker.getPageContent(page);
            }
            if (contentlen.trim().length > 0) {
                page.allowNextPageRendering = false;
                if (!isNullOrUndefined(this.owner) && !isNullOrUndefined(this.owner.spellChecker)) {
                    this.owner.spellChecker.updateUniqueWords(HelperMethods.getSpellCheckData(contentlen));
                }
                /* eslint-disable @typescript-eslint/no-explicit-any */
                this.owner.spellChecker.callSpellChecker(this.owner.spellChecker.languageID, contentlen, true, false, false, true).then((data: any) => {
                    /* eslint-disable @typescript-eslint/no-explicit-any */
                    let jsonObj: any = JSON.parse(data);
                    if (!isNullOrUndefined(this.owner) && !isNullOrUndefined(this.owner.spellChecker)) {
                        this.owner.spellChecker.updateUniqueWords(jsonObj.SpellCollection);
                    }
                    page.allowNextPageRendering = true;
                    this.owner.documentHelper.triggerSpellCheck = true;
                    this.owner.documentHelper.triggerElementsOnLoading = true;
                    this.renderPage(page, x, y, width, height);
                    this.owner.documentHelper.triggerSpellCheck = false;
                    this.owner.documentHelper.triggerElementsOnLoading = false;
                });
            } else {
                this.renderPage(page, x, y, width, height);
            }
        } else {
            this.renderPage(page, x, y, width, height);
        }



    }
    /**
     * @private
     */
    public renderPage(page: Page, x: number, y: number, width: number, height: number): void {
        this.documentHelper.render.renderWidgets(page, x - this.owner.viewer.containerLeft, y - this.owner.viewer.containerTop, width, height);
    }

}
/**
 * @private
 */
 export class ColumnLayout {
    private currentIndexIn: number;
    private numberOfColumnsIn: number;
    private columnIn: WColumnFormat[];
    private viewerIn: LayoutViewer;
    private defaultSpaceIn: number;
    private pageWidth: number;
    get currentIndex(): number {
        return this.currentIndexIn;
    }
    set currentIndex(value: number) {
        if (value >= 0) {
            this.currentIndexIn = value;
        }
    }
    /**
     * Initialize the constructor of Column Layout Settings
     */
    constructor(viewer: LayoutViewer) {
        this.viewerIn = viewer;
        this.clear();
    }
    private get columnCount(): number {
        let colCount: number;
        if (!isNullOrUndefined(this.columnIn)) {
            colCount = this.numberOfColumnsIn;
        }
        colCount = colCount > 0 ? colCount : 1;
        return colCount;
    }
    /**
     * @private
     * @param sectionFormat 
     */
    public setColumns(sectionFormat: WSectionFormat) {
        this.pageWidth = HelperMethods.convertPointToPixel(sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin);
        this.numberOfColumnsIn = sectionFormat.numberOfColumns;
        if (!isNullOrUndefined(sectionFormat.columns)) {
            let columns: WColumnFormat[] = sectionFormat.columns;
            let columnList: WColumnFormat[] = [];
            for (let i: number = 0; i < sectionFormat.numberOfColumns; i++) {
                let space: number = this.defaultSpaceIn;
                let width: number = 0;
                if (!isNullOrUndefined(columns) && columns.length > 0) {
                    space = columns[i].space;
                    width = columns[i].width;
                }
                let col: WColumnFormat = this.getColumnObj(width, space, sectionFormat.numberOfColumns, sectionFormat.equalWidth);
                col.index = i;
                columnList.push(col);
            }
            this.columnIn = columnList;
        }
    }
    /**
     * @private
     */
    public clear() {
        this.currentIndexIn = 0;
        this.defaultSpaceIn = 36;
        this.columnIn = null;
        this.pageWidth = 0;
    }
    reset() {
        this.currentIndex = 0;
    }
    /**
     * @private
     * @param bodyWidget 
     * @param clientArea 
     * @returns 
     */
    public getColumnBounds(bodyWidget: BodyWidget, clientArea: Rect): Rect {
        let colIndex: number = this.currentIndexIn;
        return this.getColumnBoundsByIndex(colIndex, clientArea);
    }
    /**
     * @private
     * @param bodyWidget 
     * @param clientArea 
     * @returns 
     */
    public getColumnBoundsByBodyWidget(bodyWidget: BodyWidget, clientArea: Rect) {
        let colIndex: number = bodyWidget.columnIndex;
        return this.getColumnBoundsByIndex(colIndex, clientArea);
    }
    /**
     * @private
     * @param bodyWidget 
     * @param clientArea 
     * @returns 
     */
    public getNextColumnByBodyWidget(bodyWidget: BodyWidget): WColumnFormat {
        let colIndex: number = bodyWidget.columnIndex;
        let nextColumn: WColumnFormat = this.getColumnByIndex(colIndex + 1);
        return nextColumn;
    }
    private getColumnByIndex(index: number): WColumnFormat {
        if (index >= 0 && index < this.columnCount && !isNullOrUndefined(this.columnIn) && this.columnIn.length > 0) {
            return this.columnIn[index];
        }
        return undefined;
    }
    private getColumnObj(colWidth: number, colSpace: number, noOfCols: number, isEqualWidth: boolean): WColumnFormat {
        let totalSpace = (noOfCols-1) * colSpace;
        let colObj: WColumnFormat = new WColumnFormat();
        if ((isEqualWidth || colWidth === 0) && !isNullOrUndefined(this.pageWidth)) {
            colWidth = (this.pageWidth - totalSpace) / noOfCols;
        }
        colObj.width = colWidth;
        colObj.space = colSpace;
        return colObj;
    }

    private getColumnBoundsByIndex(colIndex: number, clientArea: Rect): Rect {
        let colRect: Rect = new Rect(clientArea.x, clientArea.y, clientArea.width, clientArea.height);
        if (colIndex >= 0 && this.columnIn.length > 0) {
            let curColumn: WColumnFormat;
            let prevColumn: WColumnFormat;
            if (!isNullOrUndefined(this.columnIn[colIndex])) {
                curColumn = this.getColumnByIndex(colIndex);
                colRect.width = curColumn.width;
                for (let i: number = 0; i < colIndex; i++) {
                    prevColumn = this.columnIn[i];
                    colRect.x += prevColumn.width;
                    colRect.x += prevColumn.space;
                }
            }
        }
        return colRect;
    }
}