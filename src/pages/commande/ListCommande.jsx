import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommandes, createCommande, updateCommande } from "../redux/commandeSlice";
import { Button, Modal, Input, Select } from "@/components/ui";

const ListeCommande = () => {
  const dispatch = useDispatch();
  const { commandes, loading } = useSelector((state) => state.commandes);

  const [isOpen, setIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    products: [{ product_id: "", quantity: 1, price: "" }],
    user_id: "",
    status: "en attente",
    delivery_date: "",
  });

  useEffect(() => {
    dispatch(fetchCommandes());
  }, [dispatch]);

  const handleInputChange = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index][field] = value;
    setFormData({ ...formData, products: newProducts });
  };

  const addProductField = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { product_id: "", quantity: 1, price: "" }],
    });
  };

  const handleSubmit = () => {
    if (editMode) {
      dispatch(updateCommande(formData));
    } else {
      dispatch(createCommande(formData));
    }
    setIsOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Gestion des Commandes</h1>
      <Button
        onClick={() => {
          setIsOpen(true);
          setEditMode(false);
        }}
      >
        Ajouter une Commande
      </Button>
      <div className="mt-4">
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((commande) => (
                <tr key={commande.id} className="border">
                  <td>{commande.product_id}</td>
                  <td>{commande.quantity}</td>
                  <td>{commande.price} €</td>
                  <td>{commande.total_price} €</td>
                  <td>{commande.status}</td>
                  <td>
                    <Button
                      onClick={() => {
                        setFormData(commande);
                        setIsOpen(true);
                        setEditMode(true);
                      }}
                    >
                      Modifier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* MODAL */}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <h2 className="text-lg font-semibold">
            {editMode ? "Modifier" : "Ajouter"} une Commande
          </h2>
          {formData.products.map((product, index) => (
            <div key={index} className="mb-2">
              <Input
                type="text"
                placeholder="ID du Produit"
                value={product.product_id}
                onChange={(e) => handleInputChange(index, "product_id", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Quantité"
                value={product.quantity}
                onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Prix"
                value={product.price}
                onChange={(e) => handleInputChange(index, "price", e.target.value)}
              />
            </div>
          ))}
          <Button onClick={addProductField}>+ Ajouter un produit</Button>
          <Select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="en attente">En attente</option>
            <option value="livré">Livré</option>
          </Select>
          <Input
            type="date"
            value={formData.delivery_date}
            onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
          />
          <Button onClick={handleSubmit}>{editMode ? "Modifier" : "Ajouter"}</Button>
        </Modal>
      )}
    </div>
  );
};

export default ListeCommande;
