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
import { ChatState } from '../../Context/ChatProvider'
import { FormControl,Form } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import { set } from 'mongoose'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
export default function GroupChatModal({children}) {
    const OverlayOne = () => (
        <ModalOverlay
          backdropFilter='blur(10px)'
        />
      )
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<OverlayOne />)

    const [groupChatName ,setGroupChatName] = useState();
    const [selectedUser,setSelectedUser] = useState([]);
    const [search,setSearch] = useState();
    const [ searchResult,setSearchResult] = useState([]);
    const [loading ,setLoading] = useState(false);
    const {user ,chats,setChats}=ChatState();
    const toast = useToast();
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
    //add selected user ko
    const handleGroup = (userToAdd) => {
        //if selected user already added
        if(selectedUser.includes(userToAdd)){
            toast({
                title: "User already added",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right"
              });
              return;
        }
        setSelectedUser([...selectedUser,userToAdd]);
    }
    const handleDelete = (userToDelete)=>{
        setSelectedUser(selectedUser.filter((sel)=>sel._id!==userToDelete._id));
    }

    const handleSubmit = async() =>{
        //=>can implement a logic of similar group name
        if(!groupChatName || !selectedUser){
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right"
              });
              return;
        }
        try{
            
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
            const {data} = await axios.post("/api/chat/group",{
                name:groupChatName,
                users:JSON.stringify(selectedUser.map((user)=>user._id))
            },config);
           
            setChats([data,...chats]);
            onClose();
            toast({
                title: "Group Created",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
                });
          }
          catch(err){
           toast({
            title: "Error Occured",
            description: "Failed to create group",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right"
          });
          }
    }

  return (
    <>
        <Button bg="#141E46" _hover={'none'}
            onClick={() => {
            setOverlay(<OverlayOne />)
            onOpen()
            }}
            fontFamily={'Montserrat'}
        >
            {children}
        </Button>
      <Modal  isOpen={isOpen} onClose={onClose} isCentered>
        {overlay}
        <ModalContent >
          <ModalHeader alignItems={'center'} fontSize={'40px'} display={'flex'} justifyContent={'center'}>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          >
            
            <FormControl>
              <Input  placeholder='Group Name' onChange={(e)=>{setGroupChatName(e.target.value)}} />
            </FormControl>
            <FormControl mt={4}>
              <Input placeholder='Add Members' onChange={(e)=>{handleSearch(e.target.value)}} />
            </FormControl>
            <Box width={'100%'} display={'flex'} my={1}>
            {selectedUser.map((user)=>(
                <UserBadgeItem
                key={user._id}
                user={user}
                handleFunction={()=>handleDelete(user)} />
            ))}</Box>
            {loading ? <Spinner mt={2} /> : (
                searchResult?.slice(0,4).map((user)=>(
                    <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)} />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit} >Create Group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
