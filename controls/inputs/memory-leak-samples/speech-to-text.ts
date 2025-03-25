import { SpeechToText } from "../src/speech-to-text/index";

let speechToTextInstance: SpeechToText;
document.getElementById('render').addEventListener('click', renderSTT);
document.getElementById('destroy').addEventListener('click', destorySTT);
function renderSTT(): void {
    speechToTextInstance = new SpeechToText({
        buttonSettings: {
            stopIconCss: 'e-icons e-listen-icon'
        }
    });
    speechToTextInstance.appendTo('#speechToText');
}

function destorySTT(): void {
    if (speechToTextInstance && !speechToTextInstance.isDestroyed) {
        speechToTextInstance.destroy();
    }
}