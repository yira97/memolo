import React, { useState, useEffect } from 'react'
import { get_vocards } from '../db'
import { VoCard } from '../interfaces'
import { Row, Col, Descriptions } from 'antd'
import CardList from '../components/CardList'
import Page, { PageChangeCallbackReturn } from '../components/Page'
import { get_text, label } from '../i18n'

const page_size = 6;

const CardView = () => {
  const [saved_cards, setsaved_cards] = useState<VoCard[]>([])
  const [current_page, setcurrent_page] = useState<number>(1)
  const [has_next_page, sethas_next_page] = useState<boolean>(true)
  const [focus_word, setfocus_word] = useState<VoCard>()

  const load_vocards = async (page: number) => {
    const vocards = await get_vocards(page, page_size)
    setsaved_cards(vocards.data)
    if (vocards.end) {
      sethas_next_page(false)
    }
  }

  useEffect(() => {
    load_vocards(current_page)
  }, [current_page])

  const handlePageChange = (page: number): PageChangeCallbackReturn | void => {
    setcurrent_page(page)
    if (!has_next_page) {
      return { max: current_page }
    }
  }

  return (
    <>
      <div id='CardListHeightHolder'>
        <Row>
          <Col span={11}>
            <CardList
              pageSize={page_size}
              card={saved_cards}
              column={2}
              onFocusCardChange={(origin) => {
                const focus = saved_cards.find(w => w.origin === origin)
                if (focus) {
                  setfocus_word(focus)
                }
              }}
            />
          </Col>
          <Col span={11} offset={2}>
            <Descriptions title={get_text(label.cardview_focus_title_label)} column={2}>
              <Descriptions.Item label={get_text(label.create_vocard_origin)}>{focus_word?.origin}</Descriptions.Item>
              <Descriptions.Item label={get_text(label.create_vocard_translation)}>{focus_word?.translation}</Descriptions.Item>
              <Descriptions.Item span={2} label={get_text(label.vocard_created_at)}>{new Date(focus_word?.created_at || 0).toLocaleDateString()}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </div>
      <Page onPageChange={handlePageChange} minPage={1} />
    </>
  )
}

export default CardView