import { merge, isNullOrUndefined, extend, Property } from '@syncfusion/ej2-base';
import { NumberFormatOptions, DateFormatOptions } from '@syncfusion/ej2-base';
import { DataManager, Query, DataUtil } from '@syncfusion/ej2-data';
import { ICellFormatter, IFilterUI, IEditCell, CommandModel, IFilter, CommandButtonOptions, DataResult, IGrid } from '../base/interface';
import { TextAlign, ClipMode, Action, SortDirection, CommandButtonType, freezeDirection, freezeTable, EditType } from '../base/enum';
import { PredicateModel } from '../base/grid-model';
import { ValueFormatter } from '../services/value-formatter';
import { ValueAccessor, SortComparer, HeaderValueAccessor } from '../base/type';
import { getUid, templateCompiler, getForeignData, getObject } from '../base/util';
import { DropDownListModel } from '@syncfusion/ej2-dropdowns';

/**
 * Represents Grid `Column` model class.
 */
export class Column {
    /**
     * Defines the field name of column which is mapped with mapping name of DataSource.
     * The bounded columns can be sort, filter and group etc.,
     * The `field` name must be a valid JavaScript identifier,
     * the first character must be an alphabet and should not contain spaces and special characters.
     *
     * @default ''
     */
    public field: string;

    /**
     * Gets the unique identifier value of the column. It is used to get the column object.
     *
     * @default ''
     */

    public uid: string;

    /**
     * Gets the unique identifier value of the column. It is used to get the column object.
     *
     * @default null
     */
    public index: number;

    /**
     * Defines the header text of column which is used to display in column header.
     * If `headerText` is not defined, then field name value will be assigned to header text.
     *
     * @default null
     */
    public headerText: string;

    /**
     * Defines the width of the column in pixels or percentage.
     *
     * @default ''
     */
    public width: string | number;

    /**
     * Defines the minimum Width of the column in pixels or percentage.
     *
     * @default ''
     */
    public minWidth: string | number;

    /**
     * Defines the maximum width of the column in pixel or percentage, which will restrict resizing beyond this pixel or percentage.
     *
     * @default ''
     */
    public maxWidth: string | number;

    /**
     * Defines the alignment of the column in both header and content cells.
     *
     * @default Left
     */
    public textAlign: TextAlign;

    /**
     * Defines the cell content's overflow mode. The available modes are
     * * `Clip` -  Truncates the cell content when it overflows its area.
     * * `Ellipsis` -  Displays ellipsis when the cell content overflows its area.
     * * `EllipsisWithTooltip` - Displays ellipsis when the cell content overflows its area
     * also it will display tooltip while hover on ellipsis applied cell.
     *
     * @default Ellipsis
     */
    public clipMode: ClipMode;

    /**
     * Define the alignment of column header which is used to align the text of column header.
     *
     * @default null
     */
    public headerTextAlign: TextAlign;

    /**
     * If `disableHtmlEncode` is set to true, it encodes the HTML of the header and content cells.
     *
     * @default true
     */
    public disableHtmlEncode: boolean = true;

    /**
     * Defines the data type of the column.
     *
     * @default null
     */
    public type: string;

    /**
     * It is used to change display value with the given format and does not affect the original data.
     * Gets the format from the user which can be standard or custom
     * `number` and `date` formats.
     *
     * @default null
     * @aspType string
     */
    public format: string | NumberFormatOptions | DateFormatOptions;

    /**
     * If `visible` is set to false, hides the particular column. By default, columns are displayed.
     *
     * @default true
     */
    public visible: boolean;

    /**
     * Allows grid to perform row spanning on the specified column.
     *
     * @default true
     */
    public enableRowSpan: boolean = true;

    /**
     * Allows grid to perform column spanning on the specified column.
     *
     * @default true
     */
    public enableColumnSpan: boolean = true;

    /**
     * Defines the column template that renders customized element in each cell of the column.
     * It accepts either [template string](https://ej2.syncfusion.com/documentation/common/template-engine/) or HTML element ID.
     *
     * @default null
     * @aspType string
     */
    public template: string | Function;

    /**
     * Defines the header template as string or HTML element ID which is used to add customized element in the column header.
     *
     * @default null
     * @aspType string
     */
    public headerTemplate: string | Function;

    /**
     * You can use this property to freeze selected columns in grid
     *
     * @default false
     */
    public isFrozen: boolean;

    /**
     * If `allowSorting` set to false, then it disables sorting option of a particular column.
     * By default all columns are sortable.
     *
     * @default true
     */
    public allowSorting: boolean = true;

    /**
     * If `allowResizing` is set to false, it disables resize option of a particular column.
     * By default all the columns can be resized.
     *
     * @default true
     */
    public allowResizing: boolean = true;

    /**
     * If `allowFiltering` set to false, then it disables filtering option and filter bar element of a particular column.
     * By default all columns are filterable.
     *
     * @default true
     */
    public allowFiltering: boolean = true;

    /**
     * If `allowGrouping` set to false, then it disables grouping of a particular column.
     * By default all columns are groupable.
     *
     * @default true
     */
    public allowGrouping: boolean = true;


    /**
     * If `allowReordering` set to false, then it disables reorder of a particular column.
     * By default all columns can be reorder.
     *
     * @default true
     */
    public allowReordering: boolean = true;

    /**
     * If `showColumnMenu` set to false, then it disable the column menu of a particular column.
     * By default column menu will show for all columns
     *
     * @default true
     */
    public showColumnMenu: boolean = true;

    /**
     * If `enableGroupByFormat` set to true, then it groups the particular column by formatted values.
     *
     * @default true
     */
    public enableGroupByFormat: boolean = false;

    /**
     * If `allowEditing` set to false, then it disables editing of a particular column.
     * By default all columns are editable.
     *
     * @default true
     */
    public allowEditing: boolean = true;

    /**
     * The CSS styles and attributes of the content cells of a particular column can be customized.
     *
     * {% codeBlock src="grid/custom-attribute-api/index.ts" %}{% endcodeBlock %}
     *
     * @default null
     */
    public customAttributes: { [x: string]: Object };

    /**
     * If `displayAsCheckBox` is set to true, it displays the column value as a check box instead of Boolean value.
     *
     * @default false
     */
    public displayAsCheckBox: boolean;

    /**
     * Defines the column data source which will act as foreign data source.
     *
     * @default null
     */
    public dataSource: Object[] | DataManager | DataResult;

    /**
     * Defines the method which is used to achieve custom formatting from an external function.
     * This function triggers before rendering of each cell.
     * {% codeBlock src="grid/formatter-api/index.ts" %}{% endcodeBlock %}
     *
     * @default null
     */
    public formatter: { new(): ICellFormatter } | ICellFormatter | Function;

    /**
     * Defines the method used to apply custom cell values from external function and display this on each cell rendered.
     *
     * {% codeBlock src="grid/value-accessor-api/index.ts" %}{% endcodeBlock %}
     *
     * @default null
     */
    public valueAccessor: ValueAccessor | string;

    /**
     * Defines the method used to apply custom header cell values from external function and display this on each header cell rendered.
     *
     * @default null
     */
    public headerValueAccessor: HeaderValueAccessor | string;

    /**
     * The `filterBarTemplate` is used to add a custom component instead of default input component for filter bar.
     * It have create and read functions.
     * * create: It is used for creating custom components.
     * * read: It is used to perform custom filter action.
     *
     * {% codeBlock src="grid/filter-template-api/index.ts" %}{% endcodeBlock %}
     *
     * @default null
     */
    public filterBarTemplate: IFilterUI;

    /**
     *  It is used to customize the default filter options for a specific columns.
     * * type -  Specifies the filter type as menu or checkbox.
     * * ui - to render custom component for specific column it has following functions.
     * * ui.create – It is used for creating custom components.
     * * ui.read -  It is used for read the value from the component.
     * * ui.write - It is used to apply component model as dynamically.
     * {% codeBlock src="grid/filter-menu-api/index.ts" %}{% endcodeBlock %}
     *
     * > Check the [`Filter UI`](../../grid/filtering/filter-menu/#custom-component-in-filter-menu) for its customization.
     *
     *  @default {}
     */

    public filter: IFilter = {};

    /**
     * Used to render multiple header rows(stacked headers) on the Grid header.
     *
     * @default null
     */

    public columns: Column[] | string[] | ColumnModel[];

    /**
     * Defines the tool tip text for stacked headers.
     *
     * @default null
     * @hidden
     */
    public toolTip: string;

    /**
     * If `isPrimaryKey` is set to true, considers this column as the primary key constraint.
     *
     * @default false
     */
    public isPrimaryKey: boolean;

    /**
     * Column visibility can change based on [`Media Queries`](http://cssmediaqueries.com/what-are-css-media-queries.html).
     * `hideAtMedia` accepts only valid Media Queries.
     *
     * @default ''
     */
    public hideAtMedia?: string;


    /**
     * If `showInColumnChooser` set to false, then hide the particular column in column chooser.
     *  By default all columns are displayed in column Chooser.
     *
     * @default true
     */
    public showInColumnChooser?: boolean = true;

    /**
     * Defines the type of component for editable.
     *
     * @default 'stringedit'
     */
    public editType: EditType | string;

    /**
     * Defines rules to validate data before creating and updating.
     *
     * @default null
     */
    public validationRules: Object;

    /**
     * Defines default values for the component when adding a new record to the Grid.
     *
     * @default null
     * @aspType object
     */
    public defaultValue: string | number | Date | boolean | null;

    /**
     * Defines the `IEditCell` object to customize default edit cell.
     *
     * @default {}
     */
    public edit: IEditCell = {};

    /**
     * If `isIdentity` is set to true, then this column is considered as identity column.
     *
     * @default false
     */
    public isIdentity: boolean;

    /**
     * Defines the display column name from the foreign data source which will be obtained from comparing local and foreign data.
     *
     * @default null
     */
    public foreignKeyValue: string;

    /**
     * Defines the mapping column name of the foreign data source.
     * If it is not defined then the `columns.field` will be considered as mapping column name
     *
     * @default null
     */
    public foreignKeyField: string;

    /**
     * @hidden
     * Defines the commands column template as string or HTML element ID which is used to add
     * customized command buttons in each cells of the column.
     *
     * @aspType string
     */
    public commandsTemplate: string | Function;

    /**
     * `commands` provides an option to display command buttons in every cell.
     * The available built-in command buttons are
     * * Edit - Edit the record.
     * * Delete - Delete the record.
     * * Save - Save the record.
     * * Cancel - Cancel the edit state.
     * {% codeBlock src="grid/command-column-api/index.ts" %}{% endcodeBlock %}
     *
     * @default null
     */
    public commands: CommandModel[];


    /**
     * @hidden
     * Gets the current view foreign key data.
     *
     * @default []
     */
    public columnData: Object[];

    /**
     * Defines the cell edit template that used as editor for a particular column.
     * It accepts either template string or HTML element ID.
     *
     * @default null
     * @aspType string
     */
    public editTemplate: string | Function;

    /**
     * Defines the filter template/UI that used as filter for a particular column.
     * It accepts either template string or HTML element ID.
     *
     * @default null
     * @aspType string
     */
    public filterTemplate: string | Function;
    /** @hidden */
    public toJSON: Function;

    /**
     * Defines the mapping column name of the foreign data source.
     * If it is not defined then the `columns.field` will be considered as mapping column name
     *
     * @default false
     */
    public lockColumn: boolean;

    /**
     * If `allowSearching` set to false, then it disables Searching of a particular column.
     * By default all columns allow Searching.
     *
     * @default true
     */
    public allowSearching: boolean = true;

    /**
     * If `autoFit` set to true, then the particular column content width will be
     * adjusted based on its content in the initial rendering itself.
     * Setting this property as true is equivalent to calling `autoFitColumns` method in the `dataBound` event.
     *
     * @default false
     */
    public autoFit: boolean = false;

    /**
     * defines which side the column need to freeze
     * The available built-in freeze directions are
     * * Left - Freeze the column at left side.
     * * Right - Freeze the column at right side.
     * * Fixed - Freeze the column at Center.
     * * None - Does not freeze the column.
     *
     * @default None
     */
    public freeze: freezeDirection;

    private parent: IGrid;
    /**
     * @hidden
     * Sets the selected state.
     * @default false
     */
    public isSelected: boolean;

    constructor(options: ColumnModel, parent?: IGrid) {
        merge(this, options);
        this.parent = parent;
        if (this.type === 'none') {
            this.type = null;
        } else if (this.type) {
            this.type = typeof(this.type) === 'string' ? this.type.toLowerCase() : undefined;
        }
        if (this.editType) {
            this.editType = this.editType.toLowerCase();
        }
        if (isNullOrUndefined(this.uid)) {
            this.uid = getUid('grid-column');
        }
        const valueFormatter: ValueFormatter = new ValueFormatter();
        if (options.format && ((<DateFormatOptions>options.format).skeleton || ((<DateFormatOptions>options.format).format &&
            typeof (<DateFormatOptions>options.format).format === 'string'))) {
            this.setFormatter(valueFormatter.getFormatFunction(extend({}, options.format as DateFormatOptions)));
            this.setParser(valueFormatter.getParserFunction(options.format as DateFormatOptions));
        }
        this.toJSON = () => {
            const col: object = {};
            const skip: string[] = ['filter', 'dataSource', 'headerText', 'template', 'headerTemplate', 'edit',
                'editTemplate', 'filterTemplate', 'commandsTemplate', 'parent'];
            const keys : string[] = Object.keys(this);
            for (let i: number = 0; i < keys.length; i++) {
                if (keys[parseInt(i.toString(), 10)] === 'columns') {
                    col[keys[parseInt(i.toString(), 10)]] = [];
                    for (let j: number = 0; j < this[keys[parseInt(i.toString(), 10)]].length; j++) {
                        col[keys[parseInt(i.toString(), 10)]].push(
                            this[keys[parseInt(i.toString(), 10)]][parseInt(j.toString(), 10)].toJSON());
                    }
                } else if (skip.indexOf(keys[parseInt(i.toString(), 10)]) < 0) {
                    col[keys[parseInt(i.toString(), 10)]] = this[keys[parseInt(i.toString(), 10)]];
                }
            }
            return col;
        };
        if (!this.field) {
            this.allowFiltering = false;
            this.allowGrouping = false;
            this.allowSorting = false;
            this.enableColumnSpan = false;
            this.enableRowSpan = false;
            if (this.columns) {
                this.allowResizing = (this.columns as Column[]).some((col: Column) => {
                    return col.allowResizing;
                });
            }
        }
        if (this.commands && !this.textAlign) {
            this.textAlign = 'Right';
        }
        if (this.template || this.commandsTemplate) {
            this.templateFn = templateCompiler(this.template || this.commandsTemplate);
        }
        if (this.headerTemplate) {
            this.headerTemplateFn = templateCompiler(this.headerTemplate);
        }
        if (!isNullOrUndefined(this.filter) && this.filter.itemTemplate) {
            this.fltrTemplateFn = templateCompiler(this.filter.itemTemplate);
        }
        if (this.editTemplate) {
            this.editTemplateFn = templateCompiler(this.editTemplate);
        }
        if (this.filterTemplate) {
            this.filterTemplateFn = templateCompiler(this.filterTemplate);
        }

        if (this.isForeignColumn() &&
            (isNullOrUndefined(this.editType) || this.editType === 'dropdownedit' || this.editType === 'defaultedit')) {
            this.editType = 'dropdownedit';
            if (this.edit.params && (this.edit.params as DropDownListModel).dataSource) {
                (<{ ddEditedData?: boolean }>this.edit.params).ddEditedData = true;
            }
            this.edit.params = extend({
                dataSource: <DataManager>this.dataSource,
                query: new Query(), fields: { value: this.foreignKeyField || this.field, text: this.foreignKeyValue }
            },                        this.edit.params);
        }

        if (this.sortComparer) {
            let a: Function = this.sortComparer as Function;
            this.sortComparer = (x: number | string, y: number | string, xObj?: Object, yObj?: Object) => {
                if (typeof a === 'string') {
                    a = getObject(a, window);
                }
                if (this.sortDirection === 'Descending') {
                    const z: number | string = x;
                    x = y;
                    y = z;
                    const obj: Object = xObj;
                    xObj = yObj;
                    yObj = obj;
                }
                return a(x, y, xObj, yObj);
            };
        }

        if (!this.sortComparer && this.isForeignColumn()) {
            this.sortComparer = (x: number | string, y: number | string) => {
                x = getObject(this.foreignKeyValue, getForeignData(this, {}, <string>x)[0]);
                y = getObject(this.foreignKeyValue, getForeignData(this, {}, <string>y)[0]);
                return this.sortDirection === 'Descending' ? DataUtil.fnDescending(x, y) : DataUtil.fnAscending(x, y);
            };
        }
    }

    private formatFn: Function;
    private parserFn: Function;
    private templateFn: Function;
    private fltrTemplateFn: Function;
    private headerTemplateFn: Function;
    private editTemplateFn: Function;
    private filterTemplateFn: Function;
    private sortDirection: string = 'Descending';
    /** @hidden */
    public freezeTable: freezeTable;

    /**
     * @returns {Function} returns the edit template
     * @hidden */
    public getEditTemplate: Function = () => this.editTemplateFn;

    /**
     * @returns {Function} returns the filter template
     * @hidden */
    public getFilterTemplate: Function = () => this.filterTemplateFn;

    /**
     * @returns {string} returns the sort direction
     * @hidden */
    public getSortDirection(): string {
        return this.sortDirection;
    }

    /**
     * @param {string} direction - specifies the direction
     * @returns {void}
     * @hidden
     */
    public setSortDirection(direction: string): void {
        this.sortDirection = direction;
    }

    /**
     * @returns {freezeTable} returns the FreezeTable
     * @hidden */
    public getFreezeTableName(): freezeTable {
        return this.freezeTable;
    }

    /**
     * @param {Column} column - specifies the column
     * @returns {void}
     * @hidden
     */
    public setProperties(column: Column): void {
        //Angular two way binding
        const keys: string[] = Object.keys(column);
        for (let i: number = 0; i < keys.length; i++) {
            if (keys[parseInt(i.toString(), 10)] === 'columns') {
                const cols: Column[] = column[keys[parseInt(i.toString(), 10)]];
                for (let j: number = 0; j < cols.length; j++) {
                    ((this.columns as Column[]).find((col: Column) => { return col.field === cols[parseInt(j.toString(), 10)]
                        .field; }) as Column).setProperties(cols[parseInt(j.toString(), 10)]);
                }
            } else {
                this[keys[parseInt(i.toString(), 10)]] = column[keys[parseInt(i.toString(), 10)]];
            }
            //Refresh the react columnTemplates on state change
            if (this.parent && this.parent.isReact) {
                if (keys[parseInt(i.toString(), 10)] === 'template') {
                    this.templateFn = templateCompiler(column[keys[parseInt(i.toString(), 10)]]);
                    this.parent.refreshReactColumnTemplateByUid(this.uid, true);
                } else if (keys[parseInt(i.toString(), 10)] === 'headerTemplate') {
                    this.headerTemplateFn = templateCompiler(column[keys[parseInt(i.toString(), 10)]]);
                    this.parent.refreshReactHeaderTemplateByUid(this.uid);
                } else if (keys[parseInt(i.toString(), 10)] === 'editTemplate') {
                    this.editTemplateFn = templateCompiler(column[keys[parseInt(i.toString(), 10)]]);
                } else if (keys[parseInt(i.toString(), 10)] === 'filterTemplate') {
                    this.filterTemplateFn = templateCompiler(column[keys[parseInt(i.toString(), 10)]]);
                } else if (keys[parseInt(i.toString(), 10)] === 'commandsTemplate') {
                    this.templateFn = templateCompiler(column[keys[parseInt(i.toString(), 10)]]);
                }
            }
        }
    }

    /**
     * Defines the custom sort comparer function.
     * The sort comparer function has the same functionality like
     * [`Array.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) sort comparer.
     * {% codeBlock src="grid/sort-comparer-api/index.ts" %}{% endcodeBlock %}
     */
    public sortComparer: SortComparer | string;

    /**
     * @returns {boolean} returns true for foreign column
     * @hidden
     * It defines the column is foreign key column or not.
     */
    public isForeignColumn(): boolean {
        return !!(this.dataSource && this.foreignKeyValue);
    }

    /**
     * @returns {Function} returns the function
     * @hidden
     */
    public getFormatter(): Function {
        return this.formatFn;
    }
    /**
     * @param {Function} value - specifies the value
     * @returns {void}
     * @hidden
     */
    public setFormatter(value: Function): void {
        this.formatFn = value;
    }
    /**
     * @returns {Function} returns the function
     * @hidden */
    public getParser(): Function {
        return this.parserFn;
    }
    /**
     * @param {Function} value - specifies the value
     * @returns {void}
     * @hidden
     */
    public setParser(value: Function): void {
        this.parserFn = value;
    }
    /**
     * @returns {Function} returns the function
     * @hidden */
    public getColumnTemplate(): Function {
        return this.templateFn;
    }
    /**
     * @returns {Function} returns the function
     * @hidden */
    public getHeaderTemplate(): Function {
        return this.headerTemplateFn;
    }
    /**
     * @returns {Function} returns the function
     * @hidden */
    public getFilterItemTemplate(): Function {
        return this.fltrTemplateFn;
    }
    /**
     * @returns {string} returns the string
     * @hidden */
    public getDomSetter(): string {
        return this.disableHtmlEncode ? 'textContent' : 'innerHTML';
    }
    /**
     * Determines the behavior of the `aria-label` attribute for cells in template columns.
     * If enableAriaLabel is set to false, the aria-label attribute is not applied to template column cells, which affects screen reader accessibility.
     *
     * @default {}
     */
    public templateOptions: TemplateProps = { enableAriaLabel: true };
}

/**
 * Interface for a class Column
 */
export interface ColumnModel {

    /**
     * Defines the field name of column which is mapped with mapping name of DataSource.
     * The bounded columns can be sort, filter and group etc.,
     * If the `field` name contains “dot”, then it is considered as complex binding.
     * The `field` name must be a valid JavaScript identifier,
     * the first character must be an alphabet and should not contain spaces and special characters.
     *
     * @default ''
     */
    field?: string;

    /**
     * Gets the unique identifier value of the column. It is used to get the object.
     *
     * @default ''
     */
    uid?: string;

    /**
     * Gets the unique identifier value of the column. It is used to get the object.
     *
     * @default null
     */
    index?: number;

    /**
     * Defines the header text of column which is used to display in column header.
     * If `headerText` is not defined, then field name value will be assigned to header text.
     *
     * @default null
     */
    headerText?: string;

    /**
     * Defines the width of the column in pixels or percentage.
     *
     * @default ''
     */
    width?: string | number;

    /**
     * Defines the minimum width of the column in pixels or percentage.
     *
     * @default ''
     */
    minWidth?: string | number;
    /**
     * Defines the maximum width of the column in pixel or percentage, which will restrict resizing beyond this pixel or percentage.
     *
     * @default ''
     */
    maxWidth?: string | number;
    /**
     * Defines the alignment of the column in both header and content cells.
     *
     * @default Left
     */
    textAlign?: TextAlign;

    /**
     * Defines the cell content's overflow mode. The available modes are
     * * `Clip` -  Truncates the cell content when it overflows its area.
     * * `Ellipsis` -  Displays ellipsis when the cell content overflows its area.
     * * `EllipsisWithTooltip` - Displays ellipsis when the cell content overflows its area
     * also it will display tooltip while hover on ellipsis applied cell.
     *
     * @default Ellipsis
     */
    clipMode?: ClipMode;

    /**
     * Define the alignment of column header which is used to align the text of column header.
     *
     * @aspdefaultvalueignore
     * @default null
     */
    headerTextAlign?: TextAlign;

    /**
     * If `disableHtmlEncode` is set to true, it encodes the HTML of the header and content cells.
     *
     * @default true
     */
    disableHtmlEncode?: boolean;

    /**
     * Defines the data type of the column.
     *
     * @default null
     */
    type?: string;

    /**
     * It is used to change display value with the given format and does not affect the original data.
     * Gets the format from the user which can be standard or custom
     * [`number`](../../common/internationalization/#manipulating-numbers)
     * and [`date`](../../common/internationalization/#manipulating-datetime) formats.
     *
     * @default null
     * @aspType string
     */
    format?: string | NumberFormatOptions | DateFormatOptions;

    /**
     * If `visible` is set to false, hides the particular column. By default, all columns are displayed.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Allows grid to perform row spanning on the specified column.
     *
     * @default true
     */
    enableRowSpan?: boolean;

    /**
     * Allows grid to perform column spanning on the specified column.
     *
     * @default true
     */
    enableColumnSpan?: boolean;

    /**
     * Defines the column template that renders customized element in each cell of the column.
     * It accepts either [template string](../../common/template-engine/) or HTML element ID.
     *
     * @default null
     * @aspType string
     */
    template?: string | Function;

    /**
     * Defines the column template as string or HTML element ID which is used to add customized element in the column header.
     *
     * @default null
     * @aspType string
     */
    headerTemplate?: string | Function;

    /**
     * You can use this property to freeze selected columns in grid.
     *
     * @default false
     */
    isFrozen?: boolean;

    /**
     * If `allowSorting` set to false, then it disables sorting option of a particular column.
     * By default all columns are sortable.
     *
     * @default true
     */
    allowSorting?: boolean;

    /**
     * If `allowResizing` set to false, it disables resize option of a particular column.
     *
     * @default true
     */
    allowResizing?: boolean;

    /**
     * If `showColumnMenu` set to false, then it disable the column menu of a particular column.
     * By default column menu will show for all columns
     *
     * @default true
     */
    showColumnMenu?: boolean;

    /**
     * If `allowFiltering` set to false, then it disables filtering option and filter bar element of a particular column.
     * By default all columns are filterable.
     *
     * @default true
     */
    allowFiltering?: boolean;

    /**
     * If `allowGrouping` set to false, then it disables grouping of a particular column.
     * By default all columns are groupable.
     *
     * @default true
     */
    allowGrouping?: boolean;

    /**
     * If `allowReordering` set to false, then it disables reorder of a particular column.
     * By default all columns can be reorder.
     *
     * @default true
     */
    allowReordering?: boolean;

    /**
     * If `enableGroupByFormat` set to true, then it groups the particular column by formatted values.
     * By default no columns are group by format.
     *
     * @default true
     */
    enableGroupByFormat?: boolean;

    /**
     * If `allowEditing` set to false, then it disables editing of a particular column.
     * By default all columns are editable.
     *
     * @default true
     */
    allowEditing?: boolean;

    /**
     * @hidden
     * Gets the current view foreign key data.
     * @default []
     */
    columnData?: Object[];

    /**
     * The CSS styles and attributes of the content cells of a particular column can be customized.
     *
     * ```html
     * <div id="Grid"></div>
     * ```
     * ```typescript
     * let gridObj: Grid = new Grid({
     * dataSource: filterData,
     * columns: [
     *    { field: 'OrderID', headerText: 'Order ID' },
     *    {
     *        field: 'EmployeeID', headerText: 'Employee ID', customAttributes: {
     *           class: 'employeeid',
     *           type: 'employee-id-cell'
     *      }
     *   }]
     * });
     * gridObj.appendTo('#Grid');
     * ```
     *
     * @default null
     */

    customAttributes?: { [x: string]: Object };

    /**
     * If `displayAsCheckBox` is set to true, it displays the column value as a check box instead of Boolean value.
     *
     * @default false
     */
    displayAsCheckBox?: boolean;

    /**
     * Defines the column data source  which will act as foreign data source.
     *
     * @default null
     */
    dataSource?: Object[] | DataManager | DataResult;

    /**
     * Defines the method which is used to achieve custom formatting from an external function.
     * This function triggers before rendering of each cell.
     *
     * ```html
     * <div id="Grid"></div>
     * ```
     * ```typescript
     * class ExtendedFormatter implements ICellFormatter {
     * public getValue(column: Column, data: Object): Object {
     *   return '<span style="color:' + (data['Verified'] ? 'green' : 'red') + '"><i>' + data['Verified'] + '</i><span>';
     * }
     * }
     * let gridObj: Grid = new Grid({
     *     dataSource: filterData,
     *     columns: [
     *         { field: 'ShipName', headerText: 'Ship Name' },
     *         { field: 'Verified', headerText: 'Verified Status', formatter: ExtendedFormatter }]
     * });
     * gridObj.appendTo('#Grid');
     * ```
     *
     * @default null
     */
    formatter?: { new(): ICellFormatter } | ICellFormatter | Function;

    /**
     * Defines the method used to apply custom cell values from external function and display this on each cell rendered.
     *
     * ```html
     * <div id="Grid"></div>
     * ```
     * ```typescript
     * let gridObj: Grid = new Grid({
     * dataSource: [{ EmployeeID: 1, EmployeeName: ['John', 'M'] }, { EmployeeID: 2, EmployeeName: ['Peter', 'A'] }],
     * columns: [
     *     { field: 'EmployeeID', headerText: 'Employee ID' },
     *     { field: 'EmployeeName', headerText: 'Employee First Name',
     *       valueAccessor: (field: string, data: Object, column: Column) => {
     *             return data['EmployeeName'][0];
     *         },
     *     }]
     * });
     * ```
     *
     * @default null
     */
    valueAccessor?: ValueAccessor | string;

    /**
     * Defines the method used to apply custom header cell values from external function and display this on each cell rendered.
     *
     * ```html
     * <div id="Grid"></div>
     * ```
     * ```typescript
     * let gridObj: Grid = new Grid({
     * dataSource: [{ EmployeeID: 1, EmployeeName: ['John', 'M'] }, { EmployeeID: 2, EmployeeName: ['Peter', 'A'] }],
     * columns: [
     *     { field: 'EmployeeID', headerText: 'Employee ID' },
     *     { field: 'EmployeeName', headerText: 'Employee First Name',
     *       headerValueAccessor: (field: string,column: Column) => {
     *             return "newheadername";
     *         },
     *     }]
     * });
     * ```
     *
     * @default null
     */
    headerValueAccessor?: HeaderValueAccessor | string;

    /**
     * The `filterBarTemplate` is used to add a custom component instead of default input component for filter bar.
     * It have create and read functions.
     * * create: It is used for creating custom components.
     * * read: It is used to perform custom filter action.
     *
     * ```html
     * <div id="Grid"></div>
     * ```
     * ```typescript
     * let gridObj: Grid = new Grid({
     * dataSource: filterData,
     * columns: [
     *   { field: 'OrderID', headerText: 'Order ID' },
     *   {
     *      field: 'EmployeeID', filterBarTemplate: {
     *         create: (args: { element: Element, column: Column }) => {
     *              let input: HTMLInputElement = document.createElement('input');
     *              input.id = 'EmployeeID';
     *              input.type = 'text';
     *              return input;
     *         },
     *         write: (args: { element: Element, column: Column }) => {
     *             args.element.addEventListener('input', args.column.filterBarTemplate.read as EventListener);
     *         },
     *         read: (args: { element: HTMLInputElement, columnIndex: number, column: Column }) => {
     *             gridObj.filterByColumn(args.element.id, 'equal', args.element.value);
     *        }
     *     }
     *  }],
     *   allowFiltering: true
     * });
     * gridObj.appendTo('#Grid');
     * ```
     *
     * @default null
     */
    filterBarTemplate?: IFilterUI;

    /**
     *  Defines the filter options to customize filtering for the particular column.
     *
     *  @default {}
     */

    filter?: IFilter;

    /**
     * Used to render multiple header rows(stacked headers) on the Grid header.
     *
     * @default null
     */
    columns?: Column[] | string[] | ColumnModel[];

    /**
     * Defines the tool tip text for stacked headers.
     *
     * @hidden
     * @default null
     */
    toolTip?: string;

    /**
     * If `isPrimaryKey` is set to true, considers this column as the primary key constraint.
     *
     * @default false
     */
    isPrimaryKey?: boolean;

    /**
     * Defines the type of component for editing.
     *
     * @default 'stringedit'
     */
    editType?: string;

    /**
     * `editType`(../../grid/edit/#cell-edit-type-and-its-params) Defines rules to validate data before creating and updating.
     *
     * @default null
     */
    validationRules?: Object;

    /**
     * Defines default values for the component when adding a new record to the Grid.
     *
     * @default null
     * @aspType object
     */
    defaultValue?: string | number | Date | boolean | null;

    /**
     * Defines the `IEditCell`(../../grid/edit/#cell-edit-template) object to customize default edit cell.
     *
     * @default {}
     */
    edit?: IEditCell;

    /**
     * If `isIdentity` is set to true, then this column is considered as identity column.
     *
     * @default false
     */
    isIdentity?: boolean;

    /**
     * Defines the mapping column name of the foreign data source.
     * If it is not defined then the `columns.field` will be considered as mapping column name
     *
     * @default null
     */
    foreignKeyField?: string;

    /**
     * Defines the display column name from the foreign data source which will be obtained from comparing local and foreign data
     *
     * @default null
     */
    foreignKeyValue?: string;

    /**
     * column visibility can change based on its [`Media Queries`](http://cssmediaqueries.com/what-are-css-media-queries.html).
     * `hideAtMedia` accepts only valid Media Queries.
     *
     * @default ''
     */
    hideAtMedia?: string;

    /**
     * If `showInColumnChooser` set to false, then hides the particular column in column chooser.
     * By default all columns are displayed in column Chooser.
     *
     * @default true
     */
    showInColumnChooser?: boolean;

    /**
     * @hidden
     * Defines the commands column template as string or HTML element ID which is used to add
     * customized command buttons in each cells of the column.
     */
    commandsTemplate?: string | Function;

    /**
     * `commands` provides an option to display command buttons in every cell.
     * The available built-in command buttons are
     * * Edit - Edit the record.
     * * Delete - Delete the record.
     * * Save - Save the record.
     * * Cancel - Cancel the edit state.
     *
     * The following code example implements the custom command column.
     * ```html
     * <style type="text/css" class="cssStyles">
     * .details-icon:before
     * {
     *    content:"\e74d";
     * }
     * </style>
     * <div id="Grid"></div>
     * ```
     * ```typescript
     * var gridObj = new Grid({
     * datasource: window.gridData,
     * columns : [
     *  { field: 'CustomerID', headerText: 'Customer ID' },
     *  { field: 'CustomerName', headerText: 'Customer Name' },
     *  {commands: [{buttonOption:{content: 'Details', click: onClick, cssClass: details-icon}}], headerText: 'Customer Details'}
     * ]
     * gridObj.appendTo("#Grid");
     * ```
     *
     * @default null
     */
    commands?: CommandModel[];


    /**
     * It defines the custom sort comparer function.
     */
    sortComparer?: SortComparer | string;

    /**
     * @hidden
     * It defines the column is foreign key column or not.
     */
    isForeignColumn?: () => boolean;

    /**
     * Defines the cell edit template that used as editor for a particular column.
     * It accepts either template string or HTML element ID.
     *
     * @default null
     * @aspType string
     */
    editTemplate?: string | Function;

    /**
     * Defines the filter template/UI that used as filter for a particular column.
     * It accepts either template string or HTML element ID.
     *
     * @default null
     * @aspType string
     */
    filterTemplate?: string | Function;

    /**
     * Defines the mapping column name of the foreign data source.
     * If it is not defined then the `columns.field` will be considered as mapping column name
     *
     * @default false
     */
    lockColumn?: boolean;

    /**
     * If `allowSearching` set to false, then it disables Searching of a particular column.
     * By default all columns allow Searching.
     *
     * @default true
     */
    allowSearching?: boolean;

    /**
     * If `autoFit` set to true, then the particular column content width will be
     * adjusted based on its content in the initial rendering itself.
     * Setting this property as true is equivalent to calling `autoFitColumns` method in the `dataBound` event.
     *
     * @default false
     */
    autoFit?: boolean;

    /**
     * defines which side the column need to freeze
     * The available built-in freeze directions are
     * * Left - Freeze the column at left side.
     * * Right - Freeze the column at right side.
     * * Fixed - Freeze the column at Center.
     * * None - Does not freeze the column.
     *
     * @default None
     */
    freeze?: freezeDirection;

    /**
     * Determines the behavior of the `aria-label` attribute for cells in template columns.
     * If enableAriaLabel is set to false, the aria-label attribute is not applied to template column cells, which affects screen reader accessibility.
     *
     * @default {}
     */
    templateOptions?: TemplateProps;
}

export interface ActionEventArgs {
    /** Defines the current action. */
    requestType?: Action;
    /** Defines the type of event. */
    type?: string;
    /** Cancel the print action */
    cancel?: boolean;

    /** Defines the previous page number. */
    previousPage?: number;
    /** Defines the current page number. */
    currentPage?: number;

    /** Defines the field name of the currently grouped columns. */
    columnName?: string;

    /** Defines the object that is currently filtered. */
    currentFilterObject?: PredicateModel;
    /** Defines the column name that is currently filtered. */
    currentFilteringColumn?: string;
    /** Defines the collection of filtered columns. */
    columns?: PredicateModel[];

    /** Defines the string value to search. */
    searchString?: string;

    /** Defines the direction of sort column. */
    direction?: SortDirection;
    /** Defines the record objects.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the previous data.
     *
     * @isGenericType true
     */
    previousData?: Object;
    /** Defines the added row. */
    row?: Object;
    /** Added row index */
    index?: number;
    /** Defines the record objects.
     *
     * @isGenericType true
     */
    rowData?: Object;
    /** Defines the target for dialog */
    target?: HTMLElement;

    /** Defines the selected row index. */
    selectedRow?: number;
    /** Defines the current action. */
    action?: string;

    /** Defines foreign data object. */
    foreignKeyData?: Object;
    /** Define the form element */
    form?: HTMLFormElement;
    /** Define the movable table form element */
    movableForm?: HTMLFormElement;

    /** Defines the selected rows for delete. */
    tr?: Element[];

    /** Defines the primary keys */
    primaryKeys?: string[];
    /** Defines the primary key value */
    primaryKeyValue?: Object[];
    /** Defines the edited rowIndex */
    rowIndex?: number;
    /** Defines take number of data while Filtering */
    filterChoiceCount: number;
    /**
     * Defines the excel search operator
     */
    excelSearchOperator: string;
}

/**
 * Define options for custom command buttons.
 */
export class CommandColumnModel {
    /**
     * Define the command Button tooltip.
     */
    @Property()
    public title: string;
    /**
     * Define the command Button type.
     */
    @Property()
    public type: CommandButtonType;
    /**
     * Define the button model
     */
    @Property()
    public buttonOption: CommandButtonOptions;
}

/**
 * Defines Grid column
 */
export class GridColumn extends Column {
    /**
     * Defines stacked columns
     *
     * @default null
     */
    @Property(null)
    public columns: string[] | ColumnModel[];
}

/**
 * Interface for a class GridColumn
 */
export interface GridColumnModel extends ColumnModel {
    /**
     * Defines stacked columns
     *
     * @default null
     */
    columns?: string[] | ColumnModel[];
}

export interface TemplateProps {
    /**
     * Specifies whether the `aria-label` attribute is enabled for template column cells.
     *
     * @default true
     */
    enableAriaLabel?: boolean;
}

/**
 * Defines stacked grid column
 */
export class StackedColumn extends GridColumn {}

/**
 * Interface for a class stacked grid column
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StackedColumnModel extends GridColumnModel {}
