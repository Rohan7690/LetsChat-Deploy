import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

export default function UserBadgeItem({user,handleFunction}) {
  return (
    <Box
    px={2}
    py={1}
    borderRadius={'10px'}
    mb={2}
    m={1}
    variant="solid"
    fontSize={12}
    background={'purple.500'}
    color={'white'}
    cursor={'pointer'}
    onClick={handleFunction}
    >
    {user.name}
    <CloseIcon pl={1} />
    </Box>
  )
}
