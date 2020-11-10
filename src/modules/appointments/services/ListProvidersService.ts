import { inject, injectable } from 'tsyringe'
import { classToClass } from 'class-transformer'

import User from '@modules/users/infra/database/entities/User'

import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

@injectable()
class ListProvidersService {
  private repository: IUsersRepository
  private cache: ICacheProvider

  constructor(
    @inject('UsersRepository')
    repository: IUsersRepository,

    @inject('CacheProvider')
    cache: ICacheProvider
  ) {
    this.repository = repository
    this.cache = cache
  }

  public async execute(exceptionUserID: string): Promise<User[]> {
    let users = await this.cache.recover<User[]>(exceptionUserID)

    if (!users) {
      users = await this.repository.findAllProviders(exceptionUserID)
      await this.cache.save(`providers-list:${exceptionUserID}`, classToClass(users))
    }

    return users
  }
}

export default ListProvidersService
