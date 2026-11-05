import { NextFunction, Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { items, total }: { items: string[]; total: number } = req.body;

  try {
    const products = await Product.find({ _id: { $in: items } });
    const priceById = new Map(products.map((product) => [product._id.toString(), product.price]));

    const missingId = items.find((id) => !priceById.has(id));
    if (missingId) {
      return next(new BadRequestError(`Товар с id ${missingId} не найден`));
    }

    const notForSaleId = items.find((id) => priceById.get(id) === null);
    if (notForSaleId) {
      return next(new BadRequestError(`Товар с id ${notForSaleId} не продается`));
    }

    const sum = items.reduce((acc, id) => acc + Number(priceById.get(id)), 0);
    if (sum !== total) {
      return next(new BadRequestError('Неверная сумма заказа'));
    }

    return res.send({ id: faker.string.uuid(), total });
  } catch (error) {
    return next(error);
  }
};

export default createOrder;
