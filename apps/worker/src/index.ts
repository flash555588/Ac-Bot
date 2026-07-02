import { Hono } from 'hono';

export type Env = {
  Bindings: {
    APP_ENV?: string;
  };
};

const app = new Hono<Env>();

app.get('/health', (c) => {
  return c.json({
    ok: true,
    service: 'ac-bot-worker',
    environment: c.env.APP_ENV ?? 'local',
  });
});

export default app;
