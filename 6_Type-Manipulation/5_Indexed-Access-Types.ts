/**
 * Indexed Access Types
 * 索引访问类型
 */
// 我们可以使用索引访问类型来查找另一种类型的特定属性：
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];// type Age = number

// 索引类型本身就是一种类型，因此我们可以完全使用 unions、keyof 或其他类型：
type I1 = Person["age" | "name"];
type I2 = Person[keyof Person];
type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];
// 如果您尝试索引不存在的属性，您甚至会看到错误：
type I4 = Person["alve"];

// 使用任意类型进行索引的另一个示例是使用 number 来获取数组元素的类型。
// 我们可以将其与 typeof 结合使用，以方便地捕获数组字面量的元素类型：
const MyArray = [
    { name: "Alice", age: 15 },
    { name: "Bob", age: 23 },
    { name: "Eve", age: 38 },
  ];
   
  type Person1 = typeof MyArray[number];
//   type Person1 = {
//       name: string;
//       age: number;
//   }
  type Age1 = typeof MyArray[number]["age"];//type Age2 = number
  type Age2 = Person1["age"];//type Age2 = number

//   您只能在索引时使用类型，这意味着您不能使用 const 来进行变量引用：
const key = "age";
type Ag3 = Person1[key];

// 但是，您可以为类似的重构风格使用类型别名：
type key = "age";
type Age3 = Person[key];
