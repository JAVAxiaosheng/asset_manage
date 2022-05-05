import {createRouter, createWebHistory} from 'vue-router'

import Home from "@/components/Home";
import LayoutContainer from '../page/LayoutContainer'
import TeacherInfo from "@/components/TeacherInfo";
import Login from "@/components/Login";

import UserInfo from "@/components/manager/UserInfo";
import ChangePassword from '@/components/manager/ChangePassword';

import employeeChangePassword from '@/components/employee/ChangePassword'

const routerHistory = createWebHistory()
const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            name: "Login",
            component: Login,
        }, {
            path: '/LayoutContainer',
            name: "LayoutContainer",
            component: LayoutContainer,
            children: [{
                path: '/home',
                name: "Home",
                component: Home
            }, {
                path: '/user-info',
                name: "UserInfo",
                component: UserInfo
            }, {
                    path: '/change-password',
                    name: "ChangePassword",
                    component: ChangePassword
                },
                {
                    path: '/employee-change-password',
                    name: "employeeChangePassword",
                    component: employeeChangePassword
                },
                {
                path: '/teacher-info',
                name: "TeacherInfo",
                component: TeacherInfo
            }],
        }
    ]
})
export default router