import { Box, Collapse, Space } from '@mantine/core'
import React from 'react'

type Props = {
  in: boolean
  onCollapse: (nextVal: boolean) => void
  title: React.ReactNode
  children: React.ReactNode
}

export default function CollapseDiv({ in: inProp, onCollapse, title, children }: Props) {
  const [open, setOpen] = React.useState(inProp)

  React.useEffect(() => {
    setOpen(inProp)
  }, [inProp])

  return (
    <Box
      style={{
        border: '1px solid #000',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#343434',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',

        width: '100%',
      }}>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => {
          setOpen(!open)
          onCollapse(!open)
        }}>
        {title}
        <Space />
        {open ? '-' : '+'}
      </Box>
      <Collapse in={open}>{children}</Collapse>
    </Box>
  )
}
