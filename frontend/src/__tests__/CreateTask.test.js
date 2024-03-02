import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateTask from "./CreateTask";
import axios from "axios";
import jest from "@testing-library/jest-dom";
import { describe, test, beforeEach, expect } from "@jest/globals";

jest.mock("axios");

describe("CreateTask component", () => {
  beforeEach(() => {
    render(<CreateTask />);
  });

  test("renders title input", () => {
    const titleInput = screen.getByPlaceholderText("Title");
    expect(titleInput).toBeInTheDocument();
  });

  test("renders description textarea", () => {
    const descriptionTextarea = screen.getByPlaceholderText("Description");
    expect(descriptionTextarea).toBeInTheDocument();
  });

  test("renders due date input", () => {
    const dueDateInput = screen.getByPlaceholderText("Due Date");
    expect(dueDateInput).toBeInTheDocument();
  });

  test("renders priority select", () => {
    const prioritySelect = screen.getByRole("combobox");
    expect(prioritySelect).toBeInTheDocument();
  });

  test("calls handleSubmit on form submit", async () => {
    const mockData = {
      data: {
        taskId: "123456",
      },
    };
    axios.post.mockResolvedValue(mockData);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "Test Task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByPlaceholderText("Due Date"), {
      target: { value: "2024-03-03" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "High" },
    });

    fireEvent.click(screen.getByText("Create Task"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith("/api/task/create", {
        title: "Test Task",
        description: "Test Description",
        dueDate: "2024-03-03",
        priority: "High",
      });
    });

    expect(screen.getByText("Task Created Successfully!!")).toBeInTheDocument();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "taskInfo",
      JSON.stringify(mockData.data)
    );
  });
});
