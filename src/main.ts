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
  'attribute float a_PointSize;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = a_PointSize;\n' +
  '}\n';

// Fragment shader program
// 片段着色器控制了点的颜色
/**
 * vec4 -> rgba
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

const __main = function () {
    const {
        canvas,
        gl,
    } = getGl()

    if (gl) {
        // Initialize shaders
        if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
            console.log('Failed to intialize shaders.')
            return;
        }

        // Get the storage location of a_Position
        /**
         * 获取attribute变量的存储位置
         * 返回值：
         * 大于或者等于0，attribute变量的地址
         * -1，指定的attribute变量不存在，或者将其命名具有gl_或webgl_前缀
         */
        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return;
        }

        // 将顶点位置，传给a_Position attribute 变量
        /**
         * 这里传输的是一个vec3变量，a_Position声明的是vec4变量，因此，webgl会自动将vec3转为vec4
         * 必须要使用vec4的原因是，gl_Position是vec4类型的变量
         *
         * 3f，的意思应该就是三维矢量，还有1f，2f，4f等
         */
        /**
         * 同等替换的方法
         * var position = new Float32Array([0.0, 0.0, 0.0])
         * gl.vertexAttrib3fv(a_Position, position)
         * 函数结尾的3f，变成3fv，代表矢量版本的方法，作用是一样的
         */

        /**
         * webgl函数命名规范，遵循opengl函数命名规范
         * <基础函数><参数个数><参数类型>
         * 例如这里的
         * vertexAttrib: 基础函数
         * 3: 参数个数
         * f: 浮点类型
         */
        gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

        var a_PositSize = gl.getAttribLocation(gl.program, 'a_PointSize');
        gl.vertexAttrib1f(a_PositSize, 10.0);

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
        gl.drawArrays(gl.POINTS, 0, 1)
    }


}

__main()