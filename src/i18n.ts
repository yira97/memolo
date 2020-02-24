interface LanguageGuide {
  cn: string,
  en: string,
}

// label
// key和value相同
export const label: { [index: string]: string } = {
  create_vocard_origin: 'create_vocard_origin',
  create_vocard_translation: 'create_vocard_translation',
  create_vocard_confirm_btn_label: 'create_vocard_confirm_btn_label',
  page_input_label: 'page_input_label',
  delete_btn_label: 'delete_btn_label',
  delete_btn_label_short: 'delete_btn_label_short',
  menu_create_word: 'menu_create_word',
  menu_edit_word: 'menu_edit_word',
  menu_test_word: 'menu_test_word',
  menu_statistic: 'menu_statistic',
  menu_widget_change_lang: 'menu_widget_change_lang',
  menu_widget_change_lang_cn: 'menu_widget_change_lang_cn',
  menu_widget_change_lang_en: 'menu_widget_change_lang_en',
  message_create_vocard_success: 'message_create_vocard_success',
  message_create_vocard_failed: 'message_create_vocard_failed',
  message_create_vocard_duplicate: 'message_create_vocard_duplicate',
  message_delete_vocard_success: 'message_delete_vocard_success',
  cardview_focus_title_label: 'cardview_focus_title_label',
  vocard_created_at: 'vocard_created_at',
  testpage_word_count_label: 'testpage_word_count_label',
  testpage_word_test_begin_btn: 'testpage_word_test_begin_btn',
}

const labels: { [index: string]: LanguageGuide } = {
  [label.create_vocard_origin]: {
    cn: '原词',
    en: 'Origin',
  },
  [label.create_vocard_translation]: {
    cn: '翻译',
    en: 'Translation',
  },
  [label.create_vocard_confirm_btn_label]: {
    cn: '创建',
    en: 'Create',
  },
  [label.page_input_label]: {
    cn: '页',
    en: 'page',
  },
  [label.delete_btn_label]: {
    cn: '删除',
    en: 'delete',
  },
  [label.menu_create_word]: {
    cn: '添加单词',
    en: 'New Word',
  },
  [label.menu_edit_word]: {
    cn: '单词列表',
    en: 'Edit WordList',
  },
  [label.menu_test_word]: {
    cn: '测试单词',
    en: 'Test',
  },
  [label.menu_widget_change_lang]: {
    cn: '语言',
    en: 'Language'
  },
  [label.menu_widget_change_lang_cn]: {
    cn: '中文',
    en: '中文',
  },
  [label.menu_widget_change_lang_en]: {
    cn: 'English',
    en: 'English',
  },
  [label.message_create_vocard_success]: {
    cn: '添加成功',
    en: 'Create Success',
  },
  [label.message_create_vocard_failed]: {
    cn: '添加失败',
    en: 'Create Failed',
  },
  [label.message_create_vocard_duplicate]: {
    cn: '单词已存在',
    en: 'Already exist',
  },
  [label.delete_btn_label_short]: {
    cn: '删除',
    en: 'Del',
  },
  [label.message_delete_vocard_success]: {
    cn: '删除卡片成功',
    en: 'delete card success'
  },
  [label.cardview_focus_title_label]: {
    cn: '单词信息',
    en: 'Word Information'
  },
  [label.vocard_created_at]: {
    cn: '创建时间',
    en: 'create time'
  },
  [label.menu_statistic]: {
    cn: '使用统计',
    en: 'Statics'
  },
  [label.testpage_word_count_label]: {
    cn: '数量',
    en: 'Count',
  },
  [label.testpage_word_test_begin_btn]: {
    cn: '开始',
    en: 'Start',
  }
};

const lang_list = [label.menu_widget_change_lang_cn, label.menu_widget_change_lang_en]
let lang = lang_list[0]

export function get_lang_list(): string[] {
  return lang_list
}

export function update_lang(l: string) {
  if (lang_list.includes(l)) {
    lang = l
  }
}

export function get_text(key: string): string {
  const l = labels[key]
  switch (lang) {
    case label.menu_widget_change_lang_cn:
      return l.cn
    case label.menu_widget_change_lang_en:
    default:
      return l.en
  }
}