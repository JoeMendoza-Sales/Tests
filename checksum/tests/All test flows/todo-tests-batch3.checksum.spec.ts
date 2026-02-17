import { init, IChecksumPage } from "@checksum-ai/runtime";

const { test, defineChecksumTest, expect, checksumAI } = init();

const BASE_URL = "https://joetodoapp-a03b4.web.app/";

// Helper: Clear localStorage and navigate to the app
async function setupTest(
  page: IChecksumPage,
  checksumAI: Function
): Promise<void> {
  await checksumAI("Navigate to the Todo app", async () => {
    await page.goto(BASE_URL);
  });
  await page.evaluate(() => localStorage.clear());
  await checksumAI("Reload page after clearing localStorage", async () => {
    await page.reload();
  });
  await page.waitForLoadState("domcontentloaded");
}

// Helper: Add a todo item with optional due date
async function addTodo(
  page: IChecksumPage,
  checksumAI: Function,
  text: string,
  dueDate?: string
): Promise<void> {
  await checksumAI(`Enter todo text: ${text}`, async () => {
    await page.locator("#todoInput").fill(text);
  });
  if (dueDate) {
    await checksumAI(`Set due date to ${dueDate}`, async () => {
      await page.locator("#dueDateInput").fill(dueDate);
    });
  }
  await checksumAI("Click Add button", async () => {
    await page.locator(".btn-primary").click();
  });
}

// Helper: Get a past date string in yyyy-mm-dd format
function getPastDateString(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper: Format date from yyyy-mm-dd to mm/dd/yyyy (app's display format)
function formatDateForDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${month}/${day}/${year}`;
}

test.describe("Todo Application Tests - Batch 3", () => {
  test(
    defineChecksumTest("Multiple Todos Management", "No4Pq"),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);

      // Step 2: Add first todo 'Buy milk'
      await addTodo(page, checksumAI, "Buy milk");

      // Step 3: Add second todo 'Call dentist'
      await addTodo(page, checksumAI, "Call dentist");

      // Step 4: Verify both todos are visible
      const todoItems = page.locator(".todo-item");
      await expect(todoItems, "Should have 2 todo items").toHaveCount(2);
      await expect(
        page.locator(".todo-text", { hasText: "Buy milk" }),
        "Buy milk todo should be visible"
      ).toBeVisible();
      await expect(
        page.locator(".todo-text", { hasText: "Call dentist" }),
        "Call dentist todo should be visible"
      ).toBeVisible();

      // Step 5: Mark 'Buy milk' as complete by clicking its checkbox
      const buyMilkTodo = page.locator(".todo-item", { hasText: "Buy milk" });
      await checksumAI("Click checkbox on 'Buy milk' todo", async () => {
        await buyMilkTodo.locator(".todo-checkbox").click();
      });

      // Step 6: Verify 'Buy milk' shows completed styling (strikethrough via .completed class)
      await expect(
        buyMilkTodo,
        "Buy milk todo should have completed class"
      ).toHaveClass(/completed/);

      // Step 7: Click the edit button on 'Call dentist', change text to 'Call doctor', and click Save
      const callDentistTodo = page.locator(".todo-item", {
        hasText: "Call dentist",
      });
      await checksumAI("Click edit button on 'Call dentist' todo", async () => {
        await callDentistTodo.locator(".btn-icon").first().click();
      });
      // NOTE: After clicking edit, the text moves into an input value, so hasText filter no longer matches.
      // Use page-level selectors for the edit form since only one edit form is active at a time.
      const editInput = page.locator('.edit-form input[type="text"]');
      await checksumAI("Clear the edit input", async () => {
        await editInput.clear();
      });
      await checksumAI("Enter 'Call doctor' in edit input", async () => {
        await editInput.fill("Call doctor");
      });
      await checksumAI("Click Save button", async () => {
        await page.locator(".btn-save").click();
      });

      // Step 8: Verify the todo now displays 'Call doctor'
      await expect(
        page.locator(".todo-text", { hasText: "Call doctor" }),
        "Todo should now display 'Call doctor'"
      ).toBeVisible();
      await expect(
        page.locator(".todo-text", { hasText: "Call dentist" }),
        "Call dentist should no longer be visible"
      ).not.toBeVisible();

      // Step 9: Click the delete button on 'Buy milk'
      const buyMilkTodoAfterEdit = page.locator(".todo-item", {
        hasText: "Buy milk",
      });
      await checksumAI("Click delete button on 'Buy milk' todo", async () => {
        await buyMilkTodoAfterEdit.locator(".btn-icon.delete").click();
      });

      // Step 10: Verify 'Buy milk' is removed and only 'Call doctor' remains
      await expect(
        page.locator(".todo-item"),
        "Should have only 1 todo item remaining"
      ).toHaveCount(1);
      await expect(
        page.locator(".todo-text", { hasText: "Buy milk" }),
        "Buy milk todo should no longer be visible"
      ).not.toBeVisible();
      await expect(
        page.locator(".todo-text", { hasText: "Call doctor" }),
        "Call doctor todo should still be visible"
      ).toBeVisible();
    }
  );

  test(
    defineChecksumTest("Overdue Todo Display", "Ij9Kl"),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);

      // Step 2: Click on text input and type 'Overdue task'
      await checksumAI("Click on todo input", async () => {
        await page.locator("#todoInput").click();
      });
      await checksumAI("Enter 'Overdue task' in input", async () => {
        await page.locator("#todoInput").fill("Overdue task");
      });

      // Step 3: Click on date input and select a past date (yesterday)
      const yesterdayDate = getPastDateString(1);
      await checksumAI("Click on due date input", async () => {
        await page.locator("#dueDateInput").click();
      });
      await checksumAI("Set due date to yesterday", async () => {
        await page.locator("#dueDateInput").fill(yesterdayDate);
      });

      // Step 4: Click the 'Add' button
      await checksumAI("Click Add button", async () => {
        await page.locator(".btn-primary").click();
      });

      // Step 5: Verify the todo item appears with the due date visible
      const todoItem = page.locator(".todo-item");
      await expect(
        todoItem.locator(".todo-text"),
        "Todo item should display 'Overdue task' text"
      ).toHaveText("Overdue task");
      const todoDue = todoItem.locator(".todo-due");
      await expect(todoDue, "Due date should be visible").toBeVisible();
      const expectedDateDisplay = `Due: ${formatDateForDisplay(
        yesterdayDate
      )} (overdue)`;
      await expect(
        todoDue,
        "Due date should show expected format with overdue indicator"
      ).toContainText(expectedDateDisplay);

      // Step 6: Verify the due date element has the .overdue class applied
      await expect(todoDue, "Due date should have overdue class").toHaveClass(
        /overdue/
      );

      // Step 7: Verify the due date is displayed in red (overdue styling)
      // The .overdue class applies color: #dc2626 (red) per the CSS
      await expect(
        todoDue,
        "Due date should be displayed in red color"
      ).toHaveCSS("color", "rgb(220, 38, 38)");
    }
  );

  test(
    defineChecksumTest("Persistence After Refresh", "Kl1Mn"),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);

      // Step 2: Type 'Persistent task' and click Add button
      await checksumAI("Enter 'Persistent task' in input", async () => {
        await page.locator("#todoInput").fill("Persistent task");
      });
      await checksumAI("Click Add button", async () => {
        await page.locator(".btn-primary").click();
      });

      // Step 3: Verify the todo item is visible
      const todoItem = page.locator(".todo-item");
      await expect(
        todoItem.locator(".todo-text"),
        "Todo item should display 'Persistent task' text"
      ).toHaveText("Persistent task");

      // Step 4: Refresh the page
      await checksumAI("Refresh the page", async () => {
        await page.reload();
      });
      await page.waitForLoadState("domcontentloaded");

      // Step 5: Verify the todo item is still visible after refresh
      const todoItemAfterRefresh = page.locator(".todo-item");
      await expect(
        todoItemAfterRefresh.locator(".todo-text"),
        "Todo item should still display 'Persistent task' after refresh"
      ).toHaveText("Persistent task");

      // Step 6: Verify the todo maintains its unchecked state
      const checkbox = todoItemAfterRefresh.locator(".todo-checkbox");
      await expect(
        checkbox,
        "Checkbox should remain unchecked after refresh"
      ).not.toBeChecked();
      await expect(
        todoItemAfterRefresh,
        "Todo should not have completed class after refresh"
      ).not.toHaveClass(/completed/);
    }
  );

  test(
    defineChecksumTest("Special Characters", "Lm2No"),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);

      // Set up listener for any dialog that might appear (XSS test)
      let dialogAppeared = false;
      page.on("dialog", async (dialog) => {
        dialogAppeared = true;
        await dialog.dismiss();
      });

      // Step 2: Type text with special characters including XSS attempt
      const specialText =
        "Test <script>alert('XSS')</script> & \"quotes\" task";
      await checksumAI(
        "Enter text with special characters in input",
        async () => {
          await page.locator("#todoInput").fill(specialText);
        }
      );

      // Step 3: Click the Add button
      await checksumAI("Click Add button", async () => {
        await page.locator(".btn-primary").click();
      });

      // Step 4: Verify a new todo item appears in the todo list
      const todoItem = page.locator(".todo-item");
      await expect(todoItem, "Todo item should be visible").toBeVisible();

      // Step 5: Verify no JavaScript alert dialog appears (XSS prevention)
      // Wait a moment to ensure any potential XSS would have triggered
      await page.waitForTimeout(500);
      expect(dialogAppeared, "No dialog should appear (XSS prevention)").toBe(
        false
      );

      // Step 6: Verify the special characters are displayed correctly as literal characters
      // The app uses escapeHtml() to safely render special characters
      const todoText = todoItem.locator(".todo-text");
      await expect(
        todoText,
        "Special characters should be displayed correctly"
      ).toHaveText(specialText);
    }
  );

  test(
    defineChecksumTest("Toggle Todo Complete", "De4Fg"),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);

      // Step 2: Type 'Toggle this task' and click Add button
      await checksumAI("Enter 'Toggle this task' in input", async () => {
        await page.locator("#todoInput").fill("Toggle this task");
      });
      await checksumAI("Click Add button", async () => {
        await page.locator(".btn-primary").click();
      });

      // Step 3: Verify the todo item is visible with unchecked checkbox and no strikethrough
      const todoItem = page.locator(".todo-item");
      await expect(
        todoItem.locator(".todo-text"),
        "Todo item should display 'Toggle this task' text"
      ).toHaveText("Toggle this task");
      const checkbox = todoItem.locator(".todo-checkbox");
      await expect(
        checkbox,
        "Checkbox should initially be unchecked"
      ).not.toBeChecked();
      await expect(
        todoItem,
        "Todo should not have completed class initially"
      ).not.toHaveClass(/completed/);

      // Step 4: Click the checkbox to mark as complete
      await checksumAI("Click checkbox to mark as complete", async () => {
        await checkbox.click();
      });

      // Step 5: Verify checkbox is checked and todo has strikethrough styling (.completed class)
      await expect(checkbox, "Checkbox should be checked").toBeChecked();
      await expect(todoItem, "Todo should have completed class").toHaveClass(
        /completed/
      );

      // Step 6: Click the checkbox again to uncheck
      await checksumAI("Click checkbox to unmark as complete", async () => {
        await checkbox.click();
      });

      // Step 7: Verify checkbox is unchecked and strikethrough styling is removed
      await expect(
        checkbox,
        "Checkbox should be unchecked after toggle"
      ).not.toBeChecked();
      await expect(
        todoItem,
        "Todo should not have completed class after toggle"
      ).not.toHaveClass(/completed/);
    }
  );

  test(
    defineChecksumTest("Delete Confirmation Cancel", "Qr5St"),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);

      // Step 2: Add a todo item
      await addTodo(page, checksumAI, "Task to keep");

      // Step 3: Verify the todo item is visible
      const todoItem = page.locator(".todo-item");
      await expect(
        todoItem.locator(".todo-text"),
        "Todo item should display 'Task to keep' text"
      ).toHaveText("Task to keep");

      // Step 4: Click the delete button to trigger the confirmation modal
      await checksumAI("Click the delete button", async () => {
        await todoItem.locator(".btn-icon.delete").click();
      });

      // Step 5: Verify the confirmation modal appears with 'Are you sure?' message
      const modal = page.locator(".modal-overlay");
      await expect(modal, "Confirmation modal should be visible").toBeVisible();
      await expect(
        modal.locator(".modal p"),
        "Modal should display 'Are you sure?' message"
      ).toHaveText("Are you sure?");

      // Step 6: Click the 'No' button to cancel deletion
      await checksumAI("Click the 'No' button to cancel deletion", async () => {
        await modal.locator(".btn-no").click();
      });

      // Step 7: Verify the modal is closed
      await expect(
        page.locator(".modal-overlay"),
        "Confirmation modal should be closed after clicking No"
      ).not.toBeVisible();

      // Step 8: Verify the todo item is still visible (was NOT deleted)
      await expect(
        page.locator(".todo-item"),
        "Todo item should still exist after canceling deletion"
      ).toBeVisible();
      await expect(
        page.locator(".todo-item .todo-text"),
        "Todo text should still display 'Task to keep'"
      ).toHaveText("Task to keep");
    }
  );
});
