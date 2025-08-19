/* eslint-disable */
export class Utils {
    private static reverseBits: number[] = [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
    public static huffCodeLengthOrders: number[] = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
    public static bitReverse(value: number): number {
        return (Utils.reverseBits[value & 15] << 12
            | Utils.reverseBits[(value >> 4) & 15] << 8
            | Utils.reverseBits[(value >> 8) & 15] << 4
            | Utils.reverseBits[value >> 12]);
    }
    public static bitConverterToInt32(value: Uint8Array, index: number): number {
        return value[index] | value[index+1] << 8 | value[index+2] << 16 | value[index+3] << 24;
    }
    public static bitConverterToInt16(value: Uint8Array, index: number): number {
        return value[index] | value[index+1] << 8;
    }
    public static bitConverterToUInt32(value: number): number {
        let uint: Uint32Array = new Uint32Array(1);
        uint[0] = value;
        return uint[0];
    }
    public static bitConverterToUInt16(value: Uint8Array, index: number): number {
        let uint: Uint16Array = new Uint16Array(1);
        uint[0] = (value[index] | value[index+1] << 8);
        return uint[0];
    }
    public static bitConverterUintToInt32(value: number): number {
        let uint: Int32Array = new Int32Array(1);
        uint[0] = value;
        return uint[0];
    }
    public static bitConverterInt32ToUint(value: number): number {
        let uint: Uint32Array = new Uint32Array(1);
        uint[0] = value;
        return uint[0];
    }
    public static bitConverterInt32ToInt16(value: number): number {
        let uint: Int16Array = new Int16Array(1);
        uint[0] = value;
        return uint[0];
    }
    public static byteToString(value: Uint8Array): string {
        let str: string = '';
        for (let i: number = 0; i < value.length; i++) {
            str += String.fromCharCode(value[i]);
        }
        return str;
    }
    public static byteIntToString(value: Int8Array): string {
        let str: string = '';
        for (let i: number = 0; i < value.length; i++) {
            str += String.fromCharCode(value[i]);
        }
        return str;
    }
    public static arrayCopy(source: Uint8Array, sourceIndex: number, destination: Uint8Array, destinationIndex:number, dataToCopy: number): void {
        let temp: Uint8Array = new Uint8Array(source.buffer, sourceIndex);
        let data: Uint8Array = temp.subarray(0, dataToCopy);
        destination.set(data, destinationIndex);
    }
    public static mergeArray(arrayOne: Uint8Array, arrayTwo: Uint8Array): Uint8Array {
        let mergedArray: Uint8Array = new Uint8Array(arrayOne.length + arrayTwo.length);
mergedArray.set(arrayOne);
mergedArray.set(arrayTwo, arrayOne.length);
return mergedArray;
    }
    /**
     * @private
     */
    public static encodedString(input: string): Uint8Array {
        let keyStr: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        let chr1: number;
        let chr2: number;
        let chr3: number;
        let encode1: number;
        let encode2: number;
        let encode3: number;
        let encode4: number;
        let count: number = 0;
        let resultIndex: number = 0;

        /*let dataUrlPrefix: string = 'data:';*/

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

        let totalLength: number = input.length * 3 / 4;
        if (input.charAt(input.length - 1) === keyStr.charAt(64)) {
            totalLength--;
        }
        if (input.charAt(input.length - 2) === keyStr.charAt(64)) {
            totalLength--;
        }
        if (totalLength % 1 !== 0) {
            // totalLength is not an integer, the length does not match a valid
            // base64 content. That can happen if:
            // - the input is not a base64 content
            // - the input is *almost* a base64 content, with a extra chars at the
            // beginning or at the end
            // - the input uses a base64 variant (base64url for example)
            throw new Error('Invalid base64 input, bad content length.');
        }


        let output: Uint8Array = new Uint8Array(totalLength | 0);

        while (count < input.length) {

            encode1 = keyStr.indexOf(input.charAt(count++));
            encode2 = keyStr.indexOf(input.charAt(count++));
            encode3 = keyStr.indexOf(input.charAt(count++));
            encode4 = keyStr.indexOf(input.charAt(count++));

            chr1 = (encode1 << 2) | (encode2 >> 4);
            chr2 = ((encode2 & 15) << 4) | (encode3 >> 2);
            chr3 = ((encode3 & 3) << 6) | encode4;

            output[resultIndex++] = chr1;

            if (encode3 !== 64) {
                output[resultIndex++] = chr2;
            }
            if (encode4 !== 64) {
                output[resultIndex++] = chr3;
            }
        }
        return output;
    }
}
/* eslint-enable */