#!/bin/bash
# Script to add action buttons to all CRM modules

MODULES=(
  "Estimates"
  "Proposals"
  "Payments"
  "Projects"
  "Clients"
  "Products"
  "Services"
  "Opportunities"
  "Expenses"
  "HR"
  "Departments"
)

echo "Modules to update: ${MODULES[@]}"
echo "Total: ${#MODULES[@]} modules"
