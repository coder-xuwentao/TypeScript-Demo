/**
 * Keyof Type Operator Keyof  Keyof 类型运算符
 * keyof 运算符采用对象类型 并生成a string or numeric literal union of its keys
 */
 type Point = { x: number; y: number };
 type P3 = keyof Point;

//  如果类型具有字符串或数字索引签名，则 keyof 将返回这些类型：
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;
// type A = number
 
type Mapish = { [k: string]: boolean };
type M = keyof Mapish;
// type M = string | number
// 在此示例中，M 是字符串 | number — 这是因为 JavaScript 对象键总是被强制转换为字符串，因此 obj[0] 始终与 obj["0"] 相同。

// 当与映射类型结合使用时，keyof 类型变得特别有用
