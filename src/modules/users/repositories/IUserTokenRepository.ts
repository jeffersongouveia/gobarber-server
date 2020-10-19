import UserToken from '@modules/users/infra/database/entities/UserToken'

export default interface IUserTokenRepository {
  generate(userId: string): Promise<UserToken>
}
