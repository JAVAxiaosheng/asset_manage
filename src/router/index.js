import {createRouter, createWebHistory} from 'vue-router'

import Home from "@/components/common/Home";
import LayoutContainer from '../page/LayoutContainer'
import Login from "@/components/common/Login";
import Register from "@/components/common/Register"

import UserInfo from "@/components/manager/UserInfo";
import ChangePassword from '@/components/manager/ChangePassword';

import employeeChangePassword from '@/components/employee/ChangePassword';

import departmentInfo from '@/components/manager/departmentInfo';

import managerEmployeeInfo from '@/components/manager/EmployeeInfo';
import EmployeeInfo from '@/components/employee/EmployeeInfo';

import ChangeMyselfInfo from '@/components/employee/ChangeMyselfInfo';

import AssetInfo from '@/components/manager/AssetInfo';

import AssetUse from "@/components/common/AssetUse";

import MyAssets from '@/components/employee/MyAssets'

import UseRecord from "@/components/manager/UseRecord";
import MaintenanceReport from '@/components/employee/MaintenanceReport';
import MaintenanceRecord from '@/components/employee/MaintenanceRecord'
import RepairRecord from "@/components/manager/RepairRecord";

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
                    path: '/department-info',
                    name: "departmentInfo",
                    component: departmentInfo
                },
                {
                    path: '/manager-employee-info',
                    name: "managerEmployeeInfo",
                    component: managerEmployeeInfo
                },
                {
                    path: '/employee-info',
                    name: "EmployeeInfo",
                    component: EmployeeInfo
                },
                {
                    path: '/asset-info',
                    name: "AssetInfo",
                    component: AssetInfo
                },
                {
                    path: '/repair-record',
                    name: "RepairRecord",
                    component: RepairRecord
                },
                {
                    path: '/use-record',
                    name: "UseRecord",
                    component: UseRecord
                },
                {
                    path: '/change-myself-info',
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
                    path: '/maintenance-report',
                    name: "MaintenanceReport",
                    component: MaintenanceReport
                },
                {
                    path: '/maintenance-record',
                    name: "MaintenanceRecord",
                    component: MaintenanceRecord
                },
                {
                    path: '/my-assets',
                    name: "MyAssets",
                    component: MyAssets
                },
            ],
        }
    ]
})
export default router