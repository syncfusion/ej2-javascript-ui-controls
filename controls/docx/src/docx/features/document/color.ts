import { objectEntries, ownGet } from '../../core/compat/object-compat';
/**
 * Specifies the named colors used by character, paragraph, border, and fill formatting.
 *
 * @public
 */
export enum Color {
    /** Specifies the transparent color. */
    Transparent = 0,
    /** Specifies the alice blue color. */
    AliceBlue,
    /** Specifies the antique white color. */
    AntiqueWhite,
    /** Specifies the aqua color. */
    Aqua,
    /** Specifies the aquamarine color. */
    Aquamarine,
    /** Specifies the azure color. */
    Azure,
    /** Specifies the beige color. */
    Beige,
    /** Specifies the bisque color. */
    Bisque,
    /** Specifies the black color. */
    Black,
    /** Specifies the blanched almond color. */
    BlanchedAlmond,
    /** Specifies the blue color. */
    Blue,
    /** Specifies the blue violet color. */
    BlueViolet,
    /** Specifies the brown color. */
    Brown,
    /** Specifies the burly wood color. */
    BurlyWood,
    /** Specifies the cadet blue color. */
    CadetBlue,
    /** Specifies the chartreuse color. */
    Chartreuse,
    /** Specifies the chocolate color. */
    Chocolate,
    /** Specifies the coral color. */
    Coral,
    /** Specifies the cornflower blue color. */
    CornflowerBlue,
    /** Specifies the cornsilk color. */
    Cornsilk,
    /** Specifies the crimson color. */
    Crimson,
    /** Specifies the cyan color. */
    Cyan,
    /** Specifies the dark blue color. */
    DarkBlue,
    /** Specifies the dark cyan color. */
    DarkCyan,
    /** Specifies the dark goldenrod color. */
    DarkGoldenrod,
    /** Specifies the dark gray color. */
    DarkGray,
    /** Specifies the dark green color. */
    DarkGreen,
    /** Specifies the dark khaki color. */
    DarkKhaki,
    /** Specifies the dark magenta color. */
    DarkMagenta,
    /** Specifies the dark olive green color. */
    DarkOliveGreen,
    /** Specifies the dark orange color. */
    DarkOrange,
    /** Specifies the dark orchid color. */
    DarkOrchid,
    /** Specifies the dark red color. */
    DarkRed,
    /** Specifies the dark salmon color. */
    DarkSalmon,
    /** Specifies the dark sea green color. */
    DarkSeaGreen,
    /** Specifies the dark slate blue color. */
    DarkSlateBlue,
    /** Specifies the dark slate gray color. */
    DarkSlateGray,
    /** Specifies the dark turquoise color. */
    DarkTurquoise,
    /** Specifies the dark violet color. */
    DarkViolet,
    /** Specifies the deep pink color. */
    DeepPink,
    /** Specifies the deep sky blue color. */
    DeepSkyBlue,
    /** Specifies the dim gray color. */
    DimGray,
    /** Specifies the dodger blue color. */
    DodgerBlue,
    /** Specifies the firebrick color. */
    Firebrick,
    /** Specifies the floral white color. */
    FloralWhite,
    /** Specifies the forest green color. */
    ForestGreen,
    /** Specifies the fuchsia color. */
    Fuchsia,
    /** Specifies the gainsboro color. */
    Gainsboro,
    /** Specifies the ghost white color. */
    GhostWhite,
    /** Specifies the gold color. */
    Gold,
    /** Specifies the goldenrod color. */
    Goldenrod,
    /** Specifies the gray color. */
    Gray,
    /** Specifies the green color. */
    Green,
    /** Specifies the green yellow color. */
    GreenYellow,
    /** Specifies the honeydew color. */
    Honeydew,
    /** Specifies the hot pink color. */
    HotPink,
    /** Specifies the indian red color. */
    IndianRed,
    /** Specifies the indigo color. */
    Indigo,
    /** Specifies the ivory color. */
    Ivory,
    /** Specifies the khaki color. */
    Khaki,
    /** Specifies the lavender color. */
    Lavender,
    /** Specifies the lavender blush color. */
    LavenderBlush,
    /** Specifies the lawn green color. */
    LawnGreen,
    /** Specifies the lemon chiffon color. */
    LemonChiffon,
    /** Specifies the light blue color. */
    LightBlue,
    /** Specifies the light coral color. */
    LightCoral,
    /** Specifies the light cyan color. */
    LightCyan,
    /** Specifies the light goldenrod yellow color. */
    LightGoldenrodYellow,
    /** Specifies the light green color. */
    LightGreen,
    /** Specifies the light gray color. */
    LightGray,
    /** Specifies the light pink color. */
    LightPink,
    /** Specifies the light salmon color. */
    LightSalmon,
    /** Specifies the light sea green color. */
    LightSeaGreen,
    /** Specifies the light sky blue color. */
    LightSkyBlue,
    /** Specifies the light slate gray color. */
    LightSlateGray,
    /** Specifies the light steel blue color. */
    LightSteelBlue,
    /** Specifies the light yellow color. */
    LightYellow,
    /** Specifies the lime color. */
    Lime,
    /** Specifies the lime green color. */
    LimeGreen,
    /** Specifies the linen color. */
    Linen,
    /** Specifies the magenta color. */
    Magenta,
    /** Specifies the maroon color. */
    Maroon,
    /** Specifies the medium aquamarine color. */
    MediumAquamarine,
    /** Specifies the medium blue color. */
    MediumBlue,
    /** Specifies the medium orchid color. */
    MediumOrchid,
    /** Specifies the medium purple color. */
    MediumPurple,
    /** Specifies the medium sea green color. */
    MediumSeaGreen,
    /** Specifies the medium slate blue color. */
    MediumSlateBlue,
    /** Specifies the medium spring green color. */
    MediumSpringGreen,
    /** Specifies the medium turquoise color. */
    MediumTurquoise,
    /** Specifies the medium violet red color. */
    MediumVioletRed,
    /** Specifies the midnight blue color. */
    MidnightBlue,
    /** Specifies the mint cream color. */
    MintCream,
    /** Specifies the misty rose color. */
    MistyRose,
    /** Specifies the moccasin color. */
    Moccasin,
    /** Specifies the navajo white color. */
    NavajoWhite,
    /** Specifies the navy color. */
    Navy,
    /** Specifies the old lace color. */
    OldLace,
    /** Specifies the olive color. */
    Olive,
    /** Specifies the olive drab color. */
    OliveDrab,
    /** Specifies the orange color. */
    Orange,
    /** Specifies the orange red color. */
    OrangeRed,
    /** Specifies the orchid color. */
    Orchid,
    /** Specifies the pale goldenrod color. */
    PaleGoldenrod,
    /** Specifies the pale green color. */
    PaleGreen,
    /** Specifies the pale turquoise color. */
    PaleTurquoise,
    /** Specifies the pale violet red color. */
    PaleVioletRed,
    /** Specifies the papaya whip color. */
    PapayaWhip,
    /** Specifies the peach puff color. */
    PeachPuff,
    /** Specifies the peru color. */
    Peru,
    /** Specifies the pink color. */
    Pink,
    /** Specifies the plum color. */
    Plum,
    /** Specifies the powder blue color. */
    PowderBlue,
    /** Specifies the purple color. */
    Purple,
    /** Specifies the red color. */
    Red,
    /** Specifies the rosy brown color. */
    RosyBrown,
    /** Specifies the royal blue color. */
    RoyalBlue,
    /** Specifies the saddle brown color. */
    SaddleBrown,
    /** Specifies the salmon color. */
    Salmon,
    /** Specifies the sandy brown color. */
    SandyBrown,
    /** Specifies the sea green color. */
    SeaGreen,
    /** Specifies the sea shell color. */
    SeaShell,
    /** Specifies the sienna color. */
    Sienna,
    /** Specifies the silver color. */
    Silver,
    /** Specifies the sky blue color. */
    SkyBlue,
    /** Specifies the slate blue color. */
    SlateBlue,
    /** Specifies the slate gray color. */
    SlateGray,
    /** Specifies the snow color. */
    Snow,
    /** Specifies the spring green color. */
    SpringGreen,
    /** Specifies the steel blue color. */
    SteelBlue,
    /** Specifies the tan color. */
    Tan,
    /** Specifies the teal color. */
    Teal,
    /** Specifies the thistle color. */
    Thistle,
    /** Specifies the tomato color. */
    Tomato,
    /** Specifies the turquoise color. */
    Turquoise,
    /** Specifies the violet color. */
    Violet,
    /** Specifies the wheat color. */
    Wheat,
    /** Specifies the white color. */
    White,
    /** Specifies the white smoke color. */
    WhiteSmoke,
    /** Specifies the yellow color. */
    Yellow,
    /** Specifies the yellow green color. */
    YellowGreen,
}

/**
 * Hex RRGGBB (no `#`) for each {@link Color}, empty for Transparent.
 *
 * @private
 */
const COLOR_HEX: { [key: number]: string } = {};
COLOR_HEX[Color.Transparent] = '';
COLOR_HEX[Color.AliceBlue] = 'F0F8FF';
COLOR_HEX[Color.AntiqueWhite] = 'FAEBD7';
COLOR_HEX[Color.Aqua] = '00FFFF';
COLOR_HEX[Color.Aquamarine] = '7FFFD4';
COLOR_HEX[Color.Azure] = 'F0FFFF';
COLOR_HEX[Color.Beige] = 'F5F5DC';
COLOR_HEX[Color.Bisque] = 'FFE4C4';
COLOR_HEX[Color.Black] = '000000';
COLOR_HEX[Color.BlanchedAlmond] = 'FFEBCD';
COLOR_HEX[Color.Blue] = '0000FF';
COLOR_HEX[Color.BlueViolet] = '8A2BE2';
COLOR_HEX[Color.Brown] = 'A52A2A';
COLOR_HEX[Color.BurlyWood] = 'DEB887';
COLOR_HEX[Color.CadetBlue] = '5F9EA0';
COLOR_HEX[Color.Chartreuse] = '7FFF00';
COLOR_HEX[Color.Chocolate] = 'D2691E';
COLOR_HEX[Color.Coral] = 'FF7F50';
COLOR_HEX[Color.CornflowerBlue] = '6495ED';
COLOR_HEX[Color.Cornsilk] = 'FFF8DC';
COLOR_HEX[Color.Crimson] = 'DC143C';
COLOR_HEX[Color.Cyan] = '00FFFF';
COLOR_HEX[Color.DarkBlue] = '00008B';
COLOR_HEX[Color.DarkCyan] = '008B8B';
COLOR_HEX[Color.DarkGoldenrod] = 'B8860B';
COLOR_HEX[Color.DarkGray] = 'A9A9A9';
COLOR_HEX[Color.DarkGreen] = '006400';
COLOR_HEX[Color.DarkKhaki] = 'BDB76B';
COLOR_HEX[Color.DarkMagenta] = '8B008B';
COLOR_HEX[Color.DarkOliveGreen] = '556B2F';
COLOR_HEX[Color.DarkOrange] = 'FF8C00';
COLOR_HEX[Color.DarkOrchid] = '9932CC';
COLOR_HEX[Color.DarkRed] = '8B0000';
COLOR_HEX[Color.DarkSalmon] = 'E9967A';
COLOR_HEX[Color.DarkSeaGreen] = '8FBC8F';
COLOR_HEX[Color.DarkSlateBlue] = '483D8B';
COLOR_HEX[Color.DarkSlateGray] = '2F4F4F';
COLOR_HEX[Color.DarkTurquoise] = '00CED1';
COLOR_HEX[Color.DarkViolet] = '9400D3';
COLOR_HEX[Color.DeepPink] = 'FF1493';
COLOR_HEX[Color.DeepSkyBlue] = '00BFFF';
COLOR_HEX[Color.DimGray] = '696969';
COLOR_HEX[Color.DodgerBlue] = '1E90FF';
COLOR_HEX[Color.Firebrick] = 'B22222';
COLOR_HEX[Color.FloralWhite] = 'FFFAF0';
COLOR_HEX[Color.ForestGreen] = '228B22';
COLOR_HEX[Color.Fuchsia] = 'FF00FF';
COLOR_HEX[Color.Gainsboro] = 'DCDCDC';
COLOR_HEX[Color.GhostWhite] = 'F8F8FF';
COLOR_HEX[Color.Gold] = 'FFD700';
COLOR_HEX[Color.Goldenrod] = 'DAA520';
COLOR_HEX[Color.Gray] = '808080';
COLOR_HEX[Color.Green] = '008000';
COLOR_HEX[Color.GreenYellow] = 'ADFF2F';
COLOR_HEX[Color.Honeydew] = 'F0FFF0';
COLOR_HEX[Color.HotPink] = 'FF69B4';
COLOR_HEX[Color.IndianRed] = 'CD5C5C';
COLOR_HEX[Color.Indigo] = '4B0082';
COLOR_HEX[Color.Ivory] = 'FFFFF0';
COLOR_HEX[Color.Khaki] = 'F0E68C';
COLOR_HEX[Color.Lavender] = 'E6E6FA';
COLOR_HEX[Color.LavenderBlush] = 'FFF0F5';
COLOR_HEX[Color.LawnGreen] = '7CFC00';
COLOR_HEX[Color.LemonChiffon] = 'FFFACD';
COLOR_HEX[Color.LightBlue] = 'ADD8E6';
COLOR_HEX[Color.LightCoral] = 'F08080';
COLOR_HEX[Color.LightCyan] = 'E0FFFF';
COLOR_HEX[Color.LightGoldenrodYellow] = 'FAFAD2';
COLOR_HEX[Color.LightGreen] = '90EE90';
COLOR_HEX[Color.LightGray] = 'D3D3D3';
COLOR_HEX[Color.LightPink] = 'FFB6C1';
COLOR_HEX[Color.LightSalmon] = 'FFA07A';
COLOR_HEX[Color.LightSeaGreen] = '20B2AA';
COLOR_HEX[Color.LightSkyBlue] = '87CEFA';
COLOR_HEX[Color.LightSlateGray] = '778899';
COLOR_HEX[Color.LightSteelBlue] = 'B0C4DE';
COLOR_HEX[Color.LightYellow] = 'FFFFE0';
COLOR_HEX[Color.Lime] = '00FF00';
COLOR_HEX[Color.LimeGreen] = '32CD32';
COLOR_HEX[Color.Linen] = 'FAF0E6';
COLOR_HEX[Color.Magenta] = 'FF00FF';
COLOR_HEX[Color.Maroon] = '800000';
COLOR_HEX[Color.MediumAquamarine] = '66CDAA';
COLOR_HEX[Color.MediumBlue] = '0000CD';
COLOR_HEX[Color.MediumOrchid] = 'BA55D3';
COLOR_HEX[Color.MediumPurple] = '9370DB';
COLOR_HEX[Color.MediumSeaGreen] = '3CB371';
COLOR_HEX[Color.MediumSlateBlue] = '7B68EE';
COLOR_HEX[Color.MediumSpringGreen] = '00FA9A';
COLOR_HEX[Color.MediumTurquoise] = '48D1CC';
COLOR_HEX[Color.MediumVioletRed] = 'C71585';
COLOR_HEX[Color.MidnightBlue] = '191970';
COLOR_HEX[Color.MintCream] = 'F5FFFA';
COLOR_HEX[Color.MistyRose] = 'FFE4E1';
COLOR_HEX[Color.Moccasin] = 'FFE4B5';
COLOR_HEX[Color.NavajoWhite] = 'FFDEAD';
COLOR_HEX[Color.Navy] = '000080';
COLOR_HEX[Color.OldLace] = 'FDF5E6';
COLOR_HEX[Color.Olive] = '808000';
COLOR_HEX[Color.OliveDrab] = '6B8E23';
COLOR_HEX[Color.Orange] = 'FFA500';
COLOR_HEX[Color.OrangeRed] = 'FF4500';
COLOR_HEX[Color.Orchid] = 'DA70D6';
COLOR_HEX[Color.PaleGoldenrod] = 'EEE8AA';
COLOR_HEX[Color.PaleGreen] = '98FB98';
COLOR_HEX[Color.PaleTurquoise] = 'AFEEEE';
COLOR_HEX[Color.PaleVioletRed] = 'DB7093';
COLOR_HEX[Color.PapayaWhip] = 'FFEFD5';
COLOR_HEX[Color.PeachPuff] = 'FFDAB9';
COLOR_HEX[Color.Peru] = 'CD853F';
COLOR_HEX[Color.Pink] = 'FFC0CB';
COLOR_HEX[Color.Plum] = 'DDA0DD';
COLOR_HEX[Color.PowderBlue] = 'B0E0E6';
COLOR_HEX[Color.Purple] = '800080';
COLOR_HEX[Color.Red] = 'FF0000';
COLOR_HEX[Color.RosyBrown] = 'BC8F8F';
COLOR_HEX[Color.RoyalBlue] = '4169E1';
COLOR_HEX[Color.SaddleBrown] = '8B4513';
COLOR_HEX[Color.Salmon] = 'FA8072';
COLOR_HEX[Color.SandyBrown] = 'F4A460';
COLOR_HEX[Color.SeaGreen] = '2E8B57';
COLOR_HEX[Color.SeaShell] = 'FFF5EE';
COLOR_HEX[Color.Sienna] = 'A0522D';
COLOR_HEX[Color.Silver] = 'C0C0C0';
COLOR_HEX[Color.SkyBlue] = '87CEEB';
COLOR_HEX[Color.SlateBlue] = '6A5ACD';
COLOR_HEX[Color.SlateGray] = '708090';
COLOR_HEX[Color.Snow] = 'FFFAFA';
COLOR_HEX[Color.SpringGreen] = '00FF7F';
COLOR_HEX[Color.SteelBlue] = '4682B4';
COLOR_HEX[Color.Tan] = 'D2B48C';
COLOR_HEX[Color.Teal] = '008080';
COLOR_HEX[Color.Thistle] = 'D8BFD8';
COLOR_HEX[Color.Tomato] = 'FF6347';
COLOR_HEX[Color.Turquoise] = '40E0D0';
COLOR_HEX[Color.Violet] = 'EE82EE';
COLOR_HEX[Color.Wheat] = 'F5DEB3';
COLOR_HEX[Color.White] = 'FFFFFF';
COLOR_HEX[Color.WhiteSmoke] = 'F5F5F5';
COLOR_HEX[Color.Yellow] = 'FFFF00';
COLOR_HEX[Color.YellowGreen] = '9ACD32';

const HEX_TO_COLOR: { [hex: string]: Color } = {};
(function buildHexIndex(): void {
    for (const [text, hex] of objectEntries(COLOR_HEX as unknown as { [key: string]: string })) {
        const n: number = Number(text);
        if (hex !== undefined && hex.length > 0) {
            HEX_TO_COLOR[hex.toUpperCase()] = n as Color;
        }
    }
})();

/**
 * Normalize a DOCX color token to uppercase RRGGBB without `#`.
 *
 * @param {string} raw - The raw.
 * @returns {string | undefined} The result.
 * @private
 */
export function normalizeColorHex(raw: string): string | undefined {
    let s: string = raw.trim();
    if (s.length === 0) {
        return undefined;
    }
    if (s.charAt(0) === '#') {
        s = s.substring(1);
    }
    if (/^[0-9A-Fa-f]{6}$/.test(s)) {
        return s.toUpperCase();
    }
    if (/^[0-9A-Fa-f]{3}$/.test(s)) {
        const a: string = s.charAt(0);
        const b: string = s.charAt(1);
        const c: string = s.charAt(2);
        return (a + a + b + b + c + c).toUpperCase();
    }
    return undefined;
}

/**
 * Map a DOCX color wire value (`auto`, hex, or CSS name) to {@link Color}.
 * Unknown values return `undefined` (caller keeps raw wire for round-trip).
 *
 * @param {string | undefined} raw - The raw.
 * @returns {Color | undefined} The result.
 * @private
 */
export function colorFromWire(raw: string | undefined): Color | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const t: string = raw.trim();
    if (t.length === 0) {
        return undefined;
    }
    const lower: string = t.toLowerCase();
    if (lower === 'auto' || lower === 'windowtext') {
        return Color.Black;
    }
    if (lower === 'transparent' || lower === 'none') {
        return Color.Transparent;
    }
    const hex: string = normalizeColorHex(t);
    if (hex !== undefined) {
        const byHex: Color = ownGet(HEX_TO_COLOR, hex);
        if (byHex !== undefined) {
            return byHex;
        }
        return undefined;
    }
    // CSS / named color (case-insensitive member name).
    const compact: string = t.replace(/[\s_-]/g, '').toLowerCase();
    for (const [text, value] of objectEntries(Color as unknown as { [key: string]: Color })) {
        if (isNaN(Number(text)) && text.toLowerCase() === compact) {
            return value;
        }
    }
    return undefined;
}

/**
 * Serialize {@link Color} for `w:color` / border / shd fill (hex or auto-like).
 * Transparent → empty string (caller may omit or use special handling).
 *
 * @param {Color} color - The color.
 * @returns {string} The result.
 * @private
 */
export function colorToHexWire(color: Color): string {
    if (color === Color.Transparent) {
        return '';
    }
    const hex: string = COLOR_HEX[color as number];
    if (hex !== undefined && hex.length > 0) {
        return hex;
    }
    return '000000';
}

/**
 * ST_HighlightColor name for a {@link Color}, when representable.
 *
 * @param {Color} color - The color.
 * @returns {string | undefined} The result.
 * @private
 */
export function colorToHighlightWire(color: Color): string | undefined {
    switch (color) {
    case Color.Black:
        return 'black';
    case Color.Blue:
        return 'blue';
    case Color.Cyan:
    case Color.Aqua:
        return 'cyan';
    case Color.DarkBlue:
    case Color.Navy:
        return 'darkBlue';
    case Color.DarkCyan:
    case Color.Teal:
        return 'darkCyan';
    case Color.DarkGray:
    case Color.Gray:
    case Color.DimGray:
        return 'darkGray';
    case Color.DarkGreen:
    case Color.Green:
    case Color.ForestGreen:
        return 'darkGreen';
    case Color.DarkMagenta:
    case Color.Purple:
        return 'darkMagenta';
    case Color.DarkRed:
    case Color.Maroon:
        return 'darkRed';
    case Color.Olive:
    case Color.DarkOliveGreen:
    case Color.DarkGoldenrod:
        return 'darkYellow';
    case Color.Lime:
    case Color.LimeGreen:
    case Color.LawnGreen:
        return 'green';
    case Color.LightGray:
    case Color.Silver:
        return 'lightGray';
    case Color.Magenta:
    case Color.Fuchsia:
        return 'magenta';
    case Color.Transparent:
        return 'none';
    case Color.Red:
        return 'red';
    case Color.White:
    case Color.WhiteSmoke:
    case Color.Snow:
        return 'white';
    case Color.Yellow:
    case Color.Gold:
    case Color.LightYellow:
        return 'yellow';
    default:
        return undefined;
    }
}

/**
 * Map ST_HighlightColor wire name to {@link Color}.
 *
 * @param {string | undefined} raw - The raw.
 * @returns {Color | undefined} The result.
 * @private
 */
export function highlightWireToColor(raw: string | undefined): Color | undefined {
    if (raw === undefined) {
        return undefined;
    }
    switch (raw) {
    case 'black':
        return Color.Black;
    case 'blue':
        return Color.Blue;
    case 'cyan':
        return Color.Cyan;
    case 'darkBlue':
        return Color.DarkBlue;
    case 'darkCyan':
        return Color.DarkCyan;
    case 'darkGray':
        return Color.DarkGray;
    case 'darkGreen':
        return Color.DarkGreen;
    case 'darkMagenta':
        return Color.DarkMagenta;
    case 'darkRed':
        return Color.DarkRed;
    case 'darkYellow':
        return Color.Olive;
    case 'green':
        return Color.Lime;
    case 'lightGray':
        return Color.LightGray;
    case 'magenta':
        return Color.Magenta;
    case 'none':
        return Color.Transparent;
    case 'red':
        return Color.Red;
    case 'white':
        return Color.White;
    case 'yellow':
        return Color.Yellow;
    default:
        return undefined;
    }
}
