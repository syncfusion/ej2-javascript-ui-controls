import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class Comment
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
 * Represents CodeSettings in the block editor component.
 */
export class CodeSettings extends ChildProperty<CodeSettings>{
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
     * @default 'javascript'
     */
    @Property('javascript')
    public defaultLanguage: string;
}
