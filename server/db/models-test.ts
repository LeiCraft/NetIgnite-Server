
// type SchemaType = "int" | "string" | "array" | "boolean";

// type TypeMap = {
//     int: number;
//     string: string;
//     array: number[];
//     boolean: boolean;
// }

// interface SchemaBaseOptions<T extends SchemaType, Only extends readonly TypeMap[T][], AllowNull extends boolean = false, > {
//     primaryKey?: boolean;
//     autoIncrement?: boolean;
//     unique?: boolean;
//     allowNull?: AllowNull;
//     only?: Only;
//     default?: TypeMap[T];
// };


// interface SchemaConfig<T extends SchemaType, Only extends readonly TypeMap[T][] = readonly TypeMap[T][], AllowNull extends boolean = false> extends SchemaBaseOptions<T, Only, AllowNull> {
//     type: T;
// };

// interface Schema {
//     [key: string]: SchemaConfig<SchemaType>;
// }

// type Parsed<T extends Schema> = {
//     [K in keyof T]: 
//         T[K] extends { type: infer U, only: infer O, allowNull: true } 
//             ? U extends SchemaType 
//                 ? O extends any[] 
//                     ? O[number] | null 
//                     : never 
//                 : never 
//         : T[K] extends { type: infer U, only: infer O } 
//             ? U extends SchemaType 
//                 ? O extends any[] 
//                     ? O[number] 
//                     : never 
//                 : never 
//         : T[K] extends { type: infer U, allowNull: true } 
//             ? U extends SchemaType 
//                 ? TypeMap[U] | null 
//                 : never 
//         : T[K] extends { type: infer U } 
//             ? U extends SchemaType 
//                 ? TypeMap[U] 
//                 : never 
//             : never;
// }


// namespace ST {

//     export function int(options: SchemaBaseOptions<"int"> = {}): SchemaConfig<"int"> {
//         return {
//             type: "int",
//             allowNull: false,
//             ...options
//         };
//     }

//     export function string(options: SchemaBaseOptions<"string"> = {}): SchemaConfig<"string"> {
//         return {
//             type: "string",
//             allowNull: false,
//             ...options
//         };
//     }

//     export function array(options: SchemaBaseOptions<"array"> = {}): SchemaConfig<"array"> {
//         return {
//             type: "array",
//             allowNull: false,
//             ...options
//         };
//     }

//     export function boolean(options: SchemaBaseOptions<"boolean", any> = {}): SchemaConfig<"boolean"> {
//         return {
//             type: "boolean",
//             allowNull: false,
//             ...options
//         };
//     }

//     export function id(): SchemaConfig<"int"> {
//         return {
//             type: "int",
//             primaryKey: true,
//             autoIncrement: true
//         };
//     }

// }


// const User = {
//     id: ST.id(),
//     username: ST.string({ unique: true }),
//     password_hash: ST.string(),
//     role: ST.string({ only: ["user", "admin"] }),
//     favorites: ST.array({ default: [] }),
// } as const;

// const a = ST.string({ only: ["user", "admin"] })
// a.only

// type User = Parsed<typeof User>;

