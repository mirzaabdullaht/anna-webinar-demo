const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_CHAT_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_AUDIO_API_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';

export async function generateAIResponse(question, context) {
  try {
    const response = await fetch(GROQ_CHAT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama2-70b-4096',
        messages: [
          {
            role: 'system',
            content: `You are Anna, an AI sales assistant helping with webinar questions. Use this context about the current webinar discussion: ${context}`
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}

export async function processWebinarAudio(audioChunk) {
  try {
    const formData = new FormData();
    formData.append('file', audioChunk);
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const response = await fetch(GROQ_AUDIO_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error processing audio:', error);
    throw error;
  }
}