import type { UserRole } from "../enums/user-role.enum";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
