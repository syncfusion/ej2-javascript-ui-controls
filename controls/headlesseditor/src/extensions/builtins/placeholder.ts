import { defineExtension } from '../define-extension';
import { ExtensionDefinition, ExtensionOptions, ExtensionScope, ContributorPayload } from '../types';
import { createPlaceholderPlugin } from '../../pm/plugins';

export interface PlaceholderContext {
    nodeType: string;
}

export interface PlaceholderOptions extends ExtensionOptions {
    placeholder?: string | ((context: PlaceholderContext) => string);
    emptyNodeClass?: string | ((context: PlaceholderContext) => string);
    emptyEditorClass?: string;
    dataAttribute?: string;
    showOnlyCurrent?: boolean;
    showOnlyWhenEditable?: boolean;
    includeChildren?: boolean;
    showOnlyWhenEditorEmpty?: boolean;
}

export const placeholderExtension: ExtensionDefinition<PlaceholderOptions> = defineExtension({
    name: 'placeholder',
    defineOptions(): PlaceholderOptions {
        return {
            placeholder: 'Write something...',
            emptyNodeClass: 'e-placeholder-is-empty',
            emptyEditorClass: 'e-placeholder-is-editor-empty',
            dataAttribute: 'data-placeholder',
            showOnlyCurrent: true,
            showOnlyWhenEditable: true,
            includeChildren: true,
            showOnlyWhenEditorEmpty: true
        };
    },

    plugins(this: ExtensionScope<PlaceholderOptions>): readonly ContributorPayload[] {
        return [
            createPlaceholderPlugin({
                placeholder: this.options?.placeholder ?? 'Write something...',
                emptyNodeClass: this.options?.emptyNodeClass ?? 'e-placeholder-is-empty',
                emptyEditorClass: this.options?.emptyEditorClass ?? 'e-placeholder-is-editor-empty',
                dataAttribute: this.options?.dataAttribute ?? 'data-placeholder',
                showOnlyCurrent: this.options?.showOnlyCurrent ?? false,
                showOnlyWhenEditable: this.options?.showOnlyWhenEditable ?? true,
                includeChildren: this.options?.includeChildren ?? true,
                showOnlyWhenEditorEmpty: this.options?.showOnlyWhenEditorEmpty ?? false
            })
        ];
    }
});

export default placeholderExtension;
