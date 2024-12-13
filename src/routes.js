import Dashboard from "layouts/dashboard";
import ArticlesList from "layouts/dashboard";
import AddArticle from "layouts/dashboard";
import TransferArticle from "layouts/dashboard";
import SitesList from "layouts/dashboard";
import NeedsPlanning from "layouts/dashboard";
import ConsumptionTracking from "layouts/dashboard";
import DailyReport from "layouts/dashboard";
import WarehousesList from "layouts/dashboard";
import TransfersHistory from "layouts/dashboard";
import RegisterOrder from "layouts/dashboard";
import OrdersList from "layouts/dashboard";
import Quotations from "layouts/dashboard";
import UsersList from "layouts/dashboard";
import AlertSettings from "layouts/dashboard";

import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Gestion des stocks",
    key: "stocks",
    icon: <Icon fontSize="small">inventory_2</Icon>,
    children: [
      {
        name: "Liste des articles",
        key: "articles-list",
        route: "/stocks/articles-list",
        component: <ArticlesList />,
      },
      {
        name: "Ajouter un article",
        key: "add-article",
        route: "/stocks/add-article",
        component: <AddArticle />,
      },
      {
        name: "Transférer un article",
        key: "transfer-article",
        route: "/stocks/transfer-article",
        component: <TransferArticle />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Gestion des chantiers",
    key: "sites",
    icon: <Icon fontSize="small">engineering</Icon>,
    children: [
      {
        name: "Liste des chantiers",
        key: "sites-list",
        route: "/sites/sites-list",
        component: <SitesList />,
      },
      {
        name: "Planifications des besoins",
        key: "needs-planning",
        route: "/sites/needs-planning",
        component: <NeedsPlanning />,
      },
      {
        name: "Suivi des consommations",
        key: "consumption-tracking",
        route: "/sites/consumption-tracking",
        component: <ConsumptionTracking />,
      },
      {
        name: "Rapport journalier",
        key: "daily-report",
        route: "/sites/daily-report",
        component: <DailyReport />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Entrepôts",
    key: "warehouses",
    icon: <Icon fontSize="small">store</Icon>,
    children: [
      {
        name: "Liste des entrepôts",
        key: "warehouses-list",
        route: "/warehouses/warehouses-list",
        component: <WarehousesList />,
      },
      {
        name: "Historique des transferts",
        key: "transfers-history",
        route: "/warehouses/transfers-history",
        component: <TransfersHistory />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Gestion commerciale",
    key: "commercial",
    icon: <Icon fontSize="small">shopping_cart</Icon>,
    children: [
      {
        name: "Enregistrer une commande",
        key: "register-order",
        route: "/commercial/register-order",
        component: <RegisterOrder />,
      },
      {
        name: "Liste des commandes",
        key: "orders-list",
        route: "/commercial/orders-list",
        component: <OrdersList />,
      },
      {
        name: "Devis",
        key: "quotations",
        route: "/commercial/quotations",
        component: <Quotations />,
      },
    ],
  },
  {
    type: "collapse",
    name: "Administration",
    key: "admin",
    icon: <Icon fontSize="small">admin_panel_settings</Icon>,
    children: [
      {
        name: "Liste des utilisateurs",
        key: "users-list",
        route: "/admin/users-list",
        component: <UsersList />,
      },
      {
        name: "Configurations alertes/Seuil",
        key: "alert-settings",
        route: "/admin/alert-settings",
        component: <AlertSettings />,
      },
    ],
  },
];

export default routes;
