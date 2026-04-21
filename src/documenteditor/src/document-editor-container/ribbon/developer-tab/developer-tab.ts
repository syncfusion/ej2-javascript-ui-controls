import { DocumentEditorContainer } from '../../document-editor-container';
import { RibbonTabModel } from '@syncfusion/ej2-ribbon';
import { DocumentEditor } from '../../../document-editor';
import { FormFieldsGroup } from './form-fields-group';
import { ControlGroup } from './control-group';
import { MappingGroup } from './mapping-group';
import { ProtectGroup } from './protect-group';

/**
 * Constants for tab identification
 */
export const DEVELOPER_TAB_ID: string = '_developer_tab';

/**
 * DeveloperTab module
 * @private
 */
export class DeveloperTab {
    private container: DocumentEditorContainer;
    private ribbonId: string;
    // Group instances
    private formFieldsGroup: FormFieldsGroup;
    private controlGroup: ControlGroup;
    private mappingGroup: MappingGroup;
    private protectGroup: ProtectGroup;

    /**
     * Constructor for DeveloperTab class
     * @param {DocumentEditorContainer} container - DocumentEditorContainer instance
     */
    public constructor(container: DocumentEditorContainer) {
        this.container = container;
        this.ribbonId = this.container.element.id + '_ribbon';

        // Initialize group instances
        this.formFieldsGroup = new FormFieldsGroup(container);
        this.controlGroup = new ControlGroup(container);
        this.mappingGroup = new MappingGroup(container);
        this.protectGroup = new ProtectGroup(container);
    }

    /**
     * Get the DocumentEditor instance
     * @returns {DocumentEditor} The DocumentEditor instance
     */
    private get documentEditor(): DocumentEditor {
        return this.container.documentEditor;
    }

    /**
     * Get the Developer tab configuration
     * @returns {RibbonTabModel} The Developer tab model
     */
    public getDeveloperTab(): RibbonTabModel {
        return {
            id: this.ribbonId + DEVELOPER_TAB_ID,
            keyTip: 'D',
            header: this.container.localObj.getConstant('Developer'),
            groups: [
                this.formFieldsGroup.getGroupModel(),
                this.controlGroup.getGroupModel(),
                this.mappingGroup.getGroupModel(),
                this.protectGroup.getGroupModel()
            ]
        };
    }

    /**
     * Update UI when selection changes in the document
     * @returns {void}
     * @private
     */
    public updateDeveloperTabOnSelectionChange(): void {
        // Update all groups based on current selection
        this.formFieldsGroup.updateSelection();
        this.controlGroup.updateSelection();
        this.mappingGroup.updateSelection();
        this.protectGroup.updateSelection();
    }


    /**
     * Destroy the DeveloperTab instance
     * @returns {void}
     */
    public destroy(): void {
        // Clean up group resources
        if (this.formFieldsGroup.destroy) {
            this.formFieldsGroup.destroy();
        }
        if (this.controlGroup.destroy) {
            this.controlGroup.destroy();
        }
        if (this.mappingGroup.destroy) {
            this.mappingGroup.destroy();
        }
        if (this.protectGroup.destroy) {
            this.protectGroup.destroy();
        }

        // Clear references
        this.formFieldsGroup = undefined;
        this.controlGroup = undefined;
        this.mappingGroup = undefined;
        this.protectGroup = undefined;
    }
}
