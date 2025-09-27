export declare enum UserRole {
    EMPLOYEE = "employee",
    HR = "hr"
}
export declare class User {
    id: number;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}
