export class _PdfJpxImage{
    _parseImageProperties(stream:any): any { // eslint-disable-line
        let newByte: number = stream.getByte();
        while (newByte >= 0) {
            const oldByte: number = newByte;
            newByte = stream.getByte();
            const code: number = (oldByte << 8) | newByte;
            if (code === 0xff51) {
                stream.skip(4);
                const Xsiz: number = stream.getInt32() >>> 0; // Byte 4
                const Ysiz: number = stream.getInt32() >>> 0; // Byte 8
                const XOsiz: number = stream.getInt32() >>> 0; // Byte 12
                const YOsiz: number = stream.getInt32() >>> 0; // Byte 16
                stream.skip(16);
                const Csiz: number = stream.getUnsignedInteger16(); // Byte 36
                return {
                    width: Xsiz - XOsiz,
                    height: Ysiz - YOsiz,
                    bitsPerComponent: 8,
                    componentsCount: Csiz
                };
            }
        }
        throw new Error('No size marker found in JPX stream');
    }
}
