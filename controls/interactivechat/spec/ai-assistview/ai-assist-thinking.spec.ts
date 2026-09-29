import { createElement } from '@syncfusion/ej2-base';
import { AssistThinking } from '../../src/ai-assist-base/ai-assist-thinking';
import { AIAssistBase } from '../../src/ai-assist-base/ai-assist-base';
import { ThinkingBlock, ThinkingContextBadge, ThinkingStageStatus } from '../../src/ai-assistview/interface';
import { AIAssistView, EditableContextClickedEventArgs } from '../../src/ai-assistview/index';
AIAssistView.Inject(AssistThinking);
describe('AssistThinking - Thinking Support -', () => {
    let aiAssistView: AIAssistView;
    let aiAssistViewElem: HTMLElement;
    let responseWrapper: HTMLElement;

    beforeEach(() => {
        aiAssistViewElem = createElement('div', { id: 'aiAssistViewTest' });
        document.body.appendChild(aiAssistViewElem);
        aiAssistView = new AIAssistView({});
        aiAssistView.appendTo(aiAssistViewElem);
        
        responseWrapper = createElement('div', { id: 'responseWrapper' });
        document.body.appendChild(responseWrapper);
    });

    afterEach(() => {
        if (aiAssistView) {
            aiAssistView.destroy();
        }
        if (aiAssistViewElem.parentElement) {
            aiAssistViewElem.parentElement.removeChild(aiAssistViewElem);
        }
        if (responseWrapper.parentElement) {
            responseWrapper.parentElement.removeChild(responseWrapper);
        }
    });

    // ===== Spinner Tests (isActive combinations) =====
    describe('Spinner Lifecycle -', () => {
        it('should render spinner when isActive is true', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-spn-1',
                        title: 'Thinking...',
                        isActive: true,
                        collapsed: true,
                        stages: []
                    }
                ]
            }, true);
            setTimeout(() => {
                const spinner = aiAssistViewElem.querySelector('.e-active-spinner');
                expect(spinner).not.toBeNull();
                expect(spinner.classList.contains('e-active-spinner')).toBeTruthy();
                done();
            }, 50);
        });

        it('should NOT render spinner when isActive is false', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-spn-2',
                        title: 'Finished',
                        isActive: false,
                        stages: []
                    }
                ]
            }, true);
            setTimeout(() => {
                const spinner = aiAssistViewElem.querySelector('.e-active-spinner');
                expect(spinner).toBeNull();
                const checkIcon = aiAssistViewElem.querySelector('.e-check');
                expect(checkIcon).not.toBeNull();
                done();
            }, 50);
        });

        it('should render multiple thinking blocks with spinners', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Multi thinking',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-spn-3a',
                        title: 'Active Thinking 1',
                        isActive: true,
                        stages: []
                    },
                    {
                        blockType: 'thinking',
                        id: 'block-spn-3b',
                        title: 'Active Thinking 2',
                        isActive: true,
                        stages: []
                    }
                ]
            }, true);
            setTimeout(() => {
                const spinners = aiAssistViewElem.querySelectorAll('.e-active-spinner');
                expect(spinners.length).toBe(2);
                done();
            }, 50);
        });

        it('should remove spinners on component destroy', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-spn-4',
                        title: 'Active Thinking',
                        isActive: true,
                        stages: []
                    }
                ]
            }, true);
            setTimeout(() => {
                const spinnerBefore = aiAssistViewElem.querySelector('.e-active-spinner');
                expect(spinnerBefore).not.toBeNull();
                aiAssistView.destroy();
                const spinnerAfter = aiAssistViewElem.querySelector('.e-active-spinner');
                expect(spinnerAfter).toBeNull();
                done();
            }, 50);
        });

        it('should handle transition from isActive true to false', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test 1',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-spn-trans-1',
                        title: 'Active Thinking',
                        isActive: true,
                        stages: [{ content: 'Still processing' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                let spinner = aiAssistViewElem.querySelector('.e-active-spinner');
                expect(spinner).not.toBeNull();
                
                aiAssistView.addPromptResponse({
                    prompt: 'Test 2',
                    blocks: [
                        {
                            blockType: 'thinking',
                            id: 'block-spn-trans-2',
                            title: 'Finished',
                            isActive: false,
                            stages: [{ content: 'Completed' } as any]
                        }
                    ]
                }, true);
                
                setTimeout(() => {
                    const finishedBlock = aiAssistViewElem.querySelector('.e-thinking-finished');
                    expect(finishedBlock).not.toBeNull();
                    done();
                }, 50);
            }, 50);
        });

        it('should render spinner with title text', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-spn-title',
                        title: 'Analyzing Your Query',
                        isActive: true,
                        stages: []
                    }
                ]
            }, true);
            setTimeout(() => {
                const titleText = aiAssistViewElem.querySelector('.e-toggle-text');
                expect(titleText).not.toBeNull();
                expect(titleText.innerHTML).toBe('Analyzing Your Query');
                done();
            }, 50);
        });

        it('should stack multiple active spinners independently', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Multi spinning',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-spn-stack-1',
                        title: 'Task 1',
                        isActive: true,
                        stages: []
                    },
                    {
                        blockType: 'thinking',
                        id: 'block-spn-stack-2',
                        title: 'Task 2',
                        isActive: true,
                        stages: []
                    },
                    {
                        blockType: 'thinking',
                        id: 'block-spn-stack-3',
                        title: 'Task 3',
                        isActive: false,
                        stages: []
                    }
                ]
            }, true);
            setTimeout(() => {
                const spinners = aiAssistViewElem.querySelectorAll('.e-active-spinner');
                expect(spinners.length).toBe(2);
                const finished = aiAssistViewElem.querySelector('.e-thinking-finished');
                expect(finished).not.toBeNull();
                done();
            }, 50);
        });
    });

    // ===== Collapsed State Tests =====
    describe('Collapsed State -', () => {
        it('should default to collapsed (true) when collapsed property is undefined', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-coll-1',
                        title: 'Default Collapsed',
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const contentWrapper = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(contentWrapper.classList.contains('e-timeline-collapsed')).toBeTruthy();
                done();
            }, 50);
        });

        it('should use collapsed=true when explicitly set', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-coll-2',
                        title: 'Explicit Collapsed',
                        collapsed: true,
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const contentWrapper = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(contentWrapper.classList.contains('e-timeline-collapsed')).toBeTruthy();
                done();
            }, 50);
        });

        it('should use collapsed=false when explicitly set (starts expanded)', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-coll-3',
                        title: 'Explicit Expanded',
                        collapsed: false,
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const contentWrapper = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(contentWrapper.classList.contains('e-timeline-expanded')).toBeTruthy();
                done();
            }, 50);
        });
    });

    // ===== Toggle Collapse Tests =====
    describe('Toggle Collapse -', () => {
        it('should toggle from collapsed to expanded on button click', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-toggle-1',
                        title: 'Toggle Test',
                        collapsible: true,
                        stages: [{ content: 'Stage 1' } as any, { content: 'Stage 2' } as any],
                        collapsed: true
                    }
                ]
            }, true);
            setTimeout(() => {
                let contentWrapper = aiAssistViewElem.querySelector('.e-aiassist-thinking-timeline');
                expect(contentWrapper.classList.contains('e-timeline-collapsed')).toBeTruthy();
                const toggleBtn = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle');
                toggleBtn.dispatchEvent(new Event('click'));
                setTimeout(() => {
                    contentWrapper = aiAssistViewElem.querySelector('.e-aiassist-thinking-timeline');
                    expect(contentWrapper.classList.contains('e-timeline-expanded')).toBeTruthy();
                    done();
                }, 50);
            }, 50);
        });

        it('should toggle from expanded to collapsed on button click', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-toggle-2',
                        title: 'Toggle Test',
                        collapsible: true,
                        stages: [{ content: 'Stage 1' } as any],
                        collapsed: false
                    }
                ]
            }, true);
            setTimeout(() => {
                let contentWrapper = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(contentWrapper.classList.contains('e-timeline-expanded')).toBeTruthy();
                const toggleBtn = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle');
                toggleBtn.dispatchEvent(new Event('click'));
                setTimeout(() => {
                    contentWrapper = aiAssistViewElem.querySelector('.e-single-stage-container');
                    expect(contentWrapper.classList.contains('e-timeline-collapsed')).toBeTruthy();
                    done();
                }, 50);
            }, 50);
        });

        it('should update chevron icon on toggle', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-toggle-3',
                        title: 'Icon Toggle',
                        collapsed: true,
                        collapsible: true,
                        stages: [{ content: 'Stage 1' } as any, { content: 'Stage 2' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                let chevron = aiAssistViewElem.querySelector('.e-toggle-icon');
                expect(chevron.classList.contains('e-chevron-right')).toBeTruthy();
                const toggleBtn = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle');
                toggleBtn.dispatchEvent(new Event('click'));
                setTimeout(() => {
                    chevron = aiAssistViewElem.querySelector('.e-toggle-icon');
                    expect(chevron.classList.contains('e-chevron-down')).toBeTruthy();
                    done();
                }, 50);
            }, 50);
        });

        it('should toggle multiple times between states', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-toggle-multi',
                        title: 'Multi Toggle',
                        collapsible: true,
                        collapsed: true,
                        stages: [{ content: 'Stage 1' } as any, { content: 'Stage 2' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const toggleBtn = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle');
                let contentWrapper = aiAssistViewElem.querySelector('.e-aiassist-thinking-timeline');
                
                expect(contentWrapper.classList.contains('e-timeline-collapsed')).toBeTruthy();
                
                toggleBtn.dispatchEvent(new Event('click'));
                setTimeout(() => {
                    contentWrapper = aiAssistViewElem.querySelector('.e-aiassist-thinking-timeline');
                    expect(contentWrapper.classList.contains('e-timeline-expanded')).toBeTruthy();
                    
                    toggleBtn.dispatchEvent(new Event('click'));
                    setTimeout(() => {
                        contentWrapper = aiAssistViewElem.querySelector('.e-aiassist-thinking-timeline');
                        expect(contentWrapper.classList.contains('e-timeline-collapsed')).toBeTruthy();
                        done();
                    }, 50);
                }, 50);
            }, 50);
        });

        it('should not toggle when collapsible is false', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-toggle-disabled',
                        title: 'Non Collapsible',
                        collapsible: false,
                        collapsed: true,
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const toggleBtn: HTMLButtonElement | null = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle');
                expect(toggleBtn.disabled).toBeTruthy();
                const initialState = aiAssistViewElem.querySelector('.e-single-stage-container').classList.contains('e-timeline-collapsed');
                toggleBtn.dispatchEvent(new Event('click'));
                setTimeout(() => {
                    const finalState = aiAssistViewElem.querySelector('.e-single-stage-container').classList.contains('e-timeline-collapsed');
                    expect(initialState).toBe(finalState);
                    done();
                }, 50);
            }, 50);
        });

        it('should update aria-expanded on toggle', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-toggle-aria',
                        title: 'Aria Test',
                        collapsible: true,
                        collapsed: true,
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const toggleBtn = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle');
                expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');
                toggleBtn.dispatchEvent(new Event('click'));
                setTimeout(() => {
                    expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
                    done();
                }, 50);
            }, 50);
        });
    });

    // ===== Single Stage Tests =====
    describe('Single Stage Rendering -', () => {
        it('should render single stage without Timeline component', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-single-1',
                        title: 'Single Stage',
                        stages: [{ content: 'Single stage content', status: ThinkingStageStatus.Completed } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const timelineWrapper = aiAssistViewElem.querySelector('.e-aiassist-thinking-timeline');
                expect(timelineWrapper).toBeNull();
                const singleStage = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(singleStage).not.toBeNull();
                done();
            }, 50);
        });

        it('should render single stage with collapsed class', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-single-2',
                        title: 'Single Collapsed',
                        collapsed: true,
                        stages: [{ content: 'Stage content' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const singleStage = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(singleStage.classList.contains('e-timeline-collapsed')).toBeTruthy();
                done();
            }, 50);
        });

        it('should render single stage with expanded class', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-single-3',
                        title: 'Single Expanded',
                        collapsed: false,
                        stages: [{ content: 'Stage content' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const singleStage = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(singleStage.classList.contains('e-timeline-expanded')).toBeTruthy();
                done();
            }, 50);
        });

        it('should render single stage with custom iconCss', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-single-4',
                        title: 'Single with Icon',
                        stages: [{ content: 'Processing...', status: ThinkingStageStatus.InProgress, iconCss: 'e-icons e-loading' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const singleStage = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(singleStage).not.toBeNull();
                const icon = singleStage.querySelector('.e-stage-icon');
                expect(icon).not.toBeNull();
                expect(icon.classList.contains('e-loading')).toBeTruthy();
                done();
            }, 50);
        });

        it('should render single stage with status class', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-single-5',
                        title: 'Completed Task',
                        stages: [{ content: 'Task finished', status: ThinkingStageStatus.Completed, iconCss: 'e-icons e-check' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const singleStage = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(singleStage).not.toBeNull();
                expect(singleStage.classList.contains('e-stage-completed')).toBeTruthy();
                const icon = singleStage.querySelector('.e-stage-icon');
                expect(icon).not.toBeNull();
                expect(icon.classList.contains('e-check')).toBeTruthy();
                done();
            }, 50);
        });

        it('should render single stage with InProgress status', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-single-progress',
                        title: 'In Progress Task',
                        stages: [{ content: 'Processing...', status: ThinkingStageStatus.InProgress, iconCss: 'e-icons e-loading' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const singleStage = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(singleStage).not.toBeNull();
                expect(singleStage.classList.contains('e-stage-inProgress')).toBeTruthy();
                done();
            }, 50);
        });

        it('should render single stage with Failed status', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-single-failed',
                        title: 'Failed Task',
                        stages: [{ content: 'Operation failed', status: ThinkingStageStatus.Failed, iconCss: 'e-icons e-error-treeview' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const singleStage = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(singleStage).not.toBeNull();
                expect(singleStage.classList.contains('e-stage-failed')).toBeTruthy();
                done();
            }, 50);
        });

        it('should render single stage without status (default)', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-single-no-status',
                        title: 'No Status',
                        stages: [{ content: 'Default stage' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const singleStage = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(singleStage).not.toBeNull();
                done();
            }, 50);
        });

        it('should render single stage with empty content', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-single-empty',
                        title: 'Empty Content',
                        stages: [{ content: '' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const singleStage = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(singleStage).not.toBeNull();
                done();
            }, 50);
        });

        it('should toggle single stage between collapsed/expanded', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-single-toggle',
                        title: 'Toggle Single',
                        collapsible: true,
                        collapsed: true,
                        stages: [{ content: 'Stage content' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                let container = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(container.classList.contains('e-timeline-collapsed')).toBeTruthy();
                const toggleBtn = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle');
                toggleBtn.dispatchEvent(new Event('click'));
                setTimeout(() => {
                    container = aiAssistViewElem.querySelector('.e-single-stage-container');
                    expect(container.classList.contains('e-timeline-expanded')).toBeTruthy();
                    done();
                }, 50);
            }, 50);
        });

        it('should convert markdown response to HTML during streaming with thinking block (bold, italic)', function (done) {
            aiAssistView.enableStreaming = true;
            const markdownResponse = '**bold** and *italic*.';
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-md-stream-1',
                        title: 'Analyzing...',
                        isActive: false,
                        stages: [{ content: 'Stage content' }]
                    }
                ]
            }, false);
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-md-stream-1',
                        title: 'Analyzing...',
                        isActive: false,
                        stages: [{ content: 'Stage content' }]
                    }
                ],
                response: markdownResponse
            }, true);
            setTimeout(function () {
                const thinkingBlock = aiAssistViewElem.querySelector('.e-aiassist-thinking-header');
                expect(thinkingBlock).not.toBeNull();
                const contentBody = aiAssistViewElem.querySelector('.e-content-body');
                expect(contentBody).not.toBeNull();
                expect(contentBody.innerHTML).toContain('<strong>bold</strong>');
                expect(contentBody.innerHTML).toContain('<em>italic</em>');
                done();
            }, 200);
        });

        it('should convert markdown response lists to HTML during streaming with thinking block', function (done) {
            aiAssistView.enableStreaming = true;
            const markdownResponse = '- Key point 1\n- Key point 2\n- Key point 3';
            aiAssistView.addPromptResponse({
                prompt: 'List test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-md-stream-list',
                        title: 'Processing...',
                        isActive: false,
                        stages: [{ content: 'Compiling information' }]
                    }
                ]
            }, false);
            aiAssistView.addPromptResponse({
                prompt: 'List test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-md-stream-list',
                        title: 'Processing...',
                        isActive: false,
                        stages: [{ content: 'Compiling information' }]
                    }
                ],
                response: markdownResponse
            }, true);
            setTimeout(function () {
                const thinkingBlock = aiAssistViewElem.querySelector('.e-aiassist-thinking-header');
                expect(thinkingBlock).not.toBeNull();
                const contentBody = aiAssistViewElem.querySelector('.e-content-body');
                expect(contentBody).not.toBeNull();
                expect(contentBody.innerHTML).toContain('<ul>');
                expect(contentBody.innerHTML).toContain('<li>Key point 1</li>');
                expect(contentBody.innerHTML).toContain('<li>Key point 2</li>');
                expect(contentBody.innerHTML).toContain('<li>Key point 3</li>');
                done();
            }, 200);
        });
    });

    // ===== Multi-Stage (Timeline) Tests =====
    describe('Multi-Stage Timeline Rendering -', () => {
        it('should use Timeline component for 2+ stages', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-1',
                        title: 'Multi Stage',
                        stages: [
                            { content: 'Stage 1' } as any,
                            { content: 'Stage 2' } as any
                        ]
                    }
                ]
            }, true);
            setTimeout(() => {
                const timelineWrapper = aiAssistViewElem.querySelector('.e-aiassist-thinking-timeline');
                expect(timelineWrapper).not.toBeNull();
                const timelineComponent = aiAssistViewElem.querySelector('.e-timeline-wrapper');
                expect(timelineComponent).not.toBeNull();
                done();
            }, 50);
        });

        it('should render multiple timeline stages', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-2',
                        title: 'Multi Stage',
                        collapsible: true,
                        stages: [
                            { content: 'Stage 1' } as any,
                            { content: 'Stage 2' } as any,
                            { content: 'Stage 3' } as any
                        ]
                    }
                ]
            }, true);
            setTimeout(() => {
                const stages = aiAssistViewElem.querySelectorAll('.e-thinking-timeline-item-container');
                expect(stages.length).toBeGreaterThan(0);
                done();
            }, 50);
        });

        it('should render stages with different statuses', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-4',
                        title: 'Multi Stage',
                        collapsible: true,
                        stages: [
                            { content: 'Completed', status: ThinkingStageStatus.Completed, iconCss: 'e-icons e-check' } as any,
                            { content: 'In Progress', status: ThinkingStageStatus.InProgress, iconCss: 'e-icons e-loading' } as any,
                            { content: 'Error', status: ThinkingStageStatus.Failed, iconCss: 'e-icons e-error-treeview' } as any
                        ]
                    }
                ]
            }, true);
            setTimeout(() => {
                const items = aiAssistViewElem.querySelectorAll('.e-thinking-timeline-item-container');
                expect(items.length).toBe(3);
                done();
            }, 50);
        });

        it('should render stage with custom iconCss', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-5',
                        title: 'Custom Icon Stage',
                        stages: [
                            { content: 'Stage with icon', status: ThinkingStageStatus.Completed, iconCss: 'e-icons e-check-box' } as any,
                            { content: 'Another stage', status: ThinkingStageStatus.InProgress, iconCss: 'e-icons e-settings' } as any
                        ]
                    }
                ]
            }, true);
            setTimeout(() => {
                const timelineItems = aiAssistViewElem.querySelectorAll('.e-thinking-timeline-item-container');
                expect(timelineItems.length).toBe(2);
                timelineItems.forEach((item) => {
                    const dotIcon = item.querySelector('.indicator');
                    expect(dotIcon).not.toBeNull();
                });
                done();
            }, 50);
        });

        it('should handle Failed status stage rendering', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-6',
                        title: 'Failed Stage Test',
                        stages: [
                            { content: 'Task completed', status: ThinkingStageStatus.Completed } as any,
                            { content: 'Task failed', status: ThinkingStageStatus.Failed } as any
                        ]
                    }
                ]
            }, true);
            setTimeout(() => {
                const items = aiAssistViewElem.querySelectorAll('.e-thinking-timeline-item-container');
                expect(items.length).toBe(2);
                done();
            }, 50);
        });

        it('should cleanup timeline on component destroy', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-3',
                        title: 'Multi Stage',
                        stages: [
                            { content: 'Stage 1' } as any,
                            { content: 'Stage 2' } as any
                        ]
                    }
                ]
            }, true);
            setTimeout(() => {
                const timelineBefore = aiAssistViewElem.querySelector('.e-aiassist-thinking-timeline');
                expect(timelineBefore).not.toBeNull();
                aiAssistView.destroy();
                const timelineAfter = aiAssistViewElem.querySelector('.e-aiassist-thinking-timeline');
                expect(timelineAfter).toBeNull();
                done();
            }, 50);
        });

        it('should handle 4+ stages in timeline', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-many',
                        title: 'Many Stages',
                        stages: [
                            { content: 'Stage 1' } as any,
                            { content: 'Stage 2' } as any,
                            { content: 'Stage 3' } as any,
                            { content: 'Stage 4' } as any,
                            { content: 'Stage 5' } as any
                        ]
                    }
                ]
            }, true);
            setTimeout(() => {
                const stages = aiAssistViewElem.querySelectorAll('.e-thinking-timeline-item-container');
                expect(stages.length).toBe(5);
                done();
            }, 50);
        });

        it('should render stages without iconCss (default icons)', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-default-icons',
                        title: 'Default Icons',
                        stages: [
                            { content: 'Stage 1', status: ThinkingStageStatus.Completed } as any,
                            { content: 'Stage 2', status: ThinkingStageStatus.InProgress } as any
                        ]
                    }
                ]
            }, true);
            setTimeout(() => {
                const stages = aiAssistViewElem.querySelectorAll('.e-thinking-timeline-item-container');
                expect(stages.length).toBe(2);
                const indicators = aiAssistViewElem.querySelectorAll('.indicator');
                expect(indicators.length).toBeGreaterThanOrEqual(2);
                done();
            }, 50);
        });

        it('should render mixed status stages (Completed, InProgress, Failed)', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-mixed-status',
                        title: 'Mixed Status',
                        stages: [
                            { content: 'Done', status: ThinkingStageStatus.Completed } as any,
                            { content: 'Running', status: ThinkingStageStatus.InProgress } as any,
                            { content: 'Failed', status: ThinkingStageStatus.Failed } as any,
                            { content: 'Done', status: ThinkingStageStatus.Completed } as any
                        ]
                    }
                ]
            }, true);
            setTimeout(() => {
                const stages = aiAssistViewElem.querySelectorAll('.e-thinking-timeline-item-container');
                expect(stages.length).toBe(4);
                done();
            }, 50);
        });

        it('should handle stage content with HTML entities', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-html-entities',
                        title: 'HTML Entities',
                        stages: [
                            { content: 'Stage 1: Testing &lt;div&gt; content' } as any,
                            { content: 'Stage 2: &amp; symbol test' } as any
                        ]
                    }
                ]
            }, true);
            setTimeout(() => {
                const stages = aiAssistViewElem.querySelectorAll('.e-thinking-timeline-item-container');
                expect(stages.length).toBe(2);
                done();
            }, 50);
        });

        it('should handle stage with very long content', (done) => {
            const longContent = 'Stage content ' + 'x'.repeat(500);
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-long-content',
                        title: 'Long Content',
                        stages: [
                            { content: longContent } as any,
                            { content: 'Stage 2' } as any
                        ]
                    }
                ]
            }, true);
            setTimeout(() => {
                const stages = aiAssistViewElem.querySelectorAll('.e-thinking-timeline-item-container');
                expect(stages.length).toBe(2);
                done();
            }, 50);
        });

        it('should render stage without status attribute', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-no-status',
                        title: 'No Status',
                        stages: [
                            { content: 'Stage 1' } as any,
                            { content: 'Stage 2' } as any
                        ]
                    }
                ]
            }, true);
            setTimeout(() => {
                const stages = aiAssistViewElem.querySelectorAll('.e-thinking-timeline-item-container');
                expect(stages.length).toBe(2);
                done();
            }, 50);
        });
    });

    // ===== Context Items Tests =====
    describe('Context Items Rendering -', () => {
        it('should render context item with Success badge', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-1',
                        title: 'Context Test',
                        stages: [{
                            content: 'Searching {0}',
                            editableContext: [{ name: 'docs.pdf', type: 'file', badge: ThinkingContextBadge.Success }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const badge = aiAssistViewElem.querySelector('.e-context-badge');
                expect(badge).not.toBeNull();
                expect(badge.classList.contains('e-check')).toBeTruthy();
                done();
            }, 50);
        });

        it('should render context item with custom badge', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-1',
                        title: 'Context Test',
                        stages: [{
                            content: 'Searching {0}',
                            editableContext: [{ name: 'docs.pdf', type: 'file', badge: 'custom' }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const badge = aiAssistViewElem.querySelector('.e-context-badge');
                expect(badge).not.toBeNull();
                expect(badge.classList.contains('custom')).toBeTruthy();
                done();
            }, 50);
        });

        it('should render context item with Warning badge', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-2',
                        title: 'Context Test',
                        stages: [{
                            content: 'Query {0}',
                            editableContext: [{ name: 'slow-query', type: 'search', badge: ThinkingContextBadge.Warning }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const badge = aiAssistViewElem.querySelector('.e-context-badge');
                expect(badge.classList.contains('e-warning')).toBeTruthy();
                done();
            }, 50);
        });

        it('should render context item with Error badge', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-3',
                        title: 'Context Test',
                        stages: [{
                            content: 'File {0}',
                            editableContext: [{ name: 'missing.txt', type: 'file', badge: ThinkingContextBadge.Failed }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const badge = aiAssistViewElem.querySelector('.e-context-badge');
                expect(badge.classList.contains('e-error-treeview')).toBeTruthy();
                done();
            }, 50);
        });

        it('should render context item with tooltip', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-6',
                        title: 'Context Test',
                        stages: [{
                            content: 'File {0}',
                            editableContext: [{ name: 'myfile.txt', type: 'file', tooltipText: 'Click to open' }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const inlineCtx = aiAssistViewElem.querySelector('.e-inline-context-item');
                expect(inlineCtx.getAttribute('title')).toBe('Click to open');
                done();
            }, 50);
        });

        it('should apply correct CSS class for each context type', (done) => {
            const types: Array<{ type: string, expectedClass: string }> = [
                { type: 'file', expectedClass: 'e-context-file' },
                { type: 'variable', expectedClass: 'e-context-variable' },
                { type: 'search', expectedClass: 'e-context-search' },
                { type: 'tool', expectedClass: 'e-context-tool' },
                { type: 'result', expectedClass: 'e-context-result' }
            ];
            let completed = 0;
            types.forEach((typeInfo, idx) => {
                const wrapper = createElement('div', { id: `ctx-type-${idx}` });
                document.body.appendChild(wrapper);
                const componentForType = new AIAssistView({});
                componentForType.appendTo(wrapper);
                componentForType.addPromptResponse({
                    prompt: 'Type test',
                    blocks: [
                        {
                            blockType: 'thinking',
                            id: `block-ctx-type-${idx}`,
                            title: 'Type Test',
                            stages: [{
                                content: `{0}`,
                                editableContext: [{ name: 'item', type: typeInfo.type }]
                            } as any]
                        }
                    ]
                }, true);
                setTimeout(() => {
                    const item = wrapper.querySelector(`.${typeInfo.expectedClass}`);
                    expect(item).not.toBeNull();
                    componentForType.destroy();
                    wrapper.remove();
                    completed++;
                    if (completed === types.length) {
                        done();
                    }
                }, 50);
            });
        });

        it('should add clickable class when clickable is true', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-click',
                        title: 'Context Test',
                        stages: [{
                            content: '{0}',
                            editableContext: [{ name: 'clickable-item', type: 'file', clickable: true }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const item = aiAssistViewElem.querySelector('.e-context-clickable');
                expect(item).not.toBeNull();
                done();
            }, 50);
        });

        it('should render context item without badge (default case)', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-none',
                        title: 'Context Test',
                        stages: [{
                            content: 'Item {0}',
                            editableContext: [{ name: 'no-badge-item', type: 'file' }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const contextItems = aiAssistViewElem.querySelectorAll('.e-inline-context-item');
                expect(contextItems.length).toBeGreaterThan(0);
                const contextItem = contextItems[0];
                expect(contextItem).not.toBeNull();
                const badge = contextItem.querySelector('.e-context-badge');
                expect(badge).toBeNull();
                done();
            }, 50);
        });

        it('should render context with multiple editable contexts', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-multi',
                        title: 'Multi Context Test',
                        stages: [{
                            content: 'Using {0}, {1}, and {2}',
                            editableContext: [
                                { name: 'file1.txt', type: 'file', badge: ThinkingContextBadge.Success },
                                { name: 'search-q', type: 'search', badge: ThinkingContextBadge.Warning }
                            ]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const items = aiAssistViewElem.querySelectorAll('.e-inline-context-item');
                expect(items.length).toBe(2);
                done();
            }, 50);
        });

        it('should render stage content with single context placeholder', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-content-1',
                        title: 'Content Test',
                        stages: [{
                            content: 'Found result in {0}',
                            editableContext: [{ name: 'database.txt', type: 'file' }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const stageContent = aiAssistViewElem.querySelector('.e-single-stage-content');
                expect(stageContent).not.toBeNull();
                expect(stageContent.innerHTML).toContain('Found result in');
                done();
            }, 50);
        });

        it('should render stage without context (no placeholder)', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-content-2',
                        title: 'Plain Content',
                        stages: [{
                            content: 'Processing complete'
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const stageContent = aiAssistViewElem.querySelector('.e-single-stage-content');
                expect(stageContent).not.toBeNull();
                expect(stageContent.innerHTML).toContain('Processing complete');
                done();
            }, 50);
        });

        it('should render non-clickable context item by default', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-nonclick',
                        title: 'Context Test',
                        stages: [{
                            content: '{0}',
                            editableContext: [{ name: 'non-clickable', type: 'file', clickable: false }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const item = aiAssistViewElem.querySelector('.e-inline-context-item');
                expect(item).not.toBeNull();
                expect(item.classList.contains('e-context-clickable')).toBeFalsy();
                done();
            }, 50);
        });

        it('should render context with special characters in name', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-special',
                        title: 'Special Chars Test',
                        stages: [{
                            content: '{0}',
                            editableContext: [{ name: 'file-[1]_@test.pdf', type: 'file' }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const item = aiAssistViewElem.querySelector('.e-inline-context-item');
                expect(item).not.toBeNull();
                expect(item.textContent).toContain('file-[1]_@test.pdf');
                done();
            }, 50);
        });

        it('should render context with very long name', (done) => {
            const longName = 'a'.repeat(200) + '.pdf';
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-long',
                        title: 'Long Name Test',
                        stages: [{
                            content: '{0}',
                            editableContext: [{ name: longName, type: 'file' }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const item = aiAssistViewElem.querySelector('.e-inline-context-item');
                expect(item).not.toBeNull();
                done();
            }, 50);
        });

        it('should apply accessibility attributes to context badges', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-a11y',
                        title: 'A11y Test',
                        stages: [{
                            content: '{0}',
                            editableContext: [{ name: 'file.pdf', type: 'file', badge: ThinkingContextBadge.Success }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const badge = aiAssistViewElem.querySelector('.e-context-badge');
                expect(badge).not.toBeNull();
                expect(badge.getAttribute('role')).toBeDefined();
                done();
            }, 50);
        });

        it('should render empty editable context array gracefully', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-empty',
                        title: 'Empty Context',
                        stages: [{
                            content: 'No context items',
                            editableContext: []
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const contentDiv = aiAssistViewElem.querySelector('.e-single-stage-content');
                expect(contentDiv).not.toBeNull();
                expect(contentDiv.textContent).toContain('No context items');
                done();
            }, 50);
        });

        it('should render context items in correct order', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-order',
                        title: 'Order Test',
                        stages: [{
                            content: 'Using {0}, then {1}, and finally {2}',
                            editableContext: [
                                { name: 'first.txt', type: 'file' },
                                { name: 'second.txt', type: 'file' },
                                { name: 'third.txt', type: 'file' }
                            ]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const items = aiAssistViewElem.querySelectorAll('.e-inline-context-item');
                expect(items.length).toBe(3);
                expect(items[0].textContent).toContain('first.txt');
                expect(items[1].textContent).toContain('second.txt');
                expect(items[2].textContent).toContain('third.txt');
                done();
            }, 50);
        });

        it('should not render duplicate context items from repeated placeholders', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-dup',
                        title: 'Duplicate Check',
                        stages: [{
                            content: 'File {0} and again {0}',
                            editableContext: [{ name: 'shared.txt', type: 'file' }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const items = aiAssistViewElem.querySelectorAll('.e-inline-context-item');
                expect(items.length).toBeLessThanOrEqual(2);
                done();
            }, 50);
        });

        it('should update context badges on badge type change', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test 1',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-change-1',
                        title: 'Badge Change 1',
                        stages: [{
                            content: '{0}',
                            editableContext: [{ name: 'doc.pdf', type: 'file', badge: ThinkingContextBadge.Success }]
                        } as any]
                    }
                ]
            });
            setTimeout(() => {
                const badge1 = aiAssistViewElem.querySelector('.e-context-badge');
                expect(badge1.classList.contains('e-check')).toBeTruthy();
                
                aiAssistView.addPromptResponse({
                    blocks: [
                        {
                            blockType: 'thinking',
                            id: 'block-ctx-change-2',
                            title: 'Badge Change 2',
                            stages: [{
                                content: '{0}',
                                editableContext: [{ name: 'doc.pdf', type: 'file', badge: ThinkingContextBadge.Warning }]
                            } as any]
                        }
                    ]
                }, true);
                setTimeout(() => {
                    const badge2 = aiAssistViewElem.querySelector('.e-context-badge');
                    expect(badge2.classList.contains('e-warning')).toBeTruthy();
                    done();
                }, 100);
            }, 150);
        });
    });

    // ===== Header Tests =====
    describe('Header Rendering -', () => {
        it('should render header with title', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-hdr-1',
                        title: 'My Thinking Title',
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const toggleText = aiAssistViewElem.querySelector('.e-toggle-text');
                expect(toggleText.innerHTML).toBe('My Thinking Title');
                done();
            }, 50);
        });

        it('should set aria-expanded correctly for collapsed state', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-hdr-2',
                        title: 'Test',
                        collapsed: true,
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const toggleBtn = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle');
                expect(toggleBtn.getAttribute('aria-expanded')).toBe('false');
                done();
            }, 50);
        });

        it('should set aria-expanded correctly for expanded state', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-hdr-3',
                        title: 'Test',
                        collapsed: false,
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const toggleBtn = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle');
                expect(toggleBtn.getAttribute('aria-expanded')).toBe('true');
                done();
            }, 50);
        });

        it('should disable toggle button when not collapsible', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-hdr-4',
                        title: 'Test',
                        collapsible: false,
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const toggleBtn: HTMLButtonElement | null = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle');
                expect(toggleBtn.disabled).toBeTruthy();
                done();
            }, 50);
        });

        it('should disable toggle button when stages is empty', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-hdr-5',
                        title: 'Test',
                        collapsible: true,
                        stages: []
                    }
                ]
            }, true);
            setTimeout(() => {
                const toggleBtn: HTMLButtonElement | null = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle');
                expect(toggleBtn.disabled).toBeTruthy();
                done();
            }, 50);
        });
    });

    // ===== Description Tests =====
    describe('Description Rendering -', () => {
        it('should render content content when provided', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-desc-1',
                        title: 'Test',
                        content: 'This is a content',
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const desc = aiAssistViewElem.querySelector('.e-thinking-response-content');
                expect(desc).not.toBeNull();
                expect(desc.innerHTML.length).toBeGreaterThan(0);
                done();
            }, 50);
        });

        it('should NOT render content when content is empty', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-desc-2',
                        title: 'Test',
                        content: '',
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const desc = aiAssistViewElem.querySelector('.e-thinking-response-content');
                expect(desc).toBeNull();
                done();
            }, 50);
        });
    });

    // ===== ID Generation Tests =====
    describe('ID Generation -', () => {
        it('should use provided ID', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'my-custom-id',
                        title: 'Test',
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const thinkingBlock = aiAssistViewElem.querySelector('.e-aiassist-thinking-header');
                expect(thinkingBlock).not.toBeNull();
                done();
            }, 50);
        });

        it('should generate unique ID when not provided', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        title: 'Test',
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const thinkingBlocks = aiAssistViewElem.querySelectorAll('.e-aiassist-thinking-header');
                expect(thinkingBlocks.length).toBeGreaterThan(0);
                done();
            }, 50);
        });
    });

    // ===== CSS Classes Applied Tests =====
    describe('CSS Classes Applied -', () => {
        it('should apply e-thinking-active class when isActive is true', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-class-1',
                        title: 'Test',
                        isActive: true,
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const thinkingWrapper = aiAssistViewElem.querySelector('.e-thinking-active');
                expect(thinkingWrapper).not.toBeNull();
                done();
            }, 50);
        });

        it('should apply e-thinking-finished class when isActive is false', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-class-2',
                        title: 'Test',
                        isActive: false,
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const thinkingWrapper = aiAssistViewElem.querySelector('.e-thinking-finished');
                expect(thinkingWrapper).not.toBeNull();
                done();
            }, 50);
        });
    });

    // ===== Empty Stages Tests =====
    describe('Empty Stages Handling -', () => {
        it('should handle empty stages array', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-empty-1',
                        title: 'Test',
                        stages: []
                    }
                ]
            }, true);
            setTimeout(() => {
                const header = aiAssistViewElem.querySelector('.e-aiassist-thinking-header');
                expect(header).not.toBeNull();
                done();
            }, 50);
        });

        it('should handle undefined stages', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-empty-2',
                        title: 'Test'
                    }
                ]
            }, true);
            setTimeout(() => {
                const header = aiAssistViewElem.querySelector('.e-aiassist-thinking-header');
                expect(header).not.toBeNull();
                done();
            }, 50);
        });
    });

    // ===== Lifecycle Tests =====
    describe('Component Lifecycle -', () => {
        it('should render multiple thinking blocks in sequence', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test 1',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'destroy-1',
                        title: 'Test 1',
                        isActive: true,
                        stages: []
                    }
                ]
            }, true);
            setTimeout(() => {
                aiAssistView.addPromptResponse({
                    prompt: 'Test 2',
                    blocks: [
                        {
                            blockType: 'thinking',
                            id: 'destroy-2',
                            title: 'Test 2',
                            isActive: true,
                            stages: []
                        }
                    ]
                }, true);
                setTimeout(() => {
                    const spinners = aiAssistViewElem.querySelectorAll('.e-active-spinner');
                    expect(spinners.length).toBe(2);
                    done();
                }, 50);
            }, 50);
        });

        it('should cleanup all instances on component destroy', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'destroy-state',
                        title: 'Test',
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const blocksBefore = aiAssistViewElem.querySelectorAll('.e-aiassist-thinking-header');
                expect(blocksBefore.length).toBe(1);
                aiAssistView.destroy();
                const blocksAfter = aiAssistViewElem.querySelectorAll('.e-aiassist-thinking-header');
                expect(blocksAfter.length).toBe(0);
                done();
            }, 50);
        });
    });
});

// ===== Generative UI (ToolBlock) Tests =====
describe('AIAssistView - Generative UI Tool Support -', () => {
    let aiAssistView: AIAssistView;
    let aiAssistViewElem: HTMLElement;

    beforeEach(() => {
        aiAssistViewElem = createElement('div', { id: 'aiAssistViewTool' });
        document.body.appendChild(aiAssistViewElem);
        aiAssistView = new AIAssistView({});
        aiAssistView.appendTo(aiAssistViewElem);
    });

    afterEach(() => {
        if (aiAssistView) {
            aiAssistView.destroy();
        }
        if (aiAssistViewElem.parentElement) {
            aiAssistViewElem.parentElement.removeChild(aiAssistViewElem);
        }
    });

    describe('registerToolUI -', () => {
        it('should register a tool UI with toolName, template, and handler', () => {
            const toolConfig: any = {
                toolName: 'test-tool',
                template: '<div class="test-tool">Test Tool</div>',
                handler: () => {}
            };
            aiAssistView.registerToolUI(toolConfig);
            const registeredTool = aiAssistView['registeredTools'].get('test-tool');
            expect(registeredTool).not.toBeNull();
            expect(registeredTool.toolName).toBe('test-tool');
        });

        it('should store tool with lowercase key for case-insensitive lookup', () => {
            const toolConfig: any = {
                toolName: 'MyTool',
                template: '<div>My Tool</div>'
            };
            aiAssistView.registerToolUI(toolConfig);
            const registeredTool = aiAssistView['registeredTools'].get('mytool');
            expect(registeredTool).not.toBeNull();
        });

        it('should allow multiple tools to be registered', () => {
            aiAssistView.registerToolUI({ toolName: 'tool1', template: '<div>Tool 1</div>' });
            aiAssistView.registerToolUI({ toolName: 'tool2', template: '<div>Tool 2</div>' });
            aiAssistView.registerToolUI({ toolName: 'tool3', template: '<div>Tool 3</div>' });
            expect(aiAssistView['registeredTools'].size).toBe(3);
        });

        it('should overwrite existing tool with same name', () => {
            aiAssistView.registerToolUI({ toolName: 'duplicate', template: '<div>First</div>' });
            aiAssistView.registerToolUI({ toolName: 'duplicate', template: '<div>Second</div>' });
            const tool = aiAssistView['registeredTools'].get('duplicate');
            expect(tool.template).toBe('<div>Second</div>');
        });
    });

    describe('ToolBlock Rendering -', () => {
        it('should render a registered tool block', (done) => {
            aiAssistView.registerToolUI({
                toolName: 'weather-widget',
                template: '<div class="weather"><h3>Weather</h3></div>'
            });
            aiAssistView.addPromptResponse({
                prompt: 'Show weather',
                blocks: [
                    { blockType: 'tool', toolName: 'weather-widget', props: { location: 'NYC' } }
                ]
            }, true);
            setTimeout(() => {
                const toolContainer = aiAssistViewElem.querySelector('.e-assist-tool');
                expect(toolContainer).not.toBeNull();
                expect(toolContainer.innerHTML).toContain('Weather');
                done();
            }, 50);
        });

        it('should NOT render tool block if tool is not registered', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Show unknown',
                blocks: [
                    { blockType: 'tool', toolName: 'unknown-tool', props: {} }
                ]
            }, true);
            setTimeout(() => {
                const toolContainer = aiAssistViewElem.querySelector('.e-assist-tool');
                expect(toolContainer).toBeNull();
                done();
            }, 50);
        });

        it('should pass props to tool template', (done) => {
            aiAssistView.registerToolUI({
                toolName: 'calculator',
                template: (props: any) => `<div class="calc">Result: ${props.a + props.b}</div>`,
                handler: () => {}
            });
            aiAssistView.addPromptResponse({
                prompt: 'Calculate',
                blocks: [
                    { blockType: 'tool', toolName: 'calculator', props: { a: 5, b: 3 } }
                ]
            }, true);
            setTimeout(() => {
                const calcDiv = aiAssistViewElem.querySelector('.calc');
                expect(calcDiv).not.toBeNull();
                expect(calcDiv.innerHTML).toContain('Result: 8');
                done();
            }, 50);
        });

        it('should call handler after tool template is rendered', (done) => {
            let handlerCalled = false;
            aiAssistView.registerToolUI({
                toolName: 'handler-test',
                template: '<div class="handler-test">Handler Test</div>',
                handler: (container: HTMLElement, props: any) => {
                    handlerCalled = true;
                    container.querySelector('.handler-test').setAttribute('data-handler', 'called');
                }
            });
            aiAssistView.addPromptResponse({
                prompt: 'Test handler',
                blocks: [
                    { blockType: 'tool', toolName: 'handler-test', props: { value: 42 } }
                ]
            }, true);
            setTimeout(() => {
                expect(handlerCalled).toBeTruthy();
                const div = aiAssistViewElem.querySelector('[data-handler="called"]');
                expect(div).not.toBeNull();
                done();
            }, 50);
        });
    });

    describe('Tool Template Types -', () => {
        it('should render string template', (done) => {
            aiAssistView.registerToolUI({
                toolName: 'string-template',
                template: '<span class="str-tmpl">String Template</span>'
            });
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [{ blockType: 'tool', toolName: 'string-template', props: {} }]
            }, true);
            setTimeout(() => {
                const el = aiAssistViewElem.querySelector('.str-tmpl');
                expect(el).not.toBeNull();
                done();
            }, 50);
        });

        it('should render function template', (done) => {
            aiAssistView.registerToolUI({
                toolName: 'fn-template',
                template: (props: any) => `<span class="fn-tmpl">Fn: ${props.name}</span>`
            });
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [{ blockType: 'tool', toolName: 'fn-template', props: { name: 'tester' } }]
            }, true);
            setTimeout(() => {
                const el = aiAssistViewElem.querySelector('.fn-tmpl');
                expect(el).not.toBeNull();
                expect(el.innerHTML).toContain('Fn: tester');
                done();
            }, 50);
        });
    });

    describe('Block Combinations -', () => {
        it('should render ThinkingBlock followed by ToolBlock', (done) => {
            aiAssistView.registerToolUI({
                toolName: 'result-display',
                template: '<div class="result">Result Display</div>'
            });
            aiAssistView.addPromptResponse({
                prompt: 'Analyze and show result',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'thinking-combo',
                        title: 'Analyzing...',
                        isActive: false,
                        stages: [{ content: 'Analysis complete' } as any]
                    },
                    { blockType: 'tool', toolName: 'result-display', props: {} }
                ]
            }, true);
            setTimeout(() => {
                const thinking = aiAssistViewElem.querySelector('.e-thinking-finished');
                const tool = aiAssistViewElem.querySelector('.e-assist-tool');
                expect(thinking).not.toBeNull();
                expect(tool).not.toBeNull();
                done();
            }, 50);
        });

        it('should render TextBlock before ToolBlock', (done) => {
            aiAssistView.registerToolUI({
                toolName: 'data-viewer',
                template: '<div class="data-view">Data Viewer</div>'
            });
            aiAssistView.addPromptResponse({
                prompt: 'Show data',
                blocks: [
                    { blockType: 'text', content: 'Here is your data:' },
                    { blockType: 'tool', toolName: 'data-viewer', props: {} }
                ]
            }, true);
            setTimeout(() => {
                const textContent = aiAssistViewElem.querySelector('.e-response .e-text');
                const tool = aiAssistViewElem.querySelector('.e-response .e-assist-tool');
                expect(textContent).not.toBeNull();
                expect(tool).not.toBeNull();
                done();
            }, 50);
        });

        it('should render multiple blocks in sequence', (done) => {
            aiAssistView.registerToolUI({ toolName: 'tool-a', template: '<div class="tool-a">A</div>' });
            aiAssistView.registerToolUI({ toolName: 'tool-b', template: '<div class="tool-b">B</div>' });
            aiAssistView.registerToolUI({ toolName: 'tool-c', template: '<div class="tool-c">C</div>' });
            aiAssistView.addPromptResponse({
                prompt: 'Multiple tools',
                blocks: [
                    { blockType: 'tool', toolName: 'tool-a', props: {} },
                    { blockType: 'tool', toolName: 'tool-b', props: {} },
                    { blockType: 'tool', toolName: 'tool-c', props: {} }
                ]
            }, true);
            setTimeout(() => {
                const toolA = aiAssistViewElem.querySelector('.tool-a');
                const toolB = aiAssistViewElem.querySelector('.tool-b');
                const toolC = aiAssistViewElem.querySelector('.tool-c');
                expect(toolA).not.toBeNull();
                expect(toolB).not.toBeNull();
                expect(toolC).not.toBeNull();
                done();
            }, 50);
        });

        it('should render mixed blocks: Thinking + Text + Tool', (done) => {
            aiAssistView.registerToolUI({ toolName: 'chart', template: '<div class="chart">Chart</div>' });
            aiAssistView.addPromptResponse({
                prompt: 'Analyze and visualize',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'mixed-thinking',
                        title: 'Processing',
                        stages: [{ content: 'Done' } as any]
                    },
                    { blockType: 'text', content: 'Analysis complete!' },
                    { blockType: 'tool', toolName: 'chart', props: {} }
                ]
            }, true);
            setTimeout(() => {
                const thinking = aiAssistViewElem.querySelector('.e-aiassist-thinking-header');
                const text = aiAssistViewElem.querySelector('.e-response .e-text');
                const tool = aiAssistViewElem.querySelector('.e-assist-tool');
                expect(thinking).not.toBeNull();
                expect(text).not.toBeNull();
                expect(tool).not.toBeNull();
                done();
            }, 50);
        });
    });

    describe('ToolUIConfig Interface -', () => {
        it('should require toolName', () => {
            const config: any = { template: '<div>Test</div>' };
            aiAssistView.registerToolUI(config);
            expect(aiAssistView['registeredTools'].has('')).toBeFalsy();
        });

        it('should accept template as string', () => {
            aiAssistView.registerToolUI({ toolName: 'str', template: '<span>String</span>' });
            const tool = aiAssistView['registeredTools'].get('str');
            expect(typeof tool.template).toBe('string');
        });

        it('should accept template as function', () => {
            aiAssistView.registerToolUI({ toolName: 'fn', template: () => '<span>Function</span>' });
            const tool = aiAssistView['registeredTools'].get('fn');
            expect(typeof tool.template).toBe('function');
        });

        it('should accept handler as optional', () => {
            aiAssistView.registerToolUI({ toolName: 'no-handler', template: '<div>No Handler</div>' });
            const tool = aiAssistView['registeredTools'].get('no-handler');
            expect(tool.handler).toBeUndefined();
        });
    });

    // ===== Copy Icon Click with Blocks Tests =====
    describe('Copy Icon Click with Blocks ', () => {
        it('should copy last text block content when response is empty but blocks exist with text', (done: DoneFn) => {
            const aiAssistView = new AIAssistView({
                prompts: [{
                    prompt: 'Test prompt',
                    response: '',
                    blocks: [
                        {
                            blockType: 'tool',
                            toolName: 'test-tool'
                        },
                        {
                            blockType: 'text',
                            content: 'Last text block content to copy'
                        }
                    ]
                }],
                responseToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-assist-copy', tooltip: 'Copy' }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const clipboardSpy: jasmine.Spy = spyOn((aiAssistView as any), 'getClipBoardContent').and.stub();
            const toolbarItems: NodeListOf<Element> = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const copyItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(copyItem).not.toBeNull();
            copyItem.click();

            setTimeout(() => {
                expect(clipboardSpy).toHaveBeenCalledWith('Last text block content to copy');
                aiAssistView.destroy();
                done();
            }, 1500);
        });

        it('should copy response when response exists along with blocks', (done: DoneFn) => {
            const aiAssistView = new AIAssistView({
                prompts: [{
                    prompt: 'Test prompt',
                    response: 'Main response text',
                    blocks: [
                        {
                            blockType: 'tool',
                            toolName: 'test-tool'
                        },
                        {
                            blockType: 'text',
                            content: 'Text block content'
                        }
                    ]
                }],
                responseToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-assist-copy', tooltip: 'Copy' }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const clipboardSpy: jasmine.Spy = spyOn((aiAssistView as any), 'getClipBoardContent').and.stub();
            const toolbarItems: NodeListOf<Element> = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const copyItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(copyItem).not.toBeNull();
            copyItem.click();

            setTimeout(() => {
                expect(clipboardSpy).toHaveBeenCalledWith('Main response text');
                aiAssistView.destroy();
                done();
            }, 1500);
        });

        it('should extract last text block when response is empty but multiple text blocks exist', (done: DoneFn) => {
            const aiAssistView = new AIAssistView({
                prompts: [{
                    prompt: 'Test prompt',
                    response: '',
                    blocks: [
                        {
                            blockType: 'text',
                            content: 'First text block'
                        },
                        {
                            blockType: 'tool',
                            toolName: 'test-tool'
                        },
                        {
                            blockType: 'text',
                            content: 'Last text block to copy'
                        }
                    ]
                }],
                responseToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-assist-copy', tooltip: 'Copy' }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const clipboardSpy: jasmine.Spy = spyOn((aiAssistView as any), 'getClipBoardContent').and.stub();
            const toolbarItems: NodeListOf<Element> = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const copyItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(copyItem).not.toBeNull();
            copyItem.click();

            setTimeout(() => {
                expect(clipboardSpy).toHaveBeenCalledWith('Last text block to copy');
                aiAssistView.destroy();
                done();
            }, 1500);
        });

        it('should copy empty string when response is empty and no text blocks exist', (done: DoneFn) => {
            const aiAssistView = new AIAssistView({
                prompts: [{
                    prompt: 'Test prompt',
                    response: '',
                    blocks: [
                        {
                            blockType: 'tool',
                            toolName: 'test-tool'
                        },
                        {
                            blockType: 'thinking',
                            title: 'Thinking'
                        }
                    ]
                }],
                responseToolbarSettings: {
                    items: [
                        { iconCss: 'e-icons e-assist-copy', tooltip: 'Copy' }
                    ]
                }
            });
            aiAssistView.appendTo(aiAssistViewElem);
            const clipboardSpy: jasmine.Spy = spyOn((aiAssistView as any), 'getClipBoardContent').and.stub();
            const toolbarItems: NodeListOf<Element> = aiAssistViewElem.querySelectorAll('.e-content-footer .e-toolbar-item');
            expect(toolbarItems).not.toBeNull();
            const copyItem: HTMLElement = (toolbarItems[0] as HTMLElement).querySelector('button');
            expect(copyItem).not.toBeNull();
            copyItem.click();

            setTimeout(() => {
                expect(clipboardSpy).toHaveBeenCalledWith('');
                aiAssistView.destroy();
                done();
            }, 1500);
        });

    });
});

// ===== Coverage Gap - Thinking Support Additional Tests =====
describe('AssistThinking - Coverage Gaps -', () => {
    let aiAssistView: AIAssistView;
    let aiAssistViewElem: HTMLElement;

    beforeEach(() => {
        aiAssistViewElem = createElement('div', { id: 'aiAssistViewCoverage' });
        document.body.appendChild(aiAssistViewElem);
        aiAssistView = new AIAssistView({});
        aiAssistView.appendTo(aiAssistViewElem);
    });

    afterEach(() => {
        if (aiAssistView) {
            aiAssistView.destroy();
        }
        if (aiAssistViewElem.parentElement) {
            aiAssistViewElem.parentElement.removeChild(aiAssistViewElem);
        }
    });

    describe('Badge Type Coverage - Pending & Info -', () => {
        it('should render context item with Pending badge', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-pending-badge',
                        title: 'Pending Badge Test',
                        stages: [{
                            content: '{0}',
                            editableContext: [{ name: 'file.pdf', type: 'file', badge: 'pending' }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const badge = aiAssistViewElem.querySelector('.e-context-badge');
                expect(badge).not.toBeNull();
                expect(badge.classList.contains('e-pending')).toBeTruthy();
                done();
            }, 50);
        });

        it('should render context item with Info badge', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-info-badge',
                        title: 'Info Badge Test',
                        stages: [{
                            content: '{0}',
                            editableContext: [{ name: 'document.txt', type: 'file', badge: 'info' }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const badge = aiAssistViewElem.querySelector('.e-context-badge');
                expect(badge).not.toBeNull();
                expect(badge.classList.contains('e-circle-info')).toBeTruthy();
                done();
            }, 50);
        });

        it('should render context item with Failed badge', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-failed-badge',
                        title: 'Failed Badge Test',
                        stages: [{
                            content: '{0}',
                            editableContext: [{ name: 'error-log.txt', type: 'file', badge: ThinkingContextBadge.Failed }]
                        } as any]
                    }
                ]
            }, true);
            setTimeout(() => {
                const badge = aiAssistViewElem.querySelector('.e-context-badge');
                expect(badge).not.toBeNull();
                expect(badge.classList.contains('e-error-treeview')).toBeTruthy();
                done();
            }, 50);
        });
    });

    describe('Context Item Click Handlers -', () => {
        it('should trigger editableContextClicked event on context item click', (done) => {
            let eventTriggered = false;
            let capturedContext: any = null;
            
            aiAssistView.editableContextClicked = (args: EditableContextClickedEventArgs) => {
                eventTriggered = true;
                capturedContext = args.contextItem;
            };

            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-click',
                        title: 'Click Test',
                        stages: [{
                            content: '{0}',
                            editableContext: [{ name: 'clickable-file.txt', type: 'file', clickable: true }]
                        } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const contextItem = aiAssistViewElem.querySelector('.e-inline-context-item.e-context-clickable');
                expect(contextItem).not.toBeNull();
                if (contextItem) {
                    (contextItem as HTMLElement).click();
                    setTimeout(() => {
                        expect(eventTriggered).toBeTruthy();
                        expect(capturedContext).not.toBeNull();
                        expect(capturedContext.name).toBe('clickable-file.txt');
                        done();
                    }, 50);
                }
            }, 50);
        });

        it('should not trigger event on non-clickable context item', (done) => {
            let eventTriggered = false;
            
            aiAssistView.editableContextClicked =  () => {
                eventTriggered = true;
            };

            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-non-click',
                        title: 'Non-Click Test',
                        stages: [{
                            content: '{0}',
                            editableContext: [{ name: 'non-clickable.txt', type: 'file', clickable: false }]
                        } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const contextItem = aiAssistViewElem.querySelector('.e-inline-context-item');
                expect(contextItem).not.toBeNull();
                expect(contextItem.classList.contains('e-context-clickable')).toBeFalsy();
                if (contextItem) {
                    (contextItem as HTMLElement).click();
                    setTimeout(() => {
                        expect(eventTriggered).toBeFalsy();
                        done();
                    }, 50);
                }
            }, 50);
        });

        it('should pass correct context data in click event args', (done) => {
            const capturedArgs: any[] = [];
            
            aiAssistView.editableContextClicked = (args: EditableContextClickedEventArgs) => {
                capturedArgs.push(args);
            };

            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-data',
                        title: 'Context Data Test',
                        stages: [{
                            content: 'File: {0}',
                            editableContext: [
                                { name: 'config.json', type: 'file', clickable: true, badge: ThinkingContextBadge.Success }
                            ]
                        } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const contextItem = aiAssistViewElem.querySelector('.e-inline-context-item.e-context-clickable');
                if (contextItem) {
                    (contextItem as HTMLElement).click();
                    setTimeout(() => {
                        expect(capturedArgs.length).toBe(1);
                        expect(capturedArgs[0].contextItem.name).toBe('config.json');
                        expect(capturedArgs[0].contextItem.type).toBe('file');
                        expect(capturedArgs[0].contextItem.badge).toBe(ThinkingContextBadge.Success);
                        done();
                    }, 50);
                }
            }, 50);
        });
    });

    describe('Spinner Lifecycle with isActive -', () => {
        it('should show spinner when thinking block isActive is true', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-spinner-active',
                        title: 'Active Thinking',
                        isActive: true,
                        stages: [{ content: 'Processing...' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const spinner = aiAssistViewElem.querySelector('.e-active-spinner');
                expect(spinner).not.toBeNull();
                const spinnerInstance = spinner.querySelector('.e-spinner-pane.e-spin-show');
                expect(spinnerInstance).not.toBeNull();
                done();
            }, 150);
        });

        it('should display check icon when thinking block isActive is false', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-check-icon',
                        title: 'Completed Thinking',
                        isActive: false,
                        stages: [{ content: 'Done!' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const checkIcon = aiAssistViewElem.querySelector('.e-check');
                expect(checkIcon).not.toBeNull();
                done();
            }, 50);
        });

        it('should hide spinner on destroy', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-spinner-destroy',
                        title: 'Spinner Destroy',
                        isActive: true,
                        stages: [{ content: 'Test' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const spinnerBefore = aiAssistViewElem.querySelector('.e-active-spinner');
                expect(spinnerBefore).not.toBeNull();
                aiAssistView.destroy();
                const spinnerAfter = aiAssistViewElem.querySelector('.e-active-spinner');
                expect(spinnerAfter).toBeNull();
                done();
            }, 100);
        });
    });

    describe('Empty & Edge Cases -', () => {
        it('should handle thinking block with no title gracefully', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-no-title',
                        stages: [{ content: 'Default title shown' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const header = aiAssistViewElem.querySelector('.e-aiassist-thinking-header');
                expect(header).not.toBeNull();
                const titleText = header.querySelector('.e-toggle-text');
                expect(titleText).not.toBeNull();
                expect(titleText.textContent).toBe('Thinking...');
                done();
            }, 50);
        });

        it('should render thinking block with disabled toggle when not collapsible', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-not-collapsible',
                        title: 'Not Collapsible',
                        collapsible: false,
                        stages: [{ content: 'Content' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const toggleBtn = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle') as HTMLButtonElement;
                expect(toggleBtn).not.toBeNull();
                expect(toggleBtn.disabled).toBeTruthy();
                expect(toggleBtn.getAttribute('aria-disabled')).toBe('true');
                done();
            }, 50);
        });

        it('should render thinking block with no stages', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-no-stages',
                        title: 'No Stages',
                        stages: []
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const wrapper = aiAssistViewElem.querySelector('#block-no-stages');
                expect(wrapper).not.toBeNull();
                const header = wrapper.querySelector('.e-aiassist-thinking-header');
                expect(header).not.toBeNull();
                const toggleBtn = header.querySelector('button') as HTMLButtonElement;
                expect(toggleBtn.disabled).toBeTruthy();
                done();
            }, 50);
        });

        it('should preserve collapsed state across dynamic updates', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test 1',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-preserve-state',
                        title: 'State Preserve',
                        stages: [{ content: 'Stage 1' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const toggleBtn = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle') as HTMLElement;
                expect(toggleBtn).not.toBeNull();
                toggleBtn.click();
                
                setTimeout(() => {
                    const ariaExpandedBefore = toggleBtn.getAttribute('aria-expanded');
                    expect(ariaExpandedBefore).toBe('false');
                    
                    aiAssistView.addPromptResponse({
                        blocks: [
                            {
                                blockType: 'thinking',
                                id: 'block-preserve-state',
                                title: 'State Preserve Updated',
                                stages: [{ content: 'Stage 1 Updated' } as any]
                            }
                        ]
                    }, true);
                    
                    setTimeout(() => {
                        const ariaExpandedAfter = toggleBtn.getAttribute('aria-expanded');
                        expect(ariaExpandedAfter).toBe('false');
                        done();
                    }, 50);
                }, 50);
            }, 50);
        });
    });

    describe('Multiple Context Types -', () => {
        it('should render all context types correctly', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-all-types',
                        title: 'All Context Types',
                        stages: [{
                            content: 'File: {0}, Search: {1}, Tool: {2}, Result: {3}',
                            editableContext: [
                                { name: 'doc.pdf', type: 'file', badge: ThinkingContextBadge.Success },
                                { name: 'query-results', type: 'search', badge: ThinkingContextBadge.Warning },
                                { name: 'api-tool', type: 'tool', badge: ThinkingContextBadge.Failed },
                                { name: 'result-data', type: 'result' }
                            ]
                        } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const fileCtx = aiAssistViewElem.querySelector('.e-context-file');
                const searchCtx = aiAssistViewElem.querySelector('.e-context-search');
                const toolCtx = aiAssistViewElem.querySelector('.e-context-tool');
                const resultCtx = aiAssistViewElem.querySelector('.e-context-result');
                
                expect(fileCtx).not.toBeNull();
                expect(searchCtx).not.toBeNull();
                expect(toolCtx).not.toBeNull();
                expect(resultCtx).not.toBeNull();
                done();
            }, 50);
        });
    });

    describe('Multi-Stage Timeline Edge Cases -', () => {
        it('should render 5+ stages correctly in timeline', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-5-stages',
                        title: 'Multi Stage',
                        stages: [
                            { content: 'Stage 1', iconCss: 'e-icons e-circle' } as any,
                            { content: 'Stage 2', iconCss: 'e-icons e-square' } as any,
                            { content: 'Stage 3', status: 'InProgress' } as any,
                            { content: 'Stage 4', status: 'Failed' } as any,
                            { content: 'Stage 5', status: 'Completed' } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const stages = aiAssistViewElem.querySelectorAll('.e-thinking-timeline-item-container');
                expect(stages.length).toBe(5);
                done();
            }, 50);
        });

        it('should apply correct status classes to stages', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-status-class',
                        title: 'Status Classes',
                        collapsed: false,
                        collapsible: true,
                        stages: [
                            { content: 'Completed', status: 'Completed' } as any,
                            { content: 'InProgress', status: 'InProgress' } as any,
                            { content: 'Failed', status: 'Failed' } as any
                        ]
                    }
                ]
            }, true);

            setTimeout(() => {
                const stageContainers = aiAssistViewElem.querySelectorAll('.e-thinking-timeline-item-container');
                let hasCompleted = false, hasInProgress = false, hasFailed = false;
                
                stageContainers.forEach((stage) => {
                    if (stage.querySelector('.e-icons.e-check'))
                        hasCompleted = true;
                    if (stage.querySelector('.e-stage-spinner'))
                        hasInProgress = true;
                    if (stage.querySelector('.e-icons.e-error-treeview'))
                        hasFailed = true;
                });
                
                expect(hasCompleted).toBeTruthy();
                expect(hasInProgress).toBeTruthy();
                expect(hasFailed).toBeTruthy();
                done();
            }, 50);
        });
    });

    describe('Markdown Content Rendering -', () => {
        it('should render markdown content in stage', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-markdown',
                        title: 'Markdown Test',
                        stages: [{ content: '# Heading 1\n## Heading 2\nRegular text' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const stageContainer = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(stageContainer).not.toBeNull();
                const content = stageContainer.querySelector('.e-single-stage-content');
                expect(content).not.toBeNull();
                done();
            }, 50);
        });

        it('should handle markdown with code blocks', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-markdown-code',
                        title: 'Code Example',
                        stages: [{ content: '```javascript\nconst x = 10;\n```' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const content = aiAssistViewElem.querySelector('.e-single-stage-content');
                expect(content).not.toBeNull();
                done();
            }, 50);
        });

        it('should render markdown with bold and italic', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-markdown-format',
                        title: 'Formatting',
                        stages: [{ content: '**Bold** and *italic* text' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const stageContainer = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(stageContainer).not.toBeNull();
                done();
            }, 50);
        });

        it('should handle markdown lists', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-markdown-list',
                        title: 'Lists',
                        stages: [{ content: '- Item 1\n- Item 2\n- Item 3' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const content = aiAssistViewElem.querySelector('.e-single-stage-content');
                expect(content).not.toBeNull();
                done();
            }, 50);
        });
    });

    describe('Context Placeholder Rendering -', () => {
        it('should render placeholder for single context', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-placeholder',
                        title: 'Context Placeholder',
                        stages: [
                            {
                                content: 'Using {0}',
                                editableContext: [
                                    { name: 'myVar', type: 'variable', badge: 'Success' as ThinkingContextBadge }
                                ]
                            } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const badge = aiAssistViewElem.querySelector('.e-inline-context-name');
                expect(badge).not.toBeNull();
                expect(badge.textContent).toContain('myVar');
                done();
            }, 50);
        });

        it('should render multiple placeholders correctly', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-ctx',
                        title: 'Multi Context',
                        stages: [
                            {
                                content: 'Using {0} and {1} together',
                                editableContext: [
                                    { name: 'first', type: 'variable', badge: 'Success' as ThinkingContextBadge },
                                    { name: 'second', type: 'file', badge: 'Warning' as ThinkingContextBadge }
                                ]
                            } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const badges = aiAssistViewElem.querySelectorAll('.e-context-badge');
                expect(badges.length).toBeGreaterThanOrEqual(2);
                done();
            }, 50);
        });

        it('should handle content without placeholders', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-no-placeholder',
                        title: 'No Placeholder',
                        stages: [
                            {
                                content: 'Regular content without placeholders',
                                editableContext: [
                                    { name: 'unused', type: 'variable', badge: 'Success' as ThinkingContextBadge }
                                ]
                            } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const content = aiAssistViewElem.querySelector('.e-single-stage-content');
                expect(content.textContent).toContain('Regular content');
                done();
            }, 50);
        });

        it('should render placeholder without context items', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-placeholder-no-ctx',
                        title: 'Placeholder No Context',
                        stages: [{ content: 'Text with {0} placeholder but no items' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const content = aiAssistViewElem.querySelector('.e-single-stage-content');
                expect(content).not.toBeNull();
                done();
            }, 50);
        });
    });

    describe('Badge Element Rendering -', () => {
        it('should render badge with Success type', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-badge-success',
                        title: 'Badge Success',
                        stages: [
                            {
                                content: 'Using {0}',
                                editableContext: [
                                    { name: 'item', type: 'variable', badge: 'Success' as ThinkingContextBadge }
                                ]
                            } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const badge = aiAssistViewElem.querySelector('.e-context-badge');
                expect(badge).not.toBeNull();
                expect(badge.classList.contains('Success')).toBeTruthy();
                done();
            }, 50);
        });

        it('should render badge with None type', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-badge-none',
                        title: 'Badge None',
                        stages: [
                            {
                                content: 'Using {0}',
                                editableContext: [
                                    { name: 'item', type: 'variable', badge: 'None' as ThinkingContextBadge }
                                ]
                            } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const badge = aiAssistViewElem.querySelector('.e-context-badge');
                expect(badge).not.toBeNull();
                done();
            }, 50);
        });
    });

    describe('Template Rendering -', () => {
        it('should render thinking block with custom blockTemplate', (done) => {
            (aiAssistView as any).blockTemplate = function (data: any) {
                return '<div class="custom-thinking">Custom Template Content</div>';
            };
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-custom-template',
                        title: 'Custom Template',
                        stages: []
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const customContent = aiAssistViewElem.querySelector('.custom-thinking');
                expect(customContent).not.toBeNull();
                expect(customContent.textContent).toContain('Custom Template');
                done();
            }, 50);
        });

        it('should render timeline with function template', (done) => {
            (aiAssistView as any).itemTemplate = function (data: any) {
                return '<div class="custom-item">' + (data && data.item && data.item.content ? data.item.content : 'No content') + '</div>';
            };
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-func-template',
                        title: 'Function Template',
                        stages: [
                            { content: 'Custom item content' } as any,
                            { content: 'Another item' } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const customItems = aiAssistViewElem.querySelectorAll('.custom-item');
                expect(customItems.length).toBeGreaterThanOrEqual(2);
                done();
            }, 50);
        });

        it('should render timeline with string template', (done) => {
            (aiAssistView as any).itemTemplate = '<div class="string-template">String Template</div>';
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-str-template',
                        title: 'String Template',
                        stages: [
                            { content: 'Item 1' } as any,
                            { content: 'Item 2' } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const templates = aiAssistViewElem.querySelectorAll('.string-template');
                expect(templates.length).toBeGreaterThanOrEqual(1);
                done();
            }, 50);
        });
    });

    describe('Context Type CSS Classes -', () => {
        it('should apply correct CSS class for file context', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-file',
                        title: 'File Context',
                        stages: [
                            {
                                content: 'Using {0}',
                                editableContext: [
                                    { name: 'document.txt', type: 'file', badge: 'Success' as ThinkingContextBadge }
                                ]
                            } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const contextItem = aiAssistViewElem.querySelector('.e-inline-context-item');
                expect(contextItem.classList.contains('e-context-file')).toBeTruthy();
                done();
            }, 50);
        });

        it('should apply correct CSS class for search context', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-search',
                        title: 'Search Context',
                        stages: [
                            {
                                content: 'Using {0}',
                                editableContext: [
                                    { name: 'keyword', type: 'search', badge: 'Warning' as ThinkingContextBadge }
                                ]
                            } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const contextItem = aiAssistViewElem.querySelector('.e-inline-context-item');
                expect(contextItem.classList.contains('e-context-search')).toBeTruthy();
                done();
            }, 50);
        });

        it('should apply correct CSS class for result context', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-ctx-result',
                        title: 'Result Context',
                        stages: [
                            {
                                content: 'Using {0}',
                                editableContext: [
                                    { name: 'findResult', type: 'result', badge: 'Success' as ThinkingContextBadge }
                                ]
                            } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const contextItem = aiAssistViewElem.querySelector('.e-inline-context-item');
                expect(contextItem.classList.contains('e-context-result')).toBeTruthy();
                done();
            }, 50);
        });
    });

    describe('Null & Edge Case Handling -', () => {
        it('should handle stage with null content', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-null-content',
                        title: 'Null Content',
                        stages: [{ content: null } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const stageContainer = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(stageContainer).not.toBeNull();
                done();
            }, 50);
        });

        it('should handle thinking block with null title', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-null-title',
                        title: null,
                        stages: [{ content: 'Some content' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const responseWrapper = aiAssistViewElem.querySelector('#block-null-title');
                expect(responseWrapper).not.toBeNull();
                done();
            }, 50);
        });

        it('should handle undefined editable context', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-undef-ctx',
                        title: 'Undefined Context',
                        stages: [{ content: 'Content', editableContext: undefined } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const stageContainer = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(stageContainer).not.toBeNull();
                done();
            }, 50);
        });

        it('should handle very long thinking block title', (done) => {
            const longTitle = 'This is a very long thinking block title that should be truncated or wrapped properly in the UI without breaking the layout ' + new Array(20).join('additional text ');
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-long-title',
                        title: longTitle,
                        stages: [{ content: 'Content' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const header = aiAssistViewElem.querySelector('.e-aiassist-thinking-header');
                expect(header).not.toBeNull();
                expect(header.textContent.length).toBeGreaterThan(50);
                done();
            }, 50);
        });

        it('should handle content with special HTML characters', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-special-chars',
                        title: 'Special Chars',
                        content: '<script>alert("xss")</script> & other & chars',
                        stages: [{ content: 'Safe content' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const content = aiAssistViewElem.querySelector('.e-thinking-response-content');
                expect(content).not.toBeNull();
                done();
            }, 50);
        });
    });

    describe('Multiple Toggle States -', () => {
        it('should handle rapid toggle clicks', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-rapid-toggle',
                        title: 'Rapid Toggle',
                        collapsed: true,
                        collapsible: true,
                        stages: [{ content: 'Content' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const toggleBtn = aiAssistViewElem.querySelector('.e-aiassist-thinking-toggle') as HTMLElement;
                toggleBtn.click();
                toggleBtn.click();
                toggleBtn.click();
                toggleBtn.click();
                toggleBtn.click();
                const stageElement = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(stageElement.classList.contains('e-timeline-expanded')).toBeTruthy();
                done();
            }, 50);
        });

        it('should maintain toggle state after re-render', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-state-persist',
                        title: 'State Persist',
                        collapsed: false,
                        stages: [{ content: 'Content' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const stageElement = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(stageElement.classList.contains('e-timeline-expanded')).toBeTruthy();
                done();
            }, 50);
        });
    });

    describe('Cleanup & Destroy Edge Cases -', () => {
        it('should cleanup spinners on rapid destroy calls', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-destroy',
                        title: 'Multi Destroy',
                        isActive: true,
                        stages: [
                            { content: 'Active' } as any,
                            { content: 'Stages' } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                aiAssistView.destroy();
                aiAssistView.destroy();
                expect(aiAssistView.element).not.toBeNull();
                done();
            }, 50);
        });

        it('should handle destroy with no thinking blocks rendered', (done) => {
            const emptyAssistView = new AIAssistView({});
            const emptyElem = createElement('div', { id: 'empty-test' });
            document.body.appendChild(emptyElem);
            emptyAssistView.appendTo(emptyElem);
            
            setTimeout(() => {
                emptyAssistView.destroy();
                expect(emptyAssistView.element).not.toBeNull();
                if (emptyElem.parentElement) {
                    emptyElem.parentElement.removeChild(emptyElem);
                }
                done();
            }, 30);
        });

        it('should cleanup all map instances on destroy', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-cleanup-maps',
                        title: 'Cleanup Maps',
                        isActive: true,
                        stages: [
                            { content: 'Stage 1' } as any,
                            { content: 'Stage 2' } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                aiAssistView.destroy();
                expect(aiAssistView.element).not.toBeNull();
                done();
            }, 50);
        });
    });

    describe('Stage Content Edge Cases -', () => {
        it('should handle stage with empty string content', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-empty-string',
                        title: 'Empty String Content',
                        stages: [{ content: '' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const stageContainer = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(stageContainer).not.toBeNull();
                done();
            }, 50);
        });

        it('should handle stage with only whitespace content', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-whitespace',
                        title: 'Whitespace Content',
                        stages: [{ content: '   \n\t  ' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const stageContainer = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(stageContainer).not.toBeNull();
                done();
            }, 50);
        });

        it('should render blocks and response in addPromptResponse method call', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-whitespace',
                        title: 'Whitespace Content',
                        stages: [{ content: '   \n\t  ' } as any]
                    }
                ]
            }, false);

            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-whitespace',
                        title: 'Whitespace Content',
                        stages: [{ content: '   \n\t  ' }]
                    },
                    {
                        blockType: 'thinking',
                        id: 'block-whitespace-2',
                        title: 'Whitespace Content 2',
                        stages: [{ content: '2 -   \n\t  ' }]
                    }
                ],
                response: 'Test response'
            }, true);
            
            setTimeout(() => {
                const stageContainer = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(stageContainer).not.toBeNull();
                const blockContainer = aiAssistViewElem.querySelector('.e-response.e-response-block-item-0');
                expect(blockContainer).not.toBeNull();
                expect(blockContainer.innerHTML).toContain('Whitespace Content');
                const responseContainer: HTMLElement = aiAssistViewElem.querySelector('.e-response.e-response-block-item-2');
                expect(responseContainer).not.toBeNull();
                expect(responseContainer.innerText).toBe('Test response');
                done();
            }, 50);
        });

        it('should render stage with very large content without performance issues', (done) => {
            const largeContent = 'Content line\n'.repeat(1000);
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-large-content',
                        title: 'Large Content',
                        stages: [{ content: largeContent } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const stageContainer = aiAssistViewElem.querySelector('.e-single-stage-container');
                expect(stageContainer).not.toBeNull();
                done();
            }, 100);
        });

        it('should handle stage content with nested HTML tags', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-nested-html',
                        title: 'Nested HTML',
                        stages: [{ content: '<div><span>nested</span></div> content' } as any]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const content = aiAssistViewElem.querySelector('.e-single-stage-content');
                expect(content).not.toBeNull();
                done();
            }, 50);
        });
    });

    describe('Context Items Advanced -', () => {
        it('should handle context with custom tooltip text', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-tooltip',
                        title: 'Tooltip Test',
                        stages: [
                            {
                                content: 'Using {0}',
                                editableContext: [
                                    { name: 'variable', tooltip: 'Custom tooltip text', type: 'variable', badge: 'Success' as ThinkingContextBadge }
                                ]
                            } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const contextItem = aiAssistViewElem.querySelector('.e-inline-context-item');
                expect(contextItem).not.toBeNull();
                done();
            }, 50);
        });

        it('should handle context item with empty name', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-empty-name',
                        title: 'Empty Name',
                        stages: [
                            {
                                content: 'Using {0}',
                                editableContext: [
                                    { name: '', type: 'variable', badge: 'Success' as ThinkingContextBadge }
                                ]
                            } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const contextItem = aiAssistViewElem.querySelector('.e-inline-context-item');
                expect(contextItem).not.toBeNull();
                done();
            }, 50);
        });

        it('should render context with mixed badge types in same stage', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-mixed-badges',
                        title: 'Mixed Badges',
                        stages: [
                            {
                                content: 'Using {0} and {1} and {2}',
                                editableContext: [
                                    { name: 'success', type: 'variable', badge: 'Success' as ThinkingContextBadge },
                                    { name: 'warning', type: 'file', badge: 'Warning' as ThinkingContextBadge },
                                    { name: 'failed', type: 'search', badge: 'Failed' as ThinkingContextBadge }
                                ]
                            } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const badges = aiAssistViewElem.querySelectorAll('.e-context-badge');
                expect(badges.length).toBeGreaterThanOrEqual(3);
                done();
            }, 50);
        });
    });

    describe('Collapsed State Consistency -', () => {
        it('should maintain collapsed state across multiple stages', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-collapsed',
                        title: 'Multi Collapsed',
                        collapsed: true,
                        collapsible: true,
                        stages: [
                            { content: 'Stage 1' } as any,
                            { content: 'Stage 2' } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const timelineWrapper = aiAssistViewElem.querySelector('.e-aiassist-thinking-timeline');
                expect(timelineWrapper.classList.contains('e-timeline-collapsed')).toBeTruthy();
                done();
            }, 50);
        });

        it('should apply expanded state correctly for multi-stage', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-multi-expanded',
                        title: 'Multi Expanded',
                        collapsed: false,
                        stages: [
                            { content: 'Stage 1' } as any,
                            { content: 'Stage 2' } as any
                        ]
                    }
                ]
            }, true);
            
            setTimeout(() => {
                const timelineWrapper = aiAssistViewElem.querySelector('.e-aiassist-thinking-timeline');
                expect(timelineWrapper.classList.contains('e-timeline-expanded')).toBeTruthy();
                done();
            }, 50);
        });
    });

    describe('Content Template -', () => {
        it('should render thinking with string blockTemplate', (done) => {
            aiAssistView.blockTemplate = '<div class="e-custom-thinking">Custom: {{block.title}}</div>';
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [{
                    blockType: 'thinking',
                    id: 'block-str-template',
                    title: 'String Template Test',
                    stages: [{ content: 'Content' } as any]
                }]
            }, true);

            setTimeout(() => {
                const container = aiAssistViewElem.querySelector('#block-str-template');
                expect(container).not.toBeNull();
                const custom = container.querySelector('.e-custom-thinking');
                expect(custom).not.toBeNull();
                done();
            }, 50);
        });

        it('should render thinking with function blockTemplate', (done) => {
            aiAssistView.blockTemplate = ((context: any) => {
                const div = document.createElement('div');
                div.className = 'e-fn-thinking';
                div.textContent = 'Block: ' + context.block.title + ' Index: ' + context.blockIndex;
                return div.outerHTML;
            });
            
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [{
                    blockType: 'thinking',
                    id: 'block-fn-template',
                    title: 'Function Template',
                    stages: [{ content: 'Content' } as any]
                }]
            }, true);

            setTimeout(() => {
                const container = aiAssistViewElem.querySelector('#block-fn-template');
                expect(container).not.toBeNull();
                const custom = container.querySelector('.e-fn-thinking');
                expect(custom).not.toBeNull();
                expect(custom.textContent).toContain('Function Template');
                expect(custom.textContent).toContain('Index: 0');
                done();
            }, 50);
        });

        it('should fallback to default rendering when blockTemplate is empty string', (done) => {
            aiAssistView.blockTemplate = '';
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [{
                    blockType: 'thinking',
                    id: 'block-no-template',
                    title: 'No Template',
                    stages: [{ content: 'Content' } as any]
                }]
            }, true);

            setTimeout(() => {
                const container = aiAssistViewElem.querySelector('#block-no-template');
                expect(container).not.toBeNull();
                const header = container.querySelector('.e-aiassist-thinking-header');
                expect(header).not.toBeNull();
                done();
            }, 50);
        });

        it('should use blockTemplate for multiple thinking blocks', (done) => {
            aiAssistView.blockTemplate = ((context: any) => {
                const div = document.createElement('div');
                div.className = 'e-multi-thinking';
                div.setAttribute('data-block-id', context.block.id);
                return div.outerHTML;
            });

            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [
                    {
                        blockType: 'thinking',
                        id: 'block-1',
                        title: 'Block 1',
                        stages: [{ content: 'Content 1' } as any]
                    },
                    {
                        blockType: 'thinking',
                        id: 'block-2',
                        title: 'Block 2',
                        stages: [{ content: 'Content 2' } as any]
                    }
                ]
            }, true);

            setTimeout(() => {
                const block1 = aiAssistViewElem.querySelector('#block-1 .e-multi-thinking');
                const block2 = aiAssistViewElem.querySelector('#block-2 .e-multi-thinking');
                expect(block1).not.toBeNull();
                expect(block2).not.toBeNull();
                expect(block1.getAttribute('data-block-id')).toBe('block-1');
                expect(block2.getAttribute('data-block-id')).toBe('block-2');
                done();
            }, 50);
        });

        it('should pass block context object to blockTemplate', (done) => {
            let contextReceived: any = null;
            aiAssistView.blockTemplate = ((context: any) => {
                contextReceived = context;
                return '<div class="e-ctx-check">OK</div>';
            });

            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [{
                    blockType: 'thinking',
                    id: 'block-ctx',
                    title: 'Context Block',
                    stages: [{ content: 'Content' } as any]
                }]
            }, true);

            setTimeout(() => {
                expect(contextReceived).not.toBeNull();
                expect(contextReceived.block).not.toBeNull();
                expect(contextReceived.block.id).toBe('block-ctx');
                expect(contextReceived.block.title).toBe('Context Block');
                expect(typeof contextReceived.blockIndex).toBe('number');
                done();
            }, 50);
        });
    });

    describe('Editable Context in Stages -', () => {
        it('should render stage with editable context items', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [{
                    blockType: 'thinking',
                    id: 'block-editable-ctx',
                    title: 'With Context',
                    stages: [{
                        content: 'Context: {0}',
                        editableContext: [{
                            name: 'Variable',
                            type: 'variable',
                            clickable: false,
                            badge: 'success'
                        } as any]
                    } as any]
                }]
            }, true);

            setTimeout(() => {
                const contextItem = aiAssistViewElem.querySelector('.e-inline-context-item');
                expect(contextItem).not.toBeNull();
                expect(contextItem.textContent).toContain('Variable');
                done();
            }, 50);
        });

        it('should attach click handlers to clickable context items', (done) => {
            let clickEventFired = false;
            aiAssistView.editableContextClicked = ((e: any) => {
                clickEventFired = true;
            });

            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [{
                    blockType: 'thinking',
                    id: 'block-clickable-ctx',
                    title: 'Clickable Context',
                    stages: [{
                        content: 'Click: {0}',
                        editableContext: [{
                            name: 'File',
                            type: 'file',
                            clickable: true,
                            badge: 'info'
                        } as any]
                    } as any]
                }]
            }, true);

            setTimeout(() => {
                const clickableItem = aiAssistViewElem.querySelector('.e-context-clickable') as HTMLElement;
                expect(clickableItem).not.toBeNull();
                if (clickableItem) {
                    clickableItem.click();
                    setTimeout(() => {
                        expect(clickEventFired).toBeTruthy();
                        done();
                    }, 50);
                } else {
                    done();
                }
            }, 50);
        });

        it('should render context placeholder with index substitution', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [{
                    blockType: 'thinking',
                    id: 'block-placeholder',
                    title: 'Placeholder Test',
                    stages: [{
                        content: 'File {0} and {1} are processed',
                        editableContext: [
                            {
                                name: 'input.txt',
                                type: 'file',
                                clickable: false,
                                badge: 'success'
                            } as any,
                            {
                                name: 'output.txt',
                                type: 'file',
                                clickable: false,
                                badge: 'pending'
                            } as any
                        ]
                    } as any]
                }]
            }, true);

            setTimeout(() => {
                const contextItems = aiAssistViewElem.querySelectorAll('.e-inline-context-item');
                expect(contextItems.length).toBeGreaterThanOrEqual(2);
                done();
            }, 50);
        });

        it('should render badge for context items with different badge types', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [{
                    blockType: 'thinking',
                    id: 'block-badges',
                    title: 'Badge Test',
                    stages: [{
                        content: 'Items: {0} {1} {2}',
                        editableContext: [
                            {
                                name: 'Success Item',
                                type: 'variable',
                                clickable: false,
                                badge: 'success'
                            } as any,
                            {
                                name: 'Warning Item',
                                type: 'variable',
                                clickable: false,
                                badge: 'warning'
                            } as any,
                            {
                                name: 'Failed Item',
                                type: 'variable',
                                clickable: false,
                                badge: 'failed'
                            } as any
                        ]
                    } as any]
                }]
            }, true);

            setTimeout(() => {
                const badges = aiAssistViewElem.querySelectorAll('.e-context-badge');
                expect(badges.length).toBeGreaterThanOrEqual(3);
                done();
            }, 50);
        });

        it('should not render click handler for non-clickable context', (done) => {
            let clickEventFired = false;
            aiAssistView.editableContextClicked = ((e: any) => {
                clickEventFired = true;
            });

            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [{
                    blockType: 'thinking',
                    id: 'block-non-clickable',
                    title: 'Non-Clickable',
                    stages: [{
                        content: 'Context: {0}',
                        editableContext: [{
                            name: 'Read-Only',
                            type: 'variable',
                            clickable: false,
                            badge: 'info'
                        } as any]
                    } as any]
                }]
            }, true);

            setTimeout(() => {
                const contextItem = aiAssistViewElem.querySelector('.e-inline-context-item') as HTMLElement;
                expect(contextItem).not.toBeNull();
                if (contextItem && !contextItem.classList.contains('e-context-clickable')) {
                    expect(contextItem.classList.contains('e-context-clickable')).toBeFalsy();
                }
                done();
            }, 50);
        });

        it('should handle empty editableContext array gracefully', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [{
                    blockType: 'thinking',
                    id: 'block-empty-ctx',
                    title: 'Empty Context',
                    stages: [{
                        content: 'No context here',
                        editableContext: [] as any
                    } as any]
                }]
            }, true);

            setTimeout(() => {
                const container = aiAssistViewElem.querySelector('#block-empty-ctx');
                expect(container).not.toBeNull();
                const stage = container.querySelector('.e-single-stage-content');
                expect(stage).not.toBeNull();
                done();
            }, 50);
        });

        it('should render multiple stages with different editable contexts', (done) => {
            aiAssistView.addPromptResponse({
                prompt: 'Test',
                blocks: [{
                    blockType: 'thinking',
                    id: 'block-multi-stages-ctx',
                    title: 'Multi Stages',
                    stages: [
                        {
                            content: 'Stage 1: {0}',
                            editableContext: [{
                                name: 'Ctx1',
                                type: 'variable',
                                clickable: false,
                                badge: 'success'
                            } as any]
                        } as any,
                        {
                            content: 'Stage 2: {0}',
                            editableContext: [{
                                name: 'Ctx2',
                                type: 'file',
                                clickable: true,
                                badge: 'pending'
                            } as any]
                        } as any
                    ]
                }]
            }, true);

            setTimeout(() => {
                const contextItems = aiAssistViewElem.querySelectorAll('.e-inline-context-item');
                expect(contextItems.length).toBeGreaterThanOrEqual(2);
                done();
            }, 50);
        });
    });

    // ===== Regenerated Responses Navigation Tests =====
    describe('Regenerated Responses Navigation -', () => {
        it('Should preserve thinking block when navigating next through regenerated responses', (done) => {
            aiAssistView.responseToolbarSettings = {
                items: [
                    { iconCss: 'e-icons e-assist-regenerate', tooltip: 'Regenerate' }
                ]
            }
            aiAssistView.prompts = [{
                prompt: 'Weather analysis',
                response: 'Initial response',
                blocks: [{
                    blockType: 'thinking',
                    id: 'test-thinking-1',
                    title: 'Analyzing',
                    isActive: false,
                    stages: [{ status: 'completed' as any, content: 'Done' }]
                }]
            }];
            
            setTimeout(() => {
                // Initial render
                const thinkingBlock = aiAssistViewElem.querySelector('#test-thinking-1');
                expect(thinkingBlock).not.toBeNull();
                
                // Click regenerate button
                const regenerateBtn = aiAssistViewElem.querySelector('.e-assist-regenerate') as HTMLElement;
                expect(regenerateBtn).not.toBeNull();
                regenerateBtn.click();
                
                setTimeout(() => {
                    // Add regenerated response
                    aiAssistView.addPromptResponse('Regenerated response 1', false);
                    
                    setTimeout(() => {
                        // Add second regenerated response
                        aiAssistView.addPromptResponse('Regenerated response 2', true);
                        
                        setTimeout(() => {
                            const prevBtn = aiAssistViewElem.querySelector('.e-assist-previous') as HTMLElement;
                            prevBtn.click();
                            // Click next button to navigate
                            const nextBtn = aiAssistViewElem.querySelector('.e-assist-next') as HTMLElement;
                            nextBtn.click();
                            setTimeout(() => {
                                const indexIndicator = aiAssistViewElem.querySelector('.e-response-index-indicator') as HTMLElement;
                                expect(indexIndicator.textContent).toContain('3');
                                expect(aiAssistView['currentRegeneratedIndex'].get(0)).toBe(2);
                                done();
                            }, 50);
                        }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('Should preserve tool block when navigating previous through regenerated responses', (done) => {
            aiAssistView.responseToolbarSettings = {
                items: [
                    { iconCss: 'e-icons e-assist-regenerate', tooltip: 'Regenerate' }
                ]
            }
            const toolConfig: any = {
                toolName: 'test-tool',
                template: '<div class="test-tool">Test Tool</div>',
                handler: () => {}
            };
            aiAssistView.registerToolUI(toolConfig);
            aiAssistView.prompts = [{
                prompt: 'Show chart',
                response: 'Chart response',
                blocks: [{
                    blockType: 'tool',
                    toolName: 'test-tool',
                    props: { data: 'value' }
                }]
            }];
            
            setTimeout(() => {
                const toolElement = aiAssistViewElem.querySelector('.e-assist-tool');
                expect(toolElement).not.toBeNull();
                
                // Click regenerate button
                const regenerateBtn = aiAssistViewElem.querySelector('.e-assist-regenerate') as HTMLElement;
                regenerateBtn.click();
                
                setTimeout(() => {
                    // Add regenerated responses
                    aiAssistView.addPromptResponse('Response A', false);
                    setTimeout(() => {
                        // Click previous to go back to first response
                        const prevBtn = aiAssistViewElem.querySelector('.e-assist-previous') as HTMLElement;
                            prevBtn.click();
                            
                            setTimeout(() => {
                                const indexIndicator = aiAssistViewElem.querySelector('.e-response-index-indicator') as HTMLElement;
                                expect(indexIndicator.textContent).toContain('2');
                                const toolElement = aiAssistViewElem.querySelector('.e-assist-tool');
                                expect(toolElement).not.toBeNull();
                                done();
                            }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });

        it('Should preserve mixed thinking and tool blocks on navigation', (done) => {
            aiAssistView.responseToolbarSettings = {
                items: [
                    { iconCss: 'e-icons e-assist-regenerate', tooltip: 'Regenerate' }
                ]
            }
            const toolConfig: any = {
                toolName: 'mix-tool',
                template: '<div class="test-tool">Test Tool</div>',
                handler: () => {}
            };
            aiAssistView.registerToolUI(toolConfig);
            aiAssistView.prompts = [{
                prompt: 'Complex',
                response: 'Complex response',
                blocks: [
                    { blockType: 'thinking', id: 'mix-think', title: 'Thinking', isActive: false, stages: [] },
                    { blockType: 'text', content: 'Text content' },
                    { blockType: 'tool', toolName: 'mix-tool', props: {} }
                ]
            }];
            
            setTimeout(() => {
                const thinking = aiAssistViewElem.querySelector('#mix-think');
                expect(thinking).not.toBeNull();
                
                // Click regenerate button
                const regenerateBtn = aiAssistViewElem.querySelector('.e-assist-regenerate') as HTMLElement;
                regenerateBtn.click();
                
                setTimeout(() => {
                    // Add regenerated response
                    aiAssistView.addPromptResponse('Mixed response 1', false);
                    setTimeout(() => {
                        // Navigate next
                        const prevBtn = aiAssistViewElem.querySelector('.e-assist-previous') as HTMLElement;
                            prevBtn.click();
                            
                            setTimeout(() => {
                                // Check thinking block is still preserved
                                const thinkingAfterNav = aiAssistViewElem.querySelector('#mix-think');
                                expect(thinkingAfterNav).not.toBeNull();
                                const thinkingHeader = aiAssistViewElem.querySelector('.e-aiassist-thinking-header');
                                expect(thinkingHeader).not.toBeNull();
                                const toolEl = aiAssistViewElem.querySelector('.e-assist-tool');
                                expect(toolEl).not.toBeNull();
                                done();
                            }, 50);
                    }, 50);
                }, 50);
            }, 100);
        });
    });
});
