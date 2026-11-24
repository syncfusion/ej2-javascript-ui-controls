import { ChildProperty, Collection, Complex, Property } from '@syncfusion/ej2-base';
import { Grid } from '../base/grid';
import { StatusBarItemConfigModel, StatusBarPanelParamsModel } from './status-bar-settings-model';

/** Defines the supported Status Bar panel kinds. */
export type StatusBarPanelType = 'TotalRowCount' | 'FilteredRowCount' | 'TotalAndFilteredRowCount' |
'SelectedRowCount' | 'SelectedCellAggregates' | 'Custom';

/** Defines a Status Bar panel's zone. */
export type StatusBarPosition = 'Left' | 'Center' | 'Right';

/** Supplies a built-in panel's numeric value to its text formatter. */
export interface StatusBarValueFormatterParams {
    /** Numeric or count value. */
    value: number;
    /** Panel kind being formatted. */
    panelType: StatusBarPanelType;
    /** Active Grid locale. */
    locale: string;
    /** Owning Grid. */
    grid: Grid;
}

/** Supplies the current Grid State to a custom template. */
export interface StatusBarContext {
    /** Owning Grid. */
    grid: Grid;
    /** Total data-record count. */
    totalCount: number;
    /** All-pages filtered data-record count. */
    filteredCount: number;
    /** Selected record count. */
    selectedCount: number;
    /** Retained selected-cell data. */
    selectedCellData: Object[];
}

/** Configures a panel's formatting and custom content. */
export class StatusBarPanelParams extends ChildProperty<StatusBarPanelParams> {
    /**
     * Defines the panel label.
     *
     * @default null
     */
    @Property(null)
    public label: string;

    /**
     * Formats numeric values as text.
     *
     * @default null
     */
    @Property(null)
    public valueFormatter: (params: StatusBarValueFormatterParams) => string;

    /**
     * Defines the aggregate functions displayed by a selected-cell aggregate panel.
     *
     * @default null
     */
    @Property(null)
    public aggregateFunctions: Array<'Count' | 'Sum' | 'Min' | 'Max' | 'Avg'>;

    /**
     * Defines a trusted application template or rendering function.
     *
     * @default null
     */
    @Property(null)
    public template: string | ((context: StatusBarContext) => string | HTMLElement | Promise<string | HTMLElement>);

    /**
     * Defines custom template data.
     *
     * @default null
     */
    @Property(null)
    public data: Object;
}

/** Configures a keyed Status Bar panel. */
export class StatusBarItemConfig extends ChildProperty<StatusBarItemConfig> {
    /**
     * Defines the panel kind.
     *
     * @default null
     */
    @Property(null)
    public type: StatusBarPanelType;

    /**
     * Defines the panel zone.
     *
     * @default 'Right'
     */
    @Property('Right')
    public position: StatusBarPosition;

    /**
     * Defines a nonempty unique key. Missing keys are omitted; the first duplicate wins.
     *
     * @default null
     */
    @Property(null)
    public key: string;

    /**
     * Configures panel formatting and custom content.
     *
     * @default {}
     */
    @Complex<StatusBarPanelParamsModel>({}, StatusBarPanelParams)
    public statusPanelParams: StatusBarPanelParamsModel;
}

/** Configures the Grid Status Bar. */
export class StatusBarSettings extends ChildProperty<StatusBarSettings> {
    /**
     * Defines panels in display order within each zone.
     *
     * @default []
     */
    @Collection<StatusBarItemConfigModel>([], StatusBarItemConfig)
    public items: StatusBarItemConfigModel[];
}
