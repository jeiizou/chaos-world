// 顶点坐标
attribute vec4 a_position;
// 顶点颜色
attribute vec4 a_color;
// 变换矩阵
uniform mat4 u_matrix;
// 传递给片元的颜色可变量
varying vec4 v_color;
void main() {
    gl_Position = u_matrix * a_position;
    v_color = a_color;
}