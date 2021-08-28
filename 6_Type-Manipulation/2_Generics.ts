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


