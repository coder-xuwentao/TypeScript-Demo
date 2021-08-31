/**
 * Generics泛型
 * 软件工程的一个主要部分是构建不仅具有明确定义和一致的 API，而且还可以重用的组件。
 * 能够处理当前数据和未来数据的组件将为您提供最灵活的功能，构建大型软件系统。
 * 在 C# 和 Java 等语言中，工具箱中用于创建可重用组件的主要工具之一是泛型，
 * 即能够创建可以在多种类型而不是单一类型上工作的组件
 * 这允许用户使用这些组件并使用他们自己的类型。
 */

/**
 * Hello World of Generics
 * 首先，让我们做泛型的“hello world”：恒等函数(the identity function)。 
 * identity 函数是一个函数，它会返回传入的任何内容。
 * 您可以以类似于 echo 命令的方式来考虑这一点。
 */
//  如果没有泛型，我们要么必须给identity函数一个特定的类型：
function identity(arg: number): number {
    return arg;
}
// 或者，我们可以使用 any 类型来描述身份函数：
function identity1(arg: any): any {
    return arg;
}
// 虽然使用 any 肯定是通用的，因为它会导致函数接受 arg 类型的任何和所有类型，
// 但我们实际上正在丢失 有关函数返回时该类型是什么的 信息
// 如果我们传入一个数字，我们所拥有的唯一信息就是可以返回任何类型。

// 相反，我们需要一种捕获参数类型的方法，以便我们也可以使用它来表示返回的内容。
// 在这里，我们将使用类型变量，这是一种特殊的变量，它作用于类型而不是值。
function identity2<Type>(arg: Type): Type {
    return arg;
}
// 我们现在已经为恒等函数添加了一个类型变量 Type。此类型允许我们捕获用户提供的类型（例如数字），以便我们稍后可以使用该信息。
// 这里，我们再次使用 Type 作为返回类型
// 在检查中，我们现在可以看到参数和返回类型使用相同的类型。
// 这允许我们在函数的一侧传入该类型的信息，而在另一侧传出。

// 我们说这个版本的身份函数是通用的（泛型），因为它适用于一系列类型。
// 与使用 any 不同，它也与第一个使用数字作为参数和返回类型的恒等函数一样精确（即，它不会丢失任何信息）

// 一旦我们编写了通用恒等函数（generic identity function），我们就可以用两种方式之一调用它。
// 第一种方法是将所有参数（包括类型参数）传递给函数：
let output = identity2<string>("myString");
// 这里我们明确地将 Type 设置为 string 作为函数调用的参数之一，使用 <> 来表示参数而不是 ()。
// 第二种方式也可能是最常见的。这里我们使用类型参数推断——也就是说，
// 我们希望编译器根据我们传入的参数类型自动为我们设置 Type 的值：
let output1 = identity2("myString");
// 请注意，我们不必在尖括号 (<>) 中显式传递类型；编译器只查看值“myString”，并将 Type 设置为其类型
// 当类型推断不出时候你就需要传递类型参数了，如第一个例子

/**
 * Working with Generic Type Variables 使用泛型类型变量
 * 当您开始使用泛型时，您会注意到，当您创建诸如identity之类的泛型函数时，
 * 编译器将强制您正确使用函数体中的任何泛型类型参数。
 * 也就是说，您实际上将这些参数视为任何（ any and all ）类型。
 */
function identity3<Type>(arg: Type): Type {
    return arg;
}
// 如果我们还想在每次调用时将参数 arg 的长度记录到控制台怎么办？我们可能会想这样写：
function loggingIdentity<Type>(arg: Type): Type {
    console.log(arg.length);
    return arg;
}
// 我们之前说过这些类型变量代表任何和所有类型，因此使用此函数的人可以传入一个数字，而该数字没有 .length 成员。
// 假设我们实际上打算将此函数用于处理 Type 数组而不是直接处理 Type。
// 由于我们正在处理数组，
// 因此 .length 成员应该可用。我们可以像创建其他类型的数组一样描述它：
function loggingIdentity1<Type>(arg: Type[]): Type[] {
    console.log(arg.length);
    return arg;
}
// 您可以将 loggingIdentity 的类型理解为
// “泛型函数 loggingIdentity 接受一个类型参数 Type 和一个参数 arg，它是一个类型数组，并返回一个类型数组。”
// 如果我们传入一个数字数组，我们将返回一个数字数组，因为 Type 将绑定到数字。
// 这允许我们使用我们的泛型类型变量 Type 作为我们正在使用的类型的一部分，，而不是整个类型，从而为我们提供更大的灵活性。
// 我们也可以这样编写示例示例：
function loggingIdentity2<Type>(arg: Array<Type>): Array<Type> {
    console.log(arg.length); // Array has a .length, so no more error
    return arg;
}

/**
 * Generic Types 通用类型
 * 在前面的部分中，我们创建了适用于一系列类型的 identity functions 。
 * 在本节中，我们将探讨函数本身的类型以及如何创建泛型(generic)接口。
 * 泛型函数的类型和非泛型函数一样，都是先列出类型参数，类似于函数声明：
 */
function identity4<Type>(arg: Type): Type {
    return arg;
}

let myIdentity: <Type>(arg: Type) => Type = identity4;
// 我们也可以为 类型中的 泛型类型参数 使用不同的名称，
// 只要类型变量的 数量 和类型变量的使用方式一致即可。
function identity5<Type>(arg: Type): Type {
    return arg;
}

let myIdentity1: <Input>(arg: Input) => Input = identity5;
// 我们还可以将泛型类型写为 对象字面量类型的调用签名 （a call signature of an object literal type）：
function identity6<Type>(arg: Type): Type {
    return arg;
}

let myIdentity2: { <Type>(arg: Type): Type } = identity6;

// 这会引导我们编写第一个通用接口。让我们从前面的例子中获取对象字面量，并将其移动到一个接口interface中：
interface GenericIdentityFn {
    <Type>(arg: Type): Type;
}

function identity7<Type>(arg: Type): Type {
    return arg;
}

let myIdentity3: GenericIdentityFn = identity7;

// 在类似的示例中，我们可能希望将泛型参数移动为整个接口的参数。
// 这让我们可以看到我们通用的类型（例如 Dictionary<string> 而不仅仅是 Dictionary）。
// 这使得类型参数对接口的所有其他成员可见。
interface GenericIdentityFn1<Type> {
    (arg: Type): Type;
}

function identity8<Type>(arg: Type): Type {
    return arg;
}

let myIdentity4: GenericIdentityFn1<number> = identity8;

// 请注意，我们的示例已更改为稍微不同的内容。
// 我们现在有一个非泛型函数签名，它是泛型类型的一部分，而不是描述泛型函数。
// 当我们使用 GenericIdentityFn 时，我们现在还需要指定相应的类型参数（此处：数字），有效地锁定底层调用签名将使用的内容。
// 了解何时将类型参数直接放在调用签名上以及何时将其放在接口本身上将有助于描述类型的哪些方面是通用的。

// 除了泛型接口，我们还可以创建泛型类。请注意，无法创建通用枚举和命名空间。
/**
 * Generic Classes 泛型类
 * 泛型类具有与泛型接口相似的形状。泛型类在类名后面的尖括号 (<>) 中有一个泛型类型参数列表。
 */
class GenericNumber<NumType> {
    zeroValue: NumType;
    add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
    return x + y;
};

// 这是对 GenericNumber 类的非常直接的使用，但您可能已经注意到没有任何东西限制它只能使用数字类型。
// 我们可以改用字符串或更复杂的对象。
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) {
    return x + y;
};

console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
// 就像接口一样，将类型参数放在类本身上可以确保类的所有属性都使用相同的类型。
// 泛型类仅在实例而非静态端是泛型的，因此在使用类时，静态成员不能使用类的类型参数。

/**
 * Generic Constraints 泛型约束
 * 如果您还记得之前的示例，您有时可能想要编写一个适用于一组类型的泛型函数，
 * 您可以了解一组类型将具有哪些功能。
 * 在我们的 loggingIdentity 示例中，我们希望能够访问 arg 的 .length 属性，
 * 但编译器无法证明每个类型都有 .length 属性，因此它警告我们不能做出这个假设。
 */
function loggingIdentity3<Type>(arg: Type): Type {
    console.log(arg.length);
    return arg;
}
// 我们不想使用any和all类型，而是希望将此函数限制为使用也具有 .length 属性的用any和all类型。
// 只要类型有这个成员，我们就会允许它，但至少需要有这个成员。
// 为此，我们必须列出我们的需求作为对 Type 可以是什么的约束。
interface Lengthwise {
    length: number;
}

function loggingIdentity4<Type extends Lengthwise>(arg: Type): Type {
    console.log(arg.length); // Now we know it has a .length property, so no more error
    return arg;
}
// 由于泛型函数现在受到约束，它将不再适用于任何和所有类型：
// 相反，我们需要传入类型具有所有必需属性的值：
loggingIdentity4(1111);
loggingIdentity({ length: 10, value: 3 });


/**
 * Using Type Parameters in Generic Constraints 在泛型约束中使用类型参数
 * 您可以声明受另一个类型参数约束的类型参数。例如，这里我们想从一个给定名称的对象中获取一个属性。
 * 我们想确保我们不会意外地获取 obj 上不存在的属性，因此我们将在两种类型之间放置一个约束：
 */
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
    return obj[key];
}
let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");

/**
 * Using Class Types in Generics 在泛型中使用类的类型
 * 在 TypeScript 中使用泛型创建工厂时，需要通过它们的构造函数来引用类类型。例如，
 */
function create<Type>(c: { new(): Type }): Type {
    return new c();
}
//   一个更高级的示例使用原型属性来推断和约束构造函数和类类型的实例端之间的关系
class BeeKeeper {
    hasMask: boolean = true;
}

class ZooKeeper {
    nametag: string = "Mikle";
}

class Animal {
    numLegs: number = 4;
}

class Bee extends Animal {
    keeper: BeeKeeper = new BeeKeeper();
}

class Lion extends Animal {
    keeper: ZooKeeper = new ZooKeeper();
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;