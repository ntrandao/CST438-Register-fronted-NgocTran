import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import {SERVER_URL} from '../constants.js'
import Grid from '@mui/material/Grid';
import {DataGrid} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddStudent from './AddStudent';
import { TextField } from '@mui/material';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 
//

// properties year, semester required
//  
//  NOTE: because SchedList is invoked via <Route> in App.js  
//  props are passed in props.location

class StudentList extends Component {
  constructor(props) {
    super(props);
    this.state = { name: "", email:"" };
    // this.handleChange = this.handleChange.bind(this)
  } 
  // handleChange(event){
  //   const name = event.target.name;
  //   this.setState({[name]:event.target.value});
  // }
  
  componentDidMount() {
    this.fetchStudent();
  }
  
  fetchStudent = () => {
    console.log("StudentList.fetchStudent");
    const token = Cookies.get('XSRF-TOKEN');
    
    fetch(`${SERVER_URL}/student?email=${this.props.location.email}`, 
      {  
        method: 'GET', 
        headers: { 'X-XSRF-TOKEN': token }
      } )
    .then((response) => {
      console.log("FETCH RESP:"+response);
      return response.json();}) 
    .then((responseData) => { 
      // do a sanity check on response
      if (Array.isArray(responseData.students)) {
        this.setState({ 
          students: responseData.students,
        });
      } else {
        toast.error("Fetch failed.", {
          position: toast.POSITION.BOTTOM_LEFT
        });
      }        
    })
    .catch(err => {
      toast.error("Fetch failed.", {
          position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err); 
    })
  }

  // Drop Student 
  onDelClick = (student_id) => {
    if (window.confirm('Are you sure you want to drop the student?')) {
      const token = Cookies.get('XSRF-TOKEN');
      
      fetch(`${SERVER_URL}/student/${student_id}`,
        {
          method: 'DELETE',
          headers: { 'X-XSRF-TOKEN': token }
        })
    .then(res => {
        if (res.ok) {
          toast.success("Student successfully dropped", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          this.fetchStudents();
        } else {
          toast.error("Student drop failed", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          console.error('Delete http status =' + res.status);
    }})
      .catch(err => {
        toast.error("Student drop failed", {
              position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err);
      }) 
    } 
  }

  // Add student
  addStudent = (student) => {
    const token = Cookies.get('XSRF-TOKEN');
    this.setState(student);
    fetch(`${SERVER_URL}/student`,
      { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json',
                   'X-XSRF-TOKEN': token  }, 
        body: JSON.stringify(student)
      })
    .then(res => {
        if (res.ok) {
          toast.success("Student successfully added", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          this.fetchStudent();
        } else {
          toast.error("Error when adding", {
              position: toast.POSITION.BOTTOM_LEFT
          });
          console.error('Post http status =' + res.status);
        }})
    .catch(err => {
      toast.error("Error when adding", {
            position: toast.POSITION.BOTTOM_LEFT
        });
        console.error(err);
    })
  } 

  render() {
     const columns = [
      { field: 'name', headerName: 'Name', width: 400 },
      { field: 'email', headerName: 'Email', width: 125 },
      { field: 'statusCode', headerName: 'StatusCode', width: 200 },
      {
        field: 'student_id',
        headerName: '  ',
        sortable: false,
        width: 200,
        renderCell: (params) => (
            <Button
              variant="contained"
              color="secondary"
              size="small"
              style={{ marginLeft: 16 }} 
              onClick={()=>{this.onDelClick(params.value)}}
            >
              Drop
            </Button>
        )
      }
      ];
  
  return(
      <div>
          <AppBar position="static" color="default">
            <Toolbar>
               <Typography variant="h6" color="inherit">
                  { 'Student ' + this.props.location.email}
                </Typography>
            </Toolbar>
          </AppBar>
          <div className="App">
            <div style={{width:'100%'}}>
                For DEBUG:  display state.
                {JSON.stringify(this.state)}
            </div>
            <Grid container>
              <Grid item>
			    <ButtonGroup>
                  <AddStudent addStudent={this.addStudent}  />
				</ButtonGroup>
              </Grid>
              {/* <TextField
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
                </TextField> */}
            </Grid>
            {/* <div style={{ height: 400, width: '100%' }}>
              <DataGrid rows={this.state.courses} columns={columns} />
            </div> */}
            <ToastContainer autoClose={1500} />   
          </div>
      </div>
      ); 
  }
}

export default StudentList;