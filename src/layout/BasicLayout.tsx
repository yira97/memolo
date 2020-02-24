import React, { useState } from 'react'
import { Layout, Menu, Row, Col, Select } from 'antd'
import { label, get_text, get_lang_list, update_lang } from '../i18n'
import { HashRouter, Route, Link } from 'react-router-dom';
import CreateCard from '../page/CreateCard'
import TestPage from '../page/TestPage'
import CardView from '../page/CardView'

const rou = {
  [label.menu_create_word]: {
    parent: ``,
    link: `/menu_create_word`,
    icon: `➕`,
    page: CreateCard,
  },
  [label.menu_edit_word]: {
    parent: ``,
    link: `/menu_edit_word`,
    icon: `📄`,
    page: CardView,
  },
  [label.menu_test_word]: {
    parent: ``,
    link: `/menu_test_word`,
    icon: `♟`,
    page: TestPage,
  },
  [label.menu_statistic]: {
    parent: ``,
    link: `/menu_statistic`,
    icon: `📈`,
    page: TestPage,
  }
}
const default_page = label.menu_edit_word;

function generate_menu_item(key: string) {
  const item = rou[key];
  // 如果这个key恰好是一些key的父亲,
  //   那么他是一个submenu,
  //   否则他是一个item
  const children = Object.keys(rou).filter(k => rou[k].parent === key)
  return (children.length > 0) ?
    (
      <Menu.SubMenu
        key={key}
        title={get_text(key)}
      >
        {children.map(c => (
          <Menu.Item key={c}>
            <Link to={rou[c].link}>
              {rou[c].icon}{get_text(c)}
            </Link>
          </Menu.Item>
        ))}
      </Menu.SubMenu>
    ) : (
      <Menu.Item key={key}>
        <Link to={item.link}>
          {item.icon}
          <span>{get_text(key)}</span>
        </Link>
      </Menu.Item>
    )
}

const BasicLayout = () => {
  const [lang, setlang] = useState(get_lang_list()[0])

  return (
    < HashRouter >
      <Layout className="layout" style={{ backgroundColor: 'white' }}>
        <Layout.Header style={{ backgroundColor: 'white' }}>
          <Row>
            <Col span={21}>
              <Menu
                style={{ lineHeight: '64px' }}
                mode="horizontal"
                theme="light"
                defaultSelectedKeys={[label.menu_edit_word]}
              >
                {Object.keys(rou).filter(k => rou[k].parent === ``).map(generate_menu_item)}
              </Menu>
            </Col>
            <Col span={3}>
              <Select
                defaultValue={get_lang_list()[0]}
                onChange={(v: string) => {
                  update_lang(v)
                  setlang(v)
                }}
                optionLabelProp='label'
              >
                {get_lang_list().map(l => (
                  <Select.Option key={l} value={l} label={get_text(l)}>{get_text(l)}</Select.Option>
                ))}
              </Select>
            </Col>
          </Row>

        </Layout.Header>
        <Layout.Content style={{ marginTop: 30, backgroundColor: 'white' }}>
          {/* 首页默认元素应和menu中的默认元素保持对应 */}
          <Route exact path={'/'} component={rou[default_page].page} />
          <Route exact path={rou[label.menu_create_word].link} component={rou[label.menu_create_word].page} />
          <Route exact path={rou[label.menu_edit_word].link} component={rou[label.menu_edit_word].page} />
          <Route exact path={rou[label.menu_test_word].link} component={rou[label.menu_test_word].page} />
          <Route exact path={rou[label.menu_statistic].link} component={rou[label.menu_statistic].page} />
        </Layout.Content>
      </Layout>
    </HashRouter>
  )
}

export default BasicLayout
