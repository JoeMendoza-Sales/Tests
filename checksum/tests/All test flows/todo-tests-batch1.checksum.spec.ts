import { init, IChecksumPage } from "@checksum-ai/runtime";

const { test, defineChecksumTest, expect, checksumAI } = init();

const BASE_URL = 'https://joetodoapp-a03b4.web.app/';

// Helper: Clear localStorage and navigate to the app
async function setupTest(page: IChecksumPage, checksumAI: Function): Promise<void> {
  await checksumAI("Navigate to the Todo app", async () => {
    await page.goto(BASE_URL);
  });
  await page.evaluate(() => localStorage.clear());
  await checksumAI("Reload page after clearing localStorage", async () => {
    await page.reload();
  });
  await page.waitForLoadState('domcontentloaded');
}

// Helper: Add a todo item with optional due date
async function addTodo(page: IChecksumPage, checksumAI: Function, text: string, dueDate?: string): Promise<void> {
  await checksumAI(`Enter todo text: ${text}`, async () => {
    await page.locator('#todoInput').fill(text);
  });
  if (dueDate) {
    await checksumAI(`Set due date to ${dueDate}`, async () => {
      await page.locator('#dueDateInput').fill(dueDate);
    });
  }
  await checksumAI("Click Add button", async () => {
    await page.locator('.btn-primary').click();
  });
}

// Helper: Get a future date string in yyyy-mm-dd format for date input
function getFutureDateString(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper: Format date from yyyy-mm-dd to mm/dd/yy (app's display format)
function formatDateForDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${month}/${day}/${year.slice(-2)}`;
}

test.describe('Todo Application Tests', () => {
  
  test(
    defineChecksumTest('Add Todo Basic', 'Ab1Cd'),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);
      
      // Step 2: Verify the empty state message is displayed
      await expect(
        page.locator('.empty-state'),
        "Empty state message should be displayed initially"
      ).toHaveText('No todos yet. Add one above!');
      
      // Step 3 & 4: Type 'Buy groceries' and click Add button
      await addTodo(page, checksumAI, 'Buy groceries');
      
      // Step 5: Verify a new todo item appears with text 'Buy groceries'
      const todoItem = page.locator('.todo-item');
      await expect(
        todoItem.locator('.todo-text'),
        "Todo item should display 'Buy groceries' text"
      ).toHaveText('Buy groceries');
      
      // Step 6: Verify the todo item has an unchecked checkbox
      const checkbox = todoItem.locator('.todo-checkbox');
      await expect(checkbox, "Checkbox should be visible").toBeVisible();
      await expect(checkbox, "Checkbox should be unchecked").not.toBeChecked();
      
      // Step 7: Verify the empty state message is no longer visible
      await expect(
        page.locator('.empty-state'),
        "Empty state message should not be visible after adding todo"
      ).not.toBeVisible();
    }
  );

  test(
    defineChecksumTest('Add Todo With Due Date', 'Bc2De'),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);
      
      // Step 2: Type 'Submit project report' in the input
      const todoText = 'Submit project report';
      
      // Step 3: Select a future date (7 days from today)
      const futureDateStr = getFutureDateString(7);
      
      // Step 4: Add the todo with due date
      await addTodo(page, checksumAI, todoText, futureDateStr);
      
      // Step 5: Verify a new todo item appears with text 'Submit project report'
      const todoItem = page.locator('.todo-item');
      await expect(
        todoItem.locator('.todo-text'),
        "Todo item should display 'Submit project report' text"
      ).toHaveText(todoText);
      
      // Step 6: Verify the due date is displayed with correct format
      const todoDue = todoItem.locator('.todo-due');
      const expectedDateDisplay = `Due: ${formatDateForDisplay(futureDateStr)}`;
      await expect(
        todoDue,
        "Due date should be displayed in correct format"
      ).toContainText(expectedDateDisplay);
      
      // Step 7: Verify the due date does NOT have the .overdue class
      await expect(
        todoDue,
        "Due date should not have overdue class for future date"
      ).not.toHaveClass(/overdue/);
    }
  );

  test(
    defineChecksumTest('Delete Todo', 'Cd3Ef'),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);
      
      // Step 2: Add a todo item
      await addTodo(page, checksumAI, 'Task to delete');
      
      // Step 3: Verify the todo item is visible
      const todoItem = page.locator('.todo-item');
      await expect(
        todoItem.locator('.todo-text'),
        "Todo item should display 'Task to delete' text"
      ).toHaveText('Task to delete');
      
      // Step 4: Click the delete button
      await checksumAI("Click the delete button", async () => {
        await todoItem.locator('.btn-icon.delete').click();
      });

      // Step 5: Verify the confirmation modal appears and click 'Yes' to confirm
      const modal = page.locator('.modal-overlay');
      await expect(modal, "Confirmation modal should be visible").toBeVisible();
      await checksumAI("Click 'Yes' to confirm deletion", async () => {
        await modal.locator('.btn-yes').click();
      });
      
      // Step 6: Verify the todo is removed and empty state is displayed
      await expect(
        page.locator('.todo-item'),
        "Todo item should be removed after deletion"
      ).not.toBeVisible();
      await expect(
        page.locator('.empty-state'),
        "Empty state message should be displayed after deleting all todos"
      ).toHaveText('No todos yet. Add one above!');
    }
  );

  test(
    defineChecksumTest('Edit Todo Cancel', 'Hi8Jk'),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);
      
      // Step 2: Add a todo item
      await addTodo(page, checksumAI, 'Do not change me');
      
      // Step 3: Verify the todo item is visible
      const todoItem = page.locator('.todo-item');
      await expect(
        todoItem.locator('.todo-text'),
        "Todo item should display 'Do not change me' text"
      ).toHaveText('Do not change me');
      
      // Step 4: Click the edit button (first .btn-icon, which is the pencil/edit button)
      await checksumAI("Click the edit button", async () => {
        await todoItem.locator('.btn-icon').first().click();
      });
      
      // Step 5: Clear the text input and type new text
      const editInput = todoItem.locator('.edit-form input[type="text"]');
      await checksumAI("Clear the edit input", async () => {
        await editInput.clear();
      });
      await checksumAI("Type new text that should be discarded", async () => {
        await editInput.fill('This should be discarded');
      });
      
      // Step 6: Click the Cancel button
      await checksumAI("Click the Cancel button", async () => {
        await todoItem.locator('.btn-cancel').click();
      });
      
      // Step 7: Verify the todo text still displays 'Do not change me'
      await expect(
        page.locator('.todo-item .todo-text'),
        "Todo text should remain unchanged after canceling edit"
      ).toHaveText('Do not change me');
    }
  );
});
