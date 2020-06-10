function boolOrDefault (n, defaults) {
  return typeof n === 'boolean' ? n : defaults
}

module.exports = { boolOrDefault }
