# Anna - AI-Powered Webinar Assistant

Anna is an innovative AI-powered webinar assistant that provides real-time, context-aware responses during webinar sessions. Built with React.js and powered by Groq's advanced LLM capabilities, Anna enhances the webinar experience by offering intelligent interactions based on the webinar content.

## Features

- Real-time context-aware responses using Groq's LLM
- Seamless YouTube webinar integration
- Periodic context updates based on video content
- Modern and responsive chat interface
- Easy deployment to Vultr or GitHub Pages

## Technology Stack

- Frontend: React.js with Styled Components
- AI: Groq API (Llama2-70B model)
- Hosting: Vultr/GitHub Pages
- State Management: React Hooks
- Styling: Styled Components

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/anna-webinar-demo.git
   cd anna-webinar-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and add your API keys:
   ```env
   REACT_APP_GROQ_API_KEY=your_groq_api_key_here
   REACT_APP_MODEL_NAME=llama2-70b-4096
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Deployment

### GitHub Pages

1. Update the `homepage` field in `package.json` with your GitHub Pages URL:
   ```json
   "homepage": "https://yourusername.github.io/anna-webinar-demo"
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

### Vultr

1. Set your Vultr API key in `.env`:
   ```env
   REACT_APP_VULTR_API_KEY=your_vultr_api_key_here
   ```

2. Deploy to Vultr:
   ```bash
   npm run deploy:vultr
   ```

## Implementation Details

### Context Management
The application maintains context by periodically sending video timestamps and metadata to the AI assistant, enabling it to provide relevant responses based on the current webinar content.

### Chat Interface
Built with Styled Components, the chat interface provides a modern and responsive user experience with support for both text and context-aware AI responses.

### AI Integration
Leverages Groq's powerful LLM capabilities through their API, using the Llama2-70B model for generating high-quality, context-aware responses.

## Future Enhancements

- Multi-language support
- Custom webinar integration beyond YouTube
- Enhanced context processing with timestamps
- User authentication and session management
- Analytics dashboard for webinar interactions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Groq for providing their powerful LLM API
- React.js community for excellent documentation and tools
- Vultr for reliable hosting infrastructure
