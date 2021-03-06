import React from 'react';
import PropTypes from 'prop-types';

export default class FormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { show: false, submitting: false };
    this.handleChange = this.handleChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideButtons = this.hideButtons.bind(this);
  }

  handleChange() {
    this.props.onChange();
    if (this.state.show === false) {
      this.setState({ show: true });
    }
  }

  handleReset(e) {
    e.preventDefault();
    this.props.onReset();
    this.hideButtons();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitting: true });
    Promise.resolve(this.props.onSubmit())
      .then(() => {
        this.setState({ submitting: false });
        this.hideButtons();
      }).catch(error => console.error(error));
  }

  hideButtons() {
    if (this.state.submitting) {
      this.setState({ show: false, submitting: false });
    }

    this.setState({ show: false });
  }

  render() {
    return (
      <form className="form" onChange={this.handleChange}>
        {this.props.children}
        {this.state.show &&
          <div>
            <button
              type="submit"
              disabled={this.props.disabledSubmit || this.state.submitting}
              onClick={this.handleSubmit}
            >
              {this.props.submitLabel}
            </button>
            <button type="reset" disabled={this.state.submitting} onClick={this.handleReset}>{this.props.resetLabel}</button>
          </div>}
      </form>
    );
  }
}

FormContainer.defaultProps = {
  disabledSubmit: false,
  onChange: () => {},
  onReset: () => {},
  onSubmit: () => {},
  resetLabel: 'Cancel',
  submitLabel: 'Save',
};

FormContainer.propTypes = {
  children: PropTypes.node,
  disabledSubmit: PropTypes.bool,
  onChange: PropTypes.func,
  onReset: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  resetLabel: PropTypes.string,
  submitLabel: PropTypes.string,
};
