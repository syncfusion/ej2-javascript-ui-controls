export enum _TagClassType {
    universal = 0,
    application = 1,
    context = 2,
    abstractSyntaxPrivate = 3,
    nullValue = 5
}
export enum _ConstructionType {
    primitive = 0,
    constructed = 1,
}
export enum _RealValueType {
    plusInfinity = 0b01000000,
    minusInfinity = 0b01000001,
    notANumber = 0b01000010,
    minusZero = 0b01000011,
}
export enum _RealEncodingBase {
    base2 = 0b00000000,
    base8 = 0b00010000,
    base16 = 0b00100000,
}
export enum _RealEncodingScale {
    scale0 = 0b00000000,
    scale1 = 0b00000100,
    scale2 = 0b00001000,
    scale3 = 0b00001100,
}
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
