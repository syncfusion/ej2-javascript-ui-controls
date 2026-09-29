import { CommonKeyboardInteraction } from '../../src/common/actions/keyboard';
import { PivotCommon } from '../../src/common/base/pivot-common';
import { createElement, removeClass, addClass } from '@syncfusion/ej2-base';
import * as cls from '../../src/common/base/css-constant';
import { Dialog } from '@syncfusion/ej2-popups';

/**
 * Pivot keyboard interaction - branch coverage spec
 */

describe('CommonKeyboardInteraction - Branch Coverage Tests', () => {
    let keyboardInteraction: CommonKeyboardInteraction;
    let pivotCommon: PivotCommon;
    let elem: HTMLElement;

    beforeEach(() => {
        // Create parent element
        elem = createElement('div', { id: 'parent-element', styles: 'height:400px;width:100%;' });
        document.body.appendChild(elem);

        // Create mock PivotCommon parent
        pivotCommon = {
            element: elem,
            moduleName: 'pivotview',
            parentID: 'parent',
            control: null,
            filterDialog: null,
            localeObj: null,
            defaultLocale: null,
            currencyCode: null,
            currencySymbol: null,
            isAdaptive: false
        } as any;

        // Initialize keyboard interaction
        keyboardInteraction = new CommonKeyboardInteraction(pivotCommon);
    });

    afterEach(() => {
        if (keyboardInteraction) {
            keyboardInteraction.destroy();
        }
        if (elem && elem.parentElement) {
            elem.parentElement.removeChild(elem);
        }
    });

    // ========================
    // TEST GROUP: shiftE (processEdit)
    // Uncovered: Lines 33-36 (case 'shiftE' branch)
    // ========================
    describe('shiftE action - processEdit method', () => {
        it('should process shiftE action when target has calc edit icon', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            const calcEdit = createElement('div', { className: cls.CALC_EDIT });
            pivotButton.appendChild(calcEdit);
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                action: 'shiftE',
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            spyOn(calcEdit, 'click');
            (keyboardInteraction as any).processEdit(mockEvent);
            expect(calcEdit.click).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should not process shiftE when target lacks calc edit icon', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                action: 'shiftE',
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            (keyboardInteraction as any).processEdit(mockEvent);
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });

        it('should not process shiftE when target is not a pivot button', () => {
            const nonButton = createElement('div', { className: 'some-other-class' });
            elem.appendChild(nonButton);

            const mockEvent: any = {
                action: 'shiftE',
                target: nonButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            (keyboardInteraction as any).processEdit(mockEvent);
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });
    });

    // ========================
    // TEST GROUP: escape (processClose)
    // Uncovered: Lines 37-39 (case 'escape' branch)
    // ========================
    describe('escape action - processClose method', () => {
        it('should not process escape when target is not in popup', () => {
            const nonPopup = createElement('div', { className: 'some-element' });
            elem.appendChild(nonPopup);

            const mockEvent: any = {
                action: 'escape',
                target: nonPopup,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            (keyboardInteraction as any).processClose(mockEvent);
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });
    });

    // ========================
    // TEST GROUP: upArrow/downArrow (processFilterNodeSelection)
    // Uncovered: Lines 40-42 (case 'upArrow', 'downArrow' branches)
    // ========================
    describe('upArrow/downArrow actions - processFilterNodeSelection method', () => {
        it('should process down arrow on select all element', () => {
            const selectAllContainer = createElement('div', { className: cls.SELECT_ALL_CLASS });
            const treeWrapper = createElement('div', { className: cls.EDITOR_TREE_WRAPPER_CLASS });
            const treeContainer = createElement('div', { className: cls.EDITOR_TREE_CONTAINER_CLASS });
            const listItem = createElement('li');
            
            treeContainer.appendChild(listItem);
            treeWrapper.appendChild(selectAllContainer);
            treeWrapper.appendChild(treeContainer);
            elem.appendChild(treeWrapper);

            const mockEvent: any = {
                action: 'downArrow',
                keyCode: 40,
                target: selectAllContainer,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            (keyboardInteraction as any).processFilterNodeSelection(mockEvent);
            expect(listItem.id).toBe('_active');
            expect(listItem.classList.contains('e-node-focus')).toBe(true);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should process up arrow with navigation logic', () => {
            const selectAllContainer = createElement('div', { className: cls.SELECT_ALL_CLASS });
            const selectAllItem = createElement('li');
            selectAllContainer.appendChild(selectAllItem);
            
            const treeWrapper = createElement('div', { className: cls.EDITOR_TREE_WRAPPER_CLASS });
            const treeContainer = createElement('div', { className: cls.EDITOR_TREE_CONTAINER_CLASS });
            const firstLi = createElement('li');
            firstLi.id = '_active';
            firstLi.classList.add('e-node-focus');
            firstLi.classList.add('e-prev-active-node');
            
            treeContainer.appendChild(firstLi);
            treeWrapper.appendChild(selectAllContainer);
            treeWrapper.appendChild(treeContainer);
            elem.appendChild(treeWrapper);

            const mockEvent: any = {
                action: 'upArrow',
                keyCode: 38,
                target: firstLi,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            (keyboardInteraction as any).processFilterNodeSelection(mockEvent);
            // Test passes when it enters the condition without error
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should handle spinner up arrow click', () => {
            const inputBox = createElement('input', { id: 'parent_inputbox' });
            const parentDiv = createElement('div');
            const spinUp = createElement('div', { className: 'e-spin-up' });
            
            parentDiv.appendChild(inputBox);
            parentDiv.appendChild(spinUp);
            elem.appendChild(parentDiv);

            spyOn(spinUp, 'click');

            const mockEvent: any = {
                action: 'upArrow',
                keyCode: 38,
                target: inputBox,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            (keyboardInteraction as any).processFilterNodeSelection(mockEvent);
            expect(spinUp.click).toHaveBeenCalled();
        });

        it('should handle spinner down arrow click', () => {
            const inputBox = createElement('input', { id: 'parent_inputbox' });
            const parentDiv = createElement('div');
            const spinDown = createElement('div', { className: 'e-spin-down' });
            
            parentDiv.appendChild(inputBox);
            parentDiv.appendChild(spinDown);
            elem.appendChild(parentDiv);

            spyOn(spinDown, 'click');

            const mockEvent: any = {
                action: 'downArrow',
                keyCode: 40,
                target: inputBox,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            (keyboardInteraction as any).processFilterNodeSelection(mockEvent);
            expect(spinDown.click).toHaveBeenCalled();
        });
    });

    // ========================
    // TEST GROUP: altJ (processComponentFocus)
    // Uncovered: Lines 43-44, 47-53 (case 'altJ' branch and processComponentFocus body)
    // ========================
    describe('altJ action - processComponentFocus method', () => {
        it('should focus on parent element with altJ', () => {
            const mockEvent: any = {
                action: 'altJ',
                stopPropagation: jasmine.createSpy('stopPropagation'),
                preventDefault: jasmine.createSpy('preventDefault')
            };

            spyOn(elem, 'focus');

            (keyboardInteraction as any).processComponentFocus(mockEvent);
            expect(elem.focus).toHaveBeenCalled();
            expect(mockEvent.stopPropagation).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });
    });

    // ========================
    // TEST GROUP: processEnter missing else path
    // Uncovered: Line 96 (else path with no matching icon classes)
    // ========================
    describe('enter action - processEnter method else paths', () => {
        it('should process enter with AXISFIELD_ICON_CLASS on VALUE_AXIS', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS + ' ' + cls.VALUE_AXIS_CLASS });
            const axisFieldIcon = createElement('div', { className: cls.AXISFIELD_ICON_CLASS });
            pivotButton.appendChild(axisFieldIcon);
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            spyOn(axisFieldIcon, 'click');
            (keyboardInteraction as any).processEnter(mockEvent);
            expect(axisFieldIcon.click).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should process enter with CALC_EDIT icon', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            const calcEdit = createElement('div', { className: cls.CALC_EDIT });
            pivotButton.appendChild(calcEdit);
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            spyOn(calcEdit, 'click');
            (keyboardInteraction as any).processEnter(mockEvent);
            expect(calcEdit.click).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should process enter with SORT_CLASS on non-VALUE_AXIS', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            const sortIcon = createElement('div', { className: cls.SORT_CLASS });
            pivotButton.appendChild(sortIcon);
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            spyOn(sortIcon, 'click');
            spyOn(pivotButton, 'focus');
            (keyboardInteraction as any).processEnter(mockEvent);
            expect(sortIcon.click).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should process enter with FILTER_COMMON_CLASS on non-VALUE_AXIS', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            const filterIcon = createElement('div', { className: cls.FILTER_COMMON_CLASS });
            pivotButton.appendChild(filterIcon);
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            spyOn(filterIcon, 'click');
            (keyboardInteraction as any).processEnter(mockEvent);
            expect(filterIcon.click).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should handle enter when no action icons found', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            (keyboardInteraction as any).processEnter(mockEvent);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should not process enter on non-pivot-button element', () => {
            const nonButton = createElement('div', { className: 'other-class' });
            elem.appendChild(nonButton);

            const mockEvent: any = {
                target: nonButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            (keyboardInteraction as any).processEnter(mockEvent);
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });
    });

    // ========================
    // TEST GROUP: processSort missing else path
    // Uncovered: Line 104 (else path when conditions not met)
    // ========================
    describe('shiftS action - processSort method else paths', () => {
        it('should process shiftS on non-VALUE_AXIS pivot button with sort icon', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            const sortIcon = createElement('div', { className: cls.SORT_CLASS });
            pivotButton.appendChild(sortIcon);
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                action: 'shiftS',
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            spyOn(sortIcon, 'click');
            (keyboardInteraction as any).processSort(mockEvent);
            expect(sortIcon.click).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should not process shiftS on VALUE_AXIS button', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS + ' ' + cls.VALUE_AXIS_CLASS });
            const sortIcon = createElement('div', { className: cls.SORT_CLASS });
            pivotButton.appendChild(sortIcon);
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                action: 'shiftS',
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            (keyboardInteraction as any).processSort(mockEvent);
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });

        it('should not process shiftS when sort icon is missing', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                action: 'shiftS',
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            (keyboardInteraction as any).processSort(mockEvent);
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });
    });

    // ========================
    // TEST GROUP: processFilter complex conditionals
    // Uncovered: Line 130-131 (branch checking .e-dlg-closeicon-btn)
    // ========================
    describe('shiftF action - processFilter method with dialog handling', () => {
        it('should process shiftF with excel filter dialog closeicon focus', (done) => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS + ' ' + cls.GROUP_ROW_CLASS });
            const filterIcon = createElement('div', { className: cls.FILTER_COMMON_CLASS });
            pivotButton.appendChild(filterIcon);
            elem.appendChild(pivotButton);

            const dialogElement = createElement('div', { className: 'e-popup-open' });
            const closeIconBtn = createElement('div', { className: 'e-dlg-closeicon-btn' });
            dialogElement.appendChild(closeIconBtn);
            elem.appendChild(dialogElement);

            const mockFilterDialog = {
                dialogPopUp: {
                    element: dialogElement,
                    isDestroyed: false
                },
                allowExcelLikeFilter: true
            };

            const mockControl = {
                grid: {},
                showGroupingBar: true,
                groupingBarModule: {}
            };

            pivotCommon.moduleName = 'pivotview';
            pivotCommon.control = mockControl as any;
            pivotCommon.filterDialog = mockFilterDialog as any;
            keyboardInteraction = new CommonKeyboardInteraction(pivotCommon);

            const mockEvent: any = {
                action: 'shiftF',
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            spyOn(filterIcon, 'click');
            spyOn(closeIconBtn, 'focus');

            (keyboardInteraction as any).processFilter(mockEvent);
            expect(filterIcon.click).toHaveBeenCalled();

            setTimeout(() => {
                expect(closeIconBtn.focus).toHaveBeenCalled();
                expect(mockEvent.preventDefault).toHaveBeenCalled();
                keyboardInteraction.destroy();
                done();
            }, 50);
        });

        it('should process shiftF with input focus when no closeicon', (done) => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS + ' ' + cls.GROUP_ROW_CLASS });
            const filterIcon = createElement('div', { className: cls.FILTER_COMMON_CLASS });
            pivotButton.appendChild(filterIcon);
            elem.appendChild(pivotButton);

            const dialogElement = createElement('div', { className: 'e-popup-open' });
            const input = createElement('input');
            dialogElement.appendChild(input);
            elem.appendChild(dialogElement);

            const mockFilterDialog = {
                dialogPopUp: {
                    element: dialogElement,
                    isDestroyed: false
                },
                allowExcelLikeFilter: false
            };

            const mockControl = {
                grid: {},
                showGroupingBar: true,
                groupingBarModule: {}
            };

            pivotCommon.moduleName = 'pivotview';
            pivotCommon.control = mockControl as any;
            pivotCommon.filterDialog = mockFilterDialog as any;
            keyboardInteraction = new CommonKeyboardInteraction(pivotCommon);

            const mockEvent: any = {
                action: 'shiftF',
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            spyOn(filterIcon, 'click');
            spyOn(input, 'focus');

            (keyboardInteraction as any).processFilter(mockEvent);
            expect(filterIcon.click).toHaveBeenCalled();

            setTimeout(() => {
                expect(input.focus).toHaveBeenCalled();
                expect(mockEvent.preventDefault).toHaveBeenCalled();
                keyboardInteraction.destroy();
                done();
            }, 50);
        });

        it('should process shiftF without dialog handling', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            const filterIcon = createElement('div', { className: cls.FILTER_COMMON_CLASS });
            pivotButton.appendChild(filterIcon);
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                action: 'shiftF',
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            spyOn(filterIcon, 'click');
            (keyboardInteraction as any).processFilter(mockEvent);
            expect(filterIcon.click).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should not process shiftF on VALUE_AXIS button', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS + ' ' + cls.VALUE_AXIS_CLASS });
            const filterIcon = createElement('div', { className: cls.FILTER_COMMON_CLASS });
            pivotButton.appendChild(filterIcon);
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                action: 'shiftF',
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            (keyboardInteraction as any).processFilter(mockEvent);
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });
    });

    // ========================
    // TEST GROUP: processDelete
    // Missing specific coverage tests
    // ========================
    describe('delete action - processDelete method', () => {
        it('should process delete on pivot button with remove icon', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            const removeIcon = createElement('div', { className: cls.REMOVE_CLASS });
            pivotButton.appendChild(removeIcon);
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                action: 'delete',
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            spyOn(removeIcon, 'click');
            (keyboardInteraction as any).processDelete(mockEvent);
            expect(removeIcon.click).toHaveBeenCalled();
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });

        it('should not process delete when remove icon is missing', () => {
            const pivotButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            elem.appendChild(pivotButton);

            const mockEvent: any = {
                action: 'delete',
                target: pivotButton,
                preventDefault: jasmine.createSpy('preventDefault')
            };

            (keyboardInteraction as any).processDelete(mockEvent);
            expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        });
    });

    // ========================
    // TEST GROUP: destroy method else path
    // Uncovered: Line 226-228 (else block when keyboardModule is null)
    // ========================
    describe('destroy method - cleanup and edge cases', () => {
        it('should destroy keyboard module and clear timeout', () => {
            const keyboardSpy = spyOn(keyboardInteraction['keyboardModule'], 'destroy');
            keyboardInteraction.destroy();
            expect(keyboardSpy).toHaveBeenCalled();
            expect(keyboardInteraction['keyboardModule']).toBeNull();
        });

        it('should handle destroy when keyboard module is null', () => {
            keyboardInteraction['keyboardModule'] = null;
            expect(() => {
                keyboardInteraction.destroy();
            }).not.toThrow();
        });

        it('should clear timeout before destroying', (done) => {
            keyboardInteraction['timeOutObj'] = setTimeout(() => {
                // This should not execute
                fail('Timeout should have been cleared');
            }, 100);

            keyboardInteraction.destroy();
            expect(keyboardInteraction['timeOutObj']).toBeNull();

            setTimeout(() => {
                done();
            }, 150);
        });
    });

    // ========================
    // TEST GROUP: getButtonElement utility
    // ========================
    describe('getButtonElement utility method', () => {
        it('should find button by data-uid attribute', () => {
            const button1 = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            button1.setAttribute('data-uid', 'uid-1');
            const button2 = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            button2.setAttribute('data-uid', 'uid-2');
            
            elem.appendChild(button1);
            elem.appendChild(button2);

            const result = (keyboardInteraction as any).getButtonElement(button2);
            expect(result).toBe(button2);
        });

        it('should return target when button not found', () => {
            const button = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            button.setAttribute('data-uid', 'uid-1');
            elem.appendChild(button);

            const orphanButton = createElement('div', { className: cls.PIVOT_BUTTON_CLASS });
            orphanButton.setAttribute('data-uid', 'uid-missing');

            const result = (keyboardInteraction as any).getButtonElement(orphanButton);
            expect(result).toBe(orphanButton);
        });
    });
});
