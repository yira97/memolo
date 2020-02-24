module.exports = {
  "rules": {
    "semi": [
      "warn",
      "always",
    ],
    "quotes": [
      "warn",
      "single",
      { "allowTemplateLiterals": true }
    ],
    "indent": ["warn", 2],
    "no-var": 2,
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "commonjs": true,
    "node": true,
    "es2017": true,
  },
}