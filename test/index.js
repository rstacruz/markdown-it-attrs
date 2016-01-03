'use strict'

var markdownIt = require('markdown-it')
var decorate = require('../')
var run = require('./support/test')
var test = require('tape')

run = run.bind(this, markdownIt({ html: true }).use(decorate))

test('classes:', function (t) {
  run(t, 'text <!--{.red}-->', '<p class="red">text</p>\n')
  run(t, 'text <!--{.red.blue}-->', '<p class="red blue">text</p>\n')
  run(t, 'text <!--{.red .blue}-->', '<p class="red blue">text</p>\n')
  run(t, 'text <!--{.red-1.green-2}-->', '<p class="red-1 green-2">text</p>\n')
  run(t, 'text <!--{.red-1 .green-2}-->', '<p class="red-1 green-2">text</p>\n')
  run(t, 'text <!--{.red-1 .-green-2}-->', '<p class="red-1 -green-2">text</p>\n')
  t.end()
})

test('spaces:', function (t) {
  run(t, 'text <!--{.red}-->', '<p class="red">text</p>\n')
  run(t, 'text <!--{ .red }-->', '<p class="red">text</p>\n')
  run(t, 'text <!-- {.red }-->', '<p class="red">text</p>\n')
  run(t, 'text <!--{ .red} -->', '<p class="red">text</p>\n')
  run(t, 'text <!-- {.red} -->', '<p class="red">text</p>\n')
  run(t, 'text <!-- { .red } -->', '<p class="red">text</p>\n')
  run(t, 'text<!--{.red}-->', '<p class="red">text</p>\n')
  run(t, 'text<!--{ .red }-->', '<p class="red">text</p>\n')
  run(t, 'text<!-- {.red }-->', '<p class="red">text</p>\n')
  run(t, 'text<!--{ .red} -->', '<p class="red">text</p>\n')
  run(t, 'text<!-- {.red} -->', '<p class="red">text</p>\n')
  run(t, 'text<!-- { .red } -->', '<p class="red">text</p>\n')
  t.end()
})

test('ids:', function (t) {
  run(t, 'text <!--{#myid}-->', '<p id="myid">text</p>\n')
  run(t, 'text <!--{#x#myid}-->', '<p id="myid">text</p>\n')
  run(t, 'text <!--{#x #myid}-->', '<p id="myid">text</p>\n')
  t.end()
})

test('new lines:', function (t) {
  run(t, 'text\n<!--{#myid}-->', '<p id="myid">text</p>\n')
  run(t, 'text\n\n<!--{#myid}-->', '<p id="myid">text</p>\n')
  run(t, 'text\n<!--{#myid}-->\n\nhi', '<p id="myid">text</p>\n<p>hi</p>\n')
  run(t, 'text\n<!--{#myid}-->\nhi', '<p id="myid">text</p>\n<p>hi</p>\n')
  run(t, 'text\n\n<!--{#myid}-->\nhi', '<p id="myid">text</p>\n<p>hi</p>\n')
  t.end()
})

test('no attribute value:', function (t) {
  run(t, 'text <!--{data-foo}-->', '<p data-foo="">text</p>\n')
  run(t, 'text <!--{bar=}-->', '<p bar="">text</p>\n')
  run(t, 'text <!--{foo= bar}-->', '<p foo="" bar="">text</p>\n')
  run(t, 'text <!--{#foo .bar baz booyah=}-->', '<p id="foo" class="bar" baz="" booyah="">text</p>\n')
  t.end()
})

test('falses:', function (t) {
  run(t, 'text <!--comment-->', '<p>text <!--comment--></p>\n')
  run(t, 'text\n<!--comment-->', '<p>text</p>\n<!--comment-->')
  run(t, '<!--{#x}-->', '<!--{#x}-->')
  t.end()
})

test('in the middle:', function (t) {
  run(t, 'text <!--{#x.y}--> foo', '<p id="x" class="y">text foo</p>\n')
  t.end()
})

test('multiple tags', function (t) {
  run(t, 'text <!--{#x}--> <!--{.y}--> foo', '<p id="x" class="y">text foo</p>\n')
  run(t, 'text <!--{#x}--><!--{.y}--> foo', '<p id="x" class="y">text foo</p>\n')
  run(t, '*hi*<!--{#x}-->', '<p><em id="x">hi</em></p>\n')
  t.end()
})

test('combinations', function (t) {
  run(t, 'text <!--{#x.y}-->', '<p id="x" class="y">text</p>\n')
  run(t, 'text <!--{#x .y}-->', '<p id="x" class="y">text</p>\n')
  run(t, 'text <!--{#x .y z=1}-->', '<p id="x" class="y" z="1">text</p>\n')
  run(t, 'text [link](/) <!--{p: #x .y z=1}-->', '<p id="x" class="y" z="1">text <a href="/">link</a></p>\n')
  run(t, 'text\n<!--{#x aah}-->', '<p id="x" aah="">text</p>\n')
  run(t, 'text <!--{#x aah}-->', '<p id="x" aah="">text</p>\n')
  t.end()
})

test('attributes', function (t) {
  run(t, 'text <!--{key="val"}-->', '<p key="val">text</p>\n')
  run(t, 'text <!--{key="val space"}-->', '<p key="val space">text</p>\n')
  run(t, 'text <!--{key=\'val\'}-->', '<p key="val">text</p>\n')
  run(t, 'text <!--{a=b c=d}-->', '<p a="b" c="d">text</p>\n')
  run(t, 'text <!--{key=val}-->', '<p key="val">text</p>\n')
  run(t, 'text <!--{data-toggle="foo"}-->', '<p data-toggle="foo">text</p>\n')
  t.end()
})

test('h1 (atx)', function (t) {
  run(t, '# h1 <!--{key=val}-->', '<h1 key="val">h1</h1>\n')
  t.end()
})

test('h1 with formatting', function (t) {
  run(t, '# *h1* <!--{key=val}-->', '<h1><em key="val">h1</em></h1>\n')
  t.end()
})

test('nested inline formatting:', function (t) {
  run(t, '# ***yo*<!--{key=val}-->**', '<h1><strong><em key="val">yo</em></strong></h1>\n')
  run(t, '# ***yo***<!--{key=val}-->', '<h1><strong><em key="val">yo</em></strong></h1>\n')
  run(t, '# ***yo***\n\n<!--{key=val}-->', '<h1><strong><em key="val">yo</em></strong></h1>\n')
  t.end()
})

test('h1 (lined):', function (t) {
  run(t, 'h1\n==\n<!--{key=val}-->', '<h1 key="val">h1</h1>\n')
  t.end()
})

test('blockquote:', function (t) {
  run(t, '> text <!--{key=val}-->', '<blockquote>\n<p key="val">text</p>\n</blockquote>\n')
  run(t, '> text\n<!--{key=val}-->', '<blockquote>\n<p key="val">text</p>\n</blockquote>\n')
  run(t, '> text\n> text\n<!--{key=val}-->', '<blockquote>\n<p key="val">text\ntext</p>\n</blockquote>\n')
  t.end()
})

test('lists:', function (t) {
  run(t, '* text\n<!--{ul:.c}-->', '<ul class="c">\n<li>text</li>\n</ul>\n')
  run(t, '* * text\n<!--{ul:.c}-->', '<ul>\n<li>\n<ul class="c">\n<li>text</li>\n</ul>\n</li>\n</ul>\n')
  t.end()
})

test('image:', function (t) {
  run(t, '![](hi.jpg)<!--{.c}-->', '<p><img src="hi.jpg" alt="" class="c"></p>\n')
  t.end()
})

test('horizontal rule:', function (t) {
  run(t, '----\n<!--{.c}-->', '<hr class="c">\n')
  t.end()
})

test('horizontal rule, nested:', function (t) {
  run(t, '> ----\n<!--{.c}-->', '<blockquote>\n<hr class="c">\n</blockquote>\n')
  t.end()
})

test('tables:', function (t) {
  run(t, '| x | y |\n|---|---|\n| a | b |\n<!--{table:.c}-->', { match: /^<table class="c">/ })
  t.end()
})

test.skip('tables (pending):', function (t) {
  run(t, '| x | y |\n|---|---|\n| a | b |\n<!--{tr:.c}-->', { match: /^<tr class="c">/ })
  run(t, '| x | y |\n|---|---|\n| a | b |\n<!--{td:.c}-->', { match: /^<td class="c">/ })
  run(t, '| x | y |\n|---|---|\n| a | b |\n<!--{tbody:.c}-->', { match: /^<tbody class="c">/ })
  t.end()
})

test('specifying tags:', function (t) {
  run(t, '* text <!--{li: .c}-->', '<ul>\n<li class="c">text</li>\n</ul>\n')
  run(t, '* text <!--{ul: .c}-->', '<ul class="c">\n<li>text</li>\n</ul>\n')
  run(t, '1. text <!--{ol: .c}-->', '<ol class="c">\n<li>text</li>\n</ol>\n')
  run(t, '# text <!--{h1: .c}-->', '<h1 class="c">text</h1>\n')
  run(t, '> text <!--{blockquote: .c}-->', '<blockquote class="c">\n<p>text</p>\n</blockquote>\n')
  run(t, '> * text <!--{blockquote:.c}-->', { match: /<blockquote class="c">/ })
  t.end()
})

test('tags with spacing:', function (t) {
  run(t, '* text <!--{li:.c}-->', '<ul>\n<li class="c">text</li>\n</ul>\n')
  run(t, '* text <!--{li: .c}-->', '<ul>\n<li class="c">text</li>\n</ul>\n')
  t.end()
})

test('li with paragraphs:', function (t) {
  run(t, '* text\n\n* text<!--{.c}-->',
    '<ul>\n' +
      '<li>\n' +
        '<p>text</p>\n' +
      '</li>\n' +
      '<li>\n' +
        '<p class="c">text</p>\n' +
      '</li>\n' +
    '</ul>\n')
  t.end()
})

test('line breaks:', function (t) {
  run(t, 'para\n<!--{.red .blue}-->', '<p class="red blue">para</p>\n')
  run(t, '# heading\n<!--{key=val}-->', '<h1 key="val">heading</h1>\n')
  run(t, '> bquote\n<!--{key=val}-->', '<blockquote>\n<p key="val">bquote</p>\n</blockquote>\n')
  run(t, '> > bquote 2x\n<!--{key=val}-->', '<blockquote>\n<blockquote>\n<p key="val">bquote 2x</p>\n</blockquote>\n</blockquote>\n')
  run(t, '> > bquote 2x\n<!--{blockquote:key=val}-->', '<blockquote>\n<blockquote key="val">\n<p>bquote 2x</p>\n</blockquote>\n</blockquote>\n')
  run(t, '> > bquote 2x\n<!--{blockquote^:key=val}-->', '<blockquote key="val">\n<blockquote>\n<p>bquote 2x</p>\n</blockquote>\n</blockquote>\n')
  t.end()
})

test('headings:', function (t) {
  run(t,
    '# docpress\n<!--{h1:.-with-byline}-->\n\n' +
    '> It is good\n<!--{blockquote:.byline}-->\n',
    '<h1 class="-with-byline">docpress</h1>\n' +
    '<blockquote class="byline">\n' +
    '<p>It is good</p>\n' +
    '</blockquote>\n')
  t.end()
})

test('fenced code blocks:', function (t) {
  run(t,
    '```\n' +
    'hello\n' +
    '```\n' +
    '<!--{code: .foo}-->',
    '<pre><code class="foo">hello\n' +
    '</code></pre>\n')
  t.end()
})

test('indented blocks:', function (t) {
  // Sadly, it doesn't actually apply.
  run(t,
    '    hello\n' +
    '\n' +
    '<!--{code: .foo}-->',
    '<pre><code>hello\n' +
    '</code></pre>\n')
  t.end()
})

test('inline code:', function (t) {
  // Also doesn't apply.
  run(t,
    'hi `there` <!--{code:.foo}-->',
    '<p>hi <code>there</code></p>\n')

  run(t,
    'hi *there* <!--{em:.foo}-->',
    '<p>hi <em class="foo">there</em></p>\n')
  t.end()
})

test('silent errors:', function (t) {
  run(t,
    'hi <!--{a:.foo}-->',
    '<p>hi <!--{a:.foo}--></p>\n')
  t.end()
})
