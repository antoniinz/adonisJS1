import vine from '@vinejs/vine'

export const createUserValidator = vine.create({
  fullName: vine.string().trim().minLength(2).maxLength(100),
  email: vine.string().trim().email().normalizeEmail({ gmail_remove_dots: false }),
  password: vine.string().minLength(8).confirmed(),
})

export const updateUserValidator = vine.create({
  fullName: vine.string().trim().minLength(2).maxLength(100),
  email: vine.string().trim().email().normalizeEmail({ gmail_remove_dots: false }),
  password: vine.string().minLength(8).confirmed().optional(),
})
