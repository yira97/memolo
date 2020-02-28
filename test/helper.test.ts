import { push_with_drop, clean_duplicate, kick_some, array_equal, is_int, create_seq_between, MaxHeap, shuffle } from '../src/helper'

// 首先检验array_equal, 检验后就可以用来测试了
test('test array_equal', () => {
  let arr1 = [1, 3, 3]
  let arr2 = [1, 3, 3]
  let arr3 = [1, 3, 4]
  expect(array_equal(arr1, arr2)).toBeTruthy()
  expect(array_equal(arr2, arr1)).toBeTruthy()
  expect(!array_equal(arr1, arr3)).toBeTruthy()
  let arr4: Array<any> = ['1', '3', '3']
  expect(!array_equal(arr4, arr2)).toBeTruthy()
})

test('test push_with_drop', () => {
  const alpha_arr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n']
  const alpha_arr_old_length = alpha_arr.length
  push_with_drop(alpha_arr, 'o', {
    no_drop_before: alpha_arr.length,
    drop_alg: 'random-old'
  })
  expect(alpha_arr.some(e => e === 'o')).toBeTruthy()
  expect(alpha_arr_old_length).toBe(alpha_arr.length)

  const short_arr = ['a', 'b']

  const try_times = 1000
  let no_c = false
  for (let i = 0; i < try_times; i++) {
    const a = short_arr.slice()
    push_with_drop(a, 'c', {
      no_drop_before: 2,
      drop_alg: 'random-new'
    })
    if (!a.some(e => e === 'c')) {
      no_c = true;
      break;
    }
    expect(a.length).toBe(2)
  }
  expect(no_c).toBeTruthy()
})

test('test cleanDuplicate', () => {
  let arr = [1, 1, 3, 3, 5]
  let arr_exp = [1, 3, 5]
  clean_duplicate(arr)
  expect(array_equal(arr, arr_exp)).toBeTruthy()

  arr = [1, 1, 1, 1, 1]
  arr_exp = [1]
  clean_duplicate(arr)
  expect(array_equal(arr, arr_exp)).toBeTruthy()
})

test('test kick_some', () => {
  let arr = [1, 1, 3, 3, 5]
  let kick = [1, 5]
  let arr_exp = [3, 3]
  kick_some(arr, kick)
  expect(array_equal(arr, arr_exp)).toBeTruthy()
})

test('test is_int', () => {
  expect(is_int(5)).toBeTruthy
  expect(is_int(5.5)).toBeFalsy
  expect(is_int(0)).toBeTruthy
  expect(is_int(-1)).toBeTruthy
  expect(is_int(NaN)).toBeFalsy
  expect(is_int(Infinity)).toBeFalsy
  expect(is_int('1')).toBeFalsy
  expect(is_int({})).toBeFalsy
  expect(is_int(true)).toBeFalsy
  expect(is_int(undefined)).toBeFalsy
})

test('test create_seq_between', () => {
  expect(
    array_equal(create_seq_between(2, 5), [2, 3, 4])
  ).toBeTruthy
  expect(
    array_equal(create_seq_between(-2, 2), [-2, -1, 0, 1])
  ).toBeTruthy
  expect(
    array_equal(create_seq_between(3, 0), [3, 2, 1])
  ).toBeTruthy
})

test('test heap', () => {
  const data = create_seq_between(1, 15)
  shuffle(data)
  const h = new MaxHeap(data, (l, r) => l < r)
  expect(h.pop()).toBe(14)
  expect(h.pop()).toBe(13)
  expect(h.pop()).toBe(12)
  expect(h.pop()).toBe(11)
  expect(h.pop()).toBe(10)
  expect(h.pop()).toBe(9)
  expect(h.pop()).toBe(8)
  h.push(20)
  expect(h.pop()).toBe(20)
  expect(h.pop()).toBe(7)
})