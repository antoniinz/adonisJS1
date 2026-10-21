import router from '@adonisjs/core/services/router'
const UsersController = () => import('#controllers/users_controller')

router.get('/', async ({ response }) => response.redirect('/users'))

router.get('/users', [UsersController, 'index'])
router.get('/users/create', [UsersController, 'create'])
router.post('/users', [UsersController, 'store'])
router.get('/users/:id/edit', [UsersController, 'edit'])
router.post('/users/:id', [UsersController, 'update'])
router.post('/users/:id/delete', [UsersController, 'destroy'])
