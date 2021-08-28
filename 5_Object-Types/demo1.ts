/**
 * Object Types 
 */
// anonymous匿名
function greet(person: { name: string; age: number }) {
    return "Hello " + person.name;
}
// interface
interface Person {
    name: string;
    age: number;
}

function greet1(person: Person) {
    return "Hello " + person.name;
}
//  type alias
type Person1 = {
    name: string;
    age: number;
};

function greet2(person: Person) {
    return "Hello " + person.name;
}
/**
 * Property Modifiers 属性修饰符
 * 对象类型中的每个属性都可以指定几项内容：类型、属性是否可选
 * 以及是否可以写入该属性
 */
// Optional Properties 可选属性
// 处理可能具有属性集的对象。
// 通过在名称末尾添加问号 (?) 将这些属性标记为可选。
type Shape = {}
const getShape = (): Shape => { return {} }
interface PaintOptions {
    shape: Shape;
    xPos?: number;
    yPos?: number;
}

function paintShape3(opts: PaintOptions) {
    // ...
}

const shape = getShape();
paintShape3({ shape });
paintShape3({ shape, xPos: 100 });
paintShape3({ shape, yPos: 100 });
paintShape3({ shape, xPos: 100, yPos: 100 });
// 在这个例子中，xPos 和 yPos 都被认为是可选的。
// 所有可选性真正说的是，如果设置了属性，它最好有一个特定的类型。
// 我们也可以从这些属性中读取——但是当我们在 strictNullChecks 下读取时，
// TypeScript 会告诉我们它们可能是undefined。
function paintShape1(opts: PaintOptions) {
    let xPos = opts.xPos; //number | undefined
    let yPos = opts.yPos; // number | undefined
    // ...
}
// 我们可以专门处理 undefined 。
function paintShape2(opts: PaintOptions) {
    let xPos = opts.xPos === undefined ? 0 : opts.xPos;
    let yPos = opts.yPos === undefined ? 0 : opts.yPos;

    // ...
    // 请注意，这种为未指定值设置默认值的模式非常普遍，以至于 JavaScript 具有支持它的语法。
}

// 目前无法在解构模式中放置类型注释。---js解构赋值语法问题


/**
 * readonly Properties 只读 特性
 */
interface SomeType {
    readonly prop: string;
}

function doSomething(obj: SomeType) {
    // We can read from 'obj.prop'.
    console.log(`prop has the value '${obj.prop}'.`);

    // But we can't re-assign it.
    obj.prop = "hello";
}

// 内部内容不能改变。这只是意味着属性本身不能被重写。
interface Home {
    readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
    // We can read and update properties from 'home.resident'.
    console.log(`Happy birthday ${home.resident.name}!`);
    home.resident.age++;
}

function evict(home: Home) {
    // But we can't write to the 'resident' property itself on a 'Home'.
    home.resident = {
        name: "Victor the Evictor",
        age: 42,
    };
}
// TypeScript 在检查这些类型是否兼容时不会考虑这类型的属性是否为只读，
// 因此只读属性也可以通过别名更改。
interface Person {
    name: string;
    age: number;
}

interface ReadonlyPerson {
    readonly name: string;
    readonly age: number;
}

let writablePerson: Person = {
    name: "Person McPersonface",
    age: 42,
};

// works
let readonlyPerson: ReadonlyPerson = writablePerson;

console.log(readonlyPerson.age); // prints '42'
writablePerson.age++;
console.log(readonlyPerson.age); // prints '43'

/**
 * Index Signatures 索引签名
 * 有时您事先并不知道类型属性的所有名称，但您确实知道值的形状。
 * 在这些情况下，您可以使用索引签名来描述可能值的类型
 */
interface StringArray {
    [index: number]: string;
}

const myArray: StringArray = ["a", "b"]
const secondItem = myArray[1]; // const secondItem: string
// 上面，我们有一个 StringArray 接口，它有一个索引签名。此索引签名指出，
// 当 StringArray 用数字索引时，它将返回一个字符串。

// 索引签名属性类型必须是“字符串”或“数字”

// 字符串索引签名是一种描述“字典”格式的强大方式，但它们也强制所有属性匹配它们的返回类型。
interface NumberDictionary {
    [index: string]: number;

    length: number; // ok
    name: string;
}

// 如果索引签名是属性类型的并集，则可以接受不同类型的属性：
interface NumberOrStringDictionary {
    [index: string]: number | string;
    length: number; // ok, length is a number
    name: string; // ok, name is a string
}

// 您可以将索引签名设为readonly，以防止对其索引进行赋值
// 最后，您可以将索引签名设为只读，以防止对其索引进行赋值：
interface ReadonlyStringArray {
    readonly [index: number]: string;
}

let myArray1: ReadonlyStringArray = ['a', 'b', 'b'];
myArray1[2] = "Mallory";

/**
 * Extending Types  扩展类型
 * 拥有可能是其他类型的 更具体版本的 类型
 */
interface BasicAddress {
    name?: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
}
// 如果一个地址的建筑物有多个单元，则地址通常有一个与之关联的单元号。
interface AddressWithUnit {
    name?: string;
    unit: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
}
// 用extend
interface BasicAddress {
    name?: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
    unit: string;
}
// 也可以从多种类型扩展
interface Colorful {
    color: string;
}

interface Circle {
    radius: number;
}

interface ColorfulCircle extends Colorful, Circle { }

const cc: ColorfulCircle = {
    color: "red",
    radius: 42,
};

