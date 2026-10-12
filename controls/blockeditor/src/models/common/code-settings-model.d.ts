import { ChildProperty, Property } from '@syncfusion/ej2-base';
import {CodeLanguageModel} from "./code-settings";

/**
 * Interface for a class CodeBlockSettings
 */
export interface CodeBlockSettingsModel {

    /**
     * Specifies the languages available for syntax highlighting.
     * This is an array of objects, each containing a language value and a label.
     *
     * @default []
     */
    languages?: CodeLanguageModel[];

    /**
     * Specifies the default language to use for syntax highlighting.
     * This is the language that will be selected by default in the language selector dropdown.
     *
     * @default 'plaintext'
     */
    defaultLanguage?: string;

}