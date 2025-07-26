import OrganizationsIcon from 'assets/nav-icons/bank-build.svg?react';
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react';
import StatisticIcon from 'assets/nav-icons/statistic.svg?react';
import BankBuildIcon from 'assets/nav-icons/people.svg?react';
import BankBuildIco from 'assets/nav-icons/kanban.svg?react';
import LicenseIcon from 'assets/nav-icons/license.svg?react';
import LicenseIco from 'assets/nav-icons/steps.svg?react';
import WegoFoodIcon from 'assets/nav-icons/widget.svg?react';
import OrganizationsIco from 'assets/nav-icons/utility.svg?react';
import { 
  NAV_TYPE_ROOT, 
  NAV_TYPE_ITEM, 
  NAV_TYPE_COLLAPSE
} from 'constants/app.constant';

const ROOT_DASHBOARDS = '/dashboards';
const ROOT_APPS = '/apps';

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
      path: path(ROOT_DASHBOARDS, '/activité'),
      type: NAV_TYPE_ITEM,
      title: 'activité',
      transKey: 'nav.dashboards.activity',
      Icon: StatisticIcon,
    },
    {
      id: 'dashboards.organisations',
      path: path(ROOT_DASHBOARDS, '/entreprises'),
      type: NAV_TYPE_ITEM,
      title: 'Organisations',
      transKey: 'nav.dashboards.finance',
      Icon: OrganizationsIcon,
    },
    {
      id: 'dashboards.organisations',
      path: path(ROOT_DASHBOARDS, '/tarifications'),
      type: NAV_TYPE_ITEM,
      title: 'Organisations',
      transKey: 'nav.dashboards.finances',
      Icon: OrganizationsIco,
    },
    {
      id: 'gestion',
      path: path(ROOT_DASHBOARDS, '/gestion'),
      type: NAV_TYPE_ITEM, // Changé de NAV_TYPE_COLLAPSE à NAV_TYPE_ITEM
      title: 'Gestion des Utilisateurs',
      transKey: 'nav.dashboards.gestion',
      Icon: BankBuildIcon,
    },
    // {
    //   id: 'suivi',
    //   path: path(ROOT_APPS, '/suivi-trajets'),
    //   type: NAV_TYPE_ITEM,
    //   title: 'Suivi des trajets',
    //   transKey: 'nav.configuration.suivi',
    //   Icon: LicenseIcon,
    // },
    {
      id: 'courses',
      path: path(ROOT_APPS, '/courses'),
      type: NAV_TYPE_ITEM,
      title: 'Courses',
      transKey: 'nav.configuration.course',
      Icon: LicenseIco,
    },
    {
      id: 'WegoFood',
      path: path(ROOT_APPS, '/WegoFood'),
      type: NAV_TYPE_ITEM,
      title: 'WegoFood',
      transKey: 'nav.configuration.WegoFood',
      Icon: WegoFoodIcon,
    },
    {
      id: 'points',
      path: path(ROOT_DASHBOARDS, '/points'),
      type: NAV_TYPE_COLLAPSE,
      title: 'Points de vente',
      transKey: 'nav.dashboards.point',
      Icon: BankBuildIco,
      childs: [
        {
          id: 'partenaires',
          type: NAV_TYPE_ITEM,
          path: path(ROOT_DASHBOARDS, '/points/partenaires'),
          title: 'Partenaires',
          transKey: 'nav.dashboards.partenaire',
        },
        {
          id: 'produits',
          type: NAV_TYPE_ITEM,
          path: path(ROOT_DASHBOARDS, '/points/produits'),
          title: 'Produits',
          transKey: 'nav.dashboards.produit',
        },
      ],
    },
   
    {
      id: 'rapport',
      path: path(ROOT_APPS, '/rapports'),
      type: NAV_TYPE_ITEM,
      title: 'Rapports',
      transKey: 'nav.configuration.rapport',
      Icon: LicenseIcon,
    }
  ]
};