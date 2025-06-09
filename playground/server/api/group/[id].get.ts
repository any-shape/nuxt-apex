type Input = {
  name: 'colors' | 'moods',
  id: number
}

export default defineAdwancedEventHandler<Input>(async data => {
  return {
    a: '',
    b: '',
    c: 5
  }
})
