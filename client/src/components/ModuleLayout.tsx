import React from "react";
import { DashboardLayout } from "@/components/MaterialTailwind";
import { PageHeader } from "./PageHeader";
import { cn } from "@/lib/utils";

interface ModuleLayoutProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ModuleLayout({
  title,
  description,
  icon,
  breadcrumbs,
  actions,
  children,
  className,
  contentClassName,
}: ModuleLayoutProps) {
  return (
    <DashboardLayout>
      <div className={cn("space-y-6", className)}>
        {/* Page Header */}
        <PageHeader
          title={title}
          description={description}
          icon={icon}
          breadcrumbs={breadcrumbs}
          actions={actions}
        />

        {/* Page Content */}
        <div className={cn("", contentClassName)}>
          {children}
        </div>
      </div>
    </DashboardLayout>
  );
}

