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
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
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

/**
 * 在上次的绘制多个点的例程中，使用的方案是，使用for循环调用多次gl.drawArrays
 * 通过设置sharder的坐标和颜色，然后设置颜色缓冲区进行绘制
 * 但是，这种方式，会导致js和opengl se 多次 briage交互，性能不好，猜的
 * 可以优化为使用缓冲区对象的方式，缓冲区对象，是webgl一块内存区域
 * 向缓冲区对象中，写入所有需要设置的顶点的数据，然后，调用一次gl.drawArrays
 */

/**
 * 该函数
 */
const initVertexBuffers = function (gl: WebGLRenderingContext) {    
    /**
     * Float32Array 是类型化数组， 用于指定类型，节省内存
     * 还有Int8Array，UInt8Array, Float64Array等
     */
    var vertices = new Float32Array([
        -0.5, 0.5,   -0.5, -0.5,   0.5, 0.5,　0.5, -0.5
    ]);
    var n = 4; // The number of vertices

    // Create a buffer object
    /**
     * 创键缓冲区对象，相当于在webgl创键一块缓冲区对象内存
     * 对应的，删除缓冲区对象是gl.deleteBuffer()
     */
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    // Bind the buffer object to target
    /**
     * gl.bindBuffer用于绑定缓冲区对象，到bindBuffer第一个参数代表的target上
     * 绑定target，代表的是缓冲区将用于对应的哪种用途，就有点像该缓冲区接上了哪条管道
     * 参数可选
     * 1. gl.ARRAY_BUFFER 表示缓冲区 对象里面 将存放 顶点数据
     * 2. gl.ELEMENT_ARRAY_BUFFER 表示缓冲区 对象里面 将存放 顶点的索引值
     */
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    /**
     * gl.bufferData 是向缓冲区写入数据
     * 第一个参数，gl.ARRAY_BUFFER，由于我们不能直接向缓冲区对象写数据
     * 而是只能向缓冲区对象绑定的目标写数据，上面缓冲区对象绑定到了gl.ARRAY_BUFFER 目标上
     * 所以，向gl.ARRAY_BUFFER，就相当于对上面的缓冲区对象写数据
     *
     * 第二个参数，vertices，写入的数据
     *
     * 第三个参数，帮助webgl优化的参数，写错也没关系，但会降低效率，后面再看
     */
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    // Assign the buffer object to a_Position variable
    /**
     * 将缓冲区对象的引用分配给attribute变量
     * 参数1 - attribute变量 位置
     * 参数2 - 指定缓冲区中每个顶点的分量数，必须是1 - 4，这里设置为2，attribute变量类型是vec4，相当于是vec2分配给vec4，会进行自动转换，这里会补上(x, y , 0.0, 1.0)
     * 参数3 - 类型
     * 参数4 - 相邻两个顶点的字节数
     * 参数5 - 起始位置
     */
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    // 对于缓冲区 对象和sharder attrib中，还有一个开关，需要打开，才能真正传送数据
    // 同样，可以使用gl.disableVertexAttribArray(a_Position)关闭开关
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
         * 表示从缓冲区 坐标开始画，这里是从第一个坐标开始画
         *
         * 参数-count: 整型
         * 绘制的像素点数量
         */
        /**
         * gl.drawArrays(gl.POINTS, 0, 1)表示，从第一个顶点开始绘制，绘制一个顶点
         */
        // gl.drawArrays(gl.POINTS, 0, 1)
          // Draw three points
        /**
         * 绘制三角形，绘制三角形会根据第三个参数给的数量
         * 按3个进行分配，如果n不是3的倍数，那么剩下一个或者两个点将被忽略
         */
        /**
         * 绘制一个正方形，如果使用gl.TRIANGLES，需要6个顶点
         * 使用gl.TRIANGLE_STRIP的话，表示三角带，只需要4个顶点
         */
        gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
    }


}

__main()