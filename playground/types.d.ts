declare global {
  type Input = {
    name: 'colors' | 'moods',
    id: number
  }

  type Output = {
    a: string,
    b: string,
    c: number
  }
}

export {}
