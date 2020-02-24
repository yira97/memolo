import React, { useState, useEffect } from 'react'
import { Row, Col, InputNumber, Button } from 'antd'
import { get_text, label } from '../i18n'
import { VoCard } from '../interfaces'
import { get_vocards_by } from '../db'
import { select_some, clean_duplicate, shuffle } from '../helper'

interface TestProcess {
  card_idx: number
}

function newTestProcess(): TestProcess {
  return {
    card_idx: 0,
  }
}

const TestPage = () => {
  const [inputCount, setinputCount] = useState(10)
  const [onTest, setonTest] = useState(false)
  const [testWord, settestWord] = useState<VoCard[]>([])
  const [testProcess, settestProcess] = useState<TestProcess>()
  const [translationSet, settranslationSet] = useState<string[]>([])

  const updateTestWord = async () => {
    const word = await get_vocards_by(inputCount, () => true);
    const translations = word.map(w => w.translation)
    clean_duplicate(translationSet)
    settranslationSet(translations)
    settestWord(word)
    settestProcess(newTestProcess())
  }



  useEffect(() => {
    updateTestWord()
  }, [onTest])

  if (!onTest) {
    return (
      <>
        <Row type="flex" justify="center">
          <Col span={2}>
            <label>{get_text(label.testpage_word_count_label)}</label></Col>
          <Col span={4}>
            <InputNumber
              min={1}
              max={20}
              size="small"
              style={{ marginLeft: 10 }}
              value={inputCount}
              onChange={(v) => setinputCount(v || 1)}
            />
          </Col>
        </Row>
        <Row type="flex" justify="center" style={{ marginTop: '30vh' }}>
          <Col>
            <Button onClick={() => { setonTest(true) }}>
              {get_text(label.testpage_word_test_begin_btn)}
            </Button>
          </Col>
        </Row>
      </>
    )
  } else if (testProcess && testProcess.card_idx < testWord.length) {
    const this_word = testWord[testProcess.card_idx];
    const sels = [...select_some(translationSet, 3)];
    sels.push(this_word.translation);
    shuffle(sels)
    return (
      <>
        <Row type="flex" justify="center">
          <Col>
            {this_word.origin}
          </Col>
        </Row>
        <Row type="flex" justify="center" style={{ marginTop: 20 }}>
          {sels.map(tr => (
            <Col span={4}>
              <Button key={tr} onClick={() => {
                if (this_word.translation === tr) {
                  alert(`✅`)
                } else {
                  alert(`❌`)
                }
                settestProcess({ ...testProcess, card_idx: testProcess.card_idx + 1 })
              }}>{tr}</Button>
            </Col>
          ))}
        </Row>
      </>
    )
  } else {
    setonTest(false);
    return (<></>)
  }
}

export default TestPage
