const clear = function (gl: WebGLRenderingContext) {
    // 设置清除颜色为黑色，不透明
    gl.clearColor(0.0, 0.0, 1.0, 1.0)

    /**
     * 调用之前指定的颜色，清除绘图区域
     * open gl 基于 多基本缓冲区模型
     * gl.COLOR_BUFFER_BIT 表示的是 颜色缓冲区
     * 除了gl.COLOR_BUFFER_BIT外，这里还指定gl.DEPTH_BUFFER_BIT 深度缓冲区， gl.STENCIL_BUFFER_BIT 模板缓冲区
     * 所以gl.clear(gl.COLOR_BUFFER_BIT)整体表示的就是，清空颜色缓冲区
     * 换另一种说法是，使用 gl.clearColor设置的颜色，填充颜色缓冲区
     */
    gl.clear(gl.COLOR_BUFFER_BIT)
}

export {
    clear,
}