/**
 * @hidden
 */
export type PdfAnnotationType =
    /**
     * Rectangle - Represents the annotation type as Rectangle.
     */
    'Rectangle' |
    /**
     * Ellipse -  Represents the annotation type as Ellipse.
     */
    'Ellipse' |
    /**
     * Line - Represents the annotation type as Line annotation with out decorator.
     */
    'Line' |
    /**
     * LineWidthArrowHead - Represents the annotation type as Line annotation with Arrow decorator.
     */
    'LineWidthArrowHead' |
    /**
     * Distance - Represents the annotation type Distance shape.
     */
    'Distance' |
    /**
     * Perimeter - Represents the annotation type Perimeter shape.
     */
    'Perimeter' |
    /**
     * Radius - Represents the annotation type Radius shape.
     */
    'Radius' |
    /**
     * Path - Represents the annotation type as path.
     */
    'Path' |
    /**
     * Stamp - Represents the annotation type as Stamp.
     */
    'Stamp' |
    /**
     * Image - Represents the annotation type as Image.
     */
    'Image' |
    /**
     * Polygon - Represents the annotation type as Polygon.
     */
    'Polygon'|
    /**
     * Sticky - Represents the annotation type as StickyNotes.
     */
    'StickyNotes';



/**
 * Defines the decorator shape of the connector
 * None - Sets the decorator shape as None
 * Arrow - Sets the decorator shape as Arrow
 * Diamond - Sets the decorator shape as Diamond
 * Path - Sets the decorator shape as Path
 * OpenArrow - Sets the decorator shape as OpenArrow
 * Circle - Sets the decorator shape as Circle
 * Square - Sets the decorator shape as Square
 * Fletch - Sets the decorator shape as Fletch
 * OpenFetch - Sets the decorator shape as OpenFetch
 * IndentedArrow - Sets the decorator shape as Indented Arrow
 * OutdentedArrow - Sets the decorator shape as Outdented Arrow
 * DoubleArrow - Sets the decorator shape as DoubleArrow
 * 
 * @hidden
 */
export type DecoratorShapes =
    /** None - Sets the decorator shape as None */
    'None' |
    /** Arrow - Sets the decorator shape as Arrow */
    'Arrow' |
    /** Diamond - Sets the decorator shape as Diamond */
    'Diamond' |
    /** OpenArrow - Sets the decorator shape as OpenArrow */
    'OpenArrow' |
    /** Circle - Sets the decorator shape as Circle */
    'Circle' |
    /** Square - Sets the decorator shape as Square */
    'Square' |
    /** Fletch - Sets the decorator shape as Fletch */
    'Fletch' |
    /** OpenFetch - Sets the decorator shape as OpenFetch */
    'OpenFetch' |
    /** IndentedArrow - Sets the decorator shape as Indented Arrow */
    'IndentedArrow' |
    /** OutdentedArrow - Sets the decorator shape as Outdented Arrow */
    'OutdentedArrow' |
    /** DoubleArrow - Sets the decorator shape as DoubleArrow */
    'DoubleArrow' |
    /** Custom - Sets the decorator shape as Custom */
    'Custom';


