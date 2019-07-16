import _ from 'lodash'
import styles from './global.scss'

function component() {
  const element = document.createElement('div')
  element.innerHTML = _.join(['Everythang', 'iz', 'redy'], ' ')

  return element
}

document.body.appendChild(component())
