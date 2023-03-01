import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { method, query } = req;
  console.log({ method, query });

  switch (method) {
    case 'GET':
      res.status(200).json({ name: `Mumble detail ${query.id}` });
      break;

    case 'POST':
      res.status(200).json({ name: 'POST successful' });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
