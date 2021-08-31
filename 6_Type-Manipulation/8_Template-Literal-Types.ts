/**
 * Template Literal Types 模板文字类型
 * 模板文字类型建立在字符串文字类型之上，并且能够通过联合扩展为多个字符串。
 */

type World = "world";
type Greeting = `hello ${World}`;

// 当在插值位置使用联合时，类型是可以由每个联合成员表示的每个可能的字符串文字的集合：
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`
// type AllLocaleIDs = "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"

// 对于模板文字中的每个插值位置，联合交叉相乘：
type AllLocaleIDs1 = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs1}`;
// type LocaleMessageIDs = "en_welcome_email_id" | "en_email_heading_id" | "en_footer_title_id" | "en_footer_sendoff_id" | "ja_welcome_email_id" | "ja_email_heading_id" | "ja_footer_title_id" | "ja_footer_sendoff_id" | "pt_welcome_email_id" | "pt_email_heading_id" | "pt_footer_title_id" | "pt_footer_sendoff_id"
// 建议人们对大型字符串联合使用提前生成，但这在较小的情况下很有用。


/**
 * String Unions in Types 类型中的字符串联合
 */
// 模板文字的强大之处在于根据类型中的现有字符串定义新字符串。

// 例如，JavaScript 中的一个常见模式是根据对象当前拥有的字段来扩展对象。我们将为函数提供一个类型定义，该函数增加了对 on 函数的支持，让您知道值何时发生变化：
// 请注意，在侦听事件“firstNameChanged”，而不仅仅是“firstName”时，
// 模板文字提供了一种在类型系统内处理此类字符串操作的方法：
type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

/// Create a "watched object" with an 'on' method
/// so that you can watch for changes to properties.
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;

const person = makeWatchedObject({
    firstName: "Saoirse",
    lastName: "Ronan",
    age: 26
});

person.on("firstNameChanged", () => { });
// (method) on(eventName: "firstNameChanged" | "lastNameChanged" | "ageChanged", callback: (newValue: any) => void): void
// It's typo-resistent
person.on("firstName", () => { });

/**
 * Inference with Template Literals 使用模板文字进行推理
 * 请注意，最后一个示例没有重用原始值的类型。回调使用了 any。
 * 模板文字类型可以从替换位置推断出来。
 * 
 * 我们可以使我们的最后一个示例通用，
 * 以从 eventName 字符串的部分推断出关联的属性
 */

type PropEventSource1<Type> = {
    on<Key extends string & keyof Type> // 类似声明了一个变量Key
        (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void): void;
};

declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource1<Type>;

const person1 = makeWatchedObject({
    firstName: "Saoirse",
    lastName: "Ronan",
    age: 26
});

person1.on("firstNameChanged", newName => {

    // (parameter) newName: string
    console.log(`new name is ${newName.toUpperCase()}`);
});

person1.on("ageChanged", newAge => {

    // (parameter) newAge: number
    if (newAge < 0) {
        console.warn("warning! negative age");
    }
})
// 这里在on上写了泛型方法。
// 当用户使用字符串“firstNameChanged”调用时，TypeScript 将尝试推断 Key 的正确类型。
// 为此，它会将 Key 与“Changed”之前的内容进行匹配并推断字符串“firstName”
// 一旦 TypeScript 弄清楚了这一点， on 方法就可以获取原始对象上的 firstName 类型，在这种情况下是字符串。
// 类似地，当使用“ageChanged”调用时，TypeScript 会找到属性 age 的类型，即数字。
// 推理可以以不同的方式组合，通常是解构字符串，并以不同的方式重建它们。

/**
 * Intrinsic String Manipulation Types  内在字符串操作类型
 * 为了帮助进行字符串操作，TypeScript 包含一组可用于字符串操作的类型。
 * 这些类型内置于编译器中以提高性能，并且无法在 TypeScript 包含的 .d.ts 文件中找到。
 */
/**
 * Uppercase<StringType>
 * 将字符串中的每个字符转换为大写版本
 */
type Greeting1 = "Hello, world"
type ShoutyGreeting = Uppercase<Greeting1>
//  type ShoutyGreeting = "HELLO, WORLD"

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`
type MainID = ASCIICacheKey<"my_app">
//  type MainID = "ID-MY_APP"

/**
 * Lowercase<StringType>
 * 将字符串中的每个字符转换为等效的小写字母。
 */
type Greeting2 = "Hello, world"
type QuietGreeting2 = Lowercase<Greeting2>
//  type QuietGreeting = "hello, world"
type ASCIICacheKey1<Str extends string> = `id-${Lowercase<Str>}`
type MainID1 = ASCIICacheKey1<"MY_APP">
// type MainID = "id-my_app"


/**
 * Capitalize<StringType>
 * 将字符串中的第一个字符转换为等效的大写字符。
 */
/**
 * Uncapitalize<StringType>
 * 将字符串中的第一个字符转换为等效的小写字符
 */