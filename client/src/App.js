import React from "react";
import axios from "axios";

import styles from "./App.module.css";
import Modal from "./UI/Modal/Modal";
import ErrorHandler from "./ErrorHandler/ErrorHandler";
import Spinner from "./Spinner/Spinner";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      name: "",
      priority: 0,
      status: 0,
      dueDate: Date.now(),
      loading: true,
      showModal: false,
      showStatus: false,
      selectedName: "",
      selectedStatus: 0,
      modalLoading: false,
    };
  }
  componentDidMount() {
    axios
      .get("/home/alltasks")
      .then((response) => {
        if (response.status !== 201 && response.status !== 200) {
          throw response.data.message;
        }
        this.setState({ tasks: response.data.tasks, loading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
      });
  }
  getDateString(t, type) {
    t = new Date(t);
    let dd = t.getDate();
    let mm = t.getMonth() + 1;
    let yyyy = t.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    if (type === 0) {
      return dd + "/" + mm + "/" + yyyy;
    } else {
      return yyyy + "-" + mm + "-" + dd;
    }
  }
  getPriority(t) {
    if (typeof t === "string") {
      t = parseInt(t);
    }
    if (t === 0) {
      return "LOW";
    }
    if (t === 1) {
      return "NORMAL";
    }
    if (t === 2) {
      return "HIGH";
    }
  }
  getStatus(t) {
    if (t === 0) {
      return "TODO";
    }
    if (t === 1) {
      return "REVIEW";
    }
    if (t === 2) {
      return "COMPLETED";
    }
  }

  initiateCreateTask = (e) => {
    e.preventDefault();
    this.setState({ showModal: true });
  };

  closeModalHandler = (e) => {
    e.preventDefault();
    this.setState({ showModal: false, showStatus: false });
  };

  inputChangeHandler = (e) => {
    let prop = e.target.name;
    let val = e.target.value;
    if (prop === "dueDate") {
      val = Date.parse(val);
    }
    this.setState({ [prop]: val });
  };

  submissionHandler = (e) => {
    e.persist();
    this.setState({ modalLoading: true });
    axios
      .put(
        "/home/createtask",
        JSON.stringify({
          name: this.state.name,
          priority: this.state.priority,
          dueDate: this.state.dueDate,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw response.data.message;
        }
        let len = this.state.tasks.length;
        let i = 0;
        const tasks = [];
        while (i < len) {
          if (this.state.tasks[i].dueDate < this.state.dueDate) {
            tasks.push(this.state.tasks[i]);
          } else {
            break;
          }
          i++;
        }
        tasks.push({
          name: this.state.name,
          priority: this.state.priority,
          dueDate: this.state.dueDate,
          createdAt: Date.now(),
          status: 0,
        });
        while (i < len) {
          tasks.push(this.state.tasks[i]);
          i++;
        }
        this.setState({
          tasks: tasks,
          showModal: false,
          modalLoading: false,
          name: "",
          priority: 0,
          dueDate: Date.now(),
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ showModal: false, modalLoading: false });
      });
  };

  changeStatusHandler = (value) => {
    this.setState({ modalLoading: true });
    axios
      .post(
        "/home/editstatus",
        JSON.stringify({
          name: this.state.selectedName,
          status: value,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status !== 200 && response.status !== 201) {
          throw response.data.message;
        }
        let tasks = [...this.state.tasks];
        let i = 0,
          len = this.state.tasks.length;
        while (i < len) {
          if (tasks[i].name === this.state.selectedName) {
            tasks[i].status = value;
            break;
          }
          i++;
        }
        this.setState({ tasks: tasks, showStatus: false, modalLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ showStatus: false, modalLoading: false });
      });
  };

  initiateStateChange = (e, name) => {
    let i = 0,
      len = this.state.tasks.length;
    let status = 0;
    while (i < len) {
      if (this.state.tasks[i].name === name) {
        status = this.state.tasks[i].status;
      }
      i++;
    }
    this.setState({
      selectedName: name,
      showStatus: true,
      selectedStatus: status,
    });
  };

  render() {
    let tasks = [];
    if (this.state.tasks.length) {
      tasks = [];
      this.state.tasks.forEach((task, index) => {
        const p = this.getPriority(task.priority);
        const s = this.getStatus(task.status);
        const ele = (
          <div key={index} className={styles.Card}>
            <div>
              <h3 className={styles.Title}>
                <u>{task.name}</u>
              </h3>
              <p className={[styles.Status, styles[s]].join(" ")}>
                <strong>{s}</strong>
              </p>
            </div>
            <p>Created At: {this.getDateString(task.createdAt, 0)}</p>
            <p>Due Date: {this.getDateString(new Date(task.dueDate), 0)}</p>
            <div>
              <p className={[styles.Priority, styles[p]].join(" ")}>
                <strong>{p} PRIORITY</strong>
              </p>
              <button
                className={styles.changeStatus}
                onClick={(e) => this.initiateStateChange(e, task.name)}
              >
                Change Status
              </button>
            </div>
          </div>
        );
        tasks.push(ele);
      });
    } else {
      tasks = <p className={styles.Card}>No tasks set for now!</p>;
    }
    if (this.state.loading) {
      return (
        <p className={styles.Card}>
          <Spinner />
        </p>
      );
    }
    return (
      <React.Fragment>
        <Modal
          show={this.state.showStatus}
          modalclosed={this.closeModalHandler}
        >
          {this.state.modalLoading ? (
            <Spinner />
          ) : (
            <div className={styles.StatusFields}>
              <button
                onClick={() => this.changeStatusHandler(0)}
                className={[styles.StatusChange, styles.TODO].join(" ")}
                style={{
                  display:
                    this.state.selectedStatus === 0 ? "none" : "inline-block",
                }}
              >
                TODO
              </button>
              <button
                onClick={() => this.changeStatusHandler(1)}
                className={[styles.StatusChange, styles.REVIEW].join(" ")}
                style={{
                  display:
                    this.state.selectedStatus === 1 ? "none" : "inline-block",
                }}
              >
                <strong>REVIEW</strong>
              </button>
              <button
                onClick={() => this.changeStatusHandler(2)}
                className={[styles.StatusChange, styles.COMPLETED].join(" ")}
                style={{
                  display:
                    this.state.selectedStatus === 2 ? "none" : "inline-block",
                }}
              >
                <strong>COMPLETED</strong>
              </button>
            </div>
          )}
        </Modal>
        <Modal show={this.state.showModal} modalclosed={this.closeModalHandler}>
          {this.state.modalLoading ? (
            <Spinner />
          ) : (
            <React.Fragment>
              <div className={styles.Fields}>
                <label htmlFor="name">Task Name</label>
                <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.inputChangeHandler}
                  id="name"
                />
              </div>
              <div className={styles.Fields}>
                <label htmlFor="dueDate">Due Date: </label>
                <input
                  type="date"
                  name="dueDate"
                  value={this.getDateString(this.state.dueDate, 1)}
                  min={this.getDateString(Date.now(), 1)}
                  onChange={this.inputChangeHandler}
                  id="dueDate"
                />
              </div>
              <div className={styles.Fields}>
                <label htmlFor="priority">Priority: </label>
                <select
                  id="priority"
                  name="priority"
                  onChange={this.inputChangeHandler}
                >
                  <option value={0}>LOW</option>
                  <option value={1}>NORMAL</option>
                  <option value={2}>HIGH</option>
                </select>
              </div>
              <div className={styles.Fields}>
                <button
                  className={styles.Cancel}
                  onClick={this.closeModalHandler}
                >
                  <strong>CANCEL</strong>
                </button>
                <button
                  className={styles.Submit}
                  onClick={this.submissionHandler}
                >
                  <strong>SUBMIT</strong>
                </button>
              </div>
            </React.Fragment>
          )}
        </Modal>
        <div className={styles.First}>
          <button
            className={styles.CreateTask}
            onClick={this.initiateCreateTask}
          >
            Create Task
          </button>
        </div>
        {tasks}
      </React.Fragment>
    );
  }
}

export default ErrorHandler(App, axios);
