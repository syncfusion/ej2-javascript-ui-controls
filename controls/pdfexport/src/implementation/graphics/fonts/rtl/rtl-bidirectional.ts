/**
 * Bidi.ts class for EJ2-PDF
 */
import { Dictionary} from './../../../collections/dictionary';
/**
 * `Metrics` of the font.
 * @private
 */
export class Bidi {
         //#region Fields
        private  indexes : number[] = [];
        private  indexLevels : number[] = [];
        private  mirroringShapeCharacters : Dictionary<number, number>  = new Dictionary<number, number>();
        //#endregion
        //#region Constructor
        public constructor() {
            this.update();
        }
        //#endregion
        //#region implementation
        private doMirrorShaping( text : string) : string {
            let result : string[] = [];
            for (let i : number = 0; i < text.length; i++) {
                if (((this.indexLevels[i] & 1) === 1) && this.mirroringShapeCharacters.containsKey(text[i].charCodeAt(0))) {
                    result[i] = String.fromCharCode(this.mirroringShapeCharacters.getValue(text[i].charCodeAt(0)));
                } else {
                    result[i] = text[i].toString();
                }
            }
            let res : string = '';
            for (let j : number = 0; j < result.length; j++) {
                res = res + result[j];
            }
            return res;
        }
        public getLogicalToVisualString( inputText : string, isRtl : boolean) : string {
            let rtlCharacters : RtlCharacters  = new RtlCharacters();
            this.indexLevels = rtlCharacters.getVisualOrder(inputText, isRtl);
            this.setDefaultIndexLevel();
            this.doOrder(0, this.indexLevels.length - 1);
            let text : string = this.doMirrorShaping(inputText);
            //let text : string = inputText;
            let resultBuilder : string = '';
            for (let i : number = 0; i < this.indexes.length; i++) {
                let index : number = this.indexes[i];
                resultBuilder += text[index];
            }
            return resultBuilder.toString();
        }
        private setDefaultIndexLevel() : void {
            for (let i : number = 0; i < this.indexLevels.length; i++) {
                this.indexes[i] = i;
            }
        }
        private doOrder(sIndex : number,  eIndex : number): void {
            let max : number = this.indexLevels[sIndex];
            let min : number = max;
            let odd : number = max;
            let even : number = max;
            for (let i : number = sIndex + 1; i <= eIndex; ++i) {
                let data : number = this.indexLevels[i];
                if (data > max) {
                    max = data;
                } else if (data < min) {
                    min = data;
                }
                odd &= data;
                even |= data;
            }
            if ((even & 1) === 0) {
                return;
            }
            if ((odd & 1) === 1) {
                this.reArrange(sIndex, eIndex + 1);
                return;
            }
            min |= 1;
            while (max >= min) {
                let pstart : number = sIndex;
                /*tslint:disable:no-constant-condition */
                while (true) {
                    while (pstart <= eIndex) {
                        if (this.indexLevels[pstart] >= max) {
                            break;
                        }
                        pstart += 1;
                    }
                    if (pstart > eIndex) {
                        break;
                    }
                    let pend : number = pstart + 1;
                    while (pend <= eIndex) {
                        if (this.indexLevels[pend] < max) {
                            break;
                        }
                        pend += 1;
                    }
                    this.reArrange(pstart, pend);
                    pstart = pend + 1;
                }
                max -= 1;
            }
        }
        private reArrange(i : number , j : number) : void {
            let length : number = (i + j) / 2;
            --j;
            for (; i < length; ++i, --j) {
                let temp : number = this.indexes[i];
                this.indexes[i] = this.indexes[j];
                this.indexes[j] = temp;
            }
        }
        private update() : void {
            // Symmetric mirrored pairs: both (a, b) and (b, a) are mirrored. Each pair is packed
            // into two chars to keep the emitted code small.
            /* tslint:disable-next-line:max-line-length */
            const symmetricPairs : string = '\u0028\u0029\u003c\u003e\u005b\u005d\u007b\u007d\u00ab\u00bb\u2039\u203a\u2045\u2046\u207d\u207e\u208d\u208e\u2208\u220b\u2209\u220c\u220a\u220d\u2215\u29f5\u223c\u223d\u2243\u22cd\u2252\u2253\u2254\u2255\u2264\u2265\u2266\u2267\u2268\u2269\u226a\u226b\u226e\u226f\u2270\u2271\u2272\u2273\u2274\u2275\u2276\u2277\u2278\u2279\u227a\u227b\u227c\u227d\u227e\u227f\u2280\u2281\u2282\u2283\u2284\u2285\u2286\u2287\u2288\u2289\u228a\u228b\u228f\u2290\u2291\u2292\u2298\u29b8\u22a2\u22a3\u22a6\u2ade\u22a8\u2ae4\u22a9\u2ae3\u22ab\u2ae5\u22b0\u22b1\u22b2\u22b3\u22b4\u22b5\u22b6\u22b7\u22c9\u22ca\u22cb\u22cc\u22d0\u22d1\u22d6\u22d7\u22d8\u22d9\u22da\u22db\u22dc\u22dd\u22de\u22df\u22e0\u22e1\u22e2\u22e3\u22e4\u22e5\u22e6\u22e7\u22e8\u22e9\u22ea\u22eb\u22ec\u22ed\u22f0\u22f1\u22f2\u22fa\u22f3\u22fb\u22f4\u22fc\u22f6\u22fd\u22f7\u22fe\u2308\u2309\u230a\u230b\u2329\u232a\u2768\u2769\u276a\u276b\u276c\u276d\u276e\u276f\u2770\u2771\u2772\u2773\u2774\u2775\u27d5\u27d6\u27dd\u27de\u27e2\u27e3\u27e4\u27e5\u27e6\u27e7\u27e8\u27e9\u27ea\u27eb\u2983\u2984\u2985\u2986\u2987\u2988\u2989\u298a\u298b\u298c\u298d\u2990\u298e\u298f\u2991\u2992\u2993\u2994\u2995\u2996\u2997\u2998\u29c0\u29c1\u29c4\u29c5\u29cf\u29d0\u29d1\u29d2\u29d4\u29d5\u29d8\u29d9\u29da\u29db\u29f8\u29f9\u29fc\u29fd\u2a2b\u2a2c\u2a34\u2a35\u2a3c\u2a3d\u2a64\u2a65\u2a79\u2a7a\u2a7d\u2a7e\u2a7f\u2a80\u2a81\u2a82\u2a83\u2a84\u2a8b\u2a8c\u2a91\u2a92\u2a93\u2a94\u2a95\u2a96\u2a97\u2a98\u2a99\u2a9a\u2a9b\u2a9c\u2aa1\u2aa2\u2aa6\u2aa7\u2aa8\u2aa9\u2aaa\u2aab\u2aac\u2aad\u2aaf\u2ab0\u2ab3\u2ab4\u2abb\u2abc\u2abd\u2abe\u2abf\u2ac0\u2ac1\u2ac2\u2ac3\u2ac4\u2ac5\u2ac6\u2acd\u2ace\u2acf\u2ad0\u2ad1\u2ad2\u2ad3\u2ad4\u2ad5\u2ad6\u2aec\u2aed\u2af7\u2af8\u2af9\u2afa\u3008\u3009\u300a\u300b\u300c\u300d\u300e\u300f\u3010\u3011\u3014\u3015\u3016\u3017\u3018\u3019\u301a\u301b\uff08\uff09\uff1c\uff1e\uff3b\uff3d\uff5b\uff5d\uff5f\uff60\uff62\uff63';
            for (let i : number = 0; i < symmetricPairs.length; i += 2) {
                const a : number = symmetricPairs.charCodeAt(i);
                const b : number = symmetricPairs.charCodeAt(i + 1);
                this.mirroringShapeCharacters.setValue(a, b);
                this.mirroringShapeCharacters.setValue(b, a);
            }
            // Asymmetric mirrored pairs.
            /* tslint:disable-next-line:max-line-length */
            const asymmetricPairs : string = '\u2a2d\u2a2c\u2a2e\u2a2d';
            for (let i : number = 0; i < asymmetricPairs.length; i += 2) {
                this.mirroringShapeCharacters.setValue(asymmetricPairs.charCodeAt(i), asymmetricPairs.charCodeAt(i + 1));
            }
        }
        //#endregion
    }
    export class RtlCharacters {
        //#region fields
        /// <summary>
        /// Specifies the character types.
        /// </summary>
        private  types : number[] = [];
        /// <summary>
        /// Specifies the text order (RTL or LTR).
        /// </summary>
        private  textOrder : number = -1;
        /// <summary>
        /// Specifies the text length.
        /// </summary>
        private  length :  number;
        /// <summary>
        /// Specifies the resultant types.
        /// </summary>
        private  result : number[];
        /// <summary>
        /// Specifies the resultant levels.
        /// </summary>
        private  levels : number[];
        /// <summary>
        /// Specifies the RTL character types.
        /// </summary>
        /* tslint:disable-next-line:prefer-array-literal */
        public  rtlCharacterTypes : number[] = new Array(65536);
        //#endregion
        //#region constants
        /// <summary>
        /// Left-to-Right (Non-European or non-Arabic digits).
        /// </summary>
        private readonly L : number = 0;
        /// <summary>
        /// Left-to-Right Embedding
        /// </summary>
        private readonly LRE : number = 1;
        /// <summary>
        /// Left-to-Right Override
        /// </summary>
        private readonly LRO : number = 2;
        /// <summary>
        /// Right-to-Left (Hebrew alphabet, and related punctuation).
        /// </summary>
        private readonly R : number = 3;
        /// <summary>
        /// Right-to-Left Arabic 
        /// </summary>
        private  readonly AL : number = 4;
        /// <summary>
        /// Right-to-Left Embedding.
        /// </summary>
        private  readonly RLE : number = 5;
        /// <summary>
        /// Right-to-Left Override
        /// </summary>
        private readonly RLO : number = 6;
        /// <summary>
        /// Pop Directional Format
        /// </summary>
        private readonly PDF : number = 7;
        /// <summary>
        /// European Number (European digits, Eastern Arabic-Indic digits).
        /// </summary>
        private readonly EN : number = 8;
        /// <summary>
        /// European Number Separator (Plus sign, Minus sign).
        /// </summary>
        private readonly ES : number  = 9;
        /// <summary>
        /// European Number Terminator (Degree sign, currency symbols).
        /// </summary>
        private readonly ET : number  = 10;
        /// <summary>
        /// Arabic Number (Arabic-Indic digits, Arabic decimal and thousands separators).
        /// </summary>
        private readonly AN : number  = 11;
        /// <summary>
        /// Common Number Separator (Colon, Comma, Full Stop, No-Break Space.
        /// </summary>
        private readonly CS : number  = 12;
        /// <summary>
        /// Nonspacing Mark (Characters with the General_Category values).
        /// </summary>
        private readonly NSM : number  = 13;
        /// <summary>
        /// Boundary Neutral (Default ignorables, non-characters, and control characters, other than those explicitly given other types.)
        /// </summary>
        private readonly BN : number  = 14;
        /// <summary>
        /// Paragraph Separator (Paragraph separator, appropriate Newline Functions, higher-level protocol paragraph determination).
        /// </summary>
        private readonly B : number  = 15;
        /// <summary>
        /// 	Segment Separator (tab).
        /// </summary>
        private readonly S : number  = 16;
        /// <summary>
        /// Whitespace (Space, Figure space, Line separator, Form feed, General Punctuation spaces).
        /// </summary>
        private readonly WS : number  = 17;
        /// <summary>
        /// Other Neutrals (All other characters, including object replacement character).
        /// </summary>
        private readonly ON : number = 18;
        /// <summary>
        /// RTL character types.
        /// </summary>
        private readonly charTypes : number[] = RtlCharacters.decodeCharTypes(RtlCharacters.charTypesData);
        /**
         * Packed character type ranges. Each range is packed into three characters: start code,
         * end code and the character type.
         * @private
         */
        /* tslint:disable-next-line:max-line-length */
        private static readonly charTypesData : string = '\u0000\u0008\u000e\u0009\u0009\u0010\u000a\u000a\u000f\u000b\u000b\u0010\u000c\u000c\u0011\u000d\u000d\u000f\u000e\u001b\u000e\u001c\u001e\u000f\u001f\u001f\u0010\u0020\u0020\u0011\u0021\u0022\u0012\u0023\u0025\u000a\u0026\u002a\u0012\u002b\u002b\u000a\u002c\u002c\u000c\u002d\u002d\u000a\u002e\u002e\u000c\u002f\u002f\u000c\u0030\u0039\u0008\u003a\u003a\u000c\u003b\u0040\u0012\u0041\u005a\u0000\u005b\u0060\u0012\u0061\u007a\u0000\u007b\u007e\u0012\u007f\u0084\u000e\u0085\u0085\u000f\u0086\u009f\u000e\u00a0\u00a0\u000c\u00a1\u00a1\u0012\u00a2\u00a5\u000a\u00a6\u00a9\u0012\u00aa\u00aa\u0000\u00ab\u00af\u0012\u00b0\u00b1\u000a\u00b2\u00b3\u0008\u00b4\u00b4\u0012\u00b5\u00b5\u0000\u00b6\u00b8\u0012\u00b9\u00b9\u0008\u00ba\u00ba\u0000\u00bb\u00bf\u0012\u00c0\u00d6\u0000\u00d7\u00d7\u0012\u00d8\u00f6\u0000\u00f7\u00f7\u0012\u00f8\u02b8\u0000\u02b9\u02ba\u0012\u02bb\u02c1\u0000\u02c2\u02cf\u0012\u02d0\u02d1\u0000\u02d2\u02df\u0012\u02e0\u02e4\u0000\u02e5\u02ed\u0012\u02ee\u02ee\u0000\u02ef\u02ff\u0012\u0300\u0357\u000d\u0358\u035c\u0000\u035d\u036f\u000d\u0370\u0373\u0000\u0374\u0375\u0012\u0376\u037d\u0000\u037e\u037e\u0012\u037f\u0383\u0000\u0384\u0385\u0012\u0386\u0386\u0000\u0387\u0387\u0012\u0388\u03f5\u0000\u03f6\u03f6\u0012\u03f7\u0482\u0000\u0483\u0486\u000d\u0487\u0487\u0000\u0488\u0489\u000d\u048a\u0589\u0000\u058a\u058a\u0012\u058b\u0590\u0000\u0591\u05a1\u000d\u05a2\u05a2\u0000\u05a3\u05b9\u000d\u05ba\u05ba\u0000\u05bb\u05bd\u000d\u05be\u05be\u0003\u05bf\u05bf\u000d\u05c0\u05c0\u0003\u05c1\u05c2\u000d\u05c3\u05c3\u0003\u05c4\u05c4\u000d\u05c5\u05cf\u0000\u05d0\u05ea\u0003\u05eb\u05ef\u0000\u05f0\u05f4\u0003\u05f5\u05ff\u0000\u0600\u0603\u0004\u0604\u060b\u0000\u060c\u060c\u000c\u060d\u060d\u0004\u060e\u060f\u0012\u0610\u0615\u000d\u0616\u061a\u0000\u061b\u061b\u0004\u061c\u061e\u0000\u061f\u061f\u0004\u0620\u0620\u0000\u0621\u063a\u0004\u063b\u063f\u0000\u0640\u064a\u0004\u064b\u0658\u000d\u0659\u065f\u0000\u0660\u0669\u000b\u066a\u066a\u000a\u066b\u066c\u000b\u066d\u066f\u0004\u0670\u0670\u000d\u0671\u06d5\u0004\u06d6\u06dc\u000d\u06dd\u06dd\u0004\u06de\u06e4\u000d\u06e5\u06e6\u0004\u06e7\u06e8\u000d\u06e9\u06e9\u0012\u06ea\u06ed\u000d\u06ee\u06ef\u0004\u06f0\u06f9\u0008\u06fa\u070d\u0004\u070e\u070e\u0000\u070f\u070f\u000e\u0710\u0710\u0004\u0711\u0711\u000d\u0712\u072f\u0004\u0730\u074a\u000d\u074b\u074c\u0000\u074d\u074f\u0004\u0750\u077f\u0000\u0780\u07a5\u0004\u07a6\u07b0\u000d\u07b1\u07b1\u0004\u07b2\u0900\u0000\u0901\u0902\u000d\u0903\u093b\u0000\u093c\u093c\u000d\u093d\u0940\u0000\u0941\u0948\u000d\u0949\u094c\u0000\u094d\u094d\u000d\u094e\u0950\u0000\u0951\u0954\u000d\u0955\u0961\u0000\u0962\u0963\u000d\u0964\u0980\u0000\u0981\u0981\u000d\u0982\u09bb\u0000\u09bc\u09bc\u000d\u09bd\u09c0\u0000\u09c1\u09c4\u000d\u09c5\u09cc\u0000\u09cd\u09cd\u000d\u09ce\u09e1\u0000\u09e2\u09e3\u000d\u09e4\u09f1\u0000\u09f2\u09f3\u000a\u09f4\u0a00\u0000\u0a01\u0a02\u000d\u0a03\u0a3b\u0000\u0a3c\u0a3c\u000d\u0a3d\u0a40\u0000\u0a41\u0a42\u000d\u0a43\u0a46\u0000\u0a47\u0a48\u000d\u0a49\u0a4a\u0000\u0a4b\u0a4d\u000d\u0a4e\u0a6f\u0000\u0a70\u0a71\u000d\u0a72\u0a80\u0000\u0a81\u0a82\u000d\u0a83\u0abb\u0000\u0abc\u0abc\u000d\u0abd\u0ac0\u0000\u0ac1\u0ac5\u000d\u0ac6\u0ac6\u0000\u0ac7\u0ac8\u000d\u0ac9\u0acc\u0000\u0acd\u0acd\u000d\u0ace\u0ae1\u0000\u0ae2\u0ae3\u000d\u0ae4\u0af0\u0000\u0af1\u0af1\u000a\u0af2\u0b00\u0000\u0b01\u0b01\u000d\u0b02\u0b3b\u0000\u0b3c\u0b3c\u000d\u0b3d\u0b3e\u0000\u0b3f\u0b3f\u000d\u0b40\u0b40\u0000\u0b41\u0b43\u000d\u0b44\u0b4c\u0000\u0b4d\u0b4d\u000d\u0b4e\u0b55\u0000\u0b56\u0b56\u000d\u0b57\u0b81\u0000\u0b82\u0b82\u000d\u0b83\u0bbf\u0000\u0bc0\u0bc0\u000d\u0bc1\u0bcc\u0000\u0bcd\u0bcd\u000d\u0bce\u0bf2\u0000\u0bf3\u0bf8\u0012\u0bf9\u0bf9\u000a\u0bfa\u0bfa\u0012\u0bfb\u0c3d\u0000\u0c3e\u0c40\u000d\u0c41\u0c45\u0000\u0c46\u0c48\u000d\u0c49\u0c49\u0000\u0c4a\u0c4d\u000d\u0c4e\u0c54\u0000\u0c55\u0c56\u000d\u0c57\u0cbb\u0000\u0cbc\u0cbc\u000d\u0cbd\u0ccb\u0000\u0ccc\u0ccd\u000d\u0cce\u0d40\u0000\u0d41\u0d43\u000d\u0d44\u0d4c\u0000\u0d4d\u0d4d\u000d\u0d4e\u0dc9\u0000\u0dca\u0dca\u000d\u0dcb\u0dd1\u0000\u0dd2\u0dd4\u000d\u0dd5\u0dd5\u0000\u0dd6\u0dd6\u000d\u0dd7\u0e30\u0000\u0e31\u0e31\u000d\u0e32\u0e33\u0000\u0e34\u0e3a\u000d\u0e3b\u0e3e\u0000\u0e3f\u0e3f\u000a\u0e40\u0e46\u0000\u0e47\u0e4e\u000d\u0e4f\u0eb0\u0000\u0eb1\u0eb1\u000d\u0eb2\u0eb3\u0000\u0eb4\u0eb9\u000d\u0eba\u0eba\u0000\u0ebb\u0ebc\u000d\u0ebd\u0ec7\u0000\u0ec8\u0ecd\u000d\u0ece\u0f17\u0000\u0f18\u0f19\u000d\u0f1a\u0f34\u0000\u0f35\u0f35\u000d\u0f36\u0f36\u0000\u0f37\u0f37\u000d\u0f38\u0f38\u0000\u0f39\u0f39\u000d\u0f3a\u0f3d\u0012\u0f3e\u0f70\u0000\u0f71\u0f7e\u000d\u0f7f\u0f7f\u0000\u0f80\u0f84\u000d\u0f85\u0f85\u0000\u0f86\u0f87\u000d\u0f88\u0f8f\u0000\u0f90\u0f97\u000d\u0f98\u0f98\u0000\u0f99\u0fbc\u000d\u0fbd\u0fc5\u0000\u0fc6\u0fc6\u000d\u0fc7\u102c\u0000\u102d\u1030\u000d\u1031\u1031\u0000\u1032\u1032\u000d\u1033\u1035\u0000\u1036\u1037\u000d\u1038\u1038\u0000\u1039\u1039\u000d\u103a\u1057\u0000\u1058\u1059\u000d\u105a\u167f\u0000\u1680\u1680\u0011\u1681\u169a\u0000\u169b\u169c\u0012\u169d\u1711\u0000\u1712\u1714\u000d\u1715\u1731\u0000\u1732\u1734\u000d\u1735\u1751\u0000\u1752\u1753\u000d\u1754\u1771\u0000\u1772\u1773\u000d\u1774\u17b6\u0000\u17b7\u17bd\u000d\u17be\u17c5\u0000\u17c6\u17c6\u000d\u17c7\u17c8\u0000\u17c9\u17d3\u000d\u17d4\u17da\u0000\u17db\u17db\u000a\u17dc\u17dc\u0000\u17dd\u17dd\u000d\u17de\u17ef\u0000\u17f0\u17f9\u0012\u17fa\u17ff\u0000\u1800\u180a\u0012\u180b\u180d\u000d\u180e\u180e\u0011\u180f\u18a8\u0000\u18a9\u18a9\u000d\u18aa\u191f\u0000\u1920\u1922\u000d\u1923\u1926\u0000\u1927\u192b\u000d\u192c\u1931\u0000\u1932\u1932\u000d\u1933\u1938\u0000\u1939\u193b\u000d\u193c\u193f\u0000\u1940\u1940\u0012\u1941\u1943\u0000\u1944\u1945\u0012\u1946\u19df\u0000\u19e0\u19ff\u0012\u1a00\u1fbc\u0000\u1fbd\u1fbd\u0012\u1fbe\u1fbe\u0000\u1fbf\u1fc1\u0012\u1fc2\u1fcc\u0000\u1fcd\u1fcf\u0012\u1fd0\u1fdc\u0000\u1fdd\u1fdf\u0012\u1fe0\u1fec\u0000\u1fed\u1fef\u0012\u1ff0\u1ffc\u0000\u1ffd\u1ffe\u0012\u1fff\u1fff\u0000\u2000\u200a\u0011\u200b\u200d\u000e\u200e\u200e\u0000\u200f\u200f\u0003\u2010\u2027\u0012\u2028\u2028\u0011\u2029\u2029\u000f\u202a\u202a\u0001\u202b\u202b\u0005\u202c\u202c\u0007\u202d\u202d\u0002\u202e\u202e\u0006\u202f\u202f\u0011\u2030\u2034\u000a\u2035\u2054\u0012\u2055\u2056\u0000\u2057\u2057\u0012\u2058\u205e\u0000\u205f\u205f\u0011\u2060\u2063\u000e\u2064\u2069\u0000\u206a\u206f\u000e\u2070\u2070\u0008\u2071\u2073\u0000\u2074\u2079\u0008\u207a\u207b\u000a\u207c\u207e\u0012\u207f\u207f\u0000\u2080\u2089\u0008\u208a\u208b\u000a\u208c\u208e\u0012\u208f\u209f\u0000\u20a0\u20b1\u000a\u20b2\u20cf\u0000\u20d0\u20ea\u000d\u20eb\u20ff\u0000\u2100\u2101\u0012\u2102\u2102\u0000\u2103\u2106\u0012\u2107\u2107\u0000\u2108\u2109\u0012\u210a\u2113\u0000\u2114\u2114\u0012\u2115\u2115\u0000\u2116\u2118\u0012\u2119\u211d\u0000\u211e\u2123\u0012\u2124\u2124\u0000\u2125\u2125\u0012\u2126\u2126\u0000\u2127\u2127\u0012\u2128\u2128\u0000\u2129\u2129\u0012\u212a\u212d\u0000\u212e\u212e\u000a\u212f\u2131\u0000\u2132\u2132\u0012\u2133\u2139\u0000\u213a\u213b\u0012\u213c\u213f\u0000\u2140\u2144\u0012\u2145\u2149\u0000\u214a\u214b\u0012\u214c\u2152\u0000\u2153\u215f\u0012\u2160\u218f\u0000\u2190\u2211\u0012\u2212\u2213\u000a\u2214\u2335\u0012\u2336\u237a\u0000\u237b\u2394\u0012\u2395\u2395\u0000\u2396\u23d0\u0012\u23d1\u23ff\u0000\u2400\u2426\u0012\u2427\u243f\u0000\u2440\u244a\u0012\u244b\u245f\u0000\u2460\u249b\u0008\u249c\u24e9\u0000\u24ea\u24ea\u0008\u24eb\u2617\u0012\u2618\u2618\u0000\u2619\u267d\u0012\u267e\u267f\u0000\u2680\u2691\u0012\u2692\u269f\u0000\u26a0\u26a1\u0012\u26a2\u2700\u0000\u2701\u2704\u0012\u2705\u2705\u0000\u2706\u2709\u0012\u270a\u270b\u0000\u270c\u2727\u0012\u2728\u2728\u0000\u2729\u274b\u0012\u274c\u274c\u0000\u274d\u274d\u0012\u274e\u274e\u0000\u274f\u2752\u0012\u2753\u2755\u0000\u2756\u2756\u0012\u2757\u2757\u0000\u2758\u275e\u0012\u275f\u2760\u0000\u2761\u2794\u0012\u2795\u2797\u0000\u2798\u27af\u0012\u27b0\u27b0\u0000\u27b1\u27be\u0012\u27bf\u27cf\u0000\u27d0\u27eb\u0012\u27ec\u27ef\u0000\u27f0\u2b0d\u0012\u2b0e\u2e7f\u0000\u2e80\u2e99\u0012\u2e9a\u2e9a\u0000\u2e9b\u2ef3\u0012\u2ef4\u2eff\u0000\u2f00\u2fd5\u0012\u2fd6\u2fef\u0000\u2ff0\u2ffb\u0012\u2ffc\u2fff\u0000\u3000\u3000\u0011\u3001\u3004\u0012\u3005\u3007\u0000\u3008\u3020\u0012\u3021\u3029\u0000\u302a\u302f\u000d\u3030\u3030\u0012\u3031\u3035\u0000\u3036\u3037\u0012\u3038\u303c\u0000\u303d\u303f\u0012\u3040\u3098\u0000\u3099\u309a\u000d\u309b\u309c\u0012\u309d\u309f\u0000\u30a0\u30a0\u0012\u30a1\u30fa\u0000\u30fb\u30fb\u0012\u30fc\u321c\u0000\u321d\u321e\u0012\u321f\u324f\u0000\u3250\u325f\u0012\u3260\u327b\u0000\u327c\u327d\u0012\u327e\u32b0\u0000\u32b1\u32bf\u0012\u32c0\u32cb\u0000\u32cc\u32cf\u0012\u32d0\u3376\u0000\u3377\u337a\u0012\u337b\u33dd\u0000\u33de\u33df\u0012\u33e0\u33fe\u0000\u33ff\u33ff\u0012\u3400\u4dbf\u0000\u4dc0\u4dff\u0012\u4e00\ua48f\u0000\ua490\ua4c6\u0012\ua4c7\ufb1c\u0000\ufb1d\ufb1d\u0003\ufb1e\ufb1e\u000d\ufb1f\ufb28\u0003\ufb29\ufb29\u000a\ufb2a\ufb36\u0003\ufb37\ufb37\u0000\ufb38\ufb3c\u0003\ufb3d\ufb3d\u0000\ufb3e\ufb3e\u0003\ufb3f\ufb3f\u0000\ufb40\ufb41\u0003\ufb42\ufb42\u0000\ufb43\ufb44\u0003\ufb45\ufb45\u0000\ufb46\ufb4f\u0003\ufb50\ufbb1\u0004\ufbb2\ufbd2\u0000\ufbd3\ufd3d\u0004\ufd3e\ufd3f\u0012\ufd40\ufd4f\u0000\ufd50\ufd8f\u0004\ufd90\ufd91\u0000\ufd92\ufdc7\u0004\ufdc8\ufdef\u0000\ufdf0\ufdfc\u0004\ufdfd\ufdfd\u0012\ufdfe\ufdff\u0000\ufe00\ufe0f\u000d\ufe10\ufe1f\u0000\ufe20\ufe23\u000d\ufe24\ufe2f\u0000\ufe30\ufe4f\u0012\ufe50\ufe50\u000c\ufe51\ufe51\u0012\ufe52\ufe52\u000c\ufe53\ufe53\u0000\ufe54\ufe54\u0012\ufe55\ufe55\u000c\ufe56\ufe5e\u0012\ufe5f\ufe5f\u000a\ufe60\ufe61\u0012\ufe62\ufe63\u000a\ufe64\ufe66\u0012\ufe67\ufe67\u0000\ufe68\ufe68\u0012\ufe69\ufe6a\u000a\ufe6b\ufe6b\u0012\ufe6c\ufe6f\u0000\ufe70\ufe74\u0004\ufe75\ufe75\u0000\ufe76\ufefc\u0004\ufefd\ufefe\u0000\ufeff\ufeff\u000e\uff00\uff00\u0000\uff01\uff02\u0012\uff03\uff05\u000a\uff06\uff0a\u0012\uff0b\uff0b\u000a\uff0c\uff0c\u000c\uff0d\uff0d\u000a\uff0e\uff0e\u000c\uff0f\uff0f\u0009\uff10\uff19\u0008\uff1a\uff1a\u000c\uff1b\uff20\u0012\uff21\uff3a\u0000\uff3b\uff40\u0012\uff41\uff5a\u0000\uff5b\uff65\u0012\uff66\uffdf\u0000\uffe0\uffe1\u000a\uffe2\uffe4\u0012\uffe5\uffe6\u000a\uffe7\uffe7\u0000\uffe8\uffee\u0012\uffef\ufff8\u0000\ufff9\ufffb\u000e\ufffc\ufffd\u0012\ufffe\uffff\u0000';
        //#endregion
        //#region constructors
        public constructor() {
            for (let i : number = 0; i < this.charTypes.length; ++i) {
                let start : number = this.charTypes[i];
                let end : number = this.charTypes[++i];
                let b : number = this.charTypes[++i];
                while (start <= end) {
                    this.rtlCharacterTypes[start++] = b;
                }
            }
        }
        //#endregion
        //#region implementation
        private static decodeCharTypes(data : string) : number[] {
            let values : number[] = [];
            for (let i : number = 0; i < data.length; i++) {
                values.push(data.charCodeAt(i));
            }
            return values;
        }
        public getVisualOrder( inputText : string, isRtl :  boolean) : number[] {
            this.types = this.getCharacterCode(inputText);
            this.textOrder = isRtl ? this.LRE : this.L;
            this.doVisualOrder();
            let result : number[] = [];
            for (let i : number = 0; i < this.levels.length; i++) {
                result[i] = this.levels[i];
            }
            return result;
        }
        private getCharacterCode( text : string) : number[] {
            let characterCodes : number[] = [];
            for (let i : number = 0; i < text.length; i++) {
                characterCodes[i] = this.rtlCharacterTypes[text[i].charCodeAt(0)];
            }
            return characterCodes;
        }
        private setDefaultLevels() : void {
            for (let i : number = 0; i < this.length; i++) {
                this.levels[i] = this.textOrder;
            }
        }
        private setLevels(): void {
            this.setDefaultLevels();
            for (let n : number = 0; n < this.length; ++n) {
                let level : number = this.levels[n];
                if ((level & 0x80) !== 0) {
                    level &= 0x7f;
                    this.result[n] = ((level & 0x1) === 0) ? this.L : this.R;
                }
                this.levels[n] = level;
            }
        }
        private updateLevels( index : number, level : number,  length : number) : void {
            if ((level & 1) === 0) {
                for (let i : number = index; i < length; ++i) {
                    if (this.result[i] === this.R) {
                        this.levels[i] += 1;
                    } else if (this.result[i] !== this.L) {
                        this.levels[i] += 2;
                    }
                }
            } else {
                for (let i : number = index; i < length; ++i) {
                    if (this.result[i] !== this.R) {
                        this.levels[i] += 1;
                    }
                }
            }
        }
        private doVisualOrder() : void {
            this.length = this.types.length;
            this.result = this.types;
            this.levels = [];
            this.setLevels();
            this.length = this.getEmbeddedCharactersLength();
            let preview : number = this.textOrder;
            let i : number = 0;
            while (i < this.length) {
                let level : number = this.levels[i];
                let preType : number = ((Math.max(preview, level) & 0x1) === 0) ? this.L : this.R;
                let length : number = i + 1;
                while (length < this.length && this.levels[length] === level) {
                    ++length;
                }
                let success : number = length < this.length ? this.levels[length] : this.textOrder;
                let type : number = ((Math.max(success, level) & 0x1) === 0) ? this.L : this.R;
                this.checkNSM(i, length, level, preType, type);
                this.updateLevels(i, level, length);
                preview = level;
                i = length;
            }
            this.checkEmbeddedCharacters(this.length);
        }
        private getEmbeddedCharactersLength() : number {
            let index : number = 0;
            for (let i : number = 0; i < this.length; ++i) {
                if (!(this.types[i] === this.LRE || this.types[i] === this.RLE || this.types[i] === this.LRO ||
                                    this.types[i] === this.RLO || this.types[i] === this.PDF || this.types[i] === this.BN)) {
                    this.result[index] = this.result[i];
                    this.levels[index] = this.levels[i];
                    index++;
                }
            }
            return index;
        }
        private  checkEmbeddedCharacters( length : number) : void {
            for (let i : number = this.types.length - 1; i >= 0; --i) {
                if (this.types[i] === this.LRE || this.types[i] === this.RLE || this.types[i] === this.LRO ||
                                this.types[i] === this.RLO || this.types[i] === this.PDF || this.types[i] === this.BN) {
                    this.result[i] = this.types[i];
                    this.levels[i] = -1;
                } else {
                    length -= 1;
                    this.result[i] = this.result[length];
                    this.levels[i] = this.levels[length];
                }
            }
            for (let i : number = 0; i < this.types.length; i++) {
                if (this.levels[i] === -1) {
                    if (i === 0) {
                        this.levels[i] = this.textOrder;
                    } else {
                        this.levels[i] = this.levels[i - 1];
                    }
                }
            }
        }
        private  checkNSM( index : number,  length : number,  level : number,  startType : number,  endType : number) : void {
            let charType : number = startType;
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.NSM) {
                    this.result[i] = charType;
                } else {
                    charType = this.result[i];
                }
            }
            this.checkEuropeanDigits(index, length, level, startType, endType);
        }
        private checkEuropeanDigits( index : number, length : number,  level : number,  startType : number,  endType : number) : void {
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.EN) {
                    for (let j : number = i - 1; j >= index; --j) {
                        if (this.result[j] === this.L || this.result[j] === this.R || this.result[j] === this.AL) {
                            if (this.result[j] === this.AL) {
                                this.result[i] = this.AN;
                            }
                            break;
                        }
                    }
                }
            }
            this.checkArabicCharacters(index, length, level, startType, endType);
        }
        private checkArabicCharacters( index : number,  length : number,  level: number,  startType : number,  endType: number) : void {
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.AL) {
                    this.result[i] = this.R;
                }
            }
            this.checkEuropeanNumberSeparator(index, length, level, startType, endType);
        }
        private checkEuropeanNumberSeparator(index : number, length : number, level : number, startType : number, endType : number) : void {
            for (let i : number = index + 1; i < length - 1; ++i) {
                if (this.result[i] === this.ES || this.result[i] === this.CS) {
                    let preview : number = this.result[i - 1];
                    let success : number = this.result[i + 1];
                    if (preview === this.EN && success === this.EN) {
                        this.result[i] = this.EN;
                    } else if (this.result[i] === this.CS && preview === this.AN && success === this.AN) {
                        this.result[i] = this.AN;
                    }
                }
            }
            this.checkEuropeanNumberTerminator(index, length, level, startType, endType);
        }
        private checkEuropeanNumberTerminator( index: number, length : number, level: number, startType: number, endType: number) : void {
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.ET) {
                    let s : number = i;
                    let b : number[] = [];
                    b.push(this.ET);
                    let l : number = this.getLength(s, length, b);
                    let data : number = s === index ? startType : this.result[s - 1];
                    if (data !== this.EN) {
                        data = (l === length) ? endType : this.result[l];
                    }
                    if (data === this.EN) {
                        for (let j : number = s; j < l; ++j) {
                            this.result[j] = this.EN;
                        }
                    }
                    i = l;
                }
            }
            this.checkOtherNeutrals(index, length, level, startType, endType);
        }
        private checkOtherNeutrals( index : number, length : number, level : number, startType : number, endType: number) : void {
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.ES || this.result[i] === this.ET || this.result[i] === this.CS) {
                    this.result[i] = this.ON;
                }
            }
            this.checkOtherCharacters(index, length, level, startType, endType);
        }
        private checkOtherCharacters( index : number,  length : number, level : number, startType : number, endType: number) : void {
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.EN) {
                    let pst : number = startType;
                    for (let j : number = i - 1; j >= index; --j) {
                        if (this.result[j] === this.L || this.result[j] === this.R) {
                            pst = this.result[j];
                            break;
                        }
                    }
                    if (pst === this.L) {
                        this.result[i] = this.L;
                    }
                }
            }
            this.checkCommanCharacters(index, length, level, startType, endType);
        }
        private getLength( index : number, length : number, validSet : number[]) : number {
            --index;
            while (++index < length) {
                let t : number = this.result[index];
                for (let i : number = 0; i < validSet.length; ++i) {
                    if (t === validSet[i]) {
                        index = this.getLength(++index, length, validSet);
                    }
                }
                return index;
            }
            return length;
        }
        private checkCommanCharacters( index : number, length : number, level : number, startType : number, endType : number) : void {
            for (let i : number = index; i < length; ++i) {
                if (this.result[i] === this.WS || this.result[i] === this.ON || this.result[i] === this.B ||
                                this.result[i] === this.S) {
                    let s : number = i;
                    let byte : number[] = [this.B, this.S, this.WS, this.ON];
                    let l  : number = this.getLength(s, length, byte);
                    let lt : number = 0;
                    let tt : number = 0;
                    let rt : number = 0;
                    if (s === index) {
                        lt = startType;
                    } else {
                        lt = this.result[s - 1];
                        if (lt === this.AN) {
                            lt = this.R;
                        } else if (lt === this.EN) {
                            lt = this.R;
                        }
                    }
                    if (l === length) {
                        tt = endType;
                    } else {
                        tt = this.result[l];
                        if (tt === this.AN) {
                            tt = this.R;
                        } else if (tt === this.EN) {
                            tt = this.R;
                        }
                    }
                    if (lt === tt) {
                        rt = lt;
                    } else {
                        rt = ((level & 0x1) === 0) ? this.L : this.R;
                    }
                    for (let j : number = s; j < l; ++j) {
                        this.result[j] = rt;
                    }
                    i = l;
                }
            }
        }
        //#endregion
    }
