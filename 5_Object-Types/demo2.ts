/**
 * Intersection Types 交叉类型
 * 接口允许我们通过扩展其他类型来构建新类型。 
 * TypeScript 提供了另一种称为交集类型的构造，
 * 主要用于组合现有的对象类型。
 * 交叉类型用&运算符定义
 */
 interface Colorful {
    color: string;
}
interface Circle {
    radius: number;
}

type ColorfulCircle1 = Colorful & Circle;
// 在这里，我们将 Color 和 Circle 相交以产生一种新类型，
// 该类型具有 Color 和 Circle 的所有成员。

function draw(circle: Colorful & Circle) {
    console.log(`Color was ${circle.color}`);
    console.log(`Radius was ${circle.radius}`);
}

// okay
draw({ color: 'blue', radius: 42 })
// oops
draw({ color: 'red', raidus: 42 })

/**
 * Interfaces vs. Intersections 接口与交叉点
 * 对于接口，我们可以使用 extends 子句从其他类型扩展，
 * 我们能够使用交集做类似的事情并用类型别名命名结果。
 * 两者之间的主要区别在于如何处理冲突，
 * 而这种区别通常是您在接口和交叉类型的类型别名之间选择一个而不是另一个的主要原因之一。
 */

/**
 * Generic Object Types 通用（泛型）对象类型
 * 让我们想象一个可以包含任何值的 Box 类型——字符串、数字、长颈鹿等等。
 * 我们可以改为使用 unknown ，但这意味着在我们已经知道内容类型的情况下，
 * 我们需要进行预防性检查，或者使用容易出错的类型断言。
 */
interface Box {
    contents: unknown;
}

let x: Box = {
    contents: "hello world",
};

// we could check 'x.contents'
if (typeof x.contents === "string") {
    console.log(x.contents.toLowerCase());
}

// or we could use a type assertion
console.log((x.contents as string).toLowerCase());

// 一种安全的方法是为每种类型的内容构建不同的 Box 类型。
interface NumberBox {
    contents: number;
}

interface StringBox {
    contents: string;
}

interface BooleanBox {
    contents: boolean;
}
// 但这意味着我们必须创建不同的函数或函数的重载来对这些类型进行操作。
function setContents(box: StringBox, newContents: string): void;
function setContents(box: NumberBox, newContents: number): void;
function setContents(box: BooleanBox, newContents: boolean): void;
function setContents(box: { contents: any }, newContents: any) {
    box.contents = newContents;
}
// 引入新的类型和重载。这令人沮丧。因为我们的box类型和重载实际上都是相同的。

// 您可能会将此读作“带Type的box其内容具有type类型的东西”。
// 稍后，当我们引用 Box 时，我们必须给出一个类型参数来代替 Type。
// let box: Box<string>;
// 将 Box 视为真实类型的模板，其中 Type 是一个占位符，它将被其他类型替换。
// 当 TypeScript 看到 Box<string> 时，它将用 string 替换 Box<Type> 中的每个 Type 实例，
// 并最终使用类似 { contents: string } 的东西。
// 换句话说， Box<string> 和我们之前的 StringBox 工作方式相同。
interface Box1<Type> {
    contents: Type;
}
interface StringBox {
    contents: string;
}

let boxA: Box1<string> = { contents: "hello" };
boxA.contents;//(property) Box<string>.contents: string

let boxB: StringBox = { contents: "world" };
boxB.contents;//(property) Box<string>.contents: string
// Box1 是可重用的，因为 Type 可以用任何东西代替。
// 这意味着当我们需要一个新类型的盒子时，我们根本不需要声明一个新的 Box 类型
interface Box2<Type> {
    contents: Type;
}

interface Apple {
    // ....
}

// Same as '{ contents: Apple }'.
type AppleBox = Box2<Apple>;
// 这也意味着我们可以通过使用泛型函数来完全避免重载。

function setContents1<Type>(box: Box2<Type>, newContents: Type) {
    box.contents = newContents;
}
//  type aliases 也可以泛型
type Box3<Type> = {
    contents: Type;
};

// 由于与接口不同，类型别名不仅可以描述对象类型，还可以使用它们来编写其他类型的泛型辅助类型。
type OrNull<Type> = Type | null;

type OneOrMany<Type> = Type | Type[];

type OneOrManyOrNull1<Type> = OrNull<OneOrMany<Type>>;

type OneOrManyOrNull2<Type> = OneOrMany<Type> | null

type OneOrManyOrNullStrings = OneOrManyOrNull1<string>;

/** 回顾一下
 * The Array Type
 * 泛型对象类型通常是某种容器类型，它们独立于它们包含的元素类型起作用。
 * 当我们写出像 number[] 或 string[] 这样的类型时，
 * 这实际上只是 Array<number> 和 Array<string> 的简写。
 */
function doSomething1(value: Array<string>) {
    // ...
}

let myArray2: string[] = ["hello", "world"];

// either of these work!
doSomething1(myArray2);
doSomething1(new Array("hello", "world"));
// 很像上面的 Box 类型，Array 本身是一个泛型类型。
interface Array1<Type> {
    /**
     * Gets or sets the length of the array.
     */
    length: number;

    /**
     * Removes the last element from an array and returns it.
     */
    pop(): Type | undefined;

    /**
     * Appends new elements to an array, and returns the new length of the array.
     */
    push(...items: Type[]): number;

    // ...
}
// 现代 JavaScript 还提供了其他通用数据结构，如 Map<K, V>、Set<T> 和 Promise<T>。
// 这一切真正意味着，由于 Map、Set 和 Promise 的行为方式，它们可以与任何类型的集合一起使用。

/**
 * The ReadonlyArray Type 只读数组 类型
 * ReadonlyArray 意味着数组不可变
 */
function doStuff(values: ReadonlyArray<string>) {
    // We can read from 'values'...
    const copy = values.slice();
    console.log(`The first value is ${values[0]}`);

    // ...but we can't mutate 'values'.
    values.push("hello!");
}
// 
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
// 正如 TypeScript 为带有 Type[] 的 Array<Type> 提供速记语法一样，
// 它还为带有 readonly Type[] 的 ReadonlyArray<Type> 提供了速记语法。
function doStuff1(values: readonly string[]) {
    // We can read from 'values'...
    const copy = values.slice();
    console.log(`The first value is ${values[0]}`);

    // ...but we can't mutate 'values'.
    values.push("hello!");
}
// 最后要注意的是，与 readonly 属性修饰符不同，
// 可分配性在常规数组和 ReadonlyArrays 之间不是双向的。
let x1: readonly string[] = [];
let y: string[] = [];

x1 = y;
y = x1;

/**
 * Tuple Types 元组类型
 */
// 元组类型是另一种数组类型，它确切地知道它包含多少元素，以及它在特定位置包含哪些类型。
type StringNumberPair = [string, number];

// 这里，StringNumberPair 是字符串和数字的元组类型。
// 与 ReadonlyArray 一样，它不存在js运行时，但对 TypeScript 很重要
// 对于类型系统，StringNumberPair 描述了数组，其 0 索引包含一个字符串，其 1 索引包含一个数字。
function doSomething2(pair: [string, number]) {
    const a = pair[0];// const a: string
    const b = pair[1];// const b: number
    // ...
}

doSomething2(["hello", 42]);
// 如果我们尝试索引超过元素的数量，我们会得到一个错误。
function doSomething3(pair: [string, number]) {
    // ...
    const c = pair[2];
}
// 我们还可以使用 JavaScript 的数组解构来解构元组。
function doSomething4(stringHash: [string, number]) {
    const [inputString, hash] = stringHash;

    console.log(inputString);
    // const inputString: string

    console.log(hash);
    // const hash: number
}
// 元组类型在大量基于约定的 API 中很有用，其中每个元素的含义都是“显而易见的”。
// 这使我们在解构变量时可以灵活地命名变量。
// 在上面的示例中，我们可以将元素 0 和 1 命名为我们想要的任何名称。
// 由于并非每个用户都对显而易见的事情持有相同的看法，
// 因此可能值得重新考虑使用 具有描述性属性名称的对象 是否对您的 API 更好。

// 除了这些长度检查之外，像这样的简单元组类型等价于 声明特定索引属性的 数组 版本类型，
// 以及声明长度（length） 为数字文字类型的类型。
interface StringNumberPair1 {
    // specialized properties
    length: 2;
    0: string;
    1: number;

    // Other 'Array<string | number>' members...
    slice(start?: number, end?: number): Array<string | number>;
}
// 您可能感兴趣的另一件事是元组可以通过写出一个问号（? 在元素的类型之后）来具有可选属性。
// 可选的元组元素只能放在最后，也会影响长度的类型。

type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
    const [x, y, z] = coord;
    console.log(`Provided coordinates had ${coord.length} dimensions`);
}
// 元组也可以有剩余元素，这些元素必须是数组/元组类型。
type StringNumberBooleans = [string, number, ...boolean[]];
// 它的前两个元素分别是字符串和数字，但后面可能有任意数量的布尔值。
type StringBooleansNumber = [string, ...boolean[], number];
// 它的第一个元素是字符串，然后是任意数量的布尔值并以数字结尾。
type BooleansStringNumber = [...boolean[], string, number];
// 其起始元素为任意数量的布尔值，并以字符串和数字结尾。
// 带有 rest 元素的元组没有固定的“长度”——它只有 一组在不同位置的已知元素 设置。
const a: StringNumberBooleans = ["hello", 1];
const b: StringNumberBooleans = ["beautiful", 2, true];
const c: StringNumberBooleans = ["world", 3, true, false, true, false, true];

// 用处
function readButtonInput(...args: [string, number, ...boolean[]]) {
    const [name, version, ...input] = args;
    // ...
}
// equivalent to:
function readButtonInput1(name: string, version: number, ...input: boolean[]) {
    // ...
}
// 当您想要使用带有剩余参数的可变数量的参数，并且您需要最少数量的元素，但又不想引入中间变量时，这很方便。

/**
 * readonly Tuple Types 只读 元组类型
 * 元组类型具有只读变体，并且可以通过在它们前面粘贴一个只读修饰符来指定 - 就像数组速记语法一样。
 */
function doSomething5(pair: readonly [string, number]) {
    // ...
}
// 在 TypeScript 中不允许写入只读元组的任何属性。
function doSomething6(pair: readonly [string, number]) {
    pair[0] = "hello!";
    // Cannot assign to '0' because it is a read - only property.
}
// 元组往往被创建并保持不变，因此在可能的情况下将类型注释为只读元组是一个很好的默认设置。
// 鉴于将使用只读元组类型推断具有 const 断言的数组文字，这也很重要。
let point = [3, 4] as const;

function distanceFromOrigin([x, y]: [number, number]) {
    return Math.sqrt(x ** 2 + y ** 2);
}

distanceFromOrigin(point);
// 在这里， distanceFromOrigin 从不修改其元素，但需要一个可变元组。
// 由于 point 的类型被推断为 readonly [3, 4]，
// 它不会与 [number, number] 兼容，因为该类型不能保证 point 的元素不会发生变异。
