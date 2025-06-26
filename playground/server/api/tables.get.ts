export default defineAdwancedEventHandler<{ name: number, cols: string[] }>(async data => {
  return t()
})


function t(): { age: number, street: string, house: number } {
  return {
    age: 18,
    street: '',
    house: 6
  }
}
