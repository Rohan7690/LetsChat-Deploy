import { ArrowBackIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Box,Icon,IconButton,Stack,Text,Image, Spinner, FormControl, Input, Toast, InputRightAddon, InputGroup} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { getSender,getSenderFull, getSenderPic } from '../config/chatLogic';
import ProfileModal from './miscellaneous/ProfileModal';
import axios from 'axios';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';

const ENDPOINT = 'http://localhost:5000';
var socket ,selectedChatCompare;

export default function SingleChat({fetchAgain,setFetchAgain}) {
    const {selectedChat,chats,setSelectedChat,user,notification, setNotification} = ChatState();
    const [messages,setMessages] = React.useState([]);
    const [loading,setLoading] = React.useState(false);
    const [newMessage,setNewMessage] = React.useState();
    const [typing ,setTyping] = React.useState(false);
    const [isTyping ,setIsTyping] = React.useState(false);
    const [socketConnected,setSocketConnected] = React.useState(false);
    
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup',user);
        socket.on('connected',() => setSocketConnected(true));
        socket.on("typing", () => {
            setIsTyping(true);
        });
        socket.on("stop typing", () => {
            setIsTyping(false);
        });
    },[]);

    // console.log(notification,"message there");
    
    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if(
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ){
                //give notification
                if(!notification.includes(newMessageReceived)){
                    setNotification([newMessageReceived,...notification]);
                    setFetchAgain(!fetchAgain);
                }

            }else{
                setMessages([...messages,newMessageReceived]);
            }
        });});

        const sendMessage = async () => {
            if (newMessage) { // Check if there's a message to send
              try {
                const config = {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                  },
                };
                // Clear the input field immediately
                setNewMessage("");
                const { data } = await axios.post('/api/message', {
                  chatId: selectedChat._id,
                  content: newMessage,
                }, config);
          
                socket.emit("new message", data);
                setMessages([...messages, data]);
              } catch (err) {
                console.log(err);
                Toast({
                  title: "Error Occured",
                  description: "Failed to send message",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                  position: "top-right"
                });
              }
            }
          };





    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            sendMessage(); // Call sendMessage when Enter key is pressed
        }
        };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        //Typeing indicator logic 

        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit("typing",selectedChat._id);
        }

        var lastTypingTime = new Date().getTime();
        var timerLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing){
                socket.emit("stop typing",selectedChat._id);
                setTyping(false);
            }
        },timerLength);
    }

    const fetchMessages = async() => {
        if(!selectedChat) return;

        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);

            const {data} = await axios.get(`/api/message/${selectedChat._id}`
            ,config);
            
            setMessages(data);
            setLoading(false);

            socket.emit("join chat",selectedChat._id);

        }catch(err){
            console.log(err);
            Toast({
                title: "Error Occured",
                description: "Failed to load messages",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            setLoading(false);
        }
        
    }
    
   
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    },[selectedChat]);
    
    return (
        <>
        {
           selectedChat ? (
            <>
            <Text
            borderBottom={'1px solid black'}
            fontSize={{base:'28px',md:'32px'}}
            pb={3}
            px={2}
            w={'100%'}
            cursor={'pointer'}
            fontFamily={'Montserrat'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={{base:'space-between'}}
            >
            <IconButton color={'whitesmoke'} bg={"#141E46"} display={{base:'flex',md:'none'}}
            icon={<ArrowBackIcon/>}
            onClick={() => setSelectedChat(null)}/>
            {!selectedChat.isGroupChat ? 
                <>
                <ProfileModal user={getSenderFull(user,selectedChat.users)} >
                <Stack flexDir={'row'} align={'center'}>
                <Image src={getSenderPic(user,selectedChat.users)} alt={user.name} mr={[0,2]} boxSize={['30px','42px','42px']} rounded={'100%'} />
                <Text color={'whitesmoke'} fontSize={['md','lg','2xl']}>{getSender(user,selectedChat.users)}</Text>
                </Stack>
                </ProfileModal>
                </>
                :
                <>
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}>
                <Text color={'whitesmoke'} fontSize={['md','lg','2xl']}>{selectedChat.chatName.toUpperCase()}</Text>
                </UpdateGroupChatModal>
                </>
                }
            </Text>
            <Box
            display={'flex'}
            flexDir={'column'}
            justifyContent={'flex-end'}
            p={3}
            bg={"#141E46"}
            w={'100%'}
            h={'100%'}
            borderRadius={'lg'}
            overflowY={'hidden'}
            >
                {loading ? 
                    <Spinner 
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="#38B2AC"
                    size="xl"
                    alignSelf={'center'}
                    margin={'auto'}
                    />:(
                        <Box className='messages' fontSize={'md'} >
                        <ScrollableChat messages={messages} />
                        </Box>
                    )}
                    <FormControl onKeyDown={handleKeyPress} isRequired mt={3}>
                    {isTyping && (
                        <Lottie
                        options={{
                            loop: true,
                            autoplay: true,
                            animationData: require("../animations/typing.json"),
                            rendererSettings: {
                                preserveAspectRatio: "xMidYMid slice"
                            }
                        }}
                        width={100}
                        height={50}
                        style={{
                            marginLeft:0,
                            marginBottom:15,
                        }}                       
                            />
                    )}
                    <InputGroup>
                        <Input 
                        _hover={'none'}
                        placeholder={'Type a message'}
                        border={'none'}
                        onChange={typingHandler}
                        value={newMessage}
                        bg={'#0E2954'}     
                        color={'white'}
                        fontSize={'18px'}
                        /><InputRightAddon cursor={'pointer'} bg={'#0E2954'} borderColor={'#0E2954'} onClick={sendMessage} height={'auto'} children={<Icon as={ArrowRightIcon} color={'#38B2AC'} />} />
                        </InputGroup>
                    </FormControl>
            </Box>
            </>
           ):(
            <Box display={'flex'} alignItems={'center'} fontFamily={'Montserrat'} justifyContent={'center'} h={'100%'}>
                <Text fontSize={'30px'} color={'#38B2AC'}
                >Click on user to Start Chatting</Text>
            </Box>
           )
        }
        </>
    )
}

