import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import TaskContext from "../../context/TaskContext";
import TokenContext from "../../context/TokenContext.js";
import axios from "../../Axios/axios.js";
import "./createTask.css";

function CreateTask() {
  const { dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext);
  const { register, handleSubmit, reset, setValue } = useForm();


  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/task/addTask", data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      dispatch({
        type: "ADD_TASK",
        title: data.title,
        description: data.description,
      });
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="addContainer md:w-1/3 md:mx-auto mx-3 mt-3 flex justify-center">
      <div className="w-11/12">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="title">Title</label>
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
            <label htmlFor="description">Description</label>
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
              type="submit"
              className="bg-blue-700 rounded-md text-white px-5 py-1"
            >
              "Add"
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
