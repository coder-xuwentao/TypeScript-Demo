// Classes
/**
 * Class Members
 * 类成员
 */

/**
 * Fields字段
 */
// 字段声明在类上创建公共可写属性：
class Point {
    x: number;
    y: number;
}

const pt = new Point();
pt.x = 0;
pt.y = 0;

// 与其他位置一样，类型注释是可选的，但如果未指定，则为隐式 any。

// 字段也可以有初始化器；类属性的初始值设定项将用于推断其类型：
class Point1 {
    x = 0;
    y = 0;
}

const pt1 = new Point1();
// Prints 0, 0
console.log(`${pt1.x}, ${pt1.y}`);

pt1.x = "0";

/**
 * --strictPropertyInitialization
 * strictPropertyInitialization 控制是否需要在构造函数中初始化类字段。
 */
class BadGreeter {
    name: string;
    // 多打开--strictPropertyInitialization则报错如下：
    // Property 'name' has no initializer and is not definitely assigned in the constructor.
}
// 改如下：
class GoodGreeter {
    name: string;

    constructor() {
        this.name = "hello";
    }
}
// 请注意，该字段需要在构造函数本身中进行初始化。
//  TypeScript 不会分析您从构造函数调用的方法来检测初始化，
// 因为派生类可能会覆盖这些方法并且无法初始化成员。

// 如果您打算通过构造函数以外的方式明确初始化字段
// （例如，可能外部库正在为您填充类的一部分），您可以使用明确赋值断言运算符，！：
class OKGreeter {
    // Not initialized, but no error
    name!: string;
}

/**
 * readonly
 * 字段可以使用 readonly 修饰符作为前缀。这可以防止对构造函数之外的字段进行赋值。
 */
class Greeter {
    readonly name: string = "world";

    constructor(otherName?: string) {
        if (otherName !== undefined) {
            this.name = otherName;
        }
    }

    err() {
        this.name = "not ok";
        // Cannot assign to 'name' because it is a read-only property.
    }
}
const g = new Greeter();
g.name = "also not ok";
// Cannot assign to 'name' because it is a read-only property.

/**
 * Constructors 构造函数
 * 类构造函数与函数非常相似。您可以添加带有类型注释、默认值和重载的参数：
 */
class Point2 {
    x: number;
    y: number;

    // Normal signature with defaults
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
class Point3 {
    // Overloads
    constructor(x: number, y: string);
    constructor(s: string);
    constructor(xs: any, y?: any) {
        // TBD
    }
}

// 类构造函数签名和函数签名之间只有一些区别：
// 构造函数不能有类型参数——这些属于外部类声明，我们稍后会了解
// 构造函数不能有返回类型注释——类实例类型总是返回的

/**
 * Super Calls
 * 就像在 JavaScript 中一样，如果你有一个基类，
 * 你需要调用 super();在使用任何 this 之前在你的构造函数体中。成员：
 */

class Base {
    k = 4;
}

class Derived extends Base {
    constructor() {
        // Prints a wrong value in ES5; throws exception in ES6
        console.log(this.k);
        //   'super' must be called before accessing 'this' in the constructor of a derived class.
        super();
    }
}
// 在 JavaScript 中忘记调用 super 是一个容易犯的错误，但 TypeScript 会在必要时告诉你。

/**
 * Methods
 * 类上的函数属性称为方法。方法可以使用所有与函数和构造函数相同的类型注释：
 */
class Point4 {
    x = 10;
    y = 10;

    scale(n: number): void {
        this.x *= n;
        this.y *= n;
    }
}
// 除了标准类型注解之外，TypeScript 不会向方法添加任何其他新内容。
// 请注意，在方法主体内部，仍然必须通过 this 访问字段和其他方法。 
// 方法主体中 的非限定名称 将始终引用 封闭范围内 的内容：（An unqualified name in a method body will always refer to something in the enclosing scope:）

let x: number = 0;

class C {
    x: string = "hello";

    m() {
        // This is trying to modify 'x' from line 1, not the class property
        x = "world";
        // Type 'string' is not assignable to type 'number'.
    }
}

/**
 * Getters / Setters
 * 类也可以有访问器:
 */

class C1 {
    _length = 0;
    get length() {
        return this._length;
    }
    set length(value) {
        this._length = value;
    }
}

// 请注意，没有额外逻辑的字段支持的 get/set 对在 JavaScript 中很少有用。
// 如果您不需要在 get/set 操作期间添加额外的逻辑，那么公开公共字段就可以了。

// TypeScript 对访问器有一些特殊的推理规则：
// 1、如果 get 存在但没set，则该属性自动为只读 
// 2、如果没有指定setter参数的类型，则根据getter的返回类型推断
// 3、Getter 和 setter 必须具有相同的成员可见性（Member Visibility）(下面会说)

// 从 TypeScript 4.3 开始，可以使用不同类型的访问器来获取和设置。（vscode没更新）
class Thing {
    _size = 0;

    get size(): number {
        return this._size;
    }

    set size(value: string | number | boolean) {
        let num = Number(value);

        // Don't allow NaN, Infinity, etc

        if (!Number.isFinite(num)) {
            this._size = 0;
            return;
        }

        this._size = num;
    }
}

/**
 * Index Signatures
 * 索引签名
 * 类可以声明索引签名；这些工作与其他对象类型的索引签名（Index Signatures）相同：
 */
class MyClass {
    [s: string]: boolean | ((s: string) => boolean);

    check(s: string) {
        return this[s] as boolean;
    }
}
// 因为索引签名类型还需要捕获方法的类型，所以并不容易有效地使用这些类型。
// 通常最好将索引数据存储在另一个地方而不是类实例本身。

/**
 * Class Heritage 类的遗产
 * 与其他具有面向对象特性的语言一样，JavaScript 中的类可以从基类继承。
 */
/**
 * implements Clauses 工具 条款
 * 您可以使用 implements 子句来检查类是否满足特定接口。
 * 如果一个类未能正确实现它，则会发出错误：
 */
interface Pingable {
    ping(): void;
}

class Sonar implements Pingable {
    ping() {
        console.log("ping!");
    }
}

class Ball implements Pingable {
    // Class 'Ball' incorrectly implements interface 'Pingable'.
    // Property 'ping' is missing in type 'Ball' but required in type 'Pingable'.
    pong() {
        console.log("pong!");
    }
}
// 类也可以实现多个接口，例如C 类实现 A, B {。

/**
 * Cautions 注意事项
 * 重要的是要理解implements 子句只是检查类是否可以被视为接口类型。
 * 它根本不会改变类的类型或其方法。
 * 一个常见的错误来源是假设一个 implements 子句会改变类的类型——它不会！
 */
interface Checkable {
    check(name: string): boolean;
}

class NameChecker implements Checkable {
    check(s) {
        // Parameter 's' implicitly has an 'any' type.
        // Notice no error here
        return s.toLowercse() === "ok";
        // any
    }
}

// 在这个例子中，我们可能期望 s 的类型会受到 check 的 name: string 参数的影响。不是 - 
// 实现子句不会改变类主体的检查方式或类型推断方式。

// 同样，使用可选属性实现接口不会创建该属性：
interface A {
    x: number;
    y?: number;
}
class C2 implements A {
    x = 0;
}
const c = new C2();
c.y = 10;
// Property 'y' does not exist on type 'C'.

/**
 * extends Clauses 延伸 条款
 * 类可以从基类扩展(extend)。派生类具有其基类的所有属性和方法，还定义了其他成员。
 */
class Animal {
    move() {
        console.log("Moving along!");
    }
}

class Dog extends Animal {
    woof(times: number) {
        for (let i = 0; i < times; i++) {
            console.log("woof!");
        }
    }
}

const d = new Dog();
// Base class method
d.move();
// Derived class method
d.woof(3);

/**
 * Overriding Methods 覆盖方法
 * 派生类还可以覆盖基类字段或属性。你可以使用超级。访问基类方法的语法。
 * 请注意，因为 JavaScript 类是一个简单的查找对象，所以没有“超级字段”的概念。
 */
//  TypeScript 强制派生类始终是其基类的子类型。
class Base1 {
    greet() {
        console.log("Hello, world!");
    }
}

class Derived1 extends Base1 {
    greet(name?: string) {
        if (name === undefined) {
            super.greet();
        } else {
            console.log(`Hello, ${name.toUpperCase()}`);
        }
    }
}

const d1 = new Derived1();
d1.greet();
d1.greet("reader");

// 派生类遵循其基类契约很重要。
// 记住，通过基类引用来引用派生类实例是很常见的（而且总是合法的！）：
// Alias the derived instance through a base class reference
const b1: Base1 = d1;
// No problem
b1.greet();

// What if Derived didn’t follow Base’s contract(合同)?
class Base2 {
    greet() {
        console.log("Hello, world!");
    }
}

class Derived2 extends Base2 {
    // Make this parameter required
    greet(name: string) {
        // Property 'greet' in type 'Derived' is not assignable to the same property in base type 'Base'.
        // Type '(name: string) => void' is not assignable to type '() => void'.
        console.log(`Hello, ${name.toUpperCase()}`);
    }
}
// 如果我们不顾错误编译了这段代码，这个示例就会崩溃：
const b2: Base = new Derived2();
// Crashes because "name" will be undefined
b2.greet();

/**
 * Initialization Order 初始化顺序
 * 在某些情况下，JavaScript 类的初始化顺序可能会令人惊讶。让我们考虑一下这段代码：
 */
class Base3 {
    name = "base";
    constructor() {
        console.log("My name is " + this.name);
    }
}

class Derived3 extends Base3 {
    name = "derived";
}

// Prints "base", not "derived"
const d3 = new Derived3();
// 这里发生了什么？ JavaScript 定义的类初始化顺序是：
//  基类字段被初始化 基类构造函数运行 派生类字段被初始化 派生类构造函数运行

/**
 * Inheriting Built-in Types 继承内置类型
 * 注意：如果你不打算继承诸如 Array、Error、Map 等内置类型，或者你的编译目标明确设置为 ES6/ES2015 或更高版本，你可以跳过这一节
 * 
 * 在 ES2015 中，返回对象的构造函数隐式地将 this 的值替换为 super(...) 的任何调用者。
 * 生成的构造函数代码有必要捕获 super(...) 的任何潜在返回值并将其替换为 this。
 * 
 * 因此，子类化 Error、Array 和其他类 可能不再按预期工作。这是因为 Error、Array 
 * 等构造函数使用 ECMAScript 6 的 new.target 来调整原型链；
 * 但是，在 ECMAScript 5 中调用构造函数时，无法确保 new.target 的值。
 * 其他下层（downlevel ）编译器默认情况下通常具有相同的限制。
 */
// 对于像下面这样的子类：
class MsgError extends Error {
    constructor(m: string) {
        super(m);
    }
    sayHello() {
        return "hello " + this.message;
    }
}
// 通过构造这些子类返回的对象上的方法可能未定义，因此调用 sayHello 将导致错误。
// instanceof 将在子类的实例和它们的实例之间中断，因此 (new MsgError()) instanceof MsgError 将返回 false。
// 作为建议，您可以在任何 super(...) 调用后立即手动调整原型。
class MsgError1 extends Error {
    constructor(m: string) {
        super(m);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, MsgError1.prototype);
    }

    sayHello() {
        return "hello " + this.message;
    }
}
// 但是，任何 MsgError 的子类也必须手动设置原型。
// 对于不支持 Object.setPrototypeOf 的运行时，您可以改为使用 __proto__。
// 不幸的是，这些变通办法不适用于 Internet Explorer 10 及更早版本。可以手动将方法从原型复制到实例本身
// （即，将 MsgError.prototype 复制到实例上），但原型链本身无法修复。

/**
 * Member Visibility 成员可见度（成员封装？）
 * 您可以使用 TypeScript 来控制某些方法或属性是否对类外的代码可见。
 */

// public
// 类成员的默认可见性是公开的。可以在任何地方访问公共成员：
class Greeter1 {
    public greet() {
        console.log("hi!");
    }
}
const g1 = new Greeter1();
g1.greet();
// 因为 public 已经是默认的可见性修饰符，所以你不需要将它写在类成员上，但可能出于样式/可读性原因选择这样做。

// protected
// 受保护的成员仅对声明它们的类的子类可见。
class Greeter2 {
    public greet() {
        console.log("Hello, " + this.getName());
    }
    protected getName() {
        return "hi";
    }
}

class SpecialGreeter extends Greeter2 {
    public howdy() {
        // OK to access protected member here
        console.log("Howdy, " + this.getName());
    }
}
const g2 = new SpecialGreeter();
g2.greet(); // OK
g2.getName();
// Property 'getName' is protected and only accessible within class 'Greeter' and its subclasses.

/**
 * Exposure of protected members  受保护成员的暴露
 * 派生类需要遵循其基类契约，但可以选择公开具有更多功能的基类子类型。
 * 这包括公开受保护的成员：
 */
class Base4 {
    protected m = 10;
}
class Derived4 extends Base4 {
    // No modifier, so default is 'public'
    m = 15;
}
const d2 = new Derived4();
console.log(d2.m); // OK
// 请注意，Derived 已经能够自由地读取和写入 m，因此改变这种情况的“安全性”没意义。
// 这里要注意的主要事情是，在派生类中，如果这种暴露不是故意的，我们需要小心地重复protected 的修饰符。

/**
 * Cross-hierarchy protected access 跨层次保护访问
 * 对于通过基类引用访问受保护成员是否合法，不同的 面向对象（OOP）语言存在分歧：
 */
class Base5 {
    protected x: number = 1;
}
class Derived5 extends Base5 {
    x: number = 5;
    // 原文档 protected x: number = 5;
}
class Derived6 extends Base5 {
    f1(other: Derived5) {
        other.x = 10;
    }
    f2(other: Base5) {
        other.x = 10;
        // Property 'x' is protected and only accessible through an instance of class 'Derived2'.This is an instance of class 'Base'.
    }
}
// 例如，Java 认为这是合法的。另一方面，C# 和 C++ 选择了这段代码应该是非法的。

/**
 * private
 * private 类似于 protected，但不允许从子类访问成员：
 */
class Base6 {
    private x = 0;
}
const b = new Base6();
// Can't access from outside the class
console.log(b.x);

class Derived8 extends Base6 {
    showX() {
        // Can't access in subclasses
        console.log(this.x);
        //   Property 'x' is private and only accessible within class 'Base'.
    }
}
// 因为私有成员对派生类不可见，所以派生类不能增加其可见性
class Base7 {
    private x = 0;
}
class Derived9 extends Base7 {
    // Class 'Derived' incorrectly extends base class 'Base'.
    // Property 'x' is private in type 'Base' but not in type 'Derived'.
    x = 1;
}

/**
 * Cross-instance private access
 * 跨实例私有访问
 * 对于同一个类的不同实例是否可以访问彼此的私有成员，不同的 OOP 语言存在分歧。
 * 虽然 Java、C#、C++、Swift 和 PHP 等语言允许这样做，但 Ruby 不允许。
 */
// TypeScript 确实允许跨实例私有访问：
class A1 {
    private x = 10;

    public sameAs(other: A) {
        // No error
        return other.x === this.x;
    }
}

/**
 * Caveats 注意事项
 * 与 TypeScript 类型系统的其他方面一样，private 和 protected 仅在类型检查期间强制执行。
 * 这意味着 JavaScript 运行时 构造体（如 in 或简单属性查找）仍然可以访问private或protected成员：
 */
class MySafe {
    private secretKey = 12345;
}
// In a JavaScript file...
const s = new MySafe();
// Will print 12345
console.log(s.secretKey);

// private 还允许在类型检查期间使用括号表示法进行访问。
// 这使得私有声明的字段可能更容易被单元测试之类的东西访问，缺点是这些字段是软私有的，不严格执行隐私。
class MySafe1 {
    private secretKey = 12345;
}

const s1 = new MySafe1();

// Not allowed during type checking
console.log(s1.secretKey);
//   Property 'secretKey' is private and only accessible within class 'MySafe'.
// OK
console.log(s["secretKey"]);

// 与 TypeScripts 的私有不同，JavaScript 的私有字段 (#) 
// 在编译后保持私有，并且不提供前面提到的转义舱口，如括号符号访问，使它们成为硬私有。
class Dog1 {
    #barkAmount = 0;
    personality = "happy";

    constructor() { }
}
"use strict";
class Dog2 {
    #barkAmount = 0;
    personality = "happy";
    constructor() { }
}
// 当编译到 ES2021 或更低版本时，TypeScript 将使用 Wea​​kMaps 代替 #。
"use strict";
var _Dog_barkAmount;
class Dog3 {
    personality;
    constructor() {
        _Dog_barkAmount.set(this, 0);
        this.personality = "happy";
    }
}
_Dog_barkAmount = new WeakMap();

// 如果您需要保护类中的值免受恶意行为者的攻击，您应该使用提供严格运行时隐私的机制，例如闭包、WeakMap 或私有字段。
// 请注意，这些在运行时添加的隐私检查可能会影响性能。

/**
 * Static Members
 * 类可能有静态成员。这些成员与类的特定实例无关。它们可以通过类构造函数对象本身访问：
 */
class MyClass1 {
    static x = 0;
    static printX() {
        console.log(MyClass1.x);
    }
}
console.log(MyClass1.x);
MyClass1.printX();
// 静态成员还可以使用相同的 public、protected 和 private 可见性修饰符：

class MyClass3 {
    private static x = 0;
}
console.log(MyClass3.x);

// 静态成员也被继承：
class Base8 {
    static getGreeting() {
        return "Hello world";
    }
}
class Derived10 extends Base8 {
    myGreeting = Derived10.getGreeting();
}
/**
 * Special Static Names 特殊静态名称
 * 从 Function 原型中覆盖属性通常是不安全/不可能的。
 * 因为类本身就是可以用 new 调用的函数，所以不能使用某些静态名称。名称、长度和调用等函数属性不能定义为静态成员：
 */
class S {
    static name = "S!";
    //   Static property 'name' conflicts with built-in property 'Function.name' of constructor function 'S'.
}

/**
 * Why No Static Classes? 为什么没有静态类？
 * TypeScript（和 JavaScript）不像 C# 和 Java 那样有一个叫做静态类的结构。
 * 这些结构之所以存在，是因为这些语言强制所有数据和函数都在一个类中；因为 TypeScript 中不存在这种限制，所以不需要它们。
 * 只有一个实例的类在 JavaScript/TypeScript 中通常仅表示为普通对象。
 */
//  例如，我们不需要 TypeScript 中的“静态类”语法，因为常规对象（甚至顶级函数）也能完成这项工作：
// Unnecessary "static" class
class MyStaticClass {
    static doSomething() { }
}

// Preferred (替代方案 1)
function doSomething() { }

// Preferred (替代方案 2)
const MyHelperObject = {
    dosomething() { },
};

/**
 * static Blocks in Classes 静止的 类中的块
 * 静态块允许您编写具有自己范围的语句序列，这些语句可以访问 包含类中的私有字段。
 * 这意味着我们可以编写具有编写 语句的所有功能的 初始化代码，不会泄漏变量，并且可以完全访问我们的类内部。
 */
// vscode不支持
//  class Foo {
//     static #count = 0;

//     get count() {
//         return Foo.#count;
//     }
//     loadLastInstances(){return ""}
//     static {
//         try {
//             const lastInstances = loadLastInstances();
//             Foo.#count += lastInstances.length;
//         }
//         catch {}
//     }
// }

/**
 * Generic Classes  泛型类
 * 类，很像接口，可以是通用的。当使用 new 实例化泛型类时，其类型参数的推断方式与函数调用中的推断方式相同：
 */
class Box<Type> {
    contents: Type;
    constructor(value: Type) {
        this.contents = value;
    }
}

const box = new Box("hello!");
// 类可以像接口一样使用泛型约束和默认值。

/**
 * Type Parameters in Static Members 静态成员中的类型参数
 */
// 这段代码是不合法的，原因可能并不明显：
class Box1<Type> {
    static defaultValue: Type;
    //   Static members cannot reference class type parameters.
}
// 请记住，类型总是被完全擦除！在运行时，只有一个 Box.defaultValue 属性槽
// 这意味着设置 Box<string>.defaultValue （如果可能的话）也会改变 Box<number>.defaultValue - 不好。
// 泛型类的静态成员永远不能引用类的类型参数。

/**
 *  'this' at Runtime in Classes this在类中的运行时
 * 重要的是要记住 TypeScript 不会改变 JavaScript 的运行时行为，
 * 而且 JavaScript 以具有一些特殊的运行时行为而闻名。
 */
// JavaScript 对此的处理确实不同寻常,如下
class MyClass2 {
    name = "MyClass";
    getName() {
        return this.name;
    }
}
const c1 = new MyClass2();
const obj = {
    name: "obj",
    getName: c1.getName,
};

// Prints "obj", not "MyClass"
console.log(obj.getName());
// 默认情况下，函数内 this 的值取决于函数的调用方式。在这个例子中，因为函数是通过 obj 引用调用的，所以它的 this 值是 obj 而不是类实例。
// 这很少是你想要发生的！ TypeScript 提供了一些方法来减轻或防止这种错误。

/**
 * Arrow Functions 箭头函数
 * 如果您有一个经常以丢失 this 上下文的方式调用的函数，则使用箭头函数属性而不是方法定义是有意义的：
 */
class MyClass4 {
    name = "MyClass";
    getName = () => {
        return this.name;
    };
}
const c2 = new MyClass4();
const g3 = c2.getName;
// Prints "MyClass" instead of crashing
console.log(g3());

// 这有一些权衡
// this 值保证在运行时是正确的， 即使对于未使用 TypeScript 检查的代码
// 这将使用更多内存，因为每个类实例都有自己的以这种方式定义的每个函数的副本 // 闭包
// 不能在派生类中使用 super.getName，因为原型链中没有条目可以从中获取基类方法

/**
 * 'this' parameters this 参数
 * 在方法或函数定义中，名为 this 的初始参数在 TypeScript 中具有特殊含义。这些参数在编译期间被擦除：
 */
// TypeScript input with 'this' parameter
type SomeType = "SomeType"
function fn(this: SomeType, x: number) {
    /* ... */
}
// JavaScript output
function fn1(x) {
    /* ... */
}

// TypeScript 会检查调用带有 this 参数的函数是否是在正确的上下文中完成的。
// 我们可以在方法定义中添加一个 this 参数，而不是使用箭头函数，以静态地强制正确调用该方法
class MyClass5 {
    name = "MyClass5";
    getName(this: MyClass5) {
        return this.name;
    }
}
const c4 = new MyClass5();
// OK
c4.getName();

// Error, would crash
const g4 = c4.getName;
console.log(g4());
// The 'this' context of type 'void' is not assignable to method's 'this' of type 'MyClass'

// 此方法采用与箭头函数方法相反的权衡：
// JavaScript 调用者可能仍会在没有意识到的情况下错误地使用类方法
// 每个类定义只分配一个函数，而不是每个类实例一个
// 仍然可以通过 super 调用基本方法定义。

/**
 * this 类型
 * 在类中，称为 this 的特殊类型动态引用当前类的类型。让我们看看这有什么用：
 */
class Box2 {
    contents: string = "";
    set(value: string) {
        //   (method) Box.set(value: string): this
        this.contents = value;
        return this;
    }
}
// 在这里，TypeScript 将 set 的返回类型推断为 this，而不是 Box。现在让我们创建一个 Box 的子类：
class ClearableBox extends Box2 {
    clear() {
        this.contents = "";
    }
}

const a = new ClearableBox();
const b3 = a.set("hello");
//   const b: ClearableBox
// 还可以在参数类型注释中使用this 
class Box3 {
    content: string = "";
    sameAs(other: this) {
        return other.content === this.content;
    }
}
// 这与编写 other: Box 不同——如果你有一个派生类，它的 sameAs 方法现在将只接受同一个派生类的其他实例：
class Box4 {
    content: string = "";
    sameAs(other: this) {
        return other.content === this.content;
    }
}

class DerivedBox4 extends Box4 {
    otherContent: string = "?";
}

const base = new Box4();
const derived = new DerivedBox4();
derived.sameAs(base);
// Argument of type 'Box' is not assignable to parameter of type 'DerivedBox'.
//   Property 'otherContent' is missing in type 'Box' but required in type 'DerivedBox'.

/**
 * this -based type guards  这个 基于类型的守卫
 * 您可以在类和接口中的方法的返回位置使用 this is Type。
 * 当与类型缩小（例如 if 语句）混合时，目标对象的类型将缩小到指定的Type。
 */
class FileSystemObject {
    isFile(): this is FileRep {
        return this instanceof FileRep;
    }
    isDirectory(): this is Directory {
        return this instanceof Directory;
    }
    isNetworked(): this is Networked & this {
        return this.networked;
    }
    constructor(public path: string, private networked: boolean) { }
}

class FileRep extends FileSystemObject {
    constructor(path: string, public content: string) {
        super(path, false);
    }
}

class Directory extends FileSystemObject {
    children: FileSystemObject[];
}

interface Networked {
    host: string;
}

const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");

if (fso.isFile()) {
    fso.content;
    // const fso: FileRep
} else if (fso.isDirectory()) {
    fso.children;
    // const fso: Directory
} else if (fso.isNetworked()) {
    fso.host;
    // const fso: Networked & FileSystemObject
}
// 基于 this 的类型保护的一个常见用例是允许对特定字段进行延迟验证。类型断定is
// 例如，当 hasValue 被验证为 true 时，这种情况从保存在 box 内的值中删除一个 undefined ：
class Box5<T> {
    value?: T;

    hasValue(): this is { value: T } {
        return this.value !== undefined;
    }
}

const box5 = new Box5();
box5.value = "Gameboy";

box5.value;
//   (property) Box<unknown>.value?: unknown

if (box5.hasValue()) {
    box5.value;
    //   (property) value: unknown
}

/**
 * Parameter Properties 参数属性
 * TypeScript 提供了特殊的语法来将构造函数参数转换为具有相同名称和值的类属性。
 * 这些称为参数属性，是通过在构造函数参数前面加上可见性修饰符 public、private、protected 或 readonly 之一来创建的。
 * 结果字段获得这些修饰符：
 */
class Params {
    constructor(
        public readonly x: number,
        protected y: number,
        private z: number
    ) {
        // No body necessary
    }
}
const a1 = new Params(1, 2, 3);
console.log(a1.x);
//   (property) Params.x: number
console.log(a1.z);
//   Property 'z' is private and only accessible within class 'Params'.

/**
 * Class Expressions   类表达式
 * 类表达式与类声明非常相似。唯一真正的区别是类表达式不需要名称，
 * 尽管我们可以通过它们最终绑定到的任何标识符来引用它们：
 */
const someClass = class <Type> {
    content: Type;
    constructor(value: Type) {
        this.content = value;
    }
};

const m = new someClass("Hello, world");
//   const m: someClass<string>

/**
 * abstract Classes and Members 抽象的 类和成员
 * TypeScript 中的类、方法和字段可能是抽象的。
 * 抽象方法或抽象字段是一种尚未提供实现的方法。这些成员必须存在于抽象类中，不能直接实例化。
 * 抽象类的作用是作为实现所有抽象成员的子类的基类。当一个类没有任何抽象成员时，它被称为具体的。
 * 
 */
abstract class Base11 {
    abstract getName(): string;

    printName() {
        console.log("Hello, " + this.getName());
    }
}

const bas = new Base11();
//   Cannot create an instance of an abstract class.

// 我们不能用 new 实例化 Base，因为它是抽象的。相反，我们需要创建一个派生类并实现抽象成员：
class Derived11 extends Base11 {
    getName() {
        return "world";
    }
}

const de = new Derived11();
de.printName();
// 请注意，如果我们忘记实现基类的抽象成员，我们会得到一个错误：
class Derived12 extends Base11 {
    // Non-abstract class 'Derived' does not implement inherited abstract member 'getName' from class 'Base'.
    // forgot to do anything
}

/**
 * 抽象构造签名 Abstract Construct Signaturesc
 * 有时您希望接受一些类构造函数，该函数生成从某个抽象类派生的类的实例
 *  
 * 例如，您可能想编写以下代码：
 */
function greet(ctor: typeof Base11) {
    const instance = new ctor();
    //   Cannot create an instance of an abstract class.
    instance.printName();
}
// TypeScript 正确地告诉你你正在尝试实例化一个抽象类。
// 毕竟，根据greet的定义，编写这段代码是完全合法的，这最终会构造一个抽象类：
// Bad!
greet(Base11);

// 相反，您想编写一个接受带有构造签名的东西的函数：
function greet1(ctor: new () => Base11) {
    const instance = new ctor();
    instance.printName();
}
greet1(Derived11);
greet1(Base11);
// Argument of type 'typeof Base' is not assignable to parameter of type 'new () => Base'.
//   Cannot assign an abstract constructor type to a non-abstract constructor type.

// 现在 TypeScript 正确地告诉您可以调用哪些类构造函数 - Derived 可以，因为它是具体的，但 Base 不能。

/**
 * Relationships Between Classes 类之间的关系
 * 在大多数情况下，TypeScript 中的类在结构上进行比较，与其他类型相同。
 * 例如，这两个类可以相互代替，因为它们是相同的：
 */
class Point5 {
    x = 0;
    y = 0;
}

class Point6 {
    x = 0;
    y = 0;
}

// OK
const p: Point5 = new Point6();

// 类似地，即使没有显式继承，类之间的子类型关系也存在：
class Person {
    name: string;
    age: number;
}

class Employee {
    name: string;
    age: number;
    salary: number;
}

// OK
const per: Person = new Employee();
// 这听起来很简单，但有些情况似乎比其他情况更奇怪。
// 空类没有成员。在结构类型系统中，没有成员的类型通常是其他任何类型的超类型。所以如果你写一个空类（不要！），任何东西都可以用来代替它：

class Empty { }

function fn2(x: Empty) {
    // can't do anything with 'x', so I won't
}

// All OK!
fn2(window);
fn2({});
fn2(fn2);

