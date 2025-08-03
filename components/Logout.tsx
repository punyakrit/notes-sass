"use client"
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs'
import React from 'react'
import { Button } from './ui/button'
import { DoorClosed } from 'lucide-react'

function Logout() {
  return (
    <LogoutLink>

    <div className='flex justify-between items-center p-2'>
            Logout{" "}
            <span>
              <DoorClosed className="w-4 h-4" />
            </span>
          </div>
    </LogoutLink>
  )
}

export default Logout
