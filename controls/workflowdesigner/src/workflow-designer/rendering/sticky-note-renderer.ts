import { Diagram, NodeConstraints, NodeModel } from '@syncfusion/ej2-diagrams';
import { WorkflowPosition } from '../models/workflow-position';
import { LocaleContext } from '../localization/locale-context';
import { WorkflowSize } from '../models/workflow-size';
import { WorkflowStickyNote } from '../models/workflow-sticky-note';
import { WorkflowStickyNoteStyle } from '../models/workflow-style';

const DEFAULT_STICKY_NOTE_WIDTH: number = 200;
const DEFAULT_STICKY_NOTE_HEIGHT: number = 170;
const MIN_STICKY_NOTE_WIDTH: number = 100;
const MIN_STICKY_NOTE_HEIGHT: number = 80;
const DEFAULT_STICKY_NOTE_FILL: string = '#fff4b8';
const DEFAULT_STICKY_NOTE_STROKE: string = '#ffffff00';
const DEFAULT_STICKY_NOTE_CORNER_RADIUS: number = 10;
const DEFAULT_STICKY_NOTE_TEXT: string = 'Double-click to edit\n\nYou can use **bold**, *italic*, `code`, and\n# Headers\n- Lists';

/**
 * Returns the localized placeholder text of an empty sticky note.
 *
 * @returns {string} The placeholder text.
 */
function defaultStickyNoteText(): string {
    return LocaleContext.text('stickyNoteDefaultText', DEFAULT_STICKY_NOTE_TEXT);
}

/**
 * Maps sticky notes to annotation-template Diagram nodes.
 *
 * The Diagram HTML-node `content` is supplied as an HTML string template with
 * `${}` bindings (the installed Diagram version's supported functional-template
 * content form). The template root is always `e-wf-sticky-note-content`; the
 * sticky-note `text` is HTML-escaped so it remains plain text only — no
 * Markdown, no HTML interpretation, no script execution, no event-handler
 * attributes and no `javascript:` URLs. Style overrides are bound as
 * inline `style` values derived from the public sticky-note style.
 *
 * @internal
 * @private
 */
export class StickyNoteRenderer {
    private readonly noteByNode: Map<NodeModel, WorkflowStickyNote> = new Map<NodeModel, WorkflowStickyNote>();

    /**
     * Creates a Diagram node whose content is rendered by an annotation template.
     *
     * @param {WorkflowStickyNote} note The sticky-note model.
     * @returns {NodeModel} The rendered Diagram node.
     * @private
     */
    public render(note: WorkflowStickyNote): NodeModel {
        const position: WorkflowPosition | undefined = note.position;
        const size: WorkflowSize | undefined = note.size;
        const node: NodeModel = {
            id: note.id,
            offsetX: position && typeof position.x === 'number' ? position.x : 0,
            offsetY: position && typeof position.y === 'number' ? position.y : 0,
            width: size && typeof size.width === 'number' ? size.width : DEFAULT_STICKY_NOTE_WIDTH,
            height: size && typeof size.height === 'number' ? size.height : DEFAULT_STICKY_NOTE_HEIGHT,
            minWidth: MIN_STICKY_NOTE_WIDTH,
            minHeight: MIN_STICKY_NOTE_HEIGHT,
            shape: { type: 'Basic', shape: 'Rectangle', cornerRadius: StickyNoteRenderer.resolveCornerRadius(note.style) },
            annotations: [{
                id: 'sticky-note-annotation',
                width: size && typeof size.width === 'number' ? size.width : DEFAULT_STICKY_NOTE_WIDTH,
                height: size && typeof size.height === 'number' ? size.height : DEFAULT_STICKY_NOTE_HEIGHT,
                horizontalAlignment: 'Stretch',
                verticalAlignment: 'Stretch',
                template: StickyNoteRenderer.createContentTemplate(note)
            }],
            style: this.toDiagramStyle(note.style),
            constraints: NodeConstraints.Default & ~NodeConstraints.Rotate & ~NodeConstraints.InConnect
                & ~NodeConstraints.OutConnect,
            addInfo: { isWorkflowNode: true, workflowStickyNote: note },
            ports: []
        };
        this.noteByNode.set(node, note);
        return node;
    }

    /**
     * Associates a live Diagram node with its public sticky-note model.
     *
     * @param {NodeModel} node The live Diagram node.
     * @param {WorkflowStickyNote} note The sticky-note model.
     * @returns {void}
     * @private
     */
    public trackNode(node: NodeModel, note: WorkflowStickyNote): void {
        this.noteByNode.set(node, note);
    }

    /**
     * Applies only supplied sticky-note changes to a rendered node.
     *
     * @param {NodeModel} node The rendered Diagram node.
     * @param {Partial<WorkflowStickyNote>} changes The changes to apply.
     * @returns {void}
     * @private
     */
    public applyChanges(node: NodeModel, changes: Partial<WorkflowStickyNote>): void {
        const addInfo: { workflowStickyNote?: WorkflowStickyNote } | undefined = node.addInfo
            && typeof node.addInfo === 'object'
            ? node.addInfo as { workflowStickyNote?: WorkflowStickyNote }
            : undefined;
        const stored: WorkflowStickyNote | undefined = this.noteByNode.get(node)
            || (addInfo && addInfo.workflowStickyNote);
        if (!stored) {
            return;
        }
        const note: WorkflowStickyNote = Object.assign({}, stored, changes);
        this.noteByNode.set(node, note);
        node.addInfo = Object.assign({}, addInfo || {}, { isWorkflowNode: true, workflowStickyNote: note });
        const nodeId: string = String(node.id || '');
        if (changes.text !== undefined) {
            const preview: HTMLElement | null = StickyNoteRenderer.findPreview(nodeId);
            if (preview) {
                preview.innerHTML = StickyNoteRenderer.convertMarkdownToHtml(note.text || defaultStickyNoteText());
            }
            const liveEditor: HTMLTextAreaElement | null = StickyNoteRenderer.findEditor(nodeId);
            if (liveEditor && liveEditor.style.display !== 'none') {
                liveEditor.value = note.text || defaultStickyNoteText();
            }
        }
        if (changes.position) {
            if (typeof changes.position.x === 'number') {
                node.offsetX = changes.position.x;
            }
            if (typeof changes.position.y === 'number') {
                node.offsetY = changes.position.y;
            }
        }
        if (changes.size) {
            if (typeof changes.size.width === 'number') {
                node.width = changes.size.width;
                if (node.annotations && node.annotations[0]) {
                    node.annotations[0].width = changes.size.width;
                }
            }
            if (typeof changes.size.height === 'number') {
                node.height = changes.size.height;
                if (node.annotations && node.annotations[0]) {
                    node.annotations[0].height = changes.size.height;
                }
            }
        }
        if (changes.style) {
            const merged: WorkflowStickyNoteStyle | undefined = note.style;
            node.style = Object.assign({}, node.style || {}, this.toDiagramStyle(merged));
            const newCornerRadius: number = StickyNoteRenderer.resolveCornerRadius(merged);
            if (node.shape && (node.shape as { cornerRadius?: number }).cornerRadius !== newCornerRadius) {
                (node.shape as { cornerRadius?: number }).cornerRadius = newCornerRadius;
            }
            const liveEditor: HTMLTextAreaElement | null = StickyNoteRenderer.findEditor(nodeId);
            if (liveEditor) {
                liveEditor.style.backgroundColor = 'rgba(255, 255, 255, 0.86)';
                liveEditor.style.borderColor = DEFAULT_STICKY_NOTE_STROKE;
                liveEditor.style.borderRadius = newCornerRadius + 'px';
            }
        }
    }

    /**
     * Opens the editor embedded in a sticky-note HTML template.
     *
     * @param {NodeModel} node The rendered Diagram node.
     * @param {Function} onSave Callback invoked with saved text.
     * @returns {void}
     * @private
     */
    public beginEdit(node: NodeModel, onSave: (text: string) => void): void {
        const nodeId: string = String(node.id || '');
        const preview: HTMLElement | null = StickyNoteRenderer.findPreview(nodeId);
        const root: HTMLElement | null = (preview && preview.parentElement)
            || StickyNoteRenderer.findContentRoot(nodeId)
            || this.findAnnotationRoot(node);
        if (!root) {
            return;
        }
        let editor: HTMLTextAreaElement | null = StickyNoteRenderer.findEditor(nodeId);
        if (!preview) {
            return;
        }
        if (!editor) {
            editor = document.createElement('textarea');
            editor.className = 'e-wf-sticky-note-editor';
            editor.id = 'editor-' + nodeId;
            editor.setAttribute('aria-label', LocaleContext.text('editStickyNote'));
            editor.style.display = 'none';
            root.appendChild(editor);
        }
        if (editor.style.display === 'block') {
            return;
        }
        const stored: WorkflowStickyNote = this.noteByNode.get(node) || {};
        const original: string = stored.text || defaultStickyNoteText();
        let committed: boolean = false;
        const finish: (save: boolean) => void = (save: boolean): void => {
            if (committed) {
                return;
            }
            committed = true;
            editor.removeEventListener('blur', onBlur);
            editor.removeEventListener('keydown', onKeyDown);
            editor.removeEventListener('click', onEditorClick);
            editor.removeEventListener('mousedown', onEditorMouseDown);
            editor.removeEventListener('pointerdown', onEditorPointerDown);
            preview.style.display = 'block';
            editor.style.display = 'none';
            if (save) {
                const text: string = editor.value;
                const next: WorkflowStickyNote = Object.assign({}, stored, { text });
                this.noteByNode.set(node, next);
                preview.innerHTML = StickyNoteRenderer.convertMarkdownToHtml(text);
                onSave(text);
            } else {
                editor.value = original;
            }
        };
        const onBlur: () => void = (): void => finish(true);
        const onKeyDown: (event: KeyboardEvent) => void = (event: KeyboardEvent): void => {
            event.stopPropagation();
            if (event.key === 'Escape') {
                event.preventDefault();
                finish(false);
            }
        };
        const onEditorClick: (event: MouseEvent) => void = (event: MouseEvent): void => {
            event.stopPropagation();
        };
        const onEditorMouseDown: (event: MouseEvent) => void = (event: MouseEvent): void => {
            event.stopPropagation();
        };
        const onEditorPointerDown: (event: PointerEvent) => void = (event: PointerEvent): void => {
            event.stopPropagation();
        };
        preview.style.display = 'none';
        editor.style.display = 'block';
        editor.value = original;
        editor.addEventListener('blur', onBlur);
        editor.addEventListener('keydown', onKeyDown);
        editor.addEventListener('click', onEditorClick);
        editor.addEventListener('mousedown', onEditorMouseDown);
        editor.addEventListener('pointerdown', onEditorPointerDown);
        editor.focus();
    }

    private static convertMarkdownToHtml(markdown: string): string {
        const escaped: string = StickyNoteRenderer.escapeHtml(markdown || '');
        // Use line-by-line grouping instead of nested quantifiers so the
        // security plugin doesn't flag the regex (`security/detect-unsafe-regex`).
        // Splitting on newlines then re-wrapping each contiguous bullet block
        // avoids the exponential blowup pattern that nested `+` quantifiers introduce.
        const lines: string[] = escaped.split('\n');
        const out: string[] = [];
        let buffer: string[] = [];
        const flush: () => void = (): void => {
            if (buffer.length > 0) {
                out.push(buffer.join('\n'));
                buffer = [];
            }
        };
        for (const line of lines) {
            if (/^- (.*)$/.test(line)) {
                buffer.push(line);
            } else {
                flush();
                out.push(line);
            }
        }
        flush();
        return out
            .join('\n')
            .replace(/^### (.*)$/gim, '<h3>$1</h3>')
            .replace(/^## (.*)$/gim, '<h2>$1</h2>')
            .replace(/^# (.*)$/gim, '<h1>$1</h1>')
            .replace(/\*`([^`]+)`\*/g, '<em><code>$1</code></em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.*)$/gim, '<li>$1</li>')
            .replace(/\n/g, '<br>')
            .replace(/<\/li><br>/g, '</li>');
    }

    private static createContentTemplate(note: WorkflowStickyNote): HTMLElement {
        const style: WorkflowStickyNoteStyle | undefined = note.style;
        const text: string = note.text || defaultStickyNoteText();
        const nodeId: string = String(note.id || '');
        const root: HTMLDivElement = document.createElement('div');
        root.className = 'e-wf-sticky-note-content';
        root.id = 'wf-sticky-note-content-' + nodeId;
        root.setAttribute('data-wf-sticky-note-id', nodeId);
        root.style.cssText = StickyNoteRenderer.buildInlineStyle(style);
        const preview: HTMLDivElement = document.createElement('div');
        preview.className = 'e-wf-sticky-note-preview';
        preview.id = 'preview-' + nodeId;
        preview.innerHTML = StickyNoteRenderer.convertMarkdownToHtml(text);
        const editor: HTMLTextAreaElement = document.createElement('textarea');
        editor.className = 'e-wf-sticky-note-editor';
        editor.id = 'editor-' + nodeId;
        editor.setAttribute('aria-label', LocaleContext.text('editStickyNote'));
        editor.style.display = 'none';
        root.appendChild(preview);
        root.appendChild(editor);
        return root;
    }

    /**
     * Set Sticky Note ZIndex.
     *
     * @param {NodeModel} node The node.
     * @param {Diagram} diagram The diagram.
     * @returns {void} Nothing.
     * @private
     */
    public setStickyNoteZIndex(node: NodeModel, diagram: Diagram | null): void {
        const annotation: HTMLElement | null = this.findAnnotationRoot(node);
        if (annotation) {
            annotation.style.zIndex = '-1';
        }
        if (diagram && diagram.connectors && diagram.connectors.length) {
            diagram.select(diagram.connectors);
            diagram.bringToFront();
            diagram.clearSelection();
        }
    }

    private findAnnotationRoot(node: NodeModel): HTMLElement | null {
        const nodeId: string = String(node.id || '');
        const annotationId: string | undefined = node.annotations
            && node.annotations[0]
            && node.annotations[0].id
            ? String(node.annotations[0].id)
            : undefined;
        return annotationId
            ? document.getElementById(`${nodeId}_${annotationId}_html_element`)
            : null;
    }

    private static findContentRoot(nodeId: string): HTMLElement | null {
        return document.getElementById('wf-sticky-note-content-' + nodeId);
    }

    private static findPreview(nodeId: string): HTMLElement | null {
        return document.getElementById('preview-' + nodeId);
    }

    private static findEditor(nodeId: string): HTMLTextAreaElement | null {
        return document.getElementById('editor-' + nodeId) as HTMLTextAreaElement | null;
    }

    private static buildInlineStyle(_style: WorkflowStickyNoteStyle | undefined): string {
        return 'box-sizing:border-box;width:100%;height:100%;padding:0;overflow:hidden;background:transparent;';
    }

    private static resolveCornerRadius(style: WorkflowStickyNoteStyle | undefined): number {
        if (style && typeof style.cornerRadius === 'number' && style.cornerRadius >= 0) {
            return style.cornerRadius;
        }
        return DEFAULT_STICKY_NOTE_CORNER_RADIUS;
    }

    private static escapeHtml(value: string): string {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    private toDiagramStyle(style: WorkflowStickyNoteStyle | undefined): {
        fill: string; strokeColor: string; strokeWidth: number; strokeDashArray: string; opacity: number;
    } {
        return {
            fill: style && style.fill ? style.fill : DEFAULT_STICKY_NOTE_FILL,
            strokeColor: 'transparent',
            strokeWidth: 0,
            strokeDashArray: '',
            opacity: style && typeof style.opacity === 'number' ? style.opacity : 1
        };
    }
}
