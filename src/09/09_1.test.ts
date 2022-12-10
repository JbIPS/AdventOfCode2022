import { computeNextTailPosition } from './09_1'

describe('9_1', () => {
  it('tail does not move if head does not move', () => {
    expect(computeNextTailPosition([0, 0], [0, 0])).toStrictEqual([0, 0])
  })

  /*
    .....    .....    .....
    .TH.. -> .T.H. -> ..TH.
    .....    .....    .....
  */
  it('moves horizontally', () => {
    expect(computeNextTailPosition([3, 1], [1, 1])).toStrictEqual([2, 1])
  })

  /*
    ...    ...    ...
    .T.    .T.    ...
    .H. -> ... -> .T.
    ...    .H.    .H.
    ...    ...    ...
  */
  it('moves horizontally', () => {
    expect(computeNextTailPosition([1, 1], [1, 3])).toStrictEqual([1, 2])
  })

  /*
    .....    .....    .....
    .....    ..H..    ..H..
    ..H.. -> ..... -> ..T..
    .T...    .T...    .....
    .....    .....    .....
  */
  it('moves diagonally 1', () => {
    console.log(computeNextTailPosition([2, 3], [1, 1]))
    expect(computeNextTailPosition([2, 3], [1, 1])).toStrictEqual([2, 2])
  })
})
