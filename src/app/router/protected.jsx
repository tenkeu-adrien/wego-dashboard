// Import Dependencies
import { Navigate } from "react-router";

// Local Imports
// import { AppLayout } from "app/layouts/AppLayout";
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards" />,
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards/activity" />,
            },
            {
              path: "activity",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/home")).default,
              }),
            },
            {
              path: "entreprises",
              lazy: async () => ({
                Component: (await import("app/pages/finances/tarifs")).default,
              }),
            },
            {
              path: "gestion",
              lazy: async () => ({
                Component: (await import("app/pages/organisations/users-datatable")).default,
              }),
            },
            // Points de vente
            {
              path: "points",
              children: [
                {
                  index: true,
                  element: <Navigate to="/dashboards/points/partenaires" />,
                },
                {
                  path: "partenaires",
                  lazy: async () => ({
                    Component: (await import("app/pages/points/partenaires")).default,
                  }),
                },
                {
                  path: "produits",
                  lazy: async () => ({
                    Component: (await import("app/pages/points/produits")).default,
                  }),
                },
              ],
            },
            // Finances
            // {
            //   path: "finances",
            //   children: [
            //     {
            //       index: true,
            //       element: <Navigate to="/dashboards/finances/tarif" />,
            //     },
            //     {
            //       path: "tarif",
            //       lazy: async () => ({
            //         Component: (await import("app/pages/finances/tarifs")).default,
            //       }),
            //     },
            //     {
            //       path: "paiements",
            //       lazy: async () => ({
            //         Component: (await import("app/pages/finances/paiements")).default,
            //       }),
            //     },
            //     {
            //       path: "commissions",
            //       lazy: async () => ({
            //         Component: (await import("app/pages/finances/commissions")).default,
            //       }),
            //     },
            //   ],
            // },
          ],
        },
        // Routes sous /apps
        {
          path: "apps",
          children: [
            {
              path: "suivi-trajets",
              lazy: async () => ({
                Component: (await import("app/pages/apps/courses")).default,
              }),
            },
            {
              path: "courses",
              lazy: async () => ({
                Component: (await import("app/pages/apps/courses")).default,
              }),
            },
            {
              path: "rapports",
              lazy: async () => ({
                Component: (await import("app/pages/apps/rapports")).default,
              }),
            },
          ],
        },
        {
          path: "configuration",
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards/activity" />,
            },
            {
              path: "gestion-licence",
              lazy: async () => ({
                Component: (await import("app/pages/tables/price-list")).default,
              }),
            },
            {
              path: "gestion-utilisateur",
              lazy: async () => ({
                Component: (await import("app/pages/tables/users-datatable")).default,
              }),
            },
          ],
        },
      ],
    },
    // The app layout supports only the main layout
    // {
    //   Component: AppLayout,
    //   children: [
    //     {
    //       path: "settings",
    //       lazy: async () => ({
    //         Component: (await import("app/pages/settings/Layout")).default,
    //       }),
    //       children: [
    //         {
    //           index: true,
    //           element: <Navigate to="/settings/general" />,
    //         },
    //         {
    //           path: "general",
    //           lazy: async () => ({
    //             Component: (await import("app/pages/settings/sections/General"))
    //               .default,
    //           }),
    //         },
    //         {
    //           path: "appearance",
    //           lazy: async () => ({
    //             Component: (
    //               await import("app/pages/settings/sections/Appearance")
    //             ).default,
    //           }),
    //         },
    //       ],
    //     },
    //   ],
    // },
  ],
};

export { protectedRoutes };