import React from 'react'
import {Stack, Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
export default function ChatLoading() {
  return (
        <Stack mt={3}>
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
            <Skeleton height='45px' />
        </Stack>
  )
}
