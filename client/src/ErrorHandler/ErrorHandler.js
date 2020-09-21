import React from "react";

import Modal from "../UI/Modal/Modal";
import styles from "./ErrorHandler.module.css";

const ErrorHandler = (WrappedComponent, axios, mode) => {
  return class Covered extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        Error: null,
        pageFailed: false,
      };

      this.requestInc = axios.interceptors.request.use((reqConfig) => {
        //this.setState({ pageFailed: false });                                            Using this statement will make Wrapped Component to update without any prop changes. so,if ComponentDidUpdate is used to send async request, then that wrapped component should be PureComponent, Otherwise Infinite Loop will be created.
        return reqConfig;
      }, this.errorHandler);

      this.responseInc = axios.interceptors.response.use((resConfig) => {
        this.setState({ pageFailed: false, Error: null });
        return resConfig;
      }, this.errorHandler);
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.requestInc);
      axios.interceptors.response.eject(this.responseInc);
    }

    errorHandler = (err) => {
      if (err.response) {
        const errors = err.response.data.message;
        this.setState({ Error: errors, pageFailed: true });
      } else {
        this.setState({ Error: err.message, pageFailed: true });
      }
      return Promise.reject(err);
    };

    ErrorBackdropHandler = () => {
      if (mode === "retry") {
        this.setState({ Error: null });
      } else {
        this.setState({ Error: null, pageFailed: false });
      }
    };

    render() {
      let childComponent = <WrappedComponent {...this.props} />;
      if (this.state.pageFailed && mode === "retry") {
        childComponent = (
          <button
            className={styles.Success}
            onClick={() => this.setState({ pageFailed: false })}
          >
            RETRY
          </button>
        );
      }
      return (
        <React.Fragment>
          <Modal
            show={this.state.Error}
            modalclosed={this.ErrorBackdropHandler}
          >
            {this.state.Error}
          </Modal>
          {childComponent}
        </React.Fragment>
      );
    }
  };
};

export default ErrorHandler;
