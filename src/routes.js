import Dashboard from "layouts/dashboard";
import ArticlesList from "pages/stocks/ListArticles";
import AddArticle from "pages/stocks/AddArticle";
import TransferArticle from "pages/stocks/TransfertArticleList";
import SitesList from "pages/chantiers/ListChantiers";
import Chantiers from "pages/chantiers/ListChantiers";
import NeedsPlanning from "pages/chantiers/Besoins";
import ConsumptionTracking from "pages/chantiers/SuiviConsommation"; //
import DailyReport from "pages/chantiers/RapportJournalier";
import WarehousesList from "pages/entrepots/ListEntrepots";
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
    key: "Tableau de bord",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    roles: ["administrateur", "chef", "gestionnaire", "commercial"],
  },
  {
    type: "collapse",
    name: "Gestion des stocks",
    key: "stocks",
    icon: <Icon fontSize="small">inventory_2</Icon>,
    isOpen: false,
    roles: ["administrateur", "gestionnaire"],
    children: [
      {
        name: "Stock Global",
        key: "Stock Global",
        route: "/stocks/liste-articles",
        component: <ArticlesList />,
        icon: <Icon fontSize="small">list</Icon>,
        roles: ["administrateur", "chef", "gestionnaire"],
      },
      {
        name: "Voir le stock",
        key: "Voir le stock",
        route: "/stocks/:userId",
        component: <ArticlesList />,
        icon: <Icon fontSize="small">list</Icon>,
        roles: ["chef", "gestionnaire"],
      },
      {
        name: "Liste des transferts",
        key: "Liste des transferts",
        route: "/stocks/Liste-des-transferts",
        component: <TransferArticle />,
        icon: <Icon fontSize="small">send</Icon>,
        roles: ["administrateur", "gestionnaire"],
      },
    ],
  },
  {
    type: "collapse",
    name: "Gestion des chantiers",
    key: "sites",
    icon: <Icon fontSize="small">engineering</Icon>,
    isOpen: false,
    roles: ["administrateur", "chef", "gestionnaire", "commercial"],
    children: [
      {
        name: "Liste des chantiers",
        key: "sites-list",
        route: "/chantiers/liste-chantiers",
        component: <SitesList />,
        icon: <Icon fontSize="small">list_alt</Icon>,
        roles: ["administrateur"],
      },
      {
        name: "Planifications des besoins",
        key: "needs-planning",
        route: "/sites/needs-planning",
        component: <NeedsPlanning />,
        icon: <Icon fontSize="small">event_note</Icon>,
        roles: ["chef", "gestionnaire", "commercial"],
      },
      {
        name: "Suivi des consommations",
        key: "consumption-tracking",
        route: "/sites/consumption-tracking",
        component: <ConsumptionTracking />,
        icon: <Icon fontSize="small">bar_chart</Icon>,
        roles: ["chef", "gestionnaire"],
      },
      {
        name: "Rapport journalier",
        key: "daily-report",
        route: "/sites/daily-report",
        component: <DailyReport />,
        icon: <Icon fontSize="small">description</Icon>,
        roles: ["chef", "gestionnaire", "commercial"],
      },
    ],
  },
  {
    type: "collapse",
    name: "Entrepôts",
    key: "warehouses",
    icon: <Icon fontSize="small">store</Icon>,
    isOpen: false,
    roles: ["administrateur", "chef", "gestionnaire", "commercial"],
    children: [
      {
        name: "Liste des entrepôts",
        key: "Liste des entrepôts",
        route: "/entrepots/liste-entrepots",
        component: <WarehousesList />,
        icon: <Icon fontSize="small">view_list</Icon>,
        roles: ["administrateur"],
      },
      {
        name: "Historique des transferts",
        key: "transfers-history",
        route: "/warehouses/transfers-history",
        component: <TransfersHistory />,
        icon: <Icon fontSize="small">history</Icon>,
        roles: ["chef", "gestionnaire", "commercial"],
      },
    ],
  },
  {
    type: "collapse",
    name: "Gestion commerciale",
    key: "commercial",
    icon: <Icon fontSize="small">shopping_cart</Icon>,
    isOpen: false,
    roles: ["commercial"],
    children: [
      {
        name: "Enregistrer une commande",
        key: "register-order",
        route: "/commercial/register-order",
        component: <RegisterOrder />,
        icon: <Icon fontSize="small">add_shopping_cart</Icon>,
        roles: ["commercial"],
      },
      {
        name: "Liste des commandes",
        key: "orders-list",
        route: "/commercial/orders-list",
        component: <OrdersList />,
        icon: <Icon fontSize="small">receipt</Icon>,
        roles: ["commercial"],
      },
      {
        name: "Devis",
        key: "quotations",
        route: "/commercial/quotations",
        component: <Quotations />,
        icon: <Icon fontSize="small">request_quote</Icon>,
        roles: ["commercial"],
      },
    ],
  },
  {
    type: "collapse",
    name: "Administration",
    key: "admin",
    icon: <Icon fontSize="small">admin_panel_settings</Icon>,
    isOpen: false,
    roles: ["administrateur"],
    children: [
      {
        name: "Liste des utilisateurs",
        key: "users-list",
        route: "/admin/users-list",
        component: <UsersList />,
        icon: <Icon fontSize="small">group</Icon>,
        roles: ["administrateur", "commercial"],
      },
      {
        name: "Configurations alertes/Seuil",
        key: "alert-settings",
        route: "/admin/alert-settings",
        component: <AlertSettings />,
        icon: <Icon fontSize="small">settings</Icon>,
        roles: ["administrateur"],
      },
    ],
  },
];

export default routes;
