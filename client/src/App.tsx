import { Anchor, Avatar, Box, Button, Stack } from '@mantine/core'
import { useState } from 'react'
import CollapseDiv from './components/CollapseDiv'
import CustomizationBox, { CustomizationOptions } from './components/CustomizationBox'
import ExampleText from './components/ExampleText'
import { useUser } from './hooks/useUser'
import axios from 'axios'
import TimerView from './components/TimerView'

export const defaultOptions: CustomizationOptions = {
  textFormat: '{hh}:{mm}:{ss}',
  fontFamily: 'Segoe UI',
  fontSize: 72,
  fontWeight: 500,
  textShadowBlur: 0,
  textShadowColor: '#000000',
  textShadowOffsetX: 5,
  textShadowOffsetY: 5,
  textStrokeColor: '#000000',
  textStrokeWidth: 4,
  textColor: '#FFFFFF',
}

export default function App() {
  const { user, updateUser, timers, addTimer } = useUser()

  const activeTimer = user?.activeTimer ? timers.find((t) => user?.activeTimer === t.id) : null
  const [customizing, setCustomizing] = useState(false)
  const [timerSelected, setTimerSelected] = useState(0)
  return (
    <Stack
      align="center"
      justify="start"
      gap="xl"
      px="10vw"
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '100vh',
        paddingTop: '20px',
        fontSize: '24px',
      }}>
      <Stack h="128" align="center" justify="center">
        {activeTimer && <ExampleText customizationOptions={user?.textOptions ?? defaultOptions} startDate={activeTimer.startDate} lastTime={activeTimer.lastTime} paused={activeTimer.paused} />}
      </Stack>
      <CollapseDiv
        in={customizing}
        onCollapse={(val) => {
          setCustomizing(val)
        }}
        title="Global Customization">
        <CustomizationBox
          defaultOptions={user?.textOptions ?? defaultOptions}
          onChange={(opts) =>
            updateUser({
              textOptions: opts,
            })
          }
        />
      </CollapseDiv>
      <Button
        fullWidth
        onClick={() => {
          axios.post('/api/timer/add', { name: 'New Timer' }).then((res) => {
            addTimer(res.data)
          })
        }}>
        Add Timer
      </Button>
      {timers.map(
        (timer, i) =>
          timer && (
            <CollapseDiv
              key={timer.id}
              in={timerSelected === i}
              onCollapse={(val) => {
                setTimerSelected(val ? i : -1)
              }}
              title={timer?.name ?? ''}>
              <TimerView timer={timer} />
            </CollapseDiv>
          )
      )}
      <Box style={{ position: 'absolute', top: 0, right: 0 }}>{user ? <Avatar src={user.avatar}></Avatar> : <Anchor href="/api/auth/twitch">Login</Anchor>}</Box>
    </Stack>
  )
}
