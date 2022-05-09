import {createRouter, createWebHistory} from 'vue-router'

import Home from "@/components/Home";
import LayoutContainer from '../page/LayoutContainer'
import Login from "@/components/Login";
import Register from "@/components/Register"

import UserInfo from "@/components/manager/UserInfo";
import ChangePassword from '@/components/manager/ChangePassword';

import employeeChangePassword from '@/components/employee/ChangePassword';

import departmentInfo from '@/components/manager/departmentInfo';

import managerEmployeeInfo from '@/components/manager/EmployeeInfo';
import EmployeeInfo from '@/components/employee/EmployeeInfo';

import ChangeMyselfInfo from '@/components/employee/ChangeMyselfInfo';

import AssetInfo from '@/components/manager/AssetInfo';

import AssetUse from "@/components/AssetUse";

import MyAssets from '@/components/employee/MyAssets'

const routerHistory = createWebHistory()
const router = createRouter({
    history: routerHistory,
    routes: [
        {
            path: '/',
            name: "Login",
            component: Login,
        },
        {
            path: "/register",
            name: "Register",
            component: Register
        },
        {
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
            },
                {
                    path: '/department_info',
                    name: "departmentInfo",
                    component: departmentInfo
                },
                {
                    path: '/manager_employee_info',
                    name: "managerEmployeeInfo",
                    component: managerEmployeeInfo
                },
                {
                    path: '/employee_info',
                    name: "EmployeeInfo",
                    component: EmployeeInfo
                },
                {
                    path: '/asset_info',
                    name: "AssetInfo",
                    component: AssetInfo
                },
                {
                    path: '/change_myself_info',
                    name: "ChangeMyselfInfo",
                    component: ChangeMyselfInfo
                },
                {
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
                    path: '/asset-use',
                    name: "AssetUse",
                    component: AssetUse
                },
                {
                    path: '/my_assets',
                    name: "MyAssets",
                    component: MyAssets
                },
            ],
        }
    ]
})
export default router