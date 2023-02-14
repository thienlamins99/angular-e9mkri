// ! Utils
// const log = console.log;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const datasource = [
//     {
//         id: 0,
//         displayName: 'Dev 0',
//         'display-name': 'Dev 0',
//         'display_name': 'Dev 0',
//         'Display Name': 'Dev 0',
//         role: 'Admin',
//         age: 20
//     },
//     {
//         id: 1,
//         displayName: 'Dev 1',
//         'display-name': 'Dev 1',
//         'display_name': 'Dev 1',
//         'Display Name': 'Dev 1',
//         role: 'Member',
//         age: 21
//     },
//     {
//         id: 2,
//         displayName: 'Dev 2',
//         'display-name': 'Dev 2',
//         'display_name': 'Dev 2',
//         'Display Name': 'Dev 2',
//         role: 'Admin',
//         age: 22
//     },
//     {
//         id: 3,
//         displayName: 'Dev 3',
//         'display-name': 'Dev 3',
//         'display_name': 'Dev 3',
//         'Display Name': 'Dev 3',
//         role: 'Admin',
//         age: 23
//     },
//     {
//         id: 4,
//         displayName: 'Dev 4',
//         'display-name': 'Dev 4',
//         'display_name': 'Dev 4',
//         'Display Name': 'Dev 4',
//         role: 'Admin',
//         age: 24
//     },
//     {
//         id: 5,
//         displayName: 'eev 5',
//         'display-name': 'Dev 5',
//         'display_name': 'Dev 5',
//         'Display Name': 'Dev 5',
//         role: 'Admin',
//         age: 25
//     }
// ];
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const input = `((%displayName% HAS "1" AND %display-name% HAS "1") AND %display_name% HAS "1" AND %Display Name% HAS "1") OR %displayName% STARTSWITH "eev"`;
// const input = `NOT(%displayName% HAS "1")" AND (%age% GT 22)`;
// log('input         #', input);
// Expect: (((this["displayName"].includes("1"))&&(this["display-name"].includes("1")))&&(this["display_name"].includes("1"))&&(this["Display Name"].includes("1")))||(this["displayName"].startsWith("eev"))
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const buildArrayFilterCallback = (
  filterString = '',
  arrayItem: unknown,
  mappingFields: any
) => {
  const indentToken = '(';
  const outdentToken = ')';
  const blockMask = '__block__';
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const andExpressionToken = '&';
  const orExpressionToken = '|';
  const hasOperatorToken = 'includes';
  const eqOperatorToken = '===';
  const neOperatortoken = '!==';
  const ltOperatortoken = '<';
  const gtOperatortoken = '>';
  const leperatortoken = '<=';
  const geperatortoken = '>=';
  const startsWithOperatortoken = 'startsWith';
  const endsWithOperatortoken = 'endsWith';
  const negativeFunctionToken = '!';
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // const andExpession = 'AND';
  // const orExpession = 'OR';
  const hasOperator = 'HAS';
  const eqOperator = 'EQ';
  const neOperator = 'NE';
  const ltOperator = 'LT';
  const gtOperator = 'GT';
  const leOperator = 'LE';
  const geOperator = 'GE';
  const startsWithOperator = 'STARTSWITH';
  const endsWithOperator = 'ENDSWITH';
  // const negativeFunction = `NOT`;
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // const fieldRegex = /[%]{1}[\w\s\-_]{1,}[%]{1}/gm;
  const formatBlockRegex =
    /([%]{1})([\w\s\-_]{1,})([%]{1})\s+(HAS|EQ|NE|LT|GT|LE|GE|STARTSWITH|ENDSWITH)\s+(["]{1}.*?["]{1}|\d+)/gm; // ! Usage: .replace(formatBlockRegex, '($1$2$3 $4 $5)')
  const detectBlockRegex =
    /([%]{1}[\w\s\-_]{1,}[%]{1})\s+(HAS|EQ|NE|LT|GT|LE|GE|STARTSWITH|ENDSWITH)\s+(["]{1}.*?["]{1}|\d+)/gm; // ! Usage: .replace(detectBlockRegex, '__block__')
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const filter = filterString.replace(
    formatBlockRegex,
    `($1$2$3 $4 $5)`
  ) as any;
  // log('filter        #', filter);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const matches = [];
  for (const iterator of filter.matchAll(detectBlockRegex)) {
    if (typeof iterator.index === 'number') {
      const [field, operator, value, from, to] = [
        iterator[1],
        iterator[2],
        iterator[3],
        iterator.index,
        iterator[1].length +
          iterator[2].length +
          iterator[3].length +
          (iterator.index as number) +
          2,
      ];
      matches.push({
        field: field,
        operator: operator,
        value: value,
        from: from,
        to: to,
      });
    }
  }
  // log('matches       #', matches);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const matchesParsed = matches.map((item) => {
    const itemParsed: any = {
      field: '',
      operator: '',
      value: '',
      from: 0,
      to: 0,
      filter: '',
    };
    item.field = `${
      mappingFields[item.field.replace(/^%{1}/gm, '').replace(/%{1}$/gm, '')]
    }`;
    itemParsed.field = `this["${item.field}"]`;
    switch (item.operator) {
      case hasOperator:
        itemParsed.operator = `.${hasOperatorToken}(`;
        itemParsed.value = `${item.value})`;
        break;
      case eqOperator:
        itemParsed.operator = ` ${eqOperatorToken} `;
        itemParsed.value = ` ${item.value}`;
        break;
      case neOperator:
        itemParsed.operator = ` ${neOperatortoken} `;
        itemParsed.value = ` ${item.value}`;
        break;
      case ltOperator:
        itemParsed.operator = ` ${ltOperatortoken} `;
        itemParsed.value = ` ${item.value}`;
        break;
      case gtOperator:
        itemParsed.operator = ` ${gtOperatortoken} `;
        itemParsed.value = ` ${item.value}`;
        break;
      case leOperator:
        itemParsed.operator = ` ${leperatortoken} `;
        itemParsed.value = ` ${item.value}`;
        break;
      case geOperator:
        itemParsed.operator = ` ${geperatortoken} `;
        itemParsed.value = ` ${item.value}`;
        break;
      case startsWithOperator:
        itemParsed.operator = `.${startsWithOperatortoken}(`;
        itemParsed.value = `${item.value})`;
        break;
      case endsWithOperator:
        itemParsed.operator = `.${endsWithOperatortoken}(`;
        itemParsed.value = `${item.value})`;
        break;
      default:
        break;
    }
    itemParsed.from = item.from;
    itemParsed.to = item.to;
    itemParsed.filter = `${itemParsed.field}${itemParsed.operator}${itemParsed.value}`;
    return itemParsed;
  });
  // log('matchesParsed #', matchesParsed)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const blocks = filter.replace(detectBlockRegex, '__block__');
  // log('blocks        #', blocks);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  let arr = blocks.split(blockMask);
  arr = arr.map((item) => item.replace(/\s+/gm, '')); // ! Replace SPACE characters
  arr = arr.map((item) => item.replace(/(AND)/gm, andExpressionToken)); // ! Replace AND Expression string
  arr = arr.map((item) => item.replace(/(OR)/gm, orExpressionToken)); // ! Replace OR Expression string
  arr = arr.map((item) =>
    item.replace(/NOT(?=(.+)?)/gi, negativeFunctionToken)
  ); // ! Replace NOT Function string
  // log('arr           #', arr);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const filters = arr.reduce((prev, cur) => {
    let value = '';
    for (let index = 0; index < cur.length; index++) {
      const element = cur[index];
      switch (element) {
        case indentToken:
          value = `${value}${indentToken}`;
          break;
        case outdentToken:
          value = `${value}${outdentToken}`;
          break;
        case andExpressionToken:
          value = `${value}${andExpressionToken}${andExpressionToken}`;
          break;
        case orExpressionToken:
          value = `${value}${orExpressionToken}${orExpressionToken}`;
          break;
        case negativeFunctionToken:
          value = `${value}${negativeFunctionToken}`;
          break;
        default:
          break;
      }
    }
    prev = prev.concat(value);
    return prev;
  }, [] as Array<string>);
  // log('filters       #', filters);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const finalFilter = filters.reduce((prev, cur, curIndex) => {
    if (cur.startsWith(')')) {
      const match = matchesParsed[curIndex - 1];
      cur = `${match.filter}${cur}`;
    }
    prev = prev.concat(cur);
    return prev;
  }, '');
  // log('finalFilter   #', finalFilter);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  debugger;
  return new Function(`return ${finalFilter}`).bind(arrayItem);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const test = datasource.filter((item) => buildArrayFilterCallback(input, item, {})());
// log('test          #', test);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
