import { AIAssistView, AssistViewModel, PromptModel, ResponseToolbarSettingsModel  } from '../src/ai-assistview/index';
import { ToolbarItemClickedEventArgs, ToolbarSettingsModel } from '../src/interactive-chat-base/index';

let aiAssistViewInst: AIAssistView;
let promptsData: PromptModel[] = [
    {
        prompt: "Can you help me create a summary of the latest trends in AI technology?",
        response: `<div>Sure! Here are the latest trends in AI technology:
                    <ul>
                        <li><strong>Generative AI:</strong> Improved models like GPT-4 enhance natural language processing.</li>
                        <li><strong>AI in Healthcare:</strong> AI aids in diagnostics and personalized treatments.</li>
                        <li><strong>Autonomous Systems:</strong> Self-driving cars and drones are advancing.</li>
                        <li><strong>AI Ethics:</strong> Focus on bias, privacy, and accountability in AI.</li>
                        <li><strong>Edge AI:</strong> Processing moves to local devices, boosting IoT.</li>
                    </ul>
                </div>`
    }
];

let assistViews: AssistViewModel[] = [
    {
        name: "AI Assist",
        iconCss: "e-icons e-ai-assist"
    }
];
let responseViewSettings: ResponseToolbarSettingsModel = {
    itemClicked: function (args: ToolbarItemClickedEventArgs) {
    }
};
let assistViewToolbarSettings: ToolbarSettingsModel = {
    itemClicked: function (args: ToolbarItemClickedEventArgs) {
    },
    items: [
        { type: 'Input', template: 'Welcome User !', align: 'Right' }
    ]
};

document.getElementById('render').addEventListener('click', renderAssistView);
document.getElementById('destroy').addEventListener('click', destoryAssistView);

function renderAssistView(): void {
    aiAssistViewInst = new AIAssistView({

        promptPlaceholder: "Type your prompt for assistance...",
        promptSuggestionsHeader: "Suggested Prompts",
        promptSuggestions: [
            "How do I set achievable goals at work?",
            "Why do people fly in their dreams?",
            "How can I mitigate the threats during product development?"
        ],
        responseIconCss: "e-icons e-ai-assist",
        prompts: promptsData,
        views: assistViews,
        toolbarSettings: assistViewToolbarSettings,
        responseToolbarSettings: responseViewSettings,
        bannerTemplate: `<div class="ai-assist-banner">
                                <div class="e-icons e-ai-assist"></div>
                                <h2>AI Assistance</h2>
                                <div class="ai-assist-banner-subtitle">Your everyday AI companion</div>
                            </div>`,
    
        promptRequest: () => {
            setTimeout(() => {
                var response = "For real-time prompt processing, connect the AIAssistView component to your preferred AI service, such as OpenAI or Azure Cognitive Services. Ensure you obtain the necessary API credentials to authenticate and enable seamless integration.";
                aiAssistViewInst.addPromptResponse(response);
            }, 1000);
        }
    });
    aiAssistViewInst.appendTo('#defaultAIAssistView');
}
function destoryAssistView(): void {
    if (aiAssistViewInst && !aiAssistViewInst.isDestroyed) {
        aiAssistViewInst.destroy();
    }
}