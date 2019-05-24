import {
    YupNum
} from '../../types/types.common';

export const passwordShort:YupNum = [6, 'Passwords must have atleast 6 characters']; 
export const passwordLong:YupNum = [60, 'Passwords must not exceed 50 characters'];
export const invalidEmail:string = 'Email or username is invalid';
export const userNameLong:YupNum = [80, 'Username must not exceed 80 characters'];
export const userNameShort:YupNum = [3, 'Username must have atleast 3 characters'];
export const emailLong:YupNum = [125, 'Email must not exceed 125 characters'];
export const emailShort:YupNum = [3, 'Email must be atleast 3 characters'];
export const registrationSuccess = 'Registration successful';
export const loginFail = 'Login attempt failed';