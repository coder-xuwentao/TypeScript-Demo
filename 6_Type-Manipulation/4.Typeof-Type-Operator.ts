/**
 * The typeof type operator typeof 类型运算符
 */
//  JavaScript 已经有一个 typeof 运算符可以在表达式上下文中使用
console.log(typeof "Hello world");
// TypeScript 添加了一个 typeof 运算符，您可以在类型上下文中使用它来引用变量或属性的类型：
let s = "hello";
let n: typeof s;// let n: string

// 这对于基本类型不是很有用，但是结合其他类型运算符，您可以使用 typeof 方便地表达许多模式。
// 例如，让我们从预定义类型 ReturnType<T> 开始。它接受一个函数类型并产生它的返回类型：
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;//type K = boolean
// 尝试在函数名上使用 ReturnType，我们会看到一个指导性错误：
function f() {
    return { x: 10, y: 3 };
}
type P = ReturnType<f>;

// 请记住，值和类型不是一回事。要引用值 f 的类型，我们使用 typeof：
function f1() {
    return { x: 10, y: 3 };
}
type P1 = ReturnType<typeof f1>;

/**
 * Limitations 限制
 * TypeScript 有意限制了可以使用 typeof 的表达式类型。
 * 具体来说，只在标识符（即变量名）或其属性上 使用 typeof 是合法的。这有助于避免困惑陷阱（您认为编写的代码正在执行，但实际上不是：）
 */
 function msgbox(){}
 let shouldContinue: typeof msgbox("Are you sure you want to continue?");