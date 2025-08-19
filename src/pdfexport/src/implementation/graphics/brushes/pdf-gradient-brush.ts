/**
 * PdfGradientBrush.ts class for EJ2-PDF
 */
import { PdfStreamWriter } from './../../input-output/pdf-stream-writer';
import { GetResourceEventHandler } from './../pdf-graphics';
import { PdfColorSpace } from './../enum';
import { PdfColor } from './../pdf-color';
import { PdfBrush } from './pdf-brush';
import { IPdfWrapper } from '../../../interfaces/i-pdf-wrapper';
import { PdfDictionary} from '../../primitives/pdf-dictionary';
import { PdfTransformationMatrix } from './../pdf-transformation-matrix';
import { DictionaryProperties } from './../../input-output/pdf-dictionary-properties';
import { PdfBoolean } from './../../primitives/pdf-boolean';
import { PdfArray } from './../../primitives/pdf-array';
import { PdfName } from '../../primitives/pdf-name';
import { PdfNumber} from '../../primitives/pdf-number';
import { PdfReferenceHolder } from '../../primitives/pdf-reference';
import { IPdfPrimitive } from './../../../interfaces/i-pdf-primitives';
import { PdfFunction } from './../../general/functions/pdf-function';
import { PdfResources } from './../pdf-resources';
/**
 * `PdfGradientBrush` class provides objects used to fill the interiors of graphical shapes such as rectangles,
 * ellipses, pies, polygons, and paths.
 * @private
 */
export abstract class PdfGradientBrush extends PdfBrush implements IPdfWrapper {
    // Fields
    /**
     * Local variable to store the background color.
     * @private
     */
    private mbackground : PdfColor = new PdfColor(255, 255, 255);
    /**
     * Local variable to store the stroking color.
     * @private
     */
    private mbStroking : boolean = false;
    /**
     * Local variable to store the dictionary.
     * @private
     */
    private mpatternDictionary : PdfDictionary;
    /**
     * Local variable to store the shading.
     * @private
     */
    private mshading : PdfDictionary;
    /**
     * Local variable to store the Transformation Matrix.
     * @private
     */
    private mmatrix: PdfTransformationMatrix;
    /**
     * Local variable to store the colorSpace.
     * @private
     */
    private mcolorSpace: PdfColorSpace;
    /**
     * Local variable to store the function.
     * @private
     */
    private mfunction: PdfFunction = null;
    /**
     * Local variable to store the DictionaryProperties.
     * @private
     */
    private dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    //Constructor
    /**
     * Initializes a new instance of the `PdfGradientBrush` class.
     * @public
     */
    /* tslint:disable-next-line:max-line-length */
    public constructor(shading: PdfDictionary) {
        super();
        this.mpatternDictionary = new PdfDictionary();
        this.mpatternDictionary.items.setValue(this.dictionaryProperties.type, new PdfName(this.dictionaryProperties.pattern));
        this.mpatternDictionary.items.setValue(this.dictionaryProperties.patternType, new PdfNumber(2));
        this.shading = shading;
        this.colorSpace = PdfColorSpace.Rgb;
    }
    //Properties
    /**
     * Gets or sets the background color of the brush.
     * @public
     */
    public get background(): PdfColor {
        return this.mbackground;
    }
    public set background(value: PdfColor) {
        this.mbackground = value;
        let sh: PdfDictionary = this.shading;
        if (value.isEmpty) {
            sh.remove(this.dictionaryProperties.background);
        } else {
            sh.items.setValue(this.dictionaryProperties.background, value.toArray(this.colorSpace));
        }
    }
    /**
     * Gets or sets a value indicating whether use anti aliasing algorithm.
     * @public
     */
    public get antiAlias(): boolean {
        let sh: PdfDictionary = this.shading;
        let aa: PdfBoolean = (<PdfBoolean>(sh.items.getValue(this.dictionaryProperties.antiAlias)));
        return aa.value;
    }
    public set antiAlias(value: boolean)  {
        let sh: PdfDictionary = this.shading;
        let aa: PdfBoolean = (<PdfBoolean>(sh.items.getValue(this.dictionaryProperties.antiAlias)));
        if ((aa == null && typeof aa === 'undefined')) {
            aa = new PdfBoolean(value);
            sh.items.setValue(this.dictionaryProperties.antiAlias, aa);
        } else {
            aa.value = value;
        }
    }
    /**
     * Gets or sets the function of the brush.
     * @protected
     */
    protected get function(): PdfFunction {
        return this.mfunction;
    }
    protected set function(value: PdfFunction)  {
        this.mfunction = value;
        if (value != null && typeof value !== 'undefined') {
            this.shading.items.setValue(this.dictionaryProperties.function, new PdfReferenceHolder(this.mfunction));
        } else {
            this.shading.remove(this.dictionaryProperties.function);
        }
    }
    /**
     * Gets or sets the boundary box of the brush.
     * @protected
     */
    protected get bBox(): PdfArray {
        let sh: PdfDictionary = this.shading;
        let box: PdfArray = (<PdfArray>(sh.items.getValue(this.dictionaryProperties.bBox)));
        return box;
    }
    protected set bBox(value: PdfArray)  {
        let sh: PdfDictionary = this.shading;
        if (value == null && typeof value === 'undefined') {
            sh.remove(this.dictionaryProperties.bBox);
        } else {
            sh.items.setValue(this.dictionaryProperties.bBox, value);
        }
    }
    /**
     * Gets or sets the color space of the brush.
     * @public
     */
    public get colorSpace(): PdfColorSpace {
        return this.mcolorSpace;
    }
    public set colorSpace(value: PdfColorSpace)  {
        let colorSpace: IPdfPrimitive = this.shading.items.getValue(this.dictionaryProperties.colorSpace);
        if ((value !== this.mcolorSpace) || (colorSpace == null)) {
            this.mcolorSpace = value;
            let csValue: string = this.colorSpaceToDeviceName(value);
            this.shading.items.setValue(this.dictionaryProperties.colorSpace, new PdfName(csValue));
        }
    }
    /**
     * Gets or sets a value indicating whether this PdfGradientBrush is stroking.
     * @public
     */
    public get stroking(): boolean {
        return this.mbStroking;
    }
    public set stroking(value: boolean)  {
        this.mbStroking = value;
    }
    /**
     * Gets the pattern dictionary.
     * @protected
     */
    protected get patternDictionary(): PdfDictionary {
        if (this.mpatternDictionary == null) {
            this.mpatternDictionary = new PdfDictionary();
        }
        return this.mpatternDictionary;
    }
    /**
     * Gets or sets the shading dictionary.
     * @protected
     */
    protected get shading(): PdfDictionary {
        return this.mshading;
    }
    protected set shading(value: PdfDictionary)  {
        if (value == null) {
            throw new Error('ArgumentNullException : Shading');
        }
        if (value !== this.mshading) {
            this.mshading = value;
            this.patternDictionary.items.setValue(this.dictionaryProperties.shading, new PdfReferenceHolder(this.mshading));
        }
    }
    /**
     * Gets or sets the transformation matrix.
     * @public
     */
    public get matrix(): PdfTransformationMatrix {
        return this.mmatrix;
    }
    public set matrix(value: PdfTransformationMatrix)  {
        if (value == null) {
            throw new Error('ArgumentNullException : Matrix');
        }
        if (value !== this.mmatrix) {
            this.mmatrix = value.clone();
            let m: PdfArray = new PdfArray(this.mmatrix.matrix.elements);
            this.mpatternDictionary.items.setValue(this.dictionaryProperties.matrix, m);
        }
    }
    //Overrides
    /**
     * Monitors the changes of the brush and modify PDF state respectfully.
     * @param brush The brush.
     * @param streamWriter The stream writer.
     * @param getResources The get resources delegate.
     * @param saveChanges if set to true the changes should be saved anyway.
     * @param currentColorSpace The current color space.
     */
    /* tslint:disable-next-line:max-line-length */
    public monitorChanges(brush: PdfBrush, streamWriter: PdfStreamWriter, getResources: GetResourceEventHandler, saveChanges: boolean, currentColorSpace: PdfColorSpace): boolean {
        let diff: boolean = false;
        if (brush instanceof PdfGradientBrush) {
            if ((this.colorSpace !== currentColorSpace)) {
                this.colorSpace = currentColorSpace;
                this.resetFunction();
            }
            //  Set the /Pattern colour space.
            streamWriter.setColorSpace('Pattern', this.mbStroking);
            //  Set the pattern for non-stroking operations.
            let resources : PdfResources = getResources.getResources();
            let name: PdfName = resources.getName(this);
            streamWriter.setColourWithPattern(null, name, this.mbStroking);
            diff = true;
        }
        return diff;
    }
    /**
     * Resets the changes, which were made by the brush.
     * In other words resets the state to the initial one.
     * @param streamWriter The stream writer.
     */
    public resetChanges(streamWriter: PdfStreamWriter): void {
        //  Unable reset.
    }
    //Implementation
    /**
     * Converts colorspace enum to a PDF name.
     * @param colorSpace The color space enum value.
     */
    private colorSpaceToDeviceName(colorSpace: PdfColorSpace): string {
        let result: string;
        switch (colorSpace) {
            case PdfColorSpace.Rgb:
                result = 'DeviceRGB';
                break;
        }
        return result;
    }
    /**
     * Resets the pattern dictionary.
     * @param dictionary A new pattern dictionary.
     */
    protected resetPatternDictionary(dictionary: PdfDictionary) : void {
        this.mpatternDictionary = dictionary;
    }
    /**
     * Resets the function.
     */
    public abstract resetFunction() : void;
    /**
     * Clones the anti aliasing value.
     * @param brush The brush.
     */
    protected cloneAntiAliasingValue(brush: PdfGradientBrush) : void {
        if ((brush == null)) {
            throw new Error('ArgumentNullException : brush');
        }
        let sh: PdfDictionary = this.shading;
        let aa: PdfBoolean = (<PdfBoolean>(sh.items.getValue(this.dictionaryProperties.antiAlias)));
        if ((aa != null)) {
            brush.shading.items.setValue(this.dictionaryProperties.antiAlias, new PdfBoolean(aa.value));
        }
    }
    /**
     * Clones the background value.
     * @param brush The brush.
     */
    protected cloneBackgroundValue(brush: PdfGradientBrush) : void {
        let background: PdfColor = this.background;
        if (!background.isEmpty) {
            brush.background = background;
        }
    }
    /* tslint:enable */
    // IPdfWrapper Members
    /**
     * Gets the `element`.
     * @private
     */
    public get element() : IPdfPrimitive {
        return this.patternDictionary;
    }
}