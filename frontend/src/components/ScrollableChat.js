import React, { useRef, useEffect } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/chatLogic';
import { ChatState } from '../Context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';

export default function ScrollableChat({ messages }) {
  const { user, selectedChat } = ChatState();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
  
    const isUserScrolling = chatContainer.scrollTop + chatContainer.clientHeight < chatContainer.scrollHeight;
    chatContainer.scrollTop = chatContainer.scrollHeight;
    if (isUserScrolling) {
      return;
    }

  }, [selectedChat, messages]);

  return (
    
    <ScrollableFeed ref={chatContainerRef}>
      {messages &&
        messages.map((m, i) => (
          <div key={m._id} style={{ display: 'flex' }}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
                  <Avatar
                    mt={'7px'}
                    mr={1}
                    size={'sm'}
                    src={m.sender.pic}
                    name={m.sender.name}
                    cursor={'pointer'}
                  />
                </Tooltip>
              )}
            <span
              style={{
                backgroundColor: `${m.sender._id === user._id ? '#2D4356' : '#0E2954'}`,
                color:'whitesmoke',
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '75%',
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}
