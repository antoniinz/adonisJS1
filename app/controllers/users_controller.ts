import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/manage_user'

const PER_PAGE = 10

export default class UsersController {
  async index({ request, view }: HttpContext) {
    const page = Math.max(1, Number(request.input('page', 1)) || 1)
    const search = String(request.input('search', '')).trim()

    const query = User.query().orderBy('id', 'desc')
    if (search) {
      query.where((q) => {
        q.where('full_name', 'like', `%${search}%`).orWhere('email', 'like', `%${search}%`)
      })
    }

    const paginator = await query.paginate(page, PER_PAGE)
    const totalRow = await User.query().count('* as total').firstOrFail()

    return view.render('pages/users/index', {
      users: paginator.all(),
      page: paginator.currentPage,
      lastPage: paginator.lastPage,
      found: paginator.total,
      total: Number(totalRow.$extras.total),
      search,
      qs: search ? `&search=${encodeURIComponent(search)}` : '',
    })
  }

  async show({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return view.render('pages/users/show', { user })
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

    await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    })

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

    user.fullName = data.fullName
    user.email = data.email
    if (data.password) {
      user.password = data.password
    }
    await user.save()

    session.flash('success', 'Změny byly uloženy.')
    return response.redirect(`/users/${user.id}`)
  }

  async destroy({ params, response, session }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()

    session.flash('success', `Uživatel ${user.email} byl smazán.`)
    return response.redirect('/users')
  }
}
