import { Gradient } from '../core/appearance';
import { Canvas } from '../core/containers/canvas';
import { Container } from '../core/containers/container';
import { Diagram } from '../diagram';
import { GradientType, HorizontalAlignment, IconShapes, NodeConstraints, VerticalAlignment } from '../enum/enum';
import { AnnotationModel } from '../objects/annotation-model';
import { IconShapeModel } from '../objects/icon-model';
import { BasicShape, BpmnActivity, BpmnSubProcess, FlowShape, Shape, SwimLane } from '../objects/node';
import { LaneModel, NodeModel, PhaseModel, SwimLaneModel } from '../objects/node-model';
import { getTemplateContent } from '../utility/dom-util';
import { labels, LabelProperties } from './labelProperties';
import { PortProperties } from './portProperties';

export class NodeProperties {

    public labelProperties: LabelProperties;
    public portProperties: PortProperties;

    private diagram: Diagram;

    constructor(labelProperties: LabelProperties, portProperties : PortProperties) {
        this.labelProperties = labelProperties;
        this.portProperties = portProperties;

    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Convert and render the node collection from EJ1 to EJ2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public renderNodesCollection(convertedData: any, data: any): NodeModel {
        convertedData.nodes = [];
        let nodes: NodeModel[] = [];
        for (let i: number = 0; i < data.nodes.length; i++) {
            const node: any = data.nodes[parseInt(i.toString(), 10)];
            const processCollection: NodeModel[] = [];
            const newNode: NodeModel = this.convertToNode(node);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            // eslint-disable-next-line max-len
            if (newNode.shape && (newNode.shape as BpmnActivity).activity && (newNode.shape as any).activity.subProcess && (newNode.shape as any).activity.subProcess.processes &&  (newNode.shape as any).activity.subProcess.processes.length > 0) {
                const processName: any = [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                for (let k: number = 0; k < (newNode.shape as any).activity.subProcess.processes.length; k++) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const processes: any = (newNode.shape as any).activity.subProcess.processes[parseInt(k.toString(), 10)];
                    processes.margin.right = 0;
                    processes.margin.bottom = 0;
                    processes.processId = newNode.id;
                    processName.push(processes.id);
                    processCollection.push(processes);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (newNode.shape as any).activity.subProcess.processes = processName;
            }
            if (node.type === 'group' && !node.isSwimlane) {
                const childCollection: string[] = [];
                if (newNode.children && newNode.children.length > 0) {
                    for (let j: number = 0; j < newNode.children.length; j++) {
                        const child: any = newNode.children[parseInt(j.toString(), 10)];
                        nodes.push(child);
                        childCollection.push(child.id);
                    }
                    newNode.children = childCollection;
                }
            }
            nodes.push(newNode);
            if (processCollection && processCollection.length > 0) {
                nodes = nodes.concat(processCollection);
            }
        }
        convertedData.nodes = nodes;
        return convertedData.nodes;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Convert the node from EJ1 to EJ2 and assign all the properties
    public convertToNode(node: NodeModel): NodeModel {
        let newNode: any = {};
        newNode.style = {};
        newNode.margin = {};
        if ((node as EJ1Node).name) {
            newNode.id = (node as EJ1Node).name;
        }
        if ((node as EJ1Node).fillColor) {
            newNode.style.fill = (node as EJ1Node).fillColor;
        }
        if (node.borderColor) {
            newNode.style.strokeColor = node.borderColor;
        }
        if (node.borderWidth) {
            newNode.style.strokeWidth = node.borderWidth;
        }
        if ((node as EJ1Node).borderDashArray) {
            newNode.style.strokeDashArray = (node as EJ1Node).borderDashArray;
        }
        if ((node as EJ1Node).opacity) {
            newNode.style.opacity = (node as EJ1Node).opacity;
        }
        if ((node as EJ1Node).gradient) {
            newNode.style.gradient = this.setGradient((node as EJ1Node).gradient);
        }
        if (node.isExpanded) {
            newNode.isExpanded = node.isExpanded;
        }
        if (node.width) {
            newNode.width = node.width;
        }
        if (node.height) {
            newNode.height = node.height;
        }
        if (node.offsetX) {
            newNode.offsetX = node.offsetX;
        }
        if (node.offsetY) {
            newNode.offsetY = node.offsetY;
        }
        if (node.visible) {
            newNode.visible = node.visible;
        }
        newNode.zIndex = (node as EJ1Node).zOrder === -1 ? -1 : (node as EJ1Node).zOrder;
        if (node.excludeFromLayout) {
            newNode.excludeFromLayout = node.excludeFromLayout;
        }
        if (node.rotateAngle) {
            newNode.rotateAngle = node.rotateAngle;
        }
        if (node.pivot) {
            newNode.pivot = node.pivot;
        }
        if (node.addInfo) {
            newNode.addInfo = node.addInfo;
        }
        if ((node as EJ1Node).marginLeft) {
            newNode.margin.left = (node as EJ1Node).marginLeft;
        }
        if ((node as EJ1Node).marginRight) {
            newNode.margin.right = (node as EJ1Node).marginRight;
        }
        if ((node as EJ1Node).marginTop) {
            newNode.margin.top = (node as EJ1Node).marginTop;
        }
        if ((node as EJ1Node).marginBottom) {
            newNode.margin.bottom = (node as EJ1Node).marginBottom;
        }
        if ((node as EJ1Node).horizontalAlign) {
            newNode.horizontalAlignment = (node as EJ1Node).horizontalAlign;
        }
        if ((node as EJ1Node).verticalAlign) {
            newNode.verticalAlignment = (node as EJ1Node).verticalAlign;
        }
        if (node.constraints) {
            newNode.constraints = this.setNodeConstraints(node.constraints);
        }
        if ((node as EJ1Node).labels) {
            newNode.annotations = this.labelProperties.setLabelProperties((node as EJ1Node).labels, undefined);
        }
        if (node.shadow) {
            newNode.shadow = {
                angle: node.shadow.angle, opacity: node.shadow.opacity, distance: node.shadow.distance
            };
        }
        if (node.tooltip) {
            newNode.tooltip = {
                // content: this.getTemplateContent(node.tooltip.templateId),
                relativeMode: node.tooltip.relativeMode
            };
        }
        if (node.expandIcon) {
            newNode.expandIcon = {
                shape: node.expandIcon.shape.charAt(0).toUpperCase() + (node.expandIcon.shape).slice(1) as IconShapes,
                width: node.expandIcon.width, height: node.expandIcon.height,
                margin: {
                    left: node.expandIcon.margin.left,
                    right: node.expandIcon.margin.right,
                    top: node.expandIcon.margin.top,
                    bottom: node.expandIcon.margin.bottom
                },
                offset: {
                    x: node.expandIcon.offset.x,
                    y: node.expandIcon.offset.y
                },
                borderColor: node.expandIcon.borderColor, borderWidth: node.expandIcon.borderWidth,
                cornerRadius: node.expandIcon.cornerRadius,
                //fill: (node.expandIcon as any).fillColor,
                pathData: node.expandIcon.pathData
                // content: getTemplateContent(node.expandIcon.templateId)
            };
            if (newNode.expandIcon.shape === 'Arrowup' as any) {
                newNode.expandIcon.shape = 'ArrowUp';
            }else if (newNode.expandIcon.shape === 'Arrowdown' as any) {
                newNode.expandIcon.shape = 'ArrowDown';
            }
        }
        if (node.collapseIcon) {
            newNode.collapseIcon = {
                shape: node.collapseIcon.shape.charAt(0).toUpperCase() + (node.collapseIcon.shape).slice(1) as IconShapes,
                width: node.collapseIcon.width, height: node.collapseIcon.height,
                margin: {
                    left:  node.collapseIcon.margin.left,
                    right: node.collapseIcon.margin.right,
                    top: node.collapseIcon.margin.top,
                    bottom: node.collapseIcon.margin.bottom
                },
                offset: {
                    x: node.collapseIcon.offset.x,
                    y: node.collapseIcon.offset.y
                },
                borderColor: node.collapseIcon.borderColor, borderWidth: node.collapseIcon.borderWidth,
                cornerRadius: node.collapseIcon.cornerRadius,
                // fill: (node.collapseIcon as any).fillColor,
                pathData: node.collapseIcon.pathData
                //  content: getTemplateContent(node.collapseIcon.templateId)
            };
            if (newNode.collapseIcon.shape === 'Arrowup' as any) {
                newNode.collapseIcon.shape = 'ArrowUp';
            }else if (newNode.collapseIcon.shape === 'Arrowdown' as any) {
                newNode.collapseIcon.shape = 'ArrowDown';
            }
        }
        if (node.ports) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newNode.ports = this.portProperties.setPortProperties(node.ports as any);
        }
        if (node.children) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((node as any).type !== 'bpmn' && !(node as any).isSwimlane) {
                newNode.children = this.getChildren(newNode, node as EJ1Node);
            }
        }
        if (!(node.children && node.children.length > 0)) {
            newNode.maxWidth = node.maxWidth;
            newNode.maxHeight = node.maxHeight;
            newNode.minWidth = node.minWidth;
            newNode.minHeight = node.minHeight;
        }
        if (node.shape || (node as any).type) {
            newNode = this.setShape(newNode, node);
        }
        return newNode;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Iterate the swimlane child nodes and assign all the node properties from the EJ1 to EJ2
    public getChildren(newNode: NodeModel, node: NodeModel): any {
        if (node.children && node.children.length > 0) {
            const newChild : NodeModel[] = [];
            for (let i: number = 0; i < node.children.length; i++) {
                const child: NodeModel = this.convertToNode(node.children[parseInt(i.toString(), 10)] as NodeModel);
                if (child.children) {
                    this.getChildren(newNode, child as EJ1Node);
                }
                newChild.push(child);
            }
            (newNode.children as NodeModel[]) = newChild;
        }
        return (newNode as any).children;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Sets the shapes for all the node from conversion
    public setShape(newNode: any, node: any): any {
        switch (node.type) {
        case 'basic': {
            const basicShape: BasicShape = (node.shape).charAt(0).toUpperCase() + (node.shape).slice(1);
            if (node.shape === 'path') {
                newNode.shape = { type: 'Path', data: node.pathData };
            }
            else {
                newNode.shape = {
                    type: 'Basic', shape: basicShape, cornerRadius: node.cornerRadius, points: node.points
                };
            }
            break;
        }
        case 'flow': {
            const flowShape: FlowShape = (node.shape).charAt(0).toUpperCase() + (node.shape).slice(1);
            newNode.shape = {
                type: 'Flow', shape: flowShape
            };
            break;
        }
        case 'umlactivity':
            newNode.shape = {
                type: 'UmlActivity', shape: (node.shape).charAt(0).toUpperCase() + (node.shape).slice(1)
            };
            break;
        case 'image':
            newNode.shape = {
                type: 'Image', source: node.source, align: this.getImageContentAlignment(node.contentAlignment),
                scale: (node.scale).charAt(0).toUpperCase() + (node.scale).slice(1)
            };
            break;
        case 'html':
            newNode.shape = { type: 'HTML' };
            break;
        case 'native':
            newNode.shape = { type: 'Native' };
            break;
        case 'text':
            newNode.shape = { type: 'Text', content: node.textBlock.text };
            break;
        case 'bpmn':
            newNode.shape = this.renderBpmnShape(newNode, node);
            break;
        case 'group':
            if (node.isSwimlane) {
                newNode.shape = this.renderSwimlaneShape(newNode, node);
            }
        }
        return newNode;
    }

    public getImageContentAlignment(option: string): string {
        if (option) {
            switch (option) {
            case 'xminymin':
                return 'XMinYMin';
            case 'xminymid':
                return 'XMinYMid';
            case 'xminymax':
                return 'XMinYMax';
            case 'xmidymin':
                return 'XMidYMin';
            case 'xmidymid':
                return 'XMidYMid';
            case 'xmidymax':
                return 'XMidYMax';
            case 'xmaxymin':
                return 'XMaxYMin';
            case 'xmaxymid':
                return 'XMaxYMid';
            case 'xmaxymax':
                return 'XMaxYMax';
            case 'none':
                return 'None';
            }
        }
        return 'None';
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    // Sets the node constraints from EJ1 to EJ2
    public setNodeConstraints(constraints: number): number {
        let nodeConstraints : number = NodeConstraints.None;
        if (constraints & NodeConstraints.Select) {
            nodeConstraints = nodeConstraints | NodeConstraints.Select;
        }
        if (constraints & NodeConstraints.Delete) {
            nodeConstraints = nodeConstraints | NodeConstraints.Delete;
        }
        if (constraints & NodeConstraints.Drag) {
            nodeConstraints = nodeConstraints | NodeConstraints.Drag;
        }
        if (constraints & NodeConstraints.Rotate) {
            nodeConstraints = nodeConstraints | NodeConstraints.Rotate;
        }
        if (constraints & NodeConstraints.ResizeNorthEast) {
            nodeConstraints = nodeConstraints | NodeConstraints.ResizeNorthEast;
        }
        if (constraints & NodeConstraints.ResizeEast) {
            nodeConstraints = nodeConstraints | NodeConstraints.ResizeEast;
        }
        if (constraints & NodeConstraints.OutConnect) {
            nodeConstraints = nodeConstraints | NodeConstraints.ResizeSouthEast;
        }
        if (constraints & NodeConstraints.Expandable) {
            nodeConstraints = nodeConstraints | NodeConstraints.ResizeSouth;
        }
        if (constraints & NodeConstraints.AllowDrop) {
            nodeConstraints = nodeConstraints | NodeConstraints.ResizeSouthWest;
        }
        if (constraints & NodeConstraints.ResizeNorthEast) {
            nodeConstraints = nodeConstraints | NodeConstraints.ResizeWest;
        }
        if (constraints & NodeConstraints.ResizeEast) {
            nodeConstraints = nodeConstraints | NodeConstraints.ResizeNorthWest;
        }
        if (constraints & NodeConstraints.ResizeNorth) {
            nodeConstraints = nodeConstraints | NodeConstraints.ResizeNorth;
        }
        if (constraints & NodeConstraints.Resize) {
            nodeConstraints = nodeConstraints | NodeConstraints.Resize;
        }
        if (constraints & NodeConstraints.Shadow) {
            nodeConstraints = nodeConstraints | NodeConstraints.Shadow;
        }
        if (constraints & NodeConstraints.AspectRatio) {
            nodeConstraints = nodeConstraints | NodeConstraints.AspectRatio;
        }
        if (constraints & NodeConstraints.AllowDrop) {
            nodeConstraints = nodeConstraints | NodeConstraints.AllowDrop;
        }
        if (constraints & NodeConstraints.InheritTooltip) {
            nodeConstraints = nodeConstraints | NodeConstraints.InheritTooltip;
        }
        if (constraints & NodeConstraints.PointerEvents) {
            nodeConstraints = nodeConstraints | NodeConstraints.PointerEvents;
        }
        if (constraints & NodeConstraints.Inherit) {
            nodeConstraints = nodeConstraints | NodeConstraints.Inherit;
        }
        if (constraints & NodeConstraints.Default) {
            nodeConstraints = nodeConstraints | NodeConstraints.Default;
        }
        return nodeConstraints;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Sets the gradient for the nodes
    public setGradient(gradient: any): any {
        let newGradient: any = {};
        if (gradient) {
            if (gradient.type === 'linear') {
                newGradient = {
                    type: 'Linear',
                    x1: gradient.x1, x2: gradient.x2, y1: gradient.y1, y2: gradient.y2,
                    stops: this.getGradientStops(gradient.stops)
                };
            }
            else if (gradient.type === 'radial') {
                newGradient = {
                    type: 'Radial',
                    cx: gradient.cx, cy: gradient.cy, fx: gradient.fx, fy: gradient.fy,
                    stops: this.getGradientStops(gradient.stops)
                };
            }
        }
        return newGradient;
    }

    public getGradientStops(gradientStops: any[]): any[] {
        const stopsCollection: any[] = [];
        for (let i: number = 0; i < gradientStops.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newStop: any = {};
            const stop: any = gradientStops[parseInt(i.toString(), 10)];
            newStop.color = stop.color;
            newStop.offset = stop.offset;
            stopsCollection.push(newStop);
        }
        return stopsCollection;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Assign the BPMN shape values from the EJ1
    public renderBpmnShape(newNode: any, node: any): any {
        if (node.shape === 'event') {
            newNode.shape = {
                type: 'Bpmn',
                shape: (node.shape).charAt(0).toUpperCase() + (node.shape).slice(1),
                event: {
                    event: (node.event).charAt(0).toUpperCase() + (node.event).slice(1),
                    trigger: (node.trigger).charAt(0).toUpperCase() + (node.trigger).slice(1)
                }
            };
        }
        else if (node.shape === 'gateway') {
            newNode.shape = {
                type: 'Bpmn',
                shape: (node.shape).charAt(0).toUpperCase() + (node.shape).slice(1),
                gateway: {
                    type: (node.gateway).charAt(0).toUpperCase() + (node.gateway).slice(1)
                }
            };
        }
        else if (node.shape === 'activity') {
            newNode.shape = {
                type: 'Bpmn',
                shape: (node.shape).charAt(0).toUpperCase() + (node.shape).slice(1),
                activity: {
                    activity: (node.activity).charAt(0).toUpperCase() + (node.activity).slice(1)
                }
            };
            newNode.shape.activity.activity =  newNode.shape.activity.activity === 'Subprocess' ? 'SubProcess' : newNode.shape.activity.activity;
            if (node.activity === 'task') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (newNode.shape as any).activity.task = {
                    type: (node.task.type).charAt(0).toUpperCase() + (node.task.type).slice(1),
                    loop: (node.task.loop).charAt(0).toUpperCase() + (node.task.loop).slice(1),
                    compensation: node.task.compensation,
                    call: node.task.call
                };
            }
            if (node.activity === 'subprocess') {
                if (node.subProcess.type === 'event') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (newNode.shape as any).activity.subProcess = {
                        collapsed: node.subProcess.collapsed,
                        compensation: node.subProcess.compensation,
                        adhoc: node.subProcess.adhoc,
                        loop: (node.subProcess.loop).charAt(0).toUpperCase() + (node.subProcess.loop).slice(1),
                        boundary: (node.subProcess.boundary).charAt(0).toUpperCase() + (node.subProcess.boundary).slice(1),
                        type: (node.subProcess.type).charAt(0).toUpperCase() + (node.subProcess.type).slice(1),
                        event: {
                            event: (node.subProcess.event).charAt(0).toUpperCase() + (node.subProcess.event).slice(1),
                            trigger: (node.subProcess.trigger).charAt(0).toUpperCase() + (node.subProcess.trigger).slice(1)
                        }
                    };
                }
                else if (node.subProcess.type === 'transaction') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (newNode.shape as any).activity.subProcess = {
                        collapsed: node.subProcess.collapsed,
                        compensation: node.subProcess.compensation,
                        adhoc: node.subProcess.adhoc,
                        loop: (node.subProcess.loop).charAt(0).toUpperCase() + (node.subProcess.loop).slice(1),
                        boundary: (node.subProcess.boundary).charAt(0).toUpperCase() + (node.subProcess.boundary).slice(1),
                        type: (node.subProcess.type).charAt(0).toUpperCase() + (node.subProcess.type).slice(1),
                        events: this.renderEventsCollection(node.subProcess.events),
                        processes: this.renderProcessesCollection(node)
                    };
                }
            }
        }
        else if (node.shape === 'dataobject') {
            newNode.shape = {
                type: 'Bpmn',
                shape: (node.shape).charAt(0).toUpperCase() + (node.shape).slice(1)
                // data: {
                //     type: this.getKeyByValue(node.data.type),
                //     collection: true
                // }
            };
            if (node.annotation) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (newNode.shape as any).annotation = {
                    text: node.annotation.text,
                    angle: node.annotation.angle,
                    width: node.annotation.width,
                    height: node.annotation.height,
                    length: node.annotation.length
                };
            }
        }
        else {
            newNode.shape = {
                type: 'Bpmn',
                shape: (node.shape).charAt(0).toUpperCase() + (node.shape).slice(1)
            };
        }
        return newNode.shape;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Renders the swimlane from the conversion
    public renderSwimlaneShape(newNode: any, node: any): any {
        newNode.shape = {
            type: 'SwimLane', orientation: (node.orientation).charAt(0).toUpperCase() + (node.orientation).slice(1),
            header: {
                annotation: { content: node.header.text },
                height: 50, style: { fontSize: node.header.fontSize, color: node.header.fontColor, fill: node.header.fillColor }
            }
        };
        const lanes: LaneModel[] = [];
        const phases: PhaseModel[] = [];
        for (let i: number = 0; i < node.lanes.length; i++) {
            lanes[parseInt(i.toString(), 10)] = {
                header: {
                    annotation: {
                        content: node.lanes[parseInt(i.toString(), 10)].header.text,
                        width: node.lanes[parseInt(i.toString(), 10)].header.width,
                        style: {
                            fontSize: node.lanes[parseInt(i.toString(), 10)].header.fontSize,
                            color: node.lanes[parseInt(i.toString(), 10)].header.fontColor
                        }
                    }
                },
                style: { fill: node.lanes[parseInt(i.toString(), 10)].fillColor },
                children: []
            };
            for (let j: number = 0; j < node.lanes[parseInt(i.toString(), 10)].children.length; j++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const childNode: any = this.convertToNode(node.lanes[parseInt(i.toString(), 10)].children[parseInt(j.toString(), 10)]);
                if (childNode.wrapper == null) {
                    childNode.wrapper = {
                        actualSize: { width: childNode.width, height: childNode.height },
                        offsetX: childNode.offsetX, offsetY: childNode.offsetY
                    };
                }
                lanes[parseInt(i.toString(), 10)].children.push(childNode);
            }
        }
        for (let i: number = 0; i < node.phases.length; i++) {
            phases[parseInt(i.toString(), 10)] = {
                header: {
                    annotation: {
                        content: node.phases[parseInt(i.toString(), 10)].label.text,
                        // eslint-disable-next-line max-len
                        style: { fill: node.phases[parseInt(i.toString(), 10)].label.fillColor, fontSize: node.phases[parseInt(i.toString(), 10)].label.fontSize, color: node.phases[parseInt(i.toString(), 10)].label.fontColor }
                    }
                },
                offset: node.phases[parseInt(i.toString(), 10)].offset,
                // eslint-disable-next-line max-len
                style: { fill: node.phases[parseInt(i.toString(), 10)].fillColor, strokeColor: node.phases[parseInt(i.toString(), 10)].lineColor, strokeDashArray: node.phases[parseInt(i.toString(), 10)].lineDashArray }
            };
        }
        newNode.shape.lanes = lanes;
        newNode.shape.phases = phases;
        return newNode.shape;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Rendered the event collections for the node properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public renderEventsCollection(subProcessEvents: any): any {
        const eventsCollection: any = [];
        if (subProcessEvents.length > 0) {
            for (let i: number = 0; i < subProcessEvents.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newEvent: any = {};
                const eventObject: any = subProcessEvents[parseInt(i.toString(), 10)];
                newEvent.event = (eventObject.event).charAt(0).toUpperCase() + (eventObject.event).slice(1);
                newEvent.trigger = (eventObject.trigger).charAt(0).toUpperCase() + (eventObject.trigger).slice(1);
                newEvent.offset = { x: eventObject.offset.x, y: eventObject.offset.y };
                eventsCollection.push(newEvent);
            }
        }
        return eventsCollection;
    }
    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Rendered the process collections for the node properties
    public renderProcessesCollection(node: any): any[] {
        const processesCollection: any[] = [];
        if (node.subProcess && node.subProcess.processes.length > 0) {
            for (let i: number = 0; i < node.subProcess.processes.length; i++) {
                const processObject: any = node.subProcess.processes[parseInt(i.toString(), 10)];
                const data: NodeModel = this.convertToNode(processObject);
                processesCollection.push(data);
            }
        }
        return processesCollection;
    }

    /**
     * Get module name.
     * @returns {string} Returns the module name
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'NodeProperties';

    }

}

export interface EJ1Node extends NodeModel {


    name: string;

    labels: AnnotationModel[];

    fillColor: string;

    borderDashArray: string;

    opacity: number;

    gradient: string;

    zOrder: number;

    marginLeft: number;

    marginTop: number;

    marginRight: number;

    marginBottom: number;

    horizontalAlign: EJ1HorizontalAlignment;

    verticalAlign: EJ1VerticalAlignment;

}

export type EJ1HorizontalAlignment =
    /**
     * Stretch - Stretches the diagram element throughout its immediate parent
     */
    'Stretch' |
    /**
     * Left - Aligns the diagram element at the left of its immediate parent
     */
    'Left' |
    /**
     * Right - Aligns the diagram element at the right of its immediate parent
     */
    'Right' |
    /**
     * Center - Aligns the diagram element at the center of its immediate parent
     */
    'Center' |
    /**
     * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     */
    'Auto';

/**
 * Defines how the diagram elements have to be aligned with respect to its immediate parent
 * * Stretch - Stretches the diagram element throughout its immediate parent
 * * Top - Aligns the diagram element at the top of its immediate parent
 * * Bottom - Aligns the diagram element at the bottom of its immediate parent
 * * Center - Aligns the diagram element at the center of its immediate parent
 * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
 */
export type EJ1VerticalAlignment =
    /**
     * Stretch - Stretches the diagram element throughout its immediate parent
     */
    'Stretch' |
    /**
     * Top - Aligns the diagram element at the top of its immediate parent
     */
    'Top' |
    /**
     * Bottom - Aligns the diagram element at the bottom of its immediate parent
     */
    'Bottom' |
    /**
     * Center - Aligns the diagram element at the center of its immediate parent
     */
    'Center' |
    /**
     * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     */
    'Auto';
