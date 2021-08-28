/**
 * Narrowing 缩小（类型范围）
 * Typescript 静态类型分析 运行时的值 时，
 * 它将类型分析覆盖在javascript的运行时控制流结构上，如if/else,条件三元组、循环
 */

function padLeft(padding: number | string, input: string) {
    if (typeof padding === "number") {
        return new Array(padding + 1).join(" ") + input;
        // (parameter) padding: number
    }
    return padding + input;
    // (parameter) padding: string
}

/**
 * 'typeof'type guards 'typeof'类型守卫
 * 通过typeof 检查返回值 成为 一个类型守卫
 * Typescript期待下列值
 * "string"
 * "number"
 * "bigint"
 * "boolean"
 * "symbol"
 * "undefined"
 * "object"
 * "function"
 */
// 因为js的原因，null被认为是object
function printAll(strs: string | string[] | null) {
    if (typeof strs === "object") {
        for (const s of strs) {
            // Object is possibly 'null'.
            console.log(s);
        }
    } else if (typeof strs === "string") {
        console.log(strs);
    } else {
        // do nothing
    }
}
var st = null
printAll(st)
/**
 * Truthiness narrowing 真假缩小
 * 用&&,||,if,!来narrow
 * 以下会转为false
 * 0
 * NaN
 * "" (the empty string)
 * 0n (the bigint version of zero)
 * null
 * undefined
 */
// 应付null，undefined就用Truthiness narrowing
function printAll_1(strs: string | string[] | null) {
    if (strs && typeof strs === "object") {
        for (const s of strs) {
            console.log(s);
        }
    } else if (typeof strs === "string") {
        console.log(strs);
    }
}
// 然而
function printAll_2(strs: string | string[] | null) {
    // !!!!!!!!!!!!!!!!
    //  DON'T DO THIS!
    //   KEEP READING
    // !!!!!!!!!!!!!!!!
    if (strs) {
        if (typeof strs === "object") {
            for (const s of strs) {
                console.log(s);
            }
        } else if (typeof strs === "string") {
            console.log(strs);
        }
    }
}
// 将整个函数体包在真实性检查，不好判断空字符串的情况

// 用！来判断真实性
function multiplyAll(
    values: number[] | undefined,
    factor: number
): number[] | undefined {
    if (!values) {
        return values;
    } else {
        return values.map((x) => x * factor);
    }
}

/**
 * Equality narrowing 等值缩小
 * 可用switch + 等值检查 像 === ,!==,==和!=
 */
function example(x: string | number, y: string | boolean) {
    if (x === y) {// TypeScript知道===必然需要需要类型相等
        // We can now call any 'string' method on 'x' or 'y'.
        x.toUpperCase();
        y.toLowerCase();

    } else {
        console.log(x);
        console.log(y);
    }
}

// 用 ==或!= null 可以直接判断出 null和undefined
interface Container {
    value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
    // Remove both 'null' and 'undefined' from the type.
    if (container.value != null) {
        console.log(container.value);
        // Now we can safely multiply 'container.value'.
        container.value *= factor;
    }
}

/**
 * The 'in' operator narrowing 'in'内运算符窄化
 *  "value" in x. 
 * value是字符串，x是union type
 */

type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
    if ("swim" in animal) {
        return animal.swim();
    }

    return animal.fly();
}

//  声明可选的属性 将存在 narrow 的 两边中
// 如 human 可以swim 和fly 
type Fish1 = { swim: () => void };
type Bird1 = { fly: () => void };
type Human = { swim?: () => void, fly?: () => void };

function move1(animal: Fish | Bird1 | Human1) {
    if ("swim" in animal) {
        animal
    } else {
        animal
    }
}

/**
 * instanceof narrowing 'instanceof'缩小
 * 
 */
function logValue(x: Date | string) {
    if (x instanceof Date) {
        console.log(x.toUTCString());
    } else {
        console.log(x.toUpperCase());
    }
}
/**
 * Assignments 赋值(分配)
 * 当赋值时，TypeScript会检查右边的分配值，适当的缩小（narraw）左端
 * 
 */
let x = Math.random() < 0.5 ? 10 : "hello world!";//let x: string | number
x = 1;
console.log(x);
x = "goodbye!";
console.log(x);
x = true;
console.log(x);

/**
 * Control flow analysis 控制流分析
 */
function padLeft1(padding: number | string, input: string) {
    if (typeof padding === "number") {
        return new Array(padding + 1).join(" ") + input;
    }
    return padding + input;
}
// 如上述，到达第二个return时候只能是string
// 这种基于可达性的代码分析称为控制流分析，(control flow analysis)
// TypeScript 使用这种流分析在遇到类型保护和赋值时缩小类型。

/**
 * Using type predicates 使用类型断定
 * 有时候我们需要直接控制 类型的改变
 * 为了定义用户自定义的类型守卫，我们定义一个返回类型是 类型断定 的 函数
 * pet is Fish 是我们的类型断定 
 */
function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}
//断定形式：parameterName is Type。parameterName是方法的参数
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
    pet.swim();
} else {
    pet.fly();
}
// 用在Fish | Bird的数组 上
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter(isFish) as Fish[];

// The predicate may need repeating for more complex examples
const underWater3: Fish[] = zoo.filter((pet): pet is Fish => {
    if (pet.name === "sharkey") return false;
    return isFish(pet);
});

/**
 * Discriminated unions 区别union
 * 如何 narraw 复杂结构数据
 */
// kind为circle时有radius,kind为square时有sideLength
interface Shape {
    kind: "circle" | "square";
    radius?: number;
    sideLength?: number;
}

// 使用'circle'和'square'而不是字符串，避免拼错
function handleShape(shape: Shape) {
    // oops!
    if (shape.kind === "rect") {
        // ...
    }
}

function getArea1(shape: Shape) {
    if (shape.kind === "circle") {
        return Math.PI * shape.radius ** 2;
        // 这是因为radius？可能是undefined
    }
}


// ! 是non-null断言，说shape.radius必然存在
function getArea2(shape: Shape) {
    if (shape.kind === "circle") {
        return Math.PI * shape.radius! ** 2;
    }
}
// 我们正确地将 Shape 分成了两种类型，它们的 kind 属性值不同，
// 但是 radius 和 sideLength 在它们各自的类型中被声明为必需的属性。
interface Circle {
    kind: "circle";
    radius: number;
}

interface Square {
    kind: "square";
    sideLength: number;
}

type Shape1 = Circle | Square;

function getArea(shape: Shape1) {
    if (shape.kind === "circle") {
        return Math.PI * shape.radius ** 2;
    }
}
// 用switch，without  ! non-null assertions.
function getArea3(shape: Shape1) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
    }
}// 这就是区分union

/**
 * The never type 不存在类型
 * 当narrowing时，减少union可能的类型. 
 * TypeScript将使用never类型来表示不应该存在的状态
 */

/**
 * Exhaustiveness checking 穷举检查
 * 当所有类型检查后，没有对应的，这时后该类型能分配never
 */
type Shape2 = Circle | Square;

function getArea4(shape: Shape2) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        default:
            const _exhaustiveCheck: never = shape;
            return _exhaustiveCheck;
    }
}

// 向 Shape union 添加新成员会导致 TypeScript 错误：
interface Triangle {
    kind: "triangle";
    sideLength: number;
}

type Shape3 = Circle | Square | Triangle;

function getArea5(shape: Shape3) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        default:
            const _exhaustiveCheck: never = shape;
            return _exhaustiveCheck;
    }
}