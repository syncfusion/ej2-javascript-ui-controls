/**
 * HeatMap Axis file
 */
import { Property, Complex, ChildProperty, DateFormatOptions, isNullOrUndefined, Collection } from '@syncfusion/ej2-base';
import { DataUtil } from '@syncfusion/ej2-data';
import { Orientation } from '../utils/enum';
import { FontModel, TitleModel, AxisLabelBorderModel, MultiLevelLabelsModel, MultiLevelCategoriesModel } from '../model/base-model';
import { Font, Title, AxisLabelBorder, MultiLevelLabels, MultiLevelCategories, MultipleRow } from '../model/base';
import { Theme } from '../model/theme';
import { Rect, measureText, Size, rotateTextSize, increaseDateTimeInterval, formatValue, textTrim, getIsLineBreakLabel } from '../utils/helper';
import { MultiLevelPosition, textWrap } from '../utils/helper';
import { ValueType, IntervalType, LabelIntersectAction, LabelType } from '../utils/enum';
import { HeatMap } from '../heatmap';

/**
 * Sets and gets the options to customize the axis of the heatmap.
 */
export class Axis extends ChildProperty<Axis> {

    /**
     * Sets and gets the options to customize the title of heatmap axis.
     *
     * @default ''
     */
    @Complex<TitleModel>({ text: '', textStyle: Theme.axisTitleFont }, Title)
    public title: TitleModel;
    /**
     * Enables or disables the axis to render in opposed position. If set to true, the axis will render at the opposite side of its default position.
     *
     * @default false
     */

    @Property(false)
    public opposedPosition: boolean;


    /**
     * Sets and gets the list of texts to be displayed in an axis as labels.
     *
     * @default null
     */
    @Property(null)
    public labels: string[];

    /**
     * Sets and gets the options to customize the axis labels.
     */
    @Complex<FontModel>(Theme.axisLabelFont, Font)
    public textStyle: FontModel;

    /**
     * Sets and gets the angle to rotate the axis label.
     *
     * @default 0
     */

    @Property(0)
    public labelRotation: number;

    /**
     * Enables or disables the axis to be rendered in an inversed manner.
     *
     * @default false
     */

    @Property(false)
    public isInversed: boolean;

    /**
     * Specifies the type of data the axis is handling. The available types are,
     * * Numeric:  Renders a numeric axis.
     * * DateTime: Renders a axis that handles date and time.
     * * Category: Renders a axis that renders user provided labels.
     *
     * @default Category
     * @aspType Syncfusion.EJ2.HeatMap.ValueType
     * @isEnumeration true
     */

    @Property('Category')
    public valueType: ValueType;

    /**
     * Specifies the increment for an axis label. When this property is set, the displayed text of the labels will be multiplied with the increment value.
     *
     * @default 1
     */

    @Property(1)
    public increment: number;

    /**
     * Specifies the axis label display type for the date time axis. The following are available types,
     * * None: Axis labels displayed based on the value type.
     * * Years: Displays the axis labels for every year.
     * * Months: Displays the axis labels for every month.
     * * Days: Displays the axis labels for every day.
     * * Hours: Displays the axis labels for every hour.
     *
     * @default 'None'
     */

    @Property('None')
    public showLabelOn: LabelType;

    /**
     * Specifies the minimum range of an axis.
     *
     * @default null
     */

    @Property(null)
    public minimum: Object;

    /**
     * Specifies the maximum range of an axis.
     *
     * @default null
     */

    @Property(null)
    public maximum: Object;

    /**
     * Specifies the interval for an axis. This properties provides an interval between the axis labels.
     *
     * @default null
     */

    @Property(null)
    public interval: number;

    /**
     * Used to format the axis label that accepts any global string format like 'C', 'n1', 'P' etc.
     * It also accepts placeholder like '{value}°C' in which value represent the axis label, e.g, 20°C.
     *
     * @default ''
     */

    @Property('')
    public labelFormat: string;

    /**
     * Specifies the type of the interval between the axis labels in date time axis.The available types are,
     * * Years: Defines the interval of the axis labels in years.
     * * Months: Defines the interval of the axis labels in months.
     * * Days: Defines the interval of the axis labels in days.
     * * Hours: Defines the interval of the axis labels in hours.
     * * Minutes: Defines the interval of the axis labels in minutes.
     *
     * @default 'Days'
     */

    @Property('Days')
    public intervalType: IntervalType;

    /**
     * Specifies the actions when the axis labels intersect with each other.The actions available are,
     * * None: Shows all the labels.
     * * Trim : Trims the label when label text intersects with other labels.
     * * Rotate45: Rotates the label to 45 degree when it intersects other labels.
     * * MultipleRows: Shows all the labels as multiple rows when it intersects other labels.
     *
     * @default Trim
     */

    @Property('Trim')
    public labelIntersectAction: LabelIntersectAction;

    /**
     * Enables or disables the trimming of the axis labels when the label exceeds maximum length.
     *
     * @default false
     */

    @Property(false)
    public enableTrim: boolean;

    /**
     * Specifies the maximum length of the axis labels.
     *
     * @default 35.
     */
    @Property(35)
    public maxLabelLength: number;

    /**
     * Set and gets the options to customize the border of the axis labels.
     */

    @Complex<AxisLabelBorderModel>({ color: '#b5b5b5', width: 0, type: 'Rectangle' }, AxisLabelBorder)
    public border: AxisLabelBorderModel;

    /**
     * Sets and gets the options to customize the multi level labels for an axis.
     */
    @Collection<MultiLevelLabels>([], MultiLevelLabels)
    public multiLevelLabels: MultiLevelLabelsModel[];

    /** @private */
    public orientation: Orientation;

    /** @private */
    public multipleRow: MultipleRow [] = [];
    /** @private */
    public rect: Rect = new Rect(undefined, undefined, 0, 0);

    /** @private */
    public nearSizes: number[] = [];
    /** @private */
    public farSizes: number[] = [];
    /** @private */
    public maxLabelSize: Size = new Size(0, 0);
    /** @private */
    public titleSize: Size = new Size(0, 0);

    /** @private */
    public multilevel: number[] = [];
    /** @private */
    public axisLabels: string[] = [];
    /** @private */
    public tooltipLabels: string[] = [];
    /** @private */
    public labelValue: (string | number | Date)[] = [];
    /** @private */
    public axisLabelSize: number = 0;
    /** @private */
    public axisLabelInterval: number = 0;
    /** @private */
    public dateTimeAxisLabelInterval: number[] = [];
    /** @private */
    public maxLength: number = 0;
    /** @private */
    public min: number = 0;
    /** @private */
    public max: number = 0;
    /** @private */
    public format: Function;
    /** @private */
    public angle: number;
    /** @private */
    public isIntersect: boolean = false;
    /** @private */
    public jsonCellLabel: string[] = [];
    public multiLevelSize: Size[] = [];
    /** @private */
    public xAxisMultiLabelHeight: number[] = [];
    /** @private */
    public yAxisMultiLabelHeight: number[] = [];
    /** @private */
    public multiLevelPosition: MultiLevelPosition[] = [];
    /**
     * measure the axis title and label size
     *
     * @param axis
     * @param heatmap
     * @private
     */

    public computeSize(axis: Axis, heatmap: HeatMap, rect: Rect): void {
        let size: Size = new Size(0, 0);
        const innerPadding: number = 10;
        this.titleSize = axis.getTitleSize(axis, innerPadding);
        this.maxLabelSize = axis.getMaxLabelSize(axis, heatmap);
        this.getMultilevelLabelsHeight(axis, rect, heatmap);
        for (let i: number = 0; i < this.multiLevelLabels.length; i++) {
            size = axis.multiLevelLabelSize(innerPadding, i);
            this.multiLevelSize.push(size);
        }
    }

    /**
     * calculating x, y position of multi level labels
     *
     * @private
     */

    public multiPosition(axis: Axis, index: number): MultiLevelPosition {
        const innerPadding: number = axis.orientation === 'Horizontal' ? 10 : 20;
        const multiPosition: MultiLevelPosition = new MultiLevelPosition(0, 0);
        if (axis.orientation === 'Horizontal') {
            const level0: number = axis.maxLabelSize.height + innerPadding
                + ((axis.angle === 0 || axis.angle === 180 || axis.angle === 360) ? 0 : innerPadding);
            const level1: number = this.xAxisMultiLabelHeight[index - 1];
            multiPosition.x = (axis.isInversed ? axis.rect.x + axis.rect.width : axis.rect.x);
            multiPosition.y = index === 0 ? axis.rect.y + (axis.opposedPosition ? -level0 : level0) :
                axis.multiLevelPosition[index - 1].y + (axis.opposedPosition ? -level1 : level1 );
        } else {
            const level0: number =  axis.maxLabelSize.width + innerPadding;
            const level1: number = index !== 0 && (this.multiLevelSize[index - 1].width  );
            multiPosition.x = index === 0 ? axis.rect.x - (axis.opposedPosition ? -level0 : level0 ) :
                axis.multiLevelPosition[index - 1].x - (axis.opposedPosition ? - (level1 + innerPadding) : level1 + innerPadding);
            multiPosition.y =  axis.isInversed ? axis.rect.y : axis.rect.y + axis.rect.height;
        }
        return multiPosition;
    }

    private multiLevelLabelSize(innerPadding: number, index: number): Size {
        const labelSize: Size = new Size(0, 0);
        const multiLevel: MultiLevelLabelsModel[] = this.multiLevelLabels;
        const categoryLabel: MultiLevelCategoriesModel[] = multiLevel[index as number].categories;
        for (let i: number = 0; i < categoryLabel.length; i++) {
            const size: Size = measureText(categoryLabel[i as number].text, multiLevel[index as number].textStyle);
            labelSize.width = (labelSize.width > size.width) ? labelSize.width : size.width;
            labelSize.height = (labelSize.height > size.height) ? labelSize.height : size.height;
        }
        const size: number = (this.orientation === 'Horizontal') ? this.xAxisMultiLabelHeight[index as number] :
            this.yAxisMultiLabelHeight[index as number];
        if (this.opposedPosition) {
            this.farSizes.push(size );
        } else {
            this.nearSizes.push(size );
        }
        return labelSize;
    }

    private getMultilevelLabelsHeight(axis: Axis, rect: Rect, heatmap: HeatMap): void {
        let labelSize: Size; let gap: number;
        let height: number;
        const multiLevelLabelsHeight: number[] = [];
        let start: number | Date; let end: number | Date;
        let startPosition: number; let endPosition: number;
        const isVertical: boolean = axis.orientation === 'Vertical';
        const padding: number = axis.orientation === 'Vertical' ? 20 : 10;
        this.multiLevelLabels.map((multiLevel: MultiLevelLabels, index: number) => {
            multiLevel.categories.map((categoryLabel: MultiLevelCategories) => {
                start = typeof categoryLabel.start === 'number' ? categoryLabel.start :  Number(new Date(<string>categoryLabel.start));
                end = typeof categoryLabel.end === 'number' ? categoryLabel.end : Number(new Date(<string>categoryLabel.end));
                if (categoryLabel.text !== '' && categoryLabel.start !== null && categoryLabel.end !== null) {
                    labelSize = measureText(categoryLabel.text, multiLevel.textStyle);
                    height = isVertical ? labelSize.width : labelSize.height;
                    startPosition =  heatmap.heatMapAxis.calculateLeftPosition(axis, start, categoryLabel.start, rect);
                    endPosition = heatmap.heatMapAxis.calculateWidth(axis, categoryLabel.end, end, rect);
                    labelSize = measureText(categoryLabel.text, multiLevel.textStyle);
                    gap = ((categoryLabel.maximumTextWidth === null) ? Math.abs(endPosition - startPosition) :
                        categoryLabel.maximumTextWidth);
                    if ((labelSize.width > gap - padding)  && (multiLevel.overflow === 'Wrap') && !isVertical) {
                        height = (height * (textWrap(categoryLabel.text, gap - padding, multiLevel.textStyle).length));
                    }
                    multiLevelLabelsHeight[index as number] = !multiLevelLabelsHeight[index as number] ? height + padding :
                        ((multiLevelLabelsHeight[index as number] < height) ? height + padding  : multiLevelLabelsHeight[index as number]);
                }
            });
        });
        if (isVertical) {
            this.yAxisMultiLabelHeight = multiLevelLabelsHeight;
        } else {
            this.xAxisMultiLabelHeight = multiLevelLabelsHeight;
        }
    }

    private getTitleSize(axis: Axis, innerPadding: number): Size {
        let titleSize: Size = new Size(0, 0);
        if (this.title.text) {
            titleSize = measureText(this.title.text, this.title.textStyle);
            titleSize.height += innerPadding;
        }
        if (axis.opposedPosition) {
            this.farSizes.push(titleSize.height);
        } else {
            this.nearSizes.push(titleSize.height);
        }
        return titleSize;
    }

    private getMaxLabelSize(axis: Axis, heatmap: HeatMap): Size {
        const labelSize: Size = new Size(0, 0); const labels: string[] = this.axisLabels;
        const padding: number = (axis.border.width > 0 || axis.multiLevelLabels.length > 0) ? 10 : 0;
        const labelPadding: number = 10;
        let count: number = 1; const row: number = 1;
        const interval: number = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') || (axis.textStyle.textOverflow === 'Wrap' || axis.textStyle.textOverflow === 'Trim') ?
            heatmap.initialClipRect.width / axis.axisLabelSize : heatmap.initialClipRect.width / axis.axisLabels.length;
        axis.angle = axis.labelRotation; axis.isIntersect = false;
        const isLineBreak: boolean = getIsLineBreakLabel(labels);
        if ((axis.orientation === 'Horizontal' && (axis.labelIntersectAction === 'Rotate45' ||
            (axis.labelRotation % 180 === 0 && axis.labelIntersectAction === 'Trim' || axis.enableTrim)) ||
                axis.labelIntersectAction === 'MultipleRows') && axis.textStyle.textOverflow !== 'Wrap' && axis.textStyle.textOverflow !== 'Trim') {
            let startX: number = heatmap.initialClipRect.x + ((!axis.isInversed) ? 0 : heatmap.initialClipRect.width);
            let previousEnd: number; let previousStart: number; this.clearMultipleRow();
            for (let i: number = 0, len: number = labels.length; i < len; i++) {
                const label: string = labels[i as number]; const elementSize: Size = measureText(label, axis.textStyle);
                const axisInterval: number = (axis.valueType === 'DateTime' && axis.showLabelOn !== 'None') ?
                    axis.dateTimeAxisLabelInterval[i as number] * interval : interval;
                let startPoint: number = startX + (!axis.isInversed ?
                    ((interval - elementSize.width) / 2) : -((interval + elementSize.width) / 2));
                startPoint = startPoint < heatmap.initialClipRect.x ? heatmap.initialClipRect.x : startPoint;
                const endPoint: number = startPoint + elementSize.width;
                if (!axis.isInversed) {
                    if (isNullOrUndefined(previousEnd)) {
                        previousEnd = endPoint;
                    } else if ((startPoint < previousEnd) && axis.labelIntersectAction !== 'MultipleRows') {
                        if (axis.labelIntersectAction === 'Rotate45' && !(isLineBreak) && !axis.enableTrim) {
                            axis.angle = 45;
                        } else { axis.isIntersect = true; }
                        break;
                    }
                    previousEnd = endPoint;
                } else {
                    if (isNullOrUndefined(previousStart)) {
                        previousStart = startPoint;
                    } else if ((previousStart < endPoint && axis.labelIntersectAction !== 'MultipleRows')) {
                        if (axis.labelIntersectAction === 'Rotate45' && !(isLineBreak) && !axis.enableTrim) {
                            axis.angle = 45;
                        } else { axis.isIntersect = true; }
                        break;
                    }
                    previousStart = startPoint;
                }
                startX += axis.isInversed ? -axisInterval : axisInterval;
                if (axis.orientation === 'Horizontal' && axis.labelIntersectAction === 'MultipleRows' && axis.labelRotation === 0) {
                    this.multipleRow.push(new MultipleRow (startPoint , endPoint, count, label, row));
                }
            }
            if (axis.orientation === 'Horizontal' && axis.labelIntersectAction === 'MultipleRows' && axis.isInversed) {
                this.multipleRow = this.multipleRow.reverse();
            }
        }
        let labelLength : number = 1;
        for (let i: number = 0; i < labels.length; i++) {
            const multipleRow : MultipleRow [] = this.multipleRow; let label : string;
            if (axis.enableTrim || (axis.textStyle.textOverflow === 'Trim' && !(labels[i as number].indexOf('<br>') !== -1 || labels[i as number].indexOf('<br/>') !== -1))) {
                label = textTrim((axis.textStyle.textOverflow === 'Trim' && axis.orientation === 'Horizontal' ? interval : axis.maxLabelLength), labels[i as number], axis.textStyle);
            } else { label = labels[i as number]; }
            let wrappedlabels: string[] = [];
            if ((axis.textStyle.textOverflow === 'Wrap' || isLineBreak) && !axis.enableTrim) {
                const labelInterval: number = axis.orientation === 'Horizontal' ? interval : axis.maxLabelLength;
                if (isLineBreak){
                    wrappedlabels = label.split(/<br\s*\/?>/, -1);
                    for (let i: number = 0 ; i < wrappedlabels.length; i++)
                    {
                        wrappedlabels[i as number] = textTrim(labelInterval, wrappedlabels[i as number], axis.textStyle);
                    }
                } else {
                    wrappedlabels = textWrap(label, labelInterval, axis.textStyle);
                }
                labelLength = wrappedlabels.length > labelLength && !axis.enableTrim ? wrappedlabels.length : labelLength;
                if (axis.orientation === 'Vertical' || (axis.orientation === 'Horizontal' && axis.angle % 180 !== 0))
                {
                    let labelWidth: number = 0;
                    for (let index: number = 0; index < wrappedlabels.length; index++)
                    {
                        let wrappedlabelSize: Size = measureText(wrappedlabels[index as number], axis.textStyle);
                        if (wrappedlabelSize.width > labelWidth)
                        {
                            labelWidth = wrappedlabelSize.width;
                            label = wrappedlabels[index as number];
                        }
                    }
                }
                if (axis.orientation === 'Vertical'){
                    let tempintervel: number = heatmap.initialClipRect.height / (axis.axisLabelSize / axis.axisLabelInterval);
                    for (let index: number = 0; index < wrappedlabels.length; index++){
                        if ((measureText(label, axis.textStyle).height * wrappedlabels.length) > (tempintervel - labelPadding) && wrappedlabels.length > 0 && (axis.angle !== 90 && axis.angle !== 270)){
                            wrappedlabels.pop();
                            if (wrappedlabels.length > 0) {
                                wrappedlabels[wrappedlabels.length - 1] = wrappedlabels[wrappedlabels.length - 1] + '...';
                                /* eslint-disable max-len */
                                wrappedlabels[wrappedlabels.length - 1] = textTrim(axis.maxLabelLength, wrappedlabels[wrappedlabels.length - 1], axis.textStyle);
                            }
                        }
                    }
                }
            } else {
                if (isLineBreak && axis.enableTrim) {
                    wrappedlabels = label.split(/<br\s*\/?>/, -1);
                    const trimmedLabel: string = textTrim(axis.maxLabelLength, wrappedlabels[0], axis.textStyle);
                    label = (label.indexOf('<br>') !== -1 || label.indexOf('<br/>') !== -1) && trimmedLabel.indexOf('...') === -1 ? trimmedLabel + '...' : trimmedLabel;
                    wrappedlabels = [];
                }
                wrappedlabels.push(label);
            }
            const size: Size = (axis.angle % 180 === 0) ?
                measureText(label, axis.textStyle) : rotateTextSize(axis.textStyle, wrappedlabels, axis.angle);
            labelSize.width = (labelSize.width > size.width) ? labelSize.width : size.width;
            if (axis.labelIntersectAction === 'MultipleRows' && axis.orientation === 'Horizontal' && axis.textStyle.textOverflow !== 'Wrap' && axis.textStyle.textOverflow !== 'Trim' && i > 0 && axis.labelRotation === 0) {
                if (multipleRow[i as number].end >= heatmap.initialClipRect.width && i < labels.length - 1) {
                    multipleRow[i as number].row = multipleRow[i as number].row + 1;
                }
                for (let k: number = 1; k <= axis.multilevel.length; k++) {
                    if (multipleRow[i as number].start < multipleRow[i - 1].end) {
                        if (axis.multilevel[k as number] < multipleRow[i as number].start) {
                            count = k;
                            break;
                        } else if (k === axis.multilevel.length - 1) {
                            count = axis.multilevel.length;
                            break;
                        }
                    } else if (size.width < interval) {
                        for (let j: number = 1; j <= axis.multilevel.length; j++) {
                            if (axis.multilevel[j as number] < multipleRow[i as number].start) {
                                count = j; multipleRow[j as number].row = count;
                                break;
                            }
                        }
                    }
                }
                labelSize.height = (labelSize.height > ((size.height * count) + (((size.height * 0.5) / 2) * (count - 1)))) ?
                    labelSize.height : ((size.height * count) + (((size.height * 0.5) / 2) * count));
                this.multipleRow[i as number].index = count; axis.multilevel[count as number] = multipleRow[i as number].end;
            } else {
                if (axis.orientation === 'Horizontal' && axis.labelIntersectAction === 'MultipleRows' && i === 0 &&
                    axis.labelRotation === 0 && axis.textStyle.textOverflow !== 'Wrap' && axis.textStyle.textOverflow !== 'Trim') {
                    axis.multilevel[1] = multipleRow[i as number].end;
                }
                labelSize.height = (labelSize.height > size.height) ? labelSize.height : size.height;
            }
        }
        labelSize.height = (axis.angle % 180 === 0) ? labelSize.height * labelLength : labelSize.height;
        if (heatmap.cellSettings.border.width >= 20 && axis.orientation !== 'Horizontal') {
            labelSize.width = labelSize.width + (heatmap.cellSettings.border.width / 4);
        }
        if (axis.opposedPosition) {
            this.farSizes.push((axis.orientation === 'Horizontal') ? labelSize.height : labelSize.width + padding);
        } else {
            this.nearSizes.push((axis.orientation === 'Horizontal') ? labelSize.height : labelSize.width + padding);
        }
        return labelSize;
    }

    /**
     * Generate the axis lables for numeric axis
     *
     * @param heatmap
     * @private
     */

    public calculateNumericAxisLabels(heatmap: HeatMap): void {

        //Axis Min
        let min: number = 0;
        let max: number = 0;
        const interval: number = this.interval ? this.interval : 1;
        let adaptorMin: Object;
        let adaptorMax: Object;
        if (heatmap.adaptorModule && heatmap.isCellData) {
            adaptorMin = this.orientation === 'Horizontal' ?
                heatmap.adaptorModule.adaptiveXMinMax.min : heatmap.adaptorModule.adaptiveYMinMax.min;
            adaptorMax = this.orientation === 'Horizontal' ?
                heatmap.adaptorModule.adaptiveXMinMax.max : heatmap.adaptorModule.adaptiveYMinMax.max;
        }
        min = !isNullOrUndefined(this.minimum) ? <number>this.minimum : ((adaptorMin) ? <number>adaptorMin : 0);
        max = !isNullOrUndefined(this.maximum) ? <number>this.maximum :
            ((adaptorMax) ? <number>adaptorMax : (this.maxLength * this.increment));
        let temp: number;
        if (this.minimum && this.maximum && min > max) {
            temp = min;
            min = max;
            max = temp;
        }
        max = !isNullOrUndefined(this.maximum) ? max : (adaptorMax ? <number>adaptorMax : (max + min));
        const format: string = this.labelFormat;
        const isCustom: boolean = format.match('{value}') !== null;
        this.format = heatmap.intl.getNumberFormat({
            format: isCustom ? '' : format
        });
        for (let i: number = min; i <= max; i = i + (interval * this.increment)) {
            const value: string = formatValue(isCustom, format, i, this.format);
            this.axisLabels.push(value);
        }
        this.min = 0;
        this.axisLabelSize = Math.floor(((max - min) / this.increment) + 1);
        this.max = this.axisLabelSize - 1;
        this.axisLabelInterval = interval;
        for (let i: number = min; i <= max; i = i + this.increment) {
            const value: string = formatValue(isCustom, format, i, this.format);
            this.tooltipLabels.push(value);
            this.labelValue.push(i);
        }
        this.labelValue = this.isInversed ? this.labelValue.reverse() : this.labelValue;
    }

    /**
     * Generate the axis lables for category axis
     *
     * @private
     */

    public calculateCategoryAxisLabels(): void {
        let labels: string[] = this.labels ? this.labels : [];
        labels = (labels.length > 0) ? labels : this.jsonCellLabel;
        let min: number = !isNullOrUndefined(this.minimum) && !(this.minimum instanceof Date) ? <number>this.minimum : 0;
        let max: number = !isNullOrUndefined(this.maximum) && !(this.maximum instanceof Date) ? <number>this.maximum : this.maxLength;
        const interval: number = this.interval ? this.interval : 1;
        let temp: number;
        const format: string = this.labelFormat;
        const isCustom: boolean = format.match('{value}') !== null;
        if (!isNullOrUndefined(this.minimum) && !isNullOrUndefined(this.maximum) && min > max) {
            temp = min;
            min = max;
            max = temp;
        }
        if (labels && labels.length > 0) {
            for (let i: number = min; i <= max; i = i + interval) {
                const value: string = !isNullOrUndefined(labels[i as number]) ?  isCustom ? format.replace('{value}', labels[i as number].toString()): labels[i as number].toString(): isCustom ? format.replace('{value}', i.toString()): i.toString();
                this.axisLabels.push(value);
            }
        } else {
            for (let i: number = min; i <= max; i = i + interval) {
                const value = isCustom ? format.replace('{value}', i.toString()):  i.toString();
                this.axisLabels.push(value);
            }
        }
        for (let i: number = min; i <= max; i++) {
            this.tooltipLabels.push(!isNullOrUndefined(labels[i as number]) ? isCustom ? format.replace('{value}', labels[i as number].toString()): labels[i as number].toString() : isCustom ? format.replace('{value}', i.toString()): i.toString());
            this.labelValue.push(!isNullOrUndefined(labels[i as number]) ? labels[i as number].toString() : i.toString());
        }
        this.min = min;
        this.max = max;
        this.axisLabelSize = max - min + 1;
        this.axisLabelInterval = interval;
        this.labelValue = this.isInversed ? this.labelValue.reverse() : this.labelValue;
    }

    /**
     * Generate the axis labels for date time axis.
     *
     * @param heatmap
     * @private
     */

    public calculateDateTimeAxisLabel(heatmap: HeatMap): void {
        let interval: number = this.interval ? this.interval : 1;
        const option: DateFormatOptions = {
            skeleton: 'full',
            type: 'dateTime'
        };
        const dateParser: Function = heatmap.intl.getDateParser(option);
        const dateFormatter: Function = heatmap.intl.getDateFormat(option);
        let min: number;
        let max: number;
        let adaptorMin: Object = null;
        let adaptorMax: Object = null;
        if (heatmap.adaptorModule && heatmap.isCellData) {
            adaptorMin = this.orientation === 'Horizontal' ? heatmap.adaptorModule.adaptiveXMinMax.min :
                heatmap.adaptorModule.adaptiveYMinMax.min;
            adaptorMax = this.orientation === 'Horizontal' ? heatmap.adaptorModule.adaptiveXMinMax.max :
                heatmap.adaptorModule.adaptiveYMinMax.max;
        }
        const minimum: object = this.minimum ? this.minimum : (adaptorMin ? adaptorMin : null);
        const maximum: object = this.maximum ? this.maximum : (adaptorMax ? adaptorMax : null);
        if (minimum === null && maximum === null) {
            min = 0;
            max = this.maxLength * this.increment;
            for (let i: number = min; i <= max; i = i + (interval * this.increment)) {
                this.axisLabels.push(i.toString());
                this.tooltipLabels.push(i.toString());
                this.labelValue.push(i.toString());
            }
            this.min = 0;
            this.max = this.maxLength;
            this.axisLabelSize = (max - min) / this.increment + 1;
            this.axisLabelInterval = interval;
        } else {
            if (minimum !== null && maximum === null) {
                min = Date.parse(dateParser(dateFormatter(new Date(
                    DataUtil.parse.parseJson({ val: minimum }).val
                ))));
                max = increaseDateTimeInterval(min, this.maxLength, this.intervalType, this.increment).getTime();
            } else if (minimum === null && maximum !== null) {
                max = Date.parse(dateParser(dateFormatter(new Date(
                    DataUtil.parse.parseJson({ val: maximum }).val
                ))));
                min = increaseDateTimeInterval(max, -this.maxLength, this.intervalType, this.increment).getTime();
            } else {
                min = Date.parse(dateParser(dateFormatter(new Date(
                    DataUtil.parse.parseJson({ val: minimum }).val
                ))));
                max = Date.parse(dateParser(dateFormatter(new Date(
                    DataUtil.parse.parseJson({ val: maximum }).val
                ))));
            }
            this.format = heatmap.intl.getDateFormat({
                format: this.labelFormat, skeleton: this.getSkeleton()
            });
            let tempInterval: number = min;
            while (tempInterval <= max) {
                const value: string = this.format(new Date(tempInterval));
                this.axisLabels.push(value);
                if (this.showLabelOn !== 'None') {
                    interval = this.calculateLabelInterval(tempInterval);
                    this.dateTimeAxisLabelInterval.push(interval);
                }
                tempInterval = increaseDateTimeInterval(tempInterval, interval, this.intervalType, this.increment).getTime();
            }
            this.min = 0;
            this.axisLabelInterval = interval;
            this.axisLabelSize = this.getTotalLabelLength(min, max); // this.tooltipLabels.length;
            this.max = this.axisLabelSize - 1;
            tempInterval = min;
            while (tempInterval <= max) {
                const value: string = this.format(new Date(tempInterval));
                this.tooltipLabels.push(value);
                this.labelValue.push(new Date(tempInterval));
                tempInterval = increaseDateTimeInterval(tempInterval, 1, this.intervalType, this.increment).getTime();
            }
        }
        this.labelValue = this.isInversed ? this.labelValue.reverse() : this.labelValue;
    }

    private calculateLabelInterval(interval: number): number {
        const year: number = new Date(interval).getFullYear();
        const month: number = new Date(interval).getMonth() + 1;
        const day: number = new Date(interval).getDate();
        let numberOfDays: number;
        let tempInterval: number;
        if (this.showLabelOn === 'Years' || this.showLabelOn === 'Months') {
            if (this.showLabelOn === 'Years' && this.intervalType === 'Months') {
                tempInterval = Math.ceil(12 / this.increment);
            } else {
                numberOfDays = this.showLabelOn === 'Years' ? year % 4 === 0 ? 366 : 365 : new Date(year, month, 0).getDate();
                numberOfDays += 1 - day;
                tempInterval = this.intervalType === 'Days' ? Math.ceil(numberOfDays / this.increment) : this.intervalType === 'Hours' ?
                    Math.ceil((numberOfDays * 24) / this.increment) : this.intervalType === 'Minutes' ?
                        Math.ceil((numberOfDays * 24 * 60) / this.increment) : 1;
            }
        } else if (this.showLabelOn === 'Days') {
            tempInterval = this.intervalType === 'Hours' ? Math.ceil(24 / this.increment) : this.intervalType === 'Minutes' ?
                Math.ceil((24 * 60) / this.increment) : 1;
        } else if (this.showLabelOn === 'Hours') {
            const minutes: number = new Date(interval).getMinutes();
            tempInterval = this.intervalType === 'Minutes' ? Math.ceil((60 - minutes) / this.increment) : 1;
        } else {
            tempInterval = 1;
        }
        return tempInterval;
    }
    /**
     * @private
     */

    public getSkeleton(): string {
        let skeleton: string;
        if (this.intervalType === 'Years') {
            skeleton = 'yMMM';
        } else if (this.intervalType === 'Months') {
            skeleton = 'MMMd';
        } else if (this.intervalType === 'Days') {
            skeleton = 'yMd';
        } else if (this.intervalType === 'Hours') {
            skeleton = 'EHm';
        } else if (this.intervalType === 'Minutes') {
            skeleton = 'Hms';
        } else {
            skeleton = 'Hms';
        }
        return skeleton;
    }

    /** @private */

    public getTotalLabelLength(min: number, max: number): number {
        let length: number = 0;
        const minimum: Date = new Date(min);
        const maximum: Date = new Date(max);
        let difference: number;
        let days: number;
        switch (this.intervalType) {
        case 'Years':
            // eslint-disable-next-line no-case-declarations
            const years: number = ((maximum.getFullYear() - minimum.getFullYear()) / this.increment) + 1;
            length = Math.floor(years);
            break;
        case 'Months':
            // eslint-disable-next-line no-case-declarations
            let months: number = (maximum.getFullYear() - minimum.getFullYear()) * 12;
            months -= minimum.getMonth();
            months += maximum.getMonth();
            length = months <= 0 ? 1 : Math.floor((months / this.increment) + 1);
            break;
        case 'Days':
            difference = Math.abs(minimum.getTime() - maximum.getTime());
            days = Math.floor(difference / (1000 * 3600 * 24));
            length = Math.floor((days / this.increment) + 1);
            break;
        case 'Hours':
            difference = Math.abs(minimum.getTime() - maximum.getTime());
            // eslint-disable-next-line no-case-declarations
            const hours: number = Math.floor(difference / (1000 * 3600));
            length = Math.floor(hours / this.increment) + 1;
            break;

        case 'Minutes':
            difference = Math.abs(minimum.getTime() - maximum.getTime());
            // eslint-disable-next-line no-case-declarations
            const minutes: number = Math.floor(difference / (1000 * 60));
            length = Math.floor(minutes / this.increment) + 1;
            break;
        }
        return length;
    }

    /**
     * Clear the axis label collection
     *
     * @private
     */

    public clearAxisLabel(): void {
        this.axisLabels = [];
        this.tooltipLabels = [];
        this.dateTimeAxisLabelInterval = [];
        this.labelValue = [];
    }

    /**
     * Clear the axis label collection
     *
     * @private
     */

    public clearMultipleRow(): void {
        this.multipleRow = [];
        this.multilevel = [];
    }

}
