import { addClass, isNullOrUndefined, Observer, removeClass, EventHandler } from '@syncfusion/ej2-base';
import { IEditorCoreOptions } from './interface';
import * as events from '../../common/constant';
import { HeadlessEditor, ExtensionDefinition, paragraphExtension, EditorConfig, DocumentRoot, textAlignExtension, fontFamilyExtension, fontSizeExtension, placeholderExtension } from '@syncfusion/ej2-headless-editor';
import * as classes from '../../common/classes';
import { EditorCommandName } from '../../controller/interface';
import * as coreEvents from '../constants';
import { InlineFormats } from '../plugins/inline-formats';
import { BlockFormats } from '../plugins/block-formats';
import { ListFormats } from '../plugins/list-formats';
import { Alignment } from '../plugins/alignment';
import { ImageFormats } from '../plugins/image-formats';
import { Link } from '../plugins/link';
import { Table } from '../plugins/table';

/**
 * EditorCore - Headless editor runtime that handles document model and rendering.
 * This is the internal engine that powers the RichTextEditor component.
 */
export class EditorCore {
    // State management for the headless runtime per lifecycle spec section 7.2
    private isInitialized: boolean = false;
    private isMounted: boolean = false;
    private inputElement!: HTMLElement;
    private readonly inputHandler: EventListener = this.onInputHandler.bind(this);
    private readonly keyUpHandler: EventListener = this.onKeyUphandler.bind(this);
    private readonly keyDownHandler: EventListener = this.onKeyDownhandler.bind(this);

    public observer: Observer;
    public editor: HeadlessEditor;
    // Formats objects
    private inlineFormatsObj: InlineFormats;
    private blockFormatsObj: BlockFormats;
    private listFormatsObj: ListFormats;
    private alignmentObj: Alignment;
    private imageFormatsObj: ImageFormats;
    private linkObj: Link;
    public tablePluginObj: Table;

    public lastSelection: any;

    constructor(options: IEditorCoreOptions) {
        this.observer = new Observer(this);
        this.mount(options.hostElement, options);
        this.inlineFormatsObj = new InlineFormats(this);
        this.blockFormatsObj = new BlockFormats(this);
        this.listFormatsObj = new ListFormats(this);
        this.alignmentObj = new Alignment(this);
        this.imageFormatsObj = new ImageFormats(this);
        this.linkObj = new Link(this);
        this.tablePluginObj = new Table(this);
    }

    private wireEvents(): void {
        EventHandler.add(this.inputElement, 'input', this.inputHandler, this);
        EventHandler.add(this.inputElement, 'keyup', this.keyUpHandler, this);
        EventHandler.add(this.inputElement, 'keydown', this.keyDownHandler, this);
        EventHandler.add(this.inputElement, 'mouseup', this.onMouseUpHandler, this);
        this.observer.on(events.modelChanged, this.onPropertyChanged, this);
        this.observer.on(events.executeCommand, this.executeCommand, this);
        this.observer.on(events.selectRange, this.selectRangeHandler, this);
    }

    private unwireEvents(): void {
        if (!this.inputElement) {
            return;
        }
        EventHandler.remove(this.inputElement, 'input', this.inputHandler);
        EventHandler.remove(this.inputElement, 'keyup', this.keyUpHandler);
        EventHandler.remove(this.inputElement, 'keydown', this.keyDownHandler);
        EventHandler.remove(this.inputElement, 'mouseup', this.onMouseUpHandler);
        this.observer.off(events.modelChanged, this.onPropertyChanged);
        this.observer.off(events.executeCommand, this.executeCommand);
        this.observer.off(events.selectRange, this.selectRangeHandler);
    }

    /**
     * Mount the editor runtime into a host element.
     *
     * Per lifecycle spec section 4.2, called from EditorBase.render().
     *
     * @param {HTMLElement} hostElement - Editor host element
     * @param {IEditorCoreOptions} options - Mount options.
     * @returns {void} The mounted editable input element.
     */
    public mount(hostElement: HTMLElement, options: IEditorCoreOptions): void {
        const extensions: ExtensionDefinition<Object>[] = options.extensions && options.extensions.length
            ? options.extensions
            : [paragraphExtension, textAlignExtension, fontFamilyExtension, fontSizeExtension];

        const editorOptions: EditorConfig = {
            extensions: extensions,
            autoSaveSelectionOnBlur: true,
            enableInputRules: options.enableAutoFormat !== false,
            enableTabKey: options.enableTabKeyIndent !== false,
            readOnly: options.readonly
        };
        if (!isNullOrUndefined(options.content) && options.valueFormat === 'html') {
            editorOptions.content = options.content;
        } else if (options.valueFormat === 'json' && options.documentRoot) {
            editorOptions.document = options.documentRoot;
        }
        this.editor = HeadlessEditor.create(editorOptions);
        this.editor.mount(hostElement);
        const contentElement: HTMLElement | null = hostElement.querySelector('.ProseMirror');
        if (!contentElement) {
            throw new Error('EditorCore: Contenteditable element not found after mounting.');
        }
        this.inputElement = contentElement;
        addClass([this.inputElement], 'e-content');
        this.inputElement.setAttribute('aria-label' , 'Rich Text Editor');
        this.inputElement.setAttribute('aria-multline', 'true');
        this.inputElement.setAttribute('role', 'textbox');
        this.applyRtl(options.enableRtl);
        this.wireEvents();
        this.isMounted = true;
        this.isInitialized = true;
    }

    protected applyRtl(enableRtl: boolean): void {
        if (this.inputElement) {
            this.inputElement.setAttribute('dir', enableRtl ? 'rtl' : 'ltr');
            if (enableRtl) {
                addClass([this.inputElement], classes.CLS_RTL);
            } else {
                removeClass([this.inputElement], classes.CLS_RTL);
            }
        }
    }

    //  Onproperty changed
    private onPropertyChanged(props: { [key: string]: Object }): void {
        if (!this.isMounted || !this.isInitialized) {
            return;
        }
        const newProperties: IEditorCoreOptions = props.newProperties;
        const oldProperties: IEditorCoreOptions = props.oldProperties;
        for (const prop of Object.keys(newProperties)) {
            switch (prop) {
            case 'placeholder':
                if (!isNullOrUndefined(newProperties.placeholder) && newProperties.placeholder !== oldProperties?.placeholder) {
                    this.editor.setOptions({extensions: [placeholderExtension.configure({
                        placeholder: newProperties.placeholder,
                        emptyNodeClass: 'e-placeholder-enabled',
                        emptyEditorClass: 'e-rte-ui-empty',
                        dataAttribute: 'placeholder',
                        showOnlyCurrent: false,
                        showOnlyWhenEditable: false,
                        showOnlyWhenEditorEmpty: true
                    })]});
                }
                break;
            case 'value':
                if (!isNullOrUndefined(newProperties.value) && newProperties.value !== oldProperties?.value) {
                    if (newProperties.valueFormat === 'html' && typeof newProperties.value === 'string') {
                        this.editor.setOptions({ content: newProperties.value });
                    } else {
                        this.editor.setOptions({ document: newProperties as DocumentRoot });
                    }
                }
                break;
            case 'enableRtl':
                if (!isNullOrUndefined(newProperties.enableRtl)) {
                    this.applyRtl(newProperties.enableRtl);
                }
                break;
            case 'enableAutoFormat':
                if (newProperties.enableAutoFormat === undefined) {
                    break;
                }
                this.editor.setOptions({
                    enableInputRules: newProperties.enableAutoFormat
                });
                break;
            case 'enableTabKeyIndent':
                if (newProperties.enableTabKeyIndent === undefined) {
                    break;
                }
                this.editor.setOptions({
                    enableTabKey: newProperties.enableTabKeyIndent
                });
                break;
            case 'readonly':
                this.editor.setOptions({
                    readOnly: newProperties.readonly
                });
                break;
            default:
                break;
            }
        }
    }

    /**
     * Destroy the editor runtime and cleanup resources.
     *
     * Per lifecycle spec section 6.3, called from EditorBase.destroy().
     *
     * @returns {void}
     */
    public destroy(): void {
        // Idempotent guard per lifecycle spec section 7.2
        if (!this.isMounted) {
            return;
        }
        this.unwireEvents();
        this.tablePluginObj.destroy();
        this.editor.destroy();
        this.observer.notify(coreEvents.destroyCore, this);
        // Cleanup placeholder: In full implementation, would clean up
        // document model, event listeners, and rendering resources
        this.isInitialized = false;
        this.isMounted = false;
    }

    public getInputElement(): HTMLElement {
        return this.inputElement;
    }

    private selectRangeHandler(args: { range: Range }): void {
        const selection: Selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(args.range);
    }

    /**
     * Observer-bound handler for the `executeCommand` event.
     *
     * Per the EJ2 Observer contract, the registered handler receives the
     * single `argument` object that was passed to `observer.notify`. The
     * callers (`EditorController.process` and `EditorController.execute`)
     * send `{ action, args, callBack }`, so we read the command from
     * `payload.action` and dispatch inline commands to the
     * `InlineFormats` plugin via the `inline-executeAction` event.
     *
     * @param payload - Observer payload from `notify('executeCommand', ...)`.
     * @returns {void}
     * @hidden
     * @private
     */
    /* eslint-disable */
    public executeCommand(payload: { action: EditorCommandName; args?: unknown; callBack?: Function }): void {
        if (!payload || typeof payload.action !== 'string') {
            return;
        }
        const command: EditorCommandName = payload.action;
        switch (command) {
            case 'bold':
            case 'italic':
            case 'underline':
            case 'strikethrough':
            case 'subscript':
            case 'superscript':
            case 'lowercase':
            case 'uppercase':
            case 'fontColor':
            case 'backgroundColor':
            case 'setFontFamily':
            case 'setFontSize':
            case 'inlineCode':
            case 'clearFormat':
            case 'indent':
            case 'outdent':
                this.observer.notify(coreEvents.inlineExecution, {
                    command: command,
                    args: payload.args,
                    callBack: payload.callBack
                });
                break;
            case 'heading1':
            case 'heading2':
            case 'heading3':
            case 'heading4':
            case 'paragraph':
            case 'blockQuote':
            case 'codeBlock':
            case 'horizontalRule':
                this.observer.notify(coreEvents.blockExecution, {
                    command: command,
                    args: payload.args,
                    callBack: payload.callBack
                });
                break;
            case 'undo':
            case 'redo':
                this.observer.notify(coreEvents.undoRedoExecution, {
                    command: command,
                    args: payload.args,
                    callBack: payload.callBack
                });
                break;

            case 'numberedList':
            case 'bulletList':
            case 'setListStyle':
                this.observer.notify(coreEvents.listExecution, {
                    command: command,
                    args: payload.args,
                    callBack: payload.callBack
                });
                break;
            case 'setTextAlign':
                this.observer.notify(coreEvents.alignmentxecution, {
                    command: command,
                    args: payload.args,
                    callBack: payload.callBack
                });
                break;
            case 'link':
                this.observer.notify(coreEvents.linkExecution, {
                    command: command,
                    args: payload.args,
                    callback: payload.callBack
                });
                break;
            case 'insertTable':
            case 'insertRowBefore':
            case 'insertRowAfter':
            case 'deleteRow':
            case 'insertColumnBefore':
            case 'insertColumnAfter':
            case 'deleteColumn':
            case 'toggleHeaderRow':
            case 'tableCellBackground':
            case 'setTableCellVerticalAlign':
            case 'setTableCellHorizontalAlign':
            case 'deleteTable':
                this.observer.notify(coreEvents.tableExecution, {
                    command: command,
                    args: payload.args,
                    callback: payload.callBack
                });
                break;
            case 'imageInsert':
            case 'imageUpdate':
            case 'removeImage':
            case 'altText':
            case 'caption':
            case 'alignImage':
            case 'setAlignImage':
            case 'displayImage':
            case 'inlineImage':
            case 'breakImage':
            case 'wrapTextImage':
            case 'setWrapTextImage':
            case 'dimensionImage':
            case 'replaceImage':
                this.observer.notify(coreEvents.imageExecution, {
                    command: command,
                    args: payload.args,
                    callback: payload.callBack
                });
                break;
            default:
                break;
        }
    }

    private onKeyUphandler(args: KeyboardEvent): void {
        this.observer.notify('editor-keyup', { originalEvent: args} );
    }

    private onKeyDownhandler(args: KeyboardEvent): void {
        this.observer.notify('editor-keydown', { originalEvent: args });
    }

    private onMouseUpHandler(args: MouseEvent): void {
        this.observer.notify('editor-mouseup', { originalEvent: args });
    }

    private onInputHandler(args: InputEvent): void {
        this.observer.notify('editor-input', { originalEvent: args });
    }

    public saveSelection() {
        return this.editor.integration.getState().selection;
    }

    public restoreSelection(savedSelection: any) {
        const resolvedSelection = savedSelection.getBookmark().resolve(this.editor.integration.getState().doc);
        this.editor.integration.getView().dispatch(this.editor.integration.getState().tr.setSelection(resolvedSelection));
    }

    public focusEditorView(): void {
        this.inputElement.focus();
    }

    public updateLastSelection(): void {
        this.lastSelection = this.saveSelection();
    }
}

