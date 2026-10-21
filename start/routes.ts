import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const NewAccountController = () => import('#controllers/new_account_controller')
const SessionController = () => import('#controllers/session_controller')
const UsersController = () => import('#controllers/users_controller')

// Routy z kitu
router.get('/', ({ response }) => response.redirect('/users')).as('home')

router.get('signup', [NewAccountController, 'create']).as('new_account.create').use(middleware.guest())
router.post('signup', [NewAccountController, 'store']).as('new_account.store').use(middleware.guest())

router.get('login', [SessionController, 'create']).as('session.create').use(middleware.guest())
router.post('login', [SessionController, 'store']).as('session.store').use(middleware.guest())
router.post('logout', [SessionController, 'destroy']).as('session.destroy').use(middleware.auth())

router.on('/dashboard').render('pages/dashboard').as('dashboard').use(middleware.auth())

// Správa uživatelů
router.get('/users', [UsersController, 'index'])
router.get('/users/create', [UsersController, 'create'])
router.post('/users', [UsersController, 'store'])
router.get('/users/:id', [UsersController, 'show'])
router.get('/users/:id/edit', [UsersController, 'edit'])
router.post('/users/:id', [UsersController, 'update'])
router.post('/users/:id/delete', [UsersController, 'destroy'])
