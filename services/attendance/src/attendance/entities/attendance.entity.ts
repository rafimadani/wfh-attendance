import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm"

export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
  LATE = "late",
}

@Entity("attendance")
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: "employee_id" })
  employeeId: number

  @Column({ name: "check_in_time", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  checkInTime: Date

  @Column({ name: "photo_path", nullable: true })
  photoPath: string

  @Column({ type: "text", nullable: true })
  notes: string

  @Column({
    type: "enum",
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status: AttendanceStatus

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date
}
