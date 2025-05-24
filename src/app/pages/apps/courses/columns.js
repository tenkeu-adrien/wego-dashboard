// Import Dependencies
import { createColumnHelper } from "@tanstack/react-table";

// Local Imports
import { RowActions } from "./RowActions";
import {
    SelectCell,
    SelectHeader,
} from "components/shared/table/SelectCheckbox";
import {
    AddressCell,
    CustomerCell,
    // DateCell,
    OrderIdCell,
    OrderStatusCell,
    // ProfitCell,
    // TotalCell,
} from "./rows";

// ----------------------------------------------------------------------

const columnHelper = createColumnHelper();

export const columns = [
    columnHelper.display({
        id: "select",
        label: "Sélection",
        header: SelectHeader,
        cell: SelectCell,
    }),
    columnHelper.accessor((row) => row.order_id, {
        id: "order_id",
        label: "ID Commande",
        header: "ID",
        cell: OrderIdCell,
    }),
    columnHelper.accessor((row) => row.client, {
        id: "client",
        label: "Client",
        header: "Client",
        cell: CustomerCell,
    }),
    columnHelper.accessor((row) => row.chauffeur, {
        id: "chauffeur",
        label: "Chauffeur",
        header: "Chauffeur",
        cell: CustomerCell,
    }),
    columnHelper.accessor((row) => row.vehicule, {
        id: "vehicule",
        label: "Véhicule",
        header: "Véhicule",
        cell: CustomerCell,
    }),
    columnHelper.accessor((row) => row.driver, {
        id: "driver",
        label: "Conducteur",
        header: "Conducteur",
        cell: CustomerCell,
    }),
    columnHelper.accessor((row) => row.pickup_address, {
        id: "pickup_address",
        label: "Adresse de départ",
        header: "Départ",
        cell: AddressCell,
    }),
    columnHelper.accessor((row) => row.destination_address, {
        id: "destination_address",
        label: "Adresse d'arrivée",
        header: "Arrivée",
        cell: AddressCell,
    }),
    columnHelper.accessor((row) => row.status, {
        id: "status",
        label: "Statut",
        header: "Statut",
        cell: OrderStatusCell,
        filterFn: "arrIncludesSome",
    }),
    columnHelper.display({
        id: "actions",
        label: "Actions",
        header: "Actions",
        cell: RowActions
    }),
]
