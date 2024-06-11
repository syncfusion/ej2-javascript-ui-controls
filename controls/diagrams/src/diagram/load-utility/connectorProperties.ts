import { NumericOptions } from '@syncfusion/ej2-base/src/intl/parser-base';
import { Canvas } from '../core/containers/canvas';
import { Diagram } from '../diagram';
import { ConnectorConstraints, Shapes } from '../enum/enum';
import { Segment } from '../interaction/scroller';
import { AnnotationModel } from '../objects/annotation-model';
import { BezierSegment, Connector, ConnectorShape } from '../objects/connector';
import { BezierSegmentModel, ConnectorModel, ConnectorSegmentModel } from '../objects/connector-model';
import { Shape } from '../objects/node';
import { Point } from '../primitives/point';
import { SegmentInfo } from '../rendering/canvas-interface';
import { LabelProperties } from './labelProperties';


export class ConnectorProperties {
    private diagram: Diagram;
    public labelProperties: LabelProperties;

    constructor(labelProperties: LabelProperties) {
        this.labelProperties = labelProperties;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Convert and render the connector collection from EJ1 to EJ2
    public renderConnectorsCollection(convertedData: Object, data: Diagram): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (convertedData as any).connectors = [];
        const connectors: ConnectorModel[] = [];
        for (let i: number = 0; i < data.connectors.length; i++) {
            const connector: ConnectorModel = data.connectors[parseInt(i.toString(), 10)];
            const newConnector: ConnectorModel = this.convertToConnector(connector);
            connectors.push(newConnector);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (convertedData as any).connectors = connectors;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Convert and render the connector properties from EJ1 to EJ2
    public convertToConnector(connector: ConnectorModel): ConnectorModel {
        const newConnector: ConnectorModel = {};
        newConnector.style = {};

        if ((connector as EJ1Connector).name) {
            newConnector.id = (connector as EJ1Connector).name;
        }
        if (connector.addInfo) {
            newConnector.addInfo = connector.addInfo;
        }
        if (connector.bridgeSpace) {
            newConnector.bridgeSpace = connector.bridgeSpace;
        }
        if (connector.constraints) {
            newConnector.constraints = this.setConnectorConstraints(connector.constraints);
        }
        if (connector.cornerRadius) {
            newConnector.cornerRadius = connector.cornerRadius;
        }
        if ((connector as EJ1Connector).labels) {
            newConnector.annotations = this.labelProperties.setLabelProperties((connector as EJ1Connector).labels, connector);
        }
        if ((connector as EJ1Connector).lineColor) {
            newConnector.style.fill = (connector as EJ1Connector).lineColor;
        }
        if ((connector as EJ1Connector).lineWidth) {
            newConnector.style.strokeWidth = (connector as EJ1Connector).lineWidth;
        }
        if ((connector as EJ1Connector).lineDashArray) {
            newConnector.style.strokeDashArray = (connector as EJ1Connector).lineDashArray;
        }
        if ((connector as EJ1Connector).opacity) {
            newConnector.style.opacity = (connector as EJ1Connector).opacity;
        }
        if ((connector as EJ1Connector).lineHitPadding) {
            newConnector.hitPadding = (connector as EJ1Connector).lineHitPadding;
        }
        if (connector.margin) {
            // eslint-disable-next-line max-len
            newConnector.margin = { left: connector.margin.left, right: connector.margin.right, top: connector.margin.top, bottom: connector.margin.bottom };
        }
        if (connector.segments) {
            (newConnector as any).type = connector.segments[0].type;
            newConnector.segments = this.setConnectorSegments(connector.segments);
        }
        if (connector.shape) {
            newConnector.shape = this.getConnectorShape(connector.shape);
        }
        if (connector.sourceDecorator) {
            newConnector.sourceDecorator = {
                height: connector.sourceDecorator.height,
                width: connector.sourceDecorator.width,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                shape: (this.getDecoratorShape(connector.sourceDecorator.shape)) as any,
                pathData: connector.sourceDecorator.pathData,
                style: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    fill: (connector.sourceDecorator as any).fillColor,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    strokeColor: (connector.sourceDecorator as any).lineColor,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    strokeWidth: (connector.sourceDecorator as any).lineWidth
                }
            };
        }
        if (connector.targetDecorator) {
            newConnector.targetDecorator = {
                height: connector.targetDecorator.height,
                width: connector.targetDecorator.width,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                shape: this.getDecoratorShape(connector.targetDecorator.shape) as any,
                pathData: connector.targetDecorator.pathData,
                style: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    fill: (connector.targetDecorator as any).fillColor,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    strokeColor: (connector.targetDecorator as any).lineColor,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    strokeWidth: (connector.targetDecorator as any).lineWidth
                }
            };
        }
        if (connector.sourceID) {
            newConnector.sourceID = connector.sourceID;
        }
        if (connector.targetID) {
            newConnector.targetID = connector.targetID;
        }
        if (connector.sourcePoint) {
            newConnector.sourcePoint = { x: connector.sourcePoint.x, y: connector.sourcePoint.y };
        }
        if (connector.targetPoint) {
            newConnector.targetPoint = { x: connector.targetPoint.x, y: connector.targetPoint.y };
        }
        if (connector.sourcePortID) {
            newConnector.sourcePortID = connector.sourcePortID;
        }
        if (connector.targetPortID) {
            newConnector.targetPortID = connector.targetPortID;
        }
        if (connector.tooltip) {
            newConnector.tooltip = {
                content: connector.tooltip.content,
                relativeMode: connector.tooltip.relativeMode
            };
        }
        if (connector.visible) {
            newConnector.visible = connector.visible;
        }
        if (connector.zIndex) {
            newConnector.zIndex = connector.zIndex;
        }
        return newConnector;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Convert and assign the connector shapes from EJ1 to EJ2
    public getConnectorShape(shape: any): any {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let connectorShape: any = null;
        if (shape) {
            if (shape.type === 'bpmn') {
                connectorShape = {
                    type: 'Bpmn',
                    flow: (shape.flow).charAt(0).toUpperCase() + (shape.flow).slice(1)
                };
                if (shape.flow === 'sequence') {
                    connectorShape.sequence = (shape.sequence).charAt(0).toUpperCase() + (shape.sequence).slice(1);
                } else if (shape.flow === 'association') {
                    connectorShape.association = (shape.association).charAt(0).toUpperCase() + (shape.association).slice(1);
                } else {
                    connectorShape.message = (shape.message).charAt(0).toUpperCase() + (shape.message).slice(1);
                }
            }
            if (shape.type === 'umlclassifier') {
                connectorShape = {
                    type: 'UmlClassifier',
                    relationship: (shape.relationship).charAt(0).toUpperCase() + (shape.relationship).slice(1),
                    multiplicity: {
                        type: (shape.multiplicity.type).charAt(0).toUpperCase() + (shape.multiplicity.type).slice(1),
                        source: {
                            upperBounds: shape.multiplicity.source.upperBounds,
                            optional: shape.multiplicity.source.optional,
                            lowerBounds: shape.multiplicity.source.lowerBounds
                        },
                        target: {
                            upperBounds: shape.multiplicity.target.upperBounds,
                            optional: shape.multiplicity.target.optional,
                            lowerBounds: shape.multiplicity.target.lowerBounds
                        }
                    }
                };
            }
            if (shape.type === 'umlactivity') {
                connectorShape = {
                    type: 'UmlActivity',
                    flow: (shape.flow).charAt(0).toUpperCase() + (shape.flow).slice(1)
                };
            }
        }
        return connectorShape;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Sets the connector decorator shapes from EJ1 to EJ2
    public getDecoratorShape(shape: string): string {
        let decoratorShape: string = 'None';
        if (shape === 'path') {
            decoratorShape = 'Custom';
        }
        else {
            decoratorShape = (shape).charAt(0).toUpperCase() + (shape).slice(1);
        }
        return decoratorShape;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Convert and render the connector collection from EJ1 to EJ2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public setConnectorSegments(segments: any): any {
        const connectorSegments: any[] = [];
        if (segments.length > 0) {
            for (let i: number = 0; i < segments.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const segment: any = {};
                const segmentProp: any = segments[parseInt(i.toString(), 10)];
                // eslint-disable-next-line max-len
                segment.direction = segmentProp.direction ? segmentProp.direction.charAt(0).toUpperCase() + segmentProp.direction.slice(1) : segmentProp._direction ? segmentProp._direction.charAt(0).toUpperCase() + segmentProp._direction.slice(1) : null;
                segment.length = segmentProp.length;
                segment.point = segmentProp.point ? { x: segmentProp.point.x, y: segmentProp.point.y } : null;
                segment.point1 = segmentProp.point1 ? { x: segmentProp.point1.x, y: segmentProp.point1.y } : null;
                segment.point2 = segmentProp.point2 ? { x: segmentProp.point2.x, y: segmentProp.point2.y } : null;
                // eslint-disable-next-line max-len
                segment.vector1 = segmentProp.vector1 ? { angle: segmentProp.vector1.angle, distance: segmentProp.vector1.distance } : null;
                // eslint-disable-next-line max-len
                segment.vector2 = segmentProp.vector2 ? { angle: segmentProp.vector2.angle, distance: segmentProp.vector2.distance } : null;
                if (segmentProp.points) {
                    segment.points = this.getSegmentPoints(segmentProp.points);
                }
                if (segmentProp.type) {
                    segment.type = (segmentProp.type).charAt(0).toUpperCase() + (segmentProp.type).slice(1);
                }
                connectorSegments.push(segment);
            }
        }
        return connectorSegments;
    }


    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Render the connector Segment points from EJ1 to EJ2
    public getSegmentPoints(points: Point[]): Point[] {
        const pointsCollection: Point[] = [];
        if (points.length > 0) {
            for (let i: number = 0; i < points.length; i++) {
                const newPoint: any = {};
                const point: Point = points[parseInt(i.toString(), 10)];
                newPoint.x = point.x;
                newPoint.y = point.y;
                pointsCollection.push(newPoint);
            }
        }
        return pointsCollection;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Sets the connector constraints
    public setConnectorConstraints(constraints: number): number {
        let connectorConstraints: number = ConnectorConstraints.None;
        if (constraints & ConnectorConstraints.Select) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.Select;
        }
        if (constraints & ConnectorConstraints.Delete) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.Delete;
        }
        if (constraints & ConnectorConstraints.Drag) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.Drag;
        }
        if (constraints & ConnectorConstraints.DragSourceEnd) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.DragSourceEnd;
        }
        if (constraints & ConnectorConstraints.DragTargetEnd) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.DragTargetEnd;
        }
        if (constraints & ConnectorConstraints.DragSegmentThumb) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.DragSegmentThumb;
        }
        if (constraints & ConnectorConstraints.Bridging) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.Bridging;
        }
        if (constraints & ConnectorConstraints.InheritBridging) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.InheritBridging;
        }
        if (constraints & ConnectorConstraints.AllowDrop) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.AllowDrop;
        }
        if (constraints & ConnectorConstraints.InheritTooltip) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.InheritTooltip;
        }
        if (constraints & ConnectorConstraints.PointerEvents) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.PointerEvents;
        }
        if (constraints & ConnectorConstraints.BridgeObstacle) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.BridgeObstacle;
        }
        if (constraints & ConnectorConstraints.Interaction) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.Interaction;
        }
        if (constraints & ConnectorConstraints.Default) {
            connectorConstraints = connectorConstraints | ConnectorConstraints.Default;
        }
        return connectorConstraints;
    }

    /**
     * To destroy the ruler
     *
     * @returns {void} To destroy the ruler
     */

    public destroy(): void {
        /**
         * Destroys the Node properties module
         */
    }
    /**
     * Get module name.
     *
     * @returns {string} Returns the module name
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'ConnectorProperties';

    }

}

export interface EJ1Connector extends ConnectorModel {

    name: string;

    labels: AnnotationModel[];

    lineColor: string;

    lineWidth: number;

    lineDashArray: string;

    opacity: number;

    lineHitPadding: number;

}
