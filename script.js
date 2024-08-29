document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('studentForm');
    const studentsTable = document.getElementById('studentsTable');

    // Load students from localStorage on page load
    loadStudents();

    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve input values and trim extra spaces
        const studentName = document.getElementById('studentName').value.trim();
        const studentID = document.getElementById('studentID').value.trim();
        const email = document.getElementById('email').value.trim();
        const contact = document.getElementById('contact').value.trim();

        // Validate the input values
        if (validateForm(studentName, studentID, email, contact)) {
            const student = { studentName, studentID, email, contact };
            addStudent(student);
            saveStudent(student);
            studentForm.reset();
        }
    });

    // Validate the form inputs
    function validateForm(studentName, studentID, email, contact) {
        // Check if any field is empty
        if (studentName === "" || studentID === "" || email === "" || contact === "") {
            alert('Please fill in all fields');
            return false;
        }
        // Validate that studentID and contact are numeric
        if (isNaN(studentID) || isNaN(contact)) {
            alert('Student ID and Contact No. should be numbers');
            return false;
        }
        // Validate email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address');
            return false;
        }
        // Validate that studentName contains only letters
        const namePattern = /^[A-Za-z\s]+$/;
        if (!namePattern.test(studentName)) {
            alert('Student Name should contain only letters');
            return false;
        }
        return true;
    }

    // Add student to the table
    function addStudent(student) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${student.studentName}</td>
            <td>${student.studentID}</td>
            <td>${student.email}</td>
            <td>${student.contact}</td>
            <td class="actions">
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </td>
        `;

        // Add event listeners for edit and delete buttons
        row.querySelector('.edit').addEventListener('click', () => editStudent(row, student));
        row.querySelector('.delete').addEventListener('click', () => deleteStudent(row, student.studentID));

        studentsTable.appendChild(row);
    }

    // Edit student
    function editStudent(row, student) {
        // Populate the form with student data for editing
        document.getElementById('studentName').value = student.studentName;
        document.getElementById('studentID').value = student.studentID;
        document.getElementById('email').value = student.email;
        document.getElementById('contact').value = student.contact;

        // Remove the old entry before adding the edited one
        deleteStudent(row, student.studentID);
    }

    // Delete student
    function deleteStudent(row, studentID) {
        studentsTable.removeChild(row);
        removeStudentFromStorage(studentID);
    }

    // Save student to localStorage
    function saveStudent(student) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students.push(student);
        localStorage.setItem('students', JSON.stringify(students));
    }

    // Remove student from localStorage
    function removeStudentFromStorage(studentID) {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students = students.filter(student => student.studentID !== studentID);
        localStorage.setItem('students', JSON.stringify(students));
    }

    // Load students from localStorage and display them
    function loadStudents() {
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students.forEach(student => addStudent(student));
    }
});
