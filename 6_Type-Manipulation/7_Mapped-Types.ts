/**
 * Mapped Types 映射类型
 * 当有时一种类型需要基于另一种类型，你不想重复写。
 * 映射类型建立在索引签名（index signatures）的语法之上，用于声明尚未提前声明的属性类型：
 */
type Horse = "horse"
type OnlyBoolsAndHorses = {
    [key: string]: boolean | Horse;
};

const conforms: OnlyBoolsAndHorses = {
    del: true,
    rodney: false,
};
// 映射类型是一种泛型类型，它使用 PropertyKeys 的联合（通常通过 keyof 创建）来迭代键以创建类型：
type OptionsFlags<Type> = {
    [Property in keyof Type]: boolean;
};
// OptionsFlags 将从类型 Type 中获取所有属性并将它们的值更改为布尔值。
type FeatureFlags = {
    darkMode: () => void;
    newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;
// type FeatureOptions = {
//     darkMode: boolean;
//     newUserProfile: boolean;
// }

/**
 * Mapping Modifiers 映射修饰符
 * 在映射期间可以应用两个额外的修饰符：readonly 和 ?分别影响可变性和可选性。
 * 您可以通过添加 - 或 + 前缀来删除或添加这些修饰符。如果不添加前缀，则假定为 +
 */
type CreateMutable<Type> = {
    -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
    readonly id: string;
    readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;
// type UnlockedAccount = {
//     id: string;
//     name: string;
// }

type Concrete<Type> = {
    [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
    id: string;
    name?: string;
    age?: number;
};

type User = Concrete<MaybeUser>;

// Key Remapping via as 键重映射通过 as
// 在 TypeScript 4.1 及更高版本中，您可以使用映射类型中的 as 子句重新映射映射类型中的键：
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties]
}

// 您可以利用  模板文字类型  等功能从先前的属性名称创建新的属性名称：
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;
// type LazyPerson = {
//     getName: () => string;
//     getAge: () => number;
//     getLocation: () => string;
// }

// 您可以通过条件类型生成 never 来过滤键：
// // Remove the 'kind' property
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};

interface Circle {
    kind: "circle";
    radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
// type KindlessCircle = {
//     radius: number;
// }

// Further Exploration 进一步探索
// 映射类型与此类型 操作部分中的其他功能配合良好
type ExtractPII<Type> = {
    [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
    id: { format: "incrementing" };
    name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
//   type ObjectsNeedingGDPRDeletion = {
//     id: false;
//     name: true;
// }