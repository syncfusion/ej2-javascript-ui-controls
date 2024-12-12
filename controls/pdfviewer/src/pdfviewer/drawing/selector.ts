import { Property, ChildProperty, Collection, Complex, isNullOrUndefined } from '@syncfusion/ej2-base';
import { IElement, ThumbsConstraints } from '@syncfusion/ej2-drawings';
import { Container } from '@syncfusion/ej2-drawings';
import { PointModel } from '@syncfusion/ej2-drawings';
import { Point } from '@syncfusion/ej2-drawings';
import { PdfAnnotationBaseModel, PdfFormFieldBaseModel } from './pdf-annotation-model';
import { PdfAnnotationBase, PdfFormFieldBase } from './pdf-annotation';

/**
 * Defines the size and position of selected items and defines the appearance of selector
 *
 * @hidden
 */
export class Selector extends ChildProperty<Selector> implements IElement {
    /**
     * Defines the size and position of the container
     *
     * @default null
     */
    @Property(null)
    public wrapper: Container;

    /**
     * Defines the collection of selected nodes
     */

    @Collection<PdfAnnotationBaseModel>([], PdfAnnotationBase)
    public annotations: PdfAnnotationBaseModel[];

    /**
     * Defines the collection of selected form Fields
     */
    @Collection<PdfFormFieldBaseModel>([], PdfFormFieldBase)
    public formFields: PdfFormFieldBaseModel[];

    /**
     * Sets/Gets the width of the container
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets/Gets the height of the container
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Sets the rotate angle of the container
     *
     * @default 0
     */
    @Property(0)
    public rotateAngle: number;

    /**
     * Sets the positionX of the container
     *
     * @default 0
     */
    @Property(0)
    public offsetX: number;

    /**
     * Sets the positionY of the container
     *
     * @default 0
     */
    @Property(0)
    public offsetY: number;

    /**
     * Sets the pivot of the selector
     *
     * @default { x: 0.5, y: 0.5 }
     */
    @Complex<PointModel>({ x: 0.5, y: 0.5 }, Point)
    public pivot: PointModel;

    /**
     * set the constraint of the container
     * * Rotate - Enable Rotate Thumb
     * * ConnectorSource - Enable Connector source point
     * * ConnectorTarget - Enable Connector target point
     * * ResizeNorthEast - Enable ResizeNorthEast Resize
     * * ResizeEast - Enable ResizeEast Resize
     * * ResizeSouthEast - Enable ResizeSouthEast Resize
     * * ResizeSouth - Enable ResizeSouth Resize
     * * ResizeSouthWest - Enable ResizeSouthWest Resize
     * * ResizeWest - Enable ResizeWest Resize
     * * ResizeNorthWest - Enable ResizeNorthWest Resize
     * * ResizeNorth - Enable ResizeNorth Resize
     *
     * @private
     * @aspNumberEnum
     */
    public thumbsConstraints: ThumbsConstraints;
    /**
     * Initializes the UI of the container
     *
     * @param  {any} diagram - diagram element.
     * @returns {Container} - Returns the container element.
     */
    public init(diagram: any): Container {
        const container: Container = new Container();
        container.measureChildren = false;
        container.children = [];
        if (this.formFields && this.formFields.length > 0) {
            for (let i: number = 0; i < this.formFields.length; i++) {
                const node: PdfFormFieldBaseModel = diagram.pdfViewer.nameTable[this.formFields[parseInt(i.toString(), 10)].id];
                const wrapper: Container = node.wrapper;
                container.children.push(wrapper);
            }
        } else if (this.annotations) {
            for (let i: number = 0; i < this.annotations.length; i++) {
                if (!isNullOrUndefined(this.annotations[parseInt(i.toString(), 10)])) {
                    const node: PdfAnnotationBaseModel = diagram.pdfViewer.nameTable[this.annotations[parseInt(i.toString(), 10)].id];
                    const wrapper: Container = node.wrapper;
                    container.children.push(wrapper);
                }
            }
        }
        this.wrapper = container;
        return container;
    }
}
