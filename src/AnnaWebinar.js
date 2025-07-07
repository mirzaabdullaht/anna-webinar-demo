import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { contextManager } from './services/contextService';

// --- Styled Components ---

const Page = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #F9FAFB 0%, #EFF6FF 50%, #FAF5FF 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
`;

const Header = styled.header`
  width: 100vw;
  max-width: 1440px;
  height: 72px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 64px;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  @media (max-width: 900px) {
    padding: 0 24px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const LogoCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4B83F6 0%, #6366F1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
`;

const LogoIcon = styled.img`
  width: 36px;
  height: 36px;
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const HeaderTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #111827;
  letter-spacing: -0.01em;
`;

const HeaderSubtitle = styled.div`
  font-weight: 400;
  font-size: 13px;
  color: #6B7280;
  letter-spacing: -0.01em;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  background: #EF4444;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
`;

const LiveText = styled.div`
  font-weight: 600;
  font-size: 13px;
  color: #374151;
  letter-spacing: 0.02em;
`;

const WebinarWrapper = styled.div`
  position: relative;
  margin-top: 60px;
  display: flex;
  flex-direction: row;
  gap: 40px;
  width: 1315px;
  max-width: 95vw;
  @media (max-width: 1200px) {
    flex-direction: column;
    width: 98vw;
    gap: 24px;
  }
`;

const VideoSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  position: relative;
`;

const VideoPlayer = styled.div`
  position: relative;
  background: #1F2937;
  box-shadow: 0px 20px 40px -10px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  width: 100%;
  max-width: 900px;
  aspect-ratio: 16/9;
  margin-bottom: 24px;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;





// Floating chat bubble using background-image
const FloatingChatBubble = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 160px;
  height: 160px;
  z-index: 10;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const ChatBubbleContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
`;

const BubbleText = styled.span`
  margin-top: 8px;
  font-size: 16px;
  color: #4B83F6;
  font-weight: 500;
`;

const BubbleMessage = styled.div`
  background: #FFFFFF;
  border: 2px solid #4B83F6;
  border-radius: 20px;
  padding: 10px 15px;
  margin-bottom: 10px;
  font-weight: 600;
  color: #4B83F6;
  font-size: 14px;
  position: relative;
  max-width: 140px;
  text-align: center;

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #4B83F6;
  }
`;

const RobotIcon = styled.div`
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  color: #4B83F6;
  svg {
    width: 100%;
    height: 100%;
  }
`;

// --- Main Component ---

const ChatSection = styled.div`
  position: fixed;
  right: 20px;
  bottom: 200px;
  width: 360px;
  background: #FFF8F0;
  border-radius: 16px;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 440px;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(20px)')};
  transition: all 0.3s ease-in-out;
`;

const ChatHeader = styled.div`
  margin-bottom: 20px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: relative;
`;

const AssistantName = styled.div`
  color: #4B83F6;
  font-weight: 600;
  font-size: 15px;
`;

const AssistantDesc = styled.div`
  font-size: 13px;
  color: #6B7280;
  margin-top: 2px;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 24px;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #F3F4F6;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 3px;
  }
`;

const MessageBubble = styled.div`
  background: ${({ from }) => (from === "user" ? "#4B83F6" : "#FFFFFF")};
  color: ${({ from }) => (from === "user" ? "#FFFFFF" : "#1F2937")};
  padding: 12px 16px;
  border-radius: ${({ from }) => (from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px")};
  max-width: 85%;
  align-self: ${({ from }) => (from === "user" ? "flex-end" : "flex-start")};
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
`;

const ChatInput = styled.form`
  display: flex;
  gap: 8px;
  align-items: center;
  background: #FFFFFF;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  padding: 8px;
  outline: none;
  color: #1F2937;

  &::placeholder {
    color: #6B7280;
    font-size: 13px;
  }
`;

const SendButton = styled.button`
  background: #4B83F6;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3B82F6;
    transform: scale(1.05);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
  </svg>
);

const CloseButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #6B7280;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: #374151;
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2ZM16 7C18.7614 7 21 9.23858 21 12C21 14.7614 18.7614 17 16 17C13.2386 17 11 14.7614 11 12C11 9.23858 13.2386 7 16 7ZM16 26.5C12.7 26.5 9.8 25 7.5 22.6C7.6 19.1 14.4 17.2 16 17.2C17.6 17.2 24.4 19.1 24.5 22.6C22.2 25 19.3 26.5 16 26.5Z" fill="#4B83F6"/>
  </svg>
);

// --- Main Component ---

const AnnaWebinar = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hi! I'm Anna, your AI assistant. I can answer questions about the webinar content and our product in real-time. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, chatOpen]);

  // Note: Audio processing from YouTube iframe is not possible due to cross-origin restrictions
  // Instead, we'll rely on the contextManager to handle context updates based on timestamps
  useEffect(() => {
    let interval;
    const updateContext = async () => {
      if (videoRef.current) {
        try {
          // Send periodic updates to context manager with current video timestamp
          await contextManager.updateWebinarContext({
            timestamp: Date.now(),
            source: 'youtube-video',
            videoId: '4X15D6ppYVA'
          });
        } catch (error) {
          console.error('Error updating context:', error);
        }
      }
    };

    interval = setInterval(updateContext, 5000); // Update context every 5 seconds

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    try {
      setMessages(msgs => [...msgs, { from: "user", text: userMessage }]);
      
      const response = await contextManager.handleUserQuestion(userMessage);
      
      setMessages(msgs => [...msgs, { from: "ai", text: response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(msgs => [...msgs, { 
        from: "ai", 
        text: "I apologize, but I'm having trouble processing your request. Please try again in a moment." 
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };



  return (
    <Page>
      <Header>
        <HeaderLeft>
          <LogoCircle>
            <LogoIcon src="https://img.icons8.com/ios-filled/50/ffffff/robot-2.png" alt="logo" />
          </LogoCircle>
          <HeaderText>
            <HeaderTitle>Ask in Live</HeaderTitle>
            <HeaderSubtitle>Interactive AI-Powered Webinar</HeaderSubtitle>
          </HeaderText>
        </HeaderLeft>
        <HeaderRight>
          <LiveDot />
          <LiveText>LIVE</LiveText>
        </HeaderRight>
      </Header>
      <WebinarWrapper>
        <VideoSection>
          <VideoPlayer>
            <iframe
              ref={videoRef}
              src="https://www.youtube.com/embed/4X15D6ppYVA"
              title="AI-Powered SaaS Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </VideoPlayer>
        </VideoSection>
        {chatOpen && (
          <ChatSection isOpen={chatOpen}>
            <ChatHeader>
              <RobotIcon>
                <ChatBubbleIcon />
              </RobotIcon>
              <div>
                <AssistantName>Anna AI Assistant</AssistantName>
                <AssistantDesc>Real-time webinar Q&A</AssistantDesc>
              </div>
              <CloseButton onClick={toggleChat}>
                <CloseIcon />
              </CloseButton>
            </ChatHeader>
            <ChatBody ref={chatBodyRef}>
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  from={msg.from}
                >
                  {msg.text}
                  {msg.from === "ai" && loading && i === messages.length - 1 && (
                    <span className="loading-dots">...</span>
                  )}
                </MessageBubble>
              ))}
            </ChatBody>
            <ChatInput
              onSubmit={sendMessage}
              aria-label="Ask the assistant a question"
            >
              <Input
                type="text"
                placeholder={loading ? "Anna is thinking..." : "Ask anything about the webinar or product"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                ref={inputRef}
              />
              <SendButton 
                type="submit" 
                disabled={loading || !input.trim()}
                style={{ opacity: loading || !input.trim() ? 0.6 : 1 }}
              >
                <SendIcon />
              </SendButton>
            </ChatInput>
          </ChatSection>
        )}
        <FloatingChatBubble onClick={toggleChat}>
          <ChatBubbleContent>
            <BubbleMessage>Ask me anything about the video</BubbleMessage>
            <RobotIcon>
              <ChatBubbleIcon />
            </RobotIcon>
            <BubbleText>Let's chat</BubbleText>
          </ChatBubbleContent>
        </FloatingChatBubble>
      </WebinarWrapper>
    </Page>
  );
};

export default AnnaWebinar;