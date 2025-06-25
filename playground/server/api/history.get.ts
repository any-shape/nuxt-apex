export default defineAdwancedEventHandler<{ test: number, tst3: string }>(async data => {
  return t()
})


function t(): Output {
  return {
    a: '',
    b: '',
    c: 6
  }
}
