module.exports = function({context}) {
  const button = { name: 'button' }

  return Object.assign(button, { context });
}
