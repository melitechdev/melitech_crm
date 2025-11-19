import { useState } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Search,
  Plus,
  Eye,
  DollarSign,
  Target,
  Users,
  Calendar,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Opportunity {
  id: string;
  name: string;
  client: string;
  value: number;
  stage: "prospecting" | "qualification" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
  probability: number;
  expectedCloseDate: string;
  owner: string;
  source: string;
}

export default function Opportunities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);

  // Fetch real data from backend
  const { data: data = [], isLoading } = trpc.opportunities.list.useQuery();
  const utils = trpc.useUtils();
  
  // Delete mutation
  const deleteOpportunityMutation = trpc.opportunities.delete.useMutation({
    onSuccess: () => {
      toast.success("Opportunity deleted successfully");
      utils.opportunities.list.invalidate();
      setDeleteDialogOpen(false);
      setSelectedOpportunityId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete opportunity");
    },
  });

  // Transform backend data to display format
  const opportunities: Opportunity[] = (data as any[]).map((opp: any) => ({
    id: String(opp.id),
    name: opp.name || "Unknown Opportunity",
    client: opp.clientId ? "Client" : "Unknown",
    value: (opp.value || 0) / 100,
    stage: opp.stage || "prospecting",
    probability: opp.probability || 0,
    expectedCloseDate: opp.expectedCloseDate ? new Date(opp.expectedCloseDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    owner: opp.owner || "Unassigned",
    source: opp.source || "Unknown",
  }));

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStage = stageFilter === "all" || opp.stage === stageFilter;
    
    return matchesSearch && matchesStage;
  });

  const getStageLabel = (stage: string) => {
    const labels: Record<string, string> = {
      prospecting: "Prospecting",
      qualification: "Qualification",
      proposal: "Proposal",
      negotiation: "Negotiation",
      closed_won: "Closed Won",
      closed_lost: "Closed Lost",
    };
    return labels[stage] || stage;
  };

  const getStageVariant = (stage: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (stage) {
      case "closed_won":
        return "default";
      case "negotiation":
      case "proposal":
        return "secondary";
      case "closed_lost":
        return "destructive";
      default:
        return "outline";
    }
  };

  const totalValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = opportunities.reduce((sum, opp) => sum + (opp.value * opp.probability / 100), 0);
  const avgProbability = opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Opportunities</h1>
            <p className="text-muted-foreground">
              Track and manage your sales pipeline
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Opportunity
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total opportunity value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weighted Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Ksh {Math.round(weightedValue).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Probability-adjusted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{opportunities.length}</div>
              <p className="text-xs text-muted-foreground">In pipeline</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Probability</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(avgProbability)}%</div>
              <p className="text-xs text-muted-foreground">Win probability</p>
            </CardContent>
          </Card>
        </div>

        {/* Opportunities Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Opportunities</CardTitle>
                <CardDescription>Manage your sales pipeline</CardDescription>
              </div>
              <div className="flex gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search opportunities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="prospecting">Prospecting</SelectItem>
                    <SelectItem value="qualification">Qualification</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed_won">Closed Won</SelectItem>
                    <SelectItem value="closed_lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Opportunity</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Expected Close</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOpportunities.map((opp) => (
                  <TableRow key={opp.id}>
                    <TableCell className="font-medium">{opp.name}</TableCell>
                    <TableCell>{opp.client}</TableCell>
                    <TableCell className="font-medium">
                      Ksh {opp.value.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStageVariant(opp.stage)}>
                        {getStageLabel(opp.stage)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${opp.probability}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{opp.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(opp.expectedCloseDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{opp.owner}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{opp.source}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          onClick={() => {
                            setSelectedOpportunityId(opp.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogTitle>Delete Opportunity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this opportunity? This action cannot be undone.
            </AlertDialogDescription>
            <div className="flex gap-2 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (selectedOpportunityId) {
                    await deleteOpportunityMutation.mutateAsync(selectedOpportunityId);
                  }
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}

