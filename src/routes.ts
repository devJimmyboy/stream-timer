import { Router } from 'express'
import { CustomizationOptions } from './constants.js'
import { Prisma } from '@prisma/client'
import { db } from './db.js'

export function setupRoutes(api: Router) {
  api.get('/me', (req, res) => res.json({ user: req.user }))
  api.get('/timers', (req, res) => {
    if (!req.user) {
      res.json({ timers: [] })
      return
    }
    db.timer
      .findMany({
        where: {
          userId: req.user?.id,
        },
      })
      .then((timers) => {
        res.json({ timers })
      })
      .catch((err) => {
        res.status(500).json({ error: err })
      })
  })
  api.get('/logout', (req, res) => {
    req.logout({}, (err) => {
      if (err) {
        console.error(err)
      }
    })
    res.redirect('/')
  })

  // POST
  api.post('/update_options', (req, res) => {
    const options = req.body.options as CustomizationOptions
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    db.user
      .update({
        where: {
          id: req.user.id,
        },
        data: {
          textOptions: options as unknown as Prisma.JsonObject,
        },
      })
      .then((user) => {
        res.status(200).send('Success')
      })
      .catch((err) => {
        res.status(500).json({ error: err })
      })
  })

  api.post('/timer/add', (req, res) => {
    const { name } = req.body
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    if (!name) {
      res.status(400).json({ error: 'Name is required' })
      return
    }
    db.timer
      .create({
        data: {
          name,
          active: false,
          paused: true,
          startDate: new Date(),
          userId: req.user.id,
        },
      })
      .then((timer) => {
        res.json(timer)
      })
      .catch((err) => {
        res.status(500).json({ error: err })
      })
  })

  api.post('/timer/:id/pause', async (req, res) => {
    const { id } = req.params
    const { clientTime } = req.body
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const timer = await db.timer.findFirst({
      where: {
        id: Number(id),
      },
    })
    if (timer.paused) {
      res.json(timer)
      return
    }
    db.timer
      .update({
        where: {
          id: Number(id),
        },
        data: {
          paused: true,
          lastTime: clientTime - timer.startDate.getTime() + timer.lastTime,
        },
      })
      .then((timer) => {
        res.json(timer)
      })
      .catch((err) => {
        res.status(500).json({ error: err })
      })
  })

  api.post('/timer/:id/active', async (req, res) => {
    const { id } = req.params
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const timer = await db.timer.findFirst({
      where: {
        id: Number(id),
      },
    })
    await db.timer.updateMany({
      where: {
        userId: req.user.id,
      },
      data: {
        active: false,
      },
    })
    await db.timer
      .update({
        where: {
          id: Number(id),
        },
        data: {
          active: !timer.active,
          user: {
            update: {
              activeTimer: timer.active ? null : timer.id,
            },
          },
        },
        include: { user: true },
      })
      .then((timerUser) => {
        const user = timerUser.user
        const timer = { ...timerUser, user: undefined }
        res.json({ timer, user })
      })
      .catch((err) => {
        res.status(500).json({ error: err })
      })
  })

  api.post('/timer/:id/start', async (req, res) => {
    const { id } = req.params
    const { clientTime } = req.body
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const timer = await db.timer.findFirst({
      where: {
        id: Number(id),
      },
    })
    if (!timer.paused) {
      res.json(timer)
      return
    }
    db.timer
      .update({
        where: {
          id: Number(id),
        },
        data: {
          paused: false,

          startDate: new Date(clientTime),
        },
      })
      .then((timer) => {
        res.json(timer)
      })
      .catch((err) => {
        res.status(500).json({ error: err })
      })
  })

  api.delete('/timer/:id', async (req, res) => {
    const { id } = req.params
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    db.timer
      .delete({
        where: {
          id: Number(id),
        },
      })
      .then(() => {
        res.status(200).send('Success')
      })
      .catch((err) => {
        res.status(500).json({ error: err })
      })
  })
}
