import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { BulletListType, NumberListType } from '../../controller/interface';


/**
 * Reusable definition of a numbered (ordered) list style.
 *
 * Mirrors the CSS `list-style-type` value of the same name and is
 * the canonical mapping consumed by the toolbar layer when
 * rendering a "Numbered List" dropdown.
 */
export interface NumberFormatList {
    /** Display label shown in the toolbar dropdown. */
    text: string;
    /** Editor command name dispatched when the entry is selected. */
    command: string;
    /** Stable identifier used by the toolbar renderer. */
    id: string;
    /** Underlying list-style type passed to the headless editor. */
    listType: NumberListType;
}

/**
 * Reusable definition of a bulleted (unordered) list style.
 *
 * Mirrors the CSS `list-style-type` value of the same name and is
 * the canonical mapping consumed by the toolbar layer when
 * rendering a "Bullet List" dropdown.
 */
export interface BulletFormatList {
    /** Display label shown in the toolbar dropdown. */
    text: string;
    /** Editor command name dispatched when the entry is selected. */
    command: string;
    /** Stable identifier used by the toolbar renderer. */
    id: string;
    /** Underlying list-style type passed to the headless editor. */
    listType: BulletListType;
}

export const NumberFormatLists:  NumberFormatList[] = [
    { id: 'NumberDecimal',    text: 'Number',       command: 'setListStyle', listType: 'decimal' },
    { id: 'NumberLowerGreek', text: 'Lower Greek',  command: 'setListStyle', listType: 'lower-greek' },
    { id: 'NumberLowerRoman', text: 'Lower Roman',  command: 'setListStyle', listType: 'lower-roman' },
    { id: 'NumberUpperAlpha', text: 'Upper Alpha',  command: 'setListStyle', listType: 'upper-alpha' },
    { id: 'NumberLowerAlpha', text: 'Lower Alpha',  command: 'setListStyle', listType: 'lower-alpha' },
    { id: 'NumberUpperRoman', text: 'Upper Roman',  command: 'setListStyle', listType: 'upper-roman' }
];

export const BulletFormatLists:  BulletFormatList[] = [
    { id: 'BulletDisc',   text: 'Disc',     command: 'setListStyle', listType: 'disc' },
    { id: 'BulletCircle', text: 'Circle',   command: 'setListStyle', listType: 'circle' },
    { id: 'BulletSquare', text: 'Square',   command: 'setListStyle', listType: 'square' }
];


/**
 * Custom dropdown item.
 */
export interface CustomFormatListItem {
    /**
     * Text displayed in dropdown.
     */
    text: string;

    /**
     * Custom CSS list-style-type value.
     */
    listType: string;
}

export type NumberFormatListItem = NumberListType | CustomFormatListItem;

export type BulletFormatListItem = BulletListType | CustomFormatListItem;

export class ListSettings extends ChildProperty<ListSettings> {
    /**
     * Defines the items displayed in the `NumberFormatList` dropdown.
     *
     * @default NumberFormatLists
     */
    @Property(NumberFormatLists)
    public numberFormatListItems: NumberFormatListItem[];

    /**
     * Defines the items displayed in the `BulletFormatList` dropdown.
     *
     * @default BulletFormatLists
     */
    @Property(BulletFormatLists)
    public bulletFormatListItems: BulletFormatListItem[];

    /**
     * Defines the checkbox marker shape for checklist items.
     * Controls the visual appearance of the checkbox in task lists.
     *
     * @default 'Square'
     */
    @Property('Square')
    public checklistType: 'Circle' | 'Square';
}
