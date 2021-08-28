/**
 * Static type-checking 静态类型检查
 * 理想情况下，我们可以有一个工具来帮助我们在代码运行之前发现这些错误。
 * 这就是像 TypeScript 这样的静态类型检查器所做的。
 */
const message = "hello!"
message(); // Type 'String' has no call signatures.


/**
 * Non-exception Failures 非异常故障
 * 根据ECMAScript规范,获取对象不存在的属性会报错
 * 但js却不弹出错误（exception），只是返回undefined
 * ts 帮你报错
 */
const user = {
    name: "Daniel",
    age: 26,
};
user.location; // js returns undefined
// -------------------------------------------------
// 错别字 typos
const announcement = "Hello World!";

// How quickly can you spot the typos?
announcement.toLocaleLowercase();
announcement.toLocalLowerCase();

// We probably meant to write this...
announcement.toLocaleLowerCase();
// -------------------------------------------------
// 忘记调用函数 uncalled functions,
function flipCoin() {
    // Meant to be Math.random()
    return Math.random < 0.5;
}
// -------------------------------------------------
// 逻辑错误 or basic logic errors.
const value = Math.random() < 0.5 ? "a" : "b";
if (value !== "a") {
    // ...
} else if (value === "b") {
    // Oops, unreachable
}


/**
 * Types for Tooling 类型之工具性
 * 代码提示
 * 比如打一个对象，属性会在编辑器中提示
 */


/**
 * tsc, the TypeScript compiler TS编译器
 * 命令行中输入：
 * npm install -g typescript
 * tsc hello.ts
 */


/**
 * Emitting with Errors 发射错误
 * 报错后你tsc代码依然有编译结果，因为Typescript认为你更懂代码
 * 命令行中输入，可让hello.ts错误时候不编译：
 * tsc --noEmitOnError hello.ts
 */


/**
 * Explicit Types 显式类型
 * 告诉 typescript 某个内容 是什么类型
 */
function greet(person: string, date: Date) {
    console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", Date()); // ×
greet("Maddison", new Date()); // √

let msg /*let msg: string*/ = "hello there!";


/**
 * Erased Types 擦除类型
 * 编译时会 擦除类型，转成能让浏览器运行的js 
 */
// 编译ts为js，如：
//    "use strict";
//    function greet(person, date) {
//        console.log("Hello " + person + ", today is " + date.toDateString() + "!");
//    }
//    greet("Maddison", new Date());


/**
 * Downleveling 降级
 * 编译ts时，编成ES3的js
 * 若想编译成es2015,则：
 * tsc --target es2015 hello.ts
 */
// `Hello ${person}, today is ${date.toDateString()}!`;
// 转成
// "Hello " + person + ", today is " + date.toDateString() + "!";

/**
 * Strictness 严格模式
 * 默认严格模式
 * ts有几个类型检查 严格模式 的开关， 如noImplicitAny 和 strictNullChecks 
 */

/**
 *  noImplicitAny 不准 隐含的 any（任意）
 * 使用any类型破坏使用ts的初衷
 * 打开 noImplicitAny 就不准类型为 any
 */

/**
 * strictNullChecks 不准null之检查
 * null 、 undefined经常造成错误，不准用
 */
