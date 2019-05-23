import * as bcrypt from 'bcrypt';
import {
    Entity,
    Column,
    BaseEntity,
    PrimaryGeneratedColumn,
    BeforeInsert
} from 'typeorm';

@Entity('users')
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid') id: string;

    @Column('varchar', {
        length: 125,
        unique: true
    })
    email: string;

    @Column({
        length: 80,
        unique: true
    })
    username: string;

    @Column({ length: 60 }) password: string;

    @Column('text') salt: string;

    @Column('boolean', {
        default: false
    })
    confirmed: boolean;

    @Column('boolean', {
        default: false
    })
    forgotPasswordLocked: boolean;

    @BeforeInsert()
    async hashPasswordBeforeInsert() {
        try {
            this.salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, this.salt);
        } catch (e) {
            console.log(e);
        }
    }
}