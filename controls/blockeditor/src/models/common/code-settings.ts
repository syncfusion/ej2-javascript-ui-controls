import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Configuration for a code block's language, used for syntax highlighting.
 */
export interface CodeLanguageModel {

    /**
     * Specifies the language value used for syntax highlighting.
     * For example, 'javascript', 'python', 'html', etc.
     *
     * @default ''
     */
    language?: string;

    /**
     * Specifies the label to display in the language selector dropdown.
     * This is typically a user-friendly name corresponding to the language.
     *
     * @default ''
     */
    label?: string;

}

/**
 * Configures settings related to code block in the editor.
 */
export class CodeBlockSettings extends ChildProperty<CodeBlockSettings> {

    /**
     * Specifies the languages available for syntax highlighting.
     * This is an array of objects, each containing a language value and a label.
     *
     * @default []
     */
    @Property([])
    public languages: CodeLanguageModel[];

    /**
     * Specifies the default language to use for syntax highlighting.
     * This is the language that will be selected by default in the language selector dropdown.
     *
     * @default 'plaintext'
     */
    @Property('plaintext')
    public defaultLanguage: string;
}
