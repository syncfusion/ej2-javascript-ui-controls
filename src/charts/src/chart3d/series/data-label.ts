
import { Chart3D } from '../chart3D';
import { Chart3DSeries, Chart3DPoint } from './chart-series';
import { Chart3DDataLabelSettingsModel } from './chart-series-model';
import { Rect, Size, measureText } from '@syncfusion/ej2-svg-base';
import { Chart3DTextRenderEventArgs, Chart3DLabelElement, Chart3DLocation } from '../model/chart3d-Interface';
import { textRender } from '../../common/model/constants';
import { createElement } from '@syncfusion/ej2-base';
import { MarginModel } from '../../common/model/base-model';
import { ColorValue, appendChildElement, colorNameToHex, convertHexToColor, getFontStyle, getTemplateFunction, isCollide, measureElementRect, withIn } from '../../common/utils/helper';
import { Chart3DAxis } from '../axis/axis';
import { Chart3DTextFontModel } from '../model/chart3d-Interface-model';

/**
 * The `DataLabel` module is used to render data label for the data point.
 */
export class DataLabel3D {

    private chart: Chart3D;
    private margin: MarginModel;
    private fontBackground: string;
    /**
     * Constructor for the data label module.
     *
     * @param {Chart3D} chart - Chart3D instance.
     * @private
     */
    constructor(chart: Chart3D) {
        this.chart = chart;
    }

    /**
     * Renders a 3D series on a 3D chart with data labels.
     *
     * @param {Chart3DSeries} series - The 3D series to be rendered.
     * @param {Chart3D} chart - The 3D chart on which the series is rendered.
     * @param {Chart3DDataLabelSettingsModel} dataLabel - The data label style for the series.
     * @returns {void}
     */
    public render(series: Chart3DSeries, chart: Chart3D, dataLabel: Chart3DDataLabelSettingsModel): void {
        let point: Chart3DPoint;
        const templateId: string = chart.element.id + '-series-' + series.index + '-data-label-collections';
        series.dataLabelElement = createElement('div', { id: templateId });
        for (let i: number = 0; i < series.visiblePoints.length; i++) {
            point = series.visiblePoints[i as number];
            if (point.visible) {
                this.draw3DDataLabel(series, point.index, point, chart, dataLabel);
            }
        }
        if (series.dataLabel.template) {
            appendChildElement(false, document.getElementById(this.chart.element.id + '_Secondary_Element'), series.dataLabelElement, chart.redraw, false, 'x', 'y', null, '', false, false, null);
        }
    }

    /**
     * Draws data labels for a specific data point in a 3D series on a 3D chart.
     *
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs.
     * @param {number} pointIndex - The index of the data point within the series.
     * @param {Chart3DPoint} point - The data point for which data labels are drawn.
     * @param {Chart3D} chart - The 3D chart that contains the series and data point.
     * @param {Chart3DDataLabelSettingsModel} dataLabel - The style for data labels.
     * @returns {void}
     */
    private draw3DDataLabel(series: Chart3DSeries, pointIndex: number, point: Chart3DPoint, chart: Chart3D,
                            dataLabel: Chart3DDataLabelSettingsModel): void {
        let pointX: number;
        let pointY: number;
        const xOffset: number = 0;
        const yOffset: number = 0;
        const commonEventArgs: {
            data: {
                text: string, location: { x: number, y: number },
                series: Chart3DSeries, pointIndex: number, Text?: string
            }
        } = { data: null };
        const pointText: string = this.getLabelText(point, series, this.chart)[0];
        const size: Size = measureText(pointText as string, dataLabel.font, this.chart.themeStyle.datalabelFont);
        const location: Chart3DLocation = chart.svg3DRenderer.transform3DToVisible(series, point.symbolLocations.x,
                                                                                   point.symbolLocations.y, chart);
        pointY = location.y;
        pointX = location.x;
        if (series.dataLabel.position === 'Bottom') {
            pointY = location.y + yOffset;
        } else {
            pointY = location.y - yOffset;
        }
        pointX = location.x + xOffset;
        commonEventArgs.data = {
            text: pointText,
            location: { x: pointX, y: pointY },
            series: series,
            pointIndex: pointIndex
        };
        commonEventArgs.data.Text = commonEventArgs.data.text;
        const argsData: Chart3DTextRenderEventArgs = {
            cancel: false, series: series,
            point: point, text: pointText, border: dataLabel.border,
            color: dataLabel.fill, template: dataLabel.template, textStyle: dataLabel.font
        };
        chart.trigger(textRender, argsData);
        this.fontBackground = series.dataLabel.position === 'Middle' ? argsData.color === 'transparent' ? point.color : argsData.color : argsData.color;
        commonEventArgs.data.text = argsData.text;
        if (!series.dataLabel.template && commonEventArgs.data.Text !== '' && !argsData.cancel) {
            /**
             * The element object for data label.
             */
            const element: Chart3DLabelElement = {
                tag: 'dataLabel',
                series: series,
                point: point,
                pointIndex: pointIndex,
                id: chart.svgObject.id + series.index + '-data-label' + pointIndex,
                child: chart.chart3D
            };
            chart.graphics.addVisual(
                chart.polygon.createTextElement(
                    chart.vector.vector3D(pointX, pointY, point.symbolLocations.z), element, 0, -size.height), chart
            );
        }
        const tag: string = !(series.dataLabel && series.dataLabel.template ) ? 'text' : 'template';
        const backgroundColor: string = this.fontBackground === 'transparent' ? ((this.chart.theme.indexOf('Dark') > -1 || this.chart.theme === 'HighContrast') ? '#000000' : '#FFFFFF') : this.fontBackground;
        const rgbValue: ColorValue = convertHexToColor(colorNameToHex(backgroundColor));
        const contrast: number = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
        const font: Chart3DTextFontModel = {
            size: argsData.textStyle.size || this.chart.themeStyle.datalabelFont.size,
            fontWeight: argsData.textStyle.fontWeight || this.chart.themeStyle.datalabelFont.fontWeight,
            fontStyle: argsData.textStyle.fontStyle || chart.themeStyle.datalabelFont.fontStyle,
            fontFamily: argsData.textStyle.fontFamily || this.chart.themeStyle.datalabelFont.fontFamily,
            color: argsData.textStyle.color || (this.chart.theme === 'Bootstrap5' ? '#212529' : this.chart.theme === 'Bootstrap5Dark' ? '#DEE2E6' : argsData.textStyle.color),
            opacity: argsData.textStyle.opacity
        };
        const element: Chart3DLabelElement = {
            width: size.width,
            height: size.height,
            label: commonEventArgs.data,
            textAnchor: 'middle',
            tag: tag,
            font: font,
            angle: series.dataLabel.angle,
            id: chart.element.id + '-svg' + '-series-' + series.index + '-point-' + pointIndex + '-data-label',
            child: chart.chart3D,
            argsData: argsData,
            fill: (contrast >= 128) ? (this.chart.theme.indexOf('Tailwind3') > -1 ? '#111827' : '#000000') : '#FFFFFF'
        };
        if (!argsData.cancel) {
            chart.graphics.addVisual(
                chart.polygon.createTextElement(
                    chart.vector.vector3D(pointX, pointY, point.symbolLocations.z), element, 0, -size.height), chart);
        }
    }

    /**
     * Gets the text for data labels associated with a specific data point in a 3D series.
     *
     * @param {Chart3DPoint} currentPoint - The data point for which data label text is generated.
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs.
     * @param {Chart3D} chart - The 3D chart containing the series and data point.
     * @returns {string[]} An array of text for data labels.
     */
    private getLabelText(currentPoint: Chart3DPoint, series: Chart3DSeries, chart: Chart3D): string[] {
        const labelFormat: string = series.dataLabel.format ? series.dataLabel.format : series.yAxis.labelFormat;
        const text: string[] = [];
        const customLabelFormat: boolean = labelFormat.match('{value}') !== null;
        text.push(currentPoint.text || currentPoint.yValue.toString());
        if ((labelFormat || chart.useGroupingSeparator) && !currentPoint.text) {
            series.yAxis.format = chart.intl.getNumberFormat({
                format: customLabelFormat ? '' : labelFormat,
                useGrouping: chart.useGroupingSeparator
            });
            for (let i: number = 0; i < text.length; i++) {
                text[i as number] = customLabelFormat ? labelFormat.replace('{value}', series.yAxis.format(parseFloat(text[i as number]))) :
                    series.yAxis.format(parseFloat(text[i as number]));
            }
        }
        return text;
    }

    /**
     * Creates a data label template for a specific data point in a 3D series.
     *
     * @param {HTMLElement} parentElement - The parent HTML element to which the data label template is attached.
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs.
     * @param {Chart3DDataLabelSettingsModel} dataLabel - The style settings for data labels.
     * @param {Chart3DPoint} point - The data point for which the data label template is created.
     * @param {Chart3DTextRenderEventArgs} data - The text render event arguments.
     * @param {number} labelIndex - The index of the data label.
     * @param {boolean} redraw - Indicates whether the template should be redrawn.
     * @param {Chart3DLocation} location - The location values for the data label.
     * @returns {void}
     */
    public createDataLabelTemplate(
        parentElement: HTMLElement, series: Chart3DSeries,
        dataLabel: Chart3DDataLabelSettingsModel, point: Chart3DPoint, data: Chart3DTextRenderEventArgs, labelIndex: number,
        redraw: boolean, location: Chart3DLocation
    ): void {
        this.margin = { left: 0, right: 0, bottom: 0, top: 0 };
        const clip: Rect = series.clipRect;
        const childElement: HTMLElement = this.createTemplate(
            createElement('div', {
                id: this.chart.element.id + '-series-' + series.index + '-data-label-' + labelIndex,
                styles: 'position: absolute;background-color:' + data.color + ';' +
                    getFontStyle(dataLabel.font, this.chart.themeStyle.datalabelFont) + ';border:' + data.border.width + 'px solid ' + data.border.color + ';'
            }),
            data.template, this.chart, point, series, this.chart.element.id + '-data-label-', labelIndex, location );
        this.calculateTemplateLabelSize(parentElement, childElement, point, series, dataLabel, clip, redraw, location);
    }

    /**
     * Calculates the size of a data label template for a specific data point in a 3D series.
     *
     * @param {HTMLElement} parentElement - The parent HTML element containing the data label template.
     * @param {HTMLElement} childElement - The child HTML element representing the data label template.
     * @param {Chart3DPoint} point - The data point for which the data label template size is calculated.
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs.
     * @param {Chart3DDataLabelSettingsModel} dataLabel - The style for data labels.
     * @param {Rect} clip - The rectangular clipping area.
     * @param {boolean} redraw - Indicates whether the template should be redrawn.
     * @param {Chart3DLocation} location - The location values for the data label.
     * @param {boolean} isReactCallback - Indicates whether the callback is associated with React.
     * @returns {void}
     */
    public calculateTemplateLabelSize(
        parentElement: HTMLElement, childElement: HTMLElement, point: Chart3DPoint, series: Chart3DSeries,
        dataLabel: Chart3DDataLabelSettingsModel, clip: Rect, redraw: boolean,
        location: Chart3DLocation, isReactCallback?: boolean
    ): void {
        const elementRect: ClientRect = measureElementRect(childElement, redraw, isReactCallback);
        const rect: Rect = { x: 0, y: 0, width: 0, height: 0 };
        const rectPosition: {left: number, top: number, right: number} = this.calculateTextPosition( series, point, elementRect, location);
        const clipWidth: number = 0;
        const clipHeight: number = 0;
        let isOverlap: boolean = false;
        if (isReactCallback) {
            isOverlap = (elementRect.width === 0 || elementRect.height === 0); // To check the data label already overlap before react callback call
        }
        childElement.style.left = (rectPosition.left - clipWidth) + 'px';
        childElement.style.top = (rectPosition.top + clipHeight) + 'px';
        const backgroundColor: string = this.fontBackground === 'transparent' ? (this.chart.theme.indexOf('Dark') > -1 ? 'black' : 'white') : this.fontBackground;
        const rgbValue: ColorValue = convertHexToColor(colorNameToHex(backgroundColor));
        const vAxis: Chart3DAxis = series.chart.requireInvertedAxis ? series.xAxis : series.yAxis;
        const hAxis: Chart3DAxis = series.chart.requireInvertedAxis ? series.yAxis : series.xAxis;
        childElement.style.color = dataLabel.font.color || this.chart.theme === 'Bootstrap5' ? '#212529' : this.chart.theme === 'Bootstrap5Dark' ? '#DEE2E6' :
            ((Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000)) >= 128 ? this.chart.theme.indexOf('Tailwind3') > -1 ? '#111827' : 'black' : this.chart.theme.indexOf('Tailwind3') > -1 ? '#FFFFFF' : 'white');
        if (childElement.childElementCount && !isOverlap && (!isCollide(rect, this.chart.dataLabelCollections, clip))
            && (point.yValue === undefined ||
                withIn(point.yValue, series.yAxis.visibleRange) || (series.type.indexOf('Stacking') > -1) ||
                (series.type.indexOf('100') > -1 && withIn(series.stackedValues.endValues[point.index], series.yAxis.visibleRange))) &&
            withIn(point.xValue, series.xAxis.visibleRange) && parseFloat(childElement.style.top) >= vAxis.rect.y &&
            parseFloat(childElement.style.left) >= hAxis.rect.x &&
            parseFloat(childElement.style.top) <= vAxis.rect.y + vAxis.rect.height &&
            parseFloat(childElement.style.left) <= hAxis.rect.x + hAxis.rect.width
        ) {
            this.chart.dataLabelCollections.push(new Rect(
                rect.x + clip.x, rect.y + clip.y, rect.width, rect.height
            ));
            appendChildElement(false, parentElement, childElement, redraw, true, 'left', 'top');
        }
    }

    /**
     * Calculates the text position for a data label associated with a specific data point in a 3D series.
     *
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs.
     * @param {Chart3DPoint} point - The data point for which the text position is calculated.
     * @param {ClientRect} elementSize - The size of the data label element.
     * @param {Chart3DLocation} location - The location values for the data label.
     * @returns {{ left: number, top: number, right: number }} An object representing the left, top, and right positions of the text.
     */
    private calculateTextPosition(series: Chart3DSeries, point: Chart3DPoint, elementSize: ClientRect,
                                  location: Chart3DLocation): { left: number, top: number, right: number } {
        const width: number = elementSize.width / 2;
        const height: number = elementSize.height;
        let left: number;
        let top: number;
        let right: number;
        if (series.type.indexOf('Bar') !== -1) {
            left = location.x - width;
            top = location.y - height + series.xAxis.plotOffset;
            right = location.x + width;
        } else {
            left = location.x - width;
            top = location.y - height;
            right = location.x + width;
        }
        return { left: left, top: top, right: right };
    }

    /**
     * Renders a React template for a data label associated with a specific data point in a 3D series.
     *
     * @param {HTMLElement} childElement - The child HTML element for the React template.
     * @param {Chart3D} chart - The 3D chart that contains the series and data point.
     * @param {Chart3DPoint} point - The data point for which the React template is rendered.
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs.
     * @param {number} labelIndex - The index of the data label.
     * @param {boolean} redraw - Indicates whether the template should be redrawn.
     * @param {Chart3DLocation} location - The location values for the data label.
     * @returns {void}
     */
    private chartReactTemplate(
        childElement: HTMLElement, chart: Chart3D, point: Chart3DPoint, series: Chart3DSeries,
        labelIndex: number, redraw?: boolean, location?: Chart3DLocation
    ): void {
        const parentElement: HTMLElement = document.getElementById(
            chart.element.id + '-series-' + series.index + '-data-label-collections'
        );
        if (parentElement) {
            if (point.index === 0) {
                chart.dataLabelCollections = []; // clear old datalabel bounds for react callback
            }
            chart.dataLabel3DModule.calculateTemplateLabelSize(
                parentElement, childElement, point, series, series.dataLabel,
                series.clipRect, redraw, location, true
            );
        }
    }

    /**
     * Creates a template element for rendering data labels associated with a specific data point in a 3D series.
     *
     * @param {HTMLElement} childElement - The child HTML element to contain the template content.
     * @param {string | Function} content - The content or function for the data label template.
     * @param {Chart3D} chart - The 3D chart containing the series and data point.
     * @param {Chart3DPoint} point - The data point for which the template is created (optional).
     * @param {Chart3DSeries} series - The 3D series to which the data point belongs (optional).
     * @param {string} dataLabelId - The ID for the data label element (optional).
     * @param {number} labelIndex - The index of the data label (optional).
     * @param {Chart3DLocation} location - The location values for the data label (optional).
     * @param {boolean} redraw - Indicates whether the template should be redrawn (optional).
     * @returns {HTMLElement} The created template element.
     */
    private createTemplate(
        childElement: HTMLElement, content: string | Function, chart: Chart3D,
        point?: Chart3DPoint, series?: Chart3DSeries, dataLabelId?: string,
        labelIndex?: number, location?: Chart3DLocation, redraw?: boolean
    ): HTMLElement {
        const templateFn: Function = getTemplateFunction(content);
        let templateElement: HTMLCollection;
        try {
            const tempObject: Object = { chart: chart, series: series, point: point };
            const templateId: string = dataLabelId + '-template';
            const elementData: Element[] = templateFn ? templateFn(tempObject, chart, templateId, dataLabelId) : [];
            if (elementData.length) {
                templateElement = Array.prototype.slice.call(elementData);
                const len: number = templateElement.length;
                for (let i: number = 0; i < len; i++) {
                    childElement.appendChild(templateElement[i as number]);
                }
            }
            let reactCallback: Function;
            if (chart.getModuleName() === 'chart3d') {
                reactCallback = (point && series) ? this.chartReactTemplate.bind(
                    this, childElement, chart, point, series, labelIndex, redraw, location
                ) : reactCallback;
                if ((chart as any).isReact) { (chart as any).renderReactTemplates(reactCallback); }
            }
        } catch (e) {
            return childElement;
        }
        return childElement;
    }

    /**
     * Gets the name of the data label module.
     *
     * @returns {string} The name of the data label module.
     */
    protected getModuleName(): string {
        // Returns the module name
        return 'DataLabel3D';
    }

    /**
     * To destroy the dataLabel for series.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        // Destroy method performed here
    }
}
