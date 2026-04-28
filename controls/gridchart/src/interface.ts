import { AccumulationChart, AccumulationChartModel, Chart, ChartModel } from '@syncfusion/ej2-charts';
import { ChartType, Grid, IGrid } from '@syncfusion/ej2-grids';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Accordion } from '@syncfusion/ej2-navigations';
import { ColorPicker, NumericTextBox, TextBox } from '@syncfusion/ej2-inputs';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { Dialog } from '@syncfusion/ej2-popups';

/**
 * Defines the arguments required for rendering a chart based on Grid selection.
 */
export interface ChartPopupArgs {
    /**
     * Defines the Grid instance
     */
    gridInstance: IGrid;
    /**
     * Defines the selected records from the Grid
     */
    records: Object[];
    /**
     * Defines the selected chart type from the context menu
     */
    chartType: ChartType;
}

/**
 * Defines the Category and Series for the chart.
 */
export interface CategorySeries {
    /**
     * Defines the category options
     */
    category: string[];
    /**
     * Defines the series options
     */
    series: string[];
}

/**
 * Defines the changes to apply.
 */
export interface ChartChanges {
    /**
     * Defines the changes to apply for chart.
     */
    chart: ChartModel;
    /**
     * Defines the changes to apply for accumulation chart.
     */
    accumulationChart: AccumulationChartModel;
}

/**
 * Defines the settings for the chart dialog, such as dimensions and target container.
 */
export interface ChartPopupSettings {
    /** Defines the title for the Dialog. */
    title?: string;
    /** The target HTML element where the dialog will be appended. */
    target?: HTMLElement;
    /** Defines the width of the Dialog. */
    width?: string | number;
    /** Defines the height of the Dialog. */
    height?: string | number;
}

/**
 * Defines the arguments required for initializing the custom component.
 */
export interface InitDialogUIArgs extends ChartPopupArgs {
    /**
     * Defines the dialog instance
     */
    dialog: Dialog;
    /**
     * A DOM element where users can append custom UI components
     */
    target: HTMLElement;
}

/**
 * Defines the structure of arguments used to update a chart instance.
 */
export interface UpdateChartArgs {
    /** Defines the current chart instance. */
    chartInstance: Chart | AccumulationChart;
    /** Defines the changes to apply for the chart. */
    changes: ChartChanges;
    /**
     * Defines the Grid instance
     */
    gridInstance: IGrid;
    /**
     * Defines the selected records from the Grid
     */
    records: Object[];
    /**
     * Defines the selected chart type
     */
    chartType: ChartType;
    /**
     * Defines the previous selected chart type
     */
    previousChartType: ChartType;
}

export interface DialogInformation {
    target: HTMLElement;
    width: string | number;
    height: string | number;
    minHeight: string | number;
    overflow: string;
}

export interface InputRadio {
    input: HTMLInputElement;
    label: HTMLLabelElement;
}

export interface DataTabInformation {
    categoryAxisDataStyle?: HTMLElement;
    categoryAxisElement?: HTMLElement;
    categoryAxisDropDownListObject?: DropDownList;
    seriesGridDataStyle?: HTMLElement;
    seriesGridElement?: HTMLElement;
    seriesGrid?: Grid;
    accumulationValueAxisDataStyle?: HTMLElement;
    accumulationValueAxisElement?: HTMLElement;
    accumulationValueAxisDropDown?: DropDownList;
}

export interface FormatTabInformation {
    chartStyleElement?: HTMLElement;
    chartStyleAccordion?: Accordion;
    chartStyleContainer?: HTMLElement;
    titleStyleElement?: HTMLElement;
    titleStyleAccordion?: Accordion;
    titleStyleContainer?: HTMLElement;
    legendStyleElement?: HTMLElement;
    legendStyleAccordion?: Accordion;
    legendStyleContainer?: HTMLElement;
    seriesStyleElement?: HTMLElement;
    seriesStyleAccordion?: Accordion;
    seriesStyleContainer?: HTMLElement;
    axesStyleElement?: HTMLElement;
    axesStyleAccordion?: Accordion;
    axesStyleContainer?: HTMLElement;
}

export interface ChartStyleInformation {
    marginHeaderChartStyle?: HTMLElement;
    marginTopBottomContainer?: HTMLElement;
    marginRightContainer?: HTMLElement;
    marginTopContainer?: HTMLElement;
    marginBottomContainer?: HTMLElement;
    marginTopElement?: HTMLElement;
    marginTopNumericTextBoxObject?: NumericTextBox;
    marginBottomElement?: HTMLElement;
    marginBottomNumericTextBoxObject?: NumericTextBox;
    marginRightLeftContainer?: HTMLElement;
    marginRightElement?: HTMLElement;
    marginRightNumericTextBoxObject?: NumericTextBox;
    marginLeftElement?: HTMLElement;
    marginLeftContainer?: HTMLElement;
    marginLeftNumericTextBoxObject?: NumericTextBox;
    colorChartStyle?: HTMLElement;
    backgroundColorPicker?: ColorPicker;
    backgroundColorElement?: HTMLElement;
}

export interface TitleStyleInformation {
    applyToTitleStyle?: HTMLElement;
    titleSectionElement?: HTMLElement;
    titleSectionTitleElement?: HTMLElement;
    titleSectionSubtitleElement?: HTMLElement;
    titleTitleStyle?: HTMLElement;
    titleTextBox?: TextBox;
    titleElement?: HTMLElement;
    fontTitleStyle?: HTMLElement;
    titleFontDropDownList?: DropDownList;
    titleFontElement?: HTMLElement;
    titleSizeColorContainer?: HTMLElement;
    titleSizeContainer?: HTMLElement;
    titleSizeDropDownList?: DropDownList;
    titleSizeElement?: HTMLElement;
    colorTitleStyle?: HTMLElement;
    titleColorPicker?: ColorPicker;
    titleColorElement?: HTMLElement;
}

export interface LegendStyleInformation {
    legendElement?: HTMLElement;
    legendCheckBox?: CheckBox;
    fontLegendStyle?: HTMLElement;
    legendFontDropDownList?: DropDownList;
    legendFontElement?: HTMLElement;
    legendSizeColorContainer?: HTMLElement;
    legendSizeContainer?: HTMLElement;
    legendSizeDropDownList?: DropDownList;
    legendSizeElement?: HTMLElement;
    colorLegendStyle?: HTMLElement;
    legendColorPicker?: ColorPicker;
    legendColorElement?: HTMLElement;
    positionLegendStyle?: HTMLElement;
    legendPositionElement?: HTMLElement;
    legendPositionDropDownList?: DropDownList;
}

export interface SeriesStyleInformation {
    tooltipElement?: HTMLElement;
    applyToSeriesStyle?: HTMLElement;
    tooltipCheckBox?: CheckBox;
    stylingSeriesDropDownList?: DropDownList;
    stylingSeriesElement?: HTMLElement;
    colorSeriesStyle?: HTMLElement;
    seriesColorPicker?: ColorPicker;
    seriesColorElement?: HTMLElement;
    seriesDataLabelElement?: HTMLElement;
    seriesDataLabelCheckBox?: CheckBox;
}

export interface AxesStyleInformation {
    applyToAxesStyle?: HTMLElement;
    axesCategoryElement?: HTMLElement;
    axesValueElement?: HTMLElement;
    axesElement?: HTMLElement;
    axesInversedElement?: HTMLElement;
    axesInversedCheckBox?: CheckBox;
    titleHeaderAxesStyle?: HTMLElement;
    titleTextAxesStyle?: HTMLElement;
    axesTitleTextBox?: TextBox;
    axesTitleElement?: HTMLElement;
    axesTitleFontDropDownList?: DropDownList;
    titleFontAxesStyle?: HTMLElement;
    axesTitleFontElement?: HTMLElement;
    axesTitleSizeColorContainer?: HTMLElement;
    axesTitleSizeDropDownList?: DropDownList;
    axesTitleSizeElement?: HTMLElement;
    axesTitleSizeContainer?: HTMLElement;
    titleColorAxesStyle?: HTMLElement;
    axesTitleColorPicker?: ColorPicker;
    axesTitleColorElement?: HTMLElement;
    labelHeaderAxesStyle?: HTMLElement;
    labelFontAxesStyle?: HTMLElement;
    axesLabelFontDropDownList?: DropDownList;
    axesLabelFontElement?: HTMLElement;
    axesLabelSizeColorContainer?: HTMLElement;
    axesLabelSizeContainer?: HTMLElement;
    labelRotationAxesStyle?: HTMLElement;
    axesLabelSizeDropDownList?: DropDownList;
    axesLabelSizeElement?: HTMLElement;
    labelColorAxesStyle?: HTMLElement;
    axesLabelColorPicker?: ColorPicker;
    axesLabelColorElement?: HTMLElement;
    axesLabelRotationElement?: HTMLElement;
    axesLabelRotationDropDownList?: DropDownList;
}
