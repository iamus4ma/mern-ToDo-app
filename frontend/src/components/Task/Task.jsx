import React, { useState } from "react";
import moment from "moment";
import "./task.css";
import { useContext } from "react";
import TaskContext from "../../context/TaskContext";
import TokenContext from "../../context/TokenContext";
import axios from "../../Axios/axios.js";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useForm } from "react-hook-form";

function Task({ task, id }) {
  const { dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext);
  const [isEdit, setIsEdit] = useState(false);

  const handleRemove = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete(`/task/removeTask/${task._id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      dispatch({ type: "REMOVE_TASK", id });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setIsEdit(true);
    setValue("title", task?.title);
    setValue("description", task?.description);
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    setIsEdit(false);
    reset();
  };
  const handleMarkDone = async (e) => {
    const completedValue = e.target.checked;

    const payload = {
      title: task.title,
      description: task.description,
      completed: completedValue,
    };

    try {
      const res = await axios.put(`/task/updateTask/${task._id}`, payload, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Dispatch action to update the task locally
      dispatch({
        type: "MARK_DONE",
        id,
      });

      // Fetch tasks again after updating
      const updatedRes = await axios.get("/task/getTask", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      dispatch({ type: "SET_TASK", payload: updatedRes.data });

      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  const { register, handleSubmit, reset, setValue } = useForm();
  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      completed: task.completed,
    };
    try {
      const res = await axios.put(`/task/updateTask/${task._id}`, payload, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      // Fetch tasks again after updating
      const updatedRes = await axios.get("/task/getTask", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      dispatch({ type: "SET_TASK", payload: updatedRes.data });

      setIsEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-slate-300 py-4 rounded-lg shadow-md flex items-center justify-center gap-2 mb-3">
        <div className="mark-done px-2">
          <input
            type="checkbox"
            className="checkbox"
            onChange={(e) => handleMarkDone(e)}
            checked={task.completed}
          />
        </div>
        <div className="task-info text-slate-900 text-sm w-10/12">
          <h4 className="task-title text-lg capitalize">{task.title}</h4>
          <p className="task-description">{task.description}</p>
          <div className=" italic opacity-60">
            {task?.createdAt ? (
              <p>{moment(task.createdAt).fromNow()}</p>
            ) : (
              <p>just now</p>
            )}
          </div>
        </div>
        <div className="remove-task text-sm text-white flex gap-2 px-3">
          <EditIcon
            style={{ fontSize: 30, cursor: "pointer" }}
            size="large"
            onClick={handleEdit}
            className="remove-task-btn bg-blue-700 rounded-full border-2 shadow-2xl border-white p-1"
          />
          <DeleteIcon
            style={{ fontSize: 30, cursor: "pointer" }}
            size="large"
            onClick={handleRemove}
            className="remove-task-btn bg-blue-700 rounded-full border-2 shadow-2xl border-white p-1"
          />
        </div>
      </div>
      {isEdit === true && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="title">New Title</label>
            <input
              type="text"
              name="title"
              id="title"
              required
              {...register("title")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="my-3">
            <label htmlFor="description">New Description</label>
            <textarea
              rows={5}
              name="description"
              id="description"
              required
              {...register("description")}
              style={{ resize: "none" }}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="btn"
              onClick={handleCancel}
              className="bg-red-700 rounded-md text-white px-5 py-1 mr-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-700 rounded-md text-white px-5 py-1"
            >
              Update
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default Task;
