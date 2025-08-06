"use client"
import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

function SubmitButton() {
  const {pending} = useFormStatus()
  return (
    <div>
      {pending ? (
        <Button disabled className=''>
          <Loader2 className='w-4 h-4 mr-2 animate-spin'/>
          Saving...
        </Button>
      ): (
        <Button type="submit">
          Save Now
        </Button>
      )}
    </div>
  )
}

export default SubmitButton


export function SubmitButtonWithState() {
  const {pending} = useFormStatus()

  return (
    <div>
      {pending ? (
        <Button disabled className='w-full'>
          <Loader2 className='w-4 h-4 mr-2 animate-spin'/>
          buying...
        </Button>
      ): (
        <Button type="submit" className='w-full'>
          Buy Now
        </Button>
      )}
    </div>
  )
}