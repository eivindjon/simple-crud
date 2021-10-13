import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Table, Container, Button, Row, Col } from "react-bootstrap";
import LogCustomModal from "./LogCustomModal";


function MainTable() {
  const [studentList, setStudentList] = useState([]);
  //const [absenceList, setAbsenceList] = useState([]);

  // Gets students from database on load (using useEffect)
  function getStudents() {
    Axios.get(`http://localhost:3001/getstudents`).then((res) => {
      const students = res.data;
      setStudentList(students);
    });
  }
  // Making the request to get students from db only ONCE. When render is complete. Instead of ComponentDidMount();
  useEffect(() => {
    getStudents();
    // eslint-disable-next-line
  }, []);

  // poster dobbelt når man refresher osv.. Vet ikke helt hva som skjer her. Tror jeg må fikse noe med .then funksjonen. Legge inn en if res = 200 ->all good eller no.
  function addToList(studentId) {
    const absentStudent = { id: studentId };
    Axios.post(`http://localhost:3001/post_absent`, absentStudent).then(
      (res) => {
        if (res.status === 200) {
          console.log("Absence logged", studentId);
        } else if (res.status === 400) {
          console.log("No good status");
        }
      }
    );
  }

  function handleClick(event) {
    addToList(event.target.id);
    //Make this use state and if disabled === true, then remove it from the list, else add to the list again.
    event.target.disabled = true;
  }
  return (
    <>
    
      <Container>
      <h1 className="text-center">Elever i klasse 9E</h1>
        <Row className="justify-content-md-center">
          <Col xs={8}>
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Fornavn</th>
              <th>Etternavn</th>
              <th>Valg</th>
            </tr>
          </thead>
          <tbody>
            {studentList.map((students) => {
              return (
                <tr key={students.id}>
                  <td>{students.id}</td>
                  <td>{students.fornavn}</td>
                  <td>{students.etternavn}</td>
                  <td>
                    <Button
                      id={students.id}
                      onClick={handleClick}
                      disabled={false}
                      size="sm"
                      
                    >
                      Borte!
                    </Button>
                    <Button size="sm" id="sefravær" href={`UserStats/${students.id}`}>Se Fravær</Button>
                    <LogCustomModal userid={students.id}/>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        </Col>
        </Row>
      </Container>
    </>
  );
}

export default MainTable;
