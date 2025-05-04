import React, { useState } from 'react';
import { Megaphone, CalendarDays, MessageSquare, Users } from 'lucide-react';
import Chat from './Chat';
import CommunityPosts from './CommunityPosts';

function Community() {
  const [activeTab, setActiveTab] = useState('chat');

  const tabHeaderStyle = {
    display: 'flex',
    justifyContent: 'center',
    borderBottom: '1px solid #dee2e6',
    marginBottom: '2rem'
  };

  const tabStyle = {
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    margin: '0 1rem',
    borderBottom: '3px solid transparent'
  };

  const activeTabStyle = {
    ...tabStyle,
    borderBottom: '3px solid #0d6efd',
    color: '#0d6efd'
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Megaphone size={32} style={{ marginRight: '10px' }} /> Community
      </h2>

      {/* Tab Headers */}
      <div style={tabHeaderStyle}>
        <div
          style={activeTab === 'chat' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare size={24} style={{ marginRight: '8px' }} /> Chat
        </div>
        <div
          style={activeTab === 'posts' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('posts')}
        >
          <Users size={24} style={{ marginRight: '8px' }} /> Community Posts
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'chat' ? <Chat /> : <CommunityPosts />}
    </div>
  );
}

export default Community;