export default defineAdwancedEventHandler<{ test: number }>(async data => {
  return t()
})


function t(): Output {
  return {
    a: '',
    b: '',
    c: 6
  }
}
