export default defineApexHandler<{ a: string, b: number, d: string, t: boolean }>(data => {
  return { "data": "test" }
});
