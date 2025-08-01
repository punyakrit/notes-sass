"use client"
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs'
import React from 'react'
import { Button } from './ui/button'

function Logout() {
  return (
    <LogoutLink>

    <Button>
              Log out
            </Button>
    </LogoutLink>
  )
}

export default Logout
