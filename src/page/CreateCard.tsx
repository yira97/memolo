import React, { useState } from 'react'
import { put_vocard, get_vocard } from '../store'
import { label, get_text } from '../i18n'
import { Col, Row, Input, Button, message } from 'antd'
import { VoCard } from '../interfaces';

function CreateCard() {
  const [inputOrigin, setinputOrigin] = useState(``);
  const [inputTranslation, setinputTranslation] = useState(``);

  const create_card = async (origin: string, translation: string) => {
    const exist = await get_vocard(origin)
    if (exist) {
      message.warn(get_text(label.message_create_vocard_duplicate))
      return;
    }
    const card: VoCard = {
      origin: origin,
      translation: translation,
      created_at: Date.now(),
    };
    await put_vocard(card)
    message.success(get_text(label.message_create_vocard_success))
  }

  return (
    <Row type="flex" justify="center">
      <Col>
        <Row>
          <Col>
            <label htmlFor={label.create_vocard_origin}>{get_text(label.create_vocard_origin)}</label>
            <Input
              type='text'
              name={label.create_vocard_origin}
              required
              minLength={1}
              onChange={v => {
                setinputOrigin(v.target.value || ``)
              }}
              value={inputOrigin}
            >
            </Input>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }}>
          <Col>
            <label htmlFor={label.create_vocard_translation}>{get_text(label.create_vocard_translation)}</label>
            <Input
              type='text'
              name={label.create_vocard_translation}
              required
              minLength={1}
              onChange={v => {
                setinputTranslation(v.target.value || ``)
              }}
              value={inputTranslation}
            ></Input>
          </Col>
        </Row>
        <Row style={{ marginTop: 10 }}>
          <Col>
            <Button type='default' onClick={() => create_card(inputOrigin, inputTranslation)}>{get_text(label.create_vocard_confirm_btn_label)}</Button>
          </Col>
        </Row>
      </Col>
    </Row >
  )
}

export default CreateCard
