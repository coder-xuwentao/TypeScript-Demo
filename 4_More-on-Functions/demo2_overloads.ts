/**
 * Function Overloads 函数重载
 * TypeScript中，我们可以通过编写重载签名来指定一个可以以不同方式调用的函数。
 * 请编写一些函数签名（通常为两个或更多），然后是函数体：
 */
function makeDate(timestamp: number): Date; // timestamp 
function makeDate(m: number, d: number, y: number): Date; // m d y
// function makeDate(m: number, d: number): Date; // m d
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
    if (d !== undefined && y !== undefined) {
        return new Date(y, mOrTimestamp, d);
    } else {
        return new Date(mOrTimestamp);
    }
}
const d1 = makeDate(12345678);
const d2 = makeDate(5, 5, 5);
const d3 = makeDate(1, 3);
// 在这个例子中，我们写了两个重载：一个接受一个参数，另一个接受三个参数。前两个签名称为重载签名。
// 我们编写了一个具有兼容签名的函数实现。
// 函数有一个实现签名，但是这个签名不能被直接调用
// 即使我们写了一个在必需参数后面有两个可选参数的函数，它也不能用两个参数调用！


/**
 * Overload Signatures and the Implementation Signature 重载签名和实现签名
 * 这是混淆的常见来源。通常人们会写这样的代码，但不明白为什么会出现错误：
 */
function fn1(x: string): void;
function fn1() {
    // ...
}
// Expected to be able to call with zero arguments
fn1();
// 从外部看不到实现的签名。编写重载函数时，应始终在函数实现上方有两个或多个签名
// 实现签名还必须与重载签名兼容。例如，这些函数有错误，因为实现签名没有以正确的方式匹配重载：
function fn2(x: boolean): void;
// Argument type isn't right
function fn2(x: string): void;
function fn2(x: boolean) { }

function fn3(x: string): string;
// Return type isn't right
function fn3(x: number): boolean; // 返回不符合
function fn3(x: string | number) {
    return "oops";
}
/**
 * Writing Good Overloads
 * 与泛型一样，在使用函数重载时也应遵循一些准则。
 */

function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
    return x.length;
}

len(""); // OK
len([0]); // OK
len(Math.random() > 0.5 ? "hello" : [0]);
// 我们不能使用可能是字符串或数组的值来调用它，因为 TypeScript 只能将函数调用解析为单个重载：

function len1(s: string): number;
function len1(arr: any[]): number;
function len1(x: any[] | string) {
    return x.length;
}
//这好多了！调用者可以使用任何一种值调用它，作为额外的好处，我们不必找出正确的实现签名。
// 规则：在可能的情况下，最好用具有联合类型的参数而不是重载

/**
 * Declaring this in a Function 声明this在一个函数中
 * TypeScript 将通过代码流分析推断函数中的 this 应该是什么
 */
const user = {
    id: 123,

    admin: false,
    becomeAdmin: function () {
        this.admin = true;
    },
};
// TypeScript 理解函数 user.becomeAdmin 有一个对应的 this，即外部对象 user。
// 但是有时候用call方法借用this给其他对象，
// TypeScript 使用语法空间让您在函数体中声明 this 的类型。
type User = { admin: boolean }
interface DB {
    filterUsers(filter: (this: User) => boolean): User[];
}
// function getDB():DB{
//     const db = {
//         filterUsers(filter){
//             filter(user)
//             return []
//         }
//     }
//     return db
// }


const db = getDB();
const admins = db.filterUsers(function (this: User) {
    return this.admin;
});
// 这种模式在回调风格的 API 中很常见，其中另一个对象通常控制何时调用您的函数。
// 请注意，您需要使用函数而不是箭头函数来获得此行为

interface DB {
    filterUsers(filter: (this: User) => boolean): User[];
}

const db1 = getDB();
const admins1 = db1.filterUsers(() => this.admin);// this指向区安监局

/**
 * Other Types to Know About 其他需要了解的类型
 */
// void 空白
// void 表示不返回值的函数的返回值。没有return内容
function noop() {
    return; // The inferred return type is void
}
// void 与 js返回的 undefined 不同

// object
// 这不同于空对象类型{}，也不同于全局类型Object。你很可能永远不会使用 Object.
// object is not Object. Always use object!
// function types are considered to be objects in TypeScript.（js too）

// unknown
// 未知类型代表任何值。这类似于 any 类型，但更安全，因为使用未知值做任何事情都是不合法的：
function f1(a: any) {
    a.b(); // OK
}
function f2(a: unknown) {
    a.b();// Object is of type 'unknown'.
}
// 用了unknown就不用any了
function safeParse(s: string): unknown {
    return JSON.parse(s);
}

// Need to be careful with 'obj'!,需要判断
const obj = safeParse("aaa");

// never
// 一些函数从不返回值：
function fail(msg: string): never {
    throw new Error(msg);
}
// never 类型表示从未观察到的值。在返回类型中，这意味着函数抛出异常或终止程序的执行。
// 当 TypeScript 确定union中没有任何东西时， never 也会出现。
function fn(x: string | number) {
    if (typeof x === "string") {
        // do something
    } else if (typeof x === "number") {
        // do something else
    } else {
        x; // has type 'never'!
    }
}

// Function
// 全局类型 Function 描述了bind, call, apply等属性，
// 以及 JavaScript 中所有函数值上存在的其他属性。
// 它还具有始终可以调用 Function 类型的值的特殊属性；这些调用返回any：
function doSomething(f: Function) {
    f(1, 2, 3);
}
// 这是一个无类型的函数调用，通常最好避免，因为any返回类型都是不安全的。
// 如果您需要接受任意函数但不打算调用它，则类型 () => void 通常更安全。

/**
 * Rest Parameters and Arguments  
 * 与展开运算符有关
 */
// Rest Parameters
// 除了使用可选参数或重载来创建可以接受各种固定参数计数的函数之外，
// 我们还可以使用剩余参数定义具有无限数量参数的函数。
function multiply(n: number, ...m: number[]) {
    return m.map((x) => n * x);
}
// 'a' gets value [10, 20, 30, 40]
const a1 = multiply(10, 1, 2, 3, 4);
// 在 TypeScript 中，这些参数上的类型注解是隐式的 any[] 而不是 any，并且给出的任何类型注解都
// 必须是 Array<T> 或 T[] 的形式，或者是元组类型（我们将在后面学习）

// Rest Arguments
// 相反，我们可以使用扩展语法从数组中提供可变数量的参数。
// 例如，数组的 push 方法接受任意数量的参数
const arr3 = [1, 2, 3];
const arr4 = [4, 5, 6];
arr3.push(...arr4);
// 一般而言，TypeScript 不假设数组是不可变的（immutable）。这可能会导致一些令人惊讶的行为
const args = [8, 5];
const angle = Math.atan2(...args);
// 通常，const 上下文是最直接的解决方案：
// Inferred as 2-length tuple
const args1 = [8, 5] as const;
// OK
const angle1 = Math.atan2(...args1);

/**
 * Parameter Destructuring 参数解构
 */
function sum({ a, b, c }) {
    console.log(a + b + c);
}
sum({ a: 10, b: 3, c: 9 });
// 对象的类型注释遵循解构语法：
function sum1({ a, b, c }: { a: number; b: number; c: number }) {
    console.log(a + b + c);
}
sum1({ a: 10, b: 3, c: 9 });
// 这看起来有点冗长，但您也可以在这里使用命名类型：
type ABC = { a: number; b: number; c: number };
function sum3({ a, b, c }: ABC) {
    console.log(a + b + c);
}

/**
 * Assignability of Functions 
 * Functions的可分配性
 */
// Return type void
// 函数的 void 返回类型会产生一些不寻常但预期的行为。
// 返回类型为 void 的上下文类型不会强制函数不返回某些内容
type voidFunc = () => void;

const f3: voidFunc = () => {
    return true; // 能返回内容
};

const f4: voidFunc = () => true;

const f5: voidFunc = function () {
    return true; // 能返回内容
};
// 而当这些函数之一的返回值分配给另一个变量时，它将保留 void 类型：
const v1 = f3();

const v2 = f4();

const v3 = f5();
//  Array.prototype.push 返回一个数字
//  Array.prototype.forEach 方法需要一个返回类型为 void 的函数。
const src = [1, 2, 3];
const dst = [0];

src.forEach((el) => dst.push(el));
// 另一种特殊情况需要注意，当文字函数定义具有 void 返回类型时，该函数不得返回任何内容。
function f6(): void {
    // @ts-expect-error
    return true;
}

const f7 = function (): void {
    // @ts-expect-error
    return true;
};

