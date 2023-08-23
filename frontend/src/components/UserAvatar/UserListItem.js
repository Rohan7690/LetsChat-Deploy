import { Avatar, Box ,Text,Stack} from '@chakra-ui/react'
import { color } from 'framer-motion'
import React from 'react'

export default function UserListItem({user,handleFunction}) {
  return (
    <Stack
    onClick={handleFunction}
    cursor={'pointer'}
    bg={'#E8E8E8'}
    _hover={{
        background:"#38B2AC"
        ,color:"white"
    }}
    w={'100%'}
    d='flex'
    flexDir={'row'}
    alignItems={'center'}
    color={'black'}
    px={3}
    py={2}
    borderRadius={'10px'}
    mb={2}
    mt={2}
    >
    <Avatar cursor={'pointer'} mr={2} size={'sm'} src={user.pic} name={user.name} />
        <Box>
            <Text>{user.name}</Text>
            <Text fontSize={'12px'}>{user.email}</Text>
        </Box>
    </Stack>
  )
}
