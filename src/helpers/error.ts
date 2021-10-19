import { Response } from 'express';

export const handleError = (err, res: Response) => {
  console.error(err);
  return res.status(500).json(err);
};

export const sendErrorMessage = (code: number, err: string, res: Response) => {
  console.error({ error: err });
  return res.status(code).json({ error: err });
};
