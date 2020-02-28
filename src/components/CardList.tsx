import React from 'react'
import { List, Button, message } from 'antd'
import { VoCard } from '../interfaces'
import { del_vocard } from '../store'
import { get_text, label } from '../i18n'

const CardList: React.FC<{
  card: Array<VoCard>,
  column?: 1 | 2 | 3 | 4 | 6 | 8 | 12 | 24,
  pageSize: number,
  onFocusCardChange: (origin: string) => void,
}> = ({ card, column = 4, pageSize, onFocusCardChange }) => {

  const delete_vocard_btn_clicked = async (origin: string) => {
    await del_vocard(origin)
    message.success(get_text(label.message_delete_vocard_success))
  }

  let padd_card: Array<VoCard | 'create_block'> = card.slice()
  if (card.length < pageSize) {
    padd_card.push('create_block')
  }
  return (
    <List
      grid={{
        gutter: 16,
        column: column,
      }}
      dataSource={padd_card}
      renderItem={(item) => {
        if (typeof item !== 'string') {
          return (
            <List.Item>
              <div
                className='CardListItem'
                style={{ position: 'relative' }}
                onClick={() => {
                  onFocusCardChange(item.origin)
                }}
              >
                <div className='TextMiddle TextUnselectable' style={{ fontSize: '3vw' }}>
                  {item.origin}
                </div>
                <Button
                  size='small'
                  type='link'
                  onClick={() => delete_vocard_btn_clicked(item.origin)}
                  style={{ position: 'absolute', top: 0, right: 0 }}
                >x</Button>
              </div>
            </List.Item>
          )
        } else if (item === 'create_block') {
          return (
            <List.Item>
              <div className='CardListItem CardListItemDashBorder'>
                <div
                  className='TextMiddle TextUnselectable'
                  onClick={() => {
                  }}
                >+</div>
              </div>
            </List.Item>
          )
        }
      }}
    ></List>
  )
}

export default CardList
