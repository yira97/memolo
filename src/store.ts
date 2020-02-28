import { set_data, KEY_PREFIX, get_data, get_slice, remove_data } from './db'
import { VoCard } from './interfaces'

/**
 * 保存单词卡
 */
export async function put_vocard(card: VoCard) {
  await set_data([KEY_PREFIX.vocabulary_card, card.origin], card);
}

/**
 * 读取单词卡
 */
export async function get_vocard(origin: string) {
  try {
    const data = await get_data([KEY_PREFIX.vocabulary_card, origin]);
    return data;
  } catch (e) {
    return undefined;
  }
}

/**
 * 批量读取单词卡
 */
export async function get_vocards(page: number, page_size: number): Promise<{ data: Array<VoCard>, end: boolean }> {
  return await get_slice([KEY_PREFIX.vocabulary_card], { page: page, page_size: page_size });
}

/**
 * 读取特定单词卡
 */
export async function get_vocards_by(max_count: number, select_method: (card: VoCard) => boolean): Promise<Array<VoCard>> {
  const batch = 100;
  let current_page = 1;
  const select_card: VoCard[] = [];
  while (select_card.length < max_count) {
    const cards = await get_vocards(current_page, batch);
    select_card.push(...cards.data.filter(card => select_method(card)));
    if (cards.end || select_card.length >= max_count) {
      break;
    }
    current_page++;
  }
  if (select_card.length > max_count) {
    return select_card.slice(0, max_count);
  }
  return select_card;
}

/**
 * 按照优先级返回前max_count个元素
 */
export async function get_vocards_order_by(max_count: number, score_method: (card: VoCard) => number): Promise<Array<VoCard>> {
  const select_card: { data: VoCard, score: number }[] = [];
  const batch = 100;
  let current_page = 1;
  let ongoing = true;
  while (ongoing) {
    const cards = await get_vocards(current_page, batch);
    for (const card of cards.data) {
      const card_score = score_method(card);
      if (select_card.length < card_score) {
        select_card.push({
          data: card,
          score: card_score,
        });
      } else {
        // heap_sort
      }
    }
    if (cards.end) {
      ongoing = false;
    }
  }
  return select_card.map(c => c.data);
}

/**
 * 删除单词
 * @param origin 单词原文
 */
export async function del_vocard(origin: string) {
  return await remove_data([KEY_PREFIX.vocabulary_card, origin]);
}