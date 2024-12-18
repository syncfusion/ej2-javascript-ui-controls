import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ParameterizedNamedSql, ParameterizedSql, QueryBuilder } from './query-builder';
import { RuleModel } from './query-builder-model';


export class QueryLibrary {
    private parent: QueryBuilder;

    constructor(parent?: QueryBuilder) {
        this.parent = parent;
        this.addEventListener();
    }

    public destroy(): void {
        if (this.parent.isDestroyed) { return; }
        this.removeEventListener();
    }

    private addEventListener(): void {
        if (this.parent.isDestroyed) { return; }
        this.parent.on('query-library', this.queryLibrary, this);
        this.parent.on('destroyed', this.destroy, this);
    }

    private removeEventListener(): void {
        this.parent.off('query-library', this.queryLibrary);
        this.parent.off('destroyed', this.destroy);
    }

    private queryLibrary(args?: { onPropertyChange: boolean, prop: string, value?: object }): void {
        switch (args.prop) {
        case 'getMongoFromRules':
            args.value['obj']['mongoQuery'] = this.getMongoFromRules(args.value['rule'], args.value['mongoQuery']);
            break;
        case 'mongoParser':
            this.mongoParser(args.value['mongoQuery'], args.value['rule'], args.value['mongoLocale']);
            break;
        case 'getParameterSql':
            args.value['obj']['sql'] = this.getParameterSql(args.value['rule']);
            break;
        case 'getNamedParameterSql':
            args.value['obj']['sql'] = this.getNamedParameterSql(args.value['rule']);
            break;
        case 'convertParamSqlToSql':
            args.value['obj']['sql'] = this.convertParamSqlToSql(args.value['sql']);
            break;
        case 'convertNamedParamSqlToSql':
            args.value['obj']['sql'] = this.convertNamedParamSqlToSql(args.value['sql']);
            break;
        }
    }

    private getMongoFromRules(rule: RuleModel, mongoQuery: string): string {
        mongoQuery = '{';
        if (rule.condition === 'or') {
            mongoQuery += '"$or":[';
            mongoQuery = this.convertMongoQuery(rule.rules, mongoQuery) + ']';
        } else {
            mongoQuery += '"$and":[';
            mongoQuery = this.convertMongoQuery(rule.rules, mongoQuery) + ']';
        }
        mongoQuery += '}';
        return mongoQuery;
    }

    private getOperatorFromMongoOperator(operator: string): string {
        let operatorValue: string;
        switch (operator) {
        case '$ne':
            operatorValue = 'notequal';
            break;
        case '$gt':
            operatorValue = 'greaterthan';
            break;
        case '$gte':
            operatorValue = 'greaterthanorequal';
            break;
        case '$lt':
            operatorValue = 'lessthan';
            break;
        case '$lte':
            operatorValue = 'lessthanorequal';
            break;
        case '$nin':
            operatorValue = 'notin';
            break;
        }
        return operatorValue;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private convertMongoQuery(rules: any, mongoQuery: string): string {
        let i: number = 0;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (rules as any).forEach((item: any) => {
            i++;
            mongoQuery += '{';
            if (item.rules !== undefined) {
                if (item.condition === 'or') {
                    mongoQuery += ' "$or":[';
                    mongoQuery = this.convertMongoQuery(item.rules, mongoQuery) + ']';
                } else {
                    mongoQuery += ' "$and":[';
                    mongoQuery = this.convertMongoQuery(item.rules, mongoQuery) + ']';
                }
            }
            let itVal: string = item.type === 'string' && item.operator !== 'in' && item.operator !== 'notin' && item.value && item.value.trim() !== '' ? item.value.replace(/'/g, '\\') : '';
            if (item.type === 'string' && (item.operator === 'in' || item.operator === 'notin') && item.value && item.value.length === 1) {
                itVal = item.value[0].replace(/'/g, '\\');
            }
            const field: string = item.field ? item.field.substring(0) : '';
            switch (item.operator) {
            case 'contains':
                mongoQuery += '"' + field + '":{"$regex":"' + itVal + '"}';
                break;
            case 'notcontains':
                mongoQuery += '"' + field + '":{"$not":{"$regex":"' + item.value + '"}}';
                break;
            case 'startswith':
                mongoQuery += '"' + field + '":{"$regex":"^' + itVal + '"}';
                break;
            case 'notstartswith':
                mongoQuery += '"' + field + '":{"$not":{"$regex":"^' + item.value + '"}}';
                break;
            case 'endswith':
                mongoQuery += '"' + field + '":{"$regex":"' + itVal + '$"}';
                break;
            case 'notendswith':
                mongoQuery += '"' + field + '":{"$not":{"$regex":"' + item.value + '$"}}';
                break;
            case 'isnull':
                mongoQuery += '"' + field + '": null';
                break;
            case 'isnotnull':
                mongoQuery += '"' + field + '":{"$ne": null}';
                break;
            case 'isempty':
                mongoQuery += '"' + field + '": ""';
                break;
            case 'isnotempty':
                mongoQuery += '"' + field + '":{"$ne": ""}';
                break;
            case 'equal':
                if (item.type === 'string') {
                    mongoQuery += '"' + field + '":"' + itVal + '"';
                } else if (item.type === 'date') {
                    mongoQuery += '"' + field + '":"' + item.value + '"';
                } else if (item.type === 'boolean') {
                    mongoQuery += '"' + field + '":' + item.value + '';
                } else {
                    mongoQuery += '"' + field + '":' + item.value + '';
                }
                break;
            case 'notequal':
                if (item.type === 'string') {
                    mongoQuery += '"' + field + '":{"$ne":"' + itVal + '"}';
                } else if (item.type === 'date') {
                    mongoQuery += '"' + field + '":{"$ne":"' + item.value + '"}';
                } else {
                    mongoQuery += '"' + field + '":{"$ne":' + item.value + '}';
                }
                break;
            case 'in':
                if (item.type === 'string') {
                    if (item.value.length > 1) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        let s: any = item.value.map((x: number, j: number) => (j < item.value.length ? `"${x}"` : '')).toString();
                        s = s.endsWith(',') ? s.substring(0, s.length - 1) : s;
                        mongoQuery += '"' + field + '": { "$in": [' + s + ']}';
                    } else {
                        mongoQuery += '"' + field + '": { "$in": ["' + itVal + '"]}';
                    }
                } else if (item.type === 'number') {
                    if (item.value.length > 1) {
                        mongoQuery += '"' + field + '": { "$in": [' + item.value.toString() + ']}';
                    } else {
                        mongoQuery += '"' + field + '": { "$in": [' + item.value + ']}';
                    }
                }
                break;
            case 'notin':
                if (item.type === 'string') {
                    if (item.value.length > 1) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        let s: any = item.value.map((x: number, j: number) => (j < item.value.length ? `"${x}"` : '')).toString();
                        s = s.endsWith(',') ? s.substring(0, s.length - 1) : s;
                        mongoQuery += '"' + field + '": { "$nin": [' + s + ']}';
                    } else {
                        mongoQuery += '"' + field + '": { "$nin": ["' + itVal + '"]}';
                    }
                } else if (item.type === 'number') {
                    if (item.value.length > 1) {
                        mongoQuery += '"' + field + '": { "$nin": [' + item.value.toString() + ']}';
                    } else {
                        mongoQuery += '"' + field + '": { "$nin": [' + item.value + ']}';
                    }
                }
                break;
            case 'greaterthan':
                if (item.type === 'number') {
                    mongoQuery += '"' + field + '": { "$gt": ' + item.value + '}';
                } else {
                    mongoQuery += '"' + field + '": { "$gt": "' + item.value + '"}';
                }
                break;
            case 'greaterthanorequal':
                if (item.type === 'number') {
                    mongoQuery += '"' + field + '": { "$gte": ' + item.value + '}';
                } else {
                    mongoQuery += '"' + field + '": { "$gte": "' + item.value + '"}';
                }
                break;
            case 'between':
                if (item.type === 'number') {
                    mongoQuery += '"' + field + '": {"$gte":' + item.value[0] + ', "$lte":' + item.value[1] + '}';
                } else {
                    mongoQuery += '"' + field + '": {"$gte": "' + item.value[0] + '", "$lte": "' + item.value[1] + '"}';
                }
                break;
            case 'notbetween':
                if (item.type === 'number') {
                    mongoQuery += '"$or":[{"' + field + '": {"$lt":' + item.value[0] + '}}, {"' + field + '": {"$gt":' + item.value[1] + '}}]';
                } else {
                    mongoQuery += '"$or":[{"' + field + '": {"$lt": "' + item.value[0] + '"}}, {"' + field + '": {"$gt": "' + item.value[1] + '"}}]';
                }
                break;
            case 'lessthan':
                if (item.type === 'number') {
                    mongoQuery += '"' + field + '": { "$lt": ' + item.value + '}';
                } else {
                    mongoQuery += '"' + field + '": { "$lt": "' + item.value + '"}';
                }
                break;
            case 'lessthanorequal':
                if (item.type === 'number') {
                    mongoQuery += '"' + field + '": { "$lte": ' + item.value + '}';
                } else {
                    mongoQuery += '"' + field + '": { "$lte": "' + item.value + '"}';
                }
                break;
            }
            mongoQuery += '}';
            if ((rules as string).length !== i) {
                mongoQuery += ',';
            }
        });
        return mongoQuery;
    }

    private mongoParser(mongoQuery: object, rule: RuleModel, mongoLocale: boolean): void {
        let mongoList: string[];
        if (Object.keys(mongoQuery).indexOf('$and') > -1) {
            mongoList = mongoQuery['$and'];
            rule.condition = 'and';
        } else if (Object.keys(mongoQuery).indexOf('$or') > -1) {
            mongoList = mongoQuery['$or'];
            rule.condition = 'or';
        }
        rule.rules = [];
        this.mongoRecursion(mongoList, rule.rules, mongoLocale);
    }

    private mongoRecursion(mongoList: string[], rules: RuleModel[], mongoLocale: boolean): void {
        let operatorValue: string; let type: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let stringValue: any; let key: any; let betweenValue: any;
        let fieldType: string;
        let condition: object[] | string; let value: object; let subRules: RuleModel; let rule: RuleModel; let keyObj: string[];
        let ruleValue: string | number | boolean | string[] | number[];
        for (let i: number = 0, len: number = mongoList.length; i < len; i++) {
            const betweenOperatorArray: string[] | number[] = [];
            let inOperatorArray: string[] | number[] = [];
            condition = Object.keys(mongoList[i as number] as Object)[0];
            value = mongoList[i as number][condition as string];
            if (condition === '$and') {
                if (this.parent.enableNotCondition) {
                    subRules = { condition: condition.replace('$', ''), rules: [], not: false };
                } else {
                    subRules = { condition: condition.replace('$', ''), rules: [] };
                }
                rules.push(subRules);
                this.mongoRecursion(mongoList[i as number][condition as string], rules[rules.length as number - 1].rules, mongoLocale);
            }
            else if (condition === '$or') {
                let notBetween: boolean;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let innerObject: any = []; let keys: any = []; let firstKey: any = []; let secondKey: any = []; let innerKeys: any = [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let firstValue: any = []; let secondValue: any = []; let innerFirstValue: any = []; let innerSecondValue: any = [];
                if (Array.isArray(value) && value.length === 2) {
                    keys = Object.keys(value);
                    innerFirstValue = value[keys[0]];
                    innerSecondValue = value[keys[1]];
                    if (typeof innerFirstValue === 'object') {
                        innerObject = Object.keys(innerFirstValue)[0];
                        innerKeys = Object.keys(innerFirstValue[Object.keys(innerFirstValue)[0]]);
                        firstKey = innerKeys[0];
                        secondKey = Object.keys(innerSecondValue[Object.keys(innerSecondValue)[0]])[0];
                        if (firstKey === '$lt' && secondKey === '$gt') {
                            operatorValue = 'notbetween';
                            // eslint-disable-next-line security/detect-object-injection
                            firstValue = innerFirstValue[innerObject][firstKey];
                            // eslint-disable-next-line security/detect-object-injection
                            secondValue = innerSecondValue[innerObject][secondKey];
                            type = typeof firstValue === 'number' ? 'number' : 'date';
                            ruleValue = [firstValue, secondValue];
                            rule = { field: innerObject, label: innerObject, value: ruleValue, operator: operatorValue, type: type };
                            rules.push(rule);
                            notBetween = true;
                        }
                    }
                }
                if (!notBetween) {
                    if (this.parent.enableNotCondition) {
                        subRules = { condition: condition.replace('$', ''), rules: [], not: false };
                    } else {
                        subRules = { condition: condition.replace('$', ''), rules: [] };
                    }
                    rules.push(subRules);
                    this.mongoRecursion(mongoList[i as number][condition as string], rules[rules.length as number - 1].rules, mongoLocale);
                }
            }
            else {
                value = mongoList[i as number][condition as string];
                if (value === null) { // isnull operator
                    operatorValue = 'isnull';
                }
                if (typeof value === 'boolean') { // boolean type values
                    operatorValue = 'equal';
                    type = 'boolean';
                    ruleValue = value;
                }
                if (typeof (value) === 'number') {
                    ruleValue = value; type = 'number'; operatorValue = 'equal';
                } else if (typeof(value) === 'object' && value !== null) {
                    keyObj = Object.keys(value);
                    for (let i: number = 0; i < keyObj.length; i++) {
                        key = keyObj[i as number];
                        stringValue = (value)[keyObj[i as number]];
                        if (key === '$ne' && isNullOrUndefined(stringValue)) { // not null operator
                            operatorValue = 'isnotnull'; ruleValue = null;
                        }
                        if (key === '$ne' && typeof stringValue === 'boolean') { // not equal operator for boolean
                            operatorValue = 'notequal'; ruleValue = stringValue;
                            type = 'boolean';
                        }
                        if (keyObj.length >= 2 && keyObj[i as number]) {
                            if (typeof (stringValue) == 'object') { // between and notbetween operators
                                operatorValue = 'notbetween';
                                condition = Object.keys(stringValue)[0];
                                betweenValue = [Object.keys(stringValue[condition as string])[0]];
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                (betweenOperatorArray as string[]).push(stringValue[condition as string][betweenValue as any]);
                                type = 'number';
                            } else {
                                operatorValue = 'between';
                                (betweenOperatorArray as string[]).push(stringValue);
                            }
                            if (typeof (stringValue) === 'number') {
                                type = 'number';
                            }
                        } else if (typeof (stringValue) === 'object' && stringValue !== null) { // "in" and "notin" operator
                            if (key === '$not' && Object.keys(stringValue)[0] === '$regex') {
                                if (stringValue['$regex'].indexOf('^') > -1) {
                                    operatorValue = 'notstartswith';
                                    ruleValue = stringValue['$regex'].replace('^', '');
                                } else if (stringValue['$regex'].indexOf('$') > -1) {
                                    operatorValue = 'notendswith';
                                    ruleValue = stringValue['$regex'].replace('$', '');
                                } else {
                                    operatorValue = 'notcontains';
                                    ruleValue = stringValue['$regex'];
                                }
                            } else {
                                operatorValue = key === '$in' ? 'in' : 'notin';
                                inOperatorArray = stringValue;
                                type = typeof(stringValue[0]) === 'number' ? 'number' : 'string';
                            }
                        } else if (typeof (stringValue) === 'number') { // number type values
                            operatorValue = this.getOperatorFromMongoOperator(key);
                            type =  'number'; ruleValue = stringValue;
                        }
                        if (typeof (stringValue) === 'string') { // string type values
                            if (key === '$regex') {
                                operatorValue = 'contains'; ruleValue = stringValue; type = 'string';
                            }
                            if (key === '$ne') { // not equal
                                if (stringValue !== null && stringValue.length > 0 && isNaN(Date.parse(stringValue))) {
                                    operatorValue = 'notequal'; ruleValue = stringValue;
                                } else if (isNullOrUndefined(stringValue)) { // is not null operator
                                    operatorValue = 'isnotnull'; ruleValue = stringValue;
                                } else if (stringValue === '') { // is not empty operator
                                    operatorValue = 'isnotempty'; ruleValue = stringValue;
                                }
                                type = 'string';
                            }
                            if (stringValue.indexOf('^') > -1) {
                                operatorValue = 'startswith'; ruleValue = stringValue.replace('^', ''); type = 'string';
                            }
                            if (stringValue.indexOf('$') > -1 && key !== '$not') {
                                operatorValue = 'endswith';
                                ruleValue = stringValue.replace('$', '');
                                type = 'string';
                            }
                            for (const column of this.parent.columns) {
                                if (column.field === condition) {
                                    fieldType = column.type;
                                    break;
                                }
                            }
                            if (!isNaN(Date.parse(stringValue)) || fieldType === 'date') { // Date type operators
                                operatorValue = operatorValue || this.getOperatorFromMongoOperator(key);
                                type = 'date';
                                ruleValue = stringValue;
                            }
                        }
                    }
                } else if (value && typeof(value) === 'string' && !isNaN(Date.parse(value))) {
                    operatorValue = 'equal';
                    ruleValue = value;
                    type = 'date';
                } else if (typeof (value) === 'string' && value !== '' && value !== 'true' && value !== 'false') {
                    operatorValue = 'equal';
                    ruleValue = value;
                    type = 'string';
                } else if (typeof (value) === 'string' && value === '') {
                    operatorValue = 'isempty';
                    ruleValue = value;
                    type = 'string';
                }
                if (betweenOperatorArray && betweenOperatorArray.length > 1) { // between opertor value
                    rule = { field: condition, label: condition, value: betweenOperatorArray, operator: operatorValue, type: type };
                } else if (inOperatorArray && inOperatorArray.length > 1) { // in operator value
                    rule = { field: condition, label: condition, value: inOperatorArray, operator: operatorValue, type: type };
                } else {
                    rule = { field: condition, label: condition, value: ruleValue, operator: operatorValue, type: type };
                }
                rules.push(rule);
                operatorValue = '';
            }
        }
    }

    private convertParamSqlToSql(sql: ParameterizedSql): string {
        const paramSql: string = sql.sql; const paramValues: object[] = sql.params;
        const parts: string[] = paramSql.split('?');
        let normalSql: string = parts[0];
        for (let i: number = 0; i < paramValues.length; i++) {
            normalSql += (typeof(paramValues[i as number]) === 'string' ? `'${paramValues[i as number]}'` + parts[i + 1] : paramValues[i as number] + parts[i + 1]);
        }
        if (normalSql.length >= 2 && normalSql[0] === '(' && normalSql[normalSql.length - 1] === ')') {
            normalSql = normalSql.slice(1, -1);
        }
        normalSql = normalSql.replace(/!= ''(?! =)/g, 'IS NOT EMPTY').replace(/= ''/g, 'IS EMPTY');
        return normalSql;
    }
    private convertNamedParamSqlToSql(sql: ParameterizedNamedSql): string {
        const namedParamSql: string = sql.sql; const params: Record<string, object> = sql.params;
        let normalSql: string = namedParamSql;
        Object.keys(params).forEach((paramName: string) => {
            const paramValue: object = params[paramName as string];
            paramName = ':' + paramName;
            normalSql = normalSql.replace(paramName, typeof(paramValue) === 'string' ? `'${paramValue}'` : String(paramValue));
        });
        if (normalSql.length >= 2 && normalSql[0] === '(' && normalSql[normalSql.length - 1] === ')') {
            normalSql = normalSql.slice(1, -1);
        }
        normalSql = normalSql.replace(/!= ''(?! =)/g, 'IS NOT EMPTY').replace(/= ''/g, 'IS EMPTY');
        return normalSql;
    }
    private getParameterSql(qbrule: RuleModel): ParameterizedSql {
        const qbRule: RuleModel = extend({}, qbrule, null, true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value: any = this.updateRuleValue(qbRule, false);
        return this.getParameterSQLVal(this.parent.getSqlFromRules(qbRule), value['ruleVal']);
    }
    private getNamedParameterSql(qbrule: RuleModel): ParameterizedNamedSql {
        const qbRule: RuleModel = extend({}, qbrule, null, true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value: any = this.updateRuleValue(qbRule, true);
        return this.getNamedParameterSQLVal(this.parent.getSqlFromRules(qbRule), value['namedRuleVal']);
    }
    private getParameterSQLVal(content: string, ruleValue: object[]): ParameterizedSql {
        const replacedString: string = content.replace(/[%']/g, '');
        return { sql: '(' + replacedString + ')', params: ruleValue };
    }
    private getNamedParameterSQLVal(content: string, ruleValue: Record<string, object>): ParameterizedNamedSql {
        const replacedString: string = content.replace(/[%']/g, '');
        return { sql: '(' + replacedString + ')', params: ruleValue};
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private updateRuleValue(rule: RuleModel, isNamedParameter: boolean): any {
        const ruleVal: object[] = []; const namedRuleVal: Record<string, object> = {};
        const namedParameters: string[] = [];
        return this.updateValue(rule.rules, isNamedParameter, ruleVal, namedRuleVal, namedParameters);
    }
    private updateValue(rules: RuleModel[], isNamedParameter: boolean, ruleVal: object[],
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        namedRuleVal: Record<string, object>, namedParameters: string[]): any {
        if (isNullOrUndefined(rules)) { return {ruleVal, namedRuleVal}; }
        for (let i: number = 0; i < rules.length; i++) {
            if (rules[i as number].rules) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const value: any = this.updateValue(rules[i as number].rules, isNamedParameter, ruleVal, namedRuleVal, namedParameters);
                ruleVal = value['ruleVal']; namedRuleVal = value['namedRuleVal'];
            } else {
                let namedField: string;
                if (rules[i as number].value instanceof Array) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    for (let j: number = 0; j < ((rules[i as number].value) as any).length; j++) {
                        if (isNamedParameter) {
                            namedField = this.getNamedParameter(rules[i as number].field, namedParameters);
                        }
                        if (!isNullOrUndefined(rules[i as number].value[j as number])) {
                            if (rules[i as number].type === 'string' || rules[i as number].type === 'date') {
                                if (isNamedParameter) {
                                    namedRuleVal[namedField as string] = rules[i as number].value[j as number];
                                } else {
                                    ruleVal.push(rules[i as number].value[j as number]);
                                }
                            } else {
                                if (isNamedParameter) {
                                    namedRuleVal[namedField as string] = rules[i as number].value[j as number];
                                } else {
                                    ruleVal.push(rules[i as number].value[j as number]);
                                }
                            }
                        }
                        if (isNamedParameter) {
                            rules[i as number].value[j as number] = ':' + namedField;
                        } else {
                            rules[i as number].value[j as number] = '?';
                        }
                    }
                } else {
                    if (isNamedParameter) {
                        namedField = this.getNamedParameter(rules[i as number].field, namedParameters);
                    }
                    if (rules[i as number].operator.indexOf('null') < 1) {
                        if (rules[i as number].type !== 'string' || (rules[i as number].type === 'string' && (rules[i as number].value !== '' || rules[i as number].value === 0))) {
                            if (rules[i as number].type === 'string' || rules[i as number].type === 'date') {
                                if (rules[i as number].operator.indexOf('empty') < 1) {
                                    let value: string = rules[i as number].value.toString();
                                    switch (rules[i as number].operator) {
                                    case 'startswith':
                                    case 'notstartswith':
                                        value = value + '%';
                                        break;
                                    case 'endswith':
                                    case 'notendswith':
                                        value = '%' + value;
                                        break;
                                    case 'contains':
                                    case 'notcontains':
                                        value = '%' + value + '%';
                                        break;
                                    }
                                    if (isNamedParameter) {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        namedRuleVal[namedField as string] = value as any;
                                    } else {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        ruleVal.push(value as any);
                                    }
                                } else {
                                    if (isNamedParameter) {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        namedRuleVal[namedField as string] = '' as any;
                                    } else {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        ruleVal.push('' as any);
                                    }
                                    if (rules[i as number].operator === 'isempty') {
                                        rules[i as number].operator = 'equal';
                                    } else {
                                        rules[i as number].operator = 'notequal';
                                    }
                                }
                            } else {
                                if (!isNullOrUndefined(rules[i as number].value)) {
                                    if (isNamedParameter) {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        namedRuleVal[namedField as string] = rules[i as number].value as any;
                                    } else {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        ruleVal.push(rules[i as number].value as any);
                                    }
                                }
                            }
                            if (isNamedParameter) {
                                rules[i as number].value = ':' + namedField;
                            } else {
                                rules[i as number].value = '?';
                            }
                        }
                    }
                }
            }
        }
        return {ruleVal, namedRuleVal};
    }
    private getNamedParameter(field: string, namedParameters: string[]): string {
        let newField: string = null;
        if (namedParameters.length > 0) {
            for (let i: number = namedParameters.length - 1; i >= 0; i--) {
                const currField: string = namedParameters[i as number];
                if (currField.indexOf(field) > -1) {
                    const idx: number = parseInt(currField.split('_')[1], 10) + 1;
                    newField = field + '_' + idx;
                    namedParameters.push(newField);
                    break;
                }
            }
        }
        if (!newField) {
            newField = field + '_1';
            namedParameters.push(newField);
        }
        return newField;
    }

    public getModuleName(): string {
        return 'query-library';
    }
}
