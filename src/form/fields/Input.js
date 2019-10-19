import React, {Component} from 'react';
import {Col} from 'react-bootstrap';
import {FormGroup, FormLabel, FormControl, FormText} from 'react-bootstrap';

class Input extends Component {

  constructor(props) {
    super(props);

    this.size = this.props.size || 12;
  }


  render() {
    return (
      <Col md={this.size}>
        <FormGroup
          controlId="formBasicText"
          validationState={this.props.error.status}
        >
          <FormLabel>
            {this.props.label}
            <span className="form-text">
              {this.props.helpText}
            </span>
          </FormLabel>
          <FormControl
            type={this.props.type}
            value={this.props.value}
            name={this.props.name}
            onChange={this.props.onChange}
            className={this.props.className}
            onBlur={this.props.validate}
          />
          <FormControl.Feedback />
            <FormText>{this.props.error.message}</FormText>
          </FormGroup>
      </Col>
    );
  }
}

export default Input;