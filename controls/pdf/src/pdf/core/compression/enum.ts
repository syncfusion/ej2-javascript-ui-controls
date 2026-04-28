/**
 * Represents the internal state machine stages used during the inflate decompression process.
 *
 * @private
 */
export enum _InflaterState {
    readingHeader,
    readingBFinal,
    readingBType,
    readingNlCodes,
    readingNdCodes,
    readingCodes,
    readingClCodes,
    readingTcBefore,
    readingTcAfter,
    decodeTop,
    iLength,
    fLength,
    dCode,
    unCompressedAligning,
    unCompressedByte1,
    unCompressedByte2,
    unCompressedByte3,
    unCompressedByte4,
    decodeUnCompressedBytes,
    srFooter,
    rFooter,
    vFooter,
    done
}
/**
 * Represents the types of deflate compression blocks encountered during decompression.
 *
 * @private
 */
export enum _BlockType {
    unCompressedType,
    staticType,
    dynamicType
}
