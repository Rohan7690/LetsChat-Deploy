import React, { useState } from 'react'
import { Button, useDisclosure ,Text, Stack, Box, Spinner} from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,Input
  } from '@chakra-ui/react'

import { FormControl,Form } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

import UserBadgeItem from '../UserAvatar/UserBadgeItem'

export default function UpdateGroupChatModal({fetchAgain,setFetchAgain,fetchMessages,children}) {

    const OverlayOne = () => (
        <ModalOverlay
          backdropFilter='blur(10px)'
        />
      )
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<OverlayOne />)

    const [renameLoading,setRenameLoding] = useState(false);
    const [groupChatName ,setGroupChatName] = useState();
    const [selectedUser,setSelectedUser] = useState([]);
    const [search,setSearch] = useState();
    const [ searchResult,setSearchResult] = useState([]);
    const [loading ,setLoading] = useState(false);
    const {user ,chats,setChats,selectedChat,setSelectedChat} = ChatState();

    const toast = useToast();

    const handleRename = async() => {
      if(!groupChatName){
        return;
      }
      try{
        setRenameLoding(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const {data} = await axios.put("/api/chat/rename",{
          chatId:selectedChat._id,
          chatName:groupChatName
        },config);
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoding(false);

        toast({
          title: "Group Renamed",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right"
          });
      }
      catch(err){
        toast({
          title: "Error Occured",
          description: "Failed to rename group",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top-right"
        });
        setRenameLoding(false);
      }
      setGroupChatName("");
    }

       
    const handleSearch = async(query) =>{
        setSearch(query);
        if(!query){
            setSearchResult([]);
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
            description: "Failed to search users",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right"
          });
          }


    } 
    
    const handleAddUser = async(userToAdd) => {
        if(selectedChat.users.find((user)=>user._id === userToAdd._id)){
            toast({
                title: "User already added",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right"
              });
              return;
        }
        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only admin can add users",
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
          const {data} = await axios.put("/api/chat/groupadd",{
            chatId:selectedChat._id,
            userId:userToAdd._id
          },config);
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setLoading(false);
  
        }
        catch(err){
          toast({
            title: "Error Occured",
            description: "Failed to add user",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right"
          });
          setLoading(false);
        }
    }

    const handleRemove = async(userToDelete)=>{
        if(selectedChat.groupAdmin._id !== user._id && userToDelete._id !== user._id){
            toast({
                title: "Only admin can remove users",
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
          const {data} = await axios.put("/api/chat/groupremove",{
            chatId:selectedChat._id,
            userId:userToDelete._id
          },config);
         userToDelete._id === user._id ? setSelectedChat() : setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          fetchMessages();
          setLoading(false);
  
        }
        catch(err){
          toast({
            title: "Error Occured",
            description: "Failed to add user",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right"
          });
          setLoading(false);
        }
        setGroupChatName("");
    }

    
  return (
    <>
       <Text
            onClick={() => {
            setOverlay(<OverlayOne />)
            onOpen()
            }}
            fontFamily={'Montserrat'}
        >
            {children}
        </Text>
      <Modal  isOpen={isOpen} onClose={onClose} isCentered>
        {overlay}
        <ModalContent >
          <ModalHeader alignItems={'center'} fontSize={'40px'} display={'flex'} justifyContent={'center'}>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          >
             <Box width={'100%'} display={'flex'} mb={2}>
            {selectedChat.users.map((u)=>(
                <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={()=>handleRemove(u)}
                 />
            ))}</Box>
            <FormControl>
              <Stack flexDir={'row'}>
                <Input  placeholder='Change Group Name' onChange={(e)=>{setGroupChatName(e.target.value)}} />
                <Button colorScheme='blue' isLoading={renameLoading} onClick={handleRename}>Update</Button>
              </Stack>
            </FormControl>
            <FormControl mt={4}>
              <Input placeholder='Add Members' onChange={(e)=>{handleSearch(e.target.value)}} />
            </FormControl>
           
            {loading ? <Spinner /> : (
                searchResult?.slice(0,4).map((user)=>(
                    <UserListItem key={user._id} user={user} handleFunction={()=>handleAddUser(user)} />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red'  onClick={() => handleRemove(user)}  >Leave Group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
