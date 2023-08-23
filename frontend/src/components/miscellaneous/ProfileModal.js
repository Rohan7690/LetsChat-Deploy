import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { Button, Text ,Image} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'

export default function ProfileModal({user,children}) {
    const OverlayOne = () => (
        <ModalOverlay
          backdropFilter='blur(10px)'
        />
      )

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = React.useState(<OverlayOne />)
  return (
    <>
    
  {children && (<div>
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
          <ModalHeader alignItems={'center'} fontSize={'40px'} display={'flex'} justifyContent={'center'}>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          >
            <Image src={user.pic} alt={user.name} boxSize={'150px'} rounded={'100%'} />
            <Text mt={3} fontSize={'20px'}>{user.email}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </div>
  )}
         
    </>
  )
}
