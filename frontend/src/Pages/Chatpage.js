import React, { useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

export default function Chatpage() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{width:"100%"}}>

    {user && <SideDrawer/>}

    <Box color={'white'} w={'100%'} h={'91.5vh'} padding={'10px'} display={'flex'} justifyContent={'space-between'}>
      {user && <MyChats fetchAgain={fetchAgain}/> }
      {user && <ChatBox
        setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />}
    </Box>

    </div>
  )
}
