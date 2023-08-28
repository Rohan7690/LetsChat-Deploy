import { FormControl, FormLabel, VStack,Input } from '@chakra-ui/react'
import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@chakra-ui/react";
import { Button, InputGroup, InputRightElement } from '@chakra-ui/react'
import { useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
export default function Login() {
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const toast = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const {setUser} = ChatState();

    const handleSubmit = async() => {
        console.log("login");
       setLoading(true);
       if(!email || !password){
        toast({
            title: "Please fill all the fields",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right"
        });
        setLoading(false);
        return;    
    }
    try{
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const {data} = await axios.post("/api/user/login", {email, password}, config); 
        localStorage.setItem("userInfo", JSON.stringify(data));
        setUser(data);
        setLoading(false);
        navigate("/chat");
        toast({
            title: "Login Successful",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right"
        });
        
    }catch(err){
        toast({
            title: err.response.data.message,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right"
        });
        setLoading(false);
    }

    }
    
    const guestUser = () => {
        setEmail("123@h.com");
        setPassword("123");
    }
    const handleClick = () => setShow(!show);
  return (
    <VStack gap={3}>
        
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter your email' value={email} onChange={(e)=>{setEmail(e.target.value)}} type="email" />
            </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input placeholder='Enter your password' value={password} onChange={(e)=>{setPassword(e.target.value)}} type={ show ? "text" : "password" } />
                <InputRightElement width={'4.5rem'} onClick={handleClick}>
                    <Button h="1.75rem" size="sm" >
                        {show?"Hide":"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        
        <Button w={'100%'} mt={15} colorScheme='blue' onClick={handleSubmit} isLoading={loading}>Login</Button>
        <Button w={'100%'} colorScheme='red' onClick={guestUser}>Get Guest User Credentials</Button>
    </VStack>
  )
}
