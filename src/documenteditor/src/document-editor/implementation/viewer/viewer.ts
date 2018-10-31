import { Dictionary } from '../../base/dictionary';
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
import { WLevelOverride } from '../list/level-override';
import { WSectionFormat, WCharacterFormat, WParagraphFormat, WStyles } from '../format/index';
import { Layout } from './layout';
import { Renderer } from './render';
import { createElement, Browser } from '@syncfusion/ej2-base';
import {
    Page, Rect, Widget, ListTextElementBox, FieldElementBox, ParagraphWidget, HeaderFooterWidget
} from './page';
import { DocumentEditor } from '../../document-editor';
import {
    BodyWidget, LineWidget, TableWidget, TableRowWidget, TableCellWidget,
    ElementBox, BlockWidget, HeaderFooters, BookmarkElementBox
} from './page';
import { HelperMethods, Point, TextPositionInfo, ImagePointInfo } from '../editor/editor-helper';
import { TextHelper, TextHeightInfo } from './text-helper';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Selection, } from '../index';
import { TextPosition } from '../selection/selection-helper';
import { Zoom } from './zooming';
import { Dialog } from '@syncfusion/ej2-popups';
import { ImageResizer } from '../editor/image-resizer';
import { HeaderFooterType, PageFitType } from '../../base/types';
import { Editor } from '../index';
import { CaretHeightInfo } from '../editor/editor-helper';
import { DocumentEditorKeyDownEventArgs } from '../../base/events-helper';

/** 
 * @private
 */
export abstract class LayoutViewer {
    /**
     * @private
     */
    public owner: DocumentEditor;
    private visibleBoundsIn: Rect;
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
    public pages: Page[];
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
    public textWrap: boolean = true;
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
    public fieldStacks: FieldElementBox[] = [];
    /**
     * @private
     */
    public splittedCellWidgets: TableCellWidget[] = [];
    /**
     * @private
     */
    public tableLefts: number[] = [];
    private tapCount: number = 0;
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
    /**
     * @private
     */
    public containerTop: number = 0;
    /**
     * @private
     */
    public containerLeft: number = 0;
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
    private dialogTarget: HTMLElement;
    private dialogInternal2: Dialog;

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
    public renderedLists: Dictionary<WAbstractList, Dictionary<number, number>>;
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
    public lists: WList[] = [];
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
    protected zoomX: number;
    /**
     * @private
     */
    protected zoomY: number;
    private zoomFactorInternal: number = 1;

    //#region Properties
    /**
     * Gets container canvas.
     * @private
     */
    get containerCanvas(): HTMLCanvasElement {
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
     * @private
     */
    get selectionCanvas(): HTMLCanvasElement {
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
     * @private
     */
    get containerContext(): CanvasRenderingContext2D {
        return this.containerCanvas.getContext('2d');
    }
    /**
     * Gets selection context.
     * @private
     */
    get selectionContext(): CanvasRenderingContext2D {
        return this.selectionCanvas.getContext('2d');
    }

    /**
     * Gets the current rendering page.
     */
    get currentRenderingPage(): Page {
        if (this.pages.length === 0) {
            return undefined;
        }
        return this.pages[this.pages.length - 1];
    }
    /**
     * Gets visible bounds.
     * @private
     */
    get visibleBounds(): Rect {
        return this.visibleBoundsIn;
    }

    /**
     * Gets or sets zoom factor.
     * @private
     */
    get zoomFactor(): number {
        return this.zoomFactorInternal;
    }
    set zoomFactor(value: number) {
        if (this.zoomFactorInternal !== value) {
            this.preZoomFactor = this.zoomFactor;
            this.zoomFactorInternal = value;
            this.zoomModule.setZoomFactor(value);
            this.owner.zoomFactor = value;
        }
    }
    /**
     * Gets the selection.
     * @private
     */
    get selection(): Selection {
        return this.owner.selection;
    }
    /**
     * Gets or sets selection start page.
     * @private
     */
    get selectionStartPage(): Page {
        return this.selectionStartPageIn;
    }
    set selectionStartPage(value: Page) {
        this.selectionStartPageIn = value;
    }
    /**
     * Gets or sets selection end page.
     * @private
     */
    get selectionEndPage(): Page {
        return this.selectionEndPageIn;
    }
    set selectionEndPage(value: Page) {
        this.selectionEndPageIn = value;
    }
    /**
     * Gets the initialized default dialog.
     * @private
     */
    get dialog(): Dialog {
        if (!this.dialogInternal) {
            this.initDialog();
        }
        return this.dialogInternal;
    }
    /**
     * Gets the initialized default dialog.
     * @private
     */
    get dialog2(): Dialog {
        if (!this.dialogInternal2) {
            this.initDialog2();
        }
        return this.dialogInternal2;
    }

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
    //#endregion

    constructor(owner: DocumentEditor) {
        this.owner = owner;
        this.pages = [];
        this.render = new Renderer(this);
        this.lists = [];
        this.abstractLists = [];
        this.characterFormat = new WCharacterFormat(this);
        this.paragraphFormat = new WParagraphFormat(this);
        this.renderedLists = new Dictionary<WAbstractList, Dictionary<number, number>>();
        this.headersFooters = [];
        this.styles = new WStyles();
        this.preDefinedStyles = new Dictionary<string, string>();
        this.initalizeStyles();
        this.bookmarks = new Dictionary<string, BookmarkElementBox>();
    }
    private initalizeStyles(): void {
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Normal', '{"type":"Paragraph","name":"Normal","next":"Normal"}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 1', '{"type":"Paragraph","name":"Heading 1","basedOn":"Normal","next":"Normal","link":"Heading 1 Char","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":12.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level1"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 2', '{"type":"Paragraph","name":"Heading 2","basedOn":"Normal","next":"Normal","link":"Heading 2 Char","characterFormat":{"fontSize":13.0,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level2"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 3', '{"type":"Paragraph","name":"Heading 3","basedOn":"Normal","next":"Normal","link":"Heading 3 Char","characterFormat":{"fontSize":12.0,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level3"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 4', '{"type":"Paragraph","name":"Heading 4","basedOn":"Normal","next":"Normal","link":"Heading 4 Char","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level4"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 5', '{"type":"Paragraph","name":"Heading 5","basedOn":"Normal","next":"Normal","link":"Heading 5 Char","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level5"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 6', '{"type":"Paragraph","name":"Heading 6","basedOn":"Normal","next":"Normal","link":"Heading 6 Char","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"paragraphFormat":{"leftIndent":0.0,"rightIndent":0.0,"firstLineIndent":0.0,"beforeSpacing":2.0,"afterSpacing":0.0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","textAlignment":"Left","outlineLevel":"Level6"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Default Paragraph Font', '{"type":"Character","name":"Default Paragraph Font"}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 1 Char', '{"type":"Character","name":"Heading 1 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":16.0,"fontFamily":"Calibri Light","fontColor":"#2F5496"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 2 Char', '{"type":"Character","name":"Heading 2 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":13.0,"fontFamily":"Calibri Light","fontColor":"#2F5496"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 3 Char', '{"type":"Character","name":"Heading 3 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontSize":12.0,"fontFamily":"Calibri Light","fontColor": "#1F3763"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 4 Char', '{"type":"Character","name":"Heading 4 Char","basedOn":"Default Paragraph Font","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 5 Char', '{"type":"Character","name":"Heading 5 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Heading 6 Char', '{"type":"Character","name":"Heading 6 Char","basedOn":"Default Paragraph Font","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Hyperlink', '{"type":"Character","name":"Hyperlink","basedOn":"Default Paragraph Font","next":"Normal","characterFormat":{"fontColor":"#0563C1","underline": "Single"}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc1', '{"type":"Paragraph","name":"Toc1","basedOn":"Normal","next":"Normal","paragraphFormat":{"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc2', '{"type":"Paragraph","name":"Toc2","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :11.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc3', '{"type":"Paragraph","name":"Toc3","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :22.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc4', '{"type":"Paragraph","name":"Toc4","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :33.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc5', '{"type":"Paragraph","name":"Toc5","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :44.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc6', '{"type":"Paragraph","name":"Toc6","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :55.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc7', '{"type":"Paragraph","name":"Toc7","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :66.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc8', '{"type":"Paragraph","name":"Toc8","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :77.0,"afterSpacing":5.0}}');
        /* tslint:disable-next-line:max-line-length */
        this.preDefinedStyles.add('Toc9', '{"type":"Paragraph","name":"Toc9","basedOn":"Normal","next":"Normal","paragraphFormat":{"leftIndent" :88.0,"afterSpacing":5.0}}');
    }
    /**
     * @private
     */
    public clearDocumentItems(): void {
        this.headersFooters = [];
        this.fields = [];
        this.bookmarks.clear();
        this.styles.clear();
        this.characterFormat.clearFormat();
        this.paragraphFormat.clearFormat();
    }
    /**
     * @private
     */
    public getAbstractListById(id: number): WAbstractList {
        if (isNullOrUndefined(this.abstractLists)) {
            return undefined;
        }
        for (let i: number = 0; i < this.abstractLists.length; i++) {
            let abstractList: WAbstractList = this.abstractLists[i];
            if (abstractList instanceof WAbstractList && (abstractList as WAbstractList).abstractListId === id) {
                return abstractList;
            }
        }
        return undefined;
    }
    /**
     * @private
     */
    public getListById(id: number): WList {
        if (isNullOrUndefined(this.lists)) {
            return undefined;
        }
        for (let i: number = 0; i < this.lists.length; i++) {
            if (!isNullOrUndefined(this.lists[i]) && (this.lists[i] as WList).listId === id) {
                return this.lists[i] as WList;
            }
        }
        return undefined;
    }
    /**
     * @private
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
     * Gets the bookmarks.
     * @private
     */
    public getBookmarks(includeHidden?: boolean): string[] {
        let bookmarks: string[] = [];
        for (let i: number = 0; i < this.bookmarks.keys.length; i++) {
            let bookmark: string = this.bookmarks.keys[i];
            if (includeHidden || bookmark.indexOf('_') !== 0) {
                bookmarks.push(bookmark);
            }
        }
        return bookmarks;
    }
    /**
     * Initializes components.
     * @private
     */
    public initializeComponents(): void {
        let element: HTMLElement = this.owner.element;
        if (isNullOrUndefined(element)) {
            return;
        }
        let viewer: LayoutViewer = this;
        this.optionsPaneContainer = createElement('div', {
            className: 'e-documenteditor-optionspane'
        }) as HTMLDivElement;
        element.appendChild(this.optionsPaneContainer);
        this.viewerContainer = createElement('div', { id: this.owner.containerId + '_viewerContainer' });
        this.viewerContainer.style.cssText = 'position:relative;backgroundColor:#FBFBFB;overflow:auto';
        this.optionsPaneContainer.appendChild(this.viewerContainer);
        this.viewerContainer.tabIndex = 0;
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
        // let locale: L10n = new L10n('documenteditor', this.owner.defaultLocale);
        // locale.setLocale(this.owner.locale);
        // setCulture(this.owner.locale);
        this.initTouchEllipse();
        this.wireEvent();
    }

    /**
     * @private
     */
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
    /**
     * @private
     */
    private createEditableIFrame(): void {
        this.iframe = createElement('iframe', {
            attrs: {
                'scrolling': 'no', 'src': 'javascript:false',
                'style': 'pointer-events:none;position:absolute;top:-10000px'
            },
            className: 'e-de-text-target'
        }) as HTMLIFrameElement;

        let innerHtml: string = '<!DOCTYPE html>'
            + '<html><head></head>'
            + '<body spellcheck="false"style="background-color:transparent;width:100%;height:100%;padding: 0px; margin: 0px;" >'
            + '<div contenteditable="true" style="background-color:transparent;width:100%;height:100%;padding: 0px; margin: 0px;"></div>'
            + '</body>'
            + '</html>';
        this.viewerContainer.appendChild(this.iframe);
        this.iframe.contentDocument.open();
        this.iframe.contentDocument.write(innerHtml);
        this.iframe.contentDocument.close();
        this.editableDiv = this.iframe.contentDocument.body.children[0] as HTMLElement;
    }
    /**
     * Wires events and methods.
     */
    private wireEvent(): void {
        if (!isNullOrUndefined(this.selection)) {
            this.selection.initCaret();
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
        this.viewerContainer.addEventListener('scroll', this.scrollHandler);
        this.viewerContainer.addEventListener('mousedown', this.onMouseDownInternal);
        this.viewerContainer.addEventListener('keydown', this.onKeyDownInternal);
        this.viewerContainer.addEventListener('mousemove', this.onMouseMoveInternal);
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
        if (navigator.userAgent.match('Firefox')) {
            this.viewerContainer.addEventListener('DOMMouseScroll', this.zoomModule.onMouseWheelInternal);
        }
        this.viewerContainer.addEventListener('mousewheel', this.zoomModule.onMouseWheelInternal);
    }
    /**
     * @private
     */
    private onTextInput = (event: TextEvent): void => {
        if (!this.isComposingIME) {
            event.preventDefault();
            let text: string = event.data;
            this.owner.editor.handleTextInput(text);
        }
    }
    //#region Composition Event
    /**
     * Fires when composition starts.
     * @private
     */
    private compositionStart = (event: CompositionEvent): void => {
        if (!Browser.isDevice && !this.owner.isReadOnlyMode) {
            this.isComposingIME = true;
            this.positionEditableTarget();
            if (this.owner.editorHistory) {
                this.owner.editor.initComplexHistory('IMEInput');
            }
        }
        this.isCompositionStart = true;
    }
    /**
     * Fires on every input during composition.
     * @private
     */
    private compositionUpdated = (event: CompositionEvent): void => {
        if (this.isComposingIME && !this.owner.isReadOnlyMode) {
            /* tslint:disable:align */
            setTimeout(() => {
                this.owner.editor.insertIMEText(this.getEditableDivTextContent(), true);
            }, 0);
        }
        this.isCompositionUpdated = true;
    }
    /**
     * Fires when user selects a character/word and finalizes the input.
     * @private
     */
    private compositionEnd = (event: CompositionEvent): void => {
        if (this.isComposingIME && !this.owner.isReadOnlyMode) {
            let text: string = this.getEditableDivTextContent();
            if (text !== '') {
                this.owner.editor.insertIMEText(text, false);
            }
            this.isComposingIME = false;
            this.lastComposedText = '';
            this.iframe.setAttribute('style', 'pointer-events:none;position:absolute;top:-10000px');
            this.editableDiv.innerHTML = '';
            if (this.owner.editorHistory) {
                this.owner.editorHistory.updateComplexHistory();
                if (text === '') {
                    // tslint:disable-next-line:max-line-length
                    //When the composition in live. The Undo operation will terminate the composition and empty text will be return from text box.
                    //At that time the the history should be updated. Undo the operation and clear the redo stack. This undo operation will not be saved for redo operation.
                    this.owner.editorHistory.undo();
                    this.owner.editorHistory.redoStack.pop();
                }
            }
        }
        event.preventDefault();
        this.isCompositionUpdated = false;
        this.isCompositionEnd = true;
    }
    private getEditableDivTextContent(): string {
        return this.editableDiv.textContent;
    }
    /**
     * @private
     */
    public positionEditableTarget(): void {
        let point: Point = this.selection.getRect(this.selection.start);
        let page: Page = this.selection.getSelectionPage(this.selection.start);
        let caretInfo: CaretHeightInfo = this.selection.updateCaretSize(this.owner.selection.start);
        let sectionFormat: WSectionFormat = page.bodyWidgets[0].sectionFormat;
        let left: number = page.boundingRectangle.x + (HelperMethods.convertPointToPixel(sectionFormat.leftMargin) * this.zoomFactor);
        let top: number = point.y;
        let pageWidth: number = sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin;

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
    // tslint:disable:no-any 
    private onImageResizer = (args: any): void => {
        if (!isNullOrUndefined(this.owner.imageResizerModule) && this.owner.imageResizerModule.isImageResizerVisible
            && this.owner.imageResizerModule.isImageResizing) {
            if (args instanceof MouseEvent) {
                this.onMouseUpInternal(args);
            } else if (args instanceof TouchEvent) {
                this.onTouchUpInternal(args);
            }
        }
    }
    // tslint:enable:no-any 
    private onKeyPressInternal = (event: KeyboardEvent): void => {
        if (!this.owner.isReadOnlyMode) {
            let key: number = event.keyCode || event.charCode;
            let char: string = '';
            if (key) {
                char = String.fromCharCode(key);
            } else if (event.key) {
                char = event.key;
            }
            // tslint:disable-next-line:max-line-length
            if (char !== 'Spacebar' && char !== '\r' && char !== '\b' && char !== '\u001B' && !this.owner.isReadOnlyMode && event.ctrlKey === false) {
                this.owner.editorModule.handleTextInput(char);
            } else if (char === 'Spacebar') {
                this.owner.editorModule.handleTextInput(' ');
            }
            event.preventDefault();
        }
    }
    private onTextInputInternal = (event: KeyboardEvent): void => {
        if (!this.owner.isReadOnlyMode) {
            this.owner.editorModule.onTextInputInternal(event);
        } else {
            this.editableDiv.innerText = '';
        }
    }

    /**
     * Fired on paste.
     * @param {ClipboardEvent} event
     * @private
     */
    public onPaste = (event: ClipboardEvent): void => {
        if (!this.owner.isReadOnlyMode) {
            this.owner.editorModule.pasteInternal(event);
        }
        this.editableDiv.innerText = '';
        event.preventDefault();
    }
    /**
     * Initializes dialog template.
     */
    private initDialog(): void {
        if (!this.dialogInternal) {
            this.dialogTarget = createElement('div', { className: 'e-de-dlg-target' });
            document.body.appendChild(this.dialogTarget);
            this.dialogInternal = new Dialog({
                target: document.body, showCloseIcon: true,
                allowDragging: true, visible: false, width: '1px', isModal: true, position: { X: 'center', Y: 'center' }, zIndex: 20
            });
            this.dialogInternal.open = this.selection.hideCaret;
            this.dialogInternal.beforeClose = this.updateFocus;
            this.dialogInternal.appendTo(this.dialogTarget);
        }
    }
    /**
     * Initializes dialog template.
     */
    private initDialog2(): void {
        if (!this.dialogInternal2) {
            let target: HTMLElement = createElement('div', { className: 'e-de-dlg-target' });
            document.body.appendChild(target);
            this.dialogInternal2 = new Dialog({
                target: document.body, showCloseIcon: true,
                allowDragging: true, visible: false, width: '1px', isModal: true, position: { X: 'center', Y: 'Top' }, zIndex: 10
            });
            this.dialogInternal2.appendTo(target);
        }
    }
    /**
     * Fires when editable div loses focus.
     * @private
     */
    public onFocusOut = (): void => {
        if (!isNullOrUndefined(this.selection)) {
            if (this.owner.contextMenuModule && this.owner.contextMenuModule.contextMenuInstance &&
                this.owner.contextMenuModule.contextMenuInstance.element.style.display === 'block') {
                return;
            }
            this.selection.hideCaret();
        }
    }
    /**
     * Updates focus to editor area.
     * @private
     */
    public updateFocus = (): void => {
        if (this.selection) {
            this.editableDiv.focus();
            this.selection.showCaret();
        }
    }


    /**
     * Clears the context.
     * @private
     */
    public clearContent(): void {
        this.containerContext.clearRect(0, 0, this.containerCanvas.width, this.containerCanvas.height);
        this.selectionContext.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
    }
    /**
     * Fired when the document gets changed.
     * @param {WordDocument} document
     */
    public onDocumentChanged(sections: BodyWidget[]): void {
        this.clearContent();
        if (this.owner.editorModule) {
            this.owner.editorModule.tocStyles = {};
            this.owner.editorModule.tocBookmarkId = 0;
        }
        this.heightInfoCollection = {};
        this.owner.isDocumentLoaded = false;
        for (let i: number = 0; i < this.pages.length; i++) {
            this.pages[i].bodyWidgets[0].destroy();
        }
        this.pages = [];
        if (!isNullOrUndefined(this.renderedLists)) {
            this.renderedLists.clear();
        }
        if (!isNullOrUndefined(this.owner.editorHistory)) {
            this.owner.editorHistory.destroy();
        }
        this.owner.isDocumentLoaded = true;
        this.layout.isInitialLoad = true;
        this.layout.layoutItems(sections);
        if (this.owner.selection) {
            this.owner.selection.selectRange(this.owner.documentStart, this.owner.documentStart);
        }
        if (this.owner.optionsPaneModule) {
            this.owner.optionsPaneModule.showHideOptionsPane(false);
        }
        this.owner.fireDocumentChange();
    }
    /**
     * Fires on scrolling.
     */
    private scrollHandler = (): void => {
        this.clearContent();
        this.updateScrollBars();
        let vtHeight: number = this.containerTop + this.visibleBounds.height;
        if (vtHeight > this.pageContainer.offsetHeight) {
            this.viewerContainer.scrollTop = this.containerTop - (vtHeight - this.pageContainer.offsetHeight);
        }
        let viewer: LayoutViewer = this;
        if (viewer instanceof PageLayoutViewer && !isNullOrUndefined(this.owner)) {
            this.owner.fireViewChange();
        }
    }
    /**
     * Fires when the window gets resized.
     * @private
     */
    public onWindowResize = (): void => {
        let viewer: LayoutViewer = this;
        let resizeTimer: number;

        /* tslint:disable:align */
        resizeTimer = setTimeout((): void => {
            if (!isNullOrUndefined(viewer.owner) && !isNullOrUndefined(this.owner.element)) {
                viewer.updateViewerSizeInternal(document.getElementById(viewer.owner.element.id));
                viewer.updateScrollBars();
                if (!isNullOrUndefined(this.selection)) {
                    this.selection.updateCaretPosition();
                }
                viewer.updateTouchMarkPosition();
                if (viewer.owner.contextMenuModule && viewer.owner.contextMenuModule.contextMenuInstance) {
                    viewer.owner.contextMenuModule.contextMenuInstance.close();
                }
                if (resizeTimer) {
                    clearTimeout(resizeTimer);
                }
            }
        }, 100);
    }
    /**
     * @private
     */
    public onContextMenu = (event: PointerEvent): void => {
        if (this.owner.contextMenuModule) {
            this.owner.contextMenuModule.onContextMenuInternal(event);
        }
    }
    /**
     * Initialize touch ellipse.
     */
    private initTouchEllipse(): void {
        let style: string = 'height: 30px;width: 30px;position: absolute;background-color: transparent;margin: 0px;padding: 0px;z-index:5';
        // tslint:disable-next-line:max-line-length
        let ellipse: string = ' height: 12px;width: 12px;border-radius: 50%;background-color: white;position: absolute;margin: 0px 6px 0px 6px;border-width: 2px;border-style: solid;border-color: #000000;';
        this.touchStart = createElement('div', { className: 'e-touch-ellipse', styles: style });
        let start: HTMLElement = createElement('div', { styles: ellipse });
        this.touchEnd = createElement('div', { className: 'e-touch-ellipse', styles: style });
        this.touchStart.style.display = 'none';
        let end: HTMLElement = createElement('div', { styles: ellipse });
        this.touchStart.appendChild(start);
        this.touchEnd.appendChild(end);
        this.touchEnd.style.display = 'none';
        this.viewerContainer.appendChild(this.touchStart);
        this.viewerContainer.appendChild(this.touchEnd);
    }
    /**
     * Updates touch mark position.
     * @private
     */
    public updateTouchMarkPosition(): void {
        if (this.touchStart.style.display !== 'none' && !isNullOrUndefined(this.selection)) {
            if (!this.selection.isEmpty) {
                let y: number = this.selection.getCaretBottom(this.selection.start, false);
                let page: Page = this.selection.getPage(this.selection.start.paragraph);
                let viewer: LayoutViewer = this;
                // tslint:disable-next-line:max-line-length
                let pageTop: number = (page.boundingRectangle.y - (viewer as PageLayoutViewer).pageGap * (this.pages.indexOf(page) + 1)) * this.zoomFactor + (viewer as PageLayoutViewer).pageGap * (this.pages.indexOf(page) + 1);
                // tslint:disable-next-line:max-line-length
                this.touchStart.style.left = page.boundingRectangle.x + (Math.round(this.selection.start.location.x) * this.zoomFactor - 14) + 'px';
                this.touchStart.style.top = pageTop + ((y) * this.zoomFactor) + 'px';
                if (!this.selection.isEmpty) {
                    y = this.selection.getCaretBottom(this.selection.end, false);
                    page = this.selection.getPage(this.selection.end.paragraph);
                }
                // tslint:disable-next-line:max-line-length
                this.touchEnd.style.left = page.boundingRectangle.x + (Math.round(this.selection.end.location.x) * this.zoomFactor - 14) + 'px';
                this.touchEnd.style.top = pageTop + (y * this.zoomFactor) + 'px';
            } else {
                this.selection.updateCaretPosition();
            }
        }
    }
    /**
     * Called on mouse down. 
     * @param {MouseEvent} event
     * @private
     */
    public onMouseDownInternal = (event: MouseEvent): void => {
        if (this.isTouchInput || event.offsetX > (this.visibleBounds.width - (this.visibleBounds.width - this.viewerContainer.clientWidth))
            || event.offsetY > (this.visibleBounds.height - (this.visibleBounds.height - this.viewerContainer.clientHeight))) {
            return;
        }
        if (!isNullOrUndefined(this.selection)) {
            this.updateCursor(event);
            // tslint:disable-next-line:max-line-length
            if (this.isLeftButtonPressed(event) && !this.owner.isReadOnlyMode && this.owner.enableImageResizerMode && !isNullOrUndefined(this.owner.imageResizerModule.selectedResizeElement)) {
                this.owner.imageResizerModule.isImageResizing = true;
            }
            event.preventDefault();
            if (!this.isTouchInput) {
                this.selection.hideCaret();
            }
            let cursorPoint: Point = new Point(event.offsetX, event.offsetY);
            let touchPoint: Point = this.findFocusedPage(cursorPoint, true);
            this.mouseDownOffset.x = touchPoint.x;
            this.mouseDownOffset.y = touchPoint.y;
            // tslint:disable-next-line:max-line-length
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
            if (event.which === 3 && !this.owner.selection.isEmpty
                && this.selection.checkCursorIsInSelection(this.getLineWidget(touchPoint), touchPoint)) {
                event.preventDefault();
                return;
            }
            this.isTouchInput = false;
            this.isMouseDown = true;
            this.updateFocus();
            /* tslint:disable:align */
            this.timer = setTimeout((): void => {
                this.tapCount++;
                if (this.tapCount === 4) {
                    this.tapCount = 1;
                }
            }, 200);
        }
    }

    /**
     * Called on mouse move.
     * @param {MouseEvent} event
     * @private
     */
    public onMouseMoveInternal = (event: MouseEvent): void => {
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
            let cursorPoint: Point = new Point(event.offsetX, event.offsetY);
            let touchPoint: Point = this.findFocusedPage(cursorPoint, !this.owner.enableHeaderAndFooter);
            if (this.isMouseDown) {
                if (!isNullOrUndefined(this.currentPage)) {
                    let xPosition: number = touchPoint.x;
                    let yPosition: number = touchPoint.y;
                    if (!this.owner.isReadOnlyMode && this.isRowOrCellResizing) {
                        this.owner.editorModule.tableResize.handleResizing(touchPoint);
                    } else {
                        if (!(this.isTouchInput || this.isSelectionChangedOnMouseMoved || this.touchDownOnSelectionMark > 0)) {
                            this.updateTextPositionForSelection(touchPoint, 1);
                        }
                        if (this.isLeftButtonPressed(event)) {
                            event.preventDefault();
                            let touchY: number = yPosition;
                            let textPosition: TextPosition = this.owner.selection.end;
                            let touchPoint: Point = new Point(xPosition, touchY);
                            if (!this.owner.enableImageResizerMode || !this.owner.imageResizerModule.isImageResizerVisible) {
                                this.owner.selection.moveTextPosition(touchPoint, textPosition);
                            }
                            this.isSelectionChangedOnMouseMoved = true;
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
    }

    /**
     * Fired on double tap.
     * @param {MouseEvent} event
     * @private
     */
    public onDoubleTap = (event: MouseEvent): void => {
        if (!isNullOrUndefined(this.selection)) {
            this.isTouchInput = false;
            let cursorPoint: Point = new Point(event.offsetX, event.offsetY);
            if (this.selection.checkAndEnableHeaderFooter(cursorPoint, this.findFocusedPage(cursorPoint, true))) {
                return;
            }
            // tslint:disable-next-line:max-line-length
            if (this.selection.isEmpty && !isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.owner.selection.start)) {
                this.owner.selection.selectCurrentWord();
                this.selection.checkForCursorVisibility();
                this.tapCount = 2;
            }
        }
    }
    /**
     * Called on mouse up.
     * @param {MouseEvent} event
     * @private
     */
    public onMouseUpInternal = (event: MouseEvent): void => {
        event.preventDefault();
        this.isListTextSelected = false;
        let cursorPoint: Point = new Point(event.offsetX, event.offsetY);
        let touchPoint: Point = this.findFocusedPage(cursorPoint, true);
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
                    this.updateTextPositionForSelection(touchPoint, tapCount);
                    if (Browser.isIE && tapCount === 2) {
                        this.selection.checkAndEnableHeaderFooter(cursorPoint, touchPoint);
                    }
                }
                this.selection.checkForCursorVisibility();
            }
            if (!isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.owner.selection.start)
                && (this.owner.selection.isEmpty || this.owner.selection.isImageSelected) &&
                (((event.ctrlKey && this.owner.useCtrlClickToFollowHyperlink ||
                    !this.owner.useCtrlClickToFollowHyperlink) && this.isLeftButtonPressed(event) === true))) {
                this.selection.navigateHyperLinkOnEvent(touchPoint, false);
            }
            if (!this.owner.isReadOnlyMode && this.isSelectionInListText(touchPoint)) {
                this.selection.selectListText();
            }
            // tslint:disable-next-line:max-line-length
            if (!this.owner.isReadOnlyMode && this.owner.enableImageResizerMode && this.owner.imageResizerModule.isImageResizing) {
                this.owner.imageResizerModule.mouseUpInternal();
                this.scrollToPosition(this.owner.selection.start, this.owner.selection.end);
                this.owner.imageResizerModule.isImageResizing = false;
                this.owner.imageResizerModule.updateHistoryForImageResizer();
            }
            // tslint:disable-next-line:max-line-length
            if (this.owner.enableImageResizerMode && this.owner.imageResizerModule.isImageResizerVisible && !isNullOrUndefined(this.selection.caret)) {
                this.selection.caret.style.display = 'none';
            }
            this.isMouseDown = false;
            this.isSelectionChangedOnMouseMoved = false;
            this.isTouchInput = false;
            this.useTouchSelectionMark = true;
            this.isControlPressed = false;
            this.updateFocus();
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
    /**
     * Check whether touch point is inside the rectangle or not.
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     * @param touchPoint 
     * @private
     */
    public isInsideRect(x: number, y: number, width: number, height: number, touchPoint: Point): boolean {
        if ((touchPoint.x > x && touchPoint.x <= x + width) && (touchPoint.y > y && touchPoint.y <= y + height)) {
            return true;
        }
        return false;
    }
    /**
     * @private
     */
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
     */
    private isLeftButtonPressed(event: MouseEvent): boolean {
        this.isTouchInput = false;
        let button: number = event.which || event.button;
        return button === 1;
    }
    /**
     * Fired on touch start.
     * @param {TouchEvent} event
     * @private
     */
    public onTouchStartInternal = (event: Event): void => {
        if (this.selection) {
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
                point = this.findFocusedPage(point, true);
                if (this.owner.enableImageResizerMode) {
                    let resizeObj: ImagePointInfo = this.owner.imageResizerModule.getImagePointOnTouch(point);
                    this.owner.imageResizerModule.selectedResizeElement = resizeObj.selectedElement;
                }
                // tslint:disable-next-line:max-line-length
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
            this.timer = setTimeout((): void => {
                this.isTimerStarted = false;
            }, 200);
        }
    }
    /**
     * Fired on touch move.
     * @param {TouchEvent} event
     * @private
     */
    public onTouchMoveInternal = (event: TouchEvent): void => {
        let touch: TouchList = (event as TouchEvent).touches;
        let cursorPoint: Point;
        if (!isNullOrUndefined(this.selection)) {
            // tslint:disable-next-line:max-line-length
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
                let touchPoint: Point = this.findFocusedPage(cursorPoint, true);
                if (this.touchDownOnSelectionMark > 0 /*|| !this.useTouchSelectionMark*/) {
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
            }
        }
        if (touch.length > 1) {
            event.preventDefault();
            this.isMouseDown = false;
            this.zoomX = (touch[0].clientX + touch[1].clientX) / 2;
            this.zoomY = (touch[0].clientY + touch[1].clientY) / 2;
            // tslint:disable-next-line:max-line-length
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
    }
    /**
     * Fired on touch up.
     * @param {TouchEvent} event
     * @private
     */
    public onTouchUpInternal = (event: TouchEvent): void => {
        if (!isNullOrUndefined(this.selection)) {
            let point: Point = this.getTouchOffsetValue(event);
            let touchPoint: Point = this.findFocusedPage(point, true);
            if (event.changedTouches.length === 1) {
                this.zoomX = undefined;
                this.zoomY = undefined;
                // tslint:disable-next-line:max-line-length
                if (this.isMouseDown && !this.isSelectionChangedOnMouseMoved && !isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.owner.selection.start)) {
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
                if (!isNullOrUndefined(this.currentPage) && !isNullOrUndefined(this.selection.start)
                    && !this.isSelectionChangedOnMouseMoved && (this.selection.isEmpty ||
                        this.selection.isImageField() && (!this.owner.enableImageResizerMode ||
                            this.owner.enableImageResizerMode && !this.owner.imageResizerModule.isImageResizing))) {
                    this.selection.navigateHyperLinkOnEvent(touchPoint, true);
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
                this.owner.imageResizerModule.updateHistoryForImageResizer();
            }
            // tslint:disable-next-line:max-line-length
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
        if (!this.isTimerStarted) {
            this.tapCount = 1;
        }
        if (this.isListTextSelected) {
            this.selection.hideCaret();
        }
    }
    /**
     * Gets touch offset value.
     */
    private getTouchOffsetValue(event: TouchEvent): Point {
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
     * @param {TouchEvent} event
     */
    private onPinchInInternal(event: TouchEvent): void {
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
    /**
     * Fired on pinch zoom out.
     * @param {TouchEvent} event
     */
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
    /**
     * Gets page width.
     * @private
     */
    public getPageWidth(page: Page): number {
        let width: number = page.boundingRectangle.width;
        return width;
    }


    /**
     * Removes specified page.
     * @private
     */
    public removePage(page: Page): void {
        if (this.currentPage === page) {
            this.currentPage = undefined;
        }
        let index: number = this.pages.indexOf(page);
        // if (index > -1) {
        this.pages.splice(index, 1);
        // }        
        //this.removeRenderedPages();
        let viewer: LayoutViewer = this;
        if (!isNullOrUndefined((viewer as PageLayoutViewer).visiblePages)) {
            if (((viewer as PageLayoutViewer).visiblePages).indexOf(page) > -1) {
                let pageIndex: number = ((viewer as PageLayoutViewer).visiblePages).indexOf(page);
                ((viewer as PageLayoutViewer).visiblePages).splice(pageIndex, 1);
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
                // tslint:disable-next-line:max-line-length
                page.boundingRectangle = new Rect(page.boundingRectangle.x, top, page.boundingRectangle.width, page.boundingRectangle.height);
                top = page.boundingRectangle.bottom + 20;
                page.repeatHeaderRowTableWidget = false;
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
     * @private
     */
    public updateViewerSize(): void {
        let viewer: LayoutViewer = this;
        let element: HTMLElement = this.owner.getDocumentEditorElement();
        viewer.updateViewerSizeInternal(element);
        viewer.updateScrollBars();
        if (!isNullOrUndefined(this.selection)) {
            this.selection.updateCaretPosition();
        }
    }
    /**
     * Updates viewer size.
     */
    private updateViewerSizeInternal(element: HTMLElement): void {
        if (!isNullOrUndefined(element)) {
            let rect: ClientRect = element.getBoundingClientRect();
            let width: number = 0;
            let height: number = 0;
            height = rect.height > 0 ? rect.height : 200;
            if (this.owner.optionsPaneModule && this.owner.optionsPaneModule.isOptionsPaneShow) {
                let optionsRect: ClientRect = this.owner.optionsPaneModule.optionsPane.getBoundingClientRect();
                width = (rect.width - optionsRect.width) > 0 ? (rect.width - optionsRect.width) : 200;
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
        }
    }
    /**
     * Updates client area for block.
     * @private
     */
    public updateClientAreaForBlock(block: BlockWidget, beforeLayout: boolean, tableCollection?: TableWidget[]): void {
        let leftIndent: number = HelperMethods.convertPointToPixel((block as BlockWidget).leftIndent);
        let rightIndent: number = HelperMethods.convertPointToPixel((block as BlockWidget).rightIndent);
        if (beforeLayout) {
            if (block instanceof TableWidget && tableCollection) {
                let tableWidget: TableWidget = tableCollection[0];
                this.clientActiveArea.x = this.clientArea.x = tableWidget.x;
                this.clientActiveArea.width = this.clientArea.width = tableWidget.width;
                //Updates the location of last item.
                tableWidget = tableCollection[tableCollection.length - 1] as TableWidget;
                tableWidget.x = this.clientActiveArea.x;
                tableWidget.y = this.clientActiveArea.y;
                this.clientArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
                // tslint:disable-next-line:max-line-length
                this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);
            } else {
                // tslint:disable-next-line:max-line-length
                if (block instanceof TableWidget && !isNullOrUndefined((block as TableWidget).tableFormat) && (block as TableWidget).tableFormat.tableAlignment !== 'Left') {
                    if (!block.isGridUpdated) {
                        block.buildTableColumns();
                        block.isGridUpdated = true;
                    }
                    let tableWidth: number = block.getMaxRowWidth(block.getTableClientWidth(block.getOwnerWidth(false)));
                    // Fore resizing table, the tableholder table width taken for updated width. 
                    // Since, the columns will be cleared if we performed resizing.
                    if (this.owner.editor && this.owner.editor.tableResize.currentResizingTable === block
                        && this.owner.editor.tableResize.resizerPosition === 0) {
                        tableWidth = block.tableHolder.tableWidth;
                    }
                    tableWidth = HelperMethods.convertPointToPixel(tableWidth);
                    if ((block as TableWidget).tableFormat.tableAlignment === 'Center') {
                        leftIndent = (this.clientArea.width - tableWidth) / 2;
                    } else {
                        leftIndent = this.clientArea.width - tableWidth;
                    }
                    this.tableLefts.push(leftIndent);
                }
                this.clientActiveArea.x = this.clientArea.x = this.clientArea.x + leftIndent;
                let width: number = this.clientArea.width - (leftIndent + rightIndent);
                this.clientActiveArea.width = this.clientArea.width = width > 0 ? width : 0;

                // tslint:disable-next-line:max-line-length
                this.clientArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
                // tslint:disable-next-line:max-line-length
                this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);

            }
        } else {
            // tslint:disable-next-line:max-line-length
            if (block instanceof TableWidget && (block as TableWidget).tableFormat.tableAlignment !== 'Left' && this.tableLefts.length > 0) {
                leftIndent = this.tableLefts.pop();
            }
            this.clientActiveArea.x = this.clientArea.x = this.clientArea.x - leftIndent;
            let width: number = this.clientArea.width + leftIndent + rightIndent;
            this.clientActiveArea.width = this.clientArea.width = width > 0 ? width : 0;
            this.clientArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
            // tslint:disable-next-line:max-line-length
            this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);
        }
    }
    /**
     * Updates client active area left.
     * @private
     */
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
    /**
     * Updates client active area top.
     * @private
     */
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
    /**
     * Updates client width.
     * @private
     */
    public updateClientWidth(width: number): void {
        this.clientActiveArea.x -= width;
        if (this.clientActiveArea.width + width > 0) {
            this.clientActiveArea.width += width;
        } else {
            this.clientActiveArea.width = 0;
        }
    }
    /**
     * Inserts page in specified index.
     * @private
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
    /**
     * Updates client area.
     * @private
     */
    public updateClientArea(sectionFormat: WSectionFormat, page: Page): void {
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
        if (!isNullOrUndefined(page.headerWidget)) {
            top = Math.min(Math.max(headerDistance + page.headerWidget.height, top), pageHeight / 100 * 40);
        }
        let bottom: number = 0.667 + bottomMargin;
        if (!isNullOrUndefined(page.footerWidget)) {
            bottom = 0.667 + Math.min(pageHeight / 100 * 40, Math.max(footerDistance + page.footerWidget.height, bottomMargin));
        }
        let width: number = 0; let height: number = 0;
        if (!isNullOrUndefined(sectionFormat)) {
            width = HelperMethods.convertPointToPixel(sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin);
            height = pageHeight - top - bottom;
        }
        if (width < 0) {
            width = 0;
        }
        this.clientArea = new Rect(HelperMethods.convertPointToPixel(sectionFormat.leftMargin), top, width, pageHeight - top - bottom);
        this.clientActiveArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
    }
    /**
     * Updates client area left or top position.
     * @private
     */
    public updateClientAreaTopOrLeft(tableWidget: TableWidget, beforeLayout: boolean): void {
        if (beforeLayout) {
            this.clientActiveArea.y = this.clientActiveArea.y + tableWidget.topBorderWidth;
            this.clientActiveArea.x = this.clientActiveArea.x + tableWidget.leftBorderWidth;
        }
    }
    /**
     * Updates client area for table.
     * @private
     */
    public updateClientAreaForTable(tableWidget: TableWidget): void {
        this.clientActiveArea.x = this.clientArea.x = tableWidget.x;
        this.clientActiveArea.width = this.clientArea.width = tableWidget.width;
    }
    /**
     * Updates client area for row.
     * @private
     */
    public updateClientAreaForRow(row: TableRowWidget, beforeLayout: boolean): void {
        // tslint:disable-next-line:max-line-length
        let tableWidget: TableWidget = row.ownerTable as TableWidget;
        if (beforeLayout) {
            //tslint:disable:no-empty
        } else {
            this.clientActiveArea.x = this.clientArea.x = tableWidget.x;
            this.clientActiveArea.width = this.clientArea.width = tableWidget.width;
            this.clientArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
            // tslint:disable-next-line:max-line-length
            this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);
        }
    }
    /**
     * Updates client area for cell.
     * @private
     */
    public updateClientAreaForCell(cell: TableCellWidget, beforeLayout: boolean): void {
        // tslint:disable-next-line:max-line-length
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
            // tslint:disable-next-line:max-line-length
            this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);
        } else {
            this.clientActiveArea.x = this.clientArea.x = cellWidget.x + cellWidget.width + cellWidget.margin.right;
            if (rowWidget.x + rowWidget.width - this.clientArea.x < 0) {
                this.clientActiveArea.width = this.clientArea.width = 0;
            } else {
                this.clientActiveArea.width = this.clientArea.width = rowWidget.x + rowWidget.width - this.clientArea.x;
            }
            // tslint:disable-next-line:max-line-length
            this.clientActiveArea.y = cellWidget.y - cellWidget.margin.top - HelperMethods.convertPointToPixel(cell.ownerTable.tableFormat.cellSpacing);
            if (!cell.ownerTable.isInsideTable) {
                this.clientActiveArea.height = this.clientArea.bottom - rowWidget.y > 0 ? this.clientArea.bottom - rowWidget.y : 0;
            }
            this.clientArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
            // tslint:disable-next-line:max-line-length
            this.clientActiveArea = new Rect(this.clientActiveArea.x, this.clientActiveArea.y, this.clientActiveArea.width, this.clientActiveArea.height);
        }
    }
    /**
     * Updates the client area based on widget.
     * @private
     */
    public updateClientAreaByWidget(widget: ParagraphWidget): void {
        this.clientArea.x = widget.x;
        this.clientArea.y = widget.y;
        this.clientActiveArea.x = widget.x;
        this.clientActiveArea.y = widget.y;
    }
    //Widget
    /**
     * Updates client area location.    
     * @param widget 
     * @param area 
     * @private
     */
    public updateClientAreaLocation(widget: Widget, area: Rect): void {
        widget.x = area.x;
        widget.y = area.y;
        widget.width = area.width;
    }

    /**
     * Updates text position for selection.
     * @param cursorPoint 
     * @param tapCount 
     * @param clearMultiSelection 
     * @private
     */
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
                    this.owner.selection.selectCurrentParagraph();
                }
            }
        }
    }
    /**
     * Scrolls to specified position.
     * @param startPosition 
     * @param endPosition 
     * @private
     */
    public scrollToPosition(startPosition: TextPosition, endPosition: TextPosition): void {
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
        let viewer: LayoutViewer = this;
        let horizontalWidth: number = 0;
        let isPageLayout: boolean = viewer instanceof PageLayoutViewer;
        if (isPageLayout) {
            let pageLayout: PageLayoutViewer = viewer as PageLayoutViewer;
            if (isNullOrUndefined(endPage)) {
                return;
            }
            let pageWidth: number = endPage.boundingRectangle.width;
            x = (this.visibleBounds.width - pageWidth * this.zoomFactor) / 2;
            if (x < 30) {
                x = 30;
            }
            // tslint:disable-next-line:max-line-length
            y = endPage.boundingRectangle.y * this.zoomFactor + (this.pages.indexOf(endPage) + 1) * (viewer as PageLayoutViewer).pageGap * (1 - this.zoomFactor);
        }
        let scrollTop: number = this.containerTop;
        let scrollLeft: number = this.containerLeft;
        let pageHeight: number = this.visibleBounds.height;
        let caretInfo: CaretHeightInfo = this.selection.updateCaretSize(this.owner.selection.end, true);
        let topMargin: number = caretInfo.topMargin;
        let caretHeight: number = caretInfo.height;
        x += (endPosition.location.x) * this.zoomFactor;
        y += (endPosition.location.y + topMargin) * this.zoomFactor;
        //vertical scroll bar update
        if ((scrollTop + 20) > y) {
            this.viewerContainer.scrollTop = (y - 10);
        } else if (scrollTop + pageHeight < y + caretHeight) {
            this.viewerContainer.scrollTop = y + caretHeight - pageHeight + 10;
        } else {
            this.selection.updateCaretToPage(startPosition, endPage);
        }
        this.selection.updateCaretToPage(startPosition, endPage);
        let scrollBarWidth: number = this.viewerContainer.offsetWidth - this.viewerContainer.clientWidth;
        if (scrollLeft > x) {
            this.viewerContainer.scrollLeft = x - (viewer.pageContainer.offsetWidth / 100) * 20;
        } else if (scrollLeft + this.visibleBounds.width < x + scrollBarWidth) {
            this.viewerContainer.scrollLeft = scrollLeft + (viewer.pageContainer.offsetWidth / 100) * 15 + scrollBarWidth;
        }
    }
    /**
     * Gets line widget using cursor point.
     * @private
     */
    public getLineWidget(cursorPoint: Point): LineWidget {
        return this.getLineWidgetInternal(cursorPoint, false);
    }
    /**
     * Gets line widget.
     * @private
     */
    public getLineWidgetInternal(cursorPoint: Point, isMouseDragged: boolean): LineWidget {
        let widget: LineWidget = undefined;
        if (!isNullOrUndefined(this.currentPage)) {
            let childWidgets: Widget;
            if (this.owner.enableHeaderAndFooter) {
                let page: Page = this.currentPage;
                let pageTop: number = this.selection.getPageTop(page);
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
                return this.selection.getLineWidgetBodyWidget(childWidgets, cursorPoint);
            } else {
                for (let i: number = 0; i < this.currentPage.bodyWidgets.length; i++) {
                    let bodyWidgets: BodyWidget = this.currentPage.bodyWidgets[i];
                    widget = this.selection.getLineWidgetBodyWidget(bodyWidgets, cursorPoint);
                    if (!isNullOrUndefined(widget)) {
                        break;
                    }
                }
            }
        }
        return widget;
    }
    /**
     * @private
     */
    public isBlockInHeader(block: Widget): boolean {
        while (!(block.containerWidget instanceof HeaderFooterWidget)) {
            if (!block.containerWidget) {
                return false;
            }
            block = block.containerWidget as BlockWidget;
        }
        return (block.containerWidget as HeaderFooterWidget).headerFooterType.indexOf('Header') !== -1;
    }
    /**
     * Clears selection highlight.
     * @private
     */
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
     * @private
     */
    public onKeyUpInternal = (event: KeyboardEvent): void => {
        if (Browser.isDevice) {
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
     * @private
     */
    public onKeyDownInternal = (event: KeyboardEvent): void => {
        let isHandled: boolean = false;
        let keyEventArgs: DocumentEditorKeyDownEventArgs = { 'event': event, 'isHandled': false, source: this.owner };
        this.owner.trigger('keyDown', keyEventArgs);
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
    }
    /**
     * @private
     */
    public removeEmptyPages(): void {
        let scrollToLastPage: boolean = false;
        let viewer: LayoutViewer = this;
        for (let j: number = 0; j < this.pages.length; j++) {
            let page: Page = this.pages[j];
            if (page.bodyWidgets.length === 0 || page.bodyWidgets[0].childWidgets.length === 0) {
                // tslint:disable-next-line:max-line-length
                if (j === this.pages.length - 1 && viewer instanceof PageLayoutViewer && viewer.visiblePages.indexOf(this.pages[j]) !== -1) {
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
     */
    public scrollToBottom(): void {
        if (this.selection.start.paragraph && this.selection.start.paragraph.bodyWidget) {
            let page: Page = this.selection.start.paragraph.bodyWidget.page;
            let containerHeight: number = this.visibleBounds.height;
            this.viewerContainer.scrollTop = page.boundingRectangle.bottom - containerHeight;
        }
    }
    /**
     * Returns the field code result.
     * @private
     */
    public getFieldResult(fieldBegin: FieldElementBox, page: Page): string {
        if (!isNullOrUndefined(page) && !isNullOrUndefined(this.selection)) {
            let fieldCode: string = this.selection.getFieldCode(fieldBegin);
            let fieldCodes: string[] = fieldCode.split('\*');
            if (fieldCodes.length > 1) {
                let fieldCategory: string = fieldCodes[0].replace(/[^\w\s]/gi, '').trim().toLowerCase();
                let fieldPattern: string = fieldCodes[1].replace(/[^\w\s]/gi, '').trim();
                switch (fieldCategory) {
                    case 'page':
                        return this.getFieldText(fieldPattern, (page.index + 1));
                    case 'numpages':
                        return this.getFieldText(fieldPattern, page.viewer.pages.length);
                    default:
                        break;
                }
            }
        }
        return '';
    }
    /**
     * Returns field text.
     */
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
            default:
                return value.toString();
        }
    }
    /**
     * Destroys the internal objects maintained for control.
     */
    public destroy(): void {
        if (!isNullOrUndefined(this.owner)) {
            this.unWireEvent();
        }

        this.pages = [];
        this.pages = undefined;
        this.fieldStacks = [];
        this.fieldStacks = undefined;
        this.splittedCellWidgets = [];
        this.splittedCellWidgets = undefined;
        this.fields = [];
        this.fields = undefined;
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
        if (this.dialogTarget && this.dialogTarget.parentElement) {
            this.dialogTarget.parentElement.removeChild(this.dialogTarget);
        }
        this.dialogTarget = undefined;
        if (!isNullOrUndefined(this.touchStart)) {
            this.touchStart.innerHTML = '';
        }
        if (this.textHelper) {
            this.textHelper.destroy();
        }
        this.textHelper = undefined;
        this.touchStart = undefined;
        if (!isNullOrUndefined(this.touchEnd)) {
            this.touchEnd.innerHTML = '';
        }
        this.touchEnd = undefined;
        if (!isNullOrUndefined(this.containerCanvasIn)) {
            this.containerCanvasIn.innerHTML = '';
        }
        this.containerCanvasIn = undefined;
        if (!isNullOrUndefined(this.selectionCanvasIn)) {
            this.selectionCanvasIn.innerHTML = '';
        }
        this.selectionCanvasIn = undefined;
        if (!isNullOrUndefined(this.editableDiv)) {
            this.editableDiv.innerHTML = '';
            this.editableDiv.parentElement.removeChild(this.editableDiv);
        }
        this.editableDiv = undefined;
        if (!isNullOrUndefined(this.pageContainer)) {
            this.pageContainer.innerHTML = '';
        }
        this.pageContainer = undefined;
        if (!isNullOrUndefined(this.viewerContainer)) {
            this.viewerContainer.innerHTML = '';
        }
        this.viewerContainer = undefined;
        this.owner = undefined;
        this.heightInfoCollection = undefined;
    }
    /**
     * Un-Wires events and methods
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
        this.viewerContainer.removeEventListener('dblclick', this.onDoubleTap);
        window.removeEventListener('resize', this.onWindowResize);
        window.removeEventListener('keyup', this.onKeyUpInternal);
        window.removeEventListener('mouseup', this.onImageResizer);
        window.removeEventListener('touchend', this.onImageResizer);
    }
    /**
     * @private
     */
    public abstract createNewPage(section: BodyWidget, index?: number): Page;
    /**
     * @private
     */
    public abstract renderVisiblePages(): void;
    /**
     * @private
     */
    public abstract updateScrollBars(): void;
    /**
     * private
     */
    public abstract scrollToPage(pageIndex: number): void;
    protected abstract updateCursor(event: MouseEvent): void;
    /**
     * @private
     */
    public abstract findFocusedPage(point: Point, updateCurrentPage: boolean): Point;
    /**
     * @private
     */
    public abstract onPageFitTypeChanged(pageFitType: PageFitType): void;
}
/** 
 * @private
 */
export class PageLayoutViewer extends LayoutViewer {
    private pageLeft: number = 30;
    /**
     * @private
     */
    public pageGap: number = 20;
    /**
     * @private
     */
    public visiblePages: Page[] = [];
    /**
     * Initialize the constructor of PageLayoutViewer
     */
    constructor(owner: DocumentEditor) {
        super(owner);
        if (isNullOrUndefined(owner) || isNullOrUndefined(owner.element)) {
            return;
        }
    }
    /**
     * Creates new page.
     * @private
     */
    public createNewPage(section: BodyWidget, index?: number): Page {
        let viewer: PageLayoutViewer = this;
        let yPos: number = this.pageGap;
        if (this.pages.length > 0) {
            yPos = this.pages[this.pages.length - 1].boundingRectangle.bottom + this.pageGap;
        }
        let page: Page = new Page();
        page.viewer = this;
        // tslint:disable-next-line:max-line-length
        let pageWidth: number = !isNullOrUndefined(section.sectionFormat) ? HelperMethods.convertPointToPixel(section.sectionFormat.pageWidth) : 816;
        // tslint:disable-next-line:max-line-length
        let pageHeight: number = !isNullOrUndefined(section.sectionFormat) ? HelperMethods.convertPointToPixel(section.sectionFormat.pageHeight) : 1056;
        let xPos: number = (this.visibleBounds.width - pageWidth * this.zoomFactor) / 2;
        if (xPos < this.pageLeft) {
            xPos = this.pageLeft;
        }
        page.boundingRectangle = new Rect(xPos, yPos, pageWidth, pageHeight);
        if (isNullOrUndefined(index)) {
            this.pages.push(page);
        } else {
            this.pages.splice(index, 0, page);
        }
        this.updateClientArea(section.sectionFormat, page);
        page.bodyWidgets.push(section);
        page.bodyWidgets[page.bodyWidgets.length - 1].page = page;
        this.layout.layoutHeaderFooter(section, viewer, page);
        this.updateClientArea(section.sectionFormat, page);
        return page;
    }
    /**
     * Updates cursor.
     */
    protected updateCursor(event: MouseEvent): void {
        let hyperlinkField: FieldElementBox = undefined;
        let div: HTMLDivElement = this.viewerContainer as HTMLDivElement;
        let point: Point = new Point(event.offsetX, event.offsetY);
        let touchPoint: Point = this.findFocusedPage(point, true);
        let widget: LineWidget = this.getLineWidget(touchPoint);
        let widgetInfo: TextPositionInfo;
        let left: number;
        let top: number;
        let editor: Editor = !this.owner.isReadOnlyMode ? this.owner.editorModule : undefined;
        let isRowResize: boolean = editor ? editor.tableResize.isInRowResizerArea(touchPoint) : false;
        let isCellResize: boolean = editor ? editor.tableResize.isInCellResizerArea(touchPoint) : false;
        let resizePosition: string = '';
        if (this.owner.enableImageResizerMode) {
            let resizeObj: ImagePointInfo = this.owner.imageResizerModule.getImagePoint(touchPoint);
            this.owner.imageResizerModule.selectedResizeElement = resizeObj.selectedElement;
            resizePosition = resizeObj.resizePosition;
        }
        let lineLeft: number = 0;
        if (!isNullOrUndefined(widget)) {
            lineLeft = this.selection.getLineStartLeft(widget);
            hyperlinkField = this.selection.getHyperLinkFieldInCurrentSelection(widget, touchPoint);
            widgetInfo = this.selection.updateTextPositionIn(widget, undefined, 0, touchPoint, true);
            left = this.selection.getLeft(widget);
            top = this.selection.getTop(widget);
            this.selection.setHyperlinkContentToToolTip(hyperlinkField, widget, touchPoint.x);
        }
        if (!isNullOrUndefined(hyperlinkField) && (event.ctrlKey &&
            this.owner.useCtrlClickToFollowHyperlink || !this.owner.useCtrlClickToFollowHyperlink)) {
            div.style.cursor = 'pointer';
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
            div.style.cursor = resizePosition;
        } else if (!isNullOrUndefined(widgetInfo) && widgetInfo.isImageSelected && left < touchPoint.x && top < touchPoint.y &&
            left + widget.width > touchPoint.x && top + widget.height > touchPoint.y) {
            div.style.cursor = 'move';
        }
        if (isRowResize) {
            div.style.cursor = 'row-resize';
        } else if (isCellResize) {
            div.style.cursor = 'col-resize';
        }
    }
    /**
     * Finds focused page.
     * @private
     */
    public findFocusedPage(currentPoint: Point, updateCurrentPage: boolean): Point {
        let point: Point = new Point(currentPoint.x, currentPoint.y);
        point.x += this.viewerContainer.scrollLeft;
        point.y += this.viewerContainer.scrollTop;
        for (let i: number = 0; i < this.pages.length; i++) {
            let page: Page = this.pages[i];
            let pageTop: number = (page.boundingRectangle.y - this.pageGap * (i + 1)) * this.zoomFactor + this.pageGap * (i + 1);
            let pageHeight: number = (page.boundingRectangle.height * this.zoomFactor) + this.pageGap;
            let pageLeft: number = page.boundingRectangle.x;
            let pageRight: number = ((page.boundingRectangle.right - pageLeft) * this.zoomFactor) + pageLeft;
            if (pageTop <= point.y && pageTop + pageHeight >= point.y) {
                if (updateCurrentPage) {
                    this.currentPage = page;
                }
                point.y = (point.y - (pageTop)) / this.zoomFactor;
                if (point.x > pageRight) {
                    point.x = page.boundingRectangle.right;
                } else if (point.x < pageLeft) {
                    point.x = 0;
                } else {
                    point.x = (point.x - pageLeft) / this.zoomFactor;
                }
                return point;
            }
        }
        return point;
    }

    /**
     * Fired when page fit type changed.
     * @private
     */
    public onPageFitTypeChanged(pageFitType: PageFitType): void {
        let width: number = this.visibleBounds.width;
        let height: number = this.visibleBounds.height;
        let section: BodyWidget = this.visiblePages[0].bodyWidgets[0] as BodyWidget;
        let pageWidth: number = HelperMethods.convertPointToPixel(section.sectionFormat.pageWidth);
        let pageHeight: number = HelperMethods.convertPointToPixel(section.sectionFormat.pageHeight);
        switch (pageFitType) {
            case 'FitOnePage':
                if (height > 0 && pageHeight > 0) {
                    let zoomFactor: number = (this.visibleBounds.height - 2 * this.pageGap - (this.pageGap - 2)) / pageHeight;
                    if (zoomFactor === this.zoomFactor) {
                        if (!isNullOrUndefined(this.owner.selection) && !isNullOrUndefined(this.owner.selection.start) &&
                            !isNullOrUndefined(this.owner.selection.end)) {
                            this.scrollToPosition(this.owner.selection.start, this.owner.selection.end);
                        }
                    } else {
                        this.zoomFactor = zoomFactor;
                    }
                }
                break;
            case 'FitPageWidth':
                if (width > 0 && pageWidth > 0) {
                    this.zoomFactor = (this.visibleBounds.width - 80) / pageWidth;
                }
                break;
            default:
                this.zoomFactor = 100 / 100;
                break;
        }
    }
    /**
     * @private
     */
    public handleZoom(): void {
        let prevScaleFactor: number = this.preZoomFactor;
        let page: Page = null;
        let verticalHeight: number = 0;
        let scrollToPosition: boolean = false;
        if (this.selection && isNullOrUndefined(this.zoomX && isNullOrUndefined(this.zoomY))) {
            let x: number = 0;
            let y: number = 0;
            let endPage: Page = this.selection.getPage(this.selection.end.currentWidget.paragraph);
            x = (this.visibleBounds.width - endPage.boundingRectangle.width * prevScaleFactor) / 2;
            if (x < 30) {
                x = 30;
            }
            // tslint:disable-next-line:max-line-length
            y = endPage.boundingRectangle.y * prevScaleFactor + (this.pages.indexOf(endPage) + 1) * (this as PageLayoutViewer).pageGap * (1 - prevScaleFactor);
            let caretInfo: CaretHeightInfo = this.selection.updateCaretSize(this.owner.selection.end, true);
            let topMargin: number = caretInfo.topMargin;
            let caretHeight: number = caretInfo.height;
            x += (this.selection.end.location.x) * prevScaleFactor;
            y += (this.selection.end.location.y + topMargin) * prevScaleFactor;
            if (x >= this.containerLeft && x <= this.visibleBounds.width &&
                y >= this.containerTop && y <= this.containerTop + this.visibleBounds.height) {
                scrollToPosition = true;
            }
        }
        for (let i: number = 0; i < this.pages.length; i++) {
            verticalHeight = verticalHeight + this.pages[i].boundingRectangle.height;
        }
        let horizontalWidth: number = 0;
        for (let i: number = 0; i < this.pages.length; i++) {
            if (horizontalWidth < this.pages[i].boundingRectangle.width) {
                horizontalWidth = this.pages[i].boundingRectangle.width;
            }
        }
        // tslint:disable-next-line:max-line-length
        let height: number = (verticalHeight * this.zoomFactor + (this.pages.length + 1) * this.pageGap * (1 - this.zoomFactor)) - this.visibleBounds.height;
        let horWidth: number = horizontalWidth * this.zoomFactor - this.visibleBounds.width;
        if (this.visibleBounds.width - horizontalWidth * this.zoomFactor < 60) {
            horWidth += 60;
        }
        //Update Vertical Scroll bar
        if (height > 0) {
            let value: number = this.containerTop;
            if (this.visiblePages.length > 0) {
                page = this.visiblePages[0];
                // tslint:disable-next-line:max-line-length
                let prevPageTop: number = (page.boundingRectangle.y - (page.index + 1) * this.pageGap) * prevScaleFactor + (page.index + 1) * this.pageGap;
                let zoomY: number = this.zoomY;
                if (isNullOrUndefined) {
                    zoomY = this.visibleBounds.height / 2;
                }
                let prevY: number = value + zoomY;
                while (prevY > prevPageTop + (page.boundingRectangle.height * prevScaleFactor)) {
                    let pageIndex: number = page.index + 1;
                    if (pageIndex === this.pages.length) {
                        break;
                    }
                    page = this.pages[pageIndex];
                    // tslint:disable-next-line:max-line-length
                    prevPageTop = (page.boundingRectangle.y - (page.index + 1) * this.pageGap) * prevScaleFactor + (page.index + 1) * this.pageGap;
                }
                // tslint:disable-next-line:max-line-length
                let currentY: number = (page.boundingRectangle.y - (page.index + 1) * this.pageGap) * this.zoomFactor + (page.index + 1) * this.pageGap
                    + ((prevY - prevPageTop) < 0 ? prevY - prevPageTop : (prevY - prevPageTop) * (this.zoomFactor / prevScaleFactor));
                value = currentY - zoomY;
                zoomY = this.visibleBounds.height / 2;
            }
            this.viewerContainer.scrollTop = value;
        } else {
            this.viewerContainer.scrollTop = 0;
        }
        // update Horizontal Scroll Bar
        if (horWidth > 0) {
            let value: number = this.containerLeft;
            if (this.visiblePages.length > 0) {
                if (page === null) {
                    page = this.visiblePages[0];
                }
                let zoomX: number = this.zoomX;
                if (isNullOrUndefined(zoomX)) {
                    zoomX = this.visibleBounds.width / 2;
                }
                let prevValue: number = (page.boundingRectangle.width * prevScaleFactor) / page.boundingRectangle.width;
                let prevX: number = value + zoomX;
                // tslint:disable-next-line:max-line-length
                let currentX: number = page.boundingRectangle.x
                    + ((prevX - page.boundingRectangle.x) < 0 ? prevX - page.boundingRectangle.x : (prevX - page.boundingRectangle.x) * (this.zoomFactor / prevValue));
                value = currentX - zoomX;
                zoomX = this.visibleBounds.width / 2;
            }
            this.viewerContainer.scrollLeft = value;
        } else {
            this.viewerContainer.scrollLeft = 0;
        }
        this.updateScrollBars();
        if (scrollToPosition) {
            this.scrollToPosition(this.selection.start, this.selection.end);
        }
    }
    /**
     * Gets current page header footer.
     * @private
     */
    public getCurrentPageHeaderFooter(section: BodyWidget, isHeader: boolean): HeaderFooterWidget {
        return this.getCurrentHeaderFooter(this.getHeaderFooterType(section, isHeader), section.index);
    }
    /**
     * Get header footer type
     * @private
     */
    public getHeaderFooterType(section: BodyWidget, isHeader: boolean): HeaderFooterType {
        let type: HeaderFooterType;
        type = isHeader ? 'OddHeader' : 'OddFooter';
        // tslint:disable-next-line:max-line-length
        if (section.sectionFormat.differentFirstPage && (this.pages.length === 1 || this.pages[this.pages.length - 1].bodyWidgets[0].index !== section.index)) {
            type = isHeader ? 'FirstPageHeader' : 'FirstPageFooter';
        } else if (section.sectionFormat.differentOddAndEvenPages && this.pages.length % 2 === 0) {
            type = isHeader ? 'EvenHeader' : 'EvenFooter';
        }
        return type;
    }
    /**
     * Gets current header footer.
     * @param type
     * @param section 
     * @private
     */
    public getCurrentHeaderFooter(type: HeaderFooterType, sectionIndex: number): HeaderFooterWidget {
        if (this.headersFooters[sectionIndex]) {
            let index: number = this.getHeaderFooter(type);
            let headerFooter: HeaderFooterWidget = this.headersFooters[sectionIndex][index];
            if (!headerFooter) {
                headerFooter = this.createHeaderFooterWidget(type);
                this.headersFooters[sectionIndex][index] = headerFooter;
            }
            return headerFooter;
        } else if (sectionIndex > 0) {
            return this.getCurrentHeaderFooter(type, sectionIndex - 1);
        }
        return undefined;
    }
    private createHeaderFooterWidget(type: HeaderFooterType): HeaderFooterWidget {
        let headerFooter: HeaderFooterWidget = new HeaderFooterWidget(type);
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.childWidgets.push(new LineWidget(paragraph));
        return headerFooter;
    }
    /**
     * Gets header footer.
     * @param type
     * @private
     */
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
    /**
     * Updates header footer client area.
     * @private
     */
    public updateHFClientArea(sectionFormat: WSectionFormat, isHeader: boolean): void {
        // tslint:disable-next-line:max-line-length
        let width: number = HelperMethods.convertPointToPixel(sectionFormat.pageWidth - sectionFormat.leftMargin - sectionFormat.rightMargin);
        if (width < 0) {
            width = 0;
        }
        if (isHeader) {
            // tslint:disable-next-line:max-line-length
            this.clientArea = new Rect(HelperMethods.convertPointToPixel(sectionFormat.leftMargin), HelperMethods.convertPointToPixel(sectionFormat.headerDistance), width, Number.POSITIVE_INFINITY);
        } else {
            // tslint:disable-next-line:max-line-length
            this.clientArea = new Rect(HelperMethods.convertPointToPixel(sectionFormat.leftMargin), HelperMethods.convertPointToPixel(sectionFormat.pageHeight - sectionFormat.footerDistance), width, Number.POSITIVE_INFINITY);
        }
        this.clientActiveArea = new Rect(this.clientArea.x, this.clientArea.y, this.clientArea.width, this.clientArea.height);
    }
    /**
     * @private
     */
    public updateHCFClientAreaWithTop(sectionFormat: WSectionFormat, isHeader: boolean, page: Page): void {
        this.updateHFClientArea(sectionFormat, isHeader);
        if (!isHeader) {
            if (page.footerWidget.y < this.clientActiveArea.y) {
                this.clientActiveArea.y = page.footerWidget.y;
                this.clientActiveArea.height = Number.POSITIVE_INFINITY;
            }
        }
    }
    /**
     * Scrolls to the specified page
     * @private
     */
    public scrollToPage(pageIndex: number): void {
        let top: number = 0;
        for (let i: number = 0; i < this.pages.length; i++) {
            top = this.pages[i].boundingRectangle.y - (this.pageGap / 2);
            if (i === pageIndex) {
                break;
            }
        }
        this.viewerContainer.scrollTop = top;
        this.updateScrollBars();
    }
    /**
     * Updates scroll bars.
     * @private
     */
    public updateScrollBars(): void {
        let height: number = 0;
        for (let i: number = 0; i < this.pages.length; i++) {
            height = height + this.pages[i].boundingRectangle.height;
        }
        let width: number = 0;
        for (let i: number = 0; i < this.pages.length; i++) {
            if (width < this.pages[i].boundingRectangle.width) {
                width = this.pages[i].boundingRectangle.width;
            }
        }
        let containerWidth: number = (width * this.zoomFactor) + (this.pageLeft * 2);
        let containerHeight: number = (height * this.zoomFactor) + (this.pages.length + 1) * this.pageGap;
        let viewerWidth: number = this.visibleBounds.width;
        let viewerHeight: number = this.visibleBounds.height;
        if (this.visibleBounds.width !== this.viewerContainer.clientWidth) {
            viewerWidth -= (this.visibleBounds.width - this.viewerContainer.clientWidth);
        } else if (containerHeight > viewerHeight) {
            viewerWidth -= this.viewerContainer.offsetWidth - this.viewerContainer.clientWidth;
        }
        if (containerWidth > viewerWidth) {
            viewerHeight -= (this.visibleBounds.height - this.viewerContainer.clientHeight);
        }

        width = containerWidth > viewerWidth ? containerWidth : viewerWidth;
        height = containerHeight > viewerHeight ? containerHeight : viewerHeight;


        if (parseInt(this.pageContainer.style.width.replace('px', ''), 10) !== width ||
            parseInt(this.pageContainer.style.height.replace('px', ''), 10) !== width) {
            this.pageContainer.style.width = width.toString() + 'px';
            this.pageContainer.style.height = height.toString() + 'px';
        }
        // if (!isNullOrUndefined(this.selection) && !this.selection.isEmpty) {
        //     this.selectionContext.clearRect(0, 0, this.selectionCanvas.width, this.selectionCanvas.height);
        // }
        let displayPixelRatio: number = Math.max(1, window.devicePixelRatio || 1);
        if (this.containerCanvas.width !== Math.floor(viewerWidth * displayPixelRatio)
            || this.containerCanvas.height !== Math.floor(viewerHeight * displayPixelRatio)) {
            this.containerCanvas.width = viewerWidth * displayPixelRatio;
            this.containerCanvas.height = viewerHeight * displayPixelRatio;
            this.containerCanvas.style.width = viewerWidth + 'px';
            this.containerCanvas.style.height = viewerHeight + 'px';
            this.containerContext.scale(displayPixelRatio, displayPixelRatio);
            this.selectionCanvas.width = viewerWidth * displayPixelRatio;
            this.selectionCanvas.height = viewerHeight * displayPixelRatio;
            this.selectionCanvas.style.width = viewerWidth + 'px';
            this.selectionCanvas.style.height = viewerHeight + 'px';
            this.selectionContext.scale(displayPixelRatio, displayPixelRatio);
        }
        this.containerContext.globalAlpha = 1;
        this.selectionContext.globalAlpha = 0.4;
        for (let i: number = 0; i < this.pages.length; i++) {
            let left: number = (width - this.pages[i].boundingRectangle.width * this.zoomFactor) / 2;
            if (left > this.pageLeft) {
                // tslint:disable-next-line:max-line-length
                this.pages[i].boundingRectangle = new Rect(left, this.pages[i].boundingRectangle.y, this.pages[i].boundingRectangle.width, this.pages[i].boundingRectangle.height);
            } else {
                // tslint:disable-next-line:max-line-length
                this.pages[i].boundingRectangle = new Rect(this.pageLeft, this.pages[i].boundingRectangle.y, this.pages[i].boundingRectangle.width, this.pages[i].boundingRectangle.height);
            }
        }
        this.updateScrollBarPosition(containerWidth, containerHeight, viewerWidth, viewerHeight, width, height);
    }
    // tslint:disable-next-line:max-line-length
    public updateScrollBarPosition(containerWidth: number, containerHeight: number, viewerWidth: number, viewerHeight: number, width: number, height: number): void {
        let left: number = 0;
        let viewerHeight1: number = parseFloat(this.viewerContainer.style.height);
        let containerHeight1: number = parseFloat(this.pageContainer.style.height);

        this.containerTop = this.viewerContainer.scrollTop;
        this.containerCanvas.style.position = 'absolute';
        this.containerCanvas.style.top = this.containerTop.toString() + 'px';
        this.selectionCanvas.style.position = 'absolute';
        this.selectionCanvas.style.top = this.containerTop.toString() + 'px';
        this.containerLeft = this.viewerContainer.scrollLeft;
        this.containerCanvas.style.left = this.containerLeft + 'px';
        this.selectionCanvas.style.left = this.containerLeft + 'px';
        this.updateVisiblePages();
    }
    /**
     * Updates visible pages.
     * @private
     */
    public updateVisiblePages(): void {
        let left: number = 0;
        let width: number = 0;
        // Clears the container first.
        this.visiblePages = [];
        let height: number = this.visibleBounds.height;
        let vertical: number = this.viewerContainer.scrollTop;
        for (let i: number = 0; i < this.pages.length; i++) {
            let page: Page = this.pages[i];
            let y: number = (page.boundingRectangle.y - this.pageGap * (i + 1)) * this.zoomFactor + this.pageGap * (i + 1);
            let pageH: number = page.boundingRectangle.height * this.zoomFactor;
            let left: number = page.boundingRectangle.x;
            let isTopFit: boolean = y >= vertical && y <= vertical + height;
            let isBottomFit: boolean = y + pageH >= vertical && y + pageH <= vertical + height;
            let isMiddleFit: boolean = y <= vertical && y + pageH >= vertical + height;
            //UI Virtualization
            if (isTopFit || isBottomFit || isMiddleFit) {
                this.addVisiblePage(page, left, y);
            }
        }
    }
    /**
     * Adds visible pages.
     */
    private addVisiblePage(page: Page, x: number, y: number): void {
        let width: number = page.boundingRectangle.width * this.zoomFactor;
        let height: number = page.boundingRectangle.height * this.zoomFactor;
        // tslint:disable-next-line:max-line-length
        if (this.owner.enableImageResizerMode && this.owner.imageResizerModule.currentPage !== undefined && this.owner.imageResizerModule.currentPage === page && this.owner.imageResizerModule.isImageResizerVisible) {
            this.owner.imageResizerModule.setImageResizerPositions(x, y, width, height);
        }
        this.visiblePages.push(page);
        this.renderPage(page, x, y, width, height);
    }
    /**
     * Render specified page widgets.
     */
    private renderPage(page: Page, x: number, y: number, width: number, height: number): void {
        this.render.renderWidgets(page, x - this.containerLeft, y - this.containerTop, width, height);
    }
    /**
     * Renders visible pages.
     * @private
     */
    public renderVisiblePages(): void {
        if (isNullOrUndefined(this.visiblePages) || this.visiblePages.length < 1) {
            return;
        }
        this.clearContent();
        for (let i: number = 0; i < this.visiblePages.length; i++) {
            let page: Page = this.visiblePages[i];
            let width: number = page.boundingRectangle.width * this.zoomFactor;
            let height: number = page.boundingRectangle.height * this.zoomFactor;
            let x: number = page.boundingRectangle.x;
            let y: number = (page.boundingRectangle.y - this.pageGap * (i + 1)) * this.zoomFactor + this.pageGap * (i + 1);
            this.renderPage(page, x, y, width, height);
        }
    }
}