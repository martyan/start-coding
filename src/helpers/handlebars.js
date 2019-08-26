const Handlebars = require('handlebars/runtime')
const layouts = require('handlebars-layouts')
const fs = require('fs')

Handlebars.registerHelper(layouts(Handlebars))

const partial = fs.readFileSync('./src/components/partial.hbs', 'utf-8')
Handlebars.registerPartial('partial', partial)
// Handlebars.registerPartial('partial', () => {
//   return partial
// })

module.exports = Handlebars
