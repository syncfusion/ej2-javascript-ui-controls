/**
 * TtfGlyphInfo.ts class for EJ2-PDF
 */
export class TtfGlyphInfo {
    //Fields
    /**
     * Holds glyph index.
     */
    public index : number;
    /**
     * Holds character's width.
     */
    public width : number;
    /**
     * Code of the char symbol.
     */
    public charCode : number;

    //Properties
    /**
     * Gets a value indicating whether this TtfGlyphInfo is empty.
     */
    public get empty() : boolean {
        let empty : boolean = (this.index === this.width && this.width === this.charCode && this.charCode === 0);
        return empty;
    }
    //IComparable implementation
    /**
     * Compares two WidthDescriptor objects.
     */
    public compareTo(obj : Object) : number {
        let glyph : TtfGlyphInfo = obj as TtfGlyphInfo;
        return this.index - glyph.index;
    }
}