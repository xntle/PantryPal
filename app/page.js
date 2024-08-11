'use client'

import { Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

export default function Page() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm an AI-powered customer support assistant for Amazon. How can I help you today?`,
    }
  ]);

  const [message, setMessage] = useState(''); 

  const sendMessage = async () => {
    // Clear the input field
    setMessage('');

    // Add the user's message and a placeholder for the assistant's response
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: 'user',
        content: message,
      },
      {
        role: 'assistant',
        content: '',
      },
    ]);
    

    // Send the message to the API
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
      })
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { 
          stream: true 
        });
        setMessages((prevMessages) => {
          let lastMessage = prevMessages[prevMessages.length - 1];
          let otherMessages = prevMessages.slice(0, -1);

          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            }
          ];
        });
        return reader.read().then(processText);
      });
    }).catch(error => {
      console.error("Error reading response:", error);
    });
  }

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center"
    >
      <Stack 
        direction="column" 
        width="600px" 
        height="700px" 
        border="1px solid black" 
        p={2} 
        spacing={3}
        overflow="auto"
        maxHeight="100%"
      >
        {
          messages.map((message, index) => (
            <Box 
              key={index} 
              display="flex" 
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box 
                bgcolor={
                  message.role === 'assistant' 
                  ? 'primary.main' 
                  : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content} {/* Make sure to access the content property */}
              </Box>
            </Box>
          ))
        }
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant='contained' onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
