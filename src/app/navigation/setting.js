// Import Dependencies
import { UserIcon } from "@heroicons/react/24/outline";
import { TbPalette } from "react-icons/tb";

// Local Imports
import SettingIcon from "assets/dualicons/setting.svg?react";
import { NAV_TYPE_ITEM } from "constants/app.constant";

// ----------------------------------------------------------------------

export const settings = {
    id: 'setting',
    type: NAV_TYPE_ITEM,
    path: '/configuration',
    title: 'Configuration',
    transKey: 'nav.configuration.',
    Icon: SettingIcon,
    childs: [
        {
            id: 'Licence',
            type: NAV_TYPE_ITEM,
            path: '/settings/general',
            title: 'General',
            transKey: 'nav.settings.general',
            Icon: UserIcon,
        },
        {
            id: 'appearance',
            type: NAV_TYPE_ITEM,
            path: '/settings/appearance',
            title: 'Appearance',
            transKey: 'nav.settings.appearance',
            Icon: TbPalette,
        },
    ]
}