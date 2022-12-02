import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Todo from 'App/Models/Todo'

export default class TodosController {
  public async index() {
    const todos = await Todo.query()
    return todos
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const todo = await Todo.find(params.id)
      if (todo) {
        return todo
      }
      return response.status(404).json({ message: 'Not found' })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ message: error })
    }
  }

  public async update({ request, params }: HttpContextContract) {
    console.log({ params })
    const todo = await Todo.find(params.id)
    if (todo) {
      todo.title = request.input('title')
      todo.desc = request.input('desc')
      todo.done = request.input('done')
      if (await todo.save()) {
        return todo
      }
      return // 422
    }
    return // 401
  }

  public async store({ request }: HttpContextContract) {
    const todo = new Todo()
    todo.title = request.input('title')
    todo.desc = request.input('desc')
    await todo.save()
    return todo
  }

  public async destroy({ response, params }: HttpContextContract) {
    await Todo.query().where('id', params.id).delete()
    return response.json({ message: 'Deleted successfully' })
  }
}
