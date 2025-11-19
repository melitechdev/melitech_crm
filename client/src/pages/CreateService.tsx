import { useState } from "react";
import { useLocation } from "wouter";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Briefcase, ArrowLeft } from "lucide-react";

export default function CreateService() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    hourlyRate: "",
    fixedPrice: "",
    unit: "hour",
    taxRate: "",
    isActive: true,
  });

  const createServiceMutation = trpc.services.create.useMutation({
    onSuccess: () => {
      toast.success("Service created successfully!");
      utils.services.list.invalidate();
      navigate("/services");
    },
    onError: (error: any) => {
      toast.error(`Failed to create service: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Service name is required");
      return;
    }

    createServiceMutation.mutate({
      name: formData.name,
      description: formData.description || undefined,
      category: formData.category || undefined,
      hourlyRate: formData.hourlyRate ? Math.round(parseFloat(formData.hourlyRate) * 100) : undefined,
      fixedPrice: formData.fixedPrice ? Math.round(parseFloat(formData.fixedPrice) * 100) : undefined,
      unit: formData.unit || "hour",
      taxRate: formData.taxRate ? Math.round(parseFloat(formData.taxRate) * 100) : undefined,
      isActive: formData.isActive,
    });
  };

  return (
    <ModuleLayout
      title="Create Service"
      description="Add a new service to your catalog"
      icon={<Briefcase className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Products & Services", href: "/services" },
        { label: "Create Service" },
      ]}
    >
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create Service</CardTitle>
            <CardDescription>
              Enter the service details below to add a new service to your catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter service name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter service description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Consulting"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="e.g., hour, day"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate (Ksh)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    placeholder="0.00"
                    value={formData.hourlyRate}
                    onChange={(e) =>
                      setFormData({ ...formData, hourlyRate: e.target.value })
                    }
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fixedPrice">Fixed Price (Ksh)</Label>
                  <Input
                    id="fixedPrice"
                    type="number"
                    placeholder="0.00"
                    value={formData.fixedPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, fixedPrice: e.target.value })
                    }
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  placeholder="0"
                  value={formData.taxRate}
                  onChange={(e) =>
                    setFormData({ ...formData, taxRate: e.target.value })
                  }
                  step="0.01"
                  min="0"
                  max="100"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/services")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createServiceMutation.isPending}
                >
                  {createServiceMutation.isPending
                    ? "Creating..."
                    : "Create Service"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}

