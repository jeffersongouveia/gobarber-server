import AppError from '@shared/errors/AppError'
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider'
import CreateUserService from '@modules/users/services/CreateUserService'

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)
  })

  it('should be able to create a new user', async () => {
    const data = {
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '(123qWe_'
    }

    const user = await createUser.execute(data)
    expect(user).toHaveProperty('id')
  })

  it('should not be able to create a new user with same email from another', async () => {
    const data = {
      name: 'Jefferson Gouveia',
      email: 'jeff.gouveia@hotmail.com',
      password: '(123qWe_'
    }

    await createUser.execute(data)
    await expect(createUser.execute(data)).rejects.toBeInstanceOf(AppError)
  })
})
