import { rest, setupWorker } from 'msw';

export const handlers = [
  rest.get("/blah", (_req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ ok: "foo" }));
  }),

  rest.post<{ username: string; password: string }>(
    '/auth',
    (req, res, ctx) => {
      const { username, password } = req.body;
      if (username === 'testuser' && password === 'testpassword') {
        return res(ctx.status(200), ctx.json({ message: 'Authenticated' }));
      } else {
        return res(
          ctx.status(401),
          ctx.json({ message: 'Bad username or password' })
        );
      }
    }
  ),
];

export const worker = setupWorker(...handlers);
