/**
 * `IPdfTrueTypeFont.ts` interface for EJ2-PDF
 * Defines the basic interace of the various Pdf True Type Font.
 * @private
 */
import { IPdfPrimitive } from './i-pdf-primitives';
import { PdfFontMetrics } from './../implementation/graphics/fonts/pdf-font-metrics';
import { PdfFont } from './../implementation/graphics/fonts/pdf-font';
export interface IPdfTrueTypeFont {
     /// <summary>
        /// Gets size of the font.
        /// </summary>
        size : number;
        /// <summary>
        /// Gets font metrics.
        /// </summary>
        metrics : PdfFontMetrics;
        /// <summary>
        /// Gets the pdf primitive.
        /// </summary>
        getInternals() : IPdfPrimitive;
        /// <summary>
        /// Checks whether fonts are equals.
        /// </summary>
        /// <param name="font">Font to compare.</param>
        /// <returns>True if fonts are equal, False ofhtrwise.</returns>
        equalsToFont(font : PdfFont) : boolean;
        /// <summary>
        /// Creates font internals.
        /// </summary>
        createInternals() : void ;
        /// <summary>
        /// Returns width of the char symbol.
        /// </summary>
        /// <param name="charCode">Char symbol.</param>
        /// <returns>Width of the char symbol in universal units.</returns>
        getCharWidth(charCode : string) : number ;
        /// <summary>
        /// Returns width of the text line.
        /// </summary>
        /// <param name="line">String line.</param>
        /// <returns>Width of the char symbol in universal units.</returns>
        getLineWidth( line : string) : number;
        /// <summary>
        /// Releases all resources.
        /// </summary>
        close() : void;
}