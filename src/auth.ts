import passport from 'passport'
import OAuth2Strategy from 'passport-oauth2'
import axios from 'axios'
import { db } from './db.js'
import { defaultTextOptions } from './constants.js'
import { Prisma, User } from '@prisma/client'
import { Router } from 'express'
OAuth2Strategy.prototype.userProfile = function (accessToken, done) {
  axios
    .get('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-ID': process.env.TWITCH_ID,
      },
    })
    .then((response) => {
      const user = response.data.data[0]
      done(null, user)
    })
    .catch((error) => {
      done(error)
    })
}

passport.use(
  'twitch',
  new OAuth2Strategy(
    {
      authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
      tokenURL: 'https://id.twitch.tv/oauth2/token',
      clientID: process.env.TWITCH_ID,
      clientSecret: process.env.TWITCH_SECRET,
      callbackURL: process.env.TWITCH_CALLBACK,
    },
    async (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken
      profile.refreshToken = refreshToken
      const dbUser = await db.user.upsert({
        create: {
          id: profile.id,
          name: profile.login,
          displayName: profile.display_name,
          avatar: profile.profile_image_url,
          accessToken: {
            create: {
              accessToken: profile.accessToken,
              refreshToken: profile.refreshToken,
            },
          },
          textOptions: defaultTextOptions as unknown as Prisma.JsonObject,
        },
        update: {
          name: profile.login,
          displayName: profile.display_name,
          avatar: profile.profile_image_url,
          accessToken: {
            update: {
              accessToken: profile.accessToken,
              refreshToken: profile.refreshToken,
            },
          },
        },
        where: {
          id: profile.id,
        },
      })
      done(null, dbUser)
    }
  )
)
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((userId: string, done) => {
  db.user
    .findUnique({
      where: {
        id: userId,
      },
      include: {
        timers: true,
      },
    })
    .then((user) => {
      done(null, user)
    })
    .catch((error) => {
      done(error)
    })
})

export function setupAuth(auth: Router) {
  auth.get('/auth/twitch', passport.authenticate('twitch'))

  auth.get(
    '/auth/callback',
    passport.authenticate('twitch', {
      successRedirect: '/',
      failureRedirect: '/',
    })
  )
}

interface TwitchUser {
  id: string
  login: string
  display_name: string
  type: string
  broadcaster_type: string
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  email?: string
  created_at: string
}
