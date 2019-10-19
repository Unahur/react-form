import React, {Component} from 'react';
import {Col} from 'react-bootstrap';
import {FormGroup, FormLabel, FormControl, FormText} from 'react-bootstrap';

class Select extends Component {

  constructor(props) {
    super(props);

    this.size = this.props.size || 12;
  }


  render() {
    var options = this.props.options.map(option => {
      return (<option key={option.value} value={option.value}>{option.label}</option>)
    })

    return (
      <Col md={this.size}>
        
        <FormGroup as={Col} controlId="formControlsSelect" validationState={this.props.error.status}>
          <FormLabel>
            {this.props.label}
            <span className="form-text">
              {this.props.helpText}
            </span>
          </FormLabel>
          <FormControl as="select">
            {options}
          </FormControl>
          <FormControl.Feedback />
          <FormText>{this.props.error.message}</FormText>
        </FormGroup>

      </Col>
    );
  }
}

export default Select;