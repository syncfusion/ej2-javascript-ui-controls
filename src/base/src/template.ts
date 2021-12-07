/**
 * Template Engine
 */

const LINES: RegExp = new RegExp('\\n|\\r|\\s\\s+', 'g');
const QUOTES: RegExp = new RegExp(/'|"/g);
const IF_STMT: RegExp = new RegExp('if ?\\(');
const ELSEIF_STMT: RegExp = new RegExp('else if ?\\(');
const ELSE_STMT: RegExp = new RegExp('else');
const FOR_STMT: RegExp = new RegExp('for ?\\(');
const IF_OR_FOR: RegExp = new RegExp('(/if|/for)');
const CALL_FUNCTION: RegExp = new RegExp('\\((.*)\\)', '');
const NOT_NUMBER: RegExp = new RegExp('^[0-9]+$', 'g');
const WORD: RegExp = new RegExp('[\\w"\'.\\s+]+', 'g');
const DBL_QUOTED_STR: RegExp = new RegExp('"(.*?)"', 'g');
const WORDIF: RegExp = new RegExp('[\\w"\'@#$.\\s-+]+', 'g');
let exp: RegExp = new RegExp('\\${([^}]*)}', 'g');
// let cachedTemplate: Object = {};
const ARR_OBJ: RegExp = /^\..*/gm;
const SINGLE_SLASH: RegExp = /\\/gi;
const DOUBLE_SLASH: RegExp = /\\\\/gi;
const WORDFUNC: RegExp = new RegExp('[\\w"\'@#$.\\s+]+', 'g');
const WINDOWFUNC: RegExp = /\window\./gm;

/**
 * The function to set regular expression for template expression string.
 *
 * @param {RegExp} value - Value expression.
 * @returns {RegExp} ?
 * @private
 */
export function expression(value?: RegExp): RegExp {
    if (value) { exp = value; }
    return exp;
}


// /**
//  * To render the template string from the given data.
//  * @param  {string} template - String Template.
//  * @param  {Object[]|JSON} data - DataSource for the template.
//  * @param  {Object} helper? - custom helper object.
//  */
// export function template(template: string, data: JSON, helper?: Object): string {
//     let hash: string = hashCode(template);
//     let tmpl: Function;
//     if (!cachedTemplate[hash]) {
//         tmpl = cachedTemplate[hash] = compile(template, helper);
//     } else {
//         tmpl = cachedTemplate[hash];
//     }
//     return tmpl(data);
// }

/**
 * Compile the template string into template function.
 *
 * @param {string} template - The template string which is going to convert.
 * @param {Object} helper - Helper functions as an object.
 * @param {boolean} ignorePrefix ?
 * @returns {string} ?
 * @private
 */
export function compile(template: string, helper?: Object, ignorePrefix?: boolean): () => string {
    const argName: string = 'data';
    const evalExpResult: string = evalExp(template, argName, helper, ignorePrefix);
    const condtion = `var valueRegEx = (/value=\\'([A-Za-z0-9 _]*)((.)([\\w)(!-;?-■\\s]+)['])/g);
    var hrefRegex = (/(?:href)([\\s='"./]+)([\\w-./?=&\\\\#"]+)((.)([\\w)(!-;/?-■\\s]+)['])/g);
    if(str.match(valueRegEx)){
        var check = str.match(valueRegEx);
        var str1 = str;
        for (var i=0; i < check.length; i++) {
            var check1 = str.match(valueRegEx)[i].split('value=')[1];
            var change = check1.match(/^'/) !== null ? check1.replace(/^'/, '\"') : check1;
            change =change.match(/.$/)[0] === '\\'' ? change.replace(/.$/,'\"') : change;
            str1 = str1.replace(check1, change);
        }
        str = str.replace(str, str1);
    }
    else if(str.match(hrefRegex)) {
        var check = str.match(hrefRegex);
        var str1 = str;
        for (var i=0; i < check.length; i++) {
            var check1 = str.match(hrefRegex)[i].split('href=')[1];
            var change = check1.match(/^'/) !== null ? check1.replace(/^'/, '\"') : check1;
            change =change.match(/.$/)[0] === '\\'' ? change.replace(/.$/,'\"') : change;
            str1 = str1.replace(check1, change);
        }
        str = str.replace(str, str1);
    }
    `;
    const fnCode: string = "var str=\"" + evalExpResult + "\";" + condtion + " return str;";
    const fn: Function = new Function(argName, fnCode);
    return fn.bind(helper);
}

/** function used to evaluate the function expression
 *
 * @param {string} str ?
 * @param {string} nameSpace ?
 * @param {Object} helper ?
 * @param {boolean} ignorePrefix ?
 * @returns {string} ?
 */
function evalExp(str: string, nameSpace: string, helper?: Object, ignorePrefix?: boolean): string {
    let varCOunt: number = 0;
    /**
     * Variable containing Local Keys
     */
    const localKeys: string[] = [];
    const isClass: string[] = str.match(/class="([^"]+|)\s{2}/g);
    let singleSpace: string = '';
    if (isClass) {
        isClass.forEach((value: string) => {
            singleSpace = value.replace(/\s\s+/g, ' ');
            str = str.replace(value, singleSpace);
        });
    }

    return str.replace(LINES, '').replace(DBL_QUOTED_STR, '\'$1\'').replace(

        exp,
        // eslint-disable-next-line
        (match: string, cnt: string, offset: number, matchStr: string): string => {

            const SPECIAL_CHAR: RegExp = /@|#|\$/gm;
            const matches: string[] = cnt.match(CALL_FUNCTION);

            // matches to detect any function calls
            if (matches) {
                const rlStr: string = matches[1];
                if (ELSEIF_STMT.test(cnt)) {
                    //handling else-if condition
                    cnt = '";} ' + cnt.replace(matches[1], rlStr.replace(WORD, (str: string): string => {
                        str = str.trim();
                        return addNameSpace(str, !(QUOTES.test(str)) && (localKeys.indexOf(str) === -1),
                                            nameSpace, localKeys, ignorePrefix);
                    })) + '{ \n str = str + "';
                } else if (IF_STMT.test(cnt)) {
                    //handling if condition
                    cnt = '"; ' + cnt.replace(matches[1], rlStr.replace(WORDIF, (strs: string): string => {
                        return HandleSpecialCharArrObj(strs, nameSpace, localKeys, ignorePrefix);
                    })) + '{ \n str = str + "';
                } else if (FOR_STMT.test(cnt)) {

                    //handling for condition
                    const rlStr: string[] = matches[1].split(' of ');

                    // replace for each into actual JavaScript
                    // eslint-disable-next-line
                    cnt = '"; ' + cnt.replace(matches[1], (mtc: string): string => {
                        localKeys.push(rlStr[0]);
                        localKeys.push(rlStr[0] + 'Index');
                        varCOunt = varCOunt + 1;
                        // tslint:disable-next-line
                        return 'var i' + varCOunt + '=0; i' + varCOunt + ' < ' + addNameSpace(rlStr[1], true, nameSpace, localKeys, ignorePrefix) + '.length; i' + varCOunt + '++';
                    }) + '{ \n ' + rlStr[0] + '= ' + addNameSpace(rlStr[1], true, nameSpace, localKeys, ignorePrefix)
                        + '[i' + varCOunt + ']; \n var ' + rlStr[0] + 'Index=i' + varCOunt + '; \n str = str + "';

                } else {
                    //helper function handling
                    const fnStr: string[] = cnt.split('(');
                    // eslint-disable-next-line
                    let fNameSpace: string = (helper && helper.hasOwnProperty(fnStr[0]) ? 'this.' : 'global');
                    fNameSpace = (/\./.test(fnStr[0]) ? '' : fNameSpace);
                    const ftArray: string[] = matches[1].split(',');
                    if (matches[1].length !== 0 && !(/data/).test(ftArray[0]) && !(/window./).test(ftArray[0])) {
                        matches[1] = (fNameSpace === 'global' ? nameSpace + '.' + matches[1] : matches[1]);
                    }
                    const splRegexp: RegExp = /@|\$|#/gm;
                    const arrObj: RegExp = /\]\./gm;
                    if (WINDOWFUNC.test(cnt) && arrObj.test(cnt) || splRegexp.test(cnt)) {
                        const splArrRegexp: RegExp =  /@|\$|#|\]\./gm;
                        if (splArrRegexp.test(cnt)) {
                            // tslint:disable-next-line
                            cnt = '"+ ' + (fNameSpace === 'global' ? '' : fNameSpace) + cnt.replace(matches[1], rlStr.replace(WORDFUNC, (strs: string): string => {
                                return HandleSpecialCharArrObj(strs, nameSpace, localKeys, ignorePrefix);
                            })) + '+ "';
                        }
                    } else {
                        cnt = '" + ' + (fNameSpace === 'global' ? '' : fNameSpace) +
                    cnt.replace(
                        rlStr,
                        addNameSpace(
                            matches[1].replace(/,( |)data.|,/gi, ',' + nameSpace + '.').replace(/,( |)data.window/gi, ',window'),
                            (fNameSpace === 'global' ? false : true),
                            nameSpace,
                            localKeys,
                            ignorePrefix
                        )
                    ) +
                    '+"';
                    }
                }
            } else if (ELSE_STMT.test(cnt)) {
                // handling else condition
                cnt = '"; ' + cnt.replace(ELSE_STMT, '} else { \n str = str + "');
            // eslint-disable-next-line
            } else if (!!cnt.match(IF_OR_FOR)) {
                // close condition
                cnt = cnt.replace(IF_OR_FOR, '"; \n } \n str = str + "');
            } else if (SPECIAL_CHAR.test(cnt)) {
                // template string with double slash with special character
                if (cnt.match(SINGLE_SLASH)) {
                    cnt = SlashReplace(cnt);
                }
                cnt = '"+' + NameSpaceForspecialChar(cnt, (localKeys.indexOf(cnt) === -1), nameSpace, localKeys) + '"]+"';
            } else {
                // template string with double slash
                if (cnt.match(SINGLE_SLASH)) {
                    cnt = SlashReplace(cnt);
                    cnt = '"+' + NameSpaceForspecialChar(cnt, (localKeys.indexOf(cnt) === -1), nameSpace, localKeys) + '"]+"';
                } else {
                    // evaluate normal expression
                    cnt = '"+' + addNameSpace(
                        cnt.replace(/,/gi, '+' + nameSpace + '.'),
                        (localKeys.indexOf(cnt) === -1), nameSpace, localKeys, ignorePrefix) + '+"';
                }
            }
            return cnt;
        });
}

/**
 *
 * @param {string} str ?
 * @param {boolean} addNS ?
 * @param {string} nameSpace ?
 * @param {string[]} ignoreList ?
 * @param {boolean} ignorePrefix ?
 * @returns {string} ?
 */
function addNameSpace(str: string, addNS: boolean, nameSpace: string, ignoreList: string[], ignorePrefix: boolean): string {
    return ((addNS && !(NOT_NUMBER.test(str)) && ignoreList.indexOf(str.split('.')[0]) === -1 && !ignorePrefix) ? nameSpace + '.' + str : str);
}

/**
 *
 * @param {string} str ?
 * @param {boolean} addNS ?
 * @param {string} nameSpace ?
 * @param {string[]} ignoreList ?
 * @returns {string} ?
 */
function NameSpaceArrObj(str: string, addNS: boolean, nameSpace: string, ignoreList: string[]): string {
    const arrObjReg: RegExp = /^\..*/gm;
    return ((addNS && !(NOT_NUMBER.test(str)) &&
        ignoreList.indexOf(str.split('.')[0]) === -1 && !(arrObjReg.test(str))) ? nameSpace + '.' + str : str);
}

// // Create hashCode for template string to storeCached function
// function hashCode(str: string): string {
//     return str.split('').reduce((a: number, b: string) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0).toString();
// }

/**
 *
 * @param {string} str ?
 * @param {boolean} addNS ?
 * @param {string} nameSpace ?
 * @param {string[]} ignoreList ?
 * @returns {string} ?
 */
function NameSpaceForspecialChar(str: string, addNS: boolean, nameSpace: string, ignoreList: string[]): string {
    return ((addNS && !(NOT_NUMBER.test(str)) && ignoreList.indexOf(str.split('.')[0]) === -1) ? nameSpace + '["' + str : str);
}

// eslint-disable-next-line
function SlashReplace(tempStr: string): any {
    const double: string = '\\\\';
    if (tempStr.match(DOUBLE_SLASH)) {
        // eslint-disable-next-line
        tempStr = tempStr;
    } else {
        tempStr = tempStr.replace(SINGLE_SLASH, double as string);
    }
    return tempStr;
}

/**
 *
 * @param {string} str ?
 * @param {string} nameSpaceNew ?
 * @param {string[]} keys ?
 * @param {boolean} ignorePrefix ?
 * @returns {string} ?
 */
function HandleSpecialCharArrObj(str: string, nameSpaceNew: string, keys: string[], ignorePrefix: boolean): string {
    str = str.trim();
    const windowFunc: RegExp = /\window\./gm;
    if (!windowFunc.test(str)) {
        const quotes: RegExp = /'|"/gm;
        const splRegexp: RegExp = /@|\$|#/gm;
        if (splRegexp.test(str)) {
            str = NameSpaceForspecialChar(str, (keys.indexOf(str) === -1), nameSpaceNew, keys) + '"]';
        }
        if (ARR_OBJ.test(str)) {
            return NameSpaceArrObj(str, !(quotes.test(str)) && (keys.indexOf(str) === -1), nameSpaceNew, keys);
        } else {
            return addNameSpace(str, !(quotes.test(str)) && (keys.indexOf(str) === -1), nameSpaceNew, keys, ignorePrefix);
        }
    } else {
        return str;
    }
}
