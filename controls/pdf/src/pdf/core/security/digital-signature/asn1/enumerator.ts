
/**
 * Represents the internal tag class type used to identify how a PDF or ASN.1 tag
 * is categorized within the encoding structure.
 *
 * @private
 */
export enum _TagClassType {
    universal = 0,
    application = 1,
    context = 2,
    abstractSyntaxPrivate = 3,
    nullValue = 5
}
/**
 * Represents the internal construction type for encoded elements, indicating
 * whether the value is primitive or constructed.
 *
 * @private
 */
export enum _ConstructionType {
    primitive = 0,
    constructed = 1,
}
/**
 * Represents the internal real-number special value types used for identifying
 * infinities, NaN values, and signed zero within encoded real numbers.
 *
 * @private
 */
export enum _RealValueType {
    plusInfinity = 0b01000000,
    minusInfinity = 0b01000001,
    notANumber = 0b01000010,
    minusZero = 0b01000011,
}
/**
 * Represents the internal encoding base used for representing real numbers
 * in binary, octal, or hexadecimal form.
 *
 * @private
 */
export enum _RealEncodingBase {
    base2 = 0b00000000,
    base8 = 0b00010000,
    base16 = 0b00100000,
}
/**
 * Represents the internal scaling factor used to modify the exponent of
 * encoded real numbers during interpretation.
 *
 * @private
 */
export enum _RealEncodingScale {
    scale0 = 0b00000000,
    scale1 = 0b00000100,
    scale2 = 0b00001000,
    scale3 = 0b00001100,
}
/**
 * Represents the internal universal tag types used for defining the semantics of
 * encoded values within PDF and ASN.1 universal type systems.
 *
 * @private
 */
export enum _UniversalType {
    endOfContent = 0x00,
    abstractSyntaxBoolean = 0x01,
    integer = 0x02,
    bitString = 0x03,
    octetString = 0x04,
    nullValue = 0x05,
    objectIdentifier = 0x06,
    objectDescriptor = 0x07,
    external = 0x08,
    realNumber = 0x09,
    enumerated = 0x0A,
    embeddedDataValue = 0x0B,
    utf8String = 0x0C,
    relativeObjectIdentifier = 0x0D,
    reservedBit14 = 0x0E,
    time = 0x0E,
    reservedBit15 = 0x0F,
    sequence = 0x10,
    abstractSyntaxSet = 0x11,
    numericString = 0x12,
    printableString = 0x13,
    teleprinterTextExchange = 0x14,
    videoTextInformationSystem = 0x15,
    internationalAlphabetString = 0x16,
    universalTime = 0x17,
    generalizedTime = 0x18,
    graphicString = 0x19,
    visibleString = 0x1A,
    generalString = 0x1B,
    universalString = 0x1C,
    characterString = 0x1D,
    bmpString = 0x1E,
    date = 31,
    timeOfDay = 32,
    dateTime = 33,
    duration = 34,
    objectIdResourceIdentifier = 35,
    relativeResourceIdentifier = 36,
}
