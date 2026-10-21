import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/manage_user'

export default class UsersController {
  async index({ view }: HttpContext) {
    const users = await User.query().orderBy('id', 'desc')
    return view.render('pages/users/index', { users })
  }

  async create({ view }: HttpContext) {
    return view.render('pages/users/create')
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(createUserValidator)

    if (await User.findBy('email', data.email)) {
      session.flash('error', 'Uživatel s tímto e-mailem už existuje.')
      return response.redirect().back()
    }

    await User.create(data)
    session.flash('success', 'Uživatel byl vytvořen.')
    return response.redirect('/users')
  }

  async edit({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return view.render('pages/users/edit', { user })
  }

  async update({ params, request, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const data = await request.validateUsing(updateUserValidator)

    const other = await User.findBy('email', data.email)
    if (other && other.id !== user.id) {
      session.flash('error', 'Tento e-mail už používá jiný uživatel.')
      return response.redirect().back()
    }

    user.merge(data)
    await user.save()
    session.flash('success', 'Uživatel byl upraven.')
    return response.redirect('/users')
  }

  async destroy({ params, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    session.flash('success', 'Uživatel byl smazán.')
    return response.redirect('/users')
  }
}
