
import './ChatSidebar.css';


const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, open }) => {


  
  return (
    <aside className={"chat-sidebar " + (open ? 'open' : '')} aria-label="Previous chats">
      <div className="sidebar-header">
        <h2>Chats</h2>
        <button className="small-btn" onClick={onNewChat}>New</button>
      </div>
      <nav className="chat-list" aria-live="polite">
        {chats.map((c, idx) => {
          // compute a stable id for list keys and selection
          const unifiedId = c.id || c._id || `chat-fallback-${idx}`;
          return (
            <button
              key={unifiedId}
              className={"chat-list-item " + (unifiedId === activeChatId ? 'active' : '')}
              onClick={() => onSelectChat(unifiedId)}
            >
              <span className="title-line">{c.title}</span>
            </button>
          );
        })}
        {chats.length === 0 && <p className="empty-hint">No chats yet.</p>}
      </nav>
    </aside>
  );
};

export default ChatSidebar;