import { cn } from '@/lib/utils'
import React, { ReactNode } from 'react'

type Props = {
    jc: string
    ai: string
    h:string
    w:string
    children: ReactNode
    _class?: string

}

function FlexContainer({jc, ai, h, w, children, _class}: Props) {
  return (
    <div className={cn(jc,ai, h, w, "flex", _class)}>{children}</div>
  )
}

export default FlexContainer