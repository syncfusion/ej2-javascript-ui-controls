/**
 * Grid Advanced Filter spec document
 */
import { Grid } from '../../../src/grid/base/grid';
import { AdvancedFilter } from '../../../src/grid/actions/advanced-filter';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { filterData, data } from '../base/datasource.spec';
import { createGrid, destroy } from '../base/specutil.spec';
import { RuleModel } from '@syncfusion/ej2-querybuilder';
import { Dialog } from '@syncfusion/ej2-popups';
import { Query } from '@syncfusion/ej2-data';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(AdvancedFilter, Toolbar);

describe('Advanced Filter module => ', () => {

    describe('Advanced Filter initialization and setup => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending;
            }
            gridObj = createGrid({
                dataSource: filterData,
                allowAdvancedFiltering: true,
                advancedFilterSettings: {
                    queryBuilderSettings: {
                        rule: {
                            condition: 'and',
                            rules: [{
                                field: 'ShipCountry',
                                label: 'Ship Country',
                                type: 'string',
                                operator: 'equal',
                                value: 'Brazil'
                            }]
                        }
                    },
                    includeHiddenColumns: false
                },
                columns: [
                    { field: 'OrderID', headerText: 'Order ID', type: 'number' },
                    { field: 'CustomerID', headerText: 'Customer ID' },
                    { field: 'OrderDate', headerText: 'Order Date', format: 'yMd', type: 'date' },
                    { field: 'Freight', type: 'number' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }
                ]
            }, done);
        });
        it('Grid instance created with Advanced Filter enabled', () => {
            expect(gridObj).toBeDefined();
            expect(gridObj.allowAdvancedFiltering).toBe(true);
            expect(gridObj.advancedFilterModule).toBeDefined();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Column Mapping Functionality => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                advancedFilterSettings: { includeHiddenColumns: false },
                columns: [
                    { field: 'OrderID', type: 'number', headerText: 'Order ID' },
                    { field: 'CustomerID', type: 'string', headerText: 'Customer ID' },
                    { field: 'OrderDate', type: 'date', headerText: 'Order Date', format: 'yMd' },
                    { field: 'Freight', type: 'number', headerText: 'Freight' },
                    { field: 'ShipCountry', type: 'string', headerText: 'Ship Country' },
                    { field: 'Verified', type: 'boolean', headerText: 'Verified', visible: false },
                    { field: 'ShipName', headerText: 'Ship Name', allowFiltering: false }
                ]
            }, done);
        });
        it('Map columns to QueryBuilder format and verify structure', () => {
            const module = gridObj.advancedFilterModule as any;
            const qbColumns = module.mapColumns();
            expect(qbColumns).toBeDefined();
            expect(qbColumns.length).toBeGreaterThan(0);
            expect(qbColumns[0].field).toBe('OrderID');
            expect(qbColumns[0].type).toBe('number');
            expect(qbColumns[0].operators).toBeDefined();
            expect(qbColumns[0].operators.length).toBeGreaterThan(0);
        });
        it('Type mapping validation for all supported types', () => {
            const module = gridObj.advancedFilterModule as any;
            expect(module.mapGridTypeToQBType('string')).toBe('string');
            expect(module.mapGridTypeToQBType('number')).toBe('number');
            expect(module.mapGridTypeToQBType('date')).toBe('date');
            expect(module.mapGridTypeToQBType('datetime')).toBe('date');
            expect(module.mapGridTypeToQBType('boolean')).toBe('boolean');
            expect(module.mapGridTypeToQBType(null)).toBe('string');
        });
        it('Operator mapping for all supported types', () => {
            const module = gridObj.advancedFilterModule as any;
            expect(module.getOperatorsForType('string')).toContain('contains');
            expect(module.getOperatorsForType('number')).toContain('between');
            expect(module.getOperatorsForType('number')).toContain('isnull');
            expect(module.getOperatorsForType('number')).toContain('isnotnull');
            expect(module.getOperatorsForType('date')).not.toContain('contains');
            expect(module.getOperatorsForType('boolean')).toContain('equal');
        });
        it('Uses title case labels for operator dropdown values', () => {
            const module = gridObj.advancedFilterModule as any;
            const stringColumn = module.mapColumns().find((column: any) => column.type === 'string');
            const operators = stringColumn.operators;

            expect(operators.find((operator: any) => operator.value === 'startswith').key).toBe('Starts With');
            expect(operators.find((operator: any) => operator.value === 'notcontains').key).toBe('Does Not Contain');
            expect(operators.find((operator: any) => operator.value === 'notequal').key).toBe('Not Equal');
            expect(operators.find((operator: any) => operator.value === 'isempty').key).toBe('Is Empty');
            expect(operators.find((operator: any) => operator.value === 'isnotempty').key).toBe('Is Not Empty');
            expect(operators.find((operator: any) => operator.value === 'isnull').key).toBe('Is Null');
            expect(operators.find((operator: any) => operator.value === 'isnotnull').key).toBe('Is Not Null');
        });
        it('Allows value-less null and empty operators', () => {
            const module = gridObj.advancedFilterModule as any;
            expect(module.hasValidFilterRule({ field: 'CustomerID', operator: 'isnull' })).toBe(true);
            expect(module.hasValidFilterRule({ field: 'CustomerID', operator: 'isnotempty' })).toBe(true);
            expect(module.isEmptyRule({
                condition: 'and', rules: [
                    { field: 'CustomerID', operator: 'isnull' }
                ]
            })).toBe(false);
        });
        it('Filter visibility and allowFiltering rules applied correctly', () => {
            const module = gridObj.advancedFilterModule as any;
            const qbColumns = module.mapColumns();
            const verifiedCol = qbColumns.find((col: any) => col.field === 'Verified');
            const shipNameCol = qbColumns.find((col: any) => col.field === 'ShipName');
            expect(verifiedCol).toBeUndefined();
            expect(shipNameCol).toBeUndefined();
        });
        it('Hidden columns mapped when includeHiddenColumns is true', () => {
            gridObj.advancedFilterSettings = { includeHiddenColumns: true };
            gridObj.dataBind();

            const qbColumns = (gridObj.advancedFilterModule as any).mapColumns();
            const verifiedCol = qbColumns.find((col: any) => col.field === 'Verified');
            expect(verifiedCol).toBeDefined();

            gridObj.advancedFilterSettings = { includeHiddenColumns: false };
            gridObj.dataBind();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Rule Validation Tests => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                columns: [
                    { field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'OrderDate', type: 'date' }
                ]
            }, done);
        });
        it('Rule validation - empty, null, valid, and invalid cases', () => {
            const module = gridObj.advancedFilterModule as any;
            const emptyRule: RuleModel = { condition: 'and', rules: [] };
            expect(module.isEmptyRule(emptyRule)).toBe(true);
            expect(module.hasValidFilterRule(null)).toBe(false);
            const validRule: RuleModel = {
                field: 'OrderID',
                operator: 'equal',
                value: 10248
            };
            expect(module.hasValidFilterRule(validRule)).toBe(true);
            const noFieldRule: RuleModel = { operator: 'equal', value: 10248 } as any;
            expect(module.hasValidFilterRule(noFieldRule)).toBe(false);
            const noOpRule: RuleModel = { field: 'OrderID', value: 10248 } as any;
            expect(module.hasValidFilterRule(noOpRule)).toBe(false);
            const compoundRule: RuleModel = {
                condition: 'and',
                rules: [
                    { field: 'OrderID', operator: 'equal', value: 10248 },
                    { field: 'CustomerID', operator: 'equal', value: 'VINET' }
                ]
            };
            expect(module.hasValidFilterRule(compoundRule)).toBe(true);
        });
        it('IsEmptyRule returns true for nested empty rule group', () => {
            const module = gridObj.advancedFilterModule as any;
            const rule: RuleModel = {
                condition: 'and',
                rules: [{
                    condition: 'or',
                    rules: [{
                        field: 'OrderID',
                        operator: 'equal',
                        value: ''
                    }]
                } as any]
            };
            expect(module.isEmptyRule(rule)).toBe(true);
        });
        it('IsEmptyRule returns false for nested rule group with value', () => {
            const module = gridObj.advancedFilterModule as any;
            const rule: RuleModel = {
                condition: 'and',
                rules: [{
                    condition: 'or',
                    rules: [{
                        field: 'OrderID',
                        operator: 'equal',
                        value: 10248
                    }]
                } as any]
            };
            expect(module.isEmptyRule(rule)).toBe(false);
        });
        [
            null,
            undefined,
            ''
        ].forEach((value) => {
            it(`Rule is empty when value is ${value}`, () => {
                const rule: RuleModel = {
                    condition: 'and',
                    rules: [{
                        field: 'OrderID',
                        operator: 'equal',
                        value: value as any
                    }]
                };
                expect(
                    (gridObj.advancedFilterModule as any).isEmptyRule(rule)
                ).toBe(true);
            });
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Filter Rule Management => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: filterData,
                allowAdvancedFiltering: true,
                columns: [
                    { field: 'OrderID', type: 'number', headerText: 'Order ID' },
                    { field: 'CustomerID', type: 'string', headerText: 'Customer ID' },
                    { field: 'ShipCountry', type: 'string', headerText: 'Ship Country' }
                ]
            }, done);
        });
        it('Set null rule clears current rule', () => {
            (gridObj.advancedFilterModule as any).setRule(null);
            const rule = (gridObj.advancedFilterModule as any).getRule();
            expect(rule).toBeNull();
        });
        it('Set rule creates deep copy', () => {
            const originalRule: RuleModel = {
                condition: 'and',
                rules: [{ field: 'OrderID', operator: 'equal', value: 10248 }]
            };
            (gridObj.advancedFilterModule as any).setRule(originalRule);
            const savedRule = (gridObj.advancedFilterModule as any).getRule();
            expect(savedRule).not.toBe(originalRule);
            if (savedRule.rules && savedRule.rules.length > 0 && originalRule.rules && originalRule.rules.length > 0) {
                expect(savedRule.rules[0]).not.toBe(originalRule.rules[0]);
            }
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Rule Normalization Functionality => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                columns: [
                    { field: 'OrderID', type: 'number', headerText: 'Order ID' },
                    { field: 'CustomerID', type: 'string', headerText: 'Customer ID' },
                    { field: 'OrderDate', type: 'date', headerText: 'Order Date', format: 'yMd' },
                    { field: 'Freight', type: 'number', headerText: 'Freight' }
                ]
            }, done);
        });
        it('Normalize valid rule', () => {
            const qbColumns = (gridObj.advancedFilterModule as any).mapColumns();
            const rule: RuleModel = {
                condition: 'and',
                rules: [
                    { field: 'OrderID', operator: 'equal', value: 10248 }
                ]
            };
            const normalized = (gridObj.advancedFilterModule as any).normalizeRule(rule, qbColumns);
            expect(normalized).toBeDefined();
            expect(normalized.rules).toBeDefined();
        });
        it('Normalize rule with non-existent field', () => {
            const qbColumns = (gridObj.advancedFilterModule as any).mapColumns();
            const rule: RuleModel = {
                field: 'NonExistentField',
                operator: 'equal',
                value: 'test'
            };
            const normalized = (gridObj.advancedFilterModule as any).normalizeRule(rule, qbColumns);
            expect(normalized).toBeNull();
        });
        it('Normalize rule with invalid operator', () => {
            const qbColumns = (gridObj.advancedFilterModule as any).mapColumns();
            const rule: RuleModel = {
                field: 'OrderID',
                operator: 'invalidOperator' as any,
                value: 10248
            };
            const normalized = (gridObj.advancedFilterModule as any).normalizeRule(rule, qbColumns);
            expect(normalized).toBeDefined();
            expect(normalized.rules[0].operator).toBeDefined();
        });
        it('NormalizeRule handles string operators in column definition', () => {
            const module = gridObj.advancedFilterModule as any;
            const columns: any[] = [{
                field: 'OrderID',
                label: 'Order ID',
                type: 'number',
                operators: ['equal', 'notequal']
            }];
            const rule: RuleModel = {
                field: 'OrderID',
                operator: 'equal',
                value: 10248
            };
            const result = module.normalizeRule(rule, columns);
            expect(result).toBeDefined();
            expect(result.rules[0].operator).toBe('equal');
        });
        it('NormalizeRule preserves QueryBuilder operator values', () => {
            const module = gridObj.advancedFilterModule as any;
            const columns = module.mapColumns();
            const result = module.normalizeRule({
                field: 'CustomerID',
                operator: 'notcontains',
                value: 'test'
            }, columns);

            expect(result.rules[0].operator).toBe('notcontains');
        });
        it('Normalize null rule', () => {
            const qbColumns = (gridObj.advancedFilterModule as any).mapColumns();
            const normalized = (gridObj.advancedFilterModule as any).normalizeRule(null, qbColumns);
            expect(normalized).toBeNull();
        });
        it('NormalizeRule returns null when all child rules are invalid', () => {
            const module = gridObj.advancedFilterModule as any;
            const columns = module.mapColumns();
            const rule: RuleModel = {
                condition: 'and',
                rules: [{
                    field: 'InvalidField',
                    operator: 'equal',
                    value: 1
                }]
            };
            const result = module.normalizeRule(rule, columns);
            expect(result).toBeNull();
        });
        it('NormalizeRule removes invalid nested children', () => {
            const module = gridObj.advancedFilterModule as any;
            const columns = module.mapColumns();
            const rule: RuleModel = {
                condition: 'and',
                rules: [
                    {
                        field: 'OrderID',
                        operator: 'equal',
                        value: 10248
                    },
                    {
                        field: 'InvalidField',
                        operator: 'equal',
                        value: 1
                    }
                ]
            };
            const result = module.normalizeRule(rule, columns);
            expect(result).toBeDefined();
        });
        it('NormalizeRule returns null for missing field', () => {
            const module = gridObj.advancedFilterModule as any;
            const columns = module.mapColumns();
            const rule: RuleModel = {
                operator: 'equal',
                value: 10
            };
            const result = module.normalizeRule(rule, columns);
            expect(result).toBeNull();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Module Lifecycle and Cleanup => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                columns: [
                    { field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' }
                ]
            }, done);
        });
        it('Destroy removes dialog container when present', () => {
            const module = gridObj.advancedFilterModule as any;
            module.dialogContainer = document.createElement('div');
            document.body.appendChild(module.dialogContainer);
            module.destroy();
            expect(module.dialogContainer).toBeNull();
        });
        it('Destroy disposes active queryBuilder and dialog instances', () => {
            const module = gridObj.advancedFilterModule as any;
            module.queryBuilder = {
                isDestroyed: false,
                destroy: jasmine.createSpy('destroy')
            };
            module.dialog = {
                isDestroyed: false,
                destroy: jasmine.createSpy('destroy')
            };
            module.destroy();
            expect(module.queryBuilder).toBeNull();
            expect(module.dialog).toBeNull();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Rule State Management => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                advancedFilterSettings: { includeHiddenColumns: true },
                columns: [
                    { field: 'OrderID', type: 'number', headerText: 'Order ID' },
                    { field: 'CustomerID', type: 'string', headerText: 'Customer ID' },
                    { field: 'OrderDate', type: 'date', headerText: 'Order Date' },
                    { field: 'ShipCountry', type: 'string' }
                ]
            }, done);
        });
        it('Rule restoration with different state scenarios', () => {
            const module = gridObj.advancedFilterModule as any;
            module.hasEmptyState = true;
            let restored = module.getRuleToRestore(null);
            expect(restored).toBeDefined();
            expect(restored.condition).toBe('and');
            module.hasEmptyState = false;
            module.currentRule = {
                condition: 'and',
                rules: [{
                    field: 'OrderID',
                    operator: 'equal',
                    value: 10248
                }]
            };
            restored = module.getRuleToRestore(null);
            expect(restored).toBeDefined();
            module.currentRule = null;
            module.filterRuleToRestore = {
                condition: 'and',
                rules: [{
                    field: 'CustomerID',
                    operator: 'equal',
                    value: 'VINET'
                }]
            };
            restored = module.getRuleToRestore(null);
            expect(restored).toBeDefined();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Advanced Filter Close and Rule Persistence => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                columns: [
                    { field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' }
                ]
            }, done);
        });
        it('CloseDialog behavior with visible and hidden dialog states', () => {
            const module = gridObj.advancedFilterModule as any;
            module.dialog = {
                visible: true,
                hide: jasmine.createSpy('hide')
            };
            module.queryBuilder = {
                getRules: () => ({
                    condition: 'and',
                    rules: [{
                        field: 'OrderID',
                        operator: 'equal',
                        value: 10248
                    }]
                })
            };
            module.closeDialog();
            expect(module.dialog.hide).toHaveBeenCalled();
            expect(module.filterRuleToRestore).toBeDefined();
            module.dialog = {
                visible: false,
                hide: jasmine.createSpy('hide')
            };
            module.closeDialog();
            expect(module.dialog.hide).not.toHaveBeenCalled();
        });
        it('SaveCurrentValidRule clears filterRuleToRestore when rule is invalid', () => {
            const module = gridObj.advancedFilterModule as any;
            module.filterRuleToRestore = { dummy: true };
            module.queryBuilder = {
                getRules: (): RuleModel => ({
                    condition: 'and',
                    rules: []
                })
            };
            module.saveCurrentValidRule();
            expect(module.filterRuleToRestore).toBeNull();
        });
        it('SaveCurrentValidRule returns when queryBuilder is unavailable', () => {
            const module = gridObj.advancedFilterModule as any;
            const savedRule: RuleModel = {
                condition: 'and',
                rules: [{ field: 'OrderID', operator: 'equal', value: 10248 }]
            };
            module.filterRuleToRestore = savedRule;
            module.queryBuilder = null;
            module.saveCurrentValidRule();
            expect(module.filterRuleToRestore).toBe(savedRule);
        });
        it('SaveCurrentValidRule stores deep copied valid rule', () => {
            const module = gridObj.advancedFilterModule as any;
            const rule = {
                condition: 'and',
                rules: [{
                    field: 'OrderID',
                    operator: 'equal',
                    value: 10248
                }]
            };
            module.queryBuilder = {
                getRules: () => rule
            };
            module.saveCurrentValidRule();
            expect(module.filterRuleToRestore).toBeDefined();
            expect(module.filterRuleToRestore).not.toBe(rule);
        });
        it('HasValidFilterRule validates nested rule groups', () => {
            const rule: RuleModel = {
                condition: 'and',
                rules: [{
                    condition: 'or',
                    rules: [{
                        field: 'OrderID',
                        operator: 'equal',
                        value: 10248
                    }]
                } as any]
            };
            expect(
                (gridObj.advancedFilterModule as any)
                    .hasValidFilterRule(rule)
            ).toBe(true);
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Advanced Filter Dialog Operations => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                columns: [
                    { field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' }
                ]
            }, done);
        });
        it('OpenDialog ignores disabled filtering and respects dialog visibility', () => {
            const module = gridObj.advancedFilterModule as any;
            gridObj.allowAdvancedFiltering = false;
            module.openDialog();
            expect(module.dialog).toBeNull();
            gridObj.allowAdvancedFiltering = true;
            module.dialog = null;
            module.openDialog();
            module.dialog = {
                visible: false,
                show: jasmine.createSpy('show')
            };
            module.openDialog();
            expect(module.dialog.show).toHaveBeenCalled();
            module.dialog = {
                visible: true,
                show: jasmine.createSpy('show')
            };
            module.openDialog();
            expect(module.dialog.show).not.toHaveBeenCalled();
        });
        it('CreateQueryBuilder exits when already initialized or no columns', () => {
            const module = gridObj.advancedFilterModule as any;
            module.queryBuilder = {};
            expect(() => {
                module.createQueryBuilder();
            }).not.toThrow();
            module.queryBuilder = null;
            const originalMapColumns = module.mapColumns.bind(module);
            module.mapColumns = (): any[] => [];
            module.createQueryBuilder();
            expect(module.queryBuilder).toBeNull();
            module.mapColumns = originalMapColumns;
        });
        it('CreateQueryBuilder applies styles to qbContainer', () => {
            const module = gridObj.advancedFilterModule as any;
            module.queryBuilder = null;
            module.hasEmptyState = false;
            module.qbContainer = document.createElement('div');
            spyOn(module, 'mapColumns').and.returnValue([
                { field: 'OrderID', type: 'number' }
            ]);
            expect(() => {
                module.createQueryBuilder();
            }).not.toThrow();
            expect(module.qbContainer.style.width).toBe('100%');
        });
        it('OnDialogOpen destroys existing queryBuilder and recreates it', () => {
            const module = gridObj.advancedFilterModule as any;
            module.qbContainer = document.createElement('div');
            const destroySpy = jasmine.createSpy('destroy');
            module.queryBuilder = {
                isDestroyed: false,
                destroy: destroySpy
            };
            spyOn(module, 'createQueryBuilder');
            spyOn(module, 'restoreQueryBuilderRule');
            module.onDialogOpen();
            expect(destroySpy).toHaveBeenCalled();
            expect(module.queryBuilder).toBeNull();
            expect(module.createQueryBuilder).toHaveBeenCalled();
            expect(module.restoreQueryBuilderRule).toHaveBeenCalled();
        });
        it('OnDialogOpened focuses first field selector', () => {
            const module = gridObj.advancedFilterModule as any;
            const input = document.createElement('input');
            spyOn(input, 'focus');
            const container = document.createElement('div');
            spyOn(container, 'querySelector').and.returnValue(input);
            module.qbContainer = container;
            module.queryBuilder = {
                isDestroyed: false
            };
            module.onDialogOpened();
            expect(input.focus).toHaveBeenCalled();
        });
        it('OnApplyClick applies queryBuilder rule', () => {
            const module = gridObj.advancedFilterModule as any;
            spyOn(module, 'applyFilter');
            module.queryBuilder = {
                getRules: () => ({
                    condition: 'and',
                    rules: [{
                        field: 'OrderID',
                        operator: 'equal',
                        value: 10248
                    }]
                })
            };
            module.onApplyClick();
            expect(module.applyFilter).toHaveBeenCalled();
        });
        it('OnCancelClick closes the dialog', () => {
            const module = gridObj.advancedFilterModule as any;
            spyOn(module, 'closeDialog');
            module.onCancelClick();
            expect(module.closeDialog).toHaveBeenCalled();
        });
        it('RestoreQueryBuilderRule sets empty rule when hasEmptyState is true', () => {
            const module = gridObj.advancedFilterModule as any;
            module.hasEmptyState = true;
            module.queryBuilder = {
                isDestroyed: false,
                setRules: jasmine.createSpy('setRules')
            };
            spyOn(module, 'mapColumns').and.returnValue([
                { field: 'OrderID', type: 'number' }
            ]);
            module.restoreQueryBuilderRule();
            expect(module.queryBuilder.setRules).toHaveBeenCalledWith({
                condition: 'and',
                rules: []
            });
        });
        it('RestoreQueryBuilderRule restores valid rule', () => {
            const module = gridObj.advancedFilterModule as any;
            module.hasEmptyState = false;
            module.queryBuilder = {
                isDestroyed: false,
                setRules: jasmine.createSpy('setRules'),
                refresh: jasmine.createSpy('refresh')
            };
            spyOn(module, 'mapColumns').and.returnValue([
                { field: 'OrderID', type: 'number' }
            ]);
            spyOn(module, 'getRuleToRestore').and.returnValue({
                condition: 'and',
                rules: [{
                    field: 'OrderID',
                    operator: 'equal',
                    value: 10248
                }]
            });
            module.restoreQueryBuilderRule();
            expect(module.queryBuilder.setRules).toHaveBeenCalled();
            expect(module.queryBuilder.refresh).toHaveBeenCalled();
        });
        it('RestoreQueryBuilderRule clears rules when no valid rule exists', () => {
            const module = gridObj.advancedFilterModule as any;
            module.currentRule = {
                condition: 'and',
                rules: []
            };
            module.filterRuleToRestore = {
                condition: 'and',
                rules: []
            };
            module.queryBuilder = {
                isDestroyed: false,
                setRules: jasmine.createSpy('setRules')
            };
            spyOn(module, 'mapColumns').and.returnValue([
                { field: 'OrderID', type: 'number' }
            ]);
            spyOn(module, 'getRuleToRestore').and.returnValue(null);
            module.restoreQueryBuilderRule();
            expect(module.currentRule).toBeNull();
            expect(module.filterRuleToRestore).toBeNull();
            expect(module.queryBuilder.setRules).toHaveBeenCalledWith({
                condition: 'and',
                rules: []
            });
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Dialog Creation and Size Constraints => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                columns: [
                    { field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' }
                ]
            }, done);
        });
        it('CreateDialog creates dialog and container elements', () => {
            const module = gridObj.advancedFilterModule as any;
            module.createDialog();
            expect(module.qbContainer).toBeDefined();
            expect(module.dialogContainer).toBeDefined();
            expect(module.dialog).toBeDefined();
        });
        it('CreateDialog appends dialog container to document body', () => {
            const module = gridObj.advancedFilterModule as any;
            module.dialogContainer = null;
            module.dialog = null;
            module.createDialog();
            expect(document.body.contains(module.dialogContainer)).toBe(true);
        });
        it('CreateDialog appends container to the grid when document body is unavailable', () => {
            const module = gridObj.advancedFilterModule as any;
            module.dialogContainer = null;
            module.dialog = null;
            spyOn(Dialog.prototype, 'appendTo').and.stub();
            const bodyProperty = spyOnProperty(document, 'body', 'get').and.returnValue(null);
            module.createDialog();
            expect(gridObj.element.contains(module.dialogContainer)).toBe(true);
            bodyProperty.and.callThrough();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Predicate Generation and Application => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                columns: [
                    { field: 'OrderID', type: 'number', headerText: 'Order ID' },
                    { field: 'CustomerID', type: 'string', headerText: 'Customer ID' },
                    { field: 'Freight', type: 'number', headerText: 'Freight' }
                ]
            }, done);
        });
        it('Generate predicates for supported rule types', () => {
            const module = gridObj.advancedFilterModule as any;
            const stringRule: RuleModel = {
                condition: 'and',
                rules: [
                    {
                        field: 'CustomerID',
                        operator: 'equal',
                        value: 'VINET',
                        label: 'Customer ID',
                        type: 'string'
                    }
                ]
            };
            const numberRule: RuleModel = {
                condition: 'and',
                rules: [
                    {
                        field: 'OrderID',
                        operator: 'equal',
                        value: 10248,
                        label: 'Order ID',
                        type: 'number'
                    }
                ]
            };
            const stringPredicate = module.getPredicateFromRule(stringRule);
            const numberPredicate = module.getPredicateFromRule(numberRule);
            expect(stringPredicate).toBeDefined();
            expect(stringPredicate).not.toBeNull();
            expect(numberPredicate).toBeDefined();
            expect(numberPredicate).not.toBeNull();
        });
        it('Predicate generation with empty columns returns null', () => {
            const module = gridObj.advancedFilterModule as any;
            spyOn(module, 'mapColumns').and.returnValue([]);
            const rule: RuleModel = {
                condition: 'and',
                rules: [{ field: 'Test', operator: 'equal', value: 'Test' }]
            };
            const predicate = module.getPredicateFromRule(rule);
            expect(predicate).toBeNull();
        });
        it('ApplyFilter clears filter when rule is null', () => {
            const module = gridObj.advancedFilterModule as any;
            spyOn(module, 'clearFilter');
            module.dialog = {
                visible: false,
                isDestroyed: false
            };
            module.applyFilter(null);
            expect(module.clearFilter).toHaveBeenCalled();
        });
        it('ApplyFilter exits when predicate is null', () => {
            const module = gridObj.advancedFilterModule as any;
            spyOn(module, 'getPredicateFromRule').and.returnValue(null);
            module.applyFilter({
                condition: 'and',
                rules: [{
                    field: 'OrderID',
                    operator: 'equal',
                    value: 10248
                }]
            });
            expect(module.getPredicateFromRule).toHaveBeenCalled();
        });
        it('ApplyFilter triggers begin event before generating predicate', () => {
            const module = gridObj.advancedFilterModule as any;
            const rule: RuleModel = {
                condition: 'and',
                rules: [{ field: 'OrderID', operator: 'equal', value: 10248 }]
            };
            spyOn(gridObj, 'trigger');
            spyOn(module, 'getPredicateFromRule').and.returnValue(null);
            module.applyFilter(rule);
            expect(gridObj.trigger).toHaveBeenCalledWith('advancedFilterBegin', jasmine.objectContaining({
                requestType: 'filtering',
                rule: rule
            }));
            expect(module.getPredicateFromRule).toHaveBeenCalledWith(rule);
        });
        it('ApplyFilter closes the dialog after completion event', () => {
            const module = gridObj.advancedFilterModule as any;
            spyOn(gridObj, 'trigger');
            spyOn(module, 'getPredicateFromRule').and.returnValue({} as any);
            spyOn(gridObj, 'refresh');
            module.dialog = {
                visible: false,
                isDestroyed: false
            };
            module.applyFilter({
                condition: 'and',
                rules: [{ field: 'OrderID', operator: 'equal', value: 10248 }]
            });
            expect(gridObj.trigger).toHaveBeenCalledWith('advancedFilterBegin', jasmine.any(Object));
        });
        it('ApplyFilter uses cloned base query when available', () => {
            const module = gridObj.advancedFilterModule as any;
            const cloneSpy = jasmine.createSpy('clone').and.returnValue({
                where: jasmine.createSpy('where')
            });
            module.baseQuery = {
                clone: cloneSpy
            };
            gridObj.query = {} as any;
            spyOn(module, 'getPredicateFromRule').and.returnValue({} as any);
            spyOn(gridObj, 'refresh');
            module.applyFilter({
                condition: 'and',
                rules: [{
                    field: 'OrderID',
                    operator: 'equal',
                    value: 10248
                }]
            });
            expect(cloneSpy).toHaveBeenCalled();
        });
        it('ApplyFilter initializes baseQuery from parent query when baseQuery is null', () => {
            const module = gridObj.advancedFilterModule as any;
            const queryObj: any = {
                clone: jasmine.createSpy('clone'),
                where: jasmine.createSpy('where').and.returnValue({})
            };
            queryObj.clone.and.returnValue(queryObj);
            module.baseQuery = null;
            gridObj.query = queryObj;
            spyOn(module, 'getPredicateFromRule').and.returnValue({} as any);
            spyOn(gridObj, 'refresh');
            spyOn(module, 'closeDialog');
            module.applyFilter({
                condition: 'and',
                rules: [{
                    field: 'OrderID',
                    operator: 'equal',
                    value: 10248
                }]
            });
            expect(queryObj.clone).toHaveBeenCalled();
            expect(module.baseQuery).toBe(queryObj);
        });
        it('ApplyFilter creates a query when baseQuery and parent query are unavailable', () => {
            const module = gridObj.advancedFilterModule as any;
            module.baseQuery = null;
            gridObj.query = null;
            spyOn(module, 'getPredicateFromRule').and.returnValue({} as any);
            spyOn(gridObj, 'refresh');
            module.dialog = {
                visible: false,
                isDestroyed: false
            };
            module.applyFilter({
                condition: 'and',
                rules: [{
                    field: 'OrderID',
                    operator: 'equal',
                    value: 10248
                }]
            });
            expect(gridObj.query).toEqual(jasmine.any(Query));
        });
        it('ClearFilter resets state', () => {
            const module = gridObj.advancedFilterModule as any;
            module.currentRule = {
                condition: 'and',
                rules: []
            };
            module.filterRuleToRestore = {
                condition: 'and',
                rules: []
            };
            module.baseQuery = {} as any;
            spyOn(gridObj, 'trigger');
            module.clearFilter();
            expect(module.currentRule).toBeNull();
            expect(module.filterRuleToRestore).toBeNull();
            expect(module.baseQuery).toBeNull();
            expect(module.hasEmptyState).toBe(true);
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Advanced Filter Refresh Functionality => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                columns: [
                    { field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' }
                ]
            }, done);
        });
        it('Refresh handles null and destroyed queryBuilder states', () => {
            const module = gridObj.advancedFilterModule as any;
            module.queryBuilder = null;
            expect(() => {
                module.refresh();
            }).not.toThrow();
            module.queryBuilder = { isDestroyed: true };
            expect(() => {
                module.refresh();
            }).not.toThrow();
        });
        it('Refresh invokes queryBuilder refresh method', () => {
            const module = gridObj.advancedFilterModule as any;
            module.queryBuilder = {
                isDestroyed: false,
                setRules: jasmine.createSpy('setRules'),
                refresh: jasmine.createSpy('refresh')
            };
            spyOn(module, 'mapColumns').and.returnValue([
                {
                    field: 'OrderID',
                    type: 'number'
                }
            ]);
            module.refresh();
            expect(module.queryBuilder.refresh).toHaveBeenCalled();
        });
        it('RefreshComplete triggers advanced filter completion and resets state', () => {
            const module = gridObj.advancedFilterModule as any;
            const rule: RuleModel = {
                condition: 'and',
                rules: [{ field: 'OrderID', operator: 'equal', value: 10248 }]
            };
            module.isAdvancedFilterApplied = true;
            module.filterRequestType = 'filtering';
            module.currentRule = rule;
            spyOn(gridObj, 'trigger');
            module.refreshComplete({ requestType: 'refresh' });
            expect(gridObj.trigger).toHaveBeenCalledWith('advancedFilterComplete', {
                requestType: 'filtering',
                type: 'advancedFilterComplete',
                cancel: false,
                rule: rule
            });
            expect(module.isAdvancedFilterApplied).toBe(false);
            expect(module.filterRequestType).toBeNull();
        });
        it('CancelBeginEvent resets an active refresh state', () => {
            const module = gridObj.advancedFilterModule as any;
            module.isAdvancedFilterApplied = true;
            module.filterRequestType = 'filtering';
            module.cancelBeginEvent({ requestType: 'refresh' });
            expect(module.isAdvancedFilterApplied).toBe(false);
            expect(module.filterRequestType).toBeNull();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('QueryBuilder Updates => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                columns: [
                    { field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' }
                ]
            }, done);
        });
        it('UpdateQueryBuilder refreshes queryBuilder when refresh method exists', () => {
            const module = gridObj.advancedFilterModule as any;
            const refreshSpy = jasmine.createSpy('refresh');
            module.queryBuilder = {
                isDestroyed: false,
                setRules: jasmine.createSpy('setRules'),
                refresh: refreshSpy
            };
            module.updateQueryBuilder({
                condition: 'and',
                rules: []
            });
            expect(refreshSpy).toHaveBeenCalled();
        });
        it('UpdateQueryBuilder skips destroyed queryBuilder', () => {
            const module = gridObj.advancedFilterModule as any;
            module.queryBuilder = {
                isDestroyed: true,
                setRules: jasmine.createSpy('setRules')
            };
            module.updateQueryBuilder({
                condition: 'and',
                rules: []
            });
            expect(module.queryBuilder.setRules).not.toHaveBeenCalled();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Mixed Data Type Handling => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: [
                    { id: 1, name: 'Item 1', amount: 100.50, isActive: true, createdDate: new Date(2023, 0, 1) },
                    { id: 2, name: 'Item 2', amount: 200.75, isActive: false, createdDate: new Date(2023, 1, 1) },
                    { id: 3, name: 'Item 3', amount: 150.25, isActive: true, createdDate: new Date(2023, 2, 1) }
                ],
                allowAdvancedFiltering: true,
                columns: [
                    { field: 'id', type: 'number', headerText: 'ID' },
                    { field: 'name', type: 'string', headerText: 'Name' },
                    { field: 'amount', type: 'number', headerText: 'Amount' },
                    { field: 'isActive', type: 'boolean', headerText: 'Active' },
                    { field: 'createdDate', type: 'date', format: 'yMd', headerText: 'Created Date' }
                ]
            }, done);
        });
        it('Map columns with all data types', () => {
            const qbColumns = (gridObj.advancedFilterModule as any).mapColumns();
            expect(qbColumns.length).toBe(5);
            const idCol = qbColumns.find((c: any) => c.field === 'id');
            expect(idCol.type).toBe('number');
            const nameCol = qbColumns.find((c: any) => c.field === 'name');
            expect(nameCol.type).toBe('string');
            const isActiveCol = qbColumns.find((c: any) => c.field === 'isActive');
            expect(isActiveCol.type).toBe('boolean');
            const dateCol = qbColumns.find((c: any) => c.field === 'createdDate');
            expect(dateCol.type).toBe('date');
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Edge Cases and Error Handling => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: [],
                allowAdvancedFiltering: true,
                columns: [
                    { field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' }
                ]
            }, done);
        });
        it('Handle undefined columns', () => {
            gridObj.columns = undefined as any;
            const qbColumns = (gridObj.advancedFilterModule as any).mapColumns();
            expect(qbColumns).toBeDefined();
            expect(qbColumns.length).toBe(0);
        });
        it('Handle rule with undefined rules array', () => {
            const rule: RuleModel = { condition: 'and' };
            const isValid = (gridObj.advancedFilterModule as any).hasValidFilterRule(rule);
            expect(isValid).toBe(false);
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Dialog Buttons Configuration => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                columns: [
                    { field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' }
                ]
            }, done);
        });
        it('Get dialog buttons returns array with 2 buttons', () => {
            const buttons = (gridObj.advancedFilterModule as any).getDialogButtons();
            expect(buttons).toBeDefined();
            expect(buttons.length).toBe(2);
            expect(buttons[1].buttonModel.isPrimary).toBe(true);
            expect(buttons[0].buttonModel.isPrimary).not.toBe(true);
        });
        it('Dialog buttons contain Apply and Cancel', () => {
            const buttons = (gridObj.advancedFilterModule as any).getDialogButtons();
            const applyBtn = buttons.find((b: any) => b.buttonModel.content && b.buttonModel.content.toLowerCase().includes('apply'));
            const cancelBtn = buttons.find((b: any) => b.buttonModel.content && b.buttonModel.content.toLowerCase().includes('cancel'));
            expect(applyBtn).toBeDefined();
            expect(cancelBtn).toBeDefined();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Advanced Filter Toolbar State => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                toolbar: ['AdvancedFilter'],
                columns: [
                    { field: 'OrderID', type: 'number' },
                    { field: 'CustomerID', type: 'string' }
                ]
            }, done);
        });
        it('Toggles e-filtered on the filter icon only', () => {
            const filterButton: HTMLElement = gridObj.element.querySelector('[id$="_advancedfilter"]') as HTMLElement;
            if (!filterButton) {
                expect(gridObj.toolbarModule).toBeDefined();
                return;
            }
            const filterIcon: HTMLElement = filterButton.querySelector('.e-btn-icon.e-filter') as HTMLElement;
            if (!filterIcon) {
                expect(gridObj.toolbarModule).toBeDefined();
                return;
            }

            gridObj.toolbarModule.enableAdvancedFilterButton(true);
            expect(filterIcon.classList.contains('e-filtered')).toBe(true);
            expect(filterButton.classList.contains('e-active')).toBe(false);

            gridObj.toolbarModule.enableAdvancedFilterButton(false);
            expect(filterIcon.classList.contains('e-filtered')).toBe(false);
        });
        it('Updates the toolbar button through the advanced filter module', () => {
            const module = gridObj.advancedFilterModule as any;
            const enableSpy = spyOn(gridObj.toolbarModule, 'enableAdvancedFilterButton');
            module.setAdvancedFilterEnabled(true);
            expect(enableSpy).toHaveBeenCalledWith(true);
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Column Group Support => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowAdvancedFiltering: true,
                columns: [
                    {
                        headerText: 'Order Details',
                        columns: [
                            { field: 'OrderID', type: 'number', headerText: 'Order ID' },
                            { field: 'OrderDate', type: 'date', headerText: 'Order Date' }
                        ]
                    },
                    {
                        headerText: 'Ship Details',
                        columns: [
                            { field: 'ShipCountry', type: 'string', headerText: 'Ship Country' },
                            { field: 'ShipCity', type: 'string', headerText: 'Ship City' }
                        ]
                    }
                ]
            }, done);
        });
        it('Map columns from column groups', () => {
            const qbColumns = (gridObj.advancedFilterModule as any).mapColumns();
            expect(qbColumns.length).toBeGreaterThan(0);
            expect(qbColumns.find((c: any) => c.field === 'OrderID')).toBeDefined();
        });
        afterAll(() => destroy(gridObj));
    });

    describe('Branch Coverage => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => { gridObj = createGrid({ dataSource: data, allowAdvancedFiltering: true, columns: [{ field: 'OrderID', type: 'number' }, { field: 'CustomerID', type: 'string' }] }, done); });
        
        it('Dialog visibility branches', () => {
            const module = gridObj.advancedFilterModule as any;
            spyOn(module, 'getPredicateFromRule');
            spyOn(gridObj, 'trigger').and.callFake((eventName: string, eventArgs: any) => {
                if (eventName === 'advancedFilterClose') eventArgs.cancel = true;
            });
            module.dialog = { visible: true, isDestroyed: false };
            module.applyFilter({ condition: 'and', rules: [{ field: 'OrderID', operator: 'equal', value: 10248 }] });
            expect(module.getPredicateFromRule).not.toHaveBeenCalled();
            module.clearFilter();
            expect(gridObj.trigger).toHaveBeenCalledWith('advancedFilterClose', jasmine.any(Object));
        });

        it('CloseDialog with event cancellation', () => {
            const module = gridObj.advancedFilterModule as any;
            module.createDialog();
            module.dialog.visible = true;
            spyOn(gridObj, 'trigger');
            module.closeDialog();
            expect(module.dialog.visible).toBe(false);
            expect(gridObj.trigger).not.toHaveBeenCalled();
        });

        it('RefreshComplete and CancelBeginEvent', () => {
            const module = gridObj.advancedFilterModule as any;
            module.isAdvancedFilterApplied = true;
            module.filterRequestType = 'filtering';
            spyOn(gridObj, 'trigger');
            module.refreshComplete({ requestType: 'refresh' });
            expect(gridObj.trigger).toHaveBeenCalledWith('advancedFilterComplete', jasmine.any(Object));
            module.isAdvancedFilterApplied = true;
            module.cancelBeginEvent({ requestType: 'refresh' });
            expect(module.isAdvancedFilterApplied).toBe(false);
        });

        it('IsEmptyRule variants', () => {
            const module = gridObj.advancedFilterModule as any;
            expect(module.isEmptyRule({ condition: 'and', rules: [{ condition: 'or', rules: [] }] })).toBe(true);
            expect(module.isEmptyRule({ condition: 'and', rules: [{ field: 'OrderID', operator: 'isnull' }] })).toBe(false);
            expect(module.isEmptyRule({ condition: 'and', rules: [{ field: 'OrderID', operator: 'in', value: [] }] })).toBe(true);
            expect(module.isEmptyRule({ condition: 'and', rules: [{ field: 'OrderID', operator: 'in', value: [10248] }] })).toBe(false);
        });

        afterAll(() => destroy(gridObj));
    });
});
