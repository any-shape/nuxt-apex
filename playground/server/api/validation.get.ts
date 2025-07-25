export default defineApexHandler<{ a: string, b: number, d: string, t: boolean }>(data => {
  return { "data": "test" }
}, (z) => ({
  a: z.string(),
  b: z.coerce.number(),
  d: z.string(),
  t: z.boolean()
}));

//
