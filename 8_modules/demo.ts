// Modules 模块
/**
 * JavaScript 在处理模块化代码方面有着悠久的历史。自 2012 年以来，TypeScript 就出现了，
 * 已经实现了对很多这些格式的支持,但随着时间的推移，
 * 社区和 JavaScript 规范已经融合到一种称为 ES 模块（或 ES6 模块）的格式上。
 * 您可能知道它是导入/导出(import/export )语法。
 * 
 * ES Modules 于 2015 年添加到 JavaScript 规范中，到 2020 年在大多数 Web 浏览器和 JavaScript 运行时中得到广泛支持。
 * 为了重点，手册将涵盖 ES 模块及其流行的前体 CommonJS module.exports = 语法，
 * 您可以在模块下的参考部分中找到有关其他模块模式的信息。
 */

/**
 *  How JavaScript Modules are Defined  JavaScript模块是如何定义的
 * 在 TypeScript 中，就像在 ECMAScript 2015 中一样，任何包含顶级导入或导出的文件都被视为一个模块。
 * 相反，没有任何顶级导入或导出声明的文件被视为脚本，其内容在全局范围内可用（因此也对模块可用）
 * 
 * 模块在它们自己的范围内执行，而不是在全局范围内。这意味着在模块中声明的变量、函数、类等在模块外部不可见，除非它们使用导出形式之一显式导出。
 * 相反，要使用从不同模块导出的变量、函数、类、接口等，必须使用其中一种导入形式导入。
 */

/**
 * Non-modules  非模块
 * 在我们开始之前，了解 TypeScript 将什么视为模块很重要。
 * JavaScript 规范声明任何没有导出或顶级 await 的 JavaScript 文件都应被视为脚本而不是模块。
 * 
 * 在脚本文件中声明变量和类型在共享全局范围内，并且假设您将使用 --outFile 编译器选项将多个输入文件连接到一个输出文件中，
 * 或者在 HTML 中使用多个 <script> 标签来加载这些文件（以正确的顺序！）。
 * 
 * 如果您有一个当前没有任何导入或导出的文件，但您希望被视为一个模块，请添加以下行
 * export {};
 * 这会将文件更改为不导出任何内容的模块。无论您的模块目标如何，此语法都有效。
 */

/**
 * Modules in TypeScript   TypeScript 中的模块
 * 在 TypeScript 中编写基于模块的代码时，需要考虑三个主要因素：
 * 语法：我想用什么语法来导入和导出东西？
 * 模块解析：模块名称（或路径）与磁盘上的文件有什么关系？
 * 模块输出目标：我发出的 JavaScript 模块应该是什么样的？
 */

/**
 * ES 模块语法 ES Module Syntax
 * 
 */
// 文件可以通过 export default 声明主导出：
// @filename: hello.ts
export default function helloWorld() {
    console.log("Hello, world!");
}
// 然后通过以下方式导入
import hello from "./hello.js";
hello();

// 除了默认导出之外，您还可以通过省略默认导出来导出多个变量和函数：

// @filename: maths.ts
// export var pi = 3.14;
// export let squareTwo = 1.41;
// export const phi = 1.61;

// export class RandomNumberGenerator { }

// export function absolute(num: number) {
//     if (num < 0) return num * -1;
//     return num;
// }

// 这些可以通过导入语法在另一个文件中使用：
// import { pi, phi, absolute } from "./maths.js";

// console.log(pi);
// const absPhi = absolute(phi); // const absPhi: number

/**
 * Additional Import Syntax 附加导入语法
 * 可以使用 import {old as new} 之类的格式重命名导入
 */
//  import { pi as π } from "./maths.js";

//  console.log(π);

// 您可以将上述语法混合并匹配到单个导入中：
/*
// @filename: maths.ts
export const pi = 3.14;
export default class RandomNumberGenerator {}

// @filename: app.ts
import RNGen, { pi as π } from "./maths.js";
 */
// 您可以将所有导出的对象放入一个使用 * 作为名称的命名空间中：

/*
// @filename: app.ts
import * as math from "./maths.js";

console.log(math.pi);
const positivePhi = math.absolute(math.phi);
 */

// 您可以通过 import "./file" 导入文件而不将任何变量包含到当前模块中：
/*
// @filename: app.ts
import "./maths.js";
 */
// 在这种情况下，导入什么都不做。但是，对 maths.ts 中的所有代码都进行了评估，这可能会触发影响其他对象的副作用。

/**
 * TypeScript Specific ES Module Syntax  TypeScript 特定的 ES 模块语法
 * 可以使用与 JavaScript 值相同的语法导出和导入类型：
 */

/*
// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };

export interface Dog {
  breeds: string[];
  yearOfBirth: number;
}

// @filename: app.ts
import { Cat, Dog } from "./animal.js";
type Animals = Cat | Dog;
 */
// TypeScript 使用 import type 扩展了导入语法，这是一种只能导入类型的导入。

// @filename: animal.ts
export type Cat = { breed: string; yearOfBirth: number };
// 'createCatName' cannot be used as a value because it was imported using 'import type'.
export type Dog = { breeds: string[]; yearOfBirth: number };
export const createCatName = () => "fluffy";

// @filename: valid.ts
import type { Cat, Dog } from "./animal.js";
export type Animals = Cat | Dog;

// @filename: app.ts
import type { createCatName } from "./animal.js";
const name = createCatName();
// 这种语法允许非 TypeScript 转译器（如 Babel、swc 或 esbuild）知道可以安全删除哪些导入。

/**
 * ES Module Syntax with CommonJS Behavior  具有 CommonJS 行为的 ES 模块语法
 * TypeScript 具有 ES 模块语法，它与 CommonJS 和 AMD require直接相关。
 * 在大多数情况下，使用 ES 模块导入与来自这些环境的require相同，但此语法可确保您的 TypeScript 文件与 CommonJS 输出一一匹配：
 */
import fs = require("fs");
const code = fs.readFileSync("hello.ts", "utf8");

/**
 * CommonJS Syntax  通用JS语法
 */
//  CommonJS 是 npm 上大多数模块的交付格式。 即使您使用上面的 ES 模块语法进行编写，
// 对 CommonJS 语法的工作原理有一个简要的了解将有助于您更轻松地调试。

// 通过在全局调用模块上设置exports 属性来导出标识符。
function absolute(num: number) {
    if (num < 0) return num * -1;
    return num;
}

module.exports = {
    pi: 3.14,
    squareTwo: 1.41,
    phi: 1.61,
    absolute,
};

// 然后可以通过 require 语句导入这些文件
const maths = require("maths");
maths.pi; //any 

// 或者你可以使用 JavaScript 中的解构特性来简化一些：
const { squareTwo } = require("maths");
squareTwo;

/**
 * CommonJS and ES Modules interop   CommonJS 和 ES 模块互操作
 * CommonJS 和 ES Module 之间的功能不匹配，因为 ES Modules 仅支持将默认导出作为对象，而不支持作为函数。
 * TypeScript 有一个编译器标志，可以通过 esModuleInterop 减少两组不同约束之间的摩擦。
 */

/**
 * TypeScript’s Module Resolution Options   TypeScript 的模块分辨率选项
 * 模块解析是从 import 或 require 语句中获取字符串并确定该字符串引用哪个文件的过程。
 * TypeScript 包括两种解析策略：Classic 和 Node。经典，当编译器标志模块不是 commonjs 时的默认值，包含在内是为了向后兼容。
 * Node 策略复制了 Node.js 在 CommonJS 模式下的工作方式，并额外检查了 .ts 和 .d.ts。
 * 
 * 有许多 TSConfig 标志会影响 TypeScript 中的模块策略：moduleResolution、baseUrl、paths、rootDirs。
 */

/**
 * TypeScript’s Module Output Options   TypeScript 的模块输出选项
 * 有两个选项会影响发出的 JavaScript 输出：
 * target 确定哪些 JS 功能被降级（转换为在较旧的 JavaScript 运行时中运行）以及哪些保持不变 
 * module 这决定了模块之间使用哪些代码进行交互
 */

// 您使用哪个目标取决于您希望在其中运行 TypeScript 代码的 JavaScript 运行时中的可用功能。
// 那可能是：您支持的最旧的 Web 浏览器、您希望运行的最低版本的 Node.js，或者可能来自您的运行时的独特约束——例如 Electron。
// 模块之间的所有通信都通过模块加载器进行，编译器标志模块确定使用哪一个。在运行时，模块加载器负责在执行之前定位并执行模块的所有依赖项。
// 例如，这是一个使用 ES 模块语法的 TypeScript 文件，展示了模块的几个不同选项：

import { valueOfPi } from "./constants.js";

export const twoPi = valueOfPi * 2;

// ES2020
import { valueOfPi } from "./constants.js";
export const twoPi = valueOfPi * 2;

// CommonJS
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twoPi = void 0;
const constants_js_1 = require("./constants.js");
exports.twoPi = constants_js_1.valueOfPi * 2;