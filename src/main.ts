import { initShaders } from './utils/cuon_utils';
import { clear } from './utils/gl'

// Vertex shader program
// 对于画点，顶点着色器，设置了点的位置和大小
/**
 * gl_Position 设置点的坐标，必须要进行设置，否则sharder无法工作
 * gl_PointSize 设置点的大小，非必要设置，默认值是1
 */
/**
 * 注意
 * gl_Position 类型: (float, float, float, float)四维矢量，如果值改成(0, 0, 0, 1)会报错，因为没有小数点，代表值是整形
 * gl_PointSize 类型: float，值10.0不能改成10，会报错
 */
/**
 * gl_Position 只能接受vec4的变量，对于该场景下，只用到了xyz三维，需要将xyz转为vec4
 * xyz转为vec4，涉及到齐次坐标的概念
 * 齐次坐标的描述是 (x, y, z, w)， 齐次坐标等价于三维(x/w, y/w, z/w)，因此，当齐次坐标第四个维度是1的时候，等价于三维坐标(x, y, z)
 * 即(x, y, z, 1) === (x, y, z)
 * 概念：在三维计算中，通常使用齐次坐标表示三维坐标
 */

/**
 * webgl坐标单位
 * 可以把gl_Position，改成vec4(1.0, 0.0, 0.0, 1.0)，可以观察到webgl坐标的单位值和普通Canvas不太一样
 * (1.0, 0.0, 0.0, 1.0)，x轴会移动到右边缘，即整个webgl视图大小是1
 */

/**
 * 注意：
 * 对于opengl，需要进行交换颜色缓冲区
 * 而对于webgl，是不需要进行交互颜色缓冲区的
 */

/**
 * attribute的定义：一种glsl es 变量，被用来从外部（js）向顶点着色器内传输数据，只有顶点着色器可以使用它
 *
 */

/**
 * 存储限定符
 * attribute vec4 a_Position
 * attribute: attribute就是一个存储限定符
 * vec4: 类型
 * a_Position: 变量名
 */

/**
 * 注意：attribute变量必须为全局变量
 */
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' + // attribute variable
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '}\n';

// Fragment shader program
// 片段着色器控制了点的颜色
/**
 * vec4 -> rgba
 */
/**
 * uniform 可以用于js 传递 数据到 顶点着色器 或者 片元着色器
 * 而attribute只能用于顶点着色器
 * 对于attribute，只能是float类型，而对于uniform，可以是任意类型
 * precision mediump float 用于精度范围的限定，是必要的不然会报错，先不管，后面研究
 * precision 是精度限定词
 */
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

const getGl = function () {
    const canvas = document.querySelector('#webgl') as HTMLCanvasElement
    const gl = canvas.getContext('webgl')

    return {
        canvas: canvas,
        gl: gl,
    }
}

const initVertexBuffers = function (gl: WebGLRenderingContext) {
    var vertices = new Float32Array([
      0.0, 0.5,   -0.5, -0.5,   0.5, -0.5
    ]);
    var n = 3; // The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}

const __main = function () {
    const {
        canvas,
        gl,
    } = getGl()

    if (canvas && gl) {
        // Initialize shaders
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log('Failed to intialize shaders.')
            return;
        }

        // Write the positions of vertices to a vertex shader
        var n = initVertexBuffers(gl);
        if (n < 0) {
            console.log('Failed to set the positions of the vertices');
            return;
        }

        clear(gl)

        // Draw a point
        /**
         * gl.drawArrays是绘制多个像素点的函数
         * gl.drawArrays(mode, first, count)
         * 对于绘制多个像素点，有多种模式，都是绘制多个像素点，当时多个像素点可以以不同形式进行绘制
         * 参数-mode:
         * 1. gl.POINTS 普通的多个像素点
         * 2. gl.LINES
         * 3. gl.LINE_STRIP
         * 4. gl.TRIANGLES 三角
         * 等等
         *
         * 参数-first: 整型
         * 从哪个像素点开始绘制
         *
         * 参数-count: 整型
         * 绘制的像素点数量
         */
        /**
         * gl.drawArrays(gl.POINTS, 0, 1)表示，从第一个顶点开始绘制，绘制一个顶点
         */
        // gl.drawArrays(gl.POINTS, 0, 1)
          // Draw three points
        gl.drawArrays(gl.POINTS, 0, n);
    }


}

__main()