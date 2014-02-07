var file = process.argv[2]
f.readFile(__dirname + '/' + file, function(err, contents) {
  var lines = contents.split('\n')
  lines.forEach(function(line) {
    // Use regex instead
    var ix = line.indexOf('// #')
    if (ix > -1) {
      // Pare line
    }
  })
})


// #typedef member_doc
//  #label is String: Member name, such as a property name.
//  #info is .member_doc_info: The documentation itself.


// #constructor Context
// #param object is -jQueryEvent: jQuery event object
// ##
// Current parsing context.
// or
// file(foo.txt)
function Context(obj) {
  this.obj = obj
}
// #method add
// #param opt is .member_doc: Member documentation
// ##
// Adds documentation for a member to the object owning the current context.
// #see url(http://api.jquery.com)
// #see foo.bar.Baz
Context.prototype.add = function(opt) {
  this.obj[opt.label] = opt.info
};

// .label: Indicates a hash like object whose properties are documented
//         elsewhere.
// -label: Indicates a type coming from an external library.

// tree
var x = {
  '__dukka': {
    'namespaces': [
      'tailf.widgets',
      'tailf.models'
    ],
    'typedefs': [
      'member_doc': {
        'label': {
          'String': 'Member name, such as a property name.'
        }
      }
    ]
  },
  'tailf': {
    'widgets': {
      'Text': {
        '__dukka': {
          'constructor': true,
          'duc': 'This is the doc'
        },
        'onChange': {
          '__dukka': {
            'function': true,
            'params': [
              {
                'evt': 'object',
                'duc': 'jQuery event object'
              }
            ]
          }
        }
      }
    }
  }
}