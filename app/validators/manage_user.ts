import vine from '@vinejs/vine'

export const createUserValidator = vine.create({
  fullName: vine.string().trim().minLength(2),
  email: vine.string().trim().email().normalizeEmail(),
  password: vine.string().minLength(8),
})

export const updateUserValidator = vine.create({
  fullName: vine.string().trim().minLength(2),
  email: vine.string().trim().email().normalizeEmail(),
})
