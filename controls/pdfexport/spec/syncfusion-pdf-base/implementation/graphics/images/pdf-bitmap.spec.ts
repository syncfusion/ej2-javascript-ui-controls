/**
 * spec document for PdfBitmap.ts class
 */

import { PdfBitmap } from "../../../../../src/implementation/graphics/images/pdf-bitmap";
import { ByteArray } from "../../../../../src/implementation/graphics/images/byte-array";
import { ImageDecoder, ImageFormat } from "../../../../../src/implementation/graphics/images/image-decoder";

describe('Image decoder and bitmap coverage test',()=>{
    it('PNG image', () => {
        let pngImage: string = 'iVBORw0KGgoAAAANSUhEUgAAAOQAAAB4BAMAAAAQ3UOGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAMFBMVEX////4/Pzv9/fj8fHX6+ul09OAwMFUq6xAoaJHpaZisrORycnH4+Ryubo/oaK43NxAd1IWAAAAAWJLR0QAiAUdSAAAAAd0SU1FB+UFHQ8yJtTvthIAAASESURBVGje7dpPiBtVGADwl8nsdrfJktiDaBF2RMHtn0NKEXLr+udQpdCpSDcHlR50jXpopBRzWdzW3ebNxrh/DpIVwUWEpkolXuqClV17kkU0qGhu3mTpKVSlsXgw8yaTed+bTKj2+94p32HJN/OYX76ZN2/emyxjwxjGMIbxf2Pf0aePHtEJPv4qd+OD67rAQ79yZ2529vUru3zprA7Q2Nmd61Znvljk5Wl6ctM5JWUz3NmmrjGvlHXs86UWLdk+r24xazczlOIzy+FtsVqZUEyU0322ms1zZKJxOdN3+0i1RUVO2RE7DlKdWvOTyF25MzTkTvSuZIVETNYH7DzQoCBPDNoZv0QgGtMDd2dtijIHhrl878f4r9FOaydHCwQHNa2Buz9CB40vuVMf1CBr3d2B7j7anclOKT2gwWgDWZwQE6zCoCZryGRekKLM+F+zb7zQp947uGKCe1HvXNSm+6HyRKjNeAaVzHbJdzuPMO9TqaW2STYwxVixS5YYq3U/Viy1FerFTHI/bKPKg4phfIVJjvfItYB0LyyI/Zjk9z1mMRaQ6gNrIo1I1noMTxd5VJlJG5EMKuN2jkeVaRTwxKD3dAagMR5Z5sd45KikLCSkRHku/4lHjkvKklwynwbtHsIjH5AQx5LJVdBuEo/Mysr2ppTA+esIEdmAX0Bul8Ijj8vIxQfl7ILcLklELu/lkWeWiLw0ImdKn6UhSzFArmgguVWUs0UdpJ0HqQ6ykAPpGRIS3Il89VuYkpBTwFiDKcXKkrExYCy4aSnTG/cyFOQeQC7uFR219z1sCjIByIqbloMLPE9BmoB0Uu7frd7dSfPSB5AcfgN3Ok0QYLzhj0ASPsCwAo43TyrkSrdVDJOEN/+NKiQXuq1MTBLemLcU0u8/CUwS3iXPKaQ/sr+MScI+eksRu4OBsYJJwi77h0puiDZ7bFTyuCz8o5LenCtnoZJginVIJcXMwESeeSV3A8AZV0lHnNcL94oo0ZRqyqqkmObV6sikxKxuhkjbXZ0hiyzVO/zNyZDovvXK47+Q9c7s6U+vTufC5EZnsCigk16fef/5k1fCIrdY00mjk3EeHWtsf/gtEEKA0cCpSknJMmlmQCkJ+em+fe0gq7NNohVYgHx27Zfr7G8/+5nd9odZ7DDlk8k/ZDMiL/3InuV8iURk7ADoM+dih79+a27rYTbTSd4kIo0mMH+z3I0n3Y2/x4lIBtfPvLT1w+ma14EOUpHssf735UK8apGZt/uJFatNM5f14rWw6LTu5+/ZdGTspRB5KlWlWkt3zRmlxi9SNU41FPixA8bX1qRIC6QkezS/64tvH+mMr26s0JKMHbt2eX19/eor3zD/RcI8NSnHhH7SEOQ7Oklv8aCXbOonc3pJ47sb3hL7ojayMwfbntLaY92l7vyYlqHAD3cNuCxet23oIt1zWhZjQUMX6c4zHUHaukhxf4jfTTI6qxRBNY8Nx5hPUiyC+kfvh82CNtL/lYZgcRkZWa790WWI2XpFY5GMJYv9/nWDuM4TT+kFhzGMYRDEvwRj28X4gdFgAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAxLTAzVDE3OjEyOjQwKzAwOjAwRNPQsQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0wNC0wM1QwNzowMzo0MCswMDowMJIDGgIAAAAASUVORK5CYII=';
        let isException: boolean = false;
        try {
            let image : PdfBitmap = new PdfBitmap(pngImage);
        }
        catch(e) {
            isException = true;
            expect((e as TypeError).message).toEqual('Only the JPEG format is supported');
            expect((e as Error).name).toEqual('TypeError');
        }
        expect(isException).toBeTruthy();
    });
    it('Bitmap constructor initializing', () => {
        let isException: boolean = false;
        try {
            let t1: PdfBitmap = new PdfBitmap('test');
            t1.save();
        }
        catch (e) {
            isException = true;
            expect((e as TypeError).message).toEqual('Only the JPEG format is supported');
            expect((e as Error).name).toEqual('TypeError');
        }
        expect(isException).toBeTruthy();
    });
    it('Image decoder constructor initializing', () => {
        let value: string = 'test';
        let byteArray: ByteArray = new ByteArray(value.length);
        let isException: boolean = false;
        try {
            let t1: ImageDecoder = new ImageDecoder(byteArray);
        }
        catch (e) {
            isException = true;
            expect((e as TypeError).message).toEqual('Only the JPEG format is supported');
            expect((e as Error).name).toEqual('TypeError');
        }
        expect(isException).toBeTruthy();
    });
});