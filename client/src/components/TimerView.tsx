import { Button, ButtonGroup, Stack } from '@mantine/core'
import { Timer, useUser } from '../hooks/useUser'
import axios from 'axios'
import ExampleText from './ExampleText'
import { defaultOptions } from '../App'

type Props = {
  timer: Timer
}

export default function TimerView({ timer }: Props) {
  const { user, updateTimer, removeTimer, updateUser } = useUser()
  return (
    <Stack pos="relative">
      <ButtonGroup pos="absolute" top={0} right={2}>
        <Button
          onClick={() => {
            axios.post(`/api/timer/${timer.id}/active`).then((data) => {
              if (user?.activeTimer !== 0) updateTimer(user?.activeTimer ?? 0, { active: false })
              updateTimer(timer.id, data.data.timer)
              updateUser(data.data.user)
            })
          }}>
          Activate
        </Button>
        <Button
          color="red"
          onClick={() => {
            axios.delete(`/api/timer/${timer.id}`).then(() => {
              removeTimer(timer.id)
            })
          }}>
          Delete
        </Button>
      </ButtonGroup>
      <ExampleText startDate={timer.startDate} lastTime={timer.lastTime} customizationOptions={user?.textOptions ?? defaultOptions} paused={timer.paused} />
      <Button
        onClick={() => {
          axios.post(`/api/timer/${timer.id}/start`, { clientTime: Date.now() }).then((data) => {
            updateTimer(timer.id, data.data)
          })
        }}>
        Start Timer
      </Button>
      <Button
        onClick={() => {
          axios.post(`/api/timer/${timer.id}/pause`, { clientTime: Date.now() }).then((data) => {
            updateTimer(timer.id, data.data)
          })
        }}>
        Stop Timer
      </Button>
    </Stack>
  )
}
