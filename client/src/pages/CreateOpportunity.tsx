import { useState } from "react";
import { useLocation } from "wouter";
import { ModuleLayout } from "@/components/ModuleLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { TrendingUp, ArrowLeft } from "lucide-react";

export default function CreateOpportunity() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const [formData, setFormData] = useState({
    clientId: "",
    title: "",
    description: "",
    value: "",
    stage: "lead",
    probability: "",
    expectedCloseDate: "",
    source: "",
    notes: "",
  });

  const { data: clients = [] } = trpc.clients.list.useQuery();

  const createOpportunityMutation = trpc.opportunities.create.useMutation({
    onSuccess: () => {
      toast.success("Opportunity created successfully!");
      utils.opportunities.list.invalidate();
      navigate("/opportunities");
    },
    onError: (error: any) => {
      toast.error(`Failed to create opportunity: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId || !formData.title || !formData.value) {
      toast.error("Please fill in all required fields");
      return;
    }

    createOpportunityMutation.mutate({
      clientId: formData.clientId,
      title: formData.title,
      description: formData.description || undefined,
      value: Math.round(parseFloat(formData.value) * 100),
      stage: formData.stage as any,
      probability: formData.probability ? parseInt(formData.probability) : undefined,
      expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate) : undefined,
      source: formData.source || undefined,
      notes: formData.notes || undefined,
    });
  };

  return (
    <ModuleLayout
      title="Create Opportunity"
      description="Add a new sales opportunity"
      icon={<TrendingUp className="w-6 h-6" />}
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Sales", href: "/sales" },
        { label: "Opportunities", href: "/opportunities" },
        { label: "Create Opportunity" },
      ]}
    >
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create Opportunity</CardTitle>
            <CardDescription>
              Enter the opportunity details below to track a new sales opportunity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="clientId">Client *</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, clientId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {(clients as any[]).map((client: any) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.companyName || client.contactPerson}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Opportunity Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Website Redesign Project"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter opportunity description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="value">Value (Ksh) *</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="0.00"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    step="0.01"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage">Stage *</Label>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) =>
                      setFormData({ ...formData, stage: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="proposal">Proposal</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="closed_won">Closed Won</SelectItem>
                      <SelectItem value="closed_lost">Closed Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    placeholder="0"
                    value={formData.probability}
                    onChange={(e) =>
                      setFormData({ ...formData, probability: e.target.value })
                    }
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                  <Input
                    id="expectedCloseDate"
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedCloseDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input
                  id="source"
                  placeholder="e.g., Referral, Website, Cold Call"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about this opportunity..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/opportunities")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createOpportunityMutation.isPending}
                >
                  {createOpportunityMutation.isPending
                    ? "Creating..."
                    : "Create Opportunity"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}

