const Handlebars = require('handlebars/runtime')
const ltx = require('ltx')

const parse = (xml) => {
    const svg = ltx.parse(xml)
    if(svg.name !== 'svg') {
        throw new TypeError('{{inlineSVG}} helper: File specified must be an SVG')
    }

    delete svg.attrs.xmlns
    delete svg.attrs['xmlns:xlink']

    return svg
}

export default (content, options) => {
    const svg = parse(content)
    Object.assign(svg.attrs, options.hash)
    return new Handlebars.SafeString(svg.root().toString())
}
