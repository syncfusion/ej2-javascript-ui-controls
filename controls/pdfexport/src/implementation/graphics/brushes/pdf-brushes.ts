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
    //Static Properties
    /**
     * Gets the AliceBlue brush.
     * @public
     */
    public static get AliceBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.AliceBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.AliceBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.AliceBlue);
        }
        return brush;
    }
    /**
     * Gets the antique white brush.
     * @public
     */
    public static get AntiqueWhite(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.AntiqueWhite)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.AntiqueWhite)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.AntiqueWhite);
        }
        return brush;
    }
    /**
     * Gets the Aqua default brush.
     * @public
     */
    public static get Aqua(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Aqua)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Aqua)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Aqua);
        }
        return brush;
    }
    /**
     * Gets the Aquamarine default brush.
     * @public
     */
    public static get Aquamarine(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Aquamarine)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Aquamarine)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Aquamarine);
        }
        return brush;
    }
    /**
     * Gets the Azure default brush.
     * @public
     */
    public static get Azure(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Azure)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Azure)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Azure);
        }
        return brush;
    }
    /**
     * Gets the Beige default brush.
     * @public
     */
    public static get Beige(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Beige)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Beige)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Beige);
        }
        return brush;
    }
    /**
     * Gets the Bisque default brush.
     * @public
     */
    public static get Bisque(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Bisque)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Bisque)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Bisque);
        }
        return brush;
    }
    /**
     * Gets the Black default brush.
     * @public
     */
    public static get Black(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Black)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Black)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Black);
        }
        return brush;
    }
    /**
     * Gets the BlanchedAlmond default brush.
     * @public
     */
    public static get BlanchedAlmond(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.BlanchedAlmond)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.BlanchedAlmond)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.BlanchedAlmond);
        }
        return brush;
    }
    /**
     * Gets the Blue default brush.
     * @public
     */
    public static get Blue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Blue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Blue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Blue);
        }
        return brush;
    }
    /**
     * Gets the BlueViolet default brush.
     * @public
     */
    public static get BlueViolet(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.BlueViolet)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.BlueViolet)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.BlueViolet);
        }
        return brush;
    }
    /**
     * Gets the Brown default brush.
     * @public
     */
    public static get Brown(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Brown)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Brown)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Brown);
        }
        return brush;
    }
    /**
     * Gets the BurlyWood default brush.
     * @public
     */
    public static get BurlyWood(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.BurlyWood)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.BurlyWood)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.BurlyWood);
        }
        return brush;
    }
    /**
     * Gets the CadetBlue default brush.
     * @public
     */
    public static get CadetBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.CadetBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.CadetBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.CadetBlue);
        }
        return brush;
    }
    /**
     * Gets the Chartreuse default brush.
     * @public
     */
    public static get Chartreuse(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Chartreuse)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Chartreuse)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Chartreuse);
        }
        return brush;
    }
    /**
     * Gets the Chocolate default brush.
     * @public
     */
    public static get Chocolate(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Chocolate)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Chocolate)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Chocolate);
        }
        return brush;
    }
    /**
     * Gets the Coral default brush.
     * @public
     */
    public static get Coral(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Coral)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Coral)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Coral);
        }
        return brush;
    }
    /**
     * Gets the CornflowerBlue default brush.
     * @public
     */
    public static get CornflowerBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.CornflowerBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.CornflowerBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.CornflowerBlue);
        }
        return brush;
    }
    /**
     * Gets the Corn silk default brush.
     * @public
     */
    public static get Cornsilk(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Cornsilk)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Cornsilk)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Cornsilk);
        }
        return brush;
    }
    /**
     *  Gets the Crimson default brush.
     * @public
     */
    public static get Crimson(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Crimson)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Crimson)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Crimson);
        }
        return brush;
    }
    /**
     * Gets the Cyan default brush.
     * @public
     */
    public static get Cyan(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Cyan)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Cyan)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Cyan);
        }
        return brush;
    }
    /**
     * Gets the DarkBlue default brush.
     * @public
     */
    public static get DarkBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkBlue);
        }
        return brush;
    }
    /**
     * Gets the DarkCyan default brush.
     * @public
     */
    public static get DarkCyan(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkCyan)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkCyan)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkCyan);
        }
        return brush;
    }
    /**
     * Gets the DarkGoldenrod default brush.
     * @public
     */
    public static get DarkGoldenrod(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkGoldenrod)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkGoldenrod)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkGoldenrod);
        }
        return brush;
    }
    /**
     * Gets the DarkGray default brush.
     * @public
     */
    public static get DarkGray(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkGray)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkGray)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkGray);
        }
        return brush;
    }
    /**
     * Gets the DarkGreen default brush.
     * @public
     */
    public static get DarkGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkGreen);
        }
        return brush;
    }
    /**
     * Gets the DarkKhaki default brush.
     * @public
     */
    public static get DarkKhaki(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkKhaki)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkKhaki)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkKhaki);
        }
        return brush;
    }
    /**
     * Gets the DarkMagenta default brush.
     * @public
     */
    public static get DarkMagenta(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkMagenta)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkMagenta)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkMagenta);
        }
        return brush;
    }
    /**
     * Gets the DarkOliveGreen default brush.
     * @public
     */
    public static get DarkOliveGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkOliveGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkOliveGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkOliveGreen);
        }
        return brush;
    }
    /**
     * Gets the DarkOrange default brush.
     * @public
     */
    public static get DarkOrange(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkOrange)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkOrange)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkOrange);
        }
        return brush;
    }
    /**
     * Gets the DarkOrchid default brush.
     * @public
     */
    public static get DarkOrchid(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkOrchid)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkOrchid)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkOrchid);
        }
        return brush;
    }
    /**
     * Gets the DarkRed default brush.
     * @public
     */
    public static get DarkRed(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkRed)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkRed)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkRed);
        }
        return brush;
    }
    /**
     * Gets the DarkSalmon default brush.
     * @public
     */
    public static get DarkSalmon(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkSalmon)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkSalmon)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkSalmon);
        }
        return brush;
    }
    /**
     * Gets the DarkSeaGreen default brush.
     * @public
     */
    public static get DarkSeaGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkSeaGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkSeaGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkSeaGreen);
        }
        return brush;
    }
    /**
     * Gets the DarkSlateBlue default brush.
     * @public
     */
    public static get DarkSlateBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkSlateBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkSlateBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkSlateBlue);
        }
        return brush;
    }
    /**
     * Gets the DarkSlateGray default brush.
     * @public
     */
    public static get DarkSlateGray(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkSlateGray)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkSlateGray)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkSlateGray);
        }
        return brush;
    }
    /**
     * Gets the DarkTurquoise default brush.
     * @public
     */
    public static get DarkTurquoise(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkTurquoise)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkTurquoise)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkTurquoise);
        }
        return brush;
    }
    /**
     * Gets the DarkViolet default brush.
     * @public
     */
    public static get DarkViolet(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DarkViolet)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DarkViolet)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DarkViolet);
        }
        return brush;
    }
    /**
     * Gets the DeepPink default brush.
     * @public
     */
    public static get DeepPink(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DeepPink)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DeepPink)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DeepPink);
        }
        return brush;
    }
    /**
     * Gets the DeepSkyBlue default brush.
     * @public
     */
    public static get DeepSkyBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DeepSkyBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DeepSkyBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DeepSkyBlue);
        }
        return brush;
    }
    /**
     * Gets the DimGray default brush.
     * @public
     */
    public static get DimGray(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DimGray)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DimGray)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DimGray);
        }
        return brush;
    }
    /**
     * Gets the DodgerBlue default brush.
     * @public
     */
    public static get DodgerBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.DodgerBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.DodgerBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.DodgerBlue);
        }
        return brush;
    }
    /**
     * Gets the Firebrick default brush.
     * @public
     */
    public static get Firebrick(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Firebrick)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Firebrick)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Firebrick);
        }
        return brush;
    }
    /**
     * Gets the FloralWhite default brush.
     * @public
     */
    public static get FloralWhite(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.FloralWhite)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.FloralWhite)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.FloralWhite);
        }
        return brush;
    }
    /**
     * Gets the ForestGreen default brush.
     * @public
     */
    public static get ForestGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.ForestGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.ForestGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.ForestGreen);
        }
        return brush;
    }
    /**
     * Gets the Fuchsia default brush.
     * @public
     */
    public static get Fuchsia(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Fuchsia)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Fuchsia)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Fuchsia);
        }
        return brush;
    }
    /**
     * Gets the Gainsborough default brush.
     * @public
     */
    public static get Gainsboro(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Gainsboro)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Gainsboro)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Gainsboro);
        }
        return brush;
    }
    /**
     * Gets the GhostWhite default brush.
     * @public
     */
    public static get GhostWhite(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.GhostWhite)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.GhostWhite)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.GhostWhite);
        }
        return brush;
    }
    /**
     * Gets the Gold default brush.
     * @public
     */
    public static get Gold(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Gold)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Gold)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Gold);
        }
        return brush;
    }
    /**
     * Gets the Goldenrod default brush.
     * @public
     */
    public static get Goldenrod(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Goldenrod)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Goldenrod)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Goldenrod);
        }
        return brush;
    }
    /**
     * Gets the Gray default brush.
     * @public
     */
    public static get Gray(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Gray)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Gray)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Gray);
        }
        return brush;
    }
    /**
     * Gets the Green default brush.
     * @public
     */
    public static get Green(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Green)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Green)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Green);
        }
        return brush;
    }
    /**
     * Gets the GreenYellow default brush.
     * @public
     */
    public static get GreenYellow(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.GreenYellow)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.GreenYellow)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.GreenYellow);
        }
        return brush;
    }
    /**
     * Gets the Honeydew default brush.
     * @public
     */
    public static get Honeydew(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Honeydew)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Honeydew)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Honeydew);
        }
        return brush;
    }
    /**
     * Gets the HotPink default brush.
     * @public
     */
    public static get HotPink(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.HotPink)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.HotPink)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.HotPink);
        }
        return brush;
    }
    /**
     * Gets the IndianRed default brush.
     * @public
     */
    public static get IndianRed(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.IndianRed)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.IndianRed)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.IndianRed);
        }
        return brush;
    }
    /**
     * Gets the Indigo default brush.
     * @public
     */
    public static get Indigo(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Indigo)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Indigo)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Indigo);
        }
        return brush;
    }
    /**
     * Gets the Ivory default brush.
     * @public
     */
    public static get Ivory(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Ivory)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Ivory)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Ivory);
        }
        return brush;
    }
    /**
     * Gets the Khaki default brush.
     * @public
     */
    public static get Khaki(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Khaki)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Khaki)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Khaki);
        }
        return brush;
    }
    /**
     * Gets the Lavender default brush.
     * @public
     */
    public static get Lavender(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Lavender)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Lavender)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Lavender);
        }
        return brush;
    }
    /**
     * Gets the LavenderBlush default brush.
     * @public
     */
    public static get LavenderBlush(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LavenderBlush)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LavenderBlush)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LavenderBlush);
        }
        return brush;
    }
    /**
     * Gets the LawnGreen default brush.
     * @public
     */
    public static get LawnGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LawnGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LawnGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LawnGreen);
        }
        return brush;
    }
    /**
     * Gets the LemonChiffon default brush.
     * @public
     */
    public static get LemonChiffon(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LemonChiffon)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LemonChiffon)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LemonChiffon);
        }
        return brush;
    }
    /**
     * Gets the LightBlue default brush.
     * @public
     */
    public static get LightBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LightBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LightBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LightBlue);
        }
        return brush;
    }
    /**
     * Gets the LightCoral default brush.
     * @public
     */
    public static get LightCoral(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LightCoral)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LightCoral)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LightCoral);
        }
        return brush;
    }
    /**
     * Gets the LightCyan default brush.
     * @public
     */
    public static get LightCyan(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LightCyan)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LightCyan)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LightCyan);
        }
        return brush;
    }
    /**
     * Gets the LightGoldenrodYellow default brush.
     * @public
     */
    public static get LightGoldenrodYellow(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LightGoldenrodYellow)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LightGoldenrodYellow)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LightGoldenrodYellow);
        }
        return brush;
    }
    /**
     * Gets the LightGray default brush.
     * @public
     */
    public static get LightGray(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LightGray)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LightGray)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LightGray);
        }
        return brush;
    }
    /**
     * Gets the LightGreen default brush.
     * @public
     */
    public static get LightGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LightGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LightGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LightGreen);
        }
        return brush;
    }
    /**
     * Gets the LightPink default brush.
     * @public
     */
    public static get LightPink(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LightPink)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LightPink)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LightPink);
        }
        return brush;
    }
    /**
     * Gets the LightSalmon default brush.
     * @public
     */
    public static get LightSalmon(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LightSalmon)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LightSalmon)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LightSalmon);
        }
        return brush;
    }
    /**
     * Gets the LightSeaGreen default brush.
     * @public
     */
    public static get LightSeaGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LightSeaGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LightSeaGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LightSeaGreen);
        }
        return brush;
    }
    /**
     * Gets the LightSkyBlue default brush.
     * @public
     */
    public static get LightSkyBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LightSkyBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LightSkyBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LightSkyBlue);
        }
        return brush;
    }
    /**
     * Gets the LightSlateGray default brush.
     * @public
     */
    public static get LightSlateGray(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LightSlateGray)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LightSlateGray)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LightSlateGray);
        }
        return brush;
    }
    /**
     * Gets the LightSteelBlue default brush.
     * @public
     */
    public static get LightSteelBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LightSteelBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LightSteelBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LightSteelBlue);
        }
        return brush;
    }
    /**
     * Gets the LightYellow default brush.
     * @public
     */
    public static get LightYellow(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LightYellow)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LightYellow)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LightYellow);
        }
        return brush;
    }
    /**
     * Gets the Lime default brush.
     * @public
     */
    public static get Lime(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Lime)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Lime)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Lime);
        }
        return brush;
    }
    /**
     * Gets the LimeGreen default brush.
     * @public
     */
    public static get LimeGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.LimeGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.LimeGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.LimeGreen);
        }
        return brush;
    }
    /**
     * Gets the Linen default brush.
     * @public
     */
    public static get Linen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Linen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Linen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Linen);
        }
        return brush;
    }
    /**
     * Gets the Magenta default brush.
     * @public
     */
    public static get Magenta(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Magenta)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Magenta)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Magenta);
        }
        return brush;
    }
    /**
     * Gets the Maroon default brush.
     * @public
     */
    public static get Maroon(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Maroon)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Maroon)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Maroon);
        }
        return brush;
    }
    /**
     * Gets the MediumAquamarine default brush.
     * @public
     */
    public static get MediumAquamarine(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.MediumAquamarine)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.MediumAquamarine)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.MediumAquamarine);
        }
        return brush;
    }
    /**
     * Gets the MediumBlue default brush.
     * @public
     */
    public static get MediumBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.MediumBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.MediumBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.MediumBlue);
        }
        return brush;
    }
    /**
     * Gets the MediumOrchid default brush.
     * @public
     */
    public static get MediumOrchid(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.MediumOrchid)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.MediumOrchid)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.MediumOrchid);
        }
        return brush;
    }
    /**
     * Gets the MediumPurple default brush.
     * @public
     */
    public static get MediumPurple(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.MediumPurple)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.MediumPurple)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.MediumPurple);
        }
        return brush;
    }
    /**
     * Gets the MediumSeaGreen default brush.
     * @public
     */
    public static get MediumSeaGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.MediumSeaGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.MediumSeaGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.MediumSeaGreen);
        }
        return brush;
    }
    /**
     * Gets the MediumSlateBlue default brush.
     * @public
     */
    public static get MediumSlateBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.MediumSlateBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.MediumSlateBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.MediumSlateBlue);
        }
        return brush;
    }
    /**
     * Gets the MediumSpringGreen default brush.
     * @public
     */
    public static get MediumSpringGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.MediumSpringGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.MediumSpringGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.MediumSpringGreen);
        }
        return brush;
    }
    /**
     * Gets the MediumTurquoise default brush.
     * @public
     */
    public static get MediumTurquoise(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.MediumTurquoise)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.MediumTurquoise)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.MediumTurquoise);
        }
        return brush;
    }
    /**
     * Gets the MediumVioletRed default brush.
     * @public
     */
    public static get MediumVioletRed(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.MediumVioletRed)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.MediumVioletRed)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.MediumVioletRed);
        }
        return brush;
    }
    /**
     * Gets the MidnightBlue default brush.
     * @public
     */
    public static get MidnightBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.MidnightBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.MidnightBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.MidnightBlue);
        }
        return brush;
    }
    /**
     * Gets the MintCream default brush.
     * @public
     */
    public static get MintCream(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.MintCream)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.MintCream)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.MintCream);
        }
        return brush;
    }
    /**
     * Gets the MistyRose default brush.
     * @public
     */
    public static get MistyRose(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.MistyRose)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.MistyRose)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.MistyRose);
        }
        return brush;
    }
    /**
     * Gets the Moccasin default brush.
     * @public
     */
    public static get Moccasin(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Moccasin)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Moccasin)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Moccasin);
        }
        return brush;
    }
    /**
     * Gets the NavajoWhite default brush.
     * @public
     */
    public static get NavajoWhite(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.NavajoWhite)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.NavajoWhite)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.NavajoWhite);
        }
        return brush;
    }
    /**
     * Gets the Navy default brush.
     * @public
     */
    public static get Navy(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Navy)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Navy)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Navy);
        }
        return brush;
    }
    /**
     * Gets the OldLace default brush.
     * @public
     */
    public static get OldLace(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.OldLace)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.OldLace)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.OldLace);
        }
        return brush;
    }
    /**
     * Gets the Olive default brush.
     * @public
     */
    public static get Olive(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Olive)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Olive)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Olive);
        }
        return brush;
    }
    /**
     * Gets the OliveDrab default brush.
     * @public
     */
    public static get OliveDrab(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.OliveDrab)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.OliveDrab)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.OliveDrab);
        }
        return brush;
    }
    /**
     * Gets the Orange default brush.
     * @public
     */
    public static get Orange(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Orange)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Orange)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Orange);
        }
        return brush;
    }
    /**
     * Gets the OrangeRed default brush.
     * @public
     */
    public static get OrangeRed(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.OrangeRed)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.OrangeRed)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.OrangeRed);
        }
        return brush;
    }
    /**
     * Gets the Orchid default brush.
     * @public
     */
    public static get Orchid(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Orchid)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Orchid)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Orchid);
        }
        return brush;
    }
    /**
     * Gets the PaleGoldenrod default brush.
     * @public
     */
    public static get PaleGoldenrod(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.PaleGoldenrod)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.PaleGoldenrod)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.PaleGoldenrod);
        }
        return brush;
    }
    /**
     * Gets the PaleGreen default brush.
     * @public
     */
    public static get PaleGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.PaleGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.PaleGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.PaleGreen);
        }
        return brush;
    }
    /**
     * Gets the PaleTurquoise default brush.
     * @public
     */
    public static get PaleTurquoise(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.PaleTurquoise)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.PaleTurquoise)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.PaleTurquoise);
        }
        return brush;
    }
    /**
     * Gets the PaleVioletRed default brush.
     * @public
     */
    public static get PaleVioletRed(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.PaleVioletRed)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.PaleVioletRed)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.PaleVioletRed);
        }
        return brush;
    }
    /**
     * Gets the PapayaWhip default brush.
     * @public
     */
    public static get PapayaWhip(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.PapayaWhip)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.PapayaWhip)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.PapayaWhip);
        }
        return brush;
    }
    /**
     * Gets the PeachPuff default brush.
     * @public
     */
    public static get PeachPuff(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.PeachPuff)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.PeachPuff)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.PeachPuff);
        }
        return brush;
    }
    /**
     * Gets the Peru default brush.
     * @public
     */
    public static get Peru(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Peru)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Peru)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Peru);
        }
        return brush;
    }
    /**
     * Gets the Pink default brush.
     * @public
     */
    public static get Pink(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Pink)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Pink)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Pink);
        }
        return brush;
    }
    /**
     * Gets the Plum default brush.
     * @public
     */
    public static get Plum(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Plum)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Plum)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Plum);
        }
        return brush;
    }
    /**
     * Gets the PowderBlue default brush.
     * @public
     */
    public static get PowderBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.PowderBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.PowderBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.PowderBlue);
        }
        return brush;
    }
    /**
     * Gets the Purple default brush.
     * @public
     */
    public static get Purple(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Purple)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Purple)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Purple);
        }
        return brush;
    }
    /**
     * Gets the Red default brush.
     * @public
     */
    public static get Red(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Red)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Red)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Red);
        }
        return brush;
    }
    /**
     * Gets the RosyBrown default brush.
     * @public
     */
    public static get RosyBrown(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.RosyBrown)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.RosyBrown)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.RosyBrown);
        }
        return brush;
    }
    /**
     * Gets the RoyalBlue default brush.
     * @public
     */
    public static get RoyalBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.RoyalBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.RoyalBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.RoyalBlue);
        }
        return brush;
    }
    /**
     * Gets the SaddleBrown default brush.
     * @public
     */
    public static get SaddleBrown(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.SaddleBrown)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.SaddleBrown)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.SaddleBrown);
        }
        return brush;
    }
    /**
     * Gets the Salmon default brush.
     * @public
     */
    public static get Salmon(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Salmon)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Salmon)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Salmon);
        }
        return brush;
    }
    /**
     * Gets the SandyBrown default brush.
     * @public
     */
    public static get SandyBrown(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.SandyBrown)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.SandyBrown)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.SandyBrown);
        }
        return brush;
    }
    /**
     * Gets the SeaGreen default brush.
     * @public
     */
    public static get SeaGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.SeaGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.SeaGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.SeaGreen);
        }
        return brush;
    }
    /**
     * Gets the SeaShell default brush.
     * @public
     */
    public static get SeaShell(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.SeaShell)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.SeaShell)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.SeaShell);
        }
        return brush;
    }
    /**
     * Gets the Sienna default brush.
     * @public
     */
    public static get Sienna(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Sienna)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Sienna)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Sienna);
        }
        return brush;
    }
    /**
     * Gets the Silver default brush.
     * @public
     */
    public static get Silver(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Silver)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Silver)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Silver);
        }
        return brush;
    }
    /**
     * Gets the SkyBlue default brush.
     * @public
     */
    public static get SkyBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.SkyBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.SkyBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.SkyBlue);
        }
        return brush;
    }
    /**
     * Gets the SlateBlue default brush.
     * @public
     */
    public static get SlateBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.SlateBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.SlateBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.SlateBlue);
        }
        return brush;
    }
    /**
     * Gets the SlateGray default brush.
     * @public
     */
    public static get SlateGray(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.SlateGray)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.SlateGray)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.SlateGray);
        }
        return brush;
    }
    /**
     * Gets the Snow default brush.
     * @public
     */
    public static get Snow(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Snow)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Snow)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Snow);
        }
        return brush;
    }
    /**
     * Gets the SpringGreen default brush.
     * @public
     */
    public static get SpringGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.SpringGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.SpringGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.SpringGreen);
        }
        return brush;
    }
    /**
     * Gets the SteelBlue default brush.
     * @public
     */
    public static get SteelBlue(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.SteelBlue)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.SteelBlue)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.SteelBlue);
        }
        return brush;
    }
    /**
     * Gets the Tan default brush.
     * @public
     */
    public static get Tan(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Tan)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Tan)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Tan);
        }
        return brush;
    }
    /**
     * Gets the Teal default brush.
     * @public
     */
    public static get Teal(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Teal)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Teal)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Teal);
        }
        return brush;
    }
    /**
     * Gets the Thistle default brush.
     * @public
     */
    public static get Thistle(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Thistle)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Thistle)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Thistle);
        }
        return brush;
    }
    /**
     * Gets the Tomato default brush.
     * @public
     */
    public static get Tomato(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Tomato)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Tomato)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Tomato);
        }
        return brush;
    }
    /**
     * Gets the Transparent default brush.
     * @public
     */
    public static get Transparent(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Transparent)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Transparent)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Transparent);
        }
        return brush;
    }
    /**
     * Gets the Turquoise default brush.
     * @public
     */
    public static get Turquoise(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Turquoise)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Turquoise)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Turquoise);
        }
        return brush;
    }
    /**
     * Gets the Violet default brush.
     * @public
     */
    public static get Violet(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Violet)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Violet)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Violet);
        }
        return brush;
    }
    /**
     * Gets the Wheat default brush.
     * @public
     */
    public static get Wheat(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Wheat)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Wheat)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Wheat);
        }
        return brush;
    }
    /**
     * Gets the White default brush.
     * @public
     */
    public static get White(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.White)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.White)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.White);
        }
        return brush;
    }
    /**
     * Gets the WhiteSmoke default brush.
     * @public
     */
    public static get WhiteSmoke(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.WhiteSmoke)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.WhiteSmoke)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.WhiteSmoke);
        }
        return brush;
    }
    /**
     * Gets the Yellow default brush.
     * @public
     */
    public static get Yellow(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.Yellow)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.Yellow)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.Yellow);
        }
        return brush;
    }
    /**
     * Gets the YellowGreen default brush.
     * @public
     */
    public static get YellowGreen(): PdfBrush {
        let brush: PdfBrush = null;
        if (this.sBrushes.containsKey(KnownColor.YellowGreen)) {
            brush = (<PdfBrush>(this.sBrushes.getValue(KnownColor.YellowGreen)));
        }
        if ((brush == null)) {
            brush = this.getBrush(KnownColor.YellowGreen);
        }
        return brush;
    }
    /**
     * Get the brush.
     */
    private static getBrush(colorName: KnownColor): PdfBrush {
        let pdfColor: PdfColor = this.getColorValue(colorName);
        let brush: PdfBrush = new PdfSolidBrush(pdfColor);
        this.sBrushes.setValue(colorName, brush);
        return brush;
    }
    /**
     * Get the color value.
     * @param colorName The KnownColor name.
     */
    /* tslint:disable */
    private static getColorValue(colorName : KnownColor): PdfColor {
        let color : PdfColor = new PdfColor();
        switch (colorName) {
            case KnownColor.Transparent:
                color = new PdfColor(0, 255, 255, 255);
                break;
            case KnownColor.AliceBlue:
                color = new PdfColor(255, 240, 248, 255);
                break;
            case KnownColor.AntiqueWhite:
                color = new PdfColor(255, 250, 235, 215);
                break;
            case KnownColor.Aqua:
                color = new PdfColor(255, 0, 255, 255);
                break;
            case KnownColor.Aquamarine:
                color = new PdfColor(255, 127, 255, 212);
                break;
            case KnownColor.Azure:
                color = new PdfColor(255, 240, 255, 255);
                break;
            case KnownColor.Beige:
                color = new PdfColor(255, 245, 245, 220);
                break;
            case KnownColor.Bisque:
                color = new PdfColor(255, 255, 228, 196);
                break;
            case KnownColor.Black:
                color = new PdfColor(255, 0, 0, 0);
                break;
            case KnownColor.BlanchedAlmond:
                color = new PdfColor(255, 255, 235, 205);
                break;
            case KnownColor.Blue:
                color = new PdfColor(255, 0, 0, 255);
                break;
            case KnownColor.BlueViolet:
                color = new PdfColor(255, 138, 43, 226);
                break;
            case KnownColor.Brown:
                color = new PdfColor(255, 165, 42, 42);
                break;
            case KnownColor.BurlyWood:
                color = new PdfColor(255, 222, 184, 135);
                break;
            case KnownColor.CadetBlue:
                color = new PdfColor(255, 95, 158, 160);
                break;
            case KnownColor.Chartreuse:
                color = new PdfColor(255, 127, 255, 0);
                break;
            case KnownColor.Chocolate:
                color = new PdfColor(255, 210, 105, 30);
                break;
            case KnownColor.Coral:
                color = new PdfColor(255, 255, 127, 80);
                break;
            case KnownColor.CornflowerBlue:
                color = new PdfColor(255, 100, 149, 237);
                break;
            case KnownColor.Cornsilk:
                color = new PdfColor(255, 255, 248, 220);
                break;
            case KnownColor.Crimson:
                color = new PdfColor(255, 220, 20, 60);
                break;
            case KnownColor.Cyan:
                color = new PdfColor(255, 0, 255, 255);
                break;
            case KnownColor.DarkBlue:
                color = new PdfColor(255, 0, 0, 139);
                break;
            case KnownColor.DarkCyan:
                color = new PdfColor(255, 0, 139, 139);
                break;
            case KnownColor.DarkGoldenrod:
                color = new PdfColor(255, 184, 134, 11);
                break;
            case KnownColor.DarkGray:
                color = new PdfColor(255, 169, 169, 169);
                break;
            case KnownColor.DarkGreen:
                color = new PdfColor(255, 0, 100, 0);
                break;
            case KnownColor.DarkKhaki:
                color = new PdfColor(255, 189, 183, 107);
                break;
            case KnownColor.DarkMagenta:
                color = new PdfColor(255, 139, 0, 139);
                break;
            case KnownColor.DarkOliveGreen:
                color = new PdfColor(255, 85, 107, 47);
                break;
            case KnownColor.DarkOrange:
                color = new PdfColor(255, 255, 140, 0);
                break;
            case KnownColor.DarkOrchid:
                color = new PdfColor(255, 153, 50, 204);
                break;
            case KnownColor.DarkRed:
                color = new PdfColor(255, 139, 0, 0);
                break;
            case KnownColor.DarkSalmon:
                color = new PdfColor(255, 233, 150, 122);
                break;
            case KnownColor.DarkSeaGreen:
                color = new PdfColor(255, 143, 188, 139);
                break;
            case KnownColor.DarkSlateBlue:
                color = new PdfColor(255, 72, 61, 139);
                break;
            case KnownColor.DarkSlateGray:
                color = new PdfColor(255, 47, 79, 79);
                break;
            case KnownColor.DarkTurquoise:
                color = new PdfColor(255, 0, 206, 209);
                break;
            case KnownColor.DarkViolet:
                color = new PdfColor(255, 148, 0, 211);
                break;
            case KnownColor.DeepPink:
                color = new PdfColor(255, 255, 20, 147);
                break;
            case KnownColor.DeepSkyBlue:
                color = new PdfColor(255, 0, 191, 255);
                break;
            case KnownColor.DimGray:
                color = new PdfColor(255, 105, 105, 105);
                break;
            case KnownColor.DodgerBlue:
                color = new PdfColor(255, 30, 144, 255);
                break;
            case KnownColor.Firebrick:
                color = new PdfColor(255, 178, 34, 34);
                break;
            case KnownColor.FloralWhite:
                color = new PdfColor(255, 255, 250, 240);
                break;
            case KnownColor.ForestGreen:
                color = new PdfColor(255, 34, 139, 34);
                break;
            case KnownColor.Fuchsia:
                color = new PdfColor(255, 255, 0, 255);
                break;
            case KnownColor.Gainsboro:
                color = new PdfColor(255, 220, 220, 220);
                break;
            case KnownColor.GhostWhite:
                color = new PdfColor(255, 248, 248, 255);
                break;
            case KnownColor.Gold:
                color = new PdfColor(255, 255, 215, 0);
                break;
            case KnownColor.Goldenrod:
                color = new PdfColor(255, 218, 165, 32);
                break;
            case KnownColor.Gray:
                color = new PdfColor(255, 128, 128, 128);
                break;
            case KnownColor.Green:
                color = new PdfColor(255, 0, 128, 0);
                break;
            case KnownColor.GreenYellow:
                color = new PdfColor(255, 173, 255, 47);
                break;
            case KnownColor.Honeydew:
                color = new PdfColor(255, 240, 255, 240);
                break;
            case KnownColor.HotPink:
                color = new PdfColor(255, 255, 105, 180);
                break;
            case KnownColor.IndianRed:
                color = new PdfColor(255, 205, 92, 92);
                break;
            case KnownColor.Indigo:
                color = new PdfColor(255, 75, 0, 130);
                break;
            case KnownColor.Ivory:
                color = new PdfColor(255, 255, 255, 240);
                break;
            case KnownColor.Khaki:
                color = new PdfColor(255, 240, 230, 140);
                break;
            case KnownColor.Lavender:
                color = new PdfColor(255, 230, 230, 250);
                break;
            case KnownColor.LavenderBlush:
                color = new PdfColor(255, 255, 240, 245);
                break;
            case KnownColor.LawnGreen:
                color = new PdfColor(255, 124, 252, 0);
                break;
            case KnownColor.LemonChiffon:
                color = new PdfColor(255, 255, 250, 205);
                break;
            case KnownColor.LightBlue:
                color = new PdfColor(255, 173, 216, 230);
                break;
            case KnownColor.LightCoral:
                color = new PdfColor(255, 240, 128, 128);
                break;
            case KnownColor.LightCyan:
                color = new PdfColor(255, 224, 255, 255);
                break;
                case KnownColor.LightGoldenrodYellow:
                color = new PdfColor(255, 250, 250, 210);
                break;
            case KnownColor.LightGreen:
                color = new PdfColor(255, 144, 238, 144);
                break;
            case KnownColor.LightGray:
                color = new PdfColor(255, 211, 211, 211);
                break;
            case KnownColor.LightPink:
                color = new PdfColor(255, 255, 182, 193);
                break;
            case KnownColor.LightSalmon:
                color = new PdfColor(255, 255, 160, 122);
                break;
            case KnownColor.LightSeaGreen:
                color = new PdfColor(255, 32, 178, 170);
                break;
            case KnownColor.LightSkyBlue:
                color = new PdfColor(255, 135, 206, 250);
                break;
            case KnownColor.LightSlateGray:
                color = new PdfColor(255, 119, 136, 153);
                break;
            case KnownColor.LightSteelBlue:
                color = new PdfColor(255, 176, 196, 222);
                break;
            case KnownColor.LightYellow:
                color = new PdfColor(255, 255, 255, 224);
                break;
            case KnownColor.Lime:
                color = new PdfColor(255, 0, 255, 0);
                break;
            case KnownColor.LimeGreen:
                color = new PdfColor(255, 50, 205, 50);
                break;
            case KnownColor.Linen:
                color = new PdfColor(255, 250, 240, 230);
                break;
            case KnownColor.Magenta:
                color = new PdfColor(255, 255, 0, 255);
                break;
            case KnownColor.Maroon:
                color = new PdfColor(255, 128, 0, 0);
                break;
            case KnownColor.MediumAquamarine:
                color = new PdfColor(255, 102, 205, 170);
                break;
            case KnownColor.MediumBlue:
                color = new PdfColor(255, 0, 0, 205);
                break;
            case KnownColor.MediumOrchid:
                color = new PdfColor(255, 186, 85, 211);
                break;
            case KnownColor.MediumPurple:
                color = new PdfColor(255, 147, 112, 219);
                break;
            case KnownColor.MediumSeaGreen:
                color = new PdfColor(255, 60, 179, 113);
                break;
            case KnownColor.MediumSlateBlue:
                color = new PdfColor(255, 123, 104, 238);
                break;
            case KnownColor.MediumSpringGreen:
                color = new PdfColor(255, 0, 250, 154);
                break;
            case KnownColor.MediumTurquoise:
                color = new PdfColor(255, 72, 209, 204);
                break;
            case KnownColor.MediumVioletRed:
                color = new PdfColor(255, 199, 21, 133);
                break;
            case KnownColor.MidnightBlue:
                color = new PdfColor(255, 25, 25, 112);
                break;
            case KnownColor.MintCream:
                color = new PdfColor(255, 245, 255, 250);
                break;
            case KnownColor.MistyRose:
                color = new PdfColor(255, 255, 228, 225);
                break;
            case KnownColor.Moccasin:
                color = new PdfColor(255, 255, 228, 181);
                break;
            case KnownColor.NavajoWhite:
                color = new PdfColor(255, 255, 222, 173);
                break;
            case KnownColor.Navy:
                color = new PdfColor(255, 0, 0, 128);
                break;
            case KnownColor.OldLace:
                color = new PdfColor(255, 253, 245, 230);
                break;
            case KnownColor.Olive:
                color = new PdfColor(255, 128, 128, 0);
                break;
            case KnownColor.OliveDrab:
                color = new PdfColor(255, 107, 142, 35);
                break;
            case KnownColor.Orange:
                color = new PdfColor(255, 255, 165, 0);
                break;
            case KnownColor.OrangeRed:
                color = new PdfColor(255, 255, 69, 0);
                break;
            case KnownColor.Orchid:
                color = new PdfColor(255, 218, 112, 214);
                break;
            case KnownColor.PaleGoldenrod:
                color = new PdfColor(255, 238, 232, 170);
                break;
            case KnownColor.PaleGreen:
                color = new PdfColor(255, 152, 251, 152);
                break;
            case KnownColor.PaleTurquoise:
                color = new PdfColor(255, 175, 238, 238);
                break;
            case KnownColor.PaleVioletRed:
                color = new PdfColor(255, 219, 112, 147);
                break;
            case KnownColor.PapayaWhip:
                color = new PdfColor(255, 255, 239, 213);
                break;
            case KnownColor.PeachPuff:
                color = new PdfColor(255, 255, 218, 185);
                break;
            case KnownColor.Peru:
                color = new PdfColor(255, 205, 133, 63);
                break;
            case KnownColor.Pink:
                color = new PdfColor(255, 255, 192, 203);
                break;
            case KnownColor.Plum:
                color = new PdfColor(255, 221, 160, 221);
                break;
            case KnownColor.PowderBlue:
                color = new PdfColor(255, 176, 224, 230);
                break;
            case KnownColor.Purple:
                color = new PdfColor(255, 128, 0, 128);
                break;
            case KnownColor.Red:
                color = new PdfColor(255, 255, 0, 0);
                break;
            case KnownColor.RosyBrown:
                color = new PdfColor(255, 188, 143, 143);
                break;
            case KnownColor.RoyalBlue:
                color = new PdfColor(255, 65, 105, 225);
                break;
            case KnownColor.SaddleBrown:
                color = new PdfColor(255, 139, 69, 19);
                break;
            case KnownColor.Salmon:
                color = new PdfColor(255, 250, 128, 114);
                break;
            case KnownColor.SandyBrown:
                color = new PdfColor(255, 244, 164, 96);
                break;
            case KnownColor.SeaGreen:
                color = new PdfColor(255, 46, 139, 87);
                break;
            case KnownColor.SeaShell:
                color = new PdfColor(255, 255, 245, 238);
                break;
            case KnownColor.Sienna:
                color = new PdfColor(255, 160, 82, 45);
                break;
            case KnownColor.Silver:
                color = new PdfColor(255, 192, 192, 192);
                break;
            case KnownColor.SkyBlue:
                color = new PdfColor(255, 135, 206, 235);
                break;
            case KnownColor.SlateBlue:
                color = new PdfColor(255, 106, 90, 205);
                break;
            case KnownColor.SlateGray:
                color = new PdfColor(255, 112, 128, 144);
                break;
            case KnownColor.Snow:
                color = new PdfColor(255, 255, 250, 250);
                break;
            case KnownColor.SpringGreen:
                color = new PdfColor(255, 0, 255, 127);
                break;
            case KnownColor.SteelBlue:
                color = new PdfColor(255, 70, 130, 180);
                break;
            case KnownColor.Tan:
                color = new PdfColor(255, 210, 180, 140);
                break;
            case KnownColor.Teal:
                color = new PdfColor(255, 0, 128, 128);
                break;
            case KnownColor.Thistle:
                color = new PdfColor(255, 216, 191, 216);
                break;
            case KnownColor.Tomato:
                color = new PdfColor(255, 255, 99, 71);
                break;
            case KnownColor.Turquoise:
                color = new PdfColor(255, 64, 224, 208);
                break;
            case KnownColor.Violet:
                color = new PdfColor(255, 238, 130, 238);
                break;
            case KnownColor.Wheat:
                color = new PdfColor(255, 245, 222, 179);
                break;
            case KnownColor.White:
                color = new PdfColor(255, 255, 255, 255);
                break;
            case KnownColor.WhiteSmoke:
                color = new PdfColor(255, 245, 245, 245);
                break;
            case KnownColor.Yellow:
                color = new PdfColor(255, 255, 255, 0);
                break;
            case KnownColor.YellowGreen:
                color = new PdfColor(255, 154, 205, 50);
                break;
        }
        return color;
    }
}
