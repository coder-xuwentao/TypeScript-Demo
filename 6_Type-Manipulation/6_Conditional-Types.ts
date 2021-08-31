/**
 * Conditional Types 条件类型
 */
// 在大多数有用程序的核心，我们必须根据输入做出决策。 JavaScript 程序也不例外，但考虑到值可以轻松自省，这些决定也基于输入的类型。
// 条件类型有助于描述输入和输出类型之间的关系。
interface Animal {
    live(): void;
}
interface Dog extends Animal {
    woof(): void;
}

type Example1 = Dog extends Animal ? number : string;//  type Example1 = number

type Example2 = RegExp extends Animal ? number : string;// type Example2 = string
//   条件类型的形式有点像 JavaScript 中的条件表达式 
// 从上面的例子来看，条件类型可能不会立即有用——我们可以告诉自己 Dog 是否扩展了 Animal 并选择了数字或字符串！
// 但是条件类型的强大之处在于将它们与泛型一起使用。

interface IdLabel {
    id: number /* some fields */;
}
interface NameLabel {
    name: string /* other fields */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
    throw "unimplemented";
}
// createLabel 的这些重载描述了一个 JavaScript 函数，
// 该函数根据其输入类型进行选择。请注意以下几点：
// 1,如果库必须在其 API 中一遍又一遍地做出相同的选择，这将变得很麻烦。
// 2,我们必须创建三个重载：一个用于确定类型时的每种情况（一个用于字符串，一个用于数字），另一个用于最一般的情况（采用字符串 | 数字）。
// 对于 createLabel 可以处理的每个新类型，重载的数量呈指数增长。

// 相反，我们可以将该逻辑编码为条件类型
type NameOrId<T extends number | string> = T extends number
    ? IdLabel
    : NameLabel;
// 然后我们可以使用该条件类型将我们的重载简化为没有重载的单个函数。
function createLabel1<T extends number | string>(idOrName: T): NameOrId<T> {
    throw "unimplemented";
}

let a = createLabel1("typescript");
//   let a: NameLabel

let b = createLabel1(2.8);
//   let b: IdLabel
let c = createLabel1(Math.random() ? "hello" : 42);
//   let c: NameLabel | IdLabel

/**
 * Conditional Type Constraints 条件类型约束
 * 通常，条件类型中的检查会为我们提供一些新信息。
 * 就像使用类型保护(type guards)进行缩小可以为我们提供更具体的类型一样，
 * 条件类型的真正分支将通过我们检查的类型进一步 限制泛型。
 */
type MessageOf<T> = T["message"];

// 在这个例子中，TypeScript 错误是因为 T 不知道有一个叫做 message 的属性。
// 我们可以约束 T，TypeScript 就不会再抱怨了：
type MessageOf1<T extends { message: unknown }> = T["message"];

interface Email {
    message: string;
}
type EmailMessageContents = MessageOf1<Email>;

// 但是，如果我们希望 MessageOf 接受任何类型，
// 如果message 属性不可用，则默认为 never 之类的东西怎么办？
// 我们可以通过移除约束并引入条件类型来做到这一点：
type MessageOf2<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
    message: string;
}

interface Dog {
    bark(): void;
}

type EmailMessageContents1 = MessageOf2<Email>;// type EmailMessageContents1 = string
type DogMessageContents = MessageOf2<Dog>; // type DogMessageContents = never
// 在 true 分支中，TypeScript 知道 T 将有一个 message 属性。

// 作为另一个例子，我们还可以编写一个名为 Flatten 的类型，
// 它将数组类型扁平化为它们的元素类型，否则将它们单独放置：
type Flatten<T> = T extends any[] ? T[number] : T;

// Extracts out the element type.
type Str = Flatten<string[]>;// type Str = string
// Leaves the type alone.
type Num = Flatten<number>;// type Num = number

// 当 Flatten 被赋予一个数组类型时，它使用带有数字的索引访问来获取 string[] 的元素类型。否则，它只返回给定的类型。

/**
 * Inferring Within Conditional Types 在条件类型中进行推断
 * 我们刚刚发现自己使用条件类型来应用约束，然后提取出类型。
 * 这最终成为一个如此常见的操作，条件类型使它更容易。
 * 
 * 条件类型为我们提供了一种使用 infer 关键字从我们在真实分支中比较的类型进行推断的方法
 */
type Flatten1<Type> = Type extends Array<infer Item> ? Item : Type;
// 在这里，我们使用 infer 关键字声明性地引入了一个名为 Item 的新泛型类型变量，
// 而不是指定如何在 true 分支中检索 T 的元素类型。
// 这使我们不必考虑如何挖掘和探索我们需要的类型的结构。

// 我们可以使用 infer 关键字编写一些有用的辅助类型别名。
// 例如，对于简单的情况，我们可以从函数类型中提取返回类型：
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
    ? Return
    : never;

type Num1 = GetReturnType<() => number>; // type Num = number
type Str2 = GetReturnType<(x: string) => string>; // type Str = string
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>; // type Bools = boolean[]
// (a: boolean, b: boolean) => boolean[] 对应 Type
// Type再extends 这(...args: never[]) => infer Return ? Return: never;

// 当从具有多个调用签名的类型（例如重载函数的类型）进行推断时，
// 会从最后一个签名（这可能是最宽松的包罗万象的（permissive catch-all ）情况）进行推断。
// 无法根据参数类型列表执行重载决议（overload resolution）。
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;
 
type T1 = ReturnType<typeof stringOrNum>;// type T1 = string | number
     


/**
 * Distributive Conditional Types 分配条件类型
 * 当条件类型作用于泛型类型时，当给定union 类型时，它们会变成分布式（distributive ）的。
 * 
 */
type ToArray<Type> = Type extends any ? Type[] : never;

//  如果我们将联合类型插入 ToArray，则条件类型将应用于该联合的每个成员。
type ToArray1<Type> = Type extends any ? Type[] : never;
type StrArrOrNumArr = ToArray1<string | number>; // type StrArrOrNumArr = string[] | number[]
// 有效地映射到联合的每个成员类型 ToArray<string> | ToArray<number>;

// 分配性是默认的行为。为避免这种行为，您可以用方括号将 extends 关键字的每一侧括起来。
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;
 
// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr1 = ToArrayNonDist<string | number>;//type StrArrOrNumArr = (string | number)[]

           