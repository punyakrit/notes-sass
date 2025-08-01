"use client"
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs'
import React from 'react'
import { Button } from './ui/button'

function LoginButtons() {
  return (
    <div className="flex items-center gap-x-5">
            <LoginLink>
              <Button className=""> Sign In</Button>
            </LoginLink>
            <RegisterLink>
              <Button variant={"secondary"} className="">
                Sign Up
              </Button>
            </RegisterLink>
          </div>
  )
}

export default LoginButtons
