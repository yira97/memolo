const level = require('level');
const db_name = 'my-db2';
const db = level(db_name, { valueEncoding: 'json' });

const KEY_PREFIX = {
  vocabulary_card: 'vocabulary_card',
  statistic: 'statistic'
};
const KEY_SPLITOR = `~`;

/**
 * 构成:
 * GLOBALKEY\~SUBKEY1\~SUBKEY2\~
 * @param {string} main_key 
 * @param {Array<string>} sub_key 
 */
function get_key(main_key, sub_key) {
  if (!Array.isArray(sub_key)) {
    throw new Error(`sub_key not an array`);
  }
  const key_prefix = KEY_PREFIX[main_key];
  if (key_prefix === undefined) {
    throw new Error(`main_key not exist`);
  }
  let key = key_prefix + KEY_SPLITOR;

  for (const s_key of sub_key) {
    key += s_key;
    key += KEY_SPLITOR;
  }
  return key;
}

/**
 * 
 * @param {Array<string>} keys 
 * @param {any} value 
 */
async function set_data(keys, value) {
  const key = get_key(keys[0], keys.slice(1));
  await db.put(key, value);
}

/**
 * 
 * @param {Array<string>} keys 
 */
async function get_data(keys) {
  const key = get_key(keys[0], keys.slice(1));
  return await db.get(key);
}

async function remove_data(keys) {
  const key = get_key(keys[0], keys.slice(1));
  return await db.del(key);
}

/**
 * page is start from 1
 * @param {Array<string>} keys 
 * @param {{page:number, page_size:number}} option 
 * @returns {{data:Array<any>, end: bool}}
 */
async function get_slice(keys, option) {
  if (option === undefined || option.page < 1 || option.page_size < 0) {
    throw new Error(`非法page或page_size`);
  }
  const key = get_key(keys[0], keys.slice(1));
  // limit 比需求多一个, 用于确认是否已到末尾
  const read_option = {
    gt: key,
    lt: key.slice(0, key.length - 1) + String.fromCharCode(key[key.length - 1].charCodeAt() + 1),
    limit: option.page * option.page_size + 1,
    keys: false,
    value: true,
  };
  const query_data = [];
  const readStream = db.createReadStream(read_option);
  let count = 0;
  let end = true;
  readStream.on('data', function (this_data) {
    ++count;
    if (count < (option.page - 1) * option.page_size + 1) return;
    if (read_option.limit === count) {
      end = false;
      return;
    }
    query_data.push(this_data);
  });
  return new Promise(function (resolve) {
    readStream.on('end', function () {
      resolve({
        data: query_data,
        end: end,
      });
    });
  });
}

//
//
// vocabulary card
//
//

/**
 * 保存单词卡
 * @param {VoCard} card 
 */
async function put_vocard(card) {
  await set_data([KEY_PREFIX.vocabulary_card, card.origin], card);
}

/**
 * 读取单词卡
 * @param {string} origin 
 */
async function get_vocard(origin) {
  try {
    const data = await get_data([KEY_PREFIX.vocabulary_card, origin]);
    return data;
  } catch (e) {
    return undefined;
  }
}

/**
 * 批量读取单词卡
 * @param {number} page 
 * @param {number} page_size 
 * @returns {{data: Array<any>, end: boolean}}
 */
async function get_vocards(page, page_size) {
  return await get_slice([KEY_PREFIX.vocabulary_card], { page: page, page_size: page_size });
}

/**
 * 读取特定单词卡
 * @param {number} max_count
 * @param {(vocard:VoCard) => boolean} select_method
 */
async function get_vocards_by(max_count, select_method) {
  const batch = 100;
  let current_page = 1;
  const select_card = [];
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
 * @param {number} max_count 
 * @param {(Vocard:VoCard)=>number} score_method 
 */
async function get_vocards_order_by(max_count, score_method) {
  const select_card = [];
  const batch = 100;
  let current_page = 1;
  let ongoing = true;
  while (ongoing) {
    const cards = await get_vocards(current_page, batch);
    for (const card of cards) {
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
 * 
 * @param {string} origin 
 */
async function del_vocard(origin) {
  return await remove_data([KEY_PREFIX.vocabulary_card, origin]);
}

module.exports = {
  get_vocard: get_vocard,
  get_vocards: get_vocards,
  get_vocards_by: get_vocards_by,
  get_vocards_order_by: get_vocards_order_by,
  put_vocard: put_vocard,
  del_vocard: del_vocard,
};