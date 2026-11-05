import { NextFunction, Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product, { IProduct } from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

export const getProducts = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Product.find({});

    return res.send({ items, total: items.length });
  } catch (error) {
    return next(error);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const {
    title, image, category, description, price,
  }: IProduct = req.body;

  try {
    const product = await Product.create({
      title, image, category, description, price,
    });

    return res.status(201).send(product);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }

    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким заголовком уже существует'));
    }

    return next(error);
  }
};
