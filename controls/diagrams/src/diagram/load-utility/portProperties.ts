import { Diagram } from '../diagram';
import { HorizontalAlignment, PortConstraints, PortShapes, PortVisibility, VerticalAlignment } from '../enum/enum';
import { PortModel } from '../objects/port-model';
import { PointModel } from '../primitives/point-model';
import { Ej1Serialization } from './modelProperties';


export class PortProperties {
    private diagram: Diagram;

    private modelProperties: Ej1Serialization;

    constructor(modelProperties: Ej1Serialization) {
        this.modelProperties = modelProperties;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Convert and assign EJ1 to EJ2 port properties
    public setPortProperties(oldPorts: EJ1Port[]): PortModel[] {
        const portCollection: PortModel[] = [];
        if (oldPorts.length > 0) {
            for (let i: number = 0; i < oldPorts.length; i++) {
                const port: PortModel = oldPorts[parseInt(i.toString(), 10)];
                const newPort: PortModel = {};
                newPort.style = {};
                if ((port as EJ1Port).name) {
                    newPort.id = (port as EJ1Port).name;
                }
                if (port.addInfo) {
                    newPort.addInfo = port.addInfo;
                }
                if (port.height) {
                    newPort.height = port.height;
                }
                if (port.width) {
                    newPort.width = port.width;
                }
                if (port.horizontalAlignment) {
                    newPort.horizontalAlignment = (port.horizontalAlignment);
                }
                if (port.verticalAlignment) {
                    newPort.verticalAlignment = port.verticalAlignment;
                }
                if (port.margin) {
                    // eslint-disable-next-line max-len
                    newPort.margin = { left: port.margin.left, right: port.margin.right, top: port.margin.top, bottom: port.margin.bottom };
                }
                if ((port as EJ1Port).offset) {
                    (newPort as any).offset = { x: (port as any).offset.x, y: (port as any).offset.y };
                }
                if ((port as EJ1Port).borderColor) {
                    newPort.style.strokeColor = (port as EJ1Port).borderColor;
                }
                if ((port as EJ1Port).borderWidth) {
                    newPort.style.strokeWidth = (port as EJ1Port).borderWidth;
                }
                if ((port as EJ1Port).fillColor) {
                    newPort.style.fill = (port as EJ1Port).fillColor;
                }
                if (port.constraints) {
                    newPort.constraints = this.setPortConstraints(port.constraints as any);
                }
                if (port.pathData) {
                    newPort.pathData = port.pathData;
                }
                if (port.shape === 'Custom') {
                    newPort.shape = 'Custom';
                }
                else {
                    newPort.shape = port.shape;
                }
                if (port.visibility) {
                    newPort.visibility = this.setPortVisibility(port.visibility);
                }
                portCollection.push(newPort);
            }
        }
        return portCollection;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Sets the port constraints from EJ1 to EJ2
    public setPortConstraints(constraints: number): number {
        let portConstraints: number = PortConstraints.None;
        if (constraints & PortConstraints.Drag) {
            portConstraints = portConstraints | PortConstraints.Drag;
        }
        if (constraints & PortConstraints.Draw) {
            portConstraints = portConstraints | PortConstraints.Draw;
        }
        if (constraints & PortConstraints.None) {
            portConstraints = PortConstraints.None;
        }
        portConstraints = PortConstraints.Default;
        return portConstraints;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Sets the portVisibility from EJ1 to EJ2
    public setPortVisibility(visibility: number): number {
        let portVisibility: number;
        if (visibility & PortVisibility.Visible) {
            portVisibility = portVisibility | PortVisibility.Visible;
        }
        if (visibility & PortVisibility.Hidden) {
            portVisibility = portVisibility | PortVisibility.Hidden;
        }
        if (visibility & PortVisibility.Hover) {
            portVisibility = portVisibility | PortVisibility.Hover;
        }
        if (visibility & PortVisibility.Connect) {
            portVisibility = portVisibility | PortVisibility.Connect;
        }
        return portVisibility;
    }


    /**
     * To destroy the ruler
     *
     * @returns {void} To destroy the ruler
     */
    public destroy(): void {
        /**
         * Destroys the Port properties module
         */
    }

    /**
     * Get module name.
     * @returns {string} Returns the module name
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'PortProperties';
    }
}

export interface EJ1Port extends PortModel {

    name: string;

    fillColor: string;

    borderColor: string;

    borderWidth: number;

    opacity: number;

    horizontalAlignment: HorizontalAlignment;

    verticalAlignment: VerticalAlignment;

    shape: PortShapes;

    offset: PointModel;
}

