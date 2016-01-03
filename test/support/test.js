function test (md, t, input, output) {
  if (typeof output === 'object' && output.match) {
    t.ok(md.render(input).match(output.match), input)
  } else {
    t.equal(md.render(input), output, input)
  }
}

module.exports = test
