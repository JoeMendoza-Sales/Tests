---
title: "Overdue Todo Display"
checksumTestId: Ij9Kl
startUrl: https://joetodoapp-a03b4.web.app/
---

## Test Steps

1. Clear localStorage and navigate to https://joetodoapp-a03b4.web.app/
2. Click on the text input field (#todoInput) and type "Overdue task"
3. Click on the date input field (#dueDateInput) and select a past date (yesterday)
4. Click the "Add" button (.btn-primary)
5. Verify the todo item appears with the due date visible
6. Verify the due date element (.todo-due) has the .overdue class applied
7. Verify the due date is displayed in red or with overdue styling
