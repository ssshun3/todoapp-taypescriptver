import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAlertHandlerContext } from "../../../contexts/alert_handler";
import COLOR from "../../../variables/color";
import AddTaskButton from "../../Atoms/AddTaskButton";
import Task from "../../Molecules/Task";

interface TaskType {
  name: string;
  initializing: boolean;
}

interface AlertHandlerContextType {
  setAlert: (errorText: string) => void;
}

const TodoCard = () => {
  const [taskList, setTaskList] = useState<TaskType[]>([]);
  const AlertHandlerContext =
    useAlertHandlerContext() as AlertHandlerContextType;

  const onAddTaskButtonClick = () => {
    const newTask: TaskType = {
      name: "",
      initializing: true,
    };
    setTaskList(taskList.concat(newTask));
  };

  const onTaskComplete = (index: number) => {
    let newTaskList = taskList.filter((_, idx) => idx !== index);
    setTaskList(newTaskList);
  };

  const onTaskNameChange = (value: string, index: number) => {
    let newTaskList = [...taskList];
    if (value === "") {
      newTaskList.splice(index, 1);
      AlertHandlerContext.setAlert("タスクの名前が設定されていません。");
    } else {
      newTaskList.splice(index, 1, {
        name: value,
        initializing: false,
      });
    }
    setTaskList(newTaskList);
  };

  useEffect(() => {
    const currentTaskList = JSON.parse(
      localStorage.getItem("tasklist") || "[]"
    );
    if (currentTaskList === null) return;
    setTaskList(currentTaskList);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasklist", JSON.stringify(taskList));
  }, [taskList]);

  return (
    <StyledWrapper>
      <AddTaskButton onClick={onAddTaskButtonClick} />
      <StyledTaskList>
        {taskList.map((task, index) => (
          <Task
            key={index}
            onTaskComplete={() => onTaskComplete(index)}
            onTaskNameChange={value => onTaskNameChange(value, index)}
            taskName={task.name}
            defaultIsEditing={task.initializing}
          />
        ))}
      </StyledTaskList>
    </StyledWrapper>
  );
};
export default TodoCard;

const StyledWrapper = styled.div`
  background-color: ${COLOR.LIGHT_BLACK};
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StyledTaskList = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;

  & > * {
    margin-top: 10px;
  }
`;
