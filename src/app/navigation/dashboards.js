import OrganizationsIcon from 'assets/nav-icons/organizations.svg?react'
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'
import StatisticIcon from 'assets/nav-icons/statistic.svg?react'

const ROOT_DASHBOARDS = '/dashboards'
// const ROOT_CONFIGURATION='/configuration'
const path = (root, item) => `${root}${item}`;

export const dashboards = {
    id: 'dashboards',
    type: NAV_TYPE_ROOT,
    path: '/dashboards',
    title: 'Dashboards',
    transKey: 'nav.dashboards.dashboards',
    Icon: DashboardsIcon,
    childs: [
        {
            id: 'dashboards.activity',
            path: path(ROOT_DASHBOARDS, '/activity'), // 🆕 Chemin mis à jour                   
            type: NAV_TYPE_ITEM,
            title: 'Activityy', // 🆕 Nouveau titre
            transKey: 'nav.dashboards.activity', // 🆕 Clé de traduction mise à jour
            Icon:StatisticIcon , // Tu peux remplacer par une autre icône si nécessaire
        },
        {
            id: 'dashboards.organisations',
            path: path(ROOT_DASHBOARDS, '/entreprises'),
            type: NAV_TYPE_ITEM,
            title: 'Organisations',
            transKey: 'nav.dashboards.organisations',
            Icon: OrganizationsIcon,
        },
        
    ] 
}

// export const configuration = {
//     id: 'configuration',
//     type: NAV_TYPE_ROOT,
//     path: '/configuration',
//     title: 'Configuration',
//     transKey: 'nav.configuration.configuration',
//     Icon:HomeIcon,
//     childs: [
//         {
//             id: 'configuration.licence',
//             path: path(ROOT_CONFIGURATION, '/licence'),
//             type: NAV_TYPE_ITEM,
//             title: 'Licence',
//             transKey: 'nav.configuration.licence',
//             Icon: HomeIcon,
//         },
//         {
//             id: 'configuration.utilisateur',
//             path: path(ROOT_CONFIGURATION, '/utilisateur'),
//             type: NAV_TYPE_ITEM,
//             title: 'Utilisateur',
//             transKey: 'nav.configuration.utilisateur',
//             Icon: HomeIcon,
//         },
//     ],
// };