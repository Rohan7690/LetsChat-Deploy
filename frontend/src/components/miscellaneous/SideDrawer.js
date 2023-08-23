import { Button ,Box, Tooltip,Text,Stack,Heading, Menu,Input, MenuButton, Avatar, MenuList, MenuIcon, MenuItem, MenuDivider, Toast, useToast, Spinner} from '@chakra-ui/react'
import React from 'react'
import { useDisclosure } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import { useNavigate } from 'react-router-dom';
import NotificationBadge, { Effect } from 'react-notification-badge';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import ChatLoading from '../ChatLoading';
import { getSender } from '../../config/chatLogic';

export default function SideDrawer() {
  const [search, setSearch] = React.useState('');
  const [searchResult, setSearchResult] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const navigate = useNavigate();
  const {user, setSelectedChat ,chats,setChats,notification,setNotification} = ChatState();
  const [profile , openProfile] = React.useState(false);
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  }

  const handleSearch = async() => {
    if(!search){
      toast({
        title: "Please enter something to search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });  
      return;
    }
      
    try{
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const {data} = await axios.get(`/api/user?search=${search}`,config);
        setLoading(false);
        setSearchResult(data);
      }
      catch(err){
       toast({
        title: "Error Occured",
        description: "Failed to load Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
      setLoading(false);
    }
  }

  const accessChat = async(userId) => {
    try{
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const {data} = await axios.post("/api/chat",{userId},config);
      //if not present then prev data append
      if(!chats.find((chat)=>chat._id === data._id)){
        setChats((prevChats)=>[data,...prevChats]);
      }
      
      setSelectedChat(data);
      setLoading(false);
      onClose();
    }
    catch(err){
      toast({
        title: "Error Occured",
        description: "Failed to load Chat",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
      setLoading(false);
    }
  }
  return (
    <>
    <Stack w={'100%'} bg={'#141E46'} borderColor={'#040D12'} color={'whitesmoke'} direction={'row'} fontFamily={'Montserrat'} alignItems={'center'} justifyContent={'space-between'} px={2} py={2} borderWidth={4}  >
    
    <Tooltip color={'white'} label="Search User name" aria-label="A tooltip">
      <Button bg={'#040D12'} _hover={'none'} color={'whitesmoke'} size={['sm','md','md']} ref={btnRef} onClick={onOpen}>
        <i class="fa-solid fa-magnifying-glass"></i>
        <Text display={{base:'none',md:'flex'}} pl={2}>Search</Text>
      </Button>
    </Tooltip>

    <Heading  fontFamily={'Montserrat'} fontSize={['md','2xl','4xl']}>
      Let's Chat
    </Heading>
    
    
    <Stack flexDir={'row'} bg={'#141E46'}>
      <Menu>
        <MenuButton p={1} mr={2}>
        <NotificationBadge
          count={notification.length}
          effect={Effect.SCALE}
        />
        <BellIcon boxSize={[5,6,6]}/>
        </MenuButton>
        <MenuList bg={'#141E46'} pl={2}>
        <Box color={'whitesmoke'} >
        {!notification.length && "No New Messages"}
        </Box>
        {
          notification.map((n)=>(
            <MenuItem bg={'#141E46'} key={n._id} onClick={()=>{
              setSelectedChat(n.chat);
              setNotification(notification.filter((not)=> not!== n));
            }} >
            {
              n.chat.isGroupChat ? 
                `New message in ${n.chat.chatName}`
                : `New message from ${getSender(user,n.chat.users)}`
            }
            </MenuItem>
          ))
        }
        </MenuList>
      </Menu>
      <Box>
      <Menu>
        <MenuButton bg={'#141E46'} color={'whitesmoke'} _hover={'none'} as={Button} size={['sm','md']} rightIcon={<ChevronDownIcon/>} >
          <Avatar size={['xs','sm','sm']} name={user.name} src={user.pic} />
        </MenuButton>
          <MenuList bg={'#141E46'} >
          <ProfileModal user={user}  >
            <MenuItem bg={'#141E46'}>My Profile</MenuItem>
          </ProfileModal>
          <MenuDivider />
          <MenuItem bg={'#141E46'} onClick={logoutHandler}>Log Out</MenuItem>
          </MenuList>
      </Menu></Box>
      </Stack>
    <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody >
          <Box display={'flex'} mb={5}>
            <Input mr={2} placeholder='Search by name or email' onChange={(e)=>{setSearch(e.target.value)}} />
            <Button colorScheme='blue' onClick={handleSearch} >Go</Button>
          </Box>
          
          {loading ?(
            <ChatLoading/>
          ):(
            searchResult.map((user)=>(
              <UserListItem
              key={user._id}
              user={user}
              handleFunction={()=>accessChat(user._id)}
              />
              )))
          }
          {loading && <Spinner display={'flex'} alignSelf={'center'} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
     </Stack>
    </>
  )
}
