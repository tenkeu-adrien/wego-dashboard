// Import Dependencies
import { Navigate } from "react-router";

// Local Imports
import { AppLayout } from "app/layouts/AppLayout";
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";

// ----------------------------------------------------------------------

// const protectedRoutes = {
//   id: "protected",
//   Component: AuthGuard,
//   children: [
//     // The dynamic layout supports both the main layout and the sideblock.
//     {
//       Component: DynamicLayout,
//       children: [
//         {
//           index: true,
//           element: <Navigate to="/dashboards" />,
//         },
//         {
//           path: "dashboards",
//           children: [
//             {
//               index: true,
//               element: <Navigate to="/dashboards/activity" />,
//             },
//             {
//               path: "activity",
//               lazy: async () => ({
//                 Component: (await import("app/pages/dashboards/home")).default,
//               }),
//             },
//             {
//               path: "AccountManagement",
//               lazy: async () => ({
//                 Component: (await import("app/pages/tables/users-datatable"))
//                   .default,
//               }),
//             },
//           ],
//         },
//       ],
//     },
//     // The app layout supports only the main layout. Avoid using it for other layouts.
//     // {
//     //   Component: AppLayout,
//     //   children: [
//     //     {
//     //       path: "settings",
//     //       lazy: async () => ({
//     //         Component: (await import("app/pages/settings/Layout")).default,
//     //       }),
//     //       children: [
//     //         {
//     //           index: true,
//     //           element: <Navigate to="/settings/general" />,
//     //         },
//     //         {
//     //           path: "general",
//     //           lazy: async () => ({
//     //             Component: (await import("app/pages/settings/sections/General"))
//     //               .default,
//     //           }),
//     //         },
//     //         {
//     //           path: "appearance",
//     //           lazy: async () => ({
//     //             Component: (
//     //               await import("app/pages/settings/sections/Appearance")
//     //             ).default,
//     //           }),
//     //         },
//     //       ],
//     //     },
//     //   ],
//     // },
//   ],
// };


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
                Component: (await import("app/pages/organisations/users-datatable")).default,
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
 

  //  The app layout supports only the main layout. Avoid using it for other layouts.
    {
      Component: AppLayout,
      children: [
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("app/pages/settings/Layout")).default,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/settings/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (await import("app/pages/settings/sections/General"))
                  .default,
              }),
            },
            {
              path: "appearance",
              lazy: async () => ({
                Component: (
                  await import("app/pages/settings/sections/Appearance")
                ).default,
              }),
            },
          ],
        },
      ],
    },
  ],
};
export { protectedRoutes };
