import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductDetails() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const product = {
    id: id || "1",
    name: "Sample Product",
    sku: `SKU-${id}`,
    category: "Electronics",
    price: 15000,
    cost: 10000,
    stock: 50,
    status: "active",
    description: "High-quality product",
  };

  const handleEdit = () => {
    navigate(`/products/${id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Product deleted successfully");
      navigate("/products");
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.sku}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Name</label>
                <p className="text-muted-foreground">{product.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <Badge>{product.status}</Badge>
              </div>
              <div>
                <label className="text-sm font-medium">Price</label>
                <p className="text-muted-foreground">Ksh {product.price.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Stock</label>
                <p className="text-muted-foreground">{product.stock} units</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      />
    </DashboardLayout>
  );
}
