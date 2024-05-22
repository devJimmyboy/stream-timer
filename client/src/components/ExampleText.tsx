import React, { useEffect } from 'react'
import { Text } from '@mantine/core'
import { CustomizationOptions } from './CustomizationBox'
type Props = {
  customizationOptions: CustomizationOptions
  startDate: string
  lastTime: number
  paused?: boolean
}

export default function ExampleText({ customizationOptions, lastTime, startDate, paused }: Props) {
  const startDateObj = new Date(startDate)
  // const [time, setTime] = React.useState(lastTime)
  const [formattedTime, setFormattedTime] = React.useState('00:00:00')
  useEffect(() => {
    const setTime = (paused?: boolean) => {
      const time = paused ? lastTime : new Date().getTime() - startDateObj.getTime() + lastTime
      setFormattedTime(
        customizationOptions.textFormat
          .replace('{hh}', String(Math.floor(time / 1000 / 60 / 60)).padStart(2, '0'))
          .replace('{h}', String(Math.floor(time / 1000 / 60 / 60)).padStart(1, '0'))
          .replace('{mm}', String(Math.floor((time / 1000 / 60) % 60)).padStart(2, '0'))
          .replace('{ss}', String(Math.floor((time / 1000) % 60)).padStart(2, '0'))
          .replace('{ms}', String(Math.floor(time % 1000)).padStart(3, '0'))
      )
    }
    if (paused) {
      setTime(true)
      return
    }
    const interval = setInterval(() => {
      if (paused) return
      setTime()
    }, 5)

    return () => clearInterval(interval)
  }, [customizationOptions, lastTime, startDate, paused])

  // useEffect(() => {})

  return (
    <Text
      style={{
        fontFamily: customizationOptions?.fontFamily,
        fontSize: customizationOptions?.fontSize,
        fontWeight: customizationOptions?.fontWeight,
        textShadow: `${customizationOptions?.textShadowOffsetX}px ${customizationOptions?.textShadowOffsetY}px ${customizationOptions?.textShadowBlur}px ${customizationOptions?.textShadowColor}`,
        WebkitTextStroke: `${customizationOptions?.textStrokeWidth}px ${customizationOptions?.textStrokeColor}`,
        color: customizationOptions?.textColor,
      }}>
      {formattedTime}
    </Text>
  )
}
