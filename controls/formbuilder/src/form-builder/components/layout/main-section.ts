import { compile, createElement, DragEventArgs, enableRtl, getComponent, L10n, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { Droppable, DropEventArgs, Draggable } from '@syncfusion/ej2-base';
import { Tab, TabItemModel, SelectEventArgs, Toolbar } from '@syncfusion/ej2-navigations';
import { Message } from '@syncfusion/ej2-notifications';
import { PaletteComponent } from '../../types/form-schema';
import { CustomFormTemplate, ToolboxCategory } from '../../model/base';
import { FormFieldWrapper, FormFieldWrapperProps } from './form-field-wrapper';
import { FormBuilder } from '../../form-builder';
import { renderFormField } from '@syncfusion/ej2-form-renderer';
import { defaultFormSchema, isDefaultFormSchema } from '../../context/default-form-schema';
import { EditorToolbar } from './editor-toolbar';
import { ListBoxPane, ListBoxPaneOwners } from './listbox-pane';
import { JsonViewer, JsonViewerOwners } from './json-viewer';
import { PreviewPane, PreviewPaneOwners } from './preview-pane';
import { Button } from '@syncfusion/ej2-buttons';
import { Dialog } from '@syncfusion/ej2-popups';
import { FormRenderer, FormSchema } from '@syncfusion/ej2-form-renderer';
import { Grid } from '@syncfusion/ej2-grids';
import {
    FieldDragStartEventArgs,
    FieldDragOverEventArgs,
    FieldDroppedEventArgs
} from '../../form-builder';
import { generateId, generateName, splitSchema, inferTypeFromWidget } from '@syncfusion/ej2-form-renderer';
import { splitWidths, FormNode, StaticHtmlRenderer } from '@syncfusion/ej2-form-renderer';
import { FormDropZoneIconSvg } from '../icons/component-icons';
import { importSplitSchemas } from '../../import/schema-import-utils';
import { RichTextEditor } from '@syncfusion/ej2-richtexteditor';


/** @private */
type NestedChildContainer = 'panel' | 'table' | 'tabs';

/** @private */
type NestedChildClass = 'panel-child-field-draggable' | 'table-cell-child-draggable' | 'tab-child-field-draggable';

/** @private */
export interface MainSectionProps {
    formSchema: FormSchema;
    activeFieldId?: string;
    paletteConfig?: ToolboxCategory[];
    mode?: 'Simple' | 'Developer';
    enableRtl?: boolean;
    locale?: string;
    enablePreview?: boolean;
    hasClipboardData?: boolean;
    onDrop: (
        component: FormNode,
        dropTargetIndex?: number | null,
        dropPosition?: 'before' | 'after' | null
    ) => void;
    onNestedDrop: (
        parentId: string,
        component: FormNode,
        cellInfo?: { row: number; col: number; tabIndex?: number },
        parentPath?: string,
        dropTargetIndex?: number | null,
        dropPosition?: 'before' | 'after' | null
    ) => void;
    onReorder: (newComponents: FormNode[]) => void;
    onNestedReorder: (
        parentId: string,
        parentPath: string,
        newChildren: FormNode[],
        cellInfo?: { row?: number; col?: number; tabIndex?: number }
    ) => void;
    onDelete: (fieldId: string, isReordering?: boolean) => void;
    onEdit: (fieldId: string) => void;
    onCopy: (field: FormNode) => void;
    onPaste: (targetFieldId: string) => void;
    onSwitchWidget?: (fieldId: string, newWidgetType: string) => void;
    onMoveUp?: (fieldId: string) => void;
    onMoveDown?: (fieldId: string) => void;
    onNestedMoveUp?: (
        fieldId: string,
        parentId: string,
        parentPath: string,
        cellInfo?: { row?: number; col?: number; tabIndex?: number }
    ) => void;
    onNestedMoveDown?: (
        fieldId: string,
        parentId: string,
        parentPath: string,
        cellInfo?: { row?: number; col?: number; tabIndex?: number }
    ) => void;
    onFieldDragStarted?: (args: FieldDragStartEventArgs) => void;
    onFieldDraggingOver?: (args: FieldDragOverEventArgs) => void;
    onFieldDropped?: (args: FieldDroppedEventArgs) => void;
    onDropBatchStart?: () => void;
    onDropBatchEnd?: () => void;
    onReset?: () => void;
    onCopySchema: () => void;
    /**
     * The owning `FormBuilder` instance. The `FormFieldWrapper` consults
     * this to resolve the matching `ToolboxItemSettings` for the field
     * being rendered so it can mount the consumer's custom template via
     * `getTemplateFunction` instead of the default Syncfusion control.
     */
    formBuilder?: FormBuilder | null;
    parent?: Element;
}

/** @private */
interface TrackedListener {
    target: EventTarget;
    event: string;
    handler: EventListener;
    opts?: AddEventListenerOptions | boolean;
}

/** @private */
interface DropTargetResult {
    index: number;
    position: 'before' | 'after';
}

/** @private */
interface PreservedNode {
    node: HTMLElement;
    parent: Node;
    next: ChildNode | null;
}

interface CachedField {
    host: HTMLElement;
    wrapper: FormFieldWrapper;
    type: string;
}

/** @private */
export class MainSection {

    private host: HTMLElement;
    private props: MainSectionProps;
    private l10n: L10n;
    private rootEl: HTMLElement | null;
    private formAreaEl: HTMLElement | null;
    private cachedFields: Map<string, CachedField>;
    static activeFieldId: string;
    private renderedInstances: any[];

    private owners: {
        droppables: Droppable[];
        draggables: Draggable[];
        fieldWrappers: FormFieldWrapper[];
        tooltips: any[];
        tabs: Tab[];
        toolbars: any[];
        messages: any[];
        listboxes: any[];
        buttons: Button[];
        dialogs: Dialog[];
        grids: Grid[];
        formRenderers: FormRenderer[];
        previewPane: PreviewPane | null;
        pendingTimers: number[];
        docListeners: TrackedListener[];
        gridRefs: Map<string, any>;
        preservedNodes: PreservedNode[];
    };
    private dropTargetIndex: number | null;
    private dropPosition: 'before' | 'after' | null;
    private draggedComponentInfo: { id: string; containerId: string } | null;
    private isReordering: boolean;
    private isNestedReordering: boolean;
    private activeNestedContainer: string | null;
    private draggingOverPanel: string | null;
    private currentComponents: FormNode[];
    private currentSchema: FormSchema;
    private pointerTrackerHost: HTMLElement | null;
    private pointerTrackerHandler: ((e: Event) => void) | null;
    private nestedDropTargetIndex: number | null;
    private nestedDropPosition: 'before' | 'after' | null;
    private activeTabIndices: Map<string, number>;
    private initialDragY: number | null;
    private currentDragY: number | null;
    private isDraggingFromPalette: boolean;
    private draggedItemIndex: number | null;
    private nestedInitialDragY: number | null;
    private nestedCurrentDragY: number | null;
    private nestedDraggedIndex: number | null;
    private nestedComponents: FormNode[];
    private nestedContainerId: string | null;
    private nestedContainerPath: string | null;
    private nestedCellInfo: { row?: number; col?: number; tabIndex?: number } | undefined;
    private rootCloneHost: HTMLElement | null;
    private nestedCloneHost: HTMLElement | null;
    private toolbarHost: HTMLElement | null;
    private editorToolbar: EditorToolbar | null;
    private showSplitView: boolean;
    private isPreviewOpen: boolean;
    private isListBoxPaneOpen: boolean;
    private addFieldMessageWrapper: HTMLElement | null;
    private addFieldMessage: Message | null;
    private listboxPane: ListBoxPane | null;
    private listboxPaneHost: HTMLElement | null;
    private jsonViewer: JsonViewer | null;
    private lastJsonSchemaRef: FormSchema | null;
    private previewPane: PreviewPane | null;
    private previewPaneHost: HTMLElement | null;
    private lastPreviewSchemaRef: FormSchema | null;
    private lastPreviewSplitData: any;
    private parent: Element;
    private handlers: {
        handleDrop: (args: DropEventArgs) => void;
        handleDragOver: (e: Event) => void;
        handleDragLeave: (e: Event) => void;
        handleNestedDrop: (parentId: string, cellInfo: { row: number; col: number; tabIndex?: number } | undefined, parentPath?: string) => void;
        handleNestedDragOver: (e: Event, panelId: string) => void;
        handleNestedDragLeave: (e: Event) => void;
        openListBoxPane: () => void;
        closeListBoxPane: () => void;
        onListBoxSelect: (component: PaletteComponent) => void;
        onAddFieldMessageKeyDown: (e: KeyboardEvent) => void;
        helper: (args: any) => HTMLElement | null;
        dragStart: (e: any) => void;
        drag: (e: any) => void;
        dragStop: (args: any) => void;
        nestedHelper: (args: any, containerClass: string) => HTMLElement | null;
        nestedDragStart: (e: any) => void;
        nestedDrag: (e: any) => void;
        nestedDragStop: (args: any, containerClass: string) => void;
        handleMoveUp: (fieldId: string) => void;
        handleMoveDown: (fieldId: string) => void;
        handleNestedMoveUp: (fieldId: string, parentId: string, parentPath: string, cellInfo?: { row?: number; col?: number; tabIndex?: number }) => void;
        handleNestedMoveDown: (fieldId: string, parentId: string, parentPath: string, cellInfo?: { row?: number; col?: number; tabIndex?: number }) => void;
        findComponentById: (id: string) => FormNode | null;
        isIdInSubtree: (root: FormNode, id: string) => boolean;
        findDropTarget: (cursorY: number, selector: string, container?: Element | null) => DropTargetResult;
        findFilteredClosest: (target: any, selector: string, blockedSelectors?: string[]) => HTMLElement | null;
        updateDropTargetVisuals: (target: DropTargetResult) => void;
        clearDropTargetVisuals: () => void;
        updateNestedDropTargetVisuals: (target: DropTargetResult, selector: string, container?: Element | null) => void;
        clearNestedDropTargetVisuals: () => void;
        closePreview: () => void;
    };

    constructor(host: HTMLElement, props: MainSectionProps, l10n: L10n) {
        this.host = host;
        this.props = props;
        this.parent = props.parent;
        this.l10n = l10n;
        this.rootEl = null;
        this.formAreaEl = null;
        this.cachedFields = new Map<string, CachedField>();
        this.renderedInstances = [];
        this.owners = {
            droppables: [],
            draggables: [],
            fieldWrappers: [],
            tooltips: [],
            tabs: [],
            toolbars: [],
            messages: [],
            listboxes: [],
            buttons: [],
            dialogs: [],
            grids: [],
            formRenderers: [],
            previewPane: null,
            pendingTimers: [],
            docListeners: [],
            gridRefs: new Map<string, any>(),
            preservedNodes: []
        };
        this.pointerTrackerHost = null;
        this.pointerTrackerHandler = null;
        this.dropTargetIndex = null;
        this.dropPosition = null;
        this.draggedComponentInfo = null;
        this.isReordering = false;
        this.isNestedReordering = false;
        this.activeNestedContainer = null;
        this.draggingOverPanel = null;
        this.currentComponents = [];
        this.currentSchema = (props && props.formSchema) || defaultFormSchema();
        this.nestedDropTargetIndex = null;
        this.nestedDropPosition = null;
        this.activeTabIndices = new Map<string, number>();
        this.addFieldMessageWrapper = null;
        this.addFieldMessage = null;
        this.listboxPane = null;
        this.listboxPaneHost = null;
        this.jsonViewer = null;
        this.lastJsonSchemaRef = null;
        this.previewPane = null;
        this.previewPaneHost = null;
        this.lastPreviewSchemaRef = null;
        this.lastPreviewSplitData = null;
        this.initialDragY = null;
        this.currentDragY = null;
        this.isDraggingFromPalette = false;
        this.draggedItemIndex = null;
        this.nestedInitialDragY = null;
        this.nestedCurrentDragY = null;
        this.nestedDraggedIndex = null;
        this.nestedComponents = [];
        this.nestedContainerId = null;
        this.nestedContainerPath = null;
        this.nestedCellInfo = undefined;
        this.rootCloneHost = null;
        this.nestedCloneHost = null;
        this.toolbarHost = null;
        this.editorToolbar = null;
        this.showSplitView = false;
        this.isPreviewOpen = false;
        this.handlers = {
            handleDrop: this.handleDrop.bind(this),
            handleDragOver: this.handleDragOver.bind(this),
            handleDragLeave: this.handleDragLeave.bind(this),
            handleNestedDrop: this.handleNestedDrop.bind(this),
            handleNestedDragOver: this.handleNestedDragOver.bind(this),
            handleNestedDragLeave: this.handleNestedDragLeave.bind(this),
            openListBoxPane: this.openListBoxPane.bind(this),
            closeListBoxPane: this.closeListBoxPane.bind(this),
            onListBoxSelect: this.onListBoxSelect.bind(this),
            onAddFieldMessageKeyDown: this.onAddFieldMessageKeyDown.bind(this),
            helper: this.helper.bind(this),
            dragStart: this.dragStart.bind(this),
            drag: this.drag.bind(this),
            dragStop: this.dragStop.bind(this),
            nestedHelper: this.nestedHelper.bind(this),
            nestedDragStart: this.nestedDragStart.bind(this),
            nestedDrag: this.nestedDrag.bind(this),
            nestedDragStop: this.nestedDragStop.bind(this),
            handleMoveUp: this.handleMoveUp.bind(this),
            handleMoveDown: this.handleMoveDown.bind(this),
            handleNestedMoveUp: this.handleNestedMoveUp.bind(this),
            handleNestedMoveDown: this.handleNestedMoveDown.bind(this),
            findComponentById: this.findComponentById.bind(this),
            isIdInSubtree: this.isIdInSubtree.bind(this),
            findDropTarget: this.findDropTarget.bind(this),
            findFilteredClosest: this.findFilteredClosest.bind(this),
            updateDropTargetVisuals: this.updateDropTargetVisuals.bind(this),
            clearDropTargetVisuals: this.clearDropTargetVisuals.bind(this),
            updateNestedDropTargetVisuals: this.updateNestedDropTargetVisuals.bind(this),
            clearNestedDropTargetVisuals: this.clearNestedDropTargetVisuals.bind(this),
            closePreview: this.closePreview.bind(this)
        };

        this.buildShell();
    }

    public render(
        schema: FormSchema,
        changedFieldId?: string,
        refreshCachedFields: boolean = false
    ): void {
        this.currentSchema = schema || defaultFormSchema();
        const scrollTop: number = this.rootEl ? this.rootEl.scrollTop : 0;
        const scrollLeft: number = this.rootEl ? this.rootEl.scrollLeft : 0;
        this.cacheFields(changedFieldId, refreshCachedFields);
        this.disposeChildren();
        this.renderedInstances = [];
        if (this.props.formBuilder.isReact && this.props.formBuilder.portals) {
            (this.props.formBuilder as any).renderReactTemplates();
        }
        if (!this.formAreaEl) {
            this.buildShell();
            if (!this.formAreaEl) {
                return;
            }
        }
        const safe: FormSchema = this.currentSchema;
        const isEmpty: boolean = isDefaultFormSchema(safe);
        if (this.formAreaEl) {
            this.formAreaEl.classList.toggle('empty', isEmpty);
        }
        this.renderToolbar(safe);
        if (this.isPreviewOpen) {
            this.renderPreview(safe);
            this.notifyFormIdInvalidation(safe);
            this.disposeCachedFields();
            return;
        }
        this.disposePreviewPane();
        if (this.showSplitView) {
            this.renderJsonView(safe);
            this.notifyFormIdInvalidation(safe);
            this.disposeCachedFields();
            return;
        }
        if (isEmpty) {
            this.renderEmptyState(safe);
        } else {
            this.renderForm(safe);
        }
        this.notifyFormIdInvalidation(safe);
        this.disposeCachedFields();
        (this.currentSchema.components || []).forEach((component: FormNode) => {
            this.refreshRenderedComponent(component, this.rootEl);
        });
        if (this.rootEl) {
            this.rootEl.scrollTop = scrollTop;
            this.rootEl.scrollLeft = scrollLeft;
        }
    }

    private refreshRenderedComponent(component: FormNode, rendered: HTMLElement): void {
        let componentRoot: HTMLElement = rendered;
        if (component.type === 'tabs') {
            componentRoot = rendered.querySelector(`#${component.id}.e-control.e-tab`) as HTMLElement || rendered;
        } else {
            componentRoot = rendered.querySelector(`[data-field-id="${component.id}"]`) as HTMLElement || rendered;
        }
        if (component.type === 'richTextEditor') {
            const rteElement: HTMLElement | null = componentRoot.querySelector('.e-richtexteditor');
            const rteInstance: any = rteElement ? getComponent(rteElement, 'richtexteditor') : null;
            if (rteInstance) {
                (rteInstance as RichTextEditor).refreshUI();
            }
        }
        if (component.type === 'dataGrid') {
            const toolbarElement: HTMLElement | null = componentRoot.querySelector('.e-control.e-toolbar');
            const toolbarInstance: any = toolbarElement ? getComponent(toolbarElement, 'toolbar') : null;
            if (toolbarInstance) {
                (toolbarInstance as Toolbar).refresh();
            }
        }
        if (component.children) {
            component.children.forEach((child: FormNode) => this.refreshRenderedComponent(child, rendered));
        }
        if (component.tableCells) {
            component.tableCells.forEach((row: FormNode[][]) => {
                row.forEach((cell: FormNode[]) => cell.forEach((child: FormNode) => this.refreshRenderedComponent(child, rendered)));
            });
        }
        if (component.tabItems) {
            component.tabItems.forEach((tab) => {
                if (tab.content) {
                    tab.content.forEach((child: FormNode) => this.refreshRenderedComponent(child, rendered));
                }
            });
        }
    }

    private destroyRenderedInstance(inst: any): void {
        if (!inst || typeof inst.destroy !== 'function') {
            return;
        }
        const state: any = inst;
        if (state.isDestroyed || state.destroyed || state.disposed) {
            return;
        }
        const hostElement: HTMLElement | undefined = inst.element || inst.target || (inst.hostElement && typeof inst.hostElement === 'function' ? inst.hostElement() : undefined);
        try {
            state.isDestroyed = true;
            state.destroyed = true;
            state.disposed = true;
            inst.destroy();
        } catch (e) {
            console.warn('FormRenderer: failed to destroy child instance.', e);
        } finally {
            if (hostElement && hostElement.parentNode) {
                try {
                    hostElement.parentNode.removeChild(hostElement);
                } catch (e) {
                }
            }
        }
    }

    /** @private */
    public destroy(): void {
        this.disposeCachedFields();
        if (this.props.formBuilder.isReact || this.props.formBuilder.isAngular) {
            (this.props.formBuilder as any).clearTemplate();
        }
        this.renderedInstances.forEach((inst: any) => {
            this.destroyRenderedInstance(inst);
        });
        this.disposeChildren();
        this.renderedInstances = [];
        if (this.editorToolbar) {
            this.editorToolbar.destroy();
            this.editorToolbar = null;
        }
        if (this.toolbarHost && this.toolbarHost.parentNode === this.host) {
            this.toolbarHost.parentNode.removeChild(this.toolbarHost);
        }
        this.toolbarHost = null;
        if (this.rootEl && this.rootEl.parentNode === this.host) {
            this.host.removeChild(this.rootEl);
        }
        this.rootEl = null;
        this.formAreaEl = null;
        this.activeTabIndices.clear();
        if (this.rootCloneHost) {
            this.rootCloneHost.style.display = 'none';
            this.rootCloneHost.style.opacity = '0';
        }
        if (this.nestedCloneHost) {
            this.nestedCloneHost.style.display = 'none';
            this.nestedCloneHost.style.opacity = '0';
        }
        this.rootCloneHost = null;
        this.nestedCloneHost = null;
        this.initialDragY = null;
        this.currentDragY = null;
        this.nestedInitialDragY = null;
        this.nestedCurrentDragY = null;
        this.draggedItemIndex = null;
        this.nestedDraggedIndex = null;
        this.isReordering = false;
        this.isNestedReordering = false;
        this.isDraggingFromPalette = false;
        this.activeNestedContainer = null;
        this.draggedComponentInfo = null;
        this.nestedComponents = [];
        this.nestedContainerId = null;
        this.nestedContainerPath = null;
        this.nestedCellInfo = undefined;
        this.removeTrackedListener(
            this.addFieldMessageWrapper,
            'keydown',
            this.handlers.onAddFieldMessageKeyDown as EventListener
        );
        this.removeTrackedListener(
            this.addFieldMessageWrapper,
            'click',
            this.openListBoxPane as EventListener
        );
        if (this.addFieldMessage) {
            try {
                this.addFieldMessage.destroy();
            } catch (e) {
                /* ignore */
            }
            var msgIdx: number = this.owners.messages.indexOf(this.addFieldMessage);
            if (msgIdx >= 0) {
                this.owners.messages.splice(msgIdx, 1);
            }
        }
        this.addFieldMessage = null;
        this.addFieldMessageWrapper = null;
        if (this.listboxPane) {
            this.listboxPane.destroy();
        }
        this.listboxPane = null;
        if (this.listboxPaneHost && this.listboxPaneHost.parentNode) {
            this.listboxPaneHost.parentNode.removeChild(this.listboxPaneHost);
        }
        this.listboxPaneHost = null;
        this.isListBoxPaneOpen = false;
        this.jsonViewer = null;
        this.lastJsonSchemaRef = null;
        this.previewPane = null;
        this.previewPaneHost = null;
        this.owners.previewPane = null;
        this.lastPreviewSchemaRef = null;
        this.lastPreviewSplitData = null;
        this.isPreviewOpen = false;
        for (let b: number = 0; b < this.owners.buttons.length; b++) {
            try {
                if (this.owners.buttons[b as number] && typeof this.owners.buttons[b as number].destroy === 'function') {
                    this.owners.buttons[b as number].destroy();
                }
            } catch (e) {
                /* ignore */
            }
        }
        this.owners.buttons = [];
        for (let d: number = 0; d < this.owners.dialogs.length; d++) {
            try {
                if (this.owners.dialogs[d as number] && typeof this.owners.dialogs[d as number].destroy === 'function') {
                    this.owners.dialogs[d as number].destroy();
                }
            } catch (e) {
                /* ignore */
            }
        }
        this.owners.dialogs = [];
        for (let g: number = 0; g < this.owners.grids.length; g++) {
            try {
                if (this.owners.grids[g as number] && typeof this.owners.grids[g as number].destroy === 'function') {
                    this.owners.grids[g as number].destroy();
                }
            } catch (e) {
                /* ignore */
            }
        }
        this.owners.grids = [];
        for (let r: number = 0; r < this.owners.formRenderers.length; r++) {
            try {
                if (this.owners.formRenderers[r as number] && typeof this.owners.formRenderers[r as number].destroy === 'function') {
                    this.owners.formRenderers[r as number].destroy();
                }
            } catch (e) {
                /* ignore */
            }
        }
        this.owners.formRenderers = [];
        this.clearAllDragVisuals();
    }

    /** @private */
    public static isDefaultFormSchema(schema: FormSchema | null | undefined): boolean {
        return isDefaultFormSchema(schema);
    }

    private getFormWidth(schema: FormSchema): string {
        const width: any = schema && schema.settings && schema.settings.width;
        if (!width) {
            return '500px';
        }
        const widthValue: string = String(width).trim();
        const percentage: RegExpMatchArray | null = widthValue.match(/^([0-9]+(?:\.[0-9]+)?)%$/);
        return percentage && parseFloat(percentage[1]) > 100 ? '100%' : widthValue;
    }

    private buildShell(): void {
        if (this.rootEl && this.rootEl.parentNode === this.host) {
            return;
        }
        const root: HTMLElement = createElement('div', {
            className: 'main-content e-form-builder-canvas',
            attrs: { 'aria-label': 'Design canvas' }
        });
        const formArea: HTMLElement = createElement('div', {
            className: 'form-preview-area e-form-builder-canvas-area',
            attrs: {
                'data-drop-zone': 'root',
                'tabindex': '-1',
                'role': 'region',
                'aria-label': 'Form Preview'
            }
        });
        const rootClone: HTMLElement = createElement('div', {
            className: 'form-field-clone',
            attrs: { 'aria-hidden': 'true' },
            styles: 'opacity: 0; padding: 12px; z-index: 10000; justify-content: center; align-items: center; gap: 8px;'
                + ' height: 37px; min-width: 170px; background-color: rgb(var(--sf-drag-clone));'
                + ' border: 2px solid var(--sf-color-primary); border-radius: 8px;'
                + ' box-shadow: 0 4px 12px rgba(0,0,0,0.2); pointer-events: none; display: none;'
        });
        const rootCloneContent: HTMLElement = createElement('div', {
            className: 'clone-content',
            styles: 'font-size: 14px; font-weight: 500;'
        });
        rootClone.appendChild(rootCloneContent);
        const nestedClone: HTMLElement = createElement('div', {
            className: 'nested-field-clone',
            attrs: { 'aria-hidden': 'true' },
            styles: 'opacity: 0; padding: 12px; z-index: 10001; justify-content: center; align-items: center; gap: 8px;'
                + ' height: 37px; min-width: 170px; background-color: var(--sf-color-surface);'
                + ' border: 2px solid var(--sf-color-primary); border-radius: 8px;'
                + ' box-shadow: 0 4px 12px rgba(0,0,0,0.2); pointer-events: none; display: none;'
                + ' position: fixed;'
        });
        const nestedCloneContent: HTMLElement = createElement('div', {
            className: 'clone-content',
            styles: 'font-size: 14px; font-weight: 500;'
        });
        nestedClone.appendChild(nestedCloneContent);
        root.appendChild(formArea);
        root.appendChild(rootClone);
        root.appendChild(nestedClone);
        this.toolbarHost = createElement('div', {
            attrs: {
                id: 'Editor-Tooltip',
                role: 'toolbar',
                'aria-label': 'Form Builder Actions',
                style: 'position: absolute;'
            },
            className: 'editor-handle'
        });
        this.host.appendChild(root);
        this.host.appendChild(this.toolbarHost);
        this.rootEl = root;
        this.formAreaEl = formArea;
        this.rootCloneHost = rootClone;
        this.nestedCloneHost = nestedClone;
        if (this.props.enableRtl) {
            root.classList.add('e-rtl');
        }
    }

    private renderToolbar(schema: FormSchema): void {
        if (!this.toolbarHost) {
            return;
        }
        const toolbarOptions = {
            enablePreview: this.props.enablePreview,
            isDefaultSchema: MainSection.isDefaultFormSchema(schema),
            enableRtl: this.props.enableRtl,
            showSplitView: this.showSplitView,
            isPreviewOpen: this.isPreviewOpen,
            onCopySchema: this.handleCopySchema.bind(this),
            onReset: this.handleReset.bind(this),
            onShowBuild: this.handleShowBuild.bind(this),
            onShowJson: this.handleShowJson.bind(this),
            onShowPreview: this.handleShowPreview.bind(this)
        };
        if (!this.editorToolbar) {
            this.editorToolbar = new EditorToolbar(this.toolbarHost, toolbarOptions, this.l10n, this.owners);
            return;
        }
        this.editorToolbar.render(toolbarOptions);
    }

    private handleReset(): void {
        this.renderedInstances.forEach((inst: any) => {
            this.destroyRenderedInstance(inst);
        });
        this.renderedInstances = [];
        if (this.props.onReset) {
            this.props.onReset();
        }
    }

    private handleCopySchema(): void {
        if (this.props.onCopySchema) {
            this.props.onCopySchema();
        }
    }

    private handleShowBuild(): void {
        this.showSplitView = false;
        this.isPreviewOpen = false;
        this.render(this.currentSchema);
    }

    private handleShowJson(): void {
        this.showSplitView = true;
        this.isPreviewOpen = false;
        this.renderedInstances.forEach((inst: any) => {
            this.destroyRenderedInstance(inst);
        });
        this.renderedInstances = [];
        this.render(this.currentSchema);
    }

    private handleShowPreview(): void {
        this.isPreviewOpen = true;
        this.renderedInstances.forEach((inst: any) => {
            this.destroyRenderedInstance(inst);
        });
        this.renderedInstances = [];
        this.render(this.currentSchema);
    }

    /** @private */
    public closePreview(): void {
        if (!this.isPreviewOpen) {
            return;
        }
        this.isPreviewOpen = false;
        this.render(this.currentSchema);
    }

    private renderPreview(schema: FormSchema): void {
        if (!this.rootEl) {
            return;
        }
        if (this.formAreaEl) {
            this.formAreaEl.style.display = 'none';
        }
        this.ensurePreviewPane();
        if (!this.previewPane) {
            return;
        }
        const safe: FormSchema = schema || this.currentSchema || defaultFormSchema();
        let splitData: any = null;
        if (this.lastPreviewSchemaRef !== safe || !this.lastPreviewSplitData) {
            try {
                splitData = splitSchema(safe as any);
            } catch (err) {
                splitData = null;
            }
            this.lastPreviewSchemaRef = safe;
            this.lastPreviewSplitData = splitData;
        } else {
            splitData = this.lastPreviewSplitData;
        }
        this.previewPane.render({
            isOpen: true,
            onClose: this.handlers.closePreview,
            schema: splitData,
            formSchema: safe,
            locale: this.props.locale || 'en-US',
            owners: this.getPreviewPaneOwners(),
            toolboxItems: this.getToolboxItems(),
            formBuilder: this.props.formBuilder
        });
        this.notifyFormIdInvalidation(safe);
    }

    private ensurePreviewPane(): void {
        if (this.previewPane && this.previewPaneHost && this.previewPaneHost.parentNode) {
            return;
        }
        if (!this.rootEl) {
            return;
        }
        const host: HTMLElement = this.host;
        this.previewPaneHost = host;
        this.previewPane = new PreviewPane(
            host,
            {
                isOpen: true,
                onClose: this.handlers.closePreview,
                enableRtl: this.props.enableRtl,
                schema: null,
                formSchema: this.currentSchema || defaultFormSchema(),
                locale: this.props.locale || 'en-US',
                owners: this.getPreviewPaneOwners(),
                toolboxItems: this.getToolboxItems(),
                formBuilder: this.props.formBuilder
            }
        );
        this.owners.previewPane = this.previewPane;
    }

    /**
     * Returns the owning `FormBuilder.toolboxItems` entries so the preview
     * `FormRenderer` receives them as its `customWidgetSettings` — each
     * entry's `template` / `type` / `templateId` passed as-is.
     *
     * @private
     */
    private getToolboxItems(): any[] {
        const fb: any = this.props && this.props.formBuilder;
        if (!fb) {
            return [];
        }
        return (fb.toolboxItems as any[]) || [];
    }

    private getPreviewPaneOwners(): PreviewPaneOwners {
        return {
            buttons: this.owners.buttons,
            dialogs: this.owners.dialogs,
            grids: this.owners.grids,
            formRenderers: this.owners.formRenderers,
            docListeners: this.owners.docListeners as any,
            timers: this.owners.pendingTimers
        };
    }

    private disposePreviewPane(): void {
        if (this.previewPane) {
            try {
                this.previewPane.destroy();
            } catch (err) {
                /* ignore */
            }
            this.previewPane = null;
            this.owners.previewPane = null;
        }
        this.previewPaneHost = null;
        this.lastPreviewSchemaRef = null;
        this.lastPreviewSplitData = null;
        if (this.formAreaEl) {
            this.formAreaEl.style.display = '';
        }
    }

    /**
     * Programmatically sets a form field's value for user edits.
     *
     * @private
     * @param  {string} fieldName - The field's `name` (the schema property's `name`).
     * @param  {any} value - The new value to set.
     * @returns void
     */
    public setFieldValue(fieldName: string, value: any): void {
        this.previewPane.setFieldValue(fieldName, value);
    }

    private renderJsonView(schema: FormSchema): void {
        if (!this.rootEl) {
            return;
        }
        if (this.formAreaEl) {
            this.formAreaEl.style.display = 'none';
        }
        if (!this.jsonViewer) {
            const owners: JsonViewerOwners = {
                buttons: this.owners.buttons,
                docListeners: this.owners.docListeners as any
            };
            this.jsonViewer = new JsonViewer(
                this.rootEl,
                { formSchema: schema, l10n: this.l10n, force: true, copySchema: this.handleCopySchema.bind(this) },
                owners
            );
        } else {
            this.jsonViewer.render({ formSchema: schema, l10n: this.l10n });
        }
    }

    public refreshJsonViewer(schema: FormSchema): void {
        if (schema) {
            this.currentSchema = schema;
        }
        if (this.jsonViewer) {
            this.jsonViewer.refresh(this.currentSchema);
        }
    }

    public updateJsonViewer(schema: FormSchema): void {
        this.refreshJsonViewer(schema);
    }

    private notifyFormIdInvalidation(schema: FormSchema): void {
        if (this.lastJsonSchemaRef === schema) {
            return;
        }
        this.lastJsonSchemaRef = schema;
    }

    private disposeJsonViewer(): void {
        if (this.jsonViewer) {
            this.jsonViewer.destroy();
            this.jsonViewer = null;
        }
        if (this.rootEl) {
            const leftovers: NodeListOf<Element> = this.rootEl.querySelectorAll('.split-view-container');
            for (let i: number = leftovers.length - 1; i >= 0; i--) {
                const node: Node = leftovers[i as number];
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            }
        }
    }

    private disposeChildren(): void {
        for (let i: number = 0; i < this.owners.droppables.length; i++) {
            try {
                this.owners.droppables[i as number].destroy();
            } catch (e) {
                /* ignore */
            }
        }
        this.owners.droppables = [];
        for (let d: number = 0; d < this.owners.draggables.length; d++) {
            try {
                this.owners.draggables[d as number].destroy();
            } catch (e) {
                /* ignore */
            }
        }
        this.owners.draggables = [];
        for (let j: number = 0; j < this.owners.fieldWrappers.length; j++) {
            const fieldId: string = this.owners.fieldWrappers[j as number].getHost().getAttribute('data-field-id') || '';
            if (this.cachedFields.has(fieldId)) {
                continue;
            }
            try {
                this.owners.fieldWrappers[j as number].destroy();
            } catch (e) {
                /* ignore */
            }
        }
        this.owners.fieldWrappers = [];
        for (let k: number = 0; k < this.owners.tabs.length; k++) {
            try {
                this.owners.tabs[k as number].destroy();
            } catch (e) {
                /* ignore */
            }
        }
        this.owners.tabs = [];
        for (let m: number = 0; m < this.owners.messages.length; m++) {
            try {
                this.owners.messages[m as number].destroy();
            } catch (e) {
                /* ignore */
            }
        }
        this.owners.messages = [];
        this.addFieldMessage = null;
        this.addFieldMessageWrapper = null;
        if (this.formAreaEl) {
            while (this.formAreaEl.firstChild) {
                this.formAreaEl.removeChild(this.formAreaEl.firstChild);
            }
            this.formAreaEl.style.display = '';
        }
        this.disposePreviewPane();
        this.disposeJsonViewer();
        if (this.listboxPane) {
            try {
                this.listboxPane.destroy();
            } catch (e) {
                /* ignore */
            }
        }
        this.listboxPane = null;
        this.listboxPaneHost = null;
        const dragged: NodeListOf<Element> = this.parent.querySelectorAll('.is-being-dragged');
        for (let b: number = 0; b < dragged.length; b++) {
            (dragged[b as number] as HTMLElement).classList.remove('is-being-dragged');
        }
        this.disposeGlobalPointerTracker();
        this.clearAllDragVisuals();
    }

    private renderEmptyState(schema: FormSchema): void {
        if (!this.formAreaEl) {
            return;
        }
        const formWidth: string = this.getFormWidth(schema);
        const empty: HTMLElement = createElement('div', {
            className: 'empty-state',
            attrs: {
                'data-empty-state': 'true',
                'style': 'min-width: ' + formWidth + '; max-width: ' + formWidth + '; overflow-x: auto;'
            }
        });
        const dropZone: HTMLElement = createElement('div', {
            className: 'form-dropzone sf-lib sf-droppable',
            attrs: { 'aria-label': 'Drop Zone' }
        });
        const content: HTMLElement = createElement('div', {
            className: 'form-dropzone-content'
        });
        const icon: HTMLElement = createElement('div', {
            className: 'form-dropzone-icon'
        });
        icon.innerHTML = FormDropZoneIconSvg;
        const title: HTMLElement = createElement('span', {
            className: 'dropzone-title'
        });
        const hint: HTMLElement = createElement('p', {
            className: 'dropzone-hint'
        });

        const useDropState: boolean = false;
        title.textContent = this.l10n ? (this.l10n.getConstant('startBuildingForm') || 'Start building your form') : 'Start building your form';
        hint.textContent = this.l10n ? (this.l10n.getConstant('dragFieldsHint') || 'Drag fields from the left panel and drop them here to create your form.') : 'Drag fields from the left panel and drop them here to create your form.';

        content.appendChild(icon);
        content.appendChild(title);
        content.appendChild(hint);
        dropZone.appendChild(content);
        empty.appendChild(dropZone);
        this.formAreaEl.appendChild(empty);
        this.registerRootDroppable(this.formAreaEl, schema, true);
        this.installGlobalPointerTracker(this.formAreaEl);
    }

    private renderAddFieldMessage(parent: HTMLElement): void {
        var ariaLabel: string = this.l10n
            ? (this.l10n.getConstant('addNewField') || 'Add new field')
            : 'Add new field';
        var wrapper: HTMLElement = createElement('div', {
            className: 'add-field-message-wrapper',
            attrs: {
                tabindex: '0',
                role: 'button',
                'aria-label': ariaLabel
            }
        });
        var messageHost: HTMLElement = createElement('div', {
            className: 'add-field-message'
        });
        wrapper.appendChild(messageHost);
        parent.appendChild(wrapper);

        wrapper.addEventListener('keydown', this.handlers.onAddFieldMessageKeyDown as EventListener);
        this.owners.docListeners.push({
            target: wrapper,
            event: 'keydown',
            handler: this.handlers.onAddFieldMessageKeyDown as EventListener
        });

        var hint: string = this.l10n
            ? (this.l10n.getConstant('dragAnyFieldHere') || 'Drag any field here or click to add new field')
            : 'Drag any field here or click to add new field';
        var contentHtml: string = '<span class="add-field-message-body">'
            + '<span class="e-icons e-plus" aria-hidden="true"></span>'
            + this.escapeHtml(hint)
            + '</span>';
        var message: Message = new Message({
            content: contentHtml,
            cssClass: 'add-field-message',
            showIcon: false,
            showCloseIcon: false
        } as any);
        message.appendTo(messageHost);
        this.addFieldMessage = message;
        this.owners.messages.push(message);
        this.addFieldMessageWrapper = wrapper;
        wrapper.addEventListener('click', this.handlers.openListBoxPane as EventListener);
        this.owners.docListeners.push({
            target: wrapper,
            event: 'click',
            handler: this.handlers.openListBoxPane as EventListener
        });
    }

    private renderListBoxPaneHost(parent?: HTMLElement): void {
        if (this.listboxPane || this.listboxPaneHost) {
            return;
        }
        var host: HTMLElement = createElement('div', {
            className: 'listbox-pane-host',
            attrs: { 'aria-hidden': 'true' }
        });
        var mount: HTMLElement | null = parent || this.rootEl || this.host || null;
        if (mount) {
            mount.appendChild(host);
        }
        this.listboxPaneHost = host;
        var owners: ListBoxPaneOwners = {
            listboxes: this.owners.listboxes,
            docListeners: this.owners.docListeners,
            timers: this.owners.pendingTimers
        };
        this.listboxPane = new ListBoxPane(
            host,
            {
                isOpen: false,
                onClose: this.handlers.closeListBoxPane,
                onSelect: this.handlers.onListBoxSelect,
                paletteConfig: (this.props as any).paletteConfig,
                mode: this.props.mode,
                l10n: this.l10n,
                owners: owners
            },
            this.l10n
        );
    }

    public openListBoxPane(): void {
        if (this.isListBoxPaneOpen) {
            return;
        }
        this.isListBoxPaneOpen = true;
        if (this.listboxPane) {
            this.listboxPane.render({
                isOpen: true,
                onClose: this.handlers.closeListBoxPane,
                onSelect: this.handlers.onListBoxSelect,
                paletteConfig: (this.props as any).paletteConfig,
                mode: this.props.mode,
                l10n: this.l10n,
                owners: {
                    listboxes: this.owners.listboxes,
                    docListeners: this.owners.docListeners,
                    timers: this.owners.pendingTimers
                }
            });
        }
    }

    public closeListBoxPane(): void {
        if (!this.isListBoxPaneOpen) {
            return;
        }
        this.isListBoxPaneOpen = false;
        if (this.listboxPane) {
            this.listboxPane.render({
                isOpen: false,
                onClose: this.handlers.closeListBoxPane,
                onSelect: this.handlers.onListBoxSelect,
                paletteConfig: (this.props as any).paletteConfig,
                mode: this.props.mode,
                l10n: this.l10n,
                owners: {
                    listboxes: this.owners.listboxes,
                    docListeners: this.owners.docListeners,
                    timers: this.owners.pendingTimers
                }
            });
        }
    }

    private onAddFieldMessageKeyDown(e: KeyboardEvent): void {
        if (!e) {
            return;
        }
        if (e.code === 'Enter' || e.code === 'Space' || e.key === 'Enter' || e.key === ' ') {
            this.openListBoxPane();
            e.preventDefault();
        }
    }

    private onListBoxSelect(palette: PaletteComponent): void {
        if (!palette || !palette.type) {
            return;
        }
        var newComponent: FormNode = {
            id: generateId(palette.type as any),
            type: palette.type as any,
            label: palette.label || '',
            name: generateName(palette.type as any)
        };
        if (this.props.onDrop) {
            this.props.onDrop(newComponent);
        }
    }

    private escapeHtml(text: string): string {
        if (!text) {
            return '';
        }
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    private renderForm(schema: any): void {
        if (!this.formAreaEl) {
            return;
        }
        const formWidth: string = this.getFormWidth(schema);
        const components: FormNode[] = (schema.components || []).slice();
        this.currentComponents = components;
        const total: number = components.length;

        const previewShell: HTMLElement = createElement('div', {
            attrs: {
                style: 'margin: 0 auto; min-height: 100%'
            }
        });
        const formEl: HTMLElement = createElement('form', {
            className: 'sf-control form-components',
            attrs: {
                'novalidate': '',
                'aria-label': 'Form Builder Preview',
                'autocomplete': 'off',
                'style': 'min-width: ' + formWidth + '; overflow-x: auto;'+ 'width: ' + formWidth + ';'
            }
        });
        const draggableContainer: HTMLElement = createElement('div', {
            className: 'draggable-fields-container sf-lib sf-droppable'
        });
        const innerDraggable: HTMLElement = createElement('div', {
            attrs: {
                style: 'width: 100%; margin: 0px; padding: 0px;'
            }
        });

        innerDraggable.appendChild(draggableContainer);
        formEl.appendChild(innerDraggable);
        previewShell.appendChild(formEl);
        this.formAreaEl.appendChild(previewShell);

        for (let i: number = 0; i < total; i++) {
            const comp: FormNode = components[i as number];
            const wrapperHost: HTMLElement = createElement('div', {
                className: 'form-field-wrapper',
                attrs: {
                    'data-field-id': comp.id || ''
                }
            });
            draggableContainer.appendChild(wrapperHost);
            const wrapper: FormFieldWrapper = this.renderField(comp, i, total, wrapperHost);
            this.owners.fieldWrappers.push(wrapper);
        }

        this.renderAddFieldMessage(innerDraggable);

        this.renderListBoxPaneHost(previewShell);

        if (total > 0) {
            const rootDraggable: Draggable = new Draggable(innerDraggable, {
                scope: 'internal',
                clone: true,
                enableTailMode: true,
                isPreventSelect: true,
                helper: this.handlers.helper,
                dragStart: this.handlers.dragStart,
                drag: this.handlers.drag,
                dragStop: this.handlers.dragStop
            });
            this.owners.draggables.push(rootDraggable);
        }

        this.registerRootDroppable(this.formAreaEl, schema, false);
        this.installGlobalPointerTracker(this.formAreaEl);
    }

    private renderField(
        component: FormNode,
        index: number,
        total: number,
        existingHost?: HTMLElement,
        nestedContainerClass?: 'panel-child-field-draggable' | 'tab-child-field-draggable' | 'table-cell-child-draggable',
        nestingContext?: {
            parentId: string;
            parentPath: string;
            cellInfo?: { row?: number; col?: number; tabIndex?: number };
        }
    ): FormFieldWrapper {
        const fieldId: string = component.id || '';
        const cached: CachedField | undefined = this.cachedFields.get(fieldId);
        if (cached && cached.type === String(component.type)) {
            this.cachedFields.delete(fieldId);
            if (existingHost && existingHost.parentNode) {
                existingHost.parentNode.insertBefore(cached.host, existingHost);
                existingHost.parentNode.removeChild(existingHost);
            }
            const field: HTMLElement | null = cached.host.querySelector('.form-field');
            if (field) {
                field.setAttribute('data-index', String(index));
                if (nestedContainerClass) {
                    field.setAttribute('data-nested-index', String(index));
                }
            }
            cached.wrapper.updatePreserved(
                component,
                MainSection.activeFieldId === fieldId,
                index,
                total,
                !!nestedContainerClass,
                nestingContext
            );
            return cached.wrapper;
        }
        const wrapperHost: HTMLElement = existingHost || createElement('div', {
            className: 'e-form-builder-field-slot',
            attrs: { 'data-field-index': String(index) }
        });
        if (!existingHost && this.formAreaEl) {
            this.formAreaEl.appendChild(wrapperHost);
        }

        const isActive: boolean = MainSection.activeFieldId === component.id;
        const wrapperProps: FormFieldWrapperProps = {
            component: component,
            isActive: isActive,
            index: index,
            totalCount: total,
            mode: this.props.mode,
            enableRtl: this.props.enableRtl,
            registerRenderedInstance: (instance: any) => this.renderedInstances.push(instance),
            hasClipboardData: this.props.hasClipboardData,
            isNested: !!nestedContainerClass,
            nestingContext: nestingContext,
            onEdit: (id: string) => this.props.onEdit(id),
            onCopy: (field: FormNode) => this.props.onCopy(field),
            onPaste: (targetId: string) => this.props.onPaste(targetId),
            onDelete: (id: string) => this.props.onDelete(id),
            onSwitchWidget: this.props.onSwitchWidget,
            onMoveUp: this.props.onMoveUp,
            onMoveDown: this.props.onMoveDown,
            onNestedMoveUp: this.props.onNestedMoveUp,
            onNestedMoveDown: this.props.onNestedMoveDown,
            nestedContainerClass: nestedContainerClass
        };
        const wrapper: FormFieldWrapper = new FormFieldWrapper(wrapperHost, wrapperProps, this.l10n);
        const fieldHost: HTMLElement = wrapper.getFieldHost();

        let skipDefault: boolean = false;
        const resolvedWidget: { template: HTMLElement | Function | null; templateId: string } | null =
            this.resolveCustomWidget(component);
        if (resolvedWidget && resolvedWidget.template) {
            let compiled: any = null;
            try {
                compiled = this.getTemplateFunction(resolvedWidget.template);
            } catch (e) {
                compiled = null;
            }
            if (compiled && fieldHost.parentElement) {
                try {
                    const fieldInput: HTMLElement = fieldHost.parentElement;
                    if (fieldHost.parentNode) {
                        fieldHost.parentNode.removeChild(fieldHost);
                    }
                    const swappedComponent: FormNode = Object.assign({}, component, {
                        id: component.name,
                        name: component.id,
                        type: inferTypeFromWidget(component.type),
                        widget: component.type
                    }) as FormNode;
                    const renderedOut: any = compiled({
                        fieldData: swappedComponent,
                        value: (component as any).defaultValue,
                    },
                    this.props.formBuilder);
                    let outList: any[];
                    if (renderedOut == null) {
                        outList = [];
                    } else if (Array.isArray(renderedOut)) {
                        outList = renderedOut;
                    } else if (typeof renderedOut === 'string') {
                        outList = [renderedOut];
                    } else if (typeof renderedOut === 'object'
                        && !(renderedOut as any).nodeType
                        && typeof (renderedOut as any).length === 'number'
                        && typeof (renderedOut as any).item === 'function') {
                        const snapshot: any[] = [];
                        const list: any = renderedOut;
                        for (let i: number = 0; i < list.length; i++) {
                            snapshot.push(list[i]);
                        }
                        outList = snapshot;
                    } else {
                        outList = [renderedOut];
                    }
                    for (const node of outList) {
                        if (node && typeof node === 'object' && (node as any).nodeType) {
                            fieldInput.appendChild(node as Node);
                        } else if (typeof node === 'string') {
                            const span: HTMLElement = createElement('span');
                            span.innerHTML = node;
                            while (span.firstChild) {
                                fieldInput.appendChild(span.firstChild);
                            }
                        } else if (node && typeof node === 'object') {
                            throw new Error(
                                'Custom widget template for "' + component.name + '" returned a ' +
                                'framework object that the vanilla renderer cannot insert. Use the ' +
                                'React/Angular/Vue wrapper (registered templates / portals) for ' +
                                'JSX or platform templates.'
                            );
                        }
                    }
                    if (resolvedWidget.templateId) {
                        fieldInput.setAttribute('data-template-id', resolvedWidget.templateId);
                    }
                    fieldInput.setAttribute('data-custom-template', 'true');
                    skipDefault = true;
                } catch (renderErr) {
                    skipDefault = false;
                }
            }
        }

        if (!skipDefault) {
            if (this.isLayout(component.type)) {
                this.renderFormComponent(component, fieldHost);
            } else {
                const instance: any = renderFormField({
                    component: component as any,
                    target: fieldHost,
                    locale: this.props.locale || 'en-US',
                    onChange: (): void => { /* wires this */ },
                    ref: (): void => { /* wires this */ },
                    formState: { values: {} }
                });
                if (Array.isArray(instance)) {
                    instance.forEach((entry: any) => {
                        if (entry && typeof entry.destroy === 'function') {
                            this.renderedInstances.push(entry);
                        }
                    });
                } else if (instance) {
                    if (typeof instance.destroy === 'function') {
                        this.renderedInstances.push(instance);
                    }
                }
            }
        }
        return wrapper;
    }

    /**
     * Resolves the matching `ToolboxItemSettings` entry from the owning
     * `FormBuilder.toolboxItems` for the component being rendered, the
     * same flow the `FormRenderer` uses for its `customWidgetSettings`.
     *
     * @private
     */
    private resolveCustomWidget(component: FormNode): { template: HTMLElement | Function | null; templateId: string } | null {
        const fb: any = this.props && this.props.formBuilder;
        if (!fb) {
            return null;
        }
        const type: string = component ? String(component.type) : '';
        if (!type) {
            return null;
        }
        const items: any[] = (fb.toolboxItems as any[]) || [];
        for (let i: number = 0; i < items.length; i++) {
            const entry: any = items[i];
            if (entry && entry.type === type) {
                const template: HTMLElement | Function | null =
                    (entry.template as HTMLElement | Function | null) || null;
                if (!template) {
                    return null;
                }
                return {
                    template: template,
                    templateId: (entry.templateId as string) || ''
                };
            }
        }
        return null;
    }

    /**
     * @private
     */
    private getTemplateFunction(template: string | HTMLElement | Function): any {
        let templateFn: any = null;
        try {
            if (typeof template === 'string' && (template as string).indexOf('#') !== -1 && document.querySelectorAll(template).length) {
                templateFn = compile(this.sanitizeTemplateValue(
                    (document.querySelector(template) as HTMLElement).innerHTML.trim()
                ));
            } else if (typeof template === 'string') {
                templateFn = compile(this.sanitizeTemplateValue(template));
            } else {
                templateFn = compile(template as any);
            }
        } catch (e) {
            templateFn = compile(template as any);
        }
        return templateFn;
    }

    /**
     * @private
     */
    private sanitizeTemplateValue(value: string): string {
        if (this.props.formBuilder.enableHtmlSanitizer && typeof value === 'string') {
            try { return SanitizeHtmlHelper.sanitize(value); } catch (e) { /* swallow */ }
        }
        return value;
    }

    private isCachedFieldType(type: string): boolean {
        return ['textbox', 'textarea', 'number', 'checkbox', 'checkboxGroup', 'radio', 'dropdown', 'multiselect', 'button', 'date', 'dateTime', 'time', 'dateRange', 'switch', 'signature', 'rating', 'imageEditor', 'fileUpload', 'rangeSlider', 'colorPicker', 'inputMask', 'message', 'dataGrid','splitButton', 'richTextEditor' ].indexOf(type) !== -1;
    }

    private cacheFields(changedFieldId?: string, refreshCachedFields: boolean = false): void {
        this.cachedFields.forEach((cached: CachedField) => {
            if (cached.host.parentNode) {
                cached.host.parentNode.removeChild(cached.host);
            }
        });
        this.cachedFields.clear();
        if (refreshCachedFields) {
            return;
        }
        for (let i: number = 0; i < this.owners.fieldWrappers.length; i++) {
            const wrapper: FormFieldWrapper = this.owners.fieldWrappers[i as number];
            const host: HTMLElement = wrapper.getHost();
            const fieldId: string = host.getAttribute('data-field-id') || '';
            const type: string = host.getAttribute('data-component-type') || '';
            if (!fieldId || fieldId === changedFieldId || !this.isCachedFieldType(type) || !host.parentNode) {
                continue;
            }
            this.cachedFields.set(fieldId, { host: host, wrapper: wrapper, type: type });
            host.parentNode.removeChild(host);
        }
    }

    private disposeCachedFields(): void {
        this.cachedFields.forEach((cached: CachedField) => {
            try {
                cached.wrapper.destroy();
            } catch (e) {
                /* ignore */
            }
            if (cached.host.parentNode) {
                cached.host.parentNode.removeChild(cached.host);
            }
        });
        this.cachedFields.clear();
    }

    private renderFormComponent(component: FormNode, host: HTMLElement): void {
        const type: string = String(component.type);
        switch (type) {
            case 'panel':
                this.renderPanel(component, host);
                return;
            case 'card':
                this.renderCard(component, host);
                return;
            case 'table':
                this.renderTable(component, host);
                return;
            case 'tabs':
                this.renderTabs(component, host);
                return;
            case 'staticHtml':
                const htmlRenderer: StaticHtmlRenderer = new StaticHtmlRenderer({
                    content: component.defaultValue as string || '<p>HTML content</p>',
                    id: component.id,
                    enableHtmlSanitizer: component.enableHtmlSanitizer,
                    target: host
                });
                host.appendChild(htmlRenderer.render());
                return;
            default:
                renderFormField({
                    component: component as any,
                    target: host,
                    locale: this.props.locale || 'en-US',
                    onChange: (): void => { /* Phase 12 */ },
                    ref: (): void => { /* Phase 13 */ }
                });
                return;
        }
    }

    private renderPanel(component: FormNode, host: HTMLElement): void {
        const parentPath: string = (component as any).parentPath
            ? ((component as any).parentPath + '.' + component.id)
            : (component.id || '');
        const panelChildren: FormNode[] = component.children || [];
        const canReorderPanel: boolean = panelChildren.length > 0;
        const draggingOver: boolean = this.draggingOverPanel === component.id;

        const fieldset: HTMLElement = createElement('fieldset', {
            className: 'form-panel-renderer form-panel',
            attrs: { 'data-component-id': component.id || '', 'data-panel-id': component.id || '' },
            styles: 'min-inline-size: unset; padding: 0px;'
        });

        if (!component.hideLabel && component.label) {
            const legend: HTMLElement = createElement('legend', {
                className: 'panel-legend'
            });
            legend.textContent = component.label || '';
            fieldset.appendChild(legend);
        }

        const dropZone: HTMLElement = createElement('div', {
            className: 'panel-drop-zone'
                + (draggingOver ? ' dragging-over' : '')
                + (panelChildren.length === 0 ? ' empty' : '')
                + (component.cssClass ? ' ' + component.cssClass : ''),
            attrs: {
                'data-panel-id': component.id || '',
                'aria-label': 'Drop Zone'
            }
        });

        const droppableHost: HTMLElement = this.renderNestedChildren(
            component,
            panelChildren,
            parentPath,
            canReorderPanel
        );
        dropZone.appendChild(droppableHost);
        fieldset.appendChild(dropZone);

        host.appendChild(fieldset);
        this.attachNestedDroppable(dropZone, component, parentPath);
    }

    private renderNestedChildren(
        component: FormNode,
        children: FormNode[],
        parentPath: string,
        canReorderNested: boolean
    ): HTMLElement {
        const self: MainSection = this;

        const host: HTMLElement = createElement('div', {
            className: 'panel-children'
                + (self.isNestedReordering && self.activeNestedContainer === component.id
                    ? ' is-nested-reordering' : '')
        });

        if (children.length === 0) {
            const empty: HTMLElement = createElement('p', {
                className: 'drop-zone-text'
            });
            const constant: string = self.l10n
                ? (self.l10n.getConstant('emptyFieldSetState') || '')
                : '';
            empty.textContent = constant || 'Drop fields here';
            return empty;
        }

        for (let i: number = 0; i < children.length; i++) {
            const child: FormNode = children[i as number];
            const created: { slot: HTMLElement; klass: NestedChildClass } =
                self.createNestedFieldSlot(child, i, 'panel');
            const slot: HTMLElement = created.slot;
            const klass: NestedChildClass = created.klass;
            host.appendChild(slot);
            const wrapper: FormFieldWrapper = self.renderField(
                child,
                i,
                children.length,
                slot,
                klass,
                {
                    parentId: component.id,
                    parentPath: parentPath,
                    cellInfo: undefined
                }
            );
            Array.prototype.push.apply(self.owners.fieldWrappers, [wrapper]);
        }

        if (canReorderNested) {
            self.nestedComponents = children.slice();
            self.nestedContainerId = component.id || null;
            self.nestedContainerPath = parentPath;
            self.nestedCellInfo = undefined;
            const nestedDraggable: Draggable = new Draggable(host, {
                scope: 'internal',
                clone: true,
                enableTailMode: true,
                isPreventSelect: true,
                helper: (args: any) => self.handlers.nestedHelper({...args, children: children, parentId: component.id, cellInfo: this.nestedCellInfo}, 'panel-child-field-draggable'),
                dragStart: self.handlers.nestedDragStart,
                drag: self.handlers.nestedDrag,
                dragStop: (args: any) => self.handlers.nestedDragStop(args, 'panel-child-field-draggable')
            });
            self.owners.draggables.push(nestedDraggable);
        }

        return host;
    }

    private createNestedFieldSlot(
        child: FormNode,
        index: number,
        container: NestedChildContainer
    ): { slot: HTMLElement; klass: NestedChildClass } {
        const klass: NestedChildClass =
            container === 'table' ? 'table-cell-child-draggable'
            : container === 'tabs' ? 'tab-child-field-draggable'
            : 'panel-child-field-draggable';
        const slot: HTMLElement = createElement('div', {
            className: 'nested-field',
            attrs: {
                'data-nested-index': String(index),
                'data-component-id': child.id || ''
            }
        });
        return { slot: slot, klass: klass };
    }

    private mountNestedChildren(
        host: HTMLElement,
        children: FormNode[],
        container: NestedChildContainer,
        parentId: string,
        parentPath: string,
        cellInfo: { row?: number; col?: number; tabIndex?: number } | undefined,
        activeContainerId: string,
        containerClass: string
    ): void {
        const self: MainSection = this;
        if (self.isNestedReordering && self.activeNestedContainer === activeContainerId) {
            host.classList.add('is-nested-reordering');
        } else {
            host.classList.remove('is-nested-reordering');
        }
        for (let i: number = 0; i < children.length; i++) {
            const child: FormNode = children[i as number];
            const created: { slot: HTMLElement; klass: NestedChildClass } =
                self.createNestedFieldSlot(child, i, container);
            const slot: HTMLElement = created.slot;
            const klass: NestedChildClass = created.klass;
            host.appendChild(slot);
            const wrapper: FormFieldWrapper = self.renderField(
                child,
                i,
                children.length,
                slot,
                klass,
                {
                    parentId: parentId,
                    parentPath: parentPath,
                    cellInfo: cellInfo
                }
            );
            Array.prototype.push.apply(self.owners.fieldWrappers, [wrapper]);
        }
        if (children.length > 0) {
            self.nestedComponents = children.slice();
            self.nestedContainerId = parentId;
            self.nestedContainerPath = parentPath;
            self.nestedCellInfo = cellInfo;
            const nestedDraggable: Draggable = new Draggable(host, {
                scope: 'internal',
                clone: true,
                enableTailMode: true,
                isPreventSelect: true,
                helper: (args: any) => self.handlers.nestedHelper({...args, children: children, parentId: parentId, cellInfo: cellInfo}, containerClass),
                dragStart: self.handlers.nestedDragStart,
                drag: self.handlers.nestedDrag,
                dragStop: (args: any) => self.handlers.nestedDragStop(args, containerClass)
            });
            self.owners.draggables.push(nestedDraggable);
        }
    }

    private renderCard(component: FormNode, host: HTMLElement): void {
        const parentPath: string = (component as any).parentPath
            ? ((component as any).parentPath + '.' + component.id)
            : (component.id || '');
        const cardChildren: FormNode[] = component.children || [];
        const canReorderCard: boolean = cardChildren.length > 0;

        const card: HTMLElement = createElement('fieldset', {
            className: 'e-card form-card' + (component.cssClass ? ' ' + component.cssClass : ''),
            attrs: { 'data-component-id': component.id || '', 'data-card-id': component.id || '' },
            styles: 'padding: 0; min-inline-size: unset;'
        });

        const header: HTMLElement = createElement('div', { className: 'e-card-header' });
        const caption: HTMLElement = createElement('div', { className: 'e-card-header-caption' });
        const title: HTMLElement = createElement('div', { className: 'e-card-title' });
        const constant: string = this.l10n ? (this.l10n.getConstant('cardTitle') || '') : '';
        title.textContent = component.cardTitle || constant || 'Card';
        caption.appendChild(title);
        if (component.cardSubtitle) {
            const sub: HTMLElement = createElement('div', { className: 'e-card-sub-title' });
            sub.textContent = String(component.cardSubtitle);
            caption.appendChild(sub);
        }
        header.appendChild(caption);
        card.appendChild(header);

        const content: HTMLElement = createElement('div', { className: 'e-card-content' });
        const dropZone: HTMLElement = createElement('div', {
            className: 'panel-drop-zone'
                + (cardChildren.length === 0 ? ' empty' : '')
                + (component.cssClass ? ' ' + component.cssClass : ''),
            attrs: {
                'data-panel-id': component.id || '',
                'aria-label': 'Drop Zone'
            }
        });
        const nestedHost: HTMLElement = this.renderNestedChildren(
            component,
            cardChildren,
            parentPath,
            canReorderCard
        );
        dropZone.appendChild(nestedHost);
        content.appendChild(dropZone);
        card.appendChild(content);

        host.appendChild(card);
        this.attachNestedDroppable(dropZone, component, parentPath);
    }

    private renderTable(component: FormNode, host: HTMLElement): void {
        const self: MainSection = this;
        const tableRows: number = component.rows || 2;
        const tableCols: number = component.columns || 2;
        const tableCells: FormNode[][][] = component.tableCells || [];
        const tablePath: string = (component as any).parentPath
            ? ((component as any).parentPath + '.' + component.id)
            : (component.id || '');
        const defaultColSpan: number = Math.floor(12 / tableCols);
        const splittedWidths: number[] = (component as any).columnWidths
            ? splitWidths((component as any).columnWidths.widths || [])
            : [];

        const cssClass: string = component.cssClass
            ? ' ' + component.cssClass
            : '';

        const table: HTMLElement = createElement('div', {
            className: 'form-table' + cssClass,
            attrs: { 'data-component-id': component.id || '' }
        });

        const grid: HTMLElement = createElement('div', {
            className: 'table-grid'
        });

        for (let r: number = 0; r < tableRows; r++) {
            const rowEl: HTMLElement = createElement('div', {
                className: 'row table-row',
                attrs: { 'data-table-row': String(r) }
            });

            for (let c: number = 0; c < tableCols; c++) {
                const cellComponents: FormNode[] =
                    (tableCells[r as number] && tableCells[r as number][c as number]) ? tableCells[r as number][c as number] : [];
                const cellId: string = `${component.id}-cell-${r}-${c}`;
                const cellPath: string = `${tablePath}.cell-${r}-${c}`;
                const cellSpan: number = defaultColSpan;
                const isDraggingOver: boolean =
                    self.draggingOverPanel === cellId;
                const canReorderCell: boolean = cellComponents.length > 0;

                const colWidthValue: number | undefined =
                    (splittedWidths.length > c) ? splittedWidths[c as number] : undefined;

                const cellClasses: string[] = ['col', 'table-cell', 'drop-zone'];
                if (isDraggingOver) {
                    cellClasses.push('dragging-over');
                }
                if (cellComponents.length === 0) {
                    cellClasses.push('empty');
                }
                if (colWidthValue === undefined) {
                    cellClasses.push('col-' + cellSpan);
                }
                if (component.cssClass) {
                    cellClasses.push(String(component.cssClass));
                }

                const cellStyleParts: string[] = [];
                if (colWidthValue !== undefined) {
                    cellStyleParts.push('width: ' + colWidthValue + '%');
                }
                const cellAttrs: { [k: string]: string } = {
                    'aria-label': 'Drop Zone',
                    'data-container-id': component.id || '',
                    'data-cell-row': String(r),
                    'data-cell-col': String(c),
                    'data-cell-span': String(cellSpan)
                };
                if (cellStyleParts.length > 0) {
                    cellAttrs['style'] = cellStyleParts.join('; ');
                }
                const cell: HTMLElement = createElement('div', {
                    className: cellClasses.join(' '),
                    attrs: cellAttrs
                });

                if (cellComponents.length === 0) {
                    const empty: HTMLElement = createElement('p', {
                        className: 'drop-zone-text'
                    });
                    const cellConst: string = self.l10n
                        ? (self.l10n.getConstant('cell') || 'Cell')
                        : 'Cell';
                    empty.textContent = cellConst + ' ' + (r + 1) + '-' + (c + 1);
                    cell.appendChild(empty);
                } else {
                    const nestedComponents: HTMLElement = createElement('div', {
                        className: 'nested-components'
                    });
                    self.mountNestedChildren(
                        nestedComponents,
                        cellComponents,
                        'table',
                        component.id || '',
                        cellPath,
                        { row: r, col: c },
                        cellId,
                        'table-cell-child-draggable'
                    );
                    cell.appendChild(nestedComponents);
                }

                rowEl.appendChild(cell);
            }

            grid.appendChild(rowEl);
        }

        table.appendChild(grid);
        host.appendChild(table);
        const cellHosts: NodeListOf<Element> = table.querySelectorAll('.table-cell');
        for (let i: number = 0; i < cellHosts.length; i++) {
            const cellEl: HTMLElement = cellHosts[i as number] as HTMLElement;
            const r: number = parseInt(cellEl.getAttribute('data-cell-row') || '0', 10);
            const c: number = parseInt(cellEl.getAttribute('data-cell-col') || '0', 10);
            const cellPath: string = `${tablePath}.cell-${r}-${c}`;
            self.attachNestedDroppable(
                cellEl,
                component,
                cellPath,
                { row: r, col: c }
            );
        }
    }

    private renderTabs(component: FormNode, host: HTMLElement): void {
        const self: MainSection = this;
        const tabs: Array<{ header: string; content?: FormNode[] }> =
            (component.tabItems || [{header:'Tab1'}]).slice();
        if (tabs.length === 0) {
            const placeholder: HTMLElement = createElement('div', {
                className: 'form-tabs form-tabs-empty',
                attrs: { 'data-component-id': component.id || '' }
            });
            
            host.appendChild(placeholder);
            self.attachNestedDroppable(placeholder, component, component.id || '');
            return;
        }

        const tabsPath: string = (component as any).parentPath
            ? ((component as any).parentPath + '.' + component.id)
            : (component.id || '');
        const isDefaultOptions: boolean = !component.tabOptions;

        const renderedTabs: Array<{ header: string; content?: FormNode[] }> = [];
        for (let i: number = 0; i < tabs.length; i++) {
            const t = tabs[i as number];
            const header: string = (isDefaultOptions && i === 0)
                ? (self.l10n
                    ? (self.l10n.getConstant('defaultTabValue') || 'Tab 1')
                    : 'Tab 1')
                : (t && t.header) ? String(t.header) : '';
            renderedTabs.push({ header: header, content: (t && t.content) || [] });
        }

        const tabHosts: HTMLElement[] = [];
        for (let i: number = 0; i < renderedTabs.length; i++) {
            tabHosts.push(self.createTabBody(renderedTabs[i as number], component, tabsPath, i));
        }

        const items: TabItemModel[] = [];
        for (let i: number = 0; i < renderedTabs.length; i++) {
            items.push({
                header: { text: renderedTabs[i as number].header },
                content: tabHosts[i as number] as any
            });
        }

        const tabsHost: HTMLElement = createElement('div', {
            className: 'form-tabs e-form-builder-tab-host'
                + (component.cssClass ? ' ' + component.cssClass : ''),
            attrs: { 'data-component-id': component.id || '' }
        });

        host.appendChild(tabsHost);

        for (let i: number = self.owners.tabs.length - 1; i >= 0; i--) {
            const t: any = self.owners.tabs[i as number] as any;
            if (t && t.__formBuilderId === component.id) {
                try {
                    t.destroy();
                } catch (e) {
                    /* ignore */
                }
                self.owners.tabs.splice(i, 1);
            }
        }

        const tabObj: Tab = new Tab({
            items: items,
            animation: { previous: { effect: 'None' }, next: { effect: 'None' } },
            selectedItem: self.activeTabIndices.get(component.id || '') || 0,
            locale: self.props.locale || 'en-US',
            enableRtl: !!self.props.enableRtl,
            selected: (args: SelectEventArgs): void => {
                const idx: number = (args && typeof args.selectedIndex === 'number')
                    ? args.selectedIndex
                    : 0;
                if (component.id) {
                    self.activeTabIndices.set(component.id, idx);
                }
            }
        });
        (tabObj as any).__formBuilderId = component.id;
        tabObj.appendTo(tabsHost);
        self.owners.tabs.push(tabObj);
        this.renderedInstances.push(tabObj);
    }

    private createTabBody(
        tab: { header: string; content?: FormNode[] },
        component: FormNode,
        tabsPath: string,
        tabIndex: number
    ): HTMLElement {
        const self: MainSection = this;
        const tabId: string = (component.id || '') + '-tab-' + tabIndex;
        const tabContent: FormNode[] = tab.content || [];
        const isDraggingOver: boolean = self.draggingOverPanel === tabId;
        const canReorderTab: boolean = tabContent.length > 0;

        const dropZone: HTMLElement = createElement('div', {
            className: 'tab-drop-zone'
                + (isDraggingOver ? ' dragging-over' : '')
                + (tabContent.length === 0 ? ' empty' : ''),
            attrs: {
                'aria-label': 'Drop Zone',
                'data-container-id': component.id || '',
                'data-tab-index': String(tabIndex)
            }
        });

        if (tabContent.length === 0) {
            const empty: HTMLElement = createElement('p', {
                className: 'drop-zone-text'
            });
            const emptyConst: string = self.l10n
                ? (self.l10n.getConstant('emptyFieldSetState') || 'Drop fields here')
                : 'Drop fields here';
            empty.textContent = emptyConst;
            dropZone.appendChild(empty);
        } else {
            const tabChildren: HTMLElement = createElement('div', {
                className: 'tab-children'
            });
            self.mountNestedChildren(
                tabChildren,
                tabContent,
                'tabs',
                component.id || '',
                tabsPath,
                { row: 0, col: 0, tabIndex: tabIndex },
                tabId,
                'tab-child-field-draggable'
            );
            dropZone.appendChild(tabChildren);
        }

        self.attachNestedDroppable(
            dropZone,
            component,
            tabsPath,
            { row: 0, col: 0, tabIndex: tabIndex }
        );

        return dropZone;
    }

    private isLayout(type: string): boolean {
        return ['panel', 'card', 'table', 'tabs', 'staticHtml'].indexOf(String(type)) >= 0;
    }

    private registerRootDroppable(
        host: HTMLElement,
        schema: FormSchema,
        isEmptyState: boolean
    ): void {
        const droppable: Droppable = new Droppable(host, {
            drop: isEmptyState ? this.makeEmptyStateDrop() : this.handlers.handleDrop,
            over: this.handlers.handleDragOver,
            out: this.handlers.handleDragLeave
        });
        this.owners.droppables.push(droppable);
    }

    private installGlobalPointerTracker(host: HTMLElement): void {
        const self: MainSection = this;
        const handler: (e: Event) => void = function onRootPointerMove(e: Event): void {
            if (!self.isPaletteDrag()) {
                return;
            }
            const point: { x: number; y: number } | null = self.getEventPoint(e);
            if (!point) {
                return;
            }
            const target: Element | null =
                (typeof document !== 'undefined' && document.elementFromPoint)
                    ? document.elementFromPoint(point.x, point.y)
                    : null;
            const isTableCell: boolean = !!(target && (target as HTMLElement).classList
                && (target as HTMLElement).classList.contains('table-cell'));
            const isTabDropZone: boolean = !!(target && (target as HTMLElement).classList
                && (target as HTMLElement).classList.contains('tab-drop-zone'));
            const isPanelDropZone: boolean = !!(target && (target as HTMLElement).classList
                && (target as HTMLElement).classList.contains('panel-drop-zone'));

            let tableCell: HTMLElement | null = isTableCell
                ? (target as HTMLElement)
                : self.findFilteredClosest(target, '.table-cell', ['panel-drop-zone', 'tab-drop-zone']);
            let tabDropZone: HTMLElement | null = isTabDropZone
                ? (target as HTMLElement)
                : self.findFilteredClosest(target, '.tab-drop-zone', ['panel-drop-zone']);
            let panelDropZone: HTMLElement | null = isPanelDropZone
                ? (target as HTMLElement)
                : self.findFilteredClosest(target, '.panel-drop-zone', ['tab-drop-zone']);
            if (isTableCell) {
                tabDropZone = null;
                panelDropZone = null;
            }
            if (isTabDropZone) {
                tableCell = null;
                panelDropZone = null;
            }
            if (isPanelDropZone) {
                tableCell = null;
                tabDropZone = null;
            }

            let containerSelector: string = '.form-field-draggable';
            let isNested: boolean = false;
            if (tableCell) {
                containerSelector = '.table-cell-child-draggable';
                isNested = true;
            } else if (tabDropZone) {
                containerSelector = '.tab-child-field-draggable';
                isNested = true;
            } else if (panelDropZone) {
                containerSelector = '.panel-child-field-draggable';
                isNested = true;
            }
            const container: Element | null = tableCell || tabDropZone || panelDropZone || null;

            const result: DropTargetResult | null =
                self.findDropTarget(point.y, containerSelector, container);

            if (result) {
                if (isNested) {
                    self.clearNestedDropTargetVisuals();
                    self.nestedDropTargetIndex = result.index;
                    self.nestedDropPosition = result.position;
                    self.updateNestedDropTargetVisuals(result, containerSelector, container);
                    self.dropTargetIndex = null;
                    self.dropPosition = null;
                    self.clearDropTargetVisuals();
                } else {
                    self.clearDropTargetVisuals();
                    self.dropTargetIndex = result.index;
                    self.dropPosition = result.position;
                    self.updateDropTargetVisuals(result);
                    self.nestedDropTargetIndex = null;
                    self.nestedDropPosition = null;
                    self.clearNestedDropTargetVisuals();
                }
            } else {
                // Off any field — clear both sets.
                self.dropTargetIndex = null;
                self.dropPosition = null;
                self.nestedDropTargetIndex = null;
                self.nestedDropPosition = null;
                self.clearDropTargetVisuals();
                self.clearNestedDropTargetVisuals();
            }
        };

        self.addTrackedListener(host, 'mousemove', handler as EventListener, false);
        self.addTrackedListener(
            host,
            'touchmove',
            handler as EventListener,
            { passive: true } as AddEventListenerOptions
        );
        self.addTrackedListener(host, 'pointermove', handler as EventListener, false);
        self.pointerTrackerHost = host;
        self.pointerTrackerHandler = handler as EventListener;
    }

    private disposeGlobalPointerTracker(): void {
        const self: MainSection = this;
        const host: HTMLElement | null = self.pointerTrackerHost;
        const handler: EventListener | null = self.pointerTrackerHandler;
        if (!host || !handler) {
            return;
        }
        self.removeTrackedListener(host, 'mousemove', handler, false);
        self.removeTrackedListener(
            host,
            'touchmove',
            handler,
            { passive: true } as AddEventListenerOptions
        );
        self.removeTrackedListener(host, 'pointermove', handler, false);
        self.pointerTrackerHost = null;
        self.pointerTrackerHandler = null;
    }

    private makeEmptyStateDrop(): (args: DropEventArgs) => void {
        const self: MainSection = this;
        return function emptyStateDrop(args: DropEventArgs): void {
            const components: FormNode[] = self.extractComponentsFromDrop(args);
            if (components.length === 0) {
                return;
            }
            const isTemplateDrop: boolean = self.isTemplateDrop();
            if (isTemplateDrop && self.props.onDropBatchStart) {
                self.props.onDropBatchStart();
            }
            try {
                for (let i: number = 0; i < components.length; i++) {
                    const comp: FormNode = components[i as number];
                    if (self.props.onDrop) {
                        self.props.onDrop(comp, null, null);
                    }
                    if (self.props.onFieldDropped) {
                        self.props.onFieldDropped({
                            componentName: comp.name || comp.label || comp.id || '',
                            isReordered: false,
                            componentType: String(comp.type),
                            sourceContainerId: 'palette',
                            targetContainerId: 'empty-zone'
                        });
                    }
                }
            } finally {
                if (isTemplateDrop && self.props.onDropBatchEnd) {
                    self.props.onDropBatchEnd();
                }
            }
            setTimeout(() => {
                self.clearAllDragVisuals();
            }, 10);
        };
    }

    private attachNestedDroppable(
        host: HTMLElement,
        parent: FormNode,
        parentPath?: string,
        cellInfo?: { row: number; col: number; tabIndex?: number }
    ): void {
        const body: HTMLElement = host;
        const self: MainSection = this;
        const path: string = parentPath || (parent && parent.id) || '';
        const cell: { row: number; col: number; tabIndex?: number } | undefined = cellInfo;
        const containerId: string = (function (): string {
            if (cell && typeof cell.tabIndex === 'number' && parent && parent.id) {
                return parent.id + '-tab-' + cell.tabIndex;
            }
            if (cell && typeof cell.row === 'number' && typeof cell.col === 'number' && parent && parent.id) {
                return parent.id + '-cell-' + cell.row + '-' + cell.col;
            }
            return parent && parent.id ? parent.id : '';
        })();

        const drop: (args: DropEventArgs) => void = function nestedPaletteDrop(args: DropEventArgs): void {
            self.draggingOverPanel = null;
            body.classList.remove('dragging-over');
            self.handlers.handleNestedDrop(
                parent && parent.id ? parent.id : '',
                cell,
                path
            );
        };

        const over: (e: Event) => void = function nestedPaletteOver(e: Event): void {
            self.draggingOverPanel = containerId;
            body.classList.add('dragging-over');
            self.handlers.handleNestedDragOver(e, containerId);
            if (self.props.onFieldDraggingOver) {
                self.props.onFieldDraggingOver({ isNested: true });
            }
        };

        const out: (e: Event) => void = function nestedPaletteOut(_e: Event): void {
            if (self.draggingOverPanel === containerId) {
                self.draggingOverPanel = null;
            }
            body.classList.remove('dragging-over');
            self.handlers.handleNestedDragLeave(_e);
        };

        const droppable: Droppable = new Droppable(body, {
            drop: drop,
            over: over,
            out: out
        });
        self.owners.droppables.push(droppable);
    }

    private extractComponentsFromDrop(args: DropEventArgs): FormNode[] {
        const dropped: HTMLElement | null = (args && args.droppedElement) || null;
        const templateClone: HTMLElement | null = this.parent.querySelector(
            '.palette-item-clone[data-template-json]'
        ) as HTMLElement | null;
        if (templateClone) {
            const templateJson: string | null = templateClone.getAttribute('data-template-json');
            if (templateJson) {
                try {
                    const template: any = JSON.parse(templateJson);
                    return extractTemplateComponents(template.templateData);
                } catch (e) {
                    /* ignore */
                }
            }
        }

        const helper: HTMLElement | null = (this.parent.querySelector(
            '.palette-item-clone[data-component-json]'
        ) as HTMLElement | null) || dropped;
        if (!helper) {
            return [];
        }
        const json: string | null = helper.getAttribute('data-component-json');
        if (json) {
            try {
                const parsed: any = JSON.parse(json);
                if (parsed && parsed.type) {
                    return [this.buildFormComponentFromPalette(parsed)];
                }
            } catch (e) {
                /* ignore */
            }
        }
        const typeAttr: string = helper.getAttribute('data-component-type') || '';
        if (!typeAttr) {
            return [];
        }
        return [this.buildFormComponentFromPalette({ type: typeAttr } as PaletteComponent)];
    }

    private buildFormComponentFromPalette(palette: PaletteComponent): FormNode {
        const type: string = String(palette.type) as any;
        const id: string = generateId(type as any);
        const name: string = generateName(type as any);
        const label: string = palette.label || (this.l10n ? this.l10n.getConstant(type) : '') || type;
        const node: any = {
            id: id,
            type: type as any,
            label: label,
            name: name
        };
        const paletteTemplateId: string = (palette && (palette as any).templateId) ?
            String((palette as any).templateId) : '';
        const toolbox: any = this.getToolboxEntry(type);
        const templateId: string = paletteTemplateId || (toolbox && toolbox.templateId ?
            String(toolbox.templateId) : '');
        if (templateId) {
            node.templateId = templateId;
        }
        return node as FormNode;
    }

    /**
     * @private
     */
    public getToolboxEntry(type: string): any | null {
        const fb: any = this.props && this.props.formBuilder;
        if (!fb || !type) {
            return null;
        }
        const items: any[] = (fb.toolboxItems as any[]) || [];
        for (let i: number = 0; i < items.length; i++) {
            const entry: any = items[i];
            if (entry && entry.type === type) {
                return entry;
            }
        }
        return null;
    }

    private handleDragOver(e: DragEventArgs): void {
         const paletteClone: HTMLElement | null = this.parent.querySelector(
            '.palette-item-clone'
        ) as HTMLElement | null;
        if (paletteClone && this.formAreaEl) {
            this.formAreaEl.classList.add('dragging-over');
            this.isDraggingFromPalette = true;
        }
        if (this.props.onFieldDraggingOver) {
            this.props.onFieldDraggingOver({ isNested: false });
        }
        if (paletteClone) {
            const y: number = this.getClientY((e as DragEventArgs).event);
            if (y !== null) {
                const result: DropTargetResult | null =
                    this.findDropTarget(y, '.form-field-draggable');
                if (result) {
                    this.dropTargetIndex = result.index;
                    this.dropPosition = result.position;
                    this.updateDropTargetVisuals(result);
                } else {
                    this.dropTargetIndex = null;
                    this.dropPosition = null;
                    this.clearDropTargetVisuals();
                }
            }
        }
    }

    private handleDragLeave(_e: Event): void {
        this.isDraggingFromPalette = false;
        this.clearAllDragVisuals();
    }

    private handleDrop(args: DropEventArgs): void {
        const wasReorder: boolean = !!this.draggedComponentInfo
            || this.isReordering
            || this.isNestedReordering;
        if (wasReorder) {
            this.isDraggingFromPalette = false;
            this.clearAllDragVisuals();
            return;
        }

        const components: FormNode[] = this.extractComponentsFromDrop(args);
        if (components.length === 0) {
            this.clearAllDragVisuals();
            return;
        }

        const sourceContainerId: string = this.draggedComponentInfo
            ? this.draggedComponentInfo.containerId
            : 'palette';

        let nextIndex: number | null = this.dropTargetIndex;
        let nextPosition: 'before' | 'after' | null = this.dropPosition;

        const isTemplateDrop: boolean = this.isTemplateDrop();
        if (isTemplateDrop && this.props.onDropBatchStart) {
            this.props.onDropBatchStart();
        }
        try {
            for (let i: number = 0; i < components.length; i++) {
                const comp: FormNode = components[i as number];
                if (this.props.onDrop) {
                    this.props.onDrop(comp, nextIndex, nextPosition);
                }
                if (this.props.onFieldDropped) {
                    this.props.onFieldDropped({
                        componentName: comp.name || comp.label || comp.id || '',
                        isReordered: false,
                        componentType: String(comp.type),
                        sourceContainerId: sourceContainerId,
                        targetContainerId: 'root'
                    });
                }
                if (nextIndex !== null && nextPosition) {
                    nextIndex = nextIndex + 1;
                    nextPosition = 'before';
                }
            }
        } finally {
            if (isTemplateDrop && this.props.onDropBatchEnd) {
                this.props.onDropBatchEnd();
            }
        }

        this.trackTimeout(() => {
            this.clearAllDragVisuals();
        }, 20);

        this.draggedComponentInfo = null;
    }

    private handleNestedDrop(
        parentId: string,
        cellInfo: { row: number; col: number; tabIndex?: number } | undefined,
        parentPath?: string
    ): void {
        this.clearNestedDropTargetVisuals();

        if (!parentId) {
            return;
        }

        const wasReorder: boolean = !!this.draggedComponentInfo
            || this.isReordering
            || this.isNestedReordering;
        if (wasReorder) {
            this.isDraggingFromPalette = false;
            this.draggedComponentInfo = null;
            this.clearNestedDropTargetVisuals();
            return;
        }

        const moveInfo: { id: string; containerId: string } | null = this.draggedComponentInfo;
        if (moveInfo && moveInfo.containerId && moveInfo.containerId !== parentId) {
            const component: FormNode | null = this.findComponentById(moveInfo.id);
            if (component) {
                if (this.isIdInSubtree(component, parentId)) {
                    return;
                }
                if (this.props.onNestedDrop) {
                    this.props.onNestedDrop(
                        parentId,
                        component,
                        cellInfo,
                        parentPath || parentId,
                        this.nestedDropTargetIndex,
                        this.nestedDropPosition
                    );
                }
                if (this.props.onFieldDropped) {
                    this.props.onFieldDropped({
                        componentName: component.name || component.label || component.id || '',
                        isReordered: false,
                        componentType: String(component.type),
                        sourceContainerId: moveInfo.containerId,
                        targetContainerId: parentId
                    });
                }
                this.draggedComponentInfo = null;
                return;
            }
        }

        const droppedComponents: FormNode[] = this.extractComponentsFromDrop({} as DropEventArgs);
        if (!droppedComponents || droppedComponents.length === 0) {
            return;
        }

        const isTemplateDrop: boolean = this.isTemplateDrop();
        if (isTemplateDrop && this.props.onDropBatchStart) {
            this.props.onDropBatchStart();
        }
        try {
            droppedComponents.forEach((comp: FormNode) => {
                if (this.props.onNestedDrop) {
                    this.props.onNestedDrop(
                        parentId,
                        comp,
                        cellInfo,
                        parentPath || parentId,
                        this.nestedDropTargetIndex,
                        this.nestedDropPosition
                    );
                }
                if (this.props.onFieldDropped) {
                    this.props.onFieldDropped({
                        componentName: comp.name || comp.label || comp.id || '',
                        isReordered: false,
                        componentType: String(comp.type),
                        sourceContainerId: 'palette',
                        targetContainerId: parentId
                    });
                }
            });
        } finally {
            if (isTemplateDrop && this.props.onDropBatchEnd) {
                this.props.onDropBatchEnd();
            }
        }
    }

    private isTemplateDrop(): boolean {
        return !!this.parent.querySelector('.palette-item-clone[data-template-json]');
    }

    private handleNestedDragOver(e: DragEventArgs, panelId: string): void {
        if(this.draggedComponentInfo && this.draggedComponentInfo.id === panelId) {
            return;
        }
        this.draggingOverPanel = panelId;
        const paletteClone: HTMLElement | null = this.parent.querySelector(
            '.palette-item-clone'
        ) as HTMLElement | null;
        if (paletteClone) {
            this.isDraggingFromPalette = true;
        }

        const point: { x: number; y: number } | null = this.getEventPoint(e.event);
        if (point) {
            const target: Element | null =
                (typeof document !== 'undefined' && document.elementFromPoint)
                    ? document.elementFromPoint(point.x, point.y)
                    : null;

            const isTableCell: boolean = !!(target && (target as HTMLElement).classList
                && (target as HTMLElement).classList.contains('table-cell'));
            const isTabDropZone: boolean = !!(target && (target as HTMLElement).classList
                && (target as HTMLElement).classList.contains('tab-drop-zone'));
            const isPanelDropZone: boolean = !!(target && (target as HTMLElement).classList
                && (target as HTMLElement).classList.contains('panel-drop-zone'));

            let tableCell: HTMLElement | null = isTableCell
                ? (target as HTMLElement)
                : this.findFilteredClosest(target, '.table-cell', ['panel-drop-zone', 'tab-drop-zone']);
            let tabDropZone: HTMLElement | null = isTabDropZone
                ? (target as HTMLElement)
                : this.findFilteredClosest(target, '.tab-drop-zone', ['panel-drop-zone']);
            let panelDropZone: HTMLElement | null = isPanelDropZone
                ? (target as HTMLElement)
                : this.findFilteredClosest(target, '.panel-drop-zone', ['tab-drop-zone']);

            if (isTableCell) {
                tabDropZone = null;
                panelDropZone = null;
            }
            if (isTabDropZone) {
                tableCell = null;
                panelDropZone = null;
            }
            if (isPanelDropZone) {
                tableCell = null;
                tabDropZone = null;
            }

            let containerSelector: string = '.form-field-draggable';
            if (tableCell) {
                containerSelector = '.table-cell-child-draggable';
            } else if (tabDropZone) {
                containerSelector = '.tab-child-field-draggable';
            } else if (panelDropZone) {
                containerSelector = '.panel-child-field-draggable';
            }

            const container: Element | null = tableCell || tabDropZone || panelDropZone || null;
            const result: DropTargetResult | null = this.findDropTarget(
                point.y,
                containerSelector,
                container
            );

            if (result) {
                this.nestedDropTargetIndex = result.index;
                this.nestedDropPosition = result.position;
                this.updateNestedDropTargetVisuals(result, containerSelector, container);
            } else {
                this.nestedDropTargetIndex = null;
                this.nestedDropPosition = null;
                this.clearNestedDropTargetVisuals();
            }
        }

        if (this.props.onFieldDraggingOver) {
            this.props.onFieldDraggingOver({ isNested: true });
        }
    }

    private handleNestedDragLeave(_e: Event): void {
        this.draggingOverPanel = null;
        this.isDraggingFromPalette = false;
        this.nestedDropTargetIndex = null;
        this.nestedDropPosition = null;
        this.clearDropTargetVisuals();
        this.clearNestedDropTargetVisuals();
    }

    private helper(args: any): HTMLElement | null {
        const target: HTMLElement | null = (args && (args.sender.target || args.target)) as HTMLElement | null;
        if (!target) {
            return null;
        }
        const formField: HTMLElement | null = target.closest
            ? (target.closest('.form-field-draggable') as HTMLElement | null)
            : null;
        if (!formField || !formField.classList.contains('form-field-draggable')) {
            return null;
        }
        const index: number = parseInt(formField.getAttribute('data-index') || '0', 10);
        this.draggedItemIndex = isNaN(index) ? null : index;
        this.fillCloneContent(this.rootCloneHost, this.draggedItemIndex, this.currentComponents);
        return this.rootCloneHost;
    }

    private fillCloneContent(
        host: HTMLElement | null,
        index: number | null,
        source: FormNode[]
    ): void {
        if (!host) {
            return;
        }
        const content: HTMLElement | null = host.querySelector('.clone-content');
        const component: FormNode | undefined = (index !== null) ? source[index as number] : undefined;
        const label: string = !!component
            ? (component.label || component.legend || component.cardTitle || component.name ||
                component.type || '')
            : '';
        if (content) {
            content.textContent = label;
        }
    }

    private dragStart(e: any): void {
        if (this.rootCloneHost) {
            this.rootCloneHost.style.display = 'flex';
        }
        const paletteClone: HTMLElement | null = this.parent.querySelector(
            '.palette-item-clone'
        ) as HTMLElement | null;
        if (paletteClone && this.formAreaEl) {
            this.formAreaEl.classList.add('dragging-over');
            this.isDraggingFromPalette = true;
        }
        if (e && e.event) {
            const ev: any = e.event;
            const clientY: number = (typeof ev.clientY === 'number')
                ? ev.clientY
                : (ev.touches && ev.touches[0] && ev.touches[0].clientY) || 0;
            this.initialDragY = clientY;
            this.currentDragY = clientY;
        }
        if (this.draggedItemIndex !== null) {
            const component: FormNode | undefined = this.currentComponents[this.draggedItemIndex];
            if (component) {
                this.draggedComponentInfo = { id: component.id || '', containerId: 'root' };
                const draggedEl: HTMLElement | null = this.parent.querySelector(
                    '[data-component-id="' + (component.id || '') + '"]'
                ) as HTMLElement | null;
                if (draggedEl) {
                    draggedEl.classList.add('is-being-dragged');
                }
                if (this.props.onFieldDragStarted) {
                    this.props.onFieldDragStarted({
                        componentName: component.name || '',
                        componentType: String(component.type),
                        sourceContainerId: 'root',
                        isNested: false
                    });
                }
            }
        }
        this.isDraggingFromPalette = false;
    }

    private drag(e: any): void {
        if (this.currentComponents.length > 1) {
            this.isReordering = true;
            if (this.formAreaEl) {
                this.formAreaEl.classList.add('is-reordering');
            }
        }
        if (this.rootCloneHost) {
            this.rootCloneHost.style.opacity = '0.97';
            if (e && e.event && this.initialDragY !== null) {
                const ev: any = e.event;
                const currentY: number = (typeof ev.clientY === 'number')
                    ? ev.clientY
                    : (ev.touches && ev.touches[0] && ev.touches[0].clientY) || 0;
                const initialY: number = this.initialDragY;
                if (ev.touches && ev.touches.length > 0) {
                    const t: any = ev.touches[0];
                    const touchTarget: HTMLElement | null = document.elementFromPoint
                        ? (document.elementFromPoint(t.clientX, t.clientY) as HTMLElement | null)
                        : null;
                    const wrapper: HTMLElement | null = touchTarget && touchTarget.closest
                        ? (touchTarget.closest('.form-field-wrapper') as HTMLElement | null)
                        : null;
                    const hovered: NodeListOf<Element> = this.parent.querySelectorAll('.form-field-wrapper.touch-hovered');
                    for (let i: number = 0; i < hovered.length; i++) {
                        if (hovered[i as number] !== wrapper) {
                            (hovered[i as number] as HTMLElement).classList.remove('touch-hovered');
                        }
                    }
                    if (wrapper && !wrapper.classList.contains('touch-hovered')) {
                        wrapper.classList.add('touch-hovered');
                    }
                }
                if (this.formAreaEl) {
                    this.formAreaEl.classList.remove('drag-moving-up', 'drag-moving-down');
                    if (currentY < initialY) {
                        this.formAreaEl.classList.add('drag-moving-up');
                    } else if (currentY > initialY) {
                        this.formAreaEl.classList.add('drag-moving-down');
                    }
                }
                this.currentDragY = currentY;
            }
        }
    }

    private dragStop(args: any): void {
        this.isDraggingFromPalette = false;
        this.isReordering = false;
        if (this.formAreaEl) {
            this.formAreaEl.classList.remove('is-reordering', 'drag-moving-up', 'drag-moving-down');
        }
        const hovered: NodeListOf<Element> = this.parent.querySelectorAll('.form-field-wrapper.touch-hovered');
        for (let i: number = 0; i < hovered.length; i++) {
            (hovered[i as number] as HTMLElement).classList.remove('touch-hovered');
        }
        if (this.rootCloneHost) {
            this.rootCloneHost.style.display = 'none';
            this.rootCloneHost.style.opacity = '0';
        }
        this.initialDragY = null;
        this.currentDragY = null;

        if (this.draggedItemIndex === null) {
            return;
        }
        const component: FormNode | undefined = this.currentComponents[this.draggedItemIndex];
        if (!component) {
            this.draggedItemIndex = null;
            this.draggedComponentInfo = null;
            this.clearDropTargetVisuals();
            this.clearNestedDropTargetVisuals();
            return;
        }
        if (this.formAreaEl) {
            this.formAreaEl.classList.remove('dragging-over');
        }
        const target: HTMLElement | null = (args && args.target) || null;
        const draggedEl: HTMLElement | null = this.parent.querySelector(
            '[data-component-id="' + (component.id || '') + '"]'
        ) as HTMLElement | null;
        if (draggedEl) {
            draggedEl.classList.remove('is-being-dragged');
        }

        // Cross-container move — panel.
        const panelDropZone: HTMLElement | null = target && target.closest
            ? (target.closest('.panel-drop-zone') as HTMLElement | null)
            : null;
        if (panelDropZone) {
            const panelId: string | null = panelDropZone.getAttribute('data-panel-id');
            if (panelId) {
                if (panelId === component.id || this.isIdInSubtree(component, panelId)) {
                    this.draggedItemIndex = null;
                    this.draggedComponentInfo = null;
                    this.isDraggingFromPalette = false;
                    this.clearNestedDropTargetVisuals();
                    return;
                }
                const idx: number | null = this.nestedDropTargetIndex;
                const pos: 'before' | 'after' | null = this.nestedDropPosition;
                if (this.props.onDelete) {
                    this.props.onDelete(component.id || '', true);
                }
                this.trackTimeout(() => {
                    if (this.props.onNestedDrop) {
                        this.props.onNestedDrop(
                            panelId, component, undefined, panelId, idx, pos
                        );
                    }
                }, 0);
                this.isDraggingFromPalette = false;
                this.clearNestedDropTargetVisuals();
                this.draggedItemIndex = null;
                this.draggedComponentInfo = null;
                if (this.props.onFieldDropped) {
                    this.props.onFieldDropped({
                        componentName: component.name || '',
                        componentType: String(component.type),
                        sourceContainerId: 'root',
                        targetContainerId: panelId,
                        isReordered: false
                    });
                }
                return;
            }
        }

        const tabDropZone: HTMLElement | null = target && target.closest
            ? (target.closest('.tab-drop-zone') as HTMLElement | null)
            : null;
        if (tabDropZone) {
            const tabContainerId: string | null = tabDropZone.getAttribute('data-container-id');
            const tabIndex: number = parseInt(tabDropZone.getAttribute('data-tab-index') || '0', 10);
            if (tabContainerId) {
                if (tabContainerId === component.id || this.isIdInSubtree(component, tabContainerId)) {
                    this.draggedItemIndex = null;
                    this.draggedComponentInfo = null;
                    this.isDraggingFromPalette = false;
                    this.clearNestedDropTargetVisuals();
                    return;
                }
                const idx: number | null = this.nestedDropTargetIndex;
                const pos: 'before' | 'after' | null = this.nestedDropPosition;
                if (this.props.onDelete) {
                    this.props.onDelete(component.id || '', true);
                }
                this.trackTimeout(() => {
                    if (this.props.onNestedDrop) {
                        this.props.onNestedDrop(
                            tabContainerId,
                            component,
                            { row: 0, col: 0, tabIndex: tabIndex },
                            tabContainerId,
                            idx,
                            pos
                        );
                    }
                }, 0);
                this.isDraggingFromPalette = false;
                this.clearNestedDropTargetVisuals();
                this.draggedItemIndex = null;
                this.draggedComponentInfo = null;
                if (this.props.onFieldDropped) {
                    this.props.onFieldDropped({
                        componentName: component.name || '',
                        componentType: String(component.type),
                        sourceContainerId: 'root',
                        targetContainerId: tabContainerId,
                        isReordered: false
                    });
                }
                return;
            }
        }

        const tableCell: HTMLElement | null = target && target.closest
            ? (target.closest('.table-cell') as HTMLElement | null)
            : null;
        if (tableCell) {
            const cellContainerId: string | null = tableCell.getAttribute('data-container-id');
            const cellRow: number = parseInt(tableCell.getAttribute('data-cell-row') || '0', 10);
            const cellCol: number = parseInt(tableCell.getAttribute('data-cell-col') || '0', 10);
            if (cellContainerId) {
                if (cellContainerId === component.id || this.isIdInSubtree(component, cellContainerId)) {
                    this.draggedItemIndex = null;
                    this.draggedComponentInfo = null;
                    this.isDraggingFromPalette = false;
                    this.clearNestedDropTargetVisuals();
                    return;
                }
                const idx: number | null = this.nestedDropTargetIndex;
                const pos: 'before' | 'after' | null = this.nestedDropPosition;
                if (this.props.onDelete) {
                    this.props.onDelete(component.id || '', true);
                }
                this.trackTimeout(() => {
                    if (this.props.onNestedDrop) {
                        this.props.onNestedDrop(
                            cellContainerId,
                            component,
                            { row: cellRow, col: cellCol },
                            cellContainerId,
                            idx,
                            pos
                        );
                    }
                }, 0);
                this.isDraggingFromPalette = false;
                this.clearNestedDropTargetVisuals();
                this.draggedItemIndex = null;
                this.draggedComponentInfo = null;
                if (this.props.onFieldDropped) {
                    this.props.onFieldDropped({
                        componentName: component.name || '',
                        componentType: String(component.type),
                        sourceContainerId: 'root',
                        targetContainerId: cellContainerId,
                        isReordered: false
                    });
                }
                return;
            }
        }

        const targetField: HTMLElement | null = target && target.closest
            ? (target.closest('.form-field-draggable') as HTMLElement | null)
            : null;
        if (targetField) {
            const targetIndex: number = parseInt(targetField.getAttribute('data-index') || '-1', 10);
            if (targetIndex !== -1 && targetIndex !== this.draggedItemIndex) {
                const newComponents: FormNode[] = this.currentComponents.slice();
                const dragged: FormNode = newComponents[this.draggedItemIndex];
                newComponents.splice(this.draggedItemIndex, 1);
                newComponents.splice(targetIndex, 0, dragged);
                if (this.props.onReorder) {
                    this.props.onReorder(newComponents);
                }
                if (this.props.onFieldDropped) {
                    this.props.onFieldDropped({
                        componentName: dragged.name || '',
                        componentType: String(dragged.type),
                        sourceContainerId: 'root',
                        targetContainerId: 'root',
                        isReordered: true
                    });
                }
            }
        }
        this.draggedItemIndex = null;
        this.isDraggingFromPalette = false;
        this.clearDropTargetVisuals();
        this.clearNestedDropTargetVisuals();
        this.draggedComponentInfo = null;
    }

    private nestedHelper(args: any, containerClass: string): HTMLElement | null {
        if(args.children) {
            this.nestedComponents = args.children;
            this.nestedContainerId = args.parentId;
            this.nestedCellInfo = args.cellInfo;
            this.nestedContainerPath = args.parentId;
        }
        const target: HTMLElement | null = (args && (args.sender.target || args.target)) as HTMLElement | null;
        if (!target) {
            return null;
        }
        const nestedField: HTMLElement | null = target.closest
            ? (target.closest('.' + containerClass) as HTMLElement | null)
            : null;
        if (!nestedField || !nestedField.classList.contains(containerClass)) {
            return null;
        }
        const index: number = parseInt(nestedField.getAttribute('data-nested-index') || '0', 10);
        this.nestedDraggedIndex = isNaN(index) ? null : index;
        this.fillCloneContent(this.nestedCloneHost, this.nestedDraggedIndex, this.nestedComponents);
        const dropZone: HTMLElement | null = nestedField.closest(
            '.panel-drop-zone, .tab-drop-zone, .table-cell'
        ) as HTMLElement | null;
        if (dropZone) {
            if (dropZone.classList.contains('panel-drop-zone')) {
                this.activeNestedContainer = dropZone.getAttribute('data-panel-id') || null;
            } else if (dropZone.classList.contains('tab-drop-zone')) {
                const cid: string | null = dropZone.getAttribute('data-container-id');
                const tIdx: number = parseInt(dropZone.getAttribute('data-tab-index') || '0', 10);
                this.activeNestedContainer = (cid || '') + '-tab-' + tIdx;
            } else if (dropZone.classList.contains('table-cell')) {
                const cid: string | null = dropZone.getAttribute('data-container-id');
                const r: number = parseInt(dropZone.getAttribute('data-cell-row') || '0', 10);
                const c: number = parseInt(dropZone.getAttribute('data-cell-col') || '0', 10);
                this.activeNestedContainer = (cid || '') + '-cell-' + r + '-' + c;
            }
        }
        return this.nestedCloneHost;
    }

    private nestedDragStart(e: any): void {
        if (this.nestedCloneHost) {
            this.nestedCloneHost.style.display = 'flex';
        }
        const paletteClone: HTMLElement | null = this.parent.querySelector(
            '.palette-item-clone'
        ) as HTMLElement | null;
        if (paletteClone && this.formAreaEl) {
            this.formAreaEl.classList.add('dragging-over');
            this.isDraggingFromPalette = true;
        }
        const closestDropZone: HTMLElement | null = e.target && e.target.closest
            ? (e.target.closest('.panel-drop-zone, .tab-drop-zone, .table-cell') as HTMLElement | null)
            : null;
        if (closestDropZone) {
           closestDropZone.classList.add('dragging-over');
        }
        if (e && e.event) {
            const ev: any = e.event;
            const clientY: number = (typeof ev.clientY === 'number')
                ? ev.clientY
                : (ev.touches && ev.touches[0] && ev.touches[0].clientY) || 0;
            this.nestedInitialDragY = clientY;
            this.nestedCurrentDragY = clientY;
        }
        if (this.nestedDraggedIndex !== null && this.nestedComponents[this.nestedDraggedIndex]) {
            const component: FormNode = this.nestedComponents[this.nestedDraggedIndex];
            this.draggedComponentInfo = {
                id: component.id || '',
                containerId: this.nestedContainerId || ''
            };
            const draggedEl: HTMLElement | null = this.parent.querySelector(
                '[data-component-id="' + (component.id || '') + '"]'
            ) as HTMLElement | null;
            if (draggedEl) {
                draggedEl.classList.add('is-being-dragged');
            }
            if (this.props.onFieldDragStarted) {
                this.props.onFieldDragStarted({
                    componentName: component.name || '',
                    componentType: String(component.type),
                    sourceContainerId: this.nestedContainerId || '',
                    isNested: true
                });
            }
        }
    }

    private nestedDrag(e: any): void {
        if (this.nestedComponents.length > 1) {
            this.isNestedReordering = true;
            if (this.formAreaEl) {
                this.formAreaEl.classList.add('is-nesteditemreordering');
            }
        }
        if (this.nestedCloneHost) {
            this.nestedCloneHost.style.opacity = '0.97';
            if (e && e.event && this.nestedInitialDragY !== null) {
                const ev: any = e.event;
                const currentY: number = (typeof ev.clientY === 'number')
                    ? ev.clientY
                    : (ev.touches && ev.touches[0] && ev.touches[0].clientY) || 0;
                const initialY: number = this.nestedInitialDragY;
                if (ev.touches && ev.touches.length > 0) {
                    const t: any = ev.touches[0];
                    const touchTarget: HTMLElement | null = document.elementFromPoint
                        ? (document.elementFromPoint(t.clientX, t.clientY) as HTMLElement | null)
                        : null;
                    const wrapper: HTMLElement | null = touchTarget && touchTarget.closest
                        ? (touchTarget.closest('.form-field-wrapper') as HTMLElement | null)
                        : null;
                    const hovered: NodeListOf<Element> = this.parent.querySelectorAll('.form-field-wrapper.touch-hovered');
                    for (let i: number = 0; i < hovered.length; i++) {
                        if (hovered[i as number] !== wrapper) {
                            (hovered[i as number] as HTMLElement).classList.remove('touch-hovered');
                        }
                    }
                    if (wrapper && !wrapper.classList.contains('touch-hovered')) {
                        wrapper.classList.add('touch-hovered');
                    }
                }
                if (this.formAreaEl) {
                    this.formAreaEl.classList.remove('drag-moving-up', 'drag-moving-down');
                    if (currentY < initialY) {
                        this.formAreaEl.classList.add('drag-moving-up');
                    } else if (currentY > initialY) {
                        this.formAreaEl.classList.add('drag-moving-down');
                    }
                }
                this.nestedCurrentDragY = currentY;
            }
        }
    }

    private nestedDragStop(args: any, _containerClass: string): void {
        this.isNestedReordering = false;
        this.isDraggingFromPalette = false;
        this.activeNestedContainer = null;
        if (this.formAreaEl) {
            this.formAreaEl.classList.remove('is-nesteditemreordering', 'drag-moving-up', 'drag-moving-down');
        }
        const hovered: NodeListOf<Element> = this.parent.querySelectorAll('.form-field-wrapper.touch-hovered');
        for (let i: number = 0; i < hovered.length; i++) {
            (hovered[i as number] as HTMLElement).classList.remove('touch-hovered');
        }
        if (this.nestedCloneHost) {
            this.nestedCloneHost.classList.remove('moving-up', 'moving-down');
            this.nestedCloneHost.style.display = 'none';
            this.nestedCloneHost.style.opacity = '0';
        }
        this.nestedInitialDragY = null;
        this.nestedCurrentDragY = null;

        if (this.nestedDraggedIndex === null) {
            return;
        }
        const component: FormNode | undefined = this.nestedComponents[this.nestedDraggedIndex];
        const sourceContainerId: string | null = this.nestedContainerId;
        if (!component) {
            this.nestedDraggedIndex = null;
            this.draggedComponentInfo = null;
            this.clearDropTargetVisuals();
            this.clearNestedDropTargetVisuals();
            return;
        }
        if (this.formAreaEl) {
            this.formAreaEl.classList.remove('dragging-over');
        }
        const target: HTMLElement | null = (args && args.target) || null;
        const draggedEl: HTMLElement | null = this.parent.querySelector(
            '[data-component-id="' + (component.id || '') + '"]'
        ) as HTMLElement | null;
        if (draggedEl) {
            draggedEl.classList.remove('is-being-dragged');
        }

        const formPreviewArea: HTMLElement | null = target && target.closest
            ? (target.closest('.form-preview-area') as HTMLElement | null)
            : null;
        const isOverAnyNested: boolean = !!(target && target.closest
            && target.closest('.panel-drop-zone, .tab-drop-zone, .table-cell'));
        const closestDropZone: HTMLElement | null = target && target.closest
            ? (target.closest('.panel-drop-zone, .tab-drop-zone, .table-cell') as HTMLElement | null)
            : null;
        if (closestDropZone) {
           closestDropZone.classList.remove('dragging-over');
        }
        const closestDropZoneId: string | null = closestDropZone
            ? (closestDropZone.getAttribute('data-panel-id')
                || closestDropZone.getAttribute('data-container-id')
                || null)
            : null;
        const targetCellRow: number | undefined = (closestDropZone && closestDropZone.classList.contains('table-cell'))
            ? parseInt(closestDropZone.getAttribute('data-cell-row') || '0', 10)
            : undefined;
        const targetCellCol: number | undefined = (closestDropZone && closestDropZone.classList.contains('table-cell'))
            ? parseInt(closestDropZone.getAttribute('data-cell-col') || '0', 10)
            : undefined;
        const targetTabIndex: number | undefined = (closestDropZone && closestDropZone.classList.contains('tab-drop-zone'))
            ? parseInt(closestDropZone.getAttribute('data-tab-index') || '0', 10)
            : undefined;
        const isSameParent: boolean = (this.nestedCellInfo && typeof this.nestedCellInfo.row === 'number' && typeof this.nestedCellInfo.col === 'number')
            ? (sourceContainerId === closestDropZoneId
                && this.nestedCellInfo.row === targetCellRow
                && this.nestedCellInfo.col === targetCellCol)
            : (this.nestedCellInfo && typeof this.nestedCellInfo.tabIndex === 'number')
                ? (sourceContainerId === closestDropZoneId
                    && this.nestedCellInfo.tabIndex === targetTabIndex)
                : (sourceContainerId === closestDropZoneId);

        if (formPreviewArea && !isOverAnyNested) {
             const idx: number | null = this.dropTargetIndex;
            const pos: 'before' | 'after' | null = this.dropPosition;
            if (this.props.onDelete) {
                this.props.onDelete(component.id || '', true);
            }
            this.trackTimeout(() => {
                if (this.props.onDrop) {
                    this.props.onDrop(component, idx, pos);
                }
            }, 10);
            this.isDraggingFromPalette = false;
            this.clearDropTargetVisuals();
            this.nestedDraggedIndex = null;
            this.draggedComponentInfo = null;
            if (this.props.onFieldDropped) {
                this.props.onFieldDropped({
                    componentName: component.name || '',
                    componentType: String(component.type),
                    sourceContainerId: sourceContainerId || 'root',
                    targetContainerId: 'root',
                    isReordered: false
                });
            }
            return;
        }

        const targetPanelDropZone: HTMLElement | null = target && target.closest
            ? (target.closest('.panel-drop-zone') as HTMLElement | null)
            : null;
        if (targetPanelDropZone && !isSameParent) {
            const targetPanelId: string | null = targetPanelDropZone.getAttribute('data-panel-id');
            if (targetPanelId) {
                if (targetPanelId === component.id || this.isIdInSubtree(component, targetPanelId)) {
                    this.nestedDraggedIndex = null;
                    this.draggedComponentInfo = null;
                    this.isDraggingFromPalette = false;
                    this.clearNestedDropTargetVisuals();
                    return;
                }
                const isPanelSource: boolean = !!(sourceContainerId
                    && (sourceContainerId.indexOf('panel') >= 0
                        || sourceContainerId.indexOf('card') >= 0));
                const isPanelDest: boolean = !!(closestDropZoneId
                    && (closestDropZoneId.indexOf('panel') >= 0
                        || closestDropZoneId.indexOf('card') >= 0));
                if (targetPanelId !== sourceContainerId && (isPanelSource || isPanelDest)) {
                    const idx: number | null = this.nestedDropTargetIndex;
                    const pos: 'before' | 'after' | null = this.nestedDropPosition;
                    if (this.props.onDelete) {
                        this.props.onDelete(component.id || '', true);
                    }
                    this.trackTimeout(() => {
                        if (this.props.onNestedDrop) {
                            this.props.onNestedDrop(targetPanelId, component, undefined, targetPanelId, idx, pos);
                        }
                    }, 0);
                    this.isDraggingFromPalette = false;
                    this.clearNestedDropTargetVisuals();
                    this.nestedDraggedIndex = null;
                    this.draggedComponentInfo = null;
                    if (this.props.onFieldDropped) {
                        this.props.onFieldDropped({
                            componentName: component.name || '',
                            componentType: String(component.type),
                            sourceContainerId: sourceContainerId || 'root',
                            targetContainerId: targetPanelId,
                            isReordered: false
                        });
                    }
                    return;
                }
            }
        }

        const targetTabDropZone: HTMLElement | null = target && target.closest
            ? (target.closest('.tab-drop-zone') as HTMLElement | null)
            : null;
        if (targetTabDropZone && !isSameParent) {
            const targetTabContainerId: string | null = targetTabDropZone.getAttribute('data-container-id');
            const tgtTabIndex: number = parseInt(targetTabDropZone.getAttribute('data-tab-index') || '0', 10);
            if (targetTabContainerId) {
                if (targetTabContainerId === component.id || this.isIdInSubtree(component, targetTabContainerId)) {
                    this.nestedDraggedIndex = null;
                    this.draggedComponentInfo = null;
                    this.isDraggingFromPalette = false;
                    this.clearNestedDropTargetVisuals();
                    return;
                }
                const isSameTabContainer: boolean = targetTabContainerId === sourceContainerId
                    && this.nestedCellInfo
                    && this.nestedCellInfo.tabIndex === tgtTabIndex;
                const isTabsSource: boolean = !!(sourceContainerId
                    && (sourceContainerId.indexOf('tabs') >= 0
                        || sourceContainerId.indexOf('card') >= 0));
                const isTabsDest: boolean = !!(closestDropZoneId
                    && (closestDropZoneId.indexOf('tabs') >= 0
                        || closestDropZoneId.indexOf('card') >= 0));
                if (!isSameTabContainer && (isTabsSource || isTabsDest)) {
                    const idx: number | null = this.nestedDropTargetIndex;
                    const pos: 'before' | 'after' | null = this.nestedDropPosition;
                    if (this.props.onDelete) {
                        this.props.onDelete(component.id || '', true);
                    }
                    this.trackTimeout(() => {
                        if (this.props.onNestedDrop) {
                            this.props.onNestedDrop(
                                targetTabContainerId,
                                component,
                                { row: 0, col: 0, tabIndex: tgtTabIndex },
                                targetTabContainerId,
                                idx,
                                pos
                            );
                        }
                    }, 0);
                    this.isDraggingFromPalette = false;
                    this.clearNestedDropTargetVisuals();
                    this.nestedDraggedIndex = null;
                    this.draggedComponentInfo = null;
                    if (this.props.onFieldDropped) {
                        this.props.onFieldDropped({
                            componentName: component.name || '',
                            componentType: String(component.type),
                            sourceContainerId: sourceContainerId || 'root',
                            targetContainerId: targetTabContainerId,
                            isReordered: false
                        });
                    }
                    return;
                }
            }
        }

        const targetTableCell: HTMLElement | null = target && target.closest
            ? (target.closest('.table-cell') as HTMLElement | null)
            : null;
        if (targetTableCell && !isSameParent) {
            const targetCellContainerId: string | null = targetTableCell.getAttribute('data-container-id');
            const tgtCellRow: number = parseInt(targetTableCell.getAttribute('data-cell-row') || '0', 10);
            const tgtCellCol: number = parseInt(targetTableCell.getAttribute('data-cell-col') || '0', 10);
            if (targetCellContainerId) {
                if (targetCellContainerId === component.id || this.isIdInSubtree(component, targetCellContainerId)) {
                    this.nestedDraggedIndex = null;
                    this.draggedComponentInfo = null;
                    this.isDraggingFromPalette = false;
                    this.clearNestedDropTargetVisuals();
                    return;
                }
                const isSameCell: boolean = targetCellContainerId === sourceContainerId
                    && this.nestedCellInfo
                    && this.nestedCellInfo.row === tgtCellRow
                    && this.nestedCellInfo.col === tgtCellCol;
                if (!isSameCell) {
                    const idx: number | null = this.nestedDropTargetIndex;
                    const pos: 'before' | 'after' | null = this.nestedDropPosition;
                    if (this.props.onDelete) {
                        this.props.onDelete(component.id || '', true);
                    }
                    this.trackTimeout(() => {
                        if (this.props.onNestedDrop) {
                            this.props.onNestedDrop(
                                targetCellContainerId,
                                component,
                                { row: tgtCellRow, col: tgtCellCol },
                                targetCellContainerId,
                                idx,
                                pos
                            );
                        }
                    }, 0);
                    this.isDraggingFromPalette = false;
                    this.clearNestedDropTargetVisuals();
                    this.nestedDraggedIndex = null;
                    this.draggedComponentInfo = null;
                    if (this.props.onFieldDropped) {
                        this.props.onFieldDropped({
                            componentName: component.name || '',
                            componentType: String(component.type),
                            sourceContainerId: sourceContainerId || 'root',
                            targetContainerId: targetCellContainerId,
                            isReordered: false
                        });
                    }
                    return;
                }
            }
        }

        const targetElement: HTMLElement | null = target && target.closest
            ? (target.closest('.' + _containerClass) as HTMLElement | null)
            : null;
        if (targetElement) {
            const targetIndex: number = parseInt(targetElement.getAttribute('data-nested-index') || '-1', 10);
            if (targetIndex !== -1 && targetIndex !== this.nestedDraggedIndex) {
                const newChildren: FormNode[] = this.nestedComponents.slice();
                const draggedChild: FormNode = newChildren[this.nestedDraggedIndex];
                newChildren.splice(this.nestedDraggedIndex, 1);
                newChildren.splice(targetIndex, 0, draggedChild);
                if (this.nestedContainerId && this.nestedContainerPath) {
                    if (this.props.onNestedReorder) {
                        this.props.onNestedReorder(
                            this.nestedContainerId,
                            this.nestedContainerPath,
                            newChildren,
                            this.nestedCellInfo
                        );
                    }
                    this.isDraggingFromPalette = false;
                    this.clearDropTargetVisuals();
                    this.clearNestedDropTargetVisuals();
                }
                if (this.props.onFieldDropped) {
                    this.props.onFieldDropped({
                        componentName: draggedChild.name || '',
                        componentType: String(draggedChild.type),
                        sourceContainerId: sourceContainerId || 'root',
                        targetContainerId: this.nestedContainerId || 'root',
                        isReordered: true
                    });
                }
            }
        }

        this.nestedDraggedIndex = null;
        this.isDraggingFromPalette = false;
        this.clearDropTargetVisuals();
        this.clearNestedDropTargetVisuals();
        this.draggedComponentInfo = null;
    }

    private handleMoveUp(fieldId: string): void {
        const index: number = this.currentComponents.findIndex((c: FormNode) => c.id === fieldId);
        if (index > 0) {
            const next: FormNode[] = this.currentComponents.slice();
            const tmp: FormNode = next[index - 1 as number];
            next[index - 1 as number] = next[index as number];
            next[index as number] = tmp;
            if (this.props.onReorder) {
                this.props.onReorder(next);
            }
        }
    }

    private handleMoveDown(fieldId: string): void {
        const index: number = this.currentComponents.findIndex((c: FormNode) => c.id === fieldId);
        if (index >= 0 && index < this.currentComponents.length - 1) {
            const next: FormNode[] = this.currentComponents.slice();
            const tmp: FormNode = next[index + 1];
            next[index + 1] = next[index as number];
            next[index as number] = tmp;
            if (this.props.onReorder) {
                this.props.onReorder(next);
            }
        }
    }

    private handleNestedMoveUp(
        fieldId: string,
        parentId: string,
        parentPath: string,
        cellInfo?: { row?: number; col?: number; tabIndex?: number }
    ): void {
        const children: FormNode[] = this.getNestedChildren(parentId, parentPath, cellInfo);
        const index: number = children.findIndex((c: FormNode) => c.id === fieldId);
        if (index > 0) {
            const next: FormNode[] = children.slice();
            const tmp: FormNode = next[index - 1];
            next[index - 1 as number] = next[index as number];
            next[index as number] = tmp;
            if (this.props.onNestedReorder) {
                this.props.onNestedReorder(parentId, parentPath, next, cellInfo);
            }
        }
    }

    private handleNestedMoveDown(
        fieldId: string,
        parentId: string,
        parentPath: string,
        cellInfo?: { row?: number; col?: number; tabIndex?: number }
    ): void {
        const children: FormNode[] = this.getNestedChildren(parentId, parentPath, cellInfo);
        const index: number = children.findIndex((c: FormNode) => c.id === fieldId);
        if (index >= 0 && index < children.length - 1) {
            const next: FormNode[] = children.slice();
            const tmp: FormNode = next[index + 1 as number];
            next[index + 1 as number] = next[index as number];
            next[index as number] = tmp;
            if (this.props.onNestedReorder) {
                this.props.onNestedReorder(parentId, parentPath, next, cellInfo);
            }
        }
    }

    private getNestedChildren(
        parentId: string,
        _parentPath: string,
        cellInfo?: { row?: number; col?: number; tabIndex?: number }
    ): FormNode[] {
        const parent: FormNode | null = this.findComponentById(parentId);
        if (!parent) {
            return [];
        }
        if (cellInfo && typeof cellInfo.tabIndex === 'number') {
            const items: any[] = (parent as any).tabItems || [];
            const tab: any = items[cellInfo.tabIndex];
            if (tab && tab.content) {
                return (tab.content as FormNode[]).slice();
            }
            return [];
        }
        if (cellInfo && typeof cellInfo.row === 'number' && typeof cellInfo.col === 'number') {
            const cells: any[][][] = (parent as any).tableCells || [];
            const row: any[][] = cells[cellInfo.row] || [];
            const cell: any[] = row[cellInfo.col] || [];
            return (cell as FormNode[]).slice();
        }
        return (parent.children || []).slice();
    }

    private findComponentById(componentId: string): FormNode | null {
        const roots: FormNode[] = this.currentComponents || [];
        const stack: FormNode[] = [];
        for (let i: number = 0; i < roots.length; i++) {
            stack.push(roots[i as number]);
        }
        while (stack.length > 0) {
            const comp: FormNode = stack.pop() as FormNode;
            if (comp && comp.id === componentId) {
                return comp;
            }
            if (!comp) {
                continue;
            }
            if (comp.children) {
                for (let i: number = 0; i < comp.children.length; i++) {
                    stack.push(comp.children[i as number]);
                }
            }
            if (comp.tableCells) {
                for (let r: number = 0; r < comp.tableCells.length; r++) {
                    const row: FormNode[][] = comp.tableCells[r as number];
                    for (let c: number = 0; c < row.length; c++) {
                        const cell: FormNode[] = row[c as number];
                        for (let k: number = 0; k < cell.length; k++) {
                            stack.push(cell[k as number]);
                        }
                    }
                }
            }
            if (comp.tabItems) {
                for (let t: number = 0; t < comp.tabItems.length; t++) {
                    const tab: any = comp.tabItems[t as number];
                    if (tab && tab.content) {
                        for (let i: number = 0; i < tab.content.length; i++) {
                            stack.push(tab.content[i as number]);
                        }
                    }
                }
            }
        }
        return null;
    }

    private isIdInSubtree(root: FormNode, idToFind: string): boolean {
        if (!root) {
            return false;
        }
        if (!idToFind) {
            return false;
        }
        const stack: FormNode[] = [root];
        while (stack.length > 0) {
            const comp: FormNode = stack.pop() as FormNode;
            if (!comp) {
                continue;
            }
            if (comp.id === idToFind) {
                return true;
            }
            if (comp.children) {
                for (let i: number = 0; i < comp.children.length; i++) {
                    stack.push(comp.children[i as number]);
                }
            }
            if (comp.tableCells) {
                for (let r: number = 0; r < comp.tableCells.length; r++) {
                    const row: FormNode[][] = comp.tableCells[r as number];
                    for (let c: number = 0; c < row.length; c++) {
                        const cell: FormNode[] = row[c as number];
                        for (let k: number = 0; k < cell.length; k++) {
                            stack.push(cell[k as number]);
                        }
                    }
                }
            }
            if (comp.tabItems) {
                for (let t: number = 0; t < comp.tabItems.length; t++) {
                    const tab: any = comp.tabItems[t as number];
                    if (tab && tab.content) {
                        for (let i: number = 0; i < tab.content.length; i++) {
                            stack.push(tab.content[i as number]);
                        }
                    }
                }
            }
        }
        return false;
    }

    private clearAllDragVisuals(): void {
        if (this.formAreaEl) {
            this.formAreaEl.classList.remove('dragging-over');
        }
        this.dropTargetIndex = null;
        this.dropPosition = null;
        this.nestedDropTargetIndex = null;
        this.nestedDropPosition = null;
        this.draggingOverPanel = null;
        this.isDraggingFromPalette = false;
        this.clearDropTargetVisuals();
        this.clearNestedDropTargetVisuals();
    }

    private findDropTarget(
        cursorY: number,
        containerSelector: string,
        container?: Element | null
    ): DropTargetResult | null {
        const scope: ParentNode = container || this.parent;
        const fields: NodeListOf<Element> = scope.querySelectorAll(containerSelector);
        if (fields.length === 0) {
            return null;
        }
        for (let i: number = 0; i < fields.length; i++) {
            const rect: ClientRect = (fields[i as number] as HTMLElement).getBoundingClientRect();
            if (cursorY >= rect.top && cursorY < rect.bottom) {
                const mid: number = rect.top + rect.height / 2;
                return { index: i, position: cursorY < mid ? 'before' : 'after' };
            }
        }
        for (let i: number = 0; i < fields.length - 1; i++) {
            const current: ClientRect = (fields[i as number] as HTMLElement).getBoundingClientRect();
            const next: ClientRect = (fields[i + 1] as HTMLElement).getBoundingClientRect();
            if (cursorY > current.bottom && cursorY < next.top) {
                return { index: i + 1, position: 'before' };
            }
        }
        const first: ClientRect = (fields[0] as HTMLElement).getBoundingClientRect();
        if (cursorY < first.top) {
            return { index: 0, position: 'before' };
        }
        const last: ClientRect = (fields[fields.length - 1] as HTMLElement).getBoundingClientRect();
        if (cursorY > last.bottom) {
            return { index: fields.length - 1, position: 'after' };
        }
        return null;
    }

    private findFilteredClosest(
        target: any,
        selector: string,
        blockedSelectors: string[] = []
    ): HTMLElement | null {
        let el: any = target;
        while (el) {
            const matches: boolean = el.matches ? el.matches(selector) : false;
            const isBlocked: boolean = blockedSelectors.some(
                (cls: string) => el.classList && el.classList.contains(cls)
            );
            if (isBlocked && !matches) {
                return null;
            }
            if (matches) {
                return el as HTMLElement;
            }
            el = el.parentElement;
        }
        return null;
    }

    private updateDropTargetVisuals(target: DropTargetResult): void {
        const fields: NodeListOf<Element> = this.parent.querySelectorAll('.form-field-draggable');
        for (let i: number = 0; i < fields.length; i++) {
            const el: HTMLElement = fields[i as number] as HTMLElement;
            el.classList.remove('drop-target-before', 'drop-target-after');
            if (i === target.index) {
                el.classList.add('drop-target-' + target.position);
            }
        }
    }

    private clearDropTargetVisuals(): void {
        const fields: NodeListOf<Element> = this.parent.querySelectorAll('.form-field-draggable');
        for (let i: number = 0; i < fields.length; i++) {
            (fields[i as number] as HTMLElement).classList.remove('drop-target-before', 'drop-target-after');
        }
    }

    private updateNestedDropTargetVisuals(
        target: DropTargetResult,
        containerSelector: string,
        container?: Element | null
    ): void {
        const scope: ParentNode = container || this.parent;
        const fields: NodeListOf<Element> = scope.querySelectorAll(containerSelector);
        for (let i: number = 0; i < fields.length; i++) {
            const el: HTMLElement = fields[i as number] as HTMLElement;
            el.classList.remove('drop-target-before', 'drop-target-after');
            if (i === target.index) {
                el.classList.add('drop-target-' + target.position);
            }
        }
    }

    private clearNestedDropTargetVisuals(): void {
        const selectors: string[] = [
            '.panel-child-field-draggable',
            '.tab-child-field-draggable',
            '.table-cell-child-draggable'
        ];
        for (let s: number = 0; s < selectors.length; s++) {
            const fields: NodeListOf<Element> = this.parent.querySelectorAll(selectors[s as number]);
            for (let i: number = 0; i < fields.length; i++) {
                (fields[i as number] as HTMLElement).classList.remove(
                    'drop-target-before',
                    'drop-target-after'
                );
            }
        }
    }

    private isPaletteDrag(): boolean {
        const paletteClone = this.parent.querySelector('.palette-item-clone');
        if(paletteClone && (paletteClone as HTMLDivElement).style.display !== 'none') {
            return true;
        }
        if(this.isDraggingFromPalette) {
            return true;
        }
        return false;
    }

    private getClientY(e: Event | DragEvent | MouseEvent | TouchEvent | undefined): number | null {
        if (!e) {
            return null;
        }
        const anyE: any = e as any;
        if (anyE && typeof anyE.clientY === 'number') {
            return anyE.clientY;
        }
        if (anyE && Array.isArray(anyE.touches) && anyE.touches[0]) {
            return anyE.touches[0].clientY;
        }
        if (anyE && Array.isArray(anyE.changedTouches) && anyE.changedTouches[0]) {
            return anyE.changedTouches[0].clientY;
        }
        return null;
    }

    private getEventPoint(
        e: Event | DragEvent | MouseEvent | TouchEvent | undefined
    ): { x: number; y: number } | null {
        if (!e) {
            return null;
        }
        const anyE: any = e as any;
        if (anyE && typeof anyE.clientX === 'number' && typeof anyE.clientY === 'number') {
            return { x: anyE.clientX, y: anyE.clientY };
        }
        if (anyE && Array.isArray(anyE.touches) && anyE.touches[0]) {
            const t: any = anyE.touches[0];
            return { x: t.clientX, y: t.clientY };
        }
        if (anyE && Array.isArray(anyE.changedTouches) && anyE.changedTouches[0]) {
            const t: any = anyE.changedTouches[0];
            return { x: t.clientX, y: t.clientY };
        }
        return null;
    }

    private addTrackedListener(
        target: EventTarget,
        event: string,
        handler: EventListener,
        opts?: AddEventListenerOptions | boolean
    ): void {
        target.addEventListener(event, handler, opts);
        this.owners.docListeners.push({ target: target, event: event, handler: handler, opts: opts });
    }

    private removeTrackedListener(
        target: EventTarget,
        event: string,
        handler: EventListener,
        opts?: AddEventListenerOptions | boolean
    ): void {
        if (!target) {
            return;
        }
        try {
            target.removeEventListener(event, handler, opts);
        } catch (e) {
            /* target may have been detached — Phase 15.12.1 */
        }
        const list: TrackedListener[] = this.owners.docListeners;
        for (let i: number = list.length - 1; i >= 0; i--) {
            const l: TrackedListener = list[i as number];
            if (l.target === target && l.event === event && l.handler === handler) {
                list.splice(i, 1);
            }
        }
    }

    private trackTimeout(fn: () => void, delay: number): number {
        const handle: number = window.setTimeout(() => {
            // Remove the handle from the list before invoking so a
            // throw inside `fn` doesn't leave a stale entry.
            const list: number[] = this.owners.pendingTimers;
            const idx: number = list.indexOf(handle);
            if (idx >= 0) {
                list.splice(idx, 1);
            }
            try {
                fn();
            } catch (e) {
                /* swallow — Phase 15.12.2 */
            }
        }, delay);
        this.owners.pendingTimers.push(handle);
        return handle;
    }

    /** @private */
    public __audit(): {
        droppables: number;
        draggables: number;
        wrappers: number;
        tooltips: number;
        tabs: number;
        toolbars: number;
        messages: number;
        buttons: number;
        listeners: number;
        timers: number;
        gridRefs: number;
        preservedNodes: number;
    } {
        return {
            droppables: this.owners.droppables.length,
            draggables: this.owners.draggables.length,
            wrappers: this.owners.fieldWrappers.length,
            tooltips: this.owners.tooltips.length,
            tabs: this.owners.tabs.length,
            toolbars: this.owners.toolbars.length,
            messages: this.owners.messages.length,
            buttons: this.owners.buttons.length,
            listeners: this.owners.docListeners.length,
            timers: this.owners.pendingTimers.length,
            gridRefs: this.owners.gridRefs.size,
            preservedNodes: this.owners.preservedNodes.length
        };
    }
}

/** @private */
export function extractTemplateComponents(template: CustomFormTemplate): FormNode[] {
    try {
        if (!template || !template.schema) {
            return [];
        }
        const dataSchemaJson: string = JSON.stringify(template.schema);
        const emptyFormSchema: FormSchema = {
            version: '0.1.0',
            components: []
        };
        const merged: FormSchema = importSplitSchemas(dataSchemaJson, emptyFormSchema);

        const regenerateIds: (comp: FormNode) => FormNode = (comp: FormNode): FormNode => {
            const updated: FormNode = { ...comp, id: generateId(comp.type) };
            if (comp.children && comp.children.length > 0) {
                updated.children = comp.children.map(regenerateIds);
            }
            if (comp.tableCells && comp.tableCells.length > 0) {
                updated.tableCells = comp.tableCells.map(
                    (row: FormNode[][]) => row.map((cell: FormNode[]) => cell.map(regenerateIds))
                );
            }
            if (comp.tabItems && comp.tabItems.length > 0) {
                updated.tabItems = comp.tabItems.map((tab: any) => ({
                    ...tab,
                    content: tab.content ? tab.content.map(regenerateIds) : undefined
                }));
            }
            return updated;
        };

        const filterOutSubmitButtons: (comp: FormNode) => boolean =
            (comp: FormNode): boolean => {
                if (comp.type === 'button' && comp.buttonType === 'submit') {
                    return false;
                }
                return true;
            };

        const components: FormNode[] = (merged.components || []).map(regenerateIds);
        return components.filter(filterOutSubmitButtons);
    } catch (e) {
        return [];
    }
}

export default MainSection;
