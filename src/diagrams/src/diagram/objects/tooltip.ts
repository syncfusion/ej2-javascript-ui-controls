import { Property, ChildProperty, isBlazor } from '@syncfusion/ej2-base';
import { Tooltip, AnimationModel, Position, TooltipEventArgs } from '@syncfusion/ej2-popups';
import { BlazorTooltip } from '../blazor-tooltip/blazor-Tooltip';
import { TooltipRelativeMode, TooltipMode } from '../enum/enum';
import { Diagram } from '../diagram';
import { NodeModel } from './node-model';
import { ConnectorModel } from './connector-model';
import { DiagramTooltipModel } from './tooltip-model';
/**
 * Defines the tooltip that should be shown when the mouse hovers over node.
 * An object that defines the description, appearance and alignments of tooltip
 */
export abstract class DiagramTooltip extends ChildProperty<DiagramTooltip> {
    /**
     * Defines the content of the Tooltip
     *
     * @default ''
     */
    @Property('')
    public content: string | HTMLElement;

    /**
     * Defines the position of the Tooltip
     *
     * @default 'TopLeft'
     * @aspDefaultValueIgnore
     * @blazorType Syncfusion.Blazor.Popups.Position
     * @blazorDefaultValue Syncfusion.Blazor.Popups.Position.TopLeft
     * @isEnumeration true
     */
    @Property('TopLeft')
    public position: Position;

    /**
     * Defines the relative mode of the Tooltip
     * * Object - sets the tooltip position relative to the node
     * * Mouse - sets the tooltip position relative to the mouse
     *
     * @default 'Mouse'
     */
    @Property('Mouse')
    public relativeMode: TooltipRelativeMode;

    /**
     * Defines if the Tooltip has tip pointer or not
     *
     * @default true
     */
    @Property(true)
    public showTipPointer: boolean;

    /**
     * Sets the width of the Tooltip
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: number | string;

    /**
     * Sets the height of the Tooltip
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: number | string;

    /**
     * Sets how to open the Tooltip
     *
     * @default 'Auto'
     */
    @Property('Auto')
    public openOn: TooltipMode;

    /**
     * Allows to set the same or different animation option for the Tooltip, when it is opened or closed.
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let diagram: Diagram = new Diagram({
     * ...
     * constraints: DiagramConstraints.Default | DiagramConstraints.Tooltip,
     * tooltip: { content: getcontent(), position: 'TopLeft', relativeMode: 'Object',
     * animation: { open: { effect: 'FadeZoomIn', delay: 0 },
     * close: { effect: 'FadeZoomOut', delay: 0 } } },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * function getcontent(): => {
     * ...
     * }
     * ```
     *
     * @aspDefaultValueIgnore
     * @blazorType Syncfusion.Blazor.Popups.AnimationModel
     * @default { open: { effect: 'FadeIn', duration: 150, delay: 0 }, close: { effect: 'FadeOut', duration: 150, delay: 0 } }
     */
    @Property()
    public animation: AnimationModel;
}

/**
 * initTooltip method \
 *
 * @returns { Tooltip | BlazorTooltip } initTooltip method .\
 * @param {Diagram} diagram - provide the points value.
 *
 * @private
 */
export function initTooltip(diagram: Diagram): Tooltip | BlazorTooltip {
    let tooltip: Tooltip | BlazorTooltip;
    if (!isBlazor()) {
        let tooltipOption: Tooltip = new Tooltip;
        tooltipOption = updateTooltipContent(diagram.tooltip, tooltipOption) as Tooltip;
        tooltip = new Tooltip(tooltipOption);
        tooltip.beforeCollision = beforeCollision;
        tooltip.beforeOpen = beforeOpen;
        tooltip.cssClass = 'e-diagram-tooltip';
        tooltip.opensOn = 'custom';
        tooltip.appendTo('#' + diagram.element.id);
        tooltip.close();
    } else {
        tooltip = new BlazorTooltip(diagram);
        tooltip = updateTooltipContent(diagram.tooltip, tooltip)as BlazorTooltip;
    }
    return tooltip ;
}

/**
 * beforeOpen method \
 *
 * @returns { void } beforeOpen method .\
 * @param {TooltipEventArgs} args - provide the points value.
 *
 * @private
 */
function beforeOpen(args: TooltipEventArgs): void {
    if ((this.content === '' || this.content === undefined)) {
        args.element.style.display = 'none';
    }
}

/**
 * beforeCollision method \
 *
 * @returns { void } beforeCollision method .\
 * @param {TooltipEventArgs} args - provide the points value.
 *
 * @private
 */
function beforeCollision(args: TooltipEventArgs): void {
    if ((args.collidedPosition && args.collidedPosition !== this.position)) {
        args.element.style.display = 'none';
    }
}

/**
 * updateTooltip method \
 *
 * @returns { Tooltip } updateTooltip method .\
 * @param {Diagram} diagram - provide the points value.
 * @param {NodeModel | ConnectorModel} node - provide the points value.
 *
 * @private
 */
export function updateTooltip(diagram: Diagram, node?: NodeModel | ConnectorModel): Tooltip {
    //let tooltip: DiagramTooltipModel;
    const tooltipObject: Tooltip = diagram.tooltipObject as Tooltip;
    const tooltip: DiagramTooltipModel = node ? node.tooltip : diagram.tooltip;
    updateTooltipContent(tooltip, tooltipObject);
    return tooltipObject;
}

/**
 * updateTooltipContent method \
 *
 * @returns { Tooltip | BlazorTooltip } updateTooltipContent method .\
 * @param {DiagramTooltipModel} tooltip - provide the points value.
 * @param {Tooltip | BlazorTooltip} tooltipObject - provide the points value.
 *
 * @private
 */
function updateTooltipContent(tooltip: DiagramTooltipModel, tooltipObject: Tooltip | BlazorTooltip): Tooltip | BlazorTooltip {
    if (tooltip.content) {
        tooltipObject.content = tooltip.content;
        tooltipObject.position = tooltip.position;
        tooltipObject.showTipPointer = tooltip.showTipPointer;
        tooltipObject.width = tooltip.width;
        tooltipObject.height = tooltip.height;
        if (!tooltip.animation) {
            tooltipObject.animation = { close: { effect: 'None' } };
        } else {
            tooltipObject.animation = tooltip.animation;
        }
    } else {
        tooltipObject.close();
    }
    return tooltipObject as Tooltip;
}



