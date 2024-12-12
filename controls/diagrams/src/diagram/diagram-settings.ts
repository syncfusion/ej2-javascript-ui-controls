import { ChildProperty, Property } from '@syncfusion/ej2-base';


/**
 * Represents the diagram settings
 * ```html
 * <div id='diagram'></div>
 * ```
 * ```typescript
 * let diagram: Diagram = new Diagram({
 * ...
 * diagramSettings: { inversedAlignment: true },
 * ...
 * });
 * diagram.appendTo('#diagram');
 * ```
 *
 * @default {}
 */
export class DiagramSettings extends ChildProperty<DiagramSettings> {

    /**
     * Defines the horizontal and vertical orientation behavior of nodes, ports, annotations, and more.
     *
     * @default true
     */
    @Property(true)
    public inversedAlignment: boolean;
}
