import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

export enum EmployeeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity("employees")
export class Employee {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "user_id", nullable: true })
  userId: number

  @Column({ name: "employee_id", unique: true })
  employeeId: string

  @Column({ name: "first_name" })
  firstName: string

  @Column({ name: "last_name" })
  lastName: string

  @Column({ nullable: true })
  department: string

  @Column({ nullable: true })
  position: string

  @Column({ nullable: true })
  phone: string

  @Column({ name: "hire_date", type: "date", nullable: true })
  hireDate: Date

  @Column({
    type: "enum",
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status: EmployeeStatus

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
