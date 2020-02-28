import { isArray } from "util";

/**
 * 有一定掉落规则的push操作
 * @param arr 操作数组(会修改)
 * @param e (新元素)
 * @param rule (drop规则)
 */
export function push_with_drop<T>(arr: Array<T>, e: T | Array<T>, rule: {
  no_drop_before: number,
  drop_alg: 'random-old' | 'random-new'
}) {
  const origin_length = arr.length;
  if (isArray(e)) {
    arr.push(...e)
  } else {
    arr.push(e)
  }
  let up_limit: number;
  switch (rule.drop_alg) {
    case 'random-old':
      up_limit = origin_length
      break;
    case 'random-new':
      up_limit = arr.length
      break;
    default:
      up_limit = origin_length
  }
  if (arr.length <= rule.no_drop_before) {
    return;
  }

  const kick_range = arr.slice(0, up_limit)
  const need_kick_count = arr.length - rule.no_drop_before;
  const kick_list = select_some(kick_range, need_kick_count)
  kick_some(arr, kick_list)
}

/**
 * 交换数组中的两个元素
 * @param arr 操作数组(会修改)
 * @param i 第一个元素索引
 * @param j 第二个元素索引
 */
export function array_swap<T>(arr: Array<T>, i: number, j: number) {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}

/**
 * 打乱数组排列顺序
 * @param arr 操作数组(会修改)
 */
export function shuffle<T>(arr: Array<T>) {
  for (let i = 0; i < arr.length; i++) {
    const idxb = Math.floor(Math.random() * arr.length)
    const idxa = Math.floor(Math.random() * arr.length)
    if (idxa !== idxb) {
      array_swap(arr, idxa, idxb)
    }
  }
}

/**
 * 从数组中移除部分元素
 * @param arr 操作数组(会改变原数组, 如果存在重复元素, 都会清除)
 * @param kick_list 待移除元素(最好没有重复的元素)
 */
export function kick_some<T>(arr: Array<T>, kick_list: Array<T>) {
  const kick_set = new Set<T>(kick_list)
  let kick_idx_list: Array<number> = [];
  kick_set.forEach((k) => kick_idx_list.push(...arr.reduce((is: Array<number>, e, i) => {
    if (e === k) {
      is.push(i)
    }
    return is
  }, [])))
  kick_idx_list.sort()
  kick_idx_list.reverse()
  // 这里已经包含了可能的重复元素的多个索引
  kick_idx_list.forEach(k => arr.splice(k, 1))
}

/**
 * 从数组中随机选取一部分元素, 仍保留相对顺序
 * @param arr 操作数组 (根据配置可能会修改原数组)
 * @param count 选取元素个数
 * @param change_origin 具体配置
 */
export function select_some<T>(arr: Array<T>, count: number, option?: {
  change_origin?: boolean
}): Array<T> {
  // 找出选中的元素
  const arr_bk = arr.slice()
  shuffle(arr_bk)
  const selc_list = arr_bk.slice(0, count)
  // 如果配置-修改原数组, 从数组中移除选中元素
  if (option?.change_origin) {
    kick_some(arr, selc_list)
  }
  return selc_list
}

/**
 * 去除重复元素, 保留相对顺序
 * @param arr 操作数组(原地修改)
 */
export function clean_duplicate<T>(arr: Array<T>) {
  const met = new Set();
  const dup_idx: number[] = [];
  arr.forEach((e, i) => {
    if (met.has(e)) {
      dup_idx.push(i)
    } else {
      met.add(e)
    }
  })
  dup_idx.reverse().forEach(dup => {
    arr.splice(dup, 1)
  })
}

/**
 * 判断两个数组是否相等, 可自行指定比较函数
 * @param arr1 第一个数组
 * @param arr2 第二个数组
 * @param option 配置
 */
export function array_equal<T>(arr1: Array<T>, arr2: Array<T>, option?: {
  equal_method?: (e1: T, e2: T) => boolean
}): boolean {
  if (arr1.length !== arr2.length) {
    return false
  }
  for (const i in arr1) {
    const equal_method = option?.equal_method
    const equal_success = equal_method ? equal_method(arr1[i], arr2[i]) : arr1[i] === arr2[i]
    if (!equal_success) {
      return false
    }
  }
  return true
}

export interface Heap<T> {
  peak(): T | undefined
  size(): number
  pop(): T | undefined
  push(e: T): void
}

export function createMaxHeap<T>(less: (l1: T, l2: T) => boolean): Heap<T> {
  return new MaxHeap([], less)
}

export function createMinHeap<T>(greater: (l1: T, l2: T) => boolean): Heap<T> {
  return new MaxHeap([], greater)
}

export class MaxHeap<T> implements Heap<T>{
  // m_data: 数组长度就是目前堆的长度
  private m_data: T[] = []
  private less_than: (l: T, r: T) => boolean

  constructor(init_data: T[], less_than: (l: T, r: T) => boolean) {
    this.less_than = less_than

    this.m_data.push(...init_data)
    // 完成堆结构
    this.maintain_struct()
  }

  public peak(): T | undefined {
    if (this.m_data[0] === undefined) {
      return undefined
    }
    return this.m_data[0]
  }

  public size(): number {
    return this.m_data.length
  }

  public pop(): T | undefined {
    if (this.m_data[0] === undefined) {
      return undefined
    }
    const find = this.m_data[0]
    this._rm_top()
    return find
  }

  public push(e: T): void {
    this._insert(e)
  }

  /**
   * 直接插入元素, 并维护结构
   * @param e 插入元素
   */
  private _insert(e: T): void {
    this.m_data.push(e)
    this.maintain_struct()
  }

  /**
   * 移除顶部, 并维护结构
   */
  private _rm_top() {
    if (this.m_data.length <= 0) {
      return
    }
    array_swap(this.m_data, 0, this.m_data.length - 1)
    this.m_data.pop()
    this.maintain_top()
  }

  /**
   * 将 i 结点以下的堆整理为大顶堆
   * @param i m_data的索引
   */
  private _shift_down(i: number) {
    // 1. 叶子结点, 没必要整理
    // 2. i超过边界, 没必要处理
    if (i > Math.floor(this.m_data.length / 2 - 1)) {
      return
    }
    let dad = this.m_data[i];

    for (let child_i = 2 * i + 1; child_i < this.m_data.length; child_i = 2 * child_i + 1) {
      dad = this.m_data[i];
      // 如果右孩子存在,并且右孩子比左孩子大, 那就把j换成右孩子
      if (child_i + 1 < this.m_data.length && this.less_than(this.m_data[child_i], this.m_data[child_i + 1])) {
        child_i++
      }
      if (this.less_than(dad, this.m_data[child_i])) {
        array_swap(this.m_data, i, child_i)
        i = child_i
      } else {
        break
      }
    }
  }

  /**
   * 维护顶部
   * 当只有根不满足堆结构时, 才生效
   */
  private maintain_top() {
    this._shift_down(0)
  }

  /**
   * 维护整体
   * 任何情况都可调用.
   * 如果只修改了顶部, 使用 @maintain_top
   */
  private maintain_struct() {
    for (let i = Math.floor(this.m_data.length / 2 - 1); i >= 0; i--) {
      this._shift_down(i)
    }
  }
}


/*
Return true if the input is a value of type number, otherwise return false
*/
export function is_int(n: any) {
  if (typeof n !== `number`) {
    return false
  }
  if (Math.floor(n) !== n) {
    return false
  }
  return true
}

/*
if either of the parameters not a valid integer, throw a exception.
if left < right,
return a sequence from left to right (right not included)
if left > right,
return a sequence from left to right (right not included)
*/
export function create_seq_between(left: number, right: number) {
  if (!is_int(left) || !is_int(right)) {
    throw new Error(`input invalid: not int`)
  }
  const step = left > right ? -1 : 1
  const seq = []
  for (let i = left; i !== right; i += step) {
    seq.push(i)
  }
  return seq
}