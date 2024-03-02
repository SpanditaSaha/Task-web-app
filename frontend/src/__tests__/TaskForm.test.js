import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import TaskForm from "./TaskForm";
import jest from "@testing-library/jest-dom";
import { describe, test, expect } from "@jest/globals";

describe("TaskForm component", () => {
  const task = {
    _id: "1",
    title: "Test Task",
    description: "Test Description",
    collaborators: ["userId1", "userId2"],
  };
  const updateTaskMock = jest.fn();
  const userId = "userId1";

  test("renders TaskForm component", () => {
    render(
      <TaskForm task={task} updateTask={updateTaskMock} userId={userId} />
    );
    const titleInput = screen.getByLabelText("Title");
    const descriptionTextarea = screen.getByLabelText("Description");
    const updateButton = screen.getByText("Update Task");

    expect(titleInput).toBeInTheDocument();
    expect(descriptionTextarea).toBeInTheDocument();
    expect(updateButton).toBeInTheDocument();
  });

  test("updates task when form is submitted by collaborator", async () => {
    render(
      <TaskForm task={task} updateTask={updateTaskMock} userId={userId} />
    );
    const titleInput = screen.getByLabelText("Title");
    const descriptionTextarea = screen.getByLabelText("Description");
    const updateButton = screen.getByText("Update Task");

    fireEvent.change(titleInput, { target: { value: "Updated Test Task" } });
    fireEvent.change(descriptionTextarea, {
      target: { value: "Updated Test Description" },
    });

    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(updateTaskMock).toHaveBeenCalledTimes(1);
      expect(updateTaskMock).toHaveBeenCalledWith(
        task._id,
        {
          title: "Updated Test Task",
          description: "Updated Test Description",
        },
        userId
      );
    });
  });

  test("shows error message when non-collaborator tries to update task", () => {
    const nonCollaboratorUserId = "nonCollaboratorUserId";
    render(
      <TaskForm
        task={task}
        updateTask={updateTaskMock}
        userId={nonCollaboratorUserId}
      />
    );
    const updateButton = screen.getByText("Update Task");

    fireEvent.click(updateButton);

    const errorMessage = screen.getByText("You are not a collaborator!!");
    expect(errorMessage).toBeInTheDocument();
    expect(updateTaskMock).not.toHaveBeenCalled();
  });
});
