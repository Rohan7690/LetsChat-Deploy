import React,{useEffect} from 'react'
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { Box, Button, useToast ,Text, Stack, Avatar, Heading} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { getSender, getSenderPic } from '../config/chatLogic';
import GroupChatModal from '../components/miscellaneous/GroupChatModal';
import ChatLoading from './ChatLoading';
import ScrollableFeed from 'react-scrollable-feed';

export default function MyChats({fetchAgain}) {
  const {user,selectedChat,setSelectedChat,chats,setChats} = ChatState();
  const [loggedUser, setLoggedUser] = React.useState();
  const toast = useToast();

  const fetchChats = async() => {

    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.get('/api/chat',config);
      setChats(data);
    }
    catch(err){
      toast({
        title: "Error Occured",
        description: "Failed to load Chats",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
    }
  }

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setLoggedUser(JSON.parse(userInfo));
    }
    fetchChats();
  },[fetchAgain]);



  return (
    <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="#141E46"
    w={{ base: "100%", md: "31%" }}
    borderRadius="lg"
    borderWidth="1px"
    borderColor={'#141E46'}
  >
    <Box
      pb={3}
      px={3}
      fontSize={{ base: "28px", md: "30px" }}
      fontFamily="Montserrat"
      display="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      color={'whitesmoke'}
      flexDir={['column','row','row']}
      borderBottom={'1px solid black'}
      
    >
    <Box>
      My Chats
    </Box>
      <GroupChatModal>
        <Button
          width={'100%'}
          d="flex"
          color={'whitesmoke'}
          bg="#1450A3"
          _hover={'none'}
          fontSize={{ base: "14px", md: "16px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
      </GroupChatModal>
    </Box>
    
    <Box
      display={'flex'}
      flexDir={'column'}
      p={[1,2,3]}
      bg="#141E46"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflow={'hidden'}
    >
    
      {chats && (
        <Stack overflow={'scroll'} >
          {chats.map((chat) => (
            <Box
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat === chat ? "#1450A3" : "#0E2954"}
              color={"white"}
              px={3}
              py={2}
              borderRadius="lg"
              key={chat._id}
            >
              <Text>
                {!chat.isGroupChat
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName}
              </Text>
              {chat.latestMessage && (
                <Text fontSize="xs">
                  <b>{chat.latestMessage.sender.name} : </b>
                  {chat.latestMessage.content.length > 50
                    ? chat.latestMessage.content.substring(0, 51) + "..."
                    : chat.latestMessage.content}
                </Text>
              )}
            </Box>
          ))}
        </Stack>
      ) }
      
    </Box>
    
  </Box>
  )
}
