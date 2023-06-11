import add from './add'

describe('add', () => {
  it('adds two positive numbers', () => {
    const result = add(1, 4)
    expect(result).to.eq(5)

    const otherResult = add(10, 4)
    expect(otherResult).to.eq(14)
  })
  it('refused to add with a negative number as the first argument', () => {
    const result = add(-1, 4)
    expect(result).to.eq('I refuse to add negative numbers')
  })
  it('refused to add with a negative number as the first argument', () => {
    const result = add(1, -4)
    expect(result).to.eq('I refuse to add negative numbers')
  })
})  