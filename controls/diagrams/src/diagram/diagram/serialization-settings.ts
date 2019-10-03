import { ChildProperty, Property } from '@syncfusion/ej2-base';


/** 
 * Defines the serialization settings of diagram
 * ```html
 * <div id='diagram'></div>
 * ```
 * ```typescript
 * let diagram: Diagram = new Diagram({
 * ...
 * serializationSettings: { preventDefaults: true },
 * ...
 * });
 * diagram.appendTo('#diagram');
 * ```

 */
export class SerializationSettings extends ChildProperty<SerializationSettings> {

    /**
     * Enables or Disables serialization of default values.

     */
    @Property(false)
    public preventDefaults: boolean;
}