import { celebrate, Joi, Segments } from 'celebrate';
import validator from 'validator';

export const validateProductBody = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().required().min(2).max(30),
    image: Joi.object({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
    category: Joi.string().required(),
    description: Joi.string().allow(''),
    price: Joi.number().allow(null),
  }),
});

export const validateOrderBody = celebrate({
  [Segments.BODY]: Joi.object({
    payment: Joi.string().required().valid('card', 'online'),
    email: Joi.string().required().custom((value: string, helpers) => (
      validator.isEmail(value) ? value : helpers.error('string.email')
    )),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().required(),
    items: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
  }),
});
