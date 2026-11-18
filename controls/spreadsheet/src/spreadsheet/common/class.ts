import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { SelectionMode } from '../common/index';

/**
 * Represents the scroll settings.
 */
export class ScrollSettings extends ChildProperty<ScrollSettings> {
    /**
     * By default, the scroll mode is infinite. Set it to `true` to make it as finite.
     *
     * @default false
     */
    @Property(false)
    public isFinite: boolean;

    /**
     * If `enableVirtualization` is set to true, then the spreadsheet will render only the rows and columns visible within the view-port
     * and load subsequent rows and columns based on scrolling.
     *
     * @default true
     */
    @Property(true)
    public enableVirtualization: boolean;
}

/**
 * Represents the selection settings.
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {
    /**
     * Specifies the selection mode. The possible values are
     *
     * * `None`: It disables UI selection.
     * * `Single`: It allows single selection of cell / row / column and disables multiple selection.
     * * `Multiple`: It allows single / multiple selection of cell / row / column.
     *
     * @default 'Multiple'
     */
    @Property('Multiple')
    public mode: SelectionMode;
}

/**
 * Represents the AI assist settings.
 */
export class AIAssistSettings extends ChildProperty<AIAssistSettings> {
    /**
     * Specifies the service endpoint URL where the Spreadsheet AI assist sends chat requests and receives responses.
     *
     * @default null
     */
    @Property(null)
    public requestUrl: string;

    /**
     * Specifies the placeholder text displayed in the AI assist chat input box.
     *
     * @default null
     */
    @Property(null)
    public placeholder: string;

    /**
     * Specifies a list of sample prompts displayed in the AI assist chat to help users initiate a conversation.
     *
     * @default null
     */
    @Property(null)
    public promptSuggestions: string[];
}
