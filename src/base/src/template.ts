/**
 * Template Engine
 */

const LINES: RegExp = new RegExp('\\n|\\r|\\s\\s+', 'g');
const QUOTES: RegExp = new RegExp(/'|"/g);
const IF_STMT: RegExp = new RegExp('if ?\\(');
const ELSEIF_STMT: RegExp = new RegExp('else if ?\\(');
const ELSE_STMT: RegExp = new RegExp('else');
const FOR_STMT: RegExp = new RegExp('for ?\\(');
const IF_OR_FOR: RegExp = new RegExp('(\/if|\/for)');
const CALL_FUNCTION: RegExp = new RegExp('\\((.*)\\)', '');
const NOT_NUMBER: RegExp = new RegExp('^[0-9]+$', 'g');
const WORD: RegExp = new RegExp('[\\w"\'.\\s+]+', 'g');
const DBL_QUOTED_STR: RegExp = new RegExp('"(.*?)"', 'g');

let exp: RegExp = new RegExp('\\${([^}]*)}', 'g');
// let cachedTemplate: Object = {};


/**
 * The function to set regular expression for template expression string.
 * @param  {RegExp} value - Value expression.
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
 * @param  {string} template - The template string which is going to convert.
 * @param  {Object} helper? - Helper functions as an object.
 * @private
 */
export function compile(template: string, helper?: Object): () => string {
    let argName: string = 'data';

    let evalExpResult: string = evalExp(template, argName, helper);
    let fnCode: string = `var str="${evalExpResult}"; return str;`;

    // tslint:disable-next-line:no-function-constructor-with-string-args
    let fn: Function = new Function(argName, fnCode);

    return fn.bind(helper);
}

// function used to evaluate the function expression
function evalExp(str: string, nameSpace: string, helper?: Object): string {
    let varCOunt: number = 0;
    /**
     * Variable containing Local Keys
     */
    let localKeys: string[] = [];

    return str.replace(LINES, '').replace(DBL_QUOTED_STR, '\'$1\'').replace(

        exp,

        (match: string, cnt: string, offset: number, matchStr: string): string => {

            let matches: string[] = cnt.match(CALL_FUNCTION);

            // matches to detect any function calls
            if (matches) {
                let rlStr: string = matches[1];
                if (ELSEIF_STMT.test(cnt)) {
                    //handling else-if condition
                    cnt = '";} ' + cnt.replace(matches[1], rlStr.replace(WORD, (str: string): string => {
                        str = str.trim();
                        return addNameSpace(str, !(QUOTES.test(str)) && (localKeys.indexOf(str) === -1), nameSpace, localKeys);
                    })) + '{ \n str = str + "';
                } else if (IF_STMT.test(cnt)) {
                    //handling if condition
                    cnt = '"; ' + cnt.replace(matches[1], rlStr.replace(WORD, (strs: string): string => {
                        strs = strs.trim();
                        return addNameSpace(strs, !(QUOTES.test(strs)) && (localKeys.indexOf(strs) === -1), nameSpace, localKeys);
                    })) + '{ \n str = str + "';
                } else if (FOR_STMT.test(cnt)) {

                    //handling for condition
                    let rlStr: string[] = matches[1].split(' of ');

                    // replace for each into actual JavaScript
                    cnt = '"; ' + cnt.replace(matches[1], (mtc: string): string => {
                        localKeys.push(rlStr[0]);
                        localKeys.push(rlStr[0] + 'Index');
                        varCOunt = varCOunt + 1;
                        // tslint:disable-next-line
                        return 'var i' + varCOunt + '=0; i' + varCOunt + ' < ' + addNameSpace(rlStr[1], true, nameSpace, localKeys) + '.length; i' + varCOunt + '++';
                    }) + '{ \n ' + rlStr[0] + '= ' + addNameSpace(rlStr[1], true, nameSpace, localKeys)
                        + '[i' + varCOunt + ']; \n var ' + rlStr[0] + 'Index=i' + varCOunt + '; \n str = str + "';

                } else {
                    //helper function handling
                    let fnStr: string[] = cnt.split('(');
                    let fNameSpace: string = (helper && helper.hasOwnProperty(fnStr[0]) ? 'this.' : 'global');
                    fNameSpace = (/\./.test(fnStr[0]) ? '' : fNameSpace);
                    cnt = '" + ' + (fNameSpace === 'global' ? '' : fNameSpace) +
                        cnt.replace(
                            rlStr,
                            addNameSpace(
                                matches[1].replace(',', nameSpace + '.'),
                                (fNameSpace === 'global' ? false : true),
                                nameSpace,
                                localKeys
                            )
                        ) +
                        '+"';
                }
            } else if (ELSE_STMT.test(cnt)) {
                //handling else condition
                cnt = '"; ' + cnt.replace(ELSE_STMT, '} else { \n str = str + "');

            } else if (!!cnt.match(IF_OR_FOR)) {
                // close condition 
                cnt = cnt.replace(IF_OR_FOR, '"; \n } \n str = str + "');
            } else {
                // evaluate normal expression
                cnt = '"+' + addNameSpace(cnt, (localKeys.indexOf(cnt) === -1), nameSpace, localKeys) + '+"';
            }
            return cnt;
        });
}

function addNameSpace(str: string, addNS: Boolean, nameSpace: string, ignoreList: string[]): string {
    return ((addNS && !(NOT_NUMBER.test(str)) && ignoreList.indexOf(str.split('.')[0]) === -1) ? nameSpace + '.' + str : str);
}

// // Create hashCode for template string to storeCached function
// function hashCode(str: string): string {
//     return str.split('').reduce((a: number, b: string) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0).toString();
// }
