---
title: "Add Todo With Due Date"
checksumTestId: Bc2De
startUrl: https://joetodoapp-a03b4.web.app/
---

## Test Steps

1. Clear localStorage and navigate to https://joetodoapp-a03b4.web.app/
2. Click on the text input field (#todoInput) and type "Submit project report"
3. Click on the date input field (#dueDateInput) and select a future date (7 days from today)
4. Click the "Add" button (.btn-primary)
5. Verify a new todo item appears with text "Submit project report"
6. Verify the due date is displayed in the .todo-due element with the selected date formatted
7. Verify the due date does NOT have the .overdue class (since it's a future date)
