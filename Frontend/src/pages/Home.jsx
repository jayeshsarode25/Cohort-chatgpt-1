import React, { useCallback, useEffect, useState } from 'react';
import { io } from "socket.io-client";
import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessage.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import '../components/chat/ChatLayout.css';
import { fakeAIReply } from '../components/chat/aiClient.js';
import { useDispatch, useSelector } from 'react-redux';
import { addAIMessage, addUserMessage, ensureInitialChat,sendingStarted,selectChat,setChats,sendingFinished, setInput, startNewChat } from '../store/ChatSlice.js';
import { nanoid } from '@reduxjs/toolkit';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const { chats, activeChatId, input, isSending } = useSelector(state => state.chat);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile off-canvas

  const activeChat = chats.find(c => c.id === activeChatId) || null;
  // const messages = activeChat ? activeChat.messages : [];
  const [message, setMessage] = useState([]);
  const [socket, setSocket] = useState(null);

  const handleNewChat = async () => {
    let title = window.prompt('Enter a title for the new chat', "");
    if (title) title = title.trim();
    if (!title) return;

    const response = await axios.post("http://localhost:3000/api/chat", { title }, { withCredentials: true });

    getMessages(response.data.chat._id);

    // server responds with { message, chat }
    const saved = response.data && response.data.chat ? response.data.chat : response.data;
    console.log(response.data);

    // normalize: use saved._id as id
    dispatch(startNewChat({ title: saved.title, id: saved._id }));
    setSidebarOpen(false);
  };

  useEffect(() => {
    // ensure there's at least one chat on mount
    // dispatch(ensureInitialChat());

    axios.get("http://localhost:3000/api/chat", { withCredentials: true }).then
    (response => {
      console.log(response.data);
      dispatch(setChats(response.data.chats.reverse()));
    })


    const tempSocket = io("http://localhost:3000", { withCredentials: true })

    tempSocket.on("ai-response", (messagePayload) => {
      console.log("Received AI message:", messagePayload);
      // dispatch(addAIMessage(activeChatId, messagePayload.content));
      // dispatch(sendingFinished());
      // dispatch(addAIMessage(message.chat, message.content));
       setMessage((prevMessages) => [ ...prevMessages, {
        type: 'ai',
        content: messagePayload.content
      } ]);

      dispatch(sendingFinished());
    });
    setSocket(tempSocket);

  }, [ ]);

  const sendMessage = async () => {
  
    const trimmed = input.trim();
    console.log(trimmed); 
    if (!trimmed || !activeChatId || isSending) return;
    dispatch(addUserMessage(activeChatId, trimmed));
     dispatch(sendingStarted());

     const newMessages = [ ...message, {
      type: 'user',
      content: trimmed
    } ];

    console.log("New messages:", newMessages);

    setMessage(newMessages);
    dispatch(setInput(''));

      socket.emit("ai-message", { chat: activeChatId, content: trimmed });

  //   try {
  //     const reply = await fakeAIReply(trimmed);
  //     dispatch(addAIMessage(activeChatId, reply));
  //   } catch {
  //     dispatch(addAIMessage(activeChatId, 'Error fetching AI response.', true));
  //   }
  };

  const getMessages = async (chatId) => {

   const response = await  axios.get(`http://localhost:3000/api/chat/messages/${chatId}`, { withCredentials: true })

   console.log("Fetched messages:", response.data.messages);

   setMessage(response.data.messages.map(m => ({
     type: m.role === 'user' ? 'user' : 'ai',
     content: m.content
   })));

  }

  return (
    <div className="chat-layout minimal">
      <ChatMobileBar
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        onNewChat={handleNewChat}
      />
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => { dispatch(selectChat(id)); setSidebarOpen(false); getMessages(id); }}
        onNewChat={handleNewChat}
        open={sidebarOpen}
      />
      <main className="chat-main" role="main">
        {message.length === 0 && (
          <div className="chat-welcome" aria-hidden="true">
            <div className="chip">Early Preview</div>
            <h1>ChatGPT Clone</h1>
            <p>Ask anything. Paste text, brainstorm ideas, or get quick explanations. Your chats stay in the sidebar so you can pick up where you left off.</p>
          </div>
        )}
        <ChatMessages messages={message} isSending={isSending} />
        {
          activeChatId &&
          <ChatComposer
          input={input}
          setInput={(value) => dispatch(setInput(value))}
          onSend={sendMessage}
          isSending={isSending}
        />}
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