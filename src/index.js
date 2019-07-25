import AOS from 'aos'
import 'aos/dist/aos.css'
import './global.scss'

require.context('./assets', true, /\.(jpe?g|png|gif|svg|ico)$/i)

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        once: true,
        duration: 800
    })
})

