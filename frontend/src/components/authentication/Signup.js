import React, { useState } from 'react'
import { FormControl, FormLabel, VStack,Input, InputRightAddon, InputRightElement, InputGroup, Button } from '@chakra-ui/react'
import { useToast } from "@chakra-ui/react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmPassword] = useState();
    const [pic , setpic] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const postDetails = (pics) => { 
        setLoading(true);

        if(pics === undefined){
            return toast({
                title: "Please select an image",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            
        }

        if(pics.type === "image/jpeg" || pics.type === "image/png" || pics.type === "image/jpg"){

        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "Lets-chat");
        data.append("cloud_name", "rohanproj");
        // fetch("https://api.cloudinary.com/v1_1/rohanproj/image/upload", {
        //     method: "post",
        //     body: data
        // })
        axios.post("https://api.cloudinary.com/v1_1/rohanproj/image/upload",data)
        .then((res)=>{
            console.log(res.data.url);
            setpic(res.data.url.toString());
        })
        .then(()=> {
            setLoading(false);
        })
        .catch((err)=>{
            console.log(err);
            setLoading(false);
        })
        }else{
            toast({
                title: "Please select an image",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            setLoading(false);
            return;
        }
    }
    const submitHandler = async() => {
        setLoading(true);
        if(!name || !email || !password || !confirmpassword){
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


        if(password !== confirmpassword){
            toast({
                title: "Passwords do not match",
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
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                '/api/user',
                { name, email, password, pic },
                config
            );
            toast({
                title: "Registration Successful",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            navigate('/chat');

        }catch(error){
            toast({
                title: error.response.data.message,
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            setLoading(false);

        }

    };

    const handleClick = () => setShow(!show);
    const handleClick1 = () => setShow1(!show1);
    
  return (
    <VStack gap={3}>
        <FormControl id='name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter your name' onChange={(e)=>{setName(e.target.value)}} type="text" />
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter your email' onChange={(e)=>{setEmail(e.target.value)}} type="email" />
            </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input placeholder='Enter your password' onChange={(e)=>{setPassword(e.target.value)}} type={ show ? "text" : "password" } />
                <InputRightElement width={'4.5rem'} onClick={handleClick}>
                    <Button h="1.75rem" size="sm" >
                        {show?"Hide":"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='confirmpassword' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input placeholder='Confirm Password' onChange={(e)=>{setConfirmPassword(e.target.value)}} type={ show1 ? "text" : "password" } />
                <InputRightElement width={'4.5rem'} onClick={handleClick1}>
                    <Button h="1.75rem" size="sm" >
                        {show1?"Hide":"Show"}
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic' >
            <FormLabel>Profile Picture</FormLabel>
            <Input padding={1} type="file" accept='images/*' onChange={(e)=>{postDetails(e.target.files[0])}} />
        </FormControl>
        <Button w={'100%'} mt={15} isLoading={loading}  bgGradient='linear(to-r, teal.500, green.500)' onClick={submitHandler}
  _hover={{
    bgGradient: 'linear(to-r, red.500, yellow.500)',
  }} >Sign Up</Button>
    </VStack>
  )
}
