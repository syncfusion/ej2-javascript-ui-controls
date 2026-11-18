/**
 * Legacy units barrel (package-private). Public APIs use plain point numbers.
 * or `./length`. Multi-unit constructors are package-private.
 *
 * @packageDocumentation
 */
export {
    Emus,
    HalfPoints,
    pointToEmus,
    pointToHalfPoints,
    pointToTwips,
    twipsToPoint,
    emuToPoint,
    halfPointsToPoint,
    addPoints,
    scalePoint,
    lengthToEmus,
    lengthToHalfPoints,
    halfPoints,
    emus,
    LengthUnits, // package-private aliases
    Length,
    Pt,
    Inches,
    Cm,
    Mm,
    Px,
    Twips,
    Emu,
    add,
    scale,
    inchesToPoint,
    cmToPoint,
    mmToPoint,
    pxToPoint
} from './length';
