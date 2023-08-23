import React,{useEffect} from 'react'
import { Box, Container, Text ,Tab,Tabs,TabList,TabPanels,TabPanel} from '@chakra-ui/react'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
import  {useNavigate}  from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    
    if(user){
        navigate('/chat');
        // console.log(user);
    }
  },[navigate]);

  return (
    <Container maxW={'xl'}  centerContent>
      <Box bg={"#141E46"}  width={'100%'} p={3} m={'20px 0 15px 0'} display={'flex'} justifyContent={'center'} borderRadius={'20px'} >
        <Text fontSize="3xl"  fontWeight="bold" color={'whitesmoke'}  textAlign="center" fontFamily={'Montserrat'} >Welcome to Let's Chat</Text>
        
      </Box>
      <Box bg={"#141E46"} width={'100%'} p={3} borderRadius={'20px'}>
      <Tabs variant='soft-rounded'  colorScheme='blue'>
        <TabList >
          <Tab width={'50%'}>Sign Up</Tab>
          <Tab width={'50%'}>Login</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Signup/>
          </TabPanel>
          <TabPanel>
           <Login/>
          </TabPanel>
        </TabPanels>
      </Tabs>
      </Box>
    </Container>
  )
}
