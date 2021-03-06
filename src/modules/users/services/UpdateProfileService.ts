import { inject, injectable } from 'tsyringe'

import User from '@modules/users/infra/database/entities/User'
import AppError from '@shared/errors/AppError'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider'

interface IRequest {
  user_id: string
  name: string
  email: string
  is_hairstylist?: boolean
  current_password?: string
  new_password?: string
}

@injectable()
class UpdateProfileService {
  private repository: IUsersRepository
  private hash: IHashProvider

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository,

    @inject('HashProvider')
    hash: IHashProvider
  ) {
    this.repository = repository
    this.hash = hash
  }

  public async execute(data: IRequest): Promise<User> {
    const user = await this.repository.findById(data.user_id)

    if (!user) {
      throw new AppError('User not found')
    }

    const userWithSameEmail = await this.repository.findByEmail(data.email)
    if (userWithSameEmail && userWithSameEmail.id !== data.user_id) {
      throw new AppError('This e-mail is already in use')
    }

    if (data.new_password && !data.current_password) {
      throw new AppError('You need inform the old password to set a new one')
    }

    if (data.new_password && data.current_password) {
      const oldPasswordMatch = await this.hash.compare(data.current_password, user.password)
      if (!oldPasswordMatch) {
        throw new AppError('Wrong old password')
      }

      user.password = await this.hash.generate(data.new_password)
    }

    if (data.is_hairstylist !== undefined) {
      user.is_hairstylist = data.is_hairstylist
    }

    user.name = data.name
    user.email = data.email

    return this.repository.save(user)
  }
}

export default UpdateProfileService
