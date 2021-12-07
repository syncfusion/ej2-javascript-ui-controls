import { Code39 } from './code39';

/**
 * code39 used to calculate the barcode of type 39
 */
export class Code39Extension extends Code39 {
    // eslint-disable-next-line
    private code39ExtensionValues(): object {
        // eslint-disable-next-line
        let codes: object = {
            '0': '%U', '1': '$A', '2': '$B', '3': '$C', '4': '$D',
            '5': '$E', '6': '$F', '7': '$G', '8': '$H', '9': '$I',
            '10': '$J', '11': '$K', '12': '$L', '13': '$M', '14': '$N',
            '15': '$O', '16': '$P', '17': '$Q', '18': '$R', '19': '$S',
            '20': '$T', '21': '$U', '22': '$V', '23': '$W', '24': '$X',
            '25': '$Y', '26': '$Z', '27': '%A', '28': '%B', '29': '%C',
            '30': '%D', '31': '%E', '32': ' ', '33': '/A', '34': '/B',
            '35': '/C', '36': '/D', '37': '/E', '38': '/F', '39': '/G',
            '40': '/H', '41': '/I', '42': '/J', '43': '/K', '44': '/L',
            '45': '-', '46': '.', '47': '/O', '48': '0', '49': '1',
            '50': '2', '51': '3', '52': '4', '53': '5', '54': '6', '55': '7',
            '56': '8',
            '57': '9',
            '58': '/Z',
            '59': '%F',
            '60': '%G',
            '61': '%H',
            '62': '%I',
            '63': '%J',
            '64': '%V',
            '65': 'A',
            '66': 'B',
            '67': 'C',
            '68': 'D',
            '69': 'E',
            '70': 'F',
            '71': 'G',
            '72': 'H',
            '73': 'I',
            '74': 'J',
            '75': 'K',
            '76': 'L',
            '77': 'M',
            '78': 'N',
            '79': 'O',
            '80': 'P',
            '81': 'Q',
            '82': 'R',
            '83': 'S',
            '84': 'T',
            '85': 'U',
            '86': 'V',
            '87': 'W',
            '88': 'X',
            '89': 'Y',
            '90': 'Z',
            '91': '%K',
            '92': '%L',
            '93': '%M',
            '94': '%N',
            '95': '%O',
            '96': '%W',
            '97': '+A',
            '98': '+B',
            '99': '+C',
            '100': '+D',
            '101': '+E',
            '102': '+F',
            '103': '+G',
            '104': '+H',
            '105': '+I',
            '106': '+J',
            '107': '+K',
            '108': '+L',
            '109': '+M',
            '110': '+N',
            '111': '+O',
            '112': '+P',
            '113': '+Q',
            '114': '+R',
            '115': '+S',
            '116': '+T',
            '117': '+U',
            '118': '+V',
            '119': '+W',
            '120': '+X',
            '121': '+Y',
            '122': '+Z',
            '123': '%P',
            '124': '%Q',
            '125': '	%R',
            '126': '%S',
            '127': '%T'
        };
        return codes;
    }
    /**
     * Validate the given input.
     *
     * @returns {string} Validate the given input.
     * @param {string} char - Provide the canvas element .
     * @private
     */
    public validateInput(char: string): string {
        const asciiCheck: boolean = this.checkText(char);
        if (asciiCheck) {
            return undefined;
        } else {
            return 'Supports 128 characters of ASCII.';
        }
    }

    private checkText(char: string): boolean {
        for (let i: number = 0; i < char.length; i++) {
            if (char.charCodeAt(i) > 127) {
                return false;
            }
        }
        return true;
    }

    private code39Extension(givenCharacter: string): string {
        let encodedString: string = '';
        // eslint-disable-next-line
        const code: object = this.code39ExtensionValues();
        let asciivalue: number;
        for (let i: number = 0; i < givenCharacter.length; i++) {
            asciivalue = givenCharacter[i].charCodeAt(0);
            encodedString += code[asciivalue];
        }
        return encodedString;
    }


    /**
     * Draw the barcode SVG.\
     *
     * @returns {void} Draw the barcode SVG .
     *  @param {HTMLElement} canvas - Provide the canvas element .
     * @private
     */
    public drawCode39(canvas: HTMLElement): void {
        const givenCharacter: string = this.value;
        const encodedCharacter: string = this.code39Extension(givenCharacter);
        this.drawCode39Extension(canvas, encodedCharacter);
    }
}
