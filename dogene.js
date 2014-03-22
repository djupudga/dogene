#!/usr/bin/env node

//#module dukka
//-Parse arguments
//-to the program.
var argv = require('optimist')
  .usage('Usage: $0 -f <filename> -o <filename> -kp <kw prefix> -pp <param prefix> -dp <doc prefix>')
  .demand('f')
//  .demand(['f','o'])
  .alias('f', 'file')
//  .alias('o', 'out')
  .alias('kp', 'keyword-prefix')
  .alias('dp', 'doc-prefix')
  .default({kp: '#', dp: '-'})
  .describe('f', 'Input file')
//  .describe('o', 'Output file')
  .describe('kp', 'Keyword prefix')
  .describe('dp', 'Text doc prefix')
  .argv


//#package com.foo.bar

//#namespace test.bar.boo
//-This is just a test.

var fs = require('fs'),
    reKey =
      new RegExp('\s\/\/'+argv.kp+'|\/\/'+argv.kp+'|\s'+argv.kp+'|'+argv.kp+''),
    reDoc =
      new RegExp('\s\/\/'+argv.dp+'|\/\/'+argv.dp+'|\s'+argv.dp+'|'+argv.dp+'')

var nodes = {
  namespaces: [],
  tree: [],
  module: undefined
}
var current,
    callable = ['function', 'method', 'constructor']

//#function main of dukka
//-Program entry point.
function main() {
  fs.readFile(argv.f, function(err, data) {
    if (err) throw err
    data = data.toString().split('\n')
    for (var i = 0; i < data.length; i++) {
      /* need to know if inside of a comment and that
         prefix does not match params and doc */
      if (data[i].trim().indexOf('//') === 0) {
        if (reKey.test(data[i])) {
          parseKeywords(data[i])
        } else if (reDoc.test(data[i])) {
          parseDoc(data[i])
        }
      }
    }
    console.log(JSON.stringify(nodes))
    //console.log(require('util').inspect(nodes, false, 8))
  })
}

//#function kalle of dukka.main
//-Wonder how this will work.

//#function attachToTree of dukka
//#param Object node Type information to insert into doc tree
//-Attaches type information to the documentation tree.
function attachToTree(node) {
  switch (node.type) {
    case 'namespace':
      if (nodes.namespaces.indexOf(node.name) === -1) {
        nodes.tree.push(node)
        nodes.namespaces.push(node.name)
      }
      break;
    case 'module':
      nodes.tree.push(node)
      break;
    default:
      // walk the tree
      if (!walkTree(node, nodes.tree)) {
        // Add it in the top level of the tree
        // TODO: This will require reshuffling of the tree
        // later on, for example if a parent is added after a child
        nodes.tree.push(node)
      }
  }
}

function walkTree(node, nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].fqn === node.of) {
      nodes[i].children = nodes[i].children || []
      nodes[i].children.push(node)
      return true
    } else if (node.of && node.of.indexOf(nodes[i].fqn) === 0) {
      return walkTree(node, nodes[i].children)
    }
  }
}

//#function parseKeywords of dukka
//#param String line Line to parse.
//-Parses a keyword definition line.
function parseKeywords(line) {
  var words = line.substring(line.indexOf(argv.kp)+argv.kp.length).split(' ')
  if (words[0] === 'param') {
    /*parameter*/
    parseParam(line)
  } else {
    /*type*/
    var node = {
      name: words[1],
      type: words[0],
      of: words.length === 4? words[3]: nodes.module? nodes.module: undefined,
      fqn: words[1]
    }
    if (node.of !== undefined) {
      node.fqn = node.of + '.' + node.name
    }
    current = node
    attachToTree(node)
  }
}

//#function parseParam of dukka
//#param String line Line to parse.
//-Parses a parameter definition line.
function parseParam(line) {
  var words = line.substring(line.indexOf(argv.kp+'param')+argv.kp.length+6).split(' ')
  var param = {
    type: words.shift(),
    name: words.shift(),
    doc: words.join(' ')
  }
  if (current === undefined) throw new Error('Params must belong to a function')
  if (callable.indexOf(current.type) > -1) {
    current.params = current.params || []
    current.params.push(param)
  } else {
    throw new Error('Params must belong to a function')
  }
}

//#function parseDoc of dukka
//#param String line Line to parse
function parseDoc(line) {
  var doc = line.substring(line.indexOf(argv.dp)+argv.dp.length)
  if (current !== undefined) {
    if (current.doc === undefined) {
      current.doc = doc
    } else {
      current.doc = current.doc + ' ' + doc
    }
  }
}

require.main === module && main()
