import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Defines labels for task, this will be placed right, left and inner side of taskbar.
 */
export class LabelSettings extends ChildProperty<LabelSettings> {
    /**
     * Defines right side label of task.
     * @default null
     */
    @Property(null)
    public rightLabel: string;

    /**
     * Defines left side label of task.
     * @default null
     */
    @Property(null)
    public leftLabel: string;

    /**
     * Defines label which is placed inside the taskbar.
     * @default null
     */
    @Property(null)
    public taskLabel: string;
}