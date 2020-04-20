// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  // add your custom rules here
  'rules': {
    "prefer-const": [0],
    "prefer-destructuring": [0],
    "default-case": [0],
    "quotes": [2, "single"],
    "arrow-parens": 2,    // 要求箭头函数的参数使用圆括号
    "block-scoped-var": 2,  // 强制把变量的使用限制在其定义的作用域范围内
    "eqeqeq": 2, // 强制强类型判断===,!==
    "no-alert": [2],
    'no-multi-spaces': 2, // 禁止使用多个空格
    'no-trailing-spaces': 2,  // 禁止行尾空格
    "no-console": 2, // 禁用 console
    "no-debugger": 2, // 禁用 debugger
    "no-duplicate-imports": [2],
    'comma-spacing': [2],
    "comma-dangle": [2, {
      "arrays": "always-multiline", // 数组末尾换行需要逗号
      "objects": "always-multiline", // 对象末尾换行需要逗号
      "imports": "always-multiline", // imports末尾换行需要逗号
      "exports": "always-multiline", // exports数组末尾换行需要逗号
      "functions": "always-multiline", // 方法数组末尾换行需要逗号
    }],
    'indent': [2, 2, {
      'SwitchCase': 1
    }],
    "no-var": 1, // 禁止使用 var
    "no-multi-spaces": 1, // 禁止使用多个空格
    "array-bracket-newline": [1,
      {
        "multiline": true,  // 如果数组元素内或元素间有换行，则要求换行。
        "minItems": 3 // 如果数组元素的个数大于等于3的整数，则要求换行。
      }
    ],
    "array-bracket-spacing": [1,
      "always",
      {
        "objectsInArrays": false, // 禁止在数组的方括号和数组内的对象元素的大括号之间，即 [{ 或 }]出现空格
        "arraysInArrays": false // 禁止在数组的方括号和数组内的数组元素的方括号之间，即 [[ 或 ]]出现空格
      }
    ],
    "block-spacing": [1,
      "always"  // 强制在代码块中开括号前和闭括号后有空格
    ],
    "brace-style": [1,
      "1tbs"
    ],
    "camelcase": [1,
      { "properties": "always" }  // 强制属性名称为驼峰风格
    ],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
