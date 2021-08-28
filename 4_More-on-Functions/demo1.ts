/**
 * More on Functions
 * TypeScript有很多方法来描述如何调用函数
 */
/**
 * Function Type Expressions 函数类型表达式
 * 描述函数的最简单方法就是 Function Type Expressions
 * 这些类型 语法上 类似箭头函数
 */
function greeter(fn: (a: string) => void) {
    fn("Hello, World");
}

function printToConsole(s: string) {
    console.log(s);
}

greeter(printToConsole);
// 语法 (a: string) => void 
// 表示“带有一个名为 a 的参数的函数，类型为 string，没有返回值”。
// 就像函数声明一样，如果未指定参数类型，则它隐式为 any。
type GreetFunction = (a: string) => void;
function greeter1(fn: GreetFunction) {
    // ...
}

/**
 * Call Signatures 调用 签名
 * function可以拥有属性，可是函数类型表达式 语法不允许声明属性
 * 此时在对象类型中写一个调用签名
 */
type DescribableFunction = {
    description: string;
    (someArg: number): boolean;
};
function doSomething(fn: DescribableFunction) {
    console.log(fn.description + " returned " + fn(6));
}
// 请注意，与函数类型表达式 语法不同
// 在参数列表和返回类型之间使用：而不是=>

/**
 * Construct Signatures 构造签名
 */
type SomeConstructor = {
    new(s: string): object;
};
function fn(ctor: SomeConstructor) {
    ctor("hi")
    return new ctor("hello");
}
// 有些如Date的对象，可以调用 with or without new
// 可以任意组合 call和construct 签名 在同一个 type 中
interface CallOrConstruct {
    new(s: string): Date;
    (n?: number): number;
}
/**
 * Generic Functions 通用函数
 * 一个函数，输入的类型和输出的类型相关 或 两个输入的类型相关
 */
// 考虑下面 返回 数组第一个元素 的函数
function firstElement(arr: any[]) {
    return arr[0];//返回的类型为any
}

// 在TypeScript中，当要描述两值的对应关系时，用泛型（generics）
// 在函数签名中声明一个类型 做泛型
// 在输入和输出写了 类型参数"Type"
function firstElement1<Type>(arr: Type[]): Type {
    return arr[0];// (parameter) arr: Type[]
}
// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);

/**
 * Inference 推理
 * 不需要明确 "Type" 在上例中，type是被TypeScript推断得
 */
// 可以用多个类型参数，如下
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
    return arr.map(func);
}

// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));

/**
 * Constraints 约束
 * 泛型的函数中，我们却需要关联两个值，只对某个值的子集内容进行操作，如下
 */
function longest<Type extends { length: number }>(a: Type, b: Type) {
    if (a.length >= b.length) {
        return a;
    } else {
        return b;
    }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'string'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
// infer

/**
 * Working with Constrained Values 使用受约束的值
 */
function minimumLength<Type extends { length: number }>(
    obj: Type,
    minimum: number
): Type {
    if (obj.length >= minimum) {
        return obj;
    } else {
        return { length: minimum };
    }
}
// 上述代码看起来合理，但是该函数承诺返回与传入相同类型的对象，
// 而不仅是与约束对象匹配的对象。不合理如下
// 'arr' 获得 { length: 6 }
const arr2 = minimumLength([1, 2, 3], 6);
// 崩溃因为 数组有一个slice 方法，用slice不返回对象
console.log(arr2.slice(0));

/**
 * Specifying Type Arguments 指定类型参数
 * 并非TypeScript可以推断泛型出预期的类型参数
 * 如一个用来连接两个数组的函数
 */
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
    return arr1.concat(arr2);
}
const arr = combine([1, 2, 3], ["hello"]);
// 不过你可手动指定Type
const arr1 = combine<string | number>([1, 2, 3], ["hello"]);

/**
 * Guidelines for Writing Good Generic Functions 编写良好泛型函数的指南
 */
//  Push Type Parameters Down下推类型参数
// 规则：尽可能地使用类型参数自身 而不是约束它
function firstElement3<Type>(arr: Type[]) {
    return arr[0];
}

function firstElement2<Type extends any[]>(arr: Type) {
    return arr[0];
}

// a: number (good)
const a = firstElement3([1, 2, 3]);
// b: any (bad)
const b = firstElement2([1, 2, 3]);
// firstElement3推断type是Type
//  firstElement2 的推断返回类型是 any，因为TypeScript必须使用约束类型解析arr[0]


// Use Fewer Type Parameters使用更少的类型参数
// 规则：尽可能使用更少的类型参数
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
    return arr.filter(func);
}

function filter2<Type, Func extends (arg: Type) => boolean>(
    arr: Type[],
    func: Func
): Type[] {
    return arr.filter(func);
}

// Type Parameters Should Appear Twice类型参数应该出现两次
// 规则: 如果一个类型参数只出现在一个位置，强烈重新考虑你是否真的需要它
function greet<Str extends string>(s: Str) {
    console.log("Hello, " + s);
}

greet("world");
// simpler version:
function greet1(s: string) {
    console.log("Hello, " + s);
}

// Optional Parameters 可选参数用?表明参数可选
function f(x?: number) { // 就是 number | undefined
    // ...
}
f(); // OK
f(10); // OK
// Optional Parameters in Callbacks 可选参数在回调中
function myForEach1(arr: any[], callback: (arg: any, index?: number) => void) {
    for (let i = 0; i < arr.length; i++) {
        callback(arr[i], i);
    }
}
myForEach1([1, 2, 3], (a) => console.log(a));
myForEach1([1, 2, 3], (a, i) => console.log(a, i));

// 这实际上意味着回调可能会被一个参数调用。换句话说，函数定义说实现可能是这样的：
function myForEach2(arr: any[], callback: (arg: any, index?: number) => void) {
    for (let i = 0; i < arr.length; i++) {
        // I don't feel like providing the index today
        callback(arr[i]);
    }
}
// 反过来，这将导致TypeScript执行此含义并发出不可能的错误、
myForEach2([1, 2, 3], (a, i) => {
    console.log(i.toFixed());
});
// 参数较少（相同类型）的函数总是可以代替参数较多的函数。
// 为回调编写函数类型时，切勿编写可选​​参数
// ，除非您打算在不传递该参数的情况下调用该函数

