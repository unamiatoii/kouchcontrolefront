import Dashboard from "layouts/dashboard";
import ArticlesList from "pages/stocks/ListArticles";
import AddArticle from "pages/stocks/AddArticle";
import TransferArticle from "pages/stocks/TransfertArticleList";
import SitesList from "pages/chantiers/ListChantiers";
import Chantiers from "pages/chantiers/ListChantiers";
import NeedsPlanning from "pages/chantiers/Besoins";
import ConsumptionTracking from "pages/chantiers/SuiviConsommation"; //
import DailyReport from "pages/chantiers/RapportJournalier";
import WarehousesList from "layouts/dashboard";
import TransfersHistory from "layouts/dashboard";
import RegisterOrder from "layouts/dashboard";
import OrdersList from "layouts/dashboard";
import Quotations from "layouts/dashboard";
import UsersList from "pages/administration/ListUsers";
import AlertSettings from "layouts/dashboard";

import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Tableau de bord",
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
    isOpen: false,
    children: [
      {
        name: "Liste des articles",
        key: "articles-list",
        route: "/stocks/articles-list",
        component: <ArticlesList />,
        icon: <Icon fontSize="small">list</Icon>,
      },
      {
        name: "Ajouter un article",
        key: "add-article",
        route: "/stocks/add-article",
        component: <AddArticle />,
        icon: <Icon fontSize="small">add</Icon>,
      },
      {
        name: "Transférer un article",
        key: "transfer-article",
        route: "/stocks/transfer-article",
        component: <TransferArticle />,
        icon: <Icon fontSize="small">send</Icon>,
      },
    ],
  },
  {
    type: "collapse",
    name: "Gestion des chantiers",
    key: "sites",
    icon: <Icon fontSize="small">engineering</Icon>,
    isOpen: false,
    children: [
      {
        name: "Liste des chantiers",
        key: "sites-list",
        route: "/sites/sites-list",
        component: <SitesList />,
        icon: <Icon fontSize="small">list_alt</Icon>,
      },
      {
        name: "Planifications des besoins",
        key: "needs-planning",
        route: "/sites/needs-planning",
        component: <NeedsPlanning />,
        icon: <Icon fontSize="small">event_note</Icon>,
      },
      {
        name: "Suivi des consommations",
        key: "consumption-tracking",
        route: "/sites/consumption-tracking",
        component: <ConsumptionTracking />,
        icon: <Icon fontSize="small">bar_chart</Icon>,
      },
      {
        name: "Rapport journalier",
        key: "daily-report",
        route: "/sites/daily-report",
        component: <DailyReport />,
        icon: <Icon fontSize="small">description</Icon>,
      },
    ],
  },
  {
    type: "collapse",
    name: "Entrepôts",
    key: "warehouses",
    icon: <Icon fontSize="small">store</Icon>,
    isOpen: false,
    children: [
      {
        name: "Liste des entrepôts",
        key: "warehouses-list",
        route: "/warehouses/warehouses-list",
        component: <WarehousesList />,
        icon: <Icon fontSize="small">view_list</Icon>,
      },
      {
        name: "Historique des transferts",
        key: "transfers-history",
        route: "/warehouses/transfers-history",
        component: <TransfersHistory />,
        icon: <Icon fontSize="small">history</Icon>,
      },
    ],
  },
  {
    type: "collapse",
    name: "Gestion commerciale",
    key: "commercial",
    icon: <Icon fontSize="small">shopping_cart</Icon>,
    isOpen: false,
    children: [
      {
        name: "Enregistrer une commande",
        key: "register-order",
        route: "/commercial/register-order",
        component: <RegisterOrder />,
        icon: <Icon fontSize="small">add_shopping_cart</Icon>,
      },
      {
        name: "Liste des commandes",
        key: "orders-list",
        route: "/commercial/orders-list",
        component: <OrdersList />,
        icon: <Icon fontSize="small">receipt</Icon>,
      },
      {
        name: "Devis",
        key: "quotations",
        route: "/commercial/quotations",
        component: <Quotations />,
        icon: <Icon fontSize="small">request_quote</Icon>,
      },
    ],
  },
  {
    type: "collapse",
    name: "Administration",
    key: "admin",
    icon: <Icon fontSize="small">admin_panel_settings</Icon>,
    isOpen: false,
    children: [
      {
        name: "Liste des utilisateurs",
        key: "users-list",
        route: "/admin/users-list",
        component: <UsersList />,
        icon: <Icon fontSize="small">group</Icon>,
      },
      {
        name: "Configurations alertes/Seuil",
        key: "alert-settings",
        route: "/admin/alert-settings",
        component: <AlertSettings />,
        icon: <Icon fontSize="small">settings</Icon>,
      },
    ],
  },
];

export default routes;
