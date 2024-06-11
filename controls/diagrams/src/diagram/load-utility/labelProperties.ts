import { DiagramElement } from '../core/elements/diagram-element';
import { PathElement } from '../core/elements/path-element';
import { TextElement } from '../core/elements/text-element';
import { Diagram } from '../diagram';
import { AnnotationConstraints, HorizontalAlignment, TextAlign, TextDecoration, TextWrap, VerticalAlignment } from '../enum/enum';
import { AnnotationModel } from '../objects/annotation-model';
import { NodeModel } from '../objects/node-model';
import { Ej1Serialization } from './modelProperties';

export class LabelProperties {

    private diagram: Diagram;

    private modelProperties: Ej1Serialization;

    constructor(modelProperties: Ej1Serialization) {
        this.modelProperties = modelProperties;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update and assign the annotation properties from EJ1 to EJ2
    public setLabelProperties(oldLabels: AnnotationModel[], item: Object): AnnotationModel[] {
        const labelCollection: AnnotationModel[] = [];
        if (oldLabels.length > 0) {
            for (let i: number = 0; i < oldLabels.length; i++) {
                const label: AnnotationModel = oldLabels[parseInt(i.toString(), 10)];
                const newLabel: AnnotationModel = {};
                (newLabel).style = {};
                if ((label as labels).name) {
                    newLabel.id = (label as labels).name;
                }
                if (label.addInfo) {
                    newLabel.addInfo = label.addInfo;
                }
                if (label.content) {
                    newLabel.content = label.content;
                }
                if (label.constraints) {
                    newLabel.constraints = this.setLabelConstraints(label.constraints);
                }
                //  if (label.readOnly)
                //      newLabel.constraints = newLabel.constraints | AnnotationConstraints.ReadOnly;
                if (label.dragLimit) {
                    newLabel.dragLimit = {
                        left: label.dragLimit.left, right: label.dragLimit.right,
                        top: label.dragLimit.top, bottom: label.dragLimit.bottom
                    };
                }
                if (label.height) {
                    newLabel.height = label.height;
                }
                if (label.horizontalAlignment) {
                    newLabel.horizontalAlignment = label.horizontalAlignment;
                }
                if (label.verticalAlignment) {
                    newLabel.verticalAlignment = label.verticalAlignment;
                }
                if (label.hyperlink) {
                    newLabel.hyperlink = label.hyperlink;
                }
                if (label.margin) {
                    newLabel.margin = {
                        left: label.margin.left, right: label.margin.right,
                        top: label.margin.top, bottom: label.margin.bottom
                    };
                }
                if (label.rotateAngle) {
                    newLabel.rotateAngle = label.rotateAngle;
                }
                if ((label as labels).fillColor) {
                    newLabel.style.color = (label as labels).fillColor;
                }
                if ((label as labels).fontFamily) {
                    newLabel.style.fontFamily = (label as labels).fontFamily;
                }
                if ((label as labels).fontSize) {
                    newLabel.style.fontSize = (label as labels).fontSize;
                }
                if ((label as labels).italic) {
                    newLabel.style.italic = (label as labels).italic;
                }
                if ((label as labels).bold) {
                    newLabel.style.bold = (label as labels).bold;
                }
                if ((label as labels).borderColor) {
                    newLabel.style.strokeColor = (label as labels).borderColor;
                }
                if ((label as labels).borderWidth) {
                    newLabel.style.strokeWidth = (label as labels).borderWidth;
                }
                if ((label as labels).textWrapping) {
                    newLabel.style.textWrapping = (label as labels).textWrapping;
                }
                if ((label as labels).textAlign) {
                    newLabel.style.textAlign = (label as labels).textAlign;
                }
                if ((label as labels).textDecoration) {
                    newLabel.style.textDecoration = (label as labels).textDecoration;
                }
                if ((label as labels).fillColor) {
                    newLabel.style.fill = (label as labels).fillColor === 'white' ? 'transparent' : (label as labels).fillColor;
                }
                if ((label as labels).opacity) {
                    newLabel.style.opacity = (label as labels).opacity;
                }
                //  if (label.templateId)
                //  newLabel.template = getTemplateContent(label.templateId);
                if ((label as labels).visible) {
                    newLabel.visibility = (label as labels).visible;
                }
                if (label.width) {
                    newLabel.width = label.width;
                }
                labelCollection.push(newLabel);
            }
        }
        return labelCollection;
    }

    //(EJ2-272287) Provide support to convert the EJ1 diagram to EJ2 diagram
    //Update the annotation constraints from EJ1 to EJ2
    public setLabelConstraints(constraints: number): number {
        let annotationConstraints: number = AnnotationConstraints.None;
        if (constraints & AnnotationConstraints.Select) {
            annotationConstraints = annotationConstraints | AnnotationConstraints.Select;
        }
        if (constraints & AnnotationConstraints.Drag) {
            annotationConstraints = annotationConstraints | AnnotationConstraints.Drag;
        }
        if (constraints & AnnotationConstraints.Resize) {
            annotationConstraints = annotationConstraints | AnnotationConstraints.Resize;
        }
        if (constraints & AnnotationConstraints.Rotate) {
            annotationConstraints = annotationConstraints | AnnotationConstraints.Rotate;
        }
        return annotationConstraints;
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
     * @returns {string} returns Module name
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'LabelProperties';

    }
}

export interface labels extends AnnotationModel {

    name: string;

    fillColor: string;

    fontFamily: string;

    fontSize: number;

    italic: boolean;

    bold: boolean;

    borderColor: string;

    borderWidth: number;

    opacity: number;

    visible: boolean;

    horizontalAlignment: HorizontalAlignment;

    verticalAlignment: VerticalAlignment;

    textWrapping: TextWrap;

    textAlign: TextAlign;

    textDecoration: TextDecoration;
}
