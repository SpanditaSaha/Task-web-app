import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import MyTasks from "./MyTasks";
import jest from "@testing-library/jest-dom";
import { describe, test, expect } from "@jest/globals";

jest.mock("axios");

describe("MyTasks component", () => {
  test("renders MyTasks component", async () => {
    const mockedTasks = [
      { id: 1, title: "Task 1", progress: "completed" },
      { id: 2, title: "Task 2", progress: "inprogress" },
    ];

    axios.get.mockResolvedValueOnce({ data: { tasks: mockedTasks } });

    const { getByText } = render(<MyTasks />);

    await waitFor(() => {
      expect(getByText("Task 1")).toBeInTheDocument();
      expect(getByText("Task 2")).toBeInTheDocument();
    });

    expect(getByText("Progress")).toBeInTheDocument();
  });

  test("handles task status change", async () => {
    const mockedTasks = [
      { id: 1, title: "Task 1", progress: "completed" },
      { id: 2, title: "Task 2", progress: "inprogress" },
    ];

    axios.get.mockResolvedValueOnce({ data: { tasks: mockedTasks } });
    axios.get.mockResolvedValueOnce({ data: { success: true } });

    const { getByText, getByTestId } = render(<MyTasks />);

    await waitFor(() => {
      expect(getByText("Task 1")).toBeInTheDocument();
      expect(getByText("Task 2")).toBeInTheDocument();
    });

    fireEvent.click(getByTestId("task-2-checkbox"));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "/api/task/2/completed",
        expect.any(Object)
      );
    });
  });
});
