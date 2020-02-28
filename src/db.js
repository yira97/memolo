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

module.exports = {
  KEY_PREFIX: KEY_PREFIX,
  set_data: set_data,
  get_data: get_data,
  get_slice: get_slice,
  remove_data: remove_data,
};