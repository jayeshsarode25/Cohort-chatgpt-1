import React, { useCallback, useEffect, useState } from 'react';
import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessage.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import '../components/chat/ChatLayout.css';
import { fakeAIReply } from '../components/chat/aiClient.js';
import { useDispatch, useSelector } from 'react-redux';
import { addAIMessage, addUserMessage, ensureInitialChat, selectChat, setInput, startNewChat as startNewChatAction } from '../store/ChatSlice.js';
import { nanoid } from '@reduxjs/toolkit';

const Home = () => {
  const dispatch = useDispatch();
  const { chats, activeChatId, input, isSending } = useSelector(state => state.chat);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile off-canvas

  const activeChat = chats.find(c => c.id === activeChatId) || null;
  useSta

  const startNewChat = useCallback(() => {
    const title = prompt('Enter a title for the new chat');
    if (title) {
      const newChat = { _id: nanoid(), title, messages: [] };
      dispatch(startNewChatAction(newChat));
      setSidebarOpen(false);
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(ensureInitialChat());
  }, [dispatch]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || !activeChatId || isSending) return;
    dispatch(addUserMessage(activeChatId, trimmed));
    try {
      const reply = await fakeAIReply(trimmed);
      dispatch(addAIMessage(activeChatId, reply));
    } catch {
      dispatch(addAIMessage(activeChatId, 'Error fetching AI response.', true));
    }
  }, [input, activeChatId, isSending, dispatch]);

  return (
    <div className="chat-layout minimal">
      <ChatMobileBar
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        onNewChat={startNewChat}
      />
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => { dispatch(selectChat(id)); setSidebarOpen(false); }}
        onNewChat={startNewChat}
        open={sidebarOpen}
      />
      <main className="chat-main" role="main">
        {messages.length === 0 && (
          <div className="chat-welcome" aria-hidden="true">
            <div className="chip">Early Preview</div>
            <h1>ChatGPT Clone</h1>
            <p>Ask anything. Paste text, brainstorm ideas, or get quick explanations. Your chats stay in the sidebar so you can pick up where you left off.</p>
          </div>
        )}
        <ChatMessages messages={messages} isSending={isSending} />
        <ChatComposer
          input={input}
          setInput={(value) => dispatch(setInput(value))}
          onSend={sendMessage}
          isSending={isSending}
        />
      </main>
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};



export default Home;