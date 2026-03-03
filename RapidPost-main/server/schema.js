import Joi from 'joi'

export const blogSchema = Joi.object({
    blog: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        category: Joi.string().required(),
        image: Joi.string().allow("",null),
    }).required(),
})

export const reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required()
    }).required()
})