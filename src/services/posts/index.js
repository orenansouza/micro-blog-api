const models = require('../../../models')

function responseWithPagination(data, page, limit) {
  const { count: totalItems, rows: posts } = data
  const currentPage = page ? +page : 1
  const totalPages = Math.ceil(totalItems / limit)

  return { pagination: { totalItems, totalPages, currentPage }, posts }
}

exports.createPost = async ({ text, user_id }) => {
  return models.Post.create({ text, user_id })
    .then((post) => {
      return { success: true, post }
    })
    .catch((err) => {
      if (err.parent.code === '23503') {
        return { success: false, message: 'Usuário não existe' }
      }

      return { success: false, message: err.message }
    })
}

exports.listAllPosts = async ({ page = 0, limit = 10 }) => {
  const offset = page ? page * limit : 0

  const posts = await models.Post.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    where: {},
  })

  return responseWithPagination(posts, page, limit)
}