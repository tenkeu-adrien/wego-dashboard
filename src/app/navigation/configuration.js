// import AppsIcon from 'assets/dualicons/applications.svg?react'
// import KanbanIcon from 'assets/nav-icons/kanban.svg?react'
// import MailIcon from 'assets/nav-icons/mail.svg?react'

// import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

// const ROOT_APPS = '/configuration'

// const path = (root, item) => `${root}${item}`;

// export const configuration = {
//     id: 'configuration',
//     type: NAV_TYPE_ROOT,
//     path: '/configuration',
//     title: 'Configuration',
//     transKey: 'nav.configuration.configuration',
//     Icon: AppsIcon,
//     childs: [
//         {
//             id: 'gestion des utilisateurs',
//             path: path(ROOT_APPS, '/gestion-utilisateur'),
//             type: NAV_TYPE_ITEM,
//             title: 'Utilisateur',
//             transKey: 'nav.configuration.gestion-utilisateur',
//             Icon: KanbanIcon,
//         },
//         {
//             id: 'licence',
//             path: path(ROOT_APPS, '/licence'),
//             type: NAV_TYPE_ITEM,
//             title: 'Licence',
//             transKey: 'nav.configuration.licence',
//             Icon: MailIcon,
//         }
       
//     ]
// }


// export const dashboards = {
//     id: 'dashboards',
//     type: NAV_TYPE_ROOT,
//     path: '/dashboards',
//     title: 'Dashboards',
//     transKey: 'nav.dashboards.dashboards',
//     Icon: DashboardsIcon,
//     childs: [
//         {
//             id: 'dashboards.activity',
//             path: path(ROOT_DASHBOARDS, '/activity'), // 🆕 Chemin mis à jour                   
//             type: NAV_TYPE_ITEM,
//             title: 'Activityy', // 🆕 Nouveau titre
//             transKey: 'nav.dashboards.activity', // 🆕 Clé de traduction mise à jour
//             Icon: HomeIcon, // Tu peux remplacer par une autre icône si nécessaire
//         },
//         {
//             id: 'dashboards.organisations',
//             path: path(ROOT_DASHBOARDS, '/organisations'),
//             type: NAV_TYPE_ITEM,
//             title: 'Organisations',
//             transKey: 'nav.dashboards.organisations',
//             Icon: HomeIcon,
//         },
        
//     ] 
// }

import ConfigIcon from 'assets/dualicons/configuration.svg?react'
import UsersIcon from 'assets/nav-icons/users.svg?react'
import LicenseIcon from 'assets/nav-icons/license.svg?react'

import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_APPS = '/configuration'

const path = (root, item) => `${root}${item}`

export const configuration = {
    id: 'configuration',
    type: NAV_TYPE_ROOT,
    path: '/configuration',
    title: 'Configuration',
    transKey: 'nav.configuration.configuration',
    Icon: ConfigIcon,
    childs: [
        {
            id: 'gestion des utilisateurs',
            path: path(ROOT_APPS, '/gestion-utilisateur'),
            type: NAV_TYPE_ITEM,
            title: 'Utilisateur',
            transKey: 'nav.configuration.gestion-utilisateur',
            Icon: UsersIcon,
        },
        {
            id: 'gestion des licences',
            path: path(ROOT_APPS, '/gestion-licence'),
            type: NAV_TYPE_ITEM,
            title: 'Licence',
            transKey: 'nav.configuration.licence',
            Icon: LicenseIcon,
        }
    ]
}