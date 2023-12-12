const localhost = `https://mernapi-production.up.railway.app`

document.addEventListener('DOMContentLoaded', function () {
    const createStudentForm = document.getElementById('createStudentForm');
    const studentsTableBody = document.getElementById('studentsTableBody');

    // Function to fetch and display students
    function fetchStudents() {
        fetch(`${localhost}/api/user/students`)
            .then(response => response.json())
            .then(students => {
                studentsTableBody.innerHTML = ''; // Clear existing data
                students.forEach(student => {
                    studentsTableBody.innerHTML += `
                        <tr>
                            <td>${student._id}</td>
                            <td>${student.name}</td>
                            <td>${student.age}</td>
                            <td>${student.grade}</td>
                            <td>
                                <button class="btn btn-warning" onclick="editStudent('${student._id}')">Edit</button>
                                <button class="btn btn-danger" onclick="deleteStudent('${student._id}')">Delete</button>
                            </td>
                        </tr>
                    `;
                });
            })
            .catch(error => console.error('Error fetching students:', error));
    }

    // Event listener for form submission (create student)
    createStudentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const grade = document.getElementById('grade').value;

        fetch(`${localhost}/api/user/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, age, grade }),
        })
            .then(response => response.json())
            .then(student => {
                // Clear form fields
                createStudentForm.reset();
                // Fetch and display updated list of students
                fetchStudents();
            })
            .catch(error => console.error('Error creating student:', error));
    });

    // Function to handle student deletion
    window.deleteStudent = function (studentId) {
        if (confirm('Are you sure you want to delete this student?')) {
            fetch(`${localhost}/api/user/students/${studentId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(response => {
                    // Fetch and display updated list of students
                    fetchStudents();
                })
                .catch(error => console.error('Error deleting student:', error));
        }
    };

    // Initial fetch and display of students
    fetchStudents();


    window.editStudent = function (studentId) {
        // Fetch student details
        fetch(`${localhost}/api/user/students/${studentId}`)
            .then(response => response.json())
            .then(student => {
                // Fill the edit modal form with student details
                document.getElementById('editStudentId').value = student._id;
                document.getElementById('editName').value = student.name;
                document.getElementById('editAge').value = student.age;
                document.getElementById('editGrade').value = student.grade;

                // Show the edit modal
                const editStudentModal = new bootstrap.Modal(document.getElementById('editStudentModal'));
                editStudentModal.show();
            })
            .catch(error => console.error('Error fetching student details for edit:', error));
    };

    // Event listener for form submission (edit student)
    document.getElementById('editStudentForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const studentId = document.getElementById('editStudentId').value;
        const name = document.getElementById('editName').value;
        const age = document.getElementById('editAge').value;
        const grade = document.getElementById('editGrade').value;

        fetch(`${localhost}/api/user/students/${studentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, age, grade }),
        })
            .then(response => response.json())
            .then(updatedStudent => {
                // Hide the edit modal
                const editStudentModal = new bootstrap.Modal(document.getElementById('editStudentModal'));
                editStudentModal.hide();
                
                // Fetch and display updated list of students
                fetchStudents();
            })
            .catch(error => console.error('Error updating student:', error));
    });
});
