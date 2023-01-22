precision mediump float;
// 获取颜色值
varying vec4 v_color;
// 修改颜色属性的变量
uniform vec4 u_colorMulti;
void main() {
    gl_FragColor = v_color * u_colorMulti;
}