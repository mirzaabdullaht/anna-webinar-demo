import { generateAIResponse, processWebinarAudio } from './groqService';

class ContextManager {
  constructor() {
    this.webinarContext = `This is a demo of an AI-powered SaaS product that helps businesses create personalized, interactive webinar experiences. The product uses advanced AI to:
- Provide real-time answers to viewer questions
- Process and understand webinar content
- Create private, engaging conversations
- Help convert viewers into customers

Key features being demonstrated include:
- Live Q&A functionality
- Context-aware responses
- Natural conversation flow
- Sales optimization tools`;
    
    this.userQuestions = [];
    this.productInfo = {
      name: 'Anna',
      description: 'AI-powered webinar assistant that creates personalized, private sales experiences',
      features: [
        'Real-time question answering',
        'Context-aware responses',
        'Private, personalized interactions',
        'Sales funnel optimization'
      ],
      benefits: [
        'Increased viewer engagement',
        'Higher conversion rates',
        'Automated lead qualification',
        'Personalized follow-ups'
      ]
    };
  }

  async updateWebinarContext(audioChunk) {
    try {
      const processedText = await processWebinarAudio(audioChunk);
      this.webinarContext = `${this.webinarContext}\n${processedText}`.trim();
      return this.webinarContext;
    } catch (error) {
      console.error('Error updating webinar context:', error);
      throw error;
    }
  }

  async handleUserQuestion(question) {
    try {
      const context = this.buildContext();
      const response = await generateAIResponse(question, context);
      
      this.userQuestions.push({
        question,
        response,
        timestamp: new Date().toISOString()
      });

      return response;
    } catch (error) {
      console.error('Error handling user question:', error);
      throw error;
    }
  }

  buildContext() {
    return `
      Current Webinar Content:
      ${this.webinarContext}

      Product Information:
      Name: ${this.productInfo.name}
      Description: ${this.productInfo.description}
      
      Key Features:
      ${this.productInfo.features.map(f => `- ${f}`).join('\n')}
      
      Benefits:
      ${this.productInfo.benefits.map(b => `- ${b}`).join('\n')}

      Previous Questions:
      ${this.userQuestions.map(q => `Q: ${q.question}\nA: ${q.response}`).join('\n\n')}
    `.trim();
  }

  getConversationHistory() {
    return this.userQuestions;
  }
}

export const contextManager = new ContextManager();