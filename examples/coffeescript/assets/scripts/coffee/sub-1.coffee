console.log 'This is sub-1'

class Greeter
  constructor: (@greeting)->
    greet: ()->
      square = (x)->x*x; # this semicolon will generate lint message
      return 'TypeScript! @greeting, num=' + square(2)
