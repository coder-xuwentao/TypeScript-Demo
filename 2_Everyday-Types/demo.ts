/**
 * Everyday Types 日常类型
 */

/**
 * The primitives:string,number,and boolean
 * 基本类型 string,number,and boolean
 */


/**
 * Arrays 数组
 * number[] 数字数组
 * string[] 字符串数组
 */

/**
 * any 任意类型
 * 当您不希望特定值导致类型检查错误，用它
 */
let obj: any = { x: 0 };
// 不报错了
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;

/**
 * noImplicitAny 
 * 用此命令不准any
 */

/**
 * Type Annotations on Variables 类型注释在变量上
 */
let myName: string = "Alice";
let myName1 = "Alice";// 不需要类型注释，ts会自动推断类型

/**
 * Functions 方法
 * Parameter Type Annotations 参数类型注释
 */
function greet(name: string) {
    console.log("Hello, " + name.toUpperCase() + "!!");
}
greet(42);// Would be a runtime error if executed!

/**
 * Return Type Annotations 返回类型注释
 */
function getFavoriteNumber(): number {
    return 26;
}
/**
 * Anonymous Functions 匿名函数
 * TypeScript 会 根据 此函数如何执行，自动赋 参数 类型
 * 这个过程称为上下文类型（contextual typing），
 * 因为 函数发生在其中 的上下文通知它应该具有什么类型。
 */
// No type annotations here, but TypeScript can spot the bug
const names = ["Alice", "Bob", "Eve"];

// Contextual typing for function
names.forEach(function (s) {
    console.log(s.toUppercase());
});

// Contextual typing also applies to arrow functions
names.forEach((s) => {
    console.log(s.toUppercase());
});

/**
 * Object Types对象类型
 */
function printCoord(pt: { x: number; y: number }) {
    console.log("The coordinate's x value is " + pt.x);
    console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
/**
 * Optional Properties 可选属性
 * 加个 ？ 
 */

function printName1(obj: { first: string; last?: string }) {
    // ...
}
// Both OK
printName1({ first: "Bob" });
printName1({ first: "Alice", last: "Alisson" });

// last可能为undefined，需要判断 
function printName(obj: { first: string; last?: string }) {
    // Error - might crash if 'obj.last' wasn't provided!
    console.log(obj.last.toUpperCase());
    if (obj.last !== undefined) {
        // OK
        console.log(obj.last.toUpperCase());
    }

    // A safe alternative using modern JavaScript syntax:
    console.log(obj.last?.toUpperCase());
}

/**
 * Union Types 联合类型
 */
// Defining a Union Type 定义
function printId(id: number | string) {
    console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });

//Working with Union Types 机制
function printId1(id: number | string) {
    console.log(id.toUpperCase());// 可能是number类型所以报错
}

//  解决办法：narrow the union 缩小联合
function printId2(id: number | string) {
    if (typeof id === 'string') {
        console.log(id.toUpperCase());
    } else {
        console.log(id);
    }
}
// eg:Array.isArray
function welcomePeople(x: string[] | string) {
    if (Array.isArray(x)) {
        console.log('hello,' + x.join('and'));
    } else {
        console.log('Welcome lone traveler' + x);
    }
}
// 如果每个成员在union中有统一个属性，你可以用这个属性without narrowing
function getFirstThree(x: number[] | string) {
    return x.slice(0, 3)
}
/**
 * Type Aliases 类型别名
 * 给类型一个名字，
 * 语法如下
 */
// 对象type aliases
type Point = {
    x: number;
    y: number;
}

function printCoord1(pt: Point) {
    console.log("The coordinate's x value is " + pt.x);
    console.log("The coordinate's y value is " + pt.y);
}
printCoord1({ x: 100, y: 100 })
// union type
type ID = number | string;

// 别名就是别名，指向同一个类型的别名不会因为不同名字而but

type UserInputSanitizedString = string;

function sanitizeInput(str: string): UserInputSanitizedString {
    return str
}

// Create a sanitized input
let userInput = sanitizeInput("str");

// Can still be re-assigned with a string though
userInput = "new input";

/**
 * Interfaces 接口
 * 接口声明 另一种声明 对象类型的方式
 */
interface Point1 {
    x: number;
    y: number;
}
function printCoord4(pt: Point) {
    console.log("The coordinate's x value is " + pt.x);
    console.log("The coordinate's y value is " + pt.y);
}

printCoord4({ x: 100, y: 100 });
// TypeScript只关心 传给printCoord4的值的结构
// Being concerned only with the structure and capabilities
//  of types is why we call TypeScript a structurally typed type system.
// 表明TypeSctipt是一个结构的类型的类型系统

// interfaces与type的区别
// interface可以重新打开类型添加属性地扩展,type不能
interface Animal {
    name: string
}

interface Bear extends Animal {
    honey: boolean
}
// 而
type Animal1 = {
    name: string
}

type Bear1 = Animal & {
    honey: boolean
}
// 直接添加字段到一个存在的interface
interface Window {
    title: string
}

interface Window {
    ts: object
}
// 大多数情况可以随便挑一个，ts会告诉你行不行的。
// ts建议你一直使用interface直到需要type的功能

/**
 * Type Assertions 类型断言
 * 你知道某值的类型，TypeScript不知道，那你可以用as 来断言
 */

const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
// TypeScript只允许类型断言用在转换更具体或不太具体的版本类型
// 不能乱转
const x = "hello" as number;

// 规则太保守？要一个复杂的有效的强转？
const a = (expr as any) as T;

/**
 * Literal Types 字面量类型
 * type是具体的内容
 */
const changingString = 'Hello World'
// ----------
let x1: "hello" = "hello";
// OK
x1 = "hello";
// ...
x1 = "howdy";
// 整合字面量到unions,更有用户，比如某个函数只接受一系列已知值集合
function printText(s: string, alignment: "left" | "right" | "center") {
    // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");
// Numeric literal types 
function compare(a: string, b: string): -1 | 0 | 1 {
    return a === b ? 0 : a > b ? 1 : -1;
}
// 和非字面量类型一起

interface Options {
    width: number;
}
function configure(x: Options | "auto") {
    // ...
}
configure({ width: 100 });
configure("auto");
configure("automatic");

/**
 * Literal Inference 字面量接口
 * 对象的属性无法通过const声明 确定类型（使其不可变）
 */
const req = { url: "https://example.com", method: "GET" };
function handleRequest(s: string, b: "GET" | "POST") { }
handleRequest(req.url, req.method);
// 解决办法：1。类型断言
// Change 1:
const req1 = { url: "https://example.com", method: "GET" as "GET" };
handleRequest(req1.url, req1.method);
// Change 2
handleRequest(req.url, req.method as "GET");
// 解决办法2、用 as const将整个对象变成字面量
const req2 = { url: "https://example.com", method: "GET" } as const;
handleRequest(req2.url, req2.method);

/**
 * null and undefined
 * typescript有对应的类型，就看strictNullChecks开不开
 */
// strictNullChecks on 需要narrow

/**
 * Non-null Assertion Operator (Postfix ！)
 * 不可能是null的断言
 */
function liveDangerously(x?: number | null) {
    // No error
    console.log(x!.toFixed());
}
// 不常见的基本类型和枚举就不说了