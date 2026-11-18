/**
 * PdfBrushes.ts class for EJ2-PDF
 */
import { PdfColor } from './../pdf-color';
import { PdfBrush } from './pdf-brush';
import { Dictionary } from './../../collections/dictionary';
import { KnownColor } from './enum';
import { PdfSolidBrush} from './pdf-solid-brush';
/**
 * `PdfBrushes` class provides objects used to fill the interiors of graphical shapes such as rectangles,
 * ellipses, pies, polygons, and paths.
 * @private
 */
export class PdfBrushes {
    //Static Fields
    /**
     * Local variable to store the brushes.
     */
    private static sBrushes: Dictionary<KnownColor, PdfBrush> = new Dictionary<KnownColor, PdfBrush>();
    /**
     * Packed known color data (in KnownColor enum order, starting at Transparent).
     * Each color occupies two chars: the first holds the RGB value, the second the alpha flag
     * (0 - transparent, 1 - opaque).
     */
    /* tslint:disable-next-line:max-line-length */
    private static readonly knownColorData: string = '\u00ff\u00ff\u00ff\u0000\u00f0\u00f8\u00ff\u0001\u00fa\u00eb\u00d7\u0001\u0000\u00ff\u00ff\u0001\u007f\u00ff\u00d4\u0001\u00f0\u00ff\u00ff\u0001\u00f5\u00f5\u00dc\u0001\u00ff\u00e4\u00c4\u0001\u0000\u0000\u0000\u0001\u00ff\u00eb\u00cd\u0001\u0000\u0000\u00ff\u0001\u008a\u002b\u00e2\u0001\u00a5\u002a\u002a\u0001\u00de\u00b8\u0087\u0001\u005f\u009e\u00a0\u0001\u007f\u00ff\u0000\u0001\u00d2\u0069\u001e\u0001\u00ff\u007f\u0050\u0001\u0064\u0095\u00ed\u0001\u00ff\u00f8\u00dc\u0001\u00dc\u0014\u003c\u0001\u0000\u00ff\u00ff\u0001\u0000\u0000\u008b\u0001\u0000\u008b\u008b\u0001\u00b8\u0086\u000b\u0001\u00a9\u00a9\u00a9\u0001\u0000\u0064\u0000\u0001\u00bd\u00b7\u006b\u0001\u008b\u0000\u008b\u0001\u0055\u006b\u002f\u0001\u00ff\u008c\u0000\u0001\u0099\u0032\u00cc\u0001\u008b\u0000\u0000\u0001\u00e9\u0096\u007a\u0001\u008f\u00bc\u008b\u0001\u0048\u003d\u008b\u0001\u002f\u004f\u004f\u0001\u0000\u00ce\u00d1\u0001\u0094\u0000\u00d3\u0001\u00ff\u0014\u0093\u0001\u0000\u00bf\u00ff\u0001\u0069\u0069\u0069\u0001\u001e\u0090\u00ff\u0001\u00b2\u0022\u0022\u0001\u00ff\u00fa\u00f0\u0001\u0022\u008b\u0022\u0001\u00ff\u0000\u00ff\u0001\u00dc\u00dc\u00dc\u0001\u00f8\u00f8\u00ff\u0001\u00ff\u00d7\u0000\u0001\u00da\u00a5\u0020\u0001\u0080\u0080\u0080\u0001\u0000\u0080\u0000\u0001\u00ad\u00ff\u002f\u0001\u00f0\u00ff\u00f0\u0001\u00ff\u0069\u00b4\u0001\u00cd\u005c\u005c\u0001\u004b\u0000\u0082\u0001\u00ff\u00ff\u00f0\u0001\u00f0\u00e6\u008c\u0001\u00e6\u00e6\u00fa\u0001\u00ff\u00f0\u00f5\u0001\u007c\u00fc\u0000\u0001\u00ff\u00fa\u00cd\u0001\u00ad\u00d8\u00e6\u0001\u00f0\u0080\u0080\u0001\u00e0\u00ff\u00ff\u0001\u00fa\u00fa\u00d2\u0001\u00d3\u00d3\u00d3\u0001\u0090\u00ee\u0090\u0001\u00ff\u00b6\u00c1\u0001\u00ff\u00a0\u007a\u0001\u0020\u00b2\u00aa\u0001\u0087\u00ce\u00fa\u0001\u0077\u0088\u0099\u0001\u00b0\u00c4\u00de\u0001\u00ff\u00ff\u00e0\u0001\u0000\u00ff\u0000\u0001\u0032\u00cd\u0032\u0001\u00fa\u00f0\u00e6\u0001\u00ff\u0000\u00ff\u0001\u0080\u0000\u0000\u0001\u0066\u00cd\u00aa\u0001\u0000\u0000\u00cd\u0001\u00ba\u0055\u00d3\u0001\u0093\u0070\u00db\u0001\u003c\u00b3\u0071\u0001\u007b\u0068\u00ee\u0001\u0000\u00fa\u009a\u0001\u0048\u00d1\u00cc\u0001\u00c7\u0015\u0085\u0001\u0019\u0019\u0070\u0001\u00f5\u00ff\u00fa\u0001\u00ff\u00e4\u00e1\u0001\u00ff\u00e4\u00b5\u0001\u00ff\u00de\u00ad\u0001\u0000\u0000\u0080\u0001\u00fd\u00f5\u00e6\u0001\u0080\u0080\u0000\u0001\u006b\u008e\u0023\u0001\u00ff\u00a5\u0000\u0001\u00ff\u0045\u0000\u0001\u00da\u0070\u00d6\u0001\u00ee\u00e8\u00aa\u0001\u0098\u00fb\u0098\u0001\u00af\u00ee\u00ee\u0001\u00db\u0070\u0093\u0001\u00ff\u00ef\u00d5\u0001\u00ff\u00da\u00b9\u0001\u00cd\u0085\u003f\u0001\u00ff\u00c0\u00cb\u0001\u00dd\u00a0\u00dd\u0001\u00b0\u00e0\u00e6\u0001\u0080\u0000\u0080\u0001\u00ff\u0000\u0000\u0001\u00bc\u008f\u008f\u0001\u0041\u0069\u00e1\u0001\u008b\u0045\u0013\u0001\u00fa\u0080\u0072\u0001\u00f4\u00a4\u0060\u0001\u002e\u008b\u0057\u0001\u00ff\u00f5\u00ee\u0001\u00a0\u0052\u002d\u0001\u00c0\u00c0\u00c0\u0001\u0087\u00ce\u00eb\u0001\u006a\u005a\u00cd\u0001\u0070\u0080\u0090\u0001\u00ff\u00fa\u00fa\u0001\u0000\u00ff\u007f\u0001\u0046\u0082\u00b4\u0001\u00d2\u00b4\u008c\u0001\u0000\u0080\u0080\u0001\u00d8\u00bf\u00d8\u0001\u00ff\u0063\u0047\u0001\u0040\u00e0\u00d0\u0001\u00ee\u0082\u00ee\u0001\u00f5\u00de\u00b3\u0001\u00ff\u00ff\u00ff\u0001\u00f5\u00f5\u00f5\u0001\u00ff\u00ff\u0000\u0001\u009a\u00cd\u0032\u0001\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0001';
    /**
     * Gets the AliceBlue brush.
     * @public
     */
    public static get AliceBlue(): PdfBrush { return this.getBrush(KnownColor.AliceBlue); }
    /**
     * Gets the antique white brush.
     * @public
     */
    public static get AntiqueWhite(): PdfBrush { return this.getBrush(KnownColor.AntiqueWhite); }
    /**
     * Gets the Aqua default brush.
     * @public
     */
    public static get Aqua(): PdfBrush { return this.getBrush(KnownColor.Aqua); }
    /**
     * Gets the Aquamarine default brush.
     * @public
     */
    public static get Aquamarine(): PdfBrush { return this.getBrush(KnownColor.Aquamarine); }
    /**
     * Gets the Azure default brush.
     * @public
     */
    public static get Azure(): PdfBrush { return this.getBrush(KnownColor.Azure); }
    /**
     * Gets the Beige default brush.
     * @public
     */
    public static get Beige(): PdfBrush { return this.getBrush(KnownColor.Beige); }
    /**
     * Gets the Bisque default brush.
     * @public
     */
    public static get Bisque(): PdfBrush { return this.getBrush(KnownColor.Bisque); }
    /**
     * Gets the Black default brush.
     * @public
     */
    public static get Black(): PdfBrush { return this.getBrush(KnownColor.Black); }
    /**
     * Gets the BlanchedAlmond default brush.
     * @public
     */
    public static get BlanchedAlmond(): PdfBrush { return this.getBrush(KnownColor.BlanchedAlmond); }
    /**
     * Gets the Blue default brush.
     * @public
     */
    public static get Blue(): PdfBrush { return this.getBrush(KnownColor.Blue); }
    /**
     * Gets the BlueViolet default brush.
     * @public
     */
    public static get BlueViolet(): PdfBrush { return this.getBrush(KnownColor.BlueViolet); }
    /**
     * Gets the Brown default brush.
     * @public
     */
    public static get Brown(): PdfBrush { return this.getBrush(KnownColor.Brown); }
    /**
     * Gets the BurlyWood default brush.
     * @public
     */
    public static get BurlyWood(): PdfBrush { return this.getBrush(KnownColor.BurlyWood); }
    /**
     * Gets the CadetBlue default brush.
     * @public
     */
    public static get CadetBlue(): PdfBrush { return this.getBrush(KnownColor.CadetBlue); }
    /**
     * Gets the Chartreuse default brush.
     * @public
     */
    public static get Chartreuse(): PdfBrush { return this.getBrush(KnownColor.Chartreuse); }
    /**
     * Gets the Chocolate default brush.
     * @public
     */
    public static get Chocolate(): PdfBrush { return this.getBrush(KnownColor.Chocolate); }
    /**
     * Gets the Coral default brush.
     * @public
     */
    public static get Coral(): PdfBrush { return this.getBrush(KnownColor.Coral); }
    /**
     * Gets the CornflowerBlue default brush.
     * @public
     */
    public static get CornflowerBlue(): PdfBrush { return this.getBrush(KnownColor.CornflowerBlue); }
    /**
     * Gets the Cornsilk default brush.
     * @public
     */
    public static get Cornsilk(): PdfBrush { return this.getBrush(KnownColor.Cornsilk); }
    /**
     * Gets the Crimson default brush.
     * @public
     */
    public static get Crimson(): PdfBrush { return this.getBrush(KnownColor.Crimson); }
    /**
     * Gets the Cyan default brush.
     * @public
     */
    public static get Cyan(): PdfBrush { return this.getBrush(KnownColor.Cyan); }
    /**
     * Gets the DarkBlue default brush.
     * @public
     */
    public static get DarkBlue(): PdfBrush { return this.getBrush(KnownColor.DarkBlue); }
    /**
     * Gets the DarkCyan default brush.
     * @public
     */
    public static get DarkCyan(): PdfBrush { return this.getBrush(KnownColor.DarkCyan); }
    /**
     * Gets the DarkGoldenrod default brush.
     * @public
     */
    public static get DarkGoldenrod(): PdfBrush { return this.getBrush(KnownColor.DarkGoldenrod); }
    /**
     * Gets the DarkGray default brush.
     * @public
     */
    public static get DarkGray(): PdfBrush { return this.getBrush(KnownColor.DarkGray); }
    /**
     * Gets the DarkGreen default brush.
     * @public
     */
    public static get DarkGreen(): PdfBrush { return this.getBrush(KnownColor.DarkGreen); }
    /**
     * Gets the DarkKhaki default brush.
     * @public
     */
    public static get DarkKhaki(): PdfBrush { return this.getBrush(KnownColor.DarkKhaki); }
    /**
     * Gets the DarkMagenta default brush.
     * @public
     */
    public static get DarkMagenta(): PdfBrush { return this.getBrush(KnownColor.DarkMagenta); }
    /**
     * Gets the DarkOliveGreen default brush.
     * @public
     */
    public static get DarkOliveGreen(): PdfBrush { return this.getBrush(KnownColor.DarkOliveGreen); }
    /**
     * Gets the DarkOrange default brush.
     * @public
     */
    public static get DarkOrange(): PdfBrush { return this.getBrush(KnownColor.DarkOrange); }
    /**
     * Gets the DarkOrchid default brush.
     * @public
     */
    public static get DarkOrchid(): PdfBrush { return this.getBrush(KnownColor.DarkOrchid); }
    /**
     * Gets the DarkRed default brush.
     * @public
     */
    public static get DarkRed(): PdfBrush { return this.getBrush(KnownColor.DarkRed); }
    /**
     * Gets the DarkSalmon default brush.
     * @public
     */
    public static get DarkSalmon(): PdfBrush { return this.getBrush(KnownColor.DarkSalmon); }
    /**
     * Gets the DarkSeaGreen default brush.
     * @public
     */
    public static get DarkSeaGreen(): PdfBrush { return this.getBrush(KnownColor.DarkSeaGreen); }
    /**
     * Gets the DarkSlateBlue default brush.
     * @public
     */
    public static get DarkSlateBlue(): PdfBrush { return this.getBrush(KnownColor.DarkSlateBlue); }
    /**
     * Gets the DarkSlateGray default brush.
     * @public
     */
    public static get DarkSlateGray(): PdfBrush { return this.getBrush(KnownColor.DarkSlateGray); }
    /**
     * Gets the DarkTurquoise default brush.
     * @public
     */
    public static get DarkTurquoise(): PdfBrush { return this.getBrush(KnownColor.DarkTurquoise); }
    /**
     * Gets the DarkViolet default brush.
     * @public
     */
    public static get DarkViolet(): PdfBrush { return this.getBrush(KnownColor.DarkViolet); }
    /**
     * Gets the DeepPink default brush.
     * @public
     */
    public static get DeepPink(): PdfBrush { return this.getBrush(KnownColor.DeepPink); }
    /**
     * Gets the DeepSkyBlue default brush.
     * @public
     */
    public static get DeepSkyBlue(): PdfBrush { return this.getBrush(KnownColor.DeepSkyBlue); }
    /**
     * Gets the DimGray default brush.
     * @public
     */
    public static get DimGray(): PdfBrush { return this.getBrush(KnownColor.DimGray); }
    /**
     * Gets the DodgerBlue default brush.
     * @public
     */
    public static get DodgerBlue(): PdfBrush { return this.getBrush(KnownColor.DodgerBlue); }
    /**
     * Gets the Firebrick default brush.
     * @public
     */
    public static get Firebrick(): PdfBrush { return this.getBrush(KnownColor.Firebrick); }
    /**
     * Gets the FloralWhite default brush.
     * @public
     */
    public static get FloralWhite(): PdfBrush { return this.getBrush(KnownColor.FloralWhite); }
    /**
     * Gets the ForestGreen default brush.
     * @public
     */
    public static get ForestGreen(): PdfBrush { return this.getBrush(KnownColor.ForestGreen); }
    /**
     * Gets the Fuchsia default brush.
     * @public
     */
    public static get Fuchsia(): PdfBrush { return this.getBrush(KnownColor.Fuchsia); }
    /**
     * Gets the Gainsboro default brush.
     * @public
     */
    public static get Gainsboro(): PdfBrush { return this.getBrush(KnownColor.Gainsboro); }
    /**
     * Gets the GhostWhite default brush.
     * @public
     */
    public static get GhostWhite(): PdfBrush { return this.getBrush(KnownColor.GhostWhite); }
    /**
     * Gets the Gold default brush.
     * @public
     */
    public static get Gold(): PdfBrush { return this.getBrush(KnownColor.Gold); }
    /**
     * Gets the Goldenrod default brush.
     * @public
     */
    public static get Goldenrod(): PdfBrush { return this.getBrush(KnownColor.Goldenrod); }
    /**
     * Gets the Gray default brush.
     * @public
     */
    public static get Gray(): PdfBrush { return this.getBrush(KnownColor.Gray); }
    /**
     * Gets the Green default brush.
     * @public
     */
    public static get Green(): PdfBrush { return this.getBrush(KnownColor.Green); }
    /**
     * Gets the GreenYellow default brush.
     * @public
     */
    public static get GreenYellow(): PdfBrush { return this.getBrush(KnownColor.GreenYellow); }
    /**
     * Gets the Honeydew default brush.
     * @public
     */
    public static get Honeydew(): PdfBrush { return this.getBrush(KnownColor.Honeydew); }
    /**
     * Gets the HotPink default brush.
     * @public
     */
    public static get HotPink(): PdfBrush { return this.getBrush(KnownColor.HotPink); }
    /**
     * Gets the IndianRed default brush.
     * @public
     */
    public static get IndianRed(): PdfBrush { return this.getBrush(KnownColor.IndianRed); }
    /**
     * Gets the Indigo default brush.
     * @public
     */
    public static get Indigo(): PdfBrush { return this.getBrush(KnownColor.Indigo); }
    /**
     * Gets the Ivory default brush.
     * @public
     */
    public static get Ivory(): PdfBrush { return this.getBrush(KnownColor.Ivory); }
    /**
     * Gets the Khaki default brush.
     * @public
     */
    public static get Khaki(): PdfBrush { return this.getBrush(KnownColor.Khaki); }
    /**
     * Gets the Lavender default brush.
     * @public
     */
    public static get Lavender(): PdfBrush { return this.getBrush(KnownColor.Lavender); }
    /**
     * Gets the LavenderBlush default brush.
     * @public
     */
    public static get LavenderBlush(): PdfBrush { return this.getBrush(KnownColor.LavenderBlush); }
    /**
     * Gets the LawnGreen default brush.
     * @public
     */
    public static get LawnGreen(): PdfBrush { return this.getBrush(KnownColor.LawnGreen); }
    /**
     * Gets the LemonChiffon default brush.
     * @public
     */
    public static get LemonChiffon(): PdfBrush { return this.getBrush(KnownColor.LemonChiffon); }
    /**
     * Gets the LightBlue default brush.
     * @public
     */
    public static get LightBlue(): PdfBrush { return this.getBrush(KnownColor.LightBlue); }
    /**
     * Gets the LightCoral default brush.
     * @public
     */
    public static get LightCoral(): PdfBrush { return this.getBrush(KnownColor.LightCoral); }
    /**
     * Gets the LightCyan default brush.
     * @public
     */
    public static get LightCyan(): PdfBrush { return this.getBrush(KnownColor.LightCyan); }
    /**
     * Gets the LightGoldenrodYellow default brush.
     * @public
     */
    public static get LightGoldenrodYellow(): PdfBrush { return this.getBrush(KnownColor.LightGoldenrodYellow); }
    /**
     * Gets the LightGray default brush.
     * @public
     */
    public static get LightGray(): PdfBrush { return this.getBrush(KnownColor.LightGray); }
    /**
     * Gets the LightGreen default brush.
     * @public
     */
    public static get LightGreen(): PdfBrush { return this.getBrush(KnownColor.LightGreen); }
    /**
     * Gets the LightPink default brush.
     * @public
     */
    public static get LightPink(): PdfBrush { return this.getBrush(KnownColor.LightPink); }
    /**
     * Gets the LightSalmon default brush.
     * @public
     */
    public static get LightSalmon(): PdfBrush { return this.getBrush(KnownColor.LightSalmon); }
    /**
     * Gets the LightSeaGreen default brush.
     * @public
     */
    public static get LightSeaGreen(): PdfBrush { return this.getBrush(KnownColor.LightSeaGreen); }
    /**
     * Gets the LightSkyBlue default brush.
     * @public
     */
    public static get LightSkyBlue(): PdfBrush { return this.getBrush(KnownColor.LightSkyBlue); }
    /**
     * Gets the LightSlateGray default brush.
     * @public
     */
    public static get LightSlateGray(): PdfBrush { return this.getBrush(KnownColor.LightSlateGray); }
    /**
     * Gets the LightSteelBlue default brush.
     * @public
     */
    public static get LightSteelBlue(): PdfBrush { return this.getBrush(KnownColor.LightSteelBlue); }
    /**
     * Gets the LightYellow default brush.
     * @public
     */
    public static get LightYellow(): PdfBrush { return this.getBrush(KnownColor.LightYellow); }
    /**
     * Gets the Lime default brush.
     * @public
     */
    public static get Lime(): PdfBrush { return this.getBrush(KnownColor.Lime); }
    /**
     * Gets the LimeGreen default brush.
     * @public
     */
    public static get LimeGreen(): PdfBrush { return this.getBrush(KnownColor.LimeGreen); }
    /**
     * Gets the Linen default brush.
     * @public
     */
    public static get Linen(): PdfBrush { return this.getBrush(KnownColor.Linen); }
    /**
     * Gets the Magenta default brush.
     * @public
     */
    public static get Magenta(): PdfBrush { return this.getBrush(KnownColor.Magenta); }
    /**
     * Gets the Maroon default brush.
     * @public
     */
    public static get Maroon(): PdfBrush { return this.getBrush(KnownColor.Maroon); }
    /**
     * Gets the MediumAquamarine default brush.
     * @public
     */
    public static get MediumAquamarine(): PdfBrush { return this.getBrush(KnownColor.MediumAquamarine); }
    /**
     * Gets the MediumBlue default brush.
     * @public
     */
    public static get MediumBlue(): PdfBrush { return this.getBrush(KnownColor.MediumBlue); }
    /**
     * Gets the MediumOrchid default brush.
     * @public
     */
    public static get MediumOrchid(): PdfBrush { return this.getBrush(KnownColor.MediumOrchid); }
    /**
     * Gets the MediumPurple default brush.
     * @public
     */
    public static get MediumPurple(): PdfBrush { return this.getBrush(KnownColor.MediumPurple); }
    /**
     * Gets the MediumSeaGreen default brush.
     * @public
     */
    public static get MediumSeaGreen(): PdfBrush { return this.getBrush(KnownColor.MediumSeaGreen); }
    /**
     * Gets the MediumSlateBlue default brush.
     * @public
     */
    public static get MediumSlateBlue(): PdfBrush { return this.getBrush(KnownColor.MediumSlateBlue); }
    /**
     * Gets the MediumSpringGreen default brush.
     * @public
     */
    public static get MediumSpringGreen(): PdfBrush { return this.getBrush(KnownColor.MediumSpringGreen); }
    /**
     * Gets the MediumTurquoise default brush.
     * @public
     */
    public static get MediumTurquoise(): PdfBrush { return this.getBrush(KnownColor.MediumTurquoise); }
    /**
     * Gets the MediumVioletRed default brush.
     * @public
     */
    public static get MediumVioletRed(): PdfBrush { return this.getBrush(KnownColor.MediumVioletRed); }
    /**
     * Gets the MidnightBlue default brush.
     * @public
     */
    public static get MidnightBlue(): PdfBrush { return this.getBrush(KnownColor.MidnightBlue); }
    /**
     * Gets the MintCream default brush.
     * @public
     */
    public static get MintCream(): PdfBrush { return this.getBrush(KnownColor.MintCream); }
    /**
     * Gets the MistyRose default brush.
     * @public
     */
    public static get MistyRose(): PdfBrush { return this.getBrush(KnownColor.MistyRose); }
    /**
     * Gets the Moccasin default brush.
     * @public
     */
    public static get Moccasin(): PdfBrush { return this.getBrush(KnownColor.Moccasin); }
    /**
     * Gets the NavajoWhite default brush.
     * @public
     */
    public static get NavajoWhite(): PdfBrush { return this.getBrush(KnownColor.NavajoWhite); }
    /**
     * Gets the Navy default brush.
     * @public
     */
    public static get Navy(): PdfBrush { return this.getBrush(KnownColor.Navy); }
    /**
     * Gets the OldLace default brush.
     * @public
     */
    public static get OldLace(): PdfBrush { return this.getBrush(KnownColor.OldLace); }
    /**
     * Gets the Olive default brush.
     * @public
     */
    public static get Olive(): PdfBrush { return this.getBrush(KnownColor.Olive); }
    /**
     * Gets the OliveDrab default brush.
     * @public
     */
    public static get OliveDrab(): PdfBrush { return this.getBrush(KnownColor.OliveDrab); }
    /**
     * Gets the Orange default brush.
     * @public
     */
    public static get Orange(): PdfBrush { return this.getBrush(KnownColor.Orange); }
    /**
     * Gets the OrangeRed default brush.
     * @public
    */
    public static get OrangeRed(): PdfBrush { return this.getBrush(KnownColor.OrangeRed); }
    /**
     * Gets the Orchid default brush.
     * @public
     */
    public static get Orchid(): PdfBrush { return this.getBrush(KnownColor.Orchid); }
    /**
     * Gets the PaleGoldenrod default brush.
     * @public
     */
    public static get PaleGoldenrod(): PdfBrush { return this.getBrush(KnownColor.PaleGoldenrod); }
    /**
     * Gets the PaleGreen default brush.
     * @public
     */
    public static get PaleGreen(): PdfBrush { return this.getBrush(KnownColor.PaleGreen); }
    /**
     * Gets the PaleTurquoise default brush.
     * @public
     */
    public static get PaleTurquoise(): PdfBrush { return this.getBrush(KnownColor.PaleTurquoise); }
    /**
     * Gets the PaleVioletRed default brush.
     * @public
     */
    public static get PaleVioletRed(): PdfBrush { return this.getBrush(KnownColor.PaleVioletRed); }
    /**
     * Gets the PapayaWhip default brush.
     * @public
     */
    public static get PapayaWhip(): PdfBrush { return this.getBrush(KnownColor.PapayaWhip); }
    /**
     * Gets the PeachPuff default brush.
     * @public
     */
    public static get PeachPuff(): PdfBrush { return this.getBrush(KnownColor.PeachPuff); }
    /**
     * Gets the Peru default brush.
     * @public
     */
    public static get Peru(): PdfBrush { return this.getBrush(KnownColor.Peru); }
    /**
     * Gets the Pink default brush.
     * @public
     */
    public static get Pink(): PdfBrush { return this.getBrush(KnownColor.Pink); }
    /**
     * Gets the Plum default brush.
     * @public
     */
    public static get Plum(): PdfBrush { return this.getBrush(KnownColor.Plum); }
    /**
     * Gets the PowderBlue default brush.
     * @public
     */
    public static get PowderBlue(): PdfBrush { return this.getBrush(KnownColor.PowderBlue); }
    /**
     * Gets the Purple default brush.
     * @public
     */
    public static get Purple(): PdfBrush { return this.getBrush(KnownColor.Purple); }
    /**
     * Gets the Red default brush.
     * @public
     */
    public static get Red(): PdfBrush { return this.getBrush(KnownColor.Red); }
    /**
     * Gets the RosyBrown default brush.
     * @public
     */
    public static get RosyBrown(): PdfBrush { return this.getBrush(KnownColor.RosyBrown); }
    /**
     * Gets the RoyalBlue default brush.
     * @public
     */
    public static get RoyalBlue(): PdfBrush { return this.getBrush(KnownColor.RoyalBlue); }
    /**
     * Gets the SaddleBrown default brush.
     * @public
     */
    public static get SaddleBrown(): PdfBrush { return this.getBrush(KnownColor.SaddleBrown); }
    /**
     * Gets the Salmon default brush.
     * @public
     */
    public static get Salmon(): PdfBrush { return this.getBrush(KnownColor.Salmon); }
    /**
     * Gets the SandyBrown default brush.
     * @public
     */
    public static get SandyBrown(): PdfBrush { return this.getBrush(KnownColor.SandyBrown); }
    /**
     * Gets the SeaGreen default brush.
     * @public
     */
    public static get SeaGreen(): PdfBrush { return this.getBrush(KnownColor.SeaGreen); }
    /**
     * Gets the SeaShell default brush.
     * @public
     */
    public static get SeaShell(): PdfBrush { return this.getBrush(KnownColor.SeaShell); }
    /**
     * Gets the Sienna default brush.
     * @public
     */
    public static get Sienna(): PdfBrush { return this.getBrush(KnownColor.Sienna); }
    /**
     * Gets the Silver default brush.
     * @public
     */
    public static get Silver(): PdfBrush { return this.getBrush(KnownColor.Silver); }
    /**
     * Gets the SkyBlue default brush.
     * @public
     */
    public static get SkyBlue(): PdfBrush { return this.getBrush(KnownColor.SkyBlue); }
    /**
     * Gets the SlateBlue default brush.
     * @public
     */
    public static get SlateBlue(): PdfBrush { return this.getBrush(KnownColor.SlateBlue); }
    /**
     * Gets the SlateGray default brush.
     * @public
     */
    public static get SlateGray(): PdfBrush { return this.getBrush(KnownColor.SlateGray); }
    /**
     * Gets the Snow default brush.
     * @public
     */
    public static get Snow(): PdfBrush { return this.getBrush(KnownColor.Snow); }
    /**
     * Gets the SpringGreen default brush.
     * @public
     */
    public static get SpringGreen(): PdfBrush { return this.getBrush(KnownColor.SpringGreen); }
    /**
     * Gets the SteelBlue default brush.
     * @public
     */
    public static get SteelBlue(): PdfBrush { return this.getBrush(KnownColor.SteelBlue); }
    /**
     * Gets the Tan default brush.
     * @public
     */
    public static get Tan(): PdfBrush { return this.getBrush(KnownColor.Tan); }
    /**
     * Gets the Teal default brush.
     * @public
     */
    public static get Teal(): PdfBrush { return this.getBrush(KnownColor.Teal); }
    /**
     * Gets the Thistle default brush.
     * @public
     */
    public static get Thistle(): PdfBrush { return this.getBrush(KnownColor.Thistle); }
    /**
     * Gets the Tomato default brush.
     * @public
     */
    public static get Tomato(): PdfBrush { return this.getBrush(KnownColor.Tomato); }
    /**
     * Gets the Transparent default brush.
     * @public
     */
    public static get Transparent(): PdfBrush { return this.getBrush(KnownColor.Transparent); }
    /**
     * Gets the Turquoise default brush.
     * @public
     */
    public static get Turquoise(): PdfBrush { return this.getBrush(KnownColor.Turquoise); }
    /**
     * Gets the Violet default brush.
     * @public
     */
    public static get Violet(): PdfBrush { return this.getBrush(KnownColor.Violet); }
    /**
     * Gets the Wheat default brush.
     * @public
     */
    public static get Wheat(): PdfBrush { return this.getBrush(KnownColor.Wheat); }
    /**
     * Gets the White default brush.
     * @public
     */
    public static get White(): PdfBrush { return this.getBrush(KnownColor.White); }
    /**
     * Gets the WhiteSmoke default brush.
     * @public
     */
    public static get WhiteSmoke(): PdfBrush { return this.getBrush(KnownColor.WhiteSmoke); }
    /**
     * Gets the Yellow default brush.
     * @public
     */
    public static get Yellow(): PdfBrush { return this.getBrush(KnownColor.Yellow); }
    /**
     * Gets the YellowGreen default brush.
     * @public
     */
    public static get YellowGreen(): PdfBrush { return this.getBrush(KnownColor.YellowGreen); }
    /**
     * Get the brush.
     */
    private static getBrush(colorName: KnownColor): PdfBrush {
        let brush: PdfBrush = (<PdfBrush>(this.sBrushes.getValue(colorName)));
        if (brush == null) {
            let pdfColor: PdfColor = this.getColorValue(colorName);
            brush = new PdfSolidBrush(pdfColor);
            this.sBrushes.setValue(colorName, brush);
        }
        return brush;
    }
    /**
     * Get the color value.
     * @param colorName The KnownColor name.
     */
    /* tslint:disable-next-line: max-line-length */
    private static getColorValue(colorName : KnownColor): PdfColor {
        let color : PdfColor = new PdfColor();
        if (colorName >= KnownColor.Transparent && colorName <= KnownColor.MenuHighlight) {
            let index : number = (colorName - KnownColor.Transparent) * 4;
        let alpha : number = this.knownColorData.charCodeAt(index + 3) === 0 ? 0 : 255;
        color = new PdfColor(alpha, this.knownColorData.charCodeAt(index), this.knownColorData.charCodeAt(index + 1), this.knownColorData.charCodeAt(index + 2));
        }
        return color;
    }
}