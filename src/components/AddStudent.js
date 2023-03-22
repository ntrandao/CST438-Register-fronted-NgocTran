import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


// properties addCoure is required, function called when Add clicked.
class AddStudent extends Component {
      constructor(props) {
      super(props);
      this.state = { open: false, name: "", email:"" };
      // this.state = {open: false, student:{ } };
       this.handleChange = this.handleChange.bind(this)
    };
    
    handleClickOpen = () => {
      this.setState( {open:true} );
    };

    handleClose = () => {
      this.setState( {open:false} );
    };

    handleChange(event){
      const name = event.target.name;
      this.setState({[name]:event.target.value});
    }
    // handleChange = (event) => {
    //   this.setState({course:{course_id: event.target.value}});
    // }

  // Save course and close modal form
    handleAdd = () => {
       this.props.addStudent(this.state);
       this.handleClose();
    }

    render()  { 
      return (
          <div>
            <Button variant="outlined" color="primary" style={{margin: 10}} onClick={this.handleClickOpen}>
              Add Student
            </Button>
            <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle>Add Student</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                  {/* <TextField autoFocus fullWidth label="Student Id" name="student_id" onChange={this.handleChange}  />  */}
                  <TextField
              name = "email"
              label = "email"
              type = "text"
              value = {this.state.email}
              onChange = {this.handleChange}
              >
                  
              </TextField>
              <TextField
                name = "name"
                label = "name"
                type = "text"
                value = {this.state.name}
                onChange = {this.handleChange}
                >
                </TextField>
                </DialogContent>
                <DialogActions>
                  <Button color="secondary" onClick={this.handleClose}>Cancel</Button>
                  <Button id="Add" color="primary" onClick={this.handleAdd}>Add</Button>
                </DialogActions>
              </Dialog>      
          </div>
      ); 
    }
}

// required property:  addStudent is a function to call to perform the Add action
AddStudent.propTypes = {
  addStudent : PropTypes.func.isRequired
}

export default AddStudent;