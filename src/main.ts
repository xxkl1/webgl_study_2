import { clear } from './utils'

const getGl = function () {
    const canvas = document.querySelector('#webgl') as HTMLCanvasElement
    const gl = canvas.getContext('webgl')

    return {
        canvas: canvas,
        gl: gl,
    }
}

const __main = function () {
    const {
        canvas,
        gl,
    } = getGl()

    clear(gl!)
}

__main()