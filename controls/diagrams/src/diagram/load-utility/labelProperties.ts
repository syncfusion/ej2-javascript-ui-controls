import { DiagramElement } from '../core/elements/diagram-element';
import { PathElement } from '../core/elements/path-element';
import { TextElement } from '../core/elements/text-element';
import { Diagram } from '../diagram';
import { AnnotationConstraints, HorizontalAlignment, TextAlign, TextDecoration, TextWrap, VerticalAlignment } from '../enum/enum';
import { AnnotationModel, HyperlinkModel, PathAnnotationModel, ShapeAnnotationModel } from '../objects/annotation-model';
import { ConnectorModel } from '../objects/connector-model';
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
    public setLabelProperties(oldLabels: AnnotationModel[], item: NodeModel|ConnectorModel): ShapeAnnotationModel[] {
        const labelCollection: ShapeAnnotationModel[]|PathAnnotationModel = [];
        if (oldLabels.length > 0) {
            for (let i: number = 0; i < oldLabels.length; i++) {
                const label: AnnotationModel = oldLabels[parseInt(i.toString(), 10)];
                const newLabel: ShapeAnnotationModel|PathAnnotationModel = {};
                (newLabel).style = {};
                if ((label as labels).name) {
                    newLabel.id = (label as labels).name;
                }
                if (label.addInfo) {
                    newLabel.addInfo = label.addInfo;
                }
                if ((label as labels).text) {
                    newLabel.content = (label as labels).text;
                }
                if (label.constraints) {
                    newLabel.constraints = this.setLabelConstraints(label.constraints);
                }
                if ((label as labels).readOnly) {
                    newLabel.constraints = newLabel.constraints | AnnotationConstraints.ReadOnly;
                }
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
                    newLabel.horizontalAlignment = label.horizontalAlignment.charAt(0).toUpperCase() +
                    label.horizontalAlignment.slice(1).toLowerCase() as HorizontalAlignment;
                }
                if (label.verticalAlignment) {
                    newLabel.verticalAlignment = label.verticalAlignment.charAt(0).toUpperCase() +
                    label.verticalAlignment.slice(1).toLowerCase() as VerticalAlignment;
                }
                if (label.hyperlink) {
                    newLabel.hyperlink = { link : label.hyperlink , color : 'blue' } as any;
                }
                if (label.margin) {
                    newLabel.margin = {
                        left: label.margin.left, right: label.margin.right,
                        top: label.margin.top, bottom: label.margin.bottom
                    };
                }
                newLabel.rotateAngle = label.rotateAngle;
                if ((label as labels).offset){
                    if (item){
                        newLabel.offset = (label as labels).offset.x;
                    }else{
                        newLabel.offset = {x: (label as labels).offset.x , y: (label as labels).offset.y};
                    }
                }
                newLabel.style.color = (label as labels).fontColor;
                newLabel.style.fontFamily = (label as labels).fontFamily;
                newLabel.style.fontSize = (label as labels).fontSize;
                newLabel.style.italic = (label as labels).italic;
                newLabel.style.bold = (label as labels).bold;
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
                    newLabel.style.textAlign = (label as labels).textAlign.charAt(0).toUpperCase() +
                    (label as labels).textAlign.slice(1).toLowerCase() as TextAlign;
                }
                if ((label as labels).textDecoration) {
                    newLabel.style.textDecoration = (label as labels).textDecoration.charAt(0).toUpperCase() +
                    (label as labels).textDecoration.slice(1).toLowerCase() as TextDecoration;
                    if (newLabel.style.textDecoration === 'Linethrough' as any) {
                        newLabel.style.textDecoration = 'LineThrough';
                    }
                }
                const appearance: LabelAppearance = this.setLabelAppearance(newLabel , label as labels);
                newLabel.style.fill = appearance.fill;
                newLabel.style.opacity = appearance.opacity;
                //  if (label.templateId)
                //  newLabel.template = getTemplateContent(label.templateId);
                newLabel.visibility = appearance.visibility;
                if (label.width) {
                    newLabel.width = label.width;
                }
                labelCollection.push(newLabel as ShapeAnnotationModel);
            }
        }
        return labelCollection;
    }

    private setLabelAppearance(newLabel: ShapeAnnotationModel | PathAnnotationModel, label: labels): LabelAppearance {
        const appearance: LabelAppearance = {} as LabelAppearance;
        if ((label as labels).fillColor) {
            (appearance as LabelAppearance).fill = (label as labels).fillColor === 'white' ? 'transparent' : (label as labels).fillColor;
        }
        if ((label as labels).opacity) {
            (appearance as LabelAppearance).opacity = (label as labels).opacity;
        }
        //  if (label.templateId)
        //  newLabel.template = getTemplateContent(label.templateId);
        if ((label as labels).visible) {
            (appearance as LabelAppearance).visibility = (label as labels).visible;
        }
        return appearance;
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
interface LabelAppearance {
    fill: string;
    opacity: number;
    visibility: boolean;
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

    text: string;

    readOnly: number;

    fontColor: string;

    offset: { x: number, y: number };
}
