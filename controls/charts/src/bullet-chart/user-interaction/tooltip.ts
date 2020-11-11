import { BulletChart } from '../bullet-chart';
import { compile as templateComplier, updateBlazorTemplate, isBlazor } from '@syncfusion/ej2-base';
import { BulletLabelStyleModel } from '../model/bullet-base-model';
import { stringToNumber } from '../../common/utils/helper';
import { IBulletTooltipContent, IBulletchartTooltipEventArgs } from '../model/bullet-interface';
import { tooltipRender } from '../../common/model/constants';
import { BulletChartTheme } from '../utils/theme';
import { BulletChartAxis } from '../renderer/bullet-axis';


/**
 * `BulletTooltip` module is used to render the tooltip for bullet chart.
 */
export class BulletTooltip {
    private elementId: string;
    public toolTipInterval: number;
    private control: BulletChart;
    private templateFn: Function;
     /** @private */
     public bulletAxis: BulletChartAxis;

    /**
     * Constructor for tooltip module.
     * @private.
     */
    constructor(bullet: BulletChart) {
        this.control = bullet;
        this.elementId = bullet.element.id;
        this.bulletAxis = new BulletChartAxis(this.control);
    }

    /**
     * To create tooltip div element
     */
    public _elementTooltip(e: PointerEvent, targetClass: string, targetId: string, mouseX: number, mouseY: number): void {
        let titleStyle: BulletLabelStyleModel = this.control.titleStyle;
        let tooltipDiv: HTMLDivElement = <HTMLDivElement>this.control.createElement('div');
        tooltipDiv.id = 'tooltip';
        tooltipDiv.className = 'tooltipDiv';
        let target: Element = e.target as Element;
        let pointer: PointerEvent = e;
        let pageX: number = mouseX + 20;
        let pageY: number = e.clientY;
        let str: string = '';
        let font : string = this.control.tooltip.textStyle.fontStyle ? this.control.tooltip.textStyle.fontStyle :
        BulletChartTheme.tooltipLabelFont.fontStyle;
        let fill: string = this.control.tooltip.fill ? this.control.tooltip.fill : this.control.themeStyle.tooltipFill;
        let color: string = BulletChartTheme.tooltipLabelFont.color || this.control.themeStyle.tooltipBoldLabel;
        let fontSize: string = BulletChartTheme.titleFont.size;
        let style: string = 'left:' + pageX + 'px;' + 'top:' + pageY + 'px;' +
        'display: block; position: absolute; "z-index": "13000",cursor: default;' +
        'font-family: Segoe UI;' + 'color:' + color + '; font-size: 13px; background-color:' +
        fill + '; border: 1px solid #707070;' + 'font-style:' + font + ';';
        // adding css prop to the div
        tooltipDiv.setAttribute('style', style);
        if (targetClass === this.control.svgObject.id + '_Caption') {
            str = target.textContent === this.control.title ? '' : this.control.title;
        } else if (targetClass === this.control.svgObject.id + '_SubTitle') {
            str = target.textContent === this.control.subtitle ? '' : this.control.subtitle;
        }
        if (str !== '') {
            tooltipDiv.innerHTML = '&nbsp' + str + '&nbsp';
            document.body.insertAdjacentElement('afterbegin', tooltipDiv);
        }
    }


    /**
     * To display the bullet chart tooltip
     */
    // tslint:disable-next-line:max-func-body-length
    public _displayTooltip(e: PointerEvent, targetClass: string, targetId: string, mouseX: number, mouseY: number): void {
        if (targetClass !== 'undefined' && this.control.tooltip.enable && (targetClass === this.control.svgObject.id + '_FeatureMeasure' ||
            targetClass === this.control.svgObject.id + '_ComparativeMeasure')) {
            let locale: string = this.control.locale;
            let localizedText: boolean = locale && this.control.enableGroupSeparator;
            let data: IBulletTooltipContent;
            let blazorTooltipData: IBulletTooltipContent;
            let measureId: string;
            let currentVal: number;
            let targetVal: string[] = [];
            let categoryVal: number;
            let tooltipdiv: HTMLDivElement;
            let pointer: PointerEvent = e;
            let format: string = this.bulletAxis.getFormat(this.control);
            let isCustomFormat: boolean = format.match('{value}') !== null;
            measureId = targetId.substring(targetId.lastIndexOf('_') + 1);
            let targetValues: string[] = [];
            this.bulletAxis.format = this.bulletAxis.bulletChart.intl.getNumberFormat({
                format: isCustomFormat ? '' : format, useGrouping: this.bulletAxis.bulletChart.enableGroupSeparator
            });
            currentVal = this.control.dataSource[measureId][this.control.valueField];
            targetVal = targetVal.concat(this.control.dataSource[measureId][this.control.targetField]);
            categoryVal = this.control.dataSource[measureId][this.control.categoryField];
            let labelCurrentText: string = currentVal ? (currentVal).toString() : '';
            let labelTargetText: string = targetVal ? (targetVal).toString() : '';
            let labelCategoryText: string = categoryVal ? (categoryVal).toString() : '';
            labelCurrentText = this.bulletAxis.formatValue(this.bulletAxis, isCustomFormat, format, +currentVal);
            for (let i: number = 0; i < targetVal.length; i++) {
                // tslint:disable-next-line:max-line-length
                targetValues = targetValues.concat(this.bulletAxis.formatValue(this.bulletAxis, isCustomFormat, format, +targetVal[i]));
            }
            labelCategoryText = this.bulletAxis.formatValue(this.bulletAxis, isCustomFormat, format, +categoryVal);
            data = { value: labelCurrentText, target: targetValues, category: labelCategoryText };
            blazorTooltipData = { value: labelCurrentText, target: labelTargetText, category: labelCategoryText };
            let style: string = 'position: absolute; z-index: 13000; display: block;';
            if (document.getElementsByClassName('tooltipDiv' + this.control.element.id).length === 0) {
                tooltipdiv = <HTMLDivElement>this.control.createElement('div');
                tooltipdiv.id = 'tooltipDiv' + this.control.element.id;
                tooltipdiv.setAttribute('style', style);
                document.getElementById(this.control.element.id + '_Secondary_Element').appendChild(tooltipdiv);
            }
            let argsData: IBulletchartTooltipEventArgs = {
                value: data.value, target: data.target, name: tooltipRender
            };
            if (this.control.tooltip.template !== '' && this.control.tooltip.template != null) {
                this.updateTemplateFn();
                let elem: Element = this.control.createElement('div', { id: this.control.element.id + 'parent_template' });
                let templateElement: HTMLCollection = this.templateFn(
                        blazorTooltipData, this.control, 'template', elem.id + '_blazorTemplate', '', null, elem
                    );
                while (templateElement && templateElement.length > 0) {
                    if (isBlazor() || templateElement.length === 1) {
                        elem.appendChild(templateElement[0]);
                        templateElement = null;
                    } else {
                        elem.appendChild(templateElement[0]);
                    }
                }
                argsData.template = elem.innerHTML;
                this.control.trigger(tooltipRender, argsData);
                elem.innerHTML = argsData.template;
                tooltipdiv.appendChild(elem);
            } else {
                let argsText: string = 'Value : ' + argsData.value;
                for (let i: number = 0; i < argsData.target.length; i++) {
                    argsText += '<br/> Target' + (i === 0 ? '' : '_' + i) + ' : ' + argsData.target[i];
                }
                argsData.text = argsText;
                this.control.trigger(tooltipRender, argsData);
                tooltipdiv.innerHTML = argsData.text;
                tooltipdiv.style.font = this.control.tooltip.textStyle.fontStyle ? this.control.tooltip.textStyle.fontStyle :
                    BulletChartTheme.tooltipLabelFont.fontStyle;
                tooltipdiv.style.color = BulletChartTheme.tooltipLabelFont.color || this.control.themeStyle.tooltipBoldLabel;
                tooltipdiv.style.fontSize = BulletChartTheme.titleFont.size;
            }
            let fill: string = this.control.tooltip.fill ? this.control.tooltip.fill : this.control.themeStyle.tooltipFill;
            let borderWidth: number = this.control.tooltip.border.width ? this.control.tooltip.border.width : 1;
            let borderColor: string = this.control.tooltip.border.color ? this.control.tooltip.border.color : 'Black';
            let xPos: number = mouseX;
            let yPos: number = mouseY;
            xPos = ((xPos + stringToNumber(tooltipdiv.getAttribute('width'), this.control.containerWidth) < window.innerWidth) ?
                (xPos) : stringToNumber(tooltipdiv.getAttribute('width'), this.control.containerWidth));
            yPos = ((yPos + stringToNumber(tooltipdiv.getAttribute('height'), this.control.containerHeight) < window.innerHeight) ?
                (yPos) : stringToNumber(tooltipdiv.getAttribute('height'), this.control.containerHeight));
            if (xPos === undefined || xPos === null) {
                xPos = mouseX;
            }
            if (yPos === undefined || yPos === null) {
                yPos = e.clientY;
            }
            if (this.control.tooltip.template !== '' && this.control.tooltip.template != null) {
                tooltipdiv.setAttribute('style', 'position: absolute;left:' + (xPos + 20) + 'px;' + 'top:' + (yPos + 20) + 'px;');
                if (isBlazor()) {
                    updateBlazorTemplate(
                        this.control.element.id + 'parent_template' + '_blazorTemplate', 'Template', this.control.tooltip
                    );
                }
            } else {
                let divStyle: string = style + 'left:' + (xPos + 20) + 'px;' + 'top:' + (yPos + 20) + 'px;' +
                    '-webkit-border-radius: 5px 5px 5px 5px; -moz-border-radius: 5px 5px 5px 5px;-o-border-radius: 5px 5px 5px 5px;' +
                    'border-radius: 5px 5px 5px 5px;' + 'background-color:' + fill + ';' + 'color:' +
                    tooltipdiv.style.color + '; border:' + borderWidth + 'px Solid' + ' ' + borderColor + ';' +
                    'padding-bottom: 7px;' + 'font-style:' + BulletChartTheme.tooltipLabelFont.fontStyle +
                    '; padding-left: 10px; font-family: Segoe UI; padding-right: 10px; padding-top: 7px';
                tooltipdiv.setAttribute('style', divStyle);
                if ((targetClass === this.control.svgObject.id + '_FeatureMeasure') ||
                    (targetClass === this.control.svgObject.id + '_ComparativeMeasure')) {
                    document.getElementById(targetId).setAttribute('opacity', '0.6');
                }
            }
            // tslint:disable-next-line:no-any
            if ((this.control as any).isReact) { (this.control as any).renderReactTemplates(); }
        }
    }

    /**
     * To update template values in the tooltip
     */
    public updateTemplateFn(): void {
        if (this.control.tooltip.template) {
            let e: Object;
            try {
                if (document.querySelectorAll(this.control.tooltip.template).length) {
                    this.templateFn = templateComplier(document.querySelector(this.control.tooltip.template).innerHTML.trim());
                }
            } catch (e) {
                this.templateFn = templateComplier(this.control.tooltip.template);
            }
        }
    }
    /**
     * Get module name.
     */
    protected getModuleName(): string {
        return 'BulletTooltip';
    }
    /**
     * To destroy the tooltip.
     * @return {void}
     * @private
     */
    public destroy(chart: BulletChart): void {
        // Destroy method called here
    }
}