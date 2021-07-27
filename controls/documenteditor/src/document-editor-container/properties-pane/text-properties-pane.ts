import { createElement, classList } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../document-editor/index';
import { DocumentEditorContainer } from '../document-editor-container';
import { Text } from './text-properties';
import { Paragraph } from './paragraph-properties';
/**
 * Text Properties pane
 *
 * @private
 */
export class TextProperties {
    public element: HTMLElement;
    private container: DocumentEditorContainer;
    private text: Text;
    private paragraph: Paragraph;
    private isInitial: boolean = true;
    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    /**
     * Initialize the Text properties pane.
     *
     * @param {DocumentEditorContainer} container DocumentEditorContainer instance.
     * @param {string} id Identifier element reference.
     * @param {boolean} isTableProperties Specified if text properties is inside the text properties.
     * @param {boolean} isRtl Specifies the RTL layout.
     */
    public constructor(container: DocumentEditorContainer, id: string, isTableProperties: boolean, isRtl?: boolean) {
        this.container = container;
        this.text = new Text(container, isRtl);
        this.paragraph = new Paragraph(container);
        this.initializeTextProperties(id, isTableProperties, isRtl);
        this.wireEvents();
    }

    public enableDisableElements(enable: boolean): void {
        if (enable) {
            classList(this.element, [], ['e-de-overlay']);
        } else {
            classList(this.element, ['e-de-overlay'], []);
        }
    }
    public updateStyles(): void {
        this.paragraph.updateStyleNames();
    }
    public get appliedHighlightColor(): string {
        return this.text.appliedHighlightColor;
    }
    public set appliedHighlightColor(value: string) {
        this.text.appliedHighlightColor = value;
    }
    public get appliedBulletStyle(): string {
        return this.paragraph.appliedBulletStyle;
    }
    public set appliedBulletStyle(value: string) {
        this.paragraph.appliedBulletStyle = value;
    }
    public get appliedNumberingStyle(): string {
        return this.paragraph.appliedNumberingStyle;
    }
    public set appliedNumberingStyle(value: string) {
        this.paragraph.appliedNumberingStyle = value;
    }
    public showTextProperties(isShow: boolean): void {
        if (isShow) {
            this.onSelectionChange();
        }
        if (!isShow && this.element.style.display === 'none' || (isShow && this.element.style.display === 'block')) {
            return;
        }
        this.element.style.display = isShow ? 'block' : 'none';
        this.documentEditor.resize();
    }
    private initializeTextProperties(id: string, isTableProperties: boolean, isRtl?: boolean): void {
        this.element = createElement('div', { id: id + 'id_' + this.generateUniqueID(), className: 'e-de-prop-pane' });
        this.text.initializeTextPropertiesDiv(this.element, isRtl);
        this.paragraph.initializeParagraphPropertiesDiv(this.element, isRtl);
        this.paragraph.updateStyleNames();
        if (!isTableProperties) {
            this.container.propertiesPaneContainer.appendChild(this.element);
        }
    }
    private generateUniqueID(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    public wireEvents(): void {
        this.text.wireEvent();
        this.paragraph.wireEvent();
    }
    public onSelectionChange(): void {
        this.text.onSelectionChange();
        this.paragraph.onSelectionChange();
    }
    public destroy(): void {
        if (this.text) {
            this.text.destroy();
            this.text = undefined;
        }
        if (this.paragraph) {
            this.paragraph.destroy();
            this.paragraph = undefined;
        }
    }
}


