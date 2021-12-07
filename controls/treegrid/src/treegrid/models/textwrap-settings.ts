import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { WrapMode } from '../enum';

/**
 * Configures the textwrap behavior of the TreeGrid.
 */
export class TextWrapSettings extends ChildProperty<TextWrapSettings> {
    /**
     * Defines the `wrapMode` of the TreeGrid. The available modes are:
     * * `Both`: Wraps both the header and content.
     * * `Content`: Wraps the header alone.
     * * `Header`: Wraps the content alone.
     *
     * @default Both
     */
    @Property('Both')
    public wrapMode: WrapMode;

}
