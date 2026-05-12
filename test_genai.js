import { GoogleGenAI } from '@google/genai';

async function test() {
  const ai = new GoogleGenAI({ apiKey: "AIzaSyAyoz44Hz5cSkK5KwW5GtthL1HuQfhduSM" });
  try {
    const chat = ai.chats.create({ 
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are an expert academic tutor."
      }
    });
    const parts = [{text: "hi"}];
    const response = await chat.sendMessage({message: parts});
    console.log("Success with config:", response.text);
  } catch (e) {
    console.log("Failed with config:", e.message);
  }
}
test();
