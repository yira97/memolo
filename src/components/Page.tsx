import React, { useState, useEffect } from 'react'
import { Row, Col, Input, Button } from 'antd'
import { label, get_text } from '../i18n'

const UNLIMIT_PAGE = -1;
const DEFAULT_MIN_PAGE = 1;
export interface PageChangeCallbackReturn {
  max: number
}

const Page: React.FC<{
  onPageChange: (page: number) => PageChangeCallbackReturn | void,
  minPage?: number,
  defaultPage?: number,
}> = ({
  onPageChange,
  minPage = DEFAULT_MIN_PAGE,
  defaultPage, // 默认等同于minPage
}) => {
    // 如果传递进来的defaultPage非法就抛异常
    if (defaultPage && defaultPage < minPage) {
      throw new Error('defaultPage < minPage')
    }
    // current_page: 如果defaultPage没配置, 那就用minPage
    const [current_page, setcurrent_page] = useState<number>(defaultPage === undefined ? minPage : defaultPage)
    // max_page: 默认无限制
    const [max_page, setmax_page] = useState<number>(UNLIMIT_PAGE)

    useEffect(() => {
      const update_result = onPageChange(current_page)
      if (update_result) {
        if (update_result.max >= minPage) {
          setmax_page(update_result.max)
        } else {
          console.log(`update max page invalid. max:${update_result.max}, min:${minPage}`)
        }
      } else {
        // 没有返回值, 说明没有最大页限制. 如果已经设置了最大页限制, 就取消
        if (max_page !== UNLIMIT_PAGE) {
          setmax_page(UNLIMIT_PAGE)
        }
      }
    }, [current_page])

    return (
      <Row>
        <Col span={2}>
          <Input
            type='text'
            name={label.page_input_label}
            size='small'
            required
            minLength={1}
            onChange={v => {
              let p = Number(v.target.value);
              if (p && p >= minPage) {
                setcurrent_page(p);
              }
            }}
            value={current_page}
          ></Input>
        </Col>
        <Col span={1}>
          <label htmlFor={label.page_input_label}>{get_text(label.page_input_label)}</label>
        </Col>
        <Col span={1}>
          <Button
            size='small'
            shape='circle'
            onClick={() => {
              if (current_page > 1) {
                setcurrent_page(current_page - 1)
              }
            }}
            disabled={current_page === minPage ? true : undefined}
          >-</Button>
        </Col>
        <Col span={1}>
          <Button
            shape='circle'
            size='small'
            onClick={() => setcurrent_page(current_page + 1)}
            disabled={max_page !== UNLIMIT_PAGE && max_page <= current_page ? true : undefined}
          >+</Button>
        </Col>
      </Row>
    )
  }

export default Page
