/* eslint-disable */
/// <summary>
/// Checksum calculator, based on Adler32 algorithm.
/// </summary>
export class ChecksumCalculator {
    /// <summary>
    /// Bits offset, used in adler checksum calculation.
    /// </summary>
    private static DEF_CHECKSUM_BIT_OFFSET: number = 16;
    /// <summary>
    /// Lagrest prime, less than 65535
    /// </summary>
    private static DEF_CHECKSUM_BASE: number = 65521;
    /// <summary>
    /// Count of iteration used in calculated of the adler checksumm.
    /// </summary>
    private static DEF_CHECKSUM_ITERATIONSCOUNT: number = 3800;

    /// <summary>
    /// Updates checksum by calculating checksum of the
    /// given buffer and adding it to current value.
    /// </summary>
    /// <param name="checksum">Current checksum.</param>
    /// <param name="buffer">Data byte array.</param>
    /// <param name="offset">Offset in the buffer.</param>
    /// <param name="length">Length of data to be used from the stream.</param>
    public static ChecksumUpdate(checksum: number, buffer: Uint8Array, offset: number, length: number): void {
        let checkSumUInt: number = checksum;
        let s1: number = checkSumUInt & 65535;
        let s2: number = checkSumUInt >> this.DEF_CHECKSUM_BIT_OFFSET;

        while (length > 0) {
            let steps: number = Math.min(length, this.DEF_CHECKSUM_ITERATIONSCOUNT);
            length -= steps;

            while (--steps >= 0) {
                s1 = s1 + (buffer[offset++] & 255);
                s2 = s2 + s1;
            }

            s1 %= this.DEF_CHECKSUM_BASE;
            s2 %= this.DEF_CHECKSUM_BASE;
        }

        checkSumUInt = (s2 << this.DEF_CHECKSUM_BIT_OFFSET) | s1;
        checksum = checkSumUInt;
    }
    /// <summary>
    /// Generates checksum by calculating checksum of the
    /// given buffer.
    /// </summary>
    /// <param name="buffer">Data byte array.</param>
    /// <param name="offset">Offset in the buffer.</param>
    /// <param name="length">Length of data to be used from the stream.</param>
    public static ChecksumGenerate(buffer: Uint8Array, offset: number, length: number): number {
        const result: number = 1;
        ChecksumCalculator.ChecksumUpdate(result, buffer, offset, length);
        return result;
    }
}
/* eslint-enable */