#
# CoffeeScript Sample
#

console.log 'CoffeeScript example...'

class CoffeeGreeter
  constructor: (@greeting) ->
    greet: ()->
      square = (x)->x*x   # this semicolon will generate lint message
      return  @greeting + ' CoffeeScript! ' + 'num=' + square(2)

console.log new CoffeeGreeter("AAA").greet

(($, window, document) ->
  console.log "Hello, CoffeeScript...!"
)(jQuery, window, document)
