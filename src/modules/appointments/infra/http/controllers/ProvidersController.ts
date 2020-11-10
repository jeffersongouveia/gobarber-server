import { Request, Response } from 'express'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

import ListProvidersService from '@modules/appointments/services/ListProvidersService'

class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listProviders = container.resolve(ListProvidersService)
    const providers = await listProviders.execute(request.user.id)

    return response.json(classToClass(providers))
  }
}

export default ProvidersController
